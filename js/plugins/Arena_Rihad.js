/*:
 * @plugindesc v0.1.0 M02-03A chegada mínima, orientação e repouso em Rihad.
 * @author Codex
 * @help Após Arena_CampaignConfig e Arena_Continuation. ArenaRihad.json.
 * Chegada real conserva recursos. Amostra técnica usa fixtures/RAM existentes;
 * slots e backups normais permanecem bloqueados nela. Sem encontros/corte/Ria.
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
   ArenaContinuation.registerCampaignDestination(c.arrival);configured=true;
  }return true;
 };
 function here(){return $gameMap&&$gameMap.mapId()===$arenaRihad.arrival.mapId;}
 function message(interpreter,texts){
  if(!here()||$gameParty.inBattle()||$gameMessage.isBusy()||!(interpreter instanceof Game_Interpreter))return false;
  texts.forEach(function(t){$gameMessage.add(t);});interpreter.setWaitMode('message');return true;
 }
 ArenaRihad={
  inform:function(i){
   var q=ArenaQuests.snapshot('MQ02'),stage=q&&q.stage||0;
   if(stage<20)return message(i,['Você chegou a Rihad, no sul de Hammerfell.','Há um lugar de repouso na plataforma a leste.',
    'Esta amostra termina na chegada. A visão de Ria,','a corte e os arredores virão em próximos recortes.']);
   return message(i,['Procura notícias de Fang Lair? Pergunte na corte.','O palácio fica junto à muralha da cidade.',
    'A corte ainda não está acessível nesta amostra.']);
  },
  arrivalNotice:function(i){return message(i,['Rihad · chegada pela estrada.','A viagem desde a prisão foi condensada.',
   'Amostra provisória; sem retorno à prisão.']);},
  preview:function(){return ArenaContinuation.previewArrival($arenaRihad.arrival);}
 };
 var terminateMessage=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminateMessage.apply(this,arguments);if(here()){
  $gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();
 }};
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  mapLoaded.apply(this,arguments);
  if(here()&&ArenaContinuation.labActive()&&ArenaContinuation.status().code==='arrived'&&!ArenaPersistence.snapshot().quests.MQ02)ArenaPersistence.setQuest('MQ02',10,{},false);
 };
 // Use the existing RAM laboratory, with no route to personal save slots.
 var list=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){list.apply(this,arguments);this.addCommand('Rihad · chegada (teste RAM)','arenaRihadPreview');};
 var title=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){title.apply(this,arguments);this._commandWindow.setHandler('arenaRihadPreview',ArenaRihad.preview);};
 var commands=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){commands.apply(this,arguments);if(here()&&ArenaContinuation.labActive()){
  this.addCommand('Guardar chegada em RAM','arenaRihadStore');this.addCommand('Carregar chegada da RAM','arenaRihadLoad');
 }};
 var menu=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menu.apply(this,arguments);
  this._commandWindow.setHandler('arenaRihadStore',function(){ArenaContinuation.memorySave();SceneManager.pop();});
  this._commandWindow.setHandler('arenaRihadLoad',function(){if(ArenaContinuation.memoryLoad())SceneManager.goto(Scene_Map);else{SoundManager.playBuzzer();this._commandWindow.activate();}}.bind(this));
 };
 var create=Scene_Map.prototype.createDisplayObjects;
 Scene_Map.prototype.createDisplayObjects=function(){create.apply(this,arguments);if(here()){
  this._rihadCaption=new Sprite(new Bitmap(Graphics.boxWidth,76));this.addChild(this._rihadCaption);
  this._rihadMarkers=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._rihadMarkers);
 }};
 var update=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(!here()||!this._rihadCaption)return;
  var b=this._rihadCaption.bitmap;b.clear();b.fillRect(0,0,b.width,72,'rgba(12,16,18,0.92)');b.fontSize=23;b.textColor='#e1d2ae';
  b.drawText('Rihad · Hammerfell — amostra provisória',18,4,b.width-36,30);
  b.fontSize=17;b.drawText('Arquitetura/NPC de reuso · Esc: menu'+(ArenaContinuation.labActive()?' · teste RAM, sem saves pessoais':''),18,36,b.width-36,26);
  b=this._rihadMarkers.bitmap;b.clear();b.fontSize=18;b.textColor='#ead9b5';
  [[9,7,'Informante'],[15,10,'Repouso'],[10,12,'Chegada pela estrada']].forEach(function(p){
   var x=$gameMap.adjustX(p[0])*48+24,y=$gameMap.adjustY(p[1])*48-30;
   b.fillRect(x-108,y,216,26,'rgba(12,16,18,0.82)');b.drawText(p[2],x-104,y,208,26,'center');
  });
  this._rihadMarkers.visible=!$gameMessage.isBusy();
 };
})();
