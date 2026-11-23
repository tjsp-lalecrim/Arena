"""Deterministic crop, uniform scale and native packing. No repainting or alpha replacement."""
from pathlib import Path
from PIL import Image
import hashlib
import json

root = Path(__file__).resolve().parent.parent
source = 'art/masters/rihad-informant-v01/identity.png'
im = Image.open(root / source).convert('RGBA')
assert im.size == (1774, 887)
assert im.getextrema()[3] == (0, 255), 'Generated real alpha required'
portrait = im.crop((0, 0, 1000, im.height))
def content_crop(image):
    # A few alpha1 pixels in the generated transparent canvas are not the figure.
    # Use alpha>8 only to locate a crop with padding; do not modify any pixel alpha.
    box = image.getchannel('A').point(lambda value: 255 if value > 8 else 0).getbbox()
    assert box
    box = (max(0,box[0]-2),max(0,box[1]-2),min(image.width,box[2]+2),min(image.height,box[3]+2))
    return image.crop(box)

portrait = content_crop(portrait)
sprite = im.crop((1000, 0, im.width, im.height))
sprite = content_crop(sprite)

def fit(image, size):
    image = image.copy()
    image.thumbnail(size, Image.Resampling.LANCZOS)
    return image

face = Image.new('RGBA', (144, 144))
p = fit(portrait, (140, 140))
face.alpha_composite(p, ((144-p.width)//2, 144-p.height))
face.save(root / 'img/faces/Arena_Rihad_Informant_V01.png')
sheet = Image.new('RGBA', (144, 256))
s = fit(sprite, (42, 60))
for col in range(3):
    sheet.alpha_composite(s, (col*48+(48-s.width)//2, 62-s.height))
sheet.save(root / 'img/characters/$Arena_Rihad_Informant_V01.png')
files = [source, 'img/faces/Arena_Rihad_Informant_V01.png',
         'img/characters/$Arena_Rihad_Informant_V01.png']
report = {
    'method': 'Built-in image_gen master; technical crop/uniform Lanczos scale only. Generated alpha preserved.',
    'portraitCrop': [0, 0, 1000, im.height], 'spriteCrop': [1000, 0, im.width, im.height],
    'cropBounds': 'Alpha>8 locates the content bounds plus2px padding; generated pixel alpha unchanged inside crop.',
    'spriteCell': [48, 64], 'figureSize': list(s.size), 'footAnchor': 62,
    'consumedPose': 'Stationary south, directionFix=true, stepAnime=false; three identical front patterns. No walking cycle claimed; unused direction rows transparent.',
    'exports': [{'path': f, 'sha256': hashlib.sha256((root/f).read_bytes()).hexdigest(),
                 'size': list(Image.open(root/f).size)} for f in files]
}
(root / 'doc/arte/rihad-informant-v01/exports.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps(report['exports'], indent=2))
