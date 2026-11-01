/*:
 * @plugindesc v0.1.0 Hub de acessos técnicos; registro central e título compacto.
 * @author Codex
 * @help Após os plugins que registram os acessos antigos. ArenaDebugHub.json.
 * enabled é explícito; não depende da origem/localhost. Pacote jogador: false.
 * Registra metadados/roteamento, não fixtures ou permissões de salvamento.
 * API register(entry,handler) para novos acessos, sem ampliar o título.
 * Ver doc/plugins/Arena_DebugHub.md.
 */
var ArenaDebugHub;
(function(){
 'use strict';
 DataManager._databaseFiles.push({name:'$arenaDebugHub',src:'ArenaDebugHub.json'});
 var extra=[],available=[],pending=null,selection={category:0,items:{}},boot=DataManager.isDatabaseLoaded;
 function config(){return $arenaDebugHub;}
 function enabled(){return !!(window.$arenaDebugHub&&config().enabled===true);}
 function definitions(){return config().entries.concat(extra.map(function(e){return e.entry;}));}
 function fail(text){throw Error('Debug Hub: '+text);}
 DataManager.isDatabaseLoaded=function(){if(!boot.apply(this,arguments))return false;var c=config();if(!c||c.schemaVersion!==1||typeof c.enabled!=='boolean'||!Array.isArray(c.entries)||!Array.isArray(c.categories)||!Array.isArray(c.normalTitleSymbols))fail('configuração inválida em ArenaDebugHub.json.');var seen={};definitions().forEach(function(e){if(seen[e.symbol]||c.normalTitleSymbols.indexOf(e.symbol)>=0||!c.categories.some(function(a){return a.id===e.category;})||!e.description||!e.saving)fail('registro inválido/duplicado: '+e.symbol);seen[e.symbol]=true;});return true;};
 ArenaDebugHub={
  enabled:enabled,
  register:function(entry,handler){if(!entry||typeof entry.symbol!=='string'||!entry.name||typeof handler!=='function')fail('register exige símbolo, nome, metadados e handler.');extra.push({entry:entry,handler:handler});},
  entries:function(){return available.map(function(e){return {symbol:e.symbol,name:e.name,category:e.category,description:e.description,saving:e.saving,enabled:e.enabled};});},
  open:function(){if(!enabled()||!(SceneManager._scene instanceof Scene_Title))return false;SceneManager.push(Scene_ArenaDebugHub);return true;}
 };
 // Adapter for the existing providers: retain their exact labels/availability
 // and handlers. Unknown title commands must be classified, never guessed by name.
 var list=Window_TitleCommand.prototype.makeCommandList;
 Window_TitleCommand.prototype.makeCommandList=function(){
  list.apply(this,arguments);var all=this._list.slice(),defs=definitions(),normals=config().normalTitleSymbols;
  all.forEach(function(cmd){if(normals.indexOf(cmd.symbol)<0&&!defs.some(function(e){return e.symbol===cmd.symbol;}))fail('classifique o comando "'+cmd.symbol+'" como normal ou técnico.');});
  this._arenaDebugLegacy=all;this._list=all.filter(function(cmd){return normals.indexOf(cmd.symbol)>=0;});
  if(enabled())this.addCommand('Testes / Debug','arenaDebugHub');
 };
 var create=Scene_Title.prototype.createCommandWindow;
 Scene_Title.prototype.createCommandWindow=function(){
  create.apply(this,arguments);var w=this._commandWindow,legacy=w._arenaDebugLegacy;
  available=definitions().map(function(e){var cmd=legacy.filter(function(c){return c.symbol===e.symbol;})[0],custom=extra.filter(function(c){return c.entry.symbol===e.symbol;})[0];if(!cmd&&!custom)fail('acesso sem comando/handler: '+e.symbol);if(!custom&&typeof w._handlers[e.symbol]!=='function')fail('handler ausente: '+e.symbol);return Object.assign({},e,{name:cmd?cmd.name:e.name,enabled:cmd?cmd.enabled:e.enabled!==false});});
  w.setHandler('arenaDebugHub',ArenaDebugHub.open);
  // No technical handler remains exposed through the player title window.
  if(!enabled())definitions().forEach(function(e){delete w._handlers[e.symbol];});
 };
 var start=Scene_Title.prototype.start;
 Scene_Title.prototype.start=function(){
  start.apply(this,arguments);
  if(!pending)return;var symbol=pending;pending=null;
  if(!enabled())return;
  var w=this._commandWindow,custom=extra.filter(function(e){return e.entry.symbol===symbol;})[0],entry=available.filter(function(e){return e.symbol===symbol;})[0];
  if(!entry||!entry.enabled)fail('acesso indisponível: '+symbol);
  w.deactivate();w.close();
  // Existing fixtures require a real Scene_Title (Continuation) and some handlers
  // are bound to that scene. Launch only after its original cleanup/start chain.
  if(custom)custom.handler.call(this);else w.callHandler(symbol);
  if(!SceneManager.isSceneChanging()){w.open();w.activate();}
 };
 function Panel(){this.initialize.apply(this,arguments);}
 Panel.prototype=Object.create(Window_Command.prototype);Panel.prototype.constructor=Panel;
 Panel.prototype.initialize=function(x,y,width,height,entries){this._hubWidth=width;this._hubHeight=height;this._hubEntries=entries;Window_Command.prototype.initialize.call(this,x,y);};
 Panel.prototype.windowWidth=function(){return this._hubWidth;};
 Panel.prototype.windowHeight=function(){return this._hubHeight;};
 Panel.prototype.itemHeight=function(){return 44;};
 Panel.prototype.standardFontSize=function(){return 22;};
 Panel.prototype.makeCommandList=function(){this._hubEntries.forEach(function(e){this.addCommand(e.name,e.symbol,e.enabled!==false,e);},this);};
 Panel.prototype.select=function(index){Window_Command.prototype.select.call(this,index);if(this.changed)this.changed();};
 function Scene_ArenaDebugHub(){this.initialize.apply(this,arguments);}
 Scene_ArenaDebugHub.prototype=Object.create(Scene_MenuBase.prototype);Scene_ArenaDebugHub.prototype.constructor=Scene_ArenaDebugHub;
 Scene_ArenaDebugHub.prototype.createBackground=function(){this._backgroundSprite=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this._backgroundSprite.bitmap.fillAll('#10161b');this.addChild(this._backgroundSprite);};
 Scene_ArenaDebugHub.prototype.create=function(){
  Scene_MenuBase.prototype.create.call(this);var w=Graphics.boxWidth,h=Graphics.boxHeight,self=this;
  this._heading=new Window_Base(16,16,w-32,76);this._heading.contents.fontSize=26;this._heading.drawText('Testes / Debug',0,0,280);this._heading.contents.fontSize=18;this._heading.drawText('Enter: abrir · Esc: voltar · rolagem ↓',288,0,w-356);this.addWindow(this._heading);
  this._help=new Window_Base(16,h-152,w-32,136);this.addWindow(this._help);
  var categories=config().categories.map(function(c){return {name:c.name,symbol:c.id};}).concat([{name:'Voltar ao título',symbol:'back'}]);
  this._categories=new Panel(16,104,232,h-272,categories);this._categories.changed=function(){self.changeCategory();};
  config().categories.forEach(function(c){self._categories.setHandler(c.id,function(){self.focusEntries();});});this._categories.setHandler('back',this.popScene.bind(this));this._categories.setHandler('cancel',this.popScene.bind(this));this.addWindow(this._categories);
  this._entries=new Panel(264,104,w-280,h-272,[]);this._entries.deactivate();this._entries.changed=function(){self.describe();};this._entries.setHandler('cancel',this.focusCategories.bind(this));this.addWindow(this._entries);
  this._categoryId=null;this._categories.select(Math.min(selection.category,categories.length-2));this.changeCategory();this.focusCategories();
 };
 Scene_ArenaDebugHub.prototype.arm=function(focus){this._focus=focus;this._awaitNeutral=true;this._categories.deactivate();this._entries.deactivate();};
 Scene_ArenaDebugHub.prototype.changeCategory=function(){
  if(!this._entries)return;var c=config().categories[this._categories.index()];if(!c){this._help.contents.clear();return;}
  if(this._categoryId===c.id)return;this._categoryId=c.id;selection.category=this._categories.index();
  var self=this,items=available.filter(function(e){return e.category===c.id;});this._entries._hubEntries=items;this._entries.refresh();
  items.forEach(function(e){self._entries.setHandler(e.symbol,function(){selection.items[c.id]=self._entries.index();pending=e.symbol;SceneManager.clearStack();SceneManager.goto(Scene_Title);});});
  this._entries.select(Math.min(selection.items[c.id]||0,Math.max(0,items.length-1)));this.describe();
 };
 Scene_ArenaDebugHub.prototype.focusEntries=function(){if(!this._entries.maxItems())return;this.arm('entries');this.describe();};
 Scene_ArenaDebugHub.prototype.focusCategories=function(){if(this._categoryId)selection.items[this._categoryId]=this._entries.index();this.arm('categories');this.describe();};
 Scene_ArenaDebugHub.prototype.describe=function(){
  var help=this._help;if(!help||!this._entries)return;var e=this._entries.currentExt();help.contents.clear();if(!e)return;help.contents.fontSize=22;help.contents.drawText(e.name,0,0,help.contentsWidth(),28);help.contents.fontSize=18;help.changeTextColor('#d8bd82');help.contents.drawText(e.saving,0,28,help.contentsWidth(),22);help.resetTextColor();
  var words=e.description.split(' '),line='',y=54;words.forEach(function(word){var next=line?line+' '+word:word;if(help.textWidth(next)>help.contentsWidth()&&line){help.contents.drawText(line,0,y,help.contentsWidth(),22);y+=22;line=word;}else line=next;});help.contents.drawText(line,0,y,help.contentsWidth(),22);
 };
 Scene_ArenaDebugHub.prototype.update=function(){
  Scene_MenuBase.prototype.update.call(this);
  if(this._awaitNeutral){if(!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){this._awaitNeutral=false;(this._focus==='entries'?this._entries:this._categories).activate();}return;}
  if(this._categories.active&&Input.isTriggered('right'))this.focusEntries();
  else if(this._entries.active&&Input.isTriggered('left'))this.focusCategories();
 };
})();
