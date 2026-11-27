/*:
 * @plugindesc v0.1.0 Fantasma de Fang Lair: exemplar RAM; encontro da campanha separado.
 * @author Codex
 * @help Após DebugHub/Continuation/Encounters/Battle. Reutiliza a sala RAM Map016.
 * Campanha usa fang.1.enemy.mif3.49 e EXP própria; este plugin só prepara o laboratório.
 */
var ArenaGhost;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaGhost',src:'ArenaGhost.json'});
 var pending=false,boot=DataManager.isDatabaseLoaded;
 function active(){return !!($gameSystem&&$gameSystem._arenaGhostSession&&ArenaContinuation.labActive());}
 function here(){return active()&&$gameMap.mapId()===$arenaGhost.entry.mapId;}
 DataManager.isDatabaseLoaded=function(){
  if(!boot.apply(this,arguments))return false;
  var c=$arenaGhost,t=c&&$dataTroops[c.troopId];
  if(!c||!$dataEnemies[c.enemyId]||!t||t.members.length!==1||t.members[0].enemyId!==c.enemyId||!$arenaBattleMotion.enemies[c.enemyId]||!$arenaLoot.enemies[c.enemyId]||!$dataMapInfos[c.entry.mapId]||c.encounters.entries.length!==1)throw Error('Fantasma: vínculos inválidos em ArenaGhost.json; reconstruir build-fang-ghost.');
  return true;
 };
 ArenaGhost={active:active,start:function(){
  if(!ArenaContinuation.previewArrival($arenaGhost.entry,true))return false;
  $gameSystem._arenaGhostSession=true;$gameActors.actor(1).changeLevel(2,false);pending=true;return true;
 }};
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){var c=$arenaGhost;return active()&&mapId===c.entry.mapId?{ok:true,config:{id:c.encounters.areaId,questId:'MQ02',mapId:mapId,encounters:c.encounters}}:forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===$arenaGhost.encounters.areaId?{ok:true,config:$arenaGhost.encounters}:encounters.apply(this,arguments);};
 var loaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){var c=$arenaGhost,target=$gamePlayer.isTransferring()?$gamePlayer.newMapId():$gameMap.mapId();
  if(active()&&target===c.entry.mapId){
   var spec=c.encounters.entries[0],e=$dataMap.events[spec.eventId];
   if(!e||[c.roomSourceEventNote,'ArenaEncounter:'+spec.id].indexOf(e.note)<0)throw Error('Fantasma: sala RAM incompatível; dados preservados.');
   var copy=JSON.parse(JSON.stringify(e));copy.name='Fantasma · inspeção RAM';copy.note='ArenaEncounter:'+spec.id;
   copy.pages[0].list=[{code:355,indent:0,parameters:['ArenaEncounters.start('+JSON.stringify(spec.id)+');']},{code:0,indent:0,parameters:[]}];
   var events=$dataMap.events.slice();events[spec.eventId]=copy;
   $dataMap=Object.assign({},$dataMap,{events:events,displayName:'Fantasma · inspeção RAM'});
  }loaded.apply(this,arguments);
 };
 var exp=Game_Enemy.prototype.exp,loot=ArenaLoot.tableForEnemy;
 Game_Enemy.prototype.exp=function(){return here()&&this.enemyId()===$arenaGhost.enemyId?0:exp.apply(this,arguments);};
 ArenaLoot.tableForEnemy=function(enemy){return here()&&enemy.enemyId()===$arenaGhost.enemyId?$arenaGhost.labLoot:loot.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&here()&&!$gamePlayer.isTransferring()){pending=false;if(!ArenaBattle.prepare($arenaGhost.entry.mapId))throw Error('Fantasma: preparo RAM indisponível.');}};
 ArenaDebugHub.register({symbol:'arenaGhost',name:'Fang Lair · Fantasma (RAM)',category:'combat',description:'Um exemplar flutuante: quatro direções, patrulha e contato. Campanha: menu RAM das celas leva ao acesso inferior; parâmetros provisórios.',saving:'Somente RAM · Guardar/Carregar teste · slots normais bloqueados'},ArenaGhost.start);
})();
