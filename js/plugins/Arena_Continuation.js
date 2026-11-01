/*:
 * @plugindesc v0.2.0 Continuidade M01/M02, destino registrado e laboratório em RAM.
 * @author Codex
 * @param TechnicalDestination
 * @type string
 * @default {"id":"technical.resources.arrival","mapId":5,"x":4,"y":7,"direction":2}
 * @help Após MV_ChapterContinuation e os plugins M01, inclusive Arena_Attributes.
 * Namespace interno arenaContinuation v1; namespace web não muda.
 * Título > Continuidade M02 (sem saves). Somente fixtures sintéticas.
 * Destino configurável somente em mapas técnicos 1/5 existentes; não é Rihad.
 * Campanha: destino registrado por Arena_Rihad; laboratório mantém isolamento.
 * API/status e limites: doc/plugins/Arena_Continuation.md.
 */
var ArenaContinuation;
(function() {
    'use strict';
    var ns='arenaContinuation',beginId='campaign/MQ02.begin',arrivalId='campaign/MQ02.arrive';
    var session=null,restoring=false,lastError='',memoryMaker=DataManager.makeSaveContents,campaignDestination=null;
    var globals=['$gameTemp','$gameSystem','$gameScreen','$gameTimer','$gameMessage','$gameSwitches','$gameVariables','$gameSelfSwitches','$gameActors','$gameParty','$gameTroop','$gameMap','$gamePlayer'];
    MVStateStore.register(ns,1,MVChapterContinuation.defaults());
    function active(){return !!(session&&session.system===$gameSystem);}
    function capture(){return {objects:globals.map(function(k){return window[k];}),slot:DataManager._lastAccessedId};}
    function restore(c){globals.forEach(function(k,i){window[k]=c.objects[i];});DataManager._lastAccessedId=c.slot;}
    function destination(){
        var raw=PluginManager.parameters('Arena_Continuation').TechnicalDestination;
        var d=JSON.parse(raw||'{"id":"technical.resources.arrival","mapId":5,"x":4,"y":7,"direction":2}');
        MVChapterContinuation.begin(MVChapterContinuation.defaults(),beginId,d.id);
        if([1,5].indexOf(d.mapId)<0||!$dataMapInfos[d.mapId]||![d.x,d.y].every(function(v){return Number.isSafeInteger(v)&&v>=0;})||[2,4,6,8].indexOf(d.direction)<0)throw Error('Destino técnico inválido (mapas permitidos: 1 e 5).');
        return d;
    }
    function inspectContents(c){
        try{
            if(!c||!c.system||!c.actors||!c.party||!c.player||!c.map)throw Error('Estrutura de partida incompleta.');
            var root=c.system._persistentState,spaces=root&&root.namespaces||{},entry=spaces[ns];
            if(root&&root.schemaVersion!==1)throw Error('Versão da raiz persistente incompatível.');
            if(entry&&entry.version!==1)throw Error('Versão de continuação incompatível.');
            var s=entry?entry.data:MVChapterContinuation.defaults(),ops=entry&&entry.operations||{};
            MVChapterContinuation.validate(s);
            if((s.phase!=='idle')!==!!ops[beginId]||(s.phase==='arrived')!==!!ops[arrivalId])throw Error('Recibos da continuação inconsistentes.');
            if(s.phase!=='idle'&&s.transitionId!==beginId)throw Error('Transição desconhecida.');
            var n=spaces.arenaNarrative;
            if(n&&[1,2].indexOf(n.version)<0)throw Error('Versão narrativa não suportada neste piloto.');
            var narrative=n?n.data:{mode:'technical',phase:'none'},arena=spaces.arena&&spaces.arena.data;
            var q=arena&&arena.quests&&arena.quests.MQ01,identity=arena&&arena.character;
            var door=q&&q.receipts&&q.receipts['MQ01.cell-door'];
            var view={mode:narrative.mode,phase:narrative.phase,stage:q&&q.stage,completed:q&&q.completed,
                identity:!!(identity&&identity.actorId===1&&identity.raceId&&identity.genderId&&identity.baseVisualId&&c.actors._data[1]),
                doorReceipt:!!(door&&door.sourceId==='MQ01.ruby-key'&&door.quantity===1&&door.kind==='consume')};
            if(narrative.mode==='campaign'){
                if(['intro','ria'].indexOf(view.phase)>=0){
                    if(view.stage!==0||view.completed!==false)throw Error('Introdução e quest inconsistentes.');
                    view.checkpoint='partial_intro';
                }else{
                    if(['dungeon','ending','ended'].indexOf(view.phase)<0||typeof view.completed!=='boolean'||view.completed!==(view.stage===40)||[10,20,30,40].indexOf(view.stage)<0||view.phase!=='dungeon'&&!view.completed)throw Error('Conclusão MQ01 inconsistente.');
                    if(view.stage>=30&&!view.doorReceipt)throw Error('Recibo da porta MQ01 ausente.');
                    view.checkpoint=view.completed?'ready':'pre_gate';
                }
                if(!Number.isInteger(narrative.section)||narrative.section<0||!Number.isInteger(narrative.word)||narrative.word<0||!Array.isArray(narrative.history))throw Error('Cursor narrativo inválido.');
                // v1 positions are already migrated by Arena_Narrative; do not
                // compare an old Ria cursor against the rewritten v2 sections.
                if(n.version===2&&['intro','ria'].indexOf(narrative.phase)>=0){
                    var sections=$arenaNarrative.sections.filter(function(v){return v.phase===narrative.phase;}),item=sections[narrative.section];
                    if(!item||narrative.word>item.text.replace(/\{nome\}/g,c.actors._data[1].name()).split(/\s+/).length)throw Error('Posição narrativa fora do texto.');
                }
            }
            var result=MVChapterContinuation.inspect(view,s);
            result.state=JSON.parse(JSON.stringify(s));return result;
        }catch(e){return {code:'incompatible',eligible:false,reason:e.message};}
    }
    function status(){
        if(window.ArenaBalanceLab&&ArenaBalanceLab.active()||window.ArenaAttributes&&ArenaAttributes.labActive())return {code:'technical',eligible:false};
        try{return inspectContents(memoryMaker.call(DataManager));}catch(e){return {code:'incompatible',eligible:false,reason:e.message};}
    }
    function begin(){
        if(!active()||!(SceneManager._scene instanceof Laboratory)||$gameParty.inBattle())return false;
        var check=status();if(!check.eligible)return false;
        try{
            var d=destination(),next=MVChapterContinuation.begin(check.state,beginId,d.id);
            return MVStateStore.once(ns,beginId,function(s){Object.assign(s,next);})==='applied';
        }catch(e){session.message=e.message;return false;}
    }
    function arrive(){
        if(!active()||!(SceneManager._scene instanceof Laboratory)||$gameParty.inBattle()||session.request||$gamePlayer.isTransferring()||status().code!=='travelling')return false;
        try{
            var d=destination();if(d.id!==MVStateStore.read(ns).destinationId)throw Error('Destino salvo não está configurado; transição preservada.');
            session.request=d;DataManager.loadMapData(d.mapId);
            SceneManager._scene._choices.deactivate();SceneManager._scene._armed=false;return true;
        }catch(e){session.message=e.message;return false;}
    }
    function validArrival(map,d){
        if(!map||d.x>=map.width||d.y>=map.height)throw Error('Chegada fora dos limites do mapa.');
        var flags=$dataTilesets[map.tilesetId].flags,pass=[1,2,4,8].some(function(bit){
            for(var z=3;z>=0;z--){var flag=flags[map.data[(z*map.height+d.y)*map.width+d.x]]||0;if(flag&16)continue;return !(flag&bit);}return false;
        });
        // Existing TechnicalPreview labs use regions, not their intentionally
        // empty tile layer, as the passability authority.
        if(map.meta&&map.meta.TechnicalPreview)pass=map.data[(5*map.height+d.y)*map.width+d.x]!==1;
        if(!pass||map.events.some(function(e){return e&&e.x===d.x&&e.y===d.y;}))throw Error('Chegada bloqueada por tile/evento.');
    }
    function campaignActive(){
        if(!campaignDestination||!$gameSystem||active())return false;
        var s=MVStateStore.read(ns);
        return s.destinationId===campaignDestination.id&&s.phase!=='idle';
    }
    function beginCampaign(){
        if(!campaignDestination||active()||$gameParty.inBattle()||!status().eligible)return false;
        var d=campaignDestination;
        var applied=MVStateStore.once(ns,beginId,function(s){Object.assign(s,MVChapterContinuation.begin(s,beginId,d.id));});
        if(applied!=='applied')return false;
        $gameTemp.clearDestination();$gamePlayer.reserveTransfer(d.mapId,d.x,d.y,d.direction,0);
        SceneManager.clearStack();SceneManager.goto(Scene_Map);return true;
    }
    function resumeCampaign(){
        if(!campaignActive()||MVStateStore.read(ns).phase!=='travelling')return;
        var d=campaignDestination;$gamePlayer.reserveTransfer(d.mapId,d.x,d.y,d.direction,0);
    }
    function completeCampaignArrival(){
        var d=campaignDestination;
        if(!d||!campaignActive()||MVStateStore.read(ns).phase!=='travelling'||$gameMap.mapId()!==d.mapId||$gamePlayer.x!==d.x||$gamePlayer.y!==d.y)return;
        MVStateStore.once(ns,arrivalId,function(s){Object.assign(s,MVChapterContinuation.arrive(s));});
        if(!ArenaPersistence.snapshot().quests.MQ02)ArenaPersistence.setQuest('MQ02',10,{},false);
    }
    var mapLoaded=Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded=function(){
        mapLoaded.apply(this,arguments);
        completeCampaignArrival();
        if(active()&&session.request){
            var d=session.request;
            if($gameMap.mapId()===d.mapId&&$gamePlayer.x===d.x&&$gamePlayer.y===d.y){
                MVStateStore.once(ns,arrivalId,function(s){Object.assign(s,MVChapterContinuation.arrive(s));});
                session.message=d.id==='rihad.arrival'?'Amostra de Rihad concluída; snapshots só em RAM.':'Chegada técnica concluída. Não é Rihad; dados preservados.';session.request=null;
            }
        }
    };
    var extract=DataManager.extractSaveContents;
    DataManager.extractSaveContents=function(c){
        if(active()&&!restoring)throw Error('Saia do laboratório antes de carregar um slot normal.');
        var check=inspectContents(c);if(check.code==='incompatible'){lastError=check.reason;throw Error(check.reason);}
        return extract.apply(this,arguments);
    };
    var load=DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue=function(){
        lastError='';if(active()){lastError='Laboratório: use Carregar RAM.';return false;}
        var before=capture();try{var ok=load.apply(this,arguments);if(!ok)restore(before);return ok;}catch(e){restore(before);lastError=e.message;return false;}
    };
    var failed=Scene_Load.prototype.onLoadFailure;
    Scene_Load.prototype.onLoadFailure=function(){failed.apply(this,arguments);if(lastError&&this._helpWindow)this._helpWindow.setText('Save incompatível; dados preservados.');};
    var loadSuccess=Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess=function(){loadSuccess.apply(this,arguments);resumeCampaign();};
    ['saveGame','saveGameWithoutRescue','saveGlobalInfo'].forEach(function(key){var f=DataManager[key];DataManager[key]=function(){return active()?false:f.apply(this,arguments);};});
    DataManager.makeSaveContents=function(){if(active())throw Error('Continuidade: laboratório sem saves normais.');return memoryMaker.apply(this,arguments);};
    ['save','backup','remove','restoreBackup','cleanBackup'].forEach(function(key){var f=StorageManager[key];StorageManager[key]=function(){return active()?false:f.apply(this,arguments);};});
    var saveEnabled=Game_System.prototype.isSaveEnabled;
    Game_System.prototype.isSaveEnabled=function(){return !active()&&saveEnabled.apply(this,arguments);};
    function clear(){if(session)DataManager._lastAccessedId=session.previousSlot;session=null;}
    var setup=DataManager.setupNewGame;
    DataManager.setupNewGame=function(){clear();return setup.apply(this,arguments);};
    function memorySave(){
        if(!active()||$gameParty.inBattle()||$gamePlayer.isTransferring())return false;
        session.memory=JsonEx.stringify(memoryMaker.call(DataManager));session.message='Snapshot guardado só em RAM, sem slot/backup.';return true;
    }
    function loadJson(json){
        var before=capture(),saved=session;
        try{
            var c=JsonEx.parse(json),check=inspectContents(c);if(check.code==='incompatible')throw Error(check.reason);
            restoring=true;DataManager.createGameObjects();DataManager.extractSaveContents(c);saved.system=$gameSystem;saved.request=null;session=saved;return true;
        }catch(e){restore(before);session=saved;session.message='Rejeitado: '+e.message;return false;}finally{restoring=false;}
    }
    function memoryLoad(){if(!active()||!session.memory||$gameParty.inBattle()||$gamePlayer.isTransferring())return false;return loadJson(session.memory);}
    function simulateGate(){
        if(!active()||status().code!=='pre_gate')return false;
        var q=ArenaQuests.snapshot();q.objectives.shiftGate=true;ArenaPersistence.setQuest('MQ01',40,q.objectives,true);ArenaNarrative.finish();
        session.message='Gate simulado somente nesta fixture; sem prêmio/viagem.';return true;
    }
    function fixture(id){
        if(['pre_gate','ending','ended','intro','technical','incompatible'].indexOf(id)<0||!active()&&!(SceneManager._scene instanceof Scene_Title)||$gameParty&&$gameParty.inBattle())return false;
        if(id==='incompatible'){
            if(!active())return false;
            var bad=JsonEx.parse(JsonEx.stringify(memoryMaker.call(DataManager)));bad.system._persistentState.namespaces.arenaNarrative.data.phase='unknown';
            loadJson(JsonEx.stringify(bad));SceneManager.goto(Laboratory);return true;
        }
        var previous=active()?session.previousSlot:DataManager._lastAccessedId;
        DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Continuidade piloto',raceId:'breton',genderId:'female'});$gamePlayer.clearTransferInfo();
        session={system:$gameSystem,previousSlot:previous,memory:null,message:'Fixture sintética; nenhuma partida pessoal foi carregada.',request:null,fixture:id};
        var a=$gameActors.actor(1);a.changeLevel(3,false);ArenaResources.choose(2,'hp');ArenaResources.choose(3,'mp');ArenaAttributes.apply(ArenaAttributes.preview({'2':1,'4':1}));
        $gameParty.gainItem($dataWeapons[1],1);a.changeEquip(0,$dataWeapons[1]);$gameParty.gainItem($dataItems[2],3);$gameParty.gainGold(37);a.learnSkill(9);
        a.setHp(31);a.setMp(12);ArenaPersistence.setResource('vigor',23,ArenaResources.snapshot().vigor.maximum);
        if(id==='intro')MVStateStore.replace('arenaNarrative',{mode:'campaign',phase:'intro',section:1,word:5,history:[]});
        else if(id!=='technical'){
            ArenaPersistence.setQuest('MQ01',20,{rubyKey:true},false);ArenaPersistence.claimSource('MQ01.ruby-key');ArenaPersistence.consumeImportant('MQ01.ruby-key','MQ01.cell-door','consume');
            ArenaPersistence.setQuest('MQ01',30,{rubyKey:true,cellDoor:true},false);
            MVStateStore.replace('arenaNarrative',{mode:'campaign',phase:'dungeon',section:0,word:0,history:[]});
            if(id!=='pre_gate')simulateGate();
            if(id==='ended'){var n=MVStateStore.read('arenaNarrative');n.phase='ended';MVStateStore.replace('arenaNarrative',n);}
        }
        // Re-read an actual JsonEx/DataManager snapshot with the new namespace absent,
        // as in m01; only the continuation defaults may be added by the store.
        var raw=JsonEx.parse(JsonEx.stringify(memoryMaker.call(DataManager)));delete raw.system._persistentState.namespaces[ns];
        loadJson(JsonEx.stringify(raw));SceneManager.clearStack();SceneManager.goto(Laboratory);return true;
    }
    function leave(){if(!active())return;var previous=session.previousSlot;session=null;DataManager.createGameObjects();DataManager._lastAccessedId=previous;SceneManager.clearStack();SceneManager.goto(Scene_Title);}
    var titleStart=Scene_Title.prototype.start;
    Scene_Title.prototype.start=function(){if(active()){var previous=session.previousSlot;session=null;DataManager.createGameObjects();DataManager._lastAccessedId=previous;}return titleStart.apply(this,arguments);};
    function Commands(){this.initialize.apply(this,arguments);}
    Commands.prototype=Object.create(Window_Command.prototype);Commands.prototype.constructor=Commands;
    Commands.prototype.windowWidth=function(){return Graphics.boxWidth-32;};Commands.prototype.standardFontSize=function(){return 19;};
    Commands.prototype.maxCols=function(){return 2;};Commands.prototype.numVisibleRows=function(){return 8;};Commands.prototype.itemHeight=function(){return 32;};
    Commands.prototype.makeCommandList=function(){
        ['Pré-Gate','Fim M01: ending','Fim M01: ended','Introdução parcial','Sessão técnica','Estado incompatível'].forEach(function(label,i){this.addCommand(label,'fixture',true,['pre_gate','ending','ended','intro','technical','incompatible'][i]);},this);
        var s=status();this.addCommand('Simular Gate (fixture)','gate',s.code==='pre_gate');this.addCommand('Continuar jornada','continue',s.eligible);
        this.addCommand('Concluir deslocamento','arrive',s.code==='travelling');this.addCommand('Guardar RAM','store');this.addCommand('Carregar RAM','load',!!session.memory);
        this.addCommand('Voltar ao título','exit');
    };
    function Confirm(){this.initialize.apply(this,arguments);}
    Confirm.prototype=Object.create(Window_Command.prototype);Confirm.prototype.constructor=Confirm;
    Confirm.prototype.windowWidth=function(){return 400;};Confirm.prototype.standardFontSize=function(){return 21;};
    Confirm.prototype.makeCommandList=function(){this.addCommand('Confirmar continuação técnica','yes');this.addCommand('Cancelar sem alterar','cancel');};
    function Laboratory(){this.initialize.apply(this,arguments);}
    Laboratory.prototype=Object.create(Scene_MenuBase.prototype);Laboratory.prototype.constructor=Laboratory;
    Laboratory.prototype.createBackground=function(){this._backgroundSprite=new Sprite(new Bitmap(Graphics.boxWidth,Graphics.boxHeight));this._backgroundSprite.bitmap.fillAll('#101216');this.addChild(this._backgroundSprite);};
    Laboratory.prototype.create=function(){
        Scene_MenuBase.prototype.create.call(this);this._info=new Window_Base(16,8,Graphics.boxWidth-32,264);this.addWindow(this._info);
        this._choices=new Commands(16,280);this.addWindow(this._choices);var w=this._choices,self=this;
        w.setHandler('fixture',function(){fixture(w.currentExt());});w.setHandler('gate',function(){simulateGate();self.refresh();});
        w.setHandler('continue',function(){self._modal=true;self._confirm.show();self._confirm.select(0);self.refresh();});
        w.setHandler('arrive',function(){if(!arrive())self.refresh();});w.setHandler('store',function(){memorySave();self.refresh();});w.setHandler('load',function(){memoryLoad();self.refresh();});
        w.setHandler('exit',leave);w.setHandler('cancel',leave);
        this._confirm=new Confirm((Graphics.boxWidth-400)/2,340);this.addWindow(this._confirm);this._confirm.hide();this._confirm.deactivate();
        this._confirm.setHandler('yes',function(){begin();self.closeConfirm();});this._confirm.setHandler('cancel',this.closeConfirm.bind(this));this.refresh();
    };
    Laboratory.prototype.refresh=function(){
        this._choices.refresh();this._choices.deactivate();this._confirm.deactivate();this._armed=false;
        var s=status(),r=ArenaResources.snapshot(),a=$gameActors.actor(1),d;try{d=destination().id;}catch(e){d=e.message;}
        var names={ready:'pronta',pre_gate:'antes do Gate',partial_intro:'introdução parcial',technical:'sessão técnica',incompatible:'incompatível',travelling:'em deslocamento',arrived:'chegada concluída'};
        var lines=['Continuidade M02-02A · RAM apenas · '+session.fixture,
            'Reconhecimento: '+names[s.code]+' · MQ01 '+ArenaQuests.snapshot().stage+' · fase '+ArenaNarrative.state().phase,
            'Transição: '+(s.state&&s.state.transitionId||'não iniciada'),
            'Destino: '+(s.state&&s.state.destinationId||d),
            'Vida '+a.hp+'/'+a.mhp+' · Mana '+a.mp+'/'+a.mmp+' · Vigor '+r.vigor.current+'/'+r.vigor.maximum,
            'Nível '+a.level+' · pontos livres '+ArenaAttributes.snapshot().available+' · ouro '+$gameParty.gold(),
            'Sem saves normais. Campanha e encerramento m01 preservados.',session.message||''];
        this._info.contents.clear();this._info.contents.fontSize=18;lines.forEach(function(t,i){this._info.drawText(t,0,i*26,this._info.contentsWidth());},this);
    };
    Laboratory.prototype.closeConfirm=function(){this._modal=false;this._confirm.hide();this.refresh();};
    Laboratory.prototype.update=function(){
        Scene_MenuBase.prototype.update.call(this);
        if(!active()||SceneManager.isSceneChanging())return;
        if(session.request){
            if(DataManager.isMapLoaded()){
                try{validArrival($dataMap,session.request);var d=session.request;$gamePlayer.reserveTransfer(d.mapId,d.x,d.y,d.direction,0);SceneManager.goto(Scene_Map);}
                catch(e){session.message=e.message;session.request=null;this.refresh();}
            }
            return;
        }
        if(!this._armed&&!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){this._armed=true;(this._modal?this._confirm:this._choices).activate();}
    };
    var titleCommands=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){titleCommands.apply(this,arguments);this.addCommand('Continuidade M02 (sem saves)','arenaContinuationLab');};
    var createTitle=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){createTitle.apply(this,arguments);this._commandWindow.setHandler('arenaContinuationLab',function(){fixture('ending');});};
    var menu=Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(active())this.addCommand('Voltar ao laboratório M02','arenaContinuationReturn');};
    var menuCreate=Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow=function(){menuCreate.apply(this,arguments);this._commandWindow.setHandler('arenaContinuationReturn',function(){SceneManager.goto(Laboratory);});};
    ArenaContinuation={status:status,inspectContents:inspectContents,begin:begin,arrive:arrive,labActive:active,fixture:fixture,
        memorySave:memorySave,memoryLoad:memoryLoad,simulateGate:simulateGate,leaveLab:leave,lastError:function(){return lastError;},destination:destination,
        campaignActive:campaignActive,beginCampaign:beginCampaign,
        canContinueCampaign:function(){return !!campaignDestination&&!active()&&status().eligible;},
        registerCampaignDestination:function(d){
            if(!d||d.id!=='rihad.arrival'||!Number.isInteger(d.mapId)||!$dataMapInfos[d.mapId]||!Number.isInteger(d.x)||!Number.isInteger(d.y)||d.x<0||d.y<0||[2,4,6,8].indexOf(d.direction)<0)throw Error('Destino de campanha inválido.');
            campaignDestination=Object.freeze(Object.assign({},d));
        },
        previewArrival:function(d){
            if(!fixture('ending'))return false;
            MVStateStore.once(ns,beginId,function(s){Object.assign(s,MVChapterContinuation.begin(s,beginId,d.id));});
            session.request=d;DataManager.loadMapData(d.mapId);return true;
        }};
})();
