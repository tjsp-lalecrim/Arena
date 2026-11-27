// Bounded lower trench from installed FLOR12, not a blanket wall/chasm rule.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const spec=()=>JSON.parse(fs.readFileSync(path.join(R,'doc/mapas/FANG_FANTASMA_ACESSO_M02.json')));
const west=()=>JSON.parse(fs.readFileSync(path.join(R,'doc/mapas/FANG_OESTE_SUL_M02.json')));
const east=()=>JSON.parse(fs.readFileSync(path.join(R,'doc/mapas/FANG_NORDESTE_LESTE_M02.json')));
const south=()=>JSON.parse(fs.readFileSync(path.join(R,'doc/mapas/FANG_CENTRO_SUL_M02.json')));
const routes=()=>[spec().route,...west().routes,...east().routes,...south().routes];
const world=([x,y])=>[3+3*(99-x),3+3*y];
function masks(plan){
 if(plan.level!==1)return {};
 const result={};
 for(const r of routes()){
 const chain=[r.entryBank,...r.pit.map(p=>p.original),r.exitBank];
 r.pit.forEach(p=>{if(p.flor!==0x0c00||p.map1&&p.map1>>>12!==8&&(p.map1&127)!==((p.map1>>8)&127))throw Error('Fang trench: not an ordinary wall over dry chasm');result[p.original.join()]||=new Set(['1,1']);});
 for(let i=1;i<chain.length;i++){const a=chain[i-1],b=chain[i],dx=b[0]-a[0],dy=b[1]-a[1];if(Math.abs(dx)+Math.abs(dy)!==1)throw Error('Ghost trench disconnected');
  // MIF X is reflected; masks belong to the MV3x3 source-cell projection.
  if(result[a.join()])result[a.join()].add([1-dx,1+dy].join());
  if(result[b.join()])result[b.join()].add([1+dx,1-dy].join());
 }
 }
 return result;
}
function apply(map,plan,atlas,materials){
 const n=map.width*map.height,roof=[],pathTiles=[],pits=new Map();
 for(const r of routes())for(const p of r.pit)pits.set(p.original.join(),p);
 for(const p of pits.values()){const[cx,cy]=world(p.original);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
  const x=cx+dx,y=cy+dy;if(map.data[5*n+y*map.width+x]!==5)continue;pathTiles.push([x,y]);
  if(p.map1&&p.map1>>>12!==8){const family=materials.walls[p.original[1]][99-p.original[0]]||'x';roof.push({x,y,tileId:atlas.wall(family,0,0)});}
 }}
 for(const r of routes())for(const bank of[r.entryBank,r.exitBank]){const[x,y]=world(bank);if(map.data[5*n+y*map.width+x]!==4)throw Error('Fang trench: dry bank missing');map.data[y*map.width+x]=atlas.floor('stair',x,y);}
 const xs=roof.map(t=>t.x),ys=roof.map(t=>t.y);
 map.arenaGhostPassage={id:'fang.1.lower-trench.ghost',pathTiles,overheadTiles:roof,worldBounds:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],roofOpacityInside:48};
}
module.exports={spec,west,east,south,routes,world,masks,apply};
