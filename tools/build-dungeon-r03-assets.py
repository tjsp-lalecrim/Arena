"""R03 technical packing: AI components, fixed hinges, no frame-by-frame recrop."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import math,json,hashlib
R=Path(__file__).resolve().parents[1];master=Image.open(R/'art/m01-14/componentes-ortogonais-r03-master.png').convert('RGBA')
assert master.size==(1536,1024)
def bbox(im):return im.getchannel('A').point(lambda v:255 if v>64 else 0).getbbox()
def fit(im,size):
 im=im.copy();im.thumbnail(size,Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(im,((size[0]-im.width)//2,size[1]-im.height));return out
def component(box,size):
 im=master.crop(box);return fit(im.crop(bbox(im)),size)
# Fixed orthographic face windows, one crop per component BEFORE all frames.
# Wood/iron from the tall master is shortened to a wall face without stretching.
front=[master.crop((78,120,496,415)).resize((136,96),Image.Resampling.LANCZOS),master.crop((617,120,1035,415)).resize((136,96),Image.Resampling.LANCZOS)]
sides=[component((1100,0,1536,500),(24,136)).crop((8,0,16,136)),component((0,500,500,1024),(24,136)).crop((8,0,16,136))]
sheet=Image.new('RGBA',(432,576));frames=[]
for row in range(4):
 for stage,theta in enumerate([0,math.pi/3,math.pi/2]):
  im=Image.new('RGBA',(144,144))
  if row in [0,3]:
   closed=front[0 if row==0 else 1];width=max(6,round(68*math.cos(theta)))
   left=closed.crop((0,0,68,96));right=closed.crop((68,0,136,96))
   im.alpha_composite(left.resize((width,96),Image.Resampling.LANCZOS),(4,48));im.alpha_composite(right.resize((width,96),Image.Resampling.LANCZOS),(140-width,48))
   # Hinges are literally identical pixels at the same location in every frame.
   im.paste(left.crop((0,0,6,96)),(4,48));im.paste(right.crop((62,0,68,96)),(134,48))
  else:
   source=sides[0 if row==2 else 1];top=source.crop((0,0,8,68));bottom=source.crop((0,68,8,136))
   # Rotate the genuinely overhead component about endpoints, never a frontal image.
   for part,hy,sign in [(top,4,1),(bottom,140,-1)]:
    layer=Image.new('RGBA',(288,288));layer.alpha_composite(part,(140,144 if hy==4 else 76));angle=math.degrees(theta)*(1 if row==1 else -1)*sign
    layer=layer.rotate(angle,Image.Resampling.BICUBIC,center=(144,144));im.alpha_composite(layer.crop((72,144-hy,216,288-hy)),(0,0))
   # Fixed metal hinge pins from the original texture; no masonry or floor.
   for hy in [4,136]:im.paste(source.crop((0,0,8,8)),(68,hy))
  sheet.alpha_composite(im,(stage*144,row*144));frames.append(im)
sheet.save(R/'img/characters/!$Arena_Doors_M14_R03.png')
platform=component((500,500,1100,1024),(140,140));ground=Image.new('RGBA',(144,144));ground.alpha_composite(platform,(2,2));ground.save(R/'img/pictures/arena_platform_r03.png')
chains=component((1100,500,1536,1024),(72,92));chainSheet=Image.new('RGBA',(288,384))
for y in range(4):
 for x in range(3):chainSheet.alpha_composite(chains,(x*96+12,y*96+4))
chainSheet.save(R/'img/characters/!$Arena_Chains_M14_R03.png')
# Preserve the approved treasure identity. A single source scale, consistent44px
# visible width/height maximum, small2px padding; no floor and no distortion.
old=Image.open(R/'art/m01-14/tesouros-compactos-r03-master.png').convert('RGBA');treasure=Image.new('RGBA',(144,192));bounds=[]
for n in range(3):
 im=old.crop((round(n*old.width/3),0,round((n+1)*old.width/3),old.height));im=im.crop(bbox(im));im=fit(im,(44,44));cell=Image.new('RGBA',(48,48));cell.alpha_composite(im,(2,2));bounds.append(bbox(cell))
 for row in range(4):treasure.alpha_composite(cell,(n*48,row*48))
treasure.save(R/'img/characters/!$Arena_Treasure_M14_R03.png')
out=R/'doc/evidencias/m01-14/r03';out.mkdir(parents=True,exist_ok=True);board=Image.new('RGBA',(600,690),'#17191d');d=ImageDraw.Draw(board);font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
for row,name in enumerate(['Sul/frente','Oeste — topo','Leste — topo','Norte/verso']):
 d.text((4,row*154+4),name,font=font,fill='white')
 for frame in range(3):board.alpha_composite(frames[row*3+frame],(160+frame*144,row*154));d.line((160,row*154+144,591,row*154+144),fill='#777568')
for n in range(3):board.alpha_composite(treasure.crop((n*48,0,(n+1)*48,48)),(200+n*80,632))
board.convert('RGB').save(out/'componentes-escala-real.png')
print('R03 fixed144x144 frames; frontface96px, overhead depth136px; treasure alpha',bounds)
