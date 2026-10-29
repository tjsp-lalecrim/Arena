/*:
 * @plugindesc v0.2.0 Pontos persistentes, acesso pelo inventário e laboratório isolado.
 * @author Codex
 * @help Após MV_AttributePoints, MV_StateStore, Arena_Resources, Arena_Inventory e Arena_BalanceLab.
 * Configuração: data/ArenaAttributes.json. Namespace interno arenaAttributes v1.
 * API ArenaAttributes: snapshot(), preview(allocation), apply(preview), canOpen(), open().
 * IDs: ATQ2 DEF3 MAT4 MDF5 AGI6 SOR7. Sem distribuição em batalha ou E05.
 * Título > Laboratório de atributos (sem saves). Guardar/carregar somente em memória.
 * Sem arquivos do motor alterados. doc/plugins/Arena_Attributes.md.
 */
var ArenaAttributes;
(function() {
    'use strict';
    DataManager._databaseFiles.push({name:'$arenaAttributes',src:'ArenaAttributes.json'});
    var loaded=DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded=function() {
        if(!loaded.apply(this,arguments))return false;
        var c=$arenaAttributes;
        if(!c || c.schemaVersion!==1 || !$dataActors[c.actorId] || !Number.isInteger(c.firstLevel) || c.firstLevel<2 ||
            !Number.isSafeInteger(c.pointsPerLevel) || c.pointsPerLevel<1 || !Number.isSafeInteger(c.valuePerPoint) || c.valuePerPoint<1 ||
            JSON.stringify(c.attributes)!=='[2,3,4,5,6,7]')throw Error('Arena: configuração de atributos inválida.');
        return true;
    };
    MVStateStore.register('arenaAttributes',1,MVAttributePoints.defaults());
    function actor(){return $gameActors.actor($arenaAttributes.actorId);}
    function e05(){return typeof ArenaBalanceLab!=='undefined'&&ArenaBalanceLab&&ArenaBalanceLab.active();}
    function owned(a){return $gameSystem&&typeof $arenaAttributes!=='undefined'&&$arenaAttributes&&a.actorId()===$arenaAttributes.actorId;}
    function read(){var s=MVStateStore.read('arenaAttributes');MVAttributePoints.validate(s);return s;}
    function ensure(){
        var s=read();if(e05())return s;
        var next=MVAttributePoints.grant(s,actor().level,$arenaAttributes);
        if(next.revision!==s.revision)MVStateStore.replace('arenaAttributes',next);
        return next;
    }
    var plus=Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus=function(id){
        return plus.apply(this,arguments)+(owned(this)&&id>=2&&id<=7&&!e05()?(read().increases[String(id)]||0):0);
    };
    var up=Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp=function(){if(owned(this))ensure();up.apply(this,arguments);if(owned(this))ensure();};
    var extract=DataManager.extractSaveContents;
    DataManager.extractSaveContents=function(contents){extract.apply(this,arguments);if($gameActors._data[$arenaAttributes.actorId])ensure();};
    var names=['ATQ','DEF','MAT','MDF','AGI','SOR'];
    function rows(s,a){return $arenaAttributes.attributes.map(function(id,i){
        var equipment=a.equips().reduce(function(n,e){return n+(e?e.params[id]:0);},0);
        return {id:id,name:names[i],base:a.paramBase(id),spent:s.spent[id]||0,increase:s.increases[id]||0,equipment:equipment,
            otherAdditive:a.paramPlus(id)-equipment-(s.increases[id]||0),rate:a.paramRate(id)*a.paramBuffRate(id),total:a.param(id)};
    });}
    ArenaAttributes={
        snapshot:function(){var s=ensure();return {level:actor().level,highestLevel:s.highestLevel,granted:Object.keys(s.grants).reduce(function(n,k){return n+s.grants[k];},0),
            available:MVAttributePoints.balance(s),revision:s.revision,rows:rows(s,actor()),excluded:e05()};},
        preview:function(allocation){
            if($gameParty.inBattle()||e05())return {ok:false,reason:'Indisponível em batalha ou no E05.'};
            var s=ensure(),next=MVAttributePoints.allocate(s,allocation,$arenaAttributes);
            if(!next)return {ok:false,reason:'Distribuição inválida ou saldo insuficiente.'};
            var a=actor(),clone=JsonEx.makeDeepCopy(a),original=clone.paramPlus;
            clone.paramPlus=function(id){return original.call(this,id)+(next.increases[id]||0)-(s.increases[id]||0);};
            return {ok:true,revision:s.revision,config:JSON.stringify($arenaAttributes),allocation:JSON.parse(JSON.stringify(allocation)),
                rows:rows(s,a).map(function(r){r.after=clone.param(r.id);return r;}),available:MVAttributePoints.balance(next)};
        },
        apply:function(plan){
            if(!plan||!plan.ok||$gameParty.inBattle()||e05())return false;
            var s=ensure();if(plan.revision!==s.revision||plan.config!==JSON.stringify($arenaAttributes))return false;
            var next=MVAttributePoints.allocate(s,plan.allocation,$arenaAttributes);if(!next)return false;
            MVStateStore.replace('arenaAttributes',next);return true;
        }
    };
    // Disposable laboratory. No normal slot, index, backup or serialization path allowed.
    var session=null;
    function active(){return !!(session&&session.system===$gameSystem);}
    function clear(){if(session)DataManager._lastAccessedId=session.previousSlot;session=null;}
    ['setupNewGame','extractSaveContents'].forEach(function(key){var f=DataManager[key];DataManager[key]=function(){clear();return f.apply(this,arguments);};});
    ['saveGame','saveGameWithoutRescue','saveGlobalInfo'].forEach(function(key){var f=DataManager[key];DataManager[key]=function(){if(active())return false;return f.apply(this,arguments);};});
    var contents=DataManager.makeSaveContents;
    DataManager.makeSaveContents=function(){if(active())throw Error('Atributos: laboratório sem saves normais.');return contents.apply(this,arguments);};
    var saveEnabled=Game_System.prototype.isSaveEnabled;
    Game_System.prototype.isSaveEnabled=function(){return !active()&&saveEnabled.apply(this,arguments);};
    ArenaAttributes.labActive=active;
    ArenaAttributes.startLab=function(){
        if($gameParty&&$gameParty.inBattle())return false;
        var previous=active()?session.previousSlot:DataManager._lastAccessedId;
        DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Atributos · piloto',raceId:'breton',genderId:'female'});
        $gamePlayer.clearTransferInfo();session={system:$gameSystem,previousSlot:previous,memory:null};
        actor().setHp(35);actor().setMp(10);ArenaPersistence.setResource('vigor',20,ArenaResources.snapshot().vigor.maximum);
        SceneManager.clearStack();SceneManager.goto(Laboratory);return true;
    };
    ArenaAttributes.memorySave=function(){if(!active()||$gameParty.inBattle())return false;session.memory=JsonEx.stringify(contents.call(DataManager));return true;};
    ArenaAttributes.memoryLoad=function(){
        if(!active()||!session.memory||$gameParty.inBattle())return false;
        var saved=session;DataManager.createGameObjects();DataManager.extractSaveContents(JsonEx.parse(saved.memory));
        session={system:$gameSystem,previousSlot:saved.previousSlot,memory:saved.memory};return true;
    };
    ArenaAttributes.leaveLab=function(){clear();DataManager.createGameObjects();SceneManager.goto(Scene_Title);};
    var titleStart=Scene_Title.prototype.start;Scene_Title.prototype.start=function(){clear();return titleStart.apply(this,arguments);};
    function Commands(){this.initialize.apply(this,arguments);}
    Commands.prototype=Object.create(Window_Command.prototype);Commands.prototype.constructor=Commands;
    Commands.prototype.windowWidth=function(){return Graphics.boxWidth-32;};
    Commands.prototype.standardFontSize=function(){return 20;};
    Commands.prototype.maxCols=function(){return 2;};
    Commands.prototype.makeCommandList=function(){
        var s=ArenaAttributes.snapshot();names.forEach(function(name,i){this.addCommand(name+' +'+$arenaAttributes.valuePerPoint,'point',s.available>0,i+2);},this);
        this.addCommand('Ganhar 1 nível','level1');this.addCommand('Ganhar 3 níveis','level3');
        this.addCommand('Escolha Vida/Mana/Vigor','resources');this.addCommand('Reiniciar sessão técnica','reset');
        this.addCommand('Guardar em memória','store');this.addCommand('Carregar da memória','load',!!session.memory);
        this.addCommand('Inventário / acesso normal','inventory');
        this.addCommand('Voltar ao título','exit');
    };
    Commands.prototype.numVisibleRows=function(){return 7;};
    function Confirm(){this.initialize.apply(this,arguments);}
    Confirm.prototype=Object.create(Window_Command.prototype);Confirm.prototype.constructor=Confirm;
    Confirm.prototype.windowWidth=function(){return 320;};
    Confirm.prototype.standardFontSize=function(){return 22;};
    Confirm.prototype.makeCommandList=function(){this.addCommand('Confirmar distribuição','yes');this.addCommand('Cancelar prévia','cancel');};
    function Laboratory(){this.initialize.apply(this,arguments);}
    Laboratory.prototype=Object.create(Scene_MenuBase.prototype);Laboratory.prototype.constructor=Laboratory;
    Laboratory.prototype.createBackground=function(){
        this._backgroundSprite=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));
        this._backgroundSprite.bitmap.fillAll('#101216');this.addChild(this._backgroundSprite);
    };
    Laboratory.prototype.create=function(){
        Scene_MenuBase.prototype.create.call(this);
        this._info=new Window_Base(16,8,Graphics.boxWidth-32,300);this.addWindow(this._info);
        this._choices=new Commands(16,312);this._choices.contents.fontSize=20;this.addWindow(this._choices);
        var w=this._choices,self=this;
        w.setHandler('point',function(){var a={};a[w.currentExt()]=1;self._plan=ArenaAttributes.preview(a);w.deactivate();self._confirm.show();self._confirm.select(0);self._confirm.deactivate();self._armed=false;self.draw();});
        [1,3].forEach(function(n){w.setHandler('level'+n,function(){actor().changeLevel(actor().level+n,false);self.refresh();});});
        w.setHandler('resources',function(){ArenaResources.open();});w.setHandler('reset',ArenaAttributes.startLab);
        w.setHandler('store',function(){ArenaAttributes.memorySave();self.refresh();});w.setHandler('load',function(){ArenaAttributes.memoryLoad();self.refresh();});
        w.setHandler('inventory',function(){ArenaInventory.open('inventory');});
        w.setHandler('exit',ArenaAttributes.leaveLab);w.setHandler('cancel',ArenaAttributes.leaveLab);
        this._confirm=new Confirm((Graphics.boxWidth-320)/2,340);this._confirm.hide();this._confirm.deactivate();this.addWindow(this._confirm);
        this._confirm.setHandler('yes',function(){ArenaAttributes.apply(self._plan);self.review();});this._confirm.setHandler('cancel',this.review.bind(this));this.draw();
        this._choices.deactivate();this._armed=false;
    };
    Laboratory.prototype.start=function(){Scene_MenuBase.prototype.start.call(this);this.refresh();};
    Laboratory.prototype.draw=function(){
        var s=ArenaAttributes.snapshot(),w=this._info,b=w.contents;b.clear();b.fontSize=20;
        var r=ArenaResources.snapshot();w.drawText('Atributos — laboratório sem saves · nível '+s.level+' · saldo '+s.available,0,0,w.contentsWidth());
        w.drawText('Vida '+r.hp.current+'/'+r.hp.maximum+' · Mana '+r.mp.current+'/'+r.mp.maximum+' · Vigor '+r.vigor.current+'/'+r.vigor.maximum,0,28,w.contentsWidth());
        drawTable(w,this._plan&&this._plan.ok?this._plan.rows:s.rows);
    };
    function drawTable(w,items){
        w.drawText('Atributo     Base     Pontos     Equip.     Outros     Total / prévia',0,58,w.contentsWidth());
        items.forEach(function(row,i){
            [row.name,row.base,'+'+row.increase,'+'+row.equipment,row.otherAdditive,row.total+(row.after===undefined?'':' → '+row.after)].forEach(function(v,j){w.drawText(String(v),[0,118,230,342,454,566][j],90+i*26,j===5?180:108);});
        });
    }
    Laboratory.prototype.refresh=function(armed){
        this._choices.refresh();this._choices.contents.fontSize=20;
        if(armed)this._choices.activate();else{this._choices.deactivate();this._armed=false;}
        this.draw();
    };
    Laboratory.prototype.review=function(){this._plan=null;this._confirm.hide();this._confirm.deactivate();this._choices.deactivate();this._armed=false;this.draw();};
    Laboratory.prototype.update=function(){
        Scene_MenuBase.prototype.update.call(this);
        if(!this._armed&&!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){
            this._armed=true;if(this._confirm.visible)this._confirm.activate();else this.refresh(true);
        }
    };
    // Same primitives/table as the pilot, but only a local draft and normal campaign actions.
    ArenaAttributes.canOpen=function(){return !$gameParty.inBattle()&&!e05()&&ArenaCharacterCreation.isCreated();};
    ArenaAttributes.open=function(){if(!this.canOpen())return false;SceneManager.push(Distribution);return true;};
    function DraftCommands(scene){this._distribution=scene;this.initialize(16,312);}
    DraftCommands.prototype=Object.create(Window_Command.prototype);DraftCommands.prototype.constructor=DraftCommands;
    DraftCommands.prototype.windowWidth=Commands.prototype.windowWidth;
    DraftCommands.prototype.standardFontSize=Commands.prototype.standardFontSize;
    DraftCommands.prototype.standardPadding=function(){return 12;};
    DraftCommands.prototype.itemHeight=function(){return 32;};
    DraftCommands.prototype.maxCols=function(){return 2;};DraftCommands.prototype.numVisibleRows=function(){return 8;};
    DraftCommands.prototype.makeCommandList=function(){
        var scene=this._distribution,left=scene.remaining(),has=scene.count()>0;
        names.forEach(function(name,i){var id=i+2,n=scene._draft[id]||0;
            this.addCommand('+ '+name+' ('+n+')','add',left>0,id);this.addCommand('− '+name,'remove',n>0,id);
        },this);
        this.addCommand('Confirmar conjunto','confirm',has);this.addCommand('Limpar prévia','clear',has);this.addCommand('Voltar sem aplicar','back');
    };
    function Distribution(){this.initialize.apply(this,arguments);}
    Distribution.prototype=Object.create(Scene_MenuBase.prototype);Distribution.prototype.constructor=Distribution;
    Distribution.prototype.createBackground=Laboratory.prototype.createBackground;
    Distribution.prototype.count=function(){return Object.keys(this._draft).reduce(function(n,k){return n+this._draft[k];}.bind(this),0);};
    Distribution.prototype.remaining=function(){return ArenaAttributes.snapshot().available-this.count();};
    Distribution.prototype.create=function(){
        Scene_MenuBase.prototype.create.call(this);this._draft={};this._message='';this._armed=false;this._modal=false;
        this._info=new Window_Base(16,8,Graphics.boxWidth-32,300);this.addWindow(this._info);
        this._choices=new DraftCommands(this);this.addWindow(this._choices);
        this._choices.setHandler('add',this.adjust.bind(this,1));this._choices.setHandler('remove',this.adjust.bind(this,-1));
        this._choices.setHandler('confirm',this.ask.bind(this));this._choices.setHandler('clear',this.clearDraft.bind(this));
        this._choices.setHandler('back',this.leave.bind(this));this._choices.setHandler('cancel',this.leave.bind(this));
        this._confirm=new Confirm((Graphics.boxWidth-320)/2,340);this._confirm.hide();this._confirm.deactivate();this.addWindow(this._confirm);
        this._confirm.setHandler('yes',this.commit.bind(this));this._confirm.setHandler('cancel',this.clearDraft.bind(this));this.refresh();
    };
    Distribution.prototype.start=function(){Scene_MenuBase.prototype.start.call(this);this.refresh();};
    Distribution.prototype.adjust=function(delta){
        var id=this._choices.currentExt(),n=this._draft[id]||0;
        if(delta>0&&this.remaining()>0||delta<0&&n>0){this._draft[id]=n+delta;if(!this._draft[id])delete this._draft[id];}
        this._message='';this.refresh();
    };
    Distribution.prototype.refresh=function(){
        this._choices.refresh();this._choices.deactivate();this._armed=false;
        var s=ArenaAttributes.snapshot(),plan=this.count()?ArenaAttributes.preview(this._draft):null,w=this._info;
        w.contents.clear();w.contents.fontSize=20;
        w.drawText('Distribuição — '+actor().name()+' · nível '+s.level,0,0,w.contentsWidth());
        w.drawText(this._message||('Saldo '+s.available+' · na prévia '+this.count()+' · restante '+this.remaining()),0,28,w.contentsWidth());
        drawTable(w,plan&&plan.ok?plan.rows:s.rows);
    };
    Distribution.prototype.ask=function(){
        this._plan=ArenaAttributes.preview(this._draft);
        if(!this._plan.ok){this._message=this._plan.reason;this.refresh();return;}
        this._modal=true;this._choices.deactivate();this._confirm.show();this._confirm.select(0);this._confirm.deactivate();this._armed=false;
    };
    Distribution.prototype.clearDraft=function(){
        this._draft={};this._plan=null;this._message='';this._modal=false;this._confirm.hide();this._confirm.deactivate();this.refresh();
    };
    Distribution.prototype.commit=function(){
        var ok=ArenaAttributes.apply(this._plan);this.clearDraft();
        if(!ok){this._message='A prévia mudou; revise a distribuição.';this.refresh();}
    };
    var returnToInventory=false;
    Distribution.prototype.leave=function(){this._draft={};returnToInventory=SceneManager._stack[SceneManager._stack.length-1]===Scene_ArenaInventory;this.popScene();};
    Distribution.prototype.update=function(){
        Scene_MenuBase.prototype.update.call(this);
        if(!this._armed&&!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){
            this._armed=true;if(this._modal)this._confirm.activate();else this._choices.activate();
        }
    };
    var inventoryStart=Scene_ArenaInventory.prototype.start;
    Scene_ArenaInventory.prototype.start=function(){
        inventoryStart.apply(this,arguments);if(!returnToInventory)return;returnToInventory=false;this._attributeReturn=true;
        [this._nav,this._itemWindow,this._slots,this._pager].forEach(function(w){w.deactivate();});
    };
    var inventoryUpdate=Scene_ArenaInventory.prototype.update;
    Scene_ArenaInventory.prototype.update=function(){
        if(this._attributeReturn){
            Scene_ItemBase.prototype.update.call(this);
            if(!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){
                this._attributeReturn=false;this._nav.selectSymbol('attributes');this.focus(this._nav);
            }
            return;
        }
        inventoryUpdate.apply(this,arguments);
    };
    var title=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){title.apply(this,arguments);this.addCommand('Laboratório de atributos (sem saves)','arenaAttributeLab');};
    var createTitle=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){createTitle.apply(this,arguments);this._commandWindow.setHandler('arenaAttributeLab',ArenaAttributes.startLab);};
})();
