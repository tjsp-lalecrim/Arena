"""Review previews from decoded actual video frames, not generated atlas replays."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,numpy as np
R=Path(__file__).resolve().parents[1]
for folder in (R/'tmp/video-review').iterdir():
 if not folder.is_dir():continue
 paths=sorted(folder.glob('*.png'));times=json.loads((folder/'times.json').read_text(encoding='utf8'));frames=[Image.open(p).convert('RGB') for p in paths]
 assert len(frames)>20
 changes=[(float(np.abs(np.asarray(frames[i],dtype=float)-np.asarray(frames[i-1],dtype=float)).sum()),i) for i in range(1,len(frames))]
 selected=[0,len(frames)-1]
 for _,i in sorted(changes,reverse=True):
  if all(abs(i-j)>1 for j in selected):selected.append(i)
  if len(selected)==12:break
 selected.sort();board=Image.new('RGB',(1920,3*232),'#17191d')
 for n,i in enumerate(selected):board.paste(frames[i],((n%4)*480,(n//4)*232))
 board.save(R/('doc/evidencias/m01-10-r02/inspecao-'+folder.name+'.png'))
 if folder.name in ['antes-r01-leve-pesada','adaga-pesada','espada-pesada']:
  durations=[max(20,round((times[i+1]-times[i])*1000)) for i in range(len(times)-1)]+[100]
  frames[0].save(R/('doc/evidencias/m01-10-r02/preview-'+folder.name+'.gif'),save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=True)
print('Built timestamped filmstrips and GIFs from real decoded videos, native pixel crops.')
