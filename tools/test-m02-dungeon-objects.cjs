// Focused art/state regression, disposable Chrome profile and synthetic saves.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const R=path.resolve(__dirname,'..'),out=path.join(R,'doc/evidencias/m02-dungeon-objects');fs.mkdirSync(out,{recursive:true});
const read=f=>JSON.parse(fs.readFileSync(path.join(R,f),'utf8'));
const prior=f=>JSON.parse(cp.execFileSync('git',['show','b996fb3:'+f],{cwd:R,encoding:'utf8',maxBuffer:30e6}));
const plan=read('doc/mapas/M02_OBJETOS_DUNGEONS.json'),runtime=read('data/ArenaM02DungeonObjects.json');
assert.equal(plan.stonekeep.doors.length,12);assert.deepEqual(plan.fang.map(p=>p.doors.length),[12,1]);assert.equal(plan.fang[0].braces.length,24);assert.equal(plan.fang[0].tracks.length,364);
for(const mid of [13,15,17]){
 const file='data/Map'+String(mid).padStart(3,'0')+'.json',old=prior(file),now=read(file),spec=runtime.maps.find(m=>m.mapId===mid),n=old.width*old.height;
 assert.equal(now.width,old.width);assert.equal(now.height,old.height);
 for(let i=0;i<old.data.length;i++)if(old.data[i]!==now.data[i]){
  assert.equal(mid,13);assert(i>=n&&i<2*n);assert(now.data[i]>=512&&now.data[i]<566);assert.equal(old.data[i],0);assert.equal(old.data[5*n+i%n],4);
 }
 old.events.forEach((e,id)=>{if(!e)return;const copy=structuredClone(now.events[id]);const door=spec.sprites.find(d=>d.eventId===id);if(door)copy.pages.forEach((p,k)=>p.image.characterName=e.pages[k].image.characterName);assert.deepEqual(copy,e,'unchanged event '+mid+'/'+id);});
 for(const p of spec.decorations){const e=now.events[p.eventId];assert.equal(e.note,p.id);assert.equal(e.pages[0].through,true);assert.equal(e.pages[0].trigger,0);assert.equal(e.pages[0].list.length,1);}
}
for(const name of ['Map008','Map009','Map010','Map011','Map012','Map014','Map016','Map018','MapInfos','ArenaCampaign','ArenaStonekeepWhole','ArenaFangCells','ArenaRecovery','Enemies','Troops','Items','Weapons','Armors','Skills','ArenaLoot'])assert.deepEqual(read('data/'+name+'.json'),prior('data/'+name+'.json'),name);
const sets=read('data/Tilesets.json'),oldSets=prior('data/Tilesets.json');sets.forEach((s,i)=>{if(i!==7)assert.deepEqual(s,oldSets[i]);});
assert.equal(sets[7].tilesetNames[7],'Arena_Mine_Objects_V01_D');for(let id=512;id<566;id++)assert.equal(sets[7].flags[id]&15,0);
const generated=['Map013','Map015','Map017','ArenaFangCells','ArenaCampaign','ArenaRecovery','Tilesets','ArenaM02DungeonObjects'],before=generated.map(n=>read('data/'+n+'.json'));
cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:R});generated.forEach((n,i)=>assert.deepEqual(read('data/'+n+'.json'),before[i],'rebuild '+n));
(async()=>{let browser;try{
 browser=await chromium.launch({channel:'chrome',headless:true});const p=await browser.newPage({viewport:{width:1050,height:850}}),errors=[],missing=[],checks=[];
 p.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});p.setDefaultTimeout(30000);
 const ready=id=>p.waitForFunction(id=>SceneManager._scene instanceof Scene_Map&&$dataMap&&SceneManager._scene._spriteset&&SceneManager._scene.isActive()&&$gameMap.mapId()===id&&!$gamePlayer.isTransferring()&&!SceneManager.isSceneChanging()&&$gamePlayer.canMove(),id);
 const title=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 async function transfer(id,x,y,d=2){await p.evaluate(({id,x,y,d})=>{$gameTemp.clearDestination();if($gameMap.mapId()===id){$gamePlayer.locate(x,y);$gamePlayer.setDirection(d);}else{$gamePlayer.reserveTransfer(id,x,y,d,2);SceneManager.goto(Scene_Map);}},{id,x,y,d});await ready(id);await freeze();}
 async function freeze(){await p.evaluate(()=>$gameMap.events().filter(e=>e.event().note.startsWith('ArenaEncounter:')).forEach(e=>e._locked=true));}
 async function screen(name){await p.waitForFunction(()=>ImageManager.isReady());const png=await p.evaluate(()=>{SceneManager.renderScene();return Graphics._canvas.toDataURL('image/png');});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(png.split(',')[1],'base64'));console.log('Captured',name);}
 const state=()=>p.evaluate(()=>({q1:ArenaQuests.snapshot('MQ01'),q2:ArenaQuests.snapshot('MQ02'),items:$gameParty._items,gold:$gameParty.gold(),exp:$gameActors.actor(1).currentExp(),attributes:ArenaAttributes.snapshot(),resources:ArenaResources.snapshot(),loot:ArenaLoot.snapshot(),switches:$gameSelfSwitches._data}));
 async function save(){assert.equal(await p.evaluate(()=>{$gameSystem.onBeforeSave();return DataManager.saveGame(19);}),true);}
 async function load(id){await p.reload();await title();assert.equal(await p.evaluate(()=>DataManager.loadGame(19)),true);await p.evaluate(()=>{$gameSystem.onAfterLoad();SceneManager.goto(Scene_Map);});await ready(id);await freeze();}
 async function messages(){for(let i=0;i<100;i++){const busy=await p.evaluate(()=>$gameMessage.isBusy()||$gameMap.isEventRunning());if(!busy)return;await p.keyboard.press('Enter',{delay:80});await p.waitForTimeout(60);}throw Error('message did not end');}
 await p.goto('http://127.0.0.1:8774/');await title();await p.evaluate(()=>ArenaFangCells.preview());await ready(13);await freeze();
 // Use the established fixture->normal conversion in an otherwise empty profile.
 const raw=await p.evaluate(()=>JsonEx.stringify({system:$gameSystem,screen:$gameScreen,timer:$gameTimer,switches:$gameSwitches,variables:$gameVariables,selfSwitches:$gameSelfSwitches,actors:$gameActors,party:$gameParty,map:$gameMap,player:$gamePlayer}));await p.evaluate(()=>ArenaContinuation.leaveLab());await title();await p.evaluate(raw=>{DataManager.extractSaveContents(JsonEx.parse(raw));SceneManager.goto(Scene_Map);},raw);await ready(13);await freeze();
 assert.equal(await p.evaluate(()=>ArenaContinuation.labActive()),false);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);
 const initial=await state();
 // Reproduce an old serialized map: old artwork and no newly added decorations.
 await p.evaluate(()=>{$gameMap._events.length=78;$arenaM02DungeonObjects.maps.find(m=>m.mapId===13).sprites.forEach(s=>$gameMap.event(s.eventId).setImage('!$Arena_Doors_M14_R03',0));});await save();await load(13);
 assert.deepEqual(await state(),initial);assert.equal(await p.evaluate(()=>$arenaM02DungeonObjects.maps.find(m=>m.mapId===13).decorations.every(s=>$gameMap.event(s.eventId)&&$gameMap.event(s.eventId).isThrough())),true);
 assert.equal(await p.evaluate(()=>$arenaM02DungeonObjects.maps.find(m=>m.mapId===13).sprites.every(s=>$gameMap.event(s.eventId).characterName()===s.file)),true);
 checks.push('Old-map normal save/load refreshes door art and adds only24 through decorations; player/quests/resources/items/receipts/self switches unchanged');
 const brace=plan.fang[0].braces[0];await transfer(13,brace.origin[0],brace.origin[1]+1,8);await screen('suporte-trilhos');
 const track=plan.fang[0].tracks.find(t=>t.shape==='ne')||plan.fang[0].tracks[0];await transfer(13,...track.center);await screen('trilhos');
 // Reuse actual interpreter preconditions rather than rewriting the riddle state.
 const c=read('data/ArenaFangCells.json');await transfer(13,...c.riddle,2);
 assert(await p.evaluate(()=>{const i=new Game_Interpreter();i.setup([],$arenaFangCells.riddleEventId);i._branch[0]=0;return ArenaFangCells.answer(i,1);}));await messages();
 assert.equal(await p.evaluate(()=>!!ArenaQuests.snapshot('MQ02').objectives.fangSpidersReleased),true);
 assert.equal(await p.evaluate(()=>$arenaFangCells.gates.filter(g=>g.opensWith==='wrong').every(g=>$gameSelfSwitches.value([13,g.eventId,'A']))),true);
 await screen('celas-abertas');
 assert(await p.evaluate(()=>{const i=new Game_Interpreter();i.setup([],$arenaFangCells.riddleEventId);i._branch[0]=1;return ArenaFangCells.answer(i,2);}));await messages();
 await transfer(13,...c.key);assert(await p.evaluate(()=>{const i=new Game_Interpreter();i.setup([],$arenaFangCells.keyEventId);return ArenaFangCells.takeKey(i);}));await messages();
 await transfer(13,...c.riddle);assert(await p.evaluate(()=>{const i=new Game_Interpreter();i.setup([],$arenaFangCells.riddleEventId);return ArenaFangCells.openPortal(i);}));await messages();
 assert.equal(await p.evaluate(()=>ArenaQuests.snapshot('MQ02').stage),80);await screen('portal-metalico');
 const afterPortal=await state();await save();await load(13);assert.deepEqual(await state(),afterPortal);
 assert.equal(await p.evaluate(()=>$gameMap.event($arenaFangCells.gates.find(g=>g.id==='portal').eventId).pattern()),2);
 checks.push('Existing wrong/correct riddle, unique key/receipt, open cell/steel art and normal save/load preserve MQ02; no duplicated item/reward');
 const whole=read('data/ArenaStonekeepWhole.json');
 const first=whole.doors.find(d=>d.id===plan.stonekeep.doors[0].id);
 await transfer(15,first.center[0],first.center[1]+2,8);await screen('grade-stonekeep-fechada');
 assert.equal(await p.evaluate(id=>ArenaDungeon.openDoor(id),first.id),true);
 await p.evaluate(id=>{let n=0;while($gameMap._arenaDoorTransitions?.[id]&&n++<1000)$gameMap.update(false);$gameMap.update(false);},first.id);
 await screen('grade-stonekeep-aberta');await save();const savedDoor=await state();await load(15);assert.deepEqual(await state(),savedDoor);
 const side=whole.doors.find(d=>d.id===plan.stonekeep.doors[4].id);await transfer(15,side.center[0]-2,side.center[1],6);await screen('grade-stonekeep-lateral');
 const reports=await p.evaluate(specs=>{
  function step(id){let n=0;while((ArenaStonekeepAccess.working()||$gameMap._arenaDoorTransitions?.[id])&&n++<10000)$gameMap.update(false);$gameMap.update(false);if(n>=10000)throw Error('transition limit');}
  function expect(v,text){if(!v)throw Error(text);}
  return specs.map(s=>{
   const d=ArenaDungeon.door(s.id),h=d.axis==='east-west',x=d.center[0]+(h?-2:0),y=d.center[1]+(h?0:2);
   $gamePlayer.locate(x,y);$gamePlayer.setDirection(h?6:8);
   if($gameSelfSwitches.value([15,d.eventIds[0],'A'])){expect(ArenaDungeon.closeDoor(d.id),'initial close');step(d.id);}
   const ax=d.center[0]+(h?-1:0),ay=d.center[1]+(h?0:1),toward=h?6:8;
   expect(!$gamePlayer.canPass(ax,ay,toward),'closed collision '+d.id);
   if(d.lockValue){expect(!ArenaDungeon.openDoor(d.id),'lock bypass');expect(ArenaStonekeepAccess.force(d.id),'force start');step(d.id);}
   else {expect(ArenaDungeon.openDoor(d.id),'open');step(d.id);}
   expect(d.eventIds.every(id=>$gameSelfSwitches.value([15,id,'A'])),'open state');
   expect($gamePlayer.canPass(ax,ay,toward),'open forward collision '+d.id);
   expect($gamePlayer.canPass(d.center[0]+(h?1:0),d.center[1]+(h?0:-1),h?4:2),'open reverse collision '+d.id);
   $gamePlayer.locate(...d.center);expect(!ArenaDungeon.closeDoor(d.id),'occupied close');
   $gamePlayer.locate(x,y);expect(ArenaDungeon.closeDoor(d.id),'close');step(d.id);
   expect(d.eventIds.every(id=>!$gameSelfSwitches.value([15,id,'A'])),'closed state');
   return{id:s.id,axis:d.axis,opened:true,closed:true,occupiedCloseRefused:true,collisionBothDirections:true,lockValue:d.lockValue};
  });
 },plan.stonekeep.doors);
 checks.push('All12 Stonekeep raising grates open/close with native transitions; occupied envelope refuses closing; open state normal save/load preserved');
 const lower=c.lower;await transfer(lower.mapId,...lower.approach,2);await screen('porta-segundo-enigma');
 assert.equal(await p.evaluate(()=>$gameMap.event(4).characterName()),'!$Arena_Mine_SteelDoor_V01');
 const final=await state();for(const key of ['q1','gold','exp','attributes','resources','loot'])assert.deepEqual(final[key],initial[key],key);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({base:'b996fb3',browser:browser.version(),checks,coverage:{stoneGrates:12,mineGrates:11,steelPortals:2,braces:24,trackCells:364},doors:reports,errors,missing,storage:'Disposable Chrome profile; native slot19 only synthetic data. Personal profiles untouched.',timing:'Door/lock transitions stepped through native Game_Map.update in synthetic fixture; no runtime timing or performance claim. Screens show actual renderer.',pending:['Integrated owner visual evaluation','Dragon gate visual association and cart positions remain unconfirmed','Lava and narrative illustrations unchanged']},null,2)+'\n');console.log('PASS M02 dungeon objects',checks.length,'groups');
 }catch(e){console.error(e);throw e;}finally{if(browser)await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
