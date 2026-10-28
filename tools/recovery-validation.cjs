const assert=require('node:assert/strict');
// Narrow exception for the sole M01-17 event integration; all other lab data stays equal.
exports.bedScript="var r=ArenaRecovery.restAt('lab.resources.bed',this); $gameMessage.add(r.ok?'Vida, Mana e Vigor completos.':r.reason); $gameMessage.add('Cama técnica; sem local autorizado na dungeon.');";
exports.baselineLab=function(current,previous){
 const a=JSON.parse(current),b=JSON.parse(previous);
 assert.equal(a.events[6].pages[0].list[0].parameters[0],exports.bedScript);
 a.events[6].pages[0].list[0].parameters[0]=b.events[6].pages[0].list[0].parameters[0];
 assert.deepEqual(a,b,'only the technical bed script may change');return previous;
};
exports.baselineInventory=function(current,previous){
 const norm=s=>s.replaceAll('\r\n','\n');
 const strip=s=>{
  s=norm(s).replace(/ \* @plugindesc[^\n]*\n/,'');
  const a=s.indexOf('    // Presentation only:')>=0?s.indexOf('    // Presentation only:'):s.indexOf('    Stats.prototype.refresh=');
  s=s.slice(0,a)+s.slice(s.indexOf('    function Pager()',a));
  return s.replace(/^    Scene_ArenaInventory.prototype.updateDescription=.*\n/m,'');
 };
 assert.equal(strip(current),strip(previous),'inventory changes restricted to stats presentation/description');
 const line=s=>norm(s).split('\n').find(l=>l.startsWith('    Scene_ArenaInventory.prototype.updateDescription='));
 assert.equal(line(current),line(previous).replace("i.name+' · '+(important(i)?'Importante; não pode descartar/vender.':'Quantidade '+$gameParty.numItems(i))", "i.name+(important(i)?' · Importante; não pode descartar/vender.':'')"));
 return previous;
};
