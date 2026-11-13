"""Bounded coverage diagram from source data; not game artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
R=Path(__file__).resolve().parents[1];read=lambda f:json.loads((R/f).read_text(encoding='utf8'));c=read('data/ArenaStonekeepWhole.json');s=read('doc/mapas/STONEKEEP_B1_M02.json');layers=read('tmp/stonekeep-review/39699021-layers.json');M,F=layers['MAP1'],layers['FLOR'];out=Image.new('RGB',(1100,600),'#141c22');d=ImageDraw.Draw(out);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16);bold=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',19);left=45;top=85;scale=10
text=lambda xy,t:d.text(xy,t,font=font,fill='#ddd8cb')
d.text((20,12),'Stonekeep B1 <-> B2: fonte e cobertura, nao arte final',font=bold,fill='#ead8b0');text((20,40),'Vista u=89-X, Y original; Map015=(3+3u,3+3Y), sem transferencias internas.')
for y in range(30,60):
 for u in range(60):
  raw=M[y][89-u];wet=F[y][89-u]>>8==13;color='#244a63'if wet else'#55554a'if raw==0 or raw>>12 in[8,11]else'#2d3135';x=left+u*scale;yy=top+(y-30)*scale;d.rectangle((x,yy,x+9,yy+9),fill=color)
for u in range(0,61,10):text((left+u*scale,top-25),str(u))
for y in range(30,61,5):text((10,top+(y-30)*scale-8),str(y))
d.line((left+300,top,left+300,top+300),fill='#e1c58d',width=2)
for v in c['encounters']['entries']:
 x,y=v['sourceOriginal'];u=89-x
 if 0<=u<60 and 30<=y<60:
  px,py=left+u*scale+5,top+(y-30)*scale+5;d.ellipse((px-3,py-3,px+3,py+3),fill='#e9b65e'if v['id'].startswith('stonekeep.b1.')else'#81b78a')
for v in c['doors']:
 u,y=v['view']
 if 0<=u<60 and 30<=y<60:
  px,py=left+u*scale+5,top+(y-30)*scale+5;d.rectangle((px-3,py-2,px+3,py+2),fill='#87d8ff')
for i,t in enumerate(['B1:10/10 encontros,4/4 portas.','B2:25/25 encontros,18/18 portas.','','Dourado:10 encontros novos de B1.','Azul claro: portas implementadas.','Nenhuma fechadura LOCK em B1.','','Sul: ligacao seca Y54-55 com B2.','Norte: orcs via agua aberta A2/A1.','Rota evita volumes aquaticos incertos.','Nao abriu paredes/blocos para conectar.','','Total68/180 encontros;36/70 portas.','112 encontros /34 portas restantes.','Campanha continua Map012.','Validacao manual adiada.']):text((680,top+i*25),t)
text((45,405),'B1: u0-29/Y30-59. Orcs ao norte e salas ao sul tem aproximacoes distintas.');text((45,435),'MIF(67,26)/0x1008: projecao aquatica antiga ainda nao comprovada, sem alteracao.');text((45,465),'Porta relatada sem localizacao: pendente de print/coordenadas, sem causa atribuida.')
p=R/'doc/evidencias/m02-stonekeep-b1/visao-geral.png';p.parent.mkdir(parents=True,exist_ok=True);out.save(p);print('B1/B2 coverage diagram written, no runtime asset changes')
