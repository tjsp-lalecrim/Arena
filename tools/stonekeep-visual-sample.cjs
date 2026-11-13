// Small material application only. Geometry/regions/events remain the base map.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
module.exports=function(map){
 const c=read('doc/mapas/STONEKEEP_VISUAL_V01.json'),sets=read('data/Tilesets.json');
 const layout=read('doc/mapas/STONEKEEP_AMOSTRA_M02.json'),materials=read(c.materialAssignment);
 if(materials.originalSha256!==layout.originalSha256||['wallRows','floorRows'].some(k=>materials[k].length!==layout.rows.length||materials[k].some(r=>r.length!==layout.rows[0].length)))throw Error('Stonekeep: atribuição de materiais não corresponde ao recorte.');
 const t=JSON.parse(JSON.stringify(sets[c.baseTilesetId]));
 if(sets[c.tilesetId]&&sets[c.tilesetId].name!=='Stonekeep — amostra visual V01')throw Error('Stonekeep: ID de tileset ocupado');
 t.id=c.tilesetId;t.name='Stonekeep — amostra visual V01';t.tilesetNames[6]=c.sheet;
 const w=map.width,h=map.height,n=w*h,get=(x,y,z=0)=>map.data[z*n+y*w+x],put=(x,y,z,v)=>map.data[z*n+y*w+x]=v;
 const inside=(x,y)=>x>=c.bounds[0]&&x<=c.bounds[2]&&y>=c.bounds[1]&&y<=c.bounds[3];
 const region=(x,y)=>x<0||y<0||x>=w||y>=h?1:get(x,y,5);
 for(let i=256;i<384;i++)t.flags[i]=0;
 for(const id of [260,261,262,263,268,269,270,271,276,277,278,279])t.flags[id]=15;
 for(let y=c.bounds[1];y<=c.bounds[3];y++)for(let x=c.bounds[0];x<=c.bounds[2];x++){
  const r=region(x,y),old=get(x,y);
  const gx=Math.floor((x-layout.margin)/layout.scale),gy=Math.floor((y-layout.margin)/layout.scale);
  if(r===1){
   const material=materials.wallRows[gy]?.[gx];
   if(!['A','B','D'].includes(material))continue;
   const offset=material==='A'?4:6;
   let row=0;if([5,6].includes(old))row=1;else if([13,14].includes(old))row=2;
   put(x,y,0,256+row*8+offset+x%2);
  }else if(r===4){
   const material=materials.floorRows[gy]?.[gx];
   if(['M','S','R'].includes(material)){
    const base=material==='S'?288:256;
    put(x,y,0,base+(y%4)*8+x%4);
   }
   let mask=0;for(const [dx,dy,bit]of [[0,-1,1],[1,0,2],[0,1,4],[-1,0,8]])if(region(x+dx,y+dy)===5&&inside(x+dx,y+dy))mask|=bit;
   if(mask)put(x,y,1,320+mask);
  }
 }
 require('./stonekeep-kl-sample.cjs')(map,t,materials,layout);
 sets[c.tilesetId]=t;fs.writeFileSync(path.join(root,'data/Tilesets.json'),'[\n'+sets.map(x=>JSON.stringify(x)).join(',\n')+'\n]\n');
 map.tilesetId=c.tilesetId;
 return map;
};
