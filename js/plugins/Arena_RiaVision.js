/*:
 * @plugindesc v0.1.0 MQ02: visão única de Ria em repouso autorizado nível2+.
 * @author Codex
 * @help Após Arena_Rihad, Arena_Narrative, Arena_Recovery e Arena_Continuation.
 * Dados: ArenaRiaVision.json; recursos/quests/persistência já usados por Rihad.
 * Namespace arenaMQ02Narrative v1, independente da narrativa MQ01.
 * Cena/paginação/entrada existentes; nenhum recurso ou prêmio concedido aqui.
 * Título: Rihad · visão de Ria (RAM). Fixture explícita, nunca save pessoal.
 * Veja doc/VISAO_RIA_M02_03C.md. Sem dependências externas/parâmetros.
 */
var ArenaRiaVision;
(function(){
 'use strict';var ns='arenaMQ02Narrative';
 DataManager._databaseFiles.push({name:'$arenaRiaVision',src:'ArenaRiaVision.json'});
 MVStateStore.register(ns,1,{phase:'idle',section:0,word:0,history:[]});
 function validate(s){
  if(!s||['idle','reading','complete'].indexOf(s.phase)<0||!Number.isInteger(s.section)||s.section<0||!Number.isInteger(s.word)||s.word<0||!Array.isArray(s.history))throw Error('MQ02: cursor narrativo inválido.');
  if(s.phase==='reading'&&(!$arenaRiaVision.sections[s.section]||s.word>$arenaRiaVision.sections[s.section].text.split(/\s+/).length))throw Error('MQ02: posição fora do texto.');
  s.history.forEach(function(p){if(!Number.isInteger(p.section)||!$arenaRiaVision.sections[p.section]||!Number.isInteger(p.word)||p.word<0||p.word>$arenaRiaVision.sections[p.section].text.split(/\s+/).length)throw Error('MQ02: histórico inválido.');});return s;
 }
 function read(){return validate(MVStateStore.read(ns));}
 function active(){return !!$gameSystem&&read().phase==='reading';}
 function eligible(){var q=ArenaQuests.snapshot('MQ02');return ArenaNarrative.isCampaign()&&q&&q.stage===10&&!q.completed&&$gameActors.actor(1).level>=2&&read().phase==='idle'&&!$gameParty.inBattle()&&$gameMap.mapId()===$arenaRihad.arrival.mapId;}
 function begin(){if(!eligible())return false;
  if(MVStateStore.once(ns,'MQ02.ria.begin',function(s){s.phase='reading';s.section=0;s.word=0;s.history=[];})!=='applied')return false;
  $gameTemp.clearDestination();$gameTemp._arenaRestFeedback=null;SceneManager.goto(Scene_ArenaNarrative);return true;
 }
 function finish(){
  if(!active())return false;var backup=JsonEx.makeDeepCopy($gameSystem._persistentState);
  try{
   var q=ArenaQuests.snapshot('MQ02');
   MVStateStore.once(ns,'MQ02.ria.complete',function(s){s.phase='complete';});
   if(q.stage===10)ArenaPersistence.setQuest('MQ02',20,Object.assign({},q.objectives,{riaVision:true}),false);
   return true;
  }catch(e){$gameSystem._persistentState=backup;throw e;}
 }
 ArenaRiaVision={state:read,active:active,eligible:eligible,begin:begin,finish:finish,
  preview:function(){if(!ArenaRihad.preview())return false;var a=$gameActors.actor(1);a.changeLevel(2,false);a.setHp(35);a.setMp(10);ArenaPersistence.setResource('vigor',20,ArenaResources.snapshot().vigor.maximum);return true;}};
 ArenaNarrative.registerChapterSequence({active:active,read:read,write:function(s){validate(s);MVStateStore.replace(ns,s);},sections:function(){return $arenaRiaVision.sections;},finish:finish});
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;var c=$arenaRiaVision;
  if(!c||c.schemaVersion!==1||!Array.isArray(c.sections)||!c.sections.length||!c.sections.every(function(s){return s.id&&typeof s.text==='string'&&s.text&&typeof s.picture==='string';}))throw Error('MQ02: sequência de Ria inválida.');return true;};
 var extract=DataManager.extractSaveContents;
 DataManager.extractSaveContents=function(c){var e=c&&c.system&&c.system._persistentState&&c.system._persistentState.namespaces[ns];if(e)validate(e.data);return extract.apply(this,arguments);};
 var rest=ArenaRecovery.usePoint;
 ArenaRecovery.usePoint=function(id,interpreter){var result=rest.apply(this,arguments);
  if(id===$arenaRihad.restPointId&&(result.ok||result.reason==='full'))begin();return result;
 };
 var inform=ArenaRihad.inform;
 ArenaRihad.inform=function(i){var result=inform.apply(this,arguments),q=ArenaQuests.snapshot('MQ02');
  if(result&&q&&q.stage===20)ArenaPersistence.setQuest('MQ02',30,Object.assign({},q.objectives,{askRihad:true}),false);return result;};
 var list=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){list.apply(this,arguments);this.addCommand('Rihad · visão de Ria (RAM)','arenaRiaVisionPreview');};
 var title=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){title.apply(this,arguments);this._commandWindow.setHandler('arenaRiaVisionPreview',ArenaRiaVision.preview);};
})();
