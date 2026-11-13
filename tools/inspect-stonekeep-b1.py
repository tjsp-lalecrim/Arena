"""Bounded B1 source contracts; original read-only, no runtime/asset writes."""
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
doors=[]
for d in inv['doors']:
 if d['sector']!='B1':continue
 x,y=d['original'];raw=M[y][x];assert raw>>12==11 and (x,y)not in locks and not any(t[:2]==[x,y]for t in triggers);h=all(solid(M[y+dy][x])for dy in[-1,1]);v=all(solid(M[y][x+dx])for dx in[-1,1]);assert h!=v
 matching=[e for e in c['doors']if e['sourceOriginal']==[x,y]];assert not matching or len(matching)==1 and matching[0]['id']==f'stonekeep.b1.door.mif{x:02}.{y:02}'
 doors.append(dict(id=f'stonekeep.b1.door.mif{x:02}.{y:02}',sourceOriginal=[x,y],view=[89-x,y],center=center(x,y),axis='east-west'if h else'north-south',raw=raw,texture=tex['textures'][raw&255]['file'],lockValue=None,triggerAtDoor=None,condition='Ordinary interaction; no LOCK/key/quest condition declared at this cell'))
entries=[];known={'orc':(7,8),'goblin':(2,2),'minotauro':(8,9)}
for e in inv['enemies']:
 if e['sector']!='B1':continue
 x,y=e['original'];assert M[y][x]==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper();enemy,troop=known[e['species']]
 entries.append(dict(id=f'stonekeep.b1.enemy.mif{x:02}.{y:02}',eventId=385+len(entries),sourceOriginal=[x,y],origin=center(x,y),species=e['species'],enemyId=enemy,troopId=troop,sourceFlat=e['resource'],questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
assert len(entries)==10 and len(doors)==4
# Routing only uses the existing conservative region model. Raised blocks remain solid.
n=274*274;reg=lambda x,y:m['data'][5*n+y*274+x]
def route(goal):
 start=(105,168);q=deque([start]);seen={start};pa={}
 while q:
  a=q.popleft()
  if a==tuple(goal):break
  for dx,dy in[(1,0),(-1,0),(0,1),(0,-1)]:
   v=a[0]+dx,a[1]+dy
   if 2<=v[0]<=181 and 2<=v[1]<=181 and v not in seen and reg(*v)in[4,5,6] and not(reg(*v)==5 and M[(v[1]-2)//3][89-(v[0]-2)//3]!=0):seen.add(v);pa[v]=a;q.append(v)
 assert tuple(goal)in seen
 path=[tuple(goal)]
 while path[-1]!=start:path.append(pa[path[-1]])
 path.reverse();runs=[];last=None
 for x,y in path:
  u,sy=(x-2)//3,(y-2)//3;key=('ABC'[sy//30]+str(1+u//30),'water'if reg(x,y)==5 else'floor')
  if key!=last:runs.append(dict(sector=key[0],terrain=key[1],world=[x,y],original=[89-u,sy]));last=key
 return dict(steps=len(path)-1,runs=runs,wetSourceRaw=sorted({hex(M[(y-2)//3][89-(x-2)//3])for x,y in path if reg(x,y)==5}),wetNonEmptyOriginal=sorted({(89-(x-2)//3,(y-2)//3,hex(M[(y-2)//3][89-(x-2)//3]))for x,y in path if reg(x,y)==5 and M[(y-2)//3][89-(x-2)//3]!=0}))
routes={e['id']:route(e['origin'])for e in entries};dry=[dict(sourceBoundary=[[59,y],[60,y]],worldBoundary=[center(59,y),center(60,y)])for y in [54,55]]
assert all(M[y][59]==M[y][60]==0 and F[y][59]>>8!=13 and F[y][60]>>8!=13 for y in[54,55]);assert not any(reg(90,3+3*y)==reg(93,3+3*y)==5 for y in range(30,60))
points=[dict(name='B1 · conexão seca B2',position=[90,168]),dict(name='B1 · salas e portas',position=[57,162]),dict(name='B1 · Minotauros',position=[82,168]),dict(name='B1 · orcs / chegada da água',position=[69,138]),dict(name='B1 · água norte',position=[69,114])]
out=dict(version=1,base='90317c8',sourceSha256=sha,bounds=[0,30,29,59],doors=doors,entries=entries,points=points,doorReferences=[dict(sourceOriginal=d['original'],center=center(*d['original']),lockValue=d['lockValue'])for d in inv['doors']],water=dict(dryBoundary=dry,wetBoundaryB2=False,sourceRoutes=routes,existingUnverifiedWetCells=[dict(sourceOriginal=[x,y],center=center(x,y),raw=M[y][x])for y in range(60)for x in range(30,90)if M[y][x]!=0 and reg(*center(x,y))==5],limits='Northern Orc room reachable by existing A2/A1 OPEN-water alternative, explicitly avoiding all wet cells with nonzero MAP1. Existing (67,26)/0x1008 wet projection remains unconfirmed and unchanged; not required by the verified alternative. MAP1(68,51..52)=0x2808 kept solid; A1 wet elevated candidates unchanged. No new under-wall interpretation or DOS observation.'),deferredOptionalTriggers=[v for v in triggers if 60<=v[0]<=89 and 30<=v[1]<=59],confidence='MIF/INF static declarations; orientation from adjacent solid cells. Sign TEXT5 and ambience deferred, not key/door conditions.')
(R/'doc/mapas/STONEKEEP_B1_M02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('B1:10refs/4ordinary doors, no LOCK; southern dry boundary and northern existing water route verified')
