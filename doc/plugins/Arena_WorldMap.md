# Arena_WorldMap 0.1.0 — mapa mundial e viagem

Entrega de campanha M02, runtime MV 1.6.1, navegador desktop/Chrome. Sem plugin externo ou mudança no motor. `Arena_WorldMap.js` carrega por último, após MV_StateStore, MV_JournalModel, Arena_Narrative/Continuation, Rihad/Court, StonekeepWhole e FangCells. Não requer habilitar debug.

## Uso e regras vigentes

- Menu → **Mapa mundial**, ou **M** durante exploração. Setas selecionam; Enter abre província/seleciona local; mouse permite clicar no mapa ou lista. Esc retorna um nível, depois ao jogo/menu de origem. A exploração fica pausada enquanto a cena está aberta.
- Tamriel apresenta nove províncias; cada uma abre sua vista regional. Outras províncias informam que ainda não há locais implementados. Somente os locais conhecidos de Hammerfell aparecem: Rihad após chegada, Stonekeep após aceitação do pedido, Fang Lair após entrega com recibo válido. Não usar uma lista de destinos futuros como spoiler.
- Viagem permitida em Rihad exterior/Arredores. Na pousada, corte e dungeons, consulta permitida; sair pelo evento normal antes de viajar. Não criamos um exterior novo nas entradas das dungeons.
- Confirmação explícita, inicialmente em **Cancelar**; chegada em âncora acessível, distância dos gatilhos, limpeza do destino de clique e trava até soltura dos controles. Executar novamente durante transferência é recusado.
- Portão, ofertas antigas de Stonekeep/Fang e mapa usam o mesmo serviço de disponibilidade/transferência. O portão mantém também o acesso aos Arredores. Saídas de dungeons continuam nos eventos existentes: sobretudo em Fang Lair, visão, combate e vitória de Tharn não podem ser contornados pelo mapa. Etapa100 impede viagem rápida mesmo com a visão lida.
- Sem alteração de Vida/Mana/Vigor, EXP, ouro, itens, atributos, quest, loot, recibos ou respawn. Sem cobrança, recuperação ou passagem adicional de tempo. Balanceamento provisório inalterado.

## Fontes e adaptação cartográfica

Fontes primárias consultadas na instalação: `Docs/Manual.pdf`, p.3, automapa/mapa continental (viajar de áreas externas; sair de interiores); `Docs/Player Guide.pdf`, p.63 do PDF/p.55 impressa (província → local → confirmação; identificação da localização atual e previsão de chegada); `Docs/Quick Reference Card.pdf`, p.3 (original M=automapa, Shift+M=continental). **Adaptação:** M abre diretamente este mapa mundial; não há automapa local novo. O calendário e a duração de viagem do original não são introduzidos: mantém-se a elipse instantânea já adotada pelo projeto.

`CITYDATA.65`: nove registros provinciais de1228bytes; cabeçalho28bytes e locais de25bytes. Todos os destinos iniciais estão no registro provincial1, **Hammerfell**:

| Local | ID local original | Coordenada no mapa provincial 320×200 | Âncora atual |
| --- | ---: | --- | --- |
| Rihad |4 |207,180 | `rihad.arrival`, Map009,345,6 |
| Stonekeep |33 |205,155 | `stonekeep.entry`, Map015,153,15 pelo seletor de campanha existente |
| Fang Lair |32 |280,42 | `fang.entry`, Map013,288,9 |

Não confundir essas coordenadas cartográficas com as células MIF das dungeons nem com tiles MV. `TAMRIEL.IMG` e os nove IMG regionais (`HAMERFEL`, `HIGHROCK`, `SKYRIM`, `MOROWIND`, `SUMERSET`, `VALNWOOD`, `ELSWEYR`, `BLAKMRSH`, `IMPERIAL`) foram consultados por extração local reutilizando o leitor de imagens já disponível. Extrações permanecem em `tmp/world-map`, ignoradas; nenhum executável, textura extraída ou manual entra no pacote.

**Método visual:** cartografia vetorial própria e simplificada, paleta mineral/terrosa, contornos e hachuras discretas. Não houve geração de uma pintura nova por IA. Limites de Tamriel digitizados da imagem original; silhuetas regionais derivadas de máscaras do terreno, removendo tipografia/ícones e pequenos componentes. Preserva a disposição geográfica de Arena; relevo, estradas e pequenos detalhes não são reproduzidos nesta apresentação esquemática. Os nomes originais, inclusive `Summurset Isle`/`Imperial Province`, permanecem. Não é evidência de nova navegação ou conteúdo dessas províncias. Aprovação visual pendente.

Mestre: `art/maps/arena-world-map-v01.json`, com fontes/checksums e geometria. Exportação: `node tools/build-world-map.cjs` → `data/ArenaWorldMap.json`. Rótulos, marcadores e hitboxes são desenhados separadamente em runtime; sem letras incorporadas ao fundo. Contenção proporcional320:200, sem deformação; lista lateral fornece nomes completos também em janela menor. Não houve alteração nos atlas ou mapas locais.

## Contrato técnico e persistência

Configuração: `ArenaWorldMap.json`, schema1; `provinces`, `places`, `geography`, `exteriorMaps`. Nenhum parâmetro no gerenciador de plugins. IDs dos locais independem do texto traduzido; âncoras são resolvidas pelas configurações já existentes. Configuração geográfica inválida gera diagnóstico de inicialização, sem fallback silencioso.

API: `ArenaWorldMap.open()`, `location()`, `known(id)`, `entries(province)`, `anchor(id)`, `reason(id)`, `travel(id)`, `fromGate(interpreter,id)`, `state()`. `travel` revalida descoberta, contexto, batalha, evento, transferência, destino atual e retaliação no instante da execução. O adaptador do portão valida evento/distância além da escolha original. Não usar API para mover laboratórios à campanha.

Estado `arenaWorldTravel` v1 pelo MV_StateStore: sequência e última transição `{id,from,destinationId,locationId,mapId,x,y,phase}`. Partidas antigas recebem estado vazio sem alterar os namespaces anteriores. Transferência nativa do MV preserva reserva no save; chegada marca `arrived` uma vez. Não há novo slot, reset ou migração dos saves pessoais. Namespace web permanece `arena:m01:save-v1`.

Hooks delimitados: novo comando no menu e handler, tecla77/M, update/start de Scene_Map e nova cena MenuBase/Window_Command. Não redefine os serviços de saída de Fang Lair nem suas batalhas. Ao desabilitar o plugin, retirar também seus três adaptadores de portão; eles são dependências explícitas, não extensões autônomas.

## Verificação e avaliação

`tools/test-world-map.cjs` e `tools/test-world-map-input.cjs`, Chrome isolado e fixtures sintéticas convertidas pelo mecanismo existente para sessão normal. Resultado/capturas em [evidências](../evidencias/mapa-mundial/resultado.json). Cobertura: navegação/consulta, sigilo, cancelamento, portão compartilhado, ida/volta das duas dungeons, bloqueios, persistência nativa inclusive reserva de transferência, recursos/quest/recibos preservados e janela menor. A regressão complementar cobre extensão de save antigo sem o namespace novo, Esc mantido sem retorno duplo e portão de laboratório ainda RAM/sem saves normais ([resultado](../evidencias/mapa-mundial/input-migration.json)). Nenhum save pessoal ou combate completo repetido.

Roteiro único no Chrome (`http://127.0.0.1:8774/`, servidor existente `tools/arena-local.cmd start`):

1. Retomar na cidade: menu **Mapa mundial** ou **M**. Abrir Hammerfell. Antes da missão, Stonekeep/Fang Lair não aparecem. Outra província deve mostrar indisponibilidade, com retorno por Esc.
2. Com pedido aceito, selecionar Stonekeep e confirmar. Na dungeon, consultar o mapa: deve pedir para sair. Retornar pelo acesso normal e conferir a chegada a Rihad. Cancelar uma viagem não move nem altera recursos.
3. Entregar o pergaminho: Fang Lair aparece em Hammerfell. Viajar, consultar o mapa na mina e retornar pela saída. Salvar/carregar em um desses locais deve preservar recursos, objetivos, encontros derrotados e coletas anteriores.
4. Com fragmento/etapa100, continuar pela entrada da mina: o mapa não substitui visão/retaliação. Depois da vitória, sair normalmente e usar o mapa na cidade.

Avaliação manual deste recurso pendente. Pages, release, lava e inventário de objetos incertos não são alterados por esta entrega.
