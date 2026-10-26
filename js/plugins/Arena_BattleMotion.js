/*:
 * @plugindesc v0.3.0 Movimentos desenhados, armas separadas e impacto nativo.
 * @author Codex
 * @help Após Arena_Battle e MV_MotionTimeline. Sem dependências externas.
 * ArenaBattleMotion.json: cobertura explícita, frames/tempos/apoios/armas.
 * R02 aprovado preservado; expansão R03 das demais15 identidades e inimigos2/3.
 * Inimigos: actionMotion configura o movimento da ação cadastrada (strike/bite).
 * Não aplica dano nem cobra recursos. Pausa apresentação até o impacto nativo.
 * API ArenaBattleMotion.profile(battler), sample(battler).
 */
var ArenaBattleMotion;
(function(){
    'use strict';
    if(!window.ArenaBattle||!window.MVMotionTimeline)throw Error('Arena_BattleMotion requer Arena_Battle e MV_MotionTimeline.');
    DataManager._databaseFiles.push({name:'$arenaBattleMotion',src:'ArenaBattleMotion.json'});
    function profile(b){if(!b||!window.$arenaBattleMotion)return null;return b.isActor()?$arenaBattleMotion.actors[ArenaPersistence.identity().baseVisualId]:$arenaBattleMotion.enemies[String(b.enemyId())];}
    function spriteFor(b){var scene=SceneManager._scene;return scene&&scene._spriteset&&scene._spriteset.battlerSprites().filter(function(s){return s._battler===b;})[0];}
    function play(s,key,action){
        var p=profile(s._battler),m=p.motions[key];if(!m)throw Error('Arena: movimento R02 ausente: '+key);
        s._arenaTimeline={key:key,tick:0,released:!action,action:!!action};
    }
    function currentWeapon(b){return b.isActor()&&b.weapons()[0]||null;}
    function updateWeapon(s,p,frame){
        if(!s._battler.isActor())return;
        if(!s._arenaHeldWeapon){s._arenaHeldWeapon=new Sprite();s.addChildAt(s._arenaHeldWeapon,s.getChildIndex(s._mainSprite));}
        var node=s._arenaHeldWeapon,w=currentWeapon(s._battler),spec=w&&$arenaBattleMotion.weapons[String(w.wtypeId)],hand=frame.hand;
        node.visible=!!(spec&&hand);s._arenaVisibleWeapon=node.visible?w.id:null;
        if(!node.visible){node.bitmap=null;return;}
        node.bitmap=ImageManager.loadPicture(spec.file);node.anchor.set(spec.grip[0]/spec.size[0],spec.grip[1]/spec.size[1]);
        node.x=hand[0]-p.cell[0]/2;node.y=hand[1]-p.cell[1];node.rotation=hand[2]*Math.PI/180;
    }
    function update(s,body){
        var p=profile(s._battler);if(!p)return false;
        if(!s._arenaTimeline)play(s,'idle',false);
        var t=s._arenaTimeline,m=p.motions[t.key],v=MVMotionTimeline.sample(m,t.tick);
        if(s._battler.isDead()&&t.key!=='defeat'){play(s,'defeat',false);t=s._arenaTimeline;m=p.motions.defeat;v=MVMotionTimeline.sample(m,0);}
        else if(v.done&&t.key!=='defeat'){play(s,'idle',false);t=s._arenaTimeline;m=p.motions.idle;v=MVMotionTimeline.sample(m,0);}
        body.setFrame.apply(body,v.frame.rect);updateWeapon(s,p,v.frame);
        s._arenaState=t.key==='idle'?'wait':t.key==='hurt'||t.key==='defeat'?t.key:'action';s._arenaFrame=v.index;
        s._arenaMotionSample={key:t.key,index:v.index,tick:t.tick,total:v.total,done:v.done,impactTick:MVMotionTimeline.impactTick(m),released:t.released,weaponId:s._arenaVisibleWeapon||null};
        t.tick=MVMotionTimeline.advance(m,t.tick,t.released);return true;
    }
    ArenaBattleMotion={profile:profile,sample:function(b){var s=spriteFor(b);return s&&s._arenaMotionSample||null;}};
    [Sprite_Actor,Sprite_Enemy].forEach(function(K){
        var bitmap=K.prototype.updateBitmap,frame=K.prototype.updateFrame;
        K.prototype.updateBitmap=function(){var p=profile(this._battler);if(!p)return bitmap.apply(this,arguments);if(this._arenaR02Bitmap!==p.file){this._arenaR02Bitmap=p.file;if(this._battler.isActor())this._mainSprite.bitmap=ImageManager.loadSvActor(p.file);else {this.bitmap=ImageManager.loadEnemy(p.file);this.initVisibility();}}};
        K.prototype.updateFrame=function(){if(!update(this,this._mainSprite||this))frame.apply(this,arguments);};
    });
    var effect=Sprite_Enemy.prototype.startEffect;
    Sprite_Enemy.prototype.startEffect=function(type){
        if(profile(this._battler)&&(type==='blink'||type==='whiten'))return;
        return effect.apply(this,arguments);
    };
    function movement(action){if(action.isItem())return 'item';if(action.isMagicSkill())return 'cast';if(action.isAttack())return 'light';var key=$arenaBattleMotion.skillMotions[String(action.item().id)];if(!key)throw Error('Arena: ação sem movimento configurado: '+action.item().id);return key;}
    var perform=Window_BattleLog.prototype.performAction;
    Window_BattleLog.prototype.performAction=function(subject,action){perform.apply(this,arguments);var s=spriteFor(subject);if(s&&profile(subject)&&!action.isGuard())play(s,subject.isActor()?movement(action):(profile(subject).actionMotion||'bite'),true);};
    var start=Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction=function(subject,action){
        var at=this._methods.length;start.apply(this,arguments);if(!profile(subject)||action.isGuard())return;
        // Native action text first. Then anticipate, pause at drawn impact, native effects.
        var added=this._methods.splice(at),performers=added.filter(function(m){return m.name==='performAction';}),animations=added.filter(function(m){return m.name==='showAnimation';});
        Array.prototype.push.apply(this._methods,added.filter(function(m){return m.name!=='performAction'&&m.name!=='showAnimation';}));
        Array.prototype.push.apply(this._methods,performers);this.push('waitArenaMotion',subject,'impact');Array.prototype.push.apply(this._methods,animations);
    };
    var end=Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction=function(subject){if(profile(subject))this.push('waitArenaMotion',subject,'complete');end.apply(this,arguments);};
    Window_BattleLog.prototype.waitArenaMotion=function(subject,stage){this._arenaMotionWait={subject:subject,stage:stage};this.setWaitMode('arenaMotion');};
    var wait=Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode=function(){
        if(this._waitMode!=='arenaMotion')return wait.apply(this,arguments);
        var request=this._arenaMotionWait,s=spriteFor(request.subject),t=s&&s._arenaTimeline,p=profile(request.subject),m=t&&p.motions[t.key],impact=m&&MVMotionTimeline.impactTick(m);
        // tick is advanced for the NEXT update; wait on the actually displayed sample.
        var displayed=s&&s._arenaMotionSample;
        var waiting=!!(t&&t.action&&(request.stage==='impact'?(!displayed||displayed.key!==t.key||displayed.tick<impact):t.tick<MVMotionTimeline.duration(m)));
        if(!waiting){this._waitMode='';this._arenaMotionWait=null;}return waiting;
    };
    var invoke=BattleManager.invokeAction;
    BattleManager.invokeAction=function(subject){var s=spriteFor(subject);if(s&&s._arenaTimeline)s._arenaTimeline.released=true;return invoke.apply(this,arguments);};
    var finish=BattleManager.endAction;
    BattleManager.endAction=function(){var s=spriteFor(this._subject);if(s&&s._arenaTimeline)s._arenaTimeline.released=true;return finish.apply(this,arguments);};
    var damage=Window_BattleLog.prototype.performDamage;
    Window_BattleLog.prototype.performDamage=function(target){damage.apply(this,arguments);var s=spriteFor(target);if(s&&profile(target)&&!target.isDead())play(s,'hurt',false);};
    var busy=Spriteset_Battle.prototype.isBusy;
    Spriteset_Battle.prototype.isBusy=function(){return busy.apply(this,arguments)||this.battlerSprites().some(function(s){var p=profile(s._battler),t=s._arenaTimeline;return p&&t&&(t.key==='hurt'||t.key==='defeat')&&t.tick<MVMotionTimeline.duration(p.motions[t.key]);});};
    var setup=BattleManager.setup;
    BattleManager.setup=function(){
        function check(p,required){required.forEach(function(k){if(!p.motions[k])throw Error('Arena: perfil R02 incompleto, movimento '+k);MVMotionTimeline.validate(p.motions[k]);});}
        Object.keys($arenaBattleMotion.actors).forEach(function(id){check($arenaBattleMotion.actors[id],['idle','light','heavy','cast','item','hurt','defeat']);});
        Object.keys($arenaBattleMotion.enemies).forEach(function(id){var p=$arenaBattleMotion.enemies[id];check(p,['idle',p.actionMotion||'bite','hurt','defeat']);});
        return setup.apply(this,arguments);
    };
})();
