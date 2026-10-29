// Explicit runtime allowlist; no asset pruning, transforms or deployment.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);
const recipeBytes=fs.readFileSync('tools/web-package-allowlist.json'),recipe=JSON.parse(recipeBytes);
const git=(...args)=>cp.execFileSync('git',args,{encoding:'utf8'}).trim();
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sourceCommit=git('rev-parse','HEAD'),tracked=git('ls-files','-z').split('\0').filter(Boolean);
const selected=new Set(recipe.files);
for(const rule of recipe.trees)for(const file of tracked)if(file.startsWith(rule.path+'/')&&rule.extensions.includes(path.posix.extname(file)))selected.add(file);
const files=[...selected].sort();
assert(/^[a-zA-Z0-9._-]+$/.test(recipe.testVersion));
assert.equal(git('status','--porcelain','--',...files),'','Runtime has uncommitted changes');
for(const file of files){
 assert(tracked.includes(file),'Required file not tracked: '+file);
 assert(fs.lstatSync(file).isFile(),'Not a regular file: '+file);
 assert(!/^(doc|art|tmp|tools|save|\.git)\//i.test(file));
}
const manifest={testVersion:recipe.testVersion,sourceCommit,recipeSha256:sha(recipeBytes),namespace:'arena:m01:save-v1',files:files.map(file=>{const bytes=fs.readFileSync(file);return{path:file,bytes:bytes.length,sha256:sha(bytes)};})};
const plugins=fs.readFileSync('js/plugins.js','utf8'),entries=JSON.parse(plugins.slice(plugins.indexOf('['),plugins.lastIndexOf(']')+1));
assert.equal(entries.find(p=>p.name==='MV_WebStorageNamespace').parameters.Namespace,manifest.namespace);
for(const p of entries)assert(selected.has('js/plugins/'+p.name+'.js'),'Plugin absent: '+p.name);
const dest=path.resolve('dist/web',recipe.testVersion+'-'+sourceCommit.slice(0,7),'Arena');
assert(dest.startsWith(path.resolve('dist/web')+path.sep));
const serialized=JSON.stringify(manifest,null,2)+'\n';
if(fs.existsSync(dest)){
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(dest,path.join(dir,e.name)).split(path.sep).join('/')]);
 assert.deepEqual(walk(dest).sort(),[...files,'package-manifest.json'].sort(),'Output has unexpected/missing files; use a new test version instead of overwriting');
 assert.equal(fs.readFileSync(path.join(dest,'package-manifest.json'),'utf8'),serialized,'Output metadata differs');
 for(const f of manifest.files)assert.equal(sha(fs.readFileSync(path.join(dest,f.path))),f.sha256,'Output differs: '+f.path);
}else{
 fs.mkdirSync(dest,{recursive:true});
 for(const file of files){const target=path.join(dest,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
 fs.writeFileSync(path.join(dest,'package-manifest.json'),serialized);
}
console.log(JSON.stringify({directory:dest,sourceCommit,testVersion:recipe.testVersion,runtimeFiles:files.length,runtimeBytes:manifest.files.reduce((n,f)=>n+f.bytes,0),totalBytes:manifest.files.reduce((n,f)=>n+f.bytes,0)+Buffer.byteLength(serialized),manifestSha256:sha(serialized)},null,2));
