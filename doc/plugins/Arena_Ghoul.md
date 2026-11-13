# Arena_Ghoul0.2.1

Configura seis encontros da ilha/eventos10–15 com Arena_Encounters e um segundo acesso RAM por ArenaDebugHub.register (`arenaGhoulPatrol`), sem comando novo no título. `startPatrolLab()` prepara a chegada(40,60); `startLab()` preserva a batalha direta antiga. Pendência de lançamento é limpa antes de iniciar/transferir; o retorno não prepara outra batalha nem restaura recursos.

EXP75/tabela de campanha são explícitas em ArenaGhoul.json; a flag transitória `_arenaGhoulBattlePilot` na instância de Game_Enemy mantém somente o piloto antigo em0 EXP/loot. Usa `ArenaLoot.tableForEnemy` para selecionar a tabela vazia sem mutação global ou outro concessor. Atores, custos e recibos permanecem nos núcleos existentes. Sem doença, schema ou namespace novo. [Fontes, valores provisórios, caminhada e testes](../GHOUL_M02.md).

`ArenaGhoul.json` mantém `encounter` para o piloto e `additionalEncounters` para as cinco posições declaradas restantes. Todos usam Enemy5/Troop6, caminhada e recompensas do mesmo exemplar; IDs estáveis e estados independentes no núcleo de encontros. O gerador valida duplicidade de ID/evento/origem e piso permitido, preservando os sete esqueletos. O acesso reconhecível do hub permanece o mesmo; não existem seis laboratórios nem concessor adicional. Evidências focais em GHOUL_M02.md.

## Histórico — versão0.1 / somente batalha

Adaptador de um piloto de batalha, após Arena_DebugHub e os núcleos de Stonekeep, Continuation, Battle/BattleMotion, Resources, Abilities e Loot. Sem dependências externas. [Configuração, fontes, valores e limites](../GHOUL_M02.md) são a fonte principal.

Carrega ArenaGhoul.json e valida vínculos de Enemy5/Troop6/perfil/loot. `startLab()` agenda a chegada pela fixture RAM existente; Scene_Map.start prepara uma única batalha nativa após a transferência. Limpa a pendência antes de iniciar, evitando repetição no retorno. Não concede recursos, itens ou EXP por consumidor novo; o preparo vem de ArenaBattle e as recompensas do núcleo único de Loot. Não registra área/inimigo de mapa, persistência nova ou schema.

Registra `arenaGhoul` por **ArenaDebugHub.register**, categoria combat, sem wrappers de título. `enabled:false` do hub impede sua exposição, incluindo pacote de jogador. Manter o plugin depois de Arena_DebugHub na lista canônica; nomes, ordem, status e parâmetros dos registros anteriores intactos. Nenhum arquivo interno do motor modificado.

Build: tools/build-stonekeep-ghoul.cjs, também chamado pelo pai Stonekeep/Rihad. Exportação e24 quadros em doc/arte/ghoul-v01; EXP/drop0 sinalizados como **somente laboratório**, não configuração aprovada para ilha/campanha. Doença e outras regras ausentes explicitamente, sem fallback silencioso.
