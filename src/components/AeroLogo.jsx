import React from 'react';

export function AeroLogo({ size = 19 }) {
  return (
    <span className="flex items-center gap-3">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 14.5 22 9l-7.5 4.2L12 20l-2.2-5.1L2 14.5Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-display font-normal tracking-[0.28em] whitespace-nowrap"
        style={{ fontSize: size }}
      >
        AERO NOIR
      </span>
    </span>
  );
}
