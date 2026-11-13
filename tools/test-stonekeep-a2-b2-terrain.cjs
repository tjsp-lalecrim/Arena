// Door delta only: real MV interactions in disposable Chrome/RAM on canonical localhost.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),{chromium}=require('playwright');
const R=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
const prior=f=>JSON.parse(cp.execFileSync('git',['show','55e42e4:'+f],{cwd:R,encoding:'utf8',maxBuffer:20e6}));
const s=read('doc/mapas/STONEKEEP_A2_B2_M02.json'),c=read('data/ArenaStonekeepWhole.json'),m=read('data/Map015.json'),old=prior('data/Map015.json');
const out=path.join(R,'doc/evidencias/m02-stonekeep-a2-b2/terrain'),url='http://127.0.0.1:8774/';fs.mkdirSync(out,{recursive:true});
assert.equal(c.doors.length,23);assert.equal(c.coverage.implementedDoors,23);
assert.deepEqual(c.doors.slice(0,7),prior('data/ArenaStonekeepWhole.json').doors);
const appended=c.a2b2.enemyIds?s.enemies.length:0;assert.deepEqual(c.encounters.entries.slice(0,33),prior('data/ArenaStonekeepWhole.json').encounters.entries);assert.equal(c.encounters.entries.length,33+appended);
assert.deepEqual(m.events.slice(0,99),old.events);assert.equal(m.events.filter(Boolean).length,242+appended);
const materials=new Set(s.materialCells.map(v=>v.view.join(',')));
const changed=new Set(s.doors.flatMap(d=>Array.from({length:9},(_,i)=>[d.center[0]+i%3-1,d.center[1]+Math.floor(i/3)-1].join(','))));
let delta=0;for(let z=0;z<6;z++)for(let y=0;y<274;y++)for(let x=0;x<274;x++){
 const i=(z*274+y)*274+x;
 if(m.data[i]!==old.data[i]){if(z===5){assert(changed.has(x+','+y));assert.equal(old.data[i],4);assert.equal(m.data[i],6);delta++;}else{assert(z<=1);assert(materials.has([Math.floor((x-2)/3),Math.floor((y-2)/3)].join(',')));assert(!(x>=26&&x<=163&&y<=100));}}
}assert.equal(delta,144);
for(const f of ['Map008','Map009','Map010','Map011','Map012','Map013','Map014','ArenaCampaign','ArenaStonekeep','Items','Enemies','Troops','Skills','Weapons','Armors','ArenaLoot','Tilesets'])assert.deepEqual(read('data/'+f+'.json'),prior('data/'+f+'.json'),f);
const inv=read('doc/evidencias/m02-stonekeep-cobertura/inventario.json');
for(const d of s.doors){const src=inv.doors.find(v=>v.original.join(',')===d.sourceOriginal.join(','));assert(src);assert.equal(src.lockValue,null);assert.deepEqual(src.view,d.view);assert.equal(d.triggerAtDoor,null);}
for(const d of s.deferredDoors){assert.equal(inv.doors.find(v=>v.original.join(',')===d.sourceOriginal.join(',')).lockValue,d.lockValue);assert(!c.doors.some(v=>v.sourceOriginal.join(',')===d.sourceOriginal.join(',')));}
const files=['Map015','ArenaStonekeepWhole','Map012','ArenaCampaign','Items','MapInfos'],bytes=files.map(n=>fs.readFileSync(path.join(R,'data/'+n+'.json'),'utf8'));
cp.execFileSync(process.execPath,['tools/build-stonekeep-sample.cjs'],{cwd:R});files.forEach((n,i)=>assert.equal(fs.readFileSync(path.join(R,'data/'+n+'.json'),'utf8'),bytes[i],n+' rebuild'));
if(process.argv.includes('--data-only')){console.log('PASS terrain boundaries/component extraction/reconstruction, with',appended,'declared later encounters');process.exit(0);}
(async()=>{let b;try{
 assert.equal((await(await fetch(url+'__arena_dev/status')).json()).root,R);
 b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1080,height:850}}),errors=[],missing=[],checks=[];p.setDefaultTimeout(20000);
 p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
 const lock=()=>p.evaluate(()=>ArenaEncounters.currentConfiguration().config.entries.forEach(v=>$gameMap.event(v.eventId)._locked=true));
 const core=()=>p.evaluate(()=>({mq1:ArenaQuests.snapshot('MQ01'),mq2:ArenaQuests.snapshot('MQ02'),items:$gameParty._items,gold:$gameParty.gold(),resources:ArenaResources.snapshot(),attributes:ArenaAttributes.snapshot(),loot:ArenaLoot.snapshot(),enemies:ArenaPersistence.snapshot().enemies}));
 const settle=async id=>{await p.waitForFunction(id=>!$gameMap._arenaDoorTransitions?.[id],id);await p.waitForFunction(id=>{const d=ArenaDungeon.door(id),open=$gameSelfSwitches.value([15,d.eventIds[0],'A']);return d.eventIds.every(n=>$gameMap.event(n).isThrough()===(open||$dataMap.events[n].pages[0].through));},id);};
 await p.goto(url);await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());await p.evaluate(()=>ArenaStonekeepWhole.preview());await p.waitForFunction(()=>$gameMap.mapId()===15&&!$gamePlayer.isTransferring());await ready();await lock();assert.equal(await p.evaluate(()=>DataManager.saveGame(16)),false);
 const initial=await core();checks.push('Source/LOCK/TRIG, Old33 encounters/98 events/7 doors unchanged;144 threshold regions plus bounded approved materials, no height changes; parent reconstruction stable, campaign/assets/A1 preserved');
 const report=[];
 for(const d of c.doors.slice(7)){
  const horizontal=d.axis==='east-west',v={id:d.id,x:d.center[0],y:d.center[1],horizontal};
  // Both valid sides use native event interaction and actual steps across the3-tile opening.
  for(const sign of [-1,1]){
   const dir=horizontal?(sign===-1?6:4):(sign===-1?2:8),key={2:'ArrowDown',4:'ArrowLeft',6:'ArrowRight',8:'ArrowUp'}[dir];
   const state=await p.evaluate(v=>{
    const d=ArenaDungeon.door(v.id),x=v.x+(v.horizontal?v.sign*2:0),y=v.y+(v.horizontal?0:v.sign*2);
    $gamePlayer.locate(x,y);$gamePlayer.center(x,y);$gamePlayer.setDirection(v.dir);
    return{start:[x,y],anchors:d.eventIds.map(id=>[$gameMap.event(id).x,$gameMap.event(id).y]),blocked:!$gamePlayer.canPass(x+(v.horizontal?-v.sign:0),y+(v.horizontal?0:-v.sign),v.dir)};
   },{...v,sign,dir});assert(state.blocked,d.id+' closed');
   await p.keyboard.press('Enter',{delay:80});await p.waitForFunction(id=>!!$gameMap._arenaDoorTransitions?.[id],d.id);
   assert.equal(await p.evaluate(id=>ArenaDungeon.toggleDoor(id),d.id),false);
   await settle(d.id);assert.equal(await p.evaluate(id=>$gameSelfSwitches.value([15,ArenaDungeon.door(id).eventIds[0],'A']),d.id),true);
   const anchor=await p.evaluate(id=>ArenaDungeon.door(id).eventIds.map(id=>[$gameMap.event(id).x,$gameMap.event(id).y]),d.id);assert.deepEqual(anchor,state.anchors);
   for(let n=0;n<2;n++){await p.keyboard.press(key,{delay:80});await p.waitForFunction(()=>!$gamePlayer.isMoving());}
   assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),d.center);
   assert.equal(await p.evaluate(id=>ArenaDungeon.closeDoor(id),d.id),false);
   for(let n=0;n<2;n++){await p.keyboard.press(key,{delay:80});await p.waitForFunction(()=>!$gamePlayer.isMoving());}
   assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),[v.x+(horizontal?-sign*2:0),v.y+(horizontal?0:-sign*2)]);
   if(sign===-1&&[0,1,4,7].includes(c.doors.indexOf(d)-7))await p.locator('#GameCanvas').screenshot({path:path.join(out,d.id.replaceAll('.','-')+'-aberta.png')});
   const reverse={2:8,4:6,6:4,8:2}[dir];await p.evaluate(dir=>$gamePlayer.setDirection(dir),reverse);
   await p.keyboard.press('Enter',{delay:80});await p.waitForFunction(id=>!!$gameMap._arenaDoorTransitions?.[id],d.id);await settle(d.id);
   assert.equal(await p.evaluate(id=>$gameSelfSwitches.value([15,ArenaDungeon.door(id).eventIds[0],'A']),d.id),false);
   if(sign===-1&&[0,1,4,7].includes(c.doors.indexOf(d)-7))await p.locator('#GameCanvas').screenshot({path:path.join(out,d.id.replaceAll('.','-')+'-fechada.png')});
   assert.equal(await p.evaluate(v=>{const dir=v.horizontal?8:4;return !$gamePlayer.isMapPassable(v.x+(v.horizontal?0:-1),v.y+(v.horizontal?-1:0),dir);},v),true);
   report.push({id:d.id,side:sign===-1?'west/north':'east/south',blockedClosed:true,crossedOpen:true,occupiedCloseRefused:true,stableAnchors:true});
  }
 }
 assert.deepEqual(await core(),initial);checks.push('16 doors x2 sides: native Enter open/close, duplicate transition refused, blocked/clear collision,8 real steps each, stable9 anchors, no closing on character, lateral solid walls retained; state/resources unchanged');
 await p.evaluate(()=>{$gamePlayer.locate(160,39);$arenaStonekeepWhole.doors.forEach(d=>ArenaDungeon.openDoor(d.id));});for(const d of c.doors)await settle(d.id);
 const graph=await p.evaluate(()=>{
  const q=[[160,39]],seen=new Set(['160,39']);
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const dir of [2,4,6,8]){const nx=$gameMap.roundXWithDirection(x,dir),ny=$gameMap.roundYWithDirection(y,dir),key=nx+','+ny;if(nx<92||nx>181||ny<2||ny>181||seen.has(key)||!$gamePlayer.isMapPassable(x,y,dir)||$gameMap.eventsXyNt(nx,ny).some(e=>e.isNormalPriority()&&!e.isThrough()&&!e.event().note.startsWith('ArenaEncounter:')))continue;seen.add(key);q.push([nx,ny]);}}
  return{tiles:seen.size,bounds:[92,2,181,181],doors:$arenaStonekeepWhole.doors.slice(7).map(d=>({id:d.id,bothSides:(d.axis==='east-west'?[[-2,0],[2,0]]:[[0,-2],[0,2]]).every(([dx,dy])=>seen.has([d.center[0]+dx,d.center[1]+dy].join(',')))}))};
 });console.log(JSON.stringify(graph));assert(graph.doors.every(d=>d.bothSides));checks.push('Restricted native A2/B2 graph reaches both sides of16 doors within block; paths beyond unresolved LOCK use inherited provisional openings, not new unlock rules');
 if(process.argv.includes('--graph-only'))return;
 // Different individual states, RAM restoration and upgrade from old event array.
 await p.evaluate(()=>{$gamePlayer.locate(160,39);ArenaDungeon.closeDoor($arenaStonekeepWhole.doors[5].id);});await settle(c.doors[5].id);
 const states=await p.evaluate(()=>$arenaStonekeepWhole.doors.map(d=>$gameSelfSwitches.value([15,d.eventIds[0],'A']))),saved=await core();
 assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);
 await p.evaluate(()=>{$gameParty.gainGold(99);$arenaStonekeepWhole.doors.forEach(d=>d.eventIds.forEach(id=>$gameSelfSwitches.setValue([15,id,'A'],false)));});
 assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();await lock();
 for(const d of c.doors)await settle(d.id);
 assert.deepEqual(await core(),saved);assert.deepEqual(await p.evaluate(()=>$arenaStonekeepWhole.doors.map(d=>$gameSelfSwitches.value([15,d.eventIds[0],'A']))),states);
 await p.evaluate(()=>{$gameMap._events.length=99;});assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();await lock();
 assert.equal(await p.evaluate(()=>$gameMap.events().length),242+appended);assert.deepEqual(await p.evaluate(()=>$arenaStonekeepWhole.doors.map(d=>$gameSelfSwitches.value([15,d.eventIds[0],'A']))),states);
 for(const d of c.doors)await settle(d.id);
 checks.push('23 independent door states (open/closed) restore in RAM; old98-event snapshot appends144 components before sprite creation, preserves quests/character/receipts/items/resources');
 await p.evaluate(()=>{$gamePlayer.reserveTransfer(9,10,11,8,0);});await p.waitForFunction(()=>$gameMap.mapId()===9&&!$gamePlayer.isTransferring());await ready();
 await p.evaluate(()=>{$gamePlayer.reserveTransfer(15,160,39,2,0);});await p.waitForFunction(()=>$gameMap.mapId()===15&&!$gamePlayer.isTransferring());await ready();assert.deepEqual(await core(),saved);
 assert.deepEqual(await p.evaluate(()=>$arenaStonekeepWhole.doors.map(d=>$gameSelfSwitches.value([15,d.eventIds[0],'A']))),states);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);
 for(const point of s.points){assert.equal(await p.evaluate(name=>ArenaStonekeepWhole.jump($arenaStonekeepWhole.points.findIndex(p=>p.name===name)),point.name),true,point.name);assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),point.position);}
 checks.push('Area return preserves states/no repeated rewards;5 inspection points valid, normal save blocked, localStorage untouched, campaign still Map012');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({base:'55e42e4',browser:b.version(),url,environment:'headless Chrome, disposable profile, existing RAM session; no battles or campaign retest',checks,doors:report,graph,states,errors,missing,pending:['Manual evaluation deferred','A1 raised-water clearance unchanged/unconfirmed','A2 LOCK1 and B2 LOCK2/3 unresolved; downstream access provisional, no key invented','4 southwest B2 doors disconnected inside this block; no speculative passage','Door artwork reused provisionally for DCAS2/3/5, no generation']},null,2)+'\n');console.log('PASS',checks.length,'groups');
 }finally{if(b)await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
