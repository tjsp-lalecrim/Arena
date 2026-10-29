// Source guard: retired equipment may exist in the database/saves, never in new loot pools.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const retired=new Set(['weapon:3','weapon:4','armor:3','armor:4']);
function validate(config){
 function walk(value){if(!value||typeof value!=='object')return;if(value.kind&&value.id)assert.ok(!retired.has(value.kind+':'+value.id),'Retired reward reference: '+value.kind+':'+value.id);Object.values(value).forEach(walk);}
 walk(config);
 for(const t of Object.values(config.enemies)){assert.equal(t.rare.chance,0);assert.deepEqual(t.rare.variants,{});}
 return true;
}
if(require.main===module){
 const root=path.resolve(__dirname,'..'),config=JSON.parse(fs.readFileSync(path.join(root,'data/ArenaLoot.json')));validate(config);
 for(const e of JSON.parse(fs.readFileSync(path.join(root,'data/Enemies.json'))).filter(Boolean))for(const d of e.dropItems){const kind=d.kind===2?'weapon':d.kind===3?'armor':null;if(kind)assert.ok(!retired.has(kind+':'+d.dataId),'Retired native drop');}
 const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'js/plugins/MV_LootRules.js'),'utf8'),ctx);let cases=0;
 for(const t of Object.values(config.enemies))for(const n of [0,.01,.18,.23,.25,.5,.9,.999999]){
  const r=ctx.MVLootRules.roll(t,()=>n),gear=r.rows.filter(v=>v.kind==='weapon'||v.kind==='armor');assert.ok(gear.length<=1);assert.ok(gear.every(v=>!retired.has(v.kind+':'+v.id)&&v.rare===false));cases++;
 }
 console.log('PASS current loot source guard and '+cases+' controlled rolls');
}
module.exports=validate;
