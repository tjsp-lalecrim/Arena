/*:
 * @plugindesc v0.1.0 Regras puras de patrulha delimitada e reativação de encontros.
 * @author Codex
 * @help Sem parâmetros, IDs de jogo, dependências ou efeitos colaterais.
 * MVEncounterRules.directions(tick), within(x,y,origin,radius), exit(area,enemies).
 */
var MVEncounterRules = (function() {
    'use strict';
    return {
        directions: function(tick) {
            var d = [2, 6, 8, 4], offset = Math.floor(tick / 4) % 4;
            return d.slice(offset).concat(d.slice(0, offset));
        },
        within: function(x, y, origin, radius) {
            return Math.abs(x - origin[0]) + Math.abs(y - origin[1]) <= radius;
        },
        exit: function(area, enemies) {
            var next = JSON.parse(JSON.stringify({area: area, enemies: enemies}));
            next.area.exitRevision += 1;
            if (area.completed) {
                next.area.generation += 1;
                Object.keys(next.enemies).forEach(function(id) {
                    var e = next.enemies[id];
                    if (!e.questSpecific) { e.defeated = false; e.generation = next.area.generation; }
                });
            }
            return next;
        }
    };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = MVEncounterRules;
