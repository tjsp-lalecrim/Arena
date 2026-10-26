const assert=require('node:assert/strict');
module.exports=function(page){
  async function key(k){await page.keyboard.press(k,{delay:100});await page.waitForTimeout(140);}
  async function ready(){
   for(let i=0;i<220;i++){
    const s=await page.evaluate(()=>{const s=SceneManager._scene;if(s instanceof Scene_Gameover)return'gameover';if(s instanceof Scene_Map&&!s.isBusy())return'map';if(s instanceof Scene_Battle){if(s._messageWindow.pause&&s._messageWindow._waitCount===0)return'message';if(s._partyCommandWindow.isOpenAndActive())return'party';if(s._actorCommandWindow.isOpenAndActive())return'actor';}return'wait';});
    if(s==='message')await key('Enter');else if(s==='party')await page.evaluate(()=>{SceneManager._scene._partyCommandWindow.selectSymbol('fight');SceneManager._scene._partyCommandWindow.processOk();});else if(s!=='wait')return s;
    await page.waitForTimeout(100);
   }throw Error('battle did not reach input/end: '+JSON.stringify(await page.evaluate(()=>({phase:BattleManager._phase,errors:Graphics._errorPrinter.innerHTML,log:SceneManager._scene._logWindow&&SceneManager._scene._logWindow._methods}))));
  }
  async function choose(kind,id){
   assert.equal(await ready(),'actor');
   await page.evaluate(({kind,id})=>{const s=SceneManager._scene,w=s._actorCommandWindow;w.selectSymbol(kind);if(kind==='skill')w.selectExt($dataSkills[id].stypeId);w.processOk();if(kind==='skill'){s._skillWindow.select(s._skillWindow._data.findIndex(v=>v.id===id));s._skillWindow.processOk();}if(kind==='item'){s._itemWindow.select(s._itemWindow._data.findIndex(v=>v.id===id));s._itemWindow.processOk();}if(s._enemyWindow.active){s._enemyWindow.select(0);s._enemyWindow.processOk();}if(s._actorWindow.active){s._actorWindow.select(0);s._actorWindow.processOk();}}, {kind,id});
   await page.waitForTimeout(150);return ready();
  }
return {key,ready,choose};
};
