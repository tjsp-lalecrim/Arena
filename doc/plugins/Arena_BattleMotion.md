# Arena_BattleMotion0.3.0 — cobertura M01-10 R03

Plugin próprio sem dependências externas; mesma ordem após Arena_Battle e MV_MotionTimeline, sem parâmetros/comandos novos. data/ArenaBattleMotion.json cobre16 identidades e inimigos1/2/3. Perfil de inimigo aceita actionMotion: goblin strike, homem-lagarto bite. Ausência usa bite para o rato R02 preservado; setup valida o movimento exigido, sem fallback estático. Não modifica useItem, fórmulas, custos ou persistência. Movimento atual continua transitório no Sprite, aparência reconstruída da identidade/equipamento ao carregar.

Sete movimentos por jogador (idle/light/heavy/cast/item/hurt/defeat); quatro por inimigo (idle/ação/hurt/defeat), seis células com durações variáveis. R02 piloto/rato preservado. Apoios da expansão em art/masters/combate-r03-expansao/hands.json. Armas1/2 por camada, nenhuma quando desarmado, recolhidas nos gestos cast/item; ataque é light e defesa mantém guarda. Conteúdo/IDs permanecem separados do núcleo puro MVMotionTimeline, que aceita quantidades alternativas de quadros.

Validação, fontes, limites de recorte, retornos neutros reutilizados e instruções em EXPANSAO_COMBATE_M01_10_R03.md. Testes nativos de17 novos perfis,47 vídeos decodificados/inspecionados, regressões e roundtrip de autoria no MV. Manual das variantes, NW.js visual/A56 e equilíbrio definitivo pendentes. Não é UI M01-11. O contrato detalhado R02 abaixo permanece histórico; suas afirmações de cobertura parcial/pendências de autoria foram substituídas neste escopo pela expansão R03.

# Arena_BattleMotion0.2.0 — piloto R02

Plugin próprio após Arena_Battle e MV_MotionTimeline, já dependentes de habilidades/recursos/persistência/criação. Sem plugins externos, parâmetros de editor ou comandos de plugin. Conteúdo em data/ArenaBattleMotion.json: schemaVersion, actors por baseVisualId, enemies por ID, skillMotions, weapons por wtypeId. Somente breton.female.base e inimigo1 revisados; perfis ausentes nessa revisão conservam explicitamente R01, sem promovê-los a cobertura nova.

Perfil: file, cell, ground, motions; movimentos com frames rect/duration/hand[x,y,graus] opcional, loop e impact. Mão em coordenadas da célula, arma com file/size/grip em pixels. Runtime aceita quantidades/tempos por movimento, sem pressupor3×4 ou9×6. Apoios de autoria em art/masters/combate-r02/hand-anchors.json. Exportação mantém uma densidade por master, sem escala por quadro.

Arma em Sprite separado atrás da mão/corpo; equipamento lido por atualização. Desarmado limpa bitmap/visibilidade; cast/item recolhem a camada sem alterar inventário/equipamento. Adaga/espada reutilizam leves/pesados sem arma fixa em cada identidade. Item atual = poção; não declarar qualquer item futuro. Atacar é leve; skills3/5/7 leve,4/6/8 pesada,9/10 conjuração; ação física desconhecida falha explicitamente. Guarda mantém espera, sem novo desenho específico.

Window_BattleLog.startAction reorganiza somente apresentação R02: mensagem nativa, performAction, espera no impacto exibido, showAnimation nativo. Não chama useItem/Game_Action.apply. invokeAction libera recuperação; endAction libera também sem alvos. Log aguarda recuperação; dano/derrota próprios bloqueiam progresso até terminar. Rato não pisca/embranquece para esconder os desenhos; collapse nativo mantém tempo sem apagar a queda. Demais perfis mantêm a apresentação anterior. Não altera fórmulas, raças, disponibilidade, itens ou consumidores de recurso.

API ArenaBattleMotion.profile(battler) consulta cobertura; sample(battler) lê key/index/tick/total/done/impactTick/released/weaponId. Estado no Sprite, sem serializar no ator/save; carregar reconstrói pela identidade/equipamento. Setup valida movimentos obrigatórios antes da batalha, sem fallback estático para movimento ausente. Arquivos ausentes continuam erro de carregamento.

Testes/gravações em REVISAO_COMBATE_M01_10_R02.md. Editor/NW.js, Galaxy A56, manual e aprovação estética pendentes. Contra-ataque/reflexão e movimentos adicionais não declarados validados. Expansão para15 personagens/2 inimigos pendente; M01-10 aberto. Não é interface M01-11 ou plugin universal de combate; o núcleo puro separado é reutilizável.


## R02 de integração — v0.4

Frames com hand precisam declarar weaponLayer como front ou back. O sprite da arma muda de plano em relação a _mainSprite quando a pose exige, mantendo coordenadas de mão/pega/ângulo/tamanho e o espelhamento da disposição aprovada. Preparação leve1 e pesada2 usam back; demais apoios front. Poses sem hand recolhem a arma. Não aplica custos/dano. Todas16 identidades e ambas armas verificadas por sondagem de apoios; batalhas reais de Bretã/rato verificadas separadamente. Nenhuma imagem/temporização de batalha regenerada.
