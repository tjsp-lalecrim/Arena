/*:
 * @plugindesc v0.1.0 Onde fica…? Rotas locais, entradas e indicação cancelável.
 * @author Codex
 * @help Após Arena_NPCDialogues. ArenaRihadDirections.json; sem descoberta de quest.
 * Reutiliza a seta de Rihad e as escolhas/retratos/paginação nativos.
 */
var ArenaRihadDirections;
(function() {
 'use strict';
 DataManager._databaseFiles.push({name:'$arenaRihadDirections',src:'ArenaRihadDirections.json'});
 MVStateStore.register('arenaRihadGuidance',1,{targetId:null,suppressed:false});
 var cachedMap=null, cachedTarget=null, cachedField=null;
 var dirs=[2,4,6,8], names={2:'sul',4:'oeste',6:'leste',8:'norte'};
 function config(){return $arenaRihadDirections;}
 function pois(){return $gameMap.mapId()===config().mapId?config().pois:config().interiorPois;}
 function poi(id){return pois().filter(function(p){return p.id===id;})[0];}
 function supported(){return [config().mapId,config().innMapId].indexOf($gameMap.mapId())>=0;}
 function stop(){MVStateStore.replace('arenaRihadGuidance',{targetId:null,suppressed:true});}
 function move(x,y,d){return [$gameMap.xWithDirection(x,d),$gameMap.yWithDirection(y,d)];}
 function step(x,y,d){var p=move(x,y,d);return $gameMap.isValid(p[0],p[1])&&$gameMap.isPassable(x,y,d)&&$gameMap.isPassable(p[0],p[1],10-d);}
 // One breadth-first field, not a per-frame path search. Dynamic inhabitants
 // are intentionally excluded: advice follows streets, not a moving person.
 function field(start){
  var w=$gameMap.width(),h=$gameMap.height(),dist=new Int32Array(w*h),queue=new Int32Array(w*h),head=0,tail=0;
  dist.fill(-1);var at=start[1]*w+start[0];dist[at]=0;queue[tail++]=at;
  while(head<tail){at=queue[head++];var x=at%w,y=Math.floor(at/w);
   dirs.forEach(function(d){var p=move(x,y,d),i=p[1]*w+p[0];if(step(x,y,d)&&dist[i]<0){dist[i]=dist[at]+1;queue[tail++]=i;}});
  }
  return {width:w,dist:dist};
 }
 function distance(f,p){return f.dist[p[1]*f.width+p[0]];}
 function path(f,start){
  var p=start.slice(),route=[],n=distance(f,p);if(n<0)return null;
  while(n>0){var found=dirs.filter(function(d){return step(p[0],p[1],d)&&distance(f,move(p[0],p[1],d))===n-1;})[0];
   if(!found)return null;route.push(found);p=move(p[0],p[1],found);n--;}
  return route;
 }
 function targetField(p){if(cachedMap!==$dataMap||cachedTarget!==p.id){cachedMap=$dataMap;cachedTarget=p.id;cachedField=field(p.approach);}return cachedField;}
 function route(p,start){return path(targetField(p),start);}
 function compass(a,b){var dx=b[0]-a[0],dy=b[1]-a[1];return dy<0?(dx<0?'noroeste':dx>0?'nordeste':'norte'):dy>0?(dx<0?'sudoeste':dx>0?'sudeste':'sul'):dx<0?'oeste':dx>0?'leste':'';}
 function choices(n){
  var e=$gameMap.event(n.eventId),f=field([e.x,e.y]),all=pois();
  var list=all.filter(function(p){return !p.group&&distance(f,p.approach)>=0;});
  if($gameMap.mapId()===config().mapId)config().groups.forEach(function(g){
   var best=null;all.filter(function(p){return p.group===g.id;}).forEach(function(p){var d=distance(f,p.approach);if(d>=0&&(!best||d<best.distance))best={p:p,distance:d};});
   if(best)list.push(Object.assign({},best.p,{label:g.label}));
  });return list;
 }
 function context(i,id){return supported()&&ArenaNPCDialogues.context(i,id);}
 function show(i,n,texts){return ArenaCourt.show(i,texts,{name:n.face,index:0});}
 function text(key,values){var t=config().blocks[key].text;return t.replace(/\{([a-z]+)\}/g,function(_,k){if(!Object.prototype.hasOwnProperty.call(values,k))throw Error('Rihad directions: variable '+k);return values[k];});}
 function answer(i,id,targetId){
  var n=context(i,id),p=poi(targetId);if(!n||!p)return false;
  var e=$gameMap.event(n.eventId),r=route(p,[e.x,e.y]);if(!r)return show(i,n,[text('unknown',{})]);
  var values={direction:compass([e.x,e.y],p.approach),first:names[r[0]]||'',turn:'',place:p.name,face:names[p.face]};
  var turn=r.filter(function(d){return d!==r[0];})[0];if(turn)values.turn=' Depois da curva, siga para o '+names[turn]+'.';
  var texts=[text(r.length<=6?'near':'direction',values)];
  if(r.length)texts.push(text('route',values));texts.push(text('entrance',values));
  if(p.hint)texts.push(p.hint);
  if(p.closed)texts.push(text('closed',{}));if(p.id==='outskirts')texts.push(text('outskirts',{}));
  MVStateStore.replace('arenaRihadGuidance',{targetId:p.id,suppressed:false});return show(i,n,texts);
 }
 function open(i,id){
  var n=context(i,id);if(!n)return false;var list=choices(n),labels=list.map(function(p){return p.label||p.name;});
  var stopIndex=labels.length;labels.push('Encerrar indicação');var last=labels.length;labels.push('Voltar aos assuntos');
  var commands=[{code:112,indent:0,parameters:[]},{code:102,indent:1,parameters:[labels,last,0,2,0]}];
  list.forEach(function(p,j){commands.push({code:402,indent:1,parameters:[j,labels[j]]},{code:355,indent:2,parameters:['ArenaRihadDirections.answer(this,'+JSON.stringify(id)+','+JSON.stringify(p.id)+');']});});
  commands.push({code:402,indent:1,parameters:[stopIndex,labels[stopIndex]]},{code:355,indent:2,parameters:['ArenaRihadDirections.cancel(this,'+JSON.stringify(id)+');']},
   {code:402,indent:1,parameters:[last,labels[last]]},{code:113,indent:2,parameters:[]},{code:404,indent:1,parameters:[]},{code:413,indent:0,parameters:[]},{code:0,indent:0,parameters:[]});
  i.setupChild(commands,i.eventId());return true;
 }
 ArenaRihadDirections={open:open,answer:answer,stop:stop,route:route,compass:compass,choices:choices,
  cancel:function(i,id){var n=context(i,id);if(!n)return false;stop();return show(i,n,[text('stopped',{})]);},
  marker:function(){
   if(!supported())return null;var saved=MVStateStore.read('arenaRihadGuidance'),p=poi(saved.targetId);if(!p)return saved.suppressed?{hidden:true}:null;
   var r=route(p,[$gamePlayer.x,$gamePlayer.y]);return {direction:r&&r[0]||0,label:p.name,arrived:r&&r.length===0,blocked:!r};
  }
 };
 var loaded=DataManager.isDatabaseLoaded,checked=false;
 DataManager.isDatabaseLoaded=function(){if(!loaded.apply(this,arguments))return false;if(!checked){var c=config(),ids={};
  if(!c||c.schemaVersion!==1||c.mapId!==9||c.innMapId!==18)throw Error('Rihad directions: configuração inválida');
  c.pois.concat(c.interiorPois).forEach(function(p){if(ids[p.id]||!Array.isArray(p.approach)||!names[p.face])throw Error('Rihad directions: destino inválido '+p.id);ids[p.id]=true;});checked=true;
 }return true;};
 var onMap=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){onMap.apply(this,arguments);cachedMap=null;
  var selected=MVStateStore.read('arenaRihadGuidance').targetId;
  if(selected&&(!supported()||!poi(selected)))MVStateStore.replace('arenaRihadGuidance',{targetId:null,suppressed:false});
 };
 var add=Window_MenuCommand.prototype.addOriginalCommands;
 Window_MenuCommand.prototype.addOriginalCommands=function(){add.apply(this,arguments);if(supported()&&MVStateStore.read('arenaRihadGuidance').targetId)this.addCommand('Encerrar indicação','arenaStopGuidance');};
 var menu=Scene_Menu.prototype.createCommandWindow;
 Scene_Menu.prototype.createCommandWindow=function(){menu.apply(this,arguments);this._commandWindow.setHandler('arenaStopGuidance',function(){stop();$gameTemp.clearDestination();$gameTemp._arenaCourtTravelFence=true;SceneManager.pop();});};
})();
