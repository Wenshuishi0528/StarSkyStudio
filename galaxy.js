// NASA SVS Deep Star Maps 2020; cube faces prepared by Tiangong Orbit Simulator.
// This renderer draws only the distant background. Foreground stars remain StarSky's.
(function(root){
 'use strict';
 const faces=['px','nx','py','ny','pz','nz'];
 const axes=[[-.05487556,-.87343709,-.48383502],[.49410943,-.44482963,.74698224],[-.867666149,-.198076373,.455983776]];
 const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
 const galacticDirection=v=>axes.map(axis=>dot(axis,v));
 const cameraInJ2000=(camera,basis)=>Object.fromEntries(['forward','right','up'].map(key=>[key,[0,1,2].map(j=>camera[key].reduce((sum,x,i)=>sum+x*basis[i][j],0))]));
 const textureLevel=max=>max>=4096?16:max>=2048?8:max>=1024?4:0;
 const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
 const fragment=`precision highp float;
 uniform samplerCube skyMap;
 uniform vec2 viewport;
 uniform vec3 forward,right,up;
 uniform float halfFov,brightness;
 vec3 linearize(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
 vec3 encode(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
 void main(){
  vec2 p=(gl_FragCoord.xy/viewport-.5)*2.;
  vec3 d=normalize(forward+right*p.x*halfFov+up*p.y*halfFov*viewport.y/viewport.x);
  vec3 g=vec3(dot(d,vec3(-.05487556,-.87343709,-.48383502)),dot(d,vec3(.49410943,-.44482963,.74698224)),dot(d,vec3(-.867666149,-.198076373,.455983776)));
  vec3 color=encode(linearize(textureCube(skyMap,g).rgb)*brightness);
  gl_FragColor=vec4(clamp(color,0.,1.),1.);
 }`;

 class GalaxyBackground{
  constructor(onChange=()=>{}){
   this.onChange=onChange;this.enabled=false;this.ticket=0;this.status={state:'off',size:0,faceSize:0};this.ready=Promise.resolve(false);this.queue=Promise.resolve();
  }
  report(state,extra={}){this.status={...this.status,state,...extra};this.onChange(this.status);}
  init(){
   if(this.gl)return true;
   if(!this.canvas){
    this.canvas=document.createElement('canvas');this.canvas.width=this.canvas.height=1;
    this.canvas.addEventListener('webglcontextlost',event=>{
     event.preventDefault();this.ticket++;this.abort?.abort();this.texture=null;this.program=null;this.buffer=null;this.gl=null;this.lost=true;this.report('lost',{error:'context-lost'});
    });
    this.canvas.addEventListener('webglcontextrestored',()=>{
     this.lost=false;const wanted=this.enabled;this.enabled=false;if(wanted)this.setEnabled(true);
    });
   }
   if(this.lost)return false;
   // Retain the offscreen frame so static views can be composited without another GPU draw.
   const gl=this.canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true});
   if(!gl)return false;
   this.gl=gl;
   const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(message||'shader-compile');}return shader;};
   let vs,fs,program;
   try{
    vs=compile(gl.VERTEX_SHADER,vertex);fs=compile(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'shader-link');
    this.program=program;this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    this.uniforms=Object.fromEntries(['skyMap','viewport','forward','right','up','halfFov','brightness'].map(name=>[name,gl.getUniformLocation(program,name)]));
    this.position=gl.getAttribLocation(program,'position');
    this.maxSize=gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);this.maxViewport=gl.getParameter(gl.MAX_VIEWPORT_DIMS);this.maxBuffer=gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    return true;
   }catch(error){if(program)gl.deleteProgram(program);this.gl=null;throw error;}
   finally{if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);}
  }
  release(){
   if(this.texture&&this.gl)this.gl.deleteTexture(this.texture);
   this.texture=null;this.renderKey='';
   if(this.canvas)this.canvas.width=this.canvas.height=1;
  }
  setEnabled(value){
   value=Boolean(value);
   if(value===this.enabled&&(this.status.state==='loading'||this.status.state==='ready'||!value))return this.ready;
   this.enabled=value;const ticket=++this.ticket;this.abort?.abort();this.release();
   if(!value){this.report('off',{size:0,faceSize:0,error:null});this.ready=Promise.resolve(false);return this.ready;}
   if(this.lost){this.report('lost',{error:'context-lost'});this.ready=Promise.resolve(false);return this.ready;}
   this.report('loading',{size:0,faceSize:0,error:null});
   // One decode/upload sequence at a time, including when users switch quickly.
   this.ready=this.queue=this.queue.catch(()=>{}).then(()=>this.load(ticket));
   return this.ready;
  }
  async decode(url,signal){
   const response=await fetch(url,{signal});if(!response.ok)throw Error('texture-http-'+response.status);
   const blob=await response.blob();
   if(typeof createImageBitmap==='function')return createImageBitmap(blob,{imageOrientation:'none',premultiplyAlpha:'none',colorSpaceConversion:'none'});
   const objectURL=URL.createObjectURL(blob);
   try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('texture-decode'));image.src=objectURL;});}
   finally{URL.revokeObjectURL(objectURL);}
  }
  async load(ticket){
   if(ticket!==this.ticket||!this.enabled)return false;
   let texture,gl;
   try{
    if(!this.init()){this.report('unsupported',{error:'webgl-unavailable'});return false;}
    gl=this.gl;const size=textureLevel(this.maxSize);
    if(!size){this.report('unsupported',{error:'cube-map-limit'});return false;}
    const faceSize=size*256;this.abort=new AbortController();texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
    for(let i=0;i<faces.length;i++){
     const image=await this.decode('data/sky/milkyway-'+size+'k-'+faces[i]+'.jpg',this.abort.signal);
     try{
      if(ticket!==this.ticket||!this.enabled||this.lost)return false;
      if(image.width!==faceSize||image.height!==faceSize)throw Error('texture-dimensions');
      gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
      if(gl.getError()!==gl.NO_ERROR)throw Error('texture-upload');
     }finally{if(image.close)image.close();else image.src='';}
    }
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    if(gl.getError()!==gl.NO_ERROR)throw Error('texture-mipmap');
    if(ticket!==this.ticket||this.lost)return false;
    this.texture=texture;texture=null;this.report('ready',{size,faceSize,error:null});return true;
   }catch(error){if(ticket===this.ticket&&this.enabled&&!this.lost)this.report('error',{error:String(error.message||error)});return false;}
   finally{if(texture&&gl)gl.deleteTexture(texture);}
  }
  draw(ctx,{width,height,displayWidth=width,displayHeight=height,camera,basis,fov,brightness=1}){
   if(!this.enabled||!this.texture||this.status.state!=='ready'||this.lost)return false;
   const gl=this.gl;
   if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>Math.min(this.maxBuffer,this.maxViewport[0])||height>Math.min(this.maxBuffer,this.maxViewport[1])){this.report('error',{error:'render-size-limit'});return false;}
   if(this.canvas.width!==width)this.canvas.width=width;
   if(this.canvas.height!==height)this.canvas.height=height;
   const c=cameraInJ2000(camera,basis),u=this.uniforms;
   const key=[width,height,fov,brightness,...c.forward,...c.right,...c.up].join(',');
   if(key===this.renderKey){ctx.drawImage(this.canvas,0,0,displayWidth,displayHeight);return true;}
   gl.viewport(0,0,width,height);gl.useProgram(this.program);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,2,gl.FLOAT,false,0,0);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_CUBE_MAP,this.texture);gl.uniform1i(u.skyMap,0);gl.uniform2f(u.viewport,width,height);
   for(const key of ['forward','right','up'])gl.uniform3fv(u[key],c[key]);
   gl.uniform1f(u.halfFov,Math.tan(fov*Math.PI/360));gl.uniform1f(u.brightness,Math.max(0,Number.isFinite(brightness)?brightness:1));gl.drawArrays(gl.TRIANGLES,0,6);
   if(gl.isContextLost()||gl.getError()!==gl.NO_ERROR){this.report('error',{error:'background-render'});return false;}
   this.renderKey=key;ctx.drawImage(this.canvas,0,0,displayWidth,displayHeight);return true;
  }
 }
 root.GalaxyBackground=GalaxyBackground;
 if(typeof module!=='undefined'&&module.exports)module.exports={GalaxyBackground,galacticDirection,cameraInJ2000,textureLevel};
})(typeof window!=='undefined'?window:globalThis);
