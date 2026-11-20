"""Native A1 kind4: three authored phases, spatial periodicity and crust banks."""
from pathlib import Path
from PIL import Image
import json, hashlib
R=Path(__file__).resolve().parents[1];source=R/'art/masters/fang-lava-v01/surface-source.png'
im=Image.open(source).convert('RGBA');a1=Image.open(R/'img/tilesets/Arena_Water_M14_R02_A1.png').convert('RGBA');frames=[]
def periodic(p):
    for axis in range(2):
        if axis:p=p.transpose(Image.Transpose.TRANSPOSE)
        for y in range(48):
            for x in range(4):
                a,b=p.getpixel((x,y)),p.getpixel((47-x,y));v=tuple((a[k]+b[k])//2 for k in range(4));p.putpixel((x,y),v);p.putpixel((47-x,y),v)
        if axis:p=p.transpose(Image.Transpose.TRANSPOSE)
    return p
for phase in range(3):
    # One fixed square crop per authored keyframe, excluding the contact-sheet seam.
    rect=(round(phase*im.width/3)+2,2,round((phase+1)*im.width/3)-2,im.height-2)
    p=periodic(im.crop(rect).resize((48,48),Image.Resampling.LANCZOS));p.putalpha(255);frames.append(p)
    for y in range(144):
        for x in range(96):
            qx,qy=x//24,y//24;lx,ly=x%24,y%24;value=p.getpixel((x%48,y%48));distance=5
            if qy>=2:
                if qx==0:distance=min(distance,lx)
                if qx==3:distance=min(distance,23-lx)
                if qy==2:distance=min(distance,ly)
                if qy==5:distance=min(distance,23-ly)
            elif qx>=2:
                # Concave shore corners, only where a diagonal is not lava.
                cx=0 if qx==2 else 23;cy=0 if qy==0 else 23
                distance=min(distance,((lx-cx)**2+(ly-cy)**2)**.5)
            else:
                distance=min(distance,lx if qx==0 else 23-lx,ly if qy==0 else 23-ly)
            factor=.30+.70*min(1,distance/5)
            a1.putpixel((384+phase*96+x,y),tuple(round(v*factor) for v in value[:3])+(255,))
assert len({p.tobytes() for p in frames})==3
for p in frames:
    assert p.crop((0,0,1,48)).tobytes()==p.crop((47,0,48,48)).tobytes()
    assert p.crop((0,0,48,1)).tobytes()==p.crop((0,47,48,48)).tobytes()
dest=R/'img/tilesets/Arena_Fang_Lava_V01_A1.png';a1.save(dest)
report={'master':str(source.relative_to(R)).replace('\\','/'),'masterSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':str(dest.relative_to(R)).replace('\\','/'),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'size':a1.size,'kind':4,'phaseRegion':[384,0,288,144],'tile':48,'nativeSequence':[0,1,2,1],'nativeFramesPerPhase':30,'phaseSHA256':[hashlib.sha256(p.tobytes()).hexdigest() for p in frames],'checks':['Three different authored phases','Opposite spatial edges equal','All lava quarters opaque;5px crust banks','Other A1 slots copied unchanged from existing water export']}
(R/'doc/arte/fang-lava-v01/exports.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
print('PASS native A1,3 authored phases, periodic48px edges, crust banks, inherited slots preserved')
