from pathlib import Path
import struct,json,hashlib
from PIL import Image,ImageDraw
ns={};exec(Path('tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
b=Path(r'D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA/42068779.MIF').read_bytes();a=json.loads(Path('tmp/fang-review/layers.json').read_text());s=json.loads(Path('doc/mapas/FANG_NORDESTE_LESTE_M02.json').read_text());proof={}
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
out=Path('doc/evidencias/fang-nordeste-leste');out.mkdir(parents=True,exist_ok=True)
(out/'fonte-verificada.json').write_text(json.dumps({'source':s['source'],'layers':proof,'checked':{'pitCells':len({tuple(p['original']) for r in s['routes'] for p in r['pit']}),'dryCells':len(s['room']),'braces':len(s['braces']),'encounters':len(s['encounters']),'treasures':len(s['treasures'])},'scope':'Installed readback exact; MAP1/FLOR records, empty banks, original enemy/treasure flats, noncolliding BRACE0x9138. No original DOS traversal observation.'},indent=2)+'\n')
z=9;im=Image.new('RGB',(980,750),'#15131b');d=ImageDraw.Draw(im);d.text((12,8),'Fang Lair 1 - MIF base-zero, X original -> / Y para baixo. Projecao MV espelha X.',fill='white')
for y in range(1,64):
 for x in range(56,100):
  m,f=a['MAP1'][y][x],a['FLOR'][y][x];c='#4a423c' if m else '#a0927e';c='#292330' if f==0xc00 else c;d.rectangle((30+(x-56)*z,40+(y-1)*z,29+(x-55)*z,39+y*z),fill=c)
for p in s['room']:
 x,y=p['original'];d.rectangle((31+(x-56)*z,41+(y-1)*z,37+(x-56)*z,47+(y-1)*z),fill='#95866f')
for r in s['routes']:
 for p in r['pit']:
  x,y=p['original'];d.rectangle((32+(x-56)*z,42+(y-1)*z,35+(x-56)*z,45+(y-1)*z),fill='#45bdcd')
 for x,y in [r['entryBank'],r['exitBank']]:d.ellipse((31+(x-56)*z,41+(y-1)*z,37+(x-56)*z,47+(y-1)*z),outline='#8aee88')
for p in s['braces']:
 x,y=p['original'];d.rectangle((33+(x-56)*z,43+(y-1)*z,35+(x-56)*z,45+(y-1)*z),fill='#b597eb')
for i,p in enumerate(s['encounters']+s['treasures']):
 x,y=p['original'];c='#ff7575' if 'DFA' in p['resource'] else '#ffd35d';d.ellipse((31+(x-56)*z,41+(y-1)*z,36+(x-56)*z,46+(y-1)*z),fill=c);d.text((460,42+i*19),f"{p['resource']} ({x},{y})",fill=c)
for y in [5,10,20,30,40,50,60]:d.text((3,40+(y-1)*z),str(y),fill='white')
for x in [60,70,80,90,99]:d.text((30+(x-56)*z,25),str(x),fill='white')
d.text((460,510),'Azul: passagem inferior FLOR12 delimitada',fill='#45bdcd');d.text((460,530),'Verde: margem aberta MAP1 vazio',fill='#8aee88');d.text((460,550),'Roxo: BRACE0x9138, atravessavel, sem LOCK',fill='#b597eb');d.text((460,575),'Paredes normais, diagonais e volumes elevados preservados.',fill='white');d.text((460,595),'Acesso norte e sul ligados a entrada normal por piso existente.',fill='white');d.text((460,615),'Sem novas portas/chaves, arte, mobilidade ou regras de lava.',fill='white');im.save(out/'camadas-rota.png');print(proof)
