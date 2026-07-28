import { useEffect, useState } from 'react';

/**
 * Flip to true after LCP (or a short idle/timeout fallback).
 * Use to defer heavy work (Three.js, below-fold WebGL) off the critical path.
 */
export function useAfterLcp({ timeoutMs = 2500, idleTimeoutMs = 1800 } = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return undefined;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    let idleId = 0;
    let hardTimeoutId = 0;
    let po;

    try {
      if (typeof PerformanceObserver !== 'undefined') {
        po = new PerformanceObserver((list) => {
          if (list.getEntries().length) finish();
        });
        po.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    } catch {
      // unsupported
    }

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(finish, { timeout: idleTimeoutMs });
    } else {
      idleId = window.setTimeout(finish, Math.min(1200, idleTimeoutMs));
    }
    hardTimeoutId = window.setTimeout(finish, timeoutMs);

    return () => {
      done = true;
      if (po) po.disconnect();
      if (typeof window.cancelIdleCallback === 'function' && idleId) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      window.clearTimeout(hardTimeoutId);
    };
  }, [ready, timeoutMs, idleTimeoutMs]);

  return ready;
}
