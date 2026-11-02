"""Pack one twelve-pose walking exemplar; selected AI gait corrections, no mirrored/drawn phases."""
from pathlib import Path
from PIL import Image
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];base=R/'art/masters/stonekeep-orc-walk-v01'
def load(name,count=12):
    im=Image.open(base/name).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
    return im,cutouts(im,count,3 if count==12 else 1)
im,parts=load('sheet-v01.png');sources=['sheet-v01.png']*12
_,edit=load('sheet-v02-stride.png')
for i in [2,5]:parts[i]=edit[i];sources[i]='sheet-v02-stride.png'
_,edit=load('sheet-v03-stride.png');parts[11]=edit[11];sources[11]='sheet-v03-stride.png'
patchIm,patch=load('east-stride-v04.png',1);cut,box,rect=patch[0]
def head(c):return c.getchannel('A').crop((0,0,c.width,round(c.height*.12))).getbbox()
# The isolated correction was generated at a larger raster resolution. Match its
# helmet width to the neutral east source BEFORE using the single atlas density.
ref=head(parts[7][0]);h=head(cut);normalization=(ref[2]-ref[0])/(h[2]-h[0])
cut=cut.convert('RGBa').resize((round(cut.width*normalization),round(cut.height*normalization)),Image.Resampling.LANCZOS).convert('RGBA')
parts[8]=(cut,cut.getbbox(),rect);sources[8]='east-stride-v04.png'
scale=56/max(c.height for c,_,_ in parts);sheet=Image.new('RGBA',(192,256));metrics=[]
for i,(cut,box,rect) in enumerate(parts):
    sourceIm=Image.open(base/sources[i]);assert rect[0]>0 and rect[1]>0 and rect[2]<sourceIm.width and rect[3]<sourceIm.height,(i,rect)
    row,col=divmod(i,3);h=head(cut);axis=(h[0]+h[2])/2
    body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA')
    px=round(32-axis*scale);py=62-body.height;frame=Image.new('RGBA',(64,64));frame.alpha_composite(body,(px,py));bbox=frame.getbbox()
    assert bbox and min(bbox[:2])>0 and bbox[2]<64 and bbox[3]<64,(i,bbox)
    sheet.alpha_composite(frame,(col*64,row*64));metrics.append({'direction':[2,4,6,8][row],'pattern':col,'sourceFile':sources[i],'sourceRect':rect,'axis':axis,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({v['sha256']for v in metrics})==12
dest=R/'img/characters/$Arena_orc_walk_v01.png';sheet.save(dest)
meta={'version':'orc-walk-v01','sources':[{'file':(base/n).relative_to(R).as_posix(),'sha256':hashlib.sha256((base/n).read_bytes()).hexdigest()}for n in dict.fromkeys(sources)],'eastPatchRasterNormalization':normalization,'normalizationBasis':'helmet width of neutral east source; no per-frame pose-fit rescaling','scale':scale,'cell':[64,64],'ground':62,'rows':[2,4,6,8],'output':dest.relative_to(R).as_posix(),'outputSHA256':hashlib.sha256(dest.read_bytes()).hexdigest(),'frames':metrics,'approval':'Battle42b857f explicitly approved; walking pending owner evaluation'}
(R/'doc/arte/orc-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8')
bg=Image.new('RGBA',sheet.size,'#29333a');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-orc-walk-v01/atlas-escala-real.png')
print('12 articulated poses, source-selected corrections, stable64px cells/ground62, no mirroring; scale',scale)
