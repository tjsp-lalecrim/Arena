# M01-13 — loot automático e tabelas por origem

26/10/2026. Feature **feature/m01-loot**, derivada de develop **90e309b**. M01-12 aprovado pelo responsável no estado disponível6271f22, fechamento d185fe1 integrado e develop publicado. Paleta, acesso/uso de itens com menos confirmações e design da confirmação são melhorias futuras aceitas, não executadas. Não atribuir aprovação de M01-12 a funcionalidades novas ou a dispositivos não informados. Numeração mantida: M01-13 é loot; mapas/ciclo de inimigos/quest completos seguem M01-14/15/16.

## Unidade de loot e sorteio

LOOT.md já especificava **loot individual de origem**. Portanto o limite é por inimigo derrotado, e não por batalha. Uma batalha com três inimigos pode conceder até três equipamentos, cada qual de origem distinta. Não foi necessário aplicar o fallback de um equipamento por batalha sugerido pelo pedido para o caso de ausência de definição. A apresentação agrega pilhas, mas o recibo retém battle/N + enemy/índice e enemyId. Esses índices são locais à ocorrência da batalha; não substituem IDs estáveis de mapa/generation que M01-15 integrará.

Seis categorias lógicas: ouro; poções; equipamentos; armas; missão; raros. Ouro/poções e fonte de missão não dependem de haver equipamento. Um teste de ocorrência de equipamento de baixa qualidade é seguido dos sorteios configurados de armadura/arma. Candidatos concorrentes são resolvidos por escolha uniforme entre categorias aprovadas; a escolha de entrada dentro de cada categoria usa pesos. Concede **no máximo uma peça por origem**, descartando os demais candidatos antes da concessão. Raridade pode substituir essa peça pela variante configurada, nunca adicioná-la. O slot raro também admite livros não equipáveis, com teste independente, sem burlar o limite de equipamentos.

MV_LootRules é puro, recebe tabela/RNG e devolve rows/candidates/equipment. Não acessa banco/estado/UI. Arena_Loot interpreta IDs, fontes, persistência, fluxo MV e resumo. Não exige plugin externo nem depende de Battlespire. Não foi necessária nova consulta ao Battlespire: os próprios fluxos e ícones do Arena bastaram. Nenhum arquivo daquele projeto foi alterado/importado.

## Fontes e primeira configuração

Consulta efetiva ao PDF local ignorado **Arena_Monsters - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf**, p.6 Goblin, p.13 Lizard Man, p.17 Rat. URL da fonte: https://en.uesp.net/wiki/Arena:Monsters . A especificação local MQ01_ESPECIFICACAO.md mantém a chave junto à parede norte da cela, fonte interativa, sem drop aleatório obrigatório. Sem novas extrações ou alterações na instalação original. A wiki complementa a especificação, não define nosso modelo de seis categorias.

| Inimigo/dificuldade M01 | Ouro | Ocorrência de equipamento | Poções | Livro raro |
| --- | --- | --- | --- | --- |
| Rato / menor | 0 | 0 | 0 | 0 |
| Goblin / baixa | 19%, 2–20 | 25% | 8%, uma unidade | 1%, um livro |
| Homem-lagarto / média do M01 | 23%, 2–20 | 25% | 12%, uma unidade | 2%, um livro |

Wiki: goblin19%/2–20 +25% low-quality item; homem-lagarto23%/2–20 +25% low-quality item; rato loot(?). **Zero do rato é configuração conservadora provisória, não comprovação de ausência de loot no original.** A conversão de low-quality item em arma/armadura, a distribuição uniforme de ouro e candidatos, pools, pesos, poções, livros e raridade são adaptações provisórias. Goblin: couro/adaga. Homem-lagarto: couro/malha, adaga/espada com pesos2:1 para as opções iniciais. Poções cura/poder/Vigor com pesos3:1:2; livros Cura/Dardo com pesos1:1. Raridade da peça:2% condicional à ocorrência de equipamento (0,5% por origem com gate25%). Não é chance de um segundo equipamento.

Variantes mínimas nativas: Weapons3 Adaga rara/ATQ+3, Weapons4 Espada curta rara/ATQ+4; Armors3 Couraça de couro rara/DEF+4, Armors4 Cota de malha rara/DEF+7. Cada qual copia a peça-base com **+1 provisório**, tag ArenaRare, nome/descrição próprios e preço0. Assim a raridade continua identificável no inventário/save, sem metadata perdida numa pilha de itens comuns. Sem afixos, novos tipos, bloqueios raciais/profissionais ou novas regras de combate. Reutilizam ícones/materiais/animações atuais, inclusive malha no ID4; não representam nova produção artística. Estatísticas/nomes anteriores preservados integralmente. Ajustes posteriores precisam de evidência de equilíbrio, não aprovação estética nova.

## Concessão, reservas e persistência

BattleManager.setup aloca sequência persistente, sem conceder nada. Somente processVictory válido monta plano memoizado e aplica a transação. Ouro e drops nativos **substituídos**, não somados. EXP calculada pelo troop e aplicada uma vez via actor.gainExp, preservando progressão/bônus existentes. makeRewards fora da vitória não sorteia; gainRewards fora do caminho válido não concede. Entradas antigas gainGold/gainDropItems não reaplicam o loot substituído. Recibo da batalha impede repetir ouro/EXP/itens/fontes mesmo por chamadas repetidas; reabrir/atualizar o resumo não faz sorteio.

Namespace **arenaLoot v1**: sequence, receipts por battle/N (exp, origens/plano, recebidos, reservados, tentativas de fonte), pending. Inventário/ouro/equipamentos/EXP continuam nativos, sem bolsa duplicada. Salvar anterior à vitória restaura legitimamente outra linha do tempo, não ledger entre saves. Save sem namespace recebe estrutura vazia sem conceder/recalcular nada; MV não oferece salvamento de batalha nesta base. Plano/seleção/janela em curso são transitórios.

Concessão síncrona captura bolsas nativas/ouro, atores, raiz própria e textos. Verifica contagens recebidas; em falha restaura antes de confirmar recibo e permite nova tentativa com o mesmo plano. Não usa transação de equipamento como consumidor paralelo. Limite nativo99 por item/ouro máximo: entrega o que cabe, mantém o restante como **reserva persistente**, sem descartar silenciosamente. Coleta da reserva ao iniciar/retornar ao mapa (inclusive load) ou collectPending explícito entrega apenas a capacidade disponível, sem nova EXP, sorteio ou fonte. Não interfere no meio de um trade de equipamento. Se ainda não houver espaço, a reserva continua salva; próxima volta ao mapa a verifica. Resumo marca Reserva nas quantidades ainda não recebidas, distinguindo-as das recebidas. Aviso único no mapa informa entrega posterior, sem confirmação individual.

## Missão e recuperação

Tabelas normais têm questSources vazio. A chave não foi transferida da cela para inimigos. A integração técnica permite atribuir fonte cadastrada a uma tabela, exclusivamente em memória nos testes. Consulta **ArenaPersistence.sourceStatus** reutiliza as mesmas condições de claimSource: MQ01 etapas10/20, não concluída, fonte não aposentada e sem recibo legítimo de entrega/consumo. Concede só a quantidade faltante do item importante1. Item presente, etapa0/30, conclusão/aposentadoria/recibo bloqueiam novas unidades. Não aceitar importante em pools comuns/raros; fontes são configuradas explicitamente.

**ArenaLoot.recoverSource** reutiliza claimSource: repõe somente item necessário ausente, sem ouro/EXP/loot. Recuperação continua independente do recibo da batalha e do respawn comum. M01-15/16 ainda devem ligar a reativação do evento-fonte e as verificações de saída/entrada de etapas ao mapa/quest finais. Esta entrega testa o contrato, sem alegar patrulhas, redundância completa de transições, saneamento legado de duplicatas ou quest jogável. Proteção contra venda/descarte permanece no inventário.

## Apresentação e teste manual

Resumo após mensagens nativas de vitória/evolução, sem sobrepor janelas. Lista compacta640×430 na tela816×624: ícone, nome, quantidade; descrição muda pela seleção, sem hover. G para ouro é glifo UI; demais ícones reutilizam o atlas aprovado/glifos já existentes. Categorias vazias não criam slots ou cabeçalhos. Sem drops: Sem recompensas, com EXP separada no título. Filas grandes rolam por setas; uma confirmação/toque fecha o resumo inteiro, **não coleta item por item**: a concessão já ocorreu automaticamente. Retorno ao mapa remove a janela e preserva encontros técnicos de ocorrência única.

1. Título → **Loot técnico**: abre Map007 e usa a preparação técnica já existente, separada da campanha. Goblin(6,8), homem-lagarto(10,8), rato(7,5), trio(13,8); interagir de uma célula adjacente. Preparar/reiniciar encontros pelos eventos existentes, sem mudar mapa final. Esse kit não é inventário inicial da campanha.
2. Vencer batalha, ler mensagens e conferir resumo; setas mostram descrições, Enter/Esc/toque retorna ao mapa. O rato pode demonstrar ausência de drops; goblin/lagarto podem não conceder loot por chance.
3. Menu → Item: conferir ouro/quantidades; Equipamento mostra peças e variantes raras. Equipar variante conserva arma/técnicas/materiais; salvar/carregar no mapa deve manter tudo. Valores atuais são provisórios.
4. Não depender de muitas batalhas para validar raridade: **tools/test-loot.cjs** injeta RNG controlado só no contexto descartável e captura casos raros, concorrência e etapas. **tools/test-loot-presentation.cjs** controla reserva e toque. Sem alterar tabelas distribuídas ou saves pessoais para esse teste.

## Evidências e estado

**M01-13 entregue tecnicamente para revisão, sem merge em develop/main.** Evidências em evidencias/m01-13. Testes executados:24 matrizes determinísticas do núcleo;11 cenários de integração MV (uma vitória por ataque/turno nativo, demais montagens controladas, concorrência/raridade, multialvos de recompensa, etapas/consumo/recuperação, concessão única inclusive EXP, capacidade99/save20/load, exceção com rollback e retry, save legado sem namespace, aborto e derrota/game over); apresentação em mobile genérico916×412, reserva de ouro máximo/poção, rolagem e toque único;18 regressões de inventário com batalha/save e toque; persistência27 e criação234, validadores de habilidades/movimentos/UI/inventário. Não são simulações estatísticas de balanceamento.

Capturas: resumo-recompensas.png, inventario-recebido.png, equipamento-raro.png, varios-inimigos.png, quest-elegivel.png, sem-drops.png e resumo-mobile-reserva.png. paginacao-fixture-mobile.png duplica linhas só para testar rolagem, **não representa itens adicionais concedidos**. Fontes e hashes identificados no manifesto de evidência. Originais R01/R02 anteriores preservados.

Verificação estática:22 plugins,20 anteriores preservados, formato canônico UTF-8 sem BOM/arquivos/sintaxe; motor, dados anteriores, regras raciais, consumidores de recursos/habilidades e arte/animações preservados. Validadores históricos agora auditam estritamente apenas a extensão conhecida (variantes3/4 e getter sourceStatus), sem aceitar alterações arbitrárias. Não houve nova sessão do gerenciador/salvar/reabrir do editor ou playtest NW.js nesta rodada; a evidência manual anterior é histórica. Galaxy A56 físico/fullscreen/desempenho/ergonomia e avaliação do responsável de M01-13 pendentes. Não atribuir a aprovação de M01-12 ao loot novo.

**M01-20:** avaliar utilidade das poções/livros, ouro por rota, multiplicação legítima por vários inimigos, frequência de equipamento/raridade e valor do+1, impacto de limites/reservas e duração dos encontros com variantes. Nenhuma validação estatística de economia/equilíbrio definitivo. Sem lojas, crafting, dungeon final ou publicação de release.

## Fechamento M01-13 — 26/10/2026

Responsável aprovou o menu de loot no estado disponível2b0f0dc, sem informar versão própria/dispositivo ou casos adicionais. Destaque visual de raros é melhoria futura, não implementada. Aprovação limitada ao menu; critérios funcionais revisados separadamente:11 cenários MV,24 matrizes, reservas/save/load/quest/derrota/abort/rollback e regressões registrados em evidencias/m01-13. Validador estático reexecutado neste fechamento; não alegar reexecução de todas as suítes. M01-13 concluído tecnicamente, com economia provisória e testes editor/A56 ainda separados. Integração/publicação em develop autorizadas; sem main/release.
