# M01-07 — revisão obrigatória de pose dos retratos

26/10/2026. Branch `feature/m01-diretiva-pose-retratos`, a partir de0a917f8 da revisão anterior ainda não integrada. Árvore inicial limpa; fetch confirmou a revisão anterior publicada e `develop`7e7094c/`main`cfd31d3 preservadas. Escopo: diretiva permanente e correção de retratos; nenhuma outra feature.

## Diretiva e referências

Guia de arte1.4, `PROCEDIMENTO_RETRATOS.md` e índice inicial tornam obrigatório inspecionar peito/ombros/pescoço/cabeça/olhar em uma mesma pose de três quartos para a direita. Categorias mantêm convenções separadas: exploração por direção MV; jogador Side View para esquerda; animações preservam proporção/apoio. Não usar espelhamento para uma torção interna. A inspeção de anatomia é visual, não resultado de dimensões/alpha.

Referência de pose/composição selecionada: `art/references/pose-personagens/breton-female-busto-v01.png` (572×610), extração do quadrante de retrato de `art/masters/breta-piloto-v01.png`, sem alteração de anatomia. Identificada como gabarito técnico, não como aprovação estética nova. A bretã apresenta continuidade de peito, ombros, pescoço e cabeça voltados à direita. O prompt acrescenta explicitamente o olhar acompanhando o rosto; o olhar do alvo anterior não é invariável.

Identidade: recortes dos retratos r02 específicos de cada personagem, preservados em `art/references/pose-personagens/identity-*-r02.png`; os caminhos realmente enviados à ferramenta foram os recortes idênticos em tmp, com ambas as localizações/hashes registrados. Estilo: `art/masters/breta-piloto-v01.png`, continuidade do acabamento dark fantasy do projeto, sem copiar roupa/rosto humano. Os novos retratos femininos Argoniana/Khajiit foram inspecionados ampliados antes de serem anexados como referência adicional de pose da mesma raça para os masculinos; isso não constitui aprovação estética do responsável.

Quatro chamadas de edição IA `image_gen.imagegen`, modelo/seed não informados; cada uma contém literalmente o bloco fixo solicitado em `prompts-retratos-pose-r03.json`, funções distintas das imagens realmente fornecidas, escala/margens e invariáveis. `avaliacao-retratos-pose-r03.json` contém referências efetivamente anexadas, hashes/dimensões, resultados e16 avaliações individuais. Nenhuma fonte nova de Skyrim foi usada; a influência anatômica autorizada na rodada anterior permanece, com Arena como base de roupas, cores e identidade. Não pesquisar novos prints ou inferir evidência original para uma correção de pose.

## Inspeção das16 combinações

Todos foram examinados no conjunto ampliado dos recortes de origem e na prancha de144px, observando tronco/cabeça e não somente os olhos. Resultado desta inspeção pelo Codex:

| Raça | Masculino | Feminino |
| --- | --- | --- |
| Argoniano | Corrigido: cabeça próxima de perfil; reduzir divergência para três quartos, articular pescoço/peito | Corrigida: mesma divergência angular |
| Bretão | Preservado: três quartos e apoio de cabeça coerentes | Preservada: gabarito de pose/composição |
| Elfo Negro | Preservado: sem contrarrotação clara observada | Preservada: sem contrarrotação clara observada |
| Alto Elfo | Preservado: sem divergência angular material observada | Preservada: sem divergência angular material observada |
| Khajiit | Corrigido: contrarrotação apontada pelo responsável; reconstruir peito/ombros/pescoço em conjunto | Corrigida: mesmo problema |
| Nórdico | Preservado: pose plausível de três quartos | Preservada: pose plausível de três quartos |
| Redguard | Preservado: orientação direita e apoio coerentes | Preservada: orientação direita e apoio coerentes |
| Elfo da Floresta | Preservado: continuidade de pose/identidade | Preservada: continuidade de pose/identidade |

As avaliações são julgamentos visuais, com tolerância de giro aproximado e respeito à anatomia; não medição tridimensional de35–45°. Focinho/olhos laterais dos Argonianos não precisam reproduzir o contorno humano. Nos candidatos novos, peito/abertura da roupa giram para a direita, com ombro próximo mais visível à esquerda da imagem e distante encurtado à direita; a cabeça apoia-se naturalmente no pescoço. Mantidos escamas azul-cinza, cristas verde/cobre, focinhos e pelagem tawny/creme dos Khajiit, roupas e marcadores individuais. Não mudou exploração/combate. A apreciação estética de ângulo, identidade e olhar pelo responsável continua pendente para todo o conjunto.

## Arquivos e montagem

- Mestres novos1254×1254: `art/masters/retratos-pose-r03/{argonian,khajiit}-{male,female}-pose-r03.png`.
- Quatro folhas novas576×288 em `img/faces/Arena_{argonian,khajiit}_{male,female}_pose_r03.png`, retrato144×144 no slot0.
- Apenas quatro campos `face` mudaram em ArenaCharacterVisuals. As12 outras referências de retrato e todos os arquivos/referências de exploração/combate, IDs, regras, chegada e estados de pose permanecem iguais. Arquivos antigos não sobrescritos. Inventário r02 preservado em `INVENTARIO_PERSONAGENS_M01_r02.json`, inventário atual atualizado.
- Montagem em `tools/build-portrait-pose-revision.py`: componente alpha principal, limpeza do matte de dois pixels na fonte e antialias (resíduos cromáticos da geração), escala uniforme e translação por pontos manuais dos olhos/coroa/queixo conferidos em probes. Nenhuma anatomia desenhada por código, espelhamento ou escala não uniforme.
- `exportacoes-retratos-pose-r03.json`: hashes, dimensões, escala, âncoras estimadas, caixa da cabeça e arquivos. Alvo artístico: olhos~y52/coroa–queixo~76px; anatomia não comprimida. Busto/ombros podem atingir a borda inferior/lateral do recorte, cabeça/focinho/orelhas/cristas devem permanecer íntegros.

Pranchas: `retratos-pose-r03-todos.png` mostra os16 na mesma apresentação144px; `retratos-pose-r03-antes-depois.png` mostra os quatro corrigidos, antes/depois,144px e ampliação2x. Nomes/gêneros e guias estão **somente nas pranchas**; os PNGs finais não recebem linhas de olhos/margens. Os mestres também foram inspecionados em resolução ampliada, além da ampliação do export.

## Validação e limitações

Chrome desktop156.0.8078.47, viewport1100×800/jogo816×624:16 combinações alternadas, todas com recortes nativos144×144/48×64/96×96 e escala1;16 save/load de aparências antigas reconstruídas para arquivos atuais,16 aparências no mapa e256 amostras nativas de padrão/direção. Sem erros de script/rede/arquivos ausentes. Capturas de cada combinação em `doc/evidencias/retratos-pose-r03/`, incluindo `criacao-khajiit-male.png`; sem linhas de revisão no jogo. Os nomes dos arquivos de imagem são comparados à configuração efetiva, permitindo referências r02 e pose-r03 sem exigir um mesmo sufixo.

Regressão `test-character-creation.cjs`:234 verificações mais navegação/nome/confirmar/revisar/cancelar na UI,16 bônus e salvar/carregar; evidências em pasta nova por ARENA_EVIDENCE_DIR, sem reescrever as da rodada anterior. Contextos Chrome descartáveis; nenhum save pessoal usado. Auditoria de integração confirma somente quatro alterações de face,12 referências preservadas, bloco fixo em todos os quatro prompts, papéis/anexos reais, hashes e margens. Auditoria geral:194 registros de mestres/exports e oito logs de prompts, referências de continuidade aprovadas intactas e plugins.js canônico UTF-8 sem BOM. Esses testes **não certificam anatomia**.

Revisão estética: **pendente do responsável**. Candidatos tecnicamente inspecionados não viram referências estéticas aprovadas. Abertura/gerenciador/salvar/reabrir/playtest no editor desta revisão e Galaxy A56 físico não executados. Evidências anteriores continuam ligadas à versão então testada. Quinze conjuntos de exploração seguem estáticos; somente a piloto mantém caminhada existente;16 SV são poses estáticas repetidas, sem novas animações. Nenhum código de motor/plugin ou outra feature foi modificado.

## Avaliação manual

Atualizar o navegador sem cache em localhost8765 ou abrir Arena no editor e iniciar playtest. Novo Jogo→alternar todas as raças e ambos os gêneros na mesma janela. Nos Khajiit/Argonianos conferir especialmente peito, gola/abertura da roupa, ombros, base do pescoço, focinho e olhar em conjunto, comparando com o gabarito e as pranchas. Conferir leitura nos144px, sem depender da ampliação. Nome→Enter→raça→gênero→Confirmar; testar Revisar/Cancelar e Salvar→Continuar. O laboratório permanece separado. Avaliar também a continuidade com exploração/combate, cujos arquivos não foram alterados. Aprovar ou apontar ajustes específicos antes de promover qualquer novo retrato a referência estética.
