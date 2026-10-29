# Espada piloto R02 — 28/10/2026

Base4b49e5d, feature/m01-narrativa-demo, inicialmente limpa. Aprovação manual anterior do piloto/Estocada pesada no editor registrada em VALIDACAO_M01.md, sem extensão aos ajustes R02.

- Única combinação: Bretã feminina/espada curta2. Sem assets, mapas ou runtime alterados; apenas configurações de espera/light.
- before/resultado.json e after/resultado.json: três comandos nativos Atacar1, Corte leve7 e Defender2, por acesso técnico existente, armazenamento isolado.24/24/0 dano,0/5/0 Vigor; um uso/efeito por comando, retorno ao repouso. Uma expectativa inicial de dano23 no teste foi corrigida para24, observado na base, sem alterar o jogo.
- PNGs por quadro e comparacao-leve.png são capturas reais/recortes de revisão, não assets. Vídeo after/breta-espada-acoes.webm:13s, velocidade normal, sem acelerar/diminuir o motor. video-inspecao.json contém reprodução1× e tempos de amostras reais decodificadas.
- inventario-poses.json: inspeção de Sprite de cast/item/defeat, explicitamente sem execução de ações; não comprova mana, itens ou game over. Hurt observado no contra-ataque nativo, sem novos ajustes. Heavy é comparado por dados, não reexecutado nesta tarefa.
- after confirma que remover apenas os novos registros idle/light restaura integralmente a configuração4b49e5d. PNGs e código de batalha permanecem intactos. Teste nativo: tools/test-sword-pilot-actions.cjs (ARENA_SWORD_PHASE=before serve configuração histórica, sem trocar o checkout; after é o padrão).
- Ajustes R02 aguardam avaliação do responsável. Editor/mobile não executados pelo Codex nesta tarefa. Sem merge/push.
