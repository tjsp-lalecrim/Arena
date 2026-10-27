/*:
 * @plugindesc v0.1.0 Encontros visíveis, patrulha, contato e respawn condicionado.
 * @author Codex
 * @help Após MV_EncounterRules, Arena_Dungeon, Arena_Loot e Arena_BattleMotion.
 * Configuração: data/ArenaEncounters.json. Sem dependências externas.
 * API start(id), completeArea(), onExit(), startLab(). Ver doc/plugins/Arena_Encounters.md.
 * Não concede loot, cura recursos, completa quests ou cria encontros aleatórios.
 */
var ArenaEncounters;
(function() {
    'use strict';
    if (!window.MVEncounterRules || !window.ArenaDungeon || !window.ArenaLoot || !window.ArenaBattleMotion) throw Error('Arena_Encounters: dependência ausente');
    DataManager._databaseFiles.push({name:'$arenaEncounters',src:'ArenaEncounters.json'});
    function config() { return window.$arenaEncounters; }
    function entries() { return config().entries; }
    function spec(e) { return config() && e && e._mapId===config().mapId && entries().filter(function(v){return v.eventId===e.eventId();})[0]; }
    function area() { return ArenaPersistence.snapshot().areas[config().areaId] || {completed:false,exitRevision:0,generation:0}; }
    function state(v) { return ArenaPersistence.snapshot().enemies[v.id]; }
    function storeArea(a) { ArenaPersistence.setArea(config().areaId,a.completed,a.exitRevision,a.generation); }
    function ensure() {
        var a=area();storeArea(a);
        entries().forEach(function(v){if(!state(v))ArenaPersistence.setEnemy(v.id,config().areaId,v.questSpecific,false,a.generation);});
    }
    function sync() {
        if (!config() || $gameMap.mapId()!==config().mapId) return;
        ensure();
        entries().forEach(function(v){
            // Older saves contain168 serialized events. Append only the new IDs.
            var e=$gameMap.event(v.eventId);
            if(!e){e=new Game_Event(config().mapId,v.eventId);$gameMap._events[v.eventId]=e;}
            if(state(v).defeated)e.erase();
            else if(e._erased){e._erased=false;e.refresh();e.locate(v.origin[0],v.origin[1]);}
        });
    }
    function busy() { return $gameTemp._arenaEncounterLock || $gameParty.inBattle() || $gamePlayer.isTransferring() || $gameMessage.isBusy() || !(SceneManager._scene instanceof Scene_Map) || SceneManager.isSceneChanging(); }
    ArenaEncounters={
        start:function(id) {
            if(!config() || $gameMap.mapId()!==config().mapId || busy())return false;
            var v=entries().filter(function(v){return v.id===id;})[0];if(!v)return false;
            ensure();var e=$gameMap.event(v.eventId);
            if(!e || e._erased || state(v).defeated || $gameMap.distance(e.x,e.y,$gamePlayer.x,$gamePlayer.y)>1)return false;
            $gameTemp._arenaEncounterLock={id:id};
            BattleManager.setup(v.troopId,false,false);
            BattleManager.setEventCallback(function(result){
                if(result===0 && $gameTroop.isAllDead()){
                    ArenaPersistence.setEnemy(v.id,config().areaId,v.questSpecific,true,state(v).generation);
                    e.erase();
                }
                // Keep the transition locked until the map actually resumes.
            });
            $gamePlayer.makeEncounterCount();SceneManager.push(Scene_Battle);return true;
        },
        completeArea:function() { var a=area();a.completed=true;storeArea(a); },
        onExit:function() {
            ensure();var a=area(),q=ArenaPersistence.snapshot().quests[config().completionQuestId];
            a.completed=a.completed||!!(q&&q.completed);
            var all={};entries().forEach(function(v){all[v.id]=state(v);});
            var next=MVEncounterRules.exit(a,all);storeArea(next.area);
            Object.keys(next.enemies).forEach(function(id){var v=next.enemies[id];ArenaPersistence.setEnemy(id,v.areaId,v.questSpecific,v.defeated,v.generation);});
        },
        startLab:function() { ArenaDungeon.startLab();$gameSystem._arenaEncounterTechnical=true;$gamePlayer.reserveTransfer(config().mapId,35,16,6,0); },
        sync:sync
    };
    var setup=Game_Map.prototype.setup;
    Game_Map.prototype.setup=function(){setup.apply(this,arguments);sync();};
    var loaded=Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded=function(){
        // Native sprites are created inside onMapLoaded, so migrate before it.
        if(!$gamePlayer.isTransferring())sync();
        loaded.apply(this,arguments);
    };
    var start=Scene_Map.prototype.start;
    Scene_Map.prototype.start=function(){start.apply(this,arguments);$gameTemp._arenaEncounterLock=null;sync();};
    var transfer=Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer=function(){
        if(config() && this.isTransferring() && $gameMap.mapId()===config().mapId && this._newMapId!==config().mapId)ArenaEncounters.onExit();
        transfer.apply(this,arguments);
    };
    var move=Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement=function(){
        var v=spec(this);if(!v)return move.apply(this,arguments);
        if(this._erased || this._locked || this.isMoving() || !this.isNearTheScreen() || busy() || $gameMap.isEventRunning())return;
        this._arenaPatrolTick=(this._arenaPatrolTick||0)+1;
        if(this._arenaPatrolTick%v.interval!==0)return;
        var dirs=MVEncounterRules.directions(this._arenaPatrolTick/v.interval);
        for(var i=0;i<dirs.length;i++){
            var d=dirs[i],x=$gameMap.roundXWithDirection(this.x,d),y=$gameMap.roundYWithDirection(this.y,d);
            if(MVEncounterRules.within(x,y,v.origin,v.radius) && v.regions.indexOf($gameMap.regionId(x,y))>=0 && this.canPass(this.x,this.y,d)){this.moveStraight(d);break;}
            // Native blocked event contact must still trigger when facing player.
            if(x===$gamePlayer.x&&y===$gamePlayer.y&&MVEncounterRules.within(x,y,v.origin,v.radius)&&v.regions.indexOf($gameMap.regionId(x,y))>=0&&this.isMapPassable(this.x,this.y,d)){this.moveStraight(d);break;}
        }
    };
    var pass=Game_Event.prototype.isMapPassable;
    Game_Event.prototype.isMapPassable=function(x,y,d){var v=spec(this);if(v){var nx=$gameMap.roundXWithDirection(x,d),ny=$gameMap.roundYWithDirection(y,d);if(!MVEncounterRules.within(nx,ny,v.origin,v.radius)||v.regions.indexOf($gameMap.regionId(nx,ny))<0)return false;}return pass.apply(this,arguments);};
    var bitmap=Sprite_Character.prototype.updateBitmap,frame=Sprite_Character.prototype.updateFrame,position=Sprite_Character.prototype.updatePosition;
    function visual(s){var v=s._character instanceof Game_Event&&spec(s._character);return v&&{spec:v,profile:$arenaBattleMotion.enemies[String(v.enemyId)]};}
    var visibility=Sprite_Character.prototype.updateVisibility;
    Sprite_Character.prototype.updateVisibility=function(){visibility.apply(this,arguments);if(visual(this)&&this._character._erased)this.visible=false;};
    Sprite_Character.prototype.updateBitmap=function(){var v=visual(this);if(!v)return bitmap.apply(this,arguments);this.bitmap=ImageManager.loadEnemy(v.profile.file);};
    Sprite_Character.prototype.updateFrame=function(){var v=visual(this);if(!v)return frame.apply(this,arguments);var f=MVMotionTimeline.sample(v.profile.motions.idle,Graphics.frameCount).frame;this.setFrame.apply(this,f.rect);var sign=this._character.direction()===6?-1:1;this.scale.set(v.spec.scale*sign,v.spec.scale);};
    Sprite_Character.prototype.updatePosition=function(){position.apply(this,arguments);var v=visual(this);if(v)this.y+=(v.profile.cell[1]-v.profile.ground)*v.spec.scale;};
    var commands=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList=function(){commands.apply(this,arguments);this.addCommand('Encontros técnicos','arenaEncounters');};
    var create=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){create.apply(this,arguments);this._commandWindow.setHandler('arenaEncounters',ArenaEncounters.startLab);};
    var menu=Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands=function(){menu.apply(this,arguments);if(config()&&$gameMap.mapId()===config().mapId&&$gameSystem._arenaEncounterTechnical)this.addCommand('Teste: concluir área','arenaCompleteArea');};
    var menuCreate=Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow=function(){menuCreate.apply(this,arguments);this._commandWindow.setHandler('arenaCompleteArea',function(){ArenaEncounters.completeArea();SceneManager.pop();$gameMessage.add('Somente cenário técnico: área concluída.\nSaia para testar o respawn.\nMQ01 não foi alterada.');});};
})();
