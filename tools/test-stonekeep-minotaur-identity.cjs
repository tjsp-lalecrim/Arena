const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),file='doc/evidencias/m02-stonekeep-cobertura/inventario.json',proof=read('doc/arte/minotaur-v01/sources.json');
const before=JSON.parse(cp.execFileSync('git',['show','8b309cc:'+file],{encoding:'utf8',maxBuffer:20e6})),after=read(file);
function normalize(v){if(typeof v==='string')return v==='ogro'?'minotauro':v;if(Array.isArray(v))return v.map(normalize);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k==='ogro'?'minotauro':k,normalize(x)]));return v;}
assert.deepEqual(after,normalize(before),'Only the8 erroneous labels/sector counts may change; coordinates and prior IDs preserved');
assert.equal(proof.itemIndex-31-1,proof.creatureIndex);assert.equal(proof.creatureIndex,7);assert.equal(proof.creatureName,'Minotaur');assert.equal(proof.animationPattern,'pat@.cfa');assert.equal(proof.positions.length,8);
assert.equal(JSON.stringify(after).includes('"ogro"'),false);
console.log('PASS identity mapping and label-only survey correction;8 original positions/states unchanged');
