'use strict';
const $=id=>document.getElementById(id), A=Astro, D=A.D;
const canvas=$('sky');let ctx=canvas.getContext('2d',{alpha:false});
let bg=document.createElement('canvas'),bgctx=bg.getContext('2d');
let trails=document.createElement('canvas'),tc=trails.getContext('2d');
const names={91262:['织女星','Vega'],97649:['牛郎星','Altair'],102098:['天津四','Deneb'],11767:['北极星','Polaris']};
let stars=[],trailStars=[],settings={},elapsed=0,playing=false,lastNow=0,dirty=true,bgKey='',trailTime=0,previous=[],events=[],recording=null,videoURL=null;
let liveBasis,cam=A.camera(100,60),pointer=null,W=1280,H=720,lastDraw=0,preparing=false,saveHandle=null;
const space=new SpaceRenderer(), U=Universe;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const status=t=>$('status').textContent=t;

const preferenceKey='starsky.preferences.v1';let preferencesReady=false;
function savePreferences(){
 if(!preferencesReady)return;
 try{
  const fields={};for(const el of $('controls').querySelectorAll('input,select')){
   if(!el.checkValidity())return;
   fields[el.id]=el.type==='checkbox'?el.checked:el.value;
  }
  window.localStorage.setItem(preferenceKey,JSON.stringify({version:1,fields,position:space.position,frame:showExportFrame}));
  $('settingsMemory').textContent='设置已自动保存，下次打开恢复。';
 }catch(e){$('settingsMemory').textContent='浏览器未允许保存设置；当前设置仍可使用。';}
}
function restorePreferences(){
 try{
  const saved=JSON.parse(window.localStorage.getItem(preferenceKey)||'null');if(!saved||saved.version!==1||!saved.fields)return false;
  for(const el of $('controls').querySelectorAll('input,select')){
   const value=saved.fields[el.id];if(el.type==='checkbox'){if(typeof value==='boolean')el.checked=value;continue;}
   if(typeof value!=='string')continue;
   const old=el.value;el.value=value;if(!el.value||!el.checkValidity())el.value=old;
  }
  if(Array.isArray(saved.position)&&saved.position.length===3&&saved.position.every(Number.isFinite))space.position=saved.position;
  if(saved.frame===false)$('frameToggle').onclick();
  return true;
 }catch(e){return false;}
}

function starColor(bv){bv=Number(bv);return bv>.9?'#ffce9e':bv>.4?'#fff0dc':bv<.1?'#c0d7ff':'#e5ecff';}
function readSettings(){
 const ids=['lat','lon','date','offset','az','alt','roll','seed','duration'];
 for(const id of ids){if(!$ (id).value||!$(id).checkValidity()){ $(id).reportValidity();throw Error('请检查 '+$(id).parentElement.textContent.trim());}}
 const s={}; for(const id of ['lat','lon','offset','az','alt','roll','fov','speed','magnitude','milky','meteors','seed','duration','twinkle','moveStep'])s[id]=Number($(id).value);
 s.start=A.parseLocal($('date').value,s.offset);for(const id of ['trail','aspect','place','quality','codec','container','spaceMode','bodyScale','destination'])s[id]=$(id).value;
 for(const id of ['labels','grid','solar','fly'])s[id]=$(id).checked;
 return s;
}
function buildStars(){stars=STAR_CATALOG.filter(s=>s[3]<=settings.magnitude).map(s=>({id:s[0],v:A.precess(s[1],s[2],settings.start),mag:s[3],color:starColor(s[4]),r:clamp(2.8-s[3]*.29,.38,3.3),alpha:clamp(1.3-s[3]*.12,.12,1)}));trailStars=stars.filter(s=>s.mag<=6);}
function buildMeteors(){const r=A.random(settings.seed);events=[];const gap=60/(settings.meteors||1);if(!settings.meteors)return;for(let i=0;i<Math.ceil(settings.duration/gap);i++){const start=(i+.15+.7*r())*gap;events.push({start,life:.65+r()*.5,x:.15+r()*.65,y:.1+r()*.48,dx:(r()>.5?1:-1)*(.1+r()*.16),dy:.1+r()*.12});}}
function resize(){
 const base=settings.aspect==='portrait'?[720,1280]:settings.aspect==='photo'?[1200,900]:[1280,720];
 const size=settings.quality==='4k'?(settings.aspect==='portrait'?[2160,3840]:settings.aspect==='photo'?[3840,2880]:[3840,2160]):settings.quality==='1080p'?(settings.aspect==='portrait'?[1080,1920]:settings.aspect==='photo'?[1440,1080]:[1920,1080]):base;
 [W,H]=base;[canvas.width,canvas.height]=size;[trails.width,trails.height]=size;
 const scale=size[0]/W;ctx.setTransform(scale,0,0,scale,0,0);tc.setTransform(scale,0,0,scale,0,0);
 bg.width=settings.quality==='4k'?640:320;bg.height=Math.round(bg.width*H/W);
 const ratio=W/H;$('stage').style.aspectRatio=ratio;$('stage').style.width=`min(100%, ${ratio*65}vh${settings.aspect==='portrait'?', 360px':''})`;
 $('frameTag').textContent=`${settings.quality==='4k'?'4K · ':settings.quality==='1080p'?'1080P · ':''}${settings.aspect==='portrait'?'9:16':settings.aspect==='photo'?'4:3':'16:9'} · ${size[0]} × ${size[1]}`;
 $('qualityInfo').textContent=`${size[0]} × ${size[1]} · 30fps逐帧 · ${settings.quality==='4k'?'可先用标准模式取景，再切4K导出':settings.quality==='1080p'?'全高清画质':'标准画质'}`;
}
function clearTrails(){tc.clearRect(0,0,W,H);trailTime=0;previous=[];}
function changed({reset=true,view=false}={}){try{const next=readSettings(),old=settings;settings=next;if(reset)elapsed=0;else elapsed=Math.min(elapsed,settings.duration);playing=false;
 if(old.spaceMode&&old.spaceMode!==settings.spaceMode){
  const b=U.groundBasis(settings.start+elapsed*settings.speed*1000,settings.lat,settings.lon);
  if(settings.spaceMode==='space'){space.enter(settings.start+elapsed*settings.speed*1000,settings.lat,settings.lon);for(const k of ['forward','right','up'])cam[k]=[0,1,2].map(i=>b.reduce((sum,row,j)=>sum+row[i]*cam[k][j],0));}
  else for(const k of ['forward','right','up'])cam[k]=b.map(row=>U.dot(row,cam[k]));
  Object.assign(settings,A.cameraAngles(cam));for(const id of ['az','alt','roll'])$(id).value=settings[id].toFixed(1);
 }
 if(view)cam=A.camera(settings.az,settings.alt,settings.roll);
 if(old.start!==settings.start||old.magnitude!==settings.magnitude)buildStars();
 buildMeteors();if(old.aspect!==settings.aspect||old.quality!==settings.quality)resize();clearTrails();bgKey='';dirty=true;if(isImmersive())sizeImmersive();updateUI();savePreferences();status(reset?'已更新片段起点。':'已保留当前进度，画面参数已更新。');}catch(e){status(e.message);}}
function project(v,b=liveBasis){return A.project(A.horizontal(v,b),cam,W,H,settings.fov);}
function inside(p,pad=8){return p&&p[0]>-pad&&p[0]<W+pad&&p[1]>-pad&&p[1]<H+pad;}
function refreshBackground(ms){
 const key=[Math.floor(ms/15000),settings.az,settings.alt,settings.roll,settings.fov,settings.lat,settings.lon,settings.milky,settings.aspect].join(',');if(key===bgKey)return;bgKey=key;
 const w=bg.width,h=bg.height,im=bgctx.createImageData(w,h),f=w/(2*Math.tan(settings.fov*D/2));
 const b=liveBasis,c=cam;
 // Galactic north and centre expressed in J2000 equatorial coordinates.
 const north=[-.867666149,-.198076373,.455983776],gx=[-.05487556,-.87343709,-.48383502],gy=[.49410943,-.44482963,.74698224];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=(x-w/2)/f,v=(h/2-y)/f,n=1/Math.sqrt(u*u+v*v+1);
  const lx=(c.forward[0]+u*c.right[0]+v*c.up[0])*n,ly=(c.forward[1]+u*c.right[1]+v*c.up[1])*n,lz=(c.forward[2]+u*c.right[2]+v*c.up[2])*n;
  const k=(y*w+x)*4;
  const ex=lx*b[0][0]+ly*b[1][0]+lz*b[2][0],ey=lx*b[0][1]+ly*b[1][1]+lz*b[2][1],ez=lx*b[0][2]+ly*b[1][2]+lz*b[2][2];
  const gb=Math.asin(clamp(ex*north[0]+ey*north[1]+ez*north[2],-1,1)),gl=Math.atan2(ex*gy[0]+ey*gy[1]+ez*gy[2],ex*gx[0]+ey*gx[1]+ez*gx[2]);
  const wave=.55+.17*Math.sin(gl*13+gb*32)+.12*Math.sin(gl*29-gb*71)+.07*Math.sin(gl*63+gb*123)+.05*Math.sin(gl*141-gb*271);
  const dust=1-.65*Math.exp(-Math.pow((gb-.022*Math.sin(gl*8))/.032,2))*(.6+.4*Math.sin(gl*7)**2);
  const band=Math.exp(-Math.pow(gb/.13,2))*(.55+.45*Math.exp(-Math.pow(gl/.8,2)))*wave*dust*settings.milky;
  im.data[k]=5+band*61;im.data[k+1]=10+band*62;im.data[k+2]=22+band*80;im.data[k+3]=255;
 }
 bgctx.putImageData(im,0,0);
}
function drawTrails(to){
 if(settings.spaceMode==='space'||settings.trail==='off'||pointer)return;
 if(to<trailTime){clearTrails();}
 // Fixed sampling makes seeking, replay and export use the same trail history.
 to=Math.floor((to+1e-7)*10)/10;const step=.1;
 if(!previous.length){const b=A.basis(settings.start,settings.lat,settings.lon);previous=trailStars.map(s=>project(s.v,b));}
 while(trailTime<to-1e-6){const next=Math.min(to,trailTime+step),delta=next-trailTime;
  if(settings.trail==='fade'){tc.globalAlpha=1;tc.globalCompositeOperation='destination-out';tc.fillStyle=`rgba(0,0,0,${1-Math.exp(-delta/8)})`;tc.fillRect(0,0,W,H);tc.globalCompositeOperation='source-over';}
  const b=A.basis(settings.start+next*settings.speed*1000,settings.lat,settings.lon);
  for(let i=0;i<trailStars.length;i++){const s=trailStars[i],p=project(s.v,b),old=previous[i];if(inside(p,100)&&inside(old,100)&&Math.hypot(p[0]-old[0],p[1]-old[1])<100){tc.globalAlpha=s.alpha*.72;tc.strokeStyle=s.color;tc.lineWidth=clamp(s.r*.64,.45,1.6);tc.beginPath();tc.moveTo(...old);tc.lineTo(...p);tc.stroke();}previous[i]=p;}
  trailTime=next;
 }
 tc.globalAlpha=1;
}
function drawGrid(){ctx.strokeStyle='#87a9b129';ctx.lineWidth=1;for(let alt=-75;alt<=75;alt+=15){ctx.beginPath();let last=false;for(let az=0;az<=360;az+=2){const v=[Math.cos(alt*D)*Math.sin(az*D),Math.cos(alt*D)*Math.cos(az*D),Math.sin(alt*D)],p=A.project(v,cam,W,H,settings.fov);if(inside(p,100)){if(last)ctx.lineTo(...p);else ctx.moveTo(...p);last=true;}else last=false;}ctx.stroke();}for(let az=0;az<360;az+=30){ctx.beginPath();let last=false;for(let alt=-90;alt<=90;alt+=2){const v=[Math.cos(alt*D)*Math.sin(az*D),Math.cos(alt*D)*Math.cos(az*D),Math.sin(alt*D)],p=A.project(v,cam,W,H,settings.fov);if(inside(p,100)){if(last)ctx.lineTo(...p);else ctx.moveTo(...p);last=true;}else last=false;}ctx.stroke();}}
function drawMeteors(t){for(const m of events){const q=(t-m.start)/m.life;if(q<0||q>1)continue;const w=renderViewport?renderViewport.width:W,h=renderViewport?renderViewport.height:H,x=(renderViewport?renderViewport.x:0)+(m.x+m.dx*q)*w,y=(renderViewport?renderViewport.y:0)+(m.y+m.dy*q)*h,tail=Math.min(q,.18);ctx.globalAlpha=Math.sin(q*Math.PI);const tx=x-m.dx*tail*w,ty=y-m.dy*tail*h;const g=ctx.createLinearGradient(tx,ty,x,y);g.addColorStop(0,'#c8e0ff00');g.addColorStop(1,'#f4faff');ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,1.1,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
function renderScene(){const ms=settings.start+elapsed*settings.speed*1000;liveBasis=settings.spaceMode==='space'?[[1,0,0],[0,1,0],[0,0,1]]:A.basis(ms,settings.lat,settings.lon);refreshBackground(ms);ctx.drawImage(bg,0,0,W,H);drawTrails(elapsed);ctx.drawImage(trails,0,0,W,H);ctx.globalAlpha=1;
 const assist=!recording||$('exportLabels').value==='yes';if(settings.grid&&assist&&settings.spaceMode!=='space')drawGrid();
 const observer=space.observer(ms,settings,elapsed,cam);
 if(settings.spaceMode==='space'){space.drawStars(ctx,ms,settings,observer,cam,W,H,settings.labels&&assist);if(settings.solar)space.drawBodies(ctx,ms,settings,observer,cam,W,H,null,settings.labels&&assist);dirty=false;return;}
 for(const s of stars){const p=project(s.v);if(!inside(p))continue;const altitude=Math.asin(clamp(A.horizontal(s.v,liveBasis)[2],-1,1)),flicker=U.scintillation(s.id,elapsed,altitude,settings.twinkle,true);ctx.globalAlpha=clamp(s.alpha*flicker,0,1);ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(p[0],p[1],s.r,0,Math.PI*2);ctx.fill();if(s.mag<1.5){const g=ctx.createRadialGradient(...p,0,...p,s.r*5);g.addColorStop(0,s.color+'77');g.addColorStop(1,s.color+'00');ctx.fillStyle=g;ctx.fillRect(p[0]-s.r*5,p[1]-s.r*5,s.r*10,s.r*10);}}
 ctx.globalAlpha=1;if(settings.labels&&assist){ctx.font='14px -apple-system, sans-serif';for(const s of stars){if(!names[s.id])continue;const p=project(s.v);if(!inside(p))continue;ctx.strokeStyle='#c4d8ad88';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(...p,9,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#d4e4c4';const text=names[s.id][0]+' · '+names[s.id][1],tw=ctx.measureText(text).width;ctx.fillText(text,clamp(p[0]+14,8,W-tw-8),clamp(p[1]-10,20,H-8));}}
 if(settings.solar)space.drawBodies(ctx,ms,settings,observer,cam,W,H,U.groundBasis(ms,settings.lat,settings.lon),settings.labels&&assist);
 drawMeteors(elapsed);dirty=false;
}
function fmt(t){return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;}
function updateUI(){
 $('play').textContent=playing?'Ⅱ 暂停':'▶ 播放';$('timeline').max=settings.duration;$('timeline').value=elapsed;$('elapsed').textContent=`${fmt(elapsed)} / ${fmt(settings.duration)}`;
 const ms=settings.start+elapsed*settings.speed*1000;$('skyTime').textContent=A.localISO(ms,settings.offset).replace('T',' ')+` UTC${settings.offset>=0?'+':''}${settings.offset}`;
 $('spanReadout').textContent=`${settings.duration}秒成片 · 天空经过 ${(settings.duration*settings.speed/60).toFixed(settings.speed===1?1:0)} 分钟`;
 $('spaceInfo').textContent=settings.spaceMode==='space'?`三维漫游 · 距太阳 ${U.formatDistance(U.norm(space.observer(ms,settings,elapsed,cam)))} · 大气闪烁 / 流星 / 地面星轨已停用${settings.fly?' · 自动飞行':''}`:`地面全景 · 大气闪烁${settings.twinkle?'开启':'关闭'} · 下半球为透视展示，不是地面实际可见区域`;
 $('twinkle').disabled=settings.spaceMode==='space';$('fly').disabled=settings.spaceMode!=='space';
 $('modeBadge').textContent=`● ${settings.spaceMode==='space'?'三维漫游 · ':''}${settings.trail==='off'?'点状星空':'星轨'} · ${settings.speed}×`;
 $('viewReadout').textContent=`${settings.spaceMode==='space'?'惯性朝向':'方位'} ${settings.az.toFixed(1)}° · 仰角 ${settings.alt.toFixed(1)}° · 旋转 ${settings.roll.toFixed(1)}° · 视野 ${settings.fov}°`;
 $('fovValue').value=settings.fov+'°';$('realtime').classList.toggle('active',settings.speed===1&&settings.trail==='off');$('startrail').classList.toggle('active',settings.trail!=='off');
 if(recording&&!recording.phase){$('exportProgress').value=elapsed/settings.duration;status(`${recording.offline?'逐帧生成':'录制中'} ${fmt(elapsed)} / ${fmt(settings.duration)} · 请保持此页可见`);}
}
function frame(now){if(playing&&now-lastDraw<31){requestAnimationFrame(frame);return;}lastDraw=now;if(!lastNow)lastNow=now;const dt=(now-lastNow)/1000;lastNow=now;if(playing){elapsed=Math.min(settings.duration,elapsed+dt);dirty=true;}if(dirty){render();updateUI();}if(playing&&elapsed>=settings.duration){playing=false;if(recording)finishRecording(false);updateUI();}requestAnimationFrame(frame);}
function compose(){const b=settings.spaceMode==='space'?[[1,0,0],[0,1,0],[0,0,1]]:A.basis(settings.start+elapsed*settings.speed*1000,settings.lat,settings.lon),target=stars.filter(s=>[91262,97649,102098].includes(s.id));const v=[0,0,0];for(const s of target){const h=A.horizontal(s.v,b);for(let i=0;i<3;i++)v[i]+=h[i];}const n=Math.hypot(...v);cam=A.camera(A.wrap(Math.atan2(v[0],v[1])/D),Math.asin(clamp(v[2]/n,-1,1))/D);settings.fov=settings.aspect==='portrait'?75:92;syncView();status('已对准夏季大三角，可向任意方向继续转动。');}
function syncView(){Object.assign(settings,A.cameraAngles(cam));for(const id of ['az','alt','roll'])$(id).value=settings[id].toFixed(1);$('fov').value=settings.fov;clearTrails();bgKey='';dirty=true;if(isImmersive())sizeImmersive();updateUI();savePreferences();}
for(const el of $('controls').querySelectorAll('input,select')){
 const onChange=()=>{if(['codec','container'].includes(el.id)){saveHandle=null;$('saveLocation').textContent='格式已改变，请重新选择保存位置';}changed({reset:['lat','lon','date','offset','speed'].includes(el.id),view:['az','alt','roll'].includes(el.id)});};
 el.addEventListener(el.type==='range'?'input':'change',onChange);
}

const moveKeys={w:['forward',1],s:['forward',-1],a:['right',-1],d:['right',1],r:['up',1],f:['up',-1]};
function aimAtTarget(){const ms=settings.start+elapsed*settings.speed*1000,target=space.target($('destination').value,ms);if(!target)return;const observer=space.observer(ms,settings,elapsed,cam),rel=U.sub(target.pos,observer),v=settings.spaceMode==='space'?rel:U.toGround(rel,ms,settings.lat,settings.lon);cam=A.camera(A.wrap(Math.atan2(v[0],v[1])/D),Math.asin(v[2]/U.norm(v))/D);syncView();status('已对准 '+target.name+' · 距离 '+U.formatDistance(U.norm(rel)));}
function moveSpace(axis,sign){if(recording)return;if(settings.spaceMode!=='space'){status('请先切换到三维漫游模式。');return;}playing=false;const ms=settings.start+elapsed*settings.speed*1000;const current=space.observer(ms,settings,elapsed,cam);space.position=current;space.move(cam[axis],sign*settings.moveStep,ms,settings);if(settings.fly)space.position=U.sub(space.position,U.scale(cam.forward,settings.moveStep*elapsed));clearTrails();dirty=true;updateUI();savePreferences();}
for(const [id,axis,sign]of [['moveForward','forward',1],['moveBack','forward',-1],['moveLeft','right',-1],['moveRight','right',1],['moveUp','up',1],['moveDown','up',-1]])$(id).onclick=()=>moveSpace(axis,sign);
$('aimTarget').onclick=()=>{playing=false;aimAtTarget();};
$('visitTarget').onclick=()=>{if(recording)return;playing=false;const ms=settings.start+elapsed*settings.speed*1000;$('spaceMode').value='space';$('fly').checked=false;changed({reset:false});space.visit($('destination').value,ms,settings);aimAtTarget();};
$('returnEarth').onclick=()=>{$('spaceMode').value='sky';$('fly').checked=false;changed({reset:false});compose();};

$('upright').onclick=()=>{const angles=A.cameraAngles(cam);cam=A.camera(angles.az,angles.alt);syncView();status('已将画面回正，朝向与播放进度保持不变。');};
const immersiveCanvas=$('immersiveSky'),workspace=$('workspace'),transport=$('transport');
let immersiveBuffers=null,immersiveGeometry=null,renderViewport=null,hideControlsTimer=null,controlsHeld=false,controlsHovered=false,keyboardControls=false,showExportFrame=true;
function isImmersive(){return document.fullscreenElement===workspace;}
function sizeImmersive(){
 if(!isImmersive())return;
 const width=workspace.clientWidth||window.innerWidth,height=workspace.clientHeight||window.innerHeight;
 immersiveGeometry=ImmersiveView.geometry(width,height,W,H,settings.fov);
 const ratio=Math.min(window.devicePixelRatio||1,2);immersiveCanvas.width=Math.round(width*ratio);immersiveCanvas.height=Math.round(height*ratio);
 const g=immersiveGeometry.frame;Object.assign($('exportFrame').style,{left:g.x+'px',top:g.y+'px',width:g.width+'px',height:g.height+'px'});
 immersiveBuffers=null;dirty=true;
}
function render(){
 if(!isImmersive()||recording){renderScene();return;}
 if(!immersiveGeometry)sizeImmersive();
 const geometry=immersiveGeometry;
 if(!immersiveBuffers){const b=document.createElement('canvas'),t=document.createElement('canvas');b.width=640;b.height=Math.max(1,Math.round(640*geometry.height/geometry.width));t.width=immersiveCanvas.width;t.height=immersiveCanvas.height;
 immersiveBuffers={bg:b,bgctx:b.getContext('2d'),trails:t,tc:t.getContext('2d'),bgKey:'',trailTime:0,previous:[]};}
 const saved={ctx,bg,bgctx,trails,tc,W,H,settings,bgKey,trailTime,previous,renderViewport};
 try{
  ({bg,bgctx,trails,tc,bgKey,trailTime,previous}=immersiveBuffers);ctx=immersiveCanvas.getContext('2d',{alpha:false});W=geometry.width;H=geometry.height;
  settings={...settings,fov:geometry.fov};renderViewport=geometry.renderFrame;
  const scale=immersiveCanvas.width/W;ctx.setTransform(scale,0,0,scale,0,0);tc.setTransform(scale,0,0,scale,0,0);renderScene();
  Object.assign(immersiveBuffers,{bgKey,trailTime,previous});
 }finally{({ctx,bg,bgctx,trails,tc,W,H,settings,bgKey,trailTime,previous,renderViewport}=saved);}
}
function revealControls(){if(!isImmersive())return;clearTimeout(hideControlsTimer);hideControlsTimer=null;workspace.classList.toggle('controls-visible',true);}
function scheduleHideControls(){
 if(!isImmersive()||hideControlsTimer!==null)return;
 hideControlsTimer=setTimeout(()=>{hideControlsTimer=null;if(controlsHeld||controlsHovered||(keyboardControls&&transport.contains(document.activeElement)))return;
  if(transport.contains(document.activeElement))immersiveCanvas.focus();
  workspace.classList.toggle('controls-visible',false);
 },1400);
}
function onImmersiveChange(){clearTimeout(hideControlsTimer);hideControlsTimer=null;controlsHeld=false;controlsHovered=false;keyboardControls=false;immersiveGeometry=null;immersiveBuffers=null;
 $('immersive').textContent=isImmersive()?'退出沉浸 · Esc':'沉浸取景';workspace.classList.toggle('controls-visible',false);
 if(isImmersive()){sizeImmersive();immersiveCanvas.focus();}else{$('immersive').focus();dirty=true;}
}
$('immersive').onclick=async()=>{try{if(isImmersive())await document.exitFullscreen();else await workspace.requestFullscreen();}catch(e){status('无法进入全屏：'+e.message);}};
document.addEventListener('fullscreenchange',onImmersiveChange);
window.addEventListener('resize',sizeImmersive);
workspace.addEventListener('pointermove',e=>{if(!isImmersive())return;const bounds=workspace.getBoundingClientRect();if(e.clientY>bounds.bottom-100){revealControls();}else scheduleHideControls();});
workspace.addEventListener('pointerleave',scheduleHideControls);
transport.addEventListener('pointerenter',()=>{controlsHovered=true;revealControls();});
transport.addEventListener('pointerleave',()=>{controlsHovered=false;scheduleHideControls();});
transport.addEventListener('pointerdown',()=>{keyboardControls=false;controlsHeld=true;revealControls();});
for(const event of ['pointerup','pointercancel'])document.addEventListener(event,()=>{controlsHeld=false;scheduleHideControls();});
transport.addEventListener('focusin',revealControls);transport.addEventListener('focusout',scheduleHideControls);
workspace.addEventListener('keydown',e=>{if(isImmersive()&&e.key==='Tab'){keyboardControls=true;revealControls();}});
immersiveCanvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){revealControls();scheduleHideControls();}});
$('frameToggle').onclick=()=>{showExportFrame=!showExportFrame;$('exportFrame').hidden=!showExportFrame;$('frameToggle').textContent=showExportFrame?'隐藏取景框':'显示取景框';$('frameToggle').setAttribute('aria-pressed',String(showExportFrame));savePreferences();};
$('realtime').onclick=()=>{$('speed').value='1';$('trail').value='off';changed();};
$('startrail').onclick=()=>{$('speed').value='120';$('trail').value='all';changed();};
$('compose').onclick=()=>{playing=false;compose();};
$('play').onclick=()=>{if(elapsed>=settings.duration){elapsed=0;clearTrails();}playing=!playing;lastNow=performance.now();dirty=true;updateUI();};
$('restart').onclick=()=>{elapsed=0;clearTrails();bgKey='';dirty=true;};
$('timeline').oninput=()=>{playing=false;elapsed=Number($('timeline').value);dirty=true;};
$('snapshot').onclick=()=>{renderScene();if(isImmersive())dirty=true;canvas.toBlob(blob=>{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`星野-${canvas.width}x${canvas.height}-取景.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);});};
canvas.onpointerdown=e=>{if(recording||pointer||!e.isPrimary)return;playing=false;pointer={x:e.clientX,y:e.clientY};const surface=e.currentTarget||canvas;surface.setPointerCapture(e.pointerId);surface.focus();updateUI();};
canvas.onpointermove=e=>{if(!pointer||recording)return;const surface=e.currentTarget||canvas,scale=(surface===immersiveCanvas&&immersiveGeometry?immersiveGeometry.fov:settings.fov)/surface.clientWidth;cam=A.turnCamera(cam,(e.clientX-pointer.x)*scale,(e.clientY-pointer.y)*scale);pointer={x:e.clientX,y:e.clientY};syncView();};
canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=()=>{pointer=null;dirty=true;};
function zoomSky(e){e.preventDefault();if(recording)return;settings.fov=Math.round(clamp(settings.fov+e.deltaY*.04,30,120));syncView();}canvas.addEventListener('wheel',zoomSky,{passive:false});
canvas.onkeydown=e=>{if(recording)return;if(settings.spaceMode==='space'&&moveKeys[e.key.toLowerCase()]){e.preventDefault();moveSpace(...moveKeys[e.key.toLowerCase()]);return;}const d={ArrowLeft:[1,0,0],ArrowRight:[-1,0,0],ArrowUp:[0,1,0],ArrowDown:[0,-1,0],q:[0,0,-1],e:[0,0,1]}[e.key];if(!d)return;e.preventDefault();cam=A.turnCamera(cam,...d.map(v=>v*(e.shiftKey?5:1)));syncView();};
for(const name of ['onpointerdown','onpointermove','onpointerup','onpointercancel','onlostpointercapture','onkeydown'])immersiveCanvas[name]=canvas[name];
immersiveCanvas.addEventListener('wheel',zoomSky,{passive:false});
$('resetPreset').onclick=()=>{const preset={spaceMode:'sky',fly:false,place:'Cougar 附近 · 华盛顿州',lat:46.05,lon:-122.30,date:'2026-07-18T22:54:00',offset:-7,speed:1,trail:'off',duration:60,aspect:'photo',magnitude:8.5,milky:1,meteors:5,seed:718};for(const [k,v]of Object.entries(preset)){if($(k).type==='checkbox')$(k).checked=v;else $(k).value=v;}changed();compose();};
function lock(yes){$('controls').disabled=yes;for(const id of ['play','restart','timeline','snapshot','resetPreset','export','immersive','chooseSave'])$(id).disabled=yes;$('cancel').hidden=!yes;$('cancel').textContent='取消导出';$('exportProgress').hidden=!yes;}
function finishRecording(cancel){if(!recording)return;playing=false;recording.cancel=cancel;if(cancel&&recording.controller){recording.controller.abort();if(recording.jobId)fetch('/api/jobs/'+recording.jobId,{method:'DELETE',headers:{'X-StarSky-Token':window.STARSKY_SERVICE.token}}).catch(()=>{});}if(recording.offline)return;if(recording.rec.state!=='inactive')recording.rec.stop();}
function exportTimestamp(now=new Date()){
 const pad=n=>String(n).padStart(2,'0');
 return String(now.getFullYear())+pad(now.getMonth()+1)+pad(now.getDate())+pad(now.getHours())+pad(now.getMinutes());
}
async function chooseOutput(){
 if(!window.showSaveFilePicker)throw Error('请选择桌面Chrome或Edge，以便指定保存文件夹');
 const ext=$('container').value,mime=ext==='mov'?'video/quicktime':'video/mp4';
 const handle=await window.showSaveFilePicker({id:'starsky-video',suggestedName:`星野-${exportTimestamp()}-${canvas.width}x${canvas.height}-${$('duration').value}秒-${$('codec').value==='hevc'?'H265':'H264'}.${ext}`,types:[{description:ext.toUpperCase()+' 视频',accept:{[mime]:['.'+ext]}}],excludeAcceptAllOption:true});
 if(!handle.name.toLowerCase().endsWith('.'+ext))throw Error('文件名需以 .'+ext+' 结尾');
 saveHandle=handle;$('saveLocation').textContent='已选择：'+handle.name+'（保存到所选文件夹）';
}
$('chooseSave').onclick=async()=>{
 try{await chooseOutput();}
 catch(e){const message=e.name==='AbortError'?'已取消选择，原保存位置未更改。':e.name==='SecurityError'?'此窗口不允许选择文件，请在独立的桌面 Chrome 或 Edge 中打开本地网址。':e.message;
  $('saveLocation').textContent=message;status(message);}
};
async function saveFinal(source,job){
 const service=window.STARSKY_SERVICE;if(!service?.available)throw Error('请通过“启动星野.command”打开本地导出服务');
 job.jobId=crypto.randomUUID();job.controller=new AbortController();job.phase='encode';
 status(`正在本机编码 ${settings.codec==='hevc'?'H.265':'H.264'} / ${settings.container.toUpperCase()}…`);
 const fmt=settings.codec+(settings.container==='mov'?'_mov':'');
 $('exportProgress').value=0;
 const started=performance.now();let polling=false,monitoring=true;
 const poll=async()=>{if(polling||job.cancel)return;polling=true;try{
  const r=await fetch('/api/jobs/'+job.jobId,{headers:{'X-StarSky-Token':service.token},signal:job.controller.signal});
  if(!r.ok)return;const p=await r.json();if(!monitoring)return;const seconds=p.elapsed??Math.round((performance.now()-started)/1000);
  const percent=p.total_frames?Math.min(99,Math.floor(100*p.frame/p.total_frames)):0;
  $('exportProgress').value=percent/100;
  status(p.phase==='uploading'?`正在传送到本机编码器 · 已耗时 ${seconds}秒`:p.phase==='saving'?`正在封装并保存文件 · 已耗时 ${seconds}秒`:`本机编码 ${settings.codec==='hevc'?'H.265':'H.264'} / ${settings.container.toUpperCase()} · ${percent}% · ${p.frame||0}/${p.total_frames||'?'}帧 · 已耗时 ${seconds}秒${p.encoder?.startsWith('lib')?' · 软件编码':''}`);
 }catch(e){/* The export request below reports connection failures. */}finally{polling=false;}};
 const timer=setInterval(poll,1000);let blob;
 try{
  const response=await fetch('/api/transcode?format='+fmt+'&job='+job.jobId+'&frames='+Math.round(settings.duration*30),{method:'POST',headers:{'Content-Type':'application/octet-stream','X-StarSky-Token':service.token},body:source,signal:job.controller.signal});
  if(!response.ok){const err=await response.json();throw Error(err.error||'本地编码失败');}
  blob=await response.blob();
 }finally{monitoring=false;clearInterval(timer);}
 if(job.cancel)throw new DOMException('导出已取消','AbortError');
 status('编码完成，正在写入所选文件…');$('exportProgress').value=1;
 if(videoURL)URL.revokeObjectURL(videoURL);videoURL=URL.createObjectURL(blob);
 const a=$('download');a.href=videoURL;a.download=saveHandle.name;a.textContent='下载已生成的 '+settings.container.toUpperCase()+' 副本';a.hidden=false;
 const writer=await saveHandle.createWritable();try{await writer.write(blob);if(job.cancel){await writer.abort();throw new DOMException('导出已取消','AbortError');}await writer.close();}catch(e){try{await writer.abort();}catch(_){}throw e;}
 $('saveLocation').textContent='已保存：'+saveHandle.name;status(`已保存 ${settings.container.toUpperCase()} · ${settings.codec==='hevc'?'H.265':'H.264'} · ${canvas.width}×${canvas.height} · ${settings.duration}秒。`);
}
async function exportFrames(){
 let config;
 try{
  const base={width:canvas.width,height:canvas.height,bitrate:settings.quality==='4k'?40000000:settings.quality==='1080p'?12000000:8000000,framerate:30,latencyMode:'realtime',avc:{format:'avc'}};
  for(const codec of (canvas.width*canvas.height>3840*2160?['avc1.64003c','avc1.420034']:['avc1.420033','avc1.640033'])){
   const probe=await VideoEncoder.isConfigSupported({...base,codec});if(probe.supported){config=probe.config;break;}
  }
  if(!config){const vp={...base,codec:'vp09.00.60.08'};delete vp.avc;const probe=await VideoEncoder.isConfigSupported(vp);if(probe.supported)config=probe.config;}
 }catch(e){return false;}
 if(!config)return false;
 const job={offline:true,cancel:false,error:null},samples=[];let encoder,description;
 try{
  settings=readSettings();playing=false;elapsed=0;clearTrails();buildMeteors();bgKey='';recording=job;lock(true);$('download').hidden=true;
  encoder=new VideoEncoder({output(chunk,meta){const data=new Uint8Array(chunk.byteLength);chunk.copyTo(data);samples.push({data,key:chunk.type==='key',timestamp:chunk.timestamp});if(meta?.decoderConfig?.description)description=new Uint8Array(meta.decoderConfig.description).slice();},error(e){job.error=e;}});
  encoder.configure(config);const count=Math.round(settings.duration*30);
  for(let i=0;i<count;i++){
   if(job.cancel||job.error)break;
   elapsed=i/30;render();updateUI();const vf=new VideoFrame(canvas,{timestamp:Math.round(i*1000000/30),duration:Math.round(1000000/30)});
   try{encoder.encode(vf,{keyFrame:i%60===0});}finally{vf.close();}
   if(encoder.encodeQueueSize>4)await encoder.flush();
   await new Promise(requestAnimationFrame);
  }
  if(job.error)throw job.error;
  if(!job.cancel){await encoder.flush();if(job.error)throw job.error;if(samples.length!==count)throw Error('编码帧数不完整');
   for(let i=1;i<samples.length;i++)if(samples[i].timestamp<samples[i-1].timestamp)throw Error('编码器返回了不支持的重排序帧');
   const isVP9=config.codec.startsWith('vp09');const blob=isVP9?muxVP9(samples,canvas.width,canvas.height,30):muxAVC(samples,description,canvas.width,canvas.height,30);
   await saveFinal(blob,job);elapsed=settings.duration;
  }else status('生成已取消，未保存视频。');
 }catch(e){status(e.name==='AbortError'?'导出已取消，未写入目标文件。':'导出失败：'+e.message);}
 finally{if(encoder&&encoder.state!=='closed')encoder.close();recording=null;lock(false);dirty=true;}
 return true;
}
$('export').onclick=async()=>{
 if(preparing||recording)return;
 try{settings=readSettings();}catch(e){status(e.message);return;}
 if(!window.STARSKY_SERVICE?.available){status('完整导出需要本地服务：请双击文件夹中的“启动星野.command”。');return;}
 preparing=true;lock(true);let offlineHandled=false;
 try{if(!saveHandle)await chooseOutput();}catch(e){preparing=false;lock(false);if(e.name!=='AbortError')status(e.message);return;}
 try{if(window.VideoEncoder&&window.VideoFrame)offlineHandled=await exportFrames();}finally{preparing=false;if(!recording)lock(false);}
 if(offlineHandled)return;
 if(!window.MediaRecorder||!canvas.captureStream){status('此浏览器不支持视频录制，请在桌面 Chrome 中打开。');return;}
 const mime=['video/mp4;codecs=avc1.640033','video/mp4','video/webm;codecs=vp8','video/webm;codecs=vp9'].find(t=>MediaRecorder.isTypeSupported(t));if(!mime){status('未找到浏览器支持的视频编码。');return;}
 try{settings=readSettings();elapsed=0;clearTrails();bgKey='';buildMeteors();const stream=canvas.captureStream(30),rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:settings.quality==='4k'?40000000:settings.quality==='1080p'?12000000:8000000}),job={rec,stream,chunks:[],cancel:false};recording=job;lock(true);$('download').hidden=true;render();
 rec.ondataavailable=e=>{if(e.data.size)job.chunks.push(e.data);};
 rec.onerror=()=>{status('录制失败，请重试或换用 Chrome。');finishRecording(true);};
 rec.onstop=async()=>{job.stream.getTracks().forEach(t=>t.stop());if(job.cancel){recording=null;lock(false);dirty=true;status('导出已取消，未写入目标文件。');return;}try{await saveFinal(new Blob(job.chunks,{type:mime}),job);}catch(e){status(e.name==='AbortError'?'导出已取消，未写入目标文件。':'导出失败：'+e.message);}finally{recording=null;lock(false);dirty=true;}};
 rec.start(1000);lastNow=performance.now();playing=true;dirty=true;
 }catch(e){if(recording){recording.stream.getTracks().forEach(t=>t.stop());recording=null;}lock(false);status('无法开始录制：'+e.message);}
};
$('cancel').onclick=()=>finishRecording(true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(recording)finishRecording(true);playing=false;lastNow=0;dirty=true;}});
window.addEventListener('beforeunload',e=>{if(recording){e.preventDefault();e.returnValue='';}});
try{const restored=restorePreferences();changed({view:restored});if(!restored)compose();preferencesReady=true;savePreferences();status(`360°完整球形星空 · ${STAR_CATALOG.length.toLocaleString()}颗恒星。上下左右均可连续转动。`);requestAnimationFrame(frame);}catch(e){status('初始化失败：'+e.message);}
