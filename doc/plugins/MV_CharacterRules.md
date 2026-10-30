# MV_CharacterRules 0.2.0

Arquivo js/plugins/MV_CharacterRules.js. Funções puras, sem parâmetros, plugins externos, banco, estado ou aliases do MV. Deve preceder o consumidor Arena_CharacterCreation.

- `name(value,max=20)`: normalização Unicode NFC, trim, agrupamento de espaços e validação de comprimento por caracteres Unicode; recusa vazio, controles e backslash. Retorna string, ou lança Error pt-BR. Não trunca ou interpreta comandos.
- `traits(bonus)`: retorna lista nova para stateImmunity(code14). Suporte legado elementRate(code11)/agilityMultiplier(code21) mantido para fixtures; catálogo atual não usa esses dois kinds.
- `initialResource(bonus,resourceId,base)`: soma `value` para initialResourceAdd do recurso indicado; caso contrário retorna base. O consumidor controla a concessão única. Não escreve estado.
- `parameterBonus(bonus,paramId)`: retorna `value` para parameterAdd do parâmetro indicado, ou0. Consumidor aplica em paramPlus, sem armazenar raça em atributos nativos.
- `weaponModifiers(bonus,group)`: retorna `{damageRate,hit}` para weaponActionBonus compatível com group ou all; caso contrário `{damageRate:1,hit:0}`. `hit` é fração de probabilidade (+0,02 =2 p.p.), não percentual do atributo HIT. Sem nível, IDs de armas/habilidades ou estado MV.
- `weaponBonus(bonus,level,group)`: API histórica de floor(level/divisor), preservada para testes de composições antigas; não usada pelo consumidor atual.

Reutilização atual: `{kind:'weaponActionBonus',weapon:'all',damageRate:1.05,hit:.02}` e `weaponModifiers(bonus,'bow')` retorna1,05/0,02, sem conhecer Arena. `name('  Ana  ',20)` retorna Ana. Não há campos salvos, arquivos de conteúdo, dependências externas ou hook de carregar. Regras aprovadas provisoriamente P01–P08 em decisao M01_07_APROVACAO_R05.json.

Testes de nome/NFC/controle/limite em test-character-creation.cjs; test-approved-races.cjs cobre contratos puros e integração nativa,16 combinações, seis níveis e oito saves reais anteriores. Documentação da integração em Arena_CharacterCreation.md. Balanceamento prático permanece nos futuros M01-10/20.
