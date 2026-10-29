// Isolated arithmetic supplement S03. No engine/plugin execution or game/save writes.
const fs=require('node:fs'),path=require('node:path');
const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'../data',n+'.json'),'utf8'));
const c=read('Classes')[1],w=read('Weapons'),a=read('Armors'),enemies=read('Enemies');
const base=[c.params[2][1]+w[1].params[2],c.params[3][1]+a[1].params[3],c.params[4][1],c.params[5][1],c.params[6][1],c.params[7][1]];
const builds={physical:{3:[1,1,0,0,0,0],5:[2,1,0,0,1,0]},magic:{3:[0,0,1,1,0,0],5:[0,0,2,1,1,0]},hybrid:{3:[1,0,1,0,0,0],5:[1,1,1,1,0,0]}};
const round=x=>Math.max(1,Math.round(x));
const damage=(model,p,x,y,heavy=false)=>{const d=Math.max(0,y)*(heavy?0.75:1);return round(model==='ratio'?p*x*Math.max(0.2,8/(8+d)):Math.max(0.2*p*x,p*x-0.5*d));};
function initiative(agi,enemyAgi){let faster=0,ties=0,total=0;for(let i=0;i<Math.floor(5+agi/4);i++)for(let j=0;j<Math.floor(5+enemyAgi/4);j++){total++;if(agi+i>enemyAgi+j)faster++;if(agi+i===enemyAgi+j)ties++;}return{strictlyFaster:faster/total,ties:ties/total,total};}
function row(name,level,spent,gear=false){
 const budget=level-1;if(spent.reduce((n,x)=>n+x,0)!==budget)throw Error('Different point budget');
 const attrs=base.map((v,i)=>v+spent[i]);if(gear){attrs[0]+=w[2].params[2]-w[1].params[2];attrs[1]+=a[2].params[3]-a[1].params[3];}
 return{build:name,level,budget,spent,gear:gear?'shortsword+mail':'dagger+leather',attrs,
  enemies:[1,2].map(id=>{const e=enemies[id];return{name:e.name,hp:e.params[0],recommended:{attack:damage('ratio',1,attrs[0],e.params[3]),light:damage('ratio',1.25,attrs[0],e.params[3]),heavy:damage('ratio',1.6,attrs[0],e.params[3],true),fire:damage('ratio',3,attrs[2],e.params[5]),received:damage('ratio',1,e.params[2],attrs[1])},alternative:{heavy:damage('subtract',1.6,attrs[0],e.params[3],true),fire:damage('subtract',3,attrs[2],e.params[5])},initiative:initiative(attrs[4],e.params[6])};})};
}
const rows=[row('baseline',1,[0,0,0,0,0,0])];for(const level of [3,5])for(const name of Object.keys(builds))rows.push(row(name,level,builds[name][level]));
rows.push(row('physical-equipment-only-delta',5,builds.physical[5],true));
console.log(JSON.stringify({model:'M01-20/S03 - proposals, not implemented',runtimeReference:'9fab698',attributeOrder:['ATQ','DEF','MAT','MDF','AGI','SOR'],proposal:{pointsPerLevel:1,deltaPerPoint:1,automaticSameAttributeGrowth:0},premises:'Breton female; equal budget 2 at L3 / 4 at L5; all six stats remain selectable but MDF/SOR have content utility gaps. Reference gear is not campaign starter grant. Successful neutral non-critical hits, variance0/no guard; Fire Dart known only as a comparison premise. Resource choices are independent. Initiative enumerates native speed dice, reports ties separately, no tie-break assumption. No battle or balance approval.',rows,luckSensitivity:{scenario:'Enemy3 paralysis25%, enemy SOR5; NOT a current dungeon encounter',initialSor:10,rateAtInitial:0.25*(1+(5-10)*0.001),rateAfterOnePoint:0.25*(1+(5-11)*0.001),rateAfterFourPoints:0.25*(1+(5-14)*0.001)}},null,2));
