// Orthogonal visual overlays only. No events, regions, quests or collision rules.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
module.exports=function(map){
 const spec=JSON.parse(fs.readFileSync(path.join(root,'doc/mapas/RIHAD_FACHADAS_V01.json'),'utf8'));
 const sets=JSON.parse(fs.readFileSync(path.join(root,'data/Tilesets.json'),'utf8')),t=sets[map.tilesetId],n=map.width*map.height;
 if(t.tilesetNames[7]&&t.tilesetNames[7]!==spec.atlas)throw Error('Rihad facade D slot occupied');
 t.tilesetNames[7]=spec.atlas;t.flags.fill(16,512,768);
 for(const p of spec.placements){const a=spec.modules[p.module];if(!a)throw Error('Unknown facade module '+p.module);
  for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){const index=3*n+(p.y+y)*map.width+p.x+x;
   if(map.data[index])throw Error('Facade overlay occupied '+p.id);
   map.data[index]=512+(a.ty+y)*8+a.tx+x;
  }
 }
 fs.writeFileSync(path.join(root,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
};
