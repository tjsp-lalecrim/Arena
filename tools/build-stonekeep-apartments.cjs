// Three declared rats only; wolves remain an explicit art/content dependency.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
module.exports=function(){
 const c=read('doc/mapas/STONEKEEP_APOSENTOS_M02.json'),map=read('data/Map012.json'),campaign=read('data/ArenaCampaign.json'),area=campaign.areas.find(v=>v.id===c.areaId),ids=new Set(),events=new Set(),origins=new Set();
 if(!area||area.mapId!==c.mapId||area.encounters.mapId!==c.mapId)throw Error('Aposentos: área de Stonekeep incompatível');
 const prototype=read('data/Map008.json').events[169];
 c.entries.forEach(v=>{
  if(ids.has(v.id)||events.has(v.eventId)||origins.has(v.origin.join(',')))throw Error('Aposentos: ID/evento/origem duplicado');
  ids.add(v.id);events.add(v.eventId);origins.add(v.origin.join(','));
  if(v.enemyId!==1||v.troopId!==1||map.data[(5*map.height+v.origin[1])*map.width+v.origin[0]]!==4)throw Error('Aposentos: rato fora do contrato/piso');
  if(map.events[v.eventId]&&map.events[v.eventId].note!=='ArenaEncounter:'+v.id)throw Error('Aposentos: evento ocupado');
  const e=JSON.parse(JSON.stringify(prototype));Object.assign(e,{id:v.eventId,name:'Rato / '+v.id,note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});
  e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[v.eventId]=e;
 });
 area.encounters.mapVisuals['1']=read('data/ArenaEncounters.json').mapVisuals['1'];
 const existing=new Set(area.encounters.entries.map(v=>v.id));
 area.encounters.entries=area.encounters.entries.map(v=>c.entries.find(e=>e.id===v.id)||v).concat(c.entries.filter(v=>!existing.has(v.id)));
 fs.writeFileSync(path.join(R,'data/Map012.json'),JSON.stringify(map)+'\n');fs.writeFileSync(path.join(R,'data/ArenaCampaign.json'),JSON.stringify(campaign,null,2)+'\n');
};if(require.main===module)module.exports();
