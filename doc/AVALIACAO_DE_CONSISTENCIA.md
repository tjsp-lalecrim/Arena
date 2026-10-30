# Nova avaliação de consistência documental

Data: 25/10/2026. Escopo: os 14 documentos Markdown diretamente em doc/ antes da inclusão deste relatório, as decisões da conversa e verificações pontuais do repositório. Não foram analisados os conteúdos dos PDFs da wiki ou dos manuais instalados, nem executado o jogo. Este relatório não altera decisões de design e não substitui automaticamente os documentos existentes.

## Atualização mais recente

O responsável definiu idioma pt-BR; Stamina sem regeneração passiva, recuperada por poções ou camas; camas restaurando inicialmente vida, mana e vigor completos; técnicas por tipo de arma; Guild condicionada ao nível e livros; balanceamento de loot por testes, com base inicial na wiki; respawn na saída após conclusão, exceto inimigos específicos de quest; referências visuais em doc/prints/ e testes no Galaxy A56. As lacunas históricas correspondentes não devem ser reabertas como decisões pendentes.

CAMPANHA_PRINCIPAL.md apresenta o inventário consultado na wiki; DEMO_INICIAL.md detalha as entregas; ADAPTACAO_DE_MAGIAS.md contém a triagem inicial. Continuam tarefas de implementação, consulta integral de eventos e validação dos assets. Os valores concretos e a representação técnica de Stamina permanecem para implementação.

## Atualização posterior às decisões do responsável

Foram definidos: itens obrigatórios como importantes e protegidos contra descarte; respawn após conclusão de dungeon ou quest; Vigor como Stamina, gasto somente em combate por técnicas; técnicas físicas por arma; aprendizado de magia pela Mages Guild e por livros. Consultar HABILIDADES_E_PROGRESSAO.md, COMBATE.md, LOOT.md e QUESTS.md para as regras atuais.

As lacunas históricas abaixo sobre conceito de vigor, origem das habilidades e existência de respawn estão refinadas por essas decisões. Permanecem escolhas técnicas e de conteúdo por feature. O risco de obtenção de item obrigatório continua relevante: impedir descarte protege um item já obtido, e respawn somente após conclusão não garante o drop necessário para concluir a própria quest.

## Parecer da revisão anterior

A direção geral está coerente: exploração superior por grade, inimigos em patrulha, contato iniciando combate Side View por turnos, personagem único, derrota com game over, ausência inicial de fuga, liberdade de equipamentos, bônus raciais e plugins próprios.

O problema predominante é a manutenção incremental: decisões recentes foram acrescentadas, mas nem todas as listas antigas foram consolidadas. Isso pode fazer o Codex interpretar como bloqueios questões já resolvidas por uma regra geral, ou tratar uma proposta técnica como decisão de produto.

## Incoerências e ambiguidades a corrigir na consolidação

| ID | Prioridade | Evidência | Problema e correção recomendada |
| --- | --- | --- | --- |
| C01 | Alta | BASE_DO_PROJETO.md, “Regra padrão”; COMBATE.md, primeiro parágrafo após requisitos; DIRETRIZES_DE_ADAPTACAO.md, “Combate moderno” | A regra geral manda usar o padrão do MV, mas ordem de turnos, quantidade de ações e outras regras nativas continuam apresentadas como indefinições. Registrar os padrões aplicáveis como base inicial; manter em aberto somente exceções e recursos sem equivalente adequado |
| C02 | Alta | REVISAO_DE_PRONTIDAO.md, atualizações e tabelas históricas P01–P05 | O documento preserva alertas já superados, como a necessidade de escolher ritmo, grupo e perspectiva. Há avisos de contexto histórico, portanto não é uma contradição literal, mas a leitura operacional continua ambígua. Separar claramente estado atual e histórico, sem usar a tabela antiga como checklist de início |
| C03 | Média | BASE_DO_PROJETO.md, “Relação com Arena” e “Ordem sugerida de desenvolvimento”; DIAGNOSTICO_INICIAL.md, “Próxima tarefa recomendada” | Ainda aparecem instruções para definir apresentação e trecho inicial já confirmados. Atualizar a sequência ativa para detalhar e implementar o que foi decidido. Preservar o diagnóstico como registro datado, sem transformá-lo no plano vigente |
| C04 | Média | COMBATE.md, “Barra de atalhos”; REVISAO_DE_PRONTIDAO.md, F06 | Troca de personagem ativo é listada como pendência embora o projeto inicial tenha personagem único; arrastar e soltar ainda consta como refinamento futuro na revisão antiga, mas já é requisito do menu de equipamentos. Remover essas ambiguidades do checklist atual e deixar aliados explicitamente para avaliação futura |
| C05 | Média | GERACAO_DE_CENARIOS.md, “Prova de conceito” e “Referências”; MAPA_E_BUSSOLA.md, introdução e seção de implementação | A inclusão continua em avaliação, mas partes dos documentos usam imperativos de implementação. Acrescentar condição explícita “se a feature for aprovada” e separar avaliação, protótipo autorizado e implementação de produto. Referências externas já foram corretamente reclassificadas como consulta, sem adoção |
| C06 | Média | DIRECAO_DE_ARTE.md, padrões por categoria e versão 1.0 | O guia define bases iniciais úteis, mas mistura normas de estilo, dimensões experimentais e critérios ainda não validados no motor. Destacar quais padrões são obrigatórios e quais são valores iniciais ajustáveis. Manter histórico de revisão do guia quando as medidas forem alteradas |
| C07 | Média | BASE_DO_PROJETO.md e DIRETRIZES_DE_ADAPTACAO.md, base original e fontes | A diretriz de replicar dados pode ser lida mais amplamente que as exceções aprovadas. Consolidar a precedência: decisões específicas da adaptação → conteúdo/regras originais aplicáveis → padrão MV para regras não especificadas. A fonte original não deve reintroduzir classes profissionais ou restrições removidas |

## Divergências entre diretrizes e estado real

### Git Flow ainda não executado

A consulta atual mostra somente a branch main e doc/ como não rastreada. A documentação determina feature/documentacao-inicial a partir de develop. A diretriz está clara, mas a organização real ainda não a segue. Antes do primeiro commit, criar a estrutura necessária preservando o trabalho existente e selecionar explicitamente os arquivos da feature.

Não adicionar doc/wiki/ indiscriminadamente: a pasta contém fontes da wiki e outros materiais locais. A revisão de inclusão no Git é tarefa concreta, não uma decisão adicional sobre o design do jogo.

### Plugin existente fora da nova política

js/plugins.js continua com Community_Basic ativo. Isso diverge do requisito de usar plugins desenvolvidos pelo Codex, embora a pendência já esteja reconhecida em PLUGINS.md. Inventariar as funcionalidades efetivamente necessárias, manter nativamente o que já for padrão e substituir somente o necessário antes da desativação. Não criar um substituto extenso apenas para reproduzir parâmetros sem uso.

### Primeiro teste jogável ainda não preparado

A consulta atual a data/ encontrou MapInfos.json e nenhum MapNNN.json. A preparação de mapa inicial e recursos mínimos continua pendente. O diagnóstico de arquivos ausentes não é evidência de um erro específico em execução, pois o jogo ainda não foi executado nesta avaliação.

## Pendências reais por feature

| Tema | Lacuna | Momento adequado e encaminhamento |
| --- | --- | --- |
| Primeiro marco | Eventos, mapas, diálogos, objetivo inicial e ponto exato de encerramento não foram extraídos das fontes | Antes de produzir o conteúdo da introdução e dungeon. Criar uma especificação curta com fontes identificadas |
| Idioma | Idioma de apresentação e política de tradução não estão definidos | Antes de escrever e revisar diálogos e diário; não bloqueia mapa técnico |
| Vigor | Conceito e regras de consumo/recuperação sem mapeamento definido | Antes da integração do recurso. Usar TP sem verificação pode produzir comportamento diferente de vigor; não considerar essa correspondência aprovada |
| Bônus raciais e progressão | Falta o mapeamento dos primeiros bônus e a forma de adquirir habilidades sem classes profissionais | Antes da feature de progressão. A parte nativa compatível pode seguir MV; conteúdo exclusivo deve ser documentado sem profissão restritiva |
| Descanso | Cura, custo, passagem de tempo e camas elegíveis ainda não foram verificados na wiki ou no original | Antes de implementar as camas. Não presumir cura total nem recuperação de mana/vigor |
| Loot | Fronteira entre slot de equipamentos e de armas, raros sobrepostos, momento da coleta e representação de múltiplos inimigos | Antes da feature de loot. Preservar os seis cálculos por inimigo mesmo se a interface agrupar resultados |
| Item de quest | O slot pode depender de sorteio, mas não há regra de obtenção obrigatória ou repetição da fonte | Antes da primeira quest que depender desse drop. Verificar risco de bloqueio se o inimigo não reaparecer; documentar a solução sem impor automaticamente drop garantido |
| Ciclo dos inimigos | Patrulha e vitória estão definidos, mas desativação/reaparecimento do evento não | Durante a implementação do encontro. O retorno padrão da cena não resolve sozinho o ciclo de vida do evento nem impede contato repetido |
| Aparência por armadura | Faltam a estratégia de composição e o mapeamento por peça | No primeiro protótipo de equipamentos. Validar duas armaduras, retirada e save/load antes de gerar todas as variantes |
| Mobile | Dispositivos/navegadores de teste, toque e adaptação da interface ainda sem validação | Planejar no começo e testar antes de ampliar menus e assets. Teclado/mouse primeiro não elimina o destino mobile |
| Assets | Não há exemplares visuais validados para estabelecer continuidade real | Antes da produção em lote. A geração por IA precisa de revisão, recorte/montagem e teste; prompt igual não garante consistência |
| Persistência | Sistemas próprios compartilham necessidades de IDs e estado, ainda sem contrato comum | Definir incrementalmente antes de integrar quests, loot, aparência e eventual geração. Não é necessário construir um framework completo antecipadamente |

## Riscos de escopo, sem contradição de requisito

- “Escopo reduzido” se refere ao conteúdo inicial, mas há vários sistemas próprios: menus, atalhos, inimigos animados, aparência por armadura, loot e diário. Dividir em entregas integráveis para que a primeira versão não dependa de tudo pronto ao mesmo tempo.
- Geração procedural, mapa e bússola continuam avaliações, não bloqueios do marco confirmado. Mantê-los fora da lista obrigatória até decisão de inclusão.
- A ausência de restrições de armas e armaduras não impede a existência de slots e custos. Essa distinção já está correta nos documentos.
- A adaptação de bônus raciais pode usar classes do MV como suporte técnico sem reproduzir profissões do original. Não é uma contradição; ainda requer configuração de progressão que respeite a liberdade pretendida.
- O requisito de atualização do sprite foi detalhado para mapa e combate, mas não para retratos e ilustrações. Essa delimitação já está explícita e deve permanecer visível no planejamento de assets.
- A recuperação por camas não proíbe automaticamente poções e habilidades de cura. Não introduzir exclusividade que o responsável não definiu.

## Organização documental recomendada

1. Transformar BASE_DO_PROJETO.md em resumo do estado atual, com links por tema e registro das decisões, evitando longas repetições dos documentos de domínio.
2. Manter um checklist vigente de pendências com status: padrão MV aplicável, tarefa de implementação, conteúdo a consultar, decisão de produto ou avaliação opcional.
3. Separar o histórico da revisão anterior do plano de trabalho atual. Este relatório é a avaliação mais recente, sem apagar evidências anteriores.
4. Atualizar o índice de leitura em INICIO_NO_CODEX.md para incluir também mapa/bússola, este relatório e a instalação original como fonte.
5. Registrar fontes locais por caminho relativo e versões consultadas; caminhos absolutos da instalação servem ao ambiente atual e não devem virar dependência da versão distribuída.

## Ordem recomendada para sanar os problemas

Primeiro consolidar C01–C07 e organizar a feature documental sob Git Flow. Depois preparar o projeto para iniciar, especificar o trecho narrativo mínimo e implementar um encontro com patrulha, contato, vitória e game over. Evoluir recursos, equipamentos, interface, quests e loot em features próprias, validando persistência e mobile ao integrar.

Não é necessário pedir novamente definições para regras que já podem seguir o padrão do MV. Continuam necessárias consultas às fontes e escolhas locais de implementação para recursos próprios.

## Verificação e limites

Foram relidos os documentos vigentes e conferidos pontos relevantes com a conversa. Verificadas branch atual, branches locais, status de doc/, plugins configurados e presença de mapas. Não foram auditados conteúdo binário do original, PDFs, links externos, desempenho ou execução do jogo. Nenhuma branch, commit, plugin ou arquivo do jogo foi alterado por esta avaliação; somente este relatório foi acrescentado.
