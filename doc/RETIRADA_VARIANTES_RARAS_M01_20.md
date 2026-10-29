# M01-20 — variantes provisórias retiradas do loot futuro

29/10/2026, feature/m01-20-revisao-ouro-raridade, base **e234044** preservada. Alteração de execução limitada à configuração `ArenaLoot.json`: chance de substituição por equipamento raro passa a0 e `rare.variants` fica vazio nas tabelas de goblin2/homem-lagarto3. Rato já não possuía variantes. Os15 tesouros usam a tabela2, portanto deixam de gerar as mesmas variantes; nenhum caminho paralelo de premiação foi acrescentado.

| Registro mantido no banco | ID | Propriedade preservada |
| --- | --- | --- |
| Adaga rara | Weapons3 | ATQ+3, tipo adaga/técnicas5/6 |
| Espada curta rara | Weapons4 | ATQ+4, tipo espada/técnicas7/8 |
| Couraça de couro rara | Armors3 | DEF+4, Corpo/aparência de couro |
| Cota de malha rara | Armors4 | DEF+7, Corpo/aparência de malha |

**Não excluídos, renomeados, convertidos ou reutilizados.** Banco, preços, parâmetros, tipos, tags, aparência e demais propriedades estão idênticos à base. Referências de inventário/equipamento/recibos/pending continuam válidas; reservas antigas entregam os mesmos IDs e quantidades, sem consultar novamente as tabelas atuais. Nenhuma migração, compensação ou namespace novo.

Reiniciar o playtest ou recarregar a página para carregar as novas tabelas; uma sessão já aberta ainda pode ter a configuração anterior em memória. Não limpar saves/dados do navegador.

## O que permanece

- Equipamentos normais e limite de uma peça **por origem de loot**, incluindo concorrência arma/armadura e agregação de inimigos.
- Ouro/chances de batalhas, poções e fontes de missão, sem alteração. Tesouro sem outro resultado positivo mantém fallback inteiro uniforme2–8 do commit e234044.
- `rare.items` conserva chances1%/2%, uma unidade e os livros5/6; flag rara continua possível para livro, não para equipamento provisório. Sem candidato de equipamento raro, não se fabrica substituto nem segundo prêmio.
- Núcleo genérico MV_LootRules e Arena_Loot0.3.0 não foram modificados nesta entrega. Conteúdo encantado/poções superiores permanece futuro, com efeito/fonte/configuração próprios; não é mera renomeação.

## Origem e proteção contra reintrodução

`ArenaLoot.json` é a fonte direta das tabelas, agora sem qualquer referência de recompensa a weapon3/4 ou armor3/4. Não encontrado gerador dedicado dessas variantes nos scripts versionados consultados; geradores de mapas/quests não escrevem esse catálogo. `assert-loot-extensions.cjs` descreve **registros legados do banco**, não cria recompensa, e deve preservá-los. Fixtures de teste podem montar um item antigo para validar compatibilidade; não pertencem à campanha.

Novo `tools/validate-current-loot.cjs` rejeita referências retiradas em qualquer pool/mapeamento das tabelas e verifica o estado de substituição desativada desta fase. Executar após mudanças/gerações de configuração. Futuro candidato legítimo exigirá atualização autorizada das expectativas, mantendo a proibição dos quatro IDs legados nos novos pools. Não introduz restrição de equipar/receber reservas.

Expectativas afetadas de `test-loot.cjs` passaram a verificar equipamento normal; a parte de compatibilidade injeta explicitamente uma peça legada em fixture. Suíte ampla não reexecutada. `test-treasure-fallback.cjs` continua exigindo ouro/configuração iguais à base, permitindo **somente** a retirada agora autorizada nos dois mapas de variantes; nenhuma tolerância genérica a outras mudanças.

## Verificação focal executada

- `node tools/validate-current-loot.cjs`: proteção da fonte e24 sorteios controlados, com resultados vazios/normais/livros e limite de equipamento preservado. Uma referência proibida inserida em cópia da configuração é rejeitada no teste.
- `node tools/test-retired-equipment-loot.cjs`: quatro grupos nativos em Chrome156.0.8078.73 isolado. Save criado com tabela anterior e234044 mantém estoque, adaga3/malha4 equipadas, atributos, recibos e quatro itens em reserva. Cada um dos quatro IDs equipa/remove sem perda/duplicação e conserva as técnicas da arma. Reservas são entregues uma vez, com sorteio proibido, e salvas/carregadas novamente. Novos sorteios/concessão real só geram equipamento normal; livros5/6 continuam ensinando, consumindo uma unidade válida, preservando repetição conhecida e persistência. Fallback2/8 confirmado. [Resultado](evidencias/m01-20-retirada-raras/resultado.json).
- Reexecutado **somente** o teste focal de ouro: seis grupos, inclusive save antigo/tesouro oculto, extremos2/8, ausência após recompensa, recibos/persistência e reserva parcial. [Resultado](evidencias/m01-20-ouro-reserva/resultado.json).

Servidores/perfis efêmeros e saves sintéticos; nenhum servidor existente ou save pessoal utilizado. Sintaxe dos testes conferida. Motor, plugins de execução, Map008, assets, registros de itens, livros, inimigos e configuração do fallback intactos. Sem campanha completa, nova batalha, geração de assets ou teste manual no editor/smartphone. Não ampliar as aprovações anteriores. Sem merge/push/Pages; M01-20/M01 permanecem abertos.

Pendências: avaliação do responsável desta unidade e conteúdo raro concreto em futuros recortes autorizados. Nenhum novo encantamento, poção forte, catálogo ou outro sistema iniciado.
