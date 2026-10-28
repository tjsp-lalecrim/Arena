/*:
 * @plugindesc v0.2.0 Loot automático por inimigo e resumo único após vitória.
 * @author Codex
 * @help Após MV_LootRules, Arena_Inventory e Arena_Persistence. Config: ArenaLoot.json.
 * EXP nativa preservada; ouro/drops nativos substituídos, nunca somados.
 * ArenaLoot.snapshot/collectPending/recoverSource/startLab. Sem plugins externos.
 */
var ArenaLoot;
(function(){
    'use strict';
    if(!window.MVLootRules||!window.ArenaInventory||!window.ArenaPersistence)throw Error('Arena_Loot: dependências ausentes.');
    DataManager._databaseFiles.push({name:'$arenaLoot',src:'ArenaLoot.json'});
    MVStateStore.register('arenaLoot',1,{sequence:0,receipts:{},pending:[]});
    function state(){return MVStateStore.read('arenaLoot');}
    function save(s){MVStateStore.replace('arenaLoot',s);}
    function object(row){return ArenaInventory.resolve(row);}
    function atomic(fn){
        var p=$gameParty,backup={items:Object.assign({},p._items),weapons:Object.assign({},p._weapons),armors:Object.assign({},p._armors),gold:p._gold,root:JsonEx.makeDeepCopy($gameSystem._persistentState),actors:$gameParty.allMembers().map(function(a){return [a,JsonEx.makeDeepCopy(a)];}),texts:$gameMessage._texts.slice()};
        try{return fn();}catch(error){p._items=backup.items;p._weapons=backup.weapons;p._armors=backup.armors;p._gold=backup.gold;$gameSystem._persistentState=backup.root;backup.actors.forEach(function(pair){Object.keys(pair[0]).forEach(function(k){delete pair[0][k];});Object.assign(pair[0],pair[1]);});$gameMessage._texts=backup.texts;throw error;}
    }
    function deliver(row){
        var accepted;if(row.kind==='gold'){var previousGold=$gameParty.gold();accepted=Math.min(row.quantity,$gameParty.maxGold()-previousGold);$gameParty.gainGold(accepted);if($gameParty.gold()!==previousGold+accepted)throw Error('Arena loot: ouro incompleto.');}
        else{var item=object(row);if(!item)throw Error('Arena loot: item ausente.');accepted=Math.min(row.quantity,$gameParty.maxItems(item)-$gameParty.numItems(item));var old=$gameParty.numItems(item);$gameParty.gainItem(item,accepted,false);if($gameParty.numItems(item)!==old+accepted)throw Error('Arena loot: concessão incompleta.');}
        return accepted;
    }
    function collectPending(){return atomic(function(){var s=state(),waiting=[],received=[];s.pending.forEach(function(row){var accepted=deliver(row);if(accepted)received.push(Object.assign({},row,{quantity:accepted}));if(accepted<row.quantity)waiting.push(Object.assign({},row,{quantity:row.quantity-accepted}));});s.pending=waiting;save(s);return received;});}
    function settle(token,origins,exp){return atomic(function(){
        var s=state();if(s.receipts[token])return s.receipts[token];var received=[],waiting=[],sources=[];
        origins.forEach(function(origin){origin.rows.forEach(function(row){var r=Object.assign({},row,{origin:origin.origin}),accepted=deliver(r);if(accepted)received.push(Object.assign({},r,{quantity:accepted}));if(accepted<r.quantity)waiting.push(Object.assign({},r,{quantity:r.quantity-accepted}));});
            origin.questSources.forEach(function(id){var status=ArenaPersistence.sourceStatus(id);if(!status.active||!status.missing)return;var result=ArenaPersistence.claimSource(id);sources.push({origin:origin.origin,sourceId:id,result:result});if(result==='granted')received.push({kind:'item',id:status.itemId,quantity:status.missing,category:'quest',rare:false,origin:origin.origin});});
        });
        $gameParty.allMembers().forEach(function(a){a.gainExp(exp);});
        var record={exp:exp,origins:origins,received:received,pending:waiting,sources:sources};s.receipts[token]=record;s.pending=s.pending.concat(waiting);save(s);return record;
    });}
    function validate(){
        function chance(n){if(typeof n!=='number'||n<0||n>1)throw Error('Arena loot: chance inválida.');}
        function entry(e,kind){if(!Number.isInteger(e.id)||!object(e)||kind&&e.kind!==kind||e.weight!==undefined&&(!(e.weight>0)||!Number.isFinite(e.weight)))throw Error('Arena loot: referência/peso inválido.');}
        function rule(r,kind){chance(r.chance);if(!Number.isInteger(r.min)||!Number.isInteger(r.max)||r.min<1||r.max<r.min||!Array.isArray(r.entries)||r.chance>0&&!r.entries.length)throw Error('Arena loot: faixa/lista inválida.');r.entries.forEach(function(e){entry(e,kind);if(kind==='item'&&ArenaInventory.important(object(e)))throw Error('Arena loot: importante fora de fonte de quest.');});}
        Object.keys($arenaLoot.enemies).forEach(function(id){if(!$dataEnemies[id])throw Error('Arena loot: inimigo ausente.');var t=$arenaLoot.enemies[id];chance(t.gold.chance);if(!Number.isInteger(t.gold.min)||!Number.isInteger(t.gold.max)||t.gold.min<0||t.gold.max<t.gold.min)throw Error('Arena loot: ouro inválido.');chance(t.gearChance);rule(t.potions,'item');rule(t.equipment,'armor');rule(t.weapons,'weapon');chance(t.rare.chance);rule(t.rare.items,'item');Object.keys(t.rare.variants).forEach(function(k){var a=k.split(':'),v=t.rare.variants[k],base=ArenaInventory.resolve({kind:a[0],id:Number(a[1])});entry(v,a[0]);if(!base||object(v).etypeId!==base.etypeId||object(v).wtypeId!==base.wtypeId||!object(v).meta.ArenaRare)throw Error('Arena loot: variante rara incompatível.');});t.questSources.forEach(function(sourceId){if(sourceId!=='MQ01.ruby-key')throw Error('Arena loot: fonte não cadastrada.');});});
    }
    var database=DataManager.isDatabaseLoaded,checked=false;
    DataManager.isDatabaseLoaded=function(){if(!database.apply(this,arguments))return false;if(!checked){validate();checked=true;}return true;};
    ArenaLoot={snapshot:state,collectPending:collectPending,recoverSource:function(id){return ArenaPersistence.claimSource(id);},startLab:function(){ArenaBattle.startLab();$gameTemp._arenaLootLab=true;},validate:validate,
        claimContainer:function(id,table,minimumGold){
            if(typeof id!=='string'||!/^[a-zA-Z0-9_.-]+$/.test(id))throw Error('Arena loot: fonte inválida.');
            var token='container/'+id,existing=state().receipts[token];if(existing)return existing;
            var roll=MVLootRules.roll(table);
            // Container-only floor. Enemy rolls remain allowed to be empty.
            if(minimumGold!==undefined&&(!Number.isInteger(minimumGold)||minimumGold<1))throw Error('Arena loot: mínimo de tesouro inválido.');
            if(minimumGold&&!roll.rows.some(function(r){return r.quantity>0;}))roll.rows=[{kind:'gold',quantity:minimumGold,category:'gold',rare:false}];
            return settle(token,[{origin:id,rows:roll.rows,candidates:roll.candidates,questSources:[]}],0);
        }
    };
    var setup=BattleManager.setup;
    BattleManager.setup=function(){setup.apply(this,arguments);var s=state();s.sequence+=1;save(s);this._arenaLootToken='battle/'+s.sequence;this._arenaLootPlan=null;this._arenaLootResult=null;this._arenaLootDisplay=null;this._arenaVictoryHandled=false;};
    BattleManager.makeRewards=function(){
        if(!this._arenaVictory)return false;
        if(!this._arenaLootPlan){this._arenaLootPlan=$gameTroop.deadMembers().filter(function(e){return e.isAppeared();}).map(function(e){var table=$arenaLoot.enemies[String(e.enemyId())];if(!table)throw Error('Arena loot: tabela ausente para '+e.enemyId());var roll=MVLootRules.roll(table);return {origin:'enemy/'+e.index(),enemyId:e.enemyId(),rows:roll.rows,candidates:roll.candidates,questSources:table.questSources.slice()};});}
        this._rewards={gold:0,items:[],exp:$gameTroop.expTotal()};
    };
    BattleManager.displayRewards=function(){}; // Summary follows native victory/level messages after receipt.
    BattleManager.gainRewards=function(){if(!this._arenaVictory)return false;this._arenaLootResult=settle(this._arenaLootToken,this._arenaLootPlan,this._rewards.exp);this._arenaLootDisplay=this._arenaLootResult;return true;};
    // Prevent old/native entry points from granting the replaced gold/items again.
    var gold=BattleManager.gainGold,drops=BattleManager.gainDropItems;
    BattleManager.gainGold=function(){if(!this._arenaLootToken)return gold.apply(this,arguments);};
    BattleManager.gainDropItems=function(){if(!this._arenaLootToken)return drops.apply(this,arguments);};
    var victory=BattleManager.processVictory;
    BattleManager.processVictory=function(){if(this._arenaVictoryHandled||!$gameTroop.isAllDead()||$gameParty.isAllDead())return;this._arenaVictory=true;try{victory.apply(this,arguments);this._arenaVictoryHandled=true;}finally{this._arenaVictory=false;}};
    var busy=BattleManager.isBusy;
    BattleManager.isBusy=function(){return !!this._arenaLootDisplay||busy.apply(this,arguments);};
    function aggregate(record){var result=[],keys={};record.received.concat(record.pending.map(function(r){return Object.assign({},r,{waiting:true});})).forEach(function(r){var key=[r.kind,r.id,r.rare,r.waiting].join(':');if(keys[key]!==undefined)result[keys[key]].quantity+=r.quantity;else{keys[key]=result.length;result.push(Object.assign({},r));}});return result;}
    function Summary(){this.initialize.apply(this,arguments);}
    Summary.prototype=Object.create(Window_Selectable.prototype);Summary.prototype.constructor=Summary;
    Summary.prototype.standardPadding=function(){return 16;};Summary.prototype.itemHeight=function(){return 44;};Summary.prototype.maxItems=function(){return Math.max(1,(this._rows||[]).length);};Summary.prototype.maxPageRows=function(){return Math.floor((this.contentsHeight()-122)/this.itemHeight());};
    Summary.prototype.itemRect=function(n){var r=Window_Selectable.prototype.itemRect.call(this,n);r.y+=90;return r;};
    Summary.prototype.refresh=function(){this.contents.clear();if(!this._rows)return;this.contents.fontSize=23;this.resetTextColor();this.contents.drawText('Recompensas · '+this._exp+' EXP',0,0,this.contentsWidth(),29);this.drawAllItems();this.updateHelp();this.changeTextColor('#b6bcad');this.contents.fontSize=16;this.contents.drawText('Enter / toque: continuar · setas: detalhes',0,this.contentsHeight()-27,this.contentsWidth(),25,'center');};
    Summary.prototype.updateHelp=function(){if(!this._rows)return;var r=this._rows[this.index()],item=r&&object(r),text=r?(r.waiting?'Reserva salva: entrega automática quando houver espaço.':item?item.description:'Moedas adicionadas ao ouro do grupo.'):'Nenhuma recompensa de loot nesta batalha.';this.contents.clearRect(0,34,this.contentsWidth(),50);this.contents.fontSize=16;this.changeTextColor('#c4cabd');var words=text.split(/\s+/),line='',rows=[];words.forEach(function(word){var next=line?line+' '+word:word;if(this.textWidth(next)>this.contentsWidth()&&line){rows.push(line);line=word;}else line=next;},this);if(line)rows.push(line);rows.slice(0,2).forEach(function(s,i){this.contents.drawText(s,0,34+i*23,this.contentsWidth(),23);},this);this.resetTextColor();};
    Summary.prototype.drawItem=function(n){var r=this.itemRect(n),row=this._rows[n];this.contents.fillRect(r.x+2,r.y,r.width-4,42,'rgba(18,39,41,.85)');this.contents.fontSize=19;this.resetTextColor();if(!row){this.contents.drawText('Sem recompensas',r.x+12,r.y,r.width-24,40);return;}var item=object(row);if(item)ArenaInventory.drawItemIcon(this,item,r.x+8,r.y+6,28);else{this.changeTextColor('#d4bc72');this.contents.drawText('G',r.x+8,r.y,28,40,'center');this.resetTextColor();}var name=item?item.name:'Ouro';if(row.waiting)name='Reserva · '+name;this.contents.drawText(name,r.x+48,r.y,r.width-135,40);this.contents.drawText('×'+row.quantity,r.x+r.width-85,r.y,75,40,'right');};
    Summary.prototype.onTouch=function(triggered){if(triggered)this.processOk();};
    var create=Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows=function(){create.apply(this,arguments);this._arenaLootWindow=new Summary(88,96,640,430);ArenaBattleUI.theme(this._arenaLootWindow);this._arenaLootWindow.hide();this._arenaLootWindow.deactivate();var close=function(){this._arenaLootWindow.hide();this._arenaLootWindow.deactivate();BattleManager._arenaLootDisplay=null;Input.update();TouchInput.update();}.bind(this);this._arenaLootWindow.setHandler('ok',close);this._arenaLootWindow.setHandler('cancel',close);this.addWindow(this._arenaLootWindow);};
    var update=Scene_Battle.prototype.update;
    Scene_Battle.prototype.update=function(){update.apply(this,arguments);var result=BattleManager._arenaLootDisplay,w=this._arenaLootWindow;if(result&&w&&!w.visible&&!$gameMessage.isBusy()&&this._messageWindow.isClosed()&&!this._logWindow.isBusy()){w._rows=aggregate(result);w._exp=result.exp;w.refresh();w.show();w.activate();w.select(0);}};
    var start=Scene_Map.prototype.start;
    Scene_Map.prototype.start=function(){start.apply(this,arguments);var received=collectPending();if(received.length)$gameMessage.add('Recompensas reservadas entregues ao inventário.');if($gameTemp._arenaLootLab){$gameTemp._arenaLootLab=false;ArenaBattle.prepare();$gameMessage.add('Loot técnico: goblin em (6,8), trio em (13,8). Tabelas reais; sorteios aleatórios.');}};
    var title=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){title.apply(this,arguments);this.addCommand('Loot técnico','arenaLoot');};
    var titleCreate=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){titleCreate.apply(this,arguments);this._commandWindow.setHandler('arenaLoot',function(){ArenaLoot.startLab();});};
})();
