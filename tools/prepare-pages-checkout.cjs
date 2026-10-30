// Reproduce the approved RC's bytes in the disposable Actions checkout only.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]),policy=JSON.parse(fs.readFileSync(path.join(__dirname,'pages-package-policy.json'),'utf8'));
assert.equal(cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),policy.sourceCommit,'Source needs its own explicit byte/manifest approval');
if(process.argv[3]){
 const bytes=fs.readFileSync(path.join(path.resolve(process.argv[3]),'package-manifest.json'));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),policy.manifestSha256,'Do not upload a package different from the approved RC');
 const manifest=JSON.parse(bytes);assert.equal(manifest.sourceCommit,policy.sourceCommit);assert.equal(manifest.testVersion,policy.testVersion);assert.equal(manifest.namespace,'arena:m01:save-v1');
 console.log('Approved RC manifest/bytes matched: '+policy.manifestSha256);
}else{
 for(const file of policy.crlfFiles){
  assert(!path.isAbsolute(file)&&!file.split('/').includes('..'));const target=path.resolve(root,file);assert(target.startsWith(root+path.sep));
  const text=new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(target));fs.writeFileSync(target,text.replace(/\r?\n/g,'\r\n'));
 }
 console.log('Restored approved checkout line endings for '+policy.crlfFiles.length+' paths; source commit unchanged');
}
