// Delta only against the approved pilots; no campaign or repeated battle test.
// Uses the existing project server, with a fresh Chrome profile and RAM lab.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),crypto=require('crypto'),http=require('http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'doc/evidencias/m02-04-walls-expansao'),url='http://127.0.0.1:8774/';
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),prior=f=>cp.execFileSync('git',['show','90ad460:'+f],{cwd:root,maxBuffer:16*1024*1024}),old=f=>JSON.parse(prior(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const m=read('data/Map012.json'),b=old('data/Map012.json'),materials=read('doc/mapas/STONEKEEP_MATERIAIS_M02.json'),n=m.width*m.height,changed={K:[],L:[]},totals={K:0,L:0};
assert.deepEqual({...m,data:[]},{...b,data:[]});
for(const f of ['data/Map008.json','data/Map009.json','data/Map010.json','data/Map011.json','data/Tilesets.json','data/Items.json','data/ArenaStonekeep.json'])assert.deepEqual(read(f),old(f));
for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){
 const i=y*m.width+x,wall=m.data[5*n+i]===1,family=materials.wallRows[Math.floor((y-2)/3)]?.[Math.floor((x-2)/3)];
 for(let z=1;z<6;z++)assert.equal(m.data[z*n+i],b.data[z*n+i]);
 if(wall&&['K','L'].includes(family)){
  totals[family]++;const offset=family==='K'?0:2,t=b.data[i],row=t>=512?Math.floor((t-512)/8):[5,6].includes(t)?1:[13,14].includes(t)?2:0;
  assert.equal(m.data[i],512+row*8+offset+x%2,'Family/face/cap assignment');
 }
 if(m.data[i]!==b.data[i]){assert(wall&&['K','L'].includes(family));changed[family].push([x,y]);}
 if(family==='k')assert.equal(m.data[i],b.data[i],'Decorated CASK#2 must stay provisional');
}
const art=['img/tilesets/Arena_Stonekeep_KL_V01_D.png','img/tilesets/Arena_Shared_Castle_Stone_V01_C.png','img/tilesets/Arena_Water_M14_R02_A1.png',...['stonekeep-v01','stonekeep-kl-v01'].flatMap(dir=>fs.readdirSync(path.join(root,'art/masters',dir)).map(n=>'art/masters/'+dir+'/'+n))];
for(const f of art)assert.equal(sha(fs.readFileSync(path.join(root,f))),sha(prior(f)),'Approved art changed');
const outputs=['data/Map012.json','data/Tilesets.json','data/ArenaStonekeep.json','data/Map009.json','data/Map010.json','data/Map011.json','data/ArenaRecovery.json','data/Items.json'],before=outputs.map(f=>sha(fs.readFileSync(path.join(root,f))));cp.execFileSync(process.execPath,['tools/build-rihad-arrival.cjs'],{cwd:root});assert.deepEqual(outputs.map(f=>sha(fs.readFileSync(path.join(root,f)))),before);
(async()=>{let browser;try{
 // Verify the purpose/content of the existing server; never start/stop it.
 await new Promise((resolve,reject)=>http.get(url+'data/Map012.json',r=>{let chunks=[];r.on('data',b=>chunks.push(b));r.on('end',()=>{try{assert.equal(r.statusCode,200);assert.deepEqual(JSON.parse(Buffer.concat(chunks)),m);resolve();}catch(e){reject(e);}});}).on('error',reject));
 browser=await chromium.launch({channel:'chrome',headless:true});const p=await browser.newPage({viewport:{width:1050,height:850}}),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});await p.goto(url);await p.waitForFunction(()=>window.ArenaStonekeep&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());const storage=await p.evaluate(()=>JSON.stringify(localStorage));await p.evaluate(()=>ArenaStonekeep.previewMaterials());const ready=()=>p.waitForFunction(()=>SceneManager._scene instanceof Scene_Map&&$gameMap.mapId()===12&&!SceneManager.isSceneChanging()&&!$gamePlayer.isTransferring()&&$gamePlayer.canMove());await ready();
 const state=()=>p.evaluate(()=>JSON.stringify({resources:ArenaResources.snapshot(),q1:ArenaQuests.snapshot(),q2:ArenaQuests.snapshot('MQ02'),items:$gameParty._items,attributes:ArenaAttributes.snapshot()})),initial=await state();
 const edges=await p.evaluate(points=>{let count=0;for(const [x,y]of points)for(const [d,dx,dy,opposite]of [[2,0,1,8],[4,-1,0,6],[6,1,0,4],[8,0,-1,2]])if($gameMap.regionId(x+dx,y+dy)!==1){if($gamePlayer.canPass(x+dx,y+dy,opposite))throw Error('New wall edge is passable');count++;}return count;},[...changed.K,...changed.L]);assert(edges>0);
 for(const [name,x,y]of [['cask',75,93],['casl-norte',120,66],['casl-sul',105,87]]){
  await p.evaluate(([x,y])=>$gamePlayer.reserveTransfer(12,x,y,8,0),[x,y]);await p.waitForFunction(([x,y])=>$gamePlayer.x===x&&$gamePlayer.y===y&&!$gamePlayer.isTransferring(),[x,y]);await ready();await p.waitForTimeout(150);assert.notEqual(await p.evaluate(()=>$gameMap.regionId($gamePlayer.x,$gamePlayer.y)),1);await p.locator('#GameCanvas').screenshot({path:path.join(out,name+'.png')});
 }
 assert.equal(await state(),initial);assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)),storage);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 const result={base:'90ad460',browser:browser.version(),canvas:[816,624],newWallTiles:{cask:changed.K.length,casl:changed.L.length},totalAppliedTiles:totals,changedWallEdgesChecked:edges,checks:['All regular K/L solid cells covered, correct cap/face and family','Only layer0 changed in new K/L occurrences; panels k untouched','Other maps, tilesets, Items, bindings, events, water and regions unchanged','Approved masters/C/D/water exact hashes unchanged','Parent generator stable for8 outputs','Chrome local snapshots and native canPass on new wall boundaries; RAM state/storage unchanged'],errors,missing,reused:'90ad460 pilot access/movement/RAM checkpoint; earlier swimming/source tests; no repeated route, battle, collection or persistence suite',limits:['No fresh editor/mobile test','No new visual approval required for the same approved assets; no new composition problem identified']};fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{if(browser)await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
