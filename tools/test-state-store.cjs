const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('js/plugins/MV_StateStore.js', 'utf8');
assert.throws(() => vm.runInNewContext(fs.readFileSync('js/plugins/Arena_Persistence.js', 'utf8'), {}),
    /requer MV_StateStore/, 'missing or incorrectly ordered dependency must fail clearly');
function Game_System() { this.initialize(); }
Game_System.prototype.initialize = function() { this.nativeFlag = true; };
const sandbox = { Game_System, $gameSystem: null,
    DataManager: { extractSaveContents(contents) { sandbox.$gameSystem = contents.system; } } };
vm.runInNewContext(source, sandbox);
const api = sandbox.MVStateStore;
api.register('another-project', 2, { tokens: 0, nested: { label: null } }, (data, version) => {
    assert.ok(version < 2);
    return data || {};
});
sandbox.$gameSystem = new Game_System();
assert.equal(api.read('another-project').tokens, 0);
assert.equal(api.once('another-project', 'reward/chest-1', d => { d.tokens += 5; }), 'applied');
assert.equal(api.once('another-project', 'reward/chest-1', d => { d.tokens += 5; }), 'duplicate');
assert.equal(api.read('another-project').tokens, 5);
const snapshot = api.read('another-project'); snapshot.tokens = 900;
assert.equal(api.read('another-project').tokens, 5, 'reads must not alias saved data');
assert.throws(() => api.once('another-project', 'failed', d => { d.tokens = 99; throw Error('failure'); }));
assert.equal(api.read('another-project').tokens, 5);
assert.equal(api.once('another-project', 'failed', d => { d.tokens++; }), 'applied');
assert.equal(api.once('another-project', 'cancelled', () => false), 'aborted');
assert.equal(api.once('another-project', 'cancelled', () => {}), 'applied');
assert.throws(() => api.once('another-project', 'async', () => Promise.resolve()));
assert.throws(() => api.replace('another-project', { tokens: Infinity }));
assert.throws(() => api.replace('another-project', { tokens: 1, unsupported: new Date() }));
assert.throws(() => api.replace('another-project', { tokens: 'wrong' }));
assert.throws(() => api.once('another-project', '__proto__', () => {}));
const saved = JSON.parse(JSON.stringify(sandbox.$gameSystem));
sandbox.DataManager.extractSaveContents({ system: saved });
assert.equal(api.once('another-project', 'reward/chest-1', () => { throw Error('must not repeat'); }), 'duplicate');
sandbox.DataManager.extractSaveContents({ system: { _persistentState: { schemaVersion: 1, namespaces: {
    'another-project': { version: 1, data: { tokens: 7 }, operations: { 'old/reward': true } }
} } } });
assert.equal(api.read('another-project').tokens, 7);
assert.equal(api.read('another-project').nested.label, null);
assert.equal(api.once('another-project', 'old/reward', () => {}), 'duplicate');
const previous = sandbox.$gameSystem;
assert.throws(() => sandbox.DataManager.extractSaveContents({ system: { _persistentState: { schemaVersion: 99 } } }));
assert.equal(sandbox.$gameSystem, previous, 'unsupported schema must not replace current objects');
assert.throws(() => sandbox.DataManager.extractSaveContents({ system: { _persistentState: {
    schemaVersion: 1, namespaces: { 'another-project': { version: 99, data: {}, operations: {} } }
} } }));
assert.equal(sandbox.$gameSystem, previous);
sandbox.DataManager.extractSaveContents({ system: { nativeFlag: 'legacy' } });
assert.equal(api.read('another-project').tokens, 0);
assert.equal(sandbox.$gameSystem.nativeFlag, 'legacy');
console.log('MV_StateStore: reusable namespace, migration, receipts, rollback, detached snapshots, invalid/future data and legacy defaults passed.');
