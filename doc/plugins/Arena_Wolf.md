# Arena_Wolf0.2.0 — quatro encontros e dois acessos isolados

`ArenaWolf.json.encounter` preserva o piloto e `additionalEncounters` acrescenta eventos20–22/Map012(114,54),(99,54),(96,54), todos Enemy6/Troop7; `walk` usa o sprite64px direcional novo. `campaign.loot` contém tabela vazia por incerteza e `enemy.exp=25` é provisório. Instância `_arenaWolfBattlePilot` mantém0EXP/loot pela consulta contextual, sem trocar configurações globais. Os demais inimigos delegam às funções anteriores.

`startPatrolLab()` reutiliza a fixture de materiais, aguarda Map012, limpa pendência, posiciona94,46 e prepara recursos sem iniciar batalha. `startLab()` preserva a batalha direta e sua flag. Ambos usam isolamento RAM existente. Novo registro `arenaWolfPatrol`: **Stonekeep · lobo na passagem (RAM)**, em Campanha e mapas; registro anterior/controles do hub preservados.

Gerador mantém eventos/entradas alheias e quatro IDs estáveis, rejeitando IDs/eventos/origens duplicados. Patrulha/contato/derrota/respawn/persistência pertencem a Arena_Encounters; custos e recibos continuam nos núcleos existentes. Nenhum segundo consumidor ou schema/namespace novo. Fontes, aprovação recebida e verificações atuais em [LOBO_M02.md](../LOBO_M02.md).

## Histórico — versão0.1 somente batalha

# Arena_Wolf0.1.0

Piloto de batalha do lobo comum, após Arena_DebugHub, Arena_Stonekeep e núcleos existentes de batalha/movimentos/ações/recursos/loot/continuidade. Sem dependências externas. Dados **ArenaWolf.json**, perfil **doc/arte/wolf-v01/profile.json**. Fonte principal de identidade/configuração/cobertura: [LOBO_M02.md](../LOBO_M02.md).

`ArenaWolf.startLab()` reutiliza `ArenaStonekeep.previewMaterials()`; aguarda Map012 ativo, limpa a pendência, prepara a fixture por `ArenaBattle.prepare(12)` e inicia Troop7 nativamente, sem fuga/canLose. Marca a instância `_arenaWolfBattlePilot`; a seleção de tabela só devolve `labLoot` nessa instância. `campaign=null` e uso fora da fixture sem configuração são erros explícitos. EXP0 no banco é laboratório, não regra de campanha. Outros inimigos delegam a `ArenaLoot.tableForEnemy` anterior. Nenhuma cobrança/concessão paralela, evento de mapa, perseguição ou estado persistente novo.

Registro central `arenaWolf`, **Stonekeep · lobo (RAM)**, categoria Combate. Config `enabled` do hub continua controlando exposição; pacote jogador desabilitado por padrão, sem depender de localhost. Repetir começa sessão isolada nova; saves normais bloqueados pelo contrato RAM. Vitória retorna à posição técnica80,39; derrota usa game over. Não existe fallback para substituir animação ausente; perfil exporta5/6/6/6 quadros reais (um desenho de espera cortado excluído explicitamente).

Origem: `tools/build-stonekeep-wolf.cjs`, sem alteração de mapas ou registros anteriores; chamado pelo pai para reconstrução estável. Exportador preserva mestre, usa escala única/alfa/apoio e registra recortes/hashes. Verificação focal em `tools/test-stonekeep-wolf.cjs` e evidências no guia. Não habilitar campanha sem configuração/recompensas e integração próprias.
