# M01-20 — revisão curta de ouro e raridade

29/10/2026, base de jogo **5659763**, sem alteração de execução. Dois percursos em localhost com Khajiit e Elfo Negro chegaram ao Shift Gate/encerramento conforme o responsável; sem dados quantitativos de nível/equipamento/consumo. Isso confirma funcionamento no alcance relatado, **não equilíbrio definitivo**, nem obtenção de todo item possível. Não solicitar repetição nesta tarefa.

**Atualização posterior:** fallback2–8 autorizado e implementado somente na feature, com [contrato/evidências](OURO_RESERVA_VARIAVEL_M01_20.md). A tabela/proposta abaixo descreve a revisão013dd25 anterior à implementação; raridade/catálogo continuam propostas não aplicadas. Batalhas e saves existentes preservados.

## Estado real: chance não é quantidade

Leitura de ArenaLoot/ArenaQuests/Enemies/Weapons/Armors/Items.json, MV_LootRules, Arena_Loot e Arena_Quests. Intervalos inteiros inclusivos; primeiro testa ocorrência, depois quantidade.

| Origem/conteúdo | Ocorrência atual | Quantidade/efeito atual |
| --- | --- | --- |
| Rato1, presente na dungeon | Ouro0%; demais categorias0 | Sem recompensa de loot; não é um prêmio positivo fixo. Fonte de loot desconhecida, mantido provisório. |
| Goblin2, presente na dungeon | Ouro19%; equipamento25%; poção8%; livro1% | Ouro **2–20 variável**; uma peça ou poção/livro por categoria aprovada. |
| Homem-lagarto3, técnico (não consta dos encontros atuais do Map008) | Ouro23%; equipamento25%; poção12%; livro2% | Ouro **2–20 variável**. Não introduzir o inimigo na dungeon por associação. |
|15 tesouros do Map008 | Reutilizam tabela do goblin2 | Ouro normal2–20; **se não sai nenhuma quantidade positiva em nenhuma categoria, fallback fixo5 ouro**, via treasureMinimumGold. Não há mínimo5 sobre um resultado normal de2 moedas. |
| Ouro nativo dos três inimigos | Campos gold=0, caminho substituído pelo plugin | Não somado ao sorteio; não criar recompensa fixa paralela. Não encontrados eventos de ouro fixo adicionais nos mapas atuais. |
| Reserva por capacidade cheia | Não é categoria nem novo teste de chance | Guarda quantidade devida de ouro/itens já sorteados; entrega posterior não sorteia novamente. É distinta do fallback5 de tesouro vazio. |
| Variante rara de equipamento |2% **condicionados à peça sorteada**; não2% de toda batalha | Substitui a peça; nunca concede segunda. weapon3/4=Adaga/Espada curta rara, ATQ3/4 contra bases2/3; armor3/4=Couro/Malha rara, DEF4/7 contra3/6. Apenas+1, sem efeito especial. |
| Livros no ramo raro | Goblin1%/homem-lagarto2%, independentes do equipamento | Uma unidade de Livro de Cura5 ou Dardo6; aprendizagem real existente. Poções atuais2/3/4 restauram50 Vida/25 Mana/50 Vigor. |

O19% dos tesouros é só o componente normal de ouro: o fallback também pode dar ouro. Chance pequena não torna a quantidade fixa, e quantidade variável não implica mudar chance. Limite atual de equipamento **por origem** e agregação de vários inimigos permanecem conforme LOOT.md.

## Fontes locais e candidatos de conteúdo inicial

Consultados os PDFs ignorados `doc/wiki/`, todos com sufixo ` - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`: **Arena_Monsters** pp.6/13/17 confirma goblin19%/2–20, homem-lagarto23%/2–20, item de baixa qualidade25%, rato(?) — desconhecido. **Arena_Imperial Dungeons (quest)** p.3 descreve tesouros de Tharn, mas não confirma o fallback5, catálogo ou chances específicos usados aqui. **Arena_Potions** p.1, **Arena_The Known Spellbook** pp.1–3 e **Arena_Magic Items** p.1 fundamentam os candidatos abaixo. Fonte primária instalada já disponível para consulta: `Docs/Arena Codex Scientia.pdf`, seções *Magic Weapons* (PDF139) e *Bracelets, Belts, Torcs & Amulets* (PDF140/impressa133). Extrações somente em tmp/loot-review e tmp/m01-20-equip-fontes, ignorados; instalação intacta. Sem partida DOS nova ou pesquisa externa.

| Candidato futuro | Evidência e adequação / lacuna |
| --- | --- |
| Uma arma de inteligência OU amuleto de inteligência | Codex confirma armas mágicas e acessórios passivos que aumentam atributos. Proposta concreta: manter ATQ-base da arma e adicionar **MAT+2** (ou MAT+2 no acessório): beneficia Cura/Dardo existentes. Valor/conversão são adaptação, não transcrição. Escolher um exemplar em futura unidade, sem sistema de encantamento/fabricação/cargas. Amuleto exige item real para slot Acessório; arma preserva tipo/técnicas. Nenhuma frequência/localização inicial é confirmada pela fonte. |
| Arma que lança fogo ou possui elemento | Original distingue magia por uso de arma, não apenas ataque elemental. Requer contrato próprio de uso/custo/cargas; uma trait de fogo sozinha não garante efeito nas técnicas físicas de elemento explícito1. Não recomendar como simples troca de nome/trait nesta revisão. |
| Livro de Cura / Livro de Dardo de fogo existentes | Heal e Fire Dart são magias da fonte; **livros consumíveis são adaptação do projeto**, não drop original confirmado. Já produzem aprendizado útil, sem nível mínimo; manter como expansão mínima possível, sem afirmar que foram encontrados nos percursos relatados. Livro de Heal True exige nova magia e fica fora do próximo recorte. |
| Poção de Heal True, cura superior | Potions confirma que cura mais que Healing. Candidata de recuperação mais forte; valor adaptado ainda a decidir pelo consumo real. **50/100 na coluna da fonte são preços**, não quantidades curadas. Spellbook descreve Heal True25–50+5/nível, não uma poção de100PV fixa. Sem variante superior de Mana/Vigor confirmada nessa lista; não inventar catálogo equivalente por simetria. |
| Resistências, antídotos, levitação e artefatos | Existem nas fontes, mas não tornam automaticamente úteis os encontros atuais rato/goblin: não criar efeitos/inimigos para justificá-los. Não propor catálogo completo. Couro/malha não são encantáveis no original; placa é. Não renomear suas raras atuais como encantadas, nem importar restrições profissionais/raciais. |

São candidatos coerentes com os sistemas iniciais, **não prova de distribuição original na dungeon nem autorização de implementação**. Encantamento não retira defesa por definição; material, qualidade e efeito são conceitos distintos.

## Proposta mínima de ouro — não aplicada

| Regra | Intervalo proposto | Chance/condição |
| --- | --- | --- |
| Goblin / homem-lagarto | Manter **2–20** | Manter19%/23%; sem mexer no restante do loot. |
| Tesouro, resultado normal | Manter **2–20** | Manter a tabela usada atualmente. |
| Tesouro sem nenhuma recompensa positiva | **2–8**, uniforme, uma vez | Somente se o sorteio normal ficar vazio; garante ao menos um resultado positivo, não necessariamente item equipável. |
| Rato e ouro nativo | Sem novo ouro | Ausência de prêmio não exige fabricar um intervalo. |
| Valores já recebidos ou em reserva | Preservar exatamente | Sem reamostrar resultados anteriores. |

Fallback2–8 tem média5, preservando a média do antigo5 nessa condição, sem elevar todas as recompensas. É adaptação provisória, não dado do original nem equilíbrio demonstrado. A garantia é de recompensa positiva atribuída/concedida **ou reservada por limite de capacidade**; bolsa/inventário cheio não autoriza outro sorteio. Não acrescentar ouro garantido quando já houver poção, livro ou equipamento, nem somar prêmio fixo nativo. Novo resultado deve ser calculado na primeira concessão e guardado no mesmo recibo; reabrir resumo/carregar/entregar reserva usa o valor salvo.

## Variantes raras e saves existentes — proposta, não aplicada

Preservar IDs3/4 de Weapons e Armors, valores, tipos, equipabilidade, aparência e técnicas de peças existentes. Não reutilizar IDs para um encantamento, apagar entradas, converter inventário/equipamentos ou conceder compensação automática. Recibos históricos/pending também referenciam esses IDs: não ressorteá-los nem transformar reservas em itens diferentes. Ouro5 de tesouros antigos continua5. Nenhum namespace novo.

Em futura unidade de conteúdo, retirar gradualmente as quatro variantes genéricas **dos novos sorteios**, mantendo-as como legado nos saves; não rebatizá-las de encantadas. Novos itens semanticamente diferentes devem ter IDs novos e efeito documentado/testável, mantendo a regra de substituir a peça elegível, não conceder outra. Livro aprendido ou consumível com recuperação superior já é conteúdo concreto; flag rara não precisa significar equipamento. Sem candidato aprovado, é melhor suspender só a variante genérica nos sorteios futuros do que fabricar um encantamento fictício. Essa retirada e os candidatos acima exigem autorização separada; não entram no recorte de ouro.

## Origem das configurações e único próximo recorte

Não encontrado gerador dedicado das tabelas ArenaLoot/variantes nos scripts versionados consultados: JSONs são a configuração direta. `tools/build-quests.cjs` lê ArenaQuests e recompõe eventos, preservando a configuração; `build-dungeon-map.py` posiciona tesouros/objetos sem calcular valores. `assert-loot-extensions.cjs` fixa o formato histórico das variantes+1; validadores/fixtures contêm as expectativas do fallback5. São testes, não fonte de regra; atualizar somente os afetados quando uma mudança for autorizada. Não executar geradores para esta revisão.

**Próximo recorte único proposto: tornar variável apenas o fallback de tesouros vazios (2–8), mantendo tabelas/chances/inimigos/raras/catálogo atuais.** Substituir a configuração escalar por intervalo, preservando recibos e reservas antigos; manter compatibilidade de chamadas/configurações legadas que informavam5, sem deixar o novo fluxo normal criar prêmio fixo. Verificar extremos2/8, vazio/resultado positivo, repetição/resumo/save/load, capacidade cheia e concorrência de recompensa, com dados sintéticos. Corrigir fonte de configuração e expectativas focais, sem refazer mapas/assets ou alterar economia por outra família no mesmo recorte. **Aguardar autorização; nada implementado nesta entrega.**
