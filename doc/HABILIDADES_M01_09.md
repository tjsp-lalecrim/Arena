# M01-09 — técnicas, magias e livros, R01 (26/10/2026)

Base: M01-08 revisado (diff,619 verificações registradas, critérios e validadores), sem impedimento encontrado; integrado preservando commits por merge **d3c736d**, publicado em develop. Feature atual **feature/m01-habilidades**, sem integração automática em develop/main. Nenhuma evidência antiga do responsável foi atribuída a esta implementação.

## Conteúdo mínimo e fontes

Não foram criados tipos de arma, magias ou classes profissionais novos. Configuração `ArenaAbilities.json` schemaVersion1/balanceVersion M01-09/R01 separa ator1, técnicas, magias, livros e IDs de laboratório do núcleo reutilizável. Arena é a referência de conteúdo; Skyrim não substitui os bônus P01–P08 ou as regras das magias.

| Equipamento / conteúdo | IDs e efeito | Custo provisório |
| --- | --- | --- |
| Sem arma |3 Golpe leve /4 Golpe pesado; fórmulas max(1,2×ATQ−DEF) / max(1,3×ATQ−DEF) |5 /12 Vigor |
| Adaga, tipo1 |5 Corte leve /6 Estocada pesada; mesmas fórmulas leve/pesada |5 /12 Vigor |
| Espada, tipo2 |7 Corte leve /8 Estocada pesada; mesmas fórmulas leve/pesada |5 /12 Vigor |
|9 Cura (Heal) |Usuário, recupera25+MAT Vida, sem Vigor; somente combate |8 Mana |
|10 Dardo de fogo (Fire Dart) |Um inimigo, max(1,3×MAT−MDF), elemento2 Fogo; somente combate |6 Mana |
|5 Livro de Cura /6 Livro de Dardo |Aprendizado permanente9/10, uma unidade após sucesso; sem nível mínimo |Sem Mana/ouro; item consumível |

Valores/fórmulas/variância10% dos ataques e do Dardo, possibilidade nativa de crítico e demais parâmetros foram preservados do banco mínimo; não houve ajuste racial de balanceamento. Cura continua sem crítico/variância. Não ativamos arcos, equipamentos simultâneos, fontes da Guild ou magia ambiental.

Fonte local efetivamente consultada: `doc/wiki/Arena_The Known Spellbook - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, extração de consulta `tmp/research/The Known Spellbook.txt`, pp.2–3, Fire Dart custo-base164 e dano1–2+3–4/nível; Heal125 e cura1–15+1–5/nível. O cabeçalho da fonte define custo por nível do conjurador; custos6/8 e fórmulas acima são adaptações, sem equivalência numérica com o original. A fonte diferencia circinates e disponibilidade na Guild, sem bloqueio rígido por nível. Mantida triagem ADAPTACAO_DE_MAGIAS.md, não inventada exigência de nível para livros. Instalação original/Docs inventariada e preservada; não houve nova extração de BSA ou transcrição adicional do manual nesta etapa. Técnicas leve/pesada e livros são adaptações confirmadas do projeto.

## Disponibilidade e execução

`MV_AbilityRules.available(definitions,primaryType)` é puro e reutilizável, sem IDs do jogo. `Arena_Abilities` consulta a arma principal e deriva3/4,5/6 ou7/8 na lista de skills, sem aprender/esquecer permanentemente técnicas. Só os tipos disponíveis1/2 e ausência de arma0 são usados. Nenhum bloqueio racial de equipamentos/profissão. Dual wield não está ativado no M01; não inferir combinação de técnicas de duas mãos de uma regra baseada na arma principal.

Trocar/remover arma atualiza a lista na consulta nativa e limpa **somente** atalhos de técnicas incompatíveis durante refresh; campos ficam null, sem apagar magias aprendidas/atalhos de magia. Carregar save saneia referências técnicas incompatíveis. Sem construir barra M01-11. IDs de técnicas eventualmente gravados por testes antigos em `_skills` não concedem acesso indevido: a lista e a validação sempre usam equipamento, sem apagar o histórico bruto do save.

`meetsSkillConditions` exige equipamento compatível para técnicas e aprendizado nativo para magias9/10; mantém custos, condições, selos, arma e disponibilidade nativos. `Game_Action.isValid` revalida também ações forçadas de jogador. `BattleManager.startAction` confirma condições **antes** de pagamento/global effects; gera alvos uma vez, sem rolar de novo, e rejeita ausência de alvo. Estado transitório WeakMap por instância de Game_Action impede iniciar duas vezes o mesmo objeto, sem destruir uma fila de alvos já iniciada. Nova execução legítima usa nova ação.

O pagamento ocorre no `subject.useItem → paySkillCost` nativo, exclusivamente pelo consumidor já existente em **Arena_Resources** para ArenaVigorCost; não foi criado outro descontador da tag. Mana continua nativa. Selecionar/cancelar não paga; uma ação com efeitos/repetições/vários alvos paga uma vez na entrada. Equipamento/saldo/aprendizado inválido ou alvo ausente não paga parcialmente. A ação válida que erra/é esquivada ou produz dano0 mantém custo, conforme MV; não é falha de validação nem há reembolso automático.

`Game_Battler.useItem` também bloqueia skill gerenciada inválida, mas `Game_Action.apply` continua sendo o primitivo nativo de **efeitos**, sem custo; não usá-lo como API de execução de uma técnica. Fórmulas/probes antigos podem testar efeitos isolados; os testes novos executam BattleManager/startAction/updateAction/invokeAction/useItem. Pagamentos diretos de diagnóstico do Map005 permanecem testes de recursos, não execuções legais de técnicas sem arma. Técnica real com adaga precisa da adaga.

## Livros e persistência

`ArenaAbilities.learnBook(actor,item)` retorna learned/already-known/missing/unavailable/invalid/failed. Confere ator/registro/posse/condições, sem nível mínimo, e recusa uso em batalha. Ensina e verifica a skill; só depois consome uma unidade nativa e verifica quantidade. Em falha de aprendizado/consumo restaura skills e quantidade anteriores (testadas exceções após cada mutação). Não cria recibo de recompensa: inventário e `_skills` já são autoridades nativas. Sem grant no load ou inventário inicial da campanha.

Menu Itens usa essa transação em lugar do consumo antecipado nativo. Livro já conhecido fica indisponível e a ajuda informa **“Já conhece Cura. Livro preservado.”**; cópias restantes não são perdidas. `actor.useItem(book)` delega à mesma transação; ação forçada de livro no BattleManager é rejeitada (book-menu-only), sem contornar a ocasião2. Efeito43 e tag ArenaLearnSkill permanecem documentados e coerentes; não aplicar o efeito bruto como substituto da transação.

Aprendizado, contagem e recursos continuam nas estruturas nativas/próprias já existentes, sem namespace/schema adicional. Saves reais da composição M01-08 carregam mantendo magias, livros, Vigor gasto e escolhas; atalhos técnicos antigos incompatíveis são invalidados, sem novas concessões. Fontes de livros por drops/baús continuam **M01-13**; não dar livros ao inventário inicial para demonstrar sistema.

## Laboratório e roteiro manual

Título > **Laboratório de habilidades**, Map006 separado. Fique em(8,6), olhe para cima e Enter no evento(8,5). A lista é rolável; comandos inferiores aparecem ao descer. Não é combate jogável: um rato técnico reinicia a cada execução, não age; sem Battle Scene, XP, loot, animação, recompensa ou mapa narrativo. O laboratório substitui somente sinks de apresentação de BattleManager por objetos sem desenho, mantendo seleção de alvo, pagamento e efeitos nativos. Preserva/restaura contexto do manager, tropa, ações e flag de batalha ao terminar, inclusive em exceção.

1. Sem arma, somente Golpe leve/pesado disponíveis. Equipe adaga/espada pelos comandos de diagnóstico: os pares corretos acendem e os outros ficam indisponíveis. Remover arma restaura desarmado. “V” na lista nativa de skills significa Vigor; custos completos também estão na descrição e no laboratório.
2. Selecione uma técnica: abre confirmação sem custo. Esc cancela; Executar paga5/12 e mostra recursos antes/depois e HP do alvo. Resultado pode ser erro/esquiva/crítico nativo; o custo permanece. Use Vigor=0 e observe técnicas indisponíveis; Cama técnica recupera os três recursos. Kit/equipamento do laboratório só são concedidos por interação explícita.
3. Cura e Dardo inicialmente não aprendidos. Comando **Kit técnico** adiciona uma unidade de cada livro por interação (repetível deliberadamente), sem fonte de campanha. **Livros pelo menu Itens** abre o menu padrão. Selecione livro e o personagem: ensina e consome1. Tente uma cópia restante: mensagem de conhecido e nenhum consumo.
4. Retorne ao laboratório: Cura/Dardo disponíveis se houver Mana. Use Vida=40 para observar Cura e Mana=0 para observar indisponibilidade. Dardo afeta o rato; Cura afeta o usuário. Trocar arma preserva ambas as magias.
5. Volte ao mapa e salve em slot exclusivo de teste pelo menu nativo. Carregue: equipamentos, aprendizado, inventário e recursos gastos devem permanecer; sem ganhar novamente livros/técnicas/bônus. Não use saves pessoais.

## Critérios e evidência

Leitura inicial do cenário determinístico (sem bônus ofensivo racial, DEF/MDF do alvo2, sem crítico/variância):

| Ação | Efeito nominal observado | Custo | Efeito por ponto do recurso |
| --- | --- | --- | --- |
| Adaga leve / pesada |22 /34 dano |5 /12 Vigor |4,40 /2,83 |
| Espada leve / pesada |24 /37 dano |5 /12 Vigor |4,80 /3,08 |
| Dardo de fogo |22 dano |6 Mana |3,67 |
| Cura |33 Vida |8 Mana |4,13 |

Pesada oferece maior dano por ação e menor eficiência por Vigor nesta fixture; não alteramos os valores. Avaliar se o ganho de burst compensa em encontros, proteção, crítico e limites de recursos no M01-10/20. Mana e Vigor têm máximos/recuperações distintos: a tabela não prova equivalência de poder nem raça dominante. R05 mantém arredondamento dos multiplicadores; acerto final95%/97%/98%/99% observado é probabilidade calculada, não frequência estatística medida.

`tools/test-abilities.cjs`:628 verificações,192 ações nativas de técnicas nas16 identidades×2 armas×3 níveis×leve/pesada, com fórmulas/acerto raciais R05, pagamento real único e determinismo do cenário. Cobre arma removida/trocada, forçada, insuficiência/igualdade, seleção/cancelamento, ausência de alvo, erro, quatro aplicações em dois alvos com um custo, custos combinados sem cobrança parcial, magia desconhecida/Mana insuficiente/Cura real, livros múltiplos/duplicados/falhas/save-load e menu nativo. Save anterior real usa a lista de plugins de2561830 e nenhum plugin novo.

Fixtures isoladas: HP do rato1000, variância0/RNG0,5 para comparação determinística, técnica com dois alvos/repetições e custo MP adicional, MP/MAT de inimigo para receber Dardo em Bretão/Nórdico. São alterações **em memória do teste**, sem novos registros distribuídos ou inimigos conjuradores na campanha. Fogo atingindo Bretão recebe0,75; Nórdico não reduz fogo. P01–P08 não alteradas. Não há nova fonte real de frio; imunidade/parâmetros/contratos restantes cobertos pelas regressões981, sem declarar encontro prático homologado.

Regressões recursos619/criação234/racial981/persistência27/laboratório e validadores passaram; evidências novas em `evidencias/m01-09/`. Editor registrado separadamente em VALIDACAO_M01.md, sem inferir validação por localhost. Balanceamento de dano por custo, duração de encontros, ordem de turnos e utilidade ao longo da demo continua provisório/M01-10/20. Nenhuma aprovação antiga do responsável foi aplicada a testes desta feature. Aparelho físico Galaxy A56 e playtest visual NW.js não declarados.

Mages Guild (aprendizado por nível/serviço), preços e magias ambientais permanecem continuidade de marcos posteriores de cidades, com fontes/triagem preservadas, sem exigir um novo sistema nesta rodada. Não iniciou M01-10 nem implementou sua apresentação/animações ou os atalhos M01-11.
