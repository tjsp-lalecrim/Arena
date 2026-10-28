## Continuidade R03

Correção visual R02 aprovada pelo responsável, estado disponívelbd108c5. Nova proteção de entrada de menu em PROTECAO_POCOES_M01_17_R03.md, sem alterar as barras, recuperação, combate ou descanso. A aprovação não cobre automaticamente essa implementação posterior; textos históricos de avaliação visual pendente abaixo foram superados somente no escopo do feedback R02.

# M01-17 R02 — feedback visual de poções (28/10/2026)

Mesma feature/m01-pocoes-descanso, base35ba624. Responsável confirmou que o uso de poções funcionou; tipos, roteiro, ambiente e versão exata não informados. Estado disponível associado35ba624. Evidência em evidencias/m01-17-r02/confirmacao-responsavel.json. Não atribuir aprovação do descanso, persistência, todos os casos de consumo, editor/dispositivos ou da nova apresentação R02.

## Composição e funcionamento

Arena_Inventory0.3.0 usa o quadro existente336×200 no canto inferior direito, sem acrescentar painel. Nome, Vida/Mana/Vigor com valores atuais/máximos e barras, seis atributos em duas colunas e identificação de armadura. Fontes de nome20 e atributos16 preservadas; rótulos/valores das barras18 e material13. Barras ocupam a área das miniaturas anteriores, retiradas apenas desse quadro: aparência, animações e visualização real no mapa/combate continuam inalterados. Ícones de equipamentos e comparação não mudam.

Valores reais e quantidade atualizam no commit nativo, antes da animação. Slots redesenhados imediatamente, inclusive remoção da entrada esgotada. Preenchimento é apenas representação transitória interpolada em240ms. Se outro uso ocorre antes do fim, redireciona do preenchimento atual ao novo valor real; não acumula callbacks e nunca sobrescreve dados. Máximos respeitados: teste98→100 representa2 pontos, não50. Números mostram o estado real imediato; só a extensão da barra acompanha a transição. Navegação/cancelamento não esperam a animação. Reabrir ou carregar reconstrói a apresentação já no estado real, sem tween antigo ou namespace de save adicional.

Arena_Recovery0.2.0 retira o texto “utilizada/restam/recursos restaurados”. Após sucesso, mantém a descrição estática do item atualmente selecionado (incluindo finalidade/custo de decisão); isso não é uma notificação de recuperação. Quantidade não é mais repetida na descrição geral. Mensagens de impedimento, como recurso cheio/item preservado, permanecem necessárias. Sem popup nem duplicação com combate, cujo feedback/código não foi alterado. Recuperação e consumo continuam APIs existentes; sem mudanças de valores, raridade, regras raciais, regeneração ou descanso. Cadastros, Map005/008 e formato/conteúdo de plugins.js preservados integralmente.

## Evidências executadas

- test-potion-feedback.cjs:5 grupos com efeitos nativos, Vida/Mana/Vigor, sequência durante animação, estado real imediato e quantidade efetivamente desenhada, limite máximo, estoque esgotado, recusa de uso cheio, teclado/mouse/toque, geometria de todas as linhas, saída durante apresentação e save/load17 descartável. Lista vazia mantém barras/contexto sem crash. Vídeo do canvas real em recuperacao-visual.webm; fixtures de recursos/estoque apenas em memória.
- test-recovery-small.cjs:640×480 e916×412 emulados, toque, valor/estoque corretos, barras convergentes, ausência de modal/mensagem redundante e canvas completo. Capturas inspecionadas na escala exibida. Interface816×624 é escalada pelo motor; o painel cabe e as fontes lógicas foram preservadas, mas teste emulado não comprova ergonomia/legibilidade no Galaxy A56 físico.
- test-inventory.cjs:18 cenários de equipamento/arraste/alternativas/atributos/técnicas/aparência/consumo/save e batalha real passaram.
- test-recovery.cjs:9 grupos de recursos/poções/16 identidades sem regeneração, cama técnica/restrições, persistência e3 turnos nativos de poções passaram. São testes automáticos, não avaliação do descanso pelo responsável. Houve timeout de entrada na cena técnica em uma execução paralela; repetição serial passou, sem mudança no código do jogo para contornar o teste.
- validate-potion-feedback.cjs, validate-recovery.cjs e validate-journal.cjs passaram. Comparação de origem permite somente apresentação de Stats/descrição e feedback pós-uso; transações, restAt, batalha, dados, persistência e plugins permanecem iguais à base. Motor e assets inalterados.

Capturas, resultados e composição em evidencias/m01-17-r02, sem sobrescrever R01. Fontes de configuração continuam as da R01; esta revisão não exigiu pesquisa adicional de regras ou geração artística.

## Conferência manual e pendências

Título → **Laboratório de recursos** → marcador9 para gastar e11 para obter kit → Esc → Itens. Usar poções por Enter/clique/toque; observar quantidade no próprio slot e barras do quadro direito. Usar consecutivamente e perto do máximo; conferir que o estoque esgota corretamente. Tentar cheio mantém item e explica impedimento. Cancelar/retornar durante a transição e salvar/carregar; valores devem corresponder aos dados reais. A descrição estática continua disponível sem mensagem de sucesso adicional.

M01-17 segue tecnicamente concluído na feature para revisão, sem merge em develop/main. Nova composição R02 ainda aguarda avaliação visual do responsável. Novo ciclo de autoria/gerenciador/playtest desta revisão no MV1.6.1 permanece pendente; verificação de arquivos/Chrome não equivale a isso. Descanso não recebeu nova confirmação manual. Galaxy A56 físico é pendência M01-19; balanceamento prático M01-20. REF01(favoritos/atalhos) e REF06(notificações de quest) não implementadas. Não avançar M01-18 nesta rodada.

O roteiro novo R02 também teve timeout de entrada: passou a aguardar o título sem fade/transição antes de iniciar o laboratório e a coletar diagnóstico de cena em falhas. A execução final passou; isso é estabilização da preparação automatizada, sem atribuir uma causa de falha do jogo não confirmada nem alterar o motor.
