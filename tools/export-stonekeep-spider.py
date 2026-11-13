"""Export sixteen authored Spider combat drawings; no anatomy painting or runtime poses."""
from pathlib import Path
from PIL import Image,ImageFilter
from battle_components import cutouts
import json,hashlib
R=Path(__file__).resolve().parents[1];src=R/'art/masters/stonekeep-spider-v01/sheet-v04-alpha.png';im=Image.open(src).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a));parts=cutouts(im,16,4)
cell=(224,160);ground=152;scale=144/parts[0][0].width;sheet=Image.new('RGBA',(896,640));motions={};metrics=[]
for i,(cut,box,rect) in enumerate(parts):
 assert rect[0]>0 and rect[1]>0 and rect[2]<im.width and rect[3]<im.height,(i,'source edge')
 row,col=divmod(i,4);name=['idle','strike','hurt','defeat'][row]
 core=cut.getchannel('A').point(lambda a:255 if a>128 else 0).filter(ImageFilter.MinFilter(17)).getbbox();assert core,(i,'body core');axis=(core[0]+core[2])/2
 body=cut.convert('RGBa').resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS).convert('RGBA');px=round(112-axis*scale);py=ground-body.height;frame=Image.new('RGBA',cell);frame.alpha_composite(body,(px,py));bbox=frame.getbbox();assert bbox and min(bbox[:2])>0 and bbox[2]<224 and bbox[3]<160,(i,bbox)
 sheet.alpha_composite(frame,(col*224,row*160));times={'idle':[26,26,26,26],'strike':[12,10,8,10],'hurt':[8,8,8,8],'defeat':[14,14,14,18]}
 motions.setdefault(name,{'frames':[],'loop':row==0,'impact':2 if row==1 else None})['frames'].append({'rect':[col*224,row*160,224,160],'duration':times[name][col]})
 metrics.append({'motion':name,'frame':col,'sourceRect':rect,'bodyCore':core,'axis':axis,'placement':[px,py],'alphaBox':bbox,'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
for name in motions:assert len({v['sha256']for v in metrics if v['motion']==name})==4
out=R/'img/enemies/Arena_Combat_spider_v01.png';sheet.save(out);profile={'file':out.stem,'cell':list(cell),'ground':ground,'motions':motions,'version':'stonekeep-spider-v01','actionMotion':'strike'}
(R/'doc/arte/spider-v01/profile.json').write_text(json.dumps(profile,indent=2)+'\n',encoding='utf8')
meta={'source':src.relative_to(R).as_posix(),'sourceSHA256':hashlib.sha256(src.read_bytes()).hexdigest(),'output':out.relative_to(R).as_posix(),'outputSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'scale':scale,'cell':list(cell),'ground':ground,'frames':metrics,'approval':json.loads((R/'doc/arte/spider-v01/prompt.json').read_text(encoding='utf8'))['approval']}
(R/'doc/arte/spider-v01/exports.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf8');bg=Image.new('RGBA',sheet.size,'#26363d');bg.alpha_composite(sheet);bg.convert('RGB').save(R/'doc/evidencias/m02-spider-v01/atlas-combate.png');print('16 Spider battle frames; four actions, one density/body-axis and ground152')
