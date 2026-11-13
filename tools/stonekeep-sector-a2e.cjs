// Fixed source-backed sector, no procedural encounters or new artwork.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A2_E_M02.json'),n=274*274,at=(x,y,z,v)=>map.data[z*n+y*274+x]=v;
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('A2-E: fonte divergente');
 // Materials from the confirmed INF mapping: raw38..41 = CASF0..3;59/60 = CASL0/1.
 // CASF3 ornament and carpet are explicit underlays, not new decorative artwork.
 for(const p of s.cells){const [u,y]=p.view,v=p.mapRaw,solid=map.data[5*n+(2+y*3)*274+2+u*3]===1;
  for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
   const x=2+u*3+dx,yy=2+y*3+dy,r=map.data[5*n+yy*274+x],old=map.data[yy*274+x];
   if(r===4){
    at(x,yy,0,256+(yy%4)*8+x%4); // FLOR2/3; FLOR8 carpet remains mottled underlay.
    let mask=0;for(const [dx,dy,bit]of [[0,-1,1],[1,0,2],[0,1,4],[-1,0,8]])if(map.data[5*n+(yy+dy)*274+x+dx]===5)mask|=bit;
    if(mask)at(x,yy,1,320+mask); // approved bank/transition, unchanged water mechanics.
   }
   if(solid){let row=[5,6].includes(old)?1:[13,14].includes(old)?2:0;
    if(v===0x20e3)row=dy===2?1:0; // lower obstacle, unchanged solid footprint, not a full-height wall.
    if(v===0x20e3||[0x2626,0x2727,0x2828,0x2929].includes(v))at(x,yy,0,256+row*8+6+x%2);
    if([0x3b3b,0x3c3c].includes(v))at(x,yy,0,512+row*8+2+x%2);
   }
  }
 }
 const templates=read('data/ArenaEncounters.json'),encounterEvent=map.events[16];
 for(const e of s.enemies){const origin=e.view.map(v=>3+v*3),v={...e,origin,questSpecific:false,radius:2,interval:90,regions:[4],scale:1};delete v.view;
  if(map.events[v.eventId])throw Error('A2-E: ID de encontro ocupado');
  const ev=copy(encounterEvent);Object.assign(ev,{id:v.eventId,name:(v.enemyId===1?'Rato':'Goblin')+' / '+v.id,note:'ArenaEncounter:'+v.id,x:origin[0],y:origin[1]});ev.pages[0].image.characterName=templates.mapVisuals[String(v.enemyId)].file;ev.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
  map.events[v.eventId]=ev;c.encounters.entries.push(v);c.encounters.mapVisuals[String(v.enemyId)]=copy(templates.mapVisuals[String(v.enemyId)]);
 }
 // Reuse the authored nine-part native door: fixed frame/hinge,3 blocking cells,
 // two persistent pages and the approved directional144px animation.
 const imperial=read('data/Map008.json'),prototype=read('data/ArenaDungeon.json').doors[0];c.doors=[];
 for(const src of s.doors){const center=src.view.map(v=>3+v*3),ids=[],first=map.events.length,horizontal=src.axis==='east-west';
  for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
   const id=first+dy*3+dx,ev=copy(imperial.events[prototype.eventIds[dy*3+dx]]),collider=horizontal?dx===1:dy===1;
   Object.assign(ev,{id,name:src.id+' / '+dx+','+dy,note:'A2-E native door / '+src.role,x:center[0]+dx-1,y:center[1]+dy-1});
   ev.pages.forEach((p,i)=>{p.through=i===1||!collider;p.image.characterName=dx===1&&dy===2?'!$Arena_Doors_M14_R03':'';p.image.direction=horizontal?6:2;p.image.pattern=0;p.directionFix=!!p.image.characterName;p.list=[{code:355,indent:0,parameters:["ArenaDungeon.toggleDoor('"+src.id+"');"]},{code:0,indent:0,parameters:[]}];});
   at(ev.x,ev.y,5,6); // dry threshold: not swim region5, patrol does not wander into hinges.
   map.events[id]=ev;ids.push(id);
  }
  c.doors.push({...src,center,eventIds:ids,visualEventId:ids[7],axis:src.axis,faceRows:[center[1],center[1]+1],visualAnchor:[center[0],center[1]+1],footprint:[center[0]-1,center[1]-1,3,3]});
 }
 c.doorAnimationFrames=24;c.sector={id:s.id,bounds:s.bounds,source:'doc/mapas/STONEKEEP_A2_E_M02.json',enemyIds:s.enemies.map(v=>v.id),extraConnections:s.doors.filter(v=>v.role!=='sector').map(v=>v.view),materials:'CASF/CASL + FLCASC; CASF3/carpet underlays provisional; door art reused Imperial, not DCAS5 reproduction'};
 c.context.coverage='24 encontros · A2-E funcional · restante em construção';c.coverage.implementedEncounters=24;c.coverage.implementedDoors=4;
 c.points.push({name:'A2-E · conexão oeste',position:[160,39]},{name:'A2-E · aposentos',position:[165,66]});
};
