## Integração opcional Ria M02-03C

Arena_RiaVision envolve a interação de repouso e orientação. Informante pré-visão mantém instruções de chegada/repouso/arredores; depois da leitura aponta corte e a consulta válida avança20→30. Sem tocar em access/return/patrulha/receipts. Novo acesso de título Rihad · visão de Ria (RAM) prepara nível2 somente na fixture, mantendo chegada nível1 disponível. [Um roteiro agrupado](../VISAO_RIA_M02_03C.md); manuais adiados, sem aprovação inferida.

## v0.2.0 — arredores M02-03B

Delta: ArenaRihad.json.outskirts identifica entradas/retorno e eventos; visitOutskirts(interpreter)/returnToArrival(interpreter) validam mapa/evento/distância, MQ02≥10, campanha e ausência de batalha/transferência. Transferências nativas não curam/premiam. Somente dois acessos fixos, sem sistema geral de viagem. Perfil de quatro ratos em ArenaCampaign.json usa integralmente Arena_Encounters e loot existentes; completionQuestId MQ02 impede que conclusão MQ01 reative a área durante MQ02.

Preview chama ArenaContinuation.previewArrival(d,true): fixture de criação nível1, sem o preparo nível3/itens/magia do laboratório02A. O argumento opcional não altera o padrão anterior. RAM no menu dos dois mapas, gravação normal bloqueada nessa sessão. OnMapLoaded acrescenta somente evento4 ausente em saves03A, antes dos sprites. O gerador build-rihad-arrival.cjs passou a recompor Map009/010 e ambos os vínculos, sem desfazer acesso/repouso.

[Posições, roteiro e15 verificações focais](../ARREDORES_RIHAD_M02_03B.md). Trecho anterior abaixo é o contrato03A preservado.

# Arena_Rihad v0.1.0

Amostra M02-03A. Dependências: Arena_CampaignConfig, Arena_Continuation v0.2, Arena_Recovery e suas dependências já existentes. Sem plugin externo/parâmetros. Configuração em `data/ArenaRihad.json`: schema1, área `rihad`, destino `rihad.arrival`/Map009/(10,11)/direção8, evento do informante e ID de repouso.

Registra destino após carregar a base; não transfere ao simples boot/load. Cabeçalho e rótulos são UI provisória, não arte gerada ou referência arquitetônica aprovada. Nome nativo de mapa vazio evita título duplicado; nome na árvore MV preservado. Mensagens nativas mantêm margens e o fence de soltura antes da próxima interação. Nenhum diário/UI novo de quests.

APIs: `ArenaRihad.inform(interpreter)`, `arrivalNotice(interpreter)` (leitura de etapa, sem mutação) e `preview()` (somente fixture explícita a partir do título). Preview usa o laboratório existente e seus bloqueios de gravação, com snapshots RAM via menu. Não acrescenta namespace persistente ou sistema paralelo de saves.

`ArenaRecovery.json` acrescenta somente `MQ02.rihad.rest`. Flag `authorizedRefuge` permite reaproveitar indicação por proximidade, proteção de pressão e recomposição de evento em saves do mapa; não o classifica como refúgio de Imperial Dungeons. `usePoint` continua validando mapa/evento/distância, fora de batalha e recursos reais. Nenhuma recompensa ou respawn.

`node tools/build-rihad-arrival.cjs` recompõe apenas Map009, seu registro na árvore, vínculo da área e ponto de repouso. Preserva demais registros e não reexecuta geradores M01/arte. A origem usa tiles B existentes e piso por flags nativas; fonte visual/limites/roteiro em [chegada](../CHEGADA_RIHAD_M02_03A.md).

Teste focal: `tools/test-rihad-arrival.cjs`, Node com Playwright/Chrome disponíveis no ambiente, servidor/perfil efêmeros. Saída própria em `doc/evidencias/m02-03a/`; nenhum save pessoal. Não constitui teste de autoria no editor.
