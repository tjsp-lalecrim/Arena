# Arena_Minotaur0.2.0

Minotauro de Stonekeep: Enemy8/Troop9, batalha/caminhada aprovadas, dois encontros de B1 e inspeções próprias RAM. [Fontes/arte/limites](../MINOTAURO_M02.md).

Dependências reais: Arena_DebugHub, Arena_Stonekeep, Arena_Continuation, Arena_CampaignConfig, Arena_Encounters, Arena_Battle/BattleMotion, Arena_Loot, Arena_Orc e Arena_LizardPatrol (ordem anterior, sala/encadeamento de hooks). Configuração `data/ArenaMinotaur.json`; perfil de atlas em ArenaBattleMotion; gerador `tools/build-stonekeep-minotaur.cjs`, chamado por build-stonekeep-sample. Registro canônico de js/plugins.js preservado. Não altera motor.

`ArenaMinotaur.startLab()` reutiliza previewMaterials e batalha9; `startWalkLab()` reutiliza previewArrival e prepara um exemplar Map016, chegada estável configurável. Hub registra somente duas entradas nas categorias existentes, nenhuma no título. `active()` exige laboratório e flag própria; contratos `forMap/encounters` delegam aos anteriores fora desse contexto.

Ao carregar Map016 no contexto próprio, valida a nota de origem do evento1 e cria uma cópia somente em memória com ID `technical.stonekeep.minotaur.walk.01`. Patrulha/colisão/contato/retorno/recibos usam Arena_Encounters. Guardar/Carregar RAM é o mecanismo existente; slots normais bloqueados pela sessão de continuação. Sair ao título remove a aplicabilidade do contexto; reabrir sala do orc/homem-lagarto restaura seu contrato. Nenhuma mudança de namespace, migração, saves pessoais ou arquivo Map016.

Validação de banco falha explicitamente para vínculos ausentes e recusa configuração incompleta de campanha; builder protege IDs reservados. Configuração de campanha explícita com60EXP provisória e ouro25%/6–60; tabelas vazias só nas inspeções próprias. [Testes focais e resultados](../MINOTAURO_M02.md#verificações-executadas-e-pendências).

**Campanha B1:** builder exige campaign.enabled/exp/loot explícitos; banco8 usa60EXP/tabela mínima de ouro. Batalha direta marca `_arenaMinotaurBattlePilot`; patrulha usa flag própria+Map016. Somente esses contextos retornam0EXP/tabela técnica, Map015 recebe a configuração de campanha. Duas posições B1 geradas pelo compilador da dungeon; seis restantes não distribuídas. Sem mudança de atributos, fórmula, namespace ou pipeline de recibos.
