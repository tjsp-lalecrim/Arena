/*:
 * @plugindesc v0.5.0 Poções e descanso autorizado em refúgios configurados da dungeon.
 * @author Codex
 * @help Após Arena_Resources, Arena_Inventory e Arena_BattleUI. Sem dependências externas.
 * Configuração: data/ArenaRecovery.json. Não há parâmetros no gerenciador.
 * menuIntervalMs: inteiro >=0, padrão500; mesmo com0 exige nova pressão/soltura.
 * ArenaRecovery.restAt(id, interpreter) valida o ponto antes de ArenaResources.rest().
 * Eventos: passar this (Game_Interpreter). Não concede itens ou altera progressão.
 * Poções configuradas usam o fluxo nativo existente, sem confirmação intermediária.
 * Nenhum novo estado persistente; inventário/HP/MP nativos e Vigor M01-08.
 * Consulte doc/plugins/Arena_Recovery.md e doc/POCOES_E_DESCANSO_M01_17.md.
 */
var ArenaRecovery;
(function() {
    'use strict';
    DataManager._databaseFiles.push({name: '$arenaRecovery', src: 'ArenaRecovery.json'});
    var loaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!loaded.apply(this, arguments)) return false;
        var c = $arenaRecovery, ids = {};
        if (!c || c.schemaVersion !== 1 || c.actorId !== 1 ||
                !Array.isArray(c.potionIds) || !Array.isArray(c.restPoints) ||
                !c.potionIds.every(function(id) {
                    var i = $dataItems[id];
                    return Number.isInteger(id) && i && i.consumable && i.scope === 7 &&
                        i.repeats === 1 && i.itypeId !== 2 && !i.meta.ArenaLearnSkill &&
                        !i.meta.ArenaQuest && !i.meta.ArenaUnique;
                }) || !c.restPoints.every(function(p) {
                    if (!p || typeof p.id !== 'string' || !p.id || ids[p.id] ||
                            !Number.isInteger(p.mapId) || !$dataMapInfos[p.mapId] ||
                            !Number.isInteger(p.eventId) || p.eventId < 1 ||
                            typeof p.technical !== 'boolean' || !p.source) return false;
                    ids[p.id] = true; return true;
                })) throw new Error('Arena: configuração de recuperação inválida. Confira ArenaRecovery.json.');
        if (c.menuIntervalMs !== undefined && (!Number.isInteger(c.menuIntervalMs) || c.menuIntervalMs < 0)) throw new Error('Arena: menuIntervalMs deve ser inteiro não negativo.');
        var positions={},events={};
        if(c.restPoints.filter(function(p){return p.dungeonPilot;}).length>1||c.restPoints.some(function(p){
            var eventKey=p.mapId+':'+p.eventId;if(events[eventKey])return true;events[eventKey]=true;
            if(!p.dungeonPilot&&!p.dungeonRefuge)return false;
            var key=p.mapId+':'+p.x+':'+p.y;if(positions[key]||!Number.isInteger(p.x)||!Number.isInteger(p.y))return true;
            positions[key]=true;return false;
        }))throw Error('Arena: refúgios exigem coordenadas/eventos únicos e no máximo um piloto.');
        return true;
    };
    function actor() { return $gameActors.actor($arenaRecovery.actorId); }
    function potion(item) {
        return item && DataManager.isItem(item) && $arenaRecovery.potionIds.indexOf(item.id) >= 0;
    }
    function restAvailable(id,interpreter) {
        var point=$arenaRecovery.restPoints.filter(function(p){return p.id===id;})[0];
        var event=point&&$gameMap.event(point.eventId);
        return !!(point&&!$gameParty.inBattle()&&!$gamePlayer.isTransferring()&&
            !$gamePlayer.isInVehicle()&&actor().isAlive()&&!$gameMessage.isBusy()&&
            $gameMap.mapId()===point.mapId&&event&&!event._erased&&
            interpreter instanceof Game_Interpreter&&interpreter._mapId===point.mapId&&
            interpreter.eventId()===point.eventId&&$gameMap.distance($gamePlayer.x,$gamePlayer.y,event.x,event.y)<=1);
    }
    ArenaRecovery = {
        isPotion: potion,
        restAt: function(id, interpreter) {
            if (!restAvailable(id,interpreter)) {
                return {ok: false, reason: 'Descanso indisponível neste local ou situação.'};
            }
            return {ok: ArenaResources.rest()};
        }
    };
    // Only an explicit event interaction restores resources. These presentation
    // fields are transient; loading never grants recovery or changes the world.
    ArenaRecovery.usePoint=function(id,interpreter){
        if(!restAvailable(id,interpreter)||$gameTemp._arenaRestAwaitRelease)return {ok:false};
        $gameTemp._arenaRestAwaitRelease=true;$gameTemp.clearDestination();
        var before=ArenaResources.snapshot(),keys=['hp','mp','vigor'];
        if(keys.every(function(k){return before[k].current===before[k].maximum;})){
            $gameTemp._arenaRestFeedback=null;$gameTemp._arenaRestStatusUntil=Date.now()+1100;
            return {ok:false,reason:'full'};
        }
        var result=this.restAt(id,interpreter);
        if(result.ok){$gameTemp._arenaRestStatusUntil=0;$gameTemp._arenaRestFeedback={before:before,time:Date.now()};}
        return result;
    };
    function pilot(){return $arenaRecovery.restPoints.filter(function(p){return p.dungeonPilot;})[0];}
    function nearestRefuge(){
        var points=$arenaRecovery.restPoints.filter(function(p){return (p.dungeonPilot||p.dungeonRefuge)&&p.mapId===$gameMap.mapId()&&$gameMap.event(p.eventId)&&!$gameMap.event(p.eventId)._erased;});
        points.sort(function(a,b){return $gameMap.distance($gamePlayer.x,$gamePlayer.y,a.x,a.y)-$gameMap.distance($gamePlayer.x,$gamePlayer.y,b.x,b.y)||a.eventId-b.eventId;});
        return points[0];
    }
    ArenaRecovery.startRestPilot=function(){
        var p=pilot();ArenaDungeon.startLab();$gameSystem._arenaEncounterTechnical=true;
        $gameTemp._arenaRestAwaitRelease=true;
        $gamePlayer.reserveTransfer(p.mapId,p.x,p.y,2,0);
        actor().setHp(35);actor().setMp(10);
        ArenaPersistence.setResource('vigor',20,ArenaResources.snapshot().vigor.maximum);
    };
    function syncRestEvents(){
        $arenaRecovery.restPoints.forEach(function(p){if((p.dungeonPilot||p.dungeonRefuge)&&$gameMap.mapId()===p.mapId&&!$gameMap.event(p.eventId)&&$dataMap.events[p.eventId])$gameMap._events[p.eventId]=new Game_Event(p.mapId,p.eventId);});
    }
    var mapLoaded=Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded=function(){if(!$gamePlayer.isTransferring())syncRestEvents();mapLoaded.apply(this,arguments);};
    function RestFeedback(){this.initialize.apply(this,arguments);}
    RestFeedback.prototype=Object.create(Window_Base.prototype);RestFeedback.prototype.constructor=RestFeedback;
    RestFeedback.prototype.initialize=function(){Window_Base.prototype.initialize.call(this,12,Graphics.boxHeight-178,Math.min(288,Graphics.boxWidth-24),164);this.hide();};
    RestFeedback.prototype.update=function(){
        Window_Base.prototype.update.call(this);var f=$gameTemp._arenaRestFeedback,elapsed=f?Date.now()-f.time:2000;
        if(!f||elapsed>=1500){this.hide();return;}
        this.show();this.opacity=this.contentsOpacity=elapsed<1300?255:Math.round(255*(1500-elapsed)/200);
        this.contents.clear();this.contents.fontSize=20;this.drawText('Descanso',0,0,this.contentsWidth());
        var current=ArenaResources.snapshot(),t=Math.min(1,elapsed/240),self=this;
        [['hp','Vida','#B44C4C'],['mp','Mana','#587EBC'],['vigor','Vigor','#719365']].forEach(function(row,i){
            var r=current[row[0]],from=f.before[row[0]].current,shown=from+(r.current-from)*t,y=28+i*32;
            self.contents.fontSize=18;self.drawText(row[1],0,y,80);self.drawText(r.current+'/'+r.maximum,80,y,self.contentsWidth()-80,'right');
            self.contents.fillRect(0,y+24,self.contentsWidth(),4,'#343A40');self.contents.fillRect(0,y+24,Math.round(self.contentsWidth()*shown/r.maximum),4,row[2]);
        });
    };
    var mapWindows=Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows=function(){
        mapWindows.apply(this,arguments);this._arenaRestFeedback=new RestFeedback();this.addWindow(this._arenaRestFeedback);
        this._arenaRestLabel=new Sprite(new Bitmap(288,36));this.addChild(this._arenaRestLabel);
    };
    var mapTouch=Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch=function(){
        if(!TouchInput.isPressed())this._arenaRestPointer=false;
        if($gameTemp._arenaRestAwaitRelease){$gameTemp.clearDestination();this._touchCount=0;return;}
        var label=this._arenaRestLabel,p=nearestRefuge(),e=p&&$gameMap.event(p.eventId);
        if(TouchInput.isTriggered()&&label&&label.visible&&TouchInput.x>=label.x&&TouchInput.x<label.x+288&&TouchInput.y>=label.y&&TouchInput.y<label.y+36){
            this._arenaRestPointer=true;this._touchCount=0;$gameTemp.clearDestination();
            if(e&&$gamePlayer.canMove()&&!$gameMap.isAnyEventStarting()){
                if($gameMap.distance($gamePlayer.x,$gamePlayer.y,e.x,e.y)<=1)e.start();
                else $gameTemp.setDestination(e.x,e.y);
            }
            return;
        }
        if(!this._arenaRestPointer)mapTouch.apply(this,arguments);
    };
    var mapUpdate=Scene_Map.prototype.update;
    Scene_Map.prototype.update=function(){
        var ok=Input.isTriggered('ok'),interactive=this.isActive()&&$gamePlayer.canMove()&&!$gameMessage.isBusy()&&!$gameMap.isEventRunning();mapUpdate.apply(this,arguments);
        if(!Input.isPressed('ok')&&!TouchInput.isPressed())$gameTemp._arenaRestAwaitRelease=false;
        var p=nearestRefuge(),e=p&&$gameMap.event(p.eventId),label=this._arenaRestLabel;
        if(!label)return;var near=e&&$gameMap.distance($gamePlayer.x,$gamePlayer.y,e.x,e.y)<=3;
        label.visible=!!near;if(!near)return;
        label.x=Math.max(8,Math.min(Graphics.boxWidth-296,e.screenX()-144));label.y=Math.max(8,Math.min(e.screenY()-128,$gamePlayer.screenY()-112));
        label.opacity=$gameMap.distance($gamePlayer.x,$gamePlayer.y,e.x,e.y)<=1?255:180;
        var status=Date.now()<($gameTemp._arenaRestStatusUntil||0),b=label.bitmap;
        b.clear();b.fillRect(0,0,288,36,'rgba(15,24,26,0.9)');b.fontSize=20;b.textColor='#D8CCAF';b.drawText(status?'Recursos completos':'Descansar · Enter / toque',6,0,276,36,'center');
        if(ok&&interactive&&!$gameTemp._arenaRestAwaitRelease&&this.isActive()&&$gamePlayer.canMove()&&!$gameMap.isAnyEventStarting()&&$gameMap.distance($gamePlayer.x,$gamePlayer.y,e.x,e.y)<=1){$gameTemp.clearDestination();e.start();}
    };
    var titleList=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){titleList.apply(this,arguments);this.addCommand('Descanso técnico (refúgio)','arenaRestPilot');};
    var titleCreate=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){titleCreate.apply(this,arguments);this._commandWindow.setHandler('arenaRestPilot',ArenaRecovery.startRestPilot.bind(ArenaRecovery));};
    // The inventory already owns native effect/consumption handling. Keep that single path.
    function interval() { return $arenaRecovery.menuIntervalMs === undefined ? 500 : $arenaRecovery.menuIntervalMs; }
    function gate() {
        return $gameTemp._arenaPotionMenuGate || ($gameTemp._arenaPotionMenuGate = {
            until: 0, duration: 0, awaitRelease: false, keyArmed: false, pointerArmed: false
        });
    }
    function blocked() { var g=gate(); return Date.now()<g.until || g.awaitRelease; }
    var create = Scene_ArenaInventory.prototype.create;
    Scene_ArenaInventory.prototype.create = function() {
        create.apply(this, arguments);
        var scene=this,processOk=this._itemWindow.processOk;
        this._itemWindow.processOk=function(){
            if(!potion(this.item()))return processOk.apply(this,arguments);
            if(blocked()||!gate().keyArmed)return;
            scene._arenaPotionKeyboardDispatch=true;
            try{return processOk.apply(this,arguments);}
            finally{scene._arenaPotionKeyboardDispatch=false;}
        };
        var draw = this._itemWindow.drawItem;
        this._itemWindow.drawItem = function(index) {
            var locked=potion(this._data[index]) && blocked();
            if(locked)this.changePaintOpacity(false);
            draw.call(this,index);this.changePaintOpacity(true);
            if(locked){
                var r=this.itemRect(index),g=gate(),left=Math.max(0,g.until-Date.now());
                this.contents.fontSize=18;this.contents.drawText('…',r.x+r.width-30,r.y+5,22,22,'right');
                var ratio=g.duration>0?Math.min(1,left/g.duration):0;
                this.contents.fillRect(r.x+6,r.y+r.height-5,Math.max(2,Math.round((r.width-12)*ratio)),2,'#b7a375');
            }
        };
        this._itemWindow.refresh();
    };
    var update = Scene_ArenaInventory.prototype.update;
    Scene_ArenaInventory.prototype.update = function() {
        var g=gate();
        if(!Input.isPressed('ok')&&!TouchInput.isPressed())g.awaitRelease=false;
        // Sample before native windows advance Input during processOk.
        g.keyArmed=Input.isTriggered('ok')&&!blocked();
        if(TouchInput.isTriggered())g.pointerArmed=!blocked();
        var released=TouchInput.isReleased();
        update.apply(this,arguments);
        if(released)g.pointerArmed=false;
        var locked=blocked();
        if(this._itemWindow&&(locked||locked!==this._arenaPotionLocked))this._itemWindow.refresh();
        this._arenaPotionLocked=locked;
    };
    var contentOk = Scene_ArenaInventory.prototype.onContentOk;
    Scene_ArenaInventory.prototype.onContentOk = function() {
        var item = this._itemWindow.item();
        if (!potion(item)) return contentOk.apply(this, arguments);
        var g=gate(),fresh=this._arenaPotionKeyboardDispatch?g.keyArmed:(TouchInput.isReleased()&&g.pointerArmed);
        g.keyArmed=false;
        if(TouchInput.isReleased())g.pointerArmed=false;
        if(blocked()||!fresh){this._itemWindow.activate();return;}
        var count = $gameParty.numItems(item);
        this._pending = {kind: 'use', ref: ArenaInventory.ref(item)};
        this.commit();
        if ($gameParty.numItems(item) === count - 1) {
            g.duration=interval();g.until=Date.now()+g.duration;g.awaitRelease=true;
            this._itemWindow.refresh();
            this.updateDescription(); // Stock is already refreshed in the slot; bars own recovery feedback.
        }
    };
    // Forced or stale selections must not bypass stock/effect checks. Never charge here.
    var executed = new WeakSet(), start = BattleManager.startAction;
    BattleManager.startAction = function() {
        var action = this._subject && this._subject.currentAction();
        if (!action || !potion(action.item()) || action.subject() !== actor()) {
            return start.apply(this, arguments);
        }
        var targets = action.makeTargets();
        if (executed.has(action) || !$gameParty.hasItem(action.item()) ||
                !actor().canUse(action.item()) || !targets.some(function(t) {
                    return t.isAlive() && action.hasItemAnyValidEffects(t);
                })) {
            this._arenaFailure = 'recovery-unavailable'; this._targets = []; this._phase = 'turn';
            return false;
        }
        executed.add(action);
        // Reuse these same native targets during execution rather than resolving them twice.
        var makeTargets = action.makeTargets;
        action.makeTargets = function() { return targets; };
        try { return start.apply(this, arguments); }
        finally { action.makeTargets = makeTargets; }
    };
})();
