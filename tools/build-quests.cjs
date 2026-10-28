// Map event integration only; preserves map geometry, IDs and enemy definitions.
const fs=require('node:fs'),m=JSON.parse(fs.readFileSync('data/Map008.json','utf8')),d=JSON.parse(fs.readFileSync('data/ArenaDungeon.json','utf8')),q=JSON.parse(fs.readFileSync('data/ArenaQuests.json','utf8'));
const key=m.events[d.keyEvent],page=key.pages[0];page.list=[{code:355,indent:0,parameters:['ArenaQuests.takeKey();']},{code:0,indent:0,parameters:[]}];
const hidden=JSON.parse(JSON.stringify(page));hidden.conditions.selfSwitchValid=true;hidden.conditions.selfSwitchCh='A';hidden.image.characterName='';hidden.image.tileId=0;hidden.list=[{code:0,indent:0,parameters:[]}];key.pages=[page,hidden];
m.events[d.gateEvent].pages[0].list=[{code:355,indent:0,parameters:['ArenaQuests.reachGate();']},{code:0,indent:0,parameters:[]}];
// The doorway is three tiles wide. Append contacts without renumbering source IDs.
for(let dy=0;dy<q.gateDepth;dy++)for(let dx=-q.gateHalfWidth;dx<=q.gateHalfWidth;dx++){
 if(dx===0&&dy===0)continue;
 const name='Shift Gate / contato '+(dy===0?(dx<0?'oeste':'leste'):dx+':'+dy);
 let e=m.events.find(e=>e&&e.name===name);
 if(!e){e=JSON.parse(JSON.stringify(m.events[d.gateEvent]));e.id=m.events.length;e.name=name;m.events.push(e);}
 e.note='ArenaQuest:gate-contact';e.x=d.gateApproach[0]+dx;e.y=d.gateApproach[1]+dy;e.pages=JSON.parse(JSON.stringify(m.events[d.gateEvent].pages));
}
fs.writeFileSync('data/Map008.json',JSON.stringify(m)+'\n');console.log('Integrated MQ01 key/Gate contact area; existing IDs/tiles preserved');
