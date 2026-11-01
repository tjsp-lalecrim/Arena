"""Review boards only; captions/coordinates never enter the game tilesheet."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
ROOT=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text(encoding='utf8'))
c=read('doc/mapas/STONEKEEP_VISUAL_V01.json');m=read('data/Map012.json')
out=ROOT/'doc/evidencias/m02-04-visual-v01';out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
names=read('data/Tilesets.json')[m['tilesetId']]['tilesetNames']
images={i:Image.open(ROOT/('img/tilesets/'+n+'.png')).convert('RGBA') for i,n in enumerate(names) if n}
# Native shape0, A1 kind0, animation frame0. Other A1 kinds are not in this crop.
def tile(t):
    if t==2048:
        a=Image.new('RGBA',(48,48))
        for i,(x,y) in enumerate([(2,4),(1,4),(2,3),(1,3)]):
            a.alpha_composite(images[0].crop((x*24,y*24,x*24+24,y*24+24)),(i%2*24,i//2*24))
        return a
    assert 0<=t<512
    x=((t//128%2)*8+t%8)*48;y=(t%256//8)*48
    return images[5+t//256].crop((x,y,x+48,y+48))
x0,y0,x1,y1=c['bounds'];w=(x1-x0+1)*48;h=(y1-y0+1)*48
im=Image.new('RGBA',(w,h+38),'#10171a');cache={};d=ImageDraw.Draw(im)
d.text((8,8),'V01 — trecho de demonstracao / 48px por tile / restante do mapa provisorio',font=font,fill='#ead9b5')
for y in range(y0,y1+1):
    for x in range(x0,x1+1):
        for z in range(4):
            t=m['data'][(z*m['height']+y)*m['width']+x]
            if not t:continue
            if t not in cache:cache[t]=tile(t)
            im.alpha_composite(cache[t],((x-x0)*48,(y-y0)*48+38))
d=ImageDraw.Draw(im)
for name,(x,y) in c['reviewPoints'].items():
    px,py=(x-x0)*48+24,(y-y0)*48+62
    d.ellipse((px-8,py-8,px+8,py+8),outline='#edc86f',width=3)
    d.text((px+12,py-22),f'{name} ({x},{y})',font=font,fill='#fff4d5',stroke_width=2,stroke_fill='#17191d')
im.convert('RGB').save(out/'visao-geral.png')
board=Image.new('RGB',(1632,3*662),'#10171a');d=ImageDraw.Draw(board)
for row,name in enumerate(['aposento','passagem','margem']):
    for col,prefix in enumerate(['antes','depois']):
        y=row*662;d.text((col*816+12,y+8),prefix.upper()+' — '+name+' — motor 816x624 / 48px',font=font,fill='#ead9b5')
        board.paste(Image.open(out/(prefix+'-'+name+'.png')).convert('RGB'),(col*816,y+38))
board.save(out/'antes-depois.png')
print('Review overview/comparison written; no runtime artwork generated.')
