// Explicit physical bases, independent from image rectangles. No new artwork.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const spec=()=>read('doc/mapas/RIHAD_DECOR_CONTRATOS.json');
function add(map,id,category,type,x,y){
 const s=spec(),profile=s[category][type],p=s.profiles[profile];if(!p)throw Error('Missing decor profile '+category+'/'+type);
 if(!map.arenaDecor)map.arenaDecor=[];
 if(map.arenaDecor.some(v=>v.id===id))throw Error('Duplicate decor '+id);
 map.arenaDecor.push({id,category,type,profile,x,y,cells:p.cells.map(([dx,dy])=>[x+dx,y+dy])});
}
function sign(map,p,atlas,module){
 if(module.w!==1||module.h!==1)throw Error('Sign requires an explicit 1x1 module: '+p.id);
 const s=spec(),doors=read('doc/mapas/RIHAD_SINALIZACAO_M02.json').doors;
 const candidates=doors.filter(d=>d.side===2?d.tile[1]===p.y&&Math.abs(d.tile[0]-p.x)===1:
  (d.side===4||d.side===6)&&d.tile[0]===p.x&&d.tile[1]+1===p.y);
 if(candidates.length!==1)throw Error('Ambiguous sign wall binding '+p.id);
 const d=candidates[0];if(!map.arenaDecorSigns)map.arenaDecorSigns=[];
 map.arenaDecorSigns.push({id:p.id,x:p.x,y:p.y,side:d.side,door:d.tile,approach:d.approach,
  atlas,module,height:d.side===2?s.signs.heightPixels:s.signs.sideHeightPixels,inset:s.signs.bracketInsetPixels});
}
function finalize(map){
 const s=spec(),n=map.width*map.height,sets=read('data/Tilesets.json'),t=sets[map.tilesetId],cells=new Set();
 for(const p of map.arenaDecor||[])for(const[x,y]of p.cells){
  if(x<0||y<0||x>=map.width||y>=map.height)throw Error('Decor base out of bounds '+p.id);
  const i=2*n+y*map.width+x;if(map.data[i]&&map.data[i]!==s.collisionTile)throw Error('Decor mask layer occupied '+p.id);
  map.data[i]=s.collisionTile;cells.add(x+','+y);
 }
 t.flags[s.collisionTile]=15;
 map.arenaDecorBlocked=[...cells].map(k=>k.split(',').map(Number));
 map.arenaDecorRevision=1;
 fs.writeFileSync(path.join(root,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
}
module.exports={add,sign,finalize};
