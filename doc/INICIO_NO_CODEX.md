# Entrada operacional do Arena — M01

Atualizado em **30/10/2026**. Implementação de referência: develop **114cf4bcada4ef1b30ecef2bbde1a7e381549144**; os documentos desta feature não mudam o jogo. M01-01–18 integrados, fluxo público funcional confirmado na versão abaixo; M01-19 com requisitos de apresentação adiados, M01-20 e marco **ainda abertos**. Distribuição de atributos e expansão de descanso já implementadas/integradas; não são novos backlogs ausentes.

## Leitura curta e fontes principais

Ler esta entrada e somente as fontes pertinentes ao recorte. Decisões vigentes do repositório prevalecem sobre históricos e chats; confirmar o Git antes de agir.

| Assunto | Fonte principal |
| --- | --- |
| Processo, dois chats, motor, entregas pequenas, Git e tags | [DESENVOLVIMENTO_E_VERSIONAMENTO.md](DESENVOLVIMENTO_E_VERSIONAMENTO.md) |
| Escopo/aceite M01, matriz e próximas decisões | [BACKLOG_M01.md](BACKLOG_M01.md#matriz-de-fechamento-m01--30102026), com DEMO_INICIAL.md |
| Aprovações, versões, ambientes e evidências | [VALIDACAO_M01.md](VALIDACAO_M01.md) |
| Regras de personagem, progressão e dados | [Personagem](PERSONAGEM.md), [progressão](HABILIDADES_E_PROGRESSAO.md), [dados](DADOS_M01.md), [plugins](PLUGINS.md) |
| Arte, mapa e navegação | [Arte](DIRECAO_DE_ARTE.md), [mapas](DIRETIVA_DE_MAPAS.md), [navegação](DIRETIVA_DE_NAVEGACAO.md) |
| Provisórios de balanceamento e roteiro por marco | [AVALIACAO_BALANCEAMENTO_POR_MARCO.md](AVALIACAO_BALANCEAMENTO_POR_MARCO.md) |
| Melhorias/ressalvas, sem tarefas duplicadas | [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md) |
| Pacote reproduzível e publicação manual separada | [Pacote](PACOTE_WEB_M01_19.md), [publicação](PUBLICACAO_TESTE_PAGES_M01_19.md) |

## Aprovações e limites de cobertura

| Referência | Confirmado pelo responsável |
| --- | --- |
| Prévia pública9fab698 / m01-19-web-r01 | Chrome no PC e Samsung Galaxy A56 físico: criação/introdução, exploração/combate/loot, inventário/poções, diário/descanso, Gate/encerramento; salvar, fechar/reabrir Chrome e carregar, com saves independentes |
| Editor MV1.6.1, versões identificadas na validação | Map008: abrir/editar reversivelmente/salvar/reabrir e Explorar Dungeon; percurso integrado, narrativa/encerramento e demais recortes aprovados conforme seus relatos |
| Localhost5659763 | Dois percursos Khajiit/Elfo Negro até encerramento; sem dados quantitativos ou ambiente discriminado |
| Candidata cc29df0 | Descanso nas plataformas testadas e ouro variando; ambiente/posições/extremos/persistência não discriminados |
| Atributos38b3342, somado ao laboratório f6de74d | Ganho de três níveis, distribuição, cancelamento, reinicialização e confirmação; ambiente não discriminado, sem relato adicional de persistência ou smartphone |

Evidências técnicas de migração, persistência, isolamento, geradores e plugins ficam em VALIDACAO_M01.md. Não atribuir a versão pública antiga os recursos posteriores. Não pedir novamente testes já válidos sem risco concreto.

## Estado provisório e continuidade

Três pontos de+1 por nível desde2, saldo acumulável e escolha independente de Vida/Mana/Vigor estão ativos; balanceamento racial/equipamentos/custos continuam provisórios. Fórmula da campanha preservada; proporcional S02/conjuntos E05 continuam **somente no laboratório**, sem autorização de transferência. Prefixo web arena:m01:save-v1 estável; atualizações compatíveis não criam outro armazenamento.

Paisagem/fullscreen **não atendidos e adiados**. Ressalvas aceitas não revogam aprovações. Pendências/decisões e verificações finais estritamente justificadas estão na matriz do backlog; refinamento visual dos atributos é futuro (REF15).

**Estado autorizado em30/10/2026:** documentação integrada localmente em develop e primeira candidata preparada em release/m01. Fonte/pacote e avaliação A56 em [M01_RC1.md](M01_RC1.md); aguardar aprovação explícita. Paisagem/fullscreen foram aceitos como não atendidos no M01; balanceamento/3 pontos/fórmula atual aceitos como provisórios, sem promover E05. A RC1 foi publicada depois, somente para teste físico, conforme [PUBLICACAO_RC1_M01.md](PUBLICACAO_RC1_M01.md); exceção na main limitada à infraestrutura, sem integrar o jogo ou criar tag/release final. Último relato RC1 foi no navegador integrado do GPT, não no A56. Não iniciar melhorias, lotes ou migração de motor por associação. A discussão obrigatória de dois chats/motor foi realizada; [decisões da retrospectiva](DESENVOLVIMENTO_E_VERSIONAMENTO.md#retrospectiva-aprovada--30102026) não equivalem a aceite final do M01.

---

## Histórico de entradas anteriores — consulta, não instrução vigente

Estados datados abaixo preservam rastreabilidade. Afirmações como “a fazer”, “sem merge”, “aguarda aprovação” ou “ouro5” descrevem a versão daquela entrada; não reabrem decisões superadas pelo estado acima. Consultar somente para rastrear uma implementação/evidência.

## Revisão vigente M01-18 R02 — 28/10/2026

Mesma feature/m01-narrativa-demo, base0a0106e; sem merge ou início de M01-19. Revisão de integração:14 momentos ilustrados sem protagonista, entrada direta na cela, tesouros desaparecem por recibo e têm mínimo configurável5 ouro quando o sorteio não entrega nada, área de contato do Gate3×2 com migração de eventos antigos, caminhada nativa para16 identidades e ratos/goblins, arma em planos por pose. Localização em LOCALIZACAO_E_GLOSSARIO.md; Imperial Dungeons permanece no original no mapa/diário/árvore. Campos, fontes, prompts, versões, testes e limitações em REVISAO_INTEGRACAO_M01_18_R02.md e evidencias/m01-18-r02. Novas imagens/fluidez aguardam avaliação do responsável; autoria desta revisão no MV e Galaxy A56 físico não foram executados. Retratos/batalhas aprovados, bônus, recursos, loot de inimigos e melhorias futuras preservados. REF02 foi atendido tecnicamente por este pedido específico; sua avaliação integrada permanece M01-19. Registros anteriores são históricos quando divergirem.

## Estado vigente M01-18 — 28/10/2026

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

# Como usar esta documentação

## Estado operacional M01-14 — 26/10/2026

M01-13 integrado/publicado em develop4c612ae após revisão técnica e aprovação limitada ao menu; destaque de raros é melhoria futura não implementada. Feature/m01-dungeon-inicial entrega mapa8/tileset4, planta original50×50 adaptada3×3,14 portas, chave/Gate e pontos de integração. Navegação/colisões/save-load e comparação da planta testados. **M01-14 em validação, não concluído:** autoria/edição/salvar/reabrir do novo mapa no editor não confirmados por falhas da automação; avaliação de arte/escala do responsável e A56 separados. Ler DUNGEON_M01_14.md. Sem merge da nova feature, geração procedural, mapa-guia ou início de M01-15. Registros operacionais anteriores são históricos quando divergirem.

## Estado operacional — M01-13 (26/10/2026)

M01-12 concluído no escopo incremental aprovado, integrado/publicado em develop90e309b. Paleta, simplificação de uso de itens e design da confirmação permanecem melhorias futuras, sem implementação. Feature/m01-loot entrega M01-13 tecnicamente, sem renumeração, para revisão e sem merge. Implementação795d80d; testes/limites em evidencias/m01-13/fontes-testadas.json. Limite por origem individual já definido em LOOT.md: até uma peça por inimigo; agregação mantém origens. Tabelas wiki/provisórias, raridade substitutiva, reserva de capacidade, fonte de missão e ledger único descritos em LOOT_M01_13.md. Testes/capturas em evidencias/m01-13; editor/A56 e balanceamento final permanecem separados e pendentes. Não iniciar M01-14.

Registros abaixo são históricos quando divergirem deste estado operacional.


## Fechamento M01-12 — aprovação do responsável (26/10/2026)

Responsável aprovou inventário/equipamentos atuais, associados ao estado disponível6271f22, sem informar hash próprio, dispositivo ou lista de casos. A aprovação aceita a cobertura mínima de materiais existente para prosseguir; não transforma torso/material em figurinos completos nem comprova novos testes físicos/editor. Critérios funcionais revisados: arrasto/alternativas, troca/remoção sem perda, técnicas/atributos/aparência e save/load demonstrados nas evidências R01/R02. Validador estático/puro reexecutado com sucesso no fechamento; demais suítes identificadas são as execuções anteriores, sem alegar repetição. M01-12 concluído no escopo incremental aprovado, com ressalvas aceitas e não bloqueantes.

Melhorias futuras, não implementadas: reavaliar paleta; facilitar acesso/uso de itens reduzindo confirmações constantes; melhorar design da janela de confirmação. Preservar também favoritos futuros e limitações de cobertura artística registradas. Nova sessão visual no editor e Galaxy A56 físico continuam pendentes para validação integrada, sem atribuir à aprovação do responsável. Autorizada integração em develop e publicação; sem promover main/release.

Estado operacional M01-12: M01-11 integrado/publicado em develop6e59882 após aprovação do combate disponível em25672fe (ambiente/casos não detalhados). Feature/m01-inventario-equipamentos implementa inventário, troca/arrasto/prévia/remoção e aparência derivada mínima por couro/malha. M01-12 permanece em revisão, sem encerramento artístico; ler INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Favoritos são melhoria futura não implementada. Sem merge da nova feature ou avanço para M01-13; A56 físico/playtest visual NW.js pendentes.

Histórico M01-10 R02 (superado pelo estado operacional acima): M01-09 integrado/publicado em develop782ebc8; feature/m01-combate para revisão, sem merge automático. Ler REVISAO_COMBATE_M01_10_R02.md, COMBATE_M01_10.md (R01 histórico) e backlog. Somente Bretã feminina/rato possuem novos movimentos R02 e armas por camada;15 personagens/2 inimigos mantêm R01. M01-10 em validação, M01-11 não iniciado. P01–P08/retratos com ressalvas preservados; manual adiado.

Leia também `DIRETRIZES_DE_ADAPTACAO.md` para as decisões sobre IA, dark fantasy, base de dados e consulta a `doc/wiki/`. O arquivo `BASE_DO_PROJETO.md` reúne o contexto inicial, as decisões confirmadas, as propostas de escopo e as perguntas em aberto.

A documentação já está em `doc/` no repositório do jogo; mantenha-a sob Git. Também é possível adicioná-la como fonte do projeto no Codex. A cópia no repositório deve ser a referência de trabalho; mantenha as fontes adicionais atualizadas quando houver mudanças.

Consulte também DESENVOLVIMENTO_E_VERSIONAMENTO.md. A documentação deve acompanhar a implementação, e o Codex deve orientar branches e commits para separar funcionalidades.

A documentação é uma feature e deve ser consolidada antes de subir ao remoto. Consulte COMBATE.md para os requisitos de combate e DESENVOLVIMENTO_E_VERSIONAMENTO.md para a revisão do conjunto.

Consulte INTERFACE.md para os menus em slots e PLUGINS.md para os requisitos de documentação, dependências e reutilização dos plugins.

Consulte LOOT.md para o modelo de recompensas em seis slots independentes e a ocultação dos slots vazios.

Consulte QUESTS.md para o sistema de quests e a preservação das descrições originais no diário.

Regras ainda não especificadas seguem o padrão do RPG Maker MV 1.6.1. As decisões confirmadas do projeto prevalecem. As listas de pendências devem ser lidas à luz dessa diretriz: padrões aplicáveis não exigem nova aprovação; conteúdo e recursos específicos ainda precisam ser produzidos.

Antes de gerar qualquer asset visual, consultar DIRECAO_DE_ARTE.md e aplicar seu padrão de estilo, referências, prompts e validação por categoria.

Para gerar ou revisar personagens, é obrigatório seguir também `arte/PROCEDIMENTO_RETRATOS.md`: referências separadas de pose/identidade/estilo, bloco fixo de prompt e inspeção de cabeça, tronco, pescoço e olhar. Não aplicar a pose de retrato às folhas de exploração ou combate. Dimensões e alpha não comprovam anatomia correta.

Consulte GERACAO_DE_CENARIOS.md para a avaliação técnica de templates, geração em runtime e persistência de cenários; as recomendações ainda dependem de validação prática.

A instalação original em D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena também é fonte de consulta. Preservar seus arquivos e registrar evidências conforme DIRETRIZES_DE_ADAPTACAO.md.

Consultar HABILIDADES_E_PROGRESSAO.md para Stamina, técnicas vinculadas a armas e aprendizado de magias pela Mages Guild e livros. Itens importantes e respawn estão especificados em LOOT.md e QUESTS.md.

O escopo inicial inclui personagem único, quests principais e cidades e dungeons principais. A introdução e dungeon inicial são somente o primeiro marco. Consultar BASE_DO_PROJETO.md e QUESTS.md para separar o inventário da campanha das entregas incrementais.

Consultar CAMPANHA_PRINCIPAL.md, DEMO_INICIAL.md e ADAPTACAO_DE_MAGIAS.md para o inventário da wiki, entregas do marco e triagem de magias. O idioma inicial é pt-BR; testar mobile inicialmente no Samsung Galaxy A56. Regras de Stamina, camas e respawn foram refinadas nos documentos temáticos.

Seguir MARCOS_DO_PROJETO.md: uma quest principal por marco, da demo M01 ao encerramento da campanha em M10, dividindo a implementação em features sob Git Flow.

Consultar PERSONAGEM.md: nome, raça e gênero com assets predefinidos; progressão dos três recursos inspirada em Skyrim. A demo termina no Shift Gate, há técnicas leves/pesadas, coleta automática e recuperação de itens de missão por reativação de seus eventos.

Usar doc/wiki/ para dados da wiki e doc/prints/ para imagens de outros jogos que orientam a criação visual de mecânicas. Consultar DIRECAO_DE_ARTE.md para adaptar os exemplos sem alterar automaticamente o escopo.

PENDENCIAS_ATUAIS.md é o checklist operacional mais recente. Consultá-lo antes de usar listas históricas de revisão. O .gitignore está aplicado; a indicação antiga de feature/documentacao-inicial ativa era histórica. M01-07 R05 foi aprovado/integrado em develop; P01–P08 estão aplicadas e a arte aprovada com ressalvas. M01-08 segue em feature própria; verificar o estado real do Git a cada tarefa.

A verificação final em PENDENCIAS_ATUAIS.md confirma ausência de bloqueios de definição para começar o protótipo M01. Recursos opcionais ficam para próximos marcos. O trabalho restante é especificar, implementar, balancear e validar; não solicitar novamente decisões já confirmadas.

Para executar o primeiro marco, seguir BACKLOG_M01.md: concluir a baseline documental, especificar MQ01 e preparar a base executável antes de integrar os sistemas. Registrar evidências e estado de cada item; não marcar tarefas concluídas apenas pelo planejamento.

## Primeira tarefa sugerida

Texto para usar no Codex com a pasta do jogo aberta:

> Leia as instruções do repositório, doc/BASE_DO_PROJETO.md e doc/REVISAO_DE_PRONTIDAO.md, incluindo sua atualização de decisões. Siga o Git Flow descrito em doc/DESENVOLVIMENTO_E_VERSIONAMENTO.md. Detalhe as rotas de patrulha e o ciclo dos eventos de inimigos, além do plano mínimo de testes para navegador/mobile. O retorno após vitória segue o padrão do MV e a fuga fica desabilitada inicialmente. A exploração é em vista superior por grade, as batalhas começam por contato e a derrota leva a game over. Detalhe o primeiro marco, introdução e dungeon inicial, com personagem único e combate Side View por turnos, consultando as fontes originais. Use o diagnóstico existente como referência datada, revalidando apenas o necessário. Consolide a documentação antes de iniciar a implementação integrada.

## Informações para completar em seguida

- Pasta do projeto: `D:\RPG Maker MV\Projects\Arena`.
- Detalhar eventos e encerramento da introdução e dungeon inicial, preservando a história e os diálogos originais.
- Exploração 2D em vista superior, movimentação por grade, batalha por contato e game over após derrota estão confirmados. Inimigos patrulham, o retorno após vitória segue o padrão do MV e a fuga fica desabilitada inicialmente. Detalhar rotas e ciclo dos eventos de inimigos. O combate Side View por turnos e o personagem único estão confirmados; consultar COMBATE.md.
- Fontes da wiki em doc/wiki/ e referências visuais de mecânicas em doc/prints/. Selecionar os dados e exemplos necessários à primeira etapa; o estilo dark fantasy e a geração de assets por IA já estão confirmados.
- Navegador e mobile estão confirmados, com teclado e mouse priorizados inicialmente. Definir resolução, navegadores/dispositivos de teste e suporte ao toque. Intenção de distribuição permanece aberta.

Não é necessário decidir todos os sistemas futuros antes de começar. Priorize as escolhas que afetam a primeira experiência jogável.

## Prioridade explícita de fidelidade — atualização 25/10/2026

Arena é de 1994 e é executado neste ambiente por emulação DOS. Baixa definição é limitação da fonte, não justificativa para fantasia genérica. Priorizar a instalação original, seus arquivos/materiais e capturas do jogo para identidade visual, textos, quests, objetos e locais; wiki complementa interpretação e organização. Separar observação do executável, texto do manual, documentação técnica e informação da wiki. Quando divergirem, registrar versões/contexto/evidências e decisão explícita, sem escolher silenciosamente.

Melhorar definição/acabamento preservando silhuetas, materiais, cores características, arquitetura e função narrativa. Pixelização não é obrigatória. Detalhe ilegível permanece interpretação artística identificada, não fato confirmado. As adaptações já aprovadas de exploração 2D, turnos, interface e progressão continuam válidas. Referências de continuidade aprovadas em `arte/APROVACAO_DIRECAO_R02_R03.json`; não regenerar imagens adequadas sem necessidade concreta. Ilustrações narrativas sem protagonista, inclusive mãos, membros, silhueta, sombra/reflexo ou equipamento que fixe identidade. Revisar contexto/objetos ao implementar falas.

Preservar a instalação; consultas e extrações somente em área local ignorada, sem mods ou alterações no original. Não incorporar arquivos originais ao jogo distribuído. Relatórios e decisões podem ser versionados; exports de consulta não.
