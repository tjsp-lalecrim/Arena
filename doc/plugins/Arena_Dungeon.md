# Arena_Dungeon0.1.0

Plugin Codex após Arena_Loot. Dependências reais: ArenaCharacterCreation (identidade e piloto técnico), DataManager.setupNewGame e mapas/eventos/salvamento nativos. Nenhum plugin externo, decoder ou dado binário do Arena distribuído. Configuração IDs/pontos/portas em data/ArenaDungeon.json; sem parâmetros/comandos de gerenciador. Layout compilado offline em Map008/Tileset4.

API enter(): transfere personagem criado à entrada, fora de batalha; startLab(): nova partida técnica/piloto, não alterar fluxo da campanha; openDoor(id): somente mapa8, revalida ID e ativa A nas9 partes nativas, repetição idempotente; leave(): retorna ao laboratório configurado, sem resets/concessões. enter/leave reservam transferência nativa, não movem personagem em batalha.

Integra título e comandos originais do menu para entrar/retornar. Não altera motor, movimento/colisão, atores, recursos, combate, loot ou schema de saves. Porta técnica sem chave/quest; mapa sem encontros aleatórios/contato. Self-switches nativos persistem as portas. Integrações futuras usam config.integration: tesouros, marcadores de inimigos, plataformas, ponto de Ria. Não são funcionalidades de M01-15/16/17/18 implementadas.

Roteiro, fontes, dimensões, art prompts, divergências e validações em DUNGEON_M01_14.md. M01-14 permanece em validação: editor novo mapa não confirmado por falha da automação; navegador não substitui autoria. Sem mapa-guia, bússola ou geração procedural em runtime.
