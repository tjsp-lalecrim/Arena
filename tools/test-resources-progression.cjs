/* Real MV/Chrome, disposable context and native saves. No personal saves. */
const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-08';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1100,height:800}}),errors=[];
  function monitor(p){p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>errors.push(r.url()));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});}
  const url=process.env.ARENA_URL||'http://127.0.0.1:8766/';
  // Generate an actual R05 save with exactly the preceding plugin composition.
  const old=await context.newPage();monitor(old);
  const plugins=execFileSync('git',['show','e1be141:js/plugins.js'],{encoding:'utf8'});
  await old.route('**/js/plugins.js',r=>r.fulfill({contentType:'application/javascript',body:plugins}));
  const creation=execFileSync('git',['show','e1be141:js/plugins/Arena_CharacterCreation.js'],{encoding:'utf8'});
  await old.route('**/js/plugins/Arena_CharacterCreation.js',r=>r.fulfill({contentType:'application/javascript',body:creation}));
  await old.goto(url);await old.waitForFunction(()=>window.SceneManager&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive());
  await old.evaluate(()=>{DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Legado',raceId:'argonian',genderId:'female'});const a=$gameActors.actor(1);a.changeLevel(6,false);a.setHp(41);a.setMp(13);ArenaPersistence.setResource('vigor',37,150);if(!DataManager.saveGame(18))throw Error('legacy save');});
  await old.close();
  const page=await context.newPage();monitor(page);await page.goto(url);
  await page.waitForFunction(()=>window.ArenaResources&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive());
  const legacy=await page.evaluate(()=>{
   if(!DataManager.loadGame(18))throw Error('legacy load');
   let s=ArenaResources.snapshot();const first=JSON.stringify(s);
   for(let n=0;n<3;n++){DataManager.saveGame(18);DataManager.loadGame(18);if(JSON.stringify(ArenaResources.snapshot())!==first)throw Error('legacy repeated drift');}
   $gameActors.actor(1).changeLevel(7,false);return {snapshot:s,pending:ArenaResources.pending()};
  });
  assert.equal(legacy.snapshot.hp.current,41);assert.equal(legacy.snapshot.mp.current,13);assert.equal(legacy.snapshot.vigor.current,37);assert.equal(legacy.snapshot.vigor.maximum,150);assert.equal(legacy.snapshot.vigor.initialBonus,10);assert.deepEqual(legacy.snapshot.pending,[]);assert.deepEqual(legacy.pending,[7]);
  await page.evaluate(()=>DataManager.loadMapData(1));await page.waitForFunction(()=>DataManager.isMapLoaded());
  const result=await page.evaluate(()=>{
   const checks=[],races=[];
   function eq(a,b,label){if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+': '+JSON.stringify(a)+' != '+JSON.stringify(b));checks.push(label);}
   for(const r of $arenaCharacterCatalog.races){for(const gender of ['male','female']){
    DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Recurso '+gender,raceId:r.id,genderId:gender});
    const a=$gameActors.actor(1),bonus=r.id==='argonian'?10:0;
    let s=ArenaResources.snapshot();eq([a.hp,a.mhp,a.mp,a.mmp,s.vigor.current,s.vigor.maximum],[100,100,50,50,100+bonus,100+bonus],r.id+gender+' initial');
    a.setHp(43);a.setMp(11);ArenaPersistence.setResource('vigor',17,100+bonus);
    const spent=JSON.stringify(ArenaResources.snapshot());
    DataManager.saveGame(17);DataManager.loadGame(17);eq(JSON.stringify(ArenaResources.snapshot()),spent,'spent native save/load');
    const actor=$gameActors.actor(1);actor.changeLevel(2,false);eq(ArenaResources.pending(),[2],'one earned choice');
    eq(ArenaResources.choose(3,'hp'),false,'unearned rejected');eq(ArenaResources.choose(2,'bad'),false,'unknown rejected');
    eq(ArenaResources.choose(2,'hp'),true,'hp choice');eq(ArenaResources.choose(2,'hp'),false,'duplicate rejected');
    eq([actor.mhp,actor.hp,actor.mmp,actor.mp,ArenaResources.snapshot().vigor.current],[110,43,50,11,17],'increase does not heal');
    actor.changeLevel(5,false);eq(ArenaResources.pending(),[3,4,5],'multiple levels');
    ArenaResources.choose(3,'mp');ArenaResources.choose(4,'vigor');ArenaResources.choose(5,'vigor');
    s=ArenaResources.snapshot();eq([actor.mhp,actor.mmp,s.vigor.maximum,s.vigor.growth,s.vigor.current],[110,60,120+bonus,20,17],'flat growth independent of race');
    const chosen=JSON.stringify(s);for(let i=0;i<3;i++){DataManager.saveGame(17);DataManager.loadGame(17);eq(JSON.stringify(ArenaResources.snapshot()),chosen,'growth save/load '+i);}
    const b=$gameActors.actor(1);b.changeLevel(2,false);b.changeLevel(5,false);eq(ArenaResources.pending(),[],'down/up no duplicated entitlement');eq(ArenaResources.snapshot().hp.maximum,110,'down/up retains committed growth');
    eq(b.canPaySkillCost($dataSkills[5]),false,'map technique cannot spend');b.paySkillCost($dataSkills[5]);eq(ArenaResources.snapshot().vigor.current,17,'map direct payment guarded');
    // M01-09 now revalidates equipment in useItem; this resource probe equips its actual dagger.
    if(typeof ArenaAbilities!=='undefined'){$gameParty.gainItem($dataWeapons[1],1);b.changeEquip(0,$dataWeapons[1]);}
    $gameParty._inBattle=true;b.useItem($dataSkills[5]);eq(ArenaResources.snapshot().vigor.current,12,'one native use pays once');b.useItem($dataSkills[1]);eq(ArenaResources.snapshot().vigor.current,12,'basic attack free');
    ArenaPersistence.setResource('vigor',0,120+bonus);eq(b.canPaySkillCost($dataSkills[5]),false,'zero insufficient');b.paySkillCost($dataSkills[5]);eq(ArenaResources.snapshot().vigor.current,0,'cannot go negative');
    ArenaResources.recoverVigor(5);eq(b.canPaySkillCost($dataSkills[5]),true,'exact cost');b.useItem($dataSkills[5]);eq(ArenaResources.snapshot().vigor.current,0,'exact payment zero');
    // Native TP gains, regeneration and battle transitions must not alter Vigor.
    b.initTp();b.gainTp(50);b.gainSilentTp(20);b.onDamage(5);b.regenerateAll();b.onBattleEnd();$gameParty._inBattle=false;
    for(let i=0;i<12;i++)b.onPlayerWalk();eq(ArenaResources.snapshot().vigor.current,0,'no passive or TP-derived recovery');
    const potion=new Game_Action(b);potion.setItem(4);$gameParty.gainItem($dataItems[4],1);eq(b.canUse($dataItems[4]),true,'vigor potion enabled');
    b.useItem($dataItems[4]);potion.apply(b);eq([ArenaResources.snapshot().vigor.current,$gameParty.numItems($dataItems[4]),b.result().success],[50,0,true],'actual potion consumption/recovery');
    eq(ArenaResources.recoverVigor(9999),70+bonus,'clamp recovery at maximum');eq(ArenaResources.recoverVigor(1),0,'full no overflow');eq(b.canUse($dataItems[4]),false,'full map potion unavailable');
    let rejected=false;try{ArenaResources.recoverVigor(-1);}catch(e){rejected=true;}eq(rejected,true,'negative recovery rejected');
    b.setHp(0);b.setMp(0);ArenaPersistence.setResource('vigor',0,120+bonus);eq(ArenaResources.rest(),true,'bed rest');eq([b.hp,b.mp,ArenaResources.snapshot().vigor.current],[110,60,120+bonus],'rest fully restores all three, including dead technical actor');
    const rested=JSON.stringify(ArenaResources.snapshot());ArenaResources.rest();eq(JSON.stringify(ArenaResources.snapshot()),rested,'repeated bed no award or growth');
    b.setHp(1);let p=new Game_Action(b);p.setItem(2);p.apply(b);eq(b.hp,51,'hp potion partial');b.setMp(0);p.setItem(3);p.apply(b);eq(b.mp,25,'mp potion partial');
    $gameParty._inBattle=true;b.changeLevel(6,false);eq(ArenaResources.rest(),false,'no bed during battle');eq(ArenaResources.choose(6,'vigor'),false,'earned choice blocked during battle');eq(ArenaResources.pending(),[6],'battle leaves choice unspent');$gameParty._inBattle=false;
    const snapshot=ArenaResources.snapshot();races.push({race:r.id,gender,snapshot});
   }}
   // Native stat modifiers remain native, never baked into progression or reapplied.
   const a=$gameActors.actor(1),before=ArenaResources.snapshot();a.addParam(0,7);eq(ArenaResources.snapshot().hp.modifiers,7,'native modifier separate');
   DataManager.saveGame(17);DataManager.loadGame(17);eq(ArenaResources.snapshot().hp.maximum,before.hp.maximum+7,'modifier persists without doubling');
   DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Limite',raceId:'khajiit',genderId:'female'});
   const maxActor=$gameActors.actor(1);maxActor.changeLevel(99,false);eq(ArenaResources.pending().length,98,'all 98 level entitlements');
   ArenaResources.pending().forEach(level=>ArenaResources.choose(level,'mp'));
   eq(maxActor.mmp,1030,'maximum level MP choices not truncated by old 999 cap');
   eq(maxActor.agi,11,'racial AGI remains flat at max level');eq(ArenaResources.pending(),[],'no choice beyond native level cap');
   const configBase=Object.assign({},$arenaProgression.base);$arenaProgression.base={hp:120,mp:70,vigor:80};
   DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Configuração',raceId:'argonian',genderId:'male'});
   eq([ArenaResources.snapshot().hp.maximum,ArenaResources.snapshot().mp.maximum,ArenaResources.snapshot().vigor.maximum],[120,70,90],'balance configuration controls all initial maxima');$arenaProgression.base=configBase;
   DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'EXP',raceId:'breton',genderId:'female'});
   const xpActor=$gameActors.actor(1),oldCurve=$dataClasses[1].params[0][2];$dataClasses[1].params[0][2]=800;
   xpActor.changeExp(xpActor.expForLevel(2),false);eq(ArenaResources.pending(),[2],'native EXP awards level choice');
   eq(xpActor.mhp,100,'class curve cannot grow max HP');$dataClasses[1].params[0][2]=oldCurve;
   // No old resource/identity structure: explicit laboratory defaults, no inferred race.
   DataManager.setupNewGame();const c=DataManager.makeSaveContents();delete c.system._persistentState;DataManager.extractSaveContents(c);
   const missing=ArenaResources.snapshot();eq([missing.hp.maximum,missing.mp.maximum,missing.vigor.maximum],[100,50,100],'pre-state laboratory defaults');eq(ArenaPersistence.identity().raceId,null,'no invented old identity');
   return {checks,races,missing};
  });
  // Navigate actual minimal UI: choose -> cancel -> choose -> confirm -> leave.
  await page.evaluate(()=>{DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Evolução',raceId:'argonian',genderId:'male'});$gameActors.actor(1).changeLevel(4,false);DataManager.saveGame(17);DataManager.loadGame(17);if(ArenaResources.pending().join(',')!=='2,3,4')throw Error('pending save/load');ArenaResources.open();});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaResources&&SceneManager._scene.isActive());
  async function key(k){await page.keyboard.press(k,{delay:110});await page.waitForTimeout(220);}
  await page.screenshot({path:out+'/evolucao.png'});await key('Enter');
  await page.waitForFunction(()=>SceneManager._scene._confirm.active);
  await page.screenshot({path:out+'/confirmacao.png'});await key('Escape');
  assert.equal(await page.evaluate(()=>ArenaResources.pending().length),3);
  await key('ArrowDown');await key('Enter');await key('Enter');
  assert.equal(await page.evaluate(()=>ArenaResources.snapshot().mp.maximum),60);
  assert.equal(await page.evaluate(()=>ArenaResources.pending().length),2);
  await key('Escape');
  // Isolated technical map entry and existing maps/references remain separate.
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await page.evaluate(()=>SceneManager._scene._commandWindow.selectSymbol('arenaResourceLab'));
  await page.screenshot({path:out+'/titulo-laboratorio.png'});await key('Enter');
  await page.waitForFunction(()=>$gameMap.mapId()===5&&SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager._scene.isBusy());
  await page.screenshot({path:out+'/laboratorio.png'});
  assert.equal(await page.evaluate(()=>$gameMap.events().length),6);
  await page.evaluate(()=>{ArenaResources.snapshot();ArenaPersistence.setResource('vigor',0,100);$gameParty.gainItem($dataItems[4],1);SceneManager.push(Scene_Item);});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Item&&SceneManager._scene._categoryWindow.isOpenAndActive());
  await key('Enter');await key('Enter');await key('Enter');
  assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),50);
  assert.equal(await page.evaluate(()=>$gameParty.numItems($dataItems[4])),0);
  await page.screenshot({path:out+'/pocao-menu.png'});
  await page.evaluate(()=>SceneManager.goto(Scene_Map));
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!SceneManager._scene.isBusy());
  await key('ArrowRight');await key('ArrowUp');await key('Enter');
  await page.waitForFunction(()=>$gameMessage.isBusy());
  assert.deepEqual(await page.evaluate(()=>[$gameActors.actor(1).hp,$gameActors.actor(1).mp,ArenaResources.snapshot().vigor.current,$gameParty.inBattle()]),[70,35,45,false]);
  await page.waitForFunction(()=>SceneManager._scene._messageWindow.pause&&SceneManager._scene._messageWindow._waitCount===0);
  await key('Enter');await page.waitForFunction(()=>!$gameMessage.isBusy());
  for(let i=0;i<4;i++)await key('ArrowRight');await key('ArrowUp');await key('Enter');
  await page.waitForFunction(()=>$gameMessage.isBusy());
  assert.deepEqual(await page.evaluate(()=>[$gameActors.actor(1).hp,$gameActors.actor(1).mp,ArenaResources.snapshot().vigor.current]),[100,50,100]);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/resultado.json',JSON.stringify({composition:'M01-08/R01',browser:await browser.version(),viewport:[1100,800],game:[816,624],legacy,result,ui:['open','cancel-no-spend','confirm-mana','pending-preserved','leave','title-to-isolated-lab','native-item-menu-vigor-potion','keyboard-lab-controlled-cost','keyboard-lab-bed-recovery'],technicalMap:5,errors},null,2)+'\n');
  console.log('PASS '+result.checks.length+' resource checks;16 identities;R05 native legacy save;level choices/potions/rest/TP isolation/native persistence/UI. Combat balance and physical mobile remain pending.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
