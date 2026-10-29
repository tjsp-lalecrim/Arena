// S06: reuse S05 snapshots; arithmetic only, no runtime/save modifications.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',p),'utf8'));
const prior=read('doc/evidencias/m01-20-conjunto-equipamentos/simulacao.json');
const enemies=read('data/Enemies.json');
// Full-set totals excluding common ATQ+2 weapon. Equal nominal net sum, not equal utility.
const profiles={light:[0,6,0,0,2,0],heavy:[0,8,0,0,0,0],magic:[0,4,4,0,0,0],hybrid:[0,5,2,0,1,0],heavyPenaltySensitivity:[0,10,0,0,-2,0]};
for(const p of Object.values(profiles))assert.equal(p.reduce((a,b)=>a+b,0),8);
const raw=(p,x,y,heavy=false)=>p*x*Math.max(.2,8/(8+Math.max(0,y)*(heavy?.75:1)));
const damage=(...args)=>Math.max(1,Math.round(raw(...args)));
function initiative(agi,eagi){let w=0,t=0,n=0;for(let i=0;i<Math.floor(5+agi/4);i++)for(let j=0;j<Math.floor(5+eagi/4);j++){n++;w+=Number(agi+i>eagi+j);t+=Number(agi+i===eagi+j);}return{strictlyFaster:w/n,ties:t/n};}
const refs=[1,3,5].map(l=>prior.rows.find(r=>r.level===l&&r.set==='partial'&&(l===1||r.build==='hybrid')));
// Ensure this comparison uses the same damage and initiative as S05 for all controls.
for(const r of refs)for(let i=0;i<2;i++){
  const e=enemies[i+1],t=r.targets[i];
  assert.equal(damage(1.6,r.attrs[0],e.params[3],true),t.heavy);
  assert.equal(damage(3,r.attrs[2],e.params[5]),t.fire);
  assert.equal(damage(1,e.params[2],r.attrs[1]),t.received);
  assert.deepEqual(initiative(r.attrs[4],e.params[6]),t.initiative);
}
function row(ref,profile){
  const attrs=ref.attrs.map((v,i)=>v-prior.totals.partial[i]+profiles[profile][i]+(i===0?2:0));
  return{level:ref.level,spent:ref.spent,profile,attrs,cure:25+attrs[2],targets:[1,2].map(id=>{const e=enemies[id];return{enemy:e.name,attack:damage(1,attrs[0],e.params[3]),light:damage(1.25,attrs[0],e.params[3]),heavy:damage(1.6,attrs[0],e.params[3],true),fire:damage(3,attrs[2],e.params[5]),receivedRaw:raw(1,e.params[2],attrs[1]),received:damage(1,e.params[2],attrs[1]),initiative:initiative(attrs[4],e.params[6])};})};
}
const rows=refs.flatMap(r=>Object.keys(profiles).filter(p=>p!=='heavyPenaltySensitivity').map(p=>row(r,p)));
const sensitivity=[row(refs[0],'heavyPenaltySensitivity'),row(refs[2],'heavyPenaltySensitivity')];
const saturation=Object.keys(profiles).map(profile=>({profile,agiBeforeGear:18,agi:18+profiles[profile][4],initiativeGoblin:initiative(18+profiles[profile][4],enemies[2].params[6])}));
const result={study:'S06 - unapproved roles, nominal budget8 + common weaponATQ2; no MDF/SOR/percent compensation',attributeOrder:prior.attributeOrder,profiles,rows,sensitivity,saturation};
// Compact evidence: one state per line; JSON data stays machine-readable.
console.log('{\n'+Object.entries(result).map(([k,v])=>JSON.stringify(k)+':'+(Array.isArray(v)?'[\n'+v.map(x=>JSON.stringify(x)).join(',\n')+'\n]':JSON.stringify(v))).join(',\n')+'\n}');
