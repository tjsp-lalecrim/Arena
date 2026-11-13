/*:
 * @plugindesc v0.1.0 Seleção de contratos MQ01/MQ02, sem ativar conteúdo novo.
 * @author Codex
 * @help Após MVCampaignConfig e adaptadores M01. Dados: ArenaCampaign.json.
 * APIs quest/area/source/receipt/forMap/encounters/diagnostics. Retornos ok/code.
 * Perfis MQ02 sem mapa/item vinculado são contratos, não conteúdo jogável.
 * Sem parâmetros ou dependências externas. doc/plugins/Arena_CampaignConfig.md.
 */
var ArenaCampaignConfig;
(function(){
 'use strict';var registry=null;
 DataManager._databaseFiles.push({name:'$arenaCampaign',src:'ArenaCampaign.json'});
 function unavailable(){return {ok:false,code:'not_ready'};}
 function lookup(kind,id){return registry?registry.lookup(kind,id):unavailable();}
 ArenaCampaignConfig={ready:function(){return !!registry;},quest:function(id){return lookup('quests',id);},area:function(id){return lookup('areas',id);},source:function(id){return lookup('sources',id);},receipt:function(id){return lookup('receipts',id);},
  forMap:function(mapId){return registry?registry.forMap(mapId):unavailable();},
  encounters:function(areaId){var r=lookup('areas',areaId);if(!r.ok)return r;return r.config.encounters?{ok:true,config:areaId===$arenaEncounters.areaId?$arenaEncounters:r.config.encounters}:{ok:false,code:'unbound_encounters',id:areaId};},
  diagnostics:function(){return registry?registry.diagnostics.slice():['Configurações ainda não carregadas.'];}};
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){
  if(!loaded.apply(this,arguments))return false;
  if(!registry){
   var s=ArenaPersistence.sourceDefinitions(),sources=Object.keys(s).map(function(k){return Object.assign({id:k,areaId:$arenaEncounters.areaId},s[k]);});
   registry=MVCampaignConfig.create({schemaVersion:1,quests:[Object.assign({id:$arenaQuests.questId},$arenaQuests)],areas:[{id:$arenaEncounters.areaId,questId:$arenaQuests.questId,mapId:$arenaEncounters.mapId,encounters:$arenaEncounters}],sources:sources,receipts:[{id:$arenaQuests.receiptId,questId:$arenaQuests.questId,sourceId:$arenaQuests.sourceId,kind:'consume'}]},window.$arenaCampaign);
  }
  return true;
 };
})();
