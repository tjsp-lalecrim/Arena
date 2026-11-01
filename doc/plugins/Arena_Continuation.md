# Continuação — v0.2.0 / M02-03A

Delta atual: `registerCampaignDestination(d)` registra somente rihad.arrival, a partir de ArenaRihad.json; `canContinueCampaign()` verifica campanha elegível fora do laboratório; `beginCampaign()` registra operação e transfere uma única vez. `campaignActive()` entrega o roteamento ao capítulo após confirmação, preservando fase/cursor/histórico M01. Load em travelling retoma o destino; arrived conserva a posição salva. Chegada cria MQ02 em10 somente se ausente, sem recursos/EXP/prêmios.

`previewArrival(d)` reutiliza fixture ending explicitamente pedida pelo título e o isolamento RAM do laboratório; não transforma saves técnicos/E05 em campanha. APIs02A e TechnicalDestination continuam para o laboratório anterior, sem alteração de schema/namespace. A troca de cena narrativa acrescenta Continuar jornada somente quando elegível; título/salvar continuam disponíveis. [Configuração, roteiro e evidências](../CHEGADA_RIHAD_M02_03A.md).

## Contrato02A preservado — histórico da unidade original

# Continuação de capítulo — M02-02A / 0.1.0

Implementação técnica isolada; nenhuma continuação M02 habilitada na campanha. [Roteiro e evidências](../CONTINUIDADE_M02_02A.md). Base documental34c2f95; fonte funcional develop85940d4, sem mudanças de mapas/banco/assets. Tag m01 preservada.

## Componentes e dependências

- `MV_ChapterContinuation.js`: regras puras sem efeitos, armazenamento ou dependências. Aceita contexto `{mode,identity,checkpoint,experimental}`; `checkpoint` é `partial_intro`, `pre_gate` ou `ready`, determinado pelo adaptador. Sem IDs de Arena, estágios de quest ou números de mapa no núcleo.
- `Arena_Continuation.js`: adaptador e laboratório, após MV_ChapterContinuation, MV_StateStore e os plugins M01 (narrativa, criação/persistência, recursos, atributos e seus pré-requisitos). Sem dependência externa. Reutiliza Window_Command/Scene_MenuBase, JsonEx, DataManager e transferências nativas.
- `Arena_Narrative.active`: única integração na apresentação anterior; enquanto **este laboratório** estiver ativo, suspende o redirecionamento para a narrativa para observar o destino técnico. Não muda a fase salva, cursor ou narrativa normal. Sem refatorar introdução ou atualizar seu schema2; migração narrativa1→2 existente preservada.

Registro canônico de plugins:38 entradas;36 anteriores mantidas integralmente, inclusive Community_Basic desativado. Dois registros novos ao final. Motor, fórmulas, dados de quests/áreas e parâmetros anteriores intactos.

## Parâmetro e estado

`TechnicalDestination`, JSON string: `{"id":"technical.resources.arrival","mapId":5,"x":4,"y":7,"direction":2}`. Permite somente mapas técnicos existentes1/5; direção2/4/6/8, coordenadas inteiras não negativas. Antes de transferir, confere limites, colisão e evento na chegada; respeita regiões do TechnicalPreview existente, sem mudar atravessamento. Erro preserva deslocamento pendente e informa diagnóstico no laboratório. Um ID salvo precisa continuar resolvendo para o mesmo contrato de destino; não reutilizar ID para um destino semanticamente diferente. Não configurar Rihad ou mapa inexistente neste recorte.

Namespace interno **arenaContinuation v1** no MV_StateStore:

| Campo/recibo | Contrato |
| --- | --- |
| `phase` | `idle` → `travelling` → `arrived` |
| `transitionId` | null antes da confirmação; `campaign/MQ02.begin` depois |
| `destinationId` | null antes da confirmação; ID estável do destino confirmado depois |
| operação `campaign/MQ02.begin` | Uma confirmação por partida; não por sessão de UI |
| operação `campaign/MQ02.arrive` | Uma chegada após transferência nativa bem-sucedida |

Não armazena cópia de personagem, inventário, atributos, recursos ou quests. Campo ausente em save m01 recebe defaults pelo mecanismo existente. Namespace web continua **arena:m01:save-v1**; armazenamento por arquivos do editor mantém seus caminhos. Schema de continuação e build são conceitos distintos.

Reconhecimento do adaptador: identidade de campanha, MQ01 e recibo de consumo da chave coerentes; intro/Ria parciais continuam leitura; antes do Gate não oferece transição; MQ01 concluída em ending/ended oferece até confirmar. **Cancelar não gasta a oportunidade**: “uma vez” significa um registro de confirmação/chegada, não perder acesso por fechar uma prévia. Repetir begin/arrive ou restaurar snapshot não concede prêmio/cura/EXP, não altera quests ou reabre a oferta confirmada. Neste laboratório a chegada não inicia MQ02/etapa10: Map005 é só uma amostra técnica.

## APIs

| Objeto | Métodos |
| --- | --- |
| `MVChapterContinuation` | `defaults`, `validate`, `inspect(context,state)`, `begin(state,transitionId,destinationId)`, `arrive(state)`; retorna novos estados ou null quando a operação não se aplica |
| `ArenaContinuation` | `status`, `inspectContents(contents)` (leitura, diagnóstico); `begin`, `arrive` (somente cena do laboratório); `destination` (cópia configurada); `lastError` |
| Acesso técnico | `fixture(id)`, `labActive`, `simulateGate`, `memorySave`, `memoryLoad`, `leaveLab`. IDs: pre_gate, ending, ended, intro, technical, incompatible |

As fixtures são sintéticas: Bretã feminina nível3, escolhas/pontos e recursos parcialmente gastos, adaga, Cura, poções e ouro. Prepará-las altera **somente a sessão descartável**, não migra a campanha. “Simular Gate” altera a quest/narrativa dessa fixture explicitamente; é distinto da migração, que não modifica esses dados. Sessões técnicas/E05 são inelegíveis; begin não executa fora da cena técnica. Acesso não importa slots pessoais nem converte laboratórios em campanha.

## Isolamento, load e falhas

Durante a sessão: save normal/direto/índice, backup, remoção, restauração de backup e serialização normal são bloqueados, inclusive chamadas diretas ao StorageManager. Somente Guardar/Carregar RAM usam JsonEx e o conteúdo nativo; nada é escrito. RAM termina ao sair/recarregar o navegador e não é uma promessa de persistência após reinício. Voltar ao título descarta a fixture e restaura seleção anterior de slot; Nova Partida/load posteriores seguem fluxo normal.

No load normal, valida estrutura/versões da continuação e coerência narrativa antes da extração. Versões narrativas1/2 suportadas; futura/desconhecida é rejeitada. Falha retorna false, restaura referências dos objetos anteriores/slot acessado e mantém arquivo/chave original; Scene_Load mostra “Save incompatível; dados preservados.” A leitura direta via extract lança erro, capturado pelo carregador nativo/RAM; não ignorar o diagnóstico ou completar quests para contorná-lo. Não é recuperação universal de saves corrompidos nem conversão de todos os históricos de desenvolvimento.

## Limites e manutenção

Sem novos mapas, narrativa M02 real, itens de missão MQ02, generalização de quests/áreas ou armazenamento alternativo. Proteções do laboratório são prevenção de uso acidental, não barreira contra manipulação deliberada pelo console. Antes de ativar a campanha em outro recorte, especificar destino real e integrar seus gatilhos; não apenas retirar a trava técnica. Documentação do M02-02B continua separada.

Teste focal: `node tools/test-continuation.cjs`, Chrome/Playwright local, novo contexto/origem descartáveis; resultados em `doc/evidencias/m02-02a/`. Núcleo de persistência: `node tools/test-state-store.cjs`. Abertura/autoria destes dois plugins no editor e avaliação manual do responsável ainda não executadas; evidências M01 não são reatribuídas. Nenhum teste físico/mobile ou deploy requerido/realizado nesta entrega.
