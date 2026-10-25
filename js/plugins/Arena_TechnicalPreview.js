/*:
 * @plugindesc v0.1.0 Formas de diagnóstico para mapas com <TechnicalPreview>.
 * @author Codex
 * @help Somente laboratório de desenvolvimento; não é arte da demo.
 * Sem parâmetros, comandos ou dependências externas. Após Arena_Runtime.
 * Mapa: <TechnicalPreview>. Região 1 = parede, demais = piso.
 * Desenha grade e marcador do jogador sem folhas de sprites/tiles.
 * Fornece Window e IconSet técnicos explicitamente em memória; outros
 * recursos continuam usando o carregamento normal e seus erros.
 * Não suporta batalha/animacoes. Remover após integração da arte real.
 * Consulte doc/plugins/Arena_TechnicalPreview.md.
 */
(function() {
    'use strict';
    var skins = {};
    var setLoadingImage = Graphics.setLoadingImage;
    Graphics.setLoadingImage = function(src) {
        if (src !== 'img/system/Loading.png') return setLoadingImage.apply(this, arguments);
        var loading = new Bitmap(320, 48);
        loading.fontSize = 24;
        loading.textColor = '#d8ccaf';
        loading.drawText('Carregando…', 0, 0, 320, 48, 'center');
        setLoadingImage.call(this, loading.canvas.toDataURL());
    };
    function technicalSystem(name) {
        if (skins[name]) return skins[name];
        var b;
        if (name === 'Window') {
            b = new Bitmap(192, 192);
            b.fillRect(0, 0, 96, 96, '#17191d');
            b.fillRect(96, 0, 96, 96, '#a58a55');
            b.clearRect(100, 4, 88, 88);
            b.fillRect(96, 96, 48, 48, '#5c4232');
            for (var i = 0; i < 32; i++) {
                var colors = ['#d8ccaf', '#587ebc', '#b44c4c', '#719365'];
                b.fillRect(96 + i % 8 * 12, 144 + Math.floor(i / 8) * 12,
                    12, 12, colors[i % colors.length]);
            }
            for (var frame = 0; frame < 4; frame++) {
                b.fillRect(151 + frame % 2 * 24, 104 + Math.floor(frame / 2) * 24,
                    10, 6, '#d8ccaf');
            }
        } else if (name === 'IconSet') {
            b = new Bitmap(512, 32);
            b.fillRect(6, 6, 20, 20, '#a58a55');
        } else if (name === 'Shadow1') {
            // Native map construction requests this even without an airship.
            b = new Bitmap(48, 48);
        } else if (name === 'ButtonSet') {
            b = new Bitmap(288, 96);
            var labels = ['−10', '−', '+', '+10', 'OK'];
            b.fontSize = 20;
            for (var row = 0; row < 2; row++) {
                for (var col = 0; col < labels.length; col++) {
                    var width = col === 4 ? 96 : 48;
                    b.fillRect(col * 48, row * 48, width - 2, 46,
                        row ? '#5c4232' : '#343a40');
                    b.drawText(labels[col], col * 48, row * 48, width, 48, 'center');
                }
            }
        } else return null;
        skins[name] = b;
        return b;
    }
    ['loadSystem', 'reserveSystem', 'requestSystem'].forEach(function(method) {
        var original = ImageManager[method];
        ImageManager[method] = function(name) {
            return technicalSystem(name) || original.apply(this, arguments);
        };
    });
    // Only Window/IconSet are used by this lab. Do not preload absent battle art.
    Scene_Boot.loadSystemImages = function() {
        ImageManager.reserveSystem('IconSet');
    };
    function active() {
        return $dataMap && $dataMap.meta && $dataMap.meta.TechnicalPreview;
    }
    var passable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, direction) {
        return active() ? this.regionId(x, y) !== 1 : passable.apply(this, arguments);
    };
    var createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        createLowerLayer.apply(this, arguments);
        if (!active()) return;
        var grid = new Bitmap($gameMap.width() * 48, $gameMap.height() * 48);
        for (var y = 0; y < $gameMap.height(); y++) {
            for (var x = 0; x < $gameMap.width(); x++) {
                grid.fillRect(x * 48, y * 48, 47, 47,
                    $gameMap.regionId(x, y) === 1 ? '#777568' : '#343a40');
            }
        }
        this._technicalGrid = new Sprite(grid);
        this._baseSprite.addChild(this._technicalGrid);
        var marker = new Bitmap(32, 32);
        marker.fillRect(4, 4, 24, 24, '#d8ccaf');
        marker.fillRect(12, 0, 8, 6, '#d28b43');
        this._technicalPlayer = new Sprite(marker);
        this._technicalPlayer.anchor.set(0.5, 1);
        this._baseSprite.addChild(this._technicalPlayer);
        var label = new Bitmap(Graphics.width, 76);
        label.fillAll('#17191d');
        label.fontSize = 20;
        label.textColor = '#d8ccaf';
        label.drawText('ARENA • Laboratório M01 — formas provisórias', 16, 4, Graphics.width - 32, 32);
        label.fontSize = 16;
        label.drawText('Setas / clique: mover • Enter: interagir • Esc: menu', 16, 36, Graphics.width - 32, 30);
        this.addChild(new Sprite(label));
    };
    var update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        update.apply(this, arguments);
        if (!this._technicalGrid) return;
        this._technicalGrid.x = -$gameMap.displayX() * 48;
        this._technicalGrid.y = -$gameMap.displayY() * 48;
        this._technicalPlayer.x = $gamePlayer.screenX();
        this._technicalPlayer.y = $gamePlayer.screenY();
    };
})();
