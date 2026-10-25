/*:
 * @plugindesc v0.1.0 Configuração básica reutilizável para MV 1.6.1.
 * @author Codex
 * @param CacheMegapixels
 * @type number
 * @min 1
 * @default 20
 * @param Width
 * @type number
 * @min 480
 * @default 816
 * @param Height
 * @type number
 * @min 480
 * @default 624
 * @help Sem dependências externas, comandos, notas ou dados salvos.
 * Carregar antes de plugins de apresentação. Dimensões inteiras de 480 a
 * 4096; inválidas usam o padrão. Cache de 1 a 512 MPix.
 * Renderização e opções de corrida permanecem nativas do MV.
 * Consulte doc/plugins/Arena_Runtime.md.
 */
(function() {
    'use strict';
    var params = PluginManager.parameters('Arena_Runtime');
    function integer(key, fallback, min, max) {
        var value = Number(params[key]);
        return isFinite(value) && Math.floor(value) === value &&
            value >= min && value <= max ? value : fallback;
    }
    ImageCache.limit = integer('CacheMegapixels', 20, 1, 512) * 1000000;
    SceneManager._screenWidth = SceneManager._boxWidth = integer('Width', 816, 480, 4096);
    SceneManager._screenHeight = SceneManager._boxHeight = integer('Height', 624, 480, 4096);
})();
