# Habilidades e progressão

## Diretrizes confirmadas

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

O mapeamento técnico para TP ou para um recurso próprio ainda será escolhido. Se TP for utilizado, seus comportamentos nativos devem ser ajustados quando conflitarem com o conceito de Stamina. Não há regeneração passiva. A recuperação ocorre por poções ou camas; inicialmente uma cama restaura todo o Vigor, junto com vida e mana. Máximo e custos serão balanceados durante a feature.

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

A progressão de vida, mana e Stamina segue direção semelhante à de Skyrim, conforme PERSONAGEM.md; a regra concreta será definida na feature. Demais regras não especificadas seguem o padrão aplicável do MV, sem restaurar profissões do original. A implementação e o balanceamento ainda não foram realizados.
