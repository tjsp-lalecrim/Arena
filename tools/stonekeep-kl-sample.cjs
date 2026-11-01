// Two explicit source-family patches, not expansion of all K/L occurrences.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
module.exports=function(map,tileset,materials,layout){
 const c=JSON.parse(fs.readFileSync(path.join(root,'doc/mapas/STONEKEEP_KL_PILOTO.json'),'utf8'));
 tileset.tilesetNames[7]=c.sheet;const w=map.width,h=map.height;
 for(const p of c.patches){
  for(let row=0;row<3;row++)for(let col=0;col<2;col++)tileset.flags[512+row*8+p.offset+col]=15;
  for(let y=p.bounds[1];y<=p.bounds[3];y++)for(let x=p.bounds[0];x<=p.bounds[2];x++){
   if(map.data[(5*h+y)*w+x]!==1)continue;
   const gx=Math.floor((x-layout.margin)/layout.scale),gy=Math.floor((y-layout.margin)/layout.scale);
   if(materials.wallRows[gy]?.[gx]!==p.family)continue;
   const old=map.data[y*w+x],row=[5,6].includes(old)?1:[13,14].includes(old)?2:0;
   map.data[y*w+x]=512+row*8+p.offset+x%2;
  }
 }
};
