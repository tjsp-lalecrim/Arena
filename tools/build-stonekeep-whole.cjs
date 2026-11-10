// Production geometry candidate. Map014 is a versioned geometry input, never its load events.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v)),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
function build(){
 const base=read('data/Map014.json'),sample=read('data/Map012.json'),proof=read('data/ArenaStonekeepRuntimeProof.json'),old=read('data/ArenaStonekeep.json'),campaign=read('data/ArenaCampaign.json');
 if(base.width!==274||base.height!==274||base.data.length!==274*274*6||sample.width!==142||sample.height!==103||proof.sourceSha256!=='4eb604e21b1b73c3fa85c1a544588d6a847a9cff496c4efab9f1b313b8b7d45b')throw Error('Stonekeep integral: geometria de origem não corresponde ao contrato revisado.');
 const map={...copy(base),tilesetId:sample.tilesetId,events:copy(sample.events),note:'Stonekeep integral: base de produção em avaliação isolada. Sem carga sintética. Portas/diagonais/alturas ainda com cobertura parcial.',displayName:''},delta=24,terrainAdjustments=[];
 // Preserve every approved tile/layer of the playable crop, except its artificial outer border.
 for(let y=2;y<sample.height-2;y++)for(let x=2;x<sample.width-2;x++){
  const a=sample.data[(5*sample.height+y)*sample.width+x],b=map.data[(5*274+y)*274+x+delta];
  if(a!==b)terrainAdjustments.push({old:[x,y],whole:[x+delta,y],proofRegion:b,preservedRegion:a});
  for(let z=0;z<6;z++)map.data[(z*274+y)*274+x+delta]=sample.data[(z*sample.height+y)*sample.width+x];
 }
 const mapping=map.events.filter(Boolean).map(e=>{const before=[e.x,e.y];e.x+=delta;return{eventId:e.id,name:e.name,old:before,whole:[e.x,e.y],logicalId:e.note.startsWith('ArenaEncounter:')?e.note.slice(15):e.id===old.sourceEventId?old.sourceId:'stonekeep.exit'};});
 const context=copy(old);context.mapId=15;context.entry={...context.entry,mapId:15,x:context.entry.x+delta};
 for(const key of ['source','exit','breach','shore','island'])context[key][0]+=delta;
 context.caption='Stonekeep inteira · base funcional em avaliação';context.coverage='20 encontros transferidos · demais encontros/portas pendentes';
 const encounters=copy(campaign.areas.find(a=>a.id==='stonekeep').encounters);encounters.mapId=15;encounters.entries.forEach(e=>e.origin[0]+=delta);
 if(encounters.entries.length!==20||map.events.filter(Boolean).length!==22||new Set(encounters.entries.map(e=>e.id)).size!==20)throw Error('Stonekeep integral: conteúdo funcional mudou; revisar correspondência.');
 for(const e of encounters.entries)if(map.events[e.eventId].note!=='ArenaEncounter:'+e.id||map.events[e.eventId].x!==e.origin[0]||map.events[e.eventId].y!==e.origin[1]||map.data[(5*274+e.origin[1])*274+e.origin[0]]!==4)throw Error('Stonekeep integral: vínculo/piso inválido '+e.id);
 const config={version:1,mapId:15,areaId:'stonekeep',context,encounters,coordinates:{oldMapId:12,delta:[delta,0],original:'zero-based MIF; wholeX=3+3*(89-originalX), wholeY=3+3*originalY'},mapping,geometry:{input:'Map014',sourceSha256:proof.sourceSha256,inputDataSha256:hash(base.data),crop:'Map012 interior x2..139/y2..100; unchanged layers at x+24',preservedTerrainAdjustments:terrainAdjustments},coverage:{implementedEncounters:20,originalReferences:180,implementedDoors:0,originalDoorReferences:70},points:[{name:'Entrada',position:[context.entry.x,context.entry.y]},{name:'Aposentos / lobos',position:[117,48]},{name:'Margem / passagem',position:[context.breach[0],context.breach[1]]},{name:'Ilha / pergaminho',position:[context.source[0],context.source[1]-1]},...proof.points.slice(2,6)]};
 require('./stonekeep-sector-a2e.cjs')(map,config);
 require('./stonekeep-legacycrop-encounters.cjs')(map,config);
 require('./stonekeep-a1-west.cjs')(map,config);
 require('./stonekeep-a2-central-doors.cjs')(map,config);
 require('./stonekeep-a2-b2-terrain.cjs')(map,config);
 require('./stonekeep-a2-b2-encounters.cjs')(map,config);
 require('./stonekeep-access-locks.cjs')(map,config);
 require('./stonekeep-access-pocket.cjs')(map,config);
 require('./stonekeep-a2-b2-completion.cjs')(map,config);
 require('./stonekeep-b1.cjs')(map,config);
 require('./stonekeep-c1-north.cjs')(map,config);
 require('./stonekeep-c1-central.cjs')(map,config);
 require('./stonekeep-c1-south.cjs')(map,config);
 require('./stonekeep-c2-north.cjs')(map,config);
 require('./stonekeep-c2-central.cjs')(map,config);
 require('./stonekeep-c2-central-south.cjs')(map,config);
 require('./stonekeep-c2-south.cjs')(map,config);
 require('./stonekeep-eastern-wings.cjs')(map,config);
 require('./stonekeep-provisions.cjs')(map,config);
 for(const p of config.points)if(![4,5].includes(map.data[(5*274+p.position[1])*274+p.position[0]]))throw Error('Stonekeep integral: ponto técnico fora do piso '+p.name);
 const infos=read('data/MapInfos.json');if(infos[15]&&infos[15].name!=='Stonekeep integral — base isolada')throw Error('Map015 ocupado');infos[15]={id:15,name:'Stonekeep integral — base isolada',expanded:true,order:15,parentId:0,scrollX:0,scrollY:0};
 for(const [file,obj]of [['Map015',map],['ArenaStonekeepWhole',config],['MapInfos',infos]])fs.writeFileSync(path.join(R,'data/'+file+'.json'),(file==='MapInfos'?'[\n'+obj.map(v=>JSON.stringify(v)).join(',\n')+'\n]':JSON.stringify(obj))+'\n');
 console.log('Map015274x274;'+config.encounters.entries.length+' encontros/'+config.doors.length+' portas; bloco A2/B2 conectado, dependências explícitas.');return config;
}
module.exports=build;if(require.main===module)build();
