# Direção de arte e padrão de geração

Fonte principal de identidade visual, personagens/animações e processo de assets. Para geometria, portas e objetos, prevalece [DIRETIVA_DE_MAPAS.md](DIRETIVA_DE_MAPAS.md); para apresentação e entrada, [DIRETIVA_DE_NAVEGACAO.md](DIRETIVA_DE_NAVEGACAO.md). O fluxo de entregas está em [DESENVOLVIMENTO_E_VERSIONAMENTO.md](DESENVOLVIMENTO_E_VERSIONAMENTO.md).

## Regras obrigatórias de continuidade

- Reaproveitar primeiro os assets aprovados; manter identidade Arena e acabamento dark fantasy. Fontes de baixa definição não autorizam fantasia genérica. Distinguir fato da fonte, interpretação e adaptação.
- Projeção conforme uso: mapa superior **ortogonal**, batalha lateral e narrativa conforme a cena. A vista de personagens de exploração deve ser compatível com a grade ortogonal; não converter objetos/cenário para isometria. Jogador de batalha à esquerda voltado à direita; inimigos no lado oposto. Não aplicar a pose dos retratos às outras categorias.
- Padronizar por categoria escala aparente, orientação, enquadramento, linha dos olhos/pés, margens e transparência real. Distinguir tamanho de arquivo/célula de pixels ocupados e recorte/escala do consumidor. Não deformar anatomia racial para caber no contorno humano.
- Cabeça, pescoço, tronco e olhar anatomicamente coerentes; retratos seguem a seção de pose e seu bloco fixo. Espelhamento não corrige torção entre partes do corpo.
- Animações mantêm canvas, escala, âncora e apoio estáveis. Caminhada exige articulação real, direções e fases coerentes, não imagem estática transladada. Produzir variantes direcionais quando necessárias; conferir perspectiva, luz e mão da arma antes de qualquer reflexão técnica documentada.
- Armas acompanham a mão em aproximação, ação e retorno, com pega, posição, rotação, escala e espelhamento coerentes. Alternar frente/trás por pose quando necessário, sem prioridade global que oculte problemas. Preservar movimentos aprovados; ausência de movimento não pode ser escondida por fallback silencioso.
- Assets isolados têm fundo transparente e não incorporam piso/parede para compensar integração incorreta. Ilustrações narrativas não representam o protagonista, inclusive partes do corpo, silhuetas, sombras ou reflexos que determinem raça, gênero ou equipamento. Não gerar vozes.
- Corrigir também a configuração/gerador que origina o resultado, sem modificar arte aprovada para contornar erro de integração.

## Estados e validação

Aprovação estética, funcionamento técnico e cobertura são estados distintos. A direção e os arquivos anteriormente aprovados continuam preservados, inclusive suas ressalvas aceitas. M01-07 mantém recortes/orientações heterogêneos aceitos; não corrigir agora por associação. Referências e pendências: [arte/PENDENCIAS_VISUAIS_M01_07.md](arte/PENDENCIAS_VISUAIS_M01_07.md) e [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md). Introdução/encerramento aprovados e caminhada funcional no relato integrado de28/10/2026; escopo exato em [VALIDACAO_M01.md](VALIDACAO_M01.md#teste-integrado-informado-pelo-responsável--28102026). Isso não aprova o encaixe da arma nem todas as variantes/casos. Preservar ilustrações; melhorias futuras estão no registro único citado.

Dimensões iniciais e configurações de uma amostra não são padrão universal aprovado: consultar o consumidor e o registro da versão. Antes de integrar, conferir na escala real e no jogo projeção, anatomia, recortes, margens/alpha, direções, apoio/âncora, continuidade e identidade entre categorias; para armas, pega e planos ao longo da ação. Automação de dimensões não comprova anatomia ou fluidez. Registrar o que foi realmente visto/testado, separando navegador, autoria no editor e aparelho físico. Aplicar apenas os critérios pertinentes à alteração.

## Identidade visual

Exceção aceita para o conjunto atual: manter os arquivos aprovados com seus defeitos conhecidos, listados em arte/PENDENCIAS_VISUAIS_M01_07.md, sem retrabalho estético neste fechamento. As diretivas abaixo de anatomia/pose/escala, fontes, continuidade e validação continuam obrigatórias para futuras gerações. Aprovação para avançar não demonstra padronização perfeita, folhas de animação completas, recortes técnicos corrigidos ou teste físico no aparelho. R04B permanece estudo fora do catálogo ativo; não forçar substituição de sprites por um piloto incompleto.

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
| Personagem de mapa | Vista de exploração compatível com o mapa superior ortogonal, sem perspectiva isométrica. Base inicial de célula 48 × 64 para humanoides, pés alinhados; frente, costas e perfis coerentes |
| Combatente Side View | Corpo inteiro, postura de perfil/três quartos lateral, identidade igual ao retrato e sprite de mapa. Base inicial de célula 96 × 96 para humanoides, pés na mesma linha e sem cortes de arma |
| Inimigo | Mesmo acabamento e escala relativa dos personagens; dimensões maiores justificadas por porte. Animação própria, não apenas efeitos sobre imagem estática |
| Ambiente e tiles | Vista superior ortogonal consistente, grade de 48 × 48 como base; superfícies repetíveis sem costuras, portas e passagens reconhecíveis. Ornamentos não devem parecer objetos coletáveis por acidente |
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

Fluxo obrigatório, inclusive para correções:

1. Identificar arquivo/versão existentes, defeito observável e critério de aceitação. Conferir as diretivas, o consumidor e a referência aprovada antes de gerar.
2. Localizar a causa: configuração, recorte, escala, âncora, camada ou integração devem ser corrigidos nessa origem; não regenerar arte para compensar erro de código. Reaproveitar o asset adequado.
3. Se faltar conteúdo artístico, produzir **uma unidade representativa ou pequeno conjunto coerente**, com referências efetivamente fornecidas. Preservar a versão aprovada; o protótipo fica identificado como candidato.
4. Integrar a amostra isolada e inspecionar na escala real/contexto do jogo, incluindo animação quando aplicável. Se surgir defeito recorrente, interromper a expansão e corrigir o padrão primeiro.
5. Apresentar o protótipo e seus limites para avaliação. **Não iniciar o lote completo na mesma entrega que apresenta um padrão visual novo ainda não aprovado.** Aprovação do protótipo autoriza continuidade somente no escopo efetivamente aprovado, sem comprovar todas as variantes.
6. Em entrega separada e autorizada, ampliar somente o subconjunto necessário, mantendo as referências aprovadas e os critérios. Atualizar também os geradores pertinentes e conferir que a reconstrução conserva a correção.

## Registro por asset

Manter em doc/arte/ somente rastreabilidade útil para reproduzir e decidir: arquivo/versão (mestre e export quando distintos), referência efetivamente usada e seu papel, prompt de geração/edição, parâmetros e transformações relevantes (dimensões, recorte, escala, âncora), estado de aprovação e evidência correspondente. Indicar ferramenta/modelo/seed quando disponíveis, sem inventar dados. Não duplicar catálogos completos, hashes e relatórios a cada tentativa; referenciar o registro existente e acrescentar apenas a mudança relevante. Preservar versões aprovadas e estudos necessários à comparação, sem promovê-los a referência definitiva.

Nomes estáveis e descritivos, respeitando o consumidor MV. Textos/contadores separados da arte. A preservação dos registros existentes não autoriza expandir a produção.

## Áudio

Este guia padroniza os assets visuais. Não gerar vozes. Música e efeitos devem reforçar a mesma atmosfera, mas sua direção sonora ainda será especificada; não presumir que a paleta visual defina instrumentos ou composição musical.

## Identidade reconhecível de Arena — refinamento 1.1

Dark fantasy é tratamento, não substituição da identidade de Arena por fantasia medieval genérica. Preservar silhuetas, proporções, materiais e sinais arquitetônicos reconhecíveis nas referências originais; não adotar pixel art/baixa resolução automaticamente. Prints imperiais fornecidos pelo responsável devem ser examinados antes de gerar e efetivamente anexados ou descritos com rastreio explícito. Logos de vídeo, numeração, HUD, textos sobrepostos, armas/mãos do jogador e rotas desenhadas no mapa não são arquitetura/textura.

Dungeon: piso de grandes lajes planas, sujas, marrons/ardósia com juntas largas, distinto das paredes de grandes blocos retangulares cinza-violeta em fiadas. Escala coerente com cela/corredor, poucas pedras por tile; não miniaturizar alvenaria em mosaico nem aplicar o mesmo ruído em todas as superfícies. Grades e portas retangulares, correntes grossas com argolas, nichos elevados e vestígios de prisão são marcadores; usar os confirmados para cada área. Frio, escuro e opressivo, mas com piso/passagens legíveis. Converter câmera em primeira pessoa para corte superior ortográfico sem isometria, mantendo material e função; não desenhar teto que oculte o espaço de exploração.

Rato: corpo pesado arqueado, cabeça alongada baixa, focinho/dentes expostos, patas dianteiras robustas e expressão hostil conforme rat.png e vistas decodificadas. Evitar rato naturalista dócil de olhos grandes e redondos. Perfil lateral para Side View, continuidade entre quadros e leitura real96×64/escala testada. Estudos de preparação/bote/recuperação são apenas trechos, não uma animação completa de combate; ausência de dano/morte ou baixa variação deve permanecer declarada.

Ilustrações narrativas reutilizáveis: NÃO mostrar o personagem do jogador, mãos, braços, silhuetas, sombras corporais ou reflexos que fixem raça, gênero ou equipamento. Usar ambientes/objetos/Ria/personagens narrativos necessários. Ria deve remeter à referência: aparição azul-fria, cabelo longo escuro e manto/tecido claro luminoso. Braços de Ria não são braços do protagonista, mas devem estar inequivocamente ligados à aparição. A regra não elimina sprites/retratos próprios da criação de personagem. A ilustração anterior com prisioneira bretã fica rejeitada para uso narrativo reutilizável.

Aprovação estética do responsável é agora requisito explícito de fechamento desta revisão M01-06, separado dos testes técnicos. Conservar versões anteriores para comparação; não usar a amostra rejeitada v0.1 como imagem de estilo anexada aos novos prompts. As referências aprovadas R02/R03 são o padrão de continuidade atual. Nenhuma produção em lote antes dessa aprovação.

## Continuidade após aprovação R02/R03

Usar os masters e exports identificados em `arte/APROVACAO_DIRECAO_R02_R03.json` como referências de continuidade nas gerações pertinentes. Preservar prompts e fontes. Rato R02 é intermediário; R03 é a referência principal aprovada. Novos derivados técnicos não recebem automaticamente aprovação de escala, alpha, recorte ou animação. Não regenerar imagens adequadas por conveniência. Durante a implementação dos diálogos, conferir composição, objetos e contexto com a cena narrada e registrar qualquer necessidade concreta de alteração. A proibição do protagonista nas ilustrações permanece. Não buscar novos prints sem lacuna específica.

## Prioridade explícita de fidelidade — atualização 25/10/2026

Arena é de 1994 e é executado neste ambiente por emulação DOS. Baixa definição é limitação da fonte, não justificativa para fantasia genérica. Priorizar a instalação original, seus arquivos/materiais e capturas do jogo para identidade visual, textos, quests, objetos e locais; wiki complementa interpretação e organização. Separar observação do executável, texto do manual, documentação técnica e informação da wiki. Quando divergirem, registrar versões/contexto/evidências e decisão explícita, sem escolher silenciosamente.

Melhorar definição/acabamento preservando silhuetas, materiais, cores características, arquitetura e função narrativa. Pixelização não é obrigatória. Detalhe ilegível permanece interpretação artística identificada, não fato confirmado. As adaptações já aprovadas de exploração 2D, turnos, interface e progressão continuam válidas. Referências de continuidade aprovadas em `arte/APROVACAO_DIRECAO_R02_R03.json`; não regenerar imagens adequadas sem necessidade concreta. Ilustrações narrativas sem protagonista, inclusive mãos, membros, silhueta, sombra/reflexo ou equipamento que fixe identidade. Revisar contexto/objetos ao implementar falas.

Preservar a instalação; consultas e extrações somente em área local ignorada, sem mods ou alterações no original. Não incorporar arquivos originais ao jogo distribuído. Relatórios e decisões podem ser versionados; exports de consulta não.

## Personagens M01-07 — revisão solicitada em 26/10/2026

Arena permanece a referência principal de identidade, materiais, roupas, cores e atmosfera. A pedido explícito do responsável, Skyrim orienta apenas a anatomia reconhecível de Argonianos (lagarto: escamas, focinho, mandíbula reptiliana; sem máscara humana/cabeça aviária) e Khajiit (focinho, nariz, orelhas e pelagem felinos). Esta é uma adaptação autorizada, não evidência de que Arena1994 já mostrava essas mesmas cabeças. Substitui a orientação anterior de manter Khajiit predominantemente humano; os prompts v01 permanecem como histórico. Não importar roupas, equipamentos, bônus, caudas, novas opções ou regras por associação.

Bosmer: orelhas pontudas e planos faciais élficos coerentes com Altmer/Dunmer do projeto, preservando pele, cabelo e trajes próprios; não copiar rostos, pele dourada/cinza ou olhos das outras raças. Os detalhes de crista, pelagem, olhos e estrutura facial dos novos assets são interpretação artística baseada nas referências indicadas em arte/REVISAO_PERSONAGENS_R02.md, não transcrição comprovada do executável.

Referência de acabamento/enquadramento: retrato da bretã piloto, preservado na v01. Retratos três quartos para a direita; bustos equivalentes, linha estimada dos olhos e cabeça aparente comparáveis, com espaço para focinhos/orelhas/cristas. Combatentes do jogador para a esquerda. Cada categoria tem sua escala própria: retrato144×144; exploração48×64; combate96×96. Padronizar por escala uniforme e pivô dos pés, sem deformação nem imposição de altura racial canônica. Preservar diferenças de proporção e a movimentação já existente. Distinguir célula, figura ocupada, margem alpha e recorte/escala da interface. Ver medidas e limitações no manifesto exportacoes-personagens-revisao-r02.json.

Manter mestres e exports anteriores para comparação. Apenas anatomia/pose exigem edição por IA; recorte, limpeza de matte e montagem são processamento técnico documentado. Não confundir células repetidas com animações produzidas. Aprovação geral da direção não equivale à aprovação estética desta revisão ou à validação no editor/aparelho. Ilustrações narrativas continuam sem protagonista; não foram alteradas nesta rodada.

## Diretiva obrigatória de pose e anatomia — revisão pose-r03

Seguir `arte/PROCEDIMENTO_RETRATOS.md` em toda geração/edição de personagens. Todas as direções referem-se à imagem vista pelo jogador. Retratos: **cabeça e tronco juntos** em três quartos para a direita, com peito, ombros, pescoço e olhar coerentes; cabeça naturalmente apoiada. Mesmo grau aproximado de giro entre combinações. Não basta apontar o nariz para a direita: proibir contrarrotação, olhar por cima do ombro e pescoço torcido. Não espelhar a imagem para tentar resolver relações anatômicas internas.

Referência explícita de pose/composição: `art/references/pose-personagens/breton-female-busto-v01.png`, extraída do retrato da piloto v01; identidade vem do alvo de cada combinação, estilo do acabamento do projeto em `art/masters/breta-piloto-v01.png`. Separar esses papéis em cada prompt e anexar apenas imagens realmente referenciadas como fornecidas. Derivados Argoniana/Khajiit feminina pose-r03 foram inspecionados para auxiliar a pose dos masculinos, sem receber aprovação estética. Arquivos/hashes/papéis em `arte/avaliacao-retratos-pose-r03.json`.

Bloco fixo obrigatório para prompts de retratos:

> Retrato de busto em três quartos. O personagem inteiro está orientado para a direita da imagem: peito, ombros, pescoço, cabeça e olhar seguem a mesma orientação, com alinhamento anatômico natural. Cabeça não está virada sobre o ombro. Sem tronco voltado à esquerda, sem contrarrotação, sem pescoço torcido. Seguir a referência de pose fornecida, preservando a identidade racial e o estilo aprovado.

Acrescentar identidade, escala, busto, linha dos olhos e margens. Não comprimir focinhos, orelhas ou cristas para contorno humano. Antes de integrar, conferir visualmente:

- Cabeça e tronco no sentido definido, com peito, ombros e pescoço plausíveis.
- Sem olhar por cima do ombro, contrarrotação ou torção involuntária; olhar acompanha o rosto.
- Ângulo próximo do gabarito, sem misturar frontal, perfil completo e três quartos.
- Escala aparente, linha dos olhos, busto e margens consistentes.
- Anatomia racial preservada e continuidade com exploração/combate.
- Leitura ampliada e nos144px reais da interface; guias somente em sobreposições de revisão.

Dimensões, alpha e testes automáticos são complementares, não prova de anatomia. Assets com falha permanecem em revisão e não viram referência aprovada. A inspeção técnica pelo Codex não substitui a avaliação estética do responsável.

Convenções independentes: exploração segue baixo/esquerda/direita/cima do MV; combatente do jogador fica à esquerda e aponta para direita (disposição vigente desde M01-11), com corpo/cabeça/ação coerentes; animações mantêm proporções, apoio e identidade entre quadros. Não alterar essas categorias para copiar a pose dos retratos. A rodada pose-r03 corrige somente quatro retratos e preserva os demais assets e regras; registro em `arte/REVISAO_POSE_RETRATOS_R03.md`.

## Identidade racial além do animal comum — pilotos R04

Argonianos/Khajiit devem ter leitura reconhecível dos personagens dessas raças em Skyrim, conforme pedido do responsável, preservando Arena como base de roupas, cores, função e acabamento. “Lagarto/gato humanoide” genérico é insuficiente. Antes de gerar, inspecionar faces reais identificadas e comparar crânio, arcadas/maçãs, olhos, focinho, mandíbula, escamas/pelagem e marcas. Separar observação da fonte, variação de presets e interpretação do piloto; chifres/adornos de um exemplo não são obrigação universal. Não importar regras raciais de Skyrim.

Diagnóstico e fontes efetivas em `arte/IDENTIDADE_ARGONIANOS_KHAJIIT_R04.md`: Argonianos precisam de planos cranianos/placas/arcadas mais definidos e garganta segmentada; Khajiit, estrutura facial menos arredondada, olhos/orelhas proporcionais e focinho/mandíbula mais marcados. A linguagem dark fantasy e a diretiva de pose1.4 permanecem obrigatórias. Preservar diferenças individuais e de masculino/feminino na estrutura facial, não apenas cor/roupa. Fontes sem legenda de sexo não comprovam dimorfismo.

Validar primeiro um exemplo por raça antes de multiplicar gêneros/direções/variantes. Nesta rodada somente dois pilotos masculinos fora do catálogo ativo; não comprovam as combinações femininas. Verificar alpha por composição opaca e valores de pixels, não somente prévia bruta: cores RGB sob alfa zero foram inicialmente confundidas com halo em R04, depois corrigido o diagnóstico. As fontes têm transparência real e componentes separados; o combatente Khajiit alcança a borda e permanece pendente de correção do pé. Candidatos em art/candidates não são referência aprovada nem substituição silenciosa dos ativos. Linhas de revisão ficam nas pranchas. Não regenerar outras raças, narrativa ou biblioteca inteira por associação.


## Continuidade dos movimentos — M01-10 R03

Expansão somente dos15 personagens/2 inimigos faltantes, mantendo piloto/rato R02 aprovado byte a byte. Referências de identidade por combinação, coreografia aprovada separada; nenhum retrato regenerado.22 prompts e masters, limites/retornos neutros reutilizados e inspeção real no motor registrados em EXPANSAO_COMBATE_M01_10_R03.md. Pranchas e vídeos de variantes são inspeção Codex, não aprovação estética do responsável. Preservar fontes e estudos incompletos; não voltar à geração artística sem necessidade concreta.


## Apresentação M01-11, sem nova geração

Nenhum retrato, participante ou animação regenerado. Atlases/tempos M01-10 preservados; inversão dos lados é transformação coerente de corpo e arma no motor. Estudo da cela R02 e ícones IA de adaga/poção reaproveitados em cenário/UI técnicos; poções recebem matiz apenas de apresentação. Ícones lineares de comandos são elementos próprios de interface. Capturas/vídeo reais em evidencias/m01-11, sem atribuir aprovação manual de animações à nova UI. Cenário ilustrado não define o layout final da dungeon.


## Revisão de UI M01-11 R02

Responsável aprova combate/animações atuais na solicitação de refinamento da interface (base30e441d). Nenhuma regeneração ou alteração de movimentos/arte nesta rodada. Indicadores compactos sem caixas; menus inferiores com molduras finas, cantos arredondados, cores escuras/seleção verde e slots identificados, conforme prints de composição. Desenho de elementos de UI próprio por código, sem importar assets/regras do projeto consultado. Isso não promove a nova UI a aprovada: aguarda avaliação visual. Referências/evidências em REVISAO_INTERFACE_M01_11_R02.md.


## Integração M01-12

M01-12 reutiliza pixels/poses aprovados das16 identidades. Somente dois materiais IA gerados: couro/malha, com prompts completos, hashes, dimensões, masters e arquivos de consumo em arte/MATERIAIS_M01_12_*.json e art/m01-12. Aplicação em regiões de torso é amostra técnica mínima, não silhueta completa/figurino final ou aprovação estética. Mapas/retratos/narrativa/animações não foram regenerados. Avaliar encaixe e leitura antes de expandir produção; limites e cobertura em INVENTARIO_E_EQUIPAMENTOS_M01_12.md.


## Atualização M01-14

M01-14 reutiliza piso/alvenaria R04 e sprites aprovados; um atlas IA complementar v01 (cap/porta/Gate quadrado azul/água/plataforma/correntes). Prompts/referências efetivas em arte/DUNGEON_M01_14_PROMPTS.json. Cor azul do Gate vem do print original, sem trocar por portal circular genérico. Não há narrativa com protagonista. Recortes/células/escala e simplificações constam em DUNGEON_M01_14.md e dependem de avaliação do responsável; não promover complementos a aprovados automaticamente.

## Cenário: fonte principal

Encaixe de teto/parede/vão, moldura/dobradiças, orientações de objetos, água, colisão e oclusão estão consolidados em [DIRETIVA_DE_MAPAS.md](DIRETIVA_DE_MAPAS.md). Aplicações históricas e registros de arte: DUNGEON_M01_14_R02.md, DUNGEON_M01_14_R03.md e arte/DUNGEON_M01_14_R03_*.json; não recuperar suas simplificações oblíquas como regra vigente.

## Aprovação do mapa e ressalva futura — 27/10/2026

Resultado visual/estrutura da R03 no estado disponívelb194b44 aprovados pelo responsável. Não regenerar os assets aprovados nesta rodada. Portas laterais têm orientação e formato corretos; futuramente avaliar espessura aparente, contraste e legibilidade, preservando âncoras, moldura, animação, projeção e colisão. Sem mudança implementada. A ressalva não bloqueia o próximo backlog; a pendência de autoria no editor é separada. Evidência/escopo em APROVACAO_MAPA_M01_14.md.

## Integração M01-18 R02 — convenções de caminhada e narrativa

Retratos mantêm a diretiva de pose/anatomia existente; não aplicar suas orientações à exploração. Folhas de exploração usam baixo/esquerda/direita/cima, com repouso na coluna central e passos articulados nas pontas. Não apresentar deslocamento de figura estática como caminhada. Documentar arquivo/célula, margens, tamanho efetivo da figura e pivô separadamente. R02 usa células64×64 com altura nominal56 para15 personagens; a Bretã feminina aprovada mantém48×64. Apoio nominal62, sem deformar corpo ou comprimir focinhos/orelhas/caudas.

A montagem pode refletir uma pose bilateral compatível para uma fase oposta ou orientação; registrar quais células, conferir roupas, luz e mão da arma. Isso não corrige torção anatômica nem autoriza espelhar retratos indiscriminadamente. Rato possui compensação vertical norte10px, baseada nas patas/ground52, evitando ancoragem pela ponta da cauda. Animações de batalha aprovadas permanecem byte a byte.

Ilustrações narrativas: sem protagonista, mãos, braços, silhuetas/reflexos que fixem sua raça/gênero/equipamento. Ria é NPC identificada. Cada momento possui imagem e texto próprios; preservar proporção, margens e legibilidade. Registrar objetos/arquitetura/heráldica interpretados, sem apresentá-los como informação visual confirmada do original. Novas imagens R02 são candidatas à avaliação, não referências automaticamente aprovadas. Prompts, arquivos, estudos não selecionados, recortes e referências efetivamente fornecidas: arte/m01-integracao-r02/.

## Registros iniciais de aplicação — históricos

Os relatos abaixo preservam o contexto das entregas; não substituem as regras acima nem o estado R02 em REVISAO_INTEGRACAO_M01_18_R02.md.

## Uso narrativo M01-18

Ria R02 aprovada é reutilizada sem regeneração/edição, com quadro integral e texto em coluna separada. Nenhum protagonista nas ilustrações. Cronologia I01–I05 é textual para não apresentar a visão de Ria morta como cena da corte anterior à morte. Fonte visual original e hash/prompt já aprovado identificados em arte/USO_RIA_M01_18.md; nova composição de leitura permanece para avaliação, sem atribuir aprovação estética automática ao teste técnico.

Estado atual M01-12: movimento/identidade atuais preservados e combate considerado satisfatório pelo responsável em rodada anterior. Gerados somente dois materiais de torso (couro/malha), sem novas poses/retratos; amostra mínima em revisão, não figurino final. Registros completos em arte/MATERIAIS_M01_12_*.json. Relatos de cobertura parcial M01-10 abaixo são históricos.

Aprovação posterior de animação: R02 (entrega a61977b) aprovado pelo responsável para Bretã feminina/rato; registro em decisoes/M01_10_APROVACAO_ANIMACOES_R02.json. Preservar desenhos/tempos/fluidez desses exemplos. Expansão para os15 personagens/2 inimigos restantes foi explicitamente priorizada antes de integrar M01-10 e iniciar M01-11; gerar somente o que falta. A aprovação do piloto não aprova automaticamente novas variantes nem testes não executados. Relato de R02 ainda pendente abaixo é histórico.

Adendo M01-10 R02 (vigente): revisão restrita ao piloto Bretã/rato, com desenhos novos de intermediários, gestos e duas armas separadas. Sem regenerar retratos ou produzir combinações de equipamento em lote.66 quadros auditados e vídeos nativos complementam pranchas; contagem/alpha não aprovam fluidez/anatomia. Estudos unidos/recortados rejeitados e preservados; manifesto arte/COMBATE_MOVIMENTOS_R02_MANIFEST.json. Aprovação anterior não se estende automaticamente a R02;15 personagens/2 inimigos não revisados. Restrições narrativas, identidade e dark fantasy continuam; prints de UI apenas orientam M01-11. Relatos R01/R05 abaixo são históricos.

Adendo M01-10 R01: novas folhas de combate não herdam aprovação R05. Preservados todos os retratos/exploração e fontes aprovadas; referências laterais r02 e rato r03 fornecidas à IA para continuidade. Goblin/Lizard Man usam também sprites identificados no PDF local Arena_Monsters p.6/13, somente consulta ignorada. Manifesto, prompts integrais e pranchas em arte/COMBATE_M01_10_MANIFEST.json e COMBATE_M01_10.md. Quatro estados de três quadros exercitados no motor; gesto corporal genérico sem arma desenhada ainda não encerra a apresentação. Manter revisão de identidade/roupa/apoio; nenhuma imagem nova é promovida automaticamente a referência estética. Sem novas ilustrações narrativas ou retratos.

Versão 1.6 — 26/10/2026. A direção da dungeon R02, rato R03 e Ria espectral R02 foi aprovada em25/10/2026, por arquivo/hash em arte/APROVACAO_DIRECAO_R02_R03.json. M01-06 encerrou a amostra desktop conforme arte/ENCERRAMENTO_AMOSTRA_M01_06.md. Em R05 o responsável aprovou as artes atuais de M01-07 **para prosseguir com ressalvas**, por arquivo/versão/hash em arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json. Recortes e orientações heterogêneos não foram corrigidos. Não houve novas gerações/correções nesta rodada. A rodada inicial v0.1 continua histórica e rejeitada para narrativa; a aprovação atual não reabilita usos narrativos proibidos.
