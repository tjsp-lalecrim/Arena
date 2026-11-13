# M02-03C — visão de Ria em Rihad

**Aprovação posterior do responsável —01/11/2026, versão explícita ad4af0e:** teste funcional satisfatório e direção artística aprovados. PilotoV01/arquivo/hash no [registro de arte](arte/MQ02_RIA_PILOTO_V01.json). Ambiente, dispositivo e casos técnicos adicionais não foram discriminados; não estender a aprovação aos testes manuais de chegada/arredores, persistência ou outras combinações. A aprovação do piloto não autoriza produzir variantes.

**Decisões vigentes:** [glossário](LOCALIZACAO_E_GLOSSARIO.md) aprova **Cajado do Caos** para Staff of Chaos. Em M02-03D, a tradução foi aplicada aos textos ativos de Ria/diário, mantendo IDs, imagens e contagem de palavras/cursor por bloco. A transcrição abaixo é histórica de ad4af0e; a release m01 permanece intacta. Ilustrações por bloco/composição futura estão no registro único [REF07](REFINAMENTOS_POS_INTEGRACAO_M01.md#ref07--refinamentos-futuros-da-narrativa): refinamentos não bloqueantes para a corte. Relato e limites anteriores abaixo descrevem a entrega antes desta aprovação.

01/11/2026. Feature `feature/m02-visao-ria`, sobre **3022750**, com02A/02B/03A/03B preservados. **Implementada para avaliação**, não aprovação manual nem conclusão de M02-03. Responsável adiou a avaliação dos recortes recentes para uma sequência com conteúdo novo; o adiamento não bloqueia este avanço técnico. Confirmação anterior continua restrita ao acesso da estrada/informante03A. Descanso/RAM dessa chegada, arredores e visão não receberam aprovação manual inferida.

## Fonte, tradução e recorte

Fonte primária lida diretamente em `D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\TEMPLATE.DAT`, sem alterar a instalação: **#1500**, bytes247099–247794 (fim exclusivo), e **#1294**,247795–248496. São os dois parágrafos completos da primeira visão depois da prisão. Conferência no PDF local `doc/wiki/Arena_Fang Lair (quest) - UESP Wiki - The Unofficial Elder Scrolls Pages.pdf`, pp.1–2, seção Another Vision. Identificador da página: https://en.uesp.net/wiki/Arena:Fang_Lair_(quest). Exports de consulta só em `tmp/ria-m02-review`, ignorado; nenhum arquivo original distribuído.

**Tradução:** mantém fortalecimento, função/essência do Staff, morte de Ria, oito fragmentos espalhados, primeiro em Fang Lair, anões de Kragen, lenda do dragão/Dragon’s Teeth, localização exata desconhecida, procura de sábios, ocultação incerta da identidade, cautela e bênçãos. Staff of Chaos/Fang Lair e topônimo próprio conservados; Great Wyrm traduzido como grande dragão, sem criar inimigo. Não revela Stonekeep, coordenadas ou destino de viagem.

**Condensação/apresentação:** dois parágrafos divididos em oito blocos curtos, conectivos ajustados e vocativos `%pcf/%pcn` omitidos; sem cortar o conteúdo explicativo. “This is the Staff” tornou-se “O Staff”: a composição-piloto não mostra o objeto, portanto não afirma um gesto ilustrado inexistente.

**Adaptação autorizada:** primeiro descanso explícito em Rihad no nível≥2; não omitir a primeira parte se já estiver no nível3, como a wiki relata para o original. Repouso sem horas/ataques; buscar moradores em Rihad substitui perguntas repetidas por províncias porque a viagem já foi condensada. A indicação da corte vem do informante **depois** da visão, não de Ria. Nenhum evento de audiência ou localização exata foi implementado.

## Textos utilizados

Configuração principal: [ArenaRiaVision.json](../data/ArenaRiaVision.json), schema1, IDs MQ02.ria.01–08. Transcrição histórica v1 de ad4af0e; configuração ativa recebeu somente a tradução aprovada Cajado do Caos em M02-03D:

1. Vejo que seus braços e sua mente se fortaleceram. É hora de começarmos esta jornada.

2. O Staff of Chaos é o único objeto capaz de abrir a passagem entre este mundo e a dimensão para a qual o Imperador foi banido. Tharn o usou para destruir minha forma corpórea quando tentei alertar o Conselho.

3. Tharn sabia que o Staff era quase indestrutível, pois fora criado da própria essência da terra. Mas nisso encontrou a chave: assim como a terra está dividida, ele o partiu em oito fragmentos perfeitamente formados.

4. Ele espalhou os fragmentos pelo reino. Consegui descobrir onde está o primeiro: em um lugar chamado Fang Lair.

5. Dizem que Fang Lair foi construído pelos anões de Kragen. Segundo a lenda, um grande dragão expulsou-os de seu lar nas Dragon’s Teeth e tomou o lugar para si.

6. Quem me dera conhecer sua localização exata. Talvez algum sábio ou estudioso saiba onde fica. Em suas profundezas úmidas repousa o primeiro fragmento do Staff of Chaos.

7. Desejo-lhe sorte. Não creio que Tharn saiba de sua fuga, mas pouco mais posso fazer nesta forma. Tentei ocultar sua identidade com um feitiço; não sei quanto isso poderá proteger você.

8. Tome cuidado: Tharn pode estar à sua procura. Siga com as bênçãos do verdadeiro Imperador e as minhas.

## Arte e apresentação

Única geração: **img/pictures/Arena_MQ02_Ria_piloto_v01.png**,1536×1024. Ferramenta integrada `image_gen.imagegen`, duas referências efetivamente fornecidas: RiaR02 aprovada (`arena_ria_narrativa_r02.png`) e print original `doc/prints/ria silmane.jfif`. [Prompt completo, papéis, hashes e inspeção](arte/MQ02_RIA_PILOTO_V01.json). V01 preserva rosto/cabelo/manto e luz espectral; troca a cela por bruma onírica abstrata, sem protagonista/mãos/silhuetas do jogador. O arquivo antigo com prisioneira e a pintura com grades/chave foram inspecionados e não usados como cena ativa. As versões anteriores permanecem intactas.

**Estado na entrega original ad4af0e, antes da aprovação acima: piloto artístico ainda não aprovado.** Bloco01 apresenta a amostra integrada;02–08 reutilizam explicitamente a **mesma composição provisória**, não oito ilustrações concluídas. Não houve lote/variantes/vozes. A identidade aprovada anterior é referência de continuidade, não aprovação automática deste asset.

Usa Scene_ArenaNarrative e MV_NarrativePages existentes. Somente o provedor MQ02 utiliza área sem cabeçalho, imagem proporcional ampla e painel de texto paginado com margens; intro/fim M01 preservam layout e arquivos anteriores. Teclado, clique e toque, foco visível e soltura/nova pressão. Em campanha há Salvar no rodapé; na fixture há Guardar/Carregar RAM. A última página oferece Despertar, sem confirmação adicional.

## Regras e persistência implementadas

- Somente `MQ02.rihad.rest`, Map009/(15,10), fora de batalha e MQ02 em10. A recuperação existente ocorre uma vez; o narrador não chama cura. Recursos já completos também permitem a visão, sem recuperação fictícia.
- Nível1 não grava início/conclusão e não bloqueia nível2 posterior. Não inicia em simples chegada/load, repouso da prisão ou E05.
- Namespace novo **arenaMQ02Narrative v1**, aditivo, com phase/section/word/history e operações MQ02.ria.begin/complete. MQ01 continua em arenaNarrative v2, sem receber fases MQ02. Save antigo recebe estado idle; namespace web arena:m01:save-v1 inalterado.
- Leitura retoma bloco/palavra/histórico; mudar resolução reflowa a página. Guardar/carregar não executa a recuperação de novo. Restaurar um checkpoint **anterior** retorna legitimamente à visão ainda não iniciada; não é duplicação da mesma linha temporal.
- Terminar toda a leitura registra conclusão e leva MQ02 **10→20**, objetivo riaVision. Não concede EXP, itens, pontos ou recompensas. Consulta seguinte ao informante orienta corte junto à muralha e leva20→30/askRihad, sem repetições ou revelar a localização da mina. Diário revela só esses conhecimentos.
- Descanso posterior pode restaurar recursos normalmente, mas não repete a visão ou a transição de etapa. Corte e missão permanecem indisponíveis; quest não está concluída.

## Um roteiro agrupado, quando o responsável avaliar

Não é necessário repetir testes isolados03A/03B agora. Pode reunir este roteiro à próxima entrega de conteúdo. Localhost existente: **http://127.0.0.1:8774/**; preservado e conferido pelo arquivo novo. Pelo editor: playtest e mesma opção do título.

1. Escolher **Rihad · visão de Ria (RAM)**. Acesso técnico prepara Bretã nível2, Vida35/Mana10/Vigor20, chegada(10,11), sem batalhas. Nível/EXP dessa preparação existem **somente nessa fixture**, não na campanha. A outra opção nível1/RAM continua disponível para o percurso dos quatro ratos.
2. Caminhar pela chegada e conversar com o informante. Menu → **Guardar teste em RAM**, se quiser o checkpoint anterior ao descanso.
3. Ir à plataforma **(15,10)** e usar Enter ou indicação por toque. Recuperação completa seguida da visão. Soltar e pressionar novamente para avançar; Voltar consulta leitura anterior.
4. No rodapé da visão, Guardar RAM, avançar e Carregar RAM demonstram retomada. Atenção: Carregar RAM recupera o último snapshot, inclusive um anterior à visão. Não escreve slots pessoais.
5. Ler até Despertar; voltar ao informante: orientação da corte, ainda fechada nesta versão. Conferir diário. Novo descanso não repete a visão. Guardar/carregar após concluir mantém esse estado.

RAM se perde ao fechar/recarregar/sair ao título. Na **campanha normal**, repouso segue os mesmos gatilhos, Salvar durante a leitura usa slots normais e Carregar retoma a posição; antes/depois usa o menu existente. Esse caminho foi testado em perfil/origem descartáveis, sem saves pessoais. Não limpar dados do site nem transferir saves entre origens.

## Evidências e limites

[14 grupos focais Chrome156](evidencias/m02-03c/resultado.json): nível1; evolução técnica posterior com recursos completos; nível2/recuperação única; pressão mantida; cursor/voltar; mouse/toque;640×400; RAM antes/durante/depois; save/load nativo durante/depois; avanço único20/30/diário e regressão curta da intro M01. Sem erros ou arquivos ausentes. Não repetidos os quatro combates, toda a dungeon ou laboratório02A: evidências03A/B de acesso/repouso/encontros preservadas.

Capturas reais: [piloto integrado](evidencias/m02-03c/visao-piloto.png), [leitura em640×400](evidencias/m02-03c/leitura-menor.png). [Integridade estática](evidencias/m02-03c/contratos.json): mapas/encontros/recursos/arte antiga/namespace e dados M01 preservados;42 plugins canônicos.

**Estado atual após a confirmação:** funcionamento da visão e direção artística aprovados em ad4af0e; Cajado do Caos é tradução aprovada no glossário, com aplicação aos dados ainda fora desta tarefa. Ilustrações próprias por bloco e nova composição são refinamentos futuros REF07; o reuso/layout atual aceito continua válido. Evidências técnicas/editor/dispositivos mantêm suas coberturas, sem testes adicionais atribuídos ao responsável. M02-03 parcial: próximo recorte recomendado é a audiência mínima na corte, não iniciado. Não produzir variantes automaticamente.
