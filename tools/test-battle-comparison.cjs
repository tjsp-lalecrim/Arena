const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
const sourceSnapshot=Object.fromEntries(['js/plugins/Arena_Battle.js','data/ArenaBattle.json','data/Map007.json','js/plugins.js'].map(p=>[p,require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
(async()=>{const out='doc/evidencias/m01-10/cobertura';fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[],cases=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.ArenaBattle&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
await page.evaluate(()=>{window.motionTrace={};for(const [klass,kind] of [[Sprite_Actor,'actor'],[Sprite_Enemy,'enemy']]){const f=klass.prototype.updateFrame;klass.prototype.updateFrame=function(){f.apply(this,arguments);if(this._arenaState){const k=kind+'.'+this._arenaState;motionTrace[k]=motionTrace[k]||[];if(!motionTrace[k].includes(this._arenaFrame))motionTrace[k].push(this._arenaFrame);}};}});
  async function key(k){await page.keyboard.press(k,{delay:100});await page.waitForTimeout(140);}
  async function ready(){
   for(let i=0;i<220;i++){
    const s=await page.evaluate(()=>{const s=SceneManager._scene;if(s instanceof Scene_Gameover)return'gameover';if(s instanceof Scene_Map&&!s.isBusy())return'map';if(s instanceof Scene_Battle){if(s._messageWindow.pause&&s._messageWindow._waitCount===0)return'message';if(s._partyCommandWindow.isOpenAndActive())return'party';if(s._actorCommandWindow.isOpenAndActive())return'actor';}return'wait';});
    if(s==='message')await key('Enter');else if(s==='party')await page.evaluate(()=>{SceneManager._scene._partyCommandWindow.selectSymbol('fight');SceneManager._scene._partyCommandWindow.processOk();});else if(s!=='wait')return s;
    await page.waitForTimeout(100);
   }throw Error('battle did not reach input/end: '+JSON.stringify(await page.evaluate(()=>({phase:BattleManager._phase,errors:Graphics._errorPrinter.innerHTML,log:SceneManager._scene._logWindow&&SceneManager._scene._logWindow._methods}))));
  }
  async function choose(kind,id){
   assert.equal(await ready(),'actor');
   await page.evaluate(({kind,id})=>{const s=SceneManager._scene,w=s._actorCommandWindow;w.selectSymbol(kind);if(kind==='skill')w.selectExt($dataSkills[id].stypeId);w.processOk();if(kind==='skill'){s._skillWindow.select(s._skillWindow._data.findIndex(v=>v.id===id));s._skillWindow.processOk();}if(kind==='item'){s._itemWindow.select(s._itemWindow._data.findIndex(v=>v.id===id));s._itemWindow.processOk();}if(s._enemyWindow.active){s._enemyWindow.select(0);s._enemyWindow.processOk();}if(s._actorWindow.active){s._actorWindow.select(0);s._actorWindow.processOk();}}, {kind,id});
   await page.waitForTimeout(150);return ready();
  }


const samples=[];
for(const race of ['breton','dark_elf','redguard'])for(const [troop,x,y] of [[1,7,6],[2,6,9],[3,10,9]])for(const skill of [5,6]){
 await page.evaluate(race=>ArenaBattle.startLab(race,'female'),race);await page.waitForFunction(()=>$gameMap.mapId()===7&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager._scene.isBusy()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());await page.evaluate(({x,y})=>{ArenaBattle.prepare();$gamePlayer.locate(x,y);$gamePlayer.setDirection(8);Math.random=()=>0.5;$dataSkills.forEach(s=>{if(s)s.damage.variance=0;});},{x,y});await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());await ready();
 let turns=0,state='actor';const start=Date.now();while(state==='actor'&&turns<12){state=await choose('skill',skill);turns++;}assert.equal(state,'map');const result=await page.evaluate(()=>({resources:ArenaResources.snapshot(),hp:$gameActors.actor(1).hp,level:$gameActors.actor(1).level}));samples.push({race,troop,skill,turns,elapsedMs:Date.now()-start,...result});console.log('PASS comparison '+race+'/'+troop+'/'+skill+'/'+turns+' turns');
}
assert.deepEqual(errors,[]);fs.writeFileSync('doc/evidencias/m01-10/comparacao-encontros.json',JSON.stringify({sourceSnapshot,browser:await browser.version(),fixture:'Level1 dagger, variance0, RNG0.5; actual native Scene_Battle. No numeric balancing changes.',samples,errors},null,2)+'\n');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
