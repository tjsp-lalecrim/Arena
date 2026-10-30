/*:
 * @plugindesc v0.1.0 Regras puras de concessão e distribuição de pontos por nível.
 * @author Codex
 * @help Sem dependências, parâmetros ou estado global de partida. API MVAttributePoints:
 * defaults(), validate(state), grant(state,level,config), balance(state),
 * allocate(state,allocation,config). Retorna cópias JSON; sem efeitos no motor.
 * Config: firstLevel, pointsPerLevel, valuePerPoint, attributes (IDs de parâmetros).
 * Veja doc/plugins/Arena_Attributes.md. Sem redistribuição ou regras de combate.
 */
var MVAttributePoints = (function() {
    'use strict';
    function copy(x) { return JSON.parse(JSON.stringify(x)); }
    function integer(x) { return Number.isSafeInteger(x) && x >= 0; }
    function sum(x) { return Object.keys(x).reduce(function(n,k) { return n+x[k]; },0); }
    function defaults() { return { highestLevel:1, grants:{}, spent:{}, increases:{}, revision:0 }; }
    function balance(s) { return sum(s.grants)-sum(s.spent); }
    function validate(s) {
        if (!s || !integer(s.highestLevel) || s.highestLevel<1 || !integer(s.revision)) throw Error('Pontos: estado inválido.');
        ['grants','spent','increases'].forEach(function(field) {
            var o=s[field];
            if (!o || typeof o!=='object' || Array.isArray(o)) throw Error('Pontos: registro inválido.');
            Object.keys(o).forEach(function(k) {
                if (!/^[0-9]+$/.test(k) || !integer(o[k]) ||
                    (field==='grants' ? Number(k)<2 || Number(k)>s.highestLevel : Number(k)<2 || Number(k)>7)) throw Error('Pontos: entrada inválida.');
            });
        });
        if (!integer(sum(s.grants)) || !integer(sum(s.spent)) || balance(s)<0) throw Error('Pontos: saldo inválido.');
        return true;
    }
    function grant(state,level,c) {
        validate(state);
        if (!integer(level) || level<1) throw Error('Pontos: nível inválido.');
        var s=copy(state);
        for (var n=Math.max(s.highestLevel+1,c.firstLevel);n<=level;n++) s.grants[String(n)]=c.pointsPerLevel;
        if (level>s.highestLevel) { s.highestLevel=level;s.revision++; }
        validate(s);return s;
    }
    function allocate(state,allocation,c) {
        validate(state);
        if (!allocation || typeof allocation!=='object' || Array.isArray(allocation)) return null;
        var keys=Object.keys(allocation),total=0,s=copy(state);
        if (!keys.every(function(k) { return c.attributes.indexOf(Number(k))>=0 && String(Number(k))===k && integer(allocation[k]); })) return null;
        keys.forEach(function(k) { total+=allocation[k]; });
        if (!integer(total) || total<1 || total>balance(s)) return null;
        keys.forEach(function(k) {
            s.spent[k]=(s.spent[k]||0)+allocation[k];
            s.increases[k]=(s.increases[k]||0)+allocation[k]*c.valuePerPoint;
        });
        s.revision++;validate(s);return s;
    }
    return {defaults:defaults,validate:validate,balance:balance,grant:grant,allocate:allocate};
})();
