"""Bounded A2/B2 source and connectivity selection, not a full-dungeon expansion.
Reuses ignored decoder; reads original MIF, emits authoring JSON only.
"""
from pathlib import Path
from collections import deque
import hashlib, json, struct

R=Path(__file__).resolve().parents[1]
read=lambda f:json.loads((R/f).read_text(encoding='utf8'))
b=Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes()
sha=hashlib.sha256(b).hexdigest()
assert sha=='4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
ns={};exec((R/'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
layers={}
for tag in ['MAP1','FLOR']:
    off=b.index(tag.encode());size,length=struct.unpack_from('<HH',b,off+4)
    values=struct.unpack('<8100H',ns['decode'](b[off+8:off+6+size],length))
    layers[tag]=[list(values[y*90:y*90+90]) for y in range(90)]
M,F=layers['MAP1'],layers['FLOR']
def records(tag,stride):
    off=b.index(tag.encode());size=struct.unpack_from('<H',b,off+4)[0];assert size%stride==0
    return [list(b[i:i+stride]) for i in range(off+6,off+6+size,stride)]
locks={tuple(r[:2]):r[2] for r in records('LOCK',3)}
triggers=records('TRIG',4)
inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json')
tex=read('tmp/stonekeep-review/texture-associations.json')
mp=read('data/Map015.json');region=lambda x,y:mp['data'][(5*274+y)*274+x]
# Existing conservative geometry, only inside A2+B2. Not a rule opening unknown heights.
todo=deque([(153,15)]);seen=set(todo)
while todo:
    x,y=todo.popleft()
    for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
        p=(x+dx,y+dy)
        if p not in seen and 92<=p[0]<=181 and 2<=p[1]<=181 and region(*p) in [4,5,6]:
            seen.add(p);todo.append(p)
# Separate actual independent access from the inherited provisional open LOCK passages.
blocked=set()
for (ox,y),value in locks.items():
    u=89-ox
    if 30<=u<=59 and 0<=y<=59:
        x,yy=3+3*u,3+3*y
        blocked.update((x+dx,yy+dy) for dx in [-1,0,1] for dy in [-1,0,1])
todo=deque([(153,15)]);strict=set(todo)
while todo:
    x,y=todo.popleft()
    for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
        p=(x+dx,y+dy)
        if p not in strict and p not in blocked and 92<=p[0]<=181 and 2<=p[1]<=181 and region(*p) in [4,5,6]:
            strict.add(p);todo.append(p)
existingDoors={(36,12),(42,12),(34,14),(44,14),(31,17),(47,17)}
doors=[];deferred=[]
solid=lambda v:v!=0 and v<0x8000 and v>>8==(v&255)
for d in inv['doors']:
    if d['sector'] not in ['A2','B2'] or tuple(d['original']) in existingDoors:continue
    ox,y=d['original'];u=89-ox;center=[3+3*u,3+3*y];raw=M[y][ox]
    assert raw==int(d['raw'],16) and locks.get((ox,y))==d['lockValue']
    horizontal=all(solid(M[y+dy][ox]) for dy in [-1,1])
    vertical=all(solid(M[y][ox+dx]) for dx in [-1,1])
    assert horizontal!=vertical,(ox,y,'ambiguous wall axis')
    axis='east-west' if horizontal else 'north-south'
    foundTriggers=[r for r in triggers if r[:2]==[ox,y]]
    item=dict(sourceOriginal=[ox,y],view=[u,y],center=center,axis=axis,raw=raw,
              texture=tex['textures'][(raw&255)-1]['file'],lockValue=locks.get((ox,y)),triggerAtDoor=foundTriggers or None)
    if item['lockValue'] is not None:reason='LOCK unresolved; no invented key/lock mechanic'
    elif foundTriggers:reason='TRIG needs interpretation before door configuration'
    elif tuple(center) not in seen:reason='Disconnected conservative pocket; connection/height evidence pending, no other-sector detour'
    else:reason=None
    if reason:item['dependency']=reason;deferred.append(item)
    else:
        item['id']=f"stonekeep.a2b2.door.mif{ox:02}.{y:02}"
        item['accessDependency']=None if tuple(center) in strict else 'Upstream unresolved LOCK; current access uses inherited provisional opening, not a completed gate'
        doors.append(item)
assert len(doors)==16 and sum(d['view'][1]<30 for d in doors)==4
enemies=[];missing=[]
known={'rato':(1,1),'goblin':(2,2),'esqueleto':(4,5),'ghoul':(5,6),'lobo':(6,7)}
for e in inv['enemies']:
    if e['sector']!='B2':continue
    ox,y=e['original'];u=89-ox;raw=M[y][ox];center=[3+3*u,3+3*y]
    assert raw==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper()
    item=dict(sourceOriginal=[ox,y],view=[u,y],origin=center,species=e['species'],sourceFlat=e['resource'])
    if e['species'] not in known:
        item['dependency']='Exploration walking absent; battle asset already exists, validate consumer later' if e['species']=='homem-lagarto' else 'Orc exploration/battle pilot absent; do not substitute'
        missing.append(item)
    elif tuple(center) not in seen:item['dependency']='Disconnected conservative pocket; no new passage inferred';missing.append(item)
    else:
        enemyId,troopId=known[e['species']]
        item.update(id=f"stonekeep.b2.enemy.mif{ox:02}.{y:02}",eventId=243+len(enemies),enemyId=enemyId,troopId=troopId,
                    questSpecific=False,radius=2,interval=90,regions=[4],scale=1,
                    accessDependency=None if tuple(center) in strict else 'Upstream unresolved LOCK; current access is provisional')
        enemies.append(item)
assert len(enemies)==14 and len(missing)==11
cells=[]
for y in range(33,60):
    for u in range(30,60):
        if (3+3*u,3+3*y) in seen or any((3+3*(u+dx),3+3*(y+dy)) in seen for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]):
            cells.append(dict(view=[u,y],mapRaw=M[y][89-u],floorRaw=F[y][89-u]))
config=dict(version=1,id='stonekeep.a2-b2.connected',sourceSha256=sha,
            bounds=[30,0,59,59],selection='A2 plus connected conservative B2 component; excludes southwest pocket; only3 northern B2 goblins independent of unresolved LOCK openings',
            doors=doors,deferredDoors=deferred,enemies=enemies,deferredEnemies=missing,materialCells=cells,
            points=[dict(name='A2 oeste · portas restantes',position=[126,54]),
                    dict(name='A2 → B2 · ligação norte',position=[150,93]),
                    dict(name='B2 · aposentos centrais',position=[150,120]),
                    dict(name='B2 · oeste (acesso provisório)',position=[123,129]),
                    dict(name='B2 · sul (acesso provisório)',position=[150,174])])
(R/'doc/mapas/STONEKEEP_A2_B2_M02.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('A2+B2 connected scope:',len(doors),'doors,',len(enemies),'known enemies;',len(deferred),'door dependencies,',len(missing),'enemy dependencies;',len(cells),'material cells')
