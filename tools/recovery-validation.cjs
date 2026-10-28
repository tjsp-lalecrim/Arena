const assert=require('node:assert/strict');
// Narrow exception for the sole M01-17 event integration; all other lab data stays equal.
exports.bedScript="var r=ArenaRecovery.restAt('lab.resources.bed',this); $gameMessage.add(r.ok?'Vida, Mana e Vigor completos.':r.reason); $gameMessage.add('Cama técnica; sem local autorizado na dungeon.');";
exports.baselineLab=function(current,previous){
 const a=JSON.parse(current),b=JSON.parse(previous);
 assert.equal(a.events[6].pages[0].list[0].parameters[0],exports.bedScript);
 a.events[6].pages[0].list[0].parameters[0]=b.events[6].pages[0].list[0].parameters[0];
 assert.deepEqual(a,b,'only the technical bed script may change');return previous;
};
