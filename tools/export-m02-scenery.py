"""Pack generated objects and reuse existing carpet/fountain. No painted substitutes."""
from pathlib import Path
from PIL import Image
import json, hashlib
R = Path(__file__).resolve().parent.parent
masters = R/'art/masters/m02-scenery-v01'
def fit(im, size):
    bounds=im.getchannel('A').point(lambda v:255 if v>=16 else 0).getbbox()
    assert bounds, 'Empty asset cell'
    im = im.crop(bounds); im.thumbnail(size, Image.Resampling.LANCZOS); return im
def source(name):
    im=Image.open(masters/name).convert('RGBA')
    assert im.getextrema()[3][0]==0, name+' must have true alpha'
    return im
def nativeTile(im, tile):
    tile%=256; x=tile%8*48; y=tile//8*48
    return im.crop((x,y,x+48,y+48))
atlas=Image.new('RGBA',(384,768));im=source('panels-source.png')
for n in range(2):
    obj=fit(im.crop((n*im.width//2,0,(n+1)*im.width//2,im.height)),(138,94))
    atlas.alpha_composite(obj,(n*192+(144-obj.width)//2,96-obj.height))
carpet=Image.open(R/'img/tilesets/Arena_Rihad_Interiors_V01_C.png').convert('RGBA')
art=json.loads((R/'doc/arte/RIHAD_INTERIORES_EXPORTS_V01.json').read_text(encoding='utf-8'))
for n in range(9): atlas.alpha_composite(nativeTile(carpet,art['tiles']['red'+str(n)]),(n%3*48,(4+n//3)*48))
atlas.save(R/'img/tilesets/Arena_M02_Scenery_V01_E.png')
urban=source('urban-source.png');sheet=Image.new('RGBA',(1152,1152))
sizes=[(92,78),(92,106),(40,58),(62,116),(40,116),(94,138),(94,138),(94,138)]
for n,size in enumerate(sizes):
    obj=fit(urban.crop((n%3*urban.width//3,n//3*urban.height//3,(n%3+1)*urban.width//3,(n//3+1)*urban.height//3)),size)
    for pattern in range(3): sheet.alpha_composite(obj,((n%4*3+pattern)*96+(96-obj.width)//2,(n//4*4)*144+142-obj.height))
sheet.save(R/'img/characters/!Arena_Rihad_Props_V01.png')
# Reuse the transparent 2x2 fountain, preserving its existing pixels.
props=Image.open(R/'img/tilesets/Arena_Rihad_Interiors_V01_D.png').convert('RGBA')
obj=Image.new('RGBA',(96,96));tile=art['objects']['fountain']['tile']
for y in range(2):
    for x in range(2):obj.alpha_composite(nativeTile(props,tile+x+y*8),(x*48,y*48))
sheet=Image.new('RGBA',(288,576))
for n in range(3):sheet.alpha_composite(obj,(n*96,46))
sheet.save(R/'img/characters/!$Arena_Rihad_Fountain_Reuse_V01.png')
quest=source('quest-source.png');sheet=Image.new('RGBA',(144,192))
for n,size in enumerate([(42,25),(38,18),(28,44)]):
    obj=fit(quest.crop((n*quest.width//3,0,(n+1)*quest.width//3,quest.height)),size)
    for pat in range(3):sheet.alpha_composite(obj,(pat*48+(48-obj.width)//2,n*48+46-obj.height))
sheet.save(R/'img/characters/!$Arena_QuestObjects_V01.png')
files=list(masters.glob('*.png'))+[R/'img/tilesets/Arena_M02_Scenery_V01_E.png']+list((R/'img/characters').glob('*V01.png'))
files=[p for p in files if p.parent==masters or any(k in p.name for k in ['Scenery','Props','Fountain_Reuse','QuestObjects'])]
(R/'doc/arte/m02-scenery-v01/exports.json').write_text(json.dumps([{'path':str(p.relative_to(R)).replace('\\','/'),'size':Image.open(p).size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files],indent=2)+'\n')
