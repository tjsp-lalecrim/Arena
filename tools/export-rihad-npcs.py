"""Crop/scale native generated masters; preserve alpha, anatomy and true authored step frames."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib
root = Path(__file__).resolve().parent.parent
out = root / 'doc/arte/rihad-npcs-v01'
specs = {
    'innkeeper': {'portrait': (0,0,850,887), 'poses': [(900,0,1335,443),(1335,0,1774,443),(900,443,1335,887),(1335,443,1774,887)]},
    'guard': {'portrait': (0,0,850,887), 'poses': [(900,0,1335,430),(1335,0,1774,430),(900,430,1335,887),(1335,430,1774,887)]},
    'civilian': {'portrait': (0,0,640,887), 'poses': [(640+i*378,y,640+(i+1)*378 if i<2 else 1774,b) for y,b in [(0,225),(225,443),(443,660),(660,887)] for i in range(3)]}
}
manifest = []
review = Image.new('RGBA', (960,420), '#262a2e')
draw = ImageDraw.Draw(review)
for n,(name,spec) in enumerate(specs.items()):
    im = Image.open(root / f'art/masters/rihad-npcs-v01/{name}.png').convert('RGBA')
    assert im.size == (1774,887) and im.getextrema()[3] == (0,255)
    def content(rect):
        frame=im.crop(rect)
        box=frame.getchannel('A').point(lambda a: 255 if a>16 else 0).getbbox()
        assert box, (name,rect)
        # Identify crop bounds only; do not replace or threshold generated alpha.
        return frame.crop((max(0,box[0]-2),max(0,box[1]-2),min(frame.width,box[2]+2),min(frame.height,box[3]+2)))
    p=content(spec['portrait']);p.thumbnail((140,140),Image.Resampling.LANCZOS)
    face=Image.new('RGBA',(144,144));face.alpha_composite(p,((144-p.width)//2,144-p.height))
    file='Arena_Rihad_'+name.capitalize()+'_V01'
    face_path=f'img/faces/{file}.png';sprite_path=f'img/characters/${file}.png'
    face.save(root/face_path)
    poses=[content(rect) for rect in spec['poses']]
    scale=min(56/max(p.height for p in poses),44/max(p.width for p in poses))
    sheet=Image.new('RGBA',(144,256));cells=[]
    for row in range(4):
        for col in range(3):
            index=row*3+col if name=='civilian' else row
            p=poses[index];size=(round(p.width*scale),round(p.height*scale));p=p.resize(size,Image.Resampling.LANCZOS)
            xy=(col*48+(48-p.width)//2,row*64+62-p.height)
            sheet.alpha_composite(p,xy);cells.append({'row':row,'col':col,'sourceRect':spec['poses'][index],'size':size,'xy':xy})
    sheet.save(root/sprite_path)
    if name=='civilian':
        assert len({hashlib.sha256(sheet.crop((c*48,r*64,(c+1)*48,(r+1)*64)).tobytes()).hexdigest()for r in range(4) for c in range(3)})==12
    review.alpha_composite(face,(n*320+8,22));review.alpha_composite(sheet,(n*320+160,22));draw.text((n*320+8,4),name,fill='white')
    manifest.append({'id':name,'master':f'art/masters/rihad-npcs-v01/{name}.png','portraitCrop':spec['portrait'],'nativeCell':[48,64],'footAnchor':62,'uniformScale':scale,'animation':'12 authored articulated walking frames' if name=='civilian' else '4 authored stationary directions, each repeated across native patterns; no walking cycle claimed','cells':cells,'exports':[{'path':f,'sha256':hashlib.sha256((root/f).read_bytes()).hexdigest(),'size':list(Image.open(root/f).size)}for f in [f'art/masters/rihad-npcs-v01/{name}.png',face_path,sprite_path]]})
(out/'exports.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
review.save(out/'review.png')
print('Three portraits, three four-direction sheets; civilian12 true frames. Generated alpha retained, no mirroring or pose translation synthesis.')
