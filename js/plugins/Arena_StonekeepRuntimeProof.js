/*:
 * @plugindesc v0.1.0 Prova isolada de mapa274; não muda limites do motor.
 * @author Codex
 * @help Após DebugHub/FangCells e os núcleos atuais. Somente Map014 + laboratório.
 * Geometria/visuais provisórios, carga180 sem batalha, recompensas ou quests.
 * Checkpoint de posições/patrulhas em sessionStorage próprio, nunca slots pessoais.
 */
var ArenaStonekeepRuntimeProof;
(function(){'use strict';var pending=false,count=180;
 DataManager._databaseFiles.push({name:'$arenaStonekeepRuntimeProof',src:'ArenaStonekeepRuntimeProof.json'});
 function c(){return $arenaStonekeepRuntimeProof;}
 function here(){return $gameMap&&window.$arenaStonekeepRuntimeProof&&$gameMap.mapId()===c().mapId&&ArenaContinuation.labActive();}
 function neutral(){Input.clear();TouchInput.clear();$gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+180};}
 function validPoint(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&$gameMap.isValid(x,y)&&[4,5].indexOf($gameMap.regionId(x,y))>=0;}
 function capture(){return {version:c().version,mapId:c().mapId,count:count,player:{x:$gamePlayer.x,y:$gamePlayer.y,direction:$gamePlayer.direction()},events:c().entries.map(function(v){var e=$gameMap.event(v.eventId);return {id:v.eventId,x:e.x,y:e.y,direction:e.direction(),pattern:e.pattern(),active:!e._erased};})};}
 function restore(s){
  if(!s||s.version!==c().version||s.mapId!==c().mapId||[0,60,180].indexOf(s.count)<0||!s.player||!validPoint(s.player.x,s.player.y)||[2,4,6,8].indexOf(s.player.direction)<0||!Array.isArray(s.events)||s.events.length!==180)return false;
  var seen={};if(s.events.some(function(v){if(!v||!Number.isInteger(v.id)||v.id<1||v.id>180||seen[v.id]||!validPoint(v.x,v.y)||$gameMap.regionId(v.x,v.y)!==4||!MVEncounterRules.within(v.x,v.y,c().entries[v.id-1].origin,3)||[2,4,6,8].indexOf(v.direction)<0||!Number.isInteger(v.pattern)||v.pattern<0||v.pattern>2||typeof v.active!=='boolean'||v.active!==(v.id<=s.count))return true;seen[v.id]=true;return false;}))return false;
  count=s.count;$gameMap._arenaProofDensity=s.count;s.events.forEach(function(v){var e=$gameMap.event(v.id);e._erased=!v.active;e.refresh();e.locate(v.x,v.y);e.setDirection(v.direction);e.setPattern(v.pattern);});$gamePlayer.locate(s.player.x,s.player.y);$gamePlayer.setDirection(s.player.direction);$gamePlayer.center(s.player.x,s.player.y);$gamePlayer.refreshBushDepth();neutral();return true;
 }
 ArenaStonekeepRuntimeProof={
  preview:function(){if(!ArenaStonekeep.preview())return false;pending=true;return true;},
  active:here,
  density:function(n){if(!here()||[0,60,180].indexOf(n)<0)return false;count=n;$gameMap._arenaProofDensity=n;c().entries.forEach(function(v){var e=$gameMap.event(v.eventId);e._erased=v.eventId>n;e.refresh();});return true;},
  count:function(){return count;},
  jump:function(i){if(!here()||!c().points[i])return false;var p=c().points[i].position;$gamePlayer.locate(p[0],p[1]);$gamePlayer.center(p[0],p[1]);$gamePlayer.refreshBushDepth();neutral();return true;},
  checkpoint:function(){return here()?capture():null;},
  store:function(){if(!here())return false;try{sessionStorage.setItem(c().technicalStorageKey,JSON.stringify(capture()));return true;}catch(e){return false;}},
  load:function(){if(!here())return false;try{return restore(JSON.parse(sessionStorage.getItem(c().technicalStorageKey)));}catch(e){return false;}},
  open:function(){if(!here())return false;neutral();SceneManager.push(ProofMenu);return true;},
  leave:function(){if(here()){neutral();ArenaContinuation.leaveLab();return true;}return false;}
 };
 var loaded=DataManager.isDatabaseLoaded,registered=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!registered){if(!c()||c().version!==1||c().mapId!==14||c().size[0]!==274||c().size[1]!==274||!Array.isArray(c().entries)||c().entries.length!==180||!$dataMapInfos[14])throw Error('Prova Stonekeep: configuração técnica inválida.');ArenaDungeon.registerSwimming(c().mapId,c().swimming);registered=true;}return true;};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===$arenaRihad.arrival.mapId&&!$gamePlayer.isTransferring()){pending=false;var p=c().points[0].position;$gamePlayer.reserveTransfer(c().mapId,p[0],p[1],2,0);}if(here()){count=Number.isInteger($gameMap._arenaProofDensity)?$gameMap._arenaProofDensity:180;c().entries.forEach(function(v){$gameMap.event(v.eventId)._proofTick=0;});ArenaStonekeepRuntimeProof.density(count);}};
 var move=Game_Event.prototype.updateSelfMovement;
 Game_Event.prototype.updateSelfMovement=function(){if(!here()||this._mapId!==c().mapId||this.eventId()>180)return move.apply(this,arguments);if(this._erased||this._locked||this.isMoving())return;this._proofTick=(this._proofTick||0)+1;if(this._proofTick%45)return;var v=c().entries[this.eventId()-1],d=[2,4,6,8][Math.randomInt(4)],nx=$gameMap.roundXWithDirection(this.x,d),ny=$gameMap.roundYWithDirection(this.y,d);if(MVEncounterRules.within(nx,ny,v.origin,3)&&$gameMap.regionId(nx,ny)===4&&this.canPass(this.x,this.y,d))this.moveStraight(d);};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(here()){this.addCommand('Prova274: pontos / carga / checkpoint','arenaStonekeepProof');this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');}};
 var create=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaStonekeepProof',function(){SceneManager.goto(ProofMenu);});};
 function Commands(){this.initialize.apply(this,arguments);}Commands.prototype=Object.create(Window_Command.prototype);Commands.prototype.constructor=Commands;
 Commands.prototype.windowWidth=function(){return Graphics.boxWidth-32;};Commands.prototype.windowHeight=function(){return Graphics.boxHeight-100;};Commands.prototype.standardFontSize=function(){return 20;};Commands.prototype.itemHeight=function(){return 32;};
 Commands.prototype.makeCommandList=function(){c().points.forEach(function(p,i){this.addCommand('Ir: '+p.name+' ('+p.position.join(',')+')','point',true,i);},this);[0,60,180].forEach(function(n){this.addCommand('Carga: '+n+' patrulhas técnicas','density',true,n);},this);this.addCommand('Guardar posições/patrulhas nesta aba','store');this.addCommand('Restaurar checkpoint desta aba','load');this.addCommand('Retornar à exploração','cancel');this.addCommand('Sair do laboratório → título','leave');};
 function ProofMenu(){this.initialize.apply(this,arguments);}ProofMenu.prototype=Object.create(Scene_MenuBase.prototype);ProofMenu.prototype.constructor=ProofMenu;
 ProofMenu.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);this._help=new Window_Base(16,8,Graphics.boxWidth-32,72);this._help.contents.fontSize=18;this._help.drawText('Prova274 · sem batalha/quest · checkpoint só desta aba',0,0,this._help.contentsWidth());this.addWindow(this._help);this._commands=new Commands(16,88);var self=this,w=this._commands;
 function action(fn){var ok=fn();SoundManager[ok?'playOk':'playBuzzer']();if(ok)SceneManager.pop();else w.activate();}
 w.setHandler('point',function(){action(function(){return ArenaStonekeepRuntimeProof.jump(w.currentExt());});});w.setHandler('density',function(){action(function(){return ArenaStonekeepRuntimeProof.density(w.currentExt());});});w.setHandler('store',function(){action(ArenaStonekeepRuntimeProof.store);});w.setHandler('load',function(){action(ArenaStonekeepRuntimeProof.load);});w.setHandler('cancel',function(){neutral();SceneManager.pop();});w.setHandler('leave',ArenaStonekeepRuntimeProof.leave);this.addWindow(w);};
 var displays=Scene_Map.prototype.createDisplayObjects,update=Scene_Map.prototype.update;
 Scene_Map.prototype.createDisplayObjects=function(){displays.apply(this,arguments);if(here()){this._proofHUD=new Sprite(new Bitmap(Graphics.boxWidth,80));this.addChild(this._proofHUD);}};
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(!here()||!this._proofHUD)return;var b=this._proofHUD.bitmap;b.clear();b.fillAll('rgba(8,16,22,.9)');b.fontSize=21;b.textColor='#e9d8b0';b.drawText('Stonekeep274 · técnica · ('+$gamePlayer.x+','+$gamePlayer.y+') · '+count+' patrulhas',12,0,b.width-24,30);b.fontSize=16;b.drawText('C: pontos/checkpoint · Esc: menu · visuais de carga não são novos inimigos',12,36,b.width-24,26);if($gamePlayer.canMove()&&!$gameMessage.isBusy()&&Input.isTriggered(Input.keyMapper[67]))ArenaStonekeepRuntimeProof.open();};
 ArenaDebugHub.register({symbol:'arenaStonekeepRuntimeProof',name:'Stonekeep · mapa274 (RAM)',category:'campaign',description:'Planta inteira em um mapa. Até180 patrulhas de carga, sem combate. C: pontos distantes e checkpoint desta aba.',saving:'RAM + checkpoint próprio sessionStorage; slots normais bloqueados'},ArenaStonekeepRuntimeProof.preview);
})();
