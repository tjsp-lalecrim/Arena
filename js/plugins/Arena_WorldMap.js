/*:
 * @plugindesc v0.3.0 Mapa mundial: províncias, descoberta e viagem exterior MQ02.
 * @author Codex
 * @help Após Rihad, StonekeepWhole e FangCells. Dados ArenaWorldMap.json.
 * Menu Mapa mundial; tecla M fora de batalha. Enter confirma, Esc retorna.
 * Mesmas âncoras/descobertas da campanha, sem cura, tempo ou custo novos.
 * Interiores permitem consulta; saídas e retaliação continuam nos eventos.
 * Estado arenaWorldTravel v1, sem mudar namespace web. Sem plugins externos.
 */
var ArenaWorldMap,Scene_ArenaWorldMap;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaWorldMap',src:'ArenaWorldMap.json'});
 MVStateStore.register('arenaWorldTravel',1,{sequence:0,trip:null},function(s){return s;});
 function cfg(){return $arenaWorldMap;}
 var loaded=DataManager.isDatabaseLoaded,validated=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!validated){var c=cfg();if(!c||c.schemaVersion!==1||c.provinces.length!==9||!c.geography||c.provinces.some(function(p){return !c.geography.regions[p.id]||!c.geography.regions[p.id].length;})||c.places.length!==273||c.places.some(function(p){return !p.point||p.point.length!==2||c.provinces.every(function(v){return v.id!==p.province;});})||c.exteriorMaps.some(function(id){return !$dataMapInfos[id];}))throw Error('Mapa mundial: configuração geográfica ou áreas exteriores inválidas.');validated=true;}return true;};
 function alphabetical(a,b){return a.name.localeCompare(b.name,'pt-BR',{sensitivity:'base'})||a.id.localeCompare(b.id);}
 function quest(){return ArenaQuests.snapshot('MQ02');}
 function campaign(){return !!window.$gameSystem&&ArenaNarrative.isCampaign()&&!(ArenaContinuation.labActive());}
 function location(){
  var id=$gameMap.mapId(),r=$arenaRihad;
  if(id===r.arrival.mapId||id===r.inn.entry.mapId||id===r.court.entry.mapId)return 'rihad';
  if(id===r.outskirts.entry.mapId)return 'outskirts';
  if(id===ArenaStonekeep.configuration().mapId||id===$arenaStonekeep.mapId)return 'stonekeep';
  if(id===$arenaFangCells.mapId||id===$arenaFangCells.lower.mapId)return 'fang';
  return null;
 }
 function known(id){
  if(id==='rihad'||id==='outskirts')return quest().stage>=10;
  if(id==='stonekeep')return ArenaStonekeep.known();
  if(id==='fang')return ArenaFangCells.destination().available;
  return false;
 }
 function anchor(id){
  if(id==='rihad')return $arenaRihad.arrival;
  if(id==='outskirts')return $arenaRihad.outskirts.entry;
  if(id==='stonekeep')return ArenaStonekeep.configuration().entry;
  if(id==='fang')return {id:'fang.entry',mapId:$arenaFangCells.mapId,x:$arenaFangCells.entry[0],y:$arenaFangCells.entry[1],direction:2};
  return null;
 }
 function reason(id,fromGate){
  if(!campaign()&&!(fromGate&&ArenaNarrative.isCampaign()&&ArenaContinuation.labActive()))return 'Mapa de campanha indisponível nesta sessão técnica.';
  if(!known(id))return 'Destino indisponível nesta versão.';
  if($gameParty.inBattle()||$gamePlayer.isTransferring()||SceneManager.isSceneChanging()||$gameTemp._arenaEncounterLock)return 'Aguarde a ação em andamento.';
  if($gameMessage.isBusy()||(!fromGate&&$gameMap.isEventRunning()))return 'Conclua a interação antes de viajar.';
  var trip=MVStateStore.read('arenaWorldTravel').trip;
  if(trip&&trip.phase==='travelling')return 'A viagem já está em andamento.';
  if(quest().stage===100)return 'Saia pela entrada da mina para resolver a retaliação pendente.';
  if(cfg().exteriorMaps.indexOf($gameMap.mapId())<0)return 'É necessário sair do interior ou da dungeon para viajar.';
  if(location()===id)return 'Você já está neste local.';
  return '';
 }
 function destinationStatus(id){var why=reason(id,false),state=location()===id?'current':why?'blocked':'available';return {state:state,label:state==='current'?'Localização atual':state==='available'?'Disponível para viajar':'Indisponível',reason:why};}
 function fence(){
  $gameTemp.clearDestination();$gameTemp._arenaCourtTravelFence=true;
  $gameTemp._arenaNarrativeFence={until:Date.now()+180};
 }
 function travel(id,fromGate){
  var why=reason(id,fromGate);if(why)return {ok:false,reason:why};
  var to=anchor(id);if(!to||!to.id||!$dataMapInfos[to.mapId])return {ok:false,reason:'Destino sem âncora válida.'};
  var s=MVStateStore.read('arenaWorldTravel');
  s.sequence++;s.trip={id:'world.trip.'+s.sequence,from:location(),destinationId:to.id,locationId:id,mapId:to.mapId,x:to.x,y:to.y,phase:'travelling'};
  MVStateStore.replace('arenaWorldTravel',s);fence();
  $gamePlayer.reserveTransfer(to.mapId,to.x,to.y,to.direction,0);return {ok:true,destinationId:to.id};
 }
 ArenaWorldMap={
  location:location,known:known,anchor:anchor,reason:reason,status:destinationStatus,
  travel:function(id){return travel(id,false);},
  fromGate:function(i,id){
   var e=$gameMap.event(3);
   if(!ArenaNarrative.isCampaign()||$gameMap.mapId()!==$arenaRihad.arrival.mapId||!(i instanceof Game_Interpreter)||i._mapId!==$gameMap.mapId()||i.eventId()!==3||!e||e._erased||$gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1)return false;
   return travel(id,true).ok;
  },
  open:function(){
   if(!(SceneManager._scene instanceof Scene_Map)||!SceneManager._sceneStarted||!campaign()||$gameParty.inBattle()||$gameMessage.isBusy()||$gameMap.isEventRunning()||$gamePlayer.isTransferring()||SceneManager.isSceneChanging()||$gameTemp._arenaEncounterLock)return false;
   fence();SceneManager.push(Scene_ArenaWorldMap);return true;
  },
  entries:function(province){return cfg().places.filter(function(p){return p.province===province&&(!p.questSecret||known(p.id));}).map(function(p){var state=destinationStatus(p.id);return Object.assign({},p,{enabled:state.state==='available',status:state.label,blockReason:state.reason});}).sort(alphabetical);},
  state:function(){return MVStateStore.read('arenaWorldTravel');}
 };
 var start=Scene_Map.prototype.start;
 Scene_Map.prototype.start=function(){start.apply(this,arguments);if(!window.$gameSystem)return;
  var s=MVStateStore.read('arenaWorldTravel'),t=s.trip;
  if(t&&t.phase==='travelling'&&$gameMap.mapId()===t.mapId&&$gamePlayer.x===t.x&&$gamePlayer.y===t.y){t.phase='arrived';MVStateStore.replace('arenaWorldTravel',s);fence();}
 };
 Input.keyMapper[77]='arenaWorldMap';
 var update=Scene_Map.prototype.update;
 Scene_Map.prototype.update=function(){update.apply(this,arguments);if(this.isActive()&&$gamePlayer.canMove()&&Input.isTriggered('arenaWorldMap'))ArenaWorldMap.open();};
 var commands=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){commands.apply(this,arguments);if(campaign())this.addCommand('Mapa mundial','arenaWorldMap',true);};
 var createMenu=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){createMenu.apply(this,arguments);this._commandWindow.setHandler('arenaWorldMap',function(){fence();SceneManager.push(Scene_ArenaWorldMap);});};
 function List(){this.initialize.apply(this,arguments);}
 List.prototype=Object.create(Window_Command.prototype);List.prototype.constructor=List;
 List.prototype.initialize=function(x,y,w,h){this._ww=w;this._hh=h;this.rows=[];Window_Command.prototype.initialize.call(this,x,y);};
 List.prototype.windowWidth=function(){return this._ww;};List.prototype.windowHeight=function(){return this._hh;};
 List.prototype.standardFontSize=function(){return 20;};List.prototype.itemHeight=function(){return this.rows[0]&&this.rows[0].point?52:34;};
 List.prototype.drawItem=function(index){var row=this.rows[index],r=this.itemRectForText(index);if(!row)return;this.resetTextColor();this.changePaintOpacity(row.enabled!==false||row.id===location());if(row.id===location())this.changeTextColor('#ffe19b');this.contents.fontSize=18;this.contents.drawText(row.name,r.x,r.y,r.width,26);if(row.point){this.contents.fontSize=14;this.contents.drawText(row.status,r.x,r.y+26,r.width,22);}this.resetFontSettings();this.changePaintOpacity(true);};
 List.prototype.makeCommandList=function(){this.rows.forEach(function(r){this.addCommand(r.name,'pick',r.enabled!==false,r.id);},this);};
 List.prototype.setRows=function(rows){this.rows=rows;this.refresh();this.select(0);};
 List.prototype.processOk=function(){if(!this._ready)return;Window_Command.prototype.processOk.call(this);};
 List.prototype.processCancel=function(){if(this._ready)Window_Command.prototype.processCancel.call(this);};
 function MapWindow(){this.initialize.apply(this,arguments);}
 MapWindow.prototype=Object.create(Window_Base.prototype);MapWindow.prototype.constructor=MapWindow;
 MapWindow.prototype.initialize=function(x,y,w,h){Window_Base.prototype.initialize.call(this,x,y,w,h);this._view=null;};
 MapWindow.prototype.showMap=function(view,selection){
  var b=this.contents;b.clear();this._view=view;this._selection=selection;
  var geo=cfg().geography,scale=Math.min((b.width-8)/320,(b.height-54)/200),rect={x:(b.width-320*scale)/2,y:6,w:320*scale,h:200*scale};
  this._rect=rect;var ctx=b._context;
  ctx.save();ctx.fillStyle='#121f24';ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
  // Cartographic vector geometry traced from original resources, never baked labels.
  var polys=view?geo.regions[view]:geo.world;
  (polys||[]).forEach(function(p){
   ctx.beginPath();p.points.forEach(function(pt,n){var x=rect.x+pt[0]/320*rect.w,y=rect.y+pt[1]/200*rect.h;n?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
   ctx.fillStyle=p.color||'#6c6847';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#b4a378';ctx.stroke();
   ctx.save();ctx.clip();ctx.strokeStyle='rgba(24,29,22,.12)';ctx.lineWidth=.6;for(var stripe=-rect.h;stripe<rect.w;stripe+=9){ctx.beginPath();ctx.moveTo(rect.x+stripe,rect.y);ctx.lineTo(rect.x+stripe+rect.h,rect.y+rect.h);ctx.stroke();}ctx.restore();
  });
  ctx.restore();b._setDirty();
  this._hits=[];
  var points=view?ArenaWorldMap.entries(view):cfg().provinces;
  points.forEach(function(p){
   var pt=view?p.point:p.label,x=rect.x+pt[0]/320*rect.w,y=rect.y+pt[1]/200*rect.h;
   var current=view?location()===p.id:(location()?p.id==='hammerfell':p.id==='imperial');
   if(!view)b.drawCircle(x,y,selection===p.id?6:3,current?'#ffe19b':selection===p.id?'#ecb474':'#d4c8a7');else{ctx.save();ctx.strokeStyle=current?'#ffe19b':p.enabled?'#d4c8a7':'#92978e';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;ctx.beginPath();if(current){ctx.arc(x,y,6,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();}else if(p.enabled){ctx.moveTo(x,y-5);ctx.lineTo(x+5,y);ctx.lineTo(x,y+5);ctx.lineTo(x-5,y);ctx.closePath();ctx.fill();}else{ctx.moveTo(x-3,y-3);ctx.lineTo(x+3,y+3);ctx.moveTo(x+3,y-3);ctx.lineTo(x-3,y+3);ctx.stroke();}if(selection===p.id){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.stroke();}ctx.restore();b._setDirty();}
   b.fontSize=view?18:14;b.textColor=current?'#ffe19b':'#eee3c8';b.outlineWidth=4;b.outlineColor='#12191b';
   var label=p.name;if(view&&current)label+=' · atual';
   var tw=Math.min(b.width-8,b.measureTextWidth(label)+8),lx=Math.max(0,Math.min(b.width-tw,x-tw/2));
   var showLabel=view?(selection===p.id||rect.w>=320&&(current||known(p.id))):(rect.w>=400||selection===p.id||current),labelY=view?Math.max(rect.y,Math.min(y+7,b.height-76)):y+7;if(showLabel)b.drawText(label,lx,labelY,tw,26,'center');var hitTop=Math.min(y-10,labelY);this._hits.push({id:p.id,x:x,y:y,rect:showLabel?[lx,hitTop,tw,Math.max(y+10,labelY+26)-hitTop]:[x-7,y-7,14,14]});
  },this);
  b.fontSize=14;b.textColor='#e0d5b9';if(view){b.drawText('Atual: círculo · Disponível: losango',4,b.height-48,b.width-8,22);b.drawText('Indisponível: X · motivo ao selecionar',4,b.height-26,b.width-8,22);}else b.drawText('Selecione uma província.',4,b.height-32,b.width-8,26);
 };
 MapWindow.prototype.update=function(){Window_Base.prototype.update.call(this);if(!this.visible||!this.owner||!this.owner._list.active||!this.owner._list._ready||!TouchInput.isTriggered())return;
  var x=TouchInput.x-this.x-this.padding,y=TouchInput.y-this.y-this.padding;
  var hit=(this._hits||[]).filter(function(h){return x>=h.rect[0]&&x<=h.rect[0]+h.rect[2]&&y>=h.rect[1]&&y<=h.rect[1]+h.rect[3];}).sort(function(a,b){return Math.pow(x-a.x,2)+Math.pow(y-a.y,2)-Math.pow(x-b.x,2)-Math.pow(y-b.y,2);})[0];
  if(!hit&&!this._view&&this._rect){var r=this._rect,px=(x-r.x)/r.w*320,py=(y-r.y)/r.h*200;
   var inside=function(pts){var yes=false;for(var i=0,j=pts.length-1;i<pts.length;j=i++){var a=pts[i],b=pts[j];if((a[1]>py)!==(b[1]>py)&&px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
   hit=cfg().geography.world.find(function(p){return inside(p.points);});
  }
  if(hit){var n=this.owner._list.rows.findIndex(function(p){return p.id===hit.id;});if(n>=0){this.owner._list.select(n);this.owner.pick();}}
 };
 function Scene(){this.initialize.apply(this,arguments);}
 Scene.prototype=Object.create(Scene_MenuBase.prototype);Scene.prototype.constructor=Scene;
 Scene.prototype.initialize=function(){Scene_MenuBase.prototype.initialize.call(this);this._province=null;this._selected=null;};
 Scene.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);
  var w=Graphics.boxWidth,h=Graphics.boxHeight,side=Math.min(300,Math.round(w*.36)),footer=w<720?144:112;
  this._heading=new Window_Base(0,0,w,104);this.addWindow(this._heading);
  this._map=new MapWindow(0,104,w-side,h-104-footer);this._map.owner=this;this.addWindow(this._map);
  this._list=new List(w-side,104,side,h-104-footer);this._list.setHandler('pick',this.pick.bind(this));this._list.setHandler('cancel',this.back.bind(this));this.addWindow(this._list);
  this._help=new Window_Base(0,h-footer,w,footer);this.addWindow(this._help);
  this._confirm=new Window_Command(0,0);this._confirm.makeCommandList=function(){this.addCommand('Viajar','travel');this.addCommand('Cancelar','cancel');};
  this._confirm.height=this._confirm.fittingHeight(2);this._confirm.createContents();this._confirm.refresh();
  this._confirm.x=Math.floor((w-this._confirm.width)/2);this._confirm.y=Math.floor((h-this._confirm.height)/2);
  this._confirm.setHandler('travel',this.go.bind(this));this._confirm.setHandler('cancel',this.cancelTravel.bind(this));this._confirm.hide();this._confirm.deactivate();this.addWindow(this._confirm);
  var ok=this._confirm.processOk,cancel=this._confirm.processCancel;this._confirm.processOk=function(){if(this._ready)ok.apply(this,arguments);};this._confirm.processCancel=function(){if(this._ready)cancel.apply(this,arguments);};
  [this._heading,this._map,this._list,this._help,this._confirm].forEach(function(w){w.backOpacity=255;});
  this.showLevel();
 };
 Scene.prototype.arm=function(window){window._ready=false;this._armAt=Date.now()+180;this._armedWindow=window;};
 Scene.prototype.showLevel=function(){
  var rows=this._province?ArenaWorldMap.entries(this._province):cfg().provinces.slice().sort(alphabetical);
  if(!rows.length)rows=[{id:null,name:'Sem locais disponíveis'}];
  this._list.setRows(rows);this._list.activate();this.arm(this._list);this._selected=undefined;this.refreshInfo();
 };
 Scene.prototype.refreshInfo=function(){
  var selected=this._list.currentExt(),b=this._heading.contents;b.clear();b.fontSize=25;b.drawText('Mapa mundial'+(this._province?' · '+cfg().provinces.find(function(p){return p.id===this._province;},this).name:' · Tamriel'),0,0,b.width,30);
  var current=cfg().places.find(function(p){return p.id===location();});b.fontSize=18;b.drawText('Localização atual: '+(current?current.name:location()==='outskirts'?'Arredores de Rihad':'Imperial Dungeons / antes de Rihad'),0,34,b.width,24);
  this._map.showMap(this._province,selected);b=this._help.contents;b.clear();b.fontSize=18;
  var lines=this._province?(selected?[destinationStatus(selected).label+' · '+(reason(selected,false)||'Sem custo, cura ou tempo adicional.'),reason(selected,false)?'Setas/clique: consultar motivo · Esc: voltar a Tamriel':'Enter/clique: selecionar e confirmar · Esc: voltar a Tamriel']:['Esta província está representada para expansão futura.','Não há locais implementados disponíveis nesta versão.']):['Mouse ou setas: selecionar · Enter: abrir província · Esc: voltar ao jogo','M: abrir o mapa durante a exploração · jogo pausado nesta tela.'];
  var lineNo=0;lines.forEach(function(t){MVJournalModel.wrap(t,b.width-8,this._help.textWidth.bind(this._help)).forEach(function(line){b.drawText(line,0,lineNo++*25,b.width,25);});},this);
 };
 Scene.prototype.pick=function(){var id=this._list.currentExt();if(!id){SoundManager.playBuzzer();this._list.activate();return;}
  if(!this._province){this._province=id;this.showLevel();return;}
  var why=reason(id,false);if(why){SoundManager.playBuzzer();this._list.activate();this.refreshInfo();this.arm(this._list);return;}
  this._target=id;var hb=this._help.contents;hb.clear();hb.fontSize=20;hb.drawText('Viajar para '+this._list.currentData().name+'?',0,0,hb.width,28);hb.fontSize=18;hb.drawText('Sem custo, cura ou passagem adicional de tempo.',0,32,hb.width,28);this._list.deactivate();this._confirm.show();this._confirm.select(1);this._confirm.activate();this.arm(this._confirm);
 };
 Scene.prototype.cancelTravel=function(){this._confirm.hide();this._confirm.deactivate();this._target=null;this._list.activate();this.arm(this._list);this.refreshInfo();};
 Scene.prototype.go=function(){
  var result=ArenaWorldMap.travel(this._target);if(!result.ok){this.cancelTravel();this.refreshInfo();SoundManager.playBuzzer();return;}
  this._confirm.deactivate();SceneManager.goto(Scene_Map);
 };
 Scene.prototype.back=function(){if(this._province){this._province=null;this.showLevel();}else{fence();this.popScene();}};
 Scene.prototype.update=function(){Scene_MenuBase.prototype.update.call(this);
  if(this._armedWindow&&Date.now()>=this._armAt&&!TouchInput.isPressed()&&!['ok','cancel','arenaWorldMap'].some(function(k){return Input.isPressed(k);})){this._armedWindow._ready=true;this._armedWindow=null;}
  if(!this._confirm.active&&this._selected!==this._list.currentExt()){this._selected=this._list.currentExt();this.refreshInfo();}
 };
 Scene_ArenaWorldMap=Scene;
})();
