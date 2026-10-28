const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-18';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({channel:'chrome',headless:true});
 try{
  const c=await b.newContext({viewport:{width:1100,height:800},hasTouch:true}),p=await c.newPage(),errors=[],checks=[],route=[];
  p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  const scene=t=>p.waitForFunction(t=>window[t]&&SceneManager._scene instanceof window[t]&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!SceneManager._scene.isBusy(),t).catch(async e=>{console.error('expected',t,await p.evaluate(()=>({scene:SceneManager._scene.constructor.name,error:Graphics._errorPrinter.innerHTML,state:window.ArenaNarrative&&$gameSystem&&ArenaNarrative.state(),position:window.$gamePlayer&&[$gamePlayer.x,$gamePlayer.y]})));throw e;});
  const key=async k=>{if(await p.evaluate(()=>SceneManager._scene instanceof Scene_ArenaNarrative))await p.waitForFunction(()=>!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);await p.keyboard.press(k,{delay:70});await p.waitForTimeout(190);};
  const shot=async name=>p.locator('#GameCanvas').screenshot({path:out+'/'+name+'.png'});
  const story=()=>p.evaluate(()=>ArenaNarrative.state());
  await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8767/');await scene('Scene_Title');await p.waitForFunction(()=>SceneManager._scene._commandWindow.isOpenAndActive());await p.evaluate(()=>SceneManager._scene._commandWindow.selectSymbol('newGame'));
  await key('Enter');await scene('Scene_ArenaCharacterCreation');await p.getByRole('textbox',{name:'Nome do personagem'}).fill('Elara');
  await key('Enter');await key('ArrowDown');await key('Enter');await key('ArrowRight');await key('Enter');await key('Enter');await p.waitForFunction(()=>!!SceneManager._scene._confirm);await key('Enter');await scene('Scene_ArenaNarrative');
  assert.equal((await story()).phase,'intro');assert.equal(await p.evaluate(()=>$gameMap.mapId()),0);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),0);assert.equal(await p.locator('input').count(),0);await shot('introducao');
  await p.keyboard.down('Enter');await p.waitForTimeout(700);const held=await story();await p.waitForTimeout(500);assert.deepEqual(await story(),held);await p.keyboard.up('Enter');await p.waitForTimeout(70);checks.push('native new game/name/race/gender/confirmation enters intro; no laboratory or MQ01 before Ria; held OK advances at most one page');
  // Save through the actual native save scene, then load through the title/Scene_Load.
  let saveHeldTested=false;async function saveUI(){const before=await story();await p.evaluate(()=>SceneManager._scene._focus=1);if(!saveHeldTested){await p.waitForFunction(()=>!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);await p.keyboard.down('Enter');await scene('Scene_Save');await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>DataManager.isAnySavefileExists()),false);await p.keyboard.up('Enter');await p.waitForTimeout(90);saveHeldTested=true;}else{await key('Enter');await scene('Scene_Save');}await p.evaluate(()=>{SceneManager._scene._listWindow.select(16);SceneManager._scene._listWindow.processOk();});await scene('Scene_ArenaNarrative');assert.deepEqual(await story(),before);}
  async function loadUI(){await p.evaluate(()=>SceneManager.goto(Scene_Title));await scene('Scene_Title');await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('continue');w.processOk();});await scene('Scene_Load');await p.evaluate(()=>{SceneManager._scene._listWindow.select(16);SceneManager._scene._listWindow.processOk();});await scene('Scene_ArenaNarrative');}
  await saveUI();const savedIntro=await story();await loadUI();assert.deepEqual(await story(),savedIntro);checks.push('native Save/Load during intro resumes exact word/section/history, no repetition or map0 request');
  for(let i=0;i<60&&(await story()).phase==='intro';i++)await key('Enter');assert.equal((await story()).phase,'ria');await shot('ria');
  await key('Enter');await saveUI();const savedRia=await story();await loadUI();assert.deepEqual(await story(),savedRia);checks.push('Ria illustration/name and word cursor persist through native save/load');
  for(let i=0;i<80&&(await story()).phase==='ria';i++)await key('Enter');await scene('Scene_Map');await p.waitForFunction(()=>$gamePlayer.canMove()&&!$gamePlayer.isTransferring());
  assert.equal(await p.evaluate(()=>$gameMap.mapId()),8);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),10);assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),[148,82]);assert.equal((await story()).phase,'dungeon');await shot('chegada-dungeon');
  assert.equal(await p.evaluate(()=>{const w=new Window_MenuCommand(0,0);return w._list.some(v=>v.symbol==='arenaDungeonExit');}),false);checks.push('Ria completion starts MQ01 once and transfers to original cell; technical laboratory exit hidden from campaign');
  await p.evaluate(()=>{
   $gamePlayer.setMoveSpeed(6);window.nativeWalk={};
   window.walkTo=function(tx,ty){
    const w=$gameMap.width(),h=$gameMap.height(),dirs=[2,4,6,8];let path=[];nativeWalk={status:'walking',steps:0,target:[tx,ty]};
    function plan(){const n=w*h,seen=new Int32Array(n).fill(-1),queue=[$gamePlayer.y*w+$gamePlayer.x],root=queue[0],goal=ty*w+tx;seen[root]=root;let k=0;
     while(k<queue.length&&seen[goal]<0){const a=queue[k++],x=a%w,y=Math.floor(a/w);for(const d of dirs){const nx=$gameMap.roundXWithDirection(x,d),ny=$gameMap.roundYWithDirection(y,d),v=ny*w+nx;if(nx<0||ny<0||nx>=w||ny>=h||seen[v]>=0||!$gamePlayer.canPass(x,y,d))continue;seen[v]=a;queue.push(v);}}
     if(seen[goal]<0)return false;path=[];let a=goal;while(a!==root){const prev=seen[a],dx=a%w-prev%w,dy=Math.floor(a/w)-Math.floor(prev/w);path.unshift(dx>0?6:dx<0?4:dy>0?2:8);a=prev;}return true;}
    function tick(){
     if(SceneManager._scene instanceof Scene_ArenaNarrative){nativeWalk.status='ending';return;}
     if(SceneManager._scene instanceof Scene_Battle){nativeWalk.status='battle';return;}
     if(SceneManager._scene instanceof Scene_Gameover){nativeWalk.status='gameover';return;}
     if(!($gamePlayer.isMoving())&&$gamePlayer.canMove()&&!SceneManager.isSceneChanging()){
      if($gamePlayer.x===tx&&$gamePlayer.y===ty){nativeWalk.status='goal';return;}
      if(!path.length||!$gamePlayer.canPass($gamePlayer.x,$gamePlayer.y,path[0])){if(!plan()){nativeWalk.status='no-path';return;}}
      const d=path.shift();$gamePlayer.moveStraight(d);nativeWalk.steps++;
     }requestAnimationFrame(tick);
    }tick();
   };
  });
  const controls=require('./battle-test-controls.cjs')(p);let encounters=0;
  async function walk(x,y){let steps=0;for(let tries=0;tries<60;tries++){
   await p.evaluate(([x,y])=>walkTo(x,y),[x,y]);await p.waitForFunction(()=>nativeWalk.status!=='walking',null,{timeout:120000});const r=await p.evaluate(()=>nativeWalk);steps+=r.steps;
   if(r.status==='battle'){encounters++;await scene('Scene_Battle');await p.evaluate(()=>{$gameTroop.members().forEach(e=>e.setHp(1));$gameActors.actor(1).setHp($gameActors.actor(1).mhp);});assert.equal(await controls.choose('attack'),'map');await scene('Scene_Map');continue;}
   assert(['goal','ending'].includes(r.status),JSON.stringify(r));route.push({target:[x,y],steps,status:r.status});return;
  }throw Error('too many encounters');}
  async function drain(){for(let n=0;n<100;n++){const busy=await p.evaluate(()=>$gameMessage.isBusy());if(!busy)return;await p.waitForTimeout(80);if(await p.evaluate(()=>SceneManager._scene._messageWindow.pause&&SceneManager._scene._messageWindow._waitCount===0))await key('Enter');}throw Error('message timeout');}
  await walk(142,65);await p.evaluate(()=>$gamePlayer.setDirection(8));await key('Enter');await p.waitForFunction(()=>SceneManager._scene._messageWindow.pause&&SceneManager._scene._messageWindow._waitCount===0);await p.keyboard.down('Enter');await p.waitForTimeout(330);
  assert.equal(await p.evaluate(()=>!!$gameTemp._arenaNarrativeFence),true);assert.equal(await p.evaluate(()=>$gamePlayer.canMove()),false);assert.equal(await p.evaluate(()=>$gamePlayer.triggerAction()),false);await p.keyboard.up('Enter');await p.waitForTimeout(180);await drain();
  assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),20);assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[1])),1);await shot('chave');
  await p.evaluate(()=>{$gameSystem.onBeforeSave();if(!DataManager.saveGame(18)||!DataManager.loadGame(18))throw Error('dungeon save');$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await scene('Scene_Map');assert.equal((await story()).phase,'dungeon');assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[1])),1);checks.push('native walking to key/event interaction; close-message held input fenced; stage20/save/load keeps one key and skips intro');
  await walk(141,73);await p.evaluate(()=>$gamePlayer.setDirection(4));await key('Enter');await drain();assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),30);assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[1])),0);await p.waitForFunction(()=>!($gameMap._arenaDoorTransitions||{})['door.07']);await shot('porta');
  await walk(13,145);await scene('Scene_ArenaNarrative');console.log('route',JSON.stringify(route),'encounters',encounters);assert.equal((await story()).phase,'ending');assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),40);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().completed),true);assert.equal(await p.evaluate(()=>ArenaNarrative.finish()),false);await shot('encerramento');
  checks.push('native route through original cell door to Shift Gate, contact completes MQ01 once and opens F01 instead of M02');
  await p.evaluate(()=>SceneManager._scene._focus=0);await key('Enter');await scene('Scene_Save');await p.evaluate(()=>{SceneManager._scene._listWindow.select(16);SceneManager._scene._listWindow.processOk();});await scene('Scene_ArenaNarrative');
  const final=await p.evaluate(()=>({q:ArenaQuests.snapshot(),items:$gameParty._items,resources:ArenaResources.snapshot(),story:ArenaNarrative.state(),operations:$gameSystem._persistentState.namespaces.arenaNarrative.operations}));
  await p.waitForFunction(()=>!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);await p.keyboard.down('Enter');await scene('Scene_Title');await p.waitForTimeout(900);assert.equal(await p.evaluate(()=>SceneManager._scene instanceof Scene_Title),true);await p.keyboard.up('Enter');await p.waitForTimeout(90);await loadUI();assert.equal((await story()).phase,'ending');assert.deepEqual(await p.evaluate(()=>ArenaQuests.snapshot()),final.q);assert.deepEqual(await p.evaluate(()=>$gameParty._items),final.items);assert.equal(await p.evaluate(()=>ArenaNarrative.finish()),false);await key('Enter');await scene('Scene_Title');checks.push('ending native save/load is a stable completed screen without rewards/quest replay; explicit return to title');
  await p.evaluate(()=>ArenaDungeon.startLab());await scene('Scene_Map');assert.equal((await story()).mode,'technical');assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),10);checks.push('technical exploration entry remains isolated and available without normal campaign introduction');
  assert.equal(await p.evaluate(()=>Graphics._errorPrinter.innerHTML),'');assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await b.version(),checks,route,encounters,final,errors,isolation:'Disposable Chrome contexts/save17/18; no personal saves. Complete path with native collision/moveStraight (speed6 for automation), no locate/through. Any encountered battle uses HP1 enemy/full HP player fixture in memory to validate integration, not balance. Narrative saves use native Save/Load scenes.'},null,2)+'\n');console.log('PASS '+checks.length+' narrative groups; full native route '+route.reduce((n,r)=>n+r.steps,0)+' steps, '+encounters+' controlled encounters');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
