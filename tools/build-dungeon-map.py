"""Compile a fixed authored dungeon layout, never procedural generation at runtime.
AI artwork packing only; raw MIF/extracted materials stay ignored in tmp.
"""
from pathlib import Path
from PIL import Image,ImageChops
import json,copy,hashlib
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads((ROOT/p).read_text(encoding='utf8'))
def write(p,data):
 s=('[\n'+',\n'.join(json.dumps(v,ensure_ascii=False,separators=(',',':')) for v in data)+'\n]\n') if isinstance(data,list) else json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n'
 (ROOT/p).write_text(s,encoding='utf8')
l=read('doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json');S=l['scale'];M=l['margin'];W=50*S+M*2;H=W
master=Image.open(ROOT/'art/m01-14/complementos-prisao-v01.png').convert('RGBA');assert master.size==(1536,1024)
old=Image.open(ROOT/'img/tilesets/Arena_Prison_R04.png').convert('RGBA');sheet=Image.new('RGBA',(768,768))
def idat(c,r):return c+r*8
def panel(c,r):return master.crop((c*512,r*512,(c+1)*512,(r+1)*512))
def put(im,c,r,size):sheet.alpha_composite(im.resize(size,Image.Resampling.LANCZOS),(c*48,r*48))
# Native B bank: two-by-two approved floor; cap and wall faces separate.
put(old.crop((48,0,144,96)),1,0,(96,96));put(panel(0,0).crop((128,128,320,320)),4,0,(48,48));put(old.crop((192,0,288,96)),5,0,(96,96))
put(panel(0,1),0,2,(96,96));put(panel(1,0),0,4,(144,144));put(panel(2,0),4,4,(144,144))
platform=Image.open(ROOT/'img/pictures/arena_platform_r03.png').convert('RGBA');put(platform,4,8,(144,144))
concept=Image.open(ROOT/'art/masters/revisao-r02/dungeon-identidade-r02.png').convert('RGBA');put(concept.crop((1110,125,1230,210)),4,12,(48,48))
put(Image.new('RGBA',(48,48),'#090c0f'),7,0,(48,48)) # nonvisual void clear; cap and walls retain AI artwork
icons=Image.open(ROOT/'img/pictures/arena_icones_v01.png').convert('RGBA');pile=Image.new('RGBA',(48,48));pile.alpha_composite(icons.crop((0,0,64,32)).resize((48,24),Image.Resampling.LANCZOS),(0,18));put(pile,5,12,(48,48))
# R02 derivatives are versioned separately; approved v01 remains for comparison.
sheet.alpha_composite(sheet.crop((192,0,240,48)),(336,48)) # cap overlay tile15
sheet.save(ROOT/'img/tilesets/Arena_Dungeon_M14_R03.png')
# Native A1 water, three 96x144 surface blocks. Periodic assembly of the approved
# water panel; motion is a 2px phase shift, never independently randomized tiles.
water=panel(0,1).resize((48,48),Image.Resampling.LANCZOS)
water=Image.blend(water,ImageChops.offset(water,24,24),0.5)
for y in range(48):
 for x in range(4):
  a=water.getpixel((x,y));b=water.getpixel((47-x,y));v=tuple((a[i]+b[i])//2 for i in range(4));water.putpixel((x,y),v);water.putpixel((47-x,y),v)
for x in range(48):
 for y in range(4):
  a=water.getpixel((x,y));b=water.getpixel((x,47-y));v=tuple((a[i]+b[i])//2 for i in range(4));water.putpixel((x,y),v);water.putpixel((x,47-y),v)
a1=Image.new('RGBA',(768,576))
for frame in range(3):
 phase=ImageChops.offset(water,frame*2,0)
 for y in range(0,144,48):
  for x in range(0,96,48):a1.alpha_composite(phase,(frame*96+x,y))
a1.save(ROOT/'img/tilesets/Arena_Water_M14_R02_A1.png')
tiles=read('data/Tilesets.json');t=copy.deepcopy(tiles[3]);t.update(id=4,name='M01 Masmorras Imperiais',note='R03 ortogonal: teto1 + face2, corredor3; sem cap sobre vão; decoração só em face válida. Água R02 preservada.',tilesetNames=['Arena_Water_M14_R02_A1','','','','','Arena_Dungeon_M14_R03','','','']);t['flags']=[0]*8192;t['flags'][0]=16;t['flags'][15]=16
for k in [4,5,6,7,13,14]:t['flags'][k]=15
# Non-floor decorative bank entries, only used by event graphics.
for r in range(4,15):
 for c in range(8):t['flags'][idat(c,r)]=16
if len(tiles)==4:tiles.append(t)
else:tiles[4]=t
for r in range(8,11):
 for c in range(4,7):t['flags'][idat(c,r)]=0 # traversable platforms
write('data/Tilesets.json',tiles)
data=[0]*(W*H*6)
def at(x,y,z,v):data[(z*H+y)*W+x]=v
def center(cell):return [M+cell[0]*S+1,M+cell[1]*S+1]
def cellAt(x,y):return l['rows'][y][x] if 0<=x<50 and 0<=y<50 else '#'
for y in range(H):
 for x in range(W):
  cx,cy=(x-M)//S,(y-M)//S;c=cellAt(cx,cy);dx,dy=(x-M)%S,(y-M)%S
  if c in ['#','G']:
   tile=7
   if (dx==0 and cellAt(cx-1,cy) not in ['#','G']) or (dx==2 and cellAt(cx+1,cy) not in ['#','G']) or (dy==0 and cellAt(cx,cy-1) not in ['#','G']):tile=4
   if cellAt(cx,cy+1) not in ['#','G'] and c!='G':tile=4 if dy==0 else 5+(x%2)+(dy-1)*8
   at(x,y,0,tile);at(x,y,5,1)
  else:
   tile=1+(x%2)+(y%2)*8
   if c=='~':tile=2048 # native animated A1 surface, shape0
   at(x,y,0,tile);at(x,y,5,2 if c=='~' else 3 if c=='^' else 4)
   if c=='^':at(x,y,1,idat(4+dx,8+dy)) # low independent slab, below player
m=copy.deepcopy(read('data/Map007.json'));m.update(width=W,height=H,data=data,displayName='Masmorras Imperiais',tilesetId=4,events=[None],encounterList=[],encounterStep=30,note='M01-14: mapa estático de teste; sem quests/patrulhas/introdução. Leia DUNGEON_M01_14.md. Esc menu/salvar.');m['scrollType']=0;m['parallaxName']='';m['specifyBattleback']=False
base=copy.deepcopy(read('data/Map007.json')['events'][8]['pages'][0]);base['image'].update(tileId=0,characterName='',characterIndex=0,direction=2,pattern=1);base['moveType']=0;base['stepAnime']=False;base['walkAnime']=False
hooks=[]
def event(name,x,y,tile=0,script=None,priority=0,through=True,trigger=0,openPage=False):
 n=len(m['events']);p=copy.deepcopy(base);p.update(priorityType=priority,through=through,trigger=trigger);p['image']['tileId']=tile;p['list']=[{'code':355,'indent':0,'parameters':[script]},{'code':0,'indent':0,'parameters':[]}] if script else [{'code':0,'indent':0,'parameters':[]}];pages=[p]
 if openPage:
  p2=copy.deepcopy(p);p2['conditions'].update(selfSwitchValid=True,selfSwitchCh='A');p2['through']=True;p2['image']['tileId']=0;p2['list']=[{'code':0,'indent':0,'parameters':[]}];pages.append(p2)
 m['events'].append({'id':n,'name':name,'note':'M01-14 geometry/integration only','x':x,'y':y,'pages':pages});return n
for door in l['doors']:
 x,y=door['cell'];px,py=center([x,y]);horizontal=cellAt(x-1,y)!='#' and cellAt(x+1,y)!='#';ids=[]
 # Never draw a solid ceiling across a walkable aperture. Existing neighboring
 # map walls are the fixed jamb/frame; door components contain no masonry.
 for dx in range(3):
  for faceY in [py,py+1]:at(px+dx-1,faceY,5,5)
 for dy in range(3):
  for dx in range(3):
   collider=(dx==1 if horizontal else dy==1)
   n=event(door['id']+' / '+str(dx)+','+str(dy),px+dx-1,py+dy-1,0,"ArenaDungeon.toggleDoor('%s');"%door['id'],1,not collider,0,True);ids.append(n)
   m['events'][n]['pages'][1]['list']=copy.deepcopy(m['events'][n]['pages'][0]['list'])
   if dx==1 and dy==2:
    for p in m['events'][n]['pages']:
     p['image'].update(characterName='!$Arena_Doors_M14_R03',direction=6 if horizontal else 2,pattern=0)
     p['directionFix']=True;p['priorityType']=1
     p['list']=copy.deepcopy(m['events'][n]['pages'][0]['list'])
 hooks.append(dict(door,eventIds=ids,visualEventId=ids[7],center=[px,py],axis='east-west' if horizontal else 'north-south',faceRows=[py,py+1],visualAnchor=[px,py+1],footprint=[px-1,py-1,3,3],hingesLocal=[[72,4],[72,140]] if horizontal else [[4,144],[140,144]]))
key=center(l['keyCell']);keyEvent=event('MQ01.key / reservado M01-16',*key,idat(4,12),"$gameMessage.add('Chave de rubi: ponto original.\\nIntegração de MQ01 em M01-16.\\nNenhum item concedido neste teste.');",0,True)
m['events'][keyEvent]['pages'][0]['image'].update(tileId=0,characterName='!$Arena_Key_M14_R02',direction=2,pattern=1)
gate=center(l['gateCell']);
for dy in range(3):
 for dx in range(3):event('Shift Gate / visual',gate[0]+dx-1,gate[1]+dy-1,idat(4+dx,4+dy),None,1,True)
end=center(l['gateApproach']);gateEvent=event('Shift Gate / contato técnico',*end,0,"$gameMessage.add('Shift Gate alcançado.\\nTeste de exploração: fim do percurso.\\nEncerramento narrativo em M01-18.');",0,True,1)
treasures=[];attachments=[];usedFaces=set()
for mark in l['reserved']:
 if mark['kind']=='treasure':
  px,py=center(mark['cell']);n=event('Tesouro / integração M01-16',px,py,0,"ArenaDungeon.inspectTreasure(%s);"%len(treasures),0,True)
  m['events'][n]['pages'][0]['image'].update(characterName='!$Arena_Treasure_M14_R03',direction=2,pattern=0)
  m['events'][n]['pages'][0]['directionFix']=True
  treasures.append({'eventId':n,'position':[px,py],'sourceFlat':mark['sourceFlat']})
 if mark['kind']=='chains':
  px,py=center(mark['cell']);
  # Orient the assembly toward the source flat, on an actual solid neighbor.
  x,y=mark['cell']
  # An opaque '#' cell is NOT sufficient: its south face must actually be drawn.
  candidates=[(abs(nx-x)+abs(ny-y),ny,nx) for ny in range(50) for nx in range(50) if cellAt(nx,ny)=='#' and cellAt(nx,ny+1) not in ['#','G'] and abs(nx-x)+abs(ny-y)<=6 and (nx,ny) not in usedFaces]
  adjacent=min(candidates) if candidates else None
  if adjacent:
   distance,wy0,wx0=adjacent;usedFaces.add((wx0,wy0));wx,wy=center([wx0,wy0]);n=event('Vestígio de prisão / correntes',wx,wy+1,0,None,0,True)
   m['events'][n]['pages'][0]['image'].update(characterName='!$Arena_Chains_M14_R03',direction=2,pattern=1)
   m['events'][n]['pages'][0]['directionFix']=True
   attachments.append({'eventId':n,'sourceCell':mark['cell'],'wallCell':[wx0,wy0],'position':[wx,wy+1],'sourceDistance':distance,'orientation':'south-face','category':'wall-only','sourceFlat':mark['sourceFlat']})
  else:raise ValueError('No valid visible wall face for chain marker '+str(mark['cell']))
write('data/Map008.json',m)
infos=read('data/MapInfos.json');info={'id':8,'expanded':True,'name':'M01-14 Masmorras Imperiais','order':8,'parentId':0,'scrollX':0,'scrollY':0}
if len(infos)==8:infos.append(info)
else:infos[8]=info
write('data/MapInfos.json',infos)
config={'schemaVersion':1,'mapId':8,'laboratory':{'mapId':7,'x':8,'y':6},'start':center(l['startCell']),'key':key,'gateApproach':end,'gateCenter':gate,'keyEvent':keyEvent,'gateEvent':gateEvent,'doors':hooks,'sourceLayout':'doc/mapas/IMPERIAL_DUNGEONS_LAYOUT_M01.json','width':W,'height':H,'integration':{'treasures':treasures,'enemies':[{'position':center(v['cell']),'sourceFlat':v['sourceFlat']} for v in l['reserved'] if v['kind']=='enemy'],'platforms':[center([x,y]) for y,r in enumerate(l['rows']) for x,c in enumerate(r) if c=='^'],'ria':center(l['startCell'])}}
config.update(schemaVersion=3,swimming={'enabled':True,'regionId':2,'autotileKind':0,'depth':24,'offsetY':10},doorAnimationFrames=30,treasurePreviewOnly=True,attachments=attachments)
write('data/ArenaDungeon.json',config)
print('compiled fixed map',W,H,'doors',len(hooks),'events',len(m['events'])-1,'start',config['start'],'key',key,'gate',end)
