/*:
 * @plugindesc v0.1.0 Batalha em slots, atalhos persistentes e jogador à esquerda.
 * @author Codex
 * @help Após Arena_BattleMotion e MV_BattleSlots. Sem plugins externos.
 * Configuração data/ArenaBattleUI.json: dimensões, slots, comandos e posições.
 * C: configurar atalhos. Tab: foco/categoria. 1–8: usar espaço correspondente.
 * Teclado/mouse/toque; descrições seguem seleção, sem depender de hover.
 * Atalhos usam ArenaPersistence.setShortcut; custos continuam nativos/Resources.
 * API ArenaBattleUI.resolve(reference,actor), config(), slotId(index).
 */
var ArenaBattleUI;
(function(){
    'use strict';
    if(!window.ArenaBattleMotion||!window.MVBattleSlots)throw Error('Arena_BattleUI requer Arena_BattleMotion e MV_BattleSlots.');
    DataManager._databaseFiles.push({name:'$arenaBattleUI',src:'ArenaBattleUI.json'});
    function config(){return $arenaBattleUI;}
    function contentTop(){return Graphics.boxHeight-config().commandHeight-config().hotbarHeight;}
    function slotId(i){return config().slotPrefix+(i+1);}
    function actor(){return BattleManager.actor()||$gameParty.battleMembers()[0];}
    function refs(){return ArenaPersistence.snapshot().hotbar;}
    function refOf(item){return item?{kind:DataManager.isItem(item)?'item':'skill',id:item.id}:null;}
    function resolve(ref,a){
        if(!ref)return {item:null,usable:false,reason:'Espaço vazio. C ou Configurar para associar.'};
        var item=(ref.kind==='skill'?$dataSkills:ref.kind==='item'?$dataItems:[])[ref.id];
        if(!item||!a)return {item:item,usable:false,reason:'Referência indisponível.'};
        var reason='';
        if(ref.kind==='skill'&&!a.skills().some(function(s){return s.id===item.id;}))reason='Técnica incompatível com a arma ou magia não aprendida.';
        else if(ref.kind==='item'&&!$gameParty.hasItem(item))reason='Item esgotado.';
        else if(ref.kind==='skill'&&a.mp<a.skillMpCost(item))reason='Mana insuficiente.';
        else if(ref.kind==='skill'&&Number(item.meta.ArenaVigorCost||0)>ArenaResources.snapshot().vigor.current)reason='Vigor insuficiente.';
        else if(!a.canUse(item))reason='Indisponível neste turno.';
        return {item:item,usable:!reason,reason:reason};
    }
    function cost(item,a){
        if(DataManager.isItem(item))return '×'+$gameParty.numItems(item);
        var parts=[],mp=a.skillMpCost(item),v=Number(item.meta.ArenaVigorCost||0);if(mp)parts.push(mp+' M');if(v)parts.push(v+' V');return parts.join(' / ')||'—';
    }
    function describe(item,a){if(!item)return 'Remover a associação deste espaço.';var r=resolve(refOf(item),a);return item.name+' · '+cost(item,a)+'\n'+(r.reason?r.reason+' ':'')+item.description;}
    ArenaBattleUI={resolve:resolve,config:config,slotId:slotId};
    Input.keyMapper[67]='arenaConfigure';for(var key=1;key<=8;key++)Input.keyMapper[48+key]='arenaSlot'+key;
    var prevent=Input._shouldPreventDefault;
    Input._shouldPreventDefault=function(keyCode){return keyCode===9&&SceneManager._scene instanceof Scene_Battle||prevent.apply(this,arguments);};

    // Mirror the artwork and its weapon transform together, never the damage text.
    Sprite_Actor.prototype.setActorHome=function(){var p=ArenaBattleMotion.profile(this._actor),h=config().playerHome;this.setHome(h[0],h[1]+(p?p.cell[1]-p.ground:8));};
    var af=Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame=function(){af.apply(this,arguments);this._mainSprite.scale.x=-1;var w=this._arenaHeldWeapon;if(w){w.scale.x=-1;w.x=-w.x;w.rotation=-w.rotation;}};
    var damageOffset=Sprite_Actor.prototype.damageOffsetX;
    Sprite_Actor.prototype.damageOffsetX=function(){return -damageOffset.apply(this,arguments);};
    var eb=Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler=function(b){eb.apply(this,arguments);var homes=config().enemyHomes[String($gameTroop.members().length)],p=ArenaBattleMotion.profile(b);if(!homes||!homes[b.index()])throw Error('Arena UI: formação de inimigos sem configuração.');var h=homes[b.index()];this.setHome(h[0],h[1]+p.cell[1]-p.ground);this.scale.x=-1;};
    var anim=Sprite_Battler.prototype.startAnimation;
    Sprite_Battler.prototype.startAnimation=function(animation,mirror,delay){return anim.call(this,animation,ArenaBattleMotion.profile(this._battler)?!mirror:mirror,delay);};
    Spriteset_Battle.prototype.createBattleback=function(){
        this._back1Sprite=new Sprite(ImageManager.loadPicture(config().background.file));this._back1Sprite.scale.set(Graphics.boxWidth/576);this._back1Sprite.y=config().background.y;
        this._back2Sprite=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this._back2Sprite.bitmap.fillAll('rgba(7,12,17,0.26)');this._battleField.addChild(this._back1Sprite);this._battleField.addChild(this._back2Sprite);
    };
    function gauge(w,r,x,y,width,font){w.contents.fontSize=font||25;w.changeTextColor('#e5dcc5');w.drawText(r.name,x,y,width);w.drawText(r.current+'/'+r.maximum,x,y,width,'right');w.contents.fillRect(x,y+27,width,7,'#293138');var fill=Math.floor(width*MVBattleSlots.clampRatio(r.current,r.maximum));if(fill)w.contents.fillRect(x,y+27,fill,7,r.color);}
    Window_BattleStatus.prototype.windowWidth=function(){return config().playerPanelWidth;};
    Window_BattleStatus.prototype.windowHeight=function(){return config().commandHeight+config().hotbarHeight;};
    Window_BattleStatus.prototype.standardPadding=function(){return 12;};
    Window_BattleStatus.prototype.drawItem=function(i){var a=$gameParty.battleMembers()[i];if(!a)return;this.contents.fontSize=25;this.drawText(a.name(),0,0,this.contentsWidth());ArenaBattle.resources(a).forEach(function(r,n){gauge(this,r,0,36+n*38,this.contentsWidth(),25);},this);};
    Window_BattleStatus.prototype.updateCursor=function(){this.setCursorRect(0,0,0,0);};

    function ParticipantPanel(){this.initialize.apply(this,arguments);}
    ParticipantPanel.prototype=Object.create(Window_Base.prototype);ParticipantPanel.prototype.constructor=ParticipantPanel;
    ParticipantPanel.prototype.standardPadding=function(){return 6;};
    ParticipantPanel.prototype.initialize=function(b,s){this._participant=b;this._body=s;var height=36+ArenaBattle.resources(b).length*36;Window_Base.prototype.initialize.call(this,0,0,180,height);this.opacity=200;this.backOpacity=160;};
    ParticipantPanel.prototype.update=function(){Window_Base.prototype.update.call(this);var b=this._participant,s=this._body,p=ArenaBattleMotion.profile(b),rows=ArenaBattle.resources(b),height=36+rows.length*36;if(this.height!==height){this.height=height;this.createContents();this._stamp=null;}var offsets=!b.isActor()&&config().enemyPanelOffsets[String($gameTroop.members().length)],offset=offsets&&offsets[b.index()];this.x=Math.max(2,Math.min(Graphics.boxWidth-this.width-2,s.x+(offset?offset[0]:-this.width/2)));this.y=Math.max(config().helpHeight+2,s.y-(p.cell[1]-p.ground)-90-this.height-6+(offset?offset[1]:0));this.visible=b.isAppeared();var stamp=JSON.stringify([b.name(),rows]);if(stamp!==this._stamp){this._stamp=stamp;this.contents.clear();this.contents.fontSize=25;this.drawText(b.name(),0,0,this.contentsWidth(),'center');rows.forEach(function(r,n){gauge(this,r,0,24+n*36,this.contentsWidth(),25);},this);}};

    // Reusable UI pictograms; not replacement artwork for participants or scenes.
    function icon(w,name,x,y,size){var c=w.contents._context,s=size/48;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#cbb785';c.lineWidth=2.5;c.lineJoin='round';c.lineCap='round';c.beginPath();
        if(name==='sword'){c.moveTo(12,38);c.lineTo(37,9);c.lineTo(34,22);c.lineTo(20,37);c.moveTo(12,28);c.lineTo(27,41);c.moveTo(17,34);c.lineTo(9,43);}
        else if(name==='book'){c.moveTo(24,12);c.lineTo(6,6);c.lineTo(6,37);c.lineTo(24,43);c.lineTo(42,37);c.lineTo(42,6);c.closePath();c.moveTo(24,12);c.lineTo(24,43);c.moveTo(12,15);c.lineTo(18,17);c.moveTo(30,17);c.lineTo(36,15);}
        else if(name==='shield'){c.moveTo(6,7);c.lineTo(42,7);c.lineTo(39,28);c.quadraticCurveTo(35,39,24,44);c.quadraticCurveTo(13,39,9,28);c.closePath();c.moveTo(24,12);c.lineTo(24,34);}
        else if(name==='bag'){c.moveTo(13,7);c.lineTo(35,7);c.lineTo(31,16);c.lineTo(40,40);c.lineTo(8,40);c.lineTo(17,16);c.closePath();c.moveTo(16,17);c.lineTo(32,17);}
        else if(name==='heal'){c.arc(24,24,18,0,Math.PI*2);c.moveTo(24,12);c.lineTo(24,36);c.moveTo(12,24);c.lineTo(36,24);}
        else if(name==='fire'){c.moveTo(26,3);c.bezierCurveTo(34,16,47,29,35,40);c.bezierCurveTo(14,54,4,31,17,20);c.bezierCurveTo(15,34,29,25,26,3);}
        else {c.moveTo(8,31);c.lineTo(18,18);c.lineTo(25,23);c.lineTo(34,13);c.lineTo(41,21);c.lineTo(24,40);c.closePath();}c.stroke();c.restore();w.contents._setDirty();}
    function itemIcon(w,item,x,y,size){
        var kind=DataManager.isItem(item)?'item':'skill',spec=config().icons[kind][String(item.id)];
        if(spec){var image=ImageManager.loadPicture(config().icons.file,spec.hue),r=spec.rect;if(!image.isReady()){w._arenaPendingIcons=w._arenaPendingIcons||{};var key=config().icons.file+spec.hue;if(!w._arenaPendingIcons[key]){w._arenaPendingIcons[key]=true;image.addLoadListener(function(){if(w.parent&&w.contents)w.refresh();});}return;}w.contents.blt(image,r[0],r[1],r[2],r[3],x,y,size,size);}
        else if(item.iconIndex){var bmp=ImageManager.loadSystem('IconSet'),pw=Window_Base._iconWidth,ph=Window_Base._iconHeight;w.contents.blt(bmp,item.iconIndex%16*pw,Math.floor(item.iconIndex/16)*ph,pw,ph,x,y,size,size);}
        else icon(w,DataManager.isItem(item)?'bag':config().skillGlyphs[String(item.id)]||'sword',x,y,size);
    }
    function wrap(w,text,width,maxLines){var lines=[],line='';String(text).split(/\s+/).forEach(function(word){var next=line?line+' '+word:word;if(w.textWidth(next)>width&&line){lines.push(line);line=word;}else line=next;});if(line)lines.push(line);return lines.slice(0,maxLines);}
    function card(w,item,rect,enabled){var x=rect.x+3,y=rect.y+3,width=rect.width-6,height=rect.height-6;w.contents.fillRect(x,y,width,height,'rgba(10,22,25,0.84)');w.contents.fillRect(x,y,width,1,'#8f7b53');w.contents.fillRect(x,y+height-1,width,1,'#8f7b53');w.changePaintOpacity(enabled);if(item){itemIcon(w,item,x+12,y+15,40);w.contents.fontSize=25;w.drawText(cost(item,actor()),x+54,y+10,width-64,'right');w.contents.fontSize=25;var label=DataManager.isSkill(item)&&config().skillLabels[String(item.id)]||item.name;wrap(w,label,width-18,2).forEach(function(line,n){w.drawText(line,x+9,y+69+n*26,width-18,'center');});}else {w.contents.fontSize=25;w.drawText('Limpar espaço',x+5,y+58,width-10,'center');}w.changePaintOpacity(true);}
    Window_ActorCommand.prototype.windowWidth=function(){return Graphics.boxWidth-config().playerPanelWidth;};
    Window_ActorCommand.prototype.windowHeight=function(){return config().commandHeight;};
    Window_ActorCommand.prototype.standardPadding=function(){return 8;};
    Window_ActorCommand.prototype.maxCols=function(){return 4;};
    Window_ActorCommand.prototype.numVisibleRows=function(){return 1;};
    Window_ActorCommand.prototype.itemHeight=function(){return this.contentsHeight();};
    Window_ActorCommand.prototype.lineHeight=function(){return 28;};
    Window_ActorCommand.prototype.makeCommandList=function(){if(!this._actor)return;config().commands.forEach(function(c){this.addCommand(c.name,c.symbol,c.symbol==='attack'?this._actor.canAttack():c.symbol==='guard'?this._actor.canGuard():true,c.symbol==='skill'?1:null);},this);};
    Window_ActorCommand.prototype.drawItem=function(i){var r=this.itemRect(i),d=config().commands[i];this.changePaintOpacity(this.isCommandEnabled(i));icon(this,d.icon,r.x+(r.width-38)/2,r.y+1,38);this.contents.fontSize=25;this.drawText(d.name,r.x,r.y+40,r.width,'center');this.changePaintOpacity(true);};
    var ext=Window_ActorCommand.prototype.selectExt;
    Window_ActorCommand.prototype.selectExt=function(value){if(value===1||value===2){this._arenaSType=value;this.selectSymbol('skill');}else ext.apply(this,arguments);};
    var currentExt=Window_ActorCommand.prototype.currentExt;
    Window_ActorCommand.prototype.currentExt=function(){return this.currentSymbol()==='skill'?(this._arenaSType||1):currentExt.apply(this,arguments);};
    Window_ActorCommand.prototype.updateHelp=function(){if(this._helpWindow){var c=config().commands[this.index()];this._helpWindow.setText(c?c.description+'\nTab: atalhos · C: configurar · 1–'+config().slotCount+': executar.':'');}};
    [Window_BattleSkill,Window_BattleItem].forEach(function(K){K.prototype.maxCols=function(){return config().cardColumns;};K.prototype.itemHeight=function(){return config().cardHeight;};K.prototype.standardPadding=function(){return 12;};K.prototype.drawItem=function(i){var item=this._data[i];if(item)card(this,item,this.itemRect(i),this.isEnabled(item));};K.prototype.updateHelp=function(){if(this._helpWindow)this._helpWindow.setText(this.item()?describe(this.item(),actor()):'Nenhuma opção nesta categoria. Cancelar retorna aos comandos.');};});
    function Help(){this.initialize.apply(this,arguments);}
    Help.prototype=Object.create(Window_Help.prototype);Help.prototype.constructor=Help;
    Help.prototype.standardPadding=function(){return 10;};
    Help.prototype.refresh=function(){this.contents.clear();this.contents.fontSize=25;var lines=[];String(this._text||'').split('\n').forEach(function(s){lines=lines.concat(wrap(this,s,this.contentsWidth(),3));},this);lines.slice(0,2).forEach(function(s,n){this.drawText(s,0,n*30,this.contentsWidth());},this);};
    Scene_Battle.prototype.createHelpWindow=function(){this._helpWindow=new Help();this._helpWindow.move(0,0,Graphics.boxWidth,config().helpHeight);this._helpWindow.createContents();this.addWindow(this._helpWindow);};
    function Categories(){this.initialize.apply(this,arguments);}
    Categories.prototype=Object.create(Window_Command.prototype);Categories.prototype.constructor=Categories;
    Categories.prototype.windowWidth=function(){return config().categoryWidth;};Categories.prototype.numVisibleRows=function(){return 3;};Categories.prototype.standardPadding=function(){return 10;};Categories.prototype.standardFontSize=function(){return 25;};
    Categories.prototype.makeCommandList=function(){var a=actor(),skills=a?a.skills():[],tech=skills.filter(function(s){return s.stypeId===1;}).length,magic=skills.filter(function(s){return s.stypeId===2;}).length;this.addCommand('Técnicas ('+tech+')','type',tech>0,1);this.addCommand('Magias ('+magic+')','type',magic>0,2);};
    Categories.prototype.processTouch=function(){};
    function Hotbar(){this.initialize.apply(this,arguments);}
    Hotbar.prototype=Object.create(Window_Selectable.prototype);Hotbar.prototype.constructor=Hotbar;
    Hotbar.prototype.standardPadding=function(){return 8;};Hotbar.prototype.maxItems=function(){return config().slotCount;};Hotbar.prototype.maxCols=function(){return config().slotCount;};Hotbar.prototype.itemHeight=function(){return 58;};Hotbar.prototype.lineHeight=function(){return 26;};
    Hotbar.prototype.itemRect=function(i){var g=MVBattleSlots.grid(this.contentsWidth(),config().slotCount,config().slotWidth,2,52)[i];return new Rectangle(g.x,26,g.width,58);};
    Hotbar.prototype.refresh=function(){if(!this.contents)return;this.contents.clear();this.contents.fontSize=25;this.drawText('Atalhos',0,-1,this.contentsWidth());this.drawText('Configurar [C]',0,-1,this.contentsWidth(),'right');this.drawAllItems();};
    Hotbar.prototype.drawItem=function(i){var r=this.itemRect(i),ref=refs()[slotId(i)],v=resolve(ref,actor());this.contents.fillRect(r.x+1,r.y,r.width-2,r.height,'rgba(11,25,29,0.88)');this.contents.fillRect(r.x+1,r.y,r.width-2,1,'#a18b5a');this.contents.fontSize=18;this.drawText(String(i+1),r.x+4,r.y,r.width-8);this.changePaintOpacity(v.usable);if(v.item){itemIcon(this,v.item,r.x+(r.width-28)/2,r.y,28);this.contents.fontSize=25;this.drawText(cost(v.item,actor()),r.x+2,r.y+31,r.width-4,'center');}else {this.contents.fontSize=25;this.drawText('Vazio',r.x+1,r.y+31,r.width-2,'center');}this.changePaintOpacity(true);};
    Hotbar.prototype.updateHelp=function(){if(this._helpWindow){var scene=SceneManager._scene,ref=refs()[slotId(this.index())],v=resolve(ref,actor());this._helpWindow.setText(scene._arenaConfiguring?'Configuração: escolha o espaço e confirme. Esc/Cancelar sai sem usar ações.':v.item?describe(v.item,actor()):v.reason);}};
    Hotbar.prototype.update=function(){Window_Selectable.prototype.update.call(this);var stamp=JSON.stringify([refs(),actor()&&actor().skills().map(function(s){return[s.id,actor().canUse(s),cost(s,actor())];}),$gameParty.items().map(function(i){return[i.id,$gameParty.numItems(i)];})]);if(stamp!==this._stamp){this._stamp=stamp;this.refresh();}};
    function Picker(){this.initialize.apply(this,arguments);}
    Picker.prototype=Object.create(Window_Selectable.prototype);Picker.prototype.constructor=Picker;
    Picker.prototype.standardPadding=function(){return 12;};
    Picker.prototype.maxCols=function(){return config().cardColumns;};Picker.prototype.itemHeight=function(){return config().cardHeight;};Picker.prototype.maxItems=function(){return this._data?this._data.length:0;};
    Picker.prototype.refresh=function(){this._data=[null].concat(actor().skills(),$gameParty.items().filter(function(i){return i.occasion===0||i.occasion===1;}));this.contents.clear();this.drawAllItems();};
    Picker.prototype.item=function(){return this._data&&this._data[this.index()];};Picker.prototype.drawItem=function(i){card(this,this._data[i],this.itemRect(i),true);};Picker.prototype.updateHelp=function(){if(this._helpWindow)this._helpWindow.setText('Associar ao atalho '+(SceneManager._scene._arenaHotbar.index()+1)+'. '+describe(this.item(),actor()));};
    function resize(w,x,y,width,height){w.move(x,y,width,height);w.createContents();if(w.refresh)w.refresh();}
    var windows=Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows=function(){
        windows.apply(this,arguments);var c=config(),y=contentTop();if(c.slotCount<1||c.slotCount>8||c.cardColumns<2||c.cardColumns>4||c.cardHeight<120)throw Error('Arena UI: configuração fora dos limites suportados.');MVBattleSlots.grid(Graphics.boxWidth-c.playerPanelWidth-16,c.slotCount,c.slotWidth,2,52);
        this._arenaEnemyResources.hide();this._actorCommandWindow.x=c.playerPanelWidth;this._actorCommandWindow.y=Graphics.boxHeight-c.commandHeight;this._actorCommandWindow.setHelpWindow(this._helpWindow);this._statusWindow.x=0;this._statusWindow.y=y;
        resize(this._skillWindow,c.categoryWidth,c.helpHeight,Graphics.boxWidth-c.categoryWidth,y-c.helpHeight);resize(this._itemWindow,0,c.helpHeight,Graphics.boxWidth,y-c.helpHeight);
        resize(this._enemyWindow,c.playerPanelWidth,y-112,Graphics.boxWidth-c.playerPanelWidth,112);this._enemyWindow.maxCols=function(){return 3;};this._enemyWindow.refresh();
        this._arenaCategories=new Categories(0,c.helpHeight);resize(this._arenaCategories,0,c.helpHeight,c.categoryWidth,y-c.helpHeight);this._arenaCategories.hide();this._arenaCategories.deactivate();this.addWindow(this._arenaCategories);
        this._arenaHotbar=new Hotbar(c.playerPanelWidth,y,Graphics.boxWidth-c.playerPanelWidth,c.hotbarHeight);this._arenaHotbar.setHelpWindow(this._helpWindow);this._arenaHotbar.setHandler('ok',this.onArenaHotbarOk.bind(this));this._arenaHotbar.setHandler('cancel',this.endArenaConfiguration.bind(this));this._arenaHotbar.deactivate();this._arenaHotbar.deselect();this.addWindow(this._arenaHotbar);
        this._arenaPicker=new Picker(0,c.helpHeight,Graphics.boxWidth,y-c.helpHeight);this._arenaPicker.setHelpWindow(this._helpWindow);this._arenaPicker.setHandler('ok',this.onArenaPickerOk.bind(this));this._arenaPicker.setHandler('cancel',function(){this._arenaPicker.hide();this._arenaPicker.deactivate();this._arenaHotbar.activate();this._arenaHotbar.updateHelp();}.bind(this));this._arenaPicker.hide();this._arenaPicker.deactivate();this.addWindow(this._arenaPicker);
        this._arenaBack=new Window_Base(0,y-52,c.categoryWidth,52);this._arenaBack.standardPadding=function(){return 6;};this._arenaBack.updatePadding();this._arenaBack.createContents();this._arenaBack.contents.fontSize=25;this._arenaBack.drawText('Voltar',0,0,this._arenaBack.contentsWidth(),'center');this._arenaBack.hide();this.addWindow(this._arenaBack);
        this._spriteset.updateActors();
        this._arenaParticipantPanels=this._spriteset.battlerSprites().filter(function(s){return !!s._battler;}).map(function(s){var p=new ParticipantPanel(s._battler,s);this.addWindow(p);return p;},this);
    };
    Scene_Battle.prototype.updateWindowPositions=function(){this._statusWindow.x=0;};
    Scene_Battle.prototype.startPartyCommandSelection=function(){this.refreshStatus();this._statusWindow.open();this._partyCommandWindow.deactivate();this._partyCommandWindow.close();this.commandFight();};
    var active=Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive=function(){return active.apply(this,arguments)||!!(this._arenaHotbar&&this._arenaHotbar.active||this._arenaPicker&&this._arenaPicker.active);};
    Scene_Battle.prototype.setArenaCategory=function(type){if(!actor().skills().some(function(s){return s.stypeId===type;})){this._helpWindow.setText('Nenhuma habilidade aprendida nesta categoria.');return false;}this._actorCommandWindow._arenaSType=type;this._arenaCategories.select(type-1);this._skillWindow.setStypeId(type);this._skillWindow.refresh();this._skillWindow.select(0);this._skillWindow.updateHelp();return true;};
    var skill=Scene_Battle.prototype.commandSkill;
    Scene_Battle.prototype.commandSkill=function(){this._itemWindow.hide();this._itemWindow.deactivate();skill.apply(this,arguments);this._arenaCategories.refresh();this._arenaCategories.show();var type=this._actorCommandWindow.currentExt();if(!actor().skills().some(function(s){return s.stypeId===type;}))type=actor().skills().some(function(s){return s.stypeId===1;})?1:2;this.setArenaCategory(type);};
    var commandItem=Scene_Battle.prototype.commandItem;
    Scene_Battle.prototype.commandItem=function(){this._skillWindow.hide();this._skillWindow.deactivate();this._arenaCategories.hide();commandItem.apply(this,arguments);};
    var skillCancel=Scene_Battle.prototype.onSkillCancel;
    Scene_Battle.prototype.onSkillCancel=function(){this._arenaCategories.hide();skillCancel.apply(this,arguments);this._actorCommandWindow.updateHelp();};
    var itemCancel=Scene_Battle.prototype.onItemCancel;
    Scene_Battle.prototype.onItemCancel=function(){itemCancel.apply(this,arguments);this._actorCommandWindow.updateHelp();};
    var next=Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction=function(){this._arenaCategories.hide();var action=BattleManager.inputtingAction();action._arenaUiReference=refOf(action.item());next.apply(this,arguments);};
    var selectEnemy=Scene_Battle.prototype.selectEnemySelection;
    Scene_Battle.prototype.selectEnemySelection=function(){var a=BattleManager.inputtingAction(),one=MVBattleSlots.unique($gameTroop.aliveMembers());if(one){a.setTarget(one.index());this._skillWindow.hide();this._itemWindow.hide();this.selectNextCommand();return;}selectEnemy.apply(this,arguments);};
    var selectActor=Scene_Battle.prototype.selectActorSelection;
    Scene_Battle.prototype.selectActorSelection=function(){var a=BattleManager.inputtingAction(),one=MVBattleSlots.unique(a.isForDeadFriend()?$gameParty.deadMembers():$gameParty.aliveMembers());if(one){a.setTarget(one.index());this._skillWindow.hide();this._itemWindow.hide();this.selectNextCommand();return;}selectActor.apply(this,arguments);};
    ['onEnemyCancel','onActorCancel'].forEach(function(name){var cancel=Scene_Battle.prototype[name];Scene_Battle.prototype[name]=function(){if(this._arenaFromShortcut){this._enemyWindow.hide();this._actorWindow.hide();this._arenaFromShortcut=false;this._arenaHotbar.activate();this._arenaHotbar.updateHelp();return;}cancel.apply(this,arguments);if(this._skillWindow.visible)this._arenaCategories.show();};});
    Scene_Battle.prototype.beginArenaConfiguration=function(){this._arenaConfiguring=true;this._actorCommandWindow.deactivate();this._arenaHotbar.activate();this._arenaHotbar.select(Math.max(0,this._arenaHotbar.index()));this._arenaHotbar.updateHelp();};
    Scene_Battle.prototype.endArenaConfiguration=function(){this._arenaConfiguring=false;this._arenaFromShortcut=false;this._arenaHotbar.deactivate();this._arenaHotbar.deselect();this._actorCommandWindow.activate();this._actorCommandWindow.updateHelp();};
    Scene_Battle.prototype.onArenaHotbarOk=function(){if(this._arenaConfiguring){this._arenaHotbar.deactivate();this._arenaPicker.refresh();this._arenaPicker.show();this._arenaPicker.select(0);this._arenaPicker.activate();return;}this.executeArenaShortcut(this._arenaHotbar.index());};
    Scene_Battle.prototype.onArenaPickerOk=function(){ArenaPersistence.setShortcut(slotId(this._arenaHotbar.index()),refOf(this._arenaPicker.item()));this._arenaPicker.hide();this._arenaPicker.deactivate();this._arenaHotbar.refresh();this._arenaHotbar.activate();this._arenaHotbar.updateHelp();};
    Scene_Battle.prototype.cancelArenaInput=function(){var names=['_arenaPicker','_enemyWindow','_actorWindow','_skillWindow','_itemWindow','_arenaHotbar'];for(var i=0;i<names.length;i++){var w=this[names[i]];if(w&&w.active){w.processCancel();return;}}};
    Scene_Battle.prototype.executeArenaShortcut=function(i){var ref=refs()[slotId(i)],v=resolve(ref,actor());if(!v.usable){SoundManager.playBuzzer();this._helpWindow.setText(v.reason);this._arenaHotbar.activate();this._actorCommandWindow.deactivate();this._arenaHotbar.select(i);this._helpWindow.setText(v.reason);return false;}this._arenaHotbar.deactivate();this._actorCommandWindow.deactivate();this._actorCommandWindow.selectSymbol(ref.kind==='skill'?'skill':'item');this._arenaFromShortcut=true;var action=BattleManager.inputtingAction();if(ref.kind==='skill')action.setSkill(ref.id);else action.setItem(ref.id);this.onSelectAction();return true;};
    var end=Scene_Battle.prototype.endCommandSelection;
    Scene_Battle.prototype.endCommandSelection=function(){end.apply(this,arguments);if(this._arenaHotbar){this._arenaHotbar.deactivate();this._arenaPicker.hide();this._arenaPicker.deactivate();this._arenaCategories.hide();this._arenaConfiguring=false;this._arenaFromShortcut=false;}};
    var start=BattleManager.startAction;
    BattleManager.startAction=function(){var a=this._subject&&this._subject.currentAction();if(a&&a._arenaUiReference){var r=resolve(a._arenaUiReference,a.subject());if(!r.usable){this._arenaFailure='ui-unavailable';this._targets=[];this._phase='turn';return false;}
        // Techniques/spells already cache/revalidate targets in Arena_Abilities.
        // Items need the same no-target guarantee before native consumption.
        if(a.isItem()){var targets=a.makeTargets();if(!targets.length){this._arenaFailure='ui-no-target';this._targets=[];this._phase='turn';return false;}var original=a.makeTargets;a.makeTargets=function(){return targets;};try{return start.apply(this,arguments);}finally{a.makeTargets=original;}}
    }return start.apply(this,arguments);};
    var sceneUpdate=Scene_Battle.prototype.update;
    Scene_Battle.prototype.update=function(){sceneUpdate.apply(this,arguments);if(!this._arenaHotbar)return;var input=BattleManager.isInputting()&&this.isAnyInputWindowActive();this._helpWindow.visible=!!input;this._arenaCategories.visible=this._skillWindow.visible;this._arenaEnemyResources.visible=false;
        var back=this._arenaBack;back.visible=!!input&&!this._actorCommandWindow.active;if(back.visible&&TouchInput.isTriggered()&&TouchInput.x>=back.x&&TouchInput.x<back.x+back.width&&TouchInput.y>=back.y&&TouchInput.y<back.y+back.height){this.cancelArenaInput();return;}
        // Field panels remain readable on the main screen, lists use the space.
        var listing=this._skillWindow.visible||this._itemWindow.visible||this._arenaPicker.visible;this._arenaParticipantPanels.forEach(function(p){p.visible=!listing&&p._participant.isAppeared();});
        if(this._skillWindow.active){if(Input.isTriggered('tab'))this.setArenaCategory(this._skillWindow._stypeId===1?2:1);if(TouchInput.isTriggered()&&TouchInput.x<config().categoryWidth&&TouchInput.y>=config().helpHeight&&TouchInput.y<config().helpHeight+100)this.setArenaCategory(TouchInput.y<config().helpHeight+50?1:2);}
        if((this._actorCommandWindow.active||this._arenaHotbar.active)&&input){var h=this._arenaHotbar,x=TouchInput.x-h.x,y=TouchInput.y-h.y;
            if(Input.isTriggered('arenaConfigure')||TouchInput.isTriggered()&&x>0&&x<h.width&&y>=0&&y<30){if(this._arenaConfiguring)this.endArenaConfiguration();else this.beginArenaConfiguration();return;}
            if(Input.isTriggered('tab')){if(h.active)this.endArenaConfiguration();else {this._actorCommandWindow.deactivate();h.activate();h.select(0);h.updateHelp();}}
            for(var i=0;i<config().slotCount;i++)if(Input.isTriggered('arenaSlot'+(i+1))){h.select(i);if(this._arenaConfiguring)this.onArenaHotbarOk();else this.executeArenaShortcut(i);return;}
            if(this._actorCommandWindow.active&&TouchInput.isTriggered()&&x>=0&&x<h.width&&y>=30&&y<h.height){var hit=h.hitTest(x,y);if(hit>=0){this._actorCommandWindow.deactivate();h.activate();h.select(hit);h.updateHelp();}}
        }
    };
})();
