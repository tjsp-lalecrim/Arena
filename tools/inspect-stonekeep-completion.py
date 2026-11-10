"""Remaining Stonekeep sectors source contracts; original read-only, no runtime/asset writes."""
from pathlib import Path
import json,hashlib,struct
from collections import deque
R=Path(__file__).resolve().parents[1];read=lambda f:json.loads((R/f).read_text(encoding='utf8'));b=Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes();sha=hashlib.sha256(b).hexdigest();assert sha=='4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
ns={};exec((R/'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns);layers={}
for tag in ['MAP1','FLOR']:
 off=b.index(tag.encode());size,length=struct.unpack_from('<HH',b,off+4);a=struct.unpack('<8100H',ns['decode'](b[off+8:off+6+size],length));layers[tag]=[a[y*90:y*90+90]for y in range(90)]
M,F=layers['MAP1'],layers['FLOR'];inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json');tex=read('tmp/stonekeep-review/texture-associations.json');m=read('data/Map015.json');c=read('data/ArenaStonekeepWhole.json')
def records(tag,stride):
 off=b.index(tag.encode());size=struct.unpack_from('<H',b,off+4)[0];return[list(b[i:i+stride])for i in range(off+6,off+6+size,stride)]
locks={tuple(v[:2]):v[2]for v in records('LOCK',3)};triggers=records('TRIG',4);center=lambda x,y:[3+3*(89-x),3+3*y];solid=lambda v:v and v<0x8000 and v>>8==(v&255)

def original(position):
    x,y=position
    assert (x-3)%3==0 and (y-3)%3==0
    return (89-(x-3)//3,(y-3)//3)

species={'rato':(1,1),'goblin':(2,2),'homem-lagarto':(3,3),'esqueleto':(4,5),
         'ghoul':(5,6),'lobo':(6,7),'orc':(7,8),'minotauro':(8,9),'aranha':(9,10)}
import subprocess
legacy=json.loads(subprocess.check_output(['git','show','9c9b802:data/ArenaStonekeepWhole.json'],cwd=R))
existing={tuple(e.get('sourceOriginal') or original(e['origin'])) for e in legacy['encounters']['entries']}
old_doors={tuple(d['sourceOriginal']) for d in legacy['doors']}
assert len(existing)==119 and len(old_doors)==46
reg=lambda x,y:m['data'][5*274**2+y*274+x]
# Prove the C2/C3 crossing on dry terrain independently of eastern door setup.
for pos in [(181,222),(182,222)]:
    assert reg(*pos)==4,pos
assert all(M[73][x]==0 or M[73][x]>>12==8 for x in [29,30])
sections=[('C3 central','C3',70,74),('C3 norte','C3',60,69),
          ('C3 central sul','C3',75,79),('C3 sul','C3',80,89),
          ('B3','B3',30,59),('A3','A3',0,29)]
blocks=[]
for name,sector,lo,hi in sections:
    entries=[];doors=[]
    for e in inv['enemies']:
        x,y=e['original']
        if e['sector']!=sector or not lo<=y<=hi or (x,y) in existing:continue
        assert M[y][x]==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper()
        enemy,troop=species[e['species']]
        entries.append(dict(id=f'stonekeep.{sector.lower()}.enemy.mif{x:02}.{y:02}',sourceOriginal=[x,y],
          origin=center(x,y),species=e['species'],enemyId=enemy,troopId=troop,sourceFlat=e['resource'],
          questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
    for d in inv['doors']:
        x,y=d['original']
        if d['sector']!=sector or not lo<=y<=hi or (x,y) in old_doors:continue
        raw=M[y][x];lock=locks.get((x,y))
        assert raw>>12==11 and lock in (None,1,2,3) and not any(t[:2]==[x,y] for t in triggers)
        ew=all(solid(M[y+dy][x]) for dy in (-1,1))
        ns=all(solid(M[y][x+dx]) for dx in (-1,1))
        assert ew!=ns and tex['textures'][(raw&127)-1]['file']==d['texture']['file']
        doors.append(dict(id=f'stonekeep.{sector.lower()}.door.mif{x:02}.{y:02}',sourceOriginal=[x,y],
          view=[89-x,y],center=center(x,y),axis='east-west' if ew else 'north-south',raw=raw,
          texture=d['texture']['file'],lockValue=lock,lockPolicy='forceableOrdinary' if lock else None,triggerAtDoor=None))
    blocks.append(dict(name=name,sector=sector,entries=entries,doors=doors))
assert sum(len(b['entries']) for b in blocks)==61
assert sum(len(b['doors']) for b in blocks)==24
wet=[f'{x},{y}' for y in range(90) for x in range(90) if M[y][x] and reg(*center(x,y))==5]
# Conservative native audit of the first level leaves these two optional
# components disconnected. Keep their original events and positions.
pending_coords={(14,77),(12,78),(13,78),(18,5),(10,6),(16,6),(20,6),(20,7),
                (20,10),(17,12),(18,13),(9,15),(11,15),(8,16),(8,21)}
pending=[e['id'] for block in blocks for e in block['entries'] if tuple(e['sourceOriginal']) in pending_coords]
assert len(pending)==15
data=dict(pendingAccess=pending,uncertainWater=wet,base='9c9b802',sourceSha256=sha,dryCrossing=[[181,222],[182,222]],blocks=blocks)
(R/'doc/mapas/STONEKEEP_ALAS_LESTE_M02.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print([(b['name'],len(b['entries']),len(b['doors'])) for b in blocks])
