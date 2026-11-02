/*:
 * @plugindesc v0.1.0 Stonekeep integral: transferência funcional isolada, sem substituir campanha.
 * @author Codex
 * @help Após Stonekeep, Encounters, DebugHub e RuntimeProof. Map015/ArenaStonekeepWhole.json.
 * Usa IDs lógicos e mecanismos existentes; slots pessoais bloqueados pelo laboratório.
 * Sem alterações de motor, recompensas, carga sintética ou transições internas.
 */
var ArenaStonekeepWhole;
(function(){'use strict';var pending=false;
 DataManager._databaseFiles.push({name:'$arenaStonekeepWhole',src:'ArenaStonekeepWhole.json'});
 function c(){return $arenaStonekeepWhole;}
 function active(){return !!($gameSystem&&$gameSystem._arenaStonekeepWholeSession&&ArenaContinuation.labActive());}
 function here(){return active()&&$gameMap.mapId()===c().mapId;}
 function neutral(){Input.clear();TouchInput.clear();$gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+180};}
 function transfer(){
  if(!ArenaContinuation.labActive()||$gameParty.inBattle()||$gamePlayer.isTransferring()||$gameMessage.isBusy()||$gameMap.mapId()!==$arenaStonekeep.mapId)return false;
  var x=$gamePlayer.x+c().coordinates.delta[0],y=$gamePlayer.y+c().coordinates.delta[1],direction=$gamePlayer.direction();
  $gameSystem._arenaStonekeepWholeSession=true;neutral();$gamePlayer.reserveTransfer(c().mapId,x,y,direction,0);return true;
 }
 ArenaStonekeepWhole={active:active,here:here,
  preview:function(){if(!ArenaStonekeep.preview())return false;pending=true;return true;},
  transferFromSample:transfer,
  jump:function(i){if(!here()||$gameParty.inBattle()||$gameMessage.isBusy()||!c().points[i])return false;var p=c().points[i].position;if([4,5].indexOf($gameMap.regionId(p[0],p[1]))<0||$gameMap.eventsXyNt(p[0],p[1]).some(function(e){return e.isNormalPriority();}))return false;neutral();$gamePlayer.locate(p[0],p[1]);$gamePlayer.center(p[0],p[1]);$gamePlayer.refreshBushDepth();return true;}
 };
 // A session-scoped view, not a mutation of campaign data or persistence IDs.
 var configuration=ArenaStonekeep.configuration;
 ArenaStonekeep.configuration=function(){return active()?c().context:configuration.apply(this,arguments);};
 var forMap=ArenaCampaignConfig.forMap,encounters=ArenaCampaignConfig.encounters;
 ArenaCampaignConfig.forMap=function(mapId){if(active()&&mapId===c().mapId){var a=ArenaCampaignConfig.area(c().areaId);return a.ok?{ok:true,config:Object.assign({},a.config,{mapId:c().mapId,encounters:c().encounters})}:a;}return forMap.apply(this,arguments);};
 ArenaCampaignConfig.encounters=function(areaId){return here()&&areaId===c().areaId?{ok:true,config:c().encounters}:encounters.apply(this,arguments);};
 var onExit=ArenaEncounters.onExit;
 ArenaEncounters.onExit=function(areaId){
  // Rebase of the same physical area is not an exit/respawn opportunity.
  if(active()&&areaId===c().areaId&&$gameMap.mapId()===c().coordinates.oldMapId&&$gamePlayer.isTransferring()&&$gamePlayer._newMapId===c().mapId)return false;
  return onExit.apply(this,arguments);
 };
 var loaded=DataManager.isDatabaseLoaded,registered=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!registered){
  var cfg=c(),original=ArenaCampaignConfig.encounters('stonekeep');
  if(!cfg||cfg.version!==1||cfg.mapId!==15||!$dataMapInfos[15]||cfg.context.mapId!==15||cfg.context.sourceId!==$arenaStonekeep.sourceId||!original.ok||JSON.stringify(cfg.encounters.entries.slice(0,original.config.entries.length).map(function(e){return e.id;}))!==JSON.stringify(original.config.entries.map(function(e){return e.id;})))throw Error('Stonekeep integral: vínculos de mapa/fonte/encontros inválidos. Reconstrua build-stonekeep-whole.');
  ArenaDungeon.registerSwimming(cfg.mapId,cfg.context.swimming);ArenaDungeon.registerDoors(cfg.mapId,{mapId:cfg.mapId,doors:cfg.doors,doorAnimationFrames:cfg.doorAnimationFrames});registered=true;
 }return true;};
 var onMapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){if(here()&&!$gamePlayer.isTransferring())c().doors.forEach(function(d){d.eventIds.forEach(function(id){if(!$gameMap.event(id))$gameMap._events[id]=new Game_Event(c().mapId,id);});});onMapLoaded.apply(this,arguments);};
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(pending&&ArenaContinuation.labActive()&&$gameMap.mapId()===$arenaStonekeep.return.mapId&&!$gamePlayer.isTransferring()){
  pending=false;$gameSystem._arenaStonekeepWholeSession=true;var d=c().context.entry;neutral();$gamePlayer.reserveTransfer(d.mapId,d.x,d.y,d.direction,0);
 }};
 function Commands(){this.initialize.apply(this,arguments);}Commands.prototype=Object.create(Window_Command.prototype);Commands.prototype.constructor=Commands;
 Commands.prototype.windowWidth=function(){return Graphics.boxWidth-32;};Commands.prototype.windowHeight=function(){return Graphics.boxHeight-104;};Commands.prototype.standardFontSize=function(){return 20;};Commands.prototype.itemHeight=function(){return 32;};
 Commands.prototype.makeCommandList=function(){c().points.forEach(function(p,i){this.addCommand(p.name+' ('+p.position.join(',')+')','point',true,i);},this);this.addCommand('Voltar à exploração','cancel');this.addCommand('Sair da sessão → título','leave');};
 function Points(){this.initialize.apply(this,arguments);}Points.prototype=Object.create(Scene_MenuBase.prototype);Points.prototype.constructor=Points;
 Points.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);var help=new Window_Base(16,8,Graphics.boxWidth-32,72);help.contents.fontSize=18;help.drawText('Base integral · pontos de inspeção · sem controles de carga',0,0,help.contentsWidth());this.addWindow(help);var w=this._choices=new Commands(16,88);w.setHandler('point',function(){if(ArenaStonekeepWhole.jump(w.currentExt()))SceneManager.pop();else{SoundManager.playBuzzer();w.activate();}});w.setHandler('cancel',function(){neutral();SceneManager.pop();});w.setHandler('leave',function(){neutral();ArenaContinuation.leaveLab();});this.addWindow(w);w.deactivate();this._armed=false;};
 Points.prototype.update=function(){Scene_MenuBase.prototype.update.call(this);if(!this._armed&&!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){this._armed=true;this._choices.activate();}};
 var menu=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(here())this.addCommand('Stonekeep: pontos da base integral','arenaStonekeepWholePoints');};
 var create=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaStonekeepWholePoints',function(){SceneManager.goto(Points);});};
 ArenaDebugHub.register({symbol:'arenaStonekeepWhole',name:'Stonekeep · base integral (RAM)',category:'campaign',description:'Planta274×274 contínua,49 encontros/32 portas. A2/B2: fechaduras comuns e passagem seca funcionais; espécies pendentes. Esc: pontos/RAM.',saving:'Somente sessão RAM · slots normais bloqueados · campanha ainda no Map012'},ArenaStonekeepWhole.preview);
})();
