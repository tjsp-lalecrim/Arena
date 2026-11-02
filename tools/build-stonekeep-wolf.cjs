// One battle-only pilot. Does not create map encounters or campaign rewards.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(name,value)=>fs.writeFileSync(path.join(R,'data/'+name+'.json'),(Array.isArray(value)?'[\n'+value.map(v=>JSON.stringify(v)).join(',\n')+'\n]':JSON.stringify(value,null,2))+'\n');
module.exports=function(){
 const c=read('data/ArenaWolf.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json'),p=read('doc/arte/wolf-v01/profile.json');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Wolf enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Lobo · piloto Stonekeep')throw Error('Wolf troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,actions:[{conditionParam1:0,conditionParam2:0,conditionType:0,rating:5,skillId:1}],traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:0,gold:0,note:c.source+' LAB ONLY; campaign pending.'};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Lobo · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};
 loot.enemies[c.enemyId]=c.labLoot;
 for(const [name,v]of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motion,ArenaLoot:loot}))write(name,v);
};if(require.main===module)module.exports();
