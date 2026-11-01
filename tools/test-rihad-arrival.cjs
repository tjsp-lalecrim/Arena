// Focal M02-03A: disposable Chrome profile/origin. Never opens personal saves.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-03a');
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.css':'text/css','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{let p=new URL(req.url,'http://localhost').pathname,f=path.resolve(root,'.'+decodeURIComponent(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(e?'':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 fs.mkdirSync(out,{recursive:true});browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:{width:1160,height:920},hasTouch:true}),page=await context.newPage(),checks=[],errors=[],missing=[];
 page.setDefaultTimeout(16000);page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const title=()=>page.waitForFunction(()=>window.ArenaRihad&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const ready=()=>page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&!SceneManager.isSceneChanging()&&$gamePlayer.canMove()).catch(async e=>{console.log('READY',await page.evaluate(()=>({scene:SceneManager._scene.constructor.name,next:SceneManager._nextScene&&SceneManager._nextScene.constructor.name,err:ArenaContinuation.lastError(),status:ArenaContinuation.status(),trans:$gamePlayer.isTransferring(),can:$gamePlayer.canMove(),map:$gameMap.mapId(),ready:DataManager.isDatabaseLoaded()})),errors);await page.locator('#GameCanvas').screenshot({path:'tmp/rihad-review/failure.png'});throw e;});
 const key=async k=>{await page.keyboard.press(k,{delay:90});await page.waitForTimeout(180);};
 const resources=()=>page.evaluate(()=>{const r=ArenaResources.snapshot();return ['hp','mp','vigor'].map(k=>r[k].current);});
 const raw=()=>page.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 const world=()=>page.evaluate(()=>JSON.stringify({actor:$gameActors,party:$gameParty,q1:ArenaQuests.snapshot(),arena:ArenaPersistence.snapshot(),resources:MVStateStore.read('arenaResources'),attributes:ArenaAttributes.snapshot()}));
 const menu=async symbol=>{await key('Escape');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu&&SceneManager._scene._commandWindow.active);await page.evaluate(s=>{const w=SceneManager._scene._commandWindow;w.selectSymbol(s);w.processOk();},symbol);await ready();};
 await title();const storage=await page.evaluate(()=>JSON.stringify(localStorage));
 // Keep this older unit's level3 fixture explicit; the current level1 title path is covered by test-rihad-outskirts.cjs.
 await page.evaluate(()=>ArenaContinuation.previewArrival($arenaRihad.arrival,false));await ready();
 assert.deepEqual(await page.evaluate(()=>[$gameMap.mapId(),$gamePlayer.x,$gamePlayer.y,ArenaContinuation.status().code,ArenaQuests.snapshot('MQ02').stage]),[9,10,11,'arrived',10]);
 assert.deepEqual(await resources(),[31,12,23]);checks.push('Explicit legacy-level3 preview reaches Map009/rihad.arrival at10,11, MQ02=10, resources still spent (31/12/23)');
 assert.equal(await page.evaluate(()=>DataManager.saveGame(1)),false);assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),storage);checks.push('Preview uses old isolated laboratory; native slots blocked, no browser storage writes');
 await page.locator('#GameCanvas').screenshot({path:path.join(out,'chegada.png')});
 // Reach every walking cell from arrival, using native collision (not visual pixels).
 const connectivity=await page.evaluate(()=>{const todo=[[10,11]],seen=new Set(['10,11']);while(todo.length){const [x,y]=todo.shift();for(const [d,dx,dy]of [[2,0,1],[4,-1,0],[6,1,0],[8,0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(seen.has(k)||!$gamePlayer.canPass(x,y,d))continue;seen.add(k);todo.push([nx,ny]);}}const floor=[];for(let y=0;y<$gameMap.height();y++)for(let x=0;x<$gameMap.width();x++)if($gameMap.regionId(x,y)===4&&!(x===9&&y===7))floor.push(x+','+y);return{count:seen.size,unreachable:floor.filter(k=>!seen.has(k)),walls:!$gamePlayer.canPass(10,4,8),npc:!$gamePlayer.canPass(9,8,8),boundary:!$gamePlayer.canPass(10,12,2)};});
 assert.deepEqual(connectivity.unreachable,[]);assert(connectivity.walls&&connectivity.npc&&connectivity.boundary);checks.push('All intended walking cells connected; wall/cap, exterior boundary and NPC collision enforced');
 async function walk(target){
  const route=await page.evaluate(goal=>{const todo=[[$gamePlayer.x,$gamePlayer.y,[]]],seen=new Set();while(todo.length){const [x,y,r]=todo.shift(),k=x+','+y;if(seen.has(k))continue;seen.add(k);if(x===goal[0]&&y===goal[1])return r;for(const [d,dx,dy]of [[2,0,1],[4,-1,0],[6,1,0],[8,0,-1]])if($gamePlayer.canPass(x,y,d))todo.push([x+dx,y+dy,r.concat(d)]);}throw Error('No path');},target);
  for(const d of route){await page.evaluate(d=>$gamePlayer.moveStraight(d),d);await page.waitForFunction(()=>!$gamePlayer.isMoving());}await ready();
 }
 await walk([9,8]);await page.evaluate(()=>$gamePlayer.setDirection(8));await key('Enter');await page.waitForFunction(()=>$gameMessage.isBusy());await page.waitForFunction(()=>SceneManager._scene._messageWindow.pause);
 const q=await page.evaluate(()=>JSON.stringify(ArenaQuests.snapshot('MQ02')));await page.locator('#GameCanvas').screenshot({path:path.join(out,'informante.png')});
 for(let i=0;i<8&&await page.evaluate(()=>$gameMessage.isBusy());i++)await key('Enter');await ready();
 assert.equal(await page.evaluate(()=>JSON.stringify(ArenaQuests.snapshot('MQ02'))),q);checks.push('Native action-button conversation explains place/rest/version limit without Ria/court reveal or stage advance');
 // Real click-to-walk toward the rest approach; no teleport/through.
 const xy=await page.evaluate(()=>{const r=Graphics._canvas.getBoundingClientRect();return{x:r.x+($gameMap.adjustX(15)*48+24)*r.width/Graphics.width,y:r.y+($gameMap.adjustY(11)*48+24)*r.height/Graphics.height};});await page.mouse.click(xy.x,xy.y,{delay:100});
 await page.waitForFunction(()=>$gamePlayer.x===15&&$gamePlayer.y===11&&!$gamePlayer.isMoving()).catch(async e=>{console.log(await page.evaluate(()=>({x:$gamePlayer.x,y:$gamePlayer.y,d:[$gameTemp.destinationX(),$gameTemp.destinationY()],t:$gameTemp._arenaRestAwaitRelease,busy:$gameMessage.isBusy(),scene:SceneManager._scene.constructor.name,can:$gamePlayer.canMove(),touch:TouchInput.isPressed()})));throw e;});await ready();checks.push('Mouse click-to-walk reaches rest approach using native pathfinding');
 const before=await world();await menu('arenaRihadStore');await key('Enter');await page.waitForFunction(()=>ArenaResources.snapshot().hp.current===ArenaResources.snapshot().hp.maximum);await page.waitForTimeout(350);
 assert.deepEqual(await resources(),await page.evaluate(()=>{const r=ArenaResources.snapshot();return ['hp','mp','vigor'].map(k=>r[k].maximum);}));
 await page.locator('#GameCanvas').screenshot({path:path.join(out,'descanso.png')});
 await menu('arenaRihadLoad');assert.equal(await world(),before);assert.deepEqual(await resources(),[31,12,23]);checks.push('Existing rest interaction fills all resources; RAM menu restores position/spent resources/quests/inventory/attributes without slots');
 // Held key: only one recovery; no queued repetition after resource reduction.
 await page.keyboard.down('Enter');await page.waitForFunction(()=>ArenaResources.snapshot().hp.current===ArenaResources.snapshot().hp.maximum);
 await page.evaluate(()=>{const a=$gameActors.actor(1);a.setHp(31);a.setMp(12);ArenaPersistence.setResource('vigor',23,ArenaResources.snapshot().vigor.maximum);});await page.waitForTimeout(500);assert.deepEqual(await resources(),[31,12,23]);await page.keyboard.up('Enter');await page.waitForTimeout(200);checks.push('Same held pressure cannot recover twice or enqueue another use');
 const touch=await page.evaluate(()=>{const l=SceneManager._scene._arenaRestLabel,r=Graphics._canvas.getBoundingClientRect();return{x:r.x+(l.x+144)*r.width/Graphics.width,y:r.y+(l.y+18)*r.height/Graphics.height};});await page.touchscreen.tap(touch.x,touch.y);await page.waitForFunction(()=>ArenaResources.snapshot().hp.current===ArenaResources.snapshot().hp.maximum);checks.push('Existing rest label works with emulated touch');
 assert.equal(await page.evaluate(()=>{const i=new Game_Interpreter();i.setup($gameMap.event(2).list(),2);$gameParty._inBattle=true;try{return ArenaRecovery.usePoint('MQ02.rihad.rest',i).ok;}finally{$gameParty._inBattle=false;}}),false);checks.push('Battle guard rejects rest; no battle launched');
 // Capture a normal-campaign checkpoint in a disposable profile, never a personal slot.
 await menu('arenaRihadLoad');const arrivalRaw=await raw();await page.evaluate(()=>ArenaContinuation.leaveLab());await title();
 await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));SceneManager.goto(Scene_Map);},arrivalRaw);await ready();assert.equal(await page.evaluate(()=>ArenaContinuation.labActive()),false);
 const normalBefore=await world();const position=await page.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]);
 await key('Escape');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu&&SceneManager._scene._commandWindow.active);await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('save');w.processOk();});await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Save&&SceneManager._sceneStarted&&SceneManager._scene.isActive()&&SceneManager._scene._listWindow.isOpenAndActive());await page.evaluate(()=>SceneManager._scene._listWindow.select(10));await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu);await key('Escape');await ready();
 checks.push('Normal campaign saves Map009 through native menu/save scene in isolated Chrome slot11');
 await page.reload();await title();await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('continue');w.processOk();});await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._sceneStarted&&SceneManager._scene.isActive()&&SceneManager._scene._listWindow.isOpenAndActive());await page.evaluate(()=>SceneManager._scene._listWindow.select(10));await key('Enter');await ready();
 assert.equal(await world(),normalBefore);assert.deepEqual(await page.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),position);assert.equal(await page.evaluate(()=>ArenaContinuation.beginCampaign()),false);checks.push('F5 + native Load restores Rihad position, spent resources, all actor state and unique arrival; does not reroute or reoffer');
 await page.locator('#GameCanvas').screenshot({path:path.join(out,'carregada.png')});
 // Old ending/ended with no continuation: cancel/title still possible; confirm enters once.
 for(const phase of ['ending','ended']){
  await page.evaluate(()=>SceneManager.goto(Scene_Title));await title();await page.evaluate(p=>ArenaContinuation.fixture(p),phase);await page.waitForFunction(()=>SceneManager._scene._choices&&SceneManager._scene._choices.active);
  const old=await raw(),oldWorld=await world();await page.evaluate(()=>ArenaContinuation.leaveLab());await title();await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));SceneManager.goto(Scene_ArenaNarrative);},old);
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&!SceneManager.isSceneChanging());await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>SceneManager._scene._buttons.some(b=>b.id==='journey')),true);
  await page.evaluate(()=>SceneManager._scene.action('title'));await title();assert.equal(await page.evaluate(()=>MVStateStore.read('arenaContinuation').phase),'idle');
  await page.evaluate(()=>SceneManager.goto(Scene_ArenaNarrative));await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative&&!SceneManager.isSceneChanging());
  await page.evaluate(()=>SceneManager._scene.action('journey'));await ready();
  const afterWorld=await page.evaluate(()=>{const snap=ArenaPersistence.snapshot();delete snap.quests.MQ02;return JSON.stringify({actor:$gameActors,party:$gameParty,q1:ArenaQuests.snapshot(),arena:snap,resources:MVStateStore.read('arenaResources'),attributes:ArenaAttributes.snapshot()});});assert.equal(afterWorld,oldWorld);
  assert.deepEqual(await page.evaluate(()=>[$gameMap.mapId(),$gamePlayer.x,$gamePlayer.y,ArenaContinuation.status().code]),[9,10,11,'arrived']);assert.equal(await page.evaluate(()=>ArenaContinuation.beginCampaign()),false);
  checks.push(phase+': title cancels without beginning; explicit continuation reaches Rihad once without healing/EXP/rewards or MQ01 mutation');
 }
 // Persist an interrupted transfer; native load must resume it once.
 await page.evaluate(()=>{const n=$gameSystem._persistentState.namespaces.arenaContinuation;n.data.phase='travelling';delete n.operations['campaign/MQ02.arrive'];$gamePlayer.locate(4,10);$gameSystem.onBeforeSave();if(!DataManager.saveGame(12))throw Error('transit save');SceneManager.goto(Scene_Title);});await title();
 await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('continue');w.processOk();});await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._sceneStarted&&SceneManager._scene.isActive()&&SceneManager._scene._listWindow.isOpenAndActive());await page.evaluate(()=>SceneManager._scene._listWindow.select(11));await key('Enter');await ready();
 assert.deepEqual(await page.evaluate(()=>[$gamePlayer.x,$gamePlayer.y,ArenaContinuation.status().code]),[10,11,'arrived']);checks.push('Native interrupted-transfer save/load resumes stable destination once');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);checks.push('No uncaught browser errors or missing runtime requests');
 // Rebuild only this sample: no other generator/output is rerun.
 const files=['data/Map009.json','data/MapInfos.json','data/ArenaCampaign.json','data/ArenaRecovery.json','data/ArenaRihad.json'];const bytes=files.map(f=>fs.readFileSync(path.join(root,f)).toString('base64'));cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:root});assert.deepEqual(files.map(f=>fs.readFileSync(path.join(root,f)).toString('base64')),bytes);checks.push('Arrival generator is reproducible and preserves other configured areas/rest points');
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:browser.version(),environment:'Chrome desktop headless; fresh disposable origin/context, emulated touch only',checks,connectivity,errors,missing,limitations:['No native editor authoring or physical mobile test','Architecture and NPC placeholders require owner evaluation','No court/Ria/outskirts/Stonekeep progression']},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,errors,missing}));
}finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
