# MV_AbilityRules 0.1.0

`js/plugins/MV_AbilityRules.js`, Codex, sem parâmetros/plugins externos/save/hooks do motor. Carregar antes de Arena_Abilities. API pura `available(definitions,primaryType)`, retorna nova lista de skillIds cujas definições possuem weaponType igual ao tipo principal. Convenção0 representa ausência de arma no consumidor Arena, não é classe ou bloqueio racial. Exemplo independente: `available([{skillId:'custom',weaponType:42}],42)` retorna['custom']; nenhuma referência ao banco Arena. Validação em validate-abilities.cjs e cenários nativos M01-09.
