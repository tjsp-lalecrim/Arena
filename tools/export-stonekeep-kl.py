"""Pack only the two unapproved wall pilots into a separate native D sheet.
No changes to approved C sheet or its five masters. Python + Pillow.
"""
from pathlib import Path
from PIL import Image,ImageEnhance
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
c=json.loads((ROOT/'doc/mapas/STONEKEEP_KL_PILOTO.json').read_text(encoding='utf8'))
sheet=Image.new('RGBA',(384,768));meta=[]
for p in c['patches']:
    f=ROOT/c['masters']/(p['id']+'.png');raw=Image.open(f).convert('RGBA')
    # Square crop/downscale preserves the block proportions (no anisotropic
    # squeeze). New CASK has thinner courses than CASA, as in its reference.
    crop=(0,0,768,768)
    face=raw.crop(crop).resize((96,96),Image.Resampling.LANCZOS)
    for y in range(96):
        a,b=face.getpixel((0,y)),face.getpixel((95,y));v=tuple(round((a[i]+b[i])/2) for i in range(4))
        face.putpixel((0,y),v);face.putpixel((95,y),v)
    brightness=.68 if p['id']=='cask' else .43
    cap=ImageEnhance.Brightness(face.resize((96,48),Image.Resampling.LANCZOS)).enhance(brightness)
    x=p['offset']*48;sheet.alpha_composite(cap,(x,0));sheet.alpha_composite(face,(x,48))
    meta.append({'master':f.relative_to(ROOT).as_posix(),'size':list(raw.size),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'crop':list(crop),'face':[96,96],'cap':[96,48],'capBrightness':brightness})
dest=ROOT/('img/tilesets/'+c['sheet']+'.png');sheet.save(dest)
manifest={'version':c['version'],'approval':c.get('approval','pendente do responsável'),'tool':'image_gen built-in; packing/crop/downscale Pillow','masters':meta,'output':{'file':dest.relative_to(ROOT).as_posix(),'size':list(sheet.size),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()},'interpretation':['Plano do cap é adaptação técnica; CASK .68 preserva leitura acima do preto/vazio, CASL .43 mantém o contraste do conjunto aprovado.','Desgaste e tom mineral são interpretação; arquivos de consulta só serviram de referência, sem pixels originais no runtime.','Um único mestre por família; não reproduz todas as variantes SET nem amplia a aplicação.']}
(ROOT/'doc/arte/STONEKEEP_KL_V01_EXPORTS.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Exported',dest.name)
