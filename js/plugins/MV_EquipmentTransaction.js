/*:
 * @plugindesc v0.1.0 Transação reutilizável de equipamento por adaptador.
 * @author Codex
 * @help Sem IDs, banco ou plugins externos. API MVEquipmentTransaction.run(adapter).
 * Adaptador: validate(), capture(), write(), verify(), restore(snapshot).
 */
var MVEquipmentTransaction={run:function(adapter){
    'use strict';
    var reason=adapter.validate();if(reason)return {ok:false,reason:reason};
    var before=adapter.capture();
    try{adapter.write();if(!adapter.verify())throw Error('Transação não confirmada.');return {ok:true};}
    catch(error){adapter.restore(before);return {ok:false,reason:'A troca foi cancelada e o estado anterior restaurado.',error:String(error.message||error)};}
}};
