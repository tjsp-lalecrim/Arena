# Arena_ArtPreview 0.2.0

Galeria técnica específica de Arena para MV1.6.1, sem plugins externos. Não implementa criação, campanha ou combate. Manter após Arena_Runtime, Arena_TechnicalPreview, MV_StateStore e Arena_Persistence. Usa skin técnica existente. Arquivo: `js/plugins/Arena_ArtPreview.js`.

## Configuração e conteúdo

- Parâmetro `PreviewMap`: inteiro positivo, padrão2; entrada histórica “Amostra anterior”. Nome/ordem/status/parâmetro preservados em plugins.js canônico.
- Entrada “Validação visual R04”: mapa3, nova partida técnica em memória. Não sobrescreve save automaticamente.
- `data/ArenaArtSamples.json` carregado pela fila nativa DataManager em `$arenaArtSamples`, somente leitura: chave=mapId; `legacy` controla legenda histórica; `rat` é nome em img/pictures; `frames` são índices horizontais96×64; `durations` são updates positivos por quadro. Os dois arrays têm mesmo tamanho, índices dentro da imagem. Não são segundos garantidos.
- Perfil2: rato histórico,0/1/2/1,18updates; perfil3: rato R03,0/1/2/3,24/12/8/20updates. IDs e imagens estão no arquivo de conteúdo, lógica Sprite/setFrame reaproveitada. Composição da galeria e piloto são específicas de Arena; não se apresenta como player de combate genérico.

Altera por alias Window_TitleCommand.makeCommandList, Scene_Title.createCommandWindow, Scene_Map.start e Spriteset_Map.createLowerLayer/update. Registra banco auxiliar pela extensão DataManager._databaseFiles, sem editar motor. Imagens carregadas por ImageManager. Bitmap desenha apenas fundo/legendas e máscara opaca, nunca substitui arte IA. Não há comandos de plugin, notas, callbacks de batalha ou novos campos persistentes.

## Escalas e narrativa

Piloto de exploração $Arena_Breton_Pilot144×256/célula48×64, retrato144×144, lateral estática96×96 e ícones32×32 são os exemplos anteriores preservados, ainda provisórios. Não é svActors9×6 nem animação completa. Direção aprovada R02/R03 não se estende automaticamente à piloto/ícones.

Rato R03 usa arquivo384×64 com quatro células96×64; recorte nativo validado no motor. Não confundir trecho de bote com todos os estados de combate. Os quadros reiniciam ao reconstruir cena, sem progressão persistente.

Map003 tem eventos nativos de Ria, conceito da cela e retorno ao laboratório; não altera MQ01. Durante picture1, painel oculto e fundo preto opaco acima do mapa/personagem, abaixo das imagens/mensagens nativas. Ria inteira em720×480, redução93,75% do export768×512; mensagem abaixo. Nenhum protagonista exposto nas margens. Contexto/objetos serão revistos ao implementar os diálogos, sem regeneração desnecessária.

Os assets/mapas anteriores permanecem disponíveis. Map001 continua início normal. Perfil de galeria configura imagens do ator líder apenas nesses mapas; retorno limpa imagens nativas conforme evento. Save/load usa persistência nativa; nenhum item/recompensa concedido. Desativar o plugin remove entradas/painel e deixa mapas/assets; imagens de eventos continuam nativas.

## Evidências e limites

`tools/test-art-integration.cjs`: mapa3,ratocortes0/96/192/288,movimento,colisão,save/load isolado de posição/imagens/HP/recurso,ilustrações e retorno sem avançoMQ01/erros. `test-art-preview.cjs` mantém regressão histórica. Auditoria valida dimensões/hashes/perfis/referências. Pré-teste de viewport Android genérico cabe na tela, mas texto pequeno e testes físicos pendentes. Editor/gerenciador/salvar projeto/reabrir/playtest R04 não executados. Fontes, aprovação, roteiro e matriz em `doc/arte/INTEGRACAO_R04.md`.

## Atualização0.2.1 — legibilidade da galeria atual

No ramo Utils.isMobileDevice e perfil não histórico: cabeçalho28px, legendas primárias26px, etiquetas24px e textos curtos. Desktop/histórico preservados; imagens e quadros sem alteração. `_artUiFontSize` é diagnóstico derivado da apresentação, não dado persistente. Teste mobile emulado valida escala CSS e toque nativo na placa Ria. Nenhuma evidência física A56 ou de combate completo. Relatório `arte/FIDELIDADE_E_VALIDACAO_R05.md` e resultados R05 em evidencias/.
