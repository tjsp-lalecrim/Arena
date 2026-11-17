# Infraestrutura de prévia manual

Exceção restrita de CI: este commit não promove o jogo em desenvolvimento a estável. Runtime, mapas, banco e assets de main permanecem na base anterior. O jogo é obtido de outro checkout por SHA completo.

Dependências do workflow: Node24/Git no ubuntu-24.04, os três arquivos de tools deste commit e as ações oficiais declaradas no YAML. Não depende dos scripts existentes no commit do jogo. A receita inclui imagens dinâmicas, sem poda de assets.

**Actions → Arena - previa manual Pages → Run workflow → Branch: main**. Para validar o pacote aprovado, `source_sha=9fab698f89f54f8bdf1dae38ad1db6e6f09f6f56`, **publish desmarcado**. Isso empacota/valida no Linux e produz o artefato github-pages, sem habilitar/configurar/publicar o site. Só existe acionamento manual. O manifesto identifica o jogo; o SHA mostrado pelo run também identifica a infraestrutura.

Publicar de fato exige autorização posterior e nova execução manual com publish marcado. O namespace compatível permanece arena:m01:save-v1; não limpar dados do navegador. Prévia Pages não é release do M01. Procedimento e histórico do projeto na [feature de preparação](https://github.com/tjsp-lalecrim/Arena/blob/feature/m01-19-isolamento-saves/doc/PUBLICACAO_TESTE_PAGES_M01_19.md).

## Política vigente dos pacotes

O workflow usa a receita do checkout fixado em `source_sha`. Em seguida, o finalizador seleciona em `tools/pages-package-policy.json` o manifesto autorizado para o SHA inteiro. O validador confere o inventário, a caixa dos caminhos, o tamanho e o checksum de cada arquivo antes de enviar o artefato.

| Prévia | Fonte | SHA-256 do manifesto |
| --- | --- | --- |
| RC1 do M01 | `e407a69193e168c6c1a160ab5809b1781b4a6478` | `77ca50126995b178ddc9c2bcabbc8d99527e296103981ef83ebf5497b5c6c831` |
| MQ02, teste integrado | `0bbc74ccb2889bf33ced31dcca13e92742e3964c` | `80ef435ca94be0b9e4f7aaae83e39683f6e77af04f158c28d96fcb87d7bc8a22` |

A RC1 mantém a conversão CRLF dos arquivos registrados. O pacote de MQ02 é verificado com os bytes da receita, sem conversão. Essa receita ainda usa o rótulo `m01-rc1` no manifesto. Identifique a prévia pelo `sourceCommit`. O endereço público e o namespace `arena:m01:save-v1` são compartilhados entre as duas prévias.
