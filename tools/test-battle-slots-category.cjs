// Exercise the native skill command when only one category is available.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');
  await page.waitForFunction(()=>window.ArenaBattleUI&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await page.evaluate(()=>ArenaBattle.startLab());
  await page.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
  await page.evaluate(()=>{ArenaBattle.prepare();$gamePlayer.locate(7,6);$gamePlayer.setDirection(8);});
  const {key,ready}=require('./battle-test-controls.cjs')(page);
  await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());assert.equal(await ready(),'actor');
  const before=await page.evaluate(()=>ArenaResources.snapshot());
  await page.evaluate(()=>{
   const a=$gameActors.actor(1);window.uiCategoryOriginalSkills=a.skills;
   a.skills=function(){return uiCategoryOriginalSkills.call(this).filter(s=>s.stypeId===2);};
   const w=SceneManager._scene._actorCommandWindow;w._arenaSType=1;w.selectSymbol('skill');w.processOk();
  });
  await page.waitForFunction(()=>SceneManager._scene._skillWindow.active);
  assert.equal(await page.evaluate(()=>SceneManager._scene._skillWindow._stypeId),2);
  assert.equal(await page.evaluate(()=>SceneManager._scene._skillWindow._data.length),2);
  await key('Escape');assert.deepEqual(await page.evaluate(()=>ArenaResources.snapshot()),before);
  await page.evaluate(()=>{const a=$gameActors.actor(1);a.skills=uiCategoryOriginalSkills;const w=SceneManager._scene._actorCommandWindow;w._arenaSType=1;w.selectSymbol('skill');w.processOk();});
  assert.equal(await page.evaluate(()=>SceneManager._scene._skillWindow._stypeId),1);
  await key('Escape');assert.deepEqual(await page.evaluate(()=>ArenaResources.snapshot()),before);assert.deepEqual(errors,[]);
  fs.writeFileSync('doc/evidencias/m01-11/categoria-unica.json',JSON.stringify({browser:await browser.version(),checks:['only magic available opens magic directly','cancel without resource cost','restore technique category'],isolation:'Disposable context, skills override only in memory, no saves',errors},null,2)+'\n');
  console.log('PASS native category fallback, cancellation and restored techniques');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
