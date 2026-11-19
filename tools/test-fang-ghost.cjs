// Disposable Chrome profile; the existing RAM contracts, no personal saves.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright'),video=require('./battle-video.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-fang-ghost');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const base=f=>JSON.parse(cp.execFileSync('git',['show','34bb70c:'+f],{cwd:root,encoding:'utf8',maxBuffer:30e6}));
const cfg=read('data/ArenaGhost.json'),id=cfg.encounters.entries[0].id;
fs.mkdirSync(out,{recursive:true});
for(const n of ['Map008','Map009','Map010','Map011','Map012','Map013','Map015','Map016','Map017','Map018','MapInfos','Items','Weapons','Armors','Skills','ArenaRecovery','ArenaCampaign','ArenaFangCells'])assert.deepEqual(read('data/'+n+'.json'),base('data/'+n+'.json'),n);
for(const n of ['Enemies','Troops']){const old=base('data/'+n+'.json');assert.deepEqual(read('data/'+n+'.json').slice(0,old.length),old);assert.equal(read('data/'+n+'.json').length,old.length+1);}
for(const n of ['ArenaBattle','ArenaBattleMotion','ArenaLoot']){const v=read('data/'+n+'.json');delete v.enemies[cfg.enemyId];assert.deepEqual(v,base('data/'+n+'.json'),n);}
const generated=['Enemies','Troops','ArenaBattle','ArenaBattleMotion','ArenaLoot','ArenaCampaign','ArenaGhost','Map013','Map017','Items'];
const before=generated.map(n=>read('data/'+n+'.json'));
cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:root});
generated.forEach((n,i)=>assert.deepEqual(read('data/'+n+'.json'),before[i],'rebuild '+n));
const cov=read('doc/mapas/FANG_COBERTURA_M02.json').levels[0],source=cov.encounters.find(e=>e.item===43);
assert.deepEqual(source.original,[3,49]);assert.equal(source.resource,'GHOST.DFA');assert.equal(source.flat,58);assert.equal(source.status,'pending');
const ghostMV=[3+3*(99-3),3+3*49],map=read('data/Map013.json');assert.equal(map.data[(5*map.height+ghostMV[1])*map.width+ghostMV[0]],1);
const fingerprint=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const assets=Object.fromEntries(['art/masters/fang-ghost-v01/battle-source.png','art/masters/fang-ghost-v01/walk-source.png','img/enemies/Arena_Combat_ghost_v01.png','img/characters/$Arena_ghost_float_v01.png'].map(f=>[f,fingerprint(f)]));
(async()=>{let b;try{
 b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1050,height:850}}),errors=[],missing=[],checks=[];
 p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});p.setDefaultTimeout(25000);
 const ctl=require('./battle-test-controls.cjs')(p);
 const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
 const title=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const core=()=>p.evaluate(()=>({q1:ArenaQuests.snapshot('MQ01'),q2:ArenaQuests.snapshot('MQ02'),gold:$gameParty.gold(),exp:$gameActors.actor(1).currentExp(),items:$gameParty._items,attributes:ArenaAttributes.snapshot(),resources:ArenaResources.snapshot(),position:[$gamePlayer.x,$gamePlayer.y],loot:ArenaLoot.snapshot(),enemies:ArenaPersistence.snapshot().enemies}));
 async function start(){await p.goto('http://127.0.0.1:8774/');await title();await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaDebugHub');w.processOk();});await p.waitForFunction(()=>SceneManager._scene._categories?.active);await p.evaluate(()=>{const w=SceneManager._scene._categories;w.selectSymbol('combat');w.processOk();});await p.waitForFunction(()=>SceneManager._scene._entries.active);await p.evaluate(()=>{const w=SceneManager._scene._entries;w.selectSymbol('arenaGhost');w.processOk();});await ready();}
 async function contact(){await p.evaluate(()=>{$gameMap.event(1)._locked=true;});for(let i=0;i<60;i++){const d=await p.evaluate(()=>SceneManager._scene instanceof Scene_Battle?-1:$gamePlayer.findDirectionTo($gameMap.event(1).x,$gameMap.event(1).y));if(d===-1)break;if(d)await p.keyboard.press({2:'ArrowDown',4:'ArrowLeft',6:'ArrowRight',8:'ArrowUp'}[d],{delay:80});await p.waitForTimeout(100);}await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging());assert.equal(await ctl.ready(),'actor');}
 await start();assert.equal(await p.evaluate(()=>ArenaGhost.active()&&ArenaContinuation.labActive()),true);assert.equal(await p.evaluate(()=>DataManager.saveGame(19)),false);
 assert.equal(await p.evaluate(()=>$gameMap.events().length),1);assert.equal(await p.evaluate(()=>ArenaEncounters.currentConfiguration().config.entries.length),1);
 assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);
 checks.push('Clean boot, native hub routing, one isolated specimen, normal saves blocked and storage empty');
 const initial=await core();
 await p.evaluate(()=>{window.ghostTrace={directions:{},steps:[],motions:{},damage:[],uses:[]};const update=Game_Event.prototype.update;Game_Event.prototype.update=function(){update.apply(this,arguments);if(this._mapId===16&&this.eventId()===1&&this.isMoving()){const d=this.direction();ghostTrace.directions[d]=ghostTrace.directions[d]||[];if(!ghostTrace.directions[d].includes(this.pattern()))ghostTrace.directions[d].push(this.pattern());ghostTrace.steps.push({x:this.x,y:this.y,region:$gameMap.regionId(this.x,this.y),distance:$gameMap.distance(this.x,this.y,9,6)});}};
 const u=Sprite_Enemy.prototype.update;Sprite_Enemy.prototype.update=function(){u.apply(this,arguments);const s=this._arenaMotionSample;if(this._battler&&this._battler.enemyId()===11&&s){ghostTrace.motions[s.key]=ghostTrace.motions[s.key]||[];if(!ghostTrace.motions[s.key].includes(s.index))ghostTrace.motions[s.key].push(s.index);}};
 const hit=Game_Action.prototype.executeDamage;Game_Action.prototype.executeDamage=function(target,value){ghostTrace.damage.push({actor:target.isActor(),value});return hit.apply(this,arguments);};const use=Game_Battler.prototype.useItem;Game_Battler.prototype.useItem=function(item){if(this.isActor())ghostTrace.uses.push(item.id);return use.apply(this,arguments);};$gameMap.event(1)._locked=true;});
 const collisions=await p.evaluate(()=>{const e=$gameMap.event(1),results=[];for(const [x,y,d] of [[8,5,4],[12,6,6],[9,3,8]]){e.locate(x,y);results.push(e.canPass(x,y,d));}e.locate(9,6);return results;});assert(collisions.every(v=>!v));
 await video.start(p);
 for(const d of [2,4,8,6]){await p.evaluate(d=>$gameMap.event(1).moveStraight(d),d);await p.waitForFunction(()=>!$gameMap.event(1).isMoving());await p.waitForTimeout(250);}
 await p.evaluate(()=>$gameMap.event(1)._locked=false);await p.waitForTimeout(4500);
 const traceWalk=await p.evaluate(()=>ghostTrace);for(const d of [2,4,6,8])assert.deepEqual(traceWalk.directions[d].slice().sort(),[0,1,2]);assert(traceWalk.steps.every(v=>v.region===4&&v.distance<=3));
 await p.locator('#GameCanvas').screenshot({path:path.join(out,'patrulha.png')});
 checks.push('Four authored directions and three phases observed; floating movement, genuine patrol and native wall/pool/radius collision');
 await p.evaluate(()=>$gameMap.event(1)._locked=true);assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);const saved=await core();
 await p.evaluate(()=>{$gameMap.event(1).locate(9,6);$gameActors.actor(1).setMp(0);});assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();assert.deepEqual(await core(),saved);
 checks.push('RAM save/load restores specimen, actor and quest/point state without normal slots');
 await contact();assert.equal(await p.evaluate(id=>ArenaEncounters.start(id),id),false);assert.equal(await p.evaluate(()=>$gameTroop.members()[0].enemyId()),11);
 await p.evaluate(()=>Math.random=()=>.5);await p.waitForTimeout(2100);await p.locator('#GameCanvas').screenshot({path:path.join(out,'combate.png')});
 const vigor=await p.evaluate(()=>ArenaResources.snapshot().vigor.current);
 assert.equal(await ctl.choose('guard'),'actor');assert.equal(await ctl.choose('attack'),'actor');let end=await ctl.choose('skill',6),extra=0;while(end==='actor'&&extra++<7)end=await ctl.choose('attack');assert.equal(end,'map');await ready();
 await video.stop(p,path.join(out,'fantasma-patrulha-combate-normal.webm'));
 const victory=await core(),trace=await p.evaluate(()=>ghostTrace);assert(victory.enemies[id].defeated);assert.equal(await p.evaluate(()=>$gameMap.event(1)._erased),true);
 for(const key of ['q1','q2','gold','exp','items','attributes'])assert.deepEqual(victory[key],initial[key]);assert.equal(Object.keys(victory.loot.receipts).length,1);
 assert.equal(vigor-await p.evaluate(()=>ArenaResources.snapshot().vigor.current),12);assert.equal(trace.uses.filter(n=>n===6).length,1);
 for(const key of ['idle','strike','hurt','defeat'])assert.deepEqual(trace.motions[key].slice().sort(),[0,1,2,3],key);
 assert.equal(trace.damage.filter(d=>!d.actor).length,trace.uses.filter(n=>n!==2).length);
 await p.evaluate(()=>{BattleManager.gainRewards();BattleManager.processVictory();});assert.deepEqual(await core(),victory);
 checks.push('Native contact once, all four battle motions/four frames, attack and technique damage/cost once, victory/return, one empty technical receipt and no duplicated grant');
 assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);await p.evaluate(()=>$gameMap.event(1)._erased=false);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();assert.deepEqual(await core(),victory);assert.equal(await p.evaluate(()=>$gameMap.event(1)._erased),true);
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();assert.equal(await p.evaluate(()=>ArenaGhost.active()),false);assert.equal(await p.evaluate(()=>ArenaCampaignConfig.forMap(16).ok),false);
 assert.equal(await p.evaluate(()=>new Game_Enemy(11,0,0).exp()),100);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);
 checks.push('Defeat/receipt survive RAM load; leaving restores campaign config and provisional EXP100, no storage written');
 await start();await contact();await p.evaluate(()=>{Math.random=()=>.5;$gameActors.actor(1).setHp(1);});assert.equal(await ctl.choose('guard'),'gameover');
 checks.push('Fresh fixture resets specimen; native defeat remains game over');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({base:'34bb70c',browser:b.version(),url:'http://127.0.0.1:8774/',assets,checks,collisions,trace,errors,missing,sourcePosition:[3,49],projectedPosition:ghostMV,campaignPositionEnabled:false,reason:'Original chamber absent from connected dry-floor projection; crossing MAP1 walls/dry pit at (6,49)/(7,49) not demonstrated. No route invented.',recording:'Native canvas30fps, normal engine speed. Controlled direction demonstration, natural patrol, keyboard contact and normal battle with RNG0.5; separate1HP fixture tests defeat.',pending:['Owner visual evaluation at next integrated test','Original chamber access, then stable campaign encounter fang.1.enemy.mif3.49','Spell Drain/seeing invisible/flight physics not implemented; no new mechanic','No balance approval or full gameplay retest']},null,2)+'\n');console.log('PASS Ghost',checks.length,'groups');
 }finally{if(b)await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
