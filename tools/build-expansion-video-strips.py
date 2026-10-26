"""Assemble review-only strips from decoded native video pixels."""
from pathlib import Path
from PIL import Image,ImageDraw
import json
root=Path(__file__).resolve().parents[1];out=root/'doc/evidencias/m01-10-r03';clips=json.loads((out/'decodificacao-videos.json').read_text())['videos']
for clip in clips:
 name=clip['file'].replace('.webm','').replace('/','-');parts=sorted((root/'tmp/expansion-video-review'/name).glob('*.png'));assert len(parts)==12
 board=Image.new('RGB',(1920,728),'#17191d');d=ImageDraw.Draw(board);d.text((4,5),clip['file']+' / recorded MV pixels / native-size crops',fill='white')
 for n,p in enumerate(parts):board.paste(Image.open(p).convert('RGB'),((n%4)*480,32+(n//4)*232))
 board.save(out/clip['file'].replace('.webm','-inspecao.png'))
print('47 native video filmstrips,12 samples each; not atlas replays.')
