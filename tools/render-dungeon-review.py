"""Review-only contact sheets, actual-size sprites and external labels."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[1];out=R/'doc/evidencias/m01-14/r02';out.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
board=Image.new('RGB',(750,650),'#17191d');draw=ImageDraw.Draw(board)
draw.text((12,8),'R02 — células na escala real; textos e linhas só nesta prancha',font=font,fill='white')
doors=Image.open(R/'img/characters/!$Arena_Doors_M14_R02.png');chains=Image.open(R/'img/characters/!$Arena_Chains_M14_R02.png')
for row,name in enumerate(['Sul','Oeste','Leste','Norte']):
 y=48+row*126;draw.text((8,y),name,font=font,fill='#d8ccaf')
 for col,state in enumerate(['Fechada','Intermediária','Aberta']):
  x=76+col*150;board.paste(doors.crop((col*144,row*96,(col+1)*144,(row+1)*96)),(x,y),doors.crop((col*144,row*96,(col+1)*144,(row+1)*96)))
  draw.line((x,y+96,x+144,y+96),fill='#777568');draw.text((x,y+100),state,font=font,fill='#aaa')
 im=chains.crop((0,row*96,144,(row+1)*96));board.paste(im,(550,y),im);draw.text((550,y+100),'Correntes/nicho',font=font,fill='#aaa')
t=Image.open(R/'img/characters/!$Arena_Treasure_M14_R02.png');draw.text((12,560),'Tesouros (prévia, sem concessão):',font=font,fill='white')
for col,name in enumerate(['Disponível','Aberto','Coletado']):
 im=t.crop((col*48,0,(col+1)*48,48));board.paste(im,(300+col*140,552),im);draw.text((280+col*140,606),name,font=font,fill='#d8ccaf')
board.save(out/'orientacoes-escala-real.png')
runtime=Image.new('RGB',(816,680),'#17191d');d=ImageDraw.Draw(runtime)
for i,name in enumerate(['sul','norte','oeste','leste']):
 im=Image.open(out/('porta-'+name+'.png')).convert('RGB').resize((408,312),Image.Resampling.LANCZOS);x=i%2*408;y=i//2*340;runtime.paste(im,(x,y+25));d.text((x+8,y+4),name+' — captura reduzida50%; original816×624',font=font,fill='white')
runtime.save(out/'portas-no-motor.png')
paths=['art/m01-14/portas-tesouros-r02-master.png','art/m01-14/objetos-direcionais-r02-master.png']+[str(p.relative_to(R)).replace('\\','/') for p in (R/'img/characters').glob('*M14_R02.png')]+['img/tilesets/Arena_Dungeon_M14_R02.png','img/tilesets/Arena_Water_M14_R02_A1.png']
records=[]
for name in paths:
 p=R/name;im=Image.open(p);records.append({'file':name,'size':list(im.size),'mode':im.mode,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
manifest={'round':'M01-14 R02','date':'2026-10-27','status':'new assets pending responsible review; previous4161615 graphical direction and structural fidelity approved','files':records,'packing':'tools/build-dungeon-objects.py then tools/build-dungeon-map.py; inspected explicit row bounds; native !$/A1','preserved':['art/m01-14/complementos-prisao-v01.png','img/tilesets/Arena_Dungeon_M14.png','img/tilesets/Arena_Prison_R04.png'],'limitations':['Directional art is interpretation, especially rear/side fit; no automatic aesthetic approval','Treasure collected is preview, not reward ledger','No original DOS execution; swimming geometry adapted from layers/outline','MV editor capture timeout; A56 physical pending']}
(R/'doc/arte/DUNGEON_M01_14_R02_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Review sheets/manifest generated; labels never baked into runtime artwork')
