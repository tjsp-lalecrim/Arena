# Execução e roteiro de testes M01

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
