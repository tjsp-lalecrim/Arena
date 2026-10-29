# Candidata local — loot e descanso

29/10/2026. Branch **integration/m01-loot-descanso**, criada de develop **56597639a65fc8455aff95bffefd62d7bb3b7c1a**. Não promovida a develop/main; sem push, deploy ou release. Aprovação manual pendente.

## Composição e revisão

- Merge 7fca688: feature/m01-20-revisao-ouro-raridade em ce1a608, incluindo e234044 e o registro 013dd25.
- Merge dbb014e: feature/m01-expansao-descanso em b8143f5.
- Conflitos somente em DADOS_M01.md e VALIDACAO_M01.md, por inclusão no início: preservadas ambas as seções. Nenhum conflito de código ou escolha nova de regra. As notas anteriores sobre features separadas descrevem sua entrega original; nesta candidata estão reunidas.
- Dados de loot/quests e banco legado idênticos a ce1a608; mapa/recuperação idênticos a b8143f5. Weapons3/4 e Armors3/4 permanecem no banco e funcionais, fora dos novos pools. Livros preservados. Fallback inteiro uniforme 2–8 somente se vazio; ouro de batalhas inalterado.

## Verificação focal

Chrome 156.0.8078.73 isolado, sem saves pessoais. Reutilizados test-treasure-fallback.cjs (seis grupos) e test-retired-equipment-loot.cjs (quatro grupos): limites, recibos/reservas, save/load antigo/novo, concessão única, equipamento legado, livros e sorteios atuais. validate-current-loot.cjs: configuração sem referências retiradas e 24 sorteios controlados. A ausência futura decorre da inspeção exaustiva das referências e caminhos atuais, não de poucas coletas manuais.

[Integração](evidencias/integracao-loot-descanso/integracao.json): quatro grupos; geradores encounters → quests executados duas vezes em fixture ignorada mantêm exatamente Map008, chave, 40 eventos, faixa e tabelas. Todos os plugins referenciados presentes/sintaxe válida; registro canônico sem BOM, namespace preservado. Abertura do título e dungeon técnica no navegador sem erros JS. Reutilizada auditoria de 40 pontos e recuperação/persistência das três amostras de b8143f5; não repetida campanha inteira. [Fallback](evidencias/integracao-loot-descanso/fallback/resultado.json), [legados](evidencias/integracao-loot-descanso/legados/resultado.json).

A evidência de integração identifica dbb014e como árvore de jogo verificada; o commit documental/ferramentas seguinte não muda o jogo. Nenhuma nova execução no editor ou aparelho físico; não antecipar aprovação manual de ouro/expansão nem balanceamento definitivo.

## Localhost e saves

**http://127.0.0.1:8765/**. Servidor Python existente PID 12664, finalidade confirmada comparando bytes de index.html, plugins.js, loot, recuperação e Map008 com este checkout. Reutilizado sem reiniciar/encerrar processo; permanece ativo e acompanha o checkout. Não mudar de branch durante a avaliação. Nenhum servidor adicional permanente.

Namespace **arena:m01:save-v1** intacto, sem importação/limpeza/migração automática. Este endereço reutiliza os slots da mesma origem/perfil. Nova partida **não é necessária**: saves com eventos antigos recebem instâncias dos pontos novos ao carregar, sem descanso automático. Tesouros já coletados não são sorteados novamente; legados e reservas existentes são preservados. Para avaliar sem mexer em partidas pessoais, usar perfil de teste separado ou o acesso técnico sem sobrescrever slots pessoais. Editor continua armazenando arquivos separadamente.

## Roteiro curto para o responsável

1. Abrir a candidata em localhost e recarregar a página, para carregar os plugins novos. Usar uma partida de avaliação ou **Descanso técnico (refúgio)** no título, que começa no piloto (124,79), com recursos reduzidos. Caminhar até o novo ponto **(127,79)** e descansar por Enter ou indicação de toque/clique. Conferir recursos e soltura antes de novo uso.
2. No percurso integrado, experimentar **(28,85)** (outro setor, acesso por rota existente). A plataforma da Chave de rubi **(142,64), evento127**, é controle: mantém a interação original de quest e não oferece descanso. Não é necessário repetir todos os 40 pontos.
3. Coletar tesouros durante o percurso; resultados já concedidos não mudam ao reabrir/carregar. Aprovação manual do ouro variável continua adiada para esta avaliação, sem exigir um teste isolado.

### Extremos determinísticos, sem alterar loot normal

Ferramenta já existente, executada fora da campanha; abre/fecha origem e perfil descartáveis, usa saves sintéticos, força limites 2 e 8 e verifica repetição/reservas. No PowerShell, na pasta Arena (Node/Playwright locais):

~~~powershell
$env:NODE_PATH='C:\Users\hplea\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:ARENA_REST_BASE='b8143f5'
$env:ARENA_TEST_OUT='tmp/avaliacao-fallback'
node tools/test-treasure-fallback.cjs
~~~

Esperado: PASS 6 focused treasure groups. Não requer encontrar aleatoriamente o fallback, não altera chance da campanha nem salva nos slots pessoais. ARENA_REST_BASE apenas seleciona o snapshot esperado de mapa/recuperação nos testes; padrão histórico mantido quando ausente. ARENA_TEST_OUT evita sobrescrever evidências antigas.

Próximo passo é avaliação desta candidata; nenhuma outra melhoria iniciada. M01-20 e M01 continuam abertos.
