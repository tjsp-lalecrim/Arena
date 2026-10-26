# Interface e menus

Estado operacional M01-11 R02: refinamento em feature/m01-interface-batalha, base30e441d. Combate/animações atuais aprovados pelo responsável nesta solicitação; UI permanece em revisão visual. Indicadores compactos sem caixas, menus harmonizados e controles ocultos/inativos durante mensagens/resultado. Ler REVISAO_INTERFACE_M01_11_R02.md e evidencias/m01-11-r02. Desenvolver somente esta revisão, sem merge em develop/main ou M01-12. Galaxy A56/NW.js visual atuais pendentes.

Histórico da direção M01-10 R02 para **M01-11, não implementada**: capturas do responsável orientam campo mais amplo/cenário visível, barras próximas aos participantes, comandos por ícones, habilidades/itens em slots com custos/quantidades/descrições e barra de atalhos. Aplicar dark fantasy/identidade Arena; não copiar personagens, assets, valores ou regras do exemplo. Não incluir Recuar/fuga ou talentos raciais ativos por aparecerem nos prints, nem fixar automaticamente oito slots. Referências locais ignoradas e consulta pontual não normativa documentadas em CONSULTA_PONTUAL_INTERFACE_M01_10_R02.md. Nenhuma nova UI de slots foi implementada nesta rodada.

## Direção confirmada

O menu de jogo e o menu de batalha serão refatorados para priorizar a organização em slots, com representação por ícones, descrições e quantidades onde forem cabíveis. Jogos de MMORPG são a referência para essa organização visual e interação.

Essa referência não acrescenta multijogador ao escopo. Exemplos de jogos estão disponíveis em doc/prints; selecionar e registrar os aspectos usados. Composição das telas, quantidade de slots e controles serão detalhados na implementação.

## Plataformas e controles

O jogo tem como destinos navegador e mobile. A prioridade inicial de interação é teclado e mouse. A orientação é paisagem, com apresentação ocupando a tela inteira e navegador preferencial Chrome. Controles de toque serão avaliados nos testes; mobile não deve ser considerado validado apenas por funcionar em um navegador de desktop.

Projetar a interface de forma que ações essenciais não dependam exclusivamente de hover. Refinar o comportamento em telas menores durante a implementação, sem presumir empacotamento como aplicativo nativo.

Primeiro dispositivo de teste mobile: Samsung Galaxy A56. Registrar navegador, versão do sistema, orientação e resultados de cada teste. A tela inteira deve adaptar a apresentação ao espaço disponível, mantendo proporções e legibilidade. A resolução lógica interna e a escala serão escolhas técnicas validadas em teste; não igualar automaticamente a resolução interna à resolução física do aparelho. Considerar áreas seguras e limitações do navegador ao solicitar fullscreen.

Idioma inicial de menus, diálogos e diário: somente Português Brasileiro.

## Aplicação nos menus

Apresentar itens, habilidades e equipamentos em slots quando essa organização ajudar o jogador a localizar, comparar e usar o conteúdo. Priorizar ícones reconhecíveis, com nome e descrição acessíveis na seleção ou no foco. Não depender exclusivamente de passar o mouse para revelar informações essenciais.

Exibir quantidades para conteúdos contabilizáveis, como pilhas de itens, sem usar contadores sem significado em comandos ou habilidades. Usar o padrão compatível do MV para contagem e limites iniciais, documentando adaptações apenas quando necessárias aos requisitos; validar a coleta automática nos limites do inventário.

Na batalha, integrar essa linguagem visual à barra de atalhos descrita em COMBATE.md. A representação em slots deve respeitar custos, disponibilidade, seleção de alvo e regras de uso. O detalhamento visual de indisponibilidade será definido na implementação; o estado precisa ser compreensível para o jogador.

Como orientação de implementação, distinguir slot vazio, conteúdo selecionado e conteúdo indisponível. Manter legíveis ícones, descrições, quantidades e barras de recursos, em coerência com a direção dark fantasy.

## Menu de equipamentos: arrastar e soltar

O menu de equipamentos deve permitir arrastar equipamentos do inventário para os slots de equipamento do personagem, seguindo a referência de interação dos MMORPGs. Esta funcionalidade está confirmada para equipamentos; não implica arrastar e soltar em todos os demais menus.

Com teclado e mouse como prioridade inicial, iniciar o arrasto com o mouse e concluir a tentativa ao soltar sobre um slot. Indicar visualmente o equipamento arrastado e os destinos compatíveis. A compatibilidade deve considerar o tipo de slot e as regras de uso simultâneo aprovadas, sem reintroduzir restrições por raça ou classe.

Ao soltar em um destino válido, equipar o item e atualizar inventário, ícones e atributos exibidos. No caso de armaduras, atualizar também o sprite do jogador conforme DIRECAO_DE_ARTE.md; a mesma atualização deve ocorrer por seleção e confirmação. Se o slot já estiver ocupado, aplicar a troca conforme as regras de equipamento, devolvendo o item anterior ao inventário. Uma tentativa inválida, um cancelamento ou uma soltura fora dos slots não deve alterar o equipamento, perder itens ou duplicá-los.

Revalidar a disponibilidade do item e a compatibilidade do destino ao concluir a operação. A ação deve ocorrer uma única vez, sem equipar durante a simples passagem do cursor sobre um slot.

Manter uma alternativa de seleção e confirmação para navegação por teclado, coerente com a regra de acesso rápido. Para mobile, detalhar e validar o gesto de toque e arrasto e a alternativa por seleção antes de declarar esse suporte concluído; evitar depender de hover para informações essenciais.

Arrastar para remover equipamentos, trocar diretamente entre slots e configurar atalhos por arrasto permanecem possibilidades a avaliar, não requisitos desta decisão.

## Diálogos e ilustrações

Priorizar diálogos em texto e ilustrações bem detalhadas, sem geração de vozes. Organizar a apresentação para que o texto continue legível e acessível durante a navegação, sem sobreposição indevida pelas ilustrações. Validar o enquadramento e a leitura nas telas de destino, conforme DIRETRIZES_DE_ADAPTACAO.md.

## Diário de quests

O diário seguirá a direção de QUESTS.md: organização moderna inspirada em Skyrim e preservação das descrições originais sempre que possível. Priorizar leitura clara e acesso rápido às informações da quest; definir a composição visual sem forçar textos longos a uma representação somente por ícones.

## Mapa e bússola em avaliação

Consultar MAPA_E_BUSSOLA.md para a avaliação de mapa local, minimapa e radar de objetivos. A inclusão ainda não está confirmada. Se adotados, respeitar a legibilidade em mobile, os controles acessíveis e as regras de conhecimento do jogador, sem sobrecarregar a interface.

## Proteção de itens importantes

Itens obrigatórios devem aparecer como itens importantes e não oferecer descarte ou venda comuns. Aplicar a proteção também no processamento da ação, não apenas na apresentação dos comandos. Entrega ou consumo de quest deve seguir a regra específica em QUESTS.md.

Ao trocar de arma, atualizar habilidades físicas e atalhos conforme HABILIDADES_E_PROGRESSAO.md. Uma técnica indisponível não pode continuar utilizável por um atalho desatualizado.

## Interface de loot

O loot usa seis categorias lógicas conforme LOOT.md, com coleta automática e concessão de no máximo um equipamento por loot, que pode ser raro. A conciliação das categorias equipáveis respeita essa regra mais recente. Na apresentação das recompensas, ocultar os slots vazios e mostrar apenas os resultados gerados, usando ícones, descrições e quantidades cabíveis. Essa regra de ocultação é específica do loot; não determina a ocultação de espaços vazios configuráveis da barra de atalhos ou de outras telas.

## Acesso rápido e etapas de seleção

Os menus de jogo e de batalha devem favorecer o acesso rápido. Pular etapas de seleção quando houver somente uma opção válida no contexto, encaminhando o jogador diretamente à próxima decisão necessária.

Exemplos: abrir diretamente a tela do único personagem elegível, selecionar automaticamente o único alvo válido de uma ação já escolhida e evitar uma tela intermediária cujo único comando disponível apenas continue o fluxo. Contar opções válidas para a ação, não apenas o total de personagens, alvos ou entradas existentes.

Quando houver várias opções válidas, manter a escolha do jogador. Quando não houver nenhuma, informar a indisponibilidade e impedir a execução. Selecionar automaticamente uma opção única não deve disparar uma ação antes de o jogador solicitá-la, nem consumir itens ou recursos durante a simples navegação.

Revalidar alvo, disponibilidade e custos no momento de executar a ação. Ao cancelar, retornar à última etapa com uma escolha real, sem prender o jogador em uma etapa pulada. A configuração exata de confirmações adicionais permanece a definir; não adicionar confirmações redundantes ao fluxo por padrão.

## Critérios de aceitação

- Menu de jogo e menu de batalha adotam slots para o conteúdo definido na especificação das telas.
- Os ícones permitem identificar o conteúdo, com nome e descrição acessíveis durante a navegação.
- Quantidades cabíveis correspondem aos dados atuais e se atualizam após alterações.
- É possível selecionar e usar conteúdo pelos controles aprovados, sem executar ações indevidas em slots vazios ou indisponíveis.
- A barra de atalhos de combate segue os mesmos padrões de representação.
- Com uma única opção válida, a etapa de seleção é pulada; com várias, a escolha é preservada; sem opções válidas, a ação não é executada.
- Cancelar retorna à última escolha real e a navegação não consome recursos nem executa ações involuntárias.
- É possível arrastar um equipamento do inventário para um slot compatível, inclusive substituindo o item anteriormente equipado, com atualização correta dos dados exibidos.
- Arrastos inválidos ou cancelados preservam inventário e equipamentos; trocas não perdem nem duplicam itens.
- O fluxo de equipamento também é acessível por seleção e confirmação, sem depender exclusivamente do arrasto.
- A interface permanece legível na resolução de destino e com os controles definidos para o projeto.

## Decisões pendentes

Selecionar os aspectos das referências em doc/prints e definir estrutura de cada tela, tamanho e quantidade de slots, paginação ou rolagem, posição das descrições, controles e eventual personalização. Arrastar equipamentos para slots de equipamento está confirmado. Arrastar e soltar em outros contextos, recargas, filtros e ordenação permanecem possibilidades a avaliar.

Este documento especifica a direção da interface; os menus ainda não foram implementados ou testados.


## Implementação M01-11

Direção de batalha implementada tecnicamente em feature/m01-interface-batalha; o texto anterior é especificação/histórico para os demais menus. Quatro comandos existentes, filtros/cartões/quantidades/descrição, seis atalhos configuráveis e alvo único automático após ação solicitada. Teclado/mouse/toque com Voltar visível; sem Recuar/talentos ativos/aparo novo. Integração nativa, limites da emulação e roteiro em INTERFACE_BATALHA_M01_11.md. Inventário de exploração/equipamento por arrasto permanecem M01-12, sem antecipação nesta feature.
