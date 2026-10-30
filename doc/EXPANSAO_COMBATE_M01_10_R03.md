# M01-10 R03 — expansão dos participantes

26/10/2026, feature/m01-combate, continuidade de a61977b/a9d02c9. O responsável escolheu concluir a expansão antes de integrar M01-10. M01-10 atende tecnicamente ao recorte do backlog após esta expansão; avaliação manual das novas variantes e balanceamento continuam pendentes. A aprovação manual R02, associada a a61977b, cobre somente Bretã feminina/rato. Arquivos e perfis aprovados permanecem idênticos, verificados contra esse commit. Nenhum retrato, exploração, bônus, fórmula, consumidor de recursos ou arquivo interno do motor foi alterado.

## Cobertura entregue

| Participantes | Versão | Movimentos |
| --- | --- | --- |
| Bretã feminina | R02 aprovada, preservada | espera, leve, pesada, conjuração, poção, dano, derrota |
| Outras15 combinações de oito raças × dois gêneros | R03-expansion | os mesmos sete movimentos, apoios próprios de adaga/espada; desarmado sem camada de arma |
| Rato1 | R02 aprovado, preservado | espera, bote, dano, derrota |
| Goblin2 | R03-expansion | espera, golpe de espada, dano, derrota |
| Homem-lagarto3 | R03-expansion | espera, mordida, dano, derrota |

Seis células temporizadas por movimento,744 no total;678 da expansão. Isso não significa744 desenhos exclusivos: retornos à guarda reutilizam poses neutras íntegras quando o endpoint original vinha cortado. Elfo negro masculino: idle5/heavy5/hurt5; homem-lagarto: hurt5. Nenhum movimento foi construído apenas repetindo uma pose. Há pelo menos quatro desenhos distintos em cada sequência. A temporização/impactos R02 foi preservada, inclusive no piloto/rato, sem interpolação artificial ou translação da raiz para fingir animação.

Jogadores:128×112/célula, apoio104; goblin192×112/104; homem-lagarto192×128/120. Escala única por master; tiras complementares recebem uma conversão de densidade para o master, não normalização por altura de cada pose. Exportação limpa somente ruído alfa≤16, isola componentes e mantém proporções. Retângulos, origem por quadro, hashes, limites e exceções em arte/COMBATE_EXPANSAO_R03_EXPORTS.json e COMBATE_EXPANSAO_R03_MANIFEST.json. Apoios de arma em art/masters/combate-r03-expansao/hands.json. Guias são externos, sem linhas nos PNGs finais.

Inspeção Codex: pranchas ampliadas de coordenadas e em escala nativa, todas as identidades, gestos/armas e recortes dos vídeos nativos. Corpos e roupas seguem as referências de cada combinação; escala/apoios permanecem na faixa existente. Há pequenas diferenças pictóricas entre quadros e mudança de gesto entre mãos em algumas recuperações; não se afirma interpolação perfeita, física de armas ou aprovação estética de cada variante. Inspeção não reabre as ressalvas de retratos aceitas em M01-07.

## Geração e fontes efetivamente usadas

Ferramenta integrada image_gen;22 masters e22 prompts integrais não vazios em doc/arte/PROMPT_COMBATE_EXPANSAO_R03_*.json. Masters em art/masters/combate-r03-expansao. Identidades: laterais r02 existentes, crops neutros das mesmas identidades R01 e piloto aprovado como referência separada de coreografia. Referências/crops/hashes em arte/REFERENCIAS_EXPANSAO_R03.json. Nenhum conteúdo do Battlespire utilizado nesta expansão.

Goblin/homem-lagarto: masters R01 existentes e consultas já extraídas do material original em tmp/original-review/monsters/page6-1.png e page13-1.png, ignoradas pelo Git. Originais preservados e não incorporados ao jogo. Escudo/tridente, porte e materiais seguem a continuidade R01; cauda e articulação detalhada permanecem interpretação artística, sem alegação de confirmação pelo sprite de1994.

Khajiit masculino/Nórdico masculino omitiram as primeiras poses de derrota; Redguard feminina também omitiu uma pose de dano. Geradas somente tiras complementares de seis quadros para esses movimentos, preservando as folhas incompletas para rastreabilidade. O estudo de estocada do homem-lagarto também foi preservado, mas não utilizado: a ação cadastrada11 é **Mordida paralisante**, portanto foi gerada a tira lizard-bite específica. Arena_BattleMotion0.3 adiciona actionMotion configurável por inimigo; não troca a regra pela aparência do tridente.

## Evidências e execução

Chrome156.0.8078.47, MV1.6.1, canvas816×624, viewport1100×800; perfis descartáveis, sem saves pessoais. Diretório evidencias/m01-10-r03:

- Uma pasta por nova identidade e por enemy.2/3: resultado.json, capturas de equipamento e47 vídeos WebM do canvas real no conjunto. Observados quadros0–5 dos sete/quatro movimentos durante Scene_Battle, custos únicos5/12 de Vigor, Mana real, uma poção, vitória/retorno dos inimigos e derrota/game over por identidade. Armas1/2/nenhuma testadas; impactos não antecedem o quadro configurado. HP+4000 do inimigo/RNG0,5/variância0 são fixtures só em memória.
- fluxo-nativo/resultado.json: turnos, recursos insuficientes, poção/barras, erro/esquiva/crítico, vitória/mapa/sem repetição, save/load após combate e game over; limites.json: sem alvos e seleção tornada inválida antes de executar, sem travamento/débito indevido.
- regressoes:628 habilidades/192 ações raciais,619 recursos,234 criação,981 bônus,27 persistência. Validadores de dados/habilidades/recursos/batalha/movimentos, sintaxe e núcleo puro alternativo de quatro quadros passaram.
- decodificacao-videos.json e *-inspecao.png:47 gravações reproduzidas pelo decodificador Chrome, amostragem por requestVideoFrameCallback/mediaTime,12 recortes por vídeo e inspeção1:1. Uma tentativa de extração por seek retornou quadros em cache; foi descartada e substituída antes da evidência final. As pranchas não são replay de atlas.
- editor.json: abertura, F10/detalhes de Arena_BattleMotion ON, salvar, fechar, nova janela e salvar novamente, via teclado/acessibilidade.16 registros de plugins semanticamente idênticos antes/depois, canônico UTF8 sem BOM. Somente System.versionId mudou semanticamente; mudanças de formatação de Items/Skills/MapInfos foram descartadas após comparação semântica exata. Não equivale a inspeção visual do playtest NW.js.

O balanceamento continua provisório. As18 batalhas comparativas R01 permanecem válidas como medições de turnos/dano sob fixtures, sem atribuir os vídeos novos a essas medições antigas. Não houve alteração de valores P01–P08. Fontes reais de frio/magia, níveis altos, iniciativa estatística e utilidade sustentada permanecem nos cenários M01-20. Doença do rato original foi identificada nas fontes, mas não possui contrato implementado no subconjunto atual: rato usa ataque físico, sem alegar reprodução dessa doença; avaliar sua adaptação junto ao balanceamento, sem inventar agora um sistema extenso de estados.

## Validação manual e limites

Título > **Combate técnico (piloto)** > **Novo participante(3,8)** para qualquer raça/gênero. Preparar treino(3,5), rato(7,5), goblin(6,8), homem-lagarto(10,8); ficar na célula abaixo e Enter. Descansar/reiniciar encontros(11,5). Trocar/remover arma no menu entre encontros; testar leve/pesada, Cura/Dardo e poções. Sessão técnica separada da campanha. Não carregar saves pessoais para este roteiro.

Conferir escala, mãos/armas, antecipação/impacto/retorno, gestos de magia/poção, dano/queda e barras. O responsável mantém testes manuais adiados; novas variantes não receberam aprovação estética individual. Playtest visual NW.js, desempenho/toque/fullscreen e Galaxy A56 físico continuam pendentes. Comandos e fundo ainda diagnósticos; múltiplos inimigos e nova disposição pertencem à interface M01-11. Outras armaduras/aparência por equipamento são M01-12, patrulhas M01-15. Contra-ataque/reflexão e biblioteca adicional não declarados validados.

Reprodução automática: tools/test-battle-expansion-r03.cjs (ARENA_EXPANSION_FINAL=1), tools/audit-battle-expansion-r03.py, tools/validate-battle-motion.cjs. ARENA_EXPANSION_ACTORS permite recorte por IDs e ARENA_EXPANSION_SKIP_ENEMIES=1 separa lotes sem compartilhar saídas. tools/battle-expansion-review.html?id=argonian.female.base apresenta pranchas técnicas; não é a UI M01-11.
