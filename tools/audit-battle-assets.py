"""Inspect actual packed pixels and record sources; metrics do not approve aesthetics."""
from pathlib import Path
from PIL import Image
import json,hashlib
R=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((R/p).read_text(encoding='utf8'))
records=read('doc/arte/COMBATE_EXPORTS_R01.json')+read('doc/arte/COMBATE_EXPANSION_R01.json')['records']
assert len(records)==19
report=[]
for record in records:
 im=Image.open(R/record['file']);cw,ch=record['cell'];frames=[]
 assert im.mode=='RGBA' and im.size==(cw*3,ch*4)
 for i in range(12):
  frame=im.crop(((i%3)*cw,(i//3)*ch,(i%3+1)*cw,(i//3+1)*ch));box=frame.getbbox();assert box and box[0]>0 and box[1]>0 and box[2]<cw and box[3]<ch,(record['id'],i,box)
  assert frame.getpixel((0,0))[3]==0
  frames.append({'index':i,'alphaBox':box,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
 assert len({f['sha256'] for f in frames})==12
 source=record['source'];extra=record.get('defeatSource');sources=[source]+([extra] if extra else [])
 report.append({'id':record['id'],'file':record['file'],'cell':record['cell'],'ground':record['ground'],'frames':frames,'sources':[{'file':s,'size':Image.open(R/s).size,'sha256':hashlib.sha256((R/s).read_bytes()).hexdigest()} for s in sources],'sha256':hashlib.sha256((R/record['file']).read_bytes()).hexdigest()})
prompts=[]
for p in sorted((R/'doc/arte').glob('PROMPT_COMBATE_*')):
 assert p.stat().st_size>200,p
 prompts.append({'file':p.relative_to(R).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
masters=[{'file':p.relative_to(R).as_posix(),'size':Image.open(p).size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted((R/'art/masters/combate-r01').glob('*.png'))]
out={'version':'M01-10/R01; Breton male defeat R03, Lizard packing R02','status':'technical candidates; owner manual tests pending; no aesthetic approval inherited','records':report,'mastersIncludingPreviousVersions':masters,'prompts':prompts,'limits':'Unique pixels and safe margins complement visual/native motion inspection; do not prove anatomy, support foot stability or identity on their own.'}
(R/'doc/arte/COMBATE_M01_10_MANIFEST.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS19 sheets /228 distinct frames; transparent margins; source/export/prompt SHA records.')
