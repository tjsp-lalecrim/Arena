"""Deterministic crop/packing of AI master, never paints replacement artwork."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,hashlib
R=Path(__file__).resolve().parents[1]
master=Image.open(R/'art/m01-14/portas-tesouros-r02-master.png').convert('RGBA')
w,h=master.size
# Actual returned master is1254px square; AI did not honor uniform row spacing.
# Inspect/crop the actual row supports rather than slicing a requested grid blindly.
assert (w,h)==(1254,1254)
rows=[(20,210),(214,402),(405,608),(610,820),(840,1045),(1090,1200)]
def panel(c,r):return master.crop((round(c*w/3),rows[r][0],round((c+1)*w/3),rows[r][1]))
def bounds(im):return im.getchannel('A').point(lambda p:255 if p>64 else 0).getbbox()
def fit(im,size):
 im=im.copy();im.thumbnail(size,Image.Resampling.LANCZOS);out=Image.new('RGBA',size);out.alpha_composite(im,((size[0]-im.width)//2,size[1]-im.height));return out
doors=Image.new('RGBA',(432,384))
# Native direction rows2,4,6,8: south,west,east,north; shared source cell
# dimensions keep framing, foot pivots and jambs unchanged between frames.
for row,source in enumerate([0,3,2,1]):
 cells=[panel(frame,source) for frame in range(3)];boxes=[bounds(im) for im in cells];boxes=[b for b in boxes if b]
 box=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
 for frame in range(3):doors.alpha_composite(fit(cells[frame].crop(box),(144,96)),(frame*144,row*96))
doors.save(R/'img/characters/!$Arena_Doors_M14_R02.png')
for name,source,size in [('Treasure',4,(48,48)),('Ripple',5,(96,32))]:
 sheet=Image.new('RGBA',(size[0]*3,size[1]*4))
 for f in range(3):
  im=panel(f,source);bbox=bounds(im)
  # Treasure source cells differ in content, not fixed support rectangle.
  if name=='Treasure' and bbox:im=im.crop(bbox)
  im=fit(im,(44,36) if name=='Treasure' else size)
  for row in range(4):sheet.alpha_composite(im,(f*size[0]+(size[0]-im.width)//2,row*size[1]+size[1]-im.height))
 sheet.save(R/('img/characters/!$Arena_'+name+'_M14_R02.png'))
print('Packed doors432x384 frames144x96; treasure144x192 cells48; ripple288x128 cells96x32')
objects=Image.open(R/'art/m01-14/objetos-direcionais-r02-master.png').convert('RGBA');ow,oh=objects.size
chains=Image.new('RGBA',(432,384))
for row,(c,r) in enumerate([(0,0),(1,1),(0,1),(1,0)]):
 im=objects.crop((c*ow//2,r*oh//2,(c+1)*ow//2,(r+1)*oh//2))
 cutoff={(0,0):450,(1,0):479,(0,1):500,(1,1):500}[(c,r)]
 im=im.crop((0,0,im.width,cutoff));box=bounds(im);im=fit(im.crop(box),(144,96))
 for f in range(3):chains.alpha_composite(im,(f*144,row*96)) # static, no step animation
chains.save(R/'img/characters/!$Arena_Chains_M14_R02.png')
key=objects.crop((round(ow*.19),round(oh*.37),round(ow*.31),round(oh*.43)))
key=fit(key.crop(key.getbbox()),(36,24));keys=Image.new('RGBA',(144,192))
for y in range(4):
 for x in range(3):keys.alpha_composite(key,(x*48+6,y*48+24))
keys.save(R/'img/characters/!$Arena_Key_M14_R02.png')
