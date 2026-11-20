"""Technical static-object export from the sole generated MSU interpretation."""
from pathlib import Path
from PIL import Image
import hashlib,json
R=Path(__file__).resolve().parents[1]
src=R/'art/masters/fang-entry-v01/entry-source.png'
im=Image.open(src).convert('RGBA')
assert im.getextrema()[3][0]==0
box=im.getchannel('A').point(lambda v:255 if v>=16 else 0).getbbox()
im=im.crop(box);im.thumbnail((138,140),Image.Resampling.LANCZOS)
sheet=Image.new('RGBA',(432,576))
# Static scenery, not an animation. All native directions/patterns are identical.
for row in range(4):
    for col in range(3):sheet.alpha_composite(im,(col*144+(144-im.width)//2,row*144+142-im.height))
dest=R/'img/characters/!$Arena_Fang_ExitFace_V01.png';sheet.save(dest)
(R/'doc/arte/fang-entry-v01/exports.json').write_text(json.dumps({'master':str(src.relative_to(R)).replace('\\','/'),'masterSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'runtime':str(dest.relative_to(R)).replace('\\','/'),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'size':sheet.size,'cell':[144,144],'ground':142,'mode':'One static prop repeated in native cells, no animated door or climb mechanic'},indent=2)+'\n')
