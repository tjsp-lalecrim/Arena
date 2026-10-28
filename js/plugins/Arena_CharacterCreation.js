/*:
 * @plugindesc v0.2.0 Criação pt-BR, identidade e bônus raciais provisórios P01–P08.
 * @author Codex
 * @help Após MV_CharacterRules, MV_StateStore, Arena_Persistence e Arena_ArtPreview.
 * Sem parâmetros/comandos. Conteúdo em ArenaCatalog/ArenaCharacterVisuals.json.
 * Nova partida abre criação; Laboratório técnico preserva o início de diagnóstico.
 * Não implementa introdução, dungeon final, profissão, combate ou armadura visual.
 * Contratos e limites em doc/plugins/Arena_CharacterCreation.md.
 */
var ArenaCharacterCreation;
var Scene_ArenaCharacterCreation;
(function() {
    'use strict';
    DataManager._databaseFiles.push({ name: '$arenaCharacterCatalog', src: 'ArenaCatalog.json' });
    DataManager._databaseFiles.push({ name: '$arenaCharacterVisuals', src: 'ArenaCharacterVisuals.json' });
    MVStateStore.register('arenaCreation', 1, { confirmed: false, visualVersion: 1 });
    function created() { return !!$gameSystem && (MVStateStore.read('arenaCreation').confirmed || MVStateStore.hasOperation('arenaCreation', 'confirm')); }
    function race(id) { return $arenaCharacterCatalog.races.filter(function(r) { return r.id === id; })[0]; }
    function visual(raceId, genderId) { return $arenaCharacterVisuals.visuals[raceId + '.' + genderId + '.base']; }
    function chosenRace(actor) {
        if (!created()) return null;
        var identity = ArenaPersistence.identity();
        return actor && actor.actorId() === identity.actorId ? race(identity.raceId) : null;
    }
    function images(actor, v) {
        actor.setCharacterImage(v.character, 0);
        actor.setFaceImage(v.face, 0);
        actor.setBattlerImage(v.battler);
        if ($gamePlayer) $gamePlayer.refresh();
    }
    function restoreAppearance() {
        if (!created()) return;
        var c = ArenaPersistence.identity(), v = visual(c.raceId, c.genderId);
        if (!v || !v.ready || c.baseVisualId !== v.id) throw new Error('Arena: referência visual salva indisponível.');
        images($gameActors.actor(c.actorId), v);
    }
    ArenaCharacterCreation = {
        isCreated: created, race: race, visual: visual, restoreAppearance: restoreAppearance,
        validate: function(draft) {
            var name = MVCharacterRules.name(draft.name, 20), r = race(draft.raceId);
            if (!r || !$arenaCharacterCatalog.genders.some(function(g) { return g.id === draft.genderId; })) throw new Error('Escolha raça e gênero.');
            var v = visual(r.id, draft.genderId);
            if (!v || !v.ready) throw new Error('Esta combinação visual ainda não está disponível.');
            return { name: name, race: r, genderId: draft.genderId, visual: v };
        },
        confirmCurrent: function(draft) {
            if (created()) return false;
            var d = this.validate(draft), actor = $gameActors.actor(1);
            var previous = JSON.parse(JSON.stringify($gameSystem._persistentState));
            var keys = ['_name', '_characterName', '_characterIndex', '_faceName', '_faceIndex', '_battlerName'];
            var oldActor = {}; keys.forEach(function(k) { oldActor[k] = actor[k]; });
            try {
                actor.setName(d.name);
                ArenaPersistence.setIdentity(d.race.id, d.genderId, d.visual.id);
                images(actor, d.visual);
                var baseVigor = typeof $arenaProgression !== 'undefined' && $arenaProgression ? $arenaProgression.base.vigor : 100;
                var vigor = MVCharacterRules.initialResource(d.race.bonus, 'vigor', baseVigor);
                ArenaPersistence.setResource('vigor', vigor, vigor);
                MVStateStore.once('arenaCreation', 'confirm', function(state) { state.confirmed = true; });
                actor.refresh();
            } catch (error) {
                $gameSystem._persistentState = previous;
                keys.forEach(function(k) { actor[k] = oldActor[k]; });
                $gamePlayer.refresh();
                throw error;
            }
            return true;
        }
    };
    var traits = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        var objects = traits.apply(this, arguments), r = chosenRace(this);
        if (r) objects.push({ traits: MVCharacterRules.traits(r.bonus) });
        return objects;
    };
    var paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        var r = chosenRace(this);
        return paramPlus.apply(this, arguments) + MVCharacterRules.parameterBonus(r && r.bonus, paramId);
    };
    function weaponModifiers(action) {
        var neutral = { damageRate: 1, hit: 0 };
        var actor = action.subject();
        if (!actor || !actor.isActor()) return neutral;
        var r = chosenRace(actor);
        var config = $arenaCharacterVisuals.rules;
        if (!r || !action.isSkill() || !action.isPhysical() ||
                [1, 2, 5, 6].indexOf(action.item().damage.type) < 0 ||
                config.weaponSkillIds.indexOf(action.item().id) < 0 || !actor.isSkillWtypeOk(action.item())) return neutral;
        var weapon = actor.weapons()[0];
        if (!weapon) return neutral;
        var group = config.bowWeaponTypeIds.indexOf(weapon.wtypeId) >= 0 ? 'bow' :
            config.meleeWeaponTypeIds.indexOf(weapon.wtypeId) >= 0 ? 'melee' : 'other';
        return MVCharacterRules.weaponModifiers(r.bonus, group);
    }
    var nativeDamage = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var value = nativeDamage.apply(this, arguments);
        var r = target.isActor() ? chosenRace(target) : null;
        return value > 0 && this.isMagical() && r && r.bonus.kind === 'magicDamageRate' ? Math.round(value * r.bonus.value) : value;
    };
    var damage = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function(target) {
        var value = damage.apply(this, arguments);
        return value > 0 ? value * weaponModifiers(this).damageRate : value;
    };
    var hit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) { return Math.min(1, hit.apply(this, arguments) + weaponModifiers(this).hit); };
    // P06: cold damage only. A healing action never receives this racial reduction.
    var elementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var r = target.isActor() ? chosenRace(target) : null, bonus = r && r.bonus;
        if (!bonus || bonus.kind !== 'damageElementRate' || [1, 2, 5, 6].indexOf(this.item().damage.type) < 0) {
            return elementRate.apply(this, arguments);
        }
        var id = this.item().damage.elementId;
        if (id >= 0) return elementRate.apply(this, arguments) * (id === bonus.elementId ? bonus.value : 1);
        var elements = this.subject().attackElements();
        if (!elements.length) return elementRate.apply(this, arguments);
        return Math.max.apply(null, elements.map(function(e) {
            return target.elementRate(e) * (e === bonus.elementId ? bonus.value : 1);
        }));
    };
    var extract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) { extract.apply(this, arguments); restoreAppearance(); };
    var titleList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        titleList.apply(this, arguments);
        this.addCommand('Laboratório técnico', 'arenaLab');
    };
    var titleWindow = Scene_Title.prototype.createCommandWindow;
    var nativeNewGame = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.createCommandWindow = function() {
        titleWindow.apply(this, arguments);
        this._commandWindow.setHandler('arenaLab', nativeNewGame.bind(this));
        this._commandWindow.setHandler('newGame', function() { SceneManager.push(Scene_ArenaCharacterCreation); });
    };
    function Choices() { this.initialize.apply(this, arguments); }
    Choices.prototype = Object.create(Window_Command.prototype);
    Choices.prototype.constructor = Choices;
    Choices.prototype.initialize = function(x, y, width, entries, columns) {
        this._entries = entries; this._width = width; this._columns = columns || 1;
        Window_Command.prototype.initialize.call(this, x, y);
    };
    Choices.prototype.windowWidth = function() { return this._width; };
    Choices.prototype.maxCols = function() { return this._columns; };
    Choices.prototype.standardFontSize = function() { return 26; };
    Choices.prototype.makeCommandList = function() { this._entries.forEach(function(e) { this.addCommand(e.name, e.id, e.enabled !== false); }, this); };
    Choices.prototype.onTouch = function(triggered) {
        if (!triggered) return Window_Command.prototype.onTouch.call(this, triggered);
        var index = this.hitTest(this.canvasToLocalX(TouchInput.x), this.canvasToLocalY(TouchInput.y));
        if (index >= 0) { this.select(index); this.processOk(); }
    };
    Choices.prototype.select = function(index) { Window_Command.prototype.select.call(this, index); if (this.changed) this.changed(); };
    Scene_ArenaCharacterCreation = function() { this.initialize.apply(this, arguments); };
    Scene_ArenaCharacterCreation.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ArenaCharacterCreation.prototype.constructor = Scene_ArenaCharacterCreation;
    Scene_ArenaCharacterCreation.prototype.createBackground = function() {
        var background = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        background.fillAll('#101318');
        this._backgroundSprite = new Sprite(background);
        this.addChild(this._backgroundSprite);
    };
    Scene_ArenaCharacterCreation.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._draft = { name: '', raceId: $arenaCharacterCatalog.races[0].id, genderId: 'male' };
        var heading = new Bitmap(Graphics.boxWidth, 60); heading.fontSize = 30;
        heading.drawText('Criação do personagem', 32, 8, Graphics.boxWidth - 64, 40);
        this.addChild(new Sprite(heading));
        this.createNameInput();
        this._race = new Choices(32, 124, 360, $arenaCharacterCatalog.races);
        this.addWindow(this._race);
        this._gender = new Choices(416, 124, 368, $arenaCharacterCatalog.genders, 2);
        this.addWindow(this._gender); this._gender.deactivate();
        this._preview = new Window_Base(416, 196, 368, 252); this.addWindow(this._preview);
        this._face = new Sprite(); this._face.x = 20; this._face.y = 20; this._face.setFrame(0, 0, 144, 144);
        this._mapFigure = new Sprite(); this._mapFigure.x = 186; this._mapFigure.y = 150; this._mapFigure.setFrame(48, 0, 48, 64);
        this._side = new Sprite(); this._side.x = 200; this._side.y = 36;
        [this._face, this._mapFigure, this._side].forEach(function(s) { this._preview.addChild(s); }, this);
        this._info = new Window_Base(32, 448, 752, 104); this._info.standardFontSize = function() { return 26; }; this.addWindow(this._info);
        this._footer = new Choices(32, 552, 752, [{ id: 'confirm', name: 'Confirmar' }, { id: 'back', name: 'Voltar' }, { id: 'exit', name: 'Cancelar' }], 3);
        this.addWindow(this._footer); this._footer.deactivate();
        this._footer.setHandler('confirm', this.askConfirmation.bind(this));
        this._footer.setHandler('back', function() { this._race.activate(); }.bind(this));
        this._footer.setHandler('exit', this.cancelCreation.bind(this));
        this._footer.setHandler('cancel', function() { this._race.activate(); }.bind(this));
        this._race.setHandler('cancel', this.cancelCreation.bind(this));
        this._race._entries.forEach(function(e) { this._race.setHandler(e.id, function() { this._gender.activate(); }.bind(this)); }, this);
        this._gender._entries.forEach(function(e) { this._gender.setHandler(e.id, function() { this._footer.activate(); }.bind(this)); }, this);
        this._gender.setHandler('cancel', function() { this._race.activate(); }.bind(this));
        this._race.changed = this.refreshDraft.bind(this); this._gender.changed = this.refreshDraft.bind(this);
        this.refreshDraft();
    };
    Scene_ArenaCharacterCreation.prototype.createNameInput = function() {
        var input = document.createElement('input'); this._nameInput = input;
        input.type = 'text'; input.maxLength = 40; input.placeholder = 'Nome do personagem';
        input.setAttribute('aria-label', 'Nome do personagem'); input.autocomplete = 'off'; input.spellcheck = false;
        input.style.cssText = 'position:absolute;z-index:20;box-sizing:border-box;border:2px solid #a58a55;border-radius:2px;background:#17191d;color:#d8ccaf;padding:4px 10px;font-family:GameFont,serif;';
        input.addEventListener('input', function() { this._draft.name = input.value; }.bind(this));
        input.addEventListener('focus', function() { Input.clear(); TouchInput.clear(); if (this._race) [this._race, this._gender, this._footer].forEach(function(w) { w.deactivate(); }); }.bind(this));
        input.addEventListener('blur', function() { Input.clear(); if (this._race && !this._confirm) this._race.activate(); }.bind(this));
        ['keydown', 'keyup', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach(function(event) {
            input.addEventListener(event, function(e) {
                e.stopPropagation();
                if (event === 'keydown' && (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Tab')) { e.preventDefault(); input.blur(); }
            });
        });
        document.body.appendChild(input);
    };
    Scene_ArenaCharacterCreation.prototype.refreshDraft = function() {
        var r = race(this._race.currentSymbol()); if (!r) return;
        this._draft.raceId = r.id; this._draft.genderId = this._gender.currentSymbol();
        var v = visual(r.id, this._draft.genderId);
        this._info.contents.clear(); this._info.contents.fontSize = 26;
        this._info.drawText(r.name + ' • ' + r.province, 0, 0, 700);
        this._info.drawText(r.bonusLabel, 0, 36, 700);
        if (v && v.ready) {
            function frame(sprite, bitmap, rect) {
                sprite.bitmap = bitmap;
                bitmap.addLoadListener(function() { if (sprite.bitmap === bitmap) sprite.setFrame.apply(sprite, rect); });
            }
            frame(this._face, ImageManager.loadFace(v.face), [0, 0, 144, 144]);
            frame(this._mapFigure, ImageManager.loadCharacter(v.character), [48, 0, 48, 64]);
            frame(this._side, ImageManager.loadPicture(v.sidePicture), [0, 0, 96, 96]);
        }
    };
    Scene_ArenaCharacterCreation.prototype.askConfirmation = function() {
        try { ArenaCharacterCreation.validate(this._draft); }
        catch (error) { this._info.contents.clear(); this._info.drawText(error.message, 0, 0, 700); this._nameInput.focus(); return; }
        if (!ImageManager.isReady()) { this._footer.activate(); return; }
        this._nameInput.style.display = 'none';
        this._confirm = new Choices(208, 232, 400, [{ id: 'yes', name: 'Criar personagem' }, { id: 'no', name: 'Revisar escolhas' }]);
        this.addWindow(this._confirm);
        this._info.contents.clear(); this._info.drawText('Confirmar ' + MVCharacterRules.name(this._draft.name) + '?', 0, 0, 700);
        this._confirm.setHandler('yes', this.commit.bind(this));
        this._confirm.setHandler('no', this.review.bind(this)); this._confirm.setHandler('cancel', this.review.bind(this));
    };
    Scene_ArenaCharacterCreation.prototype.review = function() {
        this._windowLayer.removeChild(this._confirm); this._confirm = null;
        this._nameInput.style.display = ''; this._race.activate(); this.refreshDraft();
    };
    Scene_ArenaCharacterCreation.prototype.commit = function() {
        if (this._committed) return;
        this._committed = true;
        DataManager.setupNewGame();
        ArenaCharacterCreation.confirmCurrent(this._draft);
        if(window.ArenaNarrative){ArenaNarrative.startCampaign();this.fadeOutAll();return;}
        $gamePlayer.reserveTransfer($arenaCharacterVisuals.arrivalMapId, 4, 6, 2, 0);
        this.fadeOutAll(); SceneManager.goto(Scene_Map);
    };
    Scene_ArenaCharacterCreation.prototype.cancelCreation = function() { this._nameInput.blur(); this.popScene(); };
    Scene_ArenaCharacterCreation.prototype.update = function() {
        if (!this._confirm && this._race && TouchInput.isTriggered()) {
            var windows = [this._race, this._gender, this._footer];
            var target = windows.filter(function(w) { return TouchInput.x >= w.x && TouchInput.x < w.x + w.width && TouchInput.y >= w.y && TouchInput.y < w.y + w.height; })[0];
            if (target) { windows.forEach(function(w) { w.deactivate(); }); target.activate(); }
        }
        Scene_MenuBase.prototype.update.call(this);
        if (!this._nameInput) return;
        var r = Graphics._canvas.getBoundingClientRect(), scale = r.width / Graphics.boxWidth;
        Object.assign(this._nameInput.style, { left: (r.left + 32 * scale) + 'px', top: (r.top + 68 * scale) + 'px', width: (752 * scale) + 'px', height: (44 * scale) + 'px', fontSize: Math.max(16, 26 * scale) + 'px' });
    };
    Scene_ArenaCharacterCreation.prototype.terminate = function() {
        if (this._nameInput && this._nameInput.parentNode) this._nameInput.parentNode.removeChild(this._nameInput);
        Scene_MenuBase.prototype.terminate.call(this);
    };
})();
