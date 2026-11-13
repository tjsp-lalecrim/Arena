# Stonekeep — caminhada do homem-lagarto V01

Base **6794a81**, feature `feature/m02-homem-lagarto-patrulha`. A patrulha do orc foi **explicitamente aprovada pelo responsável**; ambiente/casos adicionais não informados. Combate/caminhada do orc preservados, sem inferir aprovação de equilíbrio, recompensas ou distribuição dos seis B2. **Aprovação posterior explícita:** o responsável aprovou as animações de combate e patrulha, na referência disponível8b309cc. Ambiente adicional não informado; sem aprovação de balanceamento, recompensas ou distribuição.

## Identidade e cobertura

**Inimigo Homem-lagarto**, Enemy3/Troop3, e não a raça jogável Argoniana. Inspecionados `Arena_Combat_lizard_man_r03.png`, mestre `combate-r03-expansao/lizard-man.png`, perfil e manifestos R03: batalha disponível/legado da entrega M01, **aprovação individual posterior registrada acima**. Mestre/atlas/movimentos e dados de combate não foram refeitos. A mordida usa o strip R03 próprio, e o último retorno de dano já reutilizava a neutra conforme manifesto; não corrigir essas decisões por associação.

Original instalado: **LIZARD1–5.CFA/PAL.COL**, leitura do GLOBAL.BSA pelo decoder RLE/MSB/lookup existente, primeiros quadros cardinais. Confirmam pele escura, focinho reptiliano, olhos claros, tridente com haste ocre, escudo redondo castanho e cauda/espinhos visíveis. A interpretação já existente de corpo robusto, escamas, cauda e equipamento foi preservada; não se usaram retratos ou sprites Argonianos. Câmera superior/pintura dark fantasy são adaptação à grade. Sem nova observação DOS. [Hashes/fontes](arte/lizard-walk-v01/sources.json); extrações apenas em tmp ignorado.

Wiki local `Arena_Monsters…pdf`, página13, descreve Lizard Man, Vida10–20/dano1–8 e capacidade de paralisar. Isso não autoriza converter números nem adicionar mecânicas. Preservados os parâmetros MV existentes **55PV/0Mana, ATQ10/DEF5/MAT0/MDF5/AGI14/SOR5, acerto90%**. Skill11/Mordida paralisante, chance25%/um turno e EXP50 são adaptações provisórias **anteriores**, sem mudança nesta entrega. Tabela normal de loot3 permanece integralmente igual; inspeção tem0 EXP/tabela vazia apenas por contexto RAM.

## Arte e reconstrução

Uma geração **image_gen integrado**, um único mestre, sem variantes. **12desenhos**, sul/oeste/leste/norte, passoA/neutra/passoB; articulação real de pernas/corpo e transporte do tridente/escudo. Orientações desenhadas, sem espelhamento, poses estáticas transladadas ou deformação por redimensionamento individual. Fonte, [prompt](arte/lizard-walk-v01/prompt.json) e [âncoras autorais](arte/lizard-walk-v01/anchors.json) documentam adaptação/pontos de apoio.

Mestre `art/masters/stonekeep-lizard-walk-v01/sheet-v01.png`; exportação **img/characters/$Arena_lizard_man_walk_v01.png**,288×384, células96×96 e **densidade única0,24**. Célula maior dá margem transparente à cauda/tridente, sem aumentar área de colisão nem ampliar individualmente a criatura. Corpo continua na escala dos humanoides do mapa. Apoio das garras separado da ponta da cauda:84 nas três primeiras direções/78 no norte, compensados pelo hook existente `groundByDirection`/nominal94. Tridente e cauda não deslocam o eixo do corpo. [Recortes, apoios e hashes](arte/lizard-walk-v01/exports.json). Reconstrução: `python tools/export-stonekeep-lizard-walk.py`; configuração autoral direta em `data/ArenaLizardPatrol.json`, sem gerador de encontros de campanha novo.

## Inspeção RAM e acesso

**http://127.0.0.1:8774/** → **Testes / Debug → Campanha e mapas → Stonekeep · homem-lagarto — patrulha (RAM)**.

Reutiliza a sala técnica Map016 **só em memória**, com um exemplar em(9,6), chegada(4,9), ID **technical.stonekeep.lizard.walk.01**. O arquivo Map016 e o acesso aprovado do orc não mudaram. Perfil de área/sprite/script do evento1 só é selecionado enquanto flag própria+laboratório estão ativos; retorno ao título encerra esse contexto. Não é posição original nem um dos19encontros da dungeon, não altera Map012/015. Raio3/intervalo90/piso4 e colisões nativas reutilizados, sem água/parede atravessáveis, perseguição ou grupo.

1. Observar quatro direções/apoios/equipamento e circular junto ao pilar e à água; o inimigo permanece no piso permitido.
2. Encostar para iniciar uma única batalha com o exemplar R03. Vitória retorna e remove apenas o ID técnico, sem EXP/loot; derrota mantém game over existente.
3. **Guardar teste em RAM / Carregar teste da RAM** preservam posição/derrota durante a sessão. Sair pelo menu para o título encerra; reentrar reinicia. Saves normais bloqueados, sem alterar dados pessoais ou namespace.

## Verificação focal e limites

`tools/test-stonekeep-lizard-walk.cjs`, **6grupos**, Chrome156/perfil descartável/origem canônica/canvas816×624: abertura limpa/hub, uma instância, quatro direções e padrões0/1/2 no movimento nativo; compensação real de apoio/células96px sem espelhamento; patrulha/pilar/água/raio; contato por teclado e trava contra repetição. Um ataque nativo e vitória controlada demonstram retorno/derrota individual/recibo vazio, sem repetir matriz de combate. Guardar/Carregar RAM mantém estados/recursos/quests/pontos/inventário, slots bloqueados/localStorage vazio.

Resposta HTTP original de Map016 continua com evento do orc enquanto `$dataMap` privado contém o homem-lagarto; após título, EXP50/loot normal3 são restaurados e reabrir o laboratório do orc recarrega evento/perfil correto. Bancos/fórmulas/perfis de batalha/mestres de homem-lagarto, orc e sprites Argonianos protegidos na comparação à base; gerador pai recompõe sem alterar dados existentes. Zero erros JS/HTTP faltantes. [Resultados](evidencias/m02-lizard-walk-v01/resultado.json), [sala](evidencias/m02-lizard-walk-v01/patrulha.png), [contato](evidencias/m02-lizard-walk-v01/contato.png), [atlas1:1](evidencias/m02-lizard-walk-v01/atlas-escala-real.png).

[Vídeo≈16s em velocidade normal](evidencias/m02-lizard-walk-v01/caminhada-contato-normal.webm), canvas nativo30fps: quatro deslocamentos controlados, patrulha natural e contato; vitória controlada ocorre depois.38quadros decodificados localmente a4x para inspeção, sem acelerar o arquivo entregue; [QA](evidencias/m02-lizard-walk-v01/video-qa.json). Anatomia/cores/orientação/continuidade e apoios inspecionados no atlas e na gravação; **não substituem avaliação do responsável**.

Cobertura permanece **49/180encontros e32/70portas**; seis orcs B2 e todos os19homens-lagarto continuam sem distribuição. Sem teste completo da dungeon, editor/mobile, novo balanceamento ou revisão de loot/descanso. Próximas espécies: **Minotauro (alias OGRE.DFA corrigido com autorização) e aranha**, combate+caminhada juntos, uma espécie por entrega e avaliação entre elas; depois retomar encontros/portas/eventos. Matriz vigente em [Stonekeep](STONEKEEP_M02_04.md#matriz-operacional-de-assets--nove-espécies).
