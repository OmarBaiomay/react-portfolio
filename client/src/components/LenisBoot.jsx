import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Starts Lenis on the document without wrapping/remounting the React tree.
 * Exposes the instance as window.__bcodeLenis for scroll helpers.
 */
export default function LenisBoot() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
    });
    window.__bcodeLenis = lenis;

    return () => {
      lenis.destroy();
      if (window.__bcodeLenis === lenis) window.__bcodeLenis = null;
    };
  }, []);

  return null;
}
