# Arena_AbilityLab 0.1.0

`js/plugins/Arena_AbilityLab.js`, Codex. Após Arena_Abilities0.1.0; nenhuma dependência externa, parâmetro ou asset. IDs technicalMapId6/technicalTroopId1 em ArenaAbilities.json. API `open()`, `equip(weaponId)` e `run(Game_Action)` são diagnósticos restritos ao Map006 e fora de batalha. Outros contextos rejeitados; não usar como API de combate da campanha.

Entrada pelo título e evento(8,5), UI rolável, confirmação/cancelamento, troca de arma, kit explícito de livros, menu de itens, cama e zeros de diagnóstico. Configura uma tropa temporária a cada execução; chama startAction/updateAction/invokeAction nativos, com apenas janelas de apresentação vazias. Alvo não age, não entrega XP/loot, não há turnos completos, animações ou Scene_Battle. Restaura manager/tropa/ações/flag em finally, preservando efeitos e pagamentos no ator. `run` retorna recursos antes/depois, HP do alvo e resultado nativo, ou failure. Interações de kit são repetíveis explicitamente e não representam fonte de quest.

Aliases de título e cenas próprias. Não altera mapas anteriores. Custos/efeitos são os reais do banco; não há outro consumidor de ArenaVigorCost. Testes em tools/test-abilities.cjs e roteiro HABILIDADES_M01_09.md. Não declarar cumprimento de M01-10/11 ou teste no aparelho por esta visualização.
