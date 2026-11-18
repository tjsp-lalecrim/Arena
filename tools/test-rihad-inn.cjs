const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-rihad-pousada');
const plan=require('../doc/mapas/RIHAD_POUSADA_M02.json');
const files=['ArenaRihad','ArenaRecovery','ArenaCampaign','Map009','Map018','MapInfos','Tilesets'];
const canonical=f=>fs.readFileSync(path.join(root,'data/'+f+'.json'),'utf8').replace(/\r\n/g,'\n');
const before=files.map(canonical);
execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:root});
files.forEach((f,i)=>assert.equal(canonical(f),before[i],f+' rebuild'));
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const p=await browser.newPage({viewport:{width:1080,height:850},hasTouch:true}),errors=[],missing=[],checks=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
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
 await p.goto('http://127.0.0.1:8774/');await title();
 await p.evaluate(()=>ArenaRihad.preview());await map(9);
 const fixture=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();
 await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},fixture);await map(9);
 assert(await p.evaluate(()=>ArenaNarrative.isCampaign()&&!ArenaContinuation.labActive()));
 const untouched=await state();
 await walk([348,13]);await talk(8);
 const guidance=await p.evaluate(()=>$gameMessage.allText());
 assert.match(guidance.replace(/\s+/g,' '),/Pousada do portão/);
 await p.evaluate(()=>{const w=SceneManager._scene._messageWindow;w._showFast=true;w.updateMessage();});
 await p.waitForTimeout(200);
 await p.locator('#GameCanvas').screenshot({path:path.join(out,'informante.png')});
 await settle();
 await enter();
 assert.deepEqual(await state(),untouched);
 await p.locator('#GameCanvas').screenshot({path:path.join(out,'interior.png')});
 await bed();await p.waitForTimeout(300);
 await p.locator('#GameCanvas').screenshot({path:path.join(out,'cama.png')});
 checks.push('Normal campaign walks from city gate/informant to confirmed facade, enters original TAVERN4 plan and reaches bed; transfers preserve actor, resources and MQ01/MQ02.');
 await p.evaluate(()=>{$gameActors.actor(1).setHp(12);$gameActors.actor(1).setMp(3);ArenaPersistence.setResource('vigor',7,ArenaResources.snapshot().vigor.maximum);});
 const stable=await p.evaluate(()=>({gold:$gameParty.gold(),loot:ArenaLoot.snapshot(),quest:ArenaQuests.snapshot('MQ01'),points:ArenaAttributes.snapshot()}));
 await save();await reload(18);
 assert.deepEqual(await p.evaluate(()=>{const r=ArenaResources.snapshot();return [r.hp.current,r.mp.current,r.vigor.current];}),[12,3,7]);
 await key('Enter');await map(18);
 assert(await p.evaluate(()=>{const r=ArenaResources.snapshot();return ['hp','mp','vigor'].every(k=>r[k].current===r[k].maximum);}));
 assert.equal(await p.evaluate(()=>ArenaRiaVision.state().phase),'idle');
 assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),10);
 const calls=await p.evaluate(()=>{
  let calls=0;const old=ArenaResources.rest;ArenaResources.rest=function(){calls++;return old.apply(this,arguments);};
  const i=new Game_Interpreter();i._mapId=18;i._eventId=2;
  $gameParty._inBattle=true;const result=ArenaRecovery.usePoint($arenaRihad.restPointId,i);$gameParty._inBattle=false;
  ArenaResources.rest=old;return {calls,ok:result.ok};
 });
 assert.deepEqual(calls,{calls:0,ok:false});
 checks.push('Battle context cannot activate the inn bed.');
 checks.push('Level 1 bed restores all resources at zero gold; normal save/load before rest preserves spent bars and leaves vision eligible.');
 await leave();
 assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),plan.exterior.approach);
 await p.evaluate(()=>$gameActors.actor(1).changeLevel(2,false));await enter();await bed();
 await p.keyboard.down('Enter');
 await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&ArenaRiaVision.active());
 await p.waitForTimeout(450);
 assert.equal(await p.evaluate(()=>ArenaRiaVision.state().section),0);
 await p.keyboard.up('Enter');
 assert(await p.evaluate(()=>{const r=ArenaResources.snapshot();return ['hp','mp','vigor'].every(k=>r[k].current===r[k].maximum);}));
 checks.push('Return after reaching level 2 opens vision once; full resources remain full and the held rest key does not advance the first block.');
 // Save the live reading cursor through the existing native serialization contract.
 await p.evaluate(()=>SceneManager._scene._focus=SceneManager._scene._buttons.findIndex(b=>b.id==='next'));
 await p.waitForTimeout(250);await key('Enter');
 const cursor=await p.evaluate(()=>ArenaRiaVision.state());await save();
 await p.reload();await title();
 await p.evaluate(()=>{if(!DataManager.loadGame(19))throw Error('load reading');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});
 await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&ArenaRiaVision.active());
 assert.deepEqual(await p.evaluate(()=>ArenaRiaVision.state()),cursor);
 // Existing paging is already approved; complete through its controls.
 for(let i=0;i<65&&await p.evaluate(()=>ArenaRiaVision.active());i++){
  await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);
  await p.evaluate(()=>{const s=SceneManager._scene;s._focus=s._buttons.findIndex(b=>b.id==='next');s.draw();});await key('Enter');
 }
 await map(18);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),20);
 const complete=await p.evaluate(()=>ArenaRiaVision.state());
 await save();await reload(18);await key('Enter');await map(18);
 assert.deepEqual(await p.evaluate(()=>ArenaRiaVision.state()),complete);
 assert.deepEqual(await p.evaluate(()=>({gold:$gameParty.gold(),loot:ArenaLoot.snapshot(),quest:ArenaQuests.snapshot('MQ01')})),{gold:stable.gold,loot:stable.loot,quest:stable.quest});
 checks.push('Native save/load during and after reading preserves the cursor/completion; repeat bed interaction does not replay vision, grant loot or mutate MQ01.');
 await leave();await walk([348,13]);await talk(8);await settle();
 assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),30);
 // Build one previous-version save on its original serialized map, using synthetic state only.
 const old=JSON.parse(execFileSync('git',['show','71fb510:data/Map009.json'],{cwd:root,encoding:'utf8',maxBuffer:20e6}));
 await p.evaluate(old=>{
  const current=$dataMap;try{$dataMap=old;$gameMap.setup(9);$gamePlayer.locate(354,15);}finally{$dataMap=current;}
 },old);
 const legacy=await state();await save();await reload(9);
 assert.deepEqual(await state(),legacy);
 assert.equal(await p.evaluate(()=>!!$gameMap.event(2)),false);
 assert.equal(await p.evaluate(()=>!!$gameMap.event(7)),true);
 await enter();await bed();await key('Enter');await map(18);
 assert.deepEqual(await p.evaluate(()=>ArenaRiaVision.state()),complete);
 checks.push('Previous-version exterior-platform save retains position, actor, progression, receipts and completed vision; retired event removed, inn entrance installed without healing on load.');
 await leave();
 await walk(await p.evaluate(()=>{const e=$gameMap.event(5);return[e.x,e.y-1];}));
 await key('ArrowDown');await map(11);
 checks.push('After bed and informant stage 30, normal city circulation still reaches the functional court entrance.');
 await p.evaluate(()=>SceneManager.goto(Scene_Title));await title();
 await p.evaluate(()=>ArenaRihad.preview());await map(9);await enter();await bed();
 assert.equal(await p.evaluate(()=>DataManager.saveGame(19)),false);
 const technical=await state();
 await p.evaluate(()=>ArenaContinuation.memorySave());
 await p.evaluate(()=>$gameActors.actor(1).setHp(3));
 await p.evaluate(()=>{if(!ArenaContinuation.memoryLoad())throw Error('RAM load failed');SceneManager.goto(Scene_Map);});await map(18);
 assert.deepEqual(await state(),technical);
 checks.push('Existing RAM laboratory reaches the same inn; personal slots remain blocked and RAM restoration works inside.');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:browser.version(),base:'71fb510',checks,errors,missing,source:plan.source,ownerEvaluation:'pending integrated MQ02',storage:'isolated Chrome profile; synthetic slot19 only'},null,2)+'\n');
 console.log(checks.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
