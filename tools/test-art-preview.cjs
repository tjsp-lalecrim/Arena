const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const context = await browser.newContext({ viewport: { width: 1100, height: 800 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
        await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8765/');
        await page.waitForFunction(() => window.SceneManager && SceneManager._scene instanceof Scene_Title &&
            SceneManager._scene._commandWindow && SceneManager._scene._commandWindow.isOpenAndActive());
        await page.evaluate(() => {
            SceneManager._scene._commandWindow.selectSymbol('artPreview');
            SceneManager._scene._commandWindow.processOk();
        });
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isActive() &&
            $gameMap.mapId() === 2 && ImageManager.isReady() && !SceneManager._scene.isBusy());
        await page.waitForTimeout(500);
        assert.deepEqual(await page.evaluate(() => [$gameMap.mapId(), $gameMap.tilesetId(), $gamePlayer.characterName()]),
            [2, 2, '$Arena_Breton_Pilot']);
        const observed = [];
        for (const [i, frame] of [0, 96, 192, 96].entries()) {
            await page.waitForFunction(frame => SceneManager._scene._spriteset._artRat._frame.x === frame, frame);
            observed.push(await page.evaluate(() => SceneManager._scene._spriteset._artRat._frame.x));
            await page.screenshot({ path: 'tmp/art-frame-' + i + '.png' });
        }
        assert.deepEqual(observed, [0, 96, 192, 96]);
        await page.keyboard.down('ArrowRight'); await page.waitForTimeout(80); await page.keyboard.up('ArrowRight');
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => $gamePlayer.x), 5);
        assert.equal(await page.evaluate(() => {
            ArenaPersistence.setResource('art-probe', 7, 10);
            $gameActors.actor(1).setHp(42);
            return DataManager.saveGame(1);
        }), true);
        await page.evaluate(() => { ArenaPersistence.setResource('art-probe', 0, 10); $gamePlayer.locate(7, 7); });
        assert.equal(await page.evaluate(() => DataManager.loadGame(1)), true);
        await page.evaluate(() => SceneManager.goto(Scene_Map));
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isActive() &&
            ImageManager.isReady() && !SceneManager._scene.isBusy());
        assert.deepEqual(await page.evaluate(() => [$gamePlayer.x, $gamePlayer.y, $gamePlayer.characterName(),
            $gameActors.actor(1).hp, ArenaPersistence.snapshot().resources['art-probe'].current]),
            [5, 6, '$Arena_Breton_Pilot', 42, 7]);
        await page.evaluate(() => { $gamePlayer.locate(1, 4); $gamePlayer.moveStraight(4); });
        assert.equal(await page.evaluate(() => $gamePlayer.x), 1);
        await page.evaluate(() => { $gamePlayer.locate(4, 8); $gamePlayer.setDirection(2); });
        await page.waitForFunction(() => $gamePlayer.canMove() && !$gameMap.isEventRunning());
        await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter');
        await page.waitForFunction(() => $gameScreen.picture(1) && $gameMessage.isBusy() && ImageManager.isReady());
        await page.waitForFunction(() => SceneManager._scene._messageWindow.pause);
        await page.screenshot({ path: 'tmp/art-ria.png' });
        await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter');
        await page.waitForFunction(() => !$gameMessage.isBusy() && !$gameScreen.picture(1));
        assert.equal(await page.evaluate(() => ArenaPersistence.snapshot().quests.MQ01.stage), 0);
        await page.waitForFunction(() => $gamePlayer.canMove() && !$gameMap.isEventRunning());
        await page.evaluate(() => { $gamePlayer.locate(1, 8); $gamePlayer.setDirection(2); });
        await page.keyboard.down('Enter'); await page.waitForTimeout(80); await page.keyboard.up('Enter');
        await page.waitForFunction(() => $gameMap.mapId() === 1 && !$gamePlayer.isTransferring() && ImageManager.isReady());
        assert.equal(await page.evaluate(() => $gamePlayer.characterName()), '');
        assert.deepEqual(errors, []);
        const result = { browser: await browser.version(), engine: 'MV 1.6.1', viewport: '1100x800',
            game: '816x624', checks: ['title-entry-map2', 'native-tiles-and-character', 'rat-frame-sequence-0-1-2-1',
                'movement', 'save-load-map-images-native-hp-and-own-resource', 'wall-collision',
                'native-event-illustration', 'no-MQ01-progress', 'return-original-laboratory', 'zero-missing-files-and-pageerrors'],
            observedRatFrames: observed, errors, editor: 'not executed for new sample', galaxyA56: 'not executed' };
        fs.writeFileSync('tmp/art-result.json', JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
