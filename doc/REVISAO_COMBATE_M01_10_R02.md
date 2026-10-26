# M01-10 R02 — movimentos e armas do piloto

26/10/2026. Continuidade de feature/m01-combate a partir de8137dac, inicialmente limpa/sincronizada. Sem merge em develop/main, sem release/M01-11. R01 permanece histórico preservado. **M01-10 em validação: somente Bretã feminina e rato receberam R02.** Não atribuir novos movimentos/armas aos outros15 personagens ou aos inimigos2/3, que mantêm R01.

## Entrega e cobertura

| Participante | Revisado nesta rodada | Ainda não comprovado |
| --- | --- | --- |
| breton.female.base |42 desenhos: espera, leve, pesada, conjuração, poção, dano, derrota; seis quadros por movimento | Aprovação estética/perceptiva pelo responsável; movimentos específicos adicionais, outras armaduras |
| Rato, inimigo1 |24 desenhos: espera, bote, dano, derrota; seis quadros por movimento | Aprovação estética/perceptiva pelo responsável |
| Outras15 combinações | Regressão funcional/quadros R01 em batalha | Novos intermediários, gestos e apoios de arma R02 por identidade |
| Goblin2, homem-lagarto3 | Regressão funcional/quadros R01 em batalha | Revisão de fluidez R02 |

Retratos, exploração, roupas e referências aprovadas anteriores preservados. Nenhuma nova combinação de raça/equipamento produzida em lote. A expansão só deve ocorrer após revisão do piloto e rato; contagem de quadros não encerra M01-10.

## Armas e sequência nativa

Dois cutouts IA independentes: adaga36px e espada56px de altura, em img/pictures/Arena_weapon_*_r02.png. Wtype1/2 são configuração, não regras novas. A espada é interpretação conservadora de aço/couro/latão usando a paleta do ícone aprovado, sem alegar desenho original confirmado. Pontos da empunhadura por imagem, e mão/rotação por quadro em ArenaBattleMotion.json, autoria em art/masters/combate-r02/hand-anchors.json. A arma fica atrás da mão/corpo; não foi pintada em cada personagem. Pontos foram corrigidos após inspeção4x e em escala nativa, evitando fixação na manga ou abaixo da mão. Na derrota acompanha os apoios até o chão. Sem deslocar a raiz corporal para simular movimento.

A cada quadro, ler o equipamento nativo atual. Desarmado limpa visibilidade/bitmap; adaga↔espada atualiza arquivo/empunhadura. Conjuração e poção recolhem a camada temporariamente e a restauram ao voltar à espera; não removem o equipamento real. O gesto de item atual é específico de poção, adequado aos três consumíveis de combate existentes; não declarar gesto para futuros itens diferentes. Atacar usa leve; técnicas3/5/7 usam leve,4/6/8 pesada; Cura/Dardo usam palmas abertas. Movimentos de leve e pesado compartilham o corpo entre armas, com antecipação/arcos distintos, não duas bibliotecas por equipamento.

Arena_BattleMotion estende apresentação; MVMotionTimeline é núcleo puro sem IDs do Arena. Durações por quadro e quantidade de quadros são configuráveis; teste alternativo com quatro quadros demonstra ausência de suposição de seis no núcleo. Retângulos de atlas independem das linhas/colunas de uma folha padrão MV.

| Movimento | Durações em atualizações MV | Total ideal a60Hz | Impacto |
| --- | --- | --- | --- |
| Espera |16,16,20,16,16,20 |1,73s/ciclo | — |
| Leve |4,5,4,3,5,5 |0,43s | quadro3/início13 |
| Pesada |5,8,7,5,7,8 |0,67s | quadro3/início20 |
| Conjuração |5,7,7,5,6,6 |0,60s | quadro3/início19 |
| Poção |5,6,6,8,6,5 |0,60s | quadro3/início17 |
| Dano |3,5,6,5,4,5 |0,47s | — |
| Derrota |6,7,8,7,8,12 |0,80s | — |
| Bote do rato |5,7,5,4,6,6 |0,55s | quadro3/início17 |

Índices começam em0. Espera é cíclica; ações terminam em retorno à guarda. Valores representam tempo de desenho; mensagens/retaliação/transição nativas acrescentam tempo ao turno. O log apresenta a mensagem, inicia antecipação, aguarda o quadro **exibido** de impacto e segue com invokeAction nativo; recuperação termina antes da próxima ação. Sem cobrar/aplicar efeitos pelo relógio de animação. Recursos/itens são pagos pelo useItem nativo na execução comprometida, antes da antecipação, nunca pela seleção. Dois efeitos repetidos compartilham uma execução/cobrança; não reiniciam a animação por alvo.

O primeiro teste detectou liberação uma atualização cedo, por consultar o relógio do próximo quadro. Corrigido para consultar a amostra efetivamente exibida: os registros finais mostram impacto no quadro3. Diagnóstico anterior preservado em evidencias/m01-10-r02/impactos-antecipados-antes-correcao.json. Sem alvos, endAction libera a recuperação mesmo sem invokeAction, evitando travamento. Blink/whiten do rato R02 desativados para não ocultar os desenhos de reação; queda própria continua visível até terminar. Fuga continua bloqueada.

## Fontes, geração e comparação

Ferramenta image_gen integrada, alpha real. Referências efetivamente fornecidas: lateral Bretã r02, folha corporal R01 da mesma personagem, folha R01 do rato e ícone arena_icones_v01 para materiais das armas. Nenhuma referência do outro projeto foi enviada à geração. Prompts integrais e hashes em arte/PROMPT_COMBATE_R02_*.json e COMBATE_MOVIMENTOS_R02_MANIFEST.json; masters em art/masters/combate-r02/.

A primeira folha de golpes tinha duas figuras unidas; a tentativa de repack também cortou botas. Ambas preservadas como **rejeitadas para integração**. Geradas então duas folhas separadas de seis poses, leve/pesada, com margens. Exportação não amputa partes nem inventa intermediários por código: limpa ruído alfa≤16, recorta componentes separados, usa uma densidade por master e alinha apoio, sem deformar cada quadro. Fontes e66 células distintas limitadas auditadas; isso complementa inspeção, não comprova fluidez/anatomia sozinho.

Pranchas arte/combate-r02-comparacao-armas.png, -gestos.png, -rato.png: escala nativa, rótulos/linha do chão externos, nenhum guia nos PNGs finais. Ferramenta local tools/battle-motion-review.html reproduz a composição de revisão, não implementa interface de batalha M01-11.

Gravações do canvas real816×624, solicitadas a30fps por MediaRecorder no Chrome156.0.8078.47, viewport1100×800, contexto descartável:

- antes-r01-leve-pesada.webm: baseline antes da mudança; script fixa os14 plugins de8137dac para reprodução.
- adaga-leve/pesada.webm, espada-leve/pesada.webm, desarmado-leve/pesada.webm.
- conjuracao.webm, pocao.webm, derrota-rato.webm, derrota-jogador.webm.

Todos em evidencias/m01-10-r02/. Os vídeos completos preservam campo/UI; GIFs preview-* e filmstrips inspecao-* são derivados dos vídeos decodificados, com recortes de participantes1:1 e timestamps externos, sem reconstruir a animação por atlas. Onze vídeos foram decodificados/inspecionados por amostragem de quadros; os dez cenários têm traço nativo. Decodificacao-videos.json registra durações/amostras. As gravações não são inspeção no editor nem teste físico mobile.

Inspeção do Codex: leve/pesada distinguíveis, palmas abertas e ingestão visíveis, arma seguindo a mão nos quadros revisados, apoio/escala preservados sem translação da raiz, reação/queda corporal dos dois lados. A espera é discreta e há pequenas variações de postura/textura entre masters; não afirmar interpolação perfeita, física final ou aprovação estética. Ritmo/peso/percepção continuam sujeitos à avaliação posterior do responsável.

## Validação técnica e limites

resultado.json: três encontros consecutivos com troca adaga→espada→desarmado, pares nativos, Vigor5/12, Mana6, poção1, save/load após batalhas, dois efeitos/um useItem/um débito, quadros0–5 observados para cada movimento, impacto alinhado, vitória/retorno e derrota/game over. HP500/variância0/RNG0,5 são fixtures só em memória; não alteram banco/balanceamento. limites.json: ataque nativo sem alvos termina sem efeito/custo/travamento, técnica selecionada antes de perder Vigor é rejeitada sem débito parcial. Referências a dados/engine/consumidores anteriores preservadas.

Regressões novas:628 habilidades/192 ações raciais,619 recursos,234 criação+UI,27 persistência, StateStore/Runtime e matriz das16 identidades/três inimigos. Matriz exige seis quadros somente para piloto/rato e três para os demais, sem converter legado em cobertura nova. Relatórios em regressoes/ e cobertura/. Validadores de dados/habilidades/recursos/batalha e novo validate-battle-motion, núcleo puro e auditoria de arte. Sem saves pessoais.

O responsável mantém testes manuais adiados. Editor MV (abertura/gerenciador/salvar/reabrir), playtest visual NW.js, Galaxy A56 e aprovação estética desta revisão **pendentes**. Formato canônico UTF8 sem BOM e16 scripts presentes são verificações técnicas, não substituem autoria no editor. Sem novos valores raciais ou balanceamento. Efeitos visuais próprios de magias, movimentos para contra-ataques/reflexão e biblioteca completa de gestos não foram declarados validados. Outros15 personagens e goblin/homem-lagarto ainda precisam da revisão; não fechar M01-10 nem iniciar M01-11.

## Reproduzir

No título, Combate técnico (piloto) abre a Bretã feminina. Preparar treino(3,5), Rato(7,5). Usar técnicas leves/pesadas; fora do combate, trocar/remover arma no menu, reiniciar encontro/descansar(11,5), repetir. Cura/Dardo e poções estão no kit técnico. A derrota real exige deixar o rato reduzir Vida a0. Novo participante conserva acesso às16 identidades, mas somente a piloto está em R02; cancelar não inicia sessão nova. Não utilizar saves pessoais para os testes técnicos.
