const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict'),read=f=>JSON.parse(fs.readFileSync(f)),old=f=>JSON.parse(cp.execFileSync('git',['show','4c7f2cd:'+f],{maxBuffer:20e6}));const sets=read('data/Tilesets.json'),prior=old('data/Tilesets.json');
function pass(m,flags,i,b){let n=m.width*m.height;for(const z of [3,2,1,0]){const f=flags[m.data[z*n+i]];if(f&16)continue;return !(f&b);}return false;}
for(const id of [9,15,13,17]){const f='data/Map'+String(id).padStart(3,'0')+'.json',a=old(f),b=read(f),n=a.width*a.height;assert.equal(a.width,b.width);assert.equal(a.height,b.height);assert.deepEqual(a.data.slice(5*n),b.data.slice(5*n));for(let i=0;i<n;i++)for(const bit of [1,2,4,8])assert.equal(pass(a,prior[a.tilesetId].flags,i,bit),pass(b,sets[b.tilesetId].flags,i,bit),id+':'+i);for(const e of a.events)if(e)assert.deepEqual(e,b.events[e.id]);console.log('Geometry/collision/events preserved Map'+id);}

const path=require('node:path');const {chromium}=require('playwright'),out=path.resolve('doc/evidencias/m02-cenario-v01');
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
 const raw=await p.evaluate(()=>{for(const v of $arenaScenery.urban)$gameMap._events[v.eventId]=null;return JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer});});
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},raw);await map(9);
 assert.equal(await p.evaluate(()=>$arenaScenery.urban.filter(v=>!!$gameMap.event(v.eventId)).length),117);
 const actor=await p.evaluate(()=>JsonEx.stringify({actors:$gameActors,loot:ArenaLoot.snapshot(),q:ArenaQuests.snapshot('MQ01')}));
 async function shot(name){await p.waitForFunction(()=>ImageManager.isReady());await p.waitForTimeout(300);await p.waitForFunction(()=>!SceneManager._scene._fadeDuration);const png=await p.evaluate(()=>{SceneManager.renderScene();return Graphics._canvas.toDataURL('image/png');});fs.writeFileSync(out+'/'+name+'.png',Buffer.from(png.split(',')[1],'base64'));}
 for(const [resource,name]of [['NWELL2.IMG','rihad-poco'],['PALM1.IMG','rihad-palmeira'],['NFOUNT1D.DFA','rihad-fonte']]){
 await p.evaluate(resource=>{const v=$arenaScenery.urban.find(v=>v.resource===resource);$gamePlayer.locate(v.position[0],v.position[1]+1);$gamePlayer.center(...v.position);},resource);await shot(name);}
 const city=await state();await save();await reload(9);assert.deepEqual(await state(),city);assert.equal(await p.evaluate(()=>$gameMap.events().filter(e=>e.event().note.startsWith('ArenaScenery:')).length),117);
 await p.evaluate(()=>{const q=ArenaQuests.snapshot('MQ02');ArenaPersistence.setQuest('MQ02',40,{...q.objectives,parchmentRequest:true},false);const c=ArenaStonekeep.configuration();$gamePlayer.reserveTransfer(c.mapId,c.source[0],c.source[1]+1,8,0);});await map(15);
 await p.evaluate(()=>{for(const v of ArenaEncounters.currentConfiguration().config.entries)$gameMap.event(v.eventId)._arenaPatrolTick=-100000;});
 assert.equal(await p.evaluate(()=>$gameMap.event(2).isTransparent()),false);await shot('stonekeep-pergaminho');
 await p.evaluate(()=>{const e=$gameMap.event(2);$gamePlayer.locate(e.x,e.y);});await key('Enter');await settle();assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[7])),1);assert.equal(await p.evaluate(()=>$gameMap.event(2).isTransparent()),true);
 await save();await reload(15);assert.equal(await p.evaluate(()=>$gameMap.event(2).isTransparent()),true);
 const app=require('../doc/arte/m02-scenery-v01/application.json');
 for(const family of ['casf','cask']){const v=app.appliedPanels.find(v=>v.family===family);assert(v);await p.evaluate(v=>{$gamePlayer.locate(v.position[0],v.position[1]+3);$gamePlayer.center(...v.position);},v);await shot('stonekeep-painel-'+family);}
 await p.evaluate(()=>{$gamePlayer.reserveTransfer(11,81,91,8,0);});await map(11);await p.evaluate(()=>{const i=new Game_Interpreter();i.setup([],2);i._branch[0]=0;if(!ArenaCourtDelivery.deliver(i))throw Error('delivery');});await settle();assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),60);
 await p.evaluate(()=>{const c=$arenaFangCells;ArenaPersistence.setQuest('MQ02',70,{...ArenaQuests.snapshot('MQ02').objectives,fangCellsSolved:true},false);$gamePlayer.reserveTransfer(c.mapId,c.key[0],c.key[1],2,0);});await map(13);
 assert.equal(await p.evaluate(()=>$gameMap.event(3).isTransparent()),false);await shot('fang-chave');await key('Enter');await settle();assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[8])),1);assert.equal(await p.evaluate(()=>$gameMap.event(3).isTransparent()),true);
 await p.evaluate(()=>{const c=$arenaFangCells;if(ArenaPersistence.consumeImportant(c.sourceId,c.receiptId,'consume')!=='consumed')throw Error('consume');ArenaPersistence.setQuest('MQ02',90,{...ArenaQuests.snapshot('MQ02').objectives,fangLowerExplored:true},false);const f=c.lower.staffPiece;$gamePlayer.reserveTransfer(c.lower.mapId,f.position[0],f.position[1]+1,8,0);});await map(17);
 await p.evaluate(()=>{for(const v of ArenaEncounters.currentConfiguration().config.entries)$gameMap.event(v.eventId)._arenaPatrolTick=-100000;});
 assert.equal(await p.evaluate(()=>$gameMap.event(5).isTransparent()),false);await shot('fang-fragmento');await p.evaluate(()=>{const e=$gameMap.event(5);$gamePlayer.locate(e.x,e.y);});await key('Enter');await settle();assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),100);assert.equal(await p.evaluate(()=>$gameMap.event(5).isTransparent()),true);
 const completed=await state();await save();await reload(17);assert.deepEqual(await state(),completed);assert.equal(await p.evaluate(()=>$gameMap.event(5).isTransparent()),true);await key('Enter');await settle();assert.deepEqual(await state(),completed);
 assert.equal(await p.evaluate(()=>JsonEx.stringify({actors:$gameActors,loot:ArenaLoot.snapshot(),q:ArenaQuests.snapshot('MQ01')})),actor);
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:browser.version(),checks:['All collision bits, regions and pre-existing map events preserved on Maps9/15/13/17','Legacy city snapshot appends117 visual-only props once; save/load stable','Existing parchment/queen delivery/gold key/staff collection contracts work with source-driven sprites; collected/retired sprites remain absent on reload','No duplicate fragment/quest, no actor/loot/MQ01 changes','Native screenshots show reused fountain/carpet and new ornaments/props/quest objects'],application:{panels:app.panels,parts:app.parts,rugTiles:app.rugTiles,urban:117},errors,limits:'Isolated Chrome synthetic normal saves19, controlled positions/stages and frozen patrol timing for screenshots. No new visual approval inferred; no personal saves, full campaign, Pages or mobile tests.'},null,2)+'\n');console.log('Scenery focal checks passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
