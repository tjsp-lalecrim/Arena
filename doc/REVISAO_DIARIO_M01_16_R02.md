# Diário M01-16 R02 — 28/10/2026

Base `2ea761d`, mesma feature `feature/m01-quests`. Revisão de apresentação/navegação, sem merge. O responsável solicitou substituir o painel textual único; não há aprovação estética presumida desta revisão.

## Referências efetivamente examinadas

- `doc/prints/m01-16-diario-2026-10-28-atual-562e72e4-3349-4fa1-8b14-e031ef6bf182.png`: repetição do objetivo, descrição e instrução misturadas, painel sem lista/filtros.
- `doc/prints/m01-16-diario-2026-10-28-referencia-skyrim-d09808dd-a49e-4fba-b0a2-45cc73a15bf0.png`: lista à esquerda, título/narrativa/objetivos separados, divisórias e marcadores de estado. Aproveitada apenas a organização; não se importam fontes pequenas, textos ingleses, assets ou regras de Skyrim.

Hashes/arquivos em `evidencias/m01-16-r02/fontes-testadas.json`. Prints preservados na área local ignorada. Bordas finas, linhas e losangos são UI desenhada pelo plugin, com cores compatíveis com o Arena existente; não são novos assets artísticos ou geração IA. Sem alteração de retratos, personagens, animações ou cenários aprovados.

## Composição e textos

Desktop816×624: filtros **Pendentes / Concluídas / Todas** no topo; lista de quests conhecidas à esquerda; **Status geral**, **Descrição geral** e **Passos da quest** delimitados à direita; navegação/Voltar fora das áreas de leitura. Quest selecionada tem preenchimento, borda e marcador; filtro atual tem marcador além da cor. Cada passo possui coluna própria de ícone e coluna de texto: losango vazio + **Atual/Pendente**, losango com marca + **Concluído**. Texto multilinha mantém o recuo. Status geral lê `completed` do contrato, mesmo se etapa/texto aparentar outra coisa.

Somente definições que têm estado disponível (`stage>0` ou `completed`) entram na lista; etapa0 e definições sem estado não revelam a campanha. A produção contém somente MQ01. Filtros vazios mostram mensagem específica, sem seleção fictícia. Trocar quest ou filtro atualiza o conteúdo sem fechar a cena.

`ArenaQuestJournal.json` é apresentação separada de `ArenaQuests.json`: narrativa derivada de J10/R01 e contexto J30; instruções J10/J20/J30 e conclusão J40 aparecem nos passos. Foram removidas repetições de “Objetivo:” e de instruções entre narrativa e passos, sem apagar os textos canônicos originais. Pequenos resumos de estado concluído mantêm o sentido; fontes e adaptações continuam MQ01_ESPECIFICACAO.md (transcrições UESP/colaboradores, CC BY-SA2.5, tradução/adaptação pt-BR, não localização oficial). O aviso de chave ausente/registro inconsistente fica junto dos passos, separado da descrição narrativa. Não há nova fala de Ria/introdução; M01-18 permanece reservado.

Passos de apresentação MQ01: chave revelada10/concluída20, porta revelada20/concluída30, Gate revelado30/concluído40. A antiga etapa40 “Objetivo concluído” não vira um quarto passo redundante. Isso é somente leitura; limites não alteram requisitos/transições do sistema. Etapas futuras não são renderizadas.

## Navegação e leitura

- **Teclado:** Tab/Shift+Tab alternam focos visíveis; ↑↓ navegam na lista ou rolam o painel focado; PgUp/PgDn alternam filtros; Enter abre detalhes da seleção ou executa Voltar quando esse botão tem foco; Esc e Voltar saem para a mesma cena de origem.
- **Mouse:** clique em filtro/quest/abas; seleção imediatamente apresentada. Roda atua no painel sob o ponteiro; setas de rolagem são alternativa visível.
- **Toque:** tap seleciona; arraste rola a área iniciada, sem ativar uma linha ao soltar. Abas/botões de navegação compacta têm44–48px lógicos; não dependem de hover.
- Uma única quest válida já fica selecionada e seus detalhes abertos; não há confirmação de leitura. Em tela compacta, **Missões** alterna lista/detalhes e **Descrição / Passos** alternam leitura. Com lista vazia, não se abre um detalhe inexistente.
- Filtro, seleção, deslocamentos de lista/descrição/passos e contexto ficam em **Game_Temp**, sem escrever no save. Preservados ao trocar/reabrir; offsets são limitados quando conteúdo/lista mudam. O primeiro acesso ao objetivo atual posiciona os passos para leitura, sem repetir esse ajuste durante uma rolagem manual. Estado carregado/progredido é lido novamente, sem regrant ou mudança de regra.

Quebra de linhas mede a fonte e a largura disponível; palavras sem espaços também são divididas para não ultrapassar a coluna. Há clipping das áreas roláveis, barras/setas e limites próprios, sem invadir ícones, títulos, rodapé ou Voltar. O scroll pode mostrar uma linha parcialmente na borda da área, mas todo o conteúdo permanece alcançável; não há truncamento por reticências.

## Tamanho reduzido

Na cena do diário apenas, o plugin ajusta as dimensões lógicas à área útil menor antes de criar os painéis. Em640×480 e Android genérico916×412 emulado, lista/detalhes e abas substituem o desktop de duas colunas; textos de conteúdo continuam21px lógicos, títulos24 e controles44–48, em vez de comprimir todo o816×624. Ao sair, restaura width/height/boxWidth/boxHeight originais. Ao redimensionar durante leitura, preserva o painel/contexto quando aplicável. Não altera a resolução/configuração permanente do jogo nem refatora os outros menus.

Limite de acomodação desta implementação:540×400 lógicos; viewports ainda menores usam o ajuste de escala existente e não foram homologadas. Cobertura desta rodada é desktop/paisagem nas dimensões acima, não retrato universal ou Galaxy A56 físico.

## Preservação funcional e validação

`validate-journal.cjs` remove apenas a UI antiga para comparar o restante de Arena_Quests à base: lógica de progressão idêntica, com a única delegação de openJournal. Map008, banco original, ArenaQuests.json, persistência, recursos, loot, encontros/respawn, engine e arte comparados sem mudanças.29 registros canônicos UTF8/sem BOM;27 anteriores preservados, mais MV_JournalModel e Arena_QuestJournal. Modelo puro verifica filtros, revelação, booleano de conclusão, ausência de mutação e quebra de texto/unicode.

`test-journal.cjs`: cinco grupos integrados com múltiplos asserts, snapshots de estado/inventário/atores/self-switches antes/depois; estados pendente/concluído, filtro vazio,15 quests conhecidas em fixture e uma futura oculta, texto longo/palavra sem espaços,29 passos revelados de30, teclado/mouse/toque, rolagem direcionada, retorno/reabertura, carregamento nativo21, redimensionamento640×480 e emulação916×412. Fixtures são somente memória de contextos descartáveis; não há quests fictícias nos arquivos da campanha ou saves pessoais. Escritas intencionais dos testes para simular progresso/carregamento são separadas das ações de leitura da UI.

As regressões nativas de MQ01 ficam em `regressoes/mq01`, sem sobrescrever R01. O roteiro teve apenas o segmento de leitura atualizado para a nova UI (filtro Concluídas no lugar do campo privado de scroll antigo); etapas, chave, porta, recuperação, consumo, tesouro, Gate e persistência continuam os mesmos casos. `fontes-testadas.json` identifica as execuções finais e hashes.

Falhas de desenvolvimento corrigidas: uso inicial de resize inexistente no MV substituído pelos setters nativos; captura de coordenadas da roda necessária porque TouchInput do MV não atualiza posição no hover; Tab retido somente na cena do diário para não transferir foco ao navegador. Esc e Voltar padronizados. Listeners de roda são removidos na saída. Não se modificou o motor ou a navegação dos outros menus.

## Conferência manual e pendências

Reabrir o projeto atualizado; **Explorar dungeon → Esc → Diário**. Conferir fase da chave, filtro Concluídas vazio e Todas. Obter chave/abrir cela e verificar que só os passos revelados aparecem; após Gate, selecionar Concluídas e conferir os marcadores. Rolar descrição e passos separadamente; fechar/reabrir, redimensionar a janela, verificar o retorno à resolução normal. Use as fixtures automatizadas para muitas quests, sem adicioná-las à campanha.

Capturas em `evidencias/m01-16-r02`: pendente, concluída, concluída-MQ01, filtro vazio, textos/passos extensos, item ausente, janela menor/lista e passos, toque em paisagem. A captura geral de concluídas/textos extensos pode conter quests **de teste**, identificadas como tal. A captura de MQ01 da regressão nativa decorre do Gate real no fluxo técnico isolado; não significa caminhada integral do mapa ou teste do responsável.

Revisão estética/navegação do responsável, nova autoria/playtest dessa UI no MV e Galaxy A56 físico continuam pendentes. Não há merge em develop/main nem início de outro backlog. NAV01 torna os critérios de navegação permanentes, com vínculos em INTERFACE.md, DESENVOLVIMENTO_E_VERSIONAMENTO.md e documentos de teste/validação; melhorias dos outros menus permanecem nos registros existentes, sem duplicação.

## Fechamento M01-16 — 28/10/2026

Responsável aprovou o **design visual** do sistema de quests; estado disponível086264e, sem hash próprio ou dispositivo informados. Evidência em evidencias/m01-16-r02/aprovacao-responsavel.json. Não atribuir a essa avaliação testes de lógica, persistência, respawn, autoria no editor ou mobile. Critérios funcionais revisados separadamente:23 cenários MQ01,5 grupos de diário e regressões identificados nas evidências R01/R02; validate-journal.cjs reexecutado neste fechamento passou. M01-16 concluído tecnicamente, autorizado para integração em develop. Nova autoria da UI no MV e Galaxy A56 físico permanecem verificações de integração, sem alegar execução. REF06 registra notificações futuras, sem implementação; REF01 permanece único para favoritos/atalhos. M01-17 corresponde a poções e descanso, sem renumeração. Estados anteriores abaixo são históricos quando divergirem.
