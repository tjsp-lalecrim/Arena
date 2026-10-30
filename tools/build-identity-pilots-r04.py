"""Review-only technical packing of transparent AI pilots, never installs assets.

Alpha is real (RGB under alpha0 looked like glow in the raw preview).
Irregular cells, a clipped Khajiit boot and incomplete cycles prevent production use.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[1]
ns={'__file__':str(R/'tools/build-art-samples.py')}
exec((R/'tools/build-art-samples.py').read_text(encoding='utf-8').split('pilot=load(')[0],ns)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)
exports=[];masters=[];measurements=[]
def rec(p):return {'file':p.relative_to(R).as_posix(),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def save(im,rel):
 p=R/rel;p.parent.mkdir(parents=True,exist_ok=True);im.save(p);exports.append(rec(p))
config=json.loads((R/'data/ArenaCharacterVisuals.json').read_text(encoding='utf-8'))
# Estimated landmarks in the SOURCE card: eye x/y, crown y, lower jaw y.
# Only review framing, no anatomical/production certification.
landmarks={'argonian':[396,350,205,500],'khajiit':[405,350,170,520]}
tiles=[]
for race in ['argonian','khajiit']:
 for version in ['a','b']:masters.append(rec(R/f'art/masters/identidade-r04/{race}-male-piloto-r04{version}.png'))
 master=Image.open(R/f'art/masters/identidade-r04/{race}-male-piloto-r04b.png').convert('RGBA')
 # Separate already-transparent disconnected silhouettes, preserving source alpha.
 parts=ns['components'](master,3);assert len(parts)==3
 box,cut=parts[0];ex,ey,top,jaw=landmarks[race]
 scale=76/(jaw-top);resized=cut.resize((round(cut.width*scale),round(cut.height*scale)),Image.Resampling.LANCZOS)
 preview=Image.new('RGBA',(144,144));preview.alpha_composite(resized,(round(88-(ex-box[0])*scale),round(52-(ey-box[1])*scale)))
 save(preview,f'art/candidates/identidade-r04/{race}-male-portrait-preview144.png')
 mapFrame=ns['fit'](parts[1][1],(48,64),min(56/parts[1][1].height,42/parts[1][1].width),62)
 side=ns['fit'](parts[2][1],(96,96),min(88/parts[2][1].height,90/parts[2][1].width),94)
 save(mapFrame,f'art/candidates/identidade-r04/{race}-male-map-front-study48x64.png')
 save(side,f'art/candidates/identidade-r04/{race}-male-side-study96.png')
 measurements.append({'race':race,'sourceComponentBoxes':[p[0] for p in parts],'sourceCombatTouchesRightEdge':parts[2][0][2]>=master.width,'portraitBox':preview.getbbox(),'mapBox':mapFrame.getbbox(),'sideBox':side.getbbox(),'backgroundAlphaSamples':[{ 'xy':xy,'alpha':master.getpixel(xy)[3]} for xy in [(20,20),(540,80),(500,950),(1030,50)]]})
 old=Image.open(R/'img/faces'/(config['visuals'][race+'.male.base']['face']+'.png')).convert('RGBA').crop((0,0,144,144))
 tile=Image.new('RGBA',(1060,560),(27,29,33,255));d=ImageDraw.Draw(tile)
 d.text((8,6),('Argoniano' if race=='argonian' else 'Khajiit')+' / Masculino — piloto; revisão estética/técnica pendente',font=font,fill='white')
 for i,im in enumerate([old,preview]):
  x=8+i*360;d.text((x,34),'ANTES pose-r03' if i==0 else 'CANDIDATO identidade-r04b',font=font,fill='white');d.text((x,57),'144px',font=small,fill='#c2bba9')
  tile.alpha_composite(im,(x,80));d.text((x,228),'Ampliação2x',font=small,fill='white');tile.alpha_composite(im.resize((288,288),Image.Resampling.LANCZOS),(x,250));d.line((x,132,x+143,132),fill='#6a7b8b')
 card=master.copy();card.thumbnail((320,220));tile.alpha_composite(card,(735,80));d.text((735,310),'Estudos; não são folhas completas.',font=small,fill='white')
 tile.alpha_composite(mapFrame,(752,360));tile.alpha_composite(side,(860,328));d.line((735,422,1010,422),fill='#6a7b8b');d.text((735,440),'48x64 /96px; mesma linha dos pés.',font=small,fill='white')
 d.text((735,465),'Alfa real: fundo externo transparente.',font=small,fill='#adc49c')
 if race=='khajiit':d.text((735,489),'Pé direito alcança borda da fonte.',font=small,fill='#e5ba75')
 tiles.append(tile)
board=Image.new('RGBA',(1060,1120),(27,29,33,255))
for i,t in enumerate(tiles):board.alpha_composite(t,(0,i*560))
save(board,'doc/arte/identidade-r04-antes-depois.png')
(R/'doc/arte/exportacoes-identidade-r04.json').write_text(json.dumps({'baselineCommit':'1399af8','status':'review-only pilots; NO runtime integration; alpha verified; irregular source cells and clipped Khajiit combat boot','masters':masters,'exports':exports,'manualSourceLandmarks':landmarks,'measurements':measurements,'limitations':'2 male pilots only. All females/other races/runtime visuals unchanged. Source already transparent; no code background removal. Single front/side study frames, not complete sheets/animations. Khajiit combat boot touches source edge. Owner review required.','diagnosticCorrection':'Initial raw preview misread RGB under alpha0 as background haze. Opaque checkerboard compositing and pixel samples disproved this; source alpha is valid. Historical repair prompts retained exactly as sent.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('2 portraits +4 single-frame studies +1 comparative board; real alpha verified; Khajiit source boot crop/full cycles/aesthetic approval pending; active visuals untouched.')
