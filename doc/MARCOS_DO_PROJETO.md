# Marcos do projeto

## Organização confirmada

Cada quest principal constitui um marco do projeto. A sequência acompanha CAMPANHA_PRINCIPAL.md. Cidades, serviços, locais preparatórios, eventos e recursos necessários à quest fazem parte do respectivo marco; não são tratados como conteúdo secundário dispensável.

Os marcos da campanha não são renumerados pela inclusão de marcos técnicos. Estado vigente: M01 aprovado como entrega desktop com ressalvas, registrado em [ENTREGA_M01.md](ENTREGA_M01.md); M02–M10 planejados, sem início autorizado. Evidências/cobertura ficam no backlog e na validação, não são certificadas só por esta tabela. Não há datas ou prazos definidos.

| Marco | Quest | Entrega de conteúdo | Condição principal de conclusão |
| --- | --- | --- | --- |
| M01 — Demo inicial | MQ01 — Imperial Dungeons | Base de dados necessária, introdução em pt-BR, assets, dungeon inicial e eventos descritos em DEMO_INICIAL.md | Completar a fuga e apresentar o encerramento explícito da demo; encerramento confirmado ao alcançar o Shift Gate |
| M02 — Fang Lair | MQ02 | Rihad, Stonekeep, cadeia de descoberta de Fang Lair e a dungeon principal | Obter o primeiro fragmento e concluir os eventos de transição previstos para a quest |
| M03 — Labyrinthian | MQ03 | Winterhold, Mages Guild, Fortress of Ice e Labyrinthian | Obter o segundo fragmento, respeitando as etapas e itens necessários |
| M04 — Elden Grove | MQ04 | Eldenroot, Selene's Web e Elden Grove | Obter o terceiro fragmento e concluir a cadeia correspondente |
| M05 — Halls of Colossus | MQ05 | Corinth, Mages Guild, Temple of Agamanus e Halls of Colossus | Obter o quarto fragmento e concluir a cadeia correspondente |
| M06 — Crystal Tower | MQ06 | Lillandril, Mages Guild, Temple of Mad God e Crystal Tower | Obter o quinto fragmento e concluir a cadeia correspondente |
| M07 — Crypt of Hearts | MQ07 | Camlorn, Brotherhood of Seth, Mines of Khuras e Crypt of Hearts | Obter o sexto fragmento e concluir a cadeia correspondente |
| M08 — Murkwood | MQ08 | Stormhold, Conclave of Baal, Vaults of Gemin e Murkwood | Obter o sétimo fragmento e concluir a cadeia correspondente |
| M09 — Dagoth-Ur | MQ09 | Ebonheart, Black Gate, cadeia do Hammer of Gharen e Dagoth-Ur | Obter o oitavo fragmento e concluir os eventos que preparam a etapa final |
| M10 — The Imperial Palace | MQ10 | Imperial City no recorte necessário, Imperial Palace e desfecho | Concluir a resolução do Jewel of Fire e apresentar o encerramento da campanha |

Os detalhes narrativos e eventos completos de cada marco devem ser especificados consultando as fontes listadas em CAMPANHA_PRINCIPAL.md. A tabela não substitui sonhos, entregas, enigmas ou emboscadas exigidos pela quest; “obter fragmento” é um resumo de aceitação, não autorização para cortar o restante da cadeia.

O detalhamento do primeiro marco está em BACKLOG_M01.md. Os demais marcos receberão seus backlogs quando entrarem no planejamento de implementação.

## Marco técnico independente — MOBILE-01

**MOBILE-01 — adaptação mobile e APK Android**, planejado com execução a planejar. Escopo, dependências de entrada e critérios subordinados em [MOBILE_01.md](MOBILE_01.md); sem tecnologia de empacotamento escolhida. Não renumera a campanha, não bloqueia M01 desktop nem exige aparelho/Pages a cada entrega.

## Dependências e continuidade

Ordem de aceitação: M01 → M02 → M03 → M04 → M05 → M06 → M07 → M08 → M09 → M10. A pesquisa ou preparação de assets de marcos posteriores pode ocorrer antes, sem declarar concluída uma quest que ainda não funciona na campanha integrada.

No M02, permitir a continuação além do encerramento da demo de M01, preservando uma identificação clara de versão. Definir e registrar a política de continuidade de saves antes de distribuir uma versão que deva aceitar saves anteriores.

Os sistemas comuns são construídos gradualmente nas features necessárias a esses marcos. Não é obrigatório adaptar todo o catálogo do jogo para terminar M01, nem criar versões duplicadas de plugins para cada quest.

## Avaliação recorrente de balanceamento

Ao final de **cada marco**, executar um item explícito de **avaliação e ajuste de balanceamento**, com referência fixa, registro manual curto e aceite/ressalvas identificados. Procedimento e campos obrigatórios em [AVALIACAO_BALANCEAMENTO_POR_MARCO.md](AVALIACAO_BALANCEAMENTO_POR_MARCO.md); não duplicar critérios em cada backlog. Ajustes concretos dependem da autorização da respectiva rodada. Não exige testes de todas as combinações nem inicia os marcos futuros agora.

| Item de fechamento | Marco |
| --- | --- |
| **M01-20** (existente, sem novo item) | M01 — Demo inicial |
| M02-BAL | M02 — Fang Lair |
| M03-BAL | M03 — Labyrinthian |
| M04-BAL | M04 — Elden Grove |
| M05-BAL | M05 — Halls of Colossus |
| M06-BAL | M06 — Crystal Tower |
| M07-BAL | M07 — Crypt of Hearts |
| M08-BAL | M08 — Murkwood |
| M09-BAL | M09 — Dagoth-Ur |
| M10-BAL | M10 — The Imperial Palace |

Incorporar os identificadores subordinados ao detalhar os futuros backlogs; não renumerar quests ou marcos. O fechamento considera resultados do percurso, eventuais ajustes avaliados e ressalvas aceitas, sem certificar toda a campanha com os números do M01.

## Critérios comuns de conclusão

- Quest jogável de ponta a ponta, incluindo acesso aos locais e aos eventos necessários.
- Textos em Português Brasileiro, com fontes e adaptações documentadas.
- Assets necessários integrados e consistentes com DIRECAO_DE_ARTE.md; ausência de recursos faltantes no fluxo validado.
- Diário e objetivos atualizados, com itens importantes protegidos e verificações redundantes nas transições.
- Combates, loot e respawn respeitam as regras aprovadas; recompensas e itens únicos não são duplicados indevidamente.
- Item recorrente de balanceamento avaliado, com resultados e decisões/ressalvas registrados conforme o processo acima.
- Salvar/carregar preserva o progresso e o estado relevante do marco.
- Validação do fluxo no navegador desktop, inicialmente Chrome. M01 fecha nesse alvo obrigatório; adaptação/validação mobile e APK pertencem ao MOBILE-01. Preservar toque e evidências físicas já existentes, sem inferir suporte pleno ou exigir smartphone em toda entrega desktop.
- Conteúdo dos marcos anteriores continua acessível ou encerrado conforme a narrativa, sem regressões conhecidas que impeçam a campanha.
- Documentação consolidada, resultados de validação e problemas conhecidos registrados.

Definir casos de teste concretos e dados necessários ao iniciar cada marco. Não considerar um marco concluído apenas pela presença dos mapas ou pelo cadastro dos registros no banco de dados.

## Git Flow e divisão em features

Um marco é uma entrega de conteúdo, não uma única branch obrigatória. Dividir seu trabalho em features coesas a partir de develop, por exemplo feature/m01-base-dados, feature/m01-dungeon e feature/m01-eventos. Features de sistemas compartilhados podem ter nomes independentes do marco.

Integrar as features validadas em develop. Quando houver uma versão a distribuir, preparar release/versao e seguir DESENVOLVIMENTO_E_VERSIONAMENTO.md. Não criar dez branches de longa duração para desenvolver todas as quests simultaneamente. Marco concluído não implica envio automático ao remoto ou publicação.

Geração procedural, mapa e bússola permanecem em avaliação e não são promovidos a requisitos por esta organização. Aliados e quests secundárias permanecem fora do escopo inicial.


## Recursos opcionais nos próximos marcos

A inclusão de geração procedural, mapa e bússola será decidida nos marcos posteriores ao M01, conforme necessidade e resultados das avaliações. Nenhum marco específico foi escolhido para essa decisão. Não incluir automaticamente esses recursos nos critérios de conclusão da demo nem iniciar sua implementação como dependência do M01. Se adotados, registrar o marco de introdução, as features e os critérios de validação.
