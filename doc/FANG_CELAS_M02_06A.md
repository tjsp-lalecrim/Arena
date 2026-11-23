# Fang Lair — amostra funcional das celas (M02-06A)

## Entrada interna e investigação de vagonetes — 20/11/2026

**Entrega delimitada:** face interna de saída produzida e integrada; aparência exterior do chamado dragon gate e vagonetes continuam sem correspondência comprovada. Não declarar esses dois itens concluídos. Avaliação visual da face integrada fica agrupada no próximo teste de MQ02; sem Pages ou release.

| Questão | Evidência conferida | Conclusão / ação |
| --- | --- | --- |
| Entrada chamada dragon gate | Wiki local *Fang Lair (quest)* p.3 e texto de chegada descrevem o nome e a entrada da mina, sem identificar uma imagem exterior específica | O texto não demonstra ornamento de dragão. `DGATE.IMG` é declarado nos INF de cidades desérticas, não em FANG1/2; não foi transplantado |
| Face de saída interna | `42068779.MIF`, primeiro nível, MIF base-zero(4,1): MAP1 `0x1515`, índice21 de FANG1.INF → `MSU.IMG` | Moldura de madeira e escada ascendente confirmadas. Face visual em Map013(288,7), junto à parede cujo centro é(288,6). O ponto de interação existente permanece evento1/(288,9), diante da estrutura |
| Portas exteriores candidatas | `WDUNGDR1/2.IMG` aparecem como MENU8/9 em DWN/DWR e outros INF de wilderness; uma folha de madeira e uma metálica | Recursos genéricos de acesso a dungeons; não há vínculo específico demonstrado com Fang Lair. Sem geração da fachada exterior por inferência |
| Trams/vagonetes | Wiki p.3 os descreve como decoração, assim como trilhos; não como transporte interativo | Não foi criado veículo utilizável, loot, movimento ou condição de quest |
| `NCART1.IMG/.DFA`, `SCART1.IMG` | Declarados nos INF de cidades, ausentes em FANG1/2. Consulta visual mostra veículos com rodas/haste longa, sem uma caçamba de mina identificável | Não aplicar apenas por conter CART no nome. A espécie/função exata desses veículos não é afirmada aqui |
| Busca no mapa completo | Flatos efetivamente usados dos dois níveis conferidos, incluindo BAGAGE/BARREL/colunas; nenhum flat identificado como carrinho. Nenhum dos dois níveis possui camada MAP2 | Ausência dessa identificação não prova que a decoração descrita pela wiki seja inexistente: pode depender de volumes/texturas compostos ou de outra interpretação |
| Candidatos concretos a conferir | Primeiro nível: volumes elevados MIF(87,21), MAP1 `0x4065`, e(88,21), `0x5865`; ambos junto ao trilho(88,20). Segundo nível: nenhum volume do conjunto auditado adjacente a trilhos | Falta observar a aparência desses volumes no original ou comprovar sua composição BOXSIDE/BOXCAP. Adjacência ao trilho não comprova vagonete. Não foram alterados nem receberam um carrinho fictício |

**Arte integrada:** um asset estático de cenário, independente de parede/piso, baseada em MSU; projeção frontal de parede ortogonal, madeira envelhecida, escada e transparência. Acabamento, escala e enquadramento são adaptações, não uma imagem canônica exterior. Folha nativa432×576/células144×144, apoio142, mesma pose estática em todas as células para compatibilidade; não representa animação de abrir porta ou escalar. [Prompt/mestre](arte/fang-entry-v01/prompt.json) · [fontes/hashes](arte/fang-entry-v01/sources.json) · [exportação](arte/fang-entry-v01/exports.json). Extrações seguem em `tmp/fang-final-props`, ignoradas e fora do runtime. Não houve observação nova de partida DOS.

**Reconstrução e saves:** `python tools/export-fang-entry.py` e `node tools/build-rihad-arrival.cjs`. O contrato `M02_OBJETOS_DUNGEONS.json` acrescenta somente a decoração600/`visual.fang.1.entry-face`; o gerador também recompõe `ArenaM02DungeonObjects.json` desse contrato, evitando divergência entre origem e runtime. A sincronização visual já existente anexa o evento ausente em saves anteriores sem mover o jogador ou alterar quests/recibos. Não muda namespace. Porta/folhas interativas, regiões, chão, volumes, níveis, inimigos e o evento de saída permanecem iguais.

**Validação focal:** dados de todos os tiles/regions/tilesets e eventos preexistentes iguais em Map009/013/015/017; viagem normal do portão de Rihad à entrada, face visível e encaixe na parede; aproximação/limites laterais e saída por ação; save normal sintético19 sem evento600, carga aditiva e repetição sem duplicação; ator/inventário/loot/MQ01/MQ02/narrativas preservados; reconstrução idêntica. [Resultado](evidencias/m02-fang-entry-v01/resultado.json) · [captura integrada](evidencias/m02-fang-entry-v01/entrada-integrada.png). Chrome isolado, sem saves pessoais ou percurso completo.

**Avaliação curta posterior:** com Fang Lair conhecida, viajar pelo portão de Rihad, observar a face acima do ponto de chegada e usar a interação Retornar a Rihad. Salvar/carregar na entrada pode ser agrupado ao roteiro existente. A próxima investigação concreta dos vagonetes deve focar os dois volumes citados; não abrir outro catálogo geral. Exterior do dragon gate, Servo e ilustrações continuam seguindo suas próprias fontes/orientações.

## Cenário confirmado V01 — 20/11/2026

**Produzido e integrado, avaliação visual pendente no próximo teste de MQ02.** Três folhas geradas: dois painéis de Stonekeep, oito adereços urbanos e três objetos de missão. Mestres em `art/masters/m02-scenery-v01`; [prompts](arte/m02-scenery-v01/prompts.json), [fontes/hashes/adaptações](arte/m02-scenery-v01/sources.json), [exportações](arte/m02-scenery-v01/exports.json) e [ocorrências](mapas/M02_CENARIO_CONFIRMADO_V01.json). Originais consultados em modo somente leitura; extrações ignoradas em `tmp/m02-scenery`, fora do pacote. Não houve nova observação de partida DOS.

| Aplicação atual | Evidência e adaptação |
| --- | --- |
|94 módulos de painéis,564tiles de sobreposição em Map015 | CASF.SET#3 e CASK.SET#2 identificados por índice STKEEP1.INF/MAP1, original90×90 completo. Somente faces sul já visíveis da representação ortogonal;770células-fonte incluem outras faces/volumes cobertos. Não foi criada parede/colisão para mostrar ornamento. Tecidos e formas coloridas são estilizações dos motivos originais, não transcrição de inscrições ou atribuição de significado heráldico |
|1.431tiles de carpete em Map015 | REDRUG/FLOR8: **reuso exato** das nove peças do tapete vermelho dos interiores; bordas escolhidas por vizinhança. Das164células-fonte, limiares/volumes que não são piso região4 ficam intactos |
|117adereços em Map009 | MAP1 composto de Rihad + DCN.INF:7poços NWELL1/2,46cactos CACTUS1–3,39palmeiras PALM1–3,25fontes NFOUNT1D. Oito desenhos gerados; fonte **reutiliza** os pixels do objeto dos interiores. Projeção/escala, orientação fixa dos antigos billboards e fonte estática são adaptações; não há orientação cardinal canônica inferida da imagem frontal. Eventos decorativos sem ação, através, sem novos bloqueios; nenhum coincide com âncora de evento de campanha |
|Pergaminho, chave dourada, duas chaves de latão e fragmento | PARCHFLT.IMG/ITEM13 de Stonekeep, KEY.IMG de Fang e CHAOS1.DFA/ITEM13. A chave de rubi legada tem pedra vermelha, por isso foi preservada e não usada para substituir a chave dourada. O fragmento é uma composição **estática** da peça/aura vermelha, não uma nova animação ou o Cajado completo. Aparência/consumo do item e estados das fontes continuam separados |

Exportar com `python tools/export-m02-scenery.py` (Pillow), depois `node tools/build-rihad-arrival.cjs`. Recorte usa o envelope alpha≥16 para evitar margens quase invisíveis, mantendo a alfa do conteúdo, escala proporcional e apoio. Folha urbana tem células96×144 (módulos48px), oito posições nativas; as poses estáticas frontais são repetidas nas três colunas, sem fingir caminhada. Painéis são independentes da alvenaria; não há piso incorporado aos objetos. O atlas E é dedicado ao tileset de Stonekeep e mantém os demais materiais. Map012 técnico permanece como referência histórica.

`Arena_Scenery` usa `ArenaScenery.json`, gerado do contrato versionado. Fontes/recibos existentes decidem visibilidade, sem conceder itens ou recompensas. Chaves de latão preservam páginas/switches B/A. Saves antigos da cidade recebem os adereços ausentes antes dos sprites, uma vez; saves com item coletado/entregue não o fazem reaparecer. Não há namespace novo, migração de inventário, alteração de itens/receitas ou nova interação de poço/fonte.

**Verificação focal:** comparação dos quatro bits nativos de colisão em todos os tiles e das regiões/eventos preexistentes de Map009/015/013/017; snapshot antigo da cidade, salvar/carregar, coleta única e ocultação persistente dos três objetos de missão, audiência/entrega e retomada sem duplicação. [Resultado](evidencias/m02-cenario-v01/resultado.json). Capturas: [poço](evidencias/m02-cenario-v01/rihad-poco.png), [palmeira](evidencias/m02-cenario-v01/rihad-palmeira.png), [fonte reutilizada](evidencias/m02-cenario-v01/rihad-fonte.png), [CASF](evidencias/m02-cenario-v01/stonekeep-painel-casf.png), [CASK](evidencias/m02-cenario-v01/stonekeep-painel-cask.png), [carpete reutilizado](evidencias/m02-cenario-v01/stonekeep-carpete.png), [pergaminho](evidencias/m02-cenario-v01/stonekeep-pergaminho.png), [chave](evidencias/m02-cenario-v01/fang-chave.png), [fragmento](evidencias/m02-cenario-v01/fang-fragmento.png). Partidas sintéticas/Chrome isolado; sem percurso inteiro ou saves pessoais.

**Avaliação agrupada:** em Rihad observar escala dos poços/cactos/palmeiras e passagem junto aos objetos; em Stonekeep conferir painéis/carpetes e coleta do pergaminho; em Fang conferir a chave e a peça, coleta e ausência após carregar. Usar o roteiro normal já existente e os acessos RAM atuais, sem outro comando de debug. Aprovação artística não presumida. Pages e release não atualizados.

**Continuam separados:** costa e outros detalhes sem ocorrência/material fechado; dragon gate, vagonetes e Servo definitivo com dependências de referência/decisão; ilustrações narrativas por bloco, dependentes de orientação do responsável. Painéis/carpetes/adereços acima e os três objetos não são mais produção ausente. Revisão de aranha/título permanece em qualidade.

## Inventário auditado de assets do M02 — 20/11/2026

Conferência de arquivos, configurações e ocorrências, sem geração nem aprovação visual nova. **Não são mais pendências de produção:**

| Entregue / ocorrências atuais | Arquivos / contrato conferidos | O que permanece separado |
| --- | --- | --- |
| Pousada e corte | Map018/tileset9 e Map011/tileset10 usam `Arena_Rihad_Interiors_V01_C/D`; cama E reutilizada; pisos, paredes, tetos, molduras, tapetes, degraus, mesas/balcão, trono e ornamentos em `RIHAD_INTERIORES_EXPORTS_V01.json` | Avaliação integrada; ornamentos geométricos são interpretação, não heráldica confirmada. Não pedir novamente um atlas interior completo |
| Blubamka | Evento2 de Map011, `$Arena_Blubamka_V01` e retrato `Arena_Blubamka_V01` | Avaliação visual, sem ilustrações narrativas produzidas por consequência |
| Informante de Rihad | Map009/evento1, `$Arena_Rihad_Informant_V01` e retrato `Arena_Rihad_Informant_V01`; [registro](CHEGADA_RIHAD_M02_03A.md#informante-v01--23112026) | Produzido e integrado; avaliação visual agrupada pendente. Personagem funcional adaptado, aparência interpretada; não substitui ilustrações narrativas |
| Trio regional Redguard | Pousadeira Map018/3, guarda Map009/900 e moradora Map009/901; três retratos e quatro direções, moradora com12quadros | [Integração/avaliação pendente](CHEGADA_RIHAD_M02_03A.md#trio-regional-redguard--23112026); informante e Blubamka preservados, sem novos assets de combate |
| Fantasma | `$Arena_ghost_float_v01` e `Arena_Combat_ghost_v01`, configuração e exemplar RAM | Câmara MIF(3,49) ainda sem acesso comprovado; isto é dependência de geometria, **não falta de combate/patrulha** |
| Hell Hound | Dois encontros Map017(90,66)/(84,66), sprite e atlas lateral existentes | Avaliação visual/balanceamento; não são bloqueio de coleta do fragmento |
| Lava | Map017/tileset11, `Arena_Fang_Lava_V01_A1`,3fases | Ilha/rota e risco/proteção ainda pendentes, não textura ou animação |
| Grades/portais/estruturas | Contrato `M02_OBJETOS_DUNGEONS.json`:12grades de Stonekeep; Fang13 com12portas (11grades+portal),24suportes e364células de trilho; Fang17 com1portal | Outras ocorrências dependem da cobertura dos mapas, não de regenerar o conjunto disponível |

**O que ainda demanda arte ou decisão antes de gerar:**

| Item do inventário | Evidência / estado da referência | Situação após cenário V01 |
| --- | --- | --- |
| Painéis ornamentados de Stonekeep | `CASF.SET#3` confirmado; `STONEKEEP_MATERIAIS_M02.json` usa base castanha sem ornamento e `stonekeep-sector-a2e.cjs` mantém esse contrato | **Entregue** CASF#3 e CASK#2 nas94faces representáveis acima; demais decoração exige ocorrência/fonte própria |
| Carpete REDRUG de Stonekeep | Recurso confirmado; trechos ainda usam piso de suporte | **Reutilizado e aplicado** em1.431tiles; não exige nova geração |
| Costa e adereços específicos de Rihad | SEAWALLD/NWELL/PALM/CACTUS e demais famílias declaradas em DCN, inventário urbano existente | 117ocorrências de poço/cacto/palmeira/fonte atendidas; fonte reutilizada. Costa e outros objetos continuam separados, sem duplicar os já produzidos |
| Objetos de missão no mapa | Pergaminho Map015/evento2, chave Map013/evento3 e fragmento Map017/evento5 usam eventos sem imagem de personagem e apresentação funcional por marcadores | **Entregues** conforme PARCHFLT/KEY/CHAOS1; fontes e IDs preservados, sem nova pendência de geração desses três objetos |
| Dragon gate | Nome confirmado no texto, mas FANG1/2 não declaram DGATE; saída existente associada a MSU.IMG em(4,1) | **Exterior ainda incerto**. Face interna MSU confirmada e integrada acima; DGATE/WDUNGDR não têm vínculo exterior comprovado com Fang Lair |
| Vagonetes | Wiki cita trams; NCART1/SCART1 não associados às ocorrências dos blocos atuais | **Ainda não produzidos**: conferir volumes MIF(87,21)/(88,21) junto ao trilho(88,20); NCART/SCART não vinculados a Fang. Trilhos/suportes já estão entregues |
| Servo de Tharn definitivo | `ArenaFangCells.json.retaliation.encounter`: enemy4/troop5, **esqueleto existente** apresentado como Servo. Identidade da espécie não estabelecida por TEMPLATE#1392/wiki | Escolha provisória funcional autorizada; identificação ou orientação artística antes de criar conjunto próprio. Não contar como12ªespécie original confirmada |
| Ilustrações narrativas | Blocos ordenados e fontes em [CAMPANHA_PRINCIPAL](CAMPANHA_PRINCIPAL.md#inventário-textual), incluindo Ria, audiência e retaliação | Apresentar texto e aguardar orientação visual de cada bloco; uma ilustração por entrega. Retrato de Blubamka não substitui esses blocos |

As11espécies confirmadas possuem os dois conjuntos; não falta novo bestiário para corrigir este inventário. A revisão da aranha e modernização do título são melhorias futuras de qualidade, não assets ausentes do percurso. Contagens de desenhos/atlas restantes não são fechadas enquanto reuso, correspondências e orientação estiverem em aberto. Histórico abaixo é evidência datada, não lista vigente de pendências.


02/11/2026. Feature `feature/m02-fang-lair-celas`, dependências preservadas sobre **f27e9a9**. Núcleo de enigma/chave/portal implementado, **aguardando avaliação da amostra**. O encontro condicionado das aranhas ainda não está implementado; portanto M02-06A não está integralmente concluído. Testes manuais dos grupos de Stonekeep continuam adiados para integração; REF17/contraste continua em QUALIDADE-01.

## Atlas de mina V01

Map013 e Map017 compartilham o mesmo atlas C de 48 px nas áreas já jogáveis. `FANG1.INF` e `FANG2.INF` ligam `FLOR` às famílias MFLOORA/MFLOORD e `MAP1` às famílias MINEA–F. A classificação é feita com a tabela do nível correspondente, pois a ordem de MINEB/MINED difere entre os dois arquivos. As famílias MINEA1–C1 orientam variações minerais sem brilho de lava. Os pisos mais claros distinguem a circulação da rocha alta. Coroamentos e cortes são adaptações ortogonais da estratificação, com material secundário mais escuro nas células sem face minerária atribuível.

Os pisos e as faces foram aplicados à entrada, alas secas, celas, patamares e sala do fragmento. Escadas têm marca visual nas mesmas células de transferência. As portas, grades, tesouros e o atlas A1 existente foram reaproveitados. Os dois enigmas, as posições de patrulha, a colisão e as áreas atualmente inacessíveis não mudaram. A lava animada V01 foi integrada posteriormente, conforme registro abaixo; travessia e acesso aos ghouls da ilha continuam pendentes.

**Exportação.** Na raiz, execute `python tools/export-m02-surface-atlas.py fang` com Pillow e depois `node tools/build-rihad-arrival.cjs`. O arquivo C é gerado com pisos em período 2×2, corte de rocha, coroamento, duas fileiras de face e cantos. [Mestre, prompt e fontes](arte/m02-tilesets/sources-fang.json) · [Peças, hash e exportação](arte/m02-tilesets/exports-fang.json) · [Classificação dos dois níveis](mapas/FANG_MATERIAIS_M02.json).

**Próximo teste integrado.** Compare o contraste com o personagem e os Hell Hounds. Observe a leitura de piso e bordas de rocha da entrada à sala do fragmento, a posição das portas e a transição na escada. [Entrada](evidencias/m02-fang-atlas/entrada.png) · [Celas](evidencias/m02-fang-atlas/celas.png) · [Escada](evidencias/m02-fang-atlas/escada.png) · [Sala do fragmento](evidencias/m02-fang-atlas/sala.png) · [Verificações](evidencias/m02-fang-atlas/fang-lair.json).

## Lava animada V01 — 19/11/2026

**Material integrado; avaliação visual pendente no próximo teste de MQ02.** FANG2.INF declara `*LAVACHASM MLAVA.IMG`, piso FLOR0x0E. A consulta local identificou MLAVA/LAVA/SLAVA/DNG2LAVA com bytes idênticos, CASLAVA ligeiramente diferente e LAVAWALL distinto, sem adotá-lo como textura de Fang Lair. A MLAVA consultada é a borda recortada do abismo; o código de consulta já registrado usa animação de superfície e sobreposição na parede. A superfície ortogonal é adaptação: crosta escura, vermelho/laranja e acentos amarelos contidos, sem interpretar o fundo índice0 como lago preto. Não foi alegada observação no executável original.

Aplicada a **210 células-fonte abertas**, equivalentes a1890tiles de48px no Map017. As17células de parede sobre lava continuam volumes sólidos e não recebem superfície livre.444tiles de face/canto de rocha, nos limites das poças, reutilizam o atlas aprovado para expor a parede junto ao novo plano visual. **Todas as máscaras de passagem, regiões, eventos e condições de acesso permanecem iguais.** A lava continua bloqueada; não é água, chão seguro ou dano nativo. A ilha não foi conectada, ghouls não foram distribuídos e nenhuma regra de risco/proteção/Passwall foi criada. Cobertura segue17/19encontros no segundo nível.

Um mestre com3fases autorais alimenta o A1 nativo, sequência0→1→2→1,30frames do motor por fase. Bordas opostas do material são periódicas; a própria crosta gera a margem de5px nos quadrantes de autotile. O tileset11 é cópia dedicada do7, com A1 próprio, mantendo B/C/D, flags e água legados. Não há novo plugin, alteração do motor, velocidade global ou eventos por tile. Saves anteriores no Map017 reaproveitam a sincronização de tileset já existente, sem restaurar recursos ou trocar namespace.

[Fontes/hashes e adaptações](arte/fang-lava-v01/sources.json) · [prompt/mestre](arte/fang-lava-v01/prompt.json) · [exportação/checks](arte/fang-lava-v01/exports.json) · [células e exclusões](mapas/FANG_LAVA_M02.json). Mestre: `art/masters/fang-lava-v01/surface-source.png`; runtime: `img/tilesets/Arena_Fang_Lava_V01_A1.png`. Reconstruir com `python tools/export-fang-lava.py` e `node tools/build-rihad-arrival.cjs`. Extrações originais ficam ignoradas e fora do pacote.

[Verificação focal no Chrome157 isolado](evidencias/m02-fang-lava/resultado.json): reconstrução idempotente, comparação de todas as máscaras de passagem,3fases com pixels diferentes no mesmo recorte do renderizador, save/load com tileset antigo7→11 preservando posição/quest/inventário/recursos/pontos, caminhada seca escada→margem→fragmento→escada e retorno ao primeiro nível. Fragmento coletado uma única vez com ambos os Hell Hounds vivos; etapa100 e retaliação pendente preservadas. Fixture sintética com etapa90/recibo preparados; deslocamentos do teste de colisão avançam de modo controlado. Vídeo e medição usam velocidade normal. Sem repetir toda a campanha.

**Desempenho focal:** janela de8s após2s de aquecimento, canvas816×624/janela1050×850, Chrome headless com ANGLE/GTX1050Ti/D3D11. Cerca de60FPS antes e depois, mediana16,7ms/p95≈16,9ms; nenhuma degradação observada nessa cena. Baseline usa o Map017 anterior apenas para comparação; candidata abre sem interceptação. Instantâneos de heap JS variam com GC e não medem memória deGPU/SO nem economia atribuível à lava. Não é garantia para outros dispositivos ou áreas. Vídeo gravado separadamente da medição, em velocidade normal.

**Avaliação agrupada:** no segundo nível, seguir o caminho seco até a margem MIF(72,58), MV(63,18), observar crosta, margens, repetição, ciclo e contraste com o personagem; seguir normalmente ao segundo enigma/fragmento e retornar. Não tentar atravessar até a ilha nesta versão. [Vídeo](evidencias/m02-fang-lava/lava-ciclo-normal.webm) · [margem](evidencias/m02-fang-lava/margem.png) · [sala do fragmento](evidencias/m02-fang-lava/fragmento.png). Pages e release permanecem separados.

## Portas e objetos do M02 V01 — 19/11/2026

Conjunto visual integrado sobre `b996fb3`; **avaliação visual pendente no teste integrado**, sem aprovação presumida. As11espécies confirmadas do M02 possuem combate e patrulha; Fantasma continua com avaliação visual e acesso da câmara pendentes. Esta entrega não altera esses encontros.

| Ocorrências efetivamente aplicadas | Fonte e adaptação | Arquivo de runtime |
| --- | --- | --- |
|12 grades de Stonekeep/Map015, antes representadas por portas comuns | STKEEP1.INF `PORTCULS.IMG`, MAP1 `0xB094`, movimento original de elevação. Preservados os70IDs de porta, fechaduras, colisores e transições existentes. Outras58portas compatíveis mantêm os assets anteriores | `!$Arena_Stonekeep_Grate_V01.png` |
|11 grades das celas de Fang Lair/Map013 | FANG1.INF `MCELL.IMG`, `0xB016`;9celas condicionadas e2celas opcionais. Grade de ferro compartilhada com Stonekeep, exportada com giro. Recebem estados fechado/aberto já existentes, sem criar fechamento de celas resolvidas | `!$Arena_Mine_Grate_V01.png` |
|2portais metálicos, um por nível | `MDOOR6.IMG`, `0xB013`; painel claro envelhecido, rebites e fechadura. Folhas duplas são adaptação ao componente atual, não afirmação de arquitetura original. MDOOR1–5 não têm ocorrências nesses mapas e não foram produzidas | `!$Arena_Mine_SteelDoor_V01.png` |
|24suportes de44referências no primeiro nível | `BRACE.IMG`, `0x9138`, transparente/atravessável. Só posições já projetadas. Eixo visual escolhido pela conexão local; empate usa face frontal, adaptação. Eventos estáticos500+índice-fonte, through, sem ação ou bloqueio novo | `!$Arena_Mine_Brace_V01.png` |
|364células-fonte de trilho no piso já projetado | FLOOR_C0/C2/C4/C5/C6/C8, FLOR5/7/8/9/10/11. Retas e4curvas com dois trilhos. Orientação inferida pela continuidade das referências FLOR e convertida à grade espelhada;1106pontas compatíveis na matriz de referências FLOR contra22na leitura literal da textura. Não conectar terminais por suposição | `Arena_Mine_Objects_V01_D.png`,54tiles transparentes |

Os trilhos são camada visual de piso: mantêm terreno, regiões, cantos, flags e estados. Suportes conservam a travessia original; não incorporam pedra/piso. O segundo nível não tem suportes/trilhos declarados/aplicáveis no conjunto consultado. As20referências de suporte fora da projeção atual permanecem no [contrato](mapas/M02_OBJETOS_DUNGEONS.json); não foram transformadas em caminhos novos.

**Lacunas comprovadamente não resolvidas:** a narrativa original chama a entrada de *dragon gate*, mas FANG1/2.INF não declaram DGATE.IMG. O recurso foi consultado; não há vínculo confirmado entre ele e a entrada, cuja saída interna usa MSU.IMG em MIF(4,1). Não criar dragão/ornamento por associação de nome. A wiki cita trams como decoração, mas esses INF não declaram NCART1/SCART1 e não foi identificada sua representação/posição nos blocos. Vagonetes continuam aguardando essa correspondência antes de gerar/distribuir, sem excluir sua existência só por ausência de flat. Escadas e tesouros mantêm seus recursos funcionais anteriores; materiais/objetos ainda não confirmados e áreas inacessíveis continuam na matriz.

**Produção/reconstrução:** [fontes e hashes](arte/m02-dungeon-objects-v01/sources.json), [prompts e mestres](arte/m02-dungeon-objects-v01/prompt.json), [iterações técnicas](arte/m02-dungeon-objects-v01/iterations.json) e [exportações](arte/m02-dungeon-objects-v01/exports.json). Mestres separados em `art/masters/m02-dungeon-objects-v01`; extrações originais e edições rejeitadas ficam ignoradas. Exportar `python tools/export-m02-dungeon-objects.py`; reconstruir `node tools/build-rihad-arrival.cjs`. Frontais são redimensionados uma única vez à janela ortogonal de face136×96 dentro de célula144×144, com topo48transparente; arestas superiores são componentes próprios e pivôs/guia fixos. Nenhum recorte por quadro. Guias/fechamento não foram deslocados. Faixas de conexão dos trilhos usam os mesmos pixels das retas nos limites.

`Arena_M02DungeonObjects` atualiza somente o nome da arte das portas nos mapas serializados antigos e acrescenta suportes ausentes antes da criação dos sprites. Não reseta self-switches, posição, patrulhas, quests, itens ou recibos. Não muda namespace ou migra saves pessoais. [Verificações/capturas](evidencias/m02-dungeon-objects/resultado.json) em perfil isolado, com save19 sintético: geometria e eventos antigos comparados ao baseline, reconstrução, enigma/chave/portal, grades abertas/fechadas, proteção ao fechar e retomada. Transições de porta/fechadura são avançadas por chamadas nativas de `Game_Map.update` na fixture; não é avaliação de duração/fluidez. Sem campanha completa, novos combates ou publicação Pages/release.

**Avaliação agrupada:** seguir MQ02 normalmente; em Stonekeep, observar grades de B3 e atravessar uma aberta. Na mina, conferir suportes/trilhos, grades das celas e portal metálico; resolver o enigma na etapa correspondente e salvar/carregar. Conferir também a porta do segundo enigma. Hub atual pode ser usado para inspeção, sem novos comandos.

## Fantasma — exemplar V01 e acesso pendente — 19/11/2026

**Identidade confirmada:** FANG1.INF, flat58, `GHOST.DFA / ITEM43`; MAP1 `0x803A` em MIF(3,49), coordenadas de matriz com base0. A transformação vigente projeta o centro em MV(291,150). `GHOST1–6.CFA` do GLOBAL.BSA foram decodificados para consulta, com hashes no [registro de fontes](arte/ghost-v01/sources.json). O MIF instalado confere com o hash do levantamento. A imagem renderizada na página4 do PDF local Monsters mostra silhueta humanoide estreita, corpo cinza-escuro afilado, flutuação e olhos vermelhos. Indexar os CFA diretamente com PAL.COL produz cores diferentes; essas cores de consulta não foram tomadas como aparência literal. Não foi alegada observação executada no DOS.

**Limite de integração:** a câmara ainda não faz parte do piso conectado projetado. A ligação para a área acessível encontra MAP1 sólido em(6,49), com o trecho(7,49) junto ao poço seco ainda sem travessia demonstrada. Não abrir parede por suposição nem atribuir passagem ao voo do monstro. O encontro da campanha `fang.1.enemy.mif3.49` permanece identificado e **pendente de acesso**. A contagem ativa continua **40/76 no primeiro nível e17/19 no segundo**; disponibilidade dos assets não aumenta a cobertura.

**Exemplar disponível:** Testes / Debug → Combate → **Fang Lair · Fantasma (RAM)**, em http://127.0.0.1:8774/. Usa a sala Map016 somente em memória, sem alterar o mapa de campanha. Observar flutuação, quatro direções e contato; vencer remove somente o ID técnico `technical.fang.ghost.01`. Guardar/Carregar teste pelo menu usa snapshot RAM; slots normais são bloqueados. Voltar ao título e entrar novamente reinicia o exemplar. Não requer saves pessoais.

O original documenta Vida60–80, dano5–25, EXP=`HP×25+1500`, voo, visão de invisíveis e Spell Drain. A adaptação inicial usa Vida70, ATQ12, DEF4, MAT0, MDF7, AGI14, SOR6 e acerto90%, com o ataque físico existente. São **parâmetros provisórios**, próximos da faixa dos outros exemplares; MDF/AGI diferenciadas não equivalem a resistência ou invisibilidade originais. A EXP100 fora do laboratório é uma reserva provisória explícita, ligeiramente acima do Hell Hound90, sem conversão direta da EXP original. Nenhum encontro de campanha a concede nesta entrega. Laboratório:0EXP, sem ouro/itens. Fonte informa ausência de cadáver e loot incerto; não inventada uma tabela. Drenagem, invisibilidade, voo físico e regras especiais continuam sem implementação, para avaliação própria quando necessárias.

**Arte e reconstrução:** um mestre lateral4×4 e um direcional3×4, fundo transparente, corpo cinza sem equipamento, movimento articulado das mãos/ombros e cauda espectral. Não se simula passada de pés. Perspectivas e dissolução são adaptações ao runtime. [Prompts e mestres](arte/ghost-v01/prompt.json) · [perfil](arte/ghost-v01/profile.json) · [recortes/quadros](arte/ghost-v01/exports.json). Exportar com `python tools/export-fang-ghost.py`, reconstruir com `node tools/build-rihad-arrival.cjs`; `build-fang-cells` chama o cadastro do Fantasma sem ativar sua posição. O exportador isola a grade e remove partículas desconectadas pequenas, preservando a alfa gerada no corpo/franjas; mantém escala única e âncora. Batalha192×160/apoio150 e mapa96×96/apoio90.

[Verificação focal](evidencias/m02-fang-ghost/resultado.json): abertura limpa no Chrome isolado, quatro direções/fases, colisão, contato único,16 quadros de combate, custos/impactos, vitória e derrota, recibo único e serialização RAM antes/depois. Reconstrução idempotente e mapas/quest de campanha preservados. [Vídeo real em velocidade normal](evidencias/m02-fang-ghost/fantasma-patrulha-combate-normal.webm). A avaliação visual fica **pendente no próximo teste integrado**. Pages e release não atualizados.

## Hell Hounds da sala do fragmento

O `FANG2.INF` vincula `MAP1 0x8039` ao flat 57, `HELLHOUN.DFA / ITEM42`. O índice 10 no `ACD.EXE` instalado identifica **Hell Hound** e `HOUND@.CFA`. A consulta de `HOUND1–6.CFA` no `GLOBAL.BSA`, com `PAL.COL`, mostra o corpo canino alongado, ombros pesados, pelagem azul-negra, olhos vermelhos e derrota em brasas. O acabamento em carvão com luz fria, a mordida lateral e a projeção superior são adaptações. [Arquivos e tabelas de origem](arte/hell-hound-v01/sources.json).

| MIF | Map017 | Encontro persistente |
| --- | --- | --- |
| (63,74) | (90,66) | `fang.2.enemy.mif63.74`, evento 54 |
| (65,74) | (84,66) | `fang.2.enemy.mif65.74`, evento 55 |

Cada encontro patrulha a até um tile de sua posição em piso seco. A faixa central (X87) fica fora das duas patrulhas e permite obter o fragmento com ambos vivos. O contato e a derrota usam o registro da área, com recibo individual. A coleta e a retaliação de Tharn mantêm suas condições próprias.

O original registra nível 7, 50–75 de Vida, dano 5–25, EXP-base 1.250 e multiplicador 25. A adaptação provisória usa 70 de Vida, ATQ 14, DEF 6, MDF 5, AGI 14, SOR 5 e 90 EXP por vitória. Usa o ataque físico existente. O campo de magia original fica registrado para avaliação posterior e a recompensa atual se limita a EXP enquanto a composição do loot não for definida no balanceamento do M02.

Foram gerados dois mestres de um único exemplar. O atlas de batalha tem 16 desenhos de espera, ataque, dano e derrota. O atlas de mapa tem 12 desenhos em sul, oeste, leste e norte. O exportador mantém escala comum por folha, apoio fixo e transparência, espelhando somente o atlas lateral para a convenção do motor. [Prompts e referências](arte/hell-hound-v01/prompt.json) · [Exportação](arte/hell-hound-v01/exports.json).

No Chrome isolado, 22 grupos passaram, incluindo acesso ao fragmento com ambos vivos, as quatro animações de combate, dois retornos e recibos de 90 EXP, e save/load e reentrada com as derrotas preservadas. O teste usou caminhada acelerada e condições controladas para as vitórias. [Resultado](evidencias/m02-fang-hell-hound/fang-lair.json) · [Patrulha](evidencias/m02-fang-hell-hound/sala.png) · [Batalha](evidencias/m02-fang-hell-hound/batalha.png).

**Avaliação visual no próximo teste integrado.** No [passo do fragmento](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome), observe a patrulha de ambos os lados e recolha a peça pelo centro. Se quiser avaliar a animação lateral, salve com a peça e aproxime-se de um dos dois. Observe espera, mordida, reação ao dano e queda em brasas. A aparência, todos os quadros em movimento no contexto da campanha e o balanceamento seguem para avaliação do responsável.

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

Na entrega da verificação de lava, o Map017 e os saves permaneceram iguais, com 15/19 encontros. A cobertura atual está na tabela abaixo. As celas de tesouro LOCK 15 do primeiro nível foram integradas separadamente, conforme o registro acima.

## Conexões do primeiro nível — revisão de 14/11/2026

A revisão cruza MAP1 e FLOR de `42068779.MIF`, `FANG1.INF`, a planta publicada no guia local de Fang Lair (PDF p.5) e a descrição de salto do `Manual.pdf` instalado (PDF p.4). O layout do Map013 preserva dimensões, projeção, IDs e a rota anterior. [Matriz de passagens](mapas/FANG_COBERTURA_M02.json)

- **138 cantos transitáveis.** A orientação MAP1 `0xD0xx/0xD1xx` e as duas faces secas adjacentes determinam a passagem. Cada canto foi adaptado como um cotovelo 3×3 com dois lados livres. O eixo X continua espelhado. Sem acesso pela face sólida, sem liberar cantos isolados ou vizinhos de uma fechadura.
- **Patamar junto à entrada.** As duas ligações MIF (4,6) e (4,13) são vãos de uma célula com MAP1 vazio, FLOR `0x0C00` e piso seco nas duas extremidades. O original permite salto; nesta projeção, apenas esses dois vãos foram representados como passagens locais com o piso de transição existente. O restante do poço fica fechado. Isso torna acessível o patamar seco de 16 células entre Y7–12. A travessia exata no executável não foi testada. No [Arena local](http://127.0.0.1:8774/), entre em Fang Lair e siga ao sul pela coluna de chegada até o primeiro vão. No patamar, contorne a reentrância pelo centro para alcançar o segundo vão e volte pela rota externa.
- **Desníveis e alas pendentes.** Os blocos da praça nordeste `0x2065/0x4065/0x5865` têm diferenças de espessura confirmadas na tabela do executável, e os volumes `0x7021/0x7026` abrangem a borda da planta. A matriz mantém as paredes sólidas que cortam as rotas candidatas, incluindo o corredor sob suspeita em (82,57)–(82,59). A presença de FLOR de poço nessas células não demonstra passagem sob a parede. A ligação local (3,62) continuaria isolada da campanha. A matriz identifica os candidatos e obstruções para as seis áreas com encontros pendentes.

A cobertura do primeiro nível passa de 2.196 a **2.352 células MIF com piso transitável parcial ou integral**. O patamar não contém encontros confirmados. A cobertura do primeiro nível permaneceu em **40/76** encontros. A travessia de lava e o Fantasma permanecem dependências separadas. O segundo nível manteve a geometria e os eventos nessa revisão.

**Verificação.** O teste integrado percorre as duas travessias em ambos os sentidos, verifica as faces dos 138 cantos, recarrega um save no Map013 e repete a rota de MQ02 até Rihad. [Evidências](evidencias/m02-fang-conexoes/resultado.json)

## Alas secas dos dois níveis — M02-06B e M02-07B

A [matriz de cobertura](mapas/FANG_COBERTURA_M02.json) vincula as 95 posições originais a andar, coordenadas MIF de base zero, flat, espécie, estado e dependência. As áreas excluídas estão delimitadas nela. A leitura de MAP1/FLOR dos dois pisos de `42068779.MIF` foi cruzada com FANG1/FANG2.INF e com as âncoras anteriores. Abrimos somente os pisos secos ligados cardinalmente ao percurso, incluindo o suporte atravessável MAP1 `0x91xx` como passagem provisória. Paredes diagonais, desníveis sem equivalência confirmada e FLOR 12/13/14 de poço/água/lava ficaram fora das novas ligações. Os tiles existentes continuam provisórios.

| Andar | Geometria disponível | Encontros originais ativos | Pendentes |
| --- | --- | ---: | --- |
| Map013 | 304×301 tiles, 2.196 células MIF projetadas. Ramais da entrada e túneis centrais, corredores de acesso às celas. Coordenadas MV anteriores preservadas | 40/76; 36 novos, 4 aranhas condicionadas já existentes | 36 incluindo Fantasma (3,49), câmara junto ao poço seco. Outras bolsas e ligações nos quadrantes das aranhas do nordeste, leste, oeste sul, centro sul e salas sul |
| Map017 | 124×142 tiles, 665 células MIF projetadas. Corredores secos centrais, oeste e sul conectados à escada e à aproximação do enigma | 17/19, incluindo os dois Hell Hounds da sala do fragmento | 2 ghouls (84,61)/(87,61) na ilha cuja travessia por lava ainda falta |

Os novos encontros usam os perfis, inimigos e tabelas de recompensa existentes, com IDs individuais. IDs das quatro aranhas, do primeiro esqueleto, dos itens, recibos e etapas foram mantidos. O Servo de Tharn é um encontro narrativo separado dos 95. O Map017 ampliado desloca a projeção anterior em (+9,+51); saves no recorte antigo são convertidos pelo ponto da escada, preservando posição relativa, direção e derrotas. No entorno da sala, três células (66,74–76) foram restauradas conforme o muro do MAP1, retirando a adaptação antiga que, junto ao piso novo, permitiria contornar a porta do enigma. Saves sobre essas três células retomam no corredor seco adjacente.

As duas celas de tesouro LOCK 15 no primeiro nível já estão integradas. No segundo, os dez LOCK 10 registrados sobre MAP1 de parede são mantidos na matriz sem abrir vãos por suposição; só a porta confirmada do enigma está ativa. Permanecem pendentes a travessia de poços/desníveis e lava, ferragens/objetos específicos, arte do Fantasma e avaliação visual dos Hell Hounds e outros elementos opcionais da planta.

**Avaliação no Chrome pelo fluxo normal.** A partir da entrada, explore o ramal seco que leva ao ghoul em MIF (24,2), MV (228,9). Após descer as celas, explore o corredor seco até o esqueleto em MIF (55,90), MV (114,114). Salve após uma vitória e confira que o encontro fica ausente ao carregar. A avaliação manual do percurso principal pode ocorrer em paralelo pelo roteiro abaixo. [Arena local](http://127.0.0.1:8774/) · [Teste integrado](evidencias/m02-fang-alas/resultado.json)

## Retaliação de Jagar Tharn — M02-08

No original, após a coleta do fragmento, a visão pode ocorrer onde um encontro aleatório seria possível. O guia local de Fang Lair descreve o ataque de um servo após a visão (pp.4–5). O `TEMPLATE.DAT #1392` da instalação confirma a fala, a ponte dos sonhos, a ameaça de tomar a peça e a chegada dos servos. A espécie e a regra de seleção do atacante não foram confirmadas. [Inventário textual](CAMPANHA_PRINCIPAL.md#inventário-textual)

Na campanha, **Saída da mina** (Map013, MV 288,9) dispara a visão na etapa 100 com o fragmento no inventário. Os blocos `MQ02.fang.retaliation.01` e `MQ02.fang.retaliation.02` usam a janela em largura integral. Ao fechar o último bloco, o jogo registra `fangTharnVisionRead` e inicia a batalha. Um save anterior com essa leitura já registrada entra diretamente no combate ao interagir com a saída. Se faltar a peça, o jogador pode voltar à fonte no segundo nível.

O **Servo de Tharn** usa o esqueleto existente (Enemy 4, Troop 5) como adaptação provisória. O visual de morto-vivo combina com a ameaça de Tharn e reaproveita o exemplar já presente nas profundezas de Fang Lair. O nome é exclusivo da instância desta batalha. Mantém os parâmetros do esqueleto de campanha, com **50 EXP e sem sorteio de ouro ou itens**. A arte definitiva e a orientação visual dos blocos ficam para outra entrega.

A derrota segue para Game Over. Uma vitória legítima registra `fangRetaliationWon`, conclui MQ02 na etapa 110 e atualiza o diário. O fragmento permanece no inventário. Ao voltar ao mapa, uma nova interação com a saída leva a Rihad. É possível voltar à mina após a conclusão e sair novamente sem repetir visão, batalha ou recompensas. Nenhuma quest seguinte é iniciada.

### Roteiro no Chrome a partir de um save com o fragmento

[Roteiro integrado de MQ02 no Chrome](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

A rota principal de MQ02 está completa. Ainda faltam alas e encontros aplicáveis dos dois níveis, e a arte definitiva de ambientes. Avaliação manual pendente. [Evidências](evidencias/m02-fang-tharn-encontro/resultado.json)

## Sala e primeiro fragmento — M02-07B, trecho de campanha

A porta do enigma abre o acesso à sala no Map017. O percurso mantém a escala e a transformação existentes: na projeção atual, MV (87,60) é a porta MIF (64,72), MV (87,63) é o vestíbulo MIF (64,73) e MV (87,69) é o fragmento MIF (64,75). O vestíbulo de uma célula e o salão de 3×3 seguem a planta do segundo `LEVL` de `42068779.MIF`. O contorno usa `MAP1` (parede perimetral `0x70B7` e ombreiras `0x3131/0x3030`) e mantém o retorno pela mesma porta. As superfícies existentes e o marcador textual do fragmento são provisórios. [Planta e âncoras](mapas/FANG_NIVEL2_M02.json)

| Evidência local | Consequência no recorte |
| --- | --- |
| `FANG2.INF`, `MAP1 0x8066` em (64,75), flat102 `CHAOS1.DFA / ITEM13` | Fonte estável `fang.staff-piece-1`, item importante 9 do projeto, sem venda, descarte ou uso |
| `MAP1 0x8039` em (63,74) e (65,74), flat57 `HELLHOUN.DFA / ITEM42` | Posições originais em MV (90,66) e (84,66). São encontros da sala. O guia descreve formas de evitar o ataque; o corredor central e o fragmento são registros independentes. A única `LOCK` da sala é a da porta e o `TRIG 64,73,255,28` fica no vestíbulo. A função exata desse gatilho não foi verificada no executável. Os dois encontros foram integrados posteriormente, conforme o registro acima |
| `TEMPLATE.DAT #1371`, arquivo da instalação original, e guia local de Fang Lair, p.4 | A coleta usa o bloco PT-BR `MQ02.fang.fragment.take`, em largura integral, com a ilustração pendente. A referência tátil do original foi condensada na pulsação do fragmento |

A coleta registra o item e a passagem 90 → 100 em conjunto. O diário marca o fragmento como obtido e indica a saída. A missão segue em andamento até a vitória contra o Servo de Tharn. Se faltar a peça na etapa 100, a mesma fonte repõe apenas a unidade ausente, sem repetir a narração ou avançar a missão. Um save anterior do Map017 carrega a nova lista de eventos mantendo posição, direção e estados individuais.

**Ponto seguro de retomada.** Após coletar, suba e salve no patamar do primeiro nível (Map013, MV 36,296). A visão de Tharn intercepta a saída da mina com a peça em posse. A batalha começa ao fechar o último bloco. Se o save já estiver em Rihad, volte à mina para testar o gatilho.

### Continuação do roteiro no Chrome

[Roteiro integrado de MQ02 no Chrome](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

Validação focal no Chrome em origem e perfil descartáveis. Foram conferidos o mapa serializado da versão anterior, a coleta e leitura sem imagem, o diário, salvar/carregar antes e depois, a recuperação sem nova narração e o retorno pela escada até Rihad. Avaliação manual pendente. [Evidências](evidencias/m02-fang-fragmento/resultado.json)

## Segundo nível até o enigma — M02-07A (histórico)

Após abrir o primeiro portal, interaja com a escada para descer ao Map017. O recibo da chave autoriza a travessia. A escada inversa retorna ao patamar do Map013. A porta inferior abre na etapa 90 e permite prosseguir à sala do fragmento.

A planta usa o segundo `LEVL` de `42068779.MIF` e `FANG2.INF`. A textura `MSU.IMG` identifica a escada de retorno em MIF (88,98). O gatilho `TRIG 64,71,0,18` referencia TEXT0. O `LOCK 64,72,255` e a célula MAP1 `0xB013` identificam a porta. A rota selecionada percorre 51 células, contando as extremidades (88,97) e (64,71). [Planta e âncoras](mapas/FANG_NIVEL2_M02.json)

O recorte espelha X e usa escala 3, margem 2 e tiles provisórios. As células registradas como `adaptedBoxes` representam volumes do MAP1 convertidos em piso caminhável na grade, incluindo a aproximação seca da porta. Lava, alas adjacentes e a sala além do batente ficaram fora do recorte. O esqueleto na posição original (86,75), `SKELETON.DFA / ITEM38`, usa patrulha, batalha e recompensas existentes. O enigma depende da resposta, sem condição de derrotar o encontro.

A janela paginada usa toda a largura de leitura. As respostas do original em torno de `glove` e `gauntlet` correspondem a **Uma luva ou manopla**. As outras alternativas são adaptações para o seletor nativo. Erro e cancelamento preservam etapa 80. O acerto registra `fangLowerExplored` e avança para 90. A etapa e o objetivo persistido determinam a colisão e a aparência da porta após carregar ou retornar. O diário aponta para o fragmento.

### Roteiro único no Chrome

[Roteiro integrado de MQ02 no Chrome](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

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

[Roteiro integrado de MQ02 no Chrome](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

Cinco grupos passaram em Chrome 157 com perfil e slots descartáveis. O teste usou a entrega real a partir de uma fixture com pergaminho e acelerou apenas a caminhada e uma vitória. Cobriu cancelamento, travessia, combate, saves antes e depois da abertura, retorno e retomada de um Map013 da amostra. A reconstrução também passou. [Resultado automatizado](evidencias/m02-fang-campanha/resultado.json).

O teste manual continua pendente. Para completar Fang Lair, faltam os demais setores, conexões e encontros do primeiro nível, arte definitiva, segundo nível, segundo enigma, fragmento e retaliação. Naquela revisão, Fantasma e Hell Hound ainda precisavam de combate e patrulha; situação vigente no inventário abaixo. O servo de Tharn segue sem identificação.

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
| Fantasma, GHOST.DFA / ITEM43, MIF (3,49) | 1 | 0 | 1 | V01 disponível em RAM; avaliação visual pendente | V01 disponível em RAM; acesso da câmara pendente |
| Hell hound, HELLHOUN.DFA / ITEM42, MIF (63,74)/(65,74) | 0 | 2 | 2 | **Integrado** | **Integrada** |
| **Total** | **76** | **19** | **95** | **0 conjuntos ausentes; avaliação pendente** | **0 conjuntos ausentes; avaliação pendente** |

O fragmento em MIF (64,75) resolve `CHAOS1.DFA` / ITEM13 e fica fora da contagem de criaturas. A aranha das celas foi identificada como a mesma espécie de Stonekeep pela combinação **SPIDER.DFA + ITEM40**. Quatro das 24 posições ficam nas celas condicionadas e usam encontros persistentes. A tabela acima registra a situação dos demais encontros. A matriz de Stonekeep tem 9 espécies com ambos os conjuntos disponíveis. O M02 soma **11 espécies distintas confirmadas** até aqui, das quais **0 estão sem combate ou patrulha**. O Hell Hound já está integrado nas duas posições; o Fantasma tem ambos os conjuntos disponíveis em RAM, com avaliação visual e ativação da posição original pendentes de acesso. Não confundir11 espécies com95 encontros nem disponibilidade com aprovação. Os arredores adaptados de Rihad reaproveitam o rato. [Levantamento urbano](CHEGADA_RIHAD_M02_03A.md#m02-03e1--planta-reconstruída-e-inventário-visual).

O servo de Tharn fica **fora da contagem** até identificar a espécie ou regra de seleção. O relato da wiki e TEMPLATE #1392 estabelecem a retaliação, sem associá-la ao fantasma, aos hell hounds ou a uma criatura específica. Registrar também o possível comportamento de fogo dos hell hounds como dependência de design, sem decidir regras de combate neste inventário.

### Famílias visuais de Fang Lair

| Família | Referência original | Decisão frente aos atlas existentes |
| --- | --- | --- |
| 1. Pisos de mina | MFLOORA/MFLOORD, MFLOORB, FLOOR_C | **Entregue** no atlas `Arena_Fang_Mine_V01_C`, aplicado aos dois níveis; reuso legado só onde explicitamente mantido |
| 2. Paredes, cortes e tetos | MINEA–F, variantes MINEA1–C1 | **Entregue** no mesmo atlas C, com famílias MINE e aplicações por nível; outras áreas exigem classificação, não geração automática de outro atlas |
| 3. Portas, celas e dragon gate | MDOOR1–6, MCELL, entrada descrita no PDF p.3 | MCELL/MDOOR6 integrados nas ocorrências atuais V01. Dragon gate segue sem associação visual confirmada; MDOOR1–5 sem ocorrências atuais |
| 4. Desníveis, poços, escadas e travessias | MSD/MSU, PIT, poços, túneis e escadas da planta | **Adaptar** componentes e geradores. Sem equivalência de travessia provada para cada trecho |
| 5. Água, lava e bordas | MWATER, MLAVA, valores de FLOR e planta do nível inferior | Água legada preservada. A1 de lava V01 integrado no segundo nível, com avaliação visual pendente; rota/risco/proteção continuam separados |
| 6. Estruturas e objetos de mina | BRACE, trilhos, vagonetes, barris, tochas, pilastras | BRACE/trilhos V01 integrados onde o piso já está projetado. Reusar tochas/barris compatíveis; vagonetes aguardam posições/recurso confirmados. Chave, pergaminho e fragmento permanecem separados |

**Inventário vigente.** Seis famílias de mina; exportações C(superfícies), D(trilhos) e A1(lava), além das folhas independentes de portas/grades/suportes. Não contar cada SET original como atlas. Permanecem lacunas de objetos/áreas sem correspondência confirmada, dragon gate/vagonetes e apresentação narrativa. A travessia da lava depende de rota e regras próprias, não de mais uma textura. Rihad mantém seus registros de exterior/interiores separados.

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
