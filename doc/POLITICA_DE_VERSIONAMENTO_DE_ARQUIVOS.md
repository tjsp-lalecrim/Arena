# Avaliação de arquivos para o Git e gitignore

Inspeção em 25/10/2026. Na inspeção inicial não havia .gitignore; posteriormente ele foi aplicado na raiz conforme a proposta aprovada. O Git já rastreia os dados e scripts do projeto; doc/ ainda aparece como não rastreada. A proposta foi aplicada nesta atualização. GITIGNORE_PROPOSTO.txt é mantido como registro da especificação original; .gitignore na raiz é o arquivo efetivo.

## Recomendações

| Conteúdo | Tratamento recomendado | Motivo |
| --- | --- | --- |
| Documentos Markdown próprios diretamente em doc/ | Versionar | Requisitos, decisões, marcos e adaptação são parte da feature documental |
| doc/wiki/ | Ignorar no repositório do jogo | Cópias externas para consulta local: 66 PDFs, aproximadamente 40,16 MB |
| doc/prints/ | Ignorar no repositório do jogo | Capturas externas para referência: 16 imagens, aproximadamente 2,56 MB; não são assets finais |
| doc/FONTES_LOCAIS.md | Versionar | Permite identificar e repor as fontes sem guardar as cópias no Git |
| doc/arte/ e doc/plugins/ quando criados | Versionar os registros e documentos próprios | Prompts, decisões, dependências e validações são rastreabilidade do projeto |
| img/, audio/, movies/, fonts/ e icon/ usados pelo jogo | Versionar os assets finais necessários | Uma cópia do repositório deve conter os recursos necessários para executar a versão de desenvolvimento |
| data/, js/, index.html, package.json e Game.rpgproject | Manter no Git | Código, banco de dados e configuração do projeto |
| save/ | Ignorar | Progresso de testes e configuração local de execução; fixtures intencionais devem ficar em pasta própria |
| Dependências instaladas, caches, logs, temporários e builds exportados | Ignorar por caminhos e padrões específicos | São saídas locais, substituíveis ou reproduzíveis |
| Arquivos .env com valores locais | Ignorar, mantendo modelos sem segredos | Configuração privada de ferramentas |

Não ignorar doc/ inteira, arquivos Markdown em geral, todas as imagens ou todos os PDFs. O tipo do arquivo não determina se é fonte externa ou entrega autoral. Não ignorar js/libs/ nem plugins próprios necessários ao jogo; a política de autoria dos plugins é uma questão separada do versionamento dos arquivos do motor.

## Fontes externas continuam disponíveis localmente

Ignorar uma pasta não a apaga, mas ela não acompanha clones do repositório. O Codex deve consultar explicitamente doc/wiki/ e doc/prints/ quando necessário, pois buscas que respeitam gitignore podem omitir seus arquivos. Não usar a ausência na busca padrão como evidência de que as fontes não existem.

Manter o índice atualizado com arquivo, origem, finalidade e, para novas referências, URL e contexto quando disponíveis. Os arquivos locais de consulta não devem ser distribuídos como recursos do jogo. A instalação original em D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena já está fora do repositório e não precisa de padrão de exclusão neste projeto.

## Mestres de arte e resultados intermediários

Não há uma pasta de mestres autorais definida nesta inspeção. Não excluí-los indiscriminadamente: versões escolhidas podem ser necessárias para editar e reconstruir assets. Ao criá-la, separar mestres selecionados de tentativas descartadas e caches. Avaliar Git LFS se arquivos autorais grandes tornarem isso necessário; não configurar LFS nesta revisão.

As pastas build/, dist/, output/, tmp/ e temp/ da proposta são reservadas a saídas geradas na raiz. Antes de utilizá-las, manter essa finalidade explícita; não armazenar ali a única cópia de trabalho autoral importante. Nenhuma delas foi identificada como pasta existente nesta inspeção.

## Relatórios históricos

DIAGNOSTICO_INICIAL.md, REVISAO_DE_PRONTIDAO.md e AVALIACAO_DE_CONSISTENCIA.md são documentação própria e não devem ser escondidos pelo gitignore para resolver desatualização. Consolidar ou mover para um histórico rastreado quando necessário, distinguindo claramente o estado atual. Não apagar esses registros nesta avaliação.

## Aplicação realizada e manutenção

GITIGNORE_PROPOSTO.txt contém a proposta pronta para revisão. A aplicação criou .gitignore na raiz e validou os padrões com git check-ignore, conferindo que documentos e assets finais continuam incluídos. Nenhum arquivo de doc/wiki/ ou doc/prints/ estava rastreado na inspeção; não há necessidade identificada de removê-los do índice.

Aplicar na feature de documentação sob Git Flow, preservando alterações existentes. Não realizar git add de doc/ inteiro sem verificar os arquivos selecionados. A aplicação posterior criou develop e feature/documentacao-inicial e ativou a feature; não houve commit. As fontes locais foram preservadas.
