# M02-03A — primeira chegada a Rihad

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
- **Delta da amostra.** Map009 e Map011 preservam a chegada e a audiência já jogáveis, mas a estrada, o repouso e o informante têm coordenadas autorais. Reposicionar seus eventos pela rota identificada. Manter as fachadas e acessos urbanos, incluindo os quarteirões sem serviço implementado. Confirmar a variante e o interior do palácio, a margem costeira e a prioridade de decoração antes da arte final.
- **Entidades.** A composição MAP1 resolve 367 referências a flats no DCN, entre NPCs e objetos, **zero registros de criatura hostil por ITEM 32–54 ou inimigo humano por ITEM 55–72**. O arquivo declara `RAT1.DFA`, mas esse flat não está colocado. Os quatro ratos de Map010 são uma adaptação já coberta pelo catálogo. O dado não conta guardas e encontros dinâmicos do executável ou interiores não abertos.

### Famílias visuais de Rihad

`DCN.INF` é a referência desértica de céu limpo. A reconstituição tem piso de rua, passeio, terreno seco e margem inundada. As texturas de clima e os detalhes dos interiores ficam fora desta contagem. Famílias são conjuntos funcionais de módulos, não a quantidade de arquivos IMG/SET declarados.

| Família | Referência original | Decisão frente aos atlas existentes |
| --- | --- | --- |
| 1. Rua, passeio e terreno aberto | NROADD, NSIDWALD, NGRASSD | **Nova**. O piso claro de `Arena_Dungeon_M14_R03` serve na prova de percurso, como placeholder |
| 2. Fachadas, coberturas e vãos comuns | DMBS1–3, DMEQUIP, DMTAVERN, DMMUGUIL, DMTEMPLE, DMNOBLE | **Nova**. Separar módulos residenciais e institucionais. Adaptar componentes de portas onde a silhueta for compatível |
| 3. Muralha, portão e fachada da corte | CITYWALD, DLGTD, DRGTD, DGATE, BK01/02PALD | **Nova**. Reaproveitar o contrato de colisão/âncora das portas. O atlas castelhano de Stonekeep só serve como referência modular |
| 4. Costa e transições | SEAWALLD, FLOR 13 | **Adaptar** a superfície existente `Arena_Water_M14_R02_A1` e conferir margem/porto antes de escolher o acabamento |
| 5. Adereços urbanos e flora | NLAMP1, NWELL, NFOUNT, CACTUS, PALM | **Mista**. Reusar vasos, luzes e pedra onde houver equivalência. Poço, fonte, palmeira e cacto exigem desenho próprio quando necessários ao setor |
| 6. Interior obrigatório da corte | Conjunto de palácio original, variante ainda a conferir | **Em confirmação**. O Map011 permanece utilizável como corte provisória |

**Contagem de planejamento.** Seis famílias urbanas. Um atlas modular exterior novo é a unidade mínima para rua, fachada e fortificação. Costa pode dividir esse atlas com a superfície já existente. Um atlas interior separado depende da variante do palácio e da capacidade de acomodar suas peças. Informante e Blubamka têm representações provisórias reutilizáveis no teste de mapa. A caracterização futura de Blubamka não é item do atlas nem exige imagem narrativa agora.

**Próximo recorte jogável.** Importar a estrutura da cidade com os tiles disponíveis como provisórios, testar carregamento e medir a rota contínua **portão urbano → esplanada → portão interno → corte existente**. Transferir os gatilhos de chegada, informante, repouso e estrada por seus IDs atuais. Começar por essa ligação antes de finalizar outros quarteirões, mantendo-os no inventário da planta. [Contagem conjunta de criaturas do M02](FANG_CELAS_M02_06A.md#inventário-de-criaturas-e-materiais-do-m02) e [texto da campanha](CAMPANHA_PRINCIPAL.md#inventário-textual).
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
