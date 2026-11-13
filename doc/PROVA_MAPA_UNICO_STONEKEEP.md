# Stonekeep274 — prova técnica de mapa único

02/11/2026, base **a808f8b**, feature `feature/m02-stonekeep-runtime-unico`. Direção autorizada: priorizar exploração contínua, aceitar geração externa de mapas/dados mantendo inicialmente o motor MV. Não autoriza migração, incorporação geral dos plugins ao motor nem integração definitiva.

**Conclusão: opção1 — mapa único viável com o runtime atual, nas condições testadas.** Map014274×274 carregou, navegou e restaurou estados sem alteração de constante/arquivo interno do motor. O limite256 confirmado era de autoria no editor; não demonstrou ser limite do runtime. A proposta anterior de quatro mapas passa a ser alternativa editorial, **não dependência obrigatória da conclusão de Stonekeep**. Campanha/Map012 não foram substituídos e Stonekeep não está concluída.

## O que foi inspecionado antes da implementação

| Componente local | Resultado |
|---|---|
| `js/rpg_managers.js`, DataManager.loadMapData/isMapLoaded | Carregamento JSON por ID; não limita largura/altura a256 |
| `js/rpg_objects.js`, Game_Map.width/height/isValid/tileId, adjustX/Y, scroll; Game_CharacterBase.canPass | Dimensões vêm de $dataMap, índice de tiles usa largura/altura e coordenadas numéricas; nenhuma redução a8bits encontrada nesses caminhos |
| `js/rpg_core.js`, Tilemap/ShaderTilemap._createLayers/_paintAllTiles | Camadas/pintura dependem da janela visível, não de uma textura do mundo inteiro; o número256 em TILE_ID_C e seleção de folhas não é limite da dimensão do mapa |
| Game_Map.updateEvents e sprites nativos | Cada evento ativo tem custo de atualização; movimento de180 eventos precisa ser medido, não inferido só da área do mapa |
| `Arena_TechnicalPreview` | A nota `<TechnicalPreview>` desenha bitmap da grade inteira; **não usada** nesta prova. Mapa normal com tiles existentes, HUD limitado à tela. Não foi necessário corrigir esse plugin antigo |
| Gerador da amostra / contratos atuais | Amostra recortada e origemX8; mapa completo técnico usa origemX0, preservando escala3/margem2. Nenhum gerador da campanha foi alterado |
| Ajuda instalada MV `Help/page/01_07_03.html` / Map Size | Interface documenta edição até256. Leitura/gravação real de274 pelo editor permanece não confirmada, conforme investigação abaixo |

## Protótipo e isolamento

- **Map014**,450456 entradas de tiles,274×274, **1091680bytes** de JSON. Origem: camadas90×90 de39699021.MIF já conferidas em [M02-04C1](STONEKEEP_M02_04.md#m02-04c1--levantamento-completo02112026); centro MV=`(3+3×Xvista,3+3×Yoriginal)`. Sem transição interna entre setores.
- Mesma escala/corredores, tileset4/água e cinco folhas de caminhada existentes. **Aparência provisória de carga**, não aplicação definitiva de materiais/arquitetura de Stonekeep. Alturas usam convenção conservadora da amostra;27 diagonais ficam sólidas,70 portas são vãos abertos; sete plataformas baixas reaproveitadas. Isso não valida toda transitabilidade original, fechaduras, eventos ou fidelidade final.
- **180 eventos de patrulha sintética**, colocados nas180 referências inventariadas; raio3tiles e piso seco/região4, colisão nativa, sem batalha/EXP/loot. Cargas selecionáveis0/60/180. São objetos nativos presentes em todas as fases; fases menores deixam os demais apagados. Movimento de carga continua fora da câmera, situação exigente; não é teste da configuração final de encontros.
- As69 referências das quatro espécies sem caminhada completa usam visual de goblin **explicitamente substituto técnico**, sem afirmar que orc/ogro/aranha/homem-lagarto estão artisticamente representados ou integrados à campanha. Assets existentes não foram editados/gerados.
- Plugin próprio `Arena_StonekeepRuntimeProof0.1.0` faz somente acesso, HUD/comandos técnicos, patrulha de carga e checkpoint. Após DebugHub/FangCells e núcleos existentes. **Não altera limite de dimensão nem carregador/renderizador/movimentação do motor**; a atualização própria de patrulha é restrita ao Map014 em laboratório. Registro canônico de `js/plugins.js` preservado.
- Fixture reutiliza Stonekeep/Continuation; sem carregar saves pessoais. Slots/StorageManager normais continuam bloqueados pelo laboratório existente. Saída retorna ao título e encerra o isolamento; não adiciona acesso à campanha ou transferência por Rihad.

## Medições e verificações executadas

Chrome **156.0.8078.76**, headless, perfil/origem descartáveis, Windows10.0.19045x64, i7-7700HQ/8threads, cerca16GB RAM, WebGL/ANGLE **GTX1050Ti/D3D11**. Resolução interna816×624, viewport1050×850. Não é teste mobile nem avaliação manual do responsável. O modo headless usa GPU identificada, não foi assumido desempenho equivalente em outro computador.

Map request→mapa pronto **233,3ms**; hub→pronto **1128,5ms**, incluindo fixture/transições técnicas. HTTP do JSON4ms. Materiais já utilizados pela fixture podem estar em cache de imagem; JSON sem cache em servidor local. Tilemap observado **856×664px**, não13152×13152px do mundo inteiro. Máxima textura WebGL informada16384, sem inferir que o mapa exige uma textura desse tamanho.

| Patrulhas ativas | Amostra | Média rAF | p95 / p99 | Intervalos>33,4ms | Frames do motor | JS heap antes→depois |
|---:|---:|---:|---:|---:|---:|---:|
|0 |8,00s |16,67ms (~60Hz) |16,9 /17,0ms |0 |481 |13,87→18,36MiB |
|60 |8,01s |16,67ms (~60Hz) |16,9 /17,0ms |0 |481 |13,91→16,73MiB |
|180 |8,01s |16,67ms (~60Hz) |16,9 /17,0ms |0 |481 |20,42→15,62MiB |

Mesmo ponto central,1,5s de aquecimento por carga e480 intervalos medidos por amostra. TaskDuration do renderer cresceu1,20/1,48/1,55s por fase; não é CPU total do computador. JS heap varia com coleta de lixo e **não mede memória total do navegador, texturas/GPU ou pico absoluto**. Sessões curtas; não foi teste de horas, vazamentos ou combate/efeitos simultâneos. Não declarar estabilidade universal por esses números.

Passaram: abertura real, oito pontos distantes no mesmo mapId, coordenadas acima255 (ex.:255,264), bordas sólidas, validade274, câmera limitada de(0,0) a(257,261), caminhada por teclado com colisão, entrada/saída real da água sem through e sem gasto/recuperação de Vigor, animação/patrulha real de carga e retorno ao título. Texturas/capturas inspecionadas. Nenhum erro de página/recurso ausente.

**Serialização:** RAM nativa existente restaura Game_Map274, coordenadas>255 e estados apagados das patrulhas, sem salvar slot. Checkpoint próprio usa **sessionStorage `arena:technical:stonekeep-large:v1`**, contendo versão/mapa, posição/direção do jogador, densidade e posições/direções/quadros/atividade dos180 eventos. Validação completa precede aplicação; registro inválido é recusado sem mutação. F5→novo acesso técnico→restaurar recuperou o checkpoint. Não é save completo de personagem, quest ou inventário e não promete sobreviver ao fechamento da aba/navegador. O roundtrip completo dos objetos nativos foi testado somente em RAM. LocalStorage, namespace `arena:m01:save-v1`, quests/recursos/loot/derrotas/inventário anteriores permaneceram intactos.

[Resultados brutos](evidencias/m02-stonekeep-runtime/resultado.json), [painel](evidencias/m02-stonekeep-runtime/painel.png), [carga180](evidencias/m02-stonekeep-runtime/carga180.png), [extremo sudeste](evidencias/m02-stonekeep-runtime/ponto-5.png). Teste focal `node tools/test-stonekeep-runtime-proof.cjs`; Playwright/Chrome conforme ambiente de desenvolvimento existente. Gerador repetido estável; Map008–013, dados de combate/quests/recuperação e arquivos internos do motor preservados. Sem campanha completa ou matriz de combate repetida.

## Acesso e reconstrução

Servidor existente conferido, sem substituição: **http://127.0.0.1:8774/** → **Testes / Debug → Campanha e mapas → Stonekeep · mapa274 (RAM)**. **C** abre pontos/carga/checkpoint; alternativa Esc → **Prova274: pontos / carga / checkpoint**. Teclado/clique/toque do Window_Command existente, sem depender de hover. Escolher os extremos/água, caminhar e observar câmera; alternar cargas no mesmo ponto. **Guardar posições/patrulhas nesta aba**, mudar ponto/carga e restaurar. F5 requer reabrir o acesso técnico antes de restaurar. **Guardar/Carregar teste em RAM** do menu cobre o snapshot nativo, só até recarregar. Não usar slots pessoais para a prova.

`python tools/build-stonekeep-runtime-proof.py` reconstrói somente Map014/configuração/entrada14; requer cache de consulta e original com hash conferido, não roda geradores de campanha nem cria arte. Não depende do índice de setores para cortar a navegação. Previews que não carregam as extrações usam os dados já gerados; nenhuma extração vai ao pacote do jogador.

## Editor — investigação limitada e cópia segura

`python tools/build-stonekeep-runtime-proof.py --editor-copy` prepara **tmp/stonekeep-runtime-editor/Game.rpgproject**, ignorado pelo Git. Copia dados/plugins e somente tiles/figuras necessários à inspeção de Map014; árvore contém apenas **DESCARTAVEL Map014274**, título da cópia identificado. Não é pacote executável/playtest nem duplicação de todos os assets. Sem junction para arquivos pessoais/originais.

RPGMV.exe instalado foi iniciado; janela retornada pela automação. A entrada falhou com **“coordinate input geometry is unavailable”**; recuperação com nova seleção/captura falhou com **“FrameArrived timed out: timed out waiting on channel”**. A operação foi interrompida, sem insistir em capturas ou editar/salvar o projeto original. **A cópia não chegou a ser aberta/editada/salva pela automação**; não se afirma truncamento ou preservação após save. A limitação256 da documentação é confirmada, o comportamento real de abertura/gravação274 está pendente.

Conferência manual opcional, **somente na cópia**: Arquivo → Abrir Projeto → caminho acima; selecionar **DESCARTAVEL Map014274**; verificar visualização e Propriedades/Editar, observando largura/altura. Alterar apenas o nome de exibição para “Teste274”, confirmar, salvar e reabrir; depois comparar `data/Map014.json` da cópia com os valores **width274, height274, data.length450456, events.length181**. Se os campos exibirem256, registrar antes de confirmar; eventual corte afetará somente a cópia. Não executar esse teste no projeto da campanha. Falta de operação do editor não invalida a execução de runtime já comprovada.

## Consequências para a produção — sem integração agora

Recomendo **manter mapa único como caminho técnico para a exploração contínua**. Estrutura completa, dimensões, distribuição de tiles/camadas/regiões, posicionamento de eventos grandes e reconstrução passarão a depender do gerador externo/configurações revisadas, com validação de limites/IDs/referências; **JavaScript continua responsável pelo jogo**. Python apoia geração/análise, não substitui o motor. O editor pode continuar útil para bancos/recursos e inspeções menores; autoria/salvamento do mapa274 não são garantidos.

Antes de substituir Map012 em outra entrega: fixar a geometria das alturas/diagonais/portas, relocalizar coordenadas da amostra em+24tilesX, tratar saves/configurações/IDs de forma explícita, integrar somente conteúdo autorizado e medir novamente o delta de eventos reais. Não há necessidade comprovada de otimização, patch de constante, streaming, fusão de plugins ou migração. Esta prova não autoriza essas mudanças nem conclui Stonekeep/Rihad/M02. Próximo item da sequência geral continua M02-03E1; integração definitiva do mapa único terá recorte próprio.
