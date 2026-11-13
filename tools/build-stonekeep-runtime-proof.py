"""Isolated Map014 proof, not a replacement/generator for campaign Map012."""
from pathlib import Path
import json, hashlib, sys, shutil
ROOT=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text(encoding='utf8'))
inventory=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json')
layers=read('tmp/stonekeep-review/39699021-layers.json')
assert hashlib.sha256(Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF').read_bytes()).hexdigest()==inventory['sha256']
M,F=layers['MAP1'],layers['FLOR'];W=H=274
def terrain(x,y):
 u,sy=(x-2)//3,(y-2)//3
 if not(0<=u<90 and 0<=sy<90):return '#'
 v=M[sy][89-u]
 # No finished height/door design claimed. Reuse conservative sample convention,
 # with the seven known low platform cells traversable. Diagonals remain solid.
 floor=v==0 or v>>12 in (8,11,10) or v in (0x1800,0x1808)
 return ('~' if F[sy][89-u]>>8==13 else '.') if floor else '#'
data=[0]*(W*H*6)
for y in range(H):
 for x in range(W):
  t=terrain(x,y);dy=(y-2+3)%3
  tile=2048 if t=='~' else 1+x%2+y%2*8
  if t=='#':tile=(4 if dy==0 else 5+x%2+(dy-1)*8) if terrain(x,y+3)!='#' else 4
  data[y*W+x]=tile;data[(5*H+y)*W+x]=1 if t=='#' else 5 if t=='~' else 4
for p in inventory['platformCandidates']:
 u,y=p['view'];cx,cy=3+3*u,3+3*y
 for dy in range(3):
  for dx in range(3):data[(H+cy-1+dy)*W+cx-1+dx]=68+dx+dy*8
base=read('data/Map008.json')['events'][241]['pages'][0]
sprites={'rato':'$Arena_rat_walk_r02','goblin':'$Arena_goblin_walk_r02','lobo':'$Arena_wolf_walk_v01','esqueleto':'$Arena_skeleton_walk_v01','ghoul':'$Arena_ghoul_walk_v01'}
events=[None];entries=[]
for i,p in enumerate(inventory['enemies'],1):
 u,y=p['view'];x,y=3+3*u,3+3*y;page=json.loads(json.dumps(base));name=sprites.get(p['species'],'$Arena_goblin_walk_r02')
 page.update(conditions={**page['conditions'],'selfSwitchValid':False},image={'characterIndex':0,'characterName':name,'direction':2,'pattern':1,'tileId':0},moveType=0,moveSpeed=3,moveFrequency=3,priorityType=1,through=False,walkAnime=True,stepAnime=False,directionFix=False,trigger=0,list=[{'code':0,'indent':0,'parameters':[]}])
 events.append({'id':i,'name':f"Carga técnica {i:03d} / {p['species']}",'note':'Patrulha sintética, sem combate/EXP/loot. Visual substituto somente para carga, não representação final da espécie.','x':x,'y':y,'pages':[page]})
 entries.append({'eventId':i,'origin':[x,y],'sourceOriginal':p['original'],'species':p['species'],'visual':name,'standIn':p['species'] not in sprites})
def nearest(u,y,wet=False):
 pts=[(x,sy) for sy in range(90) for x in range(90) if terrain(3+x*3,3+sy*3)==('~' if wet else '.')]
 a,b=min(pts,key=lambda p:abs(p[0]-u)+abs(p[1]-y));return [3+a*3,3+b*3]
points=[{'name':name,'position':nearest(u,y,wet)} for name,u,y,wet in [('Entrada',50,4,False),('Ilha / fonte sem evento',17,23,False),('Noroeste',2,2,False),('Nordeste',87,2,False),('Sudoeste',2,87,False),('Sudeste',87,87,False),('Centro / sul dos aposentos',45,45,False),('Água da bacia',27,12,True)]]
config={'version':1,'mapId':14,'size':[W,H],'sourceSha256':inventory['sha256'],'scale':3,'margin':2,'points':points,'entries':entries,'technicalStorageKey':'arena:technical:stonekeep-large:v1','swimming':{'enabled':True,'regionId':5,'autotileKind':0,'depth':32,'offsetY':8}}
mp={**read('data/Map001.json'),'width':W,'height':H,'data':data,'events':events,'tilesetId':4,'note':'Somente prova runtime 274x274, sem campanha. Geometria de alturas/diagonais provisória;70 portas são vãos abertos.','displayName':'','encounterList':[],'scrollType':0,'parallaxName':'','specifyBattleback':False}
infos=read('data/MapInfos.json')
if len(infos)>14 and infos[14] and infos[14]['name']!='Prova Stonekeep 274 (técnica)':raise ValueError('Map014 ocupado')
while len(infos)<15:infos.append(None)
infos[14]={'id':14,'name':'Prova Stonekeep 274 (técnica)','expanded':True,'order':14,'parentId':0,'scrollX':0,'scrollY':0}
for filename,obj in [('data/Map014.json',mp),('data/ArenaStonekeepRuntimeProof.json',config),('data/MapInfos.json',infos)]:
 text=('['+'\n'+',\n'.join(json.dumps(v,ensure_ascii=False,separators=(',',':')) for v in obj)+'\n]') if filename.endswith('MapInfos.json') else json.dumps(obj,ensure_ascii=False,separators=(',',':'))
 (ROOT/filename).write_text(text+'\n',encoding='utf8')
print('Map014274x274 /180 eventos de carga, sem alterar Map012; bytes', (ROOT/'data/Map014.json').stat().st_size)
if '--editor-copy' in sys.argv:
 target=ROOT/'tmp/stonekeep-runtime-editor'
 assert target.resolve().is_relative_to((ROOT/'tmp').resolve())
 for folder in ['data','js/plugins','img/tilesets','img/characters']:(target/folder).mkdir(parents=True,exist_ok=True)
 for f in (ROOT/'data').glob('*.json'):shutil.copy2(f,target/'data'/f.name)
 shutil.copy2(ROOT/'Game.rpgproject',target/'Game.rpgproject');shutil.copy2(ROOT/'js/plugins.js',target/'js/plugins.js')
 for f in (ROOT/'js/plugins').glob('*.js'):shutil.copy2(f,target/'js/plugins'/f.name)
 system=read('data/System.json');system.update(gameTitle='Arena — COPIA TECNICA 274',startMapId=14)
 (target/'data/System.json').write_text(json.dumps(system,ensure_ascii=False),encoding='utf8')
 tree=[v if i in [0,14] else None for i,v in enumerate(infos)];tree[14]={**tree[14],'name':'DESCARTAVEL Map014 274'}
 (target/'data/MapInfos.json').write_text(json.dumps(tree,ensure_ascii=False),encoding='utf8')
 for name in read('data/Tilesets.json')[4]['tilesetNames']:
  if name:shutil.copy2(ROOT/'img/tilesets'/f'{name}.png',target/'img/tilesets'/f'{name}.png')
 for name in {e['visual'] for e in entries}:shutil.copy2(ROOT/'img/characters'/f'{name}.png',target/'img/characters'/f'{name}.png')
 print('Cópia mínima SOMENTE para inspeção no editor, não pacote de execução:',target)
