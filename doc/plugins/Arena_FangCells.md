# Arena_FangCells 0.10.0

Os montes das alas secas usam o mesmo evento e recibo dos tesouros das celas, com posições geradas pela matriz. Saves anteriores recebem os eventos novos no Map013 sem mudar a posição. [Cobertura dos tesouros](../FANG_CELAS_M02_06A.md#tesouros-das-alas-secas--primeiro-nível).

As celas opcionais reutilizam chaves, portas e tesouros da campanha. A chave de latão é o item 10. As portas têm self-switch A próprio e os quatro montes são reconciliados pelo recibo `container/<id>`. [Fontes e roteiro](../FANG_CELAS_M02_06A.md#celas-opcionais-de-tesouro--primeiro-nível).

A cobertura de Map013 e Map017 é gerada pela matriz `doc/mapas/FANG_COBERTURA_M02.json`. A ampliação de Map017 traduz os saves anteriores em (+9,+51) antes de recarregar o mapa, preservando os IDs de eventos da quest. [Cobertura](../FANG_CELAS_M02_06A.md#alas-secas-dos-dois-níveis--m02-06b-e-m02-07b).

`leave` usa a posse do fragmento para interceptar a saída na etapa 100. `finishTharnVision` registra a leitura após a última página e inicia o encontro. Saves com a leitura registrada entram diretamente pela saída. O callback nativo de vitória avança 100 → 110 e conclui a quest; a próxima interação libera Rihad. O esqueleto reutilizado mantém combate e recompensas existentes. [Retaliação](../FANG_CELAS_M02_06A.md#retaliação-de-jagar-tharn--m02-08).

`takeStaffPiece` valida a porta, a etapa e a fonte. A coleta vincula o item importante 9 à etapa 100 e reusa a mensagem em largura integral. A fonte mantém o ID de evento ao expandir Map017. [Sala e fragmento](../FANG_CELAS_M02_06A.md#sala-e-primeiro-fragmento--m02-07b-trecho-de-campanha).

A escada conecta Map013 e Map017. `lowerRiddle/lowerAnswer` usam a etapa 80 e o recibo anterior como precondições. A etapa 90 e `fangLowerExplored` determinam abertura, colisão e página da porta. [Segundo nível](../FANG_CELAS_M02_06A.md#segundo-nível-até-o-enigma--m02-07a).

`offerTravel/travel` ligam o portão de Rihad ao Map013 após validar o recibo. O mapa mantém os IDs da amostra, com recarga no portão da mina para snapshots antigos. As páginas das aranhas usam self-switch B derivado de `fangSpidersReleased`. O perfil de encontros usa os quatro IDs existentes e o exemplar de Stonekeep. [Contrato e teste](../FANG_CELAS_M02_06A.md#entrada-e-celas-na-campanha--m02-06b-primeiro-trecho).

## Histórico da amostra 0.1.0

Núcleo focal de M02-06A; [fontes, mapa, limites e roteiro](../FANG_CELAS_M02_06A.md). Após Arena_DebugHub, Arena_CourtDelivery/Court/Continuation, Arena_CampaignConfig, Arena_Persistence/Quests/QuestJournal. Sem biblioteca externa ou alterações do motor.

Configuração `data/ArenaFangCells.json`, geometria `doc/mapas/FANG_CELAS_M02.json`; Map013, Tileset4 e portas existentes provisórios. Reconstruir via `node tools/build-fang-cells.cjs` ou pelo gerador de Rihad, que o chama ao final sem apagar conteúdo posterior. Não gerar conteúdo de campanha a partir de extrações ignoradas: a planta recortada e as âncoras conferidas estão versionadas.

`preview()` registra acesso centralizado ao hub, sessão RAM pela fixture existente de entrega; não cria slots ou modifica namespace. `interact/answer/takeKey/openPortal/limit/leave` exigem contexto de evento/mapa, proximidade, personagem de campanha, etapa elegível com recibo do pergaminho e ausência de batalha. Escolhas nativas e fence de soltura reutilizam Court; mensagem encerrada limpa destino e impede acionamento imediato. `sync/gateOpen` derivam páginas/colisão do estado da quest/recibo, não de switches como segunda fonte de verdade. Collider3×3 centrado na célula lógica; arte144px apoiada uma linha abaixo do centro. Exclusivo de Map013, sem alterar veículos/outros mapas.

Persistência existente: MQ02.objectives `fangCellsSolved`, `fangSpidersReleased`, `fangKeyFound`, `fangPortalOpened`; chave8 e fonte `fang.cell2.key`; recibo `MQ02.fang.lower-door`. Transações protegem estado/inventário com rollback; consumo+recibo+etapa síncronos. Nenhuma migração de formato ou IDs antigos. A amostra original só sinalizava a liberação das aranhas. O trecho de campanha passou a vinculá-las a encontros persistentes.

HTTP: URL de Items revisada para `Items.json?arena-data=fang-staff-piece-v1`, seguindo a correção prévia de Stonekeep para dados antigos em cache. Identifica a revisão do cadastro, não uma nova versão/namespace de saves; editor continua `Items.json`. Validação bloqueia inicialização se vínculos de mapa/fonte/recibo/item importante forem inválidos.

Teste focal: `node tools/test-fang-cells.cjs` (Playwright/Chrome instalados). Origem e perfil isolados, com saves sintéticos. O cenário entra pela campanha a partir de uma fixture de entrega do pergaminho. Verificações e evidências no documento principal.

## Acesso inferior ao Fantasma

[Contrato, fontes, limitações e acesso de teste](../FANG_CELAS_M02_06A.md#acesso-inferior-à-câmara-do-fantasma--26112026). `tools/fang-ghost-access.cjs` valida a cadeia FLOR12 e compila máscaras locais3×3 de passagem com1tile livre, mantendo laterais fechadas. O marcador `t` da matriz não é uma célula inteira de piso. Região5 é o corredor inferior;4 é a câmara/piso comum. A patrulha permanece em4. O gerador conserva paredes como `arenaGhostPassage.overheadTiles`; o runtime usa sobreposição local com opacidade48/255 somente dentro da faixa, seguindo o método do corredor seco de Stonekeep. Não altera flags globais, motor ou mobilidade.

Evento601/IDlógico `fang.1.enemy.mif3.49` usa os núcleos de encontros/loot existentes. A sincronização já aditiva recupera o evento em saves anteriores e respeita a derrota persistida. A opção de inspeção só aparece no menu de Map013 em sessão RAM e debug habilitado; reutiliza o laboratório das celas e os seus limites, sem novo acesso no título. Namespace e regras dos enigmas/fragmento/Tharn preservados. Reconstrução canônica continua `node tools/build-rihad-arrival.cjs`.

## Ramos inferiores oeste/sul

Contrato delimitado `doc/mapas/FANG_OESTE_SUL_M02.json`: quatro cadeias unidas à rota do Fantasma, com máscaras somadas nos cruzamentos. O gerador rejeita poço com camada elevada/diagonal incompatível; somente FLOR12 e MAP1 vazio/flat/parede comum são permitidos. Paredes sobre piso normal não mudam. A sobreposição usa blocos esparsos de16×16tiles e libera suas texturas ao sair do mapa, evitando alocar o retângulo vazio entre os ramos. Colisão continua nas máscaras, sem depender do desenho.

Eventos602–609 (encontros) e610–614 (tesouros) têm IDs próprios; componentes de encontros/tesouros e sincronização de snapshots antigos são reutilizados. Mesmos parâmetros de campanha e tabela de loot, sem migração de namespace ou novos comandos de debug. [Cobertura, fontes e roteiro](../FANG_CELAS_M02_06A.md#ala-oestesul-e-tesouro-do-fantasma--26112026).

## Alas nordeste e leste (27/11/2026)

Contrato `doc/mapas/FANG_NORDESTE_LESTE_M02.json` acrescenta cinco ramos explícitos à união de máscaras, sem mudar o runtime. Suportes `BRACE.IMG`/MAP1 0x9138 são piso atravessável com decoração independente, não portas/LOCK. Somente ocorrências conferidas neste bloco são liberadas; outros tipos9/volumes permanecem fora dessa regra. O cadastro de objetos acrescenta16suportes e92células de trilho já disponíveis. Eventos615–635 são encontros;636/637, tesouros. IDs e recibos antigos preservados.

Mesmos sincronizadores de encontros/tesouros/decoração recuperam eventos ausentes em saves anteriores; a mudança não reconfigura enigmas, fragmento, Tharn ou namespace. Reconstrução canônica e hub existentes mantidos, sem comando de título/laboratório novo. [Cobertura, fontes e roteiro](../FANG_CELAS_M02_06A.md#alas-nordeste-e-leste--27112026). Scripts focais: `node tools/test-fang-east.cjs` e `python tools/check-fang-east-source.py` (este último consulta somente a instalação e extrações já existentes).

## Centro e salas sul (27/11/2026)

Contrato `doc/mapas/FANG_CENTRO_SUL_M02.json`: dois ramos explícitos unidos às máscaras anteriores, sem alteração do runtime. Eventos638–643 são os seis encontros; suporte543/BRACE reutilizado, 75células adicionais de trilho. Nenhuma porta/chave/tesouro novo. Os sincronizadores existentes restauram eventos e registros de inimigo ausentes em saves anteriores, preservando os demais estados/recibos e a posição. `coverageStatus` na matriz distingue76/76encontros, acesso focal e geometria/props incompletos.

Reconstruir pelo gerador canônico. Verificação focal `node tools/test-fang-south.cjs`; comparação da fonte instalada `python tools/check-fang-south-source.py`, reutilizando o leitor/extrações existentes. [Fonte, limites e roteiro](../FANG_CELAS_M02_06A.md#centro-e-salas-sul-seis-encontros-finais-do-primeiro-nível--27112026). Sem novos comandos de debug/slots ou mudança de namespace.
