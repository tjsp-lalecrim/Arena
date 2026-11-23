// Presentation for the two existing interiors. Native passage flags remain the contract.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const plan = require('../doc/mapas/RIHAD_INTERIORES_VISUAIS_M02.json');
const art = require('../doc/arte/RIHAD_INTERIORES_EXPORTS_V01.json');

module.exports = function applyInterior(map, kind) {
    const data = map.data, width = map.width, height = map.height, layer = width * height;
    const source = plan[kind], sourceWidth = source.walls[0].length;
    const setsFile = path.join(root, 'data/Tilesets.json');
    const sets = JSON.parse(fs.readFileSync(setsFile, 'utf8'));
    const prior = sets[map.tilesetId];
    const id = kind === 'inn' ? 9 : 10;
    if (sets[id] && sets[id].name !== 'Rihad interior V01 — ' + kind) throw Error('Tileset interior ocupado: ' + id);
    const tileset = { ...prior, id, name: 'Rihad interior V01 — ' + kind,
        tilesetNames: prior.tilesetNames.slice(), flags: prior.flags.slice() };
    tileset.tilesetNames[6] = 'Arena_Rihad_Interiors_V01_C';
    tileset.tilesetNames[7] = 'Arena_Rihad_Interiors_V01_D';
    for (const [name, tile] of Object.entries(art.tiles)) tileset.flags[tile] = /^(wood|rubble|ashlar)/.test(name) ? 15 : 0;
    tileset.flags.fill(16, 512, 640); // Separate visual objects do not close established paths.
    const original = (x, y) => [sourceWidth - 1 - Math.floor((x - 2) / 3), Math.floor((y - 2) / 3)];
    const region = (x, y) => data[5 * layer + y * width + x];
    const blocked = (x, y) => x < 0 || x >= width || y < 0 || y >= height || region(x,y) !== 4;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const [ox, oy] = original(x,y), solid = blocked(x,y);
        let tile;
        if (solid) {
            const family = kind === 'inn' ? 'wood' : source.walls[oy]?.[ox] === 'c' ? 'rubble' : 'ashlar';
            const furniture=source.walls[oy]?.[ox]==='f';
            const elevation = furniture ? 0 : !blocked(x,y+1) ? 2 : !blocked(x,y+2) ? 1 : 0;
            const edge = !blocked(x-1,y) ? 1 : !blocked(x+1,y) ? 2 : 0;
            tile = art.tiles[family + elevation + edge];
        } else {
            const floor = source.floors[oy]?.[ox];
            const carpet = kind === 'court' && floor === 'r';
            if (carpet) {
                const same = (dx,dy) => {
                    const [xx,yy] = original(x+dx,y+dy);
                    return !blocked(x+dx,y+dy) && source.floors[yy]?.[xx] === 'r';
                };
                const cx = !same(-1,0) ? 0 : !same(1,0) ? 2 : 1;
                const cy = !same(0,-1) ? 0 : !same(0,1) ? 2 : 1;
                tile = art.tiles['red' + (cx+3*cy)];
            } else {
                const family = kind === 'inn' ? 'inn' : floor === 'p' ? 'pale' : floor === 'm' ? 'marble' : 'darkMarble';
                tile = art.tiles[family + ((x&1)+2*(y&1))];
            }
        }
        const previousFlag = prior.flags[data[y * width + x]] & 15;
        if ((tileset.flags[tile] & 15) !== previousFlag) throw Error('Interior changed passage at ' + kind + ':' + x + ',' + y);
        data[y * width + x] = tile;
    }
    function object(name, x, y) {
        const object = art.objects[name];
        if (!object) throw Error('Objeto não exportado: ' + name);
        for (let dy = 0; dy < object.height; dy++) for (let dx = 0; dx < object.width; dx++) {
            const xx=x+dx, yy=y+dy;
            if(xx<0||yy<0||xx>=width||yy>=height)throw Error('Objeto fora do mapa');
            if (data[layer+yy*width+xx]) throw Error('Sobreposição de objetos em ' + kind + ':' + xx + ',' + yy);
            data[layer+yy*width+xx] = object.tile+dx+dy*8;
        }
    }
    for (const door of source.doors) {
        const [ox,oy] = door.original, x = 3 + (sourceWidth-1-ox)*3, y=3+oy*3;
        const vertical = !blocked(x,y-1) && !blocked(x,y+1);
        object(vertical?'frame':'frameEW',vertical?x:x-1,vertical?y-1:y);
    }
    for (const prop of source.props) {
        const [ox,oy] = prop.original, offset=prop.offset||[0,0], item=art.objects[prop.type];
        const x=3+(sourceWidth-1-ox)*3+offset[0]-Math.floor(item.width/2);
        const y=3+oy*3+offset[1]-item.height+1;
        object(prop.type,x,y);
    }
    for (const [ox,oy] of source.steps || []) {
        const x=3+(sourceWidth-1-ox)*3,y=3+oy*3;
        for(let dx=-1;dx<=1;dx++)if(!blocked(x+dx,y))data[y*width+x+dx]=art.tiles['step'+(dx+1)];
    }
    sets[id] = tileset;
    fs.writeFileSync(setsFile,'[\n'+sets.map(s=>JSON.stringify(s)).join(',\n')+'\n]\n');
    map.tilesetId = id;
    require('./rihad-interior-decor.cjs')(map,kind);
    require('./rihad-lateral-entries.cjs')(map,kind);
};
