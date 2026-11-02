# Stonekeep — lobo comum, piloto de batalha V01

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
