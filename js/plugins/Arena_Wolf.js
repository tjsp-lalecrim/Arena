/*:
 * @plugindesc v0.2.0 Lobo comum: um encontro e acessos técnicos isolados.
 * @author Codex
 * @help Após Arena_DebugHub, Stonekeep e núcleos de combate/recursos/loot.
 * ArenaWolf.json; um exemplar, ações nativas, sem mecânicas novas.
 * Um evento de mapa; batalha direta RAM sem recompensas.
 */
var ArenaWolf;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaWolf',src:'ArenaWolf.json'});
 var pending=null,loaded=DataManager.isDatabaseLoaded;
 function cfg(){return $arenaWolf;}
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=cfg();
  if(!c||!c.campaign||!$dataEnemies[c.enemyId]||!$dataTroops[c.troopId]||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId])throw Error('Lobo: vínculos do piloto ausentes. Reconstrua com build-stonekeep-wolf.');return true;};
 ArenaWolf={startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending='battle';return true;},startPatrolLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending='patrol';return true;}};
 var table=ArenaLoot.tableForEnemy;
 ArenaLoot.tableForEnemy=function(enemy){if(enemy.enemyId()!==cfg().enemyId)return table.apply(this,arguments);return enemy._arenaWolfBattlePilot?cfg().labLoot:table.apply(this,arguments);};
 var exp=Game_Enemy.prototype.exp;Game_Enemy.prototype.exp=function(){return this.enemyId()===cfg().enemyId&&this._arenaWolfBattlePilot?0:exp.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);var c=cfg();if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c.lab.mapId&&!$gamePlayer.isTransferring()){
  var kind=pending,p=kind==='battle'?c.lab:c.patrolLab;pending=null;$gamePlayer.locate(p.x,p.y);$gamePlayer.center(p.x,p.y);$gamePlayer.setDirection(p.direction);$gameTemp.clearDestination();
  if(!ArenaBattle.prepare(c.lab.mapId))throw Error('Lobo: preparo técnico indisponível.');
  if(kind==='battle'){BattleManager.setup(c.troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaWolfBattlePilot=true;});SceneManager.push(Scene_Battle);}
 }};
 ArenaDebugHub.register({symbol:'arenaWolf',name:'Stonekeep · lobo (RAM)',category:'combat',description:'Batalha direta do lobo aprovado. Sem EXP ou loot nesta sessão técnica.',saving:'Somente RAM · slots normais bloqueados'},ArenaWolf.startLab);
 ArenaDebugHub.register({symbol:'arenaWolfPatrol',name:'Stonekeep · lobo na passagem (RAM)',category:'campaign',description:'Um lobo em(90,51): caminhada, patrulha e contato. EXP25 provisória; drops desconhecidos, vazios.',saving:'Somente RAM · slots normais bloqueados'},ArenaWolf.startPatrolLab);
})();
