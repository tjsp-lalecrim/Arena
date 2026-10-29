# M01-20 — fallback variável dos tesouros

29/10/2026, feature/m01-20-revisao-ouro-raridade, revisão base013dd25. Implementado **somente** o recorte autorizado: tesouro sem nenhuma recompensa positiva recebe ouro uniforme inteiro **2–8, inclusive**. Não é ouro extra sobre item/ouro já sorteado, nem alteração das chances ou intervalos das batalhas.

Configuração direta em `data/ArenaQuests.json`: `treasureFallbackGold: {min:2,max:8}` substitui o escalar antigo. Arena_Quests encaminha a configuração ao Arena_Loot0.3.0. Não existe gerador dedicado dessa tabela; `build-quests.cjs` lê e preserva o JSON, recompõe eventos sem embutir quantidade. Verificado em fixture temporária com quatro JSONs, sem assets: configuração preservada byte a byte. Nenhum mapa real foi regravado.

## Sorteio, recibos e compatibilidade

`claimContainer(id,table,fallbackGold,rng?)` aceita faixa positiva inteira; RNG opcional para teste, com valores em[0,1). Se rows não contiver quantidade positiva, calcula `min+floor(rng()*(max-min+1))` **uma vez** e usa o settlement existente. Sem nova categoria, consumidor ou schema. Número positivo no terceiro argumento continua aceito por chamadas/configurações legadas; o caminho normal atual usa2–8.

Recibo existente é retornado **antes** de validar/sortear outra recompensa. O resultado concedido ou reservado é persistido em arenaLoot v1; resumo, repetição de interação, load e collectPending não sorteiam de novo. Valores históricos5 permanecem5, inclusive em reservas parciais. Tesouros antigos coletados continuam ocultos e sem novo pagamento; tesouros ainda não coletados passam a usar a configuração atual. Mesmas chaves/IDs, sem migração destrutiva ou alteração do namespace web.

Ouro normal2–20/19% goblin e2–20/23% homem-lagarto, rato sem loot, raridade/catálogo, descanso, inimigos, fórmulas, equipamentos e assets ficaram intactos. Bolsa cheia mantém o resultado em reserva; não dispara prêmio substituto ou novo sorteio.

## Verificação focal executada

Chrome156.0.8078.73 automatizado, origem/porta efêmera e perfil isolado, nenhum save pessoal ou servidor existente utilizado. [Resultado](evidencias/m01-20-ouro-reserva/resultado.json), seis grupos:

1. Save sintético de Map008 criado com os plugins/configuração **anteriores**, do commit013dd25: recebimento5, reserva5 e tesouro real já coletado/oculto preservados ao carregar na implementação nova; chamadas repetidas/entrega sem RNG nem duplicação.
2. Limites2/8, sete faixas de igual largura produzindo2…8 e uma única chamada de RNG do fallback. Ouro3 ou poção já existentes não ativam fallback; linha de quantidade0 é vazia. Validação da faixa e argumento escalar legado.
3. Save/load nativo dos resultados novos e repetição da API com sorteio proibido: recibos e ouro iguais.
4. Reserva nova8 persistida, entregue parcialmente3+5, sem novo sorteio ou terceira entrega.
5. Fonte real de tesouro MQ01, em sessão técnica com pré-condições de chave/porta: máximo8 controlado, mensagens reapresentadas e interação repetida sem pagamento; save/load no mapa preserva recibo, ouro e ocultação do evento. Pré-condições/posição foram preparadas por API no teste, não por um percurso completo.
6. Gerador executado apenas na fixture ignorada preserva a faixa; tabelas de batalha, inimigos, raras, itens, skills, descanso e mapa do projeto comparados à base e inalterados.

Sintaxe dos dois plugins e testes alterados conferida. `js/plugins.js`/motor não modificados. A suíte ampla `test-integration-r02.cjs` teve somente expectativas afetadas atualizadas para faixa/quantidade do recibo, sem reexecução da campanha/suíte inteira. Sem novo teste no editor MV ou smartphone, sem geração de assets, merge, push ou Pages.

## Teste determinístico disponível

`node tools/test-treasure-fallback.cjs` (Playwright e Chrome disponíveis; NODE_PATH do runtime local quando necessário). Cria/fecha o próprio servidor e contexto isolado, controla os valores2/8 e usa saves sintéticos. Não requer procurar o fallback em batalhas/tesouros aleatórios; avaliação manual adicional não é necessária para exercitar os extremos. Não executar código de fixture em partida pessoal. Nenhum novo acesso de laboratório foi adicionado ao jogo.

Próximo recorte recomendado pelo backlog: **M01-20, definir os parâmetros da distribuição de atributos para a campanha**, requisito ainda não implementado. Quantidade e políticas precisam de decisão própria; a autorização3/+1 do E05 vale só no laboratório. Não iniciado. Raridade/catálogo, expansão de descanso e arte de abertura permanecem futuros; M01-20/M01 não concluídos.
