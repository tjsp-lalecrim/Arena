// C2 south only; existing corridors reused, no terrain expansion or new reward tables.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_C2_SUL_M02.json');if(map.events.length!==526||c.encounters.entries.length!==109||c.doors.length!==46)throw Error('C2 south: base coverage mismatch');
 const donor=map.events[c.encounters.entries[0].eventId];
 for(const v of s.entries){if(map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===v.origin.join(','))||map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('C2 south: occupied ID/origin or non-dry floor '+v.id);const e=copy(donor);Object.assign(e,{id:v.eventId,name:v.species+' / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[v.eventId]=e;c.encounters.entries.push(copy(v));}
 c.c2South={source:'doc/mapas/STONEKEEP_C2_SUL_M02.json',enemyIds:s.entries.map(e=>e.id),connection:s.connection};c.coverage.implementedEncounters=c.encounters.entries.length;c.coverage.implementedDoors=c.doors.length;c.points.push(...copy(s.points));c.context.coverage='119 encontros ·46 portas · C2 sul integrado; outros trechos pendentes';
};
