/*:
 * @plugindesc v0.1.0 Piloto de batalha do esqueleto; resistência específica.
 * @author Codex
 * @help Após Arena_Stonekeep/BattleMotion/Abilities/Loot. ArenaSkeleton.json.
 * Apenas laboratório RAM; sem sprite de exploração, encontro ou respawn.
 * Resistência: ataque e técnicas da arma cortante equipada; não magia/itens.
 * Nenhuma cobrança de recurso ou fórmula global nova. doc/SKELETON_M02.md.
 */
var ArenaSkeleton;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaSkeleton',src:'ArenaSkeleton.json'});var pending=false;
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
 ArenaSkeleton={resistanceRate:rate,startLab:function(){if(!ArenaStonekeep.previewMaterials())return false;pending=true;return true;}};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===c().lab.mapId&&!$gamePlayer.isTransferring()){pending=false;$gamePlayer.locate(c().lab.x,c().lab.y);$gamePlayer.setDirection(c().lab.direction);$gameTemp.clearDestination();ArenaBattle.prepare(c().lab.mapId);BattleManager.setup(c().troopId,false,false);SceneManager.push(Scene_Battle);}};
 var commands=Window_TitleCommand.prototype.makeCommandList,create=Scene_Title.prototype.createCommandWindow;
 Window_TitleCommand.prototype.makeCommandList=function(){commands.apply(this,arguments);this.addCommand('Stonekeep · esqueleto (RAM)','arenaSkeleton');};
 Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaSkeleton',ArenaSkeleton.startLab);};
})();
