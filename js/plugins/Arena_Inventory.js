/*:
 * @plugindesc v0.3.1 Inventário, equipamentos, recursos e acesso opcional aos atributos.
 * @author Codex
 * @help Após Arena_BattleUI e MV_EquipmentTransaction. Sem dependências externas.
 * Configuração/IDs: data/ArenaInventory.json. Não altera regras de combate.
 * API ArenaInventory.open/equip/preview/discard/prepareLab/appearance.
 * Arena_Attributes opcional fornece o acesso Atributos na navegação existente.
 * Inventário/equipamentos permanecem nativos; aparência é derivada, não salva.
 */
var ArenaInventory,Scene_ArenaInventory;
(function(){
    'use strict';
    if(!window.ArenaBattleUI||!window.MVEquipmentTransaction)throw Error('Arena_Inventory requer Arena_BattleUI e MV_EquipmentTransaction.');
    DataManager._databaseFiles.push({name:'$arenaInventory',src:'ArenaInventory.json'});
    function config(){return $arenaInventory;}
    function actor(){return $gameActors.actor(config().actorId);}
    function ref(item){return !item?null:{kind:DataManager.isWeapon(item)?'weapon':DataManager.isArmor(item)?'armor':'item',id:item.id};}
    function resolve(r){if(!r||!Number.isInteger(r.id)||r.id<1)return null;return r&&(r.kind==='weapon'?$dataWeapons:r.kind==='armor'?$dataArmors:r.kind==='item'?$dataItems:[])[r.id]||null;}
    function important(i){return !!(DataManager.isItem(i)&&(i.itypeId===2||i.meta.ArenaQuest||i.meta.ArenaUnique));}
    function gear(i){return DataManager.isWeapon(i)||DataManager.isArmor(i);}
    function validate(a,slot,item){
        if(!Number.isInteger(slot)||slot<0||slot>=a.equipSlots().length)return 'Slot inválido.';
        if(item&&(!gear(item)||resolve(ref(item))!==item))return 'Referência inválida.';
        var previous=a.equips()[slot];if(item===previous)return null;
        if(!a.isEquipChangeOk(slot))return 'Este slot está bloqueado.';
        if(item&&(a.equipSlots()[slot]!==item.etypeId||!a.canEquip(item)))return 'Equipamento incompatível com este slot.';
        if(item&&!$gameParty.hasItem(item))return 'Equipamento não está mais no inventário.';
        if(previous&&$gameParty.numItems(previous)>=$gameParty.maxItems(previous))return 'Sem espaço para devolver o equipamento atual.';
        return null;
    }
    function preview(a,slot,item){
        var reason=validate(a,slot,item),copy=JsonEx.makeDeepCopy(a),before=[],after=[];
        if(!reason)copy._equips[slot].setObject(item);
        for(var p=0;p<8;p++){before.push(a.param(p));after.push(reason?a.param(p):copy.param(p));}
        return {ok:!reason,reason:reason,slot:slot,item:ref(item),before:before,after:after,effects:item?item.description+(DataManager.isArmor(item)&&item.etypeId===4&&!config().materials[String(item.id)]?' Visual indisponível; aparência-base será mantida.':''):'Remove a peça e devolve ao inventário.'};
    }
    var nativeChange=Game_Actor.prototype.changeEquip;
    function exchange(a,slot,item){
        if(!validate(a,slot,item)&&a.equips()[slot]===item)return {ok:true,changed:false};
        var previous=a.equips()[slot],newCount=item?$gameParty.numItems(item):0,oldCount=previous?$gameParty.numItems(previous):0;
        return MVEquipmentTransaction.run({
            validate:function(){return validate(a,slot,item);},
            capture:function(){return {equips:JsonEx.makeDeepCopy(a._equips),hp:a._hp,mp:a._mp,tp:a._tp,weapons:Object.assign({},$gameParty._weapons),armors:Object.assign({},$gameParty._armors),state:JsonEx.makeDeepCopy($gameSystem._persistentState)};},
            write:function(){nativeChange.call(a,slot,item);},
            verify:function(){return a.equips()[slot]===item&&(!item||$gameParty.numItems(item)===newCount-1)&&(!previous||$gameParty.numItems(previous)===oldCount+1);},
            restore:function(s){a._equips=s.equips;$gameParty._weapons=s.weapons;$gameParty._armors=s.armors;$gameSystem._persistentState=s.state;a.refresh();a._hp=s.hp;a._mp=s.mp;a._tp=s.tp;}
        });
    }
    Game_Actor.prototype.changeEquip=function(slot,item){return exchange(this,slot,item);};
    ArenaInventory={
        ref:ref,resolve:resolve,important:important,drawItemIcon:icon,
        preview:function(slot,r){return r&&!resolve(r)?{ok:false,reason:'Referência inválida.'}:preview(actor(),slot,resolve(r));},
        equip:function(slot,r){if(r&&!resolve(r))return {ok:false,reason:'Referência inválida.'};return exchange(actor(),slot,resolve(r));},
        discard:function(r,n){var i=resolve(r);if(!i||important(i)||!Number.isInteger(n)||n<1||$gameParty.numItems(i)<n)return false;$gameParty.loseItem(i,n,false);return true;},
        open:function(mode){if($gameParty.inBattle())return false;this._openMode=mode||'inventory';SceneManager.push(Scene_ArenaInventory);return true;},
        prepareLab:function(){if($gameMap.mapId()!==config().labMapId||$gameParty.inBattle())return false;config().labItems.map(resolve).forEach(function(i){if(!$gameParty.hasItem(i,true))$gameParty.gainItem(i,1);});return true;}
    };
    // No global loseItem block: legitimate quest delivery/consumption stays possible.
    var sellEnabled=Window_ShopSell.prototype.isEnabled;
    Window_ShopSell.prototype.isEnabled=function(i){return !important(i)&&sellEnabled.apply(this,arguments);};
    var sell=Scene_Shop.prototype.doSell;
    Scene_Shop.prototype.doSell=function(){if(important(this._item))return false;return sell.apply(this,arguments);};

    // AI material sampling over small authored torso regions. Alpha/poses untouched.
    var materialCache={};
    function mapBand(row,cw){var b=config().mapBands[row];return [b[0]+(cw-48)/2,b[1],b[2],b[3]];}
    function materialId(a){var body=a.equips().filter(function(i){return i&&i.etypeId===4;})[0];return body&&config().materials[String(body.id)]?body.id:0;}
    function appearance(kind,a){
        a=a||actor();var id=materialId(a),profile=ArenaBattleMotion.profile(a),isBattle=kind==='battle';
        var source=isBattle?ImageManager.loadSvActor(profile.file):ImageManager.loadCharacter(a.characterName());
        if(!id)return source;
        var key=kind+':'+(isBattle?profile.file:a.characterName())+':'+id;
        if(materialCache[key])return materialCache[key];if(Object.keys(materialCache).length>=8)delete materialCache[Object.keys(materialCache)[0]];
        var texture=ImageManager.loadPicture(config().materials[String(id)]),result=new Bitmap(1,1);result._arenaMaterialReady=false;materialCache[key]=result;
        function render(){
            if(result._arenaMaterialReady||!source.isReady())return;
            result.resize(source.width,source.height);result.blt(source,0,0,source.width,source.height,0,0);
            if(!texture.isReady())return;
            var tile=new Bitmap(64,64);tile.blt(texture,0,0,texture.width,texture.height,0,0,64,64);
            var t=tile._context.getImageData(0,0,64,64).data,pixels=result._context.getImageData(0,0,result.width,result.height),d=pixels.data;
            var cw=isBattle?128:source.width/3,ch=isBattle?112:source.height/4,cols=isBattle?6:3,rows=isBattle?7:4;
            for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){
                var band=isBattle?config().battleBands[row][col]:mapBand(row,cw);
                for(var y=band[1];y<band[1]+band[3];y++)for(var x=band[0];x<band[0]+band[2];x++){
                    var at=((row*ch+y)*source.width+col*cw+x)*4;if(!d[at+3])continue;
                    var lum=(d[at]+d[at+1]+d[at+2])/3;
                    // Protect pale exposed hands/sleeves crossing the torso region.
                    if(lum>145||lum<20)continue;
                    var uv=((y%64)*64+x%64)*4,shade=.45+lum/135;
                    for(var channel=0;channel<3;channel++)d[at+channel]=Math.min(255,Math.round(t[uv+channel]*shade*.85+d[at+channel]*.15));
                }
            }
            // Write only authored regions; avoid RGBA premultiplication round trips elsewhere.
            for(var rr=0;rr<rows;rr++)for(var cc=0;cc<cols;cc++){var region=isBattle?config().battleBands[rr][cc]:mapBand(rr,cw);result._context.putImageData(pixels,0,0,cc*cw+region[0],rr*ch+region[1],region[2],region[3]);}
            result._setDirty();result._arenaMaterialReady=true;
        }
        source.addLoadListener(render);texture.addLoadListener(render);return result;
    }
    ArenaInventory.appearance=appearance;ArenaInventory.materialId=materialId;
    var spriteBitmap=Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap=function(){spriteBitmap.apply(this,arguments);if(this._character===$gamePlayer&&ArenaCharacterCreation.isCreated())this.bitmap=appearance('map');};
    var actorFrame=Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame=function(){actorFrame.apply(this,arguments);if(this._actor&&ArenaCharacterCreation.isCreated())this._mainSprite.bitmap=appearance('battle',this._actor);};

    var mailIcon;
    function icon(w,i,x,y,size){
        if(!i)return;
        if(gear(i)){var b=ImageManager.loadPicture('arena_icones_v01'),sx=DataManager.isArmor(i)?32:0;if(b.isReady()){
            if(DataManager.isArmor(i)&&config().materials[String(i.id)]===config().materials['2']){var metal=ImageManager.loadPicture(config().materials['2']);if(!metal.isReady()){if(!w._waitingMail){w._waitingMail=true;metal.addLoadListener(function(){if(w.parent)w.refresh();});}return;}if(!mailIcon){mailIcon=new Bitmap(32,32);mailIcon.blt(b,32,0,32,32,0,0);var pattern=new Bitmap(32,32);pattern.blt(metal,0,0,metal.width,metal.height,0,0,32,32);var rgba=mailIcon._context.getImageData(0,0,32,32),tex=pattern._context.getImageData(0,0,32,32).data;for(var n=0;n<rgba.data.length;n+=4)if(rgba.data[n+3]){var shade=.5+(rgba.data[n]+rgba.data[n+1]+rgba.data[n+2])/384;for(var z=0;z<3;z++)rgba.data[n+z]=Math.min(255,tex[n+z]*shade);}mailIcon._context.putImageData(rgba,0,0);mailIcon._setDirty();}w.contents.blt(mailIcon,0,0,32,32,x,y,size,size);}
            else w.contents.blt(b,sx,0,32,32,x,y,size,size);
        }else if(!w._waitingIcons){w._waitingIcons=true;b.addLoadListener(function(){if(w.parent)w.refresh();});}}
        else if(i.id>=2&&i.id<=4){var hue={2:330,3:190,4:80}[i.id],p=ImageManager.loadPicture('arena_icones_v01',hue);if(p.isReady())w.contents.blt(p,64,0,32,32,x,y,size,size);else p.addLoadListener(function(){if(w.parent)w.refresh();});}
        else {var c=w.contents._context;c.save();c.strokeStyle='#cbb785';c.lineWidth=2;c.strokeRect(x+size*.2,y+size*.15,size*.6,size*.7);c.beginPath();c.moveTo(x+size*.5,y+size*.15);c.lineTo(x+size*.5,y+size*.85);c.stroke();c.restore();w.contents._setDirty();}
    }
    function lines(w,text,x,y,width,max,font){w.contents.fontSize=font||20;var result=[],line='';String(text||'').split(/\s+/).forEach(function(word){var next=line?line+' '+word:word;if(w.textWidth(next)>width&&line){result.push(line);line=word;}else line=next;});if(line)result.push(line);result.slice(0,max).forEach(function(s,n){w.contents.drawText(s,x,y+n*24,width,24);});}
    function theme(w){ArenaBattleUI.theme(w);return w;}
    function Note(){this.initialize.apply(this,arguments);}
    Note.prototype=Object.create(Window_Base.prototype);Note.prototype.constructor=Note;
    Note.prototype.standardPadding=function(){return 10;};
    // Fit complete names into bounded lines; no ellipsis or clipped words.
    function fittedName(w,text,x,y,width,max,height){
        var rows=[],font=Math.min(20,height);
        for(;font>=10;font--){w.contents.fontSize=font;rows=[];var row='';String(text).split(/\s+/).forEach(function(word){var next=row?row+' '+word:word;if(w.textWidth(next)>width&&row){rows.push(row);row=word;}else row=next;});if(row)rows.push(row);if(rows.length<=max)break;}
        // Extremely long single words are fitted by Bitmap.drawText, without cropping.
        if(rows.length>max)rows=rows.slice(0,max-1).concat(rows.slice(max-1).join(' '));
        rows.forEach(function(row,n){w.contents.drawText(row,x,y+n*height,width,height);});
    }
    Note.prototype.setText=function(t){if(t!==this._text||this._comparison){this._comparison=null;this._text=t;this.refresh();}};
    Note.prototype.setComparison=function(p,old,item){this._comparison={preview:p,old:old,item:item};this._text=null;this.refresh();};
    Note.prototype.refresh=function(){
        this.contents.clear();var model=this._comparison;
        if(!model){lines(this,this._text,0,0,this.contentsWidth(),3,20);return;}
        var p=model.preview,w=this.contentsWidth(),half=(w-16)/2;
        this.resetTextColor();this.contents.fontSize=22;this.contents.drawText('Comparar · '+$dataSystem.equipTypes[actor().equipSlots()[p.slot]],0,0,w,27);
        [model.old,model.item].forEach(function(item,n){var x=n*(half+16);this.contents.fillRect(x,34,half,80,'rgba(11,26,29,.85)');this.changeTextColor('#cbb785');this.contents.fontSize=18;this.contents.drawText(n?'Selecionado':'Atual',x+9,38,half-18,24);this.resetTextColor();if(item)icon(this,item,x+9,70,36);else{this.changeTextColor('#8e9b98');this.contents.drawText('—',x+9,70,36,34,'center');this.resetTextColor();}fittedName(this,item?item.name:'Sem equipamento',x+54,65,half-63,2,22);},this);
        this.changeTextColor('#b7c1bc');lines(this,p.effects,0,122,w,2,16);
        var columns=[[0,260,'Atributo','left'],[260,120,'Atual','center'],[380,160,'Após a troca','center'],[540,w-540,'Diferença','center']];
        this.changeTextColor('#cbb785');this.contents.fontSize=18;columns.forEach(function(c){this.contents.drawText(c[2],c[0],174,c[1],27,c[3]);},this);
        for(var id=0;id<8;id++){var y=207+id*31,d=p.after[id]-p.before[id];if(id%2===0)this.contents.fillRect(0,y,w,29,'rgba(25,44,47,.55)');this.resetTextColor();this.contents.fontSize=19;this.contents.drawText(TextManager.param(id),8,y,244,27);this.contents.drawText(String(p.before[id]),260,y,120,27,'center');this.contents.drawText(String(p.after[id]),380,y,160,27,'center');this.changeTextColor(d>0?'#9cda9b':d<0?'#f09c91':'#8e9b98');this.contents.drawText(d>0?'+'+d:d<0?String(d):'0',540,y,w-540,27,'center');}
        this.resetTextColor();
    };
    function Nav(){this.initialize.apply(this,arguments);}
    Nav.prototype=Object.create(Window_HorzCommand.prototype);Nav.prototype.constructor=Nav;
    Nav.prototype.windowWidth=function(){return Graphics.boxWidth;};Nav.prototype.windowHeight=function(){return 52;};Nav.prototype.standardPadding=function(){return 6;};Nav.prototype.maxCols=function(){return typeof ArenaAttributes!=='undefined'&&ArenaAttributes?4:3;};Nav.prototype.standardFontSize=function(){return 21;};
    Nav.prototype.makeCommandList=function(){this.addCommand('Inventário','inventory');this.addCommand('Equipamentos','equipment');if(typeof ArenaAttributes!=='undefined'&&ArenaAttributes)this.addCommand('Atributos ('+ArenaAttributes.snapshot().available+')','attributes',ArenaAttributes.canOpen());this.addCommand('Voltar','back');};
    function Grid(){this.initialize.apply(this,arguments);}
    Grid.prototype=Object.create(Window_Selectable.prototype);Grid.prototype.constructor=Grid;
    Grid.prototype.standardPadding=function(){return 12;};Grid.prototype.maxCols=function(){return config().columns;};Grid.prototype.itemHeight=function(){return config().cardHeight;};Grid.prototype.maxItems=function(){return this._data?this._data.length:0;};Grid.prototype.item=function(){return this._data&&this._data[this.index()]||null;};
    Grid.prototype.refresh=function(){this.contents.clear();this.drawAllItems();};
    Grid.prototype.processTouch=function(){}; // Scene handles press/release to distinguish drag.
    Grid.prototype.drawItem=function(index){var r=this.itemRect(index),i=this._data[index];this.contents.fillRect(r.x+3,r.y+3,r.width-6,r.height-6,'rgba(11,26,29,.65)');this.contents.fillRect(r.x+3,r.y+3,r.width-6,1,'#65716a');if(i){icon(this,i,r.x+(r.width-38)/2,r.y+9,38);lines(this,i.name,r.x+8,r.y+53,r.width-16,2,18);this.contents.fontSize=16;this.contents.drawText(important(i)?'Importante':'×'+$gameParty.numItems(i),r.x+7,r.y+101,r.width-14,20,'right');}else{lines(this,'Remover equipamento',r.x+8,r.y+42,r.width-16,2,18);}};
    Grid.prototype.updateHelp=function(){var s=SceneManager._scene;if(s.updateDescription)s.updateDescription();};
    function Slots(){this.initialize.apply(this,arguments);}
    Slots.prototype=Object.create(Window_Selectable.prototype);Slots.prototype.constructor=Slots;
    Slots.prototype.standardPadding=function(){return 12;};Slots.prototype.maxItems=function(){return actor().equipSlots().length;};Slots.prototype.itemHeight=function(){return 49;};
    Slots.prototype.refresh=function(){this.contents.clear();this.drawAllItems();};
    Slots.prototype.drawItem=function(index){var r=this.itemRect(index),i=actor().equips()[index],s=SceneManager._scene;this.contents.fontSize=14;this.changeTextColor('#aaad9b');this.contents.drawText($dataSystem.equipTypes[actor().equipSlots()[index]],r.x+48,r.y,r.width-53,17);this.resetTextColor();if(i){icon(this,i,r.x+6,r.y+8,32);fittedName(this,i.name,r.x+48,r.y+17,r.width-53,2,15);}else{this.changeTextColor('#71807c');this.contents.fillRect(r.x+8,r.y+9,28,28,'rgba(70,85,81,.16)');this.contents.fontSize=17;this.contents.drawText('—',r.x+8,r.y+9,28,28,'center');this.contents.drawText('Sem equipamento',r.x+48,r.y+18,r.width-53,26);this.resetTextColor();}if(s._drag&&s._drag.moving){var valid=!validate(actor(),index,resolve(s._drag.ref));this.contents.fillRect(r.x,r.y+r.height-2,r.width,2,valid?'#81b775':'#a25151');}};
    Slots.prototype.update=function(){Window_Selectable.prototype.update.call(this);var stamp=JSON.stringify(actor().equips().map(function(i){return i?[ref(i),i.name,i.iconIndex]:null;}));if(stamp!==this._equipStamp){this._equipStamp=stamp;this.refresh();}};
    Slots.prototype.updateHelp=function(){var s=SceneManager._scene;if(this.active)s._helpWindow.setText('Escolha um slot para filtrar as peças compatíveis e remover a atual. Tab alterna o foco.');};
    function Stats(){this.initialize.apply(this,arguments);}
    Stats.prototype=Object.create(Window_Base.prototype);Stats.prototype.constructor=Stats;Stats.prototype.standardPadding=function(){return 10;};
    // Presentation only: never write interpolated values to the actor or persistence.
    Stats.prototype.updateResourceBars=function(resources,now){
        var bars=this._resourceBars||(this._resourceBars={});
        ['hp','mp','vigor'].forEach(function(key){
            var r=resources[key],b=bars[key];
            if(!b){bars[key]={shown:r.current,from:r.current,target:r.current,maximum:r.maximum,started:now};return;}
            var t=Math.min(1,Math.max(0,(now-b.started)/240));
            b.shown=b.from+(b.target-b.from)*t;
            if(b.target!==r.current||b.maximum!==r.maximum){
                // Retarget from the current fill; no queued callbacks can restore an old value.
                b.from=Math.min(b.shown,r.current);b.target=r.current;b.maximum=r.maximum;b.started=now;
                b.shown=b.from;
            }
        });
    };
    Stats.prototype.refresh=function(){
        var a=actor(),resources=ArenaResources.snapshot(),now=Date.now(),width=this.contentsWidth();
        this.updateResourceBars(resources,now);this.contents.clear();this.resetTextColor();
        this.contents.fontSize=20;this.contents.drawText(a.name(),0,0,width,24);
        [['hp','Vida','#c05b5b'],['mp','Mana','#628dc3'],['vigor','Vigor','#87ad70']].forEach(function(row,n){
            var r=resources[row[0]],b=this._resourceBars[row[0]],y=25+n*26;
            this.contents.fontSize=18;this.contents.drawText(row[1],0,y,90,20);
            this.contents.drawText(r.current+' / '+r.maximum,92,y,width-92,20,'right');
            this.contents.fillRect(0,y+20,width,6,'#293237');
            var fill=r.maximum>0?Math.round(width*Math.max(0,Math.min(1,b.shown/r.maximum))):0;
            if(fill>0)this.contents.gradientFillRect(0,y+20,fill,6,row[2],row[2]);
        },this);
        [2,3,4,5,6,7].forEach(function(p,n){
            var col=n%2,x=col*(width+12)/2,y=108+Math.floor(n/2)*18,w=(width-12)/2;
            this.contents.fontSize=16;this.contents.drawText(TextManager.param(p),x,y,w-32,18);
            this.contents.drawText(String(a.param(p)),x+w-32,y,32,18,'right');
        },this);
        this.contents.fontSize=13;var id=materialId(a),body=a.armors().filter(function(i){return i.etypeId===4;})[0];
        this.contents.drawText(id?body.name:body?'Visual indisponível · base preservada':'Sem armadura equipada',0,164,width,16);
    };
    Stats.prototype.update=function(){
        Window_Base.prototype.update.call(this);
        var a=actor(),r=ArenaResources.snapshot(),stamp=JSON.stringify([a.name(),a.equips().map(ref),[2,3,4,5,6,7].map(function(p){return a.param(p);}),r.hp,r.mp,r.vigor]);
        var animating=this._resourceBars&&Object.keys(this._resourceBars).some(function(k){return Math.abs(this._resourceBars[k].shown-this._resourceBars[k].target)>.001;},this);
        if(stamp!==this._stamp||animating){this._stamp=stamp;this.refresh();}
    };
    function Pager(){this.initialize.apply(this,arguments);}
    Pager.prototype=Object.create(Window_HorzCommand.prototype);Pager.prototype.constructor=Pager;
    Pager.prototype.windowWidth=function(){return config().leftWidth;};Pager.prototype.windowHeight=function(){return 64;};Pager.prototype.maxCols=function(){return 3;};Pager.prototype.standardPadding=function(){return 8;};Pager.prototype.standardFontSize=function(){return 18;};
    Pager.prototype.makeCommandList=function(){var s=SceneManager._scene;var pages=Math.max(1,Math.ceil((s._entries||[]).length/config().pageSize));this.addCommand('‹ Anterior','previous',pages>1);this.addCommand((s._page+1)+' / '+pages,'page',false);this.addCommand('Próxima ›','next',pages>1);};
    function Confirm(){this.initialize.apply(this,arguments);}
    Confirm.prototype=Object.create(Window_HorzCommand.prototype);Confirm.prototype.constructor=Confirm;Confirm.prototype.windowWidth=function(){return 720;};Confirm.prototype.windowHeight=function(){return 64;};Confirm.prototype.standardPadding=function(){return 8;};Confirm.prototype.maxCols=function(){return 2;};Confirm.prototype.standardFontSize=function(){return 22;};
    Confirm.prototype.makeCommandList=function(){this.addCommand('Confirmar','confirm');this.addCommand('Cancelar','cancel');};
    Confirm.prototype.onTouch=function(triggered){if(!triggered)return;var i=this.hitTest(this.canvasToLocalX(TouchInput.x),this.canvasToLocalY(TouchInput.y));if(i>=0){this.select(i);this.processOk();}};
    Scene_ArenaInventory=function(){this.initialize.apply(this,arguments);};
    Scene_ArenaInventory.prototype=Object.create(Scene_ItemBase.prototype);Scene_ArenaInventory.prototype.constructor=Scene_ArenaInventory;
    Scene_ArenaInventory.prototype.createBackground=function(){this._backgroundSprite=new Sprite(new Bitmap(Graphics.width,Graphics.height));this._backgroundSprite.bitmap.gradientFillRect(0,0,Graphics.width,Graphics.height,'#142027','#080f13',true);this.addChild(this._backgroundSprite);};
    Scene_ArenaInventory.prototype.create=function(){
        Scene_ItemBase.prototype.create.call(this);this._mode=ArenaInventory._openMode||'inventory';this._page=0;this._filter=null;
        this._helpWindow=theme(new Note(0,0,Graphics.boxWidth,88));this.addWindow(this._helpWindow);
        this._nav=theme(new Nav(0,88));this._nav.setHandler('inventory',this.setMode.bind(this,'inventory'));this._nav.setHandler('equipment',this.setMode.bind(this,'equipment'));this._nav.setHandler('attributes',function(){ArenaAttributes.open();});this._nav.setHandler('back',this.popScene.bind(this));this._nav.setHandler('cancel',this.popScene.bind(this));this.addWindow(this._nav);
        this._itemWindow=theme(new Grid(0,140,config().leftWidth,420));this._itemWindow.setHelpWindow(this._helpWindow);this._itemWindow.setHandler('ok',this.onContentOk.bind(this));this._itemWindow.setHandler('cancel',this.cancelGrid.bind(this));this.addWindow(this._itemWindow);
        this._slots=theme(new Slots(config().leftWidth,140,Graphics.boxWidth-config().leftWidth,284));this._slots.setHelpWindow(this._helpWindow);this._slots.setHandler('ok',this.filterSlot.bind(this));this._slots.setHandler('cancel',this.cancelGrid.bind(this));this._slots.deactivate();this._slots.refresh();this.addWindow(this._slots);
        this._stats=theme(new Stats(config().leftWidth,424,Graphics.boxWidth-config().leftWidth,200));this._stats.refresh();this.addWindow(this._stats);
        this._pager=theme(new Pager(0,560));this._pager.setHandler('previous',this.page.bind(this,-1));this._pager.setHandler('next',this.page.bind(this,1));this._pager.setHandler('cancel',this.cancelGrid.bind(this));this._pager.deactivate();this.addWindow(this._pager);
        this.createActorWindow();this._actorWindow.hide();this._actorWindow.deactivate();
        this._detail=theme(new Note(48,32,720,490));this._detail.hide();this.addWindow(this._detail);
        this._confirm=theme(new Confirm(48,522));this._confirm.hide();this._confirm.deactivate();this._confirm.setHandler('confirm',this.commit.bind(this));this._confirm.setHandler('cancel',this.cancelConfirm.bind(this));this.addWindow(this._confirm);
        this._dragSprite=new Sprite(new Bitmap(170,44));this.addChild(this._dragSprite);this._dragSprite.visible=false;
        this.refreshEntries();this._nav.deactivate();this._nav.select(this._mode==='equipment'?1:0);this._itemWindow.activate();this._itemWindow.select(0);
    };
    Scene_ArenaInventory.prototype.user=function(){return actor();};
    Scene_ArenaInventory.prototype.item=function(){return this._arenaUseItem||Scene_ItemBase.prototype.item.call(this);};
    Scene_ArenaInventory.prototype.itemTargetActors=function(){return [actor()];};
    Scene_ArenaInventory.prototype.playSeForItem=function(){SoundManager.playUseItem();};
    Scene_ArenaInventory.prototype.setMode=function(mode){this._mode=mode;this._filter=null;this._page=0;this.refreshEntries();this.focus(this._itemWindow);};
    Scene_ArenaInventory.prototype.focus=function(w){[this._nav,this._itemWindow,this._slots,this._pager].forEach(function(n){n.deactivate();});w.activate();if(w.index()<0)w.select(0);if(w.callUpdateHelp)w.callUpdateHelp();};
    Scene_ArenaInventory.prototype.refreshEntries=function(){var a=actor(),entries=$gameParty.allItems().filter(function(i){return this._mode!=='equipment'||gear(i);},this);if(this._filter!==null)entries=[null].concat(entries.filter(function(i){return gear(i)&&i.etypeId===a.equipSlots()[this._filter]&&a.canEquip(i);},this));this._entries=entries;var pages=Math.max(1,Math.ceil(entries.length/config().pageSize));this._page=Math.min(this._page,pages-1);this._itemWindow._data=entries.slice(this._page*config().pageSize,(this._page+1)*config().pageSize);this._itemWindow.refresh();this._itemWindow.select(Math.min(Math.max(0,this._itemWindow.index()),this._itemWindow.maxItems()-1));this._slots.refresh();this._stats.refresh();this._pager.refresh();};
    Scene_ArenaInventory.prototype.page=function(delta){var pages=Math.max(1,Math.ceil(this._entries.length/config().pageSize));this._page=(this._page+delta+pages)%pages;this.refreshEntries();this.focus(this._itemWindow);this._itemWindow.select(0);};
    Scene_ArenaInventory.prototype.filterSlot=function(){var slot=this._slots.index(),current=actor().equips()[slot],choices=$gameParty.equipItems().filter(function(i){return !validate(actor(),slot,i);});if(current)choices.unshift(null);if(choices.length===1){this.offer(slot,ref(choices[0]));return;}if(!choices.length){this.focus(this._slots);this._helpWindow.setText('Não há peças compatíveis disponíveis e o slot está vazio.');return;}this._filter=slot;this._mode='equipment';this._page=0;this.refreshEntries();this.focus(this._itemWindow);this._itemWindow.select(0);};
    Scene_ArenaInventory.prototype.cancelGrid=function(){if(this._filter!==null){this._filter=null;this._page=0;this.refreshEntries();this.focus(this._slots);}else this.popScene();};
    Scene_ArenaInventory.prototype.updateDescription=function(){if(this._confirm&&this._confirm.visible)return;var i=this._itemWindow.item();this._helpWindow.setText(i?i.name+(important(i)?' · Importante; não pode descartar/vender.':'')+ '\n'+i.description:this._filter!==null?'Remover a peça atual e devolver ao inventário.':'Inventário vazio. Tab alterna inventário, slots, páginas e comandos.');};
    Scene_ArenaInventory.prototype.onContentOk=function(){
        var i=this._itemWindow.item();if(!i){if(this._filter!==null&&actor().equips()[this._filter])this.offer(this._filter,null);else{this.focus(this._itemWindow);this._helpWindow.setText('Nenhuma peça equipada para remover.');}return;}
        if(gear(i)){var slots=actor().equipSlots().map(function(type,n){return type===i.etypeId?n:-1;}).filter(function(n){return n>=0;});if(slots.length===1)this.offer(slots[0],ref(i));else{this._helpWindow.setText('Escolha um slot compatível à direita.');this.focus(this._slots);}return;}
        if(important(i)){this._helpWindow.setText('Item importante protegido. Uso narrativo pertence à quest.');this.focus(this._itemWindow);return;}
        this._pending={kind:'use',ref:ref(i)};this._detail.setText(i.name+'\n'+i.description+'\nConfirmar usa uma unidade somente se o efeito for válido.');this.showConfirm();
    };
    Scene_ArenaInventory.prototype.offer=function(slot,r){var p=ArenaInventory.preview(slot,r);if(!p.ok){this.focus(this._itemWindow);this._helpWindow.setText(p.reason);return;}this._pending={kind:'equip',slot:slot,ref:r};this._detail.setComparison(p,actor().equips()[slot],resolve(r));this.showConfirm();};
    Scene_ArenaInventory.prototype.showConfirm=function(){[this._nav,this._itemWindow,this._slots,this._pager].forEach(function(w){w.deactivate();});this._detail.show();this._confirm.show();this._confirm.select(0);this._confirm.activate();};
    Scene_ArenaInventory.prototype.cancelConfirm=function(){this._pending=null;this._detail.hide();this._confirm.hide();this._confirm.deactivate();this.focus(this._itemWindow);this.updateDescription();};
    Scene_ArenaInventory.prototype.commit=function(){var p=this._pending,result;if(!p)return;this._confirm.deactivate();if(p.kind==='equip')result=ArenaInventory.equip(p.slot,p.ref);else{var i=resolve(p.ref),definition=i&&i.meta.ArenaLearnSkill;if(definition){var learned=ArenaAbilities.learnBook(actor(),i);result={ok:learned==='learned',reason:learned==='already-known'?'Magia já conhecida; livro preservado.':'Não foi possível aprender.'};}else{this._arenaUseItem=i;try{if(i&&$gameParty.hasItem(i)&&actor().canUse(i)&&this.canUse()){Scene_ItemBase.prototype.useItem.call(this);result={ok:true};}else result={ok:false,reason:'Sem efeito válido; item preservado.'};}finally{this._arenaUseItem=null;}}}this.cancelConfirm();this.refreshEntries();this._helpWindow.setText(result.ok?'Operação concluída.':result.reason);};
    function hit(w,x,y){return w.visible&&x>=w.x&&y>=w.y&&x<w.x+w.width&&y<w.y+w.height?w.hitTest(x-w.x,y-w.y):-1;}
    [Nav,Slots,Pager].forEach(function(K){K.prototype.processTouch=function(){};});
    var prevent=Input._shouldPreventDefault;Input._shouldPreventDefault=function(key){return key===9&&SceneManager._scene instanceof Scene_ArenaInventory||prevent.apply(this,arguments);};
    var baseUpdate=Scene_ArenaInventory.prototype.update;
    Scene_ArenaInventory.prototype.update=function(){
        if(this._drag&&(Input.isTriggered('cancel')||TouchInput.isCancelled())){this._drag=null;this._dragSprite.visible=false;this._slots.refresh();this.focus(this._itemWindow);Input.update();TouchInput.update();return;}
        var modal=this._confirm&&this._confirm.visible;baseUpdate.call(this);if(!this._itemWindow||modal||this._confirm.visible)return;
        if(Input.isTriggered('tab')){var list=[this._itemWindow,this._slots,this._pager,this._nav].filter(function(w){return w!==this._pager||this._entries.length>config().pageSize;},this),active=list.filter(function(w){return w.active;})[0];this.focus(list[(list.indexOf(active)+1)%list.length]);}
        if(Input.isTriggered('pageup'))this.page(-1);if(Input.isTriggered('pagedown'))this.page(1);
        if(TouchInput.isTriggered()){var buttons=[this._nav,this._slots,this._pager];for(var n=0;n<buttons.length;n++){var choice=hit(buttons[n],TouchInput.x,TouchInput.y);if(choice>=0){this.focus(buttons[n]);buttons[n].select(choice);buttons[n].processOk();return;}}var index=hit(this._itemWindow,TouchInput.x,TouchInput.y);if(index>=0){this.focus(this._itemWindow);this._itemWindow.select(index);this._drag={ref:ref(this._itemWindow.item()),index:index,x:TouchInput.x,y:TouchInput.y,moving:false};}}
        var d=this._drag;if(!d)return;
        if(Input.isTriggered('cancel')||TouchInput.isCancelled()){this._drag=null;this._dragSprite.visible=false;this._slots.refresh();return;}
        if(TouchInput.isPressed()&&d.ref&&gear(resolve(d.ref))&&Math.hypot(TouchInput.x-d.x,TouchInput.y-d.y)>8){d.moving=true;this._itemWindow.deactivate();this._slots.refresh();this._dragSprite.visible=true;this._dragSprite.x=Math.min(Graphics.boxWidth-170,TouchInput.x+8);this._dragSprite.y=Math.min(Graphics.boxHeight-44,TouchInput.y+8);this._dragSprite.bitmap.clear();this._dragSprite.bitmap.fillAll('rgba(13,31,34,.95)');this._dragSprite.bitmap.fontSize=18;this._dragSprite.bitmap.drawText(resolve(d.ref).name,5,0,160,40);}
        if(TouchInput.isReleased()){this._drag=null;this._dragSprite.visible=false;this._slots.refresh();if(d.moving){var slot=hit(this._slots,TouchInput.x,TouchInput.y);if(slot>=0)this.offer(slot,d.ref);else{this._helpWindow.setText('Destino inválido. Nenhum item foi movido.');this.focus(this._itemWindow);}}else if(hit(this._itemWindow,TouchInput.x,TouchInput.y)===d.index)this.onContentOk();}
    };
    Scene_Menu.prototype.commandItem=function(){ArenaInventory.open('inventory');};
    var personal=Scene_Menu.prototype.commandPersonal;
    Scene_Menu.prototype.commandPersonal=function(){if(this._commandWindow.currentSymbol()==='equip'&&$gameParty.members().length===1){ArenaInventory.open('equipment');return;}personal.apply(this,arguments);};
    var title=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){title.apply(this,arguments);this.addCommand('Inventário técnico','arenaInventory');};
    var titleCreate=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){titleCreate.apply(this,arguments);this._commandWindow.setHandler('arenaInventory',function(){ArenaBattle.startLab();$gameTemp._arenaInventoryLab=true;});};
    var mapStart=Scene_Map.prototype.start;
    Scene_Map.prototype.start=function(){mapStart.apply(this,arguments);if($gameTemp._arenaInventoryLab){$gameTemp._arenaInventoryLab=false;ArenaInventory.prepareLab();ArenaInventory.open('equipment');}};
})();
