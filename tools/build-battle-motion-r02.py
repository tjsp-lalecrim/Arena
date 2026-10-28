"""Pack newly drawn AI in-betweens. Preserve R01; no synthetic body interpolation."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
from battle_components import cutouts
R=Path(__file__).resolve().parents[1]
def load(name,count,cols):
 im=Image.open(R/('art/masters/combate-r02/'+name+'.png')).convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<=16 else a))
 return cutouts(im,count,cols)
support=load('pilot-support',18,6);light=load('pilot-light',6,3);heavy=load('pilot-heavy',6,3);magic=load('pilot-magic-item',12,6);rats=load('rat',24,6)
durations={'idle':[16,16,20,16,16,20],'light':[4,5,4,3,5,5],'heavy':[5,8,7,5,7,8],'cast':[5,7,7,5,6,6],'item':[5,6,6,8,6,5],'hurt':[3,5,6,5,4,5],'defeat':[6,7,8,7,8,12],'bite':[5,7,5,4,6,6]}
groups=[('idle',support[:6],'pilot-support',88/(support[0][1][3]-support[0][1][1])),('light',light,'pilot-light',88/(light[0][1][3]-light[0][1][1])),('heavy',heavy,'pilot-heavy',88/(heavy[0][1][3]-heavy[0][1][1])),('cast',magic[:6],'pilot-magic-item',88/(magic[0][1][3]-magic[0][1][1])),('item',magic[6:],'pilot-magic-item',88/(magic[0][1][3]-magic[0][1][1])),('hurt',support[6:12],'pilot-support',88/(support[0][1][3]-support[0][1][1])),('defeat',support[12:],'pilot-support',88/(support[0][1][3]-support[0][1][1]))]
config=json.loads((R/'data/ArenaBattleMotion.json').read_text(encoding='utf8'))
config['skillMotions'].update({'9':'cast','10':'cast'})
records=[]
hands=json.loads((R/'art/masters/combate-r02/hand-anchors.json').read_text(encoding='utf8'))
def pack(id,folder,file,cell,ground,groups):
 sheet=Image.new('RGBA',(cell[0]*6,cell[1]*len(groups)));motions={}
 for row,(name,crops,master,scale) in enumerate(groups):
  frames=[]
  for n,(crop,box,rect) in enumerate(crops):
   body=crop.crop(box);body=body.convert('RGBa').resize((round(body.width*scale),round(body.height*scale)),Image.Resampling.LANCZOS).convert('RGBA')
   # Ground-aligned source cutouts; consistent density per master, no per-frame scaling.
   if name=='defeat' and n>=3:px=(cell[0]-body.width)//2
   else:
    foot=crop.getchannel('A').crop((0,max(box[1],box[3]-round((box[3]-box[1])*.16)),crop.width,box[3])).getbbox()
    px=round((44 if folder=='sv_actors' else 30)-(foot[0]-box[0])*scale);px=max(4,min(px,cell[0]-body.width-4))
   py=ground-body.height;assert px>=0 and py>0 and px+body.width<cell[0],(id,name,n,body.size,px,py)
   frame=Image.new('RGBA',cell);frame.alpha_composite(body,(px,py));sheet.alpha_composite(frame,(n*cell[0],row*cell[1]))
   frames.append({'rect':[n*cell[0],row*cell[1],*cell],'duration':durations[name][n]})
   if folder=='sv_actors' and name in hands:
    frames[-1]['hand']=hands[name][n]
    frames[-1]['weaponLayer']='back' if (name=='light' and n==1) or (name=='heavy' and n==2) else 'front'
   records.append({'participant':id,'motion':name,'frame':n,'master':'art/masters/combate-r02/'+master+'.png','sourceRect':rect,'sourceAlphaBox':box,'densityScale':scale,'placement':[px,py],'alphaBox':frame.getbbox(),'sha256':hashlib.sha256(frame.tobytes()).hexdigest()})
  motions[name]={'frames':frames,'loop':name=='idle','impact':3 if name in ['light','heavy','cast','item','bite'] else None}
 path='img/'+folder+'/'+file+'.png';sheet.save(R/path)
 return {'file':file,'cell':cell,'ground':ground,'motions':motions,'version':'r02-pilot'},sheet
pilot,ps=pack('breton.female.base','sv_actors','Arena_Combat_breton_female_r02',(128,112),104,groups)
ratScale=96/max(b[2]-b[0] for _,b,_ in rats)
rat,rs=pack('enemy.1','enemies','Arena_Combat_rat_r02',(128,80),74,[(k,rats[i*6:(i+1)*6],'rat',ratScale) for i,k in enumerate(['idle','bite','hurt','defeat'])])
config['actors']['breton.female.base']=pilot;config['enemies']['1']=rat
weapons=load('weapons',2,2)
for i,(id,height,grip) in enumerate([('1',36,.78),('2',56,.83)]):
 crop,box,rect=weapons[i];body=crop.crop(box);scale=height/body.height;body=body.convert('RGBa').resize((round(body.width*scale),height),Image.Resampling.LANCZOS).convert('RGBA');file='Arena_weapon_'+('dagger' if id=='1' else 'sword')+'_r02';body.save(R/('img/pictures/'+file+'.png'));config['weapons'][id]={'file':file,'grip':[body.width/2,height*grip],'size':body.size}
(R/'data/ArenaBattleMotion.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(R/'doc/arte/COMBATE_MOVIMENTOS_R02_EXPORTS.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
# Coordinate guides are review-only, outside the game assets.
board=Image.new('RGB',(150+ps.width,ps.height),'#17191d');board.paste(ps,(150,0),ps);d=ImageDraw.Draw(board)
for y,(name,*_) in enumerate(groups):
 d.text((4,y*112+45),name,fill='#d8ccaf')
 for f in range(6):
  for x in range(0,128,16):d.line((150+f*128+x,y*112,150+f*128+x,y*112+112),fill='#343a40')
  for yy in range(0,112,16):d.line((150+f*128,y*112+yy,150+(f+1)*128,y*112+yy),fill='#343a40')
  d.text((150+f*128,y*112),str(f),fill='white')
board.save(R/'doc/arte/combate-piloto-r02-guias.png')
print('Packed pilot42 and rat24 newly drawn frames; two separate weapons. Hand anchors still require visual authoring.')
