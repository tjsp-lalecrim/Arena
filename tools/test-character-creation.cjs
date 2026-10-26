const fs = require('node:fs');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const out = process.env.ARENA_EVIDENCE_DIR || 'doc/evidencias'; fs.mkdirSync(out, { recursive: true });
    const pure = {}; vm.runInNewContext(fs.readFileSync('js/plugins/MV_CharacterRules.js', 'utf8'), pure);
    assert.equal(pure.MVCharacterRules.name("  A\u0301lvaro   d'Água  "), "Álvaro d'Água");
    for (const name of ['', '   ', 'a'.repeat(21), '\\V[1]', 'a\nb']) assert.throws(() => pure.MVCharacterRules.name(name));
    assert.equal(pure.MVCharacterRules.weaponBonus({ kind: 'weaponLevelBonus', weapon: 'bow', divisor: 3 }, 6, 'bow'), 2);
    assert.equal(pure.MVCharacterRules.weaponBonus({ kind: 'weaponLevelBonus', weapon: 'bow', divisor: 3 }, 6, 'melee'), 0);
    assert.equal(pure.MVCharacterRules.weaponBonus({ kind: 'weaponLevelBonus', weapon: 'all', divisor: 4 }, 6, 'bow'), 1);
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
        const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('requestfailed', r => errors.push(r.url() + ' ' + (r.failure() && r.failure().errorText)));
        page.on('response', r => { if (r.status() >= 400) errors.push(r.url()); });
        await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8765/');
        async function scene(type) { await page.waitForFunction(type => window.SceneManager && SceneManager._scene instanceof window[type] && SceneManager._scene.isActive() && !SceneManager.isSceneChanging() && !SceneManager._scene.isBusy(), type); }
        async function key(key) { await page.keyboard.down(key); await page.waitForTimeout(80); await page.keyboard.up(key); await page.waitForTimeout(150); }
        async function open() {
            await scene('Scene_Title'); await page.waitForFunction(() => SceneManager._scene._commandWindow.isOpenAndActive());
            await page.evaluate(() => { const w = SceneManager._scene._commandWindow; w.selectSymbol('newGame'); w.processOk(); });
            await scene('Scene_ArenaCharacterCreation'); await page.waitForFunction(() => ImageManager.isReady());
        }
        await scene('Scene_Title');
        const before = await page.evaluate(() => JSON.stringify($gameSystem._persistentState));
        await open();
        await page.getByRole('textbox', { name: 'Nome do personagem' }).fill('Cancelar'); await key('Enter'); await key('Escape');
        await scene('Scene_Title');
        assert.equal(await page.evaluate(() => JSON.stringify($gameSystem._persistentState)), before);
        assert.equal(await page.locator('input').count(), 0);
        await open();
        await page.getByRole('textbox', { name: 'Nome do personagem' }).fill('   '); await key('Enter');
        await key('ArrowDown'); assert.equal(await page.evaluate(() => SceneManager._scene._draft.raceId), 'breton');
        await key('Enter'); await key('ArrowRight'); await key('Enter'); await key('Enter');
        assert.equal(await page.evaluate(() => document.activeElement === SceneManager._scene._nameInput), true);
        assert.equal(await page.evaluate(() => ArenaCharacterCreation.isCreated()), false);
        await page.getByRole('textbox', { name: 'Nome do personagem' }).fill("  Álvaro   d'Água  "); await key('Enter');
        await key('Enter'); await key('Enter'); await key('Enter');
        await page.waitForFunction(() => !!SceneManager._scene._confirm);
        await page.screenshot({ path: out + '/m01-07-confirmacao.png' });
        await key('Escape'); assert.equal(await page.evaluate(() => !!SceneManager._scene._confirm), false);
        assert.equal(await page.evaluate(() => JSON.stringify($gameSystem._persistentState)), before);
        await page.waitForFunction(() => ImageManager.isReady());
        await page.screenshot({ path: out + '/m01-07-criacao.png' });
        await key('Enter'); await key('Enter'); await key('Enter'); await page.waitForFunction(() => !!SceneManager._scene._confirm);
        await key('Enter'); await scene('Scene_Map');
        await page.waitForFunction(() => $gameMap.mapId() === 4 && SceneManager._scene._messageWindow.pause && SceneManager._scene._messageWindow._waitCount === 0);
        await key('Enter'); await page.waitForFunction(() => !$gameMessage.isBusy());
        const identity = await page.evaluate(() => ArenaPersistence.identity());
        assert.equal(identity.name, "Álvaro d'Água"); assert.equal(identity.raceId, 'breton'); assert.equal(identity.genderId, 'female');
        const checks = await page.evaluate(() => {
            const checks = []; function check(value, message) { if (!value) throw Error(message); checks.push(message); }
            const A = ArenaCharacterCreation;
            check(A.isCreated() && $gameMap.mapId() === 4, 'new-game-confirmed-arrival');
            ArenaPersistence.setResource('vigor', 3, 100);
            check(A.confirmCurrent({ name: 'Duplicado', raceId: 'nord', genderId: 'male' }) === false, 'duplicate-confirmation-rejected');
            check(ArenaPersistence.identity().name === "Álvaro d'Água" && ArenaPersistence.snapshot().resources.vigor.current === 3, 'repeat-no-name-or-resource-reset');
            const expected = $gameActors.actor(1).characterName();
            check(DataManager.saveGame(1), 'native-save');
            $gameActors.actor(1).setCharacterImage('', 0); $gameActors.actor(1).setFaceImage('', 0); $gameActors.actor(1).setBattlerImage('');
            check(DataManager.saveGame(1), 'save-with-native-images-cleared');
            check(DataManager.loadGame(1), 'native-load');
            check($gameActors.actor(1).characterName() === expected && ArenaPersistence.snapshot().resources.vigor.current === 3, 'load-rebuilds-appearance-no-grant');
            delete $gameSystem._persistentState.namespaces.arenaCreation.data.confirmed;
            check(A.isCreated() && !A.confirmCurrent({ name: 'Outro', raceId: 'nord', genderId: 'male' }), 'receipt-authoritative-when-confirmed-field-missing');
            const oldVariance = $dataSkills[10].damage.variance, oldMat = $dataEnemies[1].params[4], healVariance = $dataSkills[9].damage.variance;
            $dataSkills[10].damage.variance = 0; $dataSkills[9].damage.variance = 0; $dataEnemies[1].params[4] = 40;
            try {
                for (const r of $arenaCharacterCatalog.races) for (const g of $arenaCharacterCatalog.genders) {
                    DataManager.setupNewGame(); $gameMap.setup(4); $gamePlayer.clearTransferInfo(); $gamePlayer.locate(4, 6);
                    check(A.confirmCurrent({ name: r.name, raceId: r.id, genderId: g.id }), 'confirm-' + r.id + '-' + g.id);
                    const actor = $gameActors.actor(1), v = A.visual(r.id, g.id), state = ArenaPersistence.snapshot();
                    check(actor.characterName() === v.character && actor.battlerName() === v.battler && actor.faceName() === v.face, 'appearance-' + r.id + '-' + g.id);
                    check(actor.currentClass().id === 1 && [1, 2].every(id => actor.canEquip($dataWeapons[id]) && actor.canEquip($dataArmors[id])), 'free-equipment-' + r.id + '-' + g.id);
                    check(state.resources.vigor.maximum === (r.id === 'argonian' ? 110 : 100), 'vigor-' + r.id + '-' + g.id);
                    check(actor.elementRate(3) === 1, 'cold-only-on-damage-not-permanent-trait-' + r.id + '-' + g.id);
                    check(actor.isStateResist(3) === (r.id === 'high_elf'), 'paralysis-' + r.id + '-' + g.id);
                    check(actor.agi === (r.id === 'khajiit' ? 11 : 10), 'agility-' + r.id + '-' + g.id);
                    const enemy = new Game_Enemy(1, 0, 0); $gameTroop._enemies = [enemy];
                    const magic = new Game_Action(enemy); magic.setSkill(10);
                    const base = Math.max(1, 3 * enemy.mat - actor.mdf);
                    check(magic.makeDamageValue(actor, false) === Math.round(base * (r.id === 'breton' ? 0.75 : 1)), 'magic-damage-' + r.id + '-' + g.id);
                    const heal = new Game_Action(actor); heal.setSkill(9);
                    check(heal.makeDamageValue(actor, false) === -(25 + actor.mat), 'healing-not-resisted-' + r.id + '-' + g.id);
                    actor.changeLevel(6, false); $gameParty.gainItem($dataWeapons[1], 1); actor.changeEquip(0, $dataWeapons[1]);
                    const attack = new Game_Action(actor); attack.setAttack();
                    const rate = r.id === 'redguard' ? 1.08 : r.id === 'dark_elf' ? 1.05 : 1;
                    const bonus = r.id === 'redguard' ? 0.03 : r.id === 'dark_elf' ? 0.02 : r.id === 'wood_elf' ? 0.04 : 0;
                    const actualDamage = attack.evalDamageFormula(enemy), expectedDamage = Math.max(1, 2 * actor.atk - enemy.def) * rate;
                    check(actualDamage === expectedDamage, 'weapon-damage-' + r.id + '-' + g.id + (actualDamage === expectedDamage ? '' : JSON.stringify({ actualDamage, expectedDamage, level: actor.level, type: actor.weapons()[0].wtypeId, bonus: r.bonus })));
                    check(Math.abs(attack.itemHit(enemy) - Math.min(1, actor.hit + bonus)) < 1e-9, 'weapon-hit-' + r.id + '-' + g.id);
                    check(DataManager.saveGame(2) && DataManager.loadGame(2), 'roundtrip-' + r.id + '-' + g.id);
                    check(ArenaPersistence.identity().baseVisualId === v.id && $gameActors.actor(1).name() === r.name, 'identity-roundtrip-' + r.id + '-' + g.id);
                    check(!A.confirmCurrent({ name: 'Outro', raceId: r.id, genderId: g.id }), 'idempotent-' + r.id + '-' + g.id);
                }
            } finally { $dataSkills[10].damage.variance = oldVariance; $dataSkills[9].damage.variance = healVariance; $dataEnemies[1].params[4] = oldMat; }
            // Laboratory saves before creation do not gain identity, vigor, or race bonuses.
            DataManager.setupNewGame();
            const legacy = DataManager.makeSaveContents(); delete legacy.system._persistentState.namespaces.arenaCreation;
            DataManager.extractSaveContents(legacy);
            check(!A.isCreated() && ArenaPersistence.identity().raceId === null && Object.keys(ArenaPersistence.snapshot().resources).length === 0, 'legacy-without-creation-keeps-defaults');
            const actor = $gameActors.actor(1), originalFaceSetter = actor.setFaceImage, originalState = JSON.stringify($gameSystem._persistentState), originalName = actor.name();
            actor.setFaceImage = function() { throw Error('injected-image-failure'); };
            let failed = false;
            try { A.confirmCurrent({ name: 'Falha', raceId: 'argonian', genderId: 'male' }); } catch (error) { failed = true; }
            actor.setFaceImage = originalFaceSetter;
            check(failed && actor.name() === originalName && JSON.stringify($gameSystem._persistentState) === originalState, 'failed-confirmation-rolls-back-native-and-own-state');
            for (const v of Object.values($arenaCharacterVisuals.visuals)) {
                ImageManager.loadCharacter(v.character); ImageManager.loadFace(v.face); ImageManager.loadSvActor(v.battler); ImageManager.loadPicture(v.sidePicture);
            }
            return checks;
        });
        await page.waitForFunction(() => ImageManager.isReady());
        assert.deepEqual(errors, []);
        const result = { browser: await browser.version(), engine: 'MV1.6.1', checks, errors,
            ui: ['cancel-before-commit-no-state-change', 'empty-name-rejected', 'keyboard-race-gender-navigation', 'unicode-name-input', 'confirmation-review-preserves-draft', 'confirmed-new-game'],
            isolation: 'Disposable Chrome context; slots1/2 only here; no personal saves', editor: 'Authoring recorded separately in m01-07-editor.json; this test covers browser only', validationServer: process.env.ARENA_URL || 'http://127.0.0.1:8765/', galaxyA56: 'not tested' };
        fs.writeFileSync(out + '/m01-07-result.json', JSON.stringify(result, null, 2));
        console.log('PASS ' + checks.length + ' checks; UI navigation/name/cancel/confirm; zero missing files/errors.');
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
