/* Star-chart data and collision layout adapted from Tiangong Orbit Simulator.
 * Data: d3-celestial (BSD-3-Clause), CDS VI/49; see data/star-chart.json.source.
 * Rendering stays on StarSky's Canvas2D and receives its coordinate projection.
 */
(function(root){
 'use strict';
 const D=Math.PI/180,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const validPoint=p=>p&&Number.isFinite(p[0])&&Number.isFinite(p[1]);
 function placeLabels(candidates,width,height,density,reserved=[]){
  const gap=4+(1-density)*9,limit=Math.round(18+density*78),cell=64,buckets=new Map(),placed=[];
  const cells=r=>{const out=[];for(let x=Math.floor(r.x/cell);x<=Math.floor((r.x+r.w)/cell);x++)for(let y=Math.floor(r.y/cell);y<=Math.floor((r.y+r.h)/cell);y++)out.push(x+':'+y);return out;};
  const overlaps=(a,b)=>a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;
  for(const item of candidates){
   if(placed.length>=limit)break;
   const positions=item.centered?[[-item.w/2,-item.h/2]]:[[8,-item.h/2],[-item.w-8,-item.h/2],[8,-item.h-7],[8,7]];
   for(const [dx,dy]of positions){
    const rect={x:item.x+dx,y:item.y+dy,w:item.w,h:item.h};
    if(rect.x<5||rect.y<5||rect.x+rect.w>width-5||rect.y+rect.h>height-5||reserved.some(r=>overlaps(rect,r)))continue;
    const keys=cells({x:rect.x-gap,y:rect.y-gap,w:rect.w+2*gap,h:rect.h+2*gap});
    if(keys.some(k=>(buckets.get(k)||[]).some(r=>overlaps(rect,r))))continue;
    for(const k of keys){if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(rect);}
    placed.push({...item,dx,dy,rect});break;
   }
  }
  return placed;
 }
 const vector=([ra,dec])=>[Math.cos(dec*D)*Math.cos(ra*D),Math.cos(dec*D)*Math.sin(ra*D),Math.sin(dec*D)];
 // Short great-circle samples for constellation outlines, including RA wrap.
 // CDS boundary paths already contain dense, authoritative samples: keep them.
 function samplePath(path){
  const out=[];
  for(let i=1;i<path.length;i++){
   const a=vector(path[i-1]),b=vector(path[i]),angle=Math.acos(clamp(a.reduce((s,v,j)=>s+v*b[j],0),-1,1));
   if(!out.length)out.push(path[i-1]);
   const steps=Math.max(1,Math.ceil(angle/(2*D)));
   for(let j=1;j<steps;j++){
    if(angle<1e-9||Math.PI-angle<1e-9)continue;
    const t=j/steps,sa=Math.sin((1-t)*angle),sb=Math.sin(t*angle),sn=Math.sin(angle),v=a.map((x,k)=>(x*sa+b[k]*sb)/sn);
    out.push([Math.atan2(v[1],v[0])/D,Math.asin(clamp(v[2],-1,1))/D]);
   }
   out.push(path[i]);
  }
  return out;
 }
 // Liang-Barsky clipping prevents huge near-horizon coordinates reaching Canvas.
 function clipSegment(a,b,width,height){
  if(!validPoint(a)||!validPoint(b))return null;
  const dx=b[0]-a[0],dy=b[1]-a[1];let low=0,high=1;
  const p=[-dx,dx,-dy,dy],q=[a[0],width-a[0],a[1],height-a[1]];
  for(let i=0;i<4;i++){
   if(p[i]===0){if(q[i]<0)return null;continue;}
   const t=q[i]/p[i];if(p[i]<0)low=Math.max(low,t);else high=Math.min(high,t);if(low>high)return null;
  }
  return [[a[0]+low*dx,a[1]+low*dy],[a[0]+high*dx,a[1]+high*dy]];
 }
 function drawPaths(ctx,paths,project,width,height){
  ctx.beginPath();let segments=0;
  for(const path of paths){let previous=null;
   for(const [ra,dec]of path){const point=project(ra,dec);const clipped=clipSegment(previous,point,width,height);if(clipped){ctx.moveTo(...clipped[0]);ctx.lineTo(...clipped[1]);segments++;}previous=validPoint(point)?point:null;}
  }
  ctx.stroke();return segments;
 }
 class StarChart{
  constructor(onReady=()=>{}){this.onReady=onReady;this.data=null;this.status={state:'idle'};this.ready=Promise.resolve(false);this.stats={labels:0,segments:0};this.widths=new Map();this.layout=null;}
  async load(){
   if(this.data)return true;if(this.status.state==='loading')return this.ready;
   this.status={state:'loading'};
   this.ready=(async()=>{
    try{
     const response=await fetch('data/star-chart.json');if(!response.ok)throw Error('Star chart HTTP '+response.status);
     const data=await response.json();this.setData(data);return true;
    }catch(error){this.status={state:'error',error:String(error.message||error)};return false;}
    finally{this.onReady();}
   })();return this.ready;
  }
  setData(data){
   if(!data||!Array.isArray(data.stars)||!Array.isArray(data.constellations)||!Array.isArray(data.boundaries))throw Error('Invalid star chart data');
   this.data=data;this.layout=null;this.lines=data.constellations.flatMap(c=>c.lines.map(samplePath));this.status={state:'ready'};
  }
  draw(ctx,{width,height,project,settings,language='zh',reservedIds=[],reservedRects=[],spaceMode=false,cacheKey}){
   this.stats={labels:0,segments:0};if(!settings.chartEnabled||!this.data)return this.stats;
   const inSpace=spaceMode===true||spaceMode==='space',s=settings,reserved=new Set(reservedIds),density=clamp(Number.isFinite(s.chartDensity)?s.chartDensity:.55,0,1);
   ctx.save();ctx.globalAlpha=1;ctx.lineWidth=1;
   if(!inSpace&&s.chartLines){ctx.strokeStyle='#7fabc359';ctx.setLineDash([]);this.stats.segments+=drawPaths(ctx,this.lines,project,width,height);}
   if(!inSpace&&s.chartBounds){ctx.strokeStyle='#b2a0ce50';ctx.setLineDash([4,4]);this.stats.segments+=drawPaths(ctx,this.data.boundaries,project,width,height);ctx.setLineDash([]);}
   const layoutKey=cacheKey===undefined?null:JSON.stringify([cacheKey,width,height,language,inSpace,s.chartStars,s.chartNames,s.chartScope,s.chartDensity,s.magnitude,[...reserved],reservedRects]);
   let placed=layoutKey!==null&&this.layout?.key===layoutKey?this.layout.placed:null;
   if(!placed){
   const candidates=[];
   const candidate=(item,ra,dec,id,kind)=>{
    const p=project(ra,dec,id);if(!validPoint(p)||p[0]<0||p[0]>width||p[1]<0||p[1]>height)return;
    const text=item[language]||item.en||item.zh;if(!text)return;
    const font=kind==='constellation'?14:13;ctx.font=font+'px -apple-system, sans-serif';
    const widthKey=font+':'+text;if(!this.widths.has(widthKey))this.widths.set(widthKey,ctx.measureText(text).width+4);
    candidates.push({key:kind+'-'+item.id,kind,text,font,x:p[0],y:p[1],w:this.widths.get(widthKey),h:font+7,centered:kind==='constellation',priority:kind==='constellation'?1.7:item.mag??1});
   };
   if(s.chartStars)for(const star of this.data.stars){
    if(reserved.has(star.id)||(s.chartScope!=='all'&&!star.major))continue;
    // Space-mode apparent magnitude is determined by the host's live projection.
    if(!inSpace&&Number.isFinite(s.magnitude)&&star.mag>s.magnitude)continue;
    candidate(star,star.ra,star.dec,star.id,'star');
   }
   if(!inSpace&&s.chartNames)for(const constellation of this.data.constellations)for(const [i,p]of (constellation.labelPositions||[[constellation.ra,constellation.dec]]).entries())candidate({...constellation,id:constellation.id+'-'+i},p[0],p[1],undefined,'constellation');
   candidates.sort((a,b)=>a.priority-b.priority||a.key.localeCompare(b.key));
   placed=placeLabels(candidates,width,height,density,reservedRects);
   this.layout=layoutKey===null?null:{key:layoutKey,placed};
   }
   ctx.textBaseline='top';ctx.textAlign='left';
   for(const label of placed){ctx.font=label.font+'px -apple-system, sans-serif';ctx.fillStyle=label.kind==='constellation'?'#d0c09a':'#c8dce8';ctx.fillText(label.text,label.x+label.dx+2,label.y+label.dy+3);}
   this.stats.labels=placed.length;ctx.restore();return this.stats;
  }
 }
 root.StarChart=StarChart;
 if(typeof module!=='undefined'&&module.exports)module.exports={StarChart,placeLabels,samplePath,clipSegment,drawPaths};
})(typeof globalThis!=='undefined'?globalThis:this);
