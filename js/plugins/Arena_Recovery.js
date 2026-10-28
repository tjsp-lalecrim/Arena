/*:
 * @plugindesc v0.1.0 Poções diretas e descanso em pontos autorizados (M01-17).
 * @author Codex
 * @help Após Arena_Resources, Arena_Inventory e Arena_BattleUI. Sem dependências externas.
 * Configuração: data/ArenaRecovery.json. Não há parâmetros no gerenciador.
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
    var contentOk = Scene_ArenaInventory.prototype.onContentOk;
    Scene_ArenaInventory.prototype.onContentOk = function() {
        var item = this._itemWindow.item();
        if (!potion(item)) return contentOk.apply(this, arguments);
        var count = $gameParty.numItems(item);
        this._pending = {kind: 'use', ref: ArenaInventory.ref(item)};
        this.commit();
        if ($gameParty.numItems(item) === count - 1) {
            var r = ArenaResources.snapshot();
            this._helpWindow.setText(item.name + ' utilizada · Restam ' + (count - 1) + '\n' +
                'Vida ' + r.hp.current + '/' + r.hp.maximum + ' · Mana ' + r.mp.current + '/' +
                r.mp.maximum + ' · Vigor ' + r.vigor.current + '/' + r.vigor.maximum);
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
