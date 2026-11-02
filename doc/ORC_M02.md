# Stonekeep — orc: caminhada e inspeção RAM V01

## Aprovação recebida e cobertura atual

O responsável **aprovou explicitamente as animações de combate entregues em42b857f**. Ambiente/casos adicionais não foram informados; não estender a aprovação a balanceamento, recompensas, encontros ou caminhada. Mestres/atlas/perfil de batalha preservados; somente metadados de aprovação atualizados. A nova caminhada e patrulha **aguardam avaliação**.

Uma folha de **12desenhos, quatro direções e três fases**, com o mesmo orc, elmo, paleta azul/oliva, maça à direita e escudo à esquerda. Fonte cardinal: ORC1–5.CFA do original instalado, leitor/paleta existentes; [hashes e referências](arte/orc-walk-v01/sources.json). Vista superior ortogonal é adaptação à grade, não câmera lateral da batalha. Sem nova observação DOS, variante ou outra espécie gerada.

## Exportação e limites artísticos

Folha `img/characters/$Arena_orc_walk_v01.png`,192×256, células64×64, apoio62, escala única1/6 após normalização de resolução da correção leste. Ordem nativa sul/oeste/leste/norte; neutra na coluna central. Doze desenhos distintos, sem espelhar direções ou transladar uma pose estática. Cabeça/torso têm eixo estável, passos articulam pernas e equipamento acompanha os braços. Pintura foi inspecionada no atlas1:1 e no vídeo, sem substituir avaliação do responsável.

Produção pelo **image_gen integrado**. Primeiro mestre repetia parte das fases; correções dirigidas selecionaram somente sul/oeste passoB daV02, norte passoB daV03 e uma pose leste de resolução maior, mantendo as outras oito daV01. O exportador normaliza a resolução dessa última pela largura do elmo da neutra leste antes da escala comum; não estica cada pose para preencher a célula. Partes não selecionadas, incluindo um recorte de borda daV03, não entram no motor. [Prompt](arte/orc-walk-v01/prompt.json), [primeira correção](arte/orc-walk-v01/stride-correction.json), [correções/seleção finais](arte/orc-walk-v01/final-corrections.json), [recortes, densidade e hashes](arte/orc-walk-v01/exports.json). Não são variantes ou quatro propostas de espécie. Reconstruir só a caminhada: `python tools/export-stonekeep-orc-walk.py`; dados/sala: `node tools/build-stonekeep-orc.cjs`. Não reexportar a batalha aprovada por associação.

## Um exemplar de inspeção, sem distribuir B2

**Map016**, sala técnica17×13, piso/parede/água existentes, pilar e margens para conferir colisão. Não representa topologia original nem substitui qualquer trecho da campanha. Entrada(4,9), orc(9,6), ID **technical.stonekeep.orc.walk.01**, evento1; raio Manhattan3/intervalo90, somente região4/piso e colisões nativas. Água/pilar são obstáculos de inspeção; não se alterou a natação da dungeon. Área técnica própria, sem colisão de IDs/recibos com Stonekeep.

Mesmos Enemy7/Troop8,40PV/ATQ10/DEF5/MAT0/MDF3/AGI8/SOR5/HIT90% e ação nativa aprovados como piloto, **ainda provisórios**. EXP0/loot vazio somente no laboratório; configuração de campanha continua desabilitada/não definida. Contato usa Arena_Encounters, trava compartilhada, batalha aprovada e vitória apaga somente esse ID; derrota mantém game over. Nenhuma mecânica nova, distribuição dos seis, revisão de loot ou descanso. Cobertura real Map015 permanece **49/180encontros e32/70portas**. Para concluir Stonekeep, seguir a [matriz de nove espécies](STONEKEEP_M02_04.md#matriz-operacional-de-assets--nove-espécies) antes de retomar distribuição/encontros/portas/eventos. Forçar a porta determinístico/sem consumo continua adaptação pendente de avaliação no teste integrado.

## Acesso e avaliação curta

**http://127.0.0.1:8774/** → **Testes / Debug → Campanha e mapas → Stonekeep · orc — patrulha (RAM)**. Servidor canônico existente reutilizado, sem limpeza de dados. A batalha direta antiga continua em **Combate → Stonekeep · orc (RAM)**. Fixture Bretã feminina nível2/adaga/recursos completos, separada dos saves pessoais.

1. Observar o único orc patrulhar e caminhar ao redor para conferir sul, oeste, leste e norte, maça/escudo, escala e apoio. O pilar e a água não devem ser atravessados pelo orc.
2. Encostar para entrar no combate já aprovado; não é necessário repetir sua avaliação artística. Vencer retorna à sala e remove o exemplar técnico.
3. **Guardar teste em RAM / Carregar teste da RAM**, no menu, mantêm posição e derrota; sair pelo menu para o título encerra a sessão. Reentrar no hub reinicia o exemplar. Não grava/carrega slots pessoais. Não exige percurso da dungeon ou novo teste manual do restante.

## Verificação focal desta entrega

`tools/test-stonekeep-orc-walk.cjs`, **5grupos**, Chrome156/WebGL/perfil descartável/canvas816×624: caminho real no hub, uma única instância; quatro direções e padrões0/1/2 pelo movimento nativo; patrulha natural e bloqueios de pilar/água/raio, passos amostrados sempre em piso permitido. Contato por teclado, tentativa concorrente recusada, um ataque e vitória controlada/retorno; um recibo vazio,0 EXP/loot, repetição sem prêmio. Guardar/Carregar RAM antes/depois restaura posição, derrota, recursos, pontos, inventário e quests; título remove contrato técnico e volta à configuração normal. Save16 recusado, localStorage vazio, zero erros JS/HTTP faltantes.

Comparação à base42b857f confirma assets de batalha byte a byte e perfil/dados semanticamente iguais; bancos/Map012/015/cobertura preservados. Pai `build-rihad-arrival` recompõe Map016 e mantém todos os dados anteriores; não repetida campanha/matriz de combate. A primeira tentativa de teste leu cedo demais a janela ainda aberta após vitória; runner passou a aguardar a transição nativa, sem alterar o combate. Apenas verificação técnica, sem novo teste no editor/mobile, balanceamento ou aprovação manual da caminhada.

[Vídeo≈16s normal](evidencias/m02-orc-walk-v01/caminhada-contato-normal.webm), [sala](evidencias/m02-orc-walk-v01/patrulha.png), [contato](evidencias/m02-orc-walk-v01/contato.png), [atlas1:1](evidencias/m02-orc-walk-v01/atlas-escala-real.png), [resultado](evidencias/m02-orc-walk-v01/resultado.json), [QA](evidencias/m02-orc-walk-v01/video-qa.json). Vídeo do canvas nativo30fps/velocidade normal: demonstração controlada de quatro direções, patrulha natural e contato; vitória controlada ocorre depois da gravação. Decodificado localmente a4x só para inspeção, sem alterar o vídeo; servidor não expõe evidências. **Aguardar avaliação da caminhada antes da próxima espécie**; depois homem-lagarto, ogro e aranha conforme matriz. Não distribuir os seis B2 agora.

---

## Histórico — piloto de batalha42b857f

O registro abaixo preserva os parâmetros/evidências da entrega anterior. Sua espera de avaliação artística foi superada somente pela aprovação explícita do combate relatada acima.

### Piloto de batalha V01

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
