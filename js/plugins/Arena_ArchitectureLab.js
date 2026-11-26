/*:
 * @plugindesc v0.1.2 Protótipo RAM: canal horizontal único, revelos e batentes.
 * @author Codex
 * @help Após DebugHub/Continuation. Somente Map019/020 com sessão RAM ativa.
 * Texturas existentes em planos geométricos; nenhuma pintura/asset de Zelda.
 * Esc: pontos, RAM e título. Não modifica mapas/saves/regras da campanha.
 */
var ArenaArchitectureLab;
(function(){'use strict';
 DataManager._databaseFiles.push({name:'$arenaArchitectureLab',src:'ArenaArchitectureLab.json'});
 var database=DataManager.isDatabaseLoaded;DataManager.isDatabaseLoaded=function(){if(!database.apply(this,arguments))return false;
  var c=$arenaArchitectureLab;if(!c||c.version!==1||c.mapIds.join(',')!=='19,20'||!$dataMapInfos[19]||!$dataMapInfos[20]||!$dataTilesets[12]||!c.materials||c.materials.threshold!==268||c.entry.mapId!==19)throw Error('Arquitetura RAM: configuração/mapas técnicos inválidos.');return true;
 };
 function here(){return window.$gameMap&&window.$arenaArchitectureLab&&ArenaContinuation.labActive()&&$arenaArchitectureLab.mapIds.indexOf($gameMap.mapId())>=0;}
 function state(){return $gameSystem._arenaArchitectureDoors||($gameSystem._arenaArchitectureDoors={});}
 function spec(){return $dataMap.arenaArchitecture;}
 function neutral(){Input.clear();TouchInput.clear();$gameTemp.clearDestination();$gameTemp._arenaNarrativeFence={until:Date.now()+180};}
 function sync(){if(here())spec().doors.forEach(function(d){d.events.forEach(function(id){$gameMap.event(id).setThrough(!!state()[d.id]);});});}
 ArenaArchitectureLab={active:here,
  start:function(){return ArenaDebugHub.enabled()&&ArenaContinuation.previewArrival($arenaArchitectureLab.entry,true);},
  toggle:function(id){if(!here())return false;var d=spec().doors.filter(function(d){return d.id===id;})[0];if(!d)return false;
   var r=d.rect;if(state()[id]&&$gamePlayer.x>=r[0]&&$gamePlayer.x<r[2]&&$gamePlayer.y>=r[1]&&$gamePlayer.y<r[3]){SoundManager.playBuzzer();return false;}
   state()[id]=!state()[id];sync();SoundManager.playOk();return true;},
  point:function(i){if(!here()||!$arenaArchitectureLab.points[i])return false;var p=$arenaArchitectureLab.points[i];neutral();$gamePlayer.reserveTransfer(p.mapId,p.x,p.y,p.direction,2);return true;},
  store:function(){return here()&&ArenaContinuation.memorySave();},
  load:function(){if(!here()||!ArenaContinuation.memoryLoad())return false;neutral();SceneManager.goto(Scene_Map);return true;},
  leave:function(){if(here()){neutral();ArenaContinuation.leaveLab();return true;}return false;}
 };
 // Bilinear plane geometry: screen axes/floor stay orthogonal; only wall height
 // is unfolded toward the visible floor. UVs follow each face, not rotated art.
 var sub=MVArchitecturePlanes.sub,face=MVArchitecturePlanes.face,warp=MVArchitecturePlanes.warp,entryPlane=MVArchitecturePlanes.entryPlane;
 function dispose(b){if(b._baseTexture)b._baseTexture.destroy();b._canvas.width=0;b._canvas.height=0;}
 function tile(dst,src,id,x,y){var i=id%256;dst.blt(src,i%8*48,Math.floor(i/8)*48,48,48,x,y);}
 function field(ctx,texture,r){ctx.save();ctx.fillStyle=ctx.createPattern(texture._canvas,'repeat');ctx.fillRect(r[0]*48,r[1]*48,(r[2]-r[0])*48,(r[3]-r[1])*48);ctx.restore();}
 function Layer(z){Sprite.call(this);this.z=z;this.bitmap=new Bitmap($dataMap.width*48,$dataMap.height*48);}
 Layer.prototype=Object.create(Sprite.prototype);Layer.prototype.constructor=Layer;
 Layer.prototype.update=function(){Sprite.prototype.update.call(this);this.x=-$gameMap.displayX()*48;this.y=-$gameMap.displayY()*48;};
 function Builder(tilemap){this.map=$dataMap;this.floor=new Layer(0.5);this.wall=new Layer(1);this.beam=new Layer(4);this.roofs=[];this.key=null;
  tilemap.addChild(this.floor);tilemap.addChild(this.wall);tilemap.addChild(this.beam);var self=this;
  spec().buildings.forEach(function(b){var roof=new Layer(4);roof._building=b;self.roofs.push(roof);tilemap.addChild(roof);});
  var m=$arenaArchitectureLab.materials;this.atlas=ImageManager.loadTileset(m.wallAtlas);this.door=ImageManager.loadCharacter(m.door);this.urban=ImageManager.loadTileset(m.urbanAtlas);
 }
 Builder.prototype.update=function(){var key=JSON.stringify(state())+'|'+!!$gameTemp._arenaArchitectureSurfaceColors;if(this.key!==key&&this.atlas.isReady()&&this.door.isReady()&&this.urban.isReady()){this.paint();this.key=key;}
  this.roofs.forEach(function(s){var r=s._building.rect,inside=$gamePlayer.x>=r[0]&&$gamePlayer.x<r[2]&&$gamePlayer.y>=r[1]&&$gamePlayer.y<r[3];s.alpha=inside?0.16:1;});
 };
 Builder.prototype.destroy=function(){[this.floor,this.wall,this.beam].concat(this.roofs).forEach(function(s){dispose(s.bitmap);});};
 Builder.prototype.paint=function(){var self=this,m=$arenaArchitectureLab.materials,wall=this.wall.bitmap,beams=this.beam.bitmap,floor=this.floor.bitmap;floor.clear();wall.clear();beams.clear();this.roofs.forEach(function(s){s.bitmap.clear();});
  // Internal diagnostic only, not a new player control or a persistent setting.
  var colors=!!$gameTemp._arenaArchitectureSurfaceColors;
  var texture=new Bitmap(48,96),cap=new Bitmap(48,48),threshold=new Bitmap(96,96);tile(texture,this.atlas,m.upper,0,0);tile(texture,this.atlas,m.lower,0,48);tile(cap,this.atlas,m.cap,0,0);
  for(var ty=0;ty<2;ty++)for(var tx=0;tx<2;tx++)tile(threshold,this.atlas,m.threshold+tx+ty*2,tx*48,ty*48);
  if(colors){texture.fillAll('#ac6756');cap.fillAll('#78619b');threshold.fillAll('#547b63');}
  var surfaces={};
  function render(s,out){var r=s.rect,l=r[0],t=r[1],x=r[2],y=r[3];surfaces[s.id]={s:s,out:out,faces:{}};
   if(!out){field(wall._context,cap,[l-3,t-3,x+3,t-2]);field(wall._context,cap,[l-3,y+2,x+3,y+3]);field(wall._context,cap,[l-3,t-2,l-2,y+2]);field(wall._context,cap,[x+2,t-2,x+3,y+2]);}
   ['N','E','S','W'].forEach(function(side){var q=face(r,side,out),len=(side==='N'||side==='S'?x-l:y-t)*48,b=new Bitmap(len,96);for(var dx=0;dx<len;dx+=48)b.blt(texture,0,0,48,96,dx,0);surfaces[s.id].faces[side]=q;warp(wall._context,b,q);
    var shade=new Bitmap(len,96);shade.fillAll(side==='E'?'rgba(8,12,18,.18)':side==='S'?'rgba(8,12,18,.12)':'rgba(235,215,175,.025)');warp(wall._context,shade,q);dispose(b);dispose(shade);
   });
  }
  spec().rooms.forEach(function(r){render(r,false);});spec().buildings.forEach(function(r){render(r,true);});
  this.roofs.forEach(function(s){var r=s._building.rect;field(s.bitmap._context,cap,[r[0]+2,r[1]+2,r[2]-2,r[3]-2]);});
  var frames=[];this.portalModels=[];
  spec().doors.forEach(function(d){var hole=d.width*48,w=hole+16,r=d.rect.map(function(v){return v*48;}),fr=d.floorRect.map(function(v){return v*48;}),depth=12;
   var reveals=d.axis==='x'?[[r[0],r[1]-depth,r[2],r[1]],[r[0],r[3],r[2],r[3]+depth]]:[[r[0]-depth,r[1],r[0],r[3]],[r[2],r[1],r[2]+depth,r[3]]];
   var model={id:d.id,axis:d.axis,width:hole,floor:fr,channel:r,reveals:reveals,frames:[]};self.portalModels.push(model);
   // ONE horizontal floor per logical doorway, including both faces of a
   // shared wall. No warp, taper, per-face scale, sill ramp or center cap strip.
   [wall,beams].concat(self.roofs.map(function(s){return s.bitmap;})).forEach(function(b){b.clearRect(fr[0],fr[1],fr[2]-fr[0],fr[3]-fr[1]);});
   d.segments.forEach(function(seg){var q=entryPlane(surfaces[seg.surface],seg,w);frames.push({door:d,segment:seg,q:q,width:w,hole:hole});model.frames.push({side:seg.side,q:q,frameOnly:!!seg.frameOnly});
    // Rectangular frame margins are outside the clear floor, not bright fans.
    [wall].concat(self.roofs.map(function(s){return s.bitmap;})).forEach(function(b){var c=b._context;c.save();c.beginPath();q.forEach(function(p,i){c[i?'lineTo':'moveTo'](p[0],p[1]);});c.closePath();c.clip();c.clearRect(0,0,b.width,b.height);c.restore();});
   });
  });
  this.portalModels.forEach(function(model){var d=spec().doors.filter(function(d){return d.id===model.id;})[0];field(floor._context,threshold,d.floorRect);
   if(colors){var r=model.channel,mid=model.axis==='x'?(r[0]+r[2])/2:(r[1]+r[3])/2;floor.fillRect(model.axis==='x'?mid-24:r[0],model.axis==='x'?r[1]:mid-24,model.axis==='x'?48:r[2]-r[0],model.axis==='x'?r[3]-r[1]:48,'#99a66b');}
   // Internal wall faces explain thickness OUTSIDE the horizontal clear width.
   model.reveals.forEach(function(r){if(colors)wall.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1],'#397c9d');else field(wall._context,texture,r.map(function(v){return v/48;}));});
  });
  frames.forEach(function(f){var d=f.door,seg=f.segment,q=f.q,w=f.width,hole=f.hole,frame=new Bitmap(w,96);
    if(!state()[d.id]&&!seg.frameOnly){frame.fillRect(8,0,hole,96,'#171615');if(d.width===1)frame.blt(self.urban,384,0,48,96,8,0);else frame.blt(self.door,0,48,144,96,8,0);}
    if(colors&&!state()[d.id]&&!seg.frameOnly)frame.fillRect(8,0,hole,96,'#c97163');
    // Jambs and folded leaf keep fixed anchors. The sill belongs to the floor,
    // so it is NEVER blitted onto this vertical face or mirrored at the center.
    frame.blt(texture,0,0,8,96,0,0);frame.blt(texture,40,0,8,96,w-8,0);
    if(colors){frame.fillRect(0,0,8,96,'#bd985e');frame.fillRect(w-8,0,8,96,'#bd985e');}
    if(state()[d.id]&&!seg.frameOnly){frame.blt(self.door,0,48,8,96,2,0,5,86);}
    warp(wall._context,frame,q);
    // One overhead lintel for one leaf; the reverse shared-wall face is only a
    // reveal/frame. It must not add a second crossbar masquerading as a step.
    var beam=new Bitmap(w,10);if(!seg.frameOnly){beam.blt(texture,0,0,48,10,0,0,w,10);if(colors)beam.fillAll('#78619b');warp(beams._context,beam,sub(q,0,1,0,10/96));}
    dispose(frame);dispose(beam);
  });
  [floor,wall,beams].concat(this.roofs.map(function(s){return s.bitmap;})).forEach(function(b){b._setDirty();});dispose(texture);dispose(cap);dispose(threshold);
 };
 var loaded=Scene_Map.prototype.onMapLoaded;Scene_Map.prototype.onMapLoaded=function(){loaded.apply(this,arguments);sync();};
 var display=Scene_Map.prototype.createDisplayObjects;Scene_Map.prototype.createDisplayObjects=function(){display.apply(this,arguments);if(here()){
  this._architectureBuilder=new Builder(this._spriteset._tilemap);this._architectureHUD=new Sprite(new Bitmap(Graphics.boxWidth,68));var b=this._architectureHUD.bitmap;b.fillAll('rgba(12,16,20,.90)');b.fontSize=21;b.textColor='#ead8b3';b.drawText('Arquitetura · solução aceita com ressalvas',14,2,b.width-28,30);b.fontSize=17;b.drawText('Enter/clique: porta · Esc: pontos / guardar RAM / título',14,34,b.width-28,26);this.addChild(this._architectureHUD);
 }};
 var touch=Scene_Map.prototype.processMapTouch;Scene_Map.prototype.processMapTouch=function(){
  if(!here())return touch.apply(this,arguments);
  if(!TouchInput.isPressed())this._architecturePointer=false;
  if(TouchInput.isTriggered()){
   this._architectureTarget=null;var x=$gameMap.canvasToMapX(TouchInput.x),y=$gameMap.canvasToMapY(TouchInput.y);
   var d=spec().doors.filter(function(d){var r=d.rect;return x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3];})[0];
   if(d&&$gamePlayer.canMove()&&!$gameMap.isEventRunning()){
    this._architecturePointer=true;var r=d.rect,cx=Math.floor((r[0]+r[2])/2),cy=Math.floor((r[1]+r[3])/2),points=d.axis==='x'?[[r[0]-1,cy],[r[2],cy]]:[[cx,r[1]-1],[cx,r[3]]];
    points.sort(function(a,b){return $gameMap.distance($gamePlayer.x,$gamePlayer.y,a[0],a[1])-$gameMap.distance($gamePlayer.x,$gamePlayer.y,b[0],b[1]);});
    var point=points[0],events=d.events.map(function(id){return $gameMap.event(id);});events.sort(function(a,b){return $gameMap.distance(a.x,a.y,point[0],point[1])-$gameMap.distance(b.x,b.y,point[0],point[1]);});
    this._architectureTarget={eventId:events[0].eventId(),point:point};$gameTemp.setDestination(point[0],point[1]);return;
   }
  }
  if(!this._architecturePointer)touch.apply(this,arguments);
 };
 var update=Scene_Map.prototype.update;Scene_Map.prototype.update=function(){update.apply(this,arguments);if(here()&&this._architectureBuilder){this._architectureBuilder.update();
  if(this._architectureTarget){if(Input.dir4||Input.isTriggered('menu')||TouchInput.isCancelled())this._architectureTarget=null;
   else{var t=this._architectureTarget;if($gamePlayer.x===t.point[0]&&$gamePlayer.y===t.point[1]&&!$gamePlayer.isMoving()&&$gamePlayer.canMove()&&!$gameMap.isEventRunning()){this._architectureTarget=null;$gameTemp.clearDestination();$gameMap.event(t.eventId).start();}}
  }
 }};
 var terminate=Scene_Map.prototype.terminate;Scene_Map.prototype.terminate=function(){terminate.apply(this,arguments);if(this._architectureBuilder){this._architectureBuilder.destroy();this._architectureBuilder=null;}};
 // Only the isolated map intercepts its menu; normal campaign menu is untouched.
 var menu=Scene_Map.prototype.callMenu;Scene_Map.prototype.callMenu=function(){if(here()){neutral();SceneManager.push(Menu);}else menu.apply(this,arguments);};
 function Commands(){this.initialize.apply(this,arguments);}Commands.prototype=Object.create(Window_Command.prototype);Commands.prototype.constructor=Commands;
 Commands.prototype.windowWidth=function(){return Graphics.boxWidth-48;};Commands.prototype.standardFontSize=function(){return 20;};Commands.prototype.itemHeight=function(){return 34;};
 Commands.prototype.makeCommandList=function(){$arenaArchitectureLab.points.forEach(function(p,i){this.addCommand(p.name,'point',true,i);},this);this.addCommand('Guardar teste em RAM','store');this.addCommand('Carregar teste da RAM','load');this.addCommand('Continuar inspeção','cancel');this.addCommand('Sair → título','leave');};
 function Menu(){this.initialize.apply(this,arguments);}Menu.prototype=Object.create(Scene_MenuBase.prototype);Menu.prototype.constructor=Menu;
 Menu.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);var w=new Commands(24,24),self=this;function act(f){if(f()){neutral();SceneManager.pop();}else{SoundManager.playBuzzer();w.activate();}}
  w.setHandler('point',function(){act(function(){return ArenaArchitectureLab.point(w.currentExt());});});w.setHandler('store',function(){act(ArenaArchitectureLab.store);});w.setHandler('load',function(){if(!ArenaArchitectureLab.load())w.activate();});w.setHandler('leave',ArenaArchitectureLab.leave);w.setHandler('cancel',function(){neutral();SceneManager.pop();});this.addWindow(w);this._commands=w;
 };
 ArenaDebugHub.register({symbol:'arenaArchitectureLab',name:'Rihad · arquitetura 4 direções (RAM)',category:'campaign',description:'Paredes e portas na mesma projeção; exterior e cópia das duas fachadas laterais. Esc: pontos e RAM. Não altera a campanha.',saving:'Somente RAM · slots pessoais bloqueados'},ArenaArchitectureLab.start);
})();
