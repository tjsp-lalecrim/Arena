// Approved battle plus ONE technical inspection specimen; no campaign encounters/rewards.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
module.exports=function(){
 const c=read('data/ArenaOrc.json'),p=read('doc/arte/orc-v01/profile.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json');
 if(c.campaign.enabled!==false)throw Error('Orc campaign encounters/rewards require their own delivery');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Orc enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Orc · piloto Stonekeep')throw Error('Orc troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,actions:[{conditionParam1:0,conditionParam2:0,conditionType:0,rating:5,skillId:1}],traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:0,gold:0,note:c.source};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Orc · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};loot.enemies[c.enemyId]=c.labLoot;
 for(const [n,v]of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motion,ArenaLoot:loot}))fs.writeFileSync(path.join(R,'data/'+n+'.json'),(Array.isArray(v)?'[\n'+v.map(e=>JSON.stringify(e)).join(',\n')+'\n]':JSON.stringify(v,null,2))+'\n');
 const base=read('data/Map012.json'),w=17,h=13,n=w*h,map={...base,width:w,height:h,data:new Array(n*6).fill(0),events:[null],displayName:'Orc · inspeção RAM',note:'Sala técnica de inspeção, não topologia de Stonekeep. Um exemplar sem recompensas; campanha Map012/015 preservada.',encounterList:[],scrollType:0,parallaxName:'',parallaxShow:false};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const solid=x===0||y===0||x===w-1||y===h-1||x===7&&[5,6].includes(y),water=!solid&&x>=13;map.data[y*w+x]=solid?512+x%2:water?2048:256+(y%4)*8+x%4;map.data[5*n+y*w+x]=solid?1:water?5:4;}
 const v=c.walkLab.encounters.entries[0],event=JSON.parse(JSON.stringify(read('data/Map008.json').events[169]));Object.assign(event,{id:1,name:'Orc · inspeção RAM',note:'ArenaEncounter:'+v.id,x:v.origin[0],y:v.origin[1]});event.pages[0].list=[{code:355,indent:0,parameters:["ArenaEncounters.start('"+v.id+"');"]},{code:0,indent:0,parameters:[]}];map.events[1]=event;
 const infos=read('data/MapInfos.json');if(infos[16]&&infos[16].name!=='Orc — inspeção RAM')throw Error('Map016 ocupado');infos[16]={id:16,name:'Orc — inspeção RAM',expanded:true,order:16,parentId:0,scrollX:0,scrollY:0};fs.writeFileSync(path.join(R,'data/Map016.json'),JSON.stringify(map)+'\n');fs.writeFileSync(path.join(R,'data/MapInfos.json'),'[\n'+infos.map(e=>JSON.stringify(e)).join(',\n')+'\n]\n');
};if(require.main===module)module.exports();
