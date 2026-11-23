// Three regional roles on the existing city/inn. Data/positions remain explicit and rebuildable.
const plan=require('../doc/mapas/RIHAD_NPCS_M02.json');
module.exports=function apply(map,config,mapId){
 config.regionalNpcs=JSON.parse(JSON.stringify(plan.actors));
 for(const npc of plan.actors.filter(n=>n.mapId===mapId)){
  let e=map.events[npc.eventId];
  if(e&&npc.key!=='innkeeper')throw Error('Rihad NPC event ID occupied: '+npc.eventId);
  if(!e){const page=JSON.parse(JSON.stringify(map.events[1].pages[0]));e={id:npc.eventId,name:npc.name,note:'',x:npc.position[0],y:npc.position[1],pages:[page]};map.events[npc.eventId]=e;}
  e.name=npc.name;e.note=npc.id+' · interpretação regional V01 · '+npc.placement;
  const p=e.pages[0];Object.assign(p.image,{characterName:npc.characterName,characterIndex:0,direction:npc.direction,pattern:1,tileId:0});
  Object.assign(p,{directionFix:false,stepAnime:false,walkAnime:npc.moving,through:false,priorityType:1,trigger:0,moveType:npc.moving?3:0,moveSpeed:3,moveFrequency:3});
  if(npc.key!=='innkeeper')p.list=[{code:355,indent:0,parameters:['ArenaRihad.talkRegional(this,'+JSON.stringify(npc.id)+');']},{code:0,indent:0,parameters:[]}];
  if(npc.moving){const list=[];for(const d of npc.route)list.push({code:{2:1,4:2,6:3,8:4}[d],parameters:[]},{code:15,parameters:[20]});list.push({code:0,parameters:[]});p.moveRoute={list,repeat:true,skippable:false,wait:false};}
 }
};
