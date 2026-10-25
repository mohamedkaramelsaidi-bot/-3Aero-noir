import React, { useRef, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { aero } from '../lib/audio';

const FLEET = [
  {
    id: "obsidian",
    name: "Noir Meridian",
    role: "Long-range flagship",
    line: "A darkened silhouette for crossings that begin after midnight.",
    body: "Our flagship concept: a swept, T-tailed long-range cabin in deep obsidian gloss. Quiet by design, configured around rest, work and arrival in that order.",
    finish: "Obsidian Black",
    swatch: "#0b0c0e",
    video: "/videos/obsidian.mp4",
    poster: "/posters/obsidian.jpg"
  },
  {
    id: "pearl",
    name: "Pearl Solenne",
    role: "Mid-size, everyday",
    line: "Soft light, short notice, effortless regional hops.",
    body: "A compact, rounded mid-size concept finished in lustrous pearl. Made for the trips that fill a working week — dependable, bright and immediately at ease.",
    finish: "Pearl White",
    swatch: "#e9e6df",
    video: "/videos/pearl.mp4",
    poster: "/posters/pearl.jpg"
  },
  {
    id: "silver",
    name: "Argent Vector",
    role: "High-speed concept",
    line: "Drawn for pace. A needle nose and a delta of brushed metal.",
    body: "Our most sculptural study: a long, sharp fuselage and blended delta wing in bare brushed silver. An exploration of what a faster private journey could feel like.",
    finish: "Brushed Silver",
    swatch: "#a9adb2",
    video: "/videos/silver.mp4",
    poster: "/posters/silver.jpg"
  },
  {
    id: "navy",
    name: "Marine Atlas",
    role: "Large-cabin, ultra-long range",
    line: "A home in the sky for the longest days of travel.",
    body: "A wide-body three-engine concept in deep navy with a pale silver pinstripe. Separate living, dining and sleeping zones for families and teams who travel together.",
    finish: "Deep Navy",
    swatch: "#18233a",
    video: "/videos/navy.mp4",
    poster: "/posters/navy.jpg"
  },
  {
    id: "bronze",
    name: "Aurum Cadence",
    role: "Light jet, owner-flown spirit",
    line: "Warm metal, a butterfly tail, and an easy sense of occasion.",
    body: "A light, nimble concept with a V-tail and engines carried over the fuselage, finished in champagne bronze. Intimate, agile and quietly celebratory.",
    finish: "Champagne Bronze",
    swatch: "#b8946a",
    video: "/videos/bronze.mp4",
    poster: "/posters/bronze.jpg"
  }
];

const FLEET_COUNT = FLEET.length;
const BORDER_LIMIT = 0.08;

function formatNum(n) {
  return String(n).padStart(2, "0");
}

// Video Player with IntersectionObserver & Visibility
function AutoVideo({ src, poster, playing = true, className = "", preloadMargin = "300px" }) {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const loadObs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShouldLoad(true),
      { rootMargin: preloadMargin }
    );
    const playObs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );

    loadObs.observe(el);
    playObs.observe(el);

    return () => {
      loadObs.disconnect();
      playObs.disconnect();
    };
  }, [preloadMargin]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    const canPlay = inView && playing && !reduced;
    const updatePlay = () => {
      if (canPlay && document.visibilityState === "visible") {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    };

    updatePlay();
    document.addEventListener("visibilitychange", updatePlay);
    return () => document.removeEventListener("visibilitychange", updatePlay);
  }, [shouldLoad, inView, playing, reduced]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      className={className}
      aria-hidden="true"
    />
  );
}

// Detail Dialog for Aircraft
function JetDialog({ jet, onClose }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;

    if (jet && !d.open) {
      triggerRef.current = document.activeElement;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!jet && d.open) {
      d.close();
    }
  }, [jet]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;

    const handleClose = () => {
      document.documentElement.style.overflow = "";
      triggerRef.current?.focus({ preventScroll: true });
      onClose();
    };

    const handleClick = (e) => {
      if (e.target === d) d.close();
    };

    d.addEventListener("close", handleClose);
    d.addEventListener("click", handleClick);
    return () => {
      d.removeEventListener("close", handleClose);
      d.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} aria-labelledby="jet-dialog-title" className="jet-dialog">
      {jet && (
        <div className="jet-dialog-panel grid md:grid-cols-[1.35fr_1fr]">
          <div className="relative aspect-[4/3] bg-[color:var(--graphite)] md:aspect-auto md:min-h-[440px]">
            <AutoVideo
              src={jet.video}
              poster={jet.poster}
              preloadMargin="0px"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <p className="label text-[color:var(--amber)]">{jet.role}</p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="label -mr-2 -mt-2 rounded-full border border-[color:var(--line)] px-3 py-2 text-[9px] text-[color:var(--mist)] hover:text-[color:var(--ivory)]"
                aria-label="Close details"
              >
                Close ✕
              </button>
            </div>

            <h3 id="jet-dialog-title" className="font-display text-[38px] font-light leading-[1] sm:text-[48px]">
              {jet.name}
            </h3>
            <p className="font-display text-[20px] font-light italic leading-snug text-[color:var(--ivory)]/85">
              {jet.line}
            </p>
            <p className="text-[14px] font-light leading-relaxed text-[color:var(--mist)]">
              {jet.body}
            </p>

            <p className="label flex items-center gap-3 text-[9.5px] text-[color:var(--mist)]">
              <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/25" style={{ background: jet.swatch }} />
              Finish — {jet.finish}
            </p>

            <p className="text-[11.5px] font-light leading-relaxed text-[color:var(--mist)]/70">
              Concept aircraft. Specifications are tailored with each client and confirmed on request.
            </p>

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <a
                href="#contact"
                className="btn-ghost label"
                onClick={(e) => {
                  window.dispatchEvent(new CustomEvent("aero:interest", { detail: "ownership" }));
                  dialogRef.current?.close();
                }}
              >
                <span className="dot" />
                Inquire on this concept
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

// Single Reel Card
function ReelCard({ jet, index, spring, step, active, near, onOpen, onFocusCard }) {
  const y = useTransform(spring, (v) => (index - v) * step);
  const scale = useTransform(spring, (v) => 1 - Math.min(Math.abs(index - v), 2) * 0.15);
  const darkOpacity = useTransform(spring, (v) => Math.min(Math.abs(index - v), 1.6) * 0.5);
  const opacity = useTransform(spring, (v) => 1 - Math.max(0, Math.abs(index - v) - 1.4) * 0.9);

  return (
    <motion.div
      className="absolute w-full max-md:w-[min(82vw,440px)]"
      style={{ y, scale, opacity, zIndex: active ? 5 : 1 }}
    >
      <button
        type="button"
        data-card
        onClick={() => onOpen(jet)}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) onFocusCard(index);
        }}
        aria-label={`${jet.name} — ${jet.role}. Open details`}
        className="tilt-card group relative block aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[color:var(--graphite)] text-left cursor-pointer border-0"
      >
        <AutoVideo
          src={jet.video}
          poster={jet.poster}
          playing={near}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.span
          className="absolute inset-0 bg-[#030405]"
          style={{ opacity: darkOpacity }}
          aria-hidden="true"
        />
        <span className="card-sheen" aria-hidden="true" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
          <span className="label text-[9.5px] text-[color:var(--ivory)]/85">
            {jet.name}
          </span>
          <span className="label text-[9px] text-[color:var(--ivory)]/60 transition-colors group-hover:text-[color:var(--amber)]">
            Details +
          </span>
        </span>
      </button>
    </motion.div>
  );
}

// Vertical Card Reel
function CardReel({ spring, active, onOpen, onFocusCard }) {
  const containerRef = useRef(null);
  const [stepHeight, setStepHeight] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const card = el.querySelector("[data-card]");
      if (card) setStepHeight(card.offsetHeight * 1.04);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
      {FLEET.map((jet, idx) => (
        <ReelCard
          key={jet.id}
          jet={jet}
          index={idx}
          spring={spring}
          step={stepHeight}
          active={idx === active}
          near={Math.abs(idx - active) <= 1}
          onOpen={onOpen}
          onFocusCard={onFocusCard}
        />
      ))}
      <div className="reel-fade" aria-hidden="true" />
    </div>
  );
}

export function Fleet() {
  const sectionRef = useRef(null);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const rawProgress = useTransform(
    scrollYProgress,
    [BORDER_LIMIT, 1 - BORDER_LIMIT],
    [0, FLEET_COUNT - 1],
    { clamp: true }
  );

  const springProgress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.7
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedJet, setSelectedJet] = useState(null);
  const lastIndex = useRef(0);

  useEffect(() => {
    return rawProgress.on("change", (latest) => {
      const idx = Math.round(latest);
      if (idx !== lastIndex.current) {
        lastIndex.current = idx;
        setActiveIndex(idx);
        aero.transition();
      }
    });
  }, [rawProgress]);

  const scrollToJet = useCallback((targetIndex) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const secTop = sec.getBoundingClientRect().top + window.scrollY;
    const scrollableH = sec.offsetHeight - window.innerHeight;
    const fraction = BORDER_LIMIT + (targetIndex / (FLEET_COUNT - 1)) * (1 - 2 * BORDER_LIMIT);
    window.scrollTo({
      top: secTop + scrollableH * fraction + 1,
      behavior: reduced ? "auto" : "smooth"
    });
  }, [reduced]);

  const activeJet = FLEET[activeIndex];
  const barWidth = useTransform(rawProgress, [0, FLEET_COUNT - 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      id="aircraft"
      aria-labelledby="aircraft-title"
      className="relative"
      style={{ height: `${FLEET_COUNT * 78 + 40}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="section-haze" aria-hidden="true" />

        <div className="relative mx-auto grid h-full max-w-[1500px] grid-rows-[auto_1fr_auto] px-5 pb-6 pt-20 sm:px-10 md:grid-cols-[1fr_minmax(300px,34vw)_1fr] md:grid-rows-1 md:gap-10 md:py-0 lg:px-16">
          {/* Left Column: Title & Selector */}
          <div className="relative z-10 flex flex-col md:justify-center">
            <span className="label text-[color:var(--amber)]">The Fleet</span>
            <h2
              id="aircraft-title"
              className="font-display mt-4 text-[40px] font-light leading-[0.98] tracking-[-0.01em] sm:text-[54px] lg:text-[76px]"
            >
              Five ways
              <em className="block font-light italic opacity-90">to rise.</em>
            </h2>

            <p className="mt-6 hidden max-w-[300px] text-[14px] font-light leading-relaxed text-[color:var(--mist)] md:block">
              Concept aircraft, each drawn around a different kind of journey. Scroll the reel or choose a number.
            </p>

            <ol className="mt-10 hidden flex-col gap-1 md:flex" aria-label="Choose aircraft">
              {FLEET.map((jet, idx) => (
                <li key={jet.id}>
                  <button
                    type="button"
                    onClick={() => scrollToJet(idx)}
                    aria-current={idx === activeIndex ? "true" : undefined}
                    className={`group flex items-center gap-4 py-1.5 transition-colors duration-500 cursor-pointer bg-transparent border-0 text-left ${
                      idx === activeIndex
                        ? "text-[color:var(--ivory)]"
                        : "text-[color:var(--mist)]/60 hover:text-[color:var(--ivory)]"
                    }`}
                  >
                    <span className="label w-6 text-left tabular-nums">{formatNum(idx + 1)}</span>
                    <span
                      className={`h-px transition-all duration-700 ${
                        idx === activeIndex
                          ? "w-12 bg-[color:var(--amber)]"
                          : "w-5 bg-current opacity-50 group-hover:w-8"
                      }`}
                    />
                    <span className="label text-[9.5px]">{jet.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Center Column: Animated Reel */}
          <div className="relative my-3 min-h-0 overflow-hidden [mask-image:linear-gradient(transparent,#000_14%,#000_86%,transparent)] md:my-0 md:overflow-visible md:[mask-image:none]">
            <CardReel
              spring={reduced ? rawProgress : springProgress}
              active={activeIndex}
              onOpen={setSelectedJet}
              onFocusCard={scrollToJet}
            />
          </div>

          {/* Right Column: Active Aircraft Details */}
          <div className="relative z-10 flex flex-col justify-end md:justify-center">
            <div aria-live="polite" className="min-h-[150px] md:min-h-[260px]">
              <div key={activeJet.id}>
                <p className="label flex items-baseline gap-3 text-[color:var(--mist)]">
                  <span className="font-display text-[30px] font-light tracking-normal text-[color:var(--ivory)] md:text-[44px]">
                    {formatNum(activeIndex + 1)}
                  </span>
                  <span>/ {formatNum(FLEET_COUNT)}</span>
                </p>

                <p className="label mt-3 text-[color:var(--amber)]">{activeJet.role}</p>
                <h3 className="font-display mt-2 text-[30px] font-light leading-[1.02] md:text-[44px]">
                  {activeJet.name}
                </h3>
                <p className="mt-3 max-w-[330px] text-[13.5px] font-light leading-relaxed text-[color:var(--mist)] md:text-[14.5px]">
                  {activeJet.line}
                </p>

                <p className="label mt-5 flex items-center gap-3 text-[9.5px] text-[color:var(--mist)]">
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-white/25"
                    style={{ background: activeJet.swatch }}
                  />
                  {activeJet.finish}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4 md:mt-8">
              <button
                type="button"
                className="btn-ghost label"
                onClick={() => setSelectedJet(activeJet)}
              >
                <span className="dot" />
                View details
              </button>
            </div>

            {/* Mobile Progress Bar */}
            <div className="mt-5 h-px w-full bg-[color:var(--line)] md:hidden" aria-hidden="true">
              <motion.div className="h-px bg-[color:var(--amber)]" style={{ width: barWidth }} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <JetDialog jet={selectedJet} onClose={() => setSelectedJet(null)} />
    </section>
  );
}
