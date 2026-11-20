// Focal normal-campaign route, synthetic actor/isolated Chrome. No personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-rihad-arredores-acesso'),plan=require('../doc/mapas/RIHAD_POUSADA_M02.json');
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{
const p=await browser.newPage({viewport:{width:1080,height:850}}),errors=[],checks=[],missing=[];
p.setDefaultTimeout(30000);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
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
 const fixture=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},fixture);await map(9);
 assert.equal(await p.evaluate(()=>$gameActors.actor(1).level),1);const mq1=await p.evaluate(()=>JSON.stringify(ArenaQuests.snapshot('MQ01')));
 await walk([348,13]);await talk(8);assert.match(await p.evaluate(()=>JSON.stringify($gameMap._interpreter._childInterpreter._list)),/Ir aos Arredores/);await settle();
 await enter();await bed();await talk(8);assert.match(await p.evaluate(()=>$gameMessage.allText()),/ganhar experi/);await settle();assert.equal(await p.evaluate(()=>ArenaRiaVision.state().phase),'idle');await leave();
 async function gate(){await walk([345,3]);await key('Enter');await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive()&&!SceneManager._scene._messageWindow._choiceWindow._arenaCourtAwaitNeutral);}
 await gate();assert.deepEqual(await p.evaluate(()=>$gameMessage.choices()),['Ir aos Arredores de Rihad','Ficar em Rihad']);await key('Escape');await settle();assert.equal(await p.evaluate(()=>$gameMap.mapId()),9);
 await gate();await p.locator('#GameCanvas').screenshot({path:path.join(out,'portao.png')});await p.evaluate(()=>SceneManager._scene._messageWindow._choiceWindow.select(0));await key('Enter');await map(10);
 const cfg=await p.evaluate(()=>ArenaEncounters.currentConfiguration().config),controls=require('./battle-test-controls.cjs')(p),battles=[];
 assert.equal(cfg.entries.length,4);assert.equal(await p.evaluate(()=>$gameActors.actor(1).expForLevel(2)),50);
 for(const v of cfg.entries){
 await p.evaluate(v=>{const e=$gameMap.event(v.eventId);e.locate(...v.origin);e._arenaPatrolTick=0;$gamePlayer.locate(v.origin[0]-1,v.origin[1]);$gamePlayer.center(...v.origin);$gameTemp.clearDestination();},v);
 await key('ArrowRight');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
 for(let n=0;n<25;n++){const ready=await controls.ready();if(ready==='map')break;assert.equal(ready,'actor');await controls.choose('attack');}
 await map(10);battles.push(await p.evaluate(()=>({level:$gameActors.actor(1).level,exp:$gameActors.actor(1).currentExp()})));
 const once=await state();await p.evaluate(()=>{BattleManager.processVictory();BattleManager.gainRewards();});assert.deepEqual(await state(),once);
 }
 assert.equal(battles.at(-1).level,2);assert.equal(battles.at(-1).exp,60);assert.equal(await p.evaluate(()=>ArenaAttributes.snapshot().available),3);
 await walk([3,9]);await key('ArrowLeft');await map(9);await enter();await bed();await key('Enter');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&ArenaRiaVision.active());
 await p.locator('#GameCanvas').screenshot({path:path.join(out,'ria.png')});
 for(let n=0;n<90&&await p.evaluate(()=>ArenaRiaVision.active());n++){
 await p.waitForFunction(()=>!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);
 await p.evaluate(()=>{const s=SceneManager._scene;s._focus=s._buttons.findIndex(b=>b.id==='next');s.draw();});await key('Enter');}
 await map(18);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),20);
 const vision=await p.evaluate(()=>ArenaRiaVision.state());await save();await reload(18);await key('Enter');await map(18);assert.deepEqual(await p.evaluate(()=>ArenaRiaVision.state()),vision);
 assert(await p.evaluate(()=>{const r=ArenaResources.snapshot();return ['hp','mp','vigor'].every(k=>r[k].current===r[k].maximum);}));
 checks.push('Level1 normal campaign: informant/bed guidance, gate cancel and outskirts option; four real Atacar victories yield EXP60/level2/3 points; return to inn, full recovery, vision once and save/load.');
 // Exhausted inconsistent development save: no free reward or receipt deletion.
 await leave();await gate();await p.evaluate(()=>SceneManager._scene._messageWindow._choiceWindow.select(0));await key('Enter');await map(10);
 assert(await p.evaluate(()=>ArenaEncounters.currentConfiguration().config.entries.every(v=>$gameMap.event(v.eventId)._erased)));
 await p.evaluate(()=>$gameActors.actor(1).changeLevel(1,false));const oldLoot=await p.evaluate(()=>JSON.stringify(ArenaLoot.snapshot())),exp=await p.evaluate(()=>$gameActors.actor(1).currentExp());
 await walk([3,9]);await key('ArrowLeft');await map(9);assert.equal(await p.evaluate(()=>JSON.stringify(ArenaLoot.snapshot())),oldLoot);assert.equal(await p.evaluate(()=>$gameActors.actor(1).currentExp()),exp);
 await gate();await p.evaluate(()=>SceneManager._scene._messageWindow._choiceWindow.select(0));await key('Enter');await map(10);
 assert(await p.evaluate(()=>{const c=ArenaEncounters.currentConfiguration().config,s=ArenaPersistence.snapshot();return c.entries.every(v=>!s.enemies[v.id].defeated&&!$gameMap.event(v.eventId)._erased&&s.enemies[v.id].generation===1)&&!s.areas[c.areaId].completed;}));
 await save();await reload(10);assert.equal(await p.evaluate(()=>JSON.stringify(ArenaLoot.snapshot())),oldLoot);
 assert.equal(await p.evaluate(()=>JSON.stringify(ArenaQuests.snapshot('MQ01'))),mq1);
 checks.push('Exhausted level1 development save reactivates only ordinary outskirts rats on exit via next generation; no EXP, old loot receipts/pending preserved, MQ01 unchanged; persistent on save/load.');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:browser.version(),checks,battles,errors,missing,limits:'Synthetic isolated normal save19; controlled positioning for contacts, real unmodified combat and rewards. No personal save inspected; owner level1 remains unconfirmed.'},null,2)+'\n');console.log('Outskirts campaign route passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
