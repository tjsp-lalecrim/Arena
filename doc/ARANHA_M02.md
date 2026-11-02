# Stonekeep — aranha V01, combate e patrulha RAM

Base569e382; feature `feature/m02-aranha-piloto`. O responsável **aprovou explicitamente combate e patrulha do Minotauro** dessa base. Assets preservados, nomenclatura corrigida mantida; sem aprovação de balanceamento, recompensas ou distribuição por inferência.

## Identidade e referências delimitadas

STKEEP1.INF: **flat59, SPIDER.DFA, ITEM40**. Leitura das tabelas do ACD.EXE instalado: creatureID=ITEM−31=9, índice8 → **Spider / spider@.cfa**, escala320. [Offsets, hashes e vinte coordenadas MIF0-based](arte/spider-v01/sources.json). Mesmo leitor de descompactação/índices do Minotauro, executável tratado somente como dados; arquivos originais não foram alterados nem executados. Correspondência declarada confirmada, sem nova observação DOS.

Decodificados somente SPIDER1–6.CFA do GLOBAL.BSA com PAL.COL, reutilizando RLE/MSB/lookup existentes; referências extraídas em `tmp/spider-review` ignorado. Confirmam abdômen oval castanho-avermelhado com áreas claras/cinzentas, cefalotórax menor e pernas longas angulares com pontas escuras. Projeção ortogonal/lateral, detalhe da quitina e iluminação figurativa dark fantasy são adaptações; não se usou aranha de outro jogo. A escala320 é parâmetro do original, não medida física diretamente convertida em tiles.

Wiki local **Arena_Monsters…pdf**, páginas19–20: aranha gigante, rápida, ataque paralisante; Vida40–70/dano4–20, EXP=Vida×20+500, ouro16%/6–60. Página2: AGI75/SPD80 e discrepância STR25/65 explicada pela conversão dos dados. Essas referências não autorizam fórmulas novas ou cópia direta dos atributos. **Paralisia/veneno ficam registrados para avaliação posterior; sem teias, veneno, paralisia ou outra mecânica adicionada.** Não foi confirmada nesta entrega a correspondência com a aranha de Fang Lair; nenhum reuso foi habilitado ali.

## Arte e exportação

Um único exemplar, image_gen integrado; mestres em `art/masters/stonekeep-spider-v01/` e `art/masters/stonekeep-spider-walk-v01/`, separados das exportações. [Prompt de combate](arte/spider-v01/prompt.json), [correções anatômicas](arte/spider-v01/corrections.json), [prompt de caminhada](arte/spider-walk-v01/prompt.json). O primeiro mestre lateral fundia pernas do lado oposto; foi rejeitado para o runtime. V01/V02 foram rejeitados por essa anatomia; V03 corrigiu a vista para três-quartos lateral elevada e oito pernas, mas ainda continha névoa de fundo semitransparente. **V04-alpha é o mestre selecionado**, recorte transparente solicitado à ferramenta, mantendo o exemplar; os anteriores não são consumidos pelo jogo. Revisões são correções do mesmo exemplar, não variantes aprovadas. A elevação da câmera de combate é interpretação para tornar os quatro pares legíveis, distinta da vista ortogonal do mapa.

Combate: espera, ataque de mordida física, dano e derrota, **quatro desenhos por ação**, células224×160, apoio152; impacto no terceiro quadro. Sem aplicar veneno. `img/enemies/Arena_Combat_spider_v01.png`,896×640; [perfil](arte/spider-v01/profile.json), [recortes/apoios/hashes](arte/spider-v01/exports.json). Densidade única para todos os quadros; sem escalar cada pose separadamente.

Caminhada:12poses próprias sul/oeste/leste/norte, três fases por direção, oito pernas com articulação alternada. `img/characters/$Arena_spider_walk_v01.png`,288×384/células96px; envergadura visual até76px, sem espelhamento ou translação de pose estática. [Exportação](arte/spider-walk-v01/exports.json). Âncora na região de inserção das pernas, derivada do núcleo opaco do corpo e deslocamento direcional autoral50px na fonte; ponto final48,50 na célula. Compensação **groundByDirection72/nominal94**, hook já existente, posiciona a âncora24px acima de screenY (centro do piso). Pernas ocupam área visual maior que a colisão de uma célula; não se tornaram tiles adicionais bloqueados. Margens/alpha preservadas; só ruído alfa≤16 é descartado na exportação, sem pintar ou reconstruir anatomia.

Reconstrução: `python tools/export-stonekeep-spider.py`, `python tools/export-stonekeep-spider-walk.py`, `node tools/build-stonekeep-spider.cjs`; chamado também pelo gerador pai. Não regenerar arte aprovada de outras espécies.

## Parâmetros provisórios e acesso

Enemy9/Troop10: **Vida65/Mana0, ATQ12/DEF4/MAT0/MDF4/AGI16/SOR5, acerto90%**, somente Atacar/skill1. Vida dentro da faixa original; ATQ/defesas e iniciativa são adaptações provisórias aos parâmetros atuais, não balanceamento aprovado. AGI16 representa a rapidez documentada sem criar atributo de velocidade ou outra regra. Fórmula geral e custos do jogador intactos.

**Laboratório:0EXP/tabela vazia**, recibo técnico único; `campaign.enabled=false`, EXP/loot de campanha não configurados. Não transferir os zeros ao conteúdo futuro nem habilitar novas recompensas. Os vinte encontros originais não foram distribuídos. Map012/campanha, Map015 integral, Fang Lair, loot/descanso e saves pessoais preservados.

Acesso **http://127.0.0.1:8774/** → **Testes / Debug**:

1. **Combate → Stonekeep · aranha (RAM)**: repetir espera, Atacar/Defender/técnica, dano e derrota.
2. **Campanha e mapas → Stonekeep · aranha — patrulha (RAM)**: um exemplar na sala técnica Map016, chegada4,9/inimigo9,6. Observar quatro direções e encostar para uma única batalha. Coordenada de inspeção, não posição original.
3. **Guardar teste em RAM / Carregar teste da RAM** preservam a sessão; slots normais bloqueados. Sair ao título e reentrar reinicia o exemplar, sem tocar nos saves pessoais.

## Verificação focal e estado

Chrome156.0.8078.76/perfil descartável/origem canônica/canvas816×624. **5grupos de combate e8de patrulha/isolamento**, testes `tools/test-stonekeep-spider-battle.cjs` e `tools/test-stonekeep-spider-walk.cjs`: abertura limpa/hub; quadros/movimentos e impacto; dano/custos únicos (técnica12VG, magia6Mana); vitória/recibo técnico único/retorno e derrota/game over em fixture1HP. Quatro direções/padrões0/1/2, patrulha natural, pilar/água/raio3, alinhamento da âncora e contato por teclado sem duplicação. Vitória controlada após um ataque na inspeção verifica remoção individual; guardar/carregar RAM preserva recursos, quest, pontos, recibo e derrota. Reentrada dos exemplares aprovados de orc, homem-lagarto e Minotauro comprova delegação sem vazamento. Armazenamento normal vazio/perfil isolado; sem erros JS/recursos faltantes.

Comparação à base protege bancos/IDs anteriores, mapas, quest, itens/recuperação, perfil/mestres/PNGs aprovados do Minotauro e demais espécies. Reconstrução pai idempotente. `tools/test-stonekeep-spider-identity.cjs` protege vinte posições e inventário de cobertura inalterado. Dimensões/hashes não substituem inspeção anatômica nem aprovação do responsável.

[Evidências do combate](evidencias/m02-spider-v01/battle/resultado.json), [patrulha/isolamento](evidencias/m02-spider-v01/walk/resultado.json), [atlas combate](evidencias/m02-spider-v01/atlas-combate.png), [atlas caminhada](evidencias/m02-spider-v01/atlas-caminhada.png). Vídeos canvas30fps em velocidade normal: [batalha](evidencias/m02-spider-v01/battle/combate-normal.webm), [patrulha/contato](evidencias/m02-spider-v01/walk/caminhada-contato-normal.webm). Batalha≈22s e patrulha/contato≈16s. Decodificados156/38quadros para inspeção local; os arquivos entregues permanecem em velocidade normal. Atlases e quadros da gravação inspecionados: identidade entre usos, quatro pares de pernas, articulação, oclusão coerente na vista três-quartos/derrota, apoio, escala e ausência de cortes/fundo incorporado. Essa revisão técnica/artística não é aprovação do responsável.

**Avaliação artística/funcional pendente.** Sem percurso completo, novo teste editor/mobile ou aprovação de balanceamento. Matriz:49/180encontros e32/70portas; as nove espécies possuem combate/caminhada disponíveis, aranha ainda pendente de avaliação. Nenhuma espécie/conjunto inteiramente ausente; isso não conclui o mapa nem aprova todos os legados. Após feedback, retornar ao bloco de encontros/portas B2 com seis orcs e três homens-lagarto, antes de loot/descanso. Não iniciar outra produção artística automaticamente.
