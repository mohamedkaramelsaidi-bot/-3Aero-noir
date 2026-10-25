import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { aero } from '../lib/audio';

const OWNERSHIP_SLIDES = [
  {
    id: "cabin",
    tag: "Cabin craftsmanship",
    title: "A cabin finished by hand.",
    body: "Quilted leathers, smoked walnut and brushed brass, specified with you and built by the same small atelier from first sketch to delivery.",
    video: "/videos/cabin.mp4",
    poster: "/posters/cabin.jpg"
  },
  {
    id: "detail",
    tag: "Exterior detail",
    title: "Details that hold their line.",
    body: "Paint, brightwork and lighting chosen as carefully as the interior — an exterior that reads as yours from the ramp to cruise.",
    video: "/videos/detail.mp4",
    poster: "/posters/detail.jpg"
  },
  {
    id: "obsidian",
    tag: "Full ownership",
    title: "Your aircraft, exactly as specified.",
    body: "From configuration to registration, a single advisor guides acquisition, delivery and every decision after.",
    video: "/videos/obsidian.mp4",
    poster: "/posters/obsidian.jpg"
  },
  {
    id: "navy",
    tag: "Managed ownership",
    title: "Ownership without the overhead.",
    body: "Crew, maintenance, hangarage and scheduling are managed for you, with transparent reporting and nothing to chase.",
    video: "/videos/navy.mp4",
    poster: "/posters/navy.jpg"
  },
  {
    id: "silver",
    tag: "Design studies",
    title: "Contrasting forms, one standard.",
    body: "Explore each concept side by side — silhouette, finish and cabin — before you commit to the one that fits how you fly.",
    video: "/videos/silver.mp4",
    poster: "/posters/silver.jpg"
  },
  {
    id: "bronze",
    tag: "Shared ownership",
    title: "A share, held in confidence.",
    body: "Fractional arrangements sized to the hours you actually fly, with the same cabin standard and guaranteed availability.",
    video: "/videos/bronze.mp4",
    poster: "/posters/bronze.jpg"
  }
];

const TOTAL = OWNERSHIP_SLIDES.length;

function wrapIndex(idx, current) {
  let diff = (idx - current) % TOTAL;
  if (diff > TOTAL / 2) diff -= TOTAL;
  if (diff < -TOTAL / 2) diff += TOTAL;
  return diff;
}

function formatNum(n) {
  return String(n).padStart(2, "0");
}

function ArrowIcon({ dir }) {
  return (
    <svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      aria-hidden="true"
      style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}
    >
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function AutoVideo({ src, poster, playing = true }) {
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "300px"
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView && playing && !reduced && document.visibilityState === "visible") {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, playing, reduced]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}

// 3D Carousel Card
function CarouselCard({ index, k, mobile, reduced, slide, onSelect }) {
  const absK = Math.abs(k);
  const isCenter = k === 0;
  const isVisible = absK <= (mobile ? 1 : 2);

  const prevK = useRef(k);
  const wrapJump = Math.abs(prevK.current - k) > 2;
  prevK.current = k;

  const targetStyle = {
    x: `${k * (mobile ? 74 : 70)}%`,
    y: `${absK * absK * (mobile ? 3 : 4.5)}%`,
    z: -absK * (mobile ? 160 : 230),
    rotateY: -k * (mobile ? 20 : 24),
    rotateZ: k * 2.2,
    scale: isCenter ? 1 : 1 - absK * 0.1,
    opacity: isVisible ? 1 - absK * 0.18 : 0
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 aspect-[4/3] w-[min(52vw,660px)] max-md:w-[74vw]"
      style={{
        zIndex: 10 - absK,
        pointerEvents: isVisible ? "auto" : "none"
      }}
      initial={false}
      animate={targetStyle}
      transition={
        wrapJump
          ? { duration: 0 }
          : reduced
          ? { duration: 0.25 }
          : { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
      }
      transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
    >
      <button
        type="button"
        tabIndex={isVisible ? 0 : -1}
        aria-hidden={!isVisible}
        onClick={onSelect}
        aria-label={isCenter ? slide.tag : `Show ${slide.tag}`}
        aria-current={isCenter ? "true" : undefined}
        className="tilt-card relative block h-full w-full overflow-hidden rounded-[20px] bg-[color:var(--graphite)] cursor-pointer border-0"
      >
        <AutoVideo
          src={slide.video}
          poster={slide.poster}
          playing={absK <= 1}
        />
        <span
          className="absolute inset-0 bg-[#030405] transition-opacity duration-700"
          style={{ opacity: Math.min(0.7, absK * 0.38) }}
          aria-hidden="true"
        />
        <span className="card-sheen" aria-hidden="true" />
        <span className="label absolute left-4 top-4 text-[9px] text-[color:var(--ivory)]/80 sm:left-5 sm:top-5">
          {formatNum(index + 1)} — {slide.tag}
        </span>
      </button>
    </motion.div>
  );
}

export function Ownership() {
  const [current, setCurrent] = useState(0);
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const step = useCallback((dir) => {
    setCurrent((c) => (c + dir + TOTAL) % TOTAL);
    aero.transition();
  }, []);

  const selectSlide = useCallback((target) => {
    setCurrent((c) => {
      if (c !== target) aero.transition();
      return target;
    });
  }, []);

  // Gesture handling for pointer drag and arrow keys
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let startPoint = null;

    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse") {
        startPoint = { x: e.clientX, y: e.clientY, id: e.pointerId };
      }
    };

    const onPointerUp = (e) => {
      const p = startPoint;
      startPoint = null;
      if (!p || p.id !== e.pointerId) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        step(dx < 0 ? 1 : -1);
      }
    };

    const onPointerCancel = () => {
      startPoint = null;
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(e.key === "ArrowRight" ? 1 : -1);
      }
    };

    const section = el.closest("section") ?? el;
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    section.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      section.removeEventListener("keydown", onKeyDown);
    };
  }, [step]);

  const activeSlide = OWNERSHIP_SLIDES[current];

  return (
    <section
      id="ownership"
      aria-labelledby="ownership-title"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="section-haze" aria-hidden="true" />

      {/* Section Header */}
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-6 px-5 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-16">
        <div>
          <span className="label text-[color:var(--amber)]">Ownership</span>
          <h2
            id="ownership-title"
            className="font-display mt-5 text-[42px] font-light leading-[0.98] tracking-[-0.01em] sm:text-[58px] lg:text-[76px]"
          >
            An aircraft
            <em className="block font-light italic opacity-90">that is yours alone.</em>
          </h2>
        </div>

        <p className="max-w-[340px] text-[14px] font-light leading-relaxed text-[color:var(--mist)]">
          Whole, managed or shared — every path to ownership begins with the same conversation about how you fly.
        </p>
      </div>

      {/* 3D Perspective Carousel Container */}
      <div
        ref={carouselRef}
        aria-roledescription="carousel"
        aria-label="Ownership highlights — use the arrow keys or swipe to browse"
        className="relative mx-auto mt-14 h-[min(58vw,520px)] max-w-[1600px] [perspective:1600px] [touch-action:pan-y] max-md:h-[min(78vw,400px)] md:mt-20"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {OWNERSHIP_SLIDES.map((slide, idx) => {
            const k = wrapIndex(idx, current);
            return (
              <CarouselCard
                key={slide.id}
                index={idx}
                k={k}
                mobile={isMobile}
                reduced={reduced}
                slide={slide}
                onSelect={() => selectSlide(idx)}
              />
            );
          })}
        </div>
        <span className="sr-only" aria-live="polite">
          Slide {current + 1} of {TOTAL}: {activeSlide.tag}. {activeSlide.title}
        </span>
      </div>

      {/* Slide Narrative & Navigation Controls */}
      <div className="relative mx-auto mt-10 grid max-w-[1100px] gap-8 px-5 sm:px-10 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-h-[150px]">
          <p className="label text-[color:var(--amber)]">{activeSlide.tag}</p>
          <h3 className="font-display mt-3 text-[30px] font-light leading-[1.04] md:text-[42px]">
            {activeSlide.title}
          </h3>
          <p className="mt-3 max-w-[520px] text-[14px] font-light leading-relaxed text-[color:var(--mist)]">
            {activeSlide.body}
          </p>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="arrow-btn cursor-pointer bg-transparent"
              onClick={() => step(-1)}
              aria-label="Previous slide"
            >
              <ArrowIcon dir={-1} />
            </button>

            <span className="label w-[70px] text-center tabular-nums text-[color:var(--mist)]">
              <span className="text-[color:var(--ivory)]">{formatNum(current + 1)}</span>
              {" / "}
              {formatNum(TOTAL)}
            </span>

            <button
              type="button"
              className="arrow-btn cursor-pointer bg-transparent"
              onClick={() => step(1)}
              aria-label="Next slide"
            >
              <ArrowIcon dir={1} />
            </button>
          </div>

          <a
            href="#contact"
            className="btn-ghost label"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("aero:interest", { detail: "ownership" }));
            }}
          >
            <span className="dot" />
            Discuss Ownership
          </a>
        </div>
      </div>
    </section>
  );
}
