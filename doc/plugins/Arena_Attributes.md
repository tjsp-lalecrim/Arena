# Pontos de atributos — núcleo e acesso funcional

## Aprovação funcional e integração — 29/10/2026

Responsável aprovou funcionalmente o acesso entregue em **38b33427d20a9b189be199dd097104147d42c0d2**, confirmando ganho de três níveis, distribuição de pontos, cancelamento, reinicialização e confirmação da distribuição. Ambiente/dispositivo não discriminados neste relato. Não atribuir persistência, migração, smartphone, percurso completo ou novos casos ao responsável; evidências técnicas existentes permanecem identificadas separadamente. Não é aprovação de equilíbrio definitivo ou do refinamento visual.

Nenhuma mudança funcional após38b3342. Integração/publicação em develop autorizada com histórico preservado. Três pontos de+1 desde nível2 continuam parâmetros provisórios; fórmula da campanha, E05 isolado e refinamento futuro REF15 preservados. Os relatos de avaliação pendente abaixo são históricos anteriores a esta confirmação, sem ampliar seu escopo.


Implementação Codex, sem plugins externos. **MV_AttributePoints 0.1.0** contém regras puras reutilizáveis, sem IDs de ator, armazenamento, menus ou hooks. **Arena_Attributes 0.2.0** integra essas regras a MV_StateStore, Arena_CharacterCreation e Arena_Resources; requer também Arena_Inventory0.3.1 para o acesso funcional e carrega após Arena_BalanceLab para excluir explicitamente o E05. Configuração de Arena e laboratório no segundo plugin. Nenhum arquivo interno do motor alterado.

## Parâmetros provisórios autorizados

`data/ArenaAttributes.json`, schemaVersion1/balanceVersion M01-20/atributos-piloto-R01:

| Campo | Valor inicial | Comportamento |
| --- | --- | --- |
| actorId | 1 | Personagem único |
| firstLevel | 2 | Primeiro nível que concede pontos; inteiro >=2 |
| pointsPerLevel | 3 | Inteiro positivo por nível novo atingido |
| valuePerPoint | 1 | Aumento aditivo por ponto confirmado |
| attributes | [2,3,4,5,6,7] | ATQ, DEF, MAT, MDF, AGI, SOR; não inclui recursos |

Quantidade e valor são provisórios autorizados para este núcleo; não aprovam equilíbrio definitivo, fórmula S02, conjuntos ou interface final. Ajustes futuros afetam somente novas concessões/aplicações: recibos de nível e aumentos já aplicados guardam seus valores. Reduzir a configuração não retira saldo. Não recalcular a soma de aumentos a partir do valor atual do ponto. Mudanças destrutivas de política exigem outra migração/decisão.

## Contrato persistente

Namespace interno **arenaAttributes v1**, em Game_System/MV_StateStore:

~~~json
{"highestLevel":1,"grants":{},"spent":{},"increases":{},"revision":0}
~~~

- `highestLevel`: maior nível observado pela funcionalidade, nunca reduzido por ferramentas que baixem nível.
- `grants`: nível → quantidade concedida naquele nível; saldo = soma(grants) − soma(spent). Nível1 não concede.
- `spent`: ID do parâmetro → pontos consumidos; `increases`: ID → aumento aditivo acumulado, independente da configuração futura.
- `revision`: invalida prévias anteriores a qualquer concessão ou distribuição. Confirmar a mesma prévia duas vezes falha na segunda vez.

Ausência do namespace/campos recebe defaults pelo normalizador existente. Ao extrair save anterior com ator já criado, são registrados **uma vez** os níveis de2 até o nível atual, sem distribuir. Para ator ainda ausente, ocorre na primeira consulta ou evolução. Não é possível inferir máximos históricos de nível que não existiam no save anterior; a migração usa o nível presente. Depois disso, o high-water impede duplicação em load, ganhos múltiplos e redução/retorno de nível. Não modifica namespaces anteriores, schema global, arquivos do editor ou prefixo web **arena:m01:save-v1**.

## Atributos finais e preservação

O bônus é somado em `Game_Actor.paramPlus`; não escreve em `_paramPlus` nem duplica base, equipamento ou bônus racial. O cálculo nativo final continua incluindo taxas, buffs, limites e arredondamentos. `snapshot().rows` separa base, pontos consumidos, aumento distribuído, contribuição aditiva de equipamentos, demais aditivos, taxa e total. A prévia usa uma cópia do ator com delta local, sem equipar, refrescar o personagem real, trocar aparência, aprender técnica ou gastar saldo.

As seis curvas da classe atual permanecem planas (ATQ10/DEF5/MAT8/MDF5/AGI10/SOR10 em todos os níveis), sem introduzir crescimento automático adicional. Banco/geradores de dados não alterados. Novas curvas futuras devem preservar essa separação. Vida/Mana/Vigor mantêm a escolha independente de +10 por nível em Arena_Resources. Concessão e distribuição não chamam refresh/rest/recover e não curam. Equipamentos, raças, fórmula da campanha, custos e E05 permanecem como estavam; nenhuma alegação de utilidade/balanceamento final de MDF/SOR por existir um incremento numérico.

## API

- `ArenaAttributes.snapshot()`: nível, maior nível, total concedido, saldo, revisão, decomposição dos seis parâmetros; `excluded` indica E05.
- `preview({'2':1,'4':2})`: proposta de três pontos, um em ATQ e dois em MAT. Retorna `ok`, motivo se inválida, revisão/configuração, alocação copiada, saldo previsto e totais antes/depois. Consulta não consome. Cancelar significa descartar esse objeto.
- `apply(preview)`: revalida saldo, IDs, inteiros, revisão/configuração e contexto antes de gravar tudo de uma vez; booleano. Bloqueada em batalha e E05, como a prévia. Ganhos de nível em batalha concedem saldo normalmente; a distribuição aguarda sair.

Sem redistribuição, ação de combate ou restrição racial/profissional. Pontos não usados permanecem disponíveis. O acesso funcional R02 usa Inventário → Atributos, sem outra entrada no menu principal; a apresentação definitiva permanece futura.

## Acesso técnico seguro

Pelo título, **Laboratório de atributos (sem saves)**. Nova sessão Bretã feminina nível1, recursos reduzidos35/10/20 para evidenciar ausência de cura. Reutiliza Window_Command/Window_Base e a tela existente de recursos. Não carrega uma partida pessoal.

1. **Ganhar 1 nível**: nível2/saldo3. **Ganhar 3 níveis**: mais três níveis/saldo+9.
2. Escolher **ATQ +1**, **DEF +1**, **MAT +1**, **MDF +1**, **AGI +1** ou **SOR +1**. Conferir Total/prévia e **Cancelar prévia**: saldo e totais intactos. Reabrir e **Confirmar distribuição**.
3. **Escolha Vida/Mana/Vigor** abre o componente existente, independente dos pontos. Esc/Voltar retorna.
4. **Guardar em memória**, ganhar outro nível/distribuir e **Carregar da memória**: volta ao estado guardado, sem arquivo/slot. **Reiniciar sessão técnica** descarta tudo e volta ao nível1.
5. **Inventário / acesso normal** abre o inventário real; sua navegação **Atributos** abre a mesma tela da campanha, preservando o isolamento e o bloqueio de saves. Ganhar3 níveis desde1 fornece9 pontos, sem depender de batalhas.
6. **Voltar ao título** descarta a sessão. Nova partida e carregamento normal continuam disponíveis.

Setas/Enter/Esc, mouse ou toque. Comportamento nativo de seleção: primeiro clique/toque seleciona outra opção, novo clique/toque na opção a aciona; Enter confirma a selecionada. Modal desativa comandos de trás; soltura exigida antes de nova ação. Conteúdo inspecionado em816×624, não é redesign definitivo/mobile.

Sessão ligada ao Game_System atual; bloqueia saveGame, saveGameWithoutRescue, saveGlobalInfo, makeSaveContents e comando de salvar. Guarda em memória chama somente a serialização interna capturada e nunca StorageManager. Fechar/reiniciar perde a memória por definição. Retorno ao título/nova partida/load limpa o contexto e restaura o último slot selecionado, sem alterar seu conteúdo. Não usar consoles para contornar os bloqueios. E05 preserva seus quatro perfis e bloqueios próprios; não ganha/aplica pontos novos.

## Verificação histórica do núcleo R01 — f6de74d

`node tools/test-attribute-points.cjs`, com Playwright/Chrome locais: seis grupos focais em servidor efêmero e perfil isolado. Save real gerado com o registro pré-feature e carregado na composição nova; múltiplos loads; doze pontos retroativos no nível5; equipamentos/buff/nativo/raça/recursos preservados; prévia/cancelamento neutros; aplicação única e seis IDs; inválidos/batalha/prévia obsoleta; parâmetros configuráveis sem recalcular passado; escolhas de recursos independentes; níveis1–99 sem crescimento duplicado; totais dos quatro E05 preservados; teclado/toque; memória sem escritas normais e saída liberando saves. [Resultado](../evidencias/atributos-nucleo-r01/resultado.json), [tela](../evidencias/atributos-nucleo-r01/laboratorio.png), [prévia](../evidencias/atributos-nucleo-r01/previa.png).

Sem campanha completa, nova autoria/execução no editor ou aparelho físico. Compatibilidade estrutural do registro/arquivos conferida separadamente; não equivale a operação manual do editor. Esse registro antecede a aprovação posterior restrita ao laboratório, descrita abaixo; interface definitiva e equilíbrio permanecem pendentes. Sem merge/push/Pages.

## Aprovação do laboratório e acesso funcional R02

Responsável aprovou o **funcionamento do laboratório entregue em f6de74d**. Não informou ambiente nem casos discriminados; não inferir aprovação do balanceamento, do design definitivo ou do uso na campanha. Esta R02 acrescenta o acesso funcional para nova avaliação. Refinamento visual futuro vinculado ao registro único REF15 em [REFINAMENTOS_POS_INTEGRACAO_M01.md](../REFINAMENTOS_POS_INTEGRACAO_M01.md), sem novo ID duplicado.

**Caminho normal:** abrir menu → **Inventário** (ou Equipamentos) → **Atributos (saldo)** na faixa existente. A integração opcional Arena_Inventory0.3.1 mantém Inventário/Equipamentos/Voltar e acrescenta esse acesso, sem outro comando no menu principal ou reformulação de seus dados. Pelo teclado, Tab alterna as áreas do inventário; focar a faixa de navegação, selecionar Atributos e Enter. Mouse/toque podem acionar diretamente a opção na faixa.

Na tela, **+ ATQ/DEF/MAT/MDF/AGI/SOR** acrescenta um ponto ao rascunho e **−** retira somente pontos ainda não confirmados. A tabela reutilizada do laboratório mostra atributos atuais e totais previstos com modificadores; o saldo informa pontos na prévia e restantes. **Confirmar conjunto** abre a confirmação reutilizada; somente **Confirmar distribuição** grava o lote na API aprovada. **Cancelar prévia**, **Limpar prévia** ou sair com **Voltar sem aplicar/Esc** descartam o rascunho, sem alterar personagem/recursos/inventário. Retirar do rascunho não é redistribuir pontos já gastos. Saldo zero continua consultável, mas adicionar/confirmar ficam indisponíveis. Não há níveis, reinício, memória ou comandos técnicos nessa tela.

API adicionada: **canOpen()**, fora de batalha/E05 e com personagem criado; **open()**, booleano, empilha a tela. A aplicação continua revalidada pelo núcleo sem duplicar consumo. Modal bloqueia controles de trás; exige soltura para outra ação e protege o retorno ao inventário. Ao retornar/carregar, a navegação e o quadro de atributos consultam os dados atuais. Saves normais preservam saldo/aplicações; rascunho de tela não é gravado. Namespace, schema, parâmetros provisórios, recursos, fórmulas, raças e equipamentos não mudam.

### Avaliação determinística sem saves pessoais

No título: **Laboratório de atributos (sem saves)** → **Ganhar 3 níveis** → **Inventário / acesso normal** → **Atributos (9)**. Montar um conjunto em dois atributos, conferir a prévia, cancelar e confirmar outra tentativa. Não é preciso gastar todos os pontos. **Voltar sem aplicar** retorna ao inventário; Esc retorna ao laboratório. Esse caminho usa o mesmo acesso real, mas mantém os saves normais bloqueados; para guardar/carregar esse estado, retornar ao laboratório e usar a memória. Não declara aprovação da campanha pelo responsável.

Teste de save normal foi automatizado em uma **partida normal sintética**, fora dos flags de laboratório, com nível3/mapa/etapa narrativa preparados para isolar este recorte. Não é relato de percurso natural completo. Para uma avaliação manual de save normal, usar perfil/slot exclusivo de teste com personagem que já tenha saldo, salvar pelo menu e carregar; não sobrescrever saves pessoais nem exigir batalhas repetidas nesta entrega.

### Evidência R02

**test-attribute-campaign.cjs**, seis grupos em Chrome156.0.8078.73/perfil e origem descartáveis: entrada normal mapa→menu→inventário por teclado; composição sem comandos técnicos; rascunho múltiplo, modal sem acionamento pela mesma pressão e cancelamento; mouse/toque emulado, confirmação única, saldo restante; saída descartando prévia, atualização no inventário, save/load nativo e reentrada por toque; saldo zero e bloqueio em batalha; atalho determinístico protegido. Valores finais incluem equipamento, aditivo nativo e buff, sem cura ou alterações colaterais. [Resultado](../evidencias/atributos-campanha-r01/resultado.json), [acesso](../evidencias/atributos-campanha-r01/acesso-inventario.png), [prévia](../evidencias/atributos-campanha-r01/previa-conjunto.png).

Reutilizados os seis grupos do núcleo, reexecutados por alteração da tabela compartilhada e do acesso técnico, com saída independente para preservar a evidência R01: [regressão](../evidencias/atributos-campanha-r01/regressao-nucleo/resultado.json). Sem bateria completa de gameplay. Inspeção em816×624; viewport916×412 emulado preserva os limites internos e registra a redução de apresentação, sem afirmar legibilidade física aprovada ou design final. Nova avaliação manual da campanha, autoria/playtest MV e smartphone físico não executados. Sem merge/push/Pages.
