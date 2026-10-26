/*:
 * @plugindesc v0.1.0 Funções puras reutilizáveis para nome e bônus de personagem.
 * @author Codex
 * @help Sem dependências, IDs, efeitos de save ou configurações de Arena.
 * API MVCharacterRules.name(value,max), traits(bonus), weaponBonus(bonus,level,group).
 */
var MVCharacterRules = (function() {
    'use strict';
    return {
        name: function(value, max) {
            if (typeof value !== 'string') throw new Error('Informe um nome.');
            var result = value.normalize('NFC').trim().replace(/\s+/g, ' ');
            if (!result || /[\u0000-\u001f\u007f\\]/.test(value) || Array.from(result).length > (max || 20)) {
                throw new Error('Use um nome de 1 a 20 caracteres, sem comandos.');
            }
            return result;
        },
        traits: function(bonus) {
            if (!bonus) return [];
            if (bonus.kind === 'elementRate') return [{ code: 11, dataId: bonus.elementId, value: bonus.value }];
            if (bonus.kind === 'stateImmunity') return [{ code: 14, dataId: bonus.stateId, value: 1 }];
            if (bonus.kind === 'agilityMultiplier') return [{ code: 21, dataId: 6, value: bonus.value }];
            return [];
        },
        weaponBonus: function(bonus, level, group) {
            if (!bonus || bonus.kind !== 'weaponLevelBonus' || !group) return 0;
            if (bonus.weapon !== 'all' && bonus.weapon !== group) return 0;
            return Math.floor(level / bonus.divisor);
        }
    };
})();
