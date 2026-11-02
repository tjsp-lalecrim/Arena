/*:
 * @plugindesc v0.1.2 Stonekeep: viagem, fonte e amostras visuais delimitadas.
 * @author Codex
 * @help Após Arena_Court/Arena_Rihad/Arena_Dungeon/Arena_Persistence.
 * Dados ArenaStonekeep.json; fonte no registro ArenaCampaign. Sem plugins externos.
 * Natação nativa delimitada; sem guardiões, entrega ou revelação de Fang Lair.
 * Fixture Stonekeep · passagem (RAM), saves pessoais bloqueados. doc/STONEKEEP_M02_04.md.
 */
var ArenaStonekeep;
(function(){
 'use strict';DataManager._databaseFiles.push({name:'$arenaStonekeep',src:/^https?:$/.test(window.location.protocol)?'ArenaStonekeep.json?arena-data=walls-v01':'ArenaStonekeep.json'});
 // Content revision, not a save namespace/build. Unversioned M01 Items.json can
 // remain fresh in Chrome's HTTP cache after the server publishes item7.
 // Keep native file URLs unchanged for MV editor/playtest.
 if(/^https?:$/.test(window.location.protocol)){
  var itemsFile=DataManager._databaseFiles.filter(function(f){return f.name==='$dataItems';})[0];
  if(!itemsFile||itemsFile.src!=='Items.json')throw Error('Stonekeep: configuração de carregamento de Items.json inesperada.');
  itemsFile.src='Items.json?arena-data=stonekeep-parchment-v1';
 }
 var materialsPending=null;
 function c(){return $arenaStonekeep;}
 function here(){return $gameMap&&$gameMap.mapId()===c().mapId;}
 function valid(i,mapId,eventId){var e=$gameMap.event(eventId);return ArenaNarrative.isCampaign()&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&!$gameMessage.isBusy()&&$gameMap.mapId()===mapId&&i instanceof Game_Interpreter&&i._mapId===mapId&&i.eventId()===eventId&&e&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;}
 function message(i,text){var w=SceneManager._scene._messageWindow,list=[];w.resetFontSettings();MVJournalModel.wrap(text,w.contentsWidth()-8,w.textWidth.bind(w)).forEach(function(t,n){if(n%4===0)list.push({code:101,indent:0,parameters:['',0,0,2]});list.push({code:401,indent:0,parameters:[t]});});list.push({code:0,indent:0,parameters:[]});i.setupChild(list,i.eventId());return true;}
 function transfer(to){$gameTemp.clearDestination();$gameTemp._arenaCourtTravelFence=true;$gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);return true;}
 ArenaStonekeep={
  known:function(){return ArenaQuests.snapshot('MQ02').stage>=40;},
  offer:function(i){if(!valid(i,c().return.mapId,c().travelEventId)||!this.known())return false;
   i.setupChild([{code:101,indent:0,parameters:['',0,0,2]},{code:401,indent:0,parameters:['Viajar até Stonekeep?']},{code:401,indent:0,parameters:['Passagem com esqueletos e ilha com ghouls.']},
    {code:102,indent:0,parameters:[['Viajar para Stonekeep','Ficar em Rihad'],1,1,2,0]},
    {code:402,indent:0,parameters:[0,'Viajar para Stonekeep']},{code:355,indent:1,parameters:['ArenaStonekeep.travel(this);']},
    {code:402,indent:0,parameters:[1,'Ficar em Rihad']},{code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]}],i.eventId());return true;
  },
  travel:function(i){return valid(i,c().return.mapId,c().travelEventId)&&i._branch[0]===0&&this.known()?transfer(c().entry):false;},
  leave:function(i){return valid(i,c().mapId,c().exitEventId)?transfer(c().return):false;},
  collect:function(i){
   if(!valid(i,c().mapId,c().sourceEventId))return false;
   var q=ArenaQuests.snapshot('MQ02'),status=ArenaPersistence.sourceStatus(c().sourceId);
   if(!status.active)return false;if(!status.missing)return message(i,'O pergaminho já está no inventário.');
   var backup=JsonEx.makeDeepCopy($gameSystem._persistentState),items=Object.assign({},$gameParty._items);
   try{if(ArenaPersistence.claimSource(c().sourceId)!=='granted')return false;
    if(q.stage===40)ArenaPersistence.setQuest('MQ02',50,Object.assign({},q.objectives,{parchmentRecovered:true}),false);
   }catch(e){$gameSystem._persistentState=backup;$gameParty._items=items;throw e;}
   return message(i,'Você encontrou o pergaminho que a corte de Rihad pode usar para descobrir a localização de Fang Lair. Volte à corte para entregar o pergaminho a Blubamka.');
  },
  preview:function(){if(!ArenaCourt.preview())return false;var q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',40,Object.assign({},q.objectives,{parchmentRequest:true}),false);return true;},
  previewMaterials:function(){if(!ArenaStonekeep.preview())return false;materialsPending=c().visualSample.entry;return true;},
  previewWall:function(id){var p=(c().wallSamples||[]).filter(function(p){return p.id===id;})[0];if(!p||!ArenaStonekeep.preview())return false;materialsPending=p.entry;return true;}
 };
 function validateBindings(){
  var cfg=c(),registry=ArenaCampaignConfig;
  function fail(detail){var diagnostics=registry&&typeof registry.diagnostics==='function'?registry.diagnostics():[];throw Error('Stonekeep: '+detail+(diagnostics.length?' Registro ArenaCampaign: '+diagnostics.join('; '):'')+' Confira os arquivos servidos ArenaCampaign.json, ArenaStonekeep.json e Items.json.');}
  if(!cfg||cfg.schemaVersion!==1)fail('ArenaStonekeep.json ausente ou com versão inválida.');
  if(!registry||typeof registry.ready!=='function')fail('Arena_CampaignConfig ausente; confira a ordem dos plugins.');
  if(!registry.ready())fail('registro ArenaCampaign ainda não inicializado.');
  var area=registry.area(cfg.areaId);
  if(!area.ok)fail('área "'+cfg.areaId+'" não encontrada ('+area.code+').');
  if(area.config.mapId!==cfg.mapId)fail('área "'+cfg.areaId+'": mapId='+JSON.stringify(area.config.mapId)+'; esperado '+JSON.stringify(cfg.mapId)+'.');
  var source=registry.source(cfg.sourceId);
  if(!source.ok)fail('fonte "'+cfg.sourceId+'" não encontrada ('+source.code+').');
  if(source.config.itemId!==cfg.itemId)fail('fonte "'+cfg.sourceId+'": itemId='+JSON.stringify(source.config.itemId)+'; esperado '+JSON.stringify(cfg.itemId)+'.');
  var item=$dataItems[cfg.itemId];
  if(!item)fail('item '+cfg.itemId+' ausente em Items.json.');
  if(item.itypeId!==2)fail('item '+cfg.itemId+' não é importante: itypeId='+JSON.stringify(item.itypeId)+'; esperado 2.');
 }
 var loaded=DataManager.isDatabaseLoaded,registered=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!registered){validateBindings();ArenaDungeon.registerSwimming(c().mapId,c().swimming);registered=true;}return true;};
 var destination=ArenaCourt.destination;
 ArenaCourt.destination=function(){var d=destination();if(window.$arenaStonekeep&&ArenaCampaignConfig.area(c().areaId).ok)d.available=d.known;return d.available?{id:d.id,known:d.known,available:true}:d;};
 var notice=ArenaRihad.arrivalNotice;
 ArenaRihad.arrivalNotice=function(i){return ArenaStonekeep.known()?ArenaStonekeep.offer(i):notice.apply(this,arguments);};
 var choice=Window_ChoiceList.prototype.start;
 Window_ChoiceList.prototype.start=function(){choice.apply(this,arguments);if($gameMap.mapId()===c().return.mapId&&$gameMap._interpreter.eventId()===c().travelEventId){this._arenaCourtAwaitNeutral=true;this._arenaCourtReadyAt=Date.now()+150;}};
 var terminate=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminate.apply(this,arguments);if(here()||$gameMap.mapId()===c().return.mapId){$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();}};
 var title=Window_TitleCommand.prototype.makeCommandList,create=Scene_Title.prototype.createCommandWindow;
 Window_TitleCommand.prototype.makeCommandList=function(){title.apply(this,arguments);this.addCommand('Stonekeep · passagem (RAM)','arenaStonekeep');this.addCommand('Stonekeep · materiais (RAM)','arenaStonekeepMaterials');this.addCommand('Stonekeep · CASK (RAM)','arenaStonekeepCask');this.addCommand('Stonekeep · CASL (RAM)','arenaStonekeepCasl');};
 Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaStonekeep',ArenaStonekeep.preview);this._commandWindow.setHandler('arenaStonekeepMaterials',ArenaStonekeep.previewMaterials);this._commandWindow.setHandler('arenaStonekeepCask',function(){ArenaStonekeep.previewWall('cask');});this._commandWindow.setHandler('arenaStonekeepCasl',function(){ArenaStonekeep.previewWall('casl');});};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(here()&&ArenaContinuation.labActive()){this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');}};
 // The existing lab validates/loads Rihad asynchronously. Wait for that arrival
 // before requesting the optional visual sample; never replace its pending map.
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(materialsPending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c().return.mapId){var d=materialsPending;materialsPending=null;transfer(d);}};
 var display=Scene_Map.prototype.createDisplayObjects,update=Scene_Map.prototype.update;
 Scene_Map.prototype.createDisplayObjects=function(){
  // A saved Game_Map keeps its old tilesetId even when Map012 now uses C.
  // Synchronize only this known visual revision, before native bitmap loading.
  if(here()&&$gameMap.tilesetId()===4&&$dataMap.tilesetId===5)$gameMap.changeTileset(5);
  display.apply(this,arguments);if(here()||$gameMap.mapId()===c().return.mapId){this._stoneLabels=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._stoneLabels);}
 };
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(!this._stoneLabels)return;var b=this._stoneLabels.bitmap;b.clear();this._stoneLabels.visible=!$gameMessage.isBusy();
  function label(x,y,t){var px=$gameMap.adjustX(x)*48+24,py=$gameMap.adjustY(y)*48-26;if(px<0||px>b.width||py<72||py>b.height)return;b.fontSize=17;b.fillRect(px-155,py,310,26,'rgba(8,14,18,.9)');b.textColor='#ead9b5';b.drawText(t,px-151,py,302,26,'center');}
  if(here()){b.fillRect(0,0,b.width,70,'rgba(8,14,18,.94)');b.fontSize=22;b.textColor='#ead9b5';b.drawText('Stonekeep — amostra da passagem e ilha',16,3,b.width-32,30);b.fontSize=16;b.drawText('3 ratos · 7 esqueletos · 6 ghouls · lobos pendentes',16,37,b.width-32,26);if(ArenaPersistence.sourceStatus(c().sourceId).missing)label(c().source[0],c().source[1],'Pergaminho · marcador provisório');label(c().exit[0],c().exit[1],'Retornar a Rihad ↑');}
  else if(ArenaStonekeep.known())label(10,12,'Estrada · Stonekeep ↓');
 };
})();
