// Seven source-confirmed omissions in the former crop; Map015 only.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),copy=v=>JSON.parse(JSON.stringify(v));
module.exports=function(map,c){
 const s=read('doc/mapas/STONEKEEP_OMISSOES_ANTIGAS_M02.json');
 if(s.sourceSha256!==c.geometry.sourceSha256)throw Error('Stonekeep omissions: source mismatch');
 const visuals=read('data/ArenaEncounters.json').mapVisuals;
 for(const v of s.entries){
  const p=[3+3*(89-v.sourceOriginal[0]),3+3*v.sourceOriginal[1]];
  if(JSON.stringify(p)!==JSON.stringify(v.origin)||map.data[(5*map.height+p[1])*map.width+p[0]]!==4||map.events[v.eventId]||c.encounters.entries.some(e=>e.id===v.id||e.origin.join(',')===p.join(',')))throw Error('Stonekeep omissions: occupied or invalid origin/ID '+v.id);
  const template=c.encounters.entries.find(e=>e.enemyId===v.enemyId);
  if(!template||template.troopId!==v.troopId)throw Error('Stonekeep omissions: existing combat template absent '+v.id);
  const e=copy(map.events[template.eventId]);
  Object.assign(e,{id:v.eventId,name:(v.enemyId===4?'Esqueleto':'Goblin')+' / '+v.id,note:'ArenaEncounter:'+v.id,x:p[0],y:p[1]});
  e.pages[0].image.characterName=(c.encounters.mapVisuals[v.enemyId]||visuals[v.enemyId]).file;
  e.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];
  map.events[v.eventId]=e;c.encounters.entries.push(copy(v));
  if(!c.encounters.mapVisuals[v.enemyId])c.encounters.mapVisuals[v.enemyId]=copy(visuals[v.enemyId]);
 }
 c.legacyCropOmissions={source:'doc/mapas/STONEKEEP_OMISSOES_ANTIGAS_M02.json',enemyIds:s.entries.map(e=>e.id),geometryChanged:false};
 c.coverage.implementedEncounters=c.encounters.entries.length;
 c.context.coverage=c.coverage.implementedEncounters+' encontros · omissões da área antiga incluídas · restante em construção';
 c.points.push({name:'Área antiga · seis goblins',position:[147,69]},{name:'Ilha · esqueleto MIF76,22',position:[42,72]});
};
