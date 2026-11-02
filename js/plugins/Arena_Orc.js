/*:
 * @plugindesc v0.1.0 Orc de Stonekeep: somente piloto de batalha RAM.
 * @author Codex
 * @help Após DebugHub, Stonekeep e núcleos de combate. Sem encontros de campanha.
 * Reutiliza preparo/retorno técnico; nenhuma caminhada ou recompensa de campanha.
 */
var ArenaOrc;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaOrc',src:'ArenaOrc.json'});
 var pending=false,loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaOrc;
  if(!c||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId]||c.campaign.enabled!==false)throw Error('Orc: vínculos do piloto RAM inválidos. Reconstrua com build-stonekeep-orc.');return true;};
 ArenaOrc={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending=true;return true;}};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=$arenaOrc;
  if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
   pending=false;$gamePlayer.locate(c.lab.x,c.lab.y);$gamePlayer.center(c.lab.x,c.lab.y);$gamePlayer.setDirection(c.lab.direction);$gameTemp.clearDestination();
   if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Orc: preparo técnico indisponível.');
   BattleManager.setup(c.troopId,false,false);SceneManager.push(Scene_Battle);
  }
 };
 ArenaDebugHub.register({symbol:'arenaOrc',name:'Stonekeep · orc (RAM)',category:'combat',description:'Exemplar de batalha: espera, maça, dano e derrota. Atributos provisórios; sem EXP/loot. Caminhada e seis encontros B2 ainda ausentes.',saving:'Somente RAM · slots normais bloqueados'},ArenaOrc.startLab);
})();
