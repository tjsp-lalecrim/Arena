# M01-11 — interface de batalha em slots e atalhos

Estado atual: REVISAO_INTERFACE_M01_11_R02.md registra a revisão de composição/transições a partir de30e441d. Combate/animações atuais aprovados pelo responsável; UI R02 aguarda avaliação visual. Evidências R02 separadas em evidencias/m01-11-r02. Relato R01 abaixo preservado como histórico, incluindo seus limites e aprovação à época.

26/10/2026. Base develop **f37018d**, integração autorizada/publicada de M01-10 somente após concluir a expansão R03. Feature própria **feature/m01-interface-batalha** para revisão, sem integração automática em develop/main ou release. A aprovação manual R02 de a61977b continua limitada à Bretã feminina/rato; não é aprovação da interface nem das novas variantes. Detalhes de M01-10 em EXPANSAO_COMBATE_M01_10_R03.md.

## Funcionamento

Jogador à esquerda voltado para direita; inimigos à direita voltados para esquerda. Corpo/arma são espelhados em conjunto, incluindo pivô, rotação, efeitos nativos e offset dos números de dano. Raiz continua estável conforme M01-10; nenhuma configuração nativa a repõe no lado anterior. Atlases e temporizações aprovados não foram alterados e nenhuma geração artística foi feita para M01-11.

Campo amplo com estudo da cela R02 aprovado reaproveitado como cenário técnico. Não é o mapa final ou um novo layout de Imperial Dungeons. A chave e demais objetos pintados não são interativos nem concedem itens. Nomes/barras perto dos participantes e painel compacto no canto inferior esquerdo consultam diretamente recursos reais. Vida/Mana/Vigor existentes continuam visíveis em0; os três inimigos distribuídos têm somente Vida, sem inventar Mana ou Vigor/TP. Uma fixture de Mana esgotada confirma sua apresentação quando o recurso existe.

Atacar/Habilidades/Defender/Itens por ícones; nenhuma fuga/Recuar, talento racial ativo ou aparo especial. Defesa é a nativa. Cartões de técnicas/magias com ícone, nome e custo; itens com ícone, nome e quantidade. Ajuda contextual acompanha seleção por teclado/mouse/toque. Nomes completos ficam na ajuda, rótulos curtos nos cartões são apresentação. Ícones lineares são UI própria; adaga/poções IA existentes foram reutilizadas com matiz de apresentação para os recursos, sem regravar os arquivos aprovados.

Categorias de habilidades são filtros diretos por Tab ou toque, com contagem atual. Categoria sem conteúdo não exige etapa extra; abrir a lista não usa automaticamente seu único conteúdo. Alvo único é escolhido automaticamente **depois de solicitar a ação**; com vários inimigos há seleção real. Cancelar volta à escolha pertinente, inclusive ao atalho de origem.

Atalhos usam referências estáveis `{kind,id}` em battle.1–battle.8 pelo contrato de persistência anterior. Seis por padrão, configuráveis1–8; dimensões/colunas/altura no JSON. SlotWidth0 distribui; tamanho que não cabe é rejeitado. Configurar/limpar não executa ações ou paga recursos. Troca/remoção de arma mantém o comportamento M01-09: técnicas incompatíveis são limpas dos atalhos; magias aprendidas permanecem. Item esgotado conserva referência ×0/indisponível. Recursos insuficientes desabilitam a execução; a disponibilidade é resolvida pelos dados atuais, sem lista congelada.

Mana/Vigor/itens continuam nos consumidores anteriores/nativos. Revalidação de referência antes da execução e de alvos de itens antes do consumo, sem gerar alvos duas vezes; técnicas/magias reutilizam a guarda Arena_Abilities. Nenhuma segunda cobrança, inclusive em ação repetida. Banco de habilidades/itens/armas/inimigos/bônus e motor preservados.

## Como testar

1. Abrir Game.rpgproject no MV ou executar o projeto por servidor local no Chrome. No título, **Combate técnico (piloto)**; **Novo participante(3,8)** permite outras raças/gêneros, sem alterar a campanha.
2. Preparar treino(3,5), ficar abaixo do rato(7,5) e Enter/toque. Kit técnico inclui arma/poções/magias; não é inventário inicial da campanha. Goblin(6,8), homem-lagarto(10,8) e novo **Trio técnico(13,8)** usam encontros controlados. Descansar/reiniciar(11,5) libera explicitamente todos esses encontros; vitória não reinicia o contato sozinha.
3. Usar setas/Enter ou selecionar/confirmar com mouse/toque. Habilidades: Tab ou filtro à esquerda alterna técnicas/magias. Esc, botão Voltar ou botão direito cancelam. Conferir descrição e custos antes de confirmar; selecionar/navegar não deve gastar.
4. C ou **Configurar [C]**: escolher espaço, confirmar, escolher habilidade/item ou Limpar espaço. Voltar encerra. Na entrada principal,1–6 usa o atalho; Tab dá foco à barra. Por toque, primeiro toque no espaço fora de foco exibe a descrição, segundo confirma. Testar também o botão Voltar em listas/configuração.
5. Verificar técnicas leves/pesadas, magia, defesa, poção, quantidade0 e recursos insuficientes. Fora da batalha trocar/remover arma e iniciar outro encontro: técnicas antigas não podem ser utilizadas, magia deve permanecer. Salvar/carregar no mapa deve preservar associações, recursos gastos, aprendizado e inventário.
6. Trio: conferir que nomes/barras não se sobrepõem, escolher inimigo por teclado/toque e cancelar sem custo. Observar orientação e arma durante antecipação/impacto/retorno, gestos de magia/poção, dano e derrota.

Não usar saves pessoais para o roteiro técnico. Vencer concede EXP provisória nativa; escolhas de máximos continuam na interface M01-08 fora da batalha. Não há descanso durante combate.

## Evidências e limites

Evidências em **doc/evidencias/m01-11/**: principal/habilidades/magias/inventario/atalhos-configurados/tres-inimigos; variantes *-canvas recortam somente o canvas816×624. Vídeo combate-slots.webm é gravação do canvas nativo, não replay de atlas; sua decodificação/inspeção é registrada separadamente. Snapshots SHA identificam arquivos testados. Capturas com HP3000+ são fixtures de duração, não novo balanceamento. As quatro capturas em apresentacao/ usam os valores originais do rato (18 PV), canvas816×624, sem ação ou custo durante a captura. preview-combate-slots.gif deriva dos87 quadros efetivamente decodificados do vídeo, mantendo seus tempos em prévia408×312 (o WebM/capturas mantêm816×624); video-inspecao.png mostra12 amostras desses pixels, sem remontar o atlas.

`test-battle-slots.cjs`: fluxo Scene_Battle real, navegação/cancelamento/configuração sem custos, técnicas5/6, Dardo10 e Cura9, defesa2, poção2, insuficiência, exatamente um débito com repeats2, estoque esgotado após seleção, item sem alvos sem consumo, invalidação por arma, recursos/atalhos/save-load após vitória, três inimigos/seleção/cancelamento de comando e atalho, barras ausentes versus existentes0, derrota/game over. RNG0,5/variância0/HP ampliado/alteração controlada dos recursos ficam só em memória/contextos descartáveis. A fixture de reposição usa APIs de recuperação e valores técnicos; não torna rest utilizável na batalha.

`test-battle-slots-category.cjs`: correção final isolada do fallback (fontes-testadas-categoria.json; demais capturas/suítes identificadas por fontes-testadas.json), fixture de habilidades com somente magias, abertura direta da categoria válida sem etapa vazia, cancelamento sem custo e restauração das técnicas.

`test-battle-slots-pointer.cjs`: mouse desktop1100×800 e toque Android genérico emulado916×412, sem hover obrigatório, filtro, Voltar/configuração/associação/ação nativa;6 espaços/3 colunas e alternativa8/2 somente em memória. Toda a área do canvas deve caber na viewport e todo ponto de toque deve estar dentro dela. Emulação final: canvas538,77×412, ajuda cerca de16,51px CSS, espaço cerca de61,4px CSS. Não é teste físico do Galaxy A56; barras laterais preservam proporção4:3. Ergonomia dos controles menores, fullscreen e desempenho no aparelho continuam para validação física/M01-19.

Regressões de combate nativo, habilidades628/192 ações raciais, recursos619, criação234, bônus981 e persistência27 têm saídas próprias em regressoes/. Validadores incluem geometria pura sem Arena, variantes de configuração, UTF8/ausência de caracteres corrompidos,18 plugins/16 registros anteriores idênticos, mapa/tropas originais preservados com somente trio/reinício, arte/tempos/regras/motor inalterados.

Problemas encontrados durante a validação: correção da codificação de textos novos, altura interna do botão Voltar e identificação Android na emulação (o modo desktop podia recortar o canvas). Os testes agora verificam limites de viewport e pontos de toque, não apenas cliques sintéticos que alcançam área fora da tela. O roteiro antigo de batalha passou a aguardar transferência/mapa/jogador ativos antes de interagir. Uma fixture tentava descansar durante a batalha; foi corrigida para respeitar a API que proíbe isso, sem mudar o produto. Execuções com timeout não são evidência de aprovação; somente resultados finais bem-sucedidos são usados.

Autoria MV em editor.json: abrir, gerenciador/detalhe Arena_BattleUI ON, salvar, fechar, reabrir nova janela e salvar;18 registros semanticamente idênticos/canônicos/UTF8 sem BOM. Somente System.versionId mudou semanticamente. Isso não é inspeção visual de playtest NW.js. Testes manuais do responsável continuam adiados; não há aprovação manual desta interface ou das variantes R03. Balanceamento segue provisório e sem alterações. Não foram iniciados M01-12, patrulhas, aliados ou dungeon definitiva.

Consulta exclusivamente de leitura ao Battlespire está em CONSULTA_PONTUAL_INTERFACE_M01_11.md; orienta composição/interação, sem autoridade normativa, importação de regras/arte/dependências ou cópia integral.
