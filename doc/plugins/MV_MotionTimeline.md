# MV_MotionTimeline0.1.0

Núcleo próprio e puro, sem IDs, dados Arena, motor ou plugins externos. Carregar antes do consumidor Arena_BattleMotion. Sem parâmetros de editor, comandos ou estado persistente. API global MVMotionTimeline.

Contrato motion: frames não vazios com rect[x,y,w,h] em pixels inteiros válidos e duration inteira positiva, loop booleano, impact índice opcional (null para ausência). validate(m) rejeita campos inválidos, inclusive impacto em loop ou fora dos quadros. duration(m) soma tempos; impactTick(m) retorna início do quadro de impacto; sample(m,tick) retorna índice/frame/total/done para relógio não negativo; advance(m,tick,released) avança uma atualização, limitando ao impacto até liberação. Quantidade de quadros/durações independentes por movimento.

Unidade: atualização MV,60Hz ideais. O núcleo não chama efeitos, cobra recursos ou move sprites. O consumidor aguarda a amostra realmente exibida; relógio incrementado representa o próximo quadro. Configuração alternativa de quatro quadros, durações2/3/4/2, hold/release, loop/completion e rejeições em tools/test-motion-timeline.cjs demonstra reutilização sem Arena/MV.
