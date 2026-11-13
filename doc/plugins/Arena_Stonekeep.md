# Arena_Stonekeep0.1.2

**Integração de campanha.** Arena_StonekeepWhole resolve a área lógica de Stonekeep para Map015 em partidas normais e no laboratório da base integral. O Map012 continua como origem de reconstrução e dos laboratórios antigos. Viagem, saída e fonte consultam o contexto ativo. Ao retomar uma partida normal dentro de Map012, a posição é traduzida em X+24 ou volta à entrada se estiver bloqueada no mapa integral. [Matriz, roteiro e compatibilidade](../STONEKEEP_M02_04.md#stonekeep-na-campanha--integração-de-10112026).

Adaptador M02-04 após Arena_Court, Arena_Rihad, Arena_Dungeon, Arena_CampaignConfig e Arena_Persistence/Quests. Sem dependências externas/parâmetros de Plugin Manager. [Fontes, recorte, limitações e roteiro](../STONEKEEP_M02_04.md).

**Revisão HTTP de conteúdo:** em HTTP/HTTPS, a entrada nativa de Items recebe `?arena-data=stonekeep-parchment-v1` para não reutilizar o banco M01 ainda fresco no cache. Não modifica payload, saves, namespace ou path file:// do MV; não usa nonce por abertura/build. Mantém validação e erro em configuração inválida. Conferir essa revisão quando o contrato do banco mudar; [causa, headers e teste de cache/reconstrução](../STONEKEEP_M02_04.md#correção-confirmada--cache-http-de-itemsjson).

`ArenaStonekeep.json` schema1: mapId, areaId, sourceId/itemId, IDs de eventos, entry/return com IDs lógicos e coordenadas, source/exit/breach/shore/island e swimming. Fonte/etapas/recibo em ArenaCampaign.json, item importante em Items7. Valida vínculos no boot; registro de natação não entra no save. Após29e38db, cada falha informa a condição exata e os valores observados (área/mapa, fonte/item, existência/classificação, disponibilidade/diagnostics do registro), preservando a interrupção. Sem defaults ou mensagem no fluxo válido. [Investigação e regressão de abertura real](../STONEKEEP_M02_04.md#investigação-de-inicialização-após29e38db--01112026).

V01 visual acrescenta `visualSample:{version,entry,bounds}` à configuração, sem mudar schema de saves. Sua revisão HTTP estável é `ArenaStonekeep.json?arena-data=walls-v01`; file:// permanece sem query. `previewMaterials()` reutiliza o preparo de `preview()` e aguarda a chegada assíncrona do laboratório antes da transferência técnica. Título **Stonekeep · materiais (RAM)**; saves normais continuam bloqueados e não há alteração da viagem da campanha. Cabeçalho distingue o trecho V01 do restante provisório. Folha C/tileset5 e reconstrução documentados no [registro de arte](../arte/STONEKEEP_REFERENCIAS_M02_04.md#reuso-substituição-e-primeiro-conjunto).

- `known()`: MQ02≥40; conhecimento deriva da etapa persistida. `ArenaCourt.destination()` passa a refletir a viagem existente; sem duplicar flag.
- `offer(interpreter)` / `travel(interpreter)`: evento3 da estrada, campanha válida, mapa/proximidade, fora de batalha/transferência/mensagem, destino conhecido; escolha explícita0. Cancelamento não viaja. Reusa janela nativa e proteção de soltura já existente.
- `leave(interpreter)`: somente o evento de saída do mapa ativo de Stonekeep. Retorno permitido sem item, sem prêmio/cura ou `onExit` de respawn.
- `collect(interpreter)`: somente fonte real. `sourceStatus/claimSource` autoritativos; snapshot de estado/inventário para rollback se falhar o avanço40→50. Fonte recuperável em50; nenhuma entrega automática ou recibo inventado. Repetir com posse não aumenta grants.
- `preview()`: fixture RAM explicitamente selecionada no título; reutiliza preparo de audiência e marca aceite só nessa sessão. Gravação normal bloqueada, checkpoint RAM existente reutilizado.

Mapa usa source event sem imagem, prioridade0, interação ao ocupar o marcador; label de UI identificado provisório. Não é sprite final ou inimigo oculto. Textos e cabeçalho não representam sistema narrativo novo. Atualização da indicação da estrada e fonte lê estado real; não conserva posse em flags de apresentação.

Contrato compartilhado acrescentado em Arena_Dungeon: `registerSwimming(mapId,config)` para um consumidor existente, e `swimmingConfiguration()` por mapa. Map008 conserva autoridade de ArenaDungeon.json; outros mapas não registrados não recebem natação. Métodos antigos de portas/tesouros permanecem exclusivos de Map008. Passabilidade/veículos usam o motor; profundidade, ondulação e offset reusados. Sem recurso ou atributo novo.

Gerador `build-stonekeep-sample.cjs`, também chamado pelo pai Rihad, lê o recorte autoral versionado e atualiza Map012/MapInfos, vínculos mínimos e item7. Nenhum dado de personagem é gerado. [Teste focal](../evidencias/m02-04/resultado.json); namespace de saves e motor intactos. Arte de guardiões/objeto e autoria MV continuam pendentes.

Ao criar a apresentação de Map012, um Game_Map salvo com tileset4 é sincronizado ao5 da V01 antes de carregar bitmaps. Não reposiciona/recria eventos nem altera inventário/quest/recursos; só a revisão visual conhecida4→5. Caso sintético serializado em RAM coberto no teste focal.

Aplicação de materiais R02 mantém a API/viagem e o esquema; `visualSample.bounds` acompanha o mesmo recorte físico já construído, sem ampliar geometria. A atribuição do gerador usa STONEKEEP_MATERIAIS_M02.json, com famílias confirmadas e provisórios explícitos; folha C/mestres não mudam.

Pilotos CASK/CASL: `wallSamples:[{id,entry,bounds}]` vem da configuração versionada STONEKEEP_KL_PILOTO.json; `previewWall(id)` aceita somente a entrada cadastrada e reutiliza o preparo RAM existente. `materialsPending` guarda o destino escolhido e é consumido uma vez após a chegada técnica. Duas opções no título, sem mudar viagem normal, consumo, estado de quest ou formato do save. Revisão HTTP de configuração walls-v01 evita configuração anterior sem os acessos; file:// continua intacto. Sheet D e flags pertencem só ao tileset5 de Stonekeep.

Ampliação CASK/CASL aprovada90ad460: sem mudança no plugin de execução ou nos acessos. O gerador aplica todas as células K/L regulares dentro de applicationBounds; células k (painel CASK#2) ficam provisórias. Mesmos bitmaps, flags, eventos, contrato de fonte e namespace; configuração não amplia geometria.

## Configuração por sessão — base integral M02-04C2.0

`ArenaStonekeep.configuration()` retorna o contrato original por padrão. O novo adaptador `Arena_StonekeepWhole`, após RuntimeProof/Encounters/DebugHub, fornece `ArenaStonekeepWhole.json.context` somente em laboratório explicitamente ativo. Map015 reutiliza os métodos existentes leave/collect/travel e registerSwimming; header usa caption/coverage opcionais do contrato. Sem mudança de fonte, consumo, etapas ou fórmula. [Entrega e limites](../STONEKEEP_M02_04.md#m02-04c20--base-integral-funcional-isolada-02112026).

O adaptador seleciona forMap15/encounters(stonekeep) somente nessa sessão/mapa; mantém a mesma área lógica e IDs persistentes. Não altera o registro original nem acrescenta área/fonte/recibo paralelos. Na saída real chama o mecanismo atual; somente o rebase técnico12→15 da mesma área suprime a saída/respawn. Fora da sessão, todos os métodos voltam aos contratos originais. Nenhum hook de arquivos internos do motor.

API de consumidor único: preview(), active()/here(), transferFromSample() (laboratório no12, fora de batalha/mensagem/transferência), jump(índice) para pontos cadastrados secos/água sem ocupante normal. Registro central no hub, sem opção adicional no título. O plugin não oferece serializador/saves próprios: usa a RAM e os bloqueios existentes de ArenaContinuation. Estado de seleção está em `$gameSystem._arenaStonekeepWholeSession`, acompanha o snapshot RAM e só tem efeito com labActive. Slots pessoais/migração de campanha não habilitados. Ao sair do laboratório é descartado com a sessão sintética.

Reconstrução pelo gerador build-stonekeep-whole a partir das camadas de Map014 e interior/eventos de Map012. O gerador de amostra o chama depois de reconstruir os20 participantes, evitando perda do delta. Map015 nunca copia os eventos de carga da prova; fonte de coordenadas individual no JSON gerado.

### Delta A2-E no contrato integral

Map015:24 encontros/4 portas, configuração setorial de fonte versionada em STONEKEEP_A2_E_M02.json. O registro de portas usa ArenaDungeon.registerDoors; restauração de RAM anterior acrescenta apenas Game_Event ausentes antes de criar sprites, preservando self-switches e estados lógicos. Validação de boot conserva os20 IDs originais como prefixo, permitindo os quatro novos IDs declarados. Novos pontos de inspeção no menu existente; sem novo laboratório/título. A base8f28207 tem avaliação manual adiada, avanço autorizado, sem aprovação presumida.

## B1 e diagnóstico de portas

`stonekeep-b1.cjs` acrescenta quatro portas (349–384) e dez encontros (385–394), preservando os348eventos anteriores. Contrato em `doc/mapas/STONEKEEP_B1_M02.json`; fonte/limites em [registro principal](../STONEKEEP_M02_04.md#entrega-atual--b1-conectado-a-b2). Total68encontros/36portas. Nenhuma conexão ou altura é liberada globalmente.

`interactB1Door(id)` aceita somente as quatro portas explícitas e delega toggle nativo; feedback explica lado inválido, transição ou ocupação. `doorDiagnostic()` é leitura somente no Map015/RAM, consulta70referências compiladas e retorna MIF/MV/status da mais próxima (até4tiles Manhattan). Window_Base informativo, sem foco, só no Scene_Map técnico e oculto durante mensagens; pendência de desenvolvimento é distinguida de fechadura real. Não altera Map012, portas desconhecidas ou snapshots. Novos pontos no hub existente, sem comandos no título.

## C1 norte

`stonekeep-c1-north.cjs`, após B1, acrescenta54partes de portas (395–448) e5encontros (449–453); total73/42. LOCK1 MIF65,68 é anexada à lista explícita de Arena_StonekeepAccess, sem mudar force/ordinaryLevels/estados anteriores. `interactC1Door` e a assinatura B1 delegam a auxiliar limitado por IDs dos dois setores; preserva condições de lado, animação/ocupação e força já existente. Fonte em `doc/mapas/STONEKEEP_C1_NORTE_M02.json`; nenhum hook do motor, migração/namespace ou tabela de recompensas novo.

[Conexões e limites](../STONEKEEP_M02_04.md#entrega-atual--c1-norte-y6069): eventos restritos aY60–69, corredor já existente Y70–71 só usado na circulação, rotas de água aberta evitam volumes incertos. Pontos no hub existente; indicador de portas agora42implementadas/28pendentes, relato sem localização ainda não resolvido.

## C1 central

`stonekeep-c1-central.cjs`, após C1 norte, acrescenta somente eventos454–461 (8encontros), com IDs `stonekeep.c1c.enemy.mifXX.YY`; total81/42. Fonte/rotas em `doc/mapas/STONEKEEP_C1_CENTRAL_M02.json`, conferência reproduzível por `tools/inspect-stonekeep-c1-central.py`. Camadas, portas e configurações de campanha intactas; restauração de eventos e derrotas usa o núcleo existente. Cinco pontos no menu RAM existente; sem novo comando de título. [Cobertura/limites](../STONEKEEP_M02_04.md#entrega-atual--c1-central-y7079).

## C1 sul

`stonekeep-c1-south.cjs`, após central, acrescenta somente eventos462–467 e o visual aprovado da aranha ao Map015; total87/42, C1=19/19encontros e6/6portas, não conclusão de geometria/eventos. Fonte `doc/mapas/STONEKEEP_C1_SUL_M02.json`, inspeção `tools/inspect-stonekeep-c1-south.py`; configuração de campanha da aranha exigida explicitamente. Camadas/portas/estados anteriores preservados. Três pontos no hub RAM, sem novo comando de título. [Fonte, configuração mínima e testes](../STONEKEEP_M02_04.md#entrega-atual--c1-sul-y8089).

## C2 norte

`stonekeep-c2-north.cjs`, após C1 sul: quatro portas/36componentes468–503 e nove encontros504–512, total96/46. Fonte `doc/mapas/STONEKEEP_C2_NORTE_M02.json`, inspeção `tools/inspect-stonekeep-c2-north.py`. `interactC2Door` aceita somente os4IDs do setor e delega ao auxiliar existente; B1/C1 preservados. LOCK3 MIF39,61 anexada à lista explícita de Arena_StonekeepAccess, mesma força45×nível e self-switchesA/B; sem novo sistema. Só soleiras região4→6, demais camadas intactas. Quatro pontos no hub RAM e restauração de eventos pelo mecanismo existente; nenhum comando extra no título ou mudança de saves. [Fontes, rotas e limites](../STONEKEEP_M02_04.md#entrega-atual--c2-norte-y6069).

## C2 central Y70–74

`stonekeep-c2-central.cjs`, após C2 norte: eventos513–518, IDs `stonekeep.c2c.enemy.mifXX.YY`, total102/46. Fonte `doc/mapas/STONEKEEP_C2_CENTRAL_M02.json`, inspeção `tools/inspect-stonekeep-c2-central.py`. Sem novas portas, camadas, regras ou tabela de recompensas; composição/persistência e restauração de eventos reutilizadas. Três pontos no hub RAM existente; campanha continua Map012. [Cobertura/rotas/evidências](../STONEKEEP_M02_04.md#entrega-atual--c2-central-y7074).

## C2 central Y75–79

`stonekeep-c2-central-south.cjs`, após Y70–74, acrescenta eventos519–525/IDs `stonekeep.c2c2.enemy.mifXX.YY`, total109/46. Fonte `doc/mapas/STONEKEEP_C2_CENTRAL_SUL_M02.json`; inspeção `tools/inspect-stonekeep-c2-central-south.py`. Nenhuma nova porta, camada ou tabela de recompensa. Núcleos existentes tratam patrulha, contato e restauração RAM; quatro pontos no menu existente, sem comando adicional no título. [Fontes, acesso e limites](../STONEKEEP_M02_04.md#entrega-atual--c2-central-y7579).

## C2 sul Y80–89

`stonekeep-c2-south.cjs`, após Y75–79, acrescenta eventos526–535/IDs `stonekeep.c2s.enemy.mifXX.YY`, total119/46 e C2=32/32origens únicas. Fonte `doc/mapas/STONEKEEP_C2_SUL_M02.json`; inspeção `tools/inspect-stonekeep-c2-south.py`. Sem nova porta/camada/regra/tabela de recompensa. Núcleos existentes de patrulha/contato e restauração RAM reutilizados;4pontos no hub existente, campanha normal preservada no Map012. [Fontes, evidências e limites](../STONEKEEP_M02_04.md#entrega-atual--c2-sul-y8089).
