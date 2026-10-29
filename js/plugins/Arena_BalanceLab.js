/*:
 * @plugindesc v0.1.0 E05 isolado: quatro conjuntos S06, sem saves ou regras na campanha.
 * @author Codex
 * @help Carregar após Arena_Battle, Arena_Resources, Arena_Abilities e Arena_Loot.
 * Título > Combate técnico (piloto) > E05 — comparar conjuntos.
 * Somente Bretã feminina nível3/adaga/goblin2. Conjuntos virtuais, sem novos itens.
 * API ArenaBalanceLab: open(), start(id), active(), snapshot(), leave().
 * Fórmula S02 só nesta sessão. Semente por cenário, não modifica RNG global permanente.
 * Bloqueia save/índice/serialização experimental; sair ao título ou carregar limpa contexto.
 * Não é aprovação de balanceamento. Documentação: doc/PILOTO_E05_M01_20.md.
 */
var ArenaBalanceLab;
(function() {
    'use strict';
    var session=null,last=null,seed=19720;
    var profiles=[
        {id:'light',name:'Leve',bonus:[0,6,0,0,2,0]},
        {id:'heavy',name:'Pesado',bonus:[0,8,0,0,0,0]},
        {id:'magic',name:'Vestimenta mágica',bonus:[0,4,4,0,0,0]},
        {id:'hybrid',name:'Híbrido',bonus:[0,5,2,0,1,0]}
    ];
    function active(){return !!(session&&session.party===$gameParty&&session.actor===$gameActors.actor(1));}
    function clear(){if(session)DataManager._lastAccessedId=session.previousSlot;session=null;}
    function snapshot(){return active()?{id:session.profile.id,name:session.profile.name,level:3,earned:6,spent:[3,0,3,0,0,0],
        attrs:[2,3,4,5,6,7].map(function(i){return session.actor.param(i);}),resources:ArenaResources.snapshot(),seed:seed,rollState:session.randomState,actions:session.actions.slice()}:null;}
    function start(id){
        var p=profiles.filter(function(p){return p.id===id;})[0];
        if(!p)throw Error('E05: conjunto inválido.');
        if($gameParty&&$gameParty.inBattle())return false;
        var previous=active()?session.previousSlot:DataManager._lastAccessedId;
        ArenaBattle.startLab('breton','female');
        var a=$gameActors.actor(1);
        session={profile:p,actor:a,party:$gameParty,previousSlot:previous,ready:true,finished:false,randomState:seed,actions:[]};
        a.setName('E05 · '+p.name);a.changeLevel(3,false);
        ArenaResources.choose(2,'hp');ArenaResources.choose(3,'mp');
        $gameParty.gainItem($dataWeapons[1],1);a.changeEquip(0,$dataWeapons[1]);
        // One fixed allocation in ALL scenarios; equipment is an aggregate fixture, not pieces.
        [3,0,3,0,0,0].forEach(function(v,i){a.addParam(i+2,v+p.bonus[i]);});
        a.learnSkill(9);a.learnSkill(10);ArenaResources.rest();
        return true;
    }
    function formula(action,target){
        if(!active()||!$gameParty.inBattle()||!action.isSkill())return null;
        var id=action.item().id,heavy=id===6,p=id===1?1:id===5?1.25:heavy?1.6:id===10?3:0;
        if(!p)return null;
        var a=action.subject(),magic=id===10,y=magic?target.mdf:target.def;
        return p*(magic?a.mat:a.atk)*Math.max(.2,8/(8+Math.max(0,y)*(heavy?.75:1)));
    }
    var evaluate=Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula=function(target){var n=formula(this,target);return n===null?evaluate.apply(this,arguments):n;};
    var damage=Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue=function(target,critical){
        var value=damage.apply(this,arguments),base=formula(this,target);
        // Preserve immunity/zero-rate cases; only enforce S02's positive-hit floor in E05.
        return base!==null&&base>0&&this.calcElementRate(target)>0&&(this.isPhysical()?target.pdr:this.isMagical()?target.mdr:1)>0?Math.max(1,value):value;
    };
    function random(){session.randomState=(Math.imul(1664525,session.randomState)+1013904223)>>>0;return session.randomState/4294967296;}
    function scoped(fn,self,args){
        if(!active()||!$gameParty.inBattle())return fn.apply(self,args);
        var original=Math.random;Math.random=random;
        try{return fn.apply(self,args);}finally{Math.random=original;}
    }
    ['speed','apply'].forEach(function(key){var original=Game_Action.prototype[key];Game_Action.prototype[key]=function(){
        var result=scoped(original,this,arguments);
        if(key==='apply'&&active())session.actions.push({skill:this.isSkill()?this.item().id:null,actor:this.subject().isActor(),damage:arguments[0].result().hpDamage,missed:arguments[0].result().missed,evaded:arguments[0].result().evaded});
        return result;
    };});
    var enemyActions=Game_Enemy.prototype.makeActions;
    Game_Enemy.prototype.makeActions=function(){return scoped(enemyActions,this,arguments);};
    // No XP, loot or level changes between comparisons; normal rewards are untouched.
    ['makeRewards','gainRewards'].forEach(function(key){var original=BattleManager[key];BattleManager[key]=function(){
        if(active()){if(key==='makeRewards')this._rewards={exp:0,gold:0,items:[]};return;}
        return original.apply(this,arguments);
    };});
    var end=BattleManager.endBattle;
    BattleManager.endBattle=function(result){if(active()){session.finished=true;last={name:session.profile.name,result:result,snapshot:snapshot()};}return end.apply(this,arguments);};
    // Guard before native save paths can back up/write slots or their global index.
    ['saveGame','saveGameWithoutRescue','saveGlobalInfo'].forEach(function(key){var original=DataManager[key];DataManager[key]=function(){if(active())return false;return original.apply(this,arguments);};});
    var contents=DataManager.makeSaveContents;
    DataManager.makeSaveContents=function(){if(active())throw Error('E05: sessão descartável; salvamento bloqueado.');return contents.apply(this,arguments);};
    var canSave=Game_System.prototype.isSaveEnabled;
    Game_System.prototype.isSaveEnabled=function(){return !active()&&canSave.apply(this,arguments);};
    ['setupNewGame','extractSaveContents'].forEach(function(key){var original=DataManager[key];DataManager[key]=function(){clear();return original.apply(this,arguments);};});
    var titleStart=Scene_Title.prototype.start;
    Scene_Title.prototype.start=function(){clear();return titleStart.apply(this,arguments);};
    var mapStart=Scene_Map.prototype.start;
    Scene_Map.prototype.start=function(){
        mapStart.apply(this,arguments);
        if(!active())return;
        if(session.ready){session.ready=false;BattleManager.setup(2,false,false);SceneManager.push(Scene_Battle);}
        else if(session.finished){session.finished=false;SceneManager.goto(Selection);}
    };
    function Choices(){this.initialize.apply(this,arguments);}
    Choices.prototype=Object.create(Window_Command.prototype);Choices.prototype.constructor=Choices;
    Choices.prototype.windowWidth=function(){return Graphics.boxWidth-32;};
    Choices.prototype.numVisibleRows=function(){return 5;};
    Choices.prototype.makeCommandList=function(){profiles.forEach(function(p,i){this.addCommand('E05.'+(i+1)+' — '+p.name,'run',true,p.id);},this);this.addCommand('Voltar ao título (descartar sessão)','exit');};
    Choices.prototype.updateHelp=function(){if(this._helpWindow)this._helpWindow.showProfile(this.currentExt());};
    function Info(){this.initialize.apply(this,arguments);}
    Info.prototype=Object.create(Window_Base.prototype);Info.prototype.constructor=Info;
    Info.prototype.showProfile=function(id){
        var p=profiles.filter(function(p){return p.id===id;})[0]||profiles[0],b=p.bonus;
        this.contents.clear();this.contents.fontSize=18;
        var attrs=[15,5,11,5,10,10].map(function(v,i){return v+b[i];});
        var lines=['E05 · comparação experimental — não altera a campanha',
            'Bretã feminina · nível 3 · Adaga equipada (+2 ATQ)',
            'Pontos: 6 = ATQ +3 / MAT +3 em TODOS os cenários.',
            'Conjunto virtual '+p.name+': DEF +'+b[1]+' / MAT +'+b[2]+' / AGI +'+b[4],
            'ATQ '+attrs[0]+' · DEF '+attrs[1]+' · MAT '+attrs[2]+' · MDF '+attrs[3]+' · AGI '+attrs[4]+' · SOR '+attrs[5],
            'Início: Vida 110/110 · Mana 60/60 · Vigor 100/100',
            'Goblin: Vida 30 · ATQ 7 · DEF 3 · MDF 3 · AGI 10',
            'Conjunto agregado; sem peças/visual novos. Saves bloqueados.',
            'Vitória: escolher/repetir. Derrota: título e mesmo acesso.',
            last?'Último: '+last.name+' · '+(last.result===0?'vitória':last.result===2?'derrota':'interrompido'):'Setas / Enter, clique ou toque para iniciar.'];
        lines.forEach(function(s,i){this.contents.drawText(s,0,i*26,this.contentsWidth(),26);},this);
    };
    function Selection(){this.initialize.apply(this,arguments);}
    Selection.prototype=Object.create(Scene_MenuBase.prototype);Selection.prototype.constructor=Selection;
    Selection.prototype.create=function(){
        Scene_MenuBase.prototype.create.call(this);
        var info=new Info(16,12,Graphics.boxWidth-32,296),choices=new Choices(16,320);
        choices.setHelpWindow(info);choices.setHandler('run',function(){start(choices.currentExt());});
        choices.setHandler('exit',function(){ArenaBalanceLab.leave();});choices.setHandler('cancel',function(){ArenaBalanceLab.leave();});
        choices.deactivate(); // A victory/message confirmation cannot also start a new comparison.
        this.addWindow(info);this.addWindow(choices);this._e05Choices=choices;this._e05Info=info;this._e05Armed=false;
    };
    Selection.prototype.update=function(){
        Scene_MenuBase.prototype.update.call(this);
        if(!this._e05Armed&&!Input.isPressed('ok')&&!Input.isPressed('cancel')&&!TouchInput.isPressed()){
            this._e05Armed=true;this._e05Choices.activate();
        }
    };
    ArenaBalanceLab={active:active,snapshot:snapshot,start:start,open:function(){SceneManager.push(Selection);},leave:function(){clear();SceneManager.goto(Scene_Title);}};
})();
