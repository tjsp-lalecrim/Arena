## Fechamento M01-17 — 28/10/2026

Responsável aprovou a proteção R03 no estado disponível3f3bf6e, somando às aprovações de funcionamento35ba624 e feedback visualbd108c5. Não estender ao descanso/editor/dispositivos. Reexecutados9 grupos de recuperação, incluindo evento nativo da cama técnica, restauração integral dos três recursos, bloqueios, save/load e preservação de progressão/inventário; validadores de proteção/compatibilidade passaram. Evidências em evidencias/m01-17-fechamento. M01-17 concluído tecnicamente e autorizado para integração em develop. Sem cama confirmada no Map008; não inventada. Autoria manual nova no MV, Galaxy A56 físico e balanceamento permanecem verificações de integração, não declaradas realizadas. M01-18 corresponde a introdução/Ria/encerramento, sem renumeração. Estados anteriores são históricos quando divergirem.

# M01-17 R03 — proteção de entrada no menu (28/10/2026)

Basebd108c5, mesma feature/m01-pocoes-descanso. O responsável aprovou a correção visual R02; evidência em evidencias/m01-17-r03/aprovacao-feedback-r02.json, associada ao estado disponível, sem hash próprio/ambiente informados. Não atribuir aprovação dessa nova proteção, descanso, editor ou dispositivo físico. A composição/barras aprovadas permanecem byte a byte em Arena_Inventory0.3.0.

## Contrato

Arena_Recovery0.3.0: `data/ArenaRecovery.json.menuIntervalMs`, valor inicial **500**. Inteiro não negativo; ausência do campo usa500 para configuração anterior schema1. Zero desabilita somente a espera temporal, mantendo a exigência de soltar/fazer nova pressão. Não é ajuste de balanceamento nem cooldown de combate.

Uma recuperação válida pelo inventário executa imediatamente pelo commit/Scene_ItemBase existente, redesenha estoque e barras e inicia o intervalo. O bloqueio é compartilhado entre as três poções; trocar slot, página, modo ou reabrir o menu não reinicia nem contorna o prazo. Durante a espera, novas solicitações são descartadas, sem item consumido, efeito, confirmação, mensagem ou fila. Usos recusados por estoque/recurso/alvo não iniciam nem prolongam o prazo. Mensagens de impedimentos legítimos continuam disponíveis fora do bloqueio.

É necessária uma nova pressão depois de soltar. Repetição automática de OK não chega ao processOk nativo das poções, evitando também som/foco de confirmação repetidos. Mouse/toque mantêm o gesto nativo de uso ao soltar; um gesto iniciado enquanto bloqueado permanece inválido mesmo quando termina depois do prazo. Soltar um comando antes do prazo não o deixa pendente para execução automática; é preciso outro gesto elegível. Teclado e ponteiro não emprestam a autorização de um gesto ao outro.

Indicação exclusivamente nos slots das poções: aparência atenuada, reticências e linha breve de disponibilidade abaixo da quantidade, sem painel extra. Navegação, seleção de outros conteúdos, retorno, descrição e animação das barras continuam ativos. O preenchimento aprovado de240ms permanece independente. Não se alteram recuperação efetiva, máximos, custos, turnos ou efeitos de batalha. Não há temporizador que invoque uso após esperar.

## Implementação e persistência

Aliases somente em Scene_ArenaInventory.create/update/onContentOk e nos métodos de desenho/processOk da instância de sua grade. A entrada é amostrada antes de o MV avançar Input em processOk. Token de teclado é por quadro; ponteiro é armado na pressão e consumido na soltura. O commit é chamado uma única vez, apenas após validar o gesto e o prazo. Deadline é estabelecido somente se o estoque caiu exatamente uma unidade.

Estado transitório em `$gameTemp._arenaPotionMenuGate` (until, duration, awaitRelease, keyArmed, pointerArmed). Game_Temp não faz parte do save nativo; nenhum namespace de progressão/recurso/inventário novo. Reabrir mantém o prazo na sessão; nova partida/carregamento recriam Game_Temp, sem persistir uma espera de interface. Não existe campo de cooldown de habilidade/batalha. Sem Input.clear/TouchInput.clear globais e sem timer/fila de execução. Somente os IDs de poções já configurados recebem o comportamento. Arquivo plugins.js, motor, descanso, mapa, banco e arte preservados.

## Validação

`test-potion-menu-guard.cjs`:8 grupos de cenários no Chrome/MV real: Enter mantido além de500ms, troca de slot enquanto mantido, soltar/fazer nova pressão, dois cliques e dblclick do navegador, toques rápidos entre poções, toque/mouse iniciados durante bloqueio e soltos após expirar, ausência de fila ao aguardar, uso inválido cheio sem reiniciar prazo, navegação/retorno/animação, mesma deadline ao reabrir, configuração controlada100ms e recuperação/quantidade corretas. Estoque/recursos preparados apenas em memória/contexto descartável.

Regressões pertinentes:9 grupos de recuperação (inclui três turnos nativos de poções, descanso técnico/restrições, recursos/bônus e save/load),18 cenários inventário/equipamento/arraste/aparência/itens/save/batalha,5 grupos de feedback visual e2 telas menores emuladas. Nos roteiros de uso normal, aguarda-se o prazo configurado antes do próximo uso; o roteiro específico acima testa deliberadamente tentativas dentro do prazo. O stress R02 usa configuração0 só na fixture e novos gestos sintéticos de Input para testar redirecionamento da animação antes dos240ms, sem desabilitar a regra de soltura. As entradas reais por teclado/mouse/toque são verificadas no roteiro R03. Não inferir um cooldown em batalha a partir da espera dos roteiros de menu.

Validações estáticas: validate-potion-menu-guard, validate-potion-feedback e validate-recovery. Comparam configuração como única adição menuIntervalMs500 e preservação exata da UI/barras aprovadas, regras/guard de batalha, restAt, recursos, dados, saves e motor. Um início de regressão encontrou recusa de conexão do servidor de teste; servidor local ignorado foi reiniciado com fila ampliada e execução serial final passou. Não se alterou o jogo para contornar essa falha de infraestrutura. Evidências anteriores R01/R02 preservadas.

## Conferência manual

Laboratório de recursos → gastar no marcador9 → obter kit no11 → Itens. Usar poção e clicar rapidamente em outra: apenas a primeira é usada, slots ficam brevemente atenuados. Segurar Enter ou mouse/toque não pode gerar vários usos. Se o gesto começar durante o intervalo, soltar após500ms ainda não deve usar: solte e pressione novamente. Navegar/voltar durante o intervalo deve continuar funcionando; sem ação atrasada ao terminar. Repetir com recursos cheios deve manter estoque, explicar impedimento e permitir usar imediatamente outra poção válida sem intervalo indevido.

M01-17 continua tecnicamente concluído na feature para revisão, sem merge em develop/main ou avanço de backlog. A aprovação visual R02 está registrada, mas não é aprovação manual da proteção nova. Pendentes: avaliação desta interação pelo responsável; novo ciclo de autoria/playtest no editor MV1.6.1; Galaxy A56 físico em M01-19; balanceamento M01-20. Descanso não recebeu confirmação manual adicional. Favoritos/atalhos e notificações de quest permanecem futuros.
