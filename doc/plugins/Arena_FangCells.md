# Arena_FangCells 0.2.0

`offerTravel/travel` ligam o portão de Rihad ao Map013 após validar o recibo. O mapa mantém os IDs da amostra, com recarga no portão da mina para snapshots antigos. As páginas das aranhas usam self-switch B derivado de `fangSpidersReleased`. O perfil de encontros usa os quatro IDs existentes e o exemplar de Stonekeep. [Contrato e teste](../FANG_CELAS_M02_06A.md#entrada-e-celas-na-campanha--m02-06b-primeiro-trecho).

## Histórico da amostra 0.1.0

Núcleo focal de M02-06A; [fontes, mapa, limites e roteiro](../FANG_CELAS_M02_06A.md). Após Arena_DebugHub, Arena_CourtDelivery/Court/Continuation, Arena_CampaignConfig, Arena_Persistence/Quests/QuestJournal. Sem biblioteca externa ou alterações do motor.

Configuração `data/ArenaFangCells.json`, geometria `doc/mapas/FANG_CELAS_M02.json`; Map013, Tileset4 e portas existentes provisórios. Reconstruir via `node tools/build-fang-cells.cjs` ou pelo gerador de Rihad, que o chama ao final sem apagar conteúdo posterior. Não gerar conteúdo de campanha a partir de extrações ignoradas: a planta recortada e as âncoras conferidas estão versionadas.

`preview()` registra acesso centralizado ao hub, sessão RAM pela fixture existente de entrega; não cria slots ou modifica namespace. `interact/answer/takeKey/openPortal/limit/leave` exigem contexto de evento/mapa, proximidade, personagem de campanha, etapa elegível com recibo do pergaminho e ausência de batalha. Escolhas nativas e fence de soltura reutilizam Court; mensagem encerrada limpa destino e impede acionamento imediato. `sync/gateOpen` derivam páginas/colisão do estado da quest/recibo, não de switches como segunda fonte de verdade. Collider3×3 centrado na célula lógica; arte144px apoiada uma linha abaixo do centro. Exclusivo de Map013, sem alterar veículos/outros mapas.

Persistência existente: MQ02.objectives `fangCellsSolved`, `fangSpidersReleased`, `fangKeyFound`, `fangPortalOpened`; chave8 e fonte `fang.cell2.key`; recibo `MQ02.fang.lower-door`. Transações protegem estado/inventário com rollback; consumo+recibo+etapa síncronos. Nenhuma migração de formato ou IDs antigos. Erro só sinaliza/libera quatro aranhas **ainda sem participante de combate**; não cadastrar marcadores como inimigos derrotáveis.

HTTP: URL de Items revisada para `Items.json?arena-data=fang-gold-key-v1`, seguindo a correção prévia de Stonekeep para dados antigos em cache. Identifica a revisão do cadastro, não uma nova versão/namespace de saves; editor continua `Items.json`. Validação bloqueia inicialização se vínculos de mapa/fonte/recibo/item importante forem inválidos.

Teste focal: `node tools/test-fang-cells.cjs` (Playwright/Chrome instalados). Origem/perfil isolados, RAM e slot16 sintético; não usa saves pessoais. Verificações e evidências no documento principal. Rihad não habilita viagem ao `fang.entry` ainda inexistente; Map013 é somente a amostra das celas.
