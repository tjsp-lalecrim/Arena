/*:
 * @plugindesc v0.5.0 Rihad: NPCs regionais, pousada e orientação.
 * @author Codex
 * @help Após Arena_CampaignConfig e Arena_Continuation. ArenaRihad.json.
 * Chegada real conserva recursos. Amostra técnica usa fixtures/RAM existentes;
 * slots e backups normais permanecem bloqueados nela. Corte e visão de Ria em plugins próprios.
 * Veja doc/CHEGADA_RIHAD_M02_03A.md. Sem parâmetros/dependências externas.
 */
var ArenaRihad;
(function(){
 'use strict';var configured=false;
 function regional(id){return $arenaRihad.regionalNpcs.filter(function(n){return n.id===id;})[0];}
 DataManager._databaseFiles.push({name:'$arenaRihad',src:'ArenaRihad.json'});
 var loaded=DataManager.isDatabaseLoaded;
 DataManager.isDatabaseLoaded=function(){
  if(!loaded.apply(this,arguments))return false;
  if(!configured){
   var c=$arenaRihad,r=c&&ArenaCampaignConfig.area(c.areaId);
   if(!c||c.schemaVersion!==1||!r.ok||r.config.mapId!==c.arrival.mapId)throw Error('Rihad: vínculo de chegada inválido.');
   var o=c.outskirts,a=o&&ArenaCampaignConfig.area(o.areaId);
   if(!o||!a.ok||a.config.mapId!==o.entry.mapId||o.return.mapId!==c.arrival.mapId||!ArenaCampaignConfig.encounters(o.areaId).ok)throw Error('Rihad: vínculo dos arredores inválido.');
   var visual=c.informantVisual;if(!visual||!visual.characterName||!visual.faceName||visual.faceIndex!==0||visual.direction!==2)throw Error('Rihad: apresentação do informante inválida.');
   var inn=c.inn,area=inn&&ArenaCampaignConfig.area(inn.areaId);
   var point=$arenaRecovery.restPoints.filter(function(p){return p.id===c.restPointId;})[0];
   if(!inn||!area.ok||area.config.mapId!==inn.entry.mapId||!point||point.mapId!==inn.entry.mapId||point.eventId!==inn.bedEventId)throw Error('Rihad: vínculo da pousada ou cama inválido.');
   if(!Array.isArray(c.regionalNpcs)||c.regionalNpcs.length<3||c.regionalNpcs.some(function(n,i,a){return !n.id||a.some(function(other,j){return j!==i&&(other.id===n.id||other.mapId===n.mapId&&other.eventId===n.eventId);})||!n.characterName||!n.faceName||!n.texts||n.mapId!==9&&n.mapId!==18;}))throw Error('Rihad: configuração de NPCs regionais inválida.');
   ArenaContinuation.registerCampaignDestination(c.arrival);configured=true;
  }return true;
 };
 function here(){return $gameMap&&$gameMap.mapId()===$arenaRihad.arrival.mapId;}
 function inInn(){return $gameMap&&$gameMap.mapId()===$arenaRihad.inn.entry.mapId;}
 function urban(){return here()||inInn();}
 function outside(){return $gameMap&&$gameMap.mapId()===$arenaRihad.outskirts.entry.mapId;}
 function route(interpreter,from,eventId,to){
  var q=ArenaQuests.snapshot('MQ02'),e=$gameMap.event(eventId);
  if(!q||q.stage<10||!ArenaNarrative.isCampaign()||$gameParty.inBattle()||$gamePlayer.isTransferring()||$gameMessage.isBusy()||
   $gameMap.mapId()!==from||!(interpreter instanceof Game_Interpreter)||interpreter.eventId()!==eventId||interpreter._mapId!==from||!e||e._erased||$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1)return false;
  $gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+150};
  $gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);return true;
 }
 function message(interpreter,texts){
  if(!here()||$gameParty.inBattle()||$gameMessage.isBusy()||!(interpreter instanceof Game_Interpreter))return false;
  var visual=$arenaRihad.informantVisual;return ArenaCourt.show(interpreter,texts,interpreter.eventId()===$arenaRihad.informantEventId?{name:visual.faceName,index:visual.faceIndex}:null);
 }
 function gateDestinations(){
  var list=[{id:'outskirts',name:'Ir aos Arredores de Rihad',to:$arenaRihad.outskirts.entry}];
  if(window.ArenaStonekeep&&ArenaStonekeep.known())list.push({id:'stonekeep',name:'Viajar para Stonekeep',to:ArenaStonekeep.configuration().entry});
  if(window.ArenaFangCells&&ArenaFangCells.destination().available)list.push({id:'fang',name:'Viajar para Fang Lair',to:{mapId:$arenaFangCells.mapId,x:$arenaFangCells.entry[0],y:$arenaFangCells.entry[1],direction:2}});
  return list;
 }
 function guidance(){
  var q=ArenaQuests.snapshot('MQ02'),stage=q&&q.stage||0;
  if(stage<20)return 'square';
  // The court gives the assignment and later receives the recovered parchment.
  if(stage<40||stage>=50&&stage<60)return 'court';
  return 'gate';
 }
 ArenaRihad={
  inform:function(i){
   var way=guidance();
   if(way==='square')return message(i,['Para descansar, siga ao sul pelo passeio escuro. Na primeira curva, vire a oeste. Siga as placas até a Pousada do portão.',
    'Para ganhar experiência, volte ao portão urbano, ao norte, e escolha Ir aos Arredores de Rihad. Há ratos junto à estrada. Pode voltar pelo mesmo caminho e descansar na pousada.']);
   if(way==='court')return message(i,['Siga as placas da Corte pelas ruas ao sul.',
    'Junto à muralha sul, passe pela grade e entre pela porta de madeira.']);
   return message(i,['Para sair da cidade ou viajar, siga as placas do Portão urbano pelas ruas ao norte.']);
  },
  enterInn:function(i){var c=$arenaRihad.inn;return route(i,c.exit.mapId,c.accessEventId,c.entry);},
  leaveInn:function(i){var c=$arenaRihad.inn;return route(i,c.entry.mapId,c.exitEventId,c.exit);},
  innkeeper:function(i){
   var c=$arenaRihad.inn,e=$gameMap.event(c.keeperEventId);
   if(!inInn()||!ArenaNarrative.isCampaign()||$gameParty.inBattle()||$gameMessage.isBusy()||
     !(i instanceof Game_Interpreter)||i.eventId()!==c.keeperEventId||i._mapId!==c.entry.mapId||
     !e||$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1)return false;
   var npc=regional('rihad.inn.keeper');return ArenaCourt.show(i,npc.texts,{name:npc.faceName,index:0});
  },
  talkRegional:function(i,id){var npc=regional(id),e=npc&&$gameMap.event(npc.eventId);
   if(!npc||npc.key==='innkeeper'||$gameMap.mapId()!==npc.mapId||!ArenaNarrative.isCampaign()||$gameParty.inBattle()||$gameMessage.isBusy()||$gamePlayer.isTransferring()||!(i instanceof Game_Interpreter)||i._mapId!==npc.mapId||i.eventId()!==npc.eventId||!e||e._erased||$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1||ArenaQuests.snapshot('MQ02').stage<10)return false;
   var texts=ArenaQuests.snapshot('MQ02').stage<20&&npc.textsBeforeRia?npc.textsBeforeRia:npc.texts;return ArenaCourt.show(i,texts,{name:npc.faceName,index:0});
  },
  arrivalNotice:function(i){return ArenaRihad.offerGate(i);},
  offerGate:function(i){
   var gate=$gameMap.event(3);
   if(!here()||!ArenaNarrative.isCampaign()||$gameParty.inBattle()||$gameMessage.isBusy()||$gamePlayer.isTransferring()||!(i instanceof Game_Interpreter)||i._mapId!==$gameMap.mapId()||i.eventId()!==3||!gate||$gameMap.distance(gate.x,gate.y,$gamePlayer.x,$gamePlayer.y)>1||ArenaQuests.snapshot('MQ02').stage<10)return false;
   var destinations=gateDestinations(),names=destinations.map(function(v){return v.name;}).concat(['Ficar em Rihad']);
   var list=[{code:102,indent:0,parameters:[names,names.length-1,names.length-1,2,0]}];
   destinations.forEach(function(v,n){list.push({code:402,indent:0,parameters:[n,v.name]},{code:355,indent:1,parameters:['ArenaRihad.travelFromGate(this,'+JSON.stringify(v.id)+');']});});
   list.push({code:402,indent:0,parameters:[names.length-1,'Ficar em Rihad']},{code:404,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});i.setupChild(list,i.eventId());return true;
  },
  travelFromGate:function(i,id){if(!(i instanceof Game_Interpreter))return false;var destinations=gateDestinations(),index=destinations.findIndex(function(v){return v.id===id;});
   if(index<0||i._branch[0]!==index)return false;return ArenaWorldMap.fromGate(i,id);
  },
  preview:function(){return ArenaContinuation.previewArrival($arenaRihad.arrival,true);},
  visitOutskirts:function(i){var o=$arenaRihad.outskirts;return route(i,$arenaRihad.arrival.mapId,o.accessEventId,o.entry);},
  returnToArrival:function(i){var o=$arenaRihad.outskirts;return route(i,o.entry.mapId,o.returnEventId,o.return);}
 };
 var terminateMessage=Window_Message.prototype.terminateMessage;
 Window_Message.prototype.terminateMessage=function(){terminateMessage.apply(this,arguments);if(urban()||outside()){
  $gameTemp._arenaNarrativeFence={until:Date.now()+150};$gameTemp.clearDestination();
 }};
 // Map009 kept its logical ID. Recreate the map only for a serialized
 // copy of the old esplanade, leaving quest state and current saves intact.
 var createMap=Scene_Map.prototype.create;
 Scene_Map.prototype.create=function(){
  var arrival=$arenaRihad.arrival;
  var road=here()&&$gameMap.event(3);
  var staysInRihad=!$gamePlayer.isTransferring()||$gamePlayer.newMapId()===arrival.mapId;
  if(road&&road.x===10&&road.y===12&&staysInRihad){
   $gamePlayer.reserveTransfer(arrival.mapId,arrival.x,arrival.y,arrival.direction,0);
   $gamePlayer.requestMapReload();
  }
  createMap.apply(this,arguments);
 };
 var mapLoaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){
  // Same-map load uses serialized Game_Map settings with the current tile data.
  if(!$gamePlayer.isTransferring()&&urban()&&$gameMap.tilesetId()!==$dataMap.tilesetId){
   $gameMap.changeTileset($dataMap.tilesetId);
  }
  if(!$gamePlayer.isTransferring()&&here()&&!$gameMap.event($arenaRihad.outskirts.accessEventId)&&$dataMap.events[$arenaRihad.outskirts.accessEventId]){
   var id=$arenaRihad.outskirts.accessEventId;$gameMap._events[id]=new Game_Event($gameMap.mapId(),id);
  }
  if(!$gamePlayer.isTransferring()&&here()){
   // Keep player position and all persistent namespaces. Retire only the old exterior rest.
   $gameMap._events[2]=null;
   var entrance=$arenaRihad.inn.accessEventId;
   if(!$gameMap.event(entrance))$gameMap._events[entrance]=new Game_Event($gameMap.mapId(),entrance);
  }
  if(!$gamePlayer.isTransferring()&&inInn()){
   var bedId=$arenaRihad.inn.bedEventId;
   var bed=$gameMap.event(bedId);
   if(!bed||bed._priorityType!==1)$gameMap._events[bedId]=new Game_Event($gameMap.mapId(),bedId);
  }
  if(!$gamePlayer.isTransferring()&&urban())$arenaRihad.regionalNpcs.filter(function(n){return n.mapId===$gameMap.mapId();}).forEach(function(n){if(!$gameMap.event(n.eventId)&&$dataMap.events[n.eventId])$gameMap._events[n.eventId]=new Game_Event($gameMap.mapId(),n.eventId);});
  mapLoaded.apply(this,arguments);
  if(here()){var actor=$gameMap.event($arenaRihad.informantEventId),visual=$arenaRihad.informantVisual;if(actor&&!actor._erased){actor.setImage(visual.characterName,0);actor.setDirectionFix(false);actor.setDirection(visual.direction);actor.setDirectionFix(true);actor.setPattern(1);}}
  if(urban())$arenaRihad.regionalNpcs.filter(function(n){return n.mapId===$gameMap.mapId();}).forEach(function(n){var e=$gameMap.event(n.eventId);if(e&&!e._erased){e.setImage(n.characterName,0);e.setDirectionFix(false);}});
  if(here()&&ArenaContinuation.labActive()&&ArenaContinuation.status().code==='arrived'&&!ArenaPersistence.snapshot().quests.MQ02)ArenaPersistence.setQuest('MQ02',10,{},false);
 };
 // Use the existing RAM laboratory, with no route to personal save slots.
 var list=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){list.apply(this,arguments);this.addCommand('Rihad · chegada nível 1 (RAM)','arenaRihadPreview');};
 var title=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){title.apply(this,arguments);this._commandWindow.setHandler('arenaRihadPreview',ArenaRihad.preview);};
 var commands=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){commands.apply(this,arguments);if((urban()||outside())&&ArenaContinuation.labActive()){
  this.addCommand('Guardar teste em RAM','arenaRihadStore');this.addCommand('Carregar teste da RAM','arenaRihadLoad');
 }};
 var menu=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menu.apply(this,arguments);
  this._commandWindow.setHandler('arenaRihadStore',function(){ArenaContinuation.memorySave();SceneManager.pop();});
  this._commandWindow.setHandler('arenaRihadLoad',function(){if(ArenaContinuation.memoryLoad())SceneManager.goto(Scene_Map);else{SoundManager.playBuzzer();this._commandWindow.activate();}}.bind(this));
 };
 var create=Scene_Map.prototype.createDisplayObjects;
 Scene_Map.prototype.createDisplayObjects=function(){create.apply(this,arguments);if(urban()||outside()){
  this._rihadCaption=new Sprite(new Bitmap(Graphics.boxWidth,76));this.addChild(this._rihadCaption);
  this._rihadMarkers=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this.addChild(this._rihadMarkers);
 }};
 var arrows={2:'↓',4:'←',6:'→',8:'↑'};
 function directionTo(x,y,tx,ty){
  return x<tx?6:x>tx?4:y<ty?2:y>ty?8:0;
 }
 function audienceDirection(){
  var points=$arenaRihad.signage.audienceRoute;
  var x=$gamePlayer.x,y=$gamePlayer.y,best=5,direction=0;
  for(var i=1;i<points.length;i++){
   var a=points[i-1],b=points[i];
   var px=Math.min(Math.max(x,Math.min(a[0],b[0])),Math.max(a[0],b[0]));
   var py=Math.min(Math.max(y,Math.min(a[1],b[1])),Math.max(a[1],b[1]));
   var distance=Math.abs(px-x)+Math.abs(py-y);
   if(distance>4||distance>best||px!==x&&py!==y)continue;
   var join=directionTo(x,y,px,py);
   if(join){
    // Only guide a nearby player back to the route along an unobstructed lane.
    var cx=x,cy=y;
    while((cx!==px||cy!==py)&&$gamePlayer.canPass(cx,cy,join)){
     cx=$gameMap.xWithDirection(cx,join);cy=$gameMap.yWithDirection(cy,join);
    }
    if(cx!==px||cy!==py)continue;
   }
   // At a shared corner use the outgoing leg. The last tile faces the door.
   best=distance;direction=join||directionTo(px,py,b[0],b[1])||2;
  }
  return direction;
 }
 function drawAudienceMarker(bitmap){
  if(!here()||$gameMessage.isBusy()||$gamePlayer.isTransferring())return;
  var quest=ArenaQuests.snapshot('MQ02');
  if(!quest||quest.stage!==30)return;
  var direction=audienceDirection();
  if(!direction)return;
  var label=arrows[direction]+' Audiência',width=Math.ceil(bitmap.measureTextWidth(label))+22;
  var x=bitmap.width-width-18;
  bitmap.fillRect(x,20,width,32,'#223932');
  bitmap.drawText(label,x+8,20,width-16,32,'center');
 }
 function nearby(entries,position,range){
  var closest=null;
  entries.forEach(function(entry){
   var p=entry[position],distance=$gameMap.distance(p[0],p[1],$gamePlayer.x,$gamePlayer.y);
   if(distance<=range){closest=entry;range=distance-1;}
  });
  return closest;
 }
 var update=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(!(urban()||outside())||!this._rihadCaption)return;
  var b=this._rihadCaption.bitmap;b.clear();b.fillRect(0,0,b.width,72,'rgba(12,16,18,0.92)');b.fontSize=23;b.textColor='#e1d2ae';
  b.drawText(inInn()?$arenaRihad.inn.name:here()?'Rihad · Hammerfell':'Arredores de Rihad — amostra provisória',18,4,b.width-36,30);
  b.fontSize=17;b.drawText((inInn()?'Quarto sem custo · Interagir com a cama':here()?'Exterior V01':'Materiais de reuso')+' · Esc: menu'+(ArenaContinuation.labActive()?' · teste RAM, sem saves pessoais':''),18,36,b.width-36,26);
  drawAudienceMarker(b);
  b=this._rihadMarkers.bitmap;b.clear();b.fontSize=18;b.textColor='#ead9b5';
  var markers=[[2,9,'Voltar a Rihad']];
  if(here()){
   var c=$arenaRihad;
   var informant=$gameMap.event(c.informantEventId);
   var road=$gameMap.event(3),outskirts=$gameMap.event(c.outskirts.accessEventId);
   markers=[[informant.x,informant.y,'Informante',-58],[c.inn.entrance[0],c.inn.entrance[1],'Pousada · Entrar',-46,'#223932'],
    [road.x,road.y,'Portão · Arredores',76],
    [outskirts.x,outskirts.y,'Arredores',112]];
   var way=guidance(), sign=nearby(c.signage.signs,'position',5);
   if(sign&&way==='square'&&sign.position[1]>16)way='gate';
   if(sign&&way==='square')markers.unshift([sign.position[0],sign.position[1],'↓ Esplanada',18,'#223932']);
   if(sign&&way!=='square'){
    var court=$gameMap.event(c.court.accessEventId);
    var nearCourt=$gameMap.distance(sign.position[0],sign.position[1],court.x,court.y)<=3;
    var atCourt=way==='court'&&$gameMap.distance($gamePlayer.x,$gamePlayer.y,court.x,court.y)<=1;
    if(!atCourt)markers.unshift([sign.position[0],sign.position[1],arrows[sign[way]]+' '+(way==='court'?'Corte':'Portão · Arredores'),nearCourt?-76:18,'#223932']);
   }
   var door=nearby(c.signage.doors.filter(function(d){return d.tile[0]!==c.inn.entrance[0]||d.tile[1]!==c.inn.entrance[1];}),'approach',2);
   if(door)markers.push([door.tile[0],door.tile[1],door.type+' · Fechado',-46,'#3d3028']);
  }
  if(inInn()){
   var keeper=$gameMap.event($arenaRihad.inn.keeperEventId),exit=$gameMap.event($arenaRihad.inn.exitEventId);
   markers=[[keeper.x,keeper.y,'Responsável pela pousada',-58],[exit.x,exit.y,'Sair para Rihad',32]];
  }
  var roomRoute=inInn()?$arenaRihad.inn.roomRoute:here()&&guidance()==='square'?$arenaRihad.inn.exteriorRoute:null;
  if(roomRoute){
   var signs=roomRoute.slice(0,-1).map(function(p,i){
    return {position:p,next:roomRoute[i+1],previous:roomRoute[Math.max(0,i-1)]};
   });
   var sign=nearby(signs,'position',5);
   if(sign){
    var p=sign.position,next=sign.next,previous=sign.previous;
    var label=arrows[directionTo(p[0],p[1],next[0],next[1])]+' '+(inInn()?'Quarto':'Pousada');
    if(inInn())label+=' · '+arrows[directionTo(p[0],p[1],previous[0],previous[1])||2]+' Saída';
    markers.unshift([p[0],p[1],label,-32,'#223932']);
   }
  }
  var boxes=[];
  markers.forEach(function(p){
   var px=$gameMap.adjustX(p[0])*48+24,y=$gameMap.adjustY(p[1])*48+(p[3]||-30);
   if(px<0||px>Graphics.boxWidth||y<72||y>Graphics.boxHeight-26)return;
   var width=Math.ceil(b.measureTextWidth(p[2]))+20;
   var x=Math.max(8,Math.min(Graphics.boxWidth-width-8,px-width/2));
   if(boxes.some(function(r){return x<r.right+4&&x+width+4>r.left&&y<r.bottom+4&&y+30>r.top;}))return;
   boxes.push({left:x,right:x+width,top:y,bottom:y+26});
   b.fillRect(x,y,width,26,p[4]||'rgba(12,16,18,0.82)');b.drawText(p[2],x+6,y,width-12,26,'center');
  });
  this._rihadMarkers.visible=!$gameMessage.isBusy();
 };
})();
