# Quests e diário

## Diretrizes confirmadas

O jogo terá um sistema de quests com estrutura moderna, usando Skyrim como referência de organização e acompanhamento. O diário buscará preservar as descrições do jogo original, mantendo a fidelidade narrativa definida em DIRETRIZES_DE_ADAPTACAO.md.

A referência orienta a adaptação; não exige reproduzir integralmente a interface ou todos os sistemas de Skyrim. Recursos específicos ainda não aprovados devem permanecer identificados como propostas.

## Escopo inicial

Implementar as quests principais, com um único personagem controlável e as cidades e dungeons principais necessárias à campanha. Quests secundárias permanecem fora do escopo inicial. A primeira entrega cobre introdução e dungeon inicial; não equivale a implementar toda a campanha de uma vez.

Criar um inventário de quests principais e seus locais associados, com fontes e dependências, para organizar as entregas posteriores. O inventário inicial foi levantado na wiki e consta em CAMPANHA_PRINCIPAL.md; DEMO_INICIAL.md organiza a primeira entrega. Detalhar etapas e conteúdo de cada quest a partir das fontes.

Cada quest principal corresponde a um marco de entrega, conforme MARCOS_DO_PROJETO.md. A conclusão deve considerar toda a cadeia necessária, não somente o último objetivo da quest.

## Estrutura proposta

Organizar cada quest por identificador estável, título, descrição no diário, condições de início, etapas, objetivos, condições de conclusão e eventuais recompensas. Separar os textos de apresentação das condições que controlam o progresso.

Como proposta inicial, distinguir quests disponíveis ou não iniciadas, em andamento e concluídas. Uma condição de falha só deve existir quando exigida pela quest e aprovada no design. Prever objetivos claros dentro de cada etapa, sem inventar bifurcações ou finais alternativos ausentes da adaptação aprovada.

O formato concreto do diário, as categorias de quests e a possibilidade de rastrear uma ou mais quests ainda precisam ser definidos. Marcadores de mapa, bússola, notificações e seleção automática de uma quest acompanhada são recursos a avaliar, não requisitos confirmados.

A viabilidade de mapa de orientação e bússola de objetivos foi avaliada em MAPA_E_BUSSOLA.md. A inclusão permanece em análise; a recomendação inicial é mapa local consultável e indicação de uma quest acompanhada, sem revelar etapas futuras.

## Descrições e fidelidade ao original

Consultar primeiro doc/wiki/ para localizar as descrições, os diálogos e o contexto original. Registrar arquivo e seção utilizados como fonte para cada texto adaptado. Se a fonte local não contiver a descrição necessária, registrar a lacuna antes de criar um texto substituto.

Preservar as descrições originais no diário sempre que possível. Traduções, divisões em etapas ou ajustes de extensão devem manter o sentido, as informações e a voz narrativa, com o motivo da adaptação documentado. Identificar textos novos ou provisórios como adaptações, sem apresentá-los como transcrições do original.

As descrições e os objetivos mostrados devem corresponder ao conhecimento e ao progresso do jogador. Não revelar etapas futuras ou soluções por uma escolha incidental de organização do diário.

## Integrações

Eventos e interações devem consultar o estado da quest e avançar etapas de forma consistente. Registrar os identificadores de quests e objetivos usados em mapas, personagens e condições de acesso.

O slot 5 do loot, definido em LOOT.md, deve consultar as condições da quest correspondente. Para cada item de quest, definir elegibilidade, quantidade necessária e comportamento após obtenção e conclusão. Não presumir que todos esses itens devam continuar caindo ou ser bloqueados em todas as etapas; documentar a regra de cada quest.

O progresso deve persistir ao salvar e carregar a partida. Atualizações repetidas do mesmo evento não devem duplicar conclusões ou recompensas. Itens importantes já têm proteção confirmada contra descarte e venda. Abandono ou repetição de quests não integram os requisitos atuais; não criá-los como condição para concluir o M01.

O diário deve seguir os princípios de acesso rápido de INTERFACE.md. A preferência por ícones e slots nos menus deve apoiar a navegação sem prejudicar a leitura das descrições e dos objetivos.

Se forem criados plugins para quests, seguir PLUGINS.md, separando a lógica reutilizável dos textos, identificadores e regras específicas de Arena.

## Itens importantes e conclusão de áreas

Itens obrigatórios são itens importantes, protegidos contra descarte e venda acidentais. Removê-los somente por regras explícitas de entrega ou consumo da quest. Inimigos comuns terão respawn ao sair da dungeon concluída ou do cenário onde a quest foi concluída, exceto os incluídos especificamente pela quest; a relação entre conclusão e reativação deve ser persistida sem reiniciar objetivos ou recompensas de conclusão.

O respawn posterior à conclusão não deve ser usado como única garantia para um drop necessário à própria conclusão. Validar a obtenção dos itens obrigatórios antes de encerrar o conteúdo da quest, conforme LOOT.md.

## Verificação redundante dos itens de missão

Verificar os itens de missão em dois pontos: na conclusão de uma etapa e no início da etapa seguinte. As duas verificações devem usar as regras da quest e considerar quantidade, posse, entrega e consumo previstos para cada item.

Na conclusão, validar os itens exigidos antes de consolidar a transição. Registrar entregas e consumos legítimos para que não sejam confundidos com perda. Na entrada da etapa seguinte, verificar novamente os itens que devem permanecer com o jogador e os registros de entrega ou consumo da etapa anterior.

Não exigir posse de um item que acabou de ser entregue ou consumido legitimamente. Não recriar esse item apenas porque ele não aparece no inventário. Itens que ainda não deveriam ter sido obtidos também não devem ser concedidos antecipadamente pela verificação.

Quando houver inconsistência, impedir que a progressão seja consolidada em estado inválido e aplicar a recuperação documentada para a quest. Uma reposição só deve ocorrer se a regra confirmar que o item já deveria estar disponível, continua necessário e não foi entregue ou consumido. Caso não haja recuperação automática segura, manter um estado recuperável e registrar a causa para correção; não marcar a etapa como concluída por conveniência.

As verificações e a recuperação devem ser idempotentes: chamadas repetidas, reentrada em mapa ou carregamento de partida não podem duplicar itens, entregas, consumo ou recompensas. Uma recuperação não deve reabrir objetivos já concluídos nem reiniciar a quest inteira.

Essa redundância complementa a proteção dos itens importantes. Não substitui a definição de uma fonte válida para a primeira obtenção de um item obrigatório; validar também a ausência do item antes de qualquer transição que dependa dele.

### Cenários de validação

- Item exigido presente na quantidade correta: a etapa conclui e a próxima inicia normalmente.
- Item ausente ou insuficiente: a transição não consolida um estado inválido e segue a recuperação prevista.
- Item entregue ou consumido na conclusão: a próxima etapa reconhece o registro e não o recria.
- Item que precisa continuar no inventário: a segunda verificação detecta uma perda entre etapas.
- Item ainda não previsto para a etapa: a redundância não o concede antecipadamente.
- Repetição da verificação e salvar/carregar durante a transição: não duplicam itens ou recompensas.

## Reativação de eventos que concedem itens de missão

Enquanto um item de missão necessário à etapa atual não constar no inventário na quantidade exigida, o evento que o concede deve voltar a ficar disponível. Identificar explicitamente o evento-fonte e as condições de acesso. Essa recuperação é independente do respawn dos inimigos comuns após conclusão de área; pode ocorrer antes da conclusão para evitar bloqueio.

Verificar se a obrigação continua ativa antes de reativar a fonte. Item entregue, consumido legitimamente ou dispensado por uma etapa concluída não está simplesmente “faltando”. Não reativar fontes de etapas futuras nem recriar itens de etapas encerradas.

Ao conceder, revalidar o inventário e entregar somente a quantidade faltante. A reativação do evento não repete recompensas de quest, ouro ou loot já resolvido. Se a fonte for um inimigo específico, documentar a reativação excepcional para recuperar o item; não transformá-la em respawn comum depois da conclusão.

Nas conclusões e entradas de etapas, eliminar concessões duplicadas e garantir somente a quantidade de itens únicos prevista pela quest. Não remover itens comuns ou de outras quests por nome parecido; usar IDs e vínculos explícitos. Entregas, consumo e saneamento de duplicações não podem executar duas vezes ao salvar/carregar ou repetir a verificação.

Validar item ausente, quantidade parcial, quantidade duplicada, fonte já acionada, entrega legítima e reentrada na área. Uma reposição nunca deve exigir concluir primeiro a quest que depende do item ausente.

## Critérios de aceitação propostos para a primeira quest

- É possível iniciar uma quest, consultar sua descrição e identificar o objetivo atual no diário.
- Os textos possuem fonte registrada ou estão explicitamente identificados como adaptação ou conteúdo provisório.
- Uma ação válida avança a etapa correspondente; ações fora de ordem respeitam as condições especificadas.
- A conclusão atualiza o diário e concede recompensas uma única vez, quando previstas.
- Salvar e carregar preserva o progresso e os objetivos.
- Quando houver item de quest no loot, o slot 5 respeita as condições definidas antes e depois da obtenção ou conclusão.
- As informações exibidas não revelam indevidamente etapas futuras.

## Estado

O sistema de quests e a direção do diário estão confirmados. A estrutura detalhada e os critérios acima são propostas de implementação; o primeiro marco abrange a introdução e a dungeon inicial, a primeira quest é MQ01 — Imperial Dungeons, com término da demo no Shift Gate. Detalhar eventos, objetivos e traduções na implementação a partir das fontes já identificadas. Nenhuma funcionalidade de quests foi implementada ou testada nesta etapa.

## Implementação vigente M01-16

MQ01/diário/requisitos e recuperação implementados em Arena_Quests + núcleo puro MV_QuestRules; detalhes, migração e fontes em QUESTS_M01_16.md. Estado0/10/20/30/40, itens conferidos na saída e entrada, fonte só repõe o que falta antes do uso legítimo. Fechamento da apresentação continua M01-18. Declarações anteriores de nenhuma funcionalidade implementada são históricas.
