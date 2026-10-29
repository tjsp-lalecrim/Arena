/*:
 * @plugindesc v0.2.0 Introdução, sonho de Ria e encerramento M01 persistentes.
 * @author Codex
 * @help Após MV_NarrativePages, MV_StateStore, Arena_Quests e criação.
 * Configuração ArenaNarrative.json. Namespace arenaNarrative v2. Sem parâmetros.
 * API startCampaign/state/isCampaign/finish. Sem vozes, recompensas ou conteúdo M02.
 * Saves anteriores continuam técnicos; nunca simula introdução já presenciada.
 * Veja doc/plugins/Arena_Narrative.md e NARRATIVA_M01_18.md.
 */
var ArenaNarrative,Scene_ArenaNarrative;
(function(){
 'use strict';
 DataManager._databaseFiles.push({name:'$arenaNarrative',src:'ArenaNarrative.json'});
 MVStateStore.register('arenaNarrative',2,{mode:'technical',phase:'none',section:0,word:0,history:[]},function(s,version){
  if(version===1&&s){var p=migratePosition(s);s.section=p.section;s.word=p.word;s.history=(s.history||[]).map(migratePosition);}
  return s;
 });
 // Version1 source0a0106e: split at22 words (R01) and20 words (R02).
 // Only the rewritten key phrase restarts; unchanged text keeps its exact cursor.
 function migratePosition(p){var r=Object.assign({},p);if(p.phase!=='ria')return r;
  r.section=[0,2,4,5,6,7,8][p.section];
  if(p.section===0&&p.word>=22){r.section=1;r.word=p.word-22;}
  if(p.section===1){if(p.word>=20){r.section=3;r.word=p.word-20;}else if(p.word>=17)r.word=p.word+6;else if(p.word>=7)r.word=7;}
  if(p.section===3&&p.word>=24)r.word=p.word+5;return r;
 }
 function state(){var s=MVStateStore.read('arenaNarrative');if(['technical','campaign'].indexOf(s.mode)<0||['none','intro','ria','dungeon','ending','ended'].indexOf(s.phase)<0||!Number.isInteger(s.section)||s.section<0||!Number.isInteger(s.word)||s.word<0)throw Error('Arena: estado narrativo incompatível no save.');return s;}
 function store(s){MVStateStore.replace('arenaNarrative',s);}
 function campaign(){return !!$gameSystem&&state().mode==='campaign';}
 function active(){return campaign()&&['intro','ria','ending','ended'].indexOf(state().phase)>=0;}
 function section(s){return $arenaNarrative.sections.filter(function(v){return v.phase===s.phase;})[s.section];}
 function fence(){$gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();}
 ArenaNarrative={
  state:state,isCampaign:campaign,
  startCampaign:function(){
   if(!ArenaCharacterCreation.isCreated()||state().phase!=='none')return false;
   store({mode:'campaign',phase:'intro',section:0,word:0,history:[]});
   SceneManager.clearStack();SceneManager.goto(Scene_ArenaNarrative);return true;
  },
  finish:function(){
   if(!campaign()||state().phase!=='dungeon'||!ArenaQuests.snapshot().completed)return false;
   return MVStateStore.once('arenaNarrative','gate',function(s){s.phase='ending';s.section=0;s.word=0;s.history=[];})==='applied';
  }
 };
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;
  var c=$arenaNarrative;
  if(!c||c.schemaVersion!==2||!c.sections.length||!c.endingPicture||!c.ending||!c.sections.every(function(v){return typeof v.text==='string'&&typeof v.picture==='string'&&['intro','ria'].indexOf(v.phase)>=0;}))throw Error('Arena: configuração narrativa inválida.');
  return true;
 };
 function layout(){
  var w=Graphics.boxWidth,h=Graphics.boxHeight,wide=h<500;
  if(wide){var iw=Math.floor(w*.52);return {w:w,h:h,x:iw+28,y:80,width:w-iw-52,height:h-160,art:{x:24,y:80,width:iw-12,height:h-160}};}
  var ih=Math.floor((h-160)*.59);return {w:w,h:h,x:24,y:80+ih+10,width:w-48,height:h-170-ih,art:{x:24,y:80,width:w-48,height:ih}};
 }
 function paint(w,text,x,y,width,height,font,color,align){w.contents.fontSize=font;w.changeTextColor(color||'#e3e1cd');w.contents.drawText(text,x,y,width,height,align||'left');}
 function inside(r,x,y){return x>=r.x&&y>=r.y&&x<r.x+r.width&&y<r.y+r.height;}
 function Panel(){this.initialize.apply(this,arguments);}
 Panel.prototype=Object.create(Window_Base.prototype);Panel.prototype.constructor=Panel;
 Panel.prototype.standardPadding=function(){return 16;};
 Scene_ArenaNarrative=function(){this.initialize.apply(this,arguments);};
 Scene_ArenaNarrative.prototype=Object.create(Scene_MenuBase.prototype);Scene_ArenaNarrative.prototype.constructor=Scene_ArenaNarrative;
 Scene_ArenaNarrative.prototype.createBackground=function(){this._backgroundSprite=new Sprite(new Bitmap(Graphics.width,Graphics.height));this._backgroundSprite.bitmap.fillAll('#0a1015');this.addChild(this._backgroundSprite);};
 Scene_ArenaNarrative.prototype.size=function(){
  var small=window.innerWidth<this._original.width||window.innerHeight<this._original.height;
  var w=small?Math.max(640,Math.floor(window.innerWidth)):this._original.width,h=small?Math.max(400,Math.floor(window.innerHeight)):this._original.height;
  if(Graphics.width===w&&Graphics.height===h)return false;
  Graphics.boxWidth=w;Graphics.boxHeight=h;Graphics.width=w;Graphics.height=h;return true;
 };
 Scene_ArenaNarrative.prototype.create=function(){
  this._original={width:Graphics.width,height:Graphics.height,boxWidth:Graphics.boxWidth,boxHeight:Graphics.boxHeight};this.size();
  Scene_MenuBase.prototype.create.call(this);this._focus=1;
  this._art=new Sprite();this.addChildAt(this._art,1);
  this.build();this.waitFresh();
 };
 Scene_ArenaNarrative.prototype.waitFresh=function(){this._awaitNeutral=true;this._readyAt=Date.now()+150;this._press=null;};
 Scene_ArenaNarrative.prototype.build=function(){
  var l=layout();this._windowLayer.move(0,0,l.w,l.h);
  if(!this._body){this._header=new Panel(24,12,l.w-48,64);this._body=new Panel(l.x,l.y,l.width,l.height);this._footer=new Panel(24,l.h-72,l.w-48,60);[this._header,this._body,this._footer].forEach(function(w){ArenaBattleUI.theme(w);this.addWindow(w);},this);}
  else {[[this._header,24,12,l.w-48,64],[this._body,l.x,l.y,l.width,l.height],[this._footer,24,l.h-72,l.w-48,60]].forEach(function(v){v[0].move(v[1],v[2],v[3],v[4]);v[0].createContents();});}
  if(this._backgroundSprite.bitmap.width!==l.w||this._backgroundSprite.bitmap.height!==l.h){this._backgroundSprite.bitmap=new Bitmap(l.w,l.h);this._backgroundSprite.bitmap.fillAll('#0a1015');}
  this.draw();
 };
 Scene_ArenaNarrative.prototype.draw=function(){
  var s=state(),end=['ending','ended'].indexOf(s.phase)>=0,entry=end?null:section(s),l=layout();
  if(!end&&!entry)throw Error('Arena: posição narrativa inválida no save.');
  if(this._body.x!==l.x||this._body.width!==l.width||this._body.height!==l.height){this._body.move(l.x,l.y,l.width,l.height);this._body.createContents();}
  [this._header,this._body,this._footer].forEach(function(w){w.contents.clear();});
  var title=end?'Fim da demonstração M01':s.phase==='ria'?'Ria Silmane · Em um sonho':'Arena · Antes da prisão';
  paint(this._header,title,0,0,this._header.contentsWidth(),32,26);
  var text=end?$arenaNarrative.ending:entry.text.replace(/\{nome\}/g,$gameActors.actor(1).name());
  var font=l.w<700?22:24,line=font+7;this._body.contents.fontSize=font;
  this._page=MVNarrativePages.page(text,s.word,this._body.contentsWidth(),Math.max(1,Math.floor(this._body.contentsHeight()/line)),this._body.textWidth.bind(this._body));
  this._page.lines.forEach(function(t,i){paint(this._body,t,0,i*line,this._body.contentsWidth(),line,font);},this);
  var picture=end?$arenaNarrative.endingPicture:entry.picture;
  if(this._picture!==picture){this._picture=picture;this._art.bitmap=ImageManager.loadPicture(picture);this._art.bitmap.addLoadListener(function(){if(!this._terminated)this.placeArt();}.bind(this));}
  this._art.visible=true;this.placeArt();
  this._buttons=end?[{id:'save',text:'Salvar'},{id:'title',text:'Voltar ao título'}]:[{id:'back',text:'Voltar',disabled:!s.history.length},{id:'next',text:'Continuar'}];
  this._focus=Math.min(this._focus,this._buttons.length-1);
  var n=this._buttons.length,width=this._footer.contentsWidth()/n;
  this._buttons.forEach(function(b,i){var x=i*width;b.rect={x:this._footer.x+16+x,y:this._footer.y+8,width:width,height:44};if(i===this._focus)this._footer.contents.fillRect(x,0,width-6,28,'#285052');paint(this._footer,b.text,x+4,0,width-14,28,20,b.disabled?'#66716d':null,'center');},this);
 };
 Scene_ArenaNarrative.prototype.placeArt=function(){var a=layout().art,b=this._art.bitmap;if(!b||!b.width)return;var scale=Math.min(a.width/b.width,a.height/b.height);this._art.scale.set(scale,scale);this._art.x=a.x+(a.width-b.width*scale)/2;this._art.y=a.y+(a.height-b.height*scale)/2;};
 Scene_ArenaNarrative.prototype.action=function(id){
  var s=state(),b=this._buttons.filter(function(v){return v.id===id;})[0];if(!b||b.disabled)return;
  this.waitFresh();
  if(id==='save'){$gameTemp._arenaNarrativeSaveFence=true;SceneManager.push(Scene_Save);return;}
  if(id==='title'){s.phase='ended';store(s);$gameTemp._arenaNarrativeTitleFence=true;SceneManager.clearStack();SceneManager.goto(Scene_Title);return;}
  if(id==='back'){var prev=s.history.pop();s.phase=prev.phase;s.section=prev.section;s.word=prev.word;store(s);this.draw();return;}
  s.history.push({phase:s.phase,section:s.section,word:s.word});
  if(this._page.next<this._page.total)s.word=this._page.next;
  else if(s.phase==='intro'&&s.section===$arenaNarrative.sections.filter(function(v){return v.phase==='intro';}).length-1){s.phase='ria';s.section=0;s.word=0;}
  else if(s.phase==='ria'&&s.section===$arenaNarrative.sections.filter(function(v){return v.phase==='ria';}).length-1){
   if(ArenaQuests.snapshot().stage===0)ArenaQuests.begin();
   if(ArenaQuests.snapshot().stage!==10)throw Error('Arena: início de MQ01 incompatível com a introdução.');
   s.phase='dungeon';s.section=0;s.word=0;s.history=[];store(s);
   $gamePlayer.reserveTransfer($arenaDungeon.mapId,$arenaDungeon.start[0],$arenaDungeon.start[1],4,0);fence();SceneManager.clearStack();SceneManager.goto(Scene_Map);return;
  }else{s.section++;s.word=0;}
  store(s);this.draw();
 };
 Scene_ArenaNarrative.prototype.update=function(){
  if(this.size())this.build();Scene_MenuBase.prototype.update.call(this);
  if(this._awaitNeutral){if(!Input.isPressed('ok')&&!TouchInput.isPressed())this._awaitNeutral=false;return;}
  if(Date.now()<this._readyAt)return;
  if(Input.isTriggered('left')||Input.isTriggered('right')||Input.isTriggered('tab')){var d=Input.isTriggered('left')||Input.isPressed('shift')?-1:1;this._focus=(this._focus+d+this._buttons.length)%this._buttons.length;this.draw();}
  if(Input.isTriggered('cancel')){this.action('back');return;}
  if(Input.isTriggered('ok')){this.action(this._buttons[this._focus].id);return;}
  if(TouchInput.isTriggered())this._press=this._buttons.filter(function(b){return inside(b.rect,TouchInput.x,TouchInput.y);})[0]||null;
  if(TouchInput.isReleased()){var b=this._press;this._press=null;if(b&&inside(b.rect,TouchInput.x,TouchInput.y)){this._focus=this._buttons.indexOf(b);this.action(b.id);}}
 };
 Scene_ArenaNarrative.prototype.terminate=function(){this._terminated=true;Scene_MenuBase.prototype.terminate.call(this);Graphics.boxWidth=this._original.boxWidth;Graphics.boxHeight=this._original.boxHeight;Graphics.width=this._original.width;Graphics.height=this._original.height;};
 var loadSuccess=Scene_Load.prototype.onLoadSuccess;
 Scene_Load.prototype.onLoadSuccess=function(){loadSuccess.apply(this,arguments);if(active())SceneManager.goto(Scene_ArenaNarrative);};
 var mapStart=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){mapStart.apply(this,arguments);if(campaign())fence();};
 var mapUpdate=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){
  var f=$gameTemp._arenaNarrativeFence;if(f&&Date.now()>=f.until&&!Input.isPressed('ok')&&!TouchInput.isPressed())$gameTemp._arenaNarrativeFence=null;
  mapUpdate.apply(this,arguments);
  if(active()&&!$gameParty.inBattle()&&!SceneManager.isSceneChanging())SceneManager.goto(Scene_ArenaNarrative);
 };
 var canMove=Game_Player.prototype.canMove,trigger=Game_Player.prototype.triggerAction;
 Game_Player.prototype.canMove=function(){return !$gameTemp._arenaNarrativeFence&&canMove.apply(this,arguments);};
 Game_Player.prototype.triggerAction=function(){if($gameTemp._arenaNarrativeFence)return false;return trigger.apply(this,arguments);};
 var terminateMessage=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminateMessage.apply(this,arguments);if(campaign()&&state().phase==='dungeon')fence();};
 var commands=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){commands.apply(this,arguments);if(campaign())this._list=this._list.filter(function(c){return c.symbol!=='arenaDungeonExit';});};
 // Native save/title windows must also wait for release of the command that opened them.
 [[Scene_Save,Window_SavefileList,'_arenaNarrativeSaveFence'],[Scene_Title,Window_TitleCommand,'_arenaNarrativeTitleFence']].forEach(function(pair){
  var update=pair[0].prototype.update,ok=pair[1].prototype.processOk,key=pair[2];
  pair[0].prototype.update=function(){if(window.$gameTemp&&!Input.isPressed('ok')&&!TouchInput.isPressed())$gameTemp[key]=false;update.apply(this,arguments);};
  pair[1].prototype.processOk=function(){if(window.$gameTemp&&SceneManager._scene instanceof pair[0]&&$gameTemp[key])return;return ok.apply(this,arguments);};
 });
 var prevent=Input._shouldPreventDefault;
 Input._shouldPreventDefault=function(key){return key===9&&SceneManager._scene instanceof Scene_ArenaNarrative||prevent.apply(this,arguments);};
 // Keep the normal entry visible despite the accumulated technical title commands.
 var titleRows=Window_TitleCommand.prototype.numVisibleRows,titleWidth=Window_TitleCommand.prototype.windowWidth;
 Window_TitleCommand.prototype.numVisibleRows=function(){return Math.min(6,titleRows.apply(this,arguments));};
 Window_TitleCommand.prototype.windowWidth=function(){return Math.min(Graphics.boxWidth-48,Math.max(440,titleWidth.apply(this,arguments)));};
})();
