/*:
 * @plugindesc v0.1.0 Entrega única do pergaminho; Fang Lair conhecida sem viagem.
 * @author Codex
 * @help Após Arena_DebugHub, Arena_Court e Arena_Stonekeep.
 * Configuração: ArenaCourt.json.delivery. Usa consumo/recibo existentes.
 * API ArenaCourtDelivery.destination/preview; laboratório somente RAM.
 * Não concede prêmios, não conclui MQ02 nem habilita mapa ausente.
 */
var ArenaCourtDelivery;
(function(){
 'use strict';var pending=false;
 function cfg(){return $arenaCourt.delivery;}
 function quest(){return ArenaQuests.snapshot(cfg().questId);}
 function settled(q){var s=ArenaCampaignConfig.source(cfg().sourceId),r=q.receipts[cfg().receiptId];return s.ok&&!!r&&r.sourceId===cfg().sourceId&&r.itemId===s.config.itemId&&r.quantity===s.config.quantity&&r.kind==='deliver';}
 function valid(i){var c=$arenaRihad.court,e=$gameMap.event(c.queenEventId);return !$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&ArenaNarrative.isCampaign()&&$gameMap.mapId()===c.entry.mapId&&i instanceof Game_Interpreter&&i._mapId===c.entry.mapId&&i.eventId()===c.queenEventId&&e&&!e._erased&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1;}
 function show(i,key){return ArenaCourt.show(i,cfg()[key]);}
 function deliver(i){
  if(!valid(i)||i._branch[0]!==0)return false;
  var c=cfg(),q=quest(),s=ArenaPersistence.sourceStatus(c.sourceId);
  if(q.stage!==c.from||settled(q)||!s.active)return show(i,'blocked');
  if(s.missing)return show(i,'missing');
  // Same synchronous rollback boundary as the Stonekeep collection and MQ01:
  // native inventory + existing persistent store; save/load cannot interleave.
  var backup=JsonEx.makeDeepCopy($gameSystem._persistentState),items=Object.assign({},$gameParty._items);
  try{
   if(ArenaPersistence.consumeImportant(c.sourceId,c.receiptId,'deliver')!=='consumed')return show(i,'blocked');
   ArenaPersistence.setQuest(c.questId,c.to,Object.assign({},q.objectives,{parchmentDelivered:true,fangLairKnown:true}),false);
  }catch(e){$gameSystem._persistentState=backup;$gameParty._items=items;$gameMap.requestRefresh();throw e;}
  return show(i,'delivered');
 }
 ArenaCourtDelivery={
  deliver:deliver,
  destination:function(){var c=cfg(),q=quest();return {id:c.destination.id,known:q.stage>=c.to&&settled(q),available:false,reason:'destination_not_implemented'};},
  preview:function(){if(!ArenaStonekeep.preview())return false;pending=true;return true;}
 };
 var talk=ArenaCourt.talk;
 ArenaCourt.talk=function(i){
  var c=cfg(),q=quest();if(q.stage<c.from)return talk.apply(this,arguments);
  if(!valid(i)||$gameMessage.isBusy())return false;
  if(q.stage>=c.to)return show(i,settled(q)?'repeat':'blocked');
  var s=ArenaPersistence.sourceStatus(c.sourceId);
  if(settled(q)||!s.active)return show(i,'blocked');
  if(s.missing)return show(i,'missing');
  // Native choices retain the court's release/neutral-input fence. Cancel is no.
  ArenaCourt.show(i,c.offer);var child=i._childInterpreter,list=child._list;
  list.pop();list.push({code:102,indent:0,parameters:[['Entregar o pergaminho','Agora não'],1,1,2,0]},
   {code:402,indent:0,parameters:[0,'Entregar o pergaminho']},{code:355,indent:1,parameters:['ArenaCourtDelivery.deliver(this);']},
   {code:402,indent:0,parameters:[1,'Agora não']},{code:355,indent:1,parameters:["ArenaCourt.show(this,$arenaCourt.delivery.declined);"]},
   {code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});return true;
 };
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=cfg(),s=c&&ArenaCampaignConfig.source(c.sourceId),r=c&&ArenaCampaignConfig.receipt(c.receiptId),a=c&&ArenaCampaignConfig.area(c.destination.areaId),q=c&&ArenaCampaignConfig.quest(c.questId);
  if(!c||!s.ok||!r.ok||!a.ok||!q.ok||s.config.questId!==c.questId||s.config.quantity!==1||s.config.itemId!==7||!$dataItems[7]||$dataItems[7].itypeId!==2||r.config.sourceId!==c.sourceId||r.config.questId!==c.questId||r.config.kind!=='deliver'||!q.config.stages.some(function(v){return v.id===c.from&&v.next===c.to;})||!['offer','missing','declined','delivered','repeat','blocked'].every(function(k){return Array.isArray(c[k])&&c[k].length&&c[k].every(function(t){return typeof t==='string'&&t.length;});}))throw Error('Corte: vínculos de entrega do pergaminho inválidos.');return true;};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===$arenaRihad.arrival.mapId&&!$gamePlayer.isTransferring()){
  pending=false;if(ArenaPersistence.claimSource(cfg().sourceId)!=='granted')throw Error('Corte: fixture de entrega sem pergaminho.');
  var q=quest();ArenaPersistence.setQuest(cfg().questId,cfg().from,Object.assign({},q.objectives,{parchmentRecovered:true}),false);
  var e=$arenaRihad.court.entry;$gameTemp.clearDestination();$gamePlayer.reserveTransfer(e.mapId,e.x,e.y,e.direction,0);
 }};
 ArenaDebugHub.register({symbol:'arenaCourtDelivery',name:'Rihad · entregar pergaminho (RAM)',category:'campaign',description:'Etapa50, pergaminho no inventário. Falar, entregar, consultar diário e repetir sem duplicar.',saving:'Somente RAM · slots normais bloqueados'},ArenaCourtDelivery.preview);
})();
