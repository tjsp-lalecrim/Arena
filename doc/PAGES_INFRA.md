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
| MQ02, assets agrupados (Fantasma, objetos, lava e Blubamka) | `01f9915657329d47c922a1d1c78583bb625d3698` | `5bfb33136283a9407f15905bdf1e176814758884f0cc12e5780ca320f85a51c9` |

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


## Prévia de MQ02 com cama corrigida e interiores — 19/11/2026

Fonte publicada `1339e2aa07a9b04282509e84b97c43c7c7c1f30d`, infraestrutura `7d6cc9beac4a09d652c03305a614c3e5ce8325c7`. [Execução manual 44629638641](https://github.com/tjsp-lalecrim/Arena/actions/runs/44629638641), pela main com publish=true: build Linux e deploy concluídos com sucesso. Pacote com 394 arquivos de runtime e 54.432.691 bytes incluindo manifesto; artefato do Actions com 41.901.959 bytes. O manifesto tem SHA-256 `82f8eec9a2eb2558c582ba38a644c123ca960d3f3c0e03257b5203280368bab1`.

[Endereço público](https://tjsp-lalecrim.github.io/Arena/) e namespace `arena:m01:save-v1` preservados. No Chrome157 isolado, o título abriu sem erros, os 394 arquivos foram comparados por tamanho/SHA-256, e foram conferidos configuração da área da cama, evento corrigido, sinalização, cama E e os dois atlas C/D carregados e decodificados. [Resultado](evidencias/mq02-pages-rihad-interiors/resultado.json). Isso não substitui a avaliação manual do descanso, da visão ou da composição dos interiores.

**Roteiro público pendente:** seguir informante/placas Pousada até a fachada(313,42), entrar e alcançar o quarto. Aproximar-se da cabeceira ou do pé, testar Enter e clique na cama. Com nível2+ e visão ainda não lida, terminar a leitura; salvar/carregar e descansar novamente para conferir recuperação sem repetição. Visão já concluída deve permanecer concluída. Na corte, conferir leitura do salão, audiência ou entrega conforme a etapa do save. Os testes técnicos de recuperação, migração, audiência e entrega estão no [registro dos interiores](CHEGADA_RIHAD_M02_03A.md#interiores-v01-e-correção-da-cama--19112026).

Não limpar dados do site nem transferir saves automaticamente. Saves pessoais foram preservados; testes técnicos usaram perfil/partidas sintéticas isolados. Rótulo herdado `m01-rc1` não identifica a revisão: conferir `sourceCommit`. Publicação continua manual; release permanece para o fechamento do marco.

## Prévia agrupada de assets do M02 — 20/11/2026

Fonte do jogo **`01f9915657329d47c922a1d1c78583bb625d3698`**, contendo Fantasma `b996fb3`, grades/portais/objetos `e5d822e`, lava `0d613fc` e Blubamka `01f9915`. Infraestrutura do workflow `24b9460ed71a6cd485e7855731ce4d489a0d7b55`; somente registro do manifesto selecionado, sem alteração funcional. [Execução manual44708123431](https://github.com/tjsp-lalecrim/Arena/actions/runs/44708123431), pela main, SHA completo e `publish=true`: build Linux e deploy concluídos com sucesso. Duas construções idênticas, inventário/capitalização/tamanhos/checksums e manifesto autorizado conferidos. Pacote:408arquivos de runtime,55.301.529bytes incluindo manifesto. Artefato Actions:42.682.216bytes.

[Jogo público](https://tjsp-lalecrim.github.io/Arena/) · [Manifesto](https://tjsp-lalecrim.github.io/Arena/package-manifest.json). SHA-256 do manifesto: `5bfb33136283a9407f15905bdf1e176814758884f0cc12e5780ca320f85a51c9`. O rótulo herdado `m01-rc1` não representa a etapa da campanha: conferir `sourceCommit`. Origem e namespace `arena:m01:save-v1` preservados. Não limpar dados do site; saves de localhost/outros dispositivos não são transferidos automaticamente. Sem release, tag ou alteração de acionamento: Pages continua exclusivamente manual.

Conferência pública em Chrome isolado: [resultado](evidencias/mq02-pages-assets/resultado.json) e [abertura](evidencias/mq02-pages-assets/titulo-publico.png). A primeira passagem recebeu HTTP503 para `Arena_Skeleton.js`; a conferência foi repetida serialmente, sem atribuir causa ao erro. O teste de publicação não substitui avaliação manual de descanso, visão, composição, combate ou persistência da campanha.

### Roteiro único de avaliação agrupada

Retomar saves públicos nas etapas pertinentes; não é necessário reiniciar uma partida já avançada. Para ver Ria, usar save com nível2+ e visão ainda não lida; uma visão já concluída deve continuar concluída.

1. **Pousada do portão:** falar com o informante, seguir placas Pousada até a fachada Map009(313,42), entrar e alcançar o quarto. Interagir com a cama por Enter ou clique, conferir recuperação integral e visão disponível de Ria. Salvar/carregar e descansar novamente: visão concluída não se repete. No nível1, é possível voltar após evoluir.
2. **Corte:** seguir placas e marcador Audiência conforme a etapa. Aproximar-se de Blubamka, conferir sprite, retrato e leitura do pedido ou da entrega do pergaminho. A fisionomia e o traje são interpretação regional documentada, não afirmação canônica. Preservar pedido/recibo e salvar/carregar na corte conforme o roteiro principal.
3. **Stonekeep e mina:** viajar pelo portão com os destinos conhecidos. Conferir as grades de Stonekeep e, em Fang Lair, grades das celas, portais, suportes e trilhos nos trechos da rota. Verificar leitura da interação e passagem após abertura, sem presumir conclusão de todas as áreas.
4. **Segundo nível:** observar o ciclo da lava a partir da margem seca, sem tentar alcançar a ilha. Após o segundo enigma, observar os dois Hell Hounds da sala do fragmento. O corredor central permite coletar a peça sem derrotá-los. Se quiser avaliar o combate, salvar antes e aproximar-se de um deles. Continuar a retaliação e o retorno a Rihad pelo [roteiro integrado](MQ02_ESPECIFICACAO.md#roteiro-integrado-de-mq02-no-chrome).
5. **Fantasma, avaliação por vídeo:** [patrulha e combate em velocidade normal](evidencias/m02-fang-ghost/fantasma-patrulha-combate-normal.webm). Não procurar encontro ativo na campanha: MIF(3,49) continua dependendo de comprovação do acesso junto ao poço seco e parede em(6,49)/(7,49). Os assets estão no pacote; o hub é desabilitado no perfil público destinado ao jogador.

**Pendências reais preservadas:** avaliação manual integrada e visual dos conjuntos recentes; cobertura restante de alas/conexões/encontros de Fang Lair (40/76 no primeiro nível,17/19 no segundo), incluindo câmara do Fantasma e ilha de dois ghouls; rota e regras de risco/proteção para lava; vínculo visual de dragon gate e posições de vagonetes ainda não confirmados; costa/flora/objetos específicos restantes de Rihad; arte definitiva do Servo de Tharn e ilustrações narrativas orientadas por bloco, uma por entrega. Não converter essas lacunas em encontros ou arte fictícios. As11espécies confirmadas já têm combate/patrulha, o que não declara todas as posições integradas nem sua aprovação artística. Release permanece para fechamento do M02.
