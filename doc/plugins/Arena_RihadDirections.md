# Arena_RihadDirections0.1.0

Após Arena_NPCDialogues. `ArenaRihadDirections.json` contém pontos de interesse, entradas acessíveis, tipos de serviço e blocos identificados com fonte/classificação/ilustração opcional. `tools/build-rihad-guidance.cjs` recompõe bindings e destinos a partir de RIHAD_NPCS_M02, RIHAD_SINALIZACAO_M02 e contratos da pousada/corte; executado pelo gerador de Rihad. Não acrescenta descobertas, missões, serviços ou recompensas.

## Fontes e adaptação

Consulta somente leitura: instalação original `ARENA/TEMPLATE.DAT`, CP437, #0259/1 (não sabe), #0260/1 (direção), #0261 (local próximo/marca no mapa); `Docs/Manual.pdf` completo, interação com pessoas, bússola e automapa; wiki local **Arena:Town Guide**, seção **Where Is...**. O manual confirma os controles gerais; a seção detalhada de orientação vem da wiki e dos templates, sem alegar observação em DOS. Extrações de consulta ficam ignoradas em tmp/rihad-guidance.

O original oferece direções cardeais gerais e indicação no automapa quando próximo. O projeto traduz a resposta #0260 e substitui `%di` pelo rumo calculado, sem mostrar códigos. Adapta o contexto próximo de #0261, sem alegar que o NPC desenhou em um automapa inexistente. Instruções de ruas, placas, grade da corte, serviço fechado, seta e cancelamento são **adaptações desta versão**, identificadas nos blocos/entradas. Não ativa rumores de artefatos ou quests secundárias. “Pousada do portão” permanece nome genérico do projeto; tipos Templo/Equipamentos/Guilda dos Magos/Taverna vêm das portas e placas DCN, não nomes próprios inventados.

## Rotas e estado

“Onde fica…?” não chama a orientação exclusiva20→30 do informante. Oferece pousada, corte, portão e acesso aos arredores; para cada tipo de estabelecimento fechado, escolhe a entrada alcançável mais próxima **pela rua**, a partir da posição atual do NPC. Não lista Stonekeep/Fang Lair nem altera seu sigilo. Na pousada, os assuntos locais são quarto/cama e saída para a cidade; o diálogo da saída orienta perguntar aos moradores após sair.

Rumo geral: posição atual de quem responde → entrada acessível. Na reconstrução urbana, `MV x=2+3*(127-originalX)+1`, `MV y=2+3*originalY+1`: no runtime x+ é leste e y+ é sul; não usar o sinal do X original diretamente. Caminho por busca em largura nos quatro sentidos, respeitando as flags nativas dos dois lados de cada passo. A indicação aponta para a próxima célula útil da rota, não através de uma parede. Pessoas móveis não alteram a topologia da rua: pode ser necessário esperar ou contornar um morador temporariamente na frente.

A busca ocorre ao consultar/escolher um destino ou carregar outro mapa; o campo de distância do destino escolhido é reutilizado, sem busca a cada frame. Só `targetId` e o pedido explícito de ocultar a indicação ficam em MVStateStore `arenaRihadGuidance`v1. Saves antigos recebem valores vazios pelo contrato existente; não muda `arena:m01:save-v1`. Salvar/carregar recalcula a rota da posição restaurada. Entrar em outro mapa encerra o destino exterior; a audiência automática anterior continua disponível quando não há seleção explícita. **Encerrar indicação** no submenu ou no menu normal oculta a seta, inclusive o piloto automático, até nova seleção. Uma indicação ativa termina ao transferir para outro mapa.

Escolhas nativas, retorno aos assuntos por Esc, retratos e paginação de ArenaCourt; soltura/nova pressão reaproveitada. Não há transporte automático, cura, gasto ou efeito de quest por orientação. Blubamka mantém audiência/entrega específicas.

## Encaixes existentes

Sem geração ou alteração de masters/exportações. A montagem anterior tratava os2×2tiles do frame lateral como sua área final e punha a faixa inferior sobre o piso; também deslocava o centro24px para oeste. `arenaLateralFittings` nos mapas gerados separa posição lógica de extensão visual: duas peças do atlas ficam centradas no vão, com suas bordas opacas junto aos lábios de parede, deixando a faixa transitável48px livre. Entradas exteriores alinham a folha à borda acessível da parede (±6px). Sprites decorativos ficam abaixo do personagem e não possuem colisão. Os dez frames internos são estáticos, não novas portas animadas; animações e âncoras das portas funcionais permanecem intactas.

[Comparações e verificações](../evidencias/rihad-orientation-fittings-v02/resultado.json). Relato recebido: funcionamento geral satisfatório, com encaixes inadequados sobretudo E/W. O defeito é tratado nesta entrega; não atribuir ao relato aprovação visual destes ajustes ou testes específicos de persistência.

|Caso|Antes|Depois|
|---|---|---|
|Passagem da pousada|[V01](../evidencias/rihad-orientation-fittings-v02/antes-pousada-passagem.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-pousada-passagem.png)|
|Passagem da corte|[V01](../evidencias/rihad-orientation-fittings-v02/antes-corte-passagem.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-corte-passagem.png)|
|Fachada da pousada|[V01](../evidencias/rihad-orientation-fittings-v02/antes-pousada-externa.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-pousada-externa.png)|
|Entrada leste|[V01](../evidencias/rihad-orientation-fittings-v02/antes-leste.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-leste.png)|
|Entrada oeste|[V01](../evidencias/rihad-orientation-fittings-v02/antes-oeste.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-oeste.png)|

Roteiro integrado: informante → Onde fica…? → Pousada, acompanhar seta e entrar; conferir os frames internos e falar com a responsável; voltar à rua e perguntar a um morador mais ao sul pela Corte; seguir até a grade/porta, conferir os frames da audiência e sair. Escolher um serviço fechado, conferir a indicação da fachada e encerrar pelo menu. Salvar no caminho e carregar para conferir a indicação restaurada. Usar a mesma partida, sem limpar dados do site. Avaliação manual da mudança pendente.
