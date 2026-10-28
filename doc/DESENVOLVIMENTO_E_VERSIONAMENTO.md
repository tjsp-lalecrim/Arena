# Desenvolvimento, documentação e Git

## Diretrizes confirmadas

A documentação será atualizada durante o desenvolvimento. O Codex orientará a criação de branches e commits seguindo Git Flow para organizar o trabalho e separar funcionalidades.

## Regras não especificadas

Seguir o padrão do RPG Maker MV 1.6.1 nos pontos não definidos, respeitando a precedência das decisões confirmadas em BASE_DO_PROJETO.md. Verificar o comportamento nativo nos arquivos do motor e as configurações existentes antes de alterá-lo. Registrar a adoção do padrão na feature e evitar pedidos de definição para regras já cobertas por essa diretriz.

Recursos exclusivos do projeto e decisões de conteúdo continuam exigindo implementação ou configuração. Quando não houver equivalente nativo compatível, documentar a solução mínima e esclarecer apenas mudanças de escopo ou direção.

## Documentação evolutiva

Manter em `doc/` a visão atual do projeto, as decisões, as adaptações do original, os resultados de validação e as pendências. Tratar a documentação como uma feature, com escopo, branch, revisão e critérios de conclusão. Atualizar a documentação afetada pelo desenvolvimento e consolidar o conjunto antes de qualquer envio ao remoto. A divisão de commits deve manter clara a relação entre implementação e documentação.

Distinguir decisões confirmadas, propostas e pontos em aberto. Quando uma decisão mudar, registrar a substituição e o motivo, removendo orientações contraditórias dos documentos ativos. Diagnósticos datados descrevem o estado na data de inspeção; não devem ser apresentados como estado atual sem nova verificação.

Preservar os materiais de consulta em `doc/wiki/`. Registrar conclusões e adaptações fora dessa pasta. Não tratar propostas ou relatórios locais encontrados nas referências como decisões automaticamente aprovadas para este projeto.

## Git Flow

O workflow adotado é Git Flow. Usar as seguintes funções de branches:

| Branch | Origem | Destino e finalidade |
| --- | --- | --- |
| main | Linha estável existente | Versões estáveis; recebe releases e hotfixes |
| develop | main na organização inicial | Integração do desenvolvimento; recebe features e as correções de releases e hotfixes |
| feature/nome | develop | Uma funcionalidade coesa; integrar em develop após revisão e validação |
| release/versao | develop | Preparar e estabilizar uma versão; integrar em main e develop, marcando a versão em main com uma tag |
| hotfix/nome | main | Corrigir problema urgente de versão estável; integrar em main e develop, ou propagar à release ativa conforme necessário, e marcar a versão corrigida |

Não desenvolver features diretamente em main. Documentação independente também é uma feature: usar feature/documentacao-inicial, originada de develop, e consolidar antes do envio ao remoto. Correções comuns de desenvolvimento podem usar feature/correcao-nome; hotfix fica reservado a urgências de versões estáveis.

Antes de cada tarefa, verificar branch atual, alterações pendentes e convenções do repositório. Preservar alterações existentes antes de trocar de branch. Separar funcionalidades independentes, mas não criar uma branch por arquivo.

A organização inicial deve verificar a base de main, criar develop se ainda não existir e então abrir a feature de documentação. Registro histórico: na primeira inspeção apenas main existia. Em 25/10/2026, a execução do M01 confirmou main, develop e feature/documentacao-inicial, esta última ativa antes da consolidação. Não é necessário instalar uma extensão git-flow para seguir o fluxo.

Exemplos: feature/prototipo-combate, feature/dados-equipamentos e feature/documentacao-inicial. A escolha de versão, a preparação de release e o momento de publicação devem ser definidos na tarefa correspondente.

## Organização de commits

O Codex deve indicar pontos adequados para commit quando houver uma mudança coesa, compreensível e validada. Revisar o diff e selecionar apenas arquivos pertencentes à tarefa, evitando incluir alterações do usuário sem relação com ela.

As mensagens devem explicar a mudança concreta. Sugestão de convenção, caso o repositório ainda não tenha uma:

- `feat: adiciona protótipo de combate`
- `fix: corrige referência ao mapa inicial`
- `docs: registra diretrizes de adaptação`

Informar a validação realizada e suas limitações. Se uma etapa intermediária ainda estiver incompleta, deixar isso explícito ao recomendar um commit. Não apresentar como testado um fluxo que não foi executado.

Orientar sobre branches e commits não equivale a publicar mudanças. A execução de commits, merges e envios ao remoto deve seguir o pedido da tarefa e a autorização disponível na conversa. Não reescrever histórico nem descartar alterações como parte de uma organização rotineira.

## Documentação de plugins

Todos os plugins utilizados devem ser desenvolvidos pelo Codex; fontes externas servem apenas como referência técnica. Adequar a dependência Community_Basic existente sem remover comportamentos necessários antes de substituição e validação. Para cada plugin criado, seguir PLUGINS.md: documentar funcionalidades, configuração, dependências e ordem de carregamento, integrações e validações. Buscar reutilização em outros projetos e registrar o que depende especificamente de Arena. Consolidar essa documentação antes do envio ao remoto, junto com os demais documentos afetados pela feature.

## Entrega de cada tarefa

Informar o resultado, os arquivos relevantes, o que foi validado e as pendências. Indicar se a documentação foi atualizada e se a etapa está pronta para commit. Quando útil, sugerir o nome da branch e a mensagem de commit correspondente.


## Consolidação da feature de documentação

Antes de subir a documentação, reunir as decisões confirmadas, eliminar contradições e duplicações desnecessárias, verificar caminhos e referências internas e separar propostas de requisitos aprovados. Revisar o conjunto de arquivos selecionados, preservando doc/wiki/ como material de consulta.

A documentação pode ser consolidada com decisões ainda abertas, desde que estejam explícitas. Não apresentar especificações como funcionalidades já implementadas. Informar quais verificações foram feitas e quais pendências permanecem.

Para a documentação inicial, sugerir a branch feature/documentacao-inicial, criada a partir de develop, e um commit como feat: consolida documentacao inicial do projeto, respeitando as convenções existentes. O envio ao remoto só deve ocorrer após a consolidação e conforme a autorização da tarefa.


## Integração M01-12

Autorização do responsável para próximas tarefas: quando houver necessidade concreta, consulta pontual somente de leitura ao projeto Battlespire. Não alterar arquivos nem promovê-lo a fonte oficial/normativa/dependência. Reaproveitamento eventual deve ser pontual, revisado, adaptado e documentado. M01-12 não precisou dessa consulta; reutilizou APIs/tema do Arena e fluxo MV. A autorização não amplia os requisitos do backlog.

## Critério de interface obrigatório

Toda tarefa de menu novo ou revisado deve aplicar NAV01 em DIRETIVA_DE_NAVEGACAO.md e anexar evidências pertinentes de entrada/retorno, foco, opção única, vazio, textos longos/overflow, teclado/mouse/toque e tamanho reduzido. Confirmar apenas operações relevantes/irreversíveis. Não ampliar uma revisão local para refatoração de menus não solicitados; encaminhar lacunas ao M01-19/pendências existentes sem duplicação.
