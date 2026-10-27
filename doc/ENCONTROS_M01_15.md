# M01-15 — encontros na dungeon

Base: develop `f1f2957` (M01-14 fechado após confirmação manual de autoria no MV1.6.1). Feature `feature/m01-encontros`, sem renumeração. Nova evidência do responsável está em `evidencias/m01-14/edicao-editor/confirmacao-responsavel.json`: abrir Map008, edição reversível, salvar/reabrir e executar Explorar Dungeon. Sem hash próprio informado; versão disponível3bcdf81. Não atribuir esse relato aos plugins/eventos novos desta feature.

## Implementação e fontes

São67 eventos nativos adicionais no Map008:37 ratos e30 goblins, IDs169–235. Preservados integralmente os168 eventos M01-14, todas as camadas, portas, água, layout, banco, regras raciais, recursos e recompensas. `tools/validate-encounters.cjs` compara essas invariantes contra a base integrada. `tools/build-encounters.cjs` compila os marcadores de `ArenaDungeon.json.integration.enemies` e é chamado ao final de `build-dungeon-map.py`; recompilar não elimina os encontros. Recusa sobrescrever eventos alheios depois de168.

Consultas efetivas: `doc/wiki/Arena_Imperial Dungeons (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, sobretudo páginas3/5; `doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json`; documentação/evidências de decodificação M01-14; `tmp/original-review/START.INF` e hashes lidos novamente no START.MIF/GLOBAL.BSA da instalação. Arquivos originais e extrações continuam fora dos assets distribuídos, sem mudanças nesta rodada. A fonte local confirma ratos/goblins e menciona homens-lagarto ocasionais; não se inventaram posições fixas destes últimos onde o conjunto de marcadores interpretados não os identifica. O combatente homem-lagarto continua no laboratório existente.

As67 posições/tipos vêm da interpretação já documentada dos flats `rat.dfa`/`goblin.dfa` do MIF; **não são observação de67 spawns pelo executável DOS**. Referências técnicas e hashes da pesquisa anterior permanecem em `evidencias/m01-14/fontes-e-topologia.json`. Esta rodada não mediu movimento, taxa de spawn ou dificuldade no DOS.

Adaptação configurável: patrulha local determinística, sem perseguição, até3tiles Manhattan da origem, uma tentativa a cada90 atualizações ativas, velocidade MV3. Somente regiões3(plataforma),4(piso),5(vão); sem água. Se a primeira direção falha, tenta as demais; se todas falham, espera. Distância/tempo/velocidade e densidade inicial são provisórios para avaliação integrada. A colisão nativa verifica os dois lados do tile, eventos, portas e jogador; não se ativa through.

## Apresentação e interação

Reutilizados **sem alterar arquivos** os atlas de combate aprovados: `Arena_Combat_rat_r02` e `Arena_Combat_goblin_r03`, seis quadros de espera, escalas0,5/0,6, apoio conforme ground do perfil. São representações laterais animadas no mapa, não folhas superiores com caminhada em quatro direções. Orientam o perfil horizontal para o deslocamento; norte/sul conservam perfil. Essa cobertura explícita pode receber arte superior própria futuramente; não foi ocultada por fallback ou nova geração. Animações da batalha permanecem intactas. Capturas nativas816×624 inspecionadas em escala de exibição.

Contato de qualquer lado usa trigger2 do MV. Inicia a tropa correspondente com `canEscape=false`, `canLose=false`, sem resetar personagem, Mana, Vigor, inventário ou aprendizado. Há trava transitória antes do setup; permanece durante mensagens/loot/transição e é liberada quando Scene_Map retorna. Vitória marca derrotado e apaga somente o evento associado. Derrota segue game over; aborto não concede recompensas nem marca derrota. O único consumidor de loot/EXP continua Arena_Loot; cada nova batalha recebe seu token nativo único.

## Persistência e respawn

Reutiliza `ArenaPersistence.enemies` por ID estável `imperial.enemy.NN`: área, questSpecific, defeated e generation. A área `imperial-dungeons` guarda completed, exitRevision e generation. Posição/contador de patrulha são nativos do Game_Event serializado; não duplicados no contrato. Saves M01-14 recebem os67 eventos ausentes antes de criar sprites; campos ausentes recebem defaults. Outros eventos, ator, equipamento, inventário, recursos e recibos não são reconstruídos. Não há migração que conceda loot.

Somente uma transferência real para outro mapa dispara saída; transferências internas e carregar uma partida não são saída. Toda saída incrementa exitRevision. Se a área **já estiver concluída**, ou MQ01 estiver concluída no contrato, incrementa geração e reativa comuns. Específicos de quest permanecem derrotados. Reentrada antes da conclusão mantém derrotados; sair repetidamente de área não concluída não ressuscita ninguém. Recompensas de conclusão e obrigações de itens não são alteradas. Recuperação excepcional de fonte obrigatória continua contrato de MQ01, fora desta implementação de respawn comum.

`ArenaEncounters.completeArea()` é ponto de integração para M01-16/18; o Gate técnico **não o chama**. Como a demo encerra no Gate e a fonte diz que não se retorna à prisão, não se inventou uma revisita narrativa. Teste de respawn é isolado pela entrada **Encontros técnicos** e opção de menu **Teste: concluir área**, que muda somente a área do teste e exibe aviso; não completa MQ01. Partidas normais/Explorar dungeon não exibem esse comando.

## Roteiro manual

1. Abrir projeto e executar. No título, **Encontros técnicos** coloca o piloto em(35,16), perto do rato original(37,16). Não acrescenta poções, equipamento ou cura ao entrar em batalha. O laboratório anterior continua acessível.
2. Observar patrulha e aproximar-se com setas ou clique. Encostar deve abrir uma batalha; deixar o inimigo encostar também deve fazê-lo. Testar Atacar/técnicas, defesa, magias/itens que o personagem efetivamente possua. Fuga não aparece.
3. Vencer, fechar o resumo de loot e conferir retorno, ausência do inimigo e nenhum novo combate sem contato. Salvar/carregar pelo menu: recursos, aprendizado, inventário e derrotas permanecem.
4. **Voltar ao laboratório → Explorar dungeon** sem concluir: não deve reativar derrotados. Na partida técnica apenas, usar **Teste: concluir área**, fechar a mensagem, sair ao laboratório e reentrar: comuns retornam. Não usar isso como prova de encerramento narrativo.
5. Para campanha/personagem atual, acessar Explorar dungeon no laboratório. A entrada do título Explorar dungeon continua piloto técnico da etapa anterior. Verificar portas/cantos/água e avaliar escala/legibilidade dos dois perfis no mapa.

## Evidências e limites

`evidencias/m01-15/resultado.json`, capturas e `contato-batalha-retorno.webm`: fluxo nativo Chrome, contextos descartáveis/save18, patrulhas dos67 eventos, limites, portas, contato, vitória, derrota, aborto, concessão única, respawn condicionado, exceção de quest em fixture e migração. Setup por locate e parâmetros ampliados de teste são identificados; não contam como caminhada contínua da dungeon nem balanceamento real. Regressões guardadas separadamente, sem sobrescrever evidências anteriores. `fontes-testadas.json` identifica hashes/versões e execuções finais.

**M01-15 implementado e validado tecnicamente no navegador, para revisão**, sem aprovação manual presumida. Nova leitura/autoria dos plugins/eventos pelo editor nesta feature e teste integrado do responsável pendentes; autoria M01-14 confirmada é evidência daquela base. Formato canônico/UTF8 dos25 registros e estrutura nativa dos eventos verificados separadamente. Galaxy A56 físico permanece pendente da integração mobile, sem bloquear desktop. Não foram refeitos testes estatísticos de balanceamento; densidade/rotas e duração de travessia devem ser avaliadas antes da entrega final. Preservados favoritos futuros, paleta/uso de itens/confirmação, destaque de raros, portas laterais finas e pesquisa de natação. Nenhuma alteração de custo aquático ou produção artística.

### Execuções finais desta rodada

-14 cenários integrados M01-15 no MV/Chrome156.0.8078.48: inclui1516 tentativas de bordas inválidas,67×32 tentativas de patrulha, porta aberta/fechada/ocupada, contato por teclado e pelo inimigo, vitória real por ação nativa e derrota por turno inimigo. Conclusão técnica também operada pelo comando real de menu.
- Recursos619; habilidades628 (incluindo192 ações raciais/equipamento/nível); criação234; persistência27; loot11 cenários. StateStore, Runtime e MotionTimeline puros passaram. As execuções iniciais concorrentes de habilidades/loot tiveram timeout de abertura; as novas execuções isoladas passaram, sem mudança no código desses sistemas ou diagnóstico presumido da causa.
- Pipeline completo build-dungeon-map.py → build-encounters.cjs reexecutado: cinco arquivos de dados byte a byte idênticos; validate-encounters e validate-dungeon passaram. O validador R03 agora permite apenas as adições M01-15 explicitamente verificadas, sem relaxar geometria/eventos1–168 ou plugins anteriores. Os roteiros de navegador R01/R02/R03 continuam evidências históricas dessas revisões.
- Capturas de mapa/rato/goblin e quadros decodificados do vídeo inspecionados em816×624. Vídeo real8,59segundos, não reconstrução; inclui boost de ataque identificado em fixture, portanto não serve como medição de equilíbrio.

Checagem adicional `tools/test-encounter-pointer.cjs`: mouse desktop e toque Android genérico916×412 emulado aproximam por pathfinding e iniciam uma única batalha nativa. Resultado em ponteiro.json; pressão120ms permite o processamento por frames do MV. Clique sintético inicial de duração zero não iniciou destino; corrigiu-se a fixture, sem mudar o motor. Não é teste físico no Galaxy A56.

## Fechamento M01-15 — 27/10/2026

Responsável testou o combate integrado e o considera satisfatório por enquanto. Estado disponível081222a, sem hash próprio, ambiente ou lista de casos informados; não atribuir aprovação manual de respawn, persistência ou outros critérios. Os14 cenários técnicos de encontros, duas entradas por ponteiro e regressões documentadas foram revisados; validate-encounters reexecutado passou, sem mudança de implementação. Critérios funcionais M01-15 atendidos tecnicamente; autorizada integração em develop. Autoria dos novos plugins/eventos no MV e testes físicos permanecem evidências pendentes de integração, sem serem declarados realizados. Melhorias futuras consolidadas em REFINAMENTOS_POS_INTEGRACAO_M01.md, sem implementação nesta rodada. Registros anteriores abaixo são históricos quando divergirem.

