# Arena_Skeleton0.3.0

Passagem expandida sobre d800a8f: `encounter` preserva o piloto01/evento3 e `additionalEncounters` acrescenta seis IDs distintos. Fonte das posições e limites em [SKELETON_M02.md](../SKELETON_M02.md). Gerador publica as sete entradas no perfil da área; núcleo compartilhado de encontros intacto. `legacyPatrol` descreve somente a antiga posição representativa do piloto: onMapLoaded reposiciona uma instância viva salva naquele raio, mantendo ID, derrotas e recibos. Não revive derrotados nem concede recursos/prêmios. `startPatrolLab()` usa o mesmo hub/fixture em(69,21); nenhum acesso novo.

## Histórico — versão0.2 / um exemplar

Atualização sobre f198987: `startPatrolLab()` prepara a chegada RAM(80,39), sem iniciar batalha automaticamente. `startLab()` mantém batalha direta com0 EXP usando flag da instância `Game_Enemy`; inimigo de campanha continua com50 EXP provisórios. Ambos reutilizam preparo existente, sem alterar saves normais. O encontro único é configurado em `ArenaSkeleton.json` e gerado no evento3/área stonekeep de ArenaCampaign; patrulha, contato, lock, derrota e respawn pertencem a Arena_Encounters/MV_EncounterRules. Caminhada nativa3×4, diferente do atlas de batalha. Não há schema/namespace novo. Fontes, aprovação parcial e testes vigentes em [SKELETON_M02.md](../SKELETON_M02.md).

## Histórico — API0.1 e piloto de batalha

Consumidor delimitado de Battle/BattleMotion, Resources, Abilities, Loot e laboratório de Continuation/Stonekeep, carregado depois deles. Sem plugin externo. Configuração ArenaSkeleton.json; [fontes, valores provisórios e limites](../SKELETON_M02.md) são a fonte principal desta unidade.

`resistanceRate(action,target)` retorna1 ou o fator configurado, apenas para Enemy4, dano físico de Vida, sujeito ator com tipo de arma autorizado e Atacar/técnica compatível cadastrada em ArenaAbilities. Não usa apenas o nome da técnica. O wrapper de makeDamageValue só multiplica dano final positivo, preservando críticos/variação/defesa nativos antes do fator; não cobra Mana/Vigor nem altera fórmula/elementos/estado global. Boot valida inimigo/tropa/perfil/loot e0<fator≤1, sem default silencioso/imunidade.

`startLab()` usa ArenaStonekeep.previewMaterials, aguarda transferência assíncrona e inicia uma única batalha nativa na passagem. Recurso/itens de teste vêm do preparo existente. ArenaBattle.prepare recebe agora um mapId opcional **somente quando ArenaContinuation.labActive()**; sem argumento preserva exatamente o caminho técnico antigo, fora do laboratório o parâmetro não autoriza preparo em outro mapa. Não duplicado concessor/consumidor. Gravação normal permanece bloqueada pelo contrato RAM existente.

Enemy4/Troop5 e os dois perfis são recompostos por build-stonekeep-skeleton.cjs; exp/drop vazio é exclusivo do piloto e precisa de configuração antes de integrar à campanha. Nenhum evento ou sprite de mapa adicionado. Dados do ator/recursos/loot continuam no estado nativo/contratos existentes, sem schema ou namespace de save novo. `js/plugins.js` mantém o formato canônico MV e só acrescenta Arena_Skeleton à ordem existente.
