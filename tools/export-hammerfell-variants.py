"""Pack four generated regional variants. Cropping/scaling only, alpha retained."""
from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json
r=Path(__file__).resolve().parent.parent
o=r/'doc/arte/hammerfell-variants-v01';o.mkdir(exist_ok=True,parents=True)
review=Image.new('RGBA',(1280,420),'#262a2e');draw=ImageDraw.Draw(review);records=[]
for n,key in enumerate(['elder','artisan','traveler','guardvariant']):
 moving=key in ['artisan','traveler']
 im=Image.open(r/f'art/masters/hammerfell-variants-v01/{key}.png').convert('RGBA');assert im.size==(1774,887) and im.getextrema()[3]==(0,255)
 portrait=(0,0,790 if moving else 850,887)
 bands=[(0,222),(222,443),(443,665),(665,887)]
 boxes=[(800+c*324,y,800+(c+1)*324 if c<2 else 1774,b)for y,b in bands for c in range(3)] if moving else [(900,0,1335,425),(1335,0,1774,425),(900,425,1335,887),(1335,425,1774,887)]
 if key=='guardvariant':boxes=[(900,0,1250,425),(1250,0,1774,425),(900,425,1250,887),(1250,425,1774,887)]
 def crop(box):
  a=im.crop(box);bb=a.getchannel('A').point(lambda v:255 if v>16 else 0).getbbox();assert bb
  return a.crop((max(0,bb[0]-2),max(0,bb[1]-2),min(a.width,bb[2]+2),min(a.height,bb[3]+2)))
 poses=[crop(b)for b in boxes];scale=min(56/max(p.height for p in poses),44/max(p.width for p in poses))
 sheet=Image.new('RGBA',(144,256));cells=[]
 for row in range(4):
  for col in range(3):
   idx=row*3+col if moving else row;p=poses[idx];p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.LANCZOS);xy=(col*48+(48-p.width)//2,row*64+62-p.height);sheet.alpha_composite(p,xy);cells.append(dict(row=row,col=col,sourceRect=boxes[idx],size=p.size,xy=xy))
 face=Image.new('RGBA',(144,144));p=crop(portrait);p.thumbnail((140,140),Image.Resampling.LANCZOS);face.alpha_composite(p,((144-p.width)//2,144-p.height))
 name='Arena_Hammerfell_'+key.capitalize()+'_V01';paths=[f'img/characters/${name}.png',f'img/faces/{name}.png'];sheet.save(r/paths[0]);face.save(r/paths[1])
 if moving:assert len({hashlib.sha256(sheet.crop((c*48,row*64,(c+1)*48,(row+1)*64)).tobytes()).hexdigest()for row in range(4)for c in range(3)})==12
 review.alpha_composite(face,(n*320+8,22));review.alpha_composite(sheet,(n*320+160,22));draw.text((n*320+8,4),key,fill='white')
 records.append(dict(key=key,master=f'art/masters/hammerfell-variants-v01/{key}.png',portraitCrop=portrait,cell=[48,64],footAnchor=62,uniformScale=scale,moving=moving,cells=cells,exports=[dict(path=f,sha256=hashlib.sha256((r/f).read_bytes()).hexdigest())for f in [f'art/masters/hammerfell-variants-v01/{key}.png',*paths]]))
review.save(o/'review.png');(o/'exports.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('4 sheets/4 portraits, 32 authored directional poses, original alpha retained')
