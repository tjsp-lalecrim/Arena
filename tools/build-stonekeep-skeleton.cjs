// Content-only merge: append new stable IDs, preserve every existing record.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(f,v)=>fs.writeFileSync(path.join(R,f),(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':JSON.stringify(v,null,2))+'\n');
module.exports=function(){const c=read('data/ArenaSkeleton.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Skeleton enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Esqueleto · piloto Stonekeep')throw Error('Skeleton troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:c.enemy.exp,gold:0,note:c.source};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Esqueleto · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 const p=read('doc/arte/skeleton-v01/profile.json');motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};
 const empty=JSON.parse(JSON.stringify(loot.enemies['1']));empty.source=c.source;empty.difficulty='technical skeleton pilot; campaign table pending';loot.enemies[c.enemyId]=empty;
 for(const [f,v]of Object.entries({'Enemies':enemies,'Troops':troops,'ArenaBattle':battle,'ArenaBattleMotion':motion,'ArenaLoot':loot}))write('data/'+f+'.json',v);
};if(require.main===module)module.exports();
