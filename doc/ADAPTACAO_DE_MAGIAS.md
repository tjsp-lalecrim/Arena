# Catálogo de magias e triagem para 2D por turnos

## Fonte e método

Catálogo-base: Arena_The Known Spellbook, páginas 1–5, e Arena_Magical Effects, páginas 2–5, PDFs da UESP em doc/wiki/. A consulta foi textual. Esta triagem analisa viabilidade; não autoriza excluir ou alterar automaticamente uma magia.

Inventariar cada magia com nome original, tradução pt-BR, efeito, alvo, custo original, requisitos adaptados, disponibilidade na Guild e/ou livros e estado de implementação. Os custos finais de loot, compra e uso serão balanceados por testes, partindo das referências da wiki.

## Diferença importante entre original e adaptação

The Known Spellbook, página 1, informa que os grupos de circinate não são bloqueios rígidos por nível no original. A exigência de nível para aprender na Guild é uma regra da adaptação solicitada pelo responsável e deve ser identificada assim. Os níveis concretos serão configurados na feature, sem inventar que são exigências originais.

## Triagem inicial

| Grupo / exemplos da fonte | Avaliação | Encaminhamento |
| --- | --- | --- |
| Dano elemental: Fire Dart, Fireball, Ice Bolt, Shock | Adaptável por alvo e elemento | Converter alcance e explosão em seleção de alvo individual ou grupo, com custos e dano balanceados |
| Cura e estados: Heal, Heal True, Cure Poison, Free Action, Silence, Medusa's Gaze | Adaptável com estados e recuperação | Revisar durações, chances e relação com os atributos da adaptação |
| Proteção: Resist Fire, Resist Cold, Shield, Force Wall, Spell Shield, Shalidor's Mirror | Adaptável, alguns efeitos exigem plugin próprio | Definir barreira, resistência e reflexão sem copiar bugs ou exploits do original |
| Atributos e dano contínuo: Orc Strength, Strength Leech, Wildfire, Wyvern's Sting, Troll's Blood | Adaptável com conversão de escala e duração | Não tratar um round do original como um turno MV sem conversão documentada; proibição de regeneração passiva de Stamina não proíbe automaticamente efeito ativo de cura de vida |
| Passwall, Earth Wall, Pitfalls | Sem adaptação direta ao combate padrão | Exigem regras de alteração de cenário ou substituição explícita do efeito; não destruir paredes ou pisos de quest sem validação |
| Levitate | Não se traduz diretamente pela visão superior | Possível travessia de regiões sinalizadas ou regra especial; depende de mapas e escopo, não é tecnicamente impossível |
| Light, Wanderlight | Uso depende de iluminação e exploração | Light pode apoiar visibilidade; luz em projétil de Wanderlight não possui equivalente direto no combate por turnos |
| Open, Wizard Lock | Predominantemente exploração | Integrar portas/recipientes e seus estados; preservar travas de quest que não devam ser ignoradas |
| Invisibility, Sanctuary | Exigem revisão de detecção e alvos | Possível efeito de exploração ou proteção em combate, mas não presumir bloqueio total de contato ou fuga permitida |
| Stamina, como nome de magia no catálogo | Conflito com as fontes de recuperação atuais do projeto | Não implementar recuperação de vigor por magia enquanto a regra confirmada for somente poções e camas; registrar a omissão ou propor adaptação sem aprová-la automaticamente |
| Lightning e Toxic Cloud, componentes de dano à fadiga | Possível conflito com gasto de vigor somente por técnicas | Preservar o inventário original, mas revisar esses componentes antes de implementar; não introduzir drenagem de Stamina por inimigos sem avaliar a diretriz |

Nenhuma magia foi classificada como absolutamente impossível em 2D. As ambientais e espaciais não são transposições diretas e podem ser adiadas ou adaptadas mediante decisão registrada. Não criar sistemas inteiros apenas para justificar um efeito fora do marco.

## Disponibilidade e aprendizado

Aprender magias com magos da Mages Guild de acordo com o nível, ou por livros obtidos. Livros são consumíveis de uso único, sem requisitos mínimos; podem cair de inimigos ou baús conforme dificuldade. A Guild mantém aprendizado condicionado ao nível, sem estender essa exigência aos livros. Preços e pesos de drop serão balanceados.

The Known Spellbook, páginas 4–5, distingue magias descritas no manual de magias realmente vendidas na Guild. Registrar essa disponibilidade por magia, sem tornar o catálogo inteiro comprável por padrão. Spellmaking não está aprovado como sistema do projeto apenas por constar nas fontes.


## Análise adicional: magias ambientais em múltiplos alvos

Avaliar os efeitos ambientais como candidatos a magias de múltiplos alvos. Isso é uma tarefa de adaptação, não a aprovação de trocar todo efeito por dano em área. Para cada magia, registrar identidade original, efeito proposto, alvos, duração, custo, impacto no balanceamento e eventual função de exploração perdida.

Como hipóteses a prototipar: luz pode revelar ou afetar vários alvos ocultos; efeitos de parede podem virar proteção para múltiplos alvos ou alteração de condições da arena; levitação pode oferecer proteção contra efeitos terrestres a vários alvos. São propostas, não efeitos aprovados nem descrições do original. Open e Wizard Lock podem continuar inadequadas à conversão em combate; justificar cada caso e evitar magias redundantes.
