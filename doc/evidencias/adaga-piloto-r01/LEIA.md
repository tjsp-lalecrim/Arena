# Bretã feminina / adaga — R01, 28/10/2026

Estado inicial112246d/feature/m01-narrativa-demo limpo. Aprovação recebida da espada (quatro comandos no editor) registrada em VALIDACAO_M01.md; não se estende à adaga.

- Única combinação: breton.female.base/arma1. Novos registros idle/light/heavy; nenhuma modificação nos PNGs, tempos, apoios da espada aprovada ou demais combinações.
- Acesso existente recebeu opção Teste da arma: Bretã / adaga; o teste passa pela tela de título/seleção e confirma arma1, Vigor100, rato500HP.
- before/resultado.json serve somente a configuração visual112246d, usando o novo acesso da adaga. after/resultado.json usa o ajuste atual. Atacar1/Corte leve5/Estocada pesada6/Defender2 nativos:22/22/34/0 dano e0/5/12/0 Vigor; um uso/efeito cada, seis poses, retorno ao repouso e tempo total igual. Aleatório0,5/variância0 só no contexto isolado, sem saves pessoais.
- Comparação de dados confirma que retirar apenas weaponPoses.breton.female.base.1 restaura112246d; espada e todas as outras identidades intactas. Tratamento de arma usa a âncora/escala próprias da adaga existente.
- comparacao.png e quadros before/after são capturas do canvas/recortes de revisão, não assets. after/breta-adaga-acoes.webm gravado em velocidade normal; video-inspecao.json documenta reprodução1× e decodificação real.
- inventario-poses.json é inspeção do Sprite de cast/item/defeat, não execução de magias, itens ou game over. Hurt observado no contra-ataque, sem alteração. Não há impedimento artístico concreto nas ações corrigidas.
- Teste reutilizado: tools/test-sword-pilot-actions.cjs com ARENA_PILOT_WEAPON=dagger e ARENA_SWORD_PHASE=before/after. Sem teste novo no editor ou telefone; avaliação da adaga pendente. Nenhuma geração, merge ou push.
