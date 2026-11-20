"""Technical crop/scale/packing only; the source illustration is preserved."""
from pathlib import Path
from PIL import Image
import json, hashlib

root = Path(__file__).resolve().parent.parent
im = Image.open(root / 'art/masters/blubamka-v01/identity.png').convert('RGBA')
assert im.getextrema()[3][0] == 0, 'Real transparency required'
portrait = im.crop((0, 0, 1000, im.height))
portrait = portrait.crop(portrait.getbbox())
sprite = im.crop((1000, 0, im.width, im.height))
sprite = sprite.crop(sprite.getbbox())
def fit(source, size):
    source = source.copy()
    source.thumbnail(size, Image.Resampling.LANCZOS)
    return source
face = Image.new('RGBA', (144, 144))
p = fit(portrait, (140, 140))
face.alpha_composite(p, ((144-p.width)//2, 144-p.height))
face.save(root / 'img/faces/Arena_Blubamka_V01.png')
# Event is stationary, direction-fixed south. Only its three front pattern cells
# are consumed; unused direction rows remain transparent, not fake walk cycles.
sheet = Image.new('RGBA', (144, 256))
s = fit(sprite, (42, 60))
for col in range(3):
    sheet.alpha_composite(s, (col*48+(48-s.width)//2, 62-s.height))
sheet.save(root / 'img/characters/$Arena_Blubamka_V01.png')
files = ['art/masters/blubamka-v01/identity.png', 'img/faces/Arena_Blubamka_V01.png',
         'img/characters/$Arena_Blubamka_V01.png']
(root / 'doc/arte/blubamka-v01/exports.json').write_text(json.dumps([
    {'path': f, 'sha256': hashlib.sha256((root/f).read_bytes()).hexdigest(),
     'size': list(Image.open(root/f).size)} for f in files], indent=2)+'\n')
