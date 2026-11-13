# M02-02B — contratos por quest e área

01/11/2026. Implementado em feature/m02-02b-configuracoes, dependente de91bad86, sem merge/push/Pages. Tag m01 preservada. **Relato do responsável:** executou o laboratório02A, não compreendeu claramente os resultados e autorizou continuar; autorização de avanço, **não aprovação manual de seus detalhes técnicos**. Evidências automatizadas02A preservadas e reutilizadas, sem reexecutar o laboratório ou a campanha inteira.

## Resultado prático

Quando Rihad for construída, seus eventos poderão consultar **MQ02** e a área **rihad**, enquanto Imperial Dungeons continuará consultando MQ01. A entrega do pergaminho poderá ter fonte/recibo próprios; ela não consumirá a chave da prisão nem concluirá sua quest. Cada mapa terá seu perfil de encontros, sem reativar inimigos de outra área. Esta entrega prepara essa separação; **não constrói Rihad, não implementa seus diálogos e não habilita a viagem real**.

## Unidade entregue

- Índices/configurações sem estado de partida: MV_CampaignConfig + Arena_CampaignConfig; configuração MQ02 em `data/ArenaCampaign.json`. Reutiliza as configurações MQ01 existentes, sem movê-las ou duplicar plugins de quests/encontros.
- MQ02: grafo0–110 conforme especificação; cinco áreas lógicas (`rihad`, `rihad.outskirts`, `stonekeep`, `fang-lair.upper/lower`), três fontes e dois recibos. **Mapas e IDs de itens são null:** contratos sem vínculo não concedem itens nem criam encontros. Grafo não implementa automaticamente todos os requisitos narrativos de cada etapa.
- APIs contextuais: consulta explícita por ID, sem “quest ativa” global alterando os callbacks MQ01. Assinaturas sem argumentos de MQ01 preservadas. Eventos/locais futuros deverão vincular mapas, itens e suas condições em entregas próprias.
- Persistência existente em `arena`: quests/fontes/recibos/inimigos/áreas por IDs. Sem novo schema, namespace web, defaults que iniciem MQ02, cura, EXP ou recompensa. Exceção configurável de recuperação após conclusão somente para o fragmento ainda obrigatório; não reabre fontes entregues/consumidas.

[API, configuração e dependências](plugins/Arena_CampaignConfig.md). Não há gerador proprietário desse JSON novo: é a fonte de configuração editada diretamente; os geradores existentes de MQ01/mapa não o reescrevem. Arquivo entra na lista explícita de JSONs do empacotador quando uma distribuição futura for autorizada; nenhum pacote/deploy foi feito agora.

## Ação → resultado verificado automaticamente

| Ação sintética isolada | Resultado |
| --- | --- |
| Consultar MQ01 / MQ02 | Configuração própria; consulta MQ02 retorna estado inicial sem iniciar/persistir a quest |
| Consultar Map008 / mapas sintéticos5 e7 | Imperial Dungeons / perfis sintéticos Rihad e Stonekeep, respectivamente. Os mapas existentes não foram editados; vínculos só na resposta de teste |
| Solicitar fonte MQ02 sem item vinculado | `unbound`, sem ganho ou alteração de inventário |
| Coletar pergaminho sintético e repetir | Uma unidade, apenas na fonte MQ02; segunda chamada não duplica |
| Tentar usar recibo da chave MQ01 na entrega MQ02 | Rejeita e não consome item. Mesmo um recibo MQ02 de outra fonte é rejeitado |
| Entregar/consumir e carregar repetidamente | Entregas aposentadas não reaparecem; fragmento já presente não duplica; dados/recursos preservados |
| Processar saída da área sintética | Estado de Imperial Dungeons intacto; núcleo atual reativa comuns somente conforme conclusão e preserva específicos de quest |
| Consultar quest/mapa/área desconhecidos ou extensão ausente/inválida | Resultado negativo diagnosticável, sem fallback silencioso para MQ01 e sem mutação; extensão inválida rejeitada, MQ01 preservada |

Não é necessário o responsável avaliar IDs pelo console ou repetir o laboratório02A. Estes resultados são provas técnicas, não sua aprovação manual. A avaliação de conteúdo será proposta com ação visível e resultado esperado quando Rihad existir.

## Verificações e limites

`tools/test-campaign-config.cjs`: **45 verificações** puras/Chrome em perfil/origem descartáveis; configurações sintéticas via interceptação da resposta JSON, itens2/3/4 e mapas5/7 somente nesse contexto. Nenhum vínculo sintético gravado nos dados do jogo, nenhuma batalha ou save pessoal. [Resultado](evidencias/m02-02b/resultado.json).

Regressão pertinente reutilizada: `test-quests.cjs`, **23 cenários MQ01**, nova pasta de evidência [resultado](evidencias/m02-02b/mq01-regressao/resultado.json). Ajuste do preparador antigo: acrescentar apenas o plugin de namespace à composição sintética M15, para gravar/carregar na mesma origem/chave atual; não importar chaves genéricas ou mudar armazenamento do jogo. A falha inicial era de transporte da fixture, anterior ao load, não de progressão. Evidências antigas não foram sobrescritas. Não foram repetidos os oito grupos02A ou o percurso completo.

Compatibilidade estática: registro canônico40 plugins,38 anteriores preservados; UTF-8 sem BOM, sintaxe e arquivos referenciados; dados MQ01/mapas/assets/arquivos internos do motor/namespace inalterados. Editor e dispositivo físico **não testados nesta entrega**; nenhuma aprovação inferida das execuções anteriores.

**Próximo recorte de conteúdo:** M02-03, uma primeira chegada mínima a Rihad com ponto seguro de entrada/repouso e orientação, começando pelo trecho integrado, sem cidade inteira. Vincular mapa real e apresentar comparação simples “sair pelo Gate → chegar à entrada de Rihad”; só habilitar continuação quando esse destino existir. Não iniciado; requer a próxima autorização. Reflexões/refinamentos opcionais e demais conteúdos continuam fora desta entrega.
