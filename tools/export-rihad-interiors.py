"""Export shared orthogonal interior materials and separate transparent props."""
from pathlib import Path
import hashlib
import importlib.util
import json
from PIL import Image, ImageDraw, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'art/masters/rihad-interiors-v01'
spec = importlib.util.spec_from_file_location('surfaces', ROOT / 'tools/export-m02-surface-atlas.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
source = Image.open(MASTER / 'surfaces-source.png').convert('RGB')
atlas = Image.new('RGBA', (384, 768))
tiles = {}
count = 0

def material(index, size):
    x, y = index % 4, index // 4
    w, h = source.width / 4, source.height / 3
    return source.crop(tuple(round(v) for v in ((x+.03)*w, (y+.03)*h, (x+.97)*w, (y+.97)*h))).resize(size, Image.Resampling.LANCZOS)

def put(name, image):
    global count
    assert count < 128
    atlas.paste(image, (count % 8 * 48, count // 8 * 48))
    tiles[name] = 256 + count
    count += 1

for name, index in [('inn', 0), ('aggregate', 1), ('marble', 2), ('darkMarble', 3), ('pale', 4)]:
    sample = module.periodic(material(index, (96,96)), True)
    for y in range(2):
        for x in range(2):
            put(name+str(x+2*y), sample.crop((x*48,y*48,(x+1)*48,(y+1)*48)))

for name, index in [('red',8),('blue',9)]:
    sample = module.periodic(material(index, (48,48)), True)
    for y in range(3):
        for x in range(3):
            tile = sample.copy()
            draw = ImageDraw.Draw(tile)
            if x == 0: draw.rectangle((0,0,3,47),fill='#9a7b43')
            if x == 2: draw.rectangle((44,0,47,47),fill='#9a7b43')
            if y == 0: draw.rectangle((0,0,47,3),fill='#9a7b43')
            if y == 2: draw.rectangle((0,44,47,47),fill='#9a7b43')
            put(name+str(x+3*y),tile)

for name,index in [('wood',5),('rubble',6),('ashlar',7)]:
    face = module.periodic(material(index,(48,96)),False)
    cap = ImageEnhance.Brightness(material(10 if name=='wood' else 11,(48,48))).enhance(.64)
    for height,tile in enumerate([cap,face.crop((0,0,48,48)),face.crop((0,48,48,96))]):
        for edge in range(3):
            end = tile.copy()
            if edge:
                strip = ImageEnhance.Brightness(tile.crop((0,0,4,48))).enhance(.65)
                end.paste(strip,(0 if edge==1 else 44,0))
            put(name+str(height)+str(edge),end)

for index in range(3):
    tile=material(4,(48,48))
    draw=ImageDraw.Draw(tile)
    for y in range(0,48,12): draw.line((0,y,47,y),fill='#39352f',width=2)
    put('step'+str(index),tile)
atlas.save(ROOT / 'img/tilesets/Arena_Rihad_Interiors_V01_C.png')

source = Image.open(MASTER / 'props-source.png').convert('RGBA')
assert source.getextrema()[3][0] == 0
props = Image.new('RGBA',(384,768))
objects = {}
placements = [('door',0,(1,2),0,0),('frame',1,(1,2),1,0),('table',2,(2,2),2,0),
              ('counter',3,(3,1),4,0),('throne',4,(2,3),0,3),('brazier',5,(1,1),2,3),
              ('banner',6,(1,2),3,3),('fountain',7,(2,2),4,3)]
for name,index,(cols,rows),col,row in placements:
    x,y=index%4,index//4
    crop=source.crop((round(x*source.width/4),round(y*source.height/2),round((x+1)*source.width/4),round((y+1)*source.height/2)))
    bbox=crop.getbbox()
    assert bbox
    image=ImageOps.contain(crop.crop(bbox),(cols*48-4,rows*48-4),Image.Resampling.LANCZOS)
    props.alpha_composite(image,(col*48+(cols*48-image.width)//2,row*48+(rows*48-image.height)//2))
    objects[name]={'tile':512+row*8+col,'width':cols,'height':rows}
frame=props.crop((48,0,96,96)).transpose(Image.Transpose.ROTATE_90)
props.paste(frame,(4*48,48))
objects['frameEW']={'tile':524,'width':2,'height':1}
counter=props.crop((4*48,0,7*48,48)).transpose(Image.Transpose.ROTATE_90)
props.paste(counter,(0,7*48))
objects['counterNS']={'tile':568,'width':1,'height':3}
props.save(ROOT / 'img/tilesets/Arena_Rihad_Interiors_V01_D.png')
result={'tiles':tiles,'objects':objects,'sources':{},'exports':{}}
for file in MASTER.glob('*.png'):
    result['sources'][file.name]=hashlib.sha256(file.read_bytes()).hexdigest()
for name in ['Arena_Rihad_Interiors_V01_C','Arena_Rihad_Interiors_V01_D']:
    result['exports'][name]=hashlib.sha256((ROOT/'img/tilesets'/ (name+'.png')).read_bytes()).hexdigest()
(ROOT/'doc/arte/RIHAD_INTERIORES_EXPORTS_V01.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
