# Diretiva de mapas e objetos — ortogonal MV

Vigente desde M01-14 R03,27/10/2026. Complementa DIRECAO_DE_ARTE.md, GERACAO_DE_CENARIOS.md, DADOS_M01.md e os contratos em plugins/Arena_Dungeon.md. A planta e direção gráfica aprovadas não aprovam automaticamente encaixes. Fonte arquitetônica principal: Arena original; não converter para isometria para acomodar um objeto.

## Regras obrigatórias: grade e projeção

O projeto usa tile **48×48px**, confirmado no motor e em execução. Pixels de prints escalados pela janela não definem a unidade. Mundo superior ortogonal: eixos norte/sul e leste/oeste paralelos à grade; nenhuma transformação da planta em losangos. Luz superior esquerda e materiais aprovados devem se manter coerentes.

Decisão provisória para representação, sujeita a testes: cap/teto1tile, altura de face frontal2tiles, corredor3tiles livres. Preservar conectividade e exceções de largura/geometria necessárias ao original, registrando a adaptação em vez de ampliar tudo mecanicamente. As faces são projeção visual dentro de células sólidas; não aumentam colisão ou fecham caminhos. Laterais opacas usam borda superior ortogonal, conforme arquitetura existente. No vão de porta não se cria um cap sólido sobre piso: o teto real dos blocos vizinhos permanece intacto. Nunca usar uma imagem com parede/terreno incorporado para compensar falta de geometria.

## Conceitos que não são intercambiáveis

| Conceito | Contrato verificável |
|---|---|
| Posição lógica | Coordenada original/adaptada do elemento, estável na origem; guardar separadamente de adaptações de decoração |
| Área ocupada | Retângulo de apoio no mundo; pode ter várias células, sem implicar bloqueio de todas |
| Área bloqueada | Flags/eventos nativos; deve ser definida explicitamente, nunca pelo tamanho da imagem |
| Interação | Célula e gatilho acessível por lado permitido; não depender de pixels transparentes do sprite |
| Extensão visual | Canvas, pixels opacos, margem, âncora, camada e eventual projeção acima do apoio |

O ponto de apoio nativo de um evento `(x,y)` é `((x+0,5)×48,(y+1)×48)`. Prefixo `!` evita deslocamento adicional6px; `$` identifica folha única3colunas×4direções. Recortar uma fonte uma única vez é permitido; recortar/recentralizar cada quadro de animação de forma independente é proibido. Preservar os masters e a transformação técnica.

## Categorias e camadas

| Categoria | Canvas/apoio | Camada e bloqueio |
|---|---|---|
| Tesouro/chave | célula48×48, apoio inferior central; tesouro alvo44px de largura e pelo menos30px de altura visível, margem2px; preservar proporção | abaixo do jogador, through; interação nativa no ponto de piso |
| Plataforma baixa independente |144×144 cobrindo3×3, laje até140px com bordas transparentes, sem parede traseira | camada1 abaixo do personagem; piso nativo por baixo; não bloquear novas células |
| Decoração de parede |96×96, apoio inferior central; pixels opacos dentro de face frontal existente | abaixo do jogador, sobre área sólida; nunca em void, teto ou caminho |
| Porta frontal norte/sul | canvas144×144; primeiro tile vertical transparente; folha na face inferior96px; dobradiças locais fixas x4/x140 | prioridade normal; quadro fechado bloqueia seção transversal3tiles, aberto libera as mesmas células |
| Porta lateral leste/oeste | mesmo canvas; componente realmente visto de cima, borda8px×136px; dobradiças locais(72,4)/(72,140) |136px é **profundidade do vão na planta**, não altura de parede. Não desenhar uma face96px inclinada para simular isometria |

Os encaixes devem usar geometria do mapa como moldura. Componentes de porta não incluem jambas de pedra, piso ou teto. A animação pode projetar/rotacionar a folha em torno de dobradiça fixa; não transladar evento ou redimensionar o conjunto. Norte/sul usam componentes de frente/verso; leste/oeste usam componentes próprios superiores, nunca a imagem frontal girada. Diagonal momentânea de folha durante giro no plano não altera a projeção ortogonal do cenário.

Objetos de piso só em regiões de piso/plataforma autorizadas. Uma célula sólida não é, sozinha, uma face de parede válida. O compilador deve comprovar que a extensão da decoração coincide com as duas fileiras de face desenhadas e que há área aberta abaixo. Se a projeção original exigir adaptação, registrar posição lógica original, face visual escolhida, distância e motivo. Resolver por uma regra de busca/atribuição única e sem sobreposição, não por remendos locais. Se não houver face válida dentro do limite, falhar a compilação e registrar a lacuna.

## Oclusão e animação

Nunca desenhar um cap em camada acima do jogador sobre uma passagem que deveria estar aberta. Em porta aberta, o centro do vão deve ser transparente. Partes fechadas podem ocultar apenas conforme apoio/profundidade coerentes; não corrigir desaparecimento ativando through. Decoração de parede deve ficar confinada à massa sólida; plataforma e tesouro abaixo dos pés. Testar a figura completa nas aproximações e na travessia, não apenas o ponto lógico.

Fechamento recusado enquanto jogador ou evento não-through ocupa envelope de giro. Collider bloqueado até o fim da abertura; volta a bloquear no início do fechamento aceito. Todos os quadros têm mesmo canvas/escala/âncora. Comparar pixels da dobradiça e posição da moldura, além de conferir se os quadros são diferentes. Água: A1 próprio e periódico; natação exclusivamente na região marcada, preservando flags nativas, bordas, obstáculos e veículos. Não gastar/recuperar Vigor em exploração.

## Critérios de validação pertinentes à alteração

1. Ver um caso frontal e um lateral, ambos pelos dois lados, incluindo aberto, intermediário, fechado e travessia real.
2. Ver o mesmo objeto de descanso isolado e junto de uma parede, sem alvenaria falsa; tesouro na escala real; canto/margem de água.
3. Submeter a amostra à avaliação antes de expandir ocorrências, conforme o fluxo de DIRECAO_DE_ARTE.md; não produzir um lote de padrão novo ainda não aprovado na mesma entrega. Na expansão autorizada, auditar posições/camadas alteradas e registrar adaptações.
4. Salvar/carregar, incluindo portas e água; testar navegação e colisão nativas. Quando houver alteração de gerador, conferir sua saída pertinente para garantir que não desfaz o ajuste; não regenerar tudo em uma revisão sem esse risco.
5. Inspecionar no navegador e no editor MV1.6.1. Registrar o que foi executado: teste de navegador e validação de JSON não substituem autoria no editor, nem comprovam teste físico em mobile.

Recortes de revisão, linhas e rótulos pertencem somente às pranchas. Prompts devem fornecer apenas referências efetivamente usadas; prints de defeitos não são modelos de resultado. Assets com falhas permanecem em revisão até avaliação do responsável.

## Aprovação do mapa e ressalva futura — 27/10/2026

Resultado visual/estrutura da R03 no estado disponívelb194b44 aprovados pelo responsável. Não regenerar os assets aprovados nesta rodada. Portas laterais têm orientação e formato corretos; futuramente avaliar espessura aparente, contraste e legibilidade, preservando âncoras, moldura, animação, projeção e colisão. Sem mudança implementada. A ressalva não bloqueia o próximo backlog; a pendência de autoria no editor é separada. Evidência/escopo em APROVACAO_MAPA_M01_14.md.

## Integração R02

O Shift Gate mantém seus tiles de parede e arte; a ativação cobre o piso de aproximação3×2, sem abrir colisão nas paredes. Contatos são acrescentados sem renumerar fontes existentes e são reconstruídos em saves antigos. Não usar through no jogador para contornar acesso. Ratos/goblins usam imagens nativas de caminhada, pés/pivôs independentes da área de colisão. As ressalvas de legibilidade das portas laterais e a investigação de custos originais da natação continuam futuras; Vigor aquático permanece inalterado.

## Origem das correções

Corrigir também geradores/configurações que produzem coordenadas, encaixes, colisões, camadas ou animações; remendo apenas no output não encerra a correção. Não alterar planta ou assets aprovados para mascarar erro de integração. Anatomia, caminhada de participantes e armas seguem DIRECAO_DE_ARTE.md; não duplicar esses contratos aqui. Ressalvas aceitas e melhorias futuras permanecem no registro de aprovação existente e em REFINAMENTOS_POS_INTEGRACAO_M01.md, sem obrigação de regenerar agora.
