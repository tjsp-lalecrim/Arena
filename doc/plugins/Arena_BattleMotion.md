## Adaga piloto R01 — 28/10/2026

**Espada curta aprovada pelo responsável no editor** em Atacar, Corte leve, golpe pesado e Defender; associação à versão112246d e limites em VALIDACAO_M01.md. A adaga desta entrega não herda essa aprovação. Registro e poses da espada permanecem idênticos.

Única combinação nova: `breton.female.base`/arma1. Inspeção antes da correção reproduziu cabo sobre a mão, preparação com arma inteira atrás do corpo e, no pesado, apoio fora da mão/lâmina cruzando o tronco na recuperação. Adicionados somente os registros `weaponPoses.breton.female.base.1.idle/light/heavy`, reutilizando as posições de mão e recortes aprovados da mesma personagem, inspecionados com a lâmina curta. A adaga mantém textura, tamanho12×36, âncora própria6/28,08 e escala original; nenhum PNG ou runtime de movimento mudou. Cast/item continuam recolhendo a arma; hurt observado no contra-ataque e derrota inspecionada por poses, sem alteração nova nem validação de game over. Não houve impedimento artístico concreto no recorte corrigido; não gerar arte.

Verificação focal Chrome156 pelo acesso técnico, antes/depois: **Atacar1, Corte leve5, Estocada pesada6 e Defender2**. Dano22/22/34/0 e Vigor0/5/12/0, um uso/efeito por comando, seis quadros por movimento, tempos e retorno ao repouso preservados. Aleatório0,5/variância0 apenas no teste isolado; banco, balanceamento e saves pessoais intactos. Remover apenas o novo registro da adaga restaura a configuração112246d inteira; comparação protege todas as outras identidades e a espada aprovada. Não repetidas baterias amplas, editor ou smartphone. Aprovação da adaga permanece pendente.

**Avaliação:** Playtest → **Combate técnico (piloto)** → **Teste da arma: Bretã / adaga** → **Combater**. Avaliar **Atacar**, **Habilidades → Corte leve — adaga**, **Habilidades → Estocada pesada — adaga** e **Defender**. Arma equipada/Vigor100/rato500, sem drops. Vídeo normal e comparação em evidencias/adaga-piloto-r01/. `tools/test-sword-pilot-actions.cjs` foi parametrizado, evitando outra cópia do teste: ARENA_PILOT_WEAPON=dagger, ARENA_SWORD_PHASE=before/after; before serve a configuração visual112246d pelo navegador, usando o acesso atual em ambos os cenários e sem trocar o checkout. Valor padrão continua sendo espada. Os estados de aprovação pendente da espada nos registros R02/R01 abaixo são históricos, superados apenas nos comandos confirmados.

## Espada piloto R02 — demais ações, 28/10/2026

**R01 aprovada pelo responsável no editor**, somente Bretã feminina/espada curta/Estocada pesada; evidência e associação de versão em VALIDACAO_M01.md. R02 não altera os seis registros `heavy` aprovados, os PNGs ou o runtime. Acrescenta somente `weaponPoses.breton.female.base.2.idle/light`, reutilizando a oclusão de pega R01 com recortes próprios de cada pose. No leve, apoio deslocado1px para o centro da mão nos quadros1–3 e preparação em plano frontal com mão sobre o cabo; espera mantém a mesma pega dos extremos da Estocada pesada. Ângulos/escala/âncora existentes preservados, sem interpolação independente. Configuração é mantida na raiz pelos geradores existentes; nenhum gerador de arte foi executado.

| Ação / sequência existente | Revisão desta entrega |
| --- | --- |
| Atacar1 e Corte leve — espada7 / light | Mesmo movimento compartilhado, corrigido; cada comando executado separadamente pelo fluxo nativo |
| Espera e Defender2 / idle | Oclusão da pega corrigida; defesa mantém espera, sem novo desenho de aparo; comando executado |
| Estocada pesada — espada8 / heavy | Aprovação anterior preservada; registros idênticos à base4b49e5d, sem nova execução nesta tarefa |
| Receber dano / hurt | Seis quadros observados nas respostas nativas do rato; sem novo defeito que justificasse mudar apoios nesta revisão |
| Conjuração / cast e uso de item / item | Arma corretamente recolhida nos seis quadros de cada sequência; inspeção do Sprite, não execução de magias/itens nem concessão no piloto |
| Derrota / defeat | Seis poses inspecionadas no Sprite; apoio no chão acompanha a queda; sem ajuste novo. Não equivale a nova validação de game over |

Validação focal Chrome156, armazenamento isolado, usando **o acesso determinístico existente**, antes/depois: Atacar/Corte leve/Defender, uma execução e um efeito por comando, dano24/24/0 e Vigor0/5/0. Aleatório0,5/variância0 somente no teste; nenhum valor de balanceamento mudou. Retorno ao repouso, sincronização/planos/espelhamento, tempos iguais e dados das demais combinações preservados. Vídeo real de aproximadamente13s, reprodução1×, em evidencias/arma-piloto-r02/after/breta-espada-acoes.webm; comparação, trace e inventário de poses no mesmo diretório. Não executados testes amplos, editor ou smartphone nesta tarefa. A expectativa de oclusão em espera no teste R01 foi atualizada ao contrato R02, sem reexecutar a Estocada pesada aprovada.

**Avaliação no editor:** Playtest → **Combate técnico (piloto)** → **Teste da arma: Bretã / espada** → **Combater**. Testar **Atacar**; depois **Habilidades → Corte leve — espada** (Técnicas2); depois **Defender**. Espada já equipada, Vigor100 e rato500HP; não carregar saves pessoais ou depender de drops. Novos ajustes R02 aguardam o responsável antes de ampliar; REF09 continua parcial. Não há impedimento artístico concreto no recorte corrigido, nem autorização de gerar ou rever outras combinações.

As afirmações R01 abaixo sobre aprovação pendente/recorte desaparecendo ao repousar são históricas: aprovação e espera foram atualizadas acima.

## Encaixe focal R01 — v0.4.1, 28/10/2026

Cobertura exclusiva: `breton.female.base`, arma2 (espada curta), movimento `heavy`/skill8 (Estocada pesada). Sem arte nova, mudanças de tempos/impacto/dano/custo ou correção em lote. `weaponPoses[baseVisualId][weaponId][motion][frame]`, opcional na raiz de ArenaBattleMotion.json, define `hand[x,y,graus]`, `weaponLayer` e `gripCover[x,y,w,h]` local à célula. Sem registro, preserva os apoios anteriores. A chave é ID exato da arma, não todo seu tipo.

Reprodução: o apoio do golpe ficava5px lateralmente fora da mão e o retorno apontava a lâmina através do tronco. Corrigidos apoios/ângulos apenas nesse recorte. Na preparação, espada inteira atrás do corpo prejudicava a leitura; agora o plano da lâmina e a oclusão local da pega são separados. `gripCover` recompõe os pixels existentes da mão por cima do cabo; usa a mesma textura/quadro do corpo, inclusive material de armadura. Não altera PNG nem desenha dedos novos. Arena_BattleUI espelha também esse recorte, junto do corpo/arma. O recorte desaparece nas poses não configuradas. Âncora/escala da espada permanecem as existentes; não há interpolação independente que atrase a arma em relação ao quadro corporal.

Fonte de configuração: a raiz `weaponPoses` é autoria persistente em ArenaBattleMotion.json. build-battle-motion-r02.py e build-battle-expansion-r03.py leem a configuração existente e preservam essa raiz ao reconstruir os perfis; nenhum asset foi regenerado nesta tarefa. Não transferir estes apoios para outras identidades/armas sem inspeção própria.

Validação focal: Chrome156, batalha nativa, armazenamento isolado; uma Estocada pesada antes/depois, seis poses/tempos, espelhamento, pega/planos, repouso e recorte escondido ao retornar.37 dano/12 Vigor/uma ação/um efeito nos dois cenários determinísticos (variância0, aleatório0,5 e rato500HP somente no teste, sem balanceamento). Configuração sem weaponPoses idêntica à base efffa97. Não executada bateria ampla, editor ou smartphone. Aprovação estética da correção ainda pendente; REF09 não encerrada para toda a biblioteca.

Para avaliar sem drops: seguir o acesso determinístico e os nomes exatos em [Arena_Battle.md](Arena_Battle.md) (seção Acesso determinístico à arma piloto). Vídeo normal, comparação e resultados em evidencias/arma-piloto-r01/. `node tools/test-weapon-grip-focused.cjs` verifica somente esse recorte; ARENA_GRIP_PHASE=before serve os três arquivos históricos de efffa97 no navegador isolado, sem alterar o checkout. Registro antigo abaixo é histórico quando divergente.

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
