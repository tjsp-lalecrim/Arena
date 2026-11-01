# Stonekeep — ghoul

## Grupo da ilha — continuação sobre 99203b2

**Relato do responsável:** testou o ghoul na ilha e confirmou funcionamento. Referência disponível **99203b2**, associada ao relato; sem ambiente ou casos adicionais informados. Preservada a aprovação explícita da animação de batalha de8ea06c9. Não inferir aprovação definitiva de balanceamento, recompensas ou persistência. As evidências técnicas anteriores continuam válidas para o exemplar; não repetida a matriz artística/de combate.

**Seis encontros**, IDs `stonekeep.island.ghoul.01` a `.06`, eventos10–15/Map012. O primeiro mantém posição/ID; acrescentados cinco. Mesmos sprites, animações,65PV, atributos, ação e recompensas provisórias do exemplar. Nenhuma fórmula, doença, perseguição ou batalha agregada nova.

| ID final / evento | Célula original MIF | Origem no MV (base zero) |
| --- | --- | --- |
|01 /10 |70,18 |36,57 |
|02 /11 |73,19 |27,60 |
|03 /12 |78,19 |12,60 |
|04 /13 |74,21 |24,66 |
|05 /14 |75,27 |21,84 |
|06 /15 |72,28 |30,87 |

**Fonte:** referências já consultadas,39699021.MIF/MAP1 `0x803c` e STKEEP1.INF/flat60=`ghoul.dfa` (ITEM41). Reutilizadas camadas decodificadas; hash do MIF instalado conferido. São as seis ocorrências declaradas na componente de piso da ilha do pergaminho, não contagem inferida pela cor do automapa. Outra ocorrência no recorte, MIF(82,2)/MV(0,9), fica fora dessa ilha e foi excluída. [Proveniência e projeção](evidencias/m02-stonekeep-ilha/fontes.json). Não houve nova observação DOS. A projeção para centros de células, o raio2 e intervalo90 são adaptações da grade; não se afirma que reproduzam a patrulha original.

Terreno permitido continua região4/piso, colisão nativa, sem água ou paredes; origens distintas e leitos de patrulha separados. Derrotas/recibos independentes; trava compartilhada impede outro contato durante a transição. Sem condição de matar todos: fonte(30,72) preserva elegibilidade, unidade necessária e recuperação. Descanso e simples retorno antes de concluir MQ02 não reativam encontros. Cada vitória pode conceder75EXP: **até450EXP opcionais** no grupo, contra75 do piloto; avaliar consumo/descanso e progressão no M02-BAL, sem aprovação de equilíbrio antecipada.

### Acesso e avaliação curta

[Localhost existente](http://127.0.0.1:8774/) → **Testes / Debug → Campanha e mapas → Stonekeep · ghoul na ilha (RAM)**. Mantido o nome reconhecível e o início(40,60); descrição agora informa o grupo. Batalha direta antiga em Combate continua sem EXP/loot. Nenhum comando novo no título nem alteração de slots pessoais/namespace.

1. Circular a partir da margem:01 a noroeste,02/03 mais a oeste,04 no centro;05/06 ao sul. Usar [visão geral](evidencias/m02-stonekeep-ilha/visao-geral.png), sem exigir todas as batalhas.
2. Contornar guardiões e interagir com o **Pergaminho · marcador provisório**, em(30,72). Diário deve pedir retorno à corte, sem exigência de eliminar o grupo.
3. Se desejar avaliar uma derrota independente, guardar checkpoint pelo menu **Guardar teste em RAM**, vencer um contato, retornar e usar **Carregar teste da RAM**. Essa memória só existe na sessão; slots normais continuam bloqueados. Nova entrada no hub reinicia a fixture.

### Verificação focal executada

`node tools/test-stonekeep-island-encounters.cjs`: Chrome156 isolado/origem efêmera, canvas816×624, cinco grupos. Conferidos seis eventos/perfis, circulação e aproximação de cada ponto, patrulha no piso/raio sem sobreposição observada; fonte e saída alcançáveis com os13 guardiões vivos. Coleta pelo evento nativo, repetição sem duplicar e recuperação do faltante mantiveram etapa50. Save anterior sintético com só o exemplar acrescentou os eventos ausentes sem alterar personagem/MQ01/MQ02/recursos/inventário/recibos.

Dois contatos reais, uma batalha por vez; tentativa concorrente de outro ID bloqueada. Vitórias controladas pelo fluxo nativo (não avaliação de dificuldade) concederam exatamente150EXP,14ouro e duas armaduras de couro, com RNG técnico fixado apenas na sessão isolada. Repetir concessão não alterou estado; os outros quatro ghouls e sete esqueletos permaneceram vivos. RAM e Save16/F5/Load sintéticos preservaram derrotas/recibos; saída/retorno antes da conclusão não provocou respawn. Sem erros JS/HTTP faltante. [Resultados](evidencias/m02-stonekeep-ilha/resultado.json), [captura em execução](evidencias/m02-stonekeep-ilha/grupo.png).

Geradores independentes do esqueleto, ghoul e pai Rihad reconstruíram os mesmos dados. Mapas008–011, camadas/colisão de012, eventos anteriores, bancos, recompensas e batalha aprovados inalterados. `build-stonekeep-ghoul.cjs` lê `encounter` + `additionalEncounters`, rejeita IDs/eventos/origens duplicados e preserva entradas alheias. Servidor8774 existente manteve-se ativo; arquivos HTTP conferidos contra disco, sem substituir servidor ou limpar dados.

**Limites/próximo requisito:** grupo aplicado e tecnicamente verificado; circulação manual ampliada pode compor a integração de Stonekeep. Sem novo teste no editor/mobile. A rota construída já permite ida, travessia, coleta e retorno; não falta decoração para iniciar **M02-05: entrega do pergaminho na corte**, que ainda deve consumir uma unidade/aposentar fonte legitimamente, registrar recibo, avançar50→60 e revelar Fang Lair uma vez. A cobertura de ratos/lobos dos aposentos continua não implementada: delimitar sua necessidade na rota mínima em M02-05, sem substituição silenciosa nem exigir catálogo de alas opcionais. Não declarar Stonekeep inteira ou M02 concluídos; balanceamento acumulado permanece M02-BAL.

## Histórico — exploração e encontro de ilha V01 (99203b2)


**Aprovação do responsável:** animação de batalha de **8ea06c9 explicitamente aprovada**. Não atribuir aprovação de balanceamento, recompensas ou comportamentos de exploração ao relato. Mestre, atlas e perfil de batalha preservados byte a byte/semanticamente; o registro de aprovação foi atualizado nos metadados, sem reexportar a batalha.

**Um único encontro** `stonekeep.island.ghoul.01`, evento10/Map012, origem **(36,57)**. Referência declarada no original: 39699021.MIF MAP1 `0x803c`, flat60 de STKEEP1.INF=ghoul.dfa, anotação ITEM41, célula MIF(70,18). Projeção existente: vista(19,18), margem2/escala3 → MV(36,57), coordenadas em base zero. [Hash do original, INF e limites](evidencias/m02-ghoul-walk-v01/fontes.json); camadas já decodificadas reutilizadas após conferir o hash do MIF e a leitura do INF no original. Não houve nova observação DOS; os demais guardiões declarados não foram populados.

Patrulha adaptada com raio Manhattan2, intervalo90 atualizações ativas, velocidade3, somente **piso/região4**, colisões nativas, sem água/parede/through. Mesmo núcleo de encontros/contato/lock/persistência; nenhuma perseguição ou agregação. Vitória remove só esse ID, derrota continua game over e fuga permanece desabilitada. Respawn comum continua condicionado à conclusão aplicável e saída; descanso/reentrada antecipada não reativam. Pergaminho continua acessível com o ghoul vivo; fonte e critérios de coleta não receberam requisito de derrotar guardiões.

### Recompensas: fonte e adaptação explícitas

| Campo | Configuração atual |
| --- | --- |
| Atributos/ação/fórmula |65PV,11/5/0/5/10/5 e HIT90%, Atacar: **inalterados**, provisórios; doença/resistências novas ausentes |
| EXP de campanha |**75 provisórios**, escala local acima do esqueleto50. Não conversão direta dos1900–2500 citados na wiki. Avaliar ganho e consumo no M02-BAL |
| Ouro |**24%**, quantidade inteira uniforme **7–70** inclusiva, conforme wiki Monsters PDF5; chance e quantidade são cálculos distintos |
| Item de baixa qualidade |**5%** da fonte, adaptados provisoriamente a **uma** adaga1 ou armadura de couro1 já existentes, com escolha equiprovável entre candidatos. A fonte não confirma esse catálogo específico. Sem itens/variantes raras novos, poções ou livros acrescentados |
| Batalha direta RAM |Continua **0 EXP/loot**, por flag da instância e tabela técnica explícita; não altera temporariamente o banco nem a tabela da campanha |

Uma pequena seleção reutilizável `ArenaLoot.tableForEnemy(enemy)` permite ao adaptador escolher a tabela vazia **somente** na antiga fixture de batalha direta. Sorteio, concessão, reservas e recibos continuam exclusivamente no núcleo de Loot. Encontro de mapa, inclusive no acesso RAM de patrulha, usa a configuração de campanha. Nenhum schema/namespace novo; recibos existentes não são reprocessados. Os sete esqueletos e demais tabelas permanecem inalterados.

### Caminhada e reprodução

Uma folha de12 desenhos, quatro direções/3fases, em `art/masters/stonekeep-ghoul-walk-v01/`. V01 é a geração inicial; uma edição V02 corrigiu **somente a pose neutra sul**, que levantava um joelho. O exportador usa essa célula da V02 e preserva as outras11 da V01; não são variantes do personagem. [Prompts completos/referências efetivamente fornecidas](arte/ghoul-walk-v01/prompt.json), [fontes por quadro/recortes/hashes](arte/ghoul-walk-v01/exports.json). Identidade fornecida: recorte do mestre aprovado de batalha, com postura, pele, proporções e clava preservadas; câmera superior é adaptação nova.

`img/characters/$Arena_ghoul_walk_v01.png`:192×256, células64×64, apoio62 e altura máxima56px, escala única, ordem MV sul/oeste/leste/norte. Sem espelhamento ou animação por translação de uma pose. Neutra ocupa coluna central. Transparência, recortes e leitura inspecionados a1:1 no motor; caminhada/encontro **aguardam avaliação**, sem ampliar grupo. Reconstrução: `python tools/export-stonekeep-ghoul-walk.py`; `node tools/build-stonekeep-ghoul.cjs`. O gerador do esqueleto agora preserva entradas/perfis alheios; reconstruções isoladas e pelo pai preservam o ghoul, sete esqueletos e fonte.

### Acesso e verificações focais

**http://127.0.0.1:8774/** → recarregar sem apagar dados → **Testes / Debug → Campanha e mapas → Stonekeep · ghoul na ilha (RAM)**. Início(40,60), Bretã feminina nível2/adaga e recursos técnicos completos. Observar o ghoul a noroeste; aproximar-se para contato. Vitória remove só ele e usa as recompensas provisórias acima. **Guardar/Carregar teste em RAM** permite checkpoint antes/depois; slots pessoais bloqueados, memória somente da sessão. Reabrir o acesso reinicia a fixture. A opção anterior **Combate → Stonekeep · ghoul (RAM)** continua sendo batalha direta sem recompensa.

[Vídeo≈17s normal](evidencias/m02-ghoul-walk-v01/caminhada-contato-normal.webm), [ilha](evidencias/m02-ghoul-walk-v01/ilha.png), [contato](evidencias/m02-ghoul-walk-v01/contato.png), [atlas1:1](evidencias/m02-ghoul-walk-v01/atlas-escala-real.png), [resultado focal](evidencias/m02-ghoul-walk-v01/resultado.json), [QA de vídeo](evidencias/m02-ghoul-walk-v01/video-qa.json). Chrome156 isolado/origem efêmera; nenhuma partida pessoal. Gravação de canvas nativo30fps, tempo normal, patrulha natural/contato por teclado; decodificação em4x só para inspeção. Sete grupos passaram: geometria/circulação e acesso ao pergaminho; limites controlados de loot7/70 e um equipamento; contato único; um ataque nativo e vitória controlada com recompensa única/remoção; RAM e Save16/F5/Load sintéticos preservando derrota/recibos/recursos; respawn condicionado; padrões0/1/2 nas quatro direções e antiga batalha técnica com0 EXP/loot. Sem erro JS/HTTP faltante. Banco, batalha aprovada, outros mapas e reconstrução conferidos; validador de dados passou.

Não repetidos os testes completos de animação de batalha ou matriz de personagens; game over reutiliza o contrato/cobertura válida de8ea06c9, com canLose=false conferido no contato atual. Nenhum novo teste no editor ou smartphone declarado. Recompensas controladas não comprovam equilíbrio, nem o vídeo de contato comprova todo o percurso. Pendentes: avaliação desta caminhada/posição, demais guardiões e conteúdo da ilha, entrega na corte e avaliação acumulada M02-BAL. **Não ampliar antes da avaliação.**

## Histórico — piloto de batalha V01 (8ea06c9)

Sobre **443e43b**, feature `feature/m02-ghoul-piloto`, preservando dependências ainda não integradas. **Um exemplar de batalha somente**, aguardando avaliação funcional e visual. Sem caminhada, evento de mapa, grupo da ilha, nova espécie, doença ou alteração da fórmula. Não conclui M02-04 nem habilita a entrega do pergaminho.

## Fontes e interpretação

- Manual original instalado, `Docs/Player Guide.pdf`, página PDF88/impressa80, texto e figura de Ghoul conferidos: morto-vivo que se alimenta de carniça, astúcia e possibilidade de transmitir doença pela mordida. Página renderizada com substituições de fontes do leitor; não houve nova execução DOS. Não confundir o texto/figura adjacente de Zombie com Ghoul.
- Wiki local `Arena_Monsters…pdf`, pp.4–5: figura corcunda verde-oliva, braços longos, olhos vermelhos, clava castanha com ponta clara; Vida45–75, dano5–20, EXP=Vida×20+1000 (1900–2500), ouro24%/7–70 e item de baixa qualidade5%. Números da wiki não são equivalências diretas aos parâmetros MV. Nenhuma dessas chances foi ativada neste piloto.
- Consulta **somente leitura** de GLOBAL.BSA, GHOUL1.CFA/GHOUL3.CFA/GHOUL6.CFA e PAL.COL: leitor RLE/bitpacking já existente, incluindo lookup de cada CFA. Foram inspecionados12/8/3 quadros, respectivamente: postura, deslocamento, elevação da clava acima da cabeça e queda. Índices, dimensões, hashes e limites em [sources.json](arte/ghoul-v01/sources.json). Extrações e renders ficam ignorados em tmp/ghoul-review; nenhum arquivo original distribuído.

**Traços preservados:** silhueta curvada, membros longos, pele oliva/ocre, cabeça angular com pequenas pontas na silhueta, olhos vermelhos e clava com ponta clara. Material exato da ponta e detalhes ilegíveis não foram afirmados como canônicos. Acabamento da pele/rosto, interpretação das orelhas e coreografia interpolada são artísticos, preservando o ghoul em vez de substituí-lo por zumbi humano genérico. Manual/doença permanecem referência para decisão futura: sem chance, estado persistente, imunidade ou resistência nova implementados.

## Configuração provisória e isolamento

| Campo | Piloto |
| --- | --- |
| IDs novos | Enemy5 / Troop6; registros anteriores intactos |
| Vida / Mana / Vigor |65 / não possui / não possui; somente Vida na barra inimiga |
| ATQ/DEF/MAT/MDF/AGI/SOR |11/5/0/5/10/5, HIT90%, **provisórios** na escala local; não conversão dos atributos do original |
| Ação |Atacar nativo, interpretado visualmente pela clava; sem habilidade/efeito adicional |
| Recompensas |**0 EXP, ouro e itens somente no laboratório**. Configuração da campanha é recorte posterior, antes de ligar encontros reais; tabela original documentada acima, sem catálogo/raros inventados |

Arena_Ghoul é um consumidor pequeno do preparo existente: ArenaStonekeep.previewMaterials inicia Continuation RAM; após a transferência assíncrona, ArenaBattle.prepare(12) prepara Bretã feminina nível2/adaga, recursos completos, técnicas/magias e poções técnicas já existentes. Batalha nativa Troop6, sem fuga, derrota com game over e vitória retornando a **Map012/(80,39)**, longe do grupo de esqueletos. Nenhum encontro de mapa é criado/marcado/reativado. Nova entrada reinicia a fixture sem depender de drops. Bloqueio de slots normais vem do contrato RAM existente; nenhum save pessoal é aberto ou gravado. Namespace inalterado.

## Arte e reconstrução

Uma geração IA, mestre `art/masters/stonekeep-ghoul-v01/sheet-v01.png`,1536×1024. [Prompt integral e três referências efetivamente fornecidas](arte/ghoul-v01/prompt.json): sprite wiki de identidade, contato original GHOUL3 de proporção/movimento e mestre do esqueleto aprovado somente para acabamento/formato.24 desenhos:6espera/6ataque/6dano/6derrota. Sem variantes ou reutilização de sprite estático com efeito como substituto de animação.

`img/enemies/Arena_Combat_ghoul_v01.png`,1152×512; células192×128, apoio120, altura inicial88px, escala comum. Fonte olha à direita; Arena_BattleUI aplica o espelhamento único do inimigo para olhar à esquerda. Margens/alpha, clava completa, corpo/apoio/retorno foram inspecionados no motor e [quadros reais1:1](evidencias/m02-ghoul-v01/video-quadros.png); os24 recortes e hashes estão em [exports.json](arte/ghoul-v01/exports.json). Detalhes e movimento **ainda não aprovados pelo responsável**.

Reconstrução: `python tools/export-stonekeep-ghoul.py` monta atlas/perfil do mestre; `node tools/build-stonekeep-ghoul.cjs` acrescenta os registros. Chamado no fim do gerador Stonekeep e do pai Rihad, sem remover o ghoul ao reconstruir. Não executar o exportador do esqueleto para preparar este exemplar.

## Avaliação curta

Em **http://127.0.0.1:8774/**, recarregar sem apagar dados → **Testes / Debug → Combate → Stonekeep · ghoul (RAM)**. É o23º acesso, registrado pela API do hub, sem novo comando no título. O serviço existente é preservado; nenhum deploy/Pages feito.

1. Observar espera, escala e orientação. Usar **Atacar**, depois **Habilidades → Estocada pesada — adaga**; avaliar preparação, clava, impacto e retorno.
2. Usar **Dardo de fogo** e observar dano/queda. Vitória volta à passagem, sem repetir batalha e sem EXP/loot. Os sorteios manuais continuam normais; não exigir os danos exatos da gravação controlada.
3. Voltar ao título e entrar pelo mesmo acesso para repetir. **Guardar/Carregar teste em RAM** após a batalha continua sendo checkpoint apenas da sessão; fechar/recarregar perde essa memória, slots pessoais bloqueados.

[Vídeo≈17s em velocidade normal](evidencias/m02-ghoul-v01/combate-normal.webm), [captura](evidencias/m02-ghoul-v01/batalha.png), [atlas1:1](evidencias/m02-ghoul-v01/atlas-escala-real.png), [resultado](evidencias/m02-ghoul-v01/resultado.json), [QA do vídeo](evidencias/m02-ghoul-v01/video-qa.json). Chrome156, motor MV1.6.1, canvas816×624, contexto/origem descartáveis. RNG0,5 apenas no teste automático para ações reproduzíveis; motor/turnos/animações em tempo normal. Decodificação em4x para inspeção não altera o vídeo entregue.

Quatro grupos focais passaram: abertura real/hub/RAM; todos os seis quadros de cada estado, impacto/dano e cobrança única nas três ações; vitória/recibo vazio único/retorno; repetição da fixture e derrota nativa com jogador a1PV. Vigor100→88, Mana50→44; EXP, inventário, ouro e localStorage intactos. Sem erro JS/HTTP faltante. Comparações de dados preservam mapas/quests/fontes/outros inimigos, fórmula/habilidades, hub anterior e reconstrução pelo pai. Validador de dados e formato canônico de plugins preservados. Sem campanha completa ou matriz de personagens. Nenhum novo teste no editor ou smartphone atribuído ao responsável.

Regressão pertinente de registro/isolamento do hub reutilizada: [sete grupos](evidencias/m02-ghoul-v01/hub-regression/resultado.json),23 acessos no hub e só uma entrada técnica no título,22 legados preservados, navegação/retorno e modo desabilitado sem testes expostos. O teste antigo ganhou somente reconhecimento do novo provedor e pasta de evidências opcional; registros aprovados de d800a8f não foram sobrescritos. Não reexecutadas batalhas ou percursos nesse teste.

**Próxima dependência, após avaliação:** caminhada superior e um encontro de ilha com configuração explícita de campanha, em recorte próprio. Não produzir automaticamente grupo/variantes, doença ou novos efeitos persistentes. Balanceamento fica provisório e sujeito a M02-BAL.
