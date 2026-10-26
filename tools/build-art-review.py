"""Pack AI review candidates without repainting art. Original references stay ignored."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib,json,runpy
R=Path(__file__).resolve().parents[1]
# Reuse only function definitions, avoiding the historical build's side effects.
source=(R/'tools/build-art-samples.py').read_text(encoding='utf-8').split("pilot=load(")[0]
ns={'__file__':str(R/'tools/build-art-samples.py')};exec(source,ns)
exports=[]
def save(im,path):
 p=R/path;p.parent.mkdir(parents=True,exist_ok=True);im.save(p)
 exports.append({'file':path,'size':list(im.size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
masters=R/'art/masters/revisao-r02'
save(Image.open(masters/'dungeon-identidade-r02.png').resize((576,480),Image.Resampling.LANCZOS),'img/pictures/arena_dungeon_estudo_r02.png')
save(Image.open(masters/'ria-sem-protagonista-r02.png').resize((768,512),Image.Resampling.LANCZOS),'img/pictures/arena_ria_narrativa_r02.png')
im=Image.open(masters/'rato-ameaca-r03.png').convert('RGBA');cuts=[]
for row in range(2):
 for col in range(2):
  cell=im.crop((col*768,row*512,(col+1)*768,(row+1)*512))
  cuts.append(ns['components'](cell)[0][1])
scale=min(88/max(c.width for c in cuts),56/max(c.height for c in cuts))
strip=Image.new('RGBA',(384,64));frames=[]
for i,c in enumerate(cuts):
 frame=ns['fit'](c,(96,64),scale,60);frames.append(frame);strip.alpha_composite(frame,(i*96,0))
 assert frame.getbbox()[0]>0 and frame.getbbox()[2]<96
save(strip,'img/pictures/arena_rato_bote_r03.png')
frames[0].save(R/'doc/arte/rato-bote-r03.gif',save_all=True,append_images=frames[1:],duration=[400,200,130,330],loop=0,disposal=2)
records=[]
for p in sorted(masters.glob('*.png')):
 records.append({'file':p.relative_to(R).as_posix(),'size':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
refs=[]
for p in sorted((R/'doc/prints').glob('*')):
 if p.name.startswith('imperial dungeons') or p.name in ['rat.png','ria silmane.jfif']:
  refs.append({'file':p.relative_to(R).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(R/'doc/arte/exportacoes-revisao-r02.json').write_text(json.dumps({'status':'em revisão estética, sem aprovação','masters':records,'exports':exports,'reference_inventory':refs,'packing':'LANCZOS; rato: componente alpha >=96 dilatado 1px, cores/alpha originais preservados; escala comum, base y60; sem redesenho'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Consultation comparisons contain original captures and MUST remain ignored.
for name,ref,out in [('dungeon','imperial dungeons 01.jfif','arena_dungeon_estudo_r02.png'),('rato','rat.png','arena_rato_bote_r03.png'),('ria','ria silmane.jfif','arena_ria_narrativa_r02.png')]:
 a=Image.open(R/'doc/prints'/ref).convert('RGB');b=Image.open(R/'img/pictures'/out).convert('RGBA')
 sheet=Image.new('RGB',(max(800,b.width+24),a.height+b.height+92),(35,35,42));d=ImageDraw.Draw(sheet)
 d.text((12,8),'Referencia original (captura; sem extrair HUD/logos)',fill='white');sheet.paste(a,(12,30))
 d.text((12,a.height+44),'Candidato IA - escala de exibicao 1:1 - NAO APROVADO',fill='white');sheet.paste(b,(12,a.height+68),b)
 sheet.save(R/f'tmp/original-review/comparacao-{name}-r02.png')
print('4 masters, 3 exports, 3 ignored comparison sheets; frame boxes:',[f.getbbox() for f in frames])
