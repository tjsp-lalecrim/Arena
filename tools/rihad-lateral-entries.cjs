const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
module.exports=function(map,kind){
 const s=read('doc/mapas/RIHAD_LATERAL_ENTRIES_V01.json'),sets=read('data/Tilesets.json'),t=sets[map.tilesetId],n=map.width*map.height;
 map.arenaLateralFittings=[];
 // Keep the atlas's historical flags as well; assembly sprites have no collider.
 for(const [key,a]of Object.entries(s.modules))if(key.startsWith(kind==='urban'?'urban':kind==='inn'?'timber':'stone'))
  for(let dy=0;dy<a.h;dy++)for(let dx=0;dx<a.w;dx++)t.flags[a.tile+dx+dy*8]=kind==='urban'||dy===0?16:0;
 if(kind==='urban'){
  t.tilesetNames[7]=s.exteriorAtlas;
  for(const d of read('doc/mapas/RIHAD_SINALIZACAO_M02.json').doors.filter(d=>d.side===4||d.side===6)){
   const [x,y]=d.tile,i=n+y*map.width+x;if(map.data[i]!==382)throw Error('Expected generic side entrance at '+x+','+y);
   map.data[i]=0;
   // Flush with the accessible edge of the solid wall, not centered in its mass.
   map.arenaLateralFittings.push({id:'urban.'+x+'.'+y,atlas:s.exteriorAtlas,module:s.modules[d.side===6?'urbanE':'urbanW'],x,y,offsetX:d.side===6?6:-6,split:false});
  }
 }else{
  t.tilesetNames[7]=s.interiorAtlas;
  for(const [x,y] of s.interiors[kind]){
   for(let dx=0;dx<2;dx++){const i=n+y*map.width+x-1+dx;if(map.data[i]!==524+dx)throw Error('Expected lateral frame at '+kind+':'+x+','+y);map.data[i]=0;}
   // The one-tile walk lane lies BETWEEN the jambs. V01 put the lower jamb
   // on that lane and centered the 2-wide frame half a tile to its west.
   map.arenaLateralFittings.push({id:kind+'.'+x+'.'+y,atlas:s.interiorAtlas,module:s.modules[(kind==='inn'?'timber':'stone')+(x<map.width/2?'E':'W')],x,y,offsetX:0,split:true});
  }
 }
 fs.writeFileSync(path.join(root,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
};
