// Focused E05 integration; ephemeral origin and incognito context, no personal saves/server.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m01-20-e05');
const expected={light:[15,11,11,5,12,10],heavy:[15,13,11,5,10,10],magic:[15,9,15,5,10,10],hybrid:[15,10,13,5,11,10]};
const mime={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.woff':'font/woff','.ttf':'font/ttf','.css':'text/css','.ogg':'audio/ogg','.m4a':'audio/mp4'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();}else{res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);}});
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));fs.mkdirSync(out,{recursive:true});
 let browser;
 try{
 browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({viewport:{width:1000,height:800}}),page=await context.newPage(),errors=[],missing=[],checks=[],scenarios=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()===404&&!r.url().endsWith('favicon.ico'))missing.push(r.url());});
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 await page.evaluate(()=>{DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Controle sintético',raceId:'breton',genderId:'female'});$gameActors.actor(1).setHp(77);if(!DataManager.saveGame(17))throw Error('control save');localStorage.setItem('RPG File1','generic-control');window.normalStore=JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]));window.nativeRandom=Math.random;window.writeCount=0;const save=StorageManager.save,backup=StorageManager.backup;StorageManager.save=function(){writeCount++;return save.apply(this,arguments);};StorageManager.backup=function(){writeCount++;return backup.apply(this,arguments);};});
 await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaBattle');w.processOk();});
 await page.waitForFunction(()=>SceneManager._scene._profiles&&SceneManager._scene.isActive());
 await page.evaluate(()=>SceneManager._scene._profiles.selectSymbol('balanceE05'));
 await page.keyboard.down('Enter');
 await page.waitForFunction(()=>SceneManager._scene._e05Choices&&SceneManager._scene.isActive());
 await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>ArenaBalanceLab.active()),false);assert.equal(await page.evaluate(()=>SceneManager._scene._e05Choices.active),false);
 await page.keyboard.up('Enter');await page.waitForFunction(()=>SceneManager._scene._e05Choices.active);
 await page.locator('#GameCanvas').screenshot({path:out+'/selecao.png'});
 if(process.env.ARENA_E05_SELECTION_ONLY){fs.writeFileSync(out+'/selecao-protecao.json',JSON.stringify({browser:await browser.version(),passed:true,check:'Holding Enter through entry does not launch a scenario; release enables selection, no queued use',errors,missing},null,2));console.log('PASS E05 selection release guard');return;}
 async function state(){
  for(let n=0;n<240;n++){
   const s=await page.evaluate(()=>{const s=SceneManager._scene;if(!s.isActive())return 'wait';if(s._e05Choices)return 'selection';if(s instanceof Scene_Gameover)return 'gameover';if(s instanceof Scene_Battle){if(s._messageWindow.pause&&s._messageWindow._waitCount===0)return 'message';if(s._partyCommandWindow.isOpenAndActive())return 'party';if(s._actorCommandWindow.isOpenAndActive())return 'actor';}return 'wait';});
   if(s==='message')await page.keyboard.press('Enter',{delay:80});else if(s==='party')await page.evaluate(()=>{const w=SceneManager._scene._partyCommandWindow;w.selectSymbol('fight');w.processOk();});else if(s!=='wait')return s;
   await page.waitForTimeout(90);
  }throw Error('E05 transition timeout');
 }
 async function choose(kind,id){assert.equal(await state(),'actor');await page.evaluate(({kind,id})=>{const s=SceneManager._scene,w=s._actorCommandWindow;w.selectSymbol(kind);if(kind==='skill')w.selectExt($dataSkills[id].stypeId);w.processOk();if(kind==='skill'){s._skillWindow.select(s._skillWindow._data.findIndex(v=>v.id===id));s._skillWindow.processOk();}if(s._enemyWindow.active){s._enemyWindow.select(0);s._enemyWindow.processOk();}if(s._actorWindow.active){s._actorWindow.select(0);s._actorWindow.processOk();}},{kind,id});await page.waitForTimeout(170);return state();}
 for(const id of Object.keys(expected)){
  await page.evaluate(id=>{const w=SceneManager._scene._e05Choices;w.select(Object.keys({light:1,heavy:1,magic:1,hybrid:1}).indexOf(id));w.processOk();},id);
  assert.equal(await state(),'actor');
  const initial=await page.evaluate(()=>({snapshot:ArenaBalanceLab.snapshot(),identity:ArenaPersistence.identity(),weapon:$gameActors.actor(1).weapons()[0].id,enemy:$gameTroop.members().map(e=>({id:e.enemyId(),hp:e.hp,params:[0,1,2,3,4,5,6,7].map(i=>e.param(i))})),skills:$gameActors.actor(1).skills().map(s=>s.id)}));
  assert.deepEqual(initial.snapshot.attrs,expected[id]);assert.deepEqual(initial.snapshot.spent,[3,0,3,0,0,0]);assert.equal(initial.identity.baseVisualId,'breton.female.base');assert.equal(initial.weapon,1);assert.equal(initial.enemy.length,1);assert.equal(initial.enemy[0].id,2);assert.equal(initial.enemy[0].hp,30);
  // MV clamps parameters other than MP to at least1 (the goblin database has MAT0).
  assert.deepEqual(initial.enemy[0].params,JSON.parse(fs.readFileSync(path.join(root,'data/Enemies.json')))[2].params.map((v,i)=>Math.max(i===1?0:1,v)));assert.equal(await page.evaluate(()=>BattleManager.canEscape()),false);
  for(const k of ['hp','mp','vigor'])assert.equal(initial.snapshot.resources[k].current,initial.snapshot.resources[k].maximum);
  assert.deepEqual(['hp','mp','vigor'].map(k=>initial.snapshot.resources[k].maximum),[110,60,100]);for(const skill of [5,6,9,10])assert.ok(initial.skills.includes(skill));
  const formulas=await page.evaluate(()=>{const a=$gameActors.actor(1),e=$gameTroop.members()[0];return [1,5,6,10].map(id=>{const action=new Game_Action(a);action.setSkill(id);return{id,raw:action.evalDamageFormula(e),available:action.isValid()};});});
  for(const f of formulas){assert.ok(f.available);const a=expected[id],power={1:1,5:1.25,6:1.6,10:3}[f.id],raw=power*(f.id===10?a[2]:a[0])*8/(8+3*(f.id===6?.75:1));assert.ok(Math.abs(f.raw-raw)<1e-10);}
  const blocked=await page.evaluate(()=>{let contentsBlocked=false;try{DataManager.makeSaveContents();}catch(e){contentsBlocked=/E05/.test(e.message);}return{save:DataManager.saveGame(17),direct:DataManager.saveGameWithoutRescue(17),index:DataManager.saveGlobalInfo([]),enabled:$gameSystem.isSaveEnabled(),contentsBlocked,randomClean:Math.random===nativeRandom};});
  assert.deepEqual(blocked,{save:false,direct:false,index:false,enabled:false,contentsBlocked:true,randomClean:true});
  await page.locator('#GameCanvas').screenshot({path:out+'/'+id+'.png'});
  const sequence=id==='light'?[['guard',2],['skill',9],['skill',5],['skill',6]]:id==='heavy'?[['attack',1],['skill',6]]:id==='magic'?[['skill',10]]:[['skill',5],['skill',10]];
  for(const [kind,skill] of sequence){const before=await page.evaluate(()=>({v:ArenaResources.snapshot().vigor.current,mp:$gameActors.actor(1).mp}));await choose(kind,skill);const after=await page.evaluate(()=>({v:ArenaResources.snapshot().vigor.current,mp:$gameActors.actor(1).mp}));assert.equal(before.v-after.v,skill===5?5:skill===6?12:0);assert.equal(before.mp-after.mp,skill===9?8:skill===10?6:0);}
  // A miss can require an additional action; do not change HIT or enemy HP for the test.
  for(let n=0;await state()==='actor'&&n<6;n++)await choose('attack',1);
  assert.equal(await state(),'selection');
  const result=await page.evaluate(()=>({session:ArenaBalanceLab.snapshot(),writes:writeCount,storeUnchanged:normalStore===JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)])),randomClean:Math.random===nativeRandom,gold:$gameParty.gold(),level:$gameActors.actor(1).level}));
  assert.equal(result.writes,0);assert.ok(result.storeUnchanged);assert.ok(result.randomClean);assert.equal(result.gold,0);assert.equal(result.level,3);
  scenarios.push({id,initial,formulas,sequence,result});
 }
 checks.push('Real title/battle-lab selection, four native Scene_Battle victories and return to E05 selection; no drops required');
 checks.push('All four exact S06 attribute vectors, same six allocated points, dagger, full110/60/100 and original goblin30');
 checks.push('S02 raw formulas; native attack/guard/light/heavy/heal/fire, single vigor/mana charges; normal variance and HIT preserved');
 checks.push('Save/index/serialization guards; zero storage/backup writes and unchanged synthetic normal save, index and generic key');
 await page.evaluate(()=>ArenaBalanceLab.start('light'));assert.equal(await state(),'actor');
 assert.deepEqual(await page.evaluate(()=>ArenaBalanceLab.snapshot().attrs),expected.light);assert.deepEqual(await page.evaluate(()=>['hp','mp','vigor'].map(k=>ArenaResources.snapshot()[k].current)),[110,60,100]);checks.push('Repeated scenario recomposes attributes/resources without cumulative growth');
 await page.evaluate(()=>ArenaBalanceLab.leave());await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive());
 const normal=await page.evaluate(()=>{if(!DataManager.loadGame(17))throw Error('load control');const a=$gameActors.actor(1),e=new Game_Enemy(2,0,0),action=new Game_Action(a);action.setSkill(1);return{active:ArenaBalanceLab.active(),hp:a.hp,name:a.name(),saveEnabled:$gameSystem.isSaveEnabled(),raw:action.evalDamageFormula(e),expected:Math.max(1,2*a.atk-e.def),serializable:!!DataManager.makeSaveContents(),storeUnchanged:normalStore===JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))};});
 assert.equal(normal.active,false);assert.equal(normal.hp,77);assert.equal(normal.name,'Controle sintético');assert.equal(normal.raw,normal.expected);assert.ok(normal.saveEnabled&&normal.serializable&&normal.storeUnchanged);checks.push('Exit and normal load restore native formula/save, preserving the synthetic pre-lab party');
 const resumed=await page.evaluate(()=>{const saved=DataManager.saveGame(18);DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Novo controle',raceId:'breton',genderId:'female'});const a=$gameActors.actor(1);return{saved,active:ArenaBalanceLab.active(),level:a.level,attrs:[2,3,4,5,6,7].map(i=>a.param(i)),resources:['hp','mp','vigor'].map(k=>ArenaResources.snapshot()[k].current)};});
 assert.equal(resumed.saved,true);assert.equal(resumed.active,false);assert.equal(resumed.level,1);assert.deepEqual(resumed.attrs,[10,5,8,5,10,10]);assert.deepEqual(resumed.resources,[100,50,100]);checks.push('Normal saving works after exit; a new character has no experimental stats or progression');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await browser.version(),checks,scenarios,normal,errors,missing,editor:'not executed',phone:'not executed',scope:'E05 only; no balance approval'},null,2)+'\n');console.log('PASS E05:',checks.length,'focused groups');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
