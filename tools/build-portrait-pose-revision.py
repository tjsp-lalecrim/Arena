"""Pack four AI portrait pose edits only; preserve all other category assets.

Uniform scale/translation, alpha matte cleanup and external review overlays.
This is technical packing, never a procedural substitute for anatomical edits.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageChops
import json,hashlib,subprocess,copy
R=Path(__file__).resolve().parents[1]
ns={'__file__':str(R/'tools/build-art-samples.py')}
exec((R/'tools/build-art-samples.py').read_text(encoding='utf-8').split('pilot=load(')[0],ns)
base=json.loads(subprocess.check_output(['git','show','0a917f8:data/ArenaCharacterVisuals.json'],cwd=R))
config=copy.deepcopy(base);exports=[];masters=[];metrics=[]
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',14)
labels={'argonian':'Argoniano','breton':'Bretão','dark_elf':'Elfo Negro','high_elf':'Alto Elfo','khajiit':'Khajiit','nord':'Nórdico','redguard':'Redguard','wood_elf':'Elfo da Floresta'}
# Manual eye x/y, crown y, jaw y in a uniformly fitted144px probe.
# Review these against the probe boards; they do not certify anatomy.
anchors={'argonian.female':[88,32,6,61],'argonian.male':[88,32,3,65],
         'khajiit.female':[88,48,5,80],'khajiit.male':[88,48,5,82]}
def rec(p):return {'file':p.relative_to(R).as_posix(),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def save(im,rel):
    p=R/rel;p.parent.mkdir(parents=True,exist_ok=True);im.save(p);exports.append(rec(p))
def cutout(im):
    cut=ns['components'](im)[0][1];alpha=cut.getchannel('A')
    core=alpha.point(lambda a:255 if a>=160 else 0).filter(ImageFilter.MinFilter(5))
    cut.putalpha(ImageChops.darker(alpha,core.filter(ImageFilter.GaussianBlur(.45))))
    return cut.crop(cut.getbbox())
def portrait(cut,key):
    ps=min(140/cut.width,140/cut.height);pw,ph=round(cut.width*ps),round(cut.height*ps);px,py=(144-pw)//2,142-ph
    ex,ey,top,jaw=anchors[key];eye=((ex-px)/ps,(ey-py)/ps)
    scale=ps*76/(jaw-top);head=cut.crop((0,0,cut.width,max(1,round((jaw-py)/ps)))).getbbox()
    for _ in range(40):
        x,y=round(88-eye[0]*scale),round(52-eye[1]*scale)
        if x+head[0]*scale<3 or x+head[2]*scale>141 or y<3:scale*=.97
        else:break
    im=cut.resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(144,144));out.alpha_composite(im,(x,y))
    metrics.append({'id':key+'.base','manualProbeAnchors':anchors[key],'scaleUniform':scale,'offset':[x,y],'eyeTargetEstimate':[88,52],'headBoundsEstimate':[round(x+head[0]*scale),y,round(x+head[2]*scale),round(y+head[3]*scale)],'alphaBox':out.getbbox()})
    return out
for race in ['argonian','khajiit']:
    for gender in ['male','female']:
        key=race+'.'+gender;p=R/f'art/masters/retratos-pose-r03/{race}-{gender}-pose-r03.png';masters.append(rec(p))
        cut=cutout(Image.open(p).convert('RGBA'));face=portrait(cut,key)
        sheet=Image.new('RGBA',(576,288));sheet.alpha_composite(face)
        stem=f'Arena_{race}_{gender}_pose_r03';save(sheet,f'img/faces/{stem}.png');config['visuals'][key+'.base']['face']=stem
(R/'data/ArenaCharacterVisuals.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
tiles=[];comparisons=[]
for key,v in config['visuals'].items():
    race,gender,_=key.split('.');label=labels[race]+' / '+('Masculino' if gender=='male' else 'Feminino')
    face=Image.open(R/'img/faces'/(v['face']+'.png')).convert('RGBA').crop((0,0,144,144))
    tile=Image.new('RGBA',(220,190),(27,29,33,255));tile.alpha_composite(face,(38,30));d=ImageDraw.Draw(tile);d.text((5,5),label,font=font,fill='white')
    # Guides ONLY on review composites, never on runtime sheets.
    d.line((30,82,190,82),fill=(120,145,170,140));d.rectangle((41,33,179,173),outline=(75,85,95,100));tiles.append(tile)
    if key.rsplit('.',1)[0] in anchors:
        old=Image.open(R/'img/faces'/(base['visuals'][key]['face']+'.png')).convert('RGBA').crop((0,0,144,144))
        comp=Image.new('RGBA',(960,360),(27,29,33,255));d=ImageDraw.Draw(comp);d.text((8,5),label+' —144px e ampliação2x',font=font,fill='white')
        for n,im in enumerate([old,face]):
            x=8+n*480;d.text((x,28),'ANTES r02' if n==0 else 'DEPOIS pose-r03 — em revisão',font=font,fill='white')
            comp.alpha_composite(im,(x,66));comp.alpha_composite(im.resize((288,288),Image.Resampling.LANCZOS),(x+160,62))
            d.line((x,118,x+143,118),fill='#65788a');d.line((x+160,166,x+447,166),fill='#65788a')
        comparisons.append(comp)
def board(items,cols,w,h,rel):
    out=Image.new('RGBA',(cols*w,((len(items)+cols-1)//cols)*h),(27,29,33,255))
    for i,t in enumerate(items):out.alpha_composite(t,((i%cols)*w,(i//cols)*h))
    save(out,rel)
board(tiles,4,220,190,'doc/arte/retratos-pose-r03-todos.png')
board(comparisons,1,960,360,'doc/arte/retratos-pose-r03-antes-depois.png')
refs=[rec(p) for p in sorted((R/'art/references/pose-personagens').glob('*.png'))]
(R/'doc/arte/exportacoes-retratos-pose-r03.json').write_text(json.dumps({'baselineCommit':'0a917f8','approval':'pending owner; technical inspection is not aesthetic approval','masters':masters+refs,'exports':exports,'metrics':metrics,'scope':'4 face sheets only; all other runtime assets and12 face references unchanged','matte':'2-source-pixel perimeter cleanup and antialias, as previous revision; no mirroring/deformation','guides':'external overlays on review boards only'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Packed4 face sheets; preserved12 portraits and all exploration/combat;2 external review boards.')
