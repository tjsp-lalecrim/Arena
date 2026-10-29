const assert=require('node:assert/strict');
exports.withoutEnding=s=>s.replace('MQ01 concluída neste teste técnico.\\nA demo completa começa em Novo Jogo.','Objetivo MQ01 concluído.\\nEncerramento narrativo reservado ao M01-18.').replace("if(window.ArenaNarrative&&ArenaNarrative.isCampaign())ArenaNarrative.finish();else ",'');
exports.baselinePlugins=function(current,previous){
 const parse=s=>JSON.parse(s.slice(s.indexOf('['),s.lastIndexOf(']')+1)),a=parse(current),b=parse(previous);
 assert.deepEqual(a.slice(0,b.length),b);assert.deepEqual(a.slice(b.length).map(p=>[p.name,p.status,p.parameters]),[['MV_NarrativePages',true,{}],['Arena_Narrative',true,{}]]);return previous;
};
