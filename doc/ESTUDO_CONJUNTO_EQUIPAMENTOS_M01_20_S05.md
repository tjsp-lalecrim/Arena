# M01-20/S05 — orçamento do conjunto completo

Complemento de [S04](ESTUDO_ESCALA_PROGRESSAO_M01_20_S04.md), base **abbc357**, 29/10/2026. **Somente estudo:** três pontos/+1, fórmula S02 e todos os números de equipamento continuam não aprovados. E04 não executado. Não altera itens, slots, aparência, saves ou Pages.

**Consolidação vigente [S06](DIRECAO_PROGRESSAO_M01_20_S06.md):** compara quatro funções de conjunto, sem usar MDF/SOR como compensação nominal; mantém categorias/fontes deste estudo como propostas. E05 é o único piloto candidato posterior, em lugar de E04, sem autorização de execução. O orçamento defensivo abaixo é um controle histórico, não decisão para os quatro perfis.

## Fontes e adaptação de categorias

Consulta local, sem nova pesquisa externa ou observação de gameplay: PDFs de `doc/wiki/`, prefixos **Arena_Equipment** (pp.1–2), **Arena_Items** (pp.1–2), **Arena_Base Armor** (pp.1–3), **Arena_Base Weapons** (pp.1–3) e **Arena_Magic Items** (pp.1–2), todos com sufixo ` - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`. Fonte primária instalada: `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\Docs\Manual.pdf`, seção *Mouse In Character/Equipment Sheet* e *Hand grabbing icon—Use*; **Arena Codex Scientia.pdf**, página PDF140/numeração impressa133, seções *Marks, Crystals, Bracers & Rings* e *Bracelets, Belts, Torcs & Amulets*. Extrações de consulta em `tmp/m01-20-equip-fontes/`, ignorado; original intacto.

| Categoria original / simultaneidade | Função confirmada | Proposta de correspondência nos cinco slots atuais |
| --- | --- | --- |
| Arma: uma em uso; uma de duas mãos impede escudo | Dano/acerto, conforme tipo e material | **Arma**, uma. Adaga/espada curta do M01 são de uma mão. Sem segunda arma; incompatibilidade de duas mãos só quando houver esse conteúdo. |
| Escudo: um, incompatível com arma de duas mãos | Proteção | **Escudo**, um; contribuição à DEF global orçada, sem novo aparo. |
| Elmo: proteção da cabeça | Proteção localizada | **Cabeça**, um; manter categoria reconhecível. |
| Couraça, ombreira direita, ombreira esquerda, manoplas, grevas e botas: seis peças/posições distintas | Peito/costas, cada ombro/braço, mãos, cintura/pernas e pés | Agrupar em **Corpo**, um traje de seis partes, não seis bônus independentes. Elmo permanece separado: são sete peças originais de armadura. |
| Braceletes (*bracelets*), cintos, torques e amuletos: **um de cada tipo equipado** (Codex) | Efeito passivo sobre atributos e proteção | Agrupar como **Acessório**, um entre os quatro tipos. Redução deliberada de combinações; não alegar equivalência com quatro espaços do original. |
| Braçadeiras (*bracers*), cristais, marcas e anéis: **um de cada tipo ativo/realçado** (Codex) | Magia por comando de uso, diferente de proteção passiva | Reservar como itens utilizáveis no inventário, não novos slots nem talentos nesta etapa. Seleção ativa/cargas futuras exigem contrato próprio. |
| Poções; itens de quest | Consumo por uso; quest não equipável | Inventário existente; não integram o orçamento equipado. |

Quantidades por região de armadura são a leitura da lista de peças/proteções, não teste novo de equipar todas no executável. O Codex explicita as quantidades dos acessórios. **Tipo** (adaga/escudo/elmo), **posição** (Arma/Cabeça), **material** (couro/malha/placa e metais) e **encantamento** (efeito do item) são eixos diferentes. A wiki atribui −3/−6/−9 à proteção de couro/malha/placa por região, reduzindo jogadas de ataque: não são DEF globais somáveis. Metais modificam propriedades; não criam slots. Encantamentos existem no original; isso não autoriza fabricação, cargas ou multiplicadores novos. Não importar restrições profissionais/raciais.

**Recomendação estrutural:** conservar os cinco slots para M01. Mantém troca de arma, escudo, cabeça, traje e escolha de acessório sem expandir a interface/persistência agora. Perde mistura de materiais por membro e acumulação dos quatro acessórios; essa simplificação exige aceite. A alternativa de preservar todas as partes custa mais cartões/paginação, compatibilidades, itens/drops e camadas de aparência, sem evidência de necessidade para esta demo. Não reservar posições fictícias nos saves: usar referências estáveis de tipo/item; qualquer expansão posterior exige migração explícita de slots, sem reinterpretar equipamento salvo por índice.

Hoje `System.json` já define esses cinco slots; somente Arma/Corpo têm itens. `Arena_Inventory.materialId` deriva o visual do `etypeId=4`, e `ArenaInventory.json` mapeia couro/malha. Portanto agrupamento aproveita a estrutura atual; cabeça/escudo/acessório **ainda não têm cobertura implementada ou artística**. Sem prometer sobreposições visuais prontas. Priorizar, se autorizado depois, um exemplar por espaço vazio para testar o conjunto; variações por material, catálogo original e assets por raça/gênero ficam para próximos marcos. Não conceder kit completo ao início da campanha.

## Orçamento proposto, distribuído entre peças

**Hipótese defensiva de comparação**, não catálogo nem conversão literal do original. Qualidade equivalente significa mesma faixa adaptada, não obrigar que acessório seja feito de couro/malha. Base parcial = adaga+couro do S04 (não inventário inicial da campanha). Espaços restantes vazios. Nenhum bônus percentual, de AGI ou ofensivo no acessório desta amostra.

| Espaço | Parcial básico | Completo básico equivalente | Completo melhorado representativo |
| --- | --- | --- | --- |
| Arma | ATQ+2 | ATQ+2 | ATQ+5 |
| Escudo | — | DEF+2 | DEF+3 |
| Cabeça | — | DEF+1/MDF+1 | DEF+2/MDF+1 |
| Corpo | DEF+3 | DEF+3 | **DEF+5** |
| Acessório | — | MDF+1 | MDF+3 |
| **Total equipado** | **ATQ2/DEF3/MDF0** | **ATQ2/DEF6/MDF2** | **ATQ5/DEF10/MDF4** |

Completar espaços, mantendo qualidade: **+3 DEF/+2 MDF**, zero ATQ. Melhorar o conjunto completo: **+3 ATQ/+4 DEF/+2 MDF**. MDF de cabeça/acessório é adaptação explícita de orçamento global, não propriedade confirmada dessas peças originais; não demonstra utilidade enquanto estes inimigos só causam dano físico. Acessório ofensivo futuro deve **substituir** parte desse orçamento de suporte, não somar ATQ/MAT gratuitamente. Não fixar proporção entre equipamento e pontos.

## Comparação pequena, mesmas premissas S04

Base sem peças: ATQ10/DEF5/MAT8/MDF5/AGI10/SOR10, Bretã feminina. Fórmula proporcional K8/piso0,20, pesada1,6 com penetração25%, Dardo3; sem raça ofensiva, variância, crítico ou guarda. Rato18HP/ATQ5/DEF2/MDF2/AGI9; goblin30/7/3/3/10. Física: nível3 ATQ+3/DEF+3; nível5 ATQ+6/DEF+3/AGI+3. Híbrida: nível3 ATQ+3/MAT+3; nível5 ATQ+3/DEF+3/MAT+3/MDF+3. São6/12 pontos, sem crescimento automático duplicado. Recursos aprovados permanecem: níveis1/3/5 =100/50/100,110/60/100,120/60/110 nas mesmas escolhas do S04.

Atributos **ATQ/DEF/MAT/MDF/AGI**, SOR10; danos em pares **rato/goblin**. P=parcial básico, C=completo básico, M=completo melhorado. Nível1 isola equipamento sem pontos; P nos níveis3/5 isola pontos; C/M combinam ambos.

| Nível/construção/conjunto | Atributos finais | Pesada causada | Dardo causado | Ataque recebido |
| --- | --- | --- | --- | --- |
|1/sem pontos/P|12/8/8/5/10|16/15|19/17|3/4|
|1/sem pontos/C|12/11/8/7/10|16/15|19/17|2/3|
|1/sem pontos/M|15/15/8/9/10|20/19|19/17|2/2|
|3/física/P|15/11/8/5/10|20/19|19/17|2/3|
|3/física/C|15/14/8/7/10|20/19|19/17|2/3|
|3/física/M|18/18/8/9/10|24/22|19/17|2/2|
|3/híbrida/P|15/8/11/5/10|20/19|26/24|3/4|
|3/híbrida/C|15/11/11/7/10|20/19|26/24|2/3|
|3/híbrida/M|18/15/11/9/10|24/22|26/24|2/2|
|5/física/P|18/11/8/5/13|24/22|19/17|2/3|
|5/física/C|18/14/8/7/13|24/22|19/17|2/3|
|5/física/M|21/18/8/9/13|28/26|19/17|2/2|
|5/híbrida/P|15/11/11/8/10|20/19|26/24|2/3|
|5/híbrida/C|15/14/11/10/10|20/19|26/24|2/3|
|5/híbrida/M|18/18/11/12/10|24/22|26/24|2/2|

**Limiares e escolhas:** DEF11→14 reduz o ataque bruto do goblin2,947→2,545, mas ambos arredondam3; DEF18 produz2,154→2. Mitigação tem retornos decrescentes, não ausência de ganho, mas recuperação completa e Vida120 tornam o conjunto muito resistente a estes inimigos. Concentrar12 pontos em DEF com M levaria DEF27: rato1/goblin2, sem atingir o piso de mitigação (DEF32). Não resolver elevando todos os inimigos ou tornando escudo obrigatório por mais bônus. O orçamento10 é teto candidato deste conjunto, **não equilíbrio demonstrado nem piso por peça**.

Iniciativa não muda ao completar/melhorar peças: contra goblin, escore estritamente maior42,9% em AGI10 (empates14,3%); física nível5/AGI13=82,1% (empates7,1%). AGI18 já supera sempre rato/goblin neste modelo; somar AGI nos acessórios poderia tornar pontos posteriores redundantes. MDF não muda nenhuma coluna de dano recebido atual; SOR continua sem benefício neste recorte. Investimentos nesses atributos não podem ser apresentados como equivalentes a DEF/ATQ neste conteúdo.

Não empilhar reduções percentuais para compensar orçamento: os conjuntos aqui têm PDR=MDR=1. Sensibilidade apenas ilustrativa: cinco fatores PDR0,90 multiplicam para0,59049, além da DEF; na física5/M, ataque bruto do goblin2,154 cairia para1,272→1. O piso0,20 da fórmula não limita reduções aplicadas depois dela. Percentuais e resistências raciais precisam de avaliação conjunta antes de autorizar peças com esses efeitos.

As armaduras atuais não possuem traits percentuais; o risco acima não é um defeito constatado nelas. Bônus raciais aprovados permanecem intactos: não estender esta projeção neutra a raças com vantagens físicas ou resistência mágica, nem somar novamente seus bônus ao carregar/equipar. Uma futura peça com resistência deve ser avaliada junto desses efeitos existentes, sem mudar regras raciais por associação.

## Conclusão e decisões antes do experimento

- **Espada ATQ+5:** conservar como candidato condicional; completar os outros espaços deste orçamento não acrescenta ATQ. Na física5/M, Atacar contra goblin15, leve19 e pesada26: Atacar e pesada podem ambos vencer em dois acertos. Isso preserva o alerta sobre utilidade/custo, não valida o número. Se acessórios ofensivos forem admitidos, reavaliar o total antes de manter5.
- **Malha DEF+8:** **não recomendar como bônus isolado** do Corpo com outros espaços preenchidos. Com escudo3/cabeça2, total de equipamento seria DEF13; física5 chega DEF21 e reduz rato a1 em vez de2. Propor Corpo5 e total do conjunto10, deixando espaço real para outras peças. Não é mudança aprovada nem proposta de nerf já aplicada; malha do banco continua6. Evitar copiar8 para todos os slots.
- Aprovar ou revisar: (1) cinco espaços e agrupamentos/perda de mistura do original; (2) conjunto defensivo total6/2→10/4 e repartição, inclusive a utilidade ainda não demonstrada de MDF; (3) espada5/Corpo5 em lugar do par5/8; (4) fórmula e pontos, ainda independentes. Definir cobertura mínima de itens/aparência antes de tocar nos slots reais. Catálogo completo, encantamento, duas armas e expansão de slots não são escopo autorizado.

E04/S04 permanece **suspenso**; seu controle de duas peças não representa um personagem completo. Antes de executá-lo, submeter uma revisão única do piloto Bretã/goblin incorporando o conjunto e decisões acima; não executar nem adicionar outro experimento nesta entrega. Sem metas de turnos aprovadas.

Reprodução focal: `node tools/simulate-equipment-set-m01-20.cjs`; [resultado](evidencias/m01-20-conjunto-equipamentos/simulacao.json),15 estados e2 sensibilidades da malha8. Reutiliza alocações de S03/dados atuais dos inimigos e valida somas de pontos/peças. Apenas aritmética: sem batalha, teste visual ou alegação de balanceamento; materiais originais não foram alterados.
