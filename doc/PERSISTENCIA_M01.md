# Contratos persistentes — M01-05

Schema raiz 1, namespace arena versão 1. Autoridade: `$gameSystem._persistentState.namespaces.arena`; consumo pelo núcleo MV_StateStore e adaptador Arena_Persistence. Sem salvamento paralelo ou mudanças nos arquivos internos do motor. Apenas dados JSON são armazenados. API de integração para futuras features e testes; nenhuma nova interface ou cadeia de eventos foi ativada nesta rodada.

## Separação de responsabilidades

| Informação | Autoridade salva | Contrato próprio |
| --- | --- | --- |
| Nome | Game_Actor.name/setName | identity() consulta o ator, não guarda segunda cópia |
| Raça/gênero | character.raceId/genderId | IDs estáveis do catálogo, null até criação |
| Aparência-base | character.baseVisualId | Referência lógica, null até criação; não é caminho de arquivo |
| Aparência equipada | Derivada de identidade + equipamentos nativos | Não armazenar cache/cópia; reconstrução será M01-12 |
| HP/MP/TP, máximos nativos, nível/EXP, habilidades aprendidas | Game_Actor nativo | Não replicar |
| Recursos novos | resources[resourceId] | current/maximum; inicia vazio, sem regeneração/combate implementado |
| Decisões de progressão | progression.choices[choiceId] e recibo de operação | resourceId/amount; grava decisão sem aplicar atributos |
| Inventário/ouro/equipamentos | Game_Party/Game_Actor nativos | Fontes e recibos guardam somente proveniência/operações |
| Quests | quests[questId] | stage, objectives por ID/boolean, completed, receipts |
| Fontes importantes | sources[sourceId] | grants (número de concessões/recuperações), retired |
| Inimigos | enemies[instanceId] | areaId, questSpecific, defeated, generation |
| Áreas | areas[areaId] | completed, exitRevision, generation |
| Atalhos | hotbar[slotId] | null ou {kind:item/skill,id:ID do banco}; sem quantidade/índice da lista/cache de disponibilidade |

IDs numéricos do banco seguem DADOS_M01.md e não devem ser renumerados. IDs de instância de inimigos/fontes/áreas devem ser lógicos, estáveis e únicos; não usar somente ID da espécie nem posição na lista do mapa. generation identifica uma ocorrência futura de respawn; exitRevision identifica saída processada. O armazenamento não altera esses números sozinho e não reativa inimigos no load. Estado transitório de batalha, seleção do mouse, animação e encontro em curso não pertence a este contrato.

Switches 1–4 e variáveis 1–3 anteriormente reservados não são autoridade nem espelho de quest/identidade. Nenhum evento do laboratório os usava. Futuras páginas de evento devem consultar o contrato ou usar projeções documentadas, sem dois donos independentes do progresso.

## API do adaptador

- `snapshot()` devolve cópia de todos os dados próprios; `identity()` devolve identidade com name obtido do ator 1.
- `setIdentity(raceId, genderId, baseVisualId)`: IDs lógicos ou null; não renomeia ator, aplica bônus ou muda sprites. M01-07 validará catálogo/combinações e chamará o setter junto do setName nativo.
- `setResource(id,current,maximum)`: inteiros >=0, current <= maximum; hp/mp/tp recusados para evitar duplicação. Teste usa vigor 37/100, sem fixar balanceamento da M01-08. Setter explícito não é regra de recuperação.
- `recordChoice(choiceId,resourceId,amount)`: amount inteiro positivo; applied/duplicate por recibo `progression/<choiceId>`. Não aumenta nível nem recursos. M01-08 deverá fazer incremento e recibo na mesma transação apropriada, não aplicar efeito antes de consultar recibo nem reexecutá-lo no load.
- `setQuest(id,stage,objectives,completed)`: stage inteiro >=0, objetivos {id:boolean}; preserva recibos, rejeita redução de etapa e reabertura de conclusão. É armazenamento, não verifica chave/diálogo nem autoriza uma transição narrativa por si só. MQ01 começa em 0; etapas 10,20,30,40 seguem MQ01_ESPECIFICACAO.md. Testes configuram somente 10/20.
- `claimSource('MQ01.ruby-key')`: inactive/present/granted/capacity. Concede quantidade faltante até 1 do item 1, só durante obrigação ativa; reativação é chamada explícita, nunca concedida ao carregar. Não há ouro/EXP/loot acessório nesta operação. Falta de capacidade não consome oportunidade; exceção restaura item e não confirma fonte.
- `consumeImportant(sourceId,receiptId,kind)`: kind consume/deliver; retorna consumed/duplicate/inactive/missing/capacity. Exige item presente e obrigação ativa, registra {sourceId,itemId,quantity,kind} em quests.MQ01.receipts[receiptId], remove quantidade legítima e aposenta fonte. Exemplo de recibo futuro: MQ01.cell-door. IDs de recibo são únicos dentro da quest. Repetir não remove outro item. Fonte aposentada, conclusão ou recibo equivalente impedem reposição. Não grava consumo se faltar item.
- `setEnemy(instanceId,areaId,questSpecific,defeated,generation)` e `setArea(areaId,completed,exitRevision,generation)`: setters sem batalha/respawn. Inteiros não negativos e flags booleanas; regras de progressão/reativação das instâncias ficam em M01-15.
- `setShortcut(slotId,{kind:'skill',id:9})`, `{kind:'item',id:2}` ou null. Rejeita tabela/ID ausente no momento da atribuição; não executa nem testa habilidade conhecida/custo/arma. Futuro executor revalida a referência sempre, inclusive após alterações de banco. Nenhuma quantidade de slots ou tecla foi imposta à UI futura.

A API é código confiável de integração, não aceita entrada de jogador diretamente. Todas as chamadas são síncronas. Recibos evitam repetição na mesma linha do tempo salva; carregar save anterior à operação restaura legitimamente a linha do tempo anterior. Não há proteção contra edição manual de save nem ledger entre partidas.

## Migração e limites

Saves do laboratório sem _persistentState recebem identidade não definida, recursos vazios, escolhas vazias, MQ01 etapa 0 e coleções vazias. Nome e todos os dados nativos são preservados; nenhuma inferência por possuir chave ou ter switch ativado. Campos conhecidos ausentes são preenchidos; recibos existentes são preservados. Não se recria chave consumida por faltar o campo sources quando há recibo de consumo preservado. Dados incompatíveis/corrompidos e versões futuras falham explicitamente; não são apagados ou convertidos por suposição.

Não há migração de sistemas de campanha anteriores, pois o laboratório ainda não os tinha. Dicionários dinâmicos não são reparadores universais de registros truncados. M01-16 implementará verificações redundantes de transição, saneamento de duplicatas e fontes no mapa; M01-13 implementará loot/recompensas completas. Nenhuma recompensa de quest, dano, passagem de turno, progressão Skyrim efetiva ou respawn foi antecipada.

## Verificação e roteiro manual isolado

Automático: `node tools/test-state-store.cjs`; `node tools/test-runtime.cjs`; `node tools/validate-data.cjs`; com localhost ativo e Playwright/Chrome disponíveis, `node tools/test-persistence.cjs` e `node tools/test-boot.cjs`. Resultado da persistência em tmp/persistence-result.json e cópia versionada nas evidências. O teste utiliza contexto descartável de Chrome e slots nativos 1/2/3 só nesse contexto; não lê nem modifica saves pessoais. O slot 3 é gerado pelo motor com a composição anterior de plugins, registrada em tools/fixtures/plugins-before-persistence.json a partir de 5d10e90, sem carregar os plugins novos. Depois é carregado com a composição atual no mesmo perfil descartável. Os slots 1/2 cobrem também containers sem a raiz e com campos parciais. Nenhum arquivo pessoal histórico é usado. Núcleo genérico também testado sem conteúdo Arena, com contador de recompensa que não duplica.

Para conferência manual, usar perfil separado/convidado do Chrome em localhost, nova partida; abrir console F8/DevTools e executar:

```javascript
$gameActors.actor(1).setName('Teste isolado');
ArenaPersistence.setIdentity('breton','female','breton.female.base');
ArenaPersistence.setQuest('MQ01',10,{obtainKey:false},false);
ArenaPersistence.claimSource('MQ01.ruby-key'); // granted
ArenaPersistence.claimSource('MQ01.ruby-key'); // present
DataManager.saveGame(1); // só no perfil descartável
ArenaPersistence.setResource('vigor',1,100);
DataManager.loadGame(1);
ArenaPersistence.identity(); // nome nativo + escolhas preservadas
ArenaPersistence.snapshot();
ArenaPersistence.consumeImportant('MQ01.ruby-key','MQ01.cell-door','consume');
ArenaPersistence.consumeImportant('MQ01.ruby-key','MQ01.cell-door','consume'); // duplicate
ArenaPersistence.claimSource('MQ01.ruby-key'); // inactive
```

Para a conferência de autoria, abrir Game.rpgproject no editor 1.6.1, abrir gerenciador e confirmar ordem/status dos cinco registros (Community_Basic off, quatro próprios on), salvar/reabrir e conferir diff; depois repetir localhost. A abertura manual confirmada pelo responsável foi da correção anterior, não prova esse ciclo após adicionar os novos plugins. Nenhum teste no Galaxy A56 nesta rodada.
