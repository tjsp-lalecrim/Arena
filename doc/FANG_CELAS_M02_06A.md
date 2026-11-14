# Fang Lair — amostra funcional das celas (M02-06A)

02/11/2026. Feature `feature/m02-fang-lair-celas`, dependências preservadas sobre **f27e9a9**. Núcleo de enigma/chave/portal implementado, **aguardando avaliação da amostra**. O encontro condicionado das aranhas ainda não está implementado; portanto M02-06A não está integralmente concluído. Testes manuais dos grupos de Stonekeep continuam adiados para integração; REF17/contraste continua em QUALIDADE-01.

## Tesouros das alas secas — primeiro nível

A leitura dos dois `LEVL` de `42068779.MIF` e dos flats de FANG1/FANG2.INF confirma os montes `TREASRE2.IMG / ITEM5` e `TREASRE3.IMG / ITEM6`. A matriz registra separadamente o baú `CHESTC.IMG / ITEM7` do segundo nível. Objetos `EQUIPMEN.IMG / ITEM3` e `DEADBODY.IMG / ITEM2` ficam fora desta contagem de montes e baú. [Matriz](mapas/FANG_COBERTURA_M02.json)

| Andar | Integrados | Pendentes |
| --- | --- | --- |
| Primeiro | 6 de 13 montes. Dois novos `TREASRE2` em MIF (13,21) → MV (261,66) e (57,19) → (129,60), mais os quatro das celas LOCK 15 | Sete montes em alas cuja ligação ainda precisa ser confirmada. Posições na matriz |
| Segundo | 0 de 6 fontes | Cinco montes e um baú na ilha dos ghouls. A travessia de lava é uma dependência comum e o baú ainda requer conferir seu componente |

Os dois montes novos ficam em pisos secos acessíveis pelo percurso normal, antes do portal. Reutilizam o sprite, a tabela de tesouros e a reserva de 2–8 moedas. Cada posição tem um ID persistente. O recibo controla a ocultação e impede uma segunda concessão. Saves de Map013 anteriores recebem os eventos mantendo posição, direção, portas, inventário e recibos.

**Roteiro combinado.** Depois de chegar a Fang Lair pelo portão de Rihad, siga os ramais secos do primeiro nível até os montes em (261,66) e (129,60) na grade MV. Interaja para recolher cada um. Continue para o [teste das celas](#celas-opcionais-de-tesouro--primeiro-nível). Salve, carregue e, ao sair e voltar de Rihad, confira que os montes coletados continuam ausentes. [Arena local](http://127.0.0.1:8774/) · [Evidências](evidencias/m02-fang-tesouros-secos/resultado.json)

## Celas opcionais de tesouro — primeiro nível

O primeiro `LEVL` de `42068779.MIF` registra as duas portas com MAP1 `0xB016` e `LOCK 15`. As chaves das Celas 1 e 3 aparecem como `KEY.IMG` em (91,98) e (97,98), com `TRIG TEXT3`. Em `FANG1.INF TEXT3`, `+15` corresponde a essas fechaduras. A chave dourada em (94,98) usa `TEXT1 +29` e o portal usa `LOCK 29`. O guia local (*Fang Lair*, PDF p.4) descreve liberar as celas das chaves pelas opções erradas e usar as chaves nos compartimentos de tesouro. [Matriz de cobertura](mapas/FANG_COBERTURA_M02.json)

| Porta MIF | Tesouros MIF e flats |
| --- | --- |
| (91,78) | (89,77) `TREASRE3.IMG / ITEM6` e (90,79) `TREASRE2.IMG / ITEM5` |
| (95,78) | (96,77) `TREASRE2.IMG / ITEM5` e (97,79) `TREASRE3.IMG / ITEM6` |

A adaptação usa as celas erradas já liberadas pelo fluxo existente de MQ02. As duas fontes concedem o mesmo item de latão, uma unidade por fonte. Qualquer uma abre qualquer fechadura 15 e consome uma unidade. O fluxo normal da chave dourada continua separado. A entrada de cada compartimento usa a face voltada ao corredor, e a folha reutiliza o sprite existente. A geometria reabre as 14 células da planta, incluindo os dois vãos. As portas e a coleta das chaves usam self-switches individuais. Os quatro tesouros usam recibos de loot independentes, a tabela já usada pelos tesouros da campanha e a reserva de 2–8 moedas. Essa tabela é uma adaptação do projeto. Saves de Map013 anteriores recarregam os eventos novos na mesma posição.

**Roteiro.** No corredor antes da sala das aranhas, tente abrir uma cela de tesouro. A porta deve pedir latão. No enigma principal, escolha **Cela 1** ou **Cela 3**, vá às extremidades da sala ao sul e recolha as chaves. Volte às portas de tesouro, abra uma com cada chave e recolha os dois montes em cada sala. Salve e carregue. As portas continuam abertas e os montes recolhidos ficam ausentes. Em seguida, resolva o enigma com **Cela 2** e prossiga normalmente. [Arena local](http://127.0.0.1:8774/) · [Evidências automatizadas](evidencias/m02-fang-celas-tesouro/resultado.json)

## Ilha dos ghouls — verificação da travessia de lava

O guia local de Fang Lair (PDF p.5, *Notes* e planta do segundo nível) descreve a ida e a volta por um longo trecho de lava usando **uma poção de resistência ao fogo para cada sentido**. Como alternativa, descreve abrir um túnel com **Passwall**. O guia confirma a travessia no original, mas não indica as células exatas ou uma passagem específica sob a parede. A leitura abaixo usa o segundo `LEVL` de `42068779.MIF`, com o SHA-256 já registrado, e `FANG2.INF` no `GLOBAL.BSA` (`*LAVACHASM MLAVA.IMG`). [Matriz e coordenadas](mapas/FANG_COBERTURA_M02.json)

| Trecho | Evidência em coordenadas MIF |
| --- | --- |
| Margem da rota atual | (72,58) é piso seco e (72,57) é lava aberta, `FLOR 0x0E00` com MAP1 vazio. |
| Separação | A lava de (72,56), X72–86/Y55 e (86,56) coincide com MAP1 de parede sólida. A rota cardinal via FLOR de lava só conecta os lados se ignorar pelo menos 17 dessas células com parede. |
| Margem da ilha e retorno | X84–88/Y57–58 é lava aberta. Ao sul há uma sala seca de 5×5 (X84–88/Y59–63). Os ghouls ficam em (84,61) e (87,61), MAP1 `0x8038` → `GHOUL.DFA / ITEM41`. A região seca e sua margem não se conectam à rota principal com a colisão atual em nenhum sentido. |

A verificação cardinal no plano encontrou dois componentes separados, com 200 células de lava aberta do lado da campanha e dez do lado dos ghouls. Esse resultado é uma leitura das camadas e da grade, sem observação da travessia no executável. Uma adaptação precisaria primeiro localizar a passagem legítima e definir como representar sua folga, ou tratar Passwall como mecânica própria. A natação atual é de água e o piso de dano nativo não oferece resistência ao fogo na travessia. Abrir o trecho como água ou piso comum removeria o risco documentado.

O Map017 e os saves permanecem iguais. A cobertura segue em **15/19** no segundo nível. As celas de tesouro LOCK 15 do primeiro nível foram integradas separadamente, conforme o registro acima.

## Conexões do primeiro nível — revisão de 14/11/2026

A revisão cruza MAP1 e FLOR de `42068779.MIF`, `FANG1.INF`, a planta publicada no guia local de Fang Lair (PDF p.5) e a descrição de salto do `Manual.pdf` instalado (PDF p.4). O layout do Map013 preserva dimensões, projeção, IDs e a rota anterior. [Matriz de passagens](mapas/FANG_COBERTURA_M02.json)

- **138 cantos transitáveis.** A orientação MAP1 `0xD0xx/0xD1xx` e as duas faces secas adjacentes determinam a passagem. Cada canto foi adaptado como um cotovelo 3×3 com dois lados livres. O eixo X continua espelhado. Sem acesso pela face sólida, sem liberar cantos isolados ou vizinhos de uma fechadura.
- **Patamar junto à entrada.** As duas ligações MIF (4,6) e (4,13) são vãos de uma célula com MAP1 vazio, FLOR `0x0C00` e piso seco nas duas extremidades. O original permite salto; nesta projeção, apenas esses dois vãos foram representados como passagens locais com o piso de transição existente. O restante do poço fica fechado. Isso torna acessível o patamar seco de 16 células entre Y7–12. A travessia exata no executável não foi testada. No [Arena local](http://127.0.0.1:8774/), entre em Fang Lair e siga ao sul pela coluna de chegada até o primeiro vão. No patamar, contorne a reentrância pelo centro para alcançar o segundo vão e volte pela rota externa.
- **Desníveis e alas pendentes.** Os blocos da praça nordeste `0x2065/0x4065/0x5865` têm diferenças de espessura confirmadas na tabela do executável, e os volumes `0x7021/0x7026` abrangem a borda da planta. A matriz mantém as paredes sólidas que cortam as rotas candidatas, incluindo o corredor sob suspeita em (82,57)–(82,59). A presença de FLOR de poço nessas células não demonstra passagem sob a parede. A ligação local (3,62) continuaria isolada da campanha. A matriz identifica os candidatos e obstruções para as seis áreas com encontros pendentes.

A cobertura do primeiro nível passa de 2.196 a **2.352 células MIF com piso transitável parcial ou integral**. O patamar não contém encontros confirmados. A cobertura de encontros permanece em **40/76** no primeiro nível e **15/19** no segundo. O Fantasma, os Hell Hounds e a travessia de lava permanecem dependências separadas. O segundo nível manteve a geometria e os eventos.

**Verificação.** O teste integrado percorre as duas travessias em ambos os sentidos, verifica as faces dos 138 cantos, recarrega um save no Map013 e repete a rota de MQ02 até Rihad. [Evidências](evidencias/m02-fang-conexoes/resultado.json)

## Alas secas dos dois níveis — M02-06B e M02-07B

A [matriz de cobertura](mapas/FANG_COBERTURA_M02.json) vincula as 95 posições originais a andar, coordenadas MIF de base zero, flat, espécie, estado e dependência. As áreas excluídas estão delimitadas nela. A leitura de MAP1/FLOR dos dois pisos de `42068779.MIF` foi cruzada com FANG1/FANG2.INF e com as âncoras anteriores. Abrimos somente os pisos secos ligados cardinalmente ao percurso, incluindo o suporte atravessável MAP1 `0x91xx` como passagem provisória. Paredes diagonais, desníveis sem equivalência confirmada e FLOR 12/13/14 de poço/água/lava ficaram fora das novas ligações. Os tiles existentes continuam provisórios.

| Andar | Geometria disponível | Encontros originais ativos | Pendentes |
| --- | --- | ---: | --- |
| Map013 | 304×301 tiles, 2.196 células MIF projetadas. Ramais da entrada e túneis centrais, corredores de acesso às celas. Coordenadas MV anteriores preservadas | 40/76; 36 novos, 4 aranhas condicionadas já existentes | 36 incluindo Fantasma (3,49), câmara junto ao poço seco. Outras bolsas e ligações nos quadrantes das aranhas do nordeste, leste, oeste sul, centro sul e salas sul |
| Map017 | 124×142 tiles, 665 células MIF projetadas. Corredores secos centrais, oeste e sul conectados à escada e à aproximação do enigma | 15/19; 14 novos, 1 esqueleto já existente | Hell Hounds (63,74)/(65,74) na sala do fragmento; 2 ghouls (84,61)/(87,61) na ilha cuja travessia por lava ainda falta |

Os novos encontros usam os perfis, inimigos e tabelas de recompensa existentes, com IDs individuais. IDs das quatro aranhas, do primeiro esqueleto, dos itens, recibos e etapas foram mantidos. O Servo de Tharn é um encontro narrativo separado dos 95. O Map017 ampliado desloca a projeção anterior em (+9,+51); saves no recorte antigo são convertidos pelo ponto da escada, preservando posição relativa, direção e derrotas. No entorno da sala, três células (66,74–76) foram restauradas conforme o muro do MAP1, retirando a adaptação antiga que, junto ao piso novo, permitiria contornar a porta do enigma. Saves sobre essas três células retomam no corredor seco adjacente.

As duas celas de tesouro LOCK 15 no primeiro nível já estão integradas. No segundo, os dez LOCK 10 registrados sobre MAP1 de parede são mantidos na matriz sem abrir vãos por suposição; só a porta confirmada do enigma está ativa. Permanecem pendentes a travessia de poços/desníveis e lava, materiais de mina, ferragens/objetos, arte definitiva das duas espécies e outros elementos opcionais da planta.

**Avaliação no Chrome pelo fluxo normal.** A partir da entrada, explore o ramal seco que leva ao ghoul em MIF (24,2), MV (228,9). Após descer as celas, explore o corredor seco até o esqueleto em MIF (55,90), MV (114,114). Salve após uma vitória e confira que o encontro fica ausente ao carregar. A avaliação manual do percurso principal pode ocorrer em paralelo pelo roteiro abaixo. [Arena local](http://127.0.0.1:8774/) · [Teste integrado](evidencias/m02-fang-alas/resultado.json)

## Retaliação de Jagar Tharn — M02-08

No original, após a coleta do fragmento, a visão pode ocorrer onde um encontro aleatório seria possível. O guia local de Fang Lair descreve o ataque de um servo após a visão (pp.4–5). O `TEMPLATE.DAT #1392` da instalação confirma a fala, a ponte dos sonhos, a ameaça de tomar a peça e a chegada dos servos. A espécie e a regra de seleção do atacante não foram confirmadas. [Inventário textual](CAMPANHA_PRINCIPAL.md#inventário-textual)

Na campanha, **Saída da mina** (Map013, MV 288,9) dispara a visão na etapa 100 com o fragmento no inventário. Os blocos `MQ02.fang.retaliation.01` e `MQ02.fang.retaliation.02` usam a janela em largura integral. Ao fechar o último bloco, o jogo registra `fangTharnVisionRead` e inicia a batalha. Um save anterior com essa leitura já registrada entra diretamente no combate ao interagir com a saída. Se faltar a peça, o jogador pode voltar à fonte no segundo nível.

O **Servo de Tharn** usa o esqueleto existente (Enemy 4, Troop 5) como adaptação provisória. O visual de morto-vivo combina com a ameaça de Tharn e reaproveita o exemplar já presente nas profundezas de Fang Lair. O nome é exclusivo da instância desta batalha. Mantém os parâmetros do esqueleto de campanha, com **50 EXP e sem sorteio de ouro ou itens**. A arte definitiva e a orientação visual dos blocos ficam para outra entrega.

A derrota segue para Game Over. Uma vitória legítima registra `fangRetaliationWon`, conclui MQ02 na etapa 110 e atualiza o diário. O fragmento permanece no inventário. Ao voltar ao mapa, uma nova interação com a saída leva a Rihad. É possível voltar à mina após a conclusão e sair novamente sem repetir visão, batalha ou recompensas. Nenhuma quest seguinte é iniciada.

### Roteiro no Chrome a partir de um save com o fragmento

1. Carregue um save com o primeiro fragmento e volte à **Saída da mina**, no primeiro nível. Se a partida estiver em Rihad, viaje para Fang Lair pelo portão. [Arena local](http://127.0.0.1:8774/)
2. Interaja com a saída. Feche o último bloco da visão para entrar na batalha contra **Servo de Tharn**. Se a visão já tinha sido lida no save, a batalha começa diretamente.
3. Vença, confira a missão concluída no **Diário** e o fragmento no **Inventário**. Salve, recarregue e interaja com a saída. A volta a Rihad deve ocorrer sem nova batalha. Para conferir derrota em separado, use o save anterior à vitória.

A rota principal de MQ02 está completa. Ainda faltam alas e encontros aplicáveis dos dois níveis, incluindo os dois Hell Hounds na sala do fragmento, e a arte definitiva. Avaliação manual pendente. [Evidências](evidencias/m02-fang-tharn-encontro/resultado.json)

## Sala e primeiro fragmento — M02-07B, trecho de campanha

A porta do enigma abre o acesso à sala no Map017. O percurso mantém a escala e a transformação existentes: MV (78,9) é a porta MIF (64,72); MV (78,12) é o vestíbulo MIF (64,73); MV (78,18) é o fragmento MIF (64,75). O vestíbulo de uma célula e o salão de 3×3 seguem a planta do segundo `LEVL` de `42068779.MIF`. O contorno usa `MAP1` (parede perimetral `0x70B7` e ombreiras `0x3131/0x3030`) e mantém o retorno pela mesma porta. As superfícies existentes e o marcador textual do fragmento são provisórios. [Planta e âncoras](mapas/FANG_NIVEL2_M02.json)

| Evidência local | Consequência no recorte |
| --- | --- |
| `FANG2.INF`, `MAP1 0x8066` em (64,75), flat102 `CHAOS1.DFA / ITEM13` | Fonte estável `fang.staff-piece-1`, item importante 9 do projeto, sem venda, descarte ou uso |
| `MAP1 0x8039` em (63,74) e (65,74), flat57 `HELLHOUN.DFA / ITEM42` | Posições originais em MV (81,15) e (75,15). São encontros da sala. O guia descreve formas de evitar o ataque; o corredor central e o fragmento são registros independentes. A única `LOCK` da sala é a da porta e o `TRIG 64,73,255,28` fica no vestíbulo. A função exata desse gatilho não foi verificada no executável. Ambos os encontros seguem pendentes de combate e patrulha da espécie |
| `TEMPLATE.DAT #1371`, arquivo da instalação original, e guia local de Fang Lair, p.4 | A coleta usa o bloco PT-BR `MQ02.fang.fragment.take`, em largura integral, com a ilustração pendente. A referência tátil do original foi condensada na pulsação do fragmento |

A coleta registra o item e a passagem 90 → 100 em conjunto. O diário marca o fragmento como obtido e indica a saída. A missão segue em andamento até a vitória contra o Servo de Tharn. Se faltar a peça na etapa 100, a mesma fonte repõe apenas a unidade ausente, sem repetir a narração ou avançar a missão. Um save anterior do Map017 carrega a nova lista de eventos mantendo posição, direção e estados individuais.

**Ponto seguro de retomada.** Após coletar, suba e salve no patamar do primeiro nível (Map013, MV 36,296). A visão de Tharn intercepta a saída da mina com a peça em posse. A batalha começa ao fechar o último bloco. Se o save já estiver em Rihad, volte à mina para testar o gatilho.

### Continuação do roteiro no Chrome

1. Continue do segundo enigma pelo roteiro abaixo. Atravesse a porta após escolher **Uma luva ou manopla** e siga pelo vestíbulo até **Primeiro fragmento · Interagir**.
2. Interaja, leia a mensagem e confira em **Inventário** e **Diário** que há um fragmento e que a missão segue pendente na saída. Interaja de novo, salve, recarregue e confira que a quantidade continua sendo um.
3. Volte pela porta e suba a escada. Guarde o teste no patamar para retomar a campanha no próximo recorte.

Validação focal no Chrome em origem e perfil descartáveis. Foram conferidos o mapa serializado da versão anterior, a coleta e leitura sem imagem, o diário, salvar/carregar antes e depois, a recuperação sem nova narração e o retorno pela escada até Rihad. Avaliação manual pendente. [Evidências](evidencias/m02-fang-fragmento/resultado.json)

## Segundo nível até o enigma — M02-07A (histórico)

Após abrir o primeiro portal, interaja com a escada para descer ao Map017. O recibo da chave autoriza a travessia. A escada inversa retorna ao patamar do Map013. A porta inferior abre na etapa 90 e permite prosseguir à sala do fragmento.

A planta usa o segundo `LEVL` de `42068779.MIF` e `FANG2.INF`. A textura `MSU.IMG` identifica a escada de retorno em MIF (88,98). O gatilho `TRIG 64,71,0,18` referencia TEXT0. O `LOCK 64,72,255` e a célula MAP1 `0xB013` identificam a porta. A rota selecionada percorre 51 células, contando as extremidades (88,97) e (64,71). [Planta e âncoras](mapas/FANG_NIVEL2_M02.json)

O recorte espelha X e usa escala 3, margem 2 e tiles provisórios. As células registradas como `adaptedBoxes` representam volumes do MAP1 convertidos em piso caminhável na grade, incluindo a aproximação seca da porta. Lava, alas adjacentes e a sala além do batente ficaram fora do recorte. O esqueleto na posição original (86,75), `SKELETON.DFA / ITEM38`, usa patrulha, batalha e recompensas existentes. O enigma depende da resposta, sem condição de derrotar o encontro.

A janela paginada usa toda a largura de leitura. As respostas do original em torno de `glove` e `gauntlet` correspondem a **Uma luva ou manopla**. As outras alternativas são adaptações para o seletor nativo. Erro e cancelamento preservam etapa 80. O acerto registra `fangLowerExplored` e avança para 90. A etapa e o objetivo persistido determinam a colisão e a aparência da porta após carregar ou retornar. O diário aponta para o fragmento.

### Roteiro único no Chrome

1. Após entregar o pergaminho a Blubamka, vá ao portão de Rihad e escolha **Viajar para Fang Lair**. Siga até as celas. Se for testar as aranhas na mesma sessão, escolha **Cela 1** ou **Cela 3** e confira que uma derrota é preservada ao salvar e carregar. Resolva o enigma com **Cela 2**, recolha a chave dourada e use-a no primeiro portal. [Arena local](http://127.0.0.1:8774/)
2. Desça a escada. Suba logo em seguida para conferir o retorno ao patamar e desça novamente. Siga até a porta do segundo enigma.
3. Escolha uma resposta incorreta, depois tente novamente e cancele. A porta deve continuar fechada nas duas tentativas. Escolha **Uma luva ou manopla**, salve em outro slot e recarregue. A porta deve permanecer aberta e o diário deve apontar para o fragmento. Depois do batente, siga o roteiro da sala acima.

Sete grupos passaram em Chrome isolado, incluindo a rota anterior das celas, a descida e subida, o esqueleto, erro, cancelamento, acerto, save e reentrada com a porta aberta. A vitória amostral e a caminhada foram aceleradas no teste. [Evidências](evidencias/m02-fang-segundo-enigma/resultado.json).

Cobertura deste recorte histórico: entrada, corredor, celas, quatro aranhas condicionadas e escada no primeiro nível; caminho seco, esqueleto e porta no segundo. A seção M02-07B acima registra a cobertura atual e o que ainda falta.

## Histórico do primeiro trecho

## Entrada e celas na campanha — M02-06B, primeiro trecho

Após a entrega do pergaminho, o portão de Rihad oferece **Viajar para Fang Lair**, **Viajar para Stonekeep** e **Ficar em Rihad**. Fang Lair exige a etapa 60 ou posterior e o recibo íntegro da entrega. A volta à cidade usa a entrada da mina. Map013 conserva o ID da amostra e leva até o patamar da escada. MQ02 permanece em andamento.

### Planta e adaptações

A entrada usa a posição inicial MIF (4,2), derivada do cabeçalho em unidades de 64. A descrição fica em (4,3), posição de TRIG para FANG1 TEXT0. A rota usa MAP1/FLOR de `42068779.MIF`, primeiro nível, e a planta do PDF de Fang Lair p.5. Ela segue corredores secos selecionados até MIF (93,80), onde encontra a planta das celas de `af17b4b`. A transformação é MV `(3 + 3 × (99 − X), 3 + 3 × Y)`. A entrada fica em (288,9), o enigma em (36,288), a chave em (18,297) e o patamar em (36,297).

A leitura de pisos e paredes não conecta sozinha os dois extremos. Quatro ligações curtas unem trechos adjacentes na adaptação ortogonal, sem alegar que sejam passagens abertas no original. As sete células modificadas estão registradas com valores MAP1 em [FANG_ENTRADA_M02.json](mapas/FANG_ENTRADA_M02.json). As ligações passam pelas faixas MIF (24,25), (44–45,51), (62,43) e (69–71,67). A rota evita poços, outras alas e a implementação de escalada. A reconstrução usa as duas plantas versionadas e os tiles provisórios já disponíveis.

### Enigma, aranhas e saves

O erro ativa quatro encontros já posicionados em FANG1 nas celas do trecho. Os dados associam o flat 55 a `SPIDER.DFA / ITEM40`, o mesmo vínculo da aranha de Stonekeep. Reuso de patrulha, batalha e recompensas provisórias. As aranhas permanecem nas posições iniciais até o erro e suas derrotas são persistidas separadamente. A etapa 60 continua ativa e permite tentar novamente. O acerto abre a Cela 2. A chave importante pode ser recuperada enquanto necessária, e abrir o portal a consome uma vez, com recibo e avanço para 80.

As falas usam os blocos do [inventário textual](CAMPANHA_PRINCIPAL.md#inventário-textual). A chegada e a descrição das celas aparecem em mensagens paginadas de largura total. O mapa antigo da amostra, quando encontrado em um save, é reconstruído e retoma na entrada da mina, mantendo objetivos, derrotas, chave e recibos.

### Roteiro único no Chrome

1. Entregue o pergaminho a Blubamka e volte ao portão urbano. Escolha **Viajar para Fang Lair**. Passe pelo portal da entrada e siga o corredor até as celas. [Arena local](http://127.0.0.1:8774/)
2. Leia o enigma e escolha **Cela 1** ou **Cela 3** para liberar as quatro aranhas. Derrote uma se quiser conferir a persistência. Salve em outro slot e carregue. As celas liberadas devem continuar abertas e a aranha derrotada deve continuar ausente.
3. Responda **Cela 2**, pegue a chave dourada e volte ao portal. A abertura consome a chave uma vez. Siga ao patamar e interaja com a escada. Para conferir o retorno, volte pelo mesmo corredor e interaja na entrada para regressar a Rihad.

Cinco grupos passaram em Chrome 157 com perfil e slots descartáveis. O teste usou a entrega real a partir de uma fixture com pergaminho e acelerou apenas a caminhada e uma vitória. Cobriu cancelamento, travessia, combate, saves antes e depois da abertura, retorno e retomada de um Map013 da amostra. A reconstrução também passou. [Resultado automatizado](evidencias/m02-fang-campanha/resultado.json).

O teste manual continua pendente. Para completar Fang Lair, faltam os demais setores, conexões e encontros do primeiro nível, arte definitiva, segundo nível, segundo enigma, fragmento e retaliação. Fantasma e hell hound ainda precisam de combate e patrulha. O servo de Tharn segue sem identificação.

## Inventário de criaturas e materiais do M02

Leitura direta de `42068779.MIF`: **dois níveis de 100×100**, vinculados a FANG1/FANG2 do GLOBAL.BSA. SHA-256 da fonte MIF `582f039f79a5c428d94a838a8c8ffc0124b35c742dacd41d911d6400e16b02e7`. Contagem pelo MAP1, nibble alto 8 e índice do flat, resolvido no `@FLATS` com `*ITEM`. Um registro de posição não equivale a um turno, grupo ou encontro aleatório. Os arquivos declaram outros monstros que não aparecem colocados. Usar [mapeamento de criaturas](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/Entities/ArenaAnimUtils.cpp) apenas como referência técnica, verificando o vínculo original de cada flat.

| Espécie | FANG1 | FANG2 | Total de posições | Combate | Patrulha |
| --- | ---: | ---: | ---: | --- | --- |
| Orc | 9 | 0 | 9 | Reuso | Reuso |
| Esqueleto | 14 | 11 | 25 | Reuso | Reuso |
| Minotauro, alias OGRE.DFA / ITEM39 | 19 | 0 | 19 | Reuso | Reuso |
| Aranha, SPIDER.DFA / ITEM40 | 24 | 0 | 24 | Reuso aprovado com ressalva | Reuso |
| Ghoul | 9 | 2 | 11 | Reuso | Reuso |
| Homem-lagarto | 0 | 4 | 4 | Reuso | Reuso |
| Fantasma, GHOST.DFA / ITEM43, MIF (3,49) | 1 | 0 | 1 | **Novo** | **Nova** |
| Hell hound, HELLHOUN.DFA / ITEM42, MIF (63,74)/(65,74) | 0 | 2 | 2 | **Novo** | **Nova** |
| **Total** | **76** | **19** | **95** | **2 espécies pendentes** | **2 espécies pendentes** |

O fragmento em MIF (64,75) resolve `CHAOS1.DFA` / ITEM13 e fica fora da contagem de criaturas. A aranha das celas foi identificada como a mesma espécie de Stonekeep pela combinação **SPIDER.DFA + ITEM40**. Quatro das 24 posições ficam nas celas condicionadas e usam encontros persistentes. A tabela acima registra a situação dos demais encontros. A matriz de Stonekeep tem 9 espécies com ambos os conjuntos disponíveis. O M02 soma **11 espécies distintas confirmadas** até aqui, das quais **2 precisam de combate e patrulha**, **0 só de combate** e **0 só de patrulha**. Os arredores adaptados de Rihad reaproveitam o rato. [Levantamento urbano](CHEGADA_RIHAD_M02_03A.md#m02-03e1--planta-reconstruída-e-inventário-visual).

O servo de Tharn fica **fora da contagem** até identificar a espécie ou regra de seleção. O relato da wiki e TEMPLATE #1392 estabelecem a retaliação, sem associá-la ao fantasma, aos hell hounds ou a uma criatura específica. Registrar também o possível comportamento de fogo dos hell hounds como dependência de design, sem decidir regras de combate neste inventário.

### Famílias visuais de Fang Lair

| Família | Referência original | Decisão frente aos atlas existentes |
| --- | --- | --- |
| 1. Pisos de mina | MFLOORA/MFLOORD, MFLOORB, FLOOR_C | **Nova**. Pisos imperiais e de Stonekeep servem somente na montagem provisória |
| 2. Paredes, cortes e tetos | MINEA–F, variantes MINEA1–C1 | **Nova**. Reusar módulos técnicos, margens e regras de colisão de Stonekeep, preservando a identidade da mina |
| 3. Portas, celas e dragon gate | MDOOR1–6, MCELL, entrada descrita no PDF p.3 | **Mista**. Reusar componentes de portas e da amostra. Silhueta da entrada e ferragens da mina pedem arte correspondente, com localização do recurso exato ainda em conferência |
| 4. Desníveis, poços, escadas e travessias | MSD/MSU, PIT, poços, túneis e escadas da planta | **Adaptar** componentes e geradores. Sem equivalência de travessia provada para cada trecho |
| 5. Água, lava e bordas | MWATER, MLAVA, valores de FLOR e planta do nível inferior | **Mista**. Água reutilizável com margem da mina adaptada. A superfície de lava requer arte própria e tratamento de acesso |
| 6. Estruturas e objetos de mina | BRACE, trilhos, vagonetes, barris, tochas, pilastras | **Mista**. Reusar tochas e barris compatíveis. Suportes e trilhos têm leitura própria. Vagonetes e adereços independentes podem ser sprites. Chave, pergaminho e fragmento são itens separados |

**Contagem de planejamento.** Seis famílias na mina. Planejar **um atlas novo modular de Fang Lair** para superfícies comuns aos dois andares. Dimensionar o atlas de animação de lava à parte após confirmar a travessia e o formato A1. Portais complexos, props e ícone do fragmento podem ser sprites separados. Não contar cada SET original como um atlas. Com Rihad, o mínimo para iniciar a identidade dos mapas é **dois atlas novos**, um por ambiente. O total definitivo depende da corte, da lava e da aplicação dos recursos declarados nas áreas ainda sem pareamento visual.

A fonte primária confirma presença/posição das criaturas e recursos declarados. Uso exato de cada variante de superfície, volume e enquadramento continua para o levantamento setorial. O núcleo das celas reaproveita o exemplar de aranha existente. As espécies inéditas mantêm suas posições na matriz de cobertura.
## Fontes e recorte, definidos antes da construção

| Evidência localizável | Confirmação e correspondência |
| --- | --- |
| `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.3 (enigma e vista das celas), p.5 (planta do nível1) | Sala com celas laterais e três celas ao sul; resposta **Cela 2**, chave abre o portal para a escada. Erro libera aranhas. A aparência de mina/celas não confirma reutilização dos materiais de Stonekeep |
| Original instalado: `ARENA/42068779.MIF`, primeiro INFO `FANG1.INF`, primeiro MAP1/FLOR100×100, TRIG/LOCK | Decodificação focal nova conferida com a leitura anterior: recorte sudoeste do nível1, sem segundo andar. Hash/âncoras em [fontes.json](evidencias/m02-fang-celas/fontes.json) |
| `ARENA/GLOBAL.BSA`, entrada `FANG1.INF`, TEXT5–10 | Advertência, três proposições, respostas aceitas `cell 2`/`2` etc.; `^30 10` no enigma e `+29` na chave. Portal no LOCK `(88,96,29)` e cela2 `(94,96,30)`, coerentes com texto/planta. Não afirmar decodificação completa dos flags |
| MAP1/FLOR + FLAT5 `key.img`, FLAT55 `spider.dfa` | Chaves aparentes `(91,98)/(94,98)/(97,98)`, só a central é dourada segundo os textos. Quatro aranhas do recorte em `(96,83)/(90,83)/(96,87)/(90,87)` |

Consulta somente de leitura. Extrações em `tmp/fang-review`, ignorado, sem material original no runtime. Não houve novo playtest DOS. Sem pesquisa geral de materiais: FANG1 declara MFLOORA/MFLOORD, MINEA/B/C/D/E/F, MCELL/MDOOR/MSD etc.; uso espacial completo das texturas não foi deduzido desses nomes. Preparar referências específicas antes de futura amostra artística.

Planta fixa em [FANG_CELAS_M02.json](mapas/FANG_CELAS_M02.json): espelhar X original para leitura do automapa (`displayX=99−originalX`), recortar displayX1–12 / Y80–98, escala3 e margem2. Mantém corredores/ramificações e relações das celas. Map01340×61; corredores mínimos3tiles, teto1/face2 dentro dos sólidos; interação/collider separados da arte. O par opcional de celas ao norte/Y77–79 e a rota completa da entrada ficam fora.

| Elemento | Original X,Y | Map013 X,Y |
| --- | --- | --- |
| Ponto de leitura do portal |88,95 |33,48 |
| Porta do portal |88,96 |33,51 |
| Cela2 / chave dourada |94,96 /94,98 |15,51 /15,57 |
| Cela1 / latão |91,96 /91,98 |24,51 /24,57 |
| Cela3 / latão |97,96 /97,98 |6,51 /6,57 |
| Saída ao norte do recorte |93,80 |18,3 — retorno técnico ao título, não entrada completa da mina |
| Patamar da escada / limite |88,98 |33,57 — sem transferência ao nível2 |

Adaptações explícitas: escolha nativa Cela1/2/3/Voltar em vez de digitação inglesa; tradução das três condicionais sem revelar resposta antecipadamente; interação do portal no tile33,49, acessível do ponto original33,48; consumo da chave segue o contrato aprovado de MQ02, não é inferido como consumo do original. Portas ocupam a célula original ampliada3×3; evento visual ancorado uma linha abaixo do centro, com primeiro tile transparente. Arte/ícone/tile4 existentes são **provisórios**, sem afirmar identidade de Fang Lair ou modificar os outros mapas. Portas alternam quadros fechado/aberto, sem nova animação artística.

## Estado e limites

- MQ02 **60→70** apenas no acerto; Cela2 abre. Erro mantém60 e registra `fangSpidersReleased` uma vez, abrindo as celas associadas; pode tentar novamente. Quatro marcadores sinalizam encontros pendentes, **sem combate substituto, EXP ou loot fictícios**. No recorte original faltavam assets e integração. O levantamento acima confirma o exemplar de Stonekeep como reutilizável e mantém a integração dos encontros pendente.
- Item importante **8**, `MQ02.gold-key`, fonte **fang.cell2.key**; IDs1–7 intactos. Coleta só repõe a unidade faltante em70. Portal consome1 + recibo **MQ02.fang.lower-door** + etapa **80** na mesma operação com rollback. Recibo aposenta a fonte; carregar/reinteragir não recria chave. Diário atualizado, MQ01 preservada e MQ02 continua incompleta.
- Escada informa limite, sem criar nível2, fragmento ou retaliação. Rihad continua sem viagem ao destino `fang.entry`: amostra das celas não substitui uma mina ainda ausente. M02-06B conectará a rota após a amostra.
- Núcleos de quests/persistência e namespace web inalterados. Sessão RAM reutiliza fixture da entrega legítima do pergaminho, sem tocar saves pessoais. Nenhum atributo/loot/inimigo anterior modificado.

## Avaliação curta

Localhost: **http://127.0.0.1:8774/**, servidor Python desta entrega ativo (PID17812; encerrar com `Stop-Process -Id 17812` quando não for mais necessário). Nenhum servidor alheio foi encerrado. Editor: abrir projeto e executar normalmente. Em ambos:

1. **Testes / Debug → Campanha e mapas → Fang Lair · celas (RAM)**. Início diante do portal, etapa60, sem chave; não exige refazer Stonekeep.
2. Enter/toque no portal, ler e escolher **Voltar** (sem efeito) ou Cela1/3 (abre celas laterais; aranhas apenas sinalizadas). Interagir novamente; **Cela2** é o acerto do original.
3. Contornar a ponta norte da divisória e entrar na **Cela2**, ao sul/centro. Interagir no ponto **Chave dourada** `(15,57)`; inventário tem1. Repetir não duplica.
4. Voltar ao portal `(33,48)`, interagir: chave consumida, porta aberta; entrar até a escada, que informa o limite sem concluir a quest.
5. Esc → **Guardar teste em RAM / Carregar teste da RAM** para conferir antes/depois. Slots normais bloqueados; RAM não sobrevive a F5. Para reiniciar, retornar ao título pelo ponto norte ou menu e abrir o mesmo teste. Não preparar fixtures em partidas pessoais.

## Verificações efetivamente realizadas

`tools/test-fang-cells.cjs`: Chrome desktop automatizado, origem/perfil descartáveis; abertura limpa, hub real, comandos/eventos/choices nativos, cancelamento e ambas respostas erradas; colisão fechada/aberta, caminho até chave/escada, coleta/recoleta/recuperação, recibo/consumo único, RAM antes/depois, save nativo sintético16 + F5/load, quest incompleta e preservação de personagem/recursos/MQ01/itens anteriores/loot/derrotas. Caminhada acelerada somente no teste; não constitui avaliação de ritmo.

Reconstrução completa `node tools/build-rihad-arrival.cjs` preserva Map008–012/Items1–7 e reproduz Map013/contratos; registro canônico de plugins conferido. Zero erros de página e recursos ausentes. Validador de dados/IDs passou; título e vínculos finais também conferidos no endereço8774 em perfil descartável, sem tocar o armazenamento pessoal. [Resultado e capturas](evidencias/m02-fang-celas/resultado.json). Avaliação manual do responsável, abertura/edição nova no MV e mobile **não executadas**. Sem campanha completa ou nova matriz de combate.

**Replanejamento posterior02/11:** preservar af17b4b e adiar expansão de Fang Lair até conferir/concluir Stonekeep e Rihad, conforme BACKLOG_M02.md. Ao retomar M02-06A, integrar os encontros condicionados com o exemplar de Stonekeep e avaliar a amostra antes de ampliá-la. Não iniciar lote de materiais ou descartar o núcleo já entregue. Nenhuma dependência concreta exige inverter a prioridade agora.
