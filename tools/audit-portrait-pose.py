"""Pose is a human visual gate. This audit verifies provenance and integration only."""
from pathlib import Path
from PIL import Image
import subprocess,json,hashlib
R=Path(__file__).resolve().parents[1]
base=json.loads(subprocess.check_output(['git','show','0a917f8:data/ArenaCharacterVisuals.json'],cwd=R))
base['rules']['weaponSkillIds']=[i for i in base['rules']['weaponSkillIds'] if i not in [3,4]] # R04 technical classification fix only.
now=json.loads((R/'data/ArenaCharacterVisuals.json').read_text(encoding='utf-8'))
review=json.loads((R/'doc/arte/avaliacao-retratos-pose-r03.json').read_text(encoding='utf-8'))
log=json.loads((R/'doc/arte/prompts-retratos-pose-r03.json').read_text(encoding='utf-8'))
manifest=json.loads((R/'doc/arte/exportacoes-retratos-pose-r03.json').read_text(encoding='utf-8'))
fixed=log['fixedBlock'];assert fixed in (R/'doc/arte/PROCEDIMENTO_RETRATOS.md').read_text(encoding='utf-8')
assert len(review['reviews'])==16 and len(log['requests'])==4 and len(review['requests'])==4
for req in log['requests']:
    assert fixed in req['prompt'] and len(req['referenced_image_paths'])==len(req['referenceRoles'])
    assert (R/req['resultFile']).is_file()
for req in review['requests']:
    for ref in req['referencesActuallyProvided']:
        p=R/ref['file']
        if not p.exists():p=R/ref['archivedIdenticalCopy']['file']
        assert hashlib.sha256(p.read_bytes()).hexdigest()==ref['sha256']
for group in ['masters','exports']:
    assert manifest[group]
    for rec in manifest[group]:
        p=R/rec['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==rec['sha256'];assert list(Image.open(p).size)==rec['size']
assert set(now)==set(base)
assert set(now['visuals'])==set(base['visuals'])
for k in now:
    if k!='visuals':assert now[k]==base[k]
changed=[]
for key,v in now['visuals'].items():
    for field in v:
        if field!='face':assert v[field]==base['visuals'][key][field]
    if v['face']!=base['visuals'][key]['face']:
        changed.append(key)
        im=Image.open(R/'img/faces'/(v['face']+'.png')).convert('RGBA')
        assert im.size==(576,288) and im.crop((144,0,576,288)).getbbox() is None
        assert im.crop((0,0,144,144)).getbbox()
assert set(changed)=={'argonian.male.base','argonian.female.base','khajiit.male.base','khajiit.female.base'}
for metric in manifest['metrics']:
    x1,y1,x2,y2=metric['headBoundsEstimate'];assert 0<x1<x2<144 and 0<y1<y2<144
print('PASS4 face changes only;12 face refs and all body/rules unchanged; exact fixed block,4 actual prompt/reference logs, hashes/dimensions/head margins. Anatomy remains manual inspection, owner approval pending.')
