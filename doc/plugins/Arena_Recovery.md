## Arena_Recovery0.5.0 — refúgios configurados

Piloto preservado e39 pontos dungeonRefuge=true, com coordenadas/eventos únicos. nearestRefuge escolhe o mais próximo no mapa atual; a UI usa o mesmo alvo, com desempate estável pelo evento. APIs de recuperação, soltura obrigatória, feedback e políticas de poção preservadas. startRestPilot mantém o acesso01; syncRestEvents acrescenta apenas pontos configurados ausentes em saves, sem reset/cura. [40 locais, fonte, exclusão e evidências](../EXPANSAO_DESCANSO_M01.md). Geradores build-quests/build-encounters seguem a lista explícita; não há autorização por varredura procedural no jogo.

## Arena_Recovery0.4.0 — uma plataforma piloto, histórico de29/10/2026

Dependências existentes preservadas; o novo acesso/indicador requer Arena_Dungeon e configurações Map008 carregadas. Sem plugin externo ou alteração de plugins.js. ArenaRecovery.json acrescenta um restPoint não técnico com dungeonPilot=true, ID MQ01.refuge.01, map8/event241/(124,79), sourceCell40/25 na planta interpretada/refletida, sem afirmar coordenada F2 do executável. Campos x/y são obrigatórios para o piloto, cuja contagem máxima atual é1. O segundo registro total continua sendo a cama técnica preexistente, sem alterações.

`restAt(id,interpreter)` conserva sua validação/autorização e delega à API de recursos. `usePoint(id,interpreter)` é a interação do novo evento: mesma validação, bloqueio até soltura de teclado/ponteiro, destino limpo e nenhuma fila, teste de máximos antes de restaurar; retorna reason=full sem chamar rest em recursos cheios. Não cobra itens. `startRestPilot()` cria uma sessão nova via ArenaDungeon.startLab, flag técnica separada da campanha, transferência ao ponto e recursos35/10/20 apenas nessa sessão; exige nova pressão após a entrada. Não altera máximos, quest ou inventário de saves existentes.

UI transitória em Scene_Map: legenda sobre a plataforma, acessível por Enter a até1tile ou clique/toque; de até3tiles a legenda permite caminhar ao ponto. Consome somente o gesto da legenda, não o transforma em deslocamento indevido; navegação/retorno não esperam o popup. RestFeedback reutiliza Window_Base, mostra três barras com valores reais imediatos, interpolação visual240ms e duração1,5s. Nada dessa apresentação é salvo e animação não escreve em recursos. O comando que fecha uma mensagem não é reaproveitado pela interação adicional.

Map008 recebe somente um evento não bloqueante, sem sprite novo. onMapLoaded acrescenta esse evento quando ausente no save, sem reconfigurar mapa, posição, tesouros ou encontros. build-quests.cjs é a origem do evento; build-encounters.cjs permite/recompõe essa nota específica ao reconstruir sua parte. Sem edição do motor, assets ou topologia. A lógica de respawn não é chamada por descanso; namespaces e contrato de HP/MP/Vigor persistentes permanecem iguais.

Local, fontes, caminho de avaliação, testes e limitações em POCOES_E_DESCANSO_M01_17.md. Teste focal: tools/test-rest-platform-pilot.cjs;10 grupos e recompilação do gerador passaram. Funcionamento do ponto confirmado pelo responsável no editor (Enter/toque técnico e fluxo normal), conforme VALIDACAO_M01.md; sem validação física de smartphone. Melhorias futuras distintas em REF12, sem alterar esta versão. Os contratos históricos abaixo continuam válidos exceto onde este adendo identifica o novo comportamento.

## R03 — Arena_Recovery0.3.0

Configuração opcional menuIntervalMs em ArenaRecovery.json, padrão500ms, inteiro>=0; ausência usa500. Zero retira a espera, mas mantém nova pressão após soltura. Prazo único das poções do menu, iniciado somente após consumo bem-sucedido; tentativas bloqueadas/invalidas não consomem, não estendem o prazo e não enfileiram uso. Token de entrada antes do processOk nativo (que avança Input), flag de despacho de teclado separada do gesto de ponteiro e autorização no início do toque/clique. Repetições são ignoradas antes de som/desativação da grade. Slots atenuados com reticências/linha breve, sem mensagens adicionais. Sem bloquear navegação/retorno/barras.

Hooks novos: Scene_ArenaInventory.create/update e métodos drawItem/processOk apenas da instância de grade; onContentOk valida gesto/prazo e chama commit existente uma vez. Estado em Game_Temp, não salvo, compartilhado ao reabrir; nova partida/load recriam a proteção. Não altera plugins.js, Arena_Inventory, APIs de recuperação, restAt ou guard de batalha. Não é cooldown de combate. Dependências/ordem permanecem iguais; fontes/dados de recuperação e descanso não mudam. Relatório, configuração, casos e limites em PROTECAO_POCOES_M01_17_R03.md.

## R02 — Arena_Recovery0.2.0

Após uso bem-sucedido, retorna à descrição contextual da seleção atual, sem mensagens de quantidade restante, restauração ou “operação concluída”. Quantidade já é redesenhada pelo commit nativo existente; barras pertencem ao quadro Stats de Arena_Inventory0.3.0. Falha mantém a explicação do commit. Não cria popup, consumidor ou hook de combate novo. restAt, autorização, APIs, dados e guard de batalha permanecem exatamente iguais à R01. Ver REVISAO_FEEDBACK_POCOES_M01_17_R02.md. Versão do cabeçalho de código atualizada; registros/parâmetros do gerenciador preservados.

# Arena_Recovery0.1.0

Plugin próprio Codex, sem dependência externa. Ordem: após Arena_Resources, Arena_Inventory, Arena_BattleUI e seus pré-requisitos; ao final dos30 registros atuais. Sem parâmetros do gerenciador. Configuração data/ArenaRecovery.json, schemaVersion1: actorId1; potionIds[2,3,4]; restPoints com id estável, mapId, eventId, technical e source documental obrigatória. Só itens consumíveis, alvo aliado único/repetição1, não livros/importantes; referências e configuração inválidas causam erro explícito de carregamento. IDs/conteúdo não ficam embutidos na lógica de interação.

API: ArenaRecovery.isPotion(item); ArenaRecovery.restAt(id,interpreter) → {ok,reason?}. Em evento autorizado chamar `ArenaRecovery.restAt('lab.resources.bed',this)` e apresentar resultado. Somente Map005/evento6 autorizado atualmente; sem camas confirmadas no Map008. Não expor a API baixa de recursos como botão de descanso livre de campanha.

Aliases: DataManager.isDatabaseLoaded (validação); Scene_ArenaInventory.onContentOk (desvia somente poções configuradas para commit existente); BattleManager.startAction (recusa estoque/efeito/contexto inválido ou mesma instância já executada). Não substitui consumo, apply, paySkillCost, inventário, save ou update/regenerate. WeakSet de ações é transitório, não um registro de recompensa. UI direta mantém ref estável e usa a transação/item nativo existente; confirmações de equipamentos/livros intactas. Dependências reais do runtime listadas acima; Battlespire não foi necessário nesta tarefa.

Sem novos dados persistentes/migração. HP/MP/inventário nativos e Vigor/choices via ArenaResources/ArenaPersistence. Não adiciona poções de campanha. Custos/quantidades e modificadores preservados. Configurar mais pontos exige fonte/autorização; technical é metadado de cobertura, não promessa de cama na campanha.

Integração, decisões de fontes, roteiro e evidências: POCOES_E_DESCANSO_M01_17.md; tools/test-recovery.cjs, test-recovery-small.cjs, validate-recovery.cjs. Compatibilidade de arquivo e Chrome não comprovam nova autoria no editor ou teste físico. Sem modificação dos arquivos internos do motor.
