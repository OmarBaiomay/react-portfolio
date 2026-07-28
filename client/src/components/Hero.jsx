import { Suspense, lazy } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { useHeavyVisuals } from '../hooks/useHeavyVisuals';

const HeroScene = lazy(() => import('./HeroScene'));

function DeferredHeroScene() {
  const ready = useHeavyVisuals({ timeoutMs: 60000 });
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}

const Hero = () => {
  const { t, isRtl } = useLanguage();
  const scrollToSection = useScrollToSection();

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
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-bg pb-12 pt-[4.75rem] sm:pt-20 md:min-h-[88svh] md:items-center md:pb-16 md:pt-24 lg:min-h-[82svh] lg:pb-20"
    >
      <DeferredHeroScene />

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
        {/* No absolute inset backdrop here — it was the CLS culprit when fonts resized the parent. */}
        <div className="relative max-w-2xl lg:max-w-[38rem]">
          <p
            className={`font-display text-sm font-semibold text-accent ${
              isRtl ? 'tracking-normal' : 'uppercase tracking-[0.28em]'
            }`}
          >
            {t.hero.brand}
          </p>

          <h1
            className={`mt-3 font-display text-4xl font-bold leading-[1.12] sm:text-5xl md:mt-4 md:text-6xl lg:text-[4.25rem] ${
              isRtl ? 'tracking-normal' : 'tracking-tight leading-[0.95]'
            }`}
          >
            <span className="block min-h-[1.12em] text-ink">{t.hero.line1}</span>
            <span className="mt-1 block min-h-[1.12em] text-accent">{t.hero.line2}</span>
          </h1>

          <p
            className={`mt-4 max-w-xl text-base leading-relaxed text-muted md:mt-5 md:min-h-[3.5rem] md:text-lg ${
              isRtl ? 'leading-8' : ''
            }`}
          >
            {t.hero.lead}
          </p>

          <div className="relative z-20 mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap">
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
                className="glass min-w-[7.5rem] rounded-xl px-4 py-3 sm:min-w-[8.5rem]"
              >
                <p className="font-display text-xl font-semibold text-ink">{stat.value}</p>
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
