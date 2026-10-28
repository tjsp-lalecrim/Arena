// Map event integration only; preserves map geometry, IDs and enemy definitions.
const fs=require('node:fs'),m=JSON.parse(fs.readFileSync('data/Map008.json','utf8')),d=JSON.parse(fs.readFileSync('data/ArenaDungeon.json','utf8'));
const key=m.events[d.keyEvent],page=key.pages[0];page.list=[{code:355,indent:0,parameters:['ArenaQuests.takeKey();']},{code:0,indent:0,parameters:[]}];
const hidden=JSON.parse(JSON.stringify(page));hidden.conditions.selfSwitchValid=true;hidden.conditions.selfSwitchCh='A';hidden.image.characterName='';hidden.image.tileId=0;hidden.list=[{code:0,indent:0,parameters:[]}];key.pages=[page,hidden];
m.events[d.gateEvent].pages[0].list=[{code:355,indent:0,parameters:['ArenaQuests.reachGate();']},{code:0,indent:0,parameters:[]}];
fs.writeFileSync('data/Map008.json',JSON.stringify(m)+'\n');console.log('Integrated MQ01 key/gate; geometry and other events preserved');
