# M01-16 — MQ01, diário e recuperação

Base integrada `develop534ff7b`, feature `feature/m01-quests`. Numeração confirmada no backlog: M01-16 é MQ01/diário/redundância de itens importantes. A avaliação do responsável sobre combate satisfatório no estado disponível081222a foi registrada em `evidencias/m01-15/confirmacao-responsavel.json`, sem atribuir teste manual de respawn, persistência, ambiente ou dispositivos. M01-15 fechado tecnicamente pelo commit7b14719, integrado/publicado em develop534ff7b; critérios sustentados pelas evidências técnicas já identificadas. Autorias novas no editor e mobile não foram presumidas.

As cinco melhorias solicitadas foram consolidadas em `REFINAMENTOS_POS_INTEGRACAO_M01.md`: REF01 une favoritos e revisão de atalhos de itens/habilidades, REF02 caminhada no mapa, REF03 fundo genérico, REF04 balanceamento integrado e REF05 pesquisa de drops. Não foram implementadas aqui. O sistema de atalhos já possui referências item/skill e deve ser auditado naquele item, sem tarefas duplicadas. Valores atuais continuam provisórios.

## Fontes, confirmação e adaptação

Relida a fonte local `doc/wiki/Arena_Imperial Dungeons (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, sobretudo p.3: chave na parede norte, porta da cela, tesouro depois da saída, caminho oeste/sul e Gate. Fonte e transcrição traduzida são UESP/colaboradores, CC BY-SA2.5 conforme o PDF; não é tradução oficial. O diário usa os textos **J10–J40 já aprovados em MQ01_ESPECIFICACAO.md**, sem inventar fala nova de Ria. Divisão em etapas/objetivos e escrita em primeira pessoa são adaptação de interface. Organização moderna do diário não torna Skyrim fonte das regras de Arena.

O hash do START.MIF original foi relido e coincide com a consulta M01-14 (`16b4b200c0845c6aeab9af22cdf7b7655422dcaad73b5a639c1be0308389c7ee`). Usados os vínculos de posição MIF/INF já consolidados no M01-14, sem redistribuir arquivos originais ou fazer nova extração. START.INF local não foi tratado como texto legível nem como verificação dos diálogos. Não houve observação nova de quest no executável DOS. A divergência entre coordenadas textuais da wiki e grade original continua explicitada em MQ01_ESPECIFICACAO.md/DUNGEON_M01_14.md; não se alterou silenciosamente o layout.

Consumo irreversível da chave pela porta e porta permanentemente aberta são adaptações confirmadas na especificação. No original o Gate leva a uma cidade; M01-18 apresentará o encerramento da demo antes dessa viagem. Nesta feature **não há introdução, cenas/falas de Ria, F01, cidade, pergunta de proteção de cópia ou nova quest**. Não gerar arte/vozes.

## Fluxo e estado

| Etapa | Diário/objetivo atual | Saída e entrada da próxima |
|---|---|---|
|0|Não iniciada; sem descrição futura|`begin()` inicia10; nenhum item concedido|
|10|J10: obter a chave|Posse de1 chave para concluir10 e iniciar20|
|20|J20: abrir a cela|Posse de1 na saída; consumo registrado e verificado novamente na entrada30|
|30|J30: alcançar o Gate|Recibo legítimo de uso obrigatório na saída30 e entrada40|
|40|J40: objetivo concluído|Quest/área concluídas uma vez; apresentação final fica M01-18|

Autoridade em `ArenaPersistence.quests.MQ01`: stage, objectives(rubyKey/cellDoor/shiftGate), completed, receipts. Fonte `MQ01.ruby-key`, item1, recibo de uso `MQ01.cell-door`. Recursos/EXP/inventário continuam nativos/existentes; não se espelham em variáveis/switches globais. Objetivos já cumpridos não são apagados se a chave se perder em20; a próxima ação fica bloqueada até recuperar. Não há abandono/reinício/falha inventados.

As transições verificam requisitos de saída contra o estado anterior e de entrada contra o estado posterior, incluindo nova consulta depois de atualizar a etapa. Operação síncrona com snapshot/rollback de contrato persistente, inventário de itens, self-switches e transição da porta. Exceção, falta de item/recibo ou capacidade inválida não deixam progresso parcial. Concessão/consumo usam as APIs M01-05, sem segundo ledger de itens. Recibos legítimos de consumo/entrega são distinguidos de perda; a UI de MQ01 oferece apenas o consumo previsto, não inventa entrega alternativa.

Enquanto necessário e ausente, a fonte volta a ficar visível/interagível, mas **não entrega automaticamente na verificação ou ao carregar**. Interagir concede somente a falta até1. Repetir/carregar não repete concessões ou recompensas; após uso legítimo, ausência é esperada e não reativa a fonte, inclusive quando falta o registro opcional `sources` mas o recibo permanece. Duplicatas são saneadas exclusivamente no item1: até1 antes de usar, zero após recibo/etapa30. Itens de outras quests/comuns não são removidos. Proteção contra descarte/venda já existente permanece.

## Eventos e tesouros

Map008 conserva235 eventos/IDs, todas as camadas e geometria. Evento127 recebe ação real de chave e segunda página com self-switchA **derivado** da disponibilidade; esse switch não é autoridade de posse/uso. Enter funciona sobre a fonte ou da casa imediatamente à frente; o hook pontual preserva as demais interações nativas. Porta door.07/IDs55–63 revalida a chave e registra o consumo antes de abrir; outras13 portas inalteradas. A cela não volta a fechar após uso válido. Evento137 mantém contato nativo no Gate e chama a conclusão lógica, sem F01. Compilação: build-dungeon-map.py → build-encounters.cjs → build-quests.cjs, para não perder a integração ao recompilar.

As15 fontes opcionais de tesouro existentes passam a conceder uma vez após a cela aberta. `ArenaLoot.claimContainer(id,table)` acrescenta apenas uma entrada pública ao mesmo sorteador/settlement/reserva atômica M01-13, sem alterar pagamento de batalha ou tabelas de inimigos. Recibos `arenaLoot.receipts[container/MQ01.treasure.EVENTID]`; zero EXP de quest/contêiner, limite de1 equipamento por origem, raridade substitutiva, capacidade excedente reservada. O estado visual coletado é reconstruído do recibo. Resumo nativo de mensagem com nomes/quantidades e sem confirmação individual de coleta; o resumo de batalha aprovado permanece intacto.

**Configuração provisória de tesouros**: reutiliza integralmente a tabela de baixa dificuldade já cadastrada para inimigo2, por referência `treasureTableEnemyId:2`; não se alteraram probabilidades/valores/drops dos inimigos. É proxy técnico de recompensa, **não taxa confirmada de tesouros do original**; pode resultar em fonte vazia. As categorias documentais de ouro/equipamentos não confirmam percentuais. Pesquisa de drops REF05 e balanceamento final REF04 permanecem futuros; calibrar também este proxy na integração final, sem apresentá-lo como reconstrução das distribuições originais.

## Conclusão e respawn

Gate fora de ordem/sem recibo não completa. Ao chegar validamente em30, MQ01 passa a40 e chama a conclusão de área existente, sem conceder recompensa adicional nem reativar inimigos naquele momento. Só uma transferência real de saída após conclusão reativa comuns; específicos de quest excluídos pelo M01-15. Repetir o contato, carregar ou reentrar não reinicia a quest/recibos. A saída ao laboratório é ferramenta técnica, não retorno narrativo à prisão depois da fuga. Recuperação da chave antes do uso é independente de respawn.

## Inicialização e saves anteriores

Nova partida mantém MQ01 em0 até entrar na dungeon. Até M01-18 integrar Ria, a entrada de exploração é o **bootstrap técnico** que chama begin e coloca o personagem na cela; o texto J10 não comprova que o sonho já foi exibido. Criação normal e laboratórios continuam separados. Entrada do título Explorar dungeon mantém o piloto anterior; entrada pelo laboratório preserva o personagem criado. Encontros técnicos com `_arenaEncounterTechnical` permanecem isolados e não iniciam MQ01 automaticamente.

Primeira abertura de um save antigo de exploração no Map008, etapa0 e sem marca de laboratório de encontros: inicia10 e retorna ao checkpoint da cela, fechando somente sua porta. **Posição do jogador é adaptada nesse caso**, para evitar prender uma fonte atrás de porta aberta sem prova de uso. Preserva nome/raça/gênero, HP/Mana/Vigor, equipamento, inventário, níveis, loot e inimigos. Migração validada com save real da composição M01-15 fora da cela,47HP/3poções. Não simula consumo nem conclui objetivos antigos. Saves ativos10–40 não sofrem esse retorno; fonte/porta/tesouros visuais são reconstruídos das autoridades persistentes. Campos ausentes continuam usando defaults M01-05; nenhuma migração concede recompensas.

Estados de laboratório com etapa desconhecida recebem diagnóstico no diário, sem crash, concessão ou transição presumida. Etapa30+ sem recibo legítimo é inconsistente: Gate bloqueado e diário informa registro ausente; não se fabrica um recibo nem se reabre silenciosamente um objetivo concluído. Essa corrupção manual não é uma migração automática suportada; preservar save para diagnóstico. Os caminhos normais não salvam entre metades da transação síncrona.

## Testar manualmente

1. Título **Explorar dungeon**, ou personagem criado → laboratório → Explorar dungeon. Abra o menu **Diário**: etapa da chave. Para o fluxo novo, não usar a entrada Encontros técnicos, intencionalmente isolada.
2. Na cela, procurar a chave na posição(142,64); do tile(142,65), olhar para norte e pressionar Enter. Conferir uma chave, fonte oculta e diário da porta. Tentar a porta sem chave antes disso deve recusar.
3. Interagir com a porta em torno de(139,73): chave consumida uma vez, porta permanentemente aberta, objetivo Gate. Salvar/carregar e conferir ausência legítima da chave e diário preservado. Não há comando normal de descartar o item importante.
4. Explorar e interagir com tesouros opcionais; conferir inventário e ausência de nova recompensa ao repetir. Seguir até o contato do Gate(13,145): objetivo concluído uma vez e registro no diário; apresentação final ainda M01-18.
5. Recuperação de item perdido é exercitada por teste técnico isolado, não removendo saves pessoais. `tools/test-quests.cjs` simula a perda antes do uso, salva/carrega, reativa a fonte e recupera somente1; também simula perda de recibo entre verificações e falhas de concessão.

## Validação e pendências

Resultados/capturas/vídeo em `evidencias/m01-16`; hashes e composição em fontes-testadas.json. Fluxos nativos de evento/menu/teclado, saída de mapa, concessão de fonte/tesouro e saves18/19 em contexto Chrome descartável. Locate prepara posições de teste; não alegar caminhada integral da dungeon no vídeo. RNG forçado apenas no teste de tesouro e falhas somente em memória. Regressões em subpasta própria, preservando evidências M01-15.

Diário e mudanças de fonte/porta inspecionados em816×624. Funcionamento técnico separado de equilíbrio e aprovação estética. **M01-16 implementado para revisão, sem merge**, sem iniciar M01-17/18. Compatibilidade estrutural/codificação dos27 plugins e eventos nativos verificadas; nova sessão de autoria dos plugins/eventos no editor e validação manual de quests pelo responsável ainda pendentes, sem atribuí-las à aprovação do combate. Galaxy A56 físico segue integração mobile M01-19. Arte, animações, fundos, atalhos, bônus e custo de Vigor aquático preservados.

Execuções finais:23 cenários MQ01; regressões encontros14,loot11,persistência27,criação234; núcleos puros e validadores passaram. Pipeline completo estável reproduziu6arquivos byte a byte após normalização de finais de linha. Uma fixture de nova partida em mapa vivo foi corrigida para retornar ao título antes de reinicializar, sem alterar o motor; execução final passou. Capturas de diário/fonte/tesouro inspecionadas no tamanho real, sem inferir aprovação do responsável.

## Apresentação superada pela R02 (28/10/2026)

O painel textual único foi substituído por lista/filtros, descrição narrativa, passos e status real em plugin de apresentação separado; lógica de MQ01 permanece idêntica. Fontes, reestruturação J10–J40, navegação/responsividade e evidências em REVISAO_DIARIO_M01_16_R02.md. Leitura não concede ou consome itens e não avança etapas.

## Fechamento M01-16 — 28/10/2026

Responsável aprovou o **design visual** do sistema de quests; estado disponível086264e, sem hash próprio ou dispositivo informados. Evidência em evidencias/m01-16-r02/aprovacao-responsavel.json. Não atribuir a essa avaliação testes de lógica, persistência, respawn, autoria no editor ou mobile. Critérios funcionais revisados separadamente:23 cenários MQ01,5 grupos de diário e regressões identificados nas evidências R01/R02; validate-journal.cjs reexecutado neste fechamento passou. M01-16 concluído tecnicamente, autorizado para integração em develop. Nova autoria da UI no MV e Galaxy A56 físico permanecem verificações de integração, sem alegar execução. REF06 registra notificações futuras, sem implementação; REF01 permanece único para favoritos/atalhos. M01-17 corresponde a poções e descanso, sem renumeração. Estados anteriores abaixo são históricos quando divergirem.
