// Source-backed placement; Rihad physical bases are compiled separately.
const fs=require('node:fs'),path=require('node:path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
const spec=()=>read('doc/mapas/M02_CENARIO_CONFIRMADO_V01.json');
function writeConfig(){const s=spec();fs.writeFileSync(path.join(R,'data/ArenaScenery.json'),JSON.stringify({schemaVersion:1,urban:s.urban,questSprites:s.questSprites.concat([{mapId:13,eventId:5,kind:1,activationSwitch:'B',collectedSwitch:'A'},{mapId:13,eventId:6,kind:1,activationSwitch:'B',collectedSwitch:'A'}])},null,2)+'\n');}
function urban(map){
 const names=['NWELL1.IMG','NWELL2.IMG','CACTUS1.IMG','CACTUS2.IMG','CACTUS3.IMG','PALM1.IMG','PALM2.IMG','PALM3.IMG'];
 for(const v of spec().urban){
  if(map.events[v.eventId]&&map.events[v.eventId].note!=='ArenaScenery:'+v.id)throw Error('Scenery ID occupied '+v.eventId);
  const page=JSON.parse(JSON.stringify(map.events[1].pages[0]));
  Object.assign(page,{priorityType:1,through:true,trigger:0,moveType:0,directionFix:true,walkAnime:false,stepAnime:false,
   image:{characterName:v.resource==='NFOUNT1D.DFA'?'!$Arena_Rihad_Fountain_Reuse_V01':'!Arena_Rihad_Props_V01',characterIndex:Math.max(0,names.indexOf(v.resource)),tileId:0,direction:2,pattern:1},list:[{code:0,indent:0,parameters:[]}]});
  map.events[v.eventId]={id:v.eventId,name:v.resource+' / '+v.id,note:'ArenaScenery:'+v.id,x:v.position[0],y:v.position[1],pages:[page]};
  require('./rihad-decor-contracts.cjs').add(map,v.id,'urban',v.resource,v.position[0],v.position[1]);
 }
 writeConfig();
}
function stonekeep(map){
 const s=spec(),n=map.width*map.height,sets=read('data/Tilesets.json'),t=sets[map.tilesetId];
 if(t.tilesetNames[8]&&t.tilesetNames[8]!=='Arena_M02_Scenery_V01_E')throw Error('Stonekeep E occupied');
 t.tilesetNames[8]='Arena_M02_Scenery_V01_E';t.flags.fill(16,768,1024);
 for(let y=0;y<3;y++)for(let x=0;x<3;x++)t.flags[800+y*8+x]=0;
 const reg=(x,y)=>x<0||y<0||x>=map.width||y>=map.height?1:map.data[5*n+y*map.width+x];
 let panels=0,parts=0;const applied=[];
 for(const p of s.panels){const [cx,cy]=p.position;let placed=false;
  for(let dx=-1;dx<=1;dx++)for(let y=cy-1;y<=cy+1;y++){
   if(reg(cx+dx,y)!==1||![4,5,6].includes(reg(cx+dx,y+1)))continue;
   for(let row=0;row<2;row++){const yy=y-1+row,index=yy*map.width+cx+dx;
    if(reg(cx+dx,yy)!==1||map.data[2*n+index])continue;
    map.data[2*n+index]=768+(p.family==='cask'?4:0)+(dx+1)+row*8;parts++;placed=true;
   }
  }
  if(placed){panels++;applied.push(p);}
 }
 const originals=new Set(s.rugs.map(p=>p.join(','))),rug=(x,y)=>{if(reg(x,y)!==4)return false;const ox=89-Math.floor((x-2)/3),oy=Math.floor((y-2)/3);return originals.has(ox+','+oy);};
 let rugs=0;for(let y=2;y<map.height-2;y++)for(let x=2;x<map.width-2;x++)if(rug(x,y)){
  const cx=!rug(x-1,y)?0:!rug(x+1,y)?2:1,cy=!rug(x,y-1)?0:!rug(x,y+1)?2:1;
  map.data[y*map.width+x]=800+cy*8+cx;rugs++;
 }
 fs.writeFileSync(path.join(R,'data/Tilesets.json'),'[\n'+sets.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
 fs.writeFileSync(path.join(R,'doc/arte/m02-scenery-v01/application.json'),JSON.stringify({panels,parts,rugTiles:rugs,appliedPanels:applied,urban:spec().urban.length,limits:'Only source-backed south-visible wall faces; covered/hidden faces remain represented by their existing material, not invented wall geometry.'},null,2)+'\n');
 writeConfig();
}
module.exports={urban,stonekeep};
