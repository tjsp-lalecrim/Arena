"""Audit provenance and real atlas cells; pixel checks do not approve aesthetics."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[1]
def record(p):return {'file':p.relative_to(R).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
cfg=json.loads((R/'data/ArenaBattleMotion.json').read_text());exports=json.loads((R/'doc/arte/COMBATE_EXPANSAO_R03_EXPORTS.json').read_text());assert not exports['failures'];assert len(exports['profiles'])==17
files=[];total=0
for folder,profiles in [('sv_actors',cfg['actors']),('enemies',cfg['enemies'])]:
 for key,p in profiles.items():
  f=R/('img/'+folder+'/'+p['file']+'.png');im=Image.open(f).convert('RGBA');cells=[]
  for name,m in p['motions'].items():
   hashes=[]
   for n,frame in enumerate(m['frames']):
    x,y,w,h=frame['rect'];cut=im.crop((x,y,x+w,y+h));box=cut.getbbox();assert box and box[0]>0 and box[1]>0 and box[2]<w and box[3]<h
    digest=hashlib.sha256(cut.tobytes()).hexdigest();hashes.append(digest);cells.append({'motion':name,'frame':n,'alphaBox':box,'sha256':digest});total+=1
   assert len(set(hashes))>=4,(key,name)
  files.append({**record(f),'participant':key,'version':p.get('version','R02 approved pilot'),'cells':cells})
assert total==744
for path in ['img/sv_actors/Arena_Combat_breton_female_r02.png','img/enemies/Arena_Combat_rat_r02.png']:
 assert (R/path).read_bytes()==subprocess.check_output(['git','show','a61977b:'+path],cwd=R)
masters=[{**record(p),'dimensions':Image.open(p).size} for p in sorted((R/'art/masters/combate-r03-expansao').glob('*.png'))];assert len(masters)==22
prompts=[]
for p in sorted((R/'doc/arte').glob('PROMPT_COMBATE_EXPANSAO_R03_*.json')):
 d=json.loads(p.read_text(encoding='utf8'));assert len(d['prompt'])>200;prompts.append(record(p))
assert len(prompts)==22
report={'version':'M01-10/R03 expansion','coverage':{'actors':16,'enemies':3,'timedCells':total,'newTimedCells':678},'ownerApproval':'R02 Breton female/Rat only, associated with a61977b; no approval inferred for new variants','reusedNeutralReturns':'Dark elf male idle5/heavy5/hurt5; Lizard Man hurt5, replacing clipped source endpoints. Not42 unique drawings claimed per actor.','sourceLimits':'Three source sheets omit defeat poses; Redguard female also omits hurt pose. Only those rows replaced by logged AI strips. Lizard thrust study preserved but unused; current skill11 uses separate bite strip.','masters':masters,'prompts':prompts,'atlases':files}
(R/'doc/arte/COMBATE_EXPANSAO_R03_MANIFEST.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('PASS744 bounded timed cells,22 nonempty prompts/masters,16 actors/3 enemies; approved R02 bytes preserved.')
