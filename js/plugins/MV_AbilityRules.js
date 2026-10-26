/*:
 * @plugindesc v0.1.0 Seleção pura de técnicas por equipamento, sem IDs do projeto.
 * @author Codex
 * @help MVAbilityRules.available(definitions, primaryType). Tipo0 = sem arma.
 * Sem parâmetros, dependências, estado persistente ou efeitos no motor.
 */
var MVAbilityRules = {
    available: function(definitions, primaryType) {
        return definitions.filter(function(d) { return d.weaponType === primaryType; }).map(function(d) { return d.skillId; });
    }
};
