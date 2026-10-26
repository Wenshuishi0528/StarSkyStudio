const assert=require('node:assert/strict');
const fs=require('node:fs');
const {GalaxyBackground,galacticDirection,cameraInJ2000,textureLevel}=require('./galaxy.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const gx=[-.05487556,-.87343709,-.48383502],gz=[-.867666149,-.198076373,.455983776];
galacticDirection(gx).forEach((x,i)=>near(x,i===0?1:0));
galacticDirection(gz).forEach((x,i)=>near(x,i===2?1:0));
const cam={forward:[0,0,1],right:[1,0,0],up:[0,1,0]},basis=[[0,1,0],[0,0,1],[1,0,0]];
assert.deepEqual(cameraInJ2000(cam,basis),{forward:[1,0,0],right:[0,1,0],up:[0,0,1]});
assert.deepEqual([8192,4096,2048,1024,512].map(textureLevel),[16,16,8,4,0]);

// Read JPEG headers without decoding 100 million pixels during tests.
function dimensions(file){
 const b=fs.readFileSync(file);let i=2;
 while(i<b.length){assert.equal(b[i++],255);while(b[i]===255)i++;const marker=b[i++],size=b.readUInt16BE(i);
  if([0xc0,0xc1,0xc2].includes(marker))return [b.readUInt16BE(i+5),b.readUInt16BE(i+3)];i+=size;
 }throw Error('JPEG dimensions missing');
}
for(const level of [16,8,4])for(const face of ['px','nx','py','ny','pz','nz'])assert.deepEqual(dimensions(__dirname+`/data/sky/milkyway-${level}k-${face}.jpg`),[level*256,level*256]);

let limit=4096,closed=0,uploads=0,draws=0,deleted=0;
function mockGL(){
 const constants=['COMPILE_STATUS','LINK_STATUS','MAX_CUBE_MAP_TEXTURE_SIZE','MAX_VIEWPORT_DIMS','MAX_RENDERBUFFER_SIZE','VERTEX_SHADER','FRAGMENT_SHADER','ARRAY_BUFFER','STATIC_DRAW','TEXTURE_CUBE_MAP','TEXTURE_CUBE_MAP_POSITIVE_X','RGB','UNSIGNED_BYTE','UNPACK_FLIP_Y_WEBGL','UNPACK_PREMULTIPLY_ALPHA_WEBGL','UNPACK_COLORSPACE_CONVERSION_WEBGL','NONE','TEXTURE_WRAP_S','TEXTURE_WRAP_T','CLAMP_TO_EDGE','TEXTURE_MAG_FILTER','TEXTURE_MIN_FILTER','LINEAR','LINEAR_MIPMAP_LINEAR','TEXTURE0','FLOAT','TRIANGLES'];
 const gl=Object.fromEntries(constants.map((key,i)=>[key,i+100]));gl.NO_ERROR=0;
 Object.assign(gl,{getParameter:k=>k===gl.MAX_CUBE_MAP_TEXTURE_SIZE?limit:k===gl.MAX_VIEWPORT_DIMS?[8192,8192]:8192,getShaderParameter:()=>true,getProgramParameter:()=>true,getError:()=>0,isContextLost:()=>false,
  createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),createTexture:()=>({}),getUniformLocation:(_,key)=>key,getAttribLocation:()=>0,texImage2D:()=>uploads++,drawArrays:()=>draws++,deleteTexture:()=>deleted++});
 return new Proxy(gl,{get:(obj,key)=>key in obj?obj[key]:()=>{}});
}
global.document={createElement:()=>({width:1,height:1,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},getContext(){return this.gl??=mockGL();}})};
global.fetch=async(url)=>({ok:true,blob:async()=>({url})});
global.createImageBitmap=async blob=>{const size=Number(blob.url.match(/milkyway-(\d+)k/)[1])*256;return {width:size,height:size,close(){closed++;}};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const states=[],galaxy=new GalaxyBackground(status=>states.push(status.state));
 assert.equal(await galaxy.setEnabled(true),true);assert.equal(galaxy.status.size,16);assert.equal(uploads,6);assert.equal(closed,6);
 const calls=[],ctx={drawImage(...args){calls.push(args);}},options={width:1920,height:1080,displayWidth:3840,displayHeight:2160,camera:cam,basis,fov:90,brightness:1};
 assert.equal(galaxy.draw(ctx,options),true);assert.equal(galaxy.draw(ctx,options),true);assert.equal(draws,1);assert.deepEqual(calls[0].slice(1),[0,0,3840,2160]);
 galaxy.draw(ctx,{...options,brightness:.5});assert.equal(draws,2);
 await galaxy.setEnabled(false);assert.equal(galaxy.texture,null);assert.equal(galaxy.canvas.width,1);assert.equal(deleted,1);assert.equal(galaxy.draw(ctx,options),false);
 limit=2048;const limited=new GalaxyBackground();assert.equal(await limited.setEnabled(true),true);assert.equal(limited.status.size,8);await limited.setEnabled(false);
 limit=512;const unsupported=new GalaxyBackground();assert.equal(await unsupported.setEnabled(true),false);assert.equal(unsupported.status.state,'unsupported');
 limit=4096;

 // A decode completing after disable must never resurrect the old background.
 let release;const pending=new GalaxyBackground();pending.decode=()=>new Promise(resolve=>{release=()=>resolve({width:4096,height:4096,close(){closed++;}});});
 const old=pending.setEnabled(true);await tick();await pending.setEnabled(false);release();assert.equal(await old,false);assert.equal(pending.status.state,'off');assert.equal(pending.texture,null);

 // Context restoration rebuilds resources, while errors leave a usable fallback path.
 const recovered=new GalaxyBackground();await recovered.setEnabled(true);recovered.canvas.listeners.webglcontextlost({preventDefault(){}});assert.equal(recovered.status.state,'lost');assert.equal(recovered.draw(ctx,options),false);
 recovered.canvas.listeners.webglcontextrestored();assert.equal(await recovered.ready,true);assert.equal(recovered.status.state,'ready');
 recovered.draw(ctx,{...options,width:10000});assert.equal(recovered.status.state,'error');
 const failed=new GalaxyBackground();failed.decode=async()=>{throw Error('network-offline');};assert.equal(await failed.setEnabled(true),false);assert.equal(failed.status.state,'error');assert.equal(failed.texture,null);
 console.log('PASS: native cube dimensions, galactic axes, J2000 camera transform, capability fallback, load/release/race/context recovery, cached draw and output dimensions.');
})().catch(error=>{console.error(error);process.exitCode=1;});
