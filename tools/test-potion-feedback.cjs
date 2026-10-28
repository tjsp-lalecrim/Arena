const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright'),video=require('./battle-video.cjs');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-17-r02';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({channel:'chrome',headless:true});
 try{
  const c=await b.newContext({viewport:{width:1100,height:800},hasTouch:true}),p=await c.newPage(),checks=[],errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8767/');await p.waitForFunction(()=>window.ArenaRecovery&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive()&&!SceneManager._scene.isBusy()&&!SceneManager.isSceneChanging());
  await p.evaluate(()=>{ArenaBattle.startLab();$gameTemp._arenaInventoryLab=true;});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive()).catch(async e=>{console.error(await p.evaluate(()=>({scene:SceneManager._scene.constructor.name,next:SceneManager._nextScene&&SceneManager._nextScene.constructor.name,map:$gameMap.mapId(),busy:SceneManager._scene.isBusy(),error:Graphics._errorPrinter.innerHTML})).catch(()=>({diagnostic:"page unavailable"})));throw e;});
  // Zero interval only for the isolated R02 animation stress; R03 tests the default500ms.
  await p.evaluate(()=>{$arenaRecovery.menuIntervalMs=0;window.pressPotionTest=function(){Input._currentState.ok=true;Input.update();SceneManager._scene.update();Input._currentState.ok=false;Input.update();SceneManager._scene.update();};});
  const key=async k=>{await p.keyboard.press(k,{delay:80});await p.waitForTimeout(30);};
  const pick=id=>p.evaluate(id=>{const s=SceneManager._scene,n=s._entries.findIndex(i=>i&&DataManager.isItem(i)&&i.id===id);if(n<0)throw Error('missing '+id);s._page=Math.floor(n/$arenaInventory.pageSize);s.refreshEntries();s.focus(s._itemWindow);s._itemWindow.select(n%$arenaInventory.pageSize);},id);
  const sample=()=>p.evaluate(()=>({bars:JSON.parse(JSON.stringify(SceneManager._scene._stats._resourceBars)),r:ArenaResources.snapshot(),stock:[2,3,4].map(id=>$gameParty.numItems($dataItems[id])),help:SceneManager._scene._helpWindow._text,modal:SceneManager._scene._confirm.visible}));
  const shot=async n=>p.locator('#GameCanvas').screenshot({path:out+'/'+n+'.png'});
  const point=()=>p.evaluate(()=>{const w=SceneManager._scene._itemWindow,r=w.itemRect(w.index()),c=Graphics._canvas.getBoundingClientRect();return{x:c.x+(w.x+w.padding+r.x+r.width/2)*c.width/Graphics.width,y:c.y+(w.y+w.padding+r.y+45)*c.height/Graphics.height};});
  await p.evaluate(()=>{const s=SceneManager._scene;[2,3,4].forEach(id=>$gameParty.gainItem($dataItems[id],3-$gameParty.numItems($dataItems[id])));$gameActors.actor(1).setHp(10);$gameActors.actor(1).setMp(0);ArenaPersistence.setResource('vigor',0,ArenaResources.snapshot().vigor.maximum);s.setMode('inventory');s._nav.select(0);s._stats.refresh();});
  await shot('inventario-barras-antes');await video.start(p);await pick(2);
  const immediate=await p.evaluate(()=>{
   const s=SceneManager._scene,painted=[],draw=s._itemWindow.contents.drawText;
   s._itemWindow.contents.drawText=function(t){painted.push(String(t));return draw.apply(this,arguments);};
   try{pressPotionTest();return {hp:$gameActors.actor(1).hp,count:$gameParty.numItems($dataItems[2]),bar:{...s._stats._resourceBars.hp},painted,help:s._helpWindow._text};}
   finally{s._itemWindow.contents.drawText=draw;}
  });
  assert.equal(immediate.hp,60);assert.equal(immediate.count,2);assert.equal(immediate.bar.target,60);assert(immediate.bar.shown>=10&&immediate.bar.shown<60);assert(immediate.painted.includes('×2'));assert(!/Restam|Quantidade|utilizada|Operação concluída/.test(immediate.help));
  await p.waitForTimeout(90);const middle=await sample();assert(middle.bars.hp.shown>10&&middle.bars.hp.shown<60);await shot('vida-preenchendo');
  const consecutive=await p.evaluate(()=>{const s=SceneManager._scene;pressPotionTest();return{bar:{...s._stats._resourceBars.hp},hp:$gameActors.actor(1).hp,count:$gameParty.numItems($dataItems[2])};});
  assert.equal(consecutive.hp,100);assert.equal(consecutive.count,1);assert.equal(consecutive.bar.target,100);assert(consecutive.bar.from>=middle.bars.hp.shown&&consecutive.bar.from<=60);
  await p.waitForTimeout(320);let s=await sample();assert.equal(s.bars.hp.shown,100);await p.waitForTimeout(300);assert.equal((await sample()).bars.hp.shown,100);
  await p.evaluate(()=>pressPotionTest());assert.equal((await sample()).stock[0],1);assert.match((await sample()).help,/Sem efeito válido/);
  checks.push('native use updates HP/stock/painted slot synchronously; 240ms fill; consecutive recovery retargets; full-resource reason without consumption');
  await p.evaluate(()=>{$gameActors.actor(1).setHp(98);SceneManager._scene._stats.refresh();});
  await key('Enter');await p.waitForTimeout(260);s=await sample();assert.equal(s.r.hp.current,100);assert.equal(s.stock[0],0);assert.equal(s.bars.hp.shown,100);assert.equal(await p.evaluate(()=>SceneManager._scene._entries.some(i=>i&&DataManager.isItem(i)&&i.id===2)),false);
  checks.push('keyboard near-maximum recovery shows only actual +2, last item disappears immediately');
  await pick(3);let q=await point();await p.mouse.click(q.x,q.y,{delay:90});await p.waitForTimeout(90);s=await sample();assert.equal(s.r.mp.current,25);assert.equal(s.stock[1],2);assert.equal(s.bars.mp.target,25);await shot('mana-preenchendo');
  await key('Enter');await p.waitForTimeout(280);s=await sample();assert.equal(s.r.mp.current,50);assert.equal(s.stock[1],1);assert.equal(s.bars.mp.shown,50);
  await pick(4);q=await point();const cd=await c.newCDPSession(p);await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[q]});await p.waitForTimeout(90);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(60);s=await sample();assert.equal(s.r.vigor.current,50);assert.equal(s.stock[2],2);await shot('vigor-preenchendo');
  await key('Enter');await p.waitForTimeout(280);s=await sample();assert.equal(s.r.vigor.current,100);assert.equal(s.stock[2],1);assert.equal(s.bars.vigor.shown,100);assert.equal(s.modal,false);await shot('inventario-barras-depois');
  checks.push('mouse/keyboard Mana and touch/keyboard Vigor update native resources/stock once, each independent fill converges');
  // Record actual draw bounds; all six attributes remain in the same 200px panel.
  const geometry=await p.evaluate(()=>{const w=SceneManager._scene._stats,rows=[],draw=w.contents.drawText;w.contents.drawText=function(t,x,y,width,height){rows.push({text:String(t),x,y,width,height,font:this.fontSize});return draw.apply(this,arguments);};try{w.refresh();return{rows,content:[w.contentsWidth(),w.contentsHeight()],window:[w.x,w.y,w.width,w.height]};}finally{w.contents.drawText=draw;}});
  assert.deepEqual(geometry.window,[480,424,336,200]);for(const r of geometry.rows){assert(r.x>=0&&r.y>=0&&r.x+r.width<=geometry.content[0]&&r.y+r.height<=geometry.content[1],JSON.stringify(r));}
  for(const name of ['Vida','Mana','Vigor','Força','Resistência','Inteligência','Res. Mágica','Agilidade','Sorte'])assert(geometry.rows.some(r=>r.text===name),name);
  checks.push('original panel bounds/fonts retained; three bars and all attributes/material fit without clipping');
  await p.evaluate(()=>{$gameActors.actor(1).setMp(0);SceneManager._scene._stats.refresh();});await pick(3);await key('Enter');const spent=(await sample()).r;
  await key('Escape');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive());
  await p.evaluate(()=>{$gameSystem.onBeforeSave();if(!DataManager.saveGame(17)||!DataManager.loadGame(17))throw Error('save/load');$gameSystem.onAfterLoad();ArenaInventory.open('inventory');});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive());
  s=await sample();assert.deepEqual(s.r,spent);for(const k of ['hp','mp','vigor'])assert.equal(s.bars[k].shown,s.r[k].current);assert.equal(s.stock[1],0);
  checks.push('exit during animation never blocks; native save/load and reopen reconstruct actual values with no old tween');
  await video.stop(p,out+'/recuperacao-visual.webm');
  await p.evaluate(()=>{$gameParty.allItems().forEach(i=>$gameParty.loseItem(i,999));const s=SceneManager._scene;s.refreshEntries();s.focus(s._itemWindow);s.updateDescription();});assert.match((await sample()).help,/Inventário vazio/);await shot('inventario-vazio-barras');
  assert.equal(await p.evaluate(()=>Graphics._errorPrinter.innerHTML),'');assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await b.version(),checks,immediate,middle,consecutive,geometry,errors,isolation:'Disposable Chrome/save17; only technical stock, no personal saves. Video uses real canvas; controlled resource fixtures in memory.'},null,2)+'\n');
  console.log('PASS '+checks.length+' visual recovery groups: actual immediate state, rendered quantity, retargeting, inputs, limits, geometry, persistence');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
