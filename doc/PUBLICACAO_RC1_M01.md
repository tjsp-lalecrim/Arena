# Prévia RC1 no Pages — validação física pendente

## Publicação concluída — 30/10/2026

**Jogo:** https://tjsp-lalecrim.github.io/Arena/ — [execução manual41050559624](https://github.com/tjsp-lalecrim/Arena/actions/runs/41050559624), main/publish=true, build e deploy bem-sucedidos. Fonte **e407a69193e168c6c1a160ab5809b1781b4a6478**, infraestrutura **43284f3ca3c6b1f82fae0a537e8f3a5e2b691e64**. Versão **m01-rc1**;321 arquivos,37.996.040 bytes com manifesto. SHA-256 do manifesto público **77ca50126995b178ddc9c2bcabbc8d99527e296103981ef83ebf5497b5c6c831**, **idêntico ao pacote RC1 aprovado**, não apenas equivalente após normalização.

Validação Linux prévia [41050143414](https://github.com/tjsp-lalecrim/Arena/actions/runs/41050143414), publish=false, confirmou esse mesmo hash antes de publicar. Verificação pós-deploy: todos os321 arquivos HTTP200/tamanho/SHA-256 correspondem, título e caminho existente laboratório→inventário→atributos abriram no Chrome156 isolado, zero escritas em saves. /Arena/avaliacao/ e o HTML de suporte retornam404 e não constam do artefato. Não houve campanha completa, nova batalha, teste de persistência pessoal ou A56 físico nesta publicação. [Evidência pública](evidencias/m01-rc1-pages/resultado.json), [diagnóstico inicial e infraestrutura](evidencias/m01-rc1-publicacao-preparacao/infraestrutura.json).

Branches release/m01 e feature/pages-rc1-infra publicadas; main recebeu **somente infraestrutura**, sem ser descendente da RC1 e sem dados/código/assets de jogo. Nenhuma tag ou GitHub Release criada. Publicação continua exclusivamente manual; novo pacote exige política/hash explicitamente aprovado. **Estado: candidata aguardando avaliação física do responsável, não M01 concluído.**



## Escopo e evidência corrigida

Responsável autorizou publicar exclusivamente para avaliação final no A56, agora em outra rede. Esclareceu que o **último teste informado da RC1 ocorreu no navegador integrado do GPT**, não no A56. Não inferir casos novos de persistência ou aprovação física. Confirmações públicas de Chrome PC/A56 da prévia9fab698 e automações Chrome da RC1 continuam registros separados.

Fonte imutável: **e407a69193e168c6c1a160ab5809b1781b4a6478**. Pacote **m01-rc1**, namespace **arena:m01:save-v1**, manifesto aprovado **77ca50126995b178ddc9c2bcabbc8d99527e296103981ef83ebf5497b5c6c831**. Nenhum jogo/dado/asset/parâmetro alterado, tag final criada ou release integrada em main.

## Exceção restrita de infraestrutura autorizada

A divergência foi apresentada antes do deploy: main usava a receita m01-19-web-r01;79 arquivos do checkout Linux diferiam por finais de linha. A reconstrução inicial não era o pacote Windows aprovado. Responsável autorizou corrigir somente a infraestrutura, mantendo o SHA do jogo.

Main recebe apenas workflow, finalizador e política de bytes; não recebe código/dados/assets da release. A construção usa a receita da fonte selecionada. **tools/finalize-pages-package.cjs** altera somente a saída gerada e exige o SHA-256 do manifesto aprovado antes de upload; **tools/pages-package-policy.json** identifica esse SHA de fonte e os caminhos de texto com CRLF. Git checkout permanece intacto; validator confere todos os arquivos. Outro SHA/pacote exige sua própria aprovação/política, não publicação automática. Tentativas anteriores sem deploy não substituíram o site.

Workflow permanece exclusivamente **workflow_dispatch**, pela main, com source_sha completo/publish explícitos. Nenhum gatilho de commit/tag/release foi adicionado. Página auxiliar de estado **não integra o artefato/site**. A execução de validação sem deploy precisa confirmar hash exato antes da publicação manual; resultados finais abaixo.

## Roteiro curto no A56 — somente acessos do pacote

1. Abrir **https://tjsp-lalecrim.github.io/Arena/** no Chrome normal. A origem pública conserva os seus próprios saves; não limpar dados do site para cache, não importar os de localhost e não usar modo anônimo para teste de reinício.
2. Preferir um **save normal anterior ao encerramento, de nível2 ou superior**. Ao carregar saves antigos, a migração concede uma vez os pontos dos níveis alcançados; não distribui sozinha. Abrir menu (gesto atual com dois dedos) → **Inventário → Atributos**. Conferir saldo, montar prévia e **Confirmar conjunto → Confirmar distribuição**; anotar saldo/atributos.
3. Voltar ao menu, **Salvar**, fechar o Chrome, reabrir o mesmo endereço → **Continuar**. Conferir saldo e atributos. Usar slot de avaliação vazio ou cópia que o responsável tenha escolhido substituir; não sobrescrever partida pessoal por conveniência técnica.

### Quando não existe save com pontos

Caminho sem batalhas para testar **somente interação**: título → **Laboratório de atributos (sem saves)** → **Ganhar 3 níveis** → **Inventário / acesso normal → Atributos (9)**. Esse laboratório continua bloqueando saves normais; memória não comprova persistência pública após reinício.

Alternativa já existente, sem depender de drops ou repetir batalhas: título → **Combate técnico (piloto)** → **Bretão · Feminino** (perfil, não E05 nem Teste da arma). No Map007, preparar o treino pelo evento **Preparar treino (3,5)** e vencer **Homem-lagarto (10,8)**. Dados atuais: vitória concede50EXP; nível2 requer50EXP. Assim, após **uma vitória** o perfil iniciado em nível1 terá3 pontos para o mesmo menu de atributos. Usar uma sessão/slot vazio de avaliação; derrota não concede EXP e precisa de nova tentativa. É caminho técnico existente, não prova de jornada normal ou mudança de recompensas. Não foi exigida nova batalha automática nesta publicação.

**Limitação:** sem save normal com saldo, não há atalho existente que una níveis instantâneos, zero combate e save normal permitido. Não criar fixtures em saves pessoais nem desbloquear o laboratório para contornar. Se a alternativa com combate não for conveniente, registrar navegação/distribuição pelo laboratório e deixar o teste de persistência física pendente. A página auxiliar usada na rede local não está no Pages.

## Ressalvas preservadas

Candidata para avaliação, M01 não concluído. Paisagem/fullscreen aceitos como não atendidos e adiados; balanceamento/3 pontos de+1/fórmula atual são provisórios; S02/E05 continua isolado. Design final de atributos, refinamentos e demais melhorias não foram implementados por associação.
