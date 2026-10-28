## Continuidade R03

Correção visual R02 aprovada pelo responsável, estado disponívelbd108c5. Nova proteção de entrada de menu em PROTECAO_POCOES_M01_17_R03.md, sem alterar as barras, recuperação, combate ou descanso. A aprovação não cobre automaticamente essa implementação posterior; textos históricos de avaliação visual pendente abaixo foram superados somente no escopo do feedback R02.

## Continuidade R02

A confirmação do responsável cobre o funcionamento do uso de poções, não o descanso. A revisão R02 substitui as mensagens de sucesso descritas na R01 abaixo por barras animadas no quadro de atributos; consultar REVISAO_FEEDBACK_POCOES_M01_17_R02.md para implementação/evidências atuais. Regras e contratos R01 preservados.

# M01-17 — poções e descanso, R01 (28/10/2026)

Base: develop e69eec3, integração de M01-16 após registro da aprovação **visual** do diário disponível086264e. A aprovação não atesta fluxos de quest, persistência, respawn, autoria no MV ou dispositivos. M01-17 mantém a numeração do backlog e é desenvolvido em feature/m01-pocoes-descanso, sem integração automática.

## Lacunas e implementação

M01-08 já implementava recuperação, clamp, persistência e API de descanso; M01-09/10/11/12 já integravam ações, consumo nativo, inventário e batalha. Não se recriam esses sistemas. Arena_Recovery0.1.0 acrescenta apenas uso direto das três poções no inventário, revalidação de recuperação na execução de batalha e autorização explícita de ponto de descanso. Dados específicos ficam em ArenaRecovery.json; nenhum novo namespace/save/ledger.

| Item | Recuperação existente, mantida | Processamento |
|---|---|---|
|2 — Poção de cura|50 Vida|Efeito nativo recoverHP; modificadores nativos de recuperação continuam aplicáveis|
|3 — Poção de restaurar poder|25 Mana|Efeito nativo recoverMP; modificadores nativos continuam aplicáveis|
|4 — Poção de Vigor|50 Vigor|ArenaVigorRestore pela API única ArenaResources; não TP|

Quantidades continuam balanceamento provisório M01-04/08; banco inalterado. Uma ativação válida consome uma unidade. Navegar/cancelar não consome. Recursos cheios, estoque ausente e alvo inválido preservam o item. Valores limitados ao máximo; itens não ressuscitam. A confirmação de equipamento/livros permanece; **somente essas três poções** dispensam confirmação/seleção de ator no inventário. O retorno informa quantidade restante e recursos atuais, com o tema existente. Não se implementaram favoritos, revisão ampla de confirmação/paleta ou notificações de quest.

No combate, o fluxo continua Scene_Battle/BattleManager/Game_Action nativo, com custos e barras existentes. O novo guard verifica estoque, permissão e efeito válido, inclusive seleção antiga/ação forçada; registra a identidade transitória da execução em WeakSet para recusar repetição. Não cobra itens nem aplica efeitos: pagamento é exclusivamente nativo. Aplicações dos efeitos de uma ação não passam novamente pelo pagamento. As poções cadastradas são de alvo único/repetição1. Recusa de efeito já cheio na execução não consome a poção, mas não promete devolver o turno já escolhido. Sem nova regra para habilidades, Mana ou Vigor.

## Fontes, locais e adaptação

Consultados nesta rodada, preservados no local:

- Manual da instalação original, Docs/Manual.pdf, página PDF3: uso de itens pela visão de exploração, repouso recuperando gradualmente hit points, spell points e fatigue; condições de acampamento/estalagem e qualidade afetando recuperação. SHA256 3B2337481E95AF1325680A9496F692178483064EB0A973105680B74197ABB00C.
- Wiki local Arena_Imperial Dungeons (quest), página PDF5: repousar em plataformas elevadas reduz o risco de ataque por ratos/goblins em relação ao chão. SHA256 AE00E736F5920F235BDF92AABCC607E438C884984CEE6291E191E5BD8392D4E1.
- Decisões vigentes em MQ01_ESPECIFICACAO.md, BACKLOG_M01.md e PERSONAGEM.md: descanso adaptado exclusivamente em camas elegíveis; se nenhuma cama for justificada na dungeon, demonstrar recuperação no laboratório. A regra de recuperação integral é adaptação aprovada, não reprodução da recuperação gradual por hora do original.

**Nenhuma cama está confirmada nas Masmorras Imperiais.** As41 plataformas do Map008 não foram convertidas em camas; sua planta/eventos permanecem byte a byte. Não se inventa descanso livre, custo em ouro, passagem de horas ou ataque durante sono. Não houve observação ao vivo de repouso no DOS nesta rodada; fatos acima são documentais, não novos testes do jogo original. O descanso técnico é gratuito, instantâneo, sem simulação de tempo/risco; não representa localização histórica.

Ponto elegível atual: Map005 **Laboratório de recursos**, evento6 **Cama técnica**, (13,5); interagir de(13,6), olhando para cima. ArenaRecovery.restAt valida ID configurado, mapa/evento/intérprete, distância de interação, jogador vivo, ausência de batalha/transferência/veículo/mensagem anterior. Só então delega a ArenaResources.rest. Repetir restaura aos mesmos máximos, sem itens, XP, escolhas, bônus ou progresso de quest. A API baixa ArenaResources.rest permanece para diagnóstico existente; futuras camas de campanha devem passar pela autorização restAt, com fonte registrada. Map007 conserva o reset técnico de treinamento; não é descanso de campanha.

Nenhuma regeneração passiva foi acrescentada: HP/Mana seguem sem traits de regeneração; Vigor continua separado de TP e gasto somente por técnicas de combate. Natação e valores raciais P01–P08 não foram alterados. Repouso não remove estados, buffs, TP ou pendências de evolução. Itens e loot continuam tendo suas fontes existentes; kits só nos laboratórios.

## Persistência e compatibilidade

HP/MP, inventário e posição continuam no save nativo; Vigor permanece no contrato arena/arenaResources existente, com atual/máximo separados. Sem migração adicional, concessão no carregamento ou alteração das escolhas de crescimento. Saves anteriores do laboratório herdam a mesma API; o script atualizado do Map005 é reavaliado pelo carregamento nativo dos dados do mapa. Bônus Argoniano inicial **+10** mantido uma vez; teste de evolução para Vigor120 separa base100 + bônus10 + escolha10.

plugins.js mantém cabeçalho canônico MV, array JSON válido, UTF-8 sem BOM;29 registros preservados integralmente + Arena_Recovery ao final. Motor, banco de itens/ações, arte, animações, quests, loot e atalhos preservados. Validador específico compara Map005 integralmente contra a base, permitindo exclusivamente a troca do script do evento6; validadores históricos delegam essa exceção estreita e aceitam o registro adicional, sem relaxar geometria/banco. Não há gerador de Map005 no repositório; o mapa JSON é sua origem editável. Geradores da dungeon não foram alterados.

## Evidências e limites

Resultados em evidencias/m01-17, contextos descartáveis de Chrome e slots técnicos somente desses contextos; nenhum save pessoal acessado. Roteiros e manifesto identificam resultados finais, composição e limitações. Testes de funções complementam cenas, entradas e ações reais do MV; não substituem avaliação de balanceamento.

- test-recovery:9 grupos — teclado/mouse/toque, consumo único, navegação, clamp, recurso cheio, item ausente, cancelar, save/load gasto/restaurado, cama pelo evento real, bloqueios de contexto,16 identidades sem regeneração nativa, Argoniana com evolução e3 turnos de poções reais, ações forçadas/repetidas rejeitadas.
- test-recovery-small:640×480 e916×412 emulados, toque sem modal, quantidade/recurso e canvas integral. Capturas inspecionadas na escala exibida: texto quebra sem cortar e controles permanecem acessíveis. A interface existente816×624 é escalada; textos ficam menores em paisagem. Isso não comprova leitura ou ergonomia no Galaxy A56 físico, reservado a M01-19.
- Regressões e resultados exatos no manifesto fontes-testadas.json; não atribuir essas execuções ao responsável.

Autoria/leitura do novo plugin e playtest desta versão no editor MV1.6.1 permanecem **pendentes**; formato e referências são verificados por arquivo e execução do motor no Chrome. A confirmação manual de edição Map008 em M01-14 não cobre este novo plugin. Não houve teste físico no Galaxy A56, nova geração artística, revisão de animações ou balanceamento definitivo. M01-18 não iniciado.

## Conferência manual curta

1. Abrir projeto atualizado; gerenciador deve listar Arena_Recovery ativado após Arena_QuestJournal. Confirmar abertura/playtest; não salvar alterações de plugins desnecessárias.
2. Título → **Laboratório de recursos**. Ficar abaixo do marcador9, olhar para cima e Enter para gastar recursos; fechar mensagens. Marcador11 adiciona kit técnico de três poções por interação, explicitamente repetível.
3. Esc → **Itens** (inventário). Usar cada poção por Enter, clique ou toque; não há confirmação intermediária. Conferir quantidade e mensagem com recursos. Repetir cheio deve preservar o item; cancelar sem uso deve preservar tudo.
4. Voltar, ficar em(13,6), olhar para cima e Enter no marcador13. Conferir recuperação integral; menu **Recursos / evolução** mostra atuais/máximos. Salvar/carregar e conferir inventário/recursos. Nenhuma plataforma da dungeon deve oferecer descanso.
5. **Combate técnico (piloto)** no título → preparar treinamento → encontro. Gastar recursos com ações e usar as três poções pelo inventário de batalha existente; conferir barras e redução de uma unidade. Não é preciso configurar favoritos/atalhos para esse teste.

## Fechamento técnico

Critérios M01-17 atendidos na feature, para revisão; sem merge em develop/main. Evidência manual do novo design de quests permanece limitada ao visual. Não se apresenta o laboratório como cama confirmada na campanha.

| Critério | Evidência |
|---|---|
|Três poções/consumo único/estoque/limites/cancelamento|resultado.json,9 grupos e trace de3 turnos nativos|
|Descanso elegível/restauração integral/condições|Map005/evento6 real, bloqueios em guards; cama-recuperacao-completa.png|
|Ausência de regeneração|16 identidades em passive, regeneração de turno e espera no mapa sem mudanças|
|Persistência/gasto/máximos/bônus|save17 descartável antes/depois de descanso; Argoniana120=100+10+10; regressão recursos619 verificações e save R05 anterior|
|Integração inventário/combate/quests|18 cenários inventário,7 comparação,13 grupos combate,23 MQ01,5 diário; subpasta regressoes|
|Navegação/telas menores|Teclado/mouse/toque e telas-menores.json; sem modal para poções; capturas inspecionadas|
|Compatibilidade de arquivos|validate-recovery/resources/data/journal/encounters→quests; novo ciclo no editor pendente, sem confundir Chrome com autoria|

A suíte antiga de combate não reconhecia a janela de loot já integrada: passou usando o helper atual de batalha e espera estável antes de Enter. Timeout inicial da fixture legada MQ01 foi superado por execução serial final dos23 casos. Sem alterações no motor, dados de combate ou quests para contornar os testes. Manifesto identifica composição, hashes, contagens e limites; evidências anteriores não foram sobrescritas.
