// One Minotaur exemplar only. OGRE.DFA/ITEM39 resolves Minotaur/PAT, not an Ogre.
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
module.exports=function(){
 const c=read('data/ArenaMinotaur.json'),p=read('doc/arte/minotaur-v01/profile.json'),enemies=read('data/Enemies.json'),troops=read('data/Troops.json'),battle=read('data/ArenaBattle.json'),motion=read('data/ArenaBattleMotion.json'),loot=read('data/ArenaLoot.json');
 if(c.campaign.enabled!==false)throw Error('Minotaur campaign integration requires a separate delivery');
 if(enemies[c.enemyId]&&enemies[c.enemyId].name!==c.enemy.name)throw Error('Minotaur enemy ID occupied');
 if(troops[c.troopId]&&troops[c.troopId].name!=='Minotauro · piloto Stonekeep')throw Error('Minotaur troop ID occupied');
 enemies[c.enemyId]={...enemies[2],id:c.enemyId,name:c.enemy.name,params:c.enemy.params,actions:[{conditionParam1:0,conditionParam2:0,conditionType:0,rating:5,skillId:1}],traits:[{code:22,dataId:0,value:c.enemy.hit}],exp:0,gold:0,note:c.source};
 troops[c.troopId]={...troops[1],id:c.troopId,name:'Minotauro · piloto Stonekeep',members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}]};motion.enemies[c.enemyId]=p;battle.enemies[c.enemyId]={file:p.file,cell:p.cell,ground:p.ground,speed:8,rows:{wait:0,action:1,hurt:2,defeat:3}};loot.enemies[c.enemyId]=c.labLoot;
 for(const[n,v]of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motion,ArenaLoot:loot}))fs.writeFileSync(path.join(R,'data/'+n+'.json'),(Array.isArray(v)?'[\n'+v.map(e=>JSON.stringify(e)).join(',\n')+'\n]':JSON.stringify(v,null,2))+'\n');
};if(require.main===module)module.exports();
