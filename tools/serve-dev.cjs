// Development only. Same runtime allowlist as packaging; no deployment changes.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),net=require('node:net'),cp=require('node:child_process'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),HOST='127.0.0.1',PORT=8774,URL_ROOT=`http://${HOST}:${PORT}/`,KIND='arena-dev-server',STATE=path.join(ROOT,'tmp/dev-server.json');
const recipe=require('./web-package-allowlist.json'),types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.ogg':'audio/ogg','.m4a':'audio/mp4','.mp4':'video/mp4','.webm':'video/webm'},hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function allowed(file){return recipe.files.includes(file)||recipe.trees.some(r=>file.startsWith(r.path+'/')&&r.extensions.includes(path.posix.extname(file)));}
function git(args){try{return cp.execFileSync('git',args,{cwd:ROOT,encoding:'utf8',windowsHide:true}).trim();}catch{return 'unknown';}}
function runtimeFiles(){const found=new Set(recipe.files.filter(f=>fs.existsSync(path.join(ROOT,f))));for(const rule of recipe.trees){const walk=d=>{if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()){const rel=path.relative(ROOT,f).split(path.sep).join('/');if(allowed(rel))found.add(rel);}}};walk(path.join(ROOT,rule.path));}return [...found].sort();}
function version(){const files=runtimeFiles(),sum=crypto.createHash('sha256');for(const f of files){sum.update(f+'\0');sum.update(hash(fs.readFileSync(path.join(ROOT,f)))+'\n');}const commit=git(['rev-parse','HEAD']);return {commit,short:commit.slice(0,7),branch:git(['branch','--show-current']),dirty:git(['status','--porcelain']).length>0,fingerprint:sum.digest('hex'),runtimeFiles:files.length};}
function request(method,route,headers={}){return new Promise(resolve=>{const q=http.request(URL_ROOT.slice(0,-1)+route,{method,headers,timeout:2500},r=>{const chunks=[];r.on('data',b=>chunks.push(b));r.on('end',()=>{const body=Buffer.concat(chunks).toString();let json;try{json=JSON.parse(body);}catch{}resolve({status:r.statusCode,headers:r.headers,body,json});});});q.on('timeout',()=>q.destroy());q.on('error',e=>resolve({error:e.code||e.message}));q.end();});}
function listeners(){if(process.platform!=='win32')return [];try{return cp.execFileSync('netstat',['-ano','-p','TCP'],{encoding:'utf8',windowsHide:true}).split(/\r?\n/).filter(l=>new RegExp('(?:127\\.0\\.0\\.1|0\\.0\\.0\\.0):'+PORT+'\\s+.*LISTENING').test(l)).map(l=>{const id=Number(l.trim().split(/\s+/).at(-1));let owner='não identificado';try{owner=cp.execFileSync('tasklist',['/FI','PID eq '+id,'/FO','CSV','/NH'],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','ignore']}).trim();}catch{}return {pid:id,owner};});}catch{return [];}}
async function portOpen(){return new Promise(resolve=>{const s=net.connect({host:HOST,port:PORT});s.once('connect',()=>{s.destroy();resolve(true);});s.once('error',()=>resolve(false));s.setTimeout(1500,()=>{s.destroy();resolve(true);});});}
function isOurs(r){return r.json?.kind===KIND&&r.json?.root===ROOT&&r.json?.protocolVersion===1;}
function occupied(r){console.error(JSON.stringify({message:'Porta 8774 ocupada; nenhum serviço foi encerrado e nenhuma outra porta será escolhida.',url:URL_ROOT,httpServer:r.headers?.server||null,responseKind:r.json?.kind||null,listeners:listeners()},null,2));}
async function main(){const mode=process.argv[2]||'start';if(!['start','status','stop'].includes(mode))throw Error('Use tools/arena-local.cmd [start|status|stop]');
 if(await portOpen()){
  const r=await request('GET','/__arena_dev/status');
  if(!isOurs(r)){occupied(r);process.exitCode=2;return;}
  if(mode!=='stop'){console.log(JSON.stringify({message:'Servidor Arena de desenvolvimento já ativo; reutilizado.',...r.json},null,2));return;}
  let own;try{own=JSON.parse(fs.readFileSync(STATE,'utf8'));}catch{}
  if(!own||own.instance!==r.json.instance||own.pid!==r.json.pid||own.root!==ROOT)throw Error('Identidade local não confere; serviço preservado. Confira status antes de encerrar.');
  const stop=await request('POST','/__arena_dev/stop',{'X-Arena-Stop-Token':own.token});if(stop.status!==200)throw Error('Encerramento recusado; serviço preservado.');console.log('Servidor Arena encerrado por solicitação explícita; dados do navegador preservados.');return;
 }
 if(mode!=='start'){console.log('Nenhum servidor na porta 8774.');return;}
 const instance=crypto.randomBytes(12).toString('hex'),token=crypto.randomBytes(24).toString('hex'),startedAt=new Date().toISOString();let server;
 const identity=()=>({kind:KIND,protocolVersion:1,root:ROOT,url:URL_ROOT,pid:process.pid,instance,startedAt,noStore:true});
 function send(req,res,status,bytes,type='application/json; charset=utf-8',extra={}){bytes=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes||'');res.writeHead(status,{'Cache-Control':'no-store, max-age=0','Pragma':'no-cache','Expires':'0','X-Content-Type-Options':'nosniff','X-Arena-Dev-Server':KIND,'X-Arena-Content-SHA256':hash(bytes),'Content-Type':type,'Content-Length':bytes.length,...extra});res.end(req.method==='HEAD'?undefined:bytes);}
 function close(){server.close(()=>process.exit(0));server.closeIdleConnections?.();}
 server=http.createServer((req,res)=>{try{
  let route;try{route=decodeURIComponent(new URL(req.url,URL_ROOT).pathname);}catch{return send(req,res,400,'Invalid path','text/plain');}
  if(route==='/__arena_dev/stop'){
   if(req.method!=='POST'||req.headers['x-arena-stop-token']!==token)return send(req,res,403,'Forbidden','text/plain');
   send(req,res,200,JSON.stringify({stopped:true}));setImmediate(close);return;
  }
  if(!['GET','HEAD'].includes(req.method))return send(req,res,405,'Method not allowed','text/plain',{'Allow':'GET, HEAD'});
  if(route==='/__arena_dev/status')return send(req,res,200,JSON.stringify(identity()));
  if(route==='/__arena_dev/version.json')return send(req,res,200,JSON.stringify({...identity(),version:version()}));
  const rel=route==='/'?'index.html':route.slice(1),file=path.resolve(ROOT,rel),inside=f=>{const p=path.relative(ROOT,f);return p&&!p.startsWith('..')&&!path.isAbsolute(p);};
  if(!inside(file)||!allowed(rel)||!fs.existsSync(file)||!fs.statSync(file).isFile()||!inside(fs.realpathSync(file)))return send(req,res,404,'Not found','text/plain');
  let bytes=fs.readFileSync(file);
  if(rel==='index.html'){const build=JSON.stringify({...version(),instance,canonicalOrigin:URL_ROOT.slice(0,-1)}).replace(/</g,'\\u003c');bytes=Buffer.from(bytes.toString('utf8').replace('</head>','<script>window.ArenaDevBuild=Object.freeze('+build+');</script>\n    </head>'));}
  // No ETag/Last-Modified and no304 branch: every request receives current bytes.
  send(req,res,200,bytes,types[path.extname(file)]||'application/octet-stream');
 }catch(e){send(req,res,500,JSON.stringify({error:e.message}));}});
 server.on('error',async e=>{if(e.code==='EADDRINUSE')occupied(await request('GET','/__arena_dev/status'));else console.error(e.message);process.exitCode=2;});
 server.listen({host:HOST,port:PORT,exclusive:true},()=>{fs.mkdirSync(path.dirname(STATE),{recursive:true});fs.writeFileSync(STATE,JSON.stringify({...identity(),token},null,2));console.log(JSON.stringify({...identity(),version:version(),stop:'tools\\arena-local.cmd stop'},null,2));});
 process.once('SIGINT',close);process.once('SIGTERM',close);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
