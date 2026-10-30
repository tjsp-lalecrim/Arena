# M01-20/S03 — pontos distribuíveis e referências

Complementa [S02](ESTUDO_DANO_PROGRESSAO_M01_20_S02.md), sem reiniciar o diagnóstico ou executar E02. **Requisito solicitado:** pontos por nível distribuíveis em **ATQ, DEF, MAT, MDF, AGI e SOR**, adicionais à escolha aprovada de+10 Vida/Mana/Vigor. A quantidade/valor/políticas abaixo são **propostas**, não implementação aprovada. Substituir o crescimento automático G de S02, sem duplicar os mesmos atributos. Sem classes jogáveis, bloqueios raciais, menus, escalonamento ou alteração de saves/jogo.

**Escala revista em [S04](ESTUDO_ESCALA_PROGRESSAO_M01_20_S04.md):**1 ponto/+1 não foi aprovado; passa a referência diante de2/3 pontos, com3 como candidato principal. O equipamento provisório não limita esse desenho. Orçamento e exemplos S03 abaixo são históricos; políticas/lacunas permanecem propostas. E03 não executado; único candidato posterior agora E04/S04. Nenhuma mudança no jogo.

## Referências delimitadas — duas, pesquisa encerrada

| Referência primária e localização | Fato confirmado / motivo da escolha | Aplicação limitada ao Arena |
| --- | --- | --- |
| **Divinity: Original Sin 2**, [manual oficial Xbox](https://dlassets-ssl.xboxlive.com/public/content/6778dff3-8d6c-4615-a8a3-1f1770057d09/GameManual/9e540603-b9bb-44a0-83cd-bb98f1d40b32/nb-NO/index.html), seções Stats and abilities, Armour, Action Points, Equipment. | Atributos influenciam categorias de armas/habilidades; equipamento complementa a construção. Armaduras física/mágica são reservas que protegem Vitality e bloqueiam estados; ações, inclusive ataques, usam AP. Escolhido pela liberdade de construção e separação entre equipamento, defesa e economia de ações. | Mostrar o que cada investimento melhora e o custo de oportunidade do turno. **Não copiar** reservas de armadura/AP, requisitos de equipamento/skills ou números de atributos: são sistemas diferentes. Manual consultado não demonstra uma fórmula de mitigação adequada ao Arena. |
| **Shin Megami Tensei: Nocturne**, manual Atlus USA2004, [digitalização em espelho](https://db.hfsplay.fr/files/2023/08/26/Shin_Megami_Tensei-_Nocturne_USA_M7ROsx5.pdf#page=25), pp.23/26–28 (PDF25/28–30). Índice/copyright e páginas conferidos visualmente. | Manual concede um ponto de estatística ao protagonista por nível e permite refazer a seleção; distingue ordem/primeiro ataque. Atacar não gasta HP/MP; outras ações mostram custos HP/MP. Fraquezas alteram dano e economia de turnos. Escolhido pelo orçamento pequeno e contraste entre ataque básico e habilidades custosas. | Preservar ataque sem custo de recurso, mas com custo de turno. Investimento não precisa alterar todas as ações. **Não copiar** Press Turn, custo em Vida ou função de Luck para o MV. Fonte é documento original em hospedagem não oficial; não é validação de fórmulas comunitárias nem fonte de coeficientes. |

Nenhuma fórmula externa foi adotada. Duas referências bastam para os princípios; parâmetros numéricos a seguir derivam da escala local, não desses jogos. Consulta29/10/2026; PDF/renderizações somente em tmp/ ignorado, fora do jogo distribuído.

## Proposta de orçamento e política inicial

- **1 ponto por nível ganho a partir do2; cada ponto dá+1** em qualquer um dos seis atributos. Nível1 sem pontos extras; orçamento4 no nível5. Escala pequena para não superar rapidamente armas+2/+3 e armaduras+3/+6. Sem custo crescente/teto adicional inicialmente no recorte1–5; limites nativos preservados. Reavaliar antes de extrapolar a campanha, sem declarar equilíbrio até99.
- Sem curva automática desses seis atributos; base, equipamento, alocação, raça e buffs continuam separados. Recursos aprovados mantêm escolhas/valores próprios, sem cura ao evoluir; Vigor gasto somente em técnicas de combate.
- **Não gastos:** permanecem disponíveis, sem alocação automática ou obrigação de gastar antes de jogar. Propor recibo por nível já remunerado e vetor de pontos aplicados; saldo=concedidos−aplicados. Subir vários níveis, carregar ou repetir nível técnico não concede novamente.
- **Personagens existentes:** proposta de crédito retroativo único de `nível−1` pontos livres, sem escolher atributos por eles. Preservar modificadores/equipamentos/escolhas de recursos existentes, sem inferir que eram pontos gastos. Regra de maior nível já remunerado evita duplicação ao baixar/recuperar nível técnico. Migração interna exige revisão própria; namespace web não muda por build. Nenhum save acessado aqui.
- **Confirmação/redistribuição propostas:** prévia reversível e confirmação única do conjunto fora de combate; cancelar não grava. Para o período de teste M01, redistribuição gratuita fora de batalha **somente destes pontos**, sem devolver escolhas de recursos, bônus raciais ou equipamentos; sem curar recursos. Ajuda a avaliar construções sem aprisionar investimento inútil. Ambas as políticas exigem decisão; interface é entrega posterior.

## Utilidade dos seis atributos e lacunas

| Atributo (+1 por ponto proposto) | Benefício efetivo e limite |
| --- | --- |
| ATQ | Aumenta ações físicas pelo ATQ final; equipamento soma uma vez. Na proporcional de S02, cresce linearmente antes de arredondar; não aumenta acerto. |
| DEF | Reduz dano físico por `max(0,20;8/(8+DEFef))`; retorno marginal diminui, sem anular dano. Pesada usa0,75DEF. Subtração alternativa mantém patamar/limiares e é mais sensível a concentração. |
| MAT | Aumenta magia e Cura, se aprendidas; não dá Mana, magia ou técnicas físicas automaticamente. Especialização exige acesso real a livros, atualmente não garantido na partida inicial. |
| MDF | Mitiga dano mágico pelo mesmo desenho proporcional. **Lacuna:** rato/goblin usam físico; não oferece sobrevivência contra eles. Não adicionar conjurador apenas para justificar o atributo nesta tarefa. |
| AGI | MV: `AGI + inteiro[0,floor(5+AGI/4)−1]`, mais velocidade da ação/arma. AGI10→11 contra goblin AGI10 eleva chance de escore estritamente maior de42,86%→57,14%; empates14,29%→12,24%, sem presumir desempate. Não dá turno extra/acerto/esquiva. Prioridades como Defender+2000 e saturação de iniciativa limitam utilidade. |
| SOR | MV usa `max(1+(SORorigem−SORalvo)×0,001;0)` em certos estados/debuffs; não altera dano, crítico ou loot. **Lacuna forte:** não há esse risco em rato/goblin nem estado ofensivo do jogador no subconjunto. Contra a paralisia25% do homem-lagarto técnico, SOR10→11 reduz24,875%→24,850%, só0,025 p.p. Homem-lagarto não está nos encontros da dungeon. Não inventar bônus de crítico/drops: decidir se utilidade nativa insuficiente será aceita provisoriamente ou revisada em recorte específico. |

Manter a proporcional de S02 como recomendação pendente; não criar terceira fórmula. Retirar G automático e conservar seus coeficientes apenas para comparar. A opção de retirar a leve continua dependente de aprovação: pontos não resolvem sua redundância no modelo atual. No proposto, Atacar gratuito sustenta, leve1,25/5 Vigor economiza frente à pesada1,6/12 com penetração; nenhum deles ganha ações extras. Custos/coeficientes ainda não aprovados.

## Exemplos: mesmo orçamento, nível separado de equipamento

Bretã feminina, adaga+couro em todas as seis linhas, base ATQ12/DEF8/MAT8/MDF5/AGI10/SOR10. Nível3=2 pontos, nível5=4. Distribuições são exemplos, **não classes**. Dardo aprendido é premissa comparativa, não concessão à campanha. Rato18 Vida e goblin30 inalterados. Acertos neutros, sem variância/crítico/guarda; recursos escolhidos iguais entre construções: nível3=110/60/100, nível5=120/60/110, sem cura ao subir. SOR fica sem investimento nestes exemplos por sua lacuna, não por restrição.

| Nível / distribuição total de pontos | Pesada rato/goblin | Dardo rato/goblin | Dano recebido rato/goblin |
| --- | --- | --- | --- |
|3 física: ATQ1 DEF1|18 /16|19 /17|2 /3|
|3 mágica: MAT1 MDF1|16 /15|22 /20|3 /4|
|3 híbrida: ATQ1 MAT1|18 /16|22 /20|3 /4|
|5 física: ATQ2 DEF1 AGI1|19 /17|19 /17|2 /3|
|5 mágica: MAT2 MDF1 AGI1|16 /15|24 /22|3 /4|
|5 híbrida: ATQ1 MAT1 DEF1 MDF1|18 /16|22 /20|2 /3|

Sem alocação, a proporcional dá pesada16/15, Dardo19/17 e recebido3/4. **Só equipamento**, mantendo nível5/física e seus4 pontos: trocar adaga+couro por espada+malha soma1 ATQ/3 DEF; pesada19/17→20/19, Dardo igual. Dano recebido arredondado permanece2/3: melhoria defensiva existe antes do arredondamento, mas não aparece nesse golpe pequeno. Não é justificativa para inflar os itens agora.

Na **alternativa subtrativa**, contra goblin no nível5, pesada/Dardo resultam21/23 (física),18/29 (mágica),20/26 (híbrida): concentração de MAT aproxima o Dardo da Vida30, com limiar sensível à variância. Sem pontos, o jogo atual continua com pesada34/33 e Dardo22/21 independentemente desses níveis; não confundir a simulação proposta com comportamento implementado. [Saída reproduzível](evidencias/m01-20-estudo-atributos/simulacao.json): `node tools/simulate-attribute-study-m01-20.cjs`. Só aritmética e enumeração dos dados de iniciativa, sem batalhas/saves.

## Riscos, decisões e único experimento posterior

DEF8→9 muda recebido3/4→2/3 por arredondamento, podendo tornar o primeiro ponto atraente demais; antes de arredondar, a mitigação muda0,50→0,4706. Concentrar4 pontos em DEF leva ao fator0,40, longe do piso0,20; custo crescente não demonstrado necessário agora. AGI pode dominar quando agir primeiro encerra a luta, sem conceder ações extras. Híbrido compra flexibilidade, não potência máxima em ambas; SOR/MDF não são escolhas já equilibradas. MAT sem magia aprendida não ajuda os ataques disponíveis: acesso confiável a magia precisa de avaliação de conteúdo, sem conceder livros aqui. Ganho pequeno de equipamento pode ficar oculto/perder importância frente aos pontos: medir limiares.

Raça fica separada da alocação, sem veto de equipamento: Khajiit+1 AGI equivale a um ponto, Argoniano+10 Vigor permanece recurso inicial; percentuais ofensivos escalam com ATQ e podem dominar defesas raciais inativas na rota. P01–P08 continuam provisórios/inalterados; medir utilidade por conteúdo, teto de acerto e arredondamento antes de revisar qualquer valor.

**Decisões pendentes:** orçamento/valor; saldo/retroatividade/redistribuição; fórmula/papéis de ações de S02; lacunas SOR/MDF e acesso a magia. Distribuir os seis atributos já é requisito solicitado; parâmetros ainda não aprovados. Não implementar menus, mecânicas novas de Sorte ou crescimento automático ATQ/MAT.

**E03 — proposta histórica, não executada; substituída como candidato por E04/S04:** previa um goblin30 e a mesma Bretã com três alocações de nível5/orçamento4. Não executar este recorte antes da decisão da nova escala; preservar estudo e resultados aritméticos como referência, não aprovação.
