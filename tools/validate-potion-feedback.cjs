const fs=require('fs'),assert=require('node:assert/strict'),{execFileSync}=require('child_process');
const base='35ba624',read=p=>fs.readFileSync(p,'utf8').replaceAll('\r\n','\n'),old=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:32e6}).replaceAll('\r\n','\n');
require('./recovery-validation.cjs').baselineInventory(read('js/plugins/Arena_Inventory.js'),old('js/plugins/Arena_Inventory.js'));
const strip=s=>s.replace(/ \* menuIntervalMs[^\n]*\n/,'').replace(/^        if \(c\.menuIntervalMs[^\n]*\n/m,'').replace(/ \* @plugindesc[^\n]*\n/,'').replace(/    \/\/ The inventory already owns[\s\S]*?(?=    \/\/ Forced or stale selections)/,'');
assert.equal(strip(read('js/plugins/Arena_Recovery.js')),strip(old('js/plugins/Arena_Recovery.js')),'rest/battle guards unchanged');
for(const p of ['js/plugins.js','data/Items.json','data/Map005.json','data/Map008.json','js/plugins/Arena_Resources.js','js/plugins/Arena_BattleUI.js','js/plugins/Arena_Persistence.js'])assert.equal(p==='js/plugins.js'&&fs.existsSync('data/ArenaNarrative.json')?require('./narrative-validation.cjs').baselinePlugins(read(p),old(p)):read(p),old(p),p);
const c=JSON.parse(read('data/ArenaRecovery.json'));delete c.menuIntervalMs;assert.deepEqual(c,JSON.parse(old('data/ArenaRecovery.json')));
for(const p of ['js/plugins/Arena_Inventory.js','js/plugins/Arena_Recovery.js'])execFileSync(process.execPath,['--check',p]);
console.log('PASS R02 scoped presentation change; rest/battle/resources/items/maps/plugins/save untouched');
