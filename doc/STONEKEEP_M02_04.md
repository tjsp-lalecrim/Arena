# M02-04 — amostra integrada de Stonekeep

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

**http://127.0.0.1:8774/**. Porta conferida livre; servidor deste projeto iniciado nesta tarefa, PID19428, permanece ativo. Para encerrá-lo: PowerShell `Stop-Process -Id 19428` (conferir o processo caso a sessão já tenha terminado). Outros serviços não foram encerrados. Editor: playtest do projeto atual; nome na árvore **M02-04 Stonekeep — amostra**.

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
