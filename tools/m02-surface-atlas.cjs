const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const firstTile = 256; // Native Tileset C, following RPG Maker MV's 8-column tile ID layout.

module.exports = function installSurfaceAtlas(config) {
    const file = path.join(root, 'data/Tilesets.json');
    const list = JSON.parse(fs.readFileSync(file, 'utf8'));
    const base = list[4]; // Preserve the A1 and B sheets, including their existing flags.
    if (list[config.tilesetId] && list[config.tilesetId].tilesetNames[6] !== config.sheet) {
        throw Error('ID de tileset ocupado: ' + config.tilesetId);
    }
    const spec = {
        ...base,
        id: config.tilesetId,
        name: config.name,
        note: 'C: superfícies M02 de 48 px. A1/B: superfícies e objetos já utilizados.',
        flags: base.flags.slice(),
        tilesetNames: base.tilesetNames.slice(),
    };
    spec.tilesetNames[6] = config.sheet;
    const floors = Object.keys(config.floors);
    const walls = Object.keys(config.walls);
    // Four floor quadrants repeat in a 2×2 pattern. The nine wall pieces
    // encode cap/upper face/lower face, each with a plain/left/right edge.
    const wallStart = floors.length * 4;
    if (wallStart + walls.length * 9 > 128) throw Error('Atlas C excede o bloco nativo de oito colunas.');
    spec.flags.fill(base.flags[1], firstTile, firstTile + wallStart);
    spec.flags.fill(base.flags[4], firstTile + wallStart, firstTile + wallStart + walls.length * 9);
    list[spec.id] = spec;
    const json = '[\n' + list.map(entry => JSON.stringify(entry)).join(',\n') + '\n]\n';
    // Idempotent when the city and both mine levels rebuild in the same pipeline.
    if (fs.readFileSync(file, 'utf8') !== json) fs.writeFileSync(file, json);
    return {
        floor(family, x, y) {
            const index = floors.indexOf(family);
            if (index < 0) throw Error('Família de piso desconhecida: ' + family);
            return firstTile + index * 4 + (x & 1) + 2 * (y & 1);
        },
        wall(family, height, edge) {
            const index = walls.indexOf(family);
            if (index < 0) throw Error('Família de parede desconhecida: ' + family);
            return firstTile + wallStart + index * 9 + height * 3 + edge;
        },
    };
};
