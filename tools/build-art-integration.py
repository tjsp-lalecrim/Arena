"""Technical packing of R04 AI material swatches and a separate MV gallery map."""
from pathlib import Path
from PIL import Image
import json,hashlib,copy
R=Path(__file__).resolve().parents[1]
def write(p,d):
 text = '[\n'+',\n'.join(json.dumps(x,ensure_ascii=False,separators=(',',':')) for x in d)+'\n]\n' if isinstance(d,list) else json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n'
 (R/p).write_text(text,encoding='utf-8')
master=R/'art/masters/integracao-r04/superficies-r04.png';im=Image.open(master).convert('RGBA');w,h=im.size
# Preserve two courses at 48px each in a 96px material patch; no art drawn.
floor=im.crop((0,0,w//2,h)).resize((96,96),Image.Resampling.LANCZOS)
wall=im.crop((w//2,0,w,h)).resize((96,96),Image.Resampling.LANCZOS)
sheet=Image.new('RGBA',(768,768));sheet.alpha_composite(floor,(48,0));sheet.alpha_composite(wall,(192,0));sheet.save(R/'img/tilesets/Arena_Prison_R04.png')
tiles=json.loads((R/'data/Tilesets.json').read_text(encoding='utf-8'));t=copy.deepcopy(tiles[2]);t.update(id=3,name='Prisão — superfícies R04',note='B: piso 1,2,9,10; parede 4,5,12,13. Estudo técnico ortogonal, sem autotiles.')
t['tilesetNames'][5]='Arena_Prison_R04';t['flags']=[0]*len(t['flags']);t['flags'][0]=16
for i in [4,5,12,13]:t['flags'][i]=15
if len(tiles)==3:tiles.append(t)
else:tiles[3]=t
write('data/Tilesets.json',tiles)
m=json.loads((R/'data/Map002.json').read_text(encoding='utf-8'));m['tilesetId']=3;m['displayName']='';m['note']='Galeria técnica; não integra MQ01. Direção R02/R03 aprovada; requisitos técnicos separados.'
width,height=m['width'],m['height']
for i in range(width*height):
 x,y=i%width,i//width;old=m['data'][i]
 if old in [1,2]:m['data'][i]=(1 if old==1 else 4)+(x%2)+(y%2)*8
ria=m['events'][1]['pages'][0]['list'];ria[0]['parameters']=[1,'arena_ria_narrativa_r02',0,0,48,0,93.75,93.75,255,0]
ria[2]['parameters']=['Ria Silmane — estudo visual sem protagonista.'];ria[3]['parameters']=['Composição e contexto: revisar ao integrar diálogos.']
# Third native event shows the approved concept; independent of walking surfaces.
ev=copy.deepcopy(m['events'][1]);ev.update(id=3,name='Dungeon — referência aprovada',x=7,y=9);ev['pages'][0]['list'][0]['parameters']=[1,'arena_dungeon_estudo_r02',0,0,120,0,100,100,255,0];ev['pages'][0]['list'][2]['parameters']=['Direção aprovada. Conceito; não é mapa final.'];ev['pages'][0]['list'][3]['parameters']=['Superfícies em grade: derivado técnico separado.'];m['events'].append(ev)
write('data/Map003.json',m)
infos=json.loads((R/'data/MapInfos.json').read_text(encoding='utf-8'));info={'id':3,'expanded':True,'name':'M01-06 Validação R04','order':3,'parentId':0,'scrollX':0,'scrollY':0}
if len(infos)==3:infos.append(info)
else:infos[3]=info
write('data/MapInfos.json',infos)
# Profiles separate Arena content from the preview's playback logic.
profiles={'2':{'legacy':True,'rat':'arena_rato_respiracao_v01','frames':[0,1,2,1],'durations':[18,18,18,18]},'3':{'legacy':False,'rat':'arena_rato_bote_r03','frames':[0,1,2,3],'durations':[24,12,8,20]}}
write('data/ArenaArtSamples.json',profiles)
records=[]
for p in [master,R/'img/tilesets/Arena_Prison_R04.png']:
 records.append({'file':p.relative_to(R).as_posix(),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
write('doc/arte/exportacoes-integracao-r04.json',{'masters':records[:1],'exports':records[1:],'scope':'Superfícies derivadas para teste; aprovação anterior cobre direção R02/R03, não aprovação automática deste derivado.'})
print('packed',im.size,'-> 96x96 patches, MV B 768x768; Map003, tileset3; old maps untouched')
