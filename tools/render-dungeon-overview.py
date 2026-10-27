from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
m=json.loads(Path('data/Map008.json').read_text());s=Image.open('img/tilesets/Arena_Dungeon_M14.png').convert('RGBA');W,H=m['width'],m['height'];out=Image.new('RGBA',(W*6,H*6));cache={}
def t(i):
 if i not in cache:
  x=((i//128%2)*8+i%8)*48;y=((i%128)//8)*48;cache[i]=s.crop((x,y,x+48,y+48)).resize((6,6),Image.Resampling.LANCZOS)
 return cache[i]
for y in range(H):
 for x in range(W):
  i=m['data'][y*W+x];out.alpha_composite(t(i),(x*6,y*6))
for e in m['events']:
 if e and e['pages'][0]['image']['tileId']:out.alpha_composite(t(e['pages'][0]['image']['tileId']),(e['x']*6,e['y']*6))
c=json.loads(Path('data/ArenaDungeon.json').read_text());d=ImageDraw.Draw(out);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
for k,name in [('start','Início'),('key','Chave'),('gateApproach','Shift Gate')]:
 x,y=c[k];x*=6;y*=6;d.ellipse((x-5,y-5,x+5,y+5),outline='#f8d579',width=2);d.text((max(3,min(x-80,out.width-110)),y-23),name,font=font,fill='#fff1c0',stroke_width=2,stroke_fill='#111')
out.convert('RGB').save('doc/evidencias/m01-14/visao-geral.png')
