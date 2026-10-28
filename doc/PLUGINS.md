## Integração M01-17

M01-17: Arena_Recovery0.1.0 após os29 registros preservados (total30), configuração ArenaRecovery.json. Uso direto de poções, autorização de descanso e guard de execução; nenhum consumidor duplicado ou novo save. Documentação em plugins/Arena_Recovery.md.

# Criação e documentação de plugins

Estado atual M01-12 R02: Arena_Inventory0.2.0 refina slots/ícones e modal comparativo sem alterar APIs/save ou dados;20 registros no formato canônico,18 anteriores preservados; novos MV_EquipmentTransaction e Arena_Inventory. Sem dependência externa/Battlespire. Documentação dos dois em doc/plugins e relatório INVENTARIO_E_EQUIPAMENTOS_M01_12.md.

M01-10 R02: MV_MotionTimeline0.1.0 (núcleo puro) e Arena_BattleMotion0.2.0 (configuração/integração), após Arena_Battle. Sem consumidores novos de recursos/efeitos ou plugins externos.16 registros canônicos,14 anteriores preservados. Documentos individuais em plugins/; perfil R02 só piloto Bretã/rato, legacyR01 explicitamente separado. REVISAO_COMBATE_M01_10_R02.md contém vídeos/testes/limites; autoria no editor continua pendente.

Atualização M01-10 R01: Arena_Battle0.1.0 após Arena_Abilities/Arena_Resources. Configuração ArenaBattle.json,14 registros canônicos com os13 anteriores preservados. Sem consumidores duplicados de Vigor/Mana, plugin externo ou alteração de motor. Documentação em plugins/Arena_Battle.md; aliases genéricos de ação explícitos, perfis ausentes geram erro. Batalha real no Map007; autoria no editor desta versão pendente, separada do Chrome. M01-09 integrado em develop782ebc8.

## Estado operacional M01-09

Novos MV_AbilityRules0.1.0 (núcleo puro), Arena_Abilities0.1.0 (equipamento/execução/livros) e Arena_AbilityLab0.1.0 (cenário técnico), nessa ordem após os dez registros existentes. Documentos individuais em plugins/. Sem dependências externas ou outro consumidor de ArenaVigorCost; usa Arena_Resources. Livro usa uma transação própria, mantendo aprendizado/inventário nativos. Sem alterar engine/arte/Community_Basic. Configuração de conteúdo em ArenaAbilities.json, não no núcleo genérico.

## Diretrizes confirmadas

Cada plugin criado deve ter sua funcionalidade e suas dependências documentadas. Buscar implementações reutilizáveis em outros projetos, separando comportamento genérico de conteúdo específico de Arena.

## Autoria dos plugins

Os plugins utilizados no projeto devem ser desenvolvidos pelo Codex. Não adotar plugins prontos de terceiros como dependências da solução. Avaliações anteriores que citam plugins externos passam a valer somente como referências técnicas de viabilidade, sem recomendação de instalação ou compra.

Implementar código próprio a partir dos requisitos do projeto e das interfaces do motor. Não copiar ou reempacotar um plugin externo e apresentá-lo como autoria do Codex. Separar a lógica reutilizável de configurações, textos e dados específicos de Arena, mantendo a documentação e a validação exigidas neste guia.

O Community_Basic foi encontrado ativo na inspeção inicial e é uma pendência de adequação à nova diretriz, não uma exceção aprovada. Antes de removê-lo, inventariar os parâmetros e efeitos utilizados; se necessários, substituí-los por solução própria desenvolvida pelo Codex. Validar a equivalência e só então desativar a dependência. Nenhum plugin foi removido ou substituído por esta atualização documental.

Esta diretriz trata de plugins do projeto; não exige reescrever o código nativo do RPG Maker MV.

## Reutilização

Antes de criar um plugin, verificar os recursos do motor e os plugins existentes, delimitando a necessidade e a responsabilidade da nova implementação. Evitar dependências desnecessárias e dividir plugins por responsabilidades coesas, sem criar uma estrutura genérica maior do que a necessidade real.

Disponibilizar por configuração os valores que variam entre projetos, como referências a assets, identificadores do banco de dados, textos e ajustes de apresentação. Não embutir nomes, IDs ou regras de Arena na lógica reutilizável quando puderem ser fornecidos por configuração ou por uma integração separada.

Manter claros os pontos de integração, as alterações no comportamento do motor e as interações entre plugins. A reutilização deve ser demonstrável em uma configuração mínima, sem depender implicitamente dos arquivos ou dados exclusivos deste jogo.

## Documentação por plugin

Manter um documento em `doc/plugins/` para cada plugin criado, com o mesmo nome-base do arquivo JavaScript. Essa pasta deve ser criada quando houver o primeiro plugin documentado. Manter as instruções relevantes também na ajuda exibida pelo gerenciador de plugins.

Cada documento deve conter:

- Nome, arquivo, versão, objetivo e funcionalidades oferecidas.
- Versão do RPG Maker usada na validação; não declarar compatibilidade com versões não verificadas.
- Dependências obrigatórias e opcionais, versões verificadas e ordem de carregamento. Se não houver dependências externas, declarar explicitamente.
- Instalação, ativação e configuração mínima de exemplo.
- Parâmetros, valores padrão e formatos aceitos.
- Comandos, campos de notas e outros pontos de integração, quando existirem.
- Assets e registros de dados necessários, com formatos e convenções utilizados.
- Relação com outros plugins, conflitos conhecidos e alterações em classes ou métodos do motor.
- Efeitos em partidas salvas, persistência, migração e desativação, quando aplicáveis.
- Limitações, verificações realizadas, resultados e problemas conhecidos.
- Histórico de mudanças e instruções para reaproveitar o plugin em outro projeto.

Para dependências desconhecidas ou compatibilidade ainda não testada, registrar a pendência. Não declarar ausência de conflitos sem verificação.

## Critérios de conclusão

A implementação e sua documentação devem descrever o mesmo comportamento. Validar o uso principal, a configuração mínima e o tratamento de dependências ausentes ou configurações inválidas quando aplicável. Verificar a execução na combinação de plugins utilizada pelo projeto.

Para sustentar a reutilização, verificar o plugin em um cenário mínimo sem conteúdo exclusivo de Arena ou registrar explicitamente o que ainda impede essa validação. Atualizar a documentação junto com alterações de funcionalidade, parâmetros ou dependências.

Os critérios acima orientam as features. Os plugins e evidências implementados são documentados em doc/plugins/ e relacionados a seguir.

## Implementação M01-05

MV_StateStore 0.1.0 é o núcleo reutilizável sem conteúdo Arena; Arena_Persistence 0.1.0 é a camada de contratos/IDs específica do jogo. Ambos são próprios e documentados em doc/plugins/. Carregar o núcleo antes do consumidor, após os plugins atuais. Ausência da dependência gera erro explícito. js/plugins.js conserva a estrutura canônica do editor; Community_Basic permanece off. Os testes no navegador não confirmam gerenciador/salvamento no editor após a inclusão dos novos plugins.

Atualização M01-06 R04: Arena_ArtPreview0.2.0 adiciona galeria Map003 mantendo histórica Map002, carrega perfis de conteúdo em ArenaArtSamples.json e usa rato/Ria aprovados. Documentação de parâmetros, ordem, persistência e limites em `plugins/Arena_ArtPreview.md`; estado e evidências em `arte/INTEGRACAO_R04.md`. Sem plugins externos ou alterações internas no MV.

Atualização R05: Arena_ArtPreview0.2.1 melhora legendas da galeria atual no ramo mobile; não muda contratos de save ou assets. Documentação em plugins/Arena_ArtPreview.md. Prioridade de fontes originais e inventário prévio às16 combinações em arte/FIDELIDADE_E_VALIDACAO_R05.md.

## M01-07

MV_CharacterRules0.2.0 (funções puras, sem IDs/estado) e Arena_CharacterCreation0.2.0 (UI, conteúdo e hooks de identidade/bônus P01–P08 R05), após persistência/galeria. Documentação em plugins/MV_CharacterRules.md e plugins/Arena_CharacterCreation.md. MV_StateStore ganhou consulta hasOperation sem alterar schema. Sem plugins externos. Catálogo canônico preservado e lido/salvo pelo editor; evidências históricas m01-07-editor.json e fechamento R05.

## M01-08

MV_ResourceProgression0.1.0 (núcleo puro) e Arena_Resources0.1.0 (configuração específica, máximos/escolhas/Vigor, poções, descanso e interface mínima), nessa ordem ao final após Arena_CharacterCreation. Configuração em ArenaProgression.json; namespace arenaResources v1, sem espelhar HP/MP atuais. Documentos individuais em plugins/. Técnicas seguem indisponíveis até M01-09; Map005 é diagnóstico isolado. Community_Basic permanece OFF. Evidências técnicas e de autoria separadas em evidencias/m01-08/.


## M01-10 R03

Arena_BattleMotion0.3.0 amplia a cobertura para16 identidades/3 inimigos; actionMotion por inimigo, sem novo plugin ou consumidor de custos. MV_MotionTimeline permanece inalterado. Documentação em plugins/Arena_BattleMotion.md e EXPANSAO_COMBATE_M01_10_R03.md. R02 aprovado preservado. Autoria MV abrir/gerenciador/salvar/reabrir executada, separada do navegador; playtest visual NW.js/A56 e manual das variantes pendentes.


## M01-11

MV_BattleSlots0.1.0 e Arena_BattleUI0.1.0, nessa ordem após Arena_BattleMotion, sem plugins externos. Geometria pura separada de configuração/conteúdo Arena; cartões, referências battle.1–8 pelo contrato existente, revalidação sem novo consumidor de custos. Documentação em plugins/MV_BattleSlots.md e plugins/Arena_BattleUI.md; evidências e limites em INTERFACE_BATALHA_M01_11.md.


## M01-11 R02

Arena_BattleUI0.2.0 refina composição/visibilidade, indicadores e tema local de batalha, sem novo plugin/registro/dependência ou consumidor de custos. Proteção de canvas em janela menor por extensão, sem editar motor. Ler plugins/Arena_BattleUI.md e REVISAO_INTERFACE_M01_11_R02.md. Interface ainda em avaliação visual.


## Integração M01-12

MV_EquipmentTransaction0.1.0 (puro/sem IDs) e Arena_Inventory0.1.0 (adaptador/Scene/renderizador), após Arena_BattleUI. Sem dependências externas. Nova exportação ArenaBattleUI.theme reaproveita o acabamento existente. Contratos, configuração e limites em plugins/MV_EquipmentTransaction.md, plugins/Arena_Inventory.md e INVENTARIO_E_EQUIPAMENTOS_M01_12.md.


## Integração M01-13

M01-13:22 registros canônicos,20 anteriores preservados; após Arena_Inventory, MV_LootRules0.1.0 e Arena_Loot0.1.0. Sem plugins externos. Arena_Inventory exporta drawItemIcon para reutilizar o mesmo desenho e reconhece malha rara por mapeamento de material; Arena_Persistence adiciona getter sourceStatus sem mudar fonte/etapas/recibos. Docs individuais em plugins/ e LOOT_M01_13.md.


## Atualização M01-14

M01-14: Arena_Dungeon0.1.0 ao fim dos23 registros,22 anteriores integralmente preservados. Config ArenaDungeon.json; entrada técnica/portas nativas, sem schema novo ou código do original. Documentação em plugins/Arena_Dungeon.md. Validação do novo mapa no editor ainda pendente; formato canônico/UTF8 e referências auditados separadamente.


Arena_Dungeon atualizado0.2.0 em M01-14 R02: portas3estados/4vistas, águaA1/natação delimitada, prévias de objetos e migração de eventos R01. Configuração/API/dependências em plugins/Arena_Dungeon.md. Sem dependências externas nem novo consumidor de recursos.

Arena_Dungeon0.3.0/R03: montagem ortogonal/âncoras invariantes e revisão3 de geometria; ver plugins/Arena_Dungeon.md. Nenhum novo registro em plugins.js.

## M01-15 — patrulha e encontros

MV_EncounterRules0.1.0 (núcleo puro) seguido de Arena_Encounters0.1.0 (após Arena_Dungeon/combate/loot/movimentos). Config ArenaEncounters.json; contratos enemies/areas existentes, sem dependência externa. Documentação em plugins/Arena_Encounters.md. Não há novo consumidor de recursos, concessor de loot ou conclusão de quest automática.

## M01-16 — quests

MV_QuestRules0.1.0 e Arena_Quests0.1.0 após Arena_Encounters e dependências anteriores. Config ArenaQuests.json; guia plugins/Arena_Quests.md. Arena_Loot recebe somente claimContainer(id,table), reutilizando settlement existente e recibo por origem. Sem outro consumidor de itens/recompensas e sem dependências externas.

## Diário M01-16 R02

MV_JournalModel0.1.0 (modelo de leitura/quebra de linhas) e Arena_QuestJournal0.2.0 (cena/painéis/input/reflow) após Arena_Quests. Arena_Quests mantém os consumidores de progressão, apenas delegando openJournal ao plugin de apresentação. Dados visuais separados em ArenaQuestJournal.json, sem quests fictícias distribuídas. Guide plugins/Arena_QuestJournal.md.
