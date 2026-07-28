import { useEffect, useState } from 'react';

/**
 * Gate heavy visuals until real user interaction.
 * No short idle timeout — Lighthouse would still pull Three/GSAP into TBT.
 */
export function useHeavyVisuals({ timeoutMs = 60000 } = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return undefined;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const onInteract = () => finish();
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    window.addEventListener('wheel', onInteract, { once: true, passive: true });
    window.addEventListener('touchstart', onInteract, { once: true, passive: true });
    window.addEventListener('pointerdown', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });

    // Very late fallback for users who never interact (accessibility / no-scroll pages).
    const hardId = window.setTimeout(finish, timeoutMs);

    return () => {
      done = true;
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('wheel', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.clearTimeout(hardId);
    };
  }, [ready, timeoutMs]);

  return ready;
}
