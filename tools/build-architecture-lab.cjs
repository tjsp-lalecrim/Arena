// Isolated four-facing geometry. Campaign maps/configs/assets are read-only.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(f,v)=>fs.writeFileSync(path.join(R,f),JSON.stringify(v)+'\n');
const city=read('data/Map009.json'),sets=read('data/Tilesets.json');
const infos=read('data/MapInfos.json');for(const[id,name]of[[19,'Arquitetura — quatro orientações (RAM)'],[20,'Rihad — cópia de fachadas (RAM)']]){
 if(infos[id]&&infos[id].name!==name)throw Error('Map ID occupied '+id);
 const f='data/Map'+String(id).padStart(3,'0')+'.json';if(fs.existsSync(path.join(R,f))&&read(f).note!=='ArchitectureLab: isolated RAM; not a campaign destination')throw Error('Map file occupied '+id);
}
if(sets[12]&&sets[12].name!=='Arquitetura RAM — isolada')throw Error('Tileset12 occupied');
sets[12]={...sets[6],id:12,name:'Arquitetura RAM — isolada',flags:sets[6].flags.slice(),tilesetNames:sets[6].tilesetNames.slice()};sets[12].flags[767]=15;
fs.writeFileSync(path.join(R,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
function fresh(id,w,h){const base=read('data/Map001.json');return{...base,width:w,height:h,tilesetId:12,data:Array(w*h*6).fill(0),events:[null],displayName:'',note:'ArchitectureLab: isolated RAM; not a campaign destination',encounterList:[],parallaxName:'',scrollType:0};}
function floor(m,x,y,solid=false){const n=m.width*m.height,i=y*m.width+x;m.data[i]=260+(x&1)+(y&1)*2;m.data[2*n+i]=solid?767:0;m.data[5*n+i]=solid?1:4;}
function fill(m,rect,solid){for(let y=rect[1];y<rect[3];y++)for(let x=rect[0];x<rect[2];x++)floor(m,x,y,solid);}
function door(m,id,rect,axis,width,segments){
 fill(m,rect,false);const cx=Math.floor((rect[0]+rect[2])/2),cy=Math.floor((rect[1]+rect[3])/2),events=[];
 // Existing flat threshold family, NOT the dark walk paving. Extend one tile
 // into each connected floor, without changing regions, masks or colliders.
 const floorRect=rect.slice();if(axis==='x'){floorRect[0]--;floorRect[2]++;}else{floorRect[1]--;floorRect[3]++;}
 const first=256+Object.keys(read('doc/arte/m02-tilesets/rihad.json').floors).indexOf('threshold')*4;
 if(first!==268)throw Error('Architecture threshold family changed; review source atlas');
 for(let y=floorRect[1];y<floorRect[3];y++)for(let x=floorRect[0];x<floorRect[2];x++){
  const i=y*m.width+x;if(m.data[5*m.width*m.height+i]!==4)throw Error('Threshold apron outside connected floor '+id);
  m.data[i]=first+(x&1)+(y&1)*2;
 }
 for(let y=rect[1];y<rect[3];y++)for(let x=rect[0];x<rect[2];x++){const eventId=m.events.length;events.push(eventId);
  m.events.push({id:eventId,name:'Architecture door / '+id,note:'ArchitectureLab:'+id,x,y,pages:[{conditions:{actorId:1,actorValid:false,itemId:1,itemValid:false,selfSwitchCh:'A',selfSwitchValid:false,switch1Id:1,switch1Valid:false,switch2Id:1,switch2Valid:false,variableId:1,variableValid:false,variableValue:0},directionFix:true,image:{characterIndex:0,characterName:'',direction:2,pattern:1,tileId:0},list:[{code:355,indent:0,parameters:['ArenaArchitectureLab.toggle('+JSON.stringify(id)+');']},{code:0,indent:0,parameters:[]}],moveFrequency:3,moveRoute:{list:[{code:0,parameters:[]}],repeat:true,skippable:false,wait:false},moveSpeed:3,moveType:0,priorityType:1,stepAnime:false,through:false,trigger:0,walkAnime:false}]});
 }
 return{id,rect,axis,width,events,segments,floorRect};
}
const m=fresh(19,49,49);for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)floor(m,x,y,x<1||y<1||x>=48||y>=48);
const rooms=[{id:'main',rect:[7,7,23,21]},{id:'annex',rect:[28,7,40,21]}];
for(const r of rooms){const[l,t,x,y]=r.rect;fill(m,[l-3,t-3,x+3,y+3],true);}for(const r of rooms)fill(m,r.rect,false);
const house={id:'exterior',rect:[8,31,28,45]};fill(m,house.rect,true);fill(m,[11,34,25,42],false);
const doors=[
 door(m,'room.n',[14,4,17,7],'y',3,[{surface:'main',side:'N',center:15.5}]),
 door(m,'room.s',[14,21,17,24],'y',3,[{surface:'main',side:'S',center:15.5}]),
 door(m,'room.w',[4,13,7,16],'x',3,[{surface:'main',side:'W',center:14.5}]),
 door(m,'room.e',[23,13,28,16],'x',3,[{surface:'main',side:'E',center:14.5},{surface:'annex',side:'W',center:14.5,frameOnly:true}]),
 door(m,'house.s',[16,42,19,45],'y',3,[{surface:'exterior',side:'S',center:17.5}]),
 door(m,'house.e',[25,36,28,39],'x',3,[{surface:'exterior',side:'E',center:37.5}])];
m.arenaArchitecture={rooms,buildings:[house],doors};write('data/Map019.json',m);
// Exact terrain crop around both rectangular source blocks. No original events.
const crop=[289,10,348,33],c=fresh(20,crop[2]-crop[0],crop[3]-crop[1]);
for(let z=0;z<6;z++)for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)c.data[z*c.width*c.height+y*c.width+x]=city.data[z*city.width*city.height+(y+crop[1])*city.width+x+crop[0]];
const buildings=[{id:'copy.west',rect:[293-289,14-10,308-289,29-10]},{id:'copy.east',rect:[323-289,14-10,344-289,29-10]}];
// Inspection pockets/door passages are technical adaptations INSIDE solid source volumes.
fill(c,[13,9,16,14],false);fill(c,[37,9,40,14],false);
const copyDoors=[door(c,'copy.eastFace',[16,11,19,12],'x',1,[{surface:'copy.west',side:'E',center:11.5}]),door(c,'copy.westFace',[34,11,37,12],'x',1,[{surface:'copy.east',side:'W',center:11.5}])];
c.arenaArchitecture={rooms:[],buildings,doors:copyDoors,source:{mapId:9,crop,logicalDoors:[[307,21],[323,21]],adaptation:'Technical floor pockets/operable leaves only in copied solids; original streets, events and campaign remain untouched.'}};write('data/Map020.json',c);
for(const[id,name]of[[19,'Arquitetura — quatro orientações (RAM)'],[20,'Rihad — cópia de fachadas (RAM)']]){infos[id]={id,name,order:id,parentId:0,expanded:true,scrollX:0,scrollY:0};}fs.writeFileSync(path.join(R,'data/MapInfos.json'),'[\n'+infos.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
write('data/ArenaArchitectureLab.json',{version:1,mapIds:[19,20],entry:{id:'technical.architecture.arrival',mapId:19,x:15,y:8,direction:8},materials:{wallAtlas:'Arena_Rihad_Exterior_V01_C',upper:275,lower:278,cap:272,floor:260,threshold:268,door:'!$Arena_Doors_M14_R03',urbanAtlas:'Arena_Rihad_Lateral_Exterior_V01_D'},points:[{name:'Interior · norte',mapId:19,x:15,y:8,direction:8},{name:'Interior · sul',mapId:19,x:15,y:19,direction:2},{name:'Interior · leste / parede compartilhada',mapId:19,x:21,y:14,direction:6},{name:'Interior · oeste',mapId:19,x:8,y:14,direction:4},{name:'Exterior · edifício',mapId:19,x:18,y:46,direction:8},{name:'Rihad · fachada leste original(307,21)',mapId:20,x:20,y:11,direction:4},{name:'Rihad · fachada oeste original(323,21)',mapId:20,x:33,y:11,direction:6}]});
console.log('Only Map019/020, technical configuration, MapInfos19/20 and isolated Tileset12 generated.');
