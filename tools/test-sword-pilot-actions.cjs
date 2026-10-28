// Focused native actions; default approved sword, ARENA_PILOT_WEAPON=dagger selects dagger only.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright'),video=require('./battle-video.cjs');
(async()=>{
 const dagger=process.env.ARENA_PILOT_WEAPON==='dagger',weaponId=dagger?1:2,baseCommit=dagger?'112246d':'4b49e5d';
 const phase=process.env.ARENA_SWORD_PHASE||'after',root=dagger?'doc/evidencias/adaga-piloto-r01':'doc/evidencias/arma-piloto-r02',out=root+'/'+phase;
 const commands=dagger?[['attack',1],['skill',5],['skill',6],['guard',2]]:[['attack',1],['skill',7],['guard',2]];
 const motionKeys=dagger?['idle','light','heavy','hurt']:['idle','light','hurt'];
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(phase==='before')await page.route('**/data/ArenaBattleMotion.json',route=>route.fulfill({body:cp.execFileSync('git',['show',baseCommit+':data/ArenaBattleMotion.json']),contentType:'application/json'}));
  await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8767');await page.waitForFunction(()=>window.ArenaBattle&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaBattle');w.processOk();});
  await page.waitForFunction(()=>SceneManager._scene._profiles&&SceneManager._scene.isActive());
  await page.evaluate(symbol=>{const w=SceneManager._scene._profiles;w.selectSymbol(symbol);w.processOk();},dagger?'daggerPilot':'weaponPilot');
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
  const {ready,choose}=require('./battle-test-controls.cjs')(page);assert.equal(await ready(),'actor');
  await page.evaluate(()=>{const a=$gameActors.actor(1);window.pilotInitial={identity:ArenaPersistence.identity().baseVisualId,weapon:a.weapons()[0].id,vigor:ArenaResources.snapshot().vigor.current,enemyHp:$gameTroop.members()[0].hp};});
  const initial=await page.evaluate(()=>pilotInitial);assert.equal(initial.identity,'breton.female.base');assert.equal(initial.weapon,weaponId);assert.equal(initial.vigor,100);assert.equal(initial.enemyHp,500);
  await page.evaluate(keys=>{
   window.probeKeys=keys;
   Math.random=()=>.5;$dataSkills.forEach(s=>{if(s)s.damage.variance=0;});
   window.swordProbe={frames:{},uses:[],effects:[]};
   const use=Game_Battler.prototype.useItem;Game_Battler.prototype.useItem=function(item){if(this.isActor())swordProbe.uses.push(item.id);return use.apply(this,arguments);};
   const apply=Game_Action.prototype.apply;Game_Action.prototype.apply=function(target){const ret=apply.apply(this,arguments);if(this.subject().isActor())swordProbe.effects.push({skill:this.item().id,damage:target.result().hpDamage,missed:target.result().missed,evaded:target.result().evaded});return ret;};
   const render=SceneManager.renderScene;SceneManager.renderScene=function(){render.apply(this,arguments);const scene=this._scene,s=scene._spriteset&&scene._spriteset._actorSprites&&scene._spriteset._actorSprites[0];if(!s||!s._arenaMotionSample||!s._arenaHeldWeapon)return;
    const f=s._arenaMotionSample,w=s._arenaHeldWeapon,c=s._arenaGripCover,k=f.key+'.'+f.index;
    if(probeKeys.includes(f.key)&&!swordProbe.frames[k])swordProbe.frames[k]={sample:JSON.parse(JSON.stringify(f)),position:[s.x,s.y],home:[s._homeX,s._homeY],weapon:[w.x,w.y,w.rotation,w.scale.x,w.scale.y],visible:w.visible,plane:s.getChildIndex(w)>s.getChildIndex(s._mainSprite)?'front':'back',cover:!!(c&&c.visible),coverAbove:!!(c&&s.getChildIndex(c)>s.getChildIndex(w)),image:Graphics._canvas.toDataURL()};
   };
  },motionKeys);
  if(phase==='after')await video.start(page);await page.waitForTimeout(700);
  const actions=[];
  for(const [command,id] of commands){
   const before=await page.evaluate(()=>({v:ArenaResources.snapshot().vigor.current,hp:$gameTroop.members()[0].hp}));
   assert.equal(await choose(command,id),'actor');
   const after=await page.evaluate(()=>({v:ArenaResources.snapshot().vigor.current,hp:$gameTroop.members()[0].hp,atRest:ArenaBattleMotion.sample($gameActors.actor(1)).key==='idle'}));
   assert.equal(before.v-after.v,[5,7].includes(id)?5:id===6?12:0);assert.equal(before.hp-after.hp,id===2?0:id===6?34:dagger?22:24);assert.equal(after.atRest,true);actions.push({command,id,before,after});
  }
  await page.waitForTimeout(500);if(phase==='after')await video.stop(page,out+(dagger?'/breta-adaga-acoes.webm':'/breta-espada-acoes.webm'));
  const trace=await page.evaluate(()=>swordProbe);
  for(const [key,f] of Object.entries(trace.frames)){fs.writeFileSync(out+'/'+key+'.png',Buffer.from(f.image.split(',')[1],'base64'));delete f.image;}
  assert.deepEqual(trace.uses,commands.map(c=>c[1]));assert.deepEqual(trace.effects.map(e=>[e.skill,e.damage]),dagger?[[1,22],[5,22],[6,34],[2,0]]:[[1,24],[7,24],[2,0]]);
  for(const key of motionKeys)assert.deepEqual(Object.keys(trace.frames).filter(k=>k.startsWith(key+'.')).sort(),[0,1,2,3,4,5].map(i=>key+'.'+i));
  if(phase==='after'){
   const old=JSON.parse(fs.readFileSync(root+'/before/resultado.json'));assert.deepEqual(actions,old.actions);assert.deepEqual(trace.effects,old.trace.effects);
   for(const [key,f] of Object.entries(trace.frames))if(key.startsWith('idle.')||key.startsWith('light.')||(dagger&&key.startsWith('heavy.'))){assert.equal(f.cover,true,key);assert.equal(f.coverAbove,true,key);assert.equal(f.plane,'front',key);assert.deepEqual(f.weapon.slice(3),[-1,1]);assert.equal(f.sample.total,old.trace.frames[key].sample.total);assert.deepEqual(f.position,f.home);}
   const config=JSON.parse(fs.readFileSync('data/ArenaBattleMotion.json')),approved=JSON.parse(cp.execFileSync('git',['show','112246d:data/ArenaBattleMotion.json'],{encoding:'utf8'}));
   assert.deepEqual(config.weaponPoses['breton.female.base']['2'],approved.weaponPoses['breton.female.base']['2']);
   delete config.weaponPoses['breton.female.base']['1'];assert.deepEqual(config,approved);
  }
  assert.deepEqual(errors,[]);const files=['data/ArenaBattleMotion.json','js/plugins/Arena_BattleMotion.js','js/plugins/Arena_BattleUI.js','img/sv_actors/Arena_Combat_breton_female_r02.png','img/pictures/Arena_weapon_'+(dagger?'dagger':'sword')+'_r02.png'];
  const inputs=Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(phase==='before'&&f.startsWith('data/')?cp.execFileSync('git',['show',baseCommit+':'+f]):fs.readFileSync(f)).digest('hex')]));
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await browser.version(),identity:'breton.female.base',weaponId,initial,scope:'Native commands listed in actions only; deterministic random/variance in isolated browser storage; no personal saves',actions,trace,inputs,errors,editor:'not executed',physicalPhone:'not executed'},null,2)+'\n');
  console.log('PASS focused '+(dagger?'dagger:22/22/34/0 damage;0/5/12/0 Vigor':'sword:24/24/0 damage;0/5/0 Vigor')+'; approved sword preserved; '+phase);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
