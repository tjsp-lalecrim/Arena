# M02-03D — audiência mínima de Rihad

## Blubamka V01 — representação própria (20/11/2026)

**Publicação posterior:** conjunto incluído na [prévia agrupada01f9915](PAGES_INFRA.md#prévia-agrupada-de-assets-do-m02--20112026), sem aprovação visual presumida.

**Estado:** sprite de mapa e retrato integrados; avaliação visual adiada pelo responsável para a próxima prévia integrada no Pages. As avaliações recentes de assets continuam adiadas, sem aprovação presumida. Não foi produzida ilustração narrativa.

| Evidência | Limite / adaptação |
| --- | --- |
| Wiki local `Arena_Fang Lair (quest)`, p.2: Queen Blubamka, governante de Rihad; cidade-estado ao sul de Hammerfell. `TEMPLATE.DAT` #1315–1317/#1319 sustenta pedido e entrega; usa placeholders de título/nome. | “Rainha Blubamka” confirmado. As fontes consultadas não estabelecem idade, raça individual, rosto, traje ou joias próprios. |
| `PALACE2.MIF` / `CASTLE.INF`: marcador do governante em MIF(23,29), Map011(81,90); conjunto declara `KING.IMG` e `QUEEN.IMG`. Consulta direta ao arquivo genérico QUEEN.IMG: veste azul-clara, contorno dourado e diadema. | A figura genérica não é um retrato individual de Blubamka. Não houve nova observação de partida DOS. |
| Interpretação regional autorizada, mantendo nome, papel e acontecimentos. | Mulher madura de pele castanha, cabelos escuros ondulados, diadema dourado com pedra vinho, veste azul-ardósia, gola marfim e manto vinho. São escolhas artísticas para a corte de Hammerfell, **não confirmação de raça, idade, símbolos ou vestuário canônicos**, nem importação de outro jogo da série. |

**Conjunto único:** [mestre](../art/masters/blubamka-v01/identity.png), [prompt e papéis das referências](arte/blubamka-v01/generation.json), [exportações/checksums](arte/blubamka-v01/exports.json). A referência de busto da bretã orienta apenas pose e enquadramento, não a identidade. Extração de QUEEN.IMG permanece em `tmp/rihad-review`, ignorada e fora do pacote. Mestre gerado com alpha real, sem fundo incorporado.

`python tools/export-blubamka.py` (Pillow) recorta e reduz proporcionalmente o mestre: rosto144×144; folha de personagem144×256 com células48×64. O evento é parado, direção2 fixa: três células frontais iguais para compatibilidade de padrões, outras direções vazias. **Não é um ciclo de caminhada** e não há atuação que o exija. `node tools/build-rihad-court.cjs` recompõe o evento e a configuração; gerador pai também o invoca. Pisos, paredes, trono e demais mapas permanecem iguais.

O retrato usa a janela nativa, reserva168px e repagina os textos existentes em até quatro linhas. Aparece somente no evento2 da corte, incluindo pedido e entrega; o helper compartilhado continua sem rosto e em largura total nos outros eventos. O rosto também acompanha as frases de narração inseridas nessa conversa; não substitui a futura ilustração específica de cada bloco. Sprite, ID, posição, prioridade, gatilho e direção fixa são preservados. Saves da corte atualizam apenas a imagem serializada do evento; inventário, recursos, visão e recibos permanecem intactos. Não há troca de namespace.

**Verificação focal:** `node tools/test-blubamka.cjs` em Chrome isolado, servidor canônico sem cache. Sprite/colisão/interação adjacente, largura com retrato, cancelamento30, aceitação40, entrega60/repetição, bloqueio de slots RAM, save/load normal sintético no slot19, imagem legada e reconstrução. [Resultado](evidencias/blubamka-v01/resultado.json) · [Corte](evidencias/blubamka-v01/corte.png) · [Audiência](evidencias/blubamka-v01/audiencia.png). Não utiliza saves pessoais nem repete a campanha.

**Próximo teste integrado, após publicação separada:** entrar na corte pelo percurso normal, aproximar-se de Blubamka e falar; observar identidade, escala e leitura do retrato durante pedido/entrega. O hub existente “Rihad · audiência (RAM)” continua disponível para diagnóstico, sem novo acesso técnico. A publicação Pages desta entrega não foi executada. A prévia permanece na fonte1339e2a; aguardam agrupamento Fantasma (`b996fb3`), portas/objetos (`e5d822e`), lava (`0d613fc`) e este conjunto. A avaliação manual não bloqueia as verificações técnicas, mas permanece pendente.


A transferência para Stonekeep e a [entrega do pergaminho](ENTREGA_PERGAMINHO_M02_05.md) fazem parte do fluxo vigente. O histórico da amostra 03D registra a implementação anterior a essas conexões.

**Confirmação do responsável —01/11/2026:** diálogo da audiência funciona e a quest atualiza. Referência entregue/disponível **fe99ac3**; o relato não informou hash nem ambiente. Não atribuir aprovação estética dos placeholders ou testes adicionais de persistência, recusa, transferências, editor ou dispositivo. Evidências automatizadas abaixo permanecem identificadas separadamente.

01/11/2026. Feature `feature/m02-corte-rihad`, sobre **65e0c12**, preservando ad4af0e e as dependências02A/02B/03A/B/C. Registro da implementação original, anterior à confirmação acima; a aprovação funcional/artística da visão de Ria não se estende à estética desta audiência. Tag/release m01 intactas. Sem Stonekeep, novas batalhas, arte gerada ou redesign narrativo.

## Interior PALACE2 — referência vigente

`CITYDATA.65` identifica Rihad como cidade-estado de Hammerfell, posição provincial (207,180), retângulo provincial (48,48,94,59). A projeção com truncamento inteiro dá (108,100) e a rotação produz `rulerSeed=0x0064006C`. O seletor reconstituído usa `PALACE` para cidades-estado e `(((seed >> 8) & 0xffff) % 3) + 1 = 2`. O `GLOBAL.BSA` instalado contém `PALACE2.MIF` com o primeiro nível `caslev1` de 50×50 e `CASTLE.INF`. A identificação foi conferida nos dados instalados com o algoritmo de reconstrução. A execução em DOS segue sem observação. [Seletor de interiores](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/World/ArenaLevelUtils.cpp#L88-L211) e [projeção e semente](https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/WorldMap/ArenaLocationUtils.cpp#L274-L279).

| Âncora | Coordenada MIF | Tile MV |
| --- | --- | --- |
| Entrada, pelo cabeçalho `MHDR` | (23,40), posição original em subunidades (3008,5184) | (81,123) |
| Saída do salão, MAP1 `0x1111` | (23,41) | (81,126) |
| Audiência, marcador de regente `0x8000` | (23,29) | (81,90) |

O [dado do gerador](mapas/RIHAD_CORTE_M02.json) preserva a planta do salão com escala de três tiles por célula, X espelhado e margem de dois tiles. Laje, faixa de tapete e degraus usam pisos provisórios do atlas atual. Os seis limiares interiores sem registro `LOCK` usam vãos abertos de um tile. O poço de água (FLOR `0x0D00`) fica fora da circulação e tem representação provisória. Avisos de áreas restritas, guardas, encontros laterais, decoração e o nível auxiliar `test2` ficam fora do percurso da audiência. O marcador genérico do original serve para posição; a representação própria V01 acima é interpretação artística em avaliação.

A audiência e a saída mantêm Map011, eventos 2 e 1, etapa, inventário e recibos. Saves da corte 17×13 retomam na entrada atual do salão, preservando dados da partida. Saves gravados no salão novo conservam sua posição. O próximo teste integrado de MQ02 pode usar o caminho normal: entrar na corte, seguir a faixa central até Blubamka, aceitar o pedido, visitar Stonekeep, voltar e entregar, conferir o diário e conversar novamente. Guardar e carregar na corte pode ser incluído nesse mesmo percurso.

Validação automatizada em Chrome isolado. [Percurso Rihad–Stonekeep, entrega e retomadas](evidencias/m02-rihad-corte/resultado.json) e [Fang Lair após a entrega, com retorno a Rihad](evidencias/m02-rihad-corte/fang-lair.json).

## Histórico da corte 17×13

### Conteúdo e fontes

Leitura direta, somente consulta, de `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\TEMPLATE.DAT`: **#1315**, bytes263040–264020 (fim exclusivo), pedido/troca de informações; **#1316**,264021–264352, aceitação/advertência; **#1317**, início264353, recusa. Conferência no PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.2, Where Is Fang Lair / Quid Pro Quo1. A wiki identifica Blubamka; o original usa placeholders de nome/título. Não houve observação nova de partida DOS nem confirmação de uma planta do palácio.

Tradução/condensação em [ArenaCourt.json](../data/ArenaCourt.json): goblins levaram tesouros e um pergaminho que permite decifrar a localização de Fang Lair; fugiram para Stonekeep; uma pessoa pode ter mais sucesso que soldados; recuperar o pergaminho em troca dessa informação. Depois do aceite, o rumor de Golthog servir ao Underking permanece **rumor**. Golthog é citado, sem criar chefe/encontro. A revelação posterior à entrega (#1319) não foi antecipada.

Adaptações explícitas: indicar um destino lógico substitui marcar o mapa mundial; confirmação com opção de recusa selecionada inicialmente; aviso do limite da versão. A localização exata de Fang Lair, a entrega e recompensas não são simuladas. A tradução já aprovada **Cajado do Caos** foi aplicada nos textos ativos de Ria/diário: mesmos IDs, imagens e contagens de palavras por bloco, preservando os cursores. Transcrições/prompts históricos e release m01 não foram alterados.

### Mapa e estado

- Acesso Map009, evento5 **Acesso à corte de Rihad**, (10,4). Porta visual6 em (10,3), fechada/estática e provisória, na face da parede; o gatilho fica no piso diante dela. Não é uma nova animação de porta.
- Map011 **M02-03 Corte de Rihad (provisória)**,17×13; chegada (8,10), rainha/evento2 (8,5), saída/evento1 (8,11) para Map009 (10,5). Piso conectado; paredes e NPC bloqueiam normalmente. Altura de parede/cobertura conforme contrato existente.
- Materiais de dungeon/plataforma e sprite `$Arena_redguard_female_walk_r02` são **reuso provisório identificado na tela**, sem afirmar arquitetura, rosto, raça ou traje canônicos de Blubamka. Não constituem novo padrão artístico aprovado. Sem ilustrações novas.
- Antes de MQ02=30, a rainha orienta procurar o informante; não concede missão. Em30, conversa com **Aceitar o pedido / Agora não**. Escape equivale a recusa, mesmo com Aceitar destacado. Encerrar antes da escolha não aceita.
- Confirmação explícita avança30→40, registra `parchmentRequest`, sem concluir MQ02 ou conceder cura, EXP, dinheiro ou itens. Repetir dá apenas lembrete. Diário registra pedido e objetivo do pergaminho.
- `stonekeep.entry` é conhecido a partir de40, mas `available=false`; área Stonekeep continua sem mapa. Conhecimento deriva da etapa persistida, sem outra flag de save. MQ01/Ria/fontes/recibos anteriores preservados.
- Soltar o comando é obrigatório após a transferência e antes da escolha; fechar texto não aciona novamente a interação. Nenhum arquivo interno do motor foi alterado.

Origem reconstruível: `node tools/build-rihad-arrival.cjs` também chama `build-rihad-court.cjs`. Ambos preservam chegada, repouso, arredores e registros anteriores. Carregar um save antigo de Map009 acrescenta somente os eventos5/6 ausentes antes dos sprites, sem reconstruir suas outras interações.

## Planejamento visual futuro — REF07

Aplicação posterior delimitada, vinculada à [REF07](REFINAMENTOS_POS_INTEGRACAO_M01.md#ref07--refinamentos-futuros-da-narrativa); padrões e processo nas fontes principais DIRECAO_DE_ARTE.md e DIRETIVA_DE_NAVEGACAO.md. Não é autorização de produção nem bloqueio de Stonekeep. A identidade regional é adaptação autorizada; raça, aparência e traje canônicos de Blubamka ainda exigem evidência específica, não inferência por Rihad ou pelo sprite emprestado.

Correspondência preliminar a conferir com fontes antes de gerar; blocos não equivalem a cada frase/página da janela:

| Bloco significativo | Composição planejada e limites |
| --- | --- |
| Apresentação da rainha e situação de Rihad | Blubamka no ambiente da corte; Papel/pedido em #1315 e nome Blubamka na wiki local. Arquitetura, fisionomia e roupa só serão canônicas com fonte; demais detalhes são interpretação regional. Não incluir protagonista |
| Roubo do pergaminho e acordo de recuperação | Blubamka e contexto do pedido; objeto/reconstituição do roubo somente após conferir referências e identificar representação simbólica. #1315 sustenta o acontecimento, não a aparência exata. Sem mostrar a localização de Fang Lair ou antecipar a entrega |
| Aceitação e advertência | Contexto da rainha advertindo, apoiado em #1316. Não ilustrar o rumor como fato comprovado, inventar chefe Golthog ou revelar conteúdo futuro |
| Recusa, orientação prematura e lembrete | Reutilizar composição adequada do bloco correspondente; sem imagem diferente para cada resposta repetitiva |

Primeira produção futura: escolher **uma** amostra — personagem da corte ou ilustração representativa da audiência —, listar arquivo/conteúdo/finalidade e apresentar integrada ou em mockup na escala prevista. Conferir a correspondência acima antes da autorização da produção; não reunir personagem, arquitetura e todas as ilustrações num lote. A preparação dos novos assets segue o padrão visual vigente; a troca dos placeholders e a mudança da interface permanecem entregas próprias.

### Avaliação histórica em localhost/editor

Servidor já existente conferido: **http://127.0.0.1:8774/**, mantido ativo. No editor, abrir o projeto normalmente e executar o playtest. Nenhum save pessoal precisa ser aberto.

1. Título → **Rihad · audiência (RAM)**. Fixture explícita prepara Bretã/nível2, Ria já lida e orientação da corte; não altera a campanha normal. Os recursos começam parcialmente gastos para tornar visível qualquer recuperação indevida.
2. Na esplanada, caminhar ao norte até **Corte ↑**, (10,4). Dentro, aproximar-se de Blubamka em (8,5), pela posição (8,6), e pressionar Enter/clicar.
3. Ler a oferta; experimentar **Agora não** ou Escape. Conversar novamente e escolher **Aceitar o pedido**. Nenhuma recompensa é devida agora.
4. Menu → **Diário**: pedido aceito e recuperação do pergaminho em andamento; Stonekeep ainda indisponível. Na sessão técnica, **Guardar teste em RAM / Carregar teste da RAM** permitem conferir a retenção sem slots pessoais. Fechar/recarregar o navegador perde esse checkpoint RAM; salvamento normal continua disponível em campanha normal.
5. Sair pelo centro sul (8,11), retornar à esplanada. Nada de cura/EXP/viagem para Stonekeep. Retorno ao título permanece pelo menu existente.

## Evidências históricas da corte 17×13

[Resultado focal](evidencias/m02-03d/resultado.json), [contratos](evidencias/m02-03d/contratos.json), capturas [corte](evidencias/m02-03d/corte.png), [pedido](evidencias/m02-03d/pedido.png) e [diário](evidencias/m02-03d/diario.png). Teste histórico na revisão da corte 17×13: `node tools/test-rihad-court.cjs`, com Playwright/Chrome disponíveis. Servidor/origem e perfil descartáveis, fixture RAM e save nativo sintético16; sem saves pessoais e sem repetir dungeon, combate ou visão completos.

Cobertura: etapas10/20/30/40, recusa/Escape/aceite único, teclado/mouse/toque emulado, soltura, texto completo antes da escolha, conectividade/colisão, ida/volta, diário, preservação dos dados anteriores, RAM, salvar/F5/carregar em campanha sintética, complemento do acesso em save antigo e idempotência do gerador pai. A primeira inspeção visual identificou reinício da última linha ao desativar a escolha durante a proteção; corrigido mantendo a propriedade nativa da janela, com teste específico de término do texto.

**Pendentes:** aprovação estética dos placeholders não concedida; aplicação visual futura em REF07, sem bloqueio de conteúdo. Novo playtest/autoria no editor MV não foi informado. Chrome automatizado não comprova autoria no editor; nenhum teste físico mobile novo. Arte/layout narrativos aprovados e refinamentos REF07 preservados. Próximo recorte recomendado: **M02-04, amostra integrada de Stonekeep**, por dar continuidade ao objetivo do pergaminho já aceito; não iniciado. A confirmação funcional acima não amplia as aprovações manuais dos recortes anteriores.
