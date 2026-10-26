# M01-12 — inventário, equipamentos e aparência derivada

26/10/2026. **feature/m01-inventario-equipamentos**, criada de develop **6e59882** após integrar/publicar M01-11. Numeração preservada: este é o item12 do backlog, sem correspondência alternativa. Implementação funcional para revisão; **M01-12 permanece em revisão, sem encerramento artístico**. Não iniciar M01-13, lojas, crafting, loot ou combate novo.

## Fechamento anterior e aprovação

Responsável informou que testou o combate e considera o resultado atual satisfatório. Aprovação associada ao estado disponível **25672fe** (não informou outro hash, ambiente, dispositivo ou lista exaustiva de casos). Não inferir teste físico A56, fullscreen, todos os menus ou funcionalidades M01-12 posteriores. Critérios técnicos M01-11/evidências revisados, validadores passaram; fechamento74eb6f6 e merge6e59882 publicados em develop. Main não foi alterada.

**Favoritar habilidades/itens** para facilitar sua inclusão nos atalhos é melhoria futura. Não implementado aqui; esquema/referências battle.1–8 e associações existentes preservados.

## Funcionamento

Menu → **Item** abre o inventário em cartões com ícone, nome, quantidade e descrição por seleção. Menu → **Equipamento** abre o mesmo conjunto filtrado para peças, sem selecionar de novo o único personagem. Abas Inventário/Equipamentos e paginação; equipamento atual à direita e atributos/duas vistas do personagem abaixo. Tema reaproveita a interface dark fantasy de M01-11 por uma exportação adicional `ArenaBattleUI.theme`, sem refazer a batalha.

Clique/toque na peça ou Enter abre uma prévia. O único slot compatível é resolvido automaticamente. A prévia mostra a peça atual, descrição e valores antes/depois de Força/Resistência/Inteligência/Resistência mágica/Agilidade/Sorte (parâmetros nativos ATQ/DEF/MAT/MDF/AGI/LUK). Nesta base, adaga/espada alteram ATQ+2/+3 e couro/malha DEF+3/+6, sem efeitos adicionais ou mudança de máximos. **Confirmar** revalida e troca; **Cancelar/Esc** não altera nada. Não há classe profissional ou restrição racial de equipamento.

Arrastar a peça do cartão para o slot também abre essa prévia, sem equipar durante o gesto. Fantasma acompanha o ponteiro e os slots indicam compatibilidade. Destino inválido, soltura fora ou Esc durante o arrasto não movem/consomem itens. Toque tem o mesmo gesto e alternativa por selecionar/confirmar. Selecionar um slot filtra compatíveis e oferece Remover; se houver uma única escolha válida, abre diretamente sua prévia. Slot vazio sem peças informa a indisponibilidade.

Troca/remoção usa `Game_Actor.changeEquip` nativo, protegido por validação anterior à troca e verificação posterior. Cada peça sai uma vez e a anterior volta uma vez ao inventário. Inventário cheio para receber a peça anterior bloqueia a operação, em vez de perder o excedente. Referências `{kind:'weapon'|'armor'|'item',id}` são revalidadas na confirmação; não se salva índice de cartão. Repetir a mesma peça é operação sem alteração. Transação por adaptador captura/restaura equipamentos, recursos nativos atuais, contagens e estado próprio se houver exceção/verificação falha.

Técnicas e atalhos incompatíveis continuam tratados por **Arena_Abilities**, sem outro sistema de concessão. Magias conhecidas permanecem. Poções usam o fluxo nativo Scene_ItemBase/Game_Action e as APIs existentes; livros usam ArenaAbilities.learnBook, sem consumo em repetição conhecida. Alvo único não exige tela adicional. Não foram dadas poções/livros/equipamentos ao início da campanha.

Itens importantes (`itypeId2`, ArenaQuest ou ArenaUnique) não oferecem uso comum/descarte. API de descarte e pontos nativos de venda recusam esses itens, inclusive chamada direta à venda. Não há loja nova. Não há bloqueio global de loseItem: entrega/consumo legítimo por quest continua possível e será integrado no marco próprio.

## Aparência mínima e cobertura real

Reutilizados todos os sprites aprovados das16 identidades, suas poses, transparência, dimensão de célula, linha dos pés, mãos de arma, tempos e relógios. **Nenhum retrato, corpo ou movimento foi regenerado.** Couro/malha são dois materiais novos gerados por IA, aplicados a regiões de torso em bitmaps transitórios. O mesmo equipamento nativo determina o material no mapa e combate; raça/gênero/baseVisualId permanecem os originais.

É uma **amostra mínima de tratamento de material**, não uma biblioteca de novas silhuetas completas de couraças/cotas. Roupa-base, mangas e contornos permanecem; máscaras são regiões de demonstração, não segmentação artística completa de cada parte do corpo. Não apresentar isso como figurino final ou aprovação artística automática. Silhuetas próprias, coberturas maiores, ombros/costas/recortes por pose e refinamento de máscaras exigirão produção/avaliação específica se necessários. Não gerar antecipadamente toda a campanha para preencher essa limitação.

Cobertura técnica: base e dois materiais nas16 combinações;12 células de mapa e42 do atlas de combate por identidade verificadas quanto à aplicação/alpha. Quatro pranchas com mapa e pose de espera em escala nativa. Testes de pixel não comprovam encaixe estético/anatomia de todos os quadros. O combate nativo do piloto com malha foi executado; não foi feito playtest manual de cada combinação/movimento com as duas armaduras. Essa avaliação permanece explícita, e impede encerrar toda a etapa visual como final.

Cabeças/retratos não são substituídos. Alpha e pixels opacos das áreas protegidas superior/pés permanecem iguais; a cópia por canvas pode arredondar RGB de bordas translúcidas em até1 unidade (medido, sem mudança de alpha). Cache limitado a oito bitmaps derivados, não salvos. Não há promessa de desempenho físico no A56. Armadura futura sem material configurado mantém a base **com aviso na prévia/painel**, sem restringir seu uso mecânico.

Materiais/versões/prompts completos, dimensões e hashes em **arte/MATERIAIS_M01_12_PROMPTS.json** e **arte/MATERIAIS_M01_12_MANIFEST.json**. Mestres em art/m01-12 e arquivos consumidos em img/pictures/Arena_material_couro_v01.png e Arena_material_malha_v01.png. Geração por ferramenta image_gen integrada; nenhum arquivo original do jogo distribuído ou voz. O ícone AI anterior de couraça foi reaproveitado; malha recebe material derivado no ícone. As duas lâminas compartilham o ícone de categoria existente e têm nomes distintos; ícones específicos podem ser refinados depois.

## Fontes, adaptação e persistência

Lidos PERSONAGEM, INTERFACE, DADOS_M01, DIRECAO_DE_ARTE, backlog, validação e contratos/código de personagem, persistência, habilidades, recursos e movimentos. Wiki local **Arena_Base Armor…pdf**, páginas1–2: couro/chain, rating-3/-6, couraça cobre peito/costas. Mantidas as conversões aprovadas DEF+3/+6; não converter de novo nem importar peso, todas as partes de armadura, restrições profissionais ou catálogo plate. Materiais são interpretação artística, não texturas extraídas do original.

Não foi necessária nova consulta ao Battlespire nesta rodada: tema/API e fluxo nativo do próprio Arena bastaram. Nenhum arquivo, plugin, asset ou dependência daquele projeto foi importado/alterado. Sua autorização de consulta pontual somente de leitura permanece registrada para necessidades futuras, sem torná-lo fonte oficial/normativa.

Inventário, equipamentos, atributos e aprendizado continuam nativos do MV. Nenhum schema/namespace de save novo; corrente/máximo de recursos e bônus raciais não são duplicados. Ao carregar, a criação reconstrói as imagens-base e o renderizador deriva o material da armadura nativa. Saves anteriores sem armadura mostram a base; ausência de identidade criada não inventa personagem ou concede peças. Cache, seleção, página, gesto e prévia são transitórios. Não há regrant/reaplicação de progressão ao carregar.

## Como testar

1. Título → **Inventário técnico** abre Map007 e o kit explicitamente separado da campanha. Para outra identidade, no laboratório usar **Novo participante(3,8)**; depois interagir com **Equipamentos técnicos(13,5)**. O kit assegura uma unidade das peças/itens do subconjunto quando ausentes; repetir sem consumo não duplica. Reabastecimento depois de consumo é somente ferramenta técnica, não fonte de quest/loot.
2. Aba Equipamentos: selecionar/arrastar adaga/espada para Arma, couro/malha para Corpo. Conferir prévia/atributos e confirmar/cancelar. Tentar arma em Corpo, soltar fora e Esc no meio do gesto. Conferir contagens e peça anterior devolvida.
3. Selecionar slot equipado → Remover (ou prévia direta quando for a única opção). Conferir volta ao inventário, atributos e aparência-base. Tab alterna foco entre cartões/slots/páginas/abas; setas/Enter navegam. PgUp/PgDown ou botões mudam páginas. Esc sai da prévia/filtro ou volta à cena anterior; mouse/toque não dependem de hover.
4. Aba Inventário: ler descrições, testar poção com recurso gasto e livro válido/conhecido. Chave de rubi técnica permanece importante/protegida. Não há descarte comum na UI ou loja nesta entrega.
5. Retornar ao mapa e iniciar encontro técnico. Observar material no torso, arma/técnicas e animações. Salvar/carregar no mapa e conferir equipamento, recursos gastos, aprendizado, aparência e atalhos. Não usar saves pessoais no cenário técnico.

## Evidências e limites

**evidencias/m01-12/**: inventario.png, equipamentos-base/couro/malha.png, previa-adaga/malha.png, mapa-malha.png, combate-malha.png, quatro pranchas de materiais e saídas dos testes. Contextos Chrome descartáveis, sem saves pessoais. A saída final contém18 cenários; consultar resultado.json e fontes-testadas.json. Execuções intermediárias com falha não são evidência de aprovação.

`test-inventory.cjs` cobre troca/remoção, arrasto real, cancelamento no gesto/prévia, invalidez/estoque obsoleto, capacidade99, operação repetida, técnicas/atalhos, itens/livros, proteção de chave, save/load e batalha nativa com malha, opção única e evento8. `test-inventory-touch.cjs` cobre título nativo, abas/paginação, cancelamento, drag/confirmar/remover por Android genérico emulado916×412. `test-inventory-appearance.cjs` cobre16×2 materiais e invariantes de células/transparência. `validate-inventory.cjs` cobre núcleo reutilizável puro/rollback,20 plugins/18 anteriores intactos, sintaxe/refs, banco/regras/motor/arte aprovados preservados, adição exata do evento técnico8 e System.versionId do editor.

Regressões executadas: criação234, persistência27 (incluindo save real da composição anterior sem raiz nova), interface de batalha12 cenários; validadores de recursos/habilidades/movimentos/batalha. Não atribuir ao responsável a execução dessas suítes. Testes históricos de outros itens permanecem históricos, sem fingir execução nova de todos.

Autoria MV: abriu projeto, F10/detalhe Arena_Inventory ON, salvou, fechou/reabriu sem erro de leitura;20 registros semanticamente preservados. Somente System.versionId mudou semanticamente no salvamento; reformatações idênticas restauradas por comparação. Captura nativa de tela falhou; leitura foi por acessibilidade. Não é inspeção visual/playtest NW.js. Evento8 foi acrescentado depois desse ciclo e validado no motor pelo navegador. Galaxy A56 físico, fullscreen, ergonomia e desempenho continuam pendentes, além da avaliação artística da cobertura mínima. A aprovação anterior do combate não aprova automaticamente M01-12.


Exportação técnica de materiais: mestres IA1254×1254 preservados em art/m01-12; arquivos consumidos de64×64 gerados por tools/pack-equipment-materials.cjs, equivalentes ao tamanho de amostragem do renderizador. Isso evita carregar os mestres de vários MB para uma pequena região de torso. Não é nova geração artística ou substituição dos sprites.


Leitura das pranchas: são fontes de mapa/Side View em escala nativa antes do espelhamento de apresentação M01-11; o combate real mantém o jogador à esquerda olhando à direita. Chave/livros usam glifos genéricos da interface; ícones artísticos específicos, especialmente chave e espada curta, continuam candidatos de refinamento. Não confundir os glifos com novos assets finais do catálogo.


## R02 — refinamento dos equipamentos e confirmação (26/10/2026)

Base35a15e6, implementação0820646, mesma feature. Responsável considerou o inventário bom; registrado esse escopo de avaliação sem presumir aprovação das mudanças R02 ou cobertura física. Mantidos arrasto, clique/teclado/toque, transação/revalidação, técnicas, aparência, importantes e salvamento. Não houve nova geração artística, mudança de regras ou material. Favoritos permanecem futuros. M01-12 permanece em revisão da cobertura visual mínima descrita acima.

Quadro direito agora mostra identificação, ícone32px e nome por slot. Vazios têm marcador neutro e Sem equipamento. Releitura da assinatura dos equipamentos reconstrói ícones/nomes ao equipar, substituir, remover ou carregar, sem bolsa/aparência duplicadas.

Prévia de equipamento contém Atual/Selecionado com ícones36px/nomes completos, descrição e oito parâmetros finais alinhados em quatro colunas. +N e −N distinguem aumentos/reduções também sem cores;0 é discreto. Inclui máximos HP/MP além dos seis atributos anteriores. Cálculo mantém a cópia do ator e param(), portanto inclui aumentos nativos, taxas/traços e buffs; não se limita ao params[] da peça. Peças atuais não alteram Vigor próprio; não foi inventado modificador novo. Remoção mostra Sem equipamento no lado Selecionado e valores resultantes. Botões separados no rodapé; operações só são aplicadas ao confirmar. Confirmação de consumíveis mantém o comportamento anterior.

**Consulta pontual somente leitura ao Battlespire:** examinados BS_Inventory108.js (cartões, ícones e espaçamento) e BS_MenuPanels113.js (slots rotulados com ícones, comparação via ator temporário e linhas28px). Orientaram hierarquia visual e espaçamento; o Arena usa seus ícones, tema, APIs e uma tabela própria de quatro colunas, com linhas31px. Nenhum código copiado, asset/dependência importado ou arquivo daquele projeto alterado. Consulta ao código, sem alegar inspeção de UI executada; não é fonte oficial/normativa do Arena.

**Validação R02:** sete cenários específicos em test-inventory-comparison.cjs: slot vazio/abertura/cancelamento sem mutação do save completo e aparência; bloqueio de mouse/Tab/PgDown no fundo; aumento/redução/remoção/igualdade; taxa1,5 + buff + aumento7 de DEF em memória comparados ao resultado confirmado; nomes longos e geometria816×624; atualização automática do quadro; save/load nativo isolado20/reabertura. Dados artificiais só no contexto descartável, sem editar banco ou saves pessoais. Reexecutados os18 cenários do inventário (incluindo batalha real, proteção e técnicas), a simulação de toque916×412 e o validador estático/puro. Evidências separadas em evidencias/m01-12-r02; R01 preservada. Capturas inspecionadas na resolução nativa: slots normais/nomes longos, substituição, slot vazio, redução e remoção. Testes automáticos não substituem avaliação do responsável.

**Roteiro manual:** título Inventário técnico → Equipamentos. Equipar adaga no slot Arma vazio; cancelar e comparar contagens. Equipar couro, propor malha e conferir Atual/Selecionado e Resistência8→11/+3. Após confirmar, propor couro e conferir11→8/−3. Selecionar Corpo → Remover, conferir11→5/−6 e ícone vazio após confirmar. Abrir modal e tentar Tab/PgDown/clicar abas de fundo: somente os botões/ações do modal devem responder. Repetir por arrasto/toque e salvar/carregar no mapa. Nomes longos usados nas capturas de teste são fixtures, não renomeações de conteúdo.

**Pendências:** avaliação visual R02 do responsável; nova sessão manual/playtest visual no editor MV desta revisão; Galaxy A56 físico/fullscreen/ergonomia. O ciclo de abertura/gerenciador/salvar/reabrir executado na R01 não foi repetido nem atribuído à R02. plugins.js e arquivos internos do motor permaneceram idênticos. As limitações artísticas da amostra de materiais continuam sem alteração. Sem merge em develop/main ou avanço para outro item.


## Fechamento M01-12 — aprovação do responsável (26/10/2026)

Responsável aprovou inventário/equipamentos atuais, associados ao estado disponível6271f22, sem informar hash próprio, dispositivo ou lista de casos. A aprovação aceita a cobertura mínima de materiais existente para prosseguir; não transforma torso/material em figurinos completos nem comprova novos testes físicos/editor. Critérios funcionais revisados: arrasto/alternativas, troca/remoção sem perda, técnicas/atributos/aparência e save/load demonstrados nas evidências R01/R02. Validador estático/puro reexecutado com sucesso no fechamento; demais suítes identificadas são as execuções anteriores, sem alegar repetição. M01-12 concluído no escopo incremental aprovado, com ressalvas aceitas e não bloqueantes.

Melhorias futuras, não implementadas: reavaliar paleta; facilitar acesso/uso de itens reduzindo confirmações constantes; melhorar design da janela de confirmação. Preservar também favoritos futuros e limitações de cobertura artística registradas. Nova sessão visual no editor e Galaxy A56 físico continuam pendentes para validação integrada, sem atribuir à aprovação do responsável. Autorizada integração em develop e publicação; sem promover main/release.
