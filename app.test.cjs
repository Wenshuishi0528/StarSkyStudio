// Exercise app control/render logic without controlling a browser.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8'),elements={};
function context(){return new Proxy({image:null,strokes:0,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(im){this.image=im;},clearRect(){this.strokes=0;},stroke(){this.strokes++;},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:60})},{get(t,k){return k in t?t[k]:(()=>{});}});}
function element(id,tag='',value=''){const el={id,tagName:tag.toUpperCase(),value,checked:false,style:{},listeners:{},classList:{toggle(){}},textContent:'',width:1280,height:720,clientWidth:1000,checkValidity(){return true;},reportValidity(){},addEventListener(k,fn){this.listeners[k]=fn;},getContext(){return this.ctx??=context();},setPointerCapture(){},focus(){}};return el;}
for(const m of html.matchAll(/<(\w+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const [,tag,attrs,id]=m;elements[id]=element(id,tag,attrs.match(/\bvalue="([^"]*)"/)?.[1]||'');elements[id].type=attrs.match(/\btype="([^"]*)"/)?.[1];elements[id].checked=/\bchecked\b/.test(attrs);}
for(const m of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const opts=[...m[2].matchAll(/<option value="([^"]+)"([^>]*)>/g)];elements[m[1]].value=(opts.find(o=>o[2].includes('selected'))||opts[0])[1];}
elements.controls.querySelectorAll=()=>Object.values(elements).filter(e=>['INPUT','SELECT'].includes(e.tagName));
const sandbox={console,performance,Math,Date,DOMException,Uint8ClampedArray,setTimeout,clearTimeout,requestAnimationFrame(){},document:{getElementById:id=>elements[id],createElement:tag=>element('',tag),addEventListener(){}},window:{STARSKY_SERVICE:{available:true},addEventListener(){}}};
const preferenceStore=new Map();sandbox.window.localStorage={getItem:k=>preferenceStore.get(k)||null,setItem:(k,v)=>preferenceStore.set(k,v)};
sandbox.globalThis=sandbox;sandbox.window.STAR_CATALOG=[];
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/data/stars.js','utf8'),sandbox);sandbox.STAR_CATALOG=sandbox.window.STAR_CATALOG;
vm.runInContext(fs.readFileSync(__dirname+'/astro.js','utf8'),sandbox);
for(const file of ['vendor/astronomy.js','data/stars3d.js','universe.js','space-renderer.js','immersive.js']){vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox);if(file==='vendor/astronomy.js')sandbox.Astronomy=sandbox.window.Astronomy;}
let languageChanged;
sandbox.StarSkyI18n={language:'zh',init(){},onChange(fn){languageChanged=fn;},t(key,params={}){const en={'太阳':'Sun','光年':'ly','已对准 {name} · 距离 {distance}':'Aimed at {name} · Distance {distance}'};return (this.language==='en'?(en[key]??key):key).replace(/\{(\w+)\}/g,(_,k)=>params[k]??'');}};
for(const file of ['galaxy.js','star-chart.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox);
sandbox.GalaxyBackground=sandbox.window.GalaxyBackground;
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),sandbox);
const run=code=>vm.runInContext(code,sandbox);
assert.equal(run('stars.length>0'),true);
assert.equal(elements.quality.value,'4k');assert.equal(elements.magnitude.value,'8.5');assert.equal(elements.aspect.value,'photo');assert.equal(elements.meteors.value,'5');assert.equal(elements.codec.value,'h264');
assert.equal(elements.sky.width,3840);assert.equal(elements.sky.height,2880);
const savedDefault=preferenceStore.get('starsky.preferences.v1');
elements.quality.value='standard';elements.codec.value='hevc';run('restorePreferences()');
assert.equal(elements.quality.value,'4k');assert.equal(elements.codec.value,'h264');
run('cam=A.camera(44,55,12);syncView()');
const savedView=JSON.parse(preferenceStore.get('starsky.preferences.v1'));assert.equal(savedView.fields.az,'44.0');
elements.az.value='10';run('restorePreferences();changed({view:true})');assert.ok(Math.abs(run('A.cameraAngles(cam).az')-44)<1e-8);
preferenceStore.set('starsky.preferences.v1','{broken');assert.equal(run('restorePreferences()'),false);
preferenceStore.set('starsky.preferences.v1',savedDefault);run('restorePreferences();changed({view:true})');
const setItem=sandbox.window.localStorage.setItem;sandbox.window.localStorage.setItem=()=>{throw Error('blocked');};run('savePreferences()');assert.match(elements.settingsMemory.textContent,/未允许/);sandbox.window.localStorage.setItem=setItem;
console.log('PASS: requested defaults, preference round trip, camera restoration, corrupt storage and blocked storage.');
elements.quality.value='standard';elements.quality.listeners.change();

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


// Fullscreen projection must preserve the export frustum for every aspect.
const {geometry}=require('./immersive.js'),A=require('./astro.js');
for(const [sw,sh] of [[1920,1080],[1440,900],[390,844]])for(const [ow,oh] of [[1920,1080],[1080,1920],[1440,1080]]){
 const g=geometry(sw,sh,ow,oh,92),camera=A.camera(20,40);
 assert.ok(g.frame.x>=0&&g.frame.y>=0);assert.ok(Math.abs(g.frame.width/g.frame.height-ow/oh)<1e-12);
 for(const v of [camera.forward,A.camera(25,45).forward,A.camera(0,30).forward]){
  const p=A.project(v,camera,ow,oh,92),q=A.project(v,camera,g.width,g.height,g.fov);
  assert.ok(Math.abs(q[0]-g.renderFrame.x-p[0])<1e-8);assert.ok(Math.abs(q[1]-g.renderFrame.y-p[1])<1e-8);
 }
}
// Real app renderer swaps preview buffers only within a frame, then restores export state.
elements.workspace.clientWidth=1440;elements.workspace.clientHeight=900;
elements.workspace.classList.toggle=(name,on)=>{elements.workspace[name]=on;};
elements.transport.contains=el=>el===elements.play;
elements.immersiveSky.focus=()=>{sandbox.document.activeElement=elements.immersiveSky;};
elements.frameToggle.setAttribute=()=>{};
const outputBefore=run('JSON.stringify([W,H,settings.fov,canvas.width,canvas.height,elapsed,cam])');
sandbox.document.fullscreenElement=elements.workspace;run('onImmersiveChange();render()');
assert.equal(elements.immersiveSky.width,1440);assert.equal(elements.immersiveSky.height,900);
assert.equal(run('JSON.stringify([W,H,settings.fov,canvas.width,canvas.height,elapsed,cam])'),outputBefore);
assert.equal(elements.workspace['controls-visible'],false);
let hide;const realTimer=sandbox.setTimeout;sandbox.setTimeout=fn=>{hide=fn;return 1;};sandbox.clearTimeout=()=>{};
run('revealControls();scheduleHideControls()');assert.equal(elements.workspace['controls-visible'],true);hide();assert.equal(elements.workspace['controls-visible'],false);
run('revealControls();controlsHeld=true;scheduleHideControls()');hide();assert.equal(elements.workspace['controls-visible'],true);
run('controlsHeld=false;controlsHovered=true;scheduleHideControls()');hide();assert.equal(elements.workspace['controls-visible'],true);
sandbox.document.activeElement=elements.play;
run('controlsHovered=false;keyboardControls=false;scheduleHideControls()');hide();assert.equal(elements.workspace['controls-visible'],false,'pointer-focused play must not pin controls');
run('revealControls();keyboardControls=true');sandbox.document.activeElement=elements.play;run('scheduleHideControls()');hide();assert.equal(elements.workspace['controls-visible'],true);
elements.frameToggle.onclick();assert.equal(elements.exportFrame.hidden,true);elements.frameToggle.onclick();assert.equal(elements.exportFrame.hidden,false);
sandbox.document.fullscreenElement=null;run('onImmersiveChange();render()');assert.equal(run('JSON.stringify([W,H,settings.fov,canvas.width,canvas.height,elapsed,cam])'),outputBefore);
sandbox.setTimeout=realTimer;sandbox.clearTimeout=clearTimeout;
console.log('PASS: fullscreen fills viewport, projection matches export, output state restored, overlay auto-hides and respects drag/hover/keyboard, frame toggles, exit restores editor.');

// Old checkbox preferences migrate; new chart/grid controls round trip unchanged.
const oldPreferences=JSON.parse(savedDefault);oldPreferences.fields.grid=true;
preferenceStore.set('starsky.preferences.v1',JSON.stringify(oldPreferences));run('restorePreferences()');assert.equal(elements.grid.value,'horizontal');
elements.grid.value='equatorial';elements.chartScope.value='all';elements.chartBounds.checked=true;run('savePreferences()');
elements.grid.value='off';elements.chartScope.value='major';elements.chartBounds.checked=false;run('restorePreferences()');
assert.equal(elements.grid.value,'equatorial');assert.equal(elements.chartScope.value,'all');assert.equal(elements.chartBounds.checked,true);
// A native 4K export requests the output dimensions, while preview uses display pixels.
elements.lat.value='46.05';elements.aspect.value='photo';elements.quality.value='4k';elements.spaceMode.value='sky';run('changed({reset:false})');
run('galaxy.draw=(ctx,options)=>{globalThis.lastGalaxyOptions=options;return true;};settings.backgroundStyle="milky16k";renderScene()');
assert.equal(sandbox.lastGalaxyOptions.width,1000);assert.equal(sandbox.lastGalaxyOptions.height,750);
run('fullResolution=true;renderScene();fullResolution=false');assert.equal(sandbox.lastGalaxyOptions.width,3840);assert.equal(sandbox.lastGalaxyOptions.height,2880);
const plainCount=run('stars.length');run('settings.backgroundStyle="procedural";renderScene()');assert.equal(run('stars.length'),plainCount);
// A GPU failure may fall back in preview, but must stop a full-resolution output.
run('settings.backgroundStyle="milky16k";galaxy.draw=()=>false;fullResolution=true');assert.throws(()=>run('renderScene()'),/高清银河未就绪/);run('fullResolution=false;settings.backgroundStyle="procedural"');
// Chart labels use live HYG positions in space and are hidden by clean-export selection.
sandbox.chartData=JSON.parse(fs.readFileSync(__dirname+'/data/star-chart.json','utf8'));run('chart.setData(chartData);settings.chartEnabled=true;settings.chartStars=true;settings.chartNames=true;settings.chartLines=true;settings.chartBounds=true;renderScene()');
assert.ok(run('chart.stats.labels')>0);assert.ok(run('chart.stats.segments')>0);
run('settings.spaceMode="space";renderScene()');assert.equal(run('chart.stats.segments'),0);
run('settings.spaceMode="sky";settings.chartEnabled=false;renderScene()');
console.log('PASS: legacy grid migration, chart preference round trip, native 4K background dimensions, preview sizing, GPU export failure and chart mode restrictions.');

// Focal-length controls use the existing framing handlers and preserve the playhead.
elements.lat.value='46.05';elements.quality.value='standard';elements.aspect.value='photo';elements.backgroundStyle.value='procedural';elements.chartEnabled.checked=false;run('changed({reset:false});elapsed=17.25');
for(const [mm,horizontalDegrees] of [['14',104.25003269780359],['24',73.73979529168804],['48',41.11209043916693],['121',16.92257628514273]]){
 elements.focalPreset.value=mm;elements.focalPreset.listeners.change();
 assert.ok(Math.abs(run('settings.fov')-horizontalDegrees)<1e-10,`full-frame horizontal angle for ${mm} mm`);
 assert.equal(run('settings.focalPreset'),mm);assert.equal(elements.customFocalField.hidden,true);assert.equal(elements.customFocal.disabled,true);
 assert.equal(run('elapsed'),17.25,'changing lenses preserves the playhead');
}
elements.focalPreset.value='custom';elements.customFocal.value='85';elements.focalPreset.listeners.change();
assert.equal(elements.customFocalField.hidden,false);assert.equal(elements.customFocal.disabled,false);assert.ok(Math.abs(run('settings.fov')-23.913168486298265)<1e-10);
const savedLens=preferenceStore.get('starsky.preferences.v1');
let prevented=0;elements.sky.listeners.wheel({deltaY:100,preventDefault(){prevented++;}});
const firstZoom=run('settings.fov');assert.ok(firstZoom>23.9);assert.equal(elements.focalPreset.value,'free');assert.equal(run('settings.focalPreset'),'free');assert.equal(elements.customFocalField.hidden,true);
elements.sky.listeners.wheel({deltaY:100,preventDefault(){prevented++;}});assert.ok(run('settings.fov')>firstZoom,'scroll continues after leaving the lens preset');assert.equal(prevented,2);
// Small wheel deltas must survive at telephoto angles rather than rounding to 0.1°.
for(const narrowFov of [16.9,1.0312961868398636]){
 sandbox.narrowFov=narrowFov;run('settings.fov=narrowFov;syncView()');
 elements.sky.listeners.wheel({deltaY:1,preventDefault(){}});
 const zoomed=run('settings.fov');assert.ok(zoomed>narrowFov,`fine scrolling changes ${narrowFov}°`);assert.ok(zoomed-narrowFov<0.1,'fine adjustment retains sub-tenth-degree precision');
 elements.sky.listeners.wheel({deltaY:1,preventDefault(){}});assert.ok(run('settings.fov')>zoomed,'successive fine scrolling keeps changing the view');
}
elements.customFocal.value='24';preferenceStore.set('starsky.preferences.v1',savedLens);run('restorePreferences();changed({reset:false,view:true})');
assert.equal(elements.focalPreset.value,'custom');assert.equal(Number(elements.customFocal.value),85);assert.equal(elements.customFocalField.hidden,false);assert.ok(Math.abs(run('settings.fov')-23.913168486298265)<1e-10);
console.log('PASS: four lens angles, custom 85 mm, continuous wheel adjustment, preserved playhead and restored lens settings.');

// Language buttons are outside the fieldset, so they need explicit export locking.
run('lock(true)');for(const id of ['languageZh','languageEn','languageRu'])assert.equal(elements[id].disabled,true,id);
run('lock(false)');for(const id of ['languageZh','languageEn','languageRu'])assert.equal(elements[id].disabled,false,id);

// Cached messages must recompute translated parameters without mutating sky state.
elements.destination.value='Sun';elements.aimTarget.onclick();
assert.match(elements.status.textContent,/太阳/);
const beforeLanguage=run('JSON.stringify([settings,elapsed,cam,space.position,playing])');
sandbox.StarSkyI18n.language='en';languageChanged();assert.match(elements.status.textContent,/^Aimed at Sun · Distance /);assert.doesNotMatch(elements.status.textContent,/太阳/);
assert.equal(run('JSON.stringify([settings,elapsed,cam,space.position,playing])'),beforeLanguage);
sandbox.StarSkyI18n.language='zh';languageChanged();assert.match(elements.status.textContent,/太阳/);
console.log('PASS: export locks all language buttons; cached dynamic parameters retranslate without resetting sky state.');

// A background animation tick must not race the offline export render loop.
let gpuCalls=0,scheduledFrames=0;
const originalRAF=sandbox.requestAnimationFrame,originalGalaxyDraw=run('galaxy.draw');
sandbox.requestAnimationFrame=()=>{scheduledFrames++;};sandbox.failGpu=()=>{gpuCalls++;throw Error('GPU unavailable');};
run('galaxy.draw=failGpu;settings.backgroundStyle="milky16k";recording={offline:true};dirty=true;playing=true');
const offlineElapsed=run('elapsed');assert.doesNotThrow(()=>run('frame(performance.now()+1000)'));
assert.equal(gpuCalls,0);assert.equal(scheduledFrames,1);assert.equal(run('elapsed'),offlineElapsed);assert.equal(run('dirty'),true);
sandbox.originalGalaxyDraw=originalGalaxyDraw;run('galaxy.draw=originalGalaxyDraw;settings.backgroundStyle="procedural";recording=null;playing=false');sandbox.requestAnimationFrame=originalRAF;
console.log('PASS: offline export owns rendering; animation ticks neither consume dirty state nor invoke a failed GPU background.');

// Run asynchronous UI cases sequentially: no picker continuation may overlap cancellation.
(async()=>{
 elements.quality.value='1080p';elements.aspect.value='portrait';run('changed({reset:false})');
 elements.lat.value='';let picked=false;
 sandbox.window.showSaveFilePicker=async options=>{picked=true;assert.match(options.suggestedName,/^星野-\d{12}-1080x1920-/);return {name:options.suggestedName};};
 await elements.chooseSave.onclick();assert.ok(picked,'location selection is independent of sky validation');
 sandbox.window.showSaveFilePicker=undefined;
 await elements.chooseSave.onclick();assert.match(elements.saveLocation.textContent,/Chrome/);elements.lat.value='46.05';
 console.log('PASS: 1080P dimensions, timestamped picker, independent location selection, visible unsupported-browser error.');

 let blobs=0;elements.sky.toBlob=()=>{blobs++;};
 run('settings.backgroundStyle="milky16k";settings.chartEnabled=false;galaxy.ready=new Promise(()=>{});recording=null;preparing=false');
 const pending=elements.snapshot.onclick();assert.equal(run('preparing'),true);assert.equal(elements.snapshot.disabled,true);assert.equal(typeof run('cancelPreparation'),'function');
 elements.cancel.onclick();
 let deadline;
 try{await Promise.race([pending,new Promise((_,reject)=>{deadline=setTimeout(()=>reject(Error('Screenshot cancel waited for an unresolved asset')),500);})]);}
 finally{clearTimeout(deadline);}
 assert.equal(blobs,0,'cancelled screenshot must not call toBlob');assert.equal(run('preparing'),false);assert.equal(run('fullResolution'),false);assert.equal(run('cancelPreparation'),null);assert.equal(elements.snapshot.disabled,false);assert.equal(elements.controls.disabled,false);assert.match(elements.status.textContent,/取消/);
 run('settings.backgroundStyle="procedural";galaxy.ready=Promise.resolve(false);preparingCancelled=false');
 console.log('PASS: cancelling a screenshot immediately interrupts pending assets, unlocks controls and never creates an image.');
})().catch(e=>{console.error(e);process.exitCode=1;});
