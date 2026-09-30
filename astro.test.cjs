const assert=require('node:assert/strict');
const A=require('./astro.js');
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const t=Date.parse('2000-01-01T12:00:00Z');
near(A.sidereal(t)/A.D,280.46061837);
assert.equal(new Date(A.parseLocal('2026-07-18T22:54:00',-7)).toISOString(),'2026-07-19T05:54:00.000Z');
assert.equal(A.localISO(A.parseLocal('2026-07-18T22:54:00',-7),-7),'2026-07-18T22:54:00');
for(const [ra,dec] of [[0,0],[120,45],[359,-89]])A.precess(ra,dec,t).forEach((v,i)=>near(v,A.equatorial(ra,dec)[i]));
for(const lat of [-90,-45,0,46.05,90]){
 const b=A.basis(t,lat,0);for(let i=0;i<3;i++)for(let j=0;j<3;j++)near(A.dot(b[i],b[j]),i===j?1:0);
 // Object on local meridian, declination = latitude: at zenith.
 const v=A.equatorial(A.sidereal(t)/A.D,lat);near(A.horizontal(v,b)[2],1);
}
const b=A.basis(t,0,0),lst=A.sidereal(t)/A.D;
near(A.horizontal(A.equatorial(lst+90,0),b)[0],1); // rising in east
near(A.horizontal(A.equatorial(lst-90,0),b)[0],-1); // west
assert.equal(A.project([0,0,-1],A.camera(0,0),1280,720,90),null);
const c=A.camera(108,61),p=A.project(c.forward,c,1280,720,90);near(p[0],640);near(p[1],360);
const a=A.random(718),r=A.random(718);for(let i=0;i<20;i++)assert.equal(a(),r());
const fs=require('node:fs'),vm=require('node:vm'),sandbox={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/data/stars.js','utf8'),sandbox);
const data=sandbox.window.STAR_CATALOG;assert.equal(data.length,41411);for(const id of [91262,97649,102098])assert.ok(data.some(s=>s[0]===id));
for(const s of data)assert.ok(s.slice(1,4).every(Number.isFinite));
console.log('PASS: sidereal reference, UTC rollover, precession identity, ENU orthogonality/poles, zenith/east/west, camera back-face clipping, camera centre, seeded replay, catalog integrity.');

// Full-sphere regression: looking down must show the previously hidden hemisphere.
for(const alt of [-90,-60,0,60,90,120,180,270,360]){
 const c=A.camera(123,alt,32),p=A.project(c.forward,c,1280,720,92);near(p[0],640);near(p[1],360);
 const angles=A.cameraAngles(c),restored=A.camera(angles.az,angles.alt,angles.roll);
 for(const k of ['forward','right','up'])c[k].forEach((v,i)=>near(v,restored[k][i]));
}
for(const axis of [0,1,2]){
 const initial=A.camera(108,61,23);let c=initial;
 for(let i=0;i<720;i++){const turn=[0,0,0];turn[axis]=.5;c=A.turnCamera(c,...turn);}
 for(const k of ['forward','right','up'])c[k].forEach((v,i)=>near(v,initial[k][i]));
}
let moving=A.camera(0,89.9);const rng=A.random(91262);
for(let i=0;i<10000;i++){
 moving=A.turnCamera(moving,(rng()-.5)*20,(rng()-.5)*20,(rng()-.5)*2);
 const basis=[moving.forward,moving.right,moving.up];
 for(let a=0;a<3;a++)for(let b=0;b<3;b++)near(A.dot(basis[a],basis[b]),a===b?1:0);
}
const before=A.camera(0,89.9),after=A.turnCamera(before,0,.2);
assert.ok(A.dot(before.forward,after.forward)>.99999);
assert.ok(A.dot(before.up,after.up)>.99999);
console.log('PASS: lower hemisphere, 360-degree yaw/pitch/roll loops, pole crossing continuity, camera serialization, 10,000 mixed rotations without drift.');
