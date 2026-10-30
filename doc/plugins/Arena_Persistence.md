# Arena_Persistence 0.1.0

Estado operacional M01-08: esta camada continua somente armazenamento/contratos, mas Arena_Resources0.1.0 agora consome recursos/progressão e estende setResource para separar modificador de máximo de Vigor. HP/MP continuam nativos; recursos e escolhas concretas em namespace próprio. Ler RECURSOS_E_PROGRESSAO_M01_08.md e plugins/Arena_Resources.md. O texto abaixo descreve a responsabilidade/histórico de M01-05, não ausência atual de implementação de recursos ou bônus.

Arquivo js/plugins/Arena_Persistence.js. Camada de contratos/IDs de Arena, consumidor de MV_StateStore 0.1.0 (obrigatório e anterior na ordem). Sem plugins externos, parâmetros, comandos de evento, notas adicionais ou assets. Falha com mensagem explícita se o núcleo estiver ausente ou vier depois. Ordem atual: Arena_Runtime, Arena_TechnicalPreview, MV_StateStore, Arena_Persistence. Community_Basic permanece desativado.

Ativar os dois arquivos no gerenciador mantendo o formato canônico de js/plugins.js. Registra namespace arena versão 1. Banco necessário: ator 1, item importante 1 e as referências item/skill atribuídas a atalhos. Não carrega ArenaCatalog.json nem aplica bônus raciais. Para outro projeto, reutilizar somente MV_StateStore e escrever consumidor com seus próprios IDs, defaults e regras; esta camada é específica de Arena.

API global ArenaPersistence; detalhes, formatos e roteiro em PERSISTENCIA_M01.md. Métodos: snapshot, identity, setIdentity, setResource, recordChoice, setQuest, claimSource, consumeImportant, setEnemy, setArea, setShortcut. Sem hooks adicionais do motor. Somente claimSource/consumeImportant alteram um item do inventário nativo por chamada explícita. Não modificam ouro, experiência, atributos ou equipamentos. Em exceção, tentam restaurar o contador anterior do item; o conjunto atual do projeto foi testado com erro simulado após gainItem. Não se garante rollback de efeitos externos introduzidos por futuros plugins em gainItem.

Não concede nada ao criar/carregar partida. Nova identidade fica incompleta até M01-07. Recursos próprios começam vazios até M01-08; recordChoice grava decisão, sem aplicar incremento. Quest MQ01 inicia em etapa 0 sem objetivos ativos. A fonte da chave está configurada mas sem mapa/evento consumidor; persistência não equivale a implementação de MQ01.

Fonte MQ01.ruby-key usa item 1, quantidade 1, elegível somente em MQ01 etapas 10/20 enquanto não concluída/consumida/entregue. claimSource consulta posse nativa e concede só o faltante; repetir com item presente não concede. Ausência posterior permite reativação explícita enquanto necessária, sem repetir outras recompensas. consumeImportant exige posse, registra consumo/entrega e aposenta a fonte uma vez. Recibos preservados impedem reposição mesmo se faltar o registro opcional da fonte. Nenhuma dessas verificações roda automaticamente no load. Ainda falta saneamento de duplicatas legadas, verificação de transições e eventos de M01-16; não adotar métodos de armazenamento como autorização para pular critérios narrativos.

Snapshot retorna cópia; identity adiciona o nome consultado do ator. Aparência equipada é derivada, não salva aqui. Nome/HP/MP/nível/EXP/equipamentos/magias aprendidas/inventário continuam nativos. Campos Game_System e desativação seguem MV_StateStore.md. Saves anteriores à estrutura recebem defaults sem adivinhar raça/gênero/etapa; não há migração dos switches reservados, que não eram usados pelo laboratório.

Testes: tools/test-persistence.cjs usa Chrome isolado e saves técnicos, sem perfis pessoais, cobrindo dados próprios/nativos, recibos, legado/ausência parcial, capacidade, rollback de concessão e nova partida. tools/test-boot.cjs cobre regressão do laboratório. Validado com MV 1.6.1 em Chrome 156; editor após inclusão dos plugins, NW.js e Galaxy A56 não testados. Não declara ausência de conflitos fora do conjunto atual. Histórico: 0.1.0 contratos M01-05; sem interfaces, combate, progressão efetiva ou respawn.


## Integração M01-13

M01-13: sourceStatus(sourceId) retorna {active,questId,itemId,missing} copiando o estado e reutilizando source(), sem conceder, avançar quest ou alterar schema. Consumidor Arena_Loot chama claimSource apenas para fonte ativa/quantidade faltante. Recibos de consumo/entrega continuam autoritativos. Chave permanece fonte de cela, tabela de inimigo sem vínculo normal.
