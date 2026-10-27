# M01-14 R03 — correção de encaixes ortogonais

27/10/2026. Feature **feature/m01-dungeon-inicial**, base1f3b29f. Direção gráfica e estrutura seguem aprovadas; **encaixes, portas e colisões não estavam aprovados**. Esta rodada corrige esses pontos para avaliação, sem merge, nova feature, isometria ou alteração de regras de loot/recursos. Diretiva vigente: **DIRETIVA_DE_MAPAS.md**. Relatos R01/R02 abaixo dessa atualização são históricos quando divergirem.

## Diagnóstico realizado antes das correções

Os cinco prints `doc/prints/m01-14-revisao-2026-10-27-*` foram abertos visualmente como **evidência de defeitos**, não como modelos de geração. Correspondência das áreas de revisão:01 porta norte/sul e parede sobre personagem;02 porta lateral próxima da água;03 plataformas;04 canal e decoração no vazio;05 cela/tesouro e decoração lateral.

| Causa confirmada na origem | Efeito observado | Correção |
|---|---|---|
| Atlas R02 contém alvenaria e bordas oblíquas junto das portas/correntes | Parede duplicada, aparência isométrica num mapa ortogonal | Componentes IA sem alvenaria; frente/verso e borda superior lateral independentes |
| Quadros IA redesenham moldura/folha; canvas/evento constante não fixa detalhes internos | Moldura e dobradiças mudam entre estados | Um componente por direção antes de animar; montagem técnica com pivôs invariantes e pixels de dobradiça comuns |
| Cap com flag acima do personagem foi aplicado sobre células caminháveis do vão | Personagem ocultado sob faixa de teto no print01 | Removido **somente cap artificial sobre vão**; teto real nas células sólidas vizinhas preservado |
| Decoração aceita qualquer célula `#`, mesmo sem face visível | Correntes e blocos aparecem no vazio preto | Solver exige face frontal realmente desenhada, área aberta abaixo, suporte completo e atribuição sem sobreposição |
| Painel de plataforma inclui parede e piso de fundo | Descanso cria parede falsa | Laje independente RGBA em camada inferior ao jogador, piso aprovado preservado sob ela |
| Pilha larga é limitada pela largura do canvas e tem pouca altura opaca | Tesouro menor do que sugere arquivo48×48 | Nova composição compacta conforme arena_loot, sem esticar; alfa visível44×34/33/30 e margem2px |

Não foram corrigidas ocorrências com uma coleção de offsets individuais. Compilador e empacotador usam contratos por categoria. As coordenadas lógicas originais permanecem na origem; adaptações visuais de decoração são explícitas no JSON.

## Portas e projeção

Tiles48px. O vão é a mesma célula D original3×3, com os mesmos3 colliders na seção transversal e os primeiros126 IDs nativos preservados. As paredes do mapa fazem a moldura: **nenhum novo bloco de pedra/piso nos sprites**. Arquivo de porta432×576, células144×144 constantes. A face frontal ocupa somente as duas fileiras inferiores96px; a superior é transparente, não um teto dentro da folha. O evento mantém a âncora `(centroX,centroY+1)` durante todo o ciclo.

Norte/sul: texturas de frente/verso, janela de recorte fixa aplicada **antes** dos quadros. A projeção da folha em torno da dobradiça reduz sua largura aparente; altura/posição da dobradiça constantes. Leste/oeste: componentes realmente superiores, espessura8px, comprimento136px; giram no plano da grade. Esse comprimento representa profundidade do vão3tiles, **não uma face de parede3tiles de altura**. É a exceção de representação necessária à vista lateral ortogonal, conforme a diretiva. Não girar a imagem frontal nem inclinar as paredes para acomodar o asset.

Três fases em30 atualizações; fechado/intermediário/aberto usam a mesma origem, canvas e apoio. Pinos são reaplicados como pixels RGBA idênticos, sem misturar cores de quadros diferentes por alpha composto. Collider fechado permanece até acabar a abertura; fechamento aceito bloqueia no início. Fechamento recusado no envelope ocupado. Vista conforme eixo/lado de acesso; a troca de textura frente/verso não muda pivô/moldura. O acabamento e as projeções das folhas continuam sujeitos à avaliação estética.

## Plataformas e decoração

As41 células de plataforma originais `^` recebem a mesma laje baixa independente144×144, sem parede traseira, aplicada na camada1 sobre piso normal. Todas continuam transitáveis, com o personagem desenhado acima. O teste também montou a laje temporariamente no centro de uma sala válida e restaurou os9 tiles em memória; isso não adicionou plataforma ao layout original nem criou regra nova de cama/recuperação.

Há16 marcadores de correntes na origem. R02 desenhava apenas11: os demais eram ignorados sem parede imediatamente adjacente. R03 representa todos16 em **faces frontais válidas**. A decoração de parede agora contém somente correntes/placas/anéis, sem bloco mural. Não se usam versões oblíquas ou versos flutuantes. Suporte96×96 limitado à face desenhada e evento through, sem colisão adicional.

O solver escolhe, por distância Manhattan e desempate estável, uma célula sólida com face sul visível e atribuição única, até6 células da referência lógica. `ArenaDungeon.json.attachments` registra `sourceCell`, `wallCell`, posição, categoria wall-only e distância. Distâncias efetivas1–5 células originais; maior adaptação: fonte(27,9)→face(26,5),5 células/15tiles de distância Manhattan. É uma adaptação de **decoração**, não movimento de porta/chave/tesouro/caminho ou evidência de que a corrente original estava nessa outra parede. Deve ser avaliada pelo responsável; não foi ocultada nem promovida a confirmação do original. A busca falha explicitamente se não encontra suporte válido.

Tesouros conservam saco, tecido vermelho, moedas e peças da referência Arena. Master novo gera silhuetas compactas; escala proporcional, sem piso ou brilho de raridade. Estados permanecem **prévia técnica sem recompensa** do M01-14; a concessão por fontes é do backlog de integração. Nenhuma regra de loot foi alterada.

## Geração e rastreabilidade

Pipeline vigente: `tools/build-dungeon-r03-assets.py` → `tools/build-dungeon-map.py`. Masters e derivados R01/R02 preservados. Prompts completos, imagens realmente fornecidas, dimensões e limites em `arte/DUNGEON_M01_14_R03_PROMPTS.json` e `..._MANIFEST.json`. Prints de defeitos foram inspecionados, mas **não fornecidos como referência positiva à ferramenta**. O atlas complementar aprovado v01 orientou apenas materiais/estilo; arena_loot e pile R02 orientaram identidade do tesouro.

Compilador ainda autoral estático, sem geração procedural em runtime. Não alterar Map008 isoladamente sem levar mudanças válidas à origem antes de recompilar. Plantas, água A1, estilos antigos e parâmetros de recursos permanecem preservados. Atualizações de configuração/migração são revisão3; saves R01/R02 reconstruem eventos antes da cena, sem reinicializar personagem, inventário ou recursos. Self-switches de portas continuam com os mesmos IDs; prévias gráficas são reinicializadas ao migrar, sem serem recompensas reais.

## Validação e limitações

Resultados em `evidencias/m01-14/r03/resultado.json`: conjunto pequeno primeiro, depois **28 travessias nativas das14 portas**, dos dois lados, bloqueio fechado, passagem aberta, fechamento/ocupação e âncora do sprite/evento. Plataforma isolada e original junto da parede, regiões/cantos da água, salvamento na água com porta aberta persistida, clique para reentrar e migração de save R02. Cenários em contexto descartável Chrome, slots16/17, sem saves pessoais. Não tratar locate de preparação/capturas como prova de caminhada; as28 travessias usam movimento nativo, sem through.

`validate-dungeon-r03.cjs` (também chamado por validate-dungeon.cjs) verifica motor/regras/mapas1–7/plugins.js preservados, planta/células bloqueadas idênticas, suporte de todos16 objetos,15 tesouros em piso válido,41 plataformas e inexistência de cap sobre piso. `audit-dungeon-r03.py`: pixels de dobradiças constantes em três fases/quatro direções, centros abertos transparentes, escala opaca dos tesouros e hashes. Isso complementa a inspeção visual das ocorrências reais, não a substitui. Há16 capturas nativas adicionais de decoração em objetos/, reunidas em dezesseis-objetos.png, com preparação por locate apenas para enquadramento. Reexecutados os dois geradores, os8 outputs de dados/imagens comparados por SHA256 ficaram byte a byte idênticos. Vídeo nativo816×624 de aproximadamente6segundos em portas-percurso.webm, com duas orientações, abertura, fechamento e travessia; não é animação ilustrada/reconstruída. Regressão da exploração existente em `r03/regressao` passou nos6cenários e cobre rota à chave/Gate,9045tiles conectados,14 portas e save/load. Não se repetiu todo o catálogo de testes de combate/balanceamento, pois suas regras não mudaram.

Editor: janela MV Arena foi localizada; duas capturas falharam com `window capture timed out: timed out waiting on channel`, renovando a seleção entre tentativas. Nenhuma ação de editar/salvar/reabrir foi confirmada. Não fechar ou descartar o trabalho do responsável. Formato canônico de plugins.js e arquivos internos do motor preservados; isso **não comprova autoria no editor**. Galaxy A56 físico não testado. **M01-14 segue em validação**, pendente de inspeção no editor e avaliação dos novos encaixes. Aprovação anterior cobre direção gráfica/planta, não estes defeitos.

## Conferência manual

Abrir Game.rpgproject, selecionar Map008/Tileset4 no MV1.6.1, verificar camadas/eventos e salvar/reabrir. No título usar **Explorar dungeon**; mover por setas/clique e interagir com Enter. Nas duas direções de cada eixo, observar folha/moldura, passar, fechar do outro lado e tentar fechar com vão ocupado. Nos pontos dos prints, conferir figura inteira junto da parede, ausência de blocos/objetos no vazio, lajes sem parede e tesouros legíveis. Nas águas, tocar margens/cantos, sair e salvar/carregar. As capturas comparáveis mantêm as áreas/elementos; não se afirma enquadramento de janela ou posição de câmera pixel a pixel idênticos aos prints.
