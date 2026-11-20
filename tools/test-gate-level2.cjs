// Focal Gate/continuation: isolated normal synthetic saves, no personal data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const out=path.resolve('doc/evidencias/m02-gate-nivel2');
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{
const p=await browser.newPage({viewport:{width:1080,height:850}}),errors=[];p.setDefaultTimeout(40000);p.on('pageerror',e=>errors.push(e.message));
 const key=async k=>{await p.keyboard.press(k,{delay:85});await p.waitForTimeout(190);};
 const title=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const map=id=>p.waitForFunction(id=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&SceneManager._sceneStarted&&DataManager.isMapLoaded()&&!SceneManager.isSceneChanging()&&($gamePlayer.canMove()||$gameMessage.isBusy())&&!$gamePlayer.isTransferring()&&$gameMap.mapId()===id,id);
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


 await p.goto('http://127.0.0.1:8774/');await title();await p.evaluate(()=>ArenaContinuation.fixture('pre_gate',true));
 const raw=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));$gamePlayer.reserveTransfer(8,13,144,8,0);SceneManager.goto(Scene_Map);},raw);await map(8);
 const before=await state();await walk([13,145]);await settle();assert.deepEqual(await state(),before);assert.equal(await p.evaluate(()=>ArenaNarrative.state().phase),'dungeon');
 await p.evaluate(()=>{ArenaQuests.reachGate();});assert.match(await p.evaluate(()=>$gameMessage.allText()),/exige nível 2/);await p.locator('#GameCanvas').screenshot({path:out+'/gate-nivel1.png'});await settle();assert.deepEqual(await state(),before);
 await save();await reload(8);await settle();assert.deepEqual(await state(),before);await walk([13,144]);
 const audit=await p.evaluate(()=>{const queue=[[$gamePlayer.x,$gamePlayer.y]],seen=new Set();for(let n=0;n<queue.length;n++){const[x,y]=queue[n],key=x+','+y;if(seen.has(key))continue;seen.add(key);for(const[d,dx,dy]of[[2,0,1],[4,-1,0],[6,1,0],[8,0,-1]])if(!seen.has((x+dx)+','+(y+dy))&&$gamePlayer.canPass(x,y,d))queue.push([x+dx,y+dy]);}
 const c=ArenaEncounters.currentConfiguration().config,entries=c.entries.filter(v=>{const e=$gameMap.event(v.eventId);return !e._erased&&[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>seen.has((e.x+dx)+','+(e.y+dy)));});return {reachable:entries.length,rats:entries.filter(v=>v.enemyId===1),threshold:$gameActors.actor(1).expForLevel(2),availableExp:entries.reduce((n,v)=>n+$dataEnemies[v.enemyId].exp,0)};});assert(audit.rats.length>=4);assert(audit.availableExp>=50);
 const controls=require('./battle-test-controls.cjs')(p);
 for(const v of audit.rats.slice(0,4)){
 await p.evaluate(v=>{const e=$gameMap.event(v.eventId);$gameTemp.clearDestination();$gamePlayer.locate(e.x-1,e.y);$gamePlayer.center(e.x,e.y);},v);await key('ArrowRight');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
 for(let n=0;n<25;n++){const ready=await controls.ready();if(ready==='map')break;assert.equal(ready,'actor');await controls.choose('attack');}await map(8);}
 assert.equal(await p.evaluate(()=>$gameActors.actor(1).level),2);assert.equal(await p.evaluate(()=>$gameActors.actor(1).currentExp()),60);
 const prior=await p.evaluate(()=>JSON.stringify({loot:ArenaLoot.snapshot(),exp:$gameActors.actor(1).currentExp(),q:ArenaQuests.snapshot(),n:ArenaNarrative.state()}));await save();await reload(8);assert.equal(await p.evaluate(()=>JSON.stringify({loot:ArenaLoot.snapshot(),exp:$gameActors.actor(1).currentExp(),q:ArenaQuests.snapshot(),n:ArenaNarrative.state()})),prior);
 await p.evaluate(()=>{$gamePlayer.locate(13,145);});assert.equal(await p.evaluate(()=>ArenaQuests.reachGate()),true);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),40);assert.equal(await p.evaluate(()=>ArenaNarrative.state().phase),'ending');const ended=await state();assert.equal(await p.evaluate(()=>ArenaQuests.reachGate()),false);assert.deepEqual(await state(),ended);
 await save();await p.reload();await title();await p.evaluate(()=>{if(!DataManager.loadGame(19))throw Error('load');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative);
 assert.equal(await p.evaluate(()=>ArenaContinuation.beginCampaign()),true);await map(9);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),10);
 const arrived=await state();await save();await reload(9);assert.deepEqual(await state(),arrived);assert.equal(await p.evaluate(()=>ArenaQuests.reachGate()),false);
 // Existing arrivals remain valid, including the level1 case approved previously.
 await p.evaluate(()=>$gameActors.actor(1).changeLevel(1,false));await save();await reload(9);assert.equal(await p.evaluate(()=>$gameMap.mapId()),9);
 await walk([345,3]);await p.waitForTimeout(200);await key('Enter');await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive());assert.equal(await p.evaluate(()=>$gameMessage.choices()[0]),'Ir aos Arredores de Rihad');
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:browser.version(),audit,checks:['All Gate contacts share guarded reachGate; level1 attempts and save reload preserve complete persistent state and permit retreat','Current reachable enemies include at least four rats; real Atacar victories grant60EXP/level2; rewards retained on reload','Level2 Gate completes MQ01 once and preserves ending on reload; normal continuation reaches Rihad','Existing arrival at level1 can reload and retains outskirts option; no retroactive restriction'],errors,limits:'Normal synthetic saves19 in isolated Chrome; key/door pre-Gate fixture, controlled contact positioning. No personal save altered. No engine/assets generated.'},null,2)+'\n');console.log('Gate and continuation passed',JSON.stringify({reachable:audit.reachable,exp:audit.availableExp}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
