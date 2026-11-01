"""Technical packing of five AI masters. No original pixels used in runtime.

Run with Python + Pillow. C sheet: 48px cells, unchanged native water A1.
Wall face is 2 cells high; cap is one cell, darkened to distinguish its plane.
Shore alpha is trimmed to the main strip; edge/corner pieces are masks of it.
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageChops
import json, hashlib

ROOT = Path(__file__).resolve().parents[1]
c = json.loads((ROOT/'doc/mapas/STONEKEEP_VISUAL_V01.json').read_text(encoding='utf8'))
masters = ROOT/c['masters']
sheet = Image.new('RGBA', (384, 768))
L = Image.Resampling.LANCZOS

def load(name):
    return Image.open(masters/(name+'.png')).convert('RGBA')

def paste(im, x, y):
    sheet.alpha_composite(im, (x, y))

# Preserve the four-by-four slab layout; each slab occupies a 48px cell.
paste(load('mottled-floor').resize((192, 192), L), 0, 0)
paste(load('pale-slabs').resize((192, 192), L), 0, 192)

def periodic_x(im):
    # Small deterministic boundary correction, not replacement painted content.
    for y in range(im.height):
        a,b=im.getpixel((0,y)),im.getpixel((im.width-1,y))
        edge=tuple(round((a[n]+b[n])/2) for n in range(4))
        im.putpixel((0,y),edge);im.putpixel((im.width-1,y),edge)
    return im

for name,x in [('light-wall',192),('brown-wall',288)]:
    raw=load(name)
    # First four running-bond courses; common transform, no per-tile recentring.
    face=periodic_x(raw.crop((0,0,raw.width,556)).resize((96,96),L))
    cap=ImageEnhance.Brightness(face.resize((96,48),L)).enhance(.43)
    paste(cap,x,0);paste(face,x,48)

raw=load('shore')
alpha=raw.getchannel('A')
bounds=alpha.point(lambda v:255 if v>=160 else 0).getbbox()
assert bounds and bounds[0]==0 and bounds[2]==raw.width
strip=periodic_x(raw.crop(bounds).resize((48,8),L))
# East/west pieces are technical orientations of a shallow, overhead coping,
# not a rotated frontal wall/object. Corners overlap by alpha without new land.
for mask in range(1,16):
    tile=Image.new('RGBA',(48,48))
    if mask&1: tile.alpha_composite(strip.transpose(Image.Transpose.FLIP_TOP_BOTTOM),(0,0))
    if mask&2: tile.alpha_composite(strip.transpose(Image.Transpose.ROTATE_90),(40,0))
    if mask&4: tile.alpha_composite(strip,(0,40))
    if mask&8: tile.alpha_composite(strip.transpose(Image.Transpose.ROTATE_270),(0,0))
    paste(tile,(mask%8)*48,(8+mask//8)*48)

dest=ROOT/('img/tilesets/'+c['sheet']+'.png')
sheet.save(dest)
manifest={
    'version':c['version'],'tool':'image_gen built-in; export técnico Pillow',
    'approval':c.get('directionApproval','pendente do responsável'),'tileSize':48,'sheetSize':list(sheet.size),
    'shoreCrop':list(bounds),'shoreExport':[48,8],
    'wallFace':[96,96],'wallCap':[96,48],'capBrightness':.43,
    'masters':{p.name:{'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(masters.glob('*.png'))},
    'output':{'file':dest.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()},
    'reused':['img/tilesets/Arena_Water_M14_R02_A1.png','img/tilesets/Arena_Dungeon_M14_R03.png','img/characters/!$Arena_Ripple_M14_R02.png'],
    'notes':['Somente pixels gerados por IA nos novos materiais; consultas originais não exportadas.',
             'Cap derivado técnico da alvenaria, escurecido; não identificação de teto original.',
             'Atribuição por configuração: materiais confirmados separados de superfícies e ornamentos ausentes.',
             'Sem decoração, portas, carpete, item ou inimigo novos.']
}
(ROOT/'doc/arte/STONEKEEP_VISUAL_V01_EXPORTS.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Exported',dest.name,'shore alpha crop',bounds)
