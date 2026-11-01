// Authored arrival sample. No artwork generation or changes to Map008.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
const width=21,height=15,data=Array(width*height*6).fill(0);
const at=(x,y,z,t)=>data[(z*height+y)*width+x]=t;
const solid=(x,y)=>x<2||x>18||y<4||y>12||(x<=5&&y<=7)||(x>=14&&y<=6);
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 let tile=1+x%2+(y%2)*8;
 if(solid(x,y)){
  // One cap row, two face rows inside solid cells; never project over paths.
  tile=!solid(x,y+1)?13+x%2:!solid(x,y+2)?5+x%2:4;
 }
 at(x,y,0,tile);at(x,y,5,solid(x,y)?1:4);
}
// Existing independent low platform: visual footprint3x3; no new collision.
for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)at(14+dx,8+dy,1,68+dx+dy*8);
const base=read('data/Map008.json').events[241].pages[0];
function event(id,name,x,y,script,characterName=''){
 const p=JSON.parse(JSON.stringify(base));p.image.characterName=characterName;
 p.through=!characterName;p.priorityType=characterName?1:0;p.walkAnime=!!characterName;p.directionFix=true;
 p.list=[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}];
 return {id,name,note:'M02-03A: provisório, sem avanço artificial de quest',x,y,pages:[p]};
}
const map={...read('data/Map001.json'),width,height,data,tilesetId:4,
 displayName:'',note:'M02-03A: Rihad, esplanada adaptada; materiais/NPC provisórios reutilizados. Nome no cabeçalho próprio, sem duplicar janela nativa. Sem planta original confirmada.',
 events:[null,event(1,'Informante — representação provisória',9,7,'ArenaRihad.inform(this);','$Arena_redguard_male_walk_r02'),
 event(2,'Repouso autorizado — Rihad',15,10,"ArenaRecovery.usePoint('MQ02.rihad.rest',this);"),
 event(3,'Chegada de estrada — rihad.arrival',10,12,'ArenaRihad.arrivalNotice(this);')],
 encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false};
write('data/Map009.json',map);
const infos=read('data/MapInfos.json');infos[9]={id:9,expanded:true,name:'M02-03 Rihad — chegada (amostra)',order:9,parentId:0,scrollX:0,scrollY:0};fs.writeFileSync(path.join(root,'data/MapInfos.json'),'[\n'+infos.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
const campaignPath=path.join(root,'data/ArenaCampaign.json');
fs.writeFileSync(campaignPath,fs.readFileSync(campaignPath,'utf8').replace(/("id"\s*:\s*"rihad"\s*,\s*"questId"\s*:\s*"MQ02"\s*,\s*"mapId"\s*:\s*)(null|\d+)/,'$19'));
const recovery=read('data/ArenaRecovery.json');const point={id:'MQ02.rihad.rest',mapId:9,eventId:2,x:15,y:10,technical:false,authorizedRefuge:true,source:'MQ02_ESPECIFICACAO: repouso autorizado na chegada; posição e plataforma são adaptação provisória.'};
recovery.restPoints=recovery.restPoints.filter(p=>p.id!==point.id).concat(point);write('data/ArenaRecovery.json',recovery);
write('data/ArenaRihad.json',{schemaVersion:1,areaId:'rihad',arrival:{id:'rihad.arrival',mapId:9,x:10,y:11,direction:8},informantEventId:1,restPointId:point.id});
console.log('Map009, vínculo Rihad e único repouso recompostos; demais áreas/pontos preservados.');
