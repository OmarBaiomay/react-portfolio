import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollToSection } from '../hooks/useScrollToSection';
import HeroScene from './HeroScene';

const Hero = () => {
  const { t, lang, isRtl } = useLanguage();
  const scrollToSection = useScrollToSection();
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="kicker"]', { y: 24, opacity: 0, duration: 0.55 })
        .from('[data-hero="line1"]', { y: 40, opacity: 0, duration: 0.75 }, '-=0.2')
        .from('[data-hero="line2"]', { y: 40, opacity: 0, duration: 0.75 }, '-=0.5')
        .from('[data-hero="lead"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
        .from('[data-hero="cta"] > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: 'all' }, '-=0.3')
        .from('[data-hero="stat"]', { y: 16, opacity: 0, stagger: 0.07, duration: 0.5 }, '-=0.25');
    }, rootRef);
    return () => ctx.revert();
  }, [lang]);

  const stats = [
    { label: t.hero.years, value: '2+' },
    { label: t.hero.projects, value: '30+' },
    { label: t.hero.focus, value: 'B-Code' },
  ];

  const Arrow = isRtl ? ArrowUpRight : ArrowRight;

  const goTo = (id) => (event) => {
    event.preventDefault();
    scrollToSection(id);
    window.history.replaceState(null, '', `/#${id}`);
  };

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-bg pb-12 pt-[4.75rem] sm:pt-20 md:min-h-[88svh] md:items-center md:pb-16 md:pt-24 lg:min-h-[82svh] lg:pb-20"
    >
      <HeroScene />

      {/* Readability veil — softer on mobile so the 3D shape stays visible */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: isRtl
            ? 'linear-gradient(to left, rgb(var(--c-bg) / 0.72) 0%, rgb(var(--c-bg) / 0.45) 40%, rgb(var(--c-bg) / 0.15) 70%, transparent 100%), radial-gradient(ellipse at 50% 20%, rgb(var(--c-accent) / 0.16), transparent 55%)'
            : 'linear-gradient(to right, rgb(var(--c-bg) / 0.72) 0%, rgb(var(--c-bg) / 0.45) 40%, rgb(var(--c-bg) / 0.15) 70%, transparent 100%), radial-gradient(ellipse at 50% 20%, rgb(var(--c-accent) / 0.16), transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background: isRtl
            ? 'linear-gradient(to left, rgb(var(--c-bg) / 0.92) 0%, rgb(var(--c-bg) / 0.75) 34%, rgb(var(--c-bg) / 0.35) 58%, transparent 82%)'
            : 'linear-gradient(to right, rgb(var(--c-bg) / 0.92) 0%, rgb(var(--c-bg) / 0.75) 34%, rgb(var(--c-bg) / 0.35) 58%, transparent 82%)',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10 w-full">
        <div className="relative max-w-2xl lg:max-w-[38rem]">
          <div
            className="pointer-events-none absolute -inset-x-3 -inset-y-4 -z-10 rounded-3xl md:-inset-x-5 md:-inset-y-6"
            style={{
              background:
                'linear-gradient(180deg, rgb(var(--c-bg) / 0.35) 0%, rgb(var(--c-bg) / 0.18) 70%, transparent 100%)',
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
            className={`mt-3 text-4xl font-bold leading-[1.12] sm:text-5xl md:mt-4 md:text-6xl lg:text-[4.25rem] ${
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
            className={`mt-4 max-w-xl text-base leading-relaxed text-muted md:mt-5 md:text-lg ${
              isRtl ? 'leading-8' : ''
            }`}
          >
            {t.hero.lead}
          </p>

          <div data-hero="cta" className="relative z-20 mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              href="#contact"
              onClick={goTo('contact')}
              className="btn-primary group w-full !px-6 !py-3.5 text-base shadow-glow sm:w-auto"
            >
              {t.cta.start}
              <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
            <a
              href="#services"
              onClick={goTo('services')}
              className="btn-ghost w-full !px-6 !py-3.5 sm:w-auto"
            >
              {t.cta.explore}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 md:mt-9">
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
