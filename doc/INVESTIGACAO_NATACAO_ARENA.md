# Natação em Arena — investigação e proposta não aplicada

27/10/2026. Associada à aprovação do mapa no estado disponível **b194b44**. Esta é pesquisa documental e de viabilidade de observação do executável, **não implementação de custo**. A adaptação atual continua sem consumo/regeneração de Vigor na água. A regra de gasto somente em técnicas de combate e os bônus P01–P08 permanecem intactos. Não usar regras de Skyrim como evidência de Arena.

## Resultado e grau de certeza

| Questão | Evidência encontrada | Classificação/limite |
|---|---|---|
| Nadar gasta recurso? | A wiki local Combat descreve perda rápida de **fatigue** na água. O manual descreve Argonianos como menos sujeitos ao cansaço ao nadar. | Confirmado documentalmente para Arena; fatigue é o recurso original, não uma medição do Vigor da adaptação |
| O gasto é por segundo, movimento ou permanência? | Combat menciona períodos curtos e nados longos, mas não fornece fórmula nem comparação parado/movendo. | **Não determinado**: não afirmar que só movimento cobra, nem que ficar parado cobra; nenhuma taxa numérica foi confirmada |
| O que ocorre ao esgotar? | Combat associa esgotamento de fatigue na água a afogamento; também associa paralisia na água a afogamento. A seção seguinte trata morte/carregamento. | Consequência letal é descrita pela wiki. Instantaneidade, eventual perda gradual de HP, intervalo de dano e possibilidade de intervenção não foram observados no executável |
| Existe dano de vida só por entrar em água? | Não foi encontrada tal regra nas fontes consultadas para água normal. Lava e ataques são outros perigos. | Não inferir dano passivo de HP em água normal enquanto há fatigue; ausência de descrição não é prova de ausência de todos os casos |
| Raças | Manual e Player Guide descrevem menor cansaço, maior velocidade e menor frequência de afogamento dos Argonianos. Manual também registra imunidade dos Altos Elfos à paralisia. | Qualitativo, sem multiplicador confirmado. **Não é imunidade absoluta a afogamento/respiração aquática**. A proteção dos Altos Elfos contra esse caso é inferência a partir de duas regras, não novo teste |
| Magia | Magical Effects descreve cura de fatigue, levitação e cura de paralisia. A wiki FAQ cita cura de stamina como ajuda em nados longos; quests descrevem levitação como alternativa a entrar na água. | Recuperar o recurso ou evitar água não comprova alteração da taxa de consumo. Não foi localizado, nesse conjunto, um efeito específico de respiração aquática; não importar o de jogos posteriores |
| Condições adicionais | Manual relaciona fatigue a força/resistência e menciona penalidades por carga. Combat relaciona paralisia a afogamento. | Efeito quantitativo da carga, atributos ou movimento sobre o consumo aquático não determinado; não aplicar uma fórmula inventada ao original |

## Fontes efetivamente consultadas

- `doc/wiki/Arena_Combat - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, **PDFp.3–4**: travessia/retorno à margem, consumo, afogamento e paralisia. Referência de origem: https://en.uesp.net/wiki/Arena:Combat. A cópia local foi lida; consulta web ao endereço retornou403 nesta rodada.
- `doc/wiki/Arena_Races - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, **PDFp.2–3 e6**: Argonianos e Altos Elfos. Conferido com manuais instalados, sem presumir que todo texto descritivo corresponde a um multiplicador implementado.
- Instalação `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\Docs\Manual.pdf`, **PDFp.5–7**: atributos/fatigue/carga/raças; `Player Guide.pdf`, **PDFp.19–22 e28**: mesmos temas, incluindo descrição de Argonianos. Player Guide PDFp.67–68 trata spellmaking e fatigue como atributo derivado afetável.
- `doc/wiki/Arena_Magical Effects - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, **PDFp.2–5**: cura de fatigue/paralisia, levitação; `Arena_Unofficial FAQ...pdf`, **PDFp.10**: uso de cura em nados. São descrições e recomendação, não cronometragem.
- `Arena_Fang Lair (quest)...pdf`, **PDFp.2/5**, e `Arena_Halls of Colossus...pdf`, **PDFp.3–4**: água/levitação e passagens sob paredes. Lava não foi usada para inferir dano em água comum.
- `Docs/Arena Codex Scientia.pdf`, **PDFp.22**, incluído na instalação: dica sobre barcos evitarem cansaço de travessias. Usado como compilação auxiliar de dicas, sem presumir autoria normativa oficial desse material.

Textos extraídos, cópias de consulta e configuração de execução ficam em `tmp/swimming-review/`, ignorado pelo Git. Hashes/páginas e condições em `evidencias/m01-14/aprovacao-natacao/`. Não incorporar manuais, PDFs, binários ou assets originais ao jogo distribuído. Resultados genéricos da busca web misturavam outros TES/mods; foram descartados como prova de Arena.

## Tentativa de observação do executável

Foram preparados jogo e configuração em cópia local ignorada, sem montar a pasta ARENA original como unidade DOS. O lançamento usou os argumentos de áudio e mapeamento de unidades do launcher instalado, mudando apenas os caminhos para a cópia e saída em janela. Não foram instalados mods nem alterados saves originais. Não houve janela do DOSBox disponível para observação/controlável pelas ferramentas, nem captura de uma sessão de natação. Logo, **não houve medição de parado versus movimento, de tempo até zero ou de HP/afogamento**. Iniciar um processo não comprova que esses testes ocorreram.

A primeira tentativa usou o executável DOSBox instalado. Esse emulador legado atualizou/recriou seus arquivos `DOSBox-0.74/stdout.txt` e `stderr.txt`, apesar do diretório de trabalho apontar para a área temporária. São logs, não binários/configuração do jogo; não havia cópia prévia desses logs para restaurar conteúdo/metadados com segurança. Nenhum deles foi removido ou revertido por suposição. Tentativas posteriores usaram **também uma cópia do emulador**. O registro de preservação distingue essa ocorrência dos hashes dos arquivos do jogo e executável. Não declarar a instalação inteira intocada byte a byte.

Para concluir a parte experimental em sessão controlada: registrar versão mostrada, raça/atributos/carga, HP/fatigue inicial, água normal sem inimigos ou magia; comparar30s em terra, parado na água e movimento contínuo na mesma água; repetir até zero com capturas de HP/tela de morte. Usar cópia técnica e save próprio de teste; comparar Argoniano e outra raça com atributos equivalentes, depois cura de fatigue/levitação separadamente. Não extrapolar paralisia/lava para água normal. Esses são **testes pendentes**, não resultados.

## Proposta S01 — aguarda decisão, não implementada

A regra atual de Vigor exclusivo de combate continua sendo a decisão vigente. Se o responsável escolher acrescentar custo aquático, a proposta simples abaixo **altera essa regra explicitamente** e precisa de aprovação própria:

| Aspecto | Proposta provisória |
|---|---|
| Unidade |2 pontos de Vigor por entrada bem-sucedida em tile de água nadável, sem depender de FPS/velocidade do computador |
| Parado/menu/carregar |Sem custo; nunca cobrar por tentativa bloqueada, clique de seleção, cancelamento ou carregar. É adaptação ao ritmo por grade, não afirmação sobre a cadência do DOS |
| Saída |Chegar a margem caminhável não cobra; não bloquear movimento quando o Vigor chegar a zero |
| Esgotamento |A partir do próximo passo cujo destino ainda seja água, perder10% da Vida máxima por passo, em vez de morte imediata. Consequência explicitamente adaptada/provisória; avaliar alternativa mais fiel somente após teste do original |
| Recuperação |Sem regeneração passiva; poções/camas pelas APIs existentes. Não duplicar máximos ou criar recurso espelhado |
| Raças |Não acrescentar bônus aquático por associação. O +10 inicial de Vigor já aprovado dos Argonianos permaneceria; a2por tile isso representa5 passos extras, sem alegar o multiplicador do original |
| Magia/paralisia |Não criar catálogo ambiental ou paralisia de exploração para esta proposta. Dependências futuras separadas; não importar respiração aquática de Skyrim |

Análise **estática**, não execução do custo: Map008, todas as portas consideradas abertas, sem inimigos/quest/restauração; um caminho de menor número de passos da entrada ao contato do Gate tem214 passos,6 deles de água. S01 cobraria12 Vigor nesse caminho específico. Isso não prova balanceamento geral nem o melhor caminho para poupar Vigor, e não inclui combate. Caminhos bloqueados, reservas para técnicas, retorno à margem e uso de poções precisam de cenários antes de aprovar números. Não houve alteração em plugins, banco ou descrição do personagem para aplicar S01.
