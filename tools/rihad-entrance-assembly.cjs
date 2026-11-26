// Local architectural sections, using existing wall/door pixels. No new art.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
module.exports=function(map){
 const spec=JSON.parse(fs.readFileSync(path.join(root,'doc/arte/m02-tilesets/rihad.json')));
 const doors=JSON.parse(fs.readFileSync(path.join(root,'doc/mapas/RIHAD_SINALIZACAO_M02.json'))).doors;
 const m=JSON.parse(fs.readFileSync(path.join(root,'doc/mapas/RIHAD_LATERAL_ENTRIES_V01.json'))),n=map.width*map.height;
 map.arenaEntranceSections=[];
 for(const d of doors){
  const[x,y]=d.tile,top=d.side===8?y:y-1;
  for(let yy=top;yy<top+2;yy++)if(map.data[5*n+yy*map.width+x]!==1)throw Error('Entrance section outside existing wall '+x+','+y);
  // Map regions/physical geometry remain identical. Remove only the old leaf,
  // lintel or back-strip layer, never the underlying solid wall.
  for(const yy of d.side===2?[y-1,y]:[y])map.data[n+yy*map.width+x]=0;
  const tile=map.data[y*map.width+x],start=256+Object.keys(spec.floors).length*4;
  const family=Math.floor((tile-start)/9);
  if(family<0||family>=Object.keys(spec.walls).length)throw Error('Entrance without wall material '+x+','+y);
  const left=d.side===6?x-2:d.side===4?x:x-1;
  const mask=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<3;dx++)if(map.data[5*n+(top+dy)*map.width+left+dx]===1)mask.push([dx,dy]);
  map.arenaEntranceSections.push({id:'rihad.entry.'+x+'.'+y,x,y,left,top,mask,side:d.side,approach:d.approach,
   wallAtlas:spec.sheet,upper:start+family*9+3,lower:start+family*9+6,
   doorAtlas:m.exteriorAtlas,module:m.modules[d.side===4?'urbanW':'urbanE'],cutaway:d.side!==2});
 }
 // Urban side leaves are now part of complete sections; internal fittings stay independent.
 map.arenaLateralFittings=[];
 map.arenaEntranceRevision=1;
};
