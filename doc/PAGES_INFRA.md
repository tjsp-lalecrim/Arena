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
| MQ02, marcador de Rihad | `ec6ad3c3aec7a69937f1d23605b592b5f8599d51` | `a18517b5234d77e6e0b2e83d40bc9a91f75a146a68f5895384a1899672ba1b5b` |
| MQ02, pousada de Rihad | `0d8f2095257ca5e5f4ffd2cbdb3f140d493b61a3` | `a316c6b25d693dca202baf3057a802645f82d8dffb6f6495a24c77d641869df1` |
| MQ02, cama corrigida e interiores de Rihad | `1339e2aa07a9b04282509e84b97c43c7c7c1f30d` | `82f8eec9a2eb2558c582ba38a644c123ca960d3f3c0e03257b5203280368bab1` |

A RC1 mantém a conversão CRLF dos arquivos registrados. O pacote de MQ02 é verificado com os bytes da receita, sem conversão. Essa receita ainda usa o rótulo `m01-rc1` no manifesto. Identifique a prévia pelo `sourceCommit`. O endereço público e o namespace `arena:m01:save-v1` são compartilhados entre as duas prévias.


## Prévia de MQ02 com orientação de Rihad — 18/11/2026

Fonte publicada `ec6ad3c3aec7a69937f1d23605b592b5f8599d51`, infraestrutura `6cf944e66962033673f61a0401221878108350b4`. [Execução manual 44401004838](https://github.com/tjsp-lalecrim/Arena/actions/runs/44401004838), build Linux e deploy concluídos com sucesso. Pacote com 390 arquivos de runtime, 53.992.350 bytes incluindo manifesto. Artefato do Actions com 41.651.633 bytes.

O [jogo público](https://tjsp-lalecrim.github.io/Arena/) mantém a origem e o namespace `arena:m01:save-v1`. O [manifesto](https://tjsp-lalecrim.github.io/Arena/package-manifest.json) identifica o SHA acima. A receita ainda traz o rótulo `m01-rc1`; o campo `sourceCommit` identifica esta prévia de MQ02.

Verificação pública em Chrome 157 isolado: manifesto e os 390 arquivos comparados por tamanho/SHA-256, abertura do título e carregamento de `Arena_Rihad.js` e `ArenaRihad.json` com rota, 50 placas e 380 fachadas. [Resultado](evidencias/mq02-pages-rihad/resultado.json). A primeira conferência recebeu HTTP 503 para uma imagem de lobo; repetida com menos requisições simultâneas, passou integralmente. Não foi atribuída causa ao erro transitório.

A avaliação do responsável permanece **pendente** no [roteiro integrado, passos 1 e 2](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome). Retomar um save público anterior à audiência ou chegar a Rihad pela campanha. No nível 2, descansar, terminar a visão e conversar com o informante. Conferir as instruções, as placas da Corte e a seta Audiência até a grade; ao entrar na corte a seta desaparece. Após aceitar o pedido, seguir a orientação de Blubamka e as placas do Portão urbano.

Preservar os dados do site e os saves públicos. Saves de localhost pertencem a outra origem e não são transferidos automaticamente. Esta publicação é uma prévia de teste; release segue no fechamento do marco.


## Prévia de MQ02 com a pousada de Rihad — 18/11/2026

Fonte publicada `0d8f2095257ca5e5f4ffd2cbdb3f140d493b61a3`, infraestrutura `19f53490336f9da918aec56248a6cd4ed131817a`. [Workflow manual 44408015343](https://github.com/tjsp-lalecrim/Arena/actions/runs/44408015343) executado pela main com publish=true. Build Linux e deploy concluídos com sucesso. Pacote com 392 arquivos de runtime, 54.101.351 bytes incluindo manifesto. Artefato do Actions com 41.665.416 bytes.

O [jogo público](https://tjsp-lalecrim.github.io/Arena/) mantém a origem e o namespace `arena:m01:save-v1`. O [manifesto público](https://tjsp-lalecrim.github.io/Arena/package-manifest.json) identifica a fonte acima e tem SHA-256 `a316c6b25d693dca202baf3057a802645f82d8dffb6f6495a24c77d641869df1`. O rótulo herdado `m01-rc1` continua na receita; usar `sourceCommit` para identificar esta prévia.

Verificação pública em Chrome isolado: abertura do título, manifesto e os 392 arquivos comparados por tamanho/SHA-256. A configuração aponta para Map018, cama/evento2 e fachada(313,42); o mapa contém os contratos de descanso/saída, e a imagem da cama foi carregada e decodificada. [Resultado e limites](evidencias/mq02-pages-rihad-inn/resultado.json).

**Avaliação manual do responsável pendente**, integrada a MQ02:

1. Falar com o informante e seguir as placas **Pousada**.
2. Entrar na fachada correspondente, **Pousada do portão**, em Map009/(313,42), e seguir até o quarto.
3. Interagir com a cama no nível 2 ou superior para assistir à visão disponível de Ria.
4. Salvar, carregar e descansar novamente para conferir recuperação e apresentação única da visão.

Uma partida que já registra a visão lida deve preservar essa conclusão. Para avaliar a apresentação, retomar um save público anterior à visão. Preservar dados do site e saves existentes. Saves de outras origens ou perfis não são transferidos automaticamente. A release fica para o fechamento do marco.
