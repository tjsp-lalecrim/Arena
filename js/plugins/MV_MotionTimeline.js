/*:
 * @plugindesc v0.1.0 Linha de tempo pura: quadros, durações e pausa no impacto.
 * @author Codex
 * @help Sem parâmetros, IDs, estado de jogo ou dependências. Antes do consumidor.
 * MVMotionTimeline.validate(motion), duration(motion), impactTick(motion),
 * sample(motion,tick), advance(motion,tick,released). Unidade: atualização MV.
 * Frames: {rect:[x,y,w,h],duration:inteiro>0}. loop:boolean, impact:índice|null.
 */
var MVMotionTimeline;
(function(){
    'use strict';
    function validate(m){
        if(!m||!Array.isArray(m.frames)||!m.frames.length)throw Error('Motion requires frames.');
        m.frames.forEach(function(f){if(!f.rect||f.rect.length!==4||f.rect.some(function(n){return !Number.isInteger(n)||n<0;})||f.rect[2]===0||f.rect[3]===0||!Number.isInteger(f.duration)||f.duration<1)throw Error('Invalid motion frame.');});
        if(m.impact!==null&&m.impact!==undefined&&(!Number.isInteger(m.impact)||m.impact<0||m.impact>=m.frames.length||m.loop))throw Error('Invalid impact index.');
        return m;
    }
    function duration(m){return m.frames.reduce(function(n,f){return n+f.duration;},0);}
    function impactTick(m){return m.impact===null||m.impact===undefined?null:m.frames.slice(0,m.impact).reduce(function(n,f){return n+f.duration;},0);}
    function sample(m,tick){
        var total=duration(m),local=m.loop?tick%total:Math.min(tick,total-1),i=0;
        while(i<m.frames.length-1&&local>=m.frames[i].duration){local-=m.frames[i].duration;i++;}
        return {index:i,frame:m.frames[i],total:total,done:!m.loop&&tick>=total};
    }
    function advance(m,tick,released){var impact=impactTick(m);return !released&&impact!==null?Math.min(tick+1,impact):tick+1;}
    MVMotionTimeline={validate:validate,duration:duration,impactTick:impactTick,sample:sample,advance:advance};
})();
