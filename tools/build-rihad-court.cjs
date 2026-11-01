// Minimal provisional court; callable after the arrival generator, never artwork production.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
function build(){
 const c={areaId:'rihad.court',entry:{id:'rihad.court.entry',mapId:11,x:8,y:10,direction:8},exit:{id:'rihad.court.exit',mapId:9,x:10,y:5,direction:2},accessEventId:5,doorEventId:6,exitEventId:1,queenEventId:2,destinationId:'stonekeep.entry'};
 const base=read('data/Map008.json').events[241].pages[0];
 function event(id,name,x,y,script,characterName='',trigger=0){const p=JSON.parse(JSON.stringify(base));p.image.characterName=characterName;p.image.direction=2;p.trigger=trigger;p.priorityType=characterName?1:0;p.through=!characterName;p.directionFix=true;p.walkAnime=!!characterName;p.list=script?[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}]:[{code:0,indent:0,parameters:[]}];return {id,name,note:'M02-03D — representação provisória, sem planta/fisionomia canônica',x,y,pages:[p]};}
 const arrival=read('data/Map009.json');
 if(arrival.events[5]&&arrival.events[5].name!=='Acesso à corte de Rihad')throw Error('Evento5 ocupado; preservar mapa.');
 if(arrival.events[6]&&arrival.events[6].name!=='Porta da corte — provisória')throw Error('Evento6 ocupado; preservar mapa.');
 arrival.events[5]=event(5,'Acesso à corte de Rihad',10,4,'ArenaCourt.enter(this);','',1);
 arrival.events[6]=event(6,'Porta da corte — provisória',10,3,null,'!$Arena_Doors_M14_R03');
 arrival.events[6].pages[0].priorityType=0;arrival.events[6].pages[0].through=true;
 arrival.events[6].pages[0].image.pattern=0;arrival.events[6].pages[0].walkAnime=false;
 write('data/Map009.json',arrival);
 const width=17,height=13,data=Array(width*height*6).fill(0),open=(x,y)=>x>=2&&x<=14&&y>=4&&y<=11;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){data[y*width+x]=open(x,y)?1+x%2+y%2*8:open(x,y+1)?13+x%2:open(x,y+2)?5+x%2:4;data[(5*height+y)*width+x]=open(x,y)?4:1;}
 for(let y=0;y<3;y++)for(let x=0;x<3;x++)data[(height+4+y)*width+7+x]=68+x+y*8;
 const map={...read('data/Map001.json'),width,height,data,tilesetId:4,displayName:'',note:'M02-03D — corte mínima provisória. Materiais e NPC de reuso, não representação definitiva de Blubamka/palácio. Sem encontros.',encounterList:[],scrollType:0,parallaxName:'',specifyBattleback:false,events:[null,event(1,'Sair para Rihad',8,11,'ArenaCourt.leave(this);','',1),event(2,'Rainha Blubamka — sprite provisório',8,5,'ArenaCourt.talk(this);','$Arena_redguard_female_walk_r02')]};
 write('data/Map011.json',map);
 const infos=read('data/MapInfos.json');infos[11]={id:11,expanded:true,name:'M02-03 Corte de Rihad (provisória)',order:11,parentId:0,scrollX:0,scrollY:0};fs.writeFileSync(path.join(root,'data/MapInfos.json'),'[\n'+infos.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
 const cfg=read('data/ArenaRihad.json');cfg.court=c;write('data/ArenaRihad.json',cfg);
 const p=path.join(root,'data/ArenaCampaign.json'),raw=fs.readFileSync(p,'utf8'),a={id:c.areaId,questId:'MQ02',mapId:11},existing=read('data/ArenaCampaign.json').areas.find(a=>a.id===c.areaId);
 if(existing){if(JSON.stringify(existing)!==JSON.stringify(a))throw Error('Vínculo da corte divergente; preservar configuração.');}
 else fs.writeFileSync(p,raw.replace('"areas": [','"areas": [\n    '+JSON.stringify(a)+','));
 console.log('Corte Map011 e acesso5/porta6 recompostos; Stonekeep continua sem mapa.');
}
module.exports=build;if(require.main===module)build();
