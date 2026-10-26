// Publish only browser runtime files. Python, exports and development caches stay local.
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),output=path.join(root,'dist','web');
const runtimeFiles=[
 'style.css','app.js','astro.js','universe.js','space-renderer.js','mp4.js',
 'immersive.js','i18n.js','galaxy.js','star-chart.js','web-export.js',
 'vendor/astronomy.js','data/stars.js','data/stars3d.js','data/star-chart.json',
 'LICENSE','LICENSING.md','THIRD_PARTY_NOTICES.md','data/D3-CELESTIAL-LICENSE.txt',
 'data/HYG-LICENSE.md','data/sky/README.md',
 ...[4,8,16].flatMap(size=>['px','nx','py','ny','pz','nz'].map(face=>`data/sky/milkyway-${size}k-${face}.jpg`))
];
function hashFile(file){return crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,16);}
function buildWeb(){
 // Validate inputs before replacing the previous web-only artifact.
 for(const file of ['index.html',...runtimeFiles])if(!fs.statSync(path.join(root,file)).isFile())throw Error(`Missing runtime file: ${file}`);
 const allowed=new Set(runtimeFiles);
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 html=html.replace(/((?:src|href)=")([^"?]+\.(?:js|css))"/g,(_,prefix,file)=>{
  if(!allowed.has(file))throw Error(`Unlisted browser asset: ${file}`);
  return `${prefix}${file}?v=${hashFile(file)}"`;
 });
 if(/STARSKY_SERVICE\s*=|<base\b/i.test(html))throw Error('Web entry must not contain a local service token or base-URL override');
 const version=fs.readFileSync(path.join(root,'i18n.js'),'utf8').match(/\bversion:\s*['"](\d+\.\d+\.\d+)['"]/)?.[1];
 if(!version)throw Error('Missing application version in i18n.js');
 fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
 for(const file of runtimeFiles){const target=path.join(output,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);}
 fs.writeFileSync(path.join(output,'index.html'),html);
 fs.writeFileSync(path.join(output,'.nojekyll'),'');
 fs.writeFileSync(path.join(output,'version.json'),JSON.stringify({version})+'\n');
 const bytes=runtimeFiles.reduce((total,file)=>total+fs.statSync(path.join(output,file)).size,Buffer.byteLength(html));
 console.log(`Built StarSky ${version}: ${runtimeFiles.length+3} files, ${(bytes/1024/1024).toFixed(1)} MiB in dist/web`);
 return {output,version,bytes};
}
if(require.main===module)buildWeb();
module.exports={buildWeb,root,output,runtimeFiles,hashFile};
