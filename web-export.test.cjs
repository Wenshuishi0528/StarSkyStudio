const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const muxAVC=require('./mp4.js'),{muxHEVC,muxVP9}=muxAVC;
const source=fs.readFileSync(__dirname+'/web-export.js','utf8');
function setup(check,extra={}){const sandbox={Date,setTimeout,clearTimeout,VideoFrame:class{},VideoEncoder:{isConfigSupported:check},...extra};vm.createContext(sandbox);vm.runInContext(source,sandbox);return sandbox.StarSkyWebExport;}
const boxList=(buffer,start=0,end=buffer.length)=>{const boxes=[];for(let at=start;at<end;){const size=buffer.readUInt32BE(at),type=buffer.toString('ascii',at+4,at+8);assert.ok(size>=8&&at+size<=end);boxes.push({type,at,size,data:buffer.subarray(at+8,at+size)});at+=size;}return boxes;};
const find=(buffer,type)=>{let b=boxList(buffer).find(x=>x.type===type);assert.ok(b,type);return b;};
async function checkMux(mux,description,hevc){
 const samples=[{key:true,timestamp:0,data:Uint8Array.from([0,0,0,3,hevc?38:101,1,0])},{key:false,timestamp:33333,data:Uint8Array.from([0,0,0,3,hevc?2:65,1,0])}];
 const blob=mux(samples,description,1280,720,30);assert.equal(blob.type,'video/mp4');const bytes=Buffer.from(await blob.arrayBuffer());
 const top=boxList(bytes);assert.deepEqual(top.map(x=>x.type),['ftyp','mdat','moov']);assert.ok(top[0].data.includes(Buffer.from(hevc?'hvc1':'avc1')));assert.equal(top[1].data.length,14);
 const trak=find(find(bytes,'moov').data,'trak'),mdia=find(trak.data,'mdia'),minf=find(mdia.data,'minf'),stbl=find(minf.data,'stbl');
 const stsd=find(stbl.data,'stsd'),entry=boxList(stsd.data,8)[0];assert.equal(entry.type,hevc?'hvc1':'avc1');assert.equal(entry.data.readUInt16BE(24),1280);assert.equal(entry.data.readUInt16BE(26),720);
 const config=boxList(entry.data,78)[0];assert.equal(config.type,hevc?'hvcC':'avcC');assert.deepEqual(config.data,Buffer.from(description));
 const offset=find(stbl.data,'stco').data.readUInt32BE(8);assert.equal(offset,top[1].at+8);
 const sizes=find(stbl.data,'stsz').data;assert.equal(sizes.readUInt32BE(8),2);assert.equal(sizes.readUInt32BE(12),7);
 const sync=find(stbl.data,'stss').data;assert.equal(sync.readUInt32BE(4),1);assert.equal(sync.readUInt32BE(8),1);
 return samples;
}
(async()=>{
 const calls=[];const api=setup(async config=>{calls.push(config);return {supported:calls.length===2,config};});
 const avc=await api.probe({codec:'h264',width:1920,height:1080,bitrate:12000000});assert.equal(avc.codec,'avc1.42002a');assert.equal(avc.avc.format,'avc');assert.equal(avc.latencyMode,'realtime');assert.equal(avc.framerate,30);assert.equal(avc.hevc,undefined);
 const hevcApi=setup(async config=>({supported:true,config}));const hevc=await hevcApi.probe({codec:'hevc',width:3840,height:2880,bitrate:40000000});assert.equal(hevc.codec,'hvc1.1.6.L180.B0');assert.equal(hevc.hevc.format,'hevc');assert.equal(hevc.avc,undefined);
 const uhd=await hevcApi.probe({codec:'hevc',width:3840,height:2160,bitrate:40000000});assert.equal(uhd.codec,'hvc1.1.6.L153.B0');
 const large=await hevcApi.probe({codec:'h264',width:3840,height:2880,bitrate:40000000});assert.equal(large.codec,'avc1.64003c');
 for(const extra of [{isSecureContext:false},{VideoEncoder:undefined},{VideoFrame:undefined}])assert.equal(await setup(()=>{throw Error('must not call');},extra).probe({codec:'h264',width:1280,height:720,bitrate:8000000}),null);
 assert.equal(await hevcApi.probe({codec:'vp9',width:1280,height:720,bitrate:8000000}),null);
 assert.equal(await hevcApi.probe({codec:'h264',width:1279,height:720,bitrate:8000000}),null);
 assert.equal(await setup(async()=>({supported:false})).probe({codec:'hevc',width:1920,height:1080,bitrate:12000000}),null);
 assert.equal(await setup(async()=>{throw Error('unsupported');}).probe({codec:'hevc',width:1920,height:1080,bitrate:12000000}),null);
 const started=Date.now();assert.equal(await setup(()=>new Promise(()=>{})).probe({codec:'h264',width:1280,height:720,bitrate:8000000,timeoutMs:20}),null);assert.ok(Date.now()-started<500);
 const avcc=Uint8Array.from([1,100,0,42,255,225,0,2,103,0,1,0,2,104,0]);
 const hvcc=Uint8Array.from([1,1,0,0,0,6,0,0,0,0,0,0,153,240,0,252,253,248,248,0,0,15,3,...[32,33,34].flatMap(type=>[128|type,0,1,0,2,type<<1,1])]);
 const samples=await checkMux(muxAVC,avcc,false);const hevcSamples=await checkMux(muxHEVC,hvcc,true);
 assert.throws(()=>muxHEVC(hevcSamples,new Uint8Array(23),1280,720),/有效/);
 assert.throws(()=>muxHEVC(hevcSamples,hvcc.subarray(0,hvcc.length-1),1280,720),/有效/);
 assert.throws(()=>muxHEVC([{key:true,timestamp:0,data:Uint8Array.from([0,0,0,1,38,1,0])}],hvcc,1280,720),/有效/);
 assert.throws(()=>muxAVC([{...samples[0],key:false}],avcc,1280,720),/重排序/);
 assert.throws(()=>muxAVC([samples[0],{...samples[1],timestamp:0}],avcc,1280,720),/重排序/);
 assert.equal(muxVP9(samples,1280,720).type,'video/webm','legacy local intermediate remains intact');
 console.log('PASS: native codec capability/profile/size selection, timeout and unsupported paths; AVC/HEVC MP4 boxes, payload offsets, configuration validation and internal VP9 compatibility.');
})().catch(error=>{console.error(error);process.exitCode=1;});
