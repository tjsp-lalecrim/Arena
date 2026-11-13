"""One vector adaptation of the original drawn letters, never font substitution/AI text.
Original reference is read-only; runtime exports use the self-contained SVG master.
"""
from pathlib import Path
from PIL import Image
import hashlib,math,struct,json
R=Path(__file__).resolve().parents[1]
source=Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\TITLE.IMG')
b=source.read_bytes();assert hashlib.sha256(b).hexdigest()=='1058d2a9fd6e9202c3dd2f9526a7a282ed4e78b40e001f207424bf6bf7e50f25'
_,_,w,h,flags,n=struct.unpack_from('<6H',b);assert (w,h,flags)==(320,200,260)
stream=b[12:12+n];history=bytearray(b' '*4096);hp=pos=0;pixels=bytearray()
while pos<len(stream):
 mask=stream[pos];pos+=1
 for bit in range(8):
  if pos>=len(stream):break
  if mask&(1<<bit):values=[stream[pos]];pos+=1
  else:
   a,c=stream[pos:pos+2];pos+=2;start=(((c&240)<<4)|a)+18;values=[]
   # Backreferences can overlap the destination history.
   for k in range((c&15)+3):
    v=history[(start+k)&4095];pixels.append(v);history[hp&4095]=v;hp+=1
   continue
  for v in values:pixels.append(v);history[hp&4095]=v;hp+=1
assert len(pixels)==w*h
im=Image.frombytes('P',(w,h),bytes(pixels));im.putpalette(bytes(v*255//63 for v in b[12+n:]));im=im.convert('RGB')
def simplify(points,epsilon=.85):
 if len(points)<3:return points
 a,z=points[0],points[-1];dx,dy=z[0]-a[0],z[1]-a[1];den=math.hypot(dx,dy)
 distances=[abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/den if den else math.dist(p,a) for p in points[1:-1]]
 if not distances or max(distances)<=epsilon:return [a,z]
 k=distances.index(max(distances))+1;return simplify(points[:k+1],epsilon)[:-1]+simplify(points[k:],epsilon)
def contour(box):
 x0,y0,x1,y1=box;body=set()
 for y in range(y0,y1):
  for x in range(x0,x1):
   r,g,blue=im.getpixel((x,y))
   if r>150 and g>80 and blue<150 and r>1.5*blue and g>1.15*blue:body.add((x-x0,y-y0))
 # Remove isolated palette/neighbor-line specks; keep actual glyph bodies only.
 keep=set();seen=set()
 for seed in sorted(body):
  if seed in seen:continue
  q=[seed];seen.add(seed)
  for x,y in q:
   for dx in (-1,0,1):
    for dy in (-1,0,1):
     p=(x+dx,y+dy)
     if p in body and p not in seen:seen.add(p);q.append(p)
  if len(q)>=12:keep.update(q)
 edges=set()
 for x,y in keep:
  for neighbor,a,z in [((x,y-1),(x,y),(x+1,y)),((x+1,y),(x+1,y),(x+1,y+1)),((x,y+1),(x+1,y+1),(x,y+1)),((x-1,y),(x,y+1),(x,y))]:
   if neighbor not in keep:edges.add((a,z))
 loops=[]
 while edges:
  a,z=min(edges);edges.remove((a,z));loop=[a,z]
  while loop[-1]!=a:
   candidates=sorted(e for e in edges if e[0]==loop[-1])
   if not candidates:raise ValueError('Open glyph contour')
   # Consistent clockwise priority at diagonal touching corners.
   prev=loop[-2];cur=loop[-1];vx,vy=cur[0]-prev[0],cur[1]-prev[1]
   e=max(candidates,key=lambda e:vx*(e[1][1]-cur[1])-vy*(e[1][0]-cur[0]));edges.remove(e);loop.append(e[1])
  signed_area=sum(loop[i][0]*loop[i+1][1]-loop[i+1][0]*loop[i][1] for i in range(len(loop)-1))/2
  # Keep small letter counters; remove detached foreground bevel fragments.
  if abs(signed_area)<1.5 or 0<signed_area<8:continue
  # Split a closed ring at its farthest point before polygon simplification.
  k=max(range(1,len(loop)-1),key=lambda k:math.dist(loop[0],loop[k]));p=simplify(loop[:k+1])[:-1]+simplify(loop[k:])[:-1]
  if len(p)>=3:loops.append(p)
 return loops
def curved_path(points):
 # Bounded quadratic corners remove raster steps without losing long serif tips.
 inset=[]
 for i,p in enumerate(points):
  before,after=points[i-1],points[(i+1)%len(points)];radius=min(.42,math.dist(before,p)/3,math.dist(after,p)/3)
  def step(q):
   length=math.dist(q,p);return(p[0]+(q[0]-p[0])*radius/length,p[1]+(q[1]-p[1])*radius/length)
  inset.append((step(before),p,step(after)))
 fmt=lambda p:f'{p[0]:.3f},{p[1]:.3f}'
 d='M'+fmt(inset[0][0])
 for a,p,z in inset:d+=' L'+fmt(a)+' Q'+fmt(p)+' '+fmt(z)
 return d+' Z'
lines=[('The Elder',(81,16,240,52),102.5,42),('Scrolls',(98,52,208,88),225,236),('Arena',(207,104,264,126),357.5,444)]
parts=[];manifest=[]
for label,box,x,y in lines:
 loops=contour(box);d=' '.join(curved_path(p) for p in loops)
 parts.append(f'<g aria-label="{label}" transform="translate({x},{y}) scale(5)"><path d="{d}"/></g>')
 manifest.append({'label':label,'referenceBox':box,'translation':[x,y],'scale':5,'contours':len(loops)})
svg='''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="620" viewBox="0 0 1000 620" role="img" aria-label="The Elder Scrolls: Arena">
<title>The Elder Scrolls: Arena</title>
<desc>One vector adaptation of the original TITLE.IMG drawn lettering. No embedded bitmap or font dependency.</desc>
<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff1bd"/><stop offset=".36" stop-color="#e9c982"/><stop offset=".68" stop-color="#c69b4b"/><stop offset="1" stop-color="#8f602c"/></linearGradient>
<filter id="shadow" x="-15%" y="-25%" width="130%" height="155%"><feDropShadow dx="0" dy=".9" stdDeviation=".5" flood-color="#080907" flood-opacity=".9"/></filter></defs>
<g fill="url(#gold)" stroke="#332015" stroke-width="1.25" stroke-linejoin="round" paint-order="stroke" fill-rule="evenodd" filter="url(#shadow)">'''+''.join(parts)+'</g></svg>\n'
dest=R/'art/masters/ref16-logo-v01/title-logo-v01.svg';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(svg,encoding='utf8')
(dest.parent/'lettering.json').write_text(json.dumps({'text':'The Elder Scrolls: Arena','source':'TITLE.IMG','sourceSHA256':hashlib.sha256(b).hexdigest(),'canvas':[1000,620],'lines':manifest,'method':'Original drawn outlines, palette-isolated, vector contours simplified at0.85source-pixel, bounded quadratic corner refinement0.42pixel, new gold/bronze gradients/outline; no AI lettering, no font or embedded raster.','adaptation':'Three centred lines, same relative glyph scale. Omit Chapter One: The (intro caption), copyright and frame; no added subtitle/symbol.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('SVG master, one proposal; line labels:',[v['label'] for v in manifest])
