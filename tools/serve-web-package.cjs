// Local review only. Strict case-sensitive paths even on Windows.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(process.argv[2]||'');
const port=Number(process.argv[3]||8771);
const host=process.argv[4]||'127.0.0.1',evaluation=process.argv[5]==='--evaluation';
if(!['127.0.0.1','0.0.0.0'].includes(host))throw Error('Use 127.0.0.1 or explicit 0.0.0.0 for LAN review');
if(!process.argv[2]||port===8765)throw Error('Pass the package Arena directory and a port other than 8765');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'package-manifest.json'),'utf8'));
const allowed=new Set([...manifest.files.map(f=>f.path),'package-manifest.json']);
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.ttf':'font/ttf','.ogg':'audio/ogg','.m4a':'audio/mp4','.mp4':'video/mp4','.webm':'video/webm'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);res.end();return;}
 if(evaluation&&pathname==='/avaliacao/'){
  const bytes=fs.readFileSync(path.join(__dirname,'m01-rc-evaluation.html'));
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);return;
 }
 if(pathname==='/Arena'){res.writeHead(302,{Location:'/Arena/'});res.end();return;}
 const file=pathname==='/Arena/'?'index.html':pathname.startsWith('/Arena/')?pathname.slice(7):'';
 if(!allowed.has(file)){res.writeHead(404);res.end();return;}
 const bytes=fs.readFileSync(path.join(root,file));
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store'});
 res.end(req.method==='HEAD'?undefined:bytes);
});
server.on('error',e=>{console.error(e.message+'; no existing service was stopped');process.exitCode=1;});
server.listen(port,host,()=>console.log('Arena package PID='+process.pid+' ROOT='+root+' BIND='+host+' URL=http://127.0.0.1:'+port+'/Arena/'+(evaluation?' EVALUATION=/avaliacao/':'')));
