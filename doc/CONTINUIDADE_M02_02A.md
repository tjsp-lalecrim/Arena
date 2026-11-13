# M02-02A — núcleo de continuidade em laboratório

**Relato posterior01/11/2026:** responsável executou o laboratório, não compreendeu claramente os resultados e autorizou avançar ao02B. Registrar autorização, não aprovação manual dos detalhes técnicos. Evidências abaixo preservadas; não exigir repetição de estruturas internas. [Continuidade02B](CONFIGURACOES_M02_02B.md). O estado anterior abaixo é histórico do recorte.

01/11/2026. Implementado para **avaliação do responsável**, sem avanço a M02-02B. Feature/m02-02a-continuidade deriva de develop85940d4 pelos dois commits apenas documentais c8bf765/34c2f95, preservados como dependências. Nenhuma integração em develop/main, push, release ou atualização Pages nesta entrega. Tag m01 continua df539eeee2d88199312ca3a8cba98edd2b2b900b.

Regras aprovadas em [MQ02_ESPECIFICACAO.md](MQ02_ESPECIFICACAO.md); API, configuração e dependências em [plugins/Arena_Continuation.md](plugins/Arena_Continuation.md). O núcleo separa pré-requisito/identificadores de efeitos de mapa, e o adaptador reconhece os estados normais M01 sem curar, premiar ou redistribuir. Somente novo namespace interno e recibos de transição são acrescentados; nenhum namespace web alterado.

## Avaliação manual em localhost

Abrir **http://127.0.0.1:8774/** → no título, rolar até **Continuidade M02 (sem saves)**. Não usar Continuar/slots pessoais para esta avaliação. Setas/Enter e clique/toque usam os componentes existentes; soltar o comando entre ações. O laboratório inicia na fixture `ending`, com Vida31/110, Mana12/60, Vigor23/100, nível3,4 pontos livres e37 ouro.

| Opção | O que demonstra |
| --- | --- |
| **Pré-Gate** → **Simular Gate (fixture)** | Continuação inicialmente bloqueada; conclusão sintética libera a oferta sem prêmios/recuperação. Não é jogar a dungeon nem modificar sua quest real |
| **Fim M01: ending** / **Fim M01: ended** | Ambos reconhecidos como elegíveis. **Continuar jornada** abre confirmação; Esc/**Cancelar sem alterar** conserva o estado e permite tentar novamente |
| Confirmar continuação técnica | Registro muda para “em deslocamento”, com IDs `campaign/MQ02.begin` e `technical.resources.arrival`. Repetição não reinicia nem premia |
| **Guardar RAM** → **Concluir deslocamento** | Guarda a viagem incompleta e chega ao **Map005**, laboratório de recursos existente, em(4,7). Não é Rihad. Não usar os eventos de recursos para conferir preservação, pois eles alteram recursos intencionalmente |
| No destino: Esc → **Voltar ao laboratório M02** → **Carregar RAM** | Restaura o deslocamento guardado. Concluir novamente, voltar, Guardar RAM e Carregar RAM permite observar a chegada já concluída, sem nova oferta |
| **Introdução parcial** | Mostra reconhecimento de cursor parcial; não permite pular para M02. Não reproduz nem refaz a intro na campanha |
| **Sessão técnica** | Não elegível, sem conversão automática |
| **Estado incompatível** | Tenta carregar uma cópia inválida; rejeita e conserva a fixture/snapshot atual. Mensagem de diagnóstico, sem dados apagados |
| **Voltar ao título** | Descarta tudo desta sessão; nenhuma gravação em slot normal. RAM também desaparece com F5/fechamento |

Servidor dedicado em127.0.0.1:8774, processo Python **PID10096**, iniciado somente após conferir porta livre; outros serviços não foram substituídos/encerrados. Permanece ativo para avaliação. Para encerrar, confirmar que o PID ainda corresponde a este servidor e usar `Stop-Process -Id 10096`. Se reiniciado, conferir o novo PID; não reutilizar o número cegamente. Não há publicação externa. A origem8774 tem armazenamento distinto de8765/Pages/outros perfis; o laboratório bloqueia gravações de qualquer modo.

## Verificação focal executada

[Resultado](evidencias/m02-02a/resultado.json): Chrome156.0.8078.76 automatizado, contexto descartável e servidor em porta efêmera. **Oito grupos**: regras puras; reconhecimento/entrada; confirmação/cancelamento/nova pressão; guard de escrita e RAM; chegada inválida e restauração repetida; save/reload/load nativo de fixture m01 e fim original; persistência nativa de travelling/arrived; rejeição de schema futuro com sessão/arquivo intactos, cursor de intro e migração narrativa1→2, exclusão de laboratórios/E05. E05 avaliado por contexto simulado, sem iniciar batalha. Salvar/load nativos usam slots9–12 **somente no perfil automatizado isolado**; esses slots não são usados pelo acesso manual e nenhum perfil pessoal foi aberto.

Comparados personagem, atributos, pontos/saldo, recursos gastos, equipamento/inventário/ouro, magias, quests, fontes e recibos antes/depois, exceto novo namespace e posição/destino explicitamente transferidos. Normal ending mantém somente Salvar/Voltar ao título; a continuação real continua desabilitada. Registro de plugins canônico UTF-8 sem BOM,36 registros anteriores intactos+2 novos, arquivos referenciados presentes. `test-state-store.cjs` passou (contratos/migração/recibos/rollback/defaults). Sintaxe dos plugins/roteiro conferida. Sem campanha completa ou novos combates executados.

Inspecionadas capturas na resolução lógica816×624: [transição](evidencias/m02-02a/transicao-em-ram.png), [destino técnico](evidencias/m02-02a/destino-tecnico.png). Servidor manual respondeu HTTP200 para entrada/plugin. Validação automática não equivale à aprovação do responsável ou autoria no MV.

**Pendentes:** avaliação manual deste acesso e abertura/leitura/salvamento/reabertura dos novos plugins no editor MV1.6.1, sem alegar testes já feitos. Mobile fica no MOBILE-01, não bloqueia este recorte desktop. Sem teste novo em smartphone, geração de arte, mapa, banco ou regras de combate. Rihad/continuação real e generalização de quests/áreas permanecem futuros. Aguardar avaliação antes de ampliar.
