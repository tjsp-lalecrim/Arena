const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
module.exports=function(map,kind){
 const s=read('doc/mapas/RIHAD_LATERAL_ENTRIES_V01.json'),sets=read('data/Tilesets.json'),t=sets[map.tilesetId],n=map.width*map.height;
 const put=(key,x,y)=>{const a=s.modules[key];for(let dy=0;dy<a.h;dy++)for(let dx=0;dx<a.w;dx++){
  const i=n+(y+dy)*map.width+x+dx;if(map.data[i])throw Error('Lateral entry overlap '+kind+':'+(x+dx)+','+(y+dy));
  const tile=a.tile+dx+dy*8;t.flags[tile]=kind==='urban'||dy===0?16:0;map.data[i]=tile;
 }};
 if(kind==='urban'){
  t.tilesetNames[7]=s.exteriorAtlas;
  for(const d of read('doc/mapas/RIHAD_SINALIZACAO_M02.json').doors.filter(d=>d.side===4||d.side===6)){
   const [x,y]=d.tile,i=n+y*map.width+x;if(map.data[i]!==382)throw Error('Expected generic side entrance at '+x+','+y);
   map.data[i]=0;put(d.side===6?'urbanE':'urbanW',x,y-1);
  }
 }else{
  t.tilesetNames[7]=s.interiorAtlas;
  for(const [x,y] of s.interiors[kind]){
   for(let dx=0;dx<2;dx++){const i=n+y*map.width+x-1+dx;if(map.data[i]!==524+dx)throw Error('Expected lateral frame at '+kind+':'+x+','+y);map.data[i]=0;}
   put((kind==='inn'?'timber':'stone')+(x<map.width/2?'E':'W'),x-1,y-1);
  }
 }
 fs.writeFileSync(path.join(root,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
};
