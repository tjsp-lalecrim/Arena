const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright'),video=require('./battle-video.cjs');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-17-r03';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({channel:'chrome',headless:true});
 try{
  const c=await b.newContext({viewport:{width:1100,height:800},hasTouch:true}),p=await c.newPage(),errors=[],checks=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8767/');await p.waitForFunction(()=>window.ArenaRecovery&&SceneManager._scene instanceof Scene_Title&&!SceneManager._scene.isBusy()&&SceneManager._scene._commandWindow.isOpenAndActive()&&!SceneManager.isSceneChanging());
  await p.evaluate(()=>{ArenaBattle.startLab();$gameTemp._arenaInventoryLab=true;});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive());
  const snap=()=>p.evaluate(()=>({counts:[2,3,4].map(id=>$gameParty.numItems($dataItems[id])),r:ArenaResources.snapshot(),g:{...$gameTemp._arenaPotionMenuGate},active:SceneManager._scene._itemWindow.active,locked:SceneManager._scene._arenaPotionLocked,pending:SceneManager._scene._pending,help:SceneManager._scene._helpWindow._text}));
  const pick=id=>p.evaluate(id=>{const s=SceneManager._scene,n=s._entries.findIndex(i=>i&&DataManager.isItem(i)&&i.id===id);s._page=Math.floor(n/$arenaInventory.pageSize);s.refreshEntries();s.focus(s._itemWindow);s._itemWindow.select(n%$arenaInventory.pageSize);},id);
  const key=async k=>{await p.keyboard.press(k,{delay:70});await p.waitForTimeout(40);};
  const ready=async()=>{await p.waitForTimeout(await p.evaluate(()=>Math.max(0,($gameTemp._arenaPotionMenuGate.until||0)-Date.now()+40)));};
  const point=()=>p.evaluate(()=>{const w=SceneManager._scene._itemWindow,r=w.itemRect(w.index()),c=Graphics._canvas.getBoundingClientRect();return{x:c.x+(w.x+w.padding+r.x+r.width/2)*c.width/Graphics.width,y:c.y+(w.y+w.padding+r.y+45)*c.height/Graphics.height};});
  await p.evaluate(()=>{const s=SceneManager._scene;[2,3,4].forEach(id=>$gameParty.gainItem($dataItems[id],8-$gameParty.numItems($dataItems[id])));$gameActors.actor(1).setHp(10);$gameActors.actor(1).setMp(0);ArenaPersistence.setResource('vigor',0,ArenaResources.snapshot().vigor.maximum);s.setMode('inventory');s._nav.select(0);s._stats.refresh();});
  assert.equal(await p.evaluate(()=>$arenaRecovery.menuIntervalMs),500);await video.start(p);await pick(2);
  await p.keyboard.down('Enter');await p.waitForTimeout(90);let first=await snap();assert.deepEqual(first.counts,[7,8,8]);assert.equal(first.g.duration,500);assert(first.active&&first.locked);await p.locator('#GameCanvas').screenshot({path:out+'/intervalo-slots.png'});
  await p.waitForTimeout(1100);assert.deepEqual((await snap()).counts,first.counts);await pick(3);await p.waitForTimeout(250);assert.deepEqual((await snap()).counts,first.counts);await p.keyboard.up('Enter');await p.waitForTimeout(70);await key('Enter');assert.deepEqual((await snap()).counts,[7,7,8]);
  checks.push('held Enter beyond interval consumes once; slot switch while held cannot bypass; release/fresh press works');
  await ready();await pick(4);let q=await point();await p.mouse.click(q.x,q.y,{delay:70});await p.waitForTimeout(40);let a=await snap();assert.deepEqual(a.counts,[7,7,7]);
  await p.mouse.click(q.x,q.y,{delay:70});await p.waitForTimeout(40);let z=await snap();assert.deepEqual(z.counts,a.counts);assert.equal(z.g.until,a.g.until);assert.equal(z.pending,null);await pick(2);q=await point();await p.mouse.click(q.x,q.y,{delay:70});await p.waitForTimeout(40);assert.deepEqual((await snap()).counts,a.counts);
  await ready();await p.waitForTimeout(200);assert.deepEqual((await snap()).counts,a.counts);assert.equal((await snap()).pending,null);await p.locator('#GameCanvas').screenshot({path:out+'/sem-uso-enfileirado.png'});
  checks.push('double click and different potion during500ms ignored; deadline not extended; no queued use at expiry');
  const cd=await c.newCDPSession(p);const touch=async(x,hold=65)=>{await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[x]});await p.waitForTimeout(hold);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(40);};
  await pick(3);q=await point();await touch(q);a=await snap();assert.deepEqual(a.counts,[7,6,7]);await pick(4);q=await point();await touch(q);z=await snap();assert.deepEqual(z.counts,a.counts);assert.equal(z.g.until,a.g.until);
  // Begin during protection, hold beyond expiry: releasing must not execute that request.
  await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[q]});await p.waitForTimeout(700);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(100);assert.deepEqual((await snap()).counts,a.counts);await touch(q);assert.deepEqual((await snap()).counts,[7,6,6]);
  checks.push('rapid cross-slot touches dropped; blocked gesture held beyond expiry stays rejected; fresh touch works');
  await ready();await pick(2);await p.evaluate(()=>$gameActors.actor(1).setHp($gameActors.actor(1).mhp));a=await snap();await key('Enter');z=await snap();assert.deepEqual(z.counts,a.counts);assert.equal(z.g.until,a.g.until);assert.match(z.help,/Sem efeito válido/);
  await pick(3);await p.evaluate(()=>$gameActors.actor(1).setMp(0));await key('Enter');z=await snap();assert.equal(z.counts[1],a.counts[1]-1);assert(z.g.until>Date.now());
  checks.push('invalid full-resource use preserves item/reason and does not restart or impose interval');
  // Navigation, bars and return stay live during protection.
  const until=z.g.until;await key('ArrowRight');assert.equal((await snap()).g.until,until);await p.waitForTimeout(120);assert.equal(await p.evaluate(()=>SceneManager._scene._stats._resourceBars.mp.shown),25);await key('Escape');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());
  await p.evaluate(()=>ArenaInventory.open('inventory'));await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive());assert.equal((await snap()).g.until,until);
  checks.push('navigation/return/bar transition work; menu reopen keeps same transient deadline');
  await ready();await p.evaluate(()=>{$arenaRecovery.menuIntervalMs=100;$gameActors.actor(1).setHp(10);});await pick(2);await key('Enter');a=await snap();assert.equal(a.g.duration,100);await ready();await key('Enter');z=await snap();assert.equal(z.counts[0],a.counts[0]-1);assert.equal(z.r.hp.current,100);await p.evaluate(()=>$arenaRecovery.menuIntervalMs=500);
  checks.push('configured100ms applied to next successful uses, recovery/max/stock unchanged');
  await ready();await pick(2);await p.evaluate(()=>$gameActors.actor(1).setHp(10));a=await snap();q=await point();await p.mouse.dblclick(q.x,q.y,{delay:70});await p.waitForTimeout(60);z=await snap();assert.equal(z.counts[0],a.counts[0]-1);assert.equal(z.r.hp.current,60);
  checks.push('browser dblclick consumes exactly one potion');
  await ready();await pick(3);await p.evaluate(()=>$gameActors.actor(1).setMp(0));a=await snap();q=await point();await p.mouse.move(q.x,q.y);await p.mouse.down();await p.waitForTimeout(800);assert.deepEqual((await snap()).counts,a.counts);await p.mouse.up();await p.waitForTimeout(60);z=await snap();assert.equal(z.counts[1],a.counts[1]-1);
  await p.mouse.down();await p.waitForTimeout(700);await p.mouse.up();await p.waitForTimeout(100);assert.deepEqual((await snap()).counts,z.counts);
  checks.push('held mouse does not repeat; click begun during interval cannot execute when released after expiry');
  await video.stop(p,out+'/protecao-menu.webm');assert.equal(await p.evaluate(()=>Graphics._errorPrinter.innerHTML),'');assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await b.version(),checks,first,errors,isolation:'Disposable Chrome context; stock/resources only test fixtures, default500ms except explicit100ms test. No personal saves, no combat cooldown.'},null,2)+'\n');console.log('PASS '+checks.length+' menu protection groups: hold/double click/touch/cross-slot/no queue/invalid/navigation/config');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
