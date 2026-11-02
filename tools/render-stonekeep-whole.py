"""Review overview from runtime tiles, not new artwork or distributed asset."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
R=Path(__file__).resolve().parents[1]
read=lambda f:json.loads((R/f).read_text(encoding='utf8'))
m=read('data/Map015.json');c=read('data/ArenaStonekeepWhole.json')
names=read('data/Tilesets.json')[m['tilesetId']]['tilesetNames']
sheets={i:Image.open(R/f'img/tilesets/{names[i]}.png').convert('RGBA') for i in [5,6,7] if names[i]}
water=Image.open(R/f'img/tilesets/{names[0]}.png').convert('RGBA')
scale=3;top=70;out=Image.new('RGBA',(1000,274*scale+top+40),'#11191c');cache={}
for y in range(274):
 for x in range(274):
  for z in range(4):
   t=m['data'][(z*274+y)*274+x]
   if z and t==0:continue
   if t not in cache:
    tx=((t//128%2)*8+t%8)*48;ty=(t%256//8)*48
    cache[t]=(water.crop((0,0,48,48)) if t>=2048 else sheets[5+t//256].crop((tx,ty,tx+48,ty+48))).resize((scale,scale),Image.Resampling.LANCZOS)
   out.alpha_composite(cache[t],(x*scale,y*scale+top))
d=ImageDraw.Draw(out);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
d.text((8,5),'Stonekeep integral — Map015 / 274 x 274 / exploracao continua',font=font,fill='#ead9b5')
d.text((8,28),'Verde: trecho anterior preservado em X+24. Pontos: 20 encontros reais transferidos.',font=font,fill='#d6d8c5')
d.rectangle((26*scale,top+2*scale,164*scale,top+101*scale),outline='#81db9b',width=2)
colors={1:'#ddd7ac',4:'#eef2f4',5:'#a7dd93',6:'#80b9e2'}
for e in c['encounters']['entries']:
 x,y=e['origin'];d.ellipse((x*scale-3,top+y*scale-3,x*scale+3,top+y*scale+3),fill=colors.get(e['enemyId'],'#e9c398'))
for text,pos in [('Entrada',[c['context']['entry']['x'],c['context']['entry']['y']]),('Pergaminho',c['context']['source'])]:
 x,y=pos[0]*scale,top+pos[1]*scale;d.ellipse((x-5,y-5,x+5,y+5),outline='#ffe05c',width=2);d.text((x+8,y),text,font=font,fill='#fff3b5',stroke_width=1,stroke_fill='#10171a')
for i,text in enumerate(['Sem 180 patrulhas','sinteticas.','20 de 180 encontros','implementados.','','70 vaos originais:','portas funcionais','ainda pendentes.','','Fora do recorte verde:','materiais provisorios.','','Alturas/diagonais:','revisao por setor.']):d.text((834,top+20*i),text,font=font,fill='#e1d5bb')
dest=R/'doc/evidencias/m02-stonekeep-integral';dest.mkdir(parents=True,exist_ok=True);out.convert('RGB').save(dest/'visao-geral.png')
print('Overview only, no runtime assets written.')
