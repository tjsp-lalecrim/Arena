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

## Evidência manual recebida — abertura no editor após correção

Nesta rodada, o responsável confirmou que o projeto voltou a abrir no RPG Maker MV após a normalização de js/plugins.js (5d10e90). Evidência manual fornecida pelo responsável, não execução do Codex. O resultado confirma a correção do problema de abertura observado. Não comprova leitura/conferência no gerenciador, salvamento/reabertura do projeto nem localhost após salvamento pelo editor; esses passos continuam pendentes. Revisão local: árvore limpa em feature/correcao-plugins-editor, somente os cinco arquivos esperados no commit. Integração dessa feature em develop autorizada expressamente nesta rodada; M01-03 permanece em validação parcial.

## M01-05 — estado persistente dos sistemas próprios

Execução em feature/m01-persistencia, originada de develop após a integração expressamente autorizada da correção do editor (5d10e90 + evidência manual 21f1439). Árvore inicial limpa, remoto origin corresponde ao repositório informado; nenhuma consulta/alteração remota necessária. Commit de implementação: 5ee6781, seguido de testes/evidências nesta feature, sem merge desta nova feature.

Contratos em PERSISTENCIA_M01.md e documentação de MV_StateStore/Arena_Persistence. O núcleo não contém IDs Arena e é testado sem dados do projeto; o adaptador contém somente contratos/IDs de integração. Game_System recebe raiz schemaVersion 1 e namespace arena v1; o motor continua responsável por serialização/armazenamento nativos. Extensões por alias, sem modificar motor. Registros anteriores de plugins comparados estruturalmente com develop: nomes/ordem/status/descrições/parâmetros preservados; dois novos registros ao fim. Arquivo canônico, UTF-8 sem BOM, JSON válido e arquivos referenciados presentes.

| Critério M01-05 | Evidência |
| --- | --- |
| Identidade/recursos/progressão | Nome somente no ator; raça/gênero/base visual em contrato; recurso próprio e decisão de aumento persistem; nenhum crescimento aplicado ou cache de armadura salvo |
| Quests e itens importantes | Etapa/objetivos/conclusão persistem; fonte da chave e recibos de consumo/entrega sobrevivem a load; repetição não duplica nem repõe consumo legítimo |
| Inimigos e áreas | Instâncias técnicas comuns/específicas, derrota, conclusão/saída/geração persistem; load não provoca respawn |
| Atalhos | Referências de item e skill persistem, sem quantidades derivadas; ID inválido rejeitado |
| Saves antigos e campos ausentes | Save criado com os três plugins anteriores em navegador isolado carregou com os plugins novos, preservando nome, HP, poções e magia nativos; defaults próprios adicionados sem concessões. Fixtures parciais preservam recibos |
| Repetição e falhas | Fonte repetida, recuperação explícita, consumo/entrega repetidos, capacidade insuficiente e exceção após gainItem testados; rascunho/recibo não confirmado em falha; núcleo genérico impede repetição de contador de recompensa |

Resultados: tools/test-state-store.cjs, tools/test-runtime.cjs, tools/validate-data.cjs, tools/test-persistence.cjs e tools/test-boot.cjs passaram. Syntax checks dos dois plugins e dois testes passaram. Persistência: 27 verificações no Chrome desktop 156.0.8078.47, MV 1.6.1, contexto descartável; zero pageerror/HTTP >=400 na página atual. Regressão do laboratório/banco manteve título, nova partida, movimento, interação, menu, save/load, colisão, equipamentos livres, cura e livro. Resultado consolidado em doc/evidencias/m01-05-persistencia.json.

O teste legado gera slot 3 com a composição anterior de plugins (fixture de 5d10e90), sem MV_StateStore/Arena_Persistence; depois carrega com a composição atual no mesmo contexto descartável. Slots 1/2 testam também remoção de raiz/campos. Não foi usado, lido ou sobrescrito save pessoal. Um primeiro ensaio do teste novo selecionou Continuar por padrão devido ao save legado; o teste foi corrigido para selecionar explicitamente Nova partida, e a execução final passou.

M01-05 concluído no escopo de contratos, persistência e operações técnicas, sem antecipar UI, combate, quests completas, respawn automático ou aplicação de progressão/raciais. Não existe novo evento no mapa. Sanitização de duplicatas legadas e verificações de transição da quest continuam M01-16; loot completo continua M01-13. Defaults não reconstroem progresso perdido/corrompido por suposição. Versões futuras incompatíveis geram falha explícita sem reescrever o save.

Limitações de autoria: a confirmação manual recebida cobre abertura no editor após a correção anterior. Não foram executados gerenciador, salvamento/reabertura nem localhost após salvamento pelo editor com os novos plugins; M01-03 permanece em validação parcial. NW.js e Galaxy A56 não testados. Roteiro manual isolado em PERSISTENCIA_M01.md e TESTES_M01.md. Sem push, merge da nova feature, release ou publicação.

## Evidência manual recebida — save/load em playtest e navegador

O responsável confirmou nesta rodada que conseguiu salvar e carregar a partida tanto pelo playtest do RPG Maker quanto pelo navegador. Evidência manual fornecida pelo responsável, não executada pelo Codex. Referência mais provável: feature/m01-persistencia em 99e3788, HEAD local/remoto no início desta rodada; o responsável não informou SHA, versão de navegador ou se conferiu cada campo próprio, portanto essa associação é contextual, não confirmação exata de build/cobertura. O resultado não valida conteúdo posterior de M01-06, nem gerenciador/salvamento/reabertura do projeto pelo editor (diferente de salvar a partida).

Revisão M01-05: árvore limpa, remoto da feature igual ao local (0/0), diff restrito a contratos/plugins/testes/documentação. Reexecutados test-state-store, test-runtime, validate-data e 27 verificações test-persistence com sucesso. Integração em develop autorizada nesta rodada, preservando commits; main permanece no commit inicial cfd31d3, sem promoção de desenvolvimento a release.

## M01-06 — primeira amostra artística e publicação das linhas Git

GitHub conferido por fetch/ls-remote e API antes de agir: não havia main/develop no remoto; padrão era feature/correcao-plugins-editor; feature/m01-persistencia coincidia local/remoto. Sem alterações locais preexistentes. M01-05 revisado, evidência manual contextual registrada em aee1914, integrado em develop por merge77f120d preservando 5ee6781/99e3788. main publicado em cfd31d3 (somente baseline inicial); develop publicado em77f120d. PATCH da configuração GitHub e nova consulta API confirmaram default_branch=main; ls-remote confirmou HEAD→main. Sem force push, reescrita, tag ou release. Feature/m01-amostra-visual criada de develop; sua publicação para revisão é autorizada, sem integração automática.

Geração por IA disponível e executada via image_gen.imagegen. Oito chamadas: ficha de bretã, caminhada, rato, pedra, ícones, sonho de Ria e duas correções. Prompts/referências efetivamente anexadas em doc/arte/prompts-m01-06.json; fichas/fontes/processo/limites em AMOSTRA_M01_06.md; PNGs mestres em art/masters e exports/dimensões/SHA em exportacoes-m01-06.json. Modelo/seed não informados pela ferramenta. Consultadas explicitamente wiki/prints ignoradas e README da instalação original; nenhuma fonte externa incluída por acidente. Imagens de outros jogos orientaram leitura, não estilo.

| Categoria exigida | Geração/integração | Verificação realizada |
| --- | --- | --- |
| Personagem de exploração | Bretã piloto em folha nativa3×4 de144×256, células48×64 | Vista em escala real e no mapa; quatro direções, margens e pés emy62; passos curtos de estudo |
| Combatente Side View | Mesma ficha, pose96×96 | Vista lateral na galeria; estática, não folha completa svActors nem combate |
| Inimigo animado | Rato3×96×64, sequência0/1/2/1 | Capturas e GIF do motor, escala comum, caudas preservadas, apoioy60; nenhum sistema de batalha |
| Chão/parede | Tiles48×48 na folha B de768×768, Tileset2 | Mapa repete amostras, diferencia piso/parede e respeita colisão; kit mínimo sem autotiles/cantos |
| Arma/armadura/poção | Três ícones32×32 de IA | Inspeção visual em tamanho real na galeria; não substituem IconSet do banco ainda |
| Ilustração | Sonho de Ria/prisioneira,816×544 | Evento nativo show/erasePicture e texto; vista na janela do jogo; MQ01 permanece etapa0 |

Testes executados: build-art-samples.py, com dimensões, transparência, margens em todas as células e bases fixas; node --check do plugin; validate-data, test-state-store e test-runtime; test-art-preview em Chrome156.0.8078.47/WebGL, janela1100×800, jogo816×624, 10 verificações; test-boot e test-persistence (27 verificações) também passaram após integração. Save/load da amostra preservou Map002, posição, imagens, HP nativo e recurso próprio de prova. Retorno ao Map001 confirmado com imagens anteriores; diff de Map001/System vazio. Zero pageerror/HTTP>=400 no percurso testado. Perfis descartáveis, sem saves pessoais.

Inspeção visual de capturas corrigiu sobreposição da legenda de perfil e texto da galeria aparecendo sob a cena de Ria. Um ensaio automatizado acionou a saída antes de terminar o interpretador do evento: teste passou a aguardar canMove/isEventRunning; última execução passou. Evidências finais: doc/evidencias/m01-06-arte.json, m01-06-mapa.png, m01-06-ria.png, m01-06-loop.gif. O GIF usa frames capturados no motor; não substitui a inspeção em escala final.

M01-06 concluído no escopo da pequena amostra solicitada nesta rodada: todas as categorias geradas/integradas/verificadas em navegador desktop. Isso não aprova biblioteca completa nem combate: perfil é pose isolada, rato só farejo/respiração, caminhada de estudo, piso/parede com repetição perceptível sem autotiles. Variantes de armadura/base e demais combinações continuam M01-12/07; não geradas por associação a este item. Não há vozes, quest completa, novo inventário, criação de personagem ou cena narrativa final.

Abertura: título → Amostra visual; Map002. Enter diante da placa Ria em(4,9) mostra arte; placa Sair em(1,9) retorna ao laboratório. Esc abre menu/salvar. Instruções e limitações em doc/arte/AMOSTRA_M01_06.md. Editor com esses novos assets/plugins, gerenciador/salvamento/reabertura do projeto e Galaxy A56 não testados. A evidência manual de playtest/browser recebida no início não foi atribuída a M01-06. M01-03 mantém pendências de autoria, sem alegar que save de partida equivale a salvar o projeto.

## Revisão estética M01-06 — 2026-10-25

O responsável rejeitou a identidade visual anterior. **M01-06 em revisão; não concluído artisticamente.** Formatos funcionando não substituem aprovação estética. Direção de arte 1.1 proíbe protagonista ou quaisquer membros/sombras/equipamentos dele em narrativa reutilizável.

Rodada pequena: dungeon R02, rato R02 com correção R03 e Ria R02. Referências visuais inspecionadas e consulta decodificada à instalação, com limitações de associação documentadas em `arte/REVISAO_IDENTIDADE_R02.md`. Anteriores preservados. Dungeon ainda tem perspectiva convergente; rato é trecho de bote, não combate completo. Sem produção em lote nem promoção da rodada rejeitada.

Visor isolado `tools/art-review.html`: Chrome desktop, imagens 1:1, carregamento, animação e pausa sem erros/404. Teste `tools/test-art-review.cjs`. Screenshot `doc/evidencias/m01-06-revisao-r02-browser.png`. Testes de persistência: 27 verificações aprovadas em contexto descartável, sem saves pessoais; testes de estado, runtime e banco mínimo aprovados. A evidência de navegador não comprova editor ou aparelho. Nenhum teste novo no editor MV ou Galaxy A56 nesta rodada. Aprovação estética, mapa ortogonal final e animação completa permanecem pendentes.

## Aprovação de direção e integração R04 — 25/10/2026

Responsável aprovou a direção da dungeon R02, rato R03 e Ria espectral R02 após `4faf3b2`; arquivos/dimensões/hashes exatos em `arte/APROVACAO_DIRECAO_R02_R03.json`. Essa evidência manual supersede a espera de aprovação da revisão anterior, mas não amplia a aprovação aos assets antigos ou a todos os testes técnicos. M01-06: **em validação técnica, não concluído**.

Galeria nova Map003/tileset3, título “Validação visual R04”, mantém Map001/002 e anteriores. Ria/rato aprovados reutilizados sem regeneração; uma amostra de superfícies ortogonais gerada com a dungeon aprovada como referência. Documentação, prompt, avaliação e matriz das categorias em `arte/INTEGRACAO_R04.md`.

Executados: `test-art-integration`, `test-art-preview`, `test-state-store`, `test-runtime`, `validate-data`, `test-persistence` (27 verificações) e `test-boot`; salvar/carregar em contexto descartável, sem saves pessoais; zero erros/arquivos faltantes. Auditoria de 27 registros e seis referências aprovadas inalteradas. Screenshots/resultados R04 em `doc/evidencias/`.

Pré-teste de viewport Android genérico no Chrome desktop:916×412, canvas538,77×412; sem extravasar. Texto de painel equivale a11,22px CSS, pequeno e pendente de leitura física. **Não testado no Galaxy A56.** Editor/gerenciador/salvar projeto/reabrir/playtest da versão R04 não executados. Não transferir evidências manuais de versões anteriores para esta integração.

Tentativa de autoria pelo Codex: o executável instalado abriu janela com título “Arena - RPG Maker MV”, mas `get_window_state` falhou duas vezes (incluindo recuperação com seleção renovada) com `window capture timed out: timed out waiting on channel`. Sem captura verificável, não foram feitas ações de gerenciador, salvamento/reabertura ou playtest. A janela/título isolados não comprovam leitura completa do projeto. Essas verificações continuam pendentes.

## R05 — prioridade do original, autoria e leitura da galeria

Em25/10/2026, consulta direta a ARENA/README.TXT (1.07 CD-ROM), Manual.pdf p.7 e Player Guide.pdf da instalação; wiki Races/Character Creation como complemento. Nova prioridade explícita em DIRETRIZES_DE_ADAPTACAO.md, DIRECAO_DE_ARTE.md e INICIO_NO_CODEX.md. Materiais do manual não são medição do executável; adaptações numéricas permanecem identificadas. Khajiit de Arena não deve ser substituído automaticamente pela aparência de títulos posteriores. Fontes extraídas ficam somente em tmp ignorado.

Arena_ArtPreview0.2.1 melhora leitura mobile da galeria atual, sem regenerar imagens: texto primário26px (17,17px CSS na simulação916×412; antes11,22). Toque emulado percorre caminho nativo e abre Ria. Evidências R05 e inventário de16 combinações em `arte/FIDELIDADE_E_VALIDACAO_R05.md`; uma piloto, zero conjuntos finais completos.

Editor: gerenciador abriu/fechou via teclado, Ctrl+S regravou dados, editor fechou e reabriu Arena. Comparação semântica preserva banco e contratos de plugins, exceto metadados nativos registrados. `evidencias/m01-06-r05-editor-roundtrip.json`. Captura/clique indisponíveis e nomes das linhas custom não visíveis por acessibilidade; não declarar conferência visual completa nem playtest da galeria. Galaxy A56 físico não testado. M01-06 em validação; M01-07 não iniciado, sem merge prematuro da dependência. Início normal ainda é laboratório; não há tela de criação para testar.
