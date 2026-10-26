const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
const sourceSnapshot=Object.fromEntries(['js/plugins/Arena_Battle.js','data/ArenaBattle.json','data/Map007.json','js/plugins.js'].map(p=>[p,require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
(async()=>{const out='doc/evidencias/m01-10/cobertura';fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[],cases=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.ArenaBattle&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
await page.evaluate(()=>{window.motionTrace={};for(const [klass,kind] of [[Sprite_Actor,'actor'],[Sprite_Enemy,'enemy']]){const f=klass.prototype.updateFrame;klass.prototype.updateFrame=function(){f.apply(this,arguments);if(this._arenaState){const k=kind+'.'+this._arenaState;motionTrace[k]=motionTrace[k]||[];if(!motionTrace[k].includes(this._arenaFrame))motionTrace[k].push(this._arenaFrame);}};}});
  async function key(k){await page.keyboard.press(k,{delay:100});await page.waitForTimeout(140);}
  async function ready(){
   for(let i=0;i<220;i++){
    const s=await page.evaluate(()=>{const s=SceneManager._scene;if(s instanceof Scene_Gameover)return'gameover';if(s instanceof Scene_Map&&!s.isBusy())return'map';if(s instanceof Scene_Battle){if(s._messageWindow.pause&&s._messageWindow._waitCount===0)return'message';if(s._partyCommandWindow.isOpenAndActive())return'party';if(s._actorCommandWindow.isOpenAndActive())return'actor';}return'wait';});
    if(s==='message')await key('Enter');else if(s==='party')await page.evaluate(()=>{SceneManager._scene._partyCommandWindow.selectSymbol('fight');SceneManager._scene._partyCommandWindow.processOk();});else if(s!=='wait')return s;
    await page.waitForTimeout(100);
   }throw Error('battle did not reach input/end: '+JSON.stringify(await page.evaluate(()=>({phase:BattleManager._phase,errors:Graphics._errorPrinter.innerHTML,log:SceneManager._scene._logWindow&&SceneManager._scene._logWindow._methods}))));
  }
  async function choose(kind,id){
   assert.equal(await ready(),'actor');
   await page.evaluate(({kind,id})=>{const s=SceneManager._scene,w=s._actorCommandWindow;w.selectSymbol(kind);if(kind==='skill')w.selectExt($dataSkills[id].stypeId);w.processOk();if(kind==='skill'){s._skillWindow.select(s._skillWindow._data.findIndex(v=>v.id===id));s._skillWindow.processOk();}if(kind==='item'){s._itemWindow.select(s._itemWindow._data.findIndex(v=>v.id===id));s._itemWindow.processOk();}if(s._enemyWindow.active){s._enemyWindow.select(0);s._enemyWindow.processOk();}if(s._actorWindow.active){s._actorWindow.select(0);s._actorWindow.processOk();}}, {kind,id});
   await page.waitForTimeout(150);return ready();
  }


await page.evaluate(()=>ArenaBattle.startLab());await page.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
const identity=await page.evaluate(()=>ArenaPersistence.identity());await page.evaluate(()=>ArenaBattle.selectProfile());await page.waitForFunction(()=>SceneManager._scene._profiles&&SceneManager._scene._profiles.isOpenAndActive());assert.equal(await page.evaluate(()=>SceneManager._scene._profiles.maxItems()),16);await key('Escape');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());assert.deepEqual(await page.evaluate(()=>ArenaPersistence.identity()),identity);
await page.evaluate(()=>ArenaBattle.selectProfile());await page.waitForFunction(()=>SceneManager._scene._profiles&&SceneManager._scene._profiles.isOpenAndActive());await page.evaluate(()=>{const w=SceneManager._scene._profiles;w.select(0);w.processOk();});await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());assert.equal(await page.evaluate(()=>ArenaPersistence.identity().baseVisualId),'argonian.male.base');
await page.evaluate(()=>{ArenaBattle.prepare();$dataEnemies[1].params[0]=300;$dataEnemies[1].params[1]=10;Math.random=()=>0.5;$dataSkills.forEach(s=>{if(s)s.damage.variance=0;});$gamePlayer.locate(7,6);$gamePlayer.setDirection(8);});await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());await ready();
const v=await page.evaluate(()=>ArenaResources.snapshot().vigor.current);await page.evaluate(()=>{const s=SceneManager._scene;s._actorCommandWindow.selectSymbol('skill');s._actorCommandWindow.selectExt(1);s._actorCommandWindow.processOk();s._skillWindow.select(s._skillWindow._data.findIndex(v=>v.id===5));s._skillWindow.processOk();});await key('Escape');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),v);await key('Escape');await ready();
await page.evaluate(()=>{$gameActors.actor(1).setHp(20);$gameTroop.members()[0].setMp(0);});assert.equal(await choose('skill',9),'actor');assert.equal(await page.evaluate(()=>$gameActors.actor(1).mp),42);assert(await page.evaluate(()=>$gameActors.actor(1).hp)>20);
const rows=await page.evaluate(()=>ArenaBattle.resources($gameTroop.members()[0]));assert.equal(rows.find(r=>r.id==='mp').current,0);assert.equal(rows.find(r=>r.id==='mp').maximum,10);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>SceneManager._scene._arenaEnemyResources.contents.getPixel(20,98)),'#252a30');await page.screenshot({path:'doc/evidencias/m01-10/mana-inimiga-vazia.png'});
await page.evaluate(()=>{const v=ArenaResources.snapshot().vigor;ArenaPersistence.setResource('vigor',5,v.maximum);});assert.equal(await choose('skill',5),'actor');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),0);
for(const [weapon,skills] of [[2,[7,8]],[null,[3,4]]]){
 await page.evaluate(weapon=>{const a=$gameActors.actor(1);a.setHp(100);a.changeEquip(0,weapon?$dataWeapons[weapon]:null);const v=ArenaResources.snapshot().vigor;ArenaPersistence.setResource('vigor',100,v.maximum);},weapon);
 for(const skill of skills)assert.equal(await choose('skill',skill),'actor');
 assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),83);
}
assert.deepEqual(errors,[]);
fs.writeFileSync('doc/evidencias/m01-10/ui.json',JSON.stringify({sourceSnapshot,checks:['16 selectable profiles','cancel profile without changes','native profile confirm creates separate session','cancel technique before target costs zero','Cura native restores HP and costs8 MP','existing enemy Mana0/10 visible with empty gauge pixel','exact Vigor5 debit to0','native sword7/8 and unarmed3/4 pairs after equipment change, cost17 each pair'],errors},null,2)+'\n');console.log('PASS native selector/cancel/Cura/empty enemy Mana/exact cost');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
