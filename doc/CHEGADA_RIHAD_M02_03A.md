# M02-03A — primeira chegada a Rihad

## Fachadas e adereços de Hammerfell V01 — 23/11/2026

Complemento visual modular, sem novos serviços/interiores: [mestre, prompt, referências e correção de projeção](arte/hammerfell-facades-v01/generation.json), [exportação/recortes/hash](arte/hammerfell-facades-v01/exports.json), [prancha](arte/hammerfell-facades-v01/review.png) e [21 ocorrências explícitas](mapas/RIHAD_FACHADAS_V01.json). Base arquitetônica DCN.INF/CITYW1 já reconstruída; panos/cores/madeira complementados pela direção regional Redguard. Colocações de adereços, padrões e símbolos são **interpretações artísticas**, não objetos/nomes canônicos demonstrados pelo original. Atribuição das oito referências complementares conserva as ressalvas do conjunto de NPCs.

Doze módulos: toldo ferrugem/creme e toldo teal/ocre, cada qual para fachada sul e leste; postigos nas duas orientações; placa de cama; placa residencial; vaso+cesto; sacos; caixas; detalhe vazado de madeira. Reuso de portas/portões/atlas urbano, placas textuais e serviços existentes, fontes/poços/vegetação, interiores e carpete; não duplicados. Sem gerar novas portas por associação. Símbolo de cama somente na pousada funcional, símbolo de casa em residências que mantêm aviso de interior fechado. Sem balcão comercial ou promessa de serviço ausente.

Aplicação na pousada (entrada313,42), casas próximas334,45/336,64/366,67/369,88/373,96 e adereços laterais. Não aplica toldos em templos/corte sem referência de função; o trecho final da corte conserva a apresentação existente. Toldo lateral foi corrigido de perspectiva oblíqua para projeção superior retangular. Exportação preserva alpha, escala uniforme por módulo e células48px; peças independentes de piso/parede. `python tools/export-hammerfell-facades.py` e `node tools/build-rihad-arrival.cjs` recompõem atlas/colocações. Folha D exclusiva do tileset6/Map009; camada3, flags estrela16, sem alterar geometria, regiões, eventos ou passagem nativa. Não modifica Rihad interior, Stonekeep ou Fang Lair. Os adereços são visuais, não recipientes de loot.

[Capturas e verificação focal](evidencias/hammerfell-facades-v01/resultado.json): passagem comparada ao baseline em todas as células alteradas, eventos e outras camadas iguais, circulação pousada/casas/corte, entrada/saída da pousada e save/load sintético isolado. Passos naturalmente crescem durante caminhada; atores, inventário, recursos e estado persistente são preservados. Saves pessoais e namespace intactos. Avaliação visual junto aos NPCs no próximo teste integrado; sem aprovação presumida. Pages ainda serve a prévia acumulada de NPCs `d04cc5a`; este atlas aguarda a próxima publicação agrupada. Release no fechamento.

## Quatro variantes de Hammerfell — 23/11/2026

Complemento reutilizável do trio V01, sem substituir informante, Blubamka ou os três conjuntos anteriores. [Folha comparativa](arte/hammerfell-variants-v01/review.png) · [prompts, mestres e referências](arte/hammerfell-variants-v01/generation.json) · [recortes, exportações e hashes](arte/hammerfell-variants-v01/exports.json). As mesmas oito referências arquivadas são usadas com as ressalvas de autoria do registro anterior: contexto Arena/Skyrim/Redguard, não cópia de cidadãos nomeados ou uniforme canônico. Idades, feições, ocupações, roupas e posições adicionais são interpretações do projeto.

| Variante | Ocorrência em Map009 | Distinção e comportamento |
| --- | --- | --- |
| Morador idoso | evento902, `rihad.regional.elder.01`,350,30 | Cabelo/barba brancos, rosto longo, colete ameixa e faixa ferrugem; quatro poses imóveis, vira para conversar |
| Artesã | evento903, `rihad.regional.artisan.01`,316,45 | Pele mais escura, cachos/faixa, mangas dobradas, avental dividido e estojo; circuito316–318/45–47 |
| Viajante | evento904, `rihad.regional.traveler.01`,350,40 | Silhueta larga, bigode, turbante ocre, casaco azul/cinza, bolsa lateral; circuito350–352/40–42 |
| Guarda variante | evento905, `rihad.regional.guardvariant.01`,351,371 | Mulher, rosto/lenço baixo e fechos diferentes do guarda anterior; equipamentos da mesma família, quatro poses imóveis |

Todos os quatro têm falas breves e retratos144×144. Artesã/viajante possuem12quadros articulados por folha; idoso/guarda possuem4poses reais repetidas nos padrões nativos, sem alegar caminhada. Células48×64, apoio62 e altura até56px, escala uniforme por personagem e alpha original preservado. `python tools/export-hammerfell-variants.py` exporta mestres de `art/masters/hammerfell-variants-v01`; `node tools/build-rihad-arrival.cjs` aplica a configuração existente `RIHAD_NPCS_M02.json`. Materiais, geometria, eventos antigos, quests, recompensas e serviços não alterados. Uniformes/armas são visuais: não acrescentam combate.

Falas limitadas a placas, caminhos públicos e ambientação, sem antecipar destinos secretos. Não há compra/venda ou profissão jogável. Os personagens móveis usam rotas curtas não ignoráveis, pausam ao conversar e respeitam colisões; as vias obrigatórias e entradas permanecem livres. O contrato de carregamento existente insere somente os novos IDs ausentes em saves urbanos antes de criar os sprites, preservando os estados já presentes. Não muda namespace nem toca saves pessoais.

[Capturas e resultado focal](evidencias/hammerfell-variants-v01/resultado.json): leitura e retratos, quatro direções/quadros móveis, colisões, caminhos até pousada/corte, reconstrução e retomada em perfil isolado. Avaliação visual do responsável permanece pendente, agrupada no próximo teste integrado. Roteiro: conversar com informante na chegada; observar idoso, moradora e viajante junto ao passeio; seguir placas Pousada, conversar com artesã e responsável; ir à corte e comparar os dois guardas. [Publicação acumulada verificada](PAGES_INFRA.md#prévia-acumulada-de-npcs-de-hammerfell--23112026), fonte `d04cc5a8a65ca18796dd196dfd097faf4e4aaf7d`; inclui informante, trio e variantes. Release continua no fechamento.

## Trio regional Redguard — 23/11/2026

Três personagens reutilizáveis, produzidos com `image_gen` nativo, sem acrescentar serviços ou quests. [Referências/atribuições/prompts integrais](arte/rihad-npcs-v01/generation.json) · [mestres, recortes, hashes e exportações](arte/rihad-npcs-v01/exports.json) · [prancha dos três conjuntos](arte/rihad-npcs-v01/review.png). As oito imagens fornecidas foram consultadas; associação a material de jogo, montagem/capa e ilustrações de autoria incompleta é registrada sem atribuir estatuto oficial por suposição. Contexto oficial complementar: [Bethesda — Redguard](https://elderscrolls.bethesda.net/en-US/redguard). Esses NPCs, suas características e suas posições adicionais são interpretações do projeto, não personagens nomeados/uniformes canônicos do original.

| Papel | Conjunto e integração | Comportamento |
| --- | --- | --- |
| Responsável pela pousada | Map018/evento3, posição42,54, `Arena_Rihad_Innkeeper_V01`: pele castanha, tranças/lenço azul, vestido ferrugem, avental e roupa civil | Substitui o reuso masculino no posto existente; fala de quarto gratuito preservada, agora com retrato. Quatro poses estáticas, vira ao interlocutor |
| Guarda de Rihad | Map009/evento900, `rihad.guard.court.01`,359,371, `Arena_Rihad_Guard_V01`: pele mais escura, turbante claro, couro/metal discreto, lâmina curva embainhada e escudo | Fora do vão da corte. Orienta pousada/corte/portão conforme informação pública; não bloqueia a audiência, cria combate ou revela Stonekeep/Fang Lair. Quatro poses estáticas |
| Moradora | Map009/evento901, `rihad.civilian.square.01`,347,22, `Arena_Rihad_Civilian_V01`: pele cobre/oliva, cabelos grisalhos trançados sem turbante, casaco índigo/lenço ocre | Caminhada real em quatro direções, circuito347–349/22–24 na área livre junto ao passeio. Diálogo curto sobre placas; nenhum serviço, quest ou prêmio |

Todos possuem retrato144×144 para o diálogo e folha144×256/células48×64. Escala uniforme por conjunto, apoio nominal62, sem espelhamento de lados/arma ou translação de pose estática como caminhada. Pousadeira/guarda: quatro desenhos, padrões nativos repetidos por direção, **não animação de caminhada**. Moradora:12desenhos articulados, braços/pernas/tecido variam; movimento nativo, colisão e pausa de evento durante conversa. `python tools/export-rihad-npcs.py` recompõe as imagens com alpha real preservado; `node tools/build-rihad-arrival.cjs` aplica [configuração de personagens/rotas](mapas/RIHAD_NPCS_M02.json) por `tools/rihad-npcs.cjs`. Geometria, entradas e eventos existentes preservados.

**Saves:** nenhum namespace novo. Guarda/moradora ausentes em Map009 serializado são inseridos antes de criar os sprites; entradas já existentes mantêm posição/índice da rota, sem recriação/duplicação. A pousadeira recebe a nova imagem e orientação do mesmo evento3. Slots de laboratório continuam bloqueados. Sem limpar ou migrar saves pessoais.

**Comparação com existentes:** informante V01 mantém paleta/colete próximo ao cidadão genérico de Arena; tem menos panos enrolados que Alik’r, mas continua uma variação civil a avaliar. Blubamka V01 mantém brocado azul/bordô, circlete régio e cabeça descoberta: ocupação distinta não obriga adotar lenço. A wiki local `Arena_People`, p.3, a identifica como mulher Redguard; rosto e traje continuam interpretados, e o prompt histórico não foi reescrito. Ambos preservados por [hash de seis arquivos](arte/rihad-npcs-v01/preserved.json); não transformar diferenças em defeito ou substituição automática. [Medição na escala final](arte/rihad-npcs-v01/scale-comparison.json): informante60px, Blubamka44px visíveis/frente apenas, trio novo até56px/quatro direções. Registrar essa diferença aparente para avaliação de conjunto; não redimensionar os anteriores silenciosamente.

[Capturas da pousada](evidencias/rihad-npcs-v01/pousadeira-dialogo.png), [guarda](evidencias/rihad-npcs-v01/guarda-depois-ria.png), [moradora](evidencias/rihad-npcs-v01/moradora-dialogo.png) e [acesso à corte](evidencias/rihad-npcs-v01/acesso-corte.png). [Validação focal](evidencias/rihad-npcs-v01/resultado.json): quatro direções/padrões em execução, circuito/corpos sólidos, textos/retratos, ausência de alteração de ator/party/store, alcance da corte/cama/saída, save antigo com sprites visíveis/únicos e retomada da rota nativa. [Regressão do informante](evidencias/rihad-npcs-v01/informant-regression.json) reaproveitada após acomodar os novos IDs, sem reabrir sua arte; Ria/Blubamka mantêm suas evidências válidas. Perfil Chrome isolado, sem saves pessoais.

Referência funcional verificada: `731a22baa869b81424e7057302062ed5ab71d541`. [Pacote conferido](evidencias/rihad-npcs-v01/pacote.json):425 arquivos de runtime, checksums e referências válidos, namespace `arena:m01:save-v1`, debug desabilitado no perfil de jogador; sem distribuir mestres, documentação ou saves. Não publicado.

**Roteiro integrado futuro:** no caminho da chegada à pousada, observar a moradora e conversar; entrar na pousada, falar com a responsável, acessar o quarto e sair; na ida à corte, falar com o guarda ao norte da grade e continuar pela entrada existente. Setas/Enter e clique usam os mesmos componentes. Acesso RAM já existente **Testes / Debug → Campanha e mapas → Rihad · chegada nível 1 (RAM)** permite inspecionar moradora/pousada; **Rihad · audiência (RAM)** e saída da corte encurtam o acesso ao guarda. Sem novo laboratório ou comando no título.

Avaliação visual do trio agrupada ao próximo teste integrado, sem aprovação presumida. Registro histórico anterior à publicação acumulada acima: consulta do manifesto em23/11/2026 apontava `7597fd7de672132c866947a961ea335b5e874264`; informante `7e4dbac` e trio aguardavam publicação, atendida pela prévia acumulada acima. Release continua separada. Inventário de inimigos, lava, viagens, descoberta, custos de descanso e fluxo MQ02 não alterados.


## Informante V01 — 23/11/2026

Map009/evento1 mantém posição(348,12), interação e colisão. Novo conjunto próprio: `$Arena_Rihad_Informant_V01` e retrato `Arena_Rihad_Informant_V01`, distinto do protagonista antes reutilizado e de Blubamka. Civil masculino com barba/cabelo grisalhos, tecido vermelho desbotado, túnica verde, colete ocre e calças azul-esverdeadas: **interpretação artística**, não aparência canônica de um NPC nomeado. `MLGEN01D.CFA`/varianteT e moradores/raças na wiki local foram consultados; não foi alegada observação no jogo DOS ou identificação de um informante único no original.

[Prompt integral, ferramenta e referências](arte/rihad-informant-v01/generation.json) · [mestre/recortes/exportações e hashes](arte/rihad-informant-v01/exports.json). Mestre1774×887; retrato144×144; folha144×256/células48×64, figura22×60 e apoio62. Usa **somente a pose imóvel para baixo**, porque o evento já era fixo; três padrões frontais iguais, demais direções transparentes. Não representa uma caminhada ou poses novas não necessárias. Alpha real gerado preservado; recorte técnico delimitado por conteúdo significativo, sem repintura. `python tools/export-rihad-informant.py` e `node tools/build-rihad-arrival.cjs` recompõem os consumidores.

Retrato nas mensagens do informante por parâmetro opcional do apresentador existente; margem168px e paginação nativa. Falas, indicação da pousada/arredores antes de Ria, corte após Ria e portão nas etapas correspondentes preservadas. A transição20→30 continua única e existente. A placa Informante foi elevada para não encobrir a cabeça. Retrato não substitui nem autoriza as ilustrações narrativas por bloco.

[Captura na cidade](evidencias/rihad-informant-v01/cidade.png) · [antes de Ria](evidencias/rihad-informant-v01/antes-de-ria.png) · [após Ria](evidencias/rihad-informant-v01/depois-de-ria.png) · [orientação de viagem](evidencias/rihad-informant-v01/orientacao-portao.png) · [verificações](evidencias/rihad-informant-v01/resultado.json). Chrome isolado: aproximação pela rota, teclado/clique, colisão, retrato e páginas nas etapas10/20/30/40/50/60, ausência de alterações em recursos/atores/MQ01/Ria/loot, RAM sem slots e save normal sintético com sprite antigo reapresentado sem perder estado. Regressão de Blubamka reutilizada: audiência/aceitação/entrega e texto compartilhado sem retrato preservados. Não houve teste em save pessoal.

Referência funcional verificada: `452d7c20ae2e6651aa07c185814cb631a48942ae`. [Pacote web conferido](evidencias/rihad-informant-v01/pacote.json):419 arquivos, referências e checksums válidos, sem mestres/documentação/saves distribuídos; não publicado.

**Avaliação visual pendente**, agrupada ao próximo teste integrado. Acesso local `http://127.0.0.1:8774/`: no percurso normal, conversar com o informante junto à chegada e conferir retrato/legibilidade, avançando as páginas. Comparar orientações nos checkpoints pré/pós-Ria disponíveis, sem exigir refazer a dungeon ou rever a visão já aprovada. Inspeção direta existente: **Testes / Debug → Campanha e mapas → Rihad · chegada nível 1 (RAM)**. Nenhum comando técnico novo. Saves antigos recebem apenas a apresentação atual do evento; não mudam namespace, posição, quest ou recursos. Pages e release ficam separados.


## Atlas exterior V01

O Map009 usa um atlas dedicado ao percurso portão → esplanada → corte e aos quarteirões com as mesmas superfícies. Rua clara, passeio de blocos escuros e terreno ocre seguem `FLOR` do CITYW1 reconstruído. Fachadas, muralha, portal da corte, sebe e vãos de jardim usam famílias derivadas dos registros `MAP1`/DCN.INF. Cantos e jambas ocupam o lado sólido. Soleiras, folhas abertas representadas lateralmente e o muro baixo ao pé das sebes são composições ortogonais do projeto. Os 30 vãos utilizáveis e os dois sem travessia mantêm sua lógica. A costa continua provisória.

| Reuso | Módulos que faltam |
| --- | --- |
| Blubamka V01 (sprite/retrato) e cama E preservados; pousada e corte usam os [interiores V01](#interiores-v01-e-correção-da-cama--19112026), com pisos, paredes, caps, molduras, tapete, degraus e mobiliário. | Poços, cactos, palmeiras e fontes têm117ocorrências atendidas no [cenário V01](FANG_CELAS_M02_06A.md#cenário-confirmado-v01--20112026); costa e outros objetos permanecem separados. Avaliação visual não equivale a produção ausente. |

**Exportação.** Na raiz, execute `python tools/export-m02-surface-atlas.py rihad` com Pillow e depois `node tools/build-rihad-arrival.cjs`. O exportador monta um C nativo com células de 48 px, pisos em período 2×2, coroamento e duas fileiras de face. O gerador mantém B e A1 do tileset-base e reaproveita seus módulos de repouso. [Mestre, prompt e fontes](arte/m02-tilesets/sources-rihad.json) · [Peças, hash e exportação](arte/m02-tilesets/exports-rihad.json) · [Matriz de atribuição](mapas/RIHAD_MATERIAIS_M02.json).

**Próximo teste integrado.** Observe a leitura do personagem junto ao portão, percorra a esplanada, atravesse um arco confirmado e entre na corte. A avaliação visual do exterior está pendente. [Capturas do portão](evidencias/m02-rihad-atlas/portao.png), [esplanada](evidencias/m02-rihad-atlas/esplanada.png), [jardim](evidencias/m02-rihad-atlas/jardim.png) e [corte](evidencias/m02-rihad-atlas/corte-exterior.png) · [Verificações](evidencias/m02-rihad-atlas/resultado.json).

## Fechamento funcional de Rihad

Os dois vãos de jardim são `0x913B` (`GARDENGD.IMG`, atravessável) entre sebes sólidas `0x903A`. Cada um tem piso seco em uma face e parede sólida `DMNOBLE.SET` na face oposta, sem sobreposição em MAP2. O Map009 conserva os 30 arcos que ligam dois pisos e deixa estes dois sem travessia:

| Vão MIF → MV | Única face livre | Volume oposto |
| --- | --- | --- |
| (52,8) → (228,27), NBBD1C | Oeste | MIF (53,8), MAP1 `0x3838` |
| (57,72) → (213,219), NBBD1D | Norte | MIF (57,73), MAP1 `0x3939` |

O Map011 usa o salão de `PALACE2.MIF`. O acesso de Rihad segue pelo mesmo portão urbano. [Seleção, planta e limites da corte](CORTE_RIHAD_M02_03D.md#interior-palace2--referência-vigente)



## Interiores V01 e correção da cama — 19/11/2026

**Relato público da revisão 0d8f209:** o responsável não conseguiu interagir com a cama. Descanso e visão continuam sem aprovação manual. Não foi fornecida a posição exata do personagem. Foi reproduzida uma falha ao chegar pelo fluxo da campanha ao lado da cabeceira, MV(64,9): Enter e clique na cabeceira mantiveram a Vida em12. O evento estava ativo em(63,10), gatilho0, prioridade0 e sem condições de página restritivas. Sua validação usava apenas distância até o pé, enquanto a imagem e a colisão ocupavam(63,9) e(63,10). Os testes anteriores só cobriam a posição ao pé.

A correção declara a área de dois tiles em `ArenaRecovery.json`, usa essa área para proximidade, indicação, teclado e clique e mantém um só evento/uma só recuperação. O evento passa a prioridade normal. Clicar na imagem pode aproximar o personagem até um tile acessível; outra entrada cancela essa aproximação. Os demais refúgios preservam o contrato de um tile. Saves com o evento antigo no interior são atualizados ao carregar; o ID do descanso, a posição do jogador e o estado da visão permanecem.

**Interiores integrados:** pousada TAVERN4 e corte PALACE2 usam os atlas próprios C/D V01. A cama E existente é reaproveitada. A [configuração visual](mapas/RIHAD_INTERIORES_VISUAIS_M02.json) registra as correspondências MIF, os vãos e os objetos. O [registro de geração](arte/RIHAD_INTERIORES_V01.json) contém mestres, prompts, referências e interpretações. A aprovação visual continua pendente.

| Módulos aplicados | Referência e alcance |
| --- | --- |
| Piso avermelhado e parede de madeira ocre sobre embasamento de pedra na pousada | IFLOOR5/6 e NOBB de TAVERN.INF, conforme materiais declarados e valores consultados. Tetos/caps adaptados à vista superior. |
| Pedra clara irregular/regular e pisos de mármore na corte | CASC/CASD e FLCASC/FLCASD/FLCAS_E1 de CASTLE.INF. O tapete vermelho tem bordas por vizinhança; degraus acompanham as células de elevação já representadas, sem nova mecânica vertical. |
| Portas, batentes e mobiliário separados | Molduras abertas nos nove vãos da pousada e seis da corte. Mesas e balcão nas células de mobiliário da taverna, incluindo orientação longitudinal. Trono atrás de Blubamka, fontes nas referências originais e braseiros decorativos. Painéis de tecido são interpretação ornamental, sem identificação heráldica canônica. |
| Colisão e camadas | Caps com1tile e faces com2tiles. Mobiliário/ornamentos estão em folha transparente separada. Preservados todos os bits nativos de passagem e regiões dos Map011/018; adereços não criam bloqueios novos. A cama mantém colisão nos dois tiles. NPCs e seus eventos funcionais são preservados. |

Exportar com `python tools/export-rihad-interiors.py` e reconstruir com `node tools/build-rihad-arrival.cjs`. Mestres ficam em `art/masters/rihad-interiors-v01`; somente as exportações `img/tilesets/Arena_Rihad_Interiors_V01_C.png` e `…_D.png` entram no runtime. Extrações originais ficam ignoradas e fora do pacote.

A [verificação focal](evidencias/m02-rihad-interiores/resultado.json) reúne o percurso da pousada, Enter/clique junto à cabeceira, recuperação, nível1/2, visão única, saves, audiência e entrega única do pergaminho. A avaliação visual e funcional do responsável continua no [roteiro integrado](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome). A apresentação provisória dos NPCs e as ilustrações narrativas futuras seguem seus registros existentes.

## Pousada do portão — descanso urbano vigente

A recuperação urbana passa para uma cama da **Pousada do portão**, identificação genérica do projeto. O nome próprio original não foi confirmado. A fachada vem de MIF **(24,13)**, `0x0B0B` / `DTAVD.IMG`, na composição CITYW1 + bloco **TPBD11B.MIF**, posição local (1,10). No Map009, a porta está em **(313,42)**, com aproximação pela direita em **(314,42)**. Do informante, descer pelo passeio até a primeira curva em (345,31), seguir a oeste até (322,31), ao sul até (322,42) e a oeste até a porta. Placas Pousada indicam esse trecho antes do sonho.

### Evidência e adaptação

| Assunto | Evidência localizável | Aplicação nesta entrega |
| --- | --- | --- |
| Hospedagem e recuperação | Manual instalado, `Docs/Manual.pdf`, p.3, Campfire icon. A cidade permite Camp quando há quarto alugado ou obtido furtivamente e o jogador está na taverna correspondente. A qualidade muda a recuperação por hora. | Cama por interação, recuperação completa de Vida/Mana/Vigor fora de batalha. Sem passagem de horas, sorteios de ataque ou regeneração passiva. |
| Serviço e custo | Wiki local `Arena_Services…pdf`, p.1, Bartender. Cinco categorias, 10–75 moedas/noite negociáveis. ACD.EXE desempacotado, strings 0x42EDF, 0x42DEA, 0x42E1E, 0x42EFB confirmam aluguel, custo e uma mensagem de quarto gratuito, cuja condição não foi reconstruída. | Quarto gratuito disponível. Não há cobrança, negociação, furto ou escolha de categorias. A gratuidade é adaptação explícita, preserva a regra anterior e permite prosseguir mesmo com zero ouro. |
| Variante e planta | GLOBAL.BSA/`TAVERN4.MIF`, 25×25, SHA-256 `402df1f66e7ededf8bc6d06a3af89839cdfe2593e629c30ff05b2eac5754b6ee`; `TAVERN.INF`. O seletor já usado no levantamento, [OpenTESArena/ArenaLevelUtils.cpp](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/World/ArenaLevelUtils.cpp), calcula offset=0x0D30, variante ((ror16(offset,4) xor offset) mod 8)+1=4. | Map018 de 79×79, escala3/margem2, X espelhado. Paredes e conexões preservadas; nove portas ordinárias representadas por passagens abertas, sem nova mecânica de aluguel/fechadura. Materiais de reuso são provisórios. |
| Quarto, leito e saída | `TAVERN4`: saída (11,23), atendente flat ITEM15 em (11,17), móvel baixo `0x1825` em (4,2); `TAVERN.INF` declara BED.IMG como BOXSIDE5. | Entrada no salão em MV(42,69), saída(42,72), atendente(42,54), cama com interação em(63,10), acesso pelo pé em(63,11). Uma cama ortogonal nova ocupa1×2tiles dentro da área do móvel; demais objetos/NPCs são provisórios ou ficam adiados. |
| Sonho de Ria | Wiki local `Arena_Fang Lair (quest)…pdf`, pp.1–2, sono após nível2; texto original já registrado em VISAO_RIA_M02_03C. | Mantém o gatilho aprovado de nível2+, explicação completa e apresentação única. Descanso no nível1 não consome a oportunidade. |

Consulta feita nos arquivos instalados e nos leitores existentes, sem observação declarada de uma sessão DOS. A variante é uma reconstrução técnica; acabamento e circulação do móvel são adaptações. Extrações ficam em `tmp/rihad-inn`, ignorado, e não entram no pacote.

### Persistência, reconstrução e avaliação

O ID **MQ02.rihad.rest** é preservado e agora aponta para Map018/evento2. Map009/evento2 foi aposentado; o novo acesso é evento7. Saves no exterior mantêm posição e estados, retiram o antigo evento de descanso serializado e instalam a entrada quando necessário. O piso da antiga plataforma continua acessível. Saves com visão lida preservam seu namespace/cursor e não reabrem o evento. Nenhuma recuperação acontece por transferência ou carregamento.

Reconstruir com `node tools/build-rihad-arrival.cjs`. A [planta/configuração](mapas/RIHAD_POUSADA_M02.json) é consumida por `tools/build-rihad-inn.cjs`. Para a única arte nova, `python tools/export-rihad-inn-bed.py` exporta o [mestre e prompt registrados](arte/RIHAD_INN_BED_V01.json) para a folha E própria, sem alterar os atlas de outros mapas.

[Verificação focal no Chrome isolado](evidencias/m02-rihad-pousada/resultado.json) cobre percurso desde o portão/informante, entrada/saída, nível1→nível2, recuperação dos três recursos, bloqueio em batalha, visão única, leitura/saves e migração de save exterior sintético. A aprovação manual da pousada e da cama permanece pendente no [roteiro integrado de MQ02](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome). Para inspeção sem saves pessoais, o hub existente **Campanha e mapas → Rihad · chegada nível 1 (RAM)** e **Rihad · visão de Ria (RAM)** continuam disponíveis; o caminho até a pousada é o mesmo da campanha. Guardar/carregar teste em RAM funciona também no interior. O servidor local permanece ativo em http://127.0.0.1:8774/ e pode ser encerrado com `tools/arena-local.cmd stop`.

## Orientação e fachadas de Rihad

O informante indica o passeio escuro, a pousada e os Arredores antes da visão. Depois, aponta a corte na muralha sul, com a grade e a porta de madeira como referências. Ao aceitar o pedido ou entregar o pergaminho, Blubamka indica o portão urbano ao **norte**. As placas de percurso estão em 50 posições fixas e indicam Esplanada, Corte ou Portão urbano conforme MQ02. Antes da visão, as placas mais ao sul mostram a volta ao portão para quem seguiu pela cidade. A oferta de viagens continua condicionada pelo progresso. Veja as [falas em jogo](CAMPANHA_PRINCIPAL.md#inventário-textual) e o [roteiro integrado](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).

A [matriz das fachadas e placas](mapas/RIHAD_SINALIZACAO_M02.json) cruza os registros MAP1 da composição `CITYW1.MIF` + 32 quarteirões com os recursos de `DCN.INF`. Há 380 fachadas identificadas e acessíveis pelo lado da rua: 319 casas, 25 casas nobres, 16 de equipamentos, 13 tavernas, seis templos e uma Guilda dos Magos. São tipos do registro, sem atribuição de nomes próprios. Em 35 pontos comerciais, a placa original ocupa uma célula diferente da porta. Nesses casos, a fachada foi projetada sobre o ponto sólido adjacente à rua, conservando a associação local. A placa próxima explicita **Fechado** nas 379 fachadas sem interior funcional. Uma das 13 tavernas agora é a Pousada do portão. Casas e demais estabelecimentos continuam fora do recorte de interiores.

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
| 1. Rua, passeio e terreno aberto · prioridade alta | NROADD, NSIDWALD, NGRASSD | **Entregue** no atlas exterior V01: rua, passeio, terreno e transições atuais. Avaliação visual separada |
| 2. Fachadas, coberturas e vãos comuns · prioridade alta | DMBS1–3, DMEQUIP, DMTAVERN, DMMUGUIL, DMTEMPLE, DMNOBLE, NHEDGED, GARDENGD | **Entregue** no atlas exterior V01: famílias de fachada, cantos, sebes/arcos, portas e sinalização aplicados |
| 3. Muralha, portão e fachada da corte | CITYWALD, DLGTD, DRGTD, DGATE, BK01/02PALD | **Entregue** na composição urbana V01; não confundir o recurso DGATE urbano com o vínculo ainda não comprovado de dragon gate em Fang Lair |
| 4. Costa e transições | SEAWALLD, FLOR 13 | **Adaptar** a superfície existente `Arena_Water_M14_R02_A1` e conferir margem/porto antes de escolher o acabamento |
| 5. Adereços urbanos e flora | NLAMP1, NWELL, NFOUNT, CACTUS, PALM | **Entregues** poços/cactos/palmeiras e fonte reutilizada nas117ocorrências; demais objetos exigem conferência específica, sem regenerar estes conjuntos |
| 6. Interior obrigatório da corte | `PALACE2.MIF` / `CASTLE.INF` | **Entregue**: interiores C/D, trono/ornamentos e Blubamka V01. Ver [inventário auditado](FANG_CELAS_M02_06A.md#inventário-auditado-de-assets-do-m02--20112026); sem pendência de novo conjunto completo |

**Contagem vigente.** Seis famílias urbanas: exterior C e interiores C/D já produzidos; Blubamka tem sprite/retrato próprios. Costa/adereços restantes requerem fechar reuso/ocorrências antes de fixar novas gerações. Ilustrações narrativas permanecem vinculadas aos blocos. Avaliação visual pendente não equivale a asset ausente.

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
