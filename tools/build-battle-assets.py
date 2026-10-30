"""Technical crop/scale/alignment only; artwork is AI-generated, never synthesized here."""
from pathlib import Path
from PIL import Image
import json,hashlib,statistics
R=Path(__file__).resolve().parents[1]
specs=[('breton-female','art/masters/combate-r01/breton-female.png',(128,112),104,88),('rat','art/masters/combate-r01/rat.png',(128,80),74,96)]
records=[]
for key,source,size,ground,target in specs:
 im=Image.open(R/source).convert('RGBA');cols=[round(i*im.width/3) for i in range(4)]
 # Observed row boundaries in the generated masters, not an assumed exact grid.
 rows=[0,380,748,1115,im.height];crops=[]
 for y in range(4):
  for x in range(3):
   rect=(cols[x],rows[y],cols[x+1],rows[y+1]);c=im.crop(rect)
   # Generated alpha contains almost-invisible background noise. Retain master;
   # exports remove only alpha<=16 before measuring bounds, never redraw anatomy.
   c.putalpha(c.getchannel('A').point(lambda a: 0 if a<=16 else a));box=c.getbbox();assert box
   crops.append((c,box,rect))
 scale=target/(statistics.median(b[3]-b[1] for _,b,_ in crops[:3]) if key!='rat' else max(b[2]-b[0] for _,b,_ in crops))
 sheet=Image.new('RGBA',(size[0]*3,size[1]*4));frames=[]
 for i,(c,b,rect) in enumerate(crops):
  body=c.crop(b);dim=(round(body.width*scale),round(body.height*scale))
  image=body.convert('RGBa').resize(dim,Image.Resampling.LANCZOS).convert('RGBA')
  if i//3==3: px=(size[0]-dim[0])//2
  else:
   foot=c.getchannel('A').crop((0,max(b[1],b[3]-50),c.width,b[3])).getbbox()
   px=round((44 if key!='rat' else 32)-(foot[0]-b[0])*scale)
  py=ground-dim[1]
  assert px>=0 and py>=0 and px+dim[0]<=size[0] and py+dim[1]<=size[1],(key,i,px,py,dim)
  frame=Image.new('RGBA',size);frame.alpha_composite(image,(px,py));sheet.alpha_composite(frame,((i%3)*size[0],(i//3)*size[1]))
  frames.append({'index':i,'sourceRect':rect,'sourceAlphaBox':b,'exportAlphaBox':frame.getbbox(),'placement':[px,py], 'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
 path='img/'+('sv_actors' if key!='rat' else 'enemies')+'/Arena_Combat_'+key+'_r01.png';(R/path).parent.mkdir(parents=True,exist_ok=True);sheet.save(R/path)
 records.append({'id':key,'source':source,'file':path,'size':sheet.size,'cell':size,'ground':ground,'scale':scale,'frames':frames,'sha256':hashlib.sha256((R/path).read_bytes()).hexdigest()})
(R/'doc/arte/COMBATE_EXPORTS_R01.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('PASS: AI masters exported non-destructively;12 distinct bounded frames per pilot, uniform scale per participant.')
