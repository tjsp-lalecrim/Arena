"""Pack generated components once; fixed anchors, no frame-by-frame recropping."""
from pathlib import Path
from PIL import Image, ImageOps
import json, math, hashlib
from battle_components import cutouts
R=Path(__file__).resolve().parents[1]
M=R/'art/masters/m02-dungeon-objects-v01'
O=R/'doc/arte/m02-dungeon-objects-v01'
records={}
def parts(name,cols,rows):
    im=Image.open(M/(name+'-source.png')).convert('RGBA');out=[];boxes=[]
    for cut,box,rect in cutouts(im,cols*rows,cols):
        assert min(rect[:2])>0 and rect[2]<im.width and rect[3]<im.height,(name,rect)
        out.append(cut);boxes.append({'source':rect})
    records[name]={'source':str((M/(name+'-source.png')).relative_to(R)).replace('\\','/'),'sha256':hashlib.sha256((M/(name+'-source.png')).read_bytes()).hexdigest(),'parts':boxes}
    return out
def fit(im,size):
    im=ImageOps.contain(im,size,Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(im,((size[0]-im.width)//2,(size[1]-im.height)//2));return out
def save(im,path):
    im.save(R/path);records[path]={'sha256':hashlib.sha256((R/path).read_bytes()).hexdigest(),'size':im.size}
def doors(source,name,raising=False):
    c=parts(source,2,2);front=[p.resize((136,96),Image.Resampling.LANCZOS) for p in c[:2]]
    sides=[fit(p.rotate(90,expand=True) if p.width>p.height else p,(8,136)) for p in c[2:]]
    sheet=Image.new('RGBA',(432,576))
    for row in range(4):
        for stage,theta in enumerate([0,math.pi/3,math.pi/2]):
            im=Image.new('RGBA',(144,144))
            if row in [0,3]:
                panel=front[0 if row==0 else 1]
                if raising:
                    height=[96,48,0][stage]
                    if height:im.alpha_composite(panel.crop((0,96-height,136,96)),(4,48))
                    im.paste(panel.crop((0,0,4,96)),(4,48));im.paste(panel.crop((132,0,136,96)),(136,48))
                else:
                    width=max(6,round(68*math.cos(theta)))
                    left=panel.crop((0,0,68,96));right=panel.crop((68,0,136,96))
                    im.alpha_composite(left.resize((width,96),Image.Resampling.LANCZOS),(4,48));im.alpha_composite(right.resize((width,96),Image.Resampling.LANCZOS),(140-width,48))
                    im.paste(left.crop((0,0,6,96)),(4,48));im.paste(right.crop((62,0,68,96)),(134,48))
            else:
                edge=sides[0 if row==2 else 1]
                if raising:
                    ghost=edge.copy();ghost.putalpha(ghost.getchannel('A').point(lambda a:round(a*[1,.5,0][stage])));im.alpha_composite(ghost,(68,4))
                else:
                    top=edge.crop((0,0,8,68));bottom=edge.crop((0,68,8,136))
                    for part,hy,sign in [(top,4,1),(bottom,140,-1)]:
                        layer=Image.new('RGBA',(288,288));layer.alpha_composite(part,(140,144 if hy==4 else 76));layer=layer.rotate(math.degrees(theta)*(1 if row==1 else -1)*sign,Image.Resampling.BICUBIC,center=(144,144));im.alpha_composite(layer.crop((72,144-hy,216,288-hy)))
                for hy in [4,136]:im.paste(edge.crop((0,0,8,8)),(68,hy))
            sheet.alpha_composite(im,(144*stage,144*row))
    save(sheet,'img/characters/'+name+'.png')
doors('grate','!$Arena_Stonekeep_Grate_V01',True)
doors('grate','!$Arena_Mine_Grate_V01')
doors('steel','!$Arena_Mine_SteelDoor_V01')
p=parts('props',4,2)
shapes=['ns','ew','nw','ne','sw','se'];curves=parts('curves',2,2);rails=[fit(v,(144,144)) for v in p[:2]+curves]
# Normalize only the edge connection bands to the same generated straight rails.
faces={'ns':'NS','ew':'EW','nw':'NW','ne':'NE','sw':'SW','se':'SE'}
for shape,rail in zip(shapes,rails):
    for side in faces[shape]:
        if side=='N':rail.paste(rails[0].crop((0,0,144,6)),(0,0))
        if side=='S':rail.paste(rails[0].crop((0,138,144,144)),(0,138))
        if side=='W':rail.paste(rails[1].crop((0,0,6,144)),(0,0))
        if side=='E':rail.paste(rails[1].crop((138,0,144,144)),(138,0))
sheet=Image.new('RGBA',(384,768));tiles={}
for k,(shape,rail) in enumerate(zip(shapes,rails)):
    tiles[shape]=[]
    for y in range(3):
        for x in range(3):
            index=k*9+y*3+x;tiles[shape].append(512+index);sheet.alpha_composite(rail.crop((x*48,y*48,(x+1)*48,(y+1)*48)),((index%8)*48,(index//8)*48))
save(sheet,'img/tilesets/Arena_Mine_Objects_V01_D.png')
brace=Image.new('RGBA',(432,576));front=p[6].resize((136,96),Image.Resampling.LANCZOS);top=fit(p[7].rotate(90,expand=True) if p[7].width>p[7].height else p[7],(12,136))
for row in range(4):
    for col in range(3):
        im=Image.new('RGBA',(144,144));im.alpha_composite(front,(4,48)) if row in [0,3] else im.alpha_composite(top,(66,4));brace.alpha_composite(im,(col*144,row*144))
save(brace,'img/characters/!$Arena_Mine_Brace_V01.png')
records['tiles']=tiles
checks={}
for name in ['Stonekeep_Grate','Mine_Grate','Mine_SteelDoor']:
    image=Image.open(R/('img/characters/!$Arena_'+name+'_V01.png')).convert('RGBA')
    for row in range(4):
        frames=[image.crop((k*144,row*144,(k+1)*144,(row+1)*144)) for k in range(3)]
        assert len({f.tobytes() for f in frames})==3
        centre=(16,48,128,128) if row in [0,3] else (60,16,84,128)
        assert frames[2].getchannel('A').crop(centre).getbbox() is None
        pivot=(4,48,8 if name=='Stonekeep_Grate' else 10,144) if row in [0,3] else (68,4,76,12)
        assert len({f.crop(pivot).tobytes() for f in frames})==1
    checks[name]={'frames':12,'uniqueStages':True,'openCentreTransparent':True,'fixedGuidesOrHinges':True}
records['anchorChecks']=checks
O.mkdir(parents=True,exist_ok=True);(O/'exports.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf8')
print('Packed 3 door sheets, static brace and54 transparent track tiles, native48px grid')
