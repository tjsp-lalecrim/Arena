from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,os
m=json.loads(Path('data/Map008.json').read_text());names=json.loads(Path('data/Tilesets.json').read_text())[m['tilesetId']]['tilesetNames'];s=Image.open('img/tilesets/'+names[5]+'.png').convert('RGBA');water=Image.open('img/tilesets/'+names[0]+'.png').convert('RGBA');W,H=m['width'],m['height'];out=Image.new('RGBA',(W*6,H*6));cache={}
def t(i):
 if i not in cache:
  if i>=2048:cache[i]=water.crop((0,0,48,48)).resize((6,6),Image.Resampling.LANCZOS)
  else:
   x=((i//128%2)*8+i%8)*48;y=((i%128)//8)*48;cache[i]=s.crop((x,y,x+48,y+48)).resize((6,6),Image.Resampling.LANCZOS)
 return cache[i]
for y in range(H):
 for x in range(W):
  i=m['data'][y*W+x];out.alpha_composite(t(i),(x*6,y*6))
for e in m['events']:
 if e and e['pages'][0]['image']['tileId']:out.alpha_composite(t(e['pages'][0]['image']['tileId']),(e['x']*6,e['y']*6))
 elif e and e['pages'][0]['image']['characterName']:
  p=e['pages'][0]['image'];im=Image.open('img/characters/'+p['characterName']+'.png').convert('RGBA');w,h=im.width//3,im.height//4;x=p['pattern']*w;y=((p['direction']-2)//2)*h;part=im.crop((x,y,x+w,y+h)).resize((round(w/8),round(h/8)),Image.Resampling.LANCZOS);out.alpha_composite(part,(round((e['x']+.5)*6-part.width/2),round((e['y']+1)*6-part.height)))
for y in range(H):
 for x in range(W):
  i=m['data'][(2*H+y)*W+x]
  if i:out.alpha_composite(t(i),(x*6,y*6))
c=json.loads(Path('data/ArenaDungeon.json').read_text());d=ImageDraw.Draw(out);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
for k,name in [('start','Início'),('key','Chave'),('gateApproach','Shift Gate')]:
 x,y=c[k];x*=6;y*=6;d.ellipse((x-5,y-5,x+5,y+5),outline='#f8d579',width=2);d.text((max(3,min(x-80,out.width-110)),y-23),name,font=font,fill='#fff1c0',stroke_width=2,stroke_fill='#111')
out.convert('RGB').save(os.environ.get('ARENA_OVERVIEW_PATH','doc/evidencias/m01-14/r02/visao-geral.png'))
