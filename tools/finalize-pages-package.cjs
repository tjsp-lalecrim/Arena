// Restore approved RC bytes only in generated output; never touch the source checkout.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const source=path.resolve(process.argv[2]),pkg=path.resolve(process.argv[3]),policy=JSON.parse(fs.readFileSync(path.join(__dirname,'pages-package-policy.json'),'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(cp.execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim(),policy.sourceCommit,'Source needs its own explicit byte/manifest approval');
assert(pkg.startsWith(path.join(source,'dist','web')+path.sep),'Only generated package output may be normalized');
const manifestPath=path.join(pkg,'package-manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
assert.equal(manifest.sourceCommit,policy.sourceCommit);assert.equal(manifest.testVersion,policy.testVersion);assert.equal(manifest.namespace,'arena:m01:save-v1');
const allowed=new Set(manifest.files.map(f=>f.path));
for(const file of policy.crlfFiles.filter(f=>f!=='tools/web-package-allowlist.json')){
 assert(allowed.has(file)&&!path.isAbsolute(file)&&!file.split('/').includes('..'));const target=path.resolve(pkg,file);assert(target.startsWith(pkg+path.sep));
 const text=new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(target));fs.writeFileSync(target,text.replace(/\r?\n/g,'\r\n'));
}
const recipe=fs.readFileSync(path.join(source,'tools/web-package-allowlist.json'),'utf8');manifest.recipeSha256=hash(Buffer.from(recipe.replace(/\r?\n/g,'\r\n')));
manifest.files=manifest.files.map(f=>{const bytes=fs.readFileSync(path.join(pkg,f.path));return{path:f.path,bytes:bytes.length,sha256:hash(bytes)};});
const bytes=JSON.stringify(manifest,null,2)+'\n';assert.equal(hash(bytes),policy.manifestSha256,'Do not upload a package different from the approved RC');
fs.writeFileSync(manifestPath,bytes);console.log('Approved RC manifest/bytes matched: '+policy.manifestSha256);
