# Arena_Encounters0.1.0 e MV_EncounterRules0.1.0

Codex; sem dependências externas. Ordem: MV_StateStore/Arena_Persistence, recursos/habilidades/combate/movimentos/UI/inventário/loot, Arena_Dungeon, MV_EncounterRules, Arena_Encounters. Mantém os consumidores originais de custos e recompensas. Sem parâmetros no gerenciador; dados em `data/ArenaEncounters.json`.

MV_EncounterRules é núcleo puro, sem IDs Arena: `directions(tick)` ordena quatro direções, `within(x,y,origin,radius)` limita a patrulha, `exit(area,enemies)` devolve cópia com saída/geração/derrotas atualizadas. Não lê ou modifica o MV. Testes puros junto de `tools/validate-encounters.cjs`.

Arena_Encounters adapta eventos nativos/Scene_Battle/transferência e renderiza perfis existentes. API: `start(id)` retorna boolean, revalida estado/cena/contato e trava o início; `sync()` preenche defaults/eventos ausentes e aplica derrota; `completeArea()` assinala conclusão **de área**, nunca de quest; `onExit()` é chamado pelo hook de transferência para outro mapa, não chamar por reentrada ou por carregar; `startLab()` cria contexto técnico explícito.

Config schema1: mapId, areaId, completionQuestId, entries. Entrada: id estável, eventId nativo, enemyId visual, troopId, origin[x,y], sourceFlat(proveniência interpretada), questSpecific, radius, interval, regions permitidas, scale visual. Não renumerar IDs existentes em saves. Não configurar regiões sólidas/água para contornar colisões. Novas tropas/perfis devem existir; a cobertura atual é rato/goblin. `build-encounters.cjs` recria somente169–235 a partir dos marcadores; preserve edições autorais na origem antes de recompilar.

Persistência: contracts `enemies/areas` de Arena_Persistence, sem novo namespace; posição/tick nativos, trava em Game_Temp não salva. Migração preenche os eventos de saves anteriores antes dos sprites. Vitória não cura nem reequipa; recompensa continua Arena_Loot. Quest-specific excluído do respawn comum. Sem encontros aleatórios, perseguição, respawn por tempo ou fuga.

Apresentação: usa idle aprovado de ArenaBattleMotion em Sprite_Character, com ground e escala próprios. Perfis laterais no mapa são adaptação explícita, não caminhada superior de quatro direções. Animações e assets de batalha não são reescritos.

Ver `../ENCONTROS_M01_15.md` para roteiro, fontes, testes, cobertura e pendências.


## R02 vigente — v0.2

mapVisuals[enemyId]: file($ folha única), cell[64,64], ground62, animationWait10. Rato acrescenta groundByDirection8=52 para compensar a cauda em10px. Cada evento usa imagem nativa por direção/padrão, walkAnime=true, stepAnime=false, scale1. Cadência percorre as três poses durante um passo em velocidade3; pausa mostra repouso. Sync também reconstrói imagens de saves antigos. Sem fallback para atlas de espera da batalha. Colisão, raio, intervalo90, encontros, loot e respawn preservados. Fonte de configuração/geração: build-encounters.cjs; arquivos e prompts em arte/m01-integracao-r02/.
