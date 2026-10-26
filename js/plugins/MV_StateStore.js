/*:
 * @plugindesc v0.1.0 Estado JSON versionado por namespace, salvo em Game_System.
 * @author Codex
 * @help MV 1.6.1. Sem parâmetros, comandos, notas, assets ou dependências.
 * Carregar antes dos consumidores. API: MVStateStore.register(name, version,
 * defaults, migrate), read(name), replace(name, data), once(name, key, mutate),
 * hasOperation(name, key).
 * mutate recebe somente um rascunho JSON; não executar efeitos externos.
 * Saves sem campos recebem defaults. Versão futura/estrutura inválida gera
 * erro explícito, sem apagar dados. Consulte doc/plugins/MV_StateStore.md.
 */
var MVStateStore = (function() {
    'use strict';
    var definitions = {};
    var has = function(o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
    function key(value) {
        if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_.:/-]*$/.test(value) ||
            ['constructor', 'prototype', '__proto__'].indexOf(value) >= 0) {
            throw new Error('MV_StateStore: identificador inválido');
        }
        return value;
    }
    function json(value) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
        if (typeof value === 'number' && isFinite(value)) return;
        if (typeof value !== 'object' || !value) throw new Error('MV_StateStore: esperado JSON finito');
        if (!Array.isArray(value) && Object.prototype.toString.call(value) !== '[object Object]') {
            throw new Error('MV_StateStore: esperado objeto JSON simples');
        }
        Object.keys(value).forEach(function(k) {
            if (['__proto__', 'constructor', 'prototype'].indexOf(k) >= 0) throw new Error('MV_StateStore: chave reservada');
            json(value[k]);
        });
    }
    function clone(value) { json(value); return JSON.parse(JSON.stringify(value)); }
    function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
    function fill(value, defaults) {
        if (value === undefined) return clone(defaults);
        if (defaults !== null && typeof value !== typeof defaults || Array.isArray(value) !== Array.isArray(defaults)) {
            throw new Error('MV_StateStore: campo com tipo incompatível');
        }
        if (object(defaults)) {
            if (!object(value)) throw new Error('MV_StateStore: esperado objeto');
            Object.keys(defaults).forEach(function(k) { value[k] = fill(value[k], defaults[k]); });
        }
        return value;
    }
    function normalize(raw) {
        var root = raw === undefined ? { schemaVersion: 1, namespaces: {} } : clone(raw);
        if (!object(root)) throw new Error('MV_StateStore: raiz inválida');
        if (root.schemaVersion === undefined) root.schemaVersion = 1;
        if (root.schemaVersion !== 1) throw new Error('MV_StateStore: versão de save não suportada');
        if (root.namespaces === undefined) root.namespaces = {};
        if (!object(root.namespaces)) throw new Error('MV_StateStore: namespaces inválidos');
        Object.keys(definitions).forEach(function(name) {
            var def = definitions[name];
            var entry = root.namespaces[name];
            if (entry === undefined) entry = { version: def.version, data: clone(def.defaults), operations: {} };
            if (!object(entry)) throw new Error('MV_StateStore: namespace inválido');
            if (entry.version === undefined) entry.version = 0;
            if (!Number.isInteger(entry.version) || entry.version < 0 || entry.version > def.version) {
                throw new Error('MV_StateStore: versão de namespace não suportada');
            }
            if (entry.version < def.version) {
                if (def.migrate) entry.data = def.migrate(entry.data, entry.version);
                else if (entry.version !== 0) throw new Error('MV_StateStore: migração ausente');
                entry.version = def.version;
            }
            entry.data = fill(entry.data, def.defaults);
            if (entry.operations === undefined) entry.operations = {};
            if (!object(entry.operations)) throw new Error('MV_StateStore: operações inválidas');
            Object.keys(entry.operations).forEach(function(k) {
                key(k);
                if (entry.operations[k] !== true) throw new Error('MV_StateStore: recibo inválido');
            });
            json(entry);
            root.namespaces[name] = entry;
        });
        return root;
    }
    function entry(name) {
        key(name);
        if (!has(definitions, name)) throw new Error('MV_StateStore: namespace não registrado');
        if (!$gameSystem) throw new Error('MV_StateStore: partida não inicializada');
        return $gameSystem._persistentState.namespaces[name];
    }
    var initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        initialize.apply(this, arguments);
        this._persistentState = normalize(undefined);
    };
    var extract = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        // Validate before extracting saved objects. The native load flow may
        // already have created temporary game objects before this hook.
        var state = normalize(contents.system._persistentState);
        extract.apply(this, arguments);
        $gameSystem._persistentState = state;
    };
    return {
        register: function(name, version, defaults, migrate) {
            key(name);
            if (has(definitions, name) || !Number.isInteger(version) || version < 1 || !object(defaults)) {
                throw new Error('MV_StateStore: definição inválida ou repetida');
            }
            definitions[name] = { version: version, defaults: clone(defaults), migrate: migrate };
        },
        read: function(name) { return clone(entry(name).data); },
        replace: function(name, data) {
            var target = entry(name);
            var next = fill(clone(data), definitions[name].defaults);
            target.data = next;
        },
        hasOperation: function(name, operationId) {
            key(operationId);
            return entry(name).operations[operationId] === true;
        },
        once: function(name, operationId, mutate) {
            key(operationId);
            var target = entry(name);
            if (has(target.operations, operationId)) return 'duplicate';
            var draft = clone(target.data);
            var result = mutate(draft);
            if (result && typeof result.then === 'function') throw new Error('MV_StateStore: operação deve ser síncrona');
            if (result === false) return 'aborted';
            var next = fill(clone(draft), definitions[name].defaults);
            target.data = next;
            target.operations[operationId] = true;
            return 'applied';
        }
    };
})();
