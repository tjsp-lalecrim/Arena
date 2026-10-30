# MV_WebStorageNamespace 0.1.0

Isola as chaves web do RPG Maker MV 1.6.1 sem alterar payload, compressão ou migrações dos sistemas próprios. Plugin reutilizável produzido pelo Codex, sem dependências externas, IDs de Arena ou comandos de plugin.

## Configuração e contrato

Parâmetro obrigatório `Namespace`: prefixo exclusivo, não vazio, usando letras ASCII, números, `:`, `.`, `_` ou `-` (primeiro caractere alfanumérico). Arena usa **`arena:m01:save-v1`**. Carregar antes dos plugins que possam ler armazenamento na inicialização; no registro atual está após Community_Basic desativado e antes de Arena_Runtime. Parâmetro inválido interrompe a inicialização com erro explícito.

O único ponto estendido é `StorageManager.webStorageKey`. Preserva o sufixo nativo e acrescenta `Namespace + ':'` apenas em modo web:

| Uso | Chave de exemplo |
| --- | --- |
| Configuração | `arena:m01:save-v1:RPG Config` |
| Índice global | `arena:m01:save-v1:RPG Global` |
| Slot 1 (demais slots seguem o MV) | `arena:m01:save-v1:RPG File1` |
| Backup do slot 1 | `arena:m01:save-v1:RPG File1bak` |

Backups de configuração/índice também recebem o sufixo nativo `bak`. Salvar, carregar, verificar, remover, restaurar e limpar backups usam a mesma chave resolvida. Não há outro consumidor de localStorage nos plugins de persistência inspecionados. MV_StateStore/Arena_Persistence continuam responsáveis pelo conteúdo interno e suas migrações.

## Política de compatibilidade

**Build não é versão de compatibilidade.** Atualizações comuns e `System.versionId` não mudam o namespace. Não incluir hash, data ou número de build no parâmetro. Mudar `save-v1` exige decisão explícita de incompatibilidade e eventual plano de migração em outra tarefa; o plugin não implementa migração.

Na primeira utilização, os slots web podem parecer vazios: as chaves antigas genéricas (`RPG File1`, etc.) continuam existentes, mas não são lidas, importadas, sobrescritas ou apagadas por este plugin. Podem pertencer a outro jogo. Não usar `localStorage.clear()`.

Origem significa protocolo, host e porta. `127.0.0.1` e `localhost`, portas diferentes, HTTP/HTTPS e perfis diferentes do Chrome têm armazenamentos separados. GitHub Pages é outra origem (não configurada nesta entrega). O playtest NW.js do editor usa arquivos `save/*.rpgsave` e `.bak`, com caminhos e funções inalterados. Não existe transferência automática entre esses ambientes.

## Validação e avaliação manual

Execução focal: `node tools/test-web-storage-namespace.cjs` com Playwright/Chrome disponíveis. O teste usa um perfil persistente sintético em `tmp/`, carrega os arquivos reais por localhost e altera somente respostas de configuração para o segundo namespace/build compatível. Não copia assets, não muda a identificação da campanha nem acessa saves pessoais. Roteiro e resultados: [resultado.json](../evidencias/m01-19-isolamento-saves/resultado.json). Testa fluxo nativo de salvar/Continuar/carregar, configuração, backups, reinício do processo Chrome, isolamento na mesma origem, chaves genéricas, atualização compatível e defaults de payload anterior. Backend de arquivos verificado com `fs`/NW.js simulados, **sem operar o editor**.

Avaliação do responsável em **http://127.0.0.1:8765/**, mesmo perfil Chrome em todas as etapas:

1. **Nova Partida** → concluir criação/introdução → na dungeon, **Esc → Salvar** e escolher um slot.
2. Recarregar a página → **Continuar** → selecionar o slot e conferir personagem/local.
3. Fechar o Chrome, reabrir no mesmo perfil e endereço → **Continuar**. Conferir que o slot permanece disponível.

Servidor local desta entrega: Python, PID **10572**, raiz Arena, limitado a `127.0.0.1:8765`; permanece ativo para avaliação. Encerrar em PowerShell: `Stop-Process -Id 10572` (confirmar o PID se o serviço tiver sido reiniciado). Nenhum deploy foi configurado. Relato manual posterior do responsável (save/load, recargas e abas) registrado em [VALIDACAO_M01.md](../VALIDACAO_M01.md), sem extrapolar para reinício do navegador, isolamento entre jogos ou concorrência no mesmo slot. Novo ciclo de autoria no MV e Galaxy A56 físico continuam pendentes; este recorte não fecha o M01-19 integrado. Pacote em outra porta/subpasta tem roteiro próprio em [PACOTE_WEB_M01_19.md](../PACOTE_WEB_M01_19.md).
