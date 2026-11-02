/*:
 * @plugindesc v0.1.0 Minotauro de Stonekeep: batalha e caminhada do mesmo exemplar RAM.
 * @author Codex
 * @help Após Orc/LizardPatrol/DebugHub/Continuation/Encounters/Battle. Sem campanha.
 * OGRE.DFA/ITEM39 é alias original: Minotaur/PAT@.CFA. Sala Map016 só em memória.
 */
var ArenaMinotaur;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaMinotaur',src:'ArenaMinotaur.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function active(){return !!($gameSystem&&$gameSystem._arenaMinotaurWalkSession&&ArenaContinuation.labActive());}
 function here(){return active()&&$gameMap.mapId()===$arenaMinotaur.entry.mapId;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaMinotaur,t=c&&$dataTroops[c.troopId];
  if(!c||!$dataEnemies[c.enemyId]||!t||t.members.length!==1||t.members[0].enemyId!==c.enemyId||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId]||!$dataMapInfos[c.entry.mapId]||c.encounters.entries.length!==1||c.campaign.enabled!==false)throw Error('Minotauro: vínculos do exemplar RAM inválidos. Reconstrua build-stonekeep-minotaur.');return true;};
 ArenaMinotaur={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending='battle';return true;},
  startWalkLab:function(){if(!ArenaContinuation.previewArrival($arenaMinotaur.entry,true))return false;$gameSystem._arenaMinotaurWalkSession=true;$gameActors.actor(1).changeLevel(2,false);pending='walk';return true;},active:active};
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){var c=$arenaMinotaur;if(active()&&mapId===c.entry.mapId)return{ok:true,config:{id:c.encounters.areaId,questId:'MQ02',mapId:mapId,encounters:c.encounters}};return forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===$arenaMinotaur.encounters.areaId?{ok:true,config:$arenaMinotaur.encounters}:encounters.apply(this,arguments);};
 var onMapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){var c=$arenaMinotaur,target=$gamePlayer.isTransferring()?$gamePlayer._newMapId:$gameMap.mapId();
  if(active()&&target===c.entry.mapId){var v=c.encounters.entries[0],e=$dataMap.events[v.eventId];if(!e||[c.roomSourceEventNote,'ArenaEncounter:'+v.id].indexOf(e.note)<0)throw Error('Minotauro: sala de inspeção não corresponde ao contrato.');
   var copy=JSON.parse(JSON.stringify(e));copy.name='Minotauro · inspeção RAM';copy.note='ArenaEncounter:'+v.id;copy.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];var events=$dataMap.events.slice();events[v.eventId]=copy;$dataMap=Object.assign({},$dataMap,{events:events,displayName:'Minotauro · inspeção RAM'});
  }onMapLoaded.apply(this,arguments);
 };
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=$arenaMinotaur;
  if(pending==='walk'&&here()&&!$gamePlayer.isTransferring()){pending=false;if(!ArenaBattle.prepare(c.entry.mapId))throw Error('Minotauro: preparo de patrulha indisponível.');}
  if(pending==='battle'&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Minotauro: preparo de batalha indisponível.');BattleManager.setup(c.troopId,false,false);SceneManager.push(Scene_Battle);}
 };
 ArenaDebugHub.register({symbol:'arenaMinotaur',name:'Stonekeep · minotauro (RAM)',category:'combat',description:'Exemplar completo de batalha, alias original OGRE.DFA corrigido. Parâmetros provisórios;0 EXP/loot, sem encontros da campanha.',saving:'Somente RAM · slots normais bloqueados'},ArenaMinotaur.startLab);
 ArenaDebugHub.register({symbol:'arenaMinotaurWalk',name:'Stonekeep · minotauro — patrulha (RAM)',category:'campaign',description:'Um exemplar, quatro direções e contato com o mesmo combate. Sala técnica em memória; oito posições originais ainda não distribuídas.',saving:'Somente RAM · Guardar/Carregar teste · slots normais bloqueados'},ArenaMinotaur.startWalkLab);
})();
