// Visual-only application: source positions and logical gameplay IDs remain fixed.
const fs=require('node:fs'),path=require('node:path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
module.exports=function(name,map){
 const plan=read('doc/mapas/M02_OBJETOS_DUNGEONS.json');
 const id=Number(name.slice(3)),area=id===15?plan.stonekeep:plan.fang.find(p=>p.mapId===id);
 if(!area)throw Error('Dungeon objects: unexpected map '+name);
 for(const spec of area.doors){
  const e=map.events[spec.eventId];if(!e)throw Error('Dungeon objects: missing door '+spec.eventId);
  let changed=0;for(const p of e.pages)if(p.image.characterName){p.image.characterName=spec.file;changed++;}
  if(changed!==2)throw Error('Dungeon objects: closed/open contract '+spec.eventId);
 }
 if(id!==15){
  const tilesets=read('data/Tilesets.json'),tileset=tilesets[map.tilesetId],exports=read('doc/arte/m02-dungeon-objects-v01/exports.json');
  if(map.tilesetId!==7||!tileset.tilesetNames[6].startsWith('Arena_Fang_Mine'))throw Error('Dungeon objects: refuse shared tileset alteration');
  tileset.tilesetNames[7]='Arena_Mine_Objects_V01_D';
  for(let n=512;n<566;n++)tileset.flags[n]=0;
  fs.writeFileSync(path.join(R,'data/Tilesets.json'),'[\n'+tilesets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
  for(const track of area.tracks){
   const indices=exports.tiles[track.shape],n=map.width*map.height;
   for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++){
    const x=track.center[0]+dx-1,y=track.center[1]+dy-1;
    if(map.data[5*n+y*map.width+x]!==4)continue; // Preserve corner masks and chasms.
    const at=n+y*map.width+x;
    if(map.data[at]&&map.data[at]!==indices[dy*3+dx])throw Error('Dungeon objects: occupied track overlay '+track.original);
    map.data[at]=indices[dy*3+dx];
   }
  }
  const template=map.events[1].pages[0];
  for(const b of area.braces.concat(area.decorations||[])){
   if(map.events[b.eventId])throw Error('Dungeon objects: reserved decoration ID occupied '+b.eventId);
   const p=JSON.parse(JSON.stringify(template));p.conditions={actorId:1,actorValid:false,itemId:1,itemValid:false,selfSwitchCh:'A',selfSwitchValid:false,switch1Id:1,switch1Valid:false,switch2Id:1,switch2Valid:false,variableId:1,variableValid:false,variableValue:0};
   Object.assign(p,{priorityType:1,through:true,trigger:0,walkAnime:false,stepAnime:false,directionFix:true,moveType:0,image:{tileId:0,characterName:b.file,characterIndex:0,direction:b.direction,pattern:0},list:[{code:0,indent:0,parameters:[]}]});
   map.events[b.eventId]={id:b.eventId,name:(b.kind==='static-interior-up-exit'?'Face interna da saída / ':'Suporte da mina / ')+b.id,note:b.id,x:b.origin[0],y:b.origin[1],pages:[p]};
  }
 }
 const runtime={schemaVersion:1,maps:[plan.stonekeep,...plan.fang].map(a=>({mapId:a.mapId,sprites:a.doors,decorations:(a.braces||[]).concat(a.decorations||[])}))};
 fs.writeFileSync(path.join(R,'data/ArenaM02DungeonObjects.json'),JSON.stringify(runtime,null,2)+'\n');
 return map;
};
