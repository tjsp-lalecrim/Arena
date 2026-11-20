// Static entrance integration, synthetic normal campaign/save in isolated Chrome.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const out=path.resolve('doc/evidencias/m02-fang-entry-v01'),read=f=>JSON.parse(fs.readFileSync(f)),old=f=>JSON.parse(cp.execFileSync('git',['show','06f12cd:'+f],{maxBuffer:20e6}));
for(const n of [9,13,15,17]){const f='data/Map'+String(n).padStart(3,'0')+'.json',a=old(f),b=read(f);assert.deepEqual(b.data,a.data);assert.equal(b.tilesetId,a.tilesetId);for(const e of a.events)if(e)assert.deepEqual(b.events[e.id],e);}
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{const p=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];p.setDefaultTimeout(40000);p.on('pageerror',e=>errors.push(e.message));
 const key=async k=>{await p.keyboard.press(k,{delay:85});await p.waitForTimeout(190);};
 const title=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const map=id=>p.waitForFunction(id=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&SceneManager._sceneStarted&&DataManager.isMapLoaded()&&!SceneManager.isSceneChanging()&&$gamePlayer.canMove()&&!$gamePlayer.isTransferring()&&$gameMap.mapId()===id,id);
 const state=()=>p.evaluate(()=>({actor:JsonEx.stringify($gameActors),items:{gold:$gameParty.gold(),items:$gameParty._items,weapons:$gameParty._weapons,armors:$gameParty._armors},quests:ArenaPersistence.snapshot(),loot:ArenaLoot.snapshot(),resources:ArenaResources.snapshot(),points:ArenaAttributes.snapshot(),vision:ArenaRiaVision.state()}));
 async function walk(goal){
  const route=await p.evaluate(goal=>{
   const w=$gameMap.width(),start=[$gamePlayer.x,$gamePlayer.y],q=[start],seen=new Map([[start.join(),null]]);
   for(let i=0;i<q.length;i++){
    const [x,y]=q[i];if(x===goal[0]&&y===goal[1])break;
    for(const d of [2,4,6,8]){
     const nx=$gameMap.xWithDirection(x,d),ny=$gameMap.yWithDirection(y,d),k=nx+','+ny;
     if(!seen.has(k)&&$gameMap.isValid(nx,ny)&&$gamePlayer.canPass(x,y,d)){
      seen.set(k,{prev:x+','+y,d});q.push([nx,ny]);
     }
    }
   }
   if(!seen.has(goal.join()))throw Error('No route '+start+' -> '+goal+' map '+$gameMap.mapId());
   const moves=[];for(let at=goal.join();seen.get(at);at=seen.get(at).prev)moves.push(seen.get(at).d);
   return moves.reverse();
  },goal);
  await p.evaluate(route=>{
   for(const d of route){
    $gamePlayer.moveStraight(d);if(!$gamePlayer.isMovementSucceeded())throw Error('blocked path');
    while($gamePlayer.isMoving())$gamePlayer.updateMove();
   }
   $gamePlayer.center($gamePlayer.x,$gamePlayer.y);
  },route);
  return route.length;
 }
 async function settle(){
  for(let i=0;i<100;i++){
   const s=await p.evaluate(()=>{
    const w=SceneManager._scene._messageWindow;
    if(w?._textState)w._showFast=true;
    return {busy:$gameMessage.isBusy()||$gameMap.isEventRunning(),pause:w?.pause&&!w._waitCount};
   });
   if(!s.busy)return;if(s.pause)await key('Enter');else await p.waitForTimeout(70);
  }throw Error('message busy');
 }
 async function talk(d){await map(await p.evaluate(()=>$gameMap.mapId()));await p.evaluate(d=>$gamePlayer.setDirection(d),d);await key('Enter');}
 async function enter(){
  await walk(plan.exterior.approach);await talk(4);await map(18);
 }
 async function bed(){
  const b=await p.evaluate(()=>$arenaRihad.inn.bed);
  await walk([b.x,b.y+1]);await p.evaluate(()=>$gamePlayer.setDirection(8));
 }
 async function leave(){
  const exit=await p.evaluate(()=>{const e=$gameMap.event(1);return[e.x,e.y-1];});
  await walk(exit);await key('ArrowDown');await map(9);
 }
 async function save(slot=19){
  assert(await p.evaluate(slot=>{$gameSystem.onBeforeSave();return DataManager.saveGame(slot);},slot));
 }
 async function reload(id,slot=19){
  await p.reload();await title();
  await p.evaluate(slot=>{if(!DataManager.loadGame(slot))throw Error('load failed');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);},slot);
  await map(id);
 }


 await p.goto('http://127.0.0.1:8774/');await title();await p.evaluate(()=>ArenaRihad.preview());await map(9);
 const raw=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},raw);await map(9);
 await p.evaluate(()=>{const c=$arenaCourt.delivery;ArenaPersistence.setQuest('MQ02',50,{parchmentRecovered:true},false);if(ArenaPersistence.claimSource(c.sourceId)!=='granted')throw Error('source');if(ArenaPersistence.consumeImportant(c.sourceId,c.receiptId,'deliver')!=='consumed')throw Error('receipt');ArenaPersistence.setQuest('MQ02',60,{parchmentDelivered:true,fangLairKnown:true},false);$gamePlayer.locate(345,3);$gamePlayer.center(345,3);});
 const protectedState=()=>p.evaluate(()=>JSON.stringify({actors:$gameActors,party:$gameParty,loot:ArenaLoot.snapshot(),q1:ArenaQuests.snapshot('MQ01'),q2:ArenaQuests.snapshot('MQ02'),n:ArenaNarrative.state(),ria:ArenaRiaVision.state()}));
 const before=await protectedState();await p.waitForTimeout(200);await key('Enter');await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive()&&!SceneManager._scene._messageWindow._choiceWindow._arenaCourtAwaitNeutral);assert.equal(await p.evaluate(()=>$gameMessage.choices()[2]),'Viajar para Fang Lair');await p.evaluate(()=>SceneManager._scene._messageWindow._choiceWindow.select(2));await key('Enter');await map(13);
 const shape=await p.evaluate(()=>{const e=$gameMap.event(600),exit=$gameMap.event(1);return {art:e.characterName(),origin:[e.x,e.y],through:e.isThrough(),priority:e._priorityType,exit:[exit.x,exit.y],exitScript:exit.list()[0].parameters[0]};});assert.equal(shape.art,'!$Arena_Fang_ExitFace_V01');assert.deepEqual(shape.origin,[288,7]);assert(shape.through);assert.deepEqual(shape.exit,[288,9]);assert.equal(shape.exitScript,'ArenaFangCells.leave(this);');
 await p.waitForFunction(()=>ImageManager.isReady()&&!SceneManager._scene._fadeDuration);await p.waitForTimeout(300);const png=await p.evaluate(()=>{SceneManager.renderScene();return Graphics._canvas.toDataURL();});fs.writeFileSync(out+'/entrada-integrada.png',Buffer.from(png.split(',')[1],'base64'));
 assert(await p.evaluate(()=>$gamePlayer.canPass(288,9,8)&&$gamePlayer.canPass(288,8,2)&&!$gamePlayer.canPass(287,9,4)&&!$gamePlayer.canPass(289,9,6)));
 // Legacy snapshot lacks only the new decoration; original exit/states untouched.
 await p.evaluate(()=>$gameMap._events[600]=null);await save();await reload(13);assert.equal(await p.evaluate(()=>$gameMap.event(600).characterName()),shape.art);assert.equal(await p.evaluate(()=>$gameMap.events().filter(e=>e.event().note==='visual.fang.1.entry-face').length),1);
 const saved=await protectedState();await save();await reload(13);assert.equal(await protectedState(),saved);assert.equal(await p.evaluate(()=>$gameMap.events().filter(e=>e.event().note==='visual.fang.1.entry-face').length),1);
 await key('Enter');await map(9);assert.equal(await protectedState(),before);
 const files=['data/Map013.json','data/Map017.json','data/ArenaM02DungeonObjects.json'],bytes=files.map(f=>fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'));
 cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{stdio:'pipe'});files.forEach((f,i)=>assert.equal(fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'),bytes[i]));assert.deepEqual(errors,[]);
 fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:browser.version(),checks:['Tile/region/tileset data and every preexisting event preserved on Maps9/13/15/17','Native gate travel from Rihad reaches unchanged entry, static face at confirmed inner wall','Exit, approach and side collisions unchanged; native action returns to Rihad without actor/loot/quest/narrative changes','Legacy normal save19 appends visual decoration once; repeated reload has no duplicate','Parent generator reconstructs maps and runtime bindings identically'],shape,errors,limits:'Isolated synthetic normal save19, quest delivery preconditions prepared with existing source/receipt APIs. No full quest replay, original DOS observation, personal save, mobile or Pages test.'},null,2)+'\n');console.log('Fang inner exit checks passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
