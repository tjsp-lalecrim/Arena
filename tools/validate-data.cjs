const fs = require('node:fs');
const assert = require('node:assert/strict');
const read = name => JSON.parse(fs.readFileSync('data/' + name + '.json', 'utf8'));
const tables = {};
for (const file of fs.readdirSync('data').filter(name => name.endsWith('.json'))) {
    const name = file.slice(0, -5);
    tables[name] = read(name);
    assert.ok(!/Ã[\u0080-\u00bf]|Ã[\u0152\u0153\u0160\u0161\u0178\u017d\u017e]|Â[\u0080-\u00bf]|â€/.test(JSON.stringify(tables[name])),
        name + ' has incorrectly decoded UTF-8');
    if (Array.isArray(tables[name])) tables[name].forEach((record, i) => {
        if (record && 'id' in record) assert.equal(record.id, i, name + ' ID/index');
    });
}
const system = tables.System;
assert.equal(system.terms.commands[11], 'Opções');
assert.equal(system.terms.basic[0], 'Nível');
function exists(table, id) { assert.ok(tables[table][id], table + ' missing ID ' + id); }
for (const actor of tables.Actors.filter(Boolean)) {
    exists('Classes', actor.classId);
    actor.equips.forEach((id, index) => { if (id) exists(index ? 'Armors' : 'Weapons', id); });
}
for (const troop of tables.Troops.filter(Boolean)) troop.members.forEach(member => exists('Enemies', member.enemyId));
for (const enemy of tables.Enemies.filter(Boolean)) {
    enemy.actions.forEach(action => exists('Skills', action.skillId));
    assert.ok(enemy.params[0] > 0);
    assert.equal(enemy.gold, 0, 'Loot belongs to its source resolver');
    assert.ok(enemy.dropItems.every(drop => drop.kind === 0));
}
for (const cls of tables.Classes.filter(Boolean)) {
    assert.equal(cls.params.length, 8);
    assert.ok(cls.params.every(curve => curve.length === 100));
    cls.learnings.forEach(learning => exists('Skills', learning.skillId));
}
for (const kind of ['Items', 'Skills']) for (const record of tables[kind].filter(Boolean)) {
    if (record.animationId > 0) exists('Animations', record.animationId);
    assert.equal(record.tpGain, 0, 'No implicit TP recovery');
    for (const effect of record.effects) {
        if ([21, 22].includes(effect.code) && effect.dataId > 0) exists('States', effect.dataId);
        if (effect.code === 43) exists('Skills', effect.dataId);
    }
}
for (const weapon of tables.Weapons.filter(Boolean)) assert.ok(system.weaponTypes[weapon.wtypeId]);
for (const armor of tables.Armors.filter(Boolean)) {
    assert.ok(system.armorTypes[armor.atypeId]);
    assert.ok(system.equipTypes[armor.etypeId]);
}
const cls = tables.Classes[1];
system.weaponTypes.slice(1).forEach((_, i) => assert.ok(cls.traits.some(t => t.code === 51 && t.dataId === i + 1)));
system.armorTypes.slice(1).forEach((_, i) => assert.ok(cls.traits.some(t => t.code === 52 && t.dataId === i + 1)));
assert.equal(tables.Items[1].itypeId, 2);
assert.equal(tables.Items[1].price, 0);
assert.equal(tables.Items[1].consumable, false);
assert.equal(tables.ArenaCatalog.races.length, 8);
assert.equal(new Set(tables.ArenaCatalog.races.map(r => r.id)).size, 8);
for (const race of tables.ArenaCatalog.races) {
    assert.ok(fs.existsSync('doc/wiki/' + race.source));
    if (race.bonus.stateId) exists('States', race.bonus.stateId);
    if (race.bonus.elementId) assert.ok(system.elements[race.bonus.elementId]);
}
for (const info of tables.MapInfos.filter(Boolean)) {
    const map = tables['Map' + String(info.id).padStart(3, '0')];
    assert.ok(map);
    exists('Tilesets', map.tilesetId);
    assert.equal(map.data.length, map.width * map.height * 6);
    for (const event of map.events.filter(Boolean)) {
        assert.ok(event.x >= 0 && event.x < map.width && event.y >= 0 && event.y < map.height);
    }
}
exists('MapInfos', system.startMapId);
const map = tables['Map' + String(system.startMapId).padStart(3, '0')];
assert.ok(system.startX < map.width && system.startY < map.height);
console.log('Dados M01: JSON, IDs, referências, equipamentos livres, fontes raciais, loot desativado e mapa válidos.');
