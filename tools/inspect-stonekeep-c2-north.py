"""Bounded C2 north source contracts; original read-only, no runtime/asset writes."""
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
 if d['sector']!='C2' or d['original'][1]>69:continue
 x,y=d['original'];raw=M[y][x];assert raw>>12==11 and not any(t[:2]==[x,y]for t in triggers);lock=locks.get((x,y));assert lock is None or (x,y,lock)==(39,61,3)
 h=all(solid(M[y+dy][x])for dy in[-1,1]);v=all(solid(M[y][x+dx])for dx in[-1,1]);assert h!=v;assert tex['textures'][(raw&255)-1]['file']==d['texture']['file']
 matching=[e for e in c['doors']if e['sourceOriginal']==[x,y]];assert not matching or len(matching)==1 and matching[0]['id']==f'stonekeep.c2n.door.mif{x:02}.{y:02}'
 doors.append(dict(id=f'stonekeep.c2n.door.mif{x:02}.{y:02}',sourceOriginal=[x,y],view=[89-x,y],center=center(x,y),axis='east-west'if h else'north-south',raw=raw,texture=tex['textures'][(raw&255)-1]['file'],lockValue=lock,lockPolicy='forceableOrdinary'if lock else None,triggerAtDoor=None))
entries=[];known={'goblin':(2,2),'orc':(7,8),'homem-lagarto':(3,3),'esqueleto':(4,5)}
for e in inv['enemies']:
 if e['sector']!='C2' or e['original'][1]>69:continue
 x,y=e['original'];assert M[y][x]==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper();enemy,troop=known[e['species']];matching=[v for v in c['encounters']['entries'] if v.get('sourceOriginal')==[x,y]];assert not matching or len(matching)==1 and matching[0]['id']==f'stonekeep.c2n.enemy.mif{x:02}.{y:02}'
 entries.append(dict(id=f'stonekeep.c2n.enemy.mif{x:02}.{y:02}',eventId=504+len(entries),sourceOriginal=[x,y],origin=center(x,y),species=e['species'],enemyId=enemy,troopId=troop,sourceFlat=e['resource'],questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
assert len(doors)==4 and len(entries)==9
n=274*274;reg=lambda x,y:m['data'][5*n+y*274+x]
def route(goal):
 start=(87,186);q=deque([start]);seen={start};pa={}
 while q:
  a=q.popleft()
  if a==tuple(goal):break
  for dx,dy in[(1,0),(-1,0),(0,1),(0,-1)]:
   v=a[0]+dx,a[1]+dy
   if 2<=v[0]<=181 and 2<=v[1]<=271 and v not in seen and reg(*v)in[4,5,6] and not(reg(*v)==5 and M[(v[1]-2)//3][89-(v[0]-2)//3]!=0):seen.add(v);pa[v]=a;q.append(v)
 assert tuple(goal)in seen,goal
 path=[tuple(goal)]
 while path[-1]!=start:path.append(pa[path[-1]])
 path.reverse();runs=[];last=None
 for x,y in path:
  u,sy=(x-2)//3,(y-2)//3;key=('ABC'[sy//30]+str(1+u//30),'water'if reg(x,y)==5 else'floor')
  if key!=last:runs.append(dict(sector=key[0],terrain=key[1],world=[x,y],original=[89-u,sy]));last=key
 return dict(steps=len(path)-1,runs=runs,maxOriginalY=max((y-2)//3 for x,y in path),wetNonEmptyOriginal=sorted({(89-(x-2)//3,(y-2)//3,hex(M[(y-2)//3][89-(x-2)//3]))for x,y in path if reg(x,y)==5 and M[(y-2)//3][89-(x-2)//3]!=0}),outsideEventBandCells=len({(89-(x-2)//3,(y-2)//3)for x,y in path if(y-2)//3>69}))
routes={e['id']:route(e['origin'])for e in entries};avoid=[dict(sourceOriginal=[x,y],center=center(x,y),raw=M[y][x])for y in range(90)for x in range(30,90)if M[y][x]!=0 and reg(*center(x,y))==5]
lock=next(d for d in doors if d['lockValue']==3);lx,ly=lock['center'];side=[lx-2,ly]if lock['axis']=='east-west'else[lx,ly-2]
points=[dict(name='C2 norte · ligação C1',position=[90,186]),dict(name='C2 norte · portas oeste',position=[105,189]),dict(name='C2 norte · LOCK3',position=side),dict(name='C2 norte · encontros sul',position=[108,210])]
for p in points:assert reg(*p['position'])in[4,5],p
out=dict(version=1,base='b644857',sourceSha256=sha,bounds=[30,60,59,69],doors=doors,entries=entries,points=points,water=dict(sourceRoutes=routes,avoidWetCells=avoid,policy='Existing native open-water approaches only; no water volumes/collision changes. Existing uncertain67,26 avoided; old A1 candidates unchanged.'),connection='C2 north events only. Skeleton approach uses existing corridor Y70-71, no new event/geometry there; no sector transfers.',triggersInBand=[v for v in triggers if 30<=v[0]<=59 and 60<=v[1]<=69],confidence='Read-only MIF MAP1/FLOR/LOCK/TRIG + STKEEP1.INF, declared records and adaptation, no new DOS observation')
(R/'doc/mapas/STONEKEEP_C2_NORTE_M02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('C2 north',[(e['species'],e['sourceOriginal'],e['origin'])for e in entries],[(d['sourceOriginal'],d['center'],d['axis'],d['texture'],d['lockValue'])for d in doors])
