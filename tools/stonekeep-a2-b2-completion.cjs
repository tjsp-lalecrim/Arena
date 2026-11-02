// Nine remaining source-bound B2 encounters; geometry and all existing event IDs preserved.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A2_B2_CONCLUSAO_M02.json'),orc=read('data/ArenaOrc.json'),lizard=read('data/ArenaLizardPatrol.json');
 if(s.entries.length!==9||map.events.length!==340||c.doors.length!==32||c.encounters.entries.length!==49)throw Error('A2/B2 completion: base coverage differs');
 c.encounters.mapVisuals['7']=copy(orc.walkLab.encounters.mapVisuals['7']);c.encounters.mapVisuals['3']=copy(lizard.encounters.mapVisuals['3']);
 const donor=map.events[c.encounters.entries[0].eventId];
 for(const v of s.entries){
  if(map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===v.origin.join(','))||map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('A2/B2 completion: occupied ID/origin or non-dry floor '+v.id);
  const e=copy(donor);Object.assign(e,{id:v.eventId,name:v.species+' / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[v.eventId]=e;c.encounters.entries.push(copy(v));
 }
 c.a2b2.deferredEnemies=[];c.a2b2.completion={source:'doc/mapas/STONEKEEP_A2_B2_CONCLUSAO_M02.json',enemyIds:s.entries.map(v=>v.id),sectors:s.sectors};c.coverage.implementedEncounters=c.encounters.entries.length;c.context.coverage='58 encontros ·32 portas · A2/B2 encontros e portas completos; demais setores/eventos pendentes';c.points.push(...copy(s.points));
};
