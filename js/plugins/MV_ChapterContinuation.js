/*:
 * @plugindesc v0.1.0 Regras puras de continuidade por transição/destino estáveis.
 * @author Codex
 * @help Sem dependências, parâmetros, efeitos ou armazenamento. MVChapterContinuation:
 * defaults(), validate(state), inspect(context,state), begin(state,id,destination),
 * arrive(state). Não concede recursos, quests, itens ou transferências de mapa.
 */
var MVChapterContinuation = (function() {
    'use strict';
    function defaults() { return {phase:'idle', transitionId:null, destinationId:null}; }
    function identifier(v) { return typeof v==='string' && /^[a-zA-Z0-9][a-zA-Z0-9_.:/-]*$/.test(v) && !/^(constructor|prototype|__proto__)$/.test(v); }
    function validate(s) {
        if (!s || ['idle','travelling','arrived'].indexOf(s.phase)<0) throw Error('Estado de continuação inválido.');
        if (s.phase==='idle' ? s.transitionId!==null || s.destinationId!==null : !identifier(s.transitionId) || !identifier(s.destinationId)) throw Error('Identificadores de continuação inválidos.');
        return s;
    }
    function inspect(c,s) {
        validate(s);
        if (!c || c.mode==='technical' || c.experimental) return {code:'technical', eligible:false};
        if (c.mode!=='campaign' || !c.identity || ['partial_intro','pre_gate','ready'].indexOf(c.checkpoint)<0) throw Error('Campanha incompatível com a continuação.');
        if (s.phase!=='idle' && c.checkpoint!=='ready') throw Error('Transição antes do pré-requisito do capítulo.');
        if (s.phase!=='idle') return {code:s.phase, eligible:false};
        return {code:c.checkpoint, eligible:c.checkpoint==='ready'};
    }
    return {
        defaults:defaults, validate:validate, inspect:inspect,
        begin:function(s,id,destination) {
            validate(s);if (!identifier(id) || !identifier(destination)) throw Error('Destino/transição inválidos.');
            return s.phase==='idle'?{phase:'travelling',transitionId:id,destinationId:destination}:null;
        },
        arrive:function(s) {
            validate(s);return s.phase==='travelling'?{phase:'arrived',transitionId:s.transitionId,destinationId:s.destinationId}:null;
        }
    };
})();
