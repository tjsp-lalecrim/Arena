# Avaliação de mapa de orientação e bússola de objetivos

Avaliação em 25/10/2026. A inclusão está em análise: não é uma funcionalidade aprovada automaticamente nem foi implementada ou testada. “Mapa de guia” é interpretado aqui como mapa local consultável, com minimapa como opção complementar; não implica mapa mundial ou viagem rápida.

## Momento da decisão

O responsável definiu que a inclusão deste recurso opcional será decidida nos próximos marcos, após o M01. Esta avaliação permanece como referência; não autoriza implementação imediata nem cria dependência para a demo. Nenhum marco específico foi designado para a decisão.

## Conclusão

É tecnicamente viável construir um mapa local e uma bússola com indicadores de objetivos no RPG Maker MV 1.6.1 usando plugins. Recomenda-se começar com mapa local consultável e uma indicação direcional discreta para a quest acompanhada. Avaliar minimapa permanente depois de validar legibilidade e espaço de interface em mobile.

Essa recomendação é uma inferência técnica baseada no código local do motor e nas referências dos autores abaixo, não um resultado de testes de compatibilidade ou desempenho.

## Opções de apresentação

| Recurso | Função | Vantagem | Cuidado |
| --- | --- | --- | --- |
| Mapa local consultável | Mostrar a área, posição do jogador e pontos conhecidos | Boa leitura sem ocupar a exploração continuamente | Definir abertura, navegação e revelação |
| Minimapa fixo | Mostrar a região próxima durante a exploração | Consulta imediata | Espaço reduzido em mobile e custo de atualização |
| Bússola de objetivos | Indicar direção da quest acompanhada | Orientação com pouco espaço de tela | Não confundir direção com caminho transitável |
| Radar circular | Mostrar pontos relativos ao jogador | Percepção de proximidade | Mais informação visual e risco de revelar conteúdo oculto |

Para a vista superior, recomenda-se norte fixo no mapa e um indicador que preserve orientação consistente. Uma seta direcional ou rosa dos ventos é uma alternativa simples à barra de bússola de jogos em primeira pessoa. A escolha visual final permanece aberta.

Não incluir automaticamente rastreamento de inimigos, baús, segredos ou itens raros. O radar solicitado tem como foco os objetivos; outros tipos de marcadores exigem decisão própria.

## O que existe no projeto

O motor fornece posições de jogador e eventos, dimensões do mapa e funções como Game_Map.deltaX e deltaY, que consideram mapas com repetição nas bordas. Esses dados permitem calcular direção e distância local. O desenho do mapa, os marcadores e a integração com quests precisam de implementação adicional.

Na inspeção, js/plugins.js lista apenas Community_Basic; não foi encontrado mapa de orientação, diário ou bússola já configurados. A ausência de equivalente nativo não impede o recurso, mas a regra geral de usar padrões do MV não fornece automaticamente essa interface.

## Integração com quests

Recomenda-se que o diário permita escolher uma quest acompanhada inicialmente, mantendo seleção de múltiplas quests como possibilidade futura. Cada objetivo rastreável deve oferecer identificador estável, área/instância, evento ou posição, condição de disponibilidade e regra de visibilidade.

Ao mudar a etapa da quest, atualizar ou retirar seu marcador. Objetivos sem localização conhecida devem mostrar orientação textual, área aproximada ou nenhum marcador, conforme o design, sem inventar uma posição exata.

Não revelar etapas futuras, segredos ou personagens ainda desconhecidos. Preservar descrições originais no diário; os indicadores de orientação são uma camada complementar de interface.

## Direção, obstáculos e mapas diferentes

No mesmo mapa, uma seta pode apontar diretamente ao objetivo, mas isso não garante que o jogador consiga andar naquela direção. Paredes, portas e desníveis exigem distinção entre proximidade geométrica e rota navegável.

Recomenda-se que o primeiro protótipo indique direção, sem prometer navegação passo a passo. Se mostrar distância, identificar sua unidade e significado; não apresentar distância em linha reta como comprimento do percurso.

Para objetivo em outro mapa, não comparar coordenadas locais de mapas diferentes. Usar uma rede de conexões entre áreas para apontar à porta, escada ou saída apropriada. Quando não houver conexão conhecida, exibir somente a área de destino ou uma indicação de localização desconhecida. Encontrar uma rota entre áreas e encontrar um caminho por tiles são problemas separados.

## Templates e geração procedural

O mapa deve representar o layout efetivamente instanciado, conforme GERACAO_DE_CENARIOS.md. Uma imagem fixa do template-fonte não representa necessariamente o cenário montado durante a partida.

Resolver marcadores após a composição dos módulos, usando IDs estáveis de área e objetivo. Separar estado de descoberta e acompanhamento de quest dos dados temporários de renderização. Salvar e carregar não deve trocar o destino por uma entidade de outra instância com o mesmo eventId.

Para mapas autorais estáticos, uma imagem pré-renderizada é alternativa simples. Para geração em runtime, preferir uma representação esquemática de paredes, chão e conectores ou renderização compatível com o gerador; não exigir nova ilustração por seed.

## Exploração, controles e desempenho

Decidir se o mapa revela a área inteira ou apenas regiões exploradas. Névoa de exploração é proposta, não requisito confirmado. A política de marcadores deve ser compatível com a escolha, especialmente para objetivos fora da área conhecida.

Planejar abertura e fechamento por teclado/mouse e uma alternativa de toque. No mobile, evitar marcadores minúsculos, excesso de sobreposição e dependência de hover. O comportamento de pausa ao abrir o mapa deve ser explícito, já que inimigos patrulham e iniciam combate por contato.

Na batalha, recomenda-se ocultar os elementos de orientação da exploração. No retorno ao mapa, atualizar o objetivo sem recriar loot, eventos ou layout.

Manter a base do mapa em cache e atualizar principalmente posição e marcadores. Redesenhar o cenário inteiro a cada quadro tende a aumentar custo sem necessidade. Medir tempo de abertura, memória e fluidez com um mapa representativo em navegador e mobile antes de escolher detalhes de renderização.

## Referências externas de plugins, sem adoção

- [Minimap de Aerosys](https://aerosys.blog/minimap): documentação do autor descreve desenho de terreno na interface. É referência técnica para a camada de mapa. A documentação registra que, no MV, expandir/recolher por clique ou toque não é suportado, embora exista atalho de teclado; isso exige atenção ao requisito mobile. A configuração deste projeto ainda não foi testada.
- [Simple Minimap de KageDesu](https://kdworkshop.net/plugins/simple-minimap/): referência com diferenças documentadas entre MV e MZ. Verificar especificamente a forma de fornecer ou gerar a imagem no MV antes de assumir suporte a cenários procedurais.
- [BMP Auto Compass System MV](https://bmpgamesassets.itch.io/bmp-auto-compass-system-mv/devlog/1141860/plugin-release): o autor anuncia orientação para eventos e mapas. É referência de viabilidade de bússola, ainda sem auditoria de código, dependências ou integração com quests neste projeto.

Nenhum plugin externo foi instalado ou comprado. Conforme a diretriz posterior do responsável, os plugins utilizados no projeto serão desenvolvidos pelo Codex. As fontes acima são referências técnicas, não candidatos à adoção ou dependências futuras.

Implementar uma solução própria separando provedores de objetivos, dados de mapa e desenho de interface, com nomes e IDs de Arena fornecidos por configuração. Seguir PLUGINS.md e validar compatibilidade com MV 1.6.1, salvamento, cenários gerados e navegador/mobile. Evitar criar navegação completa antes de validar a necessidade.

## Prova de conceito recomendada

1. Criar uma área de teste com paredes, uma saída, jogador e objetivo de quest.
2. Mostrar mapa local e direção do objetivo. Testar movimento, mudança de alvo e objetivo concluído.
3. Colocar o objetivo atrás de uma parede e verificar que a interface não promete um caminho inexistente.
4. Transferir o objetivo para outra área e testar indicação da saída correta ou fallback sem localização conhecida.
5. Salvar/carregar, retornar de batalha e testar uma instância gerada por templates quando disponível.
6. Verificar leitura, controles e desempenho em navegador desktop e dispositivo mobile de referência.

Critérios: posições corretas, marcadores atualizados, ausência de spoilers indevidos, persistência consistente e comportamento definido sem quest acompanhada. Também testar destino removido, inválido ou inacessível sem travamento.

## Decisão recomendada

Priorizar mapa local consultável e bússola simples de uma quest acompanhada, com visual do guia DIRECAO_DE_ARTE.md. Adiar minimapa permanente, radar de inimigos, viagem rápida e navegação automática. São recomendações, sujeitas à aprovação da inclusão e aos resultados do protótipo.

Seguir Git Flow: a avaliação integra a documentação; uma futura implementação pode usar feature/mapa-bussola a partir de develop. A falta de aprovação deste recurso não bloqueia o primeiro protótipo de exploração e combate.
