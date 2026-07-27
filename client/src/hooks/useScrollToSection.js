import { useCallback } from 'react';
import { useLenis } from 'lenis/react';

const HEADER_OFFSET = -80;

/**
 * Smooth-scroll to a section id. Works with Lenis (native scrollIntoView does not).
 */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      if (lenis) {
        lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.15 });
        return;
      }

      const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [lenis]
  );
}

export function scrollToSectionId(id, lenis) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.15 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}
