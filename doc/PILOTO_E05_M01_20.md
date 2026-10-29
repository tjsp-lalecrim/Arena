# M01-20/E05 — quatro conjuntos no laboratório

Implementação autorizada **exclusivamente experimental**, a partir de S06/52fbef9. Não aprova fórmula, pontos ou equipamentos para a campanha. Não encerra M01-20. Fonte dos números: [S06](DIRECAO_PROGRESSAO_M01_20_S06.md), sem revisão dos estudos ou ampliação para outros personagens/inimigos/níveis.

## Acesso pelo editor e comparação

Abrir o projeto no MV1.6.1 → **Playtest** → **Combate técnico (piloto)** → **E05 — comparar conjuntos**. Escolher, nesta ordem sugerida:

1. **E05.1 — Leve**.
2. **E05.2 — Pesado**.
3. **E05.3 — Vestimenta mágica**.
4. **E05.4 — Híbrido**.

A tela anterior ao combate mostra personagem, arma, recursos, alocação, bônus do conjunto, atributos finais e goblin. Após escolher, a batalha começa com o goblin intacto. **Combater**, se apresentado; **Habilidades** contém as categorias **Técnicas** (Corte leve — adaga / Estocada pesada — adaga) e **Magias** (Cura / Dardo de fogo). Atacar e Defender ficam nos comandos principais. Após vitória, retorna à mesma seleção: escolher novamente reinicia tudo. Após derrota, voltar ao título e repetir o caminho. **Voltar ao título (descartar sessão)** ou Esc na seleção encerra o piloto. Não carregar um save para começar; o acesso cria sessão descartável.

A seleção aguarda soltura de confirmação/cancelamento e mouse/toque para não reaproveitar a pressão que fechou a tela anterior. Não enfileira o início de outro cenário.

**Constantes:** Bretã feminina, nível3, adaga real1/ATQ+2, seis pontos de nível distribuídos **ATQ+3/MAT+3 em todos os casos**, Vida110/110, Mana60/60, Vigor100/100. Escolhas de recursos dos níveis2/3=Vida/Mana. Nenhuma outra peça real equipada, poção ou livro concedido. Cura/Dardo aprendidos apenas na fixture. Goblin real2/tropa2, Vida30/ATQ7/DEF3/MDF3/AGI10, ações/traits/banco inalterados. O piso nativo do MV faz MAT0 do banco resultar MAT1 em execução; não é bônus experimental.

| Cenário | Conjunto virtual, além da adaga | ATQ/DEF/MAT/MDF/AGI/SOR finais |
| --- | --- | --- |
|Leve|DEF+6, AGI+2|15/11/11/5/12/10|
|Pesado|DEF+8|15/13/11/5/10/10|
|Vestimenta mágica|DEF+4, MAT+4|15/9/15/5/10/10|
|Híbrido|DEF+5, MAT+2, AGI+1|15/10/13/5/11/10|

**Somente o conjunto varia**, não os pontos distribuídos. São totais virtuais no ator, sem peças novas, catálogo ou visual de trajes completos. Os sprites e animações da adaga aprovados são os mesmos nos quatro casos; diferenças visuais de armadura não fazem parte deste ensaio. Não há AGI negativa, bônus percentual, MDF/SOR de compensação ou alteração racial.

## Regras experimentais e isolamento

Arena_BalanceLab0.1.0 aplica S02 apenas na sessão E05: P1 Atacar, P1,25 leve, P1,6 pesada com25% de penetração e P3 Dardo, fator `max(0,20;8/(8+DEF ou MDF))`. Goblin usa a mesma base proporcional P1. Pós-processamento nativo de elemento, redução, variância10%, Defender e imunidade preservado; dano positivo não imune tem mínimo1. Cura25+MAT preservada. Custos continuam0/5/12 Vigor para Atacar/leve/pesada,6 Mana Dardo e8 Mana Cura, pelas APIs existentes; não há novo consumidor. Crítico não é habilitado ou rebalanceado.

Todos começam com semente19720; sorteios de velocidade, aplicação e seleção de ações do inimigo usam gerador transitório. Mesmos comandos reproduzem a mesma sequência no mesmo cenário; escolhas/ordem diferentes consomem sorteios diferentes. Não garante igualdade de erros/danos entre roteiros distintos. O gerador normal é restaurado após cada chamada, inclusive exceção. Não modifica RNG permanente, fórmulas do banco ou parâmetros do inimigo.

Vitória sem EXP/loot **nesta fixture**, para manter nível, inventário e condições da próxima comparação; campanha e laboratórios anteriores preservam recompensas. Fuga permanece desabilitada. Cada início reconstrói uma partida nova, não soma bônus à anterior. Sessão fica bloqueada para salvar também na seleção pós-vitória: menu de save indisponível; saveGame/saveGameWithoutRescue/saveGlobalInfo recusam; makeSaveContents recusa serializar. Sem arquivos/slots/índices/backups experimentais, schema novo ou mudança de namespace. Saída ao título, nova partida ou carregamento limpam o contexto; fórmulas e saves normais voltam ao comportamento anterior. Nenhum save pessoal é lido/escrito para preparar o piloto.

## Roteiro curto de avaliação do responsável

- No primeiro conjunto, compare Atacar, leve e pesada: o ganho compensa o gasto ou alguma ação é redundante? Recomece se precisar observar outro comando; não existe meta de turnos aprovada.
- Compare leve/pesado: a iniciativa ou o dano recebido muda suas decisões? Parte da diferença de DEF pode ficar oculta no arredondamento. Defender continua disponível.
- Teste Dardo e Cura nos perfis mágico/híbrido. A magia resolve sempre a luta antes de resposta? O benefício híbrido é perceptível? A mesma alocação de nível evita atribuir esses ganhos a pontos diferentes.
- Observe barras/custos, respostas sofridas, utilidade de cada opção e vontade de escolher outro perfil. Relate opções dominantes/sem benefício e diversão, além de contar turnos. Poucas lutas não demonstram equilíbrio estatístico.

## Verificação realizada e limites

Chrome156.0.8078.73 desktop automatizado, contexto isolado em origem/porta efêmera criada e encerrada pelo teste; servidor pessoal não utilizado ou encerrado. A porta8771 já estava ocupada por outro serviço e foi preservada. Evidência: [resultado](evidencias/m01-20-e05/resultado.json), capturas [seleção](evidencias/m01-20-e05/selecao.png) e [leve](evidencias/m01-20-e05/light.png) (há captura inicial dos quatro perfis).

Sete grupos focais: caminho real título/seleção; quatro batalhas nativas/vitórias/retorno; vetores, pontos, recursos, técnicas e goblin original; fórmulas e cobrança única em Atacar/Defender/leve/pesada/Cura/Dardo; bloqueios de save/índice/serialização com **zero escritas/backups** e controle prévio preservado; repetição sem acúmulo; saída/carregamento e novo save/partida normais. Seleção/batalha inspecionadas a816×624, sem cortes. plugins.js canônico, UTF8 sem BOM,33 registros anteriores idênticos e novo registro34; arquivos referenciados presentes. Motor, dados/curvas, assets e armazenamento nativo não editados.

Após acrescentar a proteção de entrada, executado somente o teste afetado: Enter mantido na transição não inicia cenário; soltura habilita seleção sem uso pendente ([resultado](evidencias/m01-20-e05/selecao-protecao.json)). A bateria de batalhas não foi repetida por essa alteração exclusivamente de ativação da janela.

Na verificação nativa registrada: leve tirou14 e pesada20 no perfil leve; Dardo31 venceu imediatamente no perfil mágico; recebido usual3 e1 sob Defender. Exemplos com variância/ordem real, **não novos valores nem aprovação de equilíbrio**. O teste detectou apenas uma premissa incorreta do próprio comparador (MAT0 do banco sofre piso1 do MV); comparador ajustado ao comportamento nativo, sem modificar o goblin.

Novo teste no editor MV, avaliação jogável do responsável, derrota manual, toque físico e Galaxy A56 **não executados nesta entrega**. Preservar aprovações anteriores sem estendê-las ao E05. Nenhuma atualização do Pages ou pacote público. Aguardar feedback antes de expandir ou aplicar à campanha.

Reprodução técnica: `node tools/test-balance-lab-e05.cjs` com Playwright/Chrome disponíveis (NODE_PATH do runtime local quando necessário). O servidor do próprio teste usa porta livre e é fechado ao final; não usa saves pessoais. Não é bateria de campanha.
