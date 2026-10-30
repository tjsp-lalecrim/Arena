"""Pack AI base poses. Static frames are explicit; never claim generated walking/combat cycles."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,copy
R=Path(__file__).resolve().parents[1]
ns={'__file__':str(R/'tools/build-art-samples.py')}
exec((R/'tools/build-art-samples.py').read_text(encoding='utf-8').split('pilot=load(')[0],ns)
cat=json.loads((R/'data/ArenaCatalog.json').read_text(encoding='utf-8'))
exports=[];masters=[];visuals={};thumbs=[]
def record(p):return {'file':p.relative_to(R).as_posix(),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def save(im,rel):
 p=R/rel;p.parent.mkdir(parents=True,exist_ok=True);im.save(p);exports.append(record(p))
for race in cat['races']:
 rid=race['id'];p=R/f'art/masters/criacao/{rid}-v01.png'
 if not p.exists():raise FileNotFoundError(p)
 im=Image.open(p).convert('RGBA');masters.append(record(p));rows=2 if rid=='breton' else 4
 assert im.getchannel('A').getextrema()[0]==0,p
 for gi,gender in enumerate(['male','female']):
  key=rid+'.'+gender+'.base'
  if rid=='breton' and gender=='female':
   v={'id':key,'ready':True,'character':'$Arena_Breton_Pilot','face':'Arena_Breton_Pilot','sidePicture':'arena_breta_lateral_v01','battler':'Arena_breton_female_base','poseStatus':'pilot-walk-and-static-side'}
   side=Image.open(R/'img/pictures/arena_breta_lateral_v01.png').convert('RGBA')
   portrait=Image.open(R/'img/pictures/arena_breta_retrato_v01.png').convert('RGBA')
   char=Image.open(R/'img/characters/$Arena_Breton_Pilot.png').convert('RGBA')
  else:
   cuts=[]
   for k in range(6):
    row=gi*2+k//3;col=k%3
    cell=im.crop((round(col*im.width/3),round(row*im.height/rows),round((col+1)*im.width/3),round((row+1)*im.height/rows)))
    box,cut=ns['components'](cell)[0]
    cuts.append(cut)
   scale=min(44/max(c.width for c in cuts[:4]),58/max(c.height for c in cuts[:4]))
   char=Image.new('RGBA',(144,256))
   for row,index in enumerate([0,2,3,1]):
    f=ns['fit'](cuts[index],(48,64),scale,62)
    assert f.getbbox()[0]>0 and f.getbbox()[2]<48 and f.getbbox()[3]<=62
    for col in range(3):char.alpha_composite(f,(col*48,row*64))
   side=ns['fit'](cuts[4],(96,96),baseline=94)
   portrait=ns['fit'](cuts[5],(144,144),baseline=142)
   stem='Arena_'+rid+'_'+gender+'_base'
   v={'id':key,'ready':True,'character':'$'+stem,'face':stem,'sidePicture':stem+'_side','battler':stem,'poseStatus':'static-directional-and-side-studies-no-walk-cycle'}
   save(char,'img/characters/'+v['character']+'.png')
   face=Image.new('RGBA',(576,288));face.alpha_composite(portrait,(0,0));save(face,'img/faces/'+v['face']+'.png')
   save(side,'img/pictures/'+v['sidePicture']+'.png')
  battler=Image.new('RGBA',(864,576))
  for row in range(6):
   for col in range(9):battler.alpha_composite(side,(col*96,row*96))
  save(battler,'img/sv_actors/'+v['battler']+'.png')
  v['battlerStatus']='static-pose-repeated-for-native-format-not-complete-motions'
  visuals[key]=v
  tile=Image.new('RGBA',(320,192),(27,29,33,255));tile.alpha_composite(portrait,(0,30));tile.alpha_composite(side,(160,58));tile.alpha_composite(char.crop((48,0,96,64)),(266,90))
  ImageDraw.Draw(tile).text((6,6),rid+' / '+gender,fill='white');thumbs.append(tile)
contact=Image.new('RGBA',(1280,768),(27,29,33,255))
for i,tile in enumerate(thumbs):contact.alpha_composite(tile,((i%4)*320,(i//4)*192))
save(contact,'doc/arte/personagens-m01-v01.png')
config={'schemaVersion':1,'arrivalMapId':4,'rules':{'weaponSkillIds':[1,5,6,7,8],'meleeWeaponTypeIds':[1,2],'bowWeaponTypeIds':[]},'visuals':visuals}
(R/'data/ArenaCharacterVisuals.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(R/'doc/arte/exportacoes-criacao-m01.json').write_text(json.dumps({'masters':masters,'exports':exports,'limitations':'15 new static directional/base-side sets; Breton female existing walk reused; repeated native svActor cells are format support, not new animation.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('16 combinations packed; '+str(len(exports))+' exports. Native SV sheets are explicitly static.')
