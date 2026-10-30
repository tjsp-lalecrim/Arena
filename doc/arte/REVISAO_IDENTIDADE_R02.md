# Revisão de identidade M01-06 — R02/R03

**Atualização posterior:** direção aprovada pelo responsável em 25/10/2026; arquivos e hashes em APROVACAO_DIRECAO_R02_R03.json. O texto abaixo registra a avaliação anterior à aprovação, inclusive limitações técnicas que permanecem.

Data: 2026-10-25. Branch: feature/m01-amostra-visual. Direção 1.1. **Em revisão estética pelo responsável.** A rejeição da rodada anterior prevalece sobre seu antigo registro de conclusão técnica. Nenhuma produção em lote autorizada por esta revisão.

## Referências efetivamente inspecionadas

Foram vistas as capturas `imperial dungeons 01` a `05`, `07`, `08`, `09`, `exit`, `map`, `rat.png` e `ria silmane.jfif`, em `doc/prints/`. As capturas mostram grandes lajes marrons, blocos de alvenaria cinza/violeta, grades, correntes com argolas, nichos e portas. HUD, bússola, espada/mãos do jogador, textos, cursor, logotipo e chamadas de vídeo não são elementos de cenário. O mapa anotado informa topologia, não textura. A saída azul não deve ser transplantada automaticamente para a cela inicial.

As referências anexadas a cada geração estão discriminadas nos prompts completos: `prompts-revisao-identidade-r02.json` e `prompt-correcao-rato-r03.json`. Recortes de consulta excluem sobreposições. O inventário de referências, com hashes, consta em `exportacoes-revisao-r02.json`; inventariar não significa que todas foram anexadas ao gerador.

## Consulta à instalação original

Somente leitura da instalação. Exportações locais em `tmp/original-review/`, ignoradas pelo Git. GLOBAL.BSA: SHA256 `345385c1565d9ca73e2d59d71a422498135485e2d01d4df66355ed804209042d`. Índice confirmado: 2441 registros, diretório final com entradas de 18 bytes (nome 14, tamanho LE32); soma dos dados coincide com o início do diretório. Não há inferência do conteúdo apenas pelo nome.

Consulta primária das implementações abertas: [CFAFile](https://raw.githubusercontent.com/afritz1/OpenTESArena/master/OpenTESArena/src/Assets/CFAFile.cpp), [DFAFile](https://raw.githubusercontent.com/afritz1/OpenTESArena/master/OpenTESArena/src/Assets/DFAFile.cpp), [Compression](https://raw.githubusercontent.com/afritz1/OpenTESArena/master/OpenTESArena/src/Assets/Compression.cpp), [INFFile](https://raw.githubusercontent.com/afritz1/OpenTESArena/master/OpenTESArena/src/Assets/INFFile.cpp) e [BSATool](https://github.com/Dysperia/ArenaToolBox-BSATool). Nenhuma dependência desses projetos foi incorporada ao jogo.

Decodificador de consulta local: `tmp/original-review/decode-consult.py`. CFA usa cabeçalho, RLE, descompactação de índices por bits e tabela de conversão; DFA combina quadro-base RLE com alterações independentes relativas à base. PAL.COL contém cabeçalho de 8 bytes e 256 entradas RGB de 3 bytes; índice zero foi tornado transparente apenas na consulta dos sprites. Não foi validada a escolha dinâmica de paletas/iluminação do motor original.

Resultados vistos: RAT1.CFA 32×40/12 quadros frontal; RAT2 65×33/12 oblíquo; RAT3 91×36/12 lateral; RAT4 67×36/12 posterior oblíquo; RAT5 38×35/12 posterior; RAT6 77×53/3 com criatura caída. RAT1.DFA 36×20/19 quadros mostra variação de postura e boca. Isso não confirma o vínculo exato de cada arquivo aos estados de combate do motor. A lateral RAT3-0 foi anexada à geração, junto da referência frontal.

START.INF foi desencriptado e cita pisos FLOORA.SET, FLOORB.SET, FLOORC.IMG, paredes WALLA/B.SET, portas DOOR_1..6.IMG, SCELL.IMG e correntes. Texturas SET foram vistas em células 64×64 com PAL.COL; DOOR_1.IMG e SCELL.IMG têm 4096 bytes e mostraram porta de madeira e grade. **Não foram confirmadas associações por coordenadas do mapa nem o significado contextual de cada seletor #4/#5.** Não tratar estas listas como prova da textura usada em determinada parede.

## Avaliação dos candidatos

- Dungeon R02: piso de lajes marrons e parede de blocos frios agora distintos; grades, porta de madeira com ferro, correntes/argolas e plataforma com chave aproximam a cela das fontes. Leitura a 576×480 suficiente para distinguir superfícies. Falha remanescente: convergência de perspectiva e variação de escala das lajes. É estudo de identidade, **não tileset ortogonal ou mapa jogável aprovado**. Próxima adaptação deve fixar câmera/escala antes de folhas completas.
- Rato R02: quatro ações diferentes, porém último focinho próximo da borda. Preservado para comparação. R03 corrige enquadramento em 2×2, sem inventar estados adicionais. Exportação comum em 96×64, base y=60; caixas alpha dos quadros: (8,22,88,60), (8,24,87,60), (4,23,92,60), (7,21,88,60). Alerta, preparação, bote e recuperação são discerníveis. Incisivos e patas se leem, mas os dentes estão exagerados e merecem avaliação estética. Há deslocamento da cabeça e pequena variação de volume no retorno. **Não é animação completa de combate**: faltam transições e demais estados.
- Ria R02: cabelo escuro ondulado, manto claro, busto azul espectral e ambiente de prisão retomam a referência. Sem corpo, mãos, braços, silhueta, sombra, reflexo ou equipamento do jogador. Braços/manto espectrais são da própria Ria. A adequação artística depende do responsável.

Todos os masters antigos e exports anteriores permanecem intactos. A ilustração antiga com protagonista é histórica e rejeitada para narrativa reutilizável. O mapa 002 conserva a rodada anterior somente para comparação; não é referência artística definitiva.

## Entrega técnica e limites

Visor separado: `http://127.0.0.1:8765/tools/art-review.html` no servidor local do projeto, zoom 100%. Não acessa o motor, inventário, estado ou saves. Exibe dungeon 576×480, rato animado 96×64 e faixa 384×64, Ria 768×512. Botão pausa a sequência. Não houve alteração de mapas, plugins, banco ou arquivos internos do MV. Esta rodada pequena não integra candidatos ainda rejeitáveis ao mapa jogável.

Comparações locais com capturas originais: `tmp/original-review/comparacao-dungeon-r02.png`, `comparacao-rato-r02.png`, `comparacao-ria-r02.png`; não versionadas por conter fontes de consulta. Screenshot do visor: `doc/evidencias/m01-06-revisao-r02-browser.png`. GIF próprio do rato: `doc/arte/rato-bote-r03.gif`. Exportação reproduzível: `tools/build-art-review.py` (apenas redimensionamento, recorte, alpha e montagem, sem pintar arte substituta).

Prompts completos, parâmetros de transparência e anexos reais estão nos dois registros JSON. Quatro masters e três exports têm dimensões e SHA256 no manifesto. Nome exato do modelo não foi informado pela ferramenta. R02/R03 são versões da entrega, não nomes de modelos.

Validação humana pendente: reconhecimento de Arena/TES, materiais/escala, ameaça e anatomia do rato, estabilidade do bote, aparência de Ria e identidade narrativa. Após aprovação de direção, corrigir câmera da dungeon e completar animações necessárias. Editor MV e Galaxy A56 não foram testados nesta revisão. Navegador não comprova compatibilidade de autoria.

## Evidência de integridade e regressão

`tools/audit-art-records.py`: 25 registros de masters/exports verificados por existência, tamanho não nulo, dimensões e SHA256 (18 históricos + 7 novos). Os três arquivos de prompts estão preenchidos e legíveis; os registros antigos não estavam vazios. A rastreabilidade desta rodada cobre os anexos reais e as exportações listadas, não uma biblioteca futura. GLOBAL.BSA voltou a produzir o mesmo SHA256 após a consulta.

Chrome 156.0.8078.47: visor isolado, quatro quadros diferentes efetivamente renderizados em canvas, pausa estável, dimensões 1:1 e zero erros/404. Regressões aprovadas: `test-state-store.cjs`, `test-runtime.cjs`, `validate-data.cjs`, `test-persistence.cjs` (27 verificações), `test-boot.cjs` (movimento, eventos, menu, colisão, save/load e banco nativo), `test-art-preview.cjs` (galeria anterior e retorno ao laboratório). Esses testes da galeria anterior preservam evidência técnica e não revertem a rejeição estética. Formato canônico de plugins.js, UTF-8 sem BOM e arquivos referenciados também verificados; nenhum registro foi alterado.
