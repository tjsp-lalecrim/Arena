# M02-03B — arredores de Rihad para progressão inicial

01/11/2026. Feature `feature/m02-arredores-rihad`, sobre **b8738b9**, preservando02A/02B/03A e a tag m01. **Implementado tecnicamente para avaliação**, sem merge/push/Pages. M02-03 permanece parcial: sonho de Ria, corte e missão ausentes.

## Relato do responsável e adaptação

Responsável confirmou acesso à chegada pela estrada e ao informante; não confirmou explicitamente descanso nem guardar/carregar nessa chegada. Relato associado à referência disponível b8738b9, sem novo SHA/ambiente informado. Não equivale à aprovação completa de03A. Evidências automáticas03A preservadas.

Fonte principal: [MQ02_ESPECIFICACAO.md](MQ02_ESPECIFICACAO.md#chegada-no-nível1--solução-mínima-definida), quatro ratos/15 EXP e oportunidade de nível2. Não houve nova pesquisa ou afirmação de posições originais. O trecho junto à estrada, planta e distribuição dos encontros são **adaptação**, com piso/pedras provisórios de `Arena_Dungeon_M14_R03.png`. Ratos reutilizam `$Arena_rat_walk_r02` e batalha existente, sem arte/animações novas. O cenário de batalha anterior foi preservado; REF03 permanece futura. A estrada **representa a chegada a Rihad depois de viagem condensada**, não uma saída física da prisão; texto da indicação ajustado explicitamente, sem bloco narrativo/ilustração novos.

## Acesso e encontros

| Origem/gatilho | Chegada segura / efeito |
| --- | --- |
| Map009, caminhar sobre **(18,9)**, indicado **Arredores →** | Map010 **(3,9)**, direção leste; somente MQ02≥10 fora de batalha. Não cura/premia |
| Map010, caminhar sobre **(2,9)**, indicado **← Esplanada de Rihad** | Map009 **(17,9)**, direção oeste, fora do gatilho de saída. Retorno livre, sem viagem geral |
| Repouso existente em Map009 **(15,10)** | Recuperação completa por interação; mesmas regras/fonte, sem respawn ou alteração de tesouros |

Map010: **M02-03 Arredores de Rihad (amostra)**,23×15 tiles, quatro eventos:

| ID estável | Evento / origem MV | Condições atuais |
| --- | --- | --- |
| rihad.approach.rat.01 |2 / (10,5) | Inimigo1, tropa1,15 EXP |
| rihad.approach.rat.02 |3 / (18,5) | Mesmo rato existente |
| rihad.approach.rat.03 |4 / (10,11) | Mesmo rato existente |
| rihad.approach.rat.04 |5 / (18,11) | Mesmo rato existente |

Perfil `rihad.outskirts` em ArenaCampaign.json: raio2, intervalo90, piso região4, colisão nativa. Sem água/obstáculos atravessáveis ou encontros aleatórios. Núcleo Arena_Encounters existente faz patrulha, contato jogador/inimigo, trava de transição, batalha sem fuga e derrota persistente. Loot/EXP usam o settlement existente, uma vez por vitória; sem nova concessão paralela.

São encontros comuns vinculados à conclusão de **MQ02**, não MQ01. Durante MQ02 ativa, sair/voltar e descansar **não reativam** derrotados; conclusão/saída futuras seguem a regra comum já existente, sem nova política de respawn. Não há comando novo de concluir quest/área. Estado usa IDs próprios no armazenamento existente; nenhum namespace novo.

Curva real conferida:50 EXP para nível2,4×15=60. No teste focal, a Bretã nível1 sem equipamento adicional venceu quatro batalhas por **Atacar**, resultando nível2/60 EXP/**3 pontos livres** e escolha de recurso do nível2 pendente. Nenhum nível/EXP gratuito, mudança de curva, atributo, equipamento, fórmula ou bônus. Duração/ações observadas em resultado.json não são meta/aprovação de balanceamento.

## Roteiro observável sem partidas pessoais

Servidor Arena existente conferido: **http://127.0.0.1:8774/**, preservado sem reiniciar. Recarregar a página, sem limpar dados do site. Pelo editor, playtest → mesma opção do título; não necessário refazer a dungeon.

1. Título → **Rihad · chegada nível 1 (RAM)**. Bretã sintética, nível1/EXP0/pontos0, recursos completos e equipamento inicial da criação; sem extras da fixture antiga de nível3.
2. Ir ao acesso **(18,9)** e atravessar. Aproximar-se dos quatro ratos: contato inicia batalha; vencer pelo fluxo normal. Pode voltar para descansar entre encontros, sem perder derrotas.
3. Após as quatro vitórias: menu **Inventário → Atributos (3)** mostra **nível2/saldo3**. Consultar e voltar sem aplicar, ou experimentar a distribuição existente. **Recursos / evolução** mantém a escolha independente de Vida/Mana/Vigor; não foi escolhida automaticamente.
4. Voltar pelo acesso oeste **(2,9)** e interagir no repouso **(15,10)**. Conferir barras completas e ratos ainda derrotados ao retornar. A visão de Ria **não** inicia nesta versão, mesmo no nível2.
5. Menu → **Guardar teste em RAM**. Mudar de posição/descansar, então **Carregar teste da RAM**: posição, recursos, nível, pontos, derrotas e recibos retornam ao snapshot. As opções aparecem na esplanada e nos arredores.

**RAM:** sem slots/backup/localStorage, não sobrevive a recarregar/fechar, sair ao título ou reiniciar a fixture; uma derrota mantém game over nativo, não promete checkpoint técnico permanente. Não altera partidas pessoais. O laboratório de continuidade anterior permanece nível3 por padrão; somente esta chegada escolhe a fixture nível1.

**Campanha normal:** depois da continuação M01→M02, o menu Salvar e Carregar usa normalmente os slots e `arena:m01:save-v1`. Save normal/F5/load nos arredores testado apenas em origem/perfil descartáveis. Save03A na esplanada ganha somente o novo evento de acesso ausente, sem reconstruir personagem/recursos. Não exige partida nova; a sessão técnica nova é necessária apenas para comparar nível1/EXP0 de maneira controlada.

## Verificação e limites

[15 grupos focais Chrome desktop156](evidencias/m02-03b/resultado.json): acesso/retorno reais,4 patrulhas×12 movimentos, limites de colisão/raio, quatro batalhas com ações reais e contato dos dois lados, EXP/loot único e bloqueio duplicado, nível/pontos, consulta à UI, repouso, ausência de respawn, RAM, salvar/F5/carregar normal sintético, acesso aditivo em snapshot03A e gerador idempotente. Sem erros de navegador/arquivos ausentes. Capturas: [trecho](evidencias/m02-03b/arredores.png), [nível/pontos](evidencias/m02-03b/nivel2.png), [retorno/descanso](evidencias/m02-03b/retorno-descanso.png).

O preparador do teste03A agora pede explicitamente sua fixture antiga de nível3, pois o título atual inicia nível1; nenhuma evidência03A foi sobrescrita, nem a bateria anterior reexecutada. Reutilizadas evidências03A e núcleos M01 não alterados; não reexecutados toda campanha, laboratório02A nem baterias gerais de combate. [Integridade estática](evidencias/m02-03b/contratos.json): banco/combate/loot/Map008/repousos preservados, Map009 acrescenta só evento4, registro MV canônico. **Novo teste no editor, aparelho físico e aprovação manual dos arredores não realizados.** Avaliação do descanso/RAM na chegada ainda pendente do responsável, sem extrapolar relato anterior. Aguardar avaliação deste trecho antes da visão de Ria e audiência na corte.
