// Browser-export orchestration in a VM, without browser automation or an HTTP service.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const avcc=Uint8Array.from([1,100,0,42,255,225,0,2,103,0,1,0,2,104,0]);
const hvcc=Uint8Array.from([1,1,0,0,0,6,0,0,0,0,0,0,153,240,0,252,253,248,248,0,0,15,3,...[32,33,34].flatMap(type=>[128|type,0,1,0,2,type<<1,1])]);
function setup({supportsAVC=true,supportsHEVC=true,changeDescription=false}={}){
 const elements={},store=new Map(),log={fetch:[],probes:[],configs:[],mux:[],blobs:[],revoked:[],frames:0,closedFrames:0,closedEncoders:0,clicks:0};
 function context(){return new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:60})},{get:(obj,key)=>key in obj?obj[key]:(()=>{})});}
 function element(id,tag='',value=''){return {id,tagName:tag.toUpperCase(),value,checked:false,type:'',style:{},listeners:{},classList:{toggle(){}},textContent:'',width:1280,height:720,clientWidth:1000,checkValidity(){return true;},reportValidity(){},addEventListener(name,fn){this.listeners[name]=fn;},getContext(){return this.ctx??=context();},setPointerCapture(){},setAttribute(){},focus(){},click(){log.clicks++;}};}
 for(const [,tag,attrs,id]of html.matchAll(/<(\w+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){
  const el=elements[id]=element(id,tag,attrs.match(/\bvalue="([^"]*)"/)?.[1]||'');el.type=attrs.match(/\btype="([^"]*)"/)?.[1];el.checked=/\bchecked\b/.test(attrs);
 }
 for(const [,id,body]of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
  const opts=[...body.matchAll(/<option value="([^"]+)"([^>]*)>/g)].map(([,value,attrs])=>({value,selected:attrs.includes('selected'),disabled:false}));
  elements[id].options=opts;elements[id].value=(opts.find(option=>option.selected)||opts[0]).value;
 }
 elements.controls.querySelectorAll=()=>Object.values(elements).filter(el=>['INPUT','SELECT'].includes(el.tagName));
 class VideoFrame{constructor(_,init){this.timestamp=init.timestamp;log.frames++;}close(){log.closedFrames++;}}
 class VideoEncoder{
  static async isConfigSupported(config){log.probes.push(config);return {supported:config.codec.startsWith('avc1')?supportsAVC:supportsHEVC,config};}
  constructor(callbacks){this.callbacks=callbacks;this.state='unconfigured';this.encodeQueueSize=0;this.count=0;}
  configure(config){this.config=config;this.state='configured';log.configs.push(config);}
  encode(frame,{keyFrame}){
   this.count++;const hevc=this.config.codec.startsWith('hvc1'),data=Uint8Array.from([0,0,0,3,hevc?38:101,1,0]);
   const description=(hevc?hvcc:avcc).slice();if(changeDescription&&this.count===2)description[1]^=1;
   this.callbacks.output({type:keyFrame?'key':'delta',timestamp:frame.timestamp,byteLength:data.length,copyTo(target){target.set(data);}},{decoderConfig:{description}});
  }
  async flush(){}
  close(){this.state='closed';log.closedEncoders++;}
 }
 const sandbox={console,performance,Math,Date,DOMException,Uint8ClampedArray,Blob,setTimeout,clearTimeout,VideoFrame,VideoEncoder,isSecureContext:true,
  fetch:async url=>{log.fetch.push(url);throw Error('Unexpected network request in browser-only export');},
  requestAnimationFrame(fn){if(fn.name!=='frame')setImmediate(()=>fn(performance.now()));},
  URL:{createObjectURL(blob){log.blobs.push(blob);return 'blob:test-'+log.blobs.length;},revokeObjectURL(url){log.revoked.push(url);}},
  document:{getElementById:id=>elements[id],createElement:tag=>element('',tag),addEventListener(){}},
  window:{addEventListener(){},VideoFrame,VideoEncoder,localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)}}
 };
 sandbox.globalThis=sandbox;vm.createContext(sandbox);
 const load=file=>vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),sandbox,{filename:file});
 load('data/stars.js');sandbox.STAR_CATALOG=sandbox.window.STAR_CATALOG;load('astro.js');
 for(const file of ['vendor/astronomy.js','data/stars3d.js','universe.js','space-renderer.js','immersive.js']){load(file);if(file==='vendor/astronomy.js')sandbox.Astronomy=sandbox.window.Astronomy;}
 sandbox.StarSkyI18n={language:'zh',init(){},onChange(){},t:(key,params={})=>key.replace(/\{(\w+)\}/g,(_,name)=>params[name]??'')};
 for(const file of ['galaxy.js','star-chart.js','mp4.js','web-export.js'])load(file);sandbox.GalaxyBackground=sandbox.window.GalaxyBackground;
 for(const name of ['muxAVC','muxHEVC','muxVP9']){const actual=sandbox[name];sandbox[name]=(...args)=>{log.mux.push(name);return actual(...args);};}
 load('app.js');const run=code=>vm.runInContext(code,sandbox);
 // Rendering correctness is tested separately; exercise the actual export/cancel/save loop here.
 run('render=()=>{dirty=false;};');
 return {elements,log,sandbox,run,ready:()=>run('webCapsTask')};
}
(async()=>{
 const basic=setup();await basic.ready();
 assert.equal(basic.run('browserOnly'),true);assert.equal(basic.run('settings.container'),'mp4');assert.equal(basic.elements.container.disabled,true);
 assert.ok(basic.run('webCaps.h264.codec').startsWith('avc1'));assert.ok(basic.run('webCaps.hevc.codec').startsWith('hvc1'));
 assert.equal(basic.elements.codec.options.find(option=>option.value==='hevc').disabled,false);
 basic.elements.container.value='mov';assert.equal(basic.run('readSettings().container'),'mp4');
 await basic.run('chooseOutput()');assert.equal(basic.run('saveHandle.downloadOnly'),true);assert.match(basic.run('saveHandle.name'),/H264\.mp4$/);
 basic.sandbox.testBlob=new Blob(['MP4 fixture'],{type:'video/mp4'});await basic.run('saveFinal(testBlob,{cancel:false})');
 assert.equal(basic.elements.download.hidden,false);assert.match(basic.elements.download.href,/^blob:/);assert.equal(basic.elements.status.textContent,'视频已生成，请点击下载保存。');
 assert.doesNotMatch(basic.elements.saveLocation.textContent,/已保存/);assert.equal(basic.log.clicks,0);assert.deepEqual(basic.log.fetch,[]);
 basic.sandbox.wrongBlob=new Blob(['not MP4'],{type:'video/webm'});await assert.rejects(basic.run('saveFinal(wrongBlob,{cancel:false})'),/直接导出 MP4/);
 console.log('PASS: browser-only MP4/capability state, native-picker-free download handoff, truthful generated-vs-saved status and no local API calls.');

 const unsupported=setup({supportsAVC:false,supportsHEVC:false});await unsupported.ready();let pickerCalls=0;
 unsupported.sandbox.window.showSaveFilePicker=async()=>{pickerCalls++;throw Error('unsupported must fail before opening picker');};
 await unsupported.elements.export.onclick();assert.equal(pickerCalls,0);assert.match(unsupported.elements.status.textContent,/不支持当前编码/);
 assert.equal(unsupported.elements.codec.options.find(option=>option.value==='hevc').disabled,true);assert.equal(unsupported.log.configs.length,0);

 for(const codec of ['h264','hevc']){
  const app=setup();await app.ready();app.elements.quality.value='standard';app.elements.duration.value='5';app.elements.codec.value=codec;app.run('changed({reset:false})');await app.ready();
  await app.elements.export.onclick();
  assert.deepEqual(app.log.mux,[codec==='h264'?'muxAVC':'muxHEVC']);assert.equal(app.log.blobs.length,1);assert.equal(app.log.blobs[0].type,'video/mp4');
  const file=Buffer.from(await app.log.blobs[0].arrayBuffer());assert.equal(file.toString('ascii',4,8),'ftyp');assert.ok(file.includes(Buffer.from(codec==='h264'?'avcC':'hvcC')));
  assert.equal(app.log.frames,150);assert.equal(app.log.closedFrames,150);assert.equal(app.log.closedEncoders,1);assert.equal(app.run('recording'),null);assert.equal(app.run('preparing'),false);
  assert.equal(app.elements.status.textContent,'视频已生成，请点击下载保存。');assert.equal(app.elements.controls.disabled,false);assert.deepEqual(app.log.fetch,[]);
 }
 console.log('PASS: unsupported codecs stop before the picker; H.264/H.265 take their own MP4 mux paths for 150 frames, release encoders/frames and never transcode remotely.');

 const changed=setup({changeDescription:true});await changed.ready();changed.elements.duration.value='5';await changed.elements.export.onclick();
 assert.match(changed.elements.status.textContent,/改变了视频配置/);assert.equal(changed.log.blobs.length,0);assert.equal(changed.log.mux.length,0);assert.equal(changed.elements.controls.disabled,false);assert.equal(changed.log.closedEncoders,1);
 console.log('PASS: changing decoder configuration aborts export before producing a misleading output file.');
})().catch(error=>{console.error(error);process.exitCode=1;});
