# Arena_FangCells 0.8.0

Os montes das alas secas usam o mesmo evento e recibo dos tesouros das celas, com posições geradas pela matriz. Saves anteriores recebem os eventos novos no Map013 sem mudar a posição. [Cobertura dos tesouros](../FANG_CELAS_M02_06A.md#tesouros-das-alas-secas--primeiro-nível).

As celas opcionais reutilizam chaves, portas e tesouros da campanha. A chave de latão é o item 10. As portas têm self-switch A próprio e os quatro montes são reconciliados pelo recibo `container/<id>`. [Fontes e roteiro](../FANG_CELAS_M02_06A.md#celas-opcionais-de-tesouro--primeiro-nível).

A cobertura de Map013 e Map017 é gerada pela matriz `doc/mapas/FANG_COBERTURA_M02.json`. A ampliação de Map017 traduz os saves anteriores em (+9,+51) antes de recarregar o mapa, preservando os IDs de eventos da quest. [Cobertura](../FANG_CELAS_M02_06A.md#alas-secas-dos-dois-níveis--m02-06b-e-m02-07b).

`leave` usa a posse do fragmento para interceptar a saída na etapa 100. `finishTharnVision` registra a leitura após a última página e inicia o encontro. Saves com a leitura registrada entram diretamente pela saída. O callback nativo de vitória avança 100 → 110 e conclui a quest; a próxima interação libera Rihad. O esqueleto reutilizado mantém combate e recompensas existentes. [Retaliação](../FANG_CELAS_M02_06A.md#retaliação-de-jagar-tharn--m02-08).

`takeStaffPiece` valida a porta, a etapa e a fonte. A coleta vincula o item importante 9 à etapa 100 e reusa a mensagem em largura integral. A fonte mantém o ID de evento ao expandir Map017. [Sala e fragmento](../FANG_CELAS_M02_06A.md#sala-e-primeiro-fragmento--m02-07b-trecho-de-campanha).

A escada conecta Map013 e Map017. `lowerRiddle/lowerAnswer` usam a etapa 80 e o recibo anterior como precondições. A etapa 90 e `fangLowerExplored` determinam abertura, colisão e página da porta. [Segundo nível](../FANG_CELAS_M02_06A.md#segundo-nível-até-o-enigma--m02-07a).

`offerTravel/travel` ligam o portão de Rihad ao Map013 após validar o recibo. O mapa mantém os IDs da amostra, com recarga no portão da mina para snapshots antigos. As páginas das aranhas usam self-switch B derivado de `fangSpidersReleased`. O perfil de encontros usa os quatro IDs existentes e o exemplar de Stonekeep. [Contrato e teste](../FANG_CELAS_M02_06A.md#entrada-e-celas-na-campanha--m02-06b-primeiro-trecho).

## Histórico da amostra 0.1.0

Núcleo focal de M02-06A; [fontes, mapa, limites e roteiro](../FANG_CELAS_M02_06A.md). Após Arena_DebugHub, Arena_CourtDelivery/Court/Continuation, Arena_CampaignConfig, Arena_Persistence/Quests/QuestJournal. Sem biblioteca externa ou alterações do motor.

Configuração `data/ArenaFangCells.json`, geometria `doc/mapas/FANG_CELAS_M02.json`; Map013, Tileset4 e portas existentes provisórios. Reconstruir via `node tools/build-fang-cells.cjs` ou pelo gerador de Rihad, que o chama ao final sem apagar conteúdo posterior. Não gerar conteúdo de campanha a partir de extrações ignoradas: a planta recortada e as âncoras conferidas estão versionadas.

`preview()` registra acesso centralizado ao hub, sessão RAM pela fixture existente de entrega; não cria slots ou modifica namespace. `interact/answer/takeKey/openPortal/limit/leave` exigem contexto de evento/mapa, proximidade, personagem de campanha, etapa elegível com recibo do pergaminho e ausência de batalha. Escolhas nativas e fence de soltura reutilizam Court; mensagem encerrada limpa destino e impede acionamento imediato. `sync/gateOpen` derivam páginas/colisão do estado da quest/recibo, não de switches como segunda fonte de verdade. Collider3×3 centrado na célula lógica; arte144px apoiada uma linha abaixo do centro. Exclusivo de Map013, sem alterar veículos/outros mapas.

Persistência existente: MQ02.objectives `fangCellsSolved`, `fangSpidersReleased`, `fangKeyFound`, `fangPortalOpened`; chave8 e fonte `fang.cell2.key`; recibo `MQ02.fang.lower-door`. Transações protegem estado/inventário com rollback; consumo+recibo+etapa síncronos. Nenhuma migração de formato ou IDs antigos. A amostra original só sinalizava a liberação das aranhas. O trecho de campanha passou a vinculá-las a encontros persistentes.

HTTP: URL de Items revisada para `Items.json?arena-data=fang-staff-piece-v1`, seguindo a correção prévia de Stonekeep para dados antigos em cache. Identifica a revisão do cadastro, não uma nova versão/namespace de saves; editor continua `Items.json`. Validação bloqueia inicialização se vínculos de mapa/fonte/recibo/item importante forem inválidos.

Teste focal: `node tools/test-fang-cells.cjs` (Playwright/Chrome instalados). Origem e perfil isolados, com saves sintéticos. O cenário entra pela campanha a partir de uma fixture de entrega do pergaminho. Verificações e evidências no documento principal.
