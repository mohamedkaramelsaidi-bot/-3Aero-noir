import React, { useRef, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { aero } from '../lib/audio';
import { GestureController } from '../lib/gestures';
import { AeroLogo } from './AeroLogo';
import { SoundButton } from './SoundButton';

const STAGE_CHAPTERS = [
  { eyebrow: "", title: "", body: "" },
  { eyebrow: "01 — Silhouette", title: "One unbroken line", body: "A long, low fuselage drawn for laminar calm at 51,000 ft." },
  { eyebrow: "02 — Wing", title: "Swept for stillness", body: "High-aspect wings that settle turbulence before you feel it." },
  { eyebrow: "03 — Flight deck", title: "Quiet command", body: "Panoramic glazing and a cabin held at 3,500 ft altitude." },
  { eyebrow: "04 — Propulsion", title: "Power, barely heard", body: "Aft-mounted engines keep the cabin under 44 dB at cruise." },
  { eyebrow: "05 — Range", title: "7,700 nautical miles", body: "London to Singapore, non-stop, above the weather." }
];

const STAGE_LABELS = ["Silhouette", "Wing", "Flight deck", "Propulsion", "Range"];
const STAGE_ALIGN = ["left", "left", "right", "left", "left", "left"];
const MAX_STAGE = 5;

// Preloader Screen
function Preloader({ progress, ready, error }) {
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setRemoved(true), 1600);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (removed) return null;
  const pct = Math.round(progress * 100);

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[color:var(--noir)] transition-opacity duration-1000 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <AeroLogo size={24} />
        {error ? (
          <p className="text-sm text-red-400 font-light">{error}</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="label text-[10px] text-[color:var(--amber)] tabular-nums">
              {pct}%
            </span>
            <div className="h-px w-36 overflow-hidden bg-[color:var(--line)]">
              <div
                className="h-full bg-[color:var(--amber)] transition-all duration-300 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hero Top Navigation Bar
function HeroTopBar({ visible, sound, onSound, reduced, onReduced }) {
  return (
    <header
      className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-7 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <a href="/" className="flex items-center gap-3" aria-label="Aero Noir home">
        <AeroLogo size={19} />
      </a>

      <nav className="hidden lg:flex items-center gap-10 label text-[color:var(--mist)]" aria-label="Primary">
        {["Aircraft", "Charter", "Ownership", "Contact"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="hover:text-[color:var(--ivory)] transition-colors duration-300"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onReduced}
          aria-pressed={reduced}
          title="Reduced motion"
          className="label whitespace-nowrap hidden sm:inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-3 py-2 text-[9px] text-[color:var(--mist)] hover:text-[color:var(--ivory)] transition-colors"
        >
          {reduced ? "Motion off" : "Motion on"}
        </button>

        <button
          type="button"
          onClick={onSound}
          aria-pressed={sound}
          aria-label={sound ? "Mute sound" : "Enable sound"}
          className={`label whitespace-nowrap inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-[9.5px] transition-all duration-500 ${
            sound
              ? "border-[color:var(--amber)]/60 text-[color:var(--ivory)] shadow-[0_0_30px_-10px_rgba(214,164,106,0.6)]"
              : "border-[color:var(--line)] text-[color:var(--mist)] hover:text-[color:var(--ivory)]"
          }`}
        >
          <span className={`eq flex h-3 items-end gap-[2px] ${sound ? "on text-[color:var(--amber)]" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>{sound ? "Sound on" : "Sound off"}</span>
        </button>
      </div>
    </header>
  );
}

// Stepper Progress Indicators
function TourProgress({ stage, visible, onJump }) {
  return (
    <div
      className={`absolute z-10 transition-opacity duration-1000 right-5 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4 max-md:top-auto max-md:translate-y-0 max-md:bottom-[5.2svh] max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:flex-row max-md:gap-2 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-label={`Tour progress: step ${stage} of ${MAX_STAGE}`}
    >
      {Array.from({ length: MAX_STAGE }, (_, idx) => {
        const isPast = stage > idx;
        const isCurrent = stage === idx + 1;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onJump(idx + 1)}
            className="flex items-center gap-3 group text-left cursor-pointer bg-transparent border-0 p-0"
            aria-label={`Jump to ${STAGE_LABELS[idx]}`}
          >
            <span
              className={`label hidden md:inline text-[9px] transition-all duration-700 ${
                isCurrent
                  ? "opacity-100 text-[color:var(--ivory)]"
                  : "opacity-0 translate-x-1 group-hover:opacity-75"
              }`}
            >
              {STAGE_LABELS[idx]}
            </span>
            <span className="hidden md:inline font-display text-[13px] text-[color:var(--mist)] w-4 text-right">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="relative block h-px w-7 max-md:w-6 bg-[color:var(--line)] overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-[color:var(--amber)] transition-all duration-[1200ms] ease-out"
                style={{
                  width: isPast ? "100%" : "0%",
                  opacity: isCurrent ? 1 : 0.55
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { sound, reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);
  const stageRef = useRef(0);
  const reducedRef = useRef(reduced);

  const goToStage = useCallback((target) => {
    const s = sceneRef.current;
    if (s) {
      return s.go(target);
    }
    return false;
  }, []);

  // Initialize JetScene
  useEffect(() => {
    const sec = sectionRef.current;
    const container = canvasRef.current;
    if (!sec || !container) return;

    let disposed = false;
    let scene = null;
    let gesture = null;

    setProgress(0.02);

    import('../scenes/jet-scene.js')
      .then(({ JetScene }) => {
        if (disposed) return;
        scene = new JetScene(container, {
          onProgress: (p) => setProgress(p),
          onReady: () => setReady(true),
          onError: (err) => setError("The experience could not start."),
          onTransitionStart: (fromIdx, toIdx) => {
            setIsMoving(true);
            aero.engine()?.whoosh(toIdx > fromIdx ? 1 : -1, scene.transitionDuration);
          },
          onTransitionEnd: (curIdx) => {
            setStage(curIdx);
            stageRef.current = curIdx;
            setIsMoving(false);
          }
        });

        sceneRef.current = scene;
        scene.setReducedMotion(reducedRef.current);

        gesture = new GestureController(
          sec,
          (stepDir) => scene.go(stepDir),
          () => scene.isAnimating,
          () => scene.lastSettled,
          () => stageRef.current === MAX_STAGE && !scene.isAnimating
        );
      })
      .catch((err) => {
        console.error(err);
        setError("The experience could not start.");
      });

    return () => {
      disposed = true;
      gesture?.dispose();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    reducedRef.current = reduced;
    sceneRef.current?.setReducedMotion(reduced);
  }, [reduced]);

  // Handle visibility and scroll bed audio level
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneRef.current?.setPaused(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sec);

    let lastLevel = -1;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 1);
      const lvl = Math.max(0.25, 1 - scrollY / (window.innerHeight * 1.2));
      if (Math.abs(lvl - lastLevel) > 0.04) {
        lastLevel = lvl;
        aero.engine()?.setBedLevel(lvl);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isStageZero = stage === 0 && !isMoving && ready;
  const currentChapter = STAGE_CHAPTERS[stage];

  return (
    <section
      ref={sectionRef}
      id="top"
      tabIndex={-1}
      aria-label="Aero Noir private jet"
      className="relative h-svh w-full overflow-hidden select-none outline-none"
      style={{
        background: "var(--noir)",
        touchAction: stage === MAX_STAGE || isScrolled ? "pan-y" : "none"
      }}
    >
      {/* 3D Canvas Container */}
      <div ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Hero Atmosphere Vignette & Film Grain */}
      <div className="hero-vignette" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="hero-grain" />
      </div>

      {/* Top Bar Header */}
      <HeroTopBar
        visible={ready}
        sound={sound}
        onSound={aero.toggleSound}
        reduced={reduced}
        onReduced={() => aero.setReduced(!reduced)}
      />

      {/* Stage 0 Intro Presentation */}
      <div
        className={`absolute inset-x-5 bottom-[11svh] sm:inset-x-10 md:inset-x-16 md:bottom-[9svh] flex flex-col gap-7 md:flex-row md:items-end md:justify-between ${
          isStageZero ? "" : "pointer-events-none"
        }`}
      >
        <div>
          <p
            className={`label text-[color:var(--mist)] reveal ${isStageZero ? "in" : "out"}`}
            style={{ transitionDelay: isStageZero ? "200ms" : "0ms" }}
          >
            Aero Noir · AN-7 Long Range
          </p>
          <h1
            className={`font-display font-light mt-4 text-[44px] leading-[0.98] sm:text-[60px] lg:text-[80px] tracking-[-0.01em] reveal ${
              isStageZero ? "in" : "out"
            }`}
            style={{ transitionDelay: isStageZero ? "300ms" : "0ms" }}
          >
            The quiet{" "}
            <em className="block italic font-light opacity-90">above the storm.</em>
          </h1>
        </div>

        <div className="md:max-w-[300px] md:pb-3 md:mr-14">
          <p
            className={`text-[14px] leading-relaxed text-[color:var(--mist)] font-light reveal ${
              isStageZero ? "in" : "out"
            }`}
            style={{ transitionDelay: isStageZero ? "420ms" : "0ms" }}
          >
            A private aircraft built for the hours no one else is flying.
          </p>
          <div
            className={`mt-6 reveal ${isStageZero ? "in" : "out"}`}
            style={{ transitionDelay: isStageZero ? "540ms" : "0ms" }}
          >
            <button
              type="button"
              className="btn-ghost label"
              onClick={() => goToStage(1)}
              disabled={!isStageZero}
            >
              <span className="dot" />
              Explore the Jet
            </button>
            <span className="label ml-5 text-[9px] text-[color:var(--mist)]/70 max-sm:hidden">
              or scroll
            </span>
          </div>
        </div>
      </div>

      {/* Stages 1 to 5 Overlays */}
      {STAGE_CHAPTERS.map((ch, idx) => {
        if (idx === 0) return null;
        const isCurrent = idx === stage && !isMoving;
        const align = STAGE_ALIGN[idx];

        return (
          <div
            key={idx}
            aria-hidden={!isCurrent}
            className={`pointer-events-none absolute bottom-[12svh] left-5 right-5 md:bottom-[14svh] max-w-[340px] ${
              align === "left"
                ? "md:left-16 md:right-auto"
                : "md:right-24 md:left-auto md:text-right"
            }`}
          >
            <p
              className={`label text-[color:var(--amber)] reveal ${isCurrent ? "in" : "out"}`}
              style={{ transitionDelay: isCurrent ? "150ms" : "0ms" }}
            >
              {ch.eyebrow}
            </p>
            <h2
              className={`font-display font-light mt-3 text-[34px] md:text-[44px] leading-[1.02] reveal ${
                isCurrent ? "in" : "out"
              }`}
              style={{ transitionDelay: isCurrent ? "240ms" : "0ms" }}
            >
              {ch.title}
            </h2>
            <p
              className={`mt-3 text-[13px] leading-relaxed text-[color:var(--mist)] font-light reveal ${
                isCurrent ? "in" : "out"
              }`}
              style={{ transitionDelay: isCurrent ? "330ms" : "0ms" }}
            >
              {ch.body}
            </p>
          </div>
        );
      })}

      <span className="sr-only" aria-live="polite">
        {stage === 0 ? "" : `${currentChapter.eyebrow}. ${currentChapter.title}. ${currentChapter.body}`}
      </span>

      {/* Right Stepper / Tour Navigation */}
      <TourProgress
        stage={stage}
        visible={ready}
        onJump={(s) => goToStage(s)}
      />

      {/* Bottom Center Scroll Cue Indicator */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 max-md:hidden flex flex-col items-center gap-3 transition-opacity duration-700 ${
          ready && stage > 0 && !isMoving && !isScrolled ? "opacity-60" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <span className="label text-[9.5px] text-[color:var(--mist)]">
          {stage === MAX_STAGE ? "Scroll to explore" : "Continue"}
        </span>
        <span className="scroll-cue" />
      </div>

      {/* Preloader */}
      <Preloader progress={progress} ready={ready} error={error} />
    </section>
  );
}
