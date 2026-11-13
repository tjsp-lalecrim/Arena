// Append only the eastern-wing events, leaving previous coordinates and IDs stable.
const fs = require('fs');
const path = require('path');
const addDoor = require('./stonekeep-door-components.cjs');
const copy = value => JSON.parse(JSON.stringify(value));

module.exports = function (map, config) {
    const source = 'doc/mapas/STONEKEEP_ALAS_LESTE_M02.json';
    const { blocks, uncertainWater, pendingAccess } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', source), 'utf8'));
    const encounters = config.encounters.entries;
    if (encounters.length !== 119 || config.doors.length !== 46) {
        throw Error('Stonekeep: base inesperada ao anexar as alas leste.');
    }

    const doorIds = [];
    const template = map.events[encounters[0].eventId];
    const newOrigins = new Set(map.events.filter(Boolean).map(event => [event.x, event.y].join(',')));
    for (const block of blocks) {
        for (const door of block.doors) {
            addDoor(map, config, door);
            const added = config.doors.at(-1);
            doorIds.push(door.id);
            if (door.lockValue !== null) config.access.lockedDoorIds.push(door.id);
            for (const eventId of added.eventIds) {
                const event = map.events[eventId];
                event.note = 'Stonekeep door / MIF ' + door.sourceOriginal.join(',');
                newOrigins.add([event.x, event.y].join(','));
                for (const page of event.pages) {
                    page.list[0].parameters = ['ArenaStonekeepWhole.interactEasternDoor(' + JSON.stringify(door.id) + ');'];
                }
            }
        }
        for (const entry of block.entries) {
            const [x, y] = entry.origin;
            const eventId = map.events.length;
            const region = map.data[(5 * map.height + y) * map.width + x];
            if (region !== 4 || newOrigins.has(entry.origin.join(',')) ||
                encounters.some(existing => existing.id === entry.id)) {
                throw Error('Stonekeep: origem de encontro inválida ' + entry.id);
            }
            const event = copy(template);
            Object.assign(event, { id: eventId, x, y, name: entry.species, note: 'ArenaEncounter:' + entry.id });
            event.pages[0].list[0].parameters = ['ArenaEncounters.start(' + JSON.stringify(entry.id) + ');'];
            map.events.push(event);
            encounters.push({ ...entry, eventId });
            newOrigins.add(entry.origin.join(','));
        }
    }
    if (encounters.length !== 180 || config.doors.length !== 70) throw Error('Stonekeep: inventário incompleto.');
    config.easternWings = { source, doorIds, uncertainWater, pendingAccess };
    config.coverage.implementedEncounters = encounters.length;
    config.coverage.implementedDoors = config.doors.length;
    config.context.coverage = '180 encontros ·70 portas · exploração contínua';
};
