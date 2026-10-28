# Arena_Quests0.1.0 e MV_QuestRules0.1.0

Codex, sem plugins externos. Ordem: contratos MV_StateStore/Arena_Persistence, personagem/recursos/combate/loot/UI, Arena_Dungeon, Arena_Encounters, MV_QuestRules, Arena_Quests. Sem parâmetros de editor. Config/textos em `data/ArenaQuests.json`, schema1, conteúdo MQ01 separado das regras puras.

MV_QuestRules: `check(requirement,count,receipt)` aceita requisito hold(quantity) ou receipt; `transition(stages,from,to,before,after)` exige próximo ID configurado e verifica saída/entrada. Não concede, salva ou conhece IDs de Arena. Pode validar outro conjunto de etapas sem o jogo.

Arena_Quests: `snapshot()` lê contrato MQ01; `begin()` inicia10 se0; `takeKey()` revalida mapa/proximidade/fonte, concede a falta e avança20; `useDoor()` valida posse/recibo e abre a cela; `reachGate()` valida contato/30 e conclui40/área; `reconcile()` saneia somente item1 e reconstrói fonte/porta; `treasure(index)` encaminha fonte opcional ao settlement existente; `openJournal()` abre diário somente de leitura. Retornos booleanos; chamadas repetidas não repetem pagamentos. Não há reset/abandono ou API de concluir arbitrariamente sem requisitos.

Estado usa quests/sources existentes do namespace arena v1 e arenaLoot v1 para contêineres. Nenhuma cópia de inventário, atributos ou consumo de recursos. Snapshot/rollback transacional da quest usa raiz persistente, pilha nativa de itens, self-switches e animação de porta. Não realizar efeitos assíncronos no meio da transição. Dados transitórios de diário não são salvos; condição visual é derivada após carregar.

Aliases: Game_Party.gainItem (somente chave1), Scene_Map.start (bootstrap/migração/reconciliação), Game_Player.checkEventTriggerThere (fonte da chave imediatamente à frente), menu (Diário); wrappers das APIs ArenaDungeon.setDoor/inspectTreasure. Demais portas, inventário comum, ações de combate, armas, raça e gênero preservados.

O bootstrap sem cena narrativa é técnico; M01-18 deverá iniciar pelo ponto correto de Ria usando begin e integrar F01 ao final. `reachGate()` já é idempotente e não deve ganhar um segundo consumidor de itens/recompensas. Detalhes de migração, textos, fontes, testes e limites em `../QUESTS_M01_16.md`.
