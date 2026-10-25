import React, { useSyncExternalStore } from 'react';
import { aero } from '../lib/audio';

export function SoundButton({ compact = false }) {
  const { sound } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  return (
    <button
      type="button"
      onClick={aero.toggleSound}
      aria-pressed={sound}
      aria-label={sound ? "Mute sound" : "Enable sound"}
      className={`label whitespace-nowrap inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-[9.5px] transition-all duration-500 ${
        sound
          ? "border-[color:var(--amber)]/60 text-[color:var(--ivory)] shadow-[0_0_30px_-10px_rgba(214,164,106,0.6)]"
          : "border-[color:var(--line)] text-[color:var(--mist)] hover:text-[color:var(--ivory)]"
      }`}
    >
      <span
        className={`eq flex h-3 items-end gap-[2px] ${sound ? "on text-[color:var(--amber)]" : ""}`}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
        <span />
      </span>
      {!compact && <span>{sound ? "Sound on" : "Sound off"}</span>}
    </button>
  );
}
