"""R02 provenance, source rejection and actual frame bounds; no aesthetic approval."""
from pathlib import Path
from PIL import Image
import hashlib,json
R=Path(__file__).resolve().parents[1]
def entry(p):return {'file':p.relative_to(R).as_posix(),'size':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
exports=json.loads((R/'doc/arte/COMBATE_MOVIMENTOS_R02_EXPORTS.json').read_text(encoding='utf8'));assert len(exports)==66
cfg=json.loads((R/'data/ArenaBattleMotion.json').read_text(encoding='utf8'));images=[]
for folder,profiles in [('sv_actors',cfg['actors']),('enemies',cfg['enemies'])]:
 for id,p in profiles.items():
  file=R/('img/'+folder+'/'+p['file']+'.png');im=Image.open(file);hashes=set();ground=[]
  for key,m in p['motions'].items():
   for n,f in enumerate(m['frames']):
    x,y,w,h=f['rect'];frame=im.crop((x,y,x+w,y+h));box=frame.getbbox();assert box and box[0]>0 and box[1]>0 and box[2]<w and box[3]<h,(id,key,n,box)
    hashes.add(hashlib.sha256(frame.tobytes()).hexdigest());ground.append({'motion':key,'frame':n,'alphaBox':box})
  assert len(hashes)==len(ground),(id,'duplicate frames')
  images.append({**entry(file),'participant':id,'cell':p['cell'],'frames':ground})
masters=[]
for p in sorted((R/'art/masters/combate-r02').glob('*.png')):
 rejected=p.stem in ['pilot-strikes','pilot-strikes-repack'];masters.append({**entry(p),'dimensions':Image.open(p).size,'status':'rejected: touching figures'+('/cropped boots' if 'repack' in p.stem else '') if rejected else 'candidate used; owner approval pending'})
prompts=[entry(p) for p in sorted((R/'doc/arte').glob('PROMPT_COMBATE_R02_*.json')) if p.name not in ['PROMPT_COMBATE_R02_breton-male.json','PROMPT_COMBATE_R02_lizard-man.json']]
assert len(prompts)==8
for p in prompts:assert p['size']>200
weapons=[entry(R/('img/pictures/'+w['file']+'.png')) for w in cfg['weapons'].values()]
prints=[entry(p) for p in sorted((R/'doc/prints/revisao-m01-10-r02').glob('*.png'))];assert len(prints)==4
result={'version':'M01-10/R02 pilot only','coverage':{'actors':['breton.female.base'],'enemies':[1],'notRevisedActors':15,'notRevisedEnemies':[2,3]},'approval':'owner manual deferred; technical inspection does not approve aesthetics','masters':masters,'prompts':prompts,'exports':images,'weapons':weapons,'userInterfaceReferencesIgnored':prints}
(R/'doc/arte/COMBATE_MOVIMENTOS_R02_MANIFEST.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS66 unique bounded body frames,8 master/prompt records including2 rejected studies, separate weapons,4 ignored user references; no owner approval inferred.')
