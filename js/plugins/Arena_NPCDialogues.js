/*:
 * @plugindesc v0.1.0 Diálogos reutilizáveis por tópicos e blocos identificados.
 * @author Codex
 * @help Após Arena_Rihad/RiaVision/Court/CourtDelivery. ArenaNPCDialogues.json.
 * Reutiliza mensagens/retratos/paginação de ArenaCourt, escolhas e rolagem nativas.
 * Não concede efeitos genéricos: somente adaptador explícito de orientação já existente.
 */
var ArenaNPCDialogues;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaNPCDialogues',src:'ArenaNPCDialogues.json'});
 var legacyInform=ArenaRihad.inform;
 function stage(){return ArenaQuests.snapshot('MQ02').stage;}
 function allowed(t){return(t.minStage===undefined||stage()>=t.minStage)&&(t.maxStage===undefined||stage()<=t.maxStage);}
 function valid(i,n){var e=n&&$gameMap.event(n.eventId);return n&&i instanceof Game_Interpreter&&i._mapId===n.mapId&&i.eventId()===n.eventId&&$gameMap.mapId()===n.mapId&&e&&!e._erased&&$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)<=1&&ArenaNarrative.isCampaign()&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&stage()>=10;}
 function expand(text,n,t){var vars={city:n.city,npc:n.name,character:$gameParty.leader().name(),destination:t&&t.destination||'',rulerTitle:n.rulerTitle};return text.replace(/\{([a-zA-Z]+)\}/g,function(all,key){if(!Object.prototype.hasOwnProperty.call(vars,key))throw Error('Dialogue variable unknown: '+key);return String(vars[key]).replace(/[\\%{}]/g,'');});}
 function texts(block,n,t){return $arenaNPCDialogues.blocks[block].texts.map(function(s){return expand(s,n,t);});}
 function respond(i,id,tid){var n=$arenaNPCDialogues.npcs[id],t=n&&n.topics.filter(function(t){return t.id===tid&&allowed(t);})[0];if(!valid(i,n)||!t)return false;if(t.action==='rihad.orientation')return legacyInform.call(ArenaRihad,i);var v=(t.variants||[]).filter(allowed)[0];return ArenaCourt.show(i,texts(v?v.block:t.block,n,t),{name:n.face,index:0});}
 function open(i,id){var n=$arenaNPCDialogues.npcs[id];if(!valid(i,n)||$gameMessage.isBusy())return false;var topics=n.topics.filter(allowed);if(!topics.length)return false;if(topics.length===1)return respond(i,id,topics[0].id);
  var names=topics.map(function(t){return t.label;}).concat(['Encerrar conversa']),last=names.length-1,list=[{code:112,indent:0,parameters:[]},{code:102,indent:1,parameters:[names,last,last,2,0]}];
  topics.forEach(function(t,j){list.push({code:402,indent:1,parameters:[j,t.label]},{code:355,indent:2,parameters:['ArenaNPCDialogues.respond(this,'+JSON.stringify(id)+','+JSON.stringify(t.id)+');']});});list.push({code:402,indent:1,parameters:[last,names[last]]},{code:113,indent:2,parameters:[]},{code:404,indent:1,parameters:[]},{code:413,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});list.splice(list.length-1,0,{code:355,indent:0,parameters:['$gameTemp._arenaNPCDialogue=false;']});$gameTemp._arenaNPCDialogue=true;i.setupChild(list,i.eventId());return true;
 }
 ArenaNPCDialogues={open:open,respond:respond,expand:expand,available:function(id){var n=$arenaNPCDialogues.npcs[id];return n?n.topics.filter(allowed).map(function(t){return t.id;}):[];},presentOrientation:function(i){var n=$arenaNPCDialogues.npcs['rihad.informant'];if(!valid(i,n))return false;var q=stage(),b=q<20?'rest':q<40||q>=50&&q<60?'court':'gate';return ArenaCourt.show(i,texts('rihad.orientation.'+b,n),{name:n.face,index:0});}};
 var choiceStart=Window_ChoiceList.prototype.start;Window_ChoiceList.prototype.start=function(){choiceStart.apply(this,arguments);if($gameTemp._arenaNPCDialogue){this._arenaCourtAwaitNeutral=true;this._arenaCourtReadyAt=Date.now()+150;}};
 ArenaRihad.inform=function(i){return open(i,'rihad.informant');};
 var loaded=DataManager.isDatabaseLoaded,validated=false;DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!validated){var c=$arenaNPCDialogues;if(!c||c.schemaVersion!==1)throw Error('NPC dialogues: invalid configuration');var ids={};Object.keys(c.blocks).forEach(function(k){var b=c.blocks[k];if(b.id!==k||!b.source||!Array.isArray(b.texts)||b.texts.some(function(s){return typeof s!=='string'||/%|\\|&|#[0-9]/.test(s);}))throw Error('NPC dialogue block invalid: '+k);});Object.keys(c.npcs).forEach(function(k){var n=c.npcs[k],seen={};if(n.id!==k||ids[n.mapId+'/'+n.eventId])throw Error('NPC dialogue binding duplicate: '+k);ids[n.mapId+'/'+n.eventId]=true;n.topics.forEach(function(t){if(seen[t.id]||t.action&&t.action!=='rihad.orientation'||!t.action&&!c.blocks[t.block])throw Error('NPC dialogue topic invalid: '+k);seen[t.id]=true;(t.variants||[]).forEach(function(v){if(!c.blocks[v.block])throw Error('NPC dialogue variant missing');});});});validated=true;}return true;};
})();
