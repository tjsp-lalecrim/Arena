// Focal presentation/quest regression in a fresh Chrome context. No personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {chromium}=require('playwright'),root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/blubamka-v01');
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});
try{const context=await browser.newContext({viewport:{width:1160,height:900}}),p=await context.newPage(),errors=[];
p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(30000);
await p.goto('http://127.0.0.1:8774/');
const title=()=>p.waitForFunction(()=>window.ArenaCourt&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
const map=()=>p.waitForFunction(()=>window.$dataMap&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene._spriteset&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
const key=async k=>{await p.keyboard.press(k,{delay:80});await p.waitForTimeout(200);};
async function settle(choose){for(let n=0;n<220;n++){const s=await p.evaluate(()=>{const w=SceneManager._scene._messageWindow;if(w._textState)w._showFast=true;return {busy:$gameMessage.isBusy(),pause:w.pause&&!w._waitCount,choice:w._choiceWindow.isOpenAndActive()&&!w._choiceWindow._arenaCourtAwaitNeutral};});if(!s.busy){await map();return;}if(s.choice){assert.notEqual(choose,undefined);await p.evaluate(v=>SceneManager._scene._messageWindow._choiceWindow.select(v),choose);await key('Enter');}else if(s.pause)await key('Enter');else await p.waitForTimeout(60);}throw Error('Dialogue did not settle');}
const state=()=>p.evaluate(()=>JSON.stringify({party:$gameParty,actors:$gameActors,store:$gameSystem._persistentState,ria:ArenaRiaVision.state()}));
const shot=async name=>{await p.waitForFunction(()=>ImageManager.isReady());await p.waitForTimeout(250);await p.locator('#GameCanvas').screenshot({path:path.join(out,name+'.png')});};
await title();const empty=await p.evaluate(()=>JSON.stringify(localStorage));
await p.evaluate(()=>ArenaCourt.preview());await map();await p.evaluate(()=>{const c=$arenaRihad.court;$gamePlayer.reserveTransfer(c.entry.mapId,81,91,8,0);});await map();
assert.deepEqual(await p.evaluate(()=>{const e=$gameMap.event(2);return[e.characterName(),e.direction(),e.isDirectionFixed(),!$gamePlayer.canPass(81,91,8)];}),['$Arena_Blubamka_V01',2,true,true]);
await shot('corte');
await key('Enter');await p.waitForFunction(()=>$gameMessage.faceName()==='Arena_Blubamka_V01');await p.waitForTimeout(800);await shot('audiencia');
assert(await p.evaluate(()=>{const w=SceneManager._scene._messageWindow;return w.newLineX()===168&&$gameMessage._texts.every(t=>w.textWidth(t)<=w.contentsWidth()-176);}));
await settle(1);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),30);
await key('Enter');await settle(0);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),40);
await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',50,q.objectives,false);$gameParty.gainItem($dataItems[7],1);});
await key('Enter');await settle(0);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),60);assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[7])),0);
const delivered=await state();await key('Enter');await settle();assert.equal(await state(),delivered);
assert.equal(await p.evaluate(()=>DataManager.saveGame(19)),false);assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)),empty);
// Convert only this synthetic fixture into a normal isolated campaign checkpoint.
const raw=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));await p.evaluate(()=>ArenaContinuation.leaveLab());await title();
await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));$gameMap.event(2).setImage('$Arena_redguard_female_walk_r02',0);SceneManager.goto(Scene_Map);},raw);await map();
assert.equal(await p.evaluate(()=>($gameMap.event(2).setImage('$Arena_redguard_female_walk_r02',0),$gameSystem.onBeforeSave(),DataManager.saveGame(19))),true);const saved=await state();await p.reload();await title();
await p.evaluate(()=>{if(!DataManager.loadGame(19))throw Error('load');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await map();
assert.equal(await state(),saved);assert.equal(await p.evaluate(()=>$gameMap.event(2).characterName()),'$Arena_Blubamka_V01');
await key('Enter');await settle();assert.equal(await state(),saved);
// Shared text helper outside the queen retains full width and no face.
assert.equal(await p.evaluate(()=>{const i=new Game_Interpreter();i._mapId=11;i._eventId=1;ArenaCourt.show(i,['Texto de saída.']);return i._childInterpreter._list[0].parameters[0];}),'');
const tracked=['Map011','ArenaRihad'];const before=tracked.map(f=>fs.readFileSync(path.join(root,'data',f+'.json'),'utf8').replace(/\r\n/g,'\n'));
cp.execFileSync(process.execPath,['tools/build-rihad-court.cjs'],{cwd:root});tracked.forEach((f,i)=>assert.equal(fs.readFileSync(path.join(root,'data',f+'.json'),'utf8').replace(/\r\n/g,'\n'),before[i]));
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:browser.version(),checks:['Map sprite stationary south, collision and accessible adjacent interaction','Portrait native 144px; wrapped text within reserved face width','Audience cancel 30 / accept 40 / delivery 60; repeat without duplicate receipt or item','RAM save blocked; isolated normal slot19 reload retains actor/store/Ria and replaces legacy serialized sprite','Non-queen shared text remains full width','Court generator reconstructs presentation identically'],errors,manual:'Visual assessment deferred to next integrated Pages preview; no owner approval inferred.'},null,2)+'\n');console.log('Blubamka: 6 focal checks passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
