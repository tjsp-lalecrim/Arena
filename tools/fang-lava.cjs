// Visual lava only: every changed tile keeps the exact old passage mask and region.
const fs=require('node:fs'),path=require('node:path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
module.exports=function(map,atlas){
 const c=read('doc/mapas/FANG_LAVA_M02.json'),materials=read('doc/mapas/FANG_MATERIAIS_M02.json').levels[1];
 if(map.tilesetId!==c.baseTilesetId||materials.crop.join()!==c.crop.join()||!atlas)throw Error('Fang lava: map/atlas/crop mismatch');
 const sets=read('data/Tilesets.json'),base=sets[c.baseTilesetId];
 if(sets[c.tilesetId]&&sets[c.tilesetId].tilesetNames[0]!==c.a1)throw Error('Fang lava: tileset ID occupied');
 const set=JSON.parse(JSON.stringify(base));set.id=c.tilesetId;set.name='Fang Lair — nível2/lava V01';set.tilesetNames[0]=c.a1;
 for(let t=c.tileBase;t<c.tileBase+48;t++)set.flags[t]=15; // No damage, boat, star or passable-water flags.
 sets[c.tilesetId]=set;
 const w=map.width,h=map.height,n=w*h,keys=new Set();
 for(const [x,y]of c.openCells){const mx=3+3*(c.crop[1]-x),my=3+3*(y-c.crop[2]);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
  const at=(my+dy)*w+mx+dx;
  if(map.data[5*n+at]!==1||(base.flags[map.data[at]]&15)!==15)throw Error('Fang lava: refuse opening old terrain at '+x+','+y);
  keys.add(at);
 }}
 const lava=(x,y)=>x>=0&&x<w&&y>=0&&y<h&&keys.has(y*w+x);
 const solid=(x,y)=>x<0||x>=w||y<0||y>=h||map.data[5*n+y*w+x]===1&&!lava(x,y);
 const source=fs.readFileSync(path.join(R,'js/rpg_core.js'),'utf8').split('Tilemap.FLOOR_AUTOTILE_TABLE = ')[1].split(';')[0];
 const table=JSON.parse(source),inside=[[2,4],[1,4],[2,3],[1,3]],concave=[[2,0],[3,0],[2,1],[3,1]];
 const quarters=[[-1,-1],[1,-1],[-1,1],[1,1]];
 for(const index of keys){
  const x=index%w,y=Math.floor(index/w),q=quarters.map(([dx,dy],i)=>{
   const a=lava(x+dx,y),b=lava(x,y+dy);
   if(a&&b)return lava(x+dx,y+dy)?inside[i]:concave[i];
   return [a?inside[i][0]:(dx<0?0:3),b?inside[i][1]:(dy<0?2:5)];
  });
  const shape=table.findIndex(v=>JSON.stringify(v)===JSON.stringify(q));if(shape<0)throw Error('Fang lava: unsupported shore shape');map.data[index]=c.tileBase+shape;
 }
 // Existing rock faces now border a visible lower pool; collision still solid.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const at=y*w+x;if(keys.has(at)||map.data[5*n+at]!==1)continue;
  if(!lava(x,y+1)&&!lava(x,y+2)&&!lava(x-1,y)&&!lava(x+1,y))continue;
  const height=!solid(x,y+1)?2:!solid(x,y+2)?1:0,edge=!solid(x-1,y)?1:!solid(x+1,y)?2:0;
  const family=materials.walls[Math.floor((y-2)/3)]?.[Math.floor((x-2)/3)]||'x';
  const tile=atlas.wall(family,height,edge);if((base.flags[tile]&15)!==15)throw Error('Fang lava: non-solid bank');map.data[at]=tile;
 }
 map.tilesetId=c.tilesetId;
 fs.writeFileSync(path.join(R,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
 return keys.size;
};
