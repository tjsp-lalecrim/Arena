# Revisão do processo — 28/10/2026

Escopo exclusivamente documental, na feature/m01-narrativa-demo, estado inspecionado270bbd3 e árvore inicialmente limpa. Sem geração, implementação, bateria de testes, merge ou publicação. A última implementação não está presumida aprovada; aguardar as impressões do responsável.

## Diagnóstico breve

- **Relato do responsável:** aproximadamente3h30 e mais de30% do limite semanal na última execução. Não há medição por atividade disponível; não distribuir esse consumo nem prometer redução numérica.
- **Evidência:** o diff0a0106e..270bbd3 reúne254 arquivos, com narrativa, loot, caminhada, arma, Gate, geradores e validações. O relatório REVISAO_INTEGRACAO_M01_18_R02.md registra14 ilustrações e17 folhas novas, além da piloto preservada. Essa concentração amplia a superfície de revisão; contagem de arquivos não mede esforço.
- **Repetição documentada:** walk-experiments.json registra estudos Khajiit G02/G03 não selecionados; o relatório registra nova tentativa de limpeza da imagem R07 e recorte técnico residual. Há complementos de testes/capturas e correção de metadados de cobertura. Isso demonstra iterações, sem provar que toda repetição foi desnecessária ou qual foi seu custo.
- **Evidência documental:** DIRECAO_DE_ARTE.md misturava status de várias entregas com regras, incluindo projeção oblíqua antiga e lado antigo do jogador. Ajustados nesta revisão; registros históricos preservados e identificados.
- **Hipótese de processo:** validar um padrão menor antes de expandir e separar sistemas independentes pode evitar propagar defeitos e reduzir retrabalho. Os dados disponíveis não quantificam esse benefício nem permitem atribuir toda a duração à geração ou aos testes.

## Regras e preservação

Fontes principais e fluxo de entregas: DESENVOLVIMENTO_E_VERSIONAMENTO.md. Fluxo de protótipo/aprovação/lote e continuidade: DIRECAO_DE_ARTE.md. Contratos de cenário: DIRETIVA_DE_MAPAS.md. Entradas/feedback: DIRETIVA_DE_NAVEGACAO.md. Usar referências entre esses documentos, não novas cópias das mesmas regras.

Regras obrigatórias não tornam decisões provisórias definitivas. Preservadas as ressalvas aceitas de retratos e portas, além de paleta/confirmação, favoritos/atalhos, notificações, fundo de batalha, drops/balanceamento e investigação da natação nos registros existentes. Não alterar Vigor aquático ou reabrir estética por associação. Os critérios e evidências do backlog não foram reavaliados por execução de jogo nesta tarefa.

## Próximas revisões possíveis — somente sugestões

A ordem depende das impressões do responsável; nenhuma unidade abaixo está iniciada ou autorizada por este documento.

| Unidade separada | Critério curto de entrega |
| --- | --- |
| Triagem das impressões | Relacionar cada relato à versão, reprodução e decisão: defeito funcional, ressalva aceita ou melhoria futura, sem duplicar pendências. |
| Uma correção funcional prioritária | Corrigir uma causa e suas dependências/gerador; verificar o fluxo afetado e a regressão pertinente. Sem nova arte se integração resolver. |
| Um protótipo visual, se necessário | Identificar asset/defeito e mostrar uma unidade ou pequeno conjunto coerente na escala real; obter avaliação antes de ampliar. |
| Um subconjunto de variantes | Somente após aprovação/autorização do padrão; cobertura explícita, continuidade e inspeção das variantes alteradas. Não refazer a biblioteca. |
| Uma revisão local de interface, se solicitada | Um caminho de uso, com retorno, entradas e legibilidade; preservar os demais menus aprovados. |
| Verificação integrada posterior | Percurso e ambientes definidos pela integração, reutilizando evidências válidas; separar editor, navegador e Galaxy A56 físico. Não substituir esta unidade por uma bateria a cada ajuste local. |

Verificação desta tarefa: leitura dos documentos/diff e revisão documental dos links e arquivos selecionados. Nenhum teste de execução do jogo realizado. Commit documental único na feature atual; sem merge/push. Aguardar o responsável antes de nova implementação.
