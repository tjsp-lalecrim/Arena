/*:
 * @plugindesc v0.1.0 Rihad: seções de quatro orientações no volume existente.
 * @help Após MV_ArchitecturePlanes, antes de Arena_RihadDecor. Sem estado novo.
 * Piso horizontal único; colisão/interação pertencem aos mapas e eventos.
 */
var ArenaRihadArchitecture;
(function(){'use strict';
 var cache={},G=MVArchitecturePlanes;
 function tile(b,a,id,x,y){var i=id%256;b.blt(a,i%8*48,Math.floor(i/8)*48,48,48,x,y);}
 function pattern(b,t,r,ox,oy){var c=b._context;c.save();c.translate(-ox,-oy);c.fillStyle=c.createPattern(t._canvas,'repeat');c.fillRect(r[0]+ox,r[1]+oy,r[2]-r[0],r[3]-r[1]);c.restore();}
 function dispose(b){if(b._baseTexture)b._baseTexture.destroy();b._canvas.width=0;b._canvas.height=0;}
 // Local single face: two48px wall rows plus one48px cover, wholly inside
 // existing solids. Miters meet the cover; never borrow width from a street.
 function geometry(s){var side={2:'S',4:'W',6:'E',8:'N'}[s.side],q;
  if(side==='N')q=[[48,96],[96,96],[144,0],[0,0]];
  if(side==='S')q=[[96,48],[48,48],[0,144],[144,144]];
  if(side==='E')q=[[48,48],[48,96],[144,144],[144,0]];
  if(side==='W')q=[[96,96],[96,48],[0,0],[0,144]];
  var axis=s.side===4||s.side===6?'x':'y',floor=s.floorRect.map(function(v,i){return(v-s.rect[i%2])*48;});
  return{side:side,face:q,axis:axis,floor:floor,frame:G.entryPlane({faces:(function(){var f={};f[side]=q;return f;})()},{side:side,center:1.5},64)};
 }
 function compile(s){var g=geometry(s),key=[s.wallAtlas,s.upper,s.lower,s.cap,s.side,s.rect[0]%2,s.rect[1]%2,s.doorAtlas,s.module.tile].join('/');if(cache[key])return cache[key];
  var b=new Bitmap(144,144),upper=new Bitmap(144,144),entry={bitmap:b,upper:upper,model:g,ready:false};cache[key]=entry;
  var a=ImageManager.loadTileset(s.wallAtlas),d=ImageManager.loadTileset(s.doorAtlas);
  function paint(){if(entry.ready||!a.isReady()||!d.isReady())return;
   var wall=new Bitmap(48,96),cap=new Bitmap(48,48),floor=new Bitmap(96,96);tile(wall,a,s.upper,0,0);tile(wall,a,s.lower,0,48);tile(cap,a,s.cap,0,0);
   for(var y=0;y<2;y++)for(var x=0;x<2;x++)tile(floor,a,s.threshold+x+y*2,x*48,y*48);
   pattern(b,cap,[0,0,144,144],s.rect[0]*48,s.rect[1]*48);
   var face=new Bitmap(144,96);for(var col=0;col<3;col++)face.blt(wall,0,0,48,96,col*48,0);G.warp(b._context,face,g.face);
   // Horizontal floor has constant world phase/scale through the entire mass.
   pattern(b,floor,g.floor,s.rect[0]*48,s.rect[1]*48);
   var r=g.floor,reveals=g.axis==='x'?[[r[0],r[1]-12,r[2],r[1]],[r[0],r[3],r[2],r[3]+12]]:[[r[0]-12,r[1],r[0],r[3]],[r[2],r[1],r[2]+12,r[3]]];
   reveals.forEach(function(r){pattern(b,wall,r,s.rect[0]*48,s.rect[1]*48);});
   var frame=new Bitmap(64,96);frame.fillRect(8,0,48,96,'#171615');var local=s.module.tile-512;
   frame.blt(d,384+local%8*48,Math.floor(local%128/8)*48,48,96,8,0);frame.blt(wall,0,0,8,96,0,0);frame.blt(wall,40,0,8,96,56,0);G.warp(b._context,frame,g.frame);
   // Lintel belongs above actors; no sill projected into a vertical plane.
   var lintel=new Bitmap(64,10);lintel.blt(wall,0,0,48,10,0,0,64,10);G.warp(upper._context,lintel,G.sub(g.frame,0,1,0,10/96));
   b._setDirty();upper._setDirty();[wall,cap,floor,face,frame,lintel].forEach(dispose);entry.ready=true;
  }a.addLoadListener(paint);d.addLoadListener(paint);return entry;
 }
 function Part(s,over){Sprite.call(this);this._architectureEntry=s;this._over=over;this._shared=compile(s);this.bitmap=over?this._shared.upper:this._shared.bitmap;this.z=over?4:1;}
 Part.prototype=Object.create(Sprite.prototype);Part.prototype.constructor=Part;
 Part.prototype.update=function(){Sprite.prototype.update.call(this);var r=this._architectureEntry.rect;this.x=$gameMap.adjustX(r[0])*48;this.y=$gameMap.adjustY(r[1])*48;
  this.renderable=this.x<Graphics.width&&this.y<Graphics.height&&this.x+144>0&&this.y+144>0;
 };
 ArenaRihadArchitecture={geometry:geometry,compile:compile,hits:function(id,x,y){var s=($dataMap.arenaArchitectureEntries||[]).filter(function(s){return s.id===id;})[0];if(!s)return false;var r=s.floorRect;return x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3];},create:function(tilemap,s){tilemap.addChild(new Part(s,false));tilemap.addChild(new Part(s,true));}};
})();
