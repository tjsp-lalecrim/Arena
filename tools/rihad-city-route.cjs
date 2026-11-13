const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = require('../doc/mapas/RIHAD_PERCURSO_M02.json');

function position(name) {
    const [x, y] = source.anchors[name];
    return {
        x: source.margin + (source.rows[0].length - 1 - x) * source.scale + 1,
        y: source.margin + y * source.scale + 1
    };
}

function build(map, config, recovery) {
    const { rows, scale, margin } = source;
    const width = rows[0].length * scale + 2 * margin;
    const height = rows.length * scale + 2 * margin;
    const data = Array(width * height * 6).fill(0);
    const cell = (x, y) => rows[Math.floor((y - margin) / scale)]?.[Math.floor((x - margin) / scale)] ?? '#';
    const isSolid = value => value === '#' || value === '~';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = cell(x, y);
            const index = y * width + x;
            if (isSolid(value)) {
                const face = !isSolid(cell(x, y + 1)) ? 13 : !isSolid(cell(x, y + 2)) ? 5 : 4;
                data[index] = face;
                data[5 * width * height + index] = 1;
            } else {
                const floor = value === '1' ? 9 : value === '2' ? 2 : 1;
                data[index] = floor;
                data[5 * width * height + index] = 4;
            }
        }
    }

    const rest = position('rest');
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        data[(height + rest.y + dy) * width + rest.x + dx] = 68 + dx + 1 + (dy + 1) * 8;
    }
    const arrival = position('arrival');
    Object.assign(map.events[1], position('informant'));
    Object.assign(map.events[2], rest);
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
        width, height, data,
        note: 'M02-03E2: CITYW1 e 32 quarteirões. Pisos, fachadas, portões e eventos provisórios. Map009 urbano.',
    });
    fs.writeFileSync(path.join(root, 'data/ArenaRecovery.json'), JSON.stringify(recovery, null, 2) + '\n');
}

module.exports = { build, position };
