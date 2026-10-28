const fs=require('fs'),assert=require('node:assert/strict'),{execFileSync}=require('child_process');
const base='bd108c5',read=p=>fs.readFileSync(p,'utf8').replaceAll('\r\n','\n'),old=p=>execFileSync('git',['show',base+':'+p],{encoding:'utf8',maxBuffer:32e6}).replaceAll('\r\n','\n');
for(const p of ['js/plugins.js','js/plugins/Arena_Inventory.js','js/plugins/Arena_Resources.js','js/plugins/Arena_BattleUI.js','js/plugins/Arena_Persistence.js','data/Items.json','data/Map005.json','data/Map008.json','js/rpg_core.js','js/rpg_objects.js','js/rpg_managers.js'])assert.equal(read(p),old(p),p);
const c=JSON.parse(read('data/ArenaRecovery.json')),previous=JSON.parse(old('data/ArenaRecovery.json'));assert.deepEqual(c,{...previous,menuIntervalMs:500});
const strip=s=>s.replace(/ \* @plugindesc[^\n]*\n/,'').replace(/ \* menuIntervalMs[^\n]*\n/,'').replace(/^        if \(c\.menuIntervalMs[^\n]*\n/m,'').replace(/    \/\/ The inventory already owns[\s\S]*?(?=    \/\/ Forced or stale selections)/,'');
assert.equal(strip(read('js/plugins/Arena_Recovery.js')),strip(old('js/plugins/Arena_Recovery.js')),'rest and battle guards unchanged');
execFileSync(process.execPath,['--check','js/plugins/Arena_Recovery.js']);console.log('PASS default500ms is only data change; approved bars/inventory, combat/rest/resources/save/engine unchanged');
