# Arena_Dungeon0.2.0 — R02

Estado vigente27/10/2026: ler `../DUNGEON_M01_14_R02.md`. Base gráfica/estrutura4161615 aprovadas; variantes novas ainda em avaliação. Dependências anteriores preservadas. Configuração `schemaVersion:2`, `swimming:{enabled:true,regionId:2,autotileKind:0,depth:24,offsetY:10}`, `doorAnimationFrames:24` e `treasurePreviewOnly:true` em ArenaDungeon.json. Nenhum consumo de Vigor, Mana, itens ou recompensa foi acrescentado.

`openDoor(id)`, `closeDoor(id)` e `toggleDoor(id)` revalidam mapa/ID/transição. Retorno true significa estado já solicitado ou início aceito; abertura termina após24 atualizações e ativa A nas9 partes. Fechamento bloqueia a seção no início, recusa envelope3×3 ocupado e termina no quadro fechado. Repetição durante animação retorna false, sem alternar novamente. Vista escolhida pelo eixo/lado de acesso fica no Game_Event. `isSwimming()` é informação derivada; somente mapa configurado, a pé, região marcada. Passabilidade continua nativa, com restrição adicional para A1 não marcado/desabilitado. Sem alterações em Game_Vehicle ou outros mapas. Profundidade usa divisão nativa de bush; ondulação própria e offset só na apresentação do jogador nadando.

`inspectTreasure(index)` cicla3 aparências **de prévia**, com mensagem explícita e sem concessão. `_arenaTreasurePreview`, `_arenaDoorTransitions` e `_arenaDungeonRevision` são dados serializados do Game_Map; posição, imagens e self-switches nativos permanecem fontes de verdade. Saves R01 reconstruem eventos ao carregar; os primeiros126 IDs das portas permanecem estáveis. Referências gráficas antigas são retiradas antes de atualizar a cena e reconstruídas de Map008 atual. Personagem/recursos/inventário não são reinicializados. Não equivale à migração de quests ainda não implementadas.

Assets de eventos próprios com `!$`, células144×96/48×48/96×32; água A1 nativa. `build-dungeon-objects.py` e `build-dungeon-map.py` são empacotador e compilador offline de fonte fixa. Parâmetros configuráveis no JSON, não IDs espalhados na lógica. Não alterar js/plugins.js: registro existente e formato canônico preservados.

## Registro histórico0.1.0 — substituído acima

Plugin Codex após Arena_Loot. Dependências reais: ArenaCharacterCreation (identidade e piloto técnico), DataManager.setupNewGame e mapas/eventos/salvamento nativos. Nenhum plugin externo, decoder ou dado binário do Arena distribuído. Configuração IDs/pontos/portas em data/ArenaDungeon.json; sem parâmetros/comandos de gerenciador. Layout compilado offline em Map008/Tileset4.

API enter(): transfere personagem criado à entrada, fora de batalha; startLab(): nova partida técnica/piloto, não alterar fluxo da campanha; openDoor(id): somente mapa8, revalida ID e ativa A nas9 partes nativas, repetição idempotente; leave(): retorna ao laboratório configurado, sem resets/concessões. enter/leave reservam transferência nativa, não movem personagem em batalha.

Integra título e comandos originais do menu para entrar/retornar. Não altera motor, movimento/colisão, atores, recursos, combate, loot ou schema de saves. Porta técnica sem chave/quest; mapa sem encontros aleatórios/contato. Self-switches nativos persistem as portas. Integrações futuras usam config.integration: tesouros, marcadores de inimigos, plataformas, ponto de Ria. Não são funcionalidades de M01-15/16/17/18 implementadas.

Roteiro, fontes, dimensões, art prompts, divergências e validações em DUNGEON_M01_14.md. M01-14 permanece em validação: editor novo mapa não confirmado por falha da automação; navegador não substitui autoria. Sem mapa-guia, bússola ou geração procedural em runtime.
