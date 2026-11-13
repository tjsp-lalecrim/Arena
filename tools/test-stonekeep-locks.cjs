// Explicit5-lock consumer only. Native choice UI, force work, self switches and RAM.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),{chromium}=require('playwright');
const R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
const prior=f=>JSON.parse(cp.execFileSync('git',['show','9031298:'+f],{cwd:R,encoding:'utf8',maxBuffer:20e6}));
const s=read('doc/mapas/STONEKEEP_ACESSOS_A2_B2_M02.json'),c=read('data/ArenaStonekeepWhole.json'),m=read('data/Map015.json'),old=prior('data/Map015.json');
const out=path.join(R,'doc/evidencias/m02-stonekeep-acessos/locks'),url='http://127.0.0.1:8774/';fs.mkdirSync(out,{recursive:true});
const pocket=!!c.access.dryPassage,expectedEvents=pocket?339:301;
assert.equal(c.doors.length,pocket?32:28);assert.equal(m.events.filter(Boolean).length,expectedEvents);assert.deepEqual(m.events.slice(0,257),old.events);
const strip=v=>JSON.parse(JSON.stringify(v,(k,v)=>k==='accessDependency'?undefined:v));
assert.deepEqual(strip(c.encounters.entries.slice(0,47)),strip(prior('data/ArenaStonekeepWhole.json').encounters.entries));assert.equal(c.encounters.entries.length,pocket?49:47);
const threshold=new Set(s.lockedDoors.concat(pocket?s.pocketDoors:[]).flatMap(d=>Array.from({length:9},(_,i)=>[d.center[0]+i%3-1,d.center[1]+Math.floor(i/3)-1].join(','))));
const dry=new Set(pocket?s.dryPassage.cells.flatMap(d=>Array.from({length:9},(_,i)=>[d.center[0]+i%3-1,d.center[1]+Math.floor(i/3)-1].join(','))):[]);
for(let z=0;z<6;z++)for(let y=0;y<274;y++)for(let x=0;x<274;x++){const k=(z*274+y)*274+x;if(m.data[k]!==old.data[k]){if(dry.has(x+','+y)){assert([0,5].includes(z));if(z===5){assert.equal(old.data[k],1);assert.equal(m.data[k],4);}}else{assert.equal(z,5);assert(threshold.has(x+','+y));assert.equal(old.data[k],4);assert.equal(m.data[k],6);}}}
for(const n of ['Map008','Map009','Map010','Map011','Map012','Map013','Map014','ArenaCampaign','ArenaLoot','Items','Enemies','Troops','Skills','Weapons','Armors','Tilesets'])assert.deepEqual(read('data/'+n+'.json'),prior('data/'+n+'.json'),n);
const stable=['Map015','ArenaStonekeepWhole','Map012','ArenaCampaign','Items','MapInfos'],bytes=stable.map(n=>fs.readFileSync(path.join(R,'data/'+n+'.json'),'utf8'));cp.execFileSync(process.execPath,['tools/build-stonekeep-sample.cjs'],{cwd:R});stable.forEach((n,i)=>assert.equal(fs.readFileSync(path.join(R,'data/'+n+'.json'),'utf8'),bytes[i],n));
if(process.argv.includes('--data-only')){console.log('PASS explicit access boundaries and full reconstruction; pocket=',pocket);process.exit(0);}
(async()=>{let b;try{
 b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1080,height:850}}),errors=[],missing=[],checks=[],report=[];p.setDefaultTimeout(20000);p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove()).catch(async e=>{console.error(await p.evaluate(()=>({scene:SceneManager._scene.constructor.name,messageBusy:$gameMessage.isBusy(),choice:SceneManager._scene._messageWindow?._choiceWindow.active,menuCalling:SceneManager._scene._menuCalling,work:$gameMap._arenaStonekeepLockWork,canMove:$gamePlayer.canMove()})));throw e;});
 const core=()=>p.evaluate(()=>({quests:ArenaPersistence.snapshot().quests,items:$gameParty._items,gold:$gameParty.gold(),resources:ArenaResources.snapshot(),attributes:ArenaAttributes.snapshot(),loot:ArenaLoot.snapshot(),enemies:ArenaPersistence.snapshot().enemies,exp:$gameActors.actor(1).currentExp()}));
 const lock=()=>p.evaluate(()=>ArenaEncounters.currentConfiguration().config.entries.forEach(v=>$gameMap.event(v.eventId)._locked=true));
 await p.goto(url);await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());await p.evaluate(()=>ArenaStonekeepWhole.preview());await p.waitForFunction(()=>$gameMap.mapId()===15&&!$gamePlayer.isTransferring());await ready();await lock();const initial=await core();
 checks.push('Clean native boot/plugin order;5 LOCK values1/2/3 explicitly registered; old256 events/47 encounters/23 doors and tables/campaign unchanged; reconstruction stable');
 assert.equal(await p.evaluate(()=>ArenaStonekeepAccess.force('unknown')),false);
 for(const v of s.lockedDoors){const d=c.doors.find(d=>d.id===v.id);for(const sign of [-1,1]){
  await p.evaluate(({d,sign})=>{const h=d.axis==='east-west';$gamePlayer.locate(d.center[0]+(h?sign*2:0),d.center[1]+(h?0:sign*2));$gamePlayer.center($gamePlayer.x,$gamePlayer.y);$gamePlayer.setDirection(h?(sign<0?6:4):(sign<0?2:8));}, {d,sign});
  if(sign<0){assert.equal(await p.evaluate(id=>ArenaDungeon.openDoor(id),d.id),false);assert.equal(await p.evaluate(id=>ArenaStonekeepAccess.isUnlocked(id),d.id),false);
   // Escape chooses cancellation and does not unlock, spend or begin a queued action.
   await p.keyboard.press('Enter',{delay:70});await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive()&&!SceneManager._scene._messageWindow._choiceWindow._arenaCourtAwaitNeutral);await p.keyboard.press('Escape',{delay:70});await ready();assert.equal(await p.evaluate(()=>ArenaStonekeepAccess.working()),false);assert.deepEqual(await core(),initial);
   await p.keyboard.press('Enter',{delay:70});await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive()&&!SceneManager._scene._messageWindow._choiceWindow._arenaCourtAwaitNeutral);await p.keyboard.press('ArrowUp',{delay:70});await p.keyboard.press('Enter',{delay:70});await p.waitForFunction(()=>ArenaStonekeepAccess.working());assert.equal(await p.evaluate(()=>$gamePlayer.canMove()),false);assert.equal(await p.evaluate(id=>ArenaStonekeepAccess.force(id),d.id),false);
   if(d.lockValue===2)await p.locator('#GameCanvas').screenshot({path:path.join(out,'lock2-forcando.png')});
   if(d.lockValue===3){assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));}
   await p.waitForFunction(id=>ArenaStonekeepAccess.isUnlocked(id)&&!ArenaStonekeepAccess.working(),d.id);await ready();await lock();
   await p.waitForFunction(id=>ArenaDungeon.door(id).eventIds.every(n=>$gameMap.event(n).isThrough()),d.id);
  }else assert.equal(await p.evaluate(id=>ArenaDungeon.openDoor(id),d.id),true);
  await p.waitForFunction(id=>!$gameMap._arenaDoorTransitions?.[id]&&ArenaDungeon.door(id).eventIds.every(n=>$gameMap.event(n).isThrough()),d.id);
  const key=d.axis==='east-west'?(sign<0?'ArrowRight':'ArrowLeft'):(sign<0?'ArrowDown':'ArrowUp');for(let n=0;n<4;n++){await p.keyboard.press(key,{delay:70});await p.waitForFunction(()=>!$gamePlayer.isMoving());}
  assert.equal(await p.evaluate(id=>ArenaDungeon.closeDoor(id),d.id),true);await p.waitForFunction(id=>!$gameMap._arenaDoorTransitions?.[id],d.id);
  assert.equal(await p.evaluate(id=>ArenaStonekeepAccess.force(id),d.id),false);report.push({id:d.id,lockValue:d.lockValue,side:sign,forced:sign<0,crossed:true});
 }}
 assert.deepEqual(await core(),initial);checks.push('5 locks: direct opening blocked, cancellation unchanged, native choice/force/progress/unlock; legitimate passage/reclose both ways, no resource/item/EXP/reward cost, no repeat force; LOCK3 work survives RAM save/load');
 await p.evaluate(()=>{$gamePlayer.locate(153,132);});assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);const states=await p.evaluate(()=>$arenaStonekeepWhole.access.lockedDoorIds.map(id=>ArenaStonekeepAccess.isUnlocked(id)));
 await p.evaluate(()=>{$gameMap._events.length=257;});assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();assert.equal(await p.evaluate(()=>$gameMap.events().length),expectedEvents);assert.deepEqual(await p.evaluate(()=>$arenaStonekeepWhole.access.lockedDoorIds.map(id=>ArenaStonekeepAccess.isUnlocked(id))),states);assert.deepEqual(await core(),initial);
 assert.equal(await p.evaluate(()=>DataManager.saveGame(16)),false);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 checks.push('Native B unlocked/A opened states restore independently, old256-event RAM array appends45 components; campaign resources/quest/receipts and normal save isolation preserved');
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({base:'9031298',browser:b.version(),url,checks,doors:report,errors,missing,adaptation:'Universal deterministic force45frames per LOCK level; no class/weapon/item/stat/resource requirement, no original chance/wear copied',originalObservation:'None; documentary/data evidence distinguished',manual:'Deferred; quick map assessment is preliminary only'},null,2)+'\n');console.log('PASS LOCKS',checks.length,'groups');
 }finally{if(b)await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
