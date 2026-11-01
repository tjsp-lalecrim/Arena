// Append one laboratory enemy/profile; no campaign/map/table changes elsewhere.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),write=(name,value)=>fs.writeFileSync(path.join(R,'data/'+name+'.json'),(Array.isArray(value)?'[\n'+value.map(v=>JSON.stringify(v)).join(',\n')+'\n]':JSON.stringify(value,null,2))+'\n');
module.exports=function(){const c=read('data/ArenaGhoul.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json'),p=read('doc/arte/ghoul-v01/profile.json');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Ghoul enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Ghoul · piloto Stonekeep')throw Error('Ghoul troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:c.enemy.exp,gold:0,note:c.source};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Ghoul · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};
 motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};
 const category=()=>({chance:0,min:1,max:1,entries:[]});loot.enemies[c.enemyId]={gold:{chance:0,min:0,max:0},potions:category(),gearChance:0,equipment:category(),weapons:category(),questSources:[],rare:{chance:0,variants:{},items:category()},difficulty:'laboratory only; campaign reward configuration deferred',source:c.source};
 for(const [name,v]of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motion,ArenaLoot:loot}))write(name,v);
};if(require.main===module)module.exports();
