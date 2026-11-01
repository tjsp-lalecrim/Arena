# M02-05 — entrega do pergaminho na corte

Feature `feature/m02-entrega-pergaminho`, sobre **18473c2**, preservando as dependências M02 não integradas e a tag m01. Recorte funcional entregue **para avaliação**; não conclui todo o M02-05 nem habilita Fang Lair.

**Relato do responsável:** a coleta do pergaminho foi testada e funcionou. Associação à referência disponível18473c2; o relato não informou ambiente, hash ou outros casos. Não atribuir a ele persistência, recuperação, equilíbrio ou aprovação desta entrega ainda nova. Aprovações anteriores dos exemplares/arte permanecem com suas coberturas.

## Conteúdo e fontes

Consulta somente leitura de `ARENA/TEMPLATE.DAT` instalado: **#1319**, bytes264839 até o início de#1320 (fim exclusivo registrado em [fontes.json](evidencias/m02-05-entrega/fontes.json)); retorno com o pergaminho e cumprimento do acordo. #1320 orienta nova tentativa sem o item. Wiki local **Arena_Fang Lair (quest)…pdf**, **p.3, Quid Pro Quo, Pt.2**, confirma retorno à rainha e localização de Fang Lair em Hammerfell. Não houve novo teste DOS ou pesquisa extensa.

Tradução/condensação em `ArenaCourt.json.delivery`: Blubamka reconhece o pergaminho, manifesta a esperança original sobre Golthog (não comprova morte ou cria chefe), chama um cortesão com uma pena e revela a localização. **Adaptação:** tornar destino conhecido/registrado no diário substitui marcar o mapa mundial. Não há prêmio adicional implementado, viagem, fragmento ou conclusão de Fang Lair. O aviso de limite é informação da versão de teste, não fala canônica.

Apresentação existente, mensagens/escolhas nativas, quebra de texto pela largura e proteção de soltura do comando. NPC/interior continuam provisórios. Ilustrações por blocos significativos da audiência continuam na REF07; sem imagem nova ou redesign nesta entrega.

## Contrato e comportamento

- Até etapa40, preservadas as conversas/orientação e aceitação originais. Entrega exige **MQ02=50**, intérprete/evento2 da corte/Map011, proximidade, campanha fora de batalha/transferência e posse de uma unidade do item importante7.
- Sem item: orientação para recuperar na ilha, sem avançar ou aposentar fonte. Recuperação nas etapas40/50 permanece pelo núcleo existente.
- **Entregar o pergaminho / Agora não**: padrão e Escape recusam; só confirmação explícita executa. Revalidar posse/etapa na execução. Cancelar não altera inventário, fonte, recibo ou diário.
- Consumo nativo de uma unidade, recibo **MQ02.rihad.parchment**, aposentadoria de **stonekeep.parchment** e avanço **50→60** com `parchmentDelivered`/`fangLairKnown` ocorrem no mesmo bloco síncrono protegido. Reutiliza `consumeImportant`/`setQuest`; em exceção restaura estado persistente e pilha do item, como a coleta de Stonekeep. Nenhuma migração/schema/namespace novo.
- Repetição em60+ apenas relembra a localização. Recibo íntegro continua autoritativo mesmo se o registro auxiliar da fonte faltar. Ausência legítima do pergaminho após entregar não reabre a fonte; estado60 sem recibo informa inconsistência sem inventar entrega ou remover itens.
- `ArenaCourtDelivery.destination()` identifica **fang.entry**, conhecida somente com etapa60+ e recibo correspondente; **available=false**, área superior ainda `mapId=null`. Não existe ação de transferência para esse destino nesta entrega.
- Diário registra entrega concluída e próximo objetivo, preservando MQ02 pendente. Sem cura/EXP/ouro/loot, alteração de equipamentos/pontos/recursos ou respawn. Não altera condições ou encontros de Stonekeep.

## Avaliação curta pelo hub

[http://127.0.0.1:8774/](http://127.0.0.1:8774/) → **Testes / Debug → Campanha e mapas → Rihad · entregar pergaminho (RAM)**. Nova opção centralizada, sem acesso técnico novo no título. Prepara missão50 e uma unidade legítima da fonte na fixture; começa dentro da corte, em(8,10). Nenhuma partida pessoal carregada; slots normais bloqueados. **Guardar teste em RAM / Carregar teste da RAM** mantêm checkpoint apenas durante a sessão.

1. Caminhar quatro tiles ao norte, até(8,6), e falar com Blubamka.
2. Se desejar, escolher **Agora não**: item/objetivo permanecem. Falar outra vez e escolher **Entregar o pergaminho**.
3. Conferir item ausente no Inventário e, no **Diário → Fang Lair**, entrega concluída e destino conhecido ainda indisponível.
4. Conversar novamente: lembrete, sem novo consumo, prêmio ou avanço. O laboratório reinicia ao entrar novamente pelo hub.

Na campanha, basta retornar da ilha à estrada de Rihad e à corte com o pergaminho, sem preparar fixture. Não exige eliminar guardiões.

## Verificação focal executada

`node tools/test-court-delivery.cjs`, Chrome156 isolado/origem efêmera, canvas816×624: **seis grupos**. Abertura real sem registro pré-carregado; hub→corte e aproximação; falta do item/recuperação; cancelamento com entregar destacado; perda do item entre seleção e execução; falha sintética no avanço comprovando rollback de item/recibo/fonte; RAM e Save16/F5/Load sintéticos antes/depois; entrega nativa e repetição; diário/destino conhecido sem mapa; fonte inativa por recibo mesmo em fixture parcial com etapa50 e sem registro auxiliar, além do retorno normal ao evento do pergaminho após entregar. Personagem, recursos deliberadamente reduzidos na fixture (sem cura na entrega), pontos, equipamentos, MQ01, Ria, recibos de loot, inimigos e áreas preservados. Sem erros JS/HTTP faltante.

Reconstrução pelo pai Rihad preservou mapas, encontros, item7, configuração e textos da entrega/diário. Registro canônico `js/plugins.js` conferido: somente o plugin próprio acrescentado depois do hub, dependências anteriores intactas. [Resultado](evidencias/m02-05-entrega/resultado.json), [confirmação](evidencias/m02-05-entrega/confirmacao.png), [diário](evidencias/m02-05-entrega/diario.png). Sem repetição da campanha, matriz de combate ou avaliação artística; nenhum novo teste no editor/mobile declarado.

## Pendências funcionais e continuidade

A rota construída já permite viagem, água, coleta e retorno, com sete esqueletos e seis ghouls, sem kill-all. A coleta tem confirmação manual; a entrega atual aguarda avaliação. **Ratos/lobos dos aposentos ainda não estão representados:** delimitar necessidade na rota mínima de M02-05 conforme fontes, sem declarar cobertura completa ou exigir catálogo de alas opcionais. Não há defeito técnico aberto de travessia identificado neste recorte. Balanceamento acumulado pertence ao M02-BAL.

Após avaliação e delimitação funcional de M02-05, próximo conteúdo **M02-06A — amostra das celas de Fang Lair**, com rota/arquitetura/participantes próprios antes de habilitar viagem. Ilustrações da corte, decoração, portas elaboradas e aparência final do pergaminho permanecem futuras, sem virar bloqueios automaticamente. Retaliação de Tharn permanece exclusivamente M02-08, com orientação registrada no backlog.
