/*:
 * @plugindesc v0.1.0 Modelo de leitura e quebra de texto do diário, sem efeitos de jogo.
 * @author Codex
 * @help MVJournalModel.list/entry/wrap. Sem IDs, escrita, MV ou dependências.
 */
var MVJournalModel = (function() {
    'use strict';
    function wrap(text, width, measure) {
        var result=[];
        String(text||'').split('\n').forEach(function(paragraph){
            var line='';
            paragraph.split(/\s+/).filter(Boolean).forEach(function(word){
                var next=line?line+' '+word:word;
                if(measure(next)<=width){line=next;return;}
                if(line){result.push(line);line='';}
                Array.from(word).forEach(function(character){if(line&&measure(line+character)>width){result.push(line);line='';}line+=character;});
            });
            result.push(line);
        });
        return result;
    }
    return {
        wrap:wrap,
        list:function(definitions,states,filter){return definitions.filter(function(d){var q=states[d.id];return q&&(q.stage>0||q.completed)&&(!filter||filter==='all'||filter==='complete'&&q.completed||filter==='pending'&&!q.completed);});},
        entry:function(definition,q){
            return {id:definition.id,title:definition.title,completed:q.completed===true,status:q.completed===true?'Concluída':'Pendente',
                description:(definition.narrative||[]).filter(function(p){return p.revealAt<=q.stage;}).map(function(p){return p.text;}).join('\n\n'),
                steps:(definition.steps||[]).filter(function(s){return s.revealAt<=q.stage;}).map(function(s){var done=q.completed===true||q.stage>=s.doneAt||!!(q.objectives&&q.objectives[s.objectiveId]);return {id:s.id,done:done,text:done&&s.completedText?s.completedText:s.text};})};
        }
    };
})();
if(typeof module!=='undefined'&&module.exports)module.exports=MVJournalModel;
