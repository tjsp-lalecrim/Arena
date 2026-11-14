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
 c.gates.forEach(g=>{const e=event(g.eventId,'Porta provisória / '+g.id,[g.origin[0],g.origin[1]+1],null);e.pages[0].image={characterName:'!$Arena_Doors_M14_R03',characterIndex:0,direction:g.direction,pattern:0,tileId:0};e.pages[0].priorityType=1;e.pages[0].walkAnime=false;e.pages[0].directionFix=true;const open=JSON.parse(JSON.stringify(e.pages[0]));open.conditions.selfSwitchValid=true;open.conditions.selfSwitchCh='A';open.image.pattern=2;e.pages.push(open);events[g.eventId]=e;});
 events[5]=event(5,'Latão / Cela1',[27,297],'ArenaFangCells.brass(this);');events[6]=event(6,'Latão / Cela3',[9,297],'ArenaFangCells.brass(this);');
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
 write('Items',items);
 Object.assign(campaign.areas.find(area=>area.id===lower.areaId),{mapId:lower.mapId,encounters:{
  schemaVersion:1,mapId:lower.mapId,areaId:lower.areaId,completionQuestId:c.questId,
  mapVisuals:visuals(lowerEntries),entries:lowerEntries
 }});
 write('ArenaCampaign',campaign);
};if(require.main===module)module.exports();
