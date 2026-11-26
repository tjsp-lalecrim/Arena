/*:
 * @plugindesc v0.2.0 Rihad: bases, seções de entrada e retomada segura.
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
 var position=Sprite_Character.prototype.updatePosition;
 Sprite_Character.prototype.updatePosition=function(){position.apply(this,arguments);
  if(!this._character||!this._character.eventId||!$dataMap.arenaDecor)return;
  if(this._arenaDecorMap!==$dataMap){this._arenaDecorMap=$dataMap;var event=$dataMap.events[this._character.eventId()];
   this._arenaDecorRecord=event&&$dataMap.arenaDecor.filter(function(v){return event.note==='ArenaScenery:'+v.id;})[0];
  }
  var d=this._arenaDecorRecord;
  if(d&&d.renderOffset){this.x+=d.renderOffset[0];this.y+=d.renderOffset[1];}
 };
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
 function Entry(s){this.initialize(s);}
 Entry.prototype=Object.create(Sprite.prototype);Entry.prototype.constructor=Entry;
 var entryCache={};
 Entry.prototype.initialize=function(s){Sprite.prototype.initialize.call(this);this._entrySection=s;this.z=1;
  var key=[s.wallAtlas,s.upper,s.lower,s.side,s.doorAtlas,JSON.stringify(s.mask)].join('/');
  if(entryCache[key]){this.bitmap=entryCache[key];return;}
  this.bitmap=entryCache[key]=new Bitmap(144,96);
  var wall=ImageManager.loadTileset(s.wallAtlas),door=ImageManager.loadTileset(s.doorAtlas),b=this.bitmap,drawn=false;
  function draw(){if(drawn||!wall.isReady()||!door.isReady())return;drawn=true;
   function tile(id,dx,dy){var local=id%256;b.blt(wall,local%8*48,Math.floor(local/8)*48,48,48,dx,dy);}
   for(var col=0;col<3;col++){tile(s.upper,col*48,0);tile(s.lower,col*48,48);}
   // A visible section boundary separates the roof from the two-row vertical
   // face. It is clipped to existing solid cells, never projected over streets.
   b.fillRect(0,0,144,7,'#797269');b.fillRect(0,7,144,4,'rgba(0,0,0,0.50)');
   b.fillRect(0,11,4,85,'#444039');b.fillRect(140,11,4,85,'#444039');
   var x=(s.x-s.left)*48;
   // Roof cut: complete wall section, recessed opening, fixed jambs and sill.
   // Hidden north/east/west faces use an explicit local section, not a leaf on a cap.
   b.fillRect(x+5,12,38,78,'#141313');
   b.fillRect(x+3,10,42,3,'#797269');b.fillRect(x+3,13,3,76,'#302d29');b.fillRect(x+42,13,3,76,'#24211f');
   var local=s.module.tile-512,sx=384+local%8*48,sy=Math.floor(local%128/8)*48;
   b.blt(door,sx,sy,48,96,x+3,11,39,78);
   // Recess depth faces the accessible side; these strips never cover a walk tile.
   if(s.side===4){b.fillRect(x+1,14,4,72,'#a0998b');b.fillRect(x+39,13,6,75,'rgba(0,0,0,0.48)');}
   if(s.side===6){b.fillRect(x+43,14,4,72,'#a0998b');b.fillRect(x+3,13,6,75,'rgba(0,0,0,0.48)');}
   b.fillRect(x+4,s.side===8?0:89,40,6,'#a79d8a');
   b.fillRect(x+7,s.side===8?6:87,34,2,'#443e35');
   for(var yy=0;yy<2;yy++)for(var xx=0;xx<3;xx++)if(!s.mask.some(function(p){return p[0]===xx&&p[1]===yy;}))b.clearRect(xx*48,yy*48,48,48);
  }
  wall.addLoadListener(draw);door.addLoadListener(draw);
 };
 Entry.prototype.update=function(){Sprite.prototype.update.call(this);var s=this._entrySection;this.x=$gameMap.adjustX(s.left)*48;this.y=$gameMap.adjustY(s.top)*48;};
 Spriteset_Map.prototype.createCharacters=function(){create.apply(this,arguments);
  var upgraded={};($dataMap.arenaArchitectureEntries||[]).forEach(function(s){upgraded[s.id]=true;ArenaRihadArchitecture.create(this._tilemap,s);},this);
  ($dataMap.arenaEntranceSections||[]).forEach(function(s){if(!upgraded[s.id])this._tilemap.addChild(new Entry(s));},this);
  ($dataMap.arenaDecorSigns||[]).forEach(function(s){this._tilemap.addChild(new Sign(s));},this);
 };
})();
