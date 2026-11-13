const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),p=read('doc/arte/spider-v01/sources.json'),inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json');
assert.equal(p.flat,59);assert.equal(p.itemIndex-31-1,p.creatureIndex);assert.equal(p.creatureIndex,8);assert.equal(p.creatureName,'Spider');assert.equal(p.animationPattern,'spider@.cfa');
const refs=inv.enemies.filter(e=>e.flat===59);assert.equal(refs.length,20);assert(refs.every(e=>e.resource.toUpperCase()==='SPIDER.DFA'&&e.species==='aranha'));assert.deepEqual(p.positions,refs.map(e=>e.original));
assert.deepEqual(inv,JSON.parse(cp.execFileSync('git',['show','569e382:doc/evidencias/m02-stonekeep-cobertura/inventario.json'],{encoding:'utf8',maxBuffer:20e6})));
console.log('PASS Spider identity/source mapping and20 original positions; coverage inventory unchanged');
