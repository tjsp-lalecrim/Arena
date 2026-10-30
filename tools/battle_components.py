"""Isolate disconnected AI figure cutouts, preserving pixels; no painted poses."""
import numpy as np
from PIL import Image
def cutouts(image,count,columns):
 a=np.asarray(image.getchannel('A'));mask=a>16;parent=[];runs=[];previous=[]
 def root(i):
  while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
  return i
 for y,row in enumerate(mask):
  edges=np.flatnonzero(np.diff(np.pad(row.astype(np.int8),(1,1))));current=[]
  for start,end in zip(edges[::2],edges[1::2]):
   label=len(parent);parent.append(label)
   for ps,pe,pl in previous:
    if pe<start:continue
    if ps>end:break
    parent[root(label)]=root(pl)
   runs.append((y,int(start),int(end),label));current.append((int(start),int(end),label))
  previous=current
 groups={}
 for y,x,e,label in runs:groups.setdefault(root(label),[]).append((y,x,e))
 groups=[g for g in groups.values() if sum(e-x for _,x,e in g)>4]
 groups.sort(key=lambda g:sum(e-x for _,x,e in g),reverse=True)
 if len(groups)<count:raise ValueError(('Joined figures; cannot isolate without repainting',len(groups),count))
 def center(g):
  n=sum(e-x for _,x,e in g);return(sum((x+e)/2*(e-x) for _,x,e in g)/n,sum(y*(e-x) for y,x,e in g)/n)
 main=groups[:count];centers=[center(g) for g in main]
 for g in groups[count:]:
  cx,cy=center(g);i=min(range(count),key=lambda i:(cx-centers[i][0])**2+(cy-centers[i][1])**2);main[i]+=g
 main.sort(key=lambda g:center(g)[1]);ordered=[]
 for start in range(0,count,columns):ordered+=sorted(main[start:start+columns],key=lambda g:center(g)[0])
 result=[]
 rgba=np.asarray(image)
 for g in ordered:
  x=min(x for _,x,_ in g);right=max(e for _,_,e in g);y=min(y for y,_,_ in g);bottom=max(y for y,_,_ in g)+1
  data=np.zeros((bottom-y,right-x,4),dtype=np.uint8)
  for yy,xx,e in g:data[yy-y,xx-x:e-x]=rgba[yy,xx:e]
  cut=Image.fromarray(data,'RGBA');result.append((cut,cut.getbbox(),[x,y,right,bottom]))
 return result
