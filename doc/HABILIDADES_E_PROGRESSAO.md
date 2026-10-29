## Distribuição de atributos — núcleo autorizado M01-20

Parâmetros provisórios implementados na feature: três pontos desde nível2, +1 por ponto nos seis atributos, saldo acumulável e concessão retroativa única. Escolha de Vida/Mana/Vigor permanece independente; sem crescimento automático adicional, cura, redistribuição ou restrição racial/profissional. [Fonte operacional e API](plugins/Arena_Attributes.md). Interface definitiva e equilíbrio ainda não entregues; não transferir fórmula/conjuntos E05 por associação.

# Habilidades e progressão

## Revisão de progressão por marco

Em cada marco, registrar um quadro curto: níveis e equipamentos esperados; fortalecimento frente ao anterior (inclusive contra inimigos antigos); utilidade de construções físicas/mágicas/híbridas; contribuição efetiva dos seis atributos e raças; desafio e disponibilidade de poções/descanso. M01 valida somente a faixa inicial, sem extrapolar o equilíbrio para toda a campanha. Preservar escolha de recursos, pontos distribuíveis e liberdade de equipamento. Skyrim orienta complementarmente liberdade/fortalecimento, sem importar evolução por uso, perks ou escalonamento.

**Avaliação e ajuste ao final de cada marco é diretriz aprovada**, não apenas estudo: M01-20 e M02-BAL–M10-BAL. Processo/registro manual de percurso em [AVALIACAO_BALANCEAMENTO_POR_MARCO.md](AVALIACAO_BALANCEAMENTO_POR_MARCO.md); não exigir matriz completa de combinações. O teste parcial de E05 não aprova parâmetros para campanha.

Separar requisito de parâmetro experimental. Valores, fórmula e agrupamentos continuam sujeitos a aprovação para campanha; [E05](PILOTO_E05_M01_20.md) foi autorizado/implementado somente no laboratório. Não anular ganhos por escalonamento automático. Antes de aplicar mudança futura, definir compatibilidade/migração, preservar alocações, equipamentos e recursos gastos, sem concessões duplicadas nem troca do namespace web por ajuste de balanceamento. Nenhum save é alterado por esta diretriz.

## Requisito solicitado — distribuição de atributos (M01-20/S03)

Ao subir de nível, conceder pontos distribuíveis em **ATQ/DEF/MAT/MDF/AGI/SOR**, adicionais à escolha aprovada de Vida/Mana/Vigor. **Solicitado, ainda não implementado**: [S04](ESTUDO_ESCALA_PROGRESSAO_M01_20_S04.md) compara1/2/3 pontos (+1 cada), recomenda3 para piloto, sem aprovação;1 é apenas referência. Saldo/retroatividade/redistribuição continuam propostas de S03. Não criar curva automática duplicada, classes jogáveis ou restrições raciais de equipamento. Recursos preservados; interface posterior.

## Diretrizes confirmadas

Estado operacional M01-09 R01: implementados desarmado3/4, adaga5/6 e espada7/8 por equipamento, custos5/12 Vigor pelo consumidor M01-08, magias Cura9/Dardo10 com Mana8/6 e livros5/6 transacionais. Revalidação no início de ações nativas e atalhos técnicos incompatíveis invalidados, sem barra nova. Guild, fontes de loot e apresentação de batalha continuam futuras. Escopo/roteiro em HABILIDADES_M01_09.md; valores provisórios, P01–P08 e arte preservados.

- As habilidades físicas são liberadas conforme a arma utilizada.
- Vigor representa Stamina e é gasto somente em combate, através de técnicas.
- Magias são aprendidas com magos da Mages Guild, tendo o original como referência de conteúdo e regras a consultar.
- Também existirão livros que ensinam magias, como adaptação inspirada nas mecânicas modernas de Skyrim.
- Não haverá classes profissionais de Arena; preservar liberdade de combinar equipamentos, itens, habilidades e estratégias.

## Técnicas e armas

Definir um vínculo explícito entre arma e técnicas disponíveis. Equipar, substituir ou remover uma arma deve recalcular as técnicas habilitadas e atualizar os menus e atalhos. Revalidar esse vínculo ao executar a técnica, impedindo o uso por um atalho que tenha se tornado inválido após a troca.

O acesso por arma não deve reintroduzir bloqueio de equipamento por raça ou profissão. Regras de acesso a uma técnica e permissão para equipar uma arma são conceitos distintos.

As técnicas são vinculadas ao tipo de arma e consomem Vigor. Exemplos iniciais fornecidos pelo responsável: adaga e espada permitem corte e estocada; arco permite disparo. Definir na feature a lista de movimentos de cada tipo, seus custos e como funcionam desarmado, armas simultâneas e exceções. A vinculação por arma está confirmada; não presumir níveis de domínio, árvores de talentos ou aprendizado permanente de todas as técnicas vistas.

Cada tipo de arma deve oferecer no mínimo dois movimentos: leve e pesado. Os movimentos específicos e os custos serão avaliados durante o desenvolvimento. Leve/pesado descreve a execução; corte, estocada e disparo descrevem movimentos possíveis por tipo de arma, sem exigir que todos os tipos possuam todos eles.

## Stamina

As técnicas de combate que utilizarem Stamina terão custo explícito. Movimento no mapa, patrulha, navegação de menus e outras ações fora do combate não devem consumir esse recurso. Ataque básico e outras ações não devem receber custo de Stamina automaticamente apenas por serem ações físicas.

M01-08 escolheu recurso próprio, separado de TP. Não há regeneração passiva ou perda/reset ligada a TP. Poção4 restaura50 Vigor e a API/comando de cama restaura os três recursos integralmente fora de batalha. Inicial100 (+10 inicial Argoniano), evolução por escolha+10. M01-09 ativa técnicas3–8 somente em batalha, conforme equipamento, usando o mesmo paySkillCost. Seleção/cancelamento não paga; execução válida paga uma vez mesmo em múltiplos efeitos/alvos; indisponibilidade ou falta de saldo não paga. Não há outra rotina descontando a tag. Contrato de recursos em RECURSOS_E_PROGRESSAO_M01_08.md; integração em HABILIDADES_M01_09.md.

## Balanceamento de magias

Avaliar as magias durante o desenvolvimento e priorizar o balanceamento do jogo, usando ADAPTACAO_DE_MAGIAS.md como triagem. Não excluir efeitos automaticamente nem importar valores incompatíveis apenas para reproduzir o original.

## Aprendizado de magia

Criar dois meios de aprendizado: interação com os magos apropriados da Mages Guild, conforme o nível do personagem, e uso de livros de magia obtidos. Usar o catálogo da wiki e a triagem de ADAPTACAO_DE_MAGIAS.md. Consultar a instalação original e doc/wiki/ para os conteúdos e condições da Guild; registrar os livros como adaptação moderna, sem apresentá-los como regra original já verificada.

Livros de magia são consumíveis de uso único, sem requisitos mínimos de uso; podem ser obtidos como drops de inimigos ou baús, com disponibilidade conforme dificuldade do inimigo ou dungeon. Consumir uma unidade somente após ensinar a magia com sucesso. Registrar por fonte a magia ensinada e condições aplicáveis; preços e filiação da Guild seguem as fontes e as adaptações documentadas. Os detalhes podem ser definidos na feature a partir das fontes e da solução mínima compatível.

Validar o aprendizado antes de aplicar custo ou consumo. Quando a magia já for conhecida, informar a situação e evitar cobrança ou consumo acidental sem benefício. Salvar e carregar deve preservar as magias aprendidas. Trocar de arma não deve remover o aprendizado de magia por efeito incidental da atualização de técnicas físicas.

## Critérios de validação

- Duas armas de teste habilitam as técnicas correspondentes; trocar ou remover a arma atualiza menus e atalhos.
- Um atalho inválido não permite executar técnica incompatível com a arma atual.
- Técnicas que usam Stamina descontam o custo correto, uma única vez; fora do combate o recurso não é gasto.
- O aprendizado por mago e por livro disponibiliza a magia correta e persiste ao salvar/carregar.
- Uma tentativa repetida de aprender magia já conhecida não causa perda acidental de recursos.
- As regras de aprendizado não introduzem classes profissionais ou restrições raciais não aprovadas.

A progressão de máximos está implementada em M01-08: uma escolha de+10 em Vida/Mana/Vigor por nível, sem cura ou curvas HP/MP da classe; EXP/nível nativos. M01-09 integra técnicas/armas e livros do subconjunto Cura/Dardo. Aprendizado por magos da Guild continua em marcos posteriores de cidades; drops/baús de livros em M01-13. Encontros completos, animações e equilíbrio prático continuam M01-10/20. Não importar profissões/perks/peso.
