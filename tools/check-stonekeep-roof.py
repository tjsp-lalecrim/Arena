"""Pixel regression on disposable test captures, no asset editing."""
from pathlib import Path
from PIL import Image,ImageChops
import sys,json
base=Path(sys.argv[1]);prefix=sys.argv[2];x,y=map(int,sys.argv[3:5]);box=(x-22,y-72,x+22,y-4)
def load(name):return Image.open(base/f'{prefix}-{name}.png').convert('RGB').crop(box)
def total(a,b):return sum(ImageChops.difference(a,b).tobytes())
front=total(load('normal'),load('actor-hidden'))
clear=total(load('roof-hidden'),load('both-hidden'))
assert clear>5000,('Character capture invalid',clear)
ratio=front/clear
assert .25<ratio<.9,('Actual roof alpha hides character or no roof is drawn',ratio)
data=dict(crop=list(box),characterDifferenceUnderRoof=front,characterDifferenceWithoutRoof=clear,ratio=ratio,expected='local alpha112/255; character remains readable through roof')
(base/f'{prefix}-pixels.json').write_text(json.dumps(data,indent=2)+'\n',encoding='utf8')
print(json.dumps(data))
