from pathlib import Path
import struct,json,hashlib
ns={};exec(Path('tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
b=Path(r'D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA/42068779.MIF').read_bytes();a=json.loads(Path('tmp/fang-review/layers.json').read_text());proof={}
for name in ['MAP1','FLOR']:
 i=b.index(name.encode());size,n=struct.unpack_from('<HH',b,i+4);v=ns['decode'](b[i+8:i+6+size],n);rows=[list(struct.unpack_from('<100H',v,y*200)) for y in range(100)];assert rows==a[name];proof[name]={'decodedBytes':len(v),'sha256':hashlib.sha256(v).hexdigest()}
s=json.loads(Path('doc/mapas/FANG_OESTE_SUL_M02.json').read_text());assert hashlib.sha256(b).hexdigest()==s['source']['sha256']
for r in s['routes']:
 for p in r['pit']:
  x,y=p['original'];assert p['map1']==a['MAP1'][y][x] and p['flor']==a['FLOR'][y][x]
for p in s['room']:
 x,y=p['original'];assert p['map1']==a['MAP1'][y][x] and p['flor']==a['FLOR'][y][x]
out=Path('doc/evidencias/fang-oeste-sul');out.mkdir(parents=True,exist_ok=True);(out/'fonte-verificada.json').write_text(json.dumps({'source':s['source'],'layers':proof,'scope':'All route and dry room records match installed file. No DOS traversal observed.'},indent=2)+'\n')
from PIL import Image,ImageDraw
z=12;im=Image.new('RGB',(660,850),'#15131b');d=ImageDraw.Draw(im);d.text((12,8),'Fang Lair 1 - MIF base-zero, X original -> / Y para baixo',fill='white');
for y in range(33,99):
 for x in range(0,25):
  m,f=a['MAP1'][y][x],a['FLOR'][y][x];c='#4f473f' if m else '#aaa082';c='#292330' if f==0xc00 else c;d.rectangle((30+x*z,40+(y-33)*z,29+(x+1)*z,39+(y-32)*z),fill=c)
for r in [json.loads(Path('doc/mapas/FANG_FANTASMA_ACESSO_M02.json').read_text())['route'],*s['routes']]:
 for p in r['pit']:
  x,y=p['original'];d.rectangle((33+x*z,43+(y-33)*z,37+x*z,47+(y-33)*z),fill='#45bdcd')
for p in s['room']:
 x,y=p['original'];d.rectangle((32+x*z,42+(y-33)*z,38+x*z,48+(y-33)*z),fill='#968269')
for p in s['encounters']+s['treasures']:
 x,y=p['original'];c='#ff7575' if 'resource' in p and p['resource'].endswith('DFA') else '#ffd35d';d.ellipse((31+x*z,41+(y-33)*z,39+x*z,49+(y-33)*z),fill=c);d.text((355,45+(s['encounters']+s['treasures']).index(p)*19),f"{p['resource']} ({x},{y})",fill=c)
for y in [35,40,50,60,70,80,90,98]:d.text((3,40+(y-33)*z),str(y),fill='white')
for x in [1,5,10,15,20]:d.text((30+x*z,25),str(x),fill='white')
d.text((355,335),'Azul: corredor inferior delimitado',fill='#45bdcd');d.text((355,355),'Rosa: 8 encontros novos',fill='#ff7575');d.text((355,375),'Ouro: 5 tesouros novos',fill='#ffd35d');d.text((355,400),'Paredes sem FLOR12 preservadas.',fill='white');d.text((355,420),'Diagonais/volumes nao liberados.',fill='white');d.text((355,440),'Sem observacao de travessia DOS.',fill='white');im.save(out/'camadas-rota.png');print(proof)
