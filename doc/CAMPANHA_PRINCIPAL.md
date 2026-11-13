# Inventário inicial da campanha principal

Fonte consultada: PDFs locais da UESP em doc/wiki/, especialmente Arena_Main Quest, página 1, e os guias de cada quest, seções Quick Walkthrough e início do Detailed Walkthrough. Os nomes em inglês são identificadores de referência; os textos do jogo serão em Português Brasileiro. As descrições abaixo são resumos de planejamento, não traduções finais dos diálogos.

Cada quest MQ01 a MQ10 corresponde respectivamente a um marco M01 a M10. Consultar MARCOS_DO_PROJETO.md para entregas, dependências e critérios de conclusão.

## Sequência e locais necessários

| ID de planejamento | Quest principal | Cidade-base / região | Local preparatório obrigatório | Objetivo principal |
| --- | --- | --- | --- | --- |
| MQ01 | Imperial Dungeons | Imperial Province | A própria prisão inicial | Receber orientação de Ria, obter chave, sair da cela e alcançar o Shift Gate |
| MQ02 | Fang Lair | Rihad / Hammerfell | Stonekeep | Recuperar o pergaminho, revelar Fang Lair e obter o primeiro fragmento do Staff of Chaos |
| MQ03 | Labyrinthian | Winterhold / Skyrim | Fortress of Ice | Devolver a tabuleta à Mages Guild e recuperar o segundo fragmento |
| MQ04 | Elden Grove | Eldenroot / Valenwood | Selene's Web | Recuperar a gema para revelar Elden Grove e obter o terceiro fragmento |
| MQ05 | Halls of Colossus | Corinth / Elsweyr | Temple of Agamanus | Recuperar a tabuleta para a Mages Guild e obter o quarto fragmento |
| MQ06 | Crystal Tower | Lillandril / Summurset Isle, conforme grafia da fonte | Temple of Mad God | Recuperar o diamante para revelar a torre e obter o quinto fragmento |
| MQ07 | Crypt of Hearts | Camlorn / High Rock | Mines of Khuras | Recuperar o mapa para a Brotherhood of Seth e obter o sexto fragmento |
| MQ08 | Murkwood | Stormhold / Black Marsh | Vaults of Gemin | Recuperar a tabuleta para o Conclave of Baal e obter o sétimo fragmento |
| MQ09 | Dagoth-Ur | Ebonheart / Morrowind | Black Gate | Recuperar o Hammer of Gharen, revelar a entrada e obter o oitavo fragmento |
| MQ10 | The Imperial Palace | Imperial City / Imperial Province | Os níveis do palácio | Alcançar o Jewel of Fire e concluir a restauração do Imperador |

Dependência principal: MQ01 → MQ02 → MQ03 → MQ04 → MQ05 → MQ06 → MQ07 → MQ08 → MQ09 → MQ10. Cada cadeia contém etapas de obtenção, entrega e descoberta de localização; não eliminar os locais preparatórios como se fossem side quests opcionais.

**Planejamento pós-M01:** entrega m01 preservada; cadeia mínima, recortes urbanos, pré-requisitos/retaliação de MQ02 e proposta de continuidade dos saves finais em [BACKLOG_M02.md](BACKLOG_M02.md). O M02 está em desenvolvimento; a revisão de cobertura em seu backlog precede nova expansão de Fang Lair. Refinamentos em QUALIDADE-01 são separados da campanha e do MOBILE-01; não duplicam a cadeia narrativa aqui.

## Fontes por registro

Os arquivos estão em doc/wiki/ e seguem o sufixo ` - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`:

- MQ01: Arena_Imperial Dungeons (quest), páginas 1–3; saída e nota sobre versões na página 4.
- MQ02: Arena_Fang Lair (quest), início do guia, Quick Walkthrough.
- MQ03: Arena_Labyrinthian, Quick Walkthrough e Winterhold, Part 1.
- MQ04: Arena_Elden Grove, Quick Walkthrough.
- MQ05: Arena_Halls of Colossus, Quick Walkthrough.
- MQ06: Arena_Crystal Tower, Quick Walkthrough.
- MQ07: Arena_Crypt of Hearts, Quick Walkthrough e Camlorn, Part 1.
- MQ08: Arena_Murkwood, Quick Walkthrough e Stormhold, Part 1.
- MQ09: Arena_Dagoth-Ur, Quick Walkthrough.
- MQ10: Arena_The Imperial Palace, páginas 1–4.

URLs originais estão preservadas nos PDFs. Consultar as seções completas ao especificar cada etapa, inclusive sonhos, emboscadas, enigmas e condições. O inventário não substitui a revisão integral de cada mapa ou diálogo.

## Inventário textual

**Convenção.** T indica tradução ou condensação fundada em texto original. A indica adaptação do projeto. P identifica mensagens provisórias da amostra. IDs editoriais novos servem para rastrear blocos, sem substituir IDs de quest, fonte ou recibo. O texto marcado como em jogo vem da árvore funcional `f27fd34` e das revisões de Rihad e Fang Lair registradas no backlog. O restante é proposta ou lacuna, sem publicação no runtime. A barra separa páginas, alternativas ou linhas já distintas no jogo.

### M02 — Rihad, Stonekeep e Fang Lair

| Ordem | ID | Voz | Gatilho | PT-BR | Fonte e estado | Orientação visual |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | `MQ02.travel.rihad` | Interface / narrador | Shift Gate concluído, confirmação e interação com a estrada antes da missão | Continuar jornada. Aviso da chegada: Rihad · chegada após viagem condensada. Esta estrada não é uma saída física da prisão. “Amostra provisória; sem retorno à prisão.” | A, em jogo, `Arena_Narrative` / `Arena_Rihad.arrivalNotice` | Opcional |
| 02a | `MQ02.rihad.inform.before` | Informante | Chegada, antes da visão | Você chegou a Rihad, no sul de Hammerfell. / Há um lugar de repouso na plataforma a leste. / Há ratos nos arredores, pelo acesso a leste. / Busque notícias entre os moradores antes da audiência. | A, em jogo, `Arena_Rihad.inform` | Opcional |
| 03.1 | `MQ02.ria.01` | Ria Silmane | Descanso autorizado a partir do nível 2 | Vejo que seus braços e sua mente se fortaleceram. É hora de começarmos esta jornada. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1500 | Piloto aprovado |
| 03.2 | `MQ02.ria.02` | Ria Silmane | Descanso autorizado a partir do nível 2 | O Cajado do Caos é o único objeto capaz de abrir a passagem entre este mundo e a dimensão para a qual o Imperador foi banido. Tharn o usou para destruir minha forma corpórea quando tentei alertar o Conselho. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1500 | A orientar, imagem atual compartilhada |
| 03.3 | `MQ02.ria.03` | Ria Silmane | Descanso autorizado a partir do nível 2 | Tharn sabia que o Staff era quase indestrutível, pois fora criado da própria essência da terra. Mas nisso encontrou a chave: assim como a terra está dividida, ele o partiu em oito fragmentos perfeitamente formados. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1500 | A orientar, imagem atual compartilhada |
| 03.4 | `MQ02.ria.04` | Ria Silmane | Descanso autorizado a partir do nível 2 | Ele espalhou os fragmentos pelo reino. Consegui descobrir onde está o primeiro: em um lugar chamado Fang Lair. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1500 | A orientar, imagem atual compartilhada |
| 03.5 | `MQ02.ria.05` | Ria Silmane | Descanso autorizado a partir do nível 2 | Dizem que Fang Lair foi construído pelos anões de Kragen. Segundo a lenda, um grande dragão expulsou-os de seu lar nas Dragon’s Teeth e tomou o lugar para si. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1294 | A orientar, imagem atual compartilhada |
| 03.6 | `MQ02.ria.06` | Ria Silmane | Descanso autorizado a partir do nível 2 | Quem me dera conhecer sua localização exata. Talvez algum sábio ou estudioso saiba onde fica. Em suas profundezas úmidas repousa o primeiro fragmento do Cajado do Caos. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1294 | A orientar, imagem atual compartilhada |
| 03.7 | `MQ02.ria.07` | Ria Silmane | Descanso autorizado a partir do nível 2 | Desejo-lhe sorte. Não creio que Tharn saiba de sua fuga, mas pouco mais posso fazer nesta forma. Tentei ocultar sua identidade com um feitiço; não sei quanto isso poderá proteger você. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1294 | A orientar, imagem atual compartilhada |
| 03.8 | `MQ02.ria.08` | Ria Silmane | Descanso autorizado a partir do nível 2 | Tome cuidado: Tharn pode estar à sua procura. Siga com as bênçãos do verdadeiro Imperador e as minhas. | T, em jogo, `ArenaRiaVision.json`, TEMPLATE #1294 | A orientar, imagem atual compartilhada |
| 04 | `MQ02.rihad.inform.after` | Informante | Visão concluída, encaminha à corte | Procura notícias de Fang Lair? Pergunte na corte. / O palácio fica junto à muralha da cidade. / A entrada da corte fica ao norte da esplanada. | T+A, em jogo, TEMPLATE #1307 e `Arena_Rihad.inform` | A orientar |
| 05a | `MQ02.rihad.request.early` | Corte | Audiência antes da orientação | Antes de tratar de Fang Lair na corte, busque orientação com o informante da esplanada e recupere suas forças. | A, em jogo, `ArenaCourt.notReady` | Opcional |
| 05.1 | `MQ02.rihad.request.01` | Blubamka | Etapa 30, oferta | Blubamka: Boas-vindas a Rihad. Sou a rainha Blubamka e concordo em lhe falar de Fang Lair, em troca de um favor. | T, em jogo, `ArenaCourt.offer`, TEMPLATE #1315 | A orientar |
| 05.2 | `MQ02.rihad.request.02` | Blubamka | Etapa 30, oferta | Há pouco tempo, goblins liderados por Golthog the Dark atacaram esta fortaleza. Levaram muitos tesouros, inclusive um pergaminho com pistas para decifrar a parte dos Pergaminhos Ancestrais que fala da localização de Fang Lair. | T, em jogo, `ArenaCourt.offer`, TEMPLATE #1315 | A orientar |
| 05.3 | `MQ02.rihad.request.03` | Blubamka | Etapa 30, oferta | Golthog e seus goblins fugiram para uma fortaleza antiga e arruinada chamada Stonekeep, fora da cidade. Temo que um grande grupo de mercenários ou soldados não consiga encontrá-los. Uma pessoa sozinha, porém, teria mais chances. | T, em jogo, `ArenaCourt.offer`, TEMPLATE #1315 | A orientar |
| 05.4 | `MQ02.rihad.request.04` | Blubamka | Etapa 30, oferta | Talvez sua chegada seja oportuna. Se concordar em recuperar o pergaminho, indicarei onde fica Stonekeep. Se voltar com ele, poderei decifrar a localização de Fang Lair. Prometo dar essa informação em troca de sua ajuda. Você aceita? | T, em jogo, `ArenaCourt.offer`, TEMPLATE #1315 | A orientar |
| 06 | `MQ02.rihad.request.choice` | Interface | Fim da oferta | Aceitar o pedido / Agora não | A, em jogo, `Arena_Court` | Comando |
| 06a | `MQ02.rihad.request.accept` | Blubamka | Aceite, etapa 40 | Excelente. Stonekeep fica perto de Rihad. Tenha cuidado: Golthog é astuto e maligno. Há até rumores de que seja um necromante a serviço do Underking. Quando tiver o pergaminho, volte aqui e descobrirei a localização de Fang Lair para você. | T, em jogo, `ArenaCourt.accepted[0]`, TEMPLATE #1316 | A orientar |
| 06b | `MQ02.rihad.request.route` | Interface | Stonekeep conhecida | Stonekeep é agora um destino conhecido. Viaje pela estrada ao sul da esplanada e volte à corte com o pergaminho. | A, em jogo, `ArenaCourt.accepted[1]` | Comando |
| 06c | `MQ02.rihad.request.decline` | Blubamka | Recusa, pode voltar | Lamento que não possa ajudar agora. Se mudar de ideia, volte a perguntar sobre Fang Lair. Ficarei satisfeita com outra oportunidade de recuperar o pergaminho. | T, em jogo, `ArenaCourt.decline`, TEMPLATE #1317 | Opcional |
| 06d | `MQ02.rihad.request.reoffer` | Blubamka | Retorno após recusa | É um prazer rever você. Está pronto para recuperar o pergaminho em Stonekeep? Se aceitar, direi onde fica Fang Lair. O que me diz? | T, proposta a partir de TEMPLATE #1318. O jogo reapresenta a oferta de etapa 30. | Opcional |
| 06e | `MQ02.rihad.request.pending` | Blubamka | Missão aceita, sem o pergaminho | Nosso acordo continua: recupere o pergaminho em Stonekeep e volte à corte. Siga pela estrada ao sul da esplanada para viajar. | A, em jogo, `ArenaCourt.pending` | Opcional |
| 07 | `MQ02.travel.stonekeep` | Interface | Estrada, Stonekeep conhecida | Viajar para Stonekeep / Ficar em Rihad. Saída do Map015: Retornar a Rihad ↑. | A, em jogo, `Arena_Stonekeep` | Comando |
| 08 | `MQ02.stonekeep.parchment.take` | Narrador | Interagir com a fonte, etapa 40 ou recuperação em 50 | Você encontrou o pergaminho que a corte de Rihad pode usar para descobrir a localização de Fang Lair. Volte à corte para entregar o pergaminho a Blubamka. | T+A, em jogo, `Arena_Stonekeep.collect`, TEMPLATE #1363 | A orientar |
| 08a | `MQ02.stonekeep.parchment.repeat` | Interface | Fonte com pergaminho em posse | O pergaminho já está no inventário. | A, em jogo, `Arena_Stonekeep.collect` | Comando |
| 09 | `MQ02.rihad.delivery.offer` | Blubamka | Retorno à corte com o pergaminho | Blubamka: Você trouxe o pergaminho de Stonekeep? | A, em jogo, `ArenaCourt.delivery.offer` | Opcional |
| 09a | `MQ02.rihad.delivery.missing` | Blubamka | Tentativa sem o item | Você ainda precisa trazer o pergaminho. Procure-o na ilha de Stonekeep e volte à corte. Nosso acordo permanece. | A, em jogo, `ArenaCourt.delivery.missing` (função de #1320) | Opcional |
| 09b | `MQ02.rihad.delivery.declined` | Blubamka | Adiamento da entrega | Guarde o pergaminho por enquanto. Quando quiser concluir nossa troca, volte a falar comigo. | A, em jogo, `ArenaCourt.delivery.declined` | Opcional |
| 09c | `MQ02.rihad.delivery.choice` | Interface | Confirmação com item | Entregar o pergaminho / Agora não | A, em jogo, `Arena_CourtDelivery` | Comando |
| 10.1 | `MQ02.rihad.delivery.01` | Blubamka | Entrega legítima, etapa 60 | Blubamka: Você recuperou o pergaminho! Espero que também tenha enviado Golthog para uma sepultura precoce. De todo modo, cumprirei minha parte do acordo. | T, em jogo, TEMPLATE #1319 | A orientar |
| 10.2 | `MQ02.rihad.delivery.02` | Narrador | Entrega legítima, etapa 60 | Blubamka chama um cortesão, que se curva e traz uma pena. Ela examina o pergaminho e indica a localização de Fang Lair, em Hammerfell. | T+A, em jogo, TEMPLATE #1319, descoberta no diário | A orientar |
| 10.3 | `MQ02.rihad.delivery.03` | Interface | Entrega legítima, etapa 60 | Fang Lair é agora um destino conhecido. Você pode viajar pelo portão de Rihad. | A, em jogo, `ArenaCourt.delivery.delivered[2]` | Comando |
| 10a | `MQ02.rihad.delivery.repeat` | Blubamka / interface | Etapa 60+, recibo já emitido | Nossa troca está concluída. Já lhe indiquei a localização de Fang Lair, em Hammerfell. Você pode viajar pelo portão de Rihad. | A, em jogo, `ArenaCourt.delivery.repeat` | Opcional |
| 10b | `MQ02.travel.fang` | Interface | Etapa 60 e recibo válido, portão de Rihad | Viajar para Fang Lair / Viajar para Stonekeep / Ficar em Rihad. | A, em jogo, `ArenaFangCells.offerTravel`. | Comando |
| 11 | `MQ02.fang.entry` | Narrador | Viagem autorizada, primeiro acesso pelo portal do dragão | Diante do portal do dragão de Fang Lair, a antiga fortaleza anã parece abandonada há muito. A pedra racha com o tempo. Em algum lugar dessas profundezas úmidas repousa o primeiro fragmento do Cajado do Caos. | T, em jogo, tradução condensada do PDF Fang Lair p.3. Localizar registro primário da abertura. | A orientar |
| 11a | `MQ02.fang.mine.orientation` | Narrador / placas | Percurso das minas antes das celas | As passagens escavadas pelos anões avançam por quilômetros sob a terra. Os trilhos costumam levar aos poços da mina. Poço da mina A–F. Ouvem-se arranhões e estalos nas proximidades. | T, proposta, FANG1 TEXT0 e 11–18, PDF p.3 | Opcional |
| 12 | `MQ02.fang.cells.sight` | Narrador | Primeira aproximação da sala | Você encontra uma sala com celas dos dois lados. Em cada uma parece haver uma aranha faminta. Três outras celas ficam ao sul, junto a um portal escuro. | T, em jogo, `ArenaFangCells.texts.intro`, FANG1 TEXT7 | A orientar |
| 13 | `MQ02.fang.cells.warning` | Portal | Interação em etapa 60 | Prove seu valor para prosseguir ao Subterrâneo. A resposta correta abrirá a cela da chave dourada, que abre o portal. / Não se apresse, mortal. A escolha errada abrirá as celas das aranhas... | T, em jogo, FANG1 TEXT5 | A orientar |
| 14 | `MQ02.fang.cells.riddle` | Portal / narrador | Depois do aviso | Ao se aproximar, a própria porta fala: / Ouça meu enigma, mortal, e prove que merece meu serviço. / Se a Cela 3 contém latão sem valor, a Cela 2 contém a chave dourada. / Se a Cela 1 contém a chave dourada, a Cela 3 contém latão sem valor. / Se a Cela 2 contém latão sem valor, a Cela 1 contém a chave dourada. / Sabendo que nem tudo o que foi dito pode ser verdadeiro, qual cela contém a chave dourada? / Cela 1 / Cela 2 / Cela 3 / Voltar | T+A, em jogo, FANG1 TEXT6 e 8–10. Escolha em vez de entrada livre. | A orientar |
| 14a | `MQ02.fang.cells.wrong` | Narrador | Cela 1 ou 3, mantém etapa 60 | Você ouve o rangido do metal: as portas das celas das aranhas destrancam e se abrem... | T, em jogo, FANG1 TEXT6. Quatro encontros são ativados. | Opcional |
| 14b | `MQ02.fang.cells.correct` | Portal | Cela 2, avança para 70 | Você está correto, mortal. A chave na Cela 2 é sua... | T, em jogo, FANG1 TEXT6 | Opcional |
| 15 | `MQ02.fang.cells.key` | Narrador / interface | Coletar chave, checar posse ou interagir com latão | Você encontrou a chave dourada da Cela 2. Ela abre o portal junto às celas. / A chave dourada já está no inventário. / Latão sem valor. Este objeto não é a chave dourada. | A, em jogo, `Arena_FangCells`, FANG1 TEXT1/3 | Opcional |
| 16 | `MQ02.fang.cells.portal` | Narrador / interface | Portal antes ou depois de usar a chave | A chave dourada está na Cela 2, ao sul. Pegue-a para abrir o portal. / A chave dourada abre o portal. A passagem para a escada está livre. / A escada desce às profundezas da mina. Por enquanto, a jornada termina neste patamar. Você pode retornar a Rihad. | A+P, em jogo, FANG1 LOCK 29 e `ArenaFangCells.texts` | Comando |
| 17 | `MQ02.fang.lower.riddle` | Porta do nível inferior | Interagir em MIF (64,71) | Uma pergunta simples para ti. O que não é peixe nem carne, nem pena nem osso, mas tem dedos e polegares próprios? Qual é a tua resposta, mortal? | T, proposta, FANG2 TEXT0. Respostas originais incluem glove e gauntlet. Propor luva/manopla e plurais. | A orientar |
| 17a | `MQ02.fang.lower.answer` | Porta do nível inferior | Resposta correta → acesso à sala. Erro → tentar novamente. | Tens de fato o engenho para continuar. Podes prosseguir… / Estás errado, mortal. Pensa bem antes de tentar outra resposta… | T, proposta, FANG2 TEXT0. Cancelar ou resposta vazia não abre a porta. | Opcional |
| 18 | `MQ02.fang.fragment.take` | Narrador | Primeira coleta do fragmento em MIF (64,75) | O primeiro fragmento do Cajado do Caos brilha uma vez e se apaga, revelando um pedaço de ébano opaco. Ele pulsa, como se aguardasse a união com os outros sete. | T, proposta, TEMPLATE #1371 e CHAOS1.DFA / ITEM13 | A orientar |
| 19.1 | `MQ02.fang.retaliation.01` | Jagar Tharn | Após fragmento, início da visão única no retorno | Não sei quem você é, mas cometeu um erro fatal. Ria Silmane e seus poderes frágeis não podem protegê-lo. Eu deveria ter destruído a forma dela quando tive a chance. | T, proposta, TEMPLATE #1392 e PDF p.4 | A orientar |
| 19.2 | `MQ02.fang.retaliation.02` | Jagar Tharn | Continuação da visão, antes do ataque | Usarei a mesma ponte dos sonhos para enviar meus servos através do tempo e do espaço. Eles vêm tomar o fragmento. Entregue-o e sua morte será rápida. Resista e sofrerá a ponto de implorar pelo fim. | T, proposta condensada, TEMPLATE #1392. Original varia o momento. Gatilho fixo é adaptação. | A orientar |
| 20 | `MQ02.fang.retaliation.done` | Interface / diário | Vitória sobre o servo, etapa 110 | Primeiro fragmento recuperado. A retaliação de Tharn foi superada. Retorne a Rihad. | A, proposta de objetivo conforme `MQ02_ESPECIFICACAO` | Comando |

**Diário em jogo.** Narração em primeira pessoa e objetivos abaixo são adaptações conferidas em [ArenaQuestJournal.json](../data/ArenaQuestJournal.json), ordenadas pelo gatilho de etapa. A referência original de registro inclui TEMPLATE #0524/#0525 para Stonekeep e Fang Lair. Orientação visual facultativa para o diário como conjunto, sem ilustração por linha.

| ID / ID do objetivo atual | Etapa | Narração | Objetivo → conclusão |
| --- | --- | --- | --- |
| `MQ02.journal.10` / `ria-vision` | 10 | Cheguei a Rihad após minha fuga. Posso recuperar as forças antes de prosseguir. | Fortalecer-me e repousar no local autorizado de Rihad. → Ouvi a visão de Ria sobre os oito fragmentos. |
| `MQ02.journal.20` / `ask-rihad` | 20 | Ria explicou que o Cajado do Caos foi dividido em oito fragmentos. O primeiro está em Fang Lair, mas ela não sabe a localização exata. | Procurar informações sobre Fang Lair em Rihad. → Recebi orientação para procurar a corte. |
| `MQ02.journal.30` / `reach-court` | 30 | Um morador indicou a corte de Rihad, junto à muralha, para buscar notícias de Fang Lair. | Falar com Blubamka e decidir sobre o pedido do pergaminho. → Pedido de Blubamka aceito; Stonekeep conhecida. |
| `MQ02.journal.40` / `recover-parchment` | 40 | A rainha Blubamka pediu que eu recupere o pergaminho roubado pelos goblins em Stonekeep. Ele permitirá decifrar a localização de Fang Lair. Posso viajar pela estrada de Rihad. | Recuperar o pergaminho na ilha de Stonekeep. → Pergaminho recuperado. |
| `MQ02.journal.50` / `return-parchment` | 50 | Encontrei o pergaminho na ilha de Stonekeep. Devo voltar à corte de Rihad para entregá-lo a Blubamka. | Entregar o pergaminho a Blubamka na corte de Rihad. → Pergaminho entregue à corte. |
| `MQ02.journal.60` / `reach-fang-lair` | 60 | Entreguei o pergaminho a Blubamka. Ela cumpriu o acordo e indicou a localização de Fang Lair, em Hammerfell. Posso viajar pelo portão de Rihad. | Explorar Fang Lair e resolver o enigma das celas. → Enigma resolvido; Cela 2 aberta. |
| `MQ02.journal.70` / `fang-gold-key` | 70 | Resolvi o enigma do portal. A chave dourada está na Cela 2; ela abre a passagem junto às celas. | Obter a chave dourada da Cela 2 e abrir o portal. → Portal aberto com a chave dourada. |
| `MQ02.journal.80` / `fang-lower-route` | 80 | Usei a chave dourada e abri o portal. A passagem até a escada está livre. | Chegar à escada no fim da passagem. → Alcancei a passagem do nível inferior. |

Os avisos de limite da amostra, falhas de consistência e instruções RAM ficam separados das falas originais. Na primeira visão, o texto em jogo de `MQ02.ria.03` ainda diz “Staff” uma vez. Aplicar “Cajado do Caos” em revisão editorial futura, mantendo o texto aprovado como referência até lá. A mensagem de falha de consistência da corte fica na camada técnica. Stonekeep tem inscrições e narração ambiental no PDF pp.2–3 (cheiro da ruína, aposentos abandonados, sinais do último grupo da corte) e Fang Lair tem o aviso do templo em FANG1 TEXT19. São eventos ambientais opcionais, sem implicar novas etapas ou transcrição integral neste recorte.

**Apresentação.** Usar o paginador `MVNarrativePages` e o cursor existente em sequências longas. `picture` opcional por bloco. Sem imagem, recolher o quadro de arte, centralizar a coluna de leitura e ampliar sua altura até os controles. Limitar largura de linha e preservar margens, navegação e foco por teclado, mouse e toque. Evitar passagem de texto curto de ação para uma cena inteira. Escolhas de aceitar, entregar e responder continuam explícitas e canceláveis, mantendo seus gatilhos e recibos. Conferir quebra de linha, glifos, retomada por ID/cursor e ausência de cliques vazados antes de trocar a apresentação atual. Antes de produzir arte, apresentar os blocos na ordem, esperar orientação visual para o bloco escolhido e produzir **uma ilustração por vez**. [Diretiva de arte](DIRECAO_DE_ARTE.md)

### M01 e M03–M10 — índice de momentos

M01 mantém a introdução `I01–I05` (narrador na criação), blocos `R01–R09` de Ria no primeiro sonho e `F01` ao alcançar o Shift Gate. IDs de páginas ativos e texto integral em `data/ArenaNarrative.json`. O primeiro sonho vem de TEMPLATE #1400, a introdução do material original inventariado em NARRATIVA_M01_18 e o encerramento é texto de versão. As interações da chave rubi, porta, plataforma e Gate estão em [MQ01](MQ01_ESPECIFICACAO.md) e no registro do M01. A orientação visual das páginas existentes está aprovada em sua cobertura registrada.

Nos demais marcos, cada ID abaixo nomeia um bloco futuro em ordem. Texto detalhado dos guias, personagens intermediários, chaves e enigmas precisam de transcrição e revisão por marco. As fontes por quest estão na seção anterior. Orientação visual de todos os blocos futuros permanece a receber.

| Marco | Momentos em ordem e gatilho | Fontes de texto já localizadas |
| --- | --- | --- |
| M03 | `MQ03.ria` Ria no repouso, `MQ03.offer` Guilda dos Magos em Winterhold, `MQ03.item` tabuleta na Fortress of Ice, `MQ03.delivery` devolução e localização, `MQ03.lab.keys` provas/chaves de Mogrus e Kanen na exploração, `MQ03.fragment` coleta do segundo fragmento | PDF Labyrinthian, TEMPLATE #1295 e #1372 |
| M04 | `MQ04.ria` Ria no repouso, `MQ04.offer` audiência com Ulandra, `MQ04.item` gema de Selene’s Web, `MQ04.delivery` devolução e Elden Grove, `MQ04.fragment` coleta do terceiro fragmento | PDF Elden Grove, TEMPLATE #1296 e #1373 |
| M05 | `MQ05.ria` Ria no repouso, `MQ05.offer` Guilda dos Magos em Corinth, `MQ05.item` tabuleta do Temple of Agamanus, `MQ05.delivery` devolução e localização, `MQ05.fragment` coleta do quarto fragmento | PDF Halls of Colossus, TEMPLATE #1297 e #1374 |
| M06 | `MQ06.ria` Ria no repouso, `MQ06.offer` Guilda dos Magos em Lillandril, `MQ06.item` diamante do Temple of Mad God, `MQ06.delivery` devolução e torre, `MQ06.fragment` coleta do quinto fragmento | PDF Crystal Tower, TEMPLATE #1298 e #1375 |
| M07 | `MQ07.ria` Ria no repouso, `MQ07.offer` Brotherhood of Seth, `MQ07.item` mapa das Mines of Khuras, `MQ07.delivery` decifração e localização, `MQ07.fragment` coleta do sexto fragmento, `MQ07.retaliation` ataque posterior de Tharn | PDF Crypt of Hearts, TEMPLATE #1299 e #1376, variante exata da fala de Tharn a conferir |
| M08 | `MQ08.ria` Ria no repouso, `MQ08.offer` Conclave of Baal, `MQ08.item` tabuleta dos Vaults of Gemin, `MQ08.delivery` devolução e Murkwood, `MQ08.fragment` coleta do sétimo fragmento | PDF Murkwood, TEMPLATE #1300 e #1377 |
| M09 | `MQ09.ria` Ria no repouso, `MQ09.offer` audiência com Casik em Ebonheart, `MQ09.item` Hammer of Gharen no Black Gate, `MQ09.delivery` troca e entrada de Dagoth-Ur, `MQ09.fragment` último fragmento, `MQ09.retaliation` emboscada após a recuperação | PDF Dagoth-Ur, TEMPLATE #1301 e #1378, variante da ameaça a confirmar |
| M10 | `MQ10.ria` orientação sobre o Cajado reunido, `MQ10.palace.entry` entrada no palácio, `MQ10.jewel` interação com o Jewel of Fire, `MQ10.ending` libertação e restauração do Imperador | PDF The Imperial Palace, TEMPLATE #1302, fontes de cena e desfecho a conferir |

## Recorte e limites

As cidades e dungeons listadas exigem estrutura completa conforme o [escopo vigente](MARCOS_DO_PROJETO.md#escopo-mínimo-funcional-vigente--decisão-de02112026). Eventos/população/serviços opcionais não se tornam obrigatórios; preservar edifícios/acessos urbanos mesmo com interiores sem função na campanha ainda inacessíveis. A viagem condensada até Rihad já está autorizada em MQ02_ESPECIFICACAO.md; não justifica reduzir a cidade.

O primeiro marco termina na introdução e dungeon inicial. Cidades e demais quests entram em entregas posteriores. Os identificadores MQxx são propostos para planejamento; não são IDs já implantados no banco de dados.
