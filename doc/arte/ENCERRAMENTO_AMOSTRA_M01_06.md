# Encerramento do escopo de amostra M01-06

Data25/10/2026. Base3d62a27. Reavaliação dos critérios do backlog e da solicitação atual: todas as categorias mínimas estão geradas e vistas no motor MV1.6.1 em navegador desktop. Evidências existentes foram revisadas, sem repetir produção ou atribuir novos testes ao aparelho/editor.

| Critério | Evidência e limite |
| --- | --- |
| Arquivos/versões aprovados | APROVACAO_DIRECAO_R02_R03.json, seis hashes; dungeon R02, rato R03, Ria R02 |
| Prompts/fontes | Quatro registros de prompts preenchidos, manifests auditados; original/manual/prints/wiki distinguidos |
| Escala/transparência/recortes | audit-art-records.py:27 registros; exports em32/48/64/96/144px, screenshots nativas R04/R05 |
| Animações no motor | Caminhada nativa da piloto, rato R03 com quatro quadros0/96/192/288 no Sprite MV; test-art-integration/test-art-preview e visor de frames. Pose lateral do jogador é exemplo estático, não animação completa |
| Continuidade exploração/combate | Mesma piloto, cabelo, pele, roupa/couro entre mapa, retrato e pose lateral; ficha mestre preservada; não estende cobertura às demais combinações |
| Narrativa sem protagonista | Ria R02 revisada, imagem e fundo opaco vistos no motor; conceito da cela sem jogador; ilustração antiga com prisioneira rejeitada para narrativa reutilizável |
| Regressões | M01-05 validado,27 testes de persistência; laboratório/galerias/save-load e banco aprovados. R05 registra timeout inicial do boot e rerun aprovado |

M01-06 concluído **como primeira amostra desktop**, não como biblioteca final ou combate. A aprovação artística é evidência separada das verificações técnicas. Inspeção visual do gerenciador/editor continua parcialmente limitada pela captura; salvar/reabrir nativos auditados em R05, nomes/ordem/status/parâmetros preservados. Isso não é teste visual de playtest no editor. Galaxy A56 permanece não testado. Estas verificações continuam no roteiro de autoria/M01-19 e não são confundidas com funcionamento do motor no navegador.

A antiga pendência de todos os estados de combate pertence a M01-10; arquitetura definitiva a M01-14; catálogo racial à M01-07; duas armaduras/variações finais a M01-12. Não exigir esses sistemas futuros para concluir os exemplos de formato de M01-06. Sem construir dungeon final, sem regenerar aprovados. Novas combinações devem ser validadas separadamente na feature de criação.
