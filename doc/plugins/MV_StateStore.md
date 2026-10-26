# MV_StateStore 0.1.0

Arquivo: js/plugins/MV_StateStore.js. Núcleo reutilizável de persistência JSON por namespace para RPG Maker MV 1.6.1. Sem dependências externas ou conteúdo Arena. Sem parâmetros, comandos, notas, assets ou registros de banco exigidos. Ativar antes dos consumidores, que registram seus contratos durante o boot, antes de nova partida/carregamento. Não registrar schemas durante uma partida.

## API

- `register(name, version, defaults, migrate)`: registra namespace uma vez; version é inteiro >=1, defaults é objeto JSON, migrate opcional recebe (data, versãoAnterior) e devolve dados na versão atual. Defaults de objetos conhecidos completam campos ausentes recursivamente; arrays são preservados, não concatenados. Uma versão anterior >0 exige migração explícita; versão ausente é 0. Migrações devem ser puras, sem itens, ouro, recursos, eventos ou efeitos externos.
- `read(name)`: cópia independente dos dados. Alterar a cópia não modifica o save.
- `replace(name, data)`: valida/completa e substitui somente os dados, mantendo recibos de operações. Para setters e integração com código consumidor confiável; não é API de jogador.
- `once(name, operationId, mutate)`: mutação síncrona de um rascunho JSON, com recibo persistente. Retorna applied, duplicate ou aborted (callback retorna false). Exceção, Promise ou dado inválido não confirma rascunho nem recibo. Callback só pode modificar o rascunho: não chamar APIs de inventário, ouro, ator, cenas ou o próprio store. Isso não é transação de efeitos externos. IDs de operação devem representar uma ocorrência estável, não um valor aleatório por interação.

IDs aceitam letras/números como primeiro caractere e depois letras, números, `_ . : / -`. Chaves de protótipo reservadas são recusadas. JSON deve ser finito, sem funções, undefined, Date ou objetos especiais; ciclos não são suportados. O contrato verifica tipos dos defaults não nulos; null é ponto de extensão não tipado. Dicionários dinâmicos e semântica de seus registros devem ser validados pelo consumidor. Não expor replace/once a entrada arbitrária do usuário.

Exemplo de reaproveitamento, sem IDs/arquivos de Arena:

```javascript
MVStateStore.register('meu-jogo', 1, { achados: 0 });
MVStateStore.once('meu-jogo', 'achado/sala-oeste', function(d) { d.achados += 1; });
MVStateStore.read('meu-jogo');
```

## Save, migração e integração

Campo `$gameSystem._persistentState`: `{schemaVersion:1,namespaces:{nome:{version:1,data:{...},operations:{id:true}}}}`. O MV já inclui Game_System em makeSaveContents/JsonEx: não há segundo arquivo, StorageManager próprio, duplicação de inventário ou hook em makeSaveContents.

Extensões por alias de Game_System.initialize e DataManager.extractSaveContents. Nova partida cria estado novo; extractSaveContents prepara/valida estado antes de aplicar os objetos do save. O fluxo nativo loadGameWithoutRescue já cria objetos temporários antes desse hook; falha de load não é uma promessa de preservar uma partida ativa em memória. O arquivo salvo não é reescrito ao falhar. Raiz ausente do laboratório recebe defaults; campos conhecidos ausentes são completados sem resetar valores ou recibos. Schema futuro ou tipo incompatível gera erro explícito; o carregador nativo informa falha, sem tentar converter ou apagar o save. Não se promete recuperação de saves corrompidos, nem downgrade de schema. Nunca inferir progresso antigo a partir de inventário/switches.

Namespaces desconhecidos são preservados. Nenhuma operação é executada no load, save ou migração. A idempotência vale dentro da linha do tempo salva: carregar uma partida anterior à operação permite realizá-la novamente naquela linha do tempo. Não existe livro-caixa global entre saves. Não se garante atomicidade de disco contra interrupção de energia além do mecanismo nativo.

Desativar consumidores/core deixa dados inertes no Game_System carregado; novos jogos sem o núcleo não têm os campos. Não desativar para editar ou distribuir saves esperando manter funcionalidade. Futuras mudanças incompatíveis exigem migração explícita e testes. Consumidores que sobrescrevem initialize/extract sem chamar aliases podem impedir inicialização; não foram auditados plugins alheios ao conjunto atual.

## Verificação

`node tools/test-state-store.cjs` testa namespace sem Arena, repetição, abortar/falhar e tentar novamente, isolamento de cópia, rejeição de Promise/Infinity/Date/tipo inválido, migração de versão 1 para 2, defaults e versão futura sem trocar objetos atuais. Integração MV/Chrome e saves nativos em tools/test-persistence.cjs. Versão verificada do motor: 1.6.1 em Chrome desktop; NW.js, gerenciador/salvamento no editor após inclusão deste plugin e outras versões não verificados. Histórico 0.1.0: contrato inicial M01-05.

## Consulta de recibo adicionada para M01-07

`hasOperation(name,operationId)` retorna boolean, validando ID, sem mutação. Permite ao consumidor reconhecer confirmação já aplicada mesmo se um campo opcional faltar em save parcial. Não muda schemaVersion, defaults, operação once ou seu contrato. Testado antes/depois do recibo e com carregamento na criação; compatibilidade da persistência anterior revalidada. Não somar atributos ou conceder itens dentro da consulta.
