# Banco mínimo e convenções M01

Versão de esquema 1; feature/m01-dados, 25/10/2026. Banco inicial para integrar as próximas features, não catálogo completo ou balanceamento final. Os dados nativos são editáveis pelo MV 1.6.1; ArenaCatalog.json é catálogo próprio, ainda não carregado em runtime (consumidor será M01-07). Não há classes profissionais: Aventureiro é somente o registro técnico exigido pelo MV.

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

Elementos: 1 Físico, 2 Fogo, 3 Frio, 4 Choque, 5 Magia. Tipos de habilidade: 1 Técnicas, 2 Magias. TP não é declarado como Vigor; display TP desligado até implementar recurso próprio. Técnicas não geram TP. Não há regeneração configurada.

Switches 1–4 reservados para Ria, porta aberta, MQ01 concluída e encerramento mostrado. Variáveis 1–3 reservadas para etapa/raça/gênero; nenhum evento usa esses campos ainda. M01-05 definirá autoridade única do estado persistente; evitar duplicar progresso entre variáveis e dados próprios sem contrato. Self-switches A/B/C/D seguem o padrão MV para eventos locais, nunca como única fonte do estado da quest. Notas previstas: ArenaRecord, ArenaQuest, ArenaUnique, ArenaVigorCost, ArenaWeaponType, ArenaVigorRestore, ArenaLearnSkill. Por enquanto são metadados; sem consumidor próprio. Não apresentar tag como funcionalidade implementada.

## Fontes e conversões

Todas as fontes abaixo estão em doc/wiki/, preservadas fora do Git. URLs e atribuição de traduções em MQ01_ESPECIFICACAO.md e nos PDFs UESP. Valores marcados adaptados são escolhas técnicas provisórias, não estatísticas transcritas.

- Imperial Dungeons (quest), p.3: chave de rubi; item 1 importante, preço 0, sem uso/consumo no menu. O uso pela porta é responsabilidade de M01-16; a tag Unique ainda não implementa saneamento.
- Base Weapons, p.2: Dagger 1–6 e Shortsword 1–8 de dano. Convertidos em ATQ +2 e +3; ataque base `max(1, 2*ATQ - DEF)`. Essa escala substitui o dano em tempo real e será balanceada; não importar peso/deterioração ou bloqueios de classe. Preço 0 indica item fora de comércio neste laboratório, não preço original.
- Base Armor, pp.1–2: couro -3 e malha -6 de armor rating convertidos em DEF +3/+6 na peça de corpo. A redução de chance de acerto original não equivale a DEF do MV; escolha provisória documentada. Visual por peça depende de M01-12.
- Potions, p.1: cura preço 50, restaurar poder 75 e 25 pontos, Stamina preço 25. Cura restaura 50 de vida (adaptado); restaurar poder restaura 25 mana (mesma quantidade nominal, escala diferente); Vigor reservará 50 (adaptado). Poção de Vigor indisponível até M01-08; não usar TP nativo para fingir recuperação implementada.
- The Known Spellbook, pp.2–3: Fire Dart custo-base original 164/nível e Heal 125/nível; dano/cura variáveis por nível no original. Aqui Dardo custa 6 mana, dano `max(1,3*MAT-MDF)`, elemento fogo, alvo inimigo; Cura custa 8 mana e recupera `25+MAT`, alvo usuário, sem recuperar Vigor. Esses valores/alvos são adaptações para personagem único. Critérios de balanceamento em M01-09. Livros são adaptação moderna confirmada, de uso único, sem requisito de nível; efeitos nativos de aprender skill testados, mas aquisição por loot e integração final ainda pendentes.
- Técnicas são adaptações do projeto: leve custo planejado 5 Vigor, pesado 12, multiplicadores de ATQ 2 e 3; desarmado, adaga e espada. Mantidas indisponíveis (`occasion=3`) até custos/arma serem tratados em M01-08/09. Não concedidas por aprendizado permanente da classe.
- Monsters, pp.6/13/17: goblin HP 1–8, dano 1–5, EXP HP*5+60; homem-lagarto HP 10–20, dano 1–8, EXP HP*10+75 e paralisia; rato HP 1–6, dano 1–4, EXP HP*5+35 e doença. Convertidos para valores provisórios abaixo; doença ainda não adaptada, deve ser avaliada/documentada em combate antes de concluir M01-10. Paralisia: 25% por mordida e um turno, removida após batalha (adaptação). Não inferir equivalência de EXP original.

| Inimigo | HP | MP | ATQ | DEF | MAT | MDF | AGI | Sorte | EXP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rato | 18 | 0 | 5 | 2 | 0 | 2 | 9 | 5 | 15 |
| Goblin | 30 | 0 | 7 | 3 | 0 | 3 | 10 | 5 | 25 |
| Homem-lagarto | 55 | 0 | 10 | 5 | 0 | 5 | 14 | 5 | 50 |

Sem ouro ou drops nativos: loot por fonte deve respeitar seis categorias e um equipamento em M01-13. Probabilidades originais consultadas (goblin 19% de 2–20 ouro, 25% item de baixa qualidade; homem-lagarto 23% de 2–20 ouro, 25% item de baixa qualidade) são insumos, não tabelas já implementadas. Recompensa de EXP nativa é provisória. Fontes de item importante não dependem dessas tabelas.

Classe técnica com 100 vida, 50 mana, 10 ATQ, 5 DEF, 8 MAT, 5 MDF, 10 AGI e 10 sorte, constantes nos níveis. Isso impede crescimento nativo automático incompatível; não implementa a progressão Skyrim nem define valores finais de recursos. M01-08 adicionará aumentos explícitos persistentes. Crescimento não deve ser obtido duplicando ganhos ao carregar save.

## Catálogo racial e visuais

ArenaCatalog.json inventaria as oito raças de Arena, províncias, páginas da fonte Races, bônus e duas combinações de gênero por raça. Não adiciona Imperial ou Orc jogáveis. Masculino/feminino correspondem às combinações de customização nas fontes; sem bônus por gênero. Cada visual está null explicitamente: não apontar para arquivo ausente nem tratar a lista de 16 combinações como arte produzida.

Bônus catalogados, ainda não aplicados: Argoniano máximo Vigor +10% (adaptação da resistência na natação, sem implementar natação); Bretão recebe metade do dano mágico; Elfo negro floor(nível/4) de dano/acerto com arma; Alto elfo imune ao estado 3; Khajiit AGI +5% (adaptação da escalada, sem novo sistema); Nórdico metade do dano de frio; Redguard floor(nível/3) corpo a corpo; Elfo da floresta floor(nível/3) com arco. Acerto usa pontos percentuais e dano usa pontos na nova escala, números a balancear. Resistências sem salvaguarda adicional, pois não há saving throw equivalente no MV. O bônus de arco permanece sem uso até haver arco no recorte. Nenhum bônus bloqueia equipamento. M01-07 aplica os bônus; M01-08 provê o recurso de Vigor. As adaptações de exploração evitam criar sistemas de natação/escalada fora do marco.

## Validação e limites

`node tools/validate-data.cjs`: JSON, ID/índice, referências entre banco, permissões, fontes raciais, mapa e ausência de drops nativos. A checagem de fontes requer doc/wiki local; clones precisam repor referências pelo índice. `tools/test-boot.cjs` testa novamente boot e integração do banco com Game_Actor/Game_Action: quatro equipamentos permitidos, adaga/cota equipadas, cura e livro, rejeição nativa de livro já aprendido.

M01-04 pode concluir o banco mínimo sem afirmar M01-07/08/09/10/12/13 prontos. Nenhuma batalha ou aparência é atestada por esses testes. Sem animação/asset referenciado até sua integração; não usar combatentes vazios como arte final. O fluxo técnico continua disponível. Saves de desenvolvimento não têm compatibilidade garantida; M01-05 formalizará o contrato antes de distribuir testes externos.
