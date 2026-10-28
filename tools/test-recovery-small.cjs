const fs=require('fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const out=process.env.ARENA_EVIDENCE_DIR||'doc/evidencias/m01-17';fs.mkdirSync(out,{recursive:true});
 const b=await chromium.launch({channel:'chrome',headless:true}),results=[];
 try{
  for(const [name,viewport,isMobile]of [['janela-menor',{width:640,height:480},false],['toque-paisagem',{width:916,height:412},true]]){
   const c=await b.newContext({viewport,hasTouch:true,isMobile,deviceScaleFactor:1}),p=await c.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.goto(process.env.ARENA_URL||'http://127.0.0.1:8766/');await p.waitForFunction(()=>window.ArenaRecovery&&SceneManager._scene instanceof Scene_Title&&SceneManager._scene._commandWindow.isOpenAndActive());
   await p.evaluate(()=>{ArenaBattle.startLab();$gameTemp._arenaInventoryLab=true;});await p.waitForFunction(()=>SceneManager._scene instanceof Scene_ArenaInventory&&SceneManager._scene.isActive());
   await p.evaluate(()=>{const s=SceneManager._scene,a=$gameActors.actor(1);a.setMp(0);s.setMode('inventory');s._nav.select(0);s._itemWindow.select(s._itemWindow._data.findIndex(i=>i&&DataManager.isItem(i)&&i.id===3));});
   const point=await p.evaluate(()=>{const w=SceneManager._scene._itemWindow,r=w.itemRect(w.index()),c=Graphics._canvas.getBoundingClientRect();return{x:c.x+(w.x+w.padding+r.x+r.width/2)*c.width/Graphics.width,y:c.y+(w.y+w.padding+r.y+50)*c.height/Graphics.height};});
   const cd=await c.newCDPSession(p);await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await p.waitForTimeout(120);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(300);
   const result=await p.evaluate(()=>({mp:$gameActors.actor(1).mp,count:$gameParty.numItems($dataItems[3]),modal:SceneManager._scene._confirm.visible,help:SceneManager._scene._helpWindow._text,canvas:(()=>{const r=Graphics._canvas.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};})(),engine:Graphics._errorPrinter.innerHTML}));
   assert.equal(result.mp,25);assert.equal(result.count,0);assert.equal(result.modal,false);assert.equal(result.engine,'');assert.deepEqual(errors,[]);assert(result.canvas.x>=-1&&result.canvas.y>=-1&&result.canvas.x+result.canvas.width<=viewport.width+1&&result.canvas.y+result.canvas.height<=viewport.height+1);
   await p.screenshot({path:out+'/'+name+'.png'});results.push({name,viewport,isMobile,result,errors});await c.close();
  }
  fs.writeFileSync(out+'/telas-menores.json',JSON.stringify({browser:await b.version(),results,physicalDevice:false},null,2)+'\n');console.log('PASS potion touch use/no modal/canvas fit in 640x480 and 916x412 emulation');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
