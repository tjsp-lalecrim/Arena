"""Bounded C1 south source contracts; original read-only, no runtime/asset writes."""
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
entries=[];known={'orc':(7,8),'aranha':(9,10),'ghoul':(5,6)}
assert not [d for d in inv['doors'] if d['sector']=='C1' and 80<=d['original'][1]<=89]
for e in inv['enemies']:
 if e['sector']!='C1' or not 80<=e['original'][1]<=89:continue
 x,y=e['original'];assert M[y][x]==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper();enemy,troop=known[e['species']]
 identity=f'stonekeep.c1s.enemy.mif{x:02}.{y:02}'
 matching=[v for v in c['encounters']['entries'] if v.get('sourceOriginal')==[x,y]]
 assert not matching or len(matching)==1 and matching[0]['id']==identity
 entries.append(dict(id=identity,eventId=462+len(entries),sourceOriginal=[x,y],origin=center(x,y),species=e['species'],enemyId=enemy,troopId=troop,sourceFlat=e['resource'],questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
assert len(entries)==6
n=274*274;reg=lambda x,y:m['data'][5*n+y*274+x]
for e in entries:assert reg(*e['origin'])==4
# Existing native routes only; no uncertain water clearance.
def route(goal):
 start=(15,240);q=deque([start]);seen={start};pa={}
 while q:
  a=q.popleft()
  if a==tuple(goal):break
  for dx,dy in[(1,0),(-1,0),(0,1),(0,-1)]:
   v=a[0]+dx,a[1]+dy
   if 2<=v[0]<=91 and 182<=v[1]<=271 and v not in seen and reg(*v)in[4,5,6] and not(reg(*v)==5 and M[(v[1]-2)//3][89-(v[0]-2)//3]!=0):seen.add(v);pa[v]=a;q.append(v)
 assert tuple(goal)in seen,goal
 path=[tuple(goal)]
 while path[-1]!=start:path.append(pa[path[-1]])
 path.reverse()
 return dict(steps=len(path)-1,bounds=[min(x for x,y in path),min(y for x,y in path),max(x for x,y in path),max(y for x,y in path)],outsideBand=sorted({(89-(x-2)//3,(y-2)//3) for x,y in path if (y-2)//3>89}),terrain='native floor/door/open water only, excludes all wet cells with nonzero MAP1')
routes={e['id']:route(e['origin'])for e in entries}
points=[dict(name='C1 sul · ghouls',position=[15,243]),dict(name='C1 sul · aranha',position=[87,246]),dict(name='C1 sul · orcs',position=[48,258])]
for p in points:assert reg(*p['position'])==4,p
out=dict(version=1,base='b8a87de',sourceSha256=sha,bounds=[0,80,29,89],doors=[],entries=entries,points=points,routes=routes,locksInBand=[list(k)+[v] for k,v in locks.items() if 60<=k[0]<=89 and 80<=k[1]<=89],triggersInBand=[v for v in triggers if 60<=v[0]<=89 and 80<=v[1]<=89],connection='Existing C1 central/south corridors; no new geometry, doors or water. No new DOS observation.',confidence='Original MAP1/FLOR and inventory/STKEEP1.INF declarations; source coordinates mirrored then scaled3x3')
(R/'doc/mapas/STONEKEEP_C1_SUL_M02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print([(e['species'],e['sourceOriginal'],e['origin'])for e in entries])
