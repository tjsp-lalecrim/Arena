/*:
 * @plugindesc v0.1.0 Validação pura de etapas e requisitos de quests.
 * @author Codex
 * @help Sem IDs, inventário ou dependências. check(requirement,count,receipt)
 * e transition(stages,from,to,before,after) verificam saída e entrada.
 */
var MVQuestRules = (function() {
    'use strict';
    function check(r, count, receipt) {
        if (!r) return true;
        if (r.mode === 'hold') return count >= r.quantity;
        if (r.mode === 'receipt') return receipt === true;
        throw Error('MV_QuestRules: requisito desconhecido');
    }
    return {
        check:check,
        transition:function(stages,from,to,before,after) {
            var a=stages.filter(function(s){return s.id===from;})[0],b=stages.filter(function(s){return s.id===to;})[0];
            return !!(a&&b&&a.next===to&&check(a.exit,before.count,before.receipt)&&check(b.entry,after.count,after.receipt));
        }
    };
})();
if(typeof module!=='undefined'&&module.exports)module.exports=MVQuestRules;
