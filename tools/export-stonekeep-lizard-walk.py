"""Pack twelve authored enemy Lizard Man poses. No Argonian assets, mirroring or battle export."""
from pathlib import Path
from PIL import Image
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];cfg=json.loads((R/'doc/arte/lizard-walk-v01/anchors.json').read_text());src=R/cfg['source'];im=Image.open(src).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a));parts=cutouts(im,12,3)
w,h=cfg['cell'];scale=cfg['scale'];sheet=Image.new('RGBA',(w*3,h*4));metrics=[]
for i,(cut,box,rect) in enumerate(parts):
    assert rect[0]>0 and rect[1]>0 and rect[2]<im.width and rect[3]<im.height,(i,'source touches edge')
    row,col=divmod(i,3);direction=[2,4,6,8][row];axis,support=cfg['bodyAxisAndSupport'][i];ground=cfg['groundByDirection'][str(direction)]
    body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA');px=round(w/2-(axis-rect[0])*scale);py=round(ground-(support-rect[1])*scale)
    frame=Image.new('RGBA',(w,h));frame.alpha_composite(body,(px,py));bbox=frame.getbbox();assert bbox and min(bbox[:2])>0 and bbox[2]<w and bbox[3]<h,(i,bbox)
    sheet.alpha_composite(frame,(col*w,row*h));metrics.append({'direction':direction,'pattern':col,'sourceRect':rect,'sourceBodyAxis':axis,'sourceClawSupport':support,'targetSupport':ground,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({m['sha256']for m in metrics})==12
dest=R/'img/characters/$Arena_lizard_man_walk_v01.png';sheet.save(dest)
meta={'source':cfg['source'],'sourceSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'output':dest.relative_to(R).as_posix(),'outputSHA256':hashlib.sha256(dest.read_bytes()).hexdigest(),'cell':cfg['cell'],'scale':scale,'ground':cfg['nominalGround'],'groundByDirection':cfg['groundByDirection'],'frames':metrics,'approval':'Walking pending owner evaluation; existing R03 enemy battle preserved, no playable Argonian appearance reused'}
(R/'doc/arte/lizard-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8');bg=Image.new('RGBA',sheet.size,'#29333a');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-lizard-walk-v01/atlas-escala-real.png');print('12 enemy Lizard Man drawings, shared density/support, native96x96 cells; battle/Argonian assets untouched')
