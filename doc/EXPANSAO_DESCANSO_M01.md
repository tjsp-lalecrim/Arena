# Expansão de descanso — 40 pontos

29/10/2026, **feature/m01-expansao-descanso**, criada de develop 5659763. Feature de loot preservada em ce1a608, incluindo ouro e234044, sem importar suas alterações. **Responsável adiou a aprovação manual do ouro variável para o próximo teste integrado:** não solicitar teste isolado nem registrar aprovação antecipada. Esta branch conserva a base integrada anterior de loot.

## Seleção e fontes

**39 pontos novos; 40 incluindo o piloto.** Reutilizadas investigação 0afb6b8 e fontes em POCOES_E_DESCANSO_M01_17.md: START.INF/TEXT6 recomenda refúgio elevado; wiki local Imperial Dungeons p.5/Hints p.2 descreve redução de risco com ressalvas. Planta START.MIF MAP1/FLOR já interpretada em mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json e ArenaDungeon.integration.platforms. Sem nova observação DOS ou alegação de imunidade individual; interação e recuperação integral são adaptações aprovadas.

Cada ponto corresponde a plataforma explicitamente mapeada `^`, apoio seco/acessível e contexto de parede/recuo, sem sobrepor fontes de quest/tesouro/Gate. 41 células formam 17 grupos adjacentes, mas a inspeção em escala real confirmou sprites de plataforma distintos; por isso cada plataforma adequada recebe interação própria, sem deduplicar por grupo. **Exclusão:** fonte(46,20), tile(142,64), plataforma da Chave de rubi, para preservar pista/interação sem comando concorrente. Elevações decorativas/objetos sem essa classificação não são autorizados por aparência.

Todos os 40 apoios e aproximações são secos. 20 têm rota inteiramente seca desde o início; os demais 20 exigem trecho de natação já existente, sem novo custo/regra. Patrulhas podem aproximar-se; não existe detecção de ameaça ou garantia de segurança absoluta.

## Locais no Map008 — M01-14 Imperial Dungeons

Coordenadas MV (x,y), base 0. Em cada linha, combinar y com os x na ordem dos sufixos. IDs = `MQ01.refuge.NN`. Piloto 01/evento 241 intacto; novos 02–40/eventos 242–280, nomes **Refúgio / descanso NN**.

| y | x | Sufixos |
| --- | --- | --- |
|10|37,40|02,03|
|34|73,76,142|04,05,06|
|37|73,76,142|07,08,09|
|46|136|10|
|49|118,121,136|11,12,13|
|52|136|14|
|70|43|15|
|73|43|16|
|76|43|17|
|79|106,124,127|18,**01**,19|
|82|106|20|
|85|28,97,106|21,22,23|
|88|28,97,106|24,25,26|
|91|73,76,97|27,28,29|
|94|73,76|30,31|
|109|16,22|32,33|
|115|52,55|34,35|
|118|52,55|36,37|
|127|64,67|38,39|
|133|115|40|

## Implementação e verificação focal

ArenaRecovery.json é a lista explícita; dungeonRefuge=true distingue novos pontos e dungeonPilot mantém o acesso técnico 01. Arena_Recovery 0.5.0 escolhe o refúgio configurado mais próximo (desempate pelo evento), reutilizando indicação, Enter/clique/toque, soltura obrigatória, feedback de barras e validações de usePoint/restAt/ArenaResources.rest. Mesma recuperação completa dos máximos reais, só fora de batalha, sem itens, cura fictícia em recursos cheios, fade, horas, surpresa, regeneração ou respawn parcial.

Saves sem eventos novos ganham somente as instâncias configuradas, sem cura ao carregar/reset do mundo. IDs/contratos de recursos e namespaces preservados. build-quests.cjs reconstrói os 40 eventos; build-encounters.cjs reconhece suas notas configuradas, sem relaxar o bloqueio a eventos alheios. Duas reconstruções em fixture foram idênticas. Grade, propriedades e todos os 242 registros anteriores são semanticamente iguais à base; apenas 39 eventos não bloqueantes/sem sprite acrescentados. Sem gerar assets ou alterar quests, colisões, tesouros ou condições de respawn.

[Evidência](evidencias/descanso-expansao-r01/resultado.json): Chrome 156.0.8078.73 isolado, quatro grupos. Auditoria de seleção/exclusão/IDs e passabilidade/colisão nativa dos 40 pontos; para aferir conectividade, portas abertas e colisão transitória de patrulhas ignorada **só na fixture**. Não equivale a caminhada manual por 40 posições. Três amostras: 01(124,79),21(28,85),40(115,133), com passo nativo, Enter/tecla mantida, recuperação, bloqueio de batalha, clique no alvo próximo e save/load. Save sem eventos novos os recebe sem recuperar recursos. Quest/inventário/progressão/recibos/tesouro coletado/inimigo derrotado/área intactos. Capturas 21/40 inspecionadas a 816×624. Reutilizadas evidências válidas do piloto Enter/toque; sem teste redundante de recuperação em cada plataforma.

Não executados campanha completa, combate, autoria MV ou aparelho físico nesta entrega. Nova expansão aguarda avaliação integrada do responsável; aprovação do piloto não se estende automaticamente aos 40 locais. Servidor/perfil do teste descartáveis, sem saves pessoais. Sem merge/push/Pages.

## Próximo teste integrado — roteiro curto

1. Após abrir a cela, usar (124,79) e, se passar, a vizinha (127,79), agora com ponto próprio. Com recursos gastos, conferir três máximos, nenhum item consumido e soltura antes de novo uso.
2. Durante exploração de outro setor, experimentar um novo ponto, por exemplo (28,85) ou (115,133), por Enter e clique/toque; não é necessário testar todos para revalidar o comportamento compartilhado.
3. Salvar/carregar: recursos preservados, sem descanso automático, retorno de tesouros ou inimigos. Ouro variável será avaliado quando a feature de loot também estiver na versão integrada; não antecipar aprovação.

Somente esta expansão foi iniciada. Demais melhorias/estudos permanecem fora da entrega; M01 não concluído.
