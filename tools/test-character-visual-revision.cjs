/* Same viewport and native display rectangles for all16 identities. Isolated saves. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const baseline = JSON.parse(execFileSync('git',['show','37e1729:data/ArenaCharacterVisuals.json'],{encoding:'utf8'}));
const { chromium } = require(process.env.ARENA_PLAYWRIGHT || 'playwright');
(async () => {
    const out = process.env.ARENA_EVIDENCE_DIR || 'doc/evidencias/personagens-r02'; fs.mkdirSync(out, { recursive: true });
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
        const errors = [], results = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('requestfailed', r => errors.push(r.url() + ': ' + r.failure().errorText));
        page.on('response', r => { if (r.status() >= 400) errors.push(r.url() + ': ' + r.status()); });
        await page.goto(process.env.ARENA_URL || 'http://127.0.0.1:8766/');
        await page.waitForFunction(() => window.SceneManager && SceneManager._scene instanceof Scene_Title && SceneManager._scene._commandWindow.isOpenAndActive());
        await page.evaluate(() => { const w=SceneManager._scene._commandWindow; w.selectSymbol('newGame'); w.processOk(); });
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_ArenaCharacterCreation && SceneManager._scene.isActive() && ImageManager.isReady());
        const keys = await page.evaluate(() => Object.keys($arenaCharacterVisuals.visuals));
        for (const id of keys) {
            const [race, gender] = id.split('.');
            await page.evaluate(({race,gender}) => {
                const s=SceneManager._scene;
                s._race.selectSymbol(race); s._gender.selectSymbol(gender); s.refreshDraft();
            }, {race,gender});
            await page.waitForFunction(() => ImageManager.isReady());
            await page.waitForTimeout(100);
            const preview = await page.evaluate(() => {
                const s=SceneManager._scene;
                return {native:[Graphics.width,Graphics.height],draft:s._draft,visual:ArenaCharacterCreation.visual(s._draft.raceId,s._draft.genderId),
                    frames:[s._face,s._mapFigure,s._side].map(p=>({rect:[p._frame.x,p._frame.y,p._frame.width,p._frame.height],scale:[p.scale.x,p.scale.y],url:p.bitmap._url}))};
            });
            assert.deepEqual(preview.native,[816,624]);
            assert.deepEqual(preview.frames.map(p=>p.rect),[[0,0,144,144],[48,0,48,64],[0,0,96,96]]);
            assert(preview.frames.every(p=>p.scale[0]===1&&p.scale[1]===1));
            assert.deepEqual(preview.frames.map(p=>decodeURIComponent(p.url).split('/').pop()),[preview.visual.face+'.png',preview.visual.character+'.png',preview.visual.sidePicture+'.png']);
            await page.screenshot({path:`${out}/criacao-${race}-${gender}.png`});
            results.push({id,preview});
        }
        await page.evaluate(() => DataManager.loadMapData(4));
        await page.waitForFunction(() => DataManager.isMapLoaded());
        // Real native save/load for each stable key, including cleared native images.
        const saves = await page.evaluate(baseline => {
            const rows=[];
            for(const r of $arenaCharacterCatalog.races) for(const g of $arenaCharacterCatalog.genders) {
                DataManager.setupNewGame(); $gameMap.setup(4); $gamePlayer.clearTransferInfo(); $gamePlayer.locate(4,6);
                if(!ArenaCharacterCreation.confirmCurrent({name:r.name,raceId:r.id,genderId:g.id})) throw Error('confirmation');
                const actor=$gameActors.actor(1), v=ArenaCharacterCreation.visual(r.id,g.id), state=JSON.stringify(ArenaPersistence.snapshot());
                const old=baseline.visuals[r.id+'.'+g.id+'.base'];
                actor.setCharacterImage(old.character,0); actor.setFaceImage(old.face,0); actor.setBattlerImage(old.battler);
                if(!DataManager.saveGame(1)||!DataManager.loadGame(1)) throw Error('save/load');
                const loaded=$gameActors.actor(1);
                if(loaded.characterName()!==v.character||loaded.faceName()!==v.face||loaded.battlerName()!==v.battler) throw Error('appearance');
                if(JSON.stringify(ArenaPersistence.snapshot())!==state) throw Error('state changed');
                ImageManager.loadSvActor(v.battler);
                rows.push(r.id+'.'+g.id+'.base');
            }
            return rows;
        }, baseline);
        assert.deepEqual(saves,keys);
        // MV sprites animate their native pattern/directions; sample every frame.
        const patterns = await page.evaluate(async () => {
            const rows=[];
            for(const [id,v] of Object.entries($arenaCharacterVisuals.visuals)) {
                const bitmap=ImageManager.loadCharacter(v.character);
                await new Promise(resolve=>bitmap.addLoadListener(resolve));
                const character=new Game_Character(); character.setImage(v.character,0);
                const sprite=new Sprite_Character(character);
                const frames=[];
                for(const direction of [2,4,6,8]) for(const pattern of [0,1,2,1]) {
                    character.setDirection(direction); character._pattern=pattern; sprite.update();
                    frames.push([sprite._frame.x,sprite._frame.y,sprite._frame.width,sprite._frame.height]);
                }
                if(frames.some(f=>f[2]!==48||f[3]!==64)) throw Error('native frame');
                rows.push({id,anchor:[sprite.anchor.x,sprite.anchor.y],frames,declared:v.poseStatus,combat:v.battlerStatus});
            }
            return rows;
        });
        await page.waitForFunction(() => ImageManager.isReady());
        await page.evaluate(() => {
            DataManager.setupNewGame(); $gameMap.setup(4); $gamePlayer.clearTransferInfo(); $gamePlayer.locate(4,6);
            ArenaCharacterCreation.confirmCurrent({name:'Revisão',raceId:'khajiit',genderId:'female'});
            SceneManager.goto(Scene_Map);
        });
        await page.waitForFunction(() => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isActive() && !SceneManager._scene.isBusy() && !SceneManager.isSceneChanging() && ImageManager.isReady());
        for (const id of keys) {
            await page.evaluate(id => {
                const [race,gender]=id.split('.');
                ArenaPersistence.setIdentity(race,gender,id); ArenaCharacterCreation.restoreAppearance();
                $gamePlayer.locate(4,6); $gamePlayer.setDirection(2);
            }, id);
            await page.waitForFunction(() => ImageManager.isReady());
            await page.waitForTimeout(100);
            const rendered = await page.evaluate(() => {
                const p=SceneManager._scene._spriteset._characterSprites.find(s=>s._character===$gamePlayer);
                return {file:p.bitmap._url,frame:[p._frame.width,p._frame.height],anchor:[p.anchor.x,p.anchor.y]};
            });
            assert(rendered.file.includes('_r02'));assert.deepEqual(rendered.frame,[48,64]);assert.deepEqual(rendered.anchor,[.5,1]);
            await page.screenshot({path:`${out}/mapa-${id.replaceAll('.','-')}.png`});
            results.find(r=>r.id===id).map=rendered;
        }
        assert.deepEqual(errors,[]);
        fs.writeFileSync(`${out}/resultado.json`,JSON.stringify({browser:await browser.version(),engine:'MV1.6.1',viewport:[1100,800],native:[816,624],results,saves,patterns,errors,
            isolation:'Disposable browser context/localStorage, native slot1 only in this context; no personal saves.',
            limits:'Desktop browser only. Static sets do not acquire walking/combat animation. Editor and Galaxy A56 not tested in this revision. Artistic acceptance pending owner.'},null,2));
        console.log('PASS16 previews with identical rectangles/scale;16 native save/load appearance rebuilds;256 native directional pattern samples; zero browser/file errors.');
    } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
