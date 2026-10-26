# Banco mínimo e convenções M01

M01-10 R02: ArenaBattleMotion.json v1 configura atlas/frames/durações/impacto/mãos por movimento, armas por wtype/empunhadura e cobertura parcial(1/16 personagem,1/3 inimigo). Camada visual lê arma nativa atual; relógio/bitmap ficam no Sprite e não entram no save. Sem mudança de schema persistente, banco, valores raciais ou pagamento de custos. Referência REVISAO_COMBATE_M01_10_R02.md.

Atualização M01-10 R01: ArenaBattle.json v1 mapeia16 baseVisualId e inimigos1–3 para folhas3×4/células/apoio/tempo, aliases explícitos de movimentos e kit técnico. Map007 tem encontros301 por interação, sem fuga/derrota permitida, self switch após vitória e reinício explícito. Barras consultam estado real; sem cópia persistente ou mudança de schema. Skills/Items/Enemies/Troops, valores raciais e consumidores anteriores preservados. Nenhum item novo no início da campanha. COMBATE_M01_10.md contém limites e validações.

Atualização operacional M01-09 R01: técnicas3–8 ativas com ocasião1 e disponibilidade derivada de arma/sem arma. Custos5/12 mantidos em ArenaVigorCost; Mana/Cura/Dardo e livros preservam IDs/valores. ArenaAbilities.json separa configurações; Map006 laboratório sem Battle Scene ou campanha. ArenaLearnSkill agora usa transação de aprendizado e consumo, sem requisito de nível. Não há livros no inventário inicial. Referência atual HABILIDADES_M01_09.md; afirmações antigas de tags sem consumidores/desativação abaixo descrevem a montagem inicial, não o estado vigente.

Versão de esquema 1; feature/m01-dados, 25/10/2026. Banco inicial para integrar as próximas features, não catálogo completo ou balanceamento final. Os dados nativos são editáveis pelo MV 1.6.1; ArenaCatalog.json é catálogo próprio, carregado pelo consumidor Arena_CharacterCreation em M01-07. Não há classes profissionais: Aventureiro é somente o registro técnico exigido pelo MV.

Atualização R05,26/10/2026: P01–P08 da auditoria R04 foram autorizadas e aplicadas como balanceamento provisório; referência/versionamento em decisoes/M01_07_APROVACAO_R05.json. ArenaCatalog mantém schemaVersion1 e identifica balanceVersion M01-07/R05/P01-P08. ArenaCharacterVisuals.rules.weaponSkillIds permanece1/5/6/7/8, excluindo3/4 desarmados. As16 referências visuais foram preservadas, com aprovação estética e ressalvas registradas. Pilotos R04B não substituem automaticamente as folhas ativas.

## IDs estáveis

| Tabela | IDs desta base | Uso |
| --- | --- | --- |
| Actors / Classes | 1 / 1 | Viajante / suporte técnico Aventureiro |
| Items | 1 | Chave de rubi, importante, única por regra da quest |
| Items | 2, 3, 4 | Poções de cura, restaurar poder, Vigor |
| Items | 5, 6 | Livros de Cura e Dardo de fogo |
| Weapons / weaponTypes | 1, 2 / 1, 2 | Adaga, espada curta / Adaga, Espada |
| Armors / armorTypes | 1, 2 / 1, 2 | Couraça de couro, cota de malha / Couro, Malha |
| Skills | 1, 2 | Ataque/defesa nas posições exigidas pelo MV |
| Skills | 3–4, 5–6, 7–8 | Leve/pesado: desarmado, adaga, espada |
| Skills | 9, 10, 11 | Cura, Dardo de fogo, mordida paralisante |
| States | 1, 2, 3 | Incapacitado (death nativo), Defesa, Paralisia |
| Enemies / Troops | 1, 2, 3 | Rato, goblin, homem-lagarto; um inimigo por tropa |
| Tilesets / Map | 1 / 1 | Diagnóstico vazio / laboratório técnico 17×13 |
| Animations | somente null | Nenhum efeito referenciado; arte/animação em M01-06/10 |

Não renumerar IDs existentes ao expandir. Novos registros usam próximo ID livre. Slots de equipamento: 1 Arma, 2 Escudo, 3 Cabeça, 4 Corpo, 5 Acessório; ambas as armaduras desta base são Corpo. Tipos são permissões técnicas, nunca raça/profissão. Todos os tipos cadastrados são equipáveis pela classe técnica. Não foi adicionado arco nem dual wield por associação: regras serão tratadas se o conteúdo os incluir.

Elementos: 1 Físico, 2 Fogo, 3 Frio, 4 Choque, 5 Magia. Tipos de habilidade: 1 Técnicas, 2 Magias. TP não é Vigor e seu display continua desligado. M01-08 implementa Vigor próprio, sem regeneração ou ligação com ganhos/reset de TP. Técnicas não geram TP.

Switches 1–4 reservados para Ria, porta aberta, MQ01 concluída e encerramento mostrado. Variáveis 1–3 reservadas para etapa/raça/gênero; nenhum evento usa esses campos ainda. M01-05 define a autoridade própria em Game_System via MV_StateStore/Arena_Persistence, conforme PERSISTENCIA_M01.md; os switches/variáveis permanecem reservados, sem espelhamento automático. Self-switches A/B/C/D seguem o padrão MV para eventos locais, nunca como única fonte do estado da quest. Notas previstas: ArenaRecord, ArenaQuest, ArenaUnique, ArenaVigorCost, ArenaWeaponType, ArenaVigorRestore, ArenaLearnSkill. Por enquanto são metadados; sem consumidor próprio. Não apresentar tag como funcionalidade implementada.

## Fontes e conversões

Todas as fontes abaixo estão em doc/wiki/, preservadas fora do Git. URLs e atribuição de traduções em MQ01_ESPECIFICACAO.md e nos PDFs UESP. Valores marcados adaptados são escolhas técnicas provisórias, não estatísticas transcritas.

- Imperial Dungeons (quest), p.3: chave de rubi; item 1 importante, preço 0, sem uso/consumo no menu. O uso pela porta é responsabilidade de M01-16; a tag Unique ainda não implementa saneamento.
- Base Weapons, p.2: Dagger 1–6 e Shortsword 1–8 de dano. Convertidos em ATQ +2 e +3; ataque base `max(1, 2*ATQ - DEF)`. Essa escala substitui o dano em tempo real e será balanceada; não importar peso/deterioração ou bloqueios de classe. Preço 0 indica item fora de comércio neste laboratório, não preço original.
- Base Armor, pp.1–2: couro -3 e malha -6 de armor rating convertidos em DEF +3/+6 na peça de corpo. A redução de chance de acerto original não equivale a DEF do MV; escolha provisória documentada. Visual por peça depende de M01-12.
- Potions, p.1: cura preço50/recupera50 Vida (adaptado), restaurar poder preço75/recupera25 Mana (quantidade nominal original em escala diferente), Vigor preço25/recupera50 (adaptado). Item4 ativado em M01-08, ocasião0, nota ArenaVigorRestore50; recuperação limitada ao máximo, sem efeito em TP. Sem distribuir loot de campanha.
- The Known Spellbook, pp.2–3: Fire Dart custo-base original 164/nível e Heal 125/nível; dano/cura variáveis por nível no original. Aqui Dardo custa 6 mana, dano `max(1,3*MAT-MDF)`, elemento fogo, alvo inimigo; Cura custa 8 mana e recupera `25+MAT`, alvo usuário, sem recuperar Vigor. Esses valores/alvos são adaptações para personagem único. Critérios de balanceamento em M01-09. Livros são adaptação moderna confirmada, de uso único, sem requisito de nível; efeitos nativos de aprender skill testados, mas aquisição por loot e integração final ainda pendentes.
- Técnicas são adaptações do projeto: leve5 Vigor, pesado12, fórmulas de ATQ2/3; desarmado, adaga e espada. M01-09 ativa ocasião1, disponibilidade por equipamento e revalidação no início da execução. Não concedidas por aprendizado permanente da classe. Consumidor de custo continua somente Arena_Resources.
- Monsters, pp.6/13/17: goblin HP 1–8, dano 1–5, EXP HP*5+60; homem-lagarto HP 10–20, dano 1–8, EXP HP*10+75 e paralisia; rato HP 1–6, dano 1–4, EXP HP*5+35 e doença. Convertidos para valores provisórios abaixo; doença ainda não adaptada, deve ser avaliada/documentada em combate antes de concluir M01-10. Paralisia: 25% por mordida e um turno, removida após batalha (adaptação). Não inferir equivalência de EXP original.

| Inimigo | HP | MP | ATQ | DEF | MAT | MDF | AGI | Sorte | EXP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rato | 18 | 0 | 5 | 2 | 0 | 2 | 9 | 5 | 15 |
| Goblin | 30 | 0 | 7 | 3 | 0 | 3 | 10 | 5 | 25 |
| Homem-lagarto | 55 | 0 | 10 | 5 | 0 | 5 | 14 | 5 | 50 |

Sem ouro ou drops nativos: loot por fonte deve respeitar seis categorias e um equipamento em M01-13. Probabilidades originais consultadas (goblin 19% de 2–20 ouro, 25% item de baixa qualidade; homem-lagarto 23% de 2–20 ouro, 25% item de baixa qualidade) são insumos, não tabelas já implementadas. Recompensa de EXP nativa é provisória. Fontes de item importante não dependem dessas tabelas.

Classe técnica conserva dados100 Vida/50 Mana,10 ATQ/5 DEF/8 MAT/5 MDF/10 AGI/10 sorte, constantes. M01-08 substitui a fonte de HP/MP máximos do ator1 por base e escolhas explícitas persistentes em ArenaProgression.json/arenaResources v1. Os outros parâmetros, EXP e modificadores continuam nativos, incluindo AGI Khajiit+1. Teto de Mana ampliado999→9999 para comportar98 escolhas sem truncar. Vigor100 (+10 Argoniano inicial),+10 por escolha, separado de TP. Valores provisórios; contrato em RECURSOS_E_PROGRESSAO_M01_08.md. Map005 é laboratório isolado, não nova área de campanha.

## Catálogo racial e visuais

ArenaCatalog.json inventaria as oito raças de Arena, províncias, páginas da fonte Races, bônus e duas combinações de gênero por raça. Não adiciona Imperial ou Orc jogáveis. Masculino/feminino correspondem às combinações de customização nas fontes; sem bônus por gênero. A base inicial usava visuais null; atualmente as16 chaves apontam para assets próprios existentes via ArenaCharacterVisuals, sem caminhos ausentes.

Bônus ativos R05: Argoniano initialResourceAdd/vigor+10 uma vez; Bretão magicDamageRate0,75; elfo negro weaponActionBonus/all/damageRate1,05/hit0,02; Alto elfo stateImmunity/3; Khajiit parameterAdd/6/+1; Nórdico damageElementRate/3/0,5, só dano; Redguard weaponActionBonus/melee/1,08/0,03; Bosmer weaponActionBonus/all/1/0,04. Acerto é soma de probabilidade, não percentual do atributo; dano é multiplicador de fórmula positiva, não pontos extras ou ATQ. Sem incrementos raciais por nível, saving throw, natação/escalada ou equipamento bloqueado. Vigor inicial existe; consumo/evolução são M01-08/09. Os valores R04 anteriores estão preservados na proposta imutável, não continuam como regra ativa.

## Validação e limites

`node tools/validate-data.cjs`: JSON, ID/índice, referências entre banco, permissões, fontes raciais, mapa e ausência de drops nativos. A checagem de fontes requer doc/wiki local; clones precisam repor referências pelo índice. `tools/test-boot.cjs` testa novamente boot e integração do banco com Game_Actor/Game_Action: quatro equipamentos permitidos, adaga/cota equipadas, cura e livro, rejeição nativa de livro já aprendido.

M01-04 pode concluir o banco mínimo sem afirmar M01-07/08/09/10/12/13 prontos. Nenhuma batalha ou aparência é atestada por esses testes. Sem animação/asset referenciado até sua integração; não usar combatentes vazios como arte final. O fluxo técnico continua disponível. Compatibilidade dos saves de desenvolvimento é limitada ao contrato explícito. O contrato de M01-05 está em PERSISTENCIA_M01.md: saves do laboratório sem a estrutura recebem defaults sem efeitos; não há promessa de compatibilidade com futuros schemas sem migração.

## Estado próprio implementado em M01-05

Plugins MV_StateStore e Arena_Persistence guardam contratos sem duplicar nome, inventário, equipamentos, magias, HP/MP, máximos nativos, nível ou EXP. Recursos próprios iniciam vazios; exemplo de Vigor no teste não é balanceamento nem mecânica M01-08. Identidade racial/gênero/visual inicia null. Aparência equipada será derivada, não snapshot visual salvo. MQ01 inicia etapa 0; fonte lógica MQ01.ruby-key aponta para item 1 nas etapas 10/20, sem evento de mapa ativado. Nenhum ID do banco foi alterado. IDs de inimigos/áreas nos testes são técnicos e não definem o mapa final. Contratos/API e limites em PERSISTENCIA_M01.md.

## Acréscimos da amostra M01-06

Map002 e Tileset2 são exclusivamente técnicos. B tem tile0 transparente (flag16), tile1 piso passável (flag0), tile2 parede bloqueada (flag15). Nenhuma tabela de personagem/itens/inimigos foi renumerada ou alterada. Os ícones da galeria não são ainda ícones do banco. Map001 e início padrão preservados. Imagens nativas do ator são atribuídas somente na entrada do mapa de amostra e limpas no evento de retorno; contratos próprios não recebem raça/visual obrigatório por essa visualização. Formatos em doc/arte/AMOSTRA_M01_06.md.

## Dados da galeria R04

Map003/tileset3 reservados para validação visual. Map001 e002 preservados. Folha B Arena_Prison_R04: tile0 transparente/flag16; pisos1,2,9,10 passáveis/flag0; paredes4,5,12,13 bloqueadas/flag15. O MV divide o B em metades de8 colunas: a segunda linha usa +8, não +16. `ArenaArtSamples.json` separa os perfis visuais e sequências da lógica do plugin. Dados derivados de animação não são persistidos; HP/inventário/imagens continuam nativos e contratos próprios inalterados. Não houve renumeração de itens, atores ou quests.

## Criação M01-07

Map004: chegada técnica provisória após criação, tileset3, sem dungeon final. ArenaCharacterVisuals.json v1:16 chaves estáveis `<race>.<gender>.base`, referências de character/face/picture/svActor e grupos/skills de arma. Actor1/Class1 preservados como suporte técnico; nenhum registro por profissão/raça ou restrição de equipamento. ArenaCatalog passa a ter labels pt-BR e application=derived-after-confirmation, sem confundir aplicado com flag global do catálogo. Estado runtime segue Arena_Persistence e namespace arenaCreation v1. Vigor inicial100 (110 Argoniano) é adaptação provisória, sem gasto/progressão M01-08. Nomes/equipamentos/atributos/imagens nativos não são duplicados.


## Apresentação M01-10 R03

ArenaBattleMotion.json agora cobre16 identidades/3 inimigos, sem modificar banco de habilidades/itens/armas/inimigos. actionMotion do homem-lagarto é bite para Mordida paralisante11; estudo de tridente não integrado. Clock/quadro/mão não são dados persistentes. System.versionId regravado pelo editor durante a validação de autoria. EXPANSAO_COMBATE_M01_10_R03.md registra células/fontes e doença original do rato ainda sem contrato no subconjunto, a avaliar em combate/balanceamento.


## Interface de batalha M01-11

ArenaBattleUI.json configura layout/slots/nomes curtos/ícones/formações; nomes/regras originais do banco preservados. Hotbar battle.1–8 usa os mesmos {kind,id}/null do contrato M01-05, sem novo schema. Dados de recursos continuam nas APIs anteriores/nativas; cache visual é transitório. Troops4 é somente trio técnico de inimigos1/2/3, Map007 evento7(13,8), reiniciado explicitamente pelo descanso. Nenhum novo inimigo, item ou valor de combate. Validadores comparam prefixos anteriores e mudanças exatas; System.versionId é a única alteração semântica extra produzida pelo roundtrip do editor.
