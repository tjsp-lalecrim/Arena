# M02-03D — audiência mínima de Rihad

**Extensão vigente M02-05:** [entrega do pergaminho](ENTREGA_PERGAMINHO_M02_05.md) implementa50→60, recibo/fonte aposentada e Fang Lair conhecida sem viagem. Audiência/ilustrações continuam provisórias; cobertura manual anterior não aprova a extensão. A indisponibilidade da entrega abaixo preserva o histórico03D.

**Continuidade M02-04:** [amostra Stonekeep](STONEKEEP_M02_04.md) agora habilita a viagem pelo acesso da estrada após o aceite e atualiza os avisos/diário correspondentes. A indisponibilidade descrita no registro03D abaixo é histórica. Entrega do pergaminho permanece ausente; aprovação funcional e ausência de aprovação estética desta corte preservadas.

**Confirmação do responsável —01/11/2026:** diálogo da audiência funciona e a quest atualiza. Referência entregue/disponível **fe99ac3**; o relato não informou hash nem ambiente. Não atribuir aprovação estética dos placeholders ou testes adicionais de persistência, recusa, transferências, editor ou dispositivo. Evidências automatizadas abaixo permanecem identificadas separadamente.

01/11/2026. Feature `feature/m02-corte-rihad`, sobre **65e0c12**, preservando ad4af0e e as dependências02A/02B/03A/B/C. Registro da implementação original, anterior à confirmação acima; a aprovação funcional/artística da visão de Ria não se estende à estética desta audiência. Tag/release m01 intactas. Sem Stonekeep, novas batalhas, arte gerada ou redesign narrativo.

## Conteúdo e fontes

Leitura direta, somente consulta, de `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\TEMPLATE.DAT`: **#1315**, bytes263040–264020 (fim exclusivo), pedido/troca de informações; **#1316**,264021–264352, aceitação/advertência; **#1317**, início264353, recusa. Conferência no PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, p.2, Where Is Fang Lair / Quid Pro Quo1. A wiki identifica Blubamka; o original usa placeholders de nome/título. Não houve observação nova de partida DOS nem confirmação de uma planta do palácio.

Tradução/condensação em [ArenaCourt.json](../data/ArenaCourt.json): goblins levaram tesouros e um pergaminho que permite decifrar a localização de Fang Lair; fugiram para Stonekeep; uma pessoa pode ter mais sucesso que soldados; recuperar o pergaminho em troca dessa informação. Depois do aceite, o rumor de Golthog servir ao Underking permanece **rumor**. Golthog é citado, sem criar chefe/encontro. A revelação posterior à entrega (#1319) não foi antecipada.

Adaptações explícitas: indicar um destino lógico substitui marcar o mapa mundial; confirmação com opção de recusa selecionada inicialmente; aviso do limite da versão. A localização exata de Fang Lair, a entrega e recompensas não são simuladas. A tradução já aprovada **Cajado do Caos** foi aplicada nos textos ativos de Ria/diário: mesmos IDs, imagens e contagens de palavras por bloco, preservando os cursores. Transcrições/prompts históricos e release m01 não foram alterados.

## Mapa e estado

- Acesso Map009, evento5 **Acesso à corte de Rihad**, (10,4). Porta visual6 em (10,3), fechada/estática e provisória, na face da parede; o gatilho fica no piso diante dela. Não é uma nova animação de porta.
- Map011 **M02-03 Corte de Rihad (provisória)**,17×13; chegada (8,10), rainha/evento2 (8,5), saída/evento1 (8,11) para Map009 (10,5). Piso conectado; paredes e NPC bloqueiam normalmente. Altura de parede/cobertura conforme contrato existente.
- Materiais de dungeon/plataforma e sprite `$Arena_redguard_female_walk_r02` são **reuso provisório identificado na tela**, sem afirmar arquitetura, rosto, raça ou traje canônicos de Blubamka. Não constituem novo padrão artístico aprovado. Sem ilustrações novas.
- Antes de MQ02=30, a rainha orienta procurar o informante; não concede missão. Em30, conversa com **Aceitar o pedido / Agora não**. Escape equivale a recusa, mesmo com Aceitar destacado. Encerrar antes da escolha não aceita.
- Confirmação explícita avança30→40, registra `parchmentRequest`, sem concluir MQ02 ou conceder cura, EXP, dinheiro ou itens. Repetir dá apenas lembrete. Diário registra pedido e objetivo do pergaminho.
- `stonekeep.entry` é conhecido a partir de40, mas `available=false`; área Stonekeep continua sem mapa. Conhecimento deriva da etapa persistida, sem outra flag de save. MQ01/Ria/fontes/recibos anteriores preservados.
- Soltar o comando é obrigatório após a transferência e antes da escolha; fechar texto não aciona novamente a interação. Nenhum arquivo interno do motor foi alterado.

Origem reconstruível: `node tools/build-rihad-arrival.cjs` também chama `build-rihad-court.cjs`. Ambos preservam chegada, repouso, arredores e registros anteriores. Carregar um save antigo de Map009 acrescenta somente os eventos5/6 ausentes antes dos sprites, sem reconstruir suas outras interações.

## Planejamento visual futuro — REF07

Aplicação posterior delimitada, vinculada à [REF07](REFINAMENTOS_POS_INTEGRACAO_M01.md#ref07--refinamentos-futuros-da-narrativa); padrões e processo nas fontes principais DIRECAO_DE_ARTE.md e DIRETIVA_DE_NAVEGACAO.md. Não é autorização de produção nem bloqueio de Stonekeep. A identidade regional é adaptação autorizada; raça, aparência e traje canônicos de Blubamka ainda exigem evidência específica, não inferência por Rihad ou pelo sprite emprestado.

Correspondência preliminar a conferir com fontes antes de gerar; blocos não equivalem a cada frase/página da janela:

| Bloco significativo | Composição planejada e limites |
| --- | --- |
| Apresentação da rainha e situação de Rihad | Blubamka no ambiente da corte; Papel/pedido em #1315 e nome Blubamka na wiki local. Arquitetura, fisionomia e roupa só serão canônicas com fonte; demais detalhes são interpretação regional. Não incluir protagonista |
| Roubo do pergaminho e acordo de recuperação | Blubamka e contexto do pedido; objeto/reconstituição do roubo somente após conferir referências e identificar representação simbólica. #1315 sustenta o acontecimento, não a aparência exata. Sem mostrar a localização de Fang Lair ou antecipar a entrega |
| Aceitação e advertência | Contexto da rainha advertindo, apoiado em #1316. Não ilustrar o rumor como fato comprovado, inventar chefe Golthog ou revelar conteúdo futuro |
| Recusa, orientação prematura e lembrete | Reutilizar composição adequada do bloco correspondente; sem imagem diferente para cada resposta repetitiva |

Primeira produção futura: escolher **uma** amostra — personagem da corte ou ilustração representativa da audiência —, listar arquivo/conteúdo/finalidade e apresentar integrada ou em mockup na escala prevista. Conferir a correspondência acima antes da autorização da produção; não reunir personagem, arquitetura e todas as ilustrações num lote. A preparação dos novos assets segue o padrão visual vigente; a troca dos placeholders e a mudança da interface permanecem entregas próprias.

## Avaliação curta em localhost/editor

Servidor já existente conferido: **http://127.0.0.1:8774/**, mantido ativo. No editor, abrir o projeto normalmente e executar o playtest. Nenhum save pessoal precisa ser aberto.

1. Título → **Rihad · audiência (RAM)**. Fixture explícita prepara Bretã/nível2, Ria já lida e orientação da corte; não altera a campanha normal. Os recursos começam parcialmente gastos para tornar visível qualquer recuperação indevida.
2. Na esplanada, caminhar ao norte até **Corte ↑**, (10,4). Dentro, aproximar-se de Blubamka em (8,5), pela posição (8,6), e pressionar Enter/clicar.
3. Ler a oferta; experimentar **Agora não** ou Escape. Conversar novamente e escolher **Aceitar o pedido**. Nenhuma recompensa é devida agora.
4. Menu → **Diário**: pedido aceito e recuperação do pergaminho em andamento; Stonekeep ainda indisponível. Na sessão técnica, **Guardar teste em RAM / Carregar teste da RAM** permitem conferir a retenção sem slots pessoais. Fechar/recarregar o navegador perde esse checkpoint RAM; salvamento normal continua disponível em campanha normal.
5. Sair pelo centro sul (8,11), retornar à esplanada. Nada de cura/EXP/viagem para Stonekeep. Retorno ao título permanece pelo menu existente.

## Evidências e limites

[Resultado focal](evidencias/m02-03d/resultado.json), [contratos](evidencias/m02-03d/contratos.json), capturas [corte](evidencias/m02-03d/corte.png), [pedido](evidencias/m02-03d/pedido.png) e [diário](evidencias/m02-03d/diario.png). Teste reproduzível: `node tools/test-rihad-court.cjs`, com Playwright/Chrome disponíveis. Servidor/origem e perfil descartáveis, fixture RAM e save nativo sintético16; sem saves pessoais e sem repetir dungeon, combate ou visão completos.

Cobertura: etapas10/20/30/40, recusa/Escape/aceite único, teclado/mouse/toque emulado, soltura, texto completo antes da escolha, conectividade/colisão, ida/volta, diário, preservação dos dados anteriores, RAM, salvar/F5/carregar em campanha sintética, complemento do acesso em save antigo e idempotência do gerador pai. A primeira inspeção visual identificou reinício da última linha ao desativar a escolha durante a proteção; corrigido mantendo a propriedade nativa da janela, com teste específico de término do texto.

**Pendentes:** aprovação estética dos placeholders não concedida; aplicação visual futura em REF07, sem bloqueio de conteúdo. Novo playtest/autoria no editor MV não foi informado. Chrome automatizado não comprova autoria no editor; nenhum teste físico mobile novo. Arte/layout narrativos aprovados e refinamentos REF07 preservados. Próximo recorte recomendado: **M02-04, amostra integrada de Stonekeep**, por dar continuidade ao objetivo do pergaminho já aceito; não iniciado. A confirmação funcional acima não amplia as aprovações manuais dos recortes anteriores.
