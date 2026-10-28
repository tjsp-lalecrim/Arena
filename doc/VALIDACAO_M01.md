## Fechamento M01-16 — 28/10/2026

Responsável aprovou o **design visual** do sistema de quests; estado disponível086264e, sem hash próprio ou dispositivo informados. Evidência em evidencias/m01-16-r02/aprovacao-responsavel.json. Não atribuir a essa avaliação testes de lógica, persistência, respawn, autoria no editor ou mobile. Critérios funcionais revisados separadamente:23 cenários MQ01,5 grupos de diário e regressões identificados nas evidências R01/R02; validate-journal.cjs reexecutado neste fechamento passou. M01-16 concluído tecnicamente, autorizado para integração em develop. Nova autoria da UI no MV e Galaxy A56 físico permanecem verificações de integração, sem alegar execução. REF06 registra notificações futuras, sem implementação; REF01 permanece único para favoritos/atalhos. M01-17 corresponde a poções e descanso, sem renumeração. Estados anteriores abaixo são históricos quando divergirem.

## Diário M01-16 R02 — 28/10/2026

Mesma feature/m01-quests, base2ea761d: diário com filtros Pendentes/Concluídas/Todas, lista de missões conhecidas, descrição narrativa, passos revelados com ícones e status geral do booleano completed. Modelo de leitura separado da progressão; lógica de MQ01, fontes/recuperação, recompensas e respawn preservados. Reflow de lista/detalhes/abas em640×480 e916×412 emulado, contexto transitório preservado. Ler REVISAO_DIARIO_M01_16_R02.md e DIRETIVA_DE_NAVEGACAO.md (NAV01 obrigatória para todos os menus novos/revisados). Evidências próprias em evidencias/m01-16-r02, sem sobrescrever R01. Revisão para avaliação do responsável, sem merge ou próximo backlog; editor desta UI e A56 físico pendentes. Registros de apresentação anteriores abaixo são históricos quando divergirem.

## Estado vigente — M01-16 (27/10/2026)

M01-15 fechado tecnicamente e integrado/publicado em develop534ff7b após avaliação manual restrita ao combate disponível081222a; não atribuir aprovação manual de respawn/persistência/dispositivos. REF01–REF05 em REFINAMENTOS_POS_INTEGRACAO_M01.md permanecem futuros. Feature/m01-quests implementa M01-16, sem renumeração: MQ01, diário J10–J40, chave/fonte/porta/Gate, redundância saída/entrada, recuperação e recibos, tesouros pelo settlement existente e conclusão ligada à área/respawn. Ler QUESTS_M01_16.md e evidências próprias; bootstrap e migração de saves de laboratório estão explícitos. Para revisão, sem merge ou início de M01-17/18; introdução/Ria/F01 continuam M01-18. Nenhuma nova arte, revisão de bônus/drops de inimigos ou custo aquático. Editor da nova feature/manual de quests ainda pendentes; A56 físico somente integração mobile, sem bloqueio desktop. Registros abaixo são históricos quando divergirem.

## Fechamento M01-15 — 27/10/2026

Responsável testou o combate integrado e o considera satisfatório por enquanto. Estado disponível081222a, sem hash próprio, ambiente ou lista de casos informados; não atribuir aprovação manual de respawn, persistência ou outros critérios. Os14 cenários técnicos de encontros, duas entradas por ponteiro e regressões documentadas foram revisados; validate-encounters reexecutado passou, sem mudança de implementação. Critérios funcionais M01-15 atendidos tecnicamente; autorizada integração em develop. Autoria dos novos plugins/eventos no MV e testes físicos permanecem evidências pendentes de integração, sem serem declarados realizados. Melhorias futuras consolidadas em REFINAMENTOS_POS_INTEGRACAO_M01.md, sem implementação nesta rodada. Registros anteriores abaixo são históricos quando divergirem.

## Estado vigente — M01-15 (27/10/2026)

M01-14 concluído desktop: autoria manual do Map008 e Explorar Dungeon confirmados pelo responsável, estado disponível3bcdf81, sem hash próprio informado. Fechamento2ca0201 integrado/publicado em developf1f2957. M01-15 na feature/m01-encontros, com67 encontros nativos (37 ratos/30 goblins), patrulha delimitada, contato único, batalha/loot existentes, derrotas persistidas e respawn apenas na saída após conclusão aplicável. Ver ENCONTROS_M01_15.md e suas evidências para execuções/limitações. Implementado para revisão; sem merge desta feature ou início de M01-16. Autoria dos novos plugins/eventos e playtest integrado do responsável ainda não atribuídos à confirmação M01-14. Galaxy A56 físico pendente da integração mobile, não bloqueante desktop; melhorias futuras e Vigor na água inalterados. Registros abaixo são históricos quando divergirem.

## Fechamento vigente M01-14 — 27/10/2026

Responsável confirmou abertura do Map008, edição reversível, salvamento e reabertura pelo MV1.6.1, além de Explorar Dungeon. Estado disponível3bcdf81, sem hash de teste informado. Evidência manual em evidencias/m01-14/edicao-editor/confirmacao-responsavel.json, separada das tentativas automáticas anteriores. Integridade revalidada por validate-dungeon.cjs; critérios de topologia, portas, água, persistência e geradores cobertos pelas evidências R03 revisadas. **M01-14 concluído no escopo desktop**, autorizada integração em develop e continuidade M01-15. Ressalvas futuras de legibilidade das portas laterais e investigação de natação preservadas; S01 não aplicado, Vigor aquático inalterado. Galaxy A56 físico pendente da integração mobile, não bloqueante desktop. Registros abaixo de autoria/estética pendentes são históricos quando divergirem deste fechamento. Não atribuir essa confirmação a M01-15.

## Playtest MV e teste de autoria em cópia — 27/10/2026

Responsável confirmou execução de Explorar Dungeon pelo MV1.6.1 até o ponto testado (estado disponível031a58b). Não atribuir edição/salvamento/reabertura a essa evidência. Cópia temporária pronta em tmp/mv-editor-m01-14/Game.rpgproject, excluída do Git;273 arquivos de execução do original preservados. Nova abordagem sem capturas, por abertura separada/acessibilidade, não conseguiu operar o controle nativo. Roteiro curto e alteração segura em TESTE_EDITOR_M01_14.md; dados/propriedades/eventos/plugins da cópia verificados por arquivo, sem chamar isso de teste de autoria. M01-14 aguarda esse ciclo; sem merge ou M01-15. Autorização de continuidade permanece válida quando passar. Galaxy A56 físico é pendência da integração mobile, não bloqueio desktop. Arte aprovada e custo de Vigor na água inalterados.

## Aprovação M01-14 e pesquisa de natação — 27/10/2026

Estrutura/visual do estado disponívelb194b44 aprovados pelo responsável. Porta lateral fina/pouco visível é melhoria futura não bloqueante; preservar forma/encaixe/âncora/animação/colisão, sem geração nesta rodada. Pesquisa em INVESTIGACAO_NATACAO_ARENA.md confirma custo de fatigue documental, mas taxa/parado versus movimento/forma exata do afogamento não foram observados. S01 é proposta não aplicada; Vigor continua exclusivo de técnicas de combate. Ler APROVACAO_MAPA_M01_14.md. Autoria Map008 editar/salvar/reabrir no editor ainda sem comprovação; nova automação falhou. M01-14 não fechado, sem merge; M01-15 confirmado no backlog, ainda não iniciado por essa dependência. Registros anteriores de estética pendente são históricos; não transformar aprovação visual em teste funcional/editor/A56.

## Correção M01-14 R03 — 27/10/2026

Direção gráfica/planta permanecem aprovadas; encaixes de portas/objetos/colisões não estavam aprovados. R03 corrige os cinco prints de defeitos com componentes ortogonais, dobradiças fixas, ausência de cap sobre vão, plataformas independentes, tesouros maiores e suporte válido de decoração. Ler DIRETIVA_DE_MAPAS.md e DUNGEON_M01_14_R03.md. Sem merge, isometria ou avanço para M01-15. M01-14 em validação: testes Chrome/contratos separados de aprovação visual; captura do editor falhou duas vezes, sem comprovar editar/salvar/reabrir; A56 físico pendente. Registros anteriores são históricos quando divergirem.

## Revisão M01-14 R02 — 27/10/2026

Responsável aprovou direção gráfica e fidelidade estrutural da base disponível4161615. R02 revisa portas/objetos/água; a aprovação da base não se estende automaticamente às variantes novas. Planta preservada. Portas com quatro vistas/três estados, tesouros inspirados no arena_loot, água A1 própria e natação restrita ao mapa8/região2, sem custo/regeneração de Vigor. Fontes, contratos, testes e limites em DUNGEON_M01_14_R02.md. M01-14 permanece em validação: captura do editor falhou novamente; autoria no MV e A56 físico não verificados. Sem merge ou avanço de backlog. Estados operacionais anteriores abaixo são históricos quando divergirem desta revisão.

# Evidências de implementação M01

## Estado operacional M01-14 — 26/10/2026

M01-13 integrado/publicado em develop4c612ae após revisão técnica e aprovação limitada ao menu; destaque de raros é melhoria futura não implementada. Feature/m01-dungeon-inicial entrega mapa8/tileset4, planta original50×50 adaptada3×3,14 portas, chave/Gate e pontos de integração. Navegação/colisões/save-load e comparação da planta testados. **M01-14 em validação, não concluído:** autoria/edição/salvar/reabrir do novo mapa no editor não confirmados por falhas da automação; avaliação de arte/escala do responsável e A56 separados. Ler DUNGEON_M01_14.md. Sem merge da nova feature, geração procedural, mapa-guia ou início de M01-15. Registros operacionais anteriores são históricos quando divergirem.

## Estado operacional — M01-13 (26/10/2026)

M01-12 concluído no escopo incremental aprovado, integrado/publicado em develop90e309b. Paleta, simplificação de uso de itens e design da confirmação permanecem melhorias futuras, sem implementação. Feature/m01-loot entrega M01-13 tecnicamente, sem renumeração, para revisão e sem merge. Implementação795d80d; testes/limites em evidencias/m01-13/fontes-testadas.json. Limite por origem individual já definido em LOOT.md: até uma peça por inimigo; agregação mantém origens. Tabelas wiki/provisórias, raridade substitutiva, reserva de capacidade, fonte de missão e ledger único descritos em LOOT_M01_13.md. Testes/capturas em evidencias/m01-13; editor/A56 e balanceamento final permanecem separados e pendentes. Não iniciar M01-14.

Registros abaixo são históricos quando divergirem deste estado operacional.


## Fechamento M01-12 — aprovação do responsável (26/10/2026)

Responsável aprovou inventário/equipamentos atuais, associados ao estado disponível6271f22, sem informar hash próprio, dispositivo ou lista de casos. A aprovação aceita a cobertura mínima de materiais existente para prosseguir; não transforma torso/material em figurinos completos nem comprova novos testes físicos/editor. Critérios funcionais revisados: arrasto/alternativas, troca/remoção sem perda, técnicas/atributos/aparência e save/load demonstrados nas evidências R01/R02. Validador estático/puro reexecutado com sucesso no fechamento; demais suítes identificadas são as execuções anteriores, sem alegar repetição. M01-12 concluído no escopo incremental aprovado, com ressalvas aceitas e não bloqueantes.

Melhorias futuras, não implementadas: reavaliar paleta; facilitar acesso/uso de itens reduzindo confirmações constantes; melhorar design da janela de confirmação. Preservar também favoritos futuros e limitações de cobertura artística registradas. Nova sessão visual no editor e Galaxy A56 físico continuam pendentes para validação integrada, sem atribuir à aprovação do responsável. Autorizada integração em develop e publicação; sem promover main/release.

## 26/10/2026 — M01-12 R02, comparação visual

Base35a15e6, implementação0820646, mesma feature; Arena_Inventory0.2.0. Slots com ícones/nomes e comparação Atual/Selecionado com oito parâmetros finais e diferenças assinadas. Sete cenários específicos,18 regressivos do inventário e toque emulado916×412, validador puro/estático. Capturas816×624 e nomes longos em evidencias/m01-12-r02. Consulta somente leitura ao código dos quadros/cartões do Battlespire, sem cópia/dependência. Aprovação anterior do inventário registrada, sem aprovar automaticamente R02. Testes e limites em INVENTARIO_E_EQUIPAMENTOS_M01_12.md/R02. Nenhuma nova sessão no editor ou A56; autoria anterior preservada como histórica. Sem merge ou encerramento artístico.

## 26/10/2026 — M01-12, inventário e equipamentos

M01-11 consolidado após revisão/aprovação do combate informada pelo responsável; versão associada ao estado disponível25672fe, sem hash/ambiente/lista exaustiva de testes informados por ele. Fechamento74eb6f6 integrado/publicado em develop6e59882. Nova feature/m01-inventario-equipamentos, implementação c3face1 e materiais86c9143; hashes em evidencias/m01-12/fontes-testadas.json. Sem merge em develop/main ou início de M01-13. Favoritar habilidades/itens fica futuro, sem implementação.

Inventário em cartões/descrições/quantidades, abas/páginas, slots e prévia de atributos, equipar/substituir/remover por teclado/mouse/drag/toque, importante protegido, técnicas/atalhos pela API anterior. Transação sobre equipamento nativo com validação antes do trade, estoque obsoleto/capacidade de devolução cheia bloqueados, repetição sem mudança, snapshot/rollback. Poções/livros reutilizam os consumidores existentes. Sem itens na campanha inicial ou lojas/crafting/loot novos; evento técnico8(13,5) no Map007 e entrada do título separam kit técnico.

Aparência mínima de couro/malha por materiais IA em regiões do torso, preservando fontes/poses/alpha/tempos das16 identidades. Pranchas em escala nativa e inspeção do piloto complementam testes de12 células de mapa/42 de combate por identidade/material. Regiões protegidas opacas e alpha são exatos; bordas RGB translúcidas podem arredondar até1 pela cópia de canvas. Não são novas silhuetas completas ou segmentação final de cada peça. M01-12 continua em revisão e sem encerramento artístico; limites/arquivos/prompts em INVENTARIO_E_EQUIPAMENTOS_M01_12.md e arte/MATERIAIS_M01_12_*.json.

Evidências evidencias/m01-12: 18 cenários reais de equipamento/arrasto/cancelamento/revalidação/itens/quantidades/atributos/save/load/batalha (incluindo falha nativa de trade com rollback e seleção alterada após prévia), toque Android genérico916×412 emulado, comparação16 identidades e invariantes, núcleo reutilizável puro incluindo exceção/rollback. Regressões de criação234, persistência27 incluindo save legado real, e interface de batalha12 cenários. Sem saves pessoais. Saídas finais e hashes identificam a revisão testada; falhas encontradas de hitTest/área de confirmação e foco de abas foram corrigidas, não contadas como aprovação.

Editor instalado: abrir, F10/detalhes Arena_Inventory ON, salvar, fechar/reabrir sem erro de leitura;20 registros preservados/canônicos/UTF8 sem BOM, somente System.versionId mudou semanticamente. Leitura por acessibilidade; captura de screenshot falhou, sem inspeção visual de playtest NW.js. Evento8 adicionado depois e testado pelo fluxo nativo no navegador, não alegado como inspeção do mapa no editor. Galaxy A56 físico/fullscreen/desempenho e avaliação visual do responsável continuam pendentes. Banco de combate/bônus/custos e arquivos do motor preservados.

## Aprovação e fechamento M01-11

26/10/2026: responsável testou o combate no estado25672fe e considera o resultado atual satisfatório. Escopo manual informado: combate observado nessa versão; não foram especificados todos os menus/casos, navegador, editor ou dispositivo. Não inferir teste físico A56/fullscreen nem funcionalidades posteriores. Critérios técnicos M01-11 já documentados passaram; autorização atual permite consolidar em develop. Favoritar habilidades/itens para inclusão nos atalhos fica como melhoria futura, sem implementação ou alteração das associações existentes.

## 26/10/2026 — M01-11 R02, apresentação e resultado

Base30e441d, mesma feature/m01-interface-batalha. Código revisado no commit a18fe76, com hashes em evidencias/m01-11-r02/fontes-testadas.json. Responsável declarou aprovados combate e animações atuais nesta solicitação; não atribuir à declaração novos testes no editor/aparelho, nem aprovação da UI. Interface ainda aguarda revisão visual. Sem merge em develop/main, release ou M01-12.

Corrigida a visibilidade da barra de atalhos durante mensagens/resultado (print do responsável), com coordenação antes/depois da atualização nativa, entrada adicional bloqueada e seletores ocultos sem capturar teclas/toque. Indicadores sem caixas, barras5px/nome18/recursos14, painel inferior compacto, molduras finas/seleção verde, slots com nome e custos/quantidades. Alvos múltiplos substituem comandos na faixa inferior. Motor, registro canônico18 plugins, banco, regras, custos, atalhos persistentes e animações preservados por comparação com30e441d.

Evidências novas em evidencias/m01-11-r02; R01 preservada. Teste nativo específico em1100×800/640×480 cobre salvar/carregar atalhos antes do encontro, listas/configuração/cancelamento, execução, vitória/EXP sem sobreposição, bloqueio de C/dígitos e chamada direta durante mensagem, mapa sem repetição, vários alvos/cancelamento e derrota. Janela pequena revelou o canvas fixo/recortado no MV desktop; extensão do plugin reduz somente quando necessário, mantendo proporção/coordenadas nativas, validada na viewport real. Nenhum ajuste somente na fixture para esconder o defeito.

Suíte nativa de12 cenários de slots, categoria única, mouse/toque Android emulado916×412, seis/oito espaços e três/duas colunas, e regressão nativa de combate executadas nesta rodada. Validadores preservam transformação de corpos/armas/efeitos, consumidores de custos, dados e assets. Capturas reais de principal, listas, configuração, alvo e resultado inspecionadas; geometria sozinha não é aprovação visual. Falhas iniciais (estado passivo active e recorte desktop pequeno) corrigidas; somente saídas finais bem-sucedidas são usadas como evidência.

REVISAO_INTERFACE_M01_11_R02.md contém fontes consultadas, roteiro e limites. Sem novo playtest visual no editor/NW.js nem Galaxy A56 físico. Autoria anterior do MV permanece identificada como evidência daquela versão. Balanceamento provisório intacto. UI continua em revisão visual do responsável.

## 26/10/2026 — M01-11, slots e atalhos

M01-10 revisado após a escolha explícita de concluir a expansão:17 novos perfis com seis quadros/gestos/armas,47 vídeos reais, regressões e autoria no MV; R02 aprovado preservado. Commits1533e0d/49cf6dc integrados e publicados em develop pelo merge f37018d, sem promover main. Feature/m01-interface-batalha criada dessa base. Implementação M01-11 identificada pelo commit c03e96c; capturas e suíte principal têm hashes em fontes-testadas.json. A correção final restrita à abertura da única categoria válida tem hashes próprios em fontes-testadas-categoria.json e teste nativo categoria-unica.json.

Interface própria com jogador à esquerda/inimigos à direita, armas/efeitos/offsets coerentes, barras reais próximas aos corpos e painel inferior compacto. Comandos Atacar/Habilidades/Defender/Itens, cartões com ícone/nome/custo ou quantidade, filtros/descrição por seleção, seis atalhos configuráveis com referências battle.1–8 no contrato existente. Nenhum novo consumidor de recursos, bônus, retrato, animação, catálogo ou dependência externa. Arte existente reaproveitada. Trio técnico de inimigos existentes no Map007(13,8), com reinício explícito e sem patrulhas/dungeon final.

Evidências em evidencias/m01-11 e roteiro em INTERFACE_BATALHA_M01_11.md: fluxo Scene_Battle nativo, custos únicos inclusive repeats2, insuficiência, navegação/configuração/cancelamento sem custo, estoque obsoleto/item sem alvos, técnicas/magias/defesa/poções, save-load de associações/recursos/aprendizado/inventário, três inimigos e derrota/game over. Mouse e toque Android genérico916×412 emulados,6/8 espaços e3/2 colunas, limites do canvas e pontos de toque verificados, ajuda≈16,51px CSS. Não é teste Galaxy A56. Capturas principal/habilidades/inventário e gravação do canvas demonstram a composição, sem aprovação manual inferida.

Regressões: batalha nativa/erro/esquiva/crítico/múltiplos efeitos,628 habilidades/192 ações raciais,619 recursos,234 criação,981 bônus,27 persistência. Núcleo de slots testado sem Arena, geometria/configurações inválidas, UTF8 e18 plugins/16 anteriores idênticos. A revisão visual detectou/corrigiu textos corrompidos, recorte do botão Voltar e uma emulação sem identificação Android que recortava o canvas. Roteiro antigo passou a aguardar transferência/mapa/jogador; fixture que tentava descansar em combate foi corrigida sem liberar essa ação.

Autoria MV por teclado/acessibilidade: abrir, F10/detalhes Arena_BattleUI ON, salvar, fechar, reabrir nova janela e salvar. Somente System.versionId alterado semanticamente,18 registros preservados/canônicos/UTF8 sem BOM; reformatações semânticas idênticas restauradas de cópias antes do editor, preservando adições válidas. Manual do responsável continua adiado, sem aprovação estética da UI; NW.js visual, A56/ergonomia/fullscreen/desempenho físicos pendentes. Equilíbrio continua provisório. Feature para revisão, sem integração automática ou M01-12.

## 26/10/2026 — M01-10 R03, expansão concluída tecnicamente

Aprovação manual R02 associada a a61977b somente Bretã/rato, preservados byte a byte e por perfil. Escolha explícita: concluir a expansão antes de integrar.15 novas identidades/goblin/homem-lagarto agora usam R03, sete/quatro movimentos com seis células temporizadas, apoios de armas e mordida correspondente à skill11.22 prompts/masters não vazios,678 novas células,744 no conjunto, com retornos neutros reutilizados identificados. Não alegar744 desenhos exclusivos ou aprovação individual das variantes. Relato atual EXPANSAO_COMBATE_M01_10_R03.md; R01/R02 abaixo históricos.

Evidências em evidencias/m01-10-r03:17 perfis novos executados pelo fluxo Scene_Battle com todos os quadros observados, adaga/espada/desarmado, consumo único, magia/poção, dano/derrota, vitória/retorno dos inimigos;47 WebM reais e decodificação por reprodução, pranchas/recortes1:1 inspecionados. Teste integrado de turnos/erro/esquiva/crítico/barras/save-load e limites sem alvo/seleção obsoleta passou. Regressões628 habilidades/192 ações,619 recursos,234 criação,981 bônus,27 persistência; validadores e núcleo puro passaram. Fixtures isoladas, sem saves pessoais, valores raciais/combate preservados.

Autoria pelo editor: abriu Arena, F10 leu Arena_BattleMotion ON, salvou, fechou, reabriu nova janela e salvou novamente;16 registros semanticamente idênticos, estrutura canônica/UTF8 sem BOM. System.versionId alterado pelo editor; reformatações sem mudanças semânticas de Items/Skills/MapInfos descartadas após comparação exata. editor.json separa essa evidência do Chrome. Responsável mantém testes manuais adiados, novas variantes sem aprovação estética individual, playtest visual NW.js/Galaxy A56 pendentes; não são impedimentos funcionais demonstrados. Balanceamento provisório/limites em M01-20.

## 26/10/2026 — revisão M01-10 R02, cobertura parcial explícita

Branch inicialmente limpa8137dac. Somente breton.female.base e rato revisados:42/24 desenhos IA, seis por movimento, arma separada com apoio por quadro, leves/pesados e gestos de conjuração/poção distintos. Rejeitados/preservados dois estudos com figuras unidas/recortes; fontes/prompts/versões/hashes em arte/COMBATE_MOVIMENTOS_R02_MANIFEST.json. Todos os assets R01/retratos anteriores preservados. Outros15 personagens/2 inimigos ainda R01, não declarar cobertura R02.

Chrome156.0.8078.47, jogo816×624/viewport1100×800:10 gravações completas do canvas e baseline R01, sem saves pessoais. Três encontros com troca adaga→espada→desarmado, custos5/12/Mana6, poção1, seis quadros de cada movimento observados, save/load posterior, vitória/retorno e derrota/game over. Dois efeitos/um useItem/um débito; ataque sem alvos termina sem travamento, técnica selecionada antes de perder Vigor é rejeitada. Teste detectou impacto uma atualização cedo; corrigido para aguardar o quadro exibido, não o próximo relógio. Traços finais/gravações em evidencias/m01-10-r02/resultado.json, limites.json;11 vídeos decodificados e filmstrips/GIFs inspecionados em recortes1:1. Não são replay artificial de atlas nem teste no editor.

Regressões628 habilidades/192 ações raciais,619 recursos,234 criação+UI,27 persistência, StateStore/Runtime e matriz16 personagens/3 inimigos, com expectativas de seis quadros somente para piloto/rato; demais três. Núcleo alternativo de quatro quadros, validadores e66 células com alpha/margens/hash. Ajustes finais dos pontos de mão conferidos4x e em escala nativa, vídeos regravados. M01-10 continua em validação: avaliação de ritmo/peso, expansão e aprovação estética pendentes. Manual do responsável adiado; editor MV/gerenciador/salvar/reabrir/playtest NW.js/Galaxy A56 desta revisão não realizados. Canonical16/14 registros anteriores preservados verificados separadamente.

## 26/10/2026 — M01-10 R01, batalha integrada (em validação)

M01-09 revisado e integrado/publicado em develop782ebc8, preservando0e9f267 e seu histórico. Branch inicial limpa e sem divergência; feature/m01-combate criada a partir desse merge. Critérios, fontes, matriz e roteiro em COMBATE_M01_10.md. Main preservada, sem release ou integração da nova feature.

Chrome156.0.8078.47,1100×800/jogo816×624: Scene_Battle real por evento301, turnos nativos, vitória/mapa/self switch/sem repetição e derrota/game over; fuga bloqueada. Técnicas5/6 e Mana9/10 pelas APIs anteriores, três poções, insuficiência/exato, cancelamento, erro/esquiva/crítico, dois impactos/um custo, save/load nativo após batalha. Resultados e capturas em evidencias/m01-10/resultado.json e ui.json. Mana inimiga0/10 foi fixture: painel mantém barra vazia; os inimigos distribuídos têm somente Vida. Corrigidos fundo de barra vazia e altura/espaçamento do painel.

Matriz nativa em cobertura/resultado.json:16 identidades e três inimigos, três frames observados de cada estado espera/ação/dano/derrota. Folhas IA e prompts/hashes em arte/COMBATE_M01_10_MANIFEST.json;19 folhas/228 células com margens/alpha. Pranchas e capturas no tamanho final inspecionadas; não equivalem à aprovação do responsável. Ação do jogador genérica sem arma desenhada, aliases explícitos; continuidade/apoio e adequação da arma ainda impedem fechar integralmente a apresentação. M01-10 em validação, não concluído por métricas de pixels ou pelo piloto isolado.

18 encontros determinísticos com Bretã/Elfa negra/Redguard, adaga nível1: leve/pesada vencem rato1/1, goblin2/1, homem-lagarto3/2 turnos, custos5/12 por ação. Registro comparacao-encontros.json; RNG0,5/variância0 e HP ampliado nas matrizes são fixtures em memória. Sem ajuste de P01–P08. Regressões:628 habilidades/192 ações,619 recursos,234 criação+UI,981 bônus,27 persistência, StateStore/Runtime e laboratório. Contextos descartáveis, sem saves pessoais. Resultados em evidencias/m01-10/regressoes; históricos preservados.

Formato canônico UTF8 sem BOM/14 referências e13 registros anteriores idênticos verificados; motor, regras de custo, banco e arte aprovada anterior intactos. Abertura/gerenciador/salvar/reabrir no editor, playtest visual NW.js e Galaxy A56 desta versão **pendentes**. O responsável adiou testes manuais; não há nova aprovação manual. Relatos de versões anteriores abaixo permanecem históricos.

## 26/10/2026 — M01-09 R01, habilidades e livros

Estado inicial limpo feature/m01-recursos-progressao2561830, sincronizado com origin; develop e1be141. Revisados diff/critério/evidências M01-08, validate-resources/validate-data e registros619/234/981/27, sem impedimento. Integração autorizada em develop pelo merged3c736d e publicação confirmada antes de criar feature/m01-habilidades. Nenhuma atribuição de relato manual antigo a código novo. main não promovida.

Conteúdo mínimo: desarmado3/4, adaga5/6 e espada7/8, custos5/12 pelo consumidor único Arena_Resources, apenas batalha e equipamento correspondente. Cura9/Mana8/25+MAT e Dardo10/Mana6/max(1,3×MAT−MDF)/Fogo2 preservados; aprendizado permanente separado das técnicas derivadas. Livros5/6, sem nível mínimo, ensinar/verificar antes de consumir1, estoque conhecido preservado com informação na ajuda, rollback testado. Nenhum livro no inventário inicial ou novo catálogo/profissão/restrição racial. Notas e descrições sincronizadas. Fontes/adaptações em HABILIDADES_M01_09.md.

628 verificações em Chrome156.0.8078.47, jogo816×624/viewport1100×800, contextos descartáveis e slots19/20 técnicos.192 ações nativas compararam16 identidades×adaga/espada×níveis1/6/12×leve/pesada, com custos e dano/acerto raciais. Foram exercitados início forçado/stale, troca/remoção, saldo insuficiente/exato, cancelamento sem pagamento, ausência de alvo, erro com custo e quatro aplicações/um pagamento, custos MP+Vigor sem débito parcial; magias, rollback de livros, save real da lista de plugins M01-08, aprendizado/inventário/recursos e saneamento de atalhos incompatíveis. Menu nativo de livro e aviso de conhecido operados por teclado; seleção/confirmar/cancelar no Map006 testados. Fixtures de RNG0,5/variância0/HP1000/multialvos/MP+MAT inimigos ficam só em memória. Não são dados de campanha ou teste estatístico de equilíbrio.

Regressões recursos619, criação234, bônus981, persistência27, laboratório nativo movimento/colisão/menu/save-load/equipamento/livro, StateStore/Runtime passaram. Resultados novos em evidencias/m01-09/regressoes, preservando os anteriores. Validadores dados/recursos/habilidades e sintaxe dos três novos plugins passaram, sem assets/motor/bônus alterados e sem outro consumidor de custo. Arquivos canônicos e13 referências de plugins verificados.

Autoria MV executada por teclado/acessibilidade: abrir, F10/detalhes dos três novos plugins ON, salvar, fechar, reabrir em nova janela Arena sem erro e salvar novamente com as descrições finais. Comparação semântica preservou13 registros de plugins e encontrou somente System.versionId alterado pelo editor. Formato canônico/UTF-8 sem BOM e arquivos referenciados verificados. Evidência em evidencias/m01-09/editor.json, separada do Chrome. Geometria de captura/clique indisponível; não declaramos playtest visual NW.js ou Galaxy A56 físico. O laboratório não usa Scene_Battle nem oferece inimigo agir, animação, XP/loot/recompensa. Critérios funcionais de M01-09 atendidos no recorte autorizado; equilíbrio definitivo e apresentação pertencem M01-10/20, atalhos visuais M01-11, aquisição de livros M01-13 e Guild/magias ambientais a marcos posteriores. Feature para revisão, sem integração automática ou avanço a M01-10.

## 26/10/2026 — M01-08 R01, recursos e evolução

Baseline limpa develop e1be141, feature/m01-recursos-progressao. M01-07 R05 aprovado/integrado, P01–P08 preservadas no catálogo e assets sem alterações. Resumos operacionais alinhados; relatos R02–R04 continuam históricos identificados.

Fonte: manual oficial Skyrim Legendary Edition, p.6 impressa/PDFp.7, escolha entre três recursos; endereço/adaptação em RECURSOS_E_PROGRESSAO_M01_08.md. Configuração própria R01:100 Vida/50 Mana/100 Vigor (+10 inicial Argoniano), uma escolha de+10 por nível2–99, sem cura ao evoluir, sem curvas HP/MP MV. EXP/nível continuam nativos; não importa perks/skillsXP/peso. Números provisórios para balanceamento. MP com teto9999 para não truncar escolhas tardias no limite999 anterior.

MV_ResourceProgression0.1.0 e Arena_Resources0.1.0, namespace arenaResources v1. HP/MP atuais nativos; base/escolhas/modificadores separados; Vigor em contrato próprio v1, sem TP/passivo. Save anterior consolida nível como baseline sem escolhas retroativas e preserva gasto/máximo; escolhas idempotentes por nível. Poção4 ativada50, poções2/3 nativas50/25, API de cama restaura três recursos. Técnicas3–8 indisponíveis até M01-09; só pagamento controlado de skill5, sem batalha/dano/encontros implementados.

Evidências em `evidencias/m01-08/`: `test-resources-progression.cjs` passou619 verificações,16 identidades, save nativo R05 criado com plugins anteriores, gastos e vários roundtrips, escolhas1/múltiplas/nível99/EXP/pendentes, aplicação única, configuração alternativa, limites0/máximo, regeneração/TP/caminhada, poções/descanso, UI escolher/confirmar/cancelar e entrada Map005. Poção4 usada pelo menu nativo; eventos de gasto e cama também acionados por teclado. Capturas inspecionadas em816×624 (viewport1100×800), Chrome156.0.8078.47. Perfis/saves descartáveis, sem saves pessoais.

Regressões: criação234, persistência27, bônus aprovados981, laboratório movimento/colisão/menu/save-load/dados nativos, StateStore e Runtime passaram. Ajustada uma expectativa histórica de criação: laboratório antigo sem identidade agora recebe Vigor neutro100 ao importar, sem ganhar raça/bônus. Nenhum critério de identidade removido. Evidências novas em subpasta regressoes/, sem sobrescrever R05. validate-data, validate-resources e sintaxe dos plugins passaram; zero arquivos ausentes/pageerrors nos cenários.

Editor MV: reabertura antes da validação, F10/detalhes leram Arena_Resources ON e MV_ResourceProgression ON, salvar, fechar e reabrir em nova janela Arena sem erro. Comparação semântica dos dados: somente System.versionId alterado pelo editor; dez registros de plugins preservados, UTF-8 sem BOM e formato canônico. Registro em editor.json. Controle por teclado/acessibilidade; geometria de captura/clique indisponível, portanto não declaramos inspeção visual de playtest NW.js. Galaxy A56 físico/IME/fullscreen/desempenho não executados.

M01-08 concluído tecnicamente no escopo autorizado, em feature para publicação/revisão, sem merge automático. Recursos reais do personagem e seus contratos validados; equilíbrio, duração de Vigor por encontro, técnicas/armas e camas narrativas ainda dependem M01-09/10/17/20. Cenário racial100/110/crescimento sem regrant atendido; demais cenários práticos permanecem futuros. M01-09 não iniciado.

## 26/10/2026 — fechamento M01-07 R05

Decisão atual: aprovação estética com ressalvas, sem geração/correção de imagens nesta rodada. Manifesto `arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json` identifica 64 arquivos ativos e oito arquivos piloto, versões, dimensões e hashes; `arte/PENDENCIAS_VISUAIS_M01_07.md` registra bordas/recortes, orientação e o recorte do pé do piloto Khajiit. Essas falhas não foram corrigidas nem transformadas em padrão para gerações futuras. Registros R02/R03/R04 abaixo são históricos.

Proposta aprovada: `AUDITORIA_BONUS_RACIAIS_M01_07.md`, R04, commit1dd9a6c, P01–P08; cópia imutável e valores exatos em `decisoes/`. Implementados em catálogo e plugins0.2.0, descrições sincronizadas: Argoniano+10 Vigor inicial único; Bretão dano mágico×0,75; Elfo Negro dano de arma×1,05/acerto+0,02; Alto Elfo imunidade ao estado3; Khajiit AGI+1; Nórdico dano frio×0,5; Redguard corpo a corpo×1,08/acerto+0,03; Bosmer precisão geral de armas+0,04 (opção preferida). Sem multiplicadores por nível novos, classes ou bloqueios raciais.

Evidências novas em `evidencias/m01-07-fechamento/`: 981 verificações raciais,16 identidades/seis níveis/oito saves nativos anteriores/48 novos roundtrips;234 verificações de criação;16 prévias e16 restaurações de aparência;27 verificações de persistência; laboratório nativo preservado; mouse e toque genérico emulado. Chrome desktop156.0.8078.47, contextos descartáveis, sem saves pessoais. Testes sintéticos de combate não representam encontros completos ou balanceamento validado. Histórico R04 executado separadamente com fontes antigas, sem apresentá-lo como validação P01–P08.

Autoria no editor: gerenciador abriu por F10 e leu Community_Basic OFF, MV_CharacterRules e Arena_CharacterCreation ON. Salvamento, encerramento, relançamento em nova janela Arena e novo salvamento executados por teclado/acessibilidade. Auditoria encontrou somente System.versionId como alteração semântica nativa; nomes/ordem/status/parâmetros preservados e descrições0.2.0 retidas após reabertura. `plugins.js` mantém formato canônico e UTF-8 sem BOM. Geometria de captura/clique indisponível impediu conferência visual detalhada; não declaramos playtest visual NW.js nem Galaxy A56. Relato anterior de save/load no playtest/navegador continua atribuído ao responsável e à versão histórica, sem estendê-lo aos bônus R05.

M01-07 concluído no escopo funcional desktop, com ressalvas aceitas e balanceamento provisório. Critérios e limites em `FECHAMENTO_M01_07.md`. Eficácia prática e vantagens excessivas continuam dependentes de M01-08/09/10/20, com cenários em `BALANCEAMENTO_RACIAL_CENARIOS_M01.md`; aparelho físico permanece M01-19. Próximo elegível M01-08, não iniciado.

## 25/10/2026 — baseline documental (M01-01)

Estado inicial confirmado: main, develop e feature/documentacao-inicial apontavam para cfd31d3; feature/documentacao-inicial ativa. Apenas .gitignore e doc/ estavam não rastreados. Nenhuma alteração de implementação preexistente foi encontrada. Motor confirmado por Game.rpgproject e Utils.RPGMAKER_VERSION: 1.6.1.

Revisados os seis documentos de entrada, diretrizes temáticas de plugins, personagem, combate, quests, adaptação e arte. Decisões atuais prevalecem sobre os diagnósticos históricos. Corrigidas instruções de cópia e inspeção de branches que ainda pareciam atuais.

Verificação automática de referências DOCUMENTO.md/txt dos 25 documentos: nenhuma ausente. .gitignore mantém wiki, prints, saves e temporários fora do índice. Inventariadas explicitamente doc/wiki, doc/prints e a instalação original/ARENA, sem modificar fontes. O conjunto documental e .gitignore será revisado no índice antes do commit e integrado em develop localmente. Nenhum envio, tag ou release autorizado ou executado.

M01-01: critérios documentais verificados; commit e integração serão identificáveis pelo histórico Git. Os demais itens ainda não possuem evidência de implementação nesta baseline.

## 25/10/2026 — especificação MQ01 (M01-02)

Baseline consolidada no commit 29fc22b e integrada em develop. Especificação na feature/m01-especificacao-mq01. Leitura dos PDFs locais Imperial Dungeons (seis páginas, não quatro), Main Quest, Races, Monsters, Base Weapons e Potions. Renderização Poppler; inspeção visual das pp. 2, 3 e 5 de Imperial Dungeons. Identificadas cela oriental e saída sudoeste, sem afirmar cópia geométrica integral. Print skyrim_quest_system.jfif visto para hierarquia do diário. Fontes externas permanecem ignoradas e intactas.

M01-01 concluído. M01-02 concluído quanto a especificação: sequência, traduções, fontes, áreas, conteúdo mínimo, patrulhas e transições registrados em MQ01_ESPECIFICACAO.md. Nenhum evento narrativo ou mapa final declarado implementado. Cama não confirmada no percurso; validação técnica separada. Nenhum playtest do original ou teste mobile realizado.

## 25/10/2026 — laboratório executável (M01-03)

Feature/m01-base-executavel. Novo Map001 17×13 com bordas por região, início válido (8,6), evento de instrução em (8,5), menu e persistência nativa. Configuração Side View e personagem único; sem batalha neste laboratório. Removidas referências configuradas a título, veículos e sons inexistentes; não restaurada biblioteca padrão. Código do motor preservado. Community_Basic preservado/desativado, ajustes ativos inventariados em doc/plugins/Arena_Runtime.md. Configuração nativa cobre auto renderer, corrida desligada e dimensões originais; Arena_Runtime mantém cache 20 MPix.

Execução real: tools/test-boot.cjs, Chrome desktop 156.0.8078.47 headless, viewport 1100×800, jogo 816×624, WebGL, Windows. Passaram título, nova partida, movimento, mensagem, menu, salvar pelo menu, carregar recuperando posição, colisão e ausência de pageerror/HTTP >=400. Capturas de mapa e menu inspecionadas; sobreposição inicial do nome de mapa corrigida. Resultado reproduzível em tools/test-boot.cjs, resumo persistido em doc/evidencias/m01-03-boot.json. Teste em contexto isolado sem saves pessoais. Avisos não fatais de Canvas2D do motor antigo podem aparecer.

node --check dos dois plugins e tools/test-runtime.cjs passaram. O teste de Runtime cobre padrões, parâmetros inválidos e configuração 960×540 em ambiente mínimo sem dados Arena. Isso não atesta layout 960×540 nem outras versões do motor.

M01-03 concluído. Limites: grade e marcador são formas técnicas geradas pelo código, sem arte final, sons, criação de personagem ou campanha. M01-06 e combate não concluídos. Samsung Galaxy A56, toque e NW.js não testados; roteiro em TESTES_M01.md, botão touch de tela inteira ainda pendente. Nenhuma publicação/release.

## 25/10/2026 — banco mínimo (M01-04)

Feature/m01-dados, dependências M01-02 e M01-03 integradas em develop. Conteúdo e IDs em DADOS_M01.md. Um ator/classe técnica, chave, três poções, dois livros, duas armas/tipos, duas armaduras/tipos, técnicas leves/pesadas catalogadas, Cura/Dardo, três estados, três inimigos/tropas e oito raças com fontes/adaptações; 16 visuais explicitamente pendentes. Nenhuma classe profissional, bloqueio racial ou drop nativo introduzido. Recursos sem crescimento automático, aguardando M01-08. Habilidades com Vigor não podem ser usadas até implementação dos custos. Estado próprio e consumidor do catálogo ainda são trabalho das próximas features.

Fontes adicionais lidas: Base Armor pp.1–2, The Known Spellbook pp.1–3, Magical Effects p.3; Races pp.1–12, Monsters pp.2/6/13/17, Base Weapons p.2 e Potions p.1. Preservadas cópias de consulta. As adaptações raciais de natação/escalada não criam esses sistemas; bônus e números catalogados são provisórios até M01-07/08.

validate-data.cjs passou: todas as tabelas parseiam, índices/IDs e referências entre registros válidos, tipos equipáveis, chave importante, loot nativo desativado e mapa válido. test-runtime.cjs passou. test-boot.cjs passou novamente no Chrome 156.0.8078.47/WebGL, com integração adicional: canEquip=true para quatro equipamentos, adaga ID1 e cota ID2 equipadas, cura de 10 para 60 HP, livro ensina skill9, aplicação repetida sem benefício rejeitada pelo teste nativo. Resultado em doc/evidencias/m01-04-boot.json; capturas em m01-04-mapa/menu.png. Fluxo básico sem pageerror/HTTP >=400. Inspeção visual das capturas acompanha esta etapa.

M01-04 concluído no escopo de banco mínimo. Limitações: bônus raciais catalogados não aplicados; Vigor, proteção/saneamento da chave por quest, aprendizado completo, progressão e animações ainda não implementados. Nenhum combate, criação de personagem, diário ou encerramento foi testado. Doença do rato exige adaptação antes de concluir combate. M01-05 a M01-20 permanecem a fazer. Não há evidência de testes em aparelho, toque ou tela inteira mobile.

A inspeção visual do banco detectou acentos corrompidos por leitura com codificação Windows. Corrigidos System/Classes e instrução do mapa para UTF-8; validador agora exige termos pt-BR e rejeita esse padrão de corrupção. README.TXT original consultado: instalação se identifica como 1.07 CD-ROM, consistente com omitir proteção de cópia no portal; Docs/Passwords.txt consultado apenas como referência histórica, não usado para custos adaptados.

## 25/10/2026 — correção de leitura de plugins pelo editor

Branch feature/correcao-plugins-editor, originada de develop com árvore limpa. Relato do usuário: localhost executa, mas o editor informa “Não foi possível ler o arquivo plugins.js”. Comparação com main confirmou que o cabeçalho canônico de duas linhas e a separação de `var $plugins =` e `[` haviam sido alterados na preparação da base (2d79de3). Isso foi um erro na compatibilidade de autoria: a validação anterior cobria somente o navegador.

Correção mínima em js/plugins.js: restauradas apenas as duas linhas canônicas de comentário e a quebra antes do array. Registros internos preservados, inclusive descrições: comparação estrutural automática antes/depois confirmou nomes, ordem, status e parâmetros idênticos. Community_Basic continua false; Arena_Runtime e Arena_TechnicalPreview continuam true. Nenhum plugin próprio, arquivo interno do motor ou dado do jogo alterado.

Verificado: UTF-8 válido sem BOM com decodificação estrita; `node --check js/plugins.js`; array isolado aceita JSON.parse sem comentários; avaliação JavaScript preserva os três registros; todos os três arquivos js/plugins/<nome>.js existem. Formato igual à estrutura da versão em main. CRLF mantido no arquivo de trabalho.

Causa confirmada nesta execução: divergência de formato introduzida pela edição anterior, sem arquivo ausente ou erro de sintaxe/UTF-8. Causa provável do erro do editor: incompatibilidade de seu leitor com essa estrutura alterada. A causalidade específica do leitor MV ainda não foi confirmada por reprodução antes/depois ou inspeção de seu código; não afirmar essa hipótese como diagnóstico conclusivo.

Tentativa de validação no editor instalado em D:/RPG Maker MV/RPGMV/RPGMV.exe: aplicativo iniciado e janela “RPG Maker MV” identificada. A captura inicial falhou com “FrameArrived timed out: timed out waiting on channel”; após nova seleção/ativação, a recuperação falhou com “window capture timed out: timed out waiting on channel”. O controle foi interrompido sem usar entradas às cegas. Não foi possível verificar versão exibida, abrir o projeto, ler o gerenciador de plugins, salvar pelo editor nem reabrir o projeto. Esses passos estão explicitamente pendentes. Abrir o executável não conta como abrir o projeto.

Após a normalização, tools/test-boot.cjs passou em localhost, Chrome desktop 156.0.8078.47, WebGL, viewport 1100×800: título, nova partida, movimentação, interação, menu, salvar/carregar nativos no navegador, colisão, integração do banco e zero pageerror/HTTP >=400. Esse salvamento é de partida no navegador, não de projeto pelo editor. A execução após um futuro salvamento pelo editor continua pendente. Resumo em doc/evidencias/correcao-plugins-editor.json.

Critérios de TESTES_M01.md e BACKLOG_M01.md ampliados para exigir autoria no editor além de execução. M01-03 reclassificado como em validação até o ciclo do editor ser comprovado. Os registros de conclusão anteriores são históricos e não substituem esse critério. Correção mantida na feature enquanto a validação de autoria estiver pendente; sem integração em develop, envio remoto ou release nesta tarefa.

## Evidência manual recebida — abertura no editor após correção

Nesta rodada, o responsável confirmou que o projeto voltou a abrir no RPG Maker MV após a normalização de js/plugins.js (5d10e90). Evidência manual fornecida pelo responsável, não execução do Codex. O resultado confirma a correção do problema de abertura observado. Não comprova leitura/conferência no gerenciador, salvamento/reabertura do projeto nem localhost após salvamento pelo editor; esses passos continuam pendentes. Revisão local: árvore limpa em feature/correcao-plugins-editor, somente os cinco arquivos esperados no commit. Integração dessa feature em develop autorizada expressamente nesta rodada; M01-03 permanece em validação parcial.

## M01-05 — estado persistente dos sistemas próprios

Execução em feature/m01-persistencia, originada de develop após a integração expressamente autorizada da correção do editor (5d10e90 + evidência manual 21f1439). Árvore inicial limpa, remoto origin corresponde ao repositório informado; nenhuma consulta/alteração remota necessária. Commit de implementação: 5ee6781, seguido de testes/evidências nesta feature, sem merge desta nova feature.

Contratos em PERSISTENCIA_M01.md e documentação de MV_StateStore/Arena_Persistence. O núcleo não contém IDs Arena e é testado sem dados do projeto; o adaptador contém somente contratos/IDs de integração. Game_System recebe raiz schemaVersion 1 e namespace arena v1; o motor continua responsável por serialização/armazenamento nativos. Extensões por alias, sem modificar motor. Registros anteriores de plugins comparados estruturalmente com develop: nomes/ordem/status/descrições/parâmetros preservados; dois novos registros ao fim. Arquivo canônico, UTF-8 sem BOM, JSON válido e arquivos referenciados presentes.

| Critério M01-05 | Evidência |
| --- | --- |
| Identidade/recursos/progressão | Nome somente no ator; raça/gênero/base visual em contrato; recurso próprio e decisão de aumento persistem; nenhum crescimento aplicado ou cache de armadura salvo |
| Quests e itens importantes | Etapa/objetivos/conclusão persistem; fonte da chave e recibos de consumo/entrega sobrevivem a load; repetição não duplica nem repõe consumo legítimo |
| Inimigos e áreas | Instâncias técnicas comuns/específicas, derrota, conclusão/saída/geração persistem; load não provoca respawn |
| Atalhos | Referências de item e skill persistem, sem quantidades derivadas; ID inválido rejeitado |
| Saves antigos e campos ausentes | Save criado com os três plugins anteriores em navegador isolado carregou com os plugins novos, preservando nome, HP, poções e magia nativos; defaults próprios adicionados sem concessões. Fixtures parciais preservam recibos |
| Repetição e falhas | Fonte repetida, recuperação explícita, consumo/entrega repetidos, capacidade insuficiente e exceção após gainItem testados; rascunho/recibo não confirmado em falha; núcleo genérico impede repetição de contador de recompensa |

Resultados: tools/test-state-store.cjs, tools/test-runtime.cjs, tools/validate-data.cjs, tools/test-persistence.cjs e tools/test-boot.cjs passaram. Syntax checks dos dois plugins e dois testes passaram. Persistência: 27 verificações no Chrome desktop 156.0.8078.47, MV 1.6.1, contexto descartável; zero pageerror/HTTP >=400 na página atual. Regressão do laboratório/banco manteve título, nova partida, movimento, interação, menu, save/load, colisão, equipamentos livres, cura e livro. Resultado consolidado em doc/evidencias/m01-05-persistencia.json.

O teste legado gera slot 3 com a composição anterior de plugins (fixture de 5d10e90), sem MV_StateStore/Arena_Persistence; depois carrega com a composição atual no mesmo contexto descartável. Slots 1/2 testam também remoção de raiz/campos. Não foi usado, lido ou sobrescrito save pessoal. Um primeiro ensaio do teste novo selecionou Continuar por padrão devido ao save legado; o teste foi corrigido para selecionar explicitamente Nova partida, e a execução final passou.

M01-05 concluído no escopo de contratos, persistência e operações técnicas, sem antecipar UI, combate, quests completas, respawn automático ou aplicação de progressão/raciais. Não existe novo evento no mapa. Sanitização de duplicatas legadas e verificações de transição da quest continuam M01-16; loot completo continua M01-13. Defaults não reconstroem progresso perdido/corrompido por suposição. Versões futuras incompatíveis geram falha explícita sem reescrever o save.

Limitações de autoria: a confirmação manual recebida cobre abertura no editor após a correção anterior. Não foram executados gerenciador, salvamento/reabertura nem localhost após salvamento pelo editor com os novos plugins; M01-03 permanece em validação parcial. NW.js e Galaxy A56 não testados. Roteiro manual isolado em PERSISTENCIA_M01.md e TESTES_M01.md. Sem push, merge da nova feature, release ou publicação.

## Evidência manual recebida — save/load em playtest e navegador

O responsável confirmou nesta rodada que conseguiu salvar e carregar a partida tanto pelo playtest do RPG Maker quanto pelo navegador. Evidência manual fornecida pelo responsável, não executada pelo Codex. Referência mais provável: feature/m01-persistencia em 99e3788, HEAD local/remoto no início desta rodada; o responsável não informou SHA, versão de navegador ou se conferiu cada campo próprio, portanto essa associação é contextual, não confirmação exata de build/cobertura. O resultado não valida conteúdo posterior de M01-06, nem gerenciador/salvamento/reabertura do projeto pelo editor (diferente de salvar a partida).

Revisão M01-05: árvore limpa, remoto da feature igual ao local (0/0), diff restrito a contratos/plugins/testes/documentação. Reexecutados test-state-store, test-runtime, validate-data e 27 verificações test-persistence com sucesso. Integração em develop autorizada nesta rodada, preservando commits; main permanece no commit inicial cfd31d3, sem promoção de desenvolvimento a release.

## M01-06 — primeira amostra artística e publicação das linhas Git

GitHub conferido por fetch/ls-remote e API antes de agir: não havia main/develop no remoto; padrão era feature/correcao-plugins-editor; feature/m01-persistencia coincidia local/remoto. Sem alterações locais preexistentes. M01-05 revisado, evidência manual contextual registrada em aee1914, integrado em develop por merge77f120d preservando 5ee6781/99e3788. main publicado em cfd31d3 (somente baseline inicial); develop publicado em77f120d. PATCH da configuração GitHub e nova consulta API confirmaram default_branch=main; ls-remote confirmou HEAD→main. Sem force push, reescrita, tag ou release. Feature/m01-amostra-visual criada de develop; sua publicação para revisão é autorizada, sem integração automática.

Geração por IA disponível e executada via image_gen.imagegen. Oito chamadas: ficha de bretã, caminhada, rato, pedra, ícones, sonho de Ria e duas correções. Prompts/referências efetivamente anexadas em doc/arte/prompts-m01-06.json; fichas/fontes/processo/limites em AMOSTRA_M01_06.md; PNGs mestres em art/masters e exports/dimensões/SHA em exportacoes-m01-06.json. Modelo/seed não informados pela ferramenta. Consultadas explicitamente wiki/prints ignoradas e README da instalação original; nenhuma fonte externa incluída por acidente. Imagens de outros jogos orientaram leitura, não estilo.

| Categoria exigida | Geração/integração | Verificação realizada |
| --- | --- | --- |
| Personagem de exploração | Bretã piloto em folha nativa3×4 de144×256, células48×64 | Vista em escala real e no mapa; quatro direções, margens e pés emy62; passos curtos de estudo |
| Combatente Side View | Mesma ficha, pose96×96 | Vista lateral na galeria; estática, não folha completa svActors nem combate |
| Inimigo animado | Rato3×96×64, sequência0/1/2/1 | Capturas e GIF do motor, escala comum, caudas preservadas, apoioy60; nenhum sistema de batalha |
| Chão/parede | Tiles48×48 na folha B de768×768, Tileset2 | Mapa repete amostras, diferencia piso/parede e respeita colisão; kit mínimo sem autotiles/cantos |
| Arma/armadura/poção | Três ícones32×32 de IA | Inspeção visual em tamanho real na galeria; não substituem IconSet do banco ainda |
| Ilustração | Sonho de Ria/prisioneira,816×544 | Evento nativo show/erasePicture e texto; vista na janela do jogo; MQ01 permanece etapa0 |

Testes executados: build-art-samples.py, com dimensões, transparência, margens em todas as células e bases fixas; node --check do plugin; validate-data, test-state-store e test-runtime; test-art-preview em Chrome156.0.8078.47/WebGL, janela1100×800, jogo816×624, 10 verificações; test-boot e test-persistence (27 verificações) também passaram após integração. Save/load da amostra preservou Map002, posição, imagens, HP nativo e recurso próprio de prova. Retorno ao Map001 confirmado com imagens anteriores; diff de Map001/System vazio. Zero pageerror/HTTP>=400 no percurso testado. Perfis descartáveis, sem saves pessoais.

Inspeção visual de capturas corrigiu sobreposição da legenda de perfil e texto da galeria aparecendo sob a cena de Ria. Um ensaio automatizado acionou a saída antes de terminar o interpretador do evento: teste passou a aguardar canMove/isEventRunning; última execução passou. Evidências finais: doc/evidencias/m01-06-arte.json, m01-06-mapa.png, m01-06-ria.png, m01-06-loop.gif. O GIF usa frames capturados no motor; não substitui a inspeção em escala final.

M01-06 concluído no escopo da pequena amostra solicitada nesta rodada: todas as categorias geradas/integradas/verificadas em navegador desktop. Isso não aprova biblioteca completa nem combate: perfil é pose isolada, rato só farejo/respiração, caminhada de estudo, piso/parede com repetição perceptível sem autotiles. Variantes de armadura/base e demais combinações continuam M01-12/07; não geradas por associação a este item. Não há vozes, quest completa, novo inventário, criação de personagem ou cena narrativa final.

Abertura: título → Amostra visual; Map002. Enter diante da placa Ria em(4,9) mostra arte; placa Sair em(1,9) retorna ao laboratório. Esc abre menu/salvar. Instruções e limitações em doc/arte/AMOSTRA_M01_06.md. Editor com esses novos assets/plugins, gerenciador/salvamento/reabertura do projeto e Galaxy A56 não testados. A evidência manual de playtest/browser recebida no início não foi atribuída a M01-06. M01-03 mantém pendências de autoria, sem alegar que save de partida equivale a salvar o projeto.

## Revisão estética M01-06 — 2026-10-25

O responsável rejeitou a identidade visual anterior. **M01-06 em revisão; não concluído artisticamente.** Formatos funcionando não substituem aprovação estética. Direção de arte 1.1 proíbe protagonista ou quaisquer membros/sombras/equipamentos dele em narrativa reutilizável.

Rodada pequena: dungeon R02, rato R02 com correção R03 e Ria R02. Referências visuais inspecionadas e consulta decodificada à instalação, com limitações de associação documentadas em `arte/REVISAO_IDENTIDADE_R02.md`. Anteriores preservados. Dungeon ainda tem perspectiva convergente; rato é trecho de bote, não combate completo. Sem produção em lote nem promoção da rodada rejeitada.

Visor isolado `tools/art-review.html`: Chrome desktop, imagens 1:1, carregamento, animação e pausa sem erros/404. Teste `tools/test-art-review.cjs`. Screenshot `doc/evidencias/m01-06-revisao-r02-browser.png`. Testes de persistência: 27 verificações aprovadas em contexto descartável, sem saves pessoais; testes de estado, runtime e banco mínimo aprovados. A evidência de navegador não comprova editor ou aparelho. Nenhum teste novo no editor MV ou Galaxy A56 nesta rodada. Aprovação estética, mapa ortogonal final e animação completa permanecem pendentes.

## Aprovação de direção e integração R04 — 25/10/2026

Responsável aprovou a direção da dungeon R02, rato R03 e Ria espectral R02 após `4faf3b2`; arquivos/dimensões/hashes exatos em `arte/APROVACAO_DIRECAO_R02_R03.json`. Essa evidência manual supersede a espera de aprovação da revisão anterior, mas não amplia a aprovação aos assets antigos ou a todos os testes técnicos. M01-06: **em validação técnica, não concluído**.

Galeria nova Map003/tileset3, título “Validação visual R04”, mantém Map001/002 e anteriores. Ria/rato aprovados reutilizados sem regeneração; uma amostra de superfícies ortogonais gerada com a dungeon aprovada como referência. Documentação, prompt, avaliação e matriz das categorias em `arte/INTEGRACAO_R04.md`.

Executados: `test-art-integration`, `test-art-preview`, `test-state-store`, `test-runtime`, `validate-data`, `test-persistence` (27 verificações) e `test-boot`; salvar/carregar em contexto descartável, sem saves pessoais; zero erros/arquivos faltantes. Auditoria de 27 registros e seis referências aprovadas inalteradas. Screenshots/resultados R04 em `doc/evidencias/`.

Pré-teste de viewport Android genérico no Chrome desktop:916×412, canvas538,77×412; sem extravasar. Texto de painel equivale a11,22px CSS, pequeno e pendente de leitura física. **Não testado no Galaxy A56.** Editor/gerenciador/salvar projeto/reabrir/playtest da versão R04 não executados. Não transferir evidências manuais de versões anteriores para esta integração.

Tentativa de autoria pelo Codex: o executável instalado abriu janela com título “Arena - RPG Maker MV”, mas `get_window_state` falhou duas vezes (incluindo recuperação com seleção renovada) com `window capture timed out: timed out waiting on channel`. Sem captura verificável, não foram feitas ações de gerenciador, salvamento/reabertura ou playtest. A janela/título isolados não comprovam leitura completa do projeto. Essas verificações continuam pendentes.

## R05 — prioridade do original, autoria e leitura da galeria

Em25/10/2026, consulta direta a ARENA/README.TXT (1.07 CD-ROM), Manual.pdf p.7 e Player Guide.pdf da instalação; wiki Races/Character Creation como complemento. Nova prioridade explícita em DIRETRIZES_DE_ADAPTACAO.md, DIRECAO_DE_ARTE.md e INICIO_NO_CODEX.md. Materiais do manual não são medição do executável; adaptações numéricas permanecem identificadas. Khajiit de Arena não deve ser substituído automaticamente pela aparência de títulos posteriores. Fontes extraídas ficam somente em tmp ignorado.

Arena_ArtPreview0.2.1 melhora leitura mobile da galeria atual, sem regenerar imagens: texto primário26px (17,17px CSS na simulação916×412; antes11,22). Toque emulado percorre caminho nativo e abre Ria. Evidências R05 e inventário de16 combinações em `arte/FIDELIDADE_E_VALIDACAO_R05.md`; uma piloto, zero conjuntos finais completos.

Editor: gerenciador abriu/fechou via teclado, Ctrl+S regravou dados, editor fechou e reabriu Arena. Comparação semântica preserva banco e contratos de plugins, exceto metadados nativos registrados. `evidencias/m01-06-r05-editor-roundtrip.json`. Captura/clique indisponíveis e nomes das linhas custom não visíveis por acessibilidade; não declarar conferência visual completa nem playtest da galeria. Galaxy A56 físico não testado. M01-06 em validação; M01-07 não iniciado, sem merge prematuro da dependência. Início normal ainda é laboratório; não há tela de criação para testar.

## Encerramento da amostra M01-06

Revisão do escopo conforme solicitação atual: os critérios de exemplos em motor estão atendidos pelas evidências R02–R05. Matriz em arte/ENCERRAMENTO_AMOSTRA_M01_06.md. M01-06 concluído como amostra desktop, sem converter pendências de M01-10/12/14/19 em requisitos de biblioteca inteira nesta etapa. Teste físico A56 e inspeção visual completa do editor continuam explicitamente pendentes. M01-05 permanece validado. Integração da feature visual em develop autorizada para iniciar M01-07.

## M01-07 — criação-base desktop

Feature visual revisada/encerrada no escopo de exemplos conforme ENCERRAMENTO_AMOSTRA_M01_06.md e integrada em develop por7e7094c. Nova feature/m01-criacao-personagem baseada nesse develop. Sem merge automático desta nova feature ou alteração de main.

Nome pt-BR, oito raças/duas opções de gênero,16 identidades-base, bônus derivados, escolha/revisão/cancelamento/confirmar, save/load com reconstrução e recibos. Laboratório técnico e galerias preservados; chegada provisória Map004 encerra a versão após criação, sem dungeon/introdução/aliados. Quinze conjuntos-base gerados por IA, piloto feminina reaproveitada. Prompts/fonte/SHA/dimensões em arte; variantes em poses estáticas, sem declarar movimentos completos de combate/caminhada. Matriz e roteiro em M01_07_CRIACAO.md.

Testes: criação234 verificações de API mais fluxo UI; ponteiro mouse/toque emulado; estado/runtime/dados,27 de persistência anterior, galeria atual e laboratório. Alguns ensaios de inicialização excederam30s; reruns isolados passaram e diagnóstico curto encontrou Scene_Title ativo sem erro. Uma expectativa antiga de ir ao laboratório por Novo Jogo falhou e foi atualizada para selecionar arenaLab, preservando o novo contrato em teste próprio. Corrigidos recortes de preview assíncronos e fundo do título atravessando UI. Erros de fixture de combate (inimigo fora da tropa e tentativa de equipar item não possuído) corrigidos no teste, sem mudar regras para mascará-los. Últimas execuções aprovadas registradas em evidencias/m01-07-result.json e pointer-result.json. Sem saves pessoais.

Editor: abertura, detalhes com Community_Basic OFF/MV_CharacterRules ON/Arena_CharacterCreation ON, Ctrl+S, comparação semântica de8 registros idênticos, fechamento/reabertura executados por acessibilidade/teclado. Apenas versionId/scroll de edição nativos modificados. Canonical UTF-8 sem BOM preservado. Screenshot/playtest visual NW.js e Galaxy A56 não realizados. A autoria de base M01-03 está validada funcionalmente; não significa teste visual completo. Evidência m01-07-editor.json.

Validação final usou servidor isolado local127.0.0.1:8766 (fila ampliada) sem encerrar o servidor existente8765: criação234, ponteiro desktop/mobile emulado, persistência27 e laboratório passaram. Um ensaio no servidor existente mostrou falha de carregamento de Tilesets.json na inicialização; arquivo/JSON eram válidos e a causa de transporte não foi comprovada. Não foi alterado o motor ou introduzido retry para esconder erro; requestfailed agora é registrado nos testes novos.

## Revisão visual de personagens —26/10/2026

Arte geral aprovada; os novos arquivos r02 de M01-07 aguardam avaliação do responsável. Ver arte/REVISAO_PERSONAGENS_R02.md para fontes, diferenças e roteiro.16 combinações no Chrome156.0.8078.47, janela1100×800/jogo816×624: prévias com recortes144×144/48×64/96×96 e escala1,16 aparências no Map004 com âncora0,5/1,16 save/load nativos com nomes de imagens v01 reconstruídos para r02,256 amostras nativas de padrão/direção. Sem erro de script/rede/arquivo ausente. As capturas e resultado por combinação estão em evidencias/personagens-r02/.

Auditorias:192 células de mapa,864 SV, margens/alpha, caminhada piloto preservada, regras/chaves/statuses idênticos;179 registros SHA/dimensões e sete logs de prompts. Regressões executadas: criação234 verificações mais UI, mouse/toque genérico emulado e persistência27. Contextos descartáveis em8766, sem saves pessoais; evidências de versões anteriores preservadas. A primeira tentativa do novo cenário tentou configurar mapa antes de carregar Map004; fixture corrigida, sem mudança de motor/produto.15 mapas são poses estáticas;16 SV repetem pose, sem novos ataques/dano/morte animados.

Compatibilidade de autoria: `js/plugins.js` canônico UTF-8 sem BOM e todos os scripts referenciados presentes; arquivo e motor não alterados nesta rodada. A validação manual/de autoria anterior não é reatribuída aos assets r02. Abertura, gerenciador, salvar/reabrir e playtest visual no editor para esta revisão permanecem pendentes, assim como Galaxy A56 físico. As verificações de navegador não substituem esses testes.

### Pose dos retratos — pose-r03,26/10/2026

Inspeção visual dos16, ampliados e em144px; quatro candidatos novos corrigem peito/ombros/pescoço/cabeça dos Khajiit e o perfil divergente dos Argonianos, ambos os gêneros. Guia1.4/procedimento obrigatório e gabarito de pose explícito; referências de pose/identidade/estilo separadas, quatro prompts integrais com bloco fixo. **Inspeção pelo Codex não é aprovação estética pelo responsável**; conjunto permanece em revisão.

Chrome156.0.8078.47 em1100×800/jogo816×624:16 prévias com recortes/escala iguais,16 save/load reconstruindo aparência,16 aparências no Map004,256 padrões/direções nativos; regressão234 verificações mais UI de nome/cancelar/revisar/confirmar. Sem erros de script/rede/arquivos ausentes, sem saves pessoais. Auditoria: só quatro campos de face mudaram,12 retratos e todos os dados de outras categorias/regras preservados;194 registros SHA/dimensões e oito logs. Evidências novas em evidencias/retratos-pose-r03/, anteriores preservadas. Pranchas com guias externas em arte/; PNGs de jogo sem guias. Nada disso prova anatomia automaticamente. Editor/NW.js e Galaxy A56 desta revisão permanecem pendentes; nenhuma nova animação foi produzida. Ver arte/REVISAO_POSE_RETRATOS_R03.md.

### Identidade e auditoria racial R04 —26/10/2026

Dois pilotos masculinos inspecionados com presets reais de Skyrim: diagnóstico, quatro chamadas IA e antes/depois em arte/IDENTIDADE_ARGONIANOS_KHAJIIT_R04.md. **Não integrados**: estética pendente, pé do combatente Khajiit na borda, sem ciclos/variantes completos. Alpha real confirmado por composição opaca/amostras; a leitura preliminar de RGB sob alfa zero como halo estava errada e foi corrigida. Recortes144px/2x e quadros únicos48×64/96×96 foram inspecionados, sem provar folhas completas ou integração dos candidatos. Sem variantes femininas novas, sem alteração dos16 visuais ativos, sem aprovação estética.205 registros SHA/dimensões e nove logs auditados significam rastreabilidade; não produção aprovada dos candidatos.

Auditoria mecânica das oito raças em AUDITORIA_BONUS_RACIAIS_M01_07.md, baseada no Manual.pdf original p.7, wiki local e execução MV. P01–P08 aguardam avaliação; nenhuma aplicada. Correção técnica isolada: retirar habilidades desarmadas3/4 dos bônus de arma. Evidências antes/depois em evidencias/auditoria-racial-r04/:8 raças×7 níveis, fórmulas, dano, crítico, acerto, AGI, Vigor, imunidade e resistências. Antes reconstruído com regras de1399af8 em memória; plugin intacto. Variância0, MAT+20 e ação de frio são fixtures isoladas, não conteúdo novo do jogo.

Chrome desktop156.0.8078.47 em1100×800/jogo816×624: regressão234 verificações mais UI de criação;16 prévias e16 save/load,16 aparências no mapa,256 amostras nativas; sem erros de script/rede/arquivos ausentes. Evidências novas em evidencias/auditoria-racial-r04/regressao/, anteriores preservadas. Auditorias de dados, fontes/hashes, regras esperadas e imagens ativas passaram. Nenhum save pessoal. Arquivos internos de motor/plugins/plugins.js não alterados; catálogo canônico e scripts referenciados verificados. Empacotadores atualizados para não reintroduzir3/4, mas não executados sobre a arte existente. Editor/NW.js e Galaxy A56 desta rodada não testados; não atribuir os testes anteriores a esses pilotos. Nenhum combate completo, progressão ou outra feature implementada.

## Fechamento M01-13 — 26/10/2026

Responsável aprovou o menu de loot no estado disponível2b0f0dc, sem informar versão própria/dispositivo ou casos adicionais. Destaque visual de raros é melhoria futura, não implementada. Aprovação limitada ao menu; critérios funcionais revisados separadamente:11 cenários MV,24 matrizes, reservas/save/load/quest/derrota/abort/rollback e regressões registrados em evidencias/m01-13. Validador estático reexecutado neste fechamento; não alegar reexecução de todas as suítes. M01-13 concluído tecnicamente, com economia provisória e testes editor/A56 ainda separados. Integração/publicação em develop autorizadas; sem main/release.

Revisão de implementação f16c254, arte13161bc; fontes/hash/ambientes em evidencias/m01-14/fontes-testadas.json. Não confundir testes de geometria no navegador com autoria no editor.

NAV01 em DIRETIVA_DE_NAVEGACAO.md é requisito permanente de validação de menus. Aplicação R02: testes de listas/filtros/estados, textos extensos/rolagem, contexto/retorno, teclado/mouse/toque e reflow; evidência de estado inalterado e regressão de MQ01 separadas da avaliação estética. Outros menus continuam nas adequações M01-19 já registradas.
