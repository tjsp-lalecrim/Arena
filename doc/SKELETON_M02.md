# Stonekeep — esqueleto, piloto de batalha V01

Base **cd63553**, feature `feature/m02-stonekeep-esqueleto`, derivada da feature de Stonekeep para preservar suas dependências ainda não integradas. **Unidade entregue: batalha somente**, divisão autorizada para manter um exemplar pequeno. Não há sprite de exploração, patrulha, contato nem estado persistente de encontro. Nenhum perfil lateral foi apresentado como caminhada. M02-04 não está concluído e a fonte do pergaminho não foi bloqueada.

## Fontes e adaptação

- Instalação original, somente leitura: `Docs/Player Guide.pdf`, página PDF88/impressa80, texto e figura de Skeleton: morto-vivo humano com espada, resistência a armas de lâmina, sem valor numérico nessa descrição. Página conferida visualmente; fontes substituídas pelo leitor PDF não alteram o texto consultado. Cache de texto existente em tmp/m01-20-equip-fontes também conferido. Sem observação de combate DOS nesta entrega.
- Wiki local `Arena_Monsters…pdf`, pp.17–18: sprite humano esquelético sem armadura/escudo, espada simples; tabela cita metade do dano de adagas/espadas/machados/arcos, Vida25–45, dano2–16, EXP=Vida×15+250 e loot desconhecido(?). Esses números são referência do original, **não parâmetros MV equivalentes**. A quantificação de50% vem da wiki, não foi comprovada no executável nesta rodada.
- O índice já existente do GLOBAL.BSA original declara SKELE1.CFA–SKELE6.CFA, SKEL01–03.IMG e SKELETON.VOC. Só nomes/associação nominal foram consultados; não se afirmou conteúdo decodificado nem extraiu um catálogo. Não gerar voz ou distribuir mídia original. Consultas/imagens ficam ignoradas em `tmp/skeleton-review`.

| Configuração do piloto | Valor / justificativa |
| --- | --- |
| Banco estável | Inimigo4, tropa5; registros anteriores preservados |
| Vida/Mana |45/0: primeira amostra dentro da faixa de Vida citada; sem inventar magia ou recurso inimigo |
| ATQ/DEF/MAT/MDF/AGI/SOR |9/4/0/4/9/5, **provisórios**, escala inicial do MV adaptado. Não são conversão direta de STR/AGI do original nem balanceamento aprovado |
| Ação |Atacar nativo, sem habilidade nova; HIT90% provisório como cadastro técnico existente |
| Resistência |Fator configurável0,5 sobre o dano positivo final de Atacar e técnicas concedidas pela arma cortante equipada. Adaga/tipo1 e espada/tipo2, somente tipos já disponíveis. Magias, cura, itens, técnicas desarmadas e outros inimigos não mudam |
| Arredondamento |Math.round após o processamento nativo, mínimo1 somente para dano antes positivo. Sem imunidade, nova fórmula global ou cobrança adicional |
| Recompensas |**0 EXP e tabela vazia somente no piloto técnico**; loot original desconhecido e escala de EXP de campanha ainda a configurar, sem inventar ouro/itens. Não é decisão de recompensa definitiva do esqueleto |

Exemplo focal, Bretã nível2/adaga: Atacar20→10, pesado33→17; Dardo de fogo20 preservado. Espada curta22→11 e pesado36→18; sem arma17 preservado. Críticos passam pelo mesmo fator após cálculo nativo. Não exige uma arma de outra categoria para causar dano. Fórmula da campanha/E05 e demais inimigos intactos.

## Arte e apresentação

Um mestre IA `art/masters/stonekeep-skeleton-v01/sheet-v01.png`,1536×1024,24figuras:6espera,6ataque,6dano/retorno e6queda. [Prompt e referências fornecidas](arte/skeleton-v01/prompt.json), [recortes, escala, hashes e âncoras](arte/skeleton-v01/exports.json), [perfil](arte/skeleton-v01/profile.json). Fonte de identidade: sprite da wiki18; acabamento/formato: atlas goblin aprovado, sem copiar cor/roupa/espécie. Sem armadura, escudo, chifres, olhos luminosos ou poderes inventados. Acabamento dos ossos/lâmina e coreografia são interpretação artística.

Exportação `img/enemies/Arena_Combat_skeleton_v01.png`,1152×512; células192×128, apoio120 e altura inicial88px. Mesma densidade para todos os quadros, incluindo a queda; margem/alpha válidos. Transparência conferida em composição opaca: fundo escuro aparente na prévia era RGB sob alfa, não backdrop pintado. Não foi apagado por cor. Desenhos diferentes/articulados, sem gerar movimento por translação de uma pose. Anatomia/silhueta/retorno e apoio inspecionados no motor e nos quadros do vídeo; aprovação estética ainda pendente.

Atlas canônico voltado à direita, como os inimigos existentes; Arena_BattleUI aplica o espelhamento único para colocá-lo à direita da batalha, **voltado à esquerda**. Espada está desenhada com a mão em cada quadro. Timelines nativas de movimentos/impacto reutilizadas, sem novo consumidor de dano/custo. Mestres/tilesets/participantes aprovados não foram alterados.

## Acesso determinístico e avaliação

`http://127.0.0.1:8774/` → **Ctrl+F5**, sem limpar dados → título **Stonekeep · esqueleto (RAM)**. Usar setas para alcançar a opção se a lista estiver rolada. Cria Bretã feminina nível2/adaga, recursos completos, técnicas da arma, Cura/Dardo e uma unidade das poções técnicas já existentes. Usa o preparo de combate aprovado, não o inventário inicial da campanha. Espada curta também fica no inventário técnico. Não carrega/edita saves pessoais.

1. Observar espera e orientação. Usar **Atacar**, depois **Habilidades → Estocada pesada — adaga**; observar preparação, impacto, retorno, resistência e Vigor12.
2. Usar **Dardo de fogo**: Mana6, sem redução cortante. Conferir reação/queda e retorno ao mapa após vitória. O RNG manual continua normal; não exigir os mesmos danos exatos da gravação controlada.
3. Retorna à passagem **Map012/(75,39)**, sem reaparecer ou bloquear a coleta. **Não há esqueleto visível no mapa nesta unidade.** O posicionamento de encontro real será especificado ao integrar exploração.
4. Checkpoint existente **Guardar/Carregar teste em RAM** preserva recursos/quest/recibos só nesta sessão; slots normais bloqueados. Voltar ao título e escolher a opção novamente reinicia o piloto, sem depender de drops/percurso.

O servidor desta entrega foi iniciado após confirmar porta8774 sem serviço: **PID28604**, somente127.0.0.1, permanece ativo. Para encerrar, conferir o PID e usar PowerShell `Stop-Process -Id 28604`. Script/logs locais em tmp/skeleton-review; não publicados.

## Validação e dependências restantes

[Resultado focal](evidencias/m02-skeleton-v01/resultado.json), [captura](evidencias/m02-skeleton-v01/batalha.png), [vídeo real≈17s](evidencias/m02-skeleton-v01/combate-normal.webm), [quadros1:1](evidencias/m02-skeleton-v01/video-quadros.png). Chrome156, motor MV1.6.1, canvas816×624. A gravação usa tempo normal do motor e30fps; RNG0,5 somente no teste para reproduzir ações sem falhas/críticos. Não acelerou animações ou turnos. Decodificação de inspeção acelerada não altera o vídeo entregue.

Oito grupos: abertura e acesso RAM; ações/custo único; resistência e críticos/isenções;6quadros observados de cada estado e impacto nativo; vitória/retorno sem repetição; recibo único sem EXP/drops; guardar/carregar recursos/quest/inventário/recibo em RAM; derrota nativa/game over (fixture isolada com jogador a1PV; não é avaliação de dificuldade). Vigor100→88 e Mana50→44. Sem erro JS/HTTP faltante. Validador existente de dados/IDs/referências passou; gerador idempotente e mapas/itens/armas/habilidades/participantes anteriores preservados. Não repetida a campanha ou outra bateria de gameplay. **Nenhum novo teste no editor ou Galaxy A56 realizado.**

Próxima dependência, **após avaliar este exemplar**: folha superior com caminhada real nas quatro direções, depois patrulha/contato e derrota persistente pelo núcleo existente, além da configuração de EXP/loot da campanha. Não marcar contato, persistência de encontro, respawn ou grupo completo como validados. Sem ghouls, lobos, novos mapas, entrega na corte ou bloqueio artificial da fonte. Não expandir arte antes da avaliação.

Reconstrução: `python tools/export-stonekeep-skeleton.py` monta pixels/perfil do mestre; `node tools/build-stonekeep-skeleton.cjs` aplica só os novos registros. O gerador Stonekeep/pai Rihad chama o segundo. Plugin próprio Arena_Skeleton após Arena_Stonekeep, dependências internas em [guia](plugins/Arena_Skeleton.md); sem plugin externo.
