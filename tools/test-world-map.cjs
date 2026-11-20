// Focused travel/UI contracts. Fresh Chrome context; synthetic campaign, no personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/mapa-mundial');
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const context=await browser.newContext({viewport:{width:1100,height:850}}),p=await context.newPage(),checks=[],errors=[],missing=[];
 p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 const title=()=>p.waitForFunction(()=>window.ArenaWorldMap&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const map=id=>p.waitForFunction(id=>SceneManager._scene instanceof Scene_Map&&SceneManager._sceneStarted&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&$gamePlayer.canMove()&&!$gamePlayer.isTransferring()&&(!id||$gameMap.mapId()===id),id);
 const key=async k=>{await p.keyboard.press(k,{delay:85});await p.waitForTimeout(220);};
 const world=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaWorldMap&&SceneManager._scene._list._ready&&SceneManager._scene._list.active);
 const shoot=n=>p.locator('#GameCanvas').screenshot({path:path.join(out,n+'.png')});
 const protectedState=()=>p.evaluate(()=>JSON.stringify({actors:$gameActors,items:$gameParty._items,weapons:$gameParty._weapons,armors:$gameParty._armors,gold:$gameParty.gold(),resources:ArenaResources.snapshot(),attributes:ArenaAttributes.snapshot(),q1:ArenaQuests.snapshot(),q2:ArenaQuests.snapshot('MQ02'),loot:ArenaLoot.snapshot(),ria:ArenaRiaVision.state()}));
 const trip=()=>p.evaluate(()=>ArenaWorldMap.state());
 async function clickPoint(id){const pt=await p.evaluate(id=>{const w=SceneManager._scene._map,h=w._hits.find(h=>h.id===id);return {x:w.x+w.padding+h.x,y:w.y+w.padding+h.y};},id),box=await p.locator('#GameCanvas').boundingBox(),size=await p.evaluate(()=>({w:Graphics.width,h:Graphics.height}));await p.mouse.click(box.x+pt.x*box.width/size.w,box.y+pt.y*box.height/size.h,{delay:85});await p.waitForTimeout(220);}
 async function province(id='hammerfell'){
  await world();await p.evaluate(id=>{const w=SceneManager._scene._list;w.select(w.rows.findIndex(r=>r.id===id));},id);await key('Enter');await world();
 }
 async function choose(id){await p.evaluate(id=>{const w=SceneManager._scene._list;w.select(w.rows.findIndex(r=>r.id===id));},id);await key('Enter');await p.waitForFunction(()=>SceneManager._scene._confirm.active&&SceneManager._scene._confirm._ready);}
 async function go(){await key('ArrowUp');await key('Enter');}
 async function reload(id,slot=18){assert(await p.evaluate(slot=>{$gameSystem.onBeforeSave();return DataManager.saveGame(slot);},slot));await p.reload();await title();assert(await p.evaluate(slot=>DataManager.loadGame(slot),slot));await p.evaluate(()=>{$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await map(id);}
 async function transfer(to){await p.evaluate(to=>{$gameTemp.clearDestination();$gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction||2,0);},to);await map(to.mapId);}
 async function leaveStone(){await p.evaluate(()=>{const c=ArenaStonekeep.configuration(),e=$gameMap.event(c.exitEventId),i=new Game_Interpreter();$gamePlayer.locate(e.x,e.y+1);i._mapId=$gameMap.mapId();i._eventId=c.exitEventId;if(!ArenaStonekeep.leave(i))throw Error('Stonekeep exit denied');});await map(9);}
 async function leaveFang(){await p.evaluate(()=>{const e=$gameMap.event(1),i=new Game_Interpreter();$gamePlayer.locate(e.x,e.y+1);i._mapId=$gameMap.mapId();i._eventId=1;if(!ArenaFangCells.leave(i))throw Error('Fang exit denied');});await map(9);}
 await p.goto('http://127.0.0.1:8774/');await title();await p.evaluate(()=>ArenaRihad.preview());await map(9);
 assert.equal(await p.evaluate(()=>ArenaWorldMap.open()),false,'RAM session remains isolated');assert.equal(await p.evaluate(()=>DataManager.saveGame(18)),false);
 const raw=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},raw);await map(9);
 checks.push('Technical session cannot use world travel or normal saves; synthetic normal campaign restored in isolated profile.');
 const original=await protectedState();
 await key('Escape');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu&&SceneManager._scene._commandWindow.active);
 assert.equal(await p.evaluate(()=>SceneManager._scene._commandWindow._list.filter(c=>c.symbol==='arenaWorldMap').length),1);
 await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaWorldMap');w.processOk();});await world();await shoot('tamriel');
 assert.equal(await p.evaluate(()=>SceneManager._scene._list.rows.length),9);
 for(const id of ['high-rock','skyrim','morrowind','summurset','valenwood','elsweyr','black-marsh','imperial']){await province(id);assert(await p.evaluate(()=>SceneManager._scene._list.rows.length>0&&SceneManager._scene._list.rows.every(r=>r.enabled===false))); await key('Escape');await world();}
 await clickPoint('hammerfell');await world();assert.equal(await p.evaluate(()=>SceneManager._scene._list.rows.length),32);assert(await p.evaluate(()=>SceneManager._scene._list.rows.every(r=>r.enabled===false)));await shoot('hammerfell-chegada');
 await key('Escape');await key('Escape');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu);await key('Escape');await map(9);
 assert.equal(await protectedState(),original);assert.equal((await trip()).sequence,0);
 checks.push('Menu, all nine provinces, unavailable provinces, no quest spoilers and cancellation preserve campaign.');
 await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',40,Object.assign({},q.objectives,{parchmentRequest:true}),false);const a=$gameActors.actor(1);a.setHp(Math.max(1,a.hp-7));a.setMp(Math.max(0,a.mp-3));});
 const before=await protectedState();await key('m');await world();await province();await shoot('hammerfell-stonekeep');await clickPoint('stonekeep');await p.waitForFunction(()=>SceneManager._scene._confirm.active&&SceneManager._scene._confirm._ready);await shoot('confirmacao');await key('Enter');await world();
 assert.equal(await protectedState(),before);assert.equal((await trip()).sequence,0,'confirmation defaults to Cancel');
 await choose('stonekeep');await go();await map(15);assert.equal(await protectedState(),before);assert.equal((await trip()).trip.destinationId,'stonekeep.entry');assert.equal((await trip()).trip.phase,'arrived');
 const atStone=await trip();await reload(15);assert.deepEqual(await trip(),atStone);assert.equal(await protectedState(),before);
 await key('m');await world();await province();assert.match(await p.evaluate(()=>ArenaWorldMap.reason('rihad')),/sair/);assert.equal(await p.evaluate(()=>ArenaWorldMap.travel('rihad').ok),false);await shoot('consulta-dungeon');await key('Escape');await key('Escape');await map(15);await leaveStone();assert.equal(await protectedState(),before);
 checks.push('M shortcut, explicit confirmation/cancel, Rihad -> production Stonekeep -> Rihad, resources/quest/receipts unchanged, normal save/load and dungeon consultation only.');
 // A real source/receipt contract discovers Fang Lair; do not infer discovery from a stage alone.
 await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');if(ArenaPersistence.claimSource('stonekeep.parchment')!=='granted')throw Error('parchment source');ArenaPersistence.setQuest('MQ02',50,Object.assign({},q.objectives,{parchmentRecovered:true}),false);if(ArenaPersistence.consumeImportant('stonekeep.parchment','MQ02.rihad.parchment','deliver')!=='consumed')throw Error('delivery receipt');ArenaPersistence.setQuest('MQ02',60,Object.assign({},q.objectives,{parchmentDelivered:true,fangLairKnown:true}),false);});
 const revealed=await protectedState();await key('m');await world();await province();await shoot('hammerfell-revelada');await choose('fang');await go();await map(13);assert.equal(await protectedState(),revealed);await reload(13);assert.equal(await protectedState(),revealed);await leaveFang();assert.equal(await protectedState(),revealed);
 checks.push('Receipt-gated Fang Lair discovery; Rihad -> Fang Lair -> Rihad and normal save/load preserve all protected state.');
 // The existing gate now uses exactly the same service; second call cannot queue a second trip.
 const n=(await trip()).sequence;
 assert.deepEqual(await p.evaluate(()=>{const e=$gameMap.event(3);$gamePlayer.locate(e.x,e.y+1);const i=new Game_Interpreter();i._mapId=$gameMap.mapId();i._eventId=3;i._branch[0]=1;return [ArenaRihad.travelFromGate(i,'stonekeep'),ArenaRihad.travelFromGate(i,'stonekeep')];}),[true,false]);await map(15);assert.equal((await trip()).sequence,n+1);await leaveStone();
 // Save in the narrow interval after reservation, before arrival. Native MV transfer resumes once.
 const seq=(await trip()).sequence;
 assert(await p.evaluate(()=>{if(!ArenaWorldMap.travel('stonekeep').ok)throw Error('transition');$gameSystem.onBeforeSave();return DataManager.saveGame(18);}));
 await p.reload();await title();assert(await p.evaluate(()=>DataManager.loadGame(18)));await p.evaluate(()=>{$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await map(15);assert.equal((await trip()).sequence,seq+1);assert.equal((await trip()).trip.phase,'arrived');await leaveStone();
 checks.push('Gate delegates to shared service; duplicate execution refused; save during reserved transition restores exactly once.');
 await transfer(await p.evaluate(()=>({mapId:$arenaRihad.inn.entry.mapId,x:$arenaRihad.inn.entry.x,y:$arenaRihad.inn.entry.y})));await key('m');await world();await province();assert.match(await p.evaluate(()=>ArenaWorldMap.reason('fang')),/sair/);await shoot('consulta-pousada');await key('Escape');await key('Escape');await map(18);
 await transfer({mapId:13,x:288,y:9});await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',100,Object.assign({},q.objectives,{fangTharnVisionRead:true}),false);});
 const pending=await protectedState();await key('m');await world();await province();assert.match(await p.evaluate(()=>ArenaWorldMap.reason('rihad')),/retaliação/);assert.equal(await p.evaluate(()=>ArenaWorldMap.travel('rihad').ok),false);await key('Escape');await key('Escape');await map(13);assert.equal(await protectedState(),pending);
 checks.push('Inn and Fang Lair remain consultation-only; already-read Tharn vision at stage100 cannot bypass pending retaliation or change quest.');
 await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',110,Object.assign({},q.objectives,{fangRetaliationWon:true}),true);});
 await transfer(await p.evaluate(()=>$arenaRihad.outskirts.entry));const outskirts=await protectedState();await key('m');await world();await province();await choose('rihad');await go();await map(9);assert.equal(await protectedState(),outskirts);
 // Conditions are rechecked after selection; a concurrent battle lock forbids execution.
 await key('m');await world();await province();await choose('fang');await p.evaluate(()=>{$gameTemp._arenaEncounterLock={id:'controlled-test-only'};});await go();await world();assert.equal(await p.evaluate(()=>$gamePlayer.isTransferring()),false);assert.equal(await p.evaluate(()=>$gameMap.mapId()),9);
 await p.evaluate(()=>{$gameTemp._arenaEncounterLock=null;});await key('Escape');await key('Escape');await map(9);
 await p.evaluate(()=>{$gameParty._inBattle=true;});assert.equal(await p.evaluate(()=>ArenaWorldMap.open()),false);await p.evaluate(()=>{$gameParty._inBattle=false;});
 checks.push('Exterior outskirts -> Rihad works; a lock appearing while confirmation is open is revalidated; battle cannot open map.');
 // Small desktop canvas, not merely CSS scaling: all controls remain inside usable dimensions.
 await p.evaluate(()=>{Graphics.boxWidth=640;Graphics.boxHeight=480;});await key('m');await world();await province();await shoot('janela-menor');
 assert(await p.evaluate(()=>{const s=SceneManager._scene;return[s._heading,s._map,s._list,s._help].every(w=>w.x>=0&&w.y>=0&&w.x+w.width<=Graphics.boxWidth&&w.y+w.height<=Graphics.boxHeight);}));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:await browser.version(),url:'http://127.0.0.1:8774/',checks,errors,missing,scope:'Synthetic normal campaign, isolated Chrome context; no personal saves. Existing combat/Tharn sequence reused without replaying battles. Cartographic appearance/owner assessment pending.'},null,2)+'\n');
 console.log('World map focused validation passed: '+checks.length+' groups.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
