# Arena_RiaVision v0.1.0

Após Arena_Rihad/Arena_Narrative0.3/Arena_Recovery/MV_StateStore. Sem parâmetros ou dependência externa. Conteúdo principal em `data/ArenaRiaVision.json`, schema1, oito IDs estáveis. [Texto/fontes/roteiro](../VISAO_RIA_M02_03C.md).

Envolve somente `ArenaRecovery.usePoint`: após resultado de recuperação válida ou recursos completos, o ponto MQ02.rihad.rest pode iniciar leitura se campanha/MQ02=10/nível≥2/Map009/fora de batalha. Nível1 não consome operação. Não envolve restAt, poções, descanso da prisão ou regeneração. Não concede recursos; só preview prepara estado sintético explicitamente pedido no título.

Estado em `arenaMQ02Narrative` v1: phase idle/reading/complete, section/word/history; operações MQ02.ria.begin/complete. Defaults aditivos; save raiz/web não troca versão/namespace. Leitura validada antes de extractSaveContents; falha lança diagnóstico ao carregador existente, que pode retornar de forma recuperável sem escrever sobre o slot. Cursor inválido não é reiniciado silenciosamente. Preservar IDs/ordem do conteúdo; revisão que altere posições exige avaliar migração, não criar outro namespace por build.

API: state/active/eligible (consulta), begin/finish (adaptador do evento/cena), preview (somente laboratório existente). finish registra estado e quest em operação síncrona com rollback do root se falhar; não chama recompensas/recuperação. Consulta do informante existente avança20→30 somente quando uma orientação é realmente apresentada; repetir não regride ou reaplica etapa.

ArenaNarrative.registerChapterSequence aceita **um provedor**, consumidor concreto MQ02: active/read/write/sections/finish. Reaproveita a cena, paginação, imagem/controles e fence; não clona o plugin nem muda a API pública state(), que continua retornando MQ01. Layout sem cabeçalho/salvar/RAM só no provedor ativo; M01 conserva suas seções, layout e schema v2. Não é catálogo geral de eventos narrativos.

Retomada: o roteamento de Scene_Load/Scene_Map existente consulta a sequência ativa. Salvar nativo no rodapé em campanha; Guardar/Carregar RAM na fixture. Se carregar checkpoint anterior à leitura, volta ao mapa em vez de mostrar o fim M01. Depois de finish, retorna ao mesmo mapa/posição e exige soltura, sem interação herdada. Nada inicializa Ria no load por mero nível2.

Teste focal: tools/test-ria-vision.cjs, Chrome/perfil/origem descartáveis, fixture nível1/nível2, RAM e slot nativo15 sintético. Sem batalhas, saves pessoais, serviços externos ou validação física/editor implícita. Evidências próprias em doc/evidencias/m02-03c; anteriores preservadas.
