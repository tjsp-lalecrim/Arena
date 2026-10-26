const fs=require('node:fs'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const {chromium}=require(process.env.ARENA_PLAYWRIGHT||'playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-09';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const ctx=await browser.newContext({viewport:{width:1100,height:800}}),errors=[];
  function monitor(p){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.url());});p.on('requestfailed',r=>errors.push(r.url()));}
  const url=process.env.ARENA_URL||'http://127.0.0.1:8766/';
  const old=await ctx.newPage();monitor(old);
  const previous=execFileSync('git',['show','2561830:js/plugins.js'],{encoding:'utf8'});
  await old.route('**/js/plugins.js',r=>r.fulfill({contentType:'application/javascript',body:previous}));
  await old.goto(url);await old.waitForFunction(()=>window.SceneManager&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  await old.evaluate(()=>{DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Anterior',raceId:'argonian',genderId:'female'});$gameActors.actor(1).learnSkill(9);$gameParty.gainItem($dataItems[5],2);ArenaPersistence.setResource('vigor',31,110);ArenaPersistence.setShortcut('oldTechnique',{kind:'skill',id:5});DataManager.saveGame(19);});await old.close();
  const page=await ctx.newPage();monitor(page);await page.goto(url);
  await page.waitForFunction(()=>window.ArenaAbilities&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
  const result=await page.evaluate(()=>{
   const checks=[],matrix=[];function eq(a,b,label){if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+': '+JSON.stringify(a)+' != '+JSON.stringify(b));checks.push(label);}
   DataManager.loadGame(19);eq([$gameActors.actor(1).isLearnedSkill(9),$gameParty.numItems($dataItems[5]),ArenaResources.snapshot().vigor.current],[true,2,31],'actual M01-08 save without new state');
   eq(ArenaPersistence.snapshot().hotbar.oldTechnique,null,'legacy incompatible shortcut invalidated on load');
   const rng=Math.random,variances=$dataSkills.map(s=>s&&s.damage.variance),hp=$dataEnemies[1].params[0];Math.random=()=>0.5;$dataSkills.filter(Boolean).forEach(s=>s.damage.variance=0);$dataEnemies[1].params[0]=1000;
   function actor(){return $gameActors.actor(1);}
   function fresh(race='breton',gender='female'){DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Técnica',raceId:race,genderId:gender});return actor();}
   function equip(id){const a=actor();if(id&&!a.hasWeapon($dataWeapons[id]))$gameParty.gainItem($dataWeapons[id],1);a.changeEquip(0,$dataWeapons[id]||null);}
   function action(id,force=false){const a=new Game_Action(actor(),force);a.setSkill(id);a.setTarget(0);return a;}
   function run(act,options={}){
    const a=actor();$gameParty._inBattle=true;$gameTroop.setup(1);if(options.multiple)$gameTroop._enemies.push(new Game_Enemy(1,0,0));
    if(options.enemy){$gameTroop._enemies=[options.enemy];act.setSubject(options.enemy);}
    BattleManager.initMembers();BattleManager._subject=options.enemy||a;let starts=0,effects=0;
    BattleManager._statusWindow={refresh(){}};BattleManager._logWindow={startAction(){starts++;},endAction(){},push(){},displayActionResults(){effects++;},displayCounter(){},displayReflection(){},displaySubstitute(){}};
    BattleManager._subject._actions=[act];const before={mp:a.mp,vigor:ArenaResources.snapshot().vigor.current,hp:a.hp};
    BattleManager.startAction();const failure=BattleManager._arenaFailure||null;
    while(BattleManager._phase==='action')BattleManager.updateAction();
    const enemies=$gameTroop.members().map(e=>({hp:e.hp,damage:e.result().hpDamage,used:e.result().used}));
    BattleManager._subject._actions=[];$gameParty._inBattle=false;
    return{starts,effects,failure,enemies,mpCost:before.mp-a.mp,vigorCost:before.vigor-ArenaResources.snapshot().vigor.current,hpGain:a.hp-before.hp};
   }
   try{
    for(const race of $arenaCharacterCatalog.races)for(const gender of ['male','female'])for(const weapon of [1,2])for(const level of [1,6,12])for(const heavy of [false,true]){
     const a=fresh(race.id,gender);equip(weapon);a.changeLevel(level,false);const id=weapon===1?(heavy?6:5):(heavy?8:7),cost=heavy?12:5;
     const v=ArenaResources.snapshot().vigor.maximum,base=Math.max(1,a.atk*(heavy?3:2)-2),rate=race.id==='dark_elf'?1.05:race.id==='redguard'?1.08:1;
     const probe=action(id);const hit=probe.itemHit($gameTroop.members()[0]);
     eq(Math.round(hit*100),95+(race.id==='dark_elf'?2:race.id==='redguard'?3:race.id==='wood_elf'?4:0),'approved weapon hit pp');
     const r=run(probe);eq([r.starts,r.effects,r.vigorCost,r.mpCost,r.enemies[0].damage],[1,1,cost,0,Math.round(base*rate)],'native technique '+race.id+gender+id+' level'+level);
     eq(ArenaResources.snapshot().vigor.current,v-cost,'racial initial maximum no growth/regrant');matrix.push({race:race.id,gender,weapon,level,heavy,hit,result:r});
    }
    let a=fresh();eq(a.skills().map(s=>s.id),[3,4],'unarmed derived pair');eq(a._skills,[],'no permanent techniques');equip(1);eq(a.skills().map(s=>s.id),[5,6],'dagger pair');
    const stale=action(5,true);ArenaPersistence.setShortcut('one',{kind:'skill',id:5});a.learnSkill(9);a.learnSkill(10);ArenaPersistence.setShortcut('magic',{kind:'skill',id:9});equip(2);
    eq(a.skills().map(s=>s.id),[7,8,9,10],'sword pair and permanent magic');eq(ArenaPersistence.snapshot().hotbar.one,null,'incompatible shortcut cleared');eq(ArenaPersistence.snapshot().hotbar.magic,{kind:'skill',id:9},'magic shortcut retained');
    eq(run(stale).starts,0,'stale forced action rejected');eq(ArenaResources.snapshot().vigor.current,100,'stale action no payment');equip(0);eq(a.skills().map(s=>s.id),[3,4,9,10],'removal keeps magic');
    eq(run(action(7,true)).starts,0,'weapon removed cannot force');equip(1);ArenaPersistence.setResource('vigor',4,100);eq(run(action(5)).starts,0,'insufficient before execution');eq(ArenaResources.snapshot().vigor.current,4,'insufficient no partial deduction');
    ArenaPersistence.setResource('vigor',5,100);const exact=action(5);eq(run(exact).vigorCost,5,'exact native action payment');eq(ArenaResources.snapshot().vigor.current,0,'exact zero');ArenaResources.recoverVigor(50);eq(run(exact).failure,'already-executed','same action token cannot execute twice');
    const selected=action(5);eq(ArenaResources.snapshot().vigor.current,50,'selection/cancel no payment');
    ArenaResources.recoverVigor(100);const s=$dataSkills[5],scope=s.scope,repeats=s.repeats,effect=s.effects;s.scope=2;s.repeats=2;s.effects=[{code:13,dataId:0,value1:0,value2:0}];
    let multi=run(action(5),{multiple:true});eq([multi.starts,multi.effects,multi.vigorCost],[1,4,5],'four native applications one cost');s.scope=scope;s.repeats=repeats;s.effects=effect;
    let noTarget=action(5);noTarget.makeTargets=()=>[];eq(run(noTarget).failure,'no-target','no targets no payment');
    const oldMpCost=s.mpCost;s.mpCost=3;a.setMp(2);ArenaPersistence.setResource('vigor',100,100);
    eq(run(action(5)).starts,0,'combined native and vigor costs validated before payment');eq([a.mp,ArenaResources.snapshot().vigor.current],[2,100],'no partial combined payment');s.mpCost=oldMpCost;
    const success=s.successRate;s.successRate=0;eq(run(action(5)).vigorCost,5,'miss pays once after execution begins');s.successRate=success;
    a=fresh();eq(run(action(10,true)).starts,0,'unknown spell forcing rejected');a.learnSkill(10);a.setMp(5);eq(run(action(10)).starts,0,'insufficient mana');eq(a.mp,5,'mana no partial payment');a.setMp(6);let fire=run(action(10));eq([fire.mpCost,fire.vigorCost,fire.enemies[0].damage],[6,0,22],'known fire actual elemental effect');
    a.learnSkill(9);a.setHp(20);a.setMp(8);eq(run(action(9)).hpGain,33,'Cura actual native healing');eq([a.mp,ArenaResources.snapshot().vigor.current],[0,100],'Cura mana-only exact');
    for(const b of $arenaAbilities.books){a=fresh();const item=$dataItems[b.itemId];eq(ArenaAbilities.learnBook(a,item),'missing','missing book');$gameParty.gainItem(item,3);eq(ArenaAbilities.learnBook(a,item),'learned','valid level1 book');eq([a.isLearnedSkill(b.skillId),$gameParty.numItems(item)],[true,2],'learn before consume exactly one');eq(ArenaAbilities.learnBook(a,item),'already-known','repeat refused');eq($gameParty.numItems(item),2,'duplicate keeps all copies');equip(1);equip(2);equip(0);DataManager.saveGame(20);DataManager.loadGame(20);eq([actor().isLearnedSkill(b.skillId),$gameParty.numItems(item)],[true,2],'native learned/inventory save-load');}
    a=fresh();const item=$dataItems[5];$gameParty.gainItem(item,2);const learn=a.learnSkill;a.learnSkill=function(id){learn.call(this,id);throw Error('injected learn failure');};eq(ArenaAbilities.learnBook(a,item),'failed','learning exception rollback');a.learnSkill=learn;eq([a.isLearnedSkill(9),$gameParty.numItems(item)],[false,2],'failed learning keeps inventory and skill');
    const consume=$gameParty.consumeItem;$gameParty.consumeItem=function(i){consume.call(this,i);throw Error('injected consume failure');};eq(ArenaAbilities.learnBook(a,item),'failed','consume exception rollback');$gameParty.consumeItem=consume;eq([a.isLearnedSkill(9),$gameParty.numItems(item)],[false,2],'failed consumption restores transaction');
    const forcedBook=new Game_Action(a,true);forcedBook.setItem(5);forcedBook.setTarget(0);eq(run(forcedBook).failure,'book-menu-only','forced battle book cannot bypass transaction');eq([a.isLearnedSkill(9),$gameParty.numItems(item)],[false,2],'forced book no learning or consumption');
    eq(a.useItem(item),'learned','direct native useItem delegates to book transaction');eq(a.useItem(item),'already-known','direct duplicate book preserved');eq($gameParty.numItems(item),1,'one direct book consumed');
    // Actual registered Fire Dart against Breton/Nord; enemy MP/MAT are isolated fixtures.
    const mat=$dataEnemies[1].params[4],mp=$dataEnemies[1].params[1];$dataEnemies[1].params[4]=8;$dataEnemies[1].params[1]=50;
    for(const race of ['breton','nord']){a=fresh(race);const e=new Game_Enemy(1,0,0),cast=new Game_Action(e);cast.setSkill(10);cast.setTarget(0);const r=run(cast,{enemy:e});eq(-r.hpGain,race==='breton'?14:19,'native Fire Dart target resistance '+race);}
    $dataEnemies[1].params[4]=mat;$dataEnemies[1].params[1]=mp;
    return{checks,matrix};
   }finally{Math.random=rng;$dataSkills.forEach((s,i)=>{if(s)s.damage.variance=variances[i];});$dataEnemies[1].params[0]=hp;}
  });
  // Actual native item UI: learn one of three copies, then show duplicate notice.
  await page.evaluate(()=>{DataManager.setupNewGame();$gamePlayer.reserveTransfer(6,8,6,2,0);SceneManager.goto(Scene_Map);});
  await page.waitForFunction(()=>$gameMap.mapId()===6&&SceneManager._scene instanceof Scene_Map&&!SceneManager._scene.isBusy());
  await page.evaluate(()=>{ArenaAbilityLab.open();$gameParty.gainItem($dataItems[5],3);});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaAbilityLab&&SceneManager._scene.isActive());
  await page.evaluate(()=>SceneManager._scene._commands.selectSymbol('items'));await page.keyboard.press('Enter',{delay:110});
  await page.waitForFunction(()=>SceneManager._scene instanceof Scene_Item&&SceneManager._scene.isActive()&&!SceneManager._scene.isBusy()&&SceneManager._scene._categoryWindow.isOpenAndActive());
  async function key(k){await page.keyboard.press(k,{delay:110});await page.waitForTimeout(230);}
  await page.evaluate(()=>Input.clear());await key('Enter');
  await page.waitForFunction(()=>SceneManager._scene._itemWindow.isOpenAndActive());
  assert.equal(await page.evaluate(()=>{const w=SceneManager._scene._helpWindow;return $dataSkills.slice(3,11).concat([$dataItems[5],$dataItems[6]]).every(s=>s.description.split('\n').every(line=>w.contents.measureTextWidth(line)<=w.contentsWidth()));}),true);
  await page.screenshot({path:out+'/livro-valido.png'});await key('Enter');
  await page.waitForFunction(()=>SceneManager._scene._actorWindow.isOpenAndActive());await key('Enter');
  assert.deepEqual(await page.evaluate(()=>[$gameActors.actor(1).isLearnedSkill(9),$gameParty.numItems($dataItems[5])]),[true,2]);
  await key('Escape');
  assert.match(await page.evaluate(()=>SceneManager._scene._helpWindow._text),/Já conhece Cura/);await page.screenshot({path:out+'/livro-conhecido.png'});
  await page.evaluate(()=>{DataManager.setupNewGame();$gamePlayer.reserveTransfer(6,8,6,2,0);SceneManager.goto(Scene_Map);});
  await page.waitForFunction(()=>$gameMap.mapId()===6&&SceneManager._scene instanceof Scene_Map&&!SceneManager._scene.isBusy());
  await key('ArrowUp');await key('Enter');await page.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaAbilityLab&&SceneManager._scene.isActive());
  await page.screenshot({path:out+'/laboratorio.png'});
  await page.evaluate(()=>{const w=SceneManager._scene._commands;w.select(w._list.findIndex(e=>e.symbol==='skill'&&e.ext===3));});
  await key('Enter');await page.waitForFunction(()=>SceneManager._scene._confirm.active);await key('Escape');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),100);
  await key('Enter');await key('Enter');assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),95);await page.screenshot({path:out+'/acao-nativa.png'});
  await key('Enter');await page.waitForFunction(()=>SceneManager._scene._confirm.active);
  await page.evaluate(()=>ArenaAbilityLab.equip(1));await key('Enter');
  assert.equal(await page.evaluate(()=>ArenaResources.snapshot().vigor.current),95);
  assert.match(await page.evaluate(()=>SceneManager._scene._message),/Arma, magia ou recurso indisponível/);
  assert.deepEqual(errors,[]);fs.writeFileSync(out+'/resultado.json',JSON.stringify({browser:await browser.version(),composition:'M01-09/R01',checks:result.checks,matrix:result.matrix,ui:['native book menu','duplicate notice/no consumption','map6 event','selection/cancel','native action confirmation'],errors},null,2)+'\n');
  console.log('PASS '+result.checks.length+' checks;'+result.matrix.length+' native racial/equipment/level actions;books rollback/native menu/save-load;execution guards;no browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
