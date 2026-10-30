# Revisão de prontidão para desenvolvimento

Revisão em 25/10/2026 dos dez documentos Markdown diretamente em doc/. Os arquivos de doc/wiki/ não foram analisados em conteúdo nesta revisão. As classificações abaixo são recomendações, não novas decisões de design.

## Diretriz posterior sobre pendências

Regras inicialmente não definidas seguirão o padrão do RPG Maker MV 1.6.1, conforme confirmado pelo responsável. A lista histórica abaixo não deve ser interpretada como exigência de novas decisões para cada regra nativa. Para cada feature, verificar o padrão aplicável, adotá-lo quando compatível e registrar sua utilização.

Permanecem tarefas de implementação e conteúdo: preparar o projeto jogável, selecionar os dados e textos do marco, gerar assets, implementar recursos específicos, configurar os inimigos e validar navegador/mobile. Requisitos próprios, como vigor, slots de loot e interface, devem ser atendidos mesmo sem equivalente nativo direto. Plataforma de teste e resolução são configurações a registrar; a configuração existente pode ser o ponto de partida, sem alegar validação ainda não realizada.

## Atualização após as decisões do responsável

Esta seção atualiza a situação das pendências; a revisão abaixo permanece como registro da análise anterior.

| Item | Situação atual |
| --- | --- |
| P01 | Ritmo resolvido: turnos. Ordem de ações, alvos e custos serão detalhados antes do protótipo de combate |
| P02 | Definido: vista superior 2D, movimentação por grade e batalha por contato com inimigos visíveis. Derrota leva a game over; inimigos patrulham, o retorno após vitória segue o padrão do MV e a fuga fica inicialmente desabilitada. Rotas e ciclo dos eventos serão detalhados na implementação |
| P03 | Resolvido: personagem único inicialmente; aliados apenas em avaliação futura |
| P04 | Recorte resolvido: introdução e dungeon inicial. Detalhar fontes, eventos e ponto de encerramento antes de produzir o conteúdo |
| P05 | Parcialmente resolvido: navegador e mobile, prioridade para teclado e mouse. Definir resolução e matriz mínima de teste; planejar toque antes da validação mobile |

Git Flow foi confirmado. O documento de desenvolvimento agora especifica main, develop, feature/*, release/* e hotfix/*. A organização efetiva das branches ainda está pendente: somente main foi encontrada, e esta atualização não criou branches nem commits.

A base geral foi alinhada ao marco confirmado e o guia inicial foi atualizado para evitar repetir o diagnóstico já realizado. A referência ao estado limpo do Git foi contextualizada como histórica. Permanecem as pendências por feature descritas abaixo, incluindo vigor, progressão, equipamentos, loot e contratos de quests.

As decisões de exploração e consequências do combate estão definidas. A prioridade agora é fechar o ambiente mínimo de teste de P05, consolidar a documentação sob Git Flow e detalhar o protótipo. Não é necessário decidir todo o conteúdo ou balanceamento final.

## Conclusão da revisão anterior

A direção do projeto está suficientemente descrita para planejamento, organização do repositório e experimentos técnicos isolados. Ainda faltam escolhas estruturais para iniciar a implementação integrada do jogo sem grande risco de retrabalho.

Não é necessário fechar todo o design antes de programar. Fechar primeiro as decisões que alteram a arquitetura; definir os contratos de cada sistema antes de sua implementação; ajustar valores e apresentação com o protótipo em execução.

## Antes da implementação integrada

| ID | Pendência | Por que antecipar | Resultado mínimo necessário | Fonte |
| --- | --- | --- | --- | --- |
| P01 | Escolher ritmo e controle do combate | Side View define a apresentação, mas turnos, tempo real e soluções híbridas exigem fluxos diferentes de ações, atalhos e animação | Descrever quando o jogador age, como escolhe alvo, quando inimigos agem e se existem pausas | COMBATE.md |
| P02 | Definir exploração e transição para batalha | Visão lateral do combate não define perspectiva do mapa, movimento ou encontros | Escolher perspectiva de exploração, movimentação e forma de iniciar e encerrar combates | BASE_DO_PROJETO.md |
| P03 | Definir composição e controle do grupo | Menus, alvos, atalhos e barras dependem do número de personagens controláveis | Confirmar personagem único ou grupo; se grupo, definir controle durante combate | BASE_DO_PROJETO.md e COMBATE.md |
| P04 | Aprovar o recorte do primeiro marco | A pequena aventura atual é proposta genérica; ainda não identifica um trecho fiel à campanha original | Selecionar um trecho, ponto inicial, ponto final e conteúdo mínimo, com critérios de conclusão | BASE_DO_PROJETO.md e QUESTS.md |
| P05 | Definir plataforma e controles mínimos | Resolução, quantidade de informações e acesso rápido dependem do modo de jogar | Confirmar destino inicial, dispositivos de entrada e resolução de teste; 816 × 624 é configuração encontrada, não decisão aprovada | INTERFACE.md e DIAGNOSTICO_INICIAL.md |

Essas escolhas podem ser avaliadas com experiências descartáveis ou protótipos comparativos. Não é preciso aguardar arte definitiva para resolvê-las.

## Antes da feature correspondente

Estas pendências não bloqueiam todo o projeto. Devem ser resolvidas quando a feature entrar em desenvolvimento, antes de fixar seus dados e integrações.

| ID | Feature | Decisão mínima | O que pode esperar |
| --- | --- | --- | --- |
| F01 | Atributos e combate | Papel de vida, mana e vigor, quais entidades os possuem, consumo e recuperação; decidir se vigor usa TP ou recurso próprio | Valores finais, custos exatos e curvas de balanceamento |
| F02 | Progressão e habilidades | Forma de adquirir e disponibilizar habilidades sem classes profissionais; definir se haverá níveis e como se relacionam com bônus raciais | Lista completa de habilidades, números finais e progressão de todo o jogo |
| F03 | Equipamentos e inventário | Slots equipáveis, regras de uso simultâneo, categorias e empilhamento; preservar ausência de bloqueios por raça/classe | Catálogo completo, preço e balanceamento de todos os itens |
| F04 | Loot | Definir equipamentos do slot 3, tratamento de raros que pertençam a outras categorias, momento do sorteio, coleta e recompensas por inimigo ou batalha | Chances e quantidades finais por inimigo; usar tabelas provisórias identificadas |
| F05 | Quests | IDs, estados, avanço, conclusão, persistência e integração com slot 5; especificar a primeira quest | Categorias avançadas, bússola, marcadores, abandono e repetição onde não forem necessários |
| F06 | Atalhos e menus | Ação de cada controle, seleção de alvo, configuração/persistência dos atalhos e comportamento ao cancelar; protótipo de composição da tela | Número final de slots, cores, transições, filtros e arrastar e soltar |
| F07 | Assets animados | Técnica, formato, escala e movimentos mínimos de um personagem e um inimigo, validados na batalha | Biblioteca inteira, refinamento visual e quantidade final de quadros |
| F08 | Dados e bônus raciais | Fonte dos registros usados, IDs estáveis e conversão dos primeiros bônus; classes MV apenas como suporte técnico | Adaptação de todas as raças e de todo o banco de dados |
| F09 | Salvamento e plugins | Definir o que cada feature persiste, limites entre plugins, dependências e tratamento de dados novos | Compatibilidade com versões antigas ainda inexistentes; registrar uma política antes de distribuir builds |
| F10 | Narrativa e diário | Localizar fontes dos textos do trecho escolhido; definir idioma e como identificar traduções/adaptações | Tradução e revisão de toda a campanha |

## Adequado para definir durante a implementação

- Ajustar dano, custos, regeneração, bônus raciais, recompensas, chances de loot e economia com testes do protótipo. Os valores iniciais precisam estar identificados como provisórios.
- Refinar posição de barras, tamanho de ícones, quantidade visível de slots, textos de ajuda e navegação com telas funcionais.
- Escolher parâmetros, nomes de plugins e divisão de responsabilidades conforme as necessidades reais; documentar funcionalidades, dependências e limites de reutilização.
- Detalhar objetivos, textos e tabelas de cada nova quest ou inimigo quando o conteúdo entrar no escopo.
- Refinar prompts, paleta, animações e áudio após validar assets mínimos no motor. O formato técnico deve ser conhecido antes da produção em lote.
- Decidir título definitivo, duração total e conteúdo de etapas posteriores sem bloquear um primeiro protótipo.
- Definir distribuição antes de preparar uma versão para publicação; a decisão não impede um protótipo local.

## Pendências técnicas para a primeira entrega jogável

A ausência de mapas e recursos não é um impedimento para iniciar o trabalho: é parte da primeira tarefa técnica. Reconfirmado nesta revisão: existe MapInfos.json, mas nenhum MapNNN.json; img/ e audio/ continuam sem arquivos.

Auditar referências removidas, configurar um mapa inicial válido, fornecer os recursos mínimos necessários ou retirar referências não utilizadas de forma deliberada e testar abertura, nova partida e menu. O diagnóstico anterior registra referências a Castle e Dragon, mas o impacto real ainda depende de teste no motor. Não foi executado playtest nesta revisão.

## Consolidação documental e Git

1. A BASE_DO_PROJETO.md deve apresentar o marco como um recorte da história original. A estrutura genérica de receber missão, masmorra e retorno continua proposta; não deve obrigar mudanças na campanha. O ponto precisa ser resolvido em P04.
2. INICIO_NO_CODEX.md ainda pede o diagnóstico inicial já existente. O próximo pedido deve apontar esta revisão e orientar o fechamento de P01 a P05, seguido da preparação técnica mínima.
3. A BASE_DO_PROJETO.md repete um estado técnico histórico como se fosse atual. Vincular explicitamente a data do diagnóstico e separar a situação atual do Git.
4. Critérios de quests, validações e detalhes de interface introduzidos como propostas não devem ser promovidos automaticamente a decisões confirmadas. Validá-los na especificação da feature correspondente.
5. A promessa de replicar a base original deve permanecer subordinada às exceções aprovadas: sem classes profissionais, somente bônus raciais e sem restrições de armas e armaduras.
6. Usar cada documento temático como referência detalhada; manter a base geral como resumo para reduzir divergências na manutenção.
7. No momento da revisão, o Git está na branch main e mostra doc/ como não rastreada. A organização em uma branch de feature ainda não foi executada. Antes do primeiro commit, revisar os arquivos individualmente, especialmente doc/wiki/, que mistura fontes da wiki e materiais locais. Não adicionar toda a pasta indiscriminadamente.
8. Conferir o escopo do commit, o diff e as referências entre documentos antes de declarar a documentação consolidada. Não é necessário decidir todos os valores de balanceamento para consolidá-la; as pendências precisam estar registradas e priorizadas.

Nenhuma branch, commit ou envio ao remoto foi realizado por esta revisão.

## Sequência recomendada

Fechar P01 a P05 → consolidar a feature de documentação → preparar abertura e mapa de teste → validar batalha mínima e assets animados → adicionar atalhos e recursos → integrar primeira quest e loot → testar o trecho completo.

Essa sequência é uma proposta de trabalho. Recursos avançados e conteúdo em escala devem depender do resultado desse primeiro ciclo.
