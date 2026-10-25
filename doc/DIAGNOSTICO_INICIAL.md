# Diagnóstico inicial

Inspeção de arquivos em 25/10/2026. Projeto: `D:\RPG Maker MV\Projects\Arena`.

## Verificado

- `Game.rpgproject` identifica RPGMV 1.6.1.
- O repositório Git estava sem alterações pendentes antes da inclusão desta documentação.
- A pasta `doc/` já existia e estava vazia.
- Existem as pastas de dados, scripts, imagens, áudio, fontes, ícone e vídeos.
- `Community_Basic` é o único plugin listado e está ativo; seu arquivo está presente.
- A configuração do plugin usa resolução 816 × 624.
- Não há arquivos em `img/` nem em `audio/`.
- `MapInfos.json` contém somente a entrada nula e não há arquivos de mapa em `data/`.
- O sistema define o início no mapa 1, posição (8, 6), embora esse mapa não exista.
- O título do jogo é Arena. A imagem de título configurada é `Castle`, que está ausente.
- O sistema ainda contém a referência de battler `Dragon`; não há imagem correspondente. Seu impacto depende do fluxo em que for utilizada.
- O grupo inicial referencia o ator 1. Esse ator existe, mas está sem nome e sem imagens de personagem, rosto e batalha.

## Consequências e validação pendente

O projeto ainda precisa de um mapa inicial válido e dos recursos mínimos utilizados pelas telas e eventos para permitir uma partida completa. Referências a recursos removidos devem ser auditadas antes do primeiro teste jogável.

Esta inspeção não executou o jogo nem testou o editor. Não confirma a primeira falha em tempo de execução. Também não é um inventário exaustivo de todas as referências em campos de áudio, animações e outros registros do banco de dados.

## Próxima tarefa recomendada

Definir a apresentação visual e o combate do protótipo. Em seguida, auditar os recursos necessários ao boot e criar um mapa mínimo com início válido, usando recursos provisórios de origem registrada. Testar abertura, nova partida, movimentação e menu no RPG Maker MV.

## Git durante a inspeção

O Git exigiu uma exceção de confiança porque o processo de inspeção usa uma conta diferente da proprietária da pasta. A consulta foi feita com uma opção temporária limitada ao comando; nenhuma configuração global foi alterada.
