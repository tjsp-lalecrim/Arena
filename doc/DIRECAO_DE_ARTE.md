# Direção de arte e padrão de geração

Versão 1.1 — revisão de identidade após rejeição estética da amostra M01-06 v0.1. Os testes de formatos e execução continuam válidos como evidência técnica, mas a amostra anterior não é referência artística aprovada. M01-06 permanece em revisão até aprovação estética do responsável.

## Identidade visual

Fantasia medieval sombria, com acabamento de pintura digital figurativa, materiais críveis e formas claramente desenhadas. Referência de identidade: arte original de The Elder Scrolls: Arena. Interpretar personagens, criaturas, arquitetura e objetos em dark fantasy sem inventar características narrativas apresentadas como originais.

Adotar uma mesma linguagem pictórica para ilustrações, retratos, cenários, sprites e ícones. Variar a quantidade de detalhe conforme a escala de exibição. Ilustrações narrativas são ricas em detalhes; sprites e ícones simplificam os detalhes para manter silhueta e leitura. Não misturar pixel art, anime, cartoon e renderização 3D fotográfica entre categorias.

O tom é antigo, austero e ameaçador. A sensação de perigo vem da composição, da luz, da escala e do desgaste dos materiais; não depender de escuridão excessiva ou de violência gráfica.

## Paleta-base

As cores abaixo são referências de direção, não uma limitação rígida do número de cores de cada imagem.

| Função | Cor | Referência |
| --- | --- | --- |
| Sombra profunda | #17191D | Carvão frio |
| Pedra escura | #343A40 | Ardósia |
| Pedra iluminada | #777568 | Calcário envelhecido |
| Madeira e couro | #5C4232 | Castanho terroso |
| Metal | #8B8D86 | Aço gasto |
| Ornamento | #A58A55 | Latão envelhecido |
| Pergaminho e texto claro | #D8CCAF | Marfim quente |
| Luz de fogo | #D28B43 | Âmbar |
| Vida | #B44C4C | Vermelho escuro |
| Mana | #587EBC | Azul frio |
| Vigor | #719365 | Verde suave |

Usar bases pouco saturadas com acentos controlados. Efeitos mágicos podem ter cor mais intensa, sem dominar permanentemente a tela. As cores de recursos devem ser acompanhadas de identificação visual ou textual; não comunicar informação apenas pela cor. Não estabelecer cores de raridade antes de definir as categorias de raridade.

## Luz, materiais e formas

- Luz de leitura suave vinda da parte superior esquerda nos assets isolados. Cenas podem usar fontes locais, como tochas, desde que personagens e pontos interativos permaneçam legíveis.
- Sombras frias e luzes quentes em ambientes iluminados por fogo; evitar preto uniforme que esconda paredes, portas ou caminhos.
- Pedra irregular, madeira marcada, couro fosco e metal com desgaste moderado. Evitar plástico, brilho cromado moderno e ruído excessivo de textura.
- Proporções humanas estilizadas próximas do natural; sem cabeças exageradas de estilo chibi. Sprites menores preservam a mesma identidade com anatomia simplificada.
- Silhuetas distintas entre categorias de armas, equipamentos e criaturas. Detalhe decorativo nunca substitui a leitura funcional.

## Padrões por categoria

| Categoria | Padrão de produção |
| --- | --- |
| Ilustração narrativa | Pintura detalhada, composição com foco claro e espaço reservado à interface; sem texto gerado dentro da imagem. Base de trabalho 1536 × 1024, com ação principal na região central para permitir reenquadramento |
| Retrato | Mesmo rosto, idade aparente, cabelo, vestuário e paleta do personagem; busto em três quartos, fundo discreto ou transparente conforme uso. Mestre 1024 × 1024 |
| Personagem de mapa | Vista superior oblíqua compatível com o mapa 2D, sem perspectiva isométrica. Base inicial de célula 48 × 64 para humanoides, pés alinhados; frente, costas e perfis coerentes |
| Combatente Side View | Corpo inteiro, postura de perfil/três quartos lateral, identidade igual ao retrato e sprite de mapa. Base inicial de célula 96 × 96 para humanoides, pés na mesma linha e sem cortes de arma |
| Inimigo | Mesmo acabamento e escala relativa dos personagens; dimensões maiores justificadas por porte. Animação própria, não apenas efeitos sobre imagem estática |
| Ambiente e tiles | Vista superior oblíqua consistente, grade de 48 × 48 como base; superfícies repetíveis sem costuras, portas e passagens reconhecíveis. Ornamentos não devem parecer objetos coletáveis por acidente |
| Fundo de batalha | Composição lateral compatível com os combatentes; primeiro plano disponível para participantes e interface; arquitetura coerente com a área explorada |
| Ícone | Um objeto ou símbolo dominante, enquadramento central e margem consistente; mestre 256 × 256, leitura validada a 32 × 32; sem números, letras ou raridade embutidos |
| Interface | Pedra escura, metal gasto e detalhes discretos de latão. Molduras finas, foco visível e áreas de texto limpas. Contadores, descrições e barras são desenhados pelo jogo |
| Efeito visual | Forma e duração legíveis, paleta relacionada à ação; não encobrir permanentemente combatentes ou barras |

Os tamanhos de mestres e células propostos são a base inicial de produção escolhida neste guia; devem ser testados antes da produção em lote. Ajustar uma categoria inteira de forma documentada se a validação mostrar necessidade. Não mudar escala ou proporções individualmente para acomodar um resultado isolado.

## Integração com o RPG Maker MV

Foram consultados os arquivos locais do motor para os padrões nativos: ícones de 32 × 32, retratos de rosto de 144 × 144 e recorte de combatentes do jogador em grade de 9 colunas por 6 linhas. O formato final deve respeitar o consumidor real do asset.

Para personagem individual de mapa, utilizar a convenção nativa com prefixo `$`, três colunas de quadros e quatro linhas de direção, validando a sequência no motor. Na base de 48 × 64, a folha resultante é 144 × 256. A altura visual de 64 não muda a grade de colisão do mapa.

Na base de 96 × 96 para combatente nativo do jogador, a folha completa tem 864 × 576. Respeitar os índices de movimentos utilizados pelo motor; não preencher a grade com poses em ordem arbitrária. Dimensões maiores são possíveis para criaturas, desde que o sistema de animação escolhido aceite e a escala de cena seja preservada.

Inimigos animados exigem uma solução compatível a ser implementada e documentada. A grade do jogador não deve ser presumida como suporte automático a inimigos. O formato deles será fixado ao validar o primeiro inimigo animado.

Tiles comuns e autotiles têm layouts diferentes. Não importar uma textura solta como se fosse um tileset funcional. Montagem, recortes, máscaras e posicionamento de folhas são etapas técnicas que precisam de validação determinística.

Entregar PNG para arte raster integrada, com transparência real em sprites e assets isolados quando necessária. Não aceitar fundo quadriculado pintado como transparência. Preservar mestres fora dos diretórios carregados pelo jogo; exportar para img/ somente os arquivos finais necessários. Redimensionar a partir do mestre e verificar bordas, halos e perda de detalhe.

## Referências e continuidade

O responsável adicionará exemplos visuais de outros jogos a doc/prints/ para orientar a geração. Identificar o papel de cada exemplo antes de adotá-lo como referência do projeto; manter o padrão de estilo e registrar qualquer ajuste necessário no guia.

Usar três tipos de referência claramente identificados em cada geração:

1. Referência do original: identidade do objeto, personagem, criatura ou local, com arquivo/página ou seção da fonte.
2. Referência de estilo: exemplo visual do projeto já validado, quando existir.
3. Referência de continuidade: ficha do personagem ou objeto, com proporções, cores e detalhes que não podem mudar.

Não usar os materiais locais de outros projetos encontrados em doc/wiki/ como padrão aprovado de Arena. A arte original orienta a identidade; a versão dark fantasy deve manter o padrão deste guia.

Para cada personagem ou criatura, criar primeiro uma ficha-base. Registrar rosto, proporções, cores, roupas, equipamento e traços identificadores antes de derivar retratos, sprites e animações. Não regenerar cada pose como um personagem independente.

## Referências de mecânicas em doc/prints

As imagens de outros jogos em doc/prints/ exemplificam HUDs, inventários, loot e quests e orientam organização de telas, slots, interações e apresentação de mecânicas. Solicitar novos exemplos ao responsável quando uma necessidade específica de desenvolvimento não estiver coberta pelas imagens disponíveis. Não bloquear escolhas locais já orientadas pelos requisitos apenas para pedir mais referências. A direção dark fantasy deste projeto tem prioridade: referências externas não substituem paleta, acabamento, materiais ou identidade visual definidos neste guia. Para cada imagem utilizada, registrar o jogo de origem quando identificável, o arquivo e o aspecto aproveitado. Não presumir uma mecânica completa a partir de uma imagem estática.

Adaptar a referência à direção dark fantasy de Arena, aos controles e à legibilidade em navegador/mobile. A presença de uma imagem não aprova automaticamente novas features nem altera o escopo. Usar as imagens como referência, mantendo os assets finais gerados para o projeto e os plugins desenvolvidos pelo Codex.

## Aparência do jogador por armadura equipada

O sprite do jogador deve ser atualizado conforme a armadura equipada. Preparar representações coerentes para o personagem de exploração e o combatente Side View, preservando rosto, corpo, paleta de identidade e proporções enquanto a armadura muda.

Vincular os registros de armadura aos respectivos recursos ou configurações visuais. Equipar, substituir ou remover uma armadura deve atualizar a aparência para o estado correspondente. Carregar uma partida deve reconstruir a aparência a partir dos equipamentos salvos, sem depender de uma troca manual para corrigir o sprite.

Definir uma aparência-base para a ausência de armadura. Caso um recurso visual esteja ausente, usar um fallback documentado e registrar a pendência; não apresentar esse fallback como implementação completa da aparência da armadura.

A solução técnica poderá utilizar folhas completas alternativas ou composição por camadas. Escolher durante a implementação, considerando animações, quantidade de combinações e desempenho em navegador e mobile; não gerar todas as combinações antes dessa validação. Se houver vários slots de armadura, documentar quais peças mudam o visual, a prioridade e a ordem de camadas, sem ignorar peças silenciosamente.

Não ampliar automaticamente este requisito para armas, acessórios, retratos ou ilustrações narrativas. Essas representações adicionais permanecem fora desta decisão até serem especificadas.

### Validação visual e funcional

- Equipar duas armaduras de teste produz as aparências correspondentes, coerentes entre mapa e combate.
- Remover a armadura restaura a aparência-base definida.
- Trocas por arrastar e soltar e por seleção atualizam os mesmos dados e a mesma aparência.
- Movimentação, direção, animações e alinhamento dos pés permanecem corretos após a troca.
- Salvar e carregar preserva o equipamento e reconstrói o visual correto.
- Recursos ausentes seguem o fallback registrado sem interromper o jogo; a limitação fica explícita.

Os formatos finais e o mapeamento por peça serão validados antes de produzir a biblioteca de variações.

## Estrutura obrigatória do prompt

Manter o bloco de estilo constante e mudar apenas a especificação do asset. Um mesmo texto de prompt ajuda a consistência, mas não garante continuidade sem referências e revisão visual.

```text
PROJETO: Releitura de Arena no RPG Maker MV.
ESTILO FIXO: Fantasia medieval sombria; pintura digital figurativa;
materiais críveis e envelhecidos; paleta terrosa pouco saturada,
sombras frias e acentos quentes; silhueta clara; acabamento coerente
com os assets de referência do projeto; sem estética chibi ou anime.

CATEGORIA E USO: [categoria, tela ou cena, tamanho final de leitura].
IDENTIDADE: [sujeito, características e fonte do original].
REFERÊNCIAS: [papel de cada imagem/arquivo; não alegar imagem anexada se ausente].
CONTINUIDADE: [traços, cores, proporções e equipamento a preservar].
CÂMERA E COMPOSIÇÃO: [ângulo, enquadramento, direção, margens e ponto de apoio].
LUZ E MATERIAIS: [luz-base; exceções justificadas da cena].
SAÍDA: [mestre, fundo, transparência e organização necessária].
EVITAR: texto, números, marcas-d'água, bordas cortadas, anatomia
inconsistente, detalhe que desaparece na escala final, mudança de estilo.
```

Em folhas de animação, acrescentar a lista exata de movimentos, células e invariantes; gerar e revisar movimentos em etapas quando isso preservar melhor a identidade. A geração não substitui a montagem e a verificação da folha no motor.

## Processo de geração e controle de qualidade

1. Selecionar conteúdo do primeiro marco e registrar fontes. Criar a ficha-base e preencher o prompt.
2. Gerar um exemplo por categoria necessária: ilustração, personagem de mapa, combatente do jogador, inimigo, ambiente e ícones.
3. Comparar os exemplos lado a lado e em tela de jogo. Registrar os exemplares validados como referências de estilo; não produzir a biblioteca inteira antes dessa etapa.
4. Derivar variantes e animações preservando as fichas. Corrigir desvios antes de integrar.
5. Validar visualmente e tecnicamente no tamanho final, incluindo legibilidade em tela mobile. Não presumir qualidade pela imagem ampliada.
6. Registrar alterações deste guia e atualizar referências quando o padrão mudar. Não substituir assets já integrados silenciosamente.

Reprovar assets com estilo divergente, identidade inconsistente, câmera incorreta, cortes, sombras incompatíveis, anatomia quebrada, transparência falsa, costuras evidentes ou ilegibilidade no tamanho final.

## Registro por asset

Registrar em doc/arte/ o identificador, categoria, versão deste guia, fontes, ferramenta/modelo quando disponível, prompt completo, referências efetivamente usadas, arquivo mestre, arquivo exportado, dimensões e resultado da validação. Criar essa pasta ao produzir os primeiros assets. Seeds, quando oferecidas pela ferramenta, são auxiliares e não garantia de consistência.

Usar nomes descritivos e estáveis, por exemplo `arena_dungeon_pedra_parede_v01.png` nos mestres. Respeitar as convenções exigidas pelo motor nos arquivos exportados. Manter textos e contadores separados da arte para permitir tradução e atualização de dados.

## Áudio

Este guia padroniza os assets visuais. Não gerar vozes. Música e efeitos devem reforçar a mesma atmosfera, mas sua direção sonora ainda será especificada; não presumir que a paleta visual defina instrumentos ou composição musical.

## Identidade reconhecível de Arena — refinamento 1.1

Dark fantasy é tratamento, não substituição da identidade de Arena por fantasia medieval genérica. Preservar silhuetas, proporções, materiais e sinais arquitetônicos reconhecíveis nas referências originais; não adotar pixel art/baixa resolução automaticamente. Prints imperiais fornecidos pelo responsável devem ser examinados antes de gerar e efetivamente anexados ou descritos com rastreio explícito. Logos de vídeo, numeração, HUD, textos sobrepostos, armas/mãos do jogador e rotas desenhadas no mapa não são arquitetura/textura.

Dungeon: piso de grandes lajes planas, sujas, marrons/ardósia com juntas largas, distinto das paredes de grandes blocos retangulares cinza-violeta em fiadas. Escala coerente com cela/corredor, poucas pedras por tile; não miniaturizar alvenaria em mosaico nem aplicar o mesmo ruído em todas as superfícies. Grades e portas retangulares, correntes grossas com argolas, nichos elevados e vestígios de prisão são marcadores; usar os confirmados para cada área. Frio, escuro e opressivo, mas com piso/passagens legíveis. Converter câmera em primeira pessoa para corte superior ortográfico sem isometria, mantendo material e função; não desenhar teto que oculte o espaço de exploração.

Rato: corpo pesado arqueado, cabeça alongada baixa, focinho/dentes expostos, patas dianteiras robustas e expressão hostil conforme rat.png e vistas decodificadas. Evitar rato naturalista dócil de olhos grandes e redondos. Perfil lateral para Side View, continuidade entre quadros e leitura real96×64/escala testada. Estudos de preparação/bote/recuperação são apenas trechos, não uma animação completa de combate; ausência de dano/morte ou baixa variação deve permanecer declarada.

Ilustrações narrativas reutilizáveis: NÃO mostrar o personagem do jogador, mãos, braços, silhuetas, sombras corporais ou reflexos que fixem raça, gênero ou equipamento. Usar ambientes/objetos/Ria/personagens narrativos necessários. Ria deve remeter à referência: aparição azul-fria, cabelo longo escuro e manto/tecido claro luminoso. Braços de Ria não são braços do protagonista, mas devem estar inequivocamente ligados à aparição. A regra não elimina sprites/retratos próprios da criação de personagem. A ilustração anterior com prisioneira bretã fica rejeitada para uso narrativo reutilizável.

Aprovação estética do responsável é agora requisito explícito de fechamento desta revisão M01-06, separado dos testes técnicos. Conservar versões anteriores para comparação; não usá-las como imagem de estilo anexada aos novos prompts. Nenhuma produção em lote antes dessa aprovação.
