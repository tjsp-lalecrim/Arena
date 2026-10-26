"""Technical extraction/packing of AI masters, never draws replacement artwork."""
from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / 'art/masters'
exports = []

def load(name):
    return Image.open(MASTERS / (name + '.png')).convert('RGBA')

def components(im, count=1):
    """Isolate connected silhouettes, excluding detached generation specks.

    Original colors are retained; one-pixel dilation preserves antialias edges.
    This also extracts the three rats without cutting a tail at a grid division.
    """
    w, h = im.size
    alpha = bytearray(im.getchannel('A').tobytes())
    groups = []
    for start in range(w*h):
        if alpha[start] < 96:
            continue
        alpha[start] = 0
        q, points = deque([start]), []
        while q:
            p = q.popleft()
            points.append(p)
            x, y = p % w, p // w
            for n in ([p-1] if x else []) + ([p+1] if x+1 < w else []) + ([p-w] if y else []) + ([p+w] if y+1 < h else []):
                if alpha[n] >= 96:
                    alpha[n] = 0
                    q.append(n)
        if len(points) > 100:
            groups.append(points)
    groups = sorted(groups, key=len, reverse=True)[:count]
    result = []
    for group in groups:
        raw = bytearray(w*h)
        for p in group:
            raw[p] = 255
        mask = Image.frombytes('L', (w,h), bytes(raw)).filter(ImageFilter.MaxFilter(3))
        box = mask.getbbox()
        cut = im.crop(box)
        original_alpha = cut.getchannel('A')
        from PIL import ImageChops
        cut.putalpha(ImageChops.multiply(original_alpha, mask.crop(box)))
        result.append((box, cut))
    return sorted(result, key=lambda pair: pair[0][0])

def fit(cut, size, scale=None, baseline=None):
    scale = scale or min((size[0]-4)/cut.width, (size[1]-4)/cut.height)
    resized = cut.resize((max(1,round(cut.width*scale)),max(1,round(cut.height*scale))), Image.Resampling.LANCZOS)
    out = Image.new('RGBA',size)
    out.alpha_composite(resized,((size[0]-resized.width)//2,(baseline or size[1]-2)-resized.height))
    return out

def save(im, relative):
    p=ROOT/relative
    p.parent.mkdir(parents=True,exist_ok=True)
    im.save(p)
    exports.append({'file':relative,'size':list(im.size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})

pilot=load('breta-piloto-v01')
w,h=pilot.size
portrait=components(pilot.crop((0,0,w//2,h//2)))[0][1]
side=components(pilot.crop((w//2,h//2,w,h)))[0][1]
save(fit(portrait,(144,144)), 'img/pictures/arena_breta_retrato_v01.png')
save(fit(side,(96,96)), 'img/pictures/arena_breta_lateral_v01.png')
faces=Image.new('RGBA',(576,288));faces.alpha_composite(fit(portrait,(144,144)),(0,0))
save(faces,'img/faces/Arena_Breton_Pilot.png')

walk=load('breta-caminhada-v02')
cuts=[]
for row in range(4):
    for col in range(3):
        cell=walk.crop((col*walk.width//3,row*walk.height//4,(col+1)*walk.width//3,(row+1)*walk.height//4))
        cuts.append(components(cell)[0][1])
scale=min(58/max(c.height for c in cuts),44/max(c.width for c in cuts))
sheet=Image.new('RGBA',(144,256))
for i,cut in enumerate(cuts):sheet.alpha_composite(fit(cut,(48,64),scale,62),((i%3)*48,(i//3)*64))
save(sheet,'img/characters/$Arena_Breton_Pilot.png')
save(sheet.crop((48,0,96,64)),'img/pictures/arena_breta_frente_v01.png')
save(sheet.crop((48,192,96,256)),'img/pictures/arena_breta_costas_v01.png')

rats=components(load('rato-respiracao-v02'),3)
assert len(rats)==3
scale=min(88/max(c.width for _,c in rats),56/max(c.height for _,c in rats))
rat=Image.new('RGBA',(288,64))
for i,(_,cut) in enumerate(rats):rat.alpha_composite(fit(cut,(96,64),scale,60),(i*96,0))
save(rat,'img/pictures/arena_rato_respiracao_v01.png')

stone=load('pedra-piso-parede-v01')
b=Image.new('RGBA',(768,768))
for i in range(2):
    tile=stone.crop((i*stone.width//2,0,(i+1)*stone.width//2,stone.height)).resize((48,48),Image.Resampling.LANCZOS)
    b.alpha_composite(tile,((i+1)*48,0))
# MV B consumer is a 16x16 tile sheet (768px at 48px/tile).
save(b,'img/tilesets/Arena_Stone_M01.png')

icons=load('icones-v01')
strip=Image.new('RGBA',(96,32))
for i in range(3):
    cell=icons.crop((i*icons.width//3,0,(i+1)*icons.width//3,icons.height))
    cut=components(cell)[0][1]
    strip.alpha_composite(fit(cut,(32,32)),(i*32,0))
save(strip,'img/pictures/arena_icones_v01.png')
intro=load('ria-sonho-v01').resize((816,544),Image.Resampling.LANCZOS)
save(intro,'img/pictures/arena_ria_sonho_v01.png')

report={'masters':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in MASTERS.glob('*.png')], 'exports':exports,'ratSourceBoxes':[list(box) for box,_ in rats]}
report['alphaBoxes'] = {}
for file, columns, rows, cw, ch, baseline in [
    ('img/characters/$Arena_Breton_Pilot.png',3,4,48,64,62),
    ('img/pictures/arena_rato_respiracao_v01.png',3,1,96,64,60),
    ('img/pictures/arena_icones_v01.png',3,1,32,32,30)
]:
    image = Image.open(ROOT/file).convert('RGBA')
    assert image.size == (columns*cw, rows*ch)
    boxes = []
    for row in range(rows):
        for col in range(columns):
            box=image.crop((col*cw,row*ch,(col+1)*cw,(row+1)*ch)).getchannel('A').getbbox()
            assert box and box[0]>0 and box[1]>0 and box[2]<cw and box[3]==baseline
            boxes.append(list(box))
    report['alphaBoxes'][file] = boxes
(ROOT/'doc/arte/exportacoes-m01-06.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['exports'],ensure_ascii=False,indent=2))
