## Integração M01-18

M01-18 implementa o fluxo normal Novo Jogo/criação/introdução/Ria/dungeon/Gate/F01, com persistência e retorno ao título. Laboratórios no título permanecem separados. Implementação técnica para revisão; não significa M01 inteiro validado ou release. Roteiro, fonte original, limites de balanceamento/velocidade, editor e mobile em NARRATIVA_M01_18.md.

# Primeiro marco: introdução e dungeon inicial

Este documento especifica M01, correspondente à quest MQ01 — Imperial Dungeons e à introdução. Os marcos seguintes acompanham as demais quests principais conforme MARCOS_DO_PROJETO.md.

BACKLOG_M01.md organiza a implementação deste marco em itens rastreáveis, dependências e critérios de aceitação. Utilizar os cenários técnicos previstos para validar recursos que não tenham contexto narrativo na dungeon inicial.

## Entregas confirmadas

1. Construir a base de dados do RPG Maker para sustentar o conteúdo do marco e sua expansão.
2. Produzir os assets necessários à introdução e primeira dungeon, seguindo DIRECAO_DE_ARTE.md e referências visuais adicionadas a doc/prints/.
3. Construir o mapa da dungeon inicial em vista superior, com movimento por grade.
4. Configurar os eventos conforme a descrição da wiki, respeitando as adaptações aprovadas.
5. Criar um encerramento explícito da demo.

O idioma inicial é somente Português Brasileiro. Não é necessário produzir todas as cidades, quests ou assets da campanha antes de entregar a demo. Organizar os dados para expansão, sem confundir a estrutura do catálogo com implementação integral de todo o conteúdo.

## Conteúdo-base consultado

Arena_Main Quest, páginas 1–2, descreve a introdução da campanha. Arena_Imperial Dungeons (quest), páginas 1–4, descreve a aparição de Ria Silmane, a chave da cela e a saída pelo Shift Gate. Os PDFs estão em doc/wiki/.

Traduzir os textos preservando sentido e contexto; registrar adaptações necessárias ao formato 2D por turnos. Não transportar automaticamente coordenadas do mapa original para o MV. Consultar a imagem do mapa antes de detalhar a geometria; esta pesquisa extraiu texto, não validou visualmente cada corredor.

## Eventos mínimos propostos

- Criação do personagem com nome, raça e gênero e assets predefinidos, conforme PERSONAGEM.md.
- Introdução ilustrada e textual, sem geração de vozes.
- Orientação de Ria e registro inicial no diário.
- Obtenção da chave como item importante, abertura da cela e validação de progressão.
- Inimigos visíveis com patrulha e combate por contato, sem fuga inicial.
- Pontos de loot e descanso somente onde a especificação da área os justificar.
- Alcance do Shift Gate e transição para o encerramento da demo.

O fim da demo ao alcançar o Shift Gate está confirmado; o evento de encerramento deve informar o fim da versão demonstrativa, sem sugerir que a campanha inteira terminou. Não criar um chefe final artificial apenas para fechar o marco.

## Validação da entrega

Testar abertura, nova partida, introdução, chave, porta, combate, loot, diário, salvamento/carregamento e encerramento. Validar os itens de missão nos dois pontos de transição definidos em QUESTS.md. M01 considera o navegador desktop como alvo obrigatório, inicialmente Chrome. Adaptações/validação física mobile e APK passam a [MOBILE-01](MOBILE_01.md); não solicitar novamente os testes físicos já válidos nem bloquear o fechamento desktop por testes mobile adicionais.

Validar também menus em slots, técnicas por arma, recursos e aparência por armadura conforme os sistemas efetivamente incluídos. Bugs ou funcionalidades incompletas devem estar registrados; não declarar todo o catálogo de magias ou a campanha implementados pela conclusão deste marco.


## Recursos adiados

Geração procedural, mapa e bússola são opcionais e terão sua inclusão decidida nos próximos marcos. Não fazem parte dos requisitos de conclusão do M01. Essa decisão não impede a reutilização de templates na autoria dos mapas.
