# Arena_CharacterCreation 0.1.0

Arquivo `js/plugins/Arena_CharacterCreation.js`. MV1.6.1. Sem dependências externas, parâmetros ou comandos. Carregar após MV_CharacterRules, MV_StateStore, Arena_Persistence e Arena_ArtPreview. Depende de ArenaCatalog.json e ArenaCharacterVisuals.json pela fila DataManager. Não editar arquivos internos do motor.

## Funcionalidade e interface

Novo Jogo abre `Scene_ArenaCharacterCreation` em pt-BR, com oito raças e dois gêneros do catálogo. Nome HTML nativo suporta teclado/acentos; valida NFC, trim/espaços,1–20 caracteres Unicode e recusa controles/backslash de comandos. Layout atual816×624, escalado pelo MV; outras resoluções não validadas. Nome não é avaliado como escape MV. Campo acompanha o canvas esticado; mínimo16px CSS. Eventos de teclado do campo não vazam para atalhos do jogo; foco limpa teclas retidas. IME/teclado virtual em aparelho real ainda não testados.

Setas/Enter: raça → gênero → Confirmar; Esc retorna/cancela. Mouse/toque em um item seleciona e avança; revisão da confirmação mantém rascunho. Cancelar antes da confirmação não escreve identidade/recursos nem salva. Confirmar exibe decisão final antes de criar a partida. A nova partida só é inicializada no aceite final. O nome será normalizado ao confirmar, sem truncamento silencioso.

Após criação, Map004 é sala técnica provisória com mensagem de encerramento desta versão; não é introdução, dungeon final ou MQ01. Quest permanece etapa0. Laboratório técnico no título mantém partida de diagnóstico sem raça, e ambas as galerias continuam disponíveis. Esses comandos iniciam sessões técnicas em memória, sem sobrescrever saves automaticamente.

## Contratos e persistência

- Nome/imagens/equipamentos/atributos nativos continuam em Game_Actor, sem cópia de nome no estado próprio.
- ArenaPersistence.character recebe raceId/genderId/baseVisualId, IDs estáveis `<race>.<gender>.base`. Fonte de identidade é esse registro; não IDs de posição na lista.
- Namespace próprio `arenaCreation`, versão1: `{confirmed:false,visualVersion:1}`, recibo `confirm`. Sem campos em saves antigos recebe defaults e não aplica raça/recurso/aparência automaticamente. Recibo preservado é autoritativo mesmo se o campo confirmed faltar. Flag confirmada também impede nova concessão quando falta recibo em save parcial.
- `confirmCurrent(draft)` valida primeiro e retorna false se já criado. Transação restaura campos nativos e raiz própria se um setter falhar. Não chama DataManager.setupNewGame: isso é responsabilidade da cena no aceite final. API é técnica, não comando de evento arbitrário.
- Recurso próprio `vigor` é inicializado100/100, ou110/110 para Argoniano. Base100 é adaptação provisória para criar o recurso, não estatística original ou implementação de gasto/progressão M01-08. Não reinicializar ao carregar/repetir confirmação.
- `restoreAppearance` executa após extração nativa apenas em saves criados por esta feature; reconstrói character/face/battler pelo ID estável, mesmo se campos nativos de imagem do save estiverem vazios. Ref. ausente/inconsistente falha explicitamente, sem trocar para a piloto. Não duplica inventário ou equipamento. Aparência por armadura pertence a M01-12.

API pública: `isCreated()`, `race(id)`, `visual(raceId,genderId)`, `validate(draft)`, `confirmCurrent(draft)`, `restoreAppearance()`. `validate` não escreve. Não expor APIs a texto interpretado do jogador.

## Bônus

Fonte primária: Manual.pdf p.7 da instalação; complemento UESP Races/Character Creation. Valores/conversões no catálogo e `M01_07_CRIACAO.md`. Bônus derivados da identidade confirmada, não somados por load/reentrada. Gênero não participa das fórmulas. Classe1 permanece suporte técnico comum, sem profissão ou permissões raciais.

Nord: trait11/frio3×0,5; Alto elfo: trait14/estado3; Khajiit: trait21/AGI×1,05 com arredondamento MV (AGI10 torna11). Bretão: dano positivo mágico×0,5 após cálculo nativo, sem reduzir cura. Não importa saving throw. Elfos negros/Redguards/elfos da floresta: bônus floor(nível/divisor) em dano de fórmula e bônus/100 na chance de acerto, em habilidades de arma configuradas. Magias/itens não recebem bônus de arma. Redguard só melee, elfo da floresta só bow, elfo negro ambos; desarmado não recebe. Grupos e skillIds estão no JSON de configuração, não no núcleo reutilizável. Bow não tem arma cadastrada nesta base; não foi criado arco para antecipar M01-09.

## Pontos de extensão

Aliases: fila DataManager._databaseFiles, Game_Actor.traitObjects, Game_Action.makeDamageValue/evalDamageFormula/itemHit, DataManager.extractSaveContents e comandos do título. Sprite de prévia usa recortes nativos de bitmap após carregamento, com proteção contra retorno assíncrono de uma seleção anterior. Fundo opaco próprio evita título anterior atravessando as janelas.

`MV_CharacterRules.js` contém somente validação de nome, conversão de traits e bônus por nível/grupo, sem IDs ou acesso a estado. Reutilização exercitada por testes de função pura; integração Arena mantém conteúdo/IDs separados. `MV_StateStore.hasOperation` é consulta de recibo somente leitura adicionada para recuperação de campos ausentes.

## Arte e limites

16 identidades-base disponíveis.15 novos conjuntos de poses estáticas de frente/costas/laterais/combate/retrato; piloto bretã feminina preservada com caminhada existente. Folhas de personagem nativas3×4: os novos quadros de passo repetem a pose parada, sem simular caminhada produzida. svActors9×6 repete a pose de combate; não é animação completa e não comprova M01-10. Índices não ficam vazios, porém estados como ataque/dano/morte ainda não têm arte própria. Mapas/combate/retratos mantêm mesma identidade por combinação. Biblioteca animada e visuais de armadura são entregas posteriores.

Prompts completos, fontes/anexos efetivos, masters e hashes em doc/arte. Nenhuma imagem original distribuída. Ilustrações narrativas aprovadas não foram regeneradas. Variantes novas têm avaliação técnica/visual desta rodada, não aprovação estética automática do responsável.

## Validação

`test-character-creation.cjs`: UI teclado/nome/cancelar/revisar/confirmar,16 combinações, bônus, liberdade de equipamento, roundtrip, reparo de aparência, recibo autoritativo e rollback. `test-character-pointer.cjs`: mouse e touch Android genérico emulado, navegação e revisão/cancelamento. Auditoria de PNGs/formatos/margens. Testes em Chrome desktop isolado, sem saves pessoais. Editor leu nomes/status dos dois plugins novos, salvou e reabriu; registro em evidencias/m01-07-editor.json. Captura visual/playtest NW.js e Galaxy A56 não foram declarados.

Revisão visual r02 em26/10/2026: nenhum código/parâmetro/dependência do plugin mudou. ArenaCharacterVisuals troca somente arquivos por identidade; chaves estáveis mantêm compatibilidade de saves e `restoreAppearance` reconstrói nomes atuais. Assets anteriores preservados. `test-character-visual-revision.cjs` cobre16 prévias/mapas,16 save/load de imagens v01 e256 amostras do Sprite_Character; `audit-character-revision.py` verifica células, alpha, caminhada preservada e invariância de regras. Arte revisada aguarda avaliação do responsável; editor/aparelho desta revisão não testados. Fontes/prompts e pranchas em doc/arte/REVISAO_PERSONAGENS_R02.md.

Pose-r03 corrige apenas quatro referências `face` de Khajiit/Argonianos, ambos os gêneros. Código, API, IDs, sprites de outras categorias e regras permanecem iguais. Testes permitem pasta separada por ARENA_EVIDENCE_DIR para preservar evidências históricas e comparam os arquivos efetivos da configuração, sem supor um sufixo comum. Diretiva obrigatória e inspeção manual em doc/arte/PROCEDIMENTO_RETRATOS.md; registros atuais em REVISAO_POSE_RETRATOS_R03.md. Nenhum teste automático aprova anatomia; avaliação estética pendente.
