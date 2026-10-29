// Focal packaged-web route; isolated Chrome profile, no personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const url=process.env.ARENA_URL||'http://127.0.0.1:8771/Arena/';
const packageDir=path.resolve(process.argv[2]||'dist/web/m01-19-web-r01-9fab698/Arena');
const out='doc/evidencias/m01-19-pacote-web';fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(packageDir,'package-manifest.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const allowed=new Set(manifest.files.map(f=>f.path));
 assert.equal(manifest.namespace,'arena:m01:save-v1');
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(packageDir,path.join(dir,e.name)).split(path.sep).join('/')]);
 assert.deepEqual(walk(packageDir).sort(),[...allowed,'package-manifest.json'].sort());
 for(const f of manifest.files){assert(!/^(doc|art|tmp|tools|save|\.git)\//i.test(f.path));assert(!/\.(rpgsave|bak|psd|py|cjs)$/i.test(f.path));}
 // Byte/case check every file, including dynamically selected assets.
 for(let i=0;i<manifest.files.length;i+=12)await Promise.all(manifest.files.slice(i,i+12).map(async f=>{
  const r=await fetch(new URL(f.path,url));assert.equal(r.status,200,f.path);assert.equal(sha(Buffer.from(await r.arrayBuffer())),f.sha256,f.path);
 }));
 for(const p of ['data/system.json','../arena/index.html','../doc/wiki/test.html','save/file1.rpgsave'])assert.equal((await fetch(new URL(p,url))).status,404,p);
 const profile=fs.mkdtempSync(path.resolve('tmp/arena-package-profile-'));
 const c=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1100,height:800}});
 const errors=[],requests=new Set(),checks=['Exact manifest inventory excludes development/references/saves; all 317 runtime files fetched with matching SHA-256; wrong-case paths rejected'];
 try{
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>errors.push(r.url()+': '+r.failure().errorText));
  p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  p.on('request',r=>{if(r.url().startsWith('http'))requests.add(r.url());});
  const scene=name=>p.waitForFunction(name=>window[name]&&SceneManager._scene instanceof window[name]&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!SceneManager._scene.isBusy(),name);
  const key=async k=>{if(await p.evaluate(()=>window.Scene_ArenaNarrative&&SceneManager._scene instanceof Scene_ArenaNarrative))await p.waitForFunction(()=>!SceneManager._scene._awaitNeutral&&Date.now()>=SceneManager._scene._readyAt);await p.keyboard.press(k,{delay:70});await p.waitForTimeout(190);};
  await p.goto(url);await scene('Scene_Title');await p.waitForFunction(()=>SceneManager._scene._commandWindow.isOpenAndActive());
  assert.equal(await p.evaluate(()=>DataManager.isAnySavefileExists()),false);
  await p.evaluate(()=>SceneManager._scene._commandWindow.selectSymbol('newGame'));await key('Enter');await scene('Scene_ArenaCharacterCreation');
  await p.getByRole('textbox',{name:'Nome do personagem'}).fill('Elara Pacote');
  await key('Enter');await key('ArrowDown');await key('Enter');await key('ArrowRight');await key('Enter');await key('Enter');
  await p.waitForFunction(()=>!!SceneManager._scene._confirm);await key('Enter');await scene('Scene_ArenaNarrative');
  assert.equal(await p.evaluate(()=>ArenaNarrative.state().phase),'intro');await p.locator('#GameCanvas').screenshot({path:out+'/introducao.png'});
  const phases=new Set();for(let i=0;i<150;i++){
   const phase=await p.evaluate(()=>ArenaNarrative.state().phase);phases.add(phase);if(phase==='dungeon')break;await key('Enter');
  }
  assert(phases.has('intro')&&phases.has('ria')&&phases.has('dungeon'));
  await scene('Scene_Map');await p.waitForFunction(()=>$gamePlayer.canMove()&&!$gamePlayer.isTransferring()&&ImageManager.isReady());
  assert.equal(await p.evaluate(()=>$gameMap.mapId()),8);assert.equal(await p.evaluate(()=>ArenaQuests.snapshot().stage),10);
  await p.locator('#GameCanvas').screenshot({path:out+'/dungeon.png'});checks.push('Native New Game, name/race/gender confirmation, introduction/Ria and actual entry into Map008 in /Arena/');
  await key('Escape');await scene('Scene_Menu');await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('save');w.processOk();});await scene('Scene_Save');
  await p.evaluate(()=>{const w=SceneManager._scene._listWindow;w.select(0);w.processOk();});await scene('Scene_Menu');
  const snapshot=()=>p.evaluate(()=>({name:$gameActors.actor(1).name(),race:ArenaPersistence.identity().race,map:$gameMap.mapId(),position:[$gamePlayer.x,$gamePlayer.y],quest:ArenaQuests.snapshot(),resources:ArenaResources.snapshot(),story:ArenaNarrative.state()}));
  const before=await snapshot();await p.reload();await scene('Scene_Title');await p.waitForFunction(()=>SceneManager._scene._commandWindow.isOpenAndActive());
  await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('continue');w.processOk();});await scene('Scene_Load');
  await p.evaluate(()=>{const w=SceneManager._scene._listWindow;w.select(0);w.processOk();});await scene('Scene_Map');await p.waitForFunction(()=>$gamePlayer.canMove()&&!$gamePlayer.isTransferring()&&ImageManager.isReady());
  assert.deepEqual(await snapshot(),before);checks.push('Native menu Save, page reload and title Continue/Load preserve campaign identity/location/quest/resources/narrative in isolated profile');
  const keys=await p.evaluate(()=>Object.keys(localStorage));assert(keys.length>0&&keys.every(k=>k.startsWith('arena:m01:save-v1:')));
  for(const request of requests){assert(request.startsWith(url),'Request escaped subfolder: '+request);const rel=decodeURIComponent(request.slice(url.length).split('?')[0]);assert(rel===''||allowed.has(rel),'Non-runtime request: '+rel);}
  assert.deepEqual(errors,[]);checks.push('All observed runtime HTTP paths stay inside /Arena/ with exact manifest capitalization; no request/page errors; namespace unchanged');
  const result={testVersion:manifest.testVersion,sourceCommit:manifest.sourceCommit,origin:new URL(url).origin,url,browser:c.browser().version(),mode:'headless',viewport:{width:1100,height:800},runtimeFiles:manifest.files.length,totalBytes:manifest.files.reduce((n,f)=>n+f.bytes,0)+fs.statSync(path.join(packageDir,'package-manifest.json')).size,checks,requests:[...requests].sort(),errors,profile,coverage:'Packaging smoke only: creation/intro/entry/save/reload/load, not complete M01 route/combat or physical mobile. No changes to gameplay, campaign ID or namespace.'};
  fs.writeFileSync(out+'/resultado.json',JSON.stringify(result,null,2)+'\n');console.log('PASS '+checks.length+' package checks, '+requests.size+' observed runtime URLs');
 }finally{await c.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
