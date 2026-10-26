"""Approval trace and functional release gate for M01-07; never asserts final combat balance."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[1]
def read(p):return json.loads((R/p).read_text(encoding='utf-8'))
d=read('doc/decisoes/M01_07_APROVACAO_R05.json');cat=read('data/ArenaCatalog.json')
original=subprocess.check_output(['git','show','1dd9a6c:doc/AUDITORIA_BONUS_RACIAIS_M01_07.md'],cwd=R)
assert hashlib.sha256(original).hexdigest()==d['proposal']['gitBlobSha256']
assert (R/d['proposal']['immutableCopy']).read_bytes().replace(b'\r\n',b'\n')==original
assert [{k:r[k] for k in ['id','bonus','bonusLabel','application']} for r in cat['races']]==d['races']
art=read(d['artManifest']);assert len(art['activeFiles'])==64 and len(art['selectedPilotFiles'])==8
for row in art['activeFiles']+art['selectedPilotFiles']:
 p=R/row['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'];assert list(Image.open(p).size)==row['size']
assert len(art['portraitFindings'])==16
assert {i['id'] for i in art['deferredIssues']}=={'VIS-M07-01','VIS-M07-02','VIS-M07-03'}
base=json.loads(subprocess.check_output(['git','show','1dd9a6c:data/ArenaCharacterVisuals.json'],cwd=R))
assert read('data/ArenaCharacterVisuals.json')==base,'No new visual assignments or unrelated ID changes'
assert not subprocess.check_output(['git','diff','1dd9a6c','--','img','art'],cwd=R),'No generation/visual corrections authorized this round'
prefix='doc/evidencias/m01-07-fechamento/'
bonus=read(prefix+'bonus-aprovados-result.json');assert len(bonus['matrix'])==16 and len(bonus['legacy'])==8 and not bonus['errors']
assert len(bonus['checks'])>=981 and len(bonus['labels'])==8
for row in bonus['labels']:assert row['width']<=row['maxWidth'] and row['text']==next(r['bonusLabel'] for r in cat['races'] if r['id']==row['id'])
creation=read(prefix+'m01-07-result.json');assert len(creation['checks'])==234 and not creation['errors']
visuals=read(prefix+'resultado.json');assert len(visuals['results'])==16 and len(visuals['saves'])==16 and not visuals['errors']
persistence=read(prefix+'persistencia-result.json');assert len(persistence['checks'])==27 and not persistence['errors']
pointer=read(prefix+'m01-07-pointer-result.json');assert len(pointer['results'])==2 and all(not r['errors'] for r in pointer['results'])
print('PASS approved proposal/version/hash,72 preserved visual files,16 portrait reservations,981 bonus checks,234 creation checks,16 visual roundtrips,27 persistence checks,mouse/emulated touch. Final combat/mobile balance remains pending.')
