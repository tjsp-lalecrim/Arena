## Aprovação M01-14 e pesquisa de natação — 27/10/2026

Estrutura/visual do estado disponívelb194b44 aprovados pelo responsável. Porta lateral fina/pouco visível é melhoria futura não bloqueante; preservar forma/encaixe/âncora/animação/colisão, sem geração nesta rodada. Pesquisa em INVESTIGACAO_NATACAO_ARENA.md confirma custo de fatigue documental, mas taxa/parado versus movimento/forma exata do afogamento não foram observados. S01 é proposta não aplicada; Vigor continua exclusivo de técnicas de combate. Ler APROVACAO_MAPA_M01_14.md. Autoria Map008 editar/salvar/reabrir no editor ainda sem comprovação; nova automação falhou. M01-14 não fechado, sem merge; M01-15 confirmado no backlog, ainda não iniciado por essa dependência. Registros anteriores de estética pendente são históricos; não transformar aprovação visual em teste funcional/editor/A56.

## Correção M01-14 R03 — 27/10/2026

Direção gráfica/planta permanecem aprovadas; encaixes de portas/objetos/colisões não estavam aprovados. R03 corrige os cinco prints de defeitos com componentes ortogonais, dobradiças fixas, ausência de cap sobre vão, plataformas independentes, tesouros maiores e suporte válido de decoração. Ler DIRETIVA_DE_MAPAS.md e DUNGEON_M01_14_R03.md. Sem merge, isometria ou avanço para M01-15. M01-14 em validação: testes Chrome/contratos separados de aprovação visual; captura do editor falhou duas vezes, sem comprovar editar/salvar/reabrir; A56 físico pendente. Registros anteriores são históricos quando divergirem.

## Revisão M01-14 R02 — 27/10/2026

Responsável aprovou direção gráfica e fidelidade estrutural da base disponível4161615. R02 revisa portas/objetos/água; a aprovação da base não se estende automaticamente às variantes novas. Planta preservada. Portas com quatro vistas/três estados, tesouros inspirados no arena_loot, água A1 própria e natação restrita ao mapa8/região2, sem custo/regeneração de Vigor. Fontes, contratos, testes e limites em DUNGEON_M01_14_R02.md. M01-14 permanece em validação: captura do editor falhou novamente; autoria no MV e A56 físico não verificados. Sem merge ou avanço de backlog. Estados operacionais anteriores abaixo são históricos quando divergirem desta revisão.

# Backlog de implementação do M01

## Estado operacional M01-14 — 26/10/2026

M01-13 integrado/publicado em develop4c612ae após revisão técnica e aprovação limitada ao menu; destaque de raros é melhoria futura não implementada. Feature/m01-dungeon-inicial entrega mapa8/tileset4, planta original50×50 adaptada3×3,14 portas, chave/Gate e pontos de integração. Navegação/colisões/save-load e comparação da planta testados. **M01-14 em validação, não concluído:** autoria/edição/salvar/reabrir do novo mapa no editor não confirmados por falhas da automação; avaliação de arte/escala do responsável e A56 separados. Ler DUNGEON_M01_14.md. Sem merge da nova feature, geração procedural, mapa-guia ou início de M01-15. Registros operacionais anteriores são históricos quando divergirem.

## Estado operacional — M01-13 (26/10/2026)

M01-12 concluído no escopo incremental aprovado, integrado/publicado em develop90e309b. Paleta, simplificação de uso de itens e design da confirmação permanecem melhorias futuras, sem implementação. Feature/m01-loot entrega M01-13 tecnicamente, sem renumeração, para revisão e sem merge. Implementação795d80d; testes/limites em evidencias/m01-13/fontes-testadas.json. Limite por origem individual já definido em LOOT.md: até uma peça por inimigo; agregação mantém origens. Tabelas wiki/provisórias, raridade substitutiva, reserva de capacidade, fonte de missão e ledger único descritos em LOOT_M01_13.md. Testes/capturas em evidencias/m01-13; editor/A56 e balanceamento final permanecem separados e pendentes. Não iniciar M01-14.

Registros abaixo são históricos quando divergirem deste estado operacional.


## Fechamento M01-12 — aprovação do responsável (26/10/2026)

Responsável aprovou inventário/equipamentos atuais, associados ao estado disponível6271f22, sem informar hash próprio, dispositivo ou lista de casos. A aprovação aceita a cobertura mínima de materiais existente para prosseguir; não transforma torso/material em figurinos completos nem comprova novos testes físicos/editor. Critérios funcionais revisados: arrasto/alternativas, troca/remoção sem perda, técnicas/atributos/aparência e save/load demonstrados nas evidências R01/R02. Validador estático/puro reexecutado com sucesso no fechamento; demais suítes identificadas são as execuções anteriores, sem alegar repetição. M01-12 concluído no escopo incremental aprovado, com ressalvas aceitas e não bloqueantes.

Melhorias futuras, não implementadas: reavaliar paleta; facilitar acesso/uso de itens reduzindo confirmações constantes; melhorar design da janela de confirmação. Preservar também favoritos futuros e limitações de cobertura artística registradas. Nova sessão visual no editor e Galaxy A56 físico continuam pendentes para validação integrada, sem atribuir à aprovação do responsável. Autorizada integração em develop e publicação; sem promover main/release.

## Objetivo e estado

Estado operacional M01-12: M01-11 integrado/publicado em develop6e59882 após aprovação do combate disponível em25672fe (ambiente/casos não detalhados). Feature/m01-inventario-equipamentos implementa inventário, troca/arrasto/prévia/remoção e aparência derivada mínima por couro/malha. M01-12 permanece em revisão, sem encerramento artístico; ler INVENTARIO_E_EQUIPAMENTOS_M01_12.md. Favoritos são melhoria futura não implementada. Sem merge da nova feature ou avanço para M01-13; A56 físico/playtest visual NW.js pendentes.

Histórico do fechamento M01-08 R01 (antes da integração): M01-07 R05 já integrado, bônus aplicados e arte aceita com ressalvas; recursos concluídos na feature para revisão. Evidências preservadas em VALIDACAO_M01.md e RECURSOS_E_PROGRESSAO_M01_08.md; a autorização posterior resultou no merge d3c736d.

Entregar uma demo jogável em Português Brasileiro: criar o personagem, acompanhar a introdução, explorar Imperial Dungeons e encerrar ao alcançar o Shift Gate. Este backlog detalha as decisões de DEMO_INICIAL.md, sem ampliar o marco para cidades ou quests posteriores.

Estado de execução e evidências em VALIDACAO_M01.md. M01-01–11 integrados; M01-12 funcional na feature para revisão, com aparência mínima/material em avaliação e testes físicos separados. M01-13–20 não iniciados. Autoria no editor é separada do navegador; a documentação isolada não comprova implementação. Não há estimativas de esforço ou datas definidas.

P0 indica base necessária para começar e integrar; P1 indica requisito de conclusão da demo, não conteúdo opcional. Sistemas novos devem ser implementados em plugins desenvolvidos pelo Codex quando o motor nativo não atender, com documentação e configuração reutilizável conforme PLUGINS.md.

## Backlog ordenado por dependências

| ID | Prioridade | Entrega | Depende de | Critério de aceitação resumido |
| --- | --- | --- | --- | --- |
| M01-01 | P0 | Consolidar baseline documental e organização Git Flow | — | Revisar arquivos, .gitignore e checklist, preparar commit coeso da feature documental e sua integração em develop conforme autorização; nenhuma fonte local externa entra por acidente |
| M01-02 | P0 | Especificar o conteúdo de MQ01 a partir das fontes | 01 | Lista de eventos, textos pt-BR, itens, inimigos, áreas e transições com fontes; geometria da dungeon examinada visualmente; término no Shift Gate |
| M01-03 | P0 | Preparar projeto mínimo executável | 01 | Projeto abre no editor MV 1.6.1, gerenciador lê plugins e salvamento/reabertura preservam configuração; nova partida abre mapa válido e executa novamente em localhost, sem referências ausentes; Community_Basic substituído ou dispensado preservando comportamentos necessários |
| M01-04 | P0 | Montar banco de dados mínimo e convenções de IDs | 02, 03 | Registros necessários ao M01 consistentes, fonte/adaptação identificadas e referências válidas; sem classes profissionais ou bloqueios de equipamento por raça |
| M01-05 | P0 | Definir e implementar o estado persistente dos sistemas próprios | 04 | Contratos e IDs para personagem, quests, itens concedidos, inimigos, atalhos e progressão; salvar/carregar cenário mínimo preserva o estado sem duplicação |
| M01-06 | P0 | Validar o primeiro conjunto visual e formatos de assets | 02, 03 | Exemplos de personagem, inimigo, tile, ícone e ilustração vistos no motor, com dark fantasy e leitura na escala final; fichas e prompts registrados |
| M01-07 | P1 | Implementar criação do personagem e bônus raciais | 04, 05, 06 | Escolhas de nome, raça e gênero geram o personagem e os assets predefinidos correspondentes; bônus documentados e escolhas persistentes |
| M01-08 | P1 | Implementar recursos e evolução do personagem | 04, 05 | Vida, mana e Stamina funcionam; evolução segue adaptação documentada do modelo Skyrim; sem regeneração passiva de Stamina, sem concessões repetidas por save/load |
| M01-09 | P1 | Implementar técnicas por arma e subconjunto de magias/livros | 04, 08 | Cada tipo de arma incluído possui movimento leve e pesado com custo de Vigor; troca de arma atualiza disponibilidade; aprendizado por livro é validado e persistido |
| M01-10 | P1 | Implementar combate Side View e animações dos dois lados | 06, 08, 09 | Jogador e inimigos animados, turnos, barras dos recursos existentes, vitória com retorno padrão e derrota com game over; fuga indisponível |
| M01-11 | P1 | Implementar interface de batalha em slots e atalhos | 09, 10 | Habilidades e itens utilizáveis por slots, com ícones/descrições/quantidades cabíveis; alvo único selecionado sem etapa redundante; custos e indisponibilidade respeitados |
| M01-12 | P1 | Implementar inventário, equipamento por arrasto e aparência | 04, 05, 06, 07 | Equipar por arrasto ou seleção, sem perda/duplicação; armadura altera visual no mapa e batalha; técnicas acompanham arma; save/load reconstrói aparência |
| M01-13 | P1 | Implementar loot automático e tabelas por dificuldade | 04, 05, 12 | Categorias respeitam condições, no máximo um equipamento por loot com pequena chance de raridade; coleta uma vez, slots vazios ocultos, itens importantes protegidos |
| M01-14 | P1 | Construir mapa final da dungeon e exploração | 02, 06 | Mapa superior por grade, colisões/passagens/portas consistentes com adaptação documentada; cela, chave e Shift Gate em posições funcionais; sem exigir gerador procedural |
| M01-15 | P1 | Implementar inimigos visíveis, patrulha e ciclo de encontros | 05, 10, 13, 14 | Contato inicia uma única batalha; derrota de inimigo não causa loop; respawn comum respeita saída após conclusão e exceções de quest |
| M01-16 | P1 | Implementar MQ01, diário e redundância dos itens importantes | 02, 05, 13, 14 | Objetivos e textos pt-BR, chave/porta e transições corretos; verificar itens ao concluir e iniciar etapas; reativar fonte quando necessário sem repetir recompensas |
| M01-17 | P1 | Integrar poções e descanso nos locais elegíveis | 02, 08, 13, 14 | Poções restauram conforme dados; cama elegível restaura totalmente os três recursos; interação, custos e condições documentados a partir das fontes |
| M01-18 | P1 | Produzir e integrar introdução e encerramento da demo | 02, 06, 07, 16 | Introdução textual/ilustrada sem vozes; Ria e diário integrados; Shift Gate encerra explicitamente a demo uma única vez, sem continuar para M02 |
| M01-19 | P1 | Validar e corrigir experiência em navegador/mobile | 07–18 | Fluxo completo em Chrome desktop e Galaxy A56, paisagem/tela inteira quando suportada, toque utilizável e texto legível; ambiente e limitações registrados |
| M01-20 | P1 | Balancear, testar regressões e preparar entrega M01 | 19 | Critérios de DEMO_INICIAL.md atendidos, ausência de bloqueios críticos, documentação consolidada e pacote de teste identificado; preparar release sob Git Flow conforme autorização |

Os bônus P01–P08 foram autorizados como balanceamento provisório no fechamento R05. M01-08 deve preservar o+10 inicial sem regrant; M01-09/10 e M01-20 devem executar BALANCEAMENTO_RACIAL_CENARIOS_M01.md: custos/turnos, armas livres, crítico/arredondamento, teto de acerto/evasão, utilidade de AGI, fontes reais de frio/magia/paralisia e vantagens excessivas. Testes de fórmula não demonstram equilíbrio integrado. Esses itens continuam futuros, sem implementação automática.

## Detalhamento de escopo por grupo

### Base e dados — M01-01 a M01-05

- Preservar alterações existentes e fontes em doc/wiki e doc/prints. O índice FONTES_LOCAIS.md deve permanecer rastreável.
- Usar o diagnóstico datado para revalidar referências necessárias ao boot. Não restaurar a biblioteca padrão inteira por conveniência.
- Cadastrar raças/bônus, ator, tipos de armas/armaduras, técnicas, itens, poções, inimigos, tropas, estados e animações necessários ao marco. Não adaptar o catálogo inteiro antes de jogar o protótipo.
- Reservar IDs, switches, variáveis e campos de notas; manter dados de Arena separados da lógica reutilizável dos plugins.
- Definir checkpoints de teste antes da chave, após abrir a porta, após combate e antes do Shift Gate. Isso é cobertura de validação, não obrigação de criar autosave ou checkpoints para o jogador.

### Arte e personagem — M01-06, M01-07 e M01-12

- Fazer inventário de combinações de raça/gênero e seus arquivos. A demo não está autorizada a substituir silenciosamente a criação por personagem fixo.
- Comparar as referências de mecânicas de doc/prints com o guia dark fantasy; solicitar novos exemplos somente quando houver necessidade concreta.
- Validar pelo menos duas armaduras e a aparência-base, incluindo os movimentos do combatente. Escolher camadas ou folhas alternativas antes de multiplicar assets.
- Produzir os assets finais das combinações e inimigos efetivamente incluídos. Provisórios permitem iniciar desenvolvimento, mas limitações não podem ser apresentadas como arte final concluída.

### Recursos, técnicas e magia — M01-08 a M01-11

- Documentar valores iniciais, máximos e regra de aumento dos recursos; usar valores provisórios identificados até o balanceamento.
- Aplicar no mínimo leve/pesado a todos os tipos de armas disponibilizados na demo, não a todo tipo do catálogo futuro.
- Livros: uso único, sem requisito mínimo, consumo somente após aprendizado válido; magia já conhecida não deve causar consumo acidental sem benefício.
- Acesso a magos da Mages Guild pertence aos locais da campanha onde houver esse serviço. Não criar uma Guild dentro da prisão só para demonstrar o sistema. O contrato de aprendizado pode ser validado em mapa técnico separado, sem incluí-lo no percurso da demo.
- A análise das magias ambientais para múltiplos alvos pode produzir uma lista de candidatos e limitações para marcos posteriores. Não é necessário implementar todo o catálogo no M01.
- Regras nativas compatíveis de turnos seguem MV; decisões específicas de Stamina e atalhos têm precedência.

### Dungeon, loot e quests — M01-13 a M01-18

- Especificar a unidade de loot por inimigo/evento de origem, para que uma tela agregada não burle nem aplique indevidamente o limite de equipamento.
- Configurar fontes de livros em inimigos/baús compatíveis com dificuldade; não forçar todos os inimigos a conceder livros.
- Testar inventário no limite: coleta automática não pode perder silenciosamente item obrigatório. Tratar a condição de forma documentada.
- Um inimigo específico da quest não tem respawn comum; sua reativação excepcional para recuperar item obrigatório deve respeitar a obrigação ativa.
- Na dungeon inicial, o Shift Gate encerra a demo. Testar o mecanismo genérico de respawn em área técnica se o fluxo final não permitir revisita; não inventar retorno narrativo à prisão para comprovar respawn.
- Camas devem ser colocadas apenas em pontos elegíveis confirmados na especificação da área. Se a fonte não justificar cama no percurso, validar a recuperação em cenário técnico, sem inventar descanso na campanha.
- A reativação de fonte deve conceder somente a quantidade necessária do item e não refazer ouro, loot ou conclusão de quest.

### Validação e entrega — M01-19 e M01-20

Testar desde os primeiros protótipos, sem esperar M01-19 para descobrir problemas básicos. M01-19 é a validação integrada dos controles e apresentação, com correção dos problemas encontrados.

Cobertura final mínima: criação, introdução, movimentação, patrulha/contato, vitória, game over, técnicas leves/pesadas, uso de item, coleta automática, equipamentos por arrasto, aparência por armadura, chave/porta, diário, recuperação de item ausente, eliminação de duplicação, salvar/carregar e encerramento no Shift Gate.

Registrar tempos de carregamento, fluidez e leitura no Galaxy A56 em Chrome, incluindo versão do navegador/sistema, orientação, escala e dificuldades do toque. Não declarar suporte mobile apenas por teste em desktop. Não há orçamento de desempenho numérico aprovado; registrar as medições e corrigir impedimentos de uso.

## Ordem de execução recomendada

1. Baseline e especificação: M01-01 a M01-04.
2. Protótipo técnico: M01-05, M01-06 e versões mínimas de M01-08 a M01-10.
3. Personagem e interfaces: M01-07, M01-11 e M01-12.
4. Conteúdo e integração: M01-13 a M01-18, respeitando as dependências da tabela.
5. Validação, balanceamento e entrega: M01-19 e M01-20.

Os grupos orientam o planejamento, não autorizam ignorar dependências. A montagem visual do mapa e a especificação de textos podem avançar enquanto sistemas são implementados, sem considerar o mapa jogável antes de integrar eventos e recursos.

## Git Flow e rastreamento

Criar features a partir de develop após a baseline documental, usando nomes como feature/m01-base-executavel, feature/m01-dados, feature/m01-combate, feature/m01-interface ou feature/m01-quest. Uma feature pode concluir mais de um item coeso; não é necessário criar exatamente vinte branches.

Registrar por item: estado, branch/commits quando existirem, fontes, arquivos alterados, evidências de validação e pendências. Estados sugeridos: a fazer, em andamento, em validação, concluído. Só marcar concluído quando os critérios tiverem evidência.

O backlog não cria issues, branches, commits ou publicações automaticamente. M01-01 é consolidação da feature documental; M01-20 prepara uma release apenas quando a entrega estiver validada e sua publicação autorizada.

## Fora do M01

Geração procedural em runtime, mapa/bússola/radar, aliados, quests secundárias, cidades posteriores, toda a campanha, catálogo completo de magias e ferramentas extensas de autoria não são pré-requisitos desta demo. Reutilizar templates na autoria da dungeon é permitido, sem implicar gerador durante a partida.

## Estado atual — M01-09 R01,26/10/2026

| Item | Estado | Evidência |
| --- | --- | --- |
| M01-01 | Concluído | Baseline 29fc22b, integração em develop; revisão do índice e fontes ignoradas |
| M01-02 | Concluído | MQ01_ESPECIFICACAO.md; textos, eventos e mapas examinados; commit 29f44c3 |
| M01-03 | Concluído (base e autoria) | Leitura de nomes/status em detalhes do gerenciador, salvar/reabrir e comparação nativa em evidencias/m01-07-editor.json; localhost regressivo. Inspeção visual de playtest não declarada |
| M01-04 | Concluído (banco mínimo) | DADOS_M01.md, ArenaCatalog.json, validate-data e integração nativa em Chrome |
| M01-05 | Concluído | Contratos/API v1, save/load nativo, save gerado pela composição anterior, campos ausentes, recibos e isolamento; VALIDACAO_M01.md e PERSISTENCIA_M01.md |
| M01-06 | Concluído (amostra desktop) | Matriz de critérios e limites em arte/ENCERRAMENTO_AMOSTRA_M01_06.md; direção aprovada e formatos no motor. Aparelho/combate completo/biblioteca final não declarados |
| M01-07 | Concluído (criação-base desktop, com ressalvas aceitas) | Aprovação estética com defeitos adiados, P01–P08 provisórios implementados,981 verificações novas,234 de criação,16 roundtrips e27 de persistência; FECHAMENTO_M01_07.md. Equilíbrio de combate e aparelho continuam futuros |
| M01-08 | Concluído tecnicamente, integrado em develop |619 verificações, recursos/progressão; merged3c736d após revisão do fechamento. Equilíbrio prático provisório |
| M01-09 | Concluído tecnicamente, integrado em develop782ebc8 |628 verificações/192 ações nativas, pares por arma/sem arma, Vigor único, Cura/Dardo/Mana, livros transacionais, save/load e regressões; HABILIDADES_M01_09.md. Guild e loot de livros continuam futuros |
| M01-10 | Em validação, feature para revisão | R02: piloto Bretã/rato com seis quadros/movimento, gestos/armas, impacto sincronizado,10 vídeos e regressões;15 personagens/2 inimigos continuam R01. Expansão/avaliação perceptiva e manual pendentes. REVISAO_COMBATE_M01_10_R02.md |
| M01-11 a M01-20 | A fazer | Atalhos, encontros de campanha, equilíbrio prático e demais sistemas continuam futuros |

M01-05/06 integrados pelo merge7e7094c; M01-07 pelo mergee1be141; M01-08 pelo merged3c736d e M01-09 pelo merge782ebc8, preservando commits. M01-06 encerra exemplos, não biblioteca inteira. M01-07 preserva16 combinações-base e ressalvas aceitas. M01-10 permanece em feature própria, sem merge em develop/main ou release. Concluir sua apresentação antes de M01-11; as18 comparações de turnos/custo R01 alimentam M01-20 sem transformar fixtures em equilíbrio final.

R05 permanece a decisão vigente de M01-07; a atualização M01-08 trata somente recursos/progressão. Os registros R02/R03/R04 abaixo são históricos: aprovações/propostas pendentes nesses relatos não revogam a decisão posterior. Fonte exata em decisoes/M01_07_APROVACAO_R05.json; arquivos visuais/hash e pendências em arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json e arte/PENDENCIAS_VISUAIS_M01_07.md.

Atualização26/10/2026: revisão exclusivamente dos assets de M01-07 em `feature/m01-revisao-assets-personagens`, baseada na criação ainda não integrada.16 combinações inspecionadas/padronizadas, anatomia Argoniana/Khajiit/Bosmer e retratos Redguard corrigidos; testes desktop e save/load r02 registrados em arte/REVISAO_PERSONAGENS_R02.md. **Revisão estética pendente do responsável**; a entrega funcional anterior não equivale à aprovação dos novos assets. M01-06 preservado; M01-08 e seguintes não iniciados. Animações completas, editor/NW.js desta revisão e aparelho continuam separados das evidências executadas.

Revisão pose-r03,26/10/2026: diretiva obrigatória em DIRECAO_DE_ARTE1.4/arte/PROCEDIMENTO_RETRATOS.md;16 retratos inspecionados e somente quatro corrigidos por IA (Khajiit/Argonianos, ambos os gêneros). Integração limita-se a quatro campos de face; demais assets/regras preservados. Evidências e pranchas em arte/REVISAO_POSE_RETRATOS_R03.md e evidencias/retratos-pose-r03/. **Avaliação estética continua pendente**; não concluir outra etapa ou promover candidatos a referência aprovada. Feature/m01-diretiva-pose-retratos para revisão, sem merge automático.

R04 em feature/m01-identidade-e-auditoria-racial: dois pilotos masculinos Argoniano/Khajiit, com antes/depois e estudos144/48×64/96px; alpha real verificado, mas pé do combatente Khajiit alcança borda da fonte. **Sem integração ou aprovação estética**, sem ciclos/variantes completos. Todas as16 referências visuais ativas preservadas. Auditoria completa das oito raças e propostas P01–P08 não aplicadas em AUDITORIA_BONUS_RACIAIS_M01_07.md. Correção técnica separada: retirar3/4 desarmados dos bônus de arma, com reprodução antes/depois. Criação234,16 roundtrips/previews e matriz racial8×7 níveis verificadas em Chrome isolado; editor/aparelho desta rodada pendentes. M01-08 e seguintes não iniciados; sem merge/release.


M01-12 R02 (26/10/2026): inventário anterior considerado bom pelo responsável; refinados slots equipados com ícones e comparação visual dos parâmetros finais. Testes/evidências R02 registrados no relatório e VALIDACAO_M01. Mesma feature, sem integração automática; avaliação das mudanças R02 e cobertura artística mínima permanecem pendentes. Não iniciar M01-13.

## Fechamento M01-13 — 26/10/2026

Responsável aprovou o menu de loot no estado disponível2b0f0dc, sem informar versão própria/dispositivo ou casos adicionais. Destaque visual de raros é melhoria futura, não implementada. Aprovação limitada ao menu; critérios funcionais revisados separadamente:11 cenários MV,24 matrizes, reservas/save/load/quest/derrota/abort/rollback e regressões registrados em evidencias/m01-13. Validador estático reexecutado neste fechamento; não alegar reexecução de todas as suítes. M01-13 concluído tecnicamente, com economia provisória e testes editor/A56 ainda separados. Integração/publicação em develop autorizadas; sem main/release.
