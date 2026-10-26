# Arena_Inventory0.1.0

Codex, após **Arena_BattleUI e MV_EquipmentTransaction**. Dependências reais: APIs ArenaCharacterCreation, ArenaPersistence, ArenaAbilities, ArenaResources/ArenaBattleMotion e fluxo nativo MV. Sem plugins externos/Battlespire. Sem parâmetros/comandos do gerenciador; configuração/IDs em data/ArenaInventory.json.

API: `open('inventory'|'equipment')`, `ref(item)`, `resolve({kind,id})`, `preview(slot,ref|null)`, `equip(slot,ref|null)`, `discard(ref,quantity)`, `important(item)`, `prepareLab()`, `appearance('map'|'battle',actor?)`, `materialId(actor)`. Slots são índices nativos0–4, não etype IDs1–5. Equip é validado e atômico; mesma peça retorna ok/changed:false. PrepareLab só funciona no mapa técnico configurado, não é API de loot/quest. Aparência é Bitmap transitório; não gravar em save.

Estende Game_Actor.changeEquip por adaptador ao método anterior (incluindo refresh/invalidação de atalhos). Não usa forceChangeEquip para a troca real. Compatibilidade/canEquip/slot e posse são verificadas antes do native trade; retorno cheio bloqueia. Snapshot nativo + estado próprio restaura falha. Cópia para prévia altera somente o Game_Item da cópia, sem mutar ator real/inventário/ledger. Não muda bônus, profissão ou permissões por raça.

Scene_ArenaInventory usa cartões paginados, slots, prévia com atributos e confirmação, tema público de batalha, teclado/mouse/toque. Controle press/release distingue drag de clique; Escape no gesto é tratado antes que janelas nativas consumam a entrada. Modal bloqueia controles inferiores e evita clique atravessando ao fechar. Janela de confirmação tem área de conteúdo suficiente para desenho/hitTest nativos. Alvo único usa ator atual; poções reutilizam Scene_ItemBase, livros ArenaAbilities.learnBook. Descrições por seleção, não hover.

Configuração atual: ator1, laboratório7/evento8, página9/3colunas/cartão126, região esquerda480, referência lógica816×624. labItems são referências estáveis dos itens do cenário. materiais1/2 apontam couro/malha; mapBands/battleBands são regiões de aplicação no atlas nativo, não desenhos substitutos do corpo. Tema/additive export `ArenaBattleUI.theme` é a única mudança no plugin de batalha.

Renderer deriva material da peça Corpo/etype4; Source AI aprovado é clonado no cache e amostras IA de material são aplicadas em regiões de torso, conservando alpha/células/apoios/tempos. Cache máximo8, sem gerar/salvar novos IDs de identidade. Luminosidade limita a aplicação para preservar áreas muito claras/escuras. Isso não é segmentação semântica completa nem figurino final; cobertura/limites em INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Armadura não configurada exibe aviso antes da troca e no painel, sem proibir o equipamento mecânico. Não substituir silenciosamente raça/gênero por piloto.

Proteção de importantes no descarte e venda nativa, sem loja própria ou veto global a consumo legítimo de quest. Persistência é nativa: nenhum schema ou bolsa duplicada; imagem equipada reconstruída pelos renderizadores após restauração da criação. Interface/escolha/preview/bitmaps transitórios. Sem adicionar itens à campanha, loot, crafting, favoritos ou novas regras de batalha.

Roteiro/evidências/pendências e fontes em INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Autoria no editor foi verificada separadamente; não confundir Chrome/toque emulado com playtest visual NW.js ou Galaxy A56 físico. M01-12 permanece em revisão visual da amostra mínima.


Exportação técnica de materiais: mestres IA1254×1254 preservados em art/m01-12; arquivos consumidos de64×64 gerados por tools/pack-equipment-materials.cjs, equivalentes ao tamanho de amostragem do renderizador. Isso evita carregar os mestres de vários MB para uma pequena região de torso. Não é nova geração artística ou substituição dos sprites.
