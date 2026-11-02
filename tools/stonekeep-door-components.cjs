// Shared offline use of the same9-part authored component. No new door/lock runtime.
const copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c,src){
 const n=map.width*map.height,donor=c.doors[0];
 if(!donor||donor.eventIds.length!==9||src.lockValue!==null||src.triggerAtDoor!==null||c.doors.some(d=>d.id===src.id||d.center.join(',')===src.center.join(',')))throw Error('Stonekeep door: occupied/conditional/missing component '+src.id);
 const templates=donor.eventIds.map(id=>copy(map.events[id]));
 const [x,y]=src.center,ids=[],first=map.events.length,horizontal=src.axis==='east-west';
 for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
  const id=first+dy*3+dx,e=copy(templates[dy*3+dx]),collider=horizontal?dx===1:dy===1;
  Object.assign(e,{id,name:src.id+' / '+dx+','+dy,note:'A2 central native door / no LOCK',x:x+dx-1,y:y+dy-1});
  if(map.data[5*n+e.y*map.width+e.x]!==4||map.events.some(v=>v&&v.x===e.x&&v.y===e.y))throw Error('Stonekeep door: footprint not clear dry passage '+src.id);
  e.pages.forEach((p,i)=>{p.through=i===1||!collider;p.image.direction=horizontal?6:2;p.list=[{code:355,indent:0,parameters:["ArenaDungeon.toggleDoor('"+src.id+"');"]},{code:0,indent:0,parameters:[]}];});
  map.events[id]=e;ids.push(id);map.data[5*n+e.y*map.width+e.x]=6;
 }
 c.doors.push({...copy(src),eventIds:ids,visualEventId:ids[7],faceRows:[y,y+1],visualAnchor:[x,y+1],footprint:[x-1,y-1,3,3]});
};
