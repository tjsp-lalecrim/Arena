# QUALIDADE-01 — refinamento técnico focal

**Marco técnico planejado, não iniciado; data a planejar.** Não renumera M01–M10, não substitui MOBILE-01 e **não é pré-requisito automático para começar M02**. Recomendar reavaliar sua execução depois da entrega funcional do M02. Finalidade: corrigir inconsistências selecionadas com impacto perceptível no percurso, sem transformar cada marco em polimento ilimitado.

## Entrada e seleção

- Uma referência desktop funcional identificada, preferencialmente a entrega M02, com percurso/evidências e pendências do marco separados. Se surgir defeito crítico ou decisão estrutural necessária à campanha, tratar no backlog ativo, **sem escondê-lo nesta fila**.
- Responsável escolhe uma janela limitada: proposta de **até dois recortes** nesta primeira execução, cada um com defeito/alvo, referência aprovada e critério curto. Não há promessa de tempo/consumo ou de zerar a fila.
- Inventariar a cobertura existente antes de mudar: aprovações M01 continuam válidas. Conferir causa em integração/configuração primeiro; arte nova só em tarefa autorizada, com uma amostra integrada avaliada antes de lote, conforme DIRECAO_DE_ARTE.md.
- Foco Chrome desktop, preservando toque e saves. Regressão somente no que mudou; testes físicos, fullscreen/paisagem e APK ficam em MOBILE-01, sem exigir Pages por recorte.

## Fila inicial priorizada — referência, não duplicação de escopo

Critérios detalhados permanecem em [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md); não criar novos REF para os mesmos problemas. A ordem deve ser reavaliada pelo impacto observado no M02.

| Prioridade sugerida | Vínculo existente | Limite do possível recorte |
| --- | --- | --- |
|1 | REF09 | Continuidade de arma/pose nas combinações efetivamente utilizadas e não cobertas pelos pilotos; começar por um caso defeituoso identificado. Preservar os comandos aprovados e registrar separadamente identidade/nome do pesado da adaga; não expandir biblioteca automaticamente |
|2 | REF03 / REF10 | Apresentação contextual de batalha ou resumo de loot: escolher **um** problema concreto, sem misturar fundo, regras de loot e catálogo. Se REF03 já for entregue na janela M02, reutilizar sua evidência e retirar o recorte atendido da seleção |
|3 | REF15, parcela desktop | Inventário das funções do menu e proposta de simplificação, ou um recorte visual da distribuição; preservar opções exclusivas/dados/atalhos. Não é autorização de remover menus nem redesenhar todos eles |
|4 | REF07/REF08/REF16/REF17 e ressalvas de portas/objetos | Uma inconsistência visual identificada em escala real; preservar ilustrações e encaixe/animação/colisão. Tela de título e introdução são assuntos distintos; não regenerar artes adequadas |
|5 | REF01 / REF06 e REF14 desktop | Conveniência/navegação/feedback selecionados conforme uso real. Se notificação já entregue no M02, não repetir. Aproveitamento da tela exige distinguir canvas, resolução interna e fullscreen; não incorporar a parcela mobile |

**REF17/Stonekeep:** contraste moderado do piso para identificação do lobo; critérios e registro únicos em REFINAMENTOS_POS_INTEGRACAO_M01.md. Melhoria futura, não iniciada e não bloqueante para a campanha.

Manutenção focal entra somente quando sustentada por falha, duplicação ou custo recorrente concreto que afete o recorte; não inventariar/refatorar todo o motor. Novos problemas terão fonte única no registro de pendências, sem relatório paralelo por conveniência.

## Saída objetiva

1. Cada recorte escolhido atende seus critérios previamente fixados, com comparação antes/depois na escala/contexto real e aprovação estética quando houver padrão visual novo. Verificações focais técnicas identificam ambiente/versão e não substituem avaliação visual.
2. Nenhuma regressão funcional conhecida causada pelas alterações permanece aberta: dados/saves, consumo, quests e controles pertinentes preservados. Se aparecer bloqueio, corrigir ou retirar a alteração antes de distribuir; não cobri-lo com ressalva genérica.
3. Geradores/configurações de origem refletem as correções quando aplicável; cobertura, assets/referências e documentação atualizados; pacote/referência do recorte identificados. Publicação apenas com autorização correspondente.
4. Janela encerrada após os recortes acordados: itens não selecionados continuam classificados, sem converter toda ressalva em dívida obrigatória. Voltar ao backlog da campanha; avaliar nova janela separadamente.

## Fora de escopo

Reescrita geral, troca de motor, catálogo completo, produção de todas as variantes, revisão geral de fórmulas/raças/progressão, lojas/crafting/novos sistemas, telemetria, limpeza indiscriminada e promessa de eliminar todas as pendências. Avaliação de balanceamento permanece por marco (M02-BAL etc.); mobile/APK no MOBILE-01. Estudos de ataques surpresa/respawn parcial/custos aquáticos não viram funcionalidades por este plano. Nenhuma mudança na tag/entrega m01 ou no Pages.

**Aranha/Stonekeep — revisão futura não bloqueante:** combate e patrulha f5ebdba aprovados com ressalva; responsável prefere visualmente a primeira geração de batalha. [Registro e critérios únicos](ARANHA_M02.md), [mestres/referências A/B](arte/spider-v01/comparacao-futura.json). Preservar versão ativa e comparar antes de qualquer amostra autorizada; não é bloqueio de encontros/portas.
