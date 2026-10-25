import React from 'react';
import { AeroLogo } from './AeroLogo';

const SECTIONS = [
  { id: "aircraft", label: "Aircraft" },
  { id: "charter", label: "Charter" },
  { id: "ownership", label: "Ownership" },
  { id: "contact", label: "Contact" }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleTopClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[color:var(--line)] bg-[color:var(--noir)]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr_auto] md:py-20 lg:px-16">
        {/* Brand & Slogan */}
        <div>
          <a href="#top" aria-label="Aero Noir — back to top" onClick={handleTopClick}>
            <AeroLogo size={20} />
          </a>
          <p className="font-display mt-6 max-w-[280px] text-[20px] font-light italic leading-snug text-[color:var(--ivory)]/80">
            The quiet above the storm.
          </p>
        </div>

        {/* Explore Links */}
        <nav aria-label="Footer">
          <p className="label mb-5 text-[9.5px] text-[color:var(--mist)]/70">Explore</p>
          <ul className="flex flex-col gap-3">
            {SECTIONS.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="text-[14px] font-light text-[color:var(--ivory)]/85 transition-colors hover:text-[color:var(--amber)]"
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Concierge Links */}
        <div>
          <p className="label mb-5 text-[9.5px] text-[color:var(--mist)]/70">Concierge</p>
          <ul className="flex flex-col gap-3 text-[14px] font-light text-[color:var(--ivory)]/85">
            <li>
              <a href="#contact" className="transition-colors hover:text-[color:var(--amber)]">
                Send a private request
              </a>
            </li>
            <li>
              <a
                href="mailto:concierge@aeronoir.com"
                className="transition-colors hover:text-[color:var(--amber)]"
              >
                concierge@aeronoir.com
              </a>
            </li>
            <li>
              <span className="text-[color:var(--mist)]/60 text-[12.5px]">
                Zurich · London · Dubai · Singapore
              </span>
            </li>
          </ul>
        </div>

        {/* Legal & Discreet Note */}
        <div className="flex flex-col justify-between md:text-right">
          <p className="max-w-[260px] text-[12px] font-light leading-relaxed text-[color:var(--mist)]/70">
            Aero Noir concept studies and bespoke flight arrangements. All flights operated by licensed direct air carriers.
          </p>
          <p className="mt-8 text-[11px] font-light text-[color:var(--mist)]/50">
            © {currentYear} Aero Noir. Confidential.
          </p>
        </div>
      </div>
    </footer>
  );
}
