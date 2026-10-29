# Loot por slots

## Direção solicitada para a próxima revisão

**Aplicação na feature:** fallback de tesouros vazios2–8 preservado; [quatro variantes genéricas retiradas do loot futuro](RETIRADA_VARIANTES_RARAS_M01_20.md), mantendo banco e saves antigos. Chances/intervalos de ouro, livros e demais categorias preservados. Novos encantamentos/poções/catálogo continuam futuros, sem implementação autorizada por associação.

Evitar prêmios positivos de ouro fixos em batalhas/tesouros, mantendo ocorrência separada do intervalo de quantidade e a garantia de ao menos uma recompensa positiva nos tesouros. Raridade deve qualificar conteúdo/efeito concreto, não apenas sufixo com bônus genérico. Recibos e reservas já concedidos permanecem estáveis, inclusive em saves antigos; não renomear variantes como encantadas sem definir efeito e compatibilidade. Estado real e propostas **ainda não aplicadas** em [REVISAO_OURO_RARIDADE_M01_20.md](REVISAO_OURO_RARIDADE_M01_20.md). Ausência de loot não é prêmio fixo0 a substituir. Sem ampliação automática do catálogo.

## Requisitos confirmados

O loot seguirá um modelo de slots semelhante ao de MMORPGs. Cada inimigo terá regras de recompensa organizadas em seis slots lógicos, calculados separadamente.

| Slot | Categoria | Condições |
| --- | --- | --- |
| 1 | Moedas de ouro | Pode retornar ouro; quantidade e regras de ocorrência variam conforme o inimigo |
| 2 | Poções | Pode retornar ou não poções, conforme o inimigo |
| 3 | Equipamentos | Pode retornar ou não equipamentos, conforme o inimigo |
| 4 | Armas | Pode retornar ou não armas, conforme o inimigo |
| 5 | Itens de quest | Pode retornar itens conforme o inimigo e a quest |
| 6 | Item raro | Pode retornar item raro, conforme o inimigo |

A regra mais recente limita cada loot a no máximo um equipamento, contando armas, armaduras e demais itens equipáveis, inclusive raros. Os seis slots permanecem como categorias lógicas, mas a independência irrestrita anterior foi refinada: resultados candidatos dos slots 3, 4 e 6 não podem conceder equipamentos adicionais acima do limite. Ouro, poções e itens de quest mantêm suas próprias condições.

Há no máximo um equipamento por loot; ele tem pequena chance de ser raro. O percentual exato será balanceado nos testes. Os valores deverão ser especificados por inimigo e, quando aplicável, por quest.

O slot 5 integra o sistema descrito em QUESTS.md. As condições de elegibilidade devem consultar o progresso da quest correspondente.

## Itens importantes e respawn

Itens obrigatórios para progressão devem ser classificados como itens importantes e protegidos contra descarte acidental. Impedir descarte e venda por ações comuns de inventário; o simples rótulo de categoria não comprova essa proteção nos menus próprios. Entrega, consumo ou remoção por uma etapa de quest devem ser ações explícitas e validadas pela quest, não tratadas como descarte comum.

O slot 5 deve manter essa classificação quando gerar um item obrigatório. Nem todo item de quest precisa ser obrigatório; registrar a distinção nos dados. A proteção após a obtenção não resolve sozinha a obtenção inicial: quests que exigem um drop ainda precisam ter uma fonte alcançável antes da conclusão.

Inimigos comuns são reativados ao sair da dungeon concluída ou do cenário onde a quest foi concluída. Todos retornam exceto os incluídos especificamente pela quest. O respawn permite novas recompensas conforme suas regras, sem duplicar itens importantes únicos ou repetir automaticamente recompensas de conclusão. Não confundir uma nova ocorrência legítima de inimigo com a reabertura da interface de um loot já concedido.

Como o respawn depende da conclusão, ele não resolve o caso de uma quest que só pode ser concluída após obter um item aleatório de um inimigo já derrotado. Validar essa dependência ao especificar a quest e estabelecer uma forma de obtenção que não bloqueie a progressão, sem presumir automaticamente uma chance de drop.

Verificar os itens de missão ao concluir uma etapa e ao iniciar a próxima, conforme QUESTS.md. A recuperação de inconsistências deve respeitar entregas e consumos legítimos, sem duplicar drops ou recompensas.

Usar configurações iniciais de referência da wiki quando houver dados aplicáveis, documentando conversões para os seis slots. Valores ausentes devem ser provisórios e identificados. Refinar o balanceamento com testes do jogo, sem inventar que a wiki define este modelo de slots.

A recuperação de item obrigatório ausente deve reativar seu evento-fonte enquanto a obrigação estiver ativa, conforme QUESTS.md; isso independe do respawn comum posterior à conclusão. Não duplicar recompensas já concedidas.

A sobreposição foi resolvida pela regra de no máximo um equipamento: a raridade qualifica o equipamento concedido, em vez de criar automaticamente um segundo equipamento pelo slot raro. Documentar o sorteio e a conciliação das categorias na feature. O limite se aplica ao loot individual de origem; uma apresentação agregada deve preservar a origem de cada resultado.

## Configuração e cálculo

Registrar para cada inimigo as regras de cada slot: recompensas elegíveis, chance de ocorrência, quantidade ou faixa de quantidades e condições aplicáveis. No slot de quest, registrar também o vínculo com a quest e a condição necessária para o item ficar elegível.

O cálculo das categorias deve respeitar suas condições próprias e o limite global de equipamento. A ausência de uma quest elegível deve afetar o respectivo slot, sem cancelar o cálculo dos demais.

Montar listas de equipamentos e itens possíveis por faixa de dificuldade do inimigo. Armas podem manter categoria própria para configuração, mas contam no mesmo limite de um equipamento. A lista concreta e o peso de cada entrada serão derivados das fontes e ajustados nos testes. Livros de magia podem cair de inimigos ou baús; sua disponibilidade deve observar a dificuldade do inimigo ou da dungeon.

A pequena chance de raridade e o limite de equipamento estão confirmados. Não criar outros limites ou novas categorias por associação. Registrar se haverá item raro não equipável e como será apresentado, sem permitir que essa classificação burle o limite de equipamentos.

## Exibição e coleta

Ocultar slots vazios na interface de loot, exibindo apenas recompensas efetivamente geradas. Manter internamente a categoria e a origem de cada resultado, mesmo quando a apresentação não mostrar posições vazias.

Aplicar a linguagem visual de INTERFACE.md: ícones, descrições e quantidades cabíveis. Ouro deve apresentar a quantidade obtida; itens devem apresentar suas quantidades quando aplicável. Não exibir uma recompensa de quantidade zero como loot disponível.

A coleta é automática. Conceder os resultados uma única vez e informar o conteúdo recebido, ocultando slots vazios. O momento exato do cálculo, a apresentação por inimigo ou consolidada por batalha e o tratamento de eventual limite de inventário serão detalhados na feature. A interface deve respeitar as regras de acesso rápido sem presumir uma modalidade de coleta.

Ao implementar, garantir que reabrir a interface ou repetir uma interação não recalcule indevidamente o mesmo loot nem conceda a mesma recompensa mais de uma vez.

## Critérios de aceitação

- As categorias são configuráveis por inimigo, com condições próprias e conciliação que garante no máximo um equipamento por loot.
- Configurações controladas demonstram ouro, consumíveis e item de quest coexistindo quando elegíveis, sem conceder mais de um equipamento mesmo quando vários candidatos equipáveis são sorteados.
- Um slot vazio não interfere nas recompensas dos demais.
- O slot de quest respeita as condições do inimigo e da quest especificadas para o teste.
- A interface oculta slots vazios e mostra ícones, descrições e quantidades correspondentes aos resultados.
- O cálculo e a concessão não são repetidos indevidamente ao reabrir ou atualizar a interface.
- Os cenários com nenhum resultado e com vários resultados são tratados sem erros.

Implementação M01-13 e testes técnicos em LOOT_M01_13.md e evidencias/m01-13; balanceamento definitivo e testes físicos pendentes. A configuração inicial adapta fontes de maneira identificada; seguir PLUGINS.md.


## Resolução M01-13

Mantida a definição existente de loot individual de origem: limite de uma peça por inimigo, não por batalha. Resumo agregado não perde origem no recibo. Gate low-quality item, candidatos arma/armadura e raridade substitutiva explicitados em LOOT_M01_13.md. Coleta automática após vitória, sem pagamento paralelo nativo; EXP preservada uma vez. Reserva persistente para excedentes, sem perda silenciosa no limite. Chave de MQ01 mantém evento-fonte na cela, sem drop aleatório obrigatório; integração de fonte em tabela validada somente no laboratório. Raridade2% e4 variantes +1 são balanceamento provisório, não dados do original. Esta seção substitui indefinições históricas sobre momento/resolução/apresentação/capacidade.
