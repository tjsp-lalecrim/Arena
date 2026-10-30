# Arena_QuestJournal0.2.0 / MV_JournalModel0.1.0

Codex. Dependências diretas: Arena_Quests (e seus contratos Arena_Persistence/config), MV_JournalModel, MV1.6.1. Sem plugins externos, parâmetros ou comandos adicionais. Carregar os dois depois de Arena_Quests. `ArenaQuests.openJournal()` mantém o ponto de entrada do menu e delega para `ArenaQuestJournal.open()`.

MV_JournalModel não conhece IDs do jogo nem o MV: list(definitions,states,filter) filtra apenas quests disponíveis; entry(definition,state) deriva narrativa/passos revelados e status booleano; wrap(text,width,measure) quebra linhas com a função de medição fornecida, incluindo palavras extensas. Entradas não são modificadas. Filtros internos pending/complete/all; rótulos pt-BR.

ArenaQuestJournal lê `ArenaQuestJournal.json` schema1: quests[id,title,narrative[revealAt,text],steps[id,objectiveId,revealAt,doneAt,text,completedText],source]. Somente dados de apresentação: não adicionar condições de progressão/consumo/recompensa aqui. Quest não iniciada ou sem registro não aparece. Notificações de inconsistência MQ01 são consultas, sem recuperação automática disparada pelo diário.

API open() cria Scene_ArenaJournal; inspect() expõe modelo/layout transitórios para validação. Navegação em `$gameTemp._arenaJournalView`, não serializada: filtro, seleção por filtro, offsets por quest e contexto. Nenhuma escrita no Game_System/contratos de quest/inventário. A cena mantém uma única superfície de UI; painéis ocultos não têm alvos de entrada.

O resize usa setters nativos Graphics.width/height/boxWidth/boxHeight apenas durante a cena, restaurando valores na saída. Listener de roda limitado à cena/removido em terminate. Alias Input._shouldPreventDefault restringe somente Tab no diário; as demais cenas delegam ao comportamento anterior. Não altera arquivo interno do motor, atalhos de batalha ou outros menus.

Navegação, medidas, textos/fontes, testes/limites e fixtures: `../REVISAO_DIARIO_M01_16_R02.md`. Aplicar NAV01 em `../DIRETIVA_DE_NAVEGACAO.md` nas futuras revisões.
