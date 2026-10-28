const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const out='doc/evidencias/m01-18-r02',b=await chromium.launch({channel:'chrome',headless:true});try{
const errors=[],records=[];
for(const id of Object.keys(JSON.parse(fs.readFileSync('data/ArenaBattleMotion.json','utf8')).actors)){
const p=await b.newPage({viewport:{width:1100,height:800}});p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8767');await p.waitForFunction(()=>window.ArenaBattleMotion&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging());
await p.evaluate(id=>{const a=id.split('.');ArenaBattle.startLab(a[0],a[1]);},id);await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&SceneManager._scene.isActive()&&!$gamePlayer.isTransferring());
await p.evaluate(()=>{ArenaBattle.prepare();BattleManager.setup(1,false,false);SceneManager.push(Scene_Battle);});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_Battle&&SceneManager._scene.isActive()&&!SceneManager.isSceneChanging());await p.waitForTimeout(200);
const result=await p.evaluate(()=>{const a=$gameActors.actor(1),s=SceneManager._scene._spriteset._actorSprites[0],profile=ArenaBattleMotion.profile(a),rows=[];
for(const weaponId of [1,2]){a.changeEquip(0,$dataWeapons[weaponId]);for(const key of Object.keys(profile.motions)){let tick=0;for(const [index,f] of profile.motions[key].frames.entries()){
if(f.hand){s._arenaTimeline={key,tick,released:true,action:false};s.updateFrame();const w=s._arenaHeldWeapon,b=s._mainSprite,front=s.getChildIndex(w)>s.getChildIndex(b);if(front!==(f.weaponLayer==='front')||Math.abs(w.x+(f.hand[0]-profile.cell[0]/2))>.001||Math.abs(w.y-(f.hand[1]-profile.cell[1]))>.001||Math.abs(w.rotation+f.hand[2]*Math.PI/180)>.001||w.scale.x!==-1||b.scale.x!==-1)throw Error('Weapon alignment/plane '+key+index);rows.push({weaponId,key,index,plane:f.weaponLayer,x:w.x,y:w.y,rotation:w.rotation});}tick+=f.duration;
}}}return rows;});records.push({id,poses:result});
if(id==='breton.female.base'){await p.evaluate(()=>{const s=SceneManager._scene._spriteset._actorSprites[0];s._arenaTimeline={key:'idle',tick:0,released:true,action:false};s.updateFrame();SceneManager.renderScene();});await p.locator('#GameCanvas').screenshot({path:out+'/arma-plano-por-pose.png'});}
await p.close();
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/armas-planos-16-combinacoes.json',JSON.stringify({browser:await b.version(),actors:records,errors,scope:'Native sprite updateFrame for each actual pose/weapon; native combat sequence tested separately',editor:'not executed',galaxyA56:'not executed'},null,2));console.log('PASS16 identities, two weapons, all configured grip/plane/flip poses');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
