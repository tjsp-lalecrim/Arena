# Arena_BattleUI0.2.0

Plugin próprio Codex após Arena_BattleMotion e MV_BattleSlots; depende dos contratos anteriores de ArenaBattle, ArenaResources, ArenaAbilities e ArenaPersistence. Sem dependências externas, parâmetros do gerenciador ou comandos de plugin. Configuração em data/ArenaBattleUI.json; manter registro canônico em js/plugins.js.

## Composição e convenções

Jogador à esquerda, inimigos à direita. Espelha o corpo do jogador e transforma posição/rotação/escala da camada de arma em conjunto; não espelha os números. Inimigos espelhados para esquerda. Casas por formação e afastamentos dos painéis ficam no JSON. Até três inimigos configurados; formação ausente produz erro explícito. Native setActorHome/setBattler e deslocamentos já controlados por M01-10 não recolocam os participantes no lado anterior. Offsets de dano e mirror dos efeitos nativos acompanham a inversão. O subconjunto distribuído não possui projéteis desenhados; não declarar validação de futuros efeitos direcionais por essa extensão.

Campo usa a ilustração de estudo da cela já aprovada, sem gerar arte nova. É cenário técnico ilustrativo, sem interação com chave/objetos mostrados, sem construir a dungeon final. Dados de participantes/tempos/atlases M01-10 permanecem idênticos. Ícones lineares dos comandos são interface própria desenhada no plugin; não substituem arte de personagens/cenário. Ícones IA existentes de adaga/poção são reutilizados; matizes de poções apenas na apresentação via ImageManager, sem alterar PNGs.

Comandos Atacar/Habilidades/Defender/Itens; nenhuma fuga, talento racial ativo ou aparo novo. Defender é a ação nativa existente. Painel inferior esquerdo e painéis próximos aos corpos leem ArenaBattle.resources; não há cópia persistente dos valores. Recurso existente0 mantém fundo de barra; recurso ausente não aparece. Painéis acompanham dimensões e posições; trocar os recursos de um futuro inimigo exige revalidar sua formação. Conteúdo em cartões com nome/ícone/custo ou quantidade, filtros de técnicas/magias e descrição por seleção. Nome completo aparece na ajuda; rótulo curto dos cartões é configuração, sem renomear banco/regras.

## Atalhos e controle

Seis espaços por padrão; configuráveis1–8. `slotWidth=0` distribui automaticamente; valor fixo precisa caber. Dimensões de painel/comandos/atalhos, colunas2–4/altura dos cartões e ajuda configuráveis, com validação de limites. Testados6/3colunas e8/2colunas na resolução816×624; não prometer qualquer combinação sem inspeção.

Teclado: setas/Enter, Esc cancela, Tab alterna comandos↔atalhos ou filtro das habilidades, C configura,1–8 usa o espaço correspondente quando há entrada de comandos/atalhos. Tab impede mudança de foco do navegador somente em Scene_Battle. Mouse/toque: selecionar e confirmar o cartão/atalho; cabeçalho Configurar abre o fluxo; botão Voltar cancela sem ação. Primeiro toque em um atalho fora de foco mostra descrição; o segundo confirma. Não depende de hover. Configurar: escolher espaço, escolher habilidade/item ou Limpar espaço, Voltar para sair. O seletor permite associar conteúdo conhecido mesmo com custo momentaneamente insuficiente; execução continua bloqueada.

Técnicas são derivadas da arma, magias aprendidas permanecem nativas; livros e itens de missão não entram no seletor de batalha. Categorias são filtros, sem confirmação modal adicional. Se uma categoria estiver vazia, a entrada escolhe uma existente; não se usa automaticamente uma habilidade/item só por abrir a lista. Alvo único é pulado **após solicitação explícita da ação**; vários candidatos mantêm a escolha. Cancelar um alvo vindo do atalho retorna aos atalhos, sem abrir lista redundante.

Persistência usa `ArenaPersistence.setShortcut('battle.1' … 'battle.8', {kind:'skill'|'item',id})` ou null. Sem novo namespace/schema ou índices instáveis de listas. Slots fora da quantidade exibida permanecem salvos. Migração/ausência da estrutura seguem MV_StateStore/Arena_Persistence. M01-09 continua limpando referências de técnicas incompatíveis ao trocar/remover arma ou carregar; não restaurar silenciosamente uma concessão antiga. Magias não são apagadas. Item esgotado mantém a associação, com ×0/indisponibilidade, podendo voltar a funcionar ao obter nova unidade.

`ArenaBattleUI.resolve(ref,actor)` consulta conteúdo/conhecimento/arma/custo/quantidade atuais; `slotId(index)` e `config()` expõem a configuração. Navegação/configuração não chama useItem nem paga recursos. A ação solicitada usa Game_Action/Scene_Battle/BattleManager nativos. Antes de executar, a referência é revalidada; técnicas/magias reutilizam Arena_Abilities/Arena_Resources. Itens também verificam alvos antes do consumo, gerados uma vez e reaproveitados pelo fluxo nativo. Não há segundo consumidor de Mana/Vigor/itens, inclusive com repeats/múltiplos efeitos.

## Extensões e limites

Estende apresentação de Sprite_Actor/Sprite_Enemy/Sprite_Battler, Spriteset_Battle, janelas de batalha e Scene_Battle; inclui guarda de referência/alvos em BattleManager.startAction e prevenção de Tab do Input. As alterações ficam restritas à batalha, exceto o mapeamento de C/dígitos, que não possui ação própria fora dela; a entrada HTML do nome mantém sua proteção anterior. Janelas novas incluem ajuda com quebra de linha, filtros, atalhos, associação e retorno. Relógios, foco, cursores e cache de desenho são transitórios, não dados do personagem.

Map007 ganhou somente o evento de trio(13,8), tropa técnica4 com os três inimigos existentes e reinício explícito junto ao descanso. Restante do mapa/banco preservado por comparação semântica. Nenhuma patrulha, dungeon final, aliado ou alteração de balanceamento.

Testes/evidências e roteiro em INTERFACE_BATALHA_M01_11.md. Validação de autoria no editor é separada do Chrome. Manual do responsável, ergonomia/fullscreen/desempenho no Galaxy A56 e playtest visual NW.js permanecem pendentes; não são inferidos da aprovação R02. A apresentação Arena depende dos contratos/dados do projeto; somente MV_BattleSlots foi validado como núcleo independente.


## Refinamento0.2.0 — R02

REVISAO_INTERFACE_M01_11_R02.md é o relato atual. Indicadores148px sem moldura, nome18/recursos14/barras5; painel228×104 somente na faixa inferior, atalhos588×108 acima dos comandos. Seis espaços mantidos (alternativa oito), agora com nome curto além de ícone/custo/quantidade. MenuChrome desenha tema em instâncias da batalha, incluindo mensagem, sem substituir windowskin global ou carregar dependências/arte externa. Não é gerador de arte nem alteração dos atlases.

`syncArenaPresentation()` concilia comandos/listas/configuração/alvos/execução/mensagens/resultados antes e depois da atualização nativa. `arenaAcceptsInput()` guarda teclas/toque e chamadas adicionais; seletores também consideram visibilidade ao processar entrada. Atalhos/comandos/listas ficam ocultos e inativos durante execução/mensagem/resultado; janela nativa conserva largura integral e confirmação. Ajuda/retorno são passivos. Alvos múltiplos substituem os comandos na faixa inferior; o painel esquerdo continua separado.

Extensão Graphics._updateRealScale limita redução do canvas à viewport pequena (inclusive mapa/game over), mantendo resolução lógica/proporção/mapeamento nativo de ponteiro; não força ampliação ou fullscreen. Corrige o recorte do MV desktop com stretch desligado. Base opaca da batalha cobre restos de snapshot do mapa. Corpo/arma/efeitos/relógios/custos/referências e os18 registros de plugins permanecem iguais a30e441d. Schema persistente não muda.

Validar dimensões/estados/imagens em816×624 e640×480, mouse/toque emulado e regressões nativas. UI continua aguardando avaliação visual do responsável; compatibilidade estática/registro preservado não é novo teste visual no editor ou Galaxy A56. Procedimentos/limites no relatório R02.


## Reuso por M01-12

Exportação aditiva ArenaBattleUI.theme(window) aplica o acabamento às janelas próprias de inventário/equipamentos. Nenhuma outra alteração no fluxo/consumo/disposição da batalha. Os18 registros anteriores permanecem iguais; os dois plugins de M01-12 são acrescentados depois. Regressão nativa da interface preservada.
