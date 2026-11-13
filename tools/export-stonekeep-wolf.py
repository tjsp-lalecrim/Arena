"""Pack one AI battle exemplar only; no exploration coverage is synthesized."""
from pathlib import Path
from PIL import Image,ImageDraw
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];src=R/'art/masters/stonekeep-wolf-v01/sheet-v01.png'
im=Image.open(src).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
parts=cutouts(im,24,6);cell=(192,128);ground=120;scale=64/parts[0][1][3]
sheet=Image.new('RGBA',(1152,512));motions={};metrics=[]
for i,(cut,box,rect) in enumerate(parts):
    row,k=divmod(i,6)
    if i==5:continue # Source clips the muzzle at its right edge; keep master, do not synthesize a replacement.
    name=['idle','strike','hurt','defeat'][row]
    body=cut.crop(box);body=body.convert('RGBa').resize((round(body.width*scale),round(body.height*scale)),Image.Resampling.LANCZOS).convert('RGBA')
    # Stable support line. All frames share one density; a fall stays low.
    foot=cut.getchannel('A').crop((0,round(cut.height*.85),cut.width,cut.height)).getbbox()
    px=round(60-(foot[0]-box[0])*scale) if foot and row<3 else (cell[0]-body.width)//2
    py=ground-body.height;frame=Image.new('RGBA',cell);frame.alpha_composite(body,(px,py));bbox=frame.getbbox()
    assert bbox and min(bbox[:2])>0 and bbox[2]<cell[0] and bbox[3]<cell[1],(i,bbox)
    sheet.alpha_composite(frame,(k*cell[0],row*cell[1]))
    times={'idle':[16,16,20,16,16,20],'strike':[6,8,7,5,7,7],'hurt':[4,5,7,6,5,5],'defeat':[7,8,8,9,10,18]}
    motions.setdefault(name,{'frames':[],'loop':row==0,'impact':3 if row==1 else None})['frames'].append({'rect':[k*192,row*128,192,128],'duration':times[name][k]})
    metrics.append({'motion':name,'frame':k,'sourceRect':rect,'alphaBox':bbox,'placement':[px,py],'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
for name in motions:assert len({f['sha256'] for f in metrics if f['motion']==name})>=4,name
dest=R/'img/enemies/Arena_Combat_wolf_v01.png';sheet.save(dest)
profile={'file':dest.stem,'cell':list(cell),'ground':ground,'motions':motions,'version':'stonekeep-wolf-v01','actionMotion':'strike'}
(R/'doc/arte/wolf-v01/profile.json').write_text(json.dumps(profile,indent=2)+'\n',encoding='utf8')
(R/'doc/arte/wolf-v01/exports.json').write_text(json.dumps({'source':src.relative_to(R).as_posix(),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'output':dest.relative_to(R).as_posix(),'outputSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'scale':scale,'cell':list(cell),'ground':ground,'frames':metrics,'approval':json.loads((R/'doc/arte/wolf-v01/prompt.json').read_text(encoding='utf8'))['approval'],'coverage':'battle only; idle5, strike6, hurt6, defeat6; source idle index5 excluded for clipped muzzle; no walking/patrol/contact'},indent=2)+'\n',encoding='utf8')
bg=Image.new('RGBA',sheet.size,'#23303a');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-wolf-v01/atlas-escala-real.png')
print('23 authored drawings packed (5 idle,6 attack,6 hurt,6 defeat); clipped source index5 excluded explicitly.')
