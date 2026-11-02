# Fang Lair — amostra funcional das celas (M02-06A)

02/11/2026. Feature `feature/m02-fang-lair-celas`, dependências preservadas sobre **f27e9a9**. Núcleo de enigma/chave/portal implementado, **aguardando avaliação da amostra**. O encontro condicionado das aranhas ainda não está implementado; portanto M02-06A não está integralmente concluído. Testes manuais dos grupos de Stonekeep continuam adiados para integração; REF17/contraste continua em QUALIDADE-01.

## Fontes e recorte, definidos antes da construção

| Evidência localizável | Confirmação e correspondência |
| --- | --- |
| `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.3 (enigma e vista das celas), p.5 (planta do nível1) | Sala com celas laterais e três celas ao sul; resposta **Cela 2**, chave abre o portal para a escada. Erro libera aranhas. A aparência de mina/celas não confirma reutilização dos materiais de Stonekeep |
| Original instalado: `ARENA/42068779.MIF`, primeiro INFO `FANG1.INF`, primeiro MAP1/FLOR100×100, TRIG/LOCK | Decodificação focal nova conferida com a leitura anterior: recorte sudoeste do nível1, sem segundo andar. Hash/âncoras em [fontes.json](evidencias/m02-fang-celas/fontes.json) |
| `ARENA/GLOBAL.BSA`, entrada `FANG1.INF`, TEXT5–10 | Advertência, três proposições, respostas aceitas `cell 2`/`2` etc.; `^30 10` no enigma e `+29` na chave. Portal no LOCK `(88,96,29)` e cela2 `(94,96,30)`, coerentes com texto/planta. Não afirmar decodificação completa dos flags |
| MAP1/FLOR + FLAT5 `key.img`, FLAT55 `spider.dfa` | Chaves aparentes `(91,98)/(94,98)/(97,98)`, só a central é dourada segundo os textos. Quatro aranhas do recorte em `(96,83)/(90,83)/(96,87)/(90,87)` |

Consulta somente de leitura; extrações em `tmp/fang-review`, ignorado, sem material original no runtime. Não houve novo playtest DOS. Sem pesquisa geral de materiais: FANG1 declara MFLOORA/MFLOORD, MINEA/B/C/D/E/F, MCELL/MDOOR/MSD etc.; uso espacial completo das texturas não foi deduzido desses nomes. Preparar referências específicas antes de futura amostra artística.

Planta fixa em [FANG_CELAS_M02.json](mapas/FANG_CELAS_M02.json): espelhar X original para leitura do automapa (`displayX=99−originalX`), recortar displayX1–12 / Y80–98, escala3 e margem2. Mantém corredores/ramificações e relações das celas. Map01340×61; corredores mínimos3tiles, teto1/face2 dentro dos sólidos; interação/collider separados da arte. O par opcional de celas ao norte/Y77–79 e a rota completa da entrada ficam fora.

| Elemento | Original X,Y | Map013 X,Y |
| --- | --- | --- |
| Ponto de leitura do portal |88,95 |33,48 |
| Porta do portal |88,96 |33,51 |
| Cela2 / chave dourada |94,96 /94,98 |15,51 /15,57 |
| Cela1 / latão |91,96 /91,98 |24,51 /24,57 |
| Cela3 / latão |97,96 /97,98 |6,51 /6,57 |
| Saída ao norte do recorte |93,80 |18,3 — retorno técnico ao título, não entrada completa da mina |
| Patamar da escada / limite |88,98 |33,57 — sem transferência ao nível2 |

Adaptações explícitas: escolha nativa Cela1/2/3/Voltar em vez de digitação inglesa; tradução das três condicionais sem revelar resposta antecipadamente; interação do portal no tile33,49, acessível do ponto original33,48; consumo da chave segue o contrato aprovado de MQ02, não é inferido como consumo do original. Portas ocupam a célula original ampliada3×3; evento visual ancorado uma linha abaixo do centro, com primeiro tile transparente. Arte/ícone/tile4 existentes são **provisórios**, sem afirmar identidade de Fang Lair ou modificar os outros mapas. Portas alternam quadros fechado/aberto, sem nova animação artística.

## Estado e limites

- MQ02 **60→70** apenas no acerto; Cela2 abre. Erro mantém60 e registra `fangSpidersReleased` uma vez, abrindo as celas associadas; pode tentar novamente. Quatro marcadores sinalizam encontros pendentes, **sem combate substituto, EXP ou loot fictícios**. Ainda falta um exemplar próprio de aranha e sua integração condicionada para atender esse critério do backlog.
- Item importante **8**, `MQ02.gold-key`, fonte **fang.cell2.key**; IDs1–7 intactos. Coleta só repõe a unidade faltante em70. Portal consome1 + recibo **MQ02.fang.lower-door** + etapa **80** na mesma operação com rollback. Recibo aposenta a fonte; carregar/reinteragir não recria chave. Diário atualizado, MQ01 preservada e MQ02 continua incompleta.
- Escada informa limite, sem criar nível2, fragmento ou retaliação. Rihad continua sem viagem ao destino `fang.entry`: amostra das celas não substitui uma mina ainda ausente. M02-06B conectará a rota após a amostra.
- Núcleos de quests/persistência e namespace web inalterados. Sessão RAM reutiliza fixture da entrega legítima do pergaminho, sem tocar saves pessoais. Nenhum atributo/loot/inimigo anterior modificado.

## Avaliação curta

Localhost: **http://127.0.0.1:8774/**, servidor Python desta entrega ativo (PID17812; encerrar com `Stop-Process -Id 17812` quando não for mais necessário). Nenhum servidor alheio foi encerrado. Editor: abrir projeto e executar normalmente. Em ambos:

1. **Testes / Debug → Campanha e mapas → Fang Lair · celas (RAM)**. Início diante do portal, etapa60, sem chave; não exige refazer Stonekeep.
2. Enter/toque no portal, ler e escolher **Voltar** (sem efeito) ou Cela1/3 (abre celas laterais; aranhas apenas sinalizadas). Interagir novamente; **Cela2** é o acerto do original.
3. Contornar a ponta norte da divisória e entrar na **Cela2**, ao sul/centro. Interagir no ponto **Chave dourada** `(15,57)`; inventário tem1. Repetir não duplica.
4. Voltar ao portal `(33,48)`, interagir: chave consumida, porta aberta; entrar até a escada, que informa o limite sem concluir a quest.
5. Esc → **Guardar teste em RAM / Carregar teste da RAM** para conferir antes/depois. Slots normais bloqueados; RAM não sobrevive a F5. Para reiniciar, retornar ao título pelo ponto norte ou menu e abrir o mesmo teste. Não preparar fixtures em partidas pessoais.

## Verificações efetivamente realizadas

`tools/test-fang-cells.cjs`: Chrome desktop automatizado, origem/perfil descartáveis; abertura limpa, hub real, comandos/eventos/choices nativos, cancelamento e ambas respostas erradas; colisão fechada/aberta, caminho até chave/escada, coleta/recoleta/recuperação, recibo/consumo único, RAM antes/depois, save nativo sintético16 + F5/load, quest incompleta e preservação de personagem/recursos/MQ01/itens anteriores/loot/derrotas. Caminhada acelerada somente no teste; não constitui avaliação de ritmo.

Reconstrução completa `node tools/build-rihad-arrival.cjs` preserva Map008–012/Items1–7 e reproduz Map013/contratos; registro canônico de plugins conferido. Zero erros de página e recursos ausentes. Validador de dados/IDs passou; título e vínculos finais também conferidos no endereço8774 em perfil descartável, sem tocar o armazenamento pessoal. [Resultado e capturas](evidencias/m02-fang-celas/resultado.json). Avaliação manual do responsável, abertura/edição nova no MV e mobile **não executadas**. Sem campanha completa ou nova matriz de combate.

**Replanejamento posterior02/11:** preservar af17b4b e adiar expansão de Fang Lair até conferir/concluir Stonekeep e Rihad, conforme BACKLOG_M02.md. Ao retomar M02-06A, exemplar de aranha/encontro condicionado continua necessário, assim como avaliação da amostra antes da ampliação pertinente. Não iniciar lote de materiais ou descartar o núcleo já entregue. Nenhuma dependência concreta exige inverter a prioridade agora.
