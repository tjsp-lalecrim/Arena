const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const out = process.env.ARENA_EVIDENCE_DIR || 'doc/evidencias'; fs.mkdirSync(out, { recursive: true });
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const results = [];
        for (const mobile of [false, true]) {
            const options = mobile ? { viewport: { width: 916, height: 412 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1,
                userAgent: 'Mozilla/5.0 (Linux; Android 14; GenericTest) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36' } : { viewport: { width: 1100, height: 800 } };
            const page = await browser.newPage(options), errors = [];
            page.on('pageerror', e => errors.push(e.message)); page.on('requestfailed', r => errors.push(r.url() + ' ' + (r.failure() && r.failure().errorText))); page.on('response', r => { if (r.status() >= 400) errors.push(r.url()); });
            await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8765/');
            try {
            await page.waitForFunction(() => window.SceneManager && SceneManager._scene instanceof Scene_Title && SceneManager._scene._commandWindow.isOpenAndActive());
            } catch (error) { console.error(await page.evaluate(() => ({ body: document.body.innerText, scene: SceneManager._scene && SceneManager._scene.constructor.name, active: SceneManager._scene && SceneManager._scene._commandWindow && SceneManager._scene._commandWindow.active, stopped: SceneManager._stopped })), errors); throw error; }

            await page.evaluate(() => { ArenaCharacterCreation.confirmCurrent({ name: 'Anterior', raceId: 'nord', genderId: 'male' }); ArenaPersistence.setResource('vigor', 4, 100); });
            const previous = await page.evaluate(() => JSON.stringify($gameSystem._persistentState));
            await page.evaluate(() => { const w = SceneManager._scene._commandWindow; w.selectSymbol('newGame'); w.processOk(); });
            await page.waitForFunction(() => SceneManager._scene instanceof Scene_ArenaCharacterCreation && SceneManager._scene.isActive() && ImageManager.isReady());
            await page.getByRole('textbox', { name: 'Nome do personagem' }).fill('Revisão');
            await page.getByRole('textbox', { name: 'Nome do personagem' }).press('Enter');
            const bounds = await page.locator('canvas').first().boundingBox();
            const cdp = mobile ? await page.context().newCDPSession(page) : null;
            async function click(x, y) {
                const point = { x: bounds.x + x * bounds.width / 816, y: bounds.y + y * bounds.width / 816 };
                if (mobile) {
                    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] }); await page.waitForTimeout(80);
                    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
                } else { await page.mouse.move(point.x, point.y); await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up(); }
                await page.waitForTimeout(150);
            }
            await click(160, 376); // Redguard row6.
            assert.equal(await page.evaluate(() => SceneManager._scene._draft.raceId), 'redguard');
            await click(684, 160);
            assert.equal(await page.evaluate(() => SceneManager._scene._draft.genderId), 'female');
            await page.waitForFunction(() => ImageManager.isReady());
            const input = await page.locator('input').boundingBox();
            assert.ok(input.x >= bounds.x && input.x + input.width <= bounds.x + bounds.width + 1);
            await page.screenshot({ path: out + '/m01-07-' + (mobile ? 'mobile-emulado' : 'mouse') + '.png' });
            await click(160, 588); await page.waitForFunction(() => !!SceneManager._scene._confirm);
            await click(400, 304); await page.waitForFunction(() => !SceneManager._scene._confirm);
            assert.equal(await page.locator('input').inputValue(), 'Revisão');
            await click(650, 588);
            await page.waitForFunction(() => SceneManager._scene instanceof Scene_Title && SceneManager._scene.isActive());
            assert.equal(await page.locator('input').count(), 0);
            assert.equal(await page.evaluate(() => JSON.stringify($gameSystem._persistentState)), previous);
            assert.equal(await page.evaluate(() => $gameActors.actor(1).name()), 'Anterior');
            assert.deepEqual(errors, []);
            results.push({ mode: mobile ? 'Android generic emulation on desktop Chrome; NOT Galaxy A56' : 'desktop mouse', bounds, input,
                checks: ['race-single-click', 'gender-single-click', 'preview-loaded', 'confirm-review-retains-name', 'cancel-no-state-write', 'input-removed', 'no-missing-files'], errors });
            await page.close();
        }
        fs.writeFileSync(out + '/m01-07-pointer-result.json', JSON.stringify({ browser: await browser.version(), validationServer: process.env.ARENA_URL || 'http://127.0.0.1:8765/', results, galaxyA56: 'not tested; no physical keyboard/fullscreen/performance test' }, null, 2));
        console.log('PASS: desktop mouse and80ms emulated touch navigation/confirmation/review/cancel, no state writes.');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
