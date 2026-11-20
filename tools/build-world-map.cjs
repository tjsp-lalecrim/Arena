// Deterministic vector master -> runtime export. No original binaries or text baked into art.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),master=JSON.parse(fs.readFileSync(path.join(root,'art/maps/arena-world-map-v01.json'),'utf8')),c=master.config;
assert.equal(master.version,1);assert.equal(c.schemaVersion,1);assert.equal(c.provinces.length,9);
assert.equal(new Set(c.provinces.map(p=>p.id)).size,9);
for(const p of c.provinces){assert(c.geography.world.some(g=>g.id===p.id));assert(c.geography.regions[p.id].length);}
assert.deepEqual(c.places.filter(p=>['rihad','stonekeep','fang'].includes(p.id)).sort((a,b)=>['rihad','stonekeep','fang'].indexOf(a.id)-['rihad','stonekeep','fang'].indexOf(b.id)).map(p=>[p.id,p.province,p.point]),[['rihad','hammerfell',[207,180]],['stonekeep','hammerfell',[205,155]],['fang','hammerfell',[280,42]]]);
assert.equal(c.places.length,273);assert.equal(new Set(c.places.map(p=>p.id)).size,273);
fs.writeFileSync(path.join(root,'data/ArenaWorldMap.json'),JSON.stringify(c)+'\n');
console.log('World map export: nine provinces, 273 named original locations, three implemented destinations; separate vector geometry/labels.');
