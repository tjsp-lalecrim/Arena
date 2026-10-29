// S04: reuses S03 reference stats/allocations; arithmetic only, no game/save writes.
const fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const prior=read('doc/evidencias/m01-20-estudo-atributos/simulacao.json'),base=prior.rows.find(r=>r.build==='baseline').attrs;
const weapons=read('data/Weapons.json'),armors=read('data/Armors.json'),enemies=read('data/Enemies.json');
const gear={basic:[0,0],currentUpgrade:[weapons[2].params[2]-weapons[1].params[2],armors[2].params[3]-armors[1].params[3]],separateScaleProposal:[5-weapons[1].params[2],8-armors[1].params[3]]};
const damage=(p,x,y,heavy=false)=>Math.max(1,Math.round(p*x*Math.max(0.2,8/(8+Math.max(0,y)*(heavy?0.75:1)))));
function initiative(agi,enemyAgi){let faster=0,ties=0,total=0;for(let i=0;i<Math.floor(5+agi/4);i++)for(let j=0;j<Math.floor(5+enemyAgi/4);j++){total++;if(agi+i>enemyAgi+j)faster++;if(agi+i===enemyAgi+j)ties++;}return{strictlyFaster:faster/total,ties:ties/total};}
function row(budget,level,build,equipment,spent){
 const attrs=base.map((v,i)=>v+spent[i]);attrs[0]+=gear[equipment][0];attrs[1]+=gear[equipment][1];
 return{pointsPerLevel:budget,level,build,equipment,totalPoints:spent.reduce((n,v)=>n+v,0),spent,attrs,targets:[1,2].map(id=>{const e=enemies[id];return{enemy:e.name,hp:e.params[0],attack:damage(1,attrs[0],e.params[3]),light:damage(1.25,attrs[0],e.params[3]),heavy:damage(1.6,attrs[0],e.params[3],true),fire:damage(3,attrs[2],e.params[5]),received:damage(1,e.params[2],attrs[1]),defenseFactor:Math.max(0.2,8/(8+attrs[1])),initiative:initiative(attrs[4],e.params[6])};})};
}
const zero=[0,0,0,0,0,0],rows=[row(0,1,'no-points','basic',zero),row(0,1,'no-points','currentUpgrade',zero)];
for(const budget of [1,2,3])for(const level of [3,5])for(const build of ['physical','hybrid']){
 const spent=prior.rows.find(r=>r.level===level&&r.build===build).spent.map(v=>v*budget);
 if(spent.reduce((n,v)=>n+v,0)!==budget*(level-1))throw Error('Budget mismatch');
 for(const equipment of ['basic','currentUpgrade'])rows.push(row(budget,level,build,equipment,spent));
}
const separateEquipmentProposal=[row(0,1,'no-points','separateScaleProposal',zero)];
for(const build of ['physical','hybrid']){const spent=prior.rows.find(r=>r.level===5&&r.build===build).spent.map(v=>3*v);separateEquipmentProposal.push(row(3,5,build,'separateScaleProposal',spent));}
const concentration=[];for(const budget of [1,2,3])for(const [name,index] of [['ATQ',0],['MAT',2],['DEF',1],['AGI',4]]){const spent=zero.slice();spent[index]=4*budget;concentration.push(row(budget,5,'all-'+name,'basic',spent));}
console.log(JSON.stringify({study:'M01-20/S04 - unapproved scale comparison',formula:'S02 proportional only, unapproved; same K8/floor0.20/powers/penetration as S03',premises:'S03 Breton reference with dagger+leather, not campaign starter grant. Successful neutral hits, no variance/critical/guard or battle. Fire learned only as comparison premise. No automatic attribute growth. Resource choices unchanged/equal by level. Initiative scores enumerated, ties separate. Level1 deduplicated across all budgets/builds. Existing upgrade +1ATQ/+3DEF; separate gear-scale proposal +3ATQ/+5DEF relative to basic.',attributeOrder:prior.attributeOrder,rows,separateEquipmentProposal,concentration},null,2));
