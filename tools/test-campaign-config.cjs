// Synthetic contracts only; disposable Chrome origin/profile, no maps built or battles.
const fs=require('fs'),path=require('path'),http=require('http'),vm=require('vm'),cp=require('child_process'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-02b'),extension=JSON.parse(fs.readFileSync('data/ArenaCampaign.json'));
const q=JSON.parse(fs.readFileSync('data/ArenaQuests.json')),e=JSON.parse(fs.readFileSync('data/ArenaEncounters.json'));
const base={schemaVersion:1,quests:[{...q,id:q.questId}],areas:[{id:e.areaId,questId:q.questId,mapId:e.mapId,encounters:e}],sources:[{id:q.sourceId,questId:q.questId,areaId:e.areaId,itemId:q.itemId,quantity:1,stages:[10,20]}],receipts:[{id:q.receiptId,questId:q.questId,sourceId:q.sourceId,kind:'consume'}]};
const sandbox={};vm.runInNewContext(fs.readFileSync('js/plugins/MV_CampaignConfig.js','utf8'),sandbox);const R=sandbox.MVCampaignConfig;
let r=R.create(base,extension);assert.equal(r.lookup('quests','MQ02').ok,true);assert.equal(r.forMap(8).config.id,'imperial-dungeons');assert.equal(r.forMap(5).ok,false);assert.equal(r.lookup('sources','stonekeep.parchment').config.itemId,null);
for(const mutate of [b=>b.sources.push({...base.sources[0]}),b=>b.receipts.push({...base.receipts[0]}),b=>b.areas[0].mapId=8,b=>b.sources[0].questId='unknown',b=>b.quests[0].stages[0].next=999,b=>b.sources[0].itemId=1]){
 const b=JSON.parse(JSON.stringify(extension));mutate(b);const rejected=R.create(base,b);assert(rejected.diagnostics.length);assert.equal(rejected.lookup('quests','MQ01').ok,true);assert.equal(rejected.lookup('quests','MQ02').ok,false);
}
assert.equal(R.create(base,null).lookup('quests','MQ02').ok,false);
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.css':'text/css','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,f=path.resolve(root,'.'+decodeURIComponent(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(err,b)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});res.end(err?'':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 fs.mkdirSync(out,{recursive:true});browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext(),page=await context.newPage(),errors=[],checks=['Pure registry: unique sources/receipts/maps, quest/stage references, rejected extension atomic with MQ01 intact'];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port+'/';const title=()=>page.waitForFunction(()=>window.ArenaCampaignConfig&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive());
 await page.goto(url);await title();
 const initial=await page.evaluate(()=>{
  DataManager.setupNewGame();const before=JSON.stringify(ArenaPersistence.snapshot());
  const result={diagnostics:ArenaCampaignConfig.diagnostics(),q1:ArenaQuests.configuration('MQ01').config.questId,q2:ArenaQuests.configuration('MQ02').config.id,q2state:ArenaQuests.snapshot('MQ02'),area:ArenaCampaignConfig.forMap(8).config.id,unbound:ArenaEncounters.configuration('rihad'),unknown:ArenaQuests.configuration('absent'),unknownArea:ArenaEncounters.configuration('absent'),unknownSource:ArenaCampaignConfig.source('absent'),claim:ArenaPersistence.claimSource('stonekeep.parchment')};
  result.noMutation=before===JSON.stringify(ArenaPersistence.snapshot());result.nullQuest=ArenaQuests.configuration(null).ok;result.emptyQuest=ArenaQuests.configuration('').ok;result.nullArea=ArenaEncounters.configuration(null).ok;result.emptyArea=ArenaEncounters.configuration('').ok;return result;
 });assert.deepEqual(initial.diagnostics,[]);assert.equal(initial.q1,'MQ01');assert.equal(initial.q2,'MQ02');assert.equal(initial.area,'imperial-dungeons');assert.equal(initial.q2state.stage,0);assert.equal(initial.claim,'unbound');assert.equal(initial.unbound.code,'unbound_encounters');assert.equal(initial.unknown.ok,false);assert.equal(initial.unknownArea.ok,false);assert.equal(initial.unknownSource.ok,false);assert.equal(initial.noMutation,true);for(const key of ['nullQuest','emptyQuest','nullArea','emptyArea'])assert.equal(initial[key],false);
 checks.push('Production MQ02 contracts present but unbound; selection and absent lookups do not initialize quest, grant items, create areas or enable travel');
 // Bind ONLY this browser response to existing test items/maps, never change disk data.
 const synthetic=JSON.parse(JSON.stringify(extension));synthetic.sources.forEach((s,i)=>s.itemId=i+2);
 for(const [id,mapId] of [['rihad',5],['stonekeep',7]]){const a=synthetic.areas.find(a=>a.id===id);a.mapId=mapId;a.encounters={mapId,areaId:id,completionQuestId:'MQ02',mapVisuals:{},entries:[]};}
 synthetic.areas.find(a=>a.id==='rihad').encounters.entries=[{id:'rihad.test.common',questSpecific:false},{id:'rihad.test.specific',questSpecific:true}];
 await page.route('**/data/ArenaCampaign.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(synthetic)}));await page.reload();await title();
 const operations=await page.evaluate(()=>{
  const A=ArenaPersistence,checks=[];function ok(x,label){if(!x)throw Error(label);checks.push(label);}
  DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Configuração piloto',raceId:'breton',genderId:'female'});
  const a=$gameActors.actor(1);a.setHp(32);a.setMp(11);A.setResource('vigor',24,ArenaResources.snapshot().vigor.maximum);
  const unchanged=()=>JSON.stringify({actor:$gameActors,resources:ArenaResources.snapshot(),gold:$gameParty.gold()});const before=unchanged();
  const q1config=JSON.stringify(ArenaQuests.configuration().config);ok(q1config===JSON.stringify($arenaQuests),'MQ01 default configuration unchanged');
  ArenaQuests.begin();ok(A.claimSource('MQ01.ruby-key')==='granted','MQ01 source grant');ok(A.claimSource('MQ01.ruby-key')==='present','MQ01 repeated grant no duplicate');
  A.setQuest('MQ02',40,{},false);const mq1=JSON.stringify(A.snapshot().quests.MQ01);
  ok(A.claimSource('stonekeep.parchment')==='granted','MQ02 independent source grant');ok(A.claimSource('stonekeep.parchment')==='present','MQ02 repeated grant no duplicate');
  const n=$gameParty.numItems($dataItems[2]);ok(A.consumeImportant('stonekeep.parchment','MQ01.cell-door','deliver')==='incompatible-receipt','Wrong-quest receipt rejected');ok(n===$gameParty.numItems($dataItems[2]),'Rejected receipt did not consume');
  ok(A.consumeImportant('stonekeep.parchment','MQ02.rihad.parchment','deliver')==='consumed','MQ02 delivery consumed once');ok(A.consumeImportant('stonekeep.parchment','MQ02.rihad.parchment','deliver')==='duplicate','MQ02 duplicate delivery rejected');
  ok(A.claimSource('stonekeep.parchment')==='inactive','Delivered source retired');ok(mq1===JSON.stringify(A.snapshot().quests.MQ01),'MQ01 receipts/stage untouched by MQ02');
  ok(A.consumeImportant('MQ01.ruby-key','MQ01.cell-door','consume')==='consumed','MQ01 original receipt signature retained');A.setQuest('MQ01',30,{rubyKey:true,cellDoor:true},false);
  const mq1settled=JSON.stringify(A.snapshot().quests.MQ01),items=JSON.stringify($gameParty._items);A.setQuest('MQ02',70,{},false);ok(A.claimSource('fang.cell2.key')==='granted','Gold-key source distinct from parchment');
  ok(A.consumeImportant('fang.cell2.key','MQ02.rihad.parchment','consume')==='incompatible-receipt','Same-quest wrong-source receipt rejected');
  ok(A.consumeImportant('fang.cell2.key','MQ02.fang.lower-door','consume')==='consumed','Gold-key receipt consumed once');ok(items===JSON.stringify($gameParty._items),'Independent item quantities return to prior amounts');
  A.setQuest('MQ02',110,{},true);ok(A.claimSource('fang.staff-piece-1')==='granted','Explicit post-completion fragment requirement supported');ok(A.claimSource('fang.staff-piece-1')==='present','Fragment not duplicated');
  ok(A.claimSource('MQ01.ruby-key')==='inactive','MQ01 remains retired');ok(mq1settled===JSON.stringify(A.snapshot().quests.MQ01),'MQ01 unaffected by all MQ02 operations');
  ok(MVQuestRules.transition(ArenaQuests.configuration('MQ02').config.stages,40,50,{count:1,receipt:false},{count:1,receipt:false}),'Selected stage graph uses existing quest kernel');
  const mapId=$gameMap._mapId;$gameMap._mapId=5;ok(ArenaEncounters.currentConfiguration().config.areaId==='rihad','Map5 selects synthetic Rihad');$gameMap._mapId=7;ok(ArenaEncounters.currentConfiguration().config.areaId==='stonekeep','Map7 selects synthetic Stonekeep');$gameMap._mapId=999;ok(!ArenaEncounters.currentConfiguration().ok,'Unknown map does not fallback to MQ01');$gameMap._mapId=mapId;
  A.setArea('imperial-dungeons',true,2,3);A.setEnemy('imperial.enemy.01','imperial-dungeons',false,true,3);const old=JSON.stringify({a:A.snapshot().areas['imperial-dungeons'],e:A.snapshot().enemies['imperial.enemy.01']});
  A.setEnemy('rihad.test.common','rihad',false,true,0);A.setEnemy('rihad.test.specific','rihad',true,true,0);ArenaEncounters.completeArea('rihad');ArenaEncounters.onExit('rihad');
  ok(old===JSON.stringify({a:A.snapshot().areas['imperial-dungeons'],e:A.snapshot().enemies['imperial.enemy.01']}),'MQ01 area/enemy unaffected by selected-area exit');
  ok(!A.snapshot().enemies['rihad.test.common'].defeated&&A.snapshot().enemies['rihad.test.specific'].defeated,'Existing respawn kernel preserves quest-specific enemy');
  const all=JSON.stringify(A.snapshot());ok(ArenaEncounters.completeArea('missing')===false&&ArenaEncounters.onExit('missing')===false,'Missing area fails recoverably');ok(all===JSON.stringify(A.snapshot()),'Missing-area operations mutate nothing');
  ok(before===unchanged(),'No resource/actor/gold changes from selection and grants');
  const beforeSave=JSON.stringify(A.snapshot());$gameSystem.onBeforeSave();ok(DataManager.saveGame(12),'Synthetic native save');for(let i=0;i<3;i++){ok(DataManager.loadGame(12),'Synthetic native load');ok(beforeSave===JSON.stringify(A.snapshot()),'Persistent state unchanged across load');ok(A.claimSource('stonekeep.parchment')==='inactive','Delivered source not regranted after load');ok(A.claimSource('fang.staff-piece-1')==='present','Fragment not regranted after load');}
  return checks;
 });checks.push(...operations);
 for(const body of [{schemaVersion:1,quests:[],areas:[],sources:[],receipts:[]},{},(()=>{const b=JSON.parse(JSON.stringify(extension));b.sources.push({...base.sources[0]});return b;})()]){
  await page.unroute('**/data/ArenaCampaign.json');await page.route('**/data/ArenaCampaign.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(body)}));await page.reload();await title();const result=await page.evaluate(()=>{DataManager.setupNewGame();ArenaQuests.begin();return{mq1:ArenaPersistence.claimSource('MQ01.ruby-key'),mq2:ArenaQuests.configuration('MQ02').ok,diagnostics:ArenaCampaignConfig.diagnostics()};});assert.equal(result.mq1,'granted');assert.equal(result.mq2,false);
 }
 checks.push('Missing/invalid/colliding extension leaves MQ01 playable; no silent fallback to another quest or area');assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({browser:await browser.version(),initial,checks,errors,scope:'Synthetic JSON responses/items/maps in disposable browser only; no new maps/assets/battles or personal saves',manual:'not requested for internal contracts',editor:'not executed',phone:'not executed'},null,2)+'\n');console.log('PASS',checks.length,'configuration checks');
 await new Promise((resolve,reject)=>cp.execFile(process.execPath,['tools/test-quests.cjs'],{cwd:root,env:{...process.env,ARENA_URL:url,ARENA_EVIDENCE_DIR:path.join(out,'mq01-regressao')},maxBuffer:2e6},(err,stdout,stderr)=>{if(stdout)console.log(stdout.trim());if(err){console.error(stderr);reject(err);}else resolve();}));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
