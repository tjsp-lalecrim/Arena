const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = require('../doc/mapas/RIHAD_PERCURSO_M02.json');
const signage = require('../doc/mapas/RIHAD_SINALIZACAO_M02.json');
const materialPlan = require('../doc/mapas/RIHAD_MATERIAIS_M02.json');
const materialSpec = require('../doc/arte/m02-tilesets/rihad.json');
const installAtlas = require('./m02-surface-atlas.cjs');

function position(name) {
    const [x, y] = source.anchors[name];
    return {
        x: source.margin + (source.rows[0].length - 1 - x) * source.scale + 1,
        y: source.margin + y * source.scale + 1
    };
}

function build(map, config, recovery) {
    const { rows, scale, margin } = source;
    map.arenaDecor = []; map.arenaDecorSigns = []; map.arenaDecorBlocked = [];
    if (signage.map1Sha256 !== source.map1Sha256 || materialPlan.map1Sha256 !== source.map1Sha256 ||
        materialPlan.rows.length !== rows.length ||
        materialPlan.rows.some((row, i) => row.length !== rows[i].length)) {
        throw Error('Materiais de Rihad não correspondem à planta urbana.');
    }
    const atlas = installAtlas(materialSpec);
    const at = (x, y) => materialPlan.rows[Math.floor((y - margin) / scale)]?.[Math.floor((x - margin) / scale)];
    const width = rows[0].length * scale + 2 * margin;
    const height = rows.length * scale + 2 * margin;
    const data = Array(width * height * 6).fill(0);
    const passages = new Map(source.gardenAccess.passages.map(({ original: [x, y], axis }) => [
        y * rows[0].length + rows[0].length - 1 - x, axis,
    ]));
    function cell(x, y) {
        const tileX = x - margin;
        const tileY = y - margin;
        const col = Math.floor(tileX / scale);
        const row = Math.floor(tileY / scale);
        const value = rows[row]?.[col] ?? '#';
        if (col < 0 || col >= rows[0].length) return value;
        const axis = passages.get(row * rows[0].length + col);
        if (!axis) return value;
        // Keep the edge of the hedge on both sides of the original opening.
        const cross = axis === 'north-south' ? tileX : tileY;
        return cross % scale === Math.floor(scale / 2) ? '2' : '#';
    }
    const isSolid = value => value === '#' || value === '~';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = cell(x, y);
            const index = y * width + x;
            if (isSolid(value)) {
                if (value === '~') {
                    data[index] = 4; // Keep the existing provisional blocked coast.
                } else {
                    const elevation = !isSolid(cell(x, y + 1)) ? 2 : !isSolid(cell(x, y + 2)) ? 1 : 0;
                    const left = cell(x - 1, y);
                    const right = cell(x + 1, y);
                    const edge = !isSolid(left) ? 1 : !isSolid(right) ? 2 : 0;
                    const original = at(x, y);
                    const gate = (original === 'm' || original === 'c') && [x - 1, x + 1, x - scale, x + scale]
                        .some(side => at(side, y) === 'g');
                    const family = gate ? (y < height / 2 ? 'g' : 'i') :
                        original === 'h' && elevation === 2 ? 'l' :
                        Object.hasOwn(materialSpec.walls, original) ? original : 'm';
                    data[index] = atlas.wall(family, elevation, edge);
                }
                data[5 * width * height + index] = 1;
            } else {
                const original = at(x, y);
                const floor = value === 'G' || original === 'j' ? 'threshold' :
                    value === '1' ? 'walk' : value === '2' ? 'earth' : 'road';
                data[index] = atlas.floor(floor, x, y);
                data[5 * width * height + index] = 4;
            }
        }
    }

    const rest = position('rest');
    const arrival = position('arrival');
    function putDoor(x, y, piece) {
        const index = y * width + x;
        if (!isSolid(cell(x, y)) || data[width * height + index]) {
            throw Error('Sobreposição de porta decorativa em Rihad: ' + x + ',' + y);
        }
        data[width * height + index] = atlas.closedDoor(piece);
    }
    for (const { tile: [x, y], approach, side } of signage.doors) {
        if (isSolid(cell(...approach))) throw Error('Placa sem acesso em Rihad: ' + approach.join(','));
        if (side === 2) {
            putDoor(x, y - 1, 'lintel');
            putDoor(x, y, 'leaf');
        } else {
            putDoor(x, y, side === 8 ? 'back' : 'side');
        }
    }
    config.signage = {
        signs: signage.signs,
        audienceRoute: [signage.audienceStart, ...signage.routeCorners, signage.court],
        doors: signage.doors.map(({ type, tile, approach, side }) => ({ type, tile, approach, side })),
    };
    Object.assign(map.events[1], position('informant'));
    config.informantVisual={characterName:'$Arena_Rihad_Informant_V01',faceName:'Arena_Rihad_Informant_V01',faceIndex:0,direction:2};
    map.events[1].name='Informante de Rihad';
    map.events[1].note='Conjunto visual V01: civil regional interpretado; imóvel, direção sul fixa. doc/arte/rihad-informant-v01/generation.json';
    Object.assign(map.events[1].pages[0].image,{characterName:config.informantVisual.characterName,characterIndex:0,direction:2,pattern:1});

    Object.assign(map.events[3], position('road'));
    Object.assign(map.events[4], position('outskirts'));
    // Enter the interior by touching the provisional palace door.
    Object.assign(map.events[5], position('courtDoor'));
    Object.assign(map.events[6], position('courtDoor'));
    Object.assign(config.arrival, arrival, { direction: 2 });
    Object.assign(config.outskirts.return, arrival, { direction: 2 });
    Object.assign(config.court.exit, position('courtExit'), { direction: 8 });
    const restPoint = recovery.restPoints.find(point => point.id === config.restPointId);
    Object.assign(restPoint, rest, { source: 'MQ02-03E2: repouso autorizado na esplanada inicial de Rihad, posição adaptada.' });
    Object.assign(map, {
        width, height, data, tilesetId: materialSpec.tilesetId,
        note: 'M02: CITYW1 e 32 quarteirões; superfícies DCN do atlas exterior V01.',
    });
    require('./build-rihad-inn.cjs')(map, config, recovery);
    require('./m02-scenery.cjs').urban(map);
    require('./rihad-npcs.cjs')(map, config, 9);
    require('./rihad-facade-props.cjs')(map);
    require('./rihad-lateral-entries.cjs')(map,'urban');
    require('./rihad-decor-contracts.cjs').finalize(map);
    fs.writeFileSync(path.join(root, 'data/ArenaRecovery.json'), JSON.stringify(recovery, null, 2) + '\n');
}

module.exports = { build, position };
