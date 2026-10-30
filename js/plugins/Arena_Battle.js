/*:
 * @plugindesc v0.1.2 Batalha nativa, animações próprias por perfil e recursos reais.
 * @author Codex
 * @help Após Arena_Abilities. Configuração ArenaBattle.json. Sem plugins externos.
 * Escape bloqueado na interface e no processamento. Derrota = game over.
 * Perfis ausentes geram erro explícito; nenhuma pose estática vira animação.
 * API ArenaBattle.resources(battler), profile(battler), startLab(), prepare(), startWeaponPilot().
 */
var ArenaBattle;
(function() {
    'use strict';
    if(!window.ArenaResources||!window.ArenaAbilities||!window.ArenaPersistence)throw Error('Arena_Battle requer persistência, recursos e habilidades carregados antes.');
    DataManager._databaseFiles.push({name:'$arenaBattle',src:'ArenaBattle.json'});
    function profile(b) {
        if (!b) return null;
        return b.isActor() ? $arenaBattle.actors[ArenaPersistence.identity().baseVisualId] : $arenaBattle.enemies[String(b.enemyId())];
    }
    ArenaBattle = {
        profile: profile,
        resources: function(b) {
            var rows=[{id:'hp',name:'Vida',current:b.hp,maximum:b.mhp,color:'#B44C4C'}];
            if(b.isActor() || b.mmp>0 || b.enemy().meta.ArenaHasMana) rows.push({id:'mp',name:'Mana',current:b.mp,maximum:b.mmp,color:'#587EBC'});
            if(b.isActor()) { var s=ArenaResources.snapshot().vigor;rows.push({id:'vigor',name:'Vigor',current:s.current,maximum:s.maximum,color:'#719365'}); }
            return rows;
        },
        startLab: function(race,gender) {
            DataManager.setupNewGame();ArenaCharacterCreation.confirmCurrent({name:'Piloto',raceId:race||'breton',genderId:gender||'female'});
            SceneManager.clearStack();
            $gamePlayer.reserveTransfer($arenaBattle.mapId,8,6,2,0);SceneManager.goto(Scene_Map);
        },
        startWeaponPilot: function(weaponId) {
            weaponId=weaponId===undefined?2:weaponId;
            if(weaponId!==1&&weaponId!==2)throw Error('Arena: arma fora do piloto técnico.');
            this.startLab('breton','female');
            $gameTemp._arenaWeaponPilot=weaponId;
        },
        prepare: function() {
            if($gameMap.mapId()!==$arenaBattle.mapId || $gameParty.inBattle()) return false;
            var a=$gameActors.actor(1),lab=$arenaBattle.lab,weapon=$dataWeapons[lab.weaponId];if(!a.hasWeapon(weapon)&&!$gameParty.hasItem(weapon))$gameParty.gainItem(weapon,1);
            a.changeEquip(0,weapon);
            lab.additionalWeaponIds.forEach(function(id){var w=$dataWeapons[id];if(!a.hasWeapon(w)&&!$gameParty.hasItem(w))$gameParty.gainItem(w,1);});
            lab.bookIds.forEach(function(id){var item=$dataItems[id],skill=Number(item.meta.ArenaLearnSkill);if(!a.isLearnedSkill(skill)){$gameParty.gainItem(item,1);ArenaAbilities.learnBook(a,item);}});
            lab.potionIds.forEach(function(id){$gameParty.gainItem($dataItems[id],1);});ArenaResources.rest();return true;
        }
    };
    var mapStart=Scene_Map.prototype.start;
    Scene_Map.prototype.start=function(){
        mapStart.apply(this,arguments);
        if($gameMap.mapId()!==$arenaBattle.mapId||!$gameTemp._arenaWeaponPilot)return;
        var weaponId=$gameTemp._arenaWeaponPilot;
        $gameTemp._arenaWeaponPilot=false; // One entry only; victory returns to the lab.
        var a=$gameActors.actor(1),weapon=$dataWeapons[weaponId];
        $gameParty.gainItem(weapon,1);a.changeEquip(0,weapon);ArenaResources.rest();
        BattleManager.setup(1,false,false);
        // Native per-instance modifier; never change the enemy database or drops.
        $gameTroop.members().forEach(function(enemy){enemy.addParam(0,500-enemy.mhp);enemy.recoverAll();});
        SceneManager.push(Scene_Battle);
    };
    var setup=BattleManager.setup;
    BattleManager.setup=function(troopId){
        if($gameParty.battleMembers().length!==1||$gameParty.battleMembers()[0].actorId()!==1)throw Error('Arena M01: batalha suporta somente o personagem único.');
        var a=$gameParty.battleMembers()[0];if(!profile(a))throw Error('Arena: personagem sem animações de combate. Consulte a matriz M01-10.');
        $dataTroops[troopId].members.forEach(function(m){if(!$arenaBattle.enemies[String(m.enemyId)])throw Error('Arena: inimigo sem animações de combate: '+m.enemyId);});
        setup.call(this,troopId,false,false);
    };
    BattleManager.canEscape=function(){return false;};
    BattleManager.processEscape=function(){return false;};
    Window_PartyCommand.prototype.makeCommandList=function(){this.addCommand(TextManager.fight,'fight');};
    function frame(sprite,p,body) {
        var state=sprite._arenaState||'wait',n=Math.floor((sprite._arenaClock||0)/p.speed);
        n=state==='wait'?[0,1,2,1][n%4]:Math.min(n,2);
        sprite._arenaFrame=n;body.setFrame(n*p.cell[0],p.rows[state]*p.cell[1],p.cell[0],p.cell[1]);
    }
    function setState(sprite,state){if(sprite._arenaState!==state){sprite._arenaState=state;sprite._arenaClock=0;}}
    var actorBitmap=Sprite_Actor.prototype.updateBitmap;
    Sprite_Actor.prototype.updateBitmap=function(){
        var p=profile(this._actor);if(!p)return actorBitmap.apply(this,arguments);
        if(this._arenaBitmap!==p.file){this._arenaBitmap=p.file;this._mainSprite.bitmap=ImageManager.loadSvActor(p.file);}
    };
    var actorFrame=Sprite_Actor.prototype.updateFrame;
    var startMotion=Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion=function(type){var before=this._motion;startMotion.apply(this,arguments);if(before!==this._motion){this._arenaState=null;this._arenaClock=0;}};
    Sprite_Actor.prototype.updateFrame=function(){
        var p=profile(this._actor);if(!p)return actorFrame.apply(this,arguments);
        var index=this._motion?this._motion.index:1;
        var state=this._actor.isDead()?'defeat':$arenaBattle.nativeMotionStates[index];
        if(!state)throw Error('Arena: movimento nativo sem representação explícita: '+index);
        setState(this,state);this._arenaClock=(this._arenaClock||0)+1;frame(this,p,this._mainSprite);
    };
    Sprite_Actor.prototype.setActorHome=function(){var p=profile(this._actor);this.setHome(580,p?350+p.cell[1]-p.ground:358);};
    Sprite_Actor.prototype.moveToStartPosition=function(){this.startMove(0,0,0);};
    Sprite_Actor.prototype.updateTargetPosition=function(){if(!this.inHomePosition())this.startMove(0,0,0);};
    // Native missing decoration atlases are intentionally disabled, not body animation fallbacks.
    Sprite_Actor.prototype.createShadowSprite=function(){this._shadowSprite=new Sprite();this.addChild(this._shadowSprite);};
    Sprite_Actor.prototype.createStateSprite=function(){this._stateSprite=new Sprite();this._stateSprite.setup=function(){};this.addChild(this._stateSprite);};
    Sprite_Actor.prototype.setupWeaponAnimation=function(){if(this._actor.isWeaponAnimationRequested())this._actor.clearWeaponAnimation();};
    var enemyBitmap=Sprite_Enemy.prototype.updateBitmap;
    var setEnemy=Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler=function(b){setEnemy.apply(this,arguments);var p=profile(b);if(p)this.setHome(b.screenX(),350+p.cell[1]-p.ground);};
    Sprite_Enemy.prototype.updateBitmap=function(){
        var p=profile(this._enemy);if(!p)return enemyBitmap.apply(this,arguments);
        if(this._arenaBitmap!==p.file){this._arenaBitmap=p.file;this.bitmap=ImageManager.loadEnemy(p.file);this.initVisibility();}
    };
    var enemyFrame=Sprite_Enemy.prototype.updateFrame;
    Sprite_Enemy.prototype.updateFrame=function(){
        var p=profile(this._enemy);if(!p)return enemyFrame.apply(this,arguments);
        if(this._enemy.isDead())setState(this,'defeat');
        else if(this._arenaState!=='wait'&&(this._arenaClock||0)>p.speed*3)setState(this,'wait');
        this._arenaClock=(this._arenaClock||0)+1;frame(this,p,this);
    };
    Sprite_Enemy.prototype.updateStateSprite=function(){this._stateIconSprite.y=-90;};
    var enemyEffect=Sprite_Enemy.prototype.startEffect;
    Sprite_Enemy.prototype.startEffect=function(type){
        enemyEffect.apply(this,arguments);
        if(profile(this._enemy)){
            if(type==='whiten')setState(this,'action');
            if(type==='blink')setState(this,'hurt');
            if(type==='collapse'){setState(this,'defeat');this._effectDuration=60;}
        }
    };
    var collapse=Sprite_Enemy.prototype.updateCollapse;
    Sprite_Enemy.prototype.updateCollapse=function(){if(!profile(this._enemy))collapse.apply(this,arguments);};
    // Numeric damage is UI text, not a generated substitute for participant artwork.
    var damageDigits;
    var loadSystem=ImageManager.loadSystem;
    ImageManager.loadSystem=function(name){
        if(name!=='Damage')return loadSystem.apply(this,arguments);
        if(damageDigits)return damageDigits;
        var b=new Bitmap(480,240);b.fontSize=32;
        for(var y=0;y<4;y++)for(var x=0;x<10;x++){b.textColor=['#F0C0C0','#A8D5A1','#A3C8FF','#A8D5A1'][y];b.drawText(String(x),x*48,y*48,48,48,'center');}
        b.textColor='#fff';b.drawText('Errou',0,192,192,48,'center');
        damageDigits=b;return b;
    };
    var stateIconUpdate=Sprite_StateIcon.prototype.update;
    Sprite_StateIcon.prototype.update=function(){stateIconUpdate.apply(this,arguments);this.visible=this._iconIndex>0;};
    Spriteset_Battle.prototype.createBattleback=function(){
        var b=new Bitmap(Graphics.width,Graphics.height);b.fillAll('#17191D');b.fillRect(0,350,Graphics.width,Graphics.height-350,'#343A40');
        this._back1Sprite=new Sprite(b);this._back2Sprite=new Sprite(new Bitmap(1,1));this._battleField.addChild(this._back1Sprite);this._battleField.addChild(this._back2Sprite);
    };
    Spriteset_Battle.prototype.updateBattleback=function(){};
    function gauge(w,r,x,y,width){w.changeTextColor(w.normalColor());w.contents.fillRect(x,y+28,width,6,'#252A30');var fill=r.maximum>0?Math.floor(width*r.current/r.maximum):0;if(fill>0)w.contents.fillRect(x,y+28,fill,6,r.color);w.contents.fontSize=20;w.drawText(r.name+' '+r.current+'/'+r.maximum,x,y,width,'left');w.resetFontSettings();}
    Window_BattleStatus.prototype.drawItem=function(index){
        var a=$gameParty.battleMembers()[index];if(!a)return;
        this.drawText(a.name(),8,0,this.contentsWidth()-16);this.drawActorIcons(a,200,0);
        var rows=ArenaBattle.resources(a),width=Math.floor((this.contentsWidth()-32)/3);
        rows.forEach(function(r,i){gauge(this,r,8+i*(width+8),60,width);},this);
        this.contents.fontSize=18;this.drawText('Combate técnico · animações em validação',8,105,this.contentsWidth()-16);this.resetFontSettings();
    };
    var statusUpdate=Window_BattleStatus.prototype.update;
    Window_BattleStatus.prototype.update=function(){statusUpdate.apply(this,arguments);var stamp=JSON.stringify($gameParty.battleMembers().map(function(a){return[a.name(),ArenaBattle.resources(a),a.allIcons()];}));if(stamp!==this._arenaStamp){this._arenaStamp=stamp;this.refresh();}};
    function EnemyResources(){this.initialize.apply(this,arguments);}
    EnemyResources.prototype=Object.create(Window_Base.prototype);EnemyResources.prototype.constructor=EnemyResources;
    EnemyResources.prototype.initialize=function(){var h=36+$gameTroop.members().reduce(function(n,e){return n+28+ArenaBattle.resources(e).length*40;},0);Window_Base.prototype.initialize.call(this,16,110,290,Math.min(260,h));this.opacity=230;this._stamp='';};
    EnemyResources.prototype.update=function(){
        Window_Base.prototype.update.call(this);var stamp=JSON.stringify($gameTroop.members().map(function(e){return[e.name(),ArenaBattle.resources(e)];}));if(stamp===this._stamp)return;this._stamp=stamp;this.contents.clear();
        var y=0;$gameTroop.members().forEach(function(e){this.contents.fontSize=21;this.drawText(e.name(),0,y,this.contentsWidth());y+=28;ArenaBattle.resources(e).forEach(function(r){gauge(this,r,0,y,this.contentsWidth());y+=40;},this);},this);
    };
    var allWindows=Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows=function(){allWindows.apply(this,arguments);this._arenaEnemyResources=new EnemyResources();this.addWindow(this._arenaEnemyResources);};
    Scene_Gameover.prototype.createBackground=function(){this._backSprite=new Sprite(new Bitmap(Graphics.width,Graphics.height));this._backSprite.bitmap.fillAll('#17191D');this._backSprite.bitmap.fontSize=42;this._backSprite.bitmap.drawText('Fim de jogo',0,230,Graphics.width,80,'center');this.addChild(this._backSprite);};
    var title=Window_TitleCommand.prototype.makeCommandList;
    function Profiles(){this.initialize.apply(this,arguments);}
    Profiles.prototype=Object.create(Window_Command.prototype);Profiles.prototype.constructor=Profiles;
    Profiles.prototype.windowWidth=function(){return 640;};
    Profiles.prototype.numVisibleRows=function(){return 10;};
    Profiles.prototype.makeCommandList=function(){
        if(window.ArenaBalanceLab)this.addCommand('E05 — comparar conjuntos','balanceE05');
        this.addCommand('Teste da arma: Bretã / espada','weaponPilot');
        this.addCommand('Teste da arma: Bretã / adaga','daggerPilot');
        $arenaCharacterCatalog.races.forEach(function(r){$arenaCharacterCatalog.genders.forEach(function(g){this.addCommand(r.name+' · '+g.name,'profile',!!$arenaBattle.actors[r.visuals[g.id]],{race:r.id,gender:g.id});},this);},this);
    };
    function Selection(){this.initialize.apply(this,arguments);}
    Selection.prototype=Object.create(Scene_MenuBase.prototype);Selection.prototype.constructor=Selection;
    Selection.prototype.create=function(){Scene_MenuBase.prototype.create.call(this);this._profiles=new Profiles(88,48);this._profiles.setHandler('cancel',this.popScene.bind(this));this._profiles.setHandler('weaponPilot',ArenaBattle.startWeaponPilot.bind(ArenaBattle));this._profiles.setHandler('daggerPilot',ArenaBattle.startWeaponPilot.bind(ArenaBattle,1));this._profiles.setHandler('profile',function(){var e=this._profiles.currentExt();ArenaBattle.startLab(e.race,e.gender);}.bind(this));this.addWindow(this._profiles);};
    var createSelection=Selection.prototype.create;
    Selection.prototype.create=function(){createSelection.apply(this,arguments);if(window.ArenaBalanceLab)this._profiles.setHandler('balanceE05',ArenaBalanceLab.open);};
    ArenaBattle.selectProfile=function(){SceneManager.push(Selection);};
    var mapLayer=Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer=function(){mapLayer.apply(this,arguments);if($gameMap.mapId()!==$arenaBattle.mapId)return;var b=new Bitmap($gameMap.width()*48,$gameMap.height()*48);b.fontSize=17;$gameMap.events().forEach(function(e){b.drawText(e.event().name,e.x*48-75,e.y*48,198,40,'center');});this._baseSprite.addChild(new Sprite(b));};
    Window_TitleCommand.prototype.makeCommandList=function(){title.apply(this,arguments);this.addCommand('Combate técnico (piloto)','arenaBattle');};
    var titleWindow=Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){titleWindow.apply(this,arguments);this._commandWindow.setHandler('arenaBattle',function(){this._commandWindow.close();ArenaBattle.selectProfile();}.bind(this));};
})();
