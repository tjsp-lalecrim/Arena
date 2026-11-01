// Fixed source-aligned crop, not a procedural dungeon. No original media exported.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),write=(p,v)=>fs.writeFileSync(path.join(root,p),(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':v.data&&v.events?JSON.stringify(v):JSON.stringify(v,null,2))+'\n');
function build(){
 const walls=read('doc/mapas/STONEKEEP_KL_PILOTO.json'),visual=read('doc/mapas/STONEKEEP_VISUAL_V01.json'),l=read('doc/mapas/STONEKEEP_AMOSTRA_M02.json'),s=l.scale,m=l.margin,w=l.rows[0].length*s+m*2,h=l.rows.length*s+m*2,data=Array(w*h*6).fill(0);
 const cell=(x,y)=>l.rows[Math.floor((y-m)/s)]?.[Math.floor((x-m)/s)]||'#',at=(x,y,z,t)=>data[(z*h+y)*w+x]=t;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const c=cell(x,y),dy=(y-m+s)%s;let tile=c==='~'?2048:1+x%2+y%2*8;
  if(c==='#')tile=cell(x,y+s)!=='#'?(dy===0?4:5+x%2+(dy-1)*8):4;
  at(x,y,0,tile);at(x,y,5,c==='#'?1:c==='~'?5:4);
 }
 const center=p=>[m+(p[0]-l.crop.displayX[0])*s+1,m+p[1]*s+1],entry=center(l.anchors.entry),exit=center(l.anchors.exit),source=center(l.anchors.parchment);
 const base=read('data/Map008.json').events[241].pages[0];
 function event(id,name,p,script,trigger=0){const page=JSON.parse(JSON.stringify(base));page.image.characterName='';page.priorityType=0;page.through=true;page.trigger=trigger;page.list=[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}];return {id,name,note:'M02-04: recorte sem guardiões; marcador provisório',x:p[0],y:p[1],pages:[page]};}
 write('data/Map012.json',require('./stonekeep-visual-sample.cjs')({...read('data/Map001.json'),width:w,height:h,data,tilesetId:4,displayName:'',note:'Stonekeep: recorte fixo da entrada/aposentos/passagem/ilha. Planta original espelhada X. Guardiões ausentes, não encontro concluído.',encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events:[null,event(1,'Retornar a Rihad',exit,'ArenaStonekeep.leave(this);',1),event(2,'Pergaminho / stonekeep.parchment',source,'ArenaStonekeep.collect(this);')]}));
 const infos=read('data/MapInfos.json');infos[12]={id:12,expanded:true,name:'M02-04 Stonekeep — amostra',order:12,parentId:0,scrollX:0,scrollY:0};write('data/MapInfos.json',infos);
 const campaign=read('data/ArenaCampaign.json');campaign.areas.find(a=>a.id==='stonekeep').mapId=12;campaign.sources.find(a=>a.id==='stonekeep.parchment').itemId=7;write('data/ArenaCampaign.json',campaign);
 const items=read('data/Items.json');if(items[7]&&!items[7].note.includes('MQ02.parchment'))throw Error('ID7 ocupado');
 items[7]={...items[1],id:7,name:'Pergaminho de Stonekeep',description:'Pergaminho roubado da corte de Rihad. Necessário para decifrar a localização de Fang Lair.',note:'<ArenaQuest: MQ02>\n<ArenaUnique>\nMQ02.parchment / stonekeep.parchment. Entrega somente por evento autorizado.',itypeId:2,consumable:false,price:0};write('data/Items.json',items);
 write('data/ArenaStonekeep.json',{schemaVersion:1,areaId:'stonekeep',sourceId:'stonekeep.parchment',itemId:7,mapId:12,entry:{id:'stonekeep.entry',mapId:12,x:entry[0],y:entry[1],direction:2},exitEventId:1,sourceEventId:2,travelEventId:3,return:{id:'rihad.stonekeep.return',mapId:9,x:10,y:11,direction:8},source,exit,wallSamples:walls.patches.map(p=>({id:p.id,entry:p.entry,bounds:p.bounds})),visualSample:{version:visual.version,entry:{id:'stonekeep.visual.sample',mapId:visual.mapId,x:visual.reviewPoints.aposento[0],y:visual.reviewPoints.aposento[1],direction:4},bounds:visual.bounds},breach:center(l.anchors.breach),shore:center(l.anchors.shore),island:center(l.anchors.island),swimming:{enabled:true,regionId:5,autotileKind:0,depth:32,offsetY:8}});
 console.log('Stonekeep Map012, fonte7 e vínculo recompostos; sem guardiões ou entrega.');
}
module.exports=build;if(require.main===module)build();
