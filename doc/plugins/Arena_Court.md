# Arena_Court v0.1.0

Adaptador mínimo M02-03D, sem dependência externa. Após Arena_RiaVision, Arena_Rihad, Arena_Persistence/Arena_Quests, Arena_CampaignConfig e MV_JournalModel; utiliza intérprete, mensagens, escolhas e transferências nativos MV1.6.1. Não clona núcleos nem altera arquivos do motor. [Conteúdo, fontes e roteiro](../CORTE_RIHAD_M02_03D.md).

**Extensão vigente M02-05:** [Arena_CourtDelivery](Arena_CourtDelivery.md) reutiliza `show(interpreter,texts)` e intercepta somente50+, sem alterar aceitação anterior. Dados/recibo e destino conhecido em [entrega](../ENTREGA_PERGAMINHO_M02_05.md). As indisponibilidades da implementação03D abaixo são históricas.

## Configuração e APIs

Sem parâmetros Plugin Manager nesta versão. `data/ArenaCourt.json` schema1 contém os grupos textuais notReady/offer/accepted/decline/pending/future. `ArenaRihad.json.court` define área, mapas, eventos, coordenadas/direções e destinationId. `ArenaCampaign.json` registra `rihad.court`/Map011/MQ02; Stonekeep permanece mapId=null. Os grupos/área são validados após carregar a base; configuração inválida é erro explícito, sem fallback silencioso.

- `enter(interpreter)` / `leave(interpreter)`: validam campanha, MQ02≥10, mapa/evento/distância, ausência de batalha/transferência/mensagem; transferem sem efeitos de recursos.
- `talk(interpreter)`: valida a interação com a rainha. Antes30 orienta; em30 oferece; depois40 lembra o pedido. Textos são quebrados pela largura real da janela, até quatro linhas por mensagem.
- `accept(interpreter)`: apenas ramo explícito0 e etapa exata30; `ArenaPersistence.setQuest('MQ02',40,objectives,false)` acrescenta parchmentRequest. Nova chamada falha sem efeitos. Não concede recompensas, manipula fontes ou conclui a missão.
- `destination()`: `{id:'stonekeep.entry',known:stage>=40,available:false,reason:'destination_not_implemented'}`. Projeção somente leitura da etapa existente, não novo estado persistente nem viagem.
- `preview()`: prepara somente a sessão RAM do título, reaproveitando ArenaRiaVision.preview; leitura completa/orientação são fixtures explícitas. Bloqueios de save/retorno e checkpoint RAM permanecem nos núcleos existentes.

## Entrada, persistência e reconstrução

Escolha nativa mantém-se ativa durante a proteção de soltura; seu update de entrada é temporariamente suspenso, sem desativar a subjanela (isso faria Window_Message reiniciar o texto). Defaults de escolha/escape são recusa. Proteções de movimento/mensagem usam Game_Temp, não campos salvos ou cooldown de jogo.

Nenhum novo namespace/schema de partida: etapa/objetivo MQ02 e mapa/eventos são salvos pelos contratos existentes; destino conhecido deriva deles. Saves antigos de Map009 recebem apenas eventos5/6 ausentes, antes de criar sprites. Namespace web, migrações e dados de MQ01 permanecem inalterados.

`tools/build-rihad-court.cjs`, também chamado ao final de `build-rihad-arrival.cjs`, produz Map011, acesso/porta visual de Map009, MapInfos e vínculos mínimos. Não gera arte; materiais e NPC são provisórios. [14 grupos focais](../evidencias/m02-03d/resultado.json); autoria MV e avaliação do responsável continuam separadas.
