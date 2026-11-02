/*:
 * @plugindesc v0.1.0 Caminhada do homem-lagarto: um exemplar RAM, batalha R03 preservada.
 * @author Codex
 * @help Após Orc/DebugHub/Continuation/Encounters/Battle. ArenaLizardPatrol.json.
 * Reutiliza Map016 em memória; não altera a sala do orc ou os encontros da campanha.
 */
var ArenaLizardPatrol;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaLizardPatrol',src:'ArenaLizardPatrol.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function active(){return !!($gameSystem&&$gameSystem._arenaLizardPatrolSession&&ArenaContinuation.labActive());}
 function here(){return active()&&$gameMap.mapId()===$arenaLizardPatrol.entry.mapId;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaLizardPatrol,t=c&&$dataTroops[c.troopId];
  if(!c||!$dataEnemies[c.enemyId]||!t||t.members.length!==1||t.members[0].enemyId!==c.enemyId||!$arenaBattleMotion.enemies[c.enemyId]||!$dataMapInfos[c.entry.mapId]||c.encounters.entries.length!==1)throw Error('Homem-lagarto: vínculos de inspeção inválidos. Confira ArenaLizardPatrol.json.');return true;};
 ArenaLizardPatrol={startLab:function(){if(!ArenaContinuation.previewArrival($arenaLizardPatrol.entry,true))return false;$gameSystem._arenaLizardPatrolSession=true;$gameActors.actor(1).changeLevel(2,false);pending=true;return true;},active:active};
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){var c=$arenaLizardPatrol;if(active()&&mapId===c.entry.mapId)return{ok:true,config:{id:c.encounters.areaId,questId:'MQ02',mapId:mapId,encounters:c.encounters}};return forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===$arenaLizardPatrol.encounters.areaId?{ok:true,config:$arenaLizardPatrol.encounters}:encounters.apply(this,arguments);};
 // Private map view before native setup/sprites, including RAM restoration.
 // Nothing is written back to Map016 or the approved Orc configuration.
 var onMapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){var c=$arenaLizardPatrol,target=$gamePlayer.isTransferring()?$gamePlayer._newMapId:$gameMap.mapId();
  if(active()&&target===c.entry.mapId){var e=$dataMap.events[c.encounters.entries[0].eventId],v=c.encounters.entries[0];
   if(!e||[c.roomSourceEventNote,'ArenaEncounter:'+v.id].indexOf(e.note)<0)throw Error('Homem-lagarto: sala técnica de origem não corresponde ao contrato.');
   var copy=JSON.parse(JSON.stringify(e));copy.name='Homem-lagarto · inspeção RAM';copy.note='ArenaEncounter:'+v.id;copy.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
   var events=$dataMap.events.slice();events[v.eventId]=copy;$dataMap=Object.assign({},$dataMap,{events:events,displayName:'Homem-lagarto · inspeção RAM'});
  }onMapLoaded.apply(this,arguments);
 };
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&here()&&!$gamePlayer.isTransferring()){pending=false;if(!ArenaBattle.prepare($arenaLizardPatrol.entry.mapId))throw Error('Homem-lagarto: preparo RAM indisponível.');}};
 var exp=Game_Enemy.prototype.exp,table=ArenaLoot.tableForEnemy;
 Game_Enemy.prototype.exp=function(){return here()&&this.enemyId()===$arenaLizardPatrol.enemyId?0:exp.apply(this,arguments);};
 ArenaLoot.tableForEnemy=function(enemy){return here()&&enemy.enemyId()===$arenaLizardPatrol.enemyId?$arenaLizardPatrol.labLoot:table.apply(this,arguments);};
 ArenaDebugHub.register({symbol:'arenaLizardPatrol',name:'Stonekeep · homem-lagarto — patrulha (RAM)',category:'campaign',description:'Um exemplar de caminhada, tridente/escudo, colisão e contato com a batalha R03 existente. Sem EXP/loot nesta sessão; não distribui encontros.',saving:'Somente RAM · Guardar/Carregar teste · slots normais bloqueados'},ArenaLizardPatrol.startLab);
})();
