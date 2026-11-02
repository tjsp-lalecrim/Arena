"""Coverage diagram from source data, not new game artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parents[1]
read=lambda f:json.loads((R/f).read_text(encoding='utf8'))
s=read('doc/mapas/STONEKEEP_A2_B2_M02.json');c=read('data/ArenaStonekeepWhole.json')
layers=read('tmp/stonekeep-review/39699021-layers.json');M,F=layers['MAP1'],layers['FLOR']
out=Image.new('RGB',(1000,1140),'#121b20');d=ImageDraw.Draw(out)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16);bold=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',19)
step=16;left=55;top=90
d.text((20,15),'Stonekeep: bloco A2 -> B2 / cobertura, nao arte final',font=bold,fill='#e9d9bb')
d.text((20,43),'Vista u=89-MIFx; Y original preservado. Mundo=(3+3u,3+3Y).',font=font,fill='#d5d3c6')
for y in range(60):
 for u in range(30,60):
  v=M[y][89-u];wet=F[y][89-u]>>8==13
  color='#254856' if wet else '#52534a' if v==0 or v>>12 in [8,11] else '#2b3033'
  x=left+(u-30)*step;yy=top+y*step;d.rectangle((x,yy,x+step-1,yy+step-1),fill=color)
for cell in c.get('access',{}).get('dryPassage',{}).get('cells',[]):
 u,y=cell['view'];x=left+(u-30)*step;yy=top+y*step;d.rectangle((x+2,yy+2,x+step-3,yy+step-3),fill='#428c9c')
for y in range(0,61,5):d.text((14,top+y*step-8),str(y),font=font,fill='#e2dbc7')
for u in range(30,60,5):d.text((left+(u-30)*step,top-26),str(u),font=font,fill='#e2dbc7')
d.line((left,top+30*step,left+30*step,top+30*step),fill='#dbcb96',width=2)
def p(view):return left+(view[0]-30)*step+8,top+view[1]*step+8
for e in c['encounters']['entries']:
 u,y=89-e['sourceOriginal'][0],e['sourceOriginal'][1]
 if 30<=u<=59 and y<60:
  x,yy=p([u,y]);d.ellipse((x-4,yy-4,x+4,yy+4),fill='#81cf8a' if y>=30 else '#e8dbb7')
for e in s['deferredEnemies']:
 if any(v['sourceOriginal']==e['sourceOriginal'] for v in c['encounters']['entries']):continue
 x,y=p(e['view']);color='#e8a452' if e['species'] in ['orc','homem-lagarto'] else '#df75ce';d.ellipse((x-4,y-4,x+4,y+4),outline=color,width=2)
for door in c['doors']:
 u,y=door['view']
 if 30<=u<=59 and y<60:
  x,yy=p([u,y]);d.rectangle((x-4,yy-3,x+4,yy+3),fill='#71b7ef')
for door in s['deferredDoors']:
 if any(v['sourceOriginal']==door['sourceOriginal'] for v in c['doors']):continue
 x,y=p(door['view']);d.rectangle((x-5,y-4,x+5,y+4),outline='#ed7878' if door['lockValue'] is not None else '#df75ce',width=2)
x,y=p([50,44]);d.line((x+10,y,600,y),fill='#71b7ef',width=2);d.text((610,y-10),'MIF39,44 / Forcar LOCK2',font=bold,fill='#71b7ef')
legend=['A2:19/19 encontros;13/13 portas.','B2:16/25 encontros;18/18 portas.','','Claro: encontros anteriores.','Verde:16 encontros de B2.','Azul: portas implementadas.','Ciano: corredor seco sob estrutura.','Laranja:6orcs/3caminhadas ausentes.','','LOCK1/2/3: forca deterministica,','adaptacao explicita, sem chave nova.','Portas nao exigem eliminar todos.','','Corredor seco:75unidades de folga,','sem alterar A1 ou agua.','','49/180 encontros;32/70 portas.','Nao equivale a dungeon concluida.','Proximo: piloto artistico de orc.','Loot e descanso ficam depois.','Campanha permanece Map012.']
for i,line in enumerate(legend):d.text((570,top+i*26),line,font=font,fill='#dbd8c9')
dest=R/'doc/evidencias/m02-stonekeep-acessos';dest.mkdir(parents=True,exist_ok=True)
out.save(dest/'visao-geral.png')
print('Coverage overview only; no runtime assets changed.')
