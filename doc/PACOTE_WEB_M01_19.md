# Pacote web local — M01-19 R01 (29/10/2026)

Preparação para futura avaliação de publicação; **sem deploy, GitHub Pages, release, merge ou push**. Mesma feature/m01-19-isolamento-saves. Nenhum código de gameplay, mapa, asset, parâmetro de plugin ou namespace foi alterado nesta entrega.

## Conteúdo e identificação

Pacote gerado: `dist/web/m01-19-web-r01-9fab698/Arena/`, ignorado pelo Git. Runtime do commit **9fab698f89f54f8bdf1dae38ad1db6e6f09f6f56**, versão de teste **m01-19-web-r01**. São **317 arquivos de execução + package-manifest.json**, **37.911.412 bytes** no total (37,91 MB / 36,16 MiB), sem compressão. Manifesto SHA-256: `32d1b0bf9ccf61f2930795e65de6d5a4254c084e0d744e60c06c50fd260625dc`.

Lista explícita em `tools/web-package-allowlist.json`: index, fontes, scripts do motor/bibliotecas, plugins próprios e Community_Basic preservado, JSONs do banco/configurações/mapas e pastas de imagens de execução. Contagens:17 arquivos explícitos,38 JSONs,33 plugins e229 PNGs. Regras de áudio/vídeo estão explícitas; atualmente não há arquivos nessas categorias. Os acessos técnicos existentes continuam presentes, sem alterar a campanha.

Inclui **todas** as imagens das pastas autorizadas, não apenas as referenciadas pelo banco nativo: preserva animações, aparências, objetos, ilustrações e demais carregamentos dinâmicos dos plugins. Não aplica poda de assets. Exclui doc/wiki/prints/evidências, art/estudos, tmp/extrações originais, ferramentas, Git, saves, package.json de NW.js e demais arquivos de desenvolvimento. O manifesto gerado é apenas identificação/inventário técnico com tamanho e SHA-256 de cada arquivo; não contém saves nem interfere na execução.

## Reconstrução e serviço local

Na raiz do projeto, com Node.js e Git disponíveis:

```powershell
node tools/build-web-package.cjs
node tools/serve-web-package.cjs dist/web/m01-19-web-r01-9fab698/Arena 8771
```

O primeiro comando informa o diretório gerado para o **HEAD atual**: substituir o caminho do segundo comando pelo informado se o commit mudar. A identificação do pacote de avaliação acima refere-se ao runtime9fab698; novos commits recebem outro diretório, sem modificar o jogo ou seu namespace. Manter a mesma receita/commit/arquivos produz os mesmos bytes e manifesto (sem timestamps). O preparador recusa runtime com alterações não commitadas, arquivos obrigatórios ausentes e uma saída existente divergente; nunca limpa ou sobrepõe silenciosamente outra versão. A segunda execução sobre este pacote conferiu o inventário e os hashes, sem diferenças. Não há ZIP ou binário versionado; somente scripts/receita/documentação/evidências no Git.

O servidor serve apenas o inventário em **http://127.0.0.1:8771/Arena/**, limitado a127.0.0.1, sem cache persistente/service worker/atualização automática. Rejeita capitalização incorreta inclusive no Windows, como aproximação ao hosting com caminhos sensíveis a maiúsculas. Falha se a porta estiver ocupada; não encerra outros serviços. Porta8771 foi verificada livre antes da inicialização. Servidor da avaliação **PID12792**, mantido ativo; encerrar com `Stop-Process -Id 12792` (confirmar se reiniciado). Serviço pessoal8765/PID10572 preservado.

## Verificações focais

`tools/test-web-package.cjs` usa Playwright e Chrome instalados, um novo perfil sintético em tmp/ e, por padrão, o endereço acima. Execução: `node tools/test-web-package.cjs <diretório-do-pacote>`; `ARENA_URL` permite outro endereço de avaliação. Nenhuma cópia adicional da biblioteca de assets para o teste, alteração de identidade da campanha ou uso dos saves pessoais.

Chrome156.0.8078.73 headless, viewport1100×800: inventário exato sem arquivos de referência/desenvolvimento/saves;317 arquivos conferidos por HTTP com SHA-256; rejeição de caminhos com capitalização errada; Nova Partida/criação → introdução/Ria → Map008; menu nativo Salvar → reload → Continuar/carregar, preservando personagem, local, quest, recursos e narrativa.112 URLs de runtime observadas, todas dentro de /Arena/, sem erros de página/requisições. Namespace mantido **arena:m01:save-v1**. [Resultado](evidencias/m01-19-pacote-web/resultado.json), [introdução](evidencias/m01-19-pacote-web/introducao.png) e [entrada na dungeon](evidencias/m01-19-pacote-web/dungeon.png).

Limites: não é o percurso completo até o Gate, nem auditoria visual de todas as combinações/assets/combates, nem teste de GitHub Pages. O servidor simula uma subpasta e capitalização, sem reproduzir todas as políticas do hosting futuro. Sem nova operação no editor ou Galaxy A56 físico; este permanece previsto ao final do M01. M01-19 completo continua aberto.

## Avaliação do responsável

Abrir o endereço8771/Arena/, iniciar Nova Partida, concluir criação/introdução e, na dungeon, **Esc → Salvar**. Recarregar e usar **Continuar** para conferir o slot/local. Essa porta usa outro armazenamento em relação a8765. **Subpastas na mesma origem não isolam saves:** se dois pacotes forem servidos no mesmo protocolo/host/porta e namespace, compartilham o armazenamento. Não mudar o namespace por build; política em [MV_WebStorageNamespace](plugins/MV_WebStorageNamespace.md). Publicação e avaliação do pacote aguardam próxima autorização; não presumir aprovação do novo pacote a partir dos testes anteriores em8765.
