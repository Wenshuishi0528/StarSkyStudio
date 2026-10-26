'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {buildWeb,root,output,runtimeFiles,hashFile}=require('./scripts/build-web.cjs');
// A previous web build cannot accidentally retain an old export or private file.
fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'stale-export.mp4'),'not a published asset');
const result=buildWeb(),html=fs.readFileSync(path.join(output,'index.html'),'utf8');
const walk=folder=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(folder,entry.name)):[path.relative(output,path.join(folder,entry.name)).split(path.sep).join('/')]);
assert.deepEqual(walk(output).sort(),[...runtimeFiles,'index.html','.nojekyll','version.json'].sort());
assert.ok(result.bytes<1024**3,'Pages artifact must remain below the 1 GiB site limit');
assert.equal(JSON.parse(fs.readFileSync(path.join(output,'version.json'))).version,result.version);
assert.match(fs.readFileSync(path.join(root,'i18n.js'),'utf8'),new RegExp(`version:\\s*['"]${result.version.replaceAll('.','\\.')}['"]`));
assert.doesNotMatch(html,/STARSKY_SERVICE\s*=|127\.0\.0\.1|localhost|<base\b/i);
const references=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>match[1]);
const base=new URL('https://example.github.io/StarSkyStudio/');
for(const ref of references){
 if(/^https?:\/\//.test(ref))continue;
 const url=new URL(ref,base);
 assert.ok(url.pathname.startsWith('/StarSkyStudio/'),`Reference escapes the project subpath: ${ref}`);
 const file=decodeURIComponent(url.pathname.slice('/StarSkyStudio/'.length));
 assert.ok(fs.statSync(path.join(output,file)).isFile(),`Missing published asset: ${ref}`);
 if(/\.(js|css)$/.test(file))assert.equal(url.searchParams.get('v'),hashFile(file),`Stale content hash: ${file}`);
}
const scripts=[...html.matchAll(/<script\b[^>]*src="([^"?]+)(?:\?[^\"]*)?"/g)].map(match=>match[1]);
for(const file of ['astro.js','mp4.js','i18n.js','galaxy.js','star-chart.js','web-export.js']){
 assert.ok(scripts.indexOf(file)>=0&&scripts.indexOf(file)<scripts.indexOf('app.js'),`${file} must load before app.js`);
}
assert.equal(runtimeFiles.filter(file=>file.endsWith('.jpg')).length,18);
for(const file of runtimeFiles)assert.deepEqual(fs.readFileSync(path.join(output,file)),fs.readFileSync(path.join(root,file)),`Modified runtime file: ${file}`);
assert.ok(!walk(output).some(file=>/\.py$|\.test\.cjs$|\.exr$|\.zip$|\.mp4$|(^|\/)\.git(\/|$)|node_modules/.test(file)));
console.log('PASS: strict Pages artifact, stale-output cleanup, project-subpath references, content hashes, script order, source-identical assets and licenses.');
