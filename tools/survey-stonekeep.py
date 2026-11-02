"""Documentary M02-04C1. Reads original/cached consultation; writes evidence only.
Requires Pillow and existing ignored decode-map.py/Compression.h + texture index.
No engine, runtime generator, browser, asset generation or original writes.
"""
from pathlib import Path
from collections import Counter
import csv, hashlib, json, os, struct
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
OUT = ROOT / 'doc/evidencias/m02-stonekeep-cobertura'
OUT.mkdir(parents=True, exist_ok=True)
ORIGINAL = Path(r'D:\SteamLibrary\steamapps\common\The Elder Scrolls Arena\ARENA\39699021.MIF')
blob = ORIGINAL.read_bytes()
sha = hashlib.sha256(blob).hexdigest()
assert sha == '4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b'
assert struct.unpack_from('<HH', blob, 27) == (90, 90)
consult = ROOT / 'tmp/stonekeep-review'
layers = json.loads((consult / '39699021-layers.json').read_text())
# Reuse the existing decoder definitions, not its START-specific execution tail.
ns = {}
exec((ROOT / 'tmp/original-review/decode-map.py').read_text().split("b=(root/'START.MIF')")[0], ns)
for tag in ('MAP1', 'FLOR'):
    off = blob.index(tag.encode()); size, length = struct.unpack_from('<HH', blob, off + 4)
    raw = ns['decode'](blob[off + 8:off + 6 + size], length)
    values = struct.unpack('<8100H', raw)
    assert [list(values[i:i+90]) for i in range(0, 8100, 90)] == layers[tag]
tex = json.loads((consult / 'texture-associations.json').read_text())
M, F = layers['MAP1'], layers['FLOR']
current = json.loads((ROOT / 'data/Map012.json').read_text())
layout = json.loads((ROOT / 'doc/mapas/STONEKEEP_AMOSTRA_M02.json').read_text())
assert layout['crop']['displayX'] == [8, 53] and layout['crop']['y'] == [0, 32]
# INF resource names can be legacy aliases. ITEM39 resolves the executable's
# creature index7: Minotaur/PAT@.CFA, not an Ogre named after OGRE.DFA.
identity=json.loads((ROOT/'doc/arte/minotaur-v01/sources.json').read_text())
assert tex['flats'][58].upper()=='OGRE.DFA' and identity['itemIndex']==39 and identity['creatureIndex']==7 and identity['creatureName']=='Minotaur' and identity['animationPattern']=='pat@.cfa'
source_names = {52:'rato',53:'goblin',54:'homem-lagarto',55:'lobo',56:'orc',57:'esqueleto',58:'minotauro',59:'aranha',60:'ghoul'}
configured = {}
apartments = json.loads((ROOT / 'doc/mapas/STONEKEEP_APOSENTOS_M02.json').read_text())
for e in apartments['entries']:
    configured[tuple(e['sourceOriginal'])] = e
for kind in ('Skeleton', 'Ghoul', 'Wolf'):
    cfg = json.loads((ROOT / f'data/Arena{kind}.json').read_text())
    for e in [cfg['encounter']] + cfg.get('additionalEncounters', []):
        configured[tuple(e['sourceOriginal'])] = e
assert len(configured) == 20

def sector(x, y): return chr(65 + y // 30) + str(x // 30 + 1)
def macro(x, y): return ('N' if y < 60 else 'S') + ('W' if x < 60 else 'E')
def inside(x, y): return 8 <= x <= 53 and 0 <= y <= 32
def old_mv(x, y): return [3 + (x - 8) * 3, 3 + y * 3] if inside(x, y) else None
def planned_mv(x, y): return [3 + (x - (60 if x >= 60 else 0)) * 3, 3 + (y - (60 if y >= 60 else 0)) * 3]
def position(ox, y):
    x = 89 - ox
    return dict(original=[ox,y],view=[x,y],sector=sector(x,y),macroProposal=macro(x,y),currentMV=old_mv(x,y),proposedLocalMV=planned_mv(x,y))
def shape(v):
    if v == 0: return 'piso'
    if v >> 12 == 8: return 'flat'
    if v >> 12 == 11: return 'porta'
    if v >> 12 == 10: return 'aresta'
    if v >> 12 == 13: return 'diagonal'
    if not v & 0x8000: return 'parede' if ((v >> 8) & 127) == (v & 127) else 'elevacao'
    return 'desconhecido'
def open_model(x,y):
    # Potential 2D connection only: door operation/locks/heights still require adaptation.
    return 0 <= x < 90 and 0 <= y < 90 and shape(M[y][89-x]) in ('piso','flat','porta')
def records(tag, stride):
    off = blob.index(tag.encode()); length = struct.unpack_from('<H',blob,off+4)[0]
    assert length % stride == 0
    return [list(blob[i:i+stride]) for i in range(off+6,off+6+length,stride)]
locks = {tuple(r[:2]):r[2] for r in records('LOCK',3)}
enemies, doors, platforms, decor, optional, raised, edges, diagonals = [], [], [], [], [], [], [], []
for y in range(90):
    for ox in range(90):
        v = M[y][ox]; p = position(ox,y); x = p['view'][0]; typ = shape(v)
        if typ == 'flat':
            idx=v&255; asset=tex['flats'][idx] if idx < len(tex['flats']) else 'UNRESOLVED'
            if idx in source_names:
                entry=configured.get((ox,y)); p.update(floorRaw=f'{F[y][ox]:#06x}',species=source_names[idx],flat=idx,resource=asset,implemented=bool(entry),stableId=entry['id'] if entry else None)
                if p['currentMV']:
                    cx,cy=p['currentMV'];p['currentRegion']=current['data'][(5*current['height']+cy)*current['width']+cx]
                enemies.append(p)
            elif idx == 61:
                p.update(kind='pergaminho obrigatório',flat=idx,resource=asset);optional.append(p)
            elif idx in [5,7,8,9,10,11,17,18]:
                p.update(kind='chave de ferro opcional' if idx==5 else 'fonte opcional declarada / efeito a configurar',flat=idx,resource=asset);optional.append(p)
            else:
                p.update(flat=idx,resource=asset,kind='decoração; sem efeito funcional comprovado');decor.append(p)
        elif typ == 'porta':
            idx=(v&63)-1;p.update(raw=f'{v:#06x}',texture=tex['textures'][idx],lockValue=locks.get((ox,y)),currentState='passagem aberta provisória' if inside(x,y) else 'ausente');doors.append(p)
        elif typ == 'elevacao':
            p.update(raw=f'{v:#06x}',heightIndex=(v>>8)&7,thicknessIndex=(v>>11)&15,boxSide=v&15,boxCap=(v>>4)&15);raised.append(p)
            if v in (0x1800,0x1808):
                p=p.copy();p.update(dryFloor=F[y][ox]>>8!=13,adjacentDryModel=[[nx,ny] for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)] if open_model(nx,ny) and F[ny][89-nx]>>8!=13],status='candidata: mesmo padrão de refúgio M01, não autorização de descanso');platforms.append(p)
        elif typ in ('aresta','diagonal'):
            p.update(raw=f'{v:#06x}');(edges if typ=='aresta' else diagonals).append(p)
assert len(enemies)==180
assert len({tuple(e['original']) for e in enemies})==180
assert set(configured).issubset({tuple(e['original']) for e in enemies})
assert sum(e['implemented'] for e in enemies)==20
assert [tex['textures'][i]['file'] for i in (17,18)]==['CASD.IMG','CASU.IMG']
assert [(x,y) for y,row in enumerate(M) for x,v in enumerate(row) if v==0x1313]==[(39,1)]
assert not any(v==0x1212 for row in M for v in row)
assert Counter(e['species'] for e in enemies)==Counter({'rato':16,'goblin':32,'homem-lagarto':19,'lobo':13,'orc':22,'esqueleto':29,'minotauro':8,'aranha':20,'ghoul':21})
assert len(doors)==70 and len(locks)==12 and len(platforms)==7
special=next(e for e in enemies if e['original']==[76,22]);assert special['species']=='esqueleto' and not special['implemented'] and special['currentRegion']==4
triggers=[dict(**position(x,y),textIndex=t,soundIndex=s) for x,y,t,s in records('TRIG',4)]
assert next(t for t in triggers if t['textIndex']==8)['original']==[40,30]

def ports(vertical, line, lo=0, hi=89):
    vals=[i for i in range(lo,hi+1) if (open_model(line,i) and open_model(line+1,i) if vertical else open_model(i,line) and open_model(i,line+1))]
    groups=[]
    for i in vals:
        if not groups or i != groups[-1][-1]+1: groups.append([i])
        else: groups[-1].append(i)
    return [dict(axis='X' if vertical else 'Y',boundary=[line,line+1],span=[g[0],g[-1]],terrain=sorted(set('água' if F[y][89-x]>>8==13 else 'piso' for i in g for x,y in ([(line,i),(line+1,i)] if vertical else [(i,line),(i,line+1)])))) for g in groups]
links=[]
for line in [29,59]:
    for start in [0,30,60]:
        links += [dict(sectors=[sector(line,start),sector(line+1,start)],**p) for p in ports(True,line,start,start+29)]
        links += [dict(sectors=[sector(start,line),sector(start,line+1)],**p) for p in ports(False,line,start,start+29)]
sectors=[]
for row in range(3):
    for col in range(3):
        name=chr(65+row)+str(col+1);ps=[e for e in enemies if e['sector']==name]
        cells=[(x,y) for y in range(row*30,row*30+30) for x in range(col*30,col*30+30)]
        sectors.append(dict(id=name,viewBounds=[col*30,row*30,col*30+29,row*30+29],originalBounds=[60-col*30,row*30,89-col*30,row*30+29],sourceCells=900,cropCells=sum(inside(x,y) for x,y in cells),waterFloorCells=sum(F[y][89-x]>>8==13 for x,y in cells),terrain=dict(Counter(shape(M[y][89-x]) for x,y in cells)),species=dict(Counter(e['species'] for e in ps)),implementedEnemies=sum(e['implemented'] for e in ps),doors=sum(d['sector']==name for d in doors),restCandidates=sum(d['sector']==name for d in platforms)))
assert sum(s['sourceCells'] for s in sectors)==8100
matrixRows=[]
for s in sectors:
    pop=', '.join(f'{n} {k}' for k,n in s['species'].items())
    linked=sorted(set(other for l in links if s['id'] in l['sectors'] for other in l['sectors'] if other!=s['id']))
    matrixRows.append(f"|{s['id']} |{s['viewBounds']} |{s['cropCells']}/900 |{s['doors']} |{s['waterFloorCells']} |{s['restCandidates']} |{pop} ({s['implementedEnemies']} configurados) |{', '.join(linked)} |")
report=dict(base='c2d7673',original='39699021.MIF',sha256=sha,size=[90,90],layersFreshlyVerified=['MAP1','FLOR'],coordinates='zero-based; viewX=89-originalX, Y unchanged',scope='static declarations, not DOS observation; first level only; no gameplay test or runtime writes',mifLevelRecords=2,recognizedFirstLevelTransitions={'up':[[39,1]],'down':[]},sourceNotes={'wiki':'Fang Lair quest PDF p2 single-level / p5 Stonekeep Codex map (fifth map image, not Fang Lair1L)', 'INF':'STKEEP1.INF TEXT0-8, texture/flats indices already confirmed', 'technicalInterpretation':'Existing local OpenTESArena MapGeneration.cpp, not original executable code', 'otherLevelRecord':'SKEEP2.INF not promoted to reachable floor: no first-block down texture and wiki single-level; not a second required dungeon by inference'},sectors=sectors,potentialConnections=links,currentBoundaryPorts=ports(True,53,0,32)+ports(False,32,8,53),enemies=enemies,doors=doors,locks=[dict(**position(x,y),value=n) for (x,y),n in locks.items()],platformCandidates=platforms,raisedGeometry=raised,edges=edges,diagonals=diagonals,triggers=triggers,optionalSources=optional,decor=decor,missingSkeleton= special,macroProposal=[dict(id=n,bounds=b,size=[(b[2]-b[0]+1)*3+4,(b[3]-b[1]+1)*3+4],enemies=sum(macro(*e['view'])==n for e in enemies)) for n,b in [('NW',[0,0,59,59]),('NE',[60,0,89,59]),('SW',[0,60,59,89]),('SE',[60,60,89,89])]])
(OUT/'inventario.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
with (OUT/'setores.csv').open('w',encoding='utf8',newline='') as f:
    w=csv.writer(f);w.writerow(['setor','xVista0','y0','xVista1','y1','celulasNoRecorte','portas','florAgua','refugiosCandidatos','encontrosDeclarados','encontrosConfigurados'])
    for s in sectors:w.writerow([s['id'],*s['viewBounds'],s['cropCells'],s['doors'],s['waterFloorCells'],s['restCandidates'],sum(s['species'].values()),s['implementedEnemies']])
with (OUT/'encontros.csv').open('w',encoding='utf8',newline='') as f:
    w=csv.writer(f);w.writerow(['especie','arquivo','xOriginal','yOriginal','xVista','yVista','setor','implementado','idEstavel','mvXAtual','mvYAtual','macroProposta','mvXProposto','mvYProposto'])
    for e in enemies: w.writerow([e['species'],e['resource'],*e['original'],*e['view'],e['sector'],e['implemented'],e['stableId'] or '',*(e['currentMV'] or ['', '']),e['macroProposal'],*e['proposedLocalMV']])
# Cartographic evidence, no game textures, original screenshots or AI art.
fontfile='C:/Windows/Fonts/arial.ttf';boldfile='C:/Windows/Fonts/arialbd.ttf'
font=lambda n:ImageFont.truetype(fontfile,n)
bold=lambda n:ImageFont.truetype(boldfile,n)
im=Image.new('RGB',(1540,1260),'#121a20');d=ImageDraw.Draw(im);ox,oy,sz=55,100,12
d.text((40,20),'Stonekeep · levantamento90×90 / M02-04C1',font=bold(27),fill='#f1dfb6');d.text((40,58),'Vista da planta: X = 89 − X original; Y original. Grade90×90, base0. Não é mapa do jogo.',font=font(18),fill='#c7d0d4')
palette={'parede':'#323c42','elevacao':'#7f6a51','piso':'#c4bda2','flat':'#c4bda2','porta':'#c4bda2','aresta':'#b16d98','diagonal':'#8a716c','desconhecido':'#ff00ff'}
for y in range(90):
    for x in range(90):
        v=M[y][89-x];typ=shape(v);color='#315b78' if F[y][89-x]>>8==13 and typ in ['piso','flat','porta'] else palette[typ]
        d.rectangle((ox+x*sz,oy+y*sz,ox+(x+1)*sz-1,oy+(y+1)*sz-1),fill=color)
for i in range(0,91,10):
    d.text((ox+i*sz-7,oy-24),str(i),font=font(13),fill='#c7d0d4');d.text((ox-25,oy+i*sz-8),str(i),font=font(13),fill='#c7d0d4')
for i in (30,60):
    d.line((ox+i*sz,oy,ox+i*sz,oy+90*sz),fill='#f7efd4',width=2);d.line((ox,oy+i*sz,ox+90*sz,oy+i*sz),fill='#f7efd4',width=2)
for s in sectors:
    x,y,_,_=s['viewBounds'];d.rectangle((ox+x*sz+3,oy+y*sz+3,ox+x*sz+36,oy+y*sz+27),fill='#142029');d.text((ox+x*sz+5,oy+y*sz+4),s['id'],font=bold(19),fill='white')
d.rectangle((ox+8*sz,oy,ox+54*sz-1,oy+33*sz-1),outline='#62f3a2',width=4)
for p in doors:
    x,y=p['view'];cx,cy=ox+x*sz+6,oy+y*sz+6;d.line((cx-4,cy,cx+4,cy),fill='#171717',width=3)
colors={'rato':'#85280e','goblin':'#d1c100','homem-lagarto':'#208044','lobo':'#433426','orc':'#276118','esqueleto':'#f4f4f4','minotauro':'#be5318','aranha':'#662477','ghoul':'#285acb'}
for e in enemies:
    x,y=e['view'];cx,cy=ox+x*sz+6,oy+y*sz+6;d.ellipse((cx-4,cy-4,cx+4,cy+4),fill=colors[e['species']],outline='#111111')
    if e['implemented']:d.rectangle((cx-5,cy-5,cx+5,cy+5),outline='#00ff99',width=1)
for p in platforms:
    x,y=p['view'];cx,cy=ox+x*sz+6,oy+y*sz+6;d.polygon([(cx,cy-5),(cx+5,cy),(cx,cy+5),(cx-5,cy)],fill='#ff76dc',outline='black')
for label,point in [('P',(17,23)),('K',(49,30)),('S',(50,1))]:
    x,y=point;cx,cy=ox+x*sz+6,oy+y*sz+6;d.rectangle((cx-9,cy-10,cx+9,cy+10),fill='#072425',outline='#ffffff');d.text((cx-6,cy-10),label,font=bold(17),fill='#ffffff')
x,y=special['view'];cx,cy=ox+x*sz+6,oy+y*sz+6;d.ellipse((cx-11,cy-11,cx+11,cy+11),outline='#ff3838',width=3);d.line((cx,cy,cx+105,cy-28),fill='#ff3838',width=2);d.rectangle((cx+95,cy-55,cx+280,cy-26),fill='#0d1b22');d.text((cx+100,cy-52),'E: original(76,22)',font=bold(17),fill='#ff7777')
lx=1170;yy=112
legend=['LEGENDA','Verde: retângulo da amostra','Quadrado verde: encontro atual','Círculo: referência de inimigo','Traço preto: porta (não direção)','Azul: água em célula não sólida','Castanho: elevação, não refúgio','Rosa: aresta / efeito incerto','Losango rosa: candidato descanso','P: pergaminho; K: chave ferro','S: saída reconhecida','', '180 referências /20 configuradas']
for line in legend:d.text((lx,yy),line,font=bold(18) if line=='LEGENDA' else font(16),fill='#e4dfce');yy+=27
for k,n in Counter(e['species'] for e in enemies).items():d.ellipse((lx,yy+3,lx+10,yy+13),fill=colors[k]);d.text((lx+20,yy),f'{k}: {n}',font=font(17),fill='#e4dfce');yy+=26
yy+=14
for line in ['A1–C3: setores de levantamento','Macroproposta MV:', 'NW0–59/0–59:184×184', 'NE60–89/0–59:94×184','SW0–59/60–89:184×94','SE60–89/60–89:94×94','','Portas/alturas não equivalem','a transitabilidade comprovada.','Não houve playtest DOS ou MV.']:
    d.text((lx,yy),line,font=font(16),fill='#c7d0d4');yy+=26
d.text((40,1210),'Gerado de MAP1/FLOR/INF/TRIG/LOCK e configurações atuais. Grade de planejamento; sem arte original distribuída.',font=font(17),fill='#d0c8b4')
im.save(OUT/'visao-geral.png')
print(json.dumps({'enemies':dict(Counter(e['species'] for e in enemies)),'implemented':len(configured),'doors':len(doors),'locks':len(locks),'raised':len(raised),'restCandidates':platforms,'edges':len(edges),'diagonals':len(diagonals),'triggersText':dict(Counter(t['textIndex'] for t in triggers)),'macroProposal':report['macroProposal']},ensure_ascii=False,indent=2))
