# Arena_Loot0.1.0

Produzido pelo Codex; após MV_LootRules e Arena_Inventory. Dependências reais: MV_StateStore, ArenaPersistence (incluindo sourceStatus), ArenaInventory.drawItemIcon/resolve/important, ArenaBattleUI.theme, ArenaBattle.startLab/prepare para entrada técnica e fluxo MV. Sem dependência externa/Battlespire. Sem parâmetros/comandos de plugin; configuração IDs/valores em data/ArenaLoot.json. Exige tabela válida para cada inimigo incluído; erro explícito em referência/chance/faixa/variante ausente, importante em pool comum ou fonte não cadastrada.

API ArenaLoot.snapshot() cópia do ledger; collectPending() entrega reserva até capacidade e devolve linhas recebidas; recoverSource(id) encaminha claimSource sem recompensas extras; startLab() abre cenário técnico; validate() valida tabelas carregadas. Não usar snapshot como bolsa ou estado de quest. Contratos namespace arenaLoot v1 e transação em LOOT_M01_13.md.

Aliases: BattleManager.setup/processVictory/isBusy, Scene_Battle.createAllWindows/update, Scene_Map.start e título. Substitui makeRewards/displayRewards/gainRewards e bloqueia pagamentos nativos gold/drops durante token próprio. EXP via ator nativo na mesma concessão única. Não chamar gainExp diretamente de outro sistema para a mesma vitória. Não há concessão em seleção, derrota/abort ou makeRewards externo. Somente participantes mortos/aparecidos têm origens sorteadas. Batalhas novas alocam novo token; futuras fontes persistentes/respawn dependem de M01-15.

Resumo é apresentação transitória após mensagens nativas; seleção descreve conteúdo, Enter/Esc/toque fecha tudo. Não é janela de coleta individual. Sem slots vazios; origem mantida no ledger embora pilhas sejam agregadas. Reservas têm indicação explícita e se entregam no mapa, sem sorteio/EXP novos. Não salvar janelas/planos transitórios ou assumir salvamento em batalha.

A configuração atual tem3 inimigos e4 variantes raras de tipos existentes, valores provisórios. Fonte de chave não é drop normal; integração técnica de quest testada sem alterar campanha. Fonte/recuperação usa API já existente, não reinventa etapas. Ver LOOT_M01_13.md para roteiro e pendências editor/A56/balanceamento.
