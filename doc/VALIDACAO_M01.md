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

## 25/10/2026 — banco mínimo (M01-04)

Feature/m01-dados, dependências M01-02 e M01-03 integradas em develop. Conteúdo e IDs em DADOS_M01.md. Um ator/classe técnica, chave, três poções, dois livros, duas armas/tipos, duas armaduras/tipos, técnicas leves/pesadas catalogadas, Cura/Dardo, três estados, três inimigos/tropas e oito raças com fontes/adaptações; 16 visuais explicitamente pendentes. Nenhuma classe profissional, bloqueio racial ou drop nativo introduzido. Recursos sem crescimento automático, aguardando M01-08. Habilidades com Vigor não podem ser usadas até implementação dos custos. Estado próprio e consumidor do catálogo ainda são trabalho das próximas features.

Fontes adicionais lidas: Base Armor pp.1–2, The Known Spellbook pp.1–3, Magical Effects p.3; Races pp.1–12, Monsters pp.2/6/13/17, Base Weapons p.2 e Potions p.1. Preservadas cópias de consulta. As adaptações raciais de natação/escalada não criam esses sistemas; bônus e números catalogados são provisórios até M01-07/08.

validate-data.cjs passou: todas as tabelas parseiam, índices/IDs e referências entre registros válidos, tipos equipáveis, chave importante, loot nativo desativado e mapa válido. test-runtime.cjs passou. test-boot.cjs passou novamente no Chrome 156.0.8078.47/WebGL, com integração adicional: canEquip=true para quatro equipamentos, adaga ID1 e cota ID2 equipadas, cura de 10 para 60 HP, livro ensina skill9, aplicação repetida sem benefício rejeitada pelo teste nativo. Resultado em doc/evidencias/m01-04-boot.json; capturas em m01-04-mapa/menu.png. Fluxo básico sem pageerror/HTTP >=400. Inspeção visual das capturas acompanha esta etapa.

M01-04 concluído no escopo de banco mínimo. Limitações: bônus raciais catalogados não aplicados; Vigor, proteção/saneamento da chave por quest, aprendizado completo, progressão e animações ainda não implementados. Nenhum combate, criação de personagem, diário ou encerramento foi testado. Doença do rato exige adaptação antes de concluir combate. M01-05 a M01-20 permanecem a fazer. Não há evidência de testes em aparelho, toque ou tela inteira mobile.

A inspeção visual do banco detectou acentos corrompidos por leitura com codificação Windows. Corrigidos System/Classes e instrução do mapa para UTF-8; validador agora exige termos pt-BR e rejeita esse padrão de corrupção. README.TXT original consultado: instalação se identifica como 1.07 CD-ROM, consistente com omitir proteção de cópia no portal; Docs/Passwords.txt consultado apenas como referência histórica, não usado para custos adaptados.

## 25/10/2026 — correção de leitura de plugins pelo editor

Branch feature/correcao-plugins-editor, originada de develop com árvore limpa. Relato do usuário: localhost executa, mas o editor informa “Não foi possível ler o arquivo plugins.js”. Comparação com main confirmou que o cabeçalho canônico de duas linhas e a separação de `var $plugins =` e `[` haviam sido alterados na preparação da base (2d79de3). Isso foi um erro na compatibilidade de autoria: a validação anterior cobria somente o navegador.

Correção mínima em js/plugins.js: restauradas apenas as duas linhas canônicas de comentário e a quebra antes do array. Registros internos preservados, inclusive descrições: comparação estrutural automática antes/depois confirmou nomes, ordem, status e parâmetros idênticos. Community_Basic continua false; Arena_Runtime e Arena_TechnicalPreview continuam true. Nenhum plugin próprio, arquivo interno do motor ou dado do jogo alterado.

Verificado: UTF-8 válido sem BOM com decodificação estrita; `node --check js/plugins.js`; array isolado aceita JSON.parse sem comentários; avaliação JavaScript preserva os três registros; todos os três arquivos js/plugins/<nome>.js existem. Formato igual à estrutura da versão em main. CRLF mantido no arquivo de trabalho.

Causa confirmada nesta execução: divergência de formato introduzida pela edição anterior, sem arquivo ausente ou erro de sintaxe/UTF-8. Causa provável do erro do editor: incompatibilidade de seu leitor com essa estrutura alterada. A causalidade específica do leitor MV ainda não foi confirmada por reprodução antes/depois ou inspeção de seu código; não afirmar essa hipótese como diagnóstico conclusivo.

Tentativa de validação no editor instalado em D:/RPG Maker MV/RPGMV/RPGMV.exe: aplicativo iniciado e janela “RPG Maker MV” identificada. A captura inicial falhou com “FrameArrived timed out: timed out waiting on channel”; após nova seleção/ativação, a recuperação falhou com “window capture timed out: timed out waiting on channel”. O controle foi interrompido sem usar entradas às cegas. Não foi possível verificar versão exibida, abrir o projeto, ler o gerenciador de plugins, salvar pelo editor nem reabrir o projeto. Esses passos estão explicitamente pendentes. Abrir o executável não conta como abrir o projeto.

Após a normalização, tools/test-boot.cjs passou em localhost, Chrome desktop 156.0.8078.47, WebGL, viewport 1100×800: título, nova partida, movimentação, interação, menu, salvar/carregar nativos no navegador, colisão, integração do banco e zero pageerror/HTTP >=400. Esse salvamento é de partida no navegador, não de projeto pelo editor. A execução após um futuro salvamento pelo editor continua pendente. Resumo em doc/evidencias/correcao-plugins-editor.json.

Critérios de TESTES_M01.md e BACKLOG_M01.md ampliados para exigir autoria no editor além de execução. M01-03 reclassificado como em validação até o ciclo do editor ser comprovado. Os registros de conclusão anteriores são históricos e não substituem esse critério. Correção mantida na feature enquanto a validação de autoria estiver pendente; sem integração em develop, envio remoto ou release nesta tarefa.
