# MOBILE-01 — adaptação mobile e aplicativo Android

Marco **técnico**, paralelo à numeração M01–M10 da campanha. **Planejado, não iniciado; data de execução a planejar.** Não é dependência do fechamento desktop do M01 nem de cada entrega desktop. Identificador aprovado em30/10/2026; esta documentação não autoriza implementação ou seleção de tecnologia.

## Alvos e entrada

- Referência desktop aprovada/identificada e contratos de dados/saves documentados. Usar a entrega M01 desktop quando aprovada; iniciar antes dela exigiria escolher explicitamente outra referência técnica, sem reabrir sua campanha.
- Autorizar um recorte pequeno, seus critérios e ambiente de avaliação; inventariar controles/recursos já existentes antes de alterar. Preservar teclado/mouse, suporte por toque atual e gameplay.
- Galaxy A56 disponível para as etapas físicas; registrar versão de Android, navegador/runtime, build, orientação e resultados quando testar. Ausência temporária do aparelho não bloqueia entregas desktop.
- Antes da etapa de aplicativo, aprovar a avaliação de empacotamento e a política de armazenamento/atualização. **Nenhuma tecnologia foi escolhida**, nenhum APK foi gerado ou instalado.

## Entregas pequenas e dependências

| Item subordinado | Dependência | Critério de aceitação do futuro recorte |
| --- | --- | --- |
| MOBILE-01.1 — navegação por toque | Referência de entrada | Mapear entrada/retorno/cancelamento nos menus; resolver acesso intuitivo (REF13), foco/alvos e acionamentos involuntários, sem depender de teclado/hover; preservar alternativa já existente |
| MOBILE-01.2 — layout e leitura | .1 e inventário das áreas atuais | Tratar escala, margens, cortes/overflow, áreas seguras e uso da tela; distinguir canvas exibido, resolução interna e fullscreen (recorte mobile REF14/REF15); validar primeiro uma tela representativa |
| MOBILE-01.3 — paisagem/fullscreen | .2 | Implementar/avaliar somente onde suportado, entrada/saída e fallback claros; conferir coordenadas de toque, giro e barras do navegador; não chamar suporte parcial de atendimento integral |
| MOBILE-01.4 — desempenho e ciclo | Base de .1; telas representativas de .2 | Registrar carregamento/fluidez, pausa/retomada, perda de foco, rotação e interrupção de processo; não duplicar ações, alterar recursos ou perder progresso legitimamente salvo. Limites/medidas definidos no recorte, sem prometer desempenho agora |
| MOBILE-01.5 — persistência e compatibilidade | .4 para web; .6/.7 para provas do app | Documentar armazenamento de cada destino, versões compatíveis e atualização; no navegador e no app, salvar/reabrir/carregar sem duplicação/perda, usando dados de teste. Parte web pode ser concluída antes do APK; parte app aguarda artefato e integra o aceite de .7 |
| MOBILE-01.6 — avaliação de empacotamento Android | Contratos de .5 e limites observados em .1/.4 | Comparar soluções adequadas ao MV, dependências/licenças, manutenção, ciclo de vida, segurança/permissões e armazenamento; apresentar recomendação e obter decisão antes de adotar. Não escolher nem instalar tecnologia nesta tarefa |
| MOBILE-01.7 — APK no Galaxy A56 | Solução .6 aprovada, contrato .5 e recorte de UI/ciclo validado | Gerar artefato identificado por commit/versão, definir assinatura de teste/atualização, instalar e abrir no A56; validar controles, pausa/retomada e persistência do aplicativo, inclusive atualização compatível conforme política aprovada. Registrar limitações; nenhum compromisso com loja ou migração automática |

## Vínculos sem duplicação

O escopo detalhado das pendências permanece em [REFINAMENTOS_POS_INTEGRACAO_M01.md](REFINAMENTOS_POS_INTEGRACAO_M01.md): **REF13** entra em.1; somente a parte mobile da **REF14** entra em.2/.3; somente leitura/apresentação mobile da **REF15** entra em.2. Critérios por toque de REF01 e outros sistemas serão verificados quando afetados; isso não autoriza implementar favoritos, simplificação de menus ou redesign desktop por associação. Não criar novos REF para os mesmos problemas.

Paisagem/fullscreen seguem **não atendidos**, aceitos como adiados no M01 e agora vinculados a este marco. Suporte parcial por toque/execução não comprova mobile pleno ou APK. A confirmação atual do responsável cobre somente distribuição de pontos no mobile; não acrescenta salvar/reabrir. Evidências anteriores PC/A56 e suas versões continuam em [VALIDACAO_M01.md](VALIDACAO_M01.md); reutilizar cobertura válida sem repetir toda a campanha em cada recorte.

## Armazenamento e publicação

Manter os contratos/migrações existentes; não trocar namespace por build nem presumir que navegador e APK compartilhem origem ou diretório. **Não prometer migração automática de saves entre navegador e APK**. Exportação/importação/sincronização exigiria outro escopo e decisão, não está incluída como solução já aprovada.

Testes atuais concentram-se no navegador do PC, inicialmente Chrome. Preservar toque existente e fazer regressão focal emulada quando a mudança afetar entrada compartilhada; não exigir aparelho físico ou Pages a cada entrega desktop. Pages permanece atualização manual de versões escolhidas para avaliação, conforme PUBLICACAO_TESTE_PAGES_M01_19.md. Critério final do MOBILE-01: registrar o que foi efetivamente suportado no navegador mobile e no APK separadamente, com evidências físicas e ressalvas aceitas; conclusão futura não será inferida de testes parciais.
