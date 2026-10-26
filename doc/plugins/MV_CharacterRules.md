# MV_CharacterRules 0.1.0

Arquivo js/plugins/MV_CharacterRules.js. Funções puras, sem parâmetros, plugins externos, banco, estado ou aliases do MV. Deve preceder o consumidor Arena_CharacterCreation.

- `name(value,max=20)`: normalização Unicode NFC, trim, agrupamento de espaços e validação de comprimento por caracteres Unicode; recusa vazio, controles e backslash. Retorna string, ou lança Error pt-BR. Não trunca ou interpreta comandos.
- `traits(bonus)`: retorna lista nova para elementRate(code11), stateImmunity(code14), agilityMultiplier(code21). Outros kinds retornam[]; o consumidor decide o que fazer.
- `weaponBonus(bonus,level,group)`: floor(level/divisor) para weaponLevelBonus compatível com group ou all; zero quando ausente/incompatível. Sem escolher habilidades ou equipamentos.

Reutilização: `{kind:'weaponLevelBonus',divisor:3,weapon:'bow'}` e `weaponBonus(bonus,6,'bow')` resulta2, sem conhecer Arena. `name('  Ana  ',20)` retorna Ana. Não há campos salvos, arquivos de conteúdo ou hook de carregar.

Testes de nome/NFC/controle/limite em test-character-creation.cjs; tipos de traits e bônus exercitados nos16 cenários nativos e helper de grupo. Documentação da integração em Arena_CharacterCreation.md.
