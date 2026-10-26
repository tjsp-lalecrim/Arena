/*:
 * @plugindesc v0.1.0 Técnicas derivadas da arma, magias conhecidas e livros transacionais.
 * @author Codex
 * @help Após Arena_Resources e MV_AbilityRules. Sem plugins externos/parâmetros.
 * Configuração data/ArenaAbilities.json. API ArenaAbilities.available(actor),
 * invalidateShortcuts(actor), learnBook(actor,item). Sem novo namespace de save.
 * Vigor: apenas o consumidor Arena_Resources; Mana e aprendizado nativos.
 * Valida BattleManager.startAction, inclusive ação forçada e seleção antiga.
 * Menu de itens informa livros conhecidos; não concede livros na campanha.
 */
var ArenaAbilities;
(function() {
    'use strict';
    DataManager._databaseFiles.push({ name: '$arenaAbilities', src: 'ArenaAbilities.json' });
    var executions = new WeakMap();
    function owned(a) { return a && a.isActor() && a.actorId() === $arenaAbilities.actorId; }
    function technique(id) { return $arenaAbilities.techniques.some(function(d) { return d.skillId === id; }); }
    function spell(id) { return $arenaAbilities.spellIds.indexOf(id) >= 0; }
    function managed(a) { return a && a.isSkill() && owned(a.subject()) && (technique(a.item().id) || spell(a.item().id)); }
    function book(item) { return DataManager.isItem(item) && $arenaAbilities.books.filter(function(d) { return d.itemId === item.id; })[0]; }
    ArenaAbilities = {
        available: function(a) {
            var weapon = a.weapons()[0];
            return MVAbilityRules.available($arenaAbilities.techniques, weapon ? weapon.wtypeId : 0);
        },
        invalidateShortcuts: function(a) {
            if (!owned(a)) return;
            var available = this.available(a), slots = ArenaPersistence.snapshot().hotbar;
            Object.keys(slots).forEach(function(slot) {
                var ref = slots[slot];
                if (ref && ref.kind === 'skill' && technique(ref.id) && available.indexOf(ref.id) < 0) ArenaPersistence.setShortcut(slot, null);
            });
        },
        learnBook: function(a, item) {
            var definition = DataManager.isItem(item) && book(item);
            if (!owned(a) || !definition || $gameParty.inBattle()) return 'invalid';
            if (a.isLearnedSkill(definition.skillId)) return 'already-known';
            if (!$gameParty.hasItem(item)) return 'missing';
            if (!a.canUse(item)) return 'unavailable';
            var oldSkills = a._skills.slice(), count = $gameParty.numItems(item);
            try {
                a.learnSkill(definition.skillId);
                if (!a.isLearnedSkill(definition.skillId)) throw new Error('Aprendizado não confirmado');
                $gameParty.consumeItem(item);
                if ($gameParty.numItems(item) !== count - 1) throw new Error('Consumo incompleto');
                return 'learned';
            } catch (error) {
                a._skills = oldSkills;
                $gameParty.gainItem(item, count - $gameParty.numItems(item), false);
                return 'failed';
            }
        }
    };
    var skills = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function() {
        var list = skills.apply(this, arguments);
        if (!owned(this)) return list;
        list = list.filter(function(s) { return !technique(s.id); });
        ArenaAbilities.available(this).forEach(function(id) { list.push($dataSkills[id]); });
        return list.sort(function(a, b) { return a.id - b.id; });
    };
    var conditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        if (owned(this) && (technique(skill.id) && ArenaAbilities.available(this).indexOf(skill.id) < 0 ||
                spell(skill.id) && !this.isLearnedSkill(skill.id))) return false;
        return conditions.apply(this, arguments);
    };
    var refresh = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function() {
        refresh.apply(this, arguments);
        if ($gameSystem && $gameActors && owned(this) && $gameActors._data[this.actorId()] === this) ArenaAbilities.invalidateShortcuts(this);
    };
    var extract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        extract.apply(this, arguments);
        var a = $gameActors._data[$arenaAbilities.actorId];
        if (a) ArenaAbilities.invalidateShortcuts(a);
    };
    var valid = Game_Action.prototype.isValid;
    Game_Action.prototype.isValid = function() {
        return managed(this) ? this.subject().canUse(this.item()) : valid.apply(this, arguments);
    };
    var nativeUse = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        if (owned(this) && book(item)) return ArenaAbilities.learnBook(this, item);
        if (owned(this) && DataManager.isSkill(item) && (technique(item.id) || spell(item.id)) && !this.canUse(item)) return false;
        return nativeUse.apply(this, arguments);
    };
    var start = BattleManager.startAction;
    BattleManager.startAction = function() {
        var action = this._subject && this._subject.currentAction();
        this._arenaFailure = null;
        if (action && action.isItem() && owned(action.subject()) && book(action.item())) {
            this._arenaFailure = 'book-menu-only'; this._targets = []; this._phase = 'turn'; return false;
        }
        if (!managed(action)) return start.apply(this, arguments);
        if (executions.has(action)) { this._arenaFailure = 'already-executed'; return false; }
        if (!action.isValid()) {
            this._arenaFailure = 'unavailable';
            this._targets = []; this._phase = 'turn'; return false;
        }
        // Generate targets once: never reroll random targets during revalidation.
        var targets = action.makeTargets();
        if (!targets.length) { this._arenaFailure = 'no-target'; this._targets = []; this._phase = 'turn'; return false; }
        var makeTargets = action.makeTargets;
        executions.set(action, true);
        action.makeTargets = function() { return targets; };
        try { return start.apply(this, arguments); }
        finally { action.makeTargets = makeTargets; }
    };
    var itemConditions = Game_BattlerBase.prototype.meetsItemConditions;
    Game_BattlerBase.prototype.meetsItemConditions = function(item) {
        var definition = book(item);
        if (owned(this) && definition && this.isLearnedSkill(definition.skillId)) return false;
        return itemConditions.apply(this, arguments);
    };
    var help = Window_ItemList.prototype.updateHelp;
    Window_ItemList.prototype.updateHelp = function() {
        help.apply(this, arguments);
        var definition = book(this.item()), a = $gameActors.actor($arenaAbilities.actorId);
        if (definition && a.isLearnedSkill(definition.skillId) && this._helpWindow) {
            this._helpWindow.setText('Já conhece ' + $dataSkills[definition.skillId].name + '. Livro preservado.');
        }
    };
    var useItem = Scene_ItemBase.prototype.useItem;
    Scene_ItemBase.prototype.useItem = function() {
        var item = this.item(), definition = DataManager.isItem(item) && book(item);
        if (!definition) return useItem.apply(this, arguments);
        var result = ArenaAbilities.learnBook(this.user(), item);
        this._itemWindow.refresh(); this._actorWindow.refresh();
        this._helpWindow.setText(result === 'learned' ? 'Aprendeu ' + $dataSkills[definition.skillId].name + '. Um livro consumido.' :
            result === 'already-known' ? 'Magia já conhecida. Livro preservado.' : 'Não foi possível aprender. Livro preservado.');
    };
    var drawCost = Window_SkillList.prototype.drawSkillCost;
    Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
        if (skill.meta.ArenaVigorCost && technique(skill.id)) {
            this.changeTextColor(this.systemColor());
            this.drawText(skill.meta.ArenaVigorCost + ' V', x, y, width, 'right');
        } else drawCost.apply(this, arguments);
    };
})();
