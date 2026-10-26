const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const baseline='30e441d',old=p=>execFileSync('git',['show',baseline+':'+p],{encoding:'utf8',maxBuffer:32*1024*1024}).replaceAll('\r\n','\n');
const text=fs.readFileSync('js/plugins/Arena_BattleUI.js','utf8').replaceAll('\r\n','\n');
const config=JSON.parse(fs.readFileSync('data/ArenaBattleUI.json','utf8')),prior=JSON.parse(old('data/ArenaBattleUI.json'));
assert.equal(config.commandHeight,104);assert.equal(config.hotbarHeight,108);assert.deepEqual({...config,commandHeight:prior.commandHeight,hotbarHeight:prior.hotbarHeight},prior);
assert.equal(fs.readFileSync('js/plugins.js','utf8').replaceAll('\r\n','\n'),old('js/plugins.js'),'plugin registry must stay canonical and identical');
function slice(s,start,end){return s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start))).trim();}
const original=old('js/plugins/Arena_BattleUI.js');
assert.equal(slice(text,'    function resolve(','    Input.keyMapper'),slice(original,'    function resolve(','    Input.keyMapper'),'availability and descriptions/cost calculation unchanged');
assert.equal(slice(text,'    Sprite_Actor.prototype.setActorHome','    Spriteset_Battle.prototype.createBattleback'),slice(original,'    Sprite_Actor.prototype.setActorHome','    Spriteset_Battle.prototype.createBattleback'),'animation/body/weapon/effects transforms unchanged');
assert.equal(slice(text,'    var start=BattleManager.startAction;','    Scene_Battle.prototype.arenaAcceptsInput'),slice(original,'    var start=BattleManager.startAction;','    var sceneUpdate=Scene_Battle.prototype.update;'),'native cost/revalidation guard unchanged');
assert.equal(execFileSync('git',['diff',baseline,'--','img','art','js/rpg_core.js','js/rpg_managers.js','js/rpg_objects.js','js/rpg_scenes.js','js/rpg_sprites.js','js/rpg_windows.js','js/plugins/Arena_Resources.js','js/plugins/Arena_Abilities.js','js/plugins/Arena_Persistence.js','js/plugins/Arena_BattleMotion.js','js/plugins/Arena_Battle.js','data/ArenaBattleMotion.json','data/ArenaCatalog.json','data/Skills.json','data/Items.json','data/Weapons.json','data/Enemies.json','data/Map007.json','data/Troops.json','data/System.json'],{encoding:'utf8'}),'','rules, animations, engine, saves schema and database unchanged');
assert(!/Ã|Â|â€/.test(text));assert(!text.startsWith('\ufeff'));
console.log('PASS R02 presentation-only diff; prior16+2 plugins unchanged; animation transforms/cost guards/resources/races/database/engine/art intact; only two layout dimensions changed');
