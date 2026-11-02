// Reuse the approved nine-part Map015 door component; no new runtime lock mechanism.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_A2_PORTAS_CENTRO_M02.json');
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('A2 central doors: source mismatch');
 s.doors.forEach(src=>require('./stonekeep-door-components.cjs')(map,c,src));
 c.a2CentralDoors={source:'doc/mapas/STONEKEEP_A2_PORTAS_CENTRO_M02.json',doorIds:s.doors.map(d=>d.id),deferredLocks:copy(s.pendingLocked)};
 c.coverage.implementedDoors=c.doors.length;c.points.push(...copy(s.points));
};
