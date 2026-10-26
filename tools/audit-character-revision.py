"""Meaningful alpha/packing/regression checks for the character revision."""
from pathlib import Path
from PIL import Image
import json, subprocess, hashlib
import os
R=Path(__file__).resolve().parents[1]
before=json.loads(subprocess.check_output(['git','show','37e1729:data/ArenaCharacterVisuals.json'],cwd=R))
after=json.loads((R/'data/ArenaCharacterVisuals.json').read_text(encoding='utf-8'))
expected_rules=dict(before['rules'])
expected_rules['weaponSkillIds']=[i for i in expected_rules['weaponSkillIds'] if i not in [3,4]] # R04: documented unarmed exclusion, no numerical balance change.
assert after['rules']==expected_rules and after['schemaVersion']==before['schemaVersion'] and after['arrivalMapId']==before['arrivalMapId']
assert set(after['visuals'])==set(before['visuals'])
sources=json.loads((R/'doc/arte/fontes-personagens-revisao-r02.json').read_text(encoding='utf-8'))
assert len(sources['requests'])==7
for req in sources['requests']:
    assert hashlib.sha256((R/req['output']).read_bytes()).hexdigest()==req['outputSha256']
    assert req['referencesActuallyAttached']
    for ref in req['referencesActuallyAttached']:
        assert len(ref['sha256'])==64 and ref['size'][0]>0 and ref['size'][1]>0
        p=R/ref['file']
        # Ignored consultation sources need not exist on a clean clone. When
        # present, verify them; generated masters are always required.
        if ref['distribution']!='ignored consultation only':assert p.is_file()
        if p.exists():assert hashlib.sha256(p.read_bytes()).hexdigest()==ref['sha256']
for name in ['prompts-revisao-personagens-r02.json','prompts-correcao-personagens-r03.json']:
    log=json.loads((R/'doc/arte'/name).read_text(encoding='utf-8'))
    for req in log['requests']:
        assert len(req['prompt'])>500 and req['referenced_image_paths'] and (R/req['resultFile']).is_file()
results=[]
for key,v in after['visuals'].items():
    for field in ['id','ready','poseStatus','battlerStatus']:assert v[field]==before['visuals'][key][field]
    sheet=Image.open(R/'img/characters'/(v['character']+'.png')).convert('RGBA')
    boxes=[]
    for row in range(4):
        phases=[sheet.crop((col*48,row*64,(col+1)*48,(row+1)*64)) for col in range(3)]
        for f in phases:
            b=f.getbbox();assert b and 0<b[0]<b[2]<48 and 0<b[1]<b[3]<=62,(key,b)
            assert 53<=b[3]-b[1]<=58,(key,b)
            boxes.append(b)
        if key!='breton.female.base':assert len({f.tobytes() for f in phases})==1
        else:assert len({f.tobytes() for f in phases})>1,'Existing walk must remain a cycle'
    side=Image.open(R/'img/pictures'/(v['sidePicture']+'.png')).convert('RGBA')
    sb=side.getbbox();assert sb and sb[1]>=5 and sb[3]==94 and sb[3]-sb[1]==88,(key,sb)
    battle=Image.open(R/'img/sv_actors'/(v['battler']+'.png')).convert('RGBA')
    assert battle.size==(864,576)
    for row in range(6):
        for col in range(9):assert battle.crop((col*96,row*96,(col+1)*96,(row+1)*96)).tobytes()==side.tobytes()
    face=Image.open(R/'img/faces'/(v['face']+'.png')).convert('RGBA')
    assert face.size==(576,288) and face.crop((144,0,576,288)).getbbox() is None
    results.append({'id':key,'mapFrameBoxes':boxes,'sideBox':sb,'portraitBox':face.crop((0,0,144,144)).getbbox()})
out=R/os.environ.get('ARENA_EVIDENCE_DIR','doc/evidencias/personagens-r02');out.mkdir(parents=True,exist_ok=True)
(out/'alpha-quadros.json').write_text(json.dumps({'checks':'Stable IDs/approved rules with R04 unarmed exclusion;192 directional cells; walk retained;864 static native SV cells; alpha margins;64 runtime files','results':results},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('PASS192 directional cells,864 SV cells,16 alpha/margin sets, preserved walk; approved rules with R04 unarmed exclusion, stable keys/statuses.')
