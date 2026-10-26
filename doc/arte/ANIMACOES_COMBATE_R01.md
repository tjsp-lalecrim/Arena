# Animações M01-10 R01 — candidatos para revisão

26/10/2026. Aprovação R05 dos assets anteriores preservada; não estendida automaticamente às novas folhas. Nenhum retrato/exploração foi substituído. M01-10 permanece em validação da apresentação, sem aprovação manual nova.

19 folhas RGBA, cada uma com12 quadros distintos: espera/ação/dano/derrota, três colunas por estado.16 combinações de raça/gênero e rato/goblin/homem-lagarto. A ação do jogador é corporal genérica, sem lâmina visível: não declarar suporte a animações específicas de arma/conjuração. Revisar continuidade/apoio e representação do equipamento antes do fechamento integral. Referências de perfil e kit estão separadas da lógica em ArenaBattle.json; sem fallback estático para perfil ausente.

Manifesto COMBATE_M01_10_MANIFEST.json: fontes/exportações/prompts com SHA256, dimensões/células/apoio e caixas alfa dos228 quadros. Prompts completos em PROMPT_COMBATE_R01_* e correções R02/R03; ferramentas image_gen internas, sem vozes. Cada registro contém as referências efetivamente fornecidas. Folhas de origem e versões rejeitadas para recorte preservadas em art/masters/combate-r01/.

Fontes: imagens laterais r02 das16 identidades aprovadas com ressalvas, rato_bote_r03 aprovado; Goblin p.6/imagem1 e Lizard Man p.13/imagem1 do PDF local Arena_Monsters, extraídos somente em tmp/original-review/monsters ignorado. O original orienta silhueta/equipamento/cor; volumes, acabamento e movimentos são interpretação IA. Não afirmar associação a arquivos CFA/DFA não decodificados nesta rodada. Nenhum sprite original é distribuído como asset final.

Piloto Bretã/rato validado primeiro no Scene_Battle antes da expansão. Componentes conexos isolam figuras sem amputar partes; alfa≤16 limpo, redução pré-multiplicada e escala única por participante. R01 e R02 Bretão masculino ainda tinham duas figuras de derrota unidas: nova tira IA R03 substitui somente esses movimentos, normalizada à densidade da fonte R02. Homem-lagarto R02 separa tridente/figuras encostadas. Operações técnicas não desenham novas poses.

Pranchas combate-contato-r01-1.png a5: identificação externa, atores em células nativas128×112; inimigos reduzidos para caber em128×112, inspecionados também nas capturas nativas de batalha. Sem linhas/rótulos nos PNGs finais. Transparência, margens, unicidade e hashes auditados por tools/audit-battle-assets.py; não provam anatomia/estabilidade isoladamente. Cobertura real e limites em COMBATE_M01_10.md/evidencias/m01-10. Editor/NW.js, Galaxy A56 e manual do responsável pendentes.
