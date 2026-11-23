# M02-03B — arredores de Rihad para progressão inicial

## Cenário de batalha costeiro V01 — 23/11/2026

Uma imagem própria para `rihad.outskirts`: [mestre, prompt e fontes](arte/rihad-outskirts-battle-v01/generation.json), [exportação proporcional/hash](arte/rihad-outskirts-battle-v01/exports.json). Base de materiais DCN.INF decodificados, geografia do mapa provincial original HAMERFEL e cores do atlas urbano atual. Clareira costeira, mar, colinas, céu e muralha são interpretação artística; não orientação exata demonstrada pelo Map010 nem observação em primeira pessoa no DOS. Sem personagens/textos na arte. Chão amplo para jogador/ratos, armas e efeitos.

`ArenaBattleUI.json.areaBackgrounds` configura somente esta área. No setup nativo da batalha, `Arena_BattleUI` captura o ID do mapa de origem pelo registro existente `ArenaCampaignConfig.forMap`; não seleciona por espécie ou etapa. `backgroundForArea(id)` mantém `background` como padrão para áreas sem configuração. Novo fundo usa `cover` uniforme no campo visível; o padrão anterior conserva escala/posição. Não altera encontros, animações, dano, custos, EXP, loot ou namespace. Seleção refeita em cada combate após load; não grava arte no save nem exige migração.

`python tools/export-rihad-outskirts-battle.py` exporta816×459 sem deformação. [Capturas/verificação](evidencias/rihad-outskirts-battle-v01/resultado.json): portão normal→Arredores, save/load, contato, três proporções de janela, ações/animações até vitória/retorno e novo combate após carregar. Configuração/equipamento da sessão são sintéticos em perfil isolado; saves pessoais intactos. Avaliação visual pendente. Incluir na **próxima publicação agrupada** Pages; a prévia atual de interiores/fachadas continua `fcd6601`. Sem nova publicação/release nesta entrega.

## Acesso vigente pela campanha — 20/11/2026

Correção integrada e [publicada na prévia2f3686e](PAGES_INFRA.md#prévia-de-mq02-com-acesso-inicial-aos-arredores--20112026), sem aprovação manual presumida.

O responsável relata que a cama funciona e acredita estar no nível1; o nível do save não foi inspecionado nem confirmado. A visão requer nível2, MQ02 etapa10 e leitura ainda não iniciada. O relato não é registrado como defeito narrativo nem como nova aprovação da visão.

**Diagnóstico:** na fonte pública01f9915, Map010 e os quatro ratos já estavam no pacote. Na cidade reconstruída, o acesso lateral/evento4 fica em(342,3), alcançável pela circulação; portanto não estava removido. Porém o evento3 do portão(345,3) só informava chegada antes da audiência e oferecia viagens apenas após desbloqueios. Não havia opção explícita de Arredores nesse menu. A indicação verbal era vaga. A prova anterior ao ajuste está em `tmp/arredores-before.json` (consulta técnica ignorada).

**Correção:** o portão oferece **Ir aos Arredores de Rihad** desde a chegada/etapa10, antes de Ria ou da corte. Stonekeep/Fang Lair só aparecem quando conhecidas pelas regras já existentes. Cancelar fica na cidade. Acesso lateral anterior preservado. Informante e placas indicam Portão/Arredores; retorno do Map010 por(2,9) chega em Map009(345,6), com caminho livre para a Pousada do portão. Descansar no nível1 recupera recursos e orienta explorar os Arredores e voltar após ganhar experiência, sem antecipar o sonho e sem consumir seu estado.

**Progressão:** quatro ratos existentes,15EXP cada; nível2 exige50EXP. Quem chega com0EXP alcança60EXP/nível2 ao vencer os quatro. Não há nível, recompensa ou cura na viagem. Fórmula, curva, equipamento e recompensas não mudaram.

**Proteção delimitada de saves de desenvolvimento:** em jogo regular, derrotar os quatro já fornece EXP suficiente. Para um registro inconsistente com todos derrotados e personagem ainda abaixo do nível2, o perfil `rihad.outskirts.progressionFloor=2` permite uma nova geração dos encontros comuns **somente ao sair da área esgotada**. Reutiliza o mecanismo de gerações de respawn; não marca MQ02/área concluída, não concede EXP automaticamente e não apaga recibos, reservas ou tesouros. Descansar/recarregar não reativa inimigos. Com algum rato vivo ou nível2+, não há essa reativação excepcional. Outros mapas mantêm a regra anterior.

**Verificação:** `node tools/test-rihad-progression-route.cjs`, Chrome isolado com save normal sintético19. Percurso informante→cama nível1→portão→quatro combates reais→cidade→pousada→visão única; cancelamento, EXP/pontos, save/load e recuperação do caso esgotado. Contatos posicionados de forma controlada, sem modificar atributos ou inimigos. [Resultado](evidencias/m02-rihad-arredores-acesso/resultado.json). Não utiliza saves pessoais nem presume teste do responsável. Reconstrução usa `build-rihad-arrival.cjs`; a área agora é atualizada por ID no JSON, preservando os demais contratos mesmo com formatação multilinha.

**Roteiro público após atualizar a prévia:** conferir nível em Inventário; falar com o informante, voltar ao portão norte e escolher Arredores. Vencer ratos até nível2, podendo retornar à pousada entre combates. Voltar pelo oeste do mapa, seguir placas Pousada e usar a cama. Com visão ainda não lida, terminar a leitura; salvar/carregar e descansar novamente para conferir que não se repete. Não limpar dados do site. Exploração livre de outras dungeons é possibilidade futura para avaliação, sem desbloqueio antecipado nesta correção.


**Atualização posterior:** manuais adiados expressamente pelo responsável; sem aprovação presumida do trecho ou descanso/RAM. [M02-03C](VISAO_RIA_M02_03C.md) integra a visão após nível2 e traz **um roteiro agrupado vigente**; abaixo permanece a referência3022750, na qual o sonho ainda estava ausente. Não exigir repetir os recortes antigos separadamente.

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
