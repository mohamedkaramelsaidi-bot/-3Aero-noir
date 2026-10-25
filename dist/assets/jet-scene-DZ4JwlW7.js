var V=Object.defineProperty;var B=(c,e,t)=>e in c?V(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var h=(c,e,t)=>B(c,typeof e!="symbol"?e+"":e,t);import{D as G,T as R,M as $,a as N,_ as Z,G as K,A,P as q,b as T,I as Q,B as X,N as v,C as E,c as Y,v as tt,w as et,R as st,d as it,S as ot,e as z,f as J,g as P,x as H,L as W,h as at,i as C,j as rt,k as nt,l as ht,E as lt,m as ct,y as pt,n as dt,o as ft}from"./GLTFLoader-BcfhmKiC-fQ-TIcTZ.js";const y=[{pos:[11.4,1.3,9],target:[.4,-.25,.2],fov:38,shift:.04,lift:.12},{pos:[.2,.1,17.5],target:[.2,-.3,0],fov:34,shift:.02,lift:.08},{pos:[8.6,11.2,10.4],target:[-.6,-.6,0],fov:36,shift:-.1,lift:.06},{pos:[6.6,.5,3.9],target:[2.8,-.35,0],fov:36,shift:.1,lift:.06},{pos:[-6.2,3.4,7.4],target:[-2.2,-.3,.9],fov:40,shift:.03,lift:.06},{pos:[-15.5,3.8,-8.6],target:[.4,-.4,0],fov:38,shift:.1,lift:.08}],mt=[{bulge:3.5,lift:.6,spin:1},{bulge:1.5,lift:2,spin:-1},{bulge:1,lift:-.8,spin:-1},{bulge:.8,lift:.6,spin:1},{bulge:2.5,lift:1.4,spin:1}],vt="/textures/cloud-atlas.webp",ut="/textures/cloud-atlas-m.webp",g=-170,w=170,gt=w-g,wt=[1.775,1.252,1.73,1.574],L=[0,1,3,0,1];function r(c,e){return c+Math.random()*(e-c)}const S=c=>c[Math.floor(Math.random()*c.length)];function x(c){return{stretch:r(.9,1.25),flip:Math.random()<.5,rot:r(-.08,.08),spin:r(-.006,.006),phase:r(0,Math.PI*2),...c}}function yt(c){const e=[],t=s=>Math.max(1,Math.round(s*c));for(let s=0;s<t(120);s++)e.push(x({x:r(g,w),y:r(-30,-14),z:r(-130,130),size:r(26,48),variant:S(L),alpha:r(.8,1),tint:r(.66,1)}));for(let s=0;s<t(70);s++){const a=Math.random()<.5?-1:1;e.push(x({x:r(g,w),y:r(-16,8),z:a*r(34,110),size:r(24,44),variant:S(L),alpha:r(.75,1),tint:r(.55,.95)}))}for(let s=0;s<t(40);s++){const a=Math.random()<.5?-1:1;e.push(x({x:r(g,w),y:r(-8,26),z:a*r(115,160),size:r(55,90),variant:S([0,1,3,3]),alpha:r(.7,.95),tint:r(.42,.75)}))}for(let s=0;s<t(26);s++)e.push(x({x:r(g,w),y:r(26,44),z:r(-120,120),size:r(36,60),variant:S([3,0,2]),alpha:r(.35,.6),tint:r(.45,.65)}));for(let s=0;s<t(30);s++){const a=Math.random()<.5?-1:1;e.push(x({x:r(g,w),y:r(-20,4),z:Math.random()<.4?r(-120,120):a*r(26,110),size:r(36,70),stretch:r(1.1,1.6),variant:2,alpha:r(.18,.34),tint:r(.55,.85)}))}for(let s=0;s<t(34);s++){const a=Math.random()<.5?-1:1;e.push(x({x:r(g,w),y:r(-7,3),z:a*r(10,24),size:r(8,16),stretch:r(1.1,1.6),variant:2,alpha:r(.22,.42),tint:r(.9,1.1)}))}return e}const xt=`
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
`,Mt=`
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
    a *= smoothstep(${g.toFixed(1)}, ${(g+55).toFixed(1)}, vWorld.x);
    a *= 1.0 - smoothstep(${(w-55).toFixed(1)}, ${w.toFixed(1)}, vWorld.x);

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
`;class zt{constructor(e,t=1){h(this,"mesh");h(this,"material");h(this,"ready");h(this,"puffs");h(this,"order");h(this,"depth");h(this,"offsetAttr");h(this,"scaleAttr");h(this,"paramsAttr");h(this,"time",0);this.puffs=yt(t);const s=this.puffs.length;this.order=this.puffs.map((n,d)=>d),this.depth=new Float32Array(s);const a=new W(1,1),p=new at;p.index=a.index,p.setAttribute("position",a.getAttribute("position")),p.setAttribute("uv",a.getAttribute("uv")),this.offsetAttr=new C(new Float32Array(s*3),3),this.scaleAttr=new C(new Float32Array(s*2),2),this.paramsAttr=new C(new Float32Array(s*4),4);for(const n of[this.offsetAttr,this.scaleAttr,this.paramsAttr])n.setUsage(rt);p.setAttribute("iOffset",this.offsetAttr),p.setAttribute("iScale",this.scaleAttr),p.setAttribute("iParams",this.paramsAttr),p.instanceCount=s;const i=new nt;this.material=new P({vertexShader:xt,fragmentShader:Mt,transparent:!0,depthWrite:!1,depthTest:!0,uniforms:{uMap:{value:i},uHaze:{value:e},uFogDensity:{value:.0062},uJetPos:{value:new v},uCamPos:{value:new v},uKey:{value:1}}}),this.mesh=new z(p,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.mesh.visible=!1;const o=t<1?ut:vt;this.ready=new Promise(n=>{new ht().load(o,d=>{d.colorSpace=lt,d.premultiplyAlpha=!1,d.generateMipmaps=!0,d.minFilter=ct,d.magFilter=pt,d.anisotropy=4,d.needsUpdate=!0,this.material.uniforms.uMap.value=d,this.mesh.visible=!0,n()},void 0,()=>n())})}update(e,t,s){this.time+=e;const a=this.puffs;for(const l of a)l.x-=t*e,l.x<g&&(l.x+=gt),l.rot+=l.spin*e;const p=s.getWorldDirection(bt),i=s.position;for(let l=0;l<a.length;l++){const f=a[l];this.depth[l]=(f.x-i.x)*p.x+(f.y-i.y)*p.y+(f.z-i.z)*p.z}const o=this.depth;this.order.sort((l,f)=>o[f]-o[l]);const n=this.offsetAttr.array,d=this.scaleAttr.array,m=this.paramsAttr.array,u=this.time;for(let l=0;l<this.order.length;l++){const f=a[this.order[l]],b=1+Math.sin(u*.07+f.phase)*.025;n[l*3]=f.x,n[l*3+1]=f.y+Math.sin(u*.05+f.phase)*.5,n[l*3+2]=f.z,d[l*2]=f.size*b,d[l*2+1]=wt[f.variant]*f.stretch,m[l*4]=f.variant+(f.flip?4:0),m[l*4+1]=f.rot,m[l*4+2]=f.alpha,m[l*4+3]=f.tint}this.offsetAttr.needsUpdate=!0,this.scaleAttr.needsUpdate=!0,this.paramsAttr.needsUpdate=!0,this.material.uniforms.uCamPos.value.copy(i)}}const bt=new v,U=`
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
`;function At(c,e){const t=new P({side:H,depthWrite:!1,uniforms:{uTime:{value:0},uHaze:{value:c},uLight:{value:e.clone().normalize()},uBreak:{value:new v(-.55,.32,-.77).normalize()}},vertexShader:`
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
    `}),s=new z(new J(500,48,24),t);return s.frustumCulled=!1,s.renderOrder=-10,{mesh:s,material:t}}function St(c){const e=new P({transparent:!0,depthWrite:!1,uniforms:{uOffset:{value:0},uHaze:{value:c}},vertexShader:`
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
    `}),t=new z(new W(2400,2400,1,1),e);return t.rotation.x=-Math.PI/2,t.position.y=-34,t.renderOrder=-5,{mesh:t,material:e}}const Pt=c=>c<.5?4*c*c*c:1-Math.pow(-2*c+2,3)/2,kt=c=>-(Math.cos(Math.PI*c)-1)/2,M=Math.PI*2,Ct="/models/jet.glb";class Rt{constructor(e,t={}){h(this,"container");h(this,"events");h(this,"renderer");h(this,"scene",new T);h(this,"camera");h(this,"clock",new Q);h(this,"clouds");h(this,"sky");h(this,"sea");h(this,"jetRig",new X);h(this,"navLights",[]);h(this,"lightDir",new v(-.35,1,.45).normalize());h(this,"cloudLightDir",new v(-.35,.85,-.4).normalize());h(this,"haze",new v(.115,.118,.125));h(this,"fogColor",new E().setRGB(.115,.118,.125,R));h(this,"raf",0);h(this,"disposed",!1);h(this,"elapsed",0);h(this,"seaOffset",0);h(this,"reducedMotion",!1);h(this,"width",1);h(this,"height",1);h(this,"stage",0);h(this,"lastSettled",0);h(this,"anim",null);h(this,"pose");h(this,"paused",!1);h(this,"loop",()=>{if(this.disposed||this.paused)return;this.raf=requestAnimationFrame(this.loop),this.clock.update();const e=Math.min(.05,this.clock.getDelta());this.renderFrame(e)});h(this,"resize",()=>{const e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.width=e,this.height=t,this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()});this.container=e,this.events=t,this.renderer=new G({antialias:!0,alpha:!1,powerPreference:"high-performance"});const s=Number(new URLSearchParams(window.location.search).get("dpr"));this.renderer.setPixelRatio(s>0?s:Math.min(window.devicePixelRatio||1,1.75)),this.renderer.outputColorSpace=R,this.renderer.toneMapping=$,this.renderer.toneMappingExposure=1.05,this.renderer.setClearColor(this.fogColor,1),this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",e.appendChild(this.renderer.domElement),this.camera=new N(38,1,.1,2e3),this.scene.fog=new Z(this.fogColor,.006);const a=new K(this.renderer),p=Wt();this.scene.environment=a.fromScene(p,.035).texture,this.scene.environmentIntensity=.5,a.dispose(),Ft(p);const i=new A(15330802,2.7);i.position.copy(this.lightDir).multiplyScalar(40);const o=new A(12898526,2.4);o.position.set(-30,10,-22);const n=new A(14673130,.8);n.position.set(26,6,14);const d=new A(9080726,.6);d.position.set(10,-20,5);const m=new q(11844290,3816770,.42);this.scene.add(i,o,n,d,m),this.sky=At(this.haze,this.cloudLightDir),this.sea=St(this.haze);const u=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<760;this.clouds=new zt(this.haze,u?.6:1),this.scene.add(this.sky.mesh,this.sea.mesh,this.clouds.mesh,this.jetRig),this.pose=this.stagePose(y[0]),this.resize(),window.addEventListener("resize",this.resize),this.loadModel()}loadModel(){new Y().load(Ct,e=>{if(this.disposed)return;const t=e.scene;t.rotation.y=Math.PI,t.updateMatrixWorld(!0);const s=new tt().setFromObject(t),a=10/s.getSize(new v).x;t.scale.setScalar(a),t.updateMatrixWorld(!0),s.setFromObject(t);const p=s.getCenter(new v);t.position.sub(p),t.traverse(i=>{const o=i;o.isMesh&&(o.castShadow=!1,o.receiveShadow=!1,o.frustumCulled=!1)}),this.jetRig.add(t),this.addNavLights(t),this.clouds.ready.then(()=>{var i,o;this.disposed||(this.renderer.compile(this.scene,this.camera),(o=(i=this.events).onProgress)==null||o.call(i,1),this.renderFrame(0),requestAnimationFrame(()=>{var n,d;return(d=(n=this.events).onReady)==null?void 0:d.call(n)}))})},e=>{var t,s;e.total&&((s=(t=this.events).onProgress)==null||s.call(t,Math.min(.98,e.loaded/e.total)))},e=>{var t,s;console.error(e),(s=(t=this.events).onError)==null||s.call(t,"The aircraft model could not be loaded.")}),this.loop()}addNavLights(e){let t=new v(0,0,1/0),s=new v(0,0,-1/0);const a=new v;e.updateMatrixWorld(!0),e.traverse(m=>{const u=m;if(!u.isMesh)return;const l=u.geometry.getAttribute("position");for(let f=0;f<l.count;f+=3)a.fromBufferAttribute(l,f).applyMatrix4(u.matrixWorld),a.z<t.z&&(t=a.clone()),a.z>s.z&&(s=a.clone())});const p=document.createElement("canvas");p.width=p.height=64;const i=p.getContext("2d"),o=i.createRadialGradient(32,32,0,32,32,32);o.addColorStop(0,"rgba(255,255,255,1)"),o.addColorStop(.2,"rgba(255,255,255,0.5)"),o.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=o,i.fillRect(0,0,64,64);const n=new et(p),d=(m,u)=>{const l=new st(new it({map:n,color:m,transparent:!0,blending:ot,depthWrite:!1,fog:!1}));l.position.copy(u),l.scale.setScalar(.42),this.jetRig.add(l),this.navLights.push(l)};d(16726832,t),d(3473274,s)}stagePose(e){return{pos:new v(...e.pos),target:new v(...e.target),fov:e.fov,shift:e.shift,lift:e.lift}}interpolate(e,t,s,a){const p=t>e,i=y[e],o=y[t],n=mt[Math.min(e,t)],d=Math.atan2(i.pos[2],i.pos[0]);let m=Math.atan2(o.pos[2],o.pos[0])-d;const u=p?n.spin:-n.spin;u===1?m=(m%M+M)%M:u===-1?m=-((-m%M+M)%M):m=Math.atan2(Math.sin(m),Math.cos(m));const l=Pt(s),f=kt(s),b=Math.hypot(i.pos[0],i.pos[2]),_=Math.hypot(o.pos[0],o.pos[2]),F=Math.sin(Math.PI*l),D=d+m*l,j=b+(_-b)*l+n.bulge*F,I=i.pos[1]+(o.pos[1]-i.pos[1])*l+n.lift*F;a.pos.set(Math.cos(D)*j,I,Math.sin(D)*j);const k=.6*f+.4*l;a.target.set(i.target[0]+(o.target[0]-i.target[0])*k,i.target[1]+(o.target[1]-i.target[1])*k,i.target[2]+(o.target[2]-i.target[2])*k),a.fov=i.fov+(o.fov-i.fov)*f,a.shift=i.shift+(o.shift-i.shift)*f,a.lift=i.lift+(o.lift-i.lift)*f}get isAnimating(){return this.anim!==null}get transitionDuration(){return this.reducedMotion?1.5:2.6}go(e){var s,a;if(this.anim)return!1;const t=this.stage+e;return t<0||t>=y.length?!1:(this.anim={from:this.stage,to:t,start:performance.now()/1e3,duration:this.transitionDuration},(a=(s=this.events).onTransitionStart)==null||a.call(s,this.stage,t),!0)}setReducedMotion(e){this.reducedMotion=e}updateCamera(){var i,o;if(this.anim){const n=Math.min(1,(performance.now()/1e3-this.anim.start)/this.anim.duration);this.interpolate(this.anim.from,this.anim.to,n,this.pose),n>=1&&(this.lastSettled=(this.anim.start+this.anim.duration)*1e3,this.stage=this.anim.to,this.anim=null,this.pose=this.stagePose(y[this.stage]),(o=(i=this.events).onTransitionEnd)==null||o.call(i,this.stage))}else{const n=y[this.stage];this.pose.pos.set(...n.pos),this.pose.target.set(...n.target),this.pose.fov=n.fov,this.pose.shift=n.shift,this.pose.lift=n.lift}const e=this.width/this.height,t=e<1.55?Math.min(2.8,Math.pow(1.55/e,.85)):1,s=e<.9;if(O.copy(this.pose.pos).sub(this.pose.target).multiplyScalar(t),this.camera.position.copy(this.pose.target).add(O),!this.reducedMotion){const n=this.elapsed;this.camera.position.x+=Math.sin(n*.21)*.05,this.camera.position.y+=Math.sin(n*.17+1.3)*.04}this.camera.up.set(0,1,0),this.camera.lookAt(this.pose.target),this.camera.fov!==this.pose.fov&&(this.camera.fov=this.pose.fov);const a=s?0:this.pose.shift,p=s?.12:this.pose.lift;this.camera.setViewOffset(this.width,this.height,-a*this.width,p*this.height,this.width,this.height),this.camera.updateProjectionMatrix()}setPaused(e){e===this.paused||this.disposed||(this.paused=e,cancelAnimationFrame(this.raf),e||(this.clock.update(),this.loop()))}renderFrame(e){this.elapsed+=e;const t=this.elapsed,s=this.reducedMotion,a=s?5:13;if(s)this.jetRig.position.set(0,0,0),this.jetRig.rotation.set(0,0,0);else{const i=Math.sin(t*37)*.0035+Math.sin(t*53+1.1)*.0025;this.jetRig.position.set(0,Math.sin(t*.55)*.07+Math.sin(t*1.37)*.02+i,Math.sin(t*.31)*.04),this.jetRig.rotation.set(Math.sin(t*.43)*.0045+i*.15,0,Math.sin(t*.61+.7)*.0025)}const p=t%1.6<.06?1.8:1;for(const i of this.navLights)i.scale.setScalar(.38*p+Math.sin(t*2)*.02);this.updateCamera(),this.camera.updateMatrixWorld(),this.sky.mesh.position.copy(this.camera.position),this.sky.material.uniforms.uTime.value=t,this.seaOffset+=a*e*.35,this.sea.material.uniforms.uOffset.value=this.seaOffset,this.clouds.material.uniforms.uJetPos.value.copy(this.jetRig.position),this.clouds.update(e,a,this.camera),this.renderer.render(this.scene,this.camera)}debugPathClearance(e=60){const t=[],s=new v;this.jetRig.updateMatrixWorld(!0),this.jetRig.traverse(i=>{const o=i;if(!o.isMesh)return;const n=o.geometry.getAttribute("position");for(let d=0;d<n.count;d+=7)t.push(s.fromBufferAttribute(n,d).applyMatrix4(o.matrixWorld).clone())});const a=[],p={pos:new v,target:new v,fov:0,shift:0,lift:0};for(let i=0;i<y.length-1;i++){let o=1/0;for(let n=0;n<=e;n++){this.interpolate(i,i+1,n/e,p);for(const d of t)o=Math.min(o,d.distanceTo(p.pos))}a.push(Number(o.toFixed(2)))}return a}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),window.removeEventListener("resize",this.resize),this.renderer.dispose(),this.renderer.domElement.remove()}}const O=new v;function Wt(){const c=new T,e=new z(new J(50,48,24),new P({side:H,depthWrite:!1,vertexShader:`
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
      `}));c.add(e);const t=(s,a,p,i)=>{const o=new z(new W(s,a),new dt({color:new E(i,i,i*1.03),side:ft}));o.position.set(...p),o.lookAt(0,0,0),c.add(o)};return t(40,9,[-14,30,-20],3.2),t(30,6,[24,16,22],1.6),c}function Ft(c){c.traverse(e=>{const t=e;t.isMesh&&(t.geometry.dispose(),t.material.dispose())})}export{Rt as JetScene,Ct as MODEL_URL};
