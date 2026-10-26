# Fidelidade e inventário prévio à criação — R05

25/10/2026. Trabalho em `feature/m01-amostra-visual`, a partir de `1024422`. Árvore inicialmente limpa; main/develop preservados. Não foi aberta feature de criação enquanto M01-06 continua em validação.

## Evidência original e prioridade

Consulta somente leitura à instalação original. `ARENA/README.TXT` identifica **Version1.07 CD-ROM**; não confundir a versão do jogo com a do editor MV. O jogo de1994 roda por emulação DOS neste ambiente. A baixa definição não autoriza substituir formas, materiais, cores, arquitetura ou função narrativa por fantasia genérica.

`Docs/Manual.pdf`, página7 do arquivo, seção The Races, foi consultado diretamente. O texto do manual é evidência do material original, **não teste do comportamento do executável**. Também consultados Player Guide.pdf e os PDFs locais `Arena_Races`/`Arena_Character Creation` em doc/wiki para interpretação/organização. O guia original repete descrições raciais, mas sua paginação e composição diferem. Não foram transcritas ou importadas as profissões/restrições que aparecem na mesma página do manual.

| Raça do catálogo | Evidência do manual original | Adaptação já presente no catálogo, ainda não aplicada por criação |
| --- | --- | --- |
| Argoniano | Natureza reptiliana; maior resistência/velocidade na água | Vigor máximo×1,10; substitui natação, não bônus original de Vigor |
| Bretão | Alto, cabelo escuro; metade do dano mágico e anulação em saving throw bem-sucedido | Dano mágico×0,5, sem saving throw adicional |
| Elfo negro | Pele escura, olhos vermelhos; bônus nível/4 em armas | floor(nível/4) dano/acerto, conversão de acerto para pontos percentuais |
| Alto elfo | Alto, pele dourada, olhos amendoados; imunidade a paralisia | Imunidade ao estado3 do banco |
| Khajiit | Traços felinos e pintura facial, agilidade na escalada | AGI×1,05; substitui escalada, não bônus percentual original |
| Nórdico | Alto, pele clara; metade do dano de frio e anulação em saving throw bem-sucedido | Frio×0,5, sem saving throw adicional |
| Redguard | Robusto, forte e rápido; nível/3 em armas corpo a corpo | floor(nível/3) dano/acerto corpo a corpo |
| Elfo da floresta | Povo das florestas; nível/3 com arcos | floor(nível/3) dano/acerto com arcos; arco ainda não cadastrado |

As quantidades10%/5%, arredondamento e conversão do acerto são adaptações já documentadas em ArenaCatalog.json/DADOS_M01.md, não números transcritos do manual. Nenhum bônus por gênero. Nenhuma classe profissional ou restrição de equipamentos. Sem aplicação mecânica nesta rodada.

**Contextos e divergências:** as descrições Khajiit do manual não justificam importar automaticamente o humanoide felino dos jogos mais recentes. Alto elfo aparece como Summurset no texto do manual, enquanto o catálogo usa Summurset Isle; preservar a identificação da fonte, não corrigir silenciosamente a transcrição. Não foi medida a fórmula real no executável DOS; falas/manuais e execução devem continuar distinguidos caso surja divergência. Detalhes visuais ilegíveis devem ser marcados como interpretação artística. Nenhuma nova associação de textura/mapa foi presumida.

Consultados explicitamente os arquivos listados em doc/prints e o relatório de imagens originais decodificadas `REVISAO_IDENTIDADE_R02.md`; não foram pedidos novos prints nem gerados assets. Masters aprovados R02/R03 permanecem com mesmos hashes. Narrativa sem protagonista continua obrigatória. Objetos, composição e contexto serão revistos junto dos diálogos; sem regeneração por conveniência.

Textos extraídos para consulta em `tmp/original-review/manual-consulta.txt` e `wiki-criacao.txt`, ignorados. Nenhuma fonte original entrou em img/ ou no Git. GLOBAL.BSA mantém SHA256 `345385c1565d9ca73e2d59d71a422498135485e2d01d4df66355ed804209042d`. Nenhum mod instalado, nenhum arquivo original modificado.

## Inventário antes de produzir combinações

Inventário completo em `INVENTARIO_PERSONAGENS_M01.json`: oito raças do catálogo×duas opções históricas de gênero=16 combinações a cobrir. É contagem de cobertura necessária, não UI implementada ou biblioteca aprovada. Para cada combinação serão necessários identidade-base estável, exploração coerente e combatente correspondente; retratos acompanham quando usados pela interface.

| Raça | Masculino | Feminino |
| --- | --- | --- |
| Argoniano | ausente | ausente |
| Bretão | ausente | piloto provisória de exploração, retrato e pose lateral |
| Elfo negro | ausente | ausente |
| Alto elfo | ausente | ausente |
| Khajiit | ausente | ausente |
| Nórdico | ausente | ausente |
| Redguard | ausente | ausente |
| Elfo da floresta | ausente | ausente |

Piloto: `$Arena_Breton_Pilot.png`144×256/célula48×64, `arena_breta_lateral_v01.png`96×96 e retrato144×144. **Uma combinação piloto; zero conjuntos finais completos.** A pose lateral não é uma folha svActors9×6. Nenhum caminho piloto foi associado artificialmente a outras raças/gêneros. IDs visuais no inventário são reservas de continuidade, não contratos runtime ativos.

Não há como testar criação neste estado: **M01-07 não foi implementado**, nenhuma UI ou aplicação racial adicionada e início normal continua no laboratório. A feature própria de criação deverá nascer de develop após fechamento/revisão da dependência M01-06; não foi feito merge antecipado para contornar o gate pedido pelo responsável.

## Progresso técnico desta rodada

`Arena_ArtPreview`0.2.1: somente na galeria atual e no ramo mobile nativo do MV, legendas primárias26px (antes17), cabeçalho28 e etiquetas24; frases encurtadas para caber, mantendo arte em mesma escala e assets intactos. Galeria histórica e desktop mantêm apresentação anterior. Em916×412, texto primário agora equivale a17,17px CSS, antes11,22. Não é UI final da campanha nem prova de legibilidade em hardware real.

Teste `test-art-viewport.cjs`: simulação desktop Android genérica, fonte primária≥16px CSS, canvas dentro do viewport, toque emulado na placa Ria com caminho nativo e abertura da imagem, zero arquivos ausentes. Screenshot R05 inspecionada; sem sobreposição. Não é Galaxy A56. Sem benchmark/desempenho ou fullscreen físico.

Autoria real via controle do Windows: leitura por acessibilidade funciona sem captura; gerenciador aberto por F10, diálogo com Lista/Ok/Cancelar/Aplicar observado, confirmado por Enter. Ctrl+S regravou arquivos nativos. Editor fechado por Alt+F4 e reaberto pelo executável instalado; janela Arena reapareceu sem modal de erro. `m01-06-r05-editor-roundtrip.json` registra método/limites, hashes e comparação semântica. Tabelas de banco preservadas, exceto `System.versionId`, `System.editMapId` e scroll do mapa1 (metadados do editor). Nomes/ordem/status/parâmetros de plugins preservados; descrição própria atualizada0.2.1 posteriormente.

Limites: linhas de plugins são custom na árvore de acessibilidade e seus nomes não foram visualmente conferidos. Clique retornou `coordinate input geometry is unavailable`; captura de imagem do editor não está disponível nesta sessão. Não foi declarado playtest visual pela mera presença de janela de jogo, nem usada a partida pessoal já aberta pelo responsável. Conferência visual dos recortes/sequência no editor permanece pendente. M01-03 tem avanço parcial real de salvar/reabrir, não comprovação visual completa.

M01-06 continua em validação técnica. Animação de combate completa pertence a M01-10; arquitetura final à M01-14; criação e demais combinações a M01-07. Não ampliar artificialmente M01-06 para biblioteca inteira, mas também não usar a aprovação de direção como aprovação técnica dos exemplos ainda pendentes no editor/aparelho. Sem conclusão automática ou integração em develop.

Resultados finais: `test-art-viewport`, `test-art-integration`, `test-art-preview`, `test-persistence`(27), `test-boot`, `validate-data` e auditoria de arte passaram. O teste de toque usa pressão80ms: o par down/up instantâneo de touchscreen.tap não era amostrado pelo update nativo do MV. Não foi alterado o motor para mascarar isso. Boot excedeu10s em uma execução e passou no rerun isolado, sem mudanças para esconder a falha. Os testes continuam identificando o navegador como Chrome156.0.8078.47. A tentativa final de captura visual do editor retornou `window capture timed out: timed out waiting on channel`, inclusive após recuperação.
