"""Pixel and contract audit complements, never replaces, native visual review."""
from pathlib import Path
from PIL import Image
import hashlib,json,subprocess
R=Path(__file__).resolve().parents[1];out=R/'doc/evidencias/m01-14/r03'
def rec(p):
 p=Path(p);v={'file':str(p.relative_to(R)) if p.is_relative_to(R) else str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 if p.suffix.lower()=='.png':
  im=Image.open(p);v.update(size=list(im.size),mode=im.mode)
 return v
sheet=Image.open(R/'img/characters/!$Arena_Doors_M14_R03.png');assert sheet.size==(432,576)
for row in range(4):
 frames=[sheet.crop((n*144,row*144,(n+1)*144,(row+1)*144)) for n in range(3)];assert len({im.tobytes() for im in frames})==3
 regions=[(4,48,10,144),(134,48,140,144)] if row in [0,3] else [(68,4,76,12),(68,136,76,144)]
 for box in regions:assert len({im.crop(box).tobytes() for im in frames})==1,'hinge pixels shifted'
 if row in [0,3]:assert frames[2].crop((10,48,134,144)).getbbox() is None,'open aperture hidden'
 else:assert frames[2].crop((8,24,136,120)).getbbox() is None,'open side aperture hidden'
treasure=Image.open(R/'img/characters/!$Arena_Treasure_M14_R03.png');boxes=[]
for n in range(3):
 box=treasure.crop((n*48,0,(n+1)*48,48)).getchannel('A').point(lambda v:255 if v>64 else 0).getbbox();boxes.append(box);assert box[2]-box[0]>=42 and box[3]-box[1]>=30;assert box[0]>=2 and box[2]<=46 and box[3]==46
files=[R/'art/m01-14/componentes-ortogonais-r03-master.png',R/'art/m01-14/tesouros-compactos-r03-master.png']+list((R/'img/characters').glob('*M14_R03.png'))+[R/'img/pictures/arena_platform_r03.png',R/'img/tilesets/Arena_Dungeon_M14_R03.png']
runtime=['data/Map008.json','data/ArenaDungeon.json','data/Tilesets.json','js/plugins.js','js/plugins/Arena_Dungeon.js','tools/build-dungeon-map.py','tools/build-dungeon-r03-assets.py','tools/test-dungeon-r03.cjs']
report={'date':'2026-10-27','base':'1f3b29f','files':[rec(p) for p in files],'runtime':[rec(R/p) for p in runtime],'defectPrints':[rec(p) for p in sorted((R/'doc/prints').glob('m01-14-revisao-2026-10-27*'))],'checks':['fixed shared144x144 canvases,3 distinct frames/4 directions','hinge pixels identical in all3 stages','open centers transparent: no participant hidden','treasure actual alpha bounds, margin and foot line verified'],'treasureVisibleAlphaBounds':boxes,'limits':['Pixels do not approve aesthetic fidelity','Original structure/style approved, door/object fit pending owner evaluation','Editor capture timeout; physical A56 pending']}
(out/'fontes-testadas.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8');(R/'doc/arte/DUNGEON_M01_14_R03_MANIFEST.json').write_text(json.dumps({k:v for k,v in report.items() if k in ['date','base','files','treasureVisibleAlphaBounds','limits']},ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('PASS invariant hinge pixels,144x144 canvases,open transparent centers,treasure visible scale; source hashes recorded')
