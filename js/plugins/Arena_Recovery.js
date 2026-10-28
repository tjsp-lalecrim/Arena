/*:
 * @plugindesc v0.3.0 Poções com proteção de entrada no menu e descanso autorizado.
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
        return true;
    };
    function actor() { return $gameActors.actor($arenaRecovery.actorId); }
    function potion(item) {
        return item && DataManager.isItem(item) && $arenaRecovery.potionIds.indexOf(item.id) >= 0;
    }
    ArenaRecovery = {
        isPotion: potion,
        restAt: function(id, interpreter) {
            var point = $arenaRecovery.restPoints.filter(function(p) { return p.id === id; })[0];
            var event = point && $gameMap.event(point.eventId);
            if (!point || $gameParty.inBattle() || $gamePlayer.isTransferring() ||
                    $gamePlayer.isInVehicle() || !actor().isAlive() || $gameMessage.isBusy() ||
                    $gameMap.mapId() !== point.mapId || !event || event._erased ||
                    !(interpreter instanceof Game_Interpreter) ||
                    interpreter._mapId !== point.mapId || interpreter.eventId() !== point.eventId ||
                    $gameMap.distance($gamePlayer.x, $gamePlayer.y, event.x, event.y) > 1) {
                return {ok: false, reason: 'Descanso indisponível neste local ou situação.'};
            }
            return {ok: ArenaResources.rest()};
        }
    };
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
