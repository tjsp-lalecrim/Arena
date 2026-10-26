"""Pack AI-generated motion studies only. No drawn replacement anatomy or poses."""
from PIL import Image,ImageDraw
from pathlib import Path
import json,statistics,hashlib
from battle_components import cutouts
R=Path(__file__).resolve().parents[1]
def boundary(alpha,axis,target,span):
 candidates=[]
 for p in range(max(1,round(target-span)),min((alpha.height if axis=='y' else alpha.width)-1,round(target+span))):
  line=alpha.crop((0,p,alpha.width,p+1) if axis=='y' else (p,0,p+1,alpha.height))
  count=sum(v>32 for v in line.getdata())
  candidates.append((count,abs(p-target),p))
 count,_,p=min(candidates)
 if count>2:raise ValueError(('No clean separator',axis,target,count,p))
 return p
specs=[('breton-male',3,['breton.male.base'],(128,112),104,88)]
specs += [(race,6,[race+'.male.base',race+'.female.base'],(128,112),104,88) for race in ['argonian','dark_elf','high_elf','khajiit','nord','redguard','wood_elf']]
specs += [('goblin',3,['enemy.2'],(192,112),104,72),('lizard-man',3,['enemy.3'],(192,128),120,88)]
records=[];failures=[]
for master,cols,ids,cell,ground,target in specs:
 try:
  version='-r02' if (R/('art/masters/combate-r01/'+master+'-r02.png')).exists() else ''
  source='art/masters/combate-r01/'+master+version+'.png';im=Image.open(R/source).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a));alpha=im.getchannel('A')
  byid={key:[] for key in ids}
  if master=='breton-male':
   # R02 figures in the last row still touch. R03 supplies separate AI defeat poses.
   parts=cutouts(im.crop((0,0,im.width,1195)),9,3)
   defeat=Image.open(R/'art/masters/combate-r01/breton-male-defeat-r03.png').convert('RGBA')
   # Strip is rendered at twice R02's source density, not twice character height.
   factor=im.width/defeat.width
   defeat=defeat.convert('RGBa').resize((im.width,round(defeat.height*factor)),Image.Resampling.LANCZOS).convert('RGBA')
   defeat.putalpha(defeat.getchannel('A').point(lambda a:0 if a<=16 else a))
   parts+=cutouts(defeat,3,3)
  else:parts=cutouts(im,cols*4,cols)
  for i,(crop,box,rect) in enumerate(parts):byid[ids[(i%cols)//3]].append((crop,box,rect))
  for key,crops in byid.items():
   scale=min(target/statistics.median(b[3]-b[1] for _,b,_ in crops[:3]),(cell[0]-12)/max(b[2]-b[0] for _,b,_ in crops),(ground-6)/max(b[3]-b[1] for _,b,_ in crops))
   sheet=Image.new('RGBA',(cell[0]*3,cell[1]*4));frames=[]
   for i,(c,b,rect) in enumerate(crops):
    body=c.crop(b);dim=(round(body.width*scale),round(body.height*scale));body=body.convert('RGBa').resize(dim,Image.Resampling.LANCZOS).convert('RGBA')
    if i//3==3:px=(cell[0]-dim[0])//2
    else:
     foot=c.getchannel('A').crop((0,max(b[1],b[3]-max(10,round((b[3]-b[1])*.16))),c.width,b[3])).getbbox();px=round((44 if not key.startswith('enemy') else 60)-(foot[0]-b[0])*scale)
     px=max(4,min(px,cell[0]-dim[0]-4))
    py=ground-dim[1];assert px>=0 and py>=0 and px+dim[0]<=cell[0] and py+dim[1]<=cell[1]
    frame=Image.new('RGBA',cell);frame.alpha_composite(body,(px,py));sheet.alpha_composite(frame,((i%3)*cell[0],(i//3)*cell[1]));frames.append({'index':i,'sourceRect':rect,'sourceAlphaBox':b,'exportAlphaBox':frame.getbbox(),'placement':[px,py],'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
   assert len(set(f['sha256'] for f in frames))==12
   name='Arena_Combat_'+key.replace('.base','').replace('.','_')+'_r01';folder='enemies' if key.startswith('enemy') else 'sv_actors';path='img/'+folder+'/'+name+'.png';sheet.save(R/path)
   records.append({'id':key,'source':source,'defeatSource':'art/masters/combate-r01/breton-male-defeat-r03.png' if master=='breton-male' else None,'file':path,'size':sheet.size,'cell':cell,'ground':ground,'scale':scale,'frames':frames,'sha256':hashlib.sha256((R/path).read_bytes()).hexdigest()})
 except Exception as e:failures.append({'master':master,'error':str(e)})
(R/'doc/arte/COMBATE_EXPANSION_R01.json').write_text(json.dumps({'records':records,'failures':failures},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
config=json.loads((R/'data/ArenaBattle.json').read_text(encoding='utf-8'))
config['actors']={};config['enemies']={}
pilot=json.loads((R/'doc/arte/COMBATE_EXPORTS_R01.json').read_text(encoding='utf-8'))
for record in records+pilot:
 key=record['id'];target=config['enemies'] if key.startswith('enemy') or key=='rat' else config['actors'];targetkey=key.split('.')[1] if key.startswith('enemy') else '1' if key=='rat' else 'breton.female.base' if key=='breton-female' else key
 target[targetkey]={'file':Path(record['file']).stem,'cell':record['cell'],'ground':record['ground'],'speed':8,'rows':{'wait':0,'action':1,'hurt':2,'defeat':3}}
config['coverage']='technical-candidates-owner-manual-tests-pending';(R/'data/ArenaBattle.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# External labels/contact sheets; never painted into final animation assets.
allrecords=pilot+records
for start in range(0,len(allrecords),4):
 chunk=allrecords[start:start+4];board=Image.new('RGBA',(180+12*128,len(chunk)*140),'#17191d');d=ImageDraw.Draw(board)
 for y,record in enumerate(chunk):
  im=Image.open(R/record['file']);cw,ch=record['cell'];d.text((4,y*140+50),record['id'],fill='#d8ccaf')
  for i in range(12):
   c=im.crop(((i%3)*cw,(i//3)*ch,(i%3+1)*cw,(i//3+1)*ch));c.thumbnail((128,112));board.alpha_composite(c,(180+i*128,y*140+12))
 board.convert('RGB').save(R/('doc/arte/combate-contato-r01-'+str(start//4+1)+'.png'))
print(json.dumps({'exported':len(records),'failures':failures,'actors':len(config['actors']),'enemies':len(config['enemies'])}))
