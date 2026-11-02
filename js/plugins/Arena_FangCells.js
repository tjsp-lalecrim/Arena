/*:
 * @plugindesc v0.1.0 Fang Lair: amostra do enigma, chave e portal; aranhas pendentes.
 * @author Codex
 * @help Após CourtDelivery, DebugHub e núcleos Persistence/Quests/Journal.
 * ArenaFangCells.json; Map013 isolado, sem entrada da mina ou nível2.
 * Não substitui aranhas por outra espécie nem simula combate ausente.
 */
var ArenaFangCells;
(function(){'use strict';var pending=false;
 DataManager._databaseFiles.push({name:'$arenaFangCells',src:'ArenaFangCells.json'});
 // Content-contract revision only. Editor/file storage and save namespace unchanged.
 if(/^https?:$/.test(location.protocol))DataManager._databaseFiles.forEach(function(f){if(f.name==='$dataItems')f.src='Items.json?arena-data=fang-gold-key-v1';});
 function c(){return $arenaFangCells;}
 function here(){return $gameMap&&$gameMap.mapId()===c().mapId;}
 function q(){return ArenaQuests.snapshot(c().questId);}
 function receipt(){var r=q().receipts[c().receiptId];return !!r&&r.sourceId===c().sourceId&&r.itemId===c().itemId&&r.quantity===1&&r.kind==='consume';}
 function eligible(){var v=q(),r=v.receipts['MQ02.rihad.parchment'];return v.stage>=60&&!v.completed&&r&&r.sourceId==='stonekeep.parchment'&&r.kind==='deliver';}
 function valid(i,id){var e=$gameMap.event(id);return here()&&eligible()&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&ArenaNarrative.isCampaign()&&i instanceof Game_Interpreter&&i._mapId===c().mapId&&i.eventId()===id&&e&&!e._erased&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;}
 function show(i,texts){return ArenaCourt.show(i,texts);}
 function atomic(fn){var state=JsonEx.makeDeepCopy($gameSystem._persistentState),items=Object.assign({},$gameParty._items);try{var result=fn();if(result===false){$gameSystem._persistentState=state;$gameParty._items=items;}return result;}catch(e){$gameSystem._persistentState=state;$gameParty._items=items;throw e;}}
 function update(stage,flags){var v=q();ArenaPersistence.setQuest(c().questId,stage,Object.assign({},v.objectives,flags),false);}
 function opened(g){var v=q();return g.opensWith==='receipt'?receipt():g.opensWith==='correct'?v.stage>=70&&!!v.objectives.fangCellsSolved:!!v.objectives.fangSpidersReleased;}
 function sync(){if(!here())return;c().gates.forEach(function(g){var key=[c().mapId,g.eventId,'A'],value=opened(g);if($gameSelfSwitches.value(key)!==value)$gameSelfSwitches.setValue(key,value);});}
 ArenaFangCells={
  preview:function(){if(!ArenaCourtDelivery.preview())return false;pending=true;return true;},
  interact:function(i){if(!valid(i,c().riddleEventId)||$gameMessage.isBusy())return false;
   var v=q();if(v.stage>=80)return show(i,c().texts.limit);
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
  limit:function(i){return valid(i,c().limitEventId)?show(i,c().texts.limit):false;},
  brass:function(i){return valid(i,i.eventId())?show(i,['Latão sem valor. Este objeto não é a chave dourada.']):false;},
  spiderInfo:function(i){return valid(i,i.eventId())?show(i,['Aranha desta cela: encontro condicionado ainda pendente de exemplar artístico e integração. Nenhuma batalha substituta será iniciada.']):false;},
  leave:function(i){if(!valid(i,1))return false;if(ArenaContinuation.labActive())ArenaContinuation.leaveLab();else SceneManager.goto(Scene_Title);return true;},
  sync:sync,
  gateOpen:function(id){var g=c().gates.filter(function(v){return v.id===id;})[0];return !!g&&opened(g);}
 };
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var cfg=c(),a=cfg&&ArenaCampaignConfig.area(cfg.areaId),s=cfg&&ArenaCampaignConfig.source(cfg.sourceId),r=cfg&&ArenaCampaignConfig.receipt(cfg.receiptId);
  var problem=!cfg?'ArenaFangCells.json ausente':!a.ok?'área '+cfg.areaId+' ausente':a.config.mapId!==cfg.mapId?'mapa da área não corresponde a Map'+cfg.mapId:!s.ok?'fonte '+cfg.sourceId+' ausente':s.config.itemId!==cfg.itemId||s.config.areaId!==cfg.areaId||s.config.questId!==cfg.questId||s.config.quantity!==1?'fonte da chave não corresponde a item/área/quest/quantidade':!r.ok||r.config.kind!=='consume'||r.config.sourceId!==cfg.sourceId||r.config.questId!==cfg.questId?'recibo do portal incompatível':!$dataItems[cfg.itemId]?'item '+cfg.itemId+' ausente em Items.json':$dataItems[cfg.itemId].itypeId!==2?'item '+cfg.itemId+' não é importante':null;
  if(problem)throw Error('Fang Lair: '+problem+'. Confira os arquivos de dados servidos e build-fang-cells.');return true;};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===$arenaRihad.court.entry.mapId&&!$gamePlayer.isTransferring()){
  pending=false;$gamePlayer.locate(8,6);var i=new Game_Interpreter();i.setup([],2);i._branch[0]=0;if(!ArenaCourtDelivery.deliver(i))throw Error('Fang Lair: fixture de entrega falhou.');var p=c().lab;$gameTemp.clearDestination();$gamePlayer.reserveTransfer(c().mapId,p.x,p.y,p.direction,0);
 }sync();};
 var passage=Game_Map.prototype.isPassable;
 Game_Map.prototype.isPassable=function(x,y,d){if(here()&&c().gates.some(function(g){return !opened(g)&&Math.abs(x-g.origin[0])<=1&&Math.abs(y-g.origin[1])<=1;}))return false;return passage.apply(this,arguments);};
 var choice=Window_ChoiceList.prototype.start;
 Window_ChoiceList.prototype.start=function(){choice.apply(this,arguments);if(here()){this._arenaCourtAwaitNeutral=true;this._arenaCourtReadyAt=Date.now()+150;}};
 var end=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){end.apply(this,arguments);if(here()){$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();}};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(here()&&ArenaContinuation.labActive()){this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');}};
 var create=Scene_Map.prototype.createDisplayObjects,updateMap=Scene_Map.prototype.update;
 Scene_Map.prototype.createDisplayObjects=function(){create.apply(this,arguments);if(here()){this._fangLabels=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._fangLabels);}};
 Scene_Map.prototype.update=function(){updateMap.apply(this,arguments);if(!this._fangLabels)return;var b=this._fangLabels.bitmap;b.clear();this._fangLabels.visible=!$gameMessage.isBusy();if(!this._fangLabels.visible)return;b.fillRect(0,0,b.width,70,'rgba(8,14,18,.94)');b.fontSize=22;b.textColor='#ead9b5';b.drawText('Fang Lair — celas / amostra funcional',16,4,b.width-32,30);b.fontSize=16;b.drawText('Materiais/portas provisórios · aranhas sem combate · Esc: menu',16,38,b.width-32,24);
  function label(p,text){var x=$gameMap.adjustX(p[0])*48+24,y=$gameMap.adjustY(p[1])*48-28;if(y<75||y>b.height||x<0||x>b.width)return;b.fontSize=16;b.fillRect(Math.max(0,x-148),y,296,24,'rgba(8,14,18,.85)');b.drawText(text,Math.max(0,x-144),y,288,24,'center');}
  label(c().riddle,q().stage>=80?'Portal aberto':'Portal / enigma');label(c().entry,'Retornar ao título');label(c().limit,'Escada / limite');
  [[6,48,'Cela 3'],[15,48,'Cela 2'],[24,48,'Cela 1']].forEach(function(p){label(p,p[2]);});if(ArenaPersistence.sourceStatus(c().sourceId).active)label(c().key,'Chave dourada · provisório');
  if(q().objectives.fangSpidersReleased)c().pendingSpiders.forEach(function(v){label(v.origin,'Aranha · encontro pendente');});
 };
 ArenaDebugHub.register({symbol:'arenaFangCells',name:'Fang Lair · celas (RAM)',category:'campaign',description:'Enigma, chave da Cela 2 e portal. Materiais provisórios; liberação de aranhas registrada, combate pendente.',saving:'Somente RAM · slots normais bloqueados'},ArenaFangCells.preview);
})();
