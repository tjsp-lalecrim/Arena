"""Export twelve authored orthogonal Spider poses, aligning body cores rather than swinging feet."""
from pathlib import Path
from PIL import Image,ImageFilter
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];src=R/'art/masters/stonekeep-spider-walk-v01/sheet-v01.png';im=Image.open(src).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a));parts=cutouts(im,12,3)
scale=76/max(max(c.size)for c,_,_ in parts);sheet=Image.new('RGBA',(288,384));metrics=[]
for i,(cut,box,rect)in enumerate(parts):
 assert min(rect[:2])>0 and rect[2]<im.width and rect[3]<im.height,(i,'source edge')
 row,col=divmod(i,3);core=cut.getchannel('A').point(lambda a:255 if a>128 else 0).filter(ImageFilter.MinFilter(21)).getbbox();assert core,(i,'body core');anchor=[(core[0]+core[2])/2,(core[1]+core[3])/2];dx,dy=[(0,50),(-50,0),(50,0),(0,-50)][row];anchor=[anchor[0]+dx,anchor[1]+dy]
 body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA');px=round(48-anchor[0]*scale);py=round(50-anchor[1]*scale);frame=Image.new('RGBA',(96,96));frame.alpha_composite(body,(px,py));bbox=frame.getbbox();assert bbox and min(bbox[:2])>0 and bbox[2]<96 and bbox[3]<96,(i,bbox)
 sheet.alpha_composite(frame,(col*96,row*96));metrics.append({'direction':[2,4,6,8][row],'pattern':col,'sourceRect':rect,'bodyCore':core,'anchor':anchor,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
assert len({v['sha256']for v in metrics})==12
out=R/'img/characters/$Arena_spider_walk_v01.png';sheet.save(out)
meta={'source':src.relative_to(R).as_posix(),'sourceSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'output':out.relative_to(R).as_posix(),'outputSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'scale':scale,'cell':[96,96],'legRootAnchor':[48,50],'nominalGround':94,'groundByDirection':{str(d):72 for d in [2,4,6,8]},'placement':'Existing groundByDirection hook adds22px: leg-root anchor rests24px above event screenY (tile floor center). Legspan visual only, collision remains one cell.','frames':metrics,'approval':json.loads((R/'doc/arte/spider-walk-v01/prompt.json').read_text(encoding='utf8'))['approval']}
(R/'doc/arte/spider-walk-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8');bg=Image.new('RGBA',sheet.size,'#26363d');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-spider-v01/atlas-caminhada.png');print('12 Spider walk drawings; leg-root alignment, native ground offset22px, no mirroring')
