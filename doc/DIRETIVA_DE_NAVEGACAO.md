# NAV01 — facilidade de navegação obrigatória

Diretiva confirmada em 28/10/2026. Aplicar a todos os menus novos ou revisados do Arena. Não autoriza refatorar todos os menus em uma única tarefa nem mudar regras para acomodar um layout.

- **Caminhos curtos:** ações frequentes acessíveis em poucas operações; mostrar atalhos e alternativas no contexto certo.
- **Confirmação proporcional:** evitar confirmações repetidas para ações simples/reversíveis; manter confirmação clara quando houver consequência relevante ou irreversível.
- **Opção única:** selecionar automaticamente ou pular etapas quando houver uma única opção válida; não exigir confirmação vazia por conveniência técnica.
- **Foco e retorno:** foco/seleção visíveis por mais de uma pista; Esc e Voltar com destino consistente. Preservar seleção, filtro e posição de leitura quando fizer sentido; ajuste seguro dos limites de leitura se a lista mudar.
- **Teclado, mouse e toque:** caminhos funcionais para todas as ações; descrição ou função essencial nunca exclusiva de hover. Painéis ocultos não capturam comandos. Rolagem atua na área indicada, sem acionar um item ao terminar um arraste.
- **Telas menores:** reorganizar áreas/abas antes de reduzir a interface inteira; fontes, contraste e alvos de toque utilizáveis na resolução real. Registrar limites e distinguir emulação de aparelho físico.
- **Conteúdo variável:** tratar listas vazias, nomes/descrições longos, palavras sem espaços, muitos itens e overflow. Quebrar pelo espaço realmente disponível e oferecer rolagem visível; texto multilinha alinhado à coluna correta.
- **Estado confiável:** prévias/leitura/cancelamento preservam personagem/inventário/progresso; apresentação reflete dados atuais, inclusive após salvar/carregar. Status não é inferido de texto ou aparência.

Cada revisão de menu deve incluir evidências dos caminhos de entrada/retorno, estados vazio/preenchido, opção única, textos longos, foco, teclado/ponteiro/toque e tamanho reduzido pertinente ao projeto. Quando houver confirmação, testar cancelamento e bloqueio dos controles atrás dela. Registrar testes efetivamente executados e pendências; não chamar validação geométrica de aprovação estética.

Vínculos: INTERFACE.md, DESENVOLVIMENTO_E_VERSIONAMENTO.md, TESTES_M01.md e VALIDACAO_M01.md. Aplicação atual: diário M01-16 R02. Auditoria dos demais menus permanece no M01-19, ligada aos registros já existentes de REF01(favoritos/atalhos), uso de itens, paleta/confirmação e demais refinamentos; não criar pendências duplicadas nem implementar essas melhorias por associação.

## Feedback sem redundância — 28/10/2026

Informações já visíveis no menu não devem ser repetidas em mensagens sem necessidade. Quantidades pertencem aos slots; não acrescentar “restam X” como confirmação de uso quando o slot já atualiza. Descrições estáticas do efeito continuam disponíveis para decidir o uso, e impedimentos de uso devem receber explicação clara.

Alterações de Vida, Mana e Vigor devem priorizar feedback visual nas barras correspondentes. Se já estiverem visíveis, não duplicar a mesma recuperação em mensagem/popup/outro painel. Usar popup compacto e breve com ícone/barra somente se o contexto não comportar barras visíveis. Não duplicar o feedback de combate existente.

Estado real e quantidades atualizam imediatamente. Transições curtas de preenchimento são exclusivamente apresentação, sem bloquear entradas, atrasar consumo ou escrever valores no personagem. Usos consecutivos devem redirecionar a apresentação ao estado atual, respeitando o máximo; callbacks/animações antigas nunca podem restaurar alvos obsoletos. Ao reabrir/carregar, reconstruir a apresentação dos dados atuais. Priorizar composição dentro dos painéis existentes, mantendo rótulos/valores e evitando fontes menores, cortes e sobreposições.
