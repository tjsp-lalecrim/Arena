# Arena_Skeleton0.1.0

Consumidor delimitado de Battle/BattleMotion, Resources, Abilities, Loot e laboratório de Continuation/Stonekeep, carregado depois deles. Sem plugin externo. Configuração ArenaSkeleton.json; [fontes, valores provisórios e limites](../SKELETON_M02.md) são a fonte principal desta unidade.

`resistanceRate(action,target)` retorna1 ou o fator configurado, apenas para Enemy4, dano físico de Vida, sujeito ator com tipo de arma autorizado e Atacar/técnica compatível cadastrada em ArenaAbilities. Não usa apenas o nome da técnica. O wrapper de makeDamageValue só multiplica dano final positivo, preservando críticos/variação/defesa nativos antes do fator; não cobra Mana/Vigor nem altera fórmula/elementos/estado global. Boot valida inimigo/tropa/perfil/loot e0<fator≤1, sem default silencioso/imunidade.

`startLab()` usa ArenaStonekeep.previewMaterials, aguarda transferência assíncrona e inicia uma única batalha nativa na passagem. Recurso/itens de teste vêm do preparo existente. ArenaBattle.prepare recebe agora um mapId opcional **somente quando ArenaContinuation.labActive()**; sem argumento preserva exatamente o caminho técnico antigo, fora do laboratório o parâmetro não autoriza preparo em outro mapa. Não duplicado concessor/consumidor. Gravação normal permanece bloqueada pelo contrato RAM existente.

Enemy4/Troop5 e os dois perfis são recompostos por build-stonekeep-skeleton.cjs; exp/drop vazio é exclusivo do piloto e precisa de configuração antes de integrar à campanha. Nenhum evento ou sprite de mapa adicionado. Dados do ator/recursos/loot continuam no estado nativo/contratos existentes, sem schema ou namespace de save novo. `js/plugins.js` mantém o formato canônico MV e só acrescenta Arena_Skeleton à ordem existente.
