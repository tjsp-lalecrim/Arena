// The patrol and battle sheets share one campaign enemy and troop.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

module.exports = function buildHellHound() {
    const c = read('doc/arte/hell-hound-v01/config.json');
    const motion = read('doc/arte/hell-hound-v01/profile.json');
    const enemies = read('data/Enemies.json');
    const troops = read('data/Troops.json');
    const battle = read('data/ArenaBattle.json');
    const motions = read('data/ArenaBattleMotion.json');
    const loot = read('data/ArenaLoot.json');

    if (enemies[c.enemyId] && enemies[c.enemyId].name !== c.name) throw Error('Hell Hound enemy ID occupied');
    if (troops[c.troopId] && troops[c.troopId].name !== c.name) throw Error('Hell Hound troop ID occupied');

    // Single existing physical action. The original magic and loot flags do not
    // define a campaign skill or drop table for this provisional adaptation.
    const wolf = enemies[6];
    enemies[c.enemyId] = {
        ...wolf, id:c.enemyId, name:c.name, params:c.params,
        exp:c.exp, gold:0, traits:[{code:22,dataId:0,value:c.hit}], note:c.source,
    };
    troops[c.troopId] = {
        ...troops[1], id:c.troopId, name:c.name,
        members:[{enemyId:c.enemyId,x:240,y:360,hidden:false}],
    };
    motions.enemies[c.enemyId] = motion;
    battle.enemies[c.enemyId] = {
        file:motion.file, cell:motion.cell, ground:motion.ground,
        speed:8, rows:{wait:0,action:1,hurt:2,defeat:3},
    };
    loot.enemies[c.enemyId] = c.loot;
    for (const [name, data] of Object.entries({Enemies:enemies,Troops:troops,ArenaBattle:battle,ArenaBattleMotion:motions,ArenaLoot:loot})) {
        const json = Array.isArray(data) ? '[\n'+data.map(value=>JSON.stringify(value)).join(',\n')+'\n]' : JSON.stringify(data,null,2);
        fs.writeFileSync(path.join(root, 'data', name+'.json'), json+'\n');
    }
    return c;
};
