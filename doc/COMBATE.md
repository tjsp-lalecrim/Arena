# Combate

## Requisitos confirmados

- O combate terá apresentação Side View, com visão lateral dos participantes.
- As mecânicas serão modernizadas em relação ao jogo original, priorizando liberdade de combinar equipamentos, itens, habilidades e estratégias, sem adaptar suas classes profissionais. Consulte DIRETRIZES_DE_ADAPTACAO.md.
- Inimigos terão animações de combate, assim como os personagens controlados pelo jogador.
- Personagens e inimigos exibirão barras de vida, mana e vigor quando possuírem os respectivos recursos.
- Haverá uma barra de atalhos para usar habilidades e itens durante o combate.

O combate será por turnos, com apresentação Side View e inicialmente um único personagem controlável. Adotar as regras nativas compatíveis do MV para ordem de turnos, ações e empates; documentar somente as adaptações necessárias aos requisitos específicos. Aliados serão avaliados futuramente e não fazem parte da implementação inicial. A barra de atalhos deve respeitar o fluxo de turnos aprovado.

## Encontros na exploração

A exploração será em 2D com vista superior e movimentação por grade. O contato com um inimigo visível no mapa inicia o combate Side View por turnos. Não adotar encontros aleatórios invisíveis como padrão. A derrota em combate leva a game over.

Os inimigos no mapa terão movimentação de patrulha. O retorno após vitória seguirá o padrão do RPG Maker MV, com encerramento da batalha e retomada da exploração. Inicialmente não será permitido fugir: a interface e o processamento da batalha devem respeitar essa regra. A derrota leva a game over.

Rotas, velocidade e pausas de patrulha serão configuradas durante a implementação. O respawn ocorre ao sair da dungeon depois de concluí-la ou ao sair do cenário onde a quest foi concluída. Todos os inimigos comuns retornam; os incluídos especificamente pela quest não retornam. Perseguição e vantagem por aproximação não estão confirmadas. Um inimigo derrotado não deve reiniciar imediatamente a mesma batalha. O ciclo de respawn deve observar a conclusão da dungeon ou quest e preservar o progresso de quest; a reativação é disparada pela saída da área após a conclusão; a associação entre área e quest e os marcadores de inimigo específico devem ser persistidos. Não presumir reset de toda a área a cada vitória. Os detalhes de colisão devem ser validados com as rotas de patrulha.

## Animações

Planejar assets animados tanto para personagens quanto para inimigos. Uma imagem estática de inimigo acompanhada apenas de efeitos de habilidade não atende ao requisito de animação do próprio combatente.

O conjunto exato de movimentos, a quantidade de quadros e a técnica de animação ainda serão definidos. Como proposta para um protótipo, avaliar espera, execução de ação, reação a dano e derrota para ambos os lados. Não tratar essa lista como especificação final.

Validar primeiro um personagem e um inimigo no mesmo combate antes de ampliar a produção de assets por IA. A solução técnica deve ser avaliada no projeto; a escolha de Side View não implica que todos os requisitos já sejam atendidos pelo motor ou pelos plugins existentes.

## Barras de recursos

Cada combatente deve exibir as barras correspondentes aos recursos que possui. Um recurso existente e esgotado deve continuar representado como vazio; ausência de recurso e valor zero são situações diferentes.

As barras devem refletir os valores atuais durante o combate. Definir posteriormente posição, identificação, cores, presença de valores numéricos e comportamento em caso de derrota ou remoção de um participante. Preservar a legibilidade quando houver vários combatentes.

Vigor representa Stamina: será gasto somente em combate através de técnicas. Não há regeneração passiva de Stamina: a recuperação ocorre por poções ou descanso em camas. O mapeamento técnico para TP ou recurso próprio será documentado na implementação. Não aplicar automaticamente os comportamentos nativos de TP se conflitarem com Stamina. Técnicas físicas dependem da arma utilizada; magias são aprendidas pela Mages Guild ou por livros, conforme HABILIDADES_E_PROGRESSAO.md.

## Recuperação de vida por descanso

O jogador recupera vida ao interagir com camas em hotéis e em algumas dungeons. Identificar na wiki quais locais e condições se aplicam antes de configurar essas interações, consultando primeiro os materiais de doc/wiki/. A disponibilidade de camas não deve ser presumida para todas as dungeons.

Essa é uma regra específica do projeto e tem precedência sobre comportamentos genéricos de recuperação do motor. Inicialmente dormir em uma cama recupera completamente vida, mana e vigor. Consultar as fontes para locais elegíveis, eventual custo, passagem de tempo e outras condições; não presumir descanso gratuito. A restauração completa é a regra confirmada da adaptação.

A regra de camas foi ampliada para os três recursos. Stamina não possui regeneração passiva e é recuperada por poções ou camas. Cura de vida e recuperação de mana por outros meios continuam sujeitas às regras dos respectivos itens e habilidades.

Registrar a fonte e as adaptações da interação de cada cama. O jogador deve acionar a cama para iniciar a recuperação; a mera proximidade não deve conceder vida. Na primeira implementação, validar a alteração da vida e as condições aplicáveis sem duplicar cobranças ou outros efeitos por execução repetida indevida.

As regras e os locais da wiki ainda não foram verificados nesta atualização documental. Os títulos locais Arena_Services, Arena_Hints e materiais de dungeons são candidatos de consulta, não evidência de uma regra já confirmada.

## Menu de batalha

O menu de batalha será refatorado para priorizar slots, ícones, descrições e quantidades cabíveis, seguindo a referência de MMORPGs. A barra de atalhos deve seguir a mesma linguagem visual. Priorizar acesso rápido, pulando seleções com uma única opção válida, inclusive alvo quando aplicável, conforme INTERFACE.md. Consulte INTERFACE.md; os requisitos para novos plugins estão em PLUGINS.md.

## Barra de atalhos

A interface de combate deve permitir o uso de habilidades e itens pela barra de atalhos. A execução precisa respeitar as regras de disponibilidade, custos, quantidade de itens e seleção de alvo que forem definidas para o combate.

Permanecem em aberto: quantidade de espaços, teclas ou outros controles, configuração dos atalhos, persistência entre combates e existência de recargas. Troca de personagem ativo fica fora do escopo inicial de personagem único. Não presumir implementação de cooldowns ou uso em tempo real apenas pela presença da barra.

## Critérios de aceitação do protótipo

- O personagem se movimenta por grade em um mapa de vista superior; o contato com um inimigo visível inicia a batalha.
- Uma batalha apresenta personagem e inimigo em visão lateral.
- A derrota em combate aciona game over.
- Os inimigos visíveis executam a rota de patrulha configurada.
- Após vitória, a batalha termina e a exploração é retomada pelo fluxo padrão do MV, sem reinício involuntário do mesmo encontro.
- A fuga não pode ser executada na versão inicial.
- Ambos exibem animações próprias de combate, conforme o conjunto aprovado para o protótipo.
- As barras de recursos existentes aparecem para ambos os lados e acompanham suas alterações.
- Um recurso esgotado permanece visível; um recurso que o combatente não possui não gera uma barra indevida.
- É possível usar ao menos uma habilidade e um item pela barra de atalhos, respeitando alvo, custo e disponibilidade.
- Uma tentativa de uso indisponível não consome indevidamente recursos ou itens.
- A interface continua legível no cenário de teste.

Esses critérios orientam uma futura implementação. Nenhuma funcionalidade de combate foi implementada ou testada por este documento.
