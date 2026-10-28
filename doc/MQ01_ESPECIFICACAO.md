# MQ01 — Masmorras Imperiais

Especificação M01-02, 25/10/2026. Conteúdo definido para implementação; não comprova eventos implementados. Término obrigatório: alcançar o Shift Gate, sem cidade de destino, chefe adicional ou M02.

## Fontes consultadas e precedência

- doc/wiki/Arena_Imperial Dungeons (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf, pp. 1–6, revisão oldid=3641152. https://en.uesp.net/wiki/Arena:Imperial_Dungeons_(quest). Texto integral extraído; páginas 2, 3 e 5 examinadas visualmente. Mapas nas pp. 3 e 5.
- doc/wiki/Arena_Main Quest - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf, pp. 1–2: contexto e Introduction Scene. https://en.uesp.net/wiki/Arena:Main_Quest.
- doc/wiki/Arena_Monsters - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf: catálogo e atributos. doc/wiki/Arena_Base Weapons - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf, p. 2: armas. doc/wiki/Arena_Potions - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf, p. 1: efeitos e preços.
- Instalação original enumerada em D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA; arquivos MIF presentes. Nenhum executável rodado ou recurso extraído/modificado. Não alegar verificação dos diálogos diretamente no executável.
- doc/prints/skyrim_quest_system.jfif examinada: lista de quests à esquerda, descrição e objetivos separados à direita. Aproveitar hierarquia de informações; sem importar marcadores, mapa ou aparência. Arte segue DIRECAO_DE_ARTE.md.

As traduções abaixo derivam das transcrições locais da UESP (conteúdo atribuído à UESP e colaboradores, CC BY-SA 2.5 conforme os PDFs). São textos traduzidos/adaptados para esta releitura, não localização oficial. Créditos e fontes devem acompanhar futura distribuição. As decisões atuais do projeto prevalecem sobre o comportamento original.

## Geometria examinada e adaptação

Na p. 3, a cela inicial em forma de bota fica à direita/leste; o portal é o ponto verde no extremo inferior esquerdo/sudoeste. Há corredores interligados, desvios, portas, áreas alagadas e plataformas. A colagem do Codex na p. 5 reforça a rede de corredores e a posição relativa dos dois extremos; sua legenda pequena não permite copiar cada objeto com segurança.

Preservar topologia reconhecível: cela oriental, chave junto à parede norte, porta voltada ao corredor, primeiro tesouro após a saída, percurso com alternância oeste/sul e corredor final estreito até o portal a sudoeste. Ramificações oferecem tesouros opcionais; não exigir combate ou coleta total para alcançar o portal. A geometria será compactada em grade MV na M01-14; não alegar reconstrução 1:1 ou copiar coordenadas invertendo eixos por engano (o original conta X a partir do nordeste, aumentando para oeste).

Coordenadas originais somente como referência: chave (3,19), porta (4,21). A grade MV cresce para leste/sul; as coordenadas definitivas de eventos serão registradas na M01-14. Map001 será um laboratório técnico, não o mapa final.

Não foi confirmada cama nesta área: o original permite repousar sobre plataformas elevadas, com risco de ataques. A adaptação confirmada exige camas elegíveis; não transformar plataformas em camas nem importar descanso livre. Validar cama/restauração no laboratório em M01-17.

## Sequência e contratos de eventos

| Evento | Gatilho/condição | Resultado e transição | Fonte |
| --- | --- | --- | --- |
| CRIACAO | Nova partida | Nome, uma das oito raças originais e gênero; escolhas persistentes, sem profissão | PERSONAGEM; Races pp. 1–2 |
| INTRO | Criação confirmada, uma vez | Apresentar I01–I05, sem voz; iniciar sonho | Main Quest pp. 1–2 |
| RIA | Após introdução, uma vez | Apresentar R01–R07; quest ativa, etapa 10, objetivo chave | Imperial pp. 2–3 |
| CHAVE | Interagir junto à parede norte; porta ainda fechada | Conceder apenas quantidade faltante até 1; etapa 20; fonte reaparece se faltar enquanto porta fechada | Imperial p. 3; QUESTS |
| PORTA | Interação; chave 1 | Verificar posse, sanear duplicados, registrar uso, abrir permanentemente; etapa 30; verificar registro de uso na entrada da próxima etapa | Imperial p. 3; QUESTS |
| TESOURO_01 | Fora da cela; interação/contato no ponto de coleta | Coleta automática uma única vez; ouro e no máximo um equipamento; não abrir seletor de coleta | Imperial p. 3; LOOT |
| TESOUROS_OPCIONAIS | Desvios acessíveis | Mesma regra por fonte, sem impedir conclusão | Imperial pp. 3–5 |
| PATRULHAS | Contato com inimigo vivo e sem encontro em curso | Batalha, canEscape=false/canLose=false; vitória marca fonte derrotada e retoma mapa | Imperial p. 3; COMBATE |
| PORTAL | Contato ao final sudoeste, etapa 30 | Verificar uso da chave/porta; concluir quest etapa 40 uma vez; apresentar F01 e encerrar demo | Imperial p. 4; DEMO_INICIAL |

Chave: item importante de ID 1, preço 0, não consumível pelo menu; consumo único pela porta é adaptação explícita para representar uso irreversível. Registrar uso antes da remoção na mesma operação síncrona. Após porta aberta, ausência é legítima e não reativa fonte; eliminar qualquer duplicata apenas desse ID. Antes da porta, a fonte na cela permanece acessível; recuperação não repete tesouro, experiência ou ouro. Ao detectar falta, bloquear avanço e reativar fonte; nunca conceder item de etapa futura.

Estados previstos para implementação em M01-05: schemaVersion, character, quests.MQ01.stage, sources, enemies, hotbar, progression. O detalhamento e a migração pertencem a esse item; o banco nativo ainda não implementa esse contrato.

## Textos pt-BR

Dividir em caixas por frases sem truncar. {nome} usa o nome do ator; quebra de página não altera a ordem. I01–I05 são tradução condensada da introdução, R01–R07 tradução da fala transcrita de Ria. Objetivos e encerramento são adaptações de interface.

**I01.** Durante séculos, facções travaram pequenas guerras e disputas de fronteira. Em 2E 896, Tiber Septim derrotou seus adversários, tomou o poder e proclamou-se Imperador. Mas os anos amargos de guerra deixaram suas marcas.

**I02.** Tamriel, “Beleza da Aurora” na língua élfica, tornou-se um nome raro nos lábios aflitos. Onde vida e morte eram lados de uma moeda lançada a cada dia, o povo passou a chamar sua terra de sofrimento de Arena.

**I03.** Agora, uma nova ameaça surge. Enquanto o Imperador Uriel Septim VII celebra seu quadragésimo terceiro aniversário, corações invejosos cobiçam o trono e tramam sua queda. Dizem que a esperança voa nas asas da morte. Prepare-se: como previram os Pergaminhos Ancestrais, sua aventura começa aqui.

**I04.** O Imperador e Talin, líder da Guarda Imperial, atendem ao chamado do Mago de Batalha Jagar Tharn, que anuncia rumores de traição. O Imperador é traído e transportado para uma dimensão escolhida por Tharn. Após meses de preparação, o usurpador toma o trono.

**I05.** Ria Silmane, antiga aprendiz de Tharn, é capturada antes de alertar o Conselho dos Anciões. Manipulando a essência da magia, Tharn assume a aparência do verdadeiro Imperador e transforma seus servos em cópias distorcidas da Guarda Imperial.

Adaptações da introdução: uniformizado Uriel Septim VII (a transcrição registra IV como erro); omitida contagem contraditória de 492 anos, preservando 2E 896 e a ordem dos acontecimentos; mantido Talin conforme a transcrição, sem substituição conjectural. Não acrescentar cenas de M02.

**R01.** Não tema, sou eu, Ria Silmane. {nome}, escute: não resta mais ninguém para continuar esta luta. Deixaram você nesta cela para morrer. Jagar Tharn, Mago de Batalha Imperial de Tamriel, assumiu a aparência do verdadeiro Imperador. Ele não considera você uma ameaça, por ocupar apenas um pequeno lugar na Corte Imperial. Nessa arrogância, cometeu seu primeiro erro.

**R02.** Olhe para a parede norte desta cela. Você encontrará uma chave de rubi que abrirá a porta. Pegue-a e fuja. Tharn usava estas passagens para esconder tesouros roubados dos cofres do Imperador. Se quiser, poderá reunir o suficiente para se sustentar longe da sede imperial. Cuidado: muitas criaturas vivem agora nos esgotos, ratos repugnantes e goblins.

**R03.** Para mim é tarde demais, pois já estou morta. Somente meus poderes de feiticeira me mantêm entre esta vida e a próxima. Mas esse poder está se esvaindo. Não sucumba à ganância, ou estes túneis também poderão se tornar seu último repouso.

**R04.** Ainda consigo exercer minha magia até certo ponto. Se seguir para oeste a partir desta cela e depois para sul, encontrará um Shift Gate. Ele levará você para longe o bastante do centro do Império para ficar em segurança. Se sobreviver a estes esgotos, voltará a me ver.

**R05.** Lembre-se, {nome}: Tharn assumiu a aparência do Imperador. Ninguém contestará a palavra dele pela sua. Voltarei a você em seus sonhos; por isso é essencial repousar de tempos em tempos. Assim poderei me comunicar e oferecer ajuda.

**R06.** Você está entrando em uma arena perigosa, meu amigo, na qual os participantes são seres além da sua compreensão mortal. Não invejo seu papel. Há, porém, um poder dentro de você que ainda não foi despertado.

**R07.** Procure por mim quando tiver adquirido experiência no mundo. Você é minha última e melhor esperança.

**J10 (adaptação).** Ria Silmane apareceu em meu sonho. Jagar Tharn tomou o lugar do Imperador. Há uma chave de rubi junto à parede norte da cela. Objetivo: obter a chave.

**J20 (adaptação).** Encontrei a chave de rubi. Preciso abrir a porta da cela. Objetivo: abrir a porta.

**J30 (adaptação).** Ria disse que devo seguir para oeste e depois sul até o Shift Gate. Os esgotos abrigam criaturas e tesouros; a ganância pode ser fatal. Objetivo: alcançar o Shift Gate.

**J40 (adaptação).** Alcancei o Shift Gate e escapei das Masmorras Imperiais.

**UI_CHAVE (adaptação).** Chave de rubi obtida.

**UI_PORTA (adaptação).** A chave de rubi abre a cela.

**UI_SEM_CHAVE (adaptação).** A porta está trancada. Procure a chave junto à parede norte.

**F01 (texto novo de produto).** Você alcançou o Shift Gate. Fim da demonstração M01 — a jornada de Arena continua além desta versão. Obrigado por jogar.

O portal original envia a uma cidade da província da raça; o M01 encerra antes dessa viagem. A pergunta de proteção de cópia da edição em disquete não será reproduzida (não é obstáculo narrativo e não ocorre na edição CD).

## Conteúdo mínimo e encontros

- Rato e goblin: encontros comuns. Homem-lagarto: encontro opcional de maior risco, citado como ocasional pela fonte. Valores de combate serão convertidos e identificados como provisórios, sem vender equivalência numérica ao sistema em tempo real.
- Armas iniciais de teste: adaga e espada curta. Armaduras: couro e cota de malha, além da aparência-base. Não transformar itens do cenário técnico em concessões automáticas da campanha.
- Poções: cura, restaurar poder e Vigor. Tabelas de dificuldade e probabilidade são trabalho M01-13; o banco não usará drops MV para simular silenciosamente as seis categorias.
- Não há inimigo obrigatório com chave nem chefe de encerramento. Patrulhas comuns: rotas curtas de ida/volta em trechos com passagem lateral, velocidade MV 3, frequência 3, pausa 60 quadros em extremidades; não atravessar porta fechada, bloquear tesouro ou estacionar no portal. Validar rotas na geometria final.
- Ciclo: vivo → encontro em curso → derrotado após vitória; game over após derrota; cancelar transição inválida sem marcar morte; não respawnar ao carregar. Saída após conclusão reativa comuns pelo contrato genérico, testado no laboratório porque a prisão não permite retorno narrativo na demo.

## Cobertura e vínculos

M01-14 fixa coordenadas/colisões; M01-16 implementa etapas e diário; M01-18 integra textos e ilustrações. Testar antes da chave, após porta, após combate e antes do portal. Cobrir ação fora de ordem, chave ausente/duplicada/consumida, repetição do portal, save/load em cada etapa e isolamento entre fontes de loot. A especificação conclui M01-02; a execução desses testes pertence aos itens de implementação.


## Atualização M01-14

M01-14 verificou START.MIF/START.INF locais e planta wiki. Coordenadas textuais acima (3,19)/(4,21) são históricas: a grade local contém chave em FLOR3,20 e registro LOCK4,23. Mapeamento orientado/MV e justificativa da divergência em DUNGEON_M01_14.md. Layout inicial confirmado com cela leste e Gate sudoeste; não se assume equivalência métrica ou de colisão3D. Porta/chave/quest reais permanecem M01-16; Gate nesta etapa é contato técnico, não encerramento narrativo.

## Integração M01-16

J10–J40 usados no diário; eventos reais de fonte/porta/Gate e tesouros pelo ledger implementados, mantendo coordenadas verificadas M01-14. Consumo irreversível e fonte recuperável conforme esta especificação. Bootstrap técnico na entrada da dungeon até M01-18 chamar begin após Ria; não há introdução/F01/cidade ou pergunta de proteção de cópia nesta feature. QUESTS_M01_16.md separa confirmação documental, adaptações, proxy provisório de tesouros, migração e evidências. Rotas de patrulha vigentes são as M01-15 documentadas, não a proposta inicial de60quadros acima.
