/*:
 * @plugindesc v0.1.0 Cálculo puro de recursos e escolhas por nível.
 * @author Codex
 * @help Sem dependências, IDs, estado global do jogo ou parâmetros.
 * API MVResourceProgression: clamp, growth, pending. Configuração pelo consumidor.
 */
var MVResourceProgression = (function() {
    'use strict';
    return {
        clamp: function(value, maximum) { return Math.max(0, Math.min(maximum, Math.floor(value))); },
        growth: function(choices, resourceId) {
            return Object.keys(choices).reduce(function(sum, level) {
                var c = choices[level];
                return sum + (c.resourceId === resourceId ? c.amount : 0);
            }, 0);
        },
        pending: function(baseline, level, choices) {
            var result = [];
            for (var n = baseline + 1; n <= level; n++) {
                if (!Object.prototype.hasOwnProperty.call(choices, String(n))) result.push(n);
            }
            return result;
        }
    };
})();
