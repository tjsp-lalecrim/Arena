/*:
 * @plugindesc v0.1.0 Vida, Mana, Vigor próprio e escolha de evolução por nível.
 * @author Codex
 * @help Após MV_ResourceProgression e Arena_CharacterCreation. Sem plugins externos.
 * Configuração: data/ArenaProgression.json. Namespace arenaResources v1.
 * Menu Recursos / evolução. Comandos de evento: ArenaResources Rest; Open.
 * API ArenaResources: snapshot, pending, choose(level,resource), recoverVigor(amount),
 * rest(), open(). Vigor não é TP. Notas ArenaVigorCost/ArenaVigorRestore.
 * Técnicas catalogadas continuam desativadas até M01-09. Laboratório no título.
 * Consulte doc/plugins/Arena_Resources.md e doc/RECURSOS_E_PROGRESSAO_M01_08.md.
 */
var ArenaResources;
var Scene_ArenaResources;
(function() {
    'use strict';
    DataManager._databaseFiles.push({ name: '$arenaProgression', src: 'ArenaProgression.json' });
    var databaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!databaseLoaded.apply(this, arguments)) return false;
        var c = $arenaProgression;
        if (!c || c.schemaVersion !== 1 || c.actorId !== 1 || !c.base ||
                !['hp', 'mp', 'vigor'].every(function(k) { return Number.isInteger(c.base[k]) && c.base[k] >= (k === 'hp' ? 1 : 0); }) ||
                !Number.isInteger(c.increase) || c.increase < 1 || !$dataActors[c.actorId] || !$dataMapInfos[c.technicalMapId]) {
            throw new Error('Arena: configuração de recursos inválida. Confira ArenaProgression.json.');
        }
        return true;
    };
    MVStateStore.register('arenaResources', 1, {
        initialized: false, baselineLevel: 1, base: { hp: 100, mp: 50, vigor: 100 },
        initialVigorBonus: 0, choices: {}, vigorModifiers: { external: 0 }
    });
    var writingVigor = false;
    function actor() { return $gameActors.actor($arenaProgression.actorId); }
    function owned(a) { return a && a.isActor() && a.actorId() === $arenaProgression.actorId; }
    function data() { return MVStateStore.read('arenaResources'); }
    function growth(d, resource) { return MVResourceProgression.growth(d.choices, resource); }
    function vigorMax(d) { return Math.max(0, d.base.vigor + d.initialVigorBonus + growth(d, 'vigor') + d.vigorModifiers.external); }
    function cacheVigor(current, maximum) {
        writingVigor = true;
        try { ArenaPersistence.setResource('vigor', current, maximum); }
        finally { writingVigor = false; }
    }
    function ensure(importLegacy) {
        var d = data();
        if (d.initialized) return d;
        var a = actor(), c = ArenaPersistence.snapshot(), r = c.resources.vigor;
        var race = ArenaCharacterCreation.isCreated() && ArenaCharacterCreation.race(c.character.raceId);
        var bonus = race && race.bonus.kind === 'initialResourceAdd' ? race.bonus.value : 0;
        d.initialized = true;
        d.baselineLevel = a.level;
        // A legacy maximum is authoritative, including previous laboratory changes.
        // Split the already-granted racial addition, never grant it a second time.
        d.base = { hp: importLegacy ? nativeBase.call(a, 0) : $arenaProgression.base.hp,
            mp: importLegacy ? nativeBase.call(a, 1) : $arenaProgression.base.mp,
            vigor: r ? r.maximum - bonus : $arenaProgression.base.vigor };
        d.initialVigorBonus = bonus;
        MVStateStore.replace('arenaResources', d);
        if (!r) cacheVigor(vigorMax(d), vigorMax(d));
        return d;
    }
    var nativeBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(id) {
        if (id < 2 && owned(this) && $gameSystem) {
            var d = data();
            if (d.initialized) return d.base[id === 0 ? 'hp' : 'mp'] + growth(d, id === 0 ? 'hp' : 'mp');
            // New characters follow configuration, not the class growth curves.
            return $arenaProgression.base[id === 0 ? 'hp' : 'mp'];
        }
        return nativeBase.apply(this, arguments);
    };
    var paramMax = Game_Actor.prototype.paramMax;
    Game_Actor.prototype.paramMax = function(id) {
        // 98 optional +10 MP choices must not disappear behind MV's 999 MP cap.
        return owned(this) && id === 1 ? 9999 : paramMax.apply(this, arguments);
    };
    var confirm = ArenaCharacterCreation.confirmCurrent;
    ArenaCharacterCreation.confirmCurrent = function(draft) {
        var result = confirm.apply(this, arguments);
        if (result) ensure();
        return result;
    };
    var levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        if (owned(this)) ensure();
        levelUp.apply(this, arguments);
    };
    var extract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        extract.apply(this, arguments);
        if ($gameActors._data[$arenaProgression.actorId]) ensure(true);
    };
    // Preserve the existing laboratory/API contract for explicit custom maxima.
    var setResource = ArenaPersistence.setResource;
    ArenaPersistence.setResource = function(id, current, maximum) {
        setResource.apply(this, arguments); // Validate before changing modifiers.
        if (id === 'vigor' && !writingVigor && data().initialized) {
            var d = data();
            d.vigorModifiers.external = maximum - d.base.vigor - d.initialVigorBonus - growth(d, 'vigor');
            MVStateStore.replace('arenaResources', d);
        }
    };
    ArenaResources = {
        pending: function() { var d = ensure(); return MVResourceProgression.pending(d.baselineLevel, actor().level, d.choices); },
        snapshot: function() {
            var d = ensure(), a = actor(), r = ArenaPersistence.snapshot().resources.vigor;
            return { hp: { current: a.hp, maximum: a.mhp, base: d.base.hp, growth: growth(d, 'hp'), modifiers: a.mhp - d.base.hp - growth(d, 'hp') },
                mp: { current: a.mp, maximum: a.mmp, base: d.base.mp, growth: growth(d, 'mp'), modifiers: a.mmp - d.base.mp - growth(d, 'mp') },
                vigor: { current: r.current, maximum: vigorMax(d), base: d.base.vigor, growth: growth(d, 'vigor'),
                    initialBonus: d.initialVigorBonus, modifiers: d.vigorModifiers.external },
                level: a.level, baselineLevel: d.baselineLevel, choices: d.choices, pending: this.pending() };
        },
        choose: function(level, resource) {
            var d = ensure();
            if ($gameParty.inBattle() || ['hp', 'mp', 'vigor'].indexOf(resource) < 0 ||
                    this.pending().indexOf(level) < 0) return false;
            var current = ArenaPersistence.snapshot().resources.vigor.current;
            d.choices[String(level)] = { resourceId: resource, amount: $arenaProgression.increase };
            MVStateStore.replace('arenaResources', d);
            cacheVigor(current, vigorMax(d));
            actor().refresh();
            return true;
        },
        recoverVigor: function(amount) {
            if (!Number.isFinite(amount) || amount < 0) throw new Error('Arena: recuperação de Vigor inválida');
            var d = ensure(), r = ArenaPersistence.snapshot().resources.vigor;
            var next = MVResourceProgression.clamp(r.current + amount, vigorMax(d));
            cacheVigor(next, vigorMax(d));
            return next - r.current;
        },
        rest: function() {
            if ($gameParty.inBattle()) return false;
            ensure();
            actor().setHp(actor().mhp); actor().setMp(actor().mmp);
            this.recoverVigor(this.snapshot().vigor.maximum);
            return true;
        },
        open: function() { if (!$gameParty.inBattle()) { ensure(); SceneManager.push(Scene_ArenaResources); } }
    };
    function cost(skill) { return Number(skill.meta && skill.meta.ArenaVigorCost || 0); }
    function isCost(skill) { return Number.isInteger(cost(skill)) && cost(skill) > 0; }
    var canPay = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        if (owned(this) && isCost(skill)) {
            if (!$gameParty.inBattle() || ArenaResources.snapshot().vigor.current < cost(skill)) return false;
        }
        return canPay.apply(this, arguments);
    };
    var pay = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        if (owned(this) && isCost(skill)) {
            if (!this.canPaySkillCost(skill)) return;
            var s = ArenaResources.snapshot().vigor;
            cacheVigor(s.current - cost(skill), s.maximum);
        }
        pay.apply(this, arguments);
    };
    function restoreAmount(action, target) {
        return action.isItem() && owned(target) ? Number(action.item().meta.ArenaVigorRestore || 0) : 0;
    }
    var validEffect = Game_Action.prototype.hasItemAnyValidEffects;
    Game_Action.prototype.hasItemAnyValidEffects = function(target) {
        return validEffect.apply(this, arguments) || restoreAmount(this, target) > 0 &&
            target.isAlive() && ArenaResources.snapshot().vigor.current < ArenaResources.snapshot().vigor.maximum;
    };
    var apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        apply.apply(this, arguments);
        var amount = restoreAmount(this, target);
        if (amount > 0 && target.result().isHit() && ArenaResources.recoverVigor(amount) > 0) this.makeSuccess(target);
    };
    var commands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        commands.apply(this, arguments);
        this.addCommand('Recursos / evolução', 'arenaResources', this.areMainCommandsEnabled());
    };
    var menu = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        menu.apply(this, arguments);
        this._commandWindow.setHandler('arenaResources', ArenaResources.open.bind(ArenaResources));
    };
    function Window_Resources() { this.initialize.apply(this, arguments); }
    Window_Resources.prototype = Object.create(Window_Command.prototype);
    Window_Resources.prototype.constructor = Window_Resources;
    Window_Resources.prototype.windowWidth = function() { return 400; };
    Window_Resources.prototype.makeCommandList = function() {
        var available = ArenaResources.pending().length > 0;
        [['Vida', 'hp'], ['Mana', 'mp'], ['Vigor', 'vigor']].forEach(function(r) {
            this.addCommand(r[0] + ' +' + $arenaProgression.increase, r[1], available);
        }, this);
        this.addCommand('Voltar', 'cancel');
    };
    function Window_ResourceConfirm() { this.initialize.apply(this, arguments); }
    Window_ResourceConfirm.prototype = Object.create(Window_Command.prototype);
    Window_ResourceConfirm.prototype.constructor = Window_ResourceConfirm;
    Window_ResourceConfirm.prototype.windowWidth = function() { return 240; };
    Window_ResourceConfirm.prototype.makeCommandList = function() { this.addCommand('Confirmar', 'yes'); this.addCommand('Voltar', 'cancel'); };
    Scene_ArenaResources = function() { this.initialize.apply(this, arguments); };
    Scene_ArenaResources.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ArenaResources.prototype.constructor = Scene_ArenaResources;
    Scene_ArenaResources.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        this._backgroundSprite.bitmap.fillAll('#101216'); this.addChild(this._backgroundSprite);
    };
    Scene_ArenaResources.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._status = new Window_Base(0, 0, Graphics.boxWidth, 250); this.addWindow(this._status);
        this._choices = new Window_Resources((Graphics.boxWidth - 400) / 2, 250);
        ['hp', 'mp', 'vigor'].forEach(function(r) { this._choices.setHandler(r, this.ask.bind(this, r)); }, this);
        this._choices.setHandler('cancel', this.popScene.bind(this)); this.addWindow(this._choices);
        this._confirm = new Window_ResourceConfirm((Graphics.boxWidth - 240) / 2, 440);
        this._confirm.hide(); this._confirm.deactivate();
        this._confirm.setHandler('yes', this.commit.bind(this)); this._confirm.setHandler('cancel', this.review.bind(this));
        this.addWindow(this._confirm); this.refreshStatus();
    };
    Scene_ArenaResources.prototype.refreshStatus = function() {
        var s = ArenaResources.snapshot(), w = this._status; w.contents.clear();
        w.drawText('Recursos — nível ' + s.level, 0, 0, w.contentsWidth());
        ['hp', 'mp', 'vigor'].forEach(function(r, i) {
            var label = ['Vida', 'Mana', 'Vigor'][i];
            w.drawText(label + ': ' + s[r].current + ' / ' + s[r].maximum, 0, 36 * (i + 1), w.contentsWidth());
        });
        w.contents.fontSize = 23;
        w.drawText(this._selected ? 'Confirmar +' + $arenaProgression.increase + ' em ' + {hp:'Vida',mp:'Mana',vigor:'Vigor'}[this._selected] + '?' :
            (s.pending.length ? 'Escolha do nível ' + s.pending[0] + ' — pendentes: ' + s.pending.length : 'Nenhuma evolução pendente.'), 0, 150, w.contentsWidth());
        w.drawText('Evoluir aumenta o máximo; não recupera recursos.', 0, 181, w.contentsWidth()); w.resetFontSettings();
    };
    Scene_ArenaResources.prototype.ask = function(resource) {
        this._selected = resource; this._choices.deactivate(); this._confirm.show(); this._confirm.activate(); this._confirm.select(0); this.refreshStatus();
    };
    Scene_ArenaResources.prototype.review = function() {
        this._selected = null; this._confirm.hide(); this._confirm.deactivate(); this._choices.activate(); this.refreshStatus();
    };
    Scene_ArenaResources.prototype.commit = function() {
        ArenaResources.choose(ArenaResources.pending()[0], this._selected);
        this.review(); this._choices.refresh();
    };
    var pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        pluginCommand.apply(this, arguments);
        if (command === 'ArenaResources' && args[0] === 'Rest') ArenaResources.rest();
        if (command === 'ArenaResources' && args[0] === 'Open') ArenaResources.open();
    };
    var mapWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        mapWindows.apply(this, arguments);
        if ($gameMap.mapId() !== $arenaProgression.technicalMapId) return;
        var w = new Window_Base(0, 0, Graphics.boxWidth, 160);
        w.backOpacity = 255;
        w.contents.fontSize = 23;
        ['Recursos M01-08 — diagnóstico, sem combate jogável',
            'Eventos em y5; fique abaixo, olhe para cima e Enter.',
            'x3: evolução | x5: +1 nível | x7: +3 níveis',
            'x9: gastar | x11: kit de poções | x13: cama'].forEach(function(t, i) {
            w.drawText(t, 0, i * 30, w.contentsWidth());
        });
        this.addWindow(w);
        var marks = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        marks.bitmap.fontSize = 26;
        $gameMap.events().forEach(function(e) { marks.bitmap.drawText(String(e.x), e.screenX() - 24, e.screenY() - 48, 48, 48, 'center'); });
        this.addChild(marks);
    };
    var title = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() { title.apply(this, arguments); this.addCommand('Laboratório de recursos', 'arenaResourceLab'); };
    var titleWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        titleWindow.apply(this, arguments);
        this._commandWindow.setHandler('arenaResourceLab', function() {
            this._commandWindow.close(); DataManager.setupNewGame();
            $gamePlayer.reserveTransfer($arenaProgression.technicalMapId, 8, 6, 2, 0);
            this.fadeOutAll(); SceneManager.goto(Scene_Map);
        }.bind(this));
    };
})();
