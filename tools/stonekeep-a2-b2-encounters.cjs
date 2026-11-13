// Second coherent unit: existing species only, no changes to combat/reward tables.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A2_B2_M02.json');
 for(const v of s.enemies){
  if(map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===v.origin.join(','))||map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('B2 encounter: occupied ID/origin or invalid floor '+v.id);
  const template=c.encounters.entries.find(e=>e.enemyId===v.enemyId&&e.troopId===v.troopId);
  if(!template)throw Error('B2 encounter: approved species/template absent '+v.id);
  const e=copy(map.events[template.eventId]);Object.assign(e,{id:v.eventId,name:v.species+' / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
  e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
  map.events[v.eventId]=e;c.encounters.entries.push(copy(v));
 }
 c.a2b2.enemyIds=s.enemies.map(e=>e.id);c.coverage.implementedEncounters=c.encounters.entries.length;
 c.context.coverage=c.encounters.entries.length+' encontros ·'+c.doors.length+' portas · A2/B2 (LOCK pendentes)';
};
