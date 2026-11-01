# Stonekeep — levantamento visual delimitado

01/11/2026, base **7a19c1a**, feature `feature/m02-stonekeep-amostra`. Consulta/planejamento apenas: nenhum asset artístico gerado, mapa ou regra alterados. Não registra aprovação da amostra. Fonte do processo/estilo: [DIRECAO_DE_ARTE.md](../DIRECAO_DE_ARTE.md); geometria: [DIRETIVA_DE_MAPAS.md](../DIRETIVA_DE_MAPAS.md); recorte funcional: [M02-04](../STONEKEEP_M02_04.md). Este é o registro principal dos materiais, não um novo backlog de polimento.

## Prints → elementos → amostra

R01–R06 identificam os seis arquivos únicos `doc/prints/stonekeep-original-ref-01…06` inspecionados visualmente nesta tarefa. Ligações abaixo localizam cada arquivo completo. A relação regional é de **tipo de ambiente**, salvo coordenadas confirmadas na seção seguinte; não foi reconstruída a posição/câmera de cada captura.

| Referência | Evidência visual | Relação com o trecho adaptado |
| --- | --- | --- |
| [R01](../prints/stonekeep-original-ref-01-9f3eb83f-743a-44e6-90fa-a4327c128c6f.png) | Blocos claros irregulares, juntas escuras; piso cinza manchado/veios claros e acentos vermelhos; carpete vermelho, cadeira alta, suportes de luz e restos ósseos. Ao fundo, paredes mais escuras | Aposentos/salões; aparência de materiais, não prova de que a cadeira ou todos os objetos estejam na rota selecionada. Não afirmar trono ou identidade dos ocupantes |
| [R02](../prints/stonekeep-original-ref-02-a1d0a56c-7f65-49a7-9214-60516b2f5159.png) | Alvenaria castanha escura, carpete longitudinal vermelho, mesmo piso manchado, teto claro; painéis/faixas coloridos e motivo animal amarelo | Entrada/corredor do setor residencial. O vermelho é confirmado na chegada do MIF; posições de cada ornamento dependem dos índices, não da conveniência decorativa |
| [R03](../prints/stonekeep-original-ref-03-ed3b93b2-3c5a-4695-89c0-4e938bd5904d.png) | Alvenaria clara de fiadas regulares, detalhes amarelos no alto, carpete vermelho, painéis coloridos e piso manchado | Outra referência para paredes claras/corredores; localização exata e associação do friso superior não fechadas. Não concluir que toda a entrada usa a mesma parede desta câmera |
| [R04](../prints/stonekeep-original-ref-04-6969850b-9c6f-4622-98ee-9d944b171426.png) | Lajes claras regulares nas margens, parede escura, água azul e face da borda abaixo do piso | Bacia a oeste da passagem e contorno da ilha: piso de margem deve se distinguir tanto do piso dos aposentos quanto da superfície da água |
| [R05](../prints/stonekeep-original-ref-05-052c932f-c9ee-49cf-80aa-ff6ea378a924.png) | Porta cinza com painéis/rebites aparentes e figura animal amarela, carpete e alvenaria escura | Referência para futura porta da rota; correspondência visual com DCAS5.IMG. Não atribuir metal específico, raça, dinastia ou significado ao emblema |
| [R06](../prints/stonekeep-original-ref-06-8e5a8938-d0ad-499e-9519-255b6c89c3aa.png) | Parede clara regular, piso manchado, carpete junto à água, abertura escura e pilha de tesouro | Transição entre interiores e área inundada. Tesouro é decoração/conteúdo separado, não requisito novo da amostra. A abertura da captura não foi identificada como a passagem adaptada específica |

Textos/letreiros no alto das capturas não serão pintados nos tiles; sua natureza/posição exige identificação própria se forem necessários depois. Céu/teto, projeção e luz de primeira pessoa orientam cor/material, não a perspectiva final dos tiles. A aparência sugere superfícies minerais e porta metálica, mas composição mineral/material exato permanece interpretação. Cor do automapa não foi usada para identificar textura.

## Correspondência técnica delimitada

Original consultado somente em leitura: `ARENA/39699021.MIF`, `GLOBAL.BSA` e `PAL.COL` na instalação informada. O primeiro bloco **INFO**, offset86, aponta explicitamente para **STKEEP1.INF**; registro no índice BSA existente: offset12657582,3411bytes. O outro INFO aponta para SKEEP2.INF, mas não foi expandido: a amostra atual usa o primeiro bloco de camadas, cujo contorno foi conferido anteriormente. Não deduzir outro andar jogável só da presença desse bloco.

Reutilizadas as camadas MAP1/FLOR e referências técnicas de consulta já existentes em `tmp/original-review` e `tmp/stonekeep-review`. Desofuscação INF conferida contra os3343bytes completos de START.INF/START-decoded.txt existentes; STKEEP1 resultou em seções legíveis de pisos/paredes/flats. Entradas SET expandidas em imagens64×64 com PAL.COL. Regras de índices conferidas nos arquivos locais `MapGeneration.cpp` e `ArenaVoxelUtils.cpp` (reimplementação OpenTESArena usada como referência técnica, não código do executável original). Sem nova observação de partida DOS.

Índices abaixo são **zero-based** da lista de texturas do INF; quadro de SET também zero-based. Coordenadas “vista” usam X=89−XdoMIF; MV é a conversão3× com margem já registrada no layout, não uma alteração de geometria.

| Associação nos dados | Elemento e exemplo verificável | Limite |
| --- | --- | --- |
| FLOR2/3 → FLCASC.SET#0/#1 | Piso manchado cinza/branco/vermelho; vista35,13 → MV84,42, FLOR=0x0200. Coerente com R01–03/06 | Veios não comprovam mármore de um tipo específico |
| FLOR6 → FLCAS_E1.IMG | Lajes claras da margem/ilha; vista29,12 → MV66,39 e fonte17,23 → MV30,72 | Distinto do chão castanho provisório do MV e do piso manchado acima |
| FLOR8 → REDRUG.IMG | Carpete vermelho; vista50,4 → chegada MV129,15 | O carpete existe na chegada, mas fica fora da primeira amostra visual proposta |
| MAP1=0x20e3, BOXSIDE3 → CASA.SET#0 | Parede clara regular dos aposentos; vista35,12 → MV84,39. O INF também contém variantes CASA#1/#2 e painel heráldico#3 | Bloco elevado original; tratamento 2D de altura/colisão já é adaptação. Não converter automaticamente todos os blocos altos em parede clara |
| MAP1=0x2828 → índice39 → CASF.SET#2 | Parede castanha escura junto à passagem; vista30,11 → MV69,36. CASF#0–2 são base, #3 contém painel figurativo | CASF#3 não é variação aleatória de alvenaria: separar o ornamento |
| CASK.SET#0/#1 e CASL.SET#0/#1 | Há paredes quase negras e blocos claros irregulares no próprio recorte; exemplos vista30,28 e49,19, respectivamente | Famílias adicionais para depois; não unificar todos os claros/escuros ou ampliar sua distribuição por paleta |
| *WETCHASM → WCAS.IMG; FLOR0x0Dxx | Face da borda inundada, com faixa azul/escura. A água existe na topologia e em R04/06 | WCAS não foi identificado como a animação completa da superfície. A textura exata dessa superfície não foi fechada; usar os prints para sua cor |
| MAP1=0xB010 → índice15 → DCAS5.IMG; 0xB00E →13 → DCAS3.IMG | Porta com figura animal amarela em vista47,12 → MV120,39; porta de aspecto amadeirado reforçado em35,15 → MV84,48 | Ambas hoje são passagens abertas. Não adicionar fechadura, obstáculo ou porta animada nesta consulta |
| MAP1=0x803D → flat61 → PARCHFLT.IMG | Pergaminho confirmado na própria fonte original72,23 → MV30,72 | Sprite próprio futuro; marcador atual permanece provisório |

CASA#3, CASF#3 e CASK#2 contêm ornamentos; o significado e a associação política/racial **não foram estabelecidos**. O friso amarelo específico de R03 e a localização de cada câmera permanecem incertos. Há móveis, restos, recipientes e fontes listados no INF, mas sua simples presença na lista não autoriza preencher a rota com todos eles. Não houve catálogo geral de assets.

Consulta derivada apenas em pasta ignorada: `tmp/stonekeep-review/STKEEP1-decoded.txt`, `texture-associations.json`, `stonekeep-textures-consulta.png` e `stonekeep-details-consulta.png`, além de exports pontuais. São decodificações do material original para inspeção, não arte nova ou arquivos distribuíveis. MIF preservado, SHA256 `4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b`.

## Reuso, substituição e primeiro conjunto

- **Reusar:** estrutura/flags/colisão dos tiles48×48, montagem modular e renderer MV; animação A1 de `Arena_Water_M14_R02_A1.png` e ondulação `!$Arena_Ripple_M14_R02.png` como suporte existente. Manter temporariamente sua arte, avaliando depois o contraste com a água azul das fontes, sem declará-la equivalente a WCAS. Personagens e layout permanecem intactos.
- **Substituir de forma localizada:** pisos castanhos, paredes cinza-arroxeadas e cobertura de `Arena_Dungeon_M14_R03.png`, atualmente emprestados de Imperial Dungeons. Stonekeep usa aqui famílias FLCAS/CAS e carpetes, distintas dos FLOOR/WALL de START.INF. Não acrescentar grades/correntes de prisão como decoração genérica para preencher espaços.
- **Complementos posteriores:** carpete e bordas na chegada, outras famílias de parede, portas DCAS3/DCAS5, painéis/elementos heráldicos independentes, móveis realmente selecionados e sprite/ícone do pergaminho. O mecanismo/âncoras das portas M01 pode orientar a integração, mas sua arte de madeira não substitui a porta figurativa. Guardiões mantêm dependência própria já registrada, sem substituição de espécie.

**Proposta única para a próxima geração:** pequeno conjunto de **cinco componentes**, limitado ao aposento junto à abertura e à margem: parede clara CASA; parede castanha CASF; piso manchado FLCASC; lajes claras FLCAS_E1; face/borda de margem inspirada em WCAS e R04. Os dois pisos e duas paredes são necessários nessa transição; não pintar toda Stonekeep com uma única textura. Uma amostra integrada, sem carpetes, heráldica, portas, móveis ou inimigos no mesmo lote.

Planejar módulos de parede de2tiles de largura, **1tile de cobertura +2 de face**, sem chão incorporado; pisos com repetição2×2tiles e margem reta/canto somente para os lados usados nesse trecho. O formato mestre é a definir no consumidor antes de gerar, não promessa de folha completa. Export final em células48px, vista superior ortogonal, sem fuga de perspectiva/isometria, continuidade de juntas/luz e escala coerente. Margem deve ler como borda, sem criar um bloqueio/ponte nova. Decoração futura separada das paredes; sprites independentes em RGBA transparente, âncora/moldura fixas em portas.

Acabamento dark fantasy deve preservar claros, castanhos, azul e vermelho reconhecíveis; não escurecer tudo nem trocar por pedra genérica. Próxima entrega: gerar **somente essa amostra**, montar/testar no contexto de MV84,42 → passagem75,39 → margem66,39, sem mudar conectividade/colisão. Conferir em48px e com o personagem, recortes, repetição, teto/face, leitura da margem e luz; apresentar para aprovação antes de ampliar. Este planejamento não autoriza a produção nesta tarefa nem atualização retroativa de todos os assets aprovados.
