// Native browser codecs only. Unsupported output stays unavailable; no format substitution.
// HEVC configuration: https://www.w3.org/TR/webcodecs-hevc-codec-registration/
(function(root){
 'use strict';
 async function probe({codec,width,height,bitrate,timeoutMs=5000}){
  if(!['h264','hevc'].includes(codec)||!Number.isInteger(width)||!Number.isInteger(height)||width<2||height<2||width%2||height%2||width>65534||height>65534||!Number.isFinite(bitrate)||bitrate<=0)return null;
  if(root.isSecureContext===false||!root.VideoFrame||!root.VideoEncoder?.isConfigSupported)return null;
  const base={width,height,bitrate,framerate:30,latencyMode:'realtime'};
  // 4:3 4K exceeds the picture size of AVC 5.x / HEVC 5.x. Probe level 6.
  const large=width*height>3840*2160;
  const candidates=codec==='hevc'?(large?['hvc1.1.6.L180.B0']:width*height>1920*1080?['hvc1.1.6.L153.B0','hvc1.1.6.L180.B0']:['hvc1.1.6.L123.B0','hvc1.1.6.L153.B0']):(large?['avc1.64003c','avc1.42003c']:width*height>1920*1080?['avc1.640033','avc1.420033']:['avc1.64002a','avc1.42002a']);
  const deadline=Date.now()+Math.max(1,Math.min(10000,Number(timeoutMs)||5000));
  for(const name of candidates){
   const remaining=deadline-Date.now();if(remaining<=0)return null;
   let timer;
   try{
    const requested={...base,codec:name,...(codec==='hevc'?{hevc:{format:'hevc'}}:{avc:{format:'avc'}})};
    const result=await Promise.race([root.VideoEncoder.isConfigSupported(requested),new Promise(resolve=>{timer=setTimeout(()=>resolve(null),remaining);})]);
    if(!result)return null;
    if(result.supported){
     // Keep the requested bitstream format even if an older browser omits it from the
     // recognized dictionary. The muxer still requires a real decoder description.
     return {...requested,...result.config,...(codec==='hevc'?{hevc:{format:'hevc'}}:{avc:{format:'avc'}})};
    }
   }catch{/* Try the next profile; no browser is required to implement either codec. */}
   finally{clearTimeout(timer);}
  }
  return null;
 }
 const api={probe};root.StarSkyWebExport=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
