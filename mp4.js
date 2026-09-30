// Minimal video-only ISO BMFF muxer for timestamp-ordered AVC chunks.
// The encoder runs with latencyMode=realtime (no reordered B frames).
(function(root){
 'use strict';
 const bytes=(...v)=>Uint8Array.from(v),str=s=>bytes(...[...s].map(c=>c.charCodeAt(0))),zero=n=>new Uint8Array(n);
 const u16=n=>bytes(n>>>8,n),u32=n=>bytes(n>>>24,n>>>16,n>>>8,n);
 const join=(...parts)=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;};
 const box=(type,...p)=>{const data=join(...p);return join(u32(data.length+8),str(type),data);};
 const full=(type,flags,...p)=>box(type,u32(flags),...p);
 const matrix=join(u32(65536),u32(0),u32(0),u32(0),u32(65536),u32(0),u32(0),u32(0),u32(0x40000000));
 function muxAVC(samples,description,width,height,fps=30){
  if(!samples.length||!description?.byteLength)throw Error('编码器未返回有效AVC参数或画面');
  const n=samples.length,ftyp=box('ftyp',str('isom'),u32(512),str('isomiso2avc1mp41'));
  const total=samples.reduce((s,x)=>s+x.data.length,0);if(total+8>=2**32)throw Error('视频过大，请缩短片段');
  const avc1=box('avc1',zero(6),u16(1),zero(16),u16(width),u16(height),u32(0x00480000),u32(0x00480000),u32(0),u16(1),zero(32),u16(24),u16(65535),box('avcC',new Uint8Array(description)));
  const keys=samples.flatMap((s,i)=>s.key?[u32(i+1)]:[]);
  const stbl=box('stbl',full('stsd',0,u32(1),avc1),full('stts',0,u32(1),u32(n),u32(1)),full('stsc',0,u32(1),u32(1),u32(n),u32(1)),full('stsz',0,u32(0),u32(n),...samples.map(s=>u32(s.data.length))),full('stco',0,u32(1),u32(ftyp.length+8)),full('stss',0,u32(keys.length),...keys));
  const minf=box('minf',full('vmhd',1,zero(8)),box('dinf',full('dref',0,u32(1),full('url ',1))),stbl);
  const mdia=box('mdia',full('mdhd',0,u32(0),u32(0),u32(fps),u32(n),u16(0x55c4),u16(0)),full('hdlr',0,u32(0),str('vide'),zero(12),str('StarSky Video\0')),minf);
  const trak=box('trak',full('tkhd',7,u32(0),u32(0),u32(1),u32(0),u32(n),zero(8),u16(0),u16(0),u16(0),u16(0),matrix,u32(width*65536),u32(height*65536)),mdia);
  const moov=box('moov',full('mvhd',0,u32(0),u32(0),u32(fps),u32(n),u32(65536),u16(256),zero(10),matrix,zero(24),u32(2)),trak);
  return new Blob([ftyp,u32(total+8),str('mdat'),...samples.map(s=>s.data),moov],{type:'video/mp4'});
 }
 // WebM/VP9 fallback supports non-UHD aspect sizes outside platform AVC limits.
 function muxVP9(samples,width,height,fps=30){
  const num=n=>{let len=1;while(n>=2**(8*len))len++;const out=new Uint8Array(len);for(let i=len-1;i>=0;i--){out[i]=n%256;n=Math.floor(n/256);}return out;};
  const size=n=>{let len=1;while(n>=2**(7*len)-1)len++;const out=new Uint8Array(len);for(let i=len-1;i>=0;i--){out[i]=n%256;n=Math.floor(n/256);}out[0]|=1<<(8-len);return out;};
  const el=(id,...parts)=>{const p=join(...parts);return join(num(id),size(p.length),p);};
  const uint=(id,n)=>el(id,num(n));
  const dur=new Uint8Array(8);new DataView(dur.buffer).setFloat64(0,samples.length*1000000/fps);
  const header=el(0x1a45dfa3,uint(0x4286,1),uint(0x42f7,1),uint(0x42f2,4),uint(0x42f3,8),el(0x4282,str('webm')),uint(0x4287,4),uint(0x4285,2));
  const info=el(0x1549a966,uint(0x2ad7b1,1000),el(0x4489,dur),el(0x4d80,str('StarSky')),el(0x5741,str('StarSky')));
  const tracks=el(0x1654ae6b,el(0xae,uint(0xd7,1),uint(0x73c5,1),uint(0x83,1),uint(0x9c,0),el(0x86,str('V_VP9')),uint(0x23e383,Math.round(1e9/fps)),el(0xe0,uint(0xb0,width),uint(0xba,height))));
  let offset=info.length+tracks.length;const cues=[];
  const clusters=samples.map((s,i)=>{const time=Math.round(i*1000000/fps);if(s.key)cues.push(el(0xbb,uint(0xb3,time),el(0xb7,uint(0xf7,1),uint(0xf1,offset))));const c=el(0x1f43b675,uint(0xe7,time),el(0xa3,bytes(0x81,0,0,s.key?0x80:0),s.data));offset+=c.length;return c;});
  const cueBlock=el(0x1c53bb6b,...cues),total=offset+cueBlock.length;
  return new Blob([header,num(0x18538067),size(total),info,tracks,...clusters,cueBlock],{type:'video/webm'});
 }
 if(typeof module!=='undefined'){module.exports=muxAVC;module.exports.muxVP9=muxVP9;}else {root.muxAVC=muxAVC;root.muxVP9=muxVP9;}
})(globalThis);
