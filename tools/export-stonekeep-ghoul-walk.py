"""Pack twelve authored walking figures; no mirroring or synthesized poses."""
from pathlib import Path
from PIL import Image, ImageDraw
from battle_components import cutouts
import json, hashlib
R=Path(__file__).resolve().parents[1]
src=R/'art/masters/stonekeep-ghoul-walk-v01/sheet-v01.png'
im=Image.open(src).convert('RGBA')
im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
parts=cutouts(im,12,3)
# Only the south neutral frame uses the AI correction; preserve all other eleven.
edit=R/'art/masters/stonekeep-ghoul-walk-v01/sheet-v02.png'
e=Image.open(edit).convert('RGBA');e.putalpha(e.getchannel('A').point(lambda a:0 if a<=16 else a))
parts[1]=cutouts(e,12,3)[1]
order=list(range(12))
scale=56/max(c.height for c,_,_ in parts)
sheet=Image.new('RGBA',(192,256));metrics=[]
for i,index in enumerate(order):
    cut,box,rect=parts[index];row,col=divmod(i,3)
    # Skull centre is the stable body axis; stride extremities do not recenter it.
    head=cut.getchannel('A').crop((0,0,cut.width,round(cut.height*.12))).getbbox()
    px=round(32-(head[0]+head[2])/2*scale)
    body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA')
    py=62-body.height;frame=Image.new('RGBA',(64,64));frame.alpha_composite(body,(px,py))
    bbox=frame.getbbox();assert bbox and min(bbox[:2])>0 and bbox[2]<64 and bbox[3]<64,(i,bbox)
    sheet.alpha_composite(frame,(col*64,row*64))
    metrics.append({'direction':[2,4,6,8][row],'pattern':col,'sourceIndex':index,'sourceFile':(edit if index==1 else src).relative_to(R).as_posix(),'sourceRect':rect,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({m['sha256'] for m in metrics})==12
dest=R/'img/characters/$Arena_ghoul_walk_v01.png';sheet.save(dest)
meta={'source':src.relative_to(R).as_posix(),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'editedSource':edit.relative_to(R).as_posix(),'editedSha256':hashlib.sha256(edit.read_bytes()).hexdigest(),'editScope':'only south neutral index1; all other eleven frames from original master','output':dest.relative_to(R).as_posix(),'outputSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'scale':scale,'cell':[64,64],'ground':62,'rows':[2,4,6,8],'order':order,'frames':metrics,'approval':'pending owner evaluation of walking/island exemplar'}
(R/'doc/arte/ghoul-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8')
bg=Image.new('RGBA',sheet.size,'#29333a');bg.alpha_composite(sheet)
bg.convert('RGB').save(R/'doc/evidencias/m02-ghoul-walk-v01/atlas-escala-real.png')
print('12 walking frames; one corrected neutral, no mirroring; shared scale',scale)
