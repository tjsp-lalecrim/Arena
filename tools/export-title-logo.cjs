// Render the self-contained editable SVG, no fonts, AI text or reference bitmaps.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright'),R=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1000,height:620},deviceScaleFactor:2});
 const svg=fs.readFileSync(path.join(R,'art/masters/ref16-logo-v01/title-logo-v01.svg'),'utf8');
 await p.setContent('<html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body>'+svg+'</body></html>');
 fs.mkdirSync(path.join(R,'img/titles2'),{recursive:true});await p.locator('svg').screenshot({path:path.join(R,'img/titles2/Arena_logo_v01.png'),omitBackground:true});
 await p.addStyleTag({content:'body{background:repeating-conic-gradient(#d6d5d1 0% 25%,#f0efea 0% 50%) 0/24px 24px}'});
 fs.mkdirSync(path.join(R,'doc/evidencias/ref16-logo-v01'),{recursive:true});await p.locator('svg').screenshot({path:path.join(R,'doc/evidencias/ref16-logo-v01/transparencia.png')});
 console.log('Exported RGBA2000x1240 + checkerboard review only');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
