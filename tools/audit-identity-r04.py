"""Check candidate provenance and minimal technical fix, never aesthetics/production approval."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[1]
def read(p):return json.loads((R/p).read_text(encoding='utf-8'))
base=json.loads(subprocess.check_output(['git','show','1399af8:data/ArenaCharacterVisuals.json'],cwd=R))
base['rules']['weaponSkillIds']=[i for i in base['rules']['weaponSkillIds'] if i not in [3,4]]
assert read('data/ArenaCharacterVisuals.json')==base,'Only documented unarmed exclusion may change runtime config'
catalog=read('data/ArenaCatalog.json');approval=read('doc/decisoes/M01_07_APROVACAO_R05.json')
assert [{k:r[k] for k in ['id','bonus','bonusLabel','application']} for r in catalog['races']]==approval['races'],'R05 approved values/labels must match the recorded R04 proposal'
log=read('doc/arte/prompts-identidade-r04.json');sources=read('doc/arte/fontes-identidade-r04.json');manifest=read('doc/arte/exportacoes-identidade-r04.json')
assert len(log['requests'])==len(sources['requests'])==4
for req in log['requests']:
 assert log['fixedPortraitBlock'] in req['prompt'] and not req['productionReady']
 assert len(req['referenced_image_paths'])==len(req['referenceRoles'])
 assert (R/req['resultFile']).is_file()
for req in sources['requests']:
 for ref in req['referencesActuallyProvided']:
  p=R/ref['file'];assert len(ref['sha256'])==64 and ref['role']
  if ref['distribution']!='ignored consultation only':assert p.is_file()
  if p.exists():assert hashlib.sha256(p.read_bytes()).hexdigest()==ref['sha256']
for group in ['masters','exports']:
 assert manifest[group]
 for entry in manifest[group]:
  p=R/entry['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==entry['sha256'];assert list(Image.open(p).size)==entry['size']
for entry in manifest['exports']:assert not entry['file'].startswith('img/')
assert 'NO runtime integration' in manifest['status']
for metric in manifest['measurements']:
 assert all(sample['alpha']==0 for sample in metric['backgroundAlphaSamples'])
 for name,size,feet in [('map-front-study48x64',(48,64),62),('side-study96',(96,96),94)]:
  im=Image.open(R/f"art/candidates/identidade-r04/{metric['race']}-male-{name}.png").convert('RGBA')
  assert im.size==size and im.getbbox()[3]==feet and im.getchannel('A').getextrema()[0]==0
 assert metric['sourceCombatTouchesRightEdge']==(metric['race']=='khajiit')
for name in ['antes-correcao','depois-correcao']:
 data=read('doc/evidencias/auditoria-racial-r04/'+name+'.json');assert len(data['rows'])==8 and not data['proposalsApplied'] and not data['errors']
 assert all(len(row['samples'])==7 for row in data['rows'])
print('PASS R04 provenance preserved; active visuals unchanged; R05 catalog matches approved proposal. Pilot technical limits retained; aesthetics accepted with reservations in R05.')
