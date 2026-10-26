const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx={};vm.runInNewContext(fs.readFileSync('js/plugins/MV_MotionTimeline.js','utf8'),ctx);const t=ctx.MVMotionTimeline;
const m={frames:[{rect:[0,0,16,20],duration:2},{rect:[16,0,16,20],duration:3},{rect:[32,0,16,20],duration:4},{rect:[48,0,16,20],duration:2}],loop:false,impact:2};
t.validate(m);assert.equal(t.duration(m),11);assert.equal(t.impactTick(m),5);let tick=0;for(let i=0;i<100;i++)tick=t.advance(m,tick,false);assert.equal(tick,5);assert.equal(t.sample(m,tick).index,2);assert.equal(t.sample(m,tick).done,false);
for(let i=0;i<6;i++)tick=t.advance(m,tick,true);assert.equal(tick,11);assert.equal(t.sample(m,tick).done,true);assert.equal(t.sample(m,tick).index,3);assert.equal(t.sample({...m,loop:true,impact:null},12).index,0);
for(const bad of [{frames:[]},{...m,impact:4},{...m,loop:true},{...m,frames:[{rect:[0,0,1,1],duration:0}]}])assert.throws(()=>t.validate(bad));
console.log('PASS reusable alternate4-frame timeline, variable durations, impact hold/release, completion/loop, invalid config; no Arena IDs/engine.');
