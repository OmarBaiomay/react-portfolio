import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import HeroScene from './HeroScene';

const Hero = () => {
  const { t, lang, isRtl } = useLanguage();
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="kicker"]', { y: 24, opacity: 0, duration: 0.55 })
        .from('[data-hero="line1"]', { y: 40, opacity: 0, duration: 0.75 }, '-=0.2')
        .from('[data-hero="line2"]', { y: 40, opacity: 0, duration: 0.75 }, '-=0.5')
        .from('[data-hero="lead"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
        .from('[data-hero="cta"] > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.3')
        .from('[data-hero="stat"]', { y: 16, opacity: 0, stagger: 0.07, duration: 0.5 }, '-=0.25');
    }, rootRef);
    return () => ctx.revert();
  }, [lang]);

  const stats = [
    { label: t.hero.years, value: '2+' },
    { label: t.hero.projects, value: '30+' },
    { label: t.hero.focus, value: 'B-Code' },
  ];

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-bg pb-16 pt-28 md:items-center md:pb-24"
    >
      <HeroScene />

      {/* Readability veil — keep copy clear of the 3D scene */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isRtl
            ? 'linear-gradient(to left, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0.97) 42%, rgb(var(--c-bg) / 0.72) 58%, rgb(var(--c-bg) / 0.2) 78%, transparent 100%), radial-gradient(ellipse at 18% 42%, rgb(var(--c-accent) / 0.1), transparent 48%)'
            : 'linear-gradient(to right, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0.97) 42%, rgb(var(--c-bg) / 0.72) 58%, rgb(var(--c-bg) / 0.2) 78%, transparent 100%), radial-gradient(ellipse at 82% 42%, rgb(var(--c-accent) / 0.1), transparent 48%)',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10 w-full">
        <div className="relative max-w-xl lg:max-w-[34rem]">
          {/* Soft plate behind Arabic/English copy so wireframes never win */}
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 rounded-3xl md:-inset-x-6 md:-inset-y-8"
            style={{
              background:
                'linear-gradient(180deg, rgb(var(--c-bg) / 0.55) 0%, rgb(var(--c-bg) / 0.25) 70%, transparent 100%)',
              backdropFilter: 'blur(2px)',
            }}
            aria-hidden="true"
          />
          <p
            data-hero="kicker"
            className={`text-sm font-semibold text-accent ${
              isRtl
                ? 'font-sans tracking-normal'
                : 'font-display uppercase tracking-[0.28em]'
            }`}
          >
            {t.hero.brand}
          </p>

          <h1
            className={`mt-4 text-4xl font-bold leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl ${
              isRtl ? 'font-sans tracking-normal' : 'font-display tracking-tight leading-[0.95]'
            }`}
          >
            <span data-hero="line1" className="block text-ink">
              {t.hero.line1}
            </span>
            <span data-hero="line2" className="mt-1 block text-accent">
              {t.hero.line2}
            </span>
          </h1>

          <p
            data-hero="lead"
            className={`mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg ${
              isRtl ? 'leading-8' : ''
            }`}
          >
            {t.hero.lead}
          </p>

          <div data-hero="cta" className="mt-9 flex flex-wrap gap-3">
            <a href="/#contact" className="btn-primary">
              {t.cta.start}
            </a>
            <a href="/#services" className="btn-ghost">
              {t.cta.explore}
            </a>
          </div>

          <div className="mt-11 flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="glass min-w-[7.5rem] rounded-xl px-4 py-3 sm:min-w-[8.5rem]"
              >
                <p
                  className={`text-xl font-semibold text-ink ${
                    isRtl ? 'font-sans' : 'font-display'
                  }`}
                >
                  {stat.value}
                </p>
                <p className={`mt-0.5 text-xs text-muted ${isRtl ? 'leading-5' : ''}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
