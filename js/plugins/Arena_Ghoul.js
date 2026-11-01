/*:
 * @plugindesc v0.2.0 Ghoul: um encontro de ilha e acessos RAM, sem doença.
 * @author Codex
 * @help Após Arena_DebugHub, Stonekeep e núcleos de combate existentes.
 * ArenaGhoul.json; startLab() reutiliza o preparo técnico e bloqueio RAM.
 * Não altera fórmula, outros inimigos, cenas de batalha ou salvamento.
 */
var ArenaGhoul;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaGhoul',src:'ArenaGhoul.json'});
 var pending=null,loaded=DataManager.isDatabaseLoaded;
 function config(){return $arenaGhoul;}
 DataManager.isDatabaseLoaded=function(){
  if(!loaded.apply(this,arguments))return false;var c=config();
  if(!c||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId])throw Error('Ghoul: vínculos de banco/perfil/loot ausentes. Reconstrua com build-stonekeep-ghoul.');
  return true;
 };
 function lab(kind){if(!ArenaStonekeep.previewMaterials())return false;pending=kind;return true;}
 ArenaGhoul={startLab:function(){return lab('battle');},startPatrolLab:function(){return lab('patrol');}};
 var exp=Game_Enemy.prototype.exp,table=ArenaLoot.tableForEnemy;
 Game_Enemy.prototype.exp=function(){return this.enemyId()===config().enemyId&&this._arenaGhoulBattlePilot?0:exp.apply(this,arguments);};
 ArenaLoot.tableForEnemy=function(enemy){return enemy.enemyId()===config().enemyId&&enemy._arenaGhoulBattlePilot?config().labLoot:table.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){
  start.apply(this,arguments);var c=config();
  if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
   var kind=pending,p=kind==='battle'?c.lab:c.patrolLab;pending=null;$gamePlayer.locate(p.x,p.y);$gamePlayer.center(p.x,p.y);$gamePlayer.setDirection(p.direction);$gameTemp.clearDestination();
   ArenaBattle.prepare(c.lab.mapId);if(kind==='battle'){BattleManager.setup(c.troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaGhoulBattlePilot=true;});SceneManager.push(Scene_Battle);}
  }
 };
 ArenaDebugHub.register({symbol:'arenaGhoul',name:'Stonekeep · ghoul (RAM)',category:'combat',description:'Um ghoul: espera, clava, dano e derrota. Sem doença, EXP ou loot neste piloto.',saving:'Somente RAM · slots normais bloqueados'},ArenaGhoul.startLab);
 ArenaDebugHub.register({symbol:'arenaGhoulPatrol',name:'Stonekeep · ghoul na ilha (RAM)',category:'campaign',description:'Um ghoul no piso da ilha: caminhada, contato e recompensas de campanha provisórias.',saving:'Somente RAM · slots normais bloqueados'},ArenaGhoul.startPatrolLab);
})();
