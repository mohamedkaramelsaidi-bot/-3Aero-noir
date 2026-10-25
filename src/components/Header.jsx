import React, { useState, useEffect } from 'react';
import { AeroLogo } from './AeroLogo';
import { SoundButton } from './SoundButton';

const SECTIONS = [
  { id: "aircraft", label: "Aircraft" },
  { id: "charter", label: "Charter" },
  { id: "ownership", label: "Ownership" },
  { id: "contact", label: "Contact" }
];

export function Header() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      ticking = false;
      setVisible(window.scrollY > window.innerHeight * 0.7);

      const probeY = window.innerHeight * 0.45;
      let current = null;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= probeY && rect.bottom > probeY) {
            current = sec.id;
          }
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(handleScroll);
      }
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-40 transition-all duration-700 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3.5 sm:px-10">
        <a href="#top" tabIndex={visible ? 0 : -1} aria-label="Aero Noir — back to top">
          <AeroLogo size={16} />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Sections">
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              tabIndex={visible ? 0 : -1}
              aria-current={activeSection === sec.id ? "true" : undefined}
              className={`label text-[9.5px] transition-colors duration-300 ${
                activeSection === sec.id
                  ? "text-[color:var(--ivory)]"
                  : "text-[color:var(--mist)] hover:text-[color:var(--ivory)]"
              }`}
            >
              {sec.label}
            </a>
          ))}
        </nav>

        <div className={visible ? "" : "invisible"}>
          <SoundButton compact={true} />
        </div>
      </div>
    </header>
  );
}
