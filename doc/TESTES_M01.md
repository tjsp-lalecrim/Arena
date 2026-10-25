# Execução e roteiro de testes M01

## Desktop — laboratório

Abrir Game.rpgproject no MV 1.6.1 ou servir a pasta por HTTP e abrir index.html no Chrome. Exemplo PowerShell com Python instalado: `python -m http.server 8765 --bind 127.0.0.1`, depois http://127.0.0.1:8765/. Não usar file://. Nova partida abre Map001, laboratório técnico, não a dungeon final. Setas movem; Enter interage com o evento invisível em (8,5), imediatamente ao norte do início (8,6). Esc abre menu; salvar/carregar usa o sistema nativo, no navegador armazenado por origem. Não usar saves de testes como compromisso de compatibilidade com versões futuras.

Teste reproduzível: Playwright instalado localmente + Chrome desktop, `node tools/test-boot.cjs`. Se o pacote não estiver na resolução Node, definir ARENA_PLAYWRIGHT para seu caminho. ARENA_URL substitui o endereço padrão. Servidor iniciado antes do teste. Resultados e capturas em tmp/; dependências e arquivos gerados não são versionados. O teste usa contexto isolado, sem tocar no armazenamento de partidas pessoais.

## Samsung Galaxy A56 — preparação, execução pendente

Servir projeto na rede local confiável e abrir o endereço do computador no Chrome do A56. O bind 127.0.0.1 do exemplo acima é somente desktop: para o aparelho usar explicitamente interface de rede local, sem publicar na Internet. Registrar URL/origem usada (saves são locais à origem), versão do Android, Chrome e data. Girar para paisagem. O MV oferece tela inteira pela tecla F4 no desktop; no aparelho falta integrar botão explícito acionado por toque, que será implementado/avaliado antes de M01-19. A barra do Chrome visível não conta como apresentação em tela inteira.

Cobrir toque para mover, menu/cancelar, escolhas e teclado de nome; posteriormente slots, arrasto, combate e portal. Registrar leitura de textos, dimensões lógicas/CSS, escala, tempo até título/nova partida, fluidez e perdas de foco ao girar/retomar. Testar recarregamento e load após fechar aba. Não inferir sucesso no aparelho de emulação ou Chrome desktop. Não foram realizados testes no Galaxy A56 nesta etapa.

## Campanha — quando integrada

Checkpoints de validação: antes da chave, após porta, após combate e antes do Shift Gate. Cobertura completa está em BACKLOG_M01.md; arte, batalha e MQ01 não são comprovados pelo laboratório.

Banco mínimo: executar também `node tools/validate-data.cjs` (requer fontes locais em doc/wiki) e `node tools/test-runtime.cjs`. A integração do banco no Chrome usa instância técnica isolada de Game_Actor/Game_Action; não concede os itens ao personagem da nova partida. Evidências por etapa em doc/evidencias.
