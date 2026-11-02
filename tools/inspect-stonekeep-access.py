"""Explicit ordinary locks and dry raised passage, original consulted read-only.
Consultation decoder/unpacker remain ignored; runtime does not depend on them.
"""
from pathlib import Path
import json,hashlib,struct
R=Path(__file__).resolve().parents[1]
read=lambda f:json.loads((R/f).read_text(encoding='utf8'))
b=Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes()
sha=hashlib.sha256(b).hexdigest();assert sha=='4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
ns={};exec((R/'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0],ns)
layers={}
for tag in ['MAP1','FLOR']:
 off=b.index(tag.encode());size,length=struct.unpack_from('<HH',b,off+4)
 a=struct.unpack('<8100H',ns['decode'](b[off+8:off+6+size],length));layers[tag]=[list(a[y*90:y*90+90]) for y in range(90)]
M,F=layers['MAP1'],layers['FLOR']
off=b.index(b'LOCK');size=struct.unpack_from('<H',b,off+4)[0];locks={tuple(b[i:i+2]):b[i+2] for i in range(off+6,off+6+size,3)}
off=b.index(b'TRIG');size=struct.unpack_from('<H',b,off+4)[0];triggers=[list(b[i:i+4]) for i in range(off+6,off+6+size,4)]
inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json')
solid=lambda v:v and v<0x8000 and v>>8==(v&255)
def door(x,y,policy=None):
 u=89-x;v=M[y][x];assert v>>12==11
 assert not any(t[:2]==[x,y] for t in triggers)
 horizontal=all(solid(M[y+d][x]) for d in [-1,1]);vertical=all(solid(M[y][x+d]) for d in [-1,1]);assert horizontal!=vertical
 return dict(id=f'stonekeep.access.door.mif{x:02}.{y:02}',sourceOriginal=[x,y],view=[u,y],center=[3+3*u,3+3*y],raw=v,
             axis='east-west' if horizontal else 'north-south',lockValue=locks.get((x,y)),triggerAtDoor=None,lockPolicy=policy)
locked=[door(x,y,'forceableOrdinary') for x,y in [(51,15),(51,19),(54,19),(39,44),(39,49)]]
assert [v['lockValue'] for v in locked]==[1,1,1,2,3]
pocket=[door(x,y) for x,y in [(57,52),(52,53),(52,56),(54,56)]];assert all(v['lockValue'] is None for v in pocket)
tables=read('tmp/stonekeep-review/height-tables-consultation.json')
assert tables['heightsInterior'][6]==75 and tables['thicknessesInterior'][3]==25
corridor=[]
for y in range(41,50):
 assert M[y][56]==0x1e4d and F[y][56]>>8 in [2,3,6]
 corridor.append(dict(sourceOriginal=[56,y],view=[33,y],center=[102,3+3*y],raw=0x1e4d,floorRaw=F[y][56]))
enemies=[]
for n,(x,y) in enumerate([(55,54),(58,55)]):
 assert M[y][x]==0x8035
 enemies.append(dict(id=f'stonekeep.b2.enemy.mif{x:02}.{y:02}',eventId=338+n,sourceOriginal=[x,y],origin=[3+3*(89-x),3+3*y],
                     enemyId=2,troopId=2,sourceFlat='GOBLIN.DFA',questSpecific=False,radius=2,interval=90,regions=[4],scale=1))
cfg=dict(version=1,sourceSha256=sha,mapId=15,lockedDoors=locked,pocketDoors=pocket,pocketEnemies=enemies,
         force=dict(framesPerLockLevel=45,ordinaryLevels=[1,2,3],policy='Deterministic universal force, no class/item/resource requirement; adapted, not original probability/wear formula'),
         dryPassage=dict(cells=corridor,worldBounds=[101,125,103,151],bottomUnits=75,thicknessUnits=25,ceilingUnits=150,
                         technicalStandingHeadUnits=61,classification='Geometry confirmed from MIF+ACD tables, clearance corroborated by OpenTESArena; no DOS observation',roofOpacityInside=112),
         points=[dict(name='Aposentos / lobos',position=[117,45]),dict(name='B2 · porta LOCK2',position=[153,132]),
                 dict(name='B2 · porta LOCK3',position=[153,147]),dict(name='B2 · corredor sob estrutura',position=[102,123]),
                 dict(name='B2 · bolsa sudoeste',position=[105,168])])
(R/'doc/mapas/STONEKEEP_ACESSOS_A2_B2_M02.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('5 ordinary LOCK doors;9 dry raised cells;4 pocket doors/2 goblins; no key item invented')
