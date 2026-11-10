const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const url = 'http://127.0.0.1:8774/';

async function coverage(page) {
    return page.evaluate(() => {
        const config = $arenaStonekeepWhole;
        const start = [config.context.entry.x, config.context.entry.y];
        const dirs = [2, 4, 6, 8];
        const forbidden = new Set(config.easternWings.uncertainWater);
        const remaining = new Map(config.doors.map(door => [door.id, door]));
        const opened = [];
        const key = (x, y) => x + ',' + y;

        function flood() {
            const blocked = new Set();
            for (const door of remaining.values()) {
                for (const id of door.eventIds) {
                    const event = $gameMap.event(id);
                    if (!event.isThrough()) blocked.add(key(event.x, event.y));
                }
            }
            const seen = new Set([start.join(',')]);
            const todo = [start];
            for (let i = 0; i < todo.length; i++) {
                const [x, y] = todo[i];
                for (const d of dirs) {
                    const nx = $gameMap.roundXWithDirection(x, d);
                    const ny = $gameMap.roundYWithDirection(y, d);
                    const dest = key(nx, ny);
                    if (seen.has(dest) || blocked.has(dest) || !$gameMap.isValid(nx, ny)) continue;
                    if ($gameMap.regionId(nx, ny) === 5 &&
                        forbidden.has(key(89 - Math.floor((nx - 2) / 3), Math.floor((ny - 2) / 3)))) continue;
                    if (!$gamePlayer.isMapPassable(x, y, d)) continue;
                    seen.add(dest);
                    todo.push([nx, ny]);
                }
            }
            return seen;
        }

        let seen;
        let progress;
        do {
            seen = flood();
            progress = false;
            for (const door of remaining.values()) {
                const [x, y] = door.center;
                const approaches = door.axis === 'east-west' ? [[x-2,y],[x+2,y]] : [[x,y-2],[x,y+2]];
                const side = approaches.find(p => seen.has(p.join(',')));
                if (!side) continue;
                $gamePlayer.locate(...side);
                if (door.lockValue !== null) {
                    if (!ArenaStonekeepAccess.force(door.id)) throw Error('Cannot force ' + door.id);
                    for (let i = 0; i < 200 && ArenaStonekeepAccess.working(); i++) $gameMap.update(false);
                    if (!ArenaStonekeepAccess.isUnlocked(door.id)) throw Error('Still locked ' + door.id);
                } else if (!ArenaDungeon.openDoor(door.id)) {
                    throw Error('Cannot open ' + door.id);
                }
                for (let i = 0; i < 100 && $gameMap._arenaDoorTransitions?.[door.id]; i++) $gameMap.update(false);
                $gameMap.refresh();
                if (!door.eventIds.every(id => $gameMap.event(id).isThrough())) throw Error('Still closed ' + door.id);
                remaining.delete(door.id);
                opened.push(door.id);
                progress = true;
            }
        } while (progress);

        const unreachable = config.encounters.entries.filter(e => {
            const [x, y] = e.origin;
            return !dirs.some(d => {
                const nx = $gameMap.roundXWithDirection(x, d);
                const ny = $gameMap.roundYWithDirection(y, d);
                return seen.has(key(nx, ny)) && $gamePlayer.isMapPassable(nx, ny, 10-d);
            });
        }).map(e => e.id);
        return {
            reachableTiles: seen.size, opened,
            blockedDoors: [...remaining.keys()], unreachable,
            source: seen.has(config.context.source.join(',')),
            exit: seen.has(config.context.exit.join(',')),
            dryCrossing: [[181,222],[182,222]].every(p => seen.has(p.join(','))),
            provisions: [...(config.treasures || []), ...$arenaRecovery.restPoints.filter(p => p.mapId === 15)]
                .filter(p => !seen.has(key(p.x, p.y))).map(p => p.id)
        };
    });
}

async function run() {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(url);
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Title && SceneManager._scene._commandWindow?.active);
        await page.evaluate(() => ArenaStonekeepWhole.preview());
        await page.waitForFunction(() => $gameMap.mapId() === 15 && !$gamePlayer.isTransferring());
        const result = await coverage(page);
        console.log(JSON.stringify(result));
        assert.deepEqual(result.unreachable.sort(), (await page.evaluate(() => $arenaStonekeepWhole.easternWings.pendingAccess)).sort());
        assert.deepEqual(result.blockedDoors, []);
        assert.deepEqual(result.provisions, []);
        assert.equal(result.opened.length, 70);
        assert(result.source && result.exit && result.dryCrossing);
        assert.deepEqual(errors, []);
    } finally {
        await browser.close();
    }
}
module.exports = { coverage, url };
if (require.main === module) run().catch(e => { console.error(e); process.exitCode = 1; });
