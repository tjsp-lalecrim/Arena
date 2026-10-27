"""Prepare an ignored MV authoring fixture. Never overwrites an existing copy."""
from pathlib import Path
import shutil,json,hashlib,subprocess
R=Path(__file__).resolve().parents[1];dest=R/'tmp/mv-editor-m01-14'
if dest.exists():raise SystemExit('Copy already exists; preserving it: '+str(dest))
dest.mkdir(parents=True)
files=[]
for folder in ['data','img','js','audio','fonts','icon','movies']:
 source=R/folder
 if source.exists():
  shutil.copytree(source,dest/folder)
  files.extend(p for p in source.rglob('*') if p.is_file())
for name in ['Game.rpgproject','index.html','package.json']:
 shutil.copy2(R/name,dest/name);files.append(R/name)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
baseline={str(p.relative_to(R)).replace('\\','/'):digest(p) for p in files}
# Clear identity of fixture before opening. This is NOT the requested editor edit.
p=dest/'data/System.json';s=json.loads(p.read_text(encoding='utf8'));s['gameTitle']='Arena - TESTE TEMPORARIO M01-14';p.write_text(json.dumps(s,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
revision=subprocess.check_output(['git','rev-parse','--short','HEAD'],cwd=R,text=True).strip()
report={'sourceRoot':str(R),'sourceVersion':revision,'temporaryProject':str(dest/'Game.rpgproject'),'excluded':['.git','save','tmp','doc','art'],'originalRuntimeHashes':baseline,'copyBaseline':{name:digest(dest/name) for name in baseline},'fixtureOnlyChange':'data/System.json gameTitle labels fixture; Map008 and plugins unchanged','mapTreeName':'M01-14 Masmorras Imperiais','mapId':8,'safeEditorEdit':{'property':'displayName','before':'Masmorras Imperiais','testValue':'Masmorras Imperiais [TESTE EDICAO]'},'editorWrittenChangeConfirmed':False}
(R/'tmp/mv-editor-m01-14-baseline.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8');assert all(digest(R/name)==value for name,value in baseline.items())
print('Prepared:',dest/'Game.rpgproject');print('Original runtime unchanged:',len(files),'files; personal saves/references/git excluded')
