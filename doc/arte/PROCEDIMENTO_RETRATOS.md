# Diretiva obrigatória de pose, orientação e anatomia

Versão1.1 —26/10/2026. Aplica-se a toda geração/edição futura de personagens do projeto. Direções são relativas à imagem vista pelo jogador. No fechamento R05, o responsável aprovou os arquivos atuais para avançar **com ressalvas**, sem corrigir recortes/orientações e sem autorizar retrabalho estético nesta rodada. Exceções identificadas em APROVACAO_M01_07_COM_RESSALVAS_R05.json/PENDENCIAS_VISUAIS_M01_07.md; não viram novo padrão nem dispensam este procedimento em futuras gerações.

## Convenções por categoria

| Categoria | Convenção obrigatória |
| --- | --- |
| Retrato | Cabeça **e tronco** em três quartos para a direita; peito, ombros, pescoço, cabeça e olhar coerentes. Não misturar frontal, perfil completo e três quartos |
| Exploração | Frente/costas/esquerda/direita conforme movimento MV: linhas baixo/esquerda/direita/cima. Não aplicar a pose de retrato à folha de movimento |
| Combatente | Orientação do lado ocupado: jogador atualmente à direita, voltado para a esquerda. Corpo, cabeça e ação no mesmo sentido; inimigos seguem a convenção de seu lado |
| Animação | Preservar proporções, posição de apoio/pivôs e identidade entre quadros; não redimensionar isoladamente cada fase de um ciclo. Quadros repetidos não comprovam animação produzida |

Retratos: grau aproximado comum de três quartos, com ambos os olhos legíveis e o distante encurtado pela perspectiva; cabeça naturalmente apoiada no pescoço/tronco. Sem olhar por cima do ombro, contrarrotação ou torção acentuada do pescoço. Focinhos, orelhas e cristas conservam sua anatomia; não os comprimir para caber num contorno humano. Escala por categoria, busto, linha dos olhos e margens equivalentes, mediante transformação uniforme.

## Referências separadas e explícitas

1. **Pose/composição:** `art/references/pose-personagens/breton-female-busto-v01.png`, extração técnica do quadrante de retrato de `art/masters/breta-piloto-v01.png`. Referência escolhida nesta inspeção pela continuidade de peito/ombros/pescoço/cabeça em três quartos para a direita; não copiar anatomia humana para raças bestiais. É um gabarito técnico de pose, não nova aprovação estética do responsável. O olhar solicitado deve acompanhar o rosto, mesmo quando a identidade anterior olhava de volta para o observador.
2. **Identidade:** retrato anterior específico da combinação e, quando necessário, exploração/combate correspondentes. Preservar raça, rosto, traços, roupas, cores e sexo. Fontes de Arena são principais; influência anatômica de Skyrim apenas para Argonianos/Khajiit conforme decisão registrada. Não usar a pose inadequada do alvo como modelo de pose.
3. **Estilo:** acabamento figurativo dark fantasy do projeto. A revisão usa `art/masters/breta-piloto-v01.png` como continuidade do acabamento existente; aprovação geral não promove automaticamente novos arquivos a referências aprovadas.

Argonianos/Khajiit podem precisar de gabarito próprio de pose para manter focinho/orelhas e união do pescoço. Um novo derivado pode servir como referência técnica **somente após inspeção anatômica explícita**, com arquivo/versão/hash e estado de aprovação registrados. Isso não o torna referência estética aprovada. Não depender apenas da frase "olhando para a direita".

Anexar de fato cada imagem citada no prompt e identificar sua função. Não mencionar como fornecida uma imagem não anexada. Registrar prompt completo, caminhos, hashes, versões, ferramenta e resultado. Fontes originais de consulta ficam ignoradas; derivados IA do projeto podem ser versionados. Se faltar referência concreta, registrar a lacuna antes de inventar evidência.

Prompts históricos permanecem como realmente foram enviados; não acrescentar retroativamente o bloco a uma chamada antiga. A obrigação aplica-se às novas chamadas e revisões, auditadas em seus próprios registros.

## Bloco fixo obrigatório

Incluir literalmente em todo prompt de retrato:

> Retrato de busto em três quartos. O personagem inteiro está orientado para a direita da imagem: peito, ombros, pescoço, cabeça e olhar seguem a mesma orientação, com alinhamento anatômico natural. Cabeça não está virada sobre o ombro. Sem tronco voltado à esquerda, sem contrarrotação, sem pescoço torcido. Seguir a referência de pose fornecida, preservando a identidade racial e o estilo aprovado.

Acrescentar instruções específicas: identidade, papel das imagens anexadas, três quartos aproximadamente35–45° como orientação artística (não medida comprovada), corpo com o mesmo giro, peito e abertura da roupa acompanhando o rosto, cabeça apoiada naturalmente. Olhar para a direita acompanhando o rosto. Nunca usar espelhamento como correção de torção: ele preserva o erro relativo entre as partes.

Registrar também o gabarito de escala: export144×144 no slot0 da face576×288, linha estimada dos olhos y52 e cabeça aparente nominal coroa–queixo76px, adaptados sem distorção à anatomia; margens alpha para orelhas/cristas/focinho. Referências humanas orientam composição, não contorno bestial. Linhas/guias de revisão são sobreposições externas e não integram os arquivos finais.

## Inspeção obrigatória antes de integrar

- Cabeça e tronco seguem a orientação definida.
- Ombros, peito e pescoço formam uma pose plausível; cabeça apoiada naturalmente.
- Não há olhar por cima do ombro, contrarrotação ou torção involuntária.
- Ângulo aproxima-se do gabarito de pose, sem substituir três quartos por frontal/perfil.
- Olhar acompanha a orientação do rosto.
- Escala aparente, linha dos olhos, busto e margens seguem o padrão.
- Anatomia racial completa, sem compressão/corte de focinho, orelhas ou crista.
- Identidade e continuidade com exploração/combate foram preservadas.
- Funciona ampliado **e nos144px da interface real**, na mesma resolução entre combinações.
- Não há guias, legendas ou contaminação de fundo no PNG final.

Registrar avaliação visual individual de todas as combinações, inclusive as preservadas, e antes/depois dos corrigidos. Testes de dimensões/transparência/hashes/recortes complementam a inspeção; **não comprovam anatomia ou pose**. Falha encontrada: arquivo permanece em revisão ou é substituído por derivado inspecionado; nunca promover a referência aprovada. A avaliação estética final continua sendo do responsável. Preservar originais e evidências de tentativas, incluindo as rejeitadas.
