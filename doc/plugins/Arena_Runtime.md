# Arena_Runtime 0.1.0

Arquivo js/plugins/Arena_Runtime.js. Configuração básica reutilizável, sem conteúdo Arena. Motor alvo/verificado: MV 1.6.1; outras versões não verificadas. Sem dependências externas; carregar antes de Arena_TechnicalPreview. Não ativar junto com Community_Basic (ambos definem cache/dimensões). Outros conflitos não foram auditados.

## Instalação e parâmetros

Copiar para js/plugins, ativar como Arena_Runtime. Exemplo mínimo: parâmetros vazios aplicam cache 20 MPix, Width 816 e Height 624. CacheMegapixels inteiro de 1 a 512; Width/Height inteiros de 480 a 4096. Ausência, NaN, infinito, fracionário ou fora dos limites usa o padrão. Sem comandos, notas ou assets.

Altera ImageCache.limit e SceneManager._screenWidth/_screenHeight/_boxWidth/_boxHeight. Não altera renderer, corrida, salvamento ou banco. Desativar retorna aos valores do motor (cache 10 MPix; tela 816×624). Sem migração de save. Resoluções extremas aceitas não são recomendação de layout; interface só verificada na configuração do projeto.

## Substituição do Community_Basic

Inventário anterior: cacheLimit=20; screenWidth=816; screenHeight=624; renderingMode=auto; alwaysDash=off; redimensionamento NW.js vazio. Apenas o cache difere do motor. Mantidos 20 MPix; dimensões iguais às nativas; seleção auto/canvas/webgl e corrida inicial desligada seguem o código nativo, inclusive configuração de corrida já salva. Não há ajuste de janela NW.js necessário na configuração existente. Community_Basic preservado no disco e desativado no gerenciador, sem copiar sua implementação.

## Validação e reutilização

Ver tools/test-runtime.cjs para valores padrão, inválidos, configuração alternativa e ausência de conteúdo Arena. tools/test-boot.cjs verifica a configuração efetiva no Chrome e fluxo básico. Evidências e versões em VALIDACAO_M01.md. NW.js e aparelho ainda não testados. Histórico: 0.1.0 substitui apenas os ajustes básicos necessários ao laboratório.
