# Teste de edição MV1.6.1 — cópia temporária

27/10/2026. Responsável informou que **Explorar Dungeon executou pelo RPG Maker MV1.6.1 até o ponto testado**. Estado disponível031a58b, sem hash próprio informado. É evidência manual de execução/playtest, não de editar/salvar/reabrir Map008, ler o gerenciador de plugins, percorrer toda a dungeon ou testar o Galaxy A56.

## Cópia preparada, original preservado

Abrir exclusivamente:

`D:\RPG Maker MV\Projects\Arena\tmp\mv-editor-m01-14\Game.rpgproject`

Foram copiados273 arquivos de execução, excluindo `.git`, saves pessoais, referências, documentação e temporários. O título de jogo da cópia é `Arena - TESTE TEMPORARIO M01-14`, para identificação; essa mudança foi feita na preparação, **não conta como edição pelo editor**. Map008 e plugins permaneceram iguais aos originais na cópia inicial. Baseline de hashes fica em `tmp/mv-editor-m01-14-baseline.json`; ambas as localizações são ignoradas e não serão publicadas. A ferramenta de preparação recusa sobrescrever uma cópia existente.

O original foi conferido por hashes dos273 arquivos antes/depois da tentativa: nenhum alterado. A única escrita de jogo da preparação foi em System.json **da cópia**, para rotular o teste.

## Resultado da nova abordagem

Não foram repetidas capturas de tela. Tentou-se abertura da cópia por argumento de projeto em processo separado, depois identificação/ativação e acesso ao controle nativo Abrir Projeto por acessibilidade. A janela acessível continuou identificada como Arena; não se comprovou que a cópia tivesse sido aberta. O controle retornou `element 5616 is not available in cached app state for RPGMV.exe`. Não foram enviados comandos de edição/salvamento, evitando risco de atuar no original.

`tools/verify-mv-authoring-copy.py` confirmou eventos/propriedades, arquivo de plugins canônico UTF8, nomes/ordem/status/parâmetros e arquivos referenciados. **O marcador de edição ainda não foi salvo.** Essas verificações de arquivo não comprovam abertura, leitura ou salvamento pelo editor. Resultado em `evidencias/m01-14/edicao-editor/resultado.json`.

## Cinco passos manuais

1. No MV1.6.1, use **Arquivo → Abrir Projeto** e escolha o **Game.rpgproject da cópia acima**, não o de Projects\Arena.
2. Na árvore, clique com o botão direito em **M01-14 Masmorras Imperiais** (**ID008**) → **Editar…**. Em **Nome de Exibição**, altere `Masmorras Imperiais` para `Masmorras Imperiais [TESTE EDICAO]`. Não desenhe tiles nem mude eventos. Confirme com OK.
3. Salve com **Ctrl+S**. Feche e abra novamente **a mesma cópia temporária**; volte ao mapa ID008 e confirme o nome de exibição com `[TESTE EDICAO]`, tamanho **156×156** e tileset **M01 Masmorras Imperiais**.
4. Em modo Eventos, abra o evento **062 — door.07 / 1,2**: confirme as **duas páginas** e o self-switch **A** da segunda. Saia sem mudar o evento.
5. Abra **Gerenciador de Plugin…** e confira que a lista abre sem erro e **Arena_Dungeon** permanece ativado; não altere plugins. Informe o resultado dos passos3–5. A alteração do nome pode ser desfeita depois, apenas na cópia; mantê-la até a conferência permite verificar o arquivo salvo.

A confirmação pode ser curta: “Na cópia temporária, reabri ID008 com o nome de teste salvo, propriedades/evento062 corretos e gerenciador de plugins abrindo”. Se algo falhar, informar etapa e mensagem, sem corrigir diretamente o original.

## Continuidade

M01-14 segue aprovado visualmente com ressalva futura de espessura/contraste de portas laterais. Natação continua sem custo ou regeneração de Vigor; investigação e proposta não aplicada preservadas. O único critério desktop ainda sem evidência aqui é autoria/edição no editor. **Galaxy A56 físico pertence à integração mobile e não bloqueia esta etapa desktop.** Não há merge em develop/main ou início de M01-15 sem concluir a condição de autoria solicitada. A autorização para essa sequência permanece válida, sem exigir nova autorização quando o teste passar.
