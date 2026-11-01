# Arena_Ghoul0.1.0

Adaptador de um piloto de batalha, após Arena_DebugHub e os núcleos de Stonekeep, Continuation, Battle/BattleMotion, Resources, Abilities e Loot. Sem dependências externas. [Configuração, fontes, valores e limites](../GHOUL_M02.md) são a fonte principal.

Carrega ArenaGhoul.json e valida vínculos de Enemy5/Troop6/perfil/loot. `startLab()` agenda a chegada pela fixture RAM existente; Scene_Map.start prepara uma única batalha nativa após a transferência. Limpa a pendência antes de iniciar, evitando repetição no retorno. Não concede recursos, itens ou EXP por consumidor novo; o preparo vem de ArenaBattle e as recompensas do núcleo único de Loot. Não registra área/inimigo de mapa, persistência nova ou schema.

Registra `arenaGhoul` por **ArenaDebugHub.register**, categoria combat, sem wrappers de título. `enabled:false` do hub impede sua exposição, incluindo pacote de jogador. Manter o plugin depois de Arena_DebugHub na lista canônica; nomes, ordem, status e parâmetros dos registros anteriores intactos. Nenhum arquivo interno do motor modificado.

Build: tools/build-stonekeep-ghoul.cjs, também chamado pelo pai Stonekeep/Rihad. Exportação e24 quadros em doc/arte/ghoul-v01; EXP/drop0 sinalizados como **somente laboratório**, não configuração aprovada para ilha/campanha. Doença e outras regras ausentes explicitamente, sem fallback silencioso.
