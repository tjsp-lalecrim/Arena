/*:
 * @plugindesc v0.1.0 Laboratório isolado M01-09: ações nativas sem apresentação de batalha.
 * @author Codex
 * @help Após Arena_Abilities. Sem parâmetros/assets/vozes ou plugins externos.
 * Título > Laboratório de habilidades > Enter no evento. Map006 técnico.
 * ArenaAbilityLab.open/run/equip são diagnósticos restritos ao Map006.
 * Não é combate jogável: sem turnos de inimigo, recompensa ou animação.
 */
var ArenaAbilityLab;
var Scene_ArenaAbilityLab;
(function() {
    'use strict';
    function actor() { return $gameActors.actor($arenaAbilities.actorId); }
    function allowed() { return $gameMap.mapId() === $arenaAbilities.technicalMapId && !$gameParty.inBattle(); }
    function battleContext(fn) {
        var before = $gameParty._inBattle; $gameParty._inBattle = true;
        try { return fn(); } finally { $gameParty._inBattle = before; }
    }
    ArenaAbilityLab = {
        open: function() { if (allowed()) SceneManager.push(Scene_ArenaAbilityLab); },
        equip: function(id) {
            if (!allowed()) return false;
            var a = actor(), weapon = $dataWeapons[id];
            if (weapon && !a.hasWeapon(weapon) && !$gameParty.hasItem(weapon)) $gameParty.gainItem(weapon, 1);
            a.changeEquip(0, weapon || null); return true;
        },
        run: function(action) {
            if (!allowed()) return { failure: 'not-laboratory' };
            var a = actor(), before = ArenaResources.snapshot(), oldTroop = $gameTroop, oldActions = a._actions;
            var keys = Object.keys(BattleManager).filter(function(k) { return k.charAt(0) === '_'; }), old = {};
            keys.forEach(function(k) { old[k] = BattleManager[k]; });
            try {
                return battleContext(function() {
                    $gameTroop = new Game_Troop(); $gameTroop.setup($arenaAbilities.technicalTroopId);
                    BattleManager.initMembers(); BattleManager._subject = a;
                    // Replace only presentation sinks; target generation, payment and effects remain native.
                    BattleManager._statusWindow = { refresh: function() {} };
                    BattleManager._logWindow = { startAction: function() {}, endAction: function() {}, push: function() {},
                        displayActionResults: function() {}, displayCounter: function() {}, displayReflection: function() {}, displaySubstitute: function() {} };
                    a._actions = [action];
                    BattleManager.startAction();
                    var failure = BattleManager._arenaFailure;
                    while (BattleManager._phase === 'action') BattleManager.updateAction();
                    var enemy = $gameTroop.members()[0], after = ArenaResources.snapshot();
                    return { failure: failure, skillId: action.item().id,
                        hp: [before.hp.current, after.hp.current], mp: [before.mp.current, after.mp.current],
                        vigor: [before.vigor.current, after.vigor.current], enemyHp: enemy.hp,
                        result: { used: enemy.result().used, missed: enemy.result().missed, evaded: enemy.result().evaded, hpDamage: enemy.result().hpDamage } };
                });
            } finally {
                a._actions = oldActions; $gameTroop = oldTroop;
                Object.keys(BattleManager).filter(function(k) { return k.charAt(0) === '_'; }).forEach(function(k) { if (keys.indexOf(k) < 0) delete BattleManager[k]; });
                keys.forEach(function(k) { BattleManager[k] = old[k]; });
            }
        }
    };
    function Commands() { this.initialize.apply(this, arguments); }
    Commands.prototype = Object.create(Window_Command.prototype); Commands.prototype.constructor = Commands;
    Commands.prototype.windowWidth = function() { return Graphics.boxWidth; };
    Commands.prototype.numVisibleRows = function() { return 9; };
    Commands.prototype.standardFontSize = function() { return 24; };
    Commands.prototype.makeCommandList = function() {
        this.addCommand('Equipar adaga (diagnóstico)', 'dagger'); this.addCommand('Equipar espada (diagnóstico)', 'sword'); this.addCommand('Remover arma', 'unarmed');
        var self = this;
        battleContext(function() {
            $arenaAbilities.techniques.map(function(d) { return d.skillId; }).concat($arenaAbilities.spellIds).forEach(function(id) {
                var s = $dataSkills[id], label = s.name + ' — ' + (s.mpCost ? s.mpCost + ' Mana' : s.meta.ArenaVigorCost + ' Vigor');
                if ($arenaAbilities.spellIds.indexOf(id) >= 0 && !actor().isLearnedSkill(id)) label += ' (não aprendida)';
                self.addCommand(label, 'skill', actor().canUse(s), id);
            });
        });
        this.addCommand('Kit técnico: +1 de cada livro', 'books'); this.addCommand('Livros pelo menu Itens', 'items');
        this.addCommand('Cama técnica: recuperar os três recursos', 'rest'); this.addCommand('Diagnóstico: Vida =40', 'hurt');
        this.addCommand('Diagnóstico: Mana =0', 'emptyMp'); this.addCommand('Diagnóstico: Vigor =0', 'emptyVigor'); this.addCommand('Voltar', 'cancel');
    };
    function Confirm() { this.initialize.apply(this, arguments); }
    Confirm.prototype = Object.create(Window_Command.prototype); Confirm.prototype.constructor = Confirm;
    Confirm.prototype.makeCommandList = function() { this.addCommand('Executar', 'yes'); this.addCommand('Cancelar', 'cancel'); };
    Scene_ArenaAbilityLab = function() { this.initialize.apply(this, arguments); };
    Scene_ArenaAbilityLab.prototype = Object.create(Scene_MenuBase.prototype); Scene_ArenaAbilityLab.prototype.constructor = Scene_ArenaAbilityLab;
    Scene_ArenaAbilityLab.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight)); this._backgroundSprite.bitmap.fillAll('#101216'); this.addChild(this._backgroundSprite);
    };
    Scene_ArenaAbilityLab.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._status = new Window_Base(0, 0, Graphics.boxWidth, 180); this.addWindow(this._status);
        this._commands = new Commands(0, 180); this.addWindow(this._commands);
        [['dagger',1],['sword',2],['unarmed',0]].forEach(function(r) { this._commands.setHandler(r[0], function() { ArenaAbilityLab.equip(r[1]); this.redraw(); }.bind(this)); }, this);
        this._commands.setHandler('skill', this.ask.bind(this)); this._commands.setHandler('cancel', this.popScene.bind(this));
        this._commands.setHandler('books', function() { $arenaAbilities.books.forEach(function(b) { $gameParty.gainItem($dataItems[b.itemId],1); }); this._message = 'Kit adicionado explicitamente, fora da campanha.'; this.redraw(); }.bind(this));
        this._commands.setHandler('items', function() { SceneManager.push(Scene_Item); });
        this._commands.setHandler('rest', function() { ArenaResources.rest(); this.redraw(); }.bind(this));
        this._commands.setHandler('hurt', function() { actor().setHp(Math.min(40,actor().mhp)); this.redraw(); }.bind(this));
        this._commands.setHandler('emptyMp', function() { actor().setMp(0); this.redraw(); }.bind(this));
        this._commands.setHandler('emptyVigor', function() { var s=ArenaResources.snapshot().vigor; ArenaPersistence.setResource('vigor',0,s.maximum); this.redraw(); }.bind(this));
        this._confirm = new Confirm((Graphics.boxWidth-240)/2,390); this._confirm.hide(); this._confirm.deactivate();
        this._confirm.setHandler('yes', function() {
            var r = ArenaAbilityLab.run(this._selected);
            var reasons = { 'unavailable': 'Arma, magia ou recurso indisponível.', 'already-executed': 'Esta ação já foi executada.',
                'no-target': 'Nenhum alvo válido.', 'not-laboratory': 'Fora do laboratório técnico.', 'book-menu-only': 'Use o livro pelo menu de itens.' };
            this._message = r.failure ? (reasons[r.failure] || 'Ação indisponível.') : 'Vigor '+r.vigor.join('→')+' | Mana '+r.mp.join('→')+' | Vida '+r.hp.join('→')+' | Rato '+r.enemyHp;
            this.closeConfirm();
        }.bind(this));
        this._confirm.setHandler('cancel', this.closeConfirm.bind(this)); this.addWindow(this._confirm); this.redraw();
    };
    Scene_ArenaAbilityLab.prototype.redraw = function() {
        this._commands.refresh(); this._commands.activate();
        var a=actor(),s=ArenaResources.snapshot(),w=this._status;w.contents.clear();w.contents.fontSize=23;
        ['Habilidades M01-09 — diagnóstico, sem combate jogável',
            'Arma: '+(a.weapons()[0]?a.weapons()[0].name:'sem arma')+' | Vida '+a.hp+'/'+a.mhp+' | Mana '+a.mp+'/'+a.mmp+' | Vigor '+s.vigor.current+'/'+s.vigor.maximum,
            this._message || 'Seleção abre confirmação; cancelar não paga. Lista rolável.',
            'Alvo técnico reinicia; sem inimigo agir, XP, loot ou animação.'].forEach(function(t,i){w.drawText(t,0,i*33,w.contentsWidth());});
    };
    Scene_ArenaAbilityLab.prototype.ask = function() {
        this._selected = new Game_Action(actor()); this._selected.setSkill(this._commands.currentExt()); this._selected.setTarget(0);
        this._confirm.show(); this._confirm.activate(); this._confirm.select(0);
    };
    Scene_ArenaAbilityLab.prototype.closeConfirm = function() { this._confirm.hide(); this._confirm.deactivate(); this._selected=null; this.redraw(); };
    var title = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() { title.apply(this,arguments); this.addCommand('Laboratório de habilidades','arenaAbilityLab'); };
    var create = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        create.apply(this,arguments);this._commandWindow.setHandler('arenaAbilityLab',function(){this._commandWindow.close();DataManager.setupNewGame();$gamePlayer.reserveTransfer($arenaAbilities.technicalMapId,8,6,2,0);this.fadeOutAll();SceneManager.goto(Scene_Map);}.bind(this));
    };
})();
