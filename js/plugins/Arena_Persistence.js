/*:
 * @plugindesc v0.1.0 Contratos persistentes de Arena; sem UI ou eventos de campanha.
 * @author Codex
 * @help Requer MV_StateStore 0.1.0 antes deste plugin. Sem parâmetros/comandos.
 * Configuração e IDs de integração nesta camada; núcleo reutilizável separado.
 * Nome/inventário/atributos/equipamentos/magias continuam nativos do MV.
 * API ArenaPersistence; contratos em doc/PERSISTENCIA_M01.md.
 * Nenhuma concessão, progressão, respawn ou mudança de aparência ao carregar.
 */
var ArenaPersistence = (function() {
    'use strict';
    if (typeof MVStateStore === 'undefined') throw new Error('Arena_Persistence requer MV_StateStore antes dele');
    var namespace = 'arena';
    var sources = {
        'MQ01.ruby-key': { questId: 'MQ01', itemId: 1, quantity: 1, stages: [10, 20] }
    };
    MVStateStore.register(namespace, 1, {
        character: { actorId: 1, raceId: null, genderId: null, baseVisualId: null },
        resources: {}, progression: { choices: {} },
        quests: { MQ01: { stage: 0, objectives: {}, completed: false, receipts: {} } },
        sources: {}, enemies: {}, areas: {}, hotbar: {}
    });
    function state() { return MVStateStore.read(namespace); }
    function id(value) {
        if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_.:/-]*$/.test(value) ||
            ['constructor', 'prototype', '__proto__'].indexOf(value) >= 0) throw new Error('Arena: ID inválido');
        return value;
    }
    function integer(value, min) {
        if (!Number.isInteger(value) || value < min) throw new Error('Arena: inteiro inválido');
        return value;
    }
    function quest(data, questId) {
        id(questId);
        return Object.prototype.hasOwnProperty.call(data.quests, questId) ? data.quests[questId] :
            { stage: 0, objectives: {}, completed: false, receipts: {} };
    }
    function edit(mutate) {
        var data = state();
        mutate(data);
        MVStateStore.replace(namespace, data);
    }
    function source(data, sourceId) {
        id(sourceId);
        if (!Object.prototype.hasOwnProperty.call(sources, sourceId)) throw new Error('Arena: fonte desconhecida');
        var config = sources[sourceId];
        var q = quest(data, config.questId);
        var record = data.sources[sourceId] || { grants: 0, retired: false };
        // A preserved delivery/consumption receipt remains authoritative even if
        // an optional source record is missing from an older/partial save.
        var settled = Object.keys(q.receipts).some(function(receiptId) {
            var receipt = q.receipts[receiptId];
            return receipt && receipt.sourceId === sourceId &&
                ['consume', 'deliver'].indexOf(receipt.kind) >= 0;
        });
        return { config: config, quest: q, record: record,
            active: !q.completed && !record.retired && !settled && config.stages.indexOf(q.stage) >= 0 };
    }
    // Only a single native item stack participates. Roll back it if validation or
    // a plugin throws; save/load is synchronous and cannot interleave this call.
    function inventoryCommit(data, itemId, count) {
        var item = $dataItems[itemId];
        if (!item) throw new Error('Arena: item ausente');
        var previous = $gameParty.numItems(item);
        if (count > $gameParty.maxItems(item)) return false;
        try {
            $gameParty.gainItem(item, count - previous, false);
            if ($gameParty.numItems(item) !== count) throw new Error('Arena: concessão incompleta');
            MVStateStore.replace(namespace, data);
        } catch (error) {
            $gameParty.gainItem(item, previous - $gameParty.numItems(item), false);
            throw error;
        }
        return true;
    }
    return {
        snapshot: state,
        identity: function() {
            var c = state().character;
            c.name = $gameActors.actor(c.actorId).name();
            return c;
        },
        setIdentity: function(raceId, genderId, baseVisualId) {
            [raceId, genderId, baseVisualId].forEach(function(v) { if (v !== null) id(v); });
            edit(function(d) { d.character.raceId = raceId; d.character.genderId = genderId; d.character.baseVisualId = baseVisualId; });
        },
        setResource: function(resourceId, current, maximum) {
            id(resourceId);
            if (['hp', 'mp', 'tp'].indexOf(resourceId) >= 0) throw new Error('Arena: recurso nativo não deve ser duplicado');
            integer(maximum, 0); integer(current, 0);
            if (current > maximum) throw new Error('Arena: recurso acima do máximo');
            edit(function(d) { d.resources[resourceId] = { current: current, maximum: maximum }; });
        },
        recordChoice: function(choiceId, resourceId, amount) {
            id(choiceId); id(resourceId); integer(amount, 1);
            return MVStateStore.once(namespace, 'progression/' + choiceId, function(d) {
                d.progression.choices[choiceId] = { resourceId: resourceId, amount: amount };
            });
        },
        setQuest: function(questId, stage, objectives, completed) {
            id(questId); integer(stage, 0);
            if (!objectives || Array.isArray(objectives) || typeof objectives !== 'object' || typeof completed !== 'boolean') throw new Error('Arena: quest inválida');
            Object.keys(objectives).forEach(function(k) { id(k); if (typeof objectives[k] !== 'boolean') throw new Error('Arena: objetivo inválido'); });
            edit(function(d) {
                var q = quest(d, questId);
                if (stage < q.stage || q.completed && !completed) throw new Error('Arena: regressão de quest');
                d.quests[questId] = { stage: stage, objectives: objectives, completed: completed, receipts: q.receipts };
            });
        },
        sourceStatus: function(sourceId) {
            var s = source(state(), sourceId);
            return { active: s.active, questId: s.config.questId, itemId: s.config.itemId,
                missing: s.active ? Math.max(0, s.config.quantity - $gameParty.numItems($dataItems[s.config.itemId])) : 0 };
        },
        claimSource: function(sourceId) {
            var d = state(), s = source(d, sourceId);
            if (!s.active) return 'inactive';
            var item = $dataItems[s.config.itemId];
            if (!item) throw new Error('Arena: item ausente');
            var missing = Math.max(0, s.config.quantity - $gameParty.numItems(item));
            if (!missing) return 'present';
            s.record.grants += 1;
            d.sources[sourceId] = s.record;
            return inventoryCommit(d, s.config.itemId, s.config.quantity) ? 'granted' : 'capacity';
        },
        consumeImportant: function(sourceId, receiptId, kind) {
            id(receiptId);
            if (['consume', 'deliver'].indexOf(kind) < 0) throw new Error('Arena: tipo de recibo inválido');
            var d = state(), s = source(d, sourceId);
            if (Object.prototype.hasOwnProperty.call(s.quest.receipts, receiptId)) return 'duplicate';
            if (!s.active) return 'inactive';
            var item = $dataItems[s.config.itemId];
            if (!item) throw new Error('Arena: item ausente');
            var count = $gameParty.numItems(item);
            if (count < s.config.quantity) return 'missing';
            s.quest.receipts[receiptId] = { sourceId: sourceId, itemId: s.config.itemId, quantity: s.config.quantity, kind: kind };
            d.quests[s.config.questId] = s.quest;
            s.record.retired = true;
            d.sources[sourceId] = s.record;
            return inventoryCommit(d, s.config.itemId, count - s.config.quantity) ? 'consumed' : 'capacity';
        },
        setEnemy: function(enemyId, areaId, questSpecific, defeated, generation) {
            id(enemyId); id(areaId); integer(generation, 0);
            if (typeof questSpecific !== 'boolean' || typeof defeated !== 'boolean') throw new Error('Arena: inimigo inválido');
            edit(function(d) { d.enemies[enemyId] = { areaId: areaId, questSpecific: questSpecific, defeated: defeated, generation: generation }; });
        },
        setArea: function(areaId, completed, exitRevision, generation) {
            id(areaId); integer(exitRevision, 0); integer(generation, 0);
            if (typeof completed !== 'boolean') throw new Error('Arena: área inválida');
            edit(function(d) { d.areas[areaId] = { completed: completed, exitRevision: exitRevision, generation: generation }; });
        },
        setShortcut: function(slotId, reference) {
            id(slotId);
            if (reference !== null) {
                if (!reference || ['item', 'skill'].indexOf(reference.kind) < 0) throw new Error('Arena: atalho inválido');
                integer(reference.id, 1);
                var table = reference.kind === 'item' ? $dataItems : $dataSkills;
                if (!table[reference.id]) throw new Error('Arena: referência de atalho ausente');
                reference = { kind: reference.kind, id: reference.id };
            }
            edit(function(d) { d.hotbar[slotId] = reference; });
        }
    };
})();
