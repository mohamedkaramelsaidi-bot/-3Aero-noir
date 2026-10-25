import React, { useEffect, useSyncExternalStore } from 'react';
import { aero } from './lib/audio';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Fleet } from './components/Fleet';
import { Charter } from './components/Charter';
import { Ownership } from './components/Ownership';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  const { reduced } = useSyncExternalStore(aero.subscribe, aero.get, aero.get);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Fleet />
        <Charter />
        <Ownership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
