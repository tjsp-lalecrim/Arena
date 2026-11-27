# M02-01 — estados, viagens e continuidade da MQ02

## Roteiro integrado de MQ02 no Chrome

**Exploração opcional nordeste/leste de Fang Lair:** [cobertura27/11 e percurso](FANG_CELAS_M02_06A.md#alas-nordeste-e-leste--27112026), partindo da entrada normal até a margem MIF(59,8), com retorno pela rede sul MIF(82,61). Dois tesouros e 21 encontros adicionais, sem condição nova dos enigmas/MQ02. Salvar/carregar após coleta/vitória; avaliação manual no teste integrado. Ainda não publicado no Pages.

**Exploração opcional de Fang Lair:** [Fantasma, ramo oeste/sul e cinco tesouros](FANG_CELAS_M02_06A.md#ala-oestesul-e-tesouro-do-fantasma--26112026). A partir da entrada, margem MIF(9,37)/MV(273,114), poço seco até a câmara; tesouro(5,51), continuidade sul pelas margens(2,63)/(8,75)/(19,74)/(6,94). Conferir uma derrota e uma coleta após salvar/carregar e voltar à rota dos enigmas. Não é condição para obter o fragmento ou concluir MQ02; avaliação manual pendente.

**Mapa mundial integrado:** [roteiro e regras](plugins/Arena_WorldMap.md#verificação-e-avaliação). Na cidade, usar menu Mapa mundial/M → Hammerfell → destino conhecido; conferir cancelamento e viagem a Stonekeep, retorno pelo evento normal e viagem a Fang Lair após entrega. Em interiores, apenas consulta; etapa100 mantém saída/visão/retaliação obrigatórias. Portão continua como alternativa pelo mesmo serviço.

**Feedback recebido:** a visão de Ria foi apresentada com sucesso. A avaliação do mapa mundial permanece pendente; não pedir nova avaliação isolada da visão. As menções históricas abaixo ao bloqueio anterior da cama não anulam esse relato.

**Teste manual pendente:** o responsável não conseguiu acionar a cama na prévia0d8f209. A correção cobre pé e cabeceira por Enter/clique, com interiores V01; [diagnóstico e evidência](CHEGADA_RIHAD_M02_03A.md#interiores-v01-e-correção-da-cama--19112026).

Descanso urbano vigente na [Pousada do portão](CHEGADA_RIHAD_M02_03A.md#pousada-do-portão--descanso-urbano-vigente), com avaliação manual pendente. A prévia Pages `0d8f209` já contém a pousada; [publicação e roteiro curto](PAGES_INFRA.md#prévia-de-mq02-com-a-pousada-de-rihad--18112026).

**Referência de jogo:** `main` com a [orientação de Rihad](CHEGADA_RIHAD_M02_03A.md#orientação-e-fachadas-de-rihad) e os [Hell Hounds de Fang Lair](FANG_CELAS_M02_06A.md#hell-hounds-da-sala-do-fragmento), sobre a integração `f78de8d`. Avaliação manual pendente. As verificações automatizadas existentes em Chrome isolado cobrem [Rihad, corte e Stonekeep](evidencias/m02-rihad-orientacao/resultado.json) e [Fang Lair, Hell Hounds, retaliação e retorno](evidencias/m02-fang-atlas/fang-lair.json).

A [prévia pública](https://tjsp-lalecrim.github.io/Arena/) foi atualizada para `0d8f209`; [registro da publicação](PAGES_INFRA.md#prévia-de-mq02-com-a-pousada-de-rihad--18112026). A seta **Audiência** está disponível na `main`. A avaliação manual do piloto faz parte do passo 2.

Abra o [Arena local](http://127.0.0.1:8774/) no Chrome desktop. Se o servidor estiver parado, inicie-o pelo [procedimento local](EXECUCAO_LOCAL.md#iniciar-acessar-e-encerrar). Use o fluxo normal da campanha. Para preservar a partida de origem, use slots livres para os pontos de retomada e mantenha o mesmo endereço e perfil do Chrome. Para conferir um save, volte ao título, recarregue a página com F5 e escolha **Continuar** no slot de teste.

| Passo | Ação | O que deve acontecer e onde retomar |
| --- | --- | --- |
| 1. Chegada a Rihad | No Shift Gate, escolha **Continuar jornada**. Também vale começar com um save já no portão de Rihad. Fale com o informante na esplanada e siga as placas **Pousada** até a **Pousada do portão** (Map009, porta313,42). Se estiver no nível 1, ganhe experiência em **Arredores** e volte. No nível 2 ou acima, entre na pousada, siga **Quarto** e aproxime-se do pé ou da lateral da cama e use **Enter**; repita com **clique na imagem** para descansar gratuitamente. Termine a visão de Ria, saia para Rihad e volte ao informante. | A chegada fica dentro do portão urbano. O descanso no nível1 permite voltar após alcançar o nível2. A visão acontece uma vez na cama; o informante então indica a corte. Retome no portão se ainda faltar a visão, ou na esplanada antes de falar com o informante. |
| 2. Audiência | Ao fechar a fala do informante, confira a seta **Audiência** no canto superior direito. Siga-a pelas ruas até a grade da muralha sul, observando as mudanças nos desvios. Passe pela grade e entre pela porta de madeira. À passagem, confirme que uma fachada com **Fechado** não funciona como a entrada da corte. Siga pela faixa central até Blubamka e escolha **Aceitar o pedido**. Siga as placas **Portão urbano** de volta ao norte e escolha **Viajar para Stonekeep** na estrada. | A seta deixa de aparecer ao entrar na corte. Após aceitar o pedido, o diário pede o pergaminho e Stonekeep fica disponível. Um save com o pedido aceito pode retomar na estrada. Um save da corte antiga retoma na entrada do salão atual com o progresso preservado. |
| 3. Stonekeep | Atravesse os aposentos e a passagem de água até a ilha. Recolha o pergaminho e volte pela saída junto à entrada de Stonekeep. | O inventário recebe um pergaminho e o diário pede a volta à corte. **Save A:** em Rihad, com o pergaminho no inventário, antes de entregá-lo. Ao carregar, siga à corte para fazer a entrega. |
| 4. Entrega e retomada na corte | Fale com Blubamka e escolha **Entregar o pergaminho**. Use **Salvar** dentro da corte, em outro slot, e carregue pela tela de título após F5. Confira a posição, o inventário e o diário. Fale com Blubamka novamente. | O save retoma no salão e na posição gravada. O pergaminho foi consumido uma vez, a conversa não oferece nova entrega e Fang Lair está no diário. **Save B:** dentro da corte, após a entrega. Retome saindo da corte, voltando ao portão urbano e escolhendo **Viajar para Fang Lair** na estrada. |
| 5. Primeiro enigma | Na mina, siga o corredor até as celas. Escolha **Cela 1** ou **Cela 3** para testar um erro. Depois escolha **Cela 2**, recolha a chave dourada ao sul e use-a no portal da escada. | O erro libera as aranhas previstas e permite tentar de novo. O acerto abre a Cela 2. O portal consome a chave uma vez. Um save no patamar com o portal aberto permite retomar na escada. |
| 6. Segundo enigma | Desça a escada e siga até a porta do enigma. Experimente uma resposta errada e depois cancele uma tentativa. Escolha **Uma luva ou manopla**. | Erro e cancelamento deixam a porta fechada e permitem tentar novamente. O acerto abre a porta e o diário aponta para o fragmento. Se já tiver um save com a porta aberta, retome no vestíbulo. |
| 7. Fragmento | Passe pela porta pelo corredor central e observe os dois Hell Hounds em patrulha nas laterais. Interaja com **Primeiro fragmento · Interagir** mantendo ambos vivos. Se quiser avaliar o combate, salve com a peça e aproxime-se de um deles antes de voltar pela escada. | Há uma única peça no inventário, e o diário ainda indica que falta sair da mina. Em combate opcional, observe a mordida, o recuo e a derrota em brasas. Cada vitória concede EXP uma vez e remove apenas o próprio encontro. **Save C:** no patamar do primeiro nível, com o fragmento e antes de interagir com a saída. Serve para repetir só a retaliação. |
| 8. Retaliação e volta | Interaja com **Saída da mina** no primeiro nível. Termine a visão e vença o **Servo de Tharn**. Confira o diário e o inventário. Interaja novamente com a saída para voltar a Rihad. | A visão abre o combate. Se o save já registrar a leitura, a saída inicia o combate diretamente. A vitória conclui MQ02 e preserva o fragmento. O retorno a Rihad não repete visão, batalha ou recompensas. |

Ao relatar um problema, indique o passo, a área ou ponto do mapa, a última ação, o esperado e o observado. Se puder, guarde o slot anterior e anexe uma captura. Para a porta de Stonekeep ainda sem localização, uma captura do entorno e a mensagem exibida ajudam a identificar o evento. Correções que afetem a campanha serão reproduzidas a partir desse relato, verificadas e promovidas pelo [fluxo do projeto](DESENVOLVIMENTO_E_VERSIONAMENTO.md).

Avalie também os novos atlas no mesmo percurso: em Rihad, confira rua, passeio, portões, um arco de jardim e a chegada à corte. Em Fang Lair, confira a entrada, as celas, a escada e a sala do fragmento, incluindo a leitura do personagem sobre o piso. A cobertura restante dos mapas, os materiais ainda provisórios e as ilustrações por bloco continuam no [backlog do M02](BACKLOG_M02.md). Release e GitHub Pages seguem em etapas próprias.

## Histórico da especificação e das entregas

**Delta A2-E posterior a8f28207:** Map015 isolado com24 encontros/4portas; base integral com avaliação manual adiada, avanço autorizado. [Cobertura e conexões](STONEKEEP_M02_04.md#faixa-a2-e--primeiro-setor-funcional-no-map015). Map012/quest/recibos mantidos. Completar Stonekeep antes do levantamento integral/dimensionamento de Rihad, sem expansão de Fang Lair por associação.

**Candidata de transferência M02-04C2.0:** [Stonekeep integral](STONEKEEP_M02_04.md#m02-04c20--base-integral-funcional-isolada-02112026) em Map015274×274, somente laboratório, preserva IDs de quest/fonte/recibo e20 encontros transferidos. Map012 continua ativo na campanha. Não modifica etapas, exige morte de todos ou conclui a dungeon; portas/encontros ausentes continuam pendentes.

**Revisão de escopo02/11/2026:** mapas completos e todos os encontros aplicáveis passam a ser requisito, conforme MARCOS_DO_PROJETO.md; recortes abaixo descrevem as amostras históricas, não a entrega cartográfica final. Estados/recibos/viagem condensada preservados. Prioridade: auditar e concluir Stonekeep/Rihad conforme BACKLOG_M02.md, antes de expandir Fang Lair. Exceção de ordem exige dependência concreta documentada; não há uma identificada agora.

**Levantamento posterior M02-04C1:** [mapa90×90 e índice de cobertura](STONEKEEP_M02_04.md#m02-04c1--levantamento-completo02112026), sem mudar estados/viagens:180 referências estáticas/9 espécies,70 portas e refúgios candidatos; proposta anterior de4 mapas por limite do editor; [prova posterior de mapa único274](PROVA_MAPA_UNICO_STONEKEEP.md) passou no runtime sem alterar o motor. Exploração contínua autorizada, sem integração definitiva. O esqueleto(76,22) é coordenada MIF e falta no Map012(18,69). Rihad/Fang Lair preservadas; não tratar a amostra como mapa completo.

**Implementação disponível af17b4b:** amostra das celas/Map013, MQ02 até80 sem conclusão; aranhas sinalizadas sem combate, materiais provisórios. Stonekeep tem3 ratos/7 esqueletos/6 ghouls/4 lobos no recorte e entrega funcional; isso não comprova cobertura total. Demais registros datados a seguir são históricos quando descrevem conteúdo antes ausente.

**Atualização de cobertura:** entrega4357999 testada pelo responsável e funcional, sem novos casos inferidos. [Delimitação dos aposentos](STONEKEEP_APOSENTOS_M02_05.md):3 ratos confirmados incluídos e4 lobos confirmados ainda sem exemplar; layout, fontes/recibos e etapa60 preservados.

**Implementação vigente M02-05:** [entrega na corte](ENTREGA_PERGAMINHO_M02_05.md), sobre18473c2: confirmação explícita, item7/recibo/aposentadoria/50→60 consistentes, diário e Fang Lair conhecida sem mapa/viagem. Coleta confirmada pelo responsável, sem outros testes inferidos; extensão atual para avaliação. Referências a entrega ausente nas entradas anteriores abaixo são históricas.

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

**Original documentado:** o destino após Imperial Dungeons varia conforme origem (CAMPANHA_PRINCIPAL.md); Rihad fica no sul de Hammerfell e seu palácio na muralha. O material não fixa o portão de chegada deste recorte. **Adaptação aprovada:** elipse de viagem até Rihad, sem afirmar que o Shift Gate original sempre abre ali. **Recorte funcional inicial, mapa provisório:** esplanada interna junto ao acesso de estrada `rihad.arrival`, caminho ao informante, corte encostada à muralha e repouso autorizado. Orientação cardinal e coordenadas numéricas serão atribuídas ao construir o mapa; o ponto lógico e sua função ficam fixados aqui, sem inventar uma planta original para Rihad.

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

Preservar rotas/elementos das plantas de Stonekeep (um nível inundado) e Fang Lair (mina anã, dois níveis), sem dungeon genérica. Preservar também as alas antes excluídas como opcionais; documentar travessias, lava e limites sustentados pelas fontes, sem recortar a planta para reduzir a entrega. Fuga desabilitada em batalha não proíbe retorno entre locais fora dela.

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

Seguir [diretivas da introdução](DIRETIVA_DE_NAVEGACAO.md#narrativa-m01-18-r02): paginação/controles existentes, foco e soltura/nova pressão, imagem ampla sem deformação, texto curto/margens legíveis e **sem cabeçalho redundante**. Imagem deve corresponder à cena; diário só revela conhecimento adquirido. Intro M01 preservada; redesign geral das caixas fica em QUALIDADE-01. Uma ilustração por entrega e avaliação antes da próxima, conforme DIRECAO_DE_ARTE.md; sem lote.

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

Reusar as16 identidades/roupas aprovadas, Ria espectral como referência de continuidade, ratos/goblins e sistemas existentes. Necessários à representação: informante sem biografia/sistema de rumor geral; Blubamka; Ria; Tharn; ghouls da ilha, aranhas das celas e dois hell hounds da sala final. Inventariar também esqueletos/lobos e demais espécies declaradas fora da rota principal nos mapas completos; exemplares já aprovados devem ser reutilizados, sem pressupor um catálogo integral de variantes. O servo da retaliação precisa de definição antes de M02-08: o guia diz um servo, mas não identifica sua espécie. Não escolher automaticamente um homem-lagarto nem inventar um chefe canônico.

Inventário mínimo de arte futura: núcleo de Rihad/corte/repouso e acessos; trecho inundado de Stonekeep e pergaminho; mina anã/dragon gate/celas/escadas e chave/fragmento; figuras/interações dos NPCs; atlas de exploração e movimentos de batalha necessários aos novos inimigos; ilustrações dos blocos acima. Conferir arquivos existentes antes de gerar; nenhum desses novos assets está declarado pronto. **Primeiro uma amostra integrada por novo padrão necessário**, sem lotes ou regeneração da intro aprovada.

**Primeira implementação após avaliação:** M02-02A, transição de capítulo por acesso técnico isolado reaproveitado, destino configurável, sem cidade/arte/combate novo. Fixtures sintéticas: pré-Gate, ending/ended, intro parcial, chegada repetida e laboratório; conferir cancelamento/dados preservados. Não substituir o fim da campanha normal por destino ausente; integrar viagem real quando Rihad existir. M02-02B depois seleciona quest/área. **Nenhum teste de gameplay executado aqui**.

**Lacunas restantes delimitadas:** espécie do servo da retaliação (antes de08); posições MV e correspondência das passagens de Stonekeep/Fang Lair com plantas (nas entregas de mapas, sem fingir coordenadas já conferidas); tradução final das audiências não transcritas integralmente no guia; versão oficial a partir da qual compatibilidade antiga será obrigatória. Não bloqueiam especificar/avaliar a continuidade mínima agora. Escopo/viagem e gatilhos de Ria/Tharn já aprovados: não pedir esses aceites de novo. Aguardar avaliação desta especificação antes de M02-02.

**Diretriz urbana posterior à chegada:** preservar a estrutura original das cidades, mantendo apenas os eventos de campanha e interiores necessários acessíveis. A esplanada técnica acima não passa a ser a topologia definitiva de Rihad. Adequação quando seu mapa retornar ao backlog, conforme [diretiva de mapas](DIRETIVA_DE_MAPAS.md#cidades-topologia-original-e-recorte-de-eventos); sem alteração de Rihad na aplicação de materiais de Stonekeep.
