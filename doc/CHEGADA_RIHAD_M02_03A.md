# M02-03A — primeira chegada a Rihad

## Atlas exterior V01

O Map009 usa um atlas dedicado ao percurso portão → esplanada → corte e aos quarteirões com as mesmas superfícies. Rua clara, passeio de blocos escuros e terreno ocre seguem `FLOR` do CITYW1 reconstruído. Fachadas, muralha, portal da corte, sebe e vãos de jardim usam famílias derivadas dos registros `MAP1`/DCN.INF. Cantos e jambas ocupam o lado sólido. Soleiras, folhas abertas representadas lateralmente e o muro baixo ao pé das sebes são composições ortogonais do projeto. Os 30 vãos utilizáveis e os dois sem travessia mantêm sua lógica. A costa continua provisória.

| Reuso | Módulos que faltam |
| --- | --- |
| Porta e plataforma atuais. O interior de `PALACE2` mantém o atlas existente, que já permite testar pedra, lajes, soleiras e alturas. | Para a corte, faltam tapete com borda, degraus e batentes próprios de `CASTLE.INF`, trono, ornamentação local e caracterização de Blubamka. Para a cidade, costa e flora/objetos específicos continuam no inventário. |

**Exportação.** Na raiz, execute `python tools/export-m02-surface-atlas.py rihad` com Pillow e depois `node tools/build-rihad-arrival.cjs`. O exportador monta um C nativo com células de 48 px, pisos em período 2×2, coroamento e duas fileiras de face. O gerador mantém B e A1 do tileset-base e reaproveita seus módulos de repouso. [Mestre, prompt e fontes](arte/m02-tilesets/sources-rihad.json) · [Peças, hash e exportação](arte/m02-tilesets/exports-rihad.json) · [Matriz de atribuição](mapas/RIHAD_MATERIAIS_M02.json).

**Próximo teste integrado.** Observe a leitura do personagem junto ao portão, percorra a esplanada, atravesse um arco confirmado e entre na corte. A avaliação visual do exterior está pendente. [Capturas do portão](evidencias/m02-rihad-atlas/portao.png), [esplanada](evidencias/m02-rihad-atlas/esplanada.png), [jardim](evidencias/m02-rihad-atlas/jardim.png) e [corte](evidencias/m02-rihad-atlas/corte-exterior.png) · [Verificações](evidencias/m02-rihad-atlas/resultado.json).

## Fechamento funcional de Rihad

Os dois vãos de jardim são `0x913B` (`GARDENGD.IMG`, atravessável) entre sebes sólidas `0x903A`. Cada um tem piso seco em uma face e parede sólida `DMNOBLE.SET` na face oposta, sem sobreposição em MAP2. O Map009 conserva os 30 arcos que ligam dois pisos e deixa estes dois sem travessia:

| Vão MIF → MV | Única face livre | Volume oposto |
| --- | --- | --- |
| (52,8) → (228,27), NBBD1C | Oeste | MIF (53,8), MAP1 `0x3838` |
| (57,72) → (213,219), NBBD1D | Norte | MIF (57,73), MAP1 `0x3939` |

O Map011 usa o salão de `PALACE2.MIF`. O acesso de Rihad segue pelo mesmo portão urbano. [Seleção, planta e limites da corte](CORTE_RIHAD_M02_03D.md#interior-palace2--referência-vigente)

## Orientação e fachadas de Rihad

O informante indica o passeio escuro, o repouso e os Arredores antes da visão. Depois, aponta a corte na muralha sul, com a grade e a porta de madeira como referências. Ao aceitar o pedido ou entregar o pergaminho, Blubamka indica o portão urbano ao **norte**. As placas de percurso estão em 50 posições fixas e indicam Esplanada, Corte ou Portão urbano conforme MQ02. Antes da visão, as placas mais ao sul mostram a volta ao portão para quem seguiu pela cidade. A oferta de viagens continua condicionada pelo progresso. Veja as [falas em jogo](CAMPANHA_PRINCIPAL.md#inventário-textual) e o [roteiro integrado](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

A [matriz das fachadas e placas](mapas/RIHAD_SINALIZACAO_M02.json) cruza os registros MAP1 da composição `CITYW1.MIF` + 32 quarteirões com os recursos de `DCN.INF`. Há 380 portas decorativas acessíveis pelo lado da rua: 319 casas, 25 casas nobres, 16 de equipamentos, 13 tavernas, seis templos e uma Guilda dos Magos. São tipos do registro, sem atribuição de nomes próprios. Em 35 pontos comerciais, a placa original ocupa uma célula diferente da porta. Nesses casos, a fachada foi projetada sobre o ponto sólido adjacente à rua, conservando a associação local. A placa próxima explicita **Fechado**. Casas e estabelecimentos continuam fora do recorte de interiores.

A exportação das quatro peças de porta reutiliza textura e moldura do mestre exterior. Para reconstruir, rode `python tools/export-m02-surface-atlas.py rihad` (Pillow) e `node tools/build-rihad-arrival.cjs`. A camada decorativa só é aplicada sobre volumes sólidos. As entradas de Arredores, Corte e portão urbano continuam usando os eventos existentes. No Chrome com perfil isolado, a rota sinalizada somou 422 passos em cada sentido. O teste percorreu a audiência, a ida a Stonekeep, a entrega única e a retomada de saves. [Resultado](evidencias/m02-rihad-orientacao/resultado.json) · [Retorno ao portão](evidencias/m02-rihad-orientacao/orientacao-portao.png) · [Taverna fechada em janela de 640 × 520](evidencias/m02-rihad-orientacao/porta-taverna.png). A avaliação manual fica no teste integrado.

### Estudo de bússola

| Opção | Perto de paredes e portões | Objetivo em outro mapa e janela menor |
| --- | --- | --- |
| Seta para o destino | Fácil de interpretar em terreno aberto. Em Rihad, pode apontar através da muralha ou para trás da fachada, ocultando o desvio até a grade ou o portão. | Exigiria escolher um ponto intermediário antes de mostrar direção entre mapas. A seta cabe em janela pequena, mas direção isolada deixa o destino ambíguo. |
| Marcador da próxima passagem útil | Pode indicar a próxima esquina, a grade da corte ou o portão pela rota transitável. Precisa escolher a passagem pelo lado acessível e atualizar após a curva, com estabilidade para evitar que o alvo oscile. | Quando o objetivo estiver fora de Rihad, poderia apontar apenas para o portão e parar na transferência. Uma seta e um rótulo curto bastam para o teste em janela pequena. |

**Piloto de audiência.** Após a visão de Ria e o diálogo com o informante, a etapa 30 de MQ02 exibe **Audiência** com uma seta no canto superior direito. Ela indica o próximo trecho da rota conferida entre a esplanada e a grade da corte. Quem sai da rota por uma rua lateral próxima recebe uma indicação de retorno somente se o reencontro for transitável em linha reta. A seta fica oculta longe da rota, durante mensagens e ao entrar na corte. Para testar, use o [passo 2 do roteiro integrado](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome). O piloto se limita a essa audiência e não calcula rotas para outras áreas.

## M02-03E2 — passagens de jardim e quarteirões contíguos

A auditoria da composição CITYW1 +32 MIF confirmou o SHA-256 da composição MAP1. Em `DCN.INF`, `NHEDGED.IMG` corresponde ao registro sólido `0x903A`. O recurso seguinte, `GARDENGD.IMG`, tem `*TRANSWALKTHRU` e aparece como `0x913B`. A conversão anterior tratava todos esses arcos como paredes. A revisão abre os **30 arcos** que ligam pisos secos em faces opostas, começando pelos quarteirões do templo próximo à esplanada e da ala nobre próxima à corte. O vão provisório tem uma faixa central de um tile e mantém as laterais sólidas. Os dois arcos que terminam diretamente em volume sólido, em MIF (52,8) e (57,72), foram confirmados como vãos sem travessia na planta. [Planta e lista de conexões](mapas/RIHAD_PERCURSO_M02.json)

| Quarteirão original | Arcos abertos | Células MIF alcançáveis a mais |
| --- | ---: | ---: |
| TPBD8B, junto ao percurso | 4 | 57 |
| NBBD7B, junto à ala da corte | 3 | 3 |
| NBBD1C | 7 | 121 |
| NBBD1A | 8 | 134 |
| NBBD1D | 7 | 120 |
| EQBD12D | 1 | 3 |
| Total | **30** | **438** |

Da chegada, o grafo passa de **7.357 para 7.795** centros MIF alcançáveis. Os 388×388 tiles e os IDs e coordenadas dos eventos permanecem. Nenhum novo diálogo ou interior opcional foi adicionado. O corredor da campanha mantém Ria, informante, repouso, Blubamka, Stonekeep, Fang Lair e seus retornos. Saves dos setores existentes mantêm a posição e usam a nova colisão ao carregar.

**Estado anterior ao V01.** O levantamento apontou rua e passeio, muro baixo e arco de jardim, além de fachadas com vãos legíveis. A costa permanece bloqueada na margem prevista. Os acessos comerciais e residenciais mantêm o exterior, com interiores fora do recorte. A variante da corte e os dois vãos sem saída foram verificados no [fechamento funcional](#fechamento-funcional-de-rihad). [Famílias visuais](#famílias-visuais-de-rihad)

**Avaliação integrada pendente.** A partir da chegada, siga para o pátio do templo pelo arco MIF (13,35), MV (345,108), atravesse e volte pelo mesmo vão. Continue pela cidade até a corte, preservando os passos normais da missão. [Arena local](http://127.0.0.1:8774/) · [Teste Rihad e Stonekeep](evidencias/m02-rihad-passagens/resultado.json) · [Teste Fang Lair e retorno a Rihad](evidencias/m02-rihad-passagens/fang-lair.json)

## M02-03E2 — do portão urbano à corte

Map009 usa a planta reconstruída inteira como base de 388×388 tiles, com escala 3 e margem 2. [Planta e âncoras versionadas](mapas/RIHAD_PERCURSO_M02.json). A grade preserva o traçado das células secas, a costa bloqueada, o portão urbano e o acesso ao palácio. As fachadas usam alvenaria provisória. Adereços, interiores opcionais, alturas e acabamentos urbanos ficam para etapas posteriores. Map011 fornece a audiência já jogável.

| Função | MIF | Map009 |
| --- | --- | --- |
| Estrada para Stonekeep | (13,0) | (345,3) |
| Saída para os arredores | (14,0) | (342,3) |
| Chegada e retorno à cidade | (13,1) | (345,6) |
| Esplanada e informante | (12,3) | (348,12) |
| Repouso | (10,4) | (354,15) |
| Portão interno do palácio | (8,124) e (9,124) | (360,375) e (357,375) |
| Acesso à corte | (8,127) | (360,384) |
| Retorno da corte | (8,126) | (360,381) |

IDs de mapas, eventos, fonte, item, recibo e destinos foram preservados. As falas do informante foram ajustadas nos trechos que indicavam a geografia da amostra. As mensagens curtas sem imagem usam a janela nativa de largura total, incluindo as escolhas da audiência. Ria usa a cena ilustrada existente. O gerador de Rihad recompõe a planta, os vínculos e a saída de Stonekeep sem extrações locais.

Em Chrome 157, uma partida sintética elegível iniciou a transição por **Continuar jornada** e chegou a (345,6) na etapa 10. O pacote local de `fb3f92d` passou na conferência do manifesto e abriu em subpasta com o hub de debug desabilitado. [Roteiro e evidências](STONEKEEP_M02_04.md#roteiro-de-avaliação-no-navegador).

No primeiro carregamento de um save da antiga esplanada, o jogo retoma no portão urbano. O terreno novo tem outra escala e outro traçado. Saves feitos no mapa novo retomam na posição registrada. [Roteiro único](STONEKEEP_M02_04.md#roteiro-de-avaliação-no-navegador).

## M02-03E1 — planta reconstruída e inventário visual

**Identificação no original.** `CITYDATA.65`, registro a partir do byte 1356, identifica Rihad em Hammerfell (província 1, cidade-estado local 4, ID global 36, posição provincial 207,180). A tabela costeira do `ACD.EXE` instalado inclui 36. Sua semente `0x00CF00B4` seleciona o modelo `CITYW1.MIF` do GLOBAL.BSA. O modelo é **128×128**, com grade **6×6 de quarteirões de 20×20**, começando em (3,3). Os índices 29, 33, 34 e 35 ficam reservados no modelo. A reconstrução determinística produziu 16.384 células por camada. O SHA-256 do MAP1 composto, em palavras de 16 bits little-endian antes do retoque dos portões, é `5d224c5e3cd48b1f7f382a2195d9548ed592efa2d38fc8634f4938a6f03b1bac`. A rota e as dimensões foram aferidas em dados, sem observação ao vivo em DOS. As tabelas costeira, modelos, origens e reservas vêm respectivamente de `0x401E2`, `0x4021C`, `0x4028F` e `0x402C8` do executável descompactado. A interpretação usa [CityDataFile](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/Assets/CityDataFile.cpp), [LocationDefinition](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/WorldMap/LocationDefinition.cpp) e [ArenaCityUtils](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/World/ArenaCityUtils.cpp) como referências técnicas.

**Planta de referência.** Linhas na ordem Y crescente e colunas em X MIF crescente. Cada célula dá o nome sem `.MIF`. R preserva o conteúdo do modelo. Os 32 blocos incluem 12 residenciais, 6 nobres, 5 de equipamento, 4 tavernas, 3 templos, 1 área livre e 1 Guilda dos Magos. A contagem é de blocos, pois um bloco pode conter vários acessos.

| Y | X3 | X23 | X43 | X63 | X83 | X103 |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | TPBD9C | TPBD11B | NBBD1C | BSBD14C | TSBD6C | BSBD18D |
| 23 | TPBD8B | BSBD12A | MGBD4D | EQBD10D | BSBD19A | TVBD14B |
| 43 | TVBD7B | BSBD6A | NBBD9D | BSBD7A | NBBD1A | EQBD12D |
| 63 | EQBD1B | BSBD7C | NBBD1D | BSBD6C | BSBD1A | EQBD8B |
| 83 | BSBD18A | NBBD3D | BSBD6B | EQBD9D | TVBD6B | R |
| 103 | NBBD7B | BSBD16A | TVBD7D | R | R | R |

- **Acessos MIF.** Portão urbano em (13,0)/(14,0), pelo `*MENU 8/7` de DCN. O conjunto do palácio está na borda oposta em (8,127)/(9,127), atrás de uma entrada interna em (8,124)/(9,124). No grafo conservador de pisos secos, células vazias e decorações, há 139 passos de (13,1) a (8,123), antes de tratar as portas de acesso. A passagem foi deduzida dos dados, sem testar colisões adaptadas. Espelhar X por `127−X` na leitura superior adotada nas dungeons. Com escala 3 e margem 2, a referência dá **388×388 tiles**, contra 274×274 já testados em Stonekeep. Medir a carga antes de fixar escala e distribuição de eventos.
- **Delta da amostra.** O levantamento orientou o reposicionamento da chegada, repouso e informante pela rota identificada. Fachadas e acessos urbanos permanecem representados nos quarteirões sem serviços. A variante da corte foi verificada; margem costeira e decoração ainda dependem da etapa de arte.
- **Entidades.** A composição MAP1 resolve 367 referências a flats no DCN, entre NPCs e objetos, **zero registros de criatura hostil por ITEM 32–54 ou inimigo humano por ITEM 55–72**. O arquivo declara `RAT1.DFA`, mas esse flat não está colocado. Os quatro ratos de Map010 são uma adaptação já coberta pelo catálogo. O dado não conta guardas e encontros dinâmicos do executável ou interiores não abertos.

### Famílias visuais de Rihad

`DCN.INF` é a referência desértica de céu limpo. A reconstituição tem piso de rua, passeio, terreno seco e margem inundada. As texturas de clima e os detalhes dos interiores ficam fora desta contagem. Famílias são conjuntos funcionais de módulos, não a quantidade de arquivos IMG/SET declarados.

| Família | Referência original | Decisão frente aos atlas existentes |
| --- | --- | --- |
| 1. Rua, passeio e terreno aberto · prioridade alta | NROADD, NSIDWALD, NGRASSD | **Nova**. Começar por piso, borda reta, esquina e junção de rua/passeio reaproveitáveis. O piso claro de `Arena_Dungeon_M14_R03` serve na prova de percurso, como placeholder |
| 2. Fachadas, coberturas e vãos comuns · prioridade alta | DMBS1–3, DMEQUIP, DMTAVERN, DMMUGUIL, DMTEMPLE, DMNOBLE, NHEDGED, GARDENGD | **Nova**. Começar por base de parede, cimalha, canto e vão padrão reaproveitáveis. Separar ornamentos residenciais e institucionais, sebes e arcos de jardim. Adaptar componentes de portas onde a silhueta for compatível |
| 3. Muralha, portão e fachada da corte | CITYWALD, DLGTD, DRGTD, DGATE, BK01/02PALD | **Nova**. Reaproveitar batente e contrato de colisão/âncora; portão monumental e fachada do palácio preservam composição local. O atlas castelhano de Stonekeep só serve como referência modular |
| 4. Costa e transições | SEAWALLD, FLOR 13 | **Adaptar** a superfície existente `Arena_Water_M14_R02_A1` e conferir margem/porto antes de escolher o acabamento |
| 5. Adereços urbanos e flora | NLAMP1, NWELL, NFOUNT, CACTUS, PALM | **Mista**. Reusar vasos, luzes e pedra onde houver equivalência. Poço, fonte, palmeira e cacto exigem desenho próprio quando necessários ao setor |
| 6. Interior obrigatório da corte | `PALACE2.MIF` / `CASTLE.INF` | **Mista**. Reusar pisos e paredes existentes provisoriamente. Priorizar piso modular, tapete com bordas, degrau e batente, aproveitáveis em palácios com a mesma família. Trono, ornamentos e caracterização de Blubamka ficam no conjunto local |

**Contagem de planejamento.** Seis famílias urbanas. Um atlas modular exterior novo é a unidade mínima para rua, fachada e fortificação. Costa pode dividir esse atlas com a superfície já existente. A variante de palácio está identificada. Confirmar o espaço disponível nos atlas existentes antes de reservar um atlas interior separado. Informante e Blubamka têm representações provisórias reutilizáveis no teste de mapa. A caracterização futura de Blubamka não é item do atlas nem exige imagem narrativa agora.

**Plano anterior à integração urbana.** Importar a estrutura da cidade com os tiles disponíveis como provisórios, testar carregamento e medir a rota contínua **portão urbano → esplanada → portão interno → corte existente**. Transferir os gatilhos de chegada, informante, repouso e estrada por seus IDs atuais. Começar por essa ligação antes de finalizar outros quarteirões, mantendo-os no inventário da planta. [Contagem conjunta de criaturas do M02](FANG_CELAS_M02_06A.md#inventário-de-criaturas-e-materiais-do-m02) e [texto da campanha](CAMPANHA_PRINCIPAL.md#inventário-textual).
<a id="cobertura-vigente-de-rihad--revisão02112026"></a>

## Histórico da cobertura — revisão de 02/11/2026

A chegada e suas interações são uma **amostra funcional**, não a cidade completa exigida agora. A fonte local Fang Lair p2 sustenta cidade/corte junto à muralha e a troca narrativa, mas não fornece aqui correspondência cartográfica completa de Rihad. Map009 **21×15** é esplanada autoral; Map011 é interior mínimo da corte; Map010 é um trecho adaptado com quatro ratos para a progressão inicial, não cópia de população/encontros urbanos originais. Nenhum deles comprova a planta completa.

Faltam: identificar a planta urbana de referência e seus arquivos/geração no original; registrar ruas/quarteirões, muralhas/portões, edifícios/acessos e suas conexões; depois integrar chegada, informante, descanso e corte em posições justificadas. Não há inventário completo confirmado de encontros da cidade nos materiais já registrados: **quantidade desconhecida**, não zero ou população a preencher. Se o original usar geração/condições variáveis, escolher uma referência reproduzível e documentar a adaptação finita antes de implementar; sem introduzir encontros aleatórios/novos sistemas.

Preservar funções, estados e aprovações anteriores; manter os quatro ratos como adaptação identificada e verificar sua ligação espacial na adequação, sem convertê-los em evidência do original. Não assumir orientação do portão de chegada. Interiores sem função na campanha podem permanecer inacessíveis, com edifícios/acessos preservados e identificados na planta. Placeholder/NPC/repouso e posição atual continuam provisórios; não há autorização para lote artístico.

Planejamento: **M02-03E1** identifica referência/cobertura; **03E2** implementa a estrutura por setores; **03E3** religa eventos/transições/encontros aplicáveis e verifica persistência, conforme BACKLOG_M02.md. Nenhum mapa foi alterado nesta consolidação.


**Relato posterior do responsável:** acesso à chegada pela estrada e ao informante confirmado, associado à referência disponível b8738b9. Descanso e guardar/carregar na chegada **não explicitamente confirmados**; não registrar aprovação completa. Ambiente/SHA não informados no relato. [M02-03B](ARREDORES_RIHAD_M02_03B.md) acrescenta arredores e atualiza o mesmo acesso para nível1/RAM; roteiro e limites abaixo descrevem a unidade03A original.

01/11/2026. Feature `feature/m02-chegada-rihad`, derivada de **4ff291a**, preservando as dependências02A/02B sem integrar branches. **Amostra para avaliação, não aprovação estética nem conclusão de M02-03.** Tag m01 intacta; nenhum push/Pages.

## Conteúdo e fontes

Map009, **M02-03 Rihad — chegada (amostra)**:21×15 tiles, chegada `rihad.arrival` em **(10,11)**, informante em **(9,7)**, plataforma autorizada de repouso em **(15,10)**.121 células alcançáveis contando o ponto de chegada, sem encontros. Mapa fixo, não procedural; não há reprodução declarada da planta original. Muralhas usam cap/teto1 e face2 dentro das células sólidas; a rua/esplanada tem áreas abertas maiores que3 tiles. Colisão nativa por flags, independente da plataforma visual3×3. Sem teto sobre caminho e sem saída acidental pelos limites.

Consultados: [especificação](MQ02_ESPECIFICACAO.md), [contratos02B](CONFIGURACOES_M02_02B.md), diretivas de mapas/arte/navegação e PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.2, incluindo a pequena captura identificada **Rihad**. Confirmados pela wiki: cidade no sul de Hammerfell; busca de informações entre moradores; palácio junto à muralha. A imagem mostra pavimentação clara e edificações de pedra/volumes escuros; sua baixa definição não confirma detalhes menores. Instalação original consultada em modo leitura para inventário de arquivos MIF; **nenhum mapa foi identificado como Rihad/decodificado nem houve observação nova no executável DOS**. Não afirmar coordenadas/traçado canônicos.

**Adaptações:** chegada pela estrada após elipse de viagem; esplanada, posição do informante e plataforma definida como repouso. A arquitetura de chegada ainda é **provisória**: reutiliza `Arena_Dungeon_M14_R03.png`, sem grades/correntes/Gate/decoração da cela. O NPC usa `$Arena_redguard_male_walk_r02.png` como representação provisória de morador, sem identidade canônica inventada. Não são um novo padrão aprovado de cidade, nem conclusão da identidade arquitetônica de Rihad. Não houve geração/edição de imagens, prompts novos ou lote. Pixels e animações anteriores preservados.

## Continuação e limite desta versão

Campanha antes do Gate mantém MQ01. A conclusão existente leva à tela final, agora com **Continuar jornada**, **Salvar** e **Voltar ao título**. Escolher título não inicia MQ02. Escolher continuar registra `campaign/MQ02.begin` com destino `rihad.arrival`, transfere e registra `campaign/MQ02.arrive`; a primeira chegada cria MQ02 em10. Nenhuma recompensa, EXP, cura, recriação do personagem ou repetição de MQ01. Um save interrompido em viagem retoma o destino; um save já chegado permanece na posição salva.

Fase/cursor/histórico M01 permanecem no namespace anterior; o registro de capítulo passa a ser a autoridade de roteamento depois da continuação. Namespace web **arena:m01:save-v1** e schema dos saves inalterados. O salvamento normal da campanha funciona no novo mapa, com os mesmos slots. Continuar uma campanha é ação explícita; laboratório/E05 não são promovidos automaticamente.

Informante em10 orienta sobre lugar/repouso e informa o limite do teste, **sem simular sonho/conclusão**. Se a quest estiver legitimamente em20+, aponta a corte, ainda indisponível; a conversa não avança etapa. Descanso reutiliza `ArenaRecovery.usePoint` e a indicação/proteção compartilhadas: recuperação integral fora de batalha, sem passagem de horas, regeneração passiva, respawn ou tesouros. O nível1 pode visitar/descansar, mas sua oportunidade de EXP e a visão completa continuam próximas unidades, não implementadas nem consumidas aqui.

## Avaliação determinística, sem slots pessoais

Servidor já existente **http://127.0.0.1:8774/** conferido pelo conteúdo de ArenaRihad.json; não foi reiniciado nem substituído. Pelo editor, abrir Game.rpgproject → playtest. Em ambos:

1. No título, selecionar **Rihad · chegada (teste RAM)**. Surge uma Bretã sintética nível3 em(10,11), com Vida31, Mana12 e Vigor23. Nada foi carregado de saves pessoais.
2. Caminhar com setas ou clique até o informante(9,7), ficar ao sul e pressionar Enter/tocar o evento: orientação e limite da amostra, sem avanço artificial.
3. Antes de descansar, Esc → **Guardar chegada em RAM**. Aproximar-se da plataforma(15,10) e usar Enter ou a indicação **Descansar · Enter / toque**: os três recursos ficam completos.
4. Esc → **Carregar chegada da RAM**: posição e recursos gastos retornam ao snapshot. Este teste não usa disco/localStorage; fechar/recarregar o navegador perde o snapshot. **Salvar normal permanece desabilitado nessa fixture**, intencionalmente.
5. Para sair, Esc → **Sair** → **Para o Título** (ou retornar ao laboratório e escolher **Voltar ao título**). O comando seguinte exige soltura/nova pressão após mensagens.

O save/load **normal** foi verificado tecnicamente em perfil/origem descartáveis pela cena nativa Salvar/Carregar, incluindo F5; não exigir partida pessoal para esta avaliação. Numa campanha elegível, **Continuar jornada → Esc → Salvar** usa normalmente os slots existentes, sem fixture. Se quiser repetir esse caminho manual, usar um perfil de teste separado. Não transferir saves entre origens/perfis nem limpar dados do site.

## Evidências e pendências

[16 grupos focais](evidencias/m02-03a/resultado.json), Chrome156 desktop headless: chegada, preservação,121 células acessíveis/limites/NPC, conversa, clique, repouso/tecla mantida/toque emulado/bloqueio em batalha, RAM, salvar/F5/carregar nativos, ending/ended/cancelamento/continuação única, viagem interrompida e reconstrução idempotente. Sem erros não tratados ou recursos HTTP ausentes. Capturas reais: [chegada](evidencias/m02-03a/chegada.png), [informante](evidencias/m02-03a/informante.png), [descanso](evidencias/m02-03a/descanso.png), [carregada](evidencias/m02-03a/carregada.png).

Reutilizadas as evidências02A/02B para introdução parcial, bloqueios laboratoriais e contratos não alterados; não repetidos percurso M01, laboratório completo ou23 cenários MQ01. Comparação estática preserva Map008, banco anterior/itens, regras de combate, fontes/recibos e40 repousos da dungeon. [Verificações estáticas](evidencias/m02-03a/contratos.json): registro canônico41 plugins, arquivos/sintaxe e preservação de m01/banco/Map008/pontos anteriores. Compatibilidade MV conferida por estrutura/sintaxe/registro; **nova abertura/edição/playtest no editor e teste físico não executados**, sem extrapolar aprovações M01.

Avaliação observável pendente do responsável: caminho/escala provisória, conversa e repouso. M02-03 permanece parcial: corte, missão, arredores/EXP nível1, visão de Ria e demais viagens ausentes. Aguardar avaliação da chegada antes de ampliar ou gerar variantes. Próximo critério de M02-03 a atender: oportunidade coerente de evolução do nível1 antes do sonho, numa unidade controlada; não iniciada.
