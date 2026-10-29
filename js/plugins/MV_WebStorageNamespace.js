/*:
 * @plugindesc v0.1.0 Namespace configurável para armazenamento web nativo do MV.
 * @author Codex
 * @param Namespace
 * @type string
 * @desc Prefixo exclusivo e estável. Não incluir o número da build.
 * @default
 * @help Configurar um Namespace não vazio, exclusivo deste jogo/campanha.
 * Carregar antes de plugins que leiam o armazenamento na inicialização.
 * Modifica somente StorageManager.webStorageKey no modo web. Slots, global,
 * configurações e backups continuam usando o conteúdo e a compressão nativos.
 * Não importa/remove chaves antigas nem altera armazenamento local NW.js.
 * Sem dependências externas, parâmetros de build ou comandos de plugin.
 */
(function() {
    'use strict';
    var namespace=String(PluginManager.parameters('MV_WebStorageNamespace').Namespace||'').trim();
    if(!/^[A-Za-z0-9][A-Za-z0-9:._-]*$/.test(namespace))throw new Error('MV_WebStorageNamespace: configure um Namespace exclusivo, sem espaços.');
    var nativeKey=StorageManager.webStorageKey;
    StorageManager.webStorageKey=function(savefileId) {
        var key=nativeKey.apply(this,arguments);
        return this.isLocalMode()?key:namespace+':'+key;
    };
})();
