/*:
 * @plugindesc v0.2.0 Acessos de Stonekeep: fechaduras comuns e corredor seco sob estrutura.
 * @author Codex
 * @help Após Arena_StonekeepWhole. Somente Map015/sessão integral, sem chaves fictícias.
 * A=self-switch aberto; B=destravado. Trabalho no Game_Map serializado; sem custos/EXP.
 * Cobertura suspensa local por configuração explícita, sem alterar flags globais de tiles.
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
 // Composite approved cap tiles into a local sprite; unlike pixi-tilemap layers,
 // Sprite alpha is honored by both native WebGL and Canvas renderers.
 var createTiles=Spriteset_Map.prototype.createTilemap;
 Spriteset_Map.prototype.createTilemap=function(){createTiles.apply(this,arguments);if(!here()||!config().dryPassage)return;
  var p=config().dryPassage,b=p.worldBounds,w=b[2]-b[0]+1,h=b[3]-b[1]+1,bitmap=new Bitmap(w*48,h*48),roof=new Sprite(bitmap),sheets=this._tilemap.bitmaps;
  var build=function(){if(!p.overheadTiles.every(function(t){return sheets[5+Math.floor(t.tileId/256)].isReady();}))return;bitmap.clear();
   p.overheadTiles.forEach(function(t){var id=t.tileId,source=sheets[5+Math.floor(id/256)],sx=((Math.floor(id/128)%2)*8+id%8)*48,sy=Math.floor(id%256/8)*48;
    bitmap.blt(source,sx,sy,48,48,(t.x-b[0])*48,(t.y-b[1])*48);});};
  this._stonekeepDryRoof=roof;this._baseSprite.addChild(roof);var seen={};p.overheadTiles.forEach(function(t){var i=5+Math.floor(t.tileId/256);if(!seen[i]){seen[i]=true;sheets[i].addLoadListener(build);}});
 };
 var tileUpdate=Spriteset_Map.prototype.updateTilemap;
 Spriteset_Map.prototype.updateTilemap=function(){tileUpdate.apply(this,arguments);var roof=this._stonekeepDryRoof;if(!roof)return;var p=config().dryPassage,b=p.worldBounds;
  roof.x=b[0]*$gameMap.tileWidth()-this._tilemap.origin.x;roof.y=b[1]*$gameMap.tileHeight()-this._tilemap.origin.y;
  var inside=$gamePlayer.x>=b[0]&&$gamePlayer.x<=b[2]&&$gamePlayer.y>=b[1]&&$gamePlayer.y<=b[3];roof.alpha=inside?p.roofOpacityInside/255:1;
 };
})();
