// Exercise app control/render logic without controlling a browser.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),elements={};
function context(){return new Proxy({image:null,strokes:0,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(im){this.image=im;},clearRect(){this.strokes=0;},stroke(){this.strokes++;},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:60})},{get(t,k){return k in t?t[k]:(()=>{});}});}
function element(id,tag='',value=''){const el={id,tagName:tag.toUpperCase(),value,checked:false,style:{},listeners:{},classList:{toggle(){}},textContent:'',width:1280,height:720,clientWidth:1000,checkValidity(){return true;},reportValidity(){},addEventListener(k,fn){this.listeners[k]=fn;},getContext(){return this.ctx??=context();},setPointerCapture(){},focus(){}};return el;}
for(const m of html.matchAll(/<(\w+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const [,tag,attrs,id]=m;elements[id]=element(id,tag,attrs.match(/\bvalue="([^"]*)"/)?.[1]||'');elements[id].type=attrs.match(/\btype="([^"]*)"/)?.[1];elements[id].checked=/\bchecked\b/.test(attrs);}
for(const m of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const opts=[...m[2].matchAll(/<option value="([^"]+)"([^>]*)>/g)];elements[m[1]].value=(opts.find(o=>o[2].includes('selected'))||opts[0])[1];}
elements.controls.querySelectorAll=()=>Object.values(elements).filter(e=>['INPUT','SELECT'].includes(e.tagName));
const sandbox={console,performance,Math,Date,Uint8ClampedArray,setTimeout,requestAnimationFrame(){},document:{getElementById:id=>elements[id],createElement:tag=>element('',tag),addEventListener(){}},window:{addEventListener(){}}};
sandbox.globalThis=sandbox;sandbox.window.STAR_CATALOG=[];
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/data/stars.js','utf8'),sandbox);sandbox.STAR_CATALOG=sandbox.window.STAR_CATALOG;
vm.runInContext(fs.readFileSync(__dirname+'/astro.js','utf8'),sandbox);
for(const file of ['vendor/astronomy.js','data/stars3d.js','universe.js','space-renderer.js']){vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox);if(file==='vendor/astronomy.js')sandbox.Astronomy=sandbox.window.Astronomy;}
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),sandbox);
const run=code=>vm.runInContext(code,sandbox);
assert.equal(run('stars.length>0'),true);
// The entire previously hidden hemisphere must render, without the old RGB(3,7,10) mask.
run('cam=A.camera(196.7,-60);syncView();render()');
assert.equal(run('stars.filter(s=>inside(project(s.v))).length>100'),true);
assert.equal(run('(()=>{const d=bgctx.image.data;for(let i=0;i<d.length;i+=4)if(d[i]===3&&d[i+1]===7&&d[i+2]===10)return false;return true;})()'),true);
// Display edits and reorientation retain the playhead; changing the epoch resets it.
run('elapsed=23.5');elements.labels.checked=false;elements.labels.listeners.change();assert.equal(run('elapsed'),23.5);
elements.aspect.value='portrait';elements.aspect.listeners.change();assert.equal(run('elapsed'),23.5);assert.equal(elements.sky.width,720);assert.equal(elements.sky.height,1280);
elements.upright.onclick();assert.equal(run('elapsed'),23.5);
elements.date.value='2026-07-19T22:54:00';elements.date.listeners.change();assert.equal(run('elapsed'),0);
// Actual drag handlers cross the north pole; no angle clamp can hold the view there.
run('cam=A.camera(0,89);syncView()');elements.sky.onpointerdown({isPrimary:true,clientX:0,clientY:0,pointerId:1});elements.sky.onpointermove({clientX:0,clientY:50});elements.sky.onpointerup();
assert.ok(run('cam.forward[1]')<0);assert.equal(run('pointer'),null);
// Fixed trajectory samples match a seek and incremental playback.
run("settings.trail='all';settings.speed=120;render();clearTrails();drawTrails(5)");const seek=run('tc.strokes');
run('clearTrails();for(let t=.1;t<=5.001;t+=.1)drawTrails(t)');assert.equal(run('tc.strokes'),seek);
console.log('PASS: full lower hemisphere rendering, display edits preserve progress, epoch resets progress, portrait dimensions, actual pole-crossing drag, seek/play trail equivalence.');

run('elapsed=12.5');
elements.quality.value='4k';elements.quality.listeners.change();
assert.equal(run('elapsed'),12.5);assert.equal(elements.sky.width,2160);assert.equal(elements.sky.height,3840);
for(const [aspect,w,h] of [['wide',3840,2160],['photo',3840,2880],['portrait',2160,3840]]){
 elements.aspect.value=aspect;elements.aspect.listeners.change();assert.equal(elements.sky.width,w);assert.equal(elements.sky.height,h);
 assert.equal(run('trails.width'),w);assert.equal(run('trails.height'),h);
 run('render()');
}
elements.quality.value='standard';elements.quality.listeners.change();assert.equal(elements.sky.width,720);assert.equal(elements.sky.height,1280);
console.log('PASS: all 4K output dimensions, matching trail buffers, rendering at each aspect, quality switches preserve playhead and return to standard.');

assert.equal(run('exportTimestamp(new Date(2026,8,30,22,27))'), '202609302227');
assert.equal(run('exportTimestamp(new Date(2026,0,2,3,4))'), '202601020304');
console.log('PASS: export filename timestamp uses local date with minute precision and zero padding.');

for(const [aspect,w,h] of [['wide',1920,1080],['photo',1440,1080],['portrait',1080,1920]]){
 elements.quality.value='1080p';elements.aspect.value=aspect;elements.quality.listeners.change();
 assert.equal(elements.sky.width,w);assert.equal(elements.sky.height,h);
 assert.equal(run('trails.width'),w);assert.equal(run('trails.height'),h);
}
// Physical-mode integration: actual UI handlers, not only pure vector helpers.
elements.lat.value='46.05';elements.spaceMode.value='space';elements.spaceMode.listeners.change();
assert.equal(run('settings.spaceMode'),'space');run('render()');
const before=run('space.position.slice()');elements.moveForward.onclick();assert.ok(run('U.norm(U.sub(space.position,'+JSON.stringify(before)+'))')>.9);
elements.destination.value='Saturn';elements.visitTarget.onclick();run('render()');
assert.equal(run('settings.spaceMode'),'space');
assert.ok(run('U.bodyView(space.target("Saturn",settings.start),space.position).phase')<Math.PI/2,'visit starts on illuminated side');
elements.fly.checked=true;elements.fly.listeners.change();
assert.ok(run('U.norm(U.sub(space.observer(settings.start,settings,2,cam),space.observer(settings.start,settings,0,cam)))')>1.9);
elements.returnEarth.onclick();assert.equal(run('settings.spaceMode'),'sky');assert.equal(run('settings.fly'),false);
elements.twinkle.value='1';elements.twinkle.listeners.change();run('render()');
assert.equal(run('settings.twinkle'),1);
console.log('PASS: UI mode switch, spatial translation, sunlit Saturn visit, deterministic fly-through, return to ground, and atmospheric toggle.');
(async()=>{
 elements.lat.value='';let picked=false;
 sandbox.window.showSaveFilePicker=async options=>{picked=true;assert.match(options.suggestedName,/^星野-\d{12}-1080x1920-/);return {name:options.suggestedName};};
 await elements.chooseSave.onclick();assert.ok(picked,'location selection is independent of sky validation');
 sandbox.window.showSaveFilePicker=undefined;
 await elements.chooseSave.onclick();assert.match(elements.saveLocation.textContent,/Chrome/);
 console.log('PASS: 1080P dimensions, timestamped picker, independent location selection, visible unsupported-browser error.');
})().catch(e=>{console.error(e);process.exitCode=1;});
