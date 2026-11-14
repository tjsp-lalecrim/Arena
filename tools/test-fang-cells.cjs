// Fang Lair campaign: disposable Chrome origin/profile, real MV event/choice processing.
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process'),assert=require('assert/strict'),{chromium}=require('playwright');
const R=path.resolve(__dirname,'..'),out=path.join(R,'doc/evidencias/m02-fang-tharn'),read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8')),base=f=>JSON.parse(cp.execFileSync('git',['show','4d7e2df:'+f],{cwd:R,encoding:'utf8',maxBuffer:20e6}));
const c=read('data/ArenaFangCells.json'),map=read('data/Map013.json');
const staff=c.lower.staffPiece,items=read('data/Items.json');
assert.deepEqual(items.slice(0,staff.itemId),base('data/Items.json'));
assert.equal(items[staff.itemId].itypeId,2);assert.equal(items[staff.itemId].occasion,3);
assert.equal(items[staff.itemId].consumable,false);assert.equal(items[staff.itemId].price,0);
for(const n of ['Map008','Map009','Map010','Map011','Map012','Weapons','Armors','Skills','Enemies','Troops','ArenaLoot','ArenaRecovery'])assert.deepEqual(read('data/'+n+'.json'),base('data/'+n+'.json'),n);
const stable=['Items','Map008','Map009','Map010','Map011','Map012','Map013','Map017','MapInfos','ArenaCampaign','ArenaRecovery'],before=stable.map(n=>JSON.stringify(read('data/'+n+'.json')));cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:R});stable.forEach((n,i)=>assert.equal(JSON.stringify(read('data/'+n+'.json')),before[i],'rebuild '+n));
for(const g of c.gates){assert.equal(map.events[g.eventId].x,g.origin[0]);assert.deepEqual(g.origin,[3+(99-g.sourceOriginal[0])*3,3+g.sourceOriginal[1]*3]);}
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.css':'text/css','.ttf':'font/ttf'},server=http.createServer((req,res)=>{const u=decodeURIComponent(new URL(req.url,'http://test').pathname),f=path.resolve(R,'.'+(u==='/'?'/index.html':u));if(!f.startsWith(R+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(e?'':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let b;try{
 b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1050,height:850}}),errors=[],missing=[],checks=[];p.setDefaultTimeout(18000);p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 const title=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
 const press=async key=>{await p.keyboard.press(key,{delay:90});await p.waitForTimeout(180);};
 async function messages(untilChoice=false){for(let n=0;n<180;n++){const s=await p.evaluate(()=>{const w=SceneManager._scene._messageWindow;if(w?._textState)w._showFast=true;const choice=SceneManager._scene._choiceListWindow||w?._choiceWindow;return{busy:$gameMessage.isBusy(),running:$gameMap.isEventRunning(),pause:w?.pause,wait:w?._waitCount,choice:choice?.isOpenAndActive(),neutral:choice?._arenaCourtAwaitNeutral};});if(untilChoice&&s.choice&&!s.neutral)return;if(!untilChoice&&!s.busy&&!s.running)return;if(s.pause&&!s.wait&&!s.choice)await press('Enter');else await p.waitForTimeout(80);}throw Error('Message/choice timeout');}
 const snapshot=()=>p.evaluate(()=>({q:ArenaQuests.snapshot('MQ02'),count:$gameParty.numItems($dataItems[8]),source:ArenaPersistence.sourceStatus('fang.cell2.key')}));
 const reachable=()=>p.evaluate(()=>{const todo=[[$gamePlayer.x,$gamePlayer.y]],seen=new Set([todo[0].join(',')]);for(let n=0;n<todo.length;n++){const[x,y]=todo[n];for(const d of [2,4,6,8]){const nx=$gameMap.roundXWithDirection(x,d),ny=$gameMap.roundYWithDirection(y,d),k=nx+','+ny;if(!seen.has(k)&&$gamePlayer.canPass(x,y,d)){seen.add(k);todo.push([nx,ny]);}}}return{entry:seen.has($arenaFangCells.entry.join(',')),key:seen.has($arenaFangCells.key.join(',')),limit:seen.has($arenaFangCells.limit.join(',')),spiders:$arenaFangCells.spiders.map(v=>!!$gameMap.event(v.eventId).page()&&!$gameMap.event(v.eventId)._erased)};});
 async function walk(target){const route=await p.evaluate(target=>{const todo=[[$gamePlayer.x,$gamePlayer.y,[]]],seen=new Set([todo[0].slice(0,2).join(',')]);for(let n=0;n<todo.length;n++){const[x,y,route]=todo[n];if(x===target[0]&&y===target[1])return route;for(const d of [2,4,6,8]){const nx=$gameMap.roundXWithDirection(x,d),ny=$gameMap.roundYWithDirection(y,d),k=nx+','+ny;if(!seen.has(k)&&$gamePlayer.canPass(x,y,d)){seen.add(k);todo.push([nx,ny,route.concat(d)]);}}}return null;},target);assert(route,'No native path to '+target);await p.evaluate(route=>route.forEach(d=>{$gamePlayer.moveStraight(d);while($gamePlayer.isMoving())$gamePlayer.updateMove();}),route);await p.waitForTimeout(200);}
 async function riddle(index){await walk(c.riddle);await p.evaluate(()=>$gamePlayer.setDirection(2));await press('Enter');await messages(true);await p.evaluate(index=>{const w=SceneManager._scene._messageWindow._choiceWindow;w.select(index);},index);await press('Enter');await messages();await ready();}
 const raw=()=>p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));
 async function load(slot){
  await p.reload();await title();
  assert.equal(await p.evaluate(slot=>DataManager.loadGame(slot),slot),true);
  await p.evaluate(()=>{$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});
  await ready();
 }
 async function save(slot){
  assert.equal(await p.evaluate(slot=>{$gameSystem.onBeforeSave();return DataManager.saveGame(slot);},slot),true);
 }
 async function select(index){
  await messages(true);
  await p.evaluate(index=>SceneManager._scene._messageWindow._choiceWindow.select(index),index);
  await press('Enter');
 }
 async function travel(index){
  await walk(await p.evaluate(()=>{const e=$gameMap.event(3);return[e.x,e.y];}));
  await p.evaluate(()=>$gamePlayer.setDirection(8));
  await press('Enter');await select(index);
 }
 await p.goto('http://127.0.0.1:'+server.address().port+'/');
 await title();
 await p.evaluate(()=>ArenaCourtDelivery.preview());
 await p.waitForFunction(()=>$gameMap.mapId()===11&&!$gamePlayer.isTransferring());await ready();
 const fixture=await raw();
 await p.evaluate(()=>ArenaContinuation.leaveLab());await title();
 await p.evaluate(text=>{DataManager.extractSaveContents(JsonEx.parse(text));SceneManager.goto(Scene_Map);},fixture);await ready();
 assert.equal(await p.evaluate(()=>ArenaContinuation.labActive()),false);
 assert.equal(await p.evaluate(()=>ArenaCourtDelivery.destination().available),false);
 await walk([8,6]);await p.evaluate(()=>$gamePlayer.setDirection(8));await press('Enter');await select(0);await messages();await ready();
 assert.equal(await p.evaluate(()=>ArenaCourtDelivery.destination().available),true);
 assert.equal(await p.evaluate(()=>$gameParty.numItems($dataItems[7])),0);
 await walk([8,10]);await press('ArrowDown');await p.waitForFunction(()=>$gameMap.mapId()===9&&!$gamePlayer.isTransferring());await ready();
 await travel(2);await ready();assert.equal(await p.evaluate(()=>$gameMap.mapId()),9);
 await travel(0);await p.waitForFunction(()=>$gameMap.mapId()===13&&!$gamePlayer.isTransferring());await ready();
 assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),c.entry);
 await walk([c.arrivalText[0],c.arrivalText[1]-1]);await press('ArrowDown');await p.waitForFunction(()=>$gameMessage.isBusy());await messages();await ready();
 assert.equal((await snapshot()).q.objectives.fangEntryRead,true);
 await walk([c.cellsEntry[0],c.cellsEntry[1]-1]);await press('ArrowDown');await p.waitForFunction(()=>$gameMessage.isBusy());await messages();await ready();
 assert.equal((await snapshot()).q.objectives.fangCellsSeen,true);
 let s=await snapshot();assert.equal(s.q.stage,60);assert.equal(s.count,0);assert.equal(s.q.completed,false);
 assert.deepEqual(await reachable(),{entry:true,key:false,limit:false,spiders:[false,false,false,false]});
 checks.push('Native parchment delivery, travel cancel, travel to the dragon gate, text events and connected route to the cells');
 console.log('PASS viagem e circulação');
 await riddle(3);assert.deepEqual(await snapshot(),s);checks.push('Native riddle cancel leaves stage 60, key and gates unchanged');
 await riddle(0);s=await snapshot();assert.equal(s.q.stage,60);assert.equal(s.q.objectives.fangSpidersReleased,true);assert.equal(s.count,0);
 assert.deepEqual((await reachable()).spiders,[true,true,true,true]);
 const wrong=JSON.stringify(s.q);await riddle(2);assert.equal(JSON.stringify((await snapshot()).q),wrong);
 const enemy=await p.evaluate(()=>{
  $arenaFangCells.spiders.forEach(v=>$gameMap.event(v.eventId)._locked=true);
  const v=$arenaFangCells.spiders[0],e=$gameMap.event(v.eventId);e.locate(...v.origin);
  return {x:e.x,y:e.y,id:v.id,eventId:v.eventId};
 });
 await walk([enemy.x,enemy.y-1]);await press('ArrowDown');
 await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
 await p.evaluate(()=>{$gameTroop.members().forEach(e=>e.gainHp(-e.hp));BattleManager.processVictory();});
 assert.equal(await require('./battle-test-controls.cjs')(p).ready(),'map');await ready();
 assert.equal(await p.evaluate(id=>ArenaPersistence.snapshot().enemies[id].defeated,enemy.id),true);
 await save(15);await load(15);
 assert.deepEqual((await reachable()).spiders,[false,true,true,true]);
 const loot=await p.evaluate(()=>ArenaLoot.snapshot());
 await riddle(0);assert.deepEqual((await reachable()).spiders,[false,true,true,true]);
 assert.deepEqual(await p.evaluate(()=>ArenaLoot.snapshot()),loot);
 checks.push('Wrong choice activates four original spiders, native battle defeats one, reload and repeated error preserve independent defeats and loot');
 console.log('PASS erro, aranhas e save');
 await riddle(1);s=await snapshot();assert.equal(s.q.stage,70);assert.equal(s.count,0);assert.equal(s.source.active,true);assert.equal((await reachable()).key,true);assert.equal((await reachable()).limit,false);await walk(c.key);await press('Enter');await messages();await ready();assert.equal((await snapshot()).count,1);await press('Enter');await messages();assert.equal((await snapshot()).count,1);
 // The source can restore a lost key only before the portal consumes it.
 await p.evaluate(()=>$gameParty.loseItem($dataItems[8],1));await press('Enter');await messages();
 assert.equal((await snapshot()).count,1);
 await save(16);await load(16);
 assert.equal((await snapshot()).count,1);assert.equal((await snapshot()).q.stage,70);
 await walk(c.riddle);await p.evaluate(()=>$gamePlayer.setDirection(2));await press('Enter');await messages();await ready();
 s=await snapshot();assert.equal(s.q.stage,80);assert.equal(s.count,0);assert.equal(s.source.active,false);
 assert.equal(s.q.receipts['MQ02.fang.lower-door'].quantity,1);assert.equal(s.q.completed,false);
 assert.equal((await reachable()).limit,true);
 await walk(c.limit);
 await save(17);await load(17);assert.deepEqual(await snapshot(),s);
 await walk(c.entry);await press('Enter');await p.waitForFunction(()=>$gameMap.mapId()===9&&!$gamePlayer.isTransferring());await ready();
 await travel(0);await p.waitForFunction(()=>$gameMap.mapId()===13&&!$gamePlayer.isTransferring());await ready();
 assert.deepEqual(await snapshot(),s);assert.deepEqual((await reachable()).spiders,[false,true,true,true]);
 const oldMap=base('data/Map013.json');
 await p.evaluate(oldMap=>{
  const current=$dataMap;
  try{$dataMap=oldMap;$gameMap.setup(13);$gamePlayer.locate(33,48);}
  finally{$dataMap=current;}
 },oldMap);
 await save(18);await load(18);
 assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),c.entry);
 assert.deepEqual(await snapshot(),s);assert.deepEqual((await reachable()).spiders,[false,true,true,true]);
 checks.push('Legacy Map013 save resumes at the mine entrance and preserves portal receipt and independent spider defeat');
 checks.push('Correct answer, one key, recovery while needed, save before consumption, portal receipt, save after consumption and return to Rihad/reentry');
 const lower=c.lower;
 const mapId=()=>p.evaluate(()=>$gameMap.mapId());
 const position=()=>p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]);
 const tilePassable=([x,y])=>p.evaluate(([x,y])=>$gameMap.isPassable(x,y,2),[x,y]);
 async function stairs(at,to,direction){
  await walk(at);await p.evaluate(direction=>$gamePlayer.setDirection(direction),direction);await press('Enter');
  await p.waitForFunction(to=>$gameMap.mapId()===to&&!$gamePlayer.isTransferring(),to);
  await ready();
 }
 await stairs(c.limit,lower.mapId,2);assert.deepEqual(await position(),lower.entry);
 await stairs(lower.stair,c.mapId,2);assert.deepEqual(await position(),lower.return);
 assert.deepEqual(await snapshot(),s);
 await stairs(c.limit,lower.mapId,2);
 console.log('PASS descida e retorno');
 const skeleton=await p.evaluate(()=>{
  const e=ArenaEncounters.currentConfiguration().config.entries[0],event=$gameMap.event(e.eventId);
  event._locked=true;event.locate(...e.origin);
  return {id:e.id,origin:e.origin};
 });
 await walk([skeleton.origin[0]-1,skeleton.origin[1]]);await press('ArrowRight');
 await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive());
 await p.evaluate(()=>{$gameTroop.members().forEach(e=>e.gainHp(-e.hp));BattleManager.processVictory();});
 assert.equal(await require('./battle-test-controls.cjs')(p).ready(),'map');await ready();
 assert.equal(await p.evaluate(id=>ArenaPersistence.snapshot().enemies[id].defeated,skeleton.id),true);
 assert.deepEqual(await snapshot(),s);
 await walk(lower.approach);
 assert.equal(await tilePassable(lower.door),false);
 assert.equal(await p.evaluate(([x,y])=>[2,4,6,8].some(d=>$gamePlayer.canPass(x,y,d)),lower.door),false);
 async function askLower(index){
  await p.evaluate(()=>$gamePlayer.setDirection(2));
  await press('Enter');
  if(index===null){await messages(true);await press('Escape');}
  else await select(index);
  await messages();await ready();
 }
 await askLower(0);assert.deepEqual(await snapshot(),s);
 await askLower(null);assert.deepEqual(await snapshot(),s);
 assert.equal(await tilePassable(lower.door),false);
 await askLower(1);
 const solved=await snapshot();
 assert.equal(solved.q.stage,90);assert.equal(solved.q.objectives.fangLowerExplored,true);
 assert.deepEqual(solved.q.receipts,s.q.receipts);assert.equal(solved.count,0);
 assert.equal(await tilePassable(lower.door),true);
 const savedPosition=await position();
 await save(19);await load(19);
 assert.deepEqual(await position(),savedPosition);assert.deepEqual(await snapshot(),solved);
 assert.equal(await tilePassable(lower.door),true);
 await p.evaluate(()=>$gamePlayer.setDirection(2));await press('Enter');await messages();await ready();
 assert.deepEqual(await snapshot(),solved);
 const oldLower=JSON.parse(cp.execFileSync('git',['show','9d89eae:data/Map017.json'],{cwd:R,encoding:'utf8',maxBuffer:20e6}));
 await p.evaluate(oldMap=>{
  const current=$dataMap;
  try{$dataMap=oldMap;$gameMap.setup(17);}
  finally{$dataMap=current;}
 },oldLower);
 await save(20);await load(20);
 assert.deepEqual(await position(),savedPosition);assert.deepEqual(await snapshot(),solved);
 assert.equal(await p.evaluate(id=>!!$gameMap.event(id),staff.eventId),true);
 await walk(lower.door);
 assert.equal(await mapId(),lower.mapId);
 await walk(staff.position);
 const staffState=()=>p.evaluate(({itemId,sourceId})=>{
  const persistent=ArenaPersistence.snapshot(),quest=ArenaQuests.snapshot('MQ02');
  return {quest,count:$gameParty.numItems($dataItems[itemId]),mq01:persistent.quests.MQ01,
   grants:persistent.sources[sourceId]?.grants||0,loot:ArenaLoot.snapshot(),
   journal:MVJournalModel.entry($arenaQuestJournal.quests.find(q=>q.id==='MQ02'),quest)};
 },staff);
 const beforeStaff=await staffState();assert.equal(beforeStaff.count,0);
 assert.equal(beforeStaff.journal.steps.find(s=>s.id==='fang-staff-piece').done,false);
 await save(21);await load(21);assert.deepEqual(await staffState(),beforeStaff);
 await press('Enter');await p.waitForFunction(()=>$gameMessage.isBusy());
 const message=await p.evaluate(()=>{
  const w=SceneManager._scene._messageWindow;
  return {text:$gameMessage.allText().replace(/\s+/g,' '),face:$gameMessage.faceName(),width:w.width,screen:Graphics.boxWidth};
 });
 assert.deepEqual(message,{text:staff.text[0],face:'',width:message.screen,screen:message.screen});
 await messages();await ready();
 const collected=await staffState();
 assert.equal(collected.count,1);assert.equal(collected.grants,1);assert.equal(collected.quest.stage,100);
 assert.equal(collected.quest.objectives.fangStaffPieceRecovered,true);assert.equal(collected.quest.completed,false);
 assert.deepEqual(collected.quest.receipts,solved.q.receipts);
 assert.deepEqual(collected.mq01,beforeStaff.mq01);assert.deepEqual(collected.loot,beforeStaff.loot);
 assert.equal(collected.journal.steps.find(s=>s.id==='fang-staff-piece').done,true);
 assert.equal(collected.journal.steps.find(s=>s.id==='fang-retaliation').done,false);
 await press('Enter');await ready();assert.deepEqual(await staffState(),collected);
 await save(22);await load(22);assert.deepEqual(await position(),staff.position);
 await press('Enter');await ready();assert.deepEqual(await staffState(),collected);
 // Simulate a missing item in the disposable fixture, not a second quest completion.
 await p.evaluate(id=>$gameParty.loseItem($dataItems[id],1),staff.itemId);
 await press('Enter');await ready();
 const recovered={...collected,grants:2};assert.deepEqual(await staffState(),recovered);
 await stairs(lower.stair,c.mapId,2);await stairs(c.limit,lower.mapId,2);
 assert.deepEqual(await staffState(),recovered);
 assert.equal(await p.evaluate(id=>ArenaPersistence.snapshot().enemies[id].defeated,skeleton.id),true);
 await stairs(lower.stair,c.mapId,2);
 await walk(c.entry);
 await save(23);await load(23);assert.deepEqual(await staffState(),recovered);
 await p.evaluate(id=>$gameParty.loseItem($dataItems[id],1),staff.itemId);
 await press('Enter');await p.waitForFunction(()=>$gameMessage.isBusy());
 const text=()=>p.evaluate(()=>$gameMessage.allText().replace(/\s+/g,' '));
 assert.equal(await text(),c.retaliation.missing);
 await messages();await ready();
 assert.equal((await staffState()).quest.objectives.fangTharnVisionRead,undefined);
 assert.equal(await mapId(),c.mapId);
 await load(23);
 await press('Enter');
 const displayed=()=>p.evaluate(()=>{
  const w=SceneManager._scene._messageWindow;
  return {text:$gameMessage.allText().replace(/\s+/g,' '),face:$gameMessage.faceName(),width:w.width,screen:Graphics.boxWidth};
 });
 const pages=[];
 while(pages.length<8){
  await p.waitForFunction(()=>SceneManager._scene._messageWindow._textState||SceneManager._scene._messageWindow.pause);
  const page=await displayed();
  if(page.text===c.retaliation.pending)break;
  assert.equal(page.face,'');assert.equal(page.width,page.screen);
  assert.deepEqual(await staffState(),recovered);
  pages.push(page.text);
  await p.evaluate(()=>{SceneManager._scene._messageWindow._showFast=true;});
  await p.waitForFunction(()=>SceneManager._scene._messageWindow.pause&&SceneManager._scene._messageWindow._waitCount===0);
  await press('Enter');
 }
 assert.equal(await text(),c.retaliation.pending);
 assert.equal(pages.join(' '),c.retaliation.blocks.map(block=>block.text).join(' '));
 await messages();await ready();
 assert.equal(await mapId(),c.mapId);
 assert.deepEqual(await position(),c.entry);
 const visionRead=await staffState();
 assert.deepEqual(visionRead.quest,{...recovered.quest,objectives:{...recovered.quest.objectives,fangTharnVisionRead:true}});
 assert.equal(visionRead.count,1);assert.equal(visionRead.grants,recovered.grants);
 assert.deepEqual(visionRead.loot,recovered.loot);assert.deepEqual(visionRead.mq01,recovered.mq01);
 assert.equal(visionRead.journal.steps.find(s=>s.id==='fang-tharn-vision').done,true);
 assert.equal(visionRead.journal.steps.find(s=>s.id==='fang-retaliation').done,false);
 await save(24);await load(24);assert.deepEqual(await staffState(),visionRead);
 assert.deepEqual(await position(),c.entry);
 await press('Enter');await p.waitForFunction(()=>$gameMessage.isBusy());
 assert.equal(await text(),c.retaliation.pending);
 await messages();await ready();assert.deepEqual(await staffState(),visionRead);
 assert.equal(await mapId(),c.mapId);
 await stairs(c.limit,lower.mapId,2);await stairs(lower.stair,c.mapId,2);
 assert.deepEqual(await staffState(),visionRead);
 checks.push('Stage 100 exit requires the fragment; two full-width Tharn blocks leave state unchanged until acknowledged');
 checks.push('The post-vision save resumes at the mine exit without replay, victory, loot or transfer; return to the stairs remains open');
 checks.push('Bidirectional stairs preserve the first portal receipt; the original route skeleton uses the existing encounter and remains defeated');
 checks.push('Second riddle wrong and Escape preserve the closed door; correct advances once to 90 and persists through save and reentry');
 checks.push('Legacy Map017 save rebuilds events in place with the door and prior defeats preserved');
 checks.push('Native collection and full-width PT-BR text grant one protected fragment, advance MQ02 to 100 and update the journal without completing the quest');
 checks.push('Save/load before and after the pickup, repeat interaction, recovery without replay, and return to the stairs preserve state and the prior receipts');
 console.log('PASS sala do fragmento, diário, save e retorno');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({base:'60b96d3',browser:b.version(),canvas:[816,624],checks,errors,missing,scope:'Real MV choices, action events, native passability BFS and accelerated walks; disposable origin/profile, RAM and synthetic normal save only',pending:['Manual Chrome campaign evaluation','Remaining wings, Hell Hounds, visual direction, servant identity and combat, victory and safe return']},null,2)+'\n');console.log('PASS Fang cells: '+checks.length+' groups; preservation and stable full reconstruction');
 }finally{if(b)await b.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
