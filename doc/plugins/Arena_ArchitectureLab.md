# Rihad — arquitetura em quatro orientações (protótipo)

**Estado:** o responsável **aprovou explicitamente a perspectiva das paredes e portas do protótipoa7661e9**. A correção do recorte/piso dos vãos abaixo aguarda avaliação própria, sem ampliar a aplicação à campanha. Base main350d607, incluindo a fonte publicada3070ee2. **A colisão da fonte continua pendente de confirmação específica**; não foi alterada nesta entrega.

## Método e referências

Os cinco prints `zelda-paredes-quatro-direcoes-*` orientam faces convergindo ao piso, cantos e paredes compartilhadas. A plataforma exterior não comprova uma fachada de edifício; o exterior do laboratório é interpretação do projeto. Não foram incorporados pixels, personagens, HUD ou paleta de Zelda. [Referências, papéis, hashes e adaptações](../arte/rihad-architecture-prototype-v01/references.json).

**Protótipo geométrico, sem geração de imagens por IA ou edição dos assets.** Materiais atuais de Rihad recebem mapeamentoUV nas faces verticais. Piso/soleira usam coordenadas mundiais, separados da projeção das paredes; batentes e folha usam seções locais de largura constante. O piso permanece ortogonal48px; a altura é aberta localmente nos quatro sentidos, como convenção de corte. Não é uma planta isométrica nem uma nova pintura frontal colada no teto. Luz-base preservada, com sombra discreta nas faces leste/sul.

Face de2tiles=96px e cobertura de1tile=48px. Batentes ficam fora da abertura útil:144px/3tiles no laboratório,48px/1tile na cópia urbana. Materiais e mestres existentes preservados; esta experiência não aprova um atlas final. Caso a avaliação exija hardware/iluminação especificamente pintados para cada direção, sua produção será posterior e delimitada.

## Acesso e roteiro

**http://127.0.0.1:8774/**, servidor existente e [procedimento único](../EXECUCAO_LOCAL.md). Na feature: **Testes / Debug → Campanha e mapas → Rihad · arquitetura 4 direções (RAM)**. Nenhuma entrada adicional no título.

**Esc** abre pontos de inspeção, Guardar/Carregar RAM, continuar e título. **Enter ou clique no vão** abre/fecha. Fechamento sobre o personagem recusado. Estados aberto/fechado são instantâneos, com batente/apoio e tira recolhida fixos; não são uma animação final de giro.

|Mapa|Conteúdo|Pontos iniciais|
|---|---|---|
|Map019,49×49|Sala de4entradas, anexo/parede compartilhada, cantos internos/externos, edifício exterior com4faces e entradas sul/leste|N(15,8), S(15,19), E(21,14), W(8,14); exterior(18,46)|
|Map020,59×23|Terreno original de Rihad[x289..347,y10..32], dois edifícios e portas laterais|E(20,11), W(33,11)|

Correspondência: **Map009(307,21)→cópia(18,11)**, face leste; **Map009(323,21)→cópia(34,11)**, oeste. Ruas e contornos exteriores preservados. Bolsões internos e folhas operáveis foram criados **só na cópia** para atravessar/retornar: não são interiores confirmados do original nem novos serviços. Nenhuma chamada de quest/viagem da campanha nesses eventos.

Roteiro: abrir e atravessar a porta norte; retornar. Pelo menu repetir sul, leste e oeste; observar ambos os lados da parede compartilhada. Visitar o edifício exterior e seu canto. Nas duas fachadas copiadas, clicar na folha, atravessar e voltar. Guardar RAM, mudar de ponto e carregar. Sair para o título. Saves/backup normais continuam bloqueados pelo laboratório existente; não usar slots pessoais.

## Capturas e evidências V01 — referência da perspectiva aprovada

Sem legendas de proximidade, apenas cabeçalho técnico. Tiles48px; a visão geral usa canvas maior **somente na captura**, sem reduzir a escala ou modificar a resolução da campanha.

|Caso|Capturas|
|---|---|
|Norte|[fechada](../evidencias/architecture-lab-v01/interior-norte-fechada.png) · [travessia](../evidencias/architecture-lab-v01/interior-norte-travessia.png)|
|Sul|[fechada](../evidencias/architecture-lab-v01/interior-sul-fechada.png) · [travessia](../evidencias/architecture-lab-v01/interior-sul-travessia.png)|
|Leste/compartilhada|[fechada](../evidencias/architecture-lab-v01/interior-leste-fechada.png) · [travessia](../evidencias/architecture-lab-v01/interior-leste-travessia.png)|
|Oeste|[fechada](../evidencias/architecture-lab-v01/interior-oeste-fechada.png) · [travessia](../evidencias/architecture-lab-v01/interior-oeste-travessia.png)|
|Fachada urbana leste|[atual](../evidencias/architecture-lab-v01/antes-leste.png) · [protótipo](../evidencias/architecture-lab-v01/copia-leste-fechada.png)|
|Fachada urbana oeste|[atual](../evidencias/architecture-lab-v01/antes-oeste.png) · [protótipo](../evidencias/architecture-lab-v01/copia-oeste-fechada.png)|
|Contexto|[exterior](../evidencias/architecture-lab-v01/exterior-edificio.png) · [canto interno](../evidencias/architecture-lab-v01/canto-interno.png) · [canto externo](../evidencias/architecture-lab-v01/canto-externo.png) · [geral48px](../evidencias/architecture-lab-v01/visao-geral-48px.png)|

[Vídeo original em velocidade normal](../evidencias/architecture-lab-v01/travessia-quatro-direcoes.webm). [Teste focal](../../tools/test-architecture-lab.cjs), [resultado V01](../evidencias/architecture-lab-v01/resultado.json): hub real; colisão fechada, quatro travessias/reversos; fechamento protegido; cliques nas cópias; restauraçãoRAM; bloqueio de slots e retorno. Chrome/fixtures isolados, sem alteração de localStorage pessoal. Registro técnico anterior ao feedback; a aprovação posterior da perspectiva não aprova o recorte defeituoso visível nesse vídeo.

## Correção do vão V02 — histórico de 26/11/2026

Referência: `doc/prints/rihad-prototipo-parede-no-vao-79c09ed3.png`, cerca de14s do vídeo V01, entrada oeste do Map019. **Duas causas verificadas**, sem atribuir a cache: o gerador preenchia o vão com os tiles260–263 (`walk`, pavimento preto com juntas largas); camadas1–3 estavam vazias, sem tile residual. Além disso, o compositor apagava apenas o retângulo físico, embora a abertura projetada fosse trapezoidal, deixando resíduos de parede nas bordas. [Inspeção anterior](../evidencias/architecture-aperture-v02/antes-camadas.json) registrou16amostras opacas de parede nas81amostras internas dos nove planos.

Na V02, o gerador passou a usar a família existente **threshold268–271**, uma soleira/laje clara, com um tile de continuação em cada piso conectado. Sem nova arte. A camada de piso do compositor repetia essa textura em coordenadas do mundo, e o recorte seguia o quadrilátero do batente antes de recompor folha, jambas e lintel. A soleira projetada usava o mesmo material. As dimensões dos planos e colisores/eventos foram preservados nessa revisão. O recorte trapezoidal e a soleira vertical foram substituídos na V03 abaixo.

|Orientação|Antes, durante a passagem|Depois, mesmo enquadramento|Estados corrigidos|
|---|---|---|---|
|Norte|[antes](../evidencias/architecture-aperture-v02/antes-n-travessia.png)|[depois](../evidencias/architecture-aperture-v02/depois-n-travessia.png)|[fechada](../evidencias/architecture-aperture-v02/interior-norte-fechada.png) · [aberta](../evidencias/architecture-aperture-v02/interior-norte-aberta.png)|
|Sul|[antes](../evidencias/architecture-aperture-v02/antes-s-travessia.png)|[depois](../evidencias/architecture-aperture-v02/depois-s-travessia.png)|[fechada](../evidencias/architecture-aperture-v02/interior-sul-fechada.png) · [aberta](../evidencias/architecture-aperture-v02/interior-sul-aberta.png)|
|Leste|[antes](../evidencias/architecture-aperture-v02/antes-e-travessia.png)|[depois](../evidencias/architecture-aperture-v02/depois-e-travessia.png)|[fechada](../evidencias/architecture-aperture-v02/interior-leste-fechada.png) · [aberta](../evidencias/architecture-aperture-v02/interior-leste-aberta.png)|
|Oeste|[antes](../evidencias/architecture-aperture-v02/antes-w-travessia.png)|[depois](../evidencias/architecture-aperture-v02/depois-w-travessia.png)|[fechada](../evidencias/architecture-aperture-v02/interior-oeste-fechada.png) · [aberta](../evidencias/architecture-aperture-v02/interior-oeste-aberta.png)|

[Novo vídeo17s, escala816×624 e velocidade normal](../evidencias/architecture-aperture-v02/travessia-quatro-direcoes.webm). As comparações alinham tecnicamente câmera/posição; os deslocamentos do vídeo/testes usam movimento nativo e entrada real, sem aceleração. Não há legendas de proximidade.

Regressão das camadas na revisão6ab6798, [inspeção corrigida](../evidencias/architecture-aperture-v02/depois-camadas.json): zero resíduo de parede/teto nas81amostras; piso opaco comRGBA idêntico ao atlas na fase mundial esperada. Comparava geometria, âncoras, eventos e camadas físicas contraa7661e9. [Resultado dos controles](../evidencias/architecture-aperture-v02/resultado.json): fechado/aberto/travessia nas4orientações, retorno, interação por teclado/clique, sobreposição, proteção de fechamento e checkpointRAM. Duas reconstruções estáveis, mapas1–18/configurações/recursos preservados. Sem saves pessoais.

**Feedback posterior:** a remoção dos resíduos resolveu parte do defeito, mas o responsável não aprovou a continuidade espacial do centro. A V03 abaixo substitui o recorte trapezoidal. Sem aplicação às380entradas, merge, Pages ou release.

## Plano horizontal único V03 — 26/11/2026

Base6ab6798 e print `doc/prints/rihad-prototipo-perspectiva-centro-3e11d047.png`. Os prints de Zelda de interior e parede compartilhada foram reconferidos como referência espacial. **Diagnóstico:** a textura já mantinha escala/fase mundiais, mas sua máscara seguia o trapézio projetado de cada face. Na parede compartilhada, dois recortes independentes afunilavam o piso e duas soleiras eram desenhadas nos planos verticais. Não havia desnível físico que justificasse a aparência de rampa/faixa central. A regressão V02 verificava RGBA em amostras internas, sem testar a silhueta inteira ou a largura nas duas extremidades; por isso passou sem detectar essa composição.

Primeiro foram separados os planos por cores: **verde=piso horizontal; oliva=soleira no mesmo plano; azul=faces internas; dourado=batentes; terracota=faces de parede; violeta=cobertura/lintel**. A folha fechada aparece em coral. [Diagnóstico norte](../evidencias/architecture-channel-v03/cores-norte-centro.png), [sul](../evidencias/architecture-channel-v03/cores-sul-centro.png), [leste](../evidencias/architecture-channel-v03/cores-leste-centro.png), [oeste](../evidencias/architecture-channel-v03/cores-oeste-centro.png). A cor oliva é apenas diagnóstico interno, não uma faixa nova nos materiais.

**Correção:** cada porta lógica tem um único retângulo `floorRect`, inclusive na parede compartilhada. Piso e soleira repetem o atlas existente268–271 na mesma escala/direção mundial, da aproximação à saída, sem deformação ou recorte derivado da parede. As faces internas representam a espessura **fora** da largura livre; batentes e folha usam uma seção retangular local, sem estreitamento. A soleira deixou de ser aplicada numa face vertical. O lintel fica só na camada superior, sem duplicação na face reversa: a faixa que passa sobre o personagem é cobertura, não degrau/piso. A projeção geral das paredes aprovada permanece intacta; a geometria local da abertura foi ajustada nesta correção. Apoios da folha e batentes permanecem fixos entre aberto/fechado.

|Orientação|Centro antes,6ab6798|Personagem antes / centro / depois, V03|Porta fechada / aberta|
|---|---|---|---|
|Norte|[antes](../evidencias/architecture-channel-v03/antes-norte-centro.png)|[aproximação](../evidencias/architecture-channel-v03/norte-antes.png) · [centro](../evidencias/architecture-channel-v03/norte-centro.png) · [saída](../evidencias/architecture-channel-v03/norte-depois.png)|[fechada](../evidencias/architecture-channel-v03/interior-norte-fechada.png) · [aberta](../evidencias/architecture-channel-v03/interior-norte-aberta.png)|
|Sul|[antes](../evidencias/architecture-channel-v03/antes-sul-centro.png)|[aproximação](../evidencias/architecture-channel-v03/sul-antes.png) · [centro](../evidencias/architecture-channel-v03/sul-centro.png) · [saída](../evidencias/architecture-channel-v03/sul-depois.png)|[fechada](../evidencias/architecture-channel-v03/interior-sul-fechada.png) · [aberta](../evidencias/architecture-channel-v03/interior-sul-aberta.png)|
|Leste compartilhada|[antes](../evidencias/architecture-channel-v03/antes-leste-centro.png)|[aproximação](../evidencias/architecture-channel-v03/leste-antes.png) · [centro](../evidencias/architecture-channel-v03/leste-centro.png) · [saída](../evidencias/architecture-channel-v03/leste-depois.png)|[fechada](../evidencias/architecture-channel-v03/interior-leste-fechada.png) · [aberta](../evidencias/architecture-channel-v03/interior-leste-aberta.png)|
|Oeste|[antes](../evidencias/architecture-channel-v03/antes-oeste-centro.png)|[aproximação](../evidencias/architecture-channel-v03/oeste-antes.png) · [centro](../evidencias/architecture-channel-v03/oeste-centro.png) · [saída](../evidencias/architecture-channel-v03/oeste-depois.png)|[fechada](../evidencias/architecture-channel-v03/interior-oeste-fechada.png) · [aberta](../evidencias/architecture-channel-v03/interior-oeste-aberta.png)|

[Vídeo das quatro orientações, velocidade normal](../evidencias/architecture-channel-v03/travessia-quatro-direcoes.webm) · [visão geral a48px](../evidencias/architecture-channel-v03/visao-geral-48px.png). Sem legendas de proximidade; personagem parado antes, centro e depois, com ida/volta por movimento nativo. Escala de gravação816×624, sem aceleração.

**Verificação técnica, Chrome158 isolado:** [geometria/pixels](../evidencias/architecture-channel-v03/geometria-piso.json) cobre todos os oito vãos dos dois mapas: largura constante, duas extremidades dos quadros iguais, faces internas fora do piso,1696amostrasRGBA em fase mundial e inspeção de todos os pixels pintados do piso para detectar funil/ausência. Parede/teto ausentes do canal; sobreposição do lintel acima e faces abaixo do personagem. [Resultado de interação](../evidencias/architecture-channel-v03/resultado.json): aberto/fechado, ida/volta nas4orientações, colisão, recusa de fechamento sobre o personagem, clique nas duas cópias urbanas, checkpointRAM, isolamento dos slots e retorno ao título. Duas reconstruções estáveis; Map019/020, eventos, máscaras e configuração idênticos à6ab6798; Map001–018 e recursos da campanha preservados.

Reproduzir a regressão com `node tools/check-architecture-aperture.cjs` e `node tools/test-architecture-lab.cjs doc/evidencias/architecture-channel-v03 channel`, com o servidor canônico ativo e Playwright disponível. O modo de cores é transitório em `$gameTemp._arenaArchitectureSurfaceColors`, exclusivamente para diagnóstico; não integra menus nem saves. Gerador e componente registram que o piso horizontal não pode herdar a projeçãoUV das faces verticais.

**Avaliação visual desta geometria pendente.** Repetir pelo mesmo hub/pontos N/S/E/W; abrir, parar no centro, atravessar e voltar. A aprovação anterior da perspectiva continua separada. A campanha e suas380entradas não foram ampliadas; a colisão da fonte continua sem confirmação específica.

## Impacto e aplicação gradual

- **Campanha intacta:** Map001–018, eventos, destinos, quests, recibos, assets, motor e namespace preservados. Main/Pages/release não recebem esta feature. Loader/registro acrescentados; controles/renderização só em Map019/020 com laboratório ativo.
- **Reconstrução:** `node tools/build-architecture-lab.cjs` gera Map019/020/configuração e acrescenta MapInfos19/20 e Tileset12, preservando registros anteriores. Mestres geométricos no gerador/renderizador; referências aos mestres de textura anteriores preservadas. Não depende do gerador normal de Rihad.
- **Colisão e desenho separados:** máscara nativa para massa sólida; eventos ocupam o volume fechado e liberam a mesma largura abertos. Lintel acima do personagem e faces abaixo dele; teto exterior translúcido durante inspeção interna. Sem `through` no jogador ou nova mobilidade.
- **Limite estrutural:** face única requer3tiles neste modelo. Duas faces integrais compartilhadas requerem **2+1+2=5tiles**, demonstrados no anexo; não cabem automaticamente numa parede original de3tiles. Edifícios estreitos também podem perder a área do teto. Não ampliar paredes para dentro das ruas/salas nem deslocar eventos silenciosamente.
- **Próximo passo condicionado à avaliação:** decidir a legibilidade das4faces e do exterior. Se aceita, auditar espessuras reais e iniciar por estas duas fachadas, mantendo coordenadas/circulação. Casos estreitos/compartilhados exigem representação própria — possível corte da face oposta ou menor profundidade visual, **ainda sem regra aprovada**. Só então ampliar gradualmente, com reconstrução/interação verificadas. **Não aplicar às380entradas agora.**
