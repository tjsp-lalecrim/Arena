# M02-03D — audiência mínima de Rihad

01/11/2026. Feature `feature/m02-corte-rihad`, sobre **65e0c12**, preservando ad4af0e e as dependências02A/02B/03A/B/C. Implementação para avaliação; a aprovação funcional/artística da visão de Ria não aprova esta audiência. Tag/release m01 intactas. Sem Stonekeep, novas batalhas, arte gerada ou redesign narrativo.

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

**Pendentes:** avaliação do responsável desta audiência/apresentação provisória e novo playtest/autoria no editor MV. Chrome automatizado não comprova autoria no editor; nenhum teste físico mobile novo. Arte/layout narrativos aprovados e refinamentos REF07 preservados. Próximo recorte recomendado: **M02-04, amostra integrada de Stonekeep**, após avaliação desta entrega; não iniciado.
