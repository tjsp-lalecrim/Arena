# Arena_Wolf0.1.0

Piloto de batalha do lobo comum, após Arena_DebugHub, Arena_Stonekeep e núcleos existentes de batalha/movimentos/ações/recursos/loot/continuidade. Sem dependências externas. Dados **ArenaWolf.json**, perfil **doc/arte/wolf-v01/profile.json**. Fonte principal de identidade/configuração/cobertura: [LOBO_M02.md](../LOBO_M02.md).

`ArenaWolf.startLab()` reutiliza `ArenaStonekeep.previewMaterials()`; aguarda Map012 ativo, limpa a pendência, prepara a fixture por `ArenaBattle.prepare(12)` e inicia Troop7 nativamente, sem fuga/canLose. Marca a instância `_arenaWolfBattlePilot`; a seleção de tabela só devolve `labLoot` nessa instância. `campaign=null` e uso fora da fixture sem configuração são erros explícitos. EXP0 no banco é laboratório, não regra de campanha. Outros inimigos delegam a `ArenaLoot.tableForEnemy` anterior. Nenhuma cobrança/concessão paralela, evento de mapa, perseguição ou estado persistente novo.

Registro central `arenaWolf`, **Stonekeep · lobo (RAM)**, categoria Combate. Config `enabled` do hub continua controlando exposição; pacote jogador desabilitado por padrão, sem depender de localhost. Repetir começa sessão isolada nova; saves normais bloqueados pelo contrato RAM. Vitória retorna à posição técnica80,39; derrota usa game over. Não existe fallback para substituir animação ausente; perfil exporta5/6/6/6 quadros reais (um desenho de espera cortado excluído explicitamente).

Origem: `tools/build-stonekeep-wolf.cjs`, sem alteração de mapas ou registros anteriores; chamado pelo pai para reconstrução estável. Exportador preserva mestre, usa escala única/alfa/apoio e registra recortes/hashes. Verificação focal em `tools/test-stonekeep-wolf.cjs` e evidências no guia. Não habilitar campanha sem configuração/recompensas e integração próprias.
