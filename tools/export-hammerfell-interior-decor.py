"""Crop and uniformly scale modular generated assets; retain original alpha."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
r=Path(__file__).resolve().parent.parent
s=json.loads((r/'doc/mapas/RIHAD_INTERIOR_DECOR_V01.json').read_text(encoding='utf-8'))
im=Image.open(r/'art/masters/hammerfell-interior-decor-v01/source.png').convert('RGBA')
assert im.getextrema()[3][0]==0 and im.getextrema()[3][1]>=250
base=Image.open(r/'img/tilesets/Arena_Rihad_Interiors_V01_D.png').convert('RGBA');atlas=Image.new('RGBA',(768,768));atlas.alpha_composite(base);record=[]
for i,(key,m) in enumerate(s['modules'].items()):
 rect=(round(i%3*im.width/3),round(i//3*im.height/2),round((i%3+1)*im.width/3),round((i//3+1)*im.height/2))
 p=im.crop(rect);box=p.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox();assert box
 p=p.crop((max(0,box[0]-2),max(0,box[1]-2),min(p.width,box[2]+2),min(p.height,box[3]+2)))
 p.thumbnail((36,36) if key=='tray' else (m['w']*48-4,m['h']*48-4),Image.Resampling.LANCZOS)
 xy=(384+m['tx']*48+(m['w']*48-p.width)//2,m['ty']*48+(m['h']*48-p.height)//2)
 atlas.alpha_composite(p,xy);record.append(dict(key=key,sourceRect=rect,exportSize=p.size,position=xy))
assert atlas.crop((0,0,base.width,base.height)).tobytes()==base.tobytes(), 'Existing objects changed'
assert atlas.crop((384,0,768,768)).getchannel('A').getbbox(), 'Missing second tile bank'
out=r/('img/tilesets/'+s['atlas']+'.png');atlas.save(out)
folder=r/'doc/arte/hammerfell-interior-decor-v01';folder.mkdir(exist_ok=True,parents=True)
(folder/'exports.json').write_text(json.dumps(dict(master='art/masters/hammerfell-interior-decor-v01/source.png',export=str(out.relative_to(r)),sha256=hashlib.sha256(out.read_bytes()).hexdigest(),cell=[48,48],modules=record),indent=2)+'\n',encoding='utf-8')
board=Image.new('RGBA',atlas.size,'#272b30');board.alpha_composite(atlas);board.save(folder/'review.png')
print('6 modules exported to dedicated D atlas; source alpha retained')
