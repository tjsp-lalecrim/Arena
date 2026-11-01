// Content-only merge: append new stable IDs, preserve every existing record.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(f,v)=>fs.writeFileSync(path.join(R,f),(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':JSON.stringify(v,null,2))+'\n');
module.exports=function(){const c=read('data/ArenaSkeleton.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Skeleton enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Esqueleto · piloto Stonekeep')throw Error('Skeleton troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:c.enemy.exp,gold:0,note:c.source};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Esqueleto · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 const p=read('doc/arte/skeleton-v01/profile.json');motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};
 const category=()=>({chance:0,min:1,max:1,entries:[]});
 loot.enemies[c.enemyId]={gold:{chance:0,min:0,max:0},potions:category(),gearChance:0,equipment:category(),weapons:category(),questSources:[],rare:{chance:0,variants:{},items:category()},difficulty:'campaign exemplar; item/gold loot unknown, deliberately empty',source:c.source};
 const map=read('data/Map012.json'),campaign=read('data/ArenaCampaign.json'),entries=[c.encounter].concat(c.additionalEncounters||[]),ids=new Set(),events=new Set();
 entries.forEach(v=>{
 if(ids.has(v.id)||events.has(v.eventId))throw Error('Duplicate skeleton encounter ID');ids.add(v.id);events.add(v.eventId);
 if(map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('Skeleton origin must be walkable floor: '+v.id);
 if(map.events[v.eventId]&&!map.events[v.eventId].note.includes(v.id))throw Error('Skeleton event ID occupied');
 const event=JSON.parse(JSON.stringify(read('data/Map008.json').events[169]));
 Object.assign(event,{id:v.eventId,name:'Esqueleto / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
 event.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
 map.events[v.eventId]=event;
 });
 const area=campaign.areas.find(a=>a.id==='stonekeep');if(!area||area.mapId!==12)throw Error('Stonekeep area unavailable');
 const previous=area.encounters||{mapVisuals:{},entries:[]};
 area.encounters={schemaVersion:1,mapId:12,areaId:'stonekeep',completionQuestId:'MQ02',mapVisuals:{...previous.mapVisuals,[c.enemyId]:c.walk},entries:entries.map(v=>({...v,enemyId:c.enemyId,troopId:c.troopId})).concat(previous.entries.filter(v=>!ids.has(v.id)))};
 // Keep the map's compact layout and prior records unchanged.
 fs.writeFileSync(path.join(R,'data/Map012.json'),JSON.stringify(map)+'\n');write('data/ArenaCampaign.json',campaign);
 for(const [f,v]of Object.entries({'Enemies':enemies,'Troops':troops,'ArenaBattle':battle,'ArenaBattleMotion':motion,'ArenaLoot':loot}))write('data/'+f+'.json',v);
};if(require.main===module)module.exports();
