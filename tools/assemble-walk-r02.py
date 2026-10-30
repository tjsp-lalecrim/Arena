"""Technical assembly of AI-painted genuine walking poses; no pose synthesis.
Detect gutters, retain one uniform scale per sheet, align feet/head pivot.
Native MV: 3 columns x down/left/right/up; cells48x64, sole baseline62.
"""
import sys,json,hashlib,argparse
from pathlib import Path
import numpy as np
from PIL import Image
args=argparse.ArgumentParser();args.add_argument('master');args.add_argument('target');args.add_argument('--cell',nargs=2,type=int,default=[48,64]);args.add_argument('--height',type=int,default=56);args.add_argument('--width',type=int,default=44);args.add_argument('--opposed',action='store_true');args.add_argument('--pivot',choices=['head','mass'],default='head');args.add_argument('--reflect',nargs='*',type=int,default=[]);options=args.parse_args()
master=Path(options.master);target=Path(options.target);im=Image.open(master).convert('RGBA');a=np.array(im.getchannel('A'))
def cuts(axis,n):
 counts=(a>128).sum(axis=axis);length=len(counts);out=[0]
 for k in range(1,n):
  center=k*length/n;lo=int(center-length/n*.15);hi=int(center+length/n*.15)
  candidates=np.flatnonzero(counts[lo:hi]==counts[lo:hi].min())+lo
  out.append(int(min(candidates,key=lambda v:abs(v-center))))
 return out+[length]
xs=cuts(0,3);ys=cuts(1,4);frames=[]
for row in range(4):
 for col in range(3):
  frame=im.crop((xs[col],ys[row],xs[col+1],ys[row+1]));mask=frame.getchannel('A').point(lambda v:255 if v>32 else 0);box=mask.getbbox()
  if not box:raise ValueError('Empty pose')
  frames.append((frame,box))
cw,ch=options.cell;baseline=ch-2
scale=min(options.height/max(box[3]-box[1] for _,box in frames),options.width/max(box[2]-box[0] for _,box in frames));sheet=Image.new('RGBA',(cw*3,ch*4))
for i,(frame,box) in enumerate(frames):
 # Head midpoint is a stable body pivot, unaffected by alternating arms/tail.
 head=frame.getchannel('A').crop((0,box[1],frame.width,box[1]+max(1,int((box[3]-box[1])*.13)))).point(lambda v:255 if v>64 else 0).getbbox()
 pivot=(head[0]+head[2])/2 if head else (box[0]+box[2])/2
 if options.pivot=='mass':
  weights=np.array(frame.getchannel('A'),dtype=float).sum(axis=0);pivot=float((weights*np.arange(frame.width)).sum()/weights.sum())
 crop=frame.crop(box);size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)));crop=crop.resize(size,Image.Resampling.LANCZOS)
 x=i%3*cw+round(cw/2+(box[0]-pivot)*scale);y=i//3*ch+baseline-size[1]
 if x<i%3*cw or x+size[0]>(i%3+1)*cw:raise ValueError('Pose exceeds native cell; inspect before integration')
 sheet.alpha_composite(crop,(x,y))
for i in options.reflect:
 x=i%3*cw;y=i//3*ch;sheet.paste(sheet.crop((x,y,x+cw,y+ch)).transpose(Image.Transpose.FLIP_LEFT_RIGHT),(x,y))
if options.opposed:
 # Symmetric front/back walking stance, reflected as a technical animation phase.
 # This is not a repair for anatomical torsion; never applies to portraits/battle.
 for row in [0,3]:sheet.paste(sheet.crop((0,row*ch,cw,(row+1)*ch)).transpose(Image.Transpose.FLIP_LEFT_RIGHT),(2*cw,row*ch))
target.parent.mkdir(parents=True,exist_ok=True);sheet.save(target)
print(json.dumps(dict(master=str(master),target=str(target),gutters=[xs,ys],scale=scale,cell=[cw,ch],baseline=baseline,opposed=options.opposed,reflect=options.reflect,sha256=hashlib.sha256(target.read_bytes()).hexdigest())))
