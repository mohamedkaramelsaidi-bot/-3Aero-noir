// Web Audio Context Engine for Aero Noir
const KE = 0.42;

const CUES = {
  hover: { url: "/audio/hover.mp3", gain: 0.32, throttle: 260 },
  transition: { url: "/audio/transition.mp3", gain: 0.45, throttle: 450 }
};

const curveMap = new Map();
function getCurve(fadeIn) {
  let curve = curveMap.get(fadeIn);
  if (!curve) {
    curve = new Float32Array(64);
    for (let i = 0; i < 64; i++) {
      const r = i / 63;
      curve[i] = fadeIn ? Math.sin(r * Math.PI / 2) : Math.cos(r * Math.PI / 2);
    }
    curveMap.set(fadeIn, curve);
  }
  return curve;
}

export class AudioEngine {
  ctx = null;
  master = null;
  bedBus = null;
  bedLevel = 1;
  whooshBuf = null;
  cueBufs = {};
  cueLast = {};
  cueSrc = {};
  beds = [];
  loading = null;
  enabled = false;

  async enable() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.ratio.value = 3;
      this.master.connect(compressor).connect(this.ctx.destination);

      this.bedBus = this.ctx.createGain();
      this.bedBus.gain.value = this.bedLevel;
      this.bedBus.connect(this.master);
    }

    this.enabled = true;
    await this.ctx.resume();
    if (!this.loading) this.loading = this.load();
    await this.loading;
    if (!this.enabled) return;

    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(KE, t + 2.5);
  }

  disable() {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.6);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (!this.enabled) ctx.suspend();
    }, 700);
  }

  async fetchBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Audio load error ${url}: ${res.status}`);
    return this.ctx.decodeAudioData(await res.arrayBuffer());
  }

  async load() {
    const [ambient, engine, whoosh] = await Promise.all([
      this.fetchBuffer("/audio/ambient.mp3"),
      this.fetchBuffer("/audio/engine.mp3"),
      this.fetchBuffer("/audio/whoosh.mp3")
    ]);
    this.whooshBuf = whoosh;

    for (const cueKey of Object.keys(CUES)) {
      this.fetchBuffer(CUES[cueKey].url)
        .then(buf => (this.cueBufs[cueKey] = buf))
        .catch(err => console.warn(err));
    }

    const ctx = this.ctx;
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.8;
    ambientGain.connect(this.bedBus);

    const engineGain = ctx.createGain();
    engineGain.gain.value = 0.22;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    engineGain.connect(filter).connect(this.bedBus);

    this.startBed({ buffer: ambient, gain: ambientGain, fade: 6, next: 0, timer: 0 });
    this.startBed({ buffer: engine, gain: engineGain, fade: 2.5, next: 0, timer: 0 });
  }

  startBed(bed) {
    const ctx = this.ctx;
    bed.next = ctx.currentTime + 0.05;
    const schedule = () => {
      while (bed.next < ctx.currentTime + 4) {
        const src = ctx.createBufferSource();
        src.buffer = bed.buffer;
        const gainNode = ctx.createGain();
        const startT = bed.next;
        const dur = bed.buffer.duration;
        const fade = bed.fade;

        gainNode.gain.value = 0;
        gainNode.gain.setValueCurveAtTime(getCurve(true), startT, fade);
        gainNode.gain.setValueCurveAtTime(getCurve(false), startT + dur - fade, fade - 0.01);

        src.connect(gainNode).connect(bed.gain);
        src.start(startT);
        src.stop(startT + dur);
        bed.next = startT + dur - fade;
      }
    };
    schedule();
    bed.timer = window.setInterval(schedule, 1000);
    this.beds.push(bed);
  }

  whoosh(dir = 1, duration = 1.8) {
    if (!this.enabled || !this.ctx || !this.whooshBuf || this.ctx.state !== "running") return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.whooshBuf;
    src.playbackRate.value = (this.whooshBuf.duration / Math.max(1.2, duration)) * (0.96 + Math.random() * 0.08);

    const gain = ctx.createGain();
    gain.gain.value = 0.55;

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(-0.35 * dir, t);
    panner.pan.linearRampToValueAtTime(0.35 * dir, t + duration);

    src.connect(gain).connect(panner).connect(this.master);
    src.start(t);
  }

  setBedLevel(lvl) {
    this.bedLevel = lvl;
    if (this.ctx && this.bedBus) {
      this.bedBus.gain.setTargetAtTime(lvl, this.ctx.currentTime, 0.6);
    }
  }

  cue(name) {
    if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
    const buf = this.cueBufs[name];
    if (!buf) return;
    const config = CUES[name];
    const now = performance.now();
    if (now - (this.cueLast[name] ?? -1e9) < config.throttle) return;
    this.cueLast[name] = now;

    const ctx = this.ctx;
    const t = ctx.currentTime;
    const old = this.cueSrc[name];
    if (old) {
      old.gain.gain.cancelScheduledValues(t);
      old.gain.gain.setTargetAtTime(0, t, 0.03);
      old.src.stop(t + 0.15);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = 0.97 + Math.random() * 0.06;

    const gain = ctx.createGain();
    gain.gain.value = config.gain;

    src.connect(gain).connect(this.master);
    src.start(t);
    src.onended = () => {
      if (this.cueSrc[name]?.src === src) delete this.cueSrc[name];
    };
    this.cueSrc[name] = { src, gain };
  }

  dispose() {
    for (const b of this.beds) window.clearInterval(b.timer);
    this.ctx?.close();
  }
}

// Global state and React hook
const listeners = new Set();
let aeroState = {
  sound: false,
  reduced: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
};
let engineInstance = null;

function notify() {
  for (const listener of listeners) listener();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const aero = {
  get: () => aeroState,
  subscribe,
  engine: () => engineInstance,
  toggleSound() {
    if (!engineInstance) engineInstance = new AudioEngine();
    const eng = engineInstance;
    if (eng.enabled) {
      eng.disable();
      aeroState = { ...aeroState, sound: false };
      notify();
    } else {
      aeroState = { ...aeroState, sound: true };
      notify();
      eng.enable().catch(err => {
        console.error("Audio engine failed to enable:", err);
        aeroState = { ...aeroState, sound: false };
        notify();
      });
    }
  },
  setReduced(reduced) {
    aeroState = { ...aeroState, reduced };
    notify();
  },
  hover() {
    if (aeroState.sound) engineInstance?.cue("hover");
  },
  transition() {
    if (aeroState.sound) engineInstance?.cue("transition");
  }
};
