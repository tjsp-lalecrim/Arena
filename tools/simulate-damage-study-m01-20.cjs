// Offline arithmetic study only. Does not load plugins, run battles or write game data.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'data',n+'.json'),'utf8'));
const cls=read('Classes')[1],weapons=read('Weapons'),armors=read('Armors'),enemies=read('Enemies'),progress=read('ArenaProgression');
const powers={attack:1,light:1.25,heavy:1.6};
const mitigation=def=>Math.max(0.20,8/(8+Math.max(0,def)));
const current=(atk,def,action)=>Math.round(Math.max(1,atk*(action==='heavy'?3:2)-def));
const proposed=(atk,def,action)=>Math.max(1,Math.round(atk*powers[action]*mitigation(def*(action==='heavy'?0.75:1))));
const scenarios=[{id:'initial',level:1,weapon:1,armor:1},{id:'gear',level:1,weapon:2,armor:2},{id:'levels',level:5,weapon:2,armor:2}];
const rows=[];
for(const s of scenarios){
 const weapon=weapons[s.weapon],armor=armors[s.armor],gain=Math.floor((s.level-1)/2);
 const atk=cls.params[2][s.level]+weapon.params[2],def=cls.params[3][s.level]+armor.params[3],hp=progress.base.hp+(s.level===5?2*progress.increase:0);
 for(const id of [1,2]){
  const e=enemies[id],old={},next={};for(const action of Object.keys(powers)){old[action]=current(atk,e.params[3],action);next[action]=proposed(atk+gain,e.params[3],action);}
  const oldReceived=current(e.params[2],def,'attack'),nextReceived=proposed(e.params[2],def,'attack');
  rows.push({scenario:s.id,level:s.level,weapon:weapon.name,armor:armor.name,hp,atkCurrent:atk,atkProposed:atk+gain,def,enemy:e.name,enemyHp:e.params[0],current:old,recommended:next,successfulAttacksToDefeat:{current:Math.ceil(e.params[0]/old.attack),recommended:Math.ceil(e.params[0]/next.attack)},received:{current:oldReceived,recommended:nextReceived},successfulEnemyHitsToDefeatPlayer:{current:Math.ceil(hp/oldReceived),recommended:Math.ceil(hp/nextReceived)}});
 }
}
console.log(JSON.stringify({runtimeReference:'9fab698',model:'M01-20/S02 - unapproved study',premises:'Breton female, no physical racial bonus; successful non-critical physical hits; variance zero; neutral elements/pdr; no guard/healing/actions/initiative simulated. Gear is reference equipment, not initial campaign grant. Level5 uses approved +10 choices: HP twice, MP once, vigor once; full resources assumed after recovery, not granted by leveling.',proposals:{K:8,minimumArmorFactor:0.20,powers,heavyDefenseFactor:0.75,offensiveGrowth:'floor((level-1)/2) to ATK and MAT, not implemented'},rows},null,2));
