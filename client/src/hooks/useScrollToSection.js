import { useCallback } from 'react';

const HEADER_OFFSET = -80;
const MAX_ATTEMPTS = 40;

function getLenis() {
  return typeof window !== 'undefined' ? window.__bcodeLenis || null : null;
}

function findSection(id) {
  return document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
}

function scrollToEl(el, lenis) {
  const smooth = lenis || getLenis();
  if (smooth) {
    smooth.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.15 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Smooth-scroll to a section id. Works with Lenis (native scrollIntoView does not).
 * Wakes LazyMount sections that are not in the DOM yet.
 */
export function useScrollToSection() {
  return useCallback((id) => {
    scrollToSectionId(id, getLenis());
  }, []);
}

export function scrollToSectionId(id, lenis) {
  if (!id || typeof document === 'undefined') return;

  window.dispatchEvent(new CustomEvent('bcode:goto-section', { detail: { id } }));

  let done = false;

  const attempt = (n) => {
    if (done) return;
    const el = findSection(id);
    if (el) {
      done = true;
      scrollToEl(el, lenis);
      // One quiet re-align after a lazy section paints (height can change).
      window.setTimeout(() => {
        const again = findSection(id);
        if (again) scrollToEl(again, lenis);
      }, 280);
      return;
    }
    if (n < MAX_ATTEMPTS) {
      window.requestAnimationFrame(() => attempt(n + 1));
    }
  };

  attempt(0);
}
