"""Annotated review only: existing tiles/sprites, never runtime artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((R/p).read_text(encoding='utf8'))
m=read('data/Map012.json');c=read('data/ArenaGhoul.json');entries=[c['encounter']]+c['additionalEncounters']
names=read('data/Tilesets.json')[m['tilesetId']]['tilesetNames']
sheets={i:Image.open(R/('img/tilesets/'+n+'.png')).convert('RGBA') for i,n in enumerate(names) if n}
sprite=Image.open(R/('img/characters/'+c['walk']['file']+'.png')).convert('RGBA').crop((64,0,128,64))
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15);small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
x0,y0,x1,y1=6,51,45,93;scale=18;header=54;w=(x1-x0+1)*scale;h=(y1-y0+1)*scale
out=Image.new('RGBA',(w,h+header+70),'#10171a');cache={}
for y in range(y0,y1+1):
 for x in range(x0,x1+1):
  for z in range(4):
   t=m['data'][(z*m['height']+y)*m['width']+x]
   if not t:continue
   if t not in cache:
    if t==2048:
     a=Image.new('RGBA',(48,48))
     for i,(tx,ty) in enumerate([(2,4),(1,4),(2,3),(1,3)]):a.alpha_composite(sheets[0].crop((tx*24,ty*24,tx*24+24,ty*24+24)),(i%2*24,i//2*24))
    else:
     tx=((t//128%2)*8+t%8)*48;ty=(t%256//8)*48;a=sheets[5+t//256].crop((tx,ty,tx+48,ty+48))
    cache[t]=a.resize((scale,scale),Image.Resampling.LANCZOS)
   out.alpha_composite(cache[t],((x-x0)*scale,(y-y0)*scale+header))
d=ImageDraw.Draw(out);d.text((10,8),'Stonekeep - seis ghouls na ilha / planta existente',font=font,fill='#ead9b5');d.text((10,30),'01-06: origens do MIF projetadas para a grade; patrulha adaptada',font=small,fill='#ead9b5')
for e in entries:
 x,y=e['origin'];px=(x-x0+.5)*scale;py=(y-y0+1)*scale+header
 cut=sprite.resize((24,24),Image.Resampling.LANCZOS);out.alpha_composite(cut,(round(px-12),round(py-24)))
 d.text((px-8,py-36),e['id'][-2:],font=font,fill='#ffdf8b',stroke_width=2,stroke_fill='#10171a')
for pos,label in [([40,60],'RAM'),([30,72],'Pergaminho'),([42,54],'Margem / agua')]:
 px=(pos[0]-x0+.5)*scale;py=(pos[1]-y0+.5)*scale+header;d.ellipse((px-4,py-4,px+4,py+4),outline='#80d2ec',width=2);d.text((min(px+8,w-170),py-8),label,font=small,fill='#ddf5ff',stroke_width=2,stroke_fill='#10171a')
d.text((10,h+header+10),'Marcacoes somente nesta prancha; nao aparecem no jogo.',font=small,fill='#ead9b5');d.text((10,h+header+32),'Sem novos tiles, alteracao de layout ou exigencia de eliminar o grupo.',font=small,fill='#ead9b5')
dest=R/'doc/evidencias/m02-stonekeep-ilha/visao-geral.png';out.convert('RGB').save(dest)
print('Review overview written; runtime assets unchanged.')
