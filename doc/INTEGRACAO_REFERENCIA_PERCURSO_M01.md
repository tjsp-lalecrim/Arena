# Referência provisória integrada — percurso M01

29/10/2026. Responsável autorizou usar a campanha atual como referência provisória e integrar as dependências em **develop**, sem transferir regras E05. Não é aprovação definitiva de balanceamento, conclusão M01-20/M01, release ou publicação do site.

## Histórico integrado e identificação

Árvore inicialmente limpa, develop local/remotoa9d8cc0; remoto consultado antes de agir. Ordem preservada com merges sem fast-forward, sem conflitos:

| Ordem | Origem preservada | Merge em develop |
| --- | --- | --- |
|1|feature/m01-narrativa-demo, ponta67dfbe3d1860189da68078ab4c04e5df004eacd6|90c9a45477bc32b8c81b403ed2b075610f7f8529|
|2|feature/m01-19-isolamento-saves, ponta06daccaa468a46675f4755b645914c4b0d952171|2705812bc2528adb5dd5dcf3fc70b6b7a8029a18|

O conteúdo após os merges é **idêntico, arquivo por arquivo, à ponta06dacca**. A referência completa para esta rodada é o **commit de fechamento documental imediatamente posterior ao merge2705812**, mensagem `docs: fixa referencia integrada de develop para percurso M01`, SHA informado na entrega. Esse commit só acrescenta/atualiza documentação e evidência: o conteúdo jogável é o do merge acima. Registrar esse SHA completo no percurso, não acompanhar a ponta móvel de develop durante a rodada.

Narrativa inclui introdução/Ria/encerramento, correções de caminhada/tesouros/Gate, apoios da Bretã feminina com espada/adaga nos comandos aprovados, descanso piloto e diretivas. M01-19 acrescenta isolamento web, pacote/workflow manuais, evidências públicas e estudos. Histórico/commits anteriores preservados; nenhuma regra nova escolhida por resolução de conflito.

## Escopos separados

| Estado | Tratamento nesta integração |
| --- | --- |
| Funcionalidades aprovadas | Narrativa/encerramento, exploração, encontros/retorno, loot/inventário/poções, quests/diário, persistência e descanso, conforme ambientes/cobertura já registrados em VALIDACAO_M01.md. Não atribuir aprovação a combinações não testadas. |
| Ressalvas e requisitos adiados | REF01–REF15 conforme registro existente, incluindo apresentação/mobile/paisagem/fullscreen, armas fora da cobertura aprovada, cenário e drops, descanso futuro e demais estudos. Integração não resolve ou reabre essas pendências. |
| E05 experimental | Acesso técnico identificado, proporcional S02/pontos/conjuntos virtuais restritos à fixture, saves bloqueados. Feedback exploratório não aprova seu modelo para campanha. Evidências focais anteriores reutilizadas, sem repetir batalhas. |

Campanha conserva fórmulas, equipamentos, recursos e bônus atuais descritos em [AVALIACAO_BALANCEAMENTO_POR_MARCO.md](AVALIACAO_BALANCEAMENTO_POR_MARCO.md). Distribuição de atributos, escolha/aplicação de fórmula e balanceamento por percurso/marco continuam pendentes; nada foi promovido do E05.

## Verificação focal e acesso local

- Revisados histórico/dependências, diff acumulado por categoria e alterações de runtime/dados. Sem arquivos internos do motor alterados; fórmulas/banco de equipamentos não mudaram. Workflow coincide com a infraestrutura existente e só permite acionamento manual pela main; nenhum workflow foi solicitado.
- Merges sem conflitos; igualdade exata de árvores com06dacca. Depois deles, somente documentação/evidência foi editada.
- 34 registros canônicos de plugins, UTF8 sem BOM, arquivos presentes e sintaxe dos plugins conferida. Abertura no Chrome156.0.8078.73 em contexto isolado, sem erros/recursos faltantes. Nova sessão normal tem atributos10/5/8/5/10/10, nível1, E05 inativo, dano normal e serialização/save habilitados; **nenhuma gravação**. [Evidência](evidencias/integracao-percurso-m01/verificacao.json).
- Não executada nova campanha completa, batalha, autoria no editor ou teste físico; aprovações e testes anteriores mantêm seus escopos. Não há conflito que justifique repetir baterias amplas.

**http://127.0.0.1:8765/** reutiliza o servidor Arena já ativo. Conferidos index, plugins/narrativa/E05/namespace e Map008 servidos contra os arquivos locais.8767 também serve Arena;8771 é outro serviço e foi preservado. Nenhum servidor iniciado, substituído ou encerrado. O serviço8765 permanece ativo. Atualizar a página se já estava aberta, sem limpar dados do site. Namespace permanece `arena:m01:save-v1`; saves localhost e Pages continuam separados.

Roteiro: **A** entrada da dungeon; **B** pausa natural intermediária, anotar local; **C** antes do Shift Gate/encerramento. Registrar dados do percurso conforme o modelo manual único, sem exigir todas as combinações ou repetir persistência já validada. Esta entrega prepara a referência; não afirma que o percurso de balanceamento foi realizado.

Publicar somente as duas features necessárias e develop, sem force push. Main permanecef62e026256ad82533412c2970fa539a519f924e0; Pages permanece no jogo9fab698. Pendências reais para concluir M01: implementação da distribuição solicitada em recorte autorizado, decisão/aplicação do modelo de dano, percurso/ajustes e regressões pertinentes, tratamento dos requisitos adiados de apresentação/mobile e consolidação final dos critérios de entrega. Ressalvas aceitas não viram bloqueios de revisão desktop nem são declaradas corrigidas.
