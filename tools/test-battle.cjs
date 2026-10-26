const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
const sourceSnapshot=Object.fromEntries(['js/plugins/Arena_Battle.js','data/ArenaBattle.json','data/Map007.json','js/plugins.js'].map(p=>[p,require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-10';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});page.on('requestfailed',r=>errors.push(r.url()));
  await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.ArenaBattle&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await page.evaluate(()=>ArenaBattle.startLab());await page.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&!SceneManager._scene.isBusy());
  await page.evaluate(()=>{ArenaBattle.prepare();$gamePlayer.locate(7,6);$gamePlayer.setDirection(8);});
  await page.keyboard.press('Enter',{delay:110});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive(),null,{timeout:15000});
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
  await ready();await page.screenshot({path:out+'/primeira-batalha.png'});
  assert.deepEqual(await page.evaluate(()=>SceneManager._scene._partyCommandWindow._list.map(c=>c.symbol)),['fight']);assert.equal(await page.evaluate(()=>BattleManager.processEscape()),false);
  // Record actual native animation frames, without driving them manually.
  await page.evaluate(()=>{
   window.battleTrace={actor:{},enemy:{},turns:[],actions:[],outcomes:[]};
   for(const pair of [[Sprite_Actor,'actor'],[Sprite_Enemy,'enemy']]){const original=pair[0].prototype.updateFrame;pair[0].prototype.updateFrame=function(){original.apply(this,arguments);if(this._arenaState){const a=battleTrace[pair[1]];a[this._arenaState]=a[this._arenaState]||[];if(!a[this._arenaState].includes(this._arenaFrame))a[this._arenaState].push(this._arenaFrame);}};}
   const end=BattleManager.endAction;BattleManager.endAction=function(){battleTrace.actions.push({subject:this._subject.isActor()?'actor':'enemy',skill:this._action.item().id,vigor:ArenaResources.snapshot().vigor.current,mp:$gameActors.actor(1).mp,targetHp:$gameTroop.members()[0].hp,result:Object.assign({},$gameTroop.members()[0].result())});return end.apply(this,arguments);};
   const invoke=BattleManager.invokeAction;BattleManager.invokeAction=function(subject,target){const r=invoke.apply(this,arguments);battleTrace.outcomes.push({subject:subject.isActor()?'actor':'enemy',result:Object.assign({},target.result())});return r;};
   window.baseRandom=Math.random;Math.random=()=>0.5;$dataSkills.forEach(s=>{if(s)s.damage.variance=0;});
   // Long encounter fixture only: not a change to the database or normal rat.
   $dataEnemies[1].params[0]=300;$gameTroop.members()[0].recoverAll();
  });
  assert.equal(await choose('guard'),'actor');assert.equal(await choose('guard'),'actor');
  const before=await page.evaluate(()=>ArenaResources.snapshot());
  assert.equal(await choose('skill',5),'actor');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),before.vigor.current-5);
  assert.equal(await choose('skill',6),'actor');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),before.vigor.current-17);
  assert.equal(await choose('skill',10),'actor');assert.equal(await page.evaluate(()=>$gameActors.actor(1).mp),44);
  await page.evaluate(()=>{const a=$gameActors.actor(1);a.setMp(0);const v=ArenaResources.snapshot().vigor;ArenaPersistence.setResource('vigor',0,v.maximum);});
  assert.deepEqual(await page.evaluate(()=>[$gameActors.actor(1).canUse($dataSkills[5]),$gameActors.actor(1).canUse($dataSkills[10])]),[false,false]);
  await page.screenshot({path:out+'/recursos-esgotados.png'});
  assert.equal(await choose('item',4),'actor');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),50);assert.equal(await page.evaluate(()=>$gameParty.numItems($dataItems[4])),0);
  assert.equal(await choose('item',3),'actor');assert.equal(await page.evaluate(()=>$gameActors.actor(1).mp),25);
  assert.equal(await choose('item',2),'actor');
  await page.evaluate(()=>$dataSkills[5].successRate=0);assert.equal(await choose('skill',5),'actor');await page.evaluate(()=>$dataSkills[5].successRate=100);
  await page.evaluate(()=>{const e=$gameTroop.members()[0];window.enemyXparam=e.xparam;e.xparam=function(id){return id===1?1:enemyXparam.call(this,id);};});assert.equal(await choose('skill',5),'actor');await page.evaluate(()=>$gameTroop.members()[0].xparam=enemyXparam);
  await page.evaluate(()=>{const a=$gameActors.actor(1);window.actorXparam=a.xparam;a.xparam=function(id){return id===2?1:actorXparam.call(this,id);};});assert.equal(await choose('skill',5),'actor');await page.evaluate(()=>$gameActors.actor(1).xparam=actorXparam);
  const repeatBefore=await page.evaluate(()=>ArenaResources.snapshot().vigor.current);
  await page.evaluate(()=>$dataSkills[5].repeats=2);assert.equal(await choose('skill',5),'actor');
  assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),repeatBefore-5);
  await page.evaluate(()=>$dataSkills[5].repeats=1);
  const trace=await page.evaluate(()=>battleTrace);assert(trace.actions.some(a=>a.subject==='enemy'));assert(trace.outcomes.some(a=>a.result.missed));assert(trace.outcomes.some(a=>a.result.evaded));assert(trace.outcomes.some(a=>a.result.critical));
  // Finish through native commands, then wait for native victory/messages/map return.
  await page.evaluate(()=>$gameTroop.members()[0].setHp(1));assert.equal(await choose('attack'),'map');
  assert.equal(await page.evaluate(()=>$gameSelfSwitches.value([7,2,'A'])),true);
  const saved=await page.evaluate(()=>{const a=$gameActors.actor(1);const before=ArenaResources.snapshot();const inv=$gameParty.numItems($dataItems[2]);DataManager.saveGame(21);DataManager.loadGame(21);return{before,after:ArenaResources.snapshot(),known:a.isLearnedSkill(9)&&a.isLearnedSkill(10),inv,afterInv:$gameParty.numItems($dataItems[2]),trace:battleTrace};});assert.deepEqual(saved.before,saved.after);assert.equal(saved.inv,saved.afterInv);assert.equal(saved.known,true);
  await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>SceneManager._scene instanceof Scene_Map),true);
  await page.screenshot({path:out+'/vitoria-retorno.png'});
  // Real defeat, native Scene_Gameover, no canLose override and no fleeing.
  await page.evaluate(()=>{$dataEnemies[1].params[0]=18;$gameSelfSwitches.setValue([7,2,'A'],false);$gameActors.actor(1).setHp(1);$gamePlayer.locate(7,6);$gamePlayer.setDirection(8);});await key('Enter');
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());assert.equal(await choose('guard'),'gameover');
  await page.screenshot({path:out+'/derrota.png'});
  const fullTrace=await page.evaluate(()=>battleTrace);assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({sourceSnapshot,browser:await browser.version(),engine:'MV1.6.1',checks:['native Scene_Battle','successive native turns','light/heavy costs','Mana spell cost','insufficient resources','potion consumption/live bars','miss/evade/critical','victory native map return','no unintended repeat','native save-load after battle','gameover defeat','no escape','actual animation frame traces'],saved,trace:fullTrace,errors},null,2)+'\n');
  console.log('PASS actual Scene_Battle turns/actions/potions/miss/evade/critical/victory/map/save-load/defeat/no escape; frame traces recorded.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
