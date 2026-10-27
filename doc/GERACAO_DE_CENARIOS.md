# Avaliação de geração procedural e templates

Avaliação documental e inspeção do RPG Maker MV 1.6.1 em 25/10/2026. Nenhum gerador foi implementado, instalado ou testado. A solicitação confirma a necessidade de avaliação; as recomendações abaixo não tornam obrigatório gerar todos os cenários proceduralmente.

## Momento da decisão

O responsável definiu que a inclusão deste recurso opcional será decidida nos próximos marcos, após o M01. Esta avaliação permanece como referência; não autoriza implementação imediata nem cria dependência para a demo. Nenhum marco específico foi designado para a decisão.

## Conclusão

O MV permite construir uma solução baseada em templates. Recomenda-se começar com mapas ou módulos autorais reaproveitáveis e, somente em marco posterior quando autorizado, testar geração controlada, mantendo os trechos narrativos essenciais estáveis. Para navegador e mobile, preferir áreas delimitadas carregadas sob demanda a uma cidade ou mundo inteiro em um único mapa.

A recomendação é uma inferência técnica a partir do motor inspecionado e das fontes citadas, não um resultado de benchmark. A viabilidade prática depende de uma prova de conceito.

## O que o motor oferece

O editor possui Generate Dungeon, que desenha salas e passagens ou um labirinto usando tiles de parede e chão. É uma ferramenta de autoria sobre o mapa selecionado: não equivale a um sistema de cidades, interiores e dungeons gerados durante a partida. Pode servir como esboço que depois recebe revisão e eventos. [Manual oficial do MV](https://rpgmakerofficial.com/product/MV_Help/page/01_05.html).

No projeto inspecionado, DataManager.loadMapData carrega data/MapNNN.json em $dataMap; Game_Map.setup prepara o mapa e seus eventos a partir desses dados. Isso oferece pontos de integração para plugins substituírem ou comporem dados antes da inicialização. Não basta alterar somente o desenho: dimensões, tileset, regiões, passabilidade, eventos e transferências precisam permanecer consistentes.

O único plugin listado no projeto continua sendo Community_Basic. Não foi encontrado um sistema de geração instalado. Os arquivos de mapa e os tilesets visuais do protótipo ainda precisam ser criados.

## Alternativas

| Abordagem | Implementação no MV | Vantagens | Limitações | Adequação |
| --- | --- | --- | --- | --- |
| Templates copiados durante a autoria | Duplicar mapas e adaptar tiles e eventos no editor | Simples, editável e fácil de testar | Não gera novidade durante a partida | Melhor ponto de partida para o primeiro marco |
| Seleção entre mapas prontos | Eventos escolhem uma variante existente e transferem o jogador | Pouca lógica adicional e qualidade controlada | Variedade limitada; cada variante precisa de estado próprio | Casas, quartos, pequenas áreas opcionais |
| Montagem por módulos | Plugin conecta salas, corredores, lotes e fachadas com conectores definidos | Variedade com controle artístico | Exige validação de conexões, eventos e persistência | Melhor candidata para geração em runtime |
| Geração por algoritmo de tiles | Plugin calcula salas, ruas ou cavernas e preenche o mapa | Mais variedade estrutural | Mais trabalho de decoração, autotiles, navegação e testes | Experimento posterior, se módulos forem insuficientes |

Copiar um template para vários mapas durante a autoria não é geração procedural em runtime. Selecionar um mapa pronto aleatoriamente também não equivale a compor um novo layout. Registrar qual abordagem cada área utiliza.

## Avaliação por tipo de cenário

| Cenário | Template recomendado | Parte variável | Parte a preservar |
| --- | --- | --- | --- |
| Dungeon inicial | Layout autoral com módulos de sala e corredor reaproveitáveis | Decoração e conteúdo apenas se não afetarem a fidelidade aprovada | Percurso necessário, eventos narrativos, objetivos e saída |
| Dungeons opcionais | Entrada, salas, corredores, escadas e sala de objetivo | Conexões e seleção de módulos sob regras | Caminho viável, chaves acessíveis e objetivo alcançável |
| Casas | Casca de interior por porte e função, com pontos de porta e mobília | Mobília e variantes de moradores conforme o conteúdo | Porta de retorno, circulação e elementos de quest |
| Hotéis | Recepção e quartos com pontos específicos de serviço | Número de quartos e decoração dentro de limites | Interações de descanso e condições verificadas nas fontes |
| Cidades | Bairros ou quarteirões com ruas e lotes conectáveis | Fachadas, interiores e elementos não narrativos | Serviços, acesso aos edifícios, locais e personagens de quest |
| Lojas e edifícios de serviço | Interior por função com pontos de interação | Decoração e configuração de comerciantes | Serviço identificável e acesso ao NPC |
| Outros exteriores | Trechos conectáveis por bioma e pontos de passagem | Vegetação, obstáculos e elementos opcionais | Percurso, entradas e pontos de interesse obrigatórios |

Reutilizar módulos não obriga alterar a geografia original. Antes de variar uma área da campanha, consultar doc/wiki/ e distinguir informação original de liberdade de adaptação. Esta avaliação não verificou em conteúdo quais mapas de Arena são fixos ou procedurais; não assumir que a dungeon inicial deve ser aleatória pela existência de geração no jogo original.

## Contrato mínimo de um template

Definir identificador e versão, categoria, tema, mapa-fonte, dimensões em tiles, tileset e conjunto de assets. Na composição de módulos dentro de um mapa, exigir tilesets compatíveis ou conversão explícita de IDs; não concatenar blocos de tiles de conjuntos diferentes sem mapeamento.

Marcar os conectores com posição, direção, largura e tipo, além de área de passagem livre. Registrar pontos de entrada, saída, NPC, patrulha, loot, cama e objetivo. Regiões ou notas podem servir de marcadores, conforme a implementação escolhida; reservar suas convenções para evitar conflitos.

Separar decoração, dados de conteúdo e eventos reutilizáveis. Referências de mapas, eventos, variáveis e switches não podem permanecer apontando para o template-fonte por acidente. Não rotacionar ou espelhar módulos automaticamente sem converter também direções, eventos, tiles e conexões.

## Estado, seeds e salvamento

Uma seed permite reproduzir um layout quando algoritmo, versão e templates permanecem compatíveis. Ela não substitui o estado da área: baús abertos, loot coletado, portas, inimigos derrotados e quests devem persistir separadamente.

No motor local, self-switches de eventos usam mapId, eventId e letra como chave. Reaproveitar o mesmo mapa de runtime e os mesmos IDs para várias casas ou dungeons pode fazer o estado de uma instância contaminar outra. Projetar identificação estável por área/instância e evento, ou uma tradução explícita dessas chaves.

DataManager.makeSaveContents não inclui $dataMap diretamente entre os conteúdos salvos. Salvar apenas alterações temporárias nesse objeto não garante reconstrução do mapa gerado ao carregar. O plugin deve persistir layout ou os dados suficientes para reconstruí-lo, mais as alterações de estado, e integrar isso ao carregamento.

Recomenda-se gerar uma área na primeira visita e preservá-la durante a partida. Não regenerar ao retornar de batalha ou ao carregar um save. Esta política permanece proposta até a especificação da feature. Mudanças de versão dos templates exigem estratégia de compatibilidade ou manutenção do layout já salvo.

## Integração com os requisitos do projeto

- Inimigos visíveis precisam nascer em áreas válidas e executar patrulhas compatíveis com o layout; não iniciar batalhas ao surgir sobre o jogador ou na saída.
- A vitória retorna ao mapa sem gerar novamente a área nem duplicar inimigos ou recompensas; fuga permanece inicialmente desabilitada.
- O loot respeita as seis categorias, a coleta automática e o limite de um equipamento por loot de LOOT.md. Gerar uma sala não concede novamente recompensas já coletadas.
- Quests apontam para identificadores estáveis, não apenas coordenadas que mudam a cada geração.
- Camas só aparecem como pontos de recuperação onde houver regra de descanso válida, observando a wiki.
- Tiles, fachadas e interiores seguem DIRECAO_DE_ARTE.md. A IA gera a arte; as regras do mapa e a montagem são implementadas e validadas pelo jogo ou pelas ferramentas de autoria.

## Navegador e mobile

Evitar depender de gravação em arquivos do projeto durante o jogo. Usar dados de templates distribuídos com o jogo e o mecanismo de persistência apropriado ao destino.

Limitar tamanho das áreas, eventos ativos e tentativas de geração. Preferir carregamento por partes, pré-carregamento controlado dos assets necessários e limite de tentativas com layout de fallback validado. Medir tempo de geração, transição, memória e fluidez nos dispositivos-alvo, sem prometer desempenho antes dos testes.

## Referências externas de viabilidade, sem adoção

A documentação do autor de Random Maps para MV descreve geração com snippets, templates, seeds e organização de salas, incluindo categorias de cidade e vila. É uma referência concreta de que a abordagem modular pode ser implementada no ecossistema do MV. [Documentação de comandos MV](https://aerosys.blog/eventing-rpg-maker-mv), [composição por snippets](https://aerosys.blog/create-random-dungeons-with-snippets), [persistência por seed](https://aerosys.blog/persisting-your-world).

O repositório randomdungeon também se apresenta como código de geração procedural para MV. Seu conteúdo e compatibilidade não foram auditados nesta avaliação. [Repositório do autor](https://gitlab.com/sb-rpgmv-plugins/randomdungeon).

Pela diretriz posterior do responsável, os plugins do projeto devem ser desenvolvidos pelo Codex. As fontes externas acima servem somente como referências técnicas de viabilidade. Não instalar, comprar, copiar ou adotar esses plugins como dependências.

A geração deve ser implementada em plugin próprio, com dados de templates separados da lógica reutilizável, seguindo PLUGINS.md. Validar no MV 1.6.1 e nos destinos navegador/mobile, incluindo persistência, eventos e limites de desempenho.

## Prova de conceito recomendada

1. Criar templates de entrada, sala e corredor com o mesmo tileset, além de um interior de casa e um trecho de rua. Usar arte provisória compatível com o guia.
2. Produzir duas áreas distintas a partir dos mesmos módulos, com entrada e saída alcançáveis e sem sobrescrever os templates.
3. Adicionar um inimigo em patrulha, uma porta, um recipiente de loot e um objetivo de quest de teste.
4. Sair, retornar, vencer batalha e salvar/carregar: verificar layout, posições e persistência sem duplicação de recompensas ou contaminação entre áreas.
5. Testar seeds repetidas e diferentes, conectores inválidos, área sem solução e limite de tentativas com fallback.
6. Medir a experiência em navegador desktop e em um dispositivo mobile de referência. Registrar dispositivos, tamanho do mapa, número de eventos e resultados.

Só ampliar para cidades compostas ou numerosas áreas após essa validação. A introdução e dungeon inicial não precisam esperar um gerador completo: podem utilizar templates na autoria enquanto a geração em runtime é avaliada numa feature própria.

## Decisão recomendada e próximo passo

Adotar templates como método de autoria desde o início. Para runtime, priorizar uma prova de conceito de montagem modular, sem compromisso de proceduralizar a campanha inteira. A aprovação final da abordagem depende dos testes e da comparação de custo com variantes de mapas prontos produzidos para o projeto.

Seguir Git Flow: a avaliação documental integra a feature de documentação; uma futura prova de conceito deve usar feature/geracao-cenarios, a partir de develop. Documentar qualquer plugin conforme PLUGINS.md. Nenhuma branch ou alteração no jogo foi realizada nesta avaliação.

## Orientação válida para futura dungeon

Padrão visual inicial confirmado:1 tile de teto,2 tiles para altura visual de parede e corredores com3 tiles de largura livre. Sujeito a avaliação nos testes. Separar altura visual de colisão/área caminhável. Preservar exceções locais do original, documentando motivo e resultado. Usar mapas da wiki e, quando possível, estrutura/posições dos eventos do original para salas, corredores, portas, objetos e eventos. Não substituir o layout por dungeon genérica gerada automaticamente. A regra não autoriza antecipar M01-14 nesta rodada.

## Convenções obrigatórias de cenário — M01-14 R02

Porta é vão na faixa de parede: teto/cap separado de1tile, face de2tiles, apoio inferior e orientação explícita norte/sul/leste/oeste. Nunca pintar teto dentro dos quadros da porta. Arte pode ocupar vários tiles; collider é contrato independente e não cresce com a imagem. Quatro direções exigem perspectiva/iluminação próprias, sem espelhar por conveniência. Estados fechado/intermediário/aberto compartilham enquadramento, escala, jambas e pivô. Verificar envelope ocupado antes de fechar e inspeção do personagem nas duas extremidades. Correntes/nichos são estáticos, com vistas próprias, ancorados à massa mural; chão e tesouro usam perspectiva superior e apoio no piso.

Água animada deve repetir sem emendas e usar A1 nativo quando adequado; imersão visual deriva de região explícita, não autoriza andar por toda água ou obstáculo. Não mudar Vigor em exploração. Tesouro baseia-se no original: saco/moedas/tecido/peças, sem brilho de raridade futuro. Arte nova e recortes R02 estão em revisão; aprovação da base4161615 registrada em arte/DUNGEON_M01_14_R02_PROMPTS.json. Os recortes inspecionados devem ser registrados na origem, pois a ferramenta pode não respeitar a grade solicitada. Limites/candidatos em DUNGEON_M01_14_R02.md. Sem ilustração narrativa do protagonista.
## Diretiva vigente R03 — ortogonal

DIRETIVA_DE_MAPAS.md consolida as regras verificáveis e prevalece sobre as simplificações R02. Não usar portas/correntes com alvenaria incorporada nem vistas oblíquas/isométricas. Componentes separados de geometria; âncoras e dobradiças invariantes; projeções frontal e superior lateral próprias. Objetos de parede somente em face desenhada válida, sem flutuar no vazio; plataformas independentes sem parede traseira; tesouros RGBA em escala opaca de44×30–34px. Prompts/masters/limites em arte/DUNGEON_M01_14_R03_*.json e relatório DUNGEON_M01_14_R03.md. Sem aprovação automática de encaixes, alterações de recursos ou narrativa do protagonista.