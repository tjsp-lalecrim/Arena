"""Review only: approved tiles at overview scale, annotations are not game assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((root/p).read_text(encoding='utf8'))
m=read('data/Map012.json');c=read('data/ArenaStonekeep.json');l=read('doc/mapas/STONEKEEP_AMOSTRA_M02.json')
names=read('data/Tilesets.json')[m['tilesetId']]['tilesetNames']
sheets={i:Image.open(root/('img/tilesets/'+names[i]+'.png')).convert('RGBA') for i in [5,6] if names[i]}
water=Image.open(root/('img/tilesets/'+names[0]+'.png')).convert('RGBA')
scale=6;w,h=m['width'],m['height'];out=Image.new('RGBA',(w*scale,h*scale+46),'#10171a');cache={}
for y in range(h):
 for x in range(w):
  t=m['data'][y*w+x]
  if t not in cache:
   tx=((t//128%2)*8+t%8)*48;ty=(t%256//8)*48
   cache[t]=(water.crop((0,0,48,48)) if t>=2048 else sheets[5+t//256].crop((tx,ty,tx+48,ty+48))).resize((scale,scale),Image.Resampling.LANCZOS)
  out.alpha_composite(cache[t],(x*scale,y*scale+46))
d=ImageDraw.Draw(out);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
d.text((8,8),'Stonekeep: entrada > aposentos > abertura > agua > ilha. Guardioes pendentes.',font=font,fill='#ead9b5')
for p,name in [([c['entry']['x'],c['entry']['y']],'Chegada'),(c['exit'],'Rihad'),(c['breach'],'Passagem adaptada'),(c['source'],'Pergaminho')]:
 x,y=p[0]*scale+3,p[1]*scale+49;d.ellipse((x-5,y-5,x+5,y+5),outline='#ffcf64',width=2)
 d.text((max(4,min(x+8,out.width-180)),y-16),name,font=font,fill='#fff1c0',stroke_width=2,stroke_fill='#10171a')
dest=root/'doc/evidencias/m02-04';dest.mkdir(parents=True,exist_ok=True);out.convert('RGB').save(dest/'visao-geral.png')
print('Overview annotated; no runtime artwork written.')
