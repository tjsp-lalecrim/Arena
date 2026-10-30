/*:
 * @plugindesc v0.1.0 Sorteio puro de loot por origem, sem estado ou IDs de jogo.
 * @author Codex
 * @help MV_LootRules.roll(table, rng): categorias independentes e no máximo
 * um equipamento por origem. RNG injetável; não concede nem apresenta.
 */
var MVLootRules=(function(){
    'use strict';
    function hit(chance,rng){return chance>0&&rng()<chance;}
    function pick(entries,rng){var sum=entries.reduce(function(s,e){return s+(e.weight||1);},0),point=rng()*sum;for(var i=0;i<entries.length;i++){point-=entries[i].weight||1;if(point<0)return entries[i];}return entries[entries.length-1];}
    function quantity(rule,rng){return rule.min+Math.floor(rng()*(rule.max-rule.min+1));}
    function candidate(rule,category,rng){if(!rule||!hit(rule.chance,rng)||!rule.entries.length)return null;var e=pick(rule.entries,rng);return {kind:e.kind,id:e.id,quantity:quantity(rule,rng),category:category,rare:false};}
    return {roll:function(table,rng){rng=rng||Math.random;var rows=[],candidates=[],selected=null;
        if(table.gold&&hit(table.gold.chance,rng))rows.push({kind:'gold',quantity:quantity(table.gold,rng),category:'gold',rare:false});
        var potion=candidate(table.potions,'potions',rng);if(potion)rows.push(potion);
        if(hit(table.gearChance,rng)){['equipment','weapons'].forEach(function(k){var c=candidate(table[k],k,rng);if(c)candidates.push(c);});if(candidates.length){selected=candidates[Math.floor(rng()*candidates.length)];selected.quantity=1;var rare=table.rare,variant=rare&&rare.variants[selected.kind+':'+selected.id];if(variant&&hit(rare.chance,rng)){selected.kind=variant.kind;selected.id=variant.id;selected.rare=true;}rows.push(selected);}}
        var book=table.rare&&candidate(table.rare.items,'rare',rng);if(book){book.rare=true;rows.push(book);}
        return {rows:rows,candidates:candidates.length,equipment:selected};
    }};
})();
