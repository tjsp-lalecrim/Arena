/*:
 * @plugindesc v0.1.0 Lobo comum: piloto de batalha isolado, sem exploração.
 * @author Codex
 * @help Após Arena_DebugHub, Stonekeep e núcleos de combate/recursos/loot.
 * ArenaWolf.json; um exemplar, ações nativas, sem mecânicas novas.
 * Nenhum evento de mapa ou recompensa de campanha configurado.
 */
var ArenaWolf;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaWolf',src:'ArenaWolf.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function cfg(){return $arenaWolf;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=cfg();
  if(!c||c.campaign!==null||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId])throw Error('Lobo: vínculos do piloto ausentes. Reconstrua com build-stonekeep-wolf.');return true;};
 ArenaWolf={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending=true;return true;}};
 var table=ArenaLoot.tableForEnemy;
 ArenaLoot.tableForEnemy=function(enemy){if(enemy.enemyId()!==cfg().enemyId)return table.apply(this,arguments);if(!enemy._arenaWolfBattlePilot)throw Error('Lobo: recompensas de campanha ainda não configuradas.');return cfg().labLoot;};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=cfg();if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
  pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();
  if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Lobo: preparo técnico indisponível.');
  BattleManager.setup(c.troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaWolfBattlePilot=true;});SceneManager.push(Scene_Battle);
 }};
 ArenaDebugHub.register({symbol:'arenaWolf',name:'Stonekeep · lobo (RAM)',category:'combat',description:'Lobo comum: espera, mordida, dano e derrota. Sem caminhada, EXP ou loot de campanha.',saving:'Somente RAM · slots normais bloqueados'},ArenaWolf.startLab);
})();
