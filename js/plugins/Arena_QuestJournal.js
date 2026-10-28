/*:
 * @plugindesc v0.2.0 Diário: filtros, lista, descrição, passos e leitura responsiva.
 * @author Codex
 * @help Após Arena_Quests e MV_JournalModel. Dados: ArenaQuestJournal.json.
 * API ArenaQuestJournal.open/inspect. Apenas leitura de quests/inventário.
 * Estado de navegação em Game_Temp; tamanho do canvas restaurado ao sair.
 */
var ArenaQuestJournal;
(function(){
 'use strict';
 if(!window.ArenaQuests||!window.MVJournalModel)throw Error('Arena_QuestJournal: dependências ausentes');
 DataManager._databaseFiles.push({name:'$arenaQuestJournal',src:'ArenaQuestJournal.json'});
 var filters=[{id:'pending',text:'Pendentes'},{id:'complete',text:'Concluídas'},{id:'all',text:'Todas'}];
 function inside(r,x,y){return r&&x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h;}
 function clamp(n,max){return Math.max(0,Math.min(Math.max(0,max),n));}
 function Journal(){this.initialize.apply(this,arguments);}
 Journal.prototype=Object.create(Window_Base.prototype);Journal.prototype.constructor=Journal;
 Journal.prototype.standardPadding=function(){return 0;};
 Journal.prototype.initialize=function(scene){
  Window_Base.prototype.initialize.call(this,0,0,Graphics.boxWidth,Graphics.boxHeight);this.opacity=0;this._scene=scene;
  this._memory=$gameTemp._arenaJournalView||{filter:'pending',selected:{},offsets:{},listOffsets:{}};$gameTemp._arenaJournalView=this._memory;
  this._compact=Graphics.boxWidth<760||Graphics.boxHeight<520;this._focus='list';this._mode='list';this._tab=this._memory.context&&this._memory.context.tab||'description';this._signature='';this._targets=[];this._panels={};this.sync(true);
 };
 Journal.prototype.offsets=function(){var id=this._selected;return this._memory.offsets[id]||(this._memory.offsets[id]={description:0,steps:0});};
 Journal.prototype.offset=function(id){return id==='list'?this._memory.listOffsets[this._memory.filter]||0:this.offsets()[id]||0;};
 Journal.prototype.setOffset=function(id,n){var p=this._panels[id];n=clamp(n,p?p.max:0);if(id==='list')this._memory.listOffsets[this._memory.filter]=n;else this.offsets()[id]=n;this._dirty=true;};
 Journal.prototype.sync=function(first){
  var states=ArenaPersistence.snapshot().quests,definitions=$arenaQuestJournal.quests,signature=JSON.stringify([states,definitions,this.notice()]);
  if(!first&&signature===this._signature)return;this._signature=signature;this._states=states;
  this._list=MVJournalModel.list(definitions,states,this._memory.filter);
  var id=this._memory.selected[this._memory.filter],valid=this._list.some(function(d){return d.id===id;});
  this._selected=valid?id:this._list.length?this._list[0].id:null;this._memory.selected[this._memory.filter]=this._selected;
  this._entry=this._selected?MVJournalModel.entry(this._list.filter(function(d){return d.id===this._selected;},this)[0],states[this._selected]):null;
  if(first){var context=this._memory.context;this._mode=context?context.mode:this._list.length===1?'details':'list';this._focus=context?context.focus:this._list.length===1?(this._compact?this._tab:'steps'):'list';}if(!this._list.length)this._mode='list';
  this._dirty=true;this.draw();
 };
 Journal.prototype.notice=function(){
  var q=ArenaQuests.snapshot();if(q.stage===20){var source=ArenaPersistence.sourceStatus('MQ01.ruby-key');if(source.active&&source.missing)return 'A chave está ausente: volte à fonte na cela.';}
  if(q.stage>0&&!$arenaQuests.stages.some(function(s){return s.id===q.stage;}))return 'Etapa de laboratório não reconhecida; nenhuma transição automática.';
  if(q.stage>=30&&!Object.keys(q.receipts).some(function(k){var r=q.receipts[k];return r.sourceId==='MQ01.ruby-key'&&['consume','deliver'].indexOf(r.kind)>=0;}))return 'Registro de uso ausente: progresso bloqueado para revisão.';
  return '';
 };
 Journal.prototype.selectQuest=function(id){this._selected=id;this._memory.selected[this._memory.filter]=id;this._entry=MVJournalModel.entry(this._list.filter(function(d){return d.id===id;})[0],this._states[id]);this._dirty=true;};
 Journal.prototype.setFilter=function(id){this._memory.filter=id;this._signature='';this.sync();if(this._compact){this._mode=this._list.length===1?'details':'list';this._focus=this._mode==='list'?'list':this._tab;}this.draw();};
 Journal.prototype.text=function(text,x,y,w,size,color){this.contents.fontSize=size||21;this.contents.textColor=color||'#e0dfd4';this.contents.drawText(text,x,y,w,30);};
 Journal.prototype.rect=function(r,fill,stroke){this.contents.fillRect(r.x,r.y,r.w,r.h,fill);if(stroke){this.contents.fillRect(r.x,r.y,r.w,1,stroke);this.contents.fillRect(r.x,r.y+r.h-1,r.w,1,stroke);this.contents.fillRect(r.x,r.y,1,r.h,stroke);this.contents.fillRect(r.x+r.w-1,r.y,1,r.h,stroke);}};
 Journal.prototype.diamond=function(x,y,done){var c=this.contents._context;c.save();c.strokeStyle='#c5b783';c.fillStyle=done?'#c5b783':'#17272b';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y-7);c.lineTo(x+7,y);c.lineTo(x,y+7);c.lineTo(x-7,y);c.closePath();c.fill();c.stroke();if(done){c.strokeStyle='#142326';c.beginPath();c.moveTo(x-4,y);c.lineTo(x-1,y+3);c.lineTo(x+4,y-3);c.stroke();}c.restore();this.contents._setDirty();};
 Journal.prototype.button=function(id,text,r,selected,focus){this.rect(r,selected?'#24433f':'#142126',focus?'#d8c18a':'#596760');this.text((selected?'• ':'')+text,r.x+10,r.y+(r.h-30)/2,r.w-20,20);this._targets.push({id:id,rect:r});};
 Journal.prototype.panel=function(id,title,r){
  this.rect(r,'rgba(12,23,27,.96)',this._focus===id?'#d6c18b':'#4a5b58');this.text(title,r.x+14,r.y+5,r.w-28,18,'#bfc7bd');
  this.contents.fillRect(r.x+14,r.y+37,r.w-28,1,'#697366');this.diamond(r.x+r.w/2,r.y+37,false);
  var arrow=this._compact?44:28,p={rect:r,content:{x:r.x+14,y:r.y+48,w:r.w-28-arrow,h:r.h-60},arrow:arrow,max:0};this._panels[id]=p;return p;
 };
 Journal.prototype.wrapped=function(text,width,size){this.contents.fontSize=size;return MVJournalModel.wrap(text,Math.max(1,width),this.textWidth.bind(this));};
 Journal.prototype.clip=function(r,draw){var c=this.contents._context;c.save();c.beginPath();c.rect(r.x,r.y,r.w,r.h);c.clip();draw();c.restore();this.contents._setDirty();};
 Journal.prototype.scrollbar=function(id,total){var p=this._panels[id];p.max=Math.max(0,total-p.content.h);var value=clamp(this.offset(id),p.max);if(value!==this.offset(id))this.setOffset(id,value);if(!p.max)return;
  var r=p.rect,a=p.arrow,x=r.x+r.w-a-5,up={x:x,y:p.content.y,w:a,h:a},down={x:x,y:p.content.y+p.content.h-a,w:a,h:a};
  this.button(id+'Up','',up,false,this._focus===id);this.button(id+'Down','',down,false,false);this.contents.fontSize=22;this.contents.drawText('↑',up.x,up.y+(up.h-30)/2,up.w,30,'center');this.contents.drawText('↓',down.x,down.y+(down.h-30)/2,down.w,30,'center');
  if(p.content.h>2*a+8){var h=p.content.h-2*a-8,thumb=Math.max(12,h*p.content.h/total),y=p.content.y+a+4;this.contents.fillRect(x+a/2-2,y,4,h,'#3f4b4b');this.contents.fillRect(x+a/2-2,y+(h-thumb)*value/p.max,4,thumb,'#c0b07d');}
 };
 Journal.prototype.drawList=function(r){
  var p=this.panel('list','Missões ('+this._list.length+')',r),y=0,rows=[];
  this._list.forEach(function(d){var lines=this.wrapped(d.title,p.content.w-18,20),h=lines.length*26+40;rows.push({definition:d,lines:lines,top:y,height:h});y+=h+8;},this);this.scrollbar('list',y);
  var offset=this.offset('list');this._rows=rows;
  this.clip(p.content,function(){
   if(!rows.length){this.wrapped(this._memory.filter==='complete'?'Nenhuma quest concluída.':this._memory.filter==='pending'?'Nenhuma quest pendente.':'Nenhuma quest disponível no diário.',p.content.w,20).forEach(function(t,i){this.text(t,p.content.x,p.content.y+i*27,p.content.w,20,'#aeb8b1');},this);}
   rows.forEach(function(row){var y=p.content.y+row.top-offset,selected=row.definition.id===this._selected,rr={x:p.content.x,y:y,w:p.content.w,h:row.height};if(selected)this.rect(rr,'#233f3b','#b5a777');
    row.lines.forEach(function(t,i){this.text(t,rr.x+14,y+4+i*26,rr.w-20,20);},this);this.text((selected?'› ':'')+(this._states[row.definition.id].completed?'Concluída':'Pendente'),rr.x+14,y+row.lines.length*26+6,rr.w-20,17,'#c5b783');
    if(rr.y+rr.h>p.content.y&&rr.y<p.content.y+p.content.h)this._targets.push({id:'quest:'+row.definition.id,rect:{x:rr.x,y:Math.max(rr.y,p.content.y),w:rr.w,h:Math.min(rr.y+rr.h,p.content.y+p.content.h)-Math.max(rr.y,p.content.y)}});
   },this);
  }.bind(this));
  // Arrows stay above row hit targets.
  this._targets.sort(function(a,b){return /^quest:/.test(a.id)?-1:/^quest:/.test(b.id)?1:0;});
 };
 Journal.prototype.drawContent=function(id,r){
  var p=this.panel(id,id==='description'?'Descrição geral':'Passos da quest',r),entry=this._entry,blocks=[],y=0;
  if(!entry){this.text('Selecione uma quest disponível.',p.content.x,p.content.y,p.content.w,20,'#aeb8b1');return;}
  function add(text,size,color,indent){var lines=this.wrapped(text,p.content.w-(indent||0),size);blocks.push({lines:lines,top:y,size:size,color:color,indent:indent||0});y+=lines.length*28+12;}
  if(id==='description'||this._compact)add.call(this,entry.title,24,'#d5c18c');
  if(id==='description'){add.call(this,entry.description||'Não há descrição revelada.',21);}
  else {
   if(entry.id==='MQ01'&&this.notice()){add.call(this,'Verificação de estado',17,'#e0c68b');add.call(this,this.notice(),20,'#e0c68b');}
   entry.steps.forEach(function(step,index){var label=step.done?'Concluído':entry.steps.slice(0,index).every(function(s){return s.done;})?'Atual':'Pendente';
    var start=y;add.call(this,label,17,step.done?'#b1c2b4':'#e0c68b',30);y-=8;add.call(this,step.text,21,step.done?'#c5ccc2':'#eee4c8',30);blocks[blocks.length-2].step=step;blocks[blocks.length-2].stepTop=start;
   },this);
   if(!entry.steps.length)add.call(this,'Nenhum passo revelado.',21,'#acb8b2');
  }
  this.scrollbar(id,Math.max(0,y-12));
  if(id==='steps'){
   var current=blocks.filter(function(b){return b.step&&!b.step.done;})[0],key=entry.id+':'+(current?current.step.id:'complete');this._memory.positioned=this._memory.positioned||{};
   if(!this._memory.positioned[key]){this._memory.positioned[key]=true;if(current&&!(entry.id==='MQ01'&&this.notice()))this.setOffset(id,Math.max(0,current.top-12));}
  }
  var offset=this.offset(id);
  this.clip(p.content,function(){blocks.forEach(function(b){if(b.step)this.diamond(p.content.x+9,p.content.y+b.top-offset+13,b.step.done);b.lines.forEach(function(line,i){this.text(line,p.content.x+b.indent,p.content.y+b.top+i*28-offset,p.content.w-b.indent,b.size,b.color);},this);},this);}.bind(this));
  this._contentBlocks=this._contentBlocks||{};this._contentBlocks[id]=blocks;
 };
 Journal.prototype.draw=function(){
  this._dirty=false;this.contents.clear();this._targets=[];this._panels={};var wasCompact=this._compact;this._compact=Graphics.boxWidth<760||Graphics.boxHeight<520;if(this._compact&&(this._focus==='steps'||this._focus==='description')){this._tab=this._focus;if(!wasCompact)this._mode='details';}
  var w=Graphics.boxWidth,h=Graphics.boxHeight,m=16,body={x:m,y:132,w:w-2*m,h:h-188};
  this.rect({x:0,y:0,w:w,h:h},'rgba(7,14,18,.9)');this.text('Diário',m,16,w-330,28,'#dcc892');
  if(this._compact)this.button('switch','Missões ('+this._list.length+')',{x:w-310,y:12,w:160,h:48},this._mode==='list',this._focus==='switch');
  this.button('back','Voltar',{x:w-134,y:12,w:118,h:48},false,this._focus==='back');
  var fw=Math.min(170,(w-2*m-16)/3);filters.forEach(function(f,i){this.button('filter:'+f.id,f.text,{x:m+i*(fw+8),y:72,w:fw,h:48},this._memory.filter===f.id,this._focus==='filters'&&this._memory.filter===f.id);},this);
  if(!this._compact){this.drawList({x:m,y:body.y,w:224,h:body.h});body.x=252;body.w=w-268;}
  if(this._compact&&this._mode==='list')this.drawList(body);
  else {
   if(!this._compact)this.text('Status geral',body.x+10,body.y,body.w-175,19,'#b8c2b8');var sr={x:body.x+body.w-158,y:body.y,w:158,h:this._compact?44:36};this.rect(sr,this._entry&&this._entry.completed?'#24433f':'#142126','#596760');this.text((this._compact?'Status: ':'')+(this._entry?this._entry.status:'—'),sr.x+10,sr.y+(sr.h-30)/2,sr.w-20,this._compact?17:20,'#dbc78f');
   if(this._compact){var tw=Math.floor((body.w-174)/2);this.button('tab:description','Descrição',{x:body.x,y:body.y,w:tw,h:44},this._tab==='description',this._focus==='description');this.button('tab:steps','Passos',{x:body.x+tw+8,y:body.y,w:tw,h:44},this._tab==='steps',this._focus==='steps');this.drawContent(this._tab,{x:body.x,y:body.y+56,w:body.w,h:body.h-56});}
   else {var contentH=body.h-48,descH=Math.floor(contentH*.48);this.drawContent('description',{x:body.x,y:body.y+48,w:body.w,h:descH});this.drawContent('steps',{x:body.x,y:body.y+60+descH,w:body.w,h:contentH-descH-12});}
  }
  var help=this._compact?'Toque: selecionar · Arraste: rolar · Esc: voltar':'Tab: foco · ↑↓: navegar/rolar · PgUp/PgDn: filtros · Esc: voltar';
  this.rect({x:m,y:h-43,w:w-2*m,h:30},'#142126');this.text(help,m+8,h-42,w-2*m-16,this._compact?17:16,'#bfc7bd');
  var visible=this.focuses();if(visible.indexOf(this._focus)<0){this._focus=visible[0];this._dirty=true;}
 };
 Journal.prototype.focuses=function(){return ['filters'].concat(this._panels.list?['list']:[],this._panels.description?['description']:[],this._panels.steps?['steps']:[],this._compact?['switch']:[],['back']);};
 Journal.prototype.ensureSelection=function(){var p=this._panels.list,row=this._rows&&this._rows.filter(function(r){return r.definition.id===this._selected;},this)[0];if(!p||!row)return;var value=this.offset('list');if(row.top<value||row.height>p.content.h)this.setOffset('list',row.top);else if(row.top+row.height>value+p.content.h)this.setOffset('list',row.top+row.height-p.content.h);};
 Journal.prototype.action=function(id){
  if(id==='back'){this._scene.popScene();return;}if(id==='switch'){this._mode=!this._list.length?'list':this._mode==='list'?'details':'list';this._focus=this._mode==='list'?'list':this._tab;}
  else if(id.indexOf('filter:')===0){this._focus='filters';this.setFilter(id.slice(7));}
  else if(id.indexOf('quest:')===0){this.selectQuest(id.slice(6));this._focus='list';if(this._compact){this._mode='details';this._focus=this._tab;}}
  else if(id.indexOf('tab:')===0){this._tab=id.slice(4);this._focus=this._tab;}
  else {var match=id.match(/^(list|description|steps)(Up|Down)$/);if(match){this._focus=match[1];this.setOffset(match[1],this.offset(match[1])+(match[2]==='Up'?-78:78));}}
  this._dirty=true;
 };
 Journal.prototype.keyboard=function(){
  if(Input.isTriggered('cancel')){this._scene.popScene();return;}
  if(Input.isTriggered('tab')){var focus=this.focuses(),i=focus.indexOf(this._focus),d=Input.isPressed('shift')?-1:1;this._focus=focus[(i+d+focus.length)%focus.length];this._dirty=true;}
  var f=filters.map(function(v){return v.id;}),fi=f.indexOf(this._memory.filter);
  if(Input.isTriggered('pageup')||this._focus==='filters'&&Input.isRepeated('left'))this.setFilter(f[(fi+2)%3]);
  if(Input.isTriggered('pagedown')||this._focus==='filters'&&Input.isRepeated('right'))this.setFilter(f[(fi+1)%3]);
  var direction=Input.isRepeated('down')?1:Input.isRepeated('up')?-1:0;
  if(direction){if(this._focus==='list'&&this._list.length){var ids=this._list.map(function(d){return d.id;}),n=clamp(ids.indexOf(this._selected)+direction,ids.length-1);this.selectQuest(ids[n]);this.ensureSelection();}else if(this._panels[this._focus])this.setOffset(this._focus,this.offset(this._focus)+direction*28);}
  if(Input.isTriggered('ok')){if(this._focus==='back')this.action('back');else if(this._focus==='switch')this.action('switch');else if(this._focus==='list'&&this._selected){this._mode='details';this._focus=this._tab;this._dirty=true;}else if(this._focus==='filters'){this._focus=this._compact&&this._mode==='details'?this._tab:'list';this._dirty=true;}}
 };
 Journal.prototype.pointer=function(){
  var x=TouchInput.x,y=TouchInput.y,region=Object.keys(this._panels).filter(function(id){return inside(this._panels[id].content,x,y);},this)[0];
  if(TouchInput.wheelY){var point=this._wheelPoint||[x,y],wheelRegion=Object.keys(this._panels).filter(function(id){return inside(this._panels[id].content,point[0],point[1]);},this)[0];this._wheelPoint=null;if(wheelRegion){this._focus=wheelRegion;this.setOffset(wheelRegion,this.offset(wheelRegion)+TouchInput.wheelY);}}
  if(TouchInput.isTriggered()){var hit=this._targets.slice().reverse().filter(function(t){return inside(t.rect,x,y);})[0];this._drag={x:x,y:y,last:y,moved:0,region:region,hit:hit};if(region)this._focus=region;this._dirty=true;}
  if(this._drag&&TouchInput.isPressed()){var d=this._drag;d.moved=Math.max(d.moved,Math.abs(y-d.y),Math.abs(x-d.x));if(d.region&&d.moved>8)this.setOffset(d.region,this.offset(d.region)+d.last-y);d.last=y;}
  if(this._drag&&TouchInput.isReleased()){var end=this._drag;this._drag=null;if(end.moved<=8&&end.hit&&inside(end.hit.rect,x,y))this.action(end.hit.id);}
 };
 Journal.prototype.update=function(){Window_Base.prototype.update.call(this);this.sync();if(SceneManager.isSceneChanging())return;this.keyboard();this.pointer();if(this._dirty)this.draw();};
 Journal.prototype.inspect=function(){return {filter:this._memory.filter,selected:this._selected,focus:this._focus,compact:this._compact,mode:this._mode,tab:this._tab,quests:this._list.map(function(d){return d.id;}),entry:this._entry,panels:this._panels,blocks:this._contentBlocks,offsets:this._memory.offsets,targets:this._targets,screen:[Graphics.boxWidth,Graphics.boxHeight]};};
 function Scene_ArenaJournal(){this.initialize.apply(this,arguments);}
 Scene_ArenaJournal.prototype=Object.create(Scene_MenuBase.prototype);Scene_ArenaJournal.prototype.constructor=Scene_ArenaJournal;
 Scene_ArenaJournal.prototype.resizeJournal=function(){var small=window.innerWidth<this._original.width||window.innerHeight<this._original.height,w=small?Math.max(540,Math.floor(window.innerWidth)):this._original.width,h=small?Math.max(400,Math.floor(window.innerHeight)):this._original.height;if(Graphics.width!==w||Graphics.height!==h){Graphics.boxWidth=w;Graphics.boxHeight=h;Graphics.width=w;Graphics.height=h;if(this._windowLayer)this._windowLayer.move(0,0,w,h);if(this._journal){this._journal.move(0,0,w,h);this._journal.createContents();this._journal.draw();}}};
 Scene_ArenaJournal.prototype.create=function(){this._original={width:Graphics.width,height:Graphics.height,boxWidth:Graphics.boxWidth,boxHeight:Graphics.boxHeight};this.resizeJournal();Scene_MenuBase.prototype.create.call(this);if(this._backgroundSprite)this._backgroundSprite.opacity=40;this._journal=new Journal(this);this.addWindow(this._journal);this._journalWheel=function(e){this._journal._wheelPoint=[Graphics.pageToCanvasX(e.pageX),Graphics.pageToCanvasY(e.pageY)];}.bind(this);document.addEventListener('wheel',this._journalWheel,{passive:true});};
 Scene_ArenaJournal.prototype.update=function(){this.resizeJournal();Scene_MenuBase.prototype.update.call(this);};
 Scene_ArenaJournal.prototype.terminate=function(){document.removeEventListener('wheel',this._journalWheel);this._journal._memory.context={focus:this._journal._focus,mode:this._journal._compact?this._journal._mode:['description','steps'].indexOf(this._journal._focus)>=0?'details':'list',tab:this._journal._tab};$gameTemp._arenaJournalView=this._journal._memory;Scene_MenuBase.prototype.terminate.call(this);Graphics.boxWidth=this._original.boxWidth;Graphics.boxHeight=this._original.boxHeight;Graphics.width=this._original.width;Graphics.height=this._original.height;};
 var prevent=Input._shouldPreventDefault;
 Input._shouldPreventDefault=function(key){return key===9&&SceneManager._scene instanceof Scene_ArenaJournal||prevent.apply(this,arguments);};
 ArenaQuestJournal={open:function(){SceneManager.push(Scene_ArenaJournal);},inspect:function(){return SceneManager._scene._journal&&SceneManager._scene._journal.inspect();}};
})();
