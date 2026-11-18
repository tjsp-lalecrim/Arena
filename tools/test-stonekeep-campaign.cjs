const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const { coverage, url } = require('./test-stonekeep-coverage.cjs');
const battleControls = require('./battle-test-controls.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'doc/evidencias/m02-rihad-pousada/campanha.json');
const rihadTileset = require('../doc/arte/m02-tilesets/rihad.json').tilesetId;
const { gardenAccess } = require('../doc/mapas/RIHAD_PERCURSO_M02.json');
const signage = require('../doc/mapas/RIHAD_SINALIZACAO_M02.json');
const generated = ['Map009', 'Map018', 'Map011', 'Map012', 'Map015', 'ArenaCampaign', 'ArenaRecovery', 'ArenaRihad', 'ArenaStonekeep', 'ArenaStonekeepWhole']
    .map(name => path.join(root, 'data', name + '.json'));
const canonical = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const bytes = generated.map(canonical);
execFileSync(process.execPath, ['tools/build-rihad-arrival.cjs'], { cwd: root });
generated.forEach((file, i) => assert.equal(canonical(file), bytes[i], file));
const hound = require('../doc/arte/hell-hound-v01/config.json');
for (const name of ['Map012', 'Enemies', 'Troops', 'ArenaLoot', 'ArenaCampaign']) {
    const file = 'data/' + name + '.json';
    const prior = JSON.parse(execFileSync('git', ['show', 'fea73e0:' + file], { cwd: root, encoding: 'utf8' }));
    const current = JSON.parse(fs.readFileSync(path.join(root, file)));
    // The subsequent Fang Lair delivery only appended this creature and its two lower-level encounters.
    if (name === 'Enemies') current.splice(hound.enemyId, 1);
    if (name === 'Troops') current.splice(hound.troopId, 1);
    if (name === 'ArenaLoot') delete current.enemies[hound.enemyId];
    if (name === 'ArenaCampaign') {
        current.areas = current.areas.filter(a => a.id !== 'rihad.inn');
        const lower = current.areas.find(area => area.id === 'fang-lair.lower').encounters;
        lower.entries = lower.entries.filter(entry => entry.enemyId !== hound.enemyId);
        delete lower.mapVisuals[hound.enemyId];
    }
    assert.deepEqual(current, prior, file);
}

async function run() {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1080, height: 850 } });
        const errors = [], missing = [], checks = [];
        page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
        page.on('response', res => { if (res.status() >= 400) missing.push(res.url()); });
        const title = () => page.waitForFunction(() => SceneManager._scene instanceof Scene_Title && SceneManager._scene._commandWindow?.isOpenAndActive());
        const map = id => page.waitForFunction(id => SceneManager._scene instanceof Scene_Map &&
            SceneManager._scene.isActive() && !SceneManager.isSceneChanging() &&
            !$gamePlayer.isTransferring() && $gamePlayer.canMove() &&
            (!id || $gameMap.mapId() === id), id);
        const key = async k => { await page.keyboard.press(k, { delay: 90 }); await page.waitForTimeout(175); };
        async function captureCity(name) {
            fs.mkdirSync(path.dirname(output), { recursive: true });
            await page.evaluate(() => $gamePlayer.center($gamePlayer.x, $gamePlayer.y));
            await page.waitForTimeout(400);
            await page.locator('#GameCanvas').screenshot({ path: path.join(path.dirname(output), name + '.png') });
        }
        const stage = () => page.evaluate(() => ArenaQuests.snapshot('MQ02').stage);
        const state = () => page.evaluate(() => ({
            arena: ArenaPersistence.snapshot(), loot: ArenaLoot.snapshot(),
            resources: ArenaResources.snapshot(), points: ArenaAttributes.snapshot(),
            items: $gameParty._items, gold: $gameParty.gold(), exp: $gameActors.actor(1).currentExp()
        }));
        async function settle(expectChoice = false, messages) {
            for (let i = 0; i < 420; i++) {
                const status = await page.evaluate(collectText => {
                    const w = SceneManager._scene._messageWindow;
                    if(w?._textState)w._showFast=true;
                    return { busy: $gameMessage.isBusy() || $gameMap.isEventRunning(),
                        paused: w?.pause && !w._waitCount && !w._choiceWindow.active,
                        choice: w?._choiceWindow.isOpenAndActive() && !w._choiceWindow._arenaCourtAwaitNeutral,
                        text: collectText ? $gameMessage.allText() : null };
                }, !!messages);
                if (messages && status.text) messages.add(status.text);
                if (expectChoice && status.choice) return;
                if (!expectChoice && !status.busy) return;
                if (status.paused && !status.choice) await key('Enter');
                else await page.waitForTimeout(65);
            }
            throw Error('Diálogo não terminou na condição esperada. ' + JSON.stringify(await page.evaluate(() => ({
                map:$gameMap.mapId(), position:[$gamePlayer.x,$gamePlayer.y,$gamePlayer.direction()],
                stage:ArenaQuests.snapshot('MQ02').stage, text:$gameMessage.allText(),
                choice:$gameMessage.choices(), running:$gameMap.isEventRunning()
            }))));
        }
        async function chooseFirst() {
            await settle(true);
            await page.evaluate(() => SceneManager._scene._messageWindow._choiceWindow.select(0));
            await key('Enter');
        }
        const routeDoors = [];
        async function walk(goal, openDoors = false) {
            let steps = 0;
            for (let i = 0; i < 71; i++) {
                const plan = await page.evaluate(({ goal, openDoors }) => {
                    const start = [$gamePlayer.x, $gamePlayer.y];
                    const key = pos => pos.join(',');
                    const closed = new Map();
                    const components = new Map();
                    if (openDoors && $gameMap.mapId() === 15) {
                        for (const door of $arenaStonekeepWhole.doors) {
                            if ($gameSelfSwitches.value([15, door.eventIds[0], 'A'])) continue;
                            closed.set(door.id, door);
                            for (const id of door.eventIds) components.set(id, door.id);
                        }
                    }
                    function search(allowDoors) {
                        const queue = [start], paths = new Map([[key(start), null]]);
                        for (let i = 0; i < queue.length; i++) {
                            const [x, y] = queue[i];
                            if (key(queue[i]) === key(goal)) break;
                            for (const d of [2, 4, 6, 8]) {
                                const nx = $gameMap.roundXWithDirection(x, d);
                                const ny = $gameMap.roundYWithDirection(y, d);
                                const dest = [nx, ny], destKey = key(dest);
                                if (paths.has(destKey) || !$gameMap.isValid(nx, ny)) continue;
                                const blockers = $gameMap.eventsXyNt(nx, ny).filter(e => e.isNormalPriority());
                                const door = blockers.length && components.get(blockers[0].eventId());
                                const pass = $gamePlayer.canPass(x, y, d);
                                if (!pass && !(allowDoors && door && blockers.every(e => components.get(e.eventId()) === door)
                                    && $gamePlayer.isMapPassable(x, y, d))) continue;
                                paths.set(destKey, { prev:key([x,y]), d, door:pass?null:door });
                                queue.push(dest);
                            }
                        }
                        return paths;
                    }
                    function unwind(paths, target) {
                        const moves = [];
                        for (let at = key(target); paths.get(at); at = paths.get(at).prev) moves.push(paths.get(at));
                        return moves.reverse();
                    }
                    const native = search(false);
                    if (native.has(key(goal))) return { moves:unwind(native,goal).map(move => move.d) };
                    const potential = search(true);
                    if (potential.has(key(goal))) {
                        for (const move of unwind(potential,goal)) {
                            const door = closed.get(move.door);
                            if (!door) continue;
                            const [x,y] = door.center, ew = door.axis === 'east-west';
                            for (const sign of [-1,1]) for (const offset of [0,-1,1]) {
                                const side = ew ? [x+2*sign,y+offset] : [x+offset,y+2*sign];
                                if (native.has(key(side))) return {
                                    moves:unwind(native,side).map(move => move.d),
                                    door:{id:door.id, locked:door.lockValue!==null && !ArenaStonekeepAccess.isUnlocked(door.id),
                                          direction:ew?(sign<0?6:4):(sign<0?2:8)}
                                };
                            }
                        }
                    }
                    throw Error('Sem percurso até ' + goal + ' desde ' + start + ' no mapa ' + $gameMap.mapId());
                }, { goal, openDoors });
                await page.evaluate(moves => {
                    for (const direction of moves) {
                        $gamePlayer.moveStraight(direction);
                        if (!$gamePlayer.isMovementSucceeded()) throw Error('Travessia interrompida');
                        while ($gamePlayer.isMoving()) $gamePlayer.updateMove();
                    }
                    $gamePlayer.center($gamePlayer.x,$gamePlayer.y);
                }, plan.moves);
                steps += plan.moves.length;
                if (!plan.door) return steps;
                await talk(plan.door.direction);
                if (plan.door.locked) await chooseFirst();
                await page.waitForFunction(id => $gameSelfSwitches.value([15,ArenaDungeon.door(id).eventIds[0],'A']), plan.door.id);
                await map(15);
                routeDoors.push(plan.door.id);
            }
            throw Error('Número inesperado de portas na rota');
        }
        async function fixtureAsCampaign(prepare) {
            await page.evaluate(prepare);
            await map(9);
            const raw = await page.evaluate(() => JsonEx.stringify({
                system:$gameSystem, screen:$gameScreen, timer:$gameTimer, switches:$gameSwitches,
                variables:$gameVariables, selfSwitches:$gameSelfSwitches, actors:$gameActors,
                party:$gameParty, map:$gameMap, player:$gamePlayer
            }));
            await page.evaluate(() => ArenaContinuation.leaveLab());
            await title();
            await page.evaluate(raw => {
                DataManager.extractSaveContents(JsonEx.parse(raw));
                SceneManager.goto(Scene_Map);
            }, raw);
            await map(9);
            assert(await page.evaluate(() => ArenaNarrative.isCampaign() && !ArenaContinuation.labActive()));
        }
        async function talk(direction) {
            await map();
            await page.waitForTimeout(180);
            await page.evaluate(d => $gamePlayer.setDirection(d), direction);
            await key('Enter');
        }
        const eventPosition = (id, dy = 0) => page.evaluate(({id, dy}) => {
            const e = $gameMap.event(id);
            return [e.x, e.y + dy];
        }, {id, dy});
        const position = () => page.evaluate(() => [$gamePlayer.x, $gamePlayer.y]);
        async function hasMarker(text) {
            const found = await page.evaluate(text => {
                const scene = SceneManager._scene;
                const bitmap = scene._rihadMarkers.bitmap;
                const draw = bitmap.drawText;
                let found = false;
                bitmap.drawText = function(label) {
                    if(label === text) found = true;
                    return draw.apply(this, arguments);
                };
                try {
                    $gamePlayer.center($gamePlayer.x,$gamePlayer.y);
                    scene.update();
                    return found && scene._rihadMarkers.visible;
                } finally {
                    delete bitmap.drawText;
                }
            }, text);
            assert(found, 'Placa ausente em '+await position()+': '+text);
        }
        const audienceMarker = () => page.evaluate(() => {
            const scene = SceneManager._scene;
            const bitmap = scene._rihadCaption?.bitmap;
            if (!bitmap) return null;
            const draw = bitmap.drawText;
            let marker = null;
            bitmap.drawText = function(label) {
                if (label.endsWith(' Audiência')) marker = label;
                return draw.apply(this, arguments);
            };
            try {
                scene.update();
                return marker;
            } finally {
                delete bitmap.drawText;
            }
        });
        async function followCity(reverse = false) {
            const points = [reverse ? signage.arrival : signage.audienceStart, ...signage.routeCorners, signage.court];
            if (reverse) points.reverse();
            await walk(points[0]);
            const label = reverse ? 'Portão urbano' : 'Corte';
            let moves = 0;
            for (let i=1; i<points.length; i++) {
                const [x,y] = points[i-1], [nx,ny] = points[i];
                assert(x===nx || y===ny);
                const direction = x<nx?6:x>nx?4:y<ny?2:8;
                const distance = Math.abs(x-nx)+Math.abs(y-ny);
                const arrow = ({2:'↓',4:'←',6:'→',8:'↑'})[direction];
                if (i > 1) await hasMarker(arrow+' '+label);
                if (!reverse) assert.equal(await audienceMarker(), arrow+' Audiência', 'Seta da audiência em '+[x,y]);
                await page.evaluate(({direction,distance}) => {
                    for (let step=0; step<distance; step++) {
                        $gamePlayer.moveStraight(direction);
                        if (!$gamePlayer.isMovementSucceeded()) throw Error('Rota sinalizada interrompida');
                        while ($gamePlayer.isMoving()) $gamePlayer.updateMove();
                    }
                }, {direction,distance});
                moves += distance;
            }
            assert.deepEqual(await position(), points.at(-1));
            return moves;
        }
        async function approachInnBed() {
            await walk(await page.evaluate(() => $arenaRihad.inn.approach));
            await talk(4);
            await map(18);
            await walk(await eventPosition(2, 1));
        }
        async function leaveInn() {
            await walk(await eventPosition(1, -1));
            await key('ArrowDown');
            await map(9);
        }
        async function approachCourt() {
            const steps = await walk(await eventPosition(5, -1));
            await key('ArrowDown');
            await map(11);
            return steps;
        }
        async function travel(target) {
            await walk(await eventPosition(3));
            await talk(8);
            await chooseFirst();
            await map(target);
        }
        async function save(slot) {
            assert.equal(await page.evaluate(slot => {
                $gameSystem.onBeforeSave();
                return DataManager.saveGame(slot);
            }, slot), true);
        }
        async function reload(slot, target) {
            await page.reload();
            await title();
            await page.evaluate(() => {
                const window = SceneManager._scene._commandWindow;
                window.selectSymbol('continue');
                window.processOk();
            });
            await page.waitForFunction(() => SceneManager._scene instanceof Scene_Load && SceneManager._scene._listWindow?.isOpenAndActive());
            await page.evaluate(slot => {
                const scene = SceneManager._scene;
                if (!DataManager.isThisGameFile(slot)) throw Error('Slot sintético indisponível: ' + slot);
                scene._listWindow.select(slot-1);
                scene.onSavefileOk();
                if (!scene._loadSuccess) throw Error('Falha de carregamento: ' + ArenaContinuation.lastError());
            }, slot);
            try {
                await map(target);
            } catch (error) {
                throw Error('Após carregar o slot ' + slot + ': ' + JSON.stringify(await page.evaluate(() => ({
                    scene:SceneManager._scene?.constructor.name, next:SceneManager._nextScene?.constructor.name,
                    map:$gameMap?.mapId(), transfer:$gamePlayer?.newMapId(),
                    error:Graphics._errorPrinter?.textContent
                }))), { cause:error });
            }
        }
        const freeze = () => page.evaluate(() => $arenaStonekeepWhole.encounters.entries.forEach(v => {
            const event = $gameMap.event(v.eventId);
            if (event) event._locked = true;
        }));

        await page.goto(url);
        await title();
        assert.equal(await page.evaluate(() => Object.keys(localStorage).length), 0);
        await page.evaluate(() => ArenaStonekeepWhole.preview());
        await map(15);
        assert.equal(await page.evaluate(() => DataManager.saveGame(16)), false);
        const topology = await coverage(page);
        console.log('PASS cobertura');
        assert.equal(topology.opened.length, 70);
        assert.deepEqual(topology.provisions, []);
        assert.deepEqual(topology.unreachable.sort(), (await page.evaluate(() => $arenaStonekeepWhole.easternWings.pendingAccess)).sort());
        assert(topology.source && topology.exit && topology.dryCrossing);
        await page.evaluate(() => ArenaContinuation.leaveLab());
        await title();
        checks.push('70 portas alcançadas pelas condições de abertura, 165 contatos alcançáveis no grafo, pergaminho e saída conectados, 17 tesouros e seis refúgios acessíveis');

        await fixtureAsCampaign(() => ArenaRiaVision.preview());
        assert.equal(await stage(), 10);
        const city = await page.evaluate(() => ({
            dimensions: [$gameMap.width(), $gameMap.height()],
            arrival: [$arenaRihad.arrival.x, $arenaRihad.arrival.y],
            arrivalSideWall: !$gamePlayer.canPass($arenaRihad.arrival.x + 1, $arenaRihad.arrival.y, 6)
        }));
        assert.deepEqual(city.dimensions, [388,388]);
        assert.deepEqual(await position(), city.arrival);
        assert.equal(city.arrivalSideWall, true);
        assert.equal(await page.evaluate(() => $gameMap.tilesetId()), rihadTileset);
        await walk(await eventPosition(4, 1));
        await key('ArrowUp');
        await map(10);
        await walk([3,9]);
        await key('ArrowLeft');
        await map(9);
        assert.deepEqual(await position(), city.arrival);
        await approachInnBed();
        await talk(8);
        for (let i = 0; i < 30 && await page.evaluate(() => ArenaRiaVision.active()); i++) {
            await page.waitForFunction(() => SceneManager._scene instanceof Scene_ArenaNarrative &&
                !SceneManager._scene._awaitNeutral && Date.now() >= SceneManager._scene._readyAt);
            await page.evaluate(() => {
                const scene = SceneManager._scene;
                scene._focus = scene._buttons.findIndex(button => button.id === 'next');
                scene.draw();
            });
            await key('Enter');
        }
        await map(18);
        await leaveInn();
        assert.equal(await stage(), 20);
        await walk(await eventPosition(1, 1));
        await talk(8);
        const instruction = await page.evaluate(() => $gameMessage.allText());
        assert.match(instruction.replace(/\s+/g,' '), /muralha sul.*grade e entre pela porta de madeira/);
        assert.doesNotMatch(instruction, /Fang Lair|Stonekeep/);
        await settle();
        assert.equal(await stage(), 30);
        await page.setViewportSize({width:640,height:520});
        assert.equal(await audienceMarker(), '← Audiência');
        await page.setViewportSize({width:1080,height:850});
        await walk(signage.arrival);
        assert.equal(await audienceMarker(), null);
        await hasMarker('↓ Corte');
        await walk(await eventPosition(1, 1));
        const garden = await page.evaluate(({ passages, deadEnds }) => {
            const valid = (x, y, d) => $gamePlayer.isMapPassable(x, y, d);
            const toMap = ([x, y]) => [3 + 3 * (127 - x), 3 + 3 * y];
            const dims = [$gameMap.width(), $gameMap.height()];
            const [width, height] = dims;
            const queue = [$gamePlayer.y * width + $gamePlayer.x];
            const seen = new Uint8Array(width * height);
            seen[queue[0]] = 1;
            for (let i = 0; i < queue.length; i++) {
                const x = queue[i] % width;
                const y = Math.floor(queue[i] / width);
                for (const d of [2, 4, 6, 8]) {
                    const nx = $gameMap.xWithDirection(x, d);
                    const ny = $gameMap.yWithDirection(y, d);
                    const key = ny * width + nx;
                    if ($gameMap.isValid(nx, ny) && !seen[key] && valid(x, y, d)) {
                        seen[key] = 1;
                        queue.push(key);
                    }
                }
            }
            let reachableCenters = 0;
            for (let y = 3; y < height; y += 3) {
                for (let x = 3; x < width; x += 3) reachableCenters += seen[y * width + x];
            }
            const failed = passages.filter(({ original, axis }) => {
                const [x, y] = toMap(original);
                const directions = [2, 4, 6, 8].filter(d => valid(x, y, d));
                return !seen[y * width + x] || directions.join() !== (axis === 'north-south' ? '2,8' : '4,6');
            });
            return { reachableCenters, failed, blocked: deadEnds.every(({ original }) => {
                const [x, y] = toMap(original);
                return [2, 4, 6, 8].every(d => !valid(x, y, d));
            }) };
        }, gardenAccess);
        assert.deepEqual(garden.failed, []);
        assert.equal(garden.blocked, true);
        assert.equal(garden.reachableCenters, gardenAccess.reachableFromArrivalAfter);

        // Original temple garden gate at (13,35), close to the campaign route.
        const [x, y] = [345, 108];
        await walk([x,y+2]);
        const beforeGarden = await state();
        for (let step = 0; step < 4; step++) await key('ArrowUp');
        assert.deepEqual(await position(), [x,y-2]);
        await save(20);
        await reload(20, 9);
        assert.deepEqual(await position(), [x,y-2]);
        assert.deepEqual(await state(), beforeGarden);
        for (let step = 0; step < 4; step++) await key('ArrowDown');
        assert.deepEqual(await position(), [x,y+2]);
        checks.push('30 vãos de jardim conectados ao portão, só nos lados confirmados. Travessia por teclado e save/load no pátio do templo sem mudar MQ02.');
        const tavern = signage.doors.find(door => door.type === 'Taverna' && door.original[0] !== 24);
        await walk(tavern.approach);
        await hasMarker('Taverna · Fechado');
        const beforeClosed = await state();
        await key(({2:'ArrowUp',4:'ArrowRight',6:'ArrowLeft',8:'ArrowDown'})[tavern.side]);
        assert.deepEqual(await position(), tavern.approach);
        await key('Enter');
        assert.deepEqual(await state(), beforeClosed);
        assert.equal(await page.evaluate(() => $gameMap.mapId()), 9);
        await page.setViewportSize({width:640,height:520});
        await captureCity('porta-taverna');
        await hasMarker('Taverna · Fechado');
        await page.setViewportSize({width:1080,height:850});
        const citySteps = await followCity();
        assert.equal(await audienceMarker(), '↓ Audiência');
        await approachCourt();
        assert.equal(await audienceMarker(), null);
        checks.push('Piloto de audiência no Chrome: aparece ao sair do diálogo na esplanada, indica cada desvio e some ao entrar na corte.');
        const inCourt = await state();
        const courtEntry = await position();
        const oldCourt = JSON.parse(execFileSync('git', ['show', '84176ea:data/Map011.json'], { cwd: root, encoding: 'utf8' }));
        await page.evaluate(oldCourt => {
            const current = $dataMap;
            try {
                $dataMap = oldCourt;
                $gameMap.setup(11);
                $gamePlayer.locate(8,6);
            } finally {
                $dataMap = current;
            }
        }, oldCourt);
        await save(20);
        await reload(20, 11);
        assert.deepEqual(await position(), courtEntry);
        assert.deepEqual(await state(), inCourt);
        assert.deepEqual(await eventPosition(2), [81,90]);
        checks.push('Save do antigo Map011 retoma na entrada de PALACE2 e preserva personagem, inventário, MQ02 e recibos.');
        await walk(await eventPosition(2, 1));
        await talk(8);
        await chooseFirst();
        const returnInstruction = new Set();
        await settle(false, returnInstruction);
        assert.match([...returnInstruction].join(' ').replace(/\s+/g,' '), /portão urbano, ao norte/);
        assert.equal(await stage(), 40);
        console.log('PASS pedido da corte');
        await walk(await eventPosition(1, -1));
        await key('ArrowDown');
        await map(9);
        const towardGate = await followCity(true);
        assert.equal(towardGate-citySteps,signage.audienceStart[1]-signage.arrival[1]);
        assert.equal(await audienceMarker(), null);
        await captureCity('orientacao-portao');
        checks.push('Percurso sinalizado em ambas as direções, '+citySteps+' passos de ida e '+towardGate+' de volta com placas conferidas nas mudanças de direção; porta da taverna visível em janela menor e sem transferência.');
        const beforeTravel = await state();
        await travel(15);
        assert.equal(await page.evaluate(() => ArenaCampaignConfig.area('stonekeep').config.mapId), 15);
        assert.equal(await page.evaluate(() => ArenaEncounters.currentConfiguration().config.entries.length), 180);
        assert.equal(await page.evaluate(() => ArenaStonekeepWhole.active() || ArenaStonekeepWhole.jump(0)), false);
        assert.deepEqual((await state()).resources, beforeTravel.resources);
        await freeze();
        checks.push('Campanha desde a chegada nível 2 em Rihad: visão, informante, pedido da corte e estrada avançam 10→20→30→40 e entram no Map015');

        const route = await page.evaluate(() => $arenaStonekeepWhole.context);
        const outward = await walk(route.source, true);
        console.log('PASS ida ao pergaminho');
        await talk(8);
        await settle();
        assert.equal(await stage(), 50);
        assert.equal(await page.evaluate(() => $gameParty.numItems($dataItems[7])), 1);
        await talk(8);
        await settle();
        assert.equal(await page.evaluate(() => $gameParty.numItems($dataItems[7])), 1);

        await page.evaluate(() => $gameParty.loseItem($dataItems[7], 1));
        await talk(8);
        await settle();
        assert.equal(await stage(), 50);
        assert.equal(await page.evaluate(() => $gameParty.numItems($dataItems[7])), 1);

        // A representative native battle and container exercise the existing
        // ledgers in a normal game. Positioning here is a test fixture only.
        const enemy = await page.evaluate(() => {
            const v = $arenaStonekeepWhole.encounters.entries.find(v => v.id.startsWith('stonekeep.c3.'));
            const event = $gameMap.event(v.eventId);
            for (const [x, y, d] of [[event.x-1,event.y,6],[event.x+1,event.y,4],[event.x,event.y-1,2],[event.x,event.y+1,8]]) {
                if ($gamePlayer.isMapPassable(x,y,d) && !$gameMap.eventsXyNt(x,y).length) {
                    $gamePlayer.locate(x,y);
                    return {id:v.id,eventId:v.eventId,d};
                }
            }
            throw Error('Encontro de C3 sem lado acessível');
        });
        await key({2:'ArrowDown',4:'ArrowLeft',6:'ArrowRight',8:'ArrowUp'}[enemy.d]);
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Battle && SceneManager._scene.isActive());
        await page.evaluate(() => {
            $gameTroop.members().forEach(e => e.gainHp(-e.hp));
            BattleManager.processVictory();
        });
        assert.equal(await battleControls(page).ready(), 'map');
        await map(15);
        assert.equal((await state()).arena.enemies[enemy.id].defeated, true);
        const treasure = await page.evaluate(() => {
            const t = $arenaStonekeepWhole.treasures[0];
            $gamePlayer.locate(t.x,t.y);
            return t;
        });
        await talk(8);
        await settle();
        assert((await state()).loot.receipts['container/' + treasure.id]);
        const refuge = await page.evaluate(() => {
            const r = $arenaRecovery.restPoints.find(r => r.mapId === 15);
            $gamePlayer.locate(r.x,r.y);
            $gameActors.actor(1).setHp(7);
            return r;
        });
        const beforeRest = await state();
        await talk(8);
        await page.waitForFunction(() => {
            const r = ArenaResources.snapshot().hp;
            return r.current === r.maximum;
        });
        assert.deepEqual((await state()).loot, beforeRest.loot);
        assert.deepEqual((await state()).arena.enemies, beforeRest.arena.enemies);
        console.log('PASS coleta, contato, tesouro e repouso');
        const beforeSave = await state();
        await save(16);
        await reload(16, 15);
        assert.deepEqual(await state(), beforeSave);
        assert.deepEqual(await page.evaluate(({enemy,treasure}) => [
            $gameMap.event(enemy.eventId)._erased,$gameMap.event(treasure.eventId)._erased
        ], { enemy, treasure }), [true,true]);
        console.log('PASS recarga Map015');
        checks.push('Contato real em C3, vitória controlada, tesouro por interação e repouso por interação; slot normal isolado restaura derrota, recibos e recursos');
        await freeze();
        await page.evaluate(pos => $gamePlayer.locate(...pos), route.source);
        const home = await walk([route.exit[0],route.exit[1]+1], true);
        await key('ArrowUp');
        await map(9);
        assert.deepEqual(await position(), city.arrival);
        const beforeCitySave = await state();
        await walk([354,15]);
        const citySavePosition = await position();
        // Mimic the serialized tileset value a pre-atlas Map009 save carries.
        await page.evaluate(() => $gameMap._tilesetId = 4);
        await save(18);
        await reload(18, 9);
        assert.equal(await page.evaluate(() => $gameMap.tilesetId()), rihadTileset);
        checks.push('Save pré-atlas no Map009 adota o C atual sem remapear posição ou estado.');
        assert.deepEqual(await position(), citySavePosition);
        assert.deepEqual(await state(), beforeCitySave);
        const cityReturnSteps = await approachCourt();
        checks.push('Map009 388×388, portão e arredores, esplanada e corte por caminhada nativa, posição e estado restaurados em Rihad com pergaminho');
        await walk(await eventPosition(2, 1));
        await talk(8);
        await chooseFirst();
        await settle();
        assert.equal(await stage(), 60);
        assert.equal(await page.evaluate(() => $gameParty.numItems($dataItems[7])), 0);
        assert.equal(await page.evaluate(() => ArenaPersistence.sourceStatus('stonekeep.parchment').active), false);
        assert((await state()).arena.quests.MQ02.receipts['MQ02.rihad.parchment']);
        const delivered = await state();
        const audiencePosition = await position();
        await save(20);
        await reload(20, 11);
        assert.deepEqual(await position(), audiencePosition);
        assert.deepEqual(await state(), delivered);
        await talk(8);
        await settle();
        assert.deepEqual(await state(), delivered);
        checks.push('Percurso contínuo dentro de Stonekeep até o pergaminho e de volta à saída; recuperação antes da entrega, entrega explícita 50→60 retira uma unidade e aposenta a fonte');

        console.log('PASS entrega e retorno');
        await walk(await eventPosition(1, -1));
        await key('ArrowDown');
        await map(9);
        const oldCity = JSON.parse(execFileSync('git', ['show', '1f0fef4:data/Map009.json'], { cwd: root, encoding:'utf8' }));
        await page.evaluate(oldCity => {
            const current = $dataMap;
            try {
                $dataMap = oldCity;
                $gameMap.setup(9);
                $gamePlayer.locate(10,11);
            } finally {
                $dataMap = current;
            }
        }, oldCity);
        const oldCityState = await state();
        await save(19);
        await reload(19, 9);
        assert.deepEqual(await position(), city.arrival);
        assert.deepEqual(await state(), oldCityState);
        assert.deepEqual(await eventPosition(3), [city.arrival[0],city.arrival[1]-3]);
        checks.push('Save com Map009 antigo retoma no portão urbano e preserva etapa 60, pergaminho entregue e recibos');
        console.log('PASS retomada do Map009 anterior');

        const oldPlugin = execFileSync('git', ['show', '9c9b802:js/plugins/Arena_StonekeepWhole.js'], { cwd: root });
        const pattern = '**/js/plugins/Arena_StonekeepWhole.js';
        await page.route(pattern, route => route.fulfill({ contentType: 'application/javascript', body: oldPlugin }));
        await page.reload();
        await title();
        await fixtureAsCampaign(() => ArenaStonekeep.preview());
        await travel(12);
        const expectedPosition = await page.evaluate(() => {
            const v = ArenaEncounters.currentConfiguration().config.entries[0];
            ArenaPersistence.setEnemy(v.id, 'stonekeep', false, true, 0);
            ArenaEncounters.sync();
            ArenaLoot.claimContainer('test.legacy', $arenaLoot.enemies['1'], {min:2,max:8}, () => 0);
            $gamePlayer.locate($arenaStonekeep.entry.x+1,$arenaStonekeep.entry.y);
            return [$gamePlayer.x+24,$gamePlayer.y];
        });
        const oldState = await state();
        await save(17);
        await page.unroute(pattern);
        await reload(17, 15);
        assert.deepEqual(await page.evaluate(() => [$gamePlayer.x,$gamePlayer.y]), expectedPosition);
        const migrated = await state();
        assert.deepEqual(migrated.loot, oldState.loot);
        assert.deepEqual(migrated.items, oldState.items);
        assert.deepEqual(migrated.resources, oldState.resources);
        assert.deepEqual(migrated.arena.quests, oldState.arena.quests);
        assert.deepEqual(migrated.arena.areas, oldState.arena.areas);
        for (const [id, enemy] of Object.entries(oldState.arena.enemies)) assert.deepEqual(migrated.arena.enemies[id], enemy);
        checks.push('Save sintético gravado pelo roteamento anterior no Map012 migra para X+24 no Map015 sem contabilizar saída, apagar derrotas ou conceder recompensas');

        assert.deepEqual(errors, []);
        assert.deepEqual(missing, []);
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, JSON.stringify({ base:'e341dbd', browser:browser.version(), checks, garden,
            topology, steps:{ outward, home, citySteps, cityReturnSteps }, routeDoors, sample:{ enemy, treasure:treasure.id, refuge:refuge.id },
            errors, missing }, null, 2) + '\n');
        console.log(checks.join('\n'));
    } finally {
        await browser.close();
    }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
