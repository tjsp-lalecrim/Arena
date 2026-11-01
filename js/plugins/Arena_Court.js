/*:
 * @plugindesc v0.1.0 Audiência mínima de Blubamka: pedido explícito, destino lógico.
 * @author Codex
 * @help Após Arena_RiaVision, Arena_Rihad, Arena_Persistence e MV_JournalModel.
 * Configuração ArenaCourt.json; posições em ArenaRihad.json.court.
 * Diálogos/choices nativos MV; nenhum redesign narrativo ou prêmio.
 * Aceitação deriva da etapa40 persistida, sem flags/namespace duplicados.
 * Stonekeep conhecida não implica mapa/viagem. doc/CORTE_RIHAD_M02_03D.md.
 */
var ArenaCourt;
(function(){
 'use strict';DataManager._databaseFiles.push({name:'$arenaCourt',src:'ArenaCourt.json'});
 function cfg(){return $arenaRihad.court;}
 function here(){return $gameMap&&$gameMap.mapId()===cfg().entry.mapId;}
 function valid(i,mapId,eventId){var e=$gameMap.event(eventId);return !$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&ArenaNarrative.isCampaign()&&$gameMap.mapId()===mapId&&i instanceof Game_Interpreter&&i._mapId===mapId&&i.eventId()===eventId&&e&&!e._erased&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;}
 function transfer(i,from,eventId,to){if(!valid(i,from,eventId)||$gameMessage.isBusy()||ArenaQuests.snapshot('MQ02').stage<10)return false;$gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp._arenaCourtTravelFence=true;$gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);return true;}
 function textCommands(texts,indent){var w=SceneManager._scene._messageWindow,list=[];w.resetFontSettings();texts.forEach(function(text){var lines=MVJournalModel.wrap(text,w.contentsWidth()-8,w.textWidth.bind(w));for(var n=0;n<lines.length;n+=4){list.push({code:101,indent:indent,parameters:['',0,0,2]});lines.slice(n,n+4).forEach(function(t){list.push({code:401,indent:indent,parameters:[t]});});}});return list;}
 function show(i,texts){var list=textCommands(texts,0);list.push({code:0,indent:0,parameters:[]});i.setupChild(list,i.eventId());return true;}
 ArenaCourt={
  enter:function(i){var c=cfg();return transfer(i,c.exit.mapId,c.accessEventId,c.entry);},
  leave:function(i){var c=cfg();return transfer(i,c.entry.mapId,c.exitEventId,c.exit);},
  destination:function(){return {id:cfg().destinationId,known:ArenaQuests.snapshot('MQ02').stage>=40,available:false,reason:'destination_not_implemented'};},
  talk:function(i){
   if(!valid(i,cfg().entry.mapId,cfg().queenEventId)||$gameMessage.isBusy())return false;
   var q=ArenaQuests.snapshot('MQ02');
   if(q.stage<30)return show(i,$arenaCourt.notReady);
   if(q.stage!==30)return show(i,q.stage<50?$arenaCourt.pending:$arenaCourt.future);
   var list=textCommands($arenaCourt.offer,0);
   list.push({code:102,indent:0,parameters:[['Aceitar o pedido','Agora não'],1,1,2,0]},
    {code:402,indent:0,parameters:[0,'Aceitar o pedido']},{code:355,indent:1,parameters:['ArenaCourt.accept(this);']},
    {code:402,indent:0,parameters:[1,'Agora não']});
   list=list.concat(textCommands($arenaCourt.decline,1));list.push({code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});
   i.setupChild(list,i.eventId());return true;
  },
  accept:function(i){
   if(!valid(i,cfg().entry.mapId,cfg().queenEventId)||i._branch[0]!==0||ArenaQuests.snapshot('MQ02').stage!==30)return false;
   var q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',40,Object.assign({},q.objectives,{parchmentRequest:true}),false);
   return show(i,$arenaCourt.accepted);
  },
  preview:function(){
   if(!ArenaRiaVision.preview())return false;
   MVStateStore.once('arenaMQ02Narrative','MQ02.ria.begin',function(s){s.phase='complete';});
   MVStateStore.once('arenaMQ02Narrative','MQ02.ria.complete',function(s){s.phase='complete';});
   ArenaPersistence.setQuest('MQ02',30,{riaVision:true,askRihad:true},false);return true;
  }
 };
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=cfg(),area=c&&ArenaCampaignConfig.area(c.areaId);
  if(!c||!area.ok||area.config.mapId!==c.entry.mapId||c.exit.mapId!==$arenaRihad.arrival.mapId||!$arenaCourt||$arenaCourt.schemaVersion!==1||!['notReady','offer','decline','accepted','pending','future'].every(function(k){return Array.isArray($arenaCourt[k])&&$arenaCourt[k].length&&$arenaCourt[k].every(function(t){return typeof t==='string'&&t.length;});}))throw Error('Corte: configuração inválida.');return true;};
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){if(!$gamePlayer.isTransferring()&&$gameMap.mapId()===cfg().exit.mapId)[cfg().accessEventId,cfg().doorEventId].forEach(function(id){if(!$gameMap.event(id)&&$dataMap.events[id])$gameMap._events[id]=new Game_Event($gameMap.mapId(),id);});mapLoaded.apply(this,arguments);};
 var choiceStart=Window_ChoiceList.prototype.start,choiceUpdate=Window_ChoiceList.prototype.update;
 Window_ChoiceList.prototype.start=function(){choiceStart.apply(this,arguments);if(here()){this._arenaCourtAwaitNeutral=true;this._arenaCourtReadyAt=Date.now()+150;}};
 // Keep the native subwindow active while fencing input: deactivation makes
 // Window_Message restart its still-owned text instead of waiting for a choice.
 Window_ChoiceList.prototype.update=function(){if(this._arenaCourtAwaitNeutral){Window_Base.prototype.update.call(this);if(!TouchInput.isPressed()&&!['ok','cancel','up','down','left','right'].some(function(k){return Input.isPressed(k);})&&Date.now()>=this._arenaCourtReadyAt)this._arenaCourtAwaitNeutral=false;return;}choiceUpdate.apply(this,arguments);};
 var terminate=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminate.apply(this,arguments);if(here()){$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();}};
 var titleList=Window_TitleCommand.prototype.makeCommandList,titleCreate=Scene_Title.prototype.createCommandWindow;
 Window_TitleCommand.prototype.makeCommandList=function(){titleList.apply(this,arguments);this.addCommand('Rihad · audiência (RAM)','arenaCourtPreview');};
 Scene_Title.prototype.createCommandWindow=function(){titleCreate.apply(this,arguments);this._commandWindow.setHandler('arenaCourtPreview',ArenaCourt.preview);};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(here()&&ArenaContinuation.labActive()){this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');}};
 var display=Scene_Map.prototype.createDisplayObjects,update=Scene_Map.prototype.update;
 var canMove=Game_Player.prototype.canMove;
 Game_Player.prototype.canMove=function(){return !$gameTemp._arenaCourtTravelFence&&canMove.apply(this,arguments);};
 Scene_Map.prototype.createDisplayObjects=function(){display.apply(this,arguments);if(here()||$gameMap.mapId()===cfg().exit.mapId){this._courtLabels=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._courtLabels);}};
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if($gameTemp._arenaCourtTravelFence&&!TouchInput.isPressed()&&!['ok','cancel','up','down','left','right'].some(function(k){return Input.isPressed(k);}))$gameTemp._arenaCourtTravelFence=false;if(!this._courtLabels)return;var b=this._courtLabels.bitmap;b.clear();if(here()){b.fillRect(0,0,b.width,72,'rgba(12,16,18,.92)');b.fontSize=23;b.textColor='#e1d2ae';b.drawText('Corte de Rihad — apresentação provisória',18,4,b.width-36,30);b.fontSize=17;b.drawText('Materiais/NPC de reuso · Esc: menu'+(ArenaContinuation.labActive()?' · teste RAM':''),18,36,b.width-36,26);}
  var labels=here()?[[8,5,'Blubamka · provisório',-90],[8,11,'Sair para Rihad ↓',-24]]:[[10,3,'Corte ↑',0]];b.fontSize=18;b.textColor='#ead9b5';labels.forEach(function(p){var x=Math.max(8,Math.min(b.width-248,$gameMap.adjustX(p[0])*48+24-120)),y=Math.max(80,$gameMap.adjustY(p[1])*48+p[3]);b.fillRect(x,y,240,26,'rgba(12,16,18,.85)');b.drawText(p[2],x+4,y,232,26,'center');});this._courtLabels.visible=!$gameMessage.isBusy();
 };
})();
