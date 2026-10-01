/* Shared renderer for inertial navigation, real-distance stars and solar-system bodies. */
(function(root){
 'use strict';const U=root.Universe,E=root.Astronomy;
 const dot=U.dot,unit=U.unit,sub=U.sub,scale=U.scale;
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 class SpaceRenderer{
  constructor(){this.position=null;this.cacheTime=null;this.list=[];this.disk=document.createElement('canvas');this.disk.width=this.disk.height=192;this.dc=this.disk.getContext('2d');}
  bodies(ms){if(ms!==this.cacheTime){this.list=U.solarSystem(ms);this.cacheTime=ms;}return this.list;}
  origin(ms,lat,lon){return U.earthObserver(ms,lat,lon);}
  enter(ms,lat,lon){this.position=this.origin(ms,lat,lon);}
  observer(ms,s,elapsed,cam){if(s.spaceMode!=='space')return this.origin(ms,s.lat,s.lon);if(!this.position)this.enter(ms,s.lat,s.lon);const p=s.fly?U.add(this.position,scale(cam.forward,s.moveStep*elapsed)):this.position;return U.outsideBodies(p,this.bodies(ms));}
  move(axis,amount,ms,s){if(!this.position)this.enter(ms,s.lat,s.lon);this.position=U.outsideBodies(U.add(this.position,scale(axis,amount)),this.bodies(ms));}
  target(id,ms){const b=this.bodies(ms).find(x=>x.id===id);if(b)return b;const row=root.SPATIAL_STARS.find(r=>'star:'+r[0]===id);return row?{id,name:row[2]||'HIP '+row[1],pos:U.starPosition(row,ms),radius:0}:null;}
  visit(id,ms,s){const target=this.target(id,ms);if(!target)return;const radial=unit(target.pos),direction=target.id==='Sun'?[0,-1,0]:unit(U.add(scale(radial,-.8),[0,0,.6]));const distance=target.radius?target.radius*(target.id==='Jupiter'?24:8):U.LY*.2;this.position=U.add(target.pos,scale(direction,distance));return target;}
  drawStars(ctx,ms,s,observer,cam,w,h,labels){const f=w/(2*Math.tan(s.fov*Math.PI/360));let count=0;
   for(const row of root.SPATIAL_STARS){const v=U.starView(row,ms,observer);if(v.mag>s.magnitude)continue;const z=dot(v.rel,cam.forward);if(z<=0)continue;const x=w/2+dot(v.rel,cam.right)*f/z,y=h/2-dot(v.rel,cam.up)*f/z;if(x<0||x>w||y<0||y>h)continue;
    const r=clamp(2.8-v.mag*.29,.35,5),alpha=clamp(1.3-v.mag*.12,.08,1),color=row[10]>.9?'#ffce9e':row[10]<.1?'#c0d7ff':'#fff0dc';ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fill();if(v.mag<1){const g=ctx.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,color+'66');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.fillRect(x-r*4,y-r*4,r*8,r*8);}count++;
    const label={91262:'织女星',97649:'牛郎星',102098:'天津四',11767:'北极星',32349:'天狼星'}[row[1]]||(s.destination==='star:'+row[0]?row[2]:null);
    if(labels&&label){ctx.globalAlpha=1;ctx.font='13px -apple-system,sans-serif';ctx.fillStyle='#d4e4c4';ctx.fillText(label,x+r+5,y-6);}
   }ctx.globalAlpha=1;return count;
  }
  drawBodies(ctx,ms,s,observer,cam,w,h,basis,labels){
   const local=v=>basis?basis.map(a=>dot(a,v)):v,f=w/(2*Math.tan(s.fov*Math.PI/360));
   const list=this.bodies(ms).filter(b=>!(s.spaceMode!=='space'&&b.id==='Earth')).map(b=>({...b,...U.bodyView(b,observer)})).sort((a,b)=>b.distance-a.distance);
   for(const b of list){const v=local(b.rel),z=dot(v,cam.forward);if(z<=0)continue;const x=w/2+dot(v,cam.right)*f/z,y=h/2-dot(v,cam.up)*f/z;
    const physical=f*Math.tan(b.angular),r=s.bodyScale==='markers'?Math.max(physical,3):physical;if(x+r<0||x-r>w||y+r<0||y-r>h)continue;
    if(r<1.1){const albedo={Mercury:.14,Venus:.69,Earth:.43,Mars:.17,Jupiter:.54,Saturn:.5,Uranus:.49,Neptune:.44,Pluto:.5,Moon:.12,Io:.63,Europa:.67,Ganymede:.43,Callisto:.2}[b.id]||.2;
      const flux=albedo*U.lambertPhase(b.phase)*b.radius*b.radius/(Math.max(U.norm(b.pos),1e-8)**2*Math.max(b.distance,1e-8)**2),mag=b.id==='Sun'?-26.74+5*Math.log10(Math.max(b.distance,1e-8)):-26.74-2.5*Math.log10(Math.max(flux,1e-30));
      if(mag>s.magnitude)continue;ctx.globalAlpha=clamp(1.3-mag*.12,.05,1);ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(x,y,clamp(2.8-mag*.29,.4,3),0,2*Math.PI);ctx.fill();ctx.globalAlpha=1;
    }else{
      const sun=local(b.sun),light=[dot(sun,cam.right),dot(sun,cam.up),-dot(sun,cam.forward)];
      const image=this.dc.createImageData(192,192),rgb=b.color.match(/\w\w/g).map(x=>parseInt(x,16));
      for(let yy=0;yy<192;yy++)for(let xx=0;xx<192;xx++){const nx=(xx+.5-96)/96,ny=(96-yy-.5)/96,q=nx*nx+ny*ny;if(q>1)continue;const nz=Math.sqrt(1-q),lum=b.id==='Sun'?.55+.45*nz:Math.max(0,nx*light[0]+ny*light[1]+nz*light[2]),i=(yy*192+xx)*4;for(let c=0;c<3;c++)image.data[i+c]=rgb[c]*Math.pow(lum,.55);image.data[i+3]=255;}
      this.dc.putImageData(image,0,0);
      if(b.id==='Saturn')this.rings(ctx,b,ms,observer,cam,local,f,w,h,false);
      ctx.drawImage(this.disk,x-r,y-r,2*r,2*r);
      if(b.id==='Saturn')this.rings(ctx,b,ms,observer,cam,local,f,w,h,true);
    }
    if(labels){ctx.font='13px -apple-system,sans-serif';ctx.fillStyle='#d4e4c4';ctx.fillText(b.name,x+Math.max(r,4)+5,y-6);}
   }
  }
  rings(ctx,b,ms,observer,cam,local,f,w,h,front){
   const n=U.vec(E.RotationAxis('Saturn',new Date(ms)).north),a=unit([-n[1],n[0],0]),c=[n[1]*a[2]-n[2]*a[1],n[2]*a[0]-n[0]*a[2],n[0]*a[1]-n[1]*a[0]],sun=unit(scale(b.pos,-1));
   const project=offset=>{const v=local(sub(U.add(b.pos,offset),observer)),z=dot(v,cam.forward);return z>0?[w/2+dot(v,cam.right)*f/z,h/2-dot(v,cam.up)*f/z]:null;};
   for(const [inner,outer,color]of [[1.25,1.52,'#716955'],[1.53,1.93,'#b5a585'],[2.03,2.27,'#9c9079']])for(let i=0;i<180;i++){
    const t=i*Math.PI/90,tn=(i+1)*Math.PI/90,dir=U.add(scale(a,Math.cos(t)),scale(c,Math.sin(t))),next=U.add(scale(a,Math.cos(tn)),scale(c,Math.sin(tn))),mid=scale(dir,b.radius*(inner+outer)/2);
    if((dot(mid,b.rel)<0)!==front)continue;
    const pts=[scale(dir,b.radius*inner),scale(dir,b.radius*outer),scale(next,b.radius*outer),scale(next,b.radius*inner)].map(project);if(pts.some(p=>!p))continue;
    const toward=-dot(mid,sun),shadow=toward>0&&U.norm(U.add(mid,scale(sun,toward)))<b.radius;
    ctx.fillStyle=shadow?'#090b0e':color;ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.fill();
   }ctx.globalAlpha=1;
  }
 }
 root.SpaceRenderer=SpaceRenderer;
})(globalThis);
