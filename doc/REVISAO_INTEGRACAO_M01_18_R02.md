# Revisão integrada do M01 — R02, 28/10/2026

Base inspecionada: `feature/m01-narrativa-demo`, commit0a0106e, inicialmente limpa e sincronizada. Esta revisão atende aos defeitos relatados pelo responsável. Não constitui aprovação das imagens novas, encerramento dos testes integrados ou início de outro backlog. Sem merge em develop/main.

## Introdução e fontes

Cinco momentos históricos e nove momentos de Ria, cada um com imagem própria:14 ilustrações novas, geradas por IA a partir da direção aprovada de Ria R02. Nenhuma mostra o protagonista; Ria é a única personagem identificada nas imagens do sonho. Ambientes e objetos dos episódios históricos são interpretações artísticas, não reconstruções confirmadas do palácio. Coroa/bolo/estandartes e objetos simbólicos não são evidência de objetos do original; a heráldica decorativa também não foi confirmada como emblema canônico. Sem vozes. Retratos e animações de batalha aprovados preservados.

Textos anteriores mantêm seu conteúdo, dividindo os antigos R01 e R02. A orientação da chave explicita sua visibilidade/plataforma; o Shift Gate ganha uma explicação de sua função. A janela de ilustração passa a ocupar a parte superior no desktop e uma coluna maior em paisagem curta; a imagem é contida com proporção preservada. Texto continua paginado sem perda de palavras. A última página transfere diretamente à cela: não há botão de salvar nem confirmação adicional de entrada durante a introdução. Salvar permanece no menu normal e no encerramento. Nova pressão após soltura continua obrigatória para avançar.

Consulta efetiva: START.INF original/cópia decodificada ignorada descreve um brilho de rubi no canto; TEMPLATE.DAT#1400 contém a fala de Ria sobre parede norte e chave que abre a porta. UESP local, `Arena_Imperial Dungeons (quest)`, p.3, descreve chave visível sobre plataforma elevada(3,19), com sprite aparentemente amarelo. A gema vermelha das artes é interpretação do brilho/nome; não comprova a cor do sprite. Não há evidência de chave escondida em recipiente ou mecanismo secreto. O mapa já contém a plataforma e a fonte física, preservadas.

O PDF, p.4, descreve Shift Gate com borda azul e transporte a uma cidade da província de origem; a fala primária confirma transporte para longe do centro do Império. É um portal mágico, não pessoa ou localização geográfica. Mantido **Shift Gate**, com explicação pt-BR na orientação. Não foi reproduzida uma partida DOS nesta rodada. INTRO.FLC e sua reprodução inconclusiva continuam explicitamente limitados conforme R01; não inventar confirmação audiovisual.

Diretriz/glossário: LOCALIZACAO_E_GLOSSARIO.md. O nome visível do mapa e do diário passa a **Imperial Dungeons**. O Map008 mantém seu ID; na árvore agora é M01-14 Imperial Dungeons. O acesso técnico chama-se Explorar Imperial Dungeons (antes: Explorar Dungeon). Documentos históricos não são substituídos globalmente. Pessoas/províncias já estavam no original; raças e títulos comuns continuam conforme decisões existentes.

## Persistência narrativa

Namespace arenaNarrative v2. Saves sem namespace continuam técnicos. O antigo R01 é dividido após22 palavras; o antigo R02, após20. Trechos inalterados conservam o cursor, inclusive no histórico de retorno. Na frase reformulada da chave, somente essa frase pode reaparecer na migração; a quest não reinicia. O acréscimo explicativo do portal ajusta o cursor em cinco palavras. Saves da dungeon/final não repetem introdução, recompensas ou conclusão. Os textos R01 deste documento de especificação são históricos; consultar a seção vigente R02 em MQ01_ESPECIFICACAO.md.

## Tesouros e portal

Tesouros opcionais usam o recibo estável `container/MQ01.treasure.<eventId>`. Após settlement bem-sucedido, o evento fica transparente; o estado visual é reconstruído do recibo ao retornar/carregar. Não depende do respawn de inimigos. Falha na concessão não oculta a fonte. A chave importante mantém seu contrato separado de recuperação, entrega/consumo e saneamento de duplicados.

`ArenaLoot.claimContainer(id, table, minimumGold)` permite mínimo somente para recipientes. `ArenaQuests.treasureMinimumGold=5` é a configuração inicial **provisória**: todas as fontes opcionais usam atualmente a mesma tabela de dificuldade do inimigo2. É um piso pequeno dentro da faixa de ouro dessa configuração, não dado confirmado do Arena original. Aplica-se quando não há linha de quantidade positiva, inclusive resultado de ouro0. Não acrescenta outro equipamento, não muda raridade e não força recompensas de inimigos. Capacidade cheia mantém reserva persistente. Recibos antigos, inclusive vazios, permanecem resolvidos sem sorteio/compensação retroativa.

Falha do portal reproduzida a partir de Novo Jogo na base0a0106e: chegar à frente da lateral esquerda(12,146) não concluía; passar pelo contato central(13,145) concluía. O desenho ocupa3 tiles de largura sobre parede bloqueada; havia só um contato no piso. A correção mantém colisão/topologia e cobre a aproximação transitável3×2: x12–14/y145–146. Novos contatos236–240 são acrescentados sem renumerar os235 eventos existentes. Saves antigos recebem os contatos ausentes antes dos sprites. Um save já dentro da área elegível é resolvido ao reabrir o mapa. Etapa30 e recibo legítimo da porta continuam necessários; conclusão/encerramento ocorrem uma vez. Configuração relativa: gateHalfWidth1/gateDepth2.

## Caminhada e armas

Auditoria confirmou15 folhas com poses repetidas; a Bretã feminina já tinha ciclo e permanece byte a byte. Foram geradas15 folhas do jogador e duas de patrulha, preservando os arquivos anteriores. Runtime novo: células64×64/folhas192×256, altura nominal56 do jogador e apoio62; a Bretã preserva48×64/144×256 com o mesmo apoio. As margens maiores acomodam caudas/orelhas sem deformar a figura. Retrato, estudo lateral e batalha não são substituídos. Prévia da criação lê mapCell; máscara de material da armadura desloca-se pelo centro da célula, sem alterar alpha ou os movimentos de batalha.

Montagem técnica registrada em walk-exports.json: recorte pelas margens, escala uniforme por folha e pivô pelo corpo. Fases frontais/traseiras opostas usam reflexão de uma pose de passada articulada em roupas bilateralmente compatíveis; não são imagens estáticas transladadas nem correção de torção anatômica. Reflexões de orientação de células específicas estão listadas por índice. Não se aplicam a retratos ou combate. O goblin tem correções próprias para manter a mão da arma na vista traseira. Estudos Khajiit G02/G03 não selecionados permanecem identificados. Avaliação estética/fluidez do conjunto novo ainda cabe ao responsável.

Ratos/goblins usam folhas nativas de personagens e as direções reais do evento. Não reutilizam a espera de batalha. walkAnime=true/stepAnime=false; animationWait10 permite percorrer as três poses durante um passo de patrulha, mantendo velocidade3, intervalo90, regiões, raio, contato e respawn anteriores. Não há fallback silencioso para inimigo sem folha. Sync também reconstrói o visual de eventos serializados antigos. O rato usa groundByDirection8=52/compensação10px ao norte, para que a cauda não vire o pivô; nos demais sentidos, ground62. Cobertura:16 identidades do jogador; ratos/goblins presentes nos67 encontros. Homem-lagarto continua com sua batalha aprovada e não foi acrescentado às patrulhas.

A arma era inserida sempre atrás do corpo. `frame.weaponLayer` agora define frente/trás por pose: preparação leve1 e pesada2 usam o plano traseiro; demais apoios configurados usam frente. Posições, ângulos, tamanho, ponto de pega e tempos permanecem nos registros revisados; espelhamento acompanha o lado esquerdo do jogador. Não existe prioridade frontal global. Arma é recolhida nas poses sem apoio. Adaga/espada curta verificadas pelo processamento nativo; as16 identidades tiveram seus apoios/planos/espelhamento inspecionados automaticamente.

## Rastreabilidade e reconstrução

Prompts completos, referências efetivamente fornecidas, masters, hashes, dimensões, seleção e estudos em `doc/arte/m01-integracao-r02/`. Masters novos em `art/masters/m01-integration-r02/`. Os dados de consulta originais continuam somente em `tmp/original-review`, ignorado; não foram incorporados à distribuição nem alterados na instalação original.

Geradores: build-narrative-art-r02.py e build-walk-r02.py --integrate reconstroem exports/referências. build-dungeon-map.py → build-encounters.cjs → build-quests.cjs preserva o ajuste de contatos, imagens e cadência. Geradores históricos de batalha preservam participantes existentes e escrevem weaponLayer. A narrativa R07 recebeu uma tentativa de limpeza por IA; sua exportação também retira32px da margem inferior com escrita residual, sem cortar Ria ou objetos narrativos. Master anterior e prompt de edição preservados; não declarar que o master ficou inteiramente limpo.

## Validação manual recomendada

1. Novo Jogo: nome/raça/gênero →14 momentos, Voltar/Continuar. Conferir leitura e imagens sem protagonista; manter Enter/toque não deve pular páginas. Última orientação entra diretamente na cela.
2. Obter a chave visível na plataforma norte, abrir a porta e coletar tesouros. A fonte deve sumir; repetir, salvar/carregar e sair/voltar não devem recriá-la. Chave consumida legitimamente não retorna.
3. Explorar Imperial Dungeons/Encontros técnicos: andar nas quatro direções, equipar couro/malha e observar ratos/goblins em movimento/parados. Conferir apoio, identidade, escala e água. A natação não cobra Vigor.
4. Combate técnico: adaga e espada curta, espera, aproximação, ataques leve/pesado e retorno; conferir pega, planos e ausência de arma flutuante.
5. Seguir oeste/sul ao Shift Gate, inclusive pela lateral. Primeira chegada elegível deve abrir o encerramento, uma vez; voltar ao título não inicia M02.

Nova autoria/playtest desta revisão no editor e Galaxy A56 físico permanecem pendentes; não são substituídos por Chrome automatizado. Aprovações anteriores mantêm seus escopos. Refinamentos de inventário/favoritos, fundo de batalha, notificações, balanceamento e custos aquáticos não foram implementados.


## Resultados técnicos desta revisão

Chrome156, motor MV1.6.1, armazenamento isolado por cenário; sem saves pessoais. Testes de navegador não comprovam autoria no editor.

| Verificação | Resultado / evidência em evidencias/m01-18-r02 |
|---|---|
| Novo Jogo, criação,14 momentos, chave, porta, Gate lateral, fim e título |8 grupos; resultado.json. Rota nativa239 passos em velocidade normal, sem teleporte/atravessar paredes no percurso da campanha. |
| Layout e entrada |4 grupos,42 layouts dos14 momentos em desktop,640×480 e916×412; narrativa-telas-menores.json. Teclado, mouse, toque emulado e migração do cursor v1. |
| Tesouros e compatibilidade |7 grupos; integracao-tesouros.json. Sorteio vazio/ouro0, mínimo5, recibo, reserva, ocultação, retorno/save/load, independência de respawn, chave consumida, save antigo com235 eventos e save dentro do Gate. |
| Caminhada |16 identidades,4 direções/3 padrões nativos; caminhada-runtime.json. Complemento apoio-rato/caminhada-runtime.json cobre apoio norte, patrulhas, clique/toque emulado e save/load na água; rows vazio nesse complemento é intencional, não substitui o relatório completo. |
| Armaduras |16 identidades×2 materiais; armaduras/aparencia.json. Alpha preservado e áreas opacas protegidas; tolerância1 apenas em arredondamento de pixels translúcidos. |
| Criação |234 verificações; regressoes/criacao/m01-07-result.json.16 prévias reais adicionais em previews/resultado.json e prancha previews-todas-combinacoes.png. |
| Armas |16 identidades×adaga/espada curta, todos os apoios/planos/espelhamento; armas-planos-16-combinacoes.json. |
| Ações reais em batalha |Bretã feminina/rato,10 clipes; armas/resultado.json. Espera/ataques/dano/derrota, armas, custos únicos, efeitos, poção, vitória/derrota e save/load. As outras15 identidades tiveram sondagem de poses, não16 batalhas completas. Metadados antigos de cobertura foram corrigidos explicitamente, sem simular nova execução. |
| Regressões |Quests23, encontros14 e persistência27 verificações; regressoes/quests/resultado.json, encontros/resultado.json e persistencia.json. |
| Arquivos e geração |126 paginações sem perda,32 registros canônicos de plugins inalterados, referências existentes, UTF-8/sintaxe, contratos/topologia preservados; validate-narrative.cjs. Reconstrução real do mapa mantém os mesmos dados e os tiles PNG idênticos; geradores.json. Python dos geradores compila. |
| Arte |14 exports narrativos e17 folhas novas com hashes/versões; auditoria de18 folhas inclui a piloto preservada. Registros sem arquivos vazios/JSON inválido em auditoria-registros-arte.json; isso não equivale a auditar toda a procedência histórica. |

Gravações de canvas nativo foram reproduzidas e seus quadros decodificados para inspeção: caminhada aproximadamente10s, espada pesada6s e chegada lateral ao portal3,5s, incluindo a transição para F01. Arquivos: apoio-rato/caminhada-patrulhas.webm, armas/espada-pesada.webm e portal-primeira-chegada.webm. Pranchas video-*-quadros.png derivam desses vídeos, sem reconstrução de atlas. Relatório videos-decodificados.json. A pasta diagnostico e as capturas soltas de regressoes preservam tentativas intermediárias; os resultados válidos são os caminhos nomeados na tabela.

Pendências: avaliação estética/fluidez das novas imagens e caminhada pelo responsável; novo ciclo de abertura/edição/salvamento/reabertura no MV desta revisão; Galaxy A56 físico na integração mobile. Evidências anteriores do responsável não são atribuídas a esta versão. INTRO.FLC e comportamento DOS não foram observados nesta rodada. M01-18 segue tecnicamente implementado na feature para revisão, sem aprovação estética nova, sem merge e sem início de M01-19.
