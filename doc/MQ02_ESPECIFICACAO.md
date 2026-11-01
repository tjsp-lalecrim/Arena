# M02-01 — estados, viagens e continuidade da MQ02

**Implementação vigente M02-04:** [amostra de Stonekeep](STONEKEEP_M02_04.md) vincula stonekeep.entry/Map012 e fonte stonekeep.parchment/item7. Recorte original adaptado, natação por região, coleta40→50, diário de retorno e recuperação enquanto necessário. Guardiões/arte específica e entrega permanecem pendentes. Entradas anteriores abaixo são históricas, inclusive a indisponibilidade de viagem na entrega03D.

**Implementação vigente01/11/2026:** [M02-03D](CORTE_RIHAD_M02_03D.md) acrescenta corte mínima Map011 e aceitação explícita30→40. Pedido/orientação no diário; stonekeep.entry conhecida, mas sem mapa/viagem. Textos primários#1315–17, reuso provisório de arte; nenhum chefe Golthog ou entrega simulados. A visão ad4af0e mantém sua aprovação; novos critérios manuais não são presumidos. Entradas seguintes são marcos de implementação históricos.

**Implementação posterior01/11/2026:** [M02-03C](VISAO_RIA_M02_03C.md) implementa repouso/Ria nível2+, fala primária #1500/#1294 completa, cursor separado e transições20/30. Uma ilustração-piloto para avaliação, demais blocos com reuso provisório; manuais adiados, sem inferir aprovação. Corte e missão continuam futuras.

**Implementação posterior01/11/2026:** [M02-03B](ARREDORES_RIHAD_M02_03B.md) disponibiliza os quatro ratos previstos, sem alterar curva/15 EXP ou iniciar Ria. IDs/rotas e recorte adaptado documentados; estágio permanece10.

**Implementação posterior01/11/2026:** [M02-03A](CHEGADA_RIHAD_M02_03A.md) vincula rihad.arrival a Map009/(10,11), chegada10, informante e repouso. Amostra autorizada, para avaliação; planta/arquitetura/NPC provisórios e próximos gatilhos ausentes, sem aprovação inferida do M02-03 completo.

**Atualização posterior01/11/2026:** M02-02B autorizado e [contratos implementados](CONFIGURACOES_M02_02B.md), sem aprovação manual inferida dos detalhes02A. Infraestrutura de seleção apenas; destinos e conteúdo continuam futuros.

**Atualização01/11/2026:** especificação aprovada para implementar somente M02-02A. [Núcleo técnico entregue para avaliação](CONTINUIDADE_M02_02A.md); nenhum destino real, quest/área nova ou arte. O texto abaixo preserva a especificação de31/10; propostas de outros recortes não foram promovidas a implementação.

31/10/2026. **Para avaliação, sem implementação**, base c8bf765. Tag m01 preservada. Escopo/viagem condensada, Ria completa após nível2 em descanso autorizado e retaliação única controlada **aprovados**; demais soluções abaixo são especificação, não autorização de M02-02. [Backlog](BACKLOG_M02.md), [política de saves](PERSISTENCIA_M01.md#política-vigente-de-compatibilidade--31102026).

## Evidência e adaptação

Fonte consultada: PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, pp.1–5 (captura20/10/2026; URL identificadora https://en.uesp.net/wiki/Arena:Fang_Lair_(quest)). Pp.1–2: sono após nível2, informação sobre Hammerfell/Rihad, palácio junto à muralha, Blubamka e Stonekeep; pp.2–3: pergaminho/entrega; pp.3–4: mina, dois enigmas/chaves/fragmento; pp.4–5: retaliação e notas. As coordenadas citadas ali são do original, **não tiles MV**. Nenhuma nova observação no executável DOS ou decodificação de mapa original foi realizada nesta tarefa.

**Original documentado:** o destino após Imperial Dungeons varia conforme origem (CAMPANHA_PRINCIPAL.md); Rihad fica no sul de Hammerfell e seu palácio na muralha. O material não fixa o portão de chegada deste recorte. **Adaptação aprovada:** elipse de viagem até Rihad, sem afirmar que o Shift Gate original sempre abre ali. **Definição do mapa mínimo:** esplanada interna junto ao acesso de estrada `rihad.arrival`, caminho ao informante, corte encostada à muralha e repouso autorizado. Orientação cardinal e coordenadas numéricas serão atribuídas ao construir o mapa; o ponto lógico e sua função ficam fixados aqui, sem inventar uma planta original para Rihad.

## Estados e transições

IDs abaixo são contratos lógicos propostos; não existem ainda no banco. MQ01 mantém estados/recibos atuais. MQ02 usa `stage`, objetivos, recibos e `completed`; sinais de acesso derivam da etapa, sem switches paralelos contraditórios.

| Etapa MQ02 | Objetivo revelado / entrada | Transição válida |
| --- | --- | --- |
|0 | Não iniciada; MQ01 em curso | Gate concluído na campanha, ou confirmação de continuação de save final M01, inicia viagem; concluir a viagem →10 |
|10 | Recuperar-se e buscar orientação; chegada a Rihad | Descansar fora de batalha em ponto autorizado, nível≥2, e terminar o bloco de Ria →20. Nível1 continua podendo explorar/descansar |
|20 | Procurar notícias de Fang Lair em Rihad | Informante indica a corte →30; não revela a mina exata |
|30 | Falar com Blubamka | Aceitar recuperar o pergaminho →40; revela Stonekeep |
|40 | Recuperar o pergaminho em Stonekeep | Fonte elegível concede somente o faltante →50; item ausente mantém fonte acessível |
|50 | Entregar o pergaminho à corte | Posse verificada, entrega registrada e remoção de uma unidade, juntas →60; revelar Fang Lair uma vez |
|60 | Explorar Fang Lair e resolver o enigma das celas | Resposta correta libera cela2 →70. Erros liberam encontros das celas representadas, sem retroceder etapa |
|70 | Obter chave dourada e abrir passagem à escada | Fonte da cela2 e uso na porta →80; consumo/recibo e porta aberta numa operação única |
|80 | Explorar nível2 e responder ao segundo enigma | Resposta válida abre porta →90; erro permite nova tentativa, cancelamento não altera estado |
|90 | Recuperar primeiro fragmento | Coleta única com verificação de posse →100. Guardiões presentes; não inventar exigência de matar todos se a rota permitir evitá-los, como admite a fonte |
|100 | Sair com o fragmento; resistir à ameaça | Interação de saída inicia visão de Tharn uma vez e encontro controlado. Vitória legítima + fragmento presente →110; interrupção não conclui; derrota usa game over |
|110 | Fragmento recuperado e retaliação superada | `completed=true`; retorno seguro a Rihad e salvamento normal. Sem iniciar MQ03 ou conceder fragmentos posteriores |

Revalidar condições ao executar; etapas monotônicas, operações idempotentes. Encontros existentes sem fuga, loot único em vitória. Carregar/reentrar/repetir comando não duplica efeito. Fontes/portas/inimigos específicos de quest não têm respawn comum. Reativação comum somente após conclusão aplicável e saída, nunca por descanso ou viagem antes da conclusão.

### Itens e enigmas

| Item/fonte estável | Elegibilidade / encerramento |
| --- | --- |
| Pergaminho: `MQ02.parchment`, fonte `stonekeep.parchment` | Ilha dos ghouls, posição original referida (72,23), a converter pela planta. Uma unidade nas etapas40/50; recuperação reabre fonte só enquanto necessário. Entrega `MQ02.rihad.parchment` aposenta fonte e remove uma unidade; após60 exigir recibo, não posse. Não reproduzir o bug CD de obter fragmentos ao repetir a coleta |
| Chave dourada: `MQ02.gold-key`, fonte `fang.cell2.key` | Disponível após acerto do primeiro enigma, etapa70; uma unidade. Porta `fang.lower-door`, recibo `MQ02.fang.lower-door`. Consumo ao abrir é adaptação do contrato já usado pela porta MQ01; depois80 a porta/recibo substituem a exigência de posse, sem recriar chave |
| Primeiro fragmento: `MQ02.staff-piece-1`, fonte `fang.staff-piece-1` | Etapa90/100 e após conclusão: item importante retido, sem equipar, bônus ou consumo. Enquanto faltar e continuar necessário, a fonte pode repor somente a unidade faltante, inclusive após110; nunca depois de futura entrega/consumo legítimo. Não repetir visão, combate, EXP ou loot, contar outro fragmento ou retroceder a quest. Essa exceção explícita exige extensão do contrato de fontes, que hoje bloqueia fontes de quests concluídas |

IDs numéricos novos serão acrescentados, sem reutilizar legados. Itens importantes sem descarte/venda; conferir posse/recibo na saída e entrada de etapa. Recuperação pela fonte original, sem drop aleatório ou remoção de outros itens; capacidade/inconsistência impede transição inválida.

**Enigma1:** manter as três proposições da fonte (p.3), traduzidas: se cela3 tem latão, cela2 tem ouro; se cela1 tem ouro, cela3 tem latão; se cela2 tem latão, cela1 tem ouro; nem tudo dito é verdadeiro. Escolhas identificadas Cela1/2/3; correta2. Erro libera as aranhas previstas uma vez por grupo/cela, não gera outra leva a cada resposta. Celas opcionais/tesouros não substituem a chave correta ou viram requisito. **Enigma2:** tradução de “não é peixe, carne, pena ou osso, mas tem dedos e polegares”; aceitar `luva`, `luvas`, `manopla`, `manoplas`, com ou sem artigo, normalizando caixa/espaços. Vazio não é acerto. Narrativa pode paginar o texto, sem revelar a solução antes de responder.

## Viagens e mapa mínimo

Âncoras serão tiles caminháveis fora do trigger, sem objeto/inimigo sobreposto; coordenadas/IDs MV definidos na construção. Destinos explícitos, cancelar sem efeitos, portas/escadas sem seleção redundante. Sem mapa mundial, viagem geral ou trajetos vazios.

| Origem | Gatilho | Condição | Destino / chegada | Retorno |
| --- | --- | --- | --- | --- |
| Imperial Dungeons / Shift Gate | Área de ativação existente | Campanha; conclusão MQ01 válida, sem batalha/transição em curso | Bloco `MQ02.departure` → Rihad, `rihad.arrival` | Não; preservar saída sem retorno à prisão |
| Save M01 em ending/ended | **Continuar jornada**, opção explícita na versão M02 | MQ01 concluída e campanha reconhecida; continuação não aplicada | Mesmo bloco de viagem → `rihad.arrival` | Não repete Gate/MQ01. Voltar ao título antes de confirmar preserva a escolha |
| Rihad / corte | Porta identificada | Acesso público; missão só é oferecida em30 | Interior da corte, `rihad.court.entry`, de frente à audiência | Porta → `rihad.court.exit`, na esplanada |
| Rihad / repouso | Entrada do alojamento mínimo | Fora de batalha | `rihad.rest.entry`; leito `rihad.rest.bed` | Saída → `rihad.rest.exit`; uso do leito não viaja nem provoca respawn |
| Rihad / arredores necessários | Passagem identificada “Arredores de Rihad” | Fora de batalha; disponível desde10 | Pequeno trecho adjacente `rihad.outskirts.entry`, com encontros visíveis especificados abaixo | Livre à esplanada `rihad.outskirts.return`; sem cobrança/horas |
| Rihad / saída de estrada | Interação “Viajar para Stonekeep” | Etapa≥40; destino conhecido | Elipse curta, entrada Stonekeep `stonekeep.entry` | Saída → Rihad `rihad.arrival`, mesmo sem pergaminho |
| Stonekeep / ilha e passagem | Abertura/passagem local e margens marcadas | Piso/água permitidos, nunca atravessar parede | Âncoras locais `stonekeep.passage.a/b` e margens da ilha | Bidirecional; adaptação do salto à grade, sem sistema geral de salto. Preservar relação da rota na planta |
| Rihad / saída de estrada | Interação “Viajar para Fang Lair” | Etapa≥60 e recibo de entrega | Elipse curta → nível1, `fang.entry`, antes do dragon gate | Saída para Rihad; em100 interceptada pela retaliação |
| Fang Lair / escada nível1 | Escada após porta mágica | Etapa≥80 e recibo da porta | Nível2, `fang.lower.entry` | Escada inversa → `fang.upper.stair-return`; não exige chave consumida |
| Fang Lair / sala do fragmento | Porta do segundo enigma | Etapa≥90 | `fang.staff-room.entry`; fonte fora do trigger da porta | Bidirecional, sem novo enigma depois de aberto |
| Fang Lair / saída com fragmento | Mesma saída usada para Rihad | Etapa100, fragmento presente | Visão/encontro na área da entrada, `fang.retaliation`; sem teleporte até vitória | Vitória conclui110; nova pressão permite viajar para `rihad.arrival`. Sem nova visão após load ou nova vitória para sair |

Preservar rotas/elementos das plantas de Stonekeep (um nível inundado) e Fang Lair (mina anã, dois níveis), sem dungeon genérica. Registrar recortes opcionais/lava nas entregas de mapas. Fuga desabilitada em batalha não proíbe retorno entre locais fora dela.

### Chegada no nível1 — solução mínima definida

Em `rihad.outskirts`, **quatro ratos visíveis**, inimigo atual/15 EXP cada: trecho infestado junto à estrada, indicado pelo informante, **adaptação**, não posição original. Leito seguro acessível desde a chegada; recuperação só por interação. Atacar gratuito disponível; sem compra/técnica/magia obrigatória ou surpresa na cidade.

Banco/regra nativa: `Classes[1].expParams=[30,20,30,30]`/`expForLevel` exigem50 EXP para nível2; quatro vitórias fornecem60, modificador atual1. Sem nível gratuito. Cálculo por leitura, **não teste de combate/balanceamento**; revalidar se a configuração mudar.

IDs `rihad.approach.rat.01–04`, derrotas persistentes, sem reativação por descanso/retorno durante MQ02; nível2+ pode ignorar. Leito e save antes dos encontros evitam esgotamento irrecuperável; derrota mantém game over/load. Descanso no nível1 não consome o sonho; primeiro descanso nível≥2 recupera e inicia Ria uma vez. Respawn geral inalterado.

## Blocos narrativos e apresentação

| Bloco / gatilho persistente | Conteúdo curto / ilustração necessária |
| --- | --- |
| `MQ02.departure`, após Gate/continuar | Elipse da fuga e deslocamento até Hammerfell/Rihad; não afirmar teleporte direto original. Vista ambiental da chegada/estrada, sem viajante protagonista |
| `MQ02.ria`, descanso autorizado nível≥2 | Visão completa dividida em páginas: fortalecimento, Staff de oito partes, Fang Lair sem localização exata, busca de informações. Ria espectral e símbolos/ambiente coerentes; não usar só a cela inicial para todas as páginas |
| `MQ02.rihad.request/delivery`, audiência válida | Blubamka, pergaminho roubado/Stonekeep; depois, entrega e localização de Fang Lair. Rainha/corte ou pergaminho sobre mesa; sem mãos do protagonista. Golthog é citado, não criado como boss |
| `MQ02.fang.entry`, primeira chegada | Dragon gate/mina anã abandonada; texto ambiental curto. Arquitetura correspondente à cena, sem objetos exclusivos da cela imperial |
| `MQ02.staff`, coleta válida | Fragmento escuro reage e aguarda as outras sete peças. Objeto/ambiente, nunca “na mão do jogador” na ilustração |
| `MQ02.tharn`, saída na etapa100 | Ameaça de Tharn após a coleta e encontro controlado; imagem de Tharn/visão, não Ria como substituto. Visão lida e vitória são registros separados, para não repetir fala ou concluir por apenas assisti-la |

Seguir [diretivas da introdução](DIRETIVA_DE_NAVEGACAO.md#narrativa-m01-18-r02): paginação/controles existentes, foco e soltura/nova pressão, imagem ampla sem deformação, texto curto/margens legíveis e **sem cabeçalho redundante**. Imagem deve corresponder à cena; diário só revela conhecimento adquirido. Intro M01 preservada; redesign geral das caixas fica em QUALIDADE-01.

Persistir bloco/cursor e operações: retomar leitura, não repetir fala concluída, manter encontro pendente entre visão e batalha. Sem save em batalha ou fila de comandos herdados da narrativa. Sem vozes/protagonista, inclusive mãos/silhuetas que fixem identidade.

## Saves: recomendação e custo técnico concreto

**Recomendação:** preservar saves normais m01 na mesma origem/perfil: extensão limitada pelos componentes abaixo, não compatibilidade universal histórica. Custo em mudanças concretas, sem estimativa de tempo ou validação executada. Nenhum save pessoal aberto/modificado.

| Ponto existente inspecionado | Alteração mínima necessária em entrega posterior |
| --- | --- |
| `MV_StateStore.normalize/fill`, defaults/versões por namespace | Reusar preenchimento de campos e migração aditiva; sem novo núcleo de armazenamento. Versão de schema não é versão de build |
| `Arena_Persistence.setQuest` já aceita ID adicional e preserva recibos; fontes são fixas e bloqueadas em quest concluída | Acrescentar defaults MQ02 e três fontes. Selecionar regras por quest e obrigação persistente explícita do fragmento após110, sem reabrir todas as fontes concluídas. Não renumerar MQ01/chave/recibos ou duplicar inventário/ator |
| `Arena_Quests` presume MQ01/mapa8/objetivos de chave e Gate | Manter comportamento/assinaturas MQ01 e adicionar seleção/configuração MQ02; impedir que reconciliação MQ01 interprete fontes/áreas novas. `ArenaQuestJournal` já lê uma lista: acrescentar conteúdo, não outra UI |
| `Arena_Narrative` v2 reconhece intro/ria/dungeon/ending/ended, redireciona no load e no mapa | Extensão versionada aditiva (v3 proposta), cursor por bloco novo e controle de continuação. Um registro de capítulo/transição com IDs de operação, sem espelhar personagem. Preservar cursor/intro M01 e adaptar os dois redirecionamentos; não basta acrescentar botão na tela final |
| `Arena_Encounters`/dungeon configuram área/mapa único; objetos MV são salvos nativamente | Selecionar configuração por área/mapa; acrescentar mapas/IDs depois dos atuais. Preservar Map008, suas instâncias/loot e modo técnico; não reconstruir mapas antigos para migrar o capítulo |
| Load nativo pode criar objetos temporários antes de `MV_StateStore.extractSaveContents`; erros atuais não são uma UI de compatibilidade | Validar contrato antes da substituição da sessão ou tratar falha com retorno seguro ao título, sem escrita. Não apresentar apenas erro não tratado; preservar dados originais e deixar explícito o motivo da rejeição |

Coerência mínima da continuação: campanha normal com MQ01 concluída, sem capítulo M02 iniciado, oferece **Continuar jornada** no lugar do fim exclusivo da demo na versão M02. Confirmar registra `campaign/MQ02.begin` uma vez e inicia viagem; viagem concluída entra em10/Rihad. Save pré-Gate mantém MQ01 até a saída; save em intro/Ria M01 mantém seu cursor. `ending` e `ended` antigos não repetem quest/Gate/recompensas; sem confirmação permanecem numa tela recuperável com opção de título. Um save posterior à chegada mantém destino/cursor real, não retorna à esplanada toda vez. Ter visto o encerramento sem salvar não recria progresso perdido.

Preservar raça/gênero, aparência derivada, equipamentos/inventário/ouro, EXP/nível, pontos/saldo, escolhas, recursos gastos, magias, atalhos, recibos e tesouros. Migração não cura nem premia. Só adicionar defaults/recibos do novo capítulo; continuar não reinicia MQ01 nem permite retorno à prisão. `technical`/E05 não viram campanha automaticamente; defaults sem identidade/etapa suficiente não são adivinhados.

**Custo desproporcional:** reconstruir identidade/cursor ausentes, IDs remapeados, corrupção ou progresso não salvo exigiria heurísticas específicas. Não recomendar suporte universal a esses estados históricos. Se mesmo m01 normal exigir isso na implementação, apresentar quebra/versão de corte para avaliação; a inspeção atual não justifica quebrá-la.

Versão oficial de corte para compatibilidade obrigatória ainda a definir; não presumir m01. Integridade dentro da versão atual obrigatória. Incompatibilidade deve retornar ao título com diagnóstico recuperável, sem substituir a sessão ativa ou escrever/limpar slots. Namespace `arena:m01:save-v1` inalterado, sem migração entre origens. Downgrade M02→m01 não garantido.

## Participantes, assets e próximo recorte

Reusar as16 identidades/roupas aprovadas, Ria espectral como referência de continuidade, ratos/goblins e sistemas existentes. Necessários à representação: informante sem biografia/sistema de rumor geral; Blubamka; Ria; Tharn; ghouls da ilha, aranhas das celas e dois hell hounds da sala final. Esqueletos/lobos somente se fizerem parte da rota efetivamente representada; não exigir catálogo fora dela. O servo da retaliação precisa de definição antes de M02-08: o guia diz um servo, mas não identifica sua espécie. Não escolher automaticamente um homem-lagarto nem inventar um chefe canônico.

Inventário mínimo de arte futura: núcleo de Rihad/corte/repouso e acessos; trecho inundado de Stonekeep e pergaminho; mina anã/dragon gate/celas/escadas e chave/fragmento; figuras/interações dos NPCs; atlas de exploração e movimentos de batalha necessários aos novos inimigos; ilustrações dos blocos acima. Conferir arquivos existentes antes de gerar; nenhum desses novos assets está declarado pronto. **Primeiro uma amostra integrada por novo padrão necessário**, sem lotes ou regeneração da intro aprovada.

**Primeira implementação após avaliação:** M02-02A, transição de capítulo por acesso técnico isolado reaproveitado, destino configurável, sem cidade/arte/combate novo. Fixtures sintéticas: pré-Gate, ending/ended, intro parcial, chegada repetida e laboratório; conferir cancelamento/dados preservados. Não substituir o fim da campanha normal por destino ausente; integrar viagem real quando Rihad existir. M02-02B depois seleciona quest/área. **Nenhum teste de gameplay executado aqui**.

**Lacunas restantes delimitadas:** espécie do servo da retaliação (antes de08); posições MV e correspondência das passagens de Stonekeep/Fang Lair com plantas (nas entregas de mapas, sem fingir coordenadas já conferidas); tradução final das audiências não transcritas integralmente no guia; versão oficial a partir da qual compatibilidade antiga será obrigatória. Não bloqueiam especificar/avaliar a continuidade mínima agora. Escopo/viagem e gatilhos de Ria/Tharn já aprovados: não pedir esses aceites de novo. Aguardar avaliação desta especificação antes de M02-02.
