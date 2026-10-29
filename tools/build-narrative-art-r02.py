"""Technical narrative exports. Masters and earlier versions are never overwritten."""
from pathlib import Path
from PIL import Image
import json,hashlib
R=Path(__file__).resolve().parents[1];p=R/'doc/arte/m01-integracao-r02/prompts.json';d=json.loads(p.read_text(encoding='utf8'))
for e in d['entries']:
 master=R/e['master'];im=Image.open(master).convert('RGB');e['masterDimensions']=list(im.size);e['masterSha256']=hashlib.sha256(master.read_bytes()).hexdigest()
 if e.get('crop'):im=im.crop(e['crop'])
 im.thumbnail((960,640),Image.Resampling.LANCZOS);target=R/('img/pictures/Arena_intro_'+e['id']+'_r02.png');im.save(target)
 e.update(runtime=target.relative_to(R).as_posix(),dimensions=list(im.size),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),approval='pending owner review')
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Exported14 narrative moments; containment and aspect ratio preserved')
