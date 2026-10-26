# MV_ResourceProgression 0.1.0

Arquivo `js/plugins/MV_ResourceProgression.js`, Codex. Núcleo puro reutilizável, sem IDs/estado do MV, plugins externos, parâmetros ou efeitos de save. Instalar antes de Arena_Resources. API: `clamp(valor,máximo)` trunca inteiro e limita0..máximo; `growth(choices,resourceId)` soma os valores registrados para o recurso; `pending(baseline,level,choices)` lista números de níveis acima da baseline sem escolha registrada. Consumidor valida configuração e controla recursos/nível. Não infere XP, cura, raça ou modificadores.

Exemplo independente: `growth({'2':{resourceId:'energy',amount:7}},'energy')` retorna7; `pending(1,4,{'2':{resourceId:'energy',amount:7}})` retorna[3,4]. Testado pelo cenário Chrome MV1.6.1 e validador de configuração M01-08. Não altera classes nativas ou outros projetos por carregamento isolado.
