# Arena_Stonekeep0.1.1

Adaptador M02-04 após Arena_Court, Arena_Rihad, Arena_Dungeon, Arena_CampaignConfig e Arena_Persistence/Quests. Sem dependências externas/parâmetros de Plugin Manager. [Fontes, recorte, limitações e roteiro](../STONEKEEP_M02_04.md).

**Revisão HTTP de conteúdo:** em HTTP/HTTPS, a entrada nativa de Items recebe `?arena-data=stonekeep-parchment-v1` para não reutilizar o banco M01 ainda fresco no cache. Não modifica payload, saves, namespace ou path file:// do MV; não usa nonce por abertura/build. Mantém validação e erro em configuração inválida. Conferir essa revisão quando o contrato do banco mudar; [causa, headers e teste de cache/reconstrução](../STONEKEEP_M02_04.md#correção-confirmada--cache-http-de-itemsjson).

`ArenaStonekeep.json` schema1: mapId, areaId, sourceId/itemId, IDs de eventos, entry/return com IDs lógicos e coordenadas, source/exit/breach/shore/island e swimming. Fonte/etapas/recibo em ArenaCampaign.json, item importante em Items7. Valida vínculos no boot; registro de natação não entra no save. Após29e38db, cada falha informa a condição exata e os valores observados (área/mapa, fonte/item, existência/classificação, disponibilidade/diagnostics do registro), preservando a interrupção. Sem defaults ou mensagem no fluxo válido. [Investigação e regressão de abertura real](../STONEKEEP_M02_04.md#investigação-de-inicialização-após29e38db--01112026).

V01 visual acrescenta `visualSample:{version,entry,bounds}` à configuração, sem mudar schema de saves. Sua revisão HTTP estável é `ArenaStonekeep.json?arena-data=visual-v01`; file:// permanece sem query. `previewMaterials()` reutiliza o preparo de `preview()` e aguarda a chegada assíncrona do laboratório antes da transferência técnica. Título **Stonekeep · materiais (RAM)**; saves normais continuam bloqueados e não há alteração da viagem da campanha. Cabeçalho distingue o trecho V01 do restante provisório. Folha C/tileset5 e reconstrução documentados no [registro de arte](../arte/STONEKEEP_REFERENCIAS_M02_04.md#reuso-substituição-e-primeiro-conjunto).

- `known()`: MQ02≥40; conhecimento deriva da etapa persistida. `ArenaCourt.destination()` passa a refletir a viagem existente; sem duplicar flag.
- `offer(interpreter)` / `travel(interpreter)`: evento3 da estrada, campanha válida, mapa/proximidade, fora de batalha/transferência/mensagem, destino conhecido; escolha explícita0. Cancelamento não viaja. Reusa janela nativa e proteção de soltura já existente.
- `leave(interpreter)`: somente evento de saída de Map012. Retorno permitido sem item, sem prêmio/cura ou `onExit` de respawn.
- `collect(interpreter)`: somente fonte real. `sourceStatus/claimSource` autoritativos; snapshot de estado/inventário para rollback se falhar o avanço40→50. Fonte recuperável em50; nenhuma entrega automática ou recibo inventado. Repetir com posse não aumenta grants.
- `preview()`: fixture RAM explicitamente selecionada no título; reutiliza preparo de audiência e marca aceite só nessa sessão. Gravação normal bloqueada, checkpoint RAM existente reutilizado.

Mapa usa source event sem imagem, prioridade0, interação ao ocupar o marcador; label de UI identificado provisório. Não é sprite final ou inimigo oculto. Textos e cabeçalho não representam sistema narrativo novo. Atualização da indicação da estrada e fonte lê estado real; não conserva posse em flags de apresentação.

Contrato compartilhado acrescentado em Arena_Dungeon: `registerSwimming(mapId,config)` para um consumidor existente, e `swimmingConfiguration()` por mapa. Map008 conserva autoridade de ArenaDungeon.json; outros mapas não registrados não recebem natação. Métodos antigos de portas/tesouros permanecem exclusivos de Map008. Passabilidade/veículos usam o motor; profundidade, ondulação e offset reusados. Sem recurso ou atributo novo.

Gerador `build-stonekeep-sample.cjs`, também chamado pelo pai Rihad, lê o recorte autoral versionado e atualiza Map012/MapInfos, vínculos mínimos e item7. Nenhum dado de personagem é gerado. [Teste focal](../evidencias/m02-04/resultado.json); namespace de saves e motor intactos. Arte de guardiões/objeto e autoria MV continuam pendentes.

Ao criar a apresentação de Map012, um Game_Map salvo com tileset4 é sincronizado ao5 da V01 antes de carregar bitmaps. Não reposiciona/recria eventos nem altera inventário/quest/recursos; só a revisão visual conhecida4→5. Caso sintético serializado em RAM coberto no teste focal.
