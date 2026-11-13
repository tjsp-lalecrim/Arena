// Fang Lair campaign route through the fragment room, using provisional runtime tiles.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(n,v)=>fs.writeFileSync(path.join(R,'data/'+n+'.json'),(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':v.data&&v.events?JSON.stringify(v):JSON.stringify(v,null,2))+'\n');
function terrain(rows,s,m){
 const w=rows[0].length*s+2*m,h=rows.length*s+2*m,data=Array(w*h*6).fill(0);
 const cell=(x,y)=>rows[Math.floor((y-m)/s)]?.[Math.floor((x-m)/s)]||'#';
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const value=cell(x,y),solid=value==='#',dy=(y-m+s)%s;
  data[y*w+x]=solid?(cell(x,y+s)!=='#'?(dy===0?4:5+x%2+(dy-1)*8):4):value==='='||value==='+'?9:1+x%2+y%2*8;
  data[(5*h+y)*w+x]=solid?1:4;
 }
 return {width:w,height:h,data};
}
module.exports=function(){
 const c=read('data/ArenaFangCells.json');
 const cells=read('doc/mapas/FANG_CELAS_M02.json'), mine=read('doc/mapas/FANG_ENTRADA_M02.json');
 const rows=mine.rows.concat(cells.rows.map(row=>'#'+row.padEnd(99,'#')));
 const base=read('data/Map008.json').events[241].pages[0],event=(id,name,p,script,normal=false)=>{const page=JSON.parse(JSON.stringify(base));page.image.characterName='';page.priorityType=normal?1:0;page.through=true;page.trigger=0;page.list=script?[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}]:[{code:0,indent:0,parameters:[]}];return{id,name,note:'M02-06A — arte provisória, fonte FANG1/42068779',x:p[0],y:p[1],pages:[page]};};
 const events=[null,event(1,'Retornar a Rihad',c.entry,'ArenaFangCells.leave(this);'),event(2,'Portal falante / enigma',[c.riddle[0],c.riddle[1]+1],'ArenaFangCells.interact(this);',true),event(3,'Chave dourada / fang.cell2.key',c.key,'ArenaFangCells.takeKey(this);'),event(4,'Descer para o segundo nível',c.limit,'ArenaFangCells.descend(this);')];
 c.gates.forEach(g=>{const e=event(g.eventId,'Porta provisória / '+g.id,[g.origin[0],g.origin[1]+1],null);e.pages[0].image={characterName:'!$Arena_Doors_M14_R03',characterIndex:0,direction:g.direction,pattern:0,tileId:0};e.pages[0].priorityType=1;e.pages[0].walkAnime=false;e.pages[0].directionFix=true;const open=JSON.parse(JSON.stringify(e.pages[0]));open.conditions.selfSwitchValid=true;open.conditions.selfSwitchCh='A';open.image.pattern=2;e.pages.push(open);events[g.eventId]=e;});
 events[5]=event(5,'Latão / Cela1',[27,297],'ArenaFangCells.brass(this);');events[6]=event(6,'Latão / Cela3',[9,297],'ArenaFangCells.brass(this);');
 events[7]=event(7,'Chegada à mina',c.arrivalText,'ArenaFangCells.describe(this, "arrival");');
 events[8]=event(8,'Sala das celas',c.cellsEntry,'ArenaFangCells.describe(this, "intro");');
 events[7].pages[0].trigger=1;
 events[8].pages[0].trigger=1;
 const spider=read('data/ArenaSpider.json');
 const encounterTemplate=read('data/Map008.json').events[169];
 const entries=c.spiders.map(v=>{
  const e=JSON.parse(JSON.stringify(encounterTemplate)),page=e.pages[0];
  Object.assign(e,{id:v.eventId,name:'Aranha / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
  page.conditions.selfSwitchValid=true;
  page.conditions.selfSwitchCh='B';
  page.list=[{code:355,indent:0,parameters:['ArenaEncounters.start('+JSON.stringify(v.id)+');']},{code:0,indent:0,parameters:[]}];
  events[e.id]=e;
  return {...v,enemyId:spider.enemyId,troopId:spider.troopId,questSpecific:true,radius:2,interval:90,regions:[4],scale:1,
   sourceFlat:'FANG1 flat55 SPIDER.DFA / ITEM40'};
 });
 if(read('data/MapInfos.json')[13]&&read('data/MapInfos.json')[13].name!=='M02-06 Fang Lair — celas (provisório)')throw Error('Map013 ID occupied');
 write('Map013',{...read('data/Map001.json'),...terrain(rows,cells.scale,cells.margin),tilesetId:4,displayName:'',note:'Fang Lair: entrada, corredores e celas. Materiais e ligações de mina provisórios.',encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events});
 const infos=read('data/MapInfos.json');infos[13]={id:13,expanded:true,name:'M02-06 Fang Lair — celas (provisório)',order:13,parentId:0,scrollX:0,scrollY:0};
 const lower=c.lower,staff=lower.staffPiece,layout=read('doc/mapas/FANG_NIVEL2_M02.json');
 const toMap=([x,y])=>[layout.margin+1+(layout.crop.x[1]-x)*layout.scale,layout.margin+1+(y-layout.crop.y[0])*layout.scale];
 if(staff.position.some((value,index)=>value!==toMap(layout.anchors.staffPiece)[index]))throw Error('Staff fragment source coordinates differ from the FANG2 anchor');
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
 const skeletonProfile=read('data/ArenaStonekeepWhole.json').encounters;
 const skeletonTemplate=skeletonProfile.entries.find(entry=>entry.enemyId===4);
 const [sx,sy]=layout.anchors.skeleton;
 const origin=toMap([sx,sy]);
 const skeleton={...skeletonTemplate,id:'fang.lower.approach.skeleton.01',eventId:3,origin,sourceOriginal:[sx,sy],sourceFlat:'FANG2 flat53 SKELETON.DFA / ITEM38'};
 const skeletonEvent=JSON.parse(JSON.stringify(encounterTemplate));
 Object.assign(skeletonEvent,{id:3,name:'Esqueleto / '+skeleton.id,note:'ArenaEncounter:'+skeleton.id,x:origin[0],y:origin[1]});
 skeletonEvent.pages[0].list=[{code:355,indent:0,parameters:['ArenaEncounters.start('+JSON.stringify(skeleton.id)+');']},{code:0,indent:0,parameters:[]}];
 lowerEvents[3]=skeletonEvent;
 write('Map'+String(lower.mapId).padStart(3,'0'),{...read('data/Map001.json'),...terrain(layout.rows,layout.scale,layout.margin),
  tilesetId:4,displayName:'',note:'FANG2: escada, rota seca, segundo enigma e sala do fragmento. Tiles provisórios.',
  encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events:lowerEvents});
 const items=read('data/Items.json');if(items[8]&&!items[8].note.includes('MQ02.gold-key'))throw Error('Item8 occupied');items[8]={...items[1],id:8,name:'Chave dourada de Fang Lair',description:'Chave da Cela 2. Abre o portal junto às celas de Fang Lair. Ícone provisório.',itypeId:2,consumable:false,price:0,note:'<ArenaQuest: MQ02>\n<ArenaUnique>\nMQ02.gold-key / fang.cell2.key; consumo somente no portal.'};
 const campaign=read('data/ArenaCampaign.json');Object.assign(campaign.areas.find(a=>a.id===c.areaId),{mapId:c.mapId,encounters:{schemaVersion:1,mapId:c.mapId,areaId:c.areaId,completionQuestId:c.questId,mapVisuals:spider.encounters.mapVisuals,entries}});campaign.sources.find(v=>v.id===c.sourceId).itemId=c.itemId;
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
  mapVisuals:{'4':skeletonProfile.mapVisuals['4']},entries:[skeleton]
 }});
 write('ArenaCampaign',campaign);
};if(require.main===module)module.exports();
