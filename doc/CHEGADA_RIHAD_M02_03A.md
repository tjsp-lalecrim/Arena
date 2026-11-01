# M02-03A — primeira chegada a Rihad

**Relato posterior do responsável:** acesso à chegada pela estrada e ao informante confirmado, associado à referência disponível b8738b9. Descanso e guardar/carregar na chegada **não explicitamente confirmados**; não registrar aprovação completa. Ambiente/SHA não informados no relato. [M02-03B](ARREDORES_RIHAD_M02_03B.md) acrescenta arredores e atualiza o mesmo acesso para nível1/RAM; roteiro e limites abaixo descrevem a unidade03A original.

01/11/2026. Feature `feature/m02-chegada-rihad`, derivada de **4ff291a**, preservando as dependências02A/02B sem integrar branches. **Amostra para avaliação, não aprovação estética nem conclusão de M02-03.** Tag m01 intacta; nenhum push/Pages.

## Conteúdo e fontes

Map009, **M02-03 Rihad — chegada (amostra)**:21×15 tiles, chegada `rihad.arrival` em **(10,11)**, informante em **(9,7)**, plataforma autorizada de repouso em **(15,10)**.121 células alcançáveis contando o ponto de chegada, sem encontros. Mapa fixo, não procedural; não há reprodução declarada da planta original. Muralhas usam cap/teto1 e face2 dentro das células sólidas; a rua/esplanada tem áreas abertas maiores que3 tiles. Colisão nativa por flags, independente da plataforma visual3×3. Sem teto sobre caminho e sem saída acidental pelos limites.

Consultados: [especificação](MQ02_ESPECIFICACAO.md), [contratos02B](CONFIGURACOES_M02_02B.md), diretivas de mapas/arte/navegação e PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.2, incluindo a pequena captura identificada **Rihad**. Confirmados pela wiki: cidade no sul de Hammerfell; busca de informações entre moradores; palácio junto à muralha. A imagem mostra pavimentação clara e edificações de pedra/volumes escuros; sua baixa definição não confirma detalhes menores. Instalação original consultada em modo leitura para inventário de arquivos MIF; **nenhum mapa foi identificado como Rihad/decodificado nem houve observação nova no executável DOS**. Não afirmar coordenadas/traçado canônicos.

**Adaptações:** chegada pela estrada após elipse de viagem; esplanada, posição do informante e plataforma definida como repouso. A arquitetura de chegada ainda é **provisória**: reutiliza `Arena_Dungeon_M14_R03.png`, sem grades/correntes/Gate/decoração da cela. O NPC usa `$Arena_redguard_male_walk_r02.png` como representação provisória de morador, sem identidade canônica inventada. Não são um novo padrão aprovado de cidade, nem conclusão da identidade arquitetônica de Rihad. Não houve geração/edição de imagens, prompts novos ou lote. Pixels e animações anteriores preservados.

## Continuação e limite desta versão

Campanha antes do Gate mantém MQ01. A conclusão existente leva à tela final, agora com **Continuar jornada**, **Salvar** e **Voltar ao título**. Escolher título não inicia MQ02. Escolher continuar registra `campaign/MQ02.begin` com destino `rihad.arrival`, transfere e registra `campaign/MQ02.arrive`; a primeira chegada cria MQ02 em10. Nenhuma recompensa, EXP, cura, recriação do personagem ou repetição de MQ01. Um save interrompido em viagem retoma o destino; um save já chegado permanece na posição salva.

Fase/cursor/histórico M01 permanecem no namespace anterior; o registro de capítulo passa a ser a autoridade de roteamento depois da continuação. Namespace web **arena:m01:save-v1** e schema dos saves inalterados. O salvamento normal da campanha funciona no novo mapa, com os mesmos slots. Continuar uma campanha é ação explícita; laboratório/E05 não são promovidos automaticamente.

Informante em10 orienta sobre lugar/repouso e informa o limite do teste, **sem simular sonho/conclusão**. Se a quest estiver legitimamente em20+, aponta a corte, ainda indisponível; a conversa não avança etapa. Descanso reutiliza `ArenaRecovery.usePoint` e a indicação/proteção compartilhadas: recuperação integral fora de batalha, sem passagem de horas, regeneração passiva, respawn ou tesouros. O nível1 pode visitar/descansar, mas sua oportunidade de EXP e a visão completa continuam próximas unidades, não implementadas nem consumidas aqui.

## Avaliação determinística, sem slots pessoais

Servidor já existente **http://127.0.0.1:8774/** conferido pelo conteúdo de ArenaRihad.json; não foi reiniciado nem substituído. Pelo editor, abrir Game.rpgproject → playtest. Em ambos:

1. No título, selecionar **Rihad · chegada (teste RAM)**. Surge uma Bretã sintética nível3 em(10,11), com Vida31, Mana12 e Vigor23. Nada foi carregado de saves pessoais.
2. Caminhar com setas ou clique até o informante(9,7), ficar ao sul e pressionar Enter/tocar o evento: orientação e limite da amostra, sem avanço artificial.
3. Antes de descansar, Esc → **Guardar chegada em RAM**. Aproximar-se da plataforma(15,10) e usar Enter ou a indicação **Descansar · Enter / toque**: os três recursos ficam completos.
4. Esc → **Carregar chegada da RAM**: posição e recursos gastos retornam ao snapshot. Este teste não usa disco/localStorage; fechar/recarregar o navegador perde o snapshot. **Salvar normal permanece desabilitado nessa fixture**, intencionalmente.
5. Para sair, Esc → **Sair** → **Para o Título** (ou retornar ao laboratório e escolher **Voltar ao título**). O comando seguinte exige soltura/nova pressão após mensagens.

O save/load **normal** foi verificado tecnicamente em perfil/origem descartáveis pela cena nativa Salvar/Carregar, incluindo F5; não exigir partida pessoal para esta avaliação. Numa campanha elegível, **Continuar jornada → Esc → Salvar** usa normalmente os slots existentes, sem fixture. Se quiser repetir esse caminho manual, usar um perfil de teste separado. Não transferir saves entre origens/perfis nem limpar dados do site.

## Evidências e pendências

[16 grupos focais](evidencias/m02-03a/resultado.json), Chrome156 desktop headless: chegada, preservação,121 células acessíveis/limites/NPC, conversa, clique, repouso/tecla mantida/toque emulado/bloqueio em batalha, RAM, salvar/F5/carregar nativos, ending/ended/cancelamento/continuação única, viagem interrompida e reconstrução idempotente. Sem erros não tratados ou recursos HTTP ausentes. Capturas reais: [chegada](evidencias/m02-03a/chegada.png), [informante](evidencias/m02-03a/informante.png), [descanso](evidencias/m02-03a/descanso.png), [carregada](evidencias/m02-03a/carregada.png).

Reutilizadas as evidências02A/02B para introdução parcial, bloqueios laboratoriais e contratos não alterados; não repetidos percurso M01, laboratório completo ou23 cenários MQ01. Comparação estática preserva Map008, banco anterior/itens, regras de combate, fontes/recibos e40 repousos da dungeon. [Verificações estáticas](evidencias/m02-03a/contratos.json): registro canônico41 plugins, arquivos/sintaxe e preservação de m01/banco/Map008/pontos anteriores. Compatibilidade MV conferida por estrutura/sintaxe/registro; **nova abertura/edição/playtest no editor e teste físico não executados**, sem extrapolar aprovações M01.

Avaliação observável pendente do responsável: caminho/escala provisória, conversa e repouso. M02-03 permanece parcial: corte, missão, arredores/EXP nível1, visão de Ria e demais viagens ausentes. Aguardar avaliação da chegada antes de ampliar ou gerar variantes. Próximo critério de M02-03 a atender: oportunidade coerente de evolução do nível1 antes do sonho, numa unidade controlada; não iniciada.
