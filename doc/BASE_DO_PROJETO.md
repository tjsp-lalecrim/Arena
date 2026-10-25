# Releitura de The Elder Scrolls: Arena — base do projeto

## Finalidade

Este documento é a fonte inicial de contexto para desenvolver uma releitura de The Elder Scrolls: Arena no RPG Maker MV. Deve orientar o Codex e evoluir junto com o jogo. Não é uma especificação completa nem autoriza implementar todas as ideias de uma vez.

## Decisões confirmadas

- Motor: RPG Maker MV 1.6.1.
- Direção: releitura de Arena com escopo reduzido.
- O projeto do jogo já foi criado.
- O projeto já utiliza Git para versionamento.
- Os assets padrão do motor foram excluídos.
- O desenvolvimento será auxiliado pelo Codex.
- Geração procedural, mapa e bússola são recursos opcionais cuja inclusão será decidida nos próximos marcos; não são requisitos nem bloqueios do M01.
- Loot concede no máximo um equipamento, contando armas e armaduras, com pequena chance de raridade. Tabelas dependem da dificuldade; essa regra refina a independência anterior dos slots equipáveis.
- Livros de magia são consumíveis de uso único, sem requisitos mínimos, obtidos por inimigos ou baús conforme dificuldade.
- Avaliar magias ambientais como candidatas a efeitos de múltiplos alvos.
- Mobile em paisagem e tela inteira, preferencialmente Chrome; avaliar controles de toque nos testes. Solicitar exemplos visuais adicionais conforme necessidade.
- O estilo dark fantasy tem prioridade sobre as referências visuais de outros jogos. Consultar POLITICA_DE_VERSIONAMENTO_DE_ARQUIVOS.md para a avaliação de quais arquivos versionar.
- A demo termina ao alcançar o Shift Gate.
- Criar personagem com nome, raça e gênero, usando assets predefinidos por combinação; consultar PERSONAGEM.md.
- A progressão de vida, mana e Stamina será semelhante à de Skyrim, com regras concretas balanceadas durante o desenvolvimento.
- Cada tipo de arma terá ao menos um movimento leve e um pesado. Magias serão avaliadas durante o desenvolvimento com prioridade ao balanceamento.
- Loot será coletado automaticamente. Eventos que concedem itens de missão devem reaparecer enquanto o item necessário não estiver no inventário, respeitando entrega/consumo legítimos e eliminando duplicações nas transições.
- Cada quest principal é um marco do projeto, M01 a M10, conforme MARCOS_DO_PROJETO.md. M01 inclui a introdução e a dungeon inicial e entrega a demo.
- Idioma inicial: somente Português Brasileiro.
- Campanha principal inventariada a partir da wiki em CAMPANHA_PRINCIPAL.md; entregas da demo em DEMO_INICIAL.md.
- Stamina não tem regeneração passiva; recupera por poções ou camas. Inicialmente dormir em cama recupera toda a vida, mana e vigor.
- Técnicas físicas são vinculadas ao tipo de arma e consomem Vigor; magias seguem catálogo da wiki, com aprendizado na Guild condicionado ao nível ou por livros obtidos. Consulte ADAPTACAO_DE_MAGIAS.md.
- Reativar inimigos ao sair da dungeon concluída ou do cenário cuja quest foi concluída; retornam todos exceto os incluídos especificamente pela quest.
- Referências visuais de outros jogos serão adicionadas a doc/prints/. Primeiro dispositivo de teste mobile: Samsung Galaxy A56.
- Verificar itens de missão na conclusão de uma etapa e novamente no início da seguinte, com recuperação consistente e sem duplicações. Consulte QUESTS.md.
- Itens obrigatórios serão classificados como itens importantes e protegidos contra descarte acidental.
- Inimigos terão respawn após a conclusão da dungeon ou da quest correspondente.
- Vigor representa Stamina e será gasto somente em combate através de técnicas.
- Habilidades físicas serão liberadas conforme a arma; magias serão aprendidas com magos da Mages Guild e também por livros. Consulte HABILIDADES_E_PROGRESSAO.md.
- Usar também a instalação original em D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena como fonte de consulta, preservando seus arquivos. Consulte DIRETRIZES_DE_ADAPTACAO.md.
- Os plugins utilizados no projeto devem ser desenvolvidos pelo Codex; plugins de terceiros servem apenas como referências técnicas. Adequar a dependência Community_Basic existente conforme PLUGINS.md.
- Avaliar mapa de orientação e bússola como radar de objetivos, conforme MAPA_E_BUSSOLA.md. A inclusão e os detalhes permanecem em avaliação.
- Avaliar geração procedural e templates para dungeons, casas, cidades e outros cenários. Consulte GERACAO_DE_CENARIOS.md; a adoção em runtime depende de prova de conceito.
- O sprite do jogador deve refletir a armadura equipada. Manter a aparência coerente na exploração e no combate, conforme DIRECAO_DE_ARTE.md.
- O menu de equipamentos permitirá arrastar equipamentos do inventário para os slots do personagem, com interação semelhante à de MMORPGs. Consulte INTERFACE.md.
- Seguir DIRECAO_DE_ARTE.md para estilo, paleta, escala, padrões por categoria, prompts e validação de todos os assets visuais.
- Não utilizar geração de vozes. Priorizar diálogos em texto e ilustrações bem detalhadas na apresentação narrativa.
- O jogador recupera vida ao acionar camas em hotéis e em algumas dungeons; consultar a wiki para locais e condições, conforme COMBATE.md.
- Para regras não definidas inicialmente, seguir o padrão do RPG Maker MV 1.6.1. Decisões específicas confirmadas do projeto têm precedência.
- Os inimigos visíveis no mapa terão movimentação de patrulha.
- O retorno após vitória seguirá o padrão do RPG Maker MV; inicialmente não será permitido fugir das batalhas.
- A exploração será em 2D com vista superior e movimentação por grade. As batalhas começam por contato com inimigos visíveis no mapa. A derrota em combate leva a game over.
- O combate será por turnos.
- Inicialmente haverá um único personagem controlável; sistemas de aliados serão avaliados futuramente.
- O primeiro marco abrangerá a introdução do jogo e a dungeon inicial, preservando a história original.
- As plataformas de destino são navegador e mobile, com prioridade inicial para teclado e mouse.
- O workflow seguirá Git Flow, conforme DESENVOLVIMENTO_E_VERSIONAMENTO.md.
- O jogo terá sistema de quests com estrutura moderna inspirada em Skyrim, buscando preservar as descrições do original no diário. Consulte QUESTS.md.
- O loot usa seis categorias lógicas por inimigo: ouro, poções, equipamentos, armas, itens de quest e raro. A regra mais recente limita a concessão a um equipamento por loot, com chance de raridade; slots vazios serão ocultados. Consulte LOOT.md.
- Somente os bônus raciais serão adaptados; o sistema de classes profissionais do original está fora do projeto. Classes do MV servem apenas como suporte técnico quando necessário.
- Priorizar a liberdade de combinar equipamentos, itens, habilidades e estratégias, tendo títulos mais recentes da franquia como referência dessa liberdade.
- Não haverá restrições de uso de armas e armaduras por raça ou classe. Consulte DIRETRIZES_DE_ADAPTACAO.md.
- Os menus de jogo e batalha priorizarão acesso rápido, pulando etapas de seleção quando houver somente uma opção válida. Consulte INTERFACE.md.
- Os menus de jogo e batalha serão refatorados com prioridade para slots, ícones, descrições e quantidades cabíveis, usando MMORPGs como referência. Consulte INTERFACE.md.
- A criação de plugins será documentada com funcionalidades e dependências, buscando reutilização em outros projetos. Consulte PLUGINS.md.
- O combate será Side View, com mecânicas modernas, animações para personagens e inimigos, barras de vida, mana e vigor conforme os recursos de cada combatente, e barra de atalhos para habilidades e itens. Consulte COMBATE.md.
- A história será fiel ao original, preservando os diálogos sempre que possível.
- A documentação será atualizada conforme o desenvolvimento, tratada como uma feature e consolidada antes de subir ao remoto.
- O Codex orientará a criação de branches e commits para organizar o desenvolvimento e separar funcionalidades. Consulte DESENVOLVIMENTO_E_VERSIONAMENTO.md.
- Os assets serão gerados por IA, usando a arte original de Arena como referência visual e aplicando um estilo dark fantasy.
- A base de dados replicará a do jogo original, adaptando o que for necessário ao projeto e ao RPG Maker MV.
- A pasta doc/wiki/ é a fonte local de consulta dos dados da wiki do jogo. Consulte também DIRETRIZES_DE_ADAPTACAO.md.

## Regra padrão para pontos não definidos

Aplicar o comportamento padrão do RPG Maker MV 1.6.1 quando uma regra não tiver sido especificada. Consultar a configuração real do projeto e a implementação do motor para verificar esse comportamento, sem assumir como padrão uma alteração introduzida por plugin.

As decisões confirmadas do projeto têm precedência. Exemplos: fuga inicialmente desabilitada, liberdade de equipamentos, loot em seis categorias com limite de um equipamento, bônus raciais e interface em slots devem ser preservados mesmo quando diferirem do padrão.

Pendências anteriores passam a ser tratadas assim:

- Quando houver comportamento nativo aplicável e compatível, adotá-lo como base inicial e registrar a escolha na documentação da feature. Não bloquear o desenvolvimento para rediscutir essa regra.
- Quando o recurso for novo ou não tiver equivalente nativo suficiente, implementar a solução mínima compatível com os requisitos, documentando as escolhas técnicas. Consultar o responsável apenas se a escolha alterar o escopo ou a direção confirmada.
- Não confundir regras com conteúdo: mapas, rotas de patrulha, textos, tabelas de loot e assets ainda precisam ser criados ou configurados para o marco escolhido.

Essa diretriz não confirma o uso de TP como vigor nem substitui o loot especificado pelos drops nativos: essas correspondências precisam atender aos conceitos e requisitos do projeto.

## Visão inicial — proposta

Criar um RPG de fantasia para um jogador, centrado em exploração, progressão do personagem e incursões em masmorras. Usar Arena como referência criativa, escolhendo quais elementos adaptar às possibilidades do RPG Maker MV e ao tamanho do projeto.

O escopo inicial contempla a campanha principal, suas cidades e dungeons principais, com um único personagem controlável. A primeira entrega será um trecho jogável da introdução e dungeon inicial, seguido de entregas graduais do restante do escopo confirmado.

Ainda precisam ser definidos: título definitivo, público, duração, detalhamento dos eventos do trecho inicial e intenção de distribuição.

## Pilares — propostas para validação

1. Exploração: descobrir caminhos, perigos e recompensas em áreas compactas.
2. Progressão: melhorar o personagem por meio de experiência e equipamento.
3. Preparação: fazer escolhas simples de recursos antes de entrar em uma masmorra.
4. Escopo controlado: terminar uma pequena aventura antes de ampliar conteúdo.

## Relação com Arena

A base de dados seguirá a do jogo original, com adaptações necessárias documentadas. O escopo reduzido orienta a seleção e a ordem de implementação do conteúdo; não autoriza substituir informações originais por dados inventados. Consultar doc/wiki/ e registrar as fontes e as conversões para o MV. A história será fiel ao original, mantendo os diálogos sempre que possível. O recorte de implementação e a abrangência geográfica de cada etapa ainda serão definidos.

Para cada elemento escolhido, registrar:

| Elemento de referência | Experiência desejada | Solução no MV | Situação |
| --- | --- | --- | --- |
| Exploração de masmorras | Descoberta e risco | A definir | Proposta |
| Progressão do personagem | Evolução perceptível | A definir | Proposta |
| Mundo de fantasia | Sensação de aventura | Recorte narrativo a definir | Proposta |

Informações específicas sobre o jogo original devem ser verificadas em fontes identificadas antes de entrarem como referência factual. Não inventar lore para preencher lacunas e apresentá-lo como material original.

## Escopo inicial confirmado

- Um único personagem controlável.
- Quests principais.
- Cidades e dungeons principais.

Esse é o escopo inicial do projeto como um todo. O primeiro marco jogável é um subconjunto: introdução e dungeon inicial. Implementar o restante da campanha principal em etapas, sem reduzir o objetivo do projeto inteiro à primeira dungeon.

Selecionar as cidades e dungeons principais a partir das fontes da campanha original e registrar um inventário ligado às quests principais. O inventário inicial consta em CAMPANHA_PRINCIPAL.md; os mapas internos e a divisão das entregas ainda precisam ser detalhados; não presumir todas as cidades do mundo original nem limitar automaticamente cada cidade a um único mapa.

Quests secundárias, locais opcionais e sistemas de aliados ficam fora do escopo inicial. Sua inclusão futura deve ser registrada como ampliação de escopo. Regras e sistemas já confirmados continuam válidos para o conteúdo incluído; geração procedural e mapa/bússola permanecem avaliações, sem adoção automática por esta definição.

## Primeiro marco jogável — escopo confirmado

Introdução do jogo e dungeon inicial, com um único personagem controlável e combate Side View por turnos. Preservar a história, os diálogos e as descrições originais sempre que possível.

O fluxo será introdução → exploração da dungeon inicial → conclusão do trecho inicial. O encerramento é o Shift Gate, já confirmado. Detalhar mapas, eventos, inimigos e conteúdo mínimo a partir das fontes. Não exigir local seguro, retorno a um contratante ou confronto final que não correspondam ao trecho original.

A criação do personagem inclui nome, raça e gênero, com assets predefinidos para cada combinação, conforme PERSONAGEM.md. O encerramento da demo ocorre ao alcançar o Shift Gate. Os critérios seguintes orientam a entrega e ainda devem ser detalhados para esse recorte.

### Critérios de aceitação

- É possível começar uma partida e concluir o objetivo principal.
- O jogador entende para onde ir e o que fazer.
- Os recursos necessários aparecem sem referências a arquivos ausentes.
- Vitória, derrota e retomada da partida têm comportamento definido.
- O fluxo principal foi testado manualmente no motor.
- Problemas conhecidos estão registrados.

## Fora do primeiro marco — proposta

- Mundo aberto extenso ou reprodução de todo o mundo de Arena.
- Gerador procedural completo de cidades e masmorras. A avaliação de templates e uma prova de conceito limitada podem ocorrer separadamente, conforme GERACAO_DE_CENARIOS.md.
- Muitas raças ou campanhas. O sistema de classes profissionais do original está fora do projeto inteiro.
- Sistemas complexos de reputação, facções e economia.
- Multijogador.
- Recriação da apresentação em primeira pessoa.

Esses limites podem ser revistos, mas não devem ser ampliados silenciosamente durante a implementação.

## Decisões de design pendentes

| Tema | Decisão necessária | Sugestão inicial, ainda não aprovada |
| --- | --- | --- |
| Apresentação | Detalhar controles e apresentação visual | Exploração 2D com vista superior e movimentação por grade confirmadas |
| Combate | Implementar padrões nativos compatíveis e detalhar recursos e controles próprios | Turnos, Side View, animações dos dois lados, barras de recursos e atalhos confirmados; consultar COMBATE.md |
| Personagem | Produzir catálogo de assets por raça/gênero e detalhar evolução | Nome, raça e gênero selecionáveis; personagem único, aliados em avaliação futura |
| Narrativa | Detalhar eventos e encerramento do marco | Introdução e dungeon inicial confirmadas; história fiel ao original |
| Exploração | Configurar rotas de patrulha e ciclo dos eventos de inimigos | Patrulha, batalha por contato, retorno padrão do MV após vitória, game over após derrota e fuga inicialmente desabilitada |
| Arte | Validar os exemplos visuais e formatos no motor antes de produzir em lote | Seguir a direção pictórica dark fantasy e os padrões de DIRECAO_DE_ARTE.md |
| Áudio | Estilo e origem | Definir após o primeiro fluxo jogável |
| Distribuição | Uso pessoal ou publicação | A definir |

## Estado técnico e cuidados com recursos

Projeto localizado em `D:\RPG Maker MV\Projects\Arena` e inspecionado em 25/10/2026. A documentação do repositório fica em `doc/`. O arquivo Game.rpgproject confirma RPGMV 1.6.1. O Git estava sem alterações pendentes na inspeção anterior à inclusão da documentação; isso não descreve o estado atual. O plugin Community_Basic está ativo. Consulte DIAGNOSTICO_INICIAL.md para as pendências verificadas.

Como os assets padrão foram excluídos, verificar referências remanescentes no banco de dados, nos mapas, nos eventos e nas configurações do sistema. Não presumir que a exclusão dos arquivos tenha removido essas referências.

Inventariar imagens, fontes, sons e músicas necessários ao primeiro marco. Registrar a origem e as condições de uso dos recursos adicionados. Não presumir autorização para reutilizar arquivos extraídos de Arena.

## Método de trabalho com o Codex

1. Ler este documento, as instruções do repositório e os arquivos relevantes para a tarefa.
2. Verificar o estado atual antes de editar e preservar alterações existentes do usuário.
3. Implementar uma tarefa pequena, com resultado observável.
4. Preferir recursos do motor quando atenderem à necessidade; justificar plugins ou código personalizado. Documentar cada plugin criado e suas dependências, buscando separar funcionalidades reutilizáveis do conteúdo de Arena.
5. Evitar editar arquivos internos do motor sem necessidade comprovada.
6. Manter consistentes as referências entre banco de dados, mapas, eventos e recursos.
7. Validar o fluxo afetado e registrar o que foi efetivamente testado.
8. Atualizar a documentação com as mudanças implementadas, decisões e validações.
9. Orientar a separação de funcionalidades em branches e indicar pontos adequados para commits coesos.

Não transformar uma sugestão deste documento em decisão aprovada. Resolver detalhes locais e reversíveis quando necessário, mas consultar o responsável antes de mudanças de escopo ou de direção do jogo.

O detalhamento operacional do M01 está em BACKLOG_M01.md, com vinte entregas, dependências e critérios de aceitação. O backlog planeja a implementação; não altera as decisões de escopo.

## Ordem sugerida de desenvolvimento

1. Inspecionar o projeto e identificar referências a recursos ausentes.
2. Especificar os eventos e dados do M01 a partir das fontes, aplicando as decisões de exploração, combate e encerramento já confirmadas.
3. Consultar doc/wiki/, mapear os dados originais necessários e definir o inventário mínimo de assets gerados por IA.
4. Construir um mapa de teste e validar movimentação e interação.
5. Validar um combate Side View com animações dos dois lados, barras de recursos e uso de habilidades e itens por atalhos.
6. Integrar missão, masmorra, recompensa e encerramento.
7. Testar a aventura inteira e corrigir impedimentos.
8. Avaliar a experiência antes de expandir.

## Registro de decisões

| ID | Decisão | Estado | Motivo |
| --- | --- | --- | --- |
| D001 | Usar RPG Maker MV 1.6.1 | Confirmada | Motor informado pelo responsável |
| D002 | Criar uma releitura com escopo reduzido | Confirmada | Direção informada pelo responsável |
| D003 | Desenvolver primeiro uma aventura curta e completa | Refinada por D030 | O marco agora é a introdução e dungeon inicial |
| D004 | Gerar assets por IA com referência na arte original e estilo dark fantasy | Confirmada | Direção de produção informada pelo responsável |
| D005 | Replicar a base de dados original com as adaptações necessárias | Confirmada | Direção de conteúdo informada pelo responsável |
| D006 | Consultar os dados da wiki na pasta doc/wiki/ | Confirmada | Fonte de consulta indicada pelo responsável |
| D007 | Adaptar o combate para mecânicas modernas | Confirmada | Direção informada pelo responsável; Side View e turnos confirmados posteriormente |
| D008 | Preservar a história original e os diálogos sempre que possível | Confirmada | Direção narrativa informada pelo responsável |
| D009 | Atualizar a documentação durante o desenvolvimento | Confirmada | Método de trabalho informado pelo responsável |
| D010 | Codex orientar branches e commits por funcionalidade | Confirmada | Organização solicitada pelo responsável |
| D011 | Tratar documentação como feature e consolidar antes do envio ao remoto | Confirmada | Fluxo solicitado pelo responsável |
| D012 | Apresentar combate em Side View | Confirmada | Direção de combate informada pelo responsável |
| D013 | Animar personagens e inimigos em combate | Confirmada | Requisito informado pelo responsável |
| D014 | Exibir barras de vida, mana e vigor quando o combatente possuir o recurso | Confirmada | Requisito de interface informado pelo responsável |
| D015 | Disponibilizar barra de atalhos para habilidades e itens | Confirmada | Requisito informado pelo responsável |
| D016 | Refatorar menus de jogo e batalha em slots com ícones, descrições e quantidades cabíveis | Confirmada | Referência em MMORPGs indicada pelo responsável |
| D017 | Documentar funcionalidade e dependências de cada plugin criado | Confirmada | Método de desenvolvimento solicitado pelo responsável |
| D018 | Buscar plugins reutilizáveis em outros projetos | Confirmada | Diretriz técnica informada pelo responsável |
| D019 | Priorizar acesso rápido nos menus e pular seleções com uma única opção válida | Confirmada | Diretriz de interação informada pelo responsável |
| D020 | Adaptar as raças originais para o sistema de classes do RPG Maker MV | Refinada por D022 | O escopo foi limitado aos bônus raciais; classes do MV são suporte técnico |
| D021 | Remover restrições de uso de armas e armaduras por raça ou classe | Confirmada | Diretriz de equipamentos informada pelo responsável |
| D022 | Adaptar somente bônus raciais, sem o sistema de classes profissionais original | Confirmada | Refinamento de escopo informado pelo responsável |
| D023 | Priorizar liberdade de combinar equipamentos, itens, habilidades e estratégias | Confirmada | Referência na liberdade de títulos mais recentes da franquia |
| D024 | Calcular loot em seis slots independentes conforme inimigo e condições de quest | Confirmada | Estrutura de recompensas informada pelo responsável |
| D025 | Ocultar slots vazios na interface de loot | Confirmada | Diretriz de apresentação informada pelo responsável |
| D026 | Incluir sistema de quests com organização moderna inspirada em Skyrim | Confirmada | Diretriz de quests informada pelo responsável |
| D027 | Buscar preservar as descrições do original no diário de quests | Confirmada | Diretriz narrativa informada pelo responsável |
| D028 | Adotar combate por turnos | Confirmada | Ritmo informado pelo responsável |
| D029 | Começar com personagem único e avaliar aliados futuramente | Confirmada | Escopo informado pelo responsável |
| D030 | Primeiro marco: introdução e dungeon inicial | Confirmada | Recorte informado pelo responsável |
| D031 | Destinar o jogo a navegador e mobile, priorizando teclado e mouse inicialmente | Confirmada | Plataformas e controles informados pelo responsável |
| D032 | Seguir Git Flow no workflow do projeto | Confirmada | Fluxo solicitado pelo responsável |
| D033 | Exploração em 2D | Confirmada | Perspectiva informada pelo responsável |
| D034 | Encontros por inimigos visíveis no mapa | Confirmada | Modelo de encontros informado pelo responsável |
| D035 | Exploração 2D em vista superior e movimentação por grade | Confirmada | Enquadramento e movimentação informados pelo responsável |
| D036 | Iniciar batalha por contato com inimigo visível no mapa | Confirmada | Gatilho informado pelo responsável |
| D037 | Derrota em combate leva a game over | Confirmada | Consequência informada pelo responsável |
| D038 | Inimigos no mapa se movimentam em patrulha | Confirmada | Comportamento informado pelo responsável |
| D039 | Retorno após vitória segue o padrão do RPG Maker MV | Confirmada | Fluxo informado pelo responsável |
| D040 | Não permitir fuga inicialmente | Confirmada | Regra de combate informada pelo responsável |
| D041 | Adotar regras padrão do RPG Maker MV 1.6.1 para pontos não definidos | Confirmada | Diretriz geral informada pelo responsável; decisões específicas prevalecem |
| D042 | Recuperar vida ao acionar camas em hotéis e em algumas dungeons, observando a wiki | Confirmada | Regra de descanso informada pelo responsável; detalhes das fontes a verificar |
| D043 | Não gerar vozes; priorizar diálogos em texto e ilustrações detalhadas | Confirmada | Direção de apresentação narrativa informada pelo responsável |
| D044 | Padronizar a geração de assets por um guia único de direção de arte | Confirmada | Solicitação do responsável; padrões definidos em DIRECAO_DE_ARTE.md, versão 1.0 |
| D045 | Permitir arrastar equipamentos para slots no menu de equipamentos | Confirmada | Interação semelhante à de MMORPGs solicitada pelo responsável |
| D046 | Atualizar o sprite do jogador conforme a armadura equipada | Confirmada | Requisito de aparência informado pelo responsável |
| D047 | Avaliar geração procedural e templates de cenários no MV | Confirmada | Avaliação solicitada pelo responsável; implementação e abordagem final não aprovadas automaticamente |
| D048 | Avaliar mapa de orientação e bússola para objetivos | Confirmada | Avaliação solicitada pelo responsável; inclusão ainda não confirmada |
| D049 | Usar plugins desenvolvidos pelo Codex, sem dependências de plugins prontos de terceiros | Confirmada | Diretriz de autoria informada pelo responsável; adequação do Community_Basic pendente |
| D050 | Consultar a instalação local do Arena original, além das fontes da wiki | Confirmada | Fonte instalada indicada pelo responsável |
| D051 | Classificar itens obrigatórios como importantes e impedir descarte acidental | Confirmada | Proteção de progressão solicitada pelo responsável |
| D052 | Respawn de inimigos após conclusão da dungeon ou quest correspondente | Confirmada | Ciclo informado pelo responsável |
| D053 | Vigor representa Stamina, gasto somente em combate por técnicas | Confirmada | Regra de recurso informada pelo responsável |
| D054 | Habilitar habilidades físicas conforme a arma utilizada | Confirmada | Regra de acesso informada pelo responsável |
| D055 | Aprender magias com magos da Mages Guild e por livros | Confirmada | Guild como referência original e livros como adaptação moderna |
| D056 | Verificar itens de missão na conclusão de etapa e no início da próxima | Confirmada | Redundância de progressão solicitada pelo responsável |
| D057 | Escopo inicial: personagem único, quests principais, cidades e dungeons principais | Confirmada | Abrangência informada pelo responsável; primeiro marco continua introdução e dungeon inicial |
| D058 | Idioma inicial somente Português Brasileiro | Confirmada | Definição do responsável |
| D059 | Demo: banco de dados, assets, mapa e eventos da introdução/dungeon, com encerramento | Confirmada | Entregas especificadas pelo responsável |
| D060 | Stamina sem regeneração passiva, recuperada por poções ou camas | Confirmada | Regra especificada pelo responsável |
| D061 | Camas recuperam inicialmente toda a vida, mana e vigor | Confirmada | Regra inicial; locais e condições observam a wiki |
| D062 | Técnicas especiais por tipo de arma consomem Vigor | Confirmada | Exemplos de corte, estocada e disparo fornecidos pelo responsável |
| D063 | Catálogo de magia da wiki, Guild por nível e livros obtidos | Confirmada | Avaliar efeitos inadequados ao 2D por turnos |
| D064 | Respawn ao sair após conclusão, exceto inimigos específicos de quest | Confirmada | Refinamento de D052 pelo responsável |
| D065 | Referências visuais em doc/prints/ e testes mobile iniciais no Galaxy A56 | Confirmada | Fontes e dispositivo informados pelo responsável |
| D066 | Estabelecer cada quest principal como um marco do projeto | Confirmada | Organização solicitada pelo responsável; M01 a M10 em MARCOS_DO_PROJETO.md |
| D067 | Encerrar a demo ao alcançar o Shift Gate | Confirmada | Ponto de encerramento aprovado pelo responsável |
| D068 | Escolher nome, raça e gênero com assets predefinidos | Confirmada | Criação definida pelo responsável |
| D069 | Progressão de vida, mana e Stamina semelhante à de Skyrim | Confirmada | Direção confirmada; regras numéricas a balancear |
| D070 | Ao menos movimentos leve e pesado por tipo de arma | Confirmada | Mínimo definido pelo responsável |
| D071 | Reativar eventos de itens de missão ausentes e eliminar duplicações nas etapas | Confirmada | Recuperação definida pelo responsável; respeitar entregas legítimas |
| D072 | Coletar loot automaticamente e tratar sobreposição entre equipamentos e raros | Confirmada | Coleta definida; política de sobreposição a detalhar na feature |
| D073 | Fontes da wiki em doc/wiki e imagens de referência de mecânicas em doc/prints | Confirmada | Reorganização de pastas informada pelo responsável |
| D074 | Preservar prioridade do estilo dark fantasy sobre referências externas | Confirmada | Precedência visual reforçada pelo responsável |
| D075 | Máximo de um equipamento por loot com pequena chance de raridade e tabelas por dificuldade | Confirmada | Refina a independência irrestrita anterior de slots equipáveis |
| D076 | Livros consumíveis de uso único, sem requisitos, drops por dificuldade | Confirmada | Regra especificada pelo responsável |
| D077 | Avaliar conversão de magias ambientais para múltiplos alvos | Confirmada | Tarefa de adaptação, efeitos concretos ainda em avaliação |
| D078 | Mobile em paisagem e tela inteira, preferência Chrome, toque avaliado nos testes | Confirmada | Configuração informada pelo responsável |
| D079 | Usar prints de HUD, inventário, loot e quests; solicitar novos conforme necessidade | Confirmada | Processo visual definido pelo responsável |
| D080 | Adiar decisões sobre geração procedural, mapa e bússola para próximos marcos | Confirmada | Recursos opcionais, sem bloqueio da demo M01 |

Ao aprovar uma decisão, atualizar seu estado e registrar consequências relevantes. Se for substituída, preservar o motivo da mudança.
