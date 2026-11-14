// Fang Lair campaign and connected dry wings, using provisional runtime tiles.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(n,v)=>fs.writeFileSync(path.join(R,'data/'+n+'.json'),(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':v.data&&v.events?JSON.stringify(v):JSON.stringify(v,null,2))+'\n');
function terrain(rows,s,m){
 const w=rows[0].length*s+2*m,h=rows.length*s+2*m,data=Array(w*h*6).fill(0);
 const cell=(x,y)=>rows[Math.floor((y-m)/s)]?.[Math.floor((x-m)/s)]||'#';
 // 3×3 elbows. A closed side keeps its full border solid, including the
 // corner tile, so finer MV movement cannot connect a third source cell.
 const cornerMasks={'1':['#..','#..','###'],'2':['..#','..#','###'],
                    '3':['###','#..','#..'],'4':['###','..#','..#']};
 function solidAt(x,y){
  const value=cell(x,y),mask=cornerMasks[value];
  return mask?mask[(y-m)%s][(x-m)%s]==='#':value==='#';
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const value=cell(x,y),solid=solidAt(x,y),dy=(y-m+s)%s;
  data[y*w+x]=solid?(cell(x,y)==='#'&&cell(x,y+s)!=='#'?(dy===0?4:5+x%2+(dy-1)*8):4):value==='='||value==='+'?9:1+x%2+y%2*8;
  data[(5*h+y)*w+x]=solid?1:4;
 }
 return {width:w,height:h,data};
}
module.exports=function(){
 const c=read('data/ArenaFangCells.json');
 const [upperPlan,lowerPlan]=read('doc/mapas/FANG_COBERTURA_M02.json').levels;
 const toMap=(plan,[x,y])=>[3+3*(plan.crop[1]-x),3+3*(y-plan.crop[2])];
 const base=read('data/Map008.json').events[241].pages[0],event=(id,name,p,script,normal=false)=>{const page=JSON.parse(JSON.stringify(base));page.image.characterName='';page.priorityType=normal?1:0;page.through=true;page.trigger=0;page.list=script?[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}]:[{code:0,indent:0,parameters:[]}];return{id,name,note:'M02-06A — arte provisória, fonte FANG1/42068779',x:p[0],y:p[1],pages:[page]};};
 const events=[null,event(1,'Retornar a Rihad',c.entry,'ArenaFangCells.leave(this);'),event(2,'Portal falante / enigma',[c.riddle[0],c.riddle[1]+1],'ArenaFangCells.interact(this);',true),event(3,'Chave dourada / fang.cell2.key',c.key,'ArenaFangCells.takeKey(this);'),event(4,'Descer para o segundo nível',c.limit,'ArenaFangCells.descend(this);')];
 function door(id,name,origin,direction){
  const e=event(id,name,[origin[0],origin[1]+1],null,true);
  const page=e.pages[0];
  page.image={characterName:'!$Arena_Doors_M14_R03',characterIndex:0,direction,pattern:0,tileId:0};
  page.walkAnime=false;page.directionFix=true;
  const open=JSON.parse(JSON.stringify(page));open.conditions.selfSwitchValid=true;open.conditions.selfSwitchCh='A';
  open.image.pattern=2;e.pages.push(open);return e;
 }
 c.gates.forEach(g=>{events[g.eventId]=door(g.eventId,'Porta provisória / '+g.id,g.origin,g.direction);});
 const optional=c.optionalTreasure;
 function collectible(id,name,origin,script,image){
  const e=event(id,name,origin,script),page=e.pages[0];
  page.image={...image};page.walkAnime=false;page.directionFix=true;
  const taken=JSON.parse(JSON.stringify(page));
  taken.conditions.selfSwitchValid=true;taken.conditions.selfSwitchCh='A';taken.image.characterName='';
  taken.list=[{code:0,indent:0,parameters:[]}];e.pages.push(taken);return e;
 }
 function addTreasure(chest){
  const position=toMap(upperPlan,chest.original);
  if(events[chest.eventId]||events.some(e=>e&&e.x===position[0]&&e.y===position[1])||
     upperPlan.rows[chest.original[1]-upperPlan.crop[2]][upperPlan.crop[1]-chest.original[0]]==='#'){
   throw Error('Fang: invalid treasure placement '+chest.id);
  }
  events[chest.eventId]=collectible(chest.eventId,'Tesouro / '+chest.id,position,'ArenaFangCells.takeTreasure(this);',
   read('data/Map008.json').events[138].pages[0].image);
 }
 for(const key of optional.keys){
  const position=toMap(upperPlan,key.original);
  const e=collectible(key.eventId,'Chave de latão',position,'ArenaFangCells.brass(this);',read('data/Map008.json').events[127].pages[0].image);
  // While the cell is closed or the key has been taken, keep its art hidden.
  const empty=e.pages[1];e.pages=[{...empty,conditions:{...empty.conditions,selfSwitchValid:false}},e.pages[0],empty];
  e.pages[1].conditions.selfSwitchValid=true;e.pages[1].conditions.selfSwitchCh='B';
  events[key.eventId]=e;
 }
 for(const cell of optional.cells){
  const planned=upperPlan.optionalTreasureCells.find(v=>v.id===cell.id);
  const {origin,approach}=cell;
  if(!planned||JSON.stringify(planned.treasures)!==JSON.stringify(cell.treasures)||
     origin.join()!==toMap(upperPlan,planned.original).join()||approach.join()!==toMap(upperPlan,planned.approachOriginal).join()){
   throw Error('Fang: optional cell differs from source plan '+cell.id);
  }
  const side=Math.sign(approach[0]-origin[0]);
  events[cell.doorEventId]=door(cell.doorEventId,'Cela de tesouro / '+cell.id,origin,side<0?6:4);
  const interact=event(cell.interactEventId,'Fechadura de latão',[origin[0]+side,origin[1]],'ArenaFangCells.openTreasureCell(this);',true);
  interact.pages[0].through=false;
  // Open state belongs to the actual door; runtime makes the access event passable.
  events[cell.interactEventId]=interact;
  cell.treasures.forEach(addTreasure);
 }
 events[7]=event(7,'Chegada à mina',c.arrivalText,'ArenaFangCells.describe(this, "arrival");');
 events[8]=event(8,'Sala das celas',c.cellsEntry,'ArenaFangCells.describe(this, "intro");');
 events[7].pages[0].trigger=1;
 events[8].pages[0].trigger=1;
 const profile=read('data/ArenaStonekeepWhole.json').encounters;
 const encounterTemplate=read('data/Map008.json').events[169];
 const species={34:3,37:7,38:4,39:8,40:9,41:5};
 function addEncounters(plan,mapEvents,legacy){
  return plan.encounters.filter(row=>row.status!=='pending').map(row=>{
   const [x,y]=row.original,existing=legacy.find(e=>e.sourceOriginal[0]===x&&e.sourceOriginal[1]===y);
   if((row.status==='existing')!==!!existing)throw Error('Fang: legacy encounter mismatch at '+row.original);
   const origin=toMap(plan,row.original),enemyId=species[row.item];
   if(!enemyId||plan.rows[y-plan.crop[2]][plan.crop[1]-x]==='#')throw Error('Fang: invalid active encounter at '+row.original);
   const template=profile.entries.find(e=>e.enemyId===enemyId);
   const data={id:existing?.id||`fang.${plan.level}.enemy.mif${x}.${y}`,eventId:existing?.eventId||row.eventId,
    origin,sourceOriginal:row.original,sourceFlat:`FANG${plan.level} flat${row.flat} ${row.resource} / ITEM${row.item}`,
    enemyId,troopId:template.troopId,questSpecific:true,radius:2,interval:90,regions:[4],scale:template.scale};
   if(mapEvents[data.eventId])throw Error('Fang: repeated event '+data.id);
   const e=JSON.parse(JSON.stringify(encounterTemplate)),page=e.pages[0];
   Object.assign(e,{id:data.eventId,name:row.resource+' / '+data.id,note:'ArenaEncounter:'+data.id,x:origin[0],y:origin[1]});
   if(plan.level===1&&existing){page.conditions.selfSwitchValid=true;page.conditions.selfSwitchCh='B';}
   page.list=[{code:355,indent:0,parameters:['ArenaEncounters.start('+JSON.stringify(data.id)+');']},{code:0,indent:0,parameters:[]}];
   mapEvents[data.eventId]=e;
   return data;
  });
 }
 const entries=addEncounters(upperPlan,events,c.spiders);
 const dryTreasures=upperPlan.treasures.filter(chest=>chest.status==='dry').map(({id,eventId,original})=>({id,eventId,original}));
 dryTreasures.forEach(addTreasure);
 write('ArenaFangCells',{...c,dryTreasures});
 if(read('data/MapInfos.json')[13]&&read('data/MapInfos.json')[13].name!=='M02-06 Fang Lair — celas (provisório)')throw Error('Map013 ID occupied');
 write('Map013',{...read('data/Map001.json'),...terrain(upperPlan.rows,3,2),tilesetId:4,displayName:'',note:'Fang Lair: entrada, alas secas e celas. Materiais provisórios.',encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events});
 const infos=read('data/MapInfos.json');infos[13]={id:13,expanded:true,name:'M02-06 Fang Lair — celas (provisório)',order:13,parentId:0,scrollX:0,scrollY:0};
 const lower=c.lower,staff=lower.staffPiece,layout=read('doc/mapas/FANG_NIVEL2_M02.json');
 for(const name of ['entry','stair','approach','door','staffPiece']){
  const position=name==='staffPiece'?staff.position:lower[name];
  if(position.some((value,index)=>value!==toMap(lowerPlan,layout.anchors[name])[index]))throw Error('Fang: coordinate mismatch for '+name);
 }
 if(infos[lower.mapId]&&infos[lower.mapId].name!=='M02-07 Fang Lair — nível 2')throw Error('Lower map ID occupied');
 infos[lower.mapId]={id:lower.mapId,expanded:true,name:'M02-07 Fang Lair — nível 2',order:lower.mapId,parentId:13,scrollX:0,scrollY:0};
 write('MapInfos',infos);
 const lowerEvents=[null,
  event(1,'Subir para o primeiro nível',lower.stair,'ArenaFangCells.ascend(this);'),
  event(2,'Segundo enigma',[lower.approach[0],lower.approach[1]+1],'ArenaFangCells.lowerRiddle(this);',true)];
 const doorEvent=event(4,'Porta do segundo enigma',[lower.door[0],lower.door[1]+1],null);
 const doorPage=doorEvent.pages[0];
 doorPage.image={characterName:'!$Arena_Doors_M14_R03',characterIndex:0,direction:8,pattern:0,tileId:0};
 doorPage.walkAnime=false;
 doorPage.directionFix=true;
 const open=JSON.parse(JSON.stringify(doorPage));
 open.conditions.selfSwitchValid=true;
 open.conditions.selfSwitchCh='A';
 open.image.pattern=2;
 doorEvent.pages.push(open);
 lowerEvents[4]=doorEvent;
 const staffEvent=event(staff.eventId,'Primeiro fragmento / '+staff.sourceId,staff.position,'ArenaFangCells.takeStaffPiece(this);');
 staffEvent.note='FANG2 MAP1 0x8066 at (64,75): CHAOS1.DFA / ITEM13';
 lowerEvents[staff.eventId]=staffEvent;
 const lowerEntries=addEncounters(lowerPlan,lowerEvents,[{id:'fang.lower.approach.skeleton.01',eventId:3,sourceOriginal:layout.anchors.skeleton}]);
 write('Map'+String(lower.mapId).padStart(3,'0'),{...read('data/Map001.json'),...terrain(lowerPlan.rows,3,2),
  tilesetId:4,displayName:'',note:'FANG2: escada, alas secas, segundo enigma e sala do fragmento. Tiles provisórios.',
  encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events:lowerEvents});
 const items=read('data/Items.json');if(items[8]&&!items[8].note.includes('MQ02.gold-key'))throw Error('Item8 occupied');items[8]={...items[1],id:8,name:'Chave dourada de Fang Lair',description:'Chave da Cela 2. Abre o portal junto às celas de Fang Lair. Ícone provisório.',itypeId:2,consumable:false,price:0,note:'<ArenaQuest: MQ02>\n<ArenaUnique>\nMQ02.gold-key / fang.cell2.key; consumo somente no portal.'};
 const visuals=entries=>Object.fromEntries([...new Set(entries.map(e=>e.enemyId))].map(id=>[id,profile.mapVisuals[id]]));
 const campaign=read('data/ArenaCampaign.json');Object.assign(campaign.areas.find(a=>a.id===c.areaId),{mapId:c.mapId,encounters:{schemaVersion:1,mapId:c.mapId,areaId:c.areaId,completionQuestId:c.questId,mapVisuals:visuals(entries),entries}});campaign.sources.find(v=>v.id===c.sourceId).itemId=c.itemId;
 const staffSource=campaign.sources.find(source=>source.id===staff.sourceId);
 if(!staffSource||staffSource.areaId!==lower.areaId||staffSource.questId!==c.questId)throw Error('Invalid campaign source '+staff.sourceId);
 if(items[staff.itemId]&&!items[staff.itemId].note.includes(staffSource.itemKey))throw Error('Staff fragment item ID occupied');
 items[staff.itemId]={...items[8],id:staff.itemId,name:'Primeiro fragmento do Cajado do Caos',
  description:'Fragmento de ébano recuperado em Fang Lair. É a primeira das oito partes do Cajado do Caos.',
  note:'<ArenaQuest: MQ02>\n<ArenaUnique>\n'+staffSource.itemKey+' / '+staff.sourceId};
 staffSource.itemId=staff.itemId;
 if(items[optional.itemId]&&!items[optional.itemId].note.includes('fang.brass-key'))throw Error('Brass key item ID occupied');
 items[optional.itemId]={...items[8],id:optional.itemId,name:'Chave de latão de Fang Lair',
  description:'Abre uma das duas celas opcionais de tesouro. Uma chave é usada por fechadura.',
  note:'fang.brass-key'};
 write('Items',items);
 Object.assign(campaign.areas.find(area=>area.id===lower.areaId),{mapId:lower.mapId,encounters:{
  schemaVersion:1,mapId:lower.mapId,areaId:lower.areaId,completionQuestId:c.questId,
  mapVisuals:visuals(lowerEntries),entries:lowerEntries
 }});
 write('ArenaCampaign',campaign);
};if(require.main===module)module.exports();
