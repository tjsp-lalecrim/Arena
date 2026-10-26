"""Non-destructive technical packing of AI revisions; no procedural replacement art.

v01 assets remain byte-identical. Portrait anchors are manual artistic estimates,
not anatomical measurements. Run from any directory, using Pillow.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import copy, hashlib, json, subprocess

R = Path(__file__).resolve().parents[1]
ns = {'__file__': str(R/'tools/build-art-samples.py')}
exec((R/'tools/build-art-samples.py').read_text(encoding='utf-8').split('pilot=load(')[0], ns)
baseline = json.loads(subprocess.check_output(['git', 'show', '37e1729:data/ArenaCharacterVisuals.json'], cwd=R))
config = copy.deepcopy(baseline)
exports, masters, measurements = [], {}, []
labels = {'argonian':'Argoniano', 'breton':'Bretão', 'dark_elf':'Elfo Negro', 'high_elf':'Alto Elfo', 'khajiit':'Khajiit', 'nord':'Nórdico', 'redguard':'Redguard', 'wood_elf':'Elfo da Floresta'}
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 14)
small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 12)
def record(p):
    return {'file':p.relative_to(R).as_posix(), 'size':list(Image.open(p).size), 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def save(im, rel):
    p=R/rel; p.parent.mkdir(parents=True,exist_ok=True); im.save(p); exports.append(record(p))
def master(rel):
    p=R/rel; masters[rel]=record(p); return Image.open(p).convert('RGBA')
def isolate(cell, repair=False):
    cut=ns['components'](cell)[0][1]
    if repair:
        # Generated r03 edges contain colored matte specks. Remove two SOURCE
        # pixels of perimeter, then antialias, before reducing 300px to 56/88px.
        a=cut.getchannel('A'); core=a.point(lambda x:255 if x>=160 else 0).filter(ImageFilter.MinFilter(5))
        cut.putalpha(ImageChops.darker(a,core.filter(ImageFilter.GaussianBlur(.45))))
        cut=cut.crop(cut.getbbox())
    return cut
def cells(race,gi):
    revised=race in ['argonian','khajiit','wood_elf']
    im=master(f'art/masters/criacao-r03/{race}-r03.png' if revised else f'art/masters/criacao/{race}-v01.png')
    rows=2 if race=='breton' else 4
    result=[]
    for k in range(6):
        row=gi*2+k//3; col=k%3
        cell=im.crop((round(col*im.width/3),round(row*im.height/rows),round((col+1)*im.width/3),round((row+1)*im.height/rows)))
        result.append(isolate(cell,revised))
    return result
def frame(cut,size,height,feet):
    scale=min(height/cut.height,(size[0]-6)/cut.width)
    w,h=max(1,round(cut.width*scale)),max(1,round(cut.height*scale))
    cut=cut.resize((w,h),Image.Resampling.LANCZOS)
    # Both feet/stance extent, not the single lowest foot or whole cape/hair.
    mask=cut.getchannel('A').point(lambda x:255 if x>=96 else 0)
    bb=mask.crop((0,round(h*.8),w,h)).getbbox()
    anchor=(bb[0]+bb[2])/2 if bb else w/2
    x=round(size[0]/2-anchor)
    x=max(1,min(x,size[0]-w-1))
    out=Image.new('RGBA',size);out.alpha_composite(cut,(x,feet-h));return out

# Eye x/y, crown top and jaw bottom on a temporary 144px uniformly fitted probe.
# Only human artistic landmarks, deliberately stored for reproducibility/review.
anchors={
 'breton.male':[94,44,4,78], 'breton.female':[94,44,3,78],
 'dark_elf.male':[90,51,4,85], 'dark_elf.female':[94,47,3,79],
 'high_elf.male':[93,44,4,78], 'high_elf.female':[95,44,3,78],
 'nord.male':[92,39,3,70], 'nord.female':[96,37,3,72],
 'redguard.male':[96,40,3,80], 'redguard.female':[94,48,3,81],
 'wood_elf.male':[95,51,4,84], 'wood_elf.female':[95,45,3,80],
 'khajiit.male':[95,45,3,74], 'khajiit.female':[94,45,3,76],
 'argonian.male':[96,39,2,72], 'argonian.female':[93,31,2,62]
}
def portrait(cut,key):
    probeScale=min(140/cut.width,140/cut.height)
    pw,ph=round(cut.width*probeScale),round(cut.height*probeScale)
    px,py=(144-pw)//2,142-ph
    ex,ey,top,jaw=anchors[key]
    rawEye=((ex-px)/probeScale,(ey-py)/probeScale)
    scale=probeScale*76/(jaw-top)
    # Respect muzzle/ears: constrain head width instead of stretching anatomy.
    jawRaw=max(1,min(cut.height,round((jaw-py)/probeScale)))
    head=cut.crop((0,0,cut.width,jawRaw)).getbbox()
    targetX=88 if key.startswith(('argonian','khajiit')) else 92
    for _ in range(20):
        x=round(targetX-rawEye[0]*scale);y=round(52-rawEye[1]*scale)
        if head and (x+head[0]*scale<3 or x+head[2]*scale>141 or y<3):scale*=.97
        else:break
    resized=cut.resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(144,144));out.alpha_composite(resized,(x,y))
    return out, {'manualProbeAnchors':anchors[key], 'uniformScale':scale,'estimatedEyeTarget':[targetX,52], 'headWidthConstrained':scale<probeScale*76/(jaw-top)*.999}

portraits=[]; silhouettes=[]; comparisons=[]; directions=[]
for key,old in baseline['visuals'].items():
    race,gender,_=key.split('.');gi=['male','female'].index(gender);short=race+'.'+gender
    oldFace=Image.open(R/'img/faces'/(old['face']+'.png')).convert('RGBA').crop((0,0,144,144))
    oldChar=Image.open(R/'img/characters'/(old['character']+'.png')).convert('RGBA')
    oldSide=Image.open(R/'img/pictures'/(old['sidePicture']+'.png')).convert('RGBA')
    if race=='breton' and gender=='female':
        im=master('art/masters/breta-piloto-v01.png')
        faceCut=isolate(im.crop((0,0,im.width//2,im.height//2)))
        sideCut=isolate(oldSide)
        char=Image.new('RGBA',(144,256))
        for row in range(4):
            frames=[oldChar.crop((i*48,row*64,(i+1)*48,(row+1)*64)) for i in range(3)]
            union=Image.new('RGBA',(48,64))
            for f in frames: union=ImageChops.lighter(union,f)
            box=union.getbbox();scale=min(56/(box[3]-box[1]),42/(box[2]-box[0]))
            for i,f in enumerate(frames):
                # Same transform for every phase in this direction; gait preserved.
                piece=f.crop(box).resize((round((box[2]-box[0])*scale),round((box[3]-box[1])*scale)),Image.Resampling.LANCZOS)
                char.alpha_composite(piece,(i*48+(48-piece.width)//2,row*64+62-piece.height))
    else:
        cuts=cells(race,gi);faceCut=cuts[5];sideCut=cuts[4]
        if race=='redguard':
            im=master('art/masters/criacao-r02/redguard-portraits-r02.png')
            faceCut=isolate(im.crop((gi*im.width//2,0,(gi+1)*im.width//2,im.height)))
        char=Image.new('RGBA',(144,256))
        for row,index in enumerate([0,2,3,1]):
            f=frame(cuts[index],(48,64),56,62)
            for col in range(3):char.alpha_composite(f,(col*48,row*64))
    face,info=portrait(faceCut,short);side=frame(sideCut,(96,96),88,94)
    sheet=Image.new('RGBA',(576,288));sheet.alpha_composite(face)
    battle=Image.new('RGBA',(864,576))
    for row in range(6):
        for col in range(9):battle.alpha_composite(side,(col*96,row*96))
    stem='Arena_'+race+'_'+gender+'_r02';v=config['visuals'][key]
    v.update(character='$'+stem,face=stem,sidePicture=stem+'_side',battler=stem)
    for image,folder,name in [(char,'characters',v['character']),(sheet,'faces',v['face']),(side,'pictures',v['sidePicture']),(battle,'sv_actors',v['battler'])]:save(image,f'img/{folder}/{name}.png')
    label=labels[race]+' / '+('Masculino' if gi==0 else 'Feminino')
    p=Image.new('RGBA',(220,190),(27,29,33,255));p.alpha_composite(face,(38,30));d=ImageDraw.Draw(p);d.text((6,6),label,font=small,fill='white');d.line((30,82,190,82),fill=(100,110,130,100));portraits.append(p)
    s=Image.new('RGBA',(220,160),(27,29,33,255));d=ImageDraw.Draw(s);d.text((6,6),label,font=small,fill='white');d.line((5,130,215,130),fill='#71826b');s.alpha_composite(char.crop((48,0,96,64)),(20,68));s.alpha_composite(side,(105,36));silhouettes.append(s)
    if race in ['argonian','khajiit','wood_elf']:
        tile=Image.new('RGBA',(760,200),(27,29,33,255));d=ImageDraw.Draw(tile);d.text((8,5),label,font=font,fill='white')
        for n,(fc,ch,sd) in enumerate([(oldFace,oldChar,oldSide),(face,char,side)]):
            x=n*380;d.text((x+8,28),'ANTES v01' if n==0 else 'DEPOIS r02 (master r03)',font=small,fill='#c5bba5')
            tile.alpha_composite(fc,(x+8,50));tile.alpha_composite(ch.crop((48,0,96,64)),(x+172,130-62));tile.alpha_composite(sd,(x+250,130-94));d.line((x+164,130,x+360,130),fill='#71826b')
        comparisons.append(tile)
    measurements.append({'id':key,**info,'before':{'portraitAlphaBox':oldFace.getbbox(),'mapBoxes':[oldChar.crop((48,r*64,96,(r+1)*64)).getbbox() for r in range(4)],'sideBox':oldSide.getbbox()},'after':{'portraitAlphaBox':face.getbbox(),'mapBoxes':[char.crop((48,r*64,96,(r+1)*64)).getbbox() for r in range(4)],'sideBox':side.getbbox()}})
    strip=Image.new('RGBA',(790,120),(27,29,33,255));d=ImageDraw.Draw(strip);d.text((6,5),label,font=font,fill='white')
    for row,direction in enumerate(['Frente','Esquerda','Direita','Costas']):
        x=10+row*155;d.text((x,28),direction,font=small,fill='#c5bba5');d.line((x,111,x+143,111),fill='#71826b')
        strip.alpha_composite(char.crop((0,row*64,144,(row+1)*64)),(x,49))
    strip.alpha_composite(side,(660,17));d.line((650,111,785,111),fill='#71826b');directions.append(strip)
def board(tiles,cols,w,h,rel):
    out=Image.new('RGBA',(cols*w,((len(tiles)+cols-1)//cols)*h),(27,29,33,255))
    for i,t in enumerate(tiles):out.alpha_composite(t,((i%cols)*w,(i//cols)*h))
    save(out,rel)
board(portraits,4,220,190,'doc/arte/personagens-revisao-r02-retratos.png')
board(silhouettes,4,220,160,'doc/arte/personagens-revisao-r02-pes.png')
board(comparisons,1,760,200,'doc/arte/personagens-revisao-r02-antes-depois.png')
board(directions[:8],1,790,120,'doc/arte/personagens-revisao-r02-direcoes-1.png')
board(directions[8:],1,790,120,'doc/arte/personagens-revisao-r02-direcoes-2.png')
(R/'data/ArenaCharacterVisuals.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for p in sorted((R/'art/masters/criacao-r02').glob('*.png')):masters[p.relative_to(R).as_posix()]=record(p)
manifest={'baselineCommit':'37e1729','revision':'M01-07 characters r02; anatomy masters r03; pending owner visual review','standards':{'portraitCell':[144,144],'portraitSheet':[576,288],'eyeLineEstimate':52,'nominalCrownToJaw':76,'mapCell':[48,64],'mapNominalFigureHeight':56,'mapFeetExclusive':62,'sideCell':[96,96],'sideNominalFigureHeight':88,'sideFeetExclusive':94,'uiScale':1},'masters':list(masters.values()),'exports':exports,'measurements':measurements,'limitations':'15 static directional sets and 16 static side poses. Only Breton female has the pre-existing 3-phase walk. Repeated native SV cells are NOT full combat animations. Manual portrait anchors require visual owner review; source r03 has technical 2-source-pixel perimeter matte cleanup.'}
(R/'doc/arte/exportacoes-personagens-revisao-r02.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Packed16 identities without changing keys, rules or v01 assets;64 runtime exports +5 boards.')
