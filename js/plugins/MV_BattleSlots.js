/*:
 * @plugindesc v0.1.0 Geometria pura de slots e seleção única, sem IDs de conteúdo.
 * @author Codex
 * @help Sem dependências/parâmetros. API MVBattleSlots.grid/unique/clampRatio.
 */
var MVBattleSlots=(function(){
    'use strict';
    return {
        grid:function(width,count,fixedWidth,gap,minWidth){
            if(!Number.isInteger(count)||count<1||!Number.isFinite(width)||width<=0)throw Error('Slots: dimensões inválidas');
            var w=fixedWidth||Math.floor((width-gap*(count-1))/count);
            if(w<minWidth||w*count+gap*(count-1)>width)throw Error('Slots: configuração não cabe na resolução');
            return Array.from({length:count},function(_,i){return {x:i*(w+gap),width:w};});
        },
        unique:function(candidates){return candidates.length===1?candidates[0]:null;},
        clampRatio:function(current,maximum){return maximum>0?Math.max(0,Math.min(1,current/maximum)):0;}
    };
})();
