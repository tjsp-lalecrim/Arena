const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 916, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, userAgent: "Mozilla/5.0 (Linux; Android 14; GenericTest) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36" });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.status() >= 400) errors.push(r.url()); });
        await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8765/');
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Title && SceneManager._scene._commandWindow.isOpenAndActive());
        await page.evaluate(() => { const w = SceneManager._scene._commandWindow; w.selectSymbol('artCurrent'); w.processOk(); });
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isActive() && !SceneManager._scene.isBusy() && ImageManager.isReady());
        await page.waitForTimeout(600);
        const bounds = await page.locator('canvas').first().evaluate(c => {
            const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, viewport: [innerWidth, innerHeight] };
        });
        assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.width <= 916 && bounds.height <= 412);
        const nativeFont = await page.evaluate(() => SceneManager._scene._spriteset._artUiFontSize);
        assert.equal(nativeFont, 26);
        assert.ok(nativeFont * bounds.width / 816 >= 16);
        await page.screenshot({ path: 'doc/evidencias/m01-06-r05-viewport-paisagem.png' });
        const scale = bounds.width / 816;
        const touch = await page.context().newCDPSession(page);
        const point = { x: bounds.x + 4.5 * 48 * scale, y: bounds.y + 9.5 * 48 * scale };
        // MV processes a pressed touch on an update; use a human-length press,
        // rather than a zero-duration down/up pair between two updates.
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
        await page.waitForTimeout(80);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForFunction(() => $gameScreen.picture(1) && SceneManager._scene._messageWindow.pause && ImageManager.isReady());
        await page.screenshot({ path: 'doc/evidencias/m01-06-r05-ria-viewport.png' });
        assert.deepEqual(errors, []);
        const result = { browser: await browser.version(), mode: 'Desktop Chrome mobile viewport emulation only; NOT a Galaxy A56 test', bounds,
            estimatedPanelFontCssPx: nativeFont * bounds.width / 816, checks: ['canvas-fits-viewport', 'map-and-narrative-load', 'emulated-touch-pathfinds-to-ria-and-opens-event', 'primary-label-font-at-least16-css-pixels', 'zero-missing-files'],
            limitations: ['Small panel text requires physical readability test', 'No physical touch, fullscreen or performance validation', 'Generic Android test user agent; no Galaxy device identity or certification'], errors };
        fs.writeFileSync('doc/evidencias/m01-06-r05-viewport-result.json', JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result, null, 2));
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
