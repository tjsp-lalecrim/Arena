# Arena_RihadDirections0.2.0

Após Arena_NPCDialogues. `ArenaRihadDirections.json` contém pontos de interesse, entradas acessíveis, tipos de serviço e blocos identificados com fonte/classificação/ilustração opcional. `tools/build-rihad-guidance.cjs` recompõe bindings e destinos a partir de RIHAD_NPCS_M02, RIHAD_SINALIZACAO_M02 e contratos da pousada/corte; executado pelo gerador de Rihad. Não acrescenta descobertas, missões, serviços ou recompensas.

## Fontes e adaptação

Consulta somente leitura: instalação original `ARENA/TEMPLATE.DAT`, CP437, #0259/1 (não sabe), #0260/1 (direção), #0261 (local próximo/marca no mapa); `Docs/Manual.pdf` completo, interação com pessoas, bússola e automapa; wiki local **Arena:Town Guide**, seção **Where Is...**. O manual confirma os controles gerais; a seção detalhada de orientação vem da wiki e dos templates, sem alegar observação em DOS. Extrações de consulta ficam ignoradas em tmp/rihad-guidance.

Associação reconfirmada antes desta revisão: **#0259** reúne recusas por desconhecimento; **#0260** substitui `%di` em uma direção geral; **#0261** pede o mapa e marca a localização exata, no contexto de proximidade confirmado por **Town Guide / Where Is...**. O dado textual não fornece um limiar numérico de proximidade. As frases atuais condensam/traduzem #0259/#0260; “É logo aqui; vou indicar a entrada.” adapta #0261. O projeto usa o marcador existente, **não uma inscrição no automapa**. Sem alegar observação no DOS ou fórmula idêntica à do original.

## Respostas e conhecimento — revisão25/11/2026

O responsável confirmou que a indicação funciona, mas considerou os diálogos longos. “Onde fica…?” agora responde apenas:

|Situação|Resposta|Indicação precisa|
|---|---|---|
|Conhecido/distante|Fica a {direction} daqui.|Não; perguntar novamente a outro morador durante o percurso|
|Conhecido/próximo|É logo aqui; vou indicar a entrada.|Marcador da entrada acessível|
|Desconhecido|Não sei onde fica. Desculpe.|Não|

Não acrescenta ruas, curvas, etapas, placas ou instruções de interface a essas respostas. Serviço fechado aparece no nome da opção e na identificação do marcador. Os blocos comuns `route`, `entrance`, `closed` e `outskirts`, e os complementos de placas/ruas, foram retirados dos dados de orientação; versões anteriores permanecem no histórico Git. Instruções específicas **Como seguir meu caminho?** do informante, visão de Ria, audiência/entrega de Blubamka e demais textos não foram reescritos.

Regras determinísticas, configuradas em `knowledge` nos dados:

- Todos os NPCs conhecem Pousada, Corte, Portão e acesso aos Arredores; dentro da pousada conhecem quarto/cama e saída. Não exige sorteios ou tentativas repetidas para obter informação indispensável.
- Informante, responsável da pousada e guardas conhecem os serviços locais cadastrados na sua localização. Demais moradores conhecem o estabelecimento alcançável mais próximo de cada tipo somente até **36tiles pelo caminho**.
- Conhecido é próximo até **12tiles pelo caminho acessível**, da posição **atual do NPC** à entrada. Ambos os limiares são adaptações configuráveis do projeto, não números atribuídos ao Arena original. Entre os destinos de um tipo, continua sendo escolhida a entrada alcançável mais próxima pela rua. Sem rota, não fornece direção nem marcação.
- Não lista Stonekeep/Fang Lair em Onde fica…? nem descobre destinos de quest. Conhecimento local não executa o efeito exclusivo20→30 do informante ou os recibos de Blubamka.

## Coordenadas, marcador e saves

Rumo geral em oito setores de45°: posição atual de quem responde → entrada acessível. X+ é leste e Y+ é sul no runtime. A reconstrução usa `MV x=2+3*(127-originalX)+1`, `MV y=2+3*originalY+1`; não reutilizar o sinal do X original. O setor dominante evita chamar um destino quase ao sul de sudeste por poucos tiles de diferença. A proximidade usa busca pelo caminho, respeitando as flags dos dois lados de cada passo; uma muralha pode tornar distante um ponto visualmente próximo. Pessoas móveis não alteram a topologia da rua.

Só a resposta próxima concede o marcador preciso já existente. Ele continua usando a próxima passagem acessível até a entrada, em vez de apontar através de paredes. Uma vez recebido, pode ser retomado por save/load, assim como a informação precisa adquirida; uma nova resposta distante ou desconhecida encerra a indicação anterior para não funcionar como GPS remoto. **Cancelar sem escolher** preserva a indicação já recebida; **Encerrar indicação** continua disponível no submenu/menu. Entrar em outro mapa encerra o alvo exterior. A resposta distante não deixa aparecer por baixo o piloto automático de Audiência.

Registro interno `arenaRihadGuidance`v2, com migração pelo MVStateStore: v1 não comprova que houve orientação próxima, portanto somente a indicação antiga é encerrada uma vez; personagens, recursos, quests, inventário e recibos são preservados. Partidas novas não precisam migrar. Uma indicação próxima recebida em v2 persiste normalmente. **Namespace web permanece arena:m01:save-v1**, sem apagar dados pessoais. Não há recarga de recursos, viagem automática ou efeito de quest por orientação.

Escolhas, retratos, paginação, retorno aos assuntos e proteção de soltura/nova pressão existentes são reutilizados. [Verificações/capturas atuais](../evidencias/rihad-short-directions-v03/resultado.json): frase única próxima/distante/desconhecida, NPC após caminhada real, oito rumos, desvio real por parede, conhecimento sem sorteio, cancelamento, migração e salvar/carregar em perfil isolado. Evidências anteriores de circulação/encaixes e de Blubamka permanecem válidas; não repetir todo o percurso por esta mudança textual.

Roteiro atual: perto do portão, perguntar ao informante **Onde fica…? → Pousada do portão**: direção geral, sem seta precisa. Seguir as placas já existentes até perto da pousada e perguntar à **artesã junto à fachada** pelo mesmo destino: frase curta e entrada indicada. Salvar/carregar e conferir a indicação; depois encerrá-la. Perguntar à artesã por **Templo · Fechado** demonstra desconhecimento determinístico nesta posição. As instruções de quest permanecem no assunto específico do informante.

## Encaixes existentes

Histórico visual V01, preservado sem nova alteração nesta revisão de respostas.

Sem geração ou alteração de masters/exportações. A montagem anterior tratava os2×2tiles do frame lateral como sua área final e punha a faixa inferior sobre o piso; também deslocava o centro24px para oeste. `arenaLateralFittings` nos mapas gerados separa posição lógica de extensão visual: duas peças do atlas ficam centradas no vão, com suas bordas opacas junto aos lábios de parede, deixando a faixa transitável48px livre. Entradas exteriores alinham a folha à borda acessível da parede (±6px). Sprites decorativos ficam abaixo do personagem e não possuem colisão. Os dez frames internos são estáticos, não novas portas animadas; animações e âncoras das portas funcionais permanecem intactas.

[Comparações e verificações](../evidencias/rihad-orientation-fittings-v02/resultado.json). Relato recebido: funcionamento geral satisfatório, com encaixes inadequados sobretudo E/W. O defeito é tratado nesta entrega; não atribuir ao relato aprovação visual destes ajustes ou testes específicos de persistência.

|Caso|Antes|Depois|
|---|---|---|
|Passagem da pousada|[V01](../evidencias/rihad-orientation-fittings-v02/antes-pousada-passagem.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-pousada-passagem.png)|
|Passagem da corte|[V01](../evidencias/rihad-orientation-fittings-v02/antes-corte-passagem.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-corte-passagem.png)|
|Fachada da pousada|[V01](../evidencias/rihad-orientation-fittings-v02/antes-pousada-externa.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-pousada-externa.png)|
|Entrada leste|[V01](../evidencias/rihad-orientation-fittings-v02/antes-leste.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-leste.png)|
|Entrada oeste|[V01](../evidencias/rihad-orientation-fittings-v02/antes-oeste.png)|[V02](../evidencias/rihad-orientation-fittings-v02/depois-oeste.png)|

Histórico V01: implementação53010fc, promovida funcionalmente em main3234adc; [prévia pública conferida](../PAGES_INFRA.md#prévia-de-encaixes-e-onde-fica--25112026). Evidências anteriores de aceite/entrega única de Blubamka em npc-dialogues-v01 reutilizadas, pois seus eventos/handlers não foram alterados. A conferência nova cobre cancelamento sem efeito do informante, circulação/entrada/saída, estado e apresentação; não é nova aprovação manual da campanha ou da arte.

Revisão breve a7a6255, promovida funcionalmente em main64f727b; [prévia publicada e conferida](../PAGES_INFRA.md#prévia-de-orientação-breve--25112026). Avaliação manual da concisão/proximidade pendente, sem release.
