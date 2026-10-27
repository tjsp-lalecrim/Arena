# Aprovação da dungeon — 27/10/2026

Responsável aprovou a **estrutura e o resultado visual atuais** da dungeon, associados ao estado disponível **b194b44**, feature/m01-dungeon-inicial. Não informou hash próprio, dispositivo nem execução de ciclo de autoria no editor. Evidência visual consultada em `doc/prints/m01-14-aprovacao-ressalvas-2026-10-27-1fedef3f-c80f-4be7-9ffe-9b483790d2c4.png`; arquivo/hash, fontes de natação e condições registrados em `evidencias/m01-14/aprovacao-natacao/fontes-e-condicoes.json`. Não atribuir essa aprovação a funcionalidades posteriores.

Ressalvas **não bloqueantes**, não implementadas:

- Portas laterais: formato/orientação aprovados; folha muito fina/pouco visível. Avaliar espessura aparente, contraste e legibilidade futuramente, preservando pivôs, encaixe, animação, projeção ortogonal e collider. Não regenerar os assets aprovados nesta rodada.
- Natação: investigar antes de decidir custo. Pesquisa em INVESTIGACAO_NATACAO_ARENA.md; S01 é proposta não aplicada. Vigor permanece reservado às técnicas de combate, sem consumo/regeneração aquática.

## Revisão dos critérios restantes

| Critério | Evidência/estado |
|---|---|
| Planta/direção e encaixes visuais | Aprovação atual aceita a R03 com as ressalvas acima; relatos R03 de estética pendente ficam históricos |
| Caminhos, portas, colisões, pontos essenciais | Evidências R03:28 travessias,14 portas, cinco cenários integrados e seis de regressão;9045tiles conectados e1092 bordas água/sólido bloqueadas |
| Persistência e geradores | R03: salvar na água/porta aberta, migração R02, oito outputs idênticos ao recompilar; sem novos testes de custo aquático |
| Integridade atual | validate-dungeon.cjs reexecutado com sucesso nesta rodada; regras/engine/mapas1–7/plugins.js/estrutura preservados. As baterias R03 anteriores não foram apresentadas como repetidas agora |
| Autoria MV1.6.1 | **Ainda sem evidência de abrir Map008, editar, salvar e reabrir**. Nova tentativa encontrou janela Arena, mas captura retornou timeout e botão acessível retornou elemento indisponível no cache. Atalho de abertura não produziu confirmação de diálogo/projeto. Nenhuma escrita de projeto pelo editor foi comprovada |
| Galaxy A56 físico | Não executado; manter separado, sem atribuir ao print |

**M01-14: visual aprovado, fechamento ainda pendente da verificação de autoria.** O pedido condiciona integração a critérios atendidos; sem confirmação desse ciclo não foi feito merge em develop, nem criado M01-15 a partir dela. Foi solicitada evidência manual específica ao responsável; ausência de resposta não é aprovação nem teste executado.

## Continuidade já identificada, ainda não iniciada

A numeração atual confirma **M01-15 — inimigos visíveis, patrulha e ciclo de encontros**, dependências05/10/13/14. LOOT.md, QUESTS.md e COMBATE.md exigem reativação comum somente na saída após conclusão aplicável, com exceção de inimigos específicos de quest. Simples reentrada não é respawn. O estado persistente já oferece enemies/areas com geração e revisão de saída; o novo consumidor deverá integrar essas regras ao combate/loot nativos, sem duplicar recompensas e sem simular conclusão de MQ01 no fluxo normal.

Para liberar a sequência solicitada, verificar no editor a versão b194b44 (ou esta continuação documental, sem mudança de mapa): abrir Game.rpgproject e Map008, realizar edição reversível, salvar e reabrir; confirmar leitura de plugins e que as propriedades/eventos continuam presentes. Preservar qualquer edição válida. Se o teste já foi realizado, registrar sua versão e escopo como evidência do responsável, sem repetir desnecessariamente. Depois, revisar/integrar a feature em develop e iniciar a feature de encontros; não há autorização para ignorar silenciosamente esse critério ou misturar implementação de M01-15 na branch do mapa.
