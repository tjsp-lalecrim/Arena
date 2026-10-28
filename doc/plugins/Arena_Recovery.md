# Arena_Recovery0.1.0

Plugin próprio Codex, sem dependência externa. Ordem: após Arena_Resources, Arena_Inventory, Arena_BattleUI e seus pré-requisitos; ao final dos30 registros atuais. Sem parâmetros do gerenciador. Configuração data/ArenaRecovery.json, schemaVersion1: actorId1; potionIds[2,3,4]; restPoints com id estável, mapId, eventId, technical e source documental obrigatória. Só itens consumíveis, alvo aliado único/repetição1, não livros/importantes; referências e configuração inválidas causam erro explícito de carregamento. IDs/conteúdo não ficam embutidos na lógica de interação.

API: ArenaRecovery.isPotion(item); ArenaRecovery.restAt(id,interpreter) → {ok,reason?}. Em evento autorizado chamar `ArenaRecovery.restAt('lab.resources.bed',this)` e apresentar resultado. Somente Map005/evento6 autorizado atualmente; sem camas confirmadas no Map008. Não expor a API baixa de recursos como botão de descanso livre de campanha.

Aliases: DataManager.isDatabaseLoaded (validação); Scene_ArenaInventory.onContentOk (desvia somente poções configuradas para commit existente); BattleManager.startAction (recusa estoque/efeito/contexto inválido ou mesma instância já executada). Não substitui consumo, apply, paySkillCost, inventário, save ou update/regenerate. WeakSet de ações é transitório, não um registro de recompensa. UI direta mantém ref estável e usa a transação/item nativo existente; confirmações de equipamentos/livros intactas. Dependências reais do runtime listadas acima; Battlespire não foi necessário nesta tarefa.

Sem novos dados persistentes/migração. HP/MP/inventário nativos e Vigor/choices via ArenaResources/ArenaPersistence. Não adiciona poções de campanha. Custos/quantidades e modificadores preservados. Configurar mais pontos exige fonte/autorização; technical é metadado de cobertura, não promessa de cama na campanha.

Integração, decisões de fontes, roteiro e evidências: POCOES_E_DESCANSO_M01_17.md; tools/test-recovery.cjs, test-recovery-small.cjs, validate-recovery.cjs. Compatibilidade de arquivo e Chrome não comprovam nova autoria no editor ou teste físico. Sem modificação dos arquivos internos do motor.
