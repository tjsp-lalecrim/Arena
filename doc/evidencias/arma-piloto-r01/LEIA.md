# Encaixe focal da arma — R01, 28/10/2026

Base: efffa97, feature/m01-narrativa-demo, inicialmente limpa. Preservados os commits documentais e aprovações anteriores.

- Personagem: Bretã feminina, breton.female.base. Arma2: Espada curta. Skill8: Estocada pesada.
- before/: execução nativa anterior à correção. after/: mesma ação com correção, em velocidade normal, Chrome156/canvas816×624. Vídeos reais do canvas, sem montagem de atlas ou aceleração.
- comparacao.png: recortes ampliados dos seis quadros reais antes/depois, somente revisão; não é asset do jogo.
- Resultado controlado:37 dano,12 Vigor,uma ação/um efeito; tempos iguais e retorno ao repouso. Aleatório0,5/variância0/inimigo500HP apenas no cenário isolado, não números de balanceamento novos.
- Correção de apoios/ângulos e oclusão da pega por pixels existentes da mão. PNGs, fórmulas, custos e demais configurações de participantes preservados. Não testadas todas as variantes ou armaduras nesta entrega.
- Um erro inicial da rotina de teste consultou o estado ainda no mapa antes da transição à batalha; corrigida a espera da rotina, sem mudar o jogo. Reexecução focal após adicionar verificações de transformação/oclusão passou.
- Vídeo corrigido reproduzido a1× e33 quadros reais decodificados para inspeção; video-inspecao.json. Editor e smartphone não executados nesta tarefa; avaliação estética pelo responsável pendente. Detalhes em ../../plugins/Arena_BattleMotion.md. Sem merge/push.
