from pathlib import Path
from PIL import Image
import hashlib,json
r=Path(__file__).resolve().parent.parent
im=Image.open(r/'art/masters/rihad-outskirts-battle-v01/source.png').convert('RGB');size=(816,round(im.height*816/im.width));im.resize(size,Image.Resampling.LANCZOS).save(r/'img/pictures/Arena_Rihad_Outskirts_Battle_V01.png')
o=r/'doc/arte/rihad-outskirts-battle-v01';o.mkdir(parents=True,exist_ok=True);f=r/'img/pictures/Arena_Rihad_Outskirts_Battle_V01.png'
(o/'exports.json').write_text(json.dumps(dict(master='art/masters/rihad-outskirts-battle-v01/source.png',export=str(f.relative_to(r)),size=size,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),method='Uniform proportional resize only; native renderer uniform cover for visible battle field'),indent=2)+'\n',encoding='utf-8')
