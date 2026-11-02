// One approved battle profile and four declared floor encounters, preserving all other consumers.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(name,value)=>fs.writeFileSync(path.join(R,'data/'+name+'.json'),(Array.isArray(value)?'[\n'+value.map(v=>JSON.stringify(v)).join(',\n')+'\n]':JSON.stringify(value,null,2))+'\n');
module.exports=function(){
 const c=read('data/ArenaWolf.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json'),p=read('doc/arte/wolf-v01/profile.json');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Wolf enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Lobo · piloto Stonekeep')throw Error('Wolf troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,actions:[{conditionParam1:0,conditionParam2:0,conditionType:0,rating:5,skillId:1}],traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:c.enemy.exp,gold:0,note:c.source+' Campaign EXP'+c.enemy.exp+' provisional; direct battle lab overrides to zero.'};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Lobo · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};
 loot.enemies[c.enemyId]=c.campaign.loot;
 const map=read('data/Map012.json'),campaign=read('data/ArenaCampaign.json'),area=campaign.areas.find(a=>a.id==='stonekeep'),entries=[c.encounter,...(c.additionalEncounters||[])],ids=new Set(),eventIds=new Set(),origins=new Set();
 for(const v of entries){
 if(ids.has(v.id)||eventIds.has(v.eventId)||origins.has(v.origin.join(',')))throw Error('Wolf duplicate ID/event/origin');ids.add(v.id);eventIds.add(v.eventId);origins.add(v.origin.join(','));
 if(!area||area.mapId!==12||map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('Wolf: invalid Stonekeep floor binding');
 if(map.events[v.eventId]&&map.events[v.eventId].note!=='ArenaEncounter:'+v.id)throw Error('Wolf event ID occupied');
 const e=JSON.parse(JSON.stringify(read('data/Map008.json').events[169]));Object.assign(e,{id:v.eventId,name:'Lobo / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[v.eventId]=e;
 }
 area.encounters.mapVisuals[String(c.enemyId)]=c.walk;const existing=new Set(area.encounters.entries.map(v=>v.id));area.encounters.entries=area.encounters.entries.map(e=>entries.find(v=>v.id===e.id)||e).concat(entries.filter(v=>!existing.has(v.id)));
 fs.writeFileSync(path.join(R,'data/Map012.json'),JSON.stringify(map)+'\n');write('ArenaCampaign',campaign);
 for(const [name,v]of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motion,ArenaLoot:loot}))write(name,v);
};if(require.main===module)module.exports();
