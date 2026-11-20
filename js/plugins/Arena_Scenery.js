/*:
 * @plugindesc v0.1.0 Cenário M02: apresentação de fontes de missão e adereços confirmados.
 * @author Codex
 * @help Após plugins de campanha. ArenaScenery.json gerado de M02_CENARIO_CONFIRMADO_V01.
 * Somente imagem/visibilidade e decoração sem interação; não altera colisão, recibos ou quests.
 */
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaScenery',src:'ArenaScenery.json'});
 var database=DataManager.isDatabaseLoaded;DataManager.isDatabaseLoaded=function(){if(!database.apply(this,arguments))return false;if(!$arenaScenery||$arenaScenery.schemaVersion!==1||!Array.isArray($arenaScenery.urban)||!Array.isArray($arenaScenery.questSprites))throw Error('Cenário M02: configuração inválida.');return true;};
 function sync(){
  if(!window.$arenaScenery||!window.$gameSystem||!window.$gameMap)return;
  $arenaScenery.questSprites.forEach(function(v){
   if($gameMap.mapId()!==v.mapId)return;var e=$gameMap.event(v.eventId);if(!e||e._erased||!e.page())return;
   var visible;if(v.sourceId){var s=ArenaPersistence.sourceStatus(v.sourceId);visible=s.active&&s.missing>0;}
   else visible=$gameSelfSwitches.value([v.mapId,v.eventId,v.activationSwitch])&&!$gameSelfSwitches.value([v.mapId,v.eventId,v.collectedSwitch]);
   e.setImage('!$Arena_QuestObjects_V01',0);e._direction=2+v.kind*2;e.setPattern(1);e.setTransparent(!visible);
  });
 }
 var loaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  if(!$gamePlayer.isTransferring()&&$gameMap.mapId()===9)$arenaScenery.urban.forEach(function(v){if(!$gameMap.event(v.eventId)&&$dataMap.events[v.eventId])$gameMap._events[v.eventId]=new Game_Event(9,v.eventId);});
  loaded.apply(this,arguments);sync();
 };
 var refresh=Game_Map.prototype.refresh;Game_Map.prototype.refresh=function(){refresh.apply(this,arguments);sync();};
})();
