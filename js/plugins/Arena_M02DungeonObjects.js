/*:
 * @plugindesc v0.1.0 Sincroniza apenas artes de portas e suportes em saves anteriores do M02.
 * @author Codex
 * @help IDs/colisões/quests/recibos preservados. Não troca namespace ou reabre portas.
 */
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaM02DungeonObjects',src:'ArenaM02DungeonObjects.json'});
 var boot=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){
  if(!boot.apply(this,arguments))return false;
  var c=$arenaM02DungeonObjects;
  if(!c||c.schemaVersion!==1||!Array.isArray(c.maps))throw Error('Objetos M02: configuração ausente/inválida.');
  c.maps.forEach(function(m){var used={};m.sprites.concat(m.decorations).forEach(function(s){if(used[s.eventId]||!s.file)throw Error('Objetos M02: vínculo visual duplicado/inválido no mapa'+m.mapId);used[s.eventId]=true;});});
  return true;
 };
 var loaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  if(!$gamePlayer.isTransferring()){
   var spec=$arenaM02DungeonObjects.maps.find(function(m){return m.mapId===$gameMap.mapId();});
   if(spec){
    spec.sprites.forEach(function(s){var e=$gameMap.event(s.eventId);if(e&&e.characterName()!==s.file)e.setImage(s.file,0);});
    spec.decorations.forEach(function(s){var data=$dataMap.events[s.eventId];if(!data||data.note!==s.id)throw Error('Objetos M02: suporte fora do contrato; partida preservada.');if(!$gameMap.event(s.eventId))$gameMap._events[s.eventId]=new Game_Event(spec.mapId,s.eventId);});
   }
  }
  loaded.apply(this,arguments);
 };
})();
