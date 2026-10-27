## Revisão M01-14 R02 — 27/10/2026

Responsável aprovou direção gráfica e fidelidade estrutural da base disponível4161615. R02 revisa portas/objetos/água; a aprovação da base não se estende automaticamente às variantes novas. Planta preservada. Portas com quatro vistas/três estados, tesouros inspirados no arena_loot, água A1 própria e natação restrita ao mapa8/região2, sem custo/regeneração de Vigor. Fontes, contratos, testes e limites em DUNGEON_M01_14_R02.md. M01-14 permanece em validação: captura do editor falhou novamente; autoria no MV e A56 físico não verificados. Sem merge ou avanço de backlog. Estados operacionais anteriores abaixo são históricos quando divergirem desta revisão.

# M01-14 — Masmorras Imperiais em exploração superior

26/10/2026. Feature **feature/m01-dungeon-inicial**, de develop **4c612ae**, após integrar/publicar M01-13. Numeração preservada. Loot: aprovação do responsável limitada ao menu no estado disponível2b0f0dc; destaque de raros fica futuro, sem implementação. Critérios funcionais anteriores revisados separadamente; fechamento76eae98 integrado. Main/release preservadas.

**Estado: mapa navegável implementado e verificado no navegador; M01-14 permanece em validação.** A abertura/edição do novo mapa no editor não foi concluída por falhas da automação. Não marcar o item inteiro como concluído nem iniciar M01-15. Avaliação de escala/acabamento/complementos pelo responsável também permanece pendente. Não atribuir a aprovação do loot ao mapa.

## Fontes realmente consultadas

- Instalação original: ARENA/START.MIF,50×50,2328bytes; cópia tmp/original-review/START.MIF comparada por hash. START.INF já extraído de GLOBAL.BSA em consulta anterior foi relido: paredes, flats, chave, correntes, itens e criaturas. Fontes binárias, paletas/texturas e decoder de consulta continuam **somente em tmp ignorado**, fora do jogo distribuído. Nenhum arquivo original/mod foi alterado. Não foi executado DOSBox nesta rodada; ler dados não comprova o comportamento do executável.
- Wiki local **Arena_Imperial Dungeons (quest)…pdf**, imagens das pp.3/5 inspecionadas; p.3 tem planta300×300 em grade50×50. **MQ01_ESPECIFICACAO.md** e documentos de arte/personagem/persistência/loot/backlog. Referências efetivamente abertas em doc/prints: imperial dungeons map.png, imperial dungeons07.png (plataformas e texto de descanso), imperial dungeons exit.jfif. Master aprovado dungeon-identidade-r02 também inspecionado.
- Consulta técnica primária ao projeto OpenTESArena: Assets/MIFFile.cpp, Compression.h, ArenaTypes.cpp/MIFUtils e World/MapGeneration.cpp. URLs públicas e hashes no manifesto. Auxiliou leitura de MHDR, MAP1/FLOR, compressão type08, unidades128 e interpretação de plataformas/portas/flats. Código auxiliar e downloads somente em tmp; **nenhum decoder original/terceiro ou dependência OpenTESArena foi incorporado aos plugins do jogo**. Não é substituto de teste do Arena DOS. Não foi necessária consulta ao Battlespire.

## Planta, evidência e divergências

A classificação interpretada de START.MIF foi refletida horizontalmente para a orientação superior leste/direita e sudoeste/esquerda do mapa da wiki. A grade documentada tem50 linhas de50 células;1005 células transitáveis conectadas com portas abertas. O teste de correspondência raster amostra o centro das2500 células da planta da p.3: a classificação gráfica de massa mural versus rede/canais/portal coincide em2500/2500 após a interpretação das camadas. É evidência de **planta**, não prova de cada colisão/altura/comportamento 3D. A colagem comparativa com o original fica em tmp/original-review/comparacao-mapa-m01-14.png (ignorada); visão geral do mapa próprio em evidencias/m01-14/visao-geral.png.

Divergência importante: MAP1 tem blocos sobre canais WET_CHASM da FLOR13. Bloquear todos em2D apagava partes da rede azul da wiki. A representação preserva os canais da camada inferior, achatando-os em água rasa transitável. As posições concordam com a planta; a passagem sob blocos/altura da água no executável DOS não foi testada. Não importar natação, afogamento, queda ou bônus aquáticos adicionais. Plataformas viram piso elevado visualmente, transitável, sem cama/descanso livre.

| Ponto | Dados originais consultados | Grade orientada da planta | MV(tiles) |
| --- | --- | --- | --- |
| Início | cabeçalho192/128,3392/128 →1,5/26,5 | célula48,26 |148,82 |
| Chave | FLOR em3,20: flat6→índice5/key.img sobre plataforma |46,20 |142,64 |
| Porta da cela | LOCK em4,23 e porta MAP1 nessa célula |45,23 |139,73 (door.07) |
| Shift Gate | abertura terminal na planta; célula singular46,48 no MIF |3,48 | visual13,148; contato13,145 |

A especificação M01-02 citava chave(3,19)/porta(4,21) de referência textual. Os dados locais consultados apontam3,20/4,23 e a planta confirma os pontos acima. Registrar as duas evidências; esta representação usa a grade do arquivo local e sua correspondência com a planta, sem corrigir silenciosamente o texto histórico. A posição do portal é corroborada pela planta; o nome de textura sozinho não foi usado como prova de associação de código. Origem do MIF e eixos do MV são distintos, não somar coordenadas sem conversão.

## Escala e construção

Transformação fixa: **MV x=3+3×x_da_planta+1, y=3+3×y+1** para centros, mapa156×156, margem sólida3. Cada unidade da planta tem3×3 tiles, mantendo proporções, salas, ciclos, corredores, canais e becos. Essa escala permite corredor mínimo de3 tiles sem dilatar corredores independentemente ou fundir paredes/atalhos. Não se afirma equivalência métrica1:1 com Arena. Salas maiores mantêm os múltiplos originais; não foram todas reduzidas a largura3. Tamanho e tempo de percurso são adaptação inicial para avaliação.

Faixas voltadas ao jogador: **1 tile de teto/cap +2 tiles de face de parede**, desenhados dentro da célula sólida, sem invadir a faixa livre. Toda a massa sólida continua colidível; interior não representado é vazio escuro neutro, não textura de piso. Laterais/cantos têm cap de1tile na borda e massa sólida oculta em vez de projetar uma face sobre o caminho; as faces de2tiles são a projeção frontal sul, como adaptação da perspectiva superior. Piso, teto, face, água e plataforma são materiais separados. Colisão usa flags nativas do tileset; altura visual não redefine a área caminhável. Regiões de diagnóstico:1sólido,2água,3plataforma,4piso; **não são mapa-guia do jogador**.

14 portas ocupam os vãos originais. Cada uma tem9 partes gráficas,3 eventos na seção transversal colidem quando fechados; ao abrir, todas as partes usam self-switchA/through nativos. Vão aberto conserva3 tiles livres. Orientação de colisão deriva dos vizinhos da planta. Arte frontal compartilhada é simplificação, sem animação própria de abrir/fechar e sem reproduzir todos os tipos secretos/deslizantes originais. Painéis secretos aparecem como portas técnicas visíveis nesta etapa. Travas/chave/consumo pertencem a M01-16. Gate é superfície terminal sólida com ponto de contato na frente: não há passagem para fora dos limites, cidade ou M02.

Map008/Tileset4 novos. Mapas1–7 e fluxo de nova campanha inalterados. tools/build-dungeon-map.py **compila um layout estático autorado**, sem sorteio/procedural em runtime. doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json é transcrição interpretada/adaptada para construção e auditoria; não contém MIF, texturas, sprites ou código original. tools/render-dungeon-overview.py exporta só prancha offline de revisão; nenhum mapa-guia/bússola foi adicionado ao jogo.

## Arte e complementos

Piso/lajes e alvenaria R04 aprovados reutilizados integralmente; sprites de raça/gênero/animações não foram alterados. Uma geração IA criou apenas atlas complementar v01 (1536×1024): cap, porta, Gate quadrado azul, água, plataforma e nicho/correntes. O azul do portal segue o print do Arena, não fantasia genérica verde. Prompts completos, duas referências efetivamente fornecidas e hashes em arte/DUNGEON_M01_14_PROMPTS.json. Master preservado em art/m01-14; atlas nativo768×768 em img/tilesets/Arena_Dungeon_M14.png, montagem técnica recorta/reduz painéis e materiais anteriores.

Chave é recorte do master de arquitetura aprovado; marcadores de tesouro reutilizam dois ícones IA existentes em pequena pilha, **não figurino/prop final novo**. Correntes foram colocadas em parede sólida adjacente ao marcador original para não obstruir piso; orientação dessa decoração é adaptação artística. Espaço escuro da massa sólida é limpeza neutra, sem desenhar arte arquitetônica por código. Complementos/recortes/perspectiva frontal e repetição dos materiais ainda dependem da avaliação do responsável no tamanho real. Não há ilustrações narrativas novas nem representação narrativa do protagonista.

## Integração preparada, sem antecipação

- Início/figura criada: título técnico usa piloto; menu do laboratório permite explorar com a identidade atual. Não transforma piloto em personagem obrigatório da campanha.
- Chave e15 pontos de tesouro têm marcadores/eventos nas posições do arquivo. Interação informa reserva para integração de fonte/quest, **sem conceder itens ou loot** agora.
- Dados de marcadores de criaturas e plataformas estão em ArenaDungeon.integration para M01-15/16/17. Não há inimigos/patrulhas/contato de combate no mapa nesta entrega. Não confundir marcadores de flats com comprovação de espécies/aleatoriedade no executável.
- Porta da cela abre tecnicamente por Enter/toque, sem exigir/consumir a chave; vínculo narrativo virá em M01-16. Portas abertas persistem em self-switches nativos, sem novo schema ou ledger.
- Gate mostra mensagem de chegada técnica, sem concluir quest/recompensar/exibir narrativa final: integração M01-18. Não fecha a demo falsamente.
- Fontes não confirmam cama na área. Plataformas não restauram recursos; descanso/cama elegível continua M01-17, sem inventar uma cama para preencher o mapa.

## Como testar

Título → **Explorar dungeon** abre um teste separado, cria piloto e transfere ao início148,82. Com personagem já criado, no laboratório7 usar menu → Explorar dungeon. Setas/clique usam deslocamento nativo em grade; Esc abre menu e salvar. Seguir para norte até a chave142,64, oeste à porta139,73, interagir para abrir e explorar a rede ao oeste/sul. O portal está no sudoeste, contato13,145. Todos os caminhos estão presentes, mas não há mapa-guia dentro do jogo.

Menu → **Voltar ao laboratório** retorna ao mapa7 sem resetar recursos/identidade/equipamentos; reentrar preserva portas. Salvar/carregar no mapa8 preserva posição e portas. Usar saves técnicos separados, não saves pessoais para validar esse cenário. No editor, reabrir Game.rpgproject para recarregar arquivos e selecionar **M01-14 Masmorras Imperiais**; conferir Tileset4, regiões/camadas, eventos e salvar/reabrir. Essa última sequência ainda necessita validação manual pelo impedimento abaixo.

## Testes e pendências

Executados em Chrome/contextos descartáveis:6 cenários de entrada nativa, caminhada à chave, porta da cela fechada impedindo acesso ao portal/abertura por ação nativa,9045 tiles de piso/água/plataforma (todos alcançáveis no flood nativo com portas abertas) e15291 sólidos,14 portas, percurso nativo até Gate, limites, save/load20 e retorno/reentrada no laboratório. Velocidade6 só na automação para percorrer a rota, restaurada4; sem atravessar paredes/teleportar a rota. Snapshots preservam identidade/recursos/inventário/quest/loot, sem concessões precoces. Validador estático confirma1005 células conectadas,3×3 piso,1cap+2face, mapas/dados/motor/arte anterior preservados,23 plugins/22 anteriores. Regressões de loot11 e persistência27 separadas em evidencias/m01-14, sem sobrescrever evidências históricas.

**Editor:** janela e diálogo Abrir Projeto acessíveis, mas captura falhou duas vezes (window capture timed out) e elementos Nome retornaram not available in cached app state. Atalhos/foco não permitiram confirmar carregamento/edição/salvamento do novo Map008 com segurança. Não houve save, descarte ou restauração indiscriminada de arquivos do editor. Última leitura ainda apontava diálogo de abertura; fechar manualmente/reabrir projeto para conferir. **Abertura e edição do Map008, gerenciador com Arena_Dungeon, salvar/reabrir e playtest visual NW.js permanecem pendentes**, sem usar Chrome como prova. Isso impede concluir integralmente M01-14. Evidência da tentativa em evidencias/m01-14/editor.json.

Galaxy A56 físico/fullscreen/ergonomia/desempenho não testados. Escala/material/decoração e representação achatada da água exigem avaliação do responsável. Estrutura binária/planta corroboram a fidelidade; não alegar replay do Arena DOS ou transcrição de colisão/elevacão3D exata. Sem merge desta feature em develop/main e sem M01-15 nesta execução.

Edição futura: o compilador grava Map008 por inteiro a partir das fontes estáticas. Antes de recompilar após edição manual no MV ou inclusão de quests/patrulhas, sincronizar o layout/compilador com as mudanças válidas e revisar o diff; não sobrescrever eventos futuros por conveniência.

Revisão de implementação f16c254, arte13161bc; fontes/hash/ambientes em evidencias/m01-14/fontes-testadas.json. Não confundir testes de geometria no navegador com autoria no editor.
