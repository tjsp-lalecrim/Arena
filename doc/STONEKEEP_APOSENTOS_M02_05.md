# Stonekeep — delimitação dos encontros dos aposentos

**Continuação sobre2644185:** [um piloto de batalha do lobo](LOBO_M02.md) implementado para avaliação visual; não acrescenta caminhada ou os quatro encontros. Testes manuais adiados pelo responsável, sem aprovação presumida. As referências à ausência de exemplar abaixo registram a delimitação original.

Feature `feature/m02-stonekeep-aposentos`, sobre **4357999**. **Relato do responsável:** testou a entrega do pergaminho de4357999 e confirmou funcionamento. Sem ambiente/casos adicionais informados; preservadas as seis verificações técnicas anteriores, sem atribuir seu conteúdo ao relato manual.

## Fonte e recorte

Consulta delimitada de **39699021.MIF/MAP1** e **GLOBAL.BSA/STKEEP1.INF** instalados, somente leitura. Reutilizadas camadas decodificadas após conferir hash do MIF; o INF foi lido/decifrado novamente e coincide com a consulta anterior após normalizar CRCRLF. Índices zero-based **52=rat.dfa** (`*ITEM32`, valor MAP1 `0x8034`) e **55=wolf.dfa** (`*ITEM35`, `0x8037`). ITEM não é índice do flat. [Hashes, posições e exclusões](evidencias/m02-stonekeep-aposentos/fontes.json). Não houve novo playtest DOS nem inferência de posições a partir da prosa genérica ou da cor do automapa.

A wiki local **Arena_Fang Lair (quest)…pdf, p.2, Stonekeep**, menciona ratos/lobos junto aos aposentos antes da abertura para a passagem; complementa a leitura, mas **não foi usada para inventar quantidade**. Aplicado o recorte já aprovado da planta: vistaX8–53/Y0–32, Xvista=89−XMIF, centro MV=(3+(Xvista−8)×3,3+Y×3). A geometria não foi ampliada.

| Espécie / ID | Original MIF (confirmado) | Centro MV (projeção da grade) | Resultado |
| --- | --- | --- | --- |
|Rato01 |44,11 |114,36 |Evento16, incluído |
|Rato02 |44,12 |114,39 |Evento17, incluído |
|Rato03 |43,13 |117,42 |Evento18, incluído |
|Lobo01 |52,16 |90,51 |Dependência artística, não criado |
|Lobo02 |44,17 |114,54 |Dependência artística, não criado |
|Lobo03 |49,17 |99,54 |Dependência artística, não criado |
|Lobo04 |50,17 |96,54 |Dependência artística, não criado |

**Confirmadas:** espécie/referência declarada e células originais. As sete projeções caem em piso existente conectado à rota. **Adaptações:** centros na grade/escala3, patrulha dos ratos com raio Manhattan1 e intervalo90, piso/região4; raio reduzido evita sobrepor os territórios dos dois pontos separados por3tiles. Não se afirmam trajetórias/tempos de patrulha do original. Nenhuma posição precisou ser deslocada para outra célula ou aproximada por falta de piso.

**Exclusões:**13 posições de rato e9 de lobo estão fora do recorte construído; coordenadas listadas na evidência, sem construir novas salas para incluí-las. Outras espécies/alas opcionais não fazem parte desta consulta. Não gerar encontros só porque o texto diz que a dungeon é habitada por uma espécie.

## Implementação e dependência real

Três IDs estáveis **stonekeep.apartments.rat.01–03**, eventos16–18 no Map012, Enemy1/Troop1 existentes. Reutilizados `$Arena_rat_walk_r02`, perfil direcional/apoios e batalha do rato, contato/trava/persistência e regras de respawn. Nada criado para lobos, nem sprites substitutos invisíveis/de outro inimigo. **Os quatro lobos são dependência real de representação dos aposentos construídos**, embora evitáveis em combate; não são um objetivo obrigatório de matar todos.

Lobo exige, em recorte próprio começando por um exemplar, identidade sustentada nas referências, piloto de batalha aprovado e caminhada superior nas quatro direções/quadros/apoios; só depois integração/expansão às quatro posições. Não foi produzido inimigo, configuração de batalha ou arte de lobo agora. A quantidade/posição está resolvida; não é motivo para nova pesquisa geral ou ampliação da planta.

Ratos preservam **18PV, ATQ5/DEF2/MAT0/MDF2/AGI9/SOR5, HIT90%,15EXP e tabela atual sem drops**. Fórmula, custos e demais inimigos inalterados. Até45EXP adicionais se os três forem vencidos; impacto acumulado/recursos/recuperação fica no **M02-BAL**, sem aprovação de equilíbrio implícita. Recompensas continuam exclusivamente no núcleo Loot e recibos próprios da batalha; não há outro concessor.

Origem autoral: [STONEKEEP_APOSENTOS_M02.json](mapas/STONEKEEP_APOSENTOS_M02.json), `tools/build-stonekeep-apartments.cjs`, chamado pelo gerador pai da amostra. Este gerador preserva entradas alheias. O gerador do ghoul recebeu somente a correção de atualização na posição existente/adição do que falta: antes, reconstruí-lo isoladamente movia os ghouls para depois dos novos ratos; agora mantém ordem e conteúdo estáveis. Não muda ID, atributo ou comportamento dos ghouls. Esqueletos, fontes, recibos, entrega e terreno preservados.

## Acesso e verificação focal

[http://127.0.0.1:8774/](http://127.0.0.1:8774/) → **Testes / Debug → Campanha e mapas → Stonekeep · passagem (RAM)** → estrada ao sul de Rihad → **Viajar para Stonekeep**. Mesmo laboratório, sem comando novo. Seguir ao sul a partir da entrada e entrar no aposento a oeste: ratos em(114,36),(114,39),(117,42). [Visão geral](evidencias/m02-stonekeep-aposentos/visao-geral.png): R=implementado; círculos L=lobos ainda ausentes. Observar circulação ou um contato, sem exigir percorrer toda a dungeon. **Guardar teste em RAM / Carregar teste da RAM** permanecem apenas na sessão; slots pessoais bloqueados.

`node tools/test-stonekeep-apartments.cjs`: Chrome156 isolado/origem efêmera,816×624, **quatro grupos focais**. Abertura real e roteamento pelo hub existente, transferência nativa para a entrada; três origens/perfis, acesso a cada contato e caminho ao pergaminho/saída com os16 encontros vivos; patrulha observada de cada rato dentro do piso/raio. Eventos fora da tela continuam parados conforme contrato existente; a observação usa câmera próxima, sem alterar essa regra.

Save sintético anterior sem os três novos eventos preencheu-os mantendo personagem/MQ01/MQ02/recursos/inventário/recibos. Dois contatos nativos/vitórias controladas (não teste de dificuldade): duas derrotas e recibos independentes,30EXP totais, nenhum ouro/item extra; tentativa concorrente/reconcessão bloqueadas, terceiro rato e13 guardiões anteriores preservados. RAM e Save16/F5/Load sintéticos mantiveram derrotas/recibos; transferência de ida/volta antes de concluir MQ02 não gerou respawn. [Resultado](evidencias/m02-stonekeep-aposentos/resultado.json), [captura](evidencias/m02-stonekeep-aposentos/grupo.png).

Reconstrução independente dos geradores esqueleto/ghoul/aposentos e do pai preservou os mesmos dados. Camadas/colisão e eventos anteriores de Map012, demais mapas/bancos/tabelas/perfis da batalha inalterados. Não repetidas campanha, animações ou coleta/entrega: reusadas evidências técnicas e confirmações válidas. Sem erros JS/HTTP faltante; nenhum save pessoal acessado ou novo teste no editor/mobile atribuído.

## O que falta para a rota funcional completa

A rota atual já permite viajar, atravessar, coletar, retornar e entregar, com confirmação manual da coleta e da entrega. **Faltam o exemplar de lobo e sua integração nas quatro posições confirmadas**, depois uma verificação focal dos novos contatos/circulação na rota; não é necessário exigir todas as lutas. Não declarar cobertura completa dos encontros antes disso. Decoração, portas elaboradas, aparência final do pergaminho e ilustrações futuras da corte não são bloqueios funcionais. Balanceamento do percurso permanece M02-BAL; Fang Lair não foi iniciado.
