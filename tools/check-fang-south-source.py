from pathlib import Path
import struct,json,hashlib
from PIL import Image,ImageDraw
ns={};exec(Path('tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
b=Path(r'D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA/42068779.MIF').read_bytes();a=json.loads(Path('tmp/fang-review/layers.json').read_text());s=json.loads(Path('doc/mapas/FANG_CENTRO_SUL_M02.json').read_text());proof={}
assert hashlib.sha256(b).hexdigest()==s['source']['sha256']
for name in ['MAP1','FLOR']:
 i=b.index(name.encode());size,n=struct.unpack_from('<HH',b,i+4);v=ns['decode'](b[i+8:i+6+size],n);rows=[list(struct.unpack_from('<100H',v,y*200)) for y in range(100)];assert rows==a[name];proof[name]={'decodedBytes':len(v),'sha256':hashlib.sha256(v).hexdigest()}
for p in [*s['room'],*s['preserved'],*[p for r in s['routes'] for p in r['pit']]]:
 x,y=p['original'];assert p['map1']==a['MAP1'][y][x] and p['flor']==a['FLOR'][y][x]
for r in s['routes']:
 for x,y in [r['entryBank'],r['exitBank']]:assert a['MAP1'][y][x]==0 and a['FLOR'][y][x]!=0xc00
for e in s['encounters']+s['treasures']:
 x,y=e['original'];assert a['MAP1'][y][x]==0x8000+e['flat']
for p in s['braces']:
 x,y=p['original'];assert a['MAP1'][y][x]==0x9138
out=Path('doc/evidencias/fang-centro-sul');out.mkdir(parents=True,exist_ok=True)
(out/'fonte-verificada.json').write_text(json.dumps({'source':s['source'],'layers':proof,'checked':{'pitCells':len({tuple(p['original']) for r in s['routes'] for p in r['pit']}),'dryCells':len(s['room']),'braces':len(s['braces']),'encounters':len(s['encounters']),'treasures':len(s['treasures'])},'scope':'Installed readback exact; MAP1/FLOR records, empty banks, original enemy/treasure flats, noncolliding BRACE0x9138. No original DOS traversal observation.'},indent=2)+'\n')
z=10;im=Image.new('RGB',(1060,500),'#15131b');d=ImageDraw.Draw(im);d.text((12,8),'Fang Lair 1 - MIF base-zero, X original -> / Y para baixo. MV espelha X.',fill='white')
for y in range(68,99):
 for x in range(20,78):
  m,f=a['MAP1'][y][x],a['FLOR'][y][x];c='#4a423c' if m else '#a0927e';c='#292330' if f==0xc00 else c;d.rectangle((30+(x-20)*z,40+(y-68)*z,29+(x-19)*z,39+(y-67)*z),fill=c)
for p in s['room']:
 x,y=p['original'];d.rectangle((31+(x-20)*z,41+(y-68)*z,38+(x-20)*z,48+(y-68)*z),fill='#95866f')
for r in s['routes']:
 for p in r['pit']:
  x,y=p['original'];d.rectangle((33+(x-20)*z,43+(y-68)*z,36+(x-20)*z,46+(y-68)*z),fill='#45bdcd')
 for x,y in [r['entryBank'],r['exitBank']]:d.ellipse((31+(x-20)*z,41+(y-68)*z,38+(x-20)*z,48+(y-68)*z),outline='#8aee88')
for i,p in enumerate(s['encounters']):
 x,y=p['original'];d.ellipse((31+(x-20)*z,41+(y-68)*z,38+(x-20)*z,48+(y-68)*z),fill='#ff7575');d.text((650,45+i*21),f"{p['resource']} ({x},{y})",fill='#ff7575')
for p in s['braces']:
 x,y=p['original'];d.rectangle((34+(x-20)*z,44+(y-68)*z,36+(x-20)*z,46+(y-68)*z),fill='#b597eb')
for x in [20,30,40,50,60,70,75]:d.text((30+(x-20)*z,25),str(x),fill='white')
for y in [70,75,80,85,90,95,98]:d.text((3,40+(y-68)*z),str(y),fill='white')
d.text((650,210),'Azul: corredor inferior delimitado',fill='#45bdcd');d.text((650,230),'Verde: margens abertas',fill='#8aee88');d.text((650,250),'Roxo: suporte BRACE atravessavel',fill='#b597eb');d.text((650,285),'Paredes73,80 /22,88 /23,88 mantidas.',fill='white');d.text((650,310),'Geometria e props ainda nao completos.',fill='white');d.text((30,390),'Rota desde margem75,83: poco75,84 ->68,98 ->62,93 ->63,93 (centro).',fill='white');d.text((30,414),'Ramo pelo mesmo poco:62,93 ->62,90 ->59,90 ->59,88 ->59,87 (salas sul).',fill='white');d.text((30,448),'Sem observacao de travessia DOS. Sem nova mecanica, arte ou regra de lava.',fill='white');im.save(out/'camadas-rota.png');print(proof)
