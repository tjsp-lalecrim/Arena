"""Read-only art/source audit; technical checks complement visual inspection."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[1];out=R/'doc/evidencias/m01-14/r02'
def record(p):
 p=Path(p);return {'file':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
sources=[R/'doc/prints/arena_loot.jfif',R/'tmp/original-review/START-decoded.txt',R/'tmp/original-review/manual-consulta.txt',next((R/'doc/wiki').glob('Arena_Imperial Dungeons*.pdf')),Path('D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA/START.MIF'),Path('D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA/GLOBAL.BSA')]
records=[record(p) for p in sources];prior=json.loads((R/'doc/evidencias/m01-14/fontes-e-topologia.json').read_text(encoding='utf8'))['sources']
for source in records[-2:]:assert any(p['sha256']==source['sha256'] for p in prior)
doors=Image.open(R/'img/characters/!$Arena_Doors_M14_R02.png');assert doors.size==(432,384)
for row in range(4):assert len({doors.crop((f*144,row*96,(f+1)*144,(row+1)*96)).tobytes() for f in range(3)})==3
water=Image.open(R/'img/tilesets/Arena_Water_M14_R02_A1.png');assert len({water.crop((f*96,0,(f+1)*96,144)).tobytes() for f in range(3)})==3
runtime=['data/Map008.json','data/ArenaDungeon.json','data/Tilesets.json','js/plugins.js','js/plugins/Arena_Dungeon.js','tools/build-dungeon-map.py','tools/build-dungeon-objects.py','tools/test-dungeon-revision.cjs','tools/test-dungeon.cjs','tools/validate-dungeon.cjs']
report={'date':'2026-10-27','base':'4161615','sources':records,'originalBsaAndMifUnchanged':True,'runtime':[record(R/p) for p in runtime],'checks':['4 directional door rows with3 distinct frames each','3 distinct native A1 surface phases','canonical plugin format/engine/maps1-7 checked separately by validate-dungeon','source layout remains unchanged vs4161615'],'limits':['Source text confirms swimming exists, not executable3D geometry','No DOSBox original playtest','Pixel/dimension checks cannot approve perspective or aesthetic fit','MV editor capture failed twice; physical A56 not tested']}
assert subprocess.check_output(['git','diff','4161615','--','doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json'],cwd=R)==b''
(out/'fontes-testadas.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS original files unchanged, fixed layout preserved, distinct animation frames and source/runtime hashes')
