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
