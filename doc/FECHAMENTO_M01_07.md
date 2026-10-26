# Fechamento M01-07 — R05,26/10/2026

**Concluído no escopo de criação-base desktop**, com ressalvas estéticas aceitas e balanceamento racial provisório. Não há impedimento funcional demonstrado pelos testes; recursos/evolução em combate, introdução/dungeon, biblioteca animada e Galaxy A56 continuam nos itens próprios. Esta rodada não implementa outro item.

## Decisão e versão exata

O responsável autorizou aplicar a proposta da rodada anterior e prosseguir com a arte atual, sem novas gerações/correções estéticas. Decisão estruturada em `decisoes/M01_07_APROVACAO_R05.json`. Proposta original: `AUDITORIA_BONUS_RACIAIS_M01_07.md`, R04 de26/10/2026, tabela P01–P08, commit **1dd9a6c**. Texto original completo preservado em `decisoes/PROPOSTA_RACIAL_R04_APROVADA.md`, com SHA256 do blob Git no registro. P08 usa a proposta preferida de precisão geral, como apresentada na entrega, não a alternativa de manter arco inativo.

| ID / raça | Valor aprovado e implementado | Efeito/limite |
| --- | --- | --- |
| P01 Argoniano | +10 pontos de Vigor máximo inicial;100→110 | Uma vez na criação; atual inicia cheio. Não reaplica em load ou nível nem multiplica evolução futura |
| P02 Bretão | Dano mágico positivo×0,75 | Redução25% após cálculo/arredondamento nativo, depois arredonda inteiro. HP/MP/dreno mágicos; não reduz cura ou efeitos de status |
| P03 Elfo negro | Dano de arma×1,05; acerto+0,02 | +5% na fórmula positiva e+2 pontos percentuais na ação válida; sem bônus por nível |
| P04 Alto elfo | Imune somente à Paralisia/estado3 | Não evita dano da mordida ou outros estados |
| P05 Khajiit | AGI+1 derivada via paramPlus(6) | Antes dos multiplicadores/buffs nativos; não grava raça em _paramPlus, não garante primeiro turno/ação extra, não altera movimento/HIT/EVA |
| P06 Nórdico | Dano de frio/elemento3×0,5 | Somente tipos de dano positivo; cura preservada. Mantém máximo nativo entre elementos de ataque |
| P07 Redguard | Dano de arma melee×1,08; acerto+0,03 | +8%/+3 p.p.; não punhos, distância ou magia; sem bônus por nível |
| P08 Elfo da floresta | Acerto+0,04 com qualquer arma válida | +4 p.p., sem dano extra e sem depender de arco; adaptação geral explicitamente autorizada |

Arma válida: efetivamente equipada, técnica compatível pelo teste nativo, habilidade física de tipo de dano positivo configurada (1/5/6/7/8), sem itens/curas/magias/punhos/híbridos não mapeados. Dano percentual aplica-se antes das etapas nativas de elemento/defesas/crítico/variância/guarda; arredondamento só ao final nativo. Acerto soma à probabilidade da ação até100%, com evasão separada. Não aumenta ATQ/HIT permanentes. Nenhuma raça bloqueia equipamentos ou cria profissão; nenhum bônus por gênero.

Banco, descrições da criação e plugins `MV_CharacterRules`/`Arena_CharacterCreation`0.2.0 sincronizados. Catálogo schemaVersion1, balanceVersion `M01-07/R05/P01-P08`; nomes/IDs visuais, grupos, equipamentos e registros de plugins preservados. Namespace salvo arenaCreation continua v1: não há campo novo persistente, apenas regras derivadas e concessão inicial existente. Saves anteriores usam o catálogo atual sem reaplicar recursos; valores gastos/máximos nativos/próprios permanecem preservados.

## Aprovação estética com ressalvas — sem retrabalho

`arte/APROVACAO_M01_07_COM_RESSALVAS_R05.json` identifica64 arquivos ativos das16 combinações e oito arquivos selecionados dos pilotos R04B por versão/dimensões/SHA256. `portraitFindings` lista os16 arquivos de face e caixas alpha. Nenhuma imagem foi gerada, editada, espelhada, recortada, reescalada ou reassociada nesta rodada.

Defeitos **existentes e adiados**, não corrigidos: VIS-M07-01, contornos/recortes de busto heterogêneos, alguns arredondados/orgânicos e outros truncados pela célula; VIS-M07-02, diferenças de orientação/grau de rotação; VIS-M07-03, margem do pé do combatente Khajiit no piloto R04B. Caminhos específicos e critérios futuros em `arte/PENDENCIAS_VISUAIS_M01_07.md`. Aprovação permite avançar, não transforma o conjunto em gabarito anatomicamente perfeito. Diretivas de pose, identidade, proporção e referências continuam obrigatórias para futuras gerações.

As16 combinações-base ativas continuam disponíveis; não substituir silenciosamente apenas dois masculinos por pilotos sem folhas completas. R04B é referência visual aprovada com ressalvas, ainda estudo técnico fora do catálogo.15 conjuntos direcionais permanecem estáticos; a bretã piloto mantém caminhada anterior;16 SV repetem pose. Animações completas e armaduras alternativas continuam M01-10/12.

## Critérios de aceitação e evidências

| Critério M01-07 | Resultado |
| --- | --- |
| Dependências04/05/06 | Banco mínimo, persistência e amostra desktop já validados; regressão preservada |
| Nome/raça/gênero em pt-BR | Oito raças, dois gêneros,16 escolhas livres, nome Unicode/NFC validado; confirmação/revisão/cancelamento; sem personagem piloto obrigatório |
| Assets predefinidos e referências existentes |16 bases, recortes nativos, transparência/arquivos existentes e identidade reconstruída; aprovação estética com ressalvas e hashes preservados |
| Bônus raciais e descrições | P01–P08 exatos, soma/percentual/grupo corretos, nenhuma concessão repetida, descrições verificadas no bitmap e cabendo nos700px da criação |
| Persistência/evolução |16 combinações em seis níveis; oito saves reais da composição1dd9a6c carregados; recursos gastos/máximos preservados, AGI sem duplicação, bônus sem incremento racial por nível |
| Equipamentos/profissões/gênero | Todos mantêm permissões nativas; técnicas por tipo iguais para todas as raças, sem classes profissionais/bônus de gênero |
| Início/laboratórios separados | Novo Jogo abre criação e chegada técnica Map004; Laboratório técnico e galerias continuam separados; narrativa/dungeon não antecipadas |
| Compatibilidade MV | JavaScript validado/carregado no motor1.6.1, plugins.js canônico UTF-8 sem BOM, nomes/ordem/status/parâmetros preservados; autoria registrada separadamente em editor-roundtrip.json |

Evidências novas em `doc/evidencias/m01-07-fechamento/`, sem reescrever as anteriores:

- `bonus-aprovados-result.json`: **981 verificações**,16 combinações×seis níveis, oito saves nativos produzidos com plugins/catálogo1dd9a6c por rotas isoladas, concessão única,48 roundtrips novos, guardas de arma/tipo, HP/MP/dreno, cura de frio preservada, acerto/teto/evasão, elementos mistos e fixture de crescimento nativo. UI: oito descrições aprovadas,26px, maior largura585px<700px.
- `m01-07-result.json`: **234 verificações** mais teclado/nome/confirmar/revisar/cancelar.
- `resultado.json`:16 prévias/16 save-load de aparência,16 representações no mapa e256 amostras de direção/padrão nativo.
- `m01-07-pointer-result.json`: mouse desktop e toque Android genérico emulado, não Galaxy A56.
- `persistencia-result.json`: **27 verificações** de contratos, recibos, itens, saves anteriores e defaults.
- `laboratorio-result.json`: entrada separada, movimento, colisão, menu/save/load, dados/equipamentos/livro nativos e zero erros.
- `editor-roundtrip.json`: passos efetivamente executados no editor, comparação semântica e limites; não confundir com screenshots de navegador.

Chrome desktop156.0.8078.47, viewport1100×800/jogo816×624, contextos descartáveis; nenhuma gravação em saves pessoais. Fixtures de variância0, MAT/elementos/tipos sintéticos, arco/tipo9 e crescimento de AGI existem **somente na memória do teste**; não cadastrados no banco nem declarados como combate/progressão implementados. O teste histórico R04 roda composições antigas em rotas isoladas e não valida os valores atuais; o atual é `test-approved-races.cjs`.

## Limites práticos e continuidade

Não está validada a eficácia prática dos bônus em encontros completos: Vigor ainda não tem consumo/crescimento M01-08/09; não há fonte real de dano frio no banco; inimigos atuais não conjuram o dardo mágico; a mordida/paralisia existe como dado, sem percurso de encontros final. Testes de fórmula e saves não comprovam equilíbrio ou ausência de vantagem excessiva. Cenários obrigatórios por M01-08/09/10/20 em `BALANCEAMENTO_RACIAL_CENARIOS_M01.md`.

Galaxy A56 físico, teclado virtual real, fullscreen/desempenho e experiência integrada permanecem M01-19. Inspeção visual de playtest NW.js não foi declarada; leitura/salvamento de autoria no editor têm evidência própria. Essas limitações não foram mascaradas como ressalvas estéticas nem usadas para chamar sistemas futuros de entregues.

Próximo elegível: **M01-08 — recursos e evolução do personagem**. Escopo: HP/MP/Vigor atuais/máximos, regra concreta de crescimento aprovada para o projeto, persistência/idempotência, sem regeneração passiva de Vigor; respeitar+10 inicial único e AGI+1 derivada. Custos de técnicas, magia/livros e combate completo continuam M01-09/10. Não iniciado automaticamente.

Feature publicada para revisão e integração em develop autorizada pelo responsável quando validada; preservar a cadeia de commits de criação e revisões por merge Git Flow, sem squash/reescrita. main, release e publicação de versão estável continuam fora do escopo. Resultado da integração registrado na entrega e no histórico Git.
