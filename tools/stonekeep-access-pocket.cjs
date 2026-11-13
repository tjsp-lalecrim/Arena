// Explicit dry raised corridor only. No change to A1/wet candidates or global passability.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_ACESSOS_A2_B2_M02.json'),n=map.width*map.height,roof=[];
 for(const cell of s.dryPassage.cells){const [cx,cy]=cell.center;
  if(cell.raw!==0x1e4d||![2,3,6].includes(cell.floorRaw>>8))throw Error('Dry corridor: source contract mismatch');
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const x=cx+dx,y=cy+dy,k=y*map.width+x;
   if(map.data[5*n+k]!==1)throw Error('Dry corridor: expected conservative solid cell');
   const base=(cell.floorRaw>>8)===6?288:256;map.data[k]=base+(y%4)*8+x%4;map.data[5*n+k]=4;
   roof.push({x,y,tileId:512+x%2}); // approved CASK cap, local overlay only; no tileset flag changes.
  }
 }
 c.access.dryPassage={...copy(s.dryPassage),overheadTiles:roof};
 s.pocketDoors.forEach(d=>require('./stonekeep-door-components.cjs')(map,c,d));
 for(const v of s.pocketEnemies){
  if(map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===v.origin.join(',')))throw Error('Pocket encounter: occupied ID/origin');
  const template=c.encounters.entries.find(e=>e.enemyId===v.enemyId&&e.troopId===v.troopId),e=copy(map.events[template.eventId]);
  Object.assign(e,{id:v.eventId,name:'Goblin / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
  e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[v.eventId]=e;c.encounters.entries.push(copy(v));
 }
 // Old provenance stays in its authoring file; current configuration no longer claims unresolved access here.
 c.doors.forEach(d=>{if(d.accessDependency)d.accessDependency=null;});c.encounters.entries.forEach(e=>{if(e.accessDependency)e.accessDependency=null;});
 c.a2b2.deferredDoors=[];c.a2b2.deferredEnemies=c.a2b2.deferredEnemies.filter(e=>!s.pocketEnemies.some(v=>v.sourceOriginal.join(',')===e.sourceOriginal.join(',')));
 c.coverage.implementedDoors=c.doors.length;c.coverage.implementedEncounters=c.encounters.entries.length;
 c.context.coverage=c.encounters.entries.length+' encontros ·'+c.doors.length+' portas · A2/B2 com acessos funcionais';
 c.points.forEach(p=>{if(['B2 · oeste (acesso provisório)','B2 · sul (acesso provisório)'].includes(p.name))p.name=p.name.replace(' (acesso provisório)','');});
 c.points.push(...copy(s.points.slice(3)));
};
