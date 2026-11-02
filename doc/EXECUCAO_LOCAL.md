# Execução local do Arena — procedimento único

Vigente em 02/11/2026. **Endereço canônico: http://127.0.0.1:8774/**. Servidor de desenvolvimento versionado em `tools/serve-dev.cjs`, lançado por `tools/arena-local.cmd`. Substitui comandos temporários em tmp/Python; registros antigos de servidores/portas são históricos. O servidor de pacote em subpasta tem outra finalidade e não é o procedimento de desenvolvimento. Não altera Pages, workflow, release ou política de publicação manual.

## Iniciar, acessar e encerrar

No terminal, dentro de `D:\RPG Maker MV\Projects\Arena`:

```powershell
.\tools\arena-local.cmd start
```

Abrir **http://127.0.0.1:8774/** no Chrome. Se o servidor deste projeto já estiver ativo, o comando informa/reutiliza PID e pasta; não inicia duplicata. Em primeira execução permanece ativo no terminal. O lançador usa primeiro o Node já instalado pelo ambiente Codex; se ausente, tenta Node funcional do PATH. Não instala software ou altera nvm/configurações. Isso evita o shim nvm sem versão ativa encontrado nesta máquina.

Para conferir a instância ou encerrá-la:

```powershell
.\tools\arena-local.cmd status
.\tools\arena-local.cmd stop
```

`stop` só encerra o servidor que corresponde ao projeto e à identidade/token local em `tmp/dev-server.json`. Não encerra outros serviços, não apaga arquivos/saves ou armazenamento do navegador. Se não reconhecer a instância, recusa. Se a porta 8774 estiver ocupada por outro serviço, informa Server HTTP e PIDs/processos quando o sistema permitir, retorna erro e **não escolhe outra porta nem encerra o ocupante**. Identificar a finalidade antes de qualquer decisão. O bind é exclusivo em 127.0.0.1; não publica na rede local.

## Atualização de arquivos e versão

Todas as respostas deste servidor — HTML, JS, JSON, imagens, fontes, CSS e demais tipos, incluindo erros — levam **`Cache-Control: no-store, max-age=0`**, `Pragma: no-cache` e `Expires: 0`. Não envia ETag/Last-Modified nem responde 304 por condicionais: nova requisição recebe os bytes atuais. Mesmo caminho, sem parâmetros aleatórios por recurso. A lista de conteúdo vem da allowlist de runtime já usada no empacotamento; não há listagem de diretórios ou exposição de save/doc/extrações.

Após alterar o jogo, **recarregamento normal/F5**, quando for seguro para a partida, é suficiente para os recursos testados. Não usar limpeza de cache ou Ctrl+F5 como rotina. O banco e imagens **já carregados em memória** continuam na aba atual até recarregar; isso preserva a sessão e não é cache HTTP. Não há reload automático/hot reload. Salvar antes se quiser manter o progresso não salvo. Se alterar o próprio servidor, encerrar/iniciar pelo mesmo procedimento para carregar seu código novo.

**Testes / Debug** mostra discretamente:

- **Aba:** commit curto, `*` quando a árvore está alterada e assinatura do runtime fornecida na abertura do HTML.
- **Disco:** identificação atual, consultada uma vez ao abrir o hub; “runtime confere” ou “alterado: F5 quando seguro”. Não reinicia o jogo.

O servidor injeta a identificação somente no HTML servido; `index.html` no disco/pacote não é alterado. A assinatura inclui conteúdo/caminhos dos arquivos de runtime da allowlist; commit/branch/dirty são identificados separadamente. Commits só documentais podem mudar SHA mantendo a assinatura do runtime. Respostas têm `X-Arena-Content-SHA256` dos bytes enviados para conferência. Endpoints locais `/__arena_dev/status` e `/__arena_dev/version.json` não existem no Pages; sem `ArenaDevBuild` o hub mantém o comportamento anterior. Assinatura de build não é versão de compatibilidade/namespace dos saves.

Revisões de URL já existentes para os cadastros de Stonekeep/Fang Lair foram **preservadas**: atendem também a histórico de publicação/cache fora deste servidor. Não acrescentar novos remendos por plugin para um problema que o servidor de desenvolvimento deve resolver.

## Saves e mecanismos de cache

`arena:m01:save-v1` permanece inalterado. Atualizar arquivos/servidor na mesma origem não remove partidas. **127.0.0.1 e localhost são hosts diferentes**, logo armazenamentos diferentes; porta, protocolo e perfil também fazem diferença. Não redirecionar, migrar/importar saves ou trocar namespace para resolver cache. Localhost de desenvolvimento, Pages e aplicativo não prometem transferência automática.

Busca no código atual (`index.html`, `js` e workflow) não encontrou registro/uso de service worker, CacheStorage ou AppCache. Chrome do **perfil descartável de teste** confirmou 0 registros, nenhum controlador, 0 caches e nenhum atributo manifest. Isso não prova ausência no perfil pessoal, que **não foi inspecionado ou alterado**. Se houver evidência de uma aba antiga controlada por service worker, identificar script/escopo em DevTools → Application → Service Workers e discutir o tratamento antes de remover qualquer registro/cache; **não usar Clear site data**. Este procedimento não registra, desregistra ou limpa esses mecanismos.

## Verificação focal desta entrega

Última prova 1bcf1f9 revisada: Map014 de 274×274 viável no runtime, 5 grupos e acompanhamentos focais registrados, editor não confirmado e campanha preservada. Não foi repetida a campanha nem o benchmark.

Encontradas **duas instâncias Python** na porta 8774, PIDs 17812/28744; comandos conferidos apontavam ao script temporário do projeto. Nova CLI recusou serviço não reconhecido sem trocar porta/encerrar processos. Depois da identificação, somente essas instâncias foram terminadas e substituídas; não há evidência de que a duplicidade tenha causado cache antigo. [Registro anterior](evidencias/dev-localhost/servidores-anteriores.json). Start/stop/reuso do servidor próprio conferidos, inclusive controle de identidade.

`tools/test-dev-server.cjs`: Chrome 156 headless, perfil descartável, **origem canônica real 8774**; headers e hashes conferidos para HTML/JS/JSON/PNG/CSS/TTF/metadados/404, inclusive condicionais com retorno 200. JSON técnico `ArenaStonekeepRuntimeProof.json` recebeu marcador temporário first→second, apareceu atualizado após reload comum e foi **restaurado byte a byte**, sem alteração funcional. Hub mostrou aba antiga/disco novo e depois coincidência. Campanha sintética normal no Map008, criada somente no perfil isolado: **menu Salvar, slot 16 → recarregar → título Continuar/Carregar, slot 16**, preservando personagem, recursos gastos, quest, posição e variável de controle. Chaves ficaram no namespace existente. Nenhum save pessoal, IndexedDB ou dado do site foi limpo.

[Resultado](evidencias/dev-localhost/resultado.json), [debug com diferença](evidencias/dev-localhost/debug-versao-diferente.png), [debug atualizado](evidencias/dev-localhost/debug-versao-atual.png). Não atribuir avaliação manual, reinício do navegador, mobile ou percurso completo a essa verificação. A execução de teste deve ocorrer isolada, pois modifica temporariamente um JSON técnico e o restaura em finally; não rodar simultaneamente a outra edição desse arquivo. O servidor ficará ativo para avaliação, com encerramento pelo comando acima.
