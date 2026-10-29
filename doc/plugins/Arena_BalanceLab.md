# Arena_BalanceLab0.1.0

Plugin próprio, sem dependências externas. Carregar **após** Arena_Battle, Arena_Resources, Arena_Abilities, Arena_Loot e demais adaptadores atuais; registro34/último. Sem parâmetros de editor, comandos de evento ou dados persistentes. Conteúdo fixo deliberadamente limitado ao E05; [autorização, valores e roteiro](../PILOTO_E05_M01_20.md) são a referência única.

Integra uma opção ao seletor técnico existente, sem substituir seus perfis. API global:

- `open()`: seleção E05; não altera a partida ao apenas abrir a tela.
- `start('light'|'heavy'|'magic'|'hybrid')`: valida ID, recusa início em batalha, cria sessão Bretã feminina3/adaga e fixture agregada. Seis pontos, mesmosATQ3/MAT3. Cada repetição cria novos objetos. Não implementa progressão distribuível geral ou peças por slot.
- `active()`: só verdadeiro para a sessão e objetos próprios atuais.
- `snapshot()`: leitura de ID, nível,earned6/spent, atributos/recursos, semente/estado do gerador e aplicações de ações; não salva logs.
- `leave()`: descarta contexto e volta ao título. Acesso técnico não exige restaurar uma partida carregada: entrada é pelo título e saves pessoais permanecem intactos.

Hooks transitórios: evalDamageFormula para as quatro ações existentes (Atacar, leve5, pesada6, Dardo10) inclusive ataque do goblin; mínimo positivo após makeDamageValue; RNG somente dentro de Action.speed/apply e Enemy.makeActions, com restauração por finally. Cura e custos não são reimplementados. Rewards ignorados só no E05. EndBattle registra resultado; Scene_Map.start entra uma vez na tropa2 ou retorna à seleção após vitória. Derrota mantém Game Over nativo; retornar ao título limpa o contexto.

Proteção independente do backend web/arquivo: DataManager.saveGame/saveGameWithoutRescue/saveGlobalInfo retornamfalse; makeSaveContents lança erro explícito enquanto E05 está ativo; Game_System.isSaveEnabled retornafalse. Nenhuma chamada a StorageManager para persistir o experimento, nenhuma alteração de caminhos ou namespace. Hooks setupNewGame/extractSaveContents/Scene_Title.start limpam o contexto e restauram seleção anterior de slot; wrappers fora do E05 encaminham às implementações anteriores. Não se altera arquivo interno do MV.

Limites: não há novas silhuetas/peças, distribuição interativa, raças adicionais ou migração. A aritmética é conteúdo experimental autorizado, não fórmula de campanha. Testes e escopo de evidência no documento principal; novo ciclo de autoria/execução MV não declarado realizado.

Seleção só arma comandos após soltar OK/cancelamento/ponteiro, impedindo reaproveitar a confirmação da tela anterior. Não muda comandos ou duração de ações de batalha.
