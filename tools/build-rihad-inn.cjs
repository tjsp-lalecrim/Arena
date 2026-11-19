// The confirmed TAVERN4 ground plan; presentation reuses existing interior materials.
const fs = require('node:fs');
const path = require('node:path');
const plan = require('../doc/mapas/RIHAD_POUSADA_M02.json');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

module.exports = function buildInn(city, config, recovery) {
    const width = plan.rows[0].length * plan.scale + 2 * plan.margin;
    const height = plan.rows.length * plan.scale + 2 * plan.margin;
    const layer = width * height;
    const data = Array(layer * 6).fill(0);
    const position = ([x, y]) => ({ x: 3 + (24 - x) * 3, y: 3 + y * 3 });
    function cell(x, y) {
        const col = Math.floor((x - plan.margin) / plan.scale);
        const row = Math.floor((y - plan.margin) / plan.scale);
        const ox = plan.rows[0].length - 1 - col;
        if (col < 0 || row < 0) return '#';
        const value = plan.rows[row]?.[ox] ?? '#';
        if (value !== 'D' && value !== 'E') return value;
        const vertical = value === 'E' || plan.rows[row - 1]?.[ox] !== '#' && plan.rows[row + 1]?.[ox] !== '#';
        return ((vertical ? x : y) - plan.margin) % plan.scale === 1 ? '.' : '#';
    }
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const solid = cell(x, y) === '#';
        data[y * width + x] = solid ? cell(x, y + 1) !== '#' ? 13 : cell(x, y + 2) !== '#' ? 5 : 4 : 1 + x % 2 + y % 2 * 8;
        data[5 * layer + y * width + x] = solid ? 1 : 4;
    }
    const template = read('data/Map008.json').events[241].pages[0];
    function event(id, name, at, script, character = '', trigger = 0) {
        const page = JSON.parse(JSON.stringify(template));
        Object.assign(page, { trigger, priorityType: character ? 1 : 0, through: !character, directionFix: true, walkAnime: false });
        Object.assign(page.image, { characterName: character, characterIndex: 0, direction: 2, pattern: 0 });
        page.list = [{ code: 355, indent: 0, parameters: [script] }, { code: 0, indent: 0, parameters: [] }];
        return { id, name, note: 'TAVERN4; apresentação provisória de reuso', ...at, pages: [page] };
    }
    const entry = position(plan.anchors.entry);
    const exit = position(plan.anchors.exit);
    const bed = position(plan.anchors.bed);
    // Bed IMG is a side of the original low furniture at (4,2). Its footprint stays solid.
    bed.y++;
    const keeper = position(plan.anchors.keeper);
    config.inn = {
        name: plan.name, areaId: 'rihad.inn', accessEventId: plan.exterior.eventId,
        entry: { id: 'rihad.inn.entry', mapId: plan.mapId, ...entry, direction: 8 },
        exit: { id: 'rihad.inn.exit', mapId: 9, x: plan.exterior.approach[0], y: plan.exterior.approach[1], direction: 6 },
        exitEventId: 1, bedEventId: 2, keeperEventId: 3,
        entrance: plan.exterior.tile, approach: plan.exterior.approach, bed,
        exteriorRoute: plan.exteriorRoute, roomRoute: plan.roomRoute,
    };
    const map = { ...read('data/Map001.json'), width, height, data, tilesetId: 8,
        note: 'TAVERN4; planta original, materiais de reuso e cama adaptada. Sem cobrança/passagem de horas.',
        displayName: '', encounterList: [], scrollType: 0, parallaxName: '', specifyBattleback: false,
        events: [null,
            event(1, 'Sair para Rihad', exit, 'ArenaRihad.leaveInn(this);', '', 1),
            event(2, 'Cama — descanso autorizado', bed, "ArenaRecovery.usePoint('MQ02.rihad.rest',this);"),
            event(3, 'Estalajadeiro — representação de reuso', keeper, 'ArenaRihad.innkeeper(this);', '$Arena_redguard_male_walk_r02')],
    };
    map.events[2].pages[0].priorityType = 1;
    map.events[2].pages[0].through = false;
    data[layer + (bed.y - 1) * width + bed.x] = 768;
    data[layer + bed.y * width + bed.x] = 776;
    fs.writeFileSync(path.join(root, 'data/Map018.json'), JSON.stringify(map) + '\n');
    const sets = read('data/Tilesets.json');
    if (sets[8] && sets[8].name !== 'Pousada de Rihad — materiais de reuso') throw Error('Tileset 8 ocupado');
    sets[8] = { ...sets[4], id: 8, name: 'Pousada de Rihad — materiais de reuso', flags: sets[4].flags.slice(), tilesetNames: sets[4].tilesetNames.slice() };
    sets[8].tilesetNames[8] = 'Arena_Inn_Bed_V01_E';
    sets[8].flags[768] = sets[8].flags[776] = 15;
    fs.writeFileSync(path.join(root, 'data/Tilesets.json'), '[\n' + sets.map(s => JSON.stringify(s)).join(',\n') + '\n]\n');
    require('./rihad-interior-materials.cjs')(map, 'inn');
    fs.writeFileSync(path.join(root, 'data/Map018.json'), JSON.stringify(map) + '\n');
    const infos = read('data/MapInfos.json');
    if (infos[18] && infos[18].name !== plan.name) throw Error('Mapa 18 ocupado');
    infos[18] = { id: 18, name: plan.name, order: 18, parentId: 9, expanded: true, scrollX: 0, scrollY: 0 };
    fs.writeFileSync(path.join(root, 'data/MapInfos.json'), '[\n' + infos.map(s => JSON.stringify(s)).join(',\n') + '\n]\n');
    const file = path.join(root, 'data/ArenaCampaign.json');
    const area = { id: 'rihad.inn', questId: 'MQ02', mapId: plan.mapId };
    const existing = read('data/ArenaCampaign.json').areas.find(a => a.id === area.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(area)) throw Error('Área da pousada divergente');
    if (!existing) fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('"areas": [', '"areas": [\n    ' + JSON.stringify(area) + ','));
    city.events[2] = null;
    city.events[plan.exterior.eventId] = event(plan.exterior.eventId, plan.name + ' — entrada', { x: plan.exterior.tile[0], y: plan.exterior.tile[1] }, 'ArenaRihad.enterInn(this);');
    city.events[plan.exterior.eventId].pages[0].priorityType = 1;
    city.events[plan.exterior.eventId].pages[0].through = false;
    Object.assign(recovery.restPoints.find(p => p.id === config.restPointId), { mapId: plan.mapId, eventId: 2, ...bed, footprint: [[0,0],[0,-1]], source: 'Cama da pousada de Rihad; TAVERN4, repouso integral gratuito adaptado.' });
};
