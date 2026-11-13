const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
module.exports=function(map,c){
 const s=JSON.parse(fs.readFileSync(path.join(R,'doc/mapas/STONEKEEP_ACESSOS_A2_B2_M02.json'),'utf8'));
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('Stonekeep access: source mismatch');
 s.lockedDoors.forEach(d=>require('./stonekeep-door-components.cjs')(map,c,d));
 c.access={source:'doc/mapas/STONEKEEP_ACESSOS_A2_B2_M02.json',lockedDoorIds:s.lockedDoors.map(d=>d.id),force:s.force};
 c.coverage.implementedDoors=c.doors.length;
 c.context.coverage=c.encounters.entries.length+' encontros ·'+c.doors.length+' portas · fechaduras comuns adaptadas';
 s.points.slice(0,3).forEach(p=>{const existing=c.points.find(v=>v.name===p.name);if(existing)existing.position=p.position.slice();else c.points.push(p);});
};
