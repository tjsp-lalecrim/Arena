/*:
 * @plugindesc v0.2.0 Fundo aprovado e título vetorial separado; comandos nativos preservados.
 * @author Codex
 * @help Após os módulos atuais. Somente apresentação da Scene_Title.
 * Mestre/exportação e referências em doc/arte/ABERTURA_REF16_V01.json.
 * Sem dados salvos, handlers novos, resolução global ou alterações do motor.
 */
(function(){'use strict';
 function fit(scene){
  var s=scene._backSprite1,b=s&&s.bitmap;if(!b||!b.isReady()||!b.width||!b.height)return;
  var scale=Math.max(Graphics.width/b.width,Graphics.height/b.height);
  s.scale.set(scale,scale);s.anchor.set(.5,.5);s.position.set(Graphics.width/2,Graphics.height/2);
  var logo=scene._arenaTitleLogo;
  if(logo&&logo.bitmap.isReady()){
   var top=16,menuTop=scene._commandWindow?scene._commandWindow.y:Graphics.height*.56;
   var maxHeight=Math.max(1,Math.min(Graphics.height*.39,menuTop-top-20));
   var size=Math.min(Graphics.width*.78/logo.bitmap.width,maxHeight/logo.bitmap.height);
   logo.scale.set(size,size);logo.position.set(Graphics.width/2,top+logo.bitmap.height*size/2);
  }
  scene._arenaTitleSize=Graphics.width+':'+Graphics.height;
 }
 var create=Scene_Title.prototype.createBackground;
 Scene_Title.prototype.createBackground=function(){create.apply(this,arguments);this._backSprite1.bitmap=ImageManager.loadTitle1('Arena_title_v01');var self=this;this._backSprite1.bitmap.addLoadListener(function(){fit(self);});};
 // Replace only the native text drawing: no duplicate "Arena" underneath the logo.
 Scene_Title.prototype.drawGameTitle=function(){this._arenaTitleLogo=new Sprite(ImageManager.loadTitle2('Arena_logo_v01'));this._arenaTitleLogo.anchor.set(.5,.5);this._gameTitleSprite.addChild(this._arenaTitleLogo);var self=this;this._arenaTitleLogo.bitmap.addLoadListener(function(){fit(self);});};
 var start=Scene_Title.prototype.start;
 Scene_Title.prototype.start=function(){start.apply(this,arguments);fit(this);};
 var update=Scene_Title.prototype.update;
 Scene_Title.prototype.update=function(){update.apply(this,arguments);if(this._arenaTitleSize!==Graphics.width+':'+Graphics.height)fit(this);};
})();
