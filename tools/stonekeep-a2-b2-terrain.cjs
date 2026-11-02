// Only source-confirmed connected A2/B2 block; no height flattening or new artwork.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A2_B2_M02.json'),n=map.width*map.height,at=(x,y,z)=>map.data[z*n+y*map.width+x];
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('A2/B2 source mismatch');
 for(const cell of s.materialCells){const [u,y]=cell.view,raw=cell.mapRaw;
  for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
   const x=2+3*u+dx,yy=2+3*y+dy,r=at(x,yy,5),old=at(x,yy,0);
   // The already-approved crop interior remains untouched, even where it overlaps B2.
   if(x>=26&&x<=163&&yy<=100)continue;
   if(r===4&&[2,3,6,8].includes(cell.floorRaw>>8)){
    const base=(cell.floorRaw>>8)===6?288:256;map.data[yy*map.width+x]=base+(yy%4)*8+x%4;
    let mask=0;for(const [dx,dy,bit]of [[0,-1,1],[1,0,2],[0,1,4],[-1,0,8]])if(at(x+dx,yy+dy,5)===5)mask|=bit;
    if(mask)map.data[n+yy*map.width+x]=320+mask;
   }
   if(r===1){const row=[5,6].includes(old)?1:[13,14].includes(old)?2:0;
    if([0x2626,0x2727,0x2828].includes(raw))map.data[yy*map.width+x]=256+row*8+6+x%2;
    if([0x3838,0x3939].includes(raw))map.data[yy*map.width+x]=512+row*8+x%2;
    if([0x3b3b,0x3c3c].includes(raw))map.data[yy*map.width+x]=512+row*8+2+x%2;
   }
  }
 }
 s.doors.forEach(d=>require('./stonekeep-door-components.cjs')(map,c,d));
 c.a2b2={source:'doc/mapas/STONEKEEP_A2_B2_M02.json',doorIds:s.doors.map(d=>d.id),deferredDoors:copy(s.deferredDoors),deferredEnemies:copy(s.deferredEnemies),heightChanges:false};
 c.coverage.implementedDoors=c.doors.length;c.points.push(...copy(s.points));
};
