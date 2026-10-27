/*:
 * @plugindesc v0.1.0 Entrada isolada e portas geométricas da dungeon M01-14.
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
  openDoor:function(id){if($gameMap.mapId()!==$arenaDungeon.mapId)return false;var d=$arenaDungeon.doors.filter(function(v){return v.id===id;})[0];if(!d)return false;d.eventIds.forEach(function(n){$gameSelfSwitches.setValue([$arenaDungeon.mapId,n,'A'],true);});return true;},
  leave:function(){if($gameMap.mapId()!==$arenaDungeon.mapId)return false;var l=$arenaDungeon.laboratory;$gamePlayer.reserveTransfer(l.mapId,l.x,l.y,2,0);SceneManager.goto(Scene_Map);return true;}
 };
 var commands=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){commands.apply(this,arguments);this.addCommand('Explorar dungeon','arenaDungeon');};
 var create=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaDungeon',function(){ArenaDungeon.startLab();});};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if($gameMap.mapId()===$arenaDungeon.mapId)this.addCommand('Voltar ao laboratório','arenaDungeonExit');else if($gameMap.mapId()===$arenaDungeon.laboratory.mapId)this.addCommand('Explorar dungeon','arenaDungeonEnter');};
 var menuCreate=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menuCreate.apply(this,arguments);this._commandWindow.setHandler('arenaDungeonExit',function(){ArenaDungeon.leave();});this._commandWindow.setHandler('arenaDungeonEnter',function(){ArenaDungeon.enter();});};
})();
