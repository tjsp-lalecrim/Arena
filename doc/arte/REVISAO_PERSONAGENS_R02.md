# Revisão de personagens M01-07 — 26/10/2026

Estado: revisão técnica desktop executada; **avaliação estética do responsável pendente**. Sem outra feature, merge, release, mudança de regras, mapas ou ilustrações. Branch `feature/m01-revisao-assets-personagens`, derivada de `feature/m01-criacao-personagem` em37e1729: correção da feature ainda não integrada. `develop` permanece7e7094c e `main` cfd31d3; fetch confirmou ambos alinhados ao remoto. Árvore estava limpa antes desta rodada.

## Fontes e decisão artística

Foram inspecionados os16 retratos v01, seus mestres, os conjuntos Argoniano/Khajiit/Bosmer/Redguard e a bretã piloto. A piloto feminina fornece acabamento e enquadramento; Altmer e Dunmer fornecem exemplos da linguagem élfica do próprio projeto. Não copiar sua identidade para Bosmer. Fontes reais anexadas a cada chamada constam nos dois logs completos de prompts. Não foram geradas roupas de Skyrim ou novas opções.

Arena: capturas de criação de raça já extraídas do PDF local `doc/wiki/Arena_Races - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, em `tmp/character-references/races-page-*.png` e argonian-original.png; marcadores de pele azul-cinza/crista dos Argonianos, roupas e identidade geral. `doc/prints/` e a instalação original foram consultados/inventariados sem alteração. Não houve nova decodificação de sprites do executável nem confirmação de anatomia fina pela instalação nesta rodada. Baixa definição não foi tratada como autorização para fantasia genérica. A aparência humana/pintada dos Khajiit v01 era uma leitura documentada de Arena; a nova cabeça felina é a adaptação explicitamente pedida agora.

Skyrim, somente anatomia: duas imagens efetivamente abertas e examinadas, guardadas em área ignorada e não distribuídas:

- Argoniana em interior, cabeça escamosa/focinho/sobrancelha óssea: [imagem indexada da matéria de2011 GeeksofDoom](https://i0.wp.com/geeksofdoom.com/GoD/img/2011/08/2011-08-20-argonian_female.jpg?fit=800%2C450&ssl=1), `tmp/character-revision-refs/skyrim-argonian-female.jpg`. Ignorados couro/equipamento e cenário.
- Khajiit no criador de personagem, focinho/nariz/orelhas/pelagem: [imagem da galeria GamePro](https://images.cgames.de/images/gsgp/287/the-elder-scrolls-5-skyrim-rassen_2259922.jpg), `tmp/character-revision-refs/skyrim-khajiit.jpg`. Ignorados HUD alemão, roupa e fundo.
- Complemento textual primário: [Bethesda — escalas/pelagem e adornos específicos](https://help.bethesda.net/app/answers/detail/a_id/2855/~/khajiit-and-the-argonians-have-special-scales-and-fur-options.-do-other-races). Não foi anexado como imagem nem usado para inventar detalhes não visíveis.

As imagens foram acessadas diretamente; as páginas completas de artigos/UESP Skyrim não ficaram acessíveis. Não afirmar inspeção dessas páginas, extração de uma instalação Skyrim, nem certificação independente da versão/build de cada captura. Não faltou referência para o ajuste solicitado. Cristas baixas, distribuição das escamas, marcas da pelagem e detalhes faciais são interpretações; sexo não cria bônus ou nova regra. A crista verde/cobre foi preservada como placas/espinhos reptilianos, não como cabeleira humana. Ainda cabe ao responsável avaliar sua leitura.

## Arquivos, versões e processamento

Sete edições por `image_gen.imagegen`, modelo/seed não informados. `prompts-revisao-personagens-r02.json` registra quatro chamadas: três pares completos e retratos Redguard; `prompts-correcao-personagens-r03.json` registra três correções de margens/crista. `fontes-personagens-revisao-r02.json` registra hashes, dimensões, URLs e destinos. Os r02 intermediários permanecem preservados.

- Mestres selecionados: `art/masters/criacao-r03/{argonian,khajiit,wood_elf}-r03.png`; retratos `art/masters/criacao-r02/redguard-portraits-r02.png`.
- Demais anatomias/poses derivam dos mestres v01. Breton feminina mantém retrato e ciclo original; só transformação técnica de enquadramento/escala. Redguard mantém exploração/combate v01, corrigindo somente retratos por IA.
-64 novos exports `*_r02.png` nas quatro pastas nativas: `img/characters`, `img/faces`, `img/pictures`, `img/sv_actors`. Arquivos antigos não sobrescritos. Sufixo r02 identifica a revisão integrada; r03 identifica a segunda tentativa do mestre de três raças, não uma terceira revisão do jogo.
- `data/ArenaCharacterVisuals.json`: apenas os quatro nomes de arquivo por identidade mudam. Todas as16 chaves, statuses, regras, IDs e chegada permanecem iguais. Saves por chave estável reconstroem a aparência atual ao carregar; arquivos v01 também continuam disponíveis.

Montagem reproduzível em `tools/build-character-revision.py`: isolamento do maior componente alpha≥96, escala uniforme, pivô pela extensão das duas botas no quinto inferior da figura. Os mestres r03 trouxeram pequenos resíduos cromáticos no matte; limpeza de dois pixels do perímetro na resolução-fonte seguida de antialias suave, antes de reduzir. Nenhuma anatomia foi desenhada por código. Não aplicar essa limpeza aos arquivos aprovados antigos. Fotos/fontes originais não entram no jogo.

| Categoria | Arquivo/célula | Figura e margem | Interface/pivô |
| --- | --- | --- | --- |
| Retrato |576×288; slot0 de144×144 | Cabeça nominal coroa–queixo76px, linha estimada dos olhos y52; largura limitada para focinho/orelhas. Ombros/busto podem ser recortados; cabeça não comprimida | Recorte0,0,144,144; escala1 |
| Exploração |144×256;12 células48×64 | Altura nominal56px, margens laterais; diferenças de postura/gait preservadas | Recorte inicial48,0,48,64; pés até y62; âncora nativa0,5/1 |
| Side View |864×576;54 células96×96; prévia96×96 | Figura88px, pés até y94 e margem superior6px | Recorte96×96; escala1; pose para esquerda |

Os pontos de olhos/coroa/queixo são estimativas manuais para enquadramento, não medição automática de anatomia. Valores por personagem e caixas alpha antes/depois no manifesto `exportacoes-personagens-revisao-r02.json`; ver também `evidencias/personagens-r02/alpha-quadros.json`. Transparência de arquivo/célula não equivale a figura ocupada. Não há regra nova de altura racial: preservadas proporções e silhuetas, usando um gabarito técnico comum. Retratos não usam a escala corporal dos sprites.

## Pranchas e inspeção

- `personagens-revisao-r02-antes-depois.png`: seis comparações de Argonianos/Khajiit/Bosmer, com nome/gênero fora da arte; retrato, mapa e combate em tamanho nativo.
- `personagens-revisao-r02-retratos.png`:16 retratos144px, mesma apresentação; linha-guia dos olhos fora do jogo.
- `personagens-revisao-r02-pes.png`:16 duplas exploração/combate na linha dos pés.
- `personagens-revisao-r02-direcoes-1.png` e `-2.png`: todos os quadros/direções, sem ampliação, para conferir estabilidade de silhueta/pivô.

Pranchas e mestres foram examinados visualmente. Os novos focinhos, orelhas e a orientação direita dos Redguards são legíveis nos144px; a escala reduzida conserva leitura racial principalmente por silhueta/cor. Detalhes finos de escamas/pelagem não são garantidos em48×64. As imagens de UI em `evidencias/personagens-r02/criacao-*.png` mostram cada combinação no jogo, todas na mesma resolução. Capturas `mapa-*.png` mostram as16 aparências no Map004, sem alterar o mapa.

## Testes e limites

- Chrome desktop156.0.8078.47, janela1100×800, jogo816×624:16 alternâncias de raça/gênero; recortes e escala1 verificados;16 save/load nativos de identidades com nomes de imagens v01 para reconstrução r02, sem alteração de estado;16 aparências renderizadas no mapa com âncora dos pés0,5/1.256 amostras de padrão/direção do Sprite_Character. Sem erro de script, transporte ou arquivo ausente.
- Auditoria192 células direcionais,864 células SV, margens alpha, regras/chaves/statuses invariáveis; caminhada piloto preservada. Auditoria de179 registros de mestres/exports, sete logs de prompts e formato canônico UTF-8 sem BOM de plugins.js.
- Regressões: criação234 verificações mais UI de nome/confirmar/revisar/cancelar; mouse e toque Android genérico emulado; persistência27 verificações. Contextos descartáveis, sem saves pessoais. Resultados desta rodada em `evidencias/personagens-r02/`; evidências anteriores preservadas.

Limite explícito:15 conjuntos direcionais ainda são poses estáticas triplicadas e os16 combatentes repetem a pose em54 células. Apenas a bretã piloto possui caminhada preexistente. Não chamar isso de animações completas de caminhada/combate, nem concluir M01-10. Validada estabilidade dos quadros existentes; os movimentos que não existem permanecem pendentes de sua etapa. Não houve teste novo no editor/NW.js nem no Galaxy A56 físico; a evidência de autoria anterior vale para a versão então testada. Plugins/motor/plugins.js não modificados nesta revisão. Aprovação estética desta rodada continua pendente.

## Como avaliar

Abrir o projeto no MV ou `http://127.0.0.1:8765/`, atualizar o navegador sem cache e escolher Novo Jogo. Alternar as oito raças e ambos os gêneros, conferindo busto/olhos, focinho/orelhas/crista, orientação e identidade das três prévias. Usar a mesma janela/resolução. Nome→Enter→raça→gênero→Confirmar; testar Revisar/Cancelar. Após criar, mover nas quatro direções na chegada técnica, abrir Esc→Salvar e carregar por Continuar. Repetir combinações de interesse sem esperar animações não produzidas. Conferir as pranchas junto da tela; arquivos anteriores permitem comparação. No editor, verificar também leitura no gerenciador, salvar/reabrir e playtest; no A56, paisagem, recortes, leitura e toque permanecem verificação física pendente.
