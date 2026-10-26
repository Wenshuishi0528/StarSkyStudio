(function(root){
  'use strict';
  const D=Math.PI/180, wrap=x=>(x%360+360)%360;
  function sidereal(ms,lon=0){const d=ms/86400000+2440587.5-2451545,T=d/36525;return wrap(280.46061837+360.98564736629*d+.000387933*T*T-T*T*T/38710000+lon)*D;}
  function equatorial(ra,dec){ra*=D;dec*=D;return [Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec)];}
  // IAU 1976 precession, J2000 to mean equator/equinox of date. No proper motion/nutation.
  function precess(ra,dec,ms){const t=(ms/86400000+2440587.5-2451545)/36525;
    const zeta=(2306.2181*t+.30188*t*t+.017998*t*t*t)/3600*D,z=(2306.2181*t+1.09468*t*t+.018203*t*t*t)/3600*D,theta=(2004.3109*t-.42665*t*t-.041833*t*t*t)/3600*D;
    const r=ra*D+zeta,d=dec*D,A=Math.cos(d)*Math.sin(r),B=Math.cos(theta)*Math.cos(d)*Math.cos(r)-Math.sin(theta)*Math.sin(d),C=Math.sin(theta)*Math.cos(d)*Math.cos(r)+Math.cos(theta)*Math.sin(d);
    return equatorial((Math.atan2(A,B)+z)/D,Math.asin(Math.max(-1,Math.min(1,C)))/D);
  }
  function basis(ms,lat,lon){const s=sidereal(ms,lon),p=lat*D;return [[-Math.sin(s),Math.cos(s),0],[-Math.sin(p)*Math.cos(s),-Math.sin(p)*Math.sin(s),Math.cos(p)],[Math.cos(p)*Math.cos(s),Math.cos(p)*Math.sin(s),Math.sin(p)]];}
  // Columns of the J2000 -> mean-of-date rotation. Its transpose is the inverse.
  function precessionAxes(ms){return [precess(0,0,ms),precess(90,0,ms),precess(0,90,ms)];}
  function j2000Basis(ms,lat,lon,epoch=ms){const axes=precessionAxes(epoch);return basis(ms,lat,lon).map(row=>axes.map(axis=>dot(row,axis)));}
  function gridDirection(longitude,latitude,kind,groundBasis){
    const a=longitude*D,h=latitude*D;
    return kind==='equatorial'?horizontal(equatorial(longitude,latitude),groundBasis):[Math.cos(h)*Math.sin(a),Math.cos(h)*Math.cos(a),Math.sin(h)];
  }
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  function horizontal(v,b){return b.map(x=>dot(v,x));}
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const unit=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
  function rotate(v,axis,angle){const cs=Math.cos(angle),sn=Math.sin(angle),cv=cross(axis,v),dp=dot(axis,v);return v.map((x,i)=>x*cs+cv[i]*sn+axis[i]*dp*(1-cs));}
  function camera(az,alt,roll=0){az*=D;alt*=D;const c={forward:[Math.cos(alt)*Math.sin(az),Math.cos(alt)*Math.cos(az),Math.sin(alt)],right:[Math.cos(az),-Math.sin(az),0],up:[-Math.sin(alt)*Math.sin(az),-Math.sin(alt)*Math.cos(az),Math.cos(alt)]};return roll?turnCamera(c,0,0,roll):c;}
  // Rotate an orthonormal camera frame about its own axes. No pitch clamps or pole singularity.
  function turnCamera(c,yaw,pitch,roll=0){let out={forward:[...c.forward],right:[...c.right],up:[...c.up]};for(const [key,degrees] of [['up',yaw],['right',pitch],['forward',roll]]){if(!degrees)continue;const axis=[...out[key]];for(const k of ['forward','right','up'])out[k]=rotate(out[k],axis,degrees*D);}out.forward=unit(out.forward);out.right=unit(cross(out.forward,out.up));out.up=unit(cross(out.right,out.forward));return out;}
  function cameraAngles(c){const az=wrap(Math.atan2(c.forward[0],c.forward[1])/D),alt=Math.asin(Math.max(-1,Math.min(1,c.forward[2])))/D,base=camera(az,alt);return {az,alt,roll:Math.atan2(-dot(c.right,base.up),dot(c.right,base.right))/D};}
  function project(v,c,w,h,fov){const z=dot(v,c.forward);if(z<=.01)return null;const f=w/(2*Math.tan(fov*D/2));return [w/2+dot(v,c.right)*f/z,h/2-dot(v,c.up)*f/z];}
  function solarAltitude(ms,lat,lon){const d=ms/86400000+2440587.5-2451545,g=wrap(357.529+.98560028*d)*D,l=(wrap(280.459+.98564736*d)+1.915*Math.sin(g)+.02*Math.sin(2*g))*D,e=(23.439-.00000036*d)*D;const v=[Math.cos(l),Math.cos(e)*Math.sin(l),Math.sin(e)*Math.sin(l)];return Math.asin(horizontal(v,basis(ms,lat,lon))[2])/D;}
  function parseLocal(value,offset){const t=Date.parse(value+'Z')-offset*3600000;if(!Number.isFinite(t))throw Error('请输入有效日期与时间');return t;}
  function localISO(ms,offset){return new Date(ms+offset*3600000).toISOString().slice(0,19);}
  function random(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
  const api={D,wrap,sidereal,equatorial,precess,precessionAxes,j2000Basis,gridDirection,basis,dot,horizontal,camera,turnCamera,cameraAngles,project,solarAltitude,parseLocal,localISO,random};
  if(typeof module!=='undefined')module.exports=api;else root.Astro=api;
})(globalThis);
