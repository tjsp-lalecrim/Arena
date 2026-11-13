// Bounded A1 west: confirmed open-water link and2 ghouls, not a blanket underpass rule.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A1_OESTE_M02.json'),n=map.width*map.height;
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('A1 west: source mismatch');
 const at=(x,y,z)=>map.data[z*n+y*map.width+x];
 for(const cell of s.cells){
  const [u,y]=cell.view,raw=cell.mapRaw;
  for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
   const x=2+3*u+dx,yy=2+3*y+dy,r=at(x,yy,5),old=at(x,yy,0);
   if(r===4){
    const base=(cell.floorRaw>>8)===6?288:256;
    map.data[yy*map.width+x]=base+(yy%4)*8+x%4;
    let mask=0;
    for(const [dx,dy,bit]of [[0,-1,1],[1,0,2],[0,1,4],[-1,0,8]])if(at(x+dx,yy+dy,5)===5)mask|=bit;
    if(mask)map.data[n+yy*map.width+x]=320+mask;
   }
   // CASF0..2 masonry only. Keep elevated/unresolved structures and outer bounds intact.
   if(r===1&&[0x2626,0x2727,0x2828].includes(raw)){
    const row=[5,6].includes(old)?1:[13,14].includes(old)?2:0;
    map.data[yy*map.width+x]=256+row*8+6+x%2;
   }
  }
 }
 for(const v of s.entries){
  if(map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===v.origin.join(','))||at(...v.origin,5)!==4)throw Error('A1 west: invalid or occupied encounter '+v.id);
  const template=c.encounters.entries.find(e=>e.enemyId===v.enemyId&&e.troopId===v.troopId);
  if(!template)throw Error('A1 west: approved ghoul template missing');
  const e=copy(map.events[template.eventId]);
  Object.assign(e,{id:v.eventId,name:'Ghoul / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
  e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
  map.events[v.eventId]=e;c.encounters.entries.push(copy(v));
 }
 c.a1West={source:'doc/mapas/STONEKEEP_A1_OESTE_M02.json',enemyIds:s.entries.map(e=>e.id),collisionChanged:false,underStructureStatus:'Unresolved clearance: keep existing geometry, not a definitive closure; no underpass claimed.'};
 c.coverage.implementedEncounters=c.encounters.entries.length;
 c.context.coverage=c.encounters.entries.length+' encontros · A1 oeste por água aberta · estruturas ainda em estudo';
 c.points.push(...copy(s.points));
};
