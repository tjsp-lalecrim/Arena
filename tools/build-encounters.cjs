// Appends authored encounters without changing any M01-14 event, tile or door.
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const dungeon=read('data/ArenaDungeon.json'), map=read('data/Map008.json');
const firstId=169;
if(map.events.slice(firstId).some(e=>e&&!e.note.startsWith('ArenaEncounter:')))throw Error('Unrelated events after168; preserve them before rebuilding');
map.events=map.events.slice(0,firstId);
const page=read('data/Map007.json').events.find(e=>e&&e.pages).pages[0];
const entries=dungeon.integration.enemies.map((source,i)=>{
 const enemyId={'rat.dfa':1,'goblin.dfa':2}[source.sourceFlat];
 if(!enemyId)throw Error('Unmapped source '+source.sourceFlat);
 const id='imperial.enemy.'+String(i+1).padStart(2,'0'),eventId=firstId+i;
 const p=JSON.parse(JSON.stringify(page));
 Object.assign(p,{conditions:{actorId:1,actorValid:false,itemId:1,itemValid:false,selfSwitchCh:'A',selfSwitchValid:false,switch1Id:1,switch1Valid:false,switch2Id:1,switch2Valid:false,variableId:1,variableValid:false,variableValue:0},image:{tileId:0,characterName:'',characterIndex:0,direction:4,pattern:1},moveType:0,moveSpeed:3,moveFrequency:3,walkAnime:true,stepAnime:true,directionFix:false,through:false,priorityType:1,trigger:2,list:[{code:355,indent:0,parameters:[`ArenaEncounters.start('${id}');`]},{code:0,indent:0,parameters:[]}]});
 map.events.push({id:eventId,name:(enemyId===1?'Rato':'Goblin')+' / '+id,note:'ArenaEncounter:'+id,x:source.position[0],y:source.position[1],pages:[p]});
 return {id,eventId,enemyId,troopId:enemyId,origin:source.position,sourceFlat:source.sourceFlat,questSpecific:false,radius:3,interval:90,regions:[3,4,5],scale:enemyId===1?0.5:0.6};
});
fs.writeFileSync('data/ArenaEncounters.json',JSON.stringify({schemaVersion:1,mapId:8,areaId:'imperial-dungeons',completionQuestId:'MQ01',entries},null,2)+'\n');
fs.writeFileSync('data/Map008.json',JSON.stringify(map)+'\n');
console.log('Built '+entries.length+' encounters; original168 events retained');
