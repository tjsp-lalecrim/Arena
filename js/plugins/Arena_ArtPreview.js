/*:
 * @plugindesc v0.2.0 Galeria técnica M01-06; não implementa combate ou criação.
 * @author Codex
 * @param PreviewMap
 * @type number
 * @default 2
 * @help MV 1.6.1. Após os plugins Arena atuais; usa a skin técnica existente.
 * Título > Validação visual R04 inicia nova partida técnica no Map003.
 * Amostra anterior inicia no PreviewMap (padrão 2); arquivos antigos preservados.
 * Perfis em data/ArenaArtSamples.json: mapa, imagem do rato, quadros e durações
 * em updates. Rat R03: 96x64, alerta/preparo/bote/retorno; não combate completo.
 * Retrato 144x144 e lateral estática 96x96 da piloto ainda provisórios.
 * Placas mostram ilustrações nativas; fundo opaco oculta mapa/jogador.
 * Sem comandos, notas, regras de batalha ou novos dados persistentes.
 * Configuração e limitações em doc/plugins/Arena_ArtPreview.md.
 */
(function() {
    'use strict';
    var value = Number(PluginManager.parameters('Arena_ArtPreview').PreviewMap || 2);
    var mapId = Number.isInteger(value) && value > 0 ? value : 2;
    DataManager._databaseFiles.push({ name: '$arenaArtSamples', src: 'ArenaArtSamples.json' });
    function profile(id) {
        if (!window.$arenaArtSamples) return null;
        return $arenaArtSamples[String(id)] || (id === mapId ? $arenaArtSamples['2'] : null);
    }
    var commands = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        commands.apply(this, arguments);
        this.addCommand('Validação visual R04', 'artCurrent');
        this.addCommand('Amostra anterior', 'artPreview');
    };
    var title = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        title.apply(this, arguments);
        this._commandWindow.setHandler('artCurrent', function() {
            DataManager.setupNewGame();
            $gamePlayer.reserveTransfer(3, 4, 6, 2, 0);
            this._commandWindow.close();
            this.fadeOutAll();
            SceneManager.goto(Scene_Map);
        }.bind(this));
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
        if (profile($gameMap.mapId())) {
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
        var sample = profile($gameMap.mapId());
        if (!sample) return;
        this._artSample = sample;
        var layer = new Sprite();
        this._artLayer = layer;
        this._baseSprite.addChild(layer); // Below native pictures and messages.
        var ui = new Bitmap(816, 624);
        ui.fillRect(0, 0, 816, 84, '#17191d');
        ui.fillRect(464, 84, 352, 540, '#17191d');
        ui.fillRect(0, 528, 464, 96, '#17191d');
        ui.textColor = '#d8ccaf'; ui.fontSize = 22;
        ui.drawText(sample.legacy ? 'ARENA • Amostra anterior (histórico)' : 'ARENA • Direção aprovada; validação R04', 16, 8, 784, 32);
        ui.fontSize = 17;
        ui.drawText('Bretã piloto provisória • arte IA • sem combate jogável', 16, 42, 784, 30);
        ui.drawText('Retrato 144×144', 480, 92, 190, 28);
        ui.drawText('Lateral 96×96', 664, 92, 144, 28);
        ui.drawText('Mesma personagem, roupa e paleta', 480, 284, 320, 28);
        ui.drawText('Adaga · couro · cura — 32px', 480, 366, 320, 28);
        ui.drawText(sample.legacy ? 'Rato: respiração (histórico)' : 'Rato R03: trecho de bote 96×64', 480, 464, 320, 28);
        ui.drawText(sample.legacy ? '0 → 1 → 2 → 1; sem batalha' : 'Alerta → preparo → bote → retorno', 480, 494, 320, 28);
        ui.drawText('Setas / clique: mover • Esc: menu e salvar', 16, 536, 440, 28);
        ui.drawText(sample.legacy ? 'Enter: Ria (4,9), Sair (1,9)' : 'Enter: Ria (4,9), cela (7,9), sair (1,9)', 16, 566, 440, 28);
        ui.fontSize = 16;
        ui.drawText('Ria', 192, 432, 48, 28, 'center');
        ui.drawText('Sair', 48, 432, 48, 28, 'center');
        if (!sample.legacy) ui.drawText('Cela', 336, 432, 48, 28, 'center');
        layer.addChild(new Sprite(ui));
        layer.addChild(picture('arena_breta_retrato_v01', 480, 128));
        layer.addChild(picture('arena_breta_lateral_v01', 680, 144));
        layer.addChild(picture('arena_icones_v01', 528, 326));
        this._artRat = picture(sample.rat, 592, 396);
        layer.addChild(this._artRat);
        this._artRatFrame = 0;
        // Opaque backing prevents map/player from appearing beside narrative pictures.
        var backing = new Bitmap(816, 624);
        backing.fillAll('#000000');
        this._artPictureBacking = new Sprite(backing);
        this._artPictureBacking.visible = false;
        this._baseSprite.addChild(this._artPictureBacking);
    };
    var update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        update.apply(this, arguments);
        if (this._artRat) {
            var showingPicture = !!$gameScreen.picture(1);
            this._artLayer.visible = !showingPicture;
            this._artPictureBacking.visible = showingPicture;
            var elapsed = this._artRatFrame++;
            var sample = this._artSample;
            var total = sample.durations.reduce(function(a, b) { return a + b; }, 0);
            elapsed %= total;
            var frame = 0;
            while (elapsed >= sample.durations[frame]) elapsed -= sample.durations[frame++];
            var index = sample.frames[frame];
            this._artRat.setFrame(index * 96, 0, 96, 64);
        }
    };
})();
