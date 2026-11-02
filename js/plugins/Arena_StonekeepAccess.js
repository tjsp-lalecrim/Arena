/*:
 * @plugindesc v0.1.0 Acessos de Stonekeep: fechaduras comuns explícitas, ação de força adaptada.
 * @author Codex
 * @help Após Arena_StonekeepWhole. Somente Map015/sessão integral, sem chaves fictícias.
 * A=self-switch aberto; B=destravado. Trabalho no Game_Map serializado; sem custos/EXP.
 */
var ArenaStonekeepAccess;
(function(){'use strict';
 function here(){return !!(window.ArenaStonekeepWhole&&ArenaStonekeepWhole.here());}
 function config(){return window.$arenaStonekeepWhole&&$arenaStonekeepWhole.access;}
 function door(id){return here()&&config()&&config().lockedDoorIds.indexOf(id)>=0?ArenaDungeon.door(id):null;}
 function unlocked(d){return !!(d&&$gameSelfSwitches.value([15,d.eventIds[0],'B']));}
 function working(){return here()&&!!$gameMap._arenaStonekeepLockWork;}
 function side(d){var dx=Math.abs($gamePlayer.x-d.center[0]),dy=Math.abs($gamePlayer.y-d.center[1]);return d.axis==='east-west'?dx===2&&dy<=1:dy===2&&dx<=1;}
 function neutral(){Input.clear();TouchInput.clear();$gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+180};}
 ArenaStonekeepAccess={
  working:working,
  isUnlocked:function(id){return unlocked(door(id));},
  force:function(id){var d=door(id),cfg=config();if(!d||unlocked(d)||working()||$gameParty.inBattle()||$gamePlayer.isTransferring()||!side(d))return false;
   var frames=cfg.force.framesPerLockLevel*d.lockValue;$gameMap._arenaStonekeepLockWork={id:id,remaining:frames,total:frames};neutral();return true;},
  interactDoor:function(id){var d=door(id);if(!d||working()||$gameParty.inBattle()||$gamePlayer.isTransferring())return false;
   if(unlocked(d))return ArenaDungeon.toggleDoor(id);if(!side(d)||$gameMessage.isBusy())return false;
   neutral();$gameMessage.add('A porta está trancada.');$gameMessage.setChoices(['Forçar a porta','Voltar'],1,1);
   $gameMessage.setChoiceCallback(function(n){if(n===0)ArenaStonekeepAccess.force(id);else neutral();});return true;}
 };
 var setDoor=ArenaDungeon.setDoor;
 ArenaDungeon.setDoor=function(id,open){var d=door(id);if(d&&!unlocked(d))return false;return setDoor.apply(this,arguments);};
 var loaded=DataManager.isDatabaseLoaded,checked=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!checked){var c=config();
  if(!c||!c.force||!Number.isInteger(c.force.framesPerLockLevel)||c.force.framesPerLockLevel<=0||!Array.isArray(c.lockedDoorIds)||c.lockedDoorIds.some(function(id){var d=$arenaStonekeepWhole.doors.filter(function(v){return v.id===id;})[0];return !d||d.lockPolicy!=='forceableOrdinary'||c.force.ordinaryLevels.indexOf(d.lockValue)<0;}))throw Error('Stonekeep: configuração explícita de fechaduras comuns inválida. Reconstrua os acessos A2/B2.');
  checked=true;}return true;};
 var setup=Game_Map.prototype.setup;Game_Map.prototype.setup=function(mapId){if(mapId!==15)delete this._arenaStonekeepLockWork;setup.apply(this,arguments);};
 var update=Game_Map.prototype.update;
 Game_Map.prototype.update=function(active){update.apply(this,arguments);if(!working())return;var w=this._arenaStonekeepLockWork,d=door(w.id);
  if(!d||!side(d)||$gameParty.inBattle()||$gamePlayer.isTransferring()||!Number.isFinite(w.remaining)){delete this._arenaStonekeepLockWork;neutral();return;}
  if(--w.remaining<=0){d.eventIds.forEach(function(id){$gameSelfSwitches.setValue([15,id,'B'],true);});delete this._arenaStonekeepLockWork;neutral();ArenaDungeon.openDoor(d.id);}
 };
 var canMove=Game_Player.prototype.canMove;Game_Player.prototype.canMove=function(){return !working()&&canMove.apply(this,arguments);};
 var menu=Scene_Map.prototype.isMenuCalled;Scene_Map.prototype.isMenuCalled=function(){return !working()&&menu.apply(this,arguments);};
 var create=Scene_Map.prototype.createAllWindows;
 Scene_Map.prototype.createAllWindows=function(){create.apply(this,arguments);this._stonekeepLockWindow=new Window_Base(16,Graphics.boxHeight-96,276,88);this._stonekeepLockWindow.hide();this.addWindow(this._stonekeepLockWindow);};
 var sceneUpdate=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){sceneUpdate.apply(this,arguments);var win=this._stonekeepLockWindow;if(!win)return;win.visible=working();if(!win.visible)return;
  var w=$gameMap._arenaStonekeepLockWork;win.contents.clear();win.contents.fontSize=18;win.drawText('Forçando a porta…',0,-4,win.contentsWidth());win.drawGauge(0,10,win.contentsWidth(),1-w.remaining/w.total,win.textColor(6),win.textColor(14));};
})();
