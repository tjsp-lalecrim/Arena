// Confirm that a visual atlas replacement preserves every native movement flag,
// non-ground layer (except documented blocked facade overlays), event, and map property used by the existing quest saves.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const base = 'f87f2f0';
const scope = process.argv[2];
const maps = {rihad:['009'], fang:['013','017']}[scope];
assert(maps, 'Uso: node tools/test-m02-surface-atlas.cjs rihad|fang');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const old = name => JSON.parse(execFileSync('git', ['show', base+':'+name], {
    cwd:root, encoding:'utf8', maxBuffer:20e6,
}));
const currentSets = read('data/Tilesets.json');
const priorSets = old('data/Tilesets.json');
assert.deepEqual(currentSets.slice(0,priorSets.length), priorSets);
const cfg = read('doc/arte/m02-tilesets/'+scope+'.json');
for (const id of maps) {
    const file = 'data/Map'+id+'.json';
    const { data:was, tilesetId:wasSet, note:oldNote, ...prior } = old(file);
    const { data:now, tilesetId:nowSet, note:newNote, ...map } = read(file);
    if (scope === 'rihad') {
        // The inn delivery retires only exterior event 2 and adds facade access 7.
        const inn = read('data/ArenaRihad.json').inn;
        assert.equal(map.events[2], null);
        assert.equal(map.events[inn.accessEventId].pages[0].list[0].parameters[0], 'ArenaRihad.enterInn(this);');
        prior.events[2] = null;
        prior.events[inn.accessEventId] = map.events[inn.accessEventId];
    }
    assert.deepEqual(map, prior, file);
    assert.equal(nowSet, cfg.tilesetId, file);
    const before = priorSets[wasSet], after = currentSets[nowSet], layer = map.width * map.height;
    assert.deepEqual(after.tilesetNames.slice(0,6),before.tilesetNames.slice(0,6),file);
    assert.equal(after.tilesetNames[6],cfg.sheet,file);
    if (scope === 'rihad') {
        const plan = read('doc/mapas/RIHAD_SINALIZACAO_M02.json');
        const retired = {x:354,y:15};
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++) {
            const i=(retired.y+dy)*map.width+retired.x+dx;
            assert.equal(now[layer+i],0);
            was[layer+i]=0;
        }
        const overlays = new Map();
        for (const { tile:[x,y], side, approach:[ax,ay] } of plan.doors) {
            assert.equal(was[5*layer + ay*map.width+ax],4);
            overlays.set(y*map.width+x, side === 2 ? 381 : side === 8 ? 383 : 382);
            if (side === 2) overlays.set((y-1)*map.width+x,380);
        }
        for (const [i,tile] of overlays) {
            assert.equal(was[layer+i],0);
            assert.equal(was[5*layer+i],1);
            assert.equal(after.flags[tile], before.flags[was[i]]);
            was[layer+i] = tile;
        }
        const c = read('data/ArenaRihad.json').signage;
        assert.deepEqual(c.signs, plan.signs);
        assert.deepEqual(c.doors, plan.doors.map(({type,tile,approach}) => ({type,tile,approach})));
    }
    assert.deepEqual(now.slice(layer),was.slice(layer),file);
    for (let i=0;i<layer;i++) {
        assert.equal(after.flags[now[i]],before.flags[was[i]],file+' at index '+i);
    }
    console.log('PASS '+file+': preserved events, regions and native passage flags' +
        (scope === 'rihad' ? '; decorative facade panels only on existing walls' : ''));
}
