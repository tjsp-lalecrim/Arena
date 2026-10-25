# Evidências de implementação M01

## 25/10/2026 — baseline documental (M01-01)

Estado inicial confirmado: main, develop e feature/documentacao-inicial apontavam para cfd31d3; feature/documentacao-inicial ativa. Apenas .gitignore e doc/ estavam não rastreados. Nenhuma alteração de implementação preexistente foi encontrada. Motor confirmado por Game.rpgproject e Utils.RPGMAKER_VERSION: 1.6.1.

Revisados os seis documentos de entrada, diretrizes temáticas de plugins, personagem, combate, quests, adaptação e arte. Decisões atuais prevalecem sobre os diagnósticos históricos. Corrigidas instruções de cópia e inspeção de branches que ainda pareciam atuais.

Verificação automática de referências DOCUMENTO.md/txt dos 25 documentos: nenhuma ausente. .gitignore mantém wiki, prints, saves e temporários fora do índice. Inventariadas explicitamente doc/wiki, doc/prints e a instalação original/ARENA, sem modificar fontes. O conjunto documental e .gitignore será revisado no índice antes do commit e integrado em develop localmente. Nenhum envio, tag ou release autorizado ou executado.

M01-01: critérios documentais verificados; commit e integração serão identificáveis pelo histórico Git. Os demais itens ainda não possuem evidência de implementação nesta baseline.

## 25/10/2026 — especificação MQ01 (M01-02)

Baseline consolidada no commit 29fc22b e integrada em develop. Especificação na feature/m01-especificacao-mq01. Leitura dos PDFs locais Imperial Dungeons (seis páginas, não quatro), Main Quest, Races, Monsters, Base Weapons e Potions. Renderização Poppler; inspeção visual das pp. 2, 3 e 5 de Imperial Dungeons. Identificadas cela oriental e saída sudoeste, sem afirmar cópia geométrica integral. Print skyrim_quest_system.jfif visto para hierarquia do diário. Fontes externas permanecem ignoradas e intactas.

M01-01 concluído. M01-02 concluído quanto a especificação: sequência, traduções, fontes, áreas, conteúdo mínimo, patrulhas e transições registrados em MQ01_ESPECIFICACAO.md. Nenhum evento narrativo ou mapa final declarado implementado. Cama não confirmada no percurso; validação técnica separada. Nenhum playtest do original ou teste mobile realizado.

## 25/10/2026 — laboratório executável (M01-03)

Feature/m01-base-executavel. Novo Map001 17×13 com bordas por região, início válido (8,6), evento de instrução em (8,5), menu e persistência nativa. Configuração Side View e personagem único; sem batalha neste laboratório. Removidas referências configuradas a título, veículos e sons inexistentes; não restaurada biblioteca padrão. Código do motor preservado. Community_Basic preservado/desativado, ajustes ativos inventariados em doc/plugins/Arena_Runtime.md. Configuração nativa cobre auto renderer, corrida desligada e dimensões originais; Arena_Runtime mantém cache 20 MPix.

Execução real: tools/test-boot.cjs, Chrome desktop 156.0.8078.47 headless, viewport 1100×800, jogo 816×624, WebGL, Windows. Passaram título, nova partida, movimento, mensagem, menu, salvar pelo menu, carregar recuperando posição, colisão e ausência de pageerror/HTTP >=400. Capturas de mapa e menu inspecionadas; sobreposição inicial do nome de mapa corrigida. Resultado reproduzível em tools/test-boot.cjs, resumo persistido em doc/evidencias/m01-03-boot.json. Teste em contexto isolado sem saves pessoais. Avisos não fatais de Canvas2D do motor antigo podem aparecer.

node --check dos dois plugins e tools/test-runtime.cjs passaram. O teste de Runtime cobre padrões, parâmetros inválidos e configuração 960×540 em ambiente mínimo sem dados Arena. Isso não atesta layout 960×540 nem outras versões do motor.

M01-03 concluído. Limites: grade e marcador são formas técnicas geradas pelo código, sem arte final, sons, criação de personagem ou campanha. M01-06 e combate não concluídos. Samsung Galaxy A56, toque e NW.js não testados; roteiro em TESTES_M01.md, botão touch de tela inteira ainda pendente. Nenhuma publicação/release.
