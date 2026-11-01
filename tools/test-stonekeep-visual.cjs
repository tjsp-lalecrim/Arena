// Focal V01 checks: isolated Chrome/origin, existing RAM lab, no personal saves.
const fs=require('fs'),path=require('path'),http=require('http'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias',process.argv[2]||'m02-04-visual-v01');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const old=f=>JSON.parse(cp.execFileSync('git',['show','e23aed6:'+f],{cwd:root,encoding:'utf8'}));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const c=read('doc/mapas/STONEKEEP_VISUAL_V01.json'),map=read('data/Map012.json'),base=old('data/Map012.json'),sets=read('data/Tilesets.json'),baseSets=old('data/Tilesets.json'),checks=[];
const n=map.width*map.height,inside=(x,y)=>x>=c.bounds[0]&&x<=c.bounds[2]&&y>=c.bounds[1]&&y<=c.bounds[3];
assert.equal(map.width,base.width);assert.equal(map.height,base.height);assert.deepEqual(map.events,base.events);
assert.deepEqual(sets.slice(0,5),baseSets);assert.equal(map.tilesetId,5);assert.equal(sets[5].tilesetNames[0],sets[4].tilesetNames[0]);
for(const f of ['data/Map008.json','data/Map009.json','data/Map010.json','data/Map011.json','data/Items.json'])assert.deepEqual(read(f),old(f));
assert.equal(fs.readFileSync(path.join(root,'js/plugins.js'),'utf8'),cp.execFileSync('git',['show','e23aed6:js/plugins.js'],{cwd:root,encoding:'utf8'}));
let changed=0,shores=0;
function passage(m,s,x,y){for(const z of [3,2,1,0]){const flag=s.flags[m.data[z*n+y*m.width+x]];if(flag&16)continue;return flag&15;}return 15;}
for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
 for(let z=0;z<6;z++){const i=z*n+y*map.width+x;if(map.data[i]!==base.data[i]){assert(inside(x,y)&&z<=1,'Change outside visual scope');changed++;}}
 assert.equal(passage(map,sets[5],x,y),passage(base,baseSets[4],x,y),'Passage changed '+[x,y]);
 if(map.data[n+y*map.width+x])shores++;
}
checks.push('Only layers0/1 inside bounds changed; all original region/shadow/event/collision data and Maps008–011 preserved');
checks.push('Tilesets0–4 and canonical plugins.js unchanged; separate tileset5/C sheet, native water/ripple reused');
const outputs=['data/Map012.json','data/Tilesets.json','data/ArenaStonekeep.json'],hashes=outputs.map(f=>sha(fs.readFileSync(path.join(root,f))));
cp.execFileSync(process.execPath,['tools/build-stonekeep-sample.cjs'],{cwd:root});assert.deepEqual(outputs.map(f=>sha(fs.readFileSync(path.join(root,f)))),hashes);
checks.push('Stonekeep source generator is idempotent and retains visual application');
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.css':'text/css','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(e?'':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 fs.mkdirSync(out,{recursive:true});browser=await chromium.launch({channel:'chrome',headless:true});const p=await browser.newPage({viewport:{width:1050,height:850},hasTouch:true}),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await p.goto('http://127.0.0.1:'+server.address().port+'/');
 await p.waitForFunction(()=>window.ArenaStonekeep&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
 const storage=await p.evaluate(()=>JSON.stringify(localStorage));
 await p.evaluate(()=>{const w=SceneManager._scene._commandWindow;w.selectSymbol('arenaStonekeepMaterials');w.processOk();});
 const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());
 await p.waitForFunction(()=>$gameMap.mapId()===12&&!$gamePlayer.isTransferring());await ready();assert.deepEqual(await p.evaluate(()=>[$gameMap.mapId(),$gamePlayer.x,$gamePlayer.y]),[12,84,42]);assert.equal(await p.evaluate(()=>ArenaContinuation.labActive()),true);
 assert.equal(await p.evaluate(()=>DataManager.saveGame(16)),false);
 const state=()=>p.evaluate(()=>JSON.stringify({q1:ArenaQuests.snapshot(),q2:ArenaQuests.snapshot('MQ02'),resources:ArenaResources.snapshot(),items:$gameParty._items,attributes:ArenaAttributes.snapshot()}));
 const initial=await state();
 async function walk(goal){await p.evaluate(goal=>{const queue=[[$gamePlayer.x,$gamePlayer.y]],seen=new Map([[queue[0].join(','),null]]);let end;for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===goal[0]&&y===goal[1]){end=[x,y];break;}for(const [d,dx,dy]of [[2,0,1],[4,-1,0],[6,1,0],[8,0,-1]]){const k=[x+dx,y+dy].join(',');if(!seen.has(k)&&$gamePlayer.canPass(x,y,d)){seen.set(k,{from:[x,y],d});queue.push([x+dx,y+dy]);}}}if(!end)throw Error('No native route '+goal);const route=[];for(let at=end;seen.get(at.join(','));){const a=seen.get(at.join(','));route.unshift(a.d);at=a.from;}for(const d of route){$gamePlayer.moveStraight(d);if(!$gamePlayer.isMovementSucceeded())throw Error('Blocked');while($gamePlayer.isMoving())$gamePlayer.updateMove();}$gameTemp.clearDestination();$gamePlayer.center($gamePlayer.x,$gamePlayer.y);},goal);await p.waitForTimeout(180);await ready();}
 const shot=name=>p.locator('#GameCanvas').screenshot({path:path.join(out,name+'.png')});
 for(const [name,point]of Object.entries(c.reviewPoints)){await walk(point);await shot('depois-'+name);}
 await walk([65,39]);await p.keyboard.press('ArrowLeft',{delay:65});await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>ArenaDungeon.isSwimming()),true);await shot('agua');
 const waterFrame=await p.evaluate(()=>SceneManager._scene._spriteset._tilemap.animationFrame);await p.waitForFunction(f=>SceneManager._scene._spriteset._tilemap.animationFrame!==f,waterFrame);
 await p.keyboard.press('ArrowRight',{delay:65});await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>ArenaDungeon.isSwimming()),false);await shot('saida-agua');
 await p.evaluate(()=>$gameTemp.setDestination(66,39));await p.waitForFunction(()=>$gamePlayer.x===66&&$gamePlayer.y===39&&!$gamePlayer.isMoving());
 assert.equal(await state(),initial);
 const walls=await p.evaluate(bounds=>{let tested=0;for(let y=bounds[1];y<=bounds[3];y++)for(let x=bounds[0];x<=bounds[2];x++)if($gameMap.regionId(x,y)!==1)for(const [d,dx,dy]of [[2,0,1],[4,-1,0],[6,1,0],[8,0,-1]])if($gameMap.regionId(x+dx,y+dy)===1){if($gamePlayer.canPass(x,y,d))throw Error('Wall bypass');tested++;}return tested;},c.bounds);assert(walls>0);
 checks.push('Native title option opens correct RAM scene at84,42; normal save blocked, personal web storage unchanged');
 checks.push('Native movement reaches room/passage/shore; keyboard enters and leaves water, destination path reaches adjacent land; wall edges remain blocked');
 checks.push('MQ01/MQ02, resources, attributes and inventory unchanged during sample traversal');
 // Checkpoint uses the existing RAM contract, not browser slots.
 assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);await walk([75,39]);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();assert.deepEqual(await p.evaluate(()=>[$gamePlayer.x,$gamePlayer.y]),[66,39]);assert.equal(await state(),initial);
 assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)),storage);
 // Old normal saves retain Game_Map._tilesetId=4. Reproduce that serialized
 // reference in RAM only; loading must select5 before native bitmap loading.
 await p.evaluate(()=>$gameMap.changeTileset(4));assert.equal(await p.evaluate(()=>ArenaContinuation.memorySave()),true);assert.equal(await p.evaluate(()=>ArenaContinuation.memoryLoad()),true);await p.evaluate(()=>SceneManager.goto(Scene_Map));await ready();await p.waitForFunction(()=>$gameMap.tilesetId()===5);assert.equal(await p.evaluate(()=>$gameMap.tilesetId()),5);assert.equal(await state(),initial);
 checks.push('Existing RAM checkpoint restores position/state; serialized legacy tileset4 updates only to visual5 without normal-slot writes');
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify({version:c.version,applicationRevision:c.applicationRevision||'pilot',browser:browser.version(),resolution:[816,624],base:'e23aed6',bounds:c.bounds,changedEntries:changed,shoreCells:shores,wallEdges: walls,checks,errors,missing,pending:['owner expanded-application review; five-material direction already approved','native MV editor authoring/playtest not executed','no new physical mobile test'],scope:'Focal material application only; native route to all five points; no campaign/battles or source collection replay'},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,changed,shores,walls,errors,missing}));
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
