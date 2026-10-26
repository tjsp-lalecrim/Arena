"""Pack only newly generated missing participants; preserve approved R02 byte assets."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,copy,sys,subprocess
from battle_components import cutouts
R=Path(__file__).resolve().parents[1];D=R/'art/masters/combate-r03-expansao';D.mkdir(exist_ok=True)
cfg=json.loads((R/'data/ArenaBattleMotion.json').read_text(encoding='utf8'))
base=json.loads(subprocess.check_output(['git','show','a61977b:data/ArenaBattleMotion.json'],cwd=R).decode('utf8'))
assert cfg['actors']['breton.female.base']==base['actors']['breton.female.base'] and cfg['enemies']['1']==base['enemies']['1']
handfile=D/'hands.json';hands=json.loads(handfile.read_text(encoding='utf8')) if handfile.exists() else {}
template=json.loads((R/'art/masters/combate-r02/hand-anchors.json').read_text(encoding='utf8'))
durations={k:[f['duration'] for f in m['frames']] for k,m in base['actors']['breton.female.base']['motions'].items()}
durations['strike']=durations['bite']=[5,7,5,4,6,6]
profiles=[];failures=[]
for source in sorted(D.glob('*.png')):
 key=source.stem
 if '-rejected' in key or key.endswith(('-defeat','-hurt','-bite')):continue
 enemy=key in ['goblin','lizard-man'];id='2' if key=='goblin' else '3' if key=='lizard-man' else key.replace('-','.')+'.base'
 motions=['idle','strike' if key=='goblin' else 'bite','hurt','defeat'] if enemy else ['idle','light','heavy','cast','item','hurt','defeat']
 cell=(192,112) if key=='goblin' else (192,128) if enemy else (128,112);ground=cell[1]-8;target=72 if key=='goblin' else 88
 try:
  im=Image.open(source).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
  incomplete={'khajiit-male':39,'nord-male':39,'redguard-female':38}
  parts=cutouts(im,incomplete.get(key,len(motions)*6),6)
  origins=[source.relative_to(R).as_posix()]*len(parts)
  # Missing source poses are replaced by AI-authored strips, never duplicated or synthesized.
  for motion in (['bite'] if key=='lizard-man' else ['hurt','defeat'] if key=='redguard-female' else ['defeat'] if key in incomplete else []):
   strip=D/(('lizard' if key=='lizard-man' else key)+'-'+motion+'.png')
   si=Image.open(strip).convert('RGBA');si.putalpha(si.getchannel('A').point(lambda a:0 if a<=16 else a));new=cutouts(si,6,3)
   # One density conversion for the whole strip. It is not per-pose height normalization.
   density=(parts[0][1][3]-parts[0][1][1])/(new[0][1][3]-new[0][1][1])
   normalized=[]
   for crop,box,rect in new:
    body=crop.crop(box);body=body.convert('RGBa').resize((round(body.width*density),round(body.height*density)),Image.Resampling.LANCZOS).convert('RGBA')
    normalized.append((body,body.getbbox(),rect))
   start=motions.index(motion)*6
   parts[start:start+6]=normalized;origins[start:start+6]=[strip.relative_to(R).as_posix()]*6
  assert len(parts)==len(motions)*6,(key,len(parts))
  # A return-to-guard endpoint may reuse the authored neutral pose. Preserve
  # the unclipped pose rather than integrating the source's cut-off boot/weapon.
  endpoint_repairs={'dark_elf-male':[5,17,35],'lizard-man':[17]}
  for i in endpoint_repairs.get(key,[]):
   parts[i]=parts[0];origins[i]=origins[0]
  for i,(_,_,rect) in enumerate(parts):
   si=Image.open(R/origins[i]);assert rect[0]>0 and rect[1]>0 and rect[2]<si.width and rect[3]<si.height,('Source edge contact',key,i,rect)
  scale=min(target/(parts[0][1][3]-parts[0][1][1]),(ground-5)/max(b[3]-b[1] for _,b,_ in parts),(cell[0]-12)/max(b[2]-b[0] for _,b,_ in parts))
  if not enemy and id not in hands:hands[id]={'reviewedByCodex':False,'motions':{k:copy.deepcopy(v) for k,v in template.items() if isinstance(v,list)}}
  sheet=Image.new('RGBA',(cell[0]*6,cell[1]*len(motions)));defs={};metrics=[]
  for i,(crop,box,rect) in enumerate(parts):
   row,n=divmod(i,6);motion=motions[row];body=crop.crop(box);dim=(round(body.width*scale),round(body.height*scale));body=body.convert('RGBa').resize(dim,Image.Resampling.LANCZOS).convert('RGBA')
   if motion=='defeat' and n>=3:px=(cell[0]-dim[0])//2
   else:
    foot=crop.getchannel('A').crop((0,max(box[1],box[3]-round((box[3]-box[1])*.16)),crop.width,box[3])).getbbox();px=round((60 if enemy else 44)-(foot[0]-box[0])*scale);px=max(4,min(px,cell[0]-dim[0]-4))
   py=ground-dim[1];frame=Image.new('RGBA',cell);frame.alpha_composite(body,(px,py));b=frame.getbbox();assert b[0]>0 and b[1]>0 and b[2]<cell[0] and b[3]<cell[1],(key,motion,n,b)
   sheet.alpha_composite(frame,(n*cell[0],row*cell[1]));f={'rect':[n*cell[0],row*cell[1],*cell],'duration':durations[motion][n]}
   if not enemy and motion in hands[id]['motions']:f['hand']=hands[id]['motions'][motion][n]
   defs.setdefault(motion,{'frames':[],'loop':motion=='idle','impact':3 if motion in ['light','heavy','cast','item','strike','bite'] else None})['frames'].append(f)
   metrics.append({'motion':motion,'frame':n,'source':origins[i],'sourceRect':rect,'normalizedAlphaBox':box,'placement':[px,py],'alphaBox':b,'neutralReturnRepair':i in endpoint_repairs.get(key,[]),'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
  for motion in motions:assert len(set(m['sha256'] for m in metrics if m['motion']==motion))>=4,('Not a drawn sequence',key,motion)
  name='Arena_Combat_'+key.replace('-','_')+'_r03';folder='enemies' if enemy else 'sv_actors';file='img/'+folder+'/'+name+'.png';sheet.save(R/file)
  p={'file':name,'cell':cell,'ground':ground,'motions':defs,'version':'r03-expansion'}
  if enemy:p['actionMotion']='strike' if key=='goblin' else 'bite'
  reviewed=enemy or hands[id]['reviewedByCodex']
  profiles.append({'id':id,'source':source.relative_to(R).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'file':file,'scale':scale,'profile':p,'reviewedHands':reviewed,'metrics':metrics})
  # Technical grid, fourfold presentation, all hand-bearing rows with selected anchors.
  if not enemy:
   board=Image.new('RGB',(128*6*3,112*5*3),'#17191d');d=ImageDraw.Draw(board)
   for r,motion in enumerate(['idle','light','heavy','hurt','defeat']):
    for n,f in enumerate(defs[motion]['frames']):
     x=n*384;y=r*336;rr=f['rect'];frame=sheet.crop((rr[0],rr[1],rr[0]+rr[2],rr[1]+rr[3])).resize((384,336),Image.Resampling.NEAREST);board.paste(frame,(x,y),frame)
     for xx in range(0,128,16):d.line((x+xx*3,y,x+xx*3,y+336),fill='#343a40');d.text((x+xx*3,y+2),str(xx),fill='#d8ccaf')
     for yy in range(0,112,16):d.line((x,y+yy*3,x+384,y+yy*3),fill='#343a40');d.text((x+2,y+yy*3),str(yy),fill='#d8ccaf')
     h=f.get('hand');d.text((x+2,y+20),motion+str(n),fill='white')
     if h:d.ellipse((x+h[0]*3-4,y+h[1]*3-4,x+h[0]*3+4,y+h[1]*3+4),outline='red',width=2)
   (R/'tmp/expansion-guides').mkdir(exist_ok=True);board.save(R/('tmp/expansion-guides/'+key+'.png'))
  if '--integrate' in sys.argv:
   assert reviewed,('Hands not reviewed',id)
   cfg['enemies' if enemy else 'actors'][id]=p
 except Exception as e:failures.append({'id':key,'error':str(e)})
handfile.write_text(json.dumps(hands,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(R/'doc/arte/COMBATE_EXPANSAO_R03_EXPORTS.json').write_text(json.dumps({'profiles':profiles,'failures':failures},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
if '--integrate' in sys.argv:(R/'data/ArenaBattleMotion.json').write_text(json.dumps(cfg,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'packed':len(profiles),'failures':failures,'integrated': '--integrate' in sys.argv,'currentActorCoverage':len(cfg['actors']),'currentEnemyCoverage':len(cfg['enemies'])}))
