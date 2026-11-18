"""Pack the sole approved-for-evaluation bed master into two MV E-sheet cells."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
image = Image.open(ROOT / 'art/masters/rihad-inn-bed-v01/bed-source.png').convert('RGBA')
assert image.getextrema()[3][0] == 0, 'The master needs real transparency'
bed = ImageOps.contain(image.crop(image.getbbox()), (44, 92), Image.Resampling.LANCZOS)
sheet = Image.new('RGBA', (384, 768))
sheet.alpha_composite(bed, ((48 - bed.width) // 2, (96 - bed.height) // 2))
sheet.save(ROOT / 'img/tilesets/Arena_Inn_Bed_V01_E.png')
