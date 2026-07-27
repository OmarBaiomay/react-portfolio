import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Refresh GSAP scroll reveals whenever language / theme changes.
 */
export function usePageAnimations(deps = []) {
  useGSAP(
    () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());

      gsap.utils.toArray('[data-animate="fade-up"]').forEach((el, i) => {
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
    },
    { dependencies: deps }
  );
}
