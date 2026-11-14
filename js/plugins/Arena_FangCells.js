/*:
 * @plugindesc v0.7.0 Fang Lair: celas opcionais de tesouro.
 * @author Codex
 * @help Após CourtDelivery, DebugHub e núcleos Persistence/Quests/Journal.
 * ArenaFangCells.json; Map013 e Map017, incluindo a sala do fragmento.
 */
var ArenaFangCells;
(function(){'use strict';var pending=false;
 DataManager._databaseFiles.push({name:'$arenaFangCells',src:'ArenaFangCells.json'});
 // Content-contract revision only. Editor/file storage and save namespace unchanged.
 if(/^https?:$/.test(location.protocol))DataManager._databaseFiles.forEach(function(f){if(f.name==='$dataItems')f.src='Items.json?arena-data=fang-brass-key-v1';});
 function c(){return $arenaFangCells;}
 function here(){return $gameMap&&$gameMap.mapId()===c().mapId;}
 function below(){return $gameMap&&$gameMap.mapId()===c().lower.mapId;}
 function lowerDoorOpen(){return q().stage>=90&&!!q().objectives.fangLowerExplored;}
 function syncLower(){
  var key=[c().lower.mapId,4,'A'],opened=lowerDoorOpen();
  if($gameSelfSwitches.value(key)!==opened)$gameSelfSwitches.setValue(key,opened);
 }
 function q(){return ArenaQuests.snapshot(c().questId);}
 function receipt(){var r=q().receipts[c().receiptId];return !!r&&r.sourceId===c().sourceId&&r.itemId===c().itemId&&r.quantity===1&&r.kind==='consume';}
 var knownDestination=ArenaCourtDelivery.destination;
 function destination(){
  var result=knownDestination.call(ArenaCourtDelivery),area=ArenaCampaignConfig.area(c().areaId);
  if(result.known&&area.ok&&area.config.mapId===c().mapId) return {id:result.id,known:true,available:true};
  return result;
 }
 ArenaCourtDelivery.destination=destination;
 function road(i){
  var route=ArenaStonekeep.configuration(),e=$gameMap.event(route.travelEventId);
  return destination().available&&ArenaNarrative.isCampaign()&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&!$gameMessage.isBusy()&&
   $gameMap.mapId()===$arenaRihad.arrival.mapId&&i instanceof Game_Interpreter&&i._mapId===$gameMap.mapId()&&
   i.eventId()===route.travelEventId&&e&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;
 }
 function transfer(to){
  $gameTemp.clearDestination();
  $gameTemp._arenaCourtTravelFence=true;
  $gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);
  return true;
 }
 function valid(i,id,mapId){
  mapId=mapId||c().mapId;
  var e=$gameMap.event(id);
  return $gameMap.mapId()===mapId&&destination().available&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&
   ArenaNarrative.isCampaign()&&i instanceof Game_Interpreter&&i._mapId===mapId&&i.eventId()===id&&
   e&&!e._erased&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;
 }
 function lowerValid(i,id){
  return valid(i,id,c().lower.mapId)&&receipt()&&q().stage>=80&&!$gameMessage.isBusy();
 }
 function canLeave(i){return valid(i,1)&&!$gameMessage.isBusy();}
 function hasStaffPiece(){return $gameParty.hasItem($dataItems[c().lower.staffPiece.itemId]);}
 function startRetaliation(){
  if($gameTemp._arenaEncounterLock||SceneManager.isSceneChanging())return false;
  var encounter=c().retaliation.encounter;
  $gameTemp._arenaEncounterLock={id:encounter.id};
  BattleManager.setup(encounter.troopId,false,false);
  // Local to this battle. Other skeletons keep their original name and data.
  $gameTroop.members()[0].originalName=function(){return encounter.name;};
  BattleManager.setEventCallback(function(result){
   if(result!==0||!$gameTroop.isAllDead()||$gameParty.isAllDead()||!hasStaffPiece())return;
   var quest=q();
   if(quest.stage!==100||quest.completed||!quest.objectives.fangTharnVisionRead)return;
   ArenaPersistence.setQuest(c().questId,110,Object.assign({},quest.objectives,{fangRetaliationWon:true}),true);
  });
  $gamePlayer.makeEncounterCount();
  $gameTemp.clearDestination();
  SceneManager.push(Scene_Battle);
  return true;
 }
 function show(i,texts){return ArenaCourt.show(i,texts);}
 function atomic(fn){var state=JsonEx.makeDeepCopy($gameSystem._persistentState),items=Object.assign({},$gameParty._items);try{var result=fn();if(result===false){$gameSystem._persistentState=state;$gameParty._items=items;}return result;}catch(e){$gameSystem._persistentState=state;$gameParty._items=items;throw e;}}
 function update(stage,flags){var v=q();ArenaPersistence.setQuest(c().questId,stage,Object.assign({},v.objectives,flags),false);}
 function opened(g){var v=q();return g.opensWith==='receipt'?receipt():g.opensWith==='correct'?v.stage>=70&&!!v.objectives.fangCellsSolved:!!v.objectives.fangSpidersReleased;}
 function treasureSwitch(eventId,letter){return [c().mapId,eventId,letter||'A'];}
 function treasureCellOpen(cell){return $gameSelfSwitches.value(treasureSwitch(cell.doorEventId));}
 function syncTreasure(){
  var optional=c().optionalTreasure,receipts=ArenaLoot.snapshot().receipts;
  optional.keys.forEach(function(key){
   var gate=c().gates.find(function(g){return g.id===key.cellGateId;}),sw=treasureSwitch(key.eventId,'B');
   if($gameSelfSwitches.value(sw)!==opened(gate))$gameSelfSwitches.setValue(sw,opened(gate));
  });
  optional.cells.forEach(function(cell){
   var access=$gameMap.event(cell.interactEventId);
   if(access)access.setThrough(treasureCellOpen(cell));
   cell.treasures.forEach(function(chest){
    var sw=treasureSwitch(chest.eventId),taken=!!receipts['container/'+chest.id];
    if($gameSelfSwitches.value(sw)!==taken)$gameSelfSwitches.setValue(sw,taken);
   });
  });
 }
 function sync(){
  if(!here())return;
  syncTreasure();
  c().gates.forEach(function(g){
   var key=[c().mapId,g.eventId,'A'],value=opened(g);
   if($gameSelfSwitches.value(key)!==value)$gameSelfSwitches.setValue(key,value);
  });
  var released=!!q().objectives.fangSpidersReleased;
  var changed=false;
  c().spiders.forEach(function(spider){
   var key=[c().mapId,spider.eventId,'B'];
   if($gameSelfSwitches.value(key)===released)return;
   $gameSelfSwitches.setValue(key,released);
   changed=true;
  });
  if(changed){
   $gameMap.refresh();
   ArenaEncounters.sync();
  }
 }
 ArenaFangCells={
  destination:destination,
  offerTravel:function(i){
   if(!road(i))return false;
   i.setupChild([
    {code:102,indent:0,parameters:[['Viajar para Fang Lair','Viajar para Stonekeep','Ficar em Rihad'],2,2,2,0]},
    {code:402,indent:0,parameters:[0,'Viajar para Fang Lair']},
    {code:355,indent:1,parameters:['ArenaFangCells.travel(this);']},
    {code:402,indent:0,parameters:[1,'Viajar para Stonekeep']},
    {code:355,indent:1,parameters:['ArenaStonekeep.offer(this);']},
    {code:402,indent:0,parameters:[2,'Ficar em Rihad']},
    {code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]}
   ],i.eventId());return true;
  },
  travel:function(i){
   return road(i)&&i._branch[0]===0&&transfer({mapId:c().mapId,x:c().entry[0],y:c().entry[1],direction:2});
  },
  describe:function(i,block){
   var id=block==='arrival'?7:8,flag=block==='arrival'?'fangEntryRead':'fangCellsSeen';
   if(!valid(i,id)||$gameMessage.isBusy()||q().objectives[flag])return false;
   var flags={};flags[flag]=true;
   update(q().stage,flags);
   return show(i,c().texts[block]);
  },
  preview:function(){if(!ArenaCourtDelivery.preview())return false;pending=true;return true;},
  interact:function(i){if(!valid(i,c().riddleEventId)||$gameMessage.isBusy())return false;
   var v=q();if(v.stage>=80)return show(i,c().texts.opened);
   if(v.stage===70){if(ArenaPersistence.sourceStatus(c().sourceId).missing)return show(i,c().texts.missing);return this.openPortal(i);}
   show(i,c().texts.warning.concat(c().texts.riddle));var list=i._childInterpreter._list;list.pop();list.push({code:102,indent:0,parameters:[['Cela 1','Cela 2','Cela 3','Voltar'],3,3,2,0]},
    {code:402,indent:0,parameters:[0,'Cela 1']},{code:355,indent:1,parameters:['ArenaFangCells.answer(this,1);']},
    {code:402,indent:0,parameters:[1,'Cela 2']},{code:355,indent:1,parameters:['ArenaFangCells.answer(this,2);']},
    {code:402,indent:0,parameters:[2,'Cela 3']},{code:355,indent:1,parameters:['ArenaFangCells.answer(this,3);']},
    {code:402,indent:0,parameters:[3,'Voltar']},{code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});return true;
  },
  answer:function(i,cell){if(!valid(i,c().riddleEventId)||q().stage!==60||i._branch[0]!==cell-1||[1,2,3].indexOf(cell)<0)return false;
   if(cell===2){update(70,{fangCellsSolved:true});sync();return show(i,c().texts.correct);}
   if(!q().objectives.fangSpidersReleased)update(60,{fangSpidersReleased:true});sync();return show(i,c().texts.wrong);
  },
  takeKey:function(i){if(!valid(i,c().keyEventId))return false;var status=ArenaPersistence.sourceStatus(c().sourceId);if(!status.active)return false;if(!status.missing)return show(i,['A chave dourada já está no inventário.']);
   var ok=atomic(function(){if(ArenaPersistence.claimSource(c().sourceId)!=='granted')return false;update(70,{fangKeyFound:true});return true;});return ok?show(i,['Você encontrou a chave dourada da Cela 2. Ela abre o portal junto às celas.']):false;
  },
  openPortal:function(i){if(!valid(i,c().riddleEventId)||q().stage!==70||receipt())return false;
   if(ArenaPersistence.sourceStatus(c().sourceId).missing)return show(i,c().texts.missing);
   var ok=atomic(function(){if(ArenaPersistence.consumeImportant(c().sourceId,c().receiptId,'consume')!=='consumed')return false;update(80,{fangPortalOpened:true});return true;});if(!ok)return false;sync();return show(i,c().texts.opened);
  },
  descend:function(i){
   if(!valid(i,c().limitEventId)||!receipt()||q().stage<80||$gameMessage.isBusy())return false;
   var lower=c().lower;
   return transfer({mapId:lower.mapId,x:lower.entry[0],y:lower.entry[1],direction:8});
  },
  ascend:function(i){
   if(!lowerValid(i,1))return false;
   var upper=c().lower.return;
   return transfer({mapId:c().mapId,x:upper[0],y:upper[1],direction:8});
  },
  lowerRiddle:function(i){
   if(!lowerValid(i,2))return false;
   var texts=c().lower.texts;
   if(lowerDoorOpen())return show(i,texts.opened);
   if(q().stage!==80)return false;
   show(i,texts.riddle);
   var list=i._childInterpreter._list;
   list.pop();
   list.push(
    {code:102,indent:0,parameters:[['Um pássaro','Uma luva ou manopla','Uma mão','Voltar'],3,3,2,0]},
    {code:402,indent:0,parameters:[0,'Um pássaro']},
    {code:355,indent:1,parameters:['ArenaFangCells.lowerAnswer(this);']},
    {code:402,indent:0,parameters:[1,'Uma luva ou manopla']},
    {code:355,indent:1,parameters:['ArenaFangCells.lowerAnswer(this);']},
    {code:402,indent:0,parameters:[2,'Uma mão']},
    {code:355,indent:1,parameters:['ArenaFangCells.lowerAnswer(this);']},
    {code:402,indent:0,parameters:[3,'Voltar']},
    {code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});
   return true;
  },
  lowerAnswer:function(i){
   if(!lowerValid(i,2)||q().stage!==80)return false;
   var answer=i._branch[0],texts=c().lower.texts;
   if(answer===0||answer===2)return show(i,texts.wrong);
   if(answer!==1)return false;
   update(90,{fangLowerExplored:true});
   syncLower();
   return show(i,texts.correct);
  },
  takeStaffPiece:function(i){
   var staff=c().lower.staffPiece;
   if(!lowerValid(i,staff.eventId)||!lowerDoorOpen())return false;
   var first=q().stage===90,status=ArenaPersistence.sourceStatus(staff.sourceId);
   if(!status.active||!status.missing&&!first)return false;
   var ok=atomic(function(){
    if(status.missing&&ArenaPersistence.claimSource(staff.sourceId)!=='granted')return false;
    if(first)update(100,{fangStaffPieceRecovered:true});
    return true;
   });
   return ok&&first?show(i,staff.text):ok;
  },
  brass:function(i){
   var optional=c().optionalTreasure,key=optional.keys.find(function(k){return k.eventId===i.eventId();});
   if(!key||!valid(i,key.eventId)||$gameMessage.isBusy()||$gameSelfSwitches.value(treasureSwitch(key.eventId)))return false;
   var gate=c().gates.find(function(g){return g.id===key.cellGateId;});
   if(!opened(gate))return false;
   var item=$dataItems[optional.itemId],count=$gameParty.numItems(item);
   $gameParty.gainItem(item,1);
   if($gameParty.numItems(item)!==count+1)return false;
   $gameSelfSwitches.setValue(treasureSwitch(key.eventId),true);
   return show(i,['Você recolheu uma chave de latão. Ela abre uma cela de tesouro.']);
  },
  openTreasureCell:function(i){
   var optional=c().optionalTreasure,cell=optional.cells.find(function(v){return v.interactEventId===i.eventId();});
   if(!cell||!valid(i,cell.interactEventId)||$gameMessage.isBusy()||treasureCellOpen(cell))return false;
   var item=$dataItems[optional.itemId];
   if(!$gameParty.hasItem(item))return show(i,['A fechadura exige uma chave de latão.']);
   $gameParty.loseItem(item,1);
   $gameSelfSwitches.setValue(treasureSwitch(cell.doorEventId),true);
   $gameMap.event(cell.interactEventId).setThrough(true);
   return true;
  },
  takeTreasure:function(i){
   var cells=c().optionalTreasure.cells;
   var cell=cells.find(function(v){return v.treasures.some(function(t){return t.eventId===i.eventId();});});
   if(!cell||!valid(i,i.eventId())||$gameMessage.isBusy()||!treasureCellOpen(cell))return false;
   var chest=cell.treasures.find(function(t){return t.eventId===i.eventId();});
   if(ArenaLoot.snapshot().receipts['container/'+chest.id])return false;
   var result=ArenaLoot.claimContainer(chest.id,$arenaLoot.enemies[String($arenaQuests.treasureTableEnemyId)],$arenaQuests.treasureFallbackGold);
   syncTreasure();
   var lines=result.received.map(function(row){
    var item=row.kind==='gold'?null:ArenaInventory.resolve(row);
    return (item?item.name:'Ouro')+' ×'+row.quantity;
   });
   if(result.pending.length)lines.push('Reserva salva para quando houver espaço.');
   return show(i,lines);
  },
  leave:function(i){
   if(!canLeave(i))return false;
   if(ArenaContinuation.labActive()){ArenaContinuation.leaveLab();return true;}
   var quest=q();
   if(quest.stage!==100)return transfer($arenaRihad.arrival);
   var scene=c().retaliation;
   if(!hasStaffPiece())return show(i,[scene.missing]);
   if(quest.objectives.fangTharnVisionRead)return startRetaliation();
   show(i,scene.blocks.map(function(block){return block.text;}));
   var list=i._childInterpreter._list;
   list.splice(list.length-1,0,{code:355,indent:0,parameters:['ArenaFangCells.finishTharnVision(this);']});
   return true;
  },
  finishTharnVision:function(i){
   if(!canLeave(i)||ArenaContinuation.labActive()||q().stage!==100||q().objectives.fangTharnVisionRead||!hasStaffPiece())return false;
   update(100,{fangTharnVisionRead:true});
   return startRetaliation();
  },
  sync:sync,
  gateOpen:function(id){var g=c().gates.filter(function(v){return v.id===id;})[0];return !!g&&opened(g);}
 };
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var cfg=c(),a=cfg&&ArenaCampaignConfig.area(cfg.areaId),s=cfg&&ArenaCampaignConfig.source(cfg.sourceId),r=cfg&&ArenaCampaignConfig.receipt(cfg.receiptId);
  var problem=!cfg?'ArenaFangCells.json ausente':!a.ok?'área '+cfg.areaId+' ausente':a.config.mapId!==cfg.mapId?'mapa da área não corresponde a Map'+cfg.mapId:!s.ok?'fonte '+cfg.sourceId+' ausente':s.config.itemId!==cfg.itemId||s.config.areaId!==cfg.areaId||s.config.questId!==cfg.questId||s.config.quantity!==1?'fonte da chave não corresponde a item/área/quest/quantidade':!r.ok||r.config.kind!=='consume'||r.config.sourceId!==cfg.sourceId||r.config.questId!==cfg.questId?'recibo do portal incompatível':!$dataItems[cfg.itemId]?'item '+cfg.itemId+' ausente em Items.json':$dataItems[cfg.itemId].itypeId!==2?'item '+cfg.itemId+' não é importante':null;
  var lower=cfg&&cfg.lower,lowerArea=lower&&ArenaCampaignConfig.area(lower.areaId);
  if(!problem&&(!lowerArea||!lowerArea.ok||lowerArea.config.mapId!==lower.mapId||!$dataMapInfos[lower.mapId]))problem='vínculo do segundo nível inválido';
  if(!problem){
   var staff=lower.staffPiece,source=staff&&ArenaCampaignConfig.source(staff.sourceId),item=staff&&$dataItems[staff.itemId];
   if(!source||!source.ok||source.config.questId!==cfg.questId||source.config.areaId!==lower.areaId||source.config.itemId!==staff.itemId||source.config.quantity!==1)problem='fonte do fragmento incompatível';
   else if(!item||item.itypeId!==2||item.consumable||item.occasion!==3||item.price!==0)problem='item importante '+staff.itemId+' do fragmento inválido';
  }
  if(!problem){
   var encounter=cfg.retaliation&&cfg.retaliation.encounter,troop=encounter&&$dataTroops[encounter.troopId];
   if(!troop||troop.members.length!==1||troop.members[0].hidden||troop.members[0].enemyId!==encounter.enemyId||!$dataEnemies[encounter.enemyId])problem='tropa do Servo de Tharn incompatível';
  }
  var optional=cfg&&cfg.optionalTreasure,brass=optional&&$dataItems[optional.itemId];
  if(!problem&&(!brass||brass.itypeId!==2))problem='chave de latão importante incompatível';
  if(problem)throw Error('Fang Lair: '+problem+'. Confira os arquivos de dados servidos e build-fang-cells.');return true;};
 // A serialized copy of the isolated crop has incompatible event coordinates.
 var createMap=Scene_Map.prototype.create;
 Scene_Map.prototype.create=function(){
  var portal=here()&&$gameMap.event(c().riddleEventId);
  if(portal&&portal.x===33&&(!$gamePlayer.isTransferring()||$gamePlayer.newMapId()===c().mapId)){
   $gamePlayer.reserveTransfer(c().mapId,c().entry[0],c().entry[1],2,0);
   $gamePlayer.requestMapReload();
  }
  // Earlier campaign saves have the same upper-floor positions but no treasure events.
  if(here()&&!$gameMap.event(c().optionalTreasure.cells[0].doorEventId)){
   if(!$gamePlayer.isTransferring())$gamePlayer.reserveTransfer(c().mapId,$gamePlayer.x,$gamePlayer.y,$gamePlayer.direction(),2);
   if($gamePlayer.newMapId()===c().mapId)$gamePlayer.requestMapReload();
  }
  // The expanded lower crop preserves every prior source cell, translated in MV.
  var lower=c().lower,stair=below()&&$gameMap.event(1);
  if(stair&&stair.x===lower.previousStair[0]&&stair.y===lower.previousStair[1]&&
     (!$gamePlayer.isTransferring()||$gamePlayer.newMapId()===lower.mapId)){
   var x=$gamePlayer.isTransferring()?$gamePlayer._newX:$gamePlayer.x;
   var y=$gamePlayer.isTransferring()?$gamePlayer._newY:$gamePlayer.y;
   var direction=$gamePlayer.isTransferring()?$gamePlayer._newDirection:$gamePlayer.direction();
   x+=lower.stair[0]-stair.x;
   y+=lower.stair[1]-stair.y;
   var wall=lower.legacyWallRelocation;
   if(x>=wall.x[0]&&x<=wall.x[1]&&y>=wall.y[0]&&y<=wall.y[1])x=wall.safeX;
   $gamePlayer.reserveTransfer(lower.mapId,x,y,direction,2);
   $gamePlayer.requestMapReload();
  }
  createMap.apply(this,arguments);
 };
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===$arenaRihad.court.entry.mapId&&!$gamePlayer.isTransferring()){
  pending=false;$gamePlayer.locate(8,6);var i=new Game_Interpreter();i.setup([],2);i._branch[0]=0;if(!ArenaCourtDelivery.deliver(i))throw Error('Fang Lair: fixture de entrega falhou.');var p=c().lab;$gameTemp.clearDestination();$gamePlayer.reserveTransfer(c().mapId,p.x,p.y,p.direction,0);
 }sync();if(below())syncLower();};
 var passage=Game_Map.prototype.isPassable;
 Game_Map.prototype.isPassable=function(x,y,d){
  if(below()&&Math.abs(x-c().lower.door[0])<=1&&Math.abs(y-c().lower.door[1])<=1&&!lowerDoorOpen())return false;
  if(here()&&c().gates.some(function(g){return Math.abs(x-g.origin[0])<=1&&Math.abs(y-g.origin[1])<=1&&!opened(g);}))return false;
  if(here()&&c().optionalTreasure.cells.some(function(cell){return Math.abs(x-cell.origin[0])<=1&&Math.abs(y-cell.origin[1])<=1&&!treasureCellOpen(cell);}))return false;
  return passage.apply(this,arguments);};
 var choice=Window_ChoiceList.prototype.start;
 Window_ChoiceList.prototype.start=function(){choice.apply(this,arguments);if(here()||below()||($gameMap.mapId()===$arenaRihad.arrival.mapId&&$gameMap._interpreter.eventId()===ArenaStonekeep.configuration().travelEventId)){this._arenaCourtAwaitNeutral=true;this._arenaCourtReadyAt=Date.now()+150;}};
 var end=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){end.apply(this,arguments);if(here()||below()){$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();}};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if((here()||below())&&ArenaContinuation.labActive()){this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');}};
 var create=Scene_Map.prototype.createDisplayObjects,updateMap=Scene_Map.prototype.update;
 Scene_Map.prototype.createDisplayObjects=function(){create.apply(this,arguments);if(here()||below()){this._fangLabels=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._fangLabels);}};
 Scene_Map.prototype.update=function(){updateMap.apply(this,arguments);if(!this._fangLabels)return;var b=this._fangLabels.bitmap;b.clear();this._fangLabels.visible=!$gameMessage.isBusy();if(!this._fangLabels.visible)return;b.fillRect(0,0,b.width,70,'rgba(8,14,18,.94)');b.fontSize=22;b.textColor='#ead9b5';b.drawText('Fang Lair',16,4,b.width-32,30);b.fontSize=16;b.drawText('Materiais provisórios · Esc: menu',16,38,b.width-32,24);
  function label(p,text){var x=$gameMap.adjustX(p[0])*48+24,y=$gameMap.adjustY(p[1])*48-28;if(y<75||y>b.height||x<0||x>b.width)return;b.fontSize=16;b.fillRect(Math.max(0,x-148),y,296,24,'rgba(8,14,18,.85)');b.drawText(text,Math.max(0,x-144),y,288,24,'center');}
  if(below()){
   label(c().lower.stair,'Subir para o primeiro nível');
   if(!lowerDoorOpen())label(c().lower.approach,'Segundo enigma');
   var staff=c().lower.staffPiece;
   if(lowerDoorOpen()&&ArenaPersistence.sourceStatus(staff.sourceId).missing)label(staff.position,'Primeiro fragmento · Interagir');
   return;
  }
  if(c().optionalTreasure.cells.some(function(cell){return !treasureCellOpen(cell);}))label([21,237],'Celas de tesouro');
  label(c().riddle,q().stage>=80?'Portal aberto':'Portal / enigma');label(c().entry,ArenaContinuation.labActive()?'Retornar ao título':q().stage===100?'Saída da mina':'Retornar a Rihad');label(c().limit,'Descer para o segundo nível');
  [[9,288,'Cela 3'],[18,288,'Cela 2'],[27,288,'Cela 1']].forEach(function(p){label(p,p[2]);});if(ArenaPersistence.sourceStatus(c().sourceId).active)label(c().key,'Chave dourada · provisório');
 };
 ArenaDebugHub.register({symbol:'arenaFangCells',name:'Fang Lair · celas (RAM)',category:'campaign',description:'Enigma, chave da Cela 2 e portal. Liberação das aranhas e combate com o exemplar existente.',saving:'Somente RAM · slots normais bloqueados'},ArenaFangCells.preview);
})();
