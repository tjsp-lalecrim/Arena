# Arena_Narrative0.1.0 e MV_NarrativePages0.1.0

Plugins próprios Codex, sem dependências externas. Ordem:30 registros existentes preservados, depois MV_NarrativePages e Arena_Narrative. Dependências reais: MV_StateStore, Arena_CharacterCreation, Arena_Quests, Arena_Dungeon/Arena_Encounters e tema Arena_BattleUI. Sem parâmetros do gerenciador; dados pt-BR/asset em data/ArenaNarrative.json, schemaVersion1. Sem vozes ou assets externos novos.

Núcleo reutilizável MVNarrativePages.page(text,word,width,lineLimit,measure) retorna lines/next/total; sem IDs/estado global. Índice por palavra permanece estável em outras resoluções; lineLimit/measure definem a apresentação. Arena_Narrative contém o adaptador de campanha/quest/cenas do Arena, com IDs e textos separados no JSON. API ArenaNarrative.startCampaign/state/isCampaign/finish; startCampaign requer personagem confirmado e fase none. state retorna cópia validada; finish só aceita campanha/dungeon com MQ01 concluída, retorna true uma vez.

Persistência: namespace arenaNarrative v1 em Game_System via MV_StateStore; mode,phase,section,word,history e recibo de operação gate. Não duplica HP/MP/Vigor, inventário ou stage de quest. Defaults técnicos para saves anteriores, sem inventar/repetir narrativa. Contratos completos/migração e limites em NARRATIVA_M01_18.md.

Integrações pontuais: commit da tela de criação delega ao fluxo narrativo (confirmCurrent continua API de dados/laboratórios); reachGate apresenta fim da demo somente em campanha, mantendo regras/transação/recibo e caminho técnico. Hooks novos: Scene_Load.onLoadSuccess; Scene_Map.start/update; Game_Player.canMove/triggerAction; Window_Message.terminateMessage; Window_MenuCommand.addOriginalCommands; Input._shouldPreventDefault(Tab apenas nessa cena). Guard de soltura em Scene_Save/Scene_Title e respectivas janelas, aplicado só quando abertas pela narrativa; a lista compartilhada de Load não é bloqueada por flag do Save. Título usa até6 linhas/largura mínima440 limitada à tela, com rolagem nativa e todos os comandos antigos. Sem editar motor.

Scene_ArenaNarrative usa Window_Base/Sprite nativos, tema existente e layout/paginação responsivos. Resolução original é restaurada ao sair. Input/escala/imagens não persistem; barreiras de entrada em Game_Temp. Ria usa arena_ria_narrativa_r02.png exatamente aprovado, sem recorte/protagonista, vozes ou nova geração. Voltar não reverte quest, apenas leitura antes da dungeon. F01 salvo/carregado é tela estática terminal; não repete encerramento lógico ou recompensas.

Validação: tools/validate-narrative.cjs, test-narrative.cjs, test-narrative-small.cjs e regressões documentadas. ARENA_URL e ARENA_EVIDENCE_DIR configuram servidor/contexto isolado. Navegador não comprova nova sessão de autoria no editor nem aparelho físico. Não criar conteúdo M02 ou conceder kit técnico de campanha por esse plugin.


## R02 vigente — v0.2

ArenaNarrative.json schema2: cada seção contém picture;14 momentos(5 históricos/9 Ria), mais endingPicture. Namespace arenaNarrative v2 migra cursor/histórico v1, sem reiniciar quest ou recursos. Texto inalterado conserva cursor; frase da chave reformulada reinicia apenas essa frase. Controles de introdução Voltar/Continuar, sem botão de salvar; última página transfere diretamente. Salvar permanece normal depois e no fim. Fonte primária/arte/legibilidade/testes em REVISAO_INTEGRACAO_M01_18_R02.md. Dependências anteriores e APIs preservadas; sem vozes/plugins externos.
