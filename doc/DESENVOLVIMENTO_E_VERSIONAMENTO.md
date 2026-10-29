# Desenvolvimento, documentação e Git

## Operação obrigatória — entregas pequenas

1. Conferir branch, diff e alterações existentes; definir **um objetivo principal** e critérios curtos e verificáveis. Separar correção funcional, experimento visual e produção em lote em entregas distintas; não juntar sistemas independentes por conveniência.
2. Ler somente as fontes e os contratos pertinentes. Antes de substituir algo, identificar a versão aprovada e a causa do defeito. Para assets, seguir o fluxo de [DIRECAO_DE_ARTE.md](DIRECAO_DE_ARTE.md#processo-de-geração-e-controle-de-qualidade).
3. Implementar a menor unidade coerente. Se o trabalho crescer, concluir essa unidade, registrar o restante e entregar um ponto revisável, com limites explícitos; não marcar o item inteiro como concluído nem ampliar o escopo silenciosamente. Se a primeira amostra revelar falha recorrente, parar a expansão e corrigir o padrão.
4. Selecionar verificações pelo que mudou e pelas dependências afetadas. Reutilizar evidências válidas, identificando versão e escopo; repetir verificações amplas somente por alteração ou risco concreto, com motivo registrado. Não executar baterias de jogo em tarefa exclusivamente documental.
5. Revisar o diff, selecionar somente arquivos da tarefa e fazer commit coeso. Publicação e integração seguem a autorização da tarefa; uma aprovação parcial não aprova outras funcionalidades, assets ou dispositivos.
6. Entregar resultado, evidência pertinente, limitações e próximo recorte sugerido. Não prometer duração ou consumo sem meios de medição; dados agregados não autorizam estimativas por atividade.

## Prioridade obrigatória — foco no backlog

1. Recomendar continuidade pelo **item ativo**, suas dependências e critérios de aceitação; conferir o estado real em BACKLOG_M01.md e as evidências pertinentes.
2. Priorizar bloqueios e defeitos que impeçam atender a esses critérios, identificando qual critério é afetado.
3. Ao concluir um recorte, retornar à sequência do backlog; não continuar refinando indefinidamente o mesmo sistema.
4. Uma melhoria futura não vira trabalho atual por ser o último assunto discutido.
5. Melhorias atribuídas explicitamente a um backlog entram na avaliação desse item, respeitando seu escopo; sem etapa definida, permanecem adiadas. Vínculo a um item não autoriza implementação automática de estudos/propostas.
6. Aprovações com ressalvas continuam válidas. Só tratar ressalva aceita como bloqueio mediante defeito concreto e justificativa do critério afetado.
7. Não ampliar funcionalidades, produzir variantes ou implementar estudos sem autorização correspondente; preservar os limites da tarefa.
8. Toda recomendação de continuidade deve informar **item do backlog, critério a atender e motivo da prioridade**. Distinguir recomendação, autorização e início efetivo.
9. Se faltar decisão ou avaliação necessária, identificar a **pergunta específica** e o que depende dela; silêncio não é aprovação. Consultar os registros antes de perguntar e não repetir pedidos já respondidos.

## Fontes principais e estados

| Assunto | Fonte principal |
| --- | --- |
| Escopo da entrega e Git | Este documento |
| Identidade, anatomia, animação de participantes e fluxo de assets | [DIRECAO_DE_ARTE.md](DIRECAO_DE_ARTE.md) |
| Grade, objetos, portas, colisão e oclusão | [DIRETIVA_DE_MAPAS.md](DIRETIVA_DE_MAPAS.md) |
| Navegação, legibilidade, entradas e feedback | [DIRETIVA_DE_NAVEGACAO.md](DIRETIVA_DE_NAVEGACAO.md) |
| Critérios e roteiros funcionais por item | [BACKLOG_M01.md](BACKLOG_M01.md) e [TESTES_M01.md](TESTES_M01.md) |
| Evidências, versão e ambiente efetivamente verificados | [VALIDACAO_M01.md](VALIDACAO_M01.md), com links para resultados |
| Melhorias adiadas | [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md) e pendências específicas ali referenciadas |

**Regras obrigatórias** orientam novas alterações; **decisões provisórias** mantêm valores/contratos atuais até revisão autorizada; **melhorias futuras** não entram por associação; **critérios de validação** definem a evidência necessária, sem representar execução ou aprovação. Manter esses estados identificados e atualizar a fonte principal, usando links nos demais documentos em vez de repetir regras. Relatórios datados preservam o histórico; não comandam uma tarefa nova quando divergirem da diretiva vigente. Não criar novos resumos extensos de versões antigas a cada entrega.

O relato integrado recebido em28/10/2026 e seus limites estão em [VALIDACAO_M01.md](VALIDACAO_M01.md#teste-integrado-informado-pelo-responsável--28102026). O ajuste de processo não inicia outro backlog. Diagnóstico e possíveis recortes: [REVISAO_PROCESSO_2026_10_28.md](REVISAO_PROCESSO_2026_10_28.md).

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

Não desenvolver features diretamente em main. Documentação independente também é uma feature, originada de develop; feature/documentacao-inicial foi o nome usado na organização inicial. Revisões documentais da entrega em análise podem permanecer em sua feature, sem integrar implementação ainda não aprovada. Correções comuns de desenvolvimento podem usar feature/correcao-nome; hotfix fica reservado a urgências de versões estáveis.

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
