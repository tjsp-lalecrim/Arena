# MV_LootRules0.1.0

Núcleo puro produzido pelo Codex, sem IDs/banco/MV/estado/arte/dependências externas. API MVLootRules.roll(table,rng?): RNG retorna0≤n<1, padrão Math.random; retorna rows/candidates/equipment sem mutar tabela. Config por origem, gold, potions, gearChance, equipment, weapons, rare. Entradas {kind,id,weight}, quantidades min/max; chance[0,1]. Consumidor valida contratos/IDs. Concorre arma/armadura após gate de equipamento, escolhe um candidato, quantidade de equipamento sempre1; rare.variants substitui referência, nunca cria segunda peça. rare.items é pool não equipável. Categorias independentes não equipáveis não dependem de equipamento. Sem parâmetros/comandos do gerenciador.

Carregar antes de Arena_Loot. Pesos/chances/valores específicos em ArenaLoot.json, não neste núcleo. Validação24 matrizes e casos arma/armadura/raridade em validate-loot.cjs. Contratos/fontes/limites em LOOT_M01_13.md.
