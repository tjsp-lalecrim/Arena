# M01-18 — introdução, sonho de Ria e fim da demo (28/10/2026)

Feature/m01-narrativa-demo, criada de develop a9d8cc0 após integração/publicação de M01-17. Numeração inalterada: corresponde ao item18 do BACKLOG_M01.md. Implementação para revisão, sem merge em develop/main, sem release ou avanço M01-19. M01-17 foi fechado tecnicamente com aprovação manual das poções separada da regressão **automática** de descanso; ver evidencias/m01-17-fechamento. Não atribuir teste manual de cama ao responsável.

## Fluxo normal e técnico

**Novo Jogo → criação confirmada → I01–I05 → sonho R01–R07 → cela no Map008 → chave → porta → Shift Gate → F01 → Voltar ao título.** Criação cancelada não inicia narrativa/quest nem altera a partida anterior. API confirmCurrent continua sendo confirmação de dados para os laboratórios; somente o commit da tela de criação chama startCampaign. Não concede itens, livros, XP ou cura adicional.

A cronologia é textual, sobre interface neutra escura. A aparição de Ria reutiliza a ilustração espectral aprovada, ajustada integralmente à coluna esquerda sem recorte; texto fica à direita. Não se usa uma imagem de Ria morta para representar cenas em que ainda está viva, nem se ilustra a corte com a cela. Texto e ilustração compõem a introdução como um todo; não foi gerada uma biblioteca de pinturas históricas. Nenhuma figura do protagonista em ilustração, nenhuma voz, nenhuma nova geração artística ou alteração de asset aprovado.

Ao terminar R07, inicia MQ01/etapa10 uma vez e transfere para o início já validado(148,82), sem balão repetindo as instruções ou nova notificação de objetivo. Diário e eventos anteriores continuam autoridades de chave/porta/consumo. O término da quest permanece atômico no Arena_Quests.reachGate; apenas sua apresentação final delega a Arena_Narrative no modo campanha. O Gate não leva a cidade/M02, não cria chefe e não concede recompensa extra. F01 informa explicitamente o fim **da demo**, com Salvar e Voltar ao título.

Novo Jogo é a entrada normal. Os13 comandos de título existentes continuam disponíveis; a janela agora tem no máximo6 linhas, largura mínima440 limitada à tela e rolagem nativa. Isso corrige a posição negativa causada pela lista técnica acumulada e torna Novo Jogo acessível por mouse/toque, sem remover ou redefinir os laboratórios. Use setas/roda do mouse para os acessos técnicos abaixo. Não é uma nova reformulação de menus M01-19.

Entradas técnicas usam modo technical e não exibem automaticamente a introdução ou F01. Explorar dungeon continua iniciando o piloto/fluxo de MQ01 técnico; Encontros técnicos mantém sua separação de quest. O Gate técnico informa que a demo completa começa em Novo Jogo. A saída Voltar ao laboratório fica oculta **somente na campanha**, evitando kits e resets técnicos no percurso normal. Laboratórios continuam acessíveis pelo título; não são conteúdo narrativo de M01.

## Fontes efetivamente consultadas

| Fonte | Evidência e decisão |
|---|---|
|Instalação original/ARENA/TEMPLATE.DAT|Bloco #1400 localizado entre offsets299293 e301156(exclusivo), texto ASCII dentro do arquivo CP437. Confirma integralmente a substância de R01–R07: identidade de Ria, usurpação, chave na parede norte, criaturas, morte/magia esvaindo, oeste/sul até o Gate, sonhos e esperança. Não é gravação de uma sessão DOS. SHA256 dae070edf25b137daa2d023c8335d2e276aa6a8bd1f64ef05011ce7cc1254bd7.|
|Wiki local Arena_Main Quest, PDFp2|Transcrição da introdução: I01–I05 já traduzidos/condensados em MQ01_ESPECIFICACAO.md. Preservados exatamente, inclusive escolhas documentadas abaixo.|
|Wiki local Arena_Imperial Dungeons(quest), PDFpp2–4|Sonho, orientação, chave/porta, caminho e impossibilidade de voltar após o Gate. Fonte complementar às posições START.MIF/INF já verificadas M01-14.|
|Wiki local Arena_Ria Silmane, PDFpp1–3|Transcrição Ria pp2–3 compatível com #1400. A síntese da p1 diz que Ria dá a chave; o texto original/detalhado manda procurá-la na parede. Mantida a fonte física existente, sem conceder chave no diálogo.|
|doc/prints/ria silmane.jfif|Inspeção visual: forma espectral azul-clara, manto e figura de Ria. Comparada ao asset R02 aprovado, sem usar sobreposições como elementos da cena nem importar imagem original ao jogo.|
|GLOBAL.BSA / HISTORY.IMG|Consulta local decodificada com header e Type04; paleta embutida, imagem320×200 com Talin Warhaft/guarda/guardião e aniversário de17 anos do personagem. O uso dessa tela na sequência ativa desta edição CD não foi confirmado. Não impor idade/guardião/origem adicional nem substituir silenciosamente a especificação aprovada.|
|INTRO.FLC e INTRO1/INTRO01.IMG|INTRO.FLC reconhecido como320×200/76quadros pelo leitor local, mas leitura falhou; não alegar reprodução do vídeo. Recursos IMG consultados, mas suas paletas não foram confirmadas: não deduzir cores/identidade deles.|

Hashes completos, páginas e condições em evidencias/m01-18/fontes-consultadas.json. Exports/texto de consulta **somente em tmp/original-review, ignorado**. Instalação preservada, sem mods, vozes extraídas ou binários originais incorporados. Não houve nova observação de gameplay DOS nesta rodada.

A apresentação após a criação segue o fluxo solicitado pelo responsável; não é alegação sobre a ordem de telas observada no executável DOS. Adaptações já aprovadas mantidas: Uriel Septim **VII**, apesar de IV[sic] em trecho da transcrição; omissão da contagem contraditória492 anos;2E896 e Talin preservados. Campo {nome} usa o nome escolhido no projeto, não tenta deduzir primeiro nome de %pcf. A referência a repousar/sonhos em R05 é orientação original para a jornada; não inventa cama na prisão ou sistema de sonhos futuros. A pergunta de proteção de cópia da edição disquete não é reproduzida; a demo termina antes da cidade. F01 é texto novo de produto, não final da campanha original.

## Contrato persistente

MV_StateStore registra **arenaNarrative v1**, defaults: mode technical; phase none; section0; word0; history[]. Não espelha inventário, recursos, aparência ou objetivos de MQ01. Modos technical/campaign; fases none/intro/ria/dungeon/ending/ended. section é índice entre as entradas da fase; word é índice de palavra da tradução exibida, após {nome}. history guarda somente phase/section/word para Voltar. Não persistir quebras de linha, tamanho de tela ou texto inteiro.

Cada avanço/back substitui o estado sincronamente. Paginação deriva do espaço disponível e da fonte, mantendo índice de palavra entre tamanhos de tela. Salvar usa Scene_Save/DataManager nativos e não avança texto. Carregamento nativo de fase intro/ria/ending/ended encaminha à cena narrativa antes de criar o mapa, inclusive saves feitos ainda com Game_Map0. Em dungeon, retorna ao mapa e não repete introdução. Não há save entre a conclusão de Ria, ativação de MQ01 e reserva do destino na mesma chamada síncrona.

No Gate, MQ01 e área são concluídas pelo sistema existente. A operação idempotente arenaNarrative/gate marca a apresentação ending uma vez. Repetir finish, carregar ou manter contato não repete quest, itens ou recompensa. Ao retornar ao título a fase fica ended na sessão. Carregar um save concluído mostra a **tela estática de fim**, não reexecuta o evento do Gate; permite salvar/retornar novamente sem conteúdo M02.

Saves anteriores sem namespace recebem technical/none: preservam personagem/quests/itens e não inventam que a introdução foi lida, nem a reproduzem retroativamente em laboratórios. Para ver o fluxo normal, iniciar Novo Jogo. Versão futura incompatível é rejeitada pelo MV_StateStore; posição/fase inválida gera diagnóstico, não conclusão presumida. Dados/textos schemaVersion1: preservar ordem e IDs I01–I05/R01–R07; mudanças futuras de contrato exigem migração, não remapeamento silencioso.

## Navegação e proteção de entrada

Controles Voltar, Salvar e Continuar; último R07 usa Entrar na dungeon. Enter/Espaço/OK executam o controle focado, setas/Tab mudam foco, Esc volta ao trecho anterior quando disponível; mouse/toque executam apenas após soltar no mesmo botão. Elementos essenciais não dependem de hover. Sem typewriter obrigatório ou avanço automático.

Depois de uma ação, nova pressão exige soltura e pequena janela150ms de proteção. Segurar não pula páginas. Cancelar o save mantém posição e o guard do save não bloqueia a lista compartilhada de carregar. Proteção de soltura também nas telas nativas de salvar/título abertas pela narrativa: o Enter mantido não pode gravar um slot nem iniciar nova partida involuntariamente. No mapa, após chegada/load e fechamento de mensagem da campanha, uma barreira transitória de soltura impede movimento/triggerAction causado pelo comando anterior. Estado de entrada fica em Game_Temp, nunca no save. Sem Input.clear global, mudança de custo ou cooldown de combate/poções.

Em tela menor: resolução lógica da narrativa acompanha a janela, mínimo640×400; corpo22px quando largura<700 e24px nos demais casos. Ria e texto em colunas, imagem integral; paginação usa altura/largura reais. Botões com área44px, margens24px. Resolução anterior restaurada ao sair, inclusive ao abrir salvar. Título apenas limitado à área disponível, sem novo submenu técnico ou importação de implementação externa.

## Verificações e evidências

- **8 grupos de fluxo completo**: criação por controles nativos; intro/tecla mantida; Save/Load nativos durante intro e Ria; entrada na cela após Ria; chave/fechamento de mensagem/hold e save/load20; porta/recibo/Gate; final salvo/carregado/retorno ao título; entrada técnica preservada. Mantendo Enter ao abrir Salvar não grava automaticamente; mantendo ao retornar ao título não inicia Nova partida.
- **Rota real232 passos**:23 até a chave,9 até a porta,200 até o Gate, com moveStraight/canPass nativos, sem locate/through/teleporte de teste. Velocidade6 apenas na fixture para acelerar. **Nenhum encontro ocorreu nessa rota**; não prova balanceamento, patrulhas em velocidade normal ou dificuldade. O roteiro pode resolver um contato com fixture inimigo1HP/jogador cheio, mas essa possibilidade não foi executada no resultado final.
- **6 grupos de telas menores/entrada**:640×480 e916×412; nova entrada do título por mouse/rolagem; toque só ao soltar, cursor de palavra preservado ao redimensionar, Voltar por mouse, save/load no meio de seção, Tab/setas/alvos44px, cancelamento do save com OK mantido sem bloquear Load, migração de namespace ausente. Emulação, não Galaxy A56 físico.
- **108 casos de paginação pura**: todas as12 entradas,3 larguras e3 limites de linha, sem perda/duplicação de palavras. Medidas de fonte reais no navegador também verificadas.
- Regressões: **234 criação,23 MQ01,27 persistência**, contextos descartáveis e evidências próprias. Validadores narrativos, banco/recuperação/diário e cadeia de encontros/quest passam. Canonical plugins.js UTF-8 sem BOM:30 registros preservados + MV_NarrativePages/Arena_Narrative (32), dependências existentes sem Community_Basic reativado. Motor, mapas/banco e assets inalterados; somente dois pontos de integração nos plugins anteriores.

Capturas em evidencias/m01-18: titulo, introducao, ria, chegada-dungeon, chave, porta, encerramento, ria-640x480, ria-916x412 e retomada. Fonte/versões em fontes-testadas.json. Ensaios iniciais corrigiram layout ao mudar de intro para Ria, espera de entrada no roteiro, Tab que escapava ao navegador e guard compartilhado de Save/Load. Um roteiro antigo MQ01 ainda apontava à porta8766 e falhou carregando dados; passou a respeitar ARENA_URL e a execução final passou no servidor isolado. Não houve correção de motor ou banco para contornar testes.

## Testar manualmente / lacunas antes da integração M01

1. **Novo Jogo** no título → nome/raça/gênero → confirmar. Conferir I01–I05, sonho de Ria e pronúncia/textos pt-BR; não há vozes. Usar Voltar/Salvar/Continuar por teclado e ponteiro/toque; segurar comando não deve pular páginas ou gravar slot.
2. Salvar durante a leitura e carregar: deve retomar posição. Terminar Ria deve iniciar o diário na chave e levar à cela, sem outra repetição de orientação. Explorar, obter chave, abrir porta e salvar/carregar; introdução não deve voltar.
3. Seguir até o Shift Gate: tela F01, quest concluída e opções Salvar/Voltar ao título. Carregar esse save deve mostrar fim estático, sem nova recompensa ou M02. Conferir que teclas mantidas não iniciam nova ação involuntariamente.
4. Título → rolar aos laboratórios para validação técnica. Essas entradas não representam o fluxo normal de criação/intro. Não usar saves pessoais nos cenários de falha/recuperação de itens.

Pendente: avaliação narrativa/visual manual do responsável; nova autoria/leitura dos32 plugins e playtest no editor MV1.6.1; integração ponta a ponta em velocidade normal com combate/recuperação sem fixtures; Galaxy A56 físico em paisagem/tela inteira; balanceamento M01-20. As validações manuais anteriores do Map008/poções não se estendem automaticamente à nova feature. M01-18 está concluído **tecnicamente para revisão**, não todo o M01 nem release. REF01–REF06 e demais melhorias de integração/refinamento continuam futuras; custos aquáticos inalterados. Não iniciar M01-19 nesta execução.
