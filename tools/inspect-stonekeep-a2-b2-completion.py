"""Confirm remaining A2/B2 refs against installed MIF/INF; authoring config only."""
from pathlib import Path
import json,hashlib,struct
R=Path(__file__).resolve().parents[1];read=lambda f:json.loads((R/f).read_text(encoding='utf8'))
b=Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes();sha=hashlib.sha256(b).hexdigest();assert sha=='4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
ns={};exec((R/'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
off=b.index(b'MAP1');size,length=struct.unpack_from('<HH',b,off+4);M=struct.unpack('<8100H',ns['decode'](b[off+8:off+6+size],length))
inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json');tex=read('tmp/stonekeep-review/texture-associations.json');whole=read('data/ArenaStonekeepWhole.json');old=read('doc/mapas/STONEKEEP_A2_B2_M02.json')
expected={(48,37),(49,37),(50,37),(58,37),(58,38),(34,46),(43,46),(44,46),(34,47)};entries=[]
for e in inv['enemies']:
 if tuple(e['original'])not in expected:continue
 x,y=e['original'];raw=M[y*90+x];assert raw==0x8000+e['flat'] and tex['flats'][e['flat']].upper()==e['resource'].upper();assert e['sector']=='B2'
 species=e['species'];enemy,troop=(7,8)if species=='orc'else(3,3);assert species in ['orc','homem-lagarto']
 entries.append(dict(id=f'stonekeep.b2.enemy.mif{x:02}.{y:02}',eventId=340+len(entries),enemyId=enemy,troopId=troop,sourceOriginal=[x,y],view=[89-x,y],origin=[3+3*(89-x),3+3*y],species=species,sourceFlat=e['resource'],questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
assert len(entries)==9 and sum(e['enemyId']==7 for e in entries)==6
# All doors of this block already have explicit source-bound implementations.
sectors={}
for sec in ['A2','B2']:
 refs=[e for e in inv['enemies']if e['sector']==sec];doors=[d for d in inv['doors']if d['sector']==sec];assert len(doors)==(13 if sec=='A2' else 18)
 for d in doors:
  x,y=d['original'];assert M[y*90+x]>>12==11;assert sum(v['sourceOriginal']==[x,y]for v in whole['doors'])==1
 sectors[sec]=dict(originalEncounters=len(refs),originalDoors=len(doors),remainingDoors=0)
points=[dict(name='B2 · orcs norte',position=[125,113]),dict(name='B2 · orcs oeste',position=[98,113]),dict(name='B2 · orc e homem-lagarto',position=[140,140]),dict(name='B2 · homens-lagarto leste',position=[167,140])]
out=dict(version=1,base='f5ebdba',sourceSha256=sha,bounds=[30,0,59,59],scope='A2/B2 only;9 remaining source refs, no added doors/geometry',sectors=sectors,entries=entries,points=points,sourceConfidence='MIF MAP1 + STKEEP1.INF declared references, not new DOS observation; whole=(3+3*(89-X),3+3*Y), zero-based',adaptation='Existing radius2/interval90/dry region4; no group mechanic or all-kills gate')
(R/'doc/mapas/STONEKEEP_A2_B2_CONCLUSAO_M02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('Confirmed A2=19/19+13/13; B2 remaining6orcs+3lizard;18/18doors already bound')
