"""Pack twelve authored poses; shared density and source-row ground, no drawn or mirrored phases."""
from pathlib import Path
from PIL import Image
from battle_components import cutouts
import numpy as np
import json,hashlib
R=Path(__file__).resolve().parents[1];src=R/'art/masters/stonekeep-wolf-walk-v01/sheet-v01.png'
im=Image.open(src).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
parts=cutouts(im,12,3);scale=56/max(max(c.width,c.height) for c,_,_ in parts)
row_ground=[max(p[2][3] for p in parts[r*3:r*3+3]) for r in range(4)]
sheet=Image.new('RGBA',(192,256));metrics=[]
for i,(cut,box,rect) in enumerate(parts):
    row,col=divmod(i,3)
    # Broad back/torso axis excludes extended paw tips; no individual rescaling.
    alpha=np.asarray(cut.getchannel('A'))[:round(cut.height*.60)]
    weights=alpha.sum(axis=0);axis=float((weights*np.arange(cut.width)).sum()/weights.sum())
    px=round(32-axis*scale);py=round(62-(row_ground[row]-rect[1])*scale)
    body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA')
    frame=Image.new('RGBA',(64,64));frame.alpha_composite(body,(px,py));bbox=frame.getbbox()
    assert bbox and min(bbox[:2])>0 and bbox[2]<64 and bbox[3]<64,(i,bbox)
    sheet.alpha_composite(frame,(col*64,row*64))
    metrics.append({'direction':[2,4,6,8][row],'pattern':col,'sourceRect':rect,'torsoAxis':axis,'sourceRowGround':row_ground[row],'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({v['sha256'] for v in metrics})==12
dest=R/'img/characters/$Arena_wolf_walk_v01.png';sheet.save(dest)
meta={'source':src.relative_to(R).as_posix(),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'output':dest.relative_to(R).as_posix(),'outputSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'scale':scale,'cell':[64,64],'ground':62,'order':[2,4,6,8],'frames':metrics,'approval':'walking/patrol pending owner; battle aaea451 approved and unchanged'}
(R/'doc/arte/wolf-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8')
bg=Image.new('RGBA',sheet.size,'#29333a');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-wolf-walk-v01/atlas-escala-real.png')
print('12 genuine walk phases packed with shared density and stable source-row support.')
