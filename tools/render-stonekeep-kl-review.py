"""Review comparison. Original textures go ONLY into ignored consultation.
Runtime before/after boards are versionable; no review guide enters the tiles.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'doc/evidencias/m02-04-walls-v01';tmp=ROOT/'tmp/stonekeep-kl-v01';tmp.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
c=json.loads((ROOT/'doc/mapas/STONEKEEP_KL_PILOTO.json').read_text(encoding='utf8'))
for p in c['patches']:
    board=Image.new('RGB',(1632,658),'#10171a');d=ImageDraw.Draw(board)
    for i,prefix in enumerate(['antes','depois']):
        d.text((i*816+10,5),prefix.upper()+' — '+p['id'].upper()+' / motor816x624, tiles48px',font=font,fill='#ead9b5')
        board.paste(Image.open(out/(prefix+'-'+p['id']+'.png')).convert('RGB'),(i*816,34))
    board.save(out/('comparacao-'+p['id']+'.png'))

sheet=Image.open(ROOT/('img/tilesets/'+c['sheet']+'.png')).convert('RGBA')
refs=Image.new('RGB',(1040,620),'#17191d');d=ImageDraw.Draw(refs)
for row,(p,files) in enumerate(zip(c['patches'],[['texture-55-CASK.SET.png','texture-56-CASK.SET.png'],['texture-58-CASL.SET.png','texture-59-CASL.SET.png']])):
    y=row*310;d.text((12,y+6),p['id'].upper()+' — original64x64 ampliado (consulta local, nao distribuivel)',font=font,fill='#ead9b5')
    for col,f in enumerate(files):
        im=Image.open(ROOT/'tmp/stonekeep-review'/f).convert('RGB').resize((256,256),Image.Resampling.NEAREST)
        refs.paste(im,(12+col*270,y+38))
    # Display actual exported 96x96 two-cell-high face, enlarged only for review.
    x=p['offset']*48;face=sheet.crop((x,48,x+96,144)).resize((256,256),Image.Resampling.NEAREST)
    refs.paste(face,(570,y+38));d.text((840,y+70),'IA / exportacao',font=font,fill='#ead9b5');d.text((840,y+102),'face96x96',font=font,fill='#ead9b5')
refs.save(tmp/'comparacao-fontes.png')
print('Before/after boards saved; original-reference board stays ignored in tmp.')
