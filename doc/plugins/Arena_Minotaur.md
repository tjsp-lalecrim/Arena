# Arena_Minotaur0.1.0

Exemplar técnico de Stonekeep: Enemy8/Troop9, batalha lateral e caminhada, sem encontros de campanha. [Fontes/arte/limites](../MINOTAURO_M02.md).

Dependências reais: Arena_DebugHub, Arena_Stonekeep, Arena_Continuation, Arena_CampaignConfig, Arena_Encounters, Arena_Battle/BattleMotion, Arena_Loot, Arena_Orc e Arena_LizardPatrol (ordem anterior, sala/encadeamento de hooks). Configuração `data/ArenaMinotaur.json`; perfil de atlas em ArenaBattleMotion; gerador `tools/build-stonekeep-minotaur.cjs`, chamado por build-stonekeep-sample. Registro canônico de js/plugins.js preservado. Não altera motor.

`ArenaMinotaur.startLab()` reutiliza previewMaterials e batalha9; `startWalkLab()` reutiliza previewArrival e prepara um exemplar Map016, chegada estável configurável. Hub registra somente duas entradas nas categorias existentes, nenhuma no título. `active()` exige laboratório e flag própria; contratos `forMap/encounters` delegam aos anteriores fora desse contexto.

Ao carregar Map016 no contexto próprio, valida a nota de origem do evento1 e cria uma cópia somente em memória com ID `technical.stonekeep.minotaur.walk.01`. Patrulha/colisão/contato/retorno/recibos usam Arena_Encounters. Guardar/Carregar RAM é o mecanismo existente; slots normais bloqueados pela sessão de continuação. Sair ao título remove a aplicabilidade do contexto; reabrir sala do orc/homem-lagarto restaura seu contrato. Nenhuma mudança de namespace, migração, saves pessoais ou arquivo Map016.

Validação de banco falha explicitamente para vínculos ausentes e impede habilitar campanha por acidente; builder protege IDs reservados. Campanha desabilitada/EXP e loot futuros não configurados. As tabelas vazias de Enemy8 são exclusivamente do laboratório. [Testes focais e resultados](../MINOTAURO_M02.md#verificações-executadas-e-pendências).
