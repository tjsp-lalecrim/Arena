// Native UI states and result regression. Disposable contexts; no personal saves.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const out=process.env.ARENA_UI_OUT||'doc/evidencias/m01-11-r02';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({channel:'chrome',headless:true}),cases=[];
 try {for(const viewport of [{width:1100,height:800},{width:640,height:480}]){
  const context=await b.newContext({viewport}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  const size=viewport.width===1100?'desktop':'menor';
  await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');
  await p.waitForFunction(()=>window.ArenaBattleUI&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await p.evaluate(()=>ArenaBattle.startLab());
  await p.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
  // Existing shortcut schema, actually saved/loaded before entering a battle.
  const load=await p.evaluate(()=>{ArenaBattle.prepare();ArenaPersistence.setShortcut('battle.1',{kind:'skill',id:5});ArenaPersistence.setShortcut('battle.2',{kind:'skill',id:10});ArenaPersistence.setShortcut('battle.3',{kind:'item',id:2});const before=ArenaPersistence.snapshot().hotbar;$gameSystem.onBeforeSave();if(!DataManager.saveGame(20))throw Error('save failed');ArenaPersistence.setShortcut('battle.1',null);if(!DataManager.loadGame(20))throw Error('load failed');$gameSystem.onAfterLoad();return{before,after:ArenaPersistence.snapshot().hotbar};});
  assert.deepEqual(load.after,load.before);
  const {key,ready}=require('./battle-test-controls.cjs')(p);
  async function enter(trio){await p.evaluate(trio=>{$gameSelfSwitches.setValue([7,trio?7:2,'A'],false);$gamePlayer.locate(trio?13:7,trio?9:6);$gamePlayer.setDirection(8);},trio);await key('Enter');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());assert.equal(await ready(),'actor');}
  async function shot(name){await p.waitForTimeout(180);await p.screenshot({path:out+'/'+size+'-'+name+'-janela.png'});await p.locator('#GameCanvas').screenshot({path:out+'/'+size+'-'+name+'.png'});}
  function noOverlap(a,c){return !(a[0]<c[0]+c[2]&&c[0]<a[0]+a[2]&&a[1]<c[1]+c[3]&&c[1]<a[1]+a[3]);}
  await enter(false);await shot('principal');
  const panels=await p.evaluate(()=>SceneManager._scene._arenaParticipantPanels.map(w=>({rect:[w.x,w.y,w.width,w.height],opacity:w.opacity,resources:ArenaBattle.resources(w._participant)})));
  for(const w of panels){assert.equal(w.opacity,0);assert.equal(w.rect[2],148);assert(w.rect[0]>=0&&w.rect[1]>=0&&w.rect[0]+w.rect[2]<=816&&w.rect[1]+w.rect[3]<412);}
  await key('ArrowRight');await key('Enter');await p.waitForFunction(()=>SceneManager._scene._skillWindow.active);await shot('habilidades');await key('Tab');await shot('magias');await key('Escape');await key('ArrowRight');await key('ArrowRight');await key('Enter');await p.waitForFunction(()=>SceneManager._scene._itemWindow.active);await shot('inventario');await key('Escape');
  const nav=await p.evaluate(()=>({r:ArenaResources.snapshot(),h:ArenaPersistence.snapshot().hotbar}));
  await key('c');await key('Enter');await p.waitForFunction(()=>SceneManager._scene._arenaPicker.active);await shot('configuracao');await key('Escape');await key('Escape');assert.deepEqual(await p.evaluate(()=>({r:ArenaResources.snapshot(),h:ArenaPersistence.snapshot().hotbar})),nav);
  // Real light technique kills the original HP18 rat, with a single native debit.
  const vigor=await p.evaluate(()=>{window.refineUses=[];const old=Game_Battler.prototype.useItem;Game_Battler.prototype.useItem=function(item){if(this.isActor())refineUses.push(item.id);return old.apply(this,arguments);};return ArenaResources.snapshot().vigor.current;});
  await key('1');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene._arenaPresentationState==='execution');
  assert.equal(await p.evaluate(()=>SceneManager._scene._arenaHotbar.visible),false);await key('c');await key('1');
  await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&$gameMessage.isBusy()&&SceneManager._scene._messageWindow.pause,null,{timeout:20000});
  await shot('vitoria');
  const result=await p.evaluate(()=>{const s=SceneManager._scene,keys=['_arenaHotbar','_arenaPicker','_actorCommandWindow','_skillWindow','_itemWindow','_enemyWindow','_actorWindow','_statusWindow','_arenaCategories','_arenaBack','_helpWindow'];return{text:$gameMessage.allText(),message:[s._messageWindow.x,s._messageWindow.y,s._messageWindow.width,s._messageWindow.height],windows:keys.map(k=>({name:k,visible:s[k].visible,active:!!s[k].active})),uses:refineUses.slice(),resources:ArenaResources.snapshot()};});
  assert.match(result.text,/EXP/);assert.match(result.text,/vitor|venceu/i);
  for(const w of result.windows){assert.equal(w.visible,false,w.name+' overlays result');assert.equal(w.active,false,w.name+' captures result input');}
  assert.equal(result.resources.vigor.current,vigor-5);assert.deepEqual(result.uses,[5]);
  await key('c');await key('1');assert.equal(await p.evaluate(()=>SceneManager._scene.executeArenaShortcut(0)),false);assert.deepEqual(await p.evaluate(()=>refineUses),[5]);assert.deepEqual(await p.evaluate(()=>ArenaPersistence.snapshot().hotbar),load.before);
  assert.equal(await ready(),'map');await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&!$gamePlayer.isTransferring());await p.waitForTimeout(400);assert.equal(await p.evaluate(()=>SceneManager._scene instanceof Scene_Map),true);
  await enter(true);await p.evaluate(()=>{const w=SceneManager._scene._actorCommandWindow;w.selectSymbol('attack');w.processOk();});await p.waitForFunction(()=>SceneManager._scene._enemyWindow.active);await shot('alvos');
  const target=await p.evaluate(()=>{const s=SceneManager._scene;return{rect:[s._enemyWindow.x,s._enemyWindow.y,s._enemyWindow.width,s._enemyWindow.height],status:[s._statusWindow.x,s._statusWindow.y,s._statusWindow.width,s._statusWindow.height],commandsVisible:s._actorCommandWindow.visible,panels:s._arenaParticipantPanels.map(w=>[w.x,w.y,w.width,w.height])};});
  assert.equal(target.commandsVisible,false);assert(noOverlap(target.rect,target.status));for(const r of target.panels)assert(noOverlap(target.rect,r));
  const current=await p.evaluate(()=>ArenaResources.snapshot());await key('Escape');assert.deepEqual(await p.evaluate(()=>ArenaResources.snapshot()),current);assert.equal(await p.evaluate(()=>SceneManager._scene._actorCommandWindow.visible),true);
  await p.evaluate(()=>$gameActors.actor(1).setHp(1));const ending=await require('./battle-test-controls.cjs')(p).choose('guard');assert.equal(ending,'gameover');await shot('derrota');
  const canvas=await p.evaluate(()=>Graphics._canvas.getBoundingClientRect().toJSON());assert(canvas.left>=0&&canvas.top>=0&&canvas.right<=viewport.width&&canvas.bottom<=viewport.height);assert.deepEqual(errors,[]);
  cases.push({viewport,canvas,load,panels,result,target,errors,checks:['compact frameless indicators','native lists/configuration/cancel','shortcuts restored by native save/load','controls hidden and inactive before/during result','execution C/digit ignored, single native Vigor debit','victory and EXP fully unobstructed','map return without repeat','separate target strip and cancel','native defeat']});await context.close();
 }
 const sources=Object.fromEntries(['js/plugins/Arena_BattleUI.js','data/ArenaBattleUI.json','js/plugins.js'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
 fs.writeFileSync(out+'/estados-resultado.json',JSON.stringify({browser:await b.version(),sources,cases,isolation:'Disposable contexts; browser-only save20; no personal saves',limits:['Visual review still required by owner','No physical A56 or editor playtest asserted']},null,2)+'\n');console.log('PASS native result/input gating, compact panels, save/load, target transitions, victory/EXP/defeat at desktop and640x480');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
