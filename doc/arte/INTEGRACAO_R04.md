# Continuidade aprovada e integração técnica R04

Data: 25/10/2026. Branch: feature/m01-amostra-visual. M01-06: **em validação técnica**, não concluído.

## Aprovação fornecida pelo responsável

O responsável aprovou explicitamente a direção da rodada R02/R03 nesta conversa, após a revisão `4faf3b2`. Isso aprova identidade visual Arena/dark fantasy, não todas as categorias antigas nem formatos técnicos futuros. Registro verificável de seis arquivos (três masters e três exports), dimensões e SHA256: `APROVACAO_DIRECAO_R02_R03.json`.

| Referência de continuidade aprovada | Master | Export exibido na aprovação |
| --- | --- | --- |
| Dungeon R02 | art/masters/revisao-r02/dungeon-identidade-r02.png | img/pictures/arena_dungeon_estudo_r02.png — 576×480 |
| Rato R03 | art/masters/revisao-r02/rato-ameaca-r03.png | img/pictures/arena_rato_bote_r03.png — 384×64, quatro células 96×64 |
| Ria espectral R02 | art/masters/revisao-r02/ria-sem-protagonista-r02.png | img/pictures/arena_ria_narrativa_r02.png — 768×512 |

Rato R02 é intermediário preservado, não referência principal. Prompts completos e fontes efetivamente anexadas continuam nos registros R02/R03. Não regenerar Ria ou rato adequados por conveniência. Ao implementar diálogos, conferir objetos (inclusive chave/plataforma), momento, contexto e composição; alterar somente por necessidade concreta. Nenhuma imagem narrativa pode mostrar protagonista, seus membros, sombra, reflexo, silhueta ou equipamento. Aprovação não certifica que a chave desenhada em Ria esteja correta para todas as futuras falas.

## Derivado técnico necessário, sem refazer os aprovados

O conceito da cela tem perspectiva convergente. Para testar grade, foi gerada **uma única** amostra R04 de superfícies ortogonais, anexando o master aprovado da dungeon como continuidade. `prompt-superficies-r04.json` preserva o prompt completo, justificativa e anexo; modelo não informado pela ferramenta. Saída real 1774×887 (diferente do tamanho pedido), copiada integralmente para `art/masters/integracao-r04/superficies-r04.png`. Dois painéis quadrados 887×887 foram reduzidos a 96×96 e montados em folha B 768×768, `img/tilesets/Arena_Prison_R04.png`. Sem desenho artístico por código, apenas recortes/montagem. `exportacoes-integracao-r04.json` registra dimensões e hashes. Reprodução: `tools/build-art-integration.py` com Pillow.

Piso marrom de lajes e alvenaria cinza-violeta separados, sem linhas convergentes. Cada painel ocupa 2×2 células 48×48; lajes com cerca de uma célula de largura, coerentes com o piloto. A leitura material é boa no desktop, porém há repetição visível e juntas que ainda exigem acabamento em mapas maiores. As paredes são amostras de material/fronteira de colisão, não arquitetura final com coroamentos, quinas, portas ou nichos. Grades/correntes/nichos permanecem representados no conceito aprovado e ainda precisam de peças próprias quando o mapa final for construído em M01-14. Não usar a folha como biblioteca completa nem atribuir-lhe aprovação estética independente.

## Integração e acesso

No jogo em localhost, título > **Validação visual R04**, ou playtest do Map003 no editor. Nova partida técnica em memória, sem sobrescrever saves automaticamente. Mapa17×13, tileset3, região de exploração e painel com exemplos em escala nativa. Map001 e Map002 preservados; **Amostra anterior** continua acessível no título. Não integra MQ01 nem combate completo. O início normal do jogo permanece no laboratório.

Placas: aproximar-se por cima e usar Enter/clique. Ria em (4,9), cela em (7,9), saída em (1,9). As imagens usam comandos nativos Show Picture/Show Text/Erase Picture. Ria é exibida inteira a 93,75% do export (720×480), centrada, sobre fundo preto opaco que esconde mapa/jogador; sem crop ou regeneração, mensagem nativa na parte inferior. A ilustração da cela permanece 576×480. Esc abre menu/salvar; saída retorna ao laboratório e limpa as imagens piloto do ator conforme evento existente.

`Arena_ArtPreview` 0.2.0 lê `data/ArenaArtSamples.json`; configurações de conteúdo/quadros separadas da reprodução Sprite/setFrame. Rato atual: 0,1,2,3, durações24/12/8/20 updates; galeria histórica: 0,1,2,1,18 updates cada. São contagens de updates, não garantia de tempo em aparelho lento. A fase visual reinicia ao reconstruir a cena; não é progressão de combate e não deve ser salva. Nenhum novo estado persistente ou dependência externa. `js/plugins.js` mantém estrutura canônica, nomes, ordem, status e parâmetros; só descrição atualizada. Arquivos internos do motor intactos.

## Cobertura real das categorias

| Categoria | Integração atual | Limites/verificações restantes |
| --- | --- | --- |
| Exploração | Piloto anterior $Arena_Breton_Pilot,144×256; células48×64; movimento nativo | Provisória, sem aprovação específica nesta mensagem; não substitui criação racial nem variantes de armadura |
| Combatente do jogador | Pose lateral96×96 e retrato144×144 coerentes com piloto; preservados | Pose estática; não é folha svActors9×6 ou conjunto de movimentos. Integração de animações completa permanece para desenvolvimento próprio, sem fingir poses ausentes |
| Inimigo | Rato R03 aprovado como identidade,96×64, quatro quadros recortados no motor | Trecho de bote; transições/volume e demais estados ainda necessários para combate completo; tempo/leitura em aparelho pendentes |
| Chão/parede | Folha B R04, piso passável e parede bloqueada; escala48×48 | Superfícies mínimas, repetição/juntas e arquitetura final pendentes; sem autotiles |
| Ícones | Arma, armadura, poção32×32, versões anteriores preservadas | Exemplos visuais no painel; não novos ícones de banco, não aprovação estética ampliada automaticamente |
| Narrativa | Ria R02 e conceito da cela R02 vistos no motor | Direção aprovada; composição e objetos devem ser revistos ao integrar falas reais; sem protagonista |

## Evidências executadas

Chrome desktop156.0.8078.47, motor MV1.6.1, canvas816×624:

- `test-art-integration.cjs`: título/mapa3, imagens nativas, quatro quadros observados (0,96,192,288), movimento, colisão, save/load de posição/imagens/HP/recurso próprio, Ria e conceito com fundo opaco, MQ01 sem avanço, retorno ao laboratório, zero erros/arquivos faltantes. Contexto descartável, sem saves pessoais.
- `test-art-preview.cjs`: regressão da galeria anterior aprovada tecnicamente. Ajuste dos testes para aguardar fechamento da mensagem/cena e término da espera nativa antes de nova tecla; elimina entradas prematuras no teste.
- Estado, runtime, validação de dados, persistência (27 verificações) e boot/laboratório passaram novamente.
- `audit-art-records.py`: 27 registros de masters/exports com hashes/dimensões válidos; quatro arquivos de prompts preenchidos; seis referências aprovadas inalteradas; perfis, duração/limites dos quadros e imagens de eventos válidos; UTF-8 sem BOM/formato canônico do catálogo de plugins.
- Inspeção das screenshots `m01-06-r04-mapa-mv.png`, `m01-06-r04-ria-mv.png`, `m01-06-r04-conceito-mv.png` em `doc/evidencias/`. Nome nativo do mapa removido para não sobrepor cabeçalho; legenda de Ria encurtada para caber.

`test-art-viewport.cjs`: **simulação no Chrome desktop**,916×412, toque habilitado e user agent Android genérico. Canvas538,77×412, sem extravasar; mapa e narrativa carregados, zero erros. Fonte17px equivale a aproximadamente11,22px CSS; leitura pequena, pendente de avaliação física/ajuste. A primeira tentativa com user agent desktop manteve stretch nativo desligado e cortou a tela; o teste foi corrigido para exercitar o ramo mobile real do MV, sem mudar motor ou runtime para mascarar o resultado. Resultados e screenshots `m01-06-r04-viewport*`/`m01-06-r04-ria-viewport.png`.

## Validação manual ainda necessária

Editor MV1.6.1: abrir projeto, conferir gerenciador de plugins, abrir Map003, conferir B/flags/eventos, salvar projeto, reabrir e executar playtest e localhost. Nenhuma dessas ações de autoria foi realizada nesta rodada. A evidência manual anterior de abertura e save/load do responsável vale para a versão então testada, não certifica R04.

Galaxy A56 real: Chrome em paisagem, tela inteira quando disponível; conferir leitura de ícones/rato/piloto, recortes/alpha, ritmo do bote, texto e toque nas placas, menu/save/load e retorno. Anotar versões de Android/Chrome, escala, desempenho e dificuldades. Não houve teste no aparelho, nem validação física de fullscreen/toque. A simulação não comprova suporte.

M01-06 permanece em validação técnica: direção aprovada e amostra integrada em navegador não bastam para declarar todas as categorias/formas finais/mobile/editor concluídos. Sem merge automático, release ou produção em lote.

Tentativa de autoria pelo Codex: o executável instalado abriu janela com título “Arena - RPG Maker MV”, mas `get_window_state` falhou duas vezes (incluindo recuperação com seleção renovada) com `window capture timed out: timed out waiting on channel`. Sem captura verificável, não foram feitas ações de gerenciador, salvamento/reabertura ou playtest. A janela/título isolados não comprovam leitura completa do projeto. Essas verificações continuam pendentes.
