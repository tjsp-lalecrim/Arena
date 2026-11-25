const plan = require('../doc/mapas/RIHAD_CORTE_M02.json');
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2)+'\n');
function position([x, y]) {
 const center = Math.floor(plan.scale / 2);
 return { x: plan.margin + (plan.rows[0].length - 1 - x) * plan.scale + center,
          y: plan.margin + y * plan.scale + center };
}

function build(){
 const c={areaId:'rihad.court',entry:{id:'rihad.court.entry',mapId:11,...position(plan.anchors.entry),direction:8},exit:{id:'rihad.court.exit',mapId:9,x:10,y:5,direction:2},accessEventId:5,doorEventId:6,exitEventId:1,queenEventId:2,destinationId:'stonekeep.entry',characterName:'$Arena_Blubamka_V01',faceName:'Arena_Blubamka_V01',faceIndex:0};
 const base=read('data/Map008.json').events[241].pages[0];
 function event(id,name,x,y,script,characterName='',trigger=0){const p=JSON.parse(JSON.stringify(base));p.image.characterName=characterName;p.image.direction=2;p.trigger=trigger;p.priorityType=characterName?1:0;p.through=!characterName;p.directionFix=true;p.walkAnime=!!characterName;p.list=script?[{code:355,indent:0,parameters:[script]},{code:0,indent:0,parameters:[]}]:[{code:0,indent:0,parameters:[]}];return {id,name,note:'M02-03D — representação provisória, sem planta/fisionomia canônica',x,y,pages:[p]};}
 const arrival=read('data/Map009.json');
 if(arrival.events[5]&&arrival.events[5].name!=='Acesso à corte de Rihad')throw Error('Evento5 ocupado; preservar mapa.');
 if(arrival.events[6]&&arrival.events[6].name!=='Porta da corte — provisória')throw Error('Evento6 ocupado; preservar mapa.');
 arrival.events[5]=event(5,'Acesso à corte de Rihad',10,4,'ArenaCourt.enter(this);','',1);
 arrival.events[6]=event(6,'Porta da corte — provisória',10,3,null,'!$Arena_Doors_M14_R03');
 arrival.events[6].pages[0].priorityType=0;arrival.events[6].pages[0].through=true;
 arrival.events[6].pages[0].image.pattern=0;arrival.events[6].pages[0].walkAnime=false;
 const cfg=read('data/ArenaRihad.json');
 cfg.court=c;
 require('./rihad-city-route.cjs').build(arrival,cfg,read('data/ArenaRecovery.json'));
 fs.writeFileSync(path.join(root,'data/Map009.json'),JSON.stringify(arrival)+'\n');
 const width = plan.rows[0].length * plan.scale + plan.margin * 2;
 const height = plan.rows.length * plan.scale + plan.margin * 2;
 const data = Array(width * height * 6).fill(0);
 function cell(x, y) {
  const localX = x - plan.margin;
  const localY = y - plan.margin;
  const column = Math.floor(localX / plan.scale);
  const row = Math.floor(localY / plan.scale);
  const originalX = plan.rows[0].length - 1 - column;
  const value = plan.rows[row]?.[originalX] ?? '#';
  if (value === 'E') return localX % plan.scale === 1 ? 'c' : '#';
  if (value !== 'D') return value;
  // The source's six ordinary door thresholds have no LOCK records.
  const northSouth = plan.rows[row - 1][originalX] !== '#' &&
      plan.rows[row + 1][originalX] !== '#';
  const offset = northSouth ? localX : localY;
  return offset % plan.scale === 1 ? '.' : '#';
 }
 const solid = value => value === '#' || value === '~';
 const floorTiles = { '.': 1, c: 9, r: 2 };
 for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const value = cell(x, y);
  const index = y * width + x;
  data[index] = value === '~' ? 4 : solid(value) ?
      (!solid(cell(x,y+1)) ? 13 : !solid(cell(x,y+2)) ? 5 : 4) : floorTiles[value];
  data[5 * width * height + index] = solid(value) ? 1 : 4;
 }
 const exit = position(plan.anchors.exit);
 const queen = position(plan.anchors.queen);
 const map = {
  ...read('data/Map001.json'), width, height, data, tilesetId: 4,
  displayName: '', note: 'PALACE2.MIF / caslev1: planta pública da corte, materiais e NPC provisórios.',
  encounterList: [], scrollType: 0, parallaxName: '', specifyBattleback: false,
  events: [null, event(1, 'Sair para Rihad', exit.x, exit.y, 'ArenaCourt.leave(this);', '', 1),
   event(2, 'Rainha Blubamka', queen.x, queen.y, 'ArenaCourt.talk(this);', c.characterName)]
 };
 map.events[2].note='Blubamka V01: interpretação regional; pose frontal estática, direção fixa. doc/CORTE_RIHAD_M02_03D.md';
 require('./rihad-interior-materials.cjs')(map, 'court');
 fs.writeFileSync(path.join(root,'data/Map011.json'), JSON.stringify(map)+'\n');
 const infos=read('data/MapInfos.json');infos[9].name='M02-03 Rihad — percurso urbano';infos[11]={id:11,expanded:true,name:'M02-03 Corte de Rihad (PALACE2)',order:11,parentId:0,scrollX:0,scrollY:0};fs.writeFileSync(path.join(root,'data/MapInfos.json'),'[\n'+infos.map(v=>JSON.stringify(v)).join(',\n')+'\n]\n');
 write('data/ArenaRihad.json',cfg);
 require('./build-rihad-guidance.cjs')();
 const p=path.join(root,'data/ArenaCampaign.json'),raw=fs.readFileSync(p,'utf8'),a={id:c.areaId,questId:'MQ02',mapId:11},existing=read('data/ArenaCampaign.json').areas.find(a=>a.id===c.areaId);
 if(existing){if(JSON.stringify(existing)!==JSON.stringify(a))throw Error('Vínculo da corte divergente; preservar configuração.');}
 else fs.writeFileSync(p,raw.replace('"areas": [','"areas": [\n    '+JSON.stringify(a)+','));
 console.log('Corte Map011 e acesso5/porta6 recompostos; destinos adicionais preservados.');
}
module.exports=build;if(require.main===module)build();
