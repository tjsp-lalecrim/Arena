"""Twelve authored Minotaur poses, targeted direction correction; no mirroring or battle rewrite."""
from pathlib import Path
from PIL import Image
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];base=R/'art/masters/stonekeep-minotaur-walk-v01'
def load(name):
    im=Image.open(base/name).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a));return im,cutouts(im,12,3)
im,parts=load('sheet-v01.png');other,edit=load('sheet-v02-directions.png');sources=['sheet-v01.png']*12
for i in [2,3,4,5,11]:parts[i]=edit[i];sources[i]='sheet-v02-directions.png'
scale=62/max(c.height for c,_,_ in parts);sheet=Image.new('RGBA',(288,384));metrics=[]
for i,(cut,box,rect)in enumerate(parts):
    source=im if sources[i]=='sheet-v01.png'else other;assert rect[0]>0 and rect[1]>0 and rect[2]<source.width and rect[3]<source.height,(i,'source crop')
    row,col=divmod(i,3);head=cut.getchannel('A').crop((0,0,cut.width,round(cut.height*.16))).getbbox();axis=(head[0]+head[2])/2
    body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA');px=round(48-axis*scale);py=94-body.height;frame=Image.new('RGBA',(96,96));frame.alpha_composite(body,(px,py));bbox=frame.getbbox();assert bbox and min(bbox[:2])>0 and bbox[2]<96 and bbox[3]<96,(i,bbox)
    sheet.alpha_composite(frame,(col*96,row*96));metrics.append({'direction':[2,4,6,8][row],'pattern':col,'sourceFile':sources[i],'sourceRect':rect,'axis':axis,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({v['sha256']for v in metrics})==12
dest=R/'img/characters/$Arena_minotaur_walk_v01.png';sheet.save(dest)
meta={'sources':[{'file':(base/n).relative_to(R).as_posix(),'sha256':hashlib.sha256((base/n).read_bytes()).hexdigest()}for n in dict.fromkeys(sources)],'output':dest.relative_to(R).as_posix(),'outputSHA256':hashlib.sha256(dest.read_bytes()).hexdigest(),'cell':[96,96],'ground':94,'scale':scale,'rows':[2,4,6,8],'frames':metrics,'approval':json.loads((R/'doc/arte/minotaur-walk-v01/prompt.json').read_text(encoding='utf8'))['approval']}
(R/'doc/arte/minotaur-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8');bg=Image.new('RGBA',sheet.size,'#29333a');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-minotaur-v01/atlas-caminhada.png');print('12 authored Minotaur walk drawings, cardinal west corrected; shared density/support94, no mirror')
