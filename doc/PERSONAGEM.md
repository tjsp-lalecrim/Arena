# Criação e evolução do personagem

## Criação confirmada

A nova partida permitirá escolher nome, raça e gênero. Os assets serão predefinidos para cada combinação de raça e gênero; não há editor livre de rosto ou corpo previsto por esta decisão. A apresentação inicial é em Português Brasileiro.

Registrar as opções de raça e gênero disponibilizadas e o conjunto visual associado antes de produzir assets. Não inventar uma lista de opções como se já estivesse aprovada. Cada combinação implementada deve ter aparência-base consistente entre mapa e combate, respeitando DIRECAO_DE_ARTE.md e a mudança visual por armadura equipada.

Aplicar somente os bônus raciais adaptados, sem importar classes profissionais de Arena ou suas restrições de equipamento. Não atribuir bônus mecânicos por gênero sem decisão específica. Salvar e carregar deve preservar nome, raça, gênero, equipamentos e aparência correspondente.

## Vida, mana e Stamina

Estado operacional M01-08 R01: máximos iniciais100 Vida/50 Mana/100 Vigor (+10 inicial Argoniano), uma escolha de+10 em um recurso por nível2–99, sem cura ao evoluir. EXP/nível continuam nativos; máximos não usam curvas automáticas MV. Configuração, migração, escolhas, testes e roteiro em RECURSOS_E_PROGRESSAO_M01_08.md. Os parágrafos de definição abaixo registram a direção que orientou esta implementação; o balanceamento continua provisório.

A progressão de vida, mana e Stamina deve seguir o modelo de Skyrim com as adaptações necessárias ao projeto. Tratar esse modelo como base confirmada, não como escolha ainda aberta entre o crescimento padrão do MV e Skyrim. As fórmulas e os valores adaptados serão registrados e balanceados na implementação, sem importar automaticamente regeneração, peso de inventário ou outros sistemas.

Na feature de progressão, propor e registrar uma regra concreta para crescimento dos máximos dos três recursos e sua relação com o nível do personagem, priorizando balanceamento. Não substituir essa direção pelo crescimento automático padrão do MV sem verificar sua adequação. Também não importar todos os sistemas de Skyrim por associação.

As regras já confirmadas prevalecem: Stamina é gasta somente em combate por técnicas, sem regeneração passiva; recupera por poções ou camas. Inicialmente dormir em cama restaura toda a vida, mana e Stamina. A referência de progressão não autoriza regeneração passiva de Stamina.

## Critérios de validação

- É possível iniciar a demo escolhendo nome, raça e gênero e receber os assets predefinidos correspondentes.
- A raça aplica os bônus documentados sem bloquear equipamentos ou criar profissão.
- Trocar armadura preserva a identidade da combinação escolhida.
- Salvar/carregar mantém escolhas e recursos.
- A evolução dos máximos segue a regra de progressão aprovada na feature, sem conceder aumentos repetidos por reentrada ou carregamento.

As escolhas de criação estão confirmadas; o catálogo visual e a regra numérica de progressão serão especificados durante o desenvolvimento.

## Histórico — inventário prévio M01-07 (superado pelo fechamento R05)

`doc/arte/INVENTARIO_PERSONAGENS_M01.json` registra16 combinações necessárias das oito raças do catálogo e duas opções históricas de gênero. Uma bretã piloto tem exploração/retrato/pose lateral; isso não valida as outras15 nem uma folha completa de combate. Nenhuma UI ou aplicação racial adicionada nesta rodada; ler `arte/FIDELIDADE_E_VALIDACAO_R05.md`. A prioridade do original e as adaptações numéricas continuam separadas; sem bônus por gênero, profissões ou restrições de equipamentos.

## Implementação atual M01-07

Criação-base implementada em feature/m01-criacao-personagem: nome,8 raças,2 gêneros,16 visuais-base próprios, confirmação/revisão/cancelamento, bônus raciais derivados e save/load. Especificação/valores/fontes/roteiro em M01_07_CRIACAO.md. O inventário anterior é histórico: agora todas as combinações têm base, porém movimentos novos são estáticos e não representam biblioteca animada completa. Sem classes profissionais ou bônus por gênero. Criação termina em chegada provisória Map004, sem narrativa/dungeon final. Laboratório e galerias mantidos no título. Sem teste físico A56.

## Aprovação e fechamento R05

O responsável autorizou P01–P08 da auditoria R04 e aprovou as artes atuais para prosseguir com ressalvas. Valores/textos sincronizados em ArenaCatalog e plugins0.2.0; decisão exata em decisoes/M01_07_APROVACAO_R05.json. Bônus derivados não crescem por nível nem acumulam ao carregar; só o Vigor inicial+10 é concedido uma vez. Sem profissões, restrições ou bônus por gênero. Recortes arredondados/heterogêneos e diferenças de orientação continuam existentes e adiados, com arquivos/hash em arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json. Pilotos R04B continuam estudos fora do catálogo ativo. Ver FECHAMENTO_M01_07.md para critérios/testes e BALANCEAMENTO_RACIAL_CENARIOS_M01.md para eficácia prática ainda pendente. M01-08 foi autorizado posteriormente, em rodada própria; não reabre arte ou bônus aprovados.
