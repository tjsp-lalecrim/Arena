# Pendências atuais após consolidação das decisões

Estado operacional M01-12: M01-11 integrado/publicado em develop6e59882 após aprovação do combate disponível em25672fe (ambiente/casos não detalhados). Feature/m01-inventario-equipamentos implementa inventário, troca/arrasto/prévia/remoção e aparência derivada mínima por couro/malha. M01-12 permanece em revisão, sem encerramento artístico; ler INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Favoritos são melhoria futura não implementada. Sem merge da nova feature ou avanço para M01-13; A56 físico/playtest visual NW.js pendentes.

Histórico M01-10 R02 (superado pelo estado operacional acima): feature/m01-combate em validação, sem integração automática; revisão somente piloto Bretã/rato (gestos, intermediários, armas separadas, vídeos).15 personagens/2 inimigos ainda R01; expansão/avaliação perceptiva, manual do responsável, editor/NW.js e Galaxy A56 pendentes. M01-09 integrado/publicado em develop782ebc8. M01-11 apenas orientado pelos prints, não iniciado; sem nova UI de slots ou mecânicas do outro projeto. REVISAO_COMBATE_M01_10_R02.md e backlog prevalecem sobre os históricos abaixo. P01–P08 e retratos aprovados com ressalvas preservados.

Estado operacional M01-08 R01,26/10/2026: M01-07 R05 integrado em develop e1be141, com P01–P08 vigentes e ressalvas estéticas adiadas. M01-08 implementa recursos/evolução configurável por escolha, Vigor próprio, poções e descanso; testes em RECURSOS_E_PROGRESSAO_M01_08.md. Feature para revisão/publicação, sem merge automático. Próximo item M01-09, não iniciado; técnicas completas/combate, eficácia prática e aparelho continuam pendentes. O fechamento histórico R05 abaixo indicava M01-08 ainda não iniciado naquela rodada, estado superado pela autorização atual.

Atualização vigente R05,26/10/2026: M01-07 criação-base desktop concluída com aprovação estética do responsável **com ressalvas**. Recortes/orientações heterogêneos foram aceitos para avançar, sem correção de imagens; arquivos/versões em arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json, revisão futura em arte/PENDENCIAS_VISUAIS_M01_07.md. P01–P08 da auditoria R04 autorizados e aplicados provisoriamente; fonte/valores em decisoes/M01_07_APROVACAO_R05.json. FECHAMENTO_M01_07.md separa testes técnicos de balanceamento prático pendente. M01-08 é o próximo elegível, não iniciado. Relatos antigos de rejeição/revisão/pendência abaixo são históricos e devem ser lidos com esta precedência. main/release não autorizadas por este fechamento.

Atualização em 25/10/2026. Este checklist é a referência operacional de pendências e prevalece sobre listas históricas de REVISAO_DE_PRONTIDAO.md e AVALIACAO_DE_CONSISTENCIA.md. Não altera os requisitos confirmados nos documentos temáticos.

## Situação

É possível iniciar um protótipo técnico do M01. Estão definidos escopo, marcos, idioma, criação de personagem, exploração, encontros, combate, encerramento da demo, fontes de recuperação, respawn, proteção de quests e coleta automática.

Regras não especificadas seguem o padrão compatível do RPG Maker MV 1.6.1. Isso evita reabrir decisões sobre regras nativas, mas não fornece automaticamente comportamentos para sistemas novos nem substitui a direção específica de progressão inspirada em Skyrim.

## Situação atual das definições e tarefas restantes

| Tema | O que ainda não está concreto | Quando fechar |
| --- | --- | --- |
| Evolução dos recursos | Modelo de Skyrim confirmado; documentar fórmulas e incrementos adaptados como especificação técnica | Durante a feature de progressão, sem reabrir a direção |
| Loot | Máximo de um equipamento por loot, com pequena chance de raridade; tabelas por dificuldade confirmadas | Implementar conciliação e balancear probabilidades |
| Livros de magia | Uso único, consumíveis, sem requisitos mínimos, drops de inimigos/baús conforme dificuldade | Cadastrar livros e tabelas; validar consumo após aprendizado |
| Magias ambientais | Avaliar adaptação para múltiplos alvos, preservando identidade e balanceamento | Durante a feature de magia; hipóteses em ADAPTACAO_DE_MAGIAS.md |
| Geração em runtime | Recurso opcional com decisão adiada | Avaliar inclusão nos próximos marcos; fora dos requisitos do M01 |
| Mapa e bússola | Recursos opcionais com decisão adiada | Avaliar inclusão nos próximos marcos; fora dos requisitos do M01 |
| Mobile | Paisagem, tela inteira e preferência por Chrome confirmados; toque será avaliado nos testes | Ajustar resolução lógica, escala e controles no Galaxy A56 |
| Criação e arte | Cadastrar raças/gêneros e seus assets; usar prints existentes de HUD, inventário, loot e quests e solicitar novos exemplos se necessário | Antes da produção em lote e durante protótipos |

Não é necessário decidir todos esses pontos numa única rodada. Implementar e documentar escolhas locais reversíveis; consultar o responsável quando uma proposta alterar o produto ou quando houver alternativas com impacto relevante.

## Especificação e balanceamento durante a implementação

- Técnicas: mínimo leve/pesado por tipo já confirmado. Cadastrar movimentos, custos e efeitos concretos; validar desarmado e armas simultâneas quando usados no marco.
- Recursos: escolher a implementação técnica de Stamina, valores iniciais e limites. Sem regeneração passiva; poções e camas recuperam; cama restaura os três recursos por completo.
- Magias: converter catálogo, níveis de aprendizado e custos, registrando referências e diferenças do original. Não importar bugs ou criar spellmaking por associação.
- Loot: partir dos dados disponíveis da wiki, identificar valores provisórios e ajustar chances/quantidades em testes. Coleta automática já está definida.
- Descanso: identificar camas, custos e condições de acesso nos locais do marco. Não reabrir a restauração completa confirmada.
- Quest inicial: traduzir e especificar eventos, chave, portas e transições a partir das fontes; validar geometria do mapa, que ainda não foi conferida visualmente neste conjunto de tarefas.
- Itens importantes: associar cada obrigação a seu evento-fonte; reativar enquanto necessário, preservando entregas/consumos legítimos e eliminando duplicações nas etapas. O mecanismo geral já está definido.
- Respawn: persistir conclusão e saída de área; separar inimigos comuns dos específicos de quest e da reativação excepcional para recuperar item obrigatório.
- Interface: definir composição, atalhos, tamanho de slots e descrições, usando doc/prints como referência de mecânicas e mantendo dark fantasy. Não tratar imagens estáticas como especificação completa.
- Aparência por armadura: escolher folhas alternativas ou camadas, produzir duas variantes de teste e validar save/load antes de ampliar combinações.
- Persistência: estabelecer IDs e dados salvos por feature; definir compatibilidade antes de distribuir versões que devam carregar saves anteriores.

## Tarefas de prontidão, não novas decisões de design

- Preparar mapa inicial e recursos necessários ao boot; executar o primeiro playtest.
- Adequar Community_Basic à política de plugins desenvolvidos pelo Codex, mantendo o necessário de forma nativa ou por implementação própria validada.
- Implementar as features do M01 e seus critérios de aceitação, sem considerar a documentação como prova de execução.
- Revisar o diff e selecionar os documentos antes do primeiro commit; nenhuma publicação foi feita nesta tarefa.

## Ajustes documentais identificados nesta revisão

COMBATE.md ainda apresentava ordem/quantidade de ações como decisão aberta e citava troca de personagem ativo, apesar da regra padrão do MV e do personagem único. A orientação foi alinhada: adotar regras nativas compatíveis e deixar aliados fora do inicial.

INTERFACE.md ainda pedia referências concretas de MMORPG, mas doc/prints já foi populada. A tarefa atual é selecionar e interpretar os exemplos existentes. A política de arquivos ainda descrevia o gitignore como não aplicado; foi atualizada nesta tarefa.

Relatórios históricos continuam como registros de análise, sem apagar suas conclusões anteriores. A documentação de entrada aponta este checklist para evitar que problemas já resolvidos sejam apresentados novamente como bloqueios.

## Git e fontes locais

O .gitignore foi aplicado conforme GITIGNORE_PROPOSTO.txt. Foram criadas develop e feature/documentacao-inicial, com a feature ativa. Não houve commit nem envio remoto.

As pastas doc/wiki e doc/prints continuam locais e disponíveis para consulta explícita. O índice FONTES_LOCAIS.md permanece versionável. Documentação própria, dados, scripts e assets finais não devem ser excluídos pelos padrões aplicados.


As decisões de inclusão de geração procedural, mapa e bússola foram adiadas para os próximos marcos e não são pendências bloqueadoras do M01. As demais linhas acima representam detalhamento, pesquisa, implementação e balanceamento, não pedidos para redefinir regras confirmadas. Novas alternativas com impacto de produto devem ser tratadas quando surgirem.

## Verificação final de prontidão

Conclusão: não restam bloqueios de definição de direção para iniciar o protótipo M01. O encerramento no Shift Gate, criação de personagem, idioma, regras de recursos, aprendizado, coleta, proteção de itens e destino mobile estão confirmados. Geração procedural, mapa e bússola estão adiados para próximos marcos.

Os itens da tabela atual são especificações por feature, não uma nova rodada obrigatória de perguntas antes de começar. A progressão deve concretizar o modelo Skyrim com adaptações; os números serão documentados e balanceados. A seleção de raças, gêneros, técnicas, itens e assets exige inventário das fontes e do conteúdo do M01, sem presumir opções novas como já aprovadas.

Ainda há tarefas antes de declarar o M01 pronto: detalhar e traduzir eventos, validar visualmente a dungeon, preparar o boot, produzir assets consistentes, implementar plugins próprios necessários e testar os fluxos em desktop e no Galaxy A56. Nenhuma delas foi executada por esta análise.

Foram corrigidos trechos ativos que ainda tratavam o fim da demo e a identidade da primeira quest como indefinidos, além das menções à independência irrestrita dos slots equipáveis. Empilhamento passa a seguir explicitamente o padrão compatível do motor. As listas históricas permanecem datadas e subordinadas a este checklist.

O .gitignore e os documentos continuam sem commit na feature/documentacao-inicial; revisar e consolidar a feature é uma pendência de organização, não de design. Nenhum commit, merge ou envio foi realizado nesta verificação.


## Planejamento de implementação do M01

As tarefas remanescentes estão organizadas em BACKLOG_M01.md, itens M01-01 a M01-20. O checklist de pendências continua distinguindo regras confirmadas de especificação técnica; o backlog indica ordem, dependências e critérios para executar a demo.

## Execução iniciada em 25/10/2026

A situação de Git descrita acima é histórica: baseline documental consolidada em 29fc22b e integrada em develop; MQ01 especificada em 29f44c3. O laboratório M01-03 passou em Chrome desktop. Consultar VALIDACAO_M01.md para estado por item e limites; este registro não declara a demo pronta.

Banco mínimo M01-04 cadastrado e validado; fontes/adaptações em DADOS_M01.md. Próxima etapa M01-05: persistência própria. O estado histórico “sem commit” nos parágrafos anteriores não representa a árvore atual; consultar o Git e VALIDACAO_M01.md.

## M01-06 — revisão estética prioritária

A amostra anterior foi rejeitada pelo responsável. R02/R03 é candidata pequena; consultar `arte/REVISAO_IDENTIDADE_R02.md`. Não ampliar produção antes da avaliação estética. Corrigir perspectiva para exploração superior e completar estados de animação somente após validar direção. Ilustrações narrativas reutilizáveis não podem fixar identidade/equipamento do protagonista, inclusive por mãos, silhuetas ou sombras.

## Estado atual — direção aprovada, M01-06 em validação técnica

A aprovação explícita do responsável em25/10/2026 cobre dungeon R02, rato R03 e Ria R02; conferir `arte/APROVACAO_DIRECAO_R02_R03.json`. Substitui a espera estética da seção anterior. Preservar referências/prompts e não regenerar imagens adequadas. Revisar composição/objetos/contexto ao integrar diálogos, sempre sem protagonista. Map003 é a nova galeria técnica; limitações, testes e próximos passos em `arte/INTEGRACAO_R04.md`. Ainda pendentes: autoria no editor, leitura/toque no aparelho, acabamento de superfícies e formatos/estados completos de combate. Não marcar todo M01-06 concluído.

## Atualização R05

Autoria: gerenciador abriu e projeto foi salvo/fechado/reaberto pelo editor usando teclado/acessibilidade; serialização auditada. Conferência visual detalhada do gerenciador/Map003 e playtest continua pendente por limitação de captura/clique. Leitura da galeria mobile melhorada, testada com toque emulado; Galaxy A56 não testado. Ver `arte/FIDELIDADE_E_VALIDACAO_R05.md`. Inventário:16 combinações necessárias, uma piloto provisória, nenhum conjunto final completo; M01-07 não iniciado enquanto dependência M01-06 continuar em validação. Não repetir geração dos aprovados.

## Estado atual após criação M01-07

M01-06 concluído como primeira amostra desktop conforme matriz ENCERRAMENTO_AMOSTRA_M01_06.md, integrado em develop. M01-07 criação-base implementada e validada em desktop em feature própria:16 combinações, nome, bônus e save/load. Relatório M01_07_CRIACAO.md. As esperas anteriores de todo catálogo/combate não bloqueiam mais os exemplos já demonstrados; biblioteca animada, visuais de armadura e A56 permanecem nos itens próprios. Novas variantes precisam de revisão estética pelo responsável, sem regenerar as aprovadas sem necessidade. Não implementar dungeon final, aliados ou outra feature nesta rodada.
