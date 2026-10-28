## M01-17 R03

Roteiro test-potion-menu-guard.cjs para duplo clique, tecla/mouse mantidos, toques rápidos, troca de poção, gesto iniciado bloqueado/solto após prazo, novas pressões, sem fila, inválidos sem reiniciar, navegação e configuração. ARENA_URL/ARENA_EVIDENCE_DIR isolados. Regressões normais respeitam500ms; teste visual R02 usa0 somente na fixture para stress de animação com novas pressões. Dados de produção permanecem500. Não usar esse cenário de stress como prova da proteção: seu roteiro próprio usa os500ms reais. Evidências e pendências em PROTECAO_POCOES_M01_17_R03.md.

## M01-17 R02 — feedback de recuperação

Executar tools/test-potion-feedback.cjs e tools/test-recovery-small.cjs, com ARENA_URL do servidor local e ARENA_EVIDENCE_DIR isolado. Validar estado/estoque imediato versus preenchimento transitório, usos consecutivos, clamp, esgotamento, mensagens de impedimento, entradas/saída e save/load sem tween antigo. Geometria não substitui leitura visual. Roteiro/evidências em REVISAO_FEEDBACK_POCOES_M01_17_R02.md. Regressões pertinentes de inventário/recuperação preservadas em pasta própria, sem sobrescrever R01.

## Integração M01-17

M01-17: executar tools/validate-recovery.cjs, test-recovery.cjs e test-recovery-small.cjs (NODE_PATH do runtime com Playwright; ARENA_URL do servidor local; ARENA_EVIDENCE_DIR opcional). Contextos Chrome descartáveis/save17, sem saves pessoais. Roteiro manual curto, casos de rejeição e limites em POCOES_E_DESCANSO_M01_17.md. Regeneração nativa exercitada nas16 identidades; testes físicos e autoria do novo plugin separados.

# Execução e roteiro de testes M01

## M01-12 R02 — confirmação de equipamentos

Executar node tools/test-inventory-comparison.cjs com ARENA_PLAYWRIGHT/ARENA_URL do laboratório. O contexto Chrome descartável usa save20 próprio. Valida igualdade do save completo antes/depois de prévia/cancelamento, parâmetros finais com modificadores, sinais de aumento/redução/igualdade, remoção, nomes longos, geometria, modal bloqueando fundo e ícones após save/load. Regressões: test-inventory.cjs e test-inventory-touch.cjs aceitam ARENA_EVIDENCE_DIR para preservar R01; nesta revisão usar doc/evidencias/m01-12-r02. Não apresentar toque emulado ou navegador como teste físico ou autoria MV.

## Revisão vigente — M01-10 R02

REVISAO_COMBATE_M01_10_R02.md contém roteiro, cobertura1/16 e1/3, gravações e limites. Rodar tools/test-motion-timeline.cjs, validate-battle-motion.cjs, test-battle-motion.cjs(10 vídeos), test-battle-motion-edge.cjs e test-battle-coverage.cjs(ARENA_EVIDENCE_DIR para preservar R01). Necessário Chrome/Playwright local e servidor da raiz; contextos descartáveis. tools/inspect-motion-videos.cjs decodifica vídeos, build-motion-video-previews.py gera recortes/GIFs; não substituem inspeção no editor/mobile. Auditoria tools/audit-motion-r02.py. Responsável mantém testes manuais adiados; não registrar aceite estético automático.

## Estado vigente — M01-10 R01

Roteiro em COMBATE_M01_10.md: título Combate técnico, preparar(3,5), rato(7,5), goblin(6,8), homem-lagarto(10,8), reiniciar(11,5), novo participante(3,8). Eventos de interação, sem encontros automáticos. Confirmar novo participante inicia sessão técnica nova; cancelar preserva. Não usar saves pessoais.

Testes: `node tools/test-battle.cjs`, `test-battle-ui.cjs`, `test-battle-coverage.cjs`, `test-battle-comparison.cjs`; Chrome/Playwright local e ARENA_URL de um servidor da raiz, padrão8766. Validadores: validate-data/resources/abilities/battle e `python tools/audit-battle-assets.py`. Contextos novos isolam slots. Matriz espera mensagens/ações/frames reais, sem substituir por apply direto.

Conferir identidade, apoio, transparência, recortes, quatro estados e escala, recursos vazios versus ausentes, custos/cancelamento/poções, vitória sem repetição, derrota e save/load posterior. Ação genérica sem arma desenhada continua limitação. Testes manuais do responsável adiados; autoria/playtest visual no editor e Galaxy A56 desta versão pendentes. Não reatribuir aprovações antigas. O estado operacional M01-09 abaixo é histórico.

## Estado operacional — M01-09 R01

`tools/test-abilities.cjs`:628 verificações e192 ações por BattleManager/startAction/updateAction/invokeAction, pagamento e efeitos nativos; compara raças/armas/níveis com fixtures determinísticas e não usa só fórmulas puras. Cobertura: técnica compatível/incompatível/removida, saldo suficiente/exato/insuficiente, cancelamento/forçada/sem alvo/erro, quatro aplicações/um pagamento, custos combinados sem parcial, magia conhecida/desconhecida/Mana, Cura real, livros válidos/repetidos/estoque múltiplo/rollback e menu nativo, save anterior2561830/load/atalhos. Resultado e capturas em evidencias/m01-09/.

Regressões recursos619/criação234/racial981/persistência27/laboratório, StateStore/Runtime e validadores pertinentes. O probe de recursos agora equipa adaga antes de usar skill5: a checagem de arma M01-09 é requisito, não regressão a contornar. validate-resources reconhece ocasião1 quando o consumidor M01-09 existe; validate-abilities verifica mapeamento e ativação exatos. Evidências históricas preservadas, nenhum save pessoal. Roteiro do Map006 e limites em HABILIDADES_M01_09.md. Autoria MV e aparelho não inferidos por teste do navegador.

## Estado operacional — M01-08 R01

M01-07 R05 integrado e aprovado, P01–P08 aplicadas. Os registros abaixo que dizem não haver criação/bônus são históricos das versões indicadas. Não reabrir estética aceita com ressalvas.

`tools/test-resources-progression.cjs` usa Chrome/contexto descartável e save nativo produzido pela composição e1be141, sem saves pessoais. Cobre16 identidades, recursos atuais separados de máximos, escolhas idempotentes, níveis múltiplos/99/EXP nativa, HP/MP sem curva automática, poções nativas e item4 por menu, cama, limites, TP/regeneração/caminhada e UI confirmar/cancelar. Resultados/capturas em evidencias/m01-08/. `validate-resources.cjs` cobre configuração, reutilização pura, plugins canônicos/arquivos, manutenção de P01–P08/arte/motor e técnicas indisponíveis.

Roteiro manual e coordenadas do Map005 em RECURSOS_E_PROGRESSAO_M01_08.md: título Laboratório de recursos; eventos x3/5/7/9/11/13 em y5; use menu Recursos / evolução e Itens, salve em slot exclusivo de teste. Não interpretar pagamento controlado como batalha jogável ou cama técnica como fonte narrativa confirmada. Evidência de editor é separada do navegador; não declarar Galaxy A56 físico ou playtest NW.js visual por emulação.

## Desktop — laboratório

Validar separadamente a autoria no editor MV 1.6.1 e a execução por HTTP no Chrome. Abrir Game.rpgproject no editor não é equivalente a executar index.html no navegador. Exemplo PowerShell com Python instalado: `python -m http.server 8765 --bind 127.0.0.1`, depois http://127.0.0.1:8765/. Não usar file://. Nova partida abre Map001, laboratório técnico, não a dungeon final. Setas movem; Enter interage com o evento invisível em (8,5), imediatamente ao norte do início (8,6). Esc abre menu; salvar/carregar usa o sistema nativo, no navegador armazenado por origem. Não usar saves de testes como compromisso de compatibilidade com versões futuras.

Teste reproduzível: Playwright instalado localmente + Chrome desktop, `node tools/test-boot.cjs`. Se o pacote não estiver na resolução Node, definir ARENA_PLAYWRIGHT para seu caminho. ARENA_URL substitui o endereço padrão. Servidor iniciado antes do teste. Resultados e capturas em tmp/; dependências e arquivos gerados não são versionados. O teste usa contexto isolado, sem tocar no armazenamento de partidas pessoais.

## Samsung Galaxy A56 — preparação, execução pendente

Servir projeto na rede local confiável e abrir o endereço do computador no Chrome do A56. O bind 127.0.0.1 do exemplo acima é somente desktop: para o aparelho usar explicitamente interface de rede local, sem publicar na Internet. Registrar URL/origem usada (saves são locais à origem), versão do Android, Chrome e data. Girar para paisagem. O MV oferece tela inteira pela tecla F4 no desktop; no aparelho falta integrar botão explícito acionado por toque, que será implementado/avaliado antes de M01-19. A barra do Chrome visível não conta como apresentação em tela inteira.

Cobrir toque para mover, menu/cancelar, escolhas e teclado de nome; posteriormente slots, arrasto, combate e portal. Registrar leitura de textos, dimensões lógicas/CSS, escala, tempo até título/nova partida, fluidez e perdas de foco ao girar/retomar. Testar recarregamento e load após fechar aba. Não inferir sucesso no aparelho de emulação ou Chrome desktop. Não foram realizados testes no Galaxy A56 nesta etapa.

## Campanha — quando integrada

Checkpoints de validação: antes da chave, após porta, após combate e antes do Shift Gate. Cobertura completa está em BACKLOG_M01.md; arte, batalha e MQ01 não são comprovados pelo laboratório.

Banco mínimo: executar também `node tools/validate-data.cjs` (requer fontes locais em doc/wiki) e `node tools/test-runtime.cjs`. A integração do banco no Chrome usa instância técnica isolada de Game_Actor/Game_Action; não concede os itens ao personagem da nova partida. Evidências por etapa em doc/evidencias.

## Compatibilidade de autoria no editor MV 1.6.1

Critério obrigatório de M01-03, além do navegador: abrir Game.rpgproject sem erro de leitura; abrir o gerenciador de plugins, conferir nomes/ordem/status/parâmetros; confirmar o gerenciador e salvar pelo editor; fechar/reabrir o projeto para verificar a leitura persistida; comparar os registros de js/plugins.js antes/depois; repetir execução localhost após o salvamento. Não mudar status ou parâmetros para forçar sucesso. Se salvar reescrever outros arquivos, revisar o diff e separar mudanças alheias.

Manter js/plugins.js no formato canônico do MV: duas linhas de comentário geradas, `var $plugins =` em linha própria, `[` na linha seguinte e array JSON válido terminado por `];`, sem comentários internos. UTF-8 sem BOM e arquivos de todos os plugins referenciados presentes. JavaScript válido no navegador não comprova que o leitor do editor aceita o arquivo. Não alterar cabeçalho/estrutura por conveniência editorial.

Registro da correção e limitações de validação em VALIDACAO_M01.md. O teste automático test-boot.cjs cobre execução, não o ciclo de abertura/gerenciador/salvamento do editor.

## Persistência própria — M01-05

Contratos, limites e roteiro manual isolado em PERSISTENCIA_M01.md. Executar `node tools/test-state-store.cjs` para o núcleo sem conteúdo Arena e, com localhost/Chrome/Playwright disponíveis, `node tools/test-persistence.cjs`. Esse teste abre contexto descartável e usa somente slots 1/2/3 desse perfil. Não executá-lo anexando um perfil pessoal ao browser. A composição antiga de plugins fica em tools/fixtures/plugins-before-persistence.json (origem 5d10e90); gera um save real sem o núcleo novo, antes de carregar com os plugins atuais. Fixtures adicionais removem campos conhecidos para testar defaults e recibos preservados.

Cobertura: nova partida, identidade/nome nativo, recurso próprio, registro de progressão uma vez, etapas/objetivos/conclusão, fontes/concessões/recuperação, consumo/entrega, capacidade/rollback, inimigos/áreas sem respawn no load, atalhos e partida seguinte limpa. Testes de regressão continuam: test-runtime.cjs, validate-data.cjs e test-boot.cjs. Estado em VALIDACAO_M01.md. Não confundir a composição de plugins redirecionada somente no teste com uma alteração do arquivo real js/plugins.js, que permanece canônico com cinco registros.

Autoria manual ainda necessária após esta feature: abrir o projeto no MV 1.6.1, gerenciador (Community_Basic off; Arena_Runtime, Arena_TechnicalPreview, MV_StateStore e Arena_Persistence on, nessa ordem), confirmar, salvar/reabrir e revisar os registros, depois executar novamente localhost. Usar perfil separado para o roteiro de save/load e consultar snapshot/identity no console; o teste não oferece UI nova. A confirmação manual do responsável sobre abertura da correção anterior está registrada separadamente e não valida automaticamente esses novos plugins. Galaxy A56 não testado.

## Amostra artística M01-06

Título → Amostra visual abre Map002 sem alterar o início/laboratório original. Roteiro e arquivos em doc/arte/AMOSTRA_M01_06.md. `node tools/test-art-preview.cjs` usa Chrome descartável: entrada, rato, movimento, colisão, save/load com imagens/HP/recurso próprio, ilustração sem quest e retorno. `tools/build-art-samples.py` exporta os mestres IA por montagem técnica e verifica dimensões/alpha/baselines. Não confundir esse teste com batalha ou folha SV completa. Conferir manualmente perspectiva/identidade, bordas, recortes, legibilidade a32/48/96px e loop. Editor e A56 com a nova amostra permanecem pendentes; confirmação manual anterior não se estende aos novos assets.

## Revisão visual isolada R02/R03

Abrir `/tools/art-review.html` no servidor local, zoom 100%. Conferir dungeon 576×480 com piso/parede distintos; rato 96×64 com alerta, preparação, bote e recuperação (botão pausa); Ria 768×512 sem protagonista. Comparar às fontes e versões anteriores conforme `arte/REVISAO_IDENTIDADE_R02.md`. Não é mapa jogável ou combate. Rodar `tools/test-art-review.cjs` com Playwright e Chrome instalado. Aprovação estética do responsável é requisito separado dos testes de carregamento e formato; M01-06 continua em revisão. Testes no editor e A56 não foram executados nesta rodada.

## Galeria R04

Título > Validação visual R04 abre Map003; Enter diante de Ria(4,9), cela(7,9), saída(1,9). Teste `tools/test-art-integration.cjs` cobre mapa/tileset, quatro quadros do rato, colisão, save/load isolado, ilustrações e retorno sem MQ01. `tools/test-art-viewport.cjs` é somente pré-teste de viewport Android genérico no desktop, não teste Galaxy. Resultados em `doc/evidencias/m01-06-r04-*.json`. Matriz de critérios, roteiro de editor e aparelho: `arte/INTEGRACAO_R04.md`. Direção aprovada é evidência separada dos testes e não conclui M01-06.

## R05 — autoria e viewport

`test-art-viewport.cjs` agora verifica fonte primária26px e tamanho CSS≥16 na simulação916×412, além de tocar a placa de Ria por touchscreen emulado e aguardar o percurso/abertura nativos (não inicia evento por chamada direta). Resultado/screenshot m01-06-r05-* preservam os R04. Nenhum teste físico A56. Salvar/reabrir no editor foi executado via teclado/acessibilidade com comparação semântica; conferência visual ainda pendente. Matriz e limites em `arte/FIDELIDADE_E_VALIDACAO_R05.md`. Não existe criação M01-07 para testar nesta versão.

## Criação M01-07

`test-character-creation.cjs`: funções de nome e grupo de arma, teclado/cancelamento/revisão/confirmação,16 combinações e234 verificações de API/estado/bonificações/equipamento/save-load, imagens nativas vazias reconstruídas, flag ausente com recibo e rollback. `test-character-pointer.cjs`: mouse e toque80ms Android genérico emulado, previews, revisão/cancelamento sem gravação e remoção do campo HTML. Arquivos m01-07-* em evidencias/. Contextos Chrome descartáveis, slots1/2 somente nesses contextos. Regressões de laboratório agora selecionam arenaLab explicitamente; Novo Jogo é testado pela criação, não contornado como se fosse laboratório. A56 físico/NW.js visual/IME/fullscreen/desempenho não declarados.


## Expansão M01-10 R03

Executar tools/test-battle-expansion-r03.cjs com ARENA_EXPANSION_FINAL=1, tools/audit-battle-expansion-r03.py e tools/validate-battle-motion.cjs; Chrome/Playwright em contexto isolado, ARENA_URL para o servidor local. Evidências17 perfis novos/47 vídeos, regressões e autoria em evidencias/m01-10-r03. Roteiro manual em EXPANSAO_COMBATE_M01_10_R03.md. Arquivos/tempos R02 aprovados preservados; revisões anteriores são históricas. Sem alegação de Galaxy A56/NW.js visual ou aprovação estética das novas variantes.


## Interface M01-11

tools/validate-battle-ui.cjs verifica geometria pura, UTF8,18 plugins preservando16, mapa/tropas com somente trio/reinício e motor/regras/arte inalterados. tools/test-battle-slots.cjs executa ações nativas, configuração/atalhos/limites/cancelamento/save-load e múltiplos inimigos. tools/test-battle-slots-category.cjs valida o fallback final para categoria única e cancelamento sem custos. tools/test-battle-slots-pointer.cjs testa mouse/toque Android genérico com canvas/pontos dentro da viewport e ajuda≥16px CSS. Roteiro, capturas e gravação em INTERFACE_BATALHA_M01_11.md e evidencias/m01-11. Testes no editor por teclado/acessibilidade separados do Chrome; não declarar NW.js visual ou Galaxy A56 físico.


## M01-11 R02 — regressão de resultado e apresentação

Executar tools/test-battle-ui-refinement.cjs e tools/validate-battle-ui-refinement.cjs. Para as suítes de slots/categoria/ponteiro e capture-battle-ui.cjs usar ARENA_UI_OUT=doc/evidencias/m01-11-r02 (capture pode usar a subpasta apresentacao); test-battle.cjs usa ARENA_EVIDENCE_DIR=doc/evidencias/m01-11-r02/regressao-combate. Não sobrescrever evidências R01. ARENA_URL aponta para o servidor local, ARENA_PLAYWRIGHT para a instalação disponível. Contextos de navegador descartáveis, sem saves pessoais.

Conferir visualmente principal/habilidades/inventário/configuração/alvos/vitória e redução real640×480; execução/mensagens/resultados não podem captar atalhos/configuração, nem sobrepor mensagem/EXP. Documentar o ambiente real: emulação de toque não é Galaxy A56; autoria no editor anterior não é inspeção NW.js desta revisão. Roteiro completo e referências em REVISAO_INTERFACE_M01_11_R02.md.


## M01-12

Executar tools/validate-inventory.cjs, test-inventory.cjs, test-inventory-touch.cjs e test-inventory-appearance.cjs com ARENA_URL no servidor e ARENA_PLAYWRIGHT instalado. Saídas em evidencias/m01-12, contexto descartável sem saves pessoais. Roteiro manual em INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Regressões: test-character-creation.cjs com ARENA_EVIDENCE_DIR=evidencias/m01-12/regressao-criacao, test-persistence.cjs (saída tmp copiada), test-battle-slots.cjs com ARENA_UI_OUT=evidencias/m01-12/regressao-interface.

Verificar estoque alterado após prévia, capacidade de devolução cheia, repetição, rollback de falha nativa simulada, consumível por referência estável apesar de seleção alterada, drag válido/inválido/fora e Escape durante o gesto, opção única sem lista redundante, importantes, técnicas/atalhos, consumo de poções/livros e save/load. Pranchas/pixels de16×2 materiais não provam figurino final/anatomia de todos os movimentos; manter avaliação visual separada. Autoria editor20 plugins foi observada por acessibilidade; não declarar playtest visual NW.js ou Galaxy A56 físico.


## Integração M01-13

M01-13: tools/validate-loot.cjs (24 matrizes e preservação), tools/test-loot.cjs (11 cenários nativos/contratos), tools/test-loot-presentation.cjs (mobile/reserva/rolagem), regressões test-inventory e test-inventory-touch com ARENA_EVIDENCE_DIR=doc/evidencias/m01-13/regressao-inventario. ARENA_PLAYWRIGHT aponta runtime Playwright; ARENA_URL para servidor descartável. Contextos próprios e save20, sem saves pessoais. Não trocar tabelas distribuídas para forçar raros. Manifesto/hash e limites em evidencias/m01-13 e LOOT_M01_13.md. Validação editor/A56 não inferida.


## Atualização M01-14

M01-14: tools/validate-dungeon.cjs e tools/test-dungeon.cjs; Chrome em contexto descartável, ARENA_PLAYWRIGHT/ARENA_URL, save20 isolado. Caminhada nativa pela rota, porta acionada por teclado, piso/sólidos, save/load e laboratório; ferramentas de imagem apenas montagem técnica. Editor tentativa falhou e não conta como aprovação. Evidências em evidencias/m01-14; regressões loot11/persistência27. Não sobrescrever históricos: test-loot aceita ARENA_EVIDENCE_DIR nesta revisão.

## M01-14 R02

Roteiro detalhado: DUNGEON_M01_14_R02.md. Executar build-dungeon-objects.py e build-dungeon-map.py antes de validate-dungeon.cjs; test-dungeon-revision.cjs grava testes isolados, capturas e canvas em evidencias/m01-14/r02. test-dungeon.cjs aceita ARENA_EVIDENCE_DIR para preservar as evidências históricas; saída desta rodada r02/regressao. Não inferir teste no editor a partir da execução Chrome. Repetir manualmente portas nos4sentidos, ocupado, piso/apoio, entrada/saída/cantos da água, teclado/clique e salvar na água; editor e aparelho físico pendentes.
M01-14 R03: validate-dungeon.cjs delega em validate-dungeon-r03.cjs; audit-dungeon-r03.py confere dobradiças/centros/alpha; test-dungeon-r03.cjs usa Chrome descartável e saves16/17 para28 travessias, encaixes, água e migração. Regressão test-dungeon.cjs com ARENA_EVIDENCE_DIR=doc/evidencias/m01-14/r03/regressao. Gerar assets com build-dungeon-r03-assets.py antes do mapa. Não sobrescrever evidências R01/R02. Editor e avaliação estética continuam separados.

Pesquisa de natação27/10/2026: fontes/condições em INVESTIGACAO_NATACAO_ARENA.md e evidencias/m01-14/aprovacao-natacao. Experimento DOS de parado/movimento/zero/HP NÃO realizado por falta de janela observável; roteiro é futuro. Não aplicar S01 nem substituir gasto exclusivo de combate. Aprovação do mapa não comprova ciclo de autoria. validate-dungeon.cjs reexecutado, sem repetir as baterias R03.

Autoria MV1.6.1 em cópia: TESTE_EDITOR_M01_14.md. prepare-mv-authoring-copy.py cria fixture ignorada sem sobrescrever; verify-mv-authoring-copy.py confere original/fixture/contratos e marcador, sem presumir operação do editor. Playtest Explorar Dungeon confirmado pelo responsável, sem extrapolar. Nenhuma captura repetida nesta tentativa; A56 físico não bloqueia desktop.

## M01-15 — roteiro e evidências

Executar node tools/validate-encounters.cjs e, com servidor local e Playwright, node tools/test-encounters.cjs. Contextos Chrome descartáveis/save18; não usa saves pessoais. Roteiro manual em ENCONTROS_M01_15.md. Resultado/capturas/vídeo e regressões em evidencias/m01-15. Autoria M01-14 confirmada pelo responsável não prova novos eventos/plugins. Galaxy A56 permanece integração mobile.

## M01-16

validate-quests.cjs cobre núcleo/contratos/UTF8/formato canônico27/plugins anteriores/alterações permitidas. test-quests.cjs executa eventos/menu/recuperação/consumo/Gate/tesouro/save-load/falhas em Chrome descartável, saves18/19, sem saves pessoais. Registro em evidencias/m01-16; regressões guardadas em subpasta própria. Native autoria MV e A56 físico não inferidos de testes de navegador. Roteiro manual em QUESTS_M01_16.md.

## NAV01 e diário M01-16 R02

DIRETIVA_DE_NAVEGACAO.md é critério permanente de validação dos menus. Para o diário, executar validate-journal.cjs e test-journal.cjs; fixtures de muitas quests/textos/estados somente em contexto descartável/save21, sem fictícias na campanha. Testar filtros vazio/pendente/concluído/todas, seleção/leitura preservadas, estado após carregar, roda no painel correto, foco, retorno e painéis ocultos; 816×624,640×480 e Android genérico916×412 emulado. Roteiros/evidências em REVISAO_DIARIO_M01_16_R02.md. Emulação não substitui Galaxy A56 físico.
