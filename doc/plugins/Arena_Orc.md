# Arena_Orc0.1.0

Adaptador de batalha RAM, após Arena_DebugHub/Arena_Stonekeep e combate/recursos/loot. Carrega `ArenaOrc.json`, valida Enemy7/Troop8/perfil/tabela técnica e campanha desabilitada. API `ArenaOrc.startLab()` reutiliza `ArenaStonekeep.previewMaterials()` e `ArenaBattle.prepare(mapId)`, com flag pendente de uso único após transferência. Inicia batalha nativa sem fuga/canLose; não altera fluxos de dano, custo, ações, encontros ou salvamento.

Único registro `arenaOrc`, categoria Combate do hub; não adiciona comando ao título. Bloqueio de saves/retorno/fixture vêm de Arena_Continuation/Stonekeep, não são reimplementados. Repetição recria sessão técnica; EXP0/tabela vazia são explicitamente de laboratório, configuração de campanha desabilitada e sem eventos.

Gerador `tools/build-stonekeep-orc.cjs` atualiza somente o novo ID/perfis/tabela técnica, recusando IDs ocupados; chamado pelo pai da amostra. `tools/export-stonekeep-orc.py` empacota desenhos existentes, escala uniforme/apoio comum, sem gerar poses. Atlas carregado dinamicamente por Arena_BattleMotion no padrão já existente. Fontes, parâmetros, cobertura, acesso e testes em [ORC_M02.md](../ORC_M02.md).
