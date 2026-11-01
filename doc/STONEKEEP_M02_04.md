# M02-04 — amostra integrada de Stonekeep

## Correção confirmada — cache HTTP de Items.json

Responsável informou a resposta da aba afetada: `http://127.0.0.1:8774/data/Items.json`, **200 OK (from disk cache)**, Content-Length2902, Date01/11/2026 12:12:32GMT, Last-Modified26/10/2026 21:44:49GMT, IDs1–6 sem7. [Relato exato](evidencias/m02-04-items-cache/relato-responsavel.json). No disco e no servidor atual:3425bytes, IDs1–7, item7=Pergaminho de Stonekeep/itypeId2, SHA256 `9fa45c1ac5a91395ad85c75d97c67a83d8e997ee44ee7e90913437625566e746`. Não foi apagado ou recriado genericamente: o cadastro contratado já existia. O relato **não aprova a amostra**.

**Causa comprovada:** resposta antiga reutilizada pelo cache HTTP, não ausência atual no disco nem alteração posterior de $dataItems. Busca nos plugins não encontrou escritor que removesse o item; o carregador nativo faz JSON.parse da resposta recebida. A reprodução controlada com bytes históricos de faccbec, Last-Modified antigo e ausência de Cache-Control (comportamento do servidor Python) demonstrou abertura nativa falhando com item7 ausente/transferSize0, enquanto uma leitura sem cache recebia7. [Antes da correção](evidencias/m02-04-items-cache/reproducao-anterior.json). A confirmação do cache na aba pessoal vem dos headers fornecidos pelo responsável, não de inferência sobre o teste isolado.

**Correção:** Arena_Stonekeep passa a solicitar somente em HTTP/HTTPS `data/Items.json?arena-data=stonekeep-parchment-v1`. É revisão explícita do conteúdo exigido, não timestamp, versão de build, namespace ou migração de save. URL antiga e seu cache continuam intactos; arquivos/file:// do editor permanecem com o caminho nativo. Contrato inválido ainda interrompe com diagnóstico específico; não há item/default inventado, recarga automática ou remoção da validação. Em nova alteração do contrato de Items, revisar essa chave de conteúdo na entrega pertinente, sem trocar o namespace de partidas.

**Verificação focal:** `node tools/test-stonekeep-items-cache.cjs` aquece o cache com o arquivo histórico numa origem/perfil descartáveis e publica os bytes atuais em servidor estático de teste, sem interceptar o navegador nem injetar registro. Scene_Boot inicializa antes do laboratório. O jogo abre com7, a URL antiga continua retornando1–6 do cache (prova de que não foi limpo), e a opção RAM permite viagem real/coleta única/diário50 sem mudar MQ01 ou gravar slots. [Resultado e reconstrução](evidencias/m02-04-items-cache/resultado.json), [coleta](evidencias/m02-04-items-cache/coleta.png). A reconstrução pelo gerador pai ocorre em cópia mínima de dados/ferramentas, sem assets:7 ausente é recomposto com os campos contratados,1–6 e um8 sintético de marco posterior são preservados, repetição é idempotente. Nenhum gerador que removesse7 no projeto atual foi identificado; essa regressão protege contra truncamento futuro.

A regressão de abertura no **servidor real8774** também foi repetida: bytes HTTP iguais ao disco, título, laboratório, viagem e fonte disponíveis, MQ01/storage preservados. [Resultado atualizado](evidencias/m02-04-boot/resultado.json). Nenhum save/dado do site foi apagado; sem editor/mobile/campanha completa nesta correção. A lacuna dos testes anteriores era perfil vazio/servidor no-store, sem cache de versão anterior. Amostra permanece aguardando avaliação do responsável.

Conferência dos processos revelou dois Python HTTP com o mesmo diretório Arena/porta8774. A checagem anterior por Get-NetTCPConnection não os detectou e foi incorreto registrar a porta como livre. Somente o duplicado19428, iniciado pelo agente, foi encerrado; servidor original10096 preservado e oito requisições novas conferidas. A duplicidade não explica a resposta antiga do item: o header informado confirma **disk cache**.

## Histórico — investigação de inicialização após29e38db —01/11/2026

Responsável encontrou “Stonekeep: vínculos inválidos” em localhost e não conseguiu avaliar a amostra; **nenhuma aprovação registrada**. Na árvore limpa29e38db, uma abertura nativa em Chrome novo no servidor existente `http://127.0.0.1:8774/` chegou ao título **antes da alteração**: registro pronto/diagnostics vazio, área stonekeep/mapId12, fonte stonekeep.parchment/itemId7, item7 existente/itypeId2. Ordem final CampaignConfig→Rihad→Ria→Court→Stonekeep correta. Bytes HTTP de configurações/plugins conferidos com o diretório atual. Não foi possível identificar qual condição falhou na aba original do relato; cache/arquivo divergente é hipótese, não causa confirmada. Endereço e diagnóstico daquela execução ainda necessários se o erro persistir.

Alteração limitada: substituir a validação genérica por diagnósticos separados de configuração/registro, consulta e mapId da área, consulta e itemId da fonte, existência/classificação do item, incluindo diagnostics do registro quando houver. Mantém bloqueio de configuração inválida, sem defaults, reconstrução automática do registro ou liberação forçada da viagem. Não se apresenta como correção comprovada da causa ainda não reproduzida. Nenhuma informação nova no fluxo sem erro.

Regressão única `node tools/test-stonekeep-boot.cjs` (ARENA_BOOT_URL opcional): usa o **servidor real**, perfil Chrome descartável/cache normal e abertura nativa **antes** de qualquer seleção de laboratório; sem init script, interceptação HTTP, mocks ou registro pré-carregado. Confere seis condições, bytes servidos, opção RAM, escolha de viagem, Map012/fonte ativa, MQ01/armazenamento inalterados, bloqueio de save técnico e recarregamento normal. [Resultado](evidencias/m02-04-boot/resultado.json), [título](evidencias/m02-04-boot/titulo.png) e [chegada](evidencias/m02-04-boot/chegada.png). Todos passaram após o detalhamento. Nenhum save pessoal aberto/modificado ou dado do site apagado.

A evidência anterior é válida para seu servidor efêmero com Cache-Control:no-store e arquivos do diretório, mas **não cobria os bytes/cache do servidor pessoal** nem identifica a falha relatada. Não havia pré-registro ou fixture antes do boot no teste anterior; as fixtures vinham depois do título. A lacuna corrigida na verificação é o uso do endereço real e a comparação dos arquivos servidos, não uma prova retroativa de causa ou aprovação manual. Novo editor/mobile e campanha completa não testados nesta investigação. O restante abaixo registra a amostra29e38db.

01/11/2026. Feature `feature/m02-stonekeep-amostra`, sobre **faccbec**, com dependências02A/02B/03A–D preservadas. Amostra caminhável/coleta/retorno **para avaliação**, não dungeon ou encontros concluídos. Tag m01 intacta; sem entrega do pergaminho, Fang Lair, arte nova ou alteração de combate.

## Recorte registrado antes da construção

Fonte local: `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, **p.2**, descrição/planta de Stonekeep e sprite do pergaminho; **p.5**, planta Codex Scientia e notas (Golthog não é encontrado). Inspeção visual das duas páginas e imagens incorporadas. Consulta somente leitura do original `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF`: contorno de90×90 e água coincidem visualmente com a planta após inverter X. Decodificador MAP1/FLOR já disponível em `tmp/original-review/decode-map.py`, baseado nas referências técnicas identificadas em DUNGEON_M01_14.md; não houve nova pesquisa externa ou observação de partida DOS.

Exports/camadas binárias e imagens de consulta permanecem **ignorados em tmp/stonekeep-review/**; nenhum arquivo original entra nos assets do jogo. [Origem autoral do recorte](mapas/STONEKEEP_AMOSTRA_M02.json), registrada antes de construir, contém hash do MIF, contorno adaptado, âncoras e exceções. A comparação visual local está em `tmp/stonekeep-review/comparacao.png`, sem versionar a imagem original extraída.

| Elemento | Correspondência / adaptação |
| --- | --- |
| Recorte | X da vista da planta8–53, Y0–32, de um mapa90×90; não toda a dungeon. X da vista =89−X do MIF. Relação preservada: entrada ao norte/leste → aposentos a oeste → abertura → margem → ilha mais a oeste e ao sul da entrada |
| Entrada | Célula de saída original próxima ao ponto X=39,5 em unidades convertidas; célula da vista50,2. Chegada deslocada para50,4, fora do gatilho. No MV: chegada129,15; saída129,9 |
| Abertura dos aposentos | Vista31–33,12: passagem elevada narrada na wiki, achatada para piso na grade. Sem salto/levitação. Desnível e altura não são tratados como capacidade genérica de atravessar paredes |
| Água / ilha | Preserva o contorno recortado da bacia e da ilha, com natação nas células explicitamente marcadas. Não há ponte ou atalho direto novo até a fonte |
| Pergaminho | Coordenada original citada72,23 → vista17,23 → **MV30,72**, fonte `stonekeep.parchment`. A associação do objeto à coordenada vem da wiki; a aparência dos flats do MIF não foi decodificada para afirmar qual sprite corresponde ao item |
| Escala / limites |3tiles por célula original, margem2: **Map012142×103**. Cobertura1/parede visual2; passagens de uma célula ficam com3tiles livres. Bordas do recorte seladas; não são saídas adicionais. Portas da rota são passagens abertas nesta amostra, sem fingir fechaduras/estados animados implementados |
| Exclusões | Chave de ferro opcional40,30, prisão, aposento real, tesouros e outras alas fora do recorte funcional. Flats decorativos do original não foram transformados automaticamente em obstáculos |

**Guardiões pendentes:** fonte descreve ratos/lobos, esqueletos da passagem e ghouls na ilha. Não foram substituídos por ratos/goblins nem criados encontros fictícios. Ghouls/esqueletos/lobos exigem especificação e conjunto artístico próprio em recortes separados; nenhum desses encontros está finalizado. O aviso de teste deixa claro que a travessia atual não avalia dificuldade/segurança da cena original. Golthog não vira chefe.

## Integração e persistência

- Estrada ao sul de Rihad, evento3 existente em (10,12): somente MQ02≥40 oferece **Viajar para Stonekeep / Ficar em Rihad**; padrão/escape recusam. A informação antiga de chegada continua antes da missão. Destino `stonekeep.entry` agora vinculado e disponível quando conhecido; sem mapa mundial.
- Viagem/retorno não curam, concedem EXP, alteram inimigos/loot ou reiniciam MQ01/Ria. Saída ao norte devolve a (10,11), fora do gatilho da estrada. É permitido voltar sem o item.
- **Item7, Pergaminho de Stonekeep**, chave lógica `MQ02.parchment`, importante/não consumível, sem venda/descarte. IDs1–6 e suas propriedades preservados. Ícone genérico existente no inventário e **marcador textual no mapa são provisórios**, não arte final de pergaminho.
- Fonte existente vinculada ao item7, elegível em40/50: `ArenaPersistence.claimSource` concede só o faltante. Coleta e avanço40→50 protegidos por rollback; repetição não duplica. Objetivo/diário passam a **voltar à corte**; missing posterior reabre a mesma fonte sem repetir progresso/recompensa. Recibo legítimo de entrega aposenta a fonte; nenhum evento de entrega foi implementado.
- Saves usam inventário e posição nativos e o estado `arena` existente; nenhum namespace/schema novo ou migração de recursos. Prefixo web `arena:m01:save-v1` preservado. Reconstrução de mapas anteriores não foi ampliada. Mudanças do diálogo/diário removem somente avisos de viagem ausente que ficaram obsoletos.
- Natação reaproveitada por registro de mapa em Arena_Dungeon: configuração Map008 permanece a original. Map012 registra região5/A1kind0; paredes/águas não marcadas continuam bloqueadas, veículos preservados. Imersão/ondulação e animação A1 existentes; sem custo ou regeneração de Vigor.

Origem: `node tools/build-stonekeep-sample.cjs`; o gerador pai `node tools/build-rihad-arrival.cjs` também recompõe esta amostra depois da corte. Não produz arte nem desfaz a chegada, arredores ou repouso.

## Avaliação curta

**http://127.0.0.1:8774/**. Servidor original deste projeto **PID10096** preservado; duplicado19428 iniciado pelo agente foi encerrado na correção acima. A antiga indicação de porta livre estava incorreta. Para encerrar o servidor original quando desejado: PowerShell `Stop-Process -Id 10096` (conferir o processo caso a sessão já tenha terminado). Editor: playtest do projeto atual; nome na árvore **M02-04 Stonekeep — amostra**.

1. Título → **Stonekeep · passagem (RAM)**. Prepara missão aceita e Bretã nível2, sem repetir dungeon/Ria/combates. Recursos parcialmente gastos, sem cura pela viagem. Sessão separada dos slots pessoais.
2. Caminhar ao sul até (10,12), pressionar Enter ou clicar/tocar o destino da estrada; escolher **Viajar para Stonekeep**. Escape cancela.
3. Seguir ao sul pela entrada, entrar nos aposentos a oeste, cruzar a abertura em **(75,39)** e alcançar a margem **(66,39)**. A [visão geral](evidencias/m02-04/visao-geral.png) orienta a rota; não é um mapa-guia incluído no jogo.
4. Nadar até a ilha e seguir ao marcador **(30,72)**; pisar nele e usar Enter/interação. Confirmar um pergaminho e objetivo de voltar à corte. Arte do objeto ainda provisória.
5. Voltar pela mesma passagem à saída norte **(129,9)**. Em Rihad, consultar **Diário**; voltar à corte não entrega nem revela Fang Lair nesta versão.

Menu **Guardar teste em RAM / Carregar teste da RAM** funciona em Rihad/Stonekeep; fechar ou recarregar perde esse checkpoint. Slots normais são bloqueados na sessão técnica. Campanha normal mantém salvamento nativo; testes automáticos de persistência usam campanha sintética/perfil descartável, não saves pessoais. Não é necessário preparar fixtures em slots pessoais.

## Verificações e limites

[14 grupos focais Chrome](evidencias/m02-04/resultado.json), [contratos](evidencias/m02-04/contratos.json): viagem condicionada/cancelamento/retorno sem item, rota nativa e paredes/margens, água marcada/veículos, configuração Map008 preservada, coleta única/proteções, fonte recuperável/recibo aposentado, diário50, save/F5/load na água e após retorno, idempotência do gerador pai. Sem erros JavaScript/HTTP faltante. A rota longa foi percorrida no teste por `canPass/moveStraight/updateMove` nativos com aceleração técnica, sem teleport/through; teclado real usado nas viagens/coleta e trecho aquático. Capturas inspecionadas na resolução816×624; não equivalem a teste de todos os controles ou estabilidade em aparelho físico.

`node tools/test-stonekeep-sample.cjs` requer Playwright/Chrome; usa servidor/origem/perfil efêmeros, RAM e slot16 sintético separado. `render-stonekeep-sample.py` gera somente a visão de revisão a partir dos tiles existentes, não novos assets. Reutilizadas evidências anteriores de núcleo/persistência, sem campanha completa ou batalhas novas.

**Pendentes:** avaliação do responsável da amostra/topologia/adaptação; sprite/ícone final do pergaminho, decoração específica e guardiões; novo playtest/autoria no MV não executado; nenhum teste físico mobile novo. A expansão M02-05 e a entrega na corte aguardam avaliação e recorte próprio. Não declarar Stonekeep ou M02 concluídos.
