import { useEffect } from 'react';

const animated = new WeakSet();

async function loadGsap() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

function bindPageAnimations(gsap, ScrollTrigger) {
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
    if (animated.has(el)) return;
    animated.add(el);
    gsap.fromTo(
      el,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        delay: Number(el.dataset.delay || 0) * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.utils.toArray('[data-animate="stagger"]').forEach((group) => {
    if (animated.has(group)) return;
    animated.add(group);
    const children = group.querySelectorAll('[data-animate-child]');
    gsap.fromTo(
      children,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  gsap.utils.toArray('[data-animate="scale-in"]').forEach((el) => {
    if (animated.has(el)) return;
    animated.add(el);
    gsap.fromTo(
      el,
      { scale: 0.92, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/**
 * Scroll reveals — GSAP loads only after the user scrolls/clicks.
 */
export function usePageAnimations(deps = []) {
  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let mo;
    let gsapApi = null;

    const bind = () => {
      if (!gsapApi || cancelled) return;
      bindPageAnimations(gsapApi.gsap, gsapApi.ScrollTrigger);
    };

    const start = async () => {
      if (cancelled || gsapApi) return;
      try {
        gsapApi = await loadGsap();
      } catch {
        return;
      }
      if (cancelled) return;
      bind();

      const schedule = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(bind, 80);
      };
      const root = document.getElementById('root') || document.body;
      mo = new MutationObserver(schedule);
      mo.observe(root, { childList: true, subtree: true });
    };

    const onInteract = () => {
      start();
    };
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    window.addEventListener('wheel', onInteract, { once: true, passive: true });
    window.addEventListener('pointerdown', onInteract, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('wheel', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      mo?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
