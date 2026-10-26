# Backlog de implementação do M01

## Objetivo e estado

Entregar uma demo jogável em Português Brasileiro: criar o personagem, acompanhar a introdução, explorar Imperial Dungeons e encerrar ao alcançar o Shift Gate. Este backlog detalha as decisões de DEMO_INICIAL.md, sem ampliar o marco para cidades ou quests posteriores.

Estado de execução e evidências em VALIDACAO_M01.md. M01-01, M01-02, M01-04 e M01-05 possuem evidências registradas em 25/10/2026. M01-03 está em validação parcial de autoria: abertura após a correção confirmada pelo responsável; R05 executou gerenciador/salvar/reabrir por teclado e auditou serialização, mas a conferência visual detalhada permanece pendente. Demais itens permanecem a fazer até evidência específica. A documentação existente e o .gitignore são insumos já preparados; não comprovam implementação do jogo. Não há estimativas de esforço ou datas definidas.

P0 indica base necessária para começar e integrar; P1 indica requisito de conclusão da demo, não conteúdo opcional. Sistemas novos devem ser implementados em plugins desenvolvidos pelo Codex quando o motor nativo não atender, com documentação e configuração reutilizável conforme PLUGINS.md.

## Backlog ordenado por dependências

| ID | Prioridade | Entrega | Depende de | Critério de aceitação resumido |
| --- | --- | --- | --- | --- |
| M01-01 | P0 | Consolidar baseline documental e organização Git Flow | — | Revisar arquivos, .gitignore e checklist, preparar commit coeso da feature documental e sua integração em develop conforme autorização; nenhuma fonte local externa entra por acidente |
| M01-02 | P0 | Especificar o conteúdo de MQ01 a partir das fontes | 01 | Lista de eventos, textos pt-BR, itens, inimigos, áreas e transições com fontes; geometria da dungeon examinada visualmente; término no Shift Gate |
| M01-03 | P0 | Preparar projeto mínimo executável | 01 | Projeto abre no editor MV 1.6.1, gerenciador lê plugins e salvamento/reabertura preservam configuração; nova partida abre mapa válido e executa novamente em localhost, sem referências ausentes; Community_Basic substituído ou dispensado preservando comportamentos necessários |
| M01-04 | P0 | Montar banco de dados mínimo e convenções de IDs | 02, 03 | Registros necessários ao M01 consistentes, fonte/adaptação identificadas e referências válidas; sem classes profissionais ou bloqueios de equipamento por raça |
| M01-05 | P0 | Definir e implementar o estado persistente dos sistemas próprios | 04 | Contratos e IDs para personagem, quests, itens concedidos, inimigos, atalhos e progressão; salvar/carregar cenário mínimo preserva o estado sem duplicação |
| M01-06 | P0 | Validar o primeiro conjunto visual e formatos de assets | 02, 03 | Exemplos de personagem, inimigo, tile, ícone e ilustração vistos no motor, com dark fantasy e leitura na escala final; fichas e prompts registrados |
| M01-07 | P1 | Implementar criação do personagem e bônus raciais | 04, 05, 06 | Escolhas de nome, raça e gênero geram o personagem e os assets predefinidos correspondentes; bônus documentados e escolhas persistentes |
| M01-08 | P1 | Implementar recursos e evolução do personagem | 04, 05 | Vida, mana e Stamina funcionam; evolução segue adaptação documentada do modelo Skyrim; sem regeneração passiva de Stamina, sem concessões repetidas por save/load |
| M01-09 | P1 | Implementar técnicas por arma e subconjunto de magias/livros | 04, 08 | Cada tipo de arma incluído possui movimento leve e pesado com custo de Vigor; troca de arma atualiza disponibilidade; aprendizado por livro é validado e persistido |
| M01-10 | P1 | Implementar combate Side View e animações dos dois lados | 06, 08, 09 | Jogador e inimigos animados, turnos, barras dos recursos existentes, vitória com retorno padrão e derrota com game over; fuga indisponível |
| M01-11 | P1 | Implementar interface de batalha em slots e atalhos | 09, 10 | Habilidades e itens utilizáveis por slots, com ícones/descrições/quantidades cabíveis; alvo único selecionado sem etapa redundante; custos e indisponibilidade respeitados |
| M01-12 | P1 | Implementar inventário, equipamento por arrasto e aparência | 04, 05, 06, 07 | Equipar por arrasto ou seleção, sem perda/duplicação; armadura altera visual no mapa e batalha; técnicas acompanham arma; save/load reconstrói aparência |
| M01-13 | P1 | Implementar loot automático e tabelas por dificuldade | 04, 05, 12 | Categorias respeitam condições, no máximo um equipamento por loot com pequena chance de raridade; coleta uma vez, slots vazios ocultos, itens importantes protegidos |
| M01-14 | P1 | Construir mapa final da dungeon e exploração | 02, 06 | Mapa superior por grade, colisões/passagens/portas consistentes com adaptação documentada; cela, chave e Shift Gate em posições funcionais; sem exigir gerador procedural |
| M01-15 | P1 | Implementar inimigos visíveis, patrulha e ciclo de encontros | 05, 10, 13, 14 | Contato inicia uma única batalha; derrota de inimigo não causa loop; respawn comum respeita saída após conclusão e exceções de quest |
| M01-16 | P1 | Implementar MQ01, diário e redundância dos itens importantes | 02, 05, 13, 14 | Objetivos e textos pt-BR, chave/porta e transições corretos; verificar itens ao concluir e iniciar etapas; reativar fonte quando necessário sem repetir recompensas |
| M01-17 | P1 | Integrar poções e descanso nos locais elegíveis | 02, 08, 13, 14 | Poções restauram conforme dados; cama elegível restaura totalmente os três recursos; interação, custos e condições documentados a partir das fontes |
| M01-18 | P1 | Produzir e integrar introdução e encerramento da demo | 02, 06, 07, 16 | Introdução textual/ilustrada sem vozes; Ria e diário integrados; Shift Gate encerra explicitamente a demo uma única vez, sem continuar para M02 |
| M01-19 | P1 | Validar e corrigir experiência em navegador/mobile | 07–18 | Fluxo completo em Chrome desktop e Galaxy A56, paisagem/tela inteira quando suportada, toque utilizável e texto legível; ambiente e limitações registrados |
| M01-20 | P1 | Balancear, testar regressões e preparar entrega M01 | 19 | Critérios de DEMO_INICIAL.md atendidos, ausência de bloqueios críticos, documentação consolidada e pacote de teste identificado; preparar release sob Git Flow conforme autorização |

## Detalhamento de escopo por grupo

### Base e dados — M01-01 a M01-05

- Preservar alterações existentes e fontes em doc/wiki e doc/prints. O índice FONTES_LOCAIS.md deve permanecer rastreável.
- Usar o diagnóstico datado para revalidar referências necessárias ao boot. Não restaurar a biblioteca padrão inteira por conveniência.
- Cadastrar raças/bônus, ator, tipos de armas/armaduras, técnicas, itens, poções, inimigos, tropas, estados e animações necessários ao marco. Não adaptar o catálogo inteiro antes de jogar o protótipo.
- Reservar IDs, switches, variáveis e campos de notas; manter dados de Arena separados da lógica reutilizável dos plugins.
- Definir checkpoints de teste antes da chave, após abrir a porta, após combate e antes do Shift Gate. Isso é cobertura de validação, não obrigação de criar autosave ou checkpoints para o jogador.

### Arte e personagem — M01-06, M01-07 e M01-12

- Fazer inventário de combinações de raça/gênero e seus arquivos. A demo não está autorizada a substituir silenciosamente a criação por personagem fixo.
- Comparar as referências de mecânicas de doc/prints com o guia dark fantasy; solicitar novos exemplos somente quando houver necessidade concreta.
- Validar pelo menos duas armaduras e a aparência-base, incluindo os movimentos do combatente. Escolher camadas ou folhas alternativas antes de multiplicar assets.
- Produzir os assets finais das combinações e inimigos efetivamente incluídos. Provisórios permitem iniciar desenvolvimento, mas limitações não podem ser apresentadas como arte final concluída.

### Recursos, técnicas e magia — M01-08 a M01-11

- Documentar valores iniciais, máximos e regra de aumento dos recursos; usar valores provisórios identificados até o balanceamento.
- Aplicar no mínimo leve/pesado a todos os tipos de armas disponibilizados na demo, não a todo tipo do catálogo futuro.
- Livros: uso único, sem requisito mínimo, consumo somente após aprendizado válido; magia já conhecida não deve causar consumo acidental sem benefício.
- Acesso a magos da Mages Guild pertence aos locais da campanha onde houver esse serviço. Não criar uma Guild dentro da prisão só para demonstrar o sistema. O contrato de aprendizado pode ser validado em mapa técnico separado, sem incluí-lo no percurso da demo.
- A análise das magias ambientais para múltiplos alvos pode produzir uma lista de candidatos e limitações para marcos posteriores. Não é necessário implementar todo o catálogo no M01.
- Regras nativas compatíveis de turnos seguem MV; decisões específicas de Stamina e atalhos têm precedência.

### Dungeon, loot e quests — M01-13 a M01-18

- Especificar a unidade de loot por inimigo/evento de origem, para que uma tela agregada não burle nem aplique indevidamente o limite de equipamento.
- Configurar fontes de livros em inimigos/baús compatíveis com dificuldade; não forçar todos os inimigos a conceder livros.
- Testar inventário no limite: coleta automática não pode perder silenciosamente item obrigatório. Tratar a condição de forma documentada.
- Um inimigo específico da quest não tem respawn comum; sua reativação excepcional para recuperar item obrigatório deve respeitar a obrigação ativa.
- Na dungeon inicial, o Shift Gate encerra a demo. Testar o mecanismo genérico de respawn em área técnica se o fluxo final não permitir revisita; não inventar retorno narrativo à prisão para comprovar respawn.
- Camas devem ser colocadas apenas em pontos elegíveis confirmados na especificação da área. Se a fonte não justificar cama no percurso, validar a recuperação em cenário técnico, sem inventar descanso na campanha.
- A reativação de fonte deve conceder somente a quantidade necessária do item e não refazer ouro, loot ou conclusão de quest.

### Validação e entrega — M01-19 e M01-20

Testar desde os primeiros protótipos, sem esperar M01-19 para descobrir problemas básicos. M01-19 é a validação integrada dos controles e apresentação, com correção dos problemas encontrados.

Cobertura final mínima: criação, introdução, movimentação, patrulha/contato, vitória, game over, técnicas leves/pesadas, uso de item, coleta automática, equipamentos por arrasto, aparência por armadura, chave/porta, diário, recuperação de item ausente, eliminação de duplicação, salvar/carregar e encerramento no Shift Gate.

Registrar tempos de carregamento, fluidez e leitura no Galaxy A56 em Chrome, incluindo versão do navegador/sistema, orientação, escala e dificuldades do toque. Não declarar suporte mobile apenas por teste em desktop. Não há orçamento de desempenho numérico aprovado; registrar as medições e corrigir impedimentos de uso.

## Ordem de execução recomendada

1. Baseline e especificação: M01-01 a M01-04.
2. Protótipo técnico: M01-05, M01-06 e versões mínimas de M01-08 a M01-10.
3. Personagem e interfaces: M01-07, M01-11 e M01-12.
4. Conteúdo e integração: M01-13 a M01-18, respeitando as dependências da tabela.
5. Validação, balanceamento e entrega: M01-19 e M01-20.

Os grupos orientam o planejamento, não autorizam ignorar dependências. A montagem visual do mapa e a especificação de textos podem avançar enquanto sistemas são implementados, sem considerar o mapa jogável antes de integrar eventos e recursos.

## Git Flow e rastreamento

Criar features a partir de develop após a baseline documental, usando nomes como feature/m01-base-executavel, feature/m01-dados, feature/m01-combate, feature/m01-interface ou feature/m01-quest. Uma feature pode concluir mais de um item coeso; não é necessário criar exatamente vinte branches.

Registrar por item: estado, branch/commits quando existirem, fontes, arquivos alterados, evidências de validação e pendências. Estados sugeridos: a fazer, em andamento, em validação, concluído. Só marcar concluído quando os critérios tiverem evidência.

O backlog não cria issues, branches, commits ou publicações automaticamente. M01-01 é consolidação da feature documental; M01-20 prepara uma release apenas quando a entrega estiver validada e sua publicação autorizada.

## Fora do M01

Geração procedural em runtime, mapa/bússola/radar, aliados, quests secundárias, cidades posteriores, toda a campanha, catálogo completo de magias e ferramentas extensas de autoria não são pré-requisitos desta demo. Reutilizar templates na autoria da dungeon é permitido, sem implicar gerador durante a partida.

## Estado verificado em 25/10/2026

| Item | Estado | Evidência |
| --- | --- | --- |
| M01-01 | Concluído | Baseline 29fc22b, integração em develop; revisão do índice e fontes ignoradas |
| M01-02 | Concluído | MQ01_ESPECIFICACAO.md; textos, eventos e mapas examinados; commit 29f44c3 |
| M01-03 | Concluído (base e autoria) | Leitura de nomes/status em detalhes do gerenciador, salvar/reabrir e comparação nativa em evidencias/m01-07-editor.json; localhost regressivo. Inspeção visual de playtest não declarada |
| M01-04 | Concluído (banco mínimo) | DADOS_M01.md, ArenaCatalog.json, validate-data e integração nativa em Chrome |
| M01-05 | Concluído | Contratos/API v1, save/load nativo, save gerado pela composição anterior, campos ausentes, recibos e isolamento; VALIDACAO_M01.md e PERSISTENCIA_M01.md |
| M01-06 | Concluído (amostra desktop) | Matriz de critérios e limites em arte/ENCERRAMENTO_AMOSTRA_M01_06.md; direção aprovada e formatos no motor. Aparelho/combate completo/biblioteca final não declarados |
| M01-07 | Concluído (criação-base desktop) | Nome/8 raças/2 gêneros/16 identidades-base, bônus derivados, confirmação/cancelamento, save/load e autoria; M01_07_CRIACAO.md. Poses novas estáticas e revisão estética/aparelho explicitamente separados |
| M01-08 a M01-20 | A fazer | Amostra não comprova aplicação racial, Vigor em combate ou campanha |

M01-05 e a amostra M01-06 integrados em develop; merge7e7094c preserva commits e evidências. Criação em feature/m01-criacao-personagem, sem integração automática. M01-06 encerra exemplos de formato/identidade, não biblioteca inteira, combate ou teste no aparelho. M01-07 entrega a criação-base com16 combinações, ainda sem movimentos completos/armaduras variantes. Demais itens continuam a fazer conforme dependências; não iniciar outra feature por associação nesta rodada.

Atualização26/10/2026: revisão exclusivamente dos assets de M01-07 em `feature/m01-revisao-assets-personagens`, baseada na criação ainda não integrada.16 combinações inspecionadas/padronizadas, anatomia Argoniana/Khajiit/Bosmer e retratos Redguard corrigidos; testes desktop e save/load r02 registrados em arte/REVISAO_PERSONAGENS_R02.md. **Revisão estética pendente do responsável**; a entrega funcional anterior não equivale à aprovação dos novos assets. M01-06 preservado; M01-08 e seguintes não iniciados. Animações completas, editor/NW.js desta revisão e aparelho continuam separados das evidências executadas.

Revisão pose-r03,26/10/2026: diretiva obrigatória em DIRECAO_DE_ARTE1.4/arte/PROCEDIMENTO_RETRATOS.md;16 retratos inspecionados e somente quatro corrigidos por IA (Khajiit/Argonianos, ambos os gêneros). Integração limita-se a quatro campos de face; demais assets/regras preservados. Evidências e pranchas em arte/REVISAO_POSE_RETRATOS_R03.md e evidencias/retratos-pose-r03/. **Avaliação estética continua pendente**; não concluir outra etapa ou promover candidatos a referência aprovada. Feature/m01-diretiva-pose-retratos para revisão, sem merge automático.
