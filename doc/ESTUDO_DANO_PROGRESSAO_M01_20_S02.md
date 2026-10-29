# M01-20/S02 — dano, atributos e progressão

**Estudo não aprovado para implementação.** Substitui E01: aumentar Vida do goblin não foi autorizado nem executado. Referência de execução permanece9fab698; somente leitura do motor/plugins/dados locais e aritmética isolada. Não é transcrição de regras do Arena original nem pesquisa de novos drops. Sem escalonamento automático, profissões jogáveis, novos atributos ou gasto de Vigor fora das técnicas.

**Complemento vigente [S03](ESTUDO_ATRIBUTOS_M01_20_S03.md):** requisito solicitado de pontos para os seis atributos, adicional aos recursos. Substitui G automático abaixo; tabela C/simulação S02 preservam a hipótese anterior, não representam a distribuição agora solicitada. E02 não executado; candidato posterior passa a ser somente E03 de S03. Demais fórmulas permanecem propostas, não aprovadas.

## 1. Modelo atual — fatos e riscos

- **Atributos:** base da classe técnica + equipamento/modificadores + bônus racial, com multiplicadores/buffs e limites/arredondamento MV. Armas somam ATQ; armaduras DEF. ATQ10/DEF5/MAT8/MDF5/AGI10/Sorte10 são constantes nos níveis1–99; nível não entra no dano. AGI afeta ordem aleatória; Sorte, certos estados/debuffs. Vida sustenta sobrevivência; Mana/Vigor limitam ações, não multiplicam dano.
- **Fórmulas:** Atacar e leves=`max(1,2×ATQ−DEF)`, pesadas=`max(1,3×ATQ−DEF)`; mesmo tipo físico, sucesso100% da habilidade, velocidade0, variância10%, alvo único. HIT95% do jogador e evasão são verificações separadas. Atacar0 Vigor versus leve5: não foi encontrado benefício próprio que compense a leve; pesada12 compra dano imediato. Dardo=`max(1,3×MAT−MDF)`,6 Mana; Cura=`25+MAT`,8 Mana, sem mitigação de armadura.
- **Pipeline:** fórmula → bônus racial de arma → elemento (inclui Nórdico) → PDR/MDR por tipo → REC em cura → crítico → variância → Defender → arredondamento. Bretão aplica ×0,75 ao dano mágico positivo **depois**, arredondando novamente. Defender divide por `2×GRD` (atual1), prioridade+2000. Rato/goblin não têm resistências específicas. Elemento físico explícito das técnicas não é substituído pela trait da arma.
- **Limites:** o piso1 está dentro da fórmula, não no resultado final: DEF alta achata dano, resistências/Defender ainda podem arredondá-lo a0. Variância nativa sorteia dois inteiros em torno da base (não distribuição uniforme simples); arredondamento esconde bônus pequenos. Crítico nativo ×3, mas não há chance CRI positiva nas traits atuais desses participantes/equipamentos: não culpá-lo pela facilidade relatada. Pode gerar explosão quando uma fonte futura ou fixture habilitar CRI.
- **Raça:** Redguard +8%/+3 p.p., Elfo negro +5%/+2 p.p., Bosmer +4 p.p. atuam em ações físicas válidas de arma (não punhos/magia); teto HIT1 antes de evasão. Khajiit AGI+1; Argoniano Vigor inicial+10; Bretão dano mágico×0,75; Nórdico frio×0,5; Alto elfo imune ao estado3. Rat/goblin não usam magia/frio/paralisia: defesas raciais não ajudam nesses encontros. Há risco de preferência ofensiva, não evidência de uma raça obrigatória; efeitos de arredondamento e limiares precisam ser medidos.

Fontes de implementação: rpg_objects.js (`param`, `itemHit/Eva/Cri`, `makeDamageValue`, `applyVariance/Guard`, `paramBase/levelUp`), Arena_CharacterCreation/MV_CharacterRules, Arena_Resources, Skills/Classes/Weapons/Armors/Enemies/ArenaCatalog/ArenaProgression.json. Diagnóstico de recompensas/recuperação e ensaios históricos permanecem em [E01](DIAGNOSTICO_BALANCEAMENTO_M01_20_E01.md) e [cenários raciais](BALANCEAMENTO_RACIAL_CENARIOS_M01.md); não foram repetidos.

## 2. Duas alternativas — números propostos, não decisões

**Recomendada: mitigação proporcional limitada.** `D0 = P × X × max(0,20; 8/(8+Yef))`. X=ATQ final em físico ou MAT final em magia; Y=DEF ou MDF final do alvo, limitado inferiormente a0. Yef=Y normalmente; pesado usa0,75Y (25% de penetração, sem remover armadura). A arma contribui **uma vez** no ATQ final; P é potência da ação. DEF8 reduz metade da base e nunca mais de80% por esse fator. Não aplicar a Cura: manter seu cálculo/REC separado.

Depois de D0, reutilizar raça/elementos/PDR/MDR, variância10% e Defender; propor crítico×1,5, sem criar chance de crítico. Arredondar uma vez no final, mínimo1 para dano positivo acertado sem imunidade; imunidade explícita0, cura/erro/esquiva/efeito nulo preservados. Limite80% é **só** de DEF/MDF, não cancela resistências/Defender. Multiplicar resistências, sem somá-las ou duplicá-las. Crescimento linear, envelope físico abaixo e crítico menor limitam saltos; níveis altos/empilhamento continuam exigindo avaliação.

**Alternativa: subtração com piso proporcional.** `D0 = max(0,20×P×X; P×X−0,50×Yef)`, com a mesma etapa de fatores finais. Mantém leitura de absorção por pontos e é simples, mas o limiar/patamar ainda torna DEF muito dependente da escala e cria descontinuidades. Prefiro a proporcional por permitir ganhos defensivos graduais, sem o corte abrupto atual. Não misturar as duas.

| Ação física — opção recomendada para decisão | Potência/custo provisórios | Situação de uso |
| --- | --- | --- |
| Atacar | P1, gratuito | Sustentação/poupar recurso; opção funcional com Vigor0. |
| Leve | P1,25,5 Vigor | Mais dano que Atacar pelo mesmo turno, menor gasto absoluto; pode terminar um alvo ferido sem pagar pesada. |
| Pesada | P1,60,12 Vigor e25% penetração | Burst para reduzir respostas ou enfrentar proteção; menor eficiência por Vigor em alvo pouco protegido, não escolha obrigatória em toda ação. |

Opção alternativa de comandos: **retirar a leve**, mantendo Atacar + pesada se não houver uso distinto; não inventar status só para justificar três ações. Retirar Atacar exigiria resolver ações com Vigor0. Magias mantêm Mana/aprendizado e potências próprias, sem rebalancear catálogo: com potência3 do Dardo, MAT8→10 contra MDF3 produz17→22 na recomendada, custo6 inalterado; Cura33→35, sem defesa do alvo.

## 3. Progressão, raças e inimigos

**Aprovado, manter:**100/50/100 (+10 Vigor Argoniano), escolha de+10 em um máximo por nível, sem cura ao subir/regeneração passiva; EXP/poções/descanso existentes. **Hoje:** atributos ofensivos/defensivos constantes, equipamento dá parâmetros/técnicas, livros dão magias; não há aprendizado automático por nível. **Proposta separada:** somar `G(L)=floor((L−1)/2)` a ATQ e MAT; DEF/MDF sem curva nova. Nível dá ofensiva modesta; Vida escolhida/armadura dão sobrevivência; habilidades dão opções. G derivado/idempotente, sem reaplicação no load. Extrapolação além dos exemplos1–5 e tratamento de saves existentes exigem aprovação; não migrar/alterar namespace silenciosamente.

Revisar P01–P08 por utilidade na rota, frequência, dano evitado/causado, ordem, custo, teto HIT e arredondamento. Redguard tem mais dano e apenas1 p.p. menos HIT que Bosmer nas armas melee atuais: comparar, não nerfar automaticamente. Evitar passivos dominantes e avaliar imunidade quando aplicável; não impor equipamento/estratégia nem inventar sistemas para ativar bônus. Nenhum valor racial novo aprovado.

Inimigos com faixas fixas: rato frágil/ágil; goblin com decisão legível, por exemplo defesa condicional, em amostra futura. Resistências moderadas/vulnerabilidades e oportunidades de resposta, sem imunidade que obrigue arma. Não adicionar ações/elementos agora. Superar ratos antigos é fortalecimento desejado, não motivo para escalá-los. Medir recursos na rota antes de alterar recuperação.

## 4. Comparação aritmética pequena

Bretã feminina, sem bônus físico; arma/armadura **de referência, não kit inicial concedido**. A: nível1/adaga+couro, ATQ12/DEF8,100 Vida. B: nível1/espada curta+malha, ATQ13/DEF11,100 Vida. C: nível5 com o equipamento B; atual ATQ13, proposto15, DEF11; quatro escolhas aprovadas (2 Vida/1 Mana/1 Vigor) produzem120/60/110 em ambos os modelos. Recursos cheios são premissa após recuperação, não cura por evolução. Rato Vida18/DEF2/ATQ5 e goblin30/3/7 inalterados. Acertos sem crítico/variância/guarda, fatores neutros: são projeções por golpe, não batalhas ou taxas de vitória.

| Estado/alvo | Atual: Atacar/leve/pesada | Recomendado: Atacar/leve/pesada | Dano recebido atual→rec. |
| --- | --- | --- | --- |
| A / rato |22 /22 /34|10 /12 /16|2→3|
| A / goblin |21 /21 /33|9 /11 /15|6→4|
| B / rato |24 /24 /37|10 /13 /18|1→2|
| B / goblin |23 /23 /36|9 /12 /16|3→3|
| C / rato |24 /24 /37|12 /15 /20|1→2|
| C / goblin |23 /23 /36|11 /14 /19|3→3|

A melhoria B já permite pesada-base18 contra Vida18 do rato, antes16; a variância pode mudar esse limiar. C tem dano/recursos maiores, mas goblin ainda requer mais de um golpe e decisões de custo. Atacar arredonda ao mesmo valor entre A/B: ganho de equipamento não aparece em todo golpe, mas aparece na leve/pesada e na sobrevivência. Contra goblin, impactos necessários para esgotar Vida do jogador passam de25 em A a34 em B e40 em C no recomendado, sem recuperação/erro; não são turnos reais. Modelo atual pode neutralizar demais ratos com armadura e mantém dano B=C. O modelo recomendado também pode apenas alongar lutas; **não comprova desafio por si só**. Nenhuma contagem é meta aprovada.

Reproduzir: `node tools/simulate-damage-study-m01-20.cjs`. [Saída](evidencias/m01-20-estudo-dano/simulacao.json). Simulação offline determinística, seis linhas, sem carregar plugins, batalhar ou escrever no banco. Não valida implementação nativa futura, precisão, crítico, resistências ou progressão persistida.

## 5. Decisões e único experimento posterior

Aprovar antes de implementar: fórmula/constantes8 e20%; papel e permanência da leve; potências/penetração/custos; crítico1,5 e política do mínimo; crescimento ofensivo e tratamento de saves existentes. Nenhuma mudança em bônus raciais, Mana ou regras de recuperação foi autorizada. E01 fica apenas como histórico substituído.

**E02 — proposta anterior não executada, substituída como próximo candidato por E03/S03:** um goblin inalterado (Vida30), Bretã feminina com os três estados A/B/C em sessão técnica isolada; comparar fluxo nativo atual e modelo recomendado somente físico, sem tocar campanha/saves pessoais ou produzir assets. Registro histórico preservado; não executar antes da decisão sobre pontos/fórmula. O único próximo experimento recomendado está em S03.
