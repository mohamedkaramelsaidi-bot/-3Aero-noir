import React, { useRef, useState, useEffect, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { aero } from '../lib/audio';

const PERKS = [
  {
    title: "Wheels-up on your schedule",
    body: "Departures planned around your day, from a concierge who already knows your preferences."
  },
  {
    title: "Private terminals",
    body: "Arrive minutes before departure. Discreet lounges, no queues, no crowds."
  },
  {
    title: "A cabin prepared for you",
    body: "Catering, temperature, lighting and reading set before you board."
  },
  {
    title: "One point of contact",
    body: "A dedicated flight coordinator from first request to final landing."
  },
  {
    title: "Discretion as standard",
    body: "Your itinerary and guests remain entirely your own."
  }
];

function AutoVideo({ src, poster, className = "" }) {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "400px"
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView && !reduced && document.visibilityState === "visible") {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, reduced]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      className={className}
      aria-hidden="true"
    />
  );
}

// Banner Section with Expanding Clip-Path & Parallax
function CharterBanner() {
  const containerRef = useRef(null);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress: clipProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.12"]
  });

  const padX = useTransform(clipProgress, [0, 1], isMobile ? [6, 2] : [16, 1.2]);
  const padY = useTransform(clipProgress, [0, 1], isMobile ? [6, 0] : [10, 0]);
  const radius = useTransform(clipProgress, [0, 1], isMobile ? [22, 14] : [36, 18]);

  const clipPath = useTransform(
    [padY, padX, radius],
    ([top, side, rad]) => `inset(${top}% ${side}% ${top}% ${side}% round ${rad}px)`
  );

  const { scrollYProgress: parallaxProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const videoY = useTransform(parallaxProgress, [0, 1], ["-7%", "7%"]);
  const textY = useTransform(parallaxProgress, [0, 1], ["30px", "-30px"]);

  const handleRequest = () => {
    window.dispatchEvent(new CustomEvent("aero:interest", { detail: "charter" }));
  };

  return (
    <div ref={containerRef} className="relative h-[86svh] min-h-[520px] md:h-[100svh]">
      <motion.div
        className="absolute inset-0 overflow-hidden bg-[color:var(--graphite)]"
        style={{
          clipPath: reduced ? "inset(0% 1.2% 0% 1.2% round 18px)" : clipPath
        }}
      >
        <motion.div className="absolute inset-[-8%_0]" style={{ y: reduced ? 0 : videoY }}>
          <AutoVideo
            src={isMobile ? "/videos/charter-m.mp4" : "/videos/charter.mp4"}
            poster="/posters/charter.jpg"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="charter-scrim" aria-hidden="true" />

        <motion.div
          className="absolute inset-x-6 bottom-10 sm:inset-x-12 md:bottom-16 md:left-[6vw] md:right-auto md:max-w-[560px]"
          style={{ y: reduced ? 0 : textY }}
        >
          <span className="label text-[color:var(--amber)]">Charter</span>

          <h2
            id="charter-title"
            className="font-display mt-5 text-[42px] font-light leading-[0.98] tracking-[-0.01em] sm:text-[58px] lg:text-[78px]"
          >
            Through the grey,
            <em className="block font-light italic opacity-90">on your time.</em>
          </h2>

          <p className="mt-6 max-w-[420px] text-[14.5px] font-light leading-relaxed text-[color:var(--ivory)]/75">
            Single journeys or a season of them. Tell us where and when — we arrange the aircraft, the crew and every quiet detail in between.
          </p>

          <div className="mt-8">
            <a href="#contact" className="btn-ghost label" onClick={handleRequest}>
              <span className="dot" />
              Request a Flight
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Top-View Plan 3D Scene + Commitment List
function CharterDetails() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);
  const reducedRef = useRef(reduced);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"]
  });

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      sceneRef.current?.setProgress(p);
    });
  }, [scrollYProgress]);

  useEffect(() => {
    reducedRef.current = reduced;
    sceneRef.current?.setReducedMotion(reduced);
  }, [reduced]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    let disposed = false;
    let scene = null;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        if (isVisible && !scene && !disposed) {
          import('../scenes/top-view-scene.js')
            .then(({ TopViewScene }) => {
              if (disposed) return;
              scene = new TopViewScene(el, () => setSceneReady(true));
              sceneRef.current = scene;
              scene.setReducedMotion(reducedRef.current);
              scene.setProgress(scrollYProgress.get());
              scene.setActive(isVisible);
            })
            .catch((err) => console.error(err));
        }
        scene?.setActive(isVisible);
      },
      { rootMargin: "200px" }
    );

    obs.observe(el);
    return () => {
      disposed = true;
      obs.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-20 grid max-w-[1300px] gap-10 px-5 sm:px-10 md:mt-32 md:grid-cols-[1fr_1fr] md:gap-16 lg:px-16"
    >
      {/* Left Column: Why charter with us */}
      <div className="relative md:py-[8svh]">
        <span className="label text-[color:var(--amber)]">Why charter with us</span>
        <h3 className="font-display mt-4 max-w-[460px] text-[32px] font-light leading-[1.04] md:text-[46px]">
          Every hour of the journey, considered.
        </h3>

        <ol className="mt-10 border-t border-[color:var(--line)]">
          {PERKS.map((perk, idx) => (
            <li
              key={perk.title}
              className="grid grid-cols-[42px_1fr] gap-4 border-b border-[color:var(--line)] py-6 md:py-7"
            >
              <span className="label pt-1 text-[color:var(--amber)] tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-[22px] font-normal leading-tight md:text-[26px]">
                  {perk.title}
                </p>
                <p className="mt-2 max-w-[440px] text-[13.5px] font-light leading-relaxed text-[color:var(--mist)]">
                  {perk.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Right Column: 3D Top View Plan View */}
      <div className="relative order-first h-[44svh] min-h-[280px] md:order-none md:h-auto">
        <div className="top-view md:sticky md:top-[12svh] md:h-[76svh]">
          <div
            ref={canvasRef}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              sceneReady ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <p className="label absolute bottom-3 right-4 text-[9px] text-[color:var(--mist)]/70">
            AN-7 · plan view
          </p>
        </div>
      </div>
    </div>
  );
}

export function Charter() {
  return (
    <section id="charter" aria-labelledby="charter-title" className="relative pb-24 pt-10 md:pb-36 md:pt-24">
      <CharterBanner />
      <CharterDetails />
    </section>
  );
}
