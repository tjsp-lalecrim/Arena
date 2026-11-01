# Configuração por quest/área — 0.1.0

## Componentes

`MV_CampaignConfig.js`: registro puro, sem dependências ou IDs de Arena. `MVCampaignConfig.create(base,extension)` cria índices imutáveis por quests/areas/sources/receipts e mapa; valida referências e colisões, aplicando a extensão atomicamente. Extensão inválida gera `diagnostics` e mantém a base. Consultas `lookup(kind,id)` e `forMap(mapId)` retornam `{ok:true,config}` ou `{ok:false,code,id}`. Não salva/configura “quest ativa”, não altera inventário ou regras de progressão.

`Arena_CampaignConfig.js`: adaptador, após os plugins existentes e MV_CampaignConfig (40 registros). Aguarda o banco, compõe MQ01 a partir de ArenaQuests.json, ArenaEncounters.json e `ArenaPersistence.sourceDefinitions()`; acrescenta ArenaCampaign.json. Sem parâmetros/dependência externa. Contratos novos não substituem a definição MQ01.

Arquivo `data/ArenaCampaign.json`, schemaVersion1: arrays `quests`, `areas`, `sources`, `receipts`. Mapa/item null significa **não vinculado**, não um ID de teste. O arquivo é recurso obrigatório do runtime, como os outros JSONs; tratamento recuperável aqui cobre registros ausentes/desconhecidos/extensão inválida, não promete continuar um pacote com arquivos HTTP faltando. Configuração vazia válida pode omitir MQ02; MQ01 segue intacta.

## Contratos e validação

- Quest: `id`, `stages` com `id`/`next`, referências válidas e sem duplicação. O consumidor futuro continua responsável por condições narrativas/itens, usando MV_QuestRules; ter um grafo não conclui a quest.
- Área: `id`, `questId`, `mapId` null ou positivo único; `encounters` opcional, compatível com o formato atual e com IDs da área/quest/mapa. Sem perfil vinculado, consulta de encontros retorna `unbound_encounters`. Instâncias de inimigos não podem repetir IDs entre áreas.
- Fonte: `id` globalmente único, `questId`, `areaId`, `itemId` null ou positivo, `itemKey` lógico opcional, `quantity`, `stages`. `receiptIds` limita recibos da nova fonte; `requiredAfterCompletion:true` preserva obrigação explícita do fragmento, sem ignorar entrega/consumo ou fonte aposentada.
- Recibo: `id` único, `questId`, `sourceId`, `kind` deliver/consume. Fonte e recibo não podem compartilhar ID; cada referência precisa pertencer à mesma quest/fonte. Rejeitar a extensão antes de introduzir uma colisão. Não reaproveitar IDs legados: itens de missão numericamente vinculados não podem pertencer a fontes distintas, inclusive de outra quest.

O registro é reconstruído do banco no boot; não entra no save. A persistência guarda somente estado/IDs já existentes em `arena`, sem novo namespace ou migração de valores. MQ02 não recebe estado salvo por simples consulta.

## APIs e compatibilidade

| API | Comportamento |
| --- | --- |
| `ArenaCampaignConfig.quest/area/source/receipt(id)` | Resolve contrato, ou código unknown_*; consultar antes de executar um evento novo |
| `forMap(mapId)` | Resolve a área do mapa, sem fallback para Imperial Dungeons |
| `encounters(areaId)` | Resolve perfil ligado; MQ01 conserva o objeto original do banco |
| `ready()/diagnostics()` | Disponibilidade e problemas da extensão, sem alterar partida |
| `ArenaQuests.configuration(id)` | Configuração explícita. Sem ID retorna MQ01 original |
| `ArenaQuests.snapshot(id)` | Estado por quest conhecida ou inicial não persistido; desconhecida retorna null. Sem ID mantém MQ01 e suas assinaturas atuais |
| `ArenaEncounters.configuration(areaId)` | Perfil por área; sem argumento mantém o padrão MQ01 para operações antigas |
| `ArenaEncounters.currentConfiguration()` | Perfil do mapa atual ou unknown_map; patrulha/contato usam esse contexto |
| `completeArea(areaId)/onExit(areaId)` | Operação explícita limitada à área. Unknown/unbound retorna false sem mutação; ausência de argumento mantém operação antiga MQ01 |
| `ArenaPersistence.sourceDefinitions()` | Cópia das fontes legadas para construir o registro, sem permitir modificar a autoridade |

`claimSource/consumeImportant/sourceStatus` conservam os contratos antigos MQ01, inclusive tratamento de recibos genéricos já legítimos. Fontes novas são resolvidas no registro: claim de item não vinculado retorna `unbound`, sem tocar no inventário. Consumo/entrega com recibo de outra quest/fonte/tipo retorna `incompatible-receipt`; repetição legítima retorna duplicate. Nesses métodos antigos, ID de fonte completamente desconhecido continua lançando o erro documentado anterior: um evento novo deve usar o resolvedor recuperável primeiro, sem esconder a falha ou tentar outra quest.

`ArenaEncounters` reaproveita MV_EncounterRules e seus callbacks nativos; apenas seleciona contexto e restringe operações às instâncias da área. Não cria encontros aleatórios, novas batalhas ou outra regra de respawn. Sem seleção global que redirecione takeKey/useDoor/reachGate: esses métodos permanecem MQ01. Não clona o plugin para MQ02.

## Configuração entregue / testes

MQ02 possui somente metadados: etapas0–110, áreas Rihad/arredores/Stonekeep/Fang Lair superior/inferior, fontes `stonekeep.parchment`, `fang.cell2.key`, `fang.staff-piece-1`, recibos `MQ02.rihad.parchment` e `MQ02.fang.lower-door`. Sem mapas/itens novos, texto de diário, quest iniciada ou continuação real habilitada.

[Relatório e ação→resultado](../CONFIGURACOES_M02_02B.md). Executar `node tools/test-campaign-config.cjs` com Node/Playwright/Chrome locais; usa porta e contexto efêmeros e chama a regressão MQ01 com evidências separadas. Não há avaliação manual de estruturas internas solicitada. Conteúdo Rihad e vínculos concretos são a próxima entrega, não parte desta infraestrutura.
