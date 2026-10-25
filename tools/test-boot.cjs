// Uses an installed Playwright and desktop Chrome. No packages are downloaded.
// ARENA_PLAYWRIGHT may point to a local Playwright package installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const context = await browser.newContext({ viewport: { width: 1100, height: 800 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
            if (response.status() >= 400) errors.push(response.status() + ' ' + response.url());
        });
        await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8765/');
        async function scene(name) {
            await page.waitForFunction(name => window.SceneManager &&
                SceneManager._scene && SceneManager._scene.constructor.name === name &&
                !SceneManager.isSceneChanging() && SceneManager._scene.isActive() &&
                !SceneManager._scene.isBusy(), name, { timeout: 10000 });
        }
        async function key(name) {
            await page.keyboard.down(name);
            await page.waitForTimeout(80);
            await page.keyboard.up(name);
            await page.waitForTimeout(220);
        }
        await scene('Scene_Title');
        await page.waitForFunction(() => SceneManager._scene._commandWindow.isOpenAndActive());
        assert.equal(await page.evaluate(() => Utils.RPGMAKER_VERSION), '1.6.1');
        assert.deepEqual(await page.evaluate(() => [Graphics.width, Graphics.height, ImageCache.limit]),
            [816, 624, 20000000]);
        await key('Enter');
        await scene('Scene_Map');
        await page.waitForFunction(() => ! $gamePlayer.isTransferring());
        await page.waitForTimeout(500);
        assert.equal(await page.evaluate(() => $gameMap.mapId()), 1);
        const start = await page.evaluate(() => [$gamePlayer.x, $gamePlayer.y]);
        await key('ArrowRight');
        assert.deepEqual(await page.evaluate(() => [$gamePlayer.x, $gamePlayer.y]), [start[0] + 1, start[1]]);
        await key('ArrowLeft');
        await key('ArrowUp'); // Face the instructions event; movement is blocked by it.
        await key('Enter');
        await page.waitForFunction(() => $gameMessage.isBusy());
        await page.waitForTimeout(1300);
        await key('Enter');
        await page.waitForTimeout(500);
        await key('Enter');
        await page.waitForFunction(() => !$gameMessage.isBusy());
        await key('Escape');
        await scene('Scene_Menu');
        await page.screenshot({ path: 'tmp/boot-menu.png' });
        await page.evaluate(() => {
            SceneManager._scene._commandWindow.selectSymbol('save');
            SceneManager._scene._commandWindow.processOk();
        });
        await scene('Scene_Save');
        await key('Enter');
        await scene('Scene_Menu');
        await key('Escape');
        await scene('Scene_Map');
        // Saved via the menu. Move away, then load through the native load scene.
        const saved = await page.evaluate(() => [$gamePlayer.x, $gamePlayer.y]);
        await key('ArrowLeft');
        await page.evaluate(() => SceneManager.push(Scene_Load));
        await scene('Scene_Load');
        await key('Enter');
        await scene('Scene_Map');
        assert.deepEqual(await page.evaluate(() => [$gamePlayer.x, $gamePlayer.y]), saved);
        // Verify map boundary collision with native player movement.
        await page.evaluate(() => $gamePlayer.locate(1, 2));
        await key('ArrowLeft');
        assert.equal(await page.evaluate(() => $gamePlayer.x), 1);
        await page.screenshot({ path: 'tmp/boot-map.png' });
        assert.deepEqual(errors, [], 'Browser errors or missing resources');
        const result = {
            browser: await browser.version(), viewport: '1100x800', renderer: await page.evaluate(() => Graphics.isWebGL() ? 'WebGL' : 'Canvas'),
            checks: ['title', 'new-game', 'MV-1.6.1', 'runtime-config', 'grid-movement', 'event-message', 'menu', 'native-save', 'native-load-position', 'wall-collision', 'no-browser-errors'],
            errors, mobile: 'not tested', screenshots: ['tmp/boot-menu.png', 'tmp/boot-map.png']
        };
        fs.writeFileSync(path.join('tmp', 'boot-result.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
