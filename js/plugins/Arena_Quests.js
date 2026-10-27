/*:
 * @plugindesc v0.1.0 MQ01, diário e recuperação idempotente de fontes importantes.
 * @author Codex
 * @help Após MV_QuestRules, Arena_Persistence, Arena_Loot, Arena_Dungeon e Arena_Encounters.
 * Dados/textos: ArenaQuests.json. Sem dependências externas.
 * API begin/takeKey/useDoor/reachGate/reconcile/openJournal. Sem introdução/F01.
 */
var ArenaQuests;
(function(){
 'use strict';
 if(!window.MVQuestRules||!window.ArenaEncounters)throw Error('Arena_Quests: dependências ausentes');
 DataManager._databaseFiles.push({name:'$arenaQuests',src:'ArenaQuests.json'});
 function cfg(){return window.$arenaQuests;}
 function quest(){return ArenaPersistence.snapshot().quests[cfg().questId];}
 function count(){return $gameParty.numItems($dataItems[cfg().itemId]);}
 function receipt(){var q=quest();return Object.keys(q.receipts).some(function(k){var r=q.receipts[k];return r.sourceId===cfg().sourceId&&r.itemId===cfg().itemId&&r.quantity===1&&['consume','deliver'].indexOf(r.kind)>=0;});}
 function view(){return {count:count(),receipt:receipt()};}
 function inMap(){return cfg()&&$gameMap&&$gameMap.mapId()===$arenaDungeon.mapId;}
 function move(to,before){var q=quest(),after=view();if(!MVQuestRules.transition(cfg().stages,q.stage,to,before,after))return false;var objectives=Object.assign({},q.objectives);if(to>=20)objectives.rubyKey=true;if(to>=30)objectives.cellDoor=true;if(to>=40)objectives.shiftGate=true;ArenaPersistence.setQuest(cfg().questId,to,objectives,to===40);return MVQuestRules.check(stage(to).entry,count(),receipt());}
 function stage(id){return cfg().stages.filter(function(s){return s.id===id;})[0];}
 function atomic(fn){
  var root=JsonEx.makeDeepCopy($gameSystem._persistentState),items=Object.assign({},$gameParty._items),switches=Object.assign({},$gameSelfSwitches._data),transitions=JsonEx.makeDeepCopy($gameMap._arenaDoorTransitions||{});
  function restore(){$gameSystem._persistentState=root;$gameParty._items=items;$gameSelfSwitches._data=switches;$gameMap._arenaDoorTransitions=transitions;$gameMap.requestRefresh();reconcile();}
  try{var result=fn();if(result===false)restore();else reconcile();return result;}catch(e){restore();throw e;}
 }
 var reconciling=false;
 function reconcile(){
  if(reconciling||!cfg()||!$gameSystem||!$gameParty)return;
  reconciling=true;try{
   var q=quest(),n=count(),used=receipt();
   if(q.stage>=10&&q.stage<=20&&n>1)$gameParty.loseItem($dataItems[cfg().itemId],n-1,false);
   if(q.stage>=30&&used&&n>0)$gameParty.loseItem($dataItems[cfg().itemId],n,false);
   if(inMap()){
    var source=ArenaPersistence.sourceStatus(cfg().sourceId);
    $gameSelfSwitches.setValue([$arenaDungeon.mapId,$arenaDungeon.keyEvent,'A'],!(source.active&&source.missing>0));
    if(q.stage>=30&&used){var d=ArenaDungeon.door(cfg().doorId),t=($gameMap._arenaDoorTransitions||{})[d.id];if(t&&!t.open)delete $gameMap._arenaDoorTransitions[d.id];if(!t||!t.open)d.eventIds.forEach(function(id){$gameSelfSwitches.setValue([$arenaDungeon.mapId,id,'A'],true);});}
   }
  }finally{reconciling=false;}
 }
 var nativeDoor=ArenaDungeon.setDoor;
 ArenaQuests={
  snapshot:quest,
  begin:function(){if(quest().stage!==0)return false;ArenaPersistence.setQuest(cfg().questId,10,{},false);reconcile();return true;},
  takeKey:function(){
   if(!inMap()||$gameMap.distance($gamePlayer.x,$gamePlayer.y,$arenaDungeon.key[0],$arenaDungeon.key[1])>1)return false;
   var ok=atomic(function(){if([10,20].indexOf(quest().stage)<0)return false;var r=ArenaPersistence.claimSource(cfg().sourceId);if(['granted','present'].indexOf(r)<0)return false;reconcile();return quest().stage===20||move(20,view());});
   if(ok)$gameMessage.add('Chave de rubi obtida.');return ok;
  },
  useDoor:function(){
   if(!inMap())return false;
   if(quest().stage>=30&&receipt())return nativeDoor.call(ArenaDungeon,cfg().doorId,true);
   var t=($gameMap._arenaDoorTransitions||{})[cfg().doorId];if(t)return false;
   var ok=atomic(function(){reconcile();if(quest().stage===10&&count()>=1&&!move(20,view()))return false;if(quest().stage!==20||!MVQuestRules.check(stage(20).exit,count(),receipt()))return false;
    var before=view();if(ArenaPersistence.consumeImportant(cfg().sourceId,cfg().receiptId,'consume')!=='consumed')return false;
    if(!move(30,before))return false;return nativeDoor.call(ArenaDungeon,cfg().doorId,true);
   });
   $gameMessage.add(ok?'A chave de rubi abre a cela.':'A porta está trancada.\nProcure a chave junto à parede norte.');return ok;
  },
  reachGate:function(){
   if(!inMap()||$gameMap.distance($gamePlayer.x,$gamePlayer.y,$arenaDungeon.gateApproach[0],$arenaDungeon.gateApproach[1])>1||quest().stage!==30)return false;
   var ok=atomic(function(){if(!move(40,view()))return false;ArenaEncounters.completeArea();return true;});
   if(ok)$gameMessage.add('Objetivo MQ01 concluído.\nEncerramento narrativo reservado ao M01-18.');return ok;
  },
  reconcile:reconcile,
  treasure:function(index){
   if(!inMap()||[30,40].indexOf(quest().stage)<0||!receipt())return false;
   var source=$arenaDungeon.integration.treasures[index];if(!source||$gameMap.distance($gamePlayer.x,$gamePlayer.y,source.position[0],source.position[1])>1)return false;
   var id='MQ01.treasure.'+source.eventId,token='container/'+id;if(ArenaLoot.snapshot().receipts[token])return false;
   var result=ArenaLoot.claimContainer(id,$arenaLoot.enemies[String(cfg().treasureTableEnemyId)]),lines=result.received.map(function(r){var item=r.kind==='item'?$dataItems[r.id]:r.kind==='weapon'?$dataWeapons[r.id]:r.kind==='armor'?$dataArmors[r.id]:null;return (item?item.name:'Ouro')+' ×'+r.quantity;});
   ($gameMap._arenaTreasurePreview||($gameMap._arenaTreasurePreview={}))[index]=2;
   $gameMessage.add('Tesouro coletado.\n'+(lines.length?lines.join('\n'):'Nenhuma recompensa nesta fonte.')+(result.pending.length?'\nReserva salva para quando houver espaço.':''));return true;
  },
  openJournal:function(){SceneManager.push(Scene_ArenaJournal);}
 };
 ArenaDungeon.setDoor=function(id,open){if(cfg()&&id===cfg().doorId){if(!open)return false;return ArenaQuests.useDoor();}return nativeDoor.apply(this,arguments);};
 var inspect=ArenaDungeon.inspectTreasure;
 ArenaDungeon.inspectTreasure=function(index){return cfg()?ArenaQuests.treasure(index):inspect.apply(this,arguments);};
 var gain=Game_Party.prototype.gainItem;
 Game_Party.prototype.gainItem=function(item){gain.apply(this,arguments);if(cfg()&&item&&item===$dataItems[cfg().itemId])reconcile();};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(inMap()&&!$gameSystem._arenaEncounterTechnical&&quest().stage===0){
   // Old unstarted exploration lab saves may be outside an already-open cell.
   // Safe checkpoint bootstrap preserves actor/resources/inventory, never invents key use.
   ArenaQuests.begin();$gamePlayer.locate($arenaDungeon.start[0],$arenaDungeon.start[1]);$gamePlayer.center($gamePlayer.x,$gamePlayer.y);var d=ArenaDungeon.door(cfg().doorId);delete ($gameMap._arenaDoorTransitions||{})[d.id];d.eventIds.forEach(function(id){$gameSelfSwitches.setValue([$arenaDungeon.mapId,id,'A'],false);});
  }reconcile();if(inMap())$arenaDungeon.integration.treasures.forEach(function(t,i){if(ArenaLoot.snapshot().receipts['container/MQ01.treasure.'+t.eventId])($gameMap._arenaTreasurePreview||($gameMap._arenaTreasurePreview={}))[i]=2;});};
 var there=Game_Player.prototype.checkEventTriggerThere;
 Game_Player.prototype.checkEventTriggerThere=function(triggers){if(inMap()&&triggers.indexOf(0)>=0){var s=ArenaPersistence.sourceStatus(cfg().sourceId),x=$gameMap.roundXWithDirection(this.x,this.direction()),y=$gameMap.roundYWithDirection(this.y,this.direction());if(s.active&&s.missing&&x===$arenaDungeon.key[0]&&y===$arenaDungeon.key[1]){$gameMap.event($arenaDungeon.keyEvent).start();return;}}return there.apply(this,arguments);};
 function wrapped(win,text,x,y,width,lineHeight){var words=text.split(/\s+/),line='';words.forEach(function(word){var next=line?line+' '+word:word;if(win.textWidth(next)>width&&line){win.drawText(line,x,y,width);y+=lineHeight;line=word;}else line=next;});if(line){win.drawText(line,x,y,width);y+=lineHeight;}return y;}
 function Journal(){this.initialize.apply(this,arguments);}
 Journal.prototype=Object.create(Window_Selectable.prototype);Journal.prototype.constructor=Journal;
 Journal.prototype.initialize=function(){Window_Selectable.prototype.initialize.call(this,28,48,Graphics.boxWidth-56,Graphics.boxHeight-96);this._top=0;this.refresh();this.activate();};
 Journal.prototype.refresh=function(){this.contents.clear();this.contents.fontSize=24;this.changeTextColor('#d2bf84');this.drawText(cfg().title,8,0,this.contentsWidth()-16);this.resetTextColor();this.contents.fontSize=19;var q=quest(),lines=[q.completed?'Concluída':q.stage?'Em andamento':'Não iniciada'];if(q.stage&&stage(q.stage)){cfg().stages.filter(function(s){return s.id<=q.stage;}).forEach(function(s){lines.push('',s.id<q.stage?'Etapa concluída':'Etapa atual',s.description);});if(!q.completed)lines.push('',stage(q.stage).objective);if(q.stage===20&&count()===0&&!receipt())lines.push('A chave está ausente: volte à fonte na cela.');if(q.stage>=30&&!receipt())lines.push('Registro de uso ausente: progresso bloqueado para revisão.');}else if(q.stage)lines.push('Etapa de laboratório não reconhecida.','Nenhuma transição automática será aplicada.');else lines.push('Nenhuma instrução de MQ01 recebida.');var y=44-this._top,context=this.contents._context;context.save();context.beginPath();context.rect(0,40,this.contentsWidth(),this.contentsHeight()-75);context.clip();lines.forEach(function(t){y=wrapped(this,t,8,y,this.contentsWidth()-16,28);},this);context.restore();this._total=y+this._top;this.contents.fontSize=16;this.changeTextColor('#b0b6ab');this.contents.fillRect(0,this.contentsHeight()-28,this.contentsWidth(),28,'#101c20');this.drawText('↑↓ / roda / arraste: rolar · Esc / Voltar: fechar',8,this.contentsHeight()-30,this.contentsWidth()-16);};
 Journal.prototype.update=function(){Window_Selectable.prototype.update.call(this);var delta=Input.isRepeated('down')?28:Input.isRepeated('up')?-28:TouchInput.wheelY>=20?28:TouchInput.wheelY<=-20?-28:0;if(TouchInput.isTriggered())this._dragY=TouchInput.y;if(TouchInput.isPressed()&&this._dragY!==undefined){delta+=this._dragY-TouchInput.y;this._dragY=TouchInput.y;}if(!TouchInput.isPressed())this._dragY=undefined;if(delta){this._top=Math.max(0,Math.min(Math.max(0,this._total-this.contentsHeight()+45),this._top+delta));this.refresh();}};
 function Scene_ArenaJournal(){this.initialize.apply(this,arguments);}
 Scene_ArenaJournal.prototype=Object.create(Scene_MenuBase.prototype);Scene_ArenaJournal.prototype.constructor=Scene_ArenaJournal;
 function Back(){this.initialize.apply(this,arguments);}
 Back.prototype=Object.create(Window_Command.prototype);Back.prototype.constructor=Back;
 Back.prototype.windowWidth=function(){return 150;};
 Back.prototype.makeCommandList=function(){this.addCommand('Voltar','back');};
 Scene_ArenaJournal.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);this._journal=new Journal();this._journal.y=84;this._journal.height=Graphics.boxHeight-112;this._journal.createContents();this._journal.refresh();ArenaBattleUI.theme(this._journal);this._journal.setHandler('cancel',this.popScene.bind(this));this.addWindow(this._journal);var b=new Back(Graphics.boxWidth-178,0);b.setHandler('back',this.popScene.bind(this));this.addWindow(b);};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);this.addCommand('Diário','arenaJournal',!!ArenaCharacterCreation.isCreated());};
 var create=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaJournal',ArenaQuests.openJournal);};
})();
