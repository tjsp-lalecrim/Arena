# Arena_Rihad v0.1.0

Amostra M02-03A. Dependências: Arena_CampaignConfig, Arena_Continuation v0.2, Arena_Recovery e suas dependências já existentes. Sem plugin externo/parâmetros. Configuração em `data/ArenaRihad.json`: schema1, área `rihad`, destino `rihad.arrival`/Map009/(10,11)/direção8, evento do informante e ID de repouso.

Registra destino após carregar a base; não transfere ao simples boot/load. Cabeçalho e rótulos são UI provisória, não arte gerada ou referência arquitetônica aprovada. Nome nativo de mapa vazio evita título duplicado; nome na árvore MV preservado. Mensagens nativas mantêm margens e o fence de soltura antes da próxima interação. Nenhum diário/UI novo de quests.

APIs: `ArenaRihad.inform(interpreter)`, `arrivalNotice(interpreter)` (leitura de etapa, sem mutação) e `preview()` (somente fixture explícita a partir do título). Preview usa o laboratório existente e seus bloqueios de gravação, com snapshots RAM via menu. Não acrescenta namespace persistente ou sistema paralelo de saves.

`ArenaRecovery.json` acrescenta somente `MQ02.rihad.rest`. Flag `authorizedRefuge` permite reaproveitar indicação por proximidade, proteção de pressão e recomposição de evento em saves do mapa; não o classifica como refúgio de Imperial Dungeons. `usePoint` continua validando mapa/evento/distância, fora de batalha e recursos reais. Nenhuma recompensa ou respawn.

`node tools/build-rihad-arrival.cjs` recompõe apenas Map009, seu registro na árvore, vínculo da área e ponto de repouso. Preserva demais registros e não reexecuta geradores M01/arte. A origem usa tiles B existentes e piso por flags nativas; fonte visual/limites/roteiro em [chegada](../CHEGADA_RIHAD_M02_03A.md).

Teste focal: `tools/test-rihad-arrival.cjs`, Node com Playwright/Chrome disponíveis no ambiente, servidor/perfil efêmeros. Saída própria em `doc/evidencias/m02-03a/`; nenhum save pessoal. Não constitui teste de autoria no editor.
