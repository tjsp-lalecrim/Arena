// Source bindings for the existing dialogue module; no quest effects.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(root,f),JSON.stringify(v,null,2)+'\n');
module.exports=function(){
 const plan=read('doc/mapas/RIHAD_NPCS_M02.json'),c=read('data/ArenaNPCDialogues.json');
 for(const n of plan.actors){
  if(!c.npcs[n.id]){
   const original=plan.actors.find(v=>v.key===n.key&&c.npcs[v.id]);
   if(!original)throw Error('No existing dialogue role for '+n.id);
   c.npcs[n.id]={...JSON.parse(JSON.stringify(c.npcs[original.id])),id:n.id,mapId:n.mapId,eventId:n.eventId,name:n.name,face:n.faceName};
  }
 }
 for(const n of Object.values(c.npcs))if(!n.topics.some(t=>t.id==='where'))n.topics.splice(1,0,{id:'where',label:'Onde fica…?',action:'rihad.where'});
 write('data/ArenaNPCDialogues.json',c);
 const signs=read('doc/mapas/RIHAD_SINALIZACAO_M02.json'),r=read('data/ArenaRihad.json');
 const groups=[['temple','Templo','Templo'],['equipment','Equipamentos','Equipamentos'],['mages','Guilda dos Magos','Guilda dos Magos'],['tavern','Outra taverna','Taverna']];
 const pois=[
  {id:'inn',name:'Pousada do portão',approach:r.inn.approach,tile:r.inn.entrance,face:4,interior:18,hint:'Na aproximação, procure a placa Pousada junto à fachada.',source:'CITYW1/TPBD11B; TAVERN4; generic project name'},
  {id:'court',name:'Corte',approach:[360,383],tile:[360,384],face:2,interior:11,hint:'Na muralha sul, atravesse a grade e procure a porta de madeira.',source:'CITYW1 palace threshold; PALACE2'},
  {id:'gate',name:'Portão urbano',approach:[345,7],tile:[345,6],face:8,hint:'Siga as placas Portão urbano até a saída ao norte.',source:'CITYW1 north gate; current event3'},
  {id:'outskirts',name:'Arredores de Rihad',approach:[345,7],tile:[345,6],face:8,source:'Project road access through the same gate menu; not a new original building'},
 ];
 for(const [group,label,type]of groups)for(const d of signs.doors.filter(d=>d.type===type&&(d.tile[0]!==r.inn.entrance[0]||d.tile[1]!==r.inn.entrance[1])))
  pois.push({id:group+'.'+d.original.join('.'),group,name:label,approach:d.approach,tile:d.tile,face:({2:8,8:2,4:6,6:4})[d.side],closed:true,source:signs.source+'; '+d.resource+'; original '+d.original.join(',')+'; type confirmed, proper name unconfirmed'});
 write('data/ArenaRihadDirections.json',{schemaVersion:1,mapId:9,innMapId:18,interiorPois:[
  {id:'inn.exit',name:'Saída para Rihad',approach:[read('data/Map018.json').events[1].x,read('data/Map018.json').events[1].y-1],face:2,hint:'Fora da pousada, os moradores indicam as entradas da cidade.',source:'Existing TAVERN4 exit1; outside locations can be requested in the city'},
  {id:'inn.bed',name:'Quarto · Cama',approach:[r.inn.bed.x+1,r.inn.bed.y],face:4,source:'Existing authorized bed interaction; no recovery from directions'}
 ],groups:groups.map(([id,label])=>({id,label:label+' · Fechado'})),pois,blocks:{
  direction:{id:'rihad.where.direction',text:'Ah, fica ao {direction} daqui.',source:'TEMPLATE.DAT #0260 alternative1; %di replaced from current NPC/accessible entrance',classification:'T/A',illustration:null},
  near:{id:'rihad.where.near',text:'Está logo aqui.',source:'Adaptation of nearby-location context #0261; does not claim an original map inscription',classification:'A',illustration:null},
  route:{id:'rihad.where.route',text:'Pelas ruas, comece pelo {first}.{turn} Siga a indicação até {place}.',source:'Project adaptation to reconstructed streets and accessible thresholds',classification:'A',illustration:null},
  entrance:{id:'rihad.where.entrance',text:'Na entrada, fique de frente para {face}.',source:'Project interaction direction at the existing event/closed facade',classification:'A',illustration:null},
  closed:{id:'rihad.where.closed',text:'O estabelecimento está fechado nesta versão. A indicação leva apenas à fachada.',source:'Current service coverage; project-specific',classification:'A',illustration:null},
  outskirts:{id:'rihad.where.outskirts',text:'No Portão urbano, escolha Ir aos Arredores de Rihad. Pode voltar à cidade pelo mesmo caminho.',source:'Existing project gate access, independent of Ria/audience',classification:'A',illustration:null},
  unknown:{id:'rihad.where.unknown',text:'Não sei onde fica. Desculpe.',source:'TEMPLATE.DAT #0259 alternative1; no route shown if unavailable',classification:'T',illustration:null},
  stopped:{id:'rihad.where.stopped',text:'Indicação encerrada.',source:'Project navigation action; no quest change',classification:'A',illustration:null}
 }});
};
if(require.main===module)module.exports();
