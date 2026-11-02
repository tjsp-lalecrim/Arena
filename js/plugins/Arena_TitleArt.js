/*:
 * @plugindesc v0.1.0 Uma ilustração de abertura, cover proporcional, comandos nativos preservados.
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
  scene._arenaTitleSize=Graphics.width+':'+Graphics.height;
 }
 var create=Scene_Title.prototype.createBackground;
 Scene_Title.prototype.createBackground=function(){create.apply(this,arguments);this._backSprite1.bitmap=ImageManager.loadTitle1('Arena_title_v01');var self=this;this._backSprite1.bitmap.addLoadListener(function(){fit(self);});};
 var start=Scene_Title.prototype.start;
 Scene_Title.prototype.start=function(){start.apply(this,arguments);fit(this);};
 var update=Scene_Title.prototype.update;
 Scene_Title.prototype.update=function(){update.apply(this,arguments);if(this._arenaTitleSize!==Graphics.width+':'+Graphics.height)fit(this);};
})();
