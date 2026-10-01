/* Physical-coordinate model. Distances: AU; orientation: heliocentric J2000 equatorial. */
(function(root){
 'use strict';
 const E=typeof module!=='undefined'?require('./vendor/astronomy.js'):root.Astronomy;
 const AU=149597870.7,PC=206264.80624709636,LY=63241.07708426628;
 const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),scale=(v,k)=>v.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=v=>Math.hypot(...v),unit=v=>scale(v,1/(norm(v)||1));
 const vec=v=>[v.x,v.y,v.z];
 const bodies=[
 ['Sun','太阳',695700,'#fff1ce'],['Mercury','水星',2439.7,'#aea69b'],['Venus','金星',6051.8,'#e3cea0'],['Earth','地球',6371,'#729bc3'],['Mars','火星',3389.5,'#c48061'],['Jupiter','木星',69911,'#c9ae8a'],['Saturn','土星',58232,'#d3c195'],['Uranus','天王星',25362,'#9bd0d4'],['Neptune','海王星',24622,'#6588cd'],['Pluto','冥王星',1188.3,'#b7a798'],['Moon','月球',1737.4,'#b5b6b5'],['Io','木卫一',1821.6,'#d1bd6d'],['Europa','木卫二',1560.8,'#cebfaa'],['Ganymede','木卫三',2634.1,'#9c9182'],['Callisto','木卫四',2410.3,'#7b7469']
 ].map(([id,name,radius,color])=>({id,name,radius:radius/AU,color}));
 function solarSystem(ms){const date=new Date(ms),j=E.JupiterMoons(date),jupiter=vec(E.HelioVector('Jupiter',date));return bodies.map(b=>({...b,pos:j[b.id.toLowerCase()]?add(jupiter,vec(j[b.id.toLowerCase()])):vec(E.HelioVector(b.id,date))}));}
 function earthObserver(ms,lat,lon){const date=new Date(ms);return add(vec(E.HelioVector('Earth',date)),vec(E.ObserverVector(date,new E.Observer(lat,lon,0),false)));}
 // Inertial EQJ -> local north/east/up. Library rotation includes nutation and sidereal time.
 function groundVector(v,ms,lat,lon){return vec(E.RotateVector(E.Rotation_EQJ_HOR(new Date(ms),new E.Observer(lat,lon,0)),new E.Vector(...v,new Date(ms))));}
 // Astronomy HOR is north, west, zenith. App camera axes are east, north, zenith.
 function toGround(v,ms,lat,lon){const h=groundVector(v,ms,lat,lon);return [-h[1],h[0],h[2]];}
 function groundBasis(ms,lat,lon){const axes=[[1,0,0],[0,1,0],[0,0,1]].map(v=>toGround(v,ms,lat,lon));return [0,1,2].map(i=>axes.map(v=>v[i]));}
 function starPosition(row,ms){const years=(ms-Date.UTC(2000,0,1,12))/31557600000;return [0,1,2].map(i=>(row[3+i]+row[6+i]*years)*PC);}
 function starView(row,ms,observer){const rel=sub(starPosition(row,ms),observer),distance=norm(rel),dpc=distance/PC;return {rel,distance,mag:row[9]+5*Math.log10(Math.max(dpc,1e-10))-5};}
 // Deterministic band-limited turbulence proxy, not a measured atmospheric realization.
 // Airmass strengthens scintillation near the horizon; no atmosphere in free space.
 function scintillation(id,t,altitude,strength=1,ground=true){if(!ground||!strength||altitude<=0)return 1;const phase=(id*.61803398875%1)*Math.PI*2,air=1/Math.max(.12,Math.sin(altitude));const amplitude=Math.min(.35,.045*Math.pow(air,.75))*strength;const noise=(Math.sin(t*17.3+phase)+.6*Math.sin(t*29.7+phase*2.31)+.35*Math.sin(t*43.1+phase*.73))/1.95;return Math.max(.15,1+amplitude*noise);}
 function angularRadius(radius,distance){return Math.asin(Math.min(1,radius/Math.max(radius,distance)));}
 function lambertPhase(angle){return (Math.sin(angle)+(Math.PI-angle)*Math.cos(angle))/Math.PI;}
 function bodyView(body,observer){const rel=sub(body.pos,observer),distance=norm(rel),sun=unit(scale(body.pos,-1)),eye=unit(scale(rel,-1)),phase=Math.acos(Math.max(-1,Math.min(1,dot(sun,eye))));return {rel,distance,sun,phase:body.id==='Sun'?0:phase,angular:angularRadius(body.radius,distance)};}
 function formatDistance(au){return au>=LY*.01?(au/LY).toFixed(3)+' 光年':au<.01?(au*AU).toLocaleString('zh-CN',{maximumFractionDigits:0})+' km':au.toFixed(4)+' AU';}
 function outsideBodies(position,list){let p=[...position];for(const b of list){const d=sub(p,b.pos),n=norm(d),safe=b.radius*1.01;if(n<safe)p=add(b.pos,scale(n?unit(d):[1,0,0],safe));}return p;}
 const api={AU,PC,LY,add,sub,scale,dot,norm,unit,vec,bodies,solarSystem,earthObserver,toGround,groundBasis,starPosition,starView,scintillation,angularRadius,lambertPhase,bodyView,formatDistance,outsideBodies};
 if(typeof module!=='undefined')module.exports=api;else root.Universe=api;
})(globalThis);
