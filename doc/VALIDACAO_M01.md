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
