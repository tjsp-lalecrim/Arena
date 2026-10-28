"""Assemble selected AI poses and integrate stable identity references, last in asset builds."""
from pathlib import Path
import json,subprocess,sys
R=Path(__file__).resolve().parents[1]
def read(p):return json.loads((R/p).read_text(encoding='utf8'))
jobs=read('doc/arte/m01-integracao-r02/walk-prompts.json')+read('doc/arte/m01-integracao-r02/walk-expansao-prompts.json')+read('doc/arte/m01-integracao-r02/enemy-walk-prompts.json')
exports=[]
for j in jobs:
 args=[sys.executable,str(R/'tools/assemble-walk-r02.py'),j['master'],j['target'],'--cell',*map(str,j['cell']),'--height',str(j['height']),'--width',str(j['width']),'--pivot',j['pivot']]
 if j.get('opposed'):args+=['--opposed']
 if j.get('reflect'):args+=['--reflect',*map(str,j['reflect'])]
 result=json.loads(subprocess.check_output(args,cwd=R,encoding='utf8'));result['id']=j['id'];exports.append(result)
if '--integrate' in sys.argv:
 p=R/'data/ArenaCharacterVisuals.json';data=read('data/ArenaCharacterVisuals.json')
 for j in jobs:
  if j['id'] in data['visuals']:
   v=data['visuals'][j['id']];v.update(character=Path(j['target']).stem,mapCell=j['cell'],poseStatus='r02-native-three-phase-walk')
 p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 subprocess.check_call(['node','tools/build-encounters.cjs'],cwd=R)
(R/'doc/arte/m01-integracao-r02/walk-exports.json').write_text(json.dumps(exports,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Assembled',len(exports),'walking sheets; approved Breton female untouched. Integrated:', '--integrate' in sys.argv)
