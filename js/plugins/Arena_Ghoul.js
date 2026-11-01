/*:
 * @plugindesc v0.1.0 Ghoul: único piloto de batalha RAM, sem doença/encontro.
 * @author Codex
 * @help Após Arena_DebugHub, Stonekeep e núcleos de combate existentes.
 * ArenaGhoul.json; startLab() reutiliza o preparo técnico e bloqueio RAM.
 * Não altera fórmula, outros inimigos, cenas de batalha ou salvamento.
 */
var ArenaGhoul;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaGhoul',src:'ArenaGhoul.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 function config(){return $arenaGhoul;}
 DataManager.isDatabaseLoaded=function(){
  if(!loaded.apply(this,arguments))return false;var c=config();
  if(!c||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId])throw Error('Ghoul: vínculos de banco/perfil/loot ausentes. Reconstrua com build-stonekeep-ghoul.');
  return true;
 };
 ArenaGhoul={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending=true;return true;}};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){
  start.apply(this,arguments);var c=config();
  if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
   pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();
   ArenaBattle.prepare(c.lab.mapId);BattleManager.setup(c.troopId,false,false);SceneManager.push(Scene_Battle);
  }
 };
 ArenaDebugHub.register({symbol:'arenaGhoul',name:'Stonekeep · ghoul (RAM)',category:'combat',description:'Um ghoul: espera, clava, dano e derrota. Sem doença, EXP ou loot neste piloto.',saving:'Somente RAM · slots normais bloqueados'},ArenaGhoul.startLab);
})();
