# M01-07 — criação de personagem

Branch feature/m01-criacao-personagem, criada de develop após merge7e7094c da amostra M01-06. Não é dungeon final, combate, progressão ou introdução de MQ01. M01-05 preservado. Orientação1 teto/2 parede/3 piso livre registrada para M01-14 sem antecipar mapa definitivo.

## Escopo implementado

Novo jogo → nome → oito raças → gênero → revisão/confirmar.16 combinações base disponíveis; a bretã não é obrigatória. Interface pt-BR, teclado, mouse e toque emulado. Nome Unicode1–20, NFC/espaços normalizados, sem comandos/control characters. Cancelamento/revisão não mudam a partida; só o aceite final inicia nova sessão. Em seguida aparece Map004, chegada provisória de validação que encerra esta versão, com menu/save/load; não representa a cela original ou início narrativo final.

Título mantém Laboratório técnico e galerias. Partidas técnicas novas não têm raça/recursos concedidos por este sistema; não escrevem saves automaticamente. A criação não redefine opções após carregar.

## Fontes e adaptações

Manual.pdf p.7 da instalação original (material original), README1.07CD-ROM, relatórios R05 e PDFs locais UESP Races/Character Creation. Imagens de seleção originais embutidas no PDF Races foram extraídas apenas em tmp/character-references e examinadas antes das gerações. Páginas efetivamente anexadas:2 Argoniano(recorte sem mapa),3 Bretão,5 Elfo negro,6 Alto elfo,7 Khajiit,8 Nórdico,9 Redguard,10 Elfo da floresta. A wiki é complemento de interpretação/organização; não se alegou medição dos bônus no executável DOS. Não foram importadas profissões, restrições ou bônus por gênero.

| Raça | Regra adaptada implementada |
| --- | --- |
| Argoniano | Vigor inicial110/110 em vez de100/100; adaptação da resistência à natação, sem sistema de natação |
| Bretão | Dano positivo mágico recebido pela ação×0,5; cura preservada, sem saving throw |
| Elfo negro | +floor(nível/4) dano e pontos percentuais de acerto com armas |
| Alto elfo | Imunidade ao estado3 Paralisia |
| Khajiit | AGI×1,05, arredondamento MV; substitui escalada ausente |
| Nórdico | Taxa de frio(elemento3)×0,5, sem saving throw |
| Redguard | +floor(nível/3) dano/acerto corpo a corpo |
| Elfo da floresta | +floor(nível/3) dano/acerto com arcos; sem arco cadastrado por antecipação |

Dano/acerto são conversões documentadas do original, não números copiados de um sistema por turnos que Arena não tinha.100 Vigor é base provisória, não balanceamento final ou M01-08. A classe Aventureiro é suporte técnico único; todos mantêm permissões dos dois tipos de arma/armadura cadastrados. IDs de habilidades de arma/grupos estão em ArenaCharacterVisuals.json; bônus não afetam magias/itens/desarmado.

## Assets e rastreabilidade

Inventário antes:16 combinações necessárias, uma piloto, zero conjuntos finais. Agora:16 identidades-base,15 conjuntos novos e piloto reutilizada; continuam zero conjuntos de animação completa. INVENTARIO_PERSONAGENS_M01.json distingue essas contagens. Oito chamadas de IA: sete pares de gêneros e um Bretão masculino, sem regenerar a piloto feminina ou Ria/dungeon/rato aprovados. Prompts completos em arte/prompts-criacao-m01.json; ferramenta image_gen.imagegen, modelo não informado; fontes/anexos efetivos e hashes em exportacoes-criacao-m01.json.

As imagens originais dão identidade; dungeon R02 aprovada dá acabamento/material dark fantasy; piloto existente dá continuidade de escala. Isso não converte toda a rodada v0.1 rejeitada em nova aprovação. Khajiit tem aparência humana com traço/pintura felina, sem importar cabeça de gato moderna; Argonianos têm pele azul-cinza e crista, proporções humanóides do original. Alto elfo dourado e trajes teal/verde, elfo negro de olhos vermelhos, elfa da floresta ruiva/verde preservam marcadores. Detalhes pequenos de cor de cabelo (p.ex. tons frios da nórdica), anatomia e ornamentos são interpretações, não dados comprovados no executável. Novas variantes aguardam avaliação estética do responsável; direção aprovada permanece referência.

Montagem técnica com Pillow em tools/build-character-assets.py: componentes alpha≥96 com dilatação1px, alpha/cores originais preservados, escala comum por combinação, pés emy62(mapa)/94(lateral). Mapa144×256, faces576×288(slot0 com144), lateral96×96, svActor864×576. Novas direções são poses estáticas com três cópias por direção. Folha SV repete pose em54 células: suporte de formato, **não caminhada ou ataque/dano/morte animados**. Apenas a piloto retém caminhada anterior. Nenhuma forma desenhada por código substitui os personagens. Fundo/legendas de UI são código. Contact sheet arte/personagens-m01-v01.png mostra arquivos na escala de uso.

## Dados e carregamento

Identidade no contrato de Arena_Persistence; nome/imagens/equipamento nativos, sem duplicação. Namespace arenaCreation v1 guarda confirmação e recibo, com defaults para saves antigos. Bônus são derivados e não acumulam. Recurso Vigor inicializado somente no primeiro aceite. Carregar reconstrói aparência pela chave estável raça/gênero/base; teste salva imagens nativas vazias e verifica reparo. Laboratórios antigos não recebem identidade ou Vigor. Falha durante confirmação restaura estado próprio e campos nativos.

## Validação e roteiro

Automação em Chrome desktop, contexto descartável sem saves pessoais: test-character-creation cobre teclado, nome, cancelamento, confirmação/revisão,16 combinações, bônus, aplicação única, save/load, campos ausentes e rollback; test-character-pointer cobre mouse e touch Android genérico emulado. Auditoria cobre97 registros de masters/exports, cinco logs de prompts,16 IDs e margens. Resultados/screenhots m01-07-* em doc/evidencias. Os testes anteriores de laboratório usam entrada explícita arenaLab, pois Novo Jogo agora abre criação; fixtures de composição antiga continuam usando o comportamento antigo.

Manual: abrir localhost ou playtest, escolher Novo Jogo, digitar nome, Enter para sair do campo, setas/Enter ou clique para raça e gênero, Confirmar, revisar ou criar. Após mensagem de chegada, Esc→Salvar; voltar ao título→Continuar e conferir nome/aparência/Vigor. Cancelar antes de criar deve retornar ao título sem nova gravação. Conferir todas as combinações, fonte no mobile, contornos e escala na avaliação artística. Não há criação livre de rosto, aliados ou quest implementados por associação.

Editor: nomes/status Community_Basic OFF, MV_CharacterRules ON e Arena_CharacterCreation ON lidos em diálogos do gerenciador por acessibilidade; projeto salvo, comparação semântica preservou os8 registros, fechado/reaberto. Somente versionId e scroll de edição mudaram no banco. Catálogo canônico UTF-8 sem BOM preservado. Isso é validação de autoria, **não teste visual de playtest NW.js**. Galaxy A56 real, teclado virtual/IME físico, fullscreen e desempenho não testados. Roteiro físico permanece M01-19. Sem release ou promoção desta feature em develop/main.

Diagnóstico de infraestrutura: houve timeouts de inicialização e uma falha de carregar Tilesets.json no servidor compartilhado. Causa não confirmada. Suite final passou em servidor isolado8766, com requestfailed monitorado, sem alteração de motor, scripts de jogo ou retries para mascarar erros. O servidor existente8765 foi preservado.
