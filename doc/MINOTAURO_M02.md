**Atualização B1 posterior:** dois encontros em Map015 (MIF64,55/64,56), mantendo os atributos/arte; EXP60 provisória e ouro25%/6–60 confirmados na fonte local. Laboratórios próprios continuam0EXP/tabela vazia por contexto/instância. Seis referências ainda fora da distribuição. [Fonte operacional vigente](STONEKEEP_M02_04.md#entrega-atual--b1-conectado-a-b2). O texto abaixo preserva a entrega original do exemplar.

# Stonekeep — Minotauro V01, combate e patrulha

Base8b309cc; feature `feature/m02-minotauro-piloto`. O responsável aprovou explicitamente combate e patrulha do homem-lagarto; não se inferem ambiente adicional, equilíbrio, recompensas ou distribuição. Seus assets foram preservados.

**Aprovação posterior:** o responsável aprovou explicitamente as animações de combate e patrulha da entrega569e382. Não se estende a balanceamento, recompensas, encontros ou ambientes adicionais não relatados; assets preservados.

## Identidade corrigida, com autorização explícita

O nome anterior “ogro” foi inferido indevidamente do alias **OGRE.DFA**, flat58 de STKEEP1.INF. O registro contém **ITEM39**; o mapeamento é creatureID=ITEM−31=8, índice7. As tabelas do ACD.EXE instalado identificam **Minotaur / PAT@.CFA**. O responsável autorizou: **“Corrigir para Minotauro e continuar”**. O inventário, CSV, visão geral e leitor agora refletem essa identidade; as oito coordenadas originais MIF0-based permanecem **(24,17),(19,34),(25,36),(64,55),(64,56),(86,65),(86,67),(78,70)**. Nenhuma foi distribuída nesta entrega.

[Fontes, offsets e hashes](arte/minotaur-v01/sources.json): nome0x36DBE, animação0x3E7FF, escala0x3E63A; índice7 escala280 versus orc300. Leitura do executável descompactado apenas como dados, sem executá-lo. A fórmula de índices também foi conferida no [leitor OpenTESArena fixado em4f11a85](https://github.com/afritz1/OpenTESArena/blob/4f11a858f401ea23b2211e2d0485cadb58b32296/OpenTESArena/src/Entities/ArenaAnimUtils.cpp). Recursos PAT1/3/5/6.CFA e PAL.COL extraídos somente para tmp ignorado. Sem nova observação no jogo DOS.

Os quadros originais mostram cabeça taurina castanha/avermelhada, focinho escuro, chifres claros, corpo musculoso ocre/dourado **humanoide, pés humanos**, faixa/tanga castanha e lâmina curta larga na mão direita. Não é ogro genérico, gigante, criatura com cascos ou Argoniano. Porte robusto, acabamento e projeções são adaptações artísticas; a escala original não comprova tamanho gigante.

Wiki local Monsters, páginas14–15: Vida30–60, dano3–18, EXP=Vida×20+300; leve resistência mágica. Não se transplantaram essas fórmulas para MV nem se criou imunidade/efeito novo. Ouro25%/6–60, item mágico ou poção20% e item de baixa qualidade25% são referências para configuração futura, não drops já implementados.

## Um exemplar, dois conjuntos

**Combate:**24quadros próprios — espera/ataque/dano/derrota, seis por movimento. Mestre `art/masters/stonekeep-minotaur-v01/sheet-v01.png`; exportação `img/enemies/Arena_Combat_minotaur_v01.png`,1344×640, células224×160, apoio152/corpo neutro96px. Ataque marca impacto no quarto quadro. [Prompt](arte/minotaur-v01/prompt.json), [perfil](arte/minotaur-v01/profile.json), [exportação/hashes](arte/minotaur-v01/exports.json).

**Mapa:**12poses sul/oeste/leste/norte, passoA/neutra/passoB, em perspectiva superior. MestreV01 e correção direcionadaV02 em `art/masters/stonekeep-minotaur-walk-v01/`; selecionadas somente as três poses oeste e os passos finais sul/norte da correção, sem espelhamento ou deformação das poses. Exportação `img/characters/$Arena_minotaur_walk_v01.png`,288×384, células96×96/apoio94/densidade única/corpo até62px. [Prompt](arte/minotaur-walk-v01/prompt.json), [correção](arte/minotaur-walk-v01/correction.json), [seleção e hashes](arte/minotaur-walk-v01/exports.json). A correção resolve direção oeste e alternância de pernas; não é uma variante adicional.

Reconstrução: `python tools/export-stonekeep-minotaur.py`, `python tools/export-stonekeep-minotaur-walk.py`, `node tools/build-stonekeep-minotaur.cjs`. Gerador pai chama a configuração; não altera mapas ou inimigos anteriores. Mestres e exportações ficam separados.

## Configuração provisória e isolamento

Enemy8/Troop9, **Vida60/Mana0, ATQ12/DEF5/MAT0/MDF5/AGI9/SOR5, acerto90%**, apenas Atacar/skill1. Vida usa o topo da faixa original; demais valores são adaptação provisória ao combate atual, não equivalência dos atributos DOS. MDF5 não implementa resistência especial. Fórmula geral, custos do jogador e demais inimigos inalterados.

**Laboratório:0 EXP/loot vazio**, com recibo vazio único após vitória. `campaign.enabled=false`, EXP/loot de campanha ainda não configurados; não transportar os zeros para os oito encontros futuros. Não há doença, habilidade inventada ou nova resistência. Matriz vigente49/180encontros/32/70portas.

## Avaliação observável

**http://127.0.0.1:8774/** → **Testes / Debug**:

1. **Combate → Stonekeep · minotauro (RAM)**: observar espera, Atacar/Defender/técnica, reação e derrota.
2. **Campanha e mapas → Stonekeep · minotauro — patrulha (RAM)**: observar quatro direções, circular junto ao pilar/água e encostar para uma batalha. Sala técnica Map016, um exemplar(9,6), chegada(4,9); posição de inspeção, não posição original.
3. **Guardar teste em RAM / Carregar teste da RAM** preservam estado dentro da sessão; saída para o título encerra contexto, reentrar permite repetir. Slots normais bloqueados; não tocar nos saves pessoais.

A sala é selecionada **só em memória**; arquivo Map016 do orc, Map012/campanha e Map015 integral permanecem iguais. Sem distribuir os seis orcs ou19homens-lagarto por associação.

## Verificações executadas e pendências

Chrome156.0.8078.76, perfil descartável, canvas816×624, servidor canônico. **5grupos de combate**: abertura limpa/hub; quatro movimentos/seis quadros e impacto sincronizado; ações/dano/custos únicos (técnica12VG e magia6Mana); vitória/retorno/recibo vazio único; derrota/game over e slots bloqueados. [Resultado](evidencias/m02-minotaur-v01/battle/resultado.json).

**7grupos de patrulha/isolamento**: quatro direções/padrões0/1/2 e apoio real; pilar/água/raio3; contato por teclado/trava de transição; um ataque e vitória controlada com retorno/remoção individual/recibo único; restauração RAM de posição/recursos/quests/pontos/derrota; saída restaura contexto normal; reentrada dos exemplares aprovados de orc e homem-lagarto sem vazamento de configuração. Storage pessoal intocado/perfil vazio, sem erros JS/recursos faltantes. Dados/mapas anteriores e sprites aprovados protegidos na comparação à base; reconstrução pai idempotente. [Resultado](evidencias/m02-minotaur-v01/walk/resultado.json).

Gravações canvas30fps em velocidade normal: [combate≈20s](evidencias/m02-minotaur-v01/battle/combate-normal.webm) e [caminhada/contato≈16s](evidencias/m02-minotaur-v01/walk/caminhada-contato-normal.webm). Decodificação local para inspeção143/38quadros, sem acelerar os arquivos entregues. Atlases, gravações e capturas foram inspecionados para escala, apoio, direção, continuidade e recortes. Não substituem aprovação do responsável.

`tools/test-stonekeep-minotaur-identity.cjs` confirmou que o inventário difere da base somente pelos oito rótulos corrigidos e totais por setor; coordenadas, estados e IDs anteriores permanecem iguais. Os rótulos da antiga prova sintética Map014 permanecem como registro histórico, sem efeito na campanha ou neste exemplar.

**Pendente:** oito posições e configuração de campanha; aranha (combate+caminhada) como próxima espécie em entrega própria. Sem percurso completo, editor/mobile ou novo balanceamento. Depois dos assets, retomar encontros/portas/eventos; loot/descanso posteriores. “Forçar a porta” continua pendente de avaliação integrada.
