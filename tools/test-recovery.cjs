/* MV native scenes/actions; disposable browser context/save17, never personal saves. */
const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-17';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1100,height:800},hasTouch:true}),p=await context.newPage(),errors=[],checks=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  const key=async k=>{await p.keyboard.press(k,{delay:100});await p.waitForTimeout(180);};
  await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');
  await p.waitForFunction(()=>window.ArenaRecovery&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await p.evaluate(()=>{ArenaBattle.startLab();$gameTemp._arenaInventoryLab=true;});
  await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive());
  const snap=()=>p.evaluate(()=>({resources:ArenaResources.snapshot(),items:[2,3,4].map(id=>$gameParty.numItems($dataItems[id])),quest:ArenaPersistence.snapshot().quests,progression:MVStateStore.read('arenaResources')}));
  const pick=async id=>p.evaluate(id=>{const s=SceneManager._scene,n=s._entries.findIndex(i=>i&&DataManager.isItem(i)&&i.id===id);if(n<0)throw Error('Missing potion '+id);s._page=Math.floor(n/$arenaInventory.pageSize);s.refreshEntries();s.focus(s._itemWindow);s._itemWindow.select(n%$arenaInventory.pageSize);},id);
  const point=()=>p.evaluate(()=>{const w=SceneManager._scene._itemWindow,r=w.itemRect(w.index()),c=Graphics._canvas.getBoundingClientRect();return {x:c.x+(w.x+w.padding+r.x+r.width/2)*c.width/Graphics.width,y:c.y+(w.y+w.padding+r.y+40)*c.height/Graphics.height};});
  const shot=async n=>{await p.waitForTimeout(160);await p.locator('#GameCanvas').screenshot({path:out+'/'+n+'.png'});};
  await p.evaluate(()=>{[2,3,4].forEach(id=>$gameParty.gainItem($dataItems[id],3-$gameParty.numItems($dataItems[id])));const a=$gameActors.actor(1);a.setHp(20);a.setMp(0);ArenaPersistence.setResource('vigor',20,ArenaResources.snapshot().vigor.maximum);SceneManager._scene.setMode('inventory');SceneManager._scene._nav.select(0);});
  let before=await snap();await pick(2);await key('ArrowRight');assert.deepEqual(await snap(),before);await shot('inventario-antes');
  await pick(2);await key('Enter');assert.equal(await p.evaluate(()=>$gameActors.actor(1).hp),70);assert.equal((await snap()).items[0],2);assert.equal(await p.evaluate(()=>SceneManager._scene._confirm.visible),false);await shot('pocao-vida-uso-direto');
  await pick(3);let q=await point();await p.mouse.click(q.x,q.y,{delay:110});await p.waitForTimeout(220);assert.equal(await p.evaluate(()=>$gameActors.actor(1).mp),25);assert.equal((await snap()).items[1],2);
  await pick(4);q=await point();const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[q]});await p.waitForTimeout(120);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(240);assert.equal((await snap()).resources.vigor.current,70);assert.equal((await snap()).items[2],2);await shot('pocao-vigor-toque');
  checks.push('keyboard/mouse/touch each use one potion immediately via native item scene; navigation no consumption; no modal');
  await p.evaluate(()=>{const a=$gameActors.actor(1);a.setHp(a.mhp-1);a.setMp(a.mmp-1);ArenaPersistence.setResource('vigor',ArenaResources.snapshot().vigor.maximum-1,ArenaResources.snapshot().vigor.maximum);});
  for(const id of [2,3,4]){await pick(id);await key('Enter');}
  before=await snap();for(const id of [2,3,4]){await pick(id);await key('Enter');}assert.deepEqual(await snap(),before);
  checks.push('recovery clamps at maximum; full resources refuse use without consuming any potion');
  await p.evaluate(()=>{const a=$gameActors.actor(1);a.setHp(40);a.setMp(10);ArenaPersistence.setResource('vigor',7,ArenaResources.snapshot().vigor.maximum);});
  // A stale grid entry must not restore or consume after stock is removed elsewhere.
  await pick(2);await p.evaluate(()=>$gameParty.loseItem($dataItems[2],99));before=await snap();await key('Enter');assert.deepEqual(await snap(),before);
  await p.evaluate(()=>{$gameParty.gainItem($dataItems[2],1);SceneManager._scene.refreshEntries();});
  await pick(2);before=await snap();await key('Escape');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());assert.deepEqual(await snap(),before);
  checks.push('stale unavailable item rejected; cancel selection preserves resources, stock, quest and progression');
  await p.evaluate(()=>{$gameSystem.onBeforeSave();if(!DataManager.saveGame(17))throw Error('save');ArenaResources.rest();if(!DataManager.loadGame(17))throw Error('load');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});
  await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());assert.deepEqual(await snap(),before);
  await p.waitForTimeout(1600);assert.deepEqual(await snap(),before);checks.push('native save/load preserves spent three resources and inventory; no map passive regeneration');
  const invalid=await p.evaluate(()=>[ArenaRecovery.restAt('missing'),ArenaRecovery.restAt('lab.resources.bed'),ArenaRecovery.restAt('lab.resources.bed',new Game_Interpreter())]);assert(invalid.every(r=>!r.ok));assert.deepEqual(await snap(),before);
  await p.evaluate(()=>{$gamePlayer.reserveTransfer(5,13,6,8,0);});await p.waitForFunction(()=>$gameMap.mapId()===5&&!$gamePlayer.isTransferring()&&SceneManager._scene.isActive()&&$gamePlayer.canMove());
  const guards=await p.evaluate(()=>{
   const i=new Game_Interpreter();i.setup([],6);const old=$gameParty._inBattle;let battle,remote,vehicle,message;
   try{$gameParty._inBattle=true;battle=ArenaRecovery.restAt('lab.resources.bed',i);}finally{$gameParty._inBattle=old;}
   $gamePlayer.locate(2,2);remote=ArenaRecovery.restAt('lab.resources.bed',i);$gamePlayer.locate(13,6);
   const type=$gamePlayer._vehicleType;try{$gamePlayer._vehicleType='boat';vehicle=ArenaRecovery.restAt('lab.resources.bed',i);}finally{$gamePlayer._vehicleType=type;}
   $gameMessage.add('fixture');try{message=ArenaRecovery.restAt('lab.resources.bed',i);}finally{$gameMessage.clear();}
   return [battle,remote,vehicle,message];
  });assert(guards.every(r=>!r.ok));assert.deepEqual(await snap(),before);
  await shot('cama-antes');await key('Enter');await p.waitForFunction(()=>$gameMessage.isBusy());
  const rested=await snap();for(const k of ['hp','mp','vigor'])assert.equal(rested.resources[k].current,rested.resources[k].maximum);assert.deepEqual(rested.items,before.items);assert.deepEqual(rested.progression,before.progression);assert.deepEqual(rested.quest,before.quest);await p.waitForFunction(()=>SceneManager._scene._messageWindow.pause);await shot('cama-recuperacao-completa');
  while(await p.evaluate(()=>$gameMessage.isBusy())){await p.waitForTimeout(200);await key('Enter');}
  await key('Enter');await p.waitForFunction(()=>$gameMessage.isBusy());assert.deepEqual(await snap(),rested);
  while(await p.evaluate(()=>$gameMessage.isBusy())){await p.waitForTimeout(200);await key('Enter');}
  checks.push('native bed event restores all three once/no changes to inventory/quest/progression; repeated rest harmless; unauthorized/battle/remote/vehicle/dialogue rejected');
  await p.evaluate(()=>{$gameSystem.onBeforeSave();if(!DataManager.saveGame(17)||!DataManager.loadGame(17))throw Error('save/load rest');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());assert.deepEqual(await snap(),rested);checks.push('native save/load after rest preserves restored current/max values and eligible map');
  // Argonian's approved initial +10 Vigor survives potions, rest and save/load.
  await p.evaluate(()=>SceneManager.goto(Scene_Title));await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  const passive=await p.evaluate(()=>{
   const results=[];for(const r of $arenaCharacterCatalog.races)for(const gender of ['male','female']){
    DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Sem regeneração',raceId:r.id,genderId:gender});
    const a=$gameActors.actor(1);a.setHp(10);a.setMp(0);ArenaPersistence.setResource('vigor',0,ArenaResources.snapshot().vigor.maximum);
    const before=[a.hp,a.mp,ArenaResources.snapshot().vigor.current];
    try{$gameParty._inBattle=true;a.regenerateAll();}finally{$gameParty._inBattle=false;}
    results.push({race:r.id,gender,before,after:[a.hp,a.mp,ArenaResources.snapshot().vigor.current]});
   }return results;
  });assert.equal(passive.length,16);for(const t of passive)assert.deepEqual(t.after,t.before);checks.push('all 16 identities have no passive HP/Mana/Vigor regeneration in native turn regeneration');
  const argonian=await p.evaluate(()=>{DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Recuperação',raceId:'argonian',genderId:'female'});const r=ArenaResources.snapshot();ArenaPersistence.setResource('vigor',0,r.vigor.maximum);$gameActors.actor(1).changeLevel(2,false);if(!ArenaResources.choose(2,'vigor'))throw Error('Argonian choice: '+JSON.stringify(ArenaResources.snapshot())+' inBattle='+$gameParty.inBattle());ArenaResources.rest();$gameSystem.onBeforeSave();DataManager.saveGame(17);DataManager.loadGame(17);return ArenaResources.snapshot();});
  assert.equal(argonian.vigor.maximum,120);assert.equal(argonian.vigor.current,120);assert.equal(argonian.vigor.initialBonus,10);checks.push('Argonian female +10 initial and chosen +10 growth retained once after recovery/save/load');
  await p.evaluate(()=>ArenaBattle.startLab());await p.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
  await p.evaluate(()=>{ArenaBattle.prepare();$gamePlayer.locate(7,6);$gamePlayer.setDirection(8);});await key('Enter');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
  const controls=require('./battle-test-controls.cjs')(p);assert.equal(await controls.ready(),'actor');
  await p.evaluate(()=>{
   $dataEnemies[1].params[0]=500;$gameTroop.members()[0].recoverAll();
   window.recoveryTrace=[];const end=BattleManager.endAction;
   BattleManager.endAction=function(){if(this._subject.isActor()&&this._action.isItem()){window.lastRecoveryAction=this._action;recoveryTrace.push({id:this._action.item().id,count:$gameParty.numItems(this._action.item()),resources:ArenaResources.snapshot()});}return end.apply(this,arguments);};
   $gameActors.actor(1).setHp(30);$gameActors.actor(1).setMp(0);ArenaPersistence.setResource('vigor',0,ArenaResources.snapshot().vigor.maximum);
  });
  for(const id of [2,3,4])assert.equal(await controls.choose('item',id),'actor');
  const trace=await p.evaluate(()=>recoveryTrace);assert.deepEqual(trace.map(t=>[t.id,t.count]),[[2,0],[3,0],[4,0]]);
  assert.equal(trace[1].resources.mp.current,25);assert.equal(trace[2].resources.vigor.current,50);await shot('pocoes-combate-recursos');
  const faults=await p.evaluate(()=>{
   const a=$gameActors.actor(1),subject=BattleManager._subject,actions=a._actions,phase=BattleManager._phase;
   const results=[],before=JSON.stringify({r:ArenaResources.snapshot(),items:[2,3,4].map(i=>$gameParty.numItems($dataItems[i]))});
   try{
    BattleManager._subject=a;
    for(const id of [2,3,4]){const action=new Game_Action(a,true);action.setItem(id);a._actions=[action];results.push(BattleManager.startAction()===false&&BattleManager._arenaFailure==='recovery-unavailable');}
    const unchanged=before===JSON.stringify({r:ArenaResources.snapshot(),items:[2,3,4].map(i=>$gameParty.numItems($dataItems[i]))});
    $gameParty.gainItem($dataItems[4],1);a._actions=[lastRecoveryAction];
    const current=ArenaResources.snapshot().vigor.current;
    results.push(BattleManager.startAction()===false&&$gameParty.numItems($dataItems[4])===1&&ArenaResources.snapshot().vigor.current===current);
    ArenaResources.recoverVigor(999);const action=new Game_Action(a,true);action.setItem(4);a._actions=[action];results.push(BattleManager.startAction()===false&&$gameParty.numItems($dataItems[4])===1);
    return {results,unchanged};
   } finally {BattleManager._subject=subject;a._actions=actions;BattleManager._phase=phase;}
  });assert(faults.results.every(Boolean));assert(faults.unchanged);checks.push('three native battle potion turns consume once; forced unavailable/repeated/no-effect actions rejected without payment');
  assert.equal(await p.evaluate(()=>Graphics._errorPrinter.innerHTML),'');assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await browser.version(),checks,argonian,passive,guards,rested,trace,faults,errors,isolation:'Disposable Chrome context/save17; no personal saves; fixture grants only technical kit'},null,2)+'\n');
  console.log('PASS '+checks.length+' recovery scenario groups, native item scenes/inputs/rest event/save-load');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
