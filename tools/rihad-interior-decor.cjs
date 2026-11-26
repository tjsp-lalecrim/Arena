// Independent overlays; explicit shared bases distinguish dressing from furniture.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
module.exports=function(map,kind){
 const s=JSON.parse(fs.readFileSync(path.join(root,'doc/mapas/RIHAD_INTERIOR_DECOR_V01.json'),'utf8')),n=map.width*map.height;
 const file=path.join(root,'data/Tilesets.json'),sets=JSON.parse(fs.readFileSync(file,'utf8')),t=sets[map.tilesetId];
 t.tilesetNames[7]=s.atlas;t.flags.fill(16,640,768);
 for(const p of s.placements.filter(p=>p.area===kind)){
  const a=s.modules[p.module];
  require('./rihad-decor-contracts.cjs').add(map,p.id,'dressing',p.module,p.x,p.y);
  for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){
   const i=3*n+(p.y+y)*map.width+p.x+x;if(map.data[i])throw Error('Interior decor overlap '+p.id);
   map.data[i]=640+(a.ty+y)*8+a.tx+x;
  }
 }
 fs.writeFileSync(file,'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
};
