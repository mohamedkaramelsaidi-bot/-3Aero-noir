import{
i as P,s as R,t as u,B as S,u as b,M as c,v as A,O as C,w as L,W as z,e as E,A as G,g as I,h as g,H as F,m as W,P as k,q as B,k as O,l as T,V as v,f as H,G as j,x as y
}
from"./GLTFLoader-BcfhmKiC.js";
class D extends P{
constructor(){
super(),this.name="RoomEnvironment",this.position.y=-3.5;
const e=new R;
e.deleteAttribute("uv");
const s=new u({
side:S
}
),o=new u,r=new b(16777215,900,28,2);
r.position.set(.418,16.199,.3),this.add(r);
const n=new c(e,s);
n.position.set(-.757,13.219,.717),n.scale.set(31.713,28.305,28.591),this.add(n);
const i=new A(e,o,6),t=new C;
t.position.set(-10.906,2.009,1.846),t.rotation.set(0,-.195,0),t.scale.set(2.328,7.905,4.651),t.updateMatrix(),i.setMatrixAt(0,t.matrix),t.position.set(-5.607,-.754,-.758),t.rotation.set(0,.994,0),t.scale.set(1.97,1.534,3.955),t.updateMatrix(),i.setMatrixAt(1,t.matrix),t.position.set(6.167,.857,7.803),t.rotation.set(0,.561,0),t.scale.set(3.927,6.285,3.687),t.updateMatrix(),i.setMatrixAt(2,t.matrix),t.position.set(-2.017,.018,6.124),t.rotation.set(0,.333,0),t.scale.set(2.002,4.566,2.064),t.updateMatrix(),i.setMatrixAt(3,t.matrix),t.position.set(2.291,-.756,-2.621),t.rotation.set(0,-.286,0),t.scale.set(1.546,1.552,1.496),t.updateMatrix(),i.setMatrixAt(4,t.matrix),t.position.set(-2.193,-.369,-5.547),t.rotation.set(0,.516,0),t.scale.set(3.875,3.487,2.986),t.updateMatrix(),i.setMatrixAt(5,t.matrix),this.add(i);
const h=new c(e,l(50));
h.position.set(-16.116,14.37,8.208),h.scale.set(.1,2.428,2.739),this.add(h);
const d=new c(e,l(50));
d.position.set(-16.109,18.021,-8.207),d.scale.set(.1,2.425,2.751),this.add(d);
const p=new c(e,l(17));
p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);
const m=new c(e,l(43));
m.position.set(-.462,8.89,14.52),m.scale.set(4.38,5.441,.088),this.add(m);
const w=new c(e,l(20));
w.position.set(3.235,11.486,-12.541),w.scale.set(2.5,2,.1),this.add(w);
const a=new c(e,l(100));
a.position.set(0,20,0),a.scale.set(1,.1,1),this.add(a)
}
dispose(){
const e=new Set;
this.traverse(s=>{
s.isMesh&&(e.add(s.geometry),e.add(s.material))
}
);
for(const s of e)s.dispose()
}

}
function l(M){
return new L({
color:0,emissive:16777215,emissiveIntensity:M
}
)
}
const U="/models/jet.glb";
class q{
constructor(e,s){
this.host=e,this.onReady=s,this.renderer=new z({
antialias:!0,alpha:!0,powerPreference:"low-power"
}
);
const o=Number(new URLSearchParams(window.location.search).get("dpr"));
this.renderer.setPixelRatio(o>0?o:Math.min(window.devicePixelRatio||1,1.5)),this.renderer.outputColorSpace=E,this.renderer.toneMapping=G,this.renderer.toneMappingExposure=1.1,this.renderer.setClearColor(0,0);
const r=this.renderer.domElement;
r.style.cssText="display:block;
width:100%;
height:100%",e.appendChild(r);
const n=new I(this.renderer);
this.scene.environment=n.fromScene(new D,.04).texture,this.scene.environmentIntensity=.45,n.dispose();
const i=new g(15133167,2.6);
i.position.set(-12,40,-8);
const t=new g(14066794,.7);
t.position.set(20,10,18),this.scene.add(i,t,new F(10133931,657930,.5));
const h=document.createElement("canvas");
h.width=h.height=128;
const d=h.getContext("2d"),p=d.createRadialGradient(64,64,4,64,64,64);
p.addColorStop(0,"rgba(0,0,0,0.55)"),p.addColorStop(1,"rgba(0,0,0,0)"),d.fillStyle=p,d.fillRect(0,0,128,128);
const m=new W(h);
this.shadow=new c(new k(14,14),new B({
map:m,transparent:!0,depthWrite:!1
}
)),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.y=-6,this.scene.add(this.shadow,this.rig),this.camera.up.set(0,0,-1),this.camera.position.set(0,48,0),this.camera.lookAt(0,0,0),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize(),new O().load(U,w=>{
if(this.disposed)return;
const a=w.scene;
a.rotation.y=-Math.PI/2,a.updateMatrixWorld(!0);
const x=new T().setFromObject(a),f=x.getSize(new v);
a.scale.setScalar(10/Math.max(f.x,f.z)),a.updateMatrixWorld(!0),x.setFromObject(a),a.position.sub(x.getCenter(new v)),this.rig.add(a),this.render(),this.onReady?.()
}
)
}
host;
onReady;
renderer;
scene=new P;
camera=new H(28,1,1,400);
rig=new j;
shadow;
raf=0;
active=!1;
disposed=!1;
progress=0;
shown=0;
t0=performance.now();
reduced=!1;
ro;
setProgress(e){
this.progress=e,this.active&&(this.raf||this.loop())
}
setReducedMotion(e){
this.reduced=e
}
setActive(e){
e!==this.active&&(this.active=e,cancelAnimationFrame(this.raf),this.raf=0,e&&this.loop())
}
resize(){
const e=Math.max(1,this.host.clientWidth),s=Math.max(1,this.host.clientHeight);
this.renderer.setSize(e,s,!1),this.camera.aspect=e/s;
const o=22/(2*Math.tan(y.degToRad(this.camera.fov/2))),r=o/Math.min(1,this.camera.aspect*1.25);
this.camera.position.y=Math.max(o,r),this.camera.updateProjectionMatrix(),this.render()
}
loop=()=>{
if(this.disposed||!this.active){
this.raf=0;
return
}
this.raf=requestAnimationFrame(this.loop),this.render()
}
;
render(){
const e=this.reduced?1:.08;
this.shown+=(this.progress-this.shown)*e;
const s=this.shown,o=(performance.now()-this.t0)/1e3,r=this.reduced?0:1,n=y.lerp(4.2,-4.2,s),i=Math.sin(s*Math.PI*1.2)*1.1+Math.sin(o*.4)*.12*r;
this.rig.position.set(i,Math.sin(o*.6)*.15*r,n),this.rig.rotation.set(0,-Math.cos(s*Math.PI*1.2)*.12,Math.cos(s*Math.PI*1.2)*.1),this.shadow.position.set(i+2.2,-6,n+1.6),this.renderer.render(this.scene,this.camera)
}
dispose(){
this.disposed=!0,cancelAnimationFrame(this.raf),this.ro.disconnect(),this.renderer.dispose(),this.renderer.domElement.remove()
}

}
export{
q as TopViewScene
}
;

