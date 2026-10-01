// Preview frustum contains the export frustum without changing output dimensions or FOV.
(function(root){
 function geometry(width,height,outputWidth,outputHeight,fov){
  const fit=.9*Math.min(width/outputWidth,height/outputHeight);
  const frameWidth=outputWidth*fit,frameHeight=outputHeight*fit;
  const w=width/fit,h=height/fit;
  return {width:w,height:h,fov:2*Math.atan(w/outputWidth*Math.tan(fov*Math.PI/360))*180/Math.PI,
   frame:{x:(width-frameWidth)/2,y:(height-frameHeight)/2,width:frameWidth,height:frameHeight},
   renderFrame:{x:(w-outputWidth)/2,y:(h-outputHeight)/2,width:outputWidth,height:outputHeight}};
 }
 if(typeof module!=='undefined')module.exports={geometry};else root.ImmersiveView={geometry};
})(globalThis);
