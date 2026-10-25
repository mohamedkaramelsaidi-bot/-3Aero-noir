import{P as k,I as J,a as C,D as G,T as N,S as A,V as m,M as z,b as V,N as Z,L as $,c as q,B as O,d as E,W as K,e as T,A as X,f as Q,F as Y,g as tt,h as S,H as et,i as _,j as st,G as it,C as B,k as ot,l as at,m as rt,n as nt,o as ht,p as ct,q as lt,r as pt}from"./GLTFLoader-BcfhmKiC.js";import{S as w,T as dt}from"./index-scene-deps.js";const ft="/textures/cloud-atlas.webp",mt="/textures/cloud-atlas-m.webp",v=-170,g=170,ut=g-v,vt=[1.775,1.252,1.73,1.574],R=[0,1,3,0,1];function a(l,e){return l+Math.random()*(e-l)}const b=l=>l[Math.floor(Math.random()*l.length)];function x(l){return{stretch:a(.9,1.25),flip:Math.random()<.5,rot:a(-.08,.08),spin:a(-.006,.006),phase:a(0,Math.PI*2),...l}}function gt(l){const e=[],t=s=>Math.max(1,Math.round(s*l));for(let s=0;s<t(120);s++)e.push(x({x:a(v,g),y:a(-30,-14),z:a(-130,130),size:a(26,48),variant:b(R),alpha:a(.8,1),tint:a(.66,1)}));for(let s=0;s<t(70);s++){const o=Math.random()<.5?-1:1;e.push(x({x:a(v,g),y:a(-16,8),z:o*a(34,110),size:a(24,44),variant:b(R),alpha:a(.75,1),tint:a(.55,.95)}))}for(let s=0;s<t(40);s++){const o=Math.random()<.5?-1:1;e.push(x({x:a(v,g),y:a(-8,26),z:o*a(115,160),size:a(55,90),variant:b([0,1,3,3]),alpha:a(.7,.95),tint:a(.42,.75)}))}for(let s=0;s<t(26);s++)e.push(x({x:a(v,g),y:a(26,44),z:a(-120,120),size:a(36,60),variant:b([3,0,2]),alpha:a(.35,.6),tint:a(.45,.65)}));for(let s=0;s<t(30);s++){const o=Math.random()<.5?-1:1;e.push(x({x:a(v,g),y:a(-20,4),z:Math.random()<.4?a(-120,120):o*a(26,110),size:a(36,70),stretch:a(1.1,1.6),variant:2,alpha:a(.18,.34),tint:a(.55,.85)}))}for(let s=0;s<t(34);s++){const o=Math.random()<.5?-1:1;e.push(x({x:a(v,g),y:a(-7,3),z:o*a(10,24),size:a(8,16),stretch:a(1.1,1.6),variant:2,alpha:a(.22,.42),tint:a(.9,1.1)}))}return e}const wt=`
  attribute vec3 iOffset;
  attribute vec2 iScale;   // world height, width/height
  attribute vec4 iParams;  // variant (+4 = mirrored), rotation, alpha, tint
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vViewZ;
  varying float vAlpha;
  varying float vTint;
  varying float vSize;
  void main() {
    vec4 mv = viewMatrix * vec4(iOffset, 1.0);
    float c = cos(iParams.y);
    float s = sin(iParams.y);
    vec2 p = position.xy * vec2(iScale.x * iScale.y, iScale.x);
    mv.xy += vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    float v = mod(iParams.x, 4.0);
    vec2 u = uv;
    if (iParams.x >= 4.0) u.x = 1.0 - u.x;
    // keep half a texel off the cell seams
    u = mix(vec2(0.002), vec2(0.998), u);
    vec2 cell = vec2(mod(v, 2.0), 1.0 - floor(v / 2.0));
    vUv = (u + cell) * 0.5;
    vWorld = iOffset;
    vViewZ = -mv.z;
    vAlpha = iParams.z;
    vTint = iParams.w;
    vSize = iScale.x;
    gl_Position = projectionMatrix * mv;
  }
`,yt=`
  uniform sampler2D uMap;
  uniform vec3 uHaze;
  uniform float uFogDensity;
  uniform vec3 uJetPos;
  uniform vec3 uCamPos;
  uniform float uKey;
  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vViewZ;
  varying float vAlpha;
  varying float vTint;
  varying float vSize;

  void main() {
    vec4 t = texture2D(uMap, vUv);
    float a = t.a * vAlpha;
    if (a < 0.003) discard;

    // photographed tone: white crowns, light/mid grey bodies, dark grey folds
    float tone = t.r;
    // gentle S-curve keeps highlights soft while deepening the folds
    tone = pow(tone, 1.25);
    tone = tone * tone * (3.0 - 2.0 * tone) * 0.7 + tone * 0.3;

    float dj = length(vWorld - uJetPos);
    float nearJet = exp(-(dj * dj) / (2.0 * 70.0 * 70.0));
    // the deck is lit from the storm break above; high overcast stays dim
    float height = clamp((vWorld.y + 30.0) / 70.0, 0.0, 1.0);
    float light = vTint * uKey * (0.86 + 0.24 * nearJet) * mix(1.04, 0.9, height);

    vec3 shadowCol = vec3(0.035, 0.037, 0.041);
    vec3 litCol = vec3(0.93, 0.94, 0.95);
    vec3 col = mix(shadowCol, litCol, clamp(tone * light, 0.0, 1.0));
    // a touch of cool silver in the brightest crowns
    col += vec3(0.0, 0.004, 0.012) * smoothstep(0.6, 1.0, tone);

    // atmospheric haze: distant masses settle into grey
    float fogF = 1.0 - exp(-pow(vViewZ * uFogDensity, 1.6));
    col = mix(col, uHaze, fogF);
    a *= 1.0 - fogF * 0.25;

    // soft fade when puffs approach the lens
    a *= smoothstep(1.5, 10.0, vViewZ) * smoothstep(vSize * 0.2, vSize * 0.7, vViewZ);
    // fade both ends of the recycled volume (deep inside the haze)
    a *= smoothstep(${v.toFixed(1)}, ${(v+55).toFixed(1)}, vWorld.x);
    a *= 1.0 - smoothstep(${(g-55).toFixed(1)}, ${g.toFixed(1)}, vWorld.x);

    // keep the line of sight to the aircraft clear
    vec3 toJet = uJetPos - uCamPos;
    float camJet = length(toJet);
    vec3 dir = toJet / camJet;
    vec3 rel = vWorld - uCamPos;
    float along = dot(rel, dir);
    if (along > 0.0 && along < camJet + 4.0) {
      float perp = length(rel - dir * along);
      a *= mix(0.06, 1.0, smoothstep(vSize * 0.25 + 4.0, vSize * 0.55 + 10.0, perp));
    }
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;class xt{mesh;material;ready;puffs;order;depth;offsetAttr;scaleAttr;paramsAttr;time=0;constructor(e,t=1){this.puffs=gt(t);const s=this.puffs.length;this.order=this.puffs.map((d,h)=>h),this.depth=new Float32Array(s);const o=new k(1,1),c=new J;c.index=o.index,c.setAttribute("position",o.getAttribute("position")),c.setAttribute("uv",o.getAttribute("uv")),this.offsetAttr=new C(new Float32Array(s*3),3),this.scaleAttr=new C(new Float32Array(s*2),2),this.paramsAttr=new C(new Float32Array(s*4),4);for(const d of[this.offsetAttr,this.scaleAttr,this.paramsAttr])d.setUsage(G);c.setAttribute("iOffset",this.offsetAttr),c.setAttribute("iScale",this.scaleAttr),c.setAttribute("iParams",this.paramsAttr),c.instanceCount=s;const i=new N;this.material=new A({vertexShader:wt,fragmentShader:yt,transparent:!0,depthWrite:!1,depthTest:!0,uniforms:{uMap:{value:i},uHaze:{value:e},uFogDensity:{value:.0062},uJetPos:{value:new m},uCamPos:{value:new m},uKey:{value:1}}}),this.mesh=new z(c,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.mesh.visible=!1;const r=t<1?mt:ft;this.ready=new Promise(d=>{new V().load(r,h=>{h.colorSpace=Z,h.premultiplyAlpha=!1,h.generateMipmaps=!0,h.minFilter=$,h.magFilter=q,h.anisotropy=4,h.needsUpdate=!0,this.material.uniforms.uMap.value=h,this.mesh.visible=!0,d()},void 0,()=>d())})}update(e,t,s){this.time+=e;const o=this.puffs;for(const n of o)n.x-=t*e,n.x<v&&(n.x+=ut),n.rot+=n.spin*e;const c=s.getWorldDirection(Mt),i=s.position;for(let n=0;n<o.length;n++){const p=o[n];this.depth[n]=(p.x-i.x)*c.x+(p.y-i.y)*c.y+(p.z-i.z)*c.z}const r=this.depth;this.order.sort((n,p)=>r[p]-r[n]);const d=this.offsetAttr.array,h=this.scaleAttr.array,u=this.paramsAttr.array,f=this.time;for(let n=0;n<this.order.length;n++){const p=o[this.order[n]],y=1+Math.sin(f*.07+p.phase)*.025;d[n*3]=p.x,d[n*3+1]=p.y+Math.sin(f*.05+p.phase)*.5,d[n*3+2]=p.z,h[n*2]=p.size*y,h[n*2+1]=vt[p.variant]*p.stretch,u[n*4]=p.variant+(p.flip?4:0),u[n*4+1]=p.rot,u[n*4+2]=p.alpha,u[n*4+3]=p.tint}this.offsetAttr.needsUpdate=!0,this.scaleAttr.needsUpdate=!0,this.paramsAttr.needsUpdate=!0,this.material.uniforms.uCamPos.value.copy(i)}}const Mt=new m,U=`
  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }
`;function zt(l,e){const t=new A({side:O,depthWrite:!1,uniforms:{uTime:{value:0},uHaze:{value:l},uLight:{value:e.clone().normalize()},uBreak:{value:new m(-.55,.32,-.77).normalize()}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }
    `,fragmentShader:`
      uniform float uTime; uniform vec3 uHaze; uniform vec3 uLight; uniform vec3 uBreak;
      varying vec3 vDir;
      ${U}
      void main() {
        vec3 d = normalize(vDir);
        float up = d.y;
        // smoky overcast: soft, warped vapour instead of distinct lumps
        vec2 p = d.xz / max(0.12, up + 0.22) * 0.9 + vec2(uTime * 0.004, 0.0);
        vec2 w = vec2(fbm(p * 0.7 + 3.0), fbm(p * 0.7 + 8.0)) - 0.5;
        float n = fbm(p + w * 1.6);
        float smoke = smoothstep(0.3, 0.8, n);
        // black zenith, charcoal mid sky, grey haze toward the horizon
        vec3 zenith = vec3(0.012, 0.013, 0.015);
        vec3 col = mix(uHaze * 1.15, zenith, smoothstep(0.02, 0.75, up));
        col += vec3(0.075, 0.077, 0.08) * smoke * smoothstep(-0.05, 0.25, up) * (1.0 - smoothstep(0.5, 0.95, up));
        // brighter haze band at the horizon
        col += vec3(0.05, 0.051, 0.054) * exp(-abs(up) * 6.0);
        // a soft break in the storm where moonlight leaks through
        float b = max(dot(d, uBreak), 0.0);
        col += vec3(0.2, 0.205, 0.215) * pow(b, 14.0) * (0.5 + 0.5 * smoke) + vec3(0.04, 0.041, 0.044) * pow(b, 4.0);
        // below the horizon: grey undercast
        col = mix(col, uHaze * 0.95, smoothstep(0.0, -0.2, up));
        gl_FragColor = vec4(col, 1.0);
      }
    `}),s=new z(new E(500,48,24),t);return s.frustumCulled=!1,s.renderOrder=-10,{mesh:s,material:t}}function St(l){const e=new A({transparent:!0,depthWrite:!1,uniforms:{uOffset:{value:0},uHaze:{value:l}},vertexShader:`
      varying vec3 vWorld;
      varying float vDist;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vec4 mv = viewMatrix * w;
        vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      uniform float uOffset; uniform vec3 uHaze;
      varying vec3 vWorld; varying float vDist;
      ${U}
      void main() {
        vec2 p = (vWorld.xz + vec2(uOffset, 0.0)) * 0.014;
        float n = fbm(p);
        float n2 = fbm(p * 2.6 + 3.1);
        // fake top lighting from the noise slope gives the deck a billowed relief
        float nx = fbm(p + vec2(0.04, 0.0));
        float relief = clamp(0.5 + (n - nx) * 9.0, 0.0, 1.0);
        float c = smoothstep(0.25, 0.8, n * 0.7 + n2 * 0.4);
        // soft grey deck: charcoal gaps, light grey tops
        vec3 col = mix(vec3(0.06, 0.062, 0.066), vec3(0.5, 0.505, 0.515), c * (0.6 + 0.4 * relief));
        float near = exp(-length(vWorld.xz) * 0.005);
        col *= 0.7 + near * 0.5;
        float fog = 1.0 - exp(-pow(vDist * 0.0045, 1.5));
        col = mix(col, uHaze, fog);
        float a = smoothstep(1.0, 0.0, length(vWorld.xz) / 1100.0);
        gl_FragColor = vec4(col, a);
      }
    `}),t=new z(new k(2400,2400,1,1),e);return t.rotation.x=-Math.PI/2,t.position.y=-34,t.renderOrder=-5,{mesh:t,material:e}}const bt=l=>l<.5?4*l*l*l:1-Math.pow(-2*l+2,3)/2,At=l=>-(Math.cos(Math.PI*l)-1)/2,M=Math.PI*2,Pt="/models/jet.glb";class Wt{constructor(e,t={}){this.container=e,this.events=t,this.renderer=new K({antialias:!0,alpha:!1,powerPreference:"high-performance"});const s=Number(new URLSearchParams(window.location.search).get("dpr"));this.renderer.setPixelRatio(s>0?s:Math.min(window.devicePixelRatio||1,1.75)),this.renderer.outputColorSpace=T,this.renderer.toneMapping=X,this.renderer.toneMappingExposure=1.05,this.renderer.setClearColor(this.fogColor,1),this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",e.appendChild(this.renderer.domElement),this.camera=new Q(38,1,.1,2e3),this.scene.fog=new Y(this.fogColor,.006);const o=new tt(this.renderer),c=Ct();this.scene.environment=o.fromScene(c,.035).texture,this.scene.environmentIntensity=.5,o.dispose(),kt(c);const i=new S(15330802,2.7);i.position.copy(this.lightDir).multiplyScalar(40);const r=new S(12898526,2.4);r.position.set(-30,10,-22);const d=new S(14673130,.8);d.position.set(26,6,14);const h=new S(9080726,.6);h.position.set(10,-20,5);const u=new et(11844290,3816770,.42);this.scene.add(i,r,d,h,u),this.sky=zt(this.haze,this.cloudLightDir),this.sea=St(this.haze);const f=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<760;this.clouds=new xt(this.haze,f?.6:1),this.scene.add(this.sky.mesh,this.sea.mesh,this.clouds.mesh,this.jetRig),this.pose=this.stagePose(w[0]),this.resize(),window.addEventListener("resize",this.resize),this.loadModel()}container;events;renderer;scene=new _;camera;clock=new st;clouds;sky;sea;jetRig=new it;navLights=[];lightDir=new m(-.35,1,.45).normalize();cloudLightDir=new m(-.35,.85,-.4).normalize();haze=new m(.115,.118,.125);fogColor=new B().setRGB(.115,.118,.125,T);raf=0;disposed=!1;elapsed=0;seaOffset=0;reducedMotion=!1;width=1;height=1;stage=0;lastSettled=0;anim=null;pose;loadModel(){new ot().load(Pt,t=>{if(this.disposed)return;const s=t.scene;s.rotation.y=Math.PI,s.updateMatrixWorld(!0);const o=new at().setFromObject(s),i=10/o.getSize(new m).x;s.scale.setScalar(i),s.updateMatrixWorld(!0),o.setFromObject(s);const r=o.getCenter(new m);s.position.sub(r),s.traverse(d=>{const h=d;h.isMesh&&(h.castShadow=!1,h.receiveShadow=!1,h.frustumCulled=!1)}),this.jetRig.add(s),this.addNavLights(s),this.clouds.ready.then(()=>{this.disposed||(this.renderer.compile(this.scene,this.camera),this.events.onProgress?.(1),this.renderFrame(0),requestAnimationFrame(()=>this.events.onReady?.()))})},t=>{t.total&&this.events.onProgress?.(Math.min(.98,t.loaded/t.total))},t=>{console.error(t),this.events.onError?.("The aircraft model could not be loaded.")}),this.loop()}addNavLights(e){let t=new m(0,0,1/0),s=new m(0,0,-1/0);const o=new m;e.updateMatrixWorld(!0),e.traverse(u=>{const f=u;if(!f.isMesh)return;const n=f.geometry.getAttribute("position");for(let p=0;p<n.count;p+=3)o.fromBufferAttribute(n,p).applyMatrix4(f.matrixWorld),o.z<t.z&&(t=o.clone()),o.z>s.z&&(s=o.clone())});const c=document.createElement("canvas");c.width=c.height=64;const i=c.getContext("2d"),r=i.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(.2,"rgba(255,255,255,0.5)"),r.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=r,i.fillRect(0,0,64,64);const d=new rt(c),h=(u,f)=>{const n=new nt(new ht({map:d,color:u,transparent:!0,blending:ct,depthWrite:!1,fog:!1}));n.position.copy(f),n.scale.setScalar(.42),this.jetRig.add(n),this.navLights.push(n)};h(16726832,t),h(3473274,s)}stagePose(e){return{pos:new m(...e.pos),target:new m(...e.target),fov:e.fov,shift:e.shift,lift:e.lift}}interpolate(e,t,s,o){const c=t>e,i=w[e],r=w[t],d=dt[Math.min(e,t)],h=Math.atan2(i.pos[2],i.pos[0]);let f=Math.atan2(r.pos[2],r.pos[0])-h;const n=c?d.spin:-d.spin;n===1?f=(f%M+M)%M:n===-1?f=-((-f%M+M)%M):f=Math.atan2(Math.sin(f),Math.cos(f));const p=bt(s),y=At(s),F=Math.hypot(i.pos[0],i.pos[2]),I=Math.hypot(r.pos[0],r.pos[2]),D=Math.sin(Math.PI*p),W=h+f*p,L=F+(I-F)*p+d.bulge*D,H=i.pos[1]+(r.pos[1]-i.pos[1])*p+d.lift*D;o.pos.set(Math.cos(W)*L,H,Math.sin(W)*L);const P=.6*y+.4*p;o.target.set(i.target[0]+(r.target[0]-i.target[0])*P,i.target[1]+(r.target[1]-i.target[1])*P,i.target[2]+(r.target[2]-i.target[2])*P),o.fov=i.fov+(r.fov-i.fov)*y,o.shift=i.shift+(r.shift-i.shift)*y,o.lift=i.lift+(r.lift-i.lift)*y}get isAnimating(){return this.anim!==null}get transitionDuration(){return this.reducedMotion?1.5:2.6}go(e){if(this.anim)return!1;const t=this.stage+e;return t<0||t>=w.length?!1:(this.anim={from:this.stage,to:t,start:performance.now()/1e3,duration:this.transitionDuration},this.events.onTransitionStart?.(this.stage,t),!0)}setReducedMotion(e){this.reducedMotion=e}updateCamera(){if(this.anim){const i=Math.min(1,(performance.now()/1e3-this.anim.start)/this.anim.duration);this.interpolate(this.anim.from,this.anim.to,i,this.pose),i>=1&&(this.lastSettled=(this.anim.start+this.anim.duration)*1e3,this.stage=this.anim.to,this.anim=null,this.pose=this.stagePose(w[this.stage]),this.events.onTransitionEnd?.(this.stage))}else{const i=w[this.stage];this.pose.pos.set(...i.pos),this.pose.target.set(...i.target),this.pose.fov=i.fov,this.pose.shift=i.shift,this.pose.lift=i.lift}const e=this.width/this.height,t=e<1.55?Math.min(2.8,Math.pow(1.55/e,.85)):1,s=e<.9;if(j.copy(this.pose.pos).sub(this.pose.target).multiplyScalar(t),this.camera.position.copy(this.pose.target).add(j),!this.reducedMotion){const i=this.elapsed;this.camera.position.x+=Math.sin(i*.21)*.05,this.camera.position.y+=Math.sin(i*.17+1.3)*.04}this.camera.up.set(0,1,0),this.camera.lookAt(this.pose.target),this.camera.fov!==this.pose.fov&&(this.camera.fov=this.pose.fov);const o=s?0:this.pose.shift,c=s?.12:this.pose.lift;this.camera.setViewOffset(this.width,this.height,-o*this.width,c*this.height,this.width,this.height),this.camera.updateProjectionMatrix()}paused=!1;setPaused(e){e===this.paused||this.disposed||(this.paused=e,cancelAnimationFrame(this.raf),e||(this.clock.update(),this.loop()))}loop=()=>{if(this.disposed||this.paused)return;this.raf=requestAnimationFrame(this.loop),this.clock.update();const e=Math.min(.05,this.clock.getDelta());this.renderFrame(e)};renderFrame(e){this.elapsed+=e;const t=this.elapsed,s=this.reducedMotion,o=s?5:13;if(s)this.jetRig.position.set(0,0,0),this.jetRig.rotation.set(0,0,0);else{const i=Math.sin(t*37)*.0035+Math.sin(t*53+1.1)*.0025;this.jetRig.position.set(0,Math.sin(t*.55)*.07+Math.sin(t*1.37)*.02+i,Math.sin(t*.31)*.04),this.jetRig.rotation.set(Math.sin(t*.43)*.0045+i*.15,0,Math.sin(t*.61+.7)*.0025)}const c=t%1.6<.06?1.8:1;for(const i of this.navLights)i.scale.setScalar(.38*c+Math.sin(t*2)*.02);this.updateCamera(),this.camera.updateMatrixWorld(),this.sky.mesh.position.copy(this.camera.position),this.sky.material.uniforms.uTime.value=t,this.seaOffset+=o*e*.35,this.sea.material.uniforms.uOffset.value=this.seaOffset,this.clouds.material.uniforms.uJetPos.value.copy(this.jetRig.position),this.clouds.update(e,o,this.camera),this.renderer.render(this.scene,this.camera)}resize=()=>{const e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.width=e,this.height=t,this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()};debugPathClearance(e=60){const t=[],s=new m;this.jetRig.updateMatrixWorld(!0),this.jetRig.traverse(i=>{const r=i;if(!r.isMesh)return;const d=r.geometry.getAttribute("position");for(let h=0;h<d.count;h+=7)t.push(s.fromBufferAttribute(d,h).applyMatrix4(r.matrixWorld).clone())});const o=[],c={pos:new m,target:new m,fov:0,shift:0,lift:0};for(let i=0;i<w.length-1;i++){let r=1/0;for(let d=0;d<=e;d++){this.interpolate(i,i+1,d/e,c);for(const h of t)r=Math.min(r,h.distanceTo(c.pos))}o.push(Number(r.toFixed(2)))}return o}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),window.removeEventListener("resize",this.resize),this.renderer.dispose(),this.renderer.domElement.remove()}}const j=new m;function Ct(){const l=new _,e=new z(new E(50,48,24),new A({side:O,depthWrite:!1,vertexShader:`
        varying vec3 vDir;
        void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,fragmentShader:`
        varying vec3 vDir;
        void main() {
          float y = normalize(vDir).y;
          vec3 ceiling = vec3(0.05, 0.052, 0.058);
          vec3 band = vec3(0.85, 0.86, 0.88);
          vec3 deck = vec3(0.32, 0.33, 0.35);
          vec3 c = mix(band, ceiling, smoothstep(0.02, 0.6, y));
          c = mix(c, deck, smoothstep(0.0, -0.35, y));
          gl_FragColor = vec4(c, 1.0);
        }
      `}));l.add(e);const t=(s,o,c,i)=>{const r=new z(new k(s,o),new lt({color:new B(i,i,i*1.03),side:pt}));r.position.set(...c),r.lookAt(0,0,0),l.add(r)};return t(40,9,[-14,30,-20],3.2),t(30,6,[24,16,22],1.6),l}function kt(l){l.traverse(e=>{const t=e;t.isMesh&&(t.geometry.dispose(),t.material.dispose())})}export{Wt as JetScene,Pt as MODEL_URL};
