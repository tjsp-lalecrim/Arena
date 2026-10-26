> Estado atual: **rejeitada esteticamente pelo responsável**. Registro histórico v0.1; execução técnica não comprova identidade Arena/TES nem aprovação. A imagem com protagonista não atende à regra narrativa 1.1.

# Amostra artística M01-06 — v0.1

Direção DIRECAO_DE_ARTE.md 1.0. Ferramenta image_gen.imagegen, geração/edição por IA; modelo/seed não expostos. Prompts completos, transparência solicitada e imagens efetivamente anexadas em prompts-m01-06.json. Mestres autorais selecionados em art/masters/, fora dos diretórios carregados; dimensões reais e SHA-256 de mestres/exportações em exportacoes-m01-06.json. Nenhuma imagem externa da wiki/prints foi copiada para os assets.

## Fontes efetivamente consultadas

- doc/wiki/Arena_Races - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf, p.3, examinada visualmente: bretões, opções masculina/feminina; identidade geral e cabelos escuros. A mulher piloto e suas roupas são criação/adaptação artística, não personagem canônica nova nem escolha obrigatória da demo.
- Arena_Monsters, p.17, examinada visualmente: rato e silhueta baixa/cauda; adaptado em pintura, sem copiar pixels do sprite.
- Arena_Ria Silmane, p.1, examinada visualmente, e Imperial Dungeons pp.2–3 já especificadas em MQ01_ESPECIFICACAO.md: visita do espírito no sonho, cela, chave e orientação. A cena não representa encontro físico nem combate.
- Base Weapons p.2, Base Armor pp.1–2 e Potions pp.1–2: adaga, couro e líquido de cura amarelo/dourado. Referências textuais dos levantamentos locais.
- doc/prints/knight_online_inventory.jfif examinada nesta rodada: objetos distinguíveis em slots, sem importar estética/MMORPG ou novas mecânicas. Estilo dark fantasy prevalece.
- Instalação original consultada explicitamente: ARENA/README.TXT identifica 1.07 CD-ROM; nenhuma extração/substituição de arquivos originais. Identidade visual do original foi consultada nos screenshots dos PDFs locais acima. As fontes foram descritas textualmente nos prompts; não foram anexadas imagens desses PDFs ao gerador. As únicas imagens anexadas às derivações foram os mestres IA listados no JSON de prompts.

## Fichas de continuidade

Bretã piloto feminina adulta: pele clara oliva, olhos castanhos, rosto comprido, cabelo castanho escuro em trança curta, camisa marfim, colete de couro castanho, calça carvão e botas gastas; sem capa/arma/capacete. Mantidos os traços entre retrato, exploração, perfil e prisioneira da ilustração. Ria é outra mulher, etérea, cabelo longo solto, túnica cinza-azulada; não usar o retrato da prisioneira como Ria.

Rato: pelagem marrom escura, orelhas arredondadas, cauda longa fina, postura baixa, voltado para direita. Três poses de farejo/respiração; mesma escala e apoio inferior, sem deslocamento do sprite. Não há golpe, dano, morte, IA ou contágio implementados.

## Amostras e formatos realmente integrados

| Categoria | Arquivo no jogo | Escala/consumidor |
| --- | --- | --- |
| Exploração | img/characters/$Arena_Breton_Pilot.png | Folha nativa 144×256: 3 colunas × 4 direções, célula 48×64; linha baixo/esquerda/direita/cima |
| Retrato | img/faces/Arena_Breton_Pilot.png | Folha nativa 576×288, primeira face 144×144; demais posições vazias |
| Retrato de galeria | img/pictures/arena_breta_retrato_v01.png | 144×144, mesma origem da face |
| Jogador lateral | img/pictures/arena_breta_lateral_v01.png | Pose de combate estática 96×96, Sprite técnico; não é folha nativa svActors 9×6 |
| Inimigo | img/pictures/arena_rato_respiracao_v01.png | 288×64, 3 quadros 96×64; ciclo 0→1→2→1, 18 updates por quadro |
| Cenário | img/tilesets/Arena_Stone_M01.png | B nativo 768×768; tile1 chão, tile2 parede, 48×48; célula0 transparente |
| Ícones | img/pictures/arena_icones_v01.png | Três células 32×32: adaga, couraça e cura; mostrados na galeria, ainda não substituem o IconSet global |
| Introdução | img/pictures/arena_ria_sonho_v01.png | 816×544, mestre 1536×1024; evento mostra imagem com legenda técnica |

Frente/costas em img/pictures são recortes auxiliares 48×64 da folha final. Não há produção das 16 combinações, duas armaduras visuais ou 54 movimentos SV: são próximas etapas. Não promover a pose isolada a suporte de batalha completo. A amostra não fixa a raça da criação futura.

## Montagem e revisão

`tools/build-art-samples.py` faz somente extração/montagem: recorta componentes alpha, exclui pontinhos desconectados da geração, preserva cores/antialias com margem de 1px, usa escala comum entre frames e normaliza a base dos pés. Não desenha personagens/ícones/pedra substitutos. Usa Pillow do runtime local. Exportações reproduzíveis a partir dos mestres versionados. As dimensões devolvidas pelo gerador diferiram das solicitadas; o script usa dimensões reais, não presume 1024×1024.

Piloto foi visto em 48×64, 96×96 e 144×144 antes da montagem do mapa. Caminhada v01 rejeitada por quadro de perfil virado ao lado errado; v02 corrigiu direção. Rato v01 teve margens insuficientes; v02 também não respeitou perfeitamente células iguais, por isso extração usa três componentes globais para não cortar caudas. Essas limitações do gerador estão registradas; os mestres anteriores foram preservados como referências de derivação, não carregados pelo jogo.

No export final, 12 células de personagem têm borda transparente e apoio y62; rato tem apoio y60, com no mínimo4px de margem lateral; ícones ficam dentro da célula com margem. Ver caixas alpha no resultado de validação. Não houve esticamento independente de cada pose. Detalhes de face se simplificam intencionalmente em 48×64; o retrato conserva identidade. A caminhada ainda é um estudo de passos curtos, com alternância sutil; não é aprovação de animação final para toda a biblioteca.

Piso/parede foram vistos repetidos no mapa: legíveis como laje versus alvenaria, sem buraco alpha. A repetição do módulo é perceptível; estes dois tiles não são autotiles, cantos, transições ou kit final da dungeon. A luz foi mantida consistente para a amostra. Ícones vistos a32px com silhuetas diferentes. Corrigidas sobreposição de legenda no perfil e transparência do texto da galeria sob a cena de Ria.

## Validação e abertura

Título → **Amostra visual** inicia partida técnica nova em Map002, sem modificar System.startMapId nem Map001. Mover por setas/clique; Esc abre menu e salvar. Em (4,8), olhar para baixo e Enter na placa Ria (4,9); mensagem mostra a ilustração sem iniciar MQ01. Em (1,8), olhar para baixo e Enter na placa Sair (1,9) retorna ao laboratório com imagens técnicas anteriores. Perfil separado de navegador recomendado para não misturar saves pessoais.

No editor, selecionar M01-06 Amostra artística apenas inspeciona o mapa; playtest normal chega ao título e ao mesmo comando. Não é necessário mudar posição inicial do projeto. A conferência manual do novo mapa/plugins no editor e no Galaxy A56 não foi realizada nesta rodada. Evidência manual anterior de save/load não é atribuída a esses novos assets.

Testes automáticos e capturas reais de Chrome desktop em doc/evidencias/m01-06-arte.json, m01-06-mapa.png, m01-06-ria.png e m01-06-loop.gif. GIF monta as quatro capturas da sequência no motor; não é um render alternativo para ocultar problemas do mapa. Arte validada nesta escala desktop. Resultado M01-06: amostra das categorias gerada, integrada e verificada em navegador, sem declarar biblioteca final, combate ou suporte mobile concluídos.
