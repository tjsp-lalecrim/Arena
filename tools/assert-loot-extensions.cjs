const assert=require('node:assert/strict');
module.exports=function normalize(file,text){
 if(file==='data/Weapons.json'||file==='data/Armors.json'){
  const rows=JSON.parse(text);if(rows.length>3){assert.equal(rows.length,5);for(let n=1;n<=2;n++){const expected=JSON.parse(JSON.stringify(rows[n]));expected.id=n+2;expected.name+=' rara';expected.params[file.includes('Weapons')?2:3]+=1;expected.description+=' Peça rara: +1 adicional de '+(file.includes('Weapons')?'Força':'Resistência')+' (provisório).';expected.note+='\n<ArenaRare>\nM01-13: raridade adaptada, +1 provisório; não é valor transcrito do original.';assert.deepEqual(rows[n+2],expected);}}return JSON.stringify(rows.slice(0,3));
 }
 if(file==='js/plugins/Arena_Persistence.js'){const addition="        sourceStatus: function(sourceId) {\n            var s = source(state(), sourceId);\n            return { active: s.active, questId: s.config.questId, itemId: s.config.itemId,\n                missing: s.active ? Math.max(0, s.config.quantity - $gameParty.numItems($dataItems[s.config.itemId])) : 0 };\n        },\n";if(text.includes('        sourceStatus:'))assert(text.includes(addition));return text.replace(addition,'');}
 return text;
};
