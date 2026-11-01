/*:
 * @plugindesc v0.2.0 Rihad: chegada, repouso e arredores iniciais.
 * @author Codex
 * @help Após Arena_CampaignConfig e Arena_Continuation. ArenaRihad.json.
 * Chegada real conserva recursos. Amostra técnica usa fixtures/RAM existentes;
 * slots e backups normais permanecem bloqueados nela. Sem corte; Ria em plugin próprio.
 * Veja doc/CHEGADA_RIHAD_M02_03A.md. Sem parâmetros/dependências externas.
 */
var ArenaRihad;
(function(){
 'use strict';var configured=false;
 DataManager._databaseFiles.push({name:'$arenaRihad',src:'ArenaRihad.json'});
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){
  if(!loaded.apply(this,arguments))return false;
  if(!configured){
   var c=$arenaRihad,r=c&&ArenaCampaignConfig.area(c.areaId);
   if(!c||c.schemaVersion!==1||!r.ok||r.config.mapId!==c.arrival.mapId)throw Error('Rihad: vínculo de chegada inválido.');
   var o=c.outskirts,a=o&&ArenaCampaignConfig.area(o.areaId);
   if(!o||!a.ok||a.config.mapId!==o.entry.mapId||o.return.mapId!==c.arrival.mapId||!ArenaCampaignConfig.encounters(o.areaId).ok)throw Error('Rihad: vínculo dos arredores inválido.');
   ArenaContinuation.registerCampaignDestination(c.arrival);configured=true;
  }return true;
 };
 function here(){return $gameMap&&$gameMap.mapId()===$arenaRihad.arrival.mapId;}
 function outside(){return $gameMap&&$gameMap.mapId()===$arenaRihad.outskirts.entry.mapId;}
 function route(interpreter,from,eventId,to){
  var q=ArenaQuests.snapshot('MQ02'),e=$gameMap.event(eventId);
  if(!q||q.stage<10||!ArenaNarrative.isCampaign()||$gameParty.inBattle()||$gamePlayer.isTransferring()||$gameMessage.isBusy()||
   $gameMap.mapId()!==from||!(interpreter instanceof Game_Interpreter)||interpreter.eventId()!==eventId||interpreter._mapId!==from||!e||e._erased||$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1)return false;
  $gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+150};
  $gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);return true;
 }
 function message(interpreter,texts){
  if(!here()||$gameParty.inBattle()||$gameMessage.isBusy()||!(interpreter instanceof Game_Interpreter))return false;
  texts.forEach(function(t){$gameMessage.add(t);});interpreter.setWaitMode('message');return true;
 }
 ArenaRihad={
  inform:function(i){
   var q=ArenaQuests.snapshot('MQ02'),stage=q&&q.stage||0;
   if(stage<20)return message(i,['Você chegou a Rihad, no sul de Hammerfell.','Há um lugar de repouso na plataforma a leste.',
    'Há ratos nos arredores, pelo acesso a leste.',
    'Busque notícias entre os moradores antes da audiência.']);
   return message(i,['Procura notícias de Fang Lair? Pergunte na corte.','O palácio fica junto à muralha da cidade.',
    'A entrada da corte fica ao norte da esplanada.']);
  },
  arrivalNotice:function(i){return message(i,['Rihad · chegada após viagem condensada.','Esta estrada não é uma saída física da prisão.',
   'Amostra provisória; sem retorno à prisão.']);},
  preview:function(){return ArenaContinuation.previewArrival($arenaRihad.arrival,true);},
  visitOutskirts:function(i){var o=$arenaRihad.outskirts;return route(i,$arenaRihad.arrival.mapId,o.accessEventId,o.entry);},
  returnToArrival:function(i){var o=$arenaRihad.outskirts;return route(i,o.entry.mapId,o.returnEventId,o.return);}
 };
 var terminateMessage=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminateMessage.apply(this,arguments);if(here()||outside()){
  $gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();
 }};
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  if(!$gamePlayer.isTransferring()&&here()&&!$gameMap.event($arenaRihad.outskirts.accessEventId)&&$dataMap.events[$arenaRihad.outskirts.accessEventId]){
   var id=$arenaRihad.outskirts.accessEventId;$gameMap._events[id]=new Game_Event($gameMap.mapId(),id);
  }
  mapLoaded.apply(this,arguments);
  if(here()&&ArenaContinuation.labActive()&&ArenaContinuation.status().code==='arrived'&&!ArenaPersistence.snapshot().quests.MQ02)ArenaPersistence.setQuest('MQ02',10,{},false);
 };
 // Use the existing RAM laboratory, with no route to personal save slots.
 var list=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){list.apply(this,arguments);this.addCommand('Rihad · chegada nível 1 (RAM)','arenaRihadPreview');};
 var title=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){title.apply(this,arguments);this._commandWindow.setHandler('arenaRihadPreview',ArenaRihad.preview);};
 var commands=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){commands.apply(this,arguments);if((here()||outside())&&ArenaContinuation.labActive()){
  this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');
 }};
 var menu=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menu.apply(this,arguments);
  this._commandWindow.setHandler('arenaRihadStore',function(){ArenaContinuation.memorySave();SceneManager.pop();});
  this._commandWindow.setHandler('arenaRihadLoad',function(){if(ArenaContinuation.memoryLoad())SceneManager.goto(Scene_Map);else{SoundManager.playBuzzer();this._commandWindow.activate();}}.bind(this));
 };
 var create=Scene_Map.prototype.createDisplayObjects;
 Scene_Map.prototype.createDisplayObjects=function(){create.apply(this,arguments);if(here()||outside()){
  this._rihadCaption=new Sprite(new Bitmap(Graphics.boxWidth,76));this.addChild(this._rihadCaption);
  this._rihadMarkers=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._rihadMarkers);
 }};
 var update=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(!(here()||outside())||!this._rihadCaption)return;
  var b=this._rihadCaption.bitmap;b.clear();b.fillRect(0,0,b.width,72,'rgba(12,16,18,0.92)');b.fontSize=23;b.textColor='#e1d2ae';
  b.drawText((here()?'Rihad · Hammerfell':'Arredores de Rihad')+' — amostra provisória',18,4,b.width-36,30);
  b.fontSize=17;b.drawText('Materiais de reuso · Esc: menu'+(ArenaContinuation.labActive()?' · teste RAM, sem saves pessoais':''),18,36,b.width-36,26);
  b=this._rihadMarkers.bitmap;b.clear();b.fontSize=18;b.textColor='#ead9b5';
  var markers=here()?[[9,7,'Informante'],[15,10,'Repouso'],[10,12,'Chegada pela estrada'],[18,9,'Arredores →',-96]]:[[2,9,'← Esplanada de Rihad']];
  markers.forEach(function(p){
   var x=Math.max(8,Math.min(Graphics.boxWidth-224,$gameMap.adjustX(p[0])*48+24-108)),y=$gameMap.adjustY(p[1])*48+(p[3]||-30);
   b.fillRect(x,y,216,26,'rgba(12,16,18,0.82)');b.drawText(p[2],x+4,y,208,26,'center');
  });
  this._rihadMarkers.visible=!$gameMessage.isBusy();
 };
})();
