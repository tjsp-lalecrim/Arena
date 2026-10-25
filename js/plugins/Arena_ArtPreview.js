/*:
 * @plugindesc v0.1.0 Galeria técnica M01-06; não implementa combate ou criação.
 * @author Codex
 * @param PreviewMap
 * @type number
 * @default 2
 * @help MV 1.6.1. Após os plugins Arena atuais; usa a skin técnica existente.
 * Título > Amostra visual inicia partida técnica nova no mapa configurado.
 * Exibe arte IA em escala nativa, pose lateral estática 96x96 e respiração
 * do rato em três frames 96x64, sequência 0,1,2,1 a 18 updates por frame.
 * A placa Ria abre uma imagem pelo evento nativo; Sair retorna ao laboratório.
 * Sem comandos, notas, regras de batalha ou novos dados persistentes.
 * Configuração específica de assets em doc/plugins/Arena_ArtPreview.md.
 */
(function() {
    'use strict';
    var value = Number(PluginManager.parameters('Arena_ArtPreview').PreviewMap || 2);
    var mapId = Number.isInteger(value) && value > 0 ? value : 2;
    var commands = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        commands.apply(this, arguments);
        this.addCommand('Amostra visual', 'artPreview');
    };
    var title = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        title.apply(this, arguments);
        this._commandWindow.setHandler('artPreview', function() {
            DataManager.setupNewGame();
            $gamePlayer.reserveTransfer(mapId, 4, 6, 2, 0);
            this._commandWindow.close();
            this.fadeOutAll();
            SceneManager.goto(Scene_Map);
        }.bind(this));
    };
    var start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        if ($gameMap.mapId() === mapId) {
            var actor = $gameParty.leader();
            actor.setCharacterImage('$Arena_Breton_Pilot', 0);
            actor.setFaceImage('Arena_Breton_Pilot', 0);
            $gamePlayer.refresh();
        }
        start.apply(this, arguments);
    };
    function picture(name, x, y) {
        var sprite = new Sprite(ImageManager.loadPicture(name));
        sprite.x = x; sprite.y = y;
        return sprite;
    }
    var lower = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        lower.apply(this, arguments);
        if ($gameMap.mapId() !== mapId) return;
        var layer = new Sprite();
        this._artLayer = layer;
        this._baseSprite.addChild(layer); // Below native pictures and messages.
        var ui = new Bitmap(816, 624);
        ui.fillRect(0, 0, 816, 84, '#17191d');
        ui.fillRect(464, 84, 352, 540, '#17191d');
        ui.fillRect(0, 528, 464, 96, '#17191d');
        ui.textColor = '#d8ccaf'; ui.fontSize = 22;
        ui.drawText('ARENA • Amostra artística M01-06', 16, 8, 784, 32);
        ui.fontSize = 17;
        ui.drawText('Bretã piloto • arte IA em escala final • sem combate jogável', 16, 42, 784, 30);
        ui.drawText('Retrato 144×144', 480, 92, 190, 28);
        ui.drawText('Lateral 96×96', 664, 92, 144, 28);
        ui.drawText('Mesma personagem, roupa e paleta', 480, 284, 320, 28);
        ui.drawText('Adaga · couro · cura — 32px', 480, 366, 320, 28);
        ui.drawText('Rato: três poses de respiração', 480, 464, 320, 28);
        ui.drawText('0 → 1 → 2 → 1; sem batalha', 480, 494, 320, 28);
        ui.drawText('Setas / clique: mover • Esc: menu e salvar', 16, 536, 440, 28);
        ui.drawText('Enter nas placas: Ria (4,9) ou Sair (1,9)', 16, 566, 440, 28);
        ui.fontSize = 16;
        ui.drawText('Ria', 192, 432, 48, 28, 'center');
        ui.drawText('Sair', 48, 432, 48, 28, 'center');
        layer.addChild(new Sprite(ui));
        layer.addChild(picture('arena_breta_retrato_v01', 480, 128));
        layer.addChild(picture('arena_breta_lateral_v01', 680, 144));
        layer.addChild(picture('arena_icones_v01', 528, 326));
        this._artRat = picture('arena_rato_respiracao_v01', 592, 396);
        layer.addChild(this._artRat);
        this._artRatFrame = 0;
    };
    var update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        update.apply(this, arguments);
        if (this._artRat) {
            this._artLayer.visible = !$gameScreen.picture(1);
            var index = [0, 1, 2, 1][Math.floor(this._artRatFrame++ / 18) % 4];
            this._artRat.setFrame(index * 96, 0, 96, 64);
        }
    };
})();
