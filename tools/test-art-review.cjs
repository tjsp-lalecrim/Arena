const assert = require('node:assert/strict');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.status() >= 400) errors.push(r.url() + ':' + r.status()); });
        await page.goto((process.env.ARENA_URL || 'http://127.0.0.1:8765/') + 'tools/art-review.html');
        await page.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth));
        assert.deepEqual(await page.locator('img').evaluateAll(xs => xs.map(x =>
            [x.width, x.height, x.naturalWidth, x.naturalHeight])),
            [[576, 480, 576, 480], [384, 64, 384, 64], [768, 512, 768, 512]]);
        const frames = new Set();
        for (let i = 0; i < 32; i++) {
            frames.add(await page.locator('canvas').evaluate(c => c.toDataURL()));
            await page.waitForTimeout(55);
        }
        assert.equal(frames.size, 4, 'four distinct rendered frames');
        await page.locator('button').click();
        const paused = await page.locator('canvas').evaluate(c => c.toDataURL());
        await page.waitForTimeout(500);
        assert.equal(await page.locator('canvas').evaluate(c => c.toDataURL()), paused, 'pause freezes frame');
        assert.equal(await page.locator('canvas').evaluate(c =>
            c.getContext('2d').getImageData(0, 0, 96, 64).data.some((x, i) => i % 4 === 3 && x > 0)), true);
        await page.screenshot({ path: 'doc/evidencias/m01-06-revisao-r02-browser.png', fullPage: true });
        assert.deepEqual(errors, []);
        console.log('PASS: 1:1 dimensions, four rendered frames, stable pause, zero errors/404; no saves or engine.');
    } finally {
        await browser.close();
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
