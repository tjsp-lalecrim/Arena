/*:
 * @plugindesc v0.1.0 Rihad: montagem de placas e retomada segura junto à decoração.
 * @author Codex
 * @help Após Arena_RihadDirections. Bases nativas compiladas nos mapas.
 * Não altera quests, recursos, namespace ou dados pessoais. Sem arte nova.
 */
var ArenaRihadDecor;
(function(){'use strict';
 var cached=null,blocked=null;
 function bases(){if(cached!==$dataMap){cached=$dataMap;blocked={};($dataMap.arenaDecorBlocked||[]).forEach(function(p){blocked[p.join(',')]=true;});}return blocked;}
 function solid(x,y){return !!bases()[x+','+y];}
 function floor(x,y){return $gameMap.isValid(x,y)&&[2,4,6,8].every(function(d){return $gameMap.isPassable(x,y,d);});}
 function occupied(x,y){return $gameMap.eventsXyNt(x,y).some(function(e){return !e._erased&&e.isNormalPriority();});}
 function nearest(origin){
  var map=$gameMap.mapId(),anchor=map===9?$arenaRihad.arrival:map===18?$arenaRihad.inn.entry:$arenaRihad.court.entry;
  var q=[[anchor.x,anchor.y]],seen={},reachable={};seen[q[0].join(',')]=true;
  for(var i=0;i<q.length;i++){var p=q[i];reachable[p.join(',')]=true;[2,4,6,8].forEach(function(d){var x=$gameMap.xWithDirection(p[0],d),y=$gameMap.yWithDirection(p[1],d),k=x+','+y;if(!seen[k]&&floor(x,y)){seen[k]=true;q.push([x,y]);}});}
  q=[origin];seen={};seen[origin.join(',')]=true;
  for(var j=0;j<q.length;j++){var at=q[j],key=at.join(',');if(reachable[key]&&floor(at[0],at[1])&&!occupied(at[0],at[1]))return at;
   [[0,1],[-1,0],[1,0],[0,-1]].forEach(function(d){var x=at[0]+d[0],y=at[1]+d[1],k=x+','+y;if(!seen[k]&&$gameMap.isValid(x,y)){seen[k]=true;q.push([x,y]);}});
  }return null;
 }
 ArenaRihadDecor={solidAt:solid,lastRepair:null};
 var loaded=Scene_Map.prototype.onMapLoaded;
 Scene_Map.prototype.onMapLoaded=function(){loaded.apply(this,arguments);cached=null;ArenaRihadDecor.lastRepair=null;
  if(!$dataMap.arenaDecorRevision||!solid($gamePlayer.x,$gamePlayer.y))return;
  var from=[$gamePlayer.x,$gamePlayer.y],to=nearest(from);
  if(!to)throw Error('Rihad: decoração sem piso seguro de retomada. A partida não foi gravada.');
  $gamePlayer.locate(to[0],to[1]);$gameTemp.clearDestination();$gameTemp._arenaCourtTravelFence=true;
  ArenaRihadDecor.lastRepair={mapId:$gameMap.mapId(),from:from,to:to};
 };
 function Sign(spec){this.initialize(spec);}
 Sign.prototype=Object.create(Sprite.prototype);Sign.prototype.constructor=Sign;
 Sign.prototype.initialize=function(s){Sprite.prototype.initialize.call(this);this._mount=s;this.z=s.side===2?5:1;this.bitmap=new Bitmap(48,48);
  var atlas=ImageManager.loadTileset(s.atlas),self=this,m=s.module;
  atlas.addLoadListener(function(){self.bitmap.blt(atlas,m.tx*48,m.ty*48,48,48,0,0);});
  if(s.side===4)this.scale.x=-1;
 };
 Sign.prototype.update=function(){Sprite.prototype.update.call(this);var s=this._mount,x=$gameMap.adjustX(s.x)*48;
  this.x=s.side===6?x+48-s.inset:s.side===4?x+s.inset:x;
  this.y=$gameMap.adjustY(s.y)*48-s.height;
 };
 var create=Spriteset_Map.prototype.createCharacters;
 Spriteset_Map.prototype.createCharacters=function(){create.apply(this,arguments);($dataMap.arenaDecorSigns||[]).forEach(function(s){this._tilemap.addChild(new Sign(s));},this);};
})();
