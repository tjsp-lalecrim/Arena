# Stonekeep — lobo comum, piloto de batalha V01

## Caminhada e encontro único V01 — sobre aaea451

**02/11/2026 — aprovação recebida:** responsável aprovou explicitamente **a animação e o combate do lobo de aaea451**. Não ampliar a aprovação a balanceamento, recompensas ou exploração. Mestre, atlas e perfil de batalha foram preservados; só os registros de aprovação mudaram. A nova caminhada/patrulha aguarda avaliação antes de ocupar as outras três posições. Não é solicitado repetir o teste do combate aprovado.

**Um encontro:** `stonekeep.apartments.wolf.01`, evento19/Map012, origem **(90,51)**. É o primeiro dos quatro pontos confirmados: MIF(52,16), `0x8037` → STKEEP1.INF flat55=`wolf.dfa`, ITEM35. Projeção existente para centro da grade, sem deslocar posição ou geometria. [Delimitação](STONEKEEP_APOSENTOS_M02_05.md); posições(114,54),(99,54),(96,54) continuam **sem lobos**. Raio Manhattan2, intervalo90, piso/região4 e colisão nativa são adaptações; paredes/água bloqueadas, sem through, perseguição ou grupo. Pergaminho continua acessível com todos vivos; coleta/recuperação/entrega/recibos não foram alterados.

### Arte e apoio

Uma geração IA integrada, doze desenhos/3×4 em `art/masters/stonekeep-wolf-walk-v01/sheet-v01.png`. [Prompt/referências efetivamente fornecidas](arte/wolf-walk-v01/prompt.json): recorte de identidade do mestre de batalha aprovado e contato de consulta das primeiras poses **WOLF01/02/03/04/05.CFA**. Consulta somente leitura/decodificador existente, lookup próprio/PAL.COL, dados em tmp ignorado; não distribui arquivos originais. [Fontes/hash e limites](arte/wolf-walk-v01/sources.json).

Pelagem cinza, focinho claro, rufo/orelhas/cauda e olhos vermelhos preservados. Perspectiva superior ortogonal e passada interpolada são adaptação, não afirmação de que a câmera do original era superior. Fileiras: sul, oeste, leste, norte; colunas: passada diagonal, apoio neutro, passada oposta. Corpo/cabeça coerentes, dorso no norte, sem espelhamento para criar outra direção ou translação de uma pose estática.

`img/characters/$Arena_wolf_walk_v01.png`,192×256, células64×64, apoio62 e maior extensão56px. **Escala única** para todos os desenhos; eixo do torso centralizado e referência de apoio comum por fileira preservam a posição do corpo enquanto as patas variam no plano superior. Não igualar a altura de uma vista lateral à longitudinal por deformação. Recortes/alpha e12 hashes distintos em [exports.json](arte/wolf-walk-v01/exports.json). [Atlas1:1](evidencias/m02-wolf-walk-v01/atlas-escala-real.png), [patrulha](evidencias/m02-wolf-walk-v01/ilha.png), [quadros da gravação](evidencias/m02-wolf-walk-v01/video-quadros.png). Nenhuma edição/regeneração da arte de batalha aprovada.

### Recompensas separadas e provisórias

| Contexto | Configuração e fundamento |
| --- | --- |
| Campanha/encontro do mapa, inclusive fixture RAM de patrulha |**25EXP provisórios** na escala MV, entre rato15 e esqueleto50, equivalentes ao goblin25; não conversão direta da regra original. HP25 e demais parâmetros do piloto permanecem iguais |
| Fonte disponível |Wiki local Monsters PDF23–24/Wolf informa EXP=Vida×10+100,200–350 para Vida10–25; loot marcado **(?)**. Nenhuma tabela de drops do original foi confirmada nesta consulta delimitada |
| Drops de campanha |Tabela **explicitamente vazia por incerteza**, sem inventar ouro/poção/equipamento e sem afirmar que o lobo original nunca concede loot. Reavaliar com fonte/configuração próprias; sem variantes raras |
| Batalha direta anterior em Combate |Instância marcada `_arenaWolfBattlePilot` mantém **0EXP/loot**. Não troca banco/tabela global temporariamente; outras instâncias usam a configuração de campanha |

Atributos/ação/fórmula existentes preservados. EXP/consumo/recuperação do percurso continuam no **M02-BAL**, sem aprovação definitiva por este relato. Recompensas usam somente o núcleo Loot e seu recibo por batalha; sem concessor adicional.

### Acesso e avaliação curta

[http://127.0.0.1:8774/](http://127.0.0.1:8774/) → **Testes / Debug → Campanha e mapas → Stonekeep · lobo na passagem (RAM)**. Início(96,51), Bretã feminina nível2/adaga e recursos técnicos completos. Observar a patrulha a oeste, aproximar-se para contato; vitória remove só esse encontro. Nova entrada reinicia a fixture. **Guardar/Carregar teste em RAM** mantém checkpoint somente na sessão; slots pessoais bloqueados. Nenhum laboratório prévio removido ou comando novo no título. Acesso antigo **Combate → Stonekeep · lobo (RAM)** preservado.

[Vídeo≈19s em velocidade normal](evidencias/m02-wolf-walk-v01/caminhada-contato-normal.webm): patrulha natural e aproximação por teclado até o contato, sem acelerar o motor ou repetir avaliação do combate. A cobertura técnica das quatro direções também foi observada por movimentos nativos controlados antes da gravação. Avaliar caminhada/apresentação deste único exemplar antes de expandir os encontros.

A porta8774 estava sem servidor; foi iniciado servidor local de consulta ao projeto, **PID28744**, somente127.0.0.1, sem substituir outro serviço. Permanece ativo; encerrar com `Stop-Process -Id 28744` enquanto esse PID corresponder ao servidor. Arquivos HTTP conferidos contra o projeto. Sem alterar/apagar dados do navegador; origem diferente continua com saves próprios.

### Verificações focais desta entrega

`node tools/test-stonekeep-wolf-walk.cjs`, Chrome156 isolado/origem efêmera: **sete grupos**. Abertura real/hub e bloqueio de slots;17 encontros, só um lobo; limites de piso/raio, paredes e aproximação/fonte acessível com vivos; três padrões nativos nas quatro direções. Patrulha natural, contato por teclado e uma transição/participante, sem fuga/canLose. Um Atacar nativo com custo/dano único seguido de vitória controlada validou remoção,25EXP e um recibo vazio; nenhuma outra derrota, item, ouro ou mudança de MQ01/MQ02. Reconcessão bloqueada. RAM e Save16/F5/Load sintéticos preservaram derrota/recibo; descanso/saída antecipada não reativam. Antiga batalha direta continuou0EXP/loot com banco de campanha25. Sem matriz completa do combate ou percurso.

[Resultado](evidencias/m02-wolf-walk-v01/resultado.json), [QA do vídeo](evidencias/m02-wolf-walk-v01/video-qa.json). Gravação do canvas nativo em tempo normal; decodificação a4x apenas para inspeção, não edição do vídeo entregue. Atlas1:1, cena no motor e quadros da gravação inspecionados; sem erros JS/HTTP faltante. Nenhum novo teste no editor ou smartphone declarado. Os testes manuais pendentes anteriores não são promovidos a aprovação.

Reconstrução com `python tools/export-stonekeep-wolf-walk.py` e `node tools/build-stonekeep-wolf.cjs`; geradores independentes de esqueleto/ghoul/aposentos e pai Rihad preservam a saída. Camadas/colisão de Map012, eventos anteriores, outros mapas, arte/perfil de batalha, demais inimigos e loot inalterados. Configuração em ArenaWolf.json; sem novo schema/namespace ou mudança em plugins.js.

**Pendentes:** avaliação visual/funcional desta caminhada antes de expandir às outras três posições; recompensas e equilíbrio ainda provisórios, M02-BAL. A rota já permite coleta/entrega, mas ainda não tem os quatro lobos integrados. Não iniciar Fang Lair ou outras espécies por associação.

## Histórico — piloto de batalha V01 (aaea451)

Feature `feature/m02-lobo-piloto`, sobre **2644185**, preservando dependências ainda não integradas e a tag m01. **Avanço autorizado pelo responsável; testes manuais dos novos inimigos adiados**, sem aprovação funcional/artística presumida para o lobo ou para novos encontros. Confirmações anteriores de coleta/entrega e exemplares permanecem com cobertura própria. Esta entrega é **um exemplar somente de batalha**, não caminhada nem as quatro posições dos aposentos.

## Fontes e interpretação

- Wiki local **Arena_Monsters…pdf**, pp.23–24, **Wolf**: figura cinza-escura, focinho claro e olhos vermelhos; Vida10–25, dano1–10, EXP=Vida×10+100 (200–350), loot não especificado. A descrição de caça em grupo não autoriza mecânica nova. **Snow Wolf**, pp.18–19, é outra criatura; sua magia não foi importada.
- Original instalado, leitura direta de **GLOBAL.BSA/WOLF01.CFA, WOLF03.CFA, WOLF06.CFA** com **PAL.COL** e lookup próprio do CFA no offset76. Reutilizado o leitor RLE/bitpacking já disponível:12/8/3 quadros, respectivamente. Inspecionados frente/ataque, lateral/articulação e queda. Silhueta canina baixa, ombros/rufo fortes, cauda baixa, focinho/face mais claros e olhos vermelhos são evidência visual; materialização pictórica da pelagem e interpolação da mordida/recuo são interpretação. [Índices, dimensões, hashes e limites](arte/wolf-v01/sources.json).
- Correspondência de espécie nos aposentos já confirmada: STKEEP1.INF flat55=`wolf.dfa`, ITEM35, MAP1 `0x8037`; [quatro posições](STONEKEEP_APOSENTOS_M02_05.md) preservadas como dependência, **sem eventos novos**. Não se afirma uma associação não decodificada entre cada flat e cada ângulo CFA. Nenhuma nova observação DOS. Extrações somente em `tmp/wolf-review`, ignoradas; nenhuma imagem original distribuída.

## Amostra artística e integração

Uma chamada ao **image_gen integrado**, mestre **art/masters/stonekeep-wolf-v01/sheet-v01.png**,1536×1024. [Prompt completo, referências realmente fornecidas e hashes](arte/wolf-v01/prompt.json): contato WOLF03 para identidade/proporção; frente WOLF01 para rosto/cores; recorte do ghoul aprovado somente para acabamento, não anatomia. Pintura dark fantasy, sem cenário, objeto adicional ou variante.

O mestre tem24 desenhos/6×4. **Um quadro de espera (índice5) corta o focinho na borda direita**: preservado no mestre para rastreabilidade, mas **excluído da exportação**, sem remendo, clone ou fallback silencioso. Cobertura real: **5espera,6ataque,6dano,6derrota —23 desenhos**, suficientes para as quatro ações do piloto. A célula vazia da última coluna/primeira linha nunca é amostrada pelo perfil; não é uma animação ausente. Não gerada uma segunda variante para preencher essa célula.

Exportação **img/enemies/Arena_Combat_wolf_v01.png**,1152×512; célula192×128, apoio120, altura neutra64px e escala comum a todos os quadros. Corte/resize uniforme preserva alfa e anatomia, sem esticar por quadro; referência horizontal das patas posteriores para suporte nas poses em pé, enquadramento da queda centralizado. Fonte olha à direita; o consumidor existente espelha o inimigo uma única vez para enfrentar o jogador à esquerda. Mordida tem preparação, extensão e retorno; dano tem recuo próprio; derrota articula pernas/tronco até deitar. Sem caminhada sintetizada por deslocamento de pose estática.

[Atlas na escala real](evidencias/m02-wolf-v01/atlas-escala-real.png), [batalha](evidencias/m02-wolf-v01/batalha.png), [quadros decodificados da gravação](evidencias/m02-wolf-v01/video-quadros.png), [métricas/recortes/hashes](arte/wolf-v01/exports.json). Projeção, apoio/recortes, leitura da face/cauda e progressão dos movimentos foram inspecionados no atlas1:1 e nos quadros do motor; isso **não equivale a aprovação estética do responsável**. A amostra visual deve ser avaliada antes de produzir caminhada ou ampliar arte.

## Configuração provisória

| Campo | Piloto, não aprovação para campanha |
| --- | --- |
| IDs |Enemy6/Troop7; registros anteriores preservados |
| Vida/Mana/Vigor |25 / ausente / ausente;25 usa o limite superior da faixa documentada como base inicial de laboratório, não conversão de todo o modelo original |
| ATQ/DEF/MAT/MDF/AGI/SOR |8/3/0/3/12/5; provisórios na escala MV. Ataque acima do rato5, abaixo do esqueleto9; DEF/MDF próximas ao goblin3; AGI12 maior que rato9/goblin10 para representar mobilidade sem sistema novo |
| Acerto/ação |HIT90%, **Atacar1** nativo gratuito, visualmente mordida; sem doença, sangramento, magia, resistência ou agrupamento |
| EXP/ouro/itens |**Zero somente no laboratório**. `ArenaWolf.json.campaign=null`: campanha ainda sem tabela/EXP configurados. Uso de recompensas fora da instância técnica é rejeitado, evitando transferir zeros silenciosamente |

Não houve mudança de fórmula, demais inimigos, equipamentos ou sistemas. Recursos/ações/custos pertencem aos núcleos existentes; não existe segundo consumidor ou concessor. A configuração futura de campanha deverá ter fontes/adaptações próprias, no recorte de integração, sem assumir os zeros técnicos. Balanceamento permanece **M02-BAL**.

## Acesso sem percurso

[http://127.0.0.1:8774/](http://127.0.0.1:8774/) → **Testes / Debug → Combate → Stonekeep · lobo (RAM)**.

O acesso reutiliza a fixture existente: Bretã feminina nível2/adaga, recursos completos, técnicas/magias/poções técnicas; uma batalha nativa contra o lobo, sem fuga. Vitória retorna a Map012/(80,39), longe dos encontros; derrota mantém game over. Nova entrada no hub reinicia o exemplar. Sessão RAM, slots normais bloqueados; não carrega nem grava saves pessoais. Sem comando técnico novo no título.

**Não é solicitado teste manual de combate agora.** Sua avaliação funcional pode ser agrupada à integração posterior. Para avaliação visual, [vídeo≈18s em velocidade normal](evidencias/m02-wolf-v01/combate-normal.webm): espera, Defender para observar a mordida, Atacar para observar dano, Estocada pesada para derrota/retorno. Nenhuma animação acelerada ou montagem substitui o motor. Fundo de batalha e interface continuam os já existentes, com ressalvas anteriores.

## Verificação focal executada

`node tools/test-stonekeep-wolf.cjs`: Chrome156 isolado/origem efêmera, MV1.6.1,816×624, **cinco grupos**. Abertura real/hub, instância única e bloqueio de saves; cinco quadros de espera e seis de cada outra ação amostrados no motor, impacto somente na fase prevista; Defender/Atacar/Estocada pesada com12Vigor uma vez e sem Mana; vitória/retorno, recibo vazio único e sem EXP/ouro/item/escrita no storage. Batalha nova separada: Dardo de fogo consumiu6Mana e aplicou dano uma única vez; eventual sobrevivente encerrado por vitória controlada. Terceira fixture com1PV comprovou derrota/game over e repetição do acesso. RNG0,5 apenas nas verificações controladas, sem ajuste de tempo ou inimigo para o vídeo.

[Resultado](evidencias/m02-wolf-v01/resultado.json), [QA da gravação](evidencias/m02-wolf-v01/video-qa.json): vídeo do canvas nativo30fps,119 quadros extraídos a4x **somente para inspeção**, duração de mídia18,03s; arquivo entregue permanece em tempo normal. Sem erros JS/HTTP faltante. Não repetidas campanha/matriz de personagens nem testes de exploração. Nenhum novo teste no editor ou smartphone declarado.

Reconstrução: `python tools/export-stonekeep-wolf.py`; `node tools/build-stonekeep-wolf.cjs` (também chamado pelo pai da amostra/Rihad). Comparação focal preservou bancos1–5/tropas anteriores, perfis/loot de outros participantes, mapas008–012, MQ02/recibos, pergaminho/entrega, configuração dos aposentos e hub. Formato canônico de plugins.js: somente um registro próprio acrescentado depois do hub. Namespace/schemas de saves intactos.

**Pendências:** avaliação visual desta amostra antes de produzir caminhada; testes manuais funcionais adiados por autorização, sem aprovação presumida; futura caminhada e integração dos quatro lobos com recompensas de campanha explícitas; avaliação do percurso no M02-BAL. Stonekeep ainda não tem cobertura completa desses quatro encontros. Sem Fang Lair, variante ou novo animal nesta entrega.
