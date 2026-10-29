## M01-20 — núcleo de distribuição em feature (29/10/2026)

Feature/m01-distribuicao-atributos, base develop ecdc949. Implementados três pontos por nível desde2, +1 por ponto em ATQ/DEF/MAT/MDF/AGI/SOR, saldo acumulável, migração retroativa única e aplicação confirmada fora de batalha. Parâmetros provisórios autorizados; E05, fórmula, raças e equipamento preservados. [Contrato e teste técnico](plugins/Arena_Attributes.md). Seis grupos focais passaram; avaliação manual e interface definitiva pendentes. M01-20/M01 não concluídos. Histórico anterior de distribuição ausente é superado somente pelo núcleo desta feature, não por UI de campanha entregue.

### Etapa obrigatória antes do fechamento/release do M01

Antes de encerrar o marco ou preparar sua release, **discutir com o responsável a organização do desenvolvimento em dois chats e o uso do RPG Maker como motor e plataforma**. Lembrete obrigatório de decisão; discussão ainda não realizada, não iniciada por esta implementação. Não presumir decisão/aceite. Preservar o lembrete até registrar o resultado com o responsável.

## Loot e descanso — integrados em develop após teste (29/10/2026)

Confirmação restrita do responsável em cc29df0: descanso nas plataformas testadas e quantidades de ouro variando. Incluídos fallback 2–8, retirada das quatro variantes dos novos pools com legados preservados e 40 pontos de descanso com plataforma da chave excluída. [Histórico/escopo](INTEGRACAO_TESTE_LOOT_DESCANSO_M01.md). Registros abaixo de candidata/adiamento são históricos; balanceamento continua provisório.

**M01-20 continua aberto:** distribuição de atributos na campanha ainda não implementada, fórmula definitiva não decidida, avaliação/ajustes por percurso e marco e checklist/pacote final ainda não fechados. Próximo recorte recomendado: decisão dos parâmetros mínimos da distribuição para atender esse requisito antes da implementação; usar S02–S06 existentes, sem reiniciar estudos, aplicar E05 ou iniciar implementação agora. Paisagem/fullscreen exigem atendimento ou revisão explícita do critério antes do fechamento integral de M01-19; aprovação com ressalvas permite continuidade, sem declarar atendimento. Melhorias REF13–REF16 e demais ressalvas futuras não viram bloqueios/implementações por associação. Sem nova funcionalidade, main/Pages ou release.

## Candidata de teste — loot e descanso (29/10/2026)

Integration/m01-loot-descanso reúne ce1a608/e234044 e b8143f5 sobre develop5659763, sem promover develop/main. Ver [composição, testes e roteiro](INTEGRACAO_TESTE_LOOT_DESCANSO_M01.md). Aprovação manual do ouro variável e da expansão de descanso pendente; M01-20/M01 não concluídos. Registros anteriores das features separadas são históricos para esta candidata.

## REF12 — expansão de descanso em feature separada (29/10/2026)

Feature/m01-expansao-descanso criada de develop5659763, sem incorporar lootce1a608.39 pontos adicionados/40 totais, piloto preservado e plataforma da chave excluída; lista, geradores e evidências em [EXPANSAO_DESCANSO_M01.md](EXPANSAO_DESCANSO_M01.md). Auditoria de posição/acesso dos40 e três amostras de recuperação/persistência, sem campanha completa; expansão aguarda teste integrado do responsável. Geometria, colisões, quests, tesouros e respawn preservados. **Aprovação manual do ouro variável adiada para o próximo teste integrado**, sem pedido isolado ou aprovação antecipada. Sem merge/push/Pages, outra melhoria ou fechamento M01. Registros anteriores preservam as etapas anteriores.

## Integração em develop; referência provisória para percurso M01 (29/10/2026)

Prévia [Pages](https://tjsp-lalecrim.github.io/Arena/), jogo9fab698/infraestruturaf62e026. **Responsável concluiu o roteiro funcional público e autorizou avançar ao M01-20 com ressalvas de apresentação.** Não significa atendimento integral de M01-19/paisagem/fullscreen ou fechamento M01. Publicação manual preservada, sem atualização Pages nesta tarefa. Evidências/limites em [VALIDACAO_M01.md](VALIDACAO_M01.md); REF13–REF15 permanecem adiados no registro único de refinamentos.

| Situação | Evidência ou pendência |
| --- | --- |
| Confirmado | No Chrome PC e A56 físico, criação/introdução, exploração/combate/loot, inventário/poções em e fora de combate, diário/descanso, Gate/encerramento; somados a save/fechar/reabrir/load e saves independentes. Roteiro público mínimo concluído pelo relato, sem repetir nem atribuir testes extremos não informados. |
| M01-20 atual | Base integrada5659763; dois percursos localhost até Gate/encerramento, sem dados quantitativos. Na feature: fallback2–8 preservado e quatro variantes genéricas retiradas das novas recompensas, com banco/saves legados intactos. Livros e ouro de batalhas preservados. Balanceamento provisório, E05 isolado; demais critérios pendentes. Item/marco não concluídos. |
| Requisitos adiados | Paisagem e tela cheia quando suportadas: existentes no aceite de M01-19, adiados pelo responsável, sem evidência de atendimento. REF14 também reúne avaliação da área do navegador. Adiamento não dispensa o aceite; atender ou revisar explicitamente os critérios antes de fechar o item. Menu por toque e simplificação do menu permanecem melhorias futuras em REF13/15, sem execução automática. |
| Bloqueios reais | Nenhuma falha crítica comprovada no relato. Facilidade é observação de balanceamento a investigar em20, não justificativa para alterar todos os sistemas. Apresentação adiada não bloqueia o diagnóstico autorizado nem pode ser declarada atendida. |

**M01-20 — planejamento vigente:** [avaliação de percurso](AVALIACAO_BALANCEAMENTO_POR_MARCO.md), vinculada a REF04, reutiliza M01-20 sem item duplicado. Base escolhida, integrada e disponível em localhost; [commits/verificações](INTEGRACAO_REFERENCIA_PERCURSO_M01.md). Três pontos de registro e poucos encontros representativos; congelar a referência e distinguir obtenção real de drops possíveis. Sem nova execução de percurso, ajuste de gameplay ou fechamento M01 nesta tarefa. Itens M02-BAL–M10-BAL preservados, sem renumeração ou início antecipado.

**Recorte atual concluído tecnicamente na feature, REF05:** [retirada das variantes provisórias](RETIRADA_VARIANTES_RARAS_M01_20.md). Fonte/24 sorteios controlados, quatro grupos de compatibilidade nativa e seis regressões focais do ouro; banco, equipabilidade e reservas antigas preservados. Não integrado em develop ou publicado. Aguardar avaliação; sem retomar outros sistemas. Conteúdo encantado/poções superiores, expansão REF12, abertura REF16 e catálogo REF05-C continuam futuros, sem início; M01-20/marco não concluídos.

## M01-19 — infraestrutura GitHub validada, sem deploy (29/10/2026)

Exceção autorizada executada: feature atual publicada; branch pages-infra/main recebem apenas infraestrutura **f62e026**, mantendo runtime estável e develop intactos. Workflow manual main com jogo **9fab698**/publish=false passou no Linux; deploy skipped. Artefato inspecionado,317 arquivos + manifesto, sem saves/referências/ferramentas. [Execução/evidência](VALIDACAO_M01.md#infraestrutura-publicada-e-validação-linux--29102026) e [procedimento](PUBLICACAO_TESTE_PAGES_M01_19.md). Não habilitado/configurado Pages nem publicado site/release. Aguardar avaliação antes do primeiro deploy; teste público, percurso integrado restante e Galaxy A56 final permanecem pendentes. Não fecha M01-19. Registros de preparação abaixo preservam seus estados históricos.

## M01-19 — preparação da publicação manual de teste (29/10/2026)

Responsável confirmou save/fechamento/reabertura/load no pacote local disponível R01/runtime9fab698; escopo em VALIDACAO_M01.md. Workflow manual com SHA imutável, modo somente preparação por padrão, validação Linux obrigatória antes de deploy e artefato limitado ao pacote. [Procedimento e decisões pendentes](PUBLICACAO_TESTE_PAGES_M01_19.md). Sem merge/push/configuração remota/deploy/release; main/develop preservadas. M01-19 permanece aberto: execução real do workflow/Linux, teste do endereço público, percurso integrado restante e Galaxy A56 físico final não foram presumidos. Estados anteriores abaixo mantêm o contexto histórico.

## M01-19 — pacote web local preparado (29/10/2026)

Mesma feature/m01-19-isolamento-saves; relato manual Chrome8765 registrado com limites em VALIDACAO_M01.md. Preparação reproduzível por allowlist, saída ignorada dist/web/m01-19-web-r01-9fab698/Arena, execução focal em8771/Arena/ validada sem alterar gameplay/namespace ou serviço pessoal. [Procedimento, tamanho, conteúdo e evidências](PACOTE_WEB_M01_19.md). **Não fecha M01-19:** pacote aguarda avaliação, percurso integrado Chrome e testes físicos finais permanecem no roteiro. GitHub Pages/publicação são entrega posterior, sem configuração/deploy/merge/push nesta tarefa. Estados anteriores abaixo são históricos quando divergirem deste registro.

## Preparação focal M01-19 — isolamento de saves web (29/10/2026)

Implementado MV_WebStorageNamespace0.1.0, parâmetro `arena:m01:save-v1`; slots, índice, configuração e backups separados das chaves genéricas. Sete grupos focais passaram no Chrome156 com perfil sintético persistente, sem bateria de gameplay. [Contrato, política e roteiro manual](plugins/MV_WebStorageNamespace.md); [resultado](evidencias/m01-19-isolamento-saves/resultado.json). Não altera conteúdo/migrações de partidas nem armazenamento por arquivos do editor.

Feature dependente `feature/m01-19-isolamento-saves` criada sobre67dfbe3 (implementação atual de M01-18 e refinamentos); develop permanece a9d8cc0. Sem merge/push/deploy. **Não fecha M01-19:** avaliação manual deste isolamento e percurso integrado Chrome desktop continuam pendentes; Galaxy A56 físico ao final do M01. A prioridade da rota desktop abaixo permanece válida após esta preparação autorizada. Estados exclusivamente documentais abaixo referem-se à tarefa anterior.

## Estado e prioridade operacional — 29/10/2026

Conferência exclusivamente documental sobre89ebb82, feature/m01-narrativa-demo, árvore inicialmente limpa; nenhum teste, merge ou início de implementação nesta tarefa. Aplicar a prioridade de DESENVOLVIMENTO_E_VERSIONAMENTO.md. Aprovações/ressalvas têm escopo em VALIDACAO_M01.md; melhorias futuras ficam no registro único REFINAMENTOS_POS_INTEGRACAO_M01.md.

### M01-18 — critérios funcionais atendidos na feature

| Critério | Evidência existente e limite |
| --- | --- |
| Introdução textual/ilustrada pt-BR, sem vozes/protagonista |14 momentos R02, fontes/adaptações em NARRATIVA_M01_18.md e REVISAO_INTEGRACAO_M01_18_R02.md; introdução aprovada pelo responsável |
| Criação → Ria/diário → dungeon |8 grupos nativos em evidencias/m01-18-r02/resultado.json, incluindo Nova Partida, início único de MQ01 e entrada direta; relato integrado confirma progressão no editor |
| Gate encerra uma vez, sem M02; retorno ao título |Mesmos resultados nativos cobrem contato lateral, F01/título e não repetição; responsável confirmou Gate e aprovou encerramento |
| Progresso persistente e leitura/entrada utilizáveis |Save/load de narrativa/dungeon/fim, migração e prevenção de salto de páginas;4 grupos/42 layouts em narrativa-telas-menores.json. Relato manual confirma persistência no editor, sem especificar todos os pontos/casos |

**Fechamento:** não há pendência funcional concreta de M01-18 identificada nesses critérios/registros. As aprovações narrativas já foram dadas; não solicitá-las novamente. A implementação permanece na feature, ainda sem consolidação em develop (local a9d8cc0/M01-17); a revisão/consolidação Git deve ser tratada conforme autorização da tarefa de continuidade, sem merge nesta execução. Ressalvas aceitas e melhorias futuras não são novos bloqueios de M01-18. Não declarar o M01 completo, todas as combinações validadas ou teste físico executado.

### Próxima unidade necessária: M01-19 — Chrome desktop

- **Critério:** fluxo completo no Chrome desktop, com controles funcionais e texto legível. Começar por uma rota representativa, por exemplo Bretã feminina: Nova Partida → introdução/Ria → dungeon/chave/porta/diário → Gate/encerramento/título, incluindo salvar/carregar em ponto relevante e os sistemas integrados encontrados no percurso. Não depender de drops raros nem comandos que concluam quests artificialmente.
- **Motivo da prioridade:** M01-18 já atende ao escopo funcional; as aprovações recentes foram pelo editor. A última evidência completa Chrome R02 é anterior aos ajustes posteriores, inclusive o descanso. Testes focais recentes e execução no editor não comprovam o percurso integrado da versão atual no navegador. Identificar commit, Chrome/versão, modo de execução, resolução, entradas e evidências. Registrar bloqueios ligados ao critério antes de propor correções; não começar por redesenhar sistemas já aprovados.
- **Dependências/workflow:** respeitar07–18 e Git Flow na futura tarefa; não abrir/integrar feature nesta atualização documental. Sem falta de nova decisão funcional identificada para essa rota, não reabrir aprovações. Fade e outros estudos sem etapa definida continuam futuros, sem implementação autorizada por esta recomendação.
- **Mobile:** testar fisicamente no Galaxy A56 ao final do M01, antes do fechamento da entrega; não bloquear esta unidade desktop pela ausência atual do aparelho. M01-19 só fecha integralmente quando também cumprir a cobertura física, sem presumir equivalência entre editor, emulação e smartphone. Numeração e dependência de M01-20 permanecem iguais.

Registros anteriores abaixo são históricos quando divergirem deste estado; não constituem novos pedidos de trabalho.

## Registro anterior M01-18 — 28/10/2026

M01-17 fechado com aprovação das poções separada dos testes automáticos de descanso, integrado/publicado em develop a9d8cc0. Feature/m01-narrativa-demo implementa M01-18 sem renumeração: criação → I01–I05/Ria → MQ01/dungeon → Gate → F01/título. Rota nativa232 passos, saves de narrativa/dungeon/fim, entrada protegida e telas menores verificados. Fonte primária Ria em TEMPLATE.DAT#1400; adaptações/divergências e limites em NARRATIVA_M01_18.md. Arte Ria R02 reutilizada sem alteração/protagonista;32 plugins canônicos. Concluído tecnicamente na feature para revisão, sem merge ou início M01-19. Avaliação narrativa/visual do responsável, nova autoria/playtest no editor, teste em velocidade normal e A56 físico permanecem separados e pendentes. Melhorias futuras e Vigor aquático inalterados. Registros anteriores são históricos quando divergirem.

## Fechamento M01-17 — 28/10/2026

Responsável aprovou a proteção R03 no estado disponível3f3bf6e, somando às aprovações de funcionamento35ba624 e feedback visualbd108c5. Não estender ao descanso/editor/dispositivos. Reexecutados9 grupos de recuperação, incluindo evento nativo da cama técnica, restauração integral dos três recursos, bloqueios, save/load e preservação de progressão/inventário; validadores de proteção/compatibilidade passaram. Evidências em evidencias/m01-17-fechamento. M01-17 concluído tecnicamente e autorizado para integração em develop. Sem cama confirmada no Map008; não inventada. Autoria manual nova no MV, Galaxy A56 físico e balanceamento permanecem verificações de integração, não declaradas realizadas. M01-18 corresponde a introdução/Ria/encerramento, sem renumeração. Estados anteriores são históricos quando divergirem.

## M01-17 R03 — proteção de uso no menu

Feedback visual R02 aprovado pelo responsável no estado disponívelbd108c5; não estender ao descanso/editor/dispositivos ou à proteção nova. Arena_Recovery0.3.0 acrescenta menuIntervalMs500 configurável, prazo único entre poções, nova pressão após soltura e descarte sem fila de solicitações bloqueadas. Slots indicam brevemente indisponibilidade; navegação e barras aprovadas preservadas. Proteção exclusiva de interface, sem mudança de combate/turnos/recuperação/descanso. Ler PROTECAO_POCOES_M01_17_R03.md e evidencias/m01-17-r03. Mesma feature, sem merge ou próximo backlog; testes manuais novos/editor/A56 seguem separados e pendentes. Histórico abaixo preservado.

## Revisão vigente M01-17 R02 — 28/10/2026

Responsável confirmou funcionamento do uso de poções no estado disponível35ba624; não presumir tipos/casos, ambiente, descanso, persistência ou aprovação da nova UI. R02 substitui mensagens redundantes por barras no quadro existente, com estado/estoque imediato e preenchimento visual240ms, sem bloquear navegação. Mesma feature/m01-pocoes-descanso; regras, valores, descanso, combate, save e plugins preservados. Ler REVISAO_FEEDBACK_POCOES_M01_17_R02.md e evidencias/m01-17-r02. Critérios técnicos mantidos; revisão visual do responsável, novo ciclo de editor e A56 físico continuam separados e pendentes. Sem merge ou próximo backlog. Relatos anteriores são históricos quando divergirem.

## Estado vigente M01-17 — 28/10/2026

M01-16 integrado/publicado em develop e69eec3, com aprovação restrita ao design do diário e REF06 futura, sem implementar notificações. M01-17 na feature/m01-pocoes-descanso: uso direto das três poções, revalidação na execução e cama técnica autorizada, reutilizando recursos/inventário/batalha/save. Sem cama confirmada no Map008; plataformas não viraram descanso. Ler POCOES_E_DESCANSO_M01_17.md e evidências próprias. Vigor aquático, bônus, arte e REF01 preservados. Concluído tecnicamente na feature para revisão; sem merge desta feature ou avanço para M01-18. Nova autoria/playtest no MV e Galaxy A56 físico permanecem pendentes, sem extrapolar a aprovação visual. Registros anteriores abaixo são históricos quando divergirem.

## Fechamento M01-16 — 28/10/2026

Responsável aprovou o **design visual** do sistema de quests; estado disponível086264e, sem hash próprio ou dispositivo informados. Evidência em evidencias/m01-16-r02/aprovacao-responsavel.json. Não atribuir a essa avaliação testes de lógica, persistência, respawn, autoria no editor ou mobile. Critérios funcionais revisados separadamente:23 cenários MQ01,5 grupos de diário e regressões identificados nas evidências R01/R02; validate-journal.cjs reexecutado neste fechamento passou. M01-16 concluído tecnicamente, autorizado para integração em develop. Nova autoria da UI no MV e Galaxy A56 físico permanecem verificações de integração, sem alegar execução. REF06 registra notificações futuras, sem implementação; REF01 permanece único para favoritos/atalhos. M01-17 corresponde a poções e descanso, sem renumeração. Estados anteriores abaixo são históricos quando divergirem.

## Diário M01-16 R02 — 28/10/2026

Mesma feature/m01-quests, base2ea761d: diário com filtros Pendentes/Concluídas/Todas, lista de missões conhecidas, descrição narrativa, passos revelados com ícones e status geral do booleano completed. Modelo de leitura separado da progressão; lógica de MQ01, fontes/recuperação, recompensas e respawn preservados. Reflow de lista/detalhes/abas em640×480 e916×412 emulado, contexto transitório preservado. Ler REVISAO_DIARIO_M01_16_R02.md e DIRETIVA_DE_NAVEGACAO.md (NAV01 obrigatória para todos os menus novos/revisados). Evidências próprias em evidencias/m01-16-r02, sem sobrescrever R01. Revisão para avaliação do responsável, sem merge ou próximo backlog; editor desta UI e A56 físico pendentes. Registros de apresentação anteriores abaixo são históricos quando divergirem.

## Estado vigente — M01-16 (27/10/2026)

M01-15 fechado tecnicamente e integrado/publicado em develop534ff7b após avaliação manual restrita ao combate disponível081222a; não atribuir aprovação manual de respawn/persistência/dispositivos. REF01–REF05 em REFINAMENTOS_POS_INTEGRACAO_M01.md permanecem futuros. Feature/m01-quests implementa M01-16, sem renumeração: MQ01, diário J10–J40, chave/fonte/porta/Gate, redundância saída/entrada, recuperação e recibos, tesouros pelo settlement existente e conclusão ligada à área/respawn. Ler QUESTS_M01_16.md e evidências próprias; bootstrap e migração de saves de laboratório estão explícitos. Para revisão, sem merge ou início de M01-17/18; introdução/Ria/F01 continuam M01-18. Nenhuma nova arte, revisão de bônus/drops de inimigos ou custo aquático. Editor da nova feature/manual de quests ainda pendentes; A56 físico somente integração mobile, sem bloqueio desktop. Registros abaixo são históricos quando divergirem.

## Fechamento M01-15 — 27/10/2026

Responsável testou o combate integrado e o considera satisfatório por enquanto. Estado disponível081222a, sem hash próprio, ambiente ou lista de casos informados; não atribuir aprovação manual de respawn, persistência ou outros critérios. Os14 cenários técnicos de encontros, duas entradas por ponteiro e regressões documentadas foram revisados; validate-encounters reexecutado passou, sem mudança de implementação. Critérios funcionais M01-15 atendidos tecnicamente; autorizada integração em develop. Autoria dos novos plugins/eventos no MV e testes físicos permanecem evidências pendentes de integração, sem serem declarados realizados. Melhorias futuras consolidadas em REFINAMENTOS_POS_INTEGRACAO_M01.md, sem implementação nesta rodada. Registros anteriores abaixo são históricos quando divergirem.

## Estado vigente — M01-15 (27/10/2026)

M01-14 concluído desktop: autoria manual do Map008 e Explorar Dungeon confirmados pelo responsável, estado disponível3bcdf81, sem hash próprio informado. Fechamento2ca0201 integrado/publicado em developf1f2957. M01-15 na feature/m01-encontros, com67 encontros nativos (37 ratos/30 goblins), patrulha delimitada, contato único, batalha/loot existentes, derrotas persistidas e respawn apenas na saída após conclusão aplicável. Ver ENCONTROS_M01_15.md e suas evidências para execuções/limitações. Implementado para revisão; sem merge desta feature ou início de M01-16. Autoria dos novos plugins/eventos e playtest integrado do responsável ainda não atribuídos à confirmação M01-14. Galaxy A56 físico pendente da integração mobile, não bloqueante desktop; melhorias futuras e Vigor na água inalterados. Registros abaixo são históricos quando divergirem.

## Fechamento vigente M01-14 — 27/10/2026

Responsável confirmou abertura do Map008, edição reversível, salvamento e reabertura pelo MV1.6.1, além de Explorar Dungeon. Estado disponível3bcdf81, sem hash de teste informado. Evidência manual em evidencias/m01-14/edicao-editor/confirmacao-responsavel.json, separada das tentativas automáticas anteriores. Integridade revalidada por validate-dungeon.cjs; critérios de topologia, portas, água, persistência e geradores cobertos pelas evidências R03 revisadas. **M01-14 concluído no escopo desktop**, autorizada integração em develop e continuidade M01-15. Ressalvas futuras de legibilidade das portas laterais e investigação de natação preservadas; S01 não aplicado, Vigor aquático inalterado. Galaxy A56 físico pendente da integração mobile, não bloqueante desktop. Registros abaixo de autoria/estética pendentes são históricos quando divergirem deste fechamento. Não atribuir essa confirmação a M01-15.

## Playtest MV e teste de autoria em cópia — 27/10/2026

Responsável confirmou execução de Explorar Dungeon pelo MV1.6.1 até o ponto testado (estado disponível031a58b). Não atribuir edição/salvamento/reabertura a essa evidência. Cópia temporária pronta em tmp/mv-editor-m01-14/Game.rpgproject, excluída do Git;273 arquivos de execução do original preservados. Nova abordagem sem capturas, por abertura separada/acessibilidade, não conseguiu operar o controle nativo. Roteiro curto e alteração segura em TESTE_EDITOR_M01_14.md; dados/propriedades/eventos/plugins da cópia verificados por arquivo, sem chamar isso de teste de autoria. M01-14 aguarda esse ciclo; sem merge ou M01-15. Autorização de continuidade permanece válida quando passar. Galaxy A56 físico é pendência da integração mobile, não bloqueio desktop. Arte aprovada e custo de Vigor na água inalterados.

## Aprovação M01-14 e pesquisa de natação — 27/10/2026

Estrutura/visual do estado disponívelb194b44 aprovados pelo responsável. Porta lateral fina/pouco visível é melhoria futura não bloqueante; preservar forma/encaixe/âncora/animação/colisão, sem geração nesta rodada. Pesquisa em INVESTIGACAO_NATACAO_ARENA.md confirma custo de fatigue documental, mas taxa/parado versus movimento/forma exata do afogamento não foram observados. S01 é proposta não aplicada; Vigor continua exclusivo de técnicas de combate. Ler APROVACAO_MAPA_M01_14.md. Autoria Map008 editar/salvar/reabrir no editor ainda sem comprovação; nova automação falhou. M01-14 não fechado, sem merge; M01-15 confirmado no backlog, ainda não iniciado por essa dependência. Registros anteriores de estética pendente são históricos; não transformar aprovação visual em teste funcional/editor/A56.

## Correção M01-14 R03 — 27/10/2026

Direção gráfica/planta permanecem aprovadas; encaixes de portas/objetos/colisões não estavam aprovados. R03 corrige os cinco prints de defeitos com componentes ortogonais, dobradiças fixas, ausência de cap sobre vão, plataformas independentes, tesouros maiores e suporte válido de decoração. Ler DIRETIVA_DE_MAPAS.md e DUNGEON_M01_14_R03.md. Sem merge, isometria ou avanço para M01-15. M01-14 em validação: testes Chrome/contratos separados de aprovação visual; captura do editor falhou duas vezes, sem comprovar editar/salvar/reabrir; A56 físico pendente. Registros anteriores são históricos quando divergirem.

## Revisão M01-14 R02 — 27/10/2026

Responsável aprovou direção gráfica e fidelidade estrutural da base disponível4161615. R02 revisa portas/objetos/água; a aprovação da base não se estende automaticamente às variantes novas. Planta preservada. Portas com quatro vistas/três estados, tesouros inspirados no arena_loot, água A1 própria e natação restrita ao mapa8/região2, sem custo/regeneração de Vigor. Fontes, contratos, testes e limites em DUNGEON_M01_14_R02.md. M01-14 permanece em validação: captura do editor falhou novamente; autoria no MV e A56 físico não verificados. Sem merge ou avanço de backlog. Estados operacionais anteriores abaixo são históricos quando divergirem desta revisão.

# Backlog de implementação do M01

## Estado operacional M01-14 — 26/10/2026

M01-13 integrado/publicado em develop4c612ae após revisão técnica e aprovação limitada ao menu; destaque de raros é melhoria futura não implementada. Feature/m01-dungeon-inicial entrega mapa8/tileset4, planta original50×50 adaptada3×3,14 portas, chave/Gate e pontos de integração. Navegação/colisões/save-load e comparação da planta testados. **M01-14 em validação, não concluído:** autoria/edição/salvar/reabrir do novo mapa no editor não confirmados por falhas da automação; avaliação de arte/escala do responsável e A56 separados. Ler DUNGEON_M01_14.md. Sem merge da nova feature, geração procedural, mapa-guia ou início de M01-15. Registros operacionais anteriores são históricos quando divergirem.

## Estado operacional — M01-13 (26/10/2026)

M01-12 concluído no escopo incremental aprovado, integrado/publicado em develop90e309b. Paleta, simplificação de uso de itens e design da confirmação permanecem melhorias futuras, sem implementação. Feature/m01-loot entrega M01-13 tecnicamente, sem renumeração, para revisão e sem merge. Implementação795d80d; testes/limites em evidencias/m01-13/fontes-testadas.json. Limite por origem individual já definido em LOOT.md: até uma peça por inimigo; agregação mantém origens. Tabelas wiki/provisórias, raridade substitutiva, reserva de capacidade, fonte de missão e ledger único descritos em LOOT_M01_13.md. Testes/capturas em evidencias/m01-13; editor/A56 e balanceamento final permanecem separados e pendentes. Não iniciar M01-14.

Registros abaixo são históricos quando divergirem deste estado operacional.


## Fechamento M01-12 — aprovação do responsável (26/10/2026)

Responsável aprovou inventário/equipamentos atuais, associados ao estado disponível6271f22, sem informar hash próprio, dispositivo ou lista de casos. A aprovação aceita a cobertura mínima de materiais existente para prosseguir; não transforma torso/material em figurinos completos nem comprova novos testes físicos/editor. Critérios funcionais revisados: arrasto/alternativas, troca/remoção sem perda, técnicas/atributos/aparência e save/load demonstrados nas evidências R01/R02. Validador estático/puro reexecutado com sucesso no fechamento; demais suítes identificadas são as execuções anteriores, sem alegar repetição. M01-12 concluído no escopo incremental aprovado, com ressalvas aceitas e não bloqueantes.

Melhorias futuras, não implementadas: reavaliar paleta; facilitar acesso/uso de itens reduzindo confirmações constantes; melhorar design da janela de confirmação. Preservar também favoritos futuros e limitações de cobertura artística registradas. Nova sessão visual no editor e Galaxy A56 físico continuam pendentes para validação integrada, sem atribuir à aprovação do responsável. Autorizada integração em develop e publicação; sem promover main/release.

## Objetivo e estado

Estado operacional M01-12: M01-11 integrado/publicado em develop6e59882 após aprovação do combate disponível em25672fe (ambiente/casos não detalhados). Feature/m01-inventario-equipamentos implementa inventário, troca/arrasto/prévia/remoção e aparência derivada mínima por couro/malha. M01-12 permanece em revisão, sem encerramento artístico; ler INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Favoritos são melhoria futura não implementada. Sem merge da nova feature ou avanço para M01-13; A56 físico/playtest visual NW.js pendentes.

Histórico do fechamento M01-08 R01 (antes da integração): M01-07 R05 já integrado, bônus aplicados e arte aceita com ressalvas; recursos concluídos na feature para revisão. Evidências preservadas em VALIDACAO_M01.md e RECURSOS_E_PROGRESSAO_M01_08.md; a autorização posterior resultou no merge d3c736d.

Entregar uma demo jogável em Português Brasileiro: criar o personagem, acompanhar a introdução, explorar Imperial Dungeons e encerrar ao alcançar o Shift Gate. Este backlog detalha as decisões de DEMO_INICIAL.md, sem ampliar o marco para cidades ou quests posteriores.

Estado de execução e evidências em VALIDACAO_M01.md. M01-01–11 integrados; M01-12 funcional na feature para revisão, com aparência mínima/material em avaliação e testes físicos separados. M01-13–20 não iniciados. Autoria no editor é separada do navegador; a documentação isolada não comprova implementação. Não há estimativas de esforço ou datas definidas.

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
| M01-20 | P1 | Balancear, testar regressões e preparar entrega M01 | 19 | Avaliação/ajuste do percurso conforme AVALIACAO_BALANCEAMENTO_POR_MARCO.md, com versão de referência, resultados e decisões/ressalvas registrados; critérios de DEMO_INICIAL.md atendidos, ausência de bloqueios críticos, documentação consolidada e pacote identificado; preparar release sob Git Flow conforme autorização |

Os bônus P01–P08 foram autorizados como balanceamento provisório no fechamento R05. M01-08 deve preservar o+10 inicial sem regrant; M01-09/10 e M01-20 devem executar BALANCEAMENTO_RACIAL_CENARIOS_M01.md: custos/turnos, armas livres, crítico/arredondamento, teto de acerto/evasão, utilidade de AGI, fontes reais de frio/magia/paralisia e vantagens excessivas. Testes de fórmula não demonstram equilíbrio integrado. Esses itens continuam futuros, sem implementação automática.

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

## Estado atual — M01-09 R01,26/10/2026

| Item | Estado | Evidência |
| --- | --- | --- |
| M01-01 | Concluído | Baseline 29fc22b, integração em develop; revisão do índice e fontes ignoradas |
| M01-02 | Concluído | MQ01_ESPECIFICACAO.md; textos, eventos e mapas examinados; commit 29f44c3 |
| M01-03 | Concluído (base e autoria) | Leitura de nomes/status em detalhes do gerenciador, salvar/reabrir e comparação nativa em evidencias/m01-07-editor.json; localhost regressivo. Inspeção visual de playtest não declarada |
| M01-04 | Concluído (banco mínimo) | DADOS_M01.md, ArenaCatalog.json, validate-data e integração nativa em Chrome |
| M01-05 | Concluído | Contratos/API v1, save/load nativo, save gerado pela composição anterior, campos ausentes, recibos e isolamento; VALIDACAO_M01.md e PERSISTENCIA_M01.md |
| M01-06 | Concluído (amostra desktop) | Matriz de critérios e limites em arte/ENCERRAMENTO_AMOSTRA_M01_06.md; direção aprovada e formatos no motor. Aparelho/combate completo/biblioteca final não declarados |
| M01-07 | Concluído (criação-base desktop, com ressalvas aceitas) | Aprovação estética com defeitos adiados, P01–P08 provisórios implementados,981 verificações novas,234 de criação,16 roundtrips e27 de persistência; FECHAMENTO_M01_07.md. Equilíbrio de combate e aparelho continuam futuros |
| M01-08 | Concluído tecnicamente, integrado em develop |619 verificações, recursos/progressão; merged3c736d após revisão do fechamento. Equilíbrio prático provisório |
| M01-09 | Concluído tecnicamente, integrado em develop782ebc8 |628 verificações/192 ações nativas, pares por arma/sem arma, Vigor único, Cura/Dardo/Mana, livros transacionais, save/load e regressões; HABILIDADES_M01_09.md. Guild e loot de livros continuam futuros |
| M01-10 | Em validação, feature para revisão | R02: piloto Bretã/rato com seis quadros/movimento, gestos/armas, impacto sincronizado,10 vídeos e regressões;15 personagens/2 inimigos continuam R01. Expansão/avaliação perceptiva e manual pendentes. REVISAO_COMBATE_M01_10_R02.md |
| M01-11 a M01-20 | A fazer | Atalhos, encontros de campanha, equilíbrio prático e demais sistemas continuam futuros |

M01-05/06 integrados pelo merge7e7094c; M01-07 pelo mergee1be141; M01-08 pelo merged3c736d e M01-09 pelo merge782ebc8, preservando commits. M01-06 encerra exemplos, não biblioteca inteira. M01-07 preserva16 combinações-base e ressalvas aceitas. M01-10 permanece em feature própria, sem merge em develop/main ou release. Concluir sua apresentação antes de M01-11; as18 comparações de turnos/custo R01 alimentam M01-20 sem transformar fixtures em equilíbrio final.

R05 permanece a decisão vigente de M01-07; a atualização M01-08 trata somente recursos/progressão. Os registros R02/R03/R04 abaixo são históricos: aprovações/propostas pendentes nesses relatos não revogam a decisão posterior. Fonte exata em decisoes/M01_07_APROVACAO_R05.json; arquivos visuais/hash e pendências em arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json e arte/PENDENCIAS_VISUAIS_M01_07.md.

Atualização26/10/2026: revisão exclusivamente dos assets de M01-07 em `feature/m01-revisao-assets-personagens`, baseada na criação ainda não integrada.16 combinações inspecionadas/padronizadas, anatomia Argoniana/Khajiit/Bosmer e retratos Redguard corrigidos; testes desktop e save/load r02 registrados em arte/REVISAO_PERSONAGENS_R02.md. **Revisão estética pendente do responsável**; a entrega funcional anterior não equivale à aprovação dos novos assets. M01-06 preservado; M01-08 e seguintes não iniciados. Animações completas, editor/NW.js desta revisão e aparelho continuam separados das evidências executadas.

Revisão pose-r03,26/10/2026: diretiva obrigatória em DIRECAO_DE_ARTE1.4/arte/PROCEDIMENTO_RETRATOS.md;16 retratos inspecionados e somente quatro corrigidos por IA (Khajiit/Argonianos, ambos os gêneros). Integração limita-se a quatro campos de face; demais assets/regras preservados. Evidências e pranchas em arte/REVISAO_POSE_RETRATOS_R03.md e evidencias/retratos-pose-r03/. **Avaliação estética continua pendente**; não concluir outra etapa ou promover candidatos a referência aprovada. Feature/m01-diretiva-pose-retratos para revisão, sem merge automático.

R04 em feature/m01-identidade-e-auditoria-racial: dois pilotos masculinos Argoniano/Khajiit, com antes/depois e estudos144/48×64/96px; alpha real verificado, mas pé do combatente Khajiit alcança borda da fonte. **Sem integração ou aprovação estética**, sem ciclos/variantes completos. Todas as16 referências visuais ativas preservadas. Auditoria completa das oito raças e propostas P01–P08 não aplicadas em AUDITORIA_BONUS_RACIAIS_M01_07.md. Correção técnica separada: retirar3/4 desarmados dos bônus de arma, com reprodução antes/depois. Criação234,16 roundtrips/previews e matriz racial8×7 níveis verificadas em Chrome isolado; editor/aparelho desta rodada pendentes. M01-08 e seguintes não iniciados; sem merge/release.


M01-12 R02 (26/10/2026): inventário anterior considerado bom pelo responsável; refinados slots equipados com ícones e comparação visual dos parâmetros finais. Testes/evidências R02 registrados no relatório e VALIDACAO_M01. Mesma feature, sem integração automática; avaliação das mudanças R02 e cobertura artística mínima permanecem pendentes. Não iniciar M01-13.

## Fechamento M01-13 — 26/10/2026

Responsável aprovou o menu de loot no estado disponível2b0f0dc, sem informar versão própria/dispositivo ou casos adicionais. Destaque visual de raros é melhoria futura, não implementada. Aprovação limitada ao menu; critérios funcionais revisados separadamente:11 cenários MV,24 matrizes, reservas/save/load/quest/derrota/abort/rollback e regressões registrados em evidencias/m01-13. Validador estático reexecutado neste fechamento; não alegar reexecução de todas as suítes. M01-13 concluído tecnicamente, com economia provisória e testes editor/A56 ainda separados. Integração/publicação em develop autorizadas; sem main/release.

## Refinamentos pós-integração

M01-19 concentra REF01(favoritos/atalhos incluindo itens), REF02(caminhada de inimigos) e REF03(fundo genérico da dungeon). M01-20 concentra REF04(balanceamento após quests/descanso/progressão) e REF05(pesquisa e tabelas de drops por inimigo). Critérios completos e registro único de favoritos em REFINAMENTOS_POS_INTEGRACAO_M01.md. Nenhuma dessas melhorias foi implementada nesta rodada.

## Aplicação permanente NAV01

M01-19 deve auditar os menus conforme DIRETIVA_DE_NAVEGACAO.md, encaminhando adequações às pendências já existentes: REF01(favoritos/atalhos), uso de itens/confirmações e refinamentos de inventário. Não criar duplicatas nem refatorar esses menus na revisão de diário. M01-16 R02 aplica a diretiva apenas ao diário; não altera as regras de MQ01 ou antecipa próximos itens.
