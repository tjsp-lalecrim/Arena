# Arena_DebugHub0.1.0 — acessos técnicos

Manutenção delimitada do M02, feature `feature/m02-debug-hub` derivada de6956516 para preservar as dependências ainda não integradas. Nenhuma fixture, regra de combate, mapa, asset, namespace ou formato de save alterado.

## Acesso e inventário

Título → **Testes / Debug**. Três categorias:

| Categoria | Acessos preservados |
| --- | --- |
| Personagem (5) | Laboratório técnico, recursos, habilidades, inventário e atributos |
| Combate (5) | Combate técnico/pilotos de armas/E05, loot, encontros, esqueleto e ghoul de batalha direta |
| Campanha e mapas (14) | Duas amostras de arte, Imperial Dungeons, descanso, continuidade M02, chegada de Rihad, visão de Ria, audiência, Stonekeep passagem/materiais/CASK/CASL, patrulha e ghoul na ilha |

Registro principal: [ArenaDebugHub.json](../../data/ArenaDebugHub.json). Nomes visíveis e disponibilidade são obtidos dos comandos anteriores, não renomeados por heurística. [Inventário completo e evidências](../evidencias/m02-debug-hub/resultado.json) compara os22 acessos com o título anterior ao plugin. Novo Jogo, Continuar e Opções mantêm nomes, handlers e condições normais.

Atualização posterior:24 acessos no total, incluindo **Stonekeep · ghoul (RAM)** em Combate e **Stonekeep · ghoul na ilha (RAM)** em Campanha e mapas, registrados por Arena_Ghoul pela API central. [Escopo/testes e distinção entre batalha vazia e recompensas do encontro](../GHOUL_M02.md). Os22 anteriores e a configuração do hub não foram alterados; a ilha contém só um piloto, sem grupo completo.

**Stonekeep:** Testes / Debug → Campanha e mapas → **Stonekeep · passagem (RAM)** para a viagem; materiais/CASK/CASL para consulta visual. **Esqueleto:** mesma categoria → **Stonekeep · patrulha (RAM)**; batalha direta em **Combate → Stonekeep · esqueleto (RAM)**. O preparo e as recompensas continuam sendo os de cada fixture original.

Avaliação local em **http://127.0.0.1:8774/**, recarregando sem apagar dados. O serviço existente foi preservado; bytes HTTP do plugin, registro e configuração conferidos contra esta feature. Nenhum servidor pessoal substituído. Testes automatizados usam outro servidor/origem temporários, encerrados ao terminar.

Setas selecionam, Enter abre; direita entra na lista, esquerda/Esc retorna às categorias; Esc nas categorias ou Voltar ao título fecha o hub. Listas usam rolagem nativa por teclado/roda e comportamento nativo de seleção/confirmação por mouse/toque. Descrição e regra de salvamento acompanham a seleção, sem depender de hover. Categoria e item selecionados são lembrados na sessão. É necessário soltar a entrada antes de confirmar no novo painel; nenhuma solicitação fica enfileirada.

Os laboratórios preservam **seus próprios retornos**: por exemplo, Esc no seletor de combate volta ao título, e laboratórios RAM têm sua saída existente. O título retorna com Testes / Debug selecionado; reabri-lo conserva a categoria/item. Não substituir essas saídas por chamadas diretas entre fixtures.

## Configuração e contrato

- `schemaVersion:1`, `enabled:true` no desenvolvimento. Sem inferência por localhost, protocolo, NW.js ou presença de ferramentas.
- Plugin carregado depois dos provedores anteriores. Ele captura as entradas/handlers existentes, classifica pelos símbolos declarados e deixa somente os comandos normais e uma entrada técnica no título. Um símbolo não classificado causa diagnóstico explícito, em vez de esconder um comando de campanha por semelhança de nome.
- O lançamento retorna internamente a uma **Scene_Title real** e só então chama o handler original, depois das rotinas normais de limpeza. Isso preserva os handlers vinculados ao título e a pré-condição de Continuation. Não copiar suas fixtures, não criar outro preparador de saves/recursos.
- Registro de novos testes: `ArenaDebugHub.register(entry,handler)` depois do plugin, com `symbol`, `name`, `category`, `description`, `saving`. Não acrescentar novo comando ao título. Acessos legados usam os símbolos/handlers já existentes, com metadados centralizados no JSON. Comandos normais adicionais precisam de classificação explícita em `normalTitleSymbols`.
- `enabled:false` remove o acesso e os handlers técnicos da janela de título e impede `open()`. Não é uma barreira de segurança contra o console; nenhuma ferramenta/console foi acrescentada.
- Não há nova política de salvamento: atributos, E05 e continuidade/Stonekeep RAM mantêm seus bloqueios. Laboratórios antigos que permitem salvamento normal continuam permitindo, com indicação para usar slots de teste; não apresentá-los como RAM isolada. Nenhum save pessoal é carregado automaticamente.

## Pacotes e limites

`node tools/build-web-package.cjs` gera perfil **player**, sobrescrevendo somente `enabled:false` na cópia de ArenaDebugHub.json. `--technical-preview` habilita intencionalmente o hub na cópia e usa diretório com sufixo `-technical`. Fonte permanece intacta; manifesto registra perfil, valor e hash da configuração de origem, além dos bytes finais. Namespace **arena:m01:save-v1** inalterado. Ver [procedimento de pacote](../PACOTE_WEB_M01_19.md).

O pacote/Pages/tag m01 já publicados não foram modificados. O workflow remoto e sua política de bytes continuam vinculados à publicação aprovada anteriormente; esta tarefa não atualiza infraestrutura remota nem autoriza publicar este novo SHA.

## Validação desta entrega

`node tools/test-debug-hub.cjs`: Chrome isolado/origem efêmera; inventário antes/depois, título compacto, soltura/foco/rolagem/retorno, um acesso por categoria, mouse/toque emulado, configuração desabilitada na mesma origem e bloqueio dos slots RAM. Sem executar batalhas ou percursos completos. [Título](../evidencias/m02-debug-hub/titulo.png), [hub](../evidencias/m02-debug-hub/hub.png), [modo desabilitado](../evidencias/m02-debug-hub/titulo-desabilitado.png).

`node tools/test-debug-package.cjs`: fixture temporária mínima versionada, sem copiar biblioteca de assets/saves; dois builds reproduzíveis por perfil, manifesto/hashes conferidos, fonte e namespace preservados. [Resultado](../evidencias/m02-debug-hub/package-profile.json). Não é um novo pacote de distribuição do jogo nem deploy.

Responsável confirmou que a navegação de **d800a8f funcionou**. Ambiente e outros casos não informados; não ampliar a cobertura do relato. Nenhuma nova inspeção no editor MV1.6.1 ou dispositivo físico declarada. Formato canônico e registros anteriores de js/plugins.js preservados; o plugin próprio é o único acréscimo, sem dependência externa. Esta confirmação não autoriza ampliar ferramentas.

**M02-05:** registro adicional `arenaCourtDelivery`, **Rihad · entregar pergaminho (RAM)**, categoria Campanha e mapas. Reutiliza fixture/guardas existentes;25 acessos ao todo com os dois do ghoul, sem ampliar o título. [Roteiro](../ENTREGA_PERGAMINHO_M02_05.md).

**Lobo M02:** registro `arenaWolf`, **Stonekeep · lobo (RAM)**, em Combate;26 acessos com o anterior da entrega, sem comando novo no título. [Piloto e restrições](../LOBO_M02.md); o modo jogador desabilitado permanece preservado.

**Lobo de exploração:** `arenaWolfPatrol`, **Stonekeep · lobo na passagem (RAM)**, categoria Campanha e mapas;27 acessos ao todo. Preserva a antiga batalha direta, fixtures/retorno e bloqueio de slots; nenhuma nova opção no título. [Cobertura](../LOBO_M02.md).

## Versão 0.1.1 — identidade local discreta

Com metadados `window.ArenaDevBuild` injetados exclusivamente pelo servidor de desenvolvimento, o cabeçalho mostra SHA curto/árvore alterada/assinatura dos arquivos carregados e consulta uma vez a versão em disco ao abrir o hub. Diferença sugere F5 quando seguro, sem reload automático ou limpeza de dados. Sem os metadados, conserva a apresentação anterior e não consulta endpoint local (Pages/editor inalterados). [Contrato do servidor e procedimento](../EXECUCAO_LOCAL.md). Sem novo plugin, consumidores de recursos ou alterações nas fixtures/slots.
