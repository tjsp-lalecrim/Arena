const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const copy = value => JSON.parse(JSON.stringify(value));
const world = ([x, y]) => [3 + 3 * (89 - x), 3 + 3 * y];

module.exports = function (map, config) {
    const inventory = read('doc/evidencias/m02-stonekeep-cobertura/inventario.json');
    const dungeon = read('data/ArenaDungeon.json');
    const imperial = read('data/Map008.json');
    const recovery = read('data/ArenaRecovery.json');
    const treasureTemplate = imperial.events[dungeon.integration.treasures[0].eventId];
    const refugeTemplate = imperial.events[recovery.restPoints.find(point => point.dungeonRefuge).eventId];
    const containerFlats = new Set([7, 8, 9, 10, 11, 17, 18]); // STKEEP1 ITEM2–8.
    const blockedTreasures = new Set(['21,4', '12,5', '11,13', '16,13']);
    const blockedRefuge = '50,60';

    function append(source, id, template, name, call) {
        const [x, y] = world(source.original);
        const eventId = map.events.length;
        if (map.data[(5 * map.height + y) * map.width + x] !== 4 ||
            map.events.some(event => event && event.x === x && event.y === y)) {
            throw Error('Stonekeep: origem de provisão inválida ' + id);
        }
        const event = copy(template);
        Object.assign(event, { id: eventId, name, x, y, note: id });
        event.pages[0].list[0].parameters = [call];
        map.events.push(event);
        return { id, eventId, x, y, sourceOriginal: source.original };
    }

    config.treasures = inventory.optionalSources
        .filter(source => containerFlats.has(source.flat) && !blockedTreasures.has(source.original.join(',')))
        .map(source => ({
            ...append(source, 'MQ02.stonekeep.treasure.' + source.original.join('.'),
                treasureTemplate, 'Tesouro de Stonekeep', 'ArenaStonekeepWhole.collectTreasure(this);'),
            sourceFlat: source.resource
        }));
    recovery.restPoints = recovery.restPoints.filter(point => !point.id.startsWith('MQ02.stonekeep.refuge.'));
    for (const source of inventory.platformCandidates) {
        if (source.original.join(',') === blockedRefuge) continue;
        const id = 'MQ02.stonekeep.refuge.' + source.original.join('.');
        const point = append(source, id, refugeTemplate, 'Refúgio de Stonekeep',
            'ArenaRecovery.usePoint(' + JSON.stringify(id) + ', this);');
        map.events[point.eventId].note = 'ArenaRecovery:' + id;
        recovery.restPoints.push({
            ...point, mapId: config.mapId, technical: false, authorizedRefuge: true,
            source: 'STKEEP1 0x1808. Refúgio adaptado com apoio seco e acesso auditado.'
        });
    }
    config.provisionsPending = { treasures: [...blockedTreasures], refuges: [blockedRefuge] };
    fs.writeFileSync(path.join(root, 'data/ArenaRecovery.json'), JSON.stringify(recovery, null, 2) + '\n');
};
