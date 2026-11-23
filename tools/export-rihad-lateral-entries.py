from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json
r=Path(__file__).resolve().parent.parent
s=json.loads((r/'doc/mapas/RIHAD_LATERAL_ENTRIES_V01.json').read_text(encoding='utf-8'))
im=Image.open(r/'art/masters/rihad-lateral-entries-v01/source.png').convert('RGBA');assert im.getextrema()[3][0]==0
urbanBase=Image.open(r/'img/tilesets/Arena_Hammerfell_Facades_V01_D.png').convert('RGBA');innerBase=Image.open(r/'img/tilesets/Arena_Hammerfell_Interior_Decor_V01_D.png').convert('RGBA')
urban=Image.new('RGBA',(768,768));urban.alpha_composite(urbanBase);inner=innerBase.copy();records=[];figures={}
for i,(key,m) in enumerate(s['modules'].items()):
 rect=(round(i%2*im.width/2),round(i//2*im.height/3),round((i%2+1)*im.width/2),round((i//2+1)*im.height/3));p=im.crop(rect);bb=p.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox();assert bb
 p=p.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(p.width,bb[2]+2),min(p.height,bb[3]+2)));p.thumbnail((m['w']*48-4,m['h']*48-4),Image.Resampling.LANCZOS)
 local=m['tile']-512;tx=384+(local%8)*48;ty=((local%128)//8)*48
 xy=(tx+(m['w']*48-p.width)//2,ty+(m['h']*48-p.height)//2);target=urban if i<2 else inner;target.alpha_composite(p,xy)
 figures[key]=target.crop((tx,ty,tx+m['w']*48,ty+m['h']*48));records.append(dict(key=key,sourceRect=rect,tile=m['tile'],xy=xy,size=p.size))
assert urban.crop((0,0,urbanBase.width,urbanBase.height)).tobytes()==urbanBase.tobytes()
assert inner.crop((0,0,768,384)).tobytes()==innerBase.crop((0,0,768,384)).tobytes()
assert inner.crop((0,0,384,768)).tobytes()==innerBase.crop((0,0,384,768)).tobytes()
folder=r/'doc/arte/rihad-lateral-entries-v01';folder.mkdir(parents=True,exist_ok=True)
paths=[]
for name,a in [(s['exteriorAtlas'],urban),(s['interiorAtlas'],inner)]:
 p=r/f'img/tilesets/{name}.png';a.save(p);paths.append(dict(path=str(p.relative_to(r)),sha256=hashlib.sha256(p.read_bytes()).hexdigest()))
board=Image.new('RGBA',(760,280),'#292e32');d=ImageDraw.Draw(board)
c=Image.open(r/'img/tilesets/Arena_Rihad_Exterior_V01_C.png');old=Image.new('RGBA',(48,96));old.alpha_composite(c.crop((288,720,336,768)),(0,48));d.text((8,6),'old side',fill='white');board.alpha_composite(old,(8,26))
for i,(key,p) in enumerate(figures.items()):x=80+i*108;d.text((x,6),key,fill='white');board.alpha_composite(p,(x,26))
board.save(folder/'comparison.png');(folder/'exports.json').write_text(json.dumps(dict(master='art/masters/rihad-lateral-entries-v01/source.png',cell=[48,48],modules=records,exports=paths,method='Uniform scale/crop only; original alpha retained; prior atlas banks retained'),indent=2)+'\n',encoding='utf-8')
print('6 authored plan-view modules; 2 extended D atlases')
