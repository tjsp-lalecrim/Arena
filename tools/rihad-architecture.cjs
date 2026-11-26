// Production sections, constrained to existing solid volume. No topology edits.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f)));
module.exports=function(map){
 const n=map.width*map.height,doors=read('doc/mapas/RIHAD_SINALIZACAO_M02.json').doors;
 const solid=(x,y)=>x>=0&&y>=0&&x<map.width&&y<map.height&&map.data[5*n+y*map.width+x]===1;
 const footprint=(x,y,s)=>s===6?[x-2,y-1,x+1,y+2]:s===4?[x,y-1,x+3,y+2]:s===2?[x-1,y-2,x+2,y+1]:[x-1,y,x+2,y+3];
 map.arenaArchitectureEntries=[];map.arenaArchitectureDeferred=[];const occupied=new Set();
 for(const d of doors){const[x,y]=d.tile,r=footprint(x,y,d.side),s=map.arenaEntranceSections.find(s=>s.x===x&&s.y===y);
  if(!s)throw Error('Architecture: entrance binding missing '+d.tile);
  const cells=[];for(let yy=r[1];yy<r[3];yy++)for(let xx=r[0];xx<r[2];xx++)cells.push([xx,yy]);
  if(cells.some(([x,y])=>!solid(x,y)||occupied.has(x+','+y))){map.arenaArchitectureDeferred.push({id:s.id,x,y,side:d.side,reason:'Insufficient independent solid3x3 volume; keep existing section, no street/plan changes.'});continue;}
  cells.forEach(p=>occupied.add(p.join()));
  // floorRect is the single horizontal master; never a slice of wall UVs.
  const horizontal=d.side===4||d.side===6,center=horizontal?y:x;
  const floor=horizontal?[r[0],center,r[2],center+1]:[center,r[1],center+1,r[3]];
  map.arenaArchitectureEntries.push({id:s.id,x,y,side:d.side,approach:d.approach,rect:r,floorRect:floor,
   wallAtlas:s.wallAtlas,upper:s.upper,lower:s.lower,cap:s.upper-3,threshold:268,doorAtlas:s.doorAtlas,module:s.module});
 }
 // The palace access is an open city-boundary corridor, not one of the380
 // solid facades. Adding3x3 mass/jambs there would invent/obstruct the plan.
 map.arenaArchitectureDeferred.push({id:'rihad.court.gate',x:360,y:384,reason:'Open3-wide boundary corridor: no independent3x3 wall mass. Existing functional gate preserved; needs a specific freestanding/shared-boundary design.'});
 map.arenaArchitectureRevision=1;
};
