# M01-08 — recursos e evolução, R01, 26/10/2026

Base: develop e1be141, árvore limpa; feature/m01-recursos-progressao. Fechamento M01-07 R05 e P01–P08 permanecem vigentes, sem alterações de balanceamento racial ou imagens. Não inicia M01-09.

## Fonte e adaptação configurada

Consultado o [manual oficial Skyrim Legendary Edition](https://assets.ctfassets.net/rporu91m20dc/hH1HljyrjqewisSugMOm2/ab667e857bd67d39a814dc064d96ef8f/manual_skyrim-le_ps3_en-int.pdf), seção Skills / Increasing your skills and leveling up, p.6 impressa (PDF p.7). Ele confirma a escolha entre Health, Magicka e Stamina ao evoluir. Não atribuímos ao manual uma fórmula numérica que ele não explicita. Consulta complementar ao endereço UESP Skyrim:Leveling retornou403; não usada como fonte lida. Wiki local de Arena continua complementar ao catálogo racial já aprovado; esta é uma adaptação de progressão, não uma regra do Arena original.

Configuração **M01-08/R01**, `data/ArenaProgression.json`:

| Regra | Configuração inicial e justificativa |
| --- | --- |
| Vida / Mana / Vigor no nível1 | 100 / 50 / 100; conserva a base de Arena já testada, sem importar automaticamente a escala integral de Skyrim |
| Argoniano | Vigor110, pela concessão inicial+10 R05; os outros bônus permanecem exatamente P01–P08 |
| Evolução | Uma escolha de+10 em um máximo por nível ganho; unidade simples para balancear e comparar com poções50/25/50. Valor adaptado provisório, não homologação de equilíbrio |
| Escolhas acumuladas | Níveis2–99: até98 escolhas, uma para cada número de nível. Vários níveis geram uma fila; escolhas podem ficar pendentes e são confirmadas individualmente |
| Recursos gastos | Escolher aumenta somente o máximo; o atual fica igual. Sem cura grátis ao evoluir, inclusive Vigor; isso difere da recuperação associada à evolução em Skyrim |
| EXP | Mecanismo nativo MV de EXP/nível e registro técnico Aventureiro mantidos. Não importamos crescimento por uso de perícias, perks, profissões, peso ou regeneração de Skyrim |
| Curvas MV | HP/MP do ator1 usam a base configurada e as escolhas, sem crescimento automático da classe. ATQ/DEF/MAT/MDF/AGI/sorte continuam nativos, com AGI Khajiit+1 já aprovada |
| Limites | HP mínimo/máximo nativos; MP passa a ter teto9999, como HP, para não truncar as98 escolhas de+10 no antigo teto999. Vigor mínimo0, máximo derivado inteiro; recursos atuais são limitados ao máximo |
| Redução de nível técnica | Não desfaz escolhas confirmadas. Retornar ao mesmo nível não dá outra escolha. Não é mecânica jogável de perda de níveis; evita duplicação em comandos/debug |

Configuração controla os valores iniciais de novas partidas e o incremento de escolhas futuras. Cada escolha guarda seu valor, por isso mudar `increase` não reescreve escolhas antigas. Saves já inicializados preservam sua base; editar configuração não recalcula silenciosamente o passado. Mudanças futuras continuam exigindo revisão de balanceamento.

## Contratos e consistência

HP/MP **atuais** ficam exclusivamente em `_hp`/`_mp` nativos. Nível/EXP, atributos adicionados, estados, equipamentos e multiplicadores continuam nativos; não duplicados no save próprio. Máximos efetivos passam pelo cálculo nativo de parâmetros (modificadores, buffs, arredondamento e limites), usando base+progressão. Snapshot distingue base, crescimento e diferença efetiva dos modificadores nativos.

Namespace `arenaResources` **v1**, registrado em MV_StateStore: `initialized`, `baselineLevel`, `base.{hp,mp,vigor}`, `initialVigorBonus`, `choices.{numeroDoNivel}.{resourceId,amount}`, `vigorModifiers.external`. Ele guarda configuração inicial consolidada, escolhas e modificador explícito de Vigor, nunca cópia de HP/MP atuais. Crescimento é soma das escolhas, não campo acumulado novamente no load. O número do nível é a chave idempotente; escolher nível futuro/duplicado ou recurso desconhecido falha sem alterar estado. Reentrada/load não aplica escolhas.

`arena.resources.vigor.{current,maximum}` mantém o contrato v1 existente: current é o valor autoritativo; maximum é cache do máximo derivado, sincronizado ao escolher, recuperar ou gastar. Base+concessão inicial+escolhas+modificadores determinam máximo. A API técnica preexistente `ArenaPersistence.setResource('vigor',atual,máximo)` continua disponível: mudança explícita de máximo é registrada em `vigorModifiers.external`, sem apagar escolhas ou multiplicar o+10. Não usar esse setter para implementar poções/custos; usar a API específica.

Carregamento de saves R05: preservar HP/MP atuais e modificadores nativos, Vigor gasto e máximo salvo, inclusive máximos técnicos150. Sem namespace novo, consolidar HP/MP base da classe na versão carregada e o nível atual como baseline; **não** conceder retroativamente escolhas para níveis de laboratório anteriores, cuja evolução não existia. Separar do máximo salvo o+10 Argoniano já recebido, sem somá-lo novamente. Namespace existente com campos ausentes recebe defaults do MV_StateStore; escolhas válidas preservadas. Save sem estado anterior recebe defaults neutros100/50/100 e identidade continua desconhecida; não inferir raça/gênero. Campo Vigor ausente recebe valor cheio do máximo inicial aplicável, pois não há gasto salvo recuperável. Uma base legada excepcional pode ser negativa ao separar a concessão de um máximo técnico inferior a10; o total final continua limitado a0 e não ganha recurso.

Inicialização é tardia após confirmar criação, ao usar o recurso no laboratório, antes do primeiro levelUp ou na importação de um ator existente. Nova partida sem tocar recursos mantém o contrato mínimo vazio de M01-05. Plugins antigos continuam com seus namespaces v1; não houve migração destrutiva ou importação de saves pessoais.

## Consumo e recuperação

Vigor próprio **não usa TP**. Ganho de TP por ação/dano, initTp, regeneração, fim/início de batalha, caminhada e menus não alteram Vigor. Não há tick passivo. HP/MP mantêm o padrão MV não conflitante; a configuração atual não possui regeneração passiva desses parâmetros.

Skill com nota `<ArenaVigorCost: N>` inteira positiva: ator1 só pode pagar em batalha, com Vigor suficiente e custos MP/TP nativos satisfeitos. `paySkillCost` desconta uma vez no percurso normal `useItem`; tentativa direta fora de batalha/sem saldo não paga. Ataque básico, magia e técnicas sem nota não recebem custo automático. Notas não disponibilizam técnicas: skills3–8 continuam indisponíveis até M01-09. O laboratório executa **apenas o pagamento controlado da skill5 de custo5**, sem BattleManager, alvo, dano ou animação; não é combate jogável nem valida força/arma vinculada. M01-09 deverá validar arma/requisitos no instante de execução e M01-10 o percurso completo de ações; não usar forceAction como modo de contornar requisitos.

Item4 foi ativado, preservando ID/preço/quantidade50: `<ArenaVigorRestore: 50>`. Ação nativa de item recupera até o máximo e marca sucesso; menu fora de batalha não permite uso sem benefício. Recuperação não aplica multiplicadores raciais nem modifica TP. Poções2/3 continuam nativas,50 Vida/25 Mana. As três têm disponibilidade de banco, sem loot/distribuição de campanha implementados.

`ArenaResources.rest()` e comando de evento `ArenaResources Rest`: fora de batalha, restaura os três atuais aos máximos. Não concede itens, experiência ou aumentos. Repetir descanso cheio é neutro. Não chama recoverAll para limpar estados/TP ou importar outros efeitos de dormir. A API técnica pode restaurar HP0; isso não implementa cama após game over ou altera derrota futura. O mapa final e as camas narrativamente elegíveis continuam M01-14/17. O comando nativo Recuperar Tudo isolado continua afetando HP/MP, não o recurso próprio: camas devem usar a API.

## Interface e roteiro manual

Título > **Laboratório de recursos** abre **Map005**, separado de Map001–004; início(8,6), eventos na linha y5. Olhe para o evento e Enter:

| Posição | Evento e operação explícita |
| --- | --- |
| (3,5) | Evolução: abre recursos/escolhas |
| (5,5) | Mais1 nível: concessão técnica de nível, sem escolha automática |
| (7,5) | Mais3 níveis: testa escolhas acumuladas |
| (9,5) | Gasto técnico: Vida-30 (mínimo1), Mana-15 (mínimo0), pagamento controlado de técnica5: Vigor-5 se houver saldo |
| (11,5) | Kit: adiciona uma unidade de cada poção. Cada nova interação concede outro kit explicitamente; não é fonte de quest ou recompensa idempotente |
| (13,5) | Cama técnica: recuperação integral, sem estabelecer cama na dungeon |

1. Crie normalmente qualquer personagem; menu **Recursos / evolução** mostra os três atuais/máximos. Argoniano inicia110 Vigor. Sem nível ganho, escolhas desativadas.
2. No laboratório, conceda1 ou3 níveis. Abra Recursos, escolha Vida/Mana/Vigor, confirme ou volte. Cancelar não consome escolha. Após confirmar,+10 somente no máximo escolhido; atual permanece igual. Saia e retorne: sem duplicação.
3. Gaste recursos no evento técnico, salve em slot **exclusivo de teste**, carregue e confira. Não use saves pessoais. Pelo menu Itens, use as poções; confira50/25/50 e limites. Cama restaura os três.
4. Compare Argoniano e outra raça em novas partidas:100/110 inicial, o mesmo+10 por escolha de Vigor, sem multiplicar crescimento. Caminhe, abra menus, aguarde: Vigor não regenera.
5. Editor MV1.6.1: abrir Game.rpgproject, F10, conferir os dois novos plugins ao final/ON, salvar/reabrir e executar novamente. Evidência de autoria desta rodada é separada do navegador.

## Evidências e limites

`tools/test-resources-progression.cjs`: Chrome desktop isolado, saves técnicos descartáveis, arquivo anterior real com composição R05,16 combinações, gastos/save-load, escolhas1/múltiplas/duplicadas, limites99 e MP1030, configuração alternativa, HP/MP/Vigor, recuperação/TP, confirmação/cancelamento e Map005. Resultados/capturas em `evidencias/m01-08/`. Regressões e autoria descritas em VALIDACAO_M01.md.

Funcionamento técnico não comprova balanceamento definitivo: cenário M01-08 de BALANCEAMENTO_RACIAL_CENARIOS_M01.md coberto para máximos/gasto/progressão, sem medir duração/utilidade de Vigor nos encontros ainda inexistentes. Custos5/12 continuam provisórios; os cenários de dano/acerto/AGI/frio/magia/paralisia em encontros permanecem M01-09/10/20. Nenhum asset gerado/alterado, campanha final, técnica completa, magia nova, aliado ou M01-09 implementado. Galaxy A56 físico, teclado virtual/fullscreen/desempenho continuam pendentes.
