# Avaliação de percurso e balanceamento por marco

Diretriz aprovada pelo responsável,29/10/2026. Fonte principal deste processo; itens recorrentes em [MARCOS_DO_PROJETO.md](MARCOS_DO_PROJETO.md#avaliação-recorrente-de-balanceamento). Não é novo estudo de fórmulas, autorização de implementação ou teste de toda combinação. M01 usa **M01-20/REF04**, sem outro item paralelo.

## Referência e cobertura conhecida

O responsável testou opções do piloto e considera **insuficiente avaliar balanceamento por poucas batalhas isoladas**. Relato identificado como “adaga, espada e híbrido”, associado ao estado disponível **bc71752**; não informou esse SHA, ambiente, percurso, número de lutas ou resultados discriminados. Não registrar aprovação definitiva de fórmula, pontos ou todos os conjuntos.

Conferência por leitura dos acessos entregues: **E05 — comparar conjuntos** tem Leve/Pesado/Vestimenta mágica/Híbrido, **todos com adaga**, goblin30, nível3. O seletor anterior oferece **Teste da arma: Bretã / adaga** e **Teste da arma: Bretã / espada**, com rato de treino500 e regras normais. Assim, “espada” não identifica cenário E05; pode indicar o acesso antigo, mas essa associação não está confirmada. “Híbrido” corresponde ao nome de uma opção E05, sem provar o caminho exato utilizado. Cobertura segura: opções foram experimentadas; não inferir os quatro conjuntos, igualdade das condições ou novo teste de campanha. **Não exigir repetição agora.** Na próxima rodada, anotar caminho/versão para evitar a ambiguidade.

| Contexto atualmente entregue | Modelo ativo |
| --- | --- |
| Campanha local, fora dos laboratórios | Atacar/leve=`max(1,2×ATQ−DEF)`; pesada=`max(1,3×ATQ−DEF)`; Dardo=`max(1,3×MAT−MDF)`; Cura25+MAT. Custos0/5/12 Vigor e6/8 Mana, modificadores raciais/elementais/guarda/variância nativos preservados. Escolha+10 Vida/Mana/Vigor por nível, sem cura ao evoluir; seis atributos sem crescimento por nível/pontos distribuíveis ainda não implementados. Armas normaisATQ+2/+3, raras+3/+4; couro/malha DEF+3/+6, raras+4/+7. Poções/descanso existentes; Vigor só em técnicas, sem regeneração passiva. Valores provisórios. |
| E05 somente | Proporcional S02, alocação fixa de6 pontos ATQ3/MAT3, quatro conjuntos virtuais, Bretã3/adaga/goblin30, início110/60/100. Semente controlada, sem EXP/loot ou saves experimentais. Não há interface geral de distribuição ou peças reais novas. [Contrato E05](PILOTO_E05_M01_20.md). |

A fórmula da tabela é a base, não o dano final após todos os modificadores; o piso nativo pode sofrer arredondamentos posteriores (S02). Requisitos de liberdade de equipamentos e pontos continuam válidos; **três pontos, fórmula proporcional, agrupamentos e orçamento não estão aprovados para campanha**. “Manter o combate assim” não autoriza promover regras do E05.

## Roteiro curto de percurso M01 — proposto, não executado

**Uma decisão antes de iniciar:** usar como base provisória a **campanha local bc71752, fora dos laboratórios, sem transferir E05**? É a recomendação: primeiro observar a jornada realmente implementada, preservando uma referência e sem atribuir ao loot real conjuntos virtuais. Aprovar essa base autoriza o recorte de avaliação, não valida seus valores definitivamente. Se a base pretendida for outra, será preciso descrevê-la e autorizar a preparação em tarefa posterior; não presumir essa escolha. Pages permanece no jogo9fab698, sem atualização por este planejamento.

Após decidir a base, manter o mesmo commit/pacote durante a rodada e registrar ambiente, versão de teste, nova partida/save de origem, personagem e rota. Usar uma personagem/construção representativa; sem matriz de todas as raças/armas. Fazer o percurso **criação → introdução → dungeon/objetivos → Shift Gate/encerramento**, com três paradas:

| Ponto | Registro mínimo |
| --- | --- |
| A — entrada na dungeon após introdução | Nível/EXP, escolhas de recursos, pontos distribuídos se implementados (hoje: não aplicável), equipamento/inventário e habilidades iniciais reais; recursos atuais/máximos. |
| B — uma pausa intermediária da exploração | Anotar local/etapa como referência da rodada; nível/EXP, novas peças/livros realmente encontrados, equipamentos/skills em uso, recursos/estoques. Contagens acumuladas de combates, derrotas/repetições, poções e descansos. Na primeira passagem escolher uma pausa natural, sem combate ou descanso artificial; reutilizar esse ponto em comparações posteriores. |
| C — antes do Gate, com observação do encerramento | Nível/EXP e construção finais, equipamentos/itens/habilidades obtidos e utilizados, recursos/estoques restantes, totais de combates/derrotas/tentativas/descansos/poções. Dificuldade percebida, decisões úteis, opções dominantes/sem benefício e diversão. |

Durante o trajeto, marcas simples em papel/texto para combates, derrotas, novas tentativas, usos de cada poção e descansos; anotar local de recuperação e consumo acumulado de Mana/Vigor quando observável. Em **um ou dois encontros representativos**, registrar inimigo, duração aproximada, ações escolhidas/quantidades e gasto de Mana/Vigor, distinguindo antes/depois de recuperação. Totais aproximados devem ser identificados como tais; se algo não foi observado ou não é visível, escrever “não registrado/não visível”, nunca inferir0. Não exigir relatório detalhado de cada luta ou nova ferramenta.

Modelo manual, uma linha por parada: `A/B/C | local/quest | nível/EXP | pontos/recursos escolhidos | equipamento em uso | obtidos/usados | skills aprendidas/usadas | Vida/Mana/Vigor atual/máximo | poções/estoque | combates/derrotas/tentativas/descansos acumulados | percepção`. Uma linha extra por encontro representativo: `inimigo | ~duração | ações | Mana/Vigor/poções gastos | recuperação | decisão útil/problema`.

Separar **encontrou e usou**, **encontrou e não usou**, **apenas possível na tabela**. Não conceder item faltante nem declarar que o jogador obteve espada/malha/livro porque há chance de drop. Registrar a falta de aquisição relevante como dado da jornada; não iniciar pesquisa extensa de drops. Não repetir persistência pública já confirmada para medir dificuldade.

## Processo recorrente e encerramento da rodada

1. Fixar versão e faixa de níveis/equipamentos esperados do marco. Poucos pontos de registro; manter o histórico da rodada separado das propostas.
2. Confrontar percurso observado com esperado: EXP/níveis, alocação quando existir, obtenção/uso real de equipamentos/habilidades, encontros/derrotas/tentativas, ações/duração, Mana/Vigor/poções, descansos e recursos finais. Avaliar fortalecimento, atributos/raças, escolhas e percepção, sem exigir testar toda combinação.
3. Priorizar problemas estruturais e opções dominantes. Propor **uma família de parâmetros por experimento** (por exemplo potências de ações OU orçamento de equipamentos), mantendo outras constantes. Cada proposta exige autorização própria; este processo não autoriza ajustes automáticos.
4. Reavaliar na escala dos marcos seguintes, preservando fortalecimento contra inimigos antigos, sem compensá-lo com escalonamento automático. Considerar recuperação e utilidade real de atributos/raças antes de alterar bônus. Valores e decisões provisórias continuam identificados.
5. Registrar resultado, ajuste avaliado quando necessário e decisão de aceite/ressalvas ou problema aberto. Mudança futura deve tratar compatibilidade de saves e ganhos já concedidos, sem trocar namespace por rebalanceamento. Nenhuma telemetria/coleta remota ou ferramenta extensa prevista; registro manual basta inicialmente.

Próximo passo recomendado: **M01-20, escolher a referência para o primeiro percurso**, critério de avaliar dificuldade/recuperação e fortalecimento na jornada integrada. A única decisão pendente é a base acima; não ampliar E05, alterar campanha ou iniciar outra rodada antes dela.
