import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollToSection } from '../hooks/useScrollToSection';
import HeroVisual from './HeroVisual';

const Hero = () => {
  const { t, isRtl } = useLanguage();
  const scrollToSection = useScrollToSection();

  const goToContact = (event) => {
    event.preventDefault();
    scrollToSection('contact');
    window.history.replaceState(null, '', '/#contact');
  };

  return (
    <section
      id="home"
      className="relative isolate flex items-center overflow-hidden bg-bg pb-20 pt-28 md:min-h-[88svh] md:pb-16 md:pt-28 lg:min-h-[82svh] lg:pb-20"
    >
      {/* Faint grid + accent glow — CSS only */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade bg-[size:56px_56px] opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgb(var(--c-accent) / 0.14), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="container-site relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="max-w-2xl">
            <p
              className={`font-display text-sm font-semibold text-accent ${
                isRtl ? 'tracking-normal' : 'uppercase tracking-[0.28em]'
              }`}
            >
              {t.hero.brand}
            </p>

            <h1
              className={`mt-3 font-display text-4xl font-bold sm:text-5xl md:mt-4 md:text-6xl ${
                isRtl
                  ? 'leading-[1.25] tracking-normal lg:text-[4rem]'
                  : 'leading-[1.02] tracking-tight lg:text-[3.25rem] xl:text-[3.6rem]'
              }`}
            >
              <span className="block text-ink">{t.hero.line1}</span>
              <span className="mt-1 block text-accent">{t.hero.line2}</span>
            </h1>

            <p
              className={`mt-5 max-w-xl text-base text-muted md:text-lg ${
                isRtl ? 'leading-8' : 'leading-relaxed'
              }`}
            >
              {t.hero.lead}
            </p>

            <a
              href="#contact"
              onClick={goToContact}
              className="btn-primary group mt-8 w-full !px-7 !py-4 text-base sm:w-auto"
            >
              {t.hero.cta}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
          </div>

          {/* Shown on every screen size; scaled down on phones */}
          <div className="mx-auto w-full max-w-md pb-6 lg:max-w-none lg:pb-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
