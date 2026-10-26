/* Historical R04 probes. Current approved P01-P08 are tested by test-approved-races.cjs. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const priorConfig=JSON.parse(execFileSync('git',['show','1399af8:data/ArenaCharacterVisuals.json'],{encoding:'utf8'}));
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const before=process.argv.includes('--record-before-fix');
 const out=process.env.ARENA_EVIDENCE_DIR||'tmp/racial-audit-r04';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[];
  for(const path of ['js/plugins/MV_CharacterRules.js','js/plugins/Arena_CharacterCreation.js','data/ArenaCatalog.json','data/ArenaCharacterVisuals.json']){
   const body=execFileSync('git',['show','1dd9a6c:'+path],{encoding:'utf8'});
   await page.route('**/'+path,r=>r.fulfill({contentType:path.endsWith('.json')?'application/json':'application/javascript',body}));
  }
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await page.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');
  await page.waitForFunction(()=>window.SceneManager&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive());
  await page.evaluate(()=>DataManager.loadMapData(4));await page.waitForFunction(()=>DataManager.isMapLoaded());
  if(before)await page.evaluate(v=>{$arenaCharacterVisuals.rules=v.rules;},priorConfig);
  const result=await page.evaluate(()=>{
   const rows=[],levels=[1,3,4,6,12,30,99];
   // Isolated calculation fixtures: no balance/data file changes, no real encounter.
   $dataSkills.forEach(s=>{if(s)s.damage.variance=0;});
   function setup(race){DataManager.setupNewGame();$gameMap.setup(4);$gamePlayer.clearTransferInfo();ArenaCharacterCreation.confirmCurrent({name:'Auditoria',raceId:race,genderId:'male'});return $gameActors.actor(1);}
   function action(actor,id){const a=new Game_Action(actor);a.setSkill(id);return a;}
   for(const race of $arenaCharacterCatalog.races){
    const actor=setup(race.id),enemy=new Game_Enemy(1,0,0);$gameTroop._enemies=[enemy];
    $gameParty.gainItem($dataWeapons[2],1);actor.changeEquip(0,$dataWeapons[2]);
    const samples=[];
    for(const level of levels){
     actor.changeLevel(level,false);const a=action(actor,1),unarmed=action(actor,3),unarmedHeavy=action(actor,4),heavy=action(actor,8);
     const raw=Math.max(1,actor.atk*2-enemy.def);
     samples.push({level,atk:actor.atk,agi:actor.agi,nativeHit:actor.hit,rawAttack:raw,formulaAttack:a.evalDamageFormula(enemy),damage:a.makeDamageValue(enemy,false),critical:a.makeDamageValue(enemy,true),itemHit:a.itemHit(enemy),forcedUnarmedFormula:unarmed.evalDamageFormula(enemy),forcedUnarmedBonus:unarmed.evalDamageFormula(enemy)-raw,forcedUnarmedHeavyBonus:unarmedHeavy.evalDamageFormula(enemy)-Math.max(1,actor.atk*3-enemy.def),forcedUnarmedHit:unarmed.itemHit(enemy),forcedUnarmedHeavyHit:unarmedHeavy.itemHit(enemy),unarmedUsableInCurrentGame:actor.canUse($dataSkills[3]),heavyFormula:heavy.evalDamageFormula(enemy),heavyUsableInCurrentGame:actor.canUse($dataSkills[8])});
    }
    actor.changeLevel(6,false);actor.changeEquip(0,null);
    const bare=action(actor,1),bareRaw=Math.max(1,actor.atk*2-enemy.def);
    const source=new Game_Enemy(1,0,0);$gameTroop._enemies=[source];const magic=action(source,10);
    const weakMagic=magic.makeDamageValue(actor,false);source.addParam(4,20);
    const rawMagic=Math.max(1,source.mat*3-actor.mdf),strongMagic=magic.makeDamageValue(actor,false);
    const element=$dataSkills[10].damage.elementId;$dataSkills[10].damage.elementId=3;const cold=magic.makeDamageValue(actor,false);$dataSkills[10].damage.elementId=element;
    actor.addState(3);const paralysisApplied=actor.isStateAffected(3);actor.removeState(3);
    rows.push({race:race.id,label:race.bonusLabel,samples,unarmedAttackBonus:bare.evalDamageFormula(enemy)-bareRaw,bareSkill3Bonus:action(actor,3).evalDamageFormula(enemy)-bareRaw,bareSkill4Bonus:action(actor,4).evalDamageFormula(enemy)-Math.max(1,actor.atk*3-enemy.def),vigor:ArenaPersistence.snapshot().resources.vigor,weakMagic,rawMagic,strongMagic,syntheticColdDamage:cold,coldElementRate:actor.elementRate(3),paralysisApplied,bowGroupIds:$arenaCharacterVisuals.rules.bowWeaponTypeIds});
   }
   return {rows,weaponSkillIds:$arenaCharacterVisuals.rules.weaponSkillIds,fixtures:'variance0; actual sword2/rat1; enemy MAT+20 and fire->cold only as in-memory probes, not gameplay content',actorParameters:'class curve is constant through99; no progress feature implemented'};
  });
  assert.equal(result.rows.length,8);
  for(const row of result.rows){
   assert.equal(row.unarmedAttackBonus,0);assert.equal(row.bareSkill3Bonus,0);assert.equal(row.bareSkill4Bonus,0);assert.equal(row.vigor.maximum,row.race==='argonian'?110:100);
   assert.equal(row.paralysisApplied,row.race!=='high_elf');assert.equal(row.coldElementRate,row.race==='nord'?.5:1);
   assert.equal(row.weakMagic,1);assert.equal(row.strongMagic,row.race==='breton'?Math.round(row.rawMagic*.5):row.rawMagic);
   for(const s of row.samples){
    const bonus=row.race==='redguard'?Math.floor(s.level/3):row.race==='dark_elf'?Math.floor(s.level/4):0;
    assert.equal(s.formulaAttack-s.rawAttack,bonus);assert.equal(s.damage,s.rawAttack+bonus);assert.equal(s.critical,3*(s.rawAttack+bonus));
    assert(Math.abs(s.itemHit-Math.min(1,.95+bonus/100))<1e-9);
    assert.equal(s.forcedUnarmedBonus,before?bonus:0);assert.equal(s.forcedUnarmedHeavyBonus,before?bonus:0);
    assert(Math.abs(s.forcedUnarmedHit-Math.min(1,.95+(before?bonus:0)/100))<1e-9);assert.equal(s.forcedUnarmedHit,s.forcedUnarmedHeavyHit);
    assert.equal(s.unarmedUsableInCurrentGame,false);assert.equal(s.heavyUsableInCurrentGame,false);
    assert.equal(s.agi,row.race==='khajiit'?11:10);
   }
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${out}/${before?'antes-correcao':'depois-correcao'}.json`,JSON.stringify({date:'2026-10-26',browser:await browser.version(),historicalComposition:'R04 plugin/catalog composition1dd9a6c; not current approved R05',beforeTechnicalFix:before,historicalRulesFixture:before?'1399af8 rules loaded in isolated memory; plugin code unchanged':null,...result,errors,isolation:'disposable Chrome context; no personal saves',proposalsApplied:false,editor:'not tested; historical browser calculations only'},null,2));
  console.log('PASS historical R04:8 races ×7 levels; damage/hit/critical/AGI/resources/resistance/immunity; armed unarmed-skill '+(before?'bug reproduced':'regression fixed')+'. Current R05 approvals are tested separately.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
