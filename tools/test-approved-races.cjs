/* P01-P08 approved provisional contract. All synthetic combat data stays in memory. */
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-07-fechamento';fs.mkdirSync(out,{recursive:true});
 const approval=JSON.parse(fs.readFileSync('doc/decisoes/M01_07_APROVACAO_R05.json','utf8'));
 const catalog=JSON.parse(fs.readFileSync('data/ArenaCatalog.json','utf8'));
 assert.deepEqual(catalog.races.map(({id,bonus,bonusLabel,application})=>({id,bonus,bonusLabel,application})),approval.races);
 const pure={};vm.runInNewContext(fs.readFileSync('js/plugins/MV_CharacterRules.js','utf8'),pure);
 assert.equal(pure.MVCharacterRules.initialResource({kind:'initialResourceAdd',resourceId:'vigor',value:10},'vigor',100),110);
 assert.equal(pure.MVCharacterRules.initialResource({kind:'initialResourceAdd',resourceId:'vigor',value:10},'mana',50),50);
 assert.equal(pure.MVCharacterRules.parameterBonus({kind:'parameterAdd',paramId:6,value:1},6),1);
 assert.equal(pure.MVCharacterRules.parameterBonus({kind:'parameterAdd',paramId:6,value:1},2),0);
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const ctx=await browser.newContext({viewport:{width:1100,height:800}}),errors=[];
  function monitor(p){p.on('pageerror',e=>errors.push(e.message));p.on('requestfailed',r=>errors.push(r.url()));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});}
  const url=process.env.ARENA_URL||'http://127.0.0.1:8766/';
  async function boot(p){monitor(p);await p.goto(url);await p.waitForFunction(()=>window.SceneManager&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());await p.evaluate(()=>DataManager.loadMapData(4));await p.waitForFunction(()=>DataManager.isMapLoaded());}
  // Generate REAL native saves under the preceding plugin/catalog composition.
  const old=await ctx.newPage();
  for(const path of ['js/plugins/MV_CharacterRules.js','js/plugins/Arena_CharacterCreation.js','data/ArenaCatalog.json']){
   const body=execFileSync('git',['show','1dd9a6c:'+path],{encoding:'utf8'});
   await old.route('**/'+path,r=>r.fulfill({contentType:path.endsWith('.json')?'application/json':'application/javascript',body}));
  }
  await boot(old);
  const oldSaves=await old.evaluate(()=>{
   return $arenaCharacterCatalog.races.map((r,i)=>{
    DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();
    ArenaCharacterCreation.confirmCurrent({name:'Legado '+r.id,raceId:r.id,genderId:'female'});
    const a=$gameActors.actor(1);a.changeLevel(12,false);a.addParam(6,20);a.setHp(41);
    $gameParty.gainItem($dataWeapons[2],1);a.changeEquip(0,$dataWeapons[2]);
    ArenaPersistence.setResource('vigor',37,150);
    if(!DataManager.saveGame(i+1))throw Error('old-native-save');
    return {race:r.id,slot:i+1,agi:a.agi,vigor:ArenaPersistence.snapshot().resources.vigor};
   });
  });
  await old.close();const page=await ctx.newPage();await boot(page);
  const result=await page.evaluate(oldSaves=>{
   const checks=[],matrix=[],legacy=[];function check(x,s){if(!x)throw Error(s);checks.push(s);}
   const A=ArenaCharacterCreation,rate=id=>id==='dark_elf'?1.05:id==='redguard'?1.08:1,hit=id=>id==='dark_elf'?.02:id==='redguard'?.03:id==='wood_elf'?.04:0;
   function action(a,id){const v=new Game_Action(a);v.setSkill(id);return v;}
   const skillBackup=JSON.stringify($dataSkills),weaponBackup=JSON.stringify($dataWeapons),enemyBackup=JSON.stringify($dataEnemies),classBackup=JSON.stringify($dataClasses),rulesBackup=JSON.stringify($arenaCharacterVisuals.rules);
   try{
    $dataSkills.forEach(s=>{if(s)s.damage.variance=0;});
    for(const s of oldSaves){
     check(DataManager.loadGame(s.slot),'legacy-load-'+s.race);const a=$gameActors.actor(1),r=ArenaPersistence.snapshot().resources.vigor;
     check(r.current===37&&r.maximum===150,'legacy-resource-preserved-'+s.race);
     check(a.agi===30+(s.race==='khajiit'?1:0)&&a._paramPlus[6]===20,'legacy-derived-agi-no-stale-trait-'+s.race);
     check(!A.confirmCurrent({name:'Duplicado',raceId:s.race,genderId:'female'}),'legacy-no-regrant-'+s.race);
     const enemy=new Game_Enemy(1,0,0);$gameTroop._enemies=[enemy];const attack=action(a,1);
     check(Math.abs(attack.evalDamageFormula(enemy)-24*rate(s.race))<1e-9,'legacy-new-rule-no-level-stack-'+s.race);
     check(DataManager.saveGame(s.slot)&&DataManager.loadGame(s.slot),'legacy-resave-roundtrip-'+s.race);
     check(ArenaPersistence.snapshot().resources.vigor.maximum===150,'legacy-cap-no-plus10-'+s.race);
     legacy.push({race:s.race,oldAgi:s.agi,newAgi:$gameActors.actor(1).agi,vigor:ArenaPersistence.snapshot().resources.vigor});
    }
    for(const r of $arenaCharacterCatalog.races)for(const gender of $arenaCharacterCatalog.genders){
     const tag=r.id+'-'+gender.id;DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();
     check(A.confirmCurrent({name:'Teste '+r.id,raceId:r.id,genderId:gender.id}),'new-'+tag);
     const actor=$gameActors.actor(1),enemy=new Game_Enemy(1,0,0);$gameTroop._enemies=[enemy];
     check(actor.agi===10+(r.id==='khajiit'?1:0)&&actor._paramPlus[6]===0,'agi-derived-only-'+tag);
     check(ArenaPersistence.snapshot().resources.vigor.maximum===(r.id==='argonian'?110:100),'initial-vigor-'+tag);
     check(actor.isStateResist(3)===(r.id==='high_elf'),'paralysis-only-'+tag);
     check([1,2].every(i=>actor.canEquip($dataWeapons[i])&&actor.canEquip($dataArmors[i])),'no-racial-equipment-lock-'+tag);
     $gameParty.gainItem($dataWeapons[2],1);actor.changeEquip(0,$dataWeapons[2]);
     const levels=[];
     for(const level of [1,3,6,12,30,99]){
      actor.changeLevel(level,false);const attack=action(actor,1),value=attack.evalDamageFormula(enemy);
      check(Math.abs(value-24*rate(r.id))<1e-9,'rate-level-'+tag+'-'+level);
      check(attack.makeDamageValue(enemy,false)===Math.round(24*rate(r.id)),'rounded-damage-'+tag+'-'+level);
      check(attack.makeDamageValue(enemy,true)===Math.round(24*rate(r.id)*3),'critical-order-'+tag+'-'+level);
      check(Math.abs(attack.itemHit(enemy)-(.95+hit(r.id)))<1e-9,'hit-level-'+tag+'-'+level);
      check(actor.agi===10+(r.id==='khajiit'?1:0),'no-level-agi-grant-'+tag+'-'+level);
      levels.push({level,formula:value,damage:attack.makeDamageValue(enemy,false),itemHit:attack.itemHit(enemy),agi:actor.agi});
     }
     check(action(actor,3).evalDamageFormula(enemy)===24&&action(actor,4).evalDamageFormula(enemy)===37,'no-unarmed-tech-bonus-'+tag);
     check(action(actor,5).evalDamageFormula(enemy)===24,'wrong-weapon-type-neutral-'+tag);
     check(Math.abs(action(actor,7).evalDamageFormula(enemy)-24*rate(r.id))<1e-9,'valid-weapon-type-'+tag);
     const spell=action(actor,10);check(spell.evalDamageFormula(enemy)===22&&spell.itemHit(enemy)===1,'magic-no-weapon-bonus-'+tag);
     const item=new Game_Action(actor);item.setItem(2);check(item.itemHit(enemy)===1,'item-no-weapon-hit-'+tag);
     actor.changeEquip(0,null);check(action(actor,1).evalDamageFormula(enemy)===18&&action(actor,1).itemHit(enemy)===.95,'bare-attack-neutral-'+tag);
     const source=new Game_Enemy(1,0,0);source.addParam(4,20);$gameTroop._enemies=[source];
     const magic=action(source,10),base=55;
     for(const type of [1,2,5,6]){
      $dataSkills[10].damage.type=type;$dataSkills[10].damage.elementId=2;
      check(magic.makeDamageValue(actor,false)===Math.round(base*(r.id==='breton'?.75:1)),'magic-positive-type-'+tag+'-'+type);
      $dataSkills[10].damage.elementId=3;
      check(magic.makeDamageValue(actor,false)===Math.round(base*(r.id==='breton'?.75:r.id==='nord'?.5:1)),'cold-type-'+tag+'-'+type);
     }
     $dataSkills[10].damage.type=1;$dataSkills[10].damage.elementId=2;
     const heal=action(actor,9);$dataSkills[9].damage.elementId=3;$dataSkills[9].hitType=2;
     for(const type of [3,4]){$dataSkills[9].damage.type=type;check(heal.makeDamageValue(actor,false)===-33,'cold-magic-healing-preserved-'+tag+'-'+type);}
     $dataSkills[9].damage.type=3;$dataSkills[9].damage.elementId=0;$dataSkills[9].hitType=0;
     ArenaPersistence.setResource('vigor',7,150);const state=JSON.stringify(ArenaPersistence.snapshot());
     check(!A.confirmCurrent({name:'De novo',raceId:r.id,genderId:gender.id}),'repeat-confirm-'+tag);
     for(let i=0;i<3;i++){check(DataManager.saveGame(10)&&DataManager.loadGame(10),'native-roundtrip-'+tag+'-'+i);$gameActors.actor(1).changeLevel(i?99:1,false);}
     check(JSON.stringify(ArenaPersistence.snapshot())===state,'state-no-growth-or-grant-'+tag);
     check($gameActors.actor(1)._paramPlus[6]===0&&$gameActors.actor(1).agi===10+(r.id==='khajiit'?1:0),'load-no-stored-racial-stat-'+tag);
     matrix.push({race:r.id,gender:gender.id,levels,vigorAfterRoundtrips:ArenaPersistence.snapshot().resources.vigor});
    }
    // Future growth is only a fixture; does not implement M01-08.
    DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();A.confirmCurrent({name:'Curva',raceId:'khajiit',genderId:'male'});
    $dataClasses[1].params[6][6]=30;$gameActors.actor(1).changeLevel(6,false);check($gameActors.actor(1).agi===31,'future-curve-flat-agi-not-five-percent');
    $gameActors.actor(1).addParam(6,2);check($gameActors.actor(1).agi===33,'native-progress-preserved-plus-one');
    // Synthetic ranged type verifies scope/cap/evasion, without adding a game item.
    $dataWeapons[2].wtypeId=9;$dataClasses[1].traits.push({code:51,dataId:9,value:1});
    $arenaCharacterVisuals.rules.bowWeaponTypeIds=[9];$dataClasses[1].traits.find(t=>t.code===22&&t.dataId===0).value=.99;
    for(const id of ['dark_elf','redguard','wood_elf']){
     DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();A.confirmCurrent({name:'Distância',raceId:id,genderId:'male'});
     const a=$gameActors.actor(1);$gameParty.gainItem($dataWeapons[2],1);a.changeEquip(0,$dataWeapons[2]);
     const e=new Game_Enemy(1,0,0);$gameTroop._enemies=[e];e.traitObjects=function(){return [{traits:[{code:22,dataId:1,value:.2}]}];};
     const attack=action(a,1);
     check(Math.abs(attack.evalDamageFormula(e)-24*(id==='dark_elf'?1.05:1))<1e-9,'ranged-damage-scope-'+id);
     check(attack.itemHit(e)===(id==='redguard'?.99:1),'ranged-hit-scope-cap-'+id);
     check(attack.itemEva(e)===.2,'native-evasion-not-bypassed-'+id);
    }
    DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();A.confirmCurrent({name:'Elementos',raceId:'nord',genderId:'male'});
    const nord=$gameActors.actor(1),caster=new Game_Enemy(1,0,0);$gameTroop._enemies=[caster];
    $dataEnemies[1].traits.push({code:31,dataId:3,value:1});$dataSkills[1].damage.elementId=-1;
    const mixed=action(caster,1);check(mixed.calcElementRate(nord)===.5,'cold-normal-attack');
    $dataEnemies[1].traits.push({code:31,dataId:2,value:1});check(mixed.calcElementRate(nord)===1,'native-max-over-mixed-elements-not-global-half');
   }finally{$dataSkills=JSON.parse(skillBackup);$dataWeapons=JSON.parse(weaponBackup);$dataEnemies=JSON.parse(enemyBackup);$dataClasses=JSON.parse(classBackup);$arenaCharacterVisuals.rules=JSON.parse(rulesBackup);}
   return {checks,matrix,legacy,scope:'Native MV calculation fixtures; no full battle/cost/progression implementation.'};
  },oldSaves);
  await page.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('newGame');w.processOk();});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaCharacterCreation&&SceneManager._scene.isActive());
  const labels=[];
  for(const race of catalog.races){
   const label=await page.evaluate(id=>{const s=SceneManager._scene;s._race.selectSymbol(id);s.refreshDraft();return {id,text:$arenaCharacterCatalog.races.find(r=>r.id===id).bonusLabel,width:s._info.contents.measureTextWidth($arenaCharacterCatalog.races.find(r=>r.id===id).bonusLabel),maxWidth:700,fontSize:s._info.contents.fontSize};},race.id);
   assert.equal(label.text,race.bonusLabel);assert(label.width<=700);labels.push(label);
   await page.waitForFunction(()=>ImageManager.isReady());await page.screenshot({path:`${out}/bonus-${race.id}.png`});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${out}/bonus-aprovados-result.json`,JSON.stringify({date:'2026-10-26',browser:await browser.version(),approvedVersion:catalog.balanceVersion,oldComposition:'1dd9a6c real plugin/catalog routes; native slots1-8 in disposable profile',...result,labels,errors,limitations:['No physical Galaxy A56','No full battle/cost/level progression balance validation','Screenshots are browser UI, not editor validation']},null,2));
  console.log(`PASS${result.checks.length} checks;16 identities,6 levels,8 actual legacy saves,repeat/roundtrip/no grants,approved labels.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
