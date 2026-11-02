# Stonekeep — orc, piloto de batalha V01

Base **7ec5051**, dependências preservadas na feature `feature/m02-orc-piloto`. Um exemplar de batalha para avaliação visual: **não implementa caminhada nem os seis encontros de B2**. Cobertura do Map015 continua49/180encontros e32/70portas; campanha normal permanece Map012. Prioridade mantida: encontros/portas antes de revisão de loot, tesouros e descanso. **Forçar a porta**, determinístico e sem consumo, continua adaptação pendente de avaliação do responsável no teste integrado. O relato rápido anterior do mapa é preliminar, sem aprovação integral de colisões, encontros ou persistência.

## Fontes, identidade e adaptação

- Wiki local `doc/wiki/Arena_Monsters - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, páginas15–16: orc humanoide entre homem-lagarto e minotauro na escala descrita; Vida15–40, dano2–12, EXP=Vida×15+200. Tabela de atributos originais: STR60/INT30/WIL30/AGI65/END50/PER30/SPD50/LUC50. Esses números não equivalem diretamente aos parâmetros MV. A página cita o Player's Guide sobre orcs maiores que goblins; não é consulta nova ao manual nem à aparência de jogos posteriores.
- Instalação original, leitura de GLOBAL.BSA/PAL.COL, **ORC1.CFA(12quadros), ORC3.CFA(8), ORC6.CFA(3)**: elmo metálico com bordas douradas, pele verde-oliva, roupa azul, correias ocre, proteção cinzenta de ombros/cintura, calças verdes, botas escuras, escudo redondo castanho/bordô e maça com pontas. ORC1 mostra elevação da maça, ORC3 o perfil e ORC6 queda. Leitor RLE/MSB/lookup já existente reutilizado; hashes/dimensões em [fontes](arte/orc-v01/sources.json). Extrações ficam apenas em tmp ignorado. **Sem nova observação de partida DOS**.
- Pintura dark fantasy, legibilidade na escala real, pose lateral e redução de violência gráfica na derrota são adaptações. Mantidas identidade/equipamentos; nenhuma armadura, machado, habilidade ou resistência de outros títulos foi importada. Olhos discretos e acabamento metálico interpretam pixels do original, sem afirmar detalhes adicionais como canônicos.

## Conjunto e reprodução

Um único conjunto: **6espera,6ataque,6dano/recuperação,6derrota**, com maça e escudo desenhados junto ao corpo, orientação-fonte à direita e espelhamento único do inimigo pelo motor para a esquerda. Atlas **1152×512**, células192×128, apoio120, altura neutra90px, escala uniforme. Preparação, golpe e retorno têm desenhos articulados; impacto na quarta pose do ataque. Tempos em [perfil](arte/orc-v01/profile.json), mesmos intervalos do padrão existente; espera em loop, demais movimentos únicos.

Geração pelo **image_gen integrado**, não CLI. Mestre inicial `art/masters/stonekeep-orc-v01/sheet-v01.png` tinha duas silhuetas de queda encostadas e foi recusado pelo isolamento automático. Uma correção dirigida de espaçamento do **mesmo exemplar**, `sheet-v02-spacing.png`, separou os24desenhos; não é variante. [Prompt/referências](arte/orc-v01/prompt.json), [correção](arte/orc-v01/spacing-correction.json), [recortes, escala e hashes](arte/orc-v01/exports.json). Transparência real preservada; sem pintura de poses pelo exportador ou espelhamento para inventar quadros.

Reconstrução: `python tools/export-stonekeep-orc.py`, depois `node tools/build-stonekeep-orc.cjs`. O gerador pai de Stonekeep também chama esse consumidor; preserva outros bancos/perfis/mapas e não transforma os seis marcadores originais em encontros implementados. Exportação `img/enemies/Arena_Combat_orc_v01.png`. Arte **aguarda aprovação**, sem autorização automática de caminhada/lote.

## Configuração provisória, somente laboratório

| Parâmetro MV | Valor / fundamento |
|---|---|
|Vida / Mana |40/0; extremo superior da faixa da wiki como referência inicial de piloto |
|ATQ / DEF |10/5; adaptação local acima do goblin atual, não conversão de STR/armadura original |
|MAT / MDF |0/3; sem magia ou resistência especial configurada |
|AGI / SOR / acerto |8/5/90%; adaptação ao ritmo/ações existentes, não valores originais convertidos |
|Ação |Atacar nativo, skill1; sem habilidades adicionais, efeitos ou mecânica de grupo |
|EXP / loot no laboratório |**0 / vazio**, um recibo técnico sem prêmio |
|Configuração de campanha |**Desabilitada; EXP/loot ainda não definidos**, não transferir zeros silenciosamente |

Enemy7/Troop8, dados em `ArenaOrc.json`. A wiki16 relaciona ouro25%/4–40, item mágico ou poção15%, item de baixa qualidade50% e arma/armadura mágica5%; **nada disso foi habilitado ou adaptado neste piloto**. Revisão de recompensas continua posterior, sem catálogo novo, variantes raras ou alteração de tabelas dos demais inimigos. Fórmula atual, E05 e atributos aprovados dos outros participantes permanecem.

## Acesso e avaliação curta

**http://127.0.0.1:8774/** → **Testes / Debug → Combate → Stonekeep · orc (RAM)**. Servidor de desenvolvimento existente reutilizado, sem limpar dados ou mudar origem/namespace. Fixture reutilizada: Bretã feminina nível2, adaga, Vida100/Mana50/Vigor100, técnicas e magia existentes. Recursos/EXP da fixture não alteram personagens pessoais. Abertura sempre recomeça o exemplar intacto, sem drops necessários; vitória retorna ao mapa técnico, derrota leva ao game over. Menu da sessão permite retornar ao título; reentrar pelo hub repete. Saves normais bloqueados pelo isolamento já existente.

Avaliar somente o exemplar: aguardar a respiração, **Defender** para observar o golpe inimigo, **Atacar** para reação, técnica/magia para terminar e observar queda. Conferir silhueta, continuidade, pega da maça, escudo, apoio e retorno; sem novo percurso da dungeon nem aprovação de balanceamento solicitada. Aguardar feedback visual antes da caminhada e distribuição dos seis encontros.

## Verificações executadas

`tools/test-stonekeep-orc.cjs`: **5grupos**, Chrome156.0.8078.76/WebGL, canvas816×624, perfil descartável na origem canônica. Abertura limpa e caminho real pelo hub;24desenhos amostrados nas quatro animações, impacto inimigo na pose prevista, Defender/Atacar/técnica/magia com aplicações e custos únicos. Técnica6 consome12Vigor, magia10 consome6Mana; vitória retorna, um recibo vazio, EXP/ouro/itens intactos e chamadas repetidas de prêmio sem efeito. Reentrada reinicia os recursos/alvo; fixture separada de1PV verifica game over. Zero erros JS/HTTP faltantes, tentativa de Save16 recusada/localStorage vazio. Não é avaliação de dificuldade.

IDs antigos, bancos de itens/equipamentos/skills, Map012/015 e cobertura comparados à base; gerador pai reconstruído sem diferença semântica. Registro canônico de plugins mantido. [Resultados](evidencias/m02-orc-v01/resultado.json), [atlas1:1](evidencias/m02-orc-v01/atlas-escala-real.png), [batalha](evidencias/m02-orc-v01/batalha.png), [vídeo≈17s normal](evidencias/m02-orc-v01/combate-normal.webm). Gravação do canvas nativo30fps, sem acelerar a simulação; RNG0,5 somente no teste.111quadros decodificados para inspeção visual a4x, sem alterar o vídeo entregue; [QA](evidencias/m02-orc-v01/video-qa.json). Maça/corpo/escudo e queda inspecionados no atlas e na gravação. Servidor não expõe doc/evidencias por política: QA leu o vídeo localmente, sem alterar o servidor.

Não executados: caminhada, contatos de mapa, seis encontros, percurso completo, testes físicos/mobile/editor ou balanceamento. Nenhuma aprovação artística presumida. Próximo recorte após avaliação: caminhada direcional e **um** encontro piloto; somente depois ampliar conforme as seis referências.
