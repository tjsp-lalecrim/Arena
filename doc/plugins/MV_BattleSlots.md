# MV_BattleSlots0.1.0

Núcleo próprio produzido pelo Codex, puro e reutilizável, sem MV, IDs Arena, assets, parâmetros ou plugins externos. Carregar antes de Arena_BattleUI. Não altera classes do motor ou saves.

- `grid(width,count,fixedWidth,gap,minWidth)` retorna x/largura por espaço, distribui quando fixedWidth=0 e rejeita medidas que não cabem. A altura pertence à apresentação.
- `unique(candidates)` devolve o único candidato ou null.
- `clampRatio(current,maximum)` limita a razão de uma barra a0–1; máximo0 resulta0, sem divisão por zero.

Teste puro em tools/validate-battle-ui.cjs:6/8 espaços, tamanho fixo, casos inválidos, zero/um/vários candidatos e razão nos limites. Executado em contexto sem Arena/MV; o consumidor concentra conteúdo e integração.
