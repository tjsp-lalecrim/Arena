// S05: isolated arithmetic; proposed sets, not game data or a native battle.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = p => JSON.parse(fs.readFileSync(path.join(__dirname, '..', p), 'utf8'));
const prior = read('doc/evidencias/m01-20-estudo-atributos/simulacao.json');
const enemies = read('data/Enemies.json');
const base = [10, 5, 8, 5, 10, 10]; // ATQ, DEF, MAT, MDF, AGI, SOR
const sets = {
  partial: [[2,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,3,0,0,0,0],[0,0,0,0,0,0]],
  fullBasic: [[2,0,0,0,0,0],[0,2,0,0,0,0],[0,1,0,1,0,0],[0,3,0,0,0,0],[0,0,0,1,0,0]],
  fullUpgrade: [[5,0,0,0,0,0],[0,3,0,0,0,0],[0,2,0,1,0,0],[0,5,0,0,0,0],[0,0,0,3,0,0]],
  oldMail8Full: [[5,0,0,0,0,0],[0,3,0,0,0,0],[0,2,0,1,0,0],[0,8,0,0,0,0],[0,0,0,3,0,0]]
};
const totals = Object.fromEntries(Object.entries(sets).map(([k, pieces]) => [k, base.map((_, i) => pieces.reduce((s, p) => s+p[i], 0))]));
assert.deepEqual(totals.fullBasic, [2,6,0,2,0,0]);
assert.deepEqual(totals.fullUpgrade, [5,10,0,4,0,0]);
const raw = (p,x,y,heavy=false) => p*x*Math.max(.2, 8/(8+Math.max(0,y)*(heavy?.75:1)));
const hit = (...args) => Math.max(1, Math.round(raw(...args)));
function initiative(agi, eagi) {
  let win=0,tie=0,n=0;
  for(let i=0;i<Math.floor(5+agi/4);i++) for(let j=0;j<Math.floor(5+eagi/4);j++) {
    n++; win+=Number(agi+i>eagi+j); tie+=Number(agi+i===eagi+j);
  }
  return {strictlyFaster:win/n,ties:tie/n};
}
function row(level, build, set) {
  const spent = level===1 ? base.map(()=>0) : prior.rows.find(r=>r.level===level&&r.build===build).spent.map(v=>v*3);
  assert.equal(spent.reduce((a,b)=>a+b,0),3*(level-1));
  const attrs = base.map((v,i)=>v+spent[i]+totals[set][i]);
  return {level,build,set,spent,attrs,targets:[1,2].map(id=>{
    const e=enemies[id];
    return {enemy:e.name,attack:hit(1,attrs[0],e.params[3]),light:hit(1.25,attrs[0],e.params[3]),heavy:hit(1.6,attrs[0],e.params[3],true),fire:hit(3,attrs[2],e.params[5]),receivedRaw:raw(1,e.params[2],attrs[1]),received:hit(1,e.params[2],attrs[1]),initiative:initiative(attrs[4],e.params[6])};
  })};
}
const rows=[];
for(const set of ['partial','fullBasic','fullUpgrade']) rows.push(row(1,'no-points',set));
for(const level of [3,5]) for(const build of ['physical','hybrid']) for(const set of ['partial','fullBasic','fullUpgrade']) rows.push(row(level,build,set));
const mail8Sensitivity=[row(1,'no-points','oldMail8Full'),row(5,'physical','oldMail8Full')];
console.log(JSON.stringify({study:'S05, proposals only',attributeOrder:['ATQ','DEF','MAT','MDF','AGI','SOR'],slotOrder:['Arma','Escudo','Cabeça','Corpo','Acessório'],formula:'S02 proportional K8, floor .20; powers 1/1.25/1.6/3, heavy penetration 25%; no variance, critical, guard, racial effect or battle',sets,totals,rows,mail8Sensitivity,percentSensitivity:{hypotheticalFivePdr90:Math.pow(.9,5),actualSetPdr:1,actualSetMdr:1}},null,2));
