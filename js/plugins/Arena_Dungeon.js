/*:
 * @plugindesc v0.3.0 Dungeon: portas animadas, natação delimitada e objetos técnicos.
 * @author Codex
 * @help Após Arena_Loot. Config ArenaDungeon.json. Não implementa MQ01/respawn.
 * API ArenaDungeon.enter/startLab/openDoor/leave. Portas por self-switch nativo.
 * Explorar dungeon no título usa piloto técnico; menu do laboratório usa personagem atual.
 */
var ArenaDungeon;
(function(){
 'use strict';
 if(!window.ArenaCharacterCreation)throw Error('Arena_Dungeon requer Arena_CharacterCreation.');
 DataManager._databaseFiles.push({name:'$arenaDungeon',src:'ArenaDungeon.json'});
 ArenaDungeon={
  enter:function(){if($gameParty.inBattle()||!ArenaCharacterCreation.isCreated())return false;$gamePlayer.reserveTransfer($arenaDungeon.mapId,$arenaDungeon.start[0],$arenaDungeon.start[1],4,0);SceneManager.goto(Scene_Map);return true;},
  startLab:function(){DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Explorador',raceId:'breton',genderId:'female'});SceneManager.clearStack();this.enter();},
  door:function(id){return $arenaDungeon.doors.filter(function(v){return v.id===id;})[0];},
  openDoor:function(id){return this.setDoor(id,true);},
  closeDoor:function(id){return this.setDoor(id,false);},
  toggleDoor:function(id){var d=this.door(id);return d?this.setDoor(id,!$gameSelfSwitches.value([$arenaDungeon.mapId,d.eventIds[0],'A'])):false;},
  setDoor:function(id,open){
   if($gameMap.mapId()!==$arenaDungeon.mapId)return false;
   var d=this.door(id);if(!d)return false;
   var transitions=$gameMap._arenaDoorTransitions||($gameMap._arenaDoorTransitions={});
   if(transitions[id])return false;
   if($gameSelfSwitches.value([$arenaDungeon.mapId,d.eventIds[0],'A'])===open)return true;
   // Closing is refused if any non-through actor occupies the entire swing envelope.
   if(!open){var cx=d.center[0],cy=d.center[1],occupied=function(c){return Math.abs(c.x-cx)<=1&&Math.abs(c.y-cy)<=1;};
    if(occupied($gamePlayer)||$gameMap.events().some(function(e){return d.eventIds.indexOf(e.eventId())<0&&!e.isThrough()&&occupied(e);}))return false;
   }
   var visual=$gameMap.event(d.visualEventId),dir=d.axis==='east-west'?($gamePlayer.x<d.center[0]?4:6):($gamePlayer.y<d.center[1]?8:2);
   if(visual){visual._direction=dir;visual._arenaDoorDirection=dir;}
   transitions[id]={open:open,remaining:$arenaDungeon.doorAnimationFrames||24};
   if(!open)d.eventIds.forEach(function(n){$gameSelfSwitches.setValue([$arenaDungeon.mapId,n,'A'],false);});
   return true;
  },
  isWaterTile:function(x,y){var s=$arenaDungeon.swimming,t=$gameMap.tileId(x,y,0),kind=s&&s.autotileKind!==undefined?s.autotileKind:0;return Tilemap.isTileA1(t)&&Tilemap.getAutotileKind(t)===kind;},
  isSwimming:function(){var s=$arenaDungeon&&$arenaDungeon.swimming;return !!($gamePlayer&&$gameMap&&s&&s.enabled&&$gameMap.mapId()===$arenaDungeon.mapId&&!$gamePlayer.isInVehicle()&&$gameMap.regionId($gamePlayer.x,$gamePlayer.y)===s.regionId&&this.isWaterTile($gamePlayer.x,$gamePlayer.y));},
  inspectTreasure:function(index){if($gameMap.mapId()!==$arenaDungeon.mapId||!$arenaDungeon.integration.treasures[index])return false;var state=$gameMap._arenaTreasurePreview||($gameMap._arenaTreasurePreview={});state[index]=((state[index]||0)+1)%3;$gameMessage.add('Prévia técnica: disponível / aberto / coletado.\nSem recompensa ou mudança de quest.\nConcessão real reservada para M01-16.');return true;},
  leave:function(){if($gameMap.mapId()!==$arenaDungeon.mapId)return false;var l=$arenaDungeon.laboratory;$gamePlayer.reserveTransfer(l.mapId,l.x,l.y,2,0);SceneManager.goto(Scene_Map);return true;}
 };
 var setup=Game_Map.prototype.setup;
 Game_Map.prototype.setup=function(mapId){setup.apply(this,arguments);if(mapId===$arenaDungeon.mapId)this._arenaDungeonRevision=3;};
 var extract=DataManager.extractSaveContents;
 DataManager.extractSaveContents=function(contents){extract.apply(this,arguments);if($gameMap.mapId()===$arenaDungeon.mapId&&$gameMap._arenaDungeonRevision!==3){
  // A load may be requested from a technical map scene as well as Scene_Load.
   // Do not refresh serialized legacy events against a different set of map pages.
  $gameMap._events=[];$gameMap._needsRefresh=false;
 }};
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  // Old lab saves retain serialized Game_Event instances. Refresh geometry from
  // current Map008 without losing native position or first126 door self-switches.
  if($gameMap.mapId()===$arenaDungeon.mapId&&$gameMap._arenaDungeonRevision!==3){$gameMap.setup($arenaDungeon.mapId);$gameMap._arenaDoorTransitions={};$gameMap._arenaTreasurePreview={};}
  mapLoaded.apply(this,arguments);
 };
 var mapUpdate=Game_Map.prototype.update;
 Game_Map.prototype.update=function(sceneActive){mapUpdate.apply(this,arguments);if(this.mapId()!==$arenaDungeon.mapId)return;var transitions=this._arenaDoorTransitions||{};Object.keys(transitions).forEach(function(id){var t=transitions[id];if(--t.remaining<=0){var d=ArenaDungeon.door(id);if(d)d.eventIds.forEach(function(n){$gameSelfSwitches.setValue([$arenaDungeon.mapId,n,'A'],t.open);});delete transitions[id];}});};
 var passable=Game_Player.prototype.isMapPassable;
 Game_Player.prototype.isMapPassable=function(x,y,d){
  // Do not change vehicle rules, other maps, event collisions or the engine's two-sided flag checks.
  if($gameMap.mapId()===$arenaDungeon.mapId&&!this.isInVehicle()){
   var nx=$gameMap.roundXWithDirection(x,d),ny=$gameMap.roundYWithDirection(y,d),s=$arenaDungeon.swimming;
   if(ArenaDungeon.isWaterTile(nx,ny)&&(!s||!s.enabled||$gameMap.regionId(nx,ny)!==s.regionId))return false;
  }
  return passable.apply(this,arguments);
 };
 var bush=Game_Player.prototype.refreshBushDepth;
 Game_Player.prototype.refreshBushDepth=function(){bush.apply(this,arguments);if(ArenaDungeon.isSwimming()&&!this.isJumping())this._bushDepth=$arenaDungeon.swimming.depth;};
 var frame=Sprite_Character.prototype.characterPatternX;
 var directionRow=Sprite_Character.prototype.characterPatternY;
 Sprite_Character.prototype.characterPatternY=function(){var c=this._character;return c._arenaDoorDirection?(c._arenaDoorDirection-2)/2:directionRow.apply(this,arguments);};
 Sprite_Character.prototype.characterPatternX=function(){
  var c=this._character;if($gameMap.mapId()===$arenaDungeon.mapId&&c instanceof Game_Event){
   var d=$arenaDungeon.doors.filter(function(v){return v.visualEventId===c.eventId();})[0];
   if(d){var t=($gameMap._arenaDoorTransitions||{})[d.id];if(t){var elapsed=($arenaDungeon.doorAnimationFrames||24)-t.remaining,stage=Math.min(2,Math.floor(elapsed/(($arenaDungeon.doorAnimationFrames||24)/3)));return t.open?stage:2-stage;}return $gameSelfSwitches.value([$arenaDungeon.mapId,d.eventIds[0],'A'])?2:0;}
   var i=$arenaDungeon.integration.treasures.findIndex(function(v){return v.eventId===c.eventId();});if(i>=0)return ($gameMap._arenaTreasurePreview||{})[i]||0;
  }return frame.apply(this,arguments);
 };
 var position=Sprite_Character.prototype.updatePosition;
 Sprite_Character.prototype.updatePosition=function(){position.apply(this,arguments);if(this._character===$gamePlayer&&ArenaDungeon.isSwimming())this.y+=$arenaDungeon.swimming.offsetY;};
 var update=Sprite_Character.prototype.update;
 Sprite_Character.prototype.update=function(){update.apply(this,arguments);if(this._character!==$gamePlayer)return;
  if(!this._arenaRipple){this._arenaRipple=new Sprite(ImageManager.loadCharacter('!$Arena_Ripple_M14_R02'));this._arenaRipple.anchor.set(0.5,1);this.addChild(this._arenaRipple);}
  this._arenaRipple.visible=ArenaDungeon.isSwimming();if(this._arenaRipple.visible){this._arenaRipple.setFrame(Math.floor(Graphics.frameCount/18)%3*96,0,96,32);this._arenaRipple.y=-2;if(this._lowerBody)this._lowerBody.opacity=35;}
 };
 var commands=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){commands.apply(this,arguments);this.addCommand('Explorar Imperial Dungeons','arenaDungeon');};
 var create=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaDungeon',function(){ArenaDungeon.startLab();});};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if($gameMap.mapId()===$arenaDungeon.mapId)this.addCommand('Voltar ao laboratório','arenaDungeonExit');else if($gameMap.mapId()===$arenaDungeon.laboratory.mapId)this.addCommand('Explorar Imperial Dungeons','arenaDungeonEnter');};
 var menuCreate=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menuCreate.apply(this,arguments);this._commandWindow.setHandler('arenaDungeonExit',function(){ArenaDungeon.leave();});this._commandWindow.setHandler('arenaDungeonEnter',function(){ArenaDungeon.enter();});};
})();
