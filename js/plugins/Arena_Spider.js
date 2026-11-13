/*:
 * @plugindesc v0.2.0 Aranha de Stonekeep: batalha e caminhada do mesmo exemplar RAM.
 * @author Codex
 * @help Após Minotaur/Orc/LizardPatrol/DebugHub/Continuation/Encounters/Battle. Recompensas RAM separadas.
 * SPIDER.DFA/ITEM40 é alias original: Spider/SPIDER@.CFA. Sala Map016 só em memória.
 */
var ArenaSpider;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaSpider',src:'ArenaSpider.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function active(){return !!($gameSystem&&$gameSystem._arenaSpiderWalkSession&&ArenaContinuation.labActive());}
 function here(){return active()&&$gameMap.mapId()===$arenaSpider.entry.mapId;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaSpider,t=c&&$dataTroops[c.troopId];
  if(!c||!$dataEnemies[c.enemyId]||!t||t.members.length!==1||t.members[0].enemyId!==c.enemyId||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId]||!$dataMapInfos[c.entry.mapId]||c.encounters.entries.length!==1||c.campaign.enabled!==true||!Number.isInteger(c.campaign.exp)||c.campaign.exp<1||!c.campaign.loot)throw Error('Aranha: vínculos do exemplar RAM inválidos. Reconstrua build-stonekeep-spider.');return true;};
 ArenaSpider={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending='battle';return true;},
  startWalkLab:function(){if(!ArenaContinuation.previewArrival($arenaSpider.entry,true))return false;$gameSystem._arenaSpiderWalkSession=true;$gameActors.actor(1).changeLevel(2,false);pending='walk';return true;},active:active};
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){var c=$arenaSpider;if(active()&&mapId===c.entry.mapId)return{ok:true,config:{id:c.encounters.areaId,questId:'MQ02',mapId:mapId,encounters:c.encounters}};return forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===$arenaSpider.encounters.areaId?{ok:true,config:$arenaSpider.encounters}:encounters.apply(this,arguments);};
 var onMapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){var c=$arenaSpider,target=$gamePlayer.isTransferring()?$gamePlayer._newMapId:$gameMap.mapId();
  if(active()&&target===c.entry.mapId){var v=c.encounters.entries[0],e=$dataMap.events[v.eventId];if(!e||[c.roomSourceEventNote,'ArenaEncounter:'+v.id].indexOf(e.note)<0)throw Error('Aranha: sala de inspeção não corresponde ao contrato.');
   var copy=JSON.parse(JSON.stringify(e));copy.name='Aranha · inspeção RAM';copy.note='ArenaEncounter:'+v.id;copy.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];var events=$dataMap.events.slice();events[v.eventId]=copy;$dataMap=Object.assign({},$dataMap,{events:events,displayName:'Aranha · inspeção RAM'});
  }onMapLoaded.apply(this,arguments);
 };
 var exp=Game_Enemy.prototype.exp,table=ArenaLoot.tableForEnemy;
 function technical(enemy){return enemy.enemyId()===$arenaSpider.enemyId&&(enemy._arenaSpiderBattlePilot||here());}
 Game_Enemy.prototype.exp=function(){return technical(this)?0:exp.apply(this,arguments);};
 ArenaLoot.tableForEnemy=function(enemy){return technical(enemy)?$arenaSpider.labLoot:table.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=$arenaSpider;
  if(pending==='walk'&&here()&&!$gamePlayer.isTransferring()){pending=false;if(!ArenaBattle.prepare(c.entry.mapId))throw Error('Aranha: preparo de patrulha indisponível.');}
  if(pending==='battle'&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Aranha: preparo de batalha indisponível.');BattleManager.setup(c.troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaSpiderBattlePilot=true;});SceneManager.push(Scene_Battle);}
 };
 ArenaDebugHub.register({symbol:'arenaSpider',name:'Stonekeep · aranha (RAM)',category:'combat',description:'Exemplar completo de batalha, identidade original SPIDER.DFA/ITEM40. Parâmetros provisórios;0 EXP/loot, sem encontros da campanha.',saving:'Somente RAM · slots normais bloqueados'},ArenaSpider.startLab);
 ArenaDebugHub.register({symbol:'arenaSpiderWalk',name:'Stonekeep · aranha — patrulha (RAM)',category:'campaign',description:'Um exemplar, quatro direções e contato com o mesmo combate. Sala técnica em memória, separada dos encontros reais.',saving:'Somente RAM · Guardar/Carregar teste · slots normais bloqueados'},ArenaSpider.startWalkLab);
})();
