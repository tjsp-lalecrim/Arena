// Focal M02-02A: disposable Chrome origin, native JsonEx/save/load, no personal saves/battles.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-02a');
const pure={};vm.runInNewContext(fs.readFileSync(path.join(root,'js/plugins/MV_ChapterContinuation.js'),'utf8'),pure);
const R=pure.MVChapterContinuation,c={mode:'campaign',identity:true,checkpoint:'ready'};
assert.equal(R.inspect(c,R.defaults()).eligible,true);assert.equal(R.inspect({...c,checkpoint:'pre_gate'},R.defaults()).code,'pre_gate');
assert.throws(()=>R.validate({phase:'arrived',transitionId:null,destinationId:null}));assert.throws(()=>R.inspect({...c,checkpoint:'unknown'},R.defaults()));
const draft=R.begin(R.defaults(),'campaign/MQ02.begin','technical.resources.arrival');assert.equal(R.begin(draft,'x','y'),null);assert.equal(R.arrive(draft).phase,'arrived');assert.equal(R.arrive(R.arrive(draft)),null);
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.css':'text/css','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,f=path.resolve(root,'.'+decodeURIComponent(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(e?'':b);});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  fs.mkdirSync(out,{recursive:true});browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({hasTouch:true,viewport:{width:1000,height:800}}),page=await context.newPage(),errors=[],checks=['Pure context/state validation and non-mutating one-way transitions'];
  page.setDefaultTimeout(10000);page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text());});page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message);});await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const title=()=>page.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  const lab=()=>page.waitForFunction(()=>ArenaContinuation.labActive()&&SceneManager._scene._choices&&SceneManager._scene._choices.isOpenAndActive()&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging());
  const key=async k=>{await page.keyboard.down(k);await page.waitForTimeout(70);await page.keyboard.up(k);await page.waitForTimeout(130);};
  const choose=async symbol=>{await page.evaluate(s=>SceneManager._scene._choices.selectSymbol(s),symbol);await key('Enter');};
  const snapshot=()=>page.evaluate(()=>{
   const data=JSON.parse(JSON.stringify($gameSystem._persistentState));delete data.namespaces.arenaContinuation;
   return JsonEx.stringify({persistent:data,actors:$gameActors,party:$gameParty,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches});
  });
  const raw=()=>page.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
  await title();assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);
  await page.evaluate(()=>{DataManager._lastAccessedId=4;SceneManager._scene._commandWindow.selectSymbol('arenaContinuationLab');SceneManager._scene._commandWindow.processOk();});await lab();
  assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'ready');
  for(const id of ['pre_gate','intro','technical']){
   await page.evaluate(id=>ArenaContinuation.fixture(id),id);await lab();const before=await snapshot();assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);assert.equal(await snapshot(),before);
   assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),{pre_gate:'pre_gate',intro:'partial_intro',technical:'technical'}[id]);
  }
  async function pointerPreset(id,touch){
   const xy=await page.evaluate(id=>{const w=SceneManager._scene._choices,i=w._list.findIndex(c=>c.symbol==='fixture'&&c.ext===id);w.select(i);const r=w.itemRect(i),canvas=Graphics._canvas.getBoundingClientRect();return{x:canvas.x+(w.x+w.padding+r.x+r.width/2)*canvas.width/Graphics.width,y:canvas.y+(w.y+w.padding+r.y+r.height/2)*canvas.height/Graphics.height};},id);
   if(touch)await page.touchscreen.tap(xy.x,xy.y);else await page.mouse.click(xy.x,xy.y,{delay:80});await page.waitForTimeout(180);await lab();
  }
  await pointerPreset('pre_gate',false);assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'pre_gate');
  await pointerPreset('ending',true);assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'ready');
  await page.evaluate(()=>ArenaContinuation.fixture('intro'));await lab();const introRaw=await raw();
  await page.evaluate(()=>ArenaContinuation.fixture('pre_gate'));await lab();const beforeGate=await page.evaluate(()=>({r:ArenaResources.snapshot(),p:ArenaAttributes.snapshot(),items:JSON.stringify([$gameParty._items,$gameParty._weapons,$gameParty._armors]),gold:$gameParty.gold()}));
  await choose('gate');await lab();assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'ready');assert.deepEqual(await page.evaluate(()=>({r:ArenaResources.snapshot(),p:ArenaAttributes.snapshot(),items:JSON.stringify([$gameParty._items,$gameParty._weapons,$gameParty._armors]),gold:$gameParty.gold()})),beforeGate);
  checks.push('Title/keyboard/mouse/emulated-touch access; old pre-Gate, partial intro and technical snapshots recognized; no premature continuation; synthetic Gate alters only expected quest/narrative state');
  for(const id of ['ending','ended']){await page.evaluate(id=>ArenaContinuation.fixture(id),id);await lab();assert.equal(await page.evaluate(()=>ArenaContinuation.status().eligible),true);}
  const before=await snapshot();await page.evaluate(()=>SceneManager._scene._choices.selectSymbol('continue'));await page.keyboard.down('Enter');await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>MVStateStore.read('arenaContinuation').phase),'idle');assert.equal(await page.evaluate(()=>SceneManager._scene._confirm.active),false);await page.keyboard.up('Enter');
  await page.waitForFunction(()=>SceneManager._scene._confirm.active);await key('Escape');await lab();assert.equal(await snapshot(),before);assert.equal(await page.evaluate(()=>ArenaContinuation.status().eligible),true);
  await choose('continue');await page.waitForFunction(()=>SceneManager._scene._confirm.active);await key('Enter');await lab();
  assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'travelling');assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);assert.equal(await snapshot(),before);
  const receipt=await page.evaluate(()=>({state:MVStateStore.read('arenaContinuation'),begin:MVStateStore.hasOperation('arenaContinuation','campaign/MQ02.begin'),arrival:MVStateStore.hasOperation('arenaContinuation','campaign/MQ02.arrive')}));
  assert.deepEqual(receipt,{state:{phase:'travelling',transitionId:'campaign/MQ02.begin',destinationId:'technical.resources.arrival'},begin:true,arrival:false});
  const travellingRaw=await raw();
  checks.push('Ending/ended offer until confirmation; held input cannot confirm twice; cancel changes nothing; begin commits once with stable IDs, without healing/EXP/rewards');
  const storageBefore=await page.evaluate(()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])));
  const blocked=await page.evaluate(()=>{let serialized=false;try{DataManager.makeSaveContents();}catch(e){serialized=true;}return{normal:DataManager.saveGame(9),direct:DataManager.saveGameWithoutRescue(9),index:DataManager.saveGlobalInfo([]),backup:StorageManager.backup(9),write:StorageManager.save(29,'x'),remove:StorageManager.remove(9),serialized,enabled:$gameSystem.isSaveEnabled()};});
  assert.deepEqual(blocked,{normal:false,direct:false,index:false,backup:false,write:false,remove:false,serialized:true,enabled:false});assert.equal(await page.evaluate(()=>JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))),storageBefore);
  await choose('store');await lab();await page.locator('#GameCanvas').screenshot({path:path.join(out,'transicao-em-ram.png')});
  assert.equal(await page.evaluate(()=>ArenaContinuation.arrive()),true);await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&!SceneManager.isSceneChanging()&&ArenaContinuation.status().code==='arrived');
  assert.deepEqual(await page.evaluate(()=>[$gameMap.mapId(),$gamePlayer.x,$gamePlayer.y]),[5,4,7]);await page.waitForTimeout(300);assert.equal(await snapshot(),before);assert.equal(await page.evaluate(()=>ArenaContinuation.arrive()),false);
  await page.locator('#GameCanvas').screenshot({path:path.join(out,'destino-tecnico.png')});
  await key('Escape');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu&&SceneManager._scene._commandWindow.active);await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaContinuationReturn');w.processOk();});await lab();
  await choose('load');await lab();assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'travelling');assert.equal(await snapshot(),before);
  checks.push('All normal writes/index/backup/removal/serialization blocked; RAM checkpoint restores travelling after native transfer to existing Map005; actor, points, resources, quests, receipts and items unchanged');
  await page.evaluate(()=>ArenaContinuation.fixture('incompatible'));await lab();assert.equal(await snapshot(),before);assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'travelling');
  await page.evaluate(()=>{PluginManager.parameters('Arena_Continuation').TechnicalDestination='{"id":"technical.resources.arrival","mapId":5,"x":99,"y":7,"direction":2}';});
  assert.equal(await page.evaluate(()=>ArenaContinuation.arrive()),true);await lab();assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'travelling');assert.equal(await snapshot(),before);
  await page.evaluate(()=>{PluginManager.parameters('Arena_Continuation').TechnicalDestination='{"id":"technical.resources.arrival","mapId":5,"x":4,"y":7,"direction":2}';});
  await choose('arrive');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&ArenaContinuation.status().code==='arrived');
  // Return to the laboratory through the same menu command, then save the arrived record.
  await key('Escape');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Menu&&SceneManager._scene._commandWindow.active);await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaContinuationReturn');w.processOk();});await lab();
  await choose('store');await lab();for(let i=0;i<2;i++){await choose('load');await lab();assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'arrived');assert.equal(await page.evaluate(()=>ArenaContinuation.begin()||ArenaContinuation.arrive()),false);assert.equal(await snapshot(),before);}
  const arrivedRaw=await raw();
  checks.push('Malformed state rejected preserving current session; out-of-bounds destination rejected recoverably; arrived checkpoint can be restored repeatedly without re-offer, relocation, rewards or state loss');
  await choose('exit');await title();assert.equal(await page.evaluate(()=>DataManager._lastAccessedId),4);assert.equal(await page.evaluate(()=>ArenaContinuation.labActive()),false);
  // Native slots only in this disposable browser context. Capture a synthetic m01
  // snapshot, leave the guarded laboratory, then exercise ordinary native I/O.
  await page.evaluate(()=>ArenaContinuation.fixture('ending'));await lab();const normal=JSON.parse(await raw());delete normal.system._persistentState.namespaces.arenaContinuation;
  await choose('exit');await title();const normalJson=JSON.stringify(normal);
  assert.equal(await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));$gameSystem.onBeforeSave();return DataManager.saveGame(9);},normalJson),true);
  const nativeBefore=await snapshot();await page.reload();await title();assert.equal(await page.evaluate(()=>DataManager.loadGame(9)),true);assert.equal(await snapshot(),nativeBefore);
  await page.evaluate(()=>SceneManager.goto(Scene_Load));await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._scene.isActive()&&SceneManager._sceneStarted&&SceneManager._scene._listWindow.isOpenAndActive());await page.evaluate(()=>{const w=SceneManager._scene._listWindow;w.select(8);});await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative);
  assert.deepEqual(await page.evaluate(()=>SceneManager._scene._buttons.map(b=>b.id)),['save','title']);assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);
  checks.push('Normal native save/reload/load of a pre-plugin m01 fixture keeps data and original ending UI; no campaign continuation enabled; leaving lab restores normal slot selection');
  const invalidNative=await page.evaluate(()=>{
   const c=DataManager.makeSaveContents();c.system._persistentState.namespaces.arenaContinuation={version:99,data:{phase:'idle',transitionId:null,destinationId:null},operations:{}};
   StorageManager.save(10,JsonEx.stringify(c));const info=DataManager.loadGlobalInfo();info[10]=info[9];DataManager.saveGlobalInfo(info);
   // Reload the intact slot first: makeSaveContents returns references, so this
   // test-only mutation is not the actual session used to verify atomic failure.
   DataManager.loadGame(9);const before=[$gameSystem,$gameActors,$gameParty,$gameMap,$gamePlayer],raw=StorageManager.load(10),slot=DataManager._lastAccessedId;
   const ok=DataManager.loadGame(10);return{ok,same:before.every((v,i)=>v===[$gameSystem,$gameActors,$gameParty,$gameMap,$gamePlayer][i]),diskSame:raw===StorageManager.load(10),slotSame:slot===DataManager._lastAccessedId,error:ArenaContinuation.lastError()};
  });assert.equal(invalidNative.ok,false);assert.equal(invalidNative.same,true);assert.equal(invalidNative.diskSame,true);assert.equal(invalidNative.slotSame,true);assert.match(invalidNative.error,/Versão/);
  await page.evaluate(()=>SceneManager.goto(Scene_Load));await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._scene.isActive()&&SceneManager._sceneStarted&&SceneManager._scene._listWindow.isOpenAndActive());
  await page.evaluate(()=>SceneManager._scene._listWindow.select(9));await key('Enter');assert.equal(await page.evaluate(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._scene._listWindow.active),true);assert.match(await page.evaluate(()=>SceneManager._scene._helpWindow._text),/dados preservados/);
  for(const [phase,json] of [['travelling',travellingRaw],['arrived',arrivedRaw]]){
   await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));$gameSystem.onBeforeSave();if(!DataManager.saveGame(12))throw Error('isolated transition save');},json);
   const checkpoint=await snapshot();for(let i=0;i<2;i++){assert.equal(await page.evaluate(()=>DataManager.loadGame(12)),true);assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),phase);assert.equal(await snapshot(),checkpoint);assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);}
  }
  checks.push('Synthetic travelling/arrived native slots survive repeated save/load, preserving receipts and all other data; no lab save path or campaign transition enabled');
  // Native partial-intro routing is still active outside the laboratory.
  await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));$gameSystem.onBeforeSave();DataManager.saveGame(11);SceneManager.goto(Scene_Load);},introRaw);await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Load&&SceneManager._scene.isActive()&&SceneManager._sceneStarted&&SceneManager._scene._listWindow.isOpenAndActive());await page.evaluate(()=>{const w=SceneManager._scene._listWindow;w.select(10);});await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaNarrative);
  assert.deepEqual(await page.evaluate(()=>{const n=ArenaNarrative.state();return[n.phase,n.section,n.word];}),['intro',1,5]);
  const oldRia=JSON.parse(introRaw);oldRia.system._persistentState.namespaces.arenaNarrative.version=1;Object.assign(oldRia.system._persistentState.namespaces.arenaNarrative.data,{phase:'ria',section:0,word:23});
  const migratedRia=await page.evaluate(json=>{DataManager.extractSaveContents(JsonEx.parse(json));return ArenaNarrative.state();},JSON.stringify(oldRia));assert.deepEqual([migratedRia.phase,migratedRia.section,migratedRia.word],['ria',1,1]);
  await page.evaluate(()=>{SceneManager.goto(Scene_Title);});await title();await page.evaluate(()=>ArenaAttributes.startLab());await page.waitForFunction(()=>ArenaAttributes.labActive());assert.equal(await page.evaluate(()=>ArenaContinuation.status().code),'technical');assert.equal(await page.evaluate(()=>ArenaContinuation.begin()),false);
  await page.evaluate(()=>{ArenaAttributes.leaveLab();});await title();const e05=await page.evaluate(()=>{const f=ArenaBalanceLab.active;ArenaBalanceLab.active=function(){return true;};try{return{code:ArenaContinuation.status().code,begin:ArenaContinuation.begin()};}finally{ArenaBalanceLab.active=f;}});assert.deepEqual(e05,{code:'technical',begin:false});
  checks.push('Future-version native save fails with recoverable load-screen feedback, without replacing active objects, changing slot or writing data; partial intro resumes cursor and existing narrative-v1 migration remains valid; attributes lab and simulated E05 context cannot become campaign');
  assert.deepEqual(errors,[]);
  const old=cp.execFileSync('git',['show','34c2f95:js/plugins.js'],{cwd:root,encoding:'utf8'}),current=fs.readFileSync(path.join(root,'js/plugins.js'),'utf8'),records=s=>JSON.parse(s.slice(s.indexOf('['),s.lastIndexOf(']')+1));
  assert.deepEqual(records(current).slice(0,-2),records(old));assert.match(current,/^\/\/ Generated by RPG Maker\.\r?\n\/\/ Do not edit this file directly\.\r?\nvar \$plugins =\r?\n\[/);assert.notEqual(current.charCodeAt(0),0xfeff);
  for(const p of records(current))assert(fs.existsSync(path.join(root,'js/plugins',p.name+'.js')));
  fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:await browser.version(),checks,receipt,blocked,invalidNative,errors,namespace:'arena:m01:save-v1 unchanged',editor:'not executed',phone:'not executed',scope:'Synthetic snapshots, native isolated storage and RAM; no battles/full campaign/personal saves'},null,2)+'\n');
  console.log('PASS',checks.length,'focused continuation groups');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
