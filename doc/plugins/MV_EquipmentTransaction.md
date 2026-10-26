# MV_EquipmentTransaction0.1.0

Plugin Codex sem parâmetros, comandos, IDs, engine ou plugins externos. Núcleo reutilizável também em contexto JS sem MV. API `MVEquipmentTransaction.run(adapter)`.

Adaptador fornece validate()→razão/null, capture()→snapshot, write(), verify()→boolean e restore(snapshot). Falha de validação não escreve; exceção/verificação falsa restaura e devolve `{ok:false,reason,error?}`; sucesso `{ok:true}`. Adaptador é responsável por snapshot completo, invariantes e restauração sem falhas. Não consome itens/recursos ou aplica regras de slots por conta própria.

Arena_Inventory adapta o núcleo ao estado nativo do MV e contratos existentes. Teste puro de sucesso, validação, verificação falsa e exceção com rollback em tools/validate-inventory.cjs; testes de trocas/contagens reais em tools/test-inventory.cjs. Sem novo estado persistente.
