/*:
 * @plugindesc v0.1.0 Índices puros por quest/área/fonte/recibo, sem estado de partida.
 * @author Codex
 * @help MVCampaignConfig.create(base,extension) mantém base se a extensão inválida.
 * lookup(kind,id), forMap(mapId), diagnostics. Sem IDs de Arena/dependências.
 */
var MVCampaignConfig=(function(){
 'use strict';
 function copy(v){return JSON.parse(JSON.stringify(v));}
 function freeze(v){if(v&&typeof v==='object'){Object.keys(v).forEach(function(k){freeze(v[k]);});Object.freeze(v);}return v;}
 function id(v){if(typeof v!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9_.:/-]*$/.test(v)||['constructor','prototype','__proto__'].indexOf(v)>=0)throw Error('Identificador inválido.');return v;}
 function empty(){return {quests:{},areas:{},sources:{},receipts:{},maps:{},enemies:{}};}
 function add(index,bundle){
  if(!bundle||bundle.schemaVersion!==1)throw Error('Versão de configuração inválida.');
  ['quests','areas','sources','receipts'].forEach(function(kind){
   if(!Array.isArray(bundle[kind]))throw Error('Lista ausente: '+kind);
   bundle[kind].forEach(function(record){id(record.id);if(index[kind][record.id])throw Error('ID duplicado: '+record.id);index[kind][record.id]=copy(record);});
  });
  Object.keys(index.quests).forEach(function(k){var q=index.quests[k];if(!Array.isArray(q.stages)||!q.stages.length)throw Error('Etapas ausentes: '+k);var seen={};q.stages.forEach(function(s){if(!Number.isInteger(s.id)||s.id<0||seen[s.id])throw Error('Etapa inválida: '+k);seen[s.id]=true;});q.stages.forEach(function(s){if(s.next!==null&&!seen[s.next])throw Error('Próxima etapa ausente: '+k);});});
  index.maps={};index.enemies={};
  Object.keys(index.areas).forEach(function(k){var a=index.areas[k];if(!index.quests[a.questId])throw Error('Quest da área ausente: '+k);
   if(a.mapId!==null){if(!Number.isInteger(a.mapId)||a.mapId<1||index.maps[a.mapId])throw Error('Mapa duplicado/inválido: '+k);index.maps[a.mapId]=k;}
   if(a.encounters){var e=a.encounters;if(a.mapId===null||e.mapId!==a.mapId||e.areaId!==k||e.completionQuestId!==a.questId||!Array.isArray(e.entries)||!e.mapVisuals)throw Error('Perfil de encontros inconsistente: '+k);
    e.entries.forEach(function(v){id(v.id);if(index.enemies[v.id])throw Error('Inimigo duplicado entre áreas: '+v.id);index.enemies[v.id]=k;});}
  });
  var items={};
  Object.keys(index.sources).forEach(function(k){var s=index.sources[k];if(!index.quests[s.questId]||!index.areas[s.areaId]||index.areas[s.areaId].questId!==s.questId)throw Error('Fonte fora da quest/área: '+k);
   if(!Number.isInteger(s.quantity)||s.quantity<1||s.itemId!==null&&(!Number.isInteger(s.itemId)||s.itemId<1)||!Array.isArray(s.stages)||!s.stages.length||s.stages.some(function(v){return !index.quests[s.questId].stages.some(function(t){return t.id===v;});}))throw Error('Fonte inválida: '+k);
   if(index.receipts[k])throw Error('ID de fonte/recibo repetido: '+k);
   if(s.itemId!==null){if(items[s.itemId])throw Error('Item importante vinculado a fontes distintas: '+s.itemId);items[s.itemId]=k;}
  });
  Object.keys(index.receipts).forEach(function(k){var r=index.receipts[k],s=index.sources[r.sourceId];if(!s||r.questId!==s.questId||['deliver','consume'].indexOf(r.kind)<0)throw Error('Recibo fora da fonte/quest: '+k);});
  Object.keys(index.sources).forEach(function(k){var s=index.sources[k];if(s.receiptIds!==undefined&&(!Array.isArray(s.receiptIds)||s.receiptIds.some(function(key){var r=index.receipts[key];return !r||r.sourceId!==k||r.questId!==s.questId;})))throw Error('Recibos da fonte inconsistentes: '+k);});
 }
 function create(base,extension){
  var index=empty(),diagnostics=[];add(index,base);
  if(extension!==undefined&&extension!==null){var candidate=copy(index);try{add(candidate,extension);index=candidate;}catch(e){diagnostics.push(e.message);}}
  freeze(index);freeze(diagnostics);
  return {diagnostics:diagnostics,lookup:function(kind,key){if(['quests','areas','sources','receipts'].indexOf(kind)<0||!Object.prototype.hasOwnProperty.call(index[kind],key))return {ok:false,code:'unknown_'+kind,id:key};return {ok:true,config:index[kind][key]};},
   forMap:function(mapId){return Number.isInteger(mapId)&&mapId>0&&index.maps[mapId]?{ok:true,config:index.areas[index.maps[mapId]]}:{ok:false,code:'unknown_map',id:mapId};}};
 }
 return {create:create};
})();
