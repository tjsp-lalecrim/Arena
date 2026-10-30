"""Optional read-only source audit. Never writes into the original install or img/."""
from pathlib import Path
from PIL import Image
from pypdf import PdfReader
import hashlib,json
R=Path(__file__).resolve().parents[1];l=json.loads((R/'doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json').read_text(encoding='utf8'));pdf=next((R/'doc/wiki').glob('Arena_Imperial Dungeons*.pdf'));ref=PdfReader(pdf).pages[2].images[0].image.convert('RGB');assert ref.size==(300,300)
matched=0;different=[]
for y,row in enumerate(l['rows']):
 for x,c in enumerate(row):
  rgb=ref.getpixel((x*6+3,y*6+3));solid=sum((rgb[i]-[130,89,48][i])**2 for i in range(3))<250
  if solid==(c=='#'):matched+=1
  else:different.append([x,y,c,list(rgb)])
assert matched==2500
original=Path('D:/SteamLibrary/steamapps/common/The Elder Scrolls Arena/ARENA');paths=[original/'START.MIF',original/'GLOBAL.BSA',R/'tmp/original-review/START.MIF',pdf,R/'tmp/original-review/START.INF',R/'doc/prints/imperial dungeons map.png',R/'doc/prints/imperial dungeons 07.png',R/'doc/prints/imperial dungeons exit.jfif']
records=[{'file':str(p),'size':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths];assert records[0]['sha256']==records[2]['sha256']
report={'comparison':'Raster cell-center solid vs open outline, not full 3D collision or object behavior','matchingCells':matched,'totalCells':2500,'differences':different,'originalMifEqualsIgnoredCopy':True,'sources':records,'technicalReferenceUrls':['https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/Assets/MIFFile.cpp','https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/Assets/Compression.h','https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/Assets/ArenaTypes.cpp','https://github.com/afritz1/OpenTESArena/blob/main/OpenTESArena/src/World/MapGeneration.cpp'],'limits':'No DOS executable playtest; lower wet layer flattened for 2D. Original extracted images and binary layers stay ignored; generated map uses AI artwork.'}
out=R/'doc/evidencias/m01-14';out.mkdir(parents=True,exist_ok=True);(out/'fontes-e-topologia.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('PASS2500/2500 reference outline, original MIF copy verified; source data unchanged')
