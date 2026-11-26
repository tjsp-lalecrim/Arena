# Arena_RihadDecor0.2.0 — bases, placas e seções de entrada

Após Arena_RihadDirections. Sem arte nova, alteração de motor ou namespace. [Cadastro único](../mapas/RIHAD_DECOR_CONTRATOS.json), compilador `tools/rihad-decor-contracts.cjs`, saídas Map009/011/018 e flags dos tilesets6/9/10. O runtime monta as seis placas e trata somente posições de retomada dentro das bases cadastradas.

## Auditoria e colisão

|Área|Objetos auditados|Células de base, sem duplicatas|Novas células bloqueadas|
|---|---:|---:|---:|
|Cidade|138 —117adereços originais e21módulos de fachada|195|195|
|Pousada|25 —móveis, adereços e cama|41|8|
|Corte|47 —móveis e adereços|48|48|

O mobiliário já tinha parte das bases bloqueadas pela planta. A correção completa essas bases; não atribuir toda a colisão dos interiores a esta revisão. A planta, regiões, eventos, IDs, fontes/recibos e outros mapas permanecem preservados. Bases são uma adaptação explícita à grade48px, não uma alegação de colisão idêntica ao original.

- Caixas, sacos, vasos grandes, poços, cactos e troncos usam base de um tile. Copa e partes altas não ampliam a base. As25fontes urbanas têm base2×2, colunasx/x+1 e fileirasy−1/y. Deslocamento visual explícito+24px emX alinha bacia/pedestal a essa base, preservando evento lógico e profundidadeY. A regra anterior de um tile, entregue em b469155, era insuficiente.
- Mesas e bacias de piso usam2×2; balcões3×1/1×3; trono usa a fileira inferior do assento, sem bloquear os três tiles de altura visual. Cama mantém os dois tiles que já eram sólidos. Braseiros têm base de um tile.
- Tapeçarias, luminárias e toldos não acrescentam base de piso. Tecidos planos não acrescentam colisão; um tecido sobre um balcão não torna o balcão atravessável. Louça continua apoiada nas mesas, sem outro obstáculo no chão. Tapetes sem móvel sobreposto continuam transitáveis.

Cada módulo/ocorrência recebe perfil e células explícitas em `arenaDecor`. `arenaDecorBlocked` é compilado na camada2 usando o **tile767, transparente e reservado**, com flags nativas15. Nenhum retângulo inteiro de sprite vira colisor por inferência. As flags nativas atendem jogador, NPCs, clique e busca de rotas; não há uma segunda lógica de colisão por frame. Os eventos de cenário mantêm through porque a base física pertence ao mapa, não à imagem do evento. Não reutilizar tile767 para arte: a verificação focal confere transparência nos três atlas finais.

## Placas

As seis placas físicas de símbolos mantêm ID e ponto lógico: três frontais e três laterais leste. O vínculo com a porta/approach existente é validado pelo compilador. A identificação textual dos380acessos permanece nos mesmos pontos e lados acessíveis; não criou serviços/interiores novos.

Projeção comum por orientação: frontais sobem36px, dentro da face vertical alta adjacente à porta; laterais sobem72px e prendem o suporte à borda acessível, com4px de encaixe. A regra oeste inverte o suporte do mesmo módulo simétrico; não há ocorrência física oeste nesse conjunto atual para alegar avaliação de campo. As laterais projetam a placa para fora da face e ficam atrás do personagem quando ele passa à frente; as frontais usam a camada necessária para aparecer sobre a parede. Não alteram o vão, a folha, dobradiças, animação ou colisão das portas. É montagem dos pixels existentes, sem recortar/recentralizar quadros de animação.

|Caso|Antes|Depois|
|---|---|---|
|Fachada frontal|[captura](../evidencias/rihad-decor-physics-v01/antes-frontal.png)|[captura](../evidencias/rihad-decor-physics-v01/depois-frontal.png)|
|Fachada lateral|[captura](../evidencias/rihad-decor-physics-v01/antes-lateral.png)|[aproximação livre](../evidencias/rihad-decor-physics-v01/depois-lateral-livre.png)|
|Caixas|[sobreposição anterior](../evidencias/rihad-decor-physics-v01/antes-caixas.png)|[base bloqueada](../evidencias/rihad-decor-physics-v01/depois-caixas.png)|
|Poço|[sobreposição anterior](../evidencias/rihad-decor-physics-v01/antes-poco.png)|[base bloqueada](../evidencias/rihad-decor-physics-v01/depois-poco.png)|

Capturas em RAM, sem saves pessoais. Poses internas de inspeção foram posicionadas tecnicamente; a passagem anterior nas caixas/poço é comprovada também pelas flags da referência408888d. As imagens da mesa são fixtures de retomada, não prova de que toda a mesa era atravessável antes.

## Reconstrução e saves

Procedimento canônico: `node tools/build-rihad-arrival.cjs`. As etapas dependentes de corte/pousada não são comandos de reconstrução isolada de uma cidade já povoada. Elas chamam o cadastro durante a aplicação das peças e finalizam a máscara depois dos materiais/frames. Perfis ausentes, IDs repetidos, base fora do mapa, camada ocupada ou vínculo ambíguo de placa falham explicitamente. [Teste focal](../../tools/test-rihad-decor.cjs) inclui duas reconstruções estáveis; não precisa regenerar assets.

Ao carregar, se o personagem estiver numa base agora sólida, o módulo busca o piso livre mais próximo, conectado à entrada da área, excluindo NPCs sólidos. Move apenas a posição com `locate`, limpa o destino de clique e reaproveita a proteção de soltura/nova pressão. Não refaz o mapa/quests nem concede recuperação, itens, EXP ou pontos. Posições seguras ficam intactas. Não apaga ou migra slots; namespace web permanece `arena:m01:save-v1`.

[Evidências](../evidencias/rihad-decor-physics-v01/resultado.json):380aproximações de portas e trajetos dos moradores acessíveis, teclado/clique junto a sólidos, folga sob copa, dez vãos laterais, pousada/cama/recuperação, informante, Blubamka e retorno. Saves sintéticos dentro de caixa/mesa restauram apenas a posição; save seguro da cidade/corte mantém posição e estado. Evidências de visão de Ria e entrega única de Blubamka reutilizadas; não repetida a campanha.

Feedback registrado: respostas curtas consideradas melhores; decoração atravessável e placas baixas relatadas. Não atribuir aprovação visual destes ajustes antes do próximo teste.

Roteiro: observar a placa da pousada e uma fachada frontal no quarteirão próximo; tentar atravessar caixas/vasos e contorná-los; entrar por tecla/clique, chegar à cama e falar com a responsável; visitar Blubamka e retornar. Salvar/carregar em piso livre mantém a posição. Não é necessário fabricar um save preso: a recuperação desse caso já foi verificada tecnicamente em perfil isolado.

Implementação `b469155`, fonte funcional promovida à main `bcf3d3c63d1b0536860af1a4c5b52d02ddd82411`. [Prévia pública conferida](../evidencias/rihad-decor-pages-v02/resultado.json), [execução45730753285](https://github.com/tjsp-lalecrim/Arena/actions/runs/45730753285): manifesto e443arquivos por tamanho/SHA-256, abertura isolada e máscaras/módulo servidos confirmados. Os commits posteriores de infraestrutura e registro não mudam o conteúdo funcional selecionado. Avaliação manual dos ajustes permanece pendente; sem release ou limpeza de dados.

## Fonte e seções de entrada —26/11/2026

Responsável testou a última prévia e confirmou persistência da sobreposição na fonte e leitura arquitetônica inadequada das entradas. Consultados os três prints `rihad-colisao-portas-*`. Fonte identificada em **Map009(351,177)**, originalMIF(11,58), evento1066. Os prints de portas mostram os padrões norte reduzido a soleira e lateral sem face de parede. Casos reproduzíveis próximos ao portão estão abaixo; não atribuir ao print uma coordenada de casa que ele não informa.

**Fonte:** quadro96×144, corpo opaco local(18,63)–(78,125). A base anterior cobria só o tile superior central, deixando pedestal e bordas livres. Todas as25ocorrências de `!$Arena_Rihad_Fountain_Reuse_V01` recebem perfil2×2 e deslocamento visual+24px; nenhuma imagem foi editada. Prioridade normal e apoioY original dão profundidade: norte antes da fonte no renderizador, sul depois. Save dentro da nova base reutiliza a busca de piso seguro; nenhum recurso, item, quest, recibo ou namespace muda.

**Entradas:** o atlas antigo previa faixa para o norte; folhasE/W eram sprites sobre o cap, sem seção da parede. `tools/rihad-entrance-assembly.cjs` compõe **380seções** usando materiais e folhas existentes:118sul,88oeste,91leste,83norte. Frente natural e cortes locais das fachadas ocultas mostram duas fileiras de face, separação do teto, recuo, moldura e soleira. Folha preserva proporção na montagem. A seção ocupa até3×2tiles **visuais**, recortados às células sólidas; não avança sobre a rua. É adaptação gráfica de corte arquitetônico, sem alterar topologia/orientação nem criar interior. Posição lógica, aproximação, condição e destino preservados. Montagem urbana estática; não altera dobradiças/folhas animadas de outros mapas nem os dez vãos internos. Nenhuma imagem gerada/regenerada.

Os testes anteriores conferiam o tile central da fonte e pixels visíveis/acesso das portas; não cobriam o envelope opaco completo nem a fachada sem legenda. [Regressão focal](../../tools/test-rihad-fonte-entradas.cjs): quatro aproximações reais por teclado/clique, pixels dentro da base em25fontes, ordem de desenho norte/sul,380aproximações alcançáveis, máscaras contidas em sólidos, pousada/corte por tecla/clique, três posições antigas na nova base e um save seguro. Dois rebuilds canônicos estáveis; demais mapas, recursos e contratos preservados. [Resultado](../evidencias/rihad-fonte-entradas-v02/resultado.json). Chrome isolado, fixtures sintéticas; sem campanha completa ou saves pessoais. Avaliação manual dos ajustes ainda pendente.

|Exemplo Map009, coordenadas MV|Antes sem legenda|Depois sem legenda|
|---|---|---|
|Frontal sul: porta(354,31), aproximação(354,32), Templo fechado|[captura](../evidencias/rihad-fonte-entradas-v02/antes-frontal.png)|[captura](../evidencias/rihad-fonte-entradas-v02/depois-frontal.png)|
|Face leste: porta(307,21), aproximação(308,21), Casa fechada|[captura](../evidencias/rihad-fonte-entradas-v02/antes-leste.png)|[captura](../evidencias/rihad-fonte-entradas-v02/depois-leste.png)|
|Face oeste: porta(323,21), aproximação(322,21), Casa fechada|[captura](../evidencias/rihad-fonte-entradas-v02/antes-oeste.png)|[captura](../evidencias/rihad-fonte-entradas-v02/depois-oeste.png)|
|Face norte: porta(351,53), aproximação(351,52), Casa fechada|[captura](../evidencias/rihad-fonte-entradas-v02/antes-norte2.png)|[captura](../evidencias/rihad-fonte-entradas-v02/depois-norte2.png)|
|Fonte(351,177), região da imagem relatada|[sobreposição anterior](../evidencias/rihad-fonte-entradas-v02/antes-fonte-sul.png)|[aproximação sul livre](../evidencias/rihad-fonte-entradas-v02/depois-fonte-sul.png)|
|Pousada: porta(313,42), aproximação(314,42)|[captura](../evidencias/rihad-fonte-entradas-v02/antes-pousada.png)|[captura](../evidencias/rihad-fonte-entradas-v02/depois-pousada.png)|

Na fonte, antes o personagem ocupa(351,177); depois fica ao sul(351,178), fora da base, com câmera acompanhando. Legendas só foram ocultadas pelo teste para as capturas; continuam no jogo como apoio. Identificação/placas e estado fechado das casas preservados.

Roteiro único: do portão seguir às casas laterais(307,21)/(323,21); comparar templo frontal(354,31) e casa ao norte(351,53), reconhecendo a entrada pela imagem. Entrar na pousada(313,42) por tecla/clique, alcançar o quarto e retornar. Pela rota à corte, contornar a fonte(351,177) pelos quatro lados; conferir base bloqueada e personagem à frente ao sul. Prosseguir à corte(360,384), entrar/sair e salvar/carregar em piso livre. Não fabricar save pessoal preso: reparação já testada isoladamente. Pages depende do registro do pacote desta revisão; release no fechamento.
