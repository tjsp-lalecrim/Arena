# M01 — Introdução e Imperial Dungeons

## Aceite e referência

Em30/10/2026, o responsável aprovou explicitamente a RC1 como entrega **M01 para navegador desktop**, com as ressalvas abaixo. Formalização autorizada: release/m01 → main, propagação a develop, **tag anotada m01 no commit de entrega em main** e GitHub Release. A conclusão operacional depende da confirmação dessas referências no remoto; consultar [tag](https://github.com/tjsp-lalecrim/Arena/releases/tag/m01) e `git rev-parse m01^{commit}` para o SHA final, evitando referência circular neste documento. Sem início de M02, limpeza ou nova publicação Pages.

Fonte funcional aprovada: **e407a69193e168c6c1a160ab5809b1781b4a6478**. Commits posteriores de release/m01, incluindo184fbbd e este fechamento, alteram somente documentação/evidências; a integração preserva separadamente a infraestrutura manual já existente em main43284f3. Nenhuma fórmula, dado, mapa ou asset é alterado no fechamento.

## Conteúdo entregue

Criação de personagem em Português Brasileiro; introdução e orientação de Ria; exploração das Masmorras Imperiais; encontros Side View, técnicas, magias/livros e loot; inventário/equipamentos; diário, quests e recuperação de itens obrigatórios; poções, pontos de descanso; progressão de recursos e distribuição de atributos; persistência; Shift Gate e encerramento explícito com retorno ao título. Acessos técnicos identificados permanecem separados da campanha, inclusive E05 com saves experimentais bloqueados.

## Pacote distribuído

- **ZIP jogável:** `Arena-m01-web-e407a69.zip`,33.603.168 bytes. SHA-256: `f45ec3be6bc5923897d41a0884e6b21b9d2426a97714522613b14ad71d76ccfa`.
- Contém apenas `Arena/` com321 arquivos de execução e `package-manifest.json`:37.996.040 bytes sem compressão. Sem documentação, referências, estudos, ferramentas, página auxiliar de avaliação ou saves.
- Manifesto SHA-256: `77ca50126995b178ddc9c2bcabbc8d99527e296103981ef83ebf5497b5c6c831`. Identificação interna preservada **m01-rc1/e407a69**: a candidata foi aprovada sem mudança dos bytes. Tag/release **m01** identificam sua promoção a entrega final, sem relabel silencioso do pacote.
- Namespace **arena:m01:save-v1**, compatibilidade/migrações preservadas. Não limpar armazenamento nem alterar namespace por atualização compatível.
- Os downloads automáticos **Source code (zip/tar.gz)** do GitHub são o repositório no commit da tag, com arquivos de desenvolvimento: **não são o ZIP jogável preparado acima**.

## Execução e saves

Extrair o ZIP. Servir a pasta extraída por HTTP; com Python disponível, executar `python -m http.server 8000` na pasta que contém `Arena/` e abrir **http://127.0.0.1:8000/Arena/** no Chrome do PC. Não usar `file://`. Nova Partida inicia o fluxo normal; os acessos técnicos são opcionais. Não é necessário instalar ferramentas do projeto para jogar em um servidor web já disponível.

Saves pertencem ao navegador/perfil/origem/dispositivo. Trocar host ou porta muda o armazenamento acessado; **não há sincronização ou transferência automática entre dispositivos, localhost, Pages ou futuro APK**. Preservar os dados do site e slots existentes.

## Ressalvas aceitas e continuidade

- Alvo obrigatório: **navegador desktop, inicialmente Chrome**. Evidências anteriores de editor e dispositivos mantêm versão/cobertura próprias; não certificam todos os destinos por associação.
- Balanceamento, bônus raciais, equipamentos/custos e **três pontos de+1 por nível desde2** permanecem provisórios. Escolha independente de Vida/Mana/Vigor preservada. Fórmula atual da campanha mantida; fórmula proporcional/pontos/conjuntos experimentais do **E05 isolados no laboratório**, sem transferência à campanha.
- Paisagem/fullscreen continuam **não atendidos**, aceitos como adiados. Mobile/APK no [MOBILE-01](MOBILE_01.md), data e tecnologia a planejar; toque existente preservado. Nenhum APK ou migração de saves é prometido nesta entrega.
- Ressalvas visuais e refinamentos seguem no registro único [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md); aprovação não declara correção dessas pendências nem autoriza implementá-las.
- Prévia [Pages](https://tjsp-lalecrim.github.io/Arena/) continua com a RC1 já publicada: **mesmos321 arquivos e manifesto do ZIP final**. Nenhuma atualização do site nesta finalização. Publicação permanece exclusivamente manual.

## Verificações de fechamento

Reutilizadas evidências de [M01_RC1.md](M01_RC1.md) e [VALIDACAO_M01.md](VALIDACAO_M01.md), sem repetir campanha ou inferir novo teste físico. Conferidos Git local/remoto e ausência de tag m01 antes da criação; árvore funcional contra a fonte aprovada; inventário, hashes/tamanhos, recursos relativos/capitalização, plugins canônicos/arquivos e namespace. Reconstrução de blobs da fonte com a normalização de finais de linha já aprovada na infraestrutura reproduziu exatamente o manifesto RC1; conferidos os hashes dos321 arquivos dentro do ZIP. Diferenças iniciais de checkout Windows eram somente finais de linha e não foram incorporadas à entrega.

Reconstrução: em checkout separado da fonte exata com finais de linha Git/LF (`core.autocrlf=false`), executar a receita `tools/build-web-package.cjs` da fonte; aplicar `tools/finalize-pages-package.cjs` e a política já aprovada da infraestrutura43284f3 sobre **somente a saída gerada**; executar `tools/check-web-package.cjs` e exigir o hash acima. A receita/normalizador continuam ferramentas de desenvolvimento, fora do ZIP. Não sobrescrever uma saída divergente ou usar o empacotamento da tag para alegar o mesmo sourceCommit sem essa conferência.

Integração deve conservar workflow somente `workflow_dispatch`, sem gatilhos de push/tag/release. A confirmação de main/develop, tag anotada, release e anexo remoto será reportada após a publicação autorizada; se falhar, o fechamento operacional não será declarado concluído.
