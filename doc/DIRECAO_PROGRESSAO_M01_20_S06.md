# M01-20/S06 — direção consolidada e primeiro piloto jogável

29/10/2026, base **528ba4f**. Complementa [S02](ESTUDO_DANO_PROGRESSAO_M01_20_S02.md)–[S05](ESTUDO_CONJUNTO_EQUIPAMENTOS_M01_20_S05.md), sem reiniciar o diagnóstico. **Somente estudo:** nenhum parâmetro, equipamento, slot, penalidade ou experimento aprovado por este documento. Jogo/Pages/saves intactos.

## Direção e modelo candidato

**Requisitos preservados:** escolha de Vida/Mana/Vigor por nível; pontos distribuíveis em ATQ/DEF/MAT/MDF/AGI/SOR, sem curva automática duplicada; equipamento livre, sem profissões ou restrições raciais. Refinar ao longo dos marcos: M01 testa a faixa inicial, não valida até nível99. Skyrim é referência complementar de liberdade, fortalecimento e relevância dos equipamentos **solicitada pelo responsável**, não origem dos coeficientes. Não importar evolução por uso, perks, escalonamento ou fórmulas em tempo real. Regras dos recursos/fontes já consultadas em [M01-08](RECURSOS_E_PROGRESSAO_M01_08.md); revisão por marco centralizada em [HABILIDADES_E_PROGRESSAO.md](HABILIDADES_E_PROGRESSAO.md#revisão-de-progressão-por-marco).

**Candidato para níveis1–5:** três pontos/+1 por nível ganho, saldo sem gasto automático, sem outro crescimento nesses seis atributos; recursos aprovados independentes. Dano proporcional S02: `P × X × max(0,20; 8/(8+Yef))`, X=ATQ/MAT final, Y=DEF/MDF, pesado considera75% da defesa. Arma conta uma vez. Atacar P1/gratuito, leve P1,25/5 Vigor, pesada P1,6/12 Vigor; Dardo P3/6 Mana; Cura25+MAT/8 Mana. Resistências, defesa, acerto e imunidades separados conforme S02. Crítico1,5 de S02 continua proposta separada; não habilitar crítico inexistente para este piloto.

Agrupamento nos cinco slots S05 continua candidato, com orçamento **do conjunto**, sem repetir a couraça em cada parte. Arma+5/Corpo+5 e conjunto melhorado DEF10 são hipóteses de faixa seguinte, não kit inicial nem números necessários ao primeiro piloto. A recomendação é testar primeiro a diferenciação na mesma qualidade básica, antes de melhorar todas as peças.

## Vantagens e concessões: quatro hipóteses comparáveis

Material (couro, malha, metal), peso descritivo, função (proteção/mobilidade/magia) e encantamento são eixos distintos. Não criar carga, peso numérico, restrição ou penalidade automática por material. Um item encantado mantém sua defesa-base; um traje mágico tem menor defesa **por sua construção/orçamento**, não por receber encantamento. Proteção menor já é concessão: não acrescentar AGI negativa só por isso.

Totais de conjuntos completos, **não bônus por peça**. Mesma arma ATQ+2 em todos; orçamento não ofensivo físico de oito pontos líquidos, sem MDF/SOR nominais ou percentuais. Essa soma só controla escala: +1 DEF, +1 MAT e +1 AGI não têm utilidade equivalente. Perfis ainda sem itens/assets próprios; não interpretar rótulos como classes ou exclusividade de uso.

| Perfil completo | Total além da arma | Ganho e concessão a testar |
| --- | --- | --- |
| Leve | DEF+6, AGI+2 | Mobilidade como possível bônus explícito, não regra automática de todo couro; menos proteção que pesado. |
| Pesado | DEF+8 | Proteção maior, sem bônus de mobilidade/magia; **sem penalidade de AGI recomendada agora**. |
| Vestimenta mágica | DEF+4, MAT+4 | Dardo e Cura melhores; cede defesa e mobilidade dos outros perfis. Não retira defesa por encantamento. |
| Híbrido | DEF+5, MAT+2, AGI+1 | Benefícios intermediários reais, sem exigir profissão ou proibir arma/escudo. |
| Sensibilidade, não recomendação | DEF+10, AGI−2 | Mesmo total líquido8; verifica se trocar iniciativa por mais defesa funciona antes de definir penalidades por peça. |

Os dois pontos MDF sem utilidade observada no conjunto básico S05 foram redistribuídos **somente nestas hipóteses**, não corrigidos no jogo. Repartição entre cabeça/corpo/escudo/acessório virá após validar o total; não obrigar todas as peças leves a dar AGI ou todas as pesadas a removê-la. Descrição futura deve mostrar atributos finais, concessão e efeito na ordem; AGI não altera movimento no mapa, esquiva ou quantidade de ações no sistema existente.

## Comparação reutilizada, sem batalhas

Mesmas bases/inimigos/fórmula/arredondamento S05. Bretã feminina, arma+2 comum. Nível1 sem pontos; híbrida S04 no nível3 ATQ+3/MAT+3 e nível5 ATQ+3/DEF+3/MAT+3/MDF+3 (6/12 pontos); a lacuna de MDF dessa distribuição permanece explícita, não compensada silenciosamente. Recursos1/3/5=100/50/100,110/60/100,120/60/110, sem cura ao subir. Dardo conhecido é premissa técnica, não concessão à campanha. Acertos neutros sem variância/crítico/guarda. Atributos **ATQ/DEF/MAT/MDF/AGI**, SOR10. Danos em pares **rato/goblin**; iniciativa=chance de escore estritamente maior que o goblin, empates separados na evidência.

| Nível/perfil | Atributos finais | Pesada | Dardo | Recebido | Iniciativa goblin |
| --- | --- | --- | --- | --- | --- |
|1/leve|12/11/8/5/12|16/15|19/17|2/3|73,2%|
|1/pesado|12/13/8/5/10|16/15|19/17|2/3|42,9%|
|1/mágico|12/9/12/5/10|16/15|29/26|2/3|42,9%|
|1/híbrido|12/10/10/5/11|16/15|24/22|2/3|57,1%|
|3/leve|15/11/11/5/12|20/19|26/24|2/3|73,2%|
|3/pesado|15/13/11/5/10|20/19|26/24|2/3|42,9%|
|3/mágico|15/9/15/5/10|20/19|36/33|2/3|42,9%|
|3/híbrido|15/10/13/5/11|20/19|31/28|2/3|57,1%|
|5/leve|15/14/11/8/12|20/19|26/24|2/3|73,2%|
|5/pesado|15/16/11/8/10|20/19|26/24|2/2|42,9%|
|5/mágico|15/12/15/8/10|20/19|36/33|2/3|42,9%|
|5/híbrido|15/13/13/8/11|20/19|31/28|2/3|57,1%|

Iniciativa considera ações de mesma prioridade; não extrapolar esses percentuais para Defender, que tem prioridade própria.

- **Proteção e arredondamento:** no nível1, DEF11→13 reduz ataque bruto do goblin2,947→2,667, mas ambos exibem3; DEF9 da vestimenta recebe3,294→3. Na média neutra, o leve parece superior ao pesado e a concessão mágica fica oculta. Variância nativa pode revelar diferenças; não afirmar domínio absoluto por inteiros sem testá-la. No nível5, pesado recebe2 contra3 dos demais: ganho observável, ainda sem prova de equilíbrio.
- **AGI negativa é instável:** DEF10/AGI−2 de equipamento leva a AGI8 e iniciativa20,4% (versus42,9% sem alteração), em troca de reduzir recebido do goblin3→2 no nível1. No nível5, os dois pesados recebem2; a penalidade continua custando iniciativa sem ganho inteiro naquele golpe. Com AGI18 antes do equipamento, leve/pesado/mágico/híbrido já têm100%; sensibilidade penalizada/AGI16 ainda98,4%. Não vira menor frequência de ações. **Rejeitar penalidade universal neste primeiro piloto**; não inventar outra mecânica para justificá-la. Bônus de AGI do leve também é candidato, não solução garantida após saturação.
- **Benefício mágico efetivo e risco:** nível1 Cura33→37 na vestimenta; nível3 Cura36→40 e Dardo24→33 contra goblin30, passando de dois acertos para um nominalmente. Híbrido tem Cura38/Dardo28. É vantagem real de MAT, mas pode dominar considerando custo6/60 Mana e recuperação integral disponível. Não aumentar inimigo para esconder isso nem reduzir coeficiente aqui. Sem magia aprendida, esses pontos não fortalecem ataques físicos; isso deve ser comunicado.
- **Liberdade:** quatro perfis têm a mesma arma/técnicas; especializado mágico não perde acesso físico, e híbrido ganha ambos sem igualar extremos. A análise não prova viabilidade de toda distribuição: MDF/SOR continuam com lacunas neste conteúdo; raças e resistências não foram reequilibradas. Não usar essas lacunas como bônus de fachada para completar orçamento.

## Decisões mínimas e único experimento jogável proposto

**E05 — substitui E04 como próximo candidato, não autorizado/executado:** um goblin atual (Vida30/ATQ7/DEF3/MDF3/AGI10), uma Bretã feminina nível3 com adaga existente, mesma distribuição ATQ3/MAT3 e110/60/100 recursos, quatro perfis acima na mesma qualidade. A arma/animações existentes bastam; a cobertura é técnica, sem prometer aparência de novas roupas. Cada execução começa em sessão técnica descartável idêntica; sem drops obrigatórios, itens pessoais ou alteração da campanha. Fixture concede só Dardo/Cura conhecidos e configura valores do perfil, sem criar catálogo/menus de distribuição/penalidades/arte. Configuração de atributos usada apenas no piloto não valida equipar peças reais nem migração.

Usar ações nativas, recursos/custos/turnos existentes; crit sem fonte positiva, variância10% e acerto/esquiva nativos. **Primeira unidade: quatro combates, um por perfil**, com Atacar, leve, pesada, Dardo, Cura e Defender disponíveis para escolha livre, não uma bateria de todas as combinações. Registrar escolhas, dano bruto/final, ordem, respostas sofridas, Mana/Vigor gastos e retorno ao mapa. Reutilizar as verificações de custos existentes e conferir consumo único nas ações efetivamente usadas, sem repetir todo o combate. Comparar se a proteção muda decisões, se o híbrido tem uso e se a magia elimina o inimigo antes de ele responder; não atribuir significância estatística a quatro lutas. Custos aprovados não mudam no ensaio. Fortalecimento contra inimigo antigo é permitido; não há meta aprovada de turnos ou obrigação de manter rato/goblin difíceis para sempre. Se o primeiro perfil revelar defeito funcional, parar e corrigir antes de ampliar execuções.

Para autorizar **somente esse piloto**, decidir: (1) fórmula/potências S02 como configuração experimental; (2) hipótese3/+1 e a distribuição fixa, sem interface/retroatividade ainda; (3) quatro totais acima, inclusive AGI positiva do leve, sem AGI negativa ou percentuais. O agrupamento definitivo de slots, orçamento melhorado/espada5/Corpo5 e políticas de pontos de saves antigos continuam decisões separadas, não pré-requisitos para uma fixture que não equipa peças novas. Não aplicar protótipo a saves existentes ou trocar namespace. Aprovar o ensaio não aprova seus parâmetros para a campanha.

Critério de avaliação: fixture recompõe os valores/custos corretos sem cumulatividade, quatro partidas são reproduzíveis por um roteiro/estado aleatório registrado apenas no ensaio, e o responsável consegue comparar utilidade de proteção, iniciativa e magia. Escolha dominante ou perfil sem benefício é resultado a registrar, não motivo para ajustar números durante a mesma execução. Nenhum kit é aprovado pela soma nominal de pontos ou pelo simples término das quatro lutas.

Próximos marcos: ampliar níveis/equipamentos/raças e fontes de dano apenas conforme conteúdo real; reavaliar lacunas MDF/SOR, saturação AGI, contribuições raciais, oferta de recuperação e utilidade da leve. Sem catálogo, novas resistências, inimigos escalonados ou revisão de drops nesta entrega. Nenhuma nova pesquisa externa; fontes originais S05 e complementares S02–S04 preservadas.

Reprodução: `node tools/simulate-equipment-roles-m01-20.cjs`; [evidência](evidencias/m01-20-papeis-equipamentos/simulacao.json). Reutiliza snapshots S05, confere controles e orçamento líquido:12 estados,2 sensibilidades penalizadas e5 controles de saturação. Apenas aritmética, não validação jogável. Aguardar avaliação antes de implementar E05.
