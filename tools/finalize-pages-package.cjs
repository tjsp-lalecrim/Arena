// Verify the selected package against its fixed manifest. The RC1 compatibility
// conversion is confined to generated output; the source checkout stays intact.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const policies = require('./pages-package-policy.json');

const source = path.resolve(process.argv[2]);
const pkg = path.resolve(process.argv[3]);
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: source, encoding: 'utf8'}).trim();
const policy = policies.find(entry => entry.sourceCommit === sourceCommit);
assert(policy, 'Source needs its own explicit byte/manifest approval: ' + sourceCommit);
assert(pkg.startsWith(path.join(source, 'dist', 'web') + path.sep), 'Only generated package output may be normalized');

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const crlf = text => text.replace(/\r?\n/g, '\r\n');
const recipeFile = 'tools/web-package-allowlist.json';
const manifestPath = path.join(pkg, 'package-manifest.json');
let manifestBytes = fs.readFileSync(manifestPath);
const manifest = JSON.parse(manifestBytes);

assert.equal(manifest.sourceCommit, sourceCommit);
assert.equal(manifest.testVersion, policy.testVersion);
assert.equal(manifest.namespace, 'arena:m01:save-v1');

if (policy.crlfFiles.length > 0) {
    const allowed = new Set(manifest.files.map(file => file.path));
    for (const file of policy.crlfFiles) {
        if (file === recipeFile) {
            const recipe = fs.readFileSync(path.join(source, file), 'utf8');
            manifest.recipeSha256 = hash(Buffer.from(crlf(recipe)));
            continue;
        }
        assert(allowed.has(file) && !path.isAbsolute(file) && !file.split('/').includes('..'));
        const target = path.resolve(pkg, file);
        assert(target.startsWith(pkg + path.sep));
        const text = new TextDecoder('utf-8', {fatal: true}).decode(fs.readFileSync(target));
        fs.writeFileSync(target, crlf(text));
    }
    manifest.files = manifest.files.map(({path: file}) => {
        const bytes = fs.readFileSync(path.join(pkg, file));
        return {path: file, bytes: bytes.length, sha256: hash(bytes)};
    });
    manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
    assert.equal(hash(manifestBytes), policy.manifestSha256, 'Normalized package differs from the approved manifest');
    fs.writeFileSync(manifestPath, manifestBytes);
} else {
    assert.equal(hash(manifestBytes), policy.manifestSha256, 'Package differs from the approved manifest');
}
console.log('Approved manifest matched for ' + sourceCommit + ': ' + policy.manifestSha256);
