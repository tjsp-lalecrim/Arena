/*:
 * @plugindesc v0.3.0 Orc de Stonekeep: batalha aprovada e inspeção de caminhada RAM.
 * @author Codex
 * @help Após DebugHub, Stonekeep e núcleos de combate. Recompensas de campanha separadas da inspeção.
 * Reutiliza preparo/retorno técnico; somente um exemplar no Map016, sem recompensas técnicas.
 */
var ArenaOrc;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaOrc',src:'ArenaOrc.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function walking(){return !!($gameSystem&&$gameSystem._arenaOrcWalkSession&&ArenaContinuation.labActive());}
 function here(){return walking()&&$gameMap.mapId()===$arenaOrc.walkLab.entry.mapId;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaOrc;
  if(!c||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId]||c.campaign.enabled!==true||!Number.isInteger(c.campaign.exp)||!c.campaign.loot||!c.walkLab||!$dataMapInfos[c.walkLab.entry.mapId]||c.walkLab.encounters.entries.length!==1)throw Error('Orc: vínculos do piloto RAM inválidos. Reconstrua com build-stonekeep-orc.');return true;};
 ArenaOrc={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending='battle';return true;},
  startWalkLab:function(){if(!ArenaContinuation.previewArrival($arenaOrc.walkLab.entry,true))return false;$gameSystem._arenaOrcWalkSession=true;$gameActors.actor(1).changeLevel(2,false);pending='walk';return true;},walkLabActive:walking};
 // Session-only contract: no mutation of the campaign registry, map or six B2 IDs.
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){var c=$arenaOrc;if(walking()&&mapId===c.walkLab.entry.mapId)return{ok:true,config:{id:c.walkLab.encounters.areaId,questId:'MQ02',mapId:mapId,encounters:c.walkLab.encounters}};return forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===$arenaOrc.walkLab.encounters.areaId?{ok:true,config:$arenaOrc.walkLab.encounters}:encounters.apply(this,arguments);};
 var exp=Game_Enemy.prototype.exp,table=ArenaLoot.tableForEnemy;
 function technical(enemy){return enemy.enemyId()===$arenaOrc.enemyId&&(enemy._arenaOrcBattlePilot||here());}
 Game_Enemy.prototype.exp=function(){return technical(this)?0:exp.apply(this,arguments);};
 ArenaLoot.tableForEnemy=function(enemy){return technical(enemy)?$arenaOrc.labLoot:table.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=$arenaOrc;
  if(pending==='walk'&&here()&&!$gamePlayer.isTransferring()){pending=false;if(!ArenaBattle.prepare(c.walkLab.entry.mapId))throw Error('Orc: preparo de patrulha indisponível.');}
  if(pending==='battle'&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
   pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();
   if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Orc: preparo técnico indisponível.');
   BattleManager.setup(c.troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaOrcBattlePilot=true;});SceneManager.push(Scene_Battle);
  }
 };
 ArenaDebugHub.register({symbol:'arenaOrc',name:'Stonekeep · orc (RAM)',category:'combat',description:'Batalha aprovada do exemplar; atributos provisórios e sem EXP/loot. Não distribui os seis encontros de B2.',saving:'Somente RAM · slots normais bloqueados'},ArenaOrc.startLab);
 ArenaDebugHub.register({symbol:'arenaOrcWalk',name:'Stonekeep · orc — patrulha (RAM)',category:'campaign',description:'Um orc em sala de inspeção, quatro direções e contato com a batalha aprovada. Sem EXP/loot; não é um dos seis encontros de B2.',saving:'Somente RAM · Guardar/Carregar teste · slots normais bloqueados'},ArenaOrc.startWalkLab);
})();
