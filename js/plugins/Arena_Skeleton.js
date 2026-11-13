/*:
 * @plugindesc v0.3.0 Esqueletos de Stonekeep; resistência e acessos RAM.
 * @author Codex
 * @help Após Arena_Stonekeep/BattleMotion/Abilities/Loot. ArenaSkeleton.json.
 * Encontro de campanha usa Arena_Encounters; laboratório não altera saves.
 * Resistência: ataque e técnicas da arma cortante equipada; não magia/itens.
 * Nenhuma cobrança de recurso ou fórmula global nova. doc/SKELETON_M02.md.
 */
var ArenaSkeleton;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaSkeleton',src:'ArenaSkeleton.json'});var pending=null;
 function c(){return $arenaSkeleton;}
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var cfg=c();if(!cfg||!$dataEnemies[cfg.enemyId]||!$dataTroops[cfg.troopId]||!$arenaBattleMotion.enemies[cfg.enemyId]||!$arenaLoot.enemies[cfg.enemyId]||!Number.isFinite(cfg.resistance.edgedRate)||cfg.resistance.edgedRate<=0||cfg.resistance.edgedRate>1)throw Error('Esqueleto: vínculos ou resistência inválidos em ArenaSkeleton.json.');return true;};
 function rate(action,target){
  if(!target.isEnemy()||target.enemyId()!==c().enemyId||!action.subject().isActor()||!action.isPhysical()||!action.item()||action.item().damage.type!==1)return 1;
  var w=action.subject().weapons()[0];if(!w||c().resistance.weaponTypes.indexOf(w.wtypeId)<0)return 1;
  var technique=$arenaAbilities.techniques.some(function(t){return t.weaponType===w.wtypeId&&t.skillId===action.item().id;});
  return action.isAttack()||action.isSkill()&&technique?c().resistance.edgedRate:1;
 }
 var damage=Game_Action.prototype.makeDamageValue;
 Game_Action.prototype.makeDamageValue=function(target,critical){var value=damage.apply(this,arguments),r=rate(this,target);return r!==1&&value>0?Math.max(1,Math.round(value*r)):value;};
 // Only the original direct battle fixture suppresses EXP. Patrol tests use
 // campaign rewards. Never mutate the shared enemy database for a laboratory.
 var exp=Game_Enemy.prototype.exp;
 Game_Enemy.prototype.exp=function(){return this._arenaSkeletonBattlePilot?0:exp.apply(this,arguments);};
 function lab(kind){if(!ArenaStonekeep.previewMaterials())return false;pending=kind;return true;}
 ArenaSkeleton={resistanceRate:rate,startLab:function(){return lab('battle');},startPatrolLab:function(){return lab('patrol');}};
 // The representative pilot used a proxy near the breach. Retain its stable ID
 // and defeat/reward records; only relocate a living saved event in that old area.
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  var old=c().legacyPatrol;
  if(old&&!$gamePlayer.isTransferring()&&$gameMap.mapId()===c().lab.mapId){
   var e=$gameMap.event(old.eventId),s=ArenaPersistence.snapshot().enemies[old.id];
   if(e&&!e._erased&&!(s&&s.defeated)&&MVEncounterRules.within(e.x,e.y,old.origin,old.radius))e.locate(c().encounter.origin[0],c().encounter.origin[1]);
  }
  mapLoaded.apply(this,arguments);
 };
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c().lab.mapId&&!$gamePlayer.isTransferring()){var kind=pending,p=kind==='battle'?c().lab:c().patrolLab;pending=null;$gamePlayer.locate(p.x,p.y);$gamePlayer.center(p.x,p.y);$gamePlayer.setDirection(p.direction);$gameTemp.clearDestination();ArenaBattle.prepare(c().lab.mapId);if(kind==='battle'){BattleManager.setup(c().troopId,false,false);$gameTroop.members().forEach(function(e){e._arenaSkeletonBattlePilot=true;});SceneManager.push(Scene_Battle);}}};
 var commands=Window_TitleCommand.prototype.makeCommandList,create=Scene_Title.prototype.createCommandWindow;
 Window_TitleCommand.prototype.makeCommandList=function(){commands.apply(this,arguments);this.addCommand('Stonekeep · esqueleto (RAM)','arenaSkeleton');this.addCommand('Stonekeep · patrulha (RAM)','arenaSkeletonPatrol');};
 Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaSkeleton',ArenaSkeleton.startLab);this._commandWindow.setHandler('arenaSkeletonPatrol',ArenaSkeleton.startPatrolLab);};
})();
