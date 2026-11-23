// Focal normal-campaign route, synthetic actor/isolated Chrome. No personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/rihad-outskirts-battle-v01'),plan=require('../doc/mapas/RIHAD_POUSADA_M02.json');
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
 const fixture=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},fixture);await map(9);
 await walk([345,3]);await key('Enter');await p.waitForFunction(()=>SceneManager._scene._messageWindow._choiceWindow.isOpenAndActive()&&!SceneManager._scene._messageWindow._choiceWindow._arenaCourtAwaitNeutral);await p.evaluate(()=>SceneManager._scene._messageWindow._choiceWindow.select(0));await key('Enter');await map(10);await save();await reload(10);
 assert(await p.evaluate(()=>ArenaBattleUI.backgroundForArea('stonekeep').file===$arenaBattleUI.background.file&&ArenaBattleUI.backgroundForArea('unknown').file===$arenaBattleUI.background.file&&ArenaBattleUI.backgroundForArea(null).file===$arenaBattleUI.background.file));
 await p.evaluate(()=>{$gameParty.gainItem($dataWeapons[1],1);$gameActors.actor(1).changeEquip(0,$dataWeapons[1]);});
 const cfg=await p.evaluate(()=>ArenaEncounters.currentConfiguration().config),v=cfg.entries[0],controls=require('./battle-test-controls.cjs')(p);
 await p.evaluate(v=>{const e=$gameMap.event(v.eventId);e.locate(...v.origin);e._arenaPatrolTick=0;$gamePlayer.locate(v.origin[0]-1,v.origin[1]);$gamePlayer.center(...v.origin);$gameTemp.clearDestination();},v);await key('ArrowRight');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());assert.equal(await controls.ready(),'actor');
 assert.equal(await p.evaluate(()=>BattleManager._arenaBattleAreaId),'rihad.outskirts');assert.match(await p.evaluate(()=>SceneManager._scene._spriteset._back1Sprite.bitmap._url),/Arena_Rihad_Outskirts_Battle_V01/);
 const layouts=[];for(const viewport of [{width:1100,height:850},{width:1280,height:720},{width:640,height:480}]){await p.setViewportSize(viewport);await p.waitForTimeout(350);assert(await p.evaluate(()=>{const s=SceneManager._scene._spriteset._back1Sprite;return s.scale.x===s.scale.y&&s.bitmap.width*s.scale.x>=Graphics.boxWidth&&s.bitmap.height*s.scale.y>=Graphics.boxHeight-$arenaBattleUI.commandHeight-$arenaBattleUI.hotbarHeight;}));const rect=await p.locator('#GameCanvas').boundingBox();assert(rect.width<=viewport.width+1&&rect.height<=viewport.height+1);layouts.push({viewport,canvas:rect});await p.screenshot({path:path.join(out,'batalha-'+viewport.width+'.png')});}
 await p.setViewportSize({width:1100,height:850});await p.evaluate(()=>{window.motionSeen={};const update=Scene_Battle.prototype.update;Scene_Battle.prototype.update=function(){update.apply(this,arguments);this._spriteset.battlerSprites().forEach(s=>{const t=s._arenaTimeline;if(t){const k=(s._battler.isActor()?'actor/':'enemy/')+t.key;window.motionSeen[k]=Math.max(window.motionSeen[k]||0,t.tick);}});};});
 for(let n=0;n<25;n++){const ready=await controls.ready();if(ready==='map')break;assert.equal(ready,'actor');await controls.choose('attack');}await map(10);assert(await p.evaluate(id=>ArenaPersistence.snapshot().enemies[id].defeated,v.id));const motions=await p.evaluate(()=>window.motionSeen);assert(Object.keys(motions).some(k=>k.startsWith('actor/')));assert(Object.keys(motions).some(k=>k.startsWith('enemy/')));
 await save();await reload(10);const next=cfg.entries[1];await p.evaluate(v=>{const e=$gameMap.event(v.eventId);e.locate(...v.origin);$gamePlayer.locate(v.origin[0]-1,v.origin[1]);$gamePlayer.center(...v.origin);},next);await key('ArrowRight');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());assert.equal(await controls.ready(),'actor');assert.equal(await p.evaluate(()=>BattleManager._arenaBattleAreaId),'rihad.outskirts');assert.match(await p.evaluate(()=>SceneManager._scene._spriteset._back1Sprite.bitmap._url),/Arena_Rihad_Outskirts/);
 checks.push('Normal campaign gate→outskirts, isolated save/load before encounter; real contact selects origin area background.','Unknown/Stonekeep/null areas retain global default. Uniform cover at three desktop window proportions; UI and actor/rat legibility captured.','Native attacks/motion timelines complete, victory returns to Map010 with defeated state; subsequent save/load/contact reselects area backdrop. No personal saves.');assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:await browser.version(),checks,layouts,motions,errors,missing,ownerEvaluation:'Visual assessment pending integrated campaign test; next grouped Pages publication, not published in this task.'},null,2)+'\n');console.log('Outskirts backdrop focal validation passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
